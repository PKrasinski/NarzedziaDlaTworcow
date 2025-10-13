import { array, object, string, stringEnum } from "@arcote.tech/arc";

export const identitySchema = object({
  name: string()
    .description(
      "Name or title of the creator/brand that will be displayed in views"
    )
    .optional(),

  entityType: stringEnum("individual", "team", "brand", "project")
    .description(
      "Type of creator entity - individual person, team, brand, or project"
    )
    .optional(),

  stage: stringEnum("aspiring", "growing", "established")
    .description(
      "Current development stage of the creator - aspiring (just starting), growing (developing), or established (mature)"
    )
    .optional(),

  description: string()
    .description(
      "Short self-definition or slogan that captures the creator's essence"
    )
    .optional(),

  originStory: string()
    .description(
      "The story of why and how the creator(s) started their journey - their motivation and beginning"
    )
    .optional(),

  currentStructure: string()
    .description(
      "Who is involved in the content creation process and what are their specific roles"
    )
    .optional(),

  currentActivities: string()
    .description(
      "What kind of content, actions, or activities the creator is currently doing"
    )
    .optional(),

  futureVision: string()
    .description(
      "How the creator wants to be perceived and seen in the future - their aspirational identity"
    )
    .optional(),

  imageOfCreator: string()
    .description(
      "How creator wants to be seen by viewers (brand image, persona, public perception - not a photo)"
    )
    .optional(),

  uniqueStrengths: array(string())
    .description(
      "List of unique strengths, skills, or capabilities that set the creator apart"
    )
    .optional(),

  productsOrServices: array(string())
    .description(
      "List of products, services, or offerings that the creator provides"
    )
    .optional(),

  channelsAlreadyUsed: array(string())
    .description(
      "List of content channels, platforms, or mediums the creator is already using"
    )
    .optional(),
});

export const identityUpdateSchema = identitySchema;
