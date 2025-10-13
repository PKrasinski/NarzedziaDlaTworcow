import { array, date, id, object, string, view } from "@arcote.tech/arc";
import { AccountRegistered } from "../events/account-registered";
import { getTypeSafe } from "../utils/get";

export const ipId = id("ip-address");

export type IpRegistrationsViewData = {
  name: string;
  accountRegistered: AccountRegistered;
};

export const createIpRegistrationsView = <
  const Data extends IpRegistrationsViewData
>(
  data: Data
) =>
  view(
    `${getTypeSafe(data, "name")}IpRegistrations`,
    ipId,
    object({
      registrations: array(
        object({
          accountId: string(),
          registeredAt: date(),
          email: string().email(),
        })
      ),
    })
  ).handleEvent(data.accountRegistered, async (ctx, event) => {
    const ipAddress = ctx.$auth.ipAddress as any;

    const existing = await ctx.findOne({ _id: ipAddress });
    const newRegistration = {
      accountId: event.payload.accountId,
      registeredAt: new Date(),
      email: event.payload.email,
    };

    if (existing) {
      await ctx.set(ipAddress, {
        registrations: [...existing.registrations, newRegistration],
      });
    } else {
      await ctx.set(ipAddress, {
        registrations: [newRegistration],
      });
    }
  });

export type IpRegistrationsView<
  Data extends IpRegistrationsViewData = IpRegistrationsViewData
> = ReturnType<typeof createIpRegistrationsView<Data>>;
