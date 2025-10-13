import { route } from "@arcote.tech/arc";
import { streamManager } from "../utils/stream-manager";

export type StreamingRouteConfig<Name extends string> = {
  name: Name;
};

/**
 * Create a generic streaming route for Server-Sent Events (SSE)
 * Handles stream creation, reconnection, and content replay
 */
export function createStreamingRoute<Name extends string>(
  config: StreamingRouteConfig<Name>
) {
  return route(`${config.name}Stream`)
    .path(`/chat/${config.name}/stream/:responseId`)
    .public()
    .handle({
      GET: async (_ctx, req) => {
        const url = new URL(req.url);
        const responseId = url.pathname.split("/").pop();

        if (!responseId) {
          return new Response("Missing responseId", { status: 400 });
        }

        const existingStream = streamManager.getStream(responseId);
        if (!existingStream) {
          // Start a new stream if it doesn't exist
          const newStream = streamManager.startStream(responseId);
          return new Response(newStream, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Cache-Control",
            },
          });
        }

        // For existing streams, create a new stream that replays content
        const reconnectStream = new ReadableStream({
          start: (controller) => {
            // Replay all buffered content
            streamManager.replayContent(responseId, controller);
            
            // Set up the controller for future messages
            (streamManager as any).controllers.set(responseId, controller);
            
            // Start keep-alive for this connection
            (streamManager as any).startKeepAlive(responseId);
          },
          cancel: () => {
            // Clean up on disconnect
            (streamManager as any).cleanup(responseId);
          },
        });

        return new Response(reconnectStream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Cache-Control",
          },
        });
      },
    });
}