import { id } from "@arcote.tech/arc";

const CUSTOM_EPOCH = new Date("2025-06-01T00:00:00Z").getTime();
export const orderId = id(`orderId`, () => {
  return (
    (Date.now() - CUSTOM_EPOCH).toString(36).toUpperCase() +
    Math.random().toString(36).substring(2, 5).toUpperCase()
  );
});

export type OrderId = typeof orderId;
