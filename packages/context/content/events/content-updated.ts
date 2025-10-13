import { event, object } from "@arcote.tech/arc";
import { contentId, contentSchema } from "../objects/content";

export default event("contentUpdated", {
  contentId,
  contentUpdate: object(contentSchema).partial(),
});
