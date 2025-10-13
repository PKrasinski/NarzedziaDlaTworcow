import { boolean, command, number, string, stringEnum } from "@arcote.tech/arc";
import { capitalize } from "../../utils/capitalize";
import { invoiceDataUpdated } from "../events/invoice-data-updated";
import { OrderCreated } from "../events/order-created";
import { PaymentSessionCreated } from "../events/payment-session-created";
import { orderId } from "../ids/order-id";
import { OrderingModuleData } from "../ordering-module";
import { ProductFamilyData } from "../product-family";
import { PaymentGateway } from "../types";

export type CreateOrderAndPaymentCommandData = {
  orderCreatedEvent: OrderCreated;
  paymentSessionCreatedEvent: PaymentSessionCreated;
  paymentGateway: PaymentGateway;
};

export const createOrderAndPayment = <
  const FamilyData extends ProductFamilyData,
  const ModuleData extends OrderingModuleData,
  const CommandData extends CreateOrderAndPaymentCommandData
>(
  familyData: FamilyData,
  moduleData: ModuleData,
  commandData: CommandData
) => {
  return command(
    `create${capitalize<FamilyData["family"]>(
      familyData.family
    )}OrderAndPayment`
  )
    .use(familyData.use)
    .withParams({
      metadata: familyData.orderMetadata as FamilyData["orderMetadata"],
      productId: familyData.productsView.id as FamilyData["productsView"]["id"],
      quantity: number(),
      customerInfo: moduleData.customerInfo as ModuleData["customerInfo"],
      invoiceData: moduleData.invoiceData as ModuleData["invoiceData"],
      saveForLater: boolean(),
      returnUrl: string(),
    })
    .withResult(
      {
        orderId,
        sessionId: string(),
        redirectUrl: string(),
      },
      {
        error: stringEnum(
          "INVALID_PRODUCT",
          "INVALID_GROUP",
          "GATEWAY_ERROR",
          "NO_GATEWAY_CONFIGURED"
        ),
      }
    )
    .handle(
      ONLY_SERVER &&
        (async (
          ctx,
          {
            productId,
            quantity,
            customerInfo,
            invoiceData,
            saveForLater,
            metadata,
            returnUrl,
          }
        ) => {
          try {
            const products = await ctx.get(familyData.productsView).find({});

            const product = products.find((p) => p._id === productId);

            if (!product) {
              return { error: "INVALID_PRODUCT" as const };
            }

            // Check if payment gateway is configured
            if (!commandData.paymentGateway) {
              return { error: "NO_GATEWAY_CONFIGURED" as const };
            }

            const orderIdValue = orderId.generate();
            const baseAmount = product.price * quantity;
            const taxAmount = baseAmount * 0.23; // 23% tax
            const totalAmount = baseAmount + taxAmount;

            const orderData = {
              family: familyData.family,
              orderId: orderIdValue,
              customerId: ctx.$auth.userId,
              userId: ctx.$auth.userId,
              item: {
                productId: product._id,
                name: product.name,
                quantity,
                price: product.price,
                metadata: product.metadata,
              },
              metadata,
              baseAmount,
              taxAmount,
              totalAmount,
              customerInfo: customerInfo,
              invoiceData: invoiceData,
              returnUrl,
              createdAt: new Date(),
            };

            // Create order first
            await ctx.get(commandData.orderCreatedEvent).emit(orderData);

            if (saveForLater && invoiceData)
              await ctx.get(invoiceDataUpdated).emit({
                userId: ctx.$auth.userId,
                invoiceData: invoiceData as any,
              });

            try {
              // Create payment session using the gateway
              const paymentSession =
                await commandData.paymentGateway.createPaymentSession(
                  orderData
                );

              // Emit payment session created event
              await ctx.get(commandData.paymentSessionCreatedEvent).emit({
                orderId: orderIdValue,
                sessionId: paymentSession.sessionId,
                gatewayType: commandData.paymentGateway.name,
                redirectUrl: paymentSession.redirectUrl,
                createdAt: new Date(),
              });

              return {
                orderId: orderIdValue,
                sessionId: paymentSession.sessionId,
                redirectUrl: paymentSession.redirectUrl,
              };
            } catch (paymentError) {
              console.error("Payment session creation failed:", paymentError);
              return { error: "GATEWAY_ERROR" as const };
            }
          } catch (error) {
            console.error("Order and payment creation failed:", error);
            return { error: "GATEWAY_ERROR" as const };
          }
        })
    );
};
