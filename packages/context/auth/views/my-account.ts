import {
  boolean,
  object,
  string,
  view,
  type ArcRawShape,
} from "@arcote.tech/arc";
import { AccountDeleted } from "../events/account-deleted";
import { AccountRegistered } from "../events/account-registered";
import { OtpVerified } from "../events/otp-verified";
import { ProfileUpdated } from "../events/profile-updated";
import { type AccountId } from "../ids/account";
import { capitalize } from "../utils/capitalize";
import { getTypeSafe } from "../utils/get";

export type MyAccountViewData = {
  name: string;
  customFields: ArcRawShape;
  accountId: AccountId;
  accountRegistered: AccountRegistered;
  otpVerified: OtpVerified;
  accountDeleted: AccountDeleted;
  profileUpdated: ProfileUpdated;
};

export const createMyAccountView = <const Data extends MyAccountViewData>(
  data: Data
) =>
  view(
    `my${capitalize(getTypeSafe(data, "name"))}Account`,
    data.accountId,
    object({
      email: string().email(),
      isEmailVerified: boolean(),
      hasActivatedAccount: boolean(),
      hasCompletedOnboarding: boolean(),
      ...data.customFields,
    })
  )
    .handleEvent(data.accountRegistered, async (ctx, event) => {
      const { accountId, email, passwordHash, ...customFieldValues } =
        event.payload;

      await ctx.set(accountId, {
        email,
        isEmailVerified: false,
        hasActivatedAccount: false,
        hasCompletedOnboarding: false,
        ...customFieldValues,
      });
    })
    .handleEvent(data.otpVerified, async (ctx, event) => {
      const existing = await ctx.findOne({ _id: event.payload.accountId });
      if (existing) {
        await ctx.set(event.payload.accountId, {
          ...existing,
          isEmailVerified: true,
        });
      }
    })
    .handleEvent(data.profileUpdated, async (ctx, event) => {
      const { accountId, ...updateFields } = event.payload;
      await ctx.modify(accountId, updateFields);
    })
    .handleEvent(data.accountDeleted, async (ctx, event) => {
      await ctx.remove(event.payload.accountId);
    });

export type MyAccountView<Data extends MyAccountViewData = MyAccountViewData> =
  ReturnType<typeof createMyAccountView<Data>>;
