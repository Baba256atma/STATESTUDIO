/**
 * NPA-T STAGE-PROD:1 — live Stage host identity handoff.
 * Projection only. UI must not reinterpret Director/Theatre scene intent.
 */

import type { NexoraDecisionTheatreSceneIntentKind } from "@/app/lib/decision-theatre/nexoraDecisionTheatreSceneIntent.ts";
import {
  stageProdLiveFoundationHostIdentity,
  stageProdLiveFoundationIdentity,
  stageProdLiveFoundationMountName,
  stageProdLiveFoundationRoute,
  stageProdLiveFoundationVersion,
} from "./stageProdLiveFoundationIdentity.ts";

export const STAGE_PROD_LIVE_FOUNDATION_STATUSES = Object.freeze([
  "ok",
  "partial",
  "missing",
] as const);
export type StageProdLiveFoundationStatus =
  (typeof STAGE_PROD_LIVE_FOUNDATION_STATUSES)[number];

export type StageProdLiveFoundationIdentities = Readonly<{
  businessContextIds: readonly string[];
  goalIds: readonly string[];
  problemRiskIds: readonly string[];
  kpiDataIds: readonly string[];
  variableIds: readonly string[];
  scenarioIds: readonly string[];
  decisionIds: readonly string[];
  executionIds: readonly string[];
  outcomeIds: readonly string[];
  learningIds: readonly string[];
  focusedCanonicalObjectId: string | null;
  theatrePrimaryObjectId: string | null;
  conversationalReferentId: string | null;
  directorIntent: string | null;
  theatreSceneIntentKind: NexoraDecisionTheatreSceneIntentKind | null;
  theatreSceneScriptId: string | null;
  theatreSceneIdentity: string | null;
  nmiLiveIdentity: string | null;
  dthExpSceneIdentity: string | null;
}>;

export type StageProdLiveFoundationProjection = Readonly<{
  identity: typeof stageProdLiveFoundationIdentity;
  version: typeof stageProdLiveFoundationVersion;
  route: typeof stageProdLiveFoundationRoute;
  host: typeof stageProdLiveFoundationHostIdentity;
  mount: typeof stageProdLiveFoundationMountName;
  status: StageProdLiveFoundationStatus;
  degraded: boolean;
  inventedFacts: false;
  identities: StageProdLiveFoundationIdentities;
  writesCanonicalManagementState: false;
  parallelStageStore: false;
  parallelDirector: false;
  parallelTheatre: false;
  startsStageProd2: false;
}>;
