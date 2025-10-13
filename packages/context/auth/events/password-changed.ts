import { event, string } from "@arcote.tech/arc";
import { type AccountId } from "../ids/account";
import { getTypeSafe } from "../utils/get";

export type PasswordChangedData = {
  name: string;
  accountId: AccountId;
};

export const passwordChanged = <const Data extends PasswordChangedData>(
  data: Data
) =>
  event(`${getTypeSafe(data, "name")}PasswordChanged`, {
    accountId: data.accountId,
    passwordHash: string(),
  });

export type PasswordChanged<
  Data extends PasswordChangedData = PasswordChangedData
> = ReturnType<typeof passwordChanged<Data>>;
