import {
  type $type,
  any,
  ArcId,
  type ArcIdAny,
  array,
  date,
  object,
  or,
  string,
  stringEnum,
  view,
} from "@arcote.tech/arc";
import { userId } from "../../../auth";
import type { AnyAgentResponseRequested } from "../events/agent-response-requested";
import type { AnyAIGenerationDone } from "../events/ai-generation-done";
import type { AnyMessageGenerated } from "../events/message-generated";
import type { AnyMessageGenerationFailed } from "../events/message-generation-failed";
import type { AnyMessageSended } from "../events/message-sended";
import type { AnyToolExecuted } from "../events/tool-executed";
import type { ArcTool } from "../utils/tool";

export type ToolsResponses<Tools extends ArcTool<any, any, any, any>[]> = {
  [Tool in Tools[number] as Tool["name"]]: {
    type: "tool";
    name: Tool["name"];
    params: $type<Exclude<Tool["_params"], undefined>>;
    result: $type<Exclude<Tool["_results"], undefined>[number]>;
  };
}[Tools[number]["name"]];

export type MessagesViewConfig<
  Name extends string,
  IdentifyiedBy extends ArcIdAny,
  Tools extends ArcTool<any, any, any, any>[]
> = {
  name: Name;
  messageId: ArcId<any>;
  identifyiedBy: IdentifyiedBy;
  messageGenerated: AnyMessageGenerated;
  messageSended: AnyMessageSended;
  agentResponseRequested: AnyAgentResponseRequested;
  toolExecuted: AnyToolExecuted;
  messageGenerationFailed: AnyMessageGenerationFailed;
  aiGenerationDone: AnyAIGenerationDone;
};

/**
 * Create a generic messages view for chat functionality
 */
export function createMessagesView<
  Name extends string,
  IdentifyiedBy extends ArcIdAny,
  Tools extends ArcTool<any, any, any, any>[]
>(config: MessagesViewConfig<Name, IdentifyiedBy, Tools>) {
  return view(
    `${config.name}Messages`,
    config.messageId,
    object({
      chatId: config.identifyiedBy,
      author: or(
        object({
          type: stringEnum("assistant"),
          openaiResponseId: string().optional(),
        }),
        object({
          type: stringEnum("user"),
          userId,
        })
      ),
      parts: array(
        any<
          | ToolsResponses<Tools>
          | {
              type: "text";
              value: string;
            }
        >()
      ),
      generation: object({
        streamUrl: string(),
        status: stringEnum("generating", "completed", "failed"),
      }).optional(),
      createdAt: date(),
    })
  )
    .handleEvent(config.messageGenerated, async (ctx, event) => {
      const message = await ctx.findOne({ _id: event.payload.messageId });
      await ctx.modify(event.payload.messageId, {
        parts: [
          ...(message?.parts || []),
          ...(event.payload.messageParts || []),
        ],
        author: {
          type: "assistant",
          openaiResponseId: event.payload.openaiResponseId,
        },
      });
    })
    .handleEvent(config.messageSended, async (ctx, event) => {
      await ctx.set(event.payload.messageId, {
        chatId: event.payload.chatId as any,
        author: {
          type: "user",
          userId: event.payload.userId,
        },
        parts: event.payload.parts,
        generation: null, // User messages don't have generation
        createdAt: event.createdAt,
      });
    })
    .handleEvent(config.agentResponseRequested, async (ctx, event) => {
      await ctx.set(event.payload.messageId, {
        chatId: event.payload.chatId as any,
        parts: [], // Empty parts initially
        author: {
          type: "assistant",
          openaiResponseId: null,
        },
        generation: {
          streamUrl: event.payload.streamUrl,
          status: "generating",
        },
        createdAt: event.createdAt,
      });
    })
    .handleEvent(config.toolExecuted, async (ctx, event) => {
      const message = await ctx.findOne({ _id: event.payload.messageId });

      // Create tool parts from successful tool results only (filter out errors)
      const toolParts = event.payload.toolResults
        .filter(
          (toolResult) =>
            !("error" in toolResult.result && toolResult.result.error)
        ) // Only include successful results
        .map((toolResult) => ({
          type: "tool",
          name: toolResult.toolName,
          params: toolResult.params,
          result: toolResult.result,
        }));

      // Only update the message if there are successful tool parts
      if (toolParts.length > 0) {
        await ctx.modify(event.payload.messageId, {
          parts: [...(message?.parts || []), ...toolParts] as any,
          author: {
            type: "assistant",
            openaiResponseId: event.payload.openaiResponseId,
          },
        });
      }
    })
    .handleEvent(config.messageGenerationFailed, async (ctx, event) => {
      await ctx.modify(event.payload.messageId as any, { generation: null });
    })
    .handleEvent(config.aiGenerationDone, async (ctx, event) => {
      await ctx.modify(event.payload.messageId, {
        generation: null,
      });
    });
}
