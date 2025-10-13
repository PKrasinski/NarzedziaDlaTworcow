import type { AnyAIGenerationDone } from "../events/ai-generation-done";
import type { AnyAIRequestedToolExecution } from "../events/ai-requested-tool-execution";
import type { AnyMessageGenerated } from "../events/message-generated";
import { streamManager } from "../utils/stream-manager";
import type { ArcTool } from "../utils/tool";

export interface AIResponseHandlerConfig<
  Tools extends ArcTool<any, any, any, any>[]
> {
  tools: Tools;
  aiRequestedToolExecution: AnyAIRequestedToolExecution;
  messageGenerated: AnyMessageGenerated;
  aiGenerationDone: AnyAIGenerationDone;
}

export class AIResponseHandler<Tools extends ArcTool<any, any, any, any>[]> {
  constructor(private config: AIResponseHandlerConfig<Tools>) {}

  async handleResponse(
    ctx: any,
    response: any,
    params: {
      chatId: string;
      messageId: string;
      executionCount: number;
    }
  ): Promise<void> {
    const { chatId, messageId, executionCount } = params;
    let hasToolCalls = false;
    let responseId = "";
    let accumulatedText = "";

    try {
      // Handle streaming response only
      if (!response || typeof response[Symbol.asyncIterator] !== "function") {
        throw new Error("Response is not an async iterable");
      }

      for await (const chunk of response) {
        if (chunk.id && !responseId) {
          responseId = chunk.id;
        }

        // Handle new streaming format with delta
        if (chunk.type === "response.output_text.delta") {
          if (chunk.delta) {
            // Stream the chunk immediately
            streamManager.sendChunk(messageId, chunk.delta);
            
            // Accumulate text for batch emission
            accumulatedText += chunk.delta;
          }
        } else if (chunk.type === "response.completed") {
          responseId = chunk.response.id;

          // First: Save any accumulated text if we have it
          if (accumulatedText.trim()) {
            await ctx.get(this.config.messageGenerated).emit({
              chatId,
              messageId,
              messageParts: [
                {
                  type: "text",
                  value: accumulatedText,
                },
              ],
              openaiResponseId: responseId,
            });
          }

          // Then: Handle tool calls if present
          const toolCalls = chunk.response.output
            .filter((output: any) => output.type === "function_call")
            .map((output: any) => {
              let parsedArguments: any;
              let error: string | undefined;

              try {
                parsedArguments = JSON.parse(output.arguments);
              } catch (jsonError) {
                console.error("Error parsing arguments:", jsonError);
                parsedArguments = {}; // Empty object for failed parsing
                error = "JSON_PARSING";
              }

              return {
                toolName: output.name,
                params: parsedArguments,
                callId: output.call_id,
                ...(error && { error }),
              };
            });

          if (toolCalls.length > 0) {
            hasToolCalls = true;
            await ctx.get(this.config.aiRequestedToolExecution).emit({
              chatId,
              messageId,
              toolCalls,
              executionCount,
              openaiResponseId: responseId,
            });
          }
        }
      }
      
      // Always emit generation done when we finish processing the response
      // If we have tool calls, the tool execution will continue the conversation
      // If we don't have tool calls, this completes the message generation
      if (!hasToolCalls) {
        await ctx.get(this.config.aiGenerationDone).emit({
          chatId,
          messageId,
          openaiResponseId: responseId,
        });
      }
    } catch (error) {
      console.error("Error in AIResponseHandler:", error);
      streamManager.sendChunk(
        messageId,
        `[Błąd podczas przetwarzania odpowiedzi: ${error.message}]`
      );
      throw error;
    }
  }

}
