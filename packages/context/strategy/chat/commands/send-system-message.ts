import {
  array,
  boolean,
  command,
  string,
  stringEnum,
  type ArcIdAny,
} from "@arcote.tech/arc";
import { AnyAgentResponseRequested } from "../events/agent-response-requested";
import { capitalize } from "./send-message";

export type SendSystemMessageData<
  Name extends string,
  IdentifyiedBy extends ArcIdAny,
  Tools extends any[]
> = {
  name: Name;
  identifyiedBy: IdentifyiedBy;
  messageId: any;
  agentResponseRequested: AnyAgentResponseRequested;
  tools: Tools;
};

export const sendSystemMessage = <
  const Data extends SendSystemMessageData<any, any, any>
>(
  data: Data
) =>
  command(`send${capitalize(data.name as Data["name"])}SystemMessage`)
    .withParams({
      chatId: data.identifyiedBy,
      message: string(),
      previousResponseId: data.messageId.optional(),
      enabledTools: array(stringEnum("web_search")).optional(),
    })
    .withResult(
      {
        error: stringEnum("UNAUTHORIZED"),
      },
      {
        success: boolean(),
        responseId: string(),
      }
    )
    .handle(
      ONLY_SERVER &&
        (async (ctx, { chatId, message, previousResponseId, enabledTools }) => {
          const id = data.messageId.generate();
          const baseUrl = process.env.API_BASE_URL;
          const streamUrl = `${baseUrl}/chat/${data.name}/stream/${id}`;

          await ctx.get(data.agentResponseRequested).emit({
            chatId,
            messageId: id,
            streamUrl,
            parts: [{ type: "text", value: message }],
            enabledTools,
            previousResponseId,
          });

          return { success: true, responseId: id };
        })
    );

export type SendSystemMessage<
  Data extends SendSystemMessageData<any, any, any> = SendSystemMessageData<
    any,
    any,
    any
  >
> = ReturnType<typeof sendSystemMessage<Data>>;
