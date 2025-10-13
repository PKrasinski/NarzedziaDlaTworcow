import { event } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { formatId } from "../objects/format";

export default event("formatRemoved", {
  formatId,
  accountWorkspaceId,
});
