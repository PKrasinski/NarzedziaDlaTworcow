# Arc Framework Context Factory Pattern Guide

## Table of Contents
1. [Why Create Context Factories?](#why-create-context-factories)
2. [Factory Pattern Benefits](#factory-pattern-benefits)
3. [Event Architecture](#event-architecture)
4. [Command Architecture](#command-architecture)
5. [View Architecture](#view-architecture)
6. [Listener Architecture](#listener-architecture)
7. [Main Factory Function](#main-factory-function)
8. [Implementation Example](#implementation-example)
9. [Best Practices](#best-practices)

## Why Create Context Factories?

Context factories solve the fundamental problem of **code reusability** in Arc Framework applications. Without factories, you end up with:

- **Duplicated code** across different applications
- **Hard-coded event names** that can't be customized
- **Monolithic contexts** that can't be adapted to different use cases
- **Type safety issues** when trying to reuse components

### The Problem Without Factories

```typescript
// ❌ Bad: Hard-coded, non-reusable
const userRegistered = event("userRegistered", {
  userId: string().branded("user-id"),
  email: string().email(),
  // Fixed schema - can't be customized
});

const registerCommand = command("register")
  .use([userRegistered])
  // Hard-coded logic, can't be reused
```

### The Solution With Factories

```typescript
// ✅ Good: Flexible, reusable, type-safe
export const createAuthContext = <Data extends AuthContextData>(data: Data) => {
  // Dynamic event names based on data.name
  // Customizable fields based on data.customFields
  // Type-safe throughout
};
```

## Factory Pattern Benefits

### 1. **DRY Principle (Don't Repeat Yourself)**
- Write authentication logic **once**
- Use it across **multiple applications**
- Each application gets **customized event names** and **fields**

### 2. **Type Safety**
- **Strong typing** throughout the entire context
- **No `any` types** - everything is properly typed
- **Compile-time checks** ensure correctness

### 3. **Customization**
- **Dynamic event names**: `userRegistered` vs `clientRegistered`
- **Custom fields**: Different apps need different user properties
- **Configurable behavior**: Different email providers, validation rules

### 4. **Maintainability**
- **Single source of truth** for business logic
- **Easy to update** - changes propagate to all applications
- **Clear separation** between framework and application logic

## Event Architecture

Events are the foundation of Arc Framework. In factories, they must be **declarative** and **type-safe**.

### Event Structure Pattern

```typescript
// 1. Define Data Type
export type AccountRegisteredData = {
  name: string;                    // For dynamic naming
  customFields: ArcRawShape;       // For custom properties
  accountId: AccountId;            // Account ID passed from context factory
};

// 2. Create Event Factory Function
export const accountRegistered = <const Data extends AccountRegisteredData>(data: Data) =>
  event(`${getTypeSafe(data, "name")}AccountRegistered`, {
    accountId: data.accountId,     // Use passed accountId, don't create
    email: string().email(),
    passwordHash: string(),
    ...data.customFields,          // Spread custom fields
  });

// 3. Export Type for Use in Commands/Views
export type AccountRegistered<Data extends AccountRegisteredData = AccountRegisteredData> = 
  ReturnType<typeof accountRegistered<Data>>;
```

### Why This Structure?

1. **`<const Data extends AccountRegisteredData>`**: Ensures type constraints while preserving literal types
2. **`data: Data`**: Removed `Readonly<Data>` wrapper for better type inference
3. **`getTypeSafe(data, "name")`**: Type-safe data access instead of direct `data.name`
4. **`accountId: AccountId`**: Use proper typed AccountId instead of any
5. **`data.accountId`**: AccountId created once in context factory and passed to all components
6. **`ReturnType<typeof ...>`**: Captures the exact type of the created event

### Event Usage in Factory

```typescript
const authContext = createAuthContext({
  name: "user",                    // → "userAccountRegistered"
  customFields: {
    companyName: string(),
    role: stringEnum("admin", "user"),
  },
  // ... other config
});
```

## Command Architecture

Commands contain **business logic** and must be **reusable** with **strong typing**.

### Command Structure Pattern

```typescript
// 1. Define Command Data Type
export type RegisterCommandData = {
  name: string;
  customFields: ArcRawShape;
  // Include ALL dependencies with proper types
  accountRegistered: AccountRegistered;
  usedEmailsView: any;             // View types would be properly typed in real implementation
  ipRegistrationsView: any;        // View types would be properly typed in real implementation
  accountId: AccountId;            // Properly typed AccountId
};

// 2. Create Command Factory Function
export const createRegisterCommand = <const Data extends RegisterCommandData>(
  data: Data
) =>
  command(`register${capitalize(getTypeSafe(data, "name"))}Account`)
    .public()
    .use([
      data.accountRegistered,        // Use from data, not parameters
      data.usedEmailsView,
      data.ipRegistrationsView,
    ])
    .withParams({
      email: string().email(),
      password: string().minLength(6).maxLength(32),
      ...data.customFields,          // Dynamic params based on custom fields
    })
    .withResult(
      {
        success: string(),
        email: string(),
      },
      {
        error: stringEnum("ACCOUNT_EXISTS", "IP_LIMIT_EXCEEDED"),
      }
    )
    .handle(
      ONLY_SERVER &&
        (async (ctx, formData) => {
          // Real business logic here
          const emailExists = await ctx.get(data.usedEmailsView).findOne({
            email: formData.email,
          });

          if (emailExists) {
            return { error: "ACCOUNT_EXISTS" as const };
          }

          // ... rest of logic
          
          await ctx.get(data.accountRegistered).emit({
            accountId: id,
            email: formData.email,
            passwordHash,
            ...rest,
          });

          return {
            success: "Registration successful.",
            email: formData.email as string,
          };
        })
    );

// 3. Export Type
export type RegisterCommand<Data extends RegisterCommandData = RegisterCommandData> =
  ReturnType<typeof createRegisterCommand<Data>>;
```

### Why This Structure?

1. **Single Parameter**: All dependencies in `data` object, not separate parameters
2. **`ctx.get(data.viewName)`**: Proper Arc framework pattern for accessing views
3. **Strong Typing**: `AccountRegistered<any>` instead of just `any`
4. **Real Logic**: Actual business logic, not TODOs
5. **Dynamic Names**: `register${capitalize(data.name)}Account` creates unique command names

### Command Anti-Patterns to Avoid

```typescript
// ❌ Bad: Separate dependencies parameter
export const createRegisterCommand = (
  data: Data,
  dependencies: { event: any, view: any }  // Don't do this!
) => // ...

// ❌ Bad: Using any everywhere
export const createRegisterCommand = (
  name: string,
  event: any,           // Don't do this!
  view: any            // Don't do this!
) => // ...

// ❌ Bad: Wrong context access
await ctx[eventName.name].emit();  // Don't do this!
// ✅ Good: Correct context access
await ctx.get(data.eventName).emit();  // Do this!
```

## View Architecture

Views provide **read models** and must support **custom fields** from different applications.

### View Structure Pattern

```typescript
// 1. Define View Data Type
export type MyAccountViewData = {
  name: string;
  customFields: ArcRawShape;
  accountId: AccountId;
  accountRegistered: AccountRegistered;
  otpVerified: OtpVerified;
  accountDeleted: AccountDeleted;
  profileUpdated: ProfileUpdated;
};

// 2. Create View Factory Function
export const createMyAccountView = <const Data extends MyAccountViewData>(
  data: Data
) =>
  view(
    `my${capitalize(getTypeSafe(data, "name"))}Account`,
    data.accountId,
    object({
      // Standard fields
      email: string().email(),
      isEmailVerified: boolean(),
      hasActivatedAccount: boolean(),
      hasCompletedOnboarding: boolean(),
      
      // Custom fields from application
      ...data.customFields,
    })
  )
    .handleEvent(data.accountRegistered, async (ctx, event) => {
      const { accountId, email, passwordHash, ...customFieldValues } = event.payload;
      
      await ctx.set(accountId, {
        email,
        isEmailVerified: false,
        hasActivatedAccount: false,
        hasCompletedOnboarding: false,
        ...customFieldValues,    // Include custom field values
      });
    })
    .handleEvent(data.otpVerified, async (ctx, event) => {
      const existing = await ctx.findOne({ _id: event.payload.accountId });
      if (existing) {
        await ctx.set(event.payload.accountId, {
          ...existing,
          isEmailVerified: true,
        });
      }
    })
    .handleEvent(data.profileUpdated, async (ctx, event) => {
      const { accountId, ...updateFields } = event.payload;
      await ctx.modify(accountId, updateFields);
    })
    .handleEvent(data.accountDeleted, async (ctx, event) => {
      await ctx.remove(event.payload.accountId);
    });

// 3. Export Type
export type MyAccountView<Data extends MyAccountViewData = MyAccountViewData> =
  ReturnType<typeof createMyAccountView<Data>>;
```

### Why This Structure?

1. **Single Data Parameter**: All dependencies in one data object for cleaner API
2. **Chained handleEvent**: Uses `.handleEvent()` method chaining for natural typing
3. **Dynamic View Name**: `my${capitalize(getTypeSafe(data, "name"))}Account` creates unique names
4. **Field Spreading**: `...data.customFields` includes application-specific fields
5. **Type Safety**: Strong typing throughout with proper AccountId and event types
6. **No Readonly Wrapper**: Removed `Readonly<Data>` for better type inference

## Listener Architecture

Listeners handle **side effects** and **integrations** (emails, external APIs, etc.).

### Listener Structure Pattern

Listeners should be split by responsibility. Here are examples of the current patterns:

#### OTP Generator Listener (Business Logic)
```typescript
export type OtpGeneratorListenerData = {
  name: string;
  customFields: ArcRawShape;
  accountRegistered: AccountRegistered;
  otpGenerated: OtpGenerated;
};

export const createOtpGeneratorListener = <
  const Data extends OtpGeneratorListenerData
>(
  data: Data
) =>
  listener(`${getTypeSafe(data, "name")}OtpGenerator`)
    .use([data.otpGenerated])
    .listenTo([data.accountRegistered])
    .handle(async (ctx, event) => {
      // Generate OTP code after account registration
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      // Emit OTP generated event
      await ctx.get(data.otpGenerated).emit({
        accountId: event.payload.accountId,
        email: event.payload.email,
        otpCode,
        expiresAt,
      });
    });
```

#### OTP Email Sender Listener (Side Effects)
```typescript
export type OtpEmailSenderListenerData = {
  name: string;
  customFields: ArcRawShape;
  otpGenerated: OtpGenerated;
  otpEmailSent: OtpEmailSent;
  accountSimpleView: AccountSimpleView;
  otpCodesView: OtpCodesView;
  sendOTP: SendOTP;
};

export const createOtpEmailSenderListener = <
  const Data extends OtpEmailSenderListenerData
>(
  data: Data
) =>
  listener(`${getTypeSafe(data, "name")}OtpEmailSender`)
    .async()
    .use([data.otpEmailSent, data.accountSimpleView, data.otpCodesView])
    .listenTo([data.otpGenerated])
    .handle(async (ctx, event) => {
      // Get account and OTP records from views
      const account = await ctx.get(data.accountSimpleView).findOne({
        _id: event.payload.accountId,
      });
      const otpRecord = await ctx.get(data.otpCodesView).findOne({
        _id: event.payload.accountId,
      });

      if (!account || !otpRecord) return;

      // Send email using configured sendOTP function
      await data.sendOTP({ account, otpCode: otpRecord });

      // Log that email was sent
      await ctx.get(data.otpEmailSent).emit({
        accountId: event.payload.accountId,
        email: event.payload.email,
        otpCode: event.payload.otpCode,
      });
    });
```

### Why This Structure?

1. **Single Responsibility**: Each listener has one clear purpose (generate OTP vs send email)
2. **Factory Pattern**: Uses consistent `<const Data extends ...>` pattern with `getTypeSafe`
3. **Proper Dependencies**: Views and external functions (sendOTP) included in data structure
4. **Type Safety**: Strongly typed with proper view types instead of generic any
5. **Clean Separation**: Business logic (OTP generation) separate from side effects (email sending)

## Main Factory Function

The main factory function **orchestrates** all components and provides a **clean API**.

### Factory Structure Pattern

```typescript
export const createAuthContext = <const Data extends AuthContextData>(
  data: Data
) => {
  // 1. Create IDs
  const accountId = createAccountId({ name: getTypeSafe(data, "name") });

  // 2. Create Events (pass accountId to all events)
  const accountRegisteredEvent = accountRegistered({
    name: getTypeSafe(data, "name"),
    customFields: data.customFields,
    accountId,
  });
  
  const otpGeneratedEvent = otpGenerated({ 
    name: getTypeSafe(data, "name"),
    accountId,
  });
  // ... other events

  // 3. Create Views (pass accountId and events)
  const myAccountView = createMyAccountView({
    name: getTypeSafe(data, "name"),
    customFields: data.customFields,
    accountId,
    accountRegistered: accountRegisteredEvent,
    otpVerified: otpVerifiedEvent,
    accountDeleted: accountDeletedEvent,
    profileUpdated: profileUpdatedEvent,
  });
  // ... other views

  // 4. Create Commands (pass all dependencies)
  const registerCommand = createRegisterCommand({
    name: getTypeSafe(data, "name"),
    customFields: data.customFields,
    accountRegistered: accountRegisteredEvent,
    usedEmailsView: usedEmailsView,
    ipRegistrationsView: ipRegistrationsView,
    accountId: accountId,
  });
  // ... other commands

  // 5. Create Listeners
  const otpGeneratorListener = createOtpGeneratorListener({
    name: getTypeSafe(data, "name"),
    customFields: data.customFields,
    accountRegistered: accountRegisteredEvent,
    otpGenerated: otpGeneratedEvent,
  });

  const otpEmailSenderListener = createOtpEmailSenderListener({
    name: getTypeSafe(data, "name"),
    customFields: data.customFields,
    otpGenerated: otpGeneratedEvent,
    otpEmailSent: otpEmailSentEvent,
    accountSimpleView: accountSimpleView,
    otpCodesView: otpCodesView,
    sendOTP: data.sendOTP,
  });

  // 6. Compose Context
  const context = arcContext([
    // Events
    accountRegisteredEvent,
    otpGeneratedEvent,
    // ... all events
    
    // Commands
    registerCommand,
    signinCommand,
    // ... all commands
    
    // Views
    myAccountView,
    passwordCredentialsView,
    // ... all views
    
    // Listeners (server-only)
    ...(ONLY_SERVER ? [otpGeneratorListener, otpEmailSenderListener] : []),
  ] as const);

  return context;
};
```

### Why This Structure?

1. **Single Entry Point**: One function creates entire context
2. **Dependency Injection**: `sendOTP` function injected from application
3. **Type Safety**: Generic parameters ensure type safety
4. **Clean API**: Simple interface for applications to use
5. **Complete Context**: Returns fully configured Arc context

## Implementation Example

Here's how an application would use the auth factory:

### Application Code

```typescript
// Define custom fields for your application
const userFields = {
  companyName: string(),
  role: stringEnum("admin", "user", "viewer"),
  department: string().optional(),
  phoneNumber: string().optional(),
} as const;

// Create auth context with custom configuration
const authContext = createAuthContext({
  name: "user",                    // Events: userRegistered, userSignedIn, etc.
  customFields: userFields,
  sendOTP: async ({ account, otp }) => {
    // Your email implementation
    await sendEmail({
      to: account.email,
      subject: "Verify your account",
      body: `Your OTP: ${otp.otpCode}`,
    });
  },
});

// Use in your main application context
const appContext = context([
  authContext,
  // ... other contexts
] as const);
```

### Generated Types

The factory automatically generates these types:
- `userRegistered` event
- `registerUserAccount` command
- `signInUser` command
- `myUserAccount` view
- etc.

All with **custom fields** and **strong typing**!

## Best Practices

### 1. **Event Naming**
- Use **descriptive names**: `accountRegistered` not `registered`
- Follow **consistent patterns**: `${name}${Action}${Entity}`
- Use **past tense** for events: `created`, `updated`, `deleted`

### 2. **Type Safety**
- **Never use generic `<any>`** - use proper typed interfaces like `AccountRegistered` not `AccountRegistered<any>`
- **Export all types** using `ReturnType<typeof ...>` pattern
- **Use `<const Data extends ...>`** for literal type preservation
- **Use `getTypeSafe(data, "key")`** for type-safe data access instead of direct `data.key`
- **Remove `Readonly<Data>` wrapper** for better type inference

### 3. **Command Structure**
- **Put ALL dependencies** in command data type
- **Use `ctx.get()`** for accessing views and emitting events
- **Include real business logic**, not TODOs
- **Return strongly typed results** with `as const`

### 4. **Factory Organization**
```
/auth-factory/
├── events/
│   ├── account-registered.ts
│   ├── otp-generated.ts
│   └── ...
├── commands/
│   ├── register.ts
│   ├── signin.ts
│   └── ...
├── views/
│   ├── my-account.ts
│   ├── password-credentials.ts
│   └── ...
├── listeners/
│   └── otp-email-sender.ts
└── index.ts                 // Main factory function
```

### 5. **Listener Separation**
- **Split listeners by responsibility**: Keep business logic separate from side effects
- **Business Logic Listeners**: Generate data, transform events (e.g., OTP generation)
- **Side Effect Listeners**: Handle external integrations (e.g., email sending, API calls)
- **Chain listeners**: Output events from business listeners become input for side effect listeners

### 6. **Testing**
- **Test the factory** with different configurations
- **Verify type safety** at compile time
- **Test business logic** in commands
- **Mock external dependencies** (sendOTP, etc.)

### 7. **Documentation**
- **Document the factory API** clearly
- **Provide usage examples** for different scenarios
- **Explain customization options**
- **Document integration requirements**

## Conclusion

The Arc Framework Context Factory pattern enables **reusable**, **type-safe**, and **maintainable** code by:

1. **Declaring each element only once** in the factory
2. **Making everything type-safe** through generic constraints
3. **Allowing customization** without code duplication
4. **Following DRY principles** while maintaining flexibility

This pattern transforms monolithic, hard-coded contexts into **flexible, reusable modules** that can be adapted to any application's needs while maintaining **complete type safety** and **business logic integrity**.