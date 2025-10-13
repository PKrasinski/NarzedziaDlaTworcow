import { array, number, object, string, view } from "@arcote.tech/arc";
import { AccountDeleted } from "../events/account-deleted";
import { AccountRegistered } from "../events/account-registered";
import { PasswordChanged } from "../events/password-changed";
import { type AccountId } from "../ids/account";
import { getTypeSafe } from "../utils/get";

export type PasswordCredentialsViewData = {
  name: string;
  accountId: AccountId;
  accountRegistered: AccountRegistered;
  passwordChanged: PasswordChanged;
  accountDeleted: AccountDeleted;
};

export const createPasswordCredentialsView = <
  const Data extends PasswordCredentialsViewData
>(
  data: Data
) =>
  view(
    `${getTypeSafe(data, "name")}PasswordCredentials`,
    data.accountId,
    object({
      login: string(),
      password: string(),
      failedAttempts: array(
        object({
          timestamp: number(),
          ip: string(),
        })
      ),
    })
  )
    .handleEvent(data.accountRegistered, async (ctx, event) => {
      await ctx.set(event.payload.accountId, {
        login: event.payload.email,
        password: event.payload.passwordHash,
        failedAttempts: [],
      });
    })
    .handleEvent(data.passwordChanged, async (ctx, event) => {
      const existing = await ctx.findOne({ _id: event.payload.accountId });
      if (existing) {
        await ctx.set(event.payload.accountId, {
          ...existing,
          password: event.payload.passwordHash,
        });
      }
    })
    .handleEvent(data.accountDeleted, async (ctx, event) => {
      await ctx.remove(event.payload.accountId);
    });

export type PasswordCredentialsView<
  Data extends PasswordCredentialsViewData = PasswordCredentialsViewData
> = ReturnType<typeof createPasswordCredentialsView<Data>>;
