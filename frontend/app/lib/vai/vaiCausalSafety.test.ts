/**
 * NPA-T VAI:3 — Evidence & Causal Safety tests A–O.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { formatVaiCausalDiagnostics } from "./vaiCausalDiagnostics.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "./vaiCausalContract.ts";
import {
  relationshipAppliesToScope,
  resolveVaiCausalSafety,
  verifyVaiCausalSafety,
} from "./vaiCausalResolver.ts";
import { resolveVaiObjectVariableRoles, verifyVaiObjectRoleResolution } from "./vaiObjectRoleResolver.ts";
import { resolveVaiVariables, type VaiCsvFieldSource, type VaiTrustedObservationSource } from "./vaiResolver.ts";
import { verifyVaiFoundation } from "./vaiFoundation.ts";
import type { VaiVariable } from "./vaiContract.ts";
import type { VaiRelationshipEvidenceRef } from "./vaiCausalContract.ts";

const CAPACITY = "ctx-problem-capacity";
const SCOPE_A = Object.freeze({ businessContext: "Plant A", timeContext: "Q2", objectScope: CAPACITY });

function trusted(variableId: string, displayName: string, extras: Partial<VaiTrustedObservationSource> = {}): VaiTrustedObservationSource {
  return {
    kind: "TRUSTED_OBSERVATION",
    variableId,
    displayName,
    sourceKind: "KPI_OBSERVATION",
    authority: "existing KPI observation owners",
    sourceRef: `kpi:${variableId}`,
    semanticStatus: "CONFIRMED",
    semanticMeaning: displayName,
    relatedObjectIds: [CAPACITY],
    ...extras,
  };
}

function vai1(source: VaiTrustedObservationSource | VaiCsvFieldSource): VaiVariable {
  return resolveVaiVariables({
    analysisContext: { analysisContextId: "vai1" },
    applications: [{ source, role: "CONTROL" }],
  }).variables[0]!;
}

function ev(id: string, kind: VaiRelationshipEvidenceRef["kind"], polarity: VaiRelationshipEvidenceRef["polarity"] = "SUPPORTING"): VaiRelationshipEvidenceRef {
  return { evidenceRef: id, kind, polarity, authority: "CC:8" };
}

function base(source: VaiVariable, extras: Partial<Parameters<typeof resolveVaiCausalSafety>[0]> = {}) {
  return resolveVaiCausalSafety({
    relationshipId: "rel-1",
    analysisContextId: "ctx-plant-a-q2",
    source,
    target: { kind: "VARIABLE", id: "vai:delay" },
    evidence: [],
    scope: SCOPE_A,
    ...extras,
  });
}

test("VAI:3 reuses VAI:1/VAI:2 and CORE-INT:3 without a parallel causal store", () => {
  assert.equal(verifyVaiFoundation().ok, true);
  assert.equal(verifyVaiObjectRoleResolution().ok, true);
  assert.equal(verifyVaiCausalSafety().ok, true);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.causalImplicationOwner, "CORE-INT:3");
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.startsVai4, false);
});

test("A — Co-observation is not causality", () => {
  const demand = vai1(trusted("vai:demand", "Demand"));
  const result = base(demand, { evidence: [ev("obs-1", "CO_OBSERVATION")], target: { kind: "VARIABLE", id: "vai:delay", variable: vai1(trusted("vai:delay", "Delay")) } });
  assert.equal(result.relationship.relationshipStatus, "OBSERVED_TOGETHER");
  assert.notEqual(result.relationship.relationshipStatus, "EVIDENCE_SUPPORTED_CAUSAL");
  assert.equal(result.relationship.causalStatus, "UNCONFIRMED");
  assert.equal(result.relationship.causalAssertion, false);
  assert.equal(result.relationship.safeStatementClass, "OBSERVATION");
});

test("B — Strong association is still not causal", () => {
  const demand = vai1(trusted("vai:demand", "Demand"));
  const result = base(demand, {
    target: { kind: "VARIABLE", id: "vai:backlog", variable: vai1(trusted("vai:backlog", "Backlog")) },
    evidence: [ev("a1", "ASSOCIATION"), ev("a2", "ASSOCIATION"), ev("a3", "ASSOCIATION")],
  });
  assert.equal(result.relationship.relationshipStatus, "ASSOCIATED");
  assert.equal(result.relationship.associationStatus, "STRONG");
  assert.equal(result.relationship.causalStatus, "UNCONFIRMED");
  assert.equal(result.relationship.evidenceSupportedCausal, false);
});

test("C — Temporal precedence is not causal proof", () => {
  const machine = vai1(trusted("vai:machine", "Machine Availability"));
  const result = base(machine, {
    target: { kind: "VARIABLE", id: "vai:otd", variable: vai1(trusted("vai:otd", "OTD")) },
    evidence: [ev("t1", "TEMPORAL")],
  });
  assert.equal(result.relationship.temporalRelevance, true);
  assert.equal(result.relationship.directionStatus, "TEMPORAL_CONSISTENT");
  assert.equal(result.relationship.causalStatus, "UNCONFIRMED");
  assert.equal(result.relationship.reasonCodes.includes("TEMPORAL_RELEVANCE_NOT_CAUSE"), true);
});

test("D — Manager-asserted cause preserves provenance and is not independently confirmed", () => {
  const downtime = vai1(trusted("vai:downtime", "Machine downtime"));
  const result = base(downtime, {
    evidence: [ev("obs-2", "CO_OBSERVATION")],
    managerAssertion: {
      statement: "The delay is caused by machine downtime.",
      sourceRef: "manager:downtime-cause",
      assertedCauseVariableId: "vai:downtime",
    },
  });
  assert.equal(result.relationship.relationshipStatus, "MANAGER_ASSERTED_CAUSE");
  assert.equal(result.relationship.causalStatus, "MANAGER_ASSERTED");
  assert.equal(result.relationship.evidenceSupportedCausal, false);
  assert.match(result.relationship.provenance.join(" "), /manager:downtime-cause/);
  assert.equal(result.relationship.safeStatementClass, "MANAGER_ASSERTION");
});

test("E — Unresolved CONFOUNDER blocks causal promotion", () => {
  const demand = vai1(trusted("vai:demand", "Demand"));
  const season = vai1(trusted("vai:seasonality", "Seasonality"));
  const roles = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-confounder",
      purpose: "WHY_WORSENING",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:seasonality"],
    },
    variables: [season],
    roleEvidence: [{ variableId: "vai:seasonality", role: "CONFOUNDER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "season" }],
  });
  const result = base(demand, {
    evidence: [ev("a1", "ASSOCIATION"), ev("a2", "ASSOCIATION")],
    vai2: { confounders: roles.items },
  });
  assert.equal(result.relationship.causalStatus, "BOUNDED_UNRESOLVED");
  assert.equal(result.relationship.unresolvedConfounders.includes("Seasonality"), true);
  assert.equal(result.relationship.alternativeExplanations.includes("Seasonality"), true);
  assert.equal(result.relationship.evidenceSupportedCausal, false);
});

test("F — PATH_OF_EFFECT is a candidate pathway, not a mediator", () => {
  const demand = vai1(trusted("vai:demand", "Demand"));
  const backlog = vai1(trusted("vai:backlog", "Backlog"));
  const roles = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-path",
      purpose: "WHY_WORSENING",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:backlog"],
    },
    variables: [backlog],
    roleEvidence: [{ variableId: "vai:backlog", role: "PATH_OF_EFFECT", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "path" }],
  });
  const result = base(demand, {
    evidence: [ev("a1", "ASSOCIATION")],
    vai2: { pathOfEffect: roles.items },
  });
  assert.equal(result.relationship.pathOfEffectCandidate, true);
  assert.equal(result.relationship.mediationEstablished, false);
  assert.notEqual(result.relationship.relationshipStatus, "EVIDENCE_SUPPORTED_CAUSAL");
});

test("G — LEVER does not imply intervention effectiveness", () => {
  const staffing = vai1(trusted("vai:staffing", "Staffing Level", { sourceKind: "OBJECT_ATTRIBUTE" }));
  const roles = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-lever",
      purpose: "WHAT_CAN_MANAGEMENT_CHANGE",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:staffing"],
    },
    variables: [staffing],
    roleEvidence: [{ variableId: "vai:staffing", role: "LEVER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "lever" }],
  });
  const result = base(staffing, {
    evidence: [ev("a1", "ASSOCIATION")],
    vai2: { sourceRole: roles.items[0] },
  });
  assert.equal(result.relationship.leverIdentified, true);
  assert.equal(result.relationship.interventionEffectivenessClaimed, false);
  assert.equal(result.relationship.reasonCodes.includes("LEVER_NOT_INTERVENTION_EFFECT"), true);
});

test("H — Ambiguous CAP_AV cannot support an Available Capacity claim", () => {
  const capAv = vai1({
    kind: "CSV_FIELD",
    variableId: "vai:csv:CAP_AV",
    sourceColumn: "CAP_AV",
    fieldId: "cap-av",
    proposedMeaning: "Available Capacity",
    confirmedMeaning: null,
    confirmationSource: "none",
    semanticState: "AMBIGUOUS",
    sourceRef: "csv:CAP_AV",
    relatedObjectIds: [CAPACITY],
  });
  const result = base(capAv, { evidence: [ev("a1", "ASSOCIATION")] });
  assert.equal(capAv.displayName, "CAP_AV");
  assert.equal(result.relationship.relationshipStatus, "INSUFFICIENT");
  assert.equal(result.relationship.associationStatus, "NONE");
  assert.equal(result.relationship.semanticCertainty, "AMBIGUOUS");
  assert.equal(result.relationship.reasonCodes.includes("SEMANTIC_UNRESOLVED"), true);
});

test("I — Contradictory evidence is preserved", () => {
  const staffing = vai1(trusted("vai:staffing", "Staffing Level"));
  const result = base(staffing, {
    evidence: [ev("a-support", "ASSOCIATION", "SUPPORTING"), ev("a-contra", "ASSOCIATION", "CONFLICTING")],
  });
  assert.equal(result.relationship.associationStatus, "CONFLICTING");
  assert.equal(result.relationship.conflictingEvidence, true);
  assert.equal(result.relationship.causalStatus, "UNCONFIRMED");
  assert.equal(result.relationship.safeStatementClass, "CONFLICTING");
});

test("J — Plant A relationship is not generalized to Plant B", () => {
  const demand = vai1(trusted("vai:demand", "Demand"));
  const result = base(demand, { evidence: [ev("a1", "ASSOCIATION")] });
  assert.equal(relationshipAppliesToScope(result.relationship, SCOPE_A), true);
  assert.equal(relationshipAppliesToScope(result.relationship, { ...SCOPE_A, businessContext: "Plant B" }), false);
});

test("K — Unknown evidence remains INSUFFICIENT", () => {
  const demand = vai1(trusted("vai:demand", "Demand"));
  const result = base(demand);
  assert.equal(result.relationship.relationshipStatus, "INSUFFICIENT");
  assert.equal(result.relationship.associationStatus, "NONE");
  assert.equal(result.relationship.safeStatementClass, "INSUFFICIENT");
});

test("L — VAI:3 does not modify VAI:2 contextual roles", () => {
  const staffing = vai1(trusted("vai:staffing", "Staffing Level"));
  const roles = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-roles",
      purpose: "WHAT_CAN_MANAGEMENT_CHANGE",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:staffing"],
    },
    variables: [staffing],
    roleEvidence: [{ variableId: "vai:staffing", role: "LEVER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "lever" }],
  });
  const before = JSON.stringify(roles);
  base(staffing, { vai2: { sourceRole: roles.items[0] }, evidence: [ev("a1", "ASSOCIATION")] });
  assert.equal(JSON.stringify(roles), before);
  assert.equal(roles.items[0]?.primaryRole, "LEVER");
});

test("M — Mutation safety: Variables and Object catalog unchanged", () => {
  const demand = vai1(trusted("vai:demand", "Demand"));
  const catalogBefore = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const variableBefore = JSON.stringify(demand);
  const result = base(demand, { evidence: [ev("a1", "ASSOCIATION")] });
  assert.equal(JSON.stringify(demand), variableBefore);
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalogBefore);
  assert.equal(result.canonicalMutation, false);
});

test("N — Correlation, time, manager, role, and scenario each fail the causal gate", () => {
  const demand = vai1(trusted("vai:demand", "Demand"));
  const staffing = vai1(trusted("vai:staffing", "Staffing Level"));
  const correlation = base(demand, { evidence: [ev("a1", "ASSOCIATION"), ev("a2", "ASSOCIATION"), ev("a3", "ASSOCIATION")] });
  const temporal = base(demand, { evidence: [ev("t1", "TEMPORAL")] });
  const manager = base(demand, { managerAssertion: { statement: "Demand causes delay.", sourceRef: "mgr" } });
  const roles = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-n",
      purpose: "WHAT_CAN_MANAGEMENT_CHANGE",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:staffing"],
    },
    variables: [staffing],
    roleEvidence: [{ variableId: "vai:staffing", role: "LEVER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "lever" }],
  });
  const lever = base(staffing, { vai2: { sourceRole: roles.items[0] } });
  const scenario = base(demand, { evidence: [ev("s1", "SCENARIO_ASSUMPTION")] });
  for (const item of [correlation, temporal, manager, lever, scenario]) {
    assert.equal(item.relationship.evidenceSupportedCausal, false);
    assert.notEqual(item.relationship.relationshipStatus, "EVIDENCE_SUPPORTED_CAUSAL");
  }
});

test("O — EVIDENCE_SUPPORTED_CAUSAL requires the CORE-INT:3 gate and safety bounds", () => {
  const demand = vai1(trusted("vai:demand", "Demand"));
  const bundled = base(demand, {
    evidence: [ev("a1", "ASSOCIATION"), ev("a2", "ASSOCIATION"), ev("a3", "ASSOCIATION"), ev("t1", "TEMPORAL"), ev("s1", "SCENARIO_ASSUMPTION")],
    managerAssertion: { statement: "Demand causes delay.", sourceRef: "mgr" },
  });
  assert.equal(bundled.relationship.evidenceSupportedCausal, false);
  const gated = base(demand, {
    evidence: [ev("core", "ASSOCIATION")],
    coreInt3: { relationKind: "supported-causal", causeEstablished: true },
  });
  assert.equal(gated.relationship.evidenceSupportedCausal, true);
  assert.equal(gated.relationship.relationshipStatus, "EVIDENCE_SUPPORTED_CAUSAL");
  const season = vai1(trusted("vai:seasonality", "Seasonality"));
  const confounders = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-o",
      purpose: "WHY_WORSENING",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:seasonality"],
    },
    variables: [season],
    roleEvidence: [{ variableId: "vai:seasonality", role: "CONFOUNDER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "season" }],
  });
  const blocked = base(demand, {
    coreInt3: { relationKind: "supported-causal", causeEstablished: true },
    vai2: { confounders: confounders.items },
  });
  assert.equal(blocked.relationship.evidenceSupportedCausal, false);
  assert.equal(formatVaiCausalDiagnostics(gated.relationship).reasonCodes.includes("CORE_INT3_CAUSAL_GATE"), true);
});
