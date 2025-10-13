import {
  $type,
  ArcAnyViewRecord,
  ArcContextElementAny,
  ArcElement,
  ArcIdAny,
  ArcObjectAny,
  context,
} from "@arcote.tech/arc";
import updateInvoiceData from "./commands/updateInvoiceData";
import { invoiceDataUpdated } from "./events/invoice-data-updated";
import { OrderCreated } from "./events/order-created";
import { OrderFulfilled } from "./events/order-fulfilled";
import { PaymentCompleted, paymentCompleted } from "./events/payment-completed";
import { paymentFailed } from "./events/payment-failed";
import { PaymentSessionCreated } from "./events/payment-session-created";
import { createPaymentFulfillmentListener } from "./listeners/payment-fulfillment";
import { FulfillmentCallback, productFamily } from "./product-family";
import { PaymentGateway, PaymentGatewayBuilder } from "./types";
import { createOrdersView, OrderViewItem } from "./views/orders";
import { ProductsViewAny } from "./views/products";
import userInvoiceData from "./views/user-invoice-data";

export type OrderingModuleData = {
  moduleName: string;
  orderView: string;
  customerId: ArcIdAny;
  customerInfo: ArcObjectAny;
  invoiceData: ArcElement;
  paymentGatewayBuilder: PaymentGatewayBuilder | undefined;
};

class OrderingModule<
  const Data extends OrderingModuleData,
  const Elements extends ArcContextElementAny[] = []
> {
  private readonly elements: Elements;
  private readonly paymentGateway: PaymentGateway;

  constructor(
    private readonly data: Data,
    elements: Elements,
    private families: {
      family: string;
      onFulfillment?: FulfillmentCallback<any, any>;
      use: ArcContextElementAny[];
      paymentCompletedEvent: PaymentCompleted;
      orderCreatedEvent: OrderCreated;
      orderFulfilledEvent: OrderFulfilled;
      paymentSessionCreatedEvent: PaymentSessionCreated;
    }[]
  ) {
    this.elements = elements;

    // Build payment gateway with module-level events
    const paymentCompletedEvent = paymentCompleted({
      moduleName: data.moduleName,
    });

    const paymentFailedEvent = paymentFailed({
      moduleName: data.moduleName,
    });

    if (data.paymentGatewayBuilder)
      this.paymentGateway = data.paymentGatewayBuilder({
        paymentCompleted: paymentCompletedEvent,
        paymentFailed: paymentFailedEvent,
      });
  }

  addProductFamily<
    const Family extends string,
    const Use extends ArcContextElementAny[],
    const ProductMetadata extends ProductsViewAny,
    const OrderMetadata extends ArcObjectAny
  >(data: {
    family: Family;
    use: Use;
    productsView: ProductMetadata;
    orderMetadata: OrderMetadata;
    onFulfillment?: FulfillmentCallback<
      Use,
      OrderViewItem<
        ArcAnyViewRecord<ProductMetadata>["metadata"],
        $type<OrderMetadata>
      >
    >;
  }) {
    const family = productFamily(this.data, data, this.paymentGateway);

    const familyElements = [
      family.orderCreatedEvent,
      family.orderFailedEvent,
      family.orderFulfilledEvent,
      family.paymentSessionCreatedEvent,
      family.paymentCompletedEvent,
      family.createOrderAndPaymentCommand,
      family.productsView,
    ] as const;

    return new OrderingModule(
      this.data,
      [...this.elements, ...familyElements] as unknown as [
        ...typeof familyElements,
        ...Elements
      ],
      [
        ...this.families,
        {
          family: data.family,
          onFulfillment: data.onFulfillment,
          use: data.use,
          paymentCompletedEvent: family.paymentCompletedEvent,
          orderCreatedEvent: family.orderCreatedEvent,
          orderFulfilledEvent: family.orderFulfilledEvent,
          paymentSessionCreatedEvent: family.paymentSessionCreatedEvent,
        },
      ] as any
    );
  }

  getContext() {
    // Create module-level payment events
    const paymentCompletedEvent = paymentCompleted({
      moduleName: this.data.moduleName,
    });

    const paymentFailedEvent = paymentFailed({
      moduleName: this.data.moduleName,
    });

    const orderView = createOrdersView(
      this.families.map((f) => f.orderCreatedEvent),
      paymentCompletedEvent,
      paymentFailedEvent,
      this.families.map((f) => f.orderFulfilledEvent),
      this.families.map((f) => f.paymentSessionCreatedEvent)
    );

    // Create the fulfillment listener
    const fulfillmentListener = createPaymentFulfillmentListener({
      moduleName: this.data.moduleName,
      families: this.families,
      orderView,
      paymentCompletedEvents: paymentCompletedEvent,
      use: this.families
        .map((f) => [...f.use, f.paymentCompletedEvent, f.orderFulfilledEvent])
        .flat(),
    });

    const paymentGatewayElements = this.paymentGateway?.getContextElements
      ? this.paymentGateway.getContextElements()
      : [];

    const allElements = [...this.elements, ...paymentGatewayElements] as const;

    return context<
      [
        typeof orderView,
        typeof userInvoiceData,
        typeof updateInvoiceData,
        typeof fulfillmentListener,
        ...Elements
      ]
    >([
      orderView,
      userInvoiceData,
      updateInvoiceData,
      fulfillmentListener,
      ...allElements,
      invoiceDataUpdated,
    ] as any);
  }
}

export const orderingModule = <const Data extends OrderingModuleData>(
  data: Data
) => {
  return new OrderingModule<Data, []>(data, [], []);
};

export type {
  PaymentConfig,
  PaymentGateway,
  PaymentGatewayBuilder,
} from "./types";
