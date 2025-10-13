import { event, object } from "@arcote.tech/arc";
import { userId } from "../../auth";
import { invoiceDataSchema } from "../objects/invoice-data";

export const invoiceDataUpdated = event("invoiceDataUpdated", {
  userId,
  invoiceData: object(invoiceDataSchema),
});
