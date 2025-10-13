/// <reference path="../arc.types.ts" />

import { command, string, stringEnum } from "@arcote.tech/arc";
import { PasswordChanged } from "../events/password-changed";
import { capitalize } from "../utils/capitalize";
import { getTypeSafe } from "../utils/get";
import { type PasswordCredentialsView } from "../views/password-credentials";

async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password);
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}

export type ChangePasswordCommandData = {
  name: string;
  passwordChanged: PasswordChanged;
  passwordCredentialsView: PasswordCredentialsView;
};

export const createChangePasswordCommand = <
  const Data extends ChangePasswordCommandData
>(
  data: Data
) =>
  command(`change${capitalize(getTypeSafe(data, "name"))}Password`)
    .use([data.passwordChanged, data.passwordCredentialsView])
    .withParams({
      currentPassword: string(),
      newPassword: string().minLength(6).maxLength(32),
    })
    .withResult(
      {
        success: string(),
      },
      {
        error: stringEnum("INVALID_CURRENT_PASSWORD"),
      }
    )
    .handle(
      ONLY_SERVER &&
        (async (ctx, { currentPassword, newPassword }) => {
          const userId = (ctx.$auth as any).userId;
          // Get current password hash
          const credentials = await ctx
            .get(data.passwordCredentialsView)
            .findOne({
              _id: userId,
            });

          if (!credentials) {
            return { error: "INVALID_CURRENT_PASSWORD" };
          }

          // Verify current password
          const isCurrentPasswordValid = await verifyPassword(
            currentPassword,
            credentials.password
          );

          if (!isCurrentPasswordValid) {
            return { error: "INVALID_CURRENT_PASSWORD" };
          }

          // Hash new password
          const newPasswordHash = await hashPassword(newPassword);

          // Emit password changed event
          await ctx.get(data.passwordChanged).emit({
            accountId: userId,
            passwordHash: newPasswordHash,
          });

          return {
            success: "Password changed successfully",
          };
        })
    );

export type ChangePasswordCommand<
  Data extends ChangePasswordCommandData = ChangePasswordCommandData
> = ReturnType<typeof createChangePasswordCommand<Data>>;
