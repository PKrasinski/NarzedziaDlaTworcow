import { boolean, date, object, string, view } from "@arcote.tech/arc";
import { OtpGenerated } from "../events/otp-generated";
import { OtpVerified } from "../events/otp-verified";
import { type AccountId } from "../ids/account";
import { getTypeSafe } from "../utils/get";

export type OtpCodesViewData = {
  name: string;
  accountId: AccountId;
  otpGenerated: OtpGenerated;
  otpVerified: OtpVerified;
};

export const createOtpCodesView = <const Data extends OtpCodesViewData>(
  data: Data
) =>
  view(
    `${getTypeSafe(data, "name")}OtpCodes`,
    data.accountId,
    object({
      email: string().email(),
      otpCode: string(),
      expiresAt: date(),
      generatedAt: date(),
      isUsed: boolean(),
      verifiedAt: date().optional(),
    })
  )
    .handleEvent(data.otpGenerated, async (ctx, event) => {
      await ctx.set(event.payload.accountId, {
        email: event.payload.email,
        otpCode: event.payload.otpCode,
        expiresAt: event.payload.expiresAt,
        generatedAt: event.createdAt,
        isUsed: false,
        verifiedAt: null,
      });
    })
    .handleEvent(data.otpVerified, async (ctx, event) => {
      const existing = await ctx.findOne({ _id: event.payload.accountId });
      if (existing) {
        await ctx.set(event.payload.accountId, {
          ...existing,
          isUsed: true,
          verifiedAt: new Date(),
        });
      }
    });

export type OtpCodesView<Data extends OtpCodesViewData = OtpCodesViewData> =
  ReturnType<typeof createOtpCodesView<Data>>;
