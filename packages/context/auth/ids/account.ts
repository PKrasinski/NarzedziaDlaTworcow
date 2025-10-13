import { id } from "@arcote.tech/arc";
import { getTypeSafe } from "../utils/get";

export type AccountIdData = {
  name: string;
};

export const createAccountId = <const Data extends AccountIdData>(
  data: Readonly<Data>
) => id(`${getTypeSafe(data, "name")}Account`);

export type AccountId<Data extends AccountIdData = AccountIdData> = ReturnType<
  typeof createAccountId<Data>
>;
