import { date, event, string } from "@arcote.tech/arc";
import { orderId } from "../ids/order-id";

export type PaymentCompletedData = {
  moduleName: string;
};

export const paymentCompleted = <const Data extends PaymentCompletedData>(
  data: Data
) =>
  event(`${data.moduleName}PaymentCompleted`, {
    orderId,
    transactionId: string(),
    completedAt: date(),
  });

export type PaymentCompleted<
  Data extends PaymentCompletedData = PaymentCompletedData
> = ReturnType<typeof paymentCompleted<Data>>;

export type AnyPaymentCompleted = PaymentCompleted<any>;
