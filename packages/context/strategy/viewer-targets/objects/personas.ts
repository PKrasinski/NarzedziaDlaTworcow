import { array, id, string } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";

// ID type for personas
export const personaId = id("persona");

// Main persona schema - all fields optional for flexibility
export const personaSchema = {
  // Basic identification
  name: string()
    .description("Nazwa persony (np. Marta Minimalistka)")
    .optional(),
  age: string().description("Wiek lub przedział wiekowy").optional(),

  // Lifestyle and context
  lifestyle: string()
    .description("Styl życia, zawód lub kontekst życiowy")
    .optional(),
  motivations: string().description("Motywacje i potrzeby").optional(),
  challenges: array(string()).description("Wyzwania lub problemy").optional(),
  values: string().description("Wartości lub przekonania").optional(),

  // Online behavior
  onlineBehavior: string()
    .description(
      "Zachowania online (aktywność, media społecznościowe, sposób konsumpcji treści)"
    )
    .optional(),
  communicationStyle: string()
    .description("Język lub sposób komunikacji")
    .optional(),

  // Creator alignment
  knowledgeLevel: string()
    .description("Stopień wiedzy lub doświadczenia w temacie twórcy")
    .optional(),
  creatorAlignment: string()
    .description("Dopasowanie do celów twórcy")
    .optional(),

  // Goals and preferences
  goals: array(string()).description("Co chce osiągnąć").optional(),
  preferredChannels: array(string())
    .description("Preferowane kanały treści")
    .optional(),
  contentPreferences: string()
    .description("Preferencje dotyczące treści")
    .optional(),
} as const;

// Full persona schema for storage (includes accountWorkspaceId)
export const fullPersonaSchema = {
  ...personaSchema,
  accountWorkspaceId,
} as const;

export const personaUpdateSchema = personaSchema;
