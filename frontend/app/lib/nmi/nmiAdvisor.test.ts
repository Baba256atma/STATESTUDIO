/**
 * NPA-T NMI:7 — Advisor + Management Intelligence tests.
 * Does not start NMI:8. Does not create a second Advisor.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { freezeConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { realDataIntegrationFoundationIdentity } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { composeNpsProblemSolvingPath } from "@/app/lib/nexora-problem-solving/npsProblemSolvingPath.ts";
import { ECA_EXECUTIVE_COMMITMENT_IDENTITY } from "@/app/lib/nexora-conversation/ecaExecutiveCommitment.ts";
import { RMS_NEXORA_PARTICIPANT_CONTRACT } from "@/app/lib/rms/rmsActorContracts.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { NMI_AUTHORITY_BOUNDARY } from "./nmiAuthorityBoundary.ts";
import { type NmiCanonicalRef } from "./nmiContract.ts";
import { composeNmiUnifiedManagementModel } from "./nmiFoundation.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { composeNmiManagementMap } from "./nmiManagementMapCompose.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { NMI_STAGE_PROJECTION_CONTRACT } from "./nmiStageProjectionContract.ts";
import { verifyNmiStageProjection } from "./nmiStageProjectionFoundation.ts";
import { composeNmiStageProjection } from "./nmiStageProjectionCompose.ts";
import {
  applyNmiAdvisorToPresentedResponse,
  composeNmiAdvisorAnalysis,
  composeNmiAdvisorContext,
  detectNmiAdvisorIntent,
  rejectSealedRmsAdvisorFact,
} from "./nmiAdvisorCompose.ts";
import { NMI_ADVISOR_CONTRACT } from "./nmiAdvisorContract.ts";
import { verifyNmiAdvisorIntegration } from "./nmiAdvisorFoundation.ts";
import { nmiAdvisorIdentity } from "./nmiAdvisorIdentity.ts";
import {
  getRelatedManagementContext,
  identifyManagementGaps,
  locateSubjectInManagementMap,
  summarizeDecisionRoadmap,
} from "./nmiAdvisorQuery.ts";

function ref(id: string, kind: NmiCanonicalRef["kind"], authority: string): NmiCanonicalRef {
  return { id, kind, authority, sourceRef: `src:${id}` };
}

function rel(
  relationshipId: string,
  fromId: string,
  toId: string,
  kind: NmiManagementRelationship["kind"],
  epistemicStatus: NmiManagementRelationship["epistemicStatus"] = "DECLARED",
): NmiManagementRelationship {
  return {
    relationshipId,
    fromId,
    toId,
    kind,
    epistemicStatus,
    causal: false,
    convertsAssociationToCause: false,
    convertsAssumptionToFact: false,
    sourceAuthority: "canonical",
    sourceRef: relationshipId,
  };
}

function plant() {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi7-plant",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:plant", "BUSINESS_PROJECT", "BCA:1"),
    nodes: [
      ref("goal:otd", "GOAL", "MO:1"),
      ref("proc:production", "PROCESS", "BCA:4"),
      ref("kpi:otd", "KPI", "KPI"),
      ref("data:otd", "DATA_EVIDENCE", "P0:1"),
      ref("ctx-problem-capacity", "PROBLEM", "MO:1"),
      ref("ctx-problem-margin", "PROBLEM", "MO:1"),
      ref("vai:capacity", "VARIABLE", "VAI:1"),
      ref("ctx-scenario-capacity", "SCENARIO", "CC:9"),
      ref("ctx-decision-capacity", "DECISION", "CC:10"),
      ref("ctx-execution-capacity", "EXECUTION", "CC:11"),
    ],
    relationships: [
      rel("rel:kpi", "kpi:otd", "goal:otd", "measures"),
      rel("rel:ev", "kpi:otd", "data:otd", "evidenced_by", "UNKNOWN"),
      rel("rel:threat", "ctx-problem-capacity", "goal:otd", "threatens"),
      rel("rel:ops", "proc:production", "ctx-problem-capacity", "supports"),
      rel("rel:affects", "vai:capacity", "ctx-problem-capacity", "affects", "ASSOCIATION"),
      rel("rel:addr", "ctx-scenario-capacity", "ctx-problem-capacity", "addresses"),
      rel("rel:sel", "ctx-decision-capacity", "ctx-scenario-capacity", "selected_as"),
    ],
    unresolvedRelationshipIds: ["rel:ev"],
  });
  return composeNmiManagementMap({
    mapId: "map-nmi7",
    model,
    annotations: [
      { id: "ctx-problem-capacity", title: "Capacity Gap" },
      { id: "ctx-problem-margin", title: "Margin Pressure" },
      { id: "goal:otd", title: "OTD" },
      { id: "data:otd", knownStatus: "UNRESOLVED" },
    ],
  });
}

function bundle(overrides: Partial<Parameters<typeof composeNmiAdvisorContext>[0]["bundle"]> = {}) {
  const map = plant();
  return {
    map,
    queueEntries: [
      { category: "problem" as const, count: 2, objectIds: ["ctx-problem-capacity", "ctx-problem-margin"] },
    ],
    subjects: [
      { subjectId: "ctx-problem-capacity", title: "Capacity Gap", attention: "important" },
      { subjectId: "ctx-problem-margin", title: "Margin Pressure", attention: "critical" },
    ],
    staleAttentionId: "ctx-problem-capacity",
    staleMapSelectionId: "ctx-problem-capacity",
    staleRoadmapAnchorId: "ctx-problem-capacity",
    staleStageBranchId: "ctx-scenario-capacity",
    staleComparisonId: "cmp:old",
    ...overrides,
  };
}

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-profit-nca",
      subjectKind: "object",
      canonicalName: "Profit",
      aliases: Object.freeze(["Profit"]),
      businessKey: "obj-profit-nca",
    }),
  ]);
}

function talk(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
  resolvedRuntime = previous?.nextRuntimeState,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects(),
    runtimeState:
      resolvedRuntime ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog: catalog(),
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nmi7-${utterance}`,
    nmiAdvisorBundle: bundle(),
  });
}

test("NMI:7 verifies on NMI:1–6 without a second Advisor, NMI:8, or DTH-EXP", () => {
  assert.equal(verifyNmiStageProjection().ok, true);
  assert.equal(verifyNmiAdvisorIntegration().ok, true);
  assert.equal(NMI_STAGE_PROJECTION_CONTRACT.startsNmi7, false);
  assert.equal(NMI_ADVISOR_CONTRACT.startsNmi8, false);
  assert.equal(NMI_ADVISOR_CONTRACT.secondAdvisor, false);
  assert.equal(NMI_ADVISOR_CONTRACT.secondReferentResolver, false);
  assert.equal(NMI_ADVISOR_CONTRACT.conversationalAuthority, conversationalExperienceIdentity);
  assert.equal(nmiAdvisorIdentity, "NPA-T NMI:7/AdvisorManagementIntelligenceIntegration");
});

test("NMI context enters the existing Advisor path and preserves the selected canonical ID", () => {
  const overlay = applyNmiAdvisorToPresentedResponse({
    source: "Capacity Gap is the current subject.",
    utterance: "Where is this in my business?",
    resolvedCanonicalId: "ctx-problem-capacity",
    bundle: bundle(),
  });
  assert.equal(overlay.composition.apply, true);
  assert.equal(overlay.composition.secondAdvisor, false);
  assert.equal(overlay.composition.secondReferentResolver, false);
  assert.equal(overlay.composition.activeCanonicalId, "ctx-problem-capacity");
  assert.match(overlay.source, /Capacity Gap/);
  assert.match(overlay.source, /management map/);
  const located = locateSubjectInManagementMap(plant(), "ctx-problem-capacity");
  assert.equal(located.kind, "PROBLEM");
  assert.equal(detectNmiAdvisorIntent("What is related to it?"), "RELATED");
});

test("Map, relationship, causal, Attention, roadmap, and gap questions use NMI:2–5 semantics", () => {
  const map = plant();
  const related = getRelatedManagementContext(map, "ctx-problem-capacity");
  assert.equal(related.relatedIds.includes("goal:otd"), true);
  assert.equal(related.inventedRelationships, false);
  const causal = composeNmiAdvisorAnalysis({
    utterance: "Does Capacity cause the delivery problem?",
    resolvedCanonicalId: "ctx-problem-capacity",
    bundle: bundle(),
  });
  assert.equal(causal.intent, "CAUSAL");
  assert.doesNotMatch(causal.response ?? "", /\bis (?:the |a )?confirmed cause\b/i);
  assert.match(causal.response ?? "", /analytical influence/i);
  assert.equal(causal.causalUpgrade, false);
  const attention = composeNmiAdvisorAnalysis({
    utterance: "Why is this in Attention?",
    resolvedCanonicalId: "ctx-problem-margin",
    bundle: bundle(),
  });
  assert.equal(attention.intent, "ATTENTION");
  assert.match(attention.response ?? "", /Margin Pressure/);
  assert.doesNotMatch(attention.response ?? "", /highest-priority/);
  const roadmap = composeNmiAdvisorAnalysis({
    utterance: "Where are we with this problem?",
    resolvedCanonicalId: "ctx-problem-capacity",
    bundle: bundle(),
  });
  assert.equal(roadmap.intent, "ROADMAP");
  assert.match(roadmap.response ?? "", /descriptive, not a required action/);
  assert.equal(roadmap.requiredAction, false);
  const next = composeNmiAdvisorAnalysis({
    utterance: "What happens next?",
    resolvedCanonicalId: "ctx-problem-capacity",
    bundle: bundle(),
  });
  assert.equal(next.intent, "NEXT");
  assert.doesNotMatch(next.response ?? "", /you must/i);
  const gaps = composeNmiAdvisorAnalysis({
    utterance: "What is missing?",
    resolvedCanonicalId: "ctx-problem-capacity",
    bundle: bundle(),
  });
  assert.equal(gaps.intent, "GAPS");
  const notes = identifyManagementGaps(map, "ctx-problem-capacity");
  assert.ok(notes.some((note) => note.status === "NOT_REACHED" || note.status === "MISSING" || note.status === "UNRESOLVED"));
  assert.ok(notes.every((note) => note.status !== "NOT_REACHED" || !/\(MISSING\)/.test(note.label)));
  assert.match(gaps.response ?? "", /NOT_REACHED|UNRESOLVED|MISSING/);
  assert.doesNotMatch(gaps.response ?? "", /not reached \(MISSING\)/i);
  const summary = summarizeDecisionRoadmap(map, "ctx-problem-capacity");
  for (const [stage, status] of Object.entries(summary.stageStatuses)) {
    if (status === "NOT_REACHED") {
      assert.notEqual(status, "MISSING");
      assert.match(gaps.response ?? "", new RegExp(`${stage} \\(NOT_REACHED\\)`));
    }
  }
});

test("Stage, collection, Attention order, comparison, and stale roadmap cannot steal referent", () => {
  const projection = composeNmiStageProjection({
    projectionId: "proj:nmi7",
    selectedCanonicalId: "ctx-problem-capacity",
    source: "MANAGEMENT_MAP",
    map: plant(),
  });
  assert.equal(projection.collectionOwnsReferent, false);
  const context = composeNmiAdvisorContext({
    resolvedCanonicalId: "ctx-problem-margin",
    bundle: bundle({
      stageProjectionAnchorId: projection.projectionAnchorId,
      staleAttentionId: "ctx-problem-capacity",
      staleStageBranchId: "ctx-scenario-capacity",
      staleRoadmapAnchorId: "ctx-problem-capacity",
      staleComparisonId: "cmp:old",
    }),
  });
  assert.equal(context.activeCanonicalId, "ctx-problem-margin");
  assert.notEqual(context.activeCanonicalId, "ctx-problem-capacity");
  assert.notEqual(context.activeCanonicalId, "ctx-scenario-capacity");
  assert.equal(context.collectionOwnsReferent, false);
  const related = composeNmiAdvisorAnalysis({
    utterance: "What is related to it?",
    resolvedCanonicalId: "ctx-problem-margin",
    bundle: bundle(),
  });
  assert.equal(related.activeCanonicalId, "ctx-problem-margin");
  assert.match(related.response ?? "", /Margin Pressure/);
});

test("evidence provenance, unresolved evidence, and association remain un-upgraded", () => {
  const evidence = composeNmiAdvisorAnalysis({
    utterance: "What evidence supports this relationship?",
    resolvedCanonicalId: "ctx-problem-capacity",
    bundle: bundle(),
  });
  assert.equal(evidence.intent, "EVIDENCE");
  assert.match(evidence.response ?? "", /unresolved/i);
  const related = getRelatedManagementContext(plant(), "ctx-problem-capacity");
  const association = related.interpretations.find((item) => item.kind === "affects");
  assert.equal(association?.causal, false);
  assert.notEqual(association?.causalCommunication, "CONFIRMED_CAUSAL_RELATIONSHIP");
});

test("NMI does not write Decision, Execution, Outcome, Data Reality, or bypass Gate/RMS", () => {
  const composition = composeNmiAdvisorAnalysis({
    utterance: "Where is this in my business?",
    resolvedCanonicalId: "ctx-problem-capacity",
    bundle: bundle(),
  });
  assert.equal(composition.writesDecision, false);
  assert.equal(composition.writesExecution, false);
  assert.equal(composition.writesOutcome, false);
  assert.equal(composition.writesDataReality, false);
  assert.equal(composition.bypassesGate, false);
  assert.equal(NMI_ADVISOR_CONTRACT.writesLearning, false);
  assert.equal(NMI_GATE_BOUNDARY.nmiGate, false);
  assert.equal(NMI_GATE_BOUNDARY.gateApi, realDataIntegrationFoundationIdentity);
  const sealed = rejectSealedRmsAdvisorFact("rms:ground-truth:secret-cause");
  assert.equal(sealed.spoken, false);
  assert.doesNotMatch(composition.response ?? "", /secret-cause/);
  assert.equal(RMS_NEXORA_PARTICIPANT_CONTRACT.groundTruthAccess, "FORBIDDEN");
  assert.equal(NMI_AUTHORITY_BOUNDARY.advisor, "CC:5 / NXA / NCA / ECA presentation");
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
  const nps = composeNpsProblemSolvingPath({
    problem: {
      problemId: "ctx-problem-capacity",
      problemLabel: "Capacity Gap",
      confidence: "HIGH",
      observedFrom: "MO",
    },
    investigationPresent: false,
    evidenceState: "NONE",
    causeHypothesesAvailable: false,
    scenarioIds: Object.freeze([]),
    comparisonAvailable: false,
    recommendationReady: false,
    awaitingCommitment: false,
    approvedDecisionId: null,
    execution: { present: false, executionId: null, status: "NONE" },
    outcome: { observed: false, problemResolved: null },
    stageFocusId: "ctx-problem-capacity",
    conversationSubjectId: "ctx-problem-capacity",
  });
  assert.equal(nps.problemId, "ctx-problem-capacity");
  assert.equal(ECA_EXECUTIVE_COMMITMENT_IDENTITY, "NPA-T ECA:8/ExecutiveCommitmentDialoguePreDecisionChallenge");
});

test("Journeys A–G keep canonical subjects through the existing conversation path", () => {
  let turn = talk("What Capacity Gap?");
  turn = talk("Where is this in my business?", turn);
  assert.equal(turn.ncaTurn.reference.resolvedName, "Capacity Gap");
  assert.equal(turn.nmiAdvisorComposition?.activeCanonicalId, "ctx-problem-capacity");
  assert.match(turn.response, /Capacity Gap/);
  assert.match(turn.response, /management map/);
  turn = talk("What is related to it?", turn);
  assert.equal(turn.ncaTurn.reference.resolvedName, "Capacity Gap");
  assert.match(turn.response, /related to/i);
  assert.doesNotMatch(turn.response, /Margin Pressure is related/);
  turn = talk("Does Capacity cause the delivery problem?", turn);
  assert.doesNotMatch(turn.response, /is the confirmed cause/i);
  assert.match(turn.response, /analytical influence|association|not .*confirmed cause/i);
  turn = talk("Explain Capacity Gap.", turn);
  assert.equal(turn.ncaTurn.reference.resolvedName, "Capacity Gap");
  turn = talk("Where are we with this?", turn);
  assert.equal(turn.ncaTurn.reference.resolvedName, "Capacity Gap");
  assert.match(turn.response, /roadmap position|descriptive/i);
  turn = talk("What is missing?", turn);
  assert.equal(turn.ncaTurn.reference.resolvedName, "Capacity Gap");
  assert.match(turn.response, /MISSING|UNRESOLVED|NOT_REACHED/);
  let margin = talk("Explain Margin Pressure.");
  margin = talk("Why is this here?", margin);
  assert.equal(margin.ncaTurn.reference.resolvedName, "Margin Pressure");
  assert.match(margin.response, /Margin Pressure/);
  assert.doesNotMatch(margin.response, /Capacity Gap appears in Attention/);
  margin = talk("What is related to it?", margin);
  assert.equal(margin.ncaTurn.reference.resolvedName, "Margin Pressure");
  assert.notEqual(margin.nmiAdvisorComposition?.activeCanonicalId, "ctx-problem-capacity");
});
