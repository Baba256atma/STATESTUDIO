/**
 * NPA-T DTH-EXP:9 — apply certified relevance classes through LOD and budgets.
 * Does not invent relevance, rank business importance, or measure browser FPS.
 */

import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpMultiNexoDisclosureState } from "./dthExpMultiNexoCompositionContract.ts";
import {
  DTH_EXP_THEATRE_SCALE_DEFAULT_BUDGET,
  DTH_EXP_THEATRE_SCALE_DEGRADATION_LADDER,
  type DthExpTheatreScaleAdmissionClass,
  type DthExpTheatreScaleActorCandidate,
  type DthExpTheatreScaleBudget,
  type DthExpTheatreScaleComplexity,
  type DthExpTheatreScaleDensity,
  type DthExpTheatreScaleGroup,
  type DthExpTheatreScaleInput,
  type DthExpTheatreScaleLod,
  type DthExpTheatreScaleRelationshipCandidate,
  type DthExpTheatreScaleWorkingSet,
} from "./dthExpTheatreScaleContract.ts";
import {
  DTH_EXP_THEATRE_SCALE_ENGINE,
  dthExpTheatreScaleIdentity,
  dthExpTheatreScaleVersion,
} from "./dthExpTheatreScaleIdentity.ts";

const CLASS_RANK: Readonly<Record<DthExpTheatreScaleAdmissionClass, number>> = Object.freeze({
  "required-subject": 0,
  "required-focal": 1,
  "required-primary": 2,
  "required-relationship": 2,
  "essential-evidence": 3,
  focused: 4,
  "focused-comparison": 4,
  contextual: 5,
  expanded: 6,
  unrelated: 7,
});

const LOD_MAX_RANK: Readonly<Record<DthExpTheatreScaleLod, number>> = Object.freeze({
  "lod-0": 3,
  "lod-1": 4,
  "lod-2": 5,
  "lod-3": 6,
});

function uniqueSorted(ids: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(ids)].sort((left, right) => left.localeCompare(right)));
}

function rankOf(admissionClass: DthExpTheatreScaleAdmissionClass): number {
  return CLASS_RANK[admissionClass];
}

function isRequiredActor(admissionClass: DthExpTheatreScaleAdmissionClass): boolean {
  return admissionClass === "required-subject" || admissionClass === "required-focal" || admissionClass === "required-primary";
}

function mergeBudget(partial: Partial<DthExpTheatreScaleBudget> | undefined): DthExpTheatreScaleBudget {
  return Object.freeze({ ...DTH_EXP_THEATRE_SCALE_DEFAULT_BUDGET, ...partial });
}

function lodFits(lod: DthExpTheatreScaleLod, admissionClass: DthExpTheatreScaleAdmissionClass): boolean {
  if (admissionClass === "unrelated") return false;
  return rankOf(admissionClass) <= LOD_MAX_RANK[lod];
}

function countFitting(items: readonly { readonly admissionClass: DthExpTheatreScaleAdmissionClass }[], lod: DthExpTheatreScaleLod): number {
  return items.filter((item) => lodFits(lod, item.admissionClass)).length;
}

function autoLod(input: DthExpTheatreScaleInput, budget: DthExpTheatreScaleBudget): DthExpTheatreScaleLod {
  const requested = input.requestedLod ?? null;
  const order: DthExpTheatreScaleLod[] = ["lod-3", "lod-2", "lod-1", "lod-0"];
  const start = requested != null ? order.indexOf(requested) : 0;
  for (const lod of order.slice(Math.max(0, start))) {
    const actors = countFitting(input.actors, lod);
    const rels = countFitting(input.relationships, lod);
    const essentialEvidence = input.evidence.filter(
      (item) => item.admissionClass === "essential-evidence" && lodFits(lod, item.admissionClass),
    ).length;
    if (actors <= budget.maxActiveActors && rels <= budget.maxActiveRelationships && essentialEvidence <= budget.maxActiveEvidencePresentations) {
      return lod;
    }
  }
  return "lod-0";
}

function densityOf(admittedActors: number, admittedRels: number, admittedEvidence: number, admittedSupports: number): DthExpTheatreScaleDensity {
  const load = admittedActors + admittedRels + admittedEvidence + admittedSupports * 2;
  if (load >= 40) return "overloaded";
  if (load >= 24) return "dense";
  if (load >= 10) return "normal";
  return "sparse";
}

function complexityOf(
  fallback: boolean,
  budgetExceeded: boolean,
  admittedActors: number,
  admittedRels: number,
): DthExpTheatreScaleComplexity {
  if (fallback || budgetExceeded) return "bounded-fallback";
  const load = admittedActors + admittedRels;
  if (load >= 28) return "heavy";
  if (load >= 12) return "moderate";
  return "light";
}

function admitByClass<T extends { readonly admissionClass: DthExpTheatreScaleAdmissionClass }>(
  items: readonly T[],
  lod: DthExpTheatreScaleLod,
  budget: number,
  required: (item: T) => boolean,
): { readonly admitted: readonly T[]; readonly deferred: readonly T[]; readonly omitted: readonly T[] } {
  const omitted = items.filter((item) => item.admissionClass === "unrelated" || !lodFits(lod, item.admissionClass));
  const inLod = items.filter((item) => lodFits(lod, item.admissionClass));
  const requiredItems = inLod.filter(required);
  const optional = inLod.filter((item) => !required(item));
  const remaining = Math.max(0, budget - requiredItems.length);
  const optionalByRank = new Map<number, T[]>();
  for (const item of optional) {
    const rank = rankOf(item.admissionClass);
    const bucket = optionalByRank.get(rank) ?? [];
    bucket.push(item);
    optionalByRank.set(rank, bucket);
  }
  const admittedOptional: T[] = [];
  const deferredOptional: T[] = [];
  let slots = remaining;
  for (const rank of [...optionalByRank.keys()].sort((left, right) => left - right)) {
    const bucket = optionalByRank.get(rank) ?? [];
    if (bucket.length <= slots) {
      admittedOptional.push(...bucket);
      slots -= bucket.length;
    } else {
      deferredOptional.push(...bucket);
    }
  }
  return Object.freeze({
    admitted: Object.freeze([...requiredItems, ...admittedOptional]),
    deferred: Object.freeze(deferredOptional),
    omitted: Object.freeze(omitted),
  });
}

function groupBy<T>(items: readonly T[], key: (item: T) => string): readonly [string, T[]][] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const id = key(item);
    const bucket = map.get(id) ?? [];
    bucket.push(item);
    map.set(id, bucket);
  }
  return Object.freeze([...map.entries()]);
}

function groupsFrom(actors: readonly DthExpTheatreScaleActorCandidate[], deferred: readonly DthExpTheatreScaleActorCandidate[]): readonly DthExpTheatreScaleGroup[] {
  const byKey = new Map<string, string[]>();
  for (const actor of [...actors, ...deferred]) {
    if (actor.comparisonMember === true || actor.admissionClass === "focused-comparison") continue;
    if (actor.admissionClass !== "contextual" && actor.admissionClass !== "expanded") continue;
    const key = actor.groupingKey ?? null;
    if (key == null) continue;
    const members = byKey.get(key) ?? [];
    members.push(actor.canonicalObjectId);
    byKey.set(key, members);
  }
  return Object.freeze(
    [...byKey.entries()]
      .filter(([, members]) => members.length >= 3)
      .map(([groupingKey, members]) =>
        Object.freeze({
          groupingKey,
          memberCanonicalObjectIds: uniqueSorted(members),
          disclosure: "collapsed" as DthExpMultiNexoDisclosureState,
          presentationOnly: true as const,
          inventsCanonicalGroupObject: false as const,
        }),
      ),
  );
}

export function applyDthExpTheatreScale(input: DthExpTheatreScaleInput): DthExpTheatreScaleWorkingSet {
  const budget = mergeBudget(input.budget);
  const degradation: string[] = [];
  let lod = autoLod(input, budget);
  if (input.requestedLod != null && lod !== input.requestedLod) {
    degradation.push("lower-lod");
  }

  const forceSingle = input.fallbackToSinglePrimary === true;
  if (forceSingle) {
    degradation.push("fallback-minimal-certified-primary");
  }

  const actorDecision = admitByClass(input.actors, lod, budget.maxActiveActors, (item) => isRequiredActor(item.admissionClass));
  let admittedActors = forceSingle ? actorDecision.admitted.filter((item) => isRequiredActor(item.admissionClass)) : [...actorDecision.admitted];
  let deferredActors = forceSingle
    ? input.actors.filter((item) => !isRequiredActor(item.admissionClass) && item.admissionClass !== "unrelated")
    : [...actorDecision.deferred];
  if (deferredActors.length > 0) {
    degradation.push("collapse-distant-contextual-actors");
  }

  const requiredActorIds = new Set(input.actors.filter((item) => isRequiredActor(item.admissionClass)).map((item) => item.canonicalObjectId));
  const relDecision = admitByClass(
    input.relationships,
    lod,
    budget.maxActiveRelationships,
    (item) => item.admissionClass === "required-relationship" || item.admissionClass === "required-primary",
  );
  let admittedRels: readonly DthExpTheatreScaleRelationshipCandidate[] = forceSingle
    ? relDecision.admitted.filter((item) => item.admissionClass === "required-relationship" || item.admissionClass === "required-primary")
    : relDecision.admitted;
  if (relDecision.deferred.length > 0 || forceSingle) {
    degradation.push("reduce-contextual-relationships");
  }

  const evidenceDecision = admitByClass(
    input.evidence,
    lod,
    budget.maxActiveEvidencePresentations,
    (item) => item.admissionClass === "essential-evidence",
  );
  let admittedEvidence = forceSingle
    ? evidenceDecision.admitted.filter((item) => item.admissionClass === "essential-evidence")
    : [...evidenceDecision.admitted];
  const deferredEvidence = forceSingle
    ? input.evidence.filter((item) => item.admissionClass !== "essential-evidence" && item.admissionClass !== "unrelated")
    : [...evidenceDecision.deferred];
  if (deferredEvidence.length > 0) {
    degradation.push("collapse-contextual-evidence");
  }

  const supportDecision = admitByClass(input.supports, lod, forceSingle ? 0 : budget.maxSupportingAnnotations, () => false);
  if (supportDecision.deferred.length > 0 || forceSingle) {
    degradation.push("defer-lower-relevance-supporting-nexo");
    degradation.push("reduce-secondary-supporting-annotations");
  }

  const requiredActorOverflow = admittedActors.length > budget.maxActiveActors;
  const fallbackToMinimalPrimary =
    forceSingle || requiredActorOverflow || (lod === "lod-0" && input.actors.filter((item) => isRequiredActor(item.admissionClass)).length > budget.maxActiveActors);
  if (requiredActorOverflow) {
    degradation.push("fallback-minimal-certified-primary");
    admittedActors = admittedActors.filter((item) => isRequiredActor(item.admissionClass));
    deferredActors = input.actors.filter((item) => !isRequiredActor(item.admissionClass) && item.admissionClass !== "unrelated");
    admittedRels = admittedRels.filter((item) => item.admissionClass === "required-relationship" || item.admissionClass === "required-primary");
    admittedEvidence = admittedEvidence.filter((item) => item.admissionClass === "essential-evidence");
    lod = "lod-0";
  }

  const clusters = Object.freeze(
    groupBy(deferredEvidence, (item) => item.attachedToId)
      .slice(0, budget.maxExpandedEvidenceClusters)
      .map(([attachedToId, refs]) =>
        Object.freeze({
          attachedToId,
          evidenceRefs: uniqueSorted(refs.map((item) => item.evidenceRef)),
          disclosure: "collapsed" as DthExpMultiNexoDisclosureState,
          countCreatesConfidence: false as const,
          provenanceMerged: false as const,
        }),
      ),
  );

  const transition = input.transitionCandidates ?? [];
  const transitionAdmitted = transition.filter((item) => item.persistentFocal || isRequiredActor(item.admissionClass));
  const transitionOptional = transition.filter((item) => !item.persistentFocal && !isRequiredActor(item.admissionClass) && item.admissionClass !== "unrelated");
  const transitionSlots = Math.max(0, budget.maxTransitionParticipants - transitionAdmitted.length);
  const optionalFit = transitionOptional.length <= transitionSlots ? transitionOptional : [];
  const snapped = transitionOptional.length <= transitionSlots ? [] : transitionOptional;
  const transitionParticipantIds = uniqueSorted([...transitionAdmitted, ...optionalFit].map((item) => item.canonicalObjectId));
  const transitionSnappedIds = uniqueSorted(snapped.map((item) => item.canonicalObjectId));

  const admittedActorIds = uniqueSorted(admittedActors.map((item) => item.canonicalObjectId));
  const deferredActorIds = uniqueSorted(deferredActors.map((item) => item.canonicalObjectId));
  const omittedActorIds = uniqueSorted(actorDecision.omitted.map((item) => item.canonicalObjectId));
  const admittedRelationshipIds = uniqueSorted(admittedRels.map((item) => item.relationshipId));
  const deferredRelationshipIds = uniqueSorted(
    (forceSingle
      ? input.relationships.filter((item) => item.admissionClass !== "required-relationship" && item.admissionClass !== "required-primary" && item.admissionClass !== "unrelated")
      : relDecision.deferred
    ).map((item) => item.relationshipId),
  );
  const omittedRelationshipIds = uniqueSorted(relDecision.omitted.map((item) => item.relationshipId));
  const admittedEvidenceRefs = uniqueSorted(admittedEvidence.map((item) => item.evidenceRef));
  const deferredEvidenceRefs = uniqueSorted(deferredEvidence.map((item) => item.evidenceRef));
  const omittedEvidenceRefs = uniqueSorted(evidenceDecision.omitted.map((item) => item.evidenceRef));
  const admittedSupports = uniqueSorted(supportDecision.admitted.map((item) => item.family)) as readonly DthExpNexoRecipeFamily[];
  const deferredSupports = uniqueSorted(supportDecision.deferred.map((item) => item.family)) as readonly DthExpNexoRecipeFamily[];
  const omittedSupports = uniqueSorted(supportDecision.omitted.map((item) => item.family)) as readonly DthExpNexoRecipeFamily[];

  const budgetExceeded =
    admittedActorIds.length > budget.maxActiveActors ||
    admittedRelationshipIds.length > budget.maxActiveRelationships ||
    admittedEvidenceRefs.length > budget.maxActiveEvidencePresentations ||
    admittedSupports.length > budget.maxSupportingAnnotations ||
    transitionParticipantIds.length > budget.maxTransitionParticipants;

  const directionalRequired = input.relationships.filter(
    (item) => item.directional && (item.admissionClass === "required-relationship" || item.admissionClass === "required-primary"),
  );
  const preservesFlowDirection = directionalRequired.every((item) => admittedRelationshipIds.includes(item.relationshipId));

  const preservedFocalContext = uniqueSorted(
    input.actors.filter((item) => item.admissionClass === "required-subject" || item.admissionClass === "required-focal").map((item) => item.canonicalObjectId),
  );

  const uniqueDegradation = Object.freeze(
    DTH_EXP_THEATRE_SCALE_DEGRADATION_LADDER.filter((step) => degradation.includes(step) || (step.startsWith("preserve-") && requiredActorIds.size > 0)),
  );

  return Object.freeze({
    identity: dthExpTheatreScaleIdentity,
    version: dthExpTheatreScaleVersion,
    engine: DTH_EXP_THEATRE_SCALE_ENGINE,
    workingSetId: `dth-exp:9:${input.canonicalSubjectId}:${input.primaryFamily}:${lod}:${admittedActorIds.join(",")}`,
    canonicalSubjectId: input.canonicalSubjectId,
    primaryFamily: input.primaryFamily,
    managementNeed: input.managementNeed,
    lod,
    requestedLod: input.requestedLod ?? null,
    candidateActorCount: input.actors.length,
    admittedActorIds,
    deferredActorIds,
    omittedActorIds,
    candidateRelationshipCount: input.relationships.length,
    admittedRelationshipIds,
    deferredRelationshipIds,
    omittedRelationshipIds,
    candidateEvidenceCount: input.evidence.length,
    admittedEvidenceRefs,
    deferredEvidenceRefs,
    omittedEvidenceRefs,
    candidateSupportCount: input.supports.length,
    admittedSupports,
    deferredSupports,
    omittedSupports,
    groups: groupsFrom(admittedActors, deferredActors),
    evidenceClusters: clusters,
    density: densityOf(admittedActorIds.length, admittedRelationshipIds.length, admittedEvidenceRefs.length, admittedSupports.length),
    complexity: complexityOf(fallbackToMinimalPrimary, budgetExceeded, admittedActorIds.length, admittedRelationshipIds.length),
    budget,
    budgetExceeded,
    degradationActions: uniqueDegradation,
    fallbackToSinglePrimary: forceSingle,
    fallbackToMinimalPrimary,
    preservedFocalContext,
    transitionParticipantIds,
    transitionSnappedIds,
    latestValidTargetSupersedesObsolete: input.supersededByTargetId != null,
    disclosureIsPresentationOnly: true,
    densityImpliesImportance: false,
    evidenceCountCreatesConfidence: false,
    presentationAdmissionIsBusinessRanking: false,
    firstNAdmission: false,
    workingSetIsCanonicalStore: false,
    lodChangesPresentationOnly: true,
    preservesFlowDirection,
    upgradesCausality: false,
    assignsVaiRoles: false,
    calculatesRisk: false,
    ranksBubbleCandidates: false,
    parallelTimelineAuthority: false,
    inventsTimeAggregates: false,
    writesCanonicalObjects: false,
    writesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    declaresOutcomeSuccess: false,
    browserPerformanceCertified: false,
    runtimeBrowserPerformanceNotYetCertified: true,
    liveStageWiring: false,
    reducedMotionEquivalent: true,
    advisorReceivesBoundedScene: true,
  });
}
