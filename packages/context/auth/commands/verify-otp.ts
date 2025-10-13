/// <reference path="../arc.types.ts" />

import { command, string, stringEnum } from "@arcote.tech/arc";
import { OtpVerified } from "../events/otp-verified";
import { capitalize } from "../utils/capitalize";
import { getTypeSafe } from "../utils/get";
import { generateToken } from "../utils/jwt";
import { type OtpCodesView } from "../views/otp-codes";
import { type VerificationStatusView } from "../views/verification-status";
export type VerifyOtpCommandData = {
  name: string;
  otpVerified: OtpVerified;
  otpCodesView: OtpCodesView;
  verificationStatusView: VerificationStatusView;
};

export const createVerifyOtpCommand = <const Data extends VerifyOtpCommandData>(
  data: Data
) =>
  command(`verify${capitalize(getTypeSafe(data, "name"))}Otp`)
    .public()
    .use([data.otpVerified, data.otpCodesView, data.verificationStatusView])
    .withParams({
      email: string().email(),
      otpCode: string().minLength(6).maxLength(6),
    })
    .withResult(
      {
        token: string(),
      },
      {
        error: stringEnum("INVALID_OTP", "OTP_EXPIRED", "ACCOUNT_NOT_FOUND"),
      }
    )
    .handle(
      ONLY_SERVER &&
        (async (ctx, { email, otpCode }) => {
          // Find account by email in verification status
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
            // If already verified, just generate token
            const token = generateToken(accountStatus._id);
            return { token };
          }

          // Get the OTP code for this account
          const storedOtp = await ctx.get(data.otpCodesView).findOne({
            _id: accountStatus._id,
          });

          if (!storedOtp) {
            return { error: "INVALID_OTP" };
          }

          // Check if OTP is already used
          if (storedOtp.isUsed) {
            return { error: "INVALID_OTP" };
          }

          // Check if OTP has expired
          if (new Date() > storedOtp.expiresAt) {
            return { error: "OTP_EXPIRED" };
          }

          // Check if OTP code matches
          if (storedOtp.otpCode !== otpCode) {
            return { error: "INVALID_OTP" };
          }

          // OTP is valid, mark as verified
          await ctx.get(data.otpVerified).emit({
            accountId: accountStatus._id,
            email: email,
          });

          // Generate JWT token
          const token = generateToken(accountStatus._id);

          return { token };
        })
    );

export type VerifyOtpCommand<
  Data extends VerifyOtpCommandData = VerifyOtpCommandData
> = ReturnType<typeof createVerifyOtpCommand<Data>>;
