import { event, string } from "@arcote.tech/arc";
import { type AccountId } from "../ids/account";
import { getTypeSafe } from "../utils/get";

export type OtpEmailSentData = {
  name: string;
  accountId: AccountId;
};

export const otpEmailSent = <const Data extends OtpEmailSentData>(data: Data) =>
  event(`${getTypeSafe(data, "name")}OtpEmailSent`, {
    accountId: data.accountId,
    email: string().email(),
    otpCode: string(),
  });

export type OtpEmailSent<Data extends OtpEmailSentData = OtpEmailSentData> =
  ReturnType<typeof otpEmailSent<Data>>;
