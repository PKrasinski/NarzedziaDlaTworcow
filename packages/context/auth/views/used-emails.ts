import { object, string, view } from "@arcote.tech/arc";
import { AccountDeleted } from "../events/account-deleted";
import { AccountRegistered } from "../events/account-registered";
import { type AccountId } from "../ids/account";
import { getTypeSafe } from "../utils/get";

export type UsedEmailsViewData = {
  name: string;
  accountId: AccountId;
  accountRegistered: AccountRegistered;
  accountDeleted: AccountDeleted;
};

export const createUsedEmailsView = <const Data extends UsedEmailsViewData>(
  data: Data
) =>
  view(
    `${getTypeSafe(data, "name")}UsedEmails`,
    data.accountId,
    object({
      email: string().email(),
    })
  )
    .handleEvent(data.accountRegistered, async (ctx, event) => {
      await ctx.set(event.payload.accountId, {
        email: event.payload.email,
      });
    })
    .handleEvent(data.accountDeleted, async (ctx, event) => {
      await ctx.remove(event.payload.accountId);
    });

export type UsedEmailsView<
  Data extends UsedEmailsViewData = UsedEmailsViewData
> = ReturnType<typeof createUsedEmailsView<Data>>;
