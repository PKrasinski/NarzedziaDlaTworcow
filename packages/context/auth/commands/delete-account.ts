/// <reference path="../arc.types.ts" />

import { command, string, stringEnum } from "@arcote.tech/arc";
import { AccountDeleted } from "../events/account-deleted";
import { capitalize } from "../utils/capitalize";
import { getTypeSafe } from "../utils/get";
import { type PasswordCredentialsView } from "../views/password-credentials";

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}

export type DeleteAccountCommandData = {
  name: string;
  accountDeleted: AccountDeleted;
  passwordCredentialsView: PasswordCredentialsView;
};

export const createDeleteAccountCommand = <
  const Data extends DeleteAccountCommandData
>(
  data: Data
) =>
  command(`delete${capitalize(getTypeSafe(data, "name"))}Account`)
    .use([data.accountDeleted, data.passwordCredentialsView])
    .withParams({
      password: string(),
    })
    .withResult(
      {
        success: string(),
      },
      {
        error: stringEnum("INVALID_PASSWORD"),
      }
    )
    .handle(
      ONLY_SERVER &&
        (async (ctx, { password }) => {
          // Get current password hash for verification
          const credentials = await ctx
            .get(data.passwordCredentialsView)
            .findOne({
              _id: (ctx as any).$auth.userId,
            });

          if (!credentials) {
            return { error: "INVALID_PASSWORD" };
          }

          // Verify password
          const isPasswordValid = await verifyPassword(
            password,
            credentials.password
          );

          if (!isPasswordValid) {
            return { error: "INVALID_PASSWORD" };
          }

          // Emit account deleted event
          await ctx.get(data.accountDeleted).emit({
            accountId: (ctx as any).$auth.userId,
            deletedAt: new Date(),
          });

          return {
            success: "Account deleted successfully",
          };
        })
    );

export type DeleteAccountCommand<
  Data extends DeleteAccountCommandData = DeleteAccountCommandData
> = ReturnType<typeof createDeleteAccountCommand<Data>>;
