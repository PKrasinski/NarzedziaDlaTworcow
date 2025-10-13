import type { ArcIdAny } from "@arcote.tech/arc";
import { event, string } from "@arcote.tech/arc";

export type AIGenerationDoneData<
  Name extends string,
  IdentifyiedBy extends ArcIdAny
> = {
  name: Name;
  identifyiedBy: IdentifyiedBy;
  messageId: any;
};

export const aiGenerationDone = <
  const Data extends AIGenerationDoneData<any, any>
>(
  data: Readonly<Data>
) =>
  event(`${data.name}AIGenerationDone`, {
    chatId: data.identifyiedBy as ArcIdAny,
    messageId: data.messageId,
    openaiResponseId: string().optional(),
  });

export type AIGenerationDone<
  Data extends AIGenerationDoneData<any, any> = AIGenerationDoneData<any, any>
> = ReturnType<typeof aiGenerationDone<Data>>;

export type AnyAIGenerationDone = AIGenerationDone<any>;