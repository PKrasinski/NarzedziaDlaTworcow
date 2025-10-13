import { date, event, string } from "@arcote.tech/arc";
import { type AccountId } from "../ids/account";
import { getTypeSafe } from "../utils/get";

export type SignedInData = {
  name: string;
  accountId: AccountId;
};

export const signedIn = <const Data extends SignedInData>(data: Data) =>
  event(`${getTypeSafe(data, "name")}SignedIn`, {
    accountId: data.accountId,
    email: string().email(),
    signedInAt: date(),
  });

export type SignedIn<Data extends SignedInData = SignedInData> = ReturnType<
  typeof signedIn<Data>
>;
