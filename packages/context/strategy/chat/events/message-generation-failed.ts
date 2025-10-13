import { type ArcIdAny, event, string } from "@arcote.tech/arc";

export type MessageGenerationFailedData<
  Name extends string,
  IdentifyiedBy extends ArcIdAny
> = {
  name: Name;
  identifyiedBy: IdentifyiedBy;
};

export type AnyMessageGenerationFailed = ReturnType<
  typeof messageGenerationFailed<any>
>;

export const messageGenerationFailed = <
  const Data extends MessageGenerationFailedData<any, any>
>(
  data: Readonly<Data>
) =>
  event(`${data.name}MessageGenerationFailed`, {
    chatId: data.identifyiedBy,
    messageId: string(),
    errorMessage: string(),
  });
