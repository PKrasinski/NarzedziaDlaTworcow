import { $type, route } from "@arcote.tech/arc";
import Stripe from "stripe";
import { AnyOrder } from "../objects/order";
import type {
  PaymentConfig,
  PaymentGateway,
  PaymentGatewayBuilder,
  PaymentGatewayEvents,
} from "../types";

export interface StripeSessionInfo {
  sessionId: string;
  paymentStatus: string;
  paymentIntentId?: string;
  customerEmail?: string | null;
  amountTotal?: number;
  metadata?: Record<string, string>;
}

export class StripePaymentGateway implements PaymentGateway {
  readonly name = "stripe";
  private stripe: Stripe;

  constructor(
    private stripeSecretKey: string,
    private webhookSecret: string,
    private config: PaymentConfig,
    private events: PaymentGatewayEvents
  ) {
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-05-28.basil", // Use latest API version
    });
  }

  async createPaymentSession(
    order: $type<AnyOrder>
  ): Promise<{ sessionId: string; redirectUrl: string }> {
    try {
      // Build success URL with returnUrl if provided
      const successUrl = order.returnUrl
        ? `${this.config.successUrl}&returnUrl=${encodeURIComponent(
            order.returnUrl
          )}`
        : this.config.successUrl;

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card", "blik", "p24"],
        line_items: [
          {
            price_data: {
              currency: "pln",
              product_data: {
                name: order.item.productId as string,
                description: `Quantity: ${order.item.quantity}`,
              },
              unit_amount: order.totalAmount,
            },
            quantity: order.item.quantity,
          },
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: this.config.cancelUrl,
        metadata: {
          orderId: order.orderId,
          userId: order.userId,
          family: order.family,
          baseAmount: order.baseAmount.toString(),
          taxAmount: order.taxAmount.toString(),
          totalAmount: order.totalAmount.toString(),
        },
        customer_email: order.customerInfo.email,
      });

      return {
        sessionId: session.id,
        redirectUrl:
          session.url || `https://checkout.stripe.com/pay/${session.id}`,
      };
    } catch (error) {
      console.error("Stripe session creation failed:", error);
      throw new Error(
        `Failed to create payment session: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Utility method to retrieve session information
  async getSessionInfo(sessionId: string): Promise<StripeSessionInfo | null> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      return {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        paymentIntentId: session.payment_intent as string | undefined,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total || undefined,
        metadata: session.metadata ? { ...session.metadata } : undefined,
      };
    } catch (error) {
      console.error("Failed to retrieve Stripe session:", error);
      return null;
    }
  }

  // Provide webhook route as context element
  getContextElements() {
    return [
      route("webhookStripe")
        .path("/stripe/webhook")
        .use([this.events.paymentCompleted, this.events.paymentFailed])
        .public()
        .handle({
          POST: async (ctx, req) => {
            const signature = req.headers.get("stripe-signature");

            if (!signature) {
              return new Response("Missing signature", { status: 400 });
            }

            try {
              // Get raw body for webhook verification
              const body = await req.text();

              // Verify webhook signature
              const event = await this.stripe.webhooks.constructEventAsync(
                body,
                signature,
                this.webhookSecret
              );

              // Handle different event types
              switch (event.type) {
                case "checkout.session.completed":
                  const session = event.data.object as Stripe.Checkout.Session;

                  if (session.payment_status === "paid") {
                    await ctx.get(this.events.paymentCompleted).emit({
                      orderId: session.metadata?.orderId as any,
                      transactionId: session.id,
                      completedAt: new Date(event.created * 1000), // Convert Unix timestamp
                    });

                    return new Response("Webhook processed", { status: 200 });
                  } else {
                    return new Response("Session not paid", { status: 200 });
                  }

                case "checkout.session.expired":
                  const expiredSession = event.data
                    .object as Stripe.Checkout.Session;

                  if (
                    expiredSession.metadata?.orderId &&
                    expiredSession.metadata?.family
                  ) {
                    await ctx.get(this.events.paymentFailed).emit({
                      orderId: expiredSession.metadata.orderId as any,
                      transactionId: expiredSession.id,
                      reason: "Payment session expired",
                      failedAt: new Date(event.created * 1000),
                    });
                  }

                  return new Response("Session expired processed", {
                    status: 200,
                  });

                case "payment_intent.payment_failed":
                  const failedPayment = event.data
                    .object as Stripe.PaymentIntent;

                  if (
                    failedPayment.metadata?.orderId &&
                    failedPayment.metadata?.family
                  ) {
                    await ctx.get(this.events.paymentFailed).emit({
                      orderId: failedPayment.metadata.orderId as any,
                      transactionId: failedPayment.id,
                      reason: `Payment failed: ${
                        failedPayment.last_payment_error?.message ||
                        "Unknown error"
                      }`,
                      failedAt: new Date(event.created * 1000),
                    });
                  }

                  return new Response("Payment failure processed", {
                    status: 200,
                  });

                default:
                  return new Response("Event type not handled", {
                    status: 200,
                  });
              }
            } catch (error) {
              console.error("Stripe webhook processing failed:", error);

              if (
                error instanceof Stripe.errors.StripeSignatureVerificationError
              ) {
                return new Response("Invalid signature", { status: 400 });
              }

              return new Response("Webhook processing failed", { status: 500 });
            }
          },
        }),
    ];
  }
}

// Builder function for Stripe gateway
export const createStripePaymentGateway = (
  stripeSecretKey: string,
  webhookSecret: string,
  config: PaymentConfig
): PaymentGatewayBuilder => {
  return (events: PaymentGatewayEvents) => {
    return new StripePaymentGateway(
      stripeSecretKey,
      webhookSecret,
      config,
      events
    );
  };
};
