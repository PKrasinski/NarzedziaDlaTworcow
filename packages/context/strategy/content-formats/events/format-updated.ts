import { event, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { formatId, formatSchema } from "../objects/format";

export default event("formatUpdated", {
  formatId,
  accountWorkspaceId,
  formatUpdate: object(formatSchema).partial(),
});
