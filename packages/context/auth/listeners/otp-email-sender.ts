/// <reference path="../arc.types.ts" />

import { listener, type ArcRawShape } from "@arcote.tech/arc";
import { OtpEmailSent } from "../events/otp-email-sent";
import { OtpGenerated } from "../events/otp-generated";
import { getTypeSafe } from "../utils/get";
import { SendOTP } from "../utils/send-otp";
import { type AccountSimpleView } from "../views/account-simple";
import { type OtpCodesView } from "../views/otp-codes";

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
      // Handle otpGenerated events - send OTP emails
      const payload = event.payload;

      // Get account record from view
      const account = await ctx.get(data.accountSimpleView).findOne({
        _id: payload.accountId,
      });

      // Get OTP record from view
      const otpRecord = await ctx.get(data.otpCodesView).findOne({
        _id: payload.accountId,
      });

      if (!account || !otpRecord) return;

      // Send the email using the configured sendOTP function
      await data.sendOTP({ account, otpCode: otpRecord });

      // Log that email was sent
      await ctx.get(data.otpEmailSent).emit({
        accountId: payload.accountId,
        email: payload.email,
        otpCode: payload.otpCode,
      });
    });

export type OtpEmailSenderListener<
  Data extends OtpEmailSenderListenerData = OtpEmailSenderListenerData
> = ReturnType<typeof createOtpEmailSenderListener<Data>>;
