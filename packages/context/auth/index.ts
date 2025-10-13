import { createAuthContext } from "./auth";
import { SendOTP, SendOTPParams } from "./utils/send-otp";
import { boolean, string, stringEnum } from "@arcote.tech/arc";
import { emailTemplate } from "../utils/email-template";
import { smtpSender } from "../utils/smtp-sender";

// Define custom fields based on existing user object structure
const customFields = {
  // User profile and persona
  persona: stringEnum("creator", "business", "editor", "beginner"),
  nameAndSurname: string().minLength(1).maxLength(100),

  // GDPR and legal
  rodoConsent: boolean().hasToBeTrue(),

  // Marketing preferences
  marketingConsent: boolean(),
} as const;

// Send OTP email function using existing SMTP infrastructure
const sendOTP = async (params: SendOTPParams) => {
  const { account, otpCode } = params;

  const emailHtml = emailTemplate({
    title: "Kod weryfikacyjny - narzędzia dla twórców",
    content: `
      <h2>Twój kod weryfikacyjny</h2>
      <p>Cześć ${(account as any).nameAndSurname || account.email}!</p>
      <p>Oto kod weryfikacyjny do aktywacji Twojego konta:</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; border: 2px dashed #dee2e6;">
        ${otpCode.otpCode}
      </div>
      <p>Kod jest ważny przez 15 minut.</p>
      <p>Jeśli nie rejestrowałeś się na naszej platformie, zignoruj tę wiadomość.</p>
      <p>Pozdrawiamy,<br/>Zespół narzędzia dla twórców</p>
    `,
  });

  await smtpSender.sendEmail({
    to: account.email,
    subject: "Kod weryfikacyjny - narzędzia dla twórców",
    html: emailHtml,
  });
};

// Create the auth context with 'user' name and custom fields
const { context, accountId } = createAuthContext({
  name: "user",
  customFields,
  sendOTP: (ONLY_SERVER && sendOTP) as any,
});

export const authContext = context;
export const userId = accountId;

// Export types for use throughout the application
export type AuthContext = typeof authContext;
