import { event } from "@arcote.tech/arc";
import { capitalize } from "../../utils/capitalize";
import { order, OrderData } from "../objects/order";

export type OrderCreatedData = OrderData;

export const orderCreated = <const Data extends OrderData>(data: Data) =>
  event(
    `order${capitalize<Data["family"]>(data["family"])}Created`,
    order(data)
  );

export type OrderCreated<Data extends OrderData = OrderData> = ReturnType<
  typeof orderCreated<Data>
>;
