import { boolean, date, object, string, view } from "@arcote.tech/arc";
import { AccountRegistered } from "../events/account-registered";
import { OtpVerified } from "../events/otp-verified";
import { type AccountId } from "../ids/account";
import { getTypeSafe } from "../utils/get";

export type VerificationStatusViewData = {
  name: string;
  accountId: AccountId;
  accountRegistered: AccountRegistered;
  otpVerified: OtpVerified;
};

export const createVerificationStatusView = <
  const Data extends VerificationStatusViewData
>(
  data: Data
) =>
  view(
    `${getTypeSafe(data, "name")}VerificationStatus`,
    data.accountId,
    object({
      email: string().email(),
      isEmailVerified: boolean(),
      verifiedAt: date().optional(),
    })
  )
    .handleEvent(data.accountRegistered, async (ctx, event) => {
      await ctx.set(event.payload.accountId, {
        email: event.payload.email,
        isEmailVerified: false,
        verifiedAt: null,
      });
    })
    .handleEvent(data.otpVerified, async (ctx, event) => {
      await ctx.modify(event.payload.accountId, {
        isEmailVerified: true,
        verifiedAt: new Date(),
      });
    });

export type VerificationStatusView<
  Data extends VerificationStatusViewData = VerificationStatusViewData
> = ReturnType<typeof createVerificationStatusView<Data>>;
