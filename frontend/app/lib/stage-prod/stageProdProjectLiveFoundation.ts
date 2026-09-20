/**
 * NPA-T STAGE-PROD:1 — project canonical identities onto the existing live Stage host.
 * Does not compose a second Theatre, Director, NMI model, or Stage store.
 */

import type { NexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreSceneIntentKind } from "@/app/lib/decision-theatre/nexoraDecisionTheatreSceneIntent.ts";
import type { ManagementMap, NmiManagementMapSection } from "@/app/lib/nmi/nmiManagementMapContract.ts";
import type { NmiLiveManagementIntelligence } from "@/app/lib/nmi/nmiLivePipeline.ts";
import type { StageProdLiveFoundationProjection } from "./stageProdLiveFoundationContract.ts";
import {
  stageProdLiveFoundationHostIdentity,
  stageProdLiveFoundationIdentity,
  stageProdLiveFoundationMountName,
  stageProdLiveFoundationRoute,
  stageProdLiveFoundationVersion,
} from "./stageProdLiveFoundationIdentity.ts";

export type StageProdLiveFoundationInput = Readonly<{
  theatre?: NexoraDecisionTheatreFoundation | null;
  nmi?: NmiLiveManagementIntelligence | null;
  focusedCanonicalObjectId?: string | null;
  conversationalReferentId?: string | null;
  dthExpSceneIdentity?: string | null;
}>;

function sectionIds(
  map: ManagementMap | null,
  sections: readonly NmiManagementMapSection[],
): readonly string[] {
  if (map == null) return Object.freeze([]);
  const wanted = new Set(sections);
  return Object.freeze(
    map.nodes
      .filter((node) => wanted.has(node.section))
      .map((node) => node.canonicalRef.id),
  );
}

export function projectStageProdLiveFoundation(
  input: StageProdLiveFoundationInput = {},
): StageProdLiveFoundationProjection {
  const theatre = input.theatre ?? null;
  const nmi = input.nmi ?? null;
  const map = nmi?.map ?? null;
  const sceneIntentKind =
    theatre?.sceneIntent.intentKind ?? (null as NexoraDecisionTheatreSceneIntentKind | null);
  const status =
    theatre == null
      ? ("missing" as const)
      : nmi == null || sceneIntentKind == null
        ? ("partial" as const)
        : ("ok" as const);
  const focusedCanonicalObjectId = input.focusedCanonicalObjectId ?? null;
  return Object.freeze({
    identity: stageProdLiveFoundationIdentity,
    version: stageProdLiveFoundationVersion,
    route: stageProdLiveFoundationRoute,
    host: stageProdLiveFoundationHostIdentity,
    mount: stageProdLiveFoundationMountName,
    status,
    degraded: status !== "ok",
    inventedFacts: false as const,
    identities: Object.freeze({
      businessContextIds: sectionIds(map, ["CONTEXT"]),
      goalIds: sectionIds(map, ["GOALS"]),
      problemRiskIds: sectionIds(map, ["PROBLEMS", "RISKS"]),
      kpiDataIds: sectionIds(map, ["KPI_DATA"]),
      variableIds: sectionIds(map, ["VARIABLES"]),
      scenarioIds: sectionIds(map, ["SCENARIOS"]),
      decisionIds: sectionIds(map, ["DECISIONS"]),
      executionIds: sectionIds(map, ["EXECUTIONS"]),
      outcomeIds: sectionIds(map, ["OUTCOMES"]),
      learningIds: sectionIds(map, ["LEARNING"]),
      focusedCanonicalObjectId,
      theatrePrimaryObjectId: theatre?.primaryExecutiveObjectId ?? null,
      conversationalReferentId: input.conversationalReferentId ?? null,
      directorIntent: theatre?.directorProjection?.intent ?? null,
      theatreSceneIntentKind: sceneIntentKind,
      theatreSceneScriptId: theatre?.sceneScript.scriptId ?? null,
      theatreSceneIdentity: theatre?.theatreSceneIdentity ?? null,
      nmiLiveIdentity: nmi?.identity ?? null,
      dthExpSceneIdentity: input.dthExpSceneIdentity ?? null,
    }),
    writesCanonicalManagementState: false as const,
    parallelStageStore: false as const,
    parallelDirector: false as const,
    parallelTheatre: false as const,
    startsStageProd2: false as const,
  });
}
