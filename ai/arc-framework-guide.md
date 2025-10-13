# Arc Framework Guide: Creating Modules and Chat Systems

## Overview

The Arc framework is an event-driven architecture system that provides a structured approach to building scalable applications. It follows the pattern: **Commands → Events → Listeners → Views**.

## Core Concepts

### 1. Architecture Pattern

```
User Action → Command → Event → Listener → View Update
```

### 2. Core Components

#### **Events**

- Immutable facts about what happened in the system
- Defined using `event(name, schema)`
- Always persisted in the database
- Example: `messageSended`, `messageGenerated`

#### **Commands**

- Handle user actions and validate input
- Emit events after successful validation
- Return success/error responses
- Example: `sendMessage` command

#### **Listeners**

- React to events asynchronously
- Handle side effects (AI processing, external APIs)
- Can emit additional events
- Server-only (`ONLY_SERVER` guard)

#### **Views**

- Auto-updating read models
- React to events to maintain current state
- Queryable from frontend
- Example: `messagesView`

#### **Routes**

- HTTP endpoints for custom functionality
- Support SSE (Server-Sent Events) for streaming
- Can be public or authenticated
- Example: streaming endpoints

## Chat Factory Pattern

### Factory Function Structure

```typescript
export const chat = <Name, IdentifyiedBy, Tools>({
  identifyiedBy,
  name,
  auth,
  tools,
  instructions,
}) => {
  // Generate IDs
  const messageId = arcId(`${name}MessageId`);

  // Define events
  const messageSended = event(`${name}MessageSended`, { /* schema */ });
  const messageGenerated = event(`${name}MessageGenerated`, { /* schema */ });

  // Define command
  const sendMessage = command(`send${capitalize(name)}Message`)
    .withParams({ /* params */ })
    .withResult({ success: boolean(), responseId: string() })
    .handle(/* handler */);

  // Define listener
  const messageSendedListener = listener(/* config */);

  // Define view
  const messagesView = view(/* config */);

  // Define route (for streaming)
  const streamingRoute = route(`${name}Stream`)
    .path(`/chat/${name}/stream/:responseId`)
    .public()
    .handle({ GET: /* handler */ });

  // Return all elements
  return [
    messageSended,
    messageGenerated,
    sendMessage,
    messagesView,
    streamingRoute,
    ...(ONLY_SERVER ? [messageSendedListener] : [])
  ] as const;
};
```

### Key Patterns

#### **Event Naming Convention**

- Use camelCase with descriptive names
- Include the module name as prefix: `${name}MessageSended`
- Past tense for events: `messageSended`, `messageGenerated`

#### **Command Structure**

```typescript
const sendMessage = command(`send${capitalize(name)}Message`)
  .withParams({
    chatId: identifyiedBy,
    message: string(),
    parentId: messageId.optional(),
  })
  .withResult(
    { error: stringEnum("UNAUTHORIZED") },
    { success: boolean(), responseId: string() }
  )
  .handle(
    ONLY_SERVER &&
      (async (ctx, params) => {
        // Validation
        // Emit event
        await ctx.get(messageSended).emit({
          /* payload */
        });
        return { success: true, responseId: id };
      })
  );
```

#### **Listener Pattern**

```typescript
const messageSendedListener = listener(`${name}MessageSendedListener`)
  .use([messageSended, messageGenerated])
  .listenTo([messageSended])
  .async()
  .handle(async (ctx, event) => {
    // Process event
    // Call external APIs (OpenAI, etc.)
    // Emit completion event
    await ctx.get(messageGenerated).emit({
      /* payload */
    });
  });
```

#### **View Pattern**

```typescript
const messagesView = view(`${name}Messages`, messageId /* schema */)
  .handleEvent(messageGenerated, async (ctx, event) => {
    await ctx.set(event.payload.messageId, {
      /* data */
    });
  })
  .handleEvent(messageSended, async (ctx, event) => {
    await ctx.set(event.payload.messageId, {
      /* data */
    });
  });
```

## Frontend Integration

### Command Usage

```typescript
const { sendMessage } = useCommands();
const result = await sendMessage({
  chatId: currentAccount._id,
  message: inputValue,
  parentId: null,
});
```

## Context Integration

### Module Structure

```typescript
// In strategy/index.ts
const identityChat = chat({
  identifyiedBy: accountWorkspaceId,
  name: "identity",
  auth: (authContext, chatId) => true,
  tools: [
    /* ArcTools */
  ],
  instructions: "/* AI instructions */",
});

export const createStrategyContext = () =>
  [
    // Events
    // Commands
    ...identityChat, // All chat elements
    // Views
  ] as const;
```

### Server Context Merging

```typescript
// In server/index.ts
const context = contextMerge(
  context1,
  context2,
  narzedziaDlaTworcowOrderingContext
);

hostLiveModel(context, {
  db: dbPath,
  version: dbVersion,
});
```

## Key Requirements

### 1. Type Safety

- Use proper TypeScript types with Arc schema definitions
- Reference `arc.types.ts` for global types like `ONLY_SERVER`

### 2. Authentication

- Use `ctx.$auth.userId` for user context
- Implement proper auth checks in commands
- Routes can be `.public()` or require authentication

### 3. Error Handling

- Commands return union types with success/error
- Listeners should handle errors gracefully
- Frontend should handle streaming errors

### 4. Performance

- Events are immutable and persistent
- Streaming is ephemeral (not persisted)
- Views update automatically on events

## Best Practices

1. **Event Design**: Keep events small and focused
2. **Command Validation**: Validate all inputs before emitting events
3. **Listener Isolation**: Each listener should handle one concern
4. **View Efficiency**: Keep views simple and fast
5. **Route Security**: Use `.public()` carefully, authenticate when needed
6. **Streaming Cleanup**: Always clean up streaming connections
7. **Error Boundaries**: Handle errors at every level
8. **Type Safety**: Use Arc schema types throughout
