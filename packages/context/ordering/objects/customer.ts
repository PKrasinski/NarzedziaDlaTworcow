import { object, string } from "@arcote.tech/arc";

export const customerInfo = object({
  fullName: string(),
  email: string().email(),
});
