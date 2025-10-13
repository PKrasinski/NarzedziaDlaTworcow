import { contextMerge } from "@arcote.tech/arc";
import { reactModel } from "@arcote.tech/arc-react";
import {
  authContext,
  contentContext,
  contentFormatsContext,
  contentIdeasContext,
  context1,
  context2,
  creatorGoalsContext,
  creatorIdentityContext,
  creatorStyleContext,
  narzedziaDlaTworcowOrderingContext,
  strategyContext,
  viewerTargetsContext,
} from "@narzedziadlatworcow.pl/context/browser";

const context = contextMerge(
  context1,
  context2,
  narzedziaDlaTworcowOrderingContext,
  creatorGoalsContext,
  creatorIdentityContext,
  creatorStyleContext,
  contentFormatsContext,
  contentContext,
  viewerTargetsContext,
  contentIdeasContext,
  strategyContext,
  authContext
);

const [
  ModelProvider,
  ModelLocalProvider,
  useQuery,
  useRevalidate,
  useCommands, // query - unused // useLocalModel - unused
  ,
  ,
  useModel,
] = reactModel(context, {
  remoteUrl: "/api",
});

export {
  context,
  ModelLocalProvider,
  ModelProvider,
  useCommands,
  useModel,
  useQuery,
  useRevalidate,
};
