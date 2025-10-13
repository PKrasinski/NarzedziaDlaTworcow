import { ArcIdAny, listener } from "@arcote.tech/arc";
import { OpenAIClientSingleton } from "../../../utils/openai-client";
import type { AnyAgentResponseRequested } from "../events/agent-response-requested";
import type { AnyAIGenerationDone } from "../events/ai-generation-done";
import type { AnyAIRequestedToolExecution } from "../events/ai-requested-tool-execution";
import type { AnyMessageGenerated } from "../events/message-generated";
import type { AnyMessageGenerationFailed } from "../events/message-generation-failed";
import {
  AnyInstructionBuilder,
  getInstructionCommand,
} from "../get-instruction-command";
import { AIResponseHandler } from "../handlers/ai-response-handler";
import type { ArcTool } from "../utils/tool";

export type AgentListenerConfig<
  Name extends string,
  Tools extends ArcTool<any, any, any, any>[]
> = {
  chatId: ArcIdAny;
  agentResponseRequested: AnyAgentResponseRequested;
  aiRequestedToolExecution: AnyAIRequestedToolExecution;
  messageGenerated: AnyMessageGenerated;
  messageGenerationFailed: AnyMessageGenerationFailed;
  aiGenerationDone: AnyAIGenerationDone;
  messagesView: any;
  name: Name;
  instructions: string | AnyInstructionBuilder;
  toolsJsonSchema: any[];
  tools: Tools;
  toolElements: any[];
};

export function createAgentListener<
  Name extends string,
  Tools extends ArcTool<any, any, any, any>[]
>(config: AgentListenerConfig<Name, Tools>) {
  const instructionCommand =
    typeof config.instructions === "function"
      ? config.instructions(
          getInstructionCommand({
            chatId: config.chatId,
          })
        )
      : null;

  // Create AI response handler
  const aiResponseHandler = new AIResponseHandler({
    tools: config.tools,
    aiRequestedToolExecution: config.aiRequestedToolExecution,
    messageGenerated: config.messageGenerated,
    aiGenerationDone: config.aiGenerationDone,
  });

  return listener(`${config.name}AgentListener`)
    .use([
      config.agentResponseRequested,
      config.aiRequestedToolExecution,
      config.messageGenerated,
      config.messageGenerationFailed,
      config.aiGenerationDone,
      config.messagesView,
      ...config.toolElements,
      ...(instructionCommand ? instructionCommand.getUsedElements() : []),
    ])
    .listenTo([config.agentResponseRequested])
    .async()
    .handle(async (ctx, event) => {
      try {
        const { chatId, parts, messageId, previousResponseId, enabledTools } =
          event.payload;

        // Extract text from parts for OpenAI input
        const textParts = parts.filter((part: any) => part.type === "text");
        const message = textParts.map((part: any) => part.value).join(" ");

        // Get previous OpenAI response ID if needed
        let previousOpenAIResponseId: string | undefined;
        if (previousResponseId) {
          const previousMessage = await ctx.get(config.messagesView).findOne({
            _id: previousResponseId,
          });
          if (previousMessage?.author.type === "assistant") {
            previousOpenAIResponseId = previousMessage.author.openaiResponseId;
          }
        }

        // Get instructions
        const instructions = instructionCommand
          ? (
              await instructionCommand.commandClient(ctx)({
                chatId,
              })
            ).instruction
          : (config.instructions as string);

        // Make OpenAI API call
        const openai = OpenAIClientSingleton.getInstance();

        // Prepare tools array - combine Arc tools with web search if enabled
        const arcTools = config.toolsJsonSchema as any;
        const webSearchTools = enabledTools?.includes("web_search")
          ? [{ type: "web_search_preview" }]
          : [];
        const allTools = [...arcTools, ...webSearchTools];

        const response = await openai.responses.create({
          model: "gpt-4.1",
          instructions,
          input: message,
          tools: allTools.length > 0 ? allTools : undefined,
          previous_response_id: previousOpenAIResponseId,
          stream: true,
        });

        // Pass response to AI response handler with execution count 1
        await aiResponseHandler.handleResponse(ctx, response, {
          chatId,
          messageId,
          executionCount: 1,
        });
      } catch (error) {
        console.error("Error in agent listener:", error);

        let errorMessage =
          "Przepraszam, wystąpił błąd podczas generowania odpowiedzi.";

        if (error instanceof Error) {
          if (error.message.includes("JSON")) {
            errorMessage =
              "Przepraszam, wystąpił błąd w przetwarzaniu danych. Spróbuj ponownie.";
          } else if (error.message.includes("timeout")) {
            errorMessage =
              "Przepraszam, przekroczono limit czasu odpowiedzi. Spróbuj ponownie.";
          } else if (error.message.includes("rate limit")) {
            errorMessage =
              "Przepraszam, osiągnięto limit zapytań. Spróbuj ponownie za chwilę.";
          }
        }

        await ctx.get(config.messageGenerationFailed).emit({
          chatId: event.payload.chatId,
          messageId: event.payload.messageId,
          errorMessage,
        });
      }
    });
}
