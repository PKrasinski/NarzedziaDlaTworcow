import { id, object, string } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { personaId } from "../../viewer-targets/objects/personas";
import {
  ContentTypeAlias as ImportedContentTypeAlias,
  contentTypesRules,
  contentTypeAliases as importedContentTypeAliases,
} from "./content-structure";

// ID type for formats
export const formatId = id("format");

// Base content format fields - all optional for flexibility
const baseFields = {
  name: string()
    .description("Nazwa formatu treści")
    .minLength(1)
    .maxLength(100)
    .optional(),
  subtitle: string()
    .description("Krótki podtytuł formatu (max 8 słów)")
    .minLength(1)
    .maxLength(60)
    .optional(),
  description: string()
    .description("Krótki opis formatu")
    .minLength(1)
    .maxLength(200)
    .optional(),
  rules: string()
    .description("Zasady tworzenia treści w tym formacie")
    .optional(),
  personaId: personaId.optional(),
};

// Main format schema (without accountWorkspaceId for commands/forms)
export const formatSchema = {
  ...baseFields,
  ...contentTypesRules,
} as const;

// Full format schema for storage (includes accountWorkspaceId)
export const fullFormatSchema = {
  ...formatSchema,
  accountWorkspaceId,
} as const;

// Export the content format object type
export const contentFormat = object(formatSchema);

// Helper types
export type ContentFormatType = ReturnType<typeof contentFormat.parse>;
export type FormatSchemaType = typeof formatSchema;

// Available content type aliases - imported from content-structure
export const contentTypeAliases = importedContentTypeAliases;

export type ContentTypeAlias = ImportedContentTypeAlias;

export const formatUpdateSchema = formatSchema;
