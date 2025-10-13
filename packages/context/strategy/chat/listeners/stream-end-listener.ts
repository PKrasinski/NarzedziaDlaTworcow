import { listener } from "@arcote.tech/arc";
import { AnyMessageGenerated } from "../events/message-generated";
import type { AnyMessageGenerationFailed } from "../events/message-generation-failed";
import { streamManager } from "../utils/stream-manager";

export type StreamEndListenerConfig = {
  messageGenerated: AnyMessageGenerated;
  messageGenerationFailed: AnyMessageGenerationFailed;
  name: string;
};

export function createStreamEndListener(config: StreamEndListenerConfig) {
  return listener(`${config.name}StreamEndListener`)
    .use([config.messageGenerated, config.messageGenerationFailed])
    .listenTo([config.messageGenerated, config.messageGenerationFailed])
    .async()
    .handle(async (ctx, event) => {
      const { messageId } = event.payload;

      // End the stream
      streamManager.endStream(messageId);
    });
}
