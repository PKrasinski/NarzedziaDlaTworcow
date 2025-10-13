import { type ArcRawShape, context as arcContext } from "@arcote.tech/arc";

// Import getTypeSafe utility
import { getTypeSafe } from "./utils/get";

// Import event factories
import { accountDeleted } from "./events/account-deleted";
import { accountRegistered } from "./events/account-registered";
import { otpEmailSent } from "./events/otp-email-sent";
import { otpGenerated } from "./events/otp-generated";
import { otpVerified } from "./events/otp-verified";
import { passwordChanged } from "./events/password-changed";
import { profileUpdated } from "./events/profile-updated";
import { signedIn } from "./events/signed-in";

// Import command factories
import { createChangePasswordCommand } from "./commands/change-password";
import { createDeleteAccountCommand } from "./commands/delete-account";
import { createRegisterCommand } from "./commands/register";
import { createResendOtpCommand } from "./commands/resend-otp";
import { createSigninCommand } from "./commands/signin";
import { createVerifyOtpCommand } from "./commands/verify-otp";

// Import view factories
import { createAccountSimpleView } from "./views/account-simple";
import { createIpRegistrationsView } from "./views/ip-registrations";
import { createMyAccountView } from "./views/my-account";
import { createOtpCodesView } from "./views/otp-codes";
import { createPasswordCredentialsView } from "./views/password-credentials";
import { createUsedEmailsView } from "./views/used-emails";
import { createVerificationStatusView } from "./views/verification-status";

// Import account ID factory
import { createAccountId } from "./ids/account";

// Import listener factories
import { createOtpEmailSenderListener } from "./listeners/otp-email-sender";
import { createOtpGeneratorListener } from "./listeners/otp-generator";

export type AuthContextData = {
  name: string;
  customFields: ArcRawShape;
  sendOTP: (params: { account: any; otpCode: any }) => Promise<void>;
};

export const createAuthContext = <const Data extends AuthContextData>(
  data: Data
) => {
  const name = getTypeSafe(data, "name");
  const customFields = getTypeSafe(data, "customFields");
  // Create account ID type
  const accountId = createAccountId({ name });

  // Create events with proper custom fields integration
  const accountRegisteredEvent = accountRegistered({
    name,
    customFields,
    accountId,
  });
  const otpGeneratedEvent = otpGenerated({
    name,
    accountId,
  });
  const otpVerifiedEvent = otpVerified({
    name,
    accountId,
  });
  const passwordChangedEvent = passwordChanged({
    name,
    accountId,
  });
  const accountDeletedEvent = accountDeleted({
    name,
    accountId,
  });
  const profileUpdatedEvent = profileUpdated({
    name,
    accountId,
    customFields,
  });
  const signedInEvent = signedIn({
    name,
    accountId,
  });
  const otpEmailSentEvent = otpEmailSent({
    name,
    accountId,
  });

  // Create views using the new factory pattern
  const otpCodesView = createOtpCodesView({
    name,
    accountId,
    otpGenerated: otpGeneratedEvent,
    otpVerified: otpVerifiedEvent,
  });

  const myAccountView = createMyAccountView({
    name,
    customFields,
    accountId,
    accountRegistered: accountRegisteredEvent,
    otpVerified: otpVerifiedEvent,
    accountDeleted: accountDeletedEvent,
    profileUpdated: profileUpdatedEvent,
  });

  const passwordCredentialsView = createPasswordCredentialsView({
    name,
    accountId,
    accountRegistered: accountRegisteredEvent,
    passwordChanged: passwordChangedEvent,
    accountDeleted: accountDeletedEvent,
  });

  const verificationStatusView = createVerificationStatusView({
    name,
    accountId,
    accountRegistered: accountRegisteredEvent,
    otpVerified: otpVerifiedEvent,
  });

  const accountSimpleView = createAccountSimpleView({
    name,
    customFields,
    accountId,
    accountRegistered: accountRegisteredEvent,
    profileUpdated: profileUpdatedEvent,
    accountDeleted: accountDeletedEvent,
  });

  const usedEmailsView = createUsedEmailsView({
    name,
    accountId,
    accountRegistered: accountRegisteredEvent,
    accountDeleted: accountDeletedEvent,
  });

  const ipRegistrationsView = createIpRegistrationsView({
    name,
    accountRegistered: accountRegisteredEvent,
  });

  // Create commands using the new factory pattern
  const registerCommand = createRegisterCommand({
    name,
    customFields,
    accountId,
    accountRegistered: accountRegisteredEvent,
    usedEmailsView,
    ipRegistrationsView,
  });

  const verifyOtpCommand = createVerifyOtpCommand({
    name,
    otpVerified: otpVerifiedEvent,
    otpCodesView,
    verificationStatusView,
  });

  const changePasswordCommand = createChangePasswordCommand({
    name,
    passwordChanged: passwordChangedEvent,
    passwordCredentialsView,
  });

  const deleteAccountCommand = createDeleteAccountCommand({
    name,
    accountDeleted: accountDeletedEvent,
    passwordCredentialsView,
  });

  const signinCommand = createSigninCommand({
    name,
    signedIn: signedInEvent,
    passwordCredentialsView,
    verificationStatusView,
  });

  const resendOtpCommand = createResendOtpCommand({
    name,
    otpGenerated: otpGeneratedEvent,
    verificationStatusView,
    otpCodesView,
  });

  // Create listeners
  const otpGeneratorListener = createOtpGeneratorListener({
    name,
    customFields,
    accountRegistered: accountRegisteredEvent,
    otpGenerated: otpGeneratedEvent,
  });

  const otpEmailSenderListener = createOtpEmailSenderListener({
    name,
    customFields,
    otpGenerated: otpGeneratedEvent,
    otpEmailSent: otpEmailSentEvent,
    accountSimpleView,
    otpCodesView,
    sendOTP: data.sendOTP,
  });

  // Create context with all components
  const context = arcContext([
    // Events
    accountRegisteredEvent,
    otpGeneratedEvent,
    otpVerifiedEvent,
    otpEmailSentEvent,
    signedInEvent,
    passwordChangedEvent,
    accountDeletedEvent,
    profileUpdatedEvent,

    // Commands
    registerCommand,
    signinCommand,
    resendOtpCommand,
    verifyOtpCommand,
    changePasswordCommand,
    deleteAccountCommand,

    // Views
    otpCodesView,
    myAccountView,
    passwordCredentialsView,
    verificationStatusView,
    accountSimpleView,
    usedEmailsView,
    ipRegistrationsView,

    // Listeners (server-only)
    ...(ONLY_SERVER ? [otpGeneratorListener, otpEmailSenderListener] : []),
  ] as const);

  return { context, accountId };
};

export type AuthContext<Data extends AuthContextData = AuthContextData> =
  ReturnType<typeof createAuthContext<Data>>;
