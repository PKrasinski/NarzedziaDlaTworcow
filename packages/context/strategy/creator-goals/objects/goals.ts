import { array, id, string } from "@arcote.tech/arc";

// ID type for goals
export const goalId = id("goal");

// Plain object schemas for reuse
export const goalSchema = {
  objective: string()
    .description("High-level objective or goal description")
    .optional(),
  keyResults: array(string())
    .description("Measurable key results or outcomes for this objective")
    .optional(),
} as const;

export const goalUpdateSchema = goalSchema;
