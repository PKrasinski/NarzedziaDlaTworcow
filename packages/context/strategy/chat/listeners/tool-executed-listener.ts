import { ArcIdAny, listener } from "@arcote.tech/arc";
import { OpenAIClientSingleton } from "../../../utils/openai-client";
import type { AnyAIGenerationDone } from "../events/ai-generation-done";
import type { AnyMessageGenerated } from "../events/message-generated";
import type { AnyMessageGenerationFailed } from "../events/message-generation-failed";
import type { AnyToolExecuted } from "../events/tool-executed";
import {
  AnyInstructionBuilder,
  getInstructionCommand,
} from "../get-instruction-command";
import { AIResponseHandler } from "../handlers/ai-response-handler";
import type { ArcTool } from "../utils/tool";

export type ToolExecutedListenerConfig<
  Name extends string,
  Tools extends ArcTool<any, any, any, any>[]
> = {
  chatId: ArcIdAny;
  toolExecuted: AnyToolExecuted;
  aiRequestedToolExecution: any;
  messageGenerated: AnyMessageGenerated;
  messageGenerationFailed: AnyMessageGenerationFailed;
  aiGenerationDone: AnyAIGenerationDone;
  name: Name;
  instructions: string | AnyInstructionBuilder;
  toolsJsonSchema: any[];
  tools: Tools;
  toolElements: any[];
  maxExecutionCount: number;
};

export function createToolExecutedListener<
  Name extends string,
  Tools extends ArcTool<any, any, any, any>[]
>(config: ToolExecutedListenerConfig<Name, Tools>) {
  const instructionCommand =
    typeof config.instructions === "function"
      ? config.instructions(
          getInstructionCommand({
            chatId: config.chatId,
          })
        )
      : null;

  const aiResponseHandler = new AIResponseHandler({
    tools: config.tools,
    aiRequestedToolExecution: config.aiRequestedToolExecution,
    messageGenerated: config.messageGenerated,
    aiGenerationDone: config.aiGenerationDone,
  });

  return listener(`${config.name}ToolExecutedListener`)
    .use([
      config.toolExecuted,
      config.aiRequestedToolExecution,
      config.messageGenerated,
      config.messageGenerationFailed,
      config.aiGenerationDone,
      ...config.toolElements,
      ...(instructionCommand ? instructionCommand.getUsedElements() : []),
    ])
    .listenTo([config.toolExecuted])
    .async()
    .handle(async (ctx, event) => {
      try {
        const {
          chatId,
          messageId,
          toolResults,
          executionCount,
          openaiResponseId,
        } = event.payload;

        const functionCallInputs = toolResults.map((toolResult) => ({
          type: "function_call_output",
          call_id: toolResult.callId,
          output: JSON.stringify(toolResult.result),
        }));

        const openai = OpenAIClientSingleton.getInstance();

        const instructions = instructionCommand
          ? (
              await instructionCommand.commandClient(ctx)({
                chatId,
              })
            ).instruction
          : (config.instructions as string);

        const tools =
          executionCount >= config.maxExecutionCount
            ? undefined
            : (config.toolsJsonSchema as any);

        const response = await openai.responses.create({
          model: "gpt-4.1",
          instructions: instructions,
          input: functionCallInputs as any,
          tools,
          previous_response_id: openaiResponseId,
          stream: true,
        });

        await aiResponseHandler.handleResponse(ctx, response, {
          chatId,
          messageId,
          executionCount: executionCount + 1,
        });
      } catch (error) {
        console.error("Error in tool executed listener:", error);

        await ctx.get(config.messageGenerationFailed).emit({
          chatId: event.payload.chatId,
          messageId: event.payload.messageId,
          errorMessage: "Wystąpił błąd podczas przetwarzania wyniku narzędzia.",
        });
      }
    });
}
