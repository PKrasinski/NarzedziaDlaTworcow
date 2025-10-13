import nodemailer from "nodemailer";
import {
  createOtpEmailTemplate,
  createResendOtpEmailTemplate,
} from "./email-template";

// SMTP configuration for OVH (working configuration)
const smtpConfig = {
  host: "ssl0.ovh.net",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "bot@narzedziadlatworcow.pl",
    pass: "yPvSGc3gdF!FHLv",
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
  tls: {
    rejectUnauthorized: false,
    servername: "ssl0.ovh.net",
  },
  pool: false,
  maxConnections: 1,
};

// Function to create transporter when needed
function createTransporter() {
  return nodemailer.createTransport(smtpConfig);
}

export interface EmailOptions {
  to: string;
  subject?: string;
  name: string;
  otpCode: string;
}

export interface ResendEmailOptions {
  to: string;
  otpCode: string;
}

export async function sendOtpEmail({
  to,
  name,
  otpCode,
}: EmailOptions): Promise<void> {
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Create transporter only when sending email
      const transporter = createTransporter();
      const htmlContent = createOtpEmailTemplate(name, otpCode);

      const mailOptions = {
        from: {
          name: "NarzędziaDlaTwórców.pl",
          address: "bot@narzedziadlatworcow.pl",
        },
        to: to,
        subject: `${otpCode} - kod weryfikacyjny - Narzędzia dla Twórców`,
        html: htmlContent,
        // Text fallback for email clients that don't support HTML
        text: `
Cześć ${name}!

Dzięki za rejestrację w NarzędziaDlaTwórców.pl!

Twój kod weryfikacyjny: ${otpCode}

Kod wygasa za 15 minut.

Aby dokończyć rejestrację:
1. Wróć do strony rejestracji
2. Wprowadź kod: ${otpCode}
3. Kliknij "Zweryfikuj email"

Jeśli to nie Ty rejestrowałeś się na naszej platformie, zignoruj tę wiadomość.

--
Zespół NarzędziaDlaTwórców.pl
https://narzedziadlatworcow.pl
        `.trim(),
        // Email headers for better deliverability
        headers: {
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
          "X-Mailer": "NarzędziaDlaTwórców.pl",
          "X-Auto-Response-Suppress": "OOF, DR, RN, NRN, AutoReply",
        },
      };

      await transporter.sendMail(mailOptions);

      // Close the transporter connection after sending
      transporter.close();

      return; // Success, exit retry loop
    } catch (error: any) {
      lastError = error;
      console.error(
        `❌ Failed to send OTP email (attempt ${attempt}/${maxRetries}):`,
        {
          error: error.message,
          code: error.code,
          to: to,
        }
      );

      // If this is not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // If we get here, all retries failed
  console.error("🚨 All retry attempts failed:", lastError);
  throw new Error(
    `Email sending failed after ${maxRetries} attempts: ${
      lastError?.message || lastError
    }`
  );
}

// Function to send resend OTP email with different content
// Export an smtpSender object that matches the auth context expectations
export const smtpSender = {
  sendEmail: async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: "NarzędziaDlaTwórców.pl",
        address: "bot@narzedziadlatworcow.pl",
      },
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    transporter.close();
  }
};

export async function sendResendOtpEmail({
  to,
  otpCode,
}: ResendEmailOptions): Promise<void> {
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Create transporter only when sending email
      const transporter = createTransporter();
      const htmlContent = createResendOtpEmailTemplate(otpCode);

      const mailOptions = {
        from: {
          name: "NarzędziaDlaTwórców.pl",
          address: "bot@narzedziadlatworcow.pl",
        },
        to: to,
        subject: `${otpCode} - kod weryfikacyjny - Narzędzia dla Twórców`,
        html: htmlContent,
        // Text fallback for email clients that don't support HTML
        text: `
Nowy kod weryfikacyjny: ${otpCode}

Kod wygasa za 15 minut.

Wprowadź kod na stronie weryfikacji, aby dokończyć rejestrację.

--
Zespół NarzędziaDlaTwórców.pl
https://narzedziadlatworcow.pl
        `.trim(),
        // Email headers for better deliverability
        headers: {
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
          "X-Mailer": "NarzędziaDlaTwórców.pl",
          "X-Auto-Response-Suppress": "OOF, DR, RN, NRN, AutoReply",
        },
      };

      await transporter.sendMail(mailOptions);

      // Close the transporter connection after sending
      transporter.close();

      return; // Success, exit retry loop
    } catch (error: any) {
      lastError = error;
      console.error(
        `❌ Failed to send resend OTP email (attempt ${attempt}/${maxRetries}):`,
        {
          error: error.message,
          code: error.code,
          to: to,
        }
      );

      // If this is not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // If we get here, all retries failed
  console.error("🚨 All retry attempts failed:", lastError);
  throw new Error(
    `Resend email sending failed after ${maxRetries} attempts: ${
      lastError?.message || lastError
    }`
  );
}
