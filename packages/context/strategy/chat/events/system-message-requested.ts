import type { ArcIdAny } from "@arcote.tech/arc";
import { any, array, event, stringEnum } from "@arcote.tech/arc";

export type SystemMessageRequestedData<
  Name extends string,
  IdentifyiedBy extends ArcIdAny,
  Tools extends any[]
> = {
  name: Name;
  identifyiedBy: IdentifyiedBy;
  messageId: any;
  tools: Tools;
};

export const systemMessageRequested = <
  const Data extends SystemMessageRequestedData<any, any, any>
>(
  data: Readonly<Data>
) =>
  event(`${data.name}SystemMessageRequested`, {
    chatId: data.identifyiedBy as ArcIdAny,
    parts: array(any<| any | { type: "text"; value: string; }>()),
    messageId: data.messageId,
    previousResponseId: data.messageId.optional(),
    enabledTools: array(stringEnum("web_search")).optional(),
  });

export type SystemMessageRequested<
  Data extends SystemMessageRequestedData<
    any,
    any,
    any
  > = SystemMessageRequestedData<any, any, any>
> = ReturnType<typeof systemMessageRequested<Data>>;

export type AnySystemMessageRequested = SystemMessageRequested<any>;
