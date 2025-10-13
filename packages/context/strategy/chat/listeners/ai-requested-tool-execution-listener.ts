import { ArcIdAny, listener } from "@arcote.tech/arc";
import type { AnyAIRequestedToolExecution } from "../events/ai-requested-tool-execution";
import type { AnyToolExecuted } from "../events/tool-executed";
import { streamManager } from "../utils/stream-manager";
import type { ArcTool } from "../utils/tool";

export type AIRequestedToolExecutionListenerConfig<
  Name extends string,
  Tools extends ArcTool<any, any, any, any>[]
> = {
  chatId: ArcIdAny;
  aiRequestedToolExecution: AnyAIRequestedToolExecution;
  toolExecuted: AnyToolExecuted;
  name: Name;
  tools: Tools;
  toolElements: any[];
  maxExecutionCount: number;
};

export function createAIRequestedToolExecutionListener<
  Name extends string,
  Tools extends ArcTool<any, any, any, any>[]
>(config: AIRequestedToolExecutionListenerConfig<Name, Tools>) {
  return listener(`${config.name}AIRequestedToolExecutionListener`)
    .use([
      config.aiRequestedToolExecution,
      config.toolExecuted,
      ...config.toolElements,
    ])
    .listenTo([config.aiRequestedToolExecution])
    .async()
    .handle(async (ctx, event) => {
      const { chatId, messageId, toolCalls, executionCount, openaiResponseId } =
        event.payload;

      if (executionCount >= config.maxExecutionCount) {
        const errorResults = toolCalls.map((toolCall: any) => ({
          toolName: toolCall.toolName,
          params: toolCall.params,
          result: {
            error: "EXECUTION_LIMIT_REACHED",
            message: `Maximum tool execution limit reached (${config.maxExecutionCount} per message)`,
            details: { executionCount },
          },
          callId: toolCall.callId,
        }));

        await ctx.get(config.toolExecuted).emit({
          chatId,
          messageId,
          toolResults: errorResults,
          executionCount,
          openaiResponseId,
        });
        return;
      }

      // Process all tools in parallel
      const toolPromises = toolCalls.map(async (toolCall: any) => {
        const { toolName, params, callId, error } = toolCall;

        if (error === "JSON_PARSING") {
          return {
            toolName,
            params,
            result: {
              error: "JSON_PARSING",
              message: `Failed to parse JSON arguments for tool "${toolName}"`,
              details: { originalArguments: params },
            },
            callId,
          };
        }

        const tool = config.tools.find((t) => t.name === toolName);

        if (!tool) {
          return {
            toolName,
            params,
            result: {
              error: "TOOL_NOT_FOUND",
              message: `Tool "${toolName}" not found`,
              details: {
                availableTools: config.tools.map((t) => t.name),
              },
            },
            callId,
          };
        }

        try {
          const result = await tool.run(ctx, chatId, params);

          streamManager.sendToolResult(messageId, {
            type: "tool",
            name: toolName,
            params: params,
            result: {
              success: result,
            },
          });

          return {
            toolName,
            params,
            result: {
              success: result,
            },
            callId,
          };
        } catch (toolError) {
          console.error("Tool execution failed:", toolError);
          return {
            toolName,
            params,
            result: {
              error: "TOOL_EXECUTION_ERROR",
              message: `Tool execution failed: ${
                toolError.message || toolError
              }`,
              details: { originalError: toolError },
            },
            callId,
          };
        }
      });

      const toolResults = await Promise.all(toolPromises);

      await ctx.get(config.toolExecuted).emit({
        chatId,
        messageId,
        toolResults,
        executionCount,
        openaiResponseId,
      });
    });
}
