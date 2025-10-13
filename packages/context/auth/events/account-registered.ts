import { event, string, type ArcRawShape } from "@arcote.tech/arc";
import { type AccountId } from "../ids/account";
import { getTypeSafe } from "../utils/get";

export type AccountRegisteredData = {
  name: string;
  customFields: ArcRawShape;
  accountId: AccountId<any>;
};

export const accountRegistered = <const Data extends AccountRegisteredData>(
  data: Data
) =>
  event(`${getTypeSafe(data, "name")}AccountRegistered`, {
    accountId: getTypeSafe(data, "accountId"),
    email: string().email(),
    passwordHash: string(),
    ...data.customFields,
  });

export type AccountRegistered<
  Data extends AccountRegisteredData = AccountRegisteredData
> = ReturnType<typeof accountRegistered<Data>>;

export type AccountRegisteredAny = AccountRegistered<{
  name: string;
  customFields: ArcRawShape;
  accountId: AccountId;
}>;
