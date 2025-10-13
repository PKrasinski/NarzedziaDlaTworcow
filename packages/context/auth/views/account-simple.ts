import {
  object,
  string,
  view,
  type ArcRawShape,
} from "@arcote.tech/arc";
import { getTypeSafe } from "../utils/get";
import { AccountRegistered } from "../events/account-registered";
import { ProfileUpdated } from "../events/profile-updated";
import { AccountDeleted } from "../events/account-deleted";
import { type AccountId } from "../ids/account";

export type AccountSimpleViewData = {
  name: string;
  customFields: ArcRawShape;
  accountId: AccountId;
  accountRegistered: AccountRegistered;
  profileUpdated: ProfileUpdated;
  accountDeleted: AccountDeleted;
};

export const createAccountSimpleView = <const Data extends AccountSimpleViewData>(
  data: Data
) =>
  view(
    `${getTypeSafe(data, "name")}AccountSimple`,
    data.accountId,
    object({
      email: string().email(),
      ...data.customFields,
    })
  )
    .handleEvent(data.accountRegistered, async (ctx, event) => {
      const { accountId, passwordHash, ...accountData } = event.payload;
      await ctx.set(accountId, accountData);
    })
    .handleEvent(data.profileUpdated, async (ctx, event) => {
      const { accountId, ...updateFields } = event.payload;
      await ctx.modify(accountId, updateFields);
    })
    .handleEvent(data.accountDeleted, async (ctx, event) => {
      await ctx.remove(event.payload.accountId);
    });

export type AccountSimpleView<Data extends AccountSimpleViewData = AccountSimpleViewData> =
  ReturnType<typeof createAccountSimpleView<Data>>;