import { event, string } from "@arcote.tech/arc";
import { type AccountId } from "../ids/account";
import { getTypeSafe } from "../utils/get";

export type OtpVerifiedData = {
  name: string;
  accountId: AccountId;
};

export const otpVerified = <const Data extends OtpVerifiedData>(data: Data) =>
  event(`${getTypeSafe(data, "name")}OtpVerified`, {
    accountId: data.accountId,
    email: string().email(),
  });

export type OtpVerified<Data extends OtpVerifiedData = OtpVerifiedData> =
  ReturnType<typeof otpVerified<Data>>;
