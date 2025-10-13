import {
  ArcAnyViewRecord,
  customId,
  number,
  object,
  staticView,
  string,
} from "@arcote.tech/arc";
import { accountWorkspaceId } from "../account-workspace";
import { creditsPurchased, strategyAgentServicePurchased } from "../events";
import { userId } from "../auth";
import { customerInfo } from "./objects/customer";
import { invoiceDataSchema } from "./objects/invoice-data";
import { orderingModule, PaymentGatewayBuilder } from "./ordering-module";
import { createStripePaymentGateway } from "./payment-gateways/stripe";

const agentProductId = customId("agentProduct", (alias: string) => alias);
const creditProductId = customId("creditProduct", (alias: string) => alias);

export let stripeGatewayBuilder: PaymentGatewayBuilder | undefined = undefined;

if (SERVER) {
  stripeGatewayBuilder = createStripePaymentGateway(
    process.env.STRIPE_SECRET_KEY!,
    process.env.STRIPE_WEBHOOK_SECRET!,
    {
      successUrl: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.FRONTEND_URL}/payment-cancelled`,
    }
  );
}

const premiumProductView = staticView(
  "premium",
  agentProductId,
  object({
    name: string(),
    price: number(),
    description: string(),
    metadata: object({
      months: number(),
    }),
  })
).addItems([
  {
    _id: agentProductId.get("strategy-agent-access"),
    name: "Strategia treści - kurs + pomocnik AI",
    price: 10000,
    description: "Dostęp do kursu i pomocnika AI",
    metadata: { months: 12 },
  },
] as const);

export type StrategyProduct = ArcAnyViewRecord<typeof premiumProductView>;

const creditsProductView = staticView(
  "creditsPackages",
  creditProductId,
  object({
    name: string(),
    price: number(),
    description: string(),
    metadata: object({
      credits: number(),
    }),
  })
).addItems([
  {
    _id: creditProductId.get("credits-basic"),
    name: "Kredyty Basic - 30 kredytów",
    price: 2000,
    description: "Pakiet 30 kredytów do generowania treści",
    metadata: { credits: 30 },
  },
  {
    _id: creditProductId.get("credits-standard"),
    name: "Kredyty Standard - 100 kredytów",
    price: 5000,
    description: "Pakiet 100 kredytów do generowania treści",
    metadata: { credits: 100 },
  },
  {
    _id: creditProductId.get("credits-premium"),
    name: "Kredyty Premium - 250 kredytów",
    price: 10000,
    description: "Pakiet 250 kredytów do generowania treści",
    metadata: { credits: 250 },
  },
] as const);

export type CreditPackage = ArcAnyViewRecord<typeof creditsProductView>;

const narzedziaDlaTworcowOrdering = orderingModule({
  moduleName: "narzedziadlatworcow",
  orderView: "orders",
  customerId: userId,
  customerInfo: customerInfo,
  invoiceData: object(invoiceDataSchema).optional(),
  paymentGatewayBuilder: stripeGatewayBuilder as any,
})
  .addProductFamily({
    family: "premium",
    productsView: premiumProductView,
    orderMetadata: object({
      accountWorkspaceId,
    }),
    use: [strategyAgentServicePurchased],
    onFulfillment: async (ctx, order) => {
      await ctx.strategyAgentServicePurchased.emit({
        accountWorkspaceId: order.metadata.accountWorkspaceId,
      });
    },
  })
  .addProductFamily({
    family: "credits",
    productsView: creditsProductView,
    orderMetadata: object({}),
    use: [creditsPurchased],
    onFulfillment: async (ctx, order) => {
      await ctx.creditsPurchased.emit({
        userId: order.userId,
        creditsAmount: order.item.metadata.credits,
      });
    },
  });

export const narzedziaDlaTworcowOrderingContext =
  narzedziaDlaTworcowOrdering.getContext();
