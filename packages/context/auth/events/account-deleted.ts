import {
  date,
  event,
  string,
} from "@arcote.tech/arc";
import { getTypeSafe } from "../utils/get";
import { type AccountId } from "../ids/account";

export type AccountDeletedData = {
  name: string;
  accountId: AccountId;
};

export const accountDeleted = <const Data extends AccountDeletedData>(data: Data) =>
  event(`${getTypeSafe(data, "name")}AccountDeleted`, {
    accountId: data.accountId,
    deletedAt: date(),
  });

export type AccountDeleted<Data extends AccountDeletedData = AccountDeletedData> = 
  ReturnType<typeof accountDeleted<Data>>;