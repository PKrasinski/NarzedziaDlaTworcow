/// <reference path="../arc.types.ts" />

import {
  command,
  string,
  stringEnum,
} from "@arcote.tech/arc";
import { OtpGenerated } from "../events/otp-generated";
import { capitalize } from "../utils/capitalize";
import { getTypeSafe } from "../utils/get";
import { type OtpCodesView } from "../views/otp-codes";
import { type VerificationStatusView } from "../views/verification-status";

function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export type ResendOtpCommandData = {
  name: string;
  otpGenerated: OtpGenerated;
  verificationStatusView: VerificationStatusView;
  otpCodesView: OtpCodesView;
};

export const createResendOtpCommand = <const Data extends ResendOtpCommandData>(
  data: Data
) =>
  command(`resend${capitalize(getTypeSafe(data, "name"))}Otp`)
    .public()
    .use([
      data.otpGenerated,
      data.verificationStatusView,
      data.otpCodesView,
    ])
    .withParams({
      email: string().email(),
    })
    .withResult(
      {
        success: string(),
      },
      {
        error: stringEnum(
          "ACCOUNT_NOT_FOUND",
          "ALREADY_VERIFIED",
          "OTP_CODE_RESENT_TOO_SOON"
        ),
      }
    )
    .handle(
      ONLY_SERVER &&
        (async (ctx, { email }) => {
          // Find account by email
          const accountStatus = await ctx
            .get(data.verificationStatusView)
            .findOne({
              email: email,
            });

          if (!accountStatus) {
            return { error: "ACCOUNT_NOT_FOUND" };
          }

          // Check if already verified
          if (accountStatus.isEmailVerified) {
            return { error: "ALREADY_VERIFIED" };
          }

          // Check rate limiting (3-minute cooldown)
          const existingOtp = await ctx.get(data.otpCodesView).findOne({
            email,
          });

          if (
            existingOtp &&
            new Date(existingOtp.generatedAt).getTime() + 3 * 60 * 1000 > Date.now()
          ) {
            return { error: "OTP_CODE_RESENT_TOO_SOON" };
          }

          // Generate new OTP code
          const newOtpCode = generateOtpCode();

          // Set expiration time (15 minutes from now)
          const expiresAt = new Date();
          expiresAt.setMinutes(expiresAt.getMinutes() + 15);

          // Emit OTP generated event - the listener will handle sending the email
          await ctx.get(data.otpGenerated).emit({
            accountId: accountStatus._id,
            email: email,
            otpCode: newOtpCode,
            expiresAt,
          });

          return { success: "OTP code has been resent to your email" };
        })
    );

export type ResendOtpCommand<
  Data extends ResendOtpCommandData = ResendOtpCommandData
> = ReturnType<typeof createResendOtpCommand<Data>>;
