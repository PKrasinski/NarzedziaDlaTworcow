import {
  any,
  type ArcViewRecord,
  date,
  number,
  object,
  string,
  stringEnum,
  view,
} from "@arcote.tech/arc";
import { userId } from "../../auth";
import { OrderCreated } from "../events/order-created";
import { AnyOrderFulfilled } from "../events/order-fulfilled";
import { AnyPaymentCompleted } from "../events/payment-completed";
import { AnyPaymentFailed } from "../events/payment-failed";
import { AnyPaymentSessionCreated } from "../events/payment-session-created";
import { orderId } from "../ids/order-id";
import { customerInfo } from "../objects/customer";
import { invoiceDataSchema } from "../objects/invoice-data";

// Create the base orders view
export const createOrdersView = <
  ProductMetadata extends any,
  OrderMetadata extends any
>(
  orderCreatedEvents: OrderCreated[],
  paymentCompletedEvent: AnyPaymentCompleted,
  paymentFailedEvent: AnyPaymentFailed,
  orderFulfilledEvents: AnyOrderFulfilled[],
  paymentSessionCreatedEvents: AnyPaymentSessionCreated[]
) => {
  const v = view(
    "orders",
    orderId,
    object({
      status: stringEnum(
        "pending",
        "payment_initiated",
        "paid",
        "fulfilled",
        "failed"
      ),
      family: string(),
      userId: userId,
      item: object({
        productId: string(),
        name: string(),
        quantity: number(),
        price: number(),
        metadata: any<ProductMetadata>(),
      }),
      baseAmount: number(),
      taxAmount: number(),
      totalAmount: number(),
      customerInfo,
      invoiceData: object(invoiceDataSchema).optional(),
      metadata: any<OrderMetadata>(),
      createdAt: date(),
      paidAt: date().optional(),
      fulfilledAt: date().optional(),
      failedAt: date().optional(),
      sessionId: string().optional(),
      transactionId: string().optional(),
      gatewayType: string().optional(),
      redirectUrl: string().optional(),
      errorReason: string().optional(),
    })
  ).auth((authContext) => {
    if (authContext.userId) {
      return {
        userId: authContext.userId, // Filter by userId in auth
      };
    }
    return {};
  });

  let currentView = v;

  // Handle order created events
  for (const orderCreatedEvent of orderCreatedEvents) {
    currentView = currentView.handleEvent(
      orderCreatedEvent,
      async (ctx, event) => {
        await ctx.set(event.payload.orderId, {
          status: "pending",
          family: event.payload.family,
          userId: event.payload.customerId,
          item: event.payload.item as any,
          baseAmount: event.payload.baseAmount,
          taxAmount: event.payload.taxAmount,
          totalAmount: event.payload.totalAmount,
          customerInfo: event.payload.customerInfo as any,
          invoiceData: event.payload.invoiceData as any,
          metadata: event.payload.metadata as any,
          createdAt: event.payload.createdAt,
          paidAt: null,
          fulfilledAt: null,
          failedAt: null,
          sessionId: null,
          transactionId: null,
          gatewayType: null,
          redirectUrl: null,
          errorReason: null,
        });
      }
    );
  }

  // Handle payment session created events
  for (const paymentSessionCreatedEvent of paymentSessionCreatedEvents) {
    currentView = currentView.handleEvent(
      paymentSessionCreatedEvent,
      async (ctx, event) => {
        const existingOrder = await ctx.findOne({ _id: event.payload.orderId });
        if (existingOrder) {
          await ctx.set(event.payload.orderId, {
            ...existingOrder,
            status: "payment_initiated",
            sessionId: event.payload.sessionId,
            gatewayType: event.payload.gatewayType,
            redirectUrl: event.payload.redirectUrl,
          });
        }
      }
    );
  }

  // Handle payment completed event
  currentView = currentView.handleEvent(
    paymentCompletedEvent,
    async (ctx, event) => {
      const existingOrder = await ctx.findOne({ _id: event.payload.orderId });
      if (existingOrder) {
        await ctx.set(event.payload.orderId, {
          ...existingOrder,
          status: "paid",
          paidAt: event.payload.completedAt,
          transactionId: event.payload.transactionId,
        });
      }
    }
  );

  // Handle payment failed event
  currentView = currentView.handleEvent(
    paymentFailedEvent,
    async (ctx, event) => {
      const existingOrder = await ctx.findOne({ _id: event.payload.orderId });
      if (existingOrder) {
        await ctx.set(event.payload.orderId, {
          ...existingOrder,
          status: "failed",
          failedAt: event.payload.failedAt,
          transactionId: event.payload.transactionId,
          errorReason: event.payload.reason,
        });
      }
    }
  );

  // Handle order fulfilled events
  for (const orderFulfilledEvent of orderFulfilledEvents) {
    currentView = currentView.handleEvent(
      orderFulfilledEvent,
      async (ctx, event) => {
        const existingOrder = await ctx.findOne({ _id: event.payload.orderId });
        if (existingOrder) {
          await ctx.set(event.payload.orderId, {
            ...existingOrder,
            status: "fulfilled",
            fulfilledAt: event.payload.fulfilledAt,
          });
        }
      }
    );
  }

  return currentView;
};

export type OrderViewItem<
  ProductMetadata extends any,
  OrderMetadata extends any
> = ArcViewRecord<
  ReturnType<typeof createOrdersView<ProductMetadata, OrderMetadata>>
>;
