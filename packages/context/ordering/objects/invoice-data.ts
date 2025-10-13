import { string } from "@arcote.tech/arc";

export const invoiceDataSchema = {
  companyName: string().minLength(3).maxLength(255),
  nip: string()
    .length(10)
    .validation("nip", (value) => {
      if (!/^\d{10}$/.test(value)) {
        return {
          nip: value,
        };
      }
    }),
  address: string().minLength(3).maxLength(255),
  city: string().minLength(3).maxLength(255),
  postalCode: string()
    .length(6)
    .validation("postalCode", (value) => {
      if (!/^\d{2}-\d{3}$/.test(value)) {
        return {
          postalCode: value,
        };
      }
    }),
  country: string().minLength(3).maxLength(255),
};
