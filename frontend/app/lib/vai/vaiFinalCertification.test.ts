/**
 * NPA-T VAI:FINAL — end-to-end certification of VAI:1–8 as one pipeline.
 * Does not start VAI:9. Does not invent new VAI capability.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
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
import { MANAGER_OBJECT_KINDS } from "@/app/lib/manager-object/managerObjectInteractionFoundation.ts";
import { VAI_AUTHORITY_BOUNDARY, verifyVaiAuthorityBoundary } from "./vaiAuthorityBoundary.ts";
import { VAI_CONTEXTUAL_ROLES, VAI_FOUNDATION_CONTRACT } from "./vaiContract.ts";
import { VAI_OBJECT_ROLE_BOUNDARY } from "./vaiObjectRoleContract.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "./vaiCausalContract.ts";
import { VAI_ADVISOR_BOUNDARY } from "./vaiAdvisorContract.ts";
import { VAI_THEATRE_BOUNDARY, VAI_THEATRE_ROLE_GRAMMAR } from "./vaiTheatreContract.ts";
import { VAI_IMPACT_BOUNDARY, VAI_IMPACT_ROLE_REGIONS, VAI_IMPACT_SAFE_ZONES } from "./vaiImpactContract.ts";
import { VAI_WHAT_IF_BOUNDARY, type VaiTrustedQuantitativeModel } from "./vaiWhatIfContract.ts";
import { VAI_8_BOUNDARY } from "./vaiExperimentDecisionContract.ts";
import { verifyVaiFoundation } from "./vaiFoundation.ts";
import { resolveVaiVariables, type VaiCsvFieldSource, type VaiTrustedObservationSource } from "./vaiResolver.ts";
import { resolveVaiObjectVariableRoles, verifyVaiObjectRoleResolution } from "./vaiObjectRoleResolver.ts";
import { resolveVaiCausalSafety, verifyVaiCausalSafety } from "./vaiCausalResolver.ts";
import { composeVaiAdvisorAnalysis, verifyVaiAdvisorAnalysis } from "./vaiAdvisorComposer.ts";
import { projectVaiTheatreSymbols, verifyVaiTheatreSymbolLanguage } from "./vaiTheatreProjector.ts";
import { composeVaiImpactScene, verifyVaiImpactScene } from "./vaiImpactComposer.ts";
import {
  compareVaiWhatIfExperiments,
  createVaiWhatIfExperiment,
  verifyVaiWhatIfAnalysis,
} from "./vaiWhatIfResolver.ts";
import { composeVaiWhatIfAdvisor } from "./vaiWhatIfAdvisor.ts";
import { projectVaiWhatIfTheatre } from "./vaiWhatIfTheatre.ts";
import {
  resolveVaiExperimentScenarioHandoff,
  vai8UncertaintyNotes,
  verifyVaiExperimentDecisionIntegration,
} from "./vaiExperimentDecisionResolver.ts";
import type { VaiAdvisorBundle } from "./vaiAdvisorContract.ts";
import type { VaiVariable } from "./vaiContract.ts";
import type { VaiRelationshipEvidenceRef } from "./vaiCausalContract.ts";

const CAPACITY = "ctx-problem-capacity";
const SURGE = "ctx-scenario-demand";
const LEAK = /\b(?:VAI:[1-9]|CC:\d+|CORE-INT:3|canonical writer|proposal contract|resolver|causalAssertion|authority)\b/i;

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

function vai1(source: VaiTrustedObservationSource | VaiCsvFieldSource, role: VaiVariable["role"] = "CONTROL"): VaiVariable {
  return resolveVaiVariables({
    analysisContext: { analysisContextId: "vai1" },
    applications: [{ source, role }],
  }).variables[0]!;
}

function capAv(): VaiCsvFieldSource {
  return {
    kind: "CSV_FIELD",
    variableId: "vai:csv:CAP_AV",
    sourceColumn: "CAP_AV",
    fieldId: "field-cap-av",
    proposedMeaning: "Available Capacity",
    confirmedMeaning: null,
    confirmationSource: "none",
    semanticState: "AMBIGUOUS",
    sourceRef: "csv:forecast.csv:CAP_AV",
    value: 850,
    relatedObjectIds: [CAPACITY],
    requestedDisplayName: "Available Capacity",
  };
}

function ev(id: string, kind: VaiRelationshipEvidenceRef["kind"] = "ASSOCIATION", polarity: VaiRelationshipEvidenceRef["polarity"] = "SUPPORTING"): VaiRelationshipEvidenceRef {
  return { evidenceRef: id, kind, polarity, authority: "CC:8" };
}

function staffingModel(): VaiTrustedQuantitativeModel {
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

function pipeline(extras?: {
  readonly includeCapAv?: boolean;
  readonly includeDemand?: boolean;
  readonly staffingRole?: "LEVER" | "CONTROL";
  readonly relationship?: "associated" | "manager" | "causal-gate" | "none";
}): {
  readonly variables: VaiVariable[];
  readonly staffing: VaiVariable;
  readonly bundle: VaiAdvisorBundle;
} {
  const staffing = vai1(trusted("vai:staffing", "Staffing", { value: 100, unit: "people" }), extras?.staffingRole ?? "LEVER");
  const otd = vai1(trusted("vai:otd", "OTD", { sourceKind: "KPI_OBSERVATION", value: 91, unit: "%" }), "OUTCOME");
  const backlog = vai1(trusted("vai:backlog", "Backlog", { value: 40 }), "PATH_OF_EFFECT");
  const machine = vai1(trusted("vai:machine", "Machine Availability", { value: 92, unit: "%" }), "MODERATOR");
  const shift = vai1(trusted("vai:shift", "Shift Length", { value: 8, unit: "hours" }), "CONTROL");
  const season = vai1(trusted("vai:seasonality", "Seasonality", { value: 1 }), "CONFOUNDER");
  const capacity = vai1(trusted("vai:capacity", "Capacity", { value: 1000, unit: "units/day" }), "LEVER");
  const demand = vai1(trusted("vai:demand", "Demand", { value: 800, unit: "units/day" }), "LEVER");
  const cap = vai1(capAv(), "CONTROL");
  const variables = [
    staffing, otd, backlog, machine, shift, season, capacity,
    ...(extras?.includeDemand ? [demand] : []),
    ...(extras?.includeCapAv ? [cap] : []),
  ];
  const roleResult = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-capacity-vars",
      purpose: extras?.staffingRole === "CONTROL" ? "HOLD_STABLE_FOR_COMPARISON" : "WHAT_CAN_MANAGEMENT_CHANGE",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: variables.map((item) => item.variableId),
    },
    variables,
    roleEvidence: [
      { variableId: "vai:staffing", role: extras?.staffingRole ?? "LEVER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "staff" },
      { variableId: "vai:otd", role: "OUTCOME", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "otd" },
      { variableId: "vai:backlog", role: "PATH_OF_EFFECT", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "path" },
      { variableId: "vai:machine", role: "MODERATOR", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "mod" },
      { variableId: "vai:shift", role: "CONTROL", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "ctrl" },
      { variableId: "vai:seasonality", role: "CONFOUNDER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "season" },
      { variableId: "vai:capacity", role: "LEVER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "cap" },
      ...(extras?.includeDemand ? [{ variableId: "vai:demand", role: "LEVER" as const, status: "SUPPORTED" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "dem" }] : []),
    ],
  });
  const associated = resolveVaiCausalSafety({
    relationshipId: "rel-staff-otd",
    analysisContextId: "ctx-capacity-vars",
    source: staffing,
    target: { kind: "VARIABLE", id: "vai:otd", variable: otd },
    evidence: [ev("a1"), ev("a2")],
    scope: { objectScope: CAPACITY },
    vai2: { confounders: roleResult.items.filter((item) => item.primaryRole === "CONFOUNDER") },
  }).relationship;
  const manager = resolveVaiCausalSafety({
    relationshipId: "rel-staff-mgr",
    analysisContextId: "ctx-capacity-vars",
    source: staffing,
    target: { kind: "VARIABLE", id: "vai:otd", variable: otd },
    evidence: [ev("obs", "CO_OBSERVATION")],
    scope: { objectScope: CAPACITY },
    managerAssertion: {
      statement: "Staffing is causing the delays.",
      sourceRef: "manager:staffing-cause",
      assertedCauseVariableId: "staffing",
    },
  }).relationship;
  const gated = resolveVaiCausalSafety({
    relationshipId: "rel-staff-gate",
    analysisContextId: "ctx-capacity-vars",
    source: staffing,
    target: { kind: "VARIABLE", id: "vai:otd", variable: otd },
    evidence: [ev("core", "ASSOCIATION")],
    scope: { objectScope: CAPACITY },
    coreInt3: { relationKind: "supported-causal", causeEstablished: true },
  }).relationship;
  const relationship = extras?.relationship === "none"
    ? null
    : extras?.relationship === "manager"
      ? manager
      : extras?.relationship === "causal-gate"
        ? gated
        : associated;
  return {
    variables,
    staffing,
    bundle: {
      analysisContextId: "ctx-capacity-vars",
      focalObject: { id: CAPACITY, label: "Capacity Gap" },
      variables,
      roleResult,
      relationship,
    },
  };
}

test("VAI:FINAL — VAI:1–8 remain certified without VAI:9", () => {
  assert.equal(verifyVaiFoundation().ok, true);
  assert.equal(verifyVaiObjectRoleResolution().ok, true);
  assert.equal(verifyVaiCausalSafety().ok, true);
  assert.equal(verifyVaiAdvisorAnalysis().ok, true);
  assert.equal(verifyVaiTheatreSymbolLanguage().ok, true);
  assert.equal(verifyVaiImpactScene().ok, true);
  assert.equal(verifyVaiWhatIfAnalysis().ok, true);
  assert.equal(verifyVaiExperimentDecisionIntegration().ok, true);
  assert.equal(verifyVaiAuthorityBoundary().ok, true);
  assert.equal(VAI_8_BOUNDARY.startsVai9, false);
});

test("Authority map — no parallel writers", () => {
  assert.equal(VAI_AUTHORITY_BOUNDARY.objects, "MO:1");
  assert.equal(VAI_AUTHORITY_BOUNDARY.dataReality, "Data Reality / RDI");
  assert.equal(VAI_AUTHORITY_BOUNDARY.semantics, "DATA-ADV / DATA-UX:3 / manager confirmation");
  assert.equal(VAI_AUTHORITY_BOUNDARY.evidence, "CC:8");
  assert.equal(VAI_AUTHORITY_BOUNDARY.scenario, "CC:9");
  assert.equal(VAI_AUTHORITY_BOUNDARY.decision, "CC:10");
  assert.equal(VAI_AUTHORITY_BOUNDARY.execution, "CC:11");
  assert.equal(VAI_AUTHORITY_BOUNDARY.stage, "Director / Stage interaction");
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.causalImplicationOwner, "CORE-INT:3");
  assert.equal(NPS_OPTION_GENERATION_BOUNDARY.scenarioWriter, "CC:9/ScenarioConversation");
  assert.equal(VAI_FOUNDATION_CONTRACT.createsObjects, false);
  assert.equal(VAI_OBJECT_ROLE_BOUNDARY.parallelVariableStore, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
  assert.equal(VAI_ADVISOR_BOUNDARY.secondAdvisor, false);
  assert.equal(VAI_THEATRE_BOUNDARY.secondStage, false);
  assert.equal(VAI_IMPACT_BOUNDARY.secondDirector, false);
  assert.equal(VAI_WHAT_IF_BOUNDARY.secondScenarioAuthority, false);
  assert.equal(VAI_8_BOUNDARY.secondDecisionAuthority, false);
  assert.equal(VAI_8_BOUNDARY.secondScenarioAuthority, false);
  assert.ok(!MANAGER_OBJECT_KINDS.includes("variable" as typeof MANAGER_OBJECT_KINDS[number]));
});

test("4 — Variable identity remains a Variable through the pipeline", () => {
  const { staffing, bundle } = pipeline();
  assert.equal(staffing.variableId, "vai:staffing");
  assert.equal(staffing.isExecutiveObject, false);
  assert.equal(staffing.objectKind, null);
  assert.equal(staffing.provenance.sourceRef, "attr:vai:staffing");
  assert.equal(staffing.semanticStatus, "CONFIRMED");
  const theatre = projectVaiTheatreSymbols({ bundle });
  const scene = composeVaiImpactScene({ bundle });
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-id",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const promoted = resolveVaiExperimentScenarioHandoff({
    utterance: "Make this a scenario.",
    experiment: created.experiment,
  });
  assert.ok(theatre.symbols.some((item) => item.variableId === "vai:staffing"));
  assert.ok(scene.theatreProjection?.symbols.some((item) => item.variableId === "vai:staffing"));
  assert.equal(created.experiment?.views.find((item) => item.variableId === "vai:staffing")?.variableId, "vai:staffing");
  assert.equal(promoted.proposal?.changedVariables.includes("vai:staffing"), true);
  assert.equal(staffing.canonicalMutation, false);
});

test("5 — Role is contextual, not a permanent Variable mutation", () => {
  const lever = pipeline({ staffingRole: "LEVER" });
  const control = pipeline({ staffingRole: "CONTROL" });
  assert.equal(lever.bundle.roleResult.items.find((item) => item.variableId === "vai:staffing")?.primaryRole, "LEVER");
  assert.equal(control.bundle.roleResult.items.find((item) => item.variableId === "vai:staffing")?.primaryRole, "CONTROL");
  assert.equal(lever.staffing.variableId, control.staffing.variableId);
});

test("6 — Six canonical roles remain intact", () => {
  assert.deepEqual([...VAI_CONTEXTUAL_ROLES], ["LEVER", "OUTCOME", "PATH_OF_EFFECT", "MODERATOR", "CONTROL", "CONFOUNDER"]);
  const { bundle } = pipeline();
  const roles = new Set(bundle.roleResult.items.map((item) => item.primaryRole));
  for (const role of VAI_CONTEXTUAL_ROLES) {
    assert.equal(roles.has(role), true, role);
    assert.ok(VAI_THEATRE_ROLE_GRAMMAR[role]);
    assert.ok(VAI_IMPACT_ROLE_REGIONS[role]);
  }
});

test("7 — CAP_AV remains CAP_AV through Advisor, Theatre, Scene, What-If, and proposal", () => {
  const { bundle } = pipeline({ includeCapAv: true });
  const variable = bundle.variables.find((item) => item.variableId === "vai:csv:CAP_AV");
  assert.equal(variable?.displayName, "CAP_AV");
  assert.doesNotMatch(variable?.displayName ?? "", /Available Capacity/);
  const advisor = composeVaiAdvisorAnalysis({ utterance: "What variables matter here?", bundle });
  assert.match(advisor.response ?? "", /CAP_AV exists in the data/);
  assert.match(advisor.response ?? "", /business meaning is not confirmed/);
  assert.doesNotMatch(advisor.response ?? "", /CAP_AV is Available Capacity/);
  const symbol = projectVaiTheatreSymbols({ bundle }).symbols.find((item) => item.variableId === "vai:csv:CAP_AV");
  assert.equal(symbol?.displayLabel, "CAP_AV");
  const scene = composeVaiImpactScene({ bundle });
  assert.doesNotMatch(scene.narrative ?? "", /Available Capacity is/);
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-capav",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  assert.equal(created.experiment?.views.find((item) => item.variableId === "vai:csv:CAP_AV")?.displayName, "CAP_AV");
  const proposal = resolveVaiExperimentScenarioHandoff({
    utterance: "Make this a scenario.",
    experiment: created.experiment,
  }).proposal;
  assert.equal(proposal?.classifiedResults.find((item) => item.variableId === "vai:csv:CAP_AV")?.displayName, "CAP_AV");
});

test("8 — Association never becomes cause, effect size, or Scenario truth", () => {
  const { bundle } = pipeline({ relationship: "associated" });
  assert.equal(bundle.relationship?.evidenceSupportedCausal, false);
  assert.notEqual(bundle.relationship?.relationshipStatus, "EVIDENCE_SUPPORTED_CAUSAL");
  const advisor = composeVaiAdvisorAnalysis({ utterance: "Is staffing causing the delay?", bundle });
  assert.doesNotMatch(advisor.response ?? "", /\bcauses\b|\bis the cause of\b/);
  const theatre = projectVaiTheatreSymbols({ bundle });
  assert.ok(theatre.symbols.every((item) => item.connectorType !== "causal-confirmed"));
  const scene = composeVaiImpactScene({ bundle });
  assert.ok(scene.connectors.every((item) => item.geometryUpgradedSemantics === false));
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-assoc",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  assert.equal(created.experiment?.views.find((item) => item.variableId === "vai:otd")?.experimentValue, null);
  const proposal = resolveVaiExperimentScenarioHandoff({
    utterance: "Make this a scenario.",
    experiment: created.experiment,
  }).proposal;
  assert.equal(proposal?.classifiedResults.find((item) => item.variableId === "vai:otd")?.remainsUnknown, true);
});

test("9 — Manager-asserted cause stays attributed without effect size", () => {
  const { bundle } = pipeline({ relationship: "manager" });
  assert.equal(bundle.relationship?.relationshipStatus, "MANAGER_ASSERTED_CAUSE");
  assert.equal(bundle.relationship?.evidenceSupportedCausal, false);
  assert.match(bundle.relationship?.provenance.join(" ") ?? "", /manager:staffing-cause/);
  const advisor = composeVaiAdvisorAnalysis({ utterance: "Is staffing causing the delay?", bundle });
  assert.match(advisor.response ?? "", /You identified staffing as the cause/);
  assert.match(advisor.response ?? "", /has not independently confirmed/);
  const theatre = projectVaiTheatreSymbols({ bundle });
  assert.ok(theatre.symbols.every((item) => item.connectorType === "manager-view"));
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-mgr",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  assert.equal(created.experiment?.views.find((item) => item.variableId === "vai:otd")?.experimentValue, null);
});

test("10 — Evidence-supported causality still has no effect size", () => {
  const { bundle } = pipeline({ relationship: "causal-gate" });
  assert.equal(bundle.relationship?.evidenceSupportedCausal, true);
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-gate",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const otd = created.experiment?.views.find((item) => item.variableId === "vai:otd");
  assert.equal(otd?.experimentValue, null);
  assert.match(otd?.reason ?? "", /effect size/);
});

test("11 — Seasonality remains visible through Advisor, Theatre, Scene, What-If, and proposal", () => {
  const { bundle } = pipeline();
  const advisor = composeVaiAdvisorAnalysis({ utterance: "What could explain this relationship?", bundle });
  assert.match(advisor.response ?? "", /Seasonality/);
  assert.ok(projectVaiTheatreSymbols({ bundle }).symbols.some((item) => item.analyticalRole === "CONFOUNDER"));
  assert.equal(composeVaiImpactScene({ bundle }).confounderVisible, true);
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-season",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  assert.ok(created.experiment?.confounders.includes("Seasonality"));
  assert.ok(
    resolveVaiExperimentScenarioHandoff({
      utterance: "Make this a scenario.",
      experiment: created.experiment,
    }).proposal?.confounders.includes("Seasonality"),
  );
});

test("12 — Advisor continuity stays on Capacity Gap without leakage", () => {
  const { bundle } = pipeline();
  const first = composeVaiAdvisorAnalysis({ utterance: "What variables matter for Capacity Gap?", bundle });
  const second = composeVaiAdvisorAnalysis({ utterance: "What can I potentially change?", bundle, previousSession: first.nextSession });
  const third = composeVaiAdvisorAnalysis({ utterance: "Why is staffing a lever?", bundle, previousSession: second.nextSession });
  const fourth = composeVaiAdvisorAnalysis({ utterance: "Does staffing cause the problem?", bundle, previousSession: third.nextSession });
  const fifth = composeVaiAdvisorAnalysis({ utterance: "Tell me more about the lever.", bundle, previousSession: second.nextSession });
  assert.equal(first.focalObjectId, CAPACITY);
  assert.match(second.response ?? "", /Staffing is a potential lever/);
  assert.match(third.response ?? "", /does not prove that changing it will solve/);
  assert.doesNotMatch(fourth.response ?? "", /\bcauses\b/);
  assert.match(fifth.response ?? "", /Staffing/);
  for (const item of [first, second, third, fourth, fifth]) {
    assert.doesNotMatch(item.response ?? "", LEAK);
    assert.equal(item.stageMutated, false);
  }
});

test("13 — Theatre symbols remain subordinate presentation tokens", () => {
  const { bundle } = pipeline();
  const projection = projectVaiTheatreSymbols({ bundle });
  assert.equal(projection.objectsCreated, false);
  assert.equal(projection.stageMutated, false);
  assert.ok(projection.symbols.every((item) => item.visualFamily === "VARIABLE_SYMBOL"));
  assert.ok(projection.symbols.every((item) => item.isExecutiveObject === false && item.isStageObject === false));
  assert.ok(projection.symbols.some((item) => item.roleAmbiguous === false));
});

test("14 — Impact Scene arranges six roles without creating analysis", () => {
  const { bundle } = pipeline();
  const scene = composeVaiImpactScene({ bundle });
  assert.equal(scene.focalDominant, true);
  assert.equal(scene.focalObjectLabel, "Capacity Gap");
  const byRole = new Map(scene.placements.filter((item) => item.kind === "VARIABLE_SYMBOL").map((item) => [item.role, item.regionId]));
  assert.equal(byRole.get("LEVER"), VAI_IMPACT_ROLE_REGIONS.LEVER.regionId);
  assert.equal(byRole.get("OUTCOME"), VAI_IMPACT_ROLE_REGIONS.OUTCOME.regionId);
  assert.equal(byRole.get("PATH_OF_EFFECT"), VAI_IMPACT_ROLE_REGIONS.PATH_OF_EFFECT.regionId);
  assert.equal(byRole.get("MODERATOR"), VAI_IMPACT_ROLE_REGIONS.MODERATOR.regionId);
  assert.equal(byRole.get("CONTROL"), VAI_IMPACT_ROLE_REGIONS.CONTROL.regionId);
  assert.equal(byRole.get("CONFOUNDER"), VAI_IMPACT_ROLE_REGIONS.CONFOUNDER.regionId);
  assert.ok(scene.placements.every((item) => item.x > VAI_IMPACT_SAFE_ZONES.left.reservedUntil && item.x < VAI_IMPACT_SAFE_ZONES.right.reservedFrom));
  assert.equal(scene.outcomeDelta, null);
  assert.equal(scene.interventionPredicted, false);
  assert.equal(VAI_IMPACT_BOUNDARY.independentlyResolvesRoles, false);
  assert.equal(VAI_IMPACT_BOUNDARY.independentlyDeterminesCausality, false);
  assert.ok(scene.placements.some((item) => item.kind === "EXECUTIVE_OBJECT" && item.role === "FOCAL"));
});

test("15–21 — What-If baseline, prediction, arithmetic, model, multi-var, theatre, comparison", () => {
  const { variables, bundle } = pipeline({ includeDemand: true });
  const before = JSON.stringify(variables);
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-a",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
    createdFromRequest: "What if staffing increases 10%?",
  });
  const staffing = created.experiment!.views.find((item) => item.variableId === "vai:staffing")!;
  assert.equal(staffing.baselineValue, 100);
  assert.equal(staffing.experimentValue, 110);
  assert.equal(created.experiment!.createdFrom, "MANAGER_INTERACTION");
  assert.equal(created.experiment!.createdFromRequest, "What if staffing increases 10%?");
  assert.equal(JSON.stringify(variables), before);
  const otd = created.experiment!.views.find((item) => item.variableId === "vai:otd")!;
  assert.equal(otd.experimentDisplay, "Unknown");
  assert.equal(otd.resultClass, "UNSUPPORTED_PREDICTION");
  const capacity = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-cap",
    changes: [{ variableId: "vai:capacity", operator: "increase-percent", value: 10 }],
  }).experiment!.views.find((item) => item.variableId === "vai:capacity")!;
  assert.equal(capacity.experimentValue, 1100);
  assert.equal(capacity.resultClass, "DETERMINISTIC_CALCULATION");
  const estimated = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-model",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
    models: [staffingModel()],
    requestedScope: { businessContext: "Plant A" },
  }).experiment!.views.find((item) => item.variableId === "vai:otd")!;
  assert.equal(estimated.resultClass, "MODEL_ESTIMATE");
  assert.equal(estimated.experimentDisplay, "93–95");
  const scopedOut = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-scope",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
    models: [staffingModel()],
    requestedScope: { businessContext: "Plant B" },
  }).experiment!.views.find((item) => item.variableId === "vai:otd")!;
  assert.equal(scopedOut.resultClass, "SCOPE_BLOCKED");
  assert.equal(scopedOut.experimentValue, null);
  const multi = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-multi",
    changes: [
      { variableId: "vai:staffing", operator: "increase-percent", value: 10 },
      { variableId: "vai:demand", operator: "increase-percent", value: 15 },
      { variableId: "vai:machine", operator: "hold", value: null },
    ],
  }).experiment!;
  assert.equal(multi.assumptions.length, 3);
  assert.equal(multi.assumptions.find((item) => item.variableId === "vai:machine")?.heldConstant, true);
  assert.equal(multi.views.find((item) => item.variableId === "vai:otd")?.resultClass, "UNSUPPORTED_PREDICTION");
  const theatre = projectVaiWhatIfTheatre({ experiment: created.experiment });
  const row = theatre.rows.find((item) => item.variableId === "vai:staffing");
  assert.equal(row?.currentLabel, "CURRENT / BASELINE");
  assert.equal(row?.whatIfLabel, "WHAT-IF / ASSUMED");
  assert.equal(theatre.rows.find((item) => item.variableId === "vai:otd")?.visualPropagation, "none");
  const second = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-b",
    session: created.session,
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 20 }],
  });
  const compared = compareVaiWhatIfExperiments(second.session);
  assert.equal(compared.winnerSelected, false);
  assert.equal(VAI_WHAT_IF_BOUNDARY.optimization, false);
});

test("22–24 — Scenario promotion, cancel, and duplicate safety", () => {
  const { bundle } = pipeline();
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-promo",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const pending = resolveVaiExperimentScenarioHandoff({
    utterance: "Make this a scenario.",
    experiment: created.experiment,
    currentReferentId: CAPACITY,
  });
  assert.equal(pending.session.confirmationState, "PENDING_CONFIRMATION");
  assert.equal(pending.canonicalWriter, null);
  const cancelled = resolveVaiExperimentScenarioHandoff({
    utterance: "cancel",
    experiment: created.experiment,
    session: pending.session,
  });
  assert.equal(cancelled.session.canonicalScenarioId, null);
  assert.equal(cancelled.decisionApproved, false);
  assert.equal(cancelled.executionStarted, false);
  assert.equal(created.experiment?.views.find((item) => item.variableId === "vai:staffing")?.baselineValue, 100);
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: created.experiment,
    session: pending.session,
  });
  assert.equal(confirmed.canonicalWriter, "CC:9");
  assert.ok(confirmed.provenance.canonicalScenarioId?.startsWith("cc9:scenario:"));
  assert.notEqual(confirmed.provenance.canonicalScenarioId, confirmed.provenance.proposalId);
  const dup = resolveVaiExperimentScenarioHandoff({
    utterance: "Make this a scenario.",
    experiment: created.experiment,
    session: confirmed.session,
    scenarioSession: confirmed.scenarioSession,
  });
  assert.equal(dup.provenance.canonicalScenarioId, confirmed.provenance.canonicalScenarioId);
});

test("25 — Referent stress: Demand Surge does not inherit the Staffing experiment", () => {
  const { bundle } = pipeline();
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-stale",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const result = resolveVaiExperimentScenarioHandoff({
    utterance: "Make this a scenario.",
    experiment: created.experiment,
    currentReferentId: SURGE,
  });
  assert.equal(result.session.confirmationState, "CLARIFY_REFERENT");
  assert.equal(result.provenance.canonicalScenarioId, null);
});

test("26–30 — Decision, ECA, Execution, Outcome, and Learning boundaries", () => {
  const { bundle } = pipeline();
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-bounds",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
    models: [staffingModel()],
    requestedScope: { businessContext: "Plant A" },
  });
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: created.experiment,
    session: resolveVaiExperimentScenarioHandoff({
      utterance: "Make this a scenario.",
      experiment: created.experiment,
    }).session,
  });
  assert.equal(confirmed.decisionApproved, false);
  assert.equal(confirmed.executionStarted, false);
  assert.equal(confirmed.outcomeWritten, false);
  assert.equal(confirmed.learningWritten, false);
  assert.equal(confirmed.coefficientsUpdated, false);
  const estimate = created.experiment!.views.find((item) => item.variableId === "vai:otd")?.experimentDisplay;
  assert.notEqual(estimate, "92");
  const notes = vai8UncertaintyNotes(pipeline().bundle && createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-unknown",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  }).experiment);
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
  const judgment = judgeEcaExecutiveCommitment({
    utterance,
    workingContext,
    actionPlan: planEcaExecutiveConversationAction({ utterance, workingContext }),
    analyticalUncertainty: notes,
  });
  assert.equal(judgment.preDecisionChallenge, "CHALLENGE_CRITICAL_UNKNOWN");
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("31 — Mutation audit before canonical write", () => {
  const { variables, bundle } = pipeline();
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const before = JSON.stringify(variables);
  composeVaiAdvisorAnalysis({ utterance: "What variables matter here?", bundle });
  composeVaiImpactScene({ bundle });
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-mut",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  resolveVaiExperimentScenarioHandoff({ utterance: "Make this a scenario.", experiment: created.experiment });
  assert.equal(JSON.stringify(variables), before);
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalog);
});

test("32 — Missing bundle invents no VAI intelligence", () => {
  assert.equal(projectVaiTheatreSymbols({ bundle: null }).apply, false);
  assert.equal(composeVaiImpactScene({ bundle: null }).apply, false);
  assert.equal(createVaiWhatIfExperiment({
    bundle: null,
    experimentId: "exp-none",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  }).experiment, null);
  assert.equal(resolveVaiExperimentScenarioHandoff({
    utterance: "Make this a scenario.",
    experiment: null,
  }).proposal, null);
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const state = createInitialNexoraMVPObjectInteractionState({
    workspace: "problem",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const turn = executeNexoraConversationalExperience({
    utterance: "Show me the stage.",
    conversationContext: Object.freeze({
      currentSubjectId: CAPACITY,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "problem",
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: state,
    catalog,
    messageIdSeed: "vai-final-missing",
  });
  assert.equal(turn.vaiImpactScene ?? null, null);
  assert.equal(turn.vaiWhatIfExperiment ?? null, null);
  assert.equal(turn.vai8Handoff ?? null, null);
  const whatIf = composeVaiWhatIfAdvisor({
    utterance: "What if staffing increases 10%?",
    bundle: null,
  });
  assert.equal(whatIf.apply, false);
  assert.equal(whatIf.experiment, null);
});

test("33 — Manager-facing text does not leak architecture", () => {
  const { bundle } = pipeline();
  const advisor = composeVaiAdvisorAnalysis({ utterance: "What variables matter here?", bundle });
  const whatIf = composeVaiWhatIfAdvisor({ utterance: "What if staffing increases 10%?", bundle });
  const pending = resolveVaiExperimentScenarioHandoff({
    utterance: "Make this a scenario.",
    experiment: createVaiWhatIfExperiment({
      bundle,
      experimentId: "exp-leak",
      changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
    }).experiment,
  });
  assert.doesNotMatch(advisor.response ?? "", LEAK);
  assert.doesNotMatch(whatIf.response ?? "", LEAK);
  assert.doesNotMatch(pending.response ?? "", LEAK);
});

test("34 — Full manager journey from variables to confirmed Scenario", () => {
  const { bundle, variables } = pipeline();
  const before = JSON.stringify(variables);
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
  const theatre = projectNexoraDecisionTheatreFoundation({ stageState: state, catalog });
  assert.ok((theatre.visibleExecutiveObjects?.length ?? 0) > 0);
  const explain = executeNexoraConversationalExperience({
    utterance: "Explain Capacity Gap.",
    conversationContext: Object.freeze({
      currentSubjectId: CAPACITY,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "problem",
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: state,
    catalog,
    vaiAdvisorBundle: bundle,
    messageIdSeed: "vai-final-explain",
  });
  const vars = composeVaiAdvisorAnalysis({ utterance: "What variables matter?", bundle });
  const change = composeVaiAdvisorAnalysis({ utterance: "What can I change?", bundle, previousSession: vars.nextSession });
  const cause = composeVaiAdvisorAnalysis({ utterance: "Does staffing cause the delivery problem?", bundle, previousSession: change.nextSession });
  const scene = composeVaiImpactScene({ bundle });
  const whatIf = composeVaiWhatIfAdvisor({ utterance: "What if staffing increases 10%?", bundle });
  const otdAsk = composeVaiWhatIfAdvisor({
    utterance: "What would happen to OTD?",
    bundle,
    session: whatIf.session,
  });
  const compare = composeVaiWhatIfAdvisor({
    utterance: "Compare this with the current situation.",
    bundle,
    session: whatIf.session,
  });
  const pending = resolveVaiExperimentScenarioHandoff({
    utterance: "Make this a scenario.",
    experiment: whatIf.experiment,
    currentReferentId: CAPACITY,
  });
  const confirmed = resolveVaiExperimentScenarioHandoff({
    utterance: "yes",
    experiment: whatIf.experiment,
    session: pending.session,
  });
  assert.doesNotMatch(explain.response, LEAK);
  assert.match(vars.response ?? "", /Staffing|Seasonality/);
  assert.match(change.response ?? "", /potential lever/);
  assert.doesNotMatch(cause.response ?? "", /\bcauses\b/);
  assert.equal(scene.apply, true);
  assert.equal(scene.confounderVisible, true);
  assert.match(whatIf.response ?? "", /assumed staffing level of 110/);
  assert.match(whatIf.response ?? "", /OTD remains unknown/);
  assert.match(otdAsk.response ?? "", /quantitative relationship/);
  assert.match(compare.response ?? "", /not selecting a preferred experiment|Baseline remains/);
  assert.equal(pending.session.confirmationState, "PENDING_CONFIRMATION");
  assert.equal(confirmed.canonicalWriter, "CC:9");
  assert.match(confirmed.response ?? "", /still uncertain/);
  assert.equal(JSON.stringify(variables), before);
  assert.doesNotMatch(`${vars.response}${whatIf.response}${confirmed.response}`, LEAK);
  const live = executeNexoraConversationalExperience({
    utterance: "Explain what we know and what is still uncertain.",
    conversationContext: Object.freeze({
      currentSubjectId: CAPACITY,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "problem",
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: state,
    catalog,
    vaiAdvisorBundle: bundle,
    previousVaiWhatIfSession: whatIf.session,
    previousVai8PromotionSession: confirmed.session,
    messageIdSeed: "vai-final-journey",
  });
  assert.doesNotMatch(live.response, LEAK);
});
