import { date, event, string } from "@arcote.tech/arc";
import { capitalize } from "../../utils/capitalize";
import { orderId } from "../ids/order-id";

export type OrderFailedData = {
  family: string;
};

export const orderFailed = <const Data extends OrderFailedData>(data: Data) =>
  event(`order${capitalize<Data["family"]>(data["family"])}Failed`, {
    reason: string(),
    failedAt: date(),
    orderId,
  });

export type OrderFailed<Data extends OrderFailedData = OrderFailedData> =
  ReturnType<typeof orderFailed<Data>>;

export type AnyOrderFailed = OrderFailed<any>;
