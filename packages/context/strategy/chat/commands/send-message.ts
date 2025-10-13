import {
  any,
  type ArcIdAny,
  array,
  boolean,
  command,
  string,
  stringEnum,
} from "@arcote.tech/arc";
import { ToolsResponses } from "../events/message-generated";
import type { AnyMessageSended } from "../events/message-sended";
import type { ArcTool } from "../utils/tool";

export const capitalize = <String extends string>(str: String) =>
  (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<String>;

export type SendMessageData<
  Name extends string,
  IdentifyiedBy extends ArcIdAny,
  Tools extends ArcTool<any, any, any, any>[]
> = {
  name: Name;
  identifyiedBy: IdentifyiedBy;
  messageId: any;
  messageSended: AnyMessageSended;
  tools: Tools;
};

export const sendMessage = <const Data extends SendMessageData<any, any, any>>(
  data: Data
) =>
  command(`send${capitalize(data.name as Data["name"])}Message`)
    .withParams({
      chatId: data.identifyiedBy,
      parts: array(
        any<
          | ToolsResponses<Data["tools"]>
          | {
              type: "text";
              value: string;
            }
        >()
      ),
      previousResponseId: data.messageId.optional(),
      skipAiResponse: boolean().optional(),
      enabledTools: array(stringEnum("web_search")).optional(),
    })
    .withResult(
      {
        error: stringEnum("UNAUTHORIZED"),
      },
      {
        success: boolean(),
        responseId: string(),
        streamUrl: string(),
      }
    )
    .handle(
      ONLY_SERVER &&
        (async (
          ctx,
          { chatId, parts, previousResponseId, skipAiResponse, enabledTools }
        ) => {
          // if (!auth(ctx.$auth, chatId)) {
          //   console.log("UNAUTHORIZED");
          //   return { error: "UNAUTHORIZED" };
          // }
          const id = data.messageId.generate();

          await ctx.get(data.messageSended).emit({
            chatId,
            parts,
            userId: ctx.$auth.userId as any,
            messageId: id,
            previousResponseId,
            skipAiResponse,
            enabledTools,
          });

          // Generate streaming URL with full domain
          const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";
          const streamUrl = `${baseUrl}/chat/${data.name}/stream/${id}`;

          return { success: true, responseId: id, streamUrl } as const;
        })
    );

export type SendMessage<
  Data extends SendMessageData<any, any, any> = SendMessageData<any, any, any>
> = ReturnType<typeof sendMessage<Data>>;
