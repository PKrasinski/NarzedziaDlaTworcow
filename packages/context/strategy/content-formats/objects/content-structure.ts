import {
  ArcElement,
  ArcOptional,
  ArcRawShape,
  array,
  date,
  file,
  object,
  string,
} from "@arcote.tech/arc";

// Helper type to create rule field names from generatable schema keys
type CreateRuleFields<T extends ArcRawShape> = {
  [K in keyof T as `${string & K}Rules`]: ReturnType<typeof string>;
};

// Helper to create rule object from generatable schema
function createRuleObject<T extends ArcRawShape>(
  generatableSchema: T
): CreateRuleFields<T> {
  const ruleFields = {} as any;
  for (const key in generatableSchema) {
    ruleFields[`${key}Rules`] = string().description(
      `Rules for generating ${key}`
    );
  }
  return ruleFields;
}

export const generatableContentType = <
  const Alias extends string,
  const GeneratableSchema extends ArcRawShape,
  const NotGeneratableSchema extends ArcRawShape
>(
  alias: Alias,
  generatableSchema: GeneratableSchema,
  notGeneratableSchema: NotGeneratableSchema
) => {
  const fullSchema = { ...generatableSchema, ...notGeneratableSchema };
  const ruleObject = createRuleObject(generatableSchema);

  return {
    alias,
    generatableSchema: object(generatableSchema),
    notGeneratableSchema: object(notGeneratableSchema),
    fullSchema: object(fullSchema),
    ruleObject: object(ruleObject).optional(),
    generatableFieldNames: Object.keys(
      generatableSchema
    ) as (keyof GeneratableSchema)[],
  };
};

// Instagram Content Types
const instagramPost = generatableContentType(
  "instagramPost",
  {
    description: string(),
  },
  {
    media: file(),
    hashtags: array(string()).optional(),
    mentions: array(string()).optional(),
    publishAt: date().optional(),
  }
);

const instagramStory = generatableContentType(
  "instagramStory",
  {
    text: string(),
  },
  {
    media: file(),
    stickers: array(string()).optional(),
    publishAt: date().optional(),
  }
);

const instagramReel = generatableContentType(
  "instagramReel",
  {
    description: string(),
  },
  {
    video: file(),
    music: string().optional(),
    hashtags: array(string()).optional(),
    cover: file().optional(),
    publishAt: date().optional(),
  }
);

const instagramCarousel = generatableContentType(
  "instagramCarousel",
  {
    description: string(),
  },
  {
    media: array(file()),
    hashtags: array(string()).optional(),
    mentions: array(string()).optional(),
    publishAt: date().optional(),
  }
);

// TikTok Content Types
const tiktokVideo = generatableContentType(
  "tiktokVideo",
  {
    description: string(),
  },
  {
    video: file(),
    hashtags: array(string()).optional(),
    music: string().optional(),
    effects: array(string()).optional(),
    brandedContent: string().optional(),
    aiGenerated: string().optional(),
    publishAt: date().optional(),
  }
);

// LinkedIn Content Types
const linkedinPost = generatableContentType(
  "linkedinPost",
  {
    text: string(),
  },
  {
    media: file().optional(),
    hashtags: array(string()).optional(),
    mentions: array(string()).optional(),
    publishAt: date().optional(),
  }
);

const linkedinArticle = generatableContentType(
  "linkedinArticle",
  {
    title: string(),
    content: string(),
    description: string(),
  },
  {
    thumbnail: file().optional(),
    publishAt: date().optional(),
  }
);

const linkedinVideo = generatableContentType(
  "linkedinVideo",
  {
    title: string(),
    description: string(),
  },
  {
    video: file(),
    thumbnail: file().optional(),
    hashtags: array(string()).optional(),
    publishAt: date().optional(),
  }
);

// Twitter/X Content Types
const twitterTweet = generatableContentType(
  "twitterTweet",
  {
    text: string(),
  },
  {
    media: array(file()).optional(),
    hashtags: array(string()).optional(),
    mentions: array(string()).optional(),
    publishAt: date().optional(),
  }
);

const twitterThread = generatableContentType(
  "twitterThread",
  {
    threadContent: string(),
  },
  {
    tweets: array(
      object({
        text: string(),
        media: array(file()).optional(),
      })
    ),
    hashtags: array(string()).optional(),
    mentions: array(string()).optional(),
    publishAt: date().optional(),
  }
);

const twitterVideo = generatableContentType(
  "twitterVideo",
  {
    text: string(),
  },
  {
    video: file(),
    hashtags: array(string()).optional(),
    mentions: array(string()).optional(),
    publishAt: date().optional(),
  }
);

// YouTube Content Types
const youtubeVideo = generatableContentType(
  "youtubeVideo",
  {
    title: string(),
    description: string(),
  },
  {
    video: file(),
    thumbnail: file().optional(),
    tags: array(string()).optional(),
    category: string().optional(),
    publishAt: date().optional(),
  }
);

const youtubeShorts = generatableContentType(
  "youtubeShorts",
  {
    title: string(),
    description: string(),
  },
  {
    video: file(),
    hashtags: array(string()).optional(),
    publishAt: date().optional(),
  }
);

// Custom Content Types (non-platform specific)
const longFormArticle = generatableContentType(
  "longFormArticle",
  {
    headline: string(),
    introduction: string(),
    mainContent: string(),
    conclusion: string(),
  },
  {
    wordCount: string().optional(),
    readingTime: string().optional(),
  }
);

// Content Planning Types
const shortVideoScenario = generatableContentType(
  "shortVideoScenario",
  {
    hook: string(),
    mainContent: string(),
    callToAction: string(),
  },
  {
    duration: string().optional(),
    platform: string().optional(),
    mood: string().optional(),
  }
);

const longVideoScenario = generatableContentType(
  "longVideoScenario",
  {
    introduction: string(),
    mainPoints: string(),
    conclusion: string(),
    callToAction: string(),
  },
  {
    duration: string().optional(),
    chapters: array(string()).optional(),
    resources: array(string()).optional(),
  }
);

const carouselIdeas = generatableContentType(
  "carouselIdeas",
  {
    title: string(),
    slides: string(),
  },
  {
    slideCount: string().optional(),
    designStyle: string().optional(),
    callToAction: string().optional(),
  }
);

// Export all generatable content types
export const generatableContentTypes = {
  // Platform-specific types
  instagramPost,
  instagramStory,
  instagramReel,
  instagramCarousel,
  tiktokVideo,
  linkedinPost,
  linkedinArticle,
  linkedinVideo,
  twitterTweet,
  twitterThread,
  twitterVideo,
  youtubeVideo,
  youtubeShorts,
  // Custom content types
  longFormArticle,
  // Content planning types
  shortVideoScenario,
  longVideoScenario,
  carouselIdeas,
} as const;

// Helper to get all content type aliases (calculated after the object is defined)
export const contentTypeAliases = Object.keys(
  generatableContentTypes
) as (keyof typeof generatableContentTypes)[];

export type ContentTypesRules<T extends typeof generatableContentTypes> = {
  [K in keyof T]: T[K] extends { ruleObject: infer R } ? R : never;
} & {};

export const contentTypesRules = Object.fromEntries(
  Object.entries(generatableContentTypes).map(([key, type]) => [
    key,
    type.ruleObject,
  ])
) as ContentTypesRules<typeof generatableContentTypes>;

export type ContentTypesGeneratable<T extends typeof generatableContentTypes> =
  {
    [K in keyof T]: T[K] extends { generatableSchema: infer R } ? R : never;
  } & {};

export const contentTypesGeneratable = Object.fromEntries(
  Object.entries(generatableContentTypes).map(([key, type]) => [
    key,
    type.generatableSchema,
  ])
) as ContentTypesGeneratable<typeof generatableContentTypes>;

export type ContentTypesFullSchema<T extends typeof generatableContentTypes> = {
  [K in keyof T]: T[K] extends { fullSchema: infer R } ? R : never;
} & {};

export const contentTypesFullSchema = Object.fromEntries(
  Object.entries(generatableContentTypes).map(([key, type]) => [
    key,
    type.fullSchema,
  ])
) as ContentTypesFullSchema<typeof generatableContentTypes>;

export type ContentTypesFullSchemaOptionals<
  T extends typeof generatableContentTypes
> = {
  [K in keyof T]: T[K] extends { fullSchema: infer R extends ArcElement }
    ? ArcOptional<R>
    : never;
} & {};

export const contentTypesFullSchemaOptionals = Object.fromEntries(
  Object.entries(generatableContentTypes).map(([key, type]) => [
    key,
    type.fullSchema.optional(),
  ])
) as ContentTypesFullSchemaOptionals<typeof generatableContentTypes>;

export type GeneratableContentType =
  (typeof generatableContentTypes)[keyof typeof generatableContentTypes];
export type ContentTypeAlias = keyof typeof generatableContentTypes;

export type RuleObjectType<T> = T extends { ruleObject: infer R } ? R : never;
