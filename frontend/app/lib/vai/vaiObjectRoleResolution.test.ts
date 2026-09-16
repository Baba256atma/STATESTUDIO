/**
 * NPA-T VAI:2 — Object–Variable Role Resolution tests A–L.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { VAI_CONTEXTUAL_ROLES } from "./vaiContract.ts";
import { formatVaiObjectRoleDiagnostics } from "./vaiObjectRoleDiagnostics.ts";
import { VAI_OBJECT_ROLE_BOUNDARY } from "./vaiObjectRoleContract.ts";
import {
  resolveVaiObjectVariableRoles,
  verifyVaiObjectRoleResolution,
} from "./vaiObjectRoleResolver.ts";
import { resolveVaiVariables, type VaiCsvFieldSource, type VaiTrustedObservationSource } from "./vaiResolver.ts";
import { verifyVaiFoundation } from "./vaiFoundation.ts";
import type { VaiVariable } from "./vaiContract.ts";

const CAPACITY = "ctx-problem-capacity";

function trusted(
  variableId: string,
  displayName: string,
  extras: Partial<VaiTrustedObservationSource> = {},
): VaiTrustedObservationSource {
  return {
    kind: "TRUSTED_OBSERVATION",
    variableId,
    displayName,
    sourceKind: "OBJECT_ATTRIBUTE",
    authority: "MO:1",
    sourceRef: `attr:${variableId}`,
    semanticStatus: "CONFIRMED",
    semanticMeaning: displayName,
    relatedObjectIds: [CAPACITY],
    ...extras,
  };
}

function vai1(source: VaiTrustedObservationSource | VaiCsvFieldSource): VaiVariable {
  const result = resolveVaiVariables({
    analysisContext: { analysisContextId: "vai1-projection" },
    applications: [{ source, role: "CONTROL" }],
  });
  return result.variables[0]!;
}

test("VAI:2 boundary reuses VAI:1 without a parallel store", () => {
  assert.equal(verifyVaiFoundation().ok, true);
  assert.equal(verifyVaiObjectRoleResolution().ok, true);
  assert.equal(VAI_OBJECT_ROLE_BOUNDARY.consumesVai1, true);
  assert.equal(VAI_OBJECT_ROLE_BOUNDARY.parallelVariableStore, false);
  assert.deepEqual([...VAI_CONTEXTUAL_ROLES].length, 6);
});

test("A — Problem + Lever: Staffing Level can resolve as LEVER for Capacity Gap", () => {
  const staffing = vai1(trusted("vai:staffing", "Staffing Level"));
  const result = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-change-capacity",
      purpose: "WHAT_CAN_MANAGEMENT_CHANGE",
      purposeNote: "What can management change to reduce Capacity Gap?",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:staffing"],
    },
    variables: [staffing],
    roleEvidence: [{
      variableId: "vai:staffing",
      role: "LEVER",
      status: "SUPPORTED",
      basis: "OBJECT_ATTRIBUTE",
      sourceRef: "attr:staffing-controllable",
    }],
  });
  const item = result.items[0];
  assert.equal(item?.relevant, true);
  assert.equal(item?.primaryRole, "LEVER");
  assert.equal(item?.roleStatus, "SUPPORTED");
  assert.equal(item?.causalAssertion, false);
});

test("B — Context changes role: same Staffing identity can be CONTROL", () => {
  const staffing = vai1(trusted("vai:staffing", "Staffing Level"));
  const change = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-change",
      purpose: "WHAT_CAN_MANAGEMENT_CHANGE",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:staffing"],
    },
    variables: [staffing],
    roleEvidence: [{ variableId: "vai:staffing", role: "LEVER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "e-lever" }],
  });
  const hold = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-hold",
      purpose: "HOLD_STABLE_FOR_COMPARISON",
      purposeNote: "What factors should remain stable while comparing production methods?",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:staffing"],
    },
    variables: [staffing],
    roleEvidence: [{ variableId: "vai:staffing", role: "CONTROL", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "e-control" }],
  });
  assert.equal(change.items[0]?.variableId, hold.items[0]?.variableId);
  assert.equal(change.items[0]?.primaryRole, "LEVER");
  assert.equal(hold.items[0]?.primaryRole, "CONTROL");
  assert.equal(staffing.variableId, "vai:staffing");
});

test("C — KPI is not automatically OUTCOME", () => {
  const otd = vai1(trusted("vai:otd", "OTD %", {
    sourceKind: "KPI_OBSERVATION",
    authority: "existing KPI observation owners",
    sourceRef: "kpi:otd",
  }));
  const result = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-kpi",
      purpose: "UNSPECIFIED",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:otd"],
    },
    variables: [otd],
    relevanceLinks: [{
      variableId: "vai:otd",
      objectId: CAPACITY,
      basis: "KPI_ASSOCIATION",
      trusted: true,
      sourceRef: "kpi:otd",
    }],
  });
  assert.equal(result.items[0]?.relevant, true);
  assert.notEqual(result.items[0]?.primaryRole, "OUTCOME");
  assert.equal(result.items[0]?.roleStatus, "UNKNOWN");
  assert.equal(result.items[0]?.objectTypeDeterminedRole, false);
  assert.equal(result.items[0]?.focalObjectFamily, "PROBLEM");
});

test("D — Ambiguous role preserves LEVER and MODERATOR candidates", () => {
  const machine = vai1(trusted("vai:machine", "Machine Availability"));
  const result = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-machine",
      purpose: "WHY_WORSENING",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:machine"],
    },
    variables: [machine],
    roleEvidence: [
      { variableId: "vai:machine", role: "LEVER", status: "CANDIDATE", basis: "OBJECT_ATTRIBUTE", sourceRef: "e-lever" },
      { variableId: "vai:machine", role: "MODERATOR", status: "CANDIDATE", basis: "OBJECT_ATTRIBUTE", sourceRef: "e-mod" },
    ],
  });
  assert.equal(result.items[0]?.roleStatus, "AMBIGUOUS");
  assert.equal(result.items[0]?.primaryRole, null);
  assert.deepEqual(result.items[0]?.candidateRoles.map((item) => item.role).sort(), ["LEVER", "MODERATOR"]);
});

test("E — Unknown role remains UNKNOWN when relevant but unsupported", () => {
  const backlog = vai1(trusted("vai:backlog", "Backlog"));
  const result = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-unknown",
      purpose: "WHY_WORSENING",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:backlog"],
    },
    variables: [backlog],
  });
  assert.equal(result.items[0]?.relevant, true);
  assert.equal(result.items[0]?.roleStatus, "UNKNOWN");
  assert.equal(result.items[0]?.primaryRole, null);
});

test("F — Irrelevant Variable is not attached merely because it exists", () => {
  const revenue = vai1(trusted("vai:revenue", "Revenue", { relatedObjectIds: ["obj-finance"] }));
  const result = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-irrelevant",
      purpose: "WHY_WORSENING",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:revenue"],
    },
    variables: [revenue],
    relevanceLinks: [{
      variableId: "vai:revenue",
      objectId: CAPACITY,
      basis: "NAME_SIMILARITY",
      trusted: false,
      sourceRef: "name:gap",
    }],
  });
  assert.equal(result.items[0]?.relevant, false);
  assert.equal(result.items[0]?.relevanceStatus, "UNRESOLVED_CANDIDATE");
  assert.equal(result.items[0]?.primaryRole, null);
});

test("G — Unresolved CAP_AV does not gain a business role from invented meaning", () => {
  const capAv = vai1({
    kind: "CSV_FIELD",
    variableId: "vai:csv:CAP_AV",
    sourceColumn: "CAP_AV",
    fieldId: "field-cap-av",
    proposedMeaning: "Available Capacity",
    confirmedMeaning: null,
    confirmationSource: "none",
    semanticState: "AMBIGUOUS",
    sourceRef: "csv:CAP_AV",
    relatedObjectIds: [CAPACITY],
    requestedDisplayName: "Available Capacity",
  });
  const result = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-cap-av",
      purpose: "WHAT_CAN_MANAGEMENT_CHANGE",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:csv:CAP_AV"],
    },
    variables: [capAv],
    roleEvidence: [{
      variableId: "vai:csv:CAP_AV",
      role: "LEVER",
      status: "SUPPORTED",
      basis: "invented Available Capacity",
      sourceRef: "guess",
    }],
  });
  assert.equal(capAv.displayName, "CAP_AV");
  assert.equal(result.items[0]?.roleStatus, "UNKNOWN");
  assert.equal(result.items[0]?.primaryRole, null);
  assert.equal(result.items[0]?.reasonCodes.includes("SEMANTIC_UNRESOLVED"), true);
});

test("H — Manager-confirmed contextual role preserves provenance and scope", () => {
  const staffing = vai1(trusted("vai:staffing", "Staffing Level"));
  const result = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-manager-lever",
      purpose: "WHAT_CAN_MANAGEMENT_CHANGE",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:staffing"],
      managerConfirmedConstraints: [{
        variableId: "vai:staffing",
        role: "LEVER",
        sourceRef: "manager:treat-staffing-as-lever",
      }],
    },
    variables: [staffing],
  });
  assert.equal(result.items[0]?.primaryRole, "LEVER");
  assert.equal(result.items[0]?.roleStatus, "CONFIRMED");
  assert.match(result.items[0]?.provenance.join(" ") ?? "", /manager:treat-staffing-as-lever/);
  assert.equal(result.analysisContextId, "ctx-manager-lever");
});

test("I — Role resolution does not modify the canonical VAI:1 Variable", () => {
  const staffing = vai1(trusted("vai:staffing", "Staffing Level"));
  const before = JSON.stringify(staffing);
  resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-immut",
      purpose: "WHAT_CAN_MANAGEMENT_CHANGE",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:staffing"],
      managerConfirmedConstraints: [{ variableId: "vai:staffing", role: "LEVER", sourceRef: "mgr" }],
    },
    variables: [staffing],
  });
  assert.equal(JSON.stringify(staffing), before);
  assert.equal(staffing.role, "CONTROL");
  assert.equal(staffing.canonicalMutation, false);
});

test("J — No Object mutation", () => {
  const before = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const staffing = vai1(trusted("vai:staffing", "Staffing Level"));
  const result = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-objects",
      purpose: "WHAT_CAN_MANAGEMENT_CHANGE",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:staffing"],
      managerConfirmedConstraints: [{ variableId: "vai:staffing", role: "LEVER", sourceRef: "mgr" }],
    },
    variables: [staffing],
  });
  const after = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  assert.deepEqual(after, before);
  assert.equal(result.objectsCreated, false);
  assert.equal(result.canonicalMutation, false);
});

test("K — No causal promotion", () => {
  const staffing = vai1(trusted("vai:staffing", "Staffing Level"));
  const result = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-causal",
      purpose: "WHY_WORSENING",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:staffing"],
    },
    variables: [staffing],
    roleEvidence: [{ variableId: "vai:staffing", role: "LEVER", status: "SUPPORTED", basis: "OBJECT_ATTRIBUTE", sourceRef: "e" }],
  });
  assert.equal(result.causalAssertion, false);
  assert.equal(result.items[0]?.causalAssertion, false);
  const diagnostics = formatVaiObjectRoleDiagnostics(result);
  assert.equal(diagnostics[0]?.causalAssertion, false);
  assert.equal(VAI_OBJECT_ROLE_BOUNDARY.startsVai3, false);
});

test("L — Conflicting supported roles are preserved", () => {
  const staffing = vai1(trusted("vai:staffing", "Staffing Level"));
  const result = resolveVaiObjectVariableRoles({
    context: {
      analysisContextId: "ctx-conflict",
      purpose: "UNSPECIFIED",
      focalObjectId: CAPACITY,
      focalObjectFamily: "PROBLEM",
      availableVariableIds: ["vai:staffing"],
      managerConfirmedConstraints: [{
        variableId: "vai:staffing",
        role: "CONTROL",
        sourceRef: "manager:staffing-control",
      }],
    },
    variables: [staffing],
    roleEvidence: [{
      variableId: "vai:staffing",
      role: "LEVER",
      status: "SUPPORTED",
      basis: "OBJECT_ATTRIBUTE",
      sourceRef: "analytic:staffing-lever",
    }],
  });
  assert.equal(result.items[0]?.conflict, true);
  assert.equal(result.items[0]?.roleStatus, "CONFLICTING");
  assert.equal(result.items[0]?.primaryRole, null);
  const roles = result.items[0]?.candidateRoles.map((item) => item.role).sort();
  assert.deepEqual(roles, ["CONTROL", "LEVER"]);
});
