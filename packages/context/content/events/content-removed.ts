import { event } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../account-workspace";
import { contentId } from "../objects/content";

export default event("contentRemoved", {
  contentId,
  accountWorkspaceId,
});