import { date, event, string } from "@arcote.tech/arc";
import { orderId } from "../ids/order-id";

export type PaymentSessionCreatedData = {
  moduleName: string;
};

export const paymentSessionCreated = <
  const Data extends PaymentSessionCreatedData
>(
  data: Data
) =>
  event(`${data.moduleName}PaymentSessionCreated`, {
    orderId,
    sessionId: string(),
    gatewayType: string(),
    redirectUrl: string(),
    createdAt: date(),
  });

export type PaymentSessionCreated<
  Data extends PaymentSessionCreatedData = PaymentSessionCreatedData
> = ReturnType<typeof paymentSessionCreated<Data>>;

export type AnyPaymentSessionCreated = PaymentSessionCreated<any>;
