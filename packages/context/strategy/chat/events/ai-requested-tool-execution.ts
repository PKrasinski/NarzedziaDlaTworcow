import {
  any,
  type ArcIdAny,
  array,
  event,
  number,
  object,
  string,
  stringEnum,
} from "@arcote.tech/arc";

export const aiRequestedToolExecution = <
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
  event(`${name}AIRequestedToolExecution`, {
    chatId: identifyiedBy,
    messageId: messageId,
    toolCalls: array(
      object({
        toolName: string(),
        params: any(),
        callId: string(),
        error: stringEnum("JSON_PARSING").optional(),
      })
    ),
    executionCount: number(),
    openaiResponseId: string(),
  });

export type AnyAIRequestedToolExecution = ReturnType<
  typeof aiRequestedToolExecution
>;
