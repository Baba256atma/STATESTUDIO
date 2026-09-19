/**
 * NPA-T DTH-EXP:9 — Theatre Scale & Performance tests.
 * Bounded working-set projection. No live /executive, DTH-EXP:10, or DTH-EXP:FINAL.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { nexoraMVPObjectInteractionIdentity } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  applyDthExpTheatreScale,
  composeDthExpMultiNexoScene,
  DTH_EXP_THEATRE_SCALE_BOUNDARY,
  DTH_EXP_THEATRE_SCALE_DEGRADATION_LADDER,
  DTH_EXP_THEATRE_SCALE_LODS,
  dthExpTheatreScaleIdentity,
  planDthExpMultiNexoComposition,
  projectDthExpAdvisorSceneAwareness,
  projectDthExpTheatreScene,
  verifyDthExpMultiNexoSceneBoundary,
  verifyDthExpTheatreScaleBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpDirectorManagementNeed } from "./dthExpDirectorNexoSelectionContract.ts";
import type {
  DthExpTheatreScaleActorCandidate,
  DthExpTheatreScaleEvidenceCandidate,
  DthExpTheatreScaleInput,
  DthExpTheatreScaleLod,
  DthExpTheatreScaleRelationshipCandidate,
  DthExpTheatreScaleSupportCandidate,
} from "./dthExpTheatreScaleContract.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";

const FLOW_ACTORS: readonly DthExpTheatreScaleActorCandidate[] = Object.freeze([
  Object.freeze({ canonicalObjectId: "obj-product-line-a", admissionClass: "required-subject" as const }),
  Object.freeze({ canonicalObjectId: "obj-production", admissionClass: "required-focal" as const }),
  Object.freeze({ canonicalObjectId: "obj-supplier-a", admissionClass: "required-primary" as const }),
  Object.freeze({ canonicalObjectId: "obj-inventory", admissionClass: "required-primary" as const }),
  Object.freeze({ canonicalObjectId: "obj-market", admissionClass: "required-primary" as const }),
  Object.freeze({ canonicalObjectId: "obj-staffing", admissionClass: "focused" as const }),
]);

const FLOW_RELS: readonly DthExpTheatreScaleRelationshipCandidate[] = Object.freeze([
  Object.freeze({ relationshipId: "rel-supplier-production", admissionClass: "required-relationship" as const, semanticRelation: "feeds", directional: true }),
  Object.freeze({ relationshipId: "rel-production-inventory", admissionClass: "required-relationship" as const, semanticRelation: "feeds", directional: true }),
  Object.freeze({ relationshipId: "rel-inventory-market", admissionClass: "required-relationship" as const, semanticRelation: "feeds", directional: true }),
  Object.freeze({ relationshipId: "rel-staffing-production", admissionClass: "focused" as const, semanticRelation: "associated", directional: false }),
]);

function unrelatedActors(count: number, prefix = "obj-unrelated"): readonly DthExpTheatreScaleActorCandidate[] {
  return Object.freeze(
    Array.from({ length: count }, (_, index) =>
      Object.freeze({
        canonicalObjectId: `${prefix}-${String(index).padStart(4, "0")}`,
        admissionClass: "unrelated" as const,
      }),
    ),
  );
}

function unrelatedRels(count: number): readonly DthExpTheatreScaleRelationshipCandidate[] {
  return Object.freeze(
    Array.from({ length: count }, (_, index) =>
      Object.freeze({
        relationshipId: `rel-unrelated-${String(index).padStart(4, "0")}`,
        admissionClass: "unrelated" as const,
        semanticRelation: "associated",
        directional: false,
      }),
    ),
  );
}

function unrelatedEvidence(count: number): readonly DthExpTheatreScaleEvidenceCandidate[] {
  return Object.freeze(
    Array.from({ length: count }, (_, index) =>
      Object.freeze({
        evidenceRef: `cc8:ev-unrelated-${String(index).padStart(4, "0")}`,
        admissionClass: "unrelated" as const,
        attachedToId: `obj-unrelated-${String(index).padStart(4, "0")}`,
      }),
    ),
  );
}

function contextualEvidence(count: number, attachedToId = "obj-production"): readonly DthExpTheatreScaleEvidenceCandidate[] {
  return Object.freeze(
    Array.from({ length: count }, (_, index) =>
      Object.freeze({
        evidenceRef: `cc8:ev-context-${String(index).padStart(3, "0")}`,
        admissionClass: "contextual" as const,
        attachedToId,
      }),
    ),
  );
}

function scale(partial: Partial<DthExpTheatreScaleInput> = {}) {
  return applyDthExpTheatreScale(
    Object.freeze({
      canonicalSubjectId: "obj-product-line-a",
      primaryFamily: "NEXO_FLOW",
      managementNeed: "OPERATIONAL_FLOW",
      canonicalWorldObjectCount: 1000,
      canonicalWorldRelationshipCount: 3000,
      canonicalWorldEvidenceCount: 5000,
      actors: Object.freeze([...FLOW_ACTORS, ...unrelatedActors(994)]),
      relationships: Object.freeze([...FLOW_RELS, ...unrelatedRels(2996)]),
      evidence: Object.freeze([
        Object.freeze({ evidenceRef: "cc8:ev-capacity-17", admissionClass: "essential-evidence" as const, attachedToId: "obj-production" }),
        ...unrelatedEvidence(4999),
      ]),
      supports: Object.freeze([
        Object.freeze({ family: "NEXO_RISK" as const, admissionClass: "focused" as const }),
        Object.freeze({ family: "NEXO_IMPACT" as const, admissionClass: "focused" as const }),
        Object.freeze({ family: "NEXO_TIME" as const, admissionClass: "contextual" as const }),
      ]),
      ...partial,
    }),
  );
}

test("DTH-EXP:9 identity and boundary", () => {
  assert.equal(dthExpTheatreScaleIdentity, "NPA-T DTH-EXP:9/TheatreScalePerformance");
  assert.equal(verifyDthExpTheatreScaleBoundary().ok, true);
  assert.equal(DTH_EXP_THEATRE_SCALE_BOUNDARY.startsDthExp10, false);
  assert.equal(DTH_EXP_THEATRE_SCALE_BOUNDARY.startsDthExpFinal, false);
});

test("1 — scale contract is read-only", () => {
  const working = scale();
  assert.equal(working.writesCanonicalObjects, false);
  assert.equal(Object.isFrozen(working), true);
});

test("2 — working set is not a canonical store", () => {
  assert.equal(scale().workingSetIsCanonicalStore, false);
  assert.equal(DTH_EXP_THEATRE_SCALE_BOUNDARY.workingSetIsCanonicalStore, false);
});

test("3 — large canonical world does not equal active Scene size", () => {
  const working = scale();
  assert.equal(working.candidateActorCount, 1000);
  assert.ok(working.admittedActorIds.length < working.candidateActorCount);
  assert.ok(working.admittedActorIds.length <= working.budget.maxActiveActors);
});

test("4 — canonical subject is protected", () => {
  assert.ok(scale().admittedActorIds.includes("obj-product-line-a"));
  assert.ok(scale().preservedFocalContext.includes("obj-product-line-a"));
});

test("5 — required primary actors are protected", () => {
  const admitted = scale().admittedActorIds;
  assert.ok(admitted.includes("obj-supplier-a"));
  assert.ok(admitted.includes("obj-production"));
  assert.ok(admitted.includes("obj-inventory"));
  assert.ok(admitted.includes("obj-market"));
});

test("6 — required primary relationships are protected", () => {
  const admitted = scale().admittedRelationshipIds;
  assert.ok(admitted.includes("rel-supplier-production"));
  assert.ok(admitted.includes("rel-production-inventory"));
  assert.ok(admitted.includes("rel-inventory-market"));
});

test("7 — essential Evidence is protected where legitimately required", () => {
  assert.ok(scale().admittedEvidenceRefs.includes("cc8:ev-capacity-17"));
});

test("8 — LOD-0 is minimal/essential", () => {
  const working = scale({ requestedLod: "lod-0" });
  assert.equal(working.lod, "lod-0");
  assert.equal(working.admittedActorIds.includes("obj-staffing"), false);
  assert.ok(working.admittedActorIds.includes("obj-production"));
});

test("9 — LOD-1 adds focused context", () => {
  const working = scale({ requestedLod: "lod-1" });
  assert.equal(working.lod, "lod-1");
  assert.ok(working.admittedActorIds.includes("obj-staffing"));
});

test("10 — LOD-2 adds contextual detail", () => {
  const contextual = Object.freeze({ canonicalObjectId: "obj-warehouse-context", admissionClass: "contextual" as const });
  const working = scale({ requestedLod: "lod-2", actors: Object.freeze([...FLOW_ACTORS, contextual, ...unrelatedActors(10)]) });
  assert.equal(working.lod, "lod-2");
  assert.ok(working.admittedActorIds.includes("obj-warehouse-context"));
});

test("11 — LOD-3 allows expanded context", () => {
  const expanded = Object.freeze({ canonicalObjectId: "obj-expanded-peer", admissionClass: "expanded" as const });
  const working = scale({ requestedLod: "lod-3", actors: Object.freeze([...FLOW_ACTORS, expanded, ...unrelatedActors(10)]) });
  assert.equal(working.lod, "lod-3");
  assert.ok(working.admittedActorIds.includes("obj-expanded-peer"));
});

test("12 — LOD changes presentation only", () => {
  const lod0 = scale({ requestedLod: "lod-0" });
  const lod3 = scale({ requestedLod: "lod-3" });
  assert.equal(lod0.lodChangesPresentationOnly, true);
  assert.equal(lod0.canonicalSubjectId, lod3.canonicalSubjectId);
  assert.ok(lod0.admittedActorIds.includes("obj-production"));
  assert.ok(lod3.admittedActorIds.includes("obj-production"));
});

test("13 — actor budget is explicit/configurable", () => {
  const working = scale({ budget: { maxActiveActors: 5 } });
  assert.equal(working.budget.maxActiveActors, 5);
  assert.ok(working.admittedActorIds.includes("obj-production"));
});

test("14 — actor budget does not use arbitrary first-N ordering", () => {
  const reversed = scale({ actors: Object.freeze([...unrelatedActors(20), ...[...FLOW_ACTORS].reverse()]) });
  const forward = scale({ actors: Object.freeze([...FLOW_ACTORS, ...unrelatedActors(20)]) });
  assert.deepEqual(reversed.admittedActorIds, forward.admittedActorIds);
  assert.equal(reversed.firstNAdmission, false);
});

test("15 — relationship budget is independent", () => {
  const working = scale({ budget: { maxActiveRelationships: 3, maxActiveActors: 24 } });
  assert.equal(working.admittedRelationshipIds.length, 3);
  assert.ok(working.admittedActorIds.length > working.admittedRelationshipIds.length);
});

test("16 — unrelated edges are not automatically projected", () => {
  assert.ok(scale().omittedRelationshipIds.includes("rel-unrelated-0000"));
  assert.equal(scale().admittedRelationshipIds.includes("rel-unrelated-0000"), false);
});

test("17 — Evidence budget bounds active Evidence", () => {
  const working = scale({
    requestedLod: "lod-2",
    evidence: Object.freeze([
      Object.freeze({ evidenceRef: "cc8:ev-capacity-17", admissionClass: "essential-evidence" as const, attachedToId: "obj-production" }),
      ...contextualEvidence(40),
    ]),
    budget: { maxActiveEvidencePresentations: 4 },
  });
  assert.ok(working.admittedEvidenceRefs.length <= 4);
  assert.ok(working.admittedEvidenceRefs.includes("cc8:ev-capacity-17"));
});

test("18 — Evidence clustering preserves refs", () => {
  const working = scale({
    requestedLod: "lod-2",
    evidence: Object.freeze([
      Object.freeze({ evidenceRef: "cc8:ev-capacity-17", admissionClass: "essential-evidence" as const, attachedToId: "obj-production" }),
      ...contextualEvidence(12),
    ]),
    budget: { maxActiveEvidencePresentations: 1 },
  });
  const refs = working.evidenceClusters.flatMap((item) => item.evidenceRefs);
  assert.ok(refs.includes("cc8:ev-context-000"));
});

test("19 — Evidence count does not create confidence", () => {
  assert.equal(scale().evidenceCountCreatesConfidence, false);
});

test("20 — Multi-Nexo support degrades before primary meaning", () => {
  const working = scale({ budget: { maxSupportingAnnotations: 0 } });
  assert.ok(working.admittedActorIds.includes("obj-production"));
  assert.equal(working.admittedSupports.length, 0);
});

test("21 — supporting-Nexo degradation is not business ranking", () => {
  assert.equal(scale().presentationAdmissionIsBusinessRanking, false);
});

test("22 — large Bubble collection remains bounded", () => {
  const projects = Object.freeze([
    Object.freeze({ canonicalObjectId: "obj-project-gamma", admissionClass: "required-subject" as const }),
    Object.freeze({ canonicalObjectId: "obj-project-alpha", admissionClass: "focused-comparison" as const, comparisonMember: true }),
    ...unrelatedActors(500, "obj-project"),
  ]);
  const working = scale({
    canonicalSubjectId: "obj-project-gamma",
    primaryFamily: "NEXO_BUBBLE",
    managementNeed: "PORTFOLIO_COMPARISON",
    actors: projects,
  });
  assert.ok(working.admittedActorIds.length < 500);
  assert.ok(working.admittedActorIds.includes("obj-project-gamma"));
});

test("23 — Bubble scale does not invent top-N ranking", () => {
  assert.equal(scale({ primaryFamily: "NEXO_BUBBLE", managementNeed: "PORTFOLIO_COMPARISON" }).ranksBubbleCandidates, false);
});

test("24 — large Flow keeps focal segment", () => {
  const distant = Array.from({ length: 80 }, (_, index) =>
    Object.freeze({ canonicalObjectId: `obj-flow-distant-${index}`, admissionClass: "expanded" as const }),
  );
  const working = scale({ requestedLod: "lod-1", actors: Object.freeze([...FLOW_ACTORS, ...distant]) });
  assert.ok(working.admittedActorIds.includes("obj-production"));
  assert.equal(working.admittedActorIds.includes("obj-flow-distant-0"), false);
});

test("25 — Flow direction semantics survive", () => {
  assert.equal(scale().preservesFlowDirection, true);
});

test("26 — large Cause graph remains bounded", () => {
  const associated = Array.from({ length: 200 }, (_, index) =>
    Object.freeze({ canonicalObjectId: `obj-assoc-${index}`, admissionClass: "expanded" as const }),
  );
  const working = scale({
    primaryFamily: "NEXO_CAUSE",
    managementNeed: "CAUSE_INVESTIGATION",
    requestedLod: "lod-1",
    actors: Object.freeze([...FLOW_ACTORS, ...associated]),
  });
  assert.ok(working.admittedActorIds.length < 50);
});

test("27 — Cause scale does not upgrade causality", () => {
  assert.equal(scale({ primaryFamily: "NEXO_CAUSE", managementNeed: "CAUSE_INVESTIGATION" }).upgradesCausality, false);
});

test("28 — large Impact graph preserves VAI authority", () => {
  assert.equal(scale({ primaryFamily: "NEXO_IMPACT", managementNeed: "VARIABLE_LEVER" }).assignsVaiRoles, false);
});

test("29 — large Risk context does not create Risk ranking", () => {
  assert.equal(scale({ primaryFamily: "NEXO_RISK", managementNeed: "RISK_FOCUS" }).calculatesRisk, false);
});

test("30 — large Time context creates no Timeline authority", () => {
  assert.equal(scale({ primaryFamily: "NEXO_TIME", managementNeed: "TEMPORAL_DEVELOPMENT" }).parallelTimelineAuthority, false);
});

test("31 — Time scale does not invent aggregates", () => {
  assert.equal(scale({ primaryFamily: "NEXO_TIME", managementNeed: "TEMPORAL_DEVELOPMENT" }).inventsTimeAggregates, false);
});

test("32 — Execution scale preserves CC:11", () => {
  assert.equal(scale({ primaryFamily: "NEXO_EXECUTION", managementNeed: "EXECUTION_STATUS" }).writesExecution, false);
});

test("33 — Outcome scale preserves CORE-OUT", () => {
  const working = scale({ primaryFamily: "NEXO_OUTCOME", managementNeed: "OUTCOME_ASSESSMENT" });
  assert.equal(working.writesOutcome, false);
  assert.equal(working.declaresOutcomeSuccess, false);
});

test("34 — presentation grouping preserves member IDs", () => {
  const suppliers = Array.from({ length: 6 }, (_, index) =>
    Object.freeze({ canonicalObjectId: `obj-supplier-ctx-${index}`, admissionClass: "contextual" as const, groupingKey: "suppliers" }),
  );
  const working = scale({ requestedLod: "lod-2", actors: Object.freeze([...FLOW_ACTORS, ...suppliers]) });
  const group = working.groups.find((item) => item.groupingKey === "suppliers");
  assert.ok(group);
  assert.equal(group?.inventsCanonicalGroupObject, false);
  assert.ok(group?.memberCanonicalObjectIds.includes("obj-supplier-ctx-0"));
});

test("35 — focal comparison members are not incorrectly grouped", () => {
  const members = Object.freeze([
    Object.freeze({ canonicalObjectId: "obj-supplier-a", admissionClass: "focused-comparison" as const, groupingKey: "suppliers", comparisonMember: true }),
    Object.freeze({ canonicalObjectId: "obj-supplier-b", admissionClass: "focused-comparison" as const, groupingKey: "suppliers", comparisonMember: true }),
    ...Array.from({ length: 6 }, (_, index) =>
      Object.freeze({ canonicalObjectId: `obj-supplier-ctx-${index}`, admissionClass: "contextual" as const, groupingKey: "suppliers" }),
    ),
  ]);
  const working = scale({
    requestedLod: "lod-2",
    canonicalSubjectId: "obj-supplier-a",
    actors: Object.freeze([
      Object.freeze({ canonicalObjectId: "obj-product-line-a", admissionClass: "required-primary" as const }),
      ...members,
    ]),
  });
  const group = working.groups.find((item) => item.groupingKey === "suppliers");
  assert.equal(group?.memberCanonicalObjectIds.includes("obj-supplier-a"), false);
  assert.equal(group?.memberCanonicalObjectIds.includes("obj-supplier-b"), false);
  assert.ok(working.admittedActorIds.includes("obj-supplier-a"));
});

test("36 — progressive disclosure is presentation-only", () => {
  assert.equal(scale().disclosureIsPresentationOnly, true);
});

test("37 — density does not imply business importance", () => {
  assert.equal(scale().densityImpliesImportance, false);
});

test("38 — complexity classification is deterministic", () => {
  assert.deepEqual(scale(), scale());
});

test("39 — performance budgets are metadata, not browser claims", () => {
  assert.equal(scale().browserPerformanceCertified, false);
  assert.equal(scale().runtimeBrowserPerformanceNotYetCertified, true);
});

test("40 — transition participants are bounded", () => {
  const transition = Array.from({ length: 40 }, (_, index) =>
    Object.freeze({
      canonicalObjectId: `obj-transition-${index}`,
      admissionClass: "contextual" as const,
      persistentFocal: false,
    }),
  );
  const working = scale({
    transitionCandidates: Object.freeze([
      Object.freeze({ canonicalObjectId: "obj-production", admissionClass: "required-focal" as const, persistentFocal: true }),
      ...transition,
    ]),
    budget: { maxTransitionParticipants: 6 },
  });
  assert.ok(working.transitionParticipantIds.length <= 6);
  assert.ok(working.transitionSnappedIds.length > 0);
});

test("41 — focal actors are protected in transition budget", () => {
  const working = scale({
    transitionCandidates: Object.freeze([
      Object.freeze({ canonicalObjectId: "obj-production", admissionClass: "required-focal" as const, persistentFocal: true }),
      ...Array.from({ length: 20 }, (_, index) =>
        Object.freeze({ canonicalObjectId: `obj-transition-${index}`, admissionClass: "contextual" as const, persistentFocal: false }),
      ),
    ]),
    budget: { maxTransitionParticipants: 4 },
  });
  assert.ok(working.transitionParticipantIds.includes("obj-production"));
});

test("42 — reduced-motion retains same management meaning", () => {
  const motion = scale({ reducedMotion: false });
  const reduced = scale({ reducedMotion: true });
  assert.deepEqual(motion.admittedActorIds, reduced.admittedActorIds);
  assert.deepEqual(motion.admittedEvidenceRefs, reduced.admittedEvidenceRefs);
  assert.equal(reduced.reducedMotionEquivalent, true);
});

test("43 — obsolete transition target can be superseded", () => {
  assert.equal(scale({ supersededByTargetId: "dth-exp:9:next" }).latestValidTargetSupersedesObsolete, true);
});

test("44 — admission is deterministic", () => {
  assert.deepEqual(scale(), scale());
});

test("45 — no array-order/first-N fallback", () => {
  const a = [...FLOW_ACTORS];
  const b = [...FLOW_ACTORS].sort((left, right) => right.canonicalObjectId.localeCompare(left.canonicalObjectId));
  assert.deepEqual(scale({ actors: Object.freeze(a) }).admittedActorIds, scale({ actors: Object.freeze(b) }).admittedActorIds);
});

test("46 — presentation admission does not create business ranking", () => {
  assert.equal(scale().presentationAdmissionIsBusinessRanking, false);
});

test("47 — subject switch recomputes working set", () => {
  const lineA = scale();
  const margin = scale({
    canonicalSubjectId: "obj-margin-pressure",
    actors: Object.freeze([
      Object.freeze({ canonicalObjectId: "obj-margin-pressure", admissionClass: "required-subject" as const }),
      Object.freeze({ canonicalObjectId: "obj-cost", admissionClass: "required-focal" as const }),
      ...unrelatedActors(20),
    ]),
  });
  assert.equal(lineA.admittedActorIds.includes("obj-margin-pressure"), false);
  assert.ok(margin.admittedActorIds.includes("obj-margin-pressure"));
  assert.equal(margin.admittedActorIds.includes("obj-production"), false);
});

test("48 — perspective change recomputes working set", () => {
  const flow = scale({ requestedLod: "lod-1" });
  const cause = scale({ primaryFamily: "NEXO_CAUSE", managementNeed: "CAUSE_INVESTIGATION", requestedLod: "lod-1" });
  assert.equal(flow.primaryFamily, "NEXO_FLOW");
  assert.equal(cause.primaryFamily, "NEXO_CAUSE");
  assert.notEqual(cause.workingSetId, flow.workingSetId);
});

test("49 — same-family refinement recomputes relevant context", () => {
  const general = scale({
    requestedLod: "lod-2",
    actors: Object.freeze([...FLOW_ACTORS, Object.freeze({ canonicalObjectId: "obj-distant-market-peer", admissionClass: "contextual" as const })]),
  });
  const bottleneck = scale({
    managementNeed: "BOTTLENECK_LOCATION",
    requestedLod: "lod-1",
    actors: Object.freeze([
      Object.freeze({ canonicalObjectId: "obj-product-line-a", admissionClass: "required-subject" as const }),
      Object.freeze({ canonicalObjectId: "obj-production", admissionClass: "required-focal" as const }),
      Object.freeze({ canonicalObjectId: "obj-inventory", admissionClass: "required-primary" as const }),
    ]),
  });
  assert.ok(general.admittedActorIds.includes("obj-distant-market-peer"));
  assert.equal(bottleneck.admittedActorIds.includes("obj-distant-market-peer"), false);
  assert.ok(bottleneck.admittedActorIds.includes("obj-production"));
});

test("50 — Multi-Nexo recomposition reevaluates scale budget", () => {
  const three: readonly DthExpTheatreScaleSupportCandidate[] = Object.freeze([
    Object.freeze({ family: "NEXO_RISK" as const, admissionClass: "focused" as const }),
    Object.freeze({ family: "NEXO_IMPACT" as const, admissionClass: "focused" as const }),
    Object.freeze({ family: "NEXO_TIME" as const, admissionClass: "contextual" as const }),
  ]);
  const wide = scale({ requestedLod: "lod-1", supports: three, budget: { maxSupportingAnnotations: 2 } });
  const tight = scale({ requestedLod: "lod-1", supports: three, budget: { maxSupportingAnnotations: 0 } });
  assert.equal(wide.admittedSupports.length, 2);
  assert.equal(tight.admittedSupports.length, 0);
});

test("51 — safe degradation follows deterministic priority", () => {
  const working = scale({
    requestedLod: "lod-3",
    fallbackToSinglePrimary: true,
    actors: Object.freeze([...FLOW_ACTORS, Object.freeze({ canonicalObjectId: "obj-extra", admissionClass: "expanded" as const })]),
  });
  const indexes = working.degradationActions.map((item) => DTH_EXP_THEATRE_SCALE_DEGRADATION_LADDER.indexOf(item as (typeof DTH_EXP_THEATRE_SCALE_DEGRADATION_LADDER)[number]));
  assert.ok(indexes.every((value) => value >= 0));
  assert.deepEqual(indexes, [...indexes].sort((left, right) => left - right));
});

test("52 — unsafe Multi-Nexo falls back to single-primary", () => {
  const working = scale({ fallbackToSinglePrimary: true });
  assert.equal(working.fallbackToSinglePrimary, true);
  assert.equal(working.admittedSupports.length, 0);
  assert.ok(working.admittedActorIds.includes("obj-production"));
});

test("53 — oversized primary can fall back to lower LOD", () => {
  const required = Array.from({ length: 8 }, (_, index) =>
    Object.freeze({ canonicalObjectId: `obj-required-${index}`, admissionClass: "required-primary" as const }),
  );
  const expanded = Array.from({ length: 20 }, (_, index) =>
    Object.freeze({ canonicalObjectId: `obj-expanded-${index}`, admissionClass: "expanded" as const }),
  );
  const working = scale({
    requestedLod: "lod-3",
    budget: { maxActiveActors: 10 },
    actors: Object.freeze([
      Object.freeze({ canonicalObjectId: "obj-product-line-a", admissionClass: "required-subject" as const }),
      Object.freeze({ canonicalObjectId: "obj-production", admissionClass: "required-focal" as const }),
      ...required,
      ...expanded,
    ]),
  });
  assert.ok(working.lod === "lod-0" || working.fallbackToMinimalPrimary || working.degradationActions.includes("lower-lod"));
  assert.equal(working.admittedActorIds.includes("obj-expanded-0"), false);
});

test("54 — observability reports admitted/deferred/omitted counts", () => {
  const working = scale();
  assert.equal(working.candidateActorCount, working.admittedActorIds.length + working.deferredActorIds.length + working.omittedActorIds.length);
  assert.ok(working.omittedActorIds.length > 0);
});

test("55 — no unmeasured browser-performance claims", () => {
  assert.equal(scale().browserPerformanceCertified, false);
  assert.equal(DTH_EXP_THEATRE_SCALE_BOUNDARY.browserPerformanceCertified, false);
});

test("56 — large synthetic world remains bounded", () => {
  const working = scale();
  assert.equal(working.candidateActorCount, 1000);
  assert.equal(working.candidateRelationshipCount, 3000);
  assert.equal(working.candidateEvidenceCount, 5000);
  assert.ok(working.admittedActorIds.length <= working.budget.maxActiveActors);
  assert.ok(working.admittedRelationshipIds.length <= working.budget.maxActiveRelationships);
});

test("57 — thousands of unrelated Objects do not change focal semantic set", () => {
  const small = scale({
    actors: Object.freeze([...FLOW_ACTORS, ...unrelatedActors(10)]),
    relationships: FLOW_RELS,
    evidence: Object.freeze([
      Object.freeze({ evidenceRef: "cc8:ev-capacity-17", admissionClass: "essential-evidence" as const, attachedToId: "obj-production" }),
    ]),
  });
  const large = scale();
  const focal = (ids: readonly string[]) =>
    ids.filter((id) => FLOW_ACTORS.some((actor) => actor.canonicalObjectId === id && actor.admissionClass !== "focused"));
  assert.deepEqual(focal(small.admittedActorIds), focal(large.admittedActorIds));
});

test("58 — no canonical management writes", () => {
  const working = scale();
  assert.equal(working.writesCanonicalObjects, false);
  assert.equal(working.writesDecision, false);
  assert.equal(working.writesExecution, false);
  assert.equal(working.writesOutcome, false);
});

test("59 — Stage remains NEX-MVP:3/4", () => {
  assert.equal(DTH_EXP_THEATRE_SCALE_BOUNDARY.stage, "NEX-MVP:3 / NEX-MVP:4");
  assert.equal(nexoraMVPObjectInteractionIdentity, "NEX-MVP:4/NexoraObjectInteraction");
});

test("60 — Advisor/referent authorities remain unchanged", () => {
  assert.equal(DTH_EXP_THEATRE_SCALE_BOUNDARY.advisor, conversationalExperienceIdentity);
  assert.equal(DTH_EXP_THEATRE_SCALE_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
  const awareness = projectDthExpAdvisorSceneAwareness({
    conversation: Object.freeze({
      authority: "CC:5 / ECA / NCA / MO referent",
      canonicalSubjectId: "obj-product-line-a",
      subjectSource: "conversation-named",
      selectedCanonicalObjectId: null,
      selectedRelationshipId: null,
      selectedEvidenceRef: null,
      collectionMemberId: null,
      generation: 1,
    }),
  });
  assert.equal(awareness.grounding.canonicalObjectId, "obj-product-line-a");
  assert.equal(scale().advisorReceivesBoundedScene, true);
});

test("61 — no live /executive wiring", () => {
  assert.equal(scale().liveStageWiring, false);
  assert.equal(DTH_EXP_THEATRE_SCALE_BOUNDARY.liveStageWiring, false);
});

test("62 — DTH-EXP:1–8B remain green", () => {
  assert.equal(verifyDthExpMultiNexoSceneBoundary().ok, true);
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const scene = projectDthExpTheatreScene({
    theatre: projectNexoraDecisionTheatreFoundation({
      stageState: selectNexoraMVPInteractionSubject(
        createInitialNexoraMVPObjectInteractionState({
          workspace: "overview",
          presentationState: "minimum",
          environmentIntent: "neutral",
        }),
        "obj-revenue",
        catalog,
      ),
      catalog,
    }),
    visualRolesByCanonicalObjectId: { "obj-revenue": "flow-node" },
  });
  assert.equal(scene.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.visualRole, "flow-node");
  const plan = planDthExpMultiNexoComposition(
    Object.freeze({
      canonicalSubjectId: "obj-product-line-a",
      primaryFamily: "NEXO_FLOW",
      primarySelectionAuthority: "DTH-EXP:4A",
      managementNeed: "OPERATIONAL_FLOW",
      primaryReason: "director-management-need:OPERATIONAL_FLOW",
      primaryActorIds: Object.freeze(["obj-production"]),
      relationshipRefs: Object.freeze([]),
      evidenceRefs: Object.freeze(["cc8:ev-capacity-17"]),
      availableSupports: Object.freeze([]),
    }),
  );
  assert.equal(plan.primaryFamily, "NEXO_FLOW");
  assert.equal(typeof composeDthExpMultiNexoScene, "function");
});

test("certification journey: large world stays bounded", () => {
  const flow = scale({ requestedLod: "lod-1" });
  assert.ok(flow.candidateActorCount >= 1000);
  assert.ok(flow.admittedActorIds.includes("obj-production"));
  assert.ok(flow.omittedActorIds.length > 900);
  for (const lod of DTH_EXP_THEATRE_SCALE_LODS) {
    const working = scale({ requestedLod: lod as DthExpTheatreScaleLod });
    assert.ok(working.admittedActorIds.includes("obj-product-line-a"));
    assert.equal(working.lodChangesPresentationOnly, true);
  }
  const evidence = scale({
    requestedLod: "lod-2",
    evidence: Object.freeze([
      Object.freeze({ evidenceRef: "cc8:ev-capacity-17", admissionClass: "essential-evidence" as const, attachedToId: "obj-production" }),
      ...contextualEvidence(80),
    ]),
    budget: { maxActiveEvidencePresentations: 4 },
  });
  assert.ok(evidence.admittedEvidenceRefs.includes("cc8:ev-capacity-17"));
  assert.ok(evidence.admittedEvidenceRefs.length <= 4);
  assert.equal(evidence.evidenceCountCreatesConfidence, false);
  const supports = scale({ requestedLod: "lod-1", budget: { maxSupportingAnnotations: 2 } });
  assert.ok(supports.admittedSupports.includes("NEXO_RISK"));
  assert.ok(supports.admittedSupports.includes("NEXO_IMPACT"));
  assert.equal(supports.admittedSupports.includes("NEXO_TIME"), false);
  const cause = scale({ primaryFamily: "NEXO_CAUSE", managementNeed: "CAUSE_INVESTIGATION" as DthExpDirectorManagementNeed, requestedLod: "lod-1" });
  assert.equal(cause.upgradesCausality, false);
  const switched = scale({
    canonicalSubjectId: "obj-margin-pressure",
    actors: Object.freeze([Object.freeze({ canonicalObjectId: "obj-margin-pressure", admissionClass: "required-subject" as const })]),
  });
  assert.equal(switched.admittedActorIds.includes("obj-production"), false);
  const invariant = scale();
  assert.deepEqual(
    invariant.admittedActorIds.filter((id) => id === "obj-production" || id === "obj-product-line-a"),
    ["obj-product-line-a", "obj-production"],
  );
  const overload = scale({ fallbackToSinglePrimary: true, requestedLod: "lod-3" });
  assert.equal(overload.fallbackToSinglePrimary, true);
  const reduced = scale({ fallbackToSinglePrimary: true, reducedMotion: true });
  assert.deepEqual(reduced.admittedActorIds, overload.admittedActorIds);
});
