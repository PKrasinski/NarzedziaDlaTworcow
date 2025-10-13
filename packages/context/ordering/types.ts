import type { $type, ArcContextElementAny } from "@arcote.tech/arc";
import { PaymentCompleted } from "./events/payment-completed";
import { PaymentFailed } from "./events/payment-failed";
import { AnyOrder } from "./objects/order";

export interface PaymentConfig {
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentGatewayClient {
  readonly name: string;
  createPaymentSession(order: $type<AnyOrder>): Promise<{
    sessionId: string;
    redirectUrl: string;
  }>;
}

export type PaymentGateway = PaymentGatewayClient & {
  getContextElements?(): ArcContextElementAny[];
};

export interface PaymentGatewayEvents {
  paymentCompleted: PaymentCompleted;
  paymentFailed: PaymentFailed;
}

export type PaymentGatewayBuilder = (
  events: PaymentGatewayEvents
) => PaymentGateway;
