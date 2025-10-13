import type { ArcIdAny } from "@arcote.tech/arc";
import { event, string, array, any, boolean, stringEnum } from "@arcote.tech/arc";
import { userId } from "../../../auth";

export type MessageSendedData<
  Name extends string,
  IdentifyiedBy extends ArcIdAny
> = {
  name: Name;
  identifyiedBy: IdentifyiedBy;
  messageId: any;
};

export const messageSended = <const Data extends MessageSendedData<any, any>>(
  data: Readonly<Data>
) =>
  event(`${data.name}MessageSended`, {
    userId,
    chatId: data.identifyiedBy as ArcIdAny,
    parts: array(
      any<
        | any // ToolsResponses will be typed properly when used
        | {
            type: "text";
            value: string;
          }
      >()
    ),
    messageId: data.messageId,
    previousResponseId: data.messageId.optional(),
    skipAiResponse: boolean().optional(),
    enabledTools: array(stringEnum("web_search")).optional(),
  });

export type MessageSended<
  Data extends MessageSendedData<any, any> = MessageSendedData<any, any>
> = ReturnType<typeof messageSended<Data>>;

export type AnyMessageSended = MessageSended<any>;
