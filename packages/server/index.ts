import { contextMerge, type ArcContextAny } from "@arcote.tech/arc";
import { postgreSQLAdapterFactory } from "@arcote.tech/arc-host";
import { rtcHostFactory } from "@arcote.tech/arc-host/host";
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
} from "@narzedziadlatworcow.pl/context/server";

const postgresUrl =
  process.env.POSTGRES_URL ||
  "postgresql://postgres:postgres123@localhost:5432/narzedziadlatworcow";
const dbVersion = parseInt(process.env.DATABASE_VERSION || "1", 10);

const context = contextMerge(
  context1,
  context2,
  narzedziaDlaTworcowOrderingContext,
  contentContext,
  creatorGoalsContext,
  creatorIdentityContext,
  creatorStyleContext,
  contentFormatsContext,
  contentIdeasContext,
  viewerTargetsContext,
  strategyContext,
  authContext
);

// Custom PostgreSQL implementation
function hostLiveModelPostgreSQL<C extends ArcContextAny>(
  context: C,
  options: { postgresUrl: string; version: number }
) {
  const dbAdapterFactory = postgreSQLAdapterFactory(options.postgresUrl);
  rtcHostFactory(context, dbAdapterFactory(context))();
}

hostLiveModelPostgreSQL(context, {
  postgresUrl,
  version: dbVersion,
});
