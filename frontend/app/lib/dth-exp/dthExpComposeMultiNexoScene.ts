/**
 * NPA-T DTH-EXP:8B — compose one Theatre projection from 8A eligibility + primary 5A/6.
 * Local attachment only. Does not rearrange the primary scene or invent truth.
 */

import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import {
  DTH_EXP_MULTI_NEXO_ATTENTION_HIERARCHY,
  DTH_EXP_SUPPORTING_VISUAL_ROLE,
  type DthExpMultiNexoConflictCategory,
  type DthExpMultiNexoDisclosureState,
  type DthExpMultiNexoSupportEntry,
} from "./dthExpMultiNexoCompositionContract.ts";
import {
  DTH_EXP_MULTI_NEXO_COMPOSITION_LAYERS,
  DTH_EXP_MULTI_NEXO_CONFLICT_PRIORITY,
  type DthExpMultiNexoAttachment,
  type DthExpMultiNexoComposedActor,
  type DthExpMultiNexoComposedScene,
  type DthExpMultiNexoSceneDensity,
  type DthExpMultiNexoSceneInput,
} from "./dthExpMultiNexoSceneContract.ts";
import {
  DTH_EXP_MULTI_NEXO_SCENE_ENGINE,
  dthExpMultiNexoSceneIdentity,
  dthExpMultiNexoSceneVersion,
} from "./dthExpMultiNexoSceneIdentity.ts";

const OFFSET: Readonly<Partial<Record<DthExpNexoRecipeFamily, { readonly x: number; readonly y: number }>>> = Object.freeze({
  NEXO_RISK: Object.freeze({ x: 0.04, y: 0.03 }),
  NEXO_IMPACT: Object.freeze({ x: -0.04, y: 0.03 }),
  NEXO_TIME: Object.freeze({ x: 0, y: -0.04 }),
  NEXO_EXECUTION: Object.freeze({ x: 0.03, y: -0.03 }),
  NEXO_OUTCOME: Object.freeze({ x: -0.03, y: -0.03 }),
});

const VISIBLE_SUPPORT_CAP = 2;

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function sortFamilies(families: readonly DthExpNexoRecipeFamily[]): readonly DthExpNexoRecipeFamily[] {
  return Object.freeze([...families].sort((left, right) => left.localeCompare(right)));
}

function uniqueConflicts(items: readonly DthExpMultiNexoConflictCategory[]): readonly DthExpMultiNexoConflictCategory[] {
  return Object.freeze([...new Set(items)]);
}

function relevance(entry: DthExpMultiNexoSupportEntry, focalId: string | null, subjectId: string): number {
  if (focalId != null && entry.attachedCanonicalObjectIds.includes(focalId)) return 2;
  if (entry.attachedCanonicalObjectIds.includes(subjectId)) return 1;
  return 0;
}

function densityFor(visibleCount: number): DthExpMultiNexoSceneDensity {
  if (visibleCount >= 4) return "overloaded";
  if (visibleCount === 3) return "dense";
  if (visibleCount === 2) return "normal";
  return "sparse";
}

export function composeDthExpMultiNexoScene(input: DthExpMultiNexoSceneInput): DthExpMultiNexoComposedScene {
  const plan = input.eligibility;
  const spatial = input.spatial;
  const focalId = spatial.focalCanonicalObjectId;
  const eligible = plan.supports.filter((item) => item.eligible);
  const omittedFromPlan = plan.supports.filter((item) => !item.eligible).map((item) => item.family);
  const resolved: DthExpMultiNexoConflictCategory[] = plan.supports
    .map((item) => item.conflict)
    .filter((item): item is DthExpMultiNexoConflictCategory => item != null);

  const fallback = plan.fallbackToSinglePrimary;
  const ranked = [...eligible].sort((left, right) => {
    const delta = relevance(right, focalId, plan.canonicalSubjectId) - relevance(left, focalId, plan.canonicalSubjectId);
    return delta !== 0 ? delta : left.family.localeCompare(right.family);
  });

  const combinedRiskImpact =
    ranked.some((item) => item.family === "NEXO_RISK") && ranked.some((item) => item.family === "NEXO_IMPACT");
  const deferred: DthExpNexoRecipeFamily[] = [];
  const admitted: DthExpNexoRecipeFamily[] = [];
  const disclosureByFamily = new Map<DthExpNexoRecipeFamily, DthExpMultiNexoDisclosureState>();

  if (!fallback) {
    for (const [index, entry] of ranked.entries()) {
      const combinedAttention = combinedRiskImpact && entry.family === "NEXO_TIME";
      if (index >= VISIBLE_SUPPORT_CAP || combinedAttention) {
        deferred.push(entry.family);
        disclosureByFamily.set(entry.family, index >= 3 ? "omitted" : "collapsed");
        resolved.push("density-conflict");
        continue;
      }
      admitted.push(entry.family);
      disclosureByFamily.set(entry.family, entry.compatibility === "conditionally-compatible" ? "contextual" : "visible");
    }
  } else {
    for (const entry of eligible) {
      deferred.push(entry.family);
      disclosureByFamily.set(entry.family, "omitted");
    }
  }

  const visibleCount = admitted.length;
  const density = fallback ? "sparse" : densityFor(visibleCount + deferred.filter((item) => disclosureByFamily.get(item) === "collapsed").length);

  const attachments: DthExpMultiNexoAttachment[] = [];
  if (!fallback) {
    for (const family of admitted) {
      const entry = plan.supports.find((item) => item.family === family)!;
      const offset = OFFSET[family] ?? { x: 0.02, y: 0.02 };
      for (const actorId of entry.attachedCanonicalObjectIds) {
        const layout = spatial.actors.find((item) => item.canonicalObjectId === actorId);
        if (layout == null) continue;
        attachments.push(
          Object.freeze({
            family,
            attachedToCanonicalObjectId: actorId,
            attachmentTarget: "actor" as const,
            primaryPosition: layout.position,
            localOffset: Object.freeze({ x: offset.x, y: offset.y }),
            annotationPosition: Object.freeze({
              x: clamp(layout.position.x + offset.x),
              y: clamp(layout.position.y + offset.y),
            }),
            disclosure: disclosureByFamily.get(family) ?? "contextual",
            reason: entry.reason,
            causalSeparationHint: combinedRiskImpact && (family === "NEXO_RISK" || family === "NEXO_IMPACT"),
            rearrangesBaseScene: false as const,
          }),
        );
      }
    }
  }

  const actors: DthExpMultiNexoComposedActor[] = spatial.actors.map((layout) => {
    const annotation = plan.actors.find((item) => item.canonicalObjectId === layout.canonicalObjectId);
    const supportingAnnotations = Object.freeze(
      admitted
        .filter((family) => plan.supports.some((item) => item.family === family && item.attachedCanonicalObjectIds.includes(layout.canonicalObjectId)))
        .map((family) => DTH_EXP_SUPPORTING_VISUAL_ROLE[family]),
    );
    return Object.freeze({
      canonicalObjectId: layout.canonicalObjectId,
      theatreActorCount: 1 as const,
      primaryVisualRole: annotation?.primaryVisualRole ?? null,
      supportingAnnotations,
      primaryPosition: layout.position,
      isFocal: layout.canonicalObjectId === focalId,
    });
  });

  const relationshipSemantics = Object.freeze(
    (input.scene?.relationships ?? spatial.relationshipPaths).map((item) =>
      Object.freeze({
        relationshipId: item.relationshipId,
        semanticRelation: item.semanticRelation,
      }),
    ),
  );

  const evidenceRefs = Object.freeze(
    [...new Set((input.evidence?.participants ?? []).map((item) => item.evidenceRef).concat([...plan.evidenceRefs]))].sort((left, right) =>
      left.localeCompare(right),
    ),
  );

  return Object.freeze({
    identity: dthExpMultiNexoSceneIdentity,
    version: dthExpMultiNexoSceneVersion,
    engine: DTH_EXP_MULTI_NEXO_SCENE_ENGINE,
    compositionId: `dth-exp:8b:${plan.compositionId}:${admitted.join("+") || "primary-only"}`,
    eligibilityCompositionId: plan.compositionId,
    canonicalSubjectId: plan.canonicalSubjectId,
    primaryFamily: plan.primaryFamily,
    admittedSupports: Object.freeze(sortFamilies(admitted)),
    omittedSupports: Object.freeze(sortFamilies(omittedFromPlan)),
    deferredSupports: Object.freeze(sortFamilies(deferred)),
    actors: Object.freeze(actors),
    attachments: Object.freeze(attachments),
    relationshipRefs: plan.relationshipRefs,
    relationshipSemantics,
    evidenceRefs,
    evidenceCopiedPerFamily: false,
    evidenceCountCreatesConfidence: false,
    layers: DTH_EXP_MULTI_NEXO_COMPOSITION_LAYERS,
    attentionHierarchy: DTH_EXP_MULTI_NEXO_ATTENTION_HIERARCHY,
    conflictPriority: DTH_EXP_MULTI_NEXO_CONFLICT_PRIORITY,
    resolvedConflicts: uniqueConflicts(resolved),
    unresolvedConflicts: Object.freeze([]),
    density,
    densityIsPresentationOnly: true,
    presentationPriorityIsBusinessRanking: false,
    primaryOwnsBaseSpatialGrammar: true,
    secondGlobalLayoutEngine: false,
    compositionCreatesCausality: false,
    fallbackToSinglePrimary: fallback,
    advisorConsumable: true,
    parsesRawText: false,
    choosesPrimaryFamily: false,
    transitionAuthority: "DTH-EXP:5B",
    secondAnimationEngine: false,
    reducedMotionComplete: true,
    liveStageWiring: false,
    multiNexoRendering: false,
    writesCanonicalObjects: false,
    writesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    assignsVaiRoles: false,
    calculatesRisk: false,
    ranksBubbleCandidates: false,
    parallelTimelineAuthority: false,
    declaresOutcomeSuccess: false,
  });
}
