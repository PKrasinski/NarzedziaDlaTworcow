import { event, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../account-workspace";
import { contentSchema, contentId } from "../objects/content";

export default event("contentCreated", {
  contentId,
  accountWorkspaceId,
  content: object(contentSchema),
});