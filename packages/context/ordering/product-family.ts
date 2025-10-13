import {
  any,
  ArcAnyViewRecord,
  ArcCommandContext,
  ArcContextElementAny,
  ArcObjectAny,
} from "@arcote.tech/arc";
import { createOrderAndPayment } from "./commands/create-order-and-payment";
import { OrderCreated, orderCreated } from "./events/order-created";
import { orderFailed } from "./events/order-failed";
import { orderFulfilled } from "./events/order-fulfilled";
import { paymentCompleted } from "./events/payment-completed";
import { paymentSessionCreated } from "./events/payment-session-created";
import { OrderingModuleData } from "./ordering-module";
import { ProductsViewAny } from "./views/products";

export type FulfillmentCallback<
  Elements extends ArcContextElementAny[],
  Order extends any
> = (ctx: ArcCommandContext<Elements>, order: Order) => Promise<void>;

export type ProductFamilyData = {
  family: string;
  productsView: ProductsViewAny;
  orderMetadata: ArcObjectAny;
  use: ArcContextElementAny[];
};

export const productFamily = <
  const Data extends ProductFamilyData,
  const OrderingData extends OrderingModuleData
>(
  orderingData: OrderingData,
  data: Data,
  paymentGateway: any
) => {
  const moduleName = orderingData.moduleName as OrderingData["moduleName"];

  const orderCreatedEvent = orderCreated({
    family: data.family as Data["family"],
    productId: data.productsView.id as Data["productsView"]["id"],
    productMetadata: any<ArcAnyViewRecord<Data["productsView"]>["metadata"]>(),
    orderMetadata: data.orderMetadata as Data["orderMetadata"],
    customerId: orderingData.customerId,
    customerInfo: orderingData.customerInfo as OrderingData["customerInfo"],
    invoiceData: orderingData.invoiceData as OrderingData["invoiceData"],
  });

  const orderFailedEvent = orderFailed({
    family: data.family as Data["family"],
  });

  const orderFulfilledEvent = orderFulfilled({
    family: data.family as Data["family"],
  });

  const paymentSessionCreatedEvent = paymentSessionCreated({
    moduleName,
  });

  const paymentCompletedEvent = paymentCompleted({
    moduleName,
  });

  const createOrderAndPaymentCommand = createOrderAndPayment(
    data,
    orderingData,
    {
      orderCreatedEvent: orderCreatedEvent as OrderCreated,
      paymentSessionCreatedEvent,
      paymentGateway,
    }
  );

  return {
    orderCreatedEvent,
    orderFailedEvent,
    orderFulfilledEvent,
    paymentSessionCreatedEvent,
    paymentCompletedEvent,
    createOrderAndPaymentCommand,
    productsView: data.productsView as Data["productsView"],
  };
};
