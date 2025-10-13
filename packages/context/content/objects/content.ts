import { id, string } from "@arcote.tech/arc";
import {
  ContentTypeAlias,
  contentTypesFullSchema,
  contentTypesFullSchemaOptionals,
} from "../../strategy/content-formats/objects/content-structure";
import { formatId } from "../../strategy/content-formats/objects/format";

// ID type for content
export const contentId = id("content");

// Simplified content types mapping
type ContentTypesMapping = Record<ContentTypeAlias, any>;

// Simple content schema using content-structure directly
export const contentSchema = {
  title: string().description("Tytuł treści").minLength(1).maxLength(200),
  description: string().description("Opis treści").minLength(1).maxLength(1000),
  formatId: formatId.optional(),
  ...contentTypesFullSchemaOptionals,
} as const;

export const contentTypes = contentTypesFullSchema;

// Helper types
export type ContentType = typeof contentSchema;
export type ContentData = {
  _id: string;
  title: string;
  description: string;
  formatId: string;
  status: "ideas" | "in_progress" | "published";
  order: number;
} & Partial<ContentTypesMapping>;
