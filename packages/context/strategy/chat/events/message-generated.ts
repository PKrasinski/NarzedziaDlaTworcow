import type { ArcIdAny } from "@arcote.tech/arc";
import { any, array, event, string } from "@arcote.tech/arc";
import type { ArcTool } from "../utils/tool";

export type MessageGeneratedData<
  Name extends string,
  IdentifyiedBy extends ArcIdAny,
  Tools extends ArcTool<any, any, any, any>[]
> = {
  name: Name;
  identifyiedBy: IdentifyiedBy;
  messageId: any;
  tools: Tools;
};

export type ToolsResponses<Tools extends ArcTool<any, any, any, any>[]> = {
  [Tool in Tools[number] as Tool["name"]]: {
    type: "tool";
    name: Tool["name"];
    params: any;
    result: any;
  };
}[Tools[number]["name"]];

export const messageGenerated = <
  const Data extends MessageGeneratedData<any, any, any>
>(
  data: Readonly<Data>
) =>
  event(`${data.name}MessageGenerated`, {
    chatId: data.identifyiedBy as ArcIdAny,
    messageParts: array(
      any<
        | ToolsResponses<Data["tools"]>
        | {
            type: "text";
            value: string;
          }
      >()
    ),
    messageId: data.messageId,
    parentId: data.messageId.optional(),
    openaiResponseId: string().optional(),
  });

export type MessageGenerated<
  Data extends MessageGeneratedData<any, any, any> = MessageGeneratedData<
    any,
    any,
    any
  >
> = ReturnType<typeof messageGenerated<Data>>;

export type AnyMessageGenerated = MessageGenerated<any>;
