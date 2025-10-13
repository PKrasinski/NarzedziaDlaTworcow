import { object, view } from "@arcote.tech/arc";
import { userId } from "../../auth";
import { invoiceDataUpdated } from "../events/invoice-data-updated";
import { invoiceDataSchema } from "../objects/invoice-data";

export default view("userInvoiceData", userId, object(invoiceDataSchema))
  .auth((authContext) => ({
    _id: authContext.userId,
  }))
  .use([invoiceDataUpdated])
  .handle({
    invoiceDataUpdated: async (ctx, event) => {
      await ctx.set(event.payload.userId, {
        ...event.payload.invoiceData,
      });
    },
  });
