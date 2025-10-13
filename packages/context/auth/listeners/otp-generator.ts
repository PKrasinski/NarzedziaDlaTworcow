/// <reference path="../arc.types.ts" />

import { listener, type ArcRawShape } from "@arcote.tech/arc";
import { AccountRegistered } from "../events/account-registered";
import { OtpGenerated } from "../events/otp-generated";
import { getTypeSafe } from "../utils/get";

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

export type OtpGeneratorListener<
  Data extends OtpGeneratorListenerData = OtpGeneratorListenerData
> = ReturnType<typeof createOtpGeneratorListener<Data>>;
