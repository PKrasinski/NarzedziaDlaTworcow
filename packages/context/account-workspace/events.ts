import { array, date, event, string } from "@arcote.tech/arc";
import { userId } from "../auth";
import { accountWorkspaceId } from "./ids/account-workspace";

export const accountWorkspaceCreated = event("accountWorkspaceCreated", {
  userId,
  accountWorkspaceId,
  creatorName: string(),
  platforms: array(string()),
  otherPlatform: string().optional(),
  createdAt: date(),
});
