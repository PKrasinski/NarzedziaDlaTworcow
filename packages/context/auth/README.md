# Auth Module

A reusable authentication module for Arc framework applications that provides type-safe account management with configurable custom fields.

## Overview

This module provides a factory function to create authentication contexts for different applications while maintaining type safety and allowing custom account fields. The module uses "account" terminology throughout and integrates seamlessly with Arc framework types.

## Core Concepts

### Account Type

The module exports a generic `Account<CustomFields>` type that extends the base account fields (email and password) with application-specific custom fields.

```typescript
type Account<CustomFields extends ArcRawShape = {}> = {
  email: string;
  password: string;
} & $type<CustomFields>;
```

### Factory Pattern

Authentication contexts are created using a factory function that accepts:

- **name**: Used for event naming (e.g., "client" creates `clientAccountRegistered`)
- **customFields**: Arc schema objects for application-specific fields
- **sendOTP**: Function that handles OTP email delivery

## Usage

### Basic Usage

```typescript
import {
  createAuthContext,
  type Account,
  type ArcRawShape,
} from "@packages/auth";

const userFields = {
  companyName: string(),
  role: stringEnum("founder", "employee"),
};

const authContext = createAuthContext({
  name: "client",
  customFields: userFields,
  sendOTP: async ({ account, otp }) => Promise<void>,
});
```

### Custom Fields

Custom fields are defined using Arc schema objects and can include any valid Arc schema types:

```typescript
const userFields = {
  companyName: string().minLength(1),
  role: stringEnum("founder", "employee", "admin"),
  department: string().optional(),
};

// Use with Account type
type MyAccount = Account<typeof userFields>;
```

### OTP Integration

The `sendOTP` function receives two parameters:

1. **account**: `Account<CustomFields>` - The complete account object with custom fields
2. **otp**: `ArcRecord<OtpCodesView>` - The OTP record from the database

```typescript
sendOTP: async ({
  account,
  otp,
}: SendOTPParams<typeof userFields>}) => {
  // account contains: email, password, and all custom fields
  // otp contains: _id, email, otpCode, expiresAt, generatedAt, isUsed, verifiedAt?
};
```

## Event Naming

Events are automatically named based on the `name` parameter:

```typescript
// name: "client" creates:
// - clientAccountRegistered
// - clientOtpGenerated
// - clientOtpVerified
// - clientSignedIn
// - clientPasswordChanged
// - clientProfileUpdated

// name: "creator" creates:
// - creatorAccountRegistered
// - creatorOtpGenerated
// - etc.
```

## Standard Fields

All accounts include these standard fields:

- **email**: `string().email()` - Account email address
- **password**: `string().minLength(6).maxLength(32)` - Account password

Additional fields are application-specific and defined through the `customFields` parameter.

## Type Safety

The module provides full TypeScript support:

```typescript
const userFields = {
  companyName: string(),
  role: stringEnum("founder", "employee", "admin"),
  department: string().optional(),
};

type BusinessAccount = Account<typeof userFields>;

// Commands are properly typed
const result = await registerAccount({
  email: "user@company.com",
  password: "securepass",
  companyName: "Acme Corp", // Custom field
  role: "founder", // Custom field
  department: "Engineering", // Optional custom field
});
```

## Available Components

Each auth context provides:

### Commands

- `register${Name}Account` - Account registration
- `signIn${Name}` - Account sign in
- `verify${Name}Otp` - OTP verification
- `resend${Name}Otp` - Resend OTP
- `change${Name}Password` - Password change
- `update${Name}Profile` - Profile updates
- `delete${Name}Account` - Account deletion

### Views

- `${name}Accounts` - Account records
- `${name}OtpCodes` - OTP codes
- `${name}AccountSimple` - Basic account info
- `${name}PasswordCredentials` - Password data
- `${name}AccountVerificationStatus` - Verification status

### Events

- `${name}AccountRegistered` - Account creation
- `${name}OtpGenerated` - OTP code generated
- `${name}OtpVerified` - OTP verification
- `${name}OtpEmailSent` - OTP email delivery
- `${name}SignedIn` - Successful sign in
- `${name}PasswordChanged` - Password update
- `${name}ProfileUpdated` - Profile changes
- `${name}AccountDeleted` - Account removal

## Error Handling

Commands return union types for proper error handling:

```typescript
const result = await registerAccount({
  /* ... */
});

if ("error" in result) {
  // Handle error cases
  switch (result.error) {
    case "ACCOUNT_EXISTS":
      // Account already exists
      break;
    case "IP_LIMIT_EXCEEDED":
      // Too many registrations from IP
      break;
    case "RODO_CONSENT_REQUIRED":
      // GDPR consent required
      break;
  }
} else {
  // Handle success
  console.log("Registration successful:", result.success);
}
```

## Best Practices

1. **Use descriptive names**: Choose meaningful names for your auth context (e.g., "client", "creator", "admin")

2. **Define minimal custom fields**: Only include fields that are essential for your application

3. **Handle OTP errors**: Implement proper error handling in your `sendOTP` function

4. **Type your custom fields**: Use proper Arc schema types for all custom fields

5. **Validate consent fields**: Use `.hasToBeTrue()` for required consent fields

6. **Use optional fields**: Mark non-required fields as `.optional()`
