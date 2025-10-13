import { event, type ArcRawShape } from "@arcote.tech/arc";
import { type AccountId } from "../ids/account";
import { getTypeSafe } from "../utils/get";

export type ProfileUpdatedData = {
  name: string;
  accountId: AccountId;
  customFields: ArcRawShape;
};

export const profileUpdated = <const Data extends ProfileUpdatedData>(
  data: Data
) =>
  event(`${getTypeSafe(data, "name")}ProfileUpdated`, {
    ...data.customFields,
    accountId: data.accountId,
  });

export type ProfileUpdated<
  Data extends ProfileUpdatedData = ProfileUpdatedData
> = ReturnType<typeof profileUpdated<Data>>;
