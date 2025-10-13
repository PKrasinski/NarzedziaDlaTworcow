/// <reference path="../../arc.types.ts" />

import {
  type $type,
  id as arcId,
  type ArcIdAny,
  type AuthContext,
  context,
} from "@arcote.tech/arc";
import { sendMessage as createSendMessage } from "./commands/send-message";
import { sendSystemMessage } from "./commands/send-system-message";
import { agentResponseRequested } from "./events/agent-response-requested";
import { aiGenerationDone } from "./events/ai-generation-done";
import { aiRequestedToolExecution } from "./events/ai-requested-tool-execution";
import { messageGenerated } from "./events/message-generated";
import { messageGenerationFailed } from "./events/message-generation-failed";
import { messageSended } from "./events/message-sended";
import { systemMessageRequested } from "./events/system-message-requested";
import { toolExecuted } from "./events/tool-executed";
import { InstructionBuilder } from "./get-instruction-command";
import { createAgentListener } from "./listeners/agent-listener";
import { createAIRequestedToolExecutionListener } from "./listeners/ai-requested-tool-execution-listener";
import { createMessageEventListener } from "./listeners/message-event-listener";
import { createStreamEndListener } from "./listeners/stream-end-listener";
import { createToolExecutedListener } from "./listeners/tool-executed-listener";
import { createStreamingRoute } from "./routes/streaming-route";
import type { ArcTool } from "./utils/tool";
import { createMessagesView } from "./views/messages-view";

export const chat = <
  Name extends string,
  IdentifyiedBy extends ArcIdAny,
  Tools extends ArcTool<any, any, any, any>[]
>({
  identifyiedBy,
  name,
  auth: _auth,
  tools,
  instructions,
  maxExecutionCount = 4,
}: {
  identifyiedBy: IdentifyiedBy;
  name: Name;
  auth: (authContext: AuthContext, chatId: $type<IdentifyiedBy>) => boolean;
  tools: Tools;
  instructions: string | InstructionBuilder<{ chatId: IdentifyiedBy }>;
  maxExecutionCount?: number;
}) => {
  const messageId = arcId(`${name}MessageId`);

  const messageGeneratedEvent = messageGenerated({
    name,
    identifyiedBy,
    messageId,
    tools,
  });

  const messageSendedEvent = messageSended({
    name,
    identifyiedBy,
    messageId,
  });

  const systemMessageRequestedEvent = systemMessageRequested({
    name,
    identifyiedBy,
    messageId,
    tools,
  });

  const agentResponseRequestedEvent = agentResponseRequested({
    name,
    identifyiedBy,
    messageId,
    tools,
  });

  const messageGenerationFailedEvent = messageGenerationFailed({
    name,
    identifyiedBy,
  });

  const toolExecutedEvent = toolExecuted({
    name,
    identifyiedBy,
    messageId,
  });

  const aiRequestedToolExecutionEvent = aiRequestedToolExecution({
    name,
    identifyiedBy,
    messageId,
  });

  const aiGenerationDoneEvent = aiGenerationDone({
    name,
    identifyiedBy,
    messageId,
  });

  const toolsJsonSchema = tools.map((command) => command.toJsonSchema());

  const sendMessage = createSendMessage({
    name,
    identifyiedBy,
    messageId,
    messageSended: messageSendedEvent,
    tools,
  });

  const systemMessage = sendSystemMessage({
    name,
    identifyiedBy,
    messageId,
    tools,
    systemMessageRequested: systemMessageRequestedEvent,
  });

  const messagesView = createMessagesView({
    name,
    messageId,
    identifyiedBy,
    messageGenerated: messageGeneratedEvent,
    messageSended: messageSendedEvent,
    agentResponseRequested: agentResponseRequestedEvent as any,
    toolExecuted: toolExecutedEvent as any,
    messageGenerationFailed: messageGenerationFailedEvent as any,
    aiGenerationDone: aiGenerationDoneEvent as any,
  });

  // Create streaming route
  const streamingRoute = createStreamingRoute({ name });

  // Collect all elements from tools
  const allToolElements = tools.flatMap((tool) => tool.getUsedElements());

  return {
    messageId,
    context: context([
      messageSendedEvent,
      messageGeneratedEvent,
      systemMessageRequestedEvent,
      agentResponseRequestedEvent,
      messageGenerationFailedEvent,
      toolExecutedEvent,
      aiRequestedToolExecutionEvent,
      aiGenerationDoneEvent,
      sendMessage,
      systemMessage,
      messagesView,
      streamingRoute,
      ...(ONLY_SERVER
        ? [
            createMessageEventListener({
              chatId: identifyiedBy,
              messageSended: messageSendedEvent,
              systemMessageRequested: systemMessageRequestedEvent,
              agentResponseRequested: agentResponseRequestedEvent as any,
              name,
              messageId,
            }),
            createAgentListener({
              chatId: identifyiedBy,
              agentResponseRequested: agentResponseRequestedEvent as any,
              aiRequestedToolExecution: aiRequestedToolExecutionEvent as any,
              messageGenerated: messageGeneratedEvent as any,
              messageGenerationFailed: messageGenerationFailedEvent as any,
              aiGenerationDone: aiGenerationDoneEvent as any,
              messagesView,
              name,
              instructions: instructions as any,
              toolsJsonSchema,
              tools,
              toolElements: allToolElements,
            }),
            createAIRequestedToolExecutionListener({
              chatId: identifyiedBy,
              aiRequestedToolExecution: aiRequestedToolExecutionEvent as any,
              toolExecuted: toolExecutedEvent as any,
              name,
              tools,
              toolElements: allToolElements,
              maxExecutionCount,
            }),
            createToolExecutedListener({
              chatId: identifyiedBy,
              toolExecuted: toolExecutedEvent as any,
              aiRequestedToolExecution: aiRequestedToolExecutionEvent as any,
              messageGenerated: messageGeneratedEvent as any,
              messageGenerationFailed: messageGenerationFailedEvent as any,
              aiGenerationDone: aiGenerationDoneEvent as any,
              name,
              instructions: instructions as any,
              toolsJsonSchema,
              tools,
              toolElements: allToolElements,
              maxExecutionCount,
            }),
            createStreamEndListener({
              messageGenerated: messageGeneratedEvent as any,
              messageGenerationFailed: messageGenerationFailedEvent as any,
              name,
            }),
          ]
        : ([] as const)),
    ] as const),
  } as const;
};
