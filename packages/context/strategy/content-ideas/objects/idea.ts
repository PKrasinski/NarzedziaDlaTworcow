import { id, string } from "@arcote.tech/arc";
import { formatId } from "../../content-formats/objects/format";

// ID type for ideas
export const ideaId = id("idea");

// Main idea schema (all fields optional for flexibility)
export const ideaSchema = {
  title: string()
    .description("Tytuł pomysłu na treść")
    .minLength(1)
    .maxLength(200)
    .optional(),
  formatId: formatId.optional(),
} as const;

// Helper types
export type IdeaType = typeof ideaSchema;

export const ideaUpdateSchema = ideaSchema;
