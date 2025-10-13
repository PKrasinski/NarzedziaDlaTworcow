/// <reference path="../arc.types.ts" />

import { command, string, stringEnum } from "@arcote.tech/arc";
import { SignedIn } from "../events/signed-in";
import { capitalize } from "../utils/capitalize";
import { getTypeSafe } from "../utils/get";
import { generateToken } from "../utils/jwt";
import { type PasswordCredentialsView } from "../views/password-credentials";
import { type VerificationStatusView } from "../views/verification-status";

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}

export type SigninCommandData = {
  name: string;
  signedIn: SignedIn;
  passwordCredentialsView: PasswordCredentialsView;
  verificationStatusView: VerificationStatusView;
};

export const createSigninCommand = <const Data extends SigninCommandData>(
  data: Data
) =>
  command(`signIn${capitalize(getTypeSafe(data, "name"))}`)
    .public()
    .use([
      data.signedIn,
      data.passwordCredentialsView,
      data.verificationStatusView,
    ])
    .withParams({
      email: string().email(),
      password: string().minLength(6).maxLength(32),
    })
    .withResult(
      {
        token: string(),
      },
      {
        error: stringEnum("INVALID_EMAIL_OR_PASSWORD"),
      },
      {
        error: stringEnum("EMAIL_NOT_VERIFIED"),
        email: string(),
      }
    )
    .handle(
      ONLY_SERVER &&
        (async (ctx, { email, password }) => {
          // Find account by email
          const account = await ctx.get(data.passwordCredentialsView).findOne({
            login: email,
          });

          if (!account) {
            return {
              error: "INVALID_EMAIL_OR_PASSWORD",
            };
          }

          const isPasswordValid = await verifyPassword(
            password,
            account.password
          );

          if (!isPasswordValid) {
            return {
              error: "INVALID_EMAIL_OR_PASSWORD",
            };
          }

          // Check email verification status
          const verificationStatus = await ctx
            .get(data.verificationStatusView)
            .findOne({
              _id: account._id,
            });

          // If account hasn't verified their email yet
          if (!verificationStatus || !verificationStatus.isEmailVerified) {
            return {
              error: "EMAIL_NOT_VERIFIED",
              email,
            };
          }

          const token = generateToken(account._id);

          await ctx.get(data.signedIn).emit({
            accountId: account._id,
            email,
            signedInAt: new Date(),
          });

          return {
            token,
          };
        })
    );

export type SigninCommand<Data extends SigninCommandData = SigninCommandData> =
  ReturnType<typeof createSigninCommand<Data>>;
