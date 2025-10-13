import { event } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { styleUpdateSchema } from "../objects/style";

export default event("creatorStyleUpdated", {
  accountWorkspaceId,
  styleUpdate: styleUpdateSchema,
});
