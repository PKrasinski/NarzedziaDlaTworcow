import {
  ArcElement,
  ArcIdAny,
  ArcObjectAny,
  date,
  number,
  object,
  string,
  stringEnum,
} from "@arcote.tech/arc";
import { orderId } from "../ids/order-id";

export const item = <
  const ItemData extends {
    productId: ArcElement;
    metadata: ArcElement;
  }
>(
  data: ItemData
) => {
  const { productId, metadata, ...rest } = data;
  return object({
    productId,
    name: string(),
    quantity: number(),
    price: number(),
    metadata,
    ...rest,
  });
};

export type OrderData = Readonly<{
  family: string;
  productId: ArcElement;
  productMetadata: ArcElement;
  orderMetadata: ArcObjectAny;
  customerId: ArcIdAny;
  customerInfo: ArcObjectAny;
  invoiceData: ArcElement;
}>;

export const order = <const Data extends OrderData>(data: Data) => {
  const { productId, productMetadata, orderMetadata, family, ...rest } = data;
  return object({
    family: stringEnum(family as Data["family"]),
    item: item({ productId, metadata: productMetadata }),
    baseAmount: number(),
    taxAmount: number(),
    totalAmount: number(),
    createdAt: date(),
    metadata: orderMetadata,
    orderId,
    ...rest,
  });
};

export type Order<Data extends OrderData> = ReturnType<typeof order<Data>>;

export type AnyOrder = Order<any>;
