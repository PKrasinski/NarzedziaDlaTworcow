import { command, object, string } from "@arcote.tech/arc";
import { invoiceDataUpdated } from "../events/invoice-data-updated";
import { invoiceDataSchema } from "../objects/invoice-data";

export default command("updateInvoiceData")
  .use([invoiceDataUpdated])
  .withParams(object(invoiceDataSchema))
  .withResult({
    success: string(),
  })
  .handle(async (ctx, data) => {
    await ctx.invoiceDataUpdated.emit({
      userId: ctx.$auth.userId as any,
      invoiceData: data,
    });

    return {
      success: "Dane do faktury zostały zaktualizowane pomyślnie",
    };
  });
