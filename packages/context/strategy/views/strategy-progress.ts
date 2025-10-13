import { boolean, date, object, view } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../account-workspace";
import contentFormatsStepCompleted from "../content-formats/events/content-formats-step-completed";
import creatorGoalsStepCompleted from "../creator-goals/events/creator-goals-step-completed";
import creatorIdentityStepCompleted from "../creator-identity/events/creator-identity-step-completed";
import creatorStyleStepCompleted from "../creator-style/events/creator-style-step-completed";
import viewerTargetsStepCompleted from "../viewer-targets/events/viewer-targets-step-completed";

export const strategyProgress = view(
  "strategyProgress",
  accountWorkspaceId,
  object({
    accountWorkspaceId,
    creatorIdentityCompleted: boolean().optional(),
    creatorIdentityCompletedAt: date().optional(),
    creatorGoalsCompleted: boolean().optional(),
    creatorGoalsCompletedAt: date().optional(),
    viewerTargetsCompleted: boolean().optional(),
    viewerTargetsCompletedAt: date().optional(),
    creatorStyleCompleted: boolean().optional(),
    creatorStyleCompletedAt: date().optional(),
    contentFormatsCompleted: boolean().optional(),
    contentFormatsCompletedAt: date().optional(),
  })
)
  .handleEvent(creatorIdentityStepCompleted, async (ctx, event) => {
    await ctx.set(event.payload.accountWorkspaceId, {
      accountWorkspaceId: event.payload.accountWorkspaceId,
      creatorIdentityCompleted: true,
      creatorIdentityCompletedAt: event.createdAt,
      creatorGoalsCompleted: false,
      creatorGoalsCompletedAt: null,
      viewerTargetsCompleted: false,
      viewerTargetsCompletedAt: null,
      creatorStyleCompleted: false,
      creatorStyleCompletedAt: null,
      contentFormatsCompleted: false,
      contentFormatsCompletedAt: null,
    });
  })
  .handleEvent(creatorGoalsStepCompleted, async (ctx, event) => {
    await ctx.modify(event.payload.accountWorkspaceId, {
      creatorGoalsCompleted: true,
      creatorGoalsCompletedAt: event.createdAt,
    });
  })
  .handleEvent(viewerTargetsStepCompleted, async (ctx, event) => {
    await ctx.modify(event.payload.accountWorkspaceId, {
      viewerTargetsCompleted: true,
      viewerTargetsCompletedAt: event.createdAt,
    });
  })
  .handleEvent(creatorStyleStepCompleted, async (ctx, event) => {
    await ctx.modify(event.payload.accountWorkspaceId, {
      creatorStyleCompleted: true,
      creatorStyleCompletedAt: event.createdAt,
    });
  })
  .handleEvent(contentFormatsStepCompleted, async (ctx, event) => {
    await ctx.modify(event.payload.accountWorkspaceId, {
      contentFormatsCompleted: true,
      contentFormatsCompletedAt: event.createdAt,
    });
  });
