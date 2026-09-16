/**
 * NPA-A VAI:7 — Interactive Analysis & What-If tests A–AC.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { composeVaiAdvisorAnalysis, verifyVaiAdvisorAnalysis } from "./vaiAdvisorComposer.ts";
import type { VaiAdvisorBundle } from "./vaiAdvisorContract.ts";
import { resolveVaiCausalSafety } from "./vaiCausalResolver.ts";
import { resolveVaiObjectVariableRoles } from "./vaiObjectRoleResolver.ts";
import { resolveVaiVariables, type VaiTrustedObservationSource } from "./vaiResolver.ts";
import { verifyVaiFoundation } from "./vaiFoundation.ts";
import { verifyVaiObjectRoleResolution } from "./vaiObjectRoleResolver.ts";
import { verifyVaiCausalSafety } from "./vaiCausalResolver.ts";
import { verifyVaiTheatreSymbolLanguage } from "./vaiTheatreProjector.ts";
import { composeVaiImpactScene, verifyVaiImpactScene } from "./vaiImpactComposer.ts";
import type { VaiVariable } from "./vaiContract.ts";
import type { VaiAnalyticalRelationship, VaiRelationshipEvidenceRef } from "./vaiCausalContract.ts";
import { VAI_WHAT_IF_BOUNDARY, type VaiTrustedQuantitativeModel } from "./vaiWhatIfContract.ts";
import { formatVaiWhatIfDiagnostics } from "./vaiWhatIfDiagnostics.ts";
import {
  compareVaiWhatIfExperiments,
  createVaiWhatIfExperiment,
  discardVaiWhatIfExperiment,
  proposeVaiWhatIfAsScenario,
  verifyVaiWhatIfAnalysis,
} from "./vaiWhatIfResolver.ts";
import { composeVaiWhatIfAdvisor } from "./vaiWhatIfAdvisor.ts";
import { projectVaiWhatIfTheatre } from "./vaiWhatIfTheatre.ts";

const CAPACITY = "ctx-problem-capacity";
const MARGIN = "ctx-problem-margin";
const LEAK = /\b(?:VAI:[1-8]|CC:\d+|CORE-INT:3|causalAssertion|resolver|semantic authority)\b/i;

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

function bundleOf(extras?: {
  readonly analysisContextId?: string;
  readonly focalId?: string;
  readonly focalLabel?: string;
  readonly staffingValue?: number | null;
  readonly capacityValue?: number | null;
  readonly otdValue?: number | null;
  readonly demandValue?: number | null;
  readonly staffingUnit?: string | null;
  readonly capacityUnit?: string | null;
  readonly demandUnit?: string | null;
  readonly causal?: boolean;
  readonly includeDemand?: boolean;
}): { readonly variables: VaiVariable[]; readonly bundle: VaiAdvisorBundle } {
  const analysisContextId = extras?.analysisContextId ?? "ctx-capacity-vars";
  const focalId = extras?.focalId ?? CAPACITY;
  const staffing = vai1(trusted("vai:staffing", "Staffing", {
    value: extras?.staffingValue === undefined ? 100 : extras.staffingValue,
    unit: extras?.staffingUnit ?? "people",
    relatedObjectIds: [focalId],
  }), "LEVER");
  const capacity = vai1(trusted("vai:capacity", "Capacity", {
    value: extras?.capacityValue === undefined ? 1000 : extras.capacityValue,
    unit: extras?.capacityUnit ?? "units/day",
    relatedObjectIds: [focalId],
  }), "LEVER");
  const otd = vai1(trusted("vai:otd", "OTD", {
    sourceKind: "KPI_OBSERVATION",
    value: extras?.otdValue === undefined ? 91 : extras.otdValue,
    unit: "%",
    relatedObjectIds: [focalId],
  }), "OUTCOME");
  const backlog = vai1(trusted("vai:backlog", "Backlog", { value: 40, relatedObjectIds: [focalId] }), "PATH_OF_EFFECT");
  const season = vai1(trusted("vai:seasonality", "Seasonality", { value: 1, relatedObjectIds: [focalId] }), "CONFOUNDER");
  const machine = vai1(trusted("vai:machine", "Machine Availability", { value: 92, unit: "%", relatedObjectIds: [focalId] }), "MODERATOR");
  const shift = vai1(trusted("vai:shift", "Shift Length", { value: 8, unit: "hours", relatedObjectIds: [focalId] }), "CONTROL");
  const demand = vai1(trusted("vai:demand", "Demand", {
    value: extras?.demandValue === undefined ? 800 : extras.demandValue,
    unit: extras?.demandUnit ?? "units/day",
    relatedObjectIds: [focalId],
  }), "LEVER");
  const throughput = vai1(trusted("vai:throughput", "Throughput", {
    value: 1000,
    unit: "units/day",
    relatedObjectIds: [focalId],
  }), "OUTCOME");
  const variables = extras?.includeDemand
    ? [staffing, capacity, otd, backlog, season, machine, shift, demand, throughput]
    : [staffing, capacity, otd, backlog, season, machine, shift, throughput];
  const roleResult = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId,
      purpose: "WHAT_CAN_MANAGEMENT_CHANGE",
      focalObjectId: focalId,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: variables.map((item) => item.variableId),
    },
    variables,
    roleEvidence: [
      { variableId: "vai:staffing", role: "LEVER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "staff" },
      { variableId: "vai:capacity", role: "LEVER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "cap" },
      { variableId: "vai:otd", role: "OUTCOME", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "otd" },
      { variableId: "vai:backlog", role: "PATH_OF_EFFECT", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "path" },
      { variableId: "vai:seasonality", role: "CONFOUNDER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "season" },
      { variableId: "vai:machine", role: "MODERATOR", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "mod" },
      { variableId: "vai:shift", role: "CONTROL", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "ctrl" },
      { variableId: "vai:throughput", role: "OUTCOME", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "tp" },
      ...(extras?.includeDemand
        ? [{ variableId: "vai:demand", role: "LEVER" as const, status: "SUPPORTED" as const, basis: "OBJECT_ATTRIBUTE" as const, sourceRef: "dem" }]
        : []),
    ],
  });
  const baseRelationship = resolveVaiCausalSafety({
    relationshipId: "rel-staff-otd",
    analysisContextId,
    source: staffing,
    target: { kind: "VARIABLE", id: "vai:otd", variable: otd },
    evidence: [ev("a1"), ev("a2")],
    scope: { objectScope: focalId },
    vai2: {
      sourceRole: roleResult.items.find((item) => item.variableId === "vai:staffing"),
      confounders: roleResult.items.filter((item) => item.primaryRole === "CONFOUNDER"),
      moderators: roleResult.items.filter((item) => item.primaryRole === "MODERATOR"),
      pathOfEffect: roleResult.items.filter((item) => item.primaryRole === "PATH_OF_EFFECT"),
    },
  }).relationship;
  const relationship: VaiAnalyticalRelationship | null = extras?.causal
    ? Object.freeze({ ...baseRelationship, evidenceSupportedCausal: true as const, relationshipStatus: "EVIDENCE_SUPPORTED_CAUSAL" })
    : baseRelationship;
  return {
    variables,
    bundle: {
      analysisContextId,
      focalObject: { id: focalId, label: extras?.focalLabel ?? "Capacity Gap" },
      variables,
      roleResult,
      relationship,
    },
  };
}

function viewOf(experiment: NonNullable<ReturnType<typeof createVaiWhatIfExperiment>["experiment"]>, id: string) {
  return experiment.views.find((item) => item.variableId === id);
}

function staffingModel(overrides: Partial<VaiTrustedQuantitativeModel> = {}): VaiTrustedQuantitativeModel {
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
    ...overrides,
  };
}

test("VAI:7 reuses VAI:1–6 without a parallel authority", () => {
  assert.equal(verifyVaiFoundation().ok, true);
  assert.equal(verifyVaiObjectRoleResolution().ok, true);
  assert.equal(verifyVaiCausalSafety().ok, true);
  assert.equal(verifyVaiAdvisorAnalysis().ok, true);
  assert.equal(verifyVaiTheatreSymbolLanguage().ok, true);
  assert.equal(verifyVaiImpactScene().ok, true);
  assert.equal(verifyVaiWhatIfAnalysis().ok, true);
  assert.equal(VAI_WHAT_IF_BOUNDARY.secondScenarioAuthority, false);
  assert.equal(VAI_WHAT_IF_BOUNDARY.optimization, false);
  assert.equal(VAI_WHAT_IF_BOUNDARY.startsVai8, false);
});

test("A — Simple assumption overlays staffing without mutating canonical value", () => {
  const { variables, bundle } = bundleOf();
  const before = JSON.stringify(variables.find((item) => item.variableId === "vai:staffing"));
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-a",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  assert.equal(viewOf(experiment!, "vai:staffing")?.experimentValue, 110);
  assert.equal(viewOf(experiment!, "vai:staffing")?.resultClass, "DETERMINISTIC_CALCULATION");
  assert.equal(JSON.stringify(variables.find((item) => item.variableId === "vai:staffing")), before);
  assert.equal(experiment!.dataRealityWritten, false);
  assert.equal(experiment!.createdFrom, "MANAGER_INTERACTION");
});

test("B — Unknown baseline is not invented", () => {
  const { bundle } = bundleOf({ staffingValue: null });
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-b",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const staffing = viewOf(experiment!, "vai:staffing");
  assert.equal(staffing?.baselineKnown, false);
  assert.equal(staffing?.experimentValue, null);
  assert.equal(staffing?.resultClass, "UNKNOWN_BASELINE");
  assert.notEqual(staffing?.experimentValue, 100);
  assert.notEqual(staffing?.experimentValue, 0);
});

test("C — Deterministic arithmetic is not prediction", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-c",
    changes: [{ variableId: "vai:capacity", operator: "increase-percent", value: 10 }],
  });
  const capacity = viewOf(experiment!, "vai:capacity");
  assert.equal(capacity?.experimentValue, 1100);
  assert.equal(capacity?.resultClass, "DETERMINISTIC_CALCULATION");
  assert.notEqual(capacity?.resultClass, "MODEL_ESTIMATE");
});

test("D — Unsupported outcome prediction invents no OTD number", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-d",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const otd = viewOf(experiment!, "vai:otd");
  assert.equal(otd?.experimentDisplay, "Unknown");
  assert.equal(otd?.experimentValue, null);
  assert.equal(otd?.resultClass, "UNSUPPORTED_PREDICTION");
});

test("E — Causal support is not an effect size", () => {
  const { bundle } = bundleOf({ causal: true });
  assert.equal(bundle.relationship?.evidenceSupportedCausal, true);
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-e",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  assert.equal(viewOf(experiment!, "vai:otd")?.experimentValue, null);
  assert.equal(viewOf(experiment!, "vai:otd")?.resultClass, "UNSUPPORTED_PREDICTION");
  assert.match(viewOf(experiment!, "vai:otd")?.reason ?? "", /effect size/);
});

test("F — Trusted model estimate keeps provenance, scope, and uncertainty", () => {
  const { bundle } = bundleOf();
  const model = staffingModel();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-f",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
    models: [model],
    requestedScope: { businessContext: "Plant A" },
  });
  const otd = viewOf(experiment!, "vai:otd");
  assert.equal(otd?.resultClass, "MODEL_ESTIMATE");
  assert.equal(otd?.experimentDisplay, "93–95");
  assert.deepEqual(experiment!.modelIdsUsed, ["model-staffing-otd"]);
  assert.equal(experiment!.outcomeWritten, false);
});

test("G — Model scope failure blocks the estimate", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-g",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
    models: [staffingModel()],
    requestedScope: { businessContext: "Plant B" },
  });
  assert.equal(viewOf(experiment!, "vai:otd")?.resultClass, "SCOPE_BLOCKED");
  assert.equal(viewOf(experiment!, "vai:otd")?.experimentValue, null);
});

test("H — Unit mismatch blocks unsafe calculation", () => {
  const { bundle } = bundleOf({ staffingUnit: "units/day" });
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-h",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
    models: [staffingModel({ sourceUnit: "units/week" })],
    requestedScope: { businessContext: "Plant A" },
  });
  assert.equal(viewOf(experiment!, "vai:otd")?.resultClass, "UNIT_BLOCKED");
  assert.equal(viewOf(experiment!, "vai:otd")?.experimentValue, null);
});

test("I — Missing values are not treated as zero", () => {
  const { bundle } = bundleOf({ otdValue: null });
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-i",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
    models: [staffingModel()],
    requestedScope: { businessContext: "Plant A" },
  });
  const otd = viewOf(experiment!, "vai:otd");
  assert.equal(otd?.resultClass, "MISSING_INPUT");
  assert.notEqual(otd?.experimentValue, 0);
});

test("J — LEVER starts a temporary experiment only", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-j",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  assert.equal(experiment!.isScenario, false);
  assert.equal(experiment!.isExecutiveObject, false);
  assert.equal(experiment!.scenarioCreated, false);
  assert.equal(experiment!.decisionApproved, false);
  assert.equal(experiment!.executionStarted, false);
  const theatre = projectVaiWhatIfTheatre({ experiment, selectedLeverId: "vai:staffing" });
  assert.equal(theatre.boundedLeverAction, "Explore change");
  assert.equal(theatre.createsExperimentOnLeverSelect, false);
});

test("K — CONTROL remains held constant without canonical mutation", () => {
  const { variables, bundle } = bundleOf();
  const before = JSON.stringify(variables.find((item) => item.variableId === "vai:shift"));
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-k",
    changes: [
      { variableId: "vai:staffing", operator: "increase-percent", value: 10 },
      { variableId: "vai:shift", operator: "hold", value: null },
    ],
  });
  const shift = viewOf(experiment!, "vai:shift");
  assert.equal(shift?.experimentValue, 8);
  assert.equal(experiment!.assumptions.find((item) => item.variableId === "vai:shift")?.heldConstant, true);
  assert.equal(JSON.stringify(variables.find((item) => item.variableId === "vai:shift")), before);
});

test("L — Moderator without quantitative model preserves uncertainty", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-l",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const machine = viewOf(experiment!, "vai:machine");
  assert.equal(machine?.experimentValue, null);
  assert.match(machine?.reason ?? "", /quantitative effect is not established/);
  assert.ok(experiment!.uncertainty.some((item) => /Machine Availability/.test(item)));
});

test("M — Unresolved confounder remains visible", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-m",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  assert.ok(experiment!.confounders.includes("Seasonality"));
  assert.ok(experiment!.uncertainty.some((item) => /Seasonality/.test(item)));
});

test("N — Path of effect does not propagate unsupported numbers", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-n",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const backlog = viewOf(experiment!, "vai:backlog");
  assert.equal(backlog?.experimentDisplay, "Unknown");
  assert.equal(backlog?.visualPropagation, "none");
  assert.equal(backlog?.resultClass, "UNSUPPORTED_PREDICTION");
});

test("O — Multiple assumptions stay explicit; interaction remains unknown", () => {
  const { bundle } = bundleOf({ includeDemand: true });
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-o",
    changes: [
      { variableId: "vai:staffing", operator: "increase-percent", value: 10 },
      { variableId: "vai:demand", operator: "increase-percent", value: 15 },
    ],
  });
  assert.equal(experiment!.assumptions.length, 2);
  assert.equal(experiment!.assumptions[0]?.assumedValue, 110);
  assert.equal(experiment!.assumptions[1]?.assumedValue, 920);
  assert.equal(viewOf(experiment!, "vai:otd")?.resultClass, "UNSUPPORTED_PREDICTION");
  assert.match(viewOf(experiment!, "vai:otd")?.reason ?? "", /Combined effects/);
});

test("P — Theatre distinguishes current and what-if states", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-p",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const scene = composeVaiImpactScene({ bundle });
  const theatre = projectVaiWhatIfTheatre({ experiment, scene });
  const staffing = theatre.rows.find((row) => row.variableId === "vai:staffing");
  const otd = theatre.rows.find((row) => row.variableId === "vai:otd");
  assert.equal(staffing?.currentLabel, "CURRENT / BASELINE");
  assert.equal(staffing?.whatIfLabel, "WHAT-IF / ASSUMED");
  assert.equal(staffing?.baselineDisplay, "100");
  assert.equal(staffing?.experimentDisplay, "110");
  assert.equal(otd?.baselineDisplay, "91");
  assert.equal(otd?.experimentDisplay, "Unknown");
  assert.equal(theatre.visuallyMerged, false);
  assert.equal(theatre.directorCalculated, false);
});

test("Q — Unsupported downstream variables are not animated", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-q",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const theatre = projectVaiWhatIfTheatre({ experiment });
  const backlog = theatre.rows.find((row) => row.variableId === "vai:backlog");
  assert.equal(backlog?.visualPropagation, "none");
  assert.equal(backlog?.animated, false);
  assert.equal(theatre.animatedUnsupported, false);
});

test("R — Experiment comparison does not select a winner", () => {
  const { bundle } = bundleOf();
  const first = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-a",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const second = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-b",
    session: first.session,
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 20 }],
  });
  const comparison = compareVaiWhatIfExperiments(second.session);
  assert.deepEqual(comparison.experimentIds, ["exp-a", "exp-b"]);
  assert.equal(comparison.winnerSelected, false);
  assert.equal(second.experiment!.winnerSelected, false);
});

test("S — Discard leaves canonical state intact", () => {
  const { variables, bundle } = bundleOf();
  const before = JSON.stringify(variables);
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-s",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const discarded = discardVaiWhatIfExperiment(created.session);
  assert.equal(discarded.activeExperimentId, null);
  assert.equal(Object.keys(discarded.experimentsById).length, 0);
  assert.equal(JSON.stringify(variables), before);
});

test("T — Session isolation across analysis contexts", () => {
  const capacity = bundleOf();
  const margin = bundleOf({ analysisContextId: "ctx-margin-vars", focalId: MARGIN, focalLabel: "Margin Pressure" });
  const first = createVaiWhatIfExperiment({
    bundle: capacity.bundle,
    experimentId: "exp-capacity",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const second = createVaiWhatIfExperiment({
    bundle: margin.bundle,
    experimentId: "exp-margin",
    session: first.session,
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 20 }],
  });
  assert.equal(second.session.analysisContextId, "ctx-margin-vars");
  assert.equal(second.session.experimentsById["exp-capacity"], undefined);
  assert.ok(second.session.experimentsById["exp-margin"]);
});

test("U — Advisor explains baseline, assumption, and unknown outcome", () => {
  const { bundle } = bundleOf();
  const result = composeVaiWhatIfAdvisor({
    utterance: "What if staffing increases 10%?",
    bundle,
  });
  assert.match(result.response ?? "", /Current staffing is 100/);
  assert.match(result.response ?? "", /assumed staffing level of 110/);
  assert.match(result.response ?? "", /OTD remains unknown/);
  assert.equal(result.experiment?.createdFromRequest, "What if staffing increases 10%?");
  assert.doesNotMatch(result.response ?? "", LEAK);
  assert.equal(result.secondAdvisor, false);
});

test("V — Why no prediction stays in manager language", () => {
  const { bundle } = bundleOf({ causal: true });
  const created = composeVaiWhatIfAdvisor({
    utterance: "What if staffing increases 10%?",
    bundle,
  });
  const result = composeVaiWhatIfAdvisor({
    utterance: "Why can't you predict it?",
    bundle,
    session: created.session,
  });
  assert.match(result.response ?? "", /quantitative relationship/);
  assert.doesNotMatch(result.response ?? "", LEAK);
});

test("W — Promote proposal does not write a Scenario", () => {
  const { bundle } = bundleOf();
  const created = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-w",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const proposal = proposeVaiWhatIfAsScenario(created.experiment);
  assert.equal(proposal?.writesScenario, false);
  assert.equal(proposal?.requiresExistingScenarioAuthority, true);
  assert.equal(proposal?.requiresExplicitManagerConfirmation, true);
  assert.equal(created.experiment!.scenarioCreated, false);
  const advised = composeVaiWhatIfAdvisor({
    utterance: "Make this a scenario.",
    bundle,
    session: created.session,
  });
  assert.equal(advised.proposal?.writesScenario, false);
});

test("X — Experiment interaction cannot approve a Decision", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-x",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  assert.equal(experiment!.decisionApproved, false);
  assert.equal(VAI_WHAT_IF_BOUNDARY.secondDecisionAuthority, false);
});

test("Y — Experiment interaction cannot start Execution", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-y",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  assert.equal(experiment!.executionStarted, false);
});

test("Z — Model estimate does not write observed Outcome", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-z",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
    models: [staffingModel()],
    requestedScope: { businessContext: "Plant A" },
  });
  assert.equal(viewOf(experiment!, "vai:otd")?.resultClass, "MODEL_ESTIMATE");
  assert.equal(experiment!.outcomeWritten, false);
});

test("AA — Assumption and estimate do not become Evidence", () => {
  const { bundle } = bundleOf();
  const { experiment } = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-aa",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
    models: [staffingModel()],
    requestedScope: { businessContext: "Plant A" },
  });
  assert.equal(experiment!.evidenceWritten, false);
});

test("AB — Missing VAI bundle invents no experiment model", () => {
  const { experiment, session } = createVaiWhatIfExperiment({
    bundle: null,
    experimentId: "exp-ab",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  assert.equal(experiment, null);
  assert.equal(session.activeExperimentId, null);
  const scene = composeVaiImpactScene({ bundle: null });
  assert.equal(scene.apply, false);
  const advised = composeVaiWhatIfAdvisor({
    utterance: "What if staffing increases 10%?",
    bundle: null,
  });
  assert.equal(advised.apply, false);
  assert.equal(advised.experiment, null);
});

test("AC — Mutation safety across create, compare, and discard", () => {
  const { variables, bundle } = bundleOf({ includeDemand: true });
  const beforeVars = JSON.stringify(variables);
  const catalogBefore = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const first = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-ac-a",
    changes: [{ variableId: "vai:staffing", operator: "increase-percent", value: 10 }],
  });
  const second = createVaiWhatIfExperiment({
    bundle,
    experimentId: "exp-ac-b",
    session: first.session,
    changes: [{ variableId: "vai:demand", operator: "increase-percent", value: 15 }],
  });
  compareVaiWhatIfExperiments(second.session);
  discardVaiWhatIfExperiment(second.session);
  assert.equal(JSON.stringify(variables), beforeVars);
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalogBefore);
  assert.equal(VAI_WHAT_IF_BOUNDARY.monteCarlo, false);
  assert.equal(VAI_WHAT_IF_BOUNDARY.causalGraphAuthority, false);
  const diagnostics = formatVaiWhatIfDiagnostics({ experiment: first.experiment, causalStatus: bundle.relationship?.causalStatus ?? null });
  assert.equal(diagnostics.experimentId, "exp-ac-a");
  assert.ok(diagnostics.calculationClassification.some((item) => /DETERMINISTIC_CALCULATION/.test(item)));
});

test("CC:5 overlay reuses Advisor without a second engine", () => {
  const { bundle } = bundleOf();
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
    utterance: "What if staffing increases 10%?",
    conversationContext: Object.freeze({
      currentSubjectId: CAPACITY,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "problem",
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: state,
    catalog,
    vaiAdvisorBundle: bundle,
    messageIdSeed: "vai7-overlay",
  });
  assert.match(turn.response, /Current staffing is 100/);
  assert.match(turn.response, /OTD remains unknown/);
  assert.doesNotMatch(turn.response, LEAK);
  assert.equal(turn.vaiWhatIfExperiment?.isScenario, false);
  assert.equal(turn.vaiWhatIfTheatre?.visuallyMerged, false);
  assert.equal(composeVaiAdvisorAnalysis({ utterance: "What variables matter here?", bundle }).apply, true);
});
