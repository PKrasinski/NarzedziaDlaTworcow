import { number, object, view } from "@arcote.tech/arc";
import { authContext, userId } from "../../auth";
import { creditsPurchased } from "../../events";

export default view(
  "credits",
  userId,
  object({
    amount: number(),
  })
)
  .use([authContext.get("userAccountRegistered"), creditsPurchased])
  .auth((authContext) => ({
    _id: authContext.userId,
  }))
  .handle({
    userAccountRegistered: async (ctx, event) => {
      await ctx.set(event.payload.accountId, {
        amount: 30,
      });
    },
    creditsPurchased: async (ctx, event) => {
      const existingCredits = await ctx.findOne({ _id: event.payload.userId });
      const currentAmount = existingCredits?.amount || 0;

      await ctx.set(event.payload.userId, {
        amount: currentAmount + event.payload.creditsAmount,
      });
    },
  });
