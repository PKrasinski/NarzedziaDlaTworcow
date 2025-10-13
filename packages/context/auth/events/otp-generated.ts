import { date, event, string } from "@arcote.tech/arc";
import { type AccountId } from "../ids/account";
import { getTypeSafe } from "../utils/get";

export type OtpGeneratedData = {
  name: string;
  accountId: AccountId;
};

export const otpGenerated = <const Data extends OtpGeneratedData>(data: Data) =>
  event(`${getTypeSafe(data, "name")}OtpGenerated`, {
    accountId: data.accountId,
    email: string().email(),
    otpCode: string(),
    expiresAt: date(),
  });

export type OtpGenerated<Data extends OtpGeneratedData = OtpGeneratedData> =
  ReturnType<typeof otpGenerated<Data>>;
