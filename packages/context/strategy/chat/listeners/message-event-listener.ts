import { ArcId, ArcIdAny, listener } from "@arcote.tech/arc";
import type { AnyAgentResponseRequested } from "../events/agent-response-requested";
import type { AnyMessageSended } from "../events/message-sended";
import type { AnySystemMessageRequested } from "../events/system-message-requested";

export type MessageEventListenerConfig<Name extends string> = {
  chatId: ArcIdAny;
  messageId: ArcId<any>;
  messageSended: AnyMessageSended;
  systemMessageRequested: AnySystemMessageRequested;
  agentResponseRequested: AnyAgentResponseRequested;
  name: Name;
};

export function createMessageEventListener<Name extends string>(
  config: MessageEventListenerConfig<Name>
) {
  return listener(`${config.name}MessageEventListener`)
    .use([
      config.messageSended,
      config.systemMessageRequested,
      config.agentResponseRequested,
    ])
    .listenTo([config.messageSended, config.systemMessageRequested])
    .handle(async (ctx, event) => {
      // Check if AI response should be skipped
      if ("skipAiResponse" in event.payload && event.payload.skipAiResponse) {
        return;
      }

      const parts = event.payload.parts || [];
      const enabledTools = event.payload.enabledTools || [];

      const responseId = config.messageId.generate();
      const baseUrl = process.env.API_BASE_URL;
      const streamUrl = `${baseUrl}/chat/${config.name}/stream/${responseId}`;

      await ctx.get(config.agentResponseRequested).emit({
        chatId: event.payload.chatId,
        messageId: responseId,
        streamUrl,
        parts,
        enabledTools,
        previousResponseId: event.payload.previousResponseId,
      });
    });
}
