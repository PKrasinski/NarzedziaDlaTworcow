import { ArcViewRecord } from "@arcote.tech/arc";
import { AccountSimpleView } from "../views/account-simple";
import { OtpCodesView } from "../views/otp-codes";

export type SendOTPParams = {
  account: ArcViewRecord<AccountSimpleView>;
  otpCode: ArcViewRecord<OtpCodesView>;
};

export type SendOTP = (params: SendOTPParams) => Promise<void>;
