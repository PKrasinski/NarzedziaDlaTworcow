import { date, event } from "@arcote.tech/arc";
import { capitalize } from "../../utils/capitalize";
import { orderId } from "../ids/order-id";

export type OrderFulfilledData = {
  family: string;
};

export const orderFulfilled = <const Data extends OrderFulfilledData>(
  data: Data
) =>
  event(`order${capitalize<Data["family"]>(data["family"])}Fulfilled`, {
    orderId,
    fulfilledAt: date(),
  });

export type OrderFulfilled<
  Data extends OrderFulfilledData = OrderFulfilledData
> = ReturnType<typeof orderFulfilled<Data>>;

export type AnyOrderFulfilled = OrderFulfilled<any>;
