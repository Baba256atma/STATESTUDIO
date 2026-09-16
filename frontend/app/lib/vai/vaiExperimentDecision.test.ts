/**
 * NPA-A VAI:8 — Experiment-to-Decision Integration tests A–AB.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { compareNexoraExecutiveScenarios } from "@/app/lib/conversational-control/executiveScenarioComparison.ts";
import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { CanonicalManagerMeaning } from "@/app/lib/manager-object/canonicalManagerMeaning.ts";
import { composeEcaWorkingConversationContext } from "@/app/lib/nexora-conversation/ecaWorkingConversationContext.ts";
import { planEcaExecutiveConversationAction } from "@/app/lib/nexora-conversation/ecaExecutiveIntentActionPlan.ts";
import { judgeEcaExecutiveCommitment } from "@/app/lib/nexora-conversation/ecaExecutiveCommitment.ts";
import { NPS_OPTION_GENERATION_BOUNDARY } from "@/app/lib/nexora-problem-solving/npsOptionGeneration.ts";
import { composeVaiImpactScene, verifyVaiImpactScene } from "./vaiImpactComposer.ts";
import { verifyVaiAdvisorAnalysis } from "./vaiAdvisorComposer.ts";
import type { VaiAdvisorBundle } from "./vaiAdvisorContract.ts";
import { resolveVaiCausalSafety } from "./vaiCausalResolver.ts";
import { resolveVaiObjectVariableRoles, verifyVaiObjectRoleResolution } from "./vaiObjectRoleResolver.ts";
import { resolveVaiVariables, type VaiTrustedObservationSource } from "./vaiResolver.ts";
import { verifyVaiFoundation } from "./vaiFoundation.ts";
import { verifyVaiCausalSafety } from "./vaiCausalResolver.ts";
import { verifyVaiTheatreSymbolLanguage } from "./vaiTheatreProjector.ts";
import { verifyVaiWhatIfAnalysis } from "./vaiWhatIfResolver.ts";
import { createVaiWhatIfExperiment } from "./vaiWhatIfResolver.ts";
import { projectVaiWhatIfTheatre } from "./vaiWhatIfTheatre.ts";
import type { VaiVariable } from "./vaiContract.ts";
import type { VaiRelationshipEvidenceRef } from "./vaiCausalContract.ts";
import { VAI_8_BOUNDARY } from "./vaiExperimentDecisionContract.ts";
import { formatVai8Diagnostics } from "./vaiExperimentDecisionDiagnostics.ts";
import {
  isExplicitVai8PromotionIntent,
  resolveVaiExperimentScenarioHandoff,
  vai8UncertaintyNotes,
  verifyVaiExperimentDecisionIntegration,
} from "./vaiExperimentDecisionResolver.ts";
import type { VaiTrustedQuantitativeModel } from "./vaiWhatIfContract.ts";

const CAPACITY = "ctx-problem-capacity";
const SURGE = "ctx-scenario-demand";
const LEAK = /\b(?:VAI:[1-9]|CC:\d+|CORE-INT:3|canonical writer|proposal contract|resolver|authority)\b/i;

function trusted(id: string, name: string, extras: Partial<VaiTrustedObservationSource> = {}): VaiTrustedObservationSource {
  return {
    kind: "TRUSTED_OBSERVATION",
    variableId: id,
    displayName: name,
    sourceKind: "OBJECT_ATTRIBUTE",
    authority: "MO:1",
    sourceRef: `attr:${id}`,
    semanticStatus: "CONFIRMED",
    semanticMeaning: name,
    relatedObjectIds: [CAPACITY],
    ...extras,
  };
}

function vai1(source: VaiTrustedObservationSource, role: VaiVariable["role"] = "CONTROL"): VaiVariable {
  return resolveVaiVariables({
    analysisContext: { analysisContextId: "vai1" },
    applications: [{ source, role }],
  }).variables[0]!;
}

function ev(id: string): VaiRelationshipEvidenceRef {
  return { evidenceRef: id, kind: "ASSOCIATION", polarity: "SUPPORTING", authority: "CC:8" };
}

function bundleOf(): { readonly variables: VaiVariable[]; readonly bundle: VaiAdvisorBundle } {
  const staffing = vai1(trusted("vai:staffing", "Staffing", { value: 100, unit: "people" }), "LEVER");
  const otd = vai1(trusted("vai:otd", "OTD", { sourceKind: "KPI_OBSERVATION", value: 91, unit: "%" }), "OUTCOME");
  const season = vai1(trusted("vai:seasonality", "Seasonality", { value: 1 }), "CONFOUNDER");
  const variables = [staffing, otd, season];
  const roleResult = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-capacity-vars",
      purpose: "WHAT_CAN_MANAGEMENT_CHANGE",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: variables.map((item) => item.variableId),
    },
    variables,
    roleEvidence: [
      { variableId: "vai:staffing", role: "LEVER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "staff" },
      { variableId: "vai:otd", role: "OUTCOME", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "otd" },
      { variableId: "vai:seasonality", role: "CONFOUNDER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "season" },
    ],
  });
  const relationship = resolveVaiCausalSafety({
    relationshipId: "rel-staff-otd",
    analysisContextId: "ctx-capacity-vars",
    source: staffing,
    target: { kind: "VARIABLE", id: "vai:otd", variable: otd },
    evidence: [ev("a1"), ev("a2")],
    scope: { objectScope: CAPACITY },
    vai2: { confounders: roleResult.items.filter((item) => item.primaryRole === "CONFOUNDER") },
  }).relationship;
  return {
    variables,
    bundle: {
      analysisContextId: "ctx-capacity-vars",
      focalObject: { id: CAPACITY, label: "Capacity Gap" },
      variables,
      roleResult,
      relationship,
    },
  };
}

function model(): VaiTrustedQuantitativeModel {
  return {
    modelId: "model-staffing-otd",
    sourceVariableId: "vai:staffing",
    targetVariableId: "vai:otd",
    formula: "LINEAR_DELTA",
    coefficient: 0.2,
    sourceUnit: "people",
    targetUnit: "%",
    scope: { businessContext: "Plant A" },
    uncertaintyLow: 93,
    uncertaintyHigh: 95,
    provenance: "accepted staffing-to-OTD model",
    sourceRef: "model:staff-otd",
  };
}

function experiment(models?: readonly VaiTrustedQuantitativeModel[]) {
  const { bundle, variables } = bundleOf();
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-staff-10",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
    models,
    requestedScope: models ? { businessContext: "Plant A" } : undefined,
  });
  return { bundle, variables, experiment: created.experiment!, session: created.session };
}

function promote(exp = experiment().experiment) {
  return resolveVaiExperimentScenarioHandoff({
    utterance: "Make this a scenario.",
    experiment: exp,
  });
}

test("VAI:8 reuses VAI:1–7 and CC:9 without a parallel authority", () => {
  assert.equal(verifyVaiFoundation().ok, true);
  assert.equal(verifyVaiObjectRoleResolution().ok, true);
  assert.equal(verifyVaiCausalSafety().ok, true);
  assert.equal(verifyVaiAdvisorAnalysis().ok, true);
  assert.equal(verifyVaiTheatreSymbolLanguage().ok, true);
  assert.equal(verifyVaiImpactScene().ok, true);
  assert.equal(verifyVaiWhatIfAnalysis().ok, true);
  assert.equal(verifyVaiExperimentDecisionIntegration().ok, true);
  assert.equal(VAI_8_BOUNDARY.secondScenarioAuthority, false);
  assert.equal(VAI_8_BOUNDARY.startsVai9, false);
});

test("A — Explicit promotion prepares a Scenario proposal", () => {
  const result = promote();
  assert.equal(result.apply, true);
  assert.equal(result.proposal?.isScenarioObject, false);
  assert.equal(result.proposal?.writesScenario, false);
  assert.equal(result.session.confirmationState, "PENDING_CONFIRMATION");
  assert.equal(result.canonicalWriter, null);
  assert.match(result.response ?? "", /still a what-if experiment/);
  assert.match(result.response ?? "", /Create a scenario using Staffing \+10%/);
});

test("B — Lever change does not create a Scenario", () => {
  const { experiment: exp } = experiment();
  const result = resolveVaiExperimentScenarioHandoff({
    utterance: "What if staffing increases 10%?",
    experiment: exp,
  });
  assert.equal(isExplicitVai8PromotionIntent("What if staffing increases 10%?"), false);
  assert.equal(result.session.confirmationState, "NONE");
  assert.equal(result.provenance.canonicalScenarioId, null);
});

test("C — Click/inspect does not create a Scenario", () => {
  const { experiment: exp } = experiment();
  const result = resolveVaiExperimentScenarioHandoff({
    utterance: "Inspect this experiment.",
    experiment: exp,
    inspectOnly: true,
  });
  assert.equal(result.provenance.canonicalScenarioId, null);
  assert.equal(result.session.confirmationState, "NONE");
});

test("D — Confirmation is required before write", () => {
  const pending = promote();
  assert.equal(pending.session.canonicalScenarioId, null);
  assert.equal(pending.scenarioSession, null);
});

test("E — Canonical writer is CC:9 after confirmation", () => {
  const pending = promote();
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: experiment().experiment,
    session: pending.session,
  });
  assert.equal(confirmed.canonicalWriter, "CC:9");
  assert.ok(confirmed.provenance.canonicalScenarioId?.startsWith("cc9:scenario:"));
  assert.ok(confirmed.scenarioSession?.scenariosById[confirmed.provenance.canonicalScenarioId!]);
});

test("F — Experiment → Proposal → Scenario identity trace", () => {
  const pending = promote();
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: experiment().experiment,
    session: pending.session,
  });
  assert.equal(confirmed.provenance.experimentId, "exp-staff-10");
  assert.equal(confirmed.provenance.proposalId, "vai8:proposal:exp-staff-10");
  assert.notEqual(confirmed.provenance.canonicalScenarioId, confirmed.provenance.proposalId);
  assert.notEqual(confirmed.provenance.canonicalScenarioId, confirmed.provenance.experimentId);
});

test("G — Scenario assumption does not mutate Data Reality / Variables", () => {
  const { variables } = experiment();
  const before = JSON.stringify(variables);
  const pending = promote();
  resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: experiment().experiment,
    session: pending.session,
  });
  assert.equal(JSON.stringify(variables), before);
  assert.equal(pending.dataRealityWritten, false);
});

test("H — Classification is preserved after promotion", () => {
  const { experiment: exp } = experiment([model()]);
  const pending = promote(exp);
  const staffing = pending.proposal?.classifiedResults.find((item) => item.variableId === "vai:staffing");
  const otd = pending.proposal?.classifiedResults.find((item) => item.variableId === "vai:otd");
  assert.equal(staffing?.resultClass, "DETERMINISTIC_CALCULATION");
  assert.equal(otd?.resultClass, "MODEL_ESTIMATE");
  assert.equal(otd?.remainsEstimate, true);
});

test("I — Unsupported OTD remains unknown in the proposal", () => {
  const pending = promote();
  const otd = pending.proposal?.classifiedResults.find((item) => item.variableId === "vai:otd");
  assert.equal(otd?.resultClass, "UNSUPPORTED_PREDICTION");
  assert.equal(otd?.remainsUnknown, true);
  assert.equal(otd?.experimentDisplay, "Unknown");
});

test("J — MODEL_ESTIMATE remains an estimate", () => {
  const { experiment: exp } = experiment([model()]);
  const pending = promote(exp);
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: exp,
    session: pending.session,
  });
  assert.equal(confirmed.proposal?.modelEstimates[0]?.resultClass, "MODEL_ESTIMATE");
  assert.equal(confirmed.outcomeWritten, false);
});

test("K — Confounder Seasonality survives promotion", () => {
  const pending = promote();
  assert.ok(pending.proposal?.confounders.includes("Seasonality"));
});

test("L — Comparison does not let VAI choose a winner", () => {
  const pending = promote();
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: experiment().experiment,
    session: pending.session,
  });
  const scenarios = Object.values(confirmed.scenarioSession?.scenariosById ?? {});
  const evaluations = scenarios
    .map((scenario) => confirmed.scenarioSession?.evaluationsById[scenario.scenarioId])
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  if (scenarios.length >= 2 && evaluations.length >= 2) {
    const compared = compareNexoraExecutiveScenarios({ scenarios, evaluations });
    assert.equal(confirmed.winnerSelected, false);
    assert.ok(compared);
  } else {
    assert.equal(confirmed.winnerSelected, false);
  }
});

test("M — NPS remains owner of the solution path", () => {
  assert.equal(NPS_OPTION_GENERATION_BOUNDARY.createsScenarioAuthority, false);
  assert.equal(NPS_OPTION_GENERATION_BOUNDARY.scenarioWriter, "CC:9/ScenarioConversation");
  const pending = promote();
  assert.equal(pending.npsReplaced, false);
  assert.equal(VAI_8_BOUNDARY.secondNpsEngine, false);
});

test("N — VAI does not issue a recommendation", () => {
  const pending = promote();
  assert.equal(pending.recommendationIssued, false);
  assert.equal(VAI_8_BOUNDARY.secondRecommendationAuthority, false);
});

test("O — Promotion does not approve a Decision", () => {
  const pending = promote();
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: experiment().experiment,
    session: pending.session,
  });
  assert.equal(confirmed.decisionApproved, false);
});

test("P — ECA challenge can consume VAI uncertainty", () => {
  const notes = vai8UncertaintyNotes(experiment().experiment);
  assert.ok(notes.some((item) => /OTD impact remains unsupported/.test(item)));
  const utterance = "I prefer Scenario A";
  const meaning = Object.freeze({
    identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
    rawUtterance: utterance,
    preparedUtterance: utterance.toLowerCase(),
    communicativeIntent: "SUPPLY_INFORMATION",
    requestedOperation: "NONE",
    subject: { subjectId: "scenario-a", canonicalName: "Scenario A", lexicalHint: "Scenario A", subjectKind: "scenario" },
    objectReference: { subjectId: "scenario-a", canonicalName: "Scenario A", lexicalHint: "Scenario A", subjectKind: "scenario" },
    questionType: "NONE",
    requestedDepth: "STANDARD",
    modality: "DECLARATIVE",
    polarity: "AFFIRMATIVE",
    confidence: "HIGH",
    ambiguity: { unresolved: false, reason: "none", candidates: [] },
    semanticEvidence: { operationCues: [], objectCues: [], speechActCues: [], reasoningPath: "feature-frame-interpreter", usesLlm: false },
    selectedAuthority: null,
    commitsDecision: false,
    startsExecution: false,
    inventsBusinessTruth: false,
  }) as CanonicalManagerMeaning;
  const workingContext = composeEcaWorkingConversationContext({
    utterance,
    meaning,
    stage: Object.freeze({
      available: true,
      workspace: "Executive workspace",
      focus: { id: "scenario-a", label: "Scenario A", kind: "scenario" },
      selected: null,
      visible: Object.freeze([{ id: "scenario-a", label: "Scenario A", kind: "scenario" }]),
      collection: null,
      theatreSceneId: null,
    }),
    subjects: Object.freeze([{ id: "scenario-a", label: "Scenario A", kind: "scenario" }]),
  });
  const actionPlan = planEcaExecutiveConversationAction({ utterance, workingContext });
  const judgment = judgeEcaExecutiveCommitment({
    utterance,
    workingContext,
    actionPlan,
    analyticalUncertainty: notes,
  });
  assert.equal(judgment.preDecisionChallenge, "CHALLENGE_CRITICAL_UNKNOWN");
  assert.match(judgment.managerFacingNote ?? "", /OTD impact remains unsupported/);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", LEAK);
});

test("Q — No VAI action starts Execution", () => {
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: experiment().experiment,
    session: promote().session,
  });
  assert.equal(confirmed.executionStarted, false);
});

test("R — Scenario estimate is not an observed Outcome", () => {
  const { experiment: exp } = experiment([model()]);
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: exp,
    session: promote(exp).session,
  });
  assert.equal(confirmed.outcomeWritten, false);
});

test("S — Later observation stays distinct from the estimate", () => {
  const pending = promote(experiment([model()]).experiment);
  const estimate = pending.proposal?.modelEstimates[0]?.experimentDisplay;
  const observed = "92";
  assert.notEqual(estimate, observed);
  assert.equal(pending.outcomeWritten, false);
});

test("T — Difference does not auto-learn or update coefficients", () => {
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: experiment().experiment,
    session: promote().session,
  });
  assert.equal(confirmed.learningWritten, false);
  assert.equal(confirmed.coefficientsUpdated, false);
  assert.equal(VAI_8_BOUNDARY.trainsModels, false);
});

test("U — Theatre continuity keeps Impact Scene and experiment overlay", () => {
  const { bundle, experiment: exp } = experiment();
  const scene = composeVaiImpactScene({ bundle });
  const theatre = projectVaiWhatIfTheatre({ experiment: exp, scene });
  const pending = promote(exp);
  assert.equal(scene.apply, true);
  assert.equal(theatre.directorCalculated, false);
  assert.equal(pending.session.presentationState, "PROPOSED_AS_SCENARIO");
  assert.notEqual(pending.session.presentationState, "CANONICAL_SCENARIO");
});

test("V — Cancel leaves the experiment temporary", () => {
  const pending = promote();
  const cancelled = resolveVaiExperimentScenarioHandoff({
    utterance: "cancel",
    experiment: experiment().experiment,
    session: pending.session,
  });
  assert.equal(cancelled.session.confirmationState, "CANCELLED");
  assert.equal(cancelled.session.canonicalScenarioId, null);
  assert.equal(cancelled.session.presentationState, "EXPERIMENT");
});

test("W — Canonical creation failure creates no Scenario", () => {
  const pending = promote();
  const failed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: experiment().experiment,
    session: pending.session,
    canonicalWrite: "fail",
  });
  assert.equal(failed.session.confirmationState, "FAILED");
  assert.equal(failed.provenance.canonicalScenarioId, null);
  assert.equal(failed.decisionApproved, false);
  assert.equal(failed.executionStarted, false);
});

test("X — Repeated promotion does not duplicate the canonical Scenario", () => {
  const pending = promote();
  const first = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: experiment().experiment,
    session: pending.session,
  });
  const second = resolveVaiExperimentScenarioHandoff({
    utterance: "Make this a scenario.",
    experiment: experiment().experiment,
    session: first.session,
    scenarioSession: first.scenarioSession,
  });
  assert.equal(second.provenance.canonicalScenarioId, first.provenance.canonicalScenarioId);
  assert.match(second.response ?? "", /already available/);
});

test("Y — Referent authority wins when the topic has changed", () => {
  const result = resolveVaiExperimentScenarioHandoff({
    utterance: "Make this a scenario.",
    experiment: experiment().experiment,
    currentReferentId: SURGE,
  });
  assert.equal(result.session.confirmationState, "CLARIFY_REFERENT");
  assert.equal(result.provenance.canonicalScenarioId, null);
  assert.match(result.response ?? "", /current subject|staffing experiment/);
});

test("Z — Advisor explains experiment vs Scenario vs current reality", () => {
  const pending = promote();
  assert.match(pending.response ?? "", /will not change current business data/);
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: experiment().experiment,
    session: pending.session,
  });
  assert.match(confirmed.response ?? "", /available as a Scenario for comparison/);
  assert.match(confirmed.response ?? "", /OTD effect is still uncertain/);
});

test("AA — No architecture leakage", () => {
  const pending = promote();
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: experiment().experiment,
    session: pending.session,
  });
  assert.doesNotMatch(pending.response ?? "", LEAK);
  assert.doesNotMatch(confirmed.response ?? "", LEAK);
});

test("AB — Mutation safety before confirmation", () => {
  const { variables } = experiment();
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const before = JSON.stringify(variables);
  const pending = promote();
  assert.equal(JSON.stringify(variables), before);
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalog);
  assert.equal(pending.decisionApproved, false);
  assert.equal(pending.executionStarted, false);
  assert.equal(pending.outcomeWritten, false);
  assert.equal(pending.learningWritten, false);
  const diagnostics = formatVai8Diagnostics(pending);
  assert.equal(diagnostics.confirmationState, "PENDING_CONFIRMATION");
  assert.equal(diagnostics.scenarioHandoffRoute, "no-canonical-write");
});

test("CC:5 overlay uses the VAI:8 confirmation path", () => {
  const { bundle, session } = experiment();
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const state = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "problem",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    CAPACITY,
    catalog,
  );
  const turn = executeNexoraConversationalExperience({
    utterance: "Make this a scenario.",
    conversationContext: Object.freeze({
      currentSubjectId: CAPACITY,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "problem",
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: state,
    catalog,
    vaiAdvisorBundle: bundle,
    previousVaiWhatIfSession: session,
    messageIdSeed: "vai8-overlay",
  });
  assert.match(turn.response, /still a what-if experiment/);
  assert.doesNotMatch(turn.response, LEAK);
  assert.equal(turn.vai8Handoff?.session.confirmationState, "PENDING_CONFIRMATION");
});
