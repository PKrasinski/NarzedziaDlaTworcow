/// <reference path="../arc.types.ts" />

import {
  command,
  string,
  stringEnum,
  type ArcRawShape,
} from "@arcote.tech/arc";
import { AccountRegistered } from "../events/account-registered";
import { type AccountId } from "../ids/account";
import { capitalize } from "../utils/capitalize";
import { getTypeSafe } from "../utils/get";
import { type IpRegistrationsView } from "../views/ip-registrations";
import { type UsedEmailsView } from "../views/used-emails";

async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password);
}

export type RegisterCommandData = {
  name: string;
  customFields: ArcRawShape;
  accountRegistered: AccountRegistered;
  usedEmailsView: UsedEmailsView;
  ipRegistrationsView: IpRegistrationsView;
  accountId: AccountId;
};

export const createRegisterCommand = <const Data extends RegisterCommandData>(
  data: Data
) =>
  command(`register${capitalize(getTypeSafe(data, "name"))}Account`)
    .public()
    .use([
      data.accountRegistered,
      data.usedEmailsView,
      data.ipRegistrationsView,
    ])
    .withParams({
      ...getTypeSafe(data, "customFields"),
      email: string().email(),
      password: string().minLength(6).maxLength(32),
    })
    .withResult(
      {
        success: string(),
        email: string(),
      },
      {
        error: stringEnum("ACCOUNT_EXISTS", "IP_LIMIT_EXCEEDED"),
      }
    )
    .handle(
      ONLY_SERVER &&
        (async (ctx, formData) => {
          // Check if email is already used
          const emailExists = await ctx.get(data.usedEmailsView).findOne({
            email: formData.email,
          });

          if (emailExists) {
            return { error: "ACCOUNT_EXISTS" };
          }

          // Check IP registration limits - framework ensures ipAddress exists
          const clientIp = ctx.$auth.ipAddress as any;
          const ipRegistrationData = await ctx
            .get(data.ipRegistrationsView)
            .findOne({
              _id: clientIp,
            });

          if (ipRegistrationData) {
            // Calculate registrations in the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const recentRegistrations = ipRegistrationData.registrations.filter(
              (reg: any) => new Date(reg.registeredAt) > thirtyDaysAgo
            );

            if (recentRegistrations.length >= 2) {
              return { error: "IP_LIMIT_EXCEEDED" };
            }
          }

          const id = data.accountId.generate();
          const { password, ...rest } = formData;
          const passwordHash = await hashPassword(password);

          await ctx.get(data.accountRegistered).emit({
            accountId: id,
            passwordHash,
            ...rest,
          });

          return {
            success:
              "Registration successful. Please check your email for verification code.",
            email: formData.email,
          };
        })
    );

export type RegisterCommand<
  Data extends RegisterCommandData = RegisterCommandData
> = ReturnType<typeof createRegisterCommand<Data>>;
