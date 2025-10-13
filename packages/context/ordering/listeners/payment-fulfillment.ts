import { ArcContextElementAny, ArcViewAny, listener } from "@arcote.tech/arc";
import { AnyPaymentCompleted } from "../events/payment-completed";

export type PaymentFulfillmentConfig = {
  moduleName: string;
  paymentCompletedEvents: AnyPaymentCompleted;
  families: any[];
  use: ArcContextElementAny[];
  orderView: ArcViewAny;
};

export function createPaymentFulfillmentListener(
  config: PaymentFulfillmentConfig
) {
  return listener("paymentFulfillment")
    .use([config.orderView, config.paymentCompletedEvents, ...config.use])
    .listenTo([config.paymentCompletedEvents])
    .handle(async (ctx, event: any) => {
      try {
        const { orderId } = event.payload;

        // Find the order directly by orderId
        const targetOrder = await ctx
          .get(config.orderView)
          .findOne({ _id: orderId as any });

        if (!targetOrder) {
          console.error(`Order not found: ${orderId}`);
          return;
        }

        // Find the family configuration by family name
        const familyConfig = config.families.find(
          (family) => family.family === targetOrder.family
        );

        if (!familyConfig) {
          console.error(
            `Family configuration not found: ${targetOrder.family}`
          );
          return;
        }

        // Execute fulfillment callback if provided
        if (familyConfig.onFulfillment) {
          await familyConfig.onFulfillment(ctx, {
            orderId: targetOrder._id,
            userId: targetOrder.userId,
            family: targetOrder.family,
            item: targetOrder.item,
            totalAmount: parseInt(targetOrder.totalAmount),
            customerInfo: targetOrder.customerInfo,
            invoiceData: targetOrder.invoiceData,
            createdAt: targetOrder.createdAt,
            metadata: targetOrder.metadata,
          });
        }

        // Emit order fulfilled event
        await ctx.get(familyConfig.orderFulfilledEvent).emit({
          orderId: targetOrder._id,
          fulfilledAt: new Date(),
        });

        console.log(
          `Order ${orderId} fulfilled successfully for family ${targetOrder.family}`
        );
      } catch (error) {
        console.error(
          `Order fulfillment failed for order ${event.payload.orderId}:`,
          error
        );
      }
    });
}
