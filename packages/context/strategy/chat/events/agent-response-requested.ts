import {
  any,
  type ArcIdAny,
  array,
  event,
  string,
  stringEnum,
} from "@arcote.tech/arc";

export type AgentResponseRequestedData<
  Name extends string,
  IdentifyiedBy extends ArcIdAny,
  Tools extends any[]
> = {
  name: Name;
  identifyiedBy: IdentifyiedBy;
  messageId: ArcIdAny;
  tools: Tools;
};

export type AnyAgentResponseRequested = ReturnType<
  typeof agentResponseRequested<any>
>;

export const agentResponseRequested = <
  const Data extends AgentResponseRequestedData<any, any, any>
>(
  data: Readonly<Data>
) =>
  event(`${data.name}AgentResponseRequested`, {
    chatId: data.identifyiedBy,
    messageId: data.messageId,
    streamUrl: string(),
    parts: array(any<| any | { type: "text"; value: string; }>()),
    previousResponseId: string().optional(),
    enabledTools: array(stringEnum("web_search")).optional(),
  });
