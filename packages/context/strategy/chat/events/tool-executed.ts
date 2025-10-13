import { type ArcIdAny, event, number, string, any, or, object, array } from "@arcote.tech/arc";

export const toolExecuted = <
  Name extends string,
  IdentifyiedBy extends ArcIdAny
>({
  name,
  identifyiedBy,
  messageId,
}: {
  name: Name;
  identifyiedBy: IdentifyiedBy;
  messageId: ArcIdAny;
}) =>
  event(`${name}ToolExecuted`, {
    chatId: identifyiedBy,
    messageId: messageId,
    toolResults: array(object({
      toolName: string(),
      params: any(),
      result: or(
        // Successful execution
        object({
          success: any(),
        }),
        // Error execution
        object({
          error: string(),
          message: string(),
          details: any().optional(),
        })
      ),
      callId: string(),
    })),
    executionCount: number(),
    openaiResponseId: string(),
  });

export type AnyToolExecuted = ReturnType<typeof toolExecuted>;