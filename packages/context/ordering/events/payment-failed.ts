import { date, event, string } from "@arcote.tech/arc";
import { orderId } from "../ids/order-id";

export type PaymentFailedData = {
  moduleName: string;
};

export const paymentFailed = <const Data extends PaymentFailedData>(
  data: Data
) =>
  event(`${data.moduleName}PaymentFailed`, {
    orderId,
    transactionId: string(),
    reason: string(),
    failedAt: date(),
  });

export type PaymentFailed<Data extends PaymentFailedData = PaymentFailedData> =
  ReturnType<typeof paymentFailed<Data>>;

export type AnyPaymentFailed = PaymentFailed<any>;
