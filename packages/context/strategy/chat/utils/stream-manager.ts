/**
 * StreamManager for handling real-time streaming connections
 * Manages Server-Sent Events (SSE) streams with buffering, keep-alive, and reconnection support
 */
export class StreamManager {
  private activeStreams = new Map<string, ReadableStream>();
  private controllers = new Map<string, ReadableStreamDefaultController>();
  private messageBuffers = new Map<string, string[]>(); // Buffer all chunks for replay
  private toolBuffers = new Map<string, any[]>(); // Buffer all tool results for replay
  private keepAliveIntervals = new Map<string, NodeJS.Timeout>(); // Keep-alive intervals

  /**
   * Start a new stream for the given response ID
   */
  startStream(responseId: string): ReadableStream {
    const stream = new ReadableStream({
      start: (controller) => {
        this.controllers.set(responseId, controller);
        this.messageBuffers.set(responseId, []);
        this.toolBuffers.set(responseId, []);

        // Send immediate acknowledgment without placeholder text
        controller.enqueue(`data: ${JSON.stringify({ type: "start" })}\n\n`);

        // Start keep-alive
        this.startKeepAlive(responseId);
      },
      cancel: () => {
        this.cleanup(responseId);
      },
    });

    this.activeStreams.set(responseId, stream);
    return stream;
  }

  /**
   * Start keep-alive ping mechanism for a stream
   */
  private startKeepAlive(responseId: string): void {
    const interval = setInterval(() => {
      const controller = this.controllers.get(responseId);
      if (controller) {
        controller.enqueue(`data: ${JSON.stringify({ type: "ping" })}\n\n`);
      } else {
        this.cleanup(responseId);
      }
    }, 5000); // Send ping every 5 seconds

    this.keepAliveIntervals.set(responseId, interval);
  }

  /**
   * Clean up resources for a stream
   */
  private cleanup(responseId: string): void {
    const interval = this.keepAliveIntervals.get(responseId);
    if (interval) {
      clearInterval(interval);
      this.keepAliveIntervals.delete(responseId);
    }
    this.controllers.delete(responseId);
  }

  /**
   * Send a text chunk to the stream
   */
  sendChunk(responseId: string, chunk: string): void {
    // Buffer the chunk for replay
    const buffer = this.messageBuffers.get(responseId);
    if (buffer) {
      buffer.push(chunk);
    }

    // Send to active controller
    const controller = this.controllers.get(responseId);
    if (controller) {
      controller.enqueue(
        `data: ${JSON.stringify({ type: "chunk", chunk })}\n\n`
      );
    }
  }

  /**
   * Send a tool result to the stream
   */
  sendToolResult(responseId: string, toolResult: any): void {
    // Buffer the tool result for replay
    const buffer = this.toolBuffers.get(responseId);
    if (buffer) {
      buffer.push(toolResult);
    }

    // Send to active controller
    const controller = this.controllers.get(responseId);
    if (controller) {
      controller.enqueue(
        `data: ${JSON.stringify({ type: "tool", toolResult })}\n\n`
      );
    }
  }

  /**
   * End a stream and clean up resources
   */
  endStream(responseId: string): void {
    const controller = this.controllers.get(responseId);
    if (controller) {
      controller.enqueue(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      controller.close();
    }

    // Clean up buffers and intervals
    this.cleanup(responseId);
    this.activeStreams.delete(responseId);
    this.messageBuffers.delete(responseId);
    this.toolBuffers.delete(responseId);
  }

  /**
   * Get an existing stream by response ID
   */
  getStream(responseId: string): ReadableStream | undefined {
    return this.activeStreams.get(responseId);
  }

  /**
   * Replay all buffered content for reconnecting clients
   */
  replayContent(
    responseId: string,
    controller: ReadableStreamDefaultController
  ): void {
    const messageBuffer = this.messageBuffers.get(responseId);
    const toolBuffer = this.toolBuffers.get(responseId);

    if (messageBuffer) {
      // Send all buffered chunks at once
      const fullContent = messageBuffer.join("");
      if (fullContent) {
        controller.enqueue(
          `data: ${JSON.stringify({
            type: "replay",
            content: fullContent,
          })}\n\n`
        );
      }
    }

    if (toolBuffer) {
      // Send all buffered tool results
      toolBuffer.forEach((toolResult) => {
        controller.enqueue(
          `data: ${JSON.stringify({ type: "tool", toolResult })}\n\n`
        );
      });
    }
  }
}

// Export singleton instance
export const streamManager = new StreamManager();
