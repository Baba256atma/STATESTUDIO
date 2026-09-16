/**
 * NPA-T VAI:1 — Variable Intelligence Foundation tests A–J.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { MANAGER_OBJECT_KINDS } from "@/app/lib/manager-object/managerObjectInteractionFoundation.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { VAI_AUTHORITY_BOUNDARY } from "./vaiAuthorityBoundary.ts";
import { VAI_CONTEXTUAL_ROLES, VAI_FOUNDATION_CONTRACT } from "./vaiContract.ts";
import { formatVaiResolveDiagnostics } from "./vaiDiagnostics.ts";
import { verifyVaiFoundation } from "./vaiFoundation.ts";
import { resolveVaiVariables, type VaiCsvFieldSource, type VaiTrustedObservationSource } from "./vaiResolver.ts";

const CAPACITY_PROBLEM = "ctx-problem-capacity";

function demand(overrides: Partial<VaiTrustedObservationSource> = {}): VaiTrustedObservationSource {
  return {
    kind: "TRUSTED_OBSERVATION",
    variableId: "vai:demand",
    displayName: "Demand",
    sourceKind: "KPI_OBSERVATION",
    authority: "existing KPI observation owners",
    sourceRef: "kpi:demand",
    semanticStatus: "CONFIRMED",
    semanticMeaning: "Demand",
    value: 105,
    unit: "orders",
    relatedObjectIds: [CAPACITY_PROBLEM],
    ...overrides,
  };
}

function capAv(overrides: Partial<VaiCsvFieldSource> = {}): VaiCsvFieldSource {
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
    relatedObjectIds: [CAPACITY_PROBLEM],
    requestedDisplayName: "Available Capacity",
    ...overrides,
  };
}

test("A — Variable foundation: a legitimate known concept resolves as a Variable", () => {
  assert.equal(verifyVaiFoundation().ok, true);
  const result = resolveVaiVariables({
    analysisContext: { analysisContextId: "analysis-capacity-gap" },
    applications: [{ source: demand(), role: "LEVER" }],
  });
  const variable = result.variables[0];
  assert.ok(variable);
  assert.equal(variable.variableId, "vai:demand");
  assert.equal(variable.displayName, "Demand");
  assert.equal(variable.value.kind, "KNOWN");
  assert.equal(variable.isExecutiveObject, false);
});

test("B — Object boundary: resolving a Variable creates no executive Object", () => {
  const before = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const result = resolveVaiVariables({
    analysisContext: { analysisContextId: "analysis-objects" },
    applications: [{ source: demand(), role: "PATH_OF_EFFECT" }],
  });
  const after = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  assert.deepEqual(after, before);
  assert.equal(result.objectsCreated, false);
  assert.equal(result.variables[0]?.objectKind, null);
  assert.equal(MANAGER_OBJECT_KINDS.includes("unknown"), true);
  assert.equal(result.variables[0]?.isExecutiveObject, false);
});

test("C — Contextual role: same Variable may be LEVER then CONTROL", () => {
  const lever = resolveVaiVariables({
    analysisContext: { analysisContextId: "ctx-staffing-change" },
    applications: [{
      source: demand({
        variableId: "vai:staffing",
        displayName: "Staffing Level",
        semanticMeaning: "Staffing Level",
        sourceRef: "attr:staffing",
        sourceKind: "OBJECT_ATTRIBUTE",
        value: null,
        unit: null,
      }),
      role: "LEVER",
    }],
  });
  const control = resolveVaiVariables({
    analysisContext: { analysisContextId: "ctx-staffing-held" },
    applications: [{
      source: demand({
        variableId: "vai:staffing",
        displayName: "Staffing Level",
        semanticMeaning: "Staffing Level",
        sourceRef: "attr:staffing",
        sourceKind: "OBJECT_ATTRIBUTE",
        value: null,
        unit: null,
      }),
      role: "CONTROL",
    }],
  });
  assert.equal(lever.variables[0]?.variableId, control.variables[0]?.variableId);
  assert.equal(lever.variables[0]?.role, "LEVER");
  assert.equal(control.variables[0]?.role, "CONTROL");
  assert.equal(lever.variables[0]?.roleIsPermanentClassification, false);
  assert.deepEqual([...VAI_CONTEXTUAL_ROLES], [
    "LEVER",
    "OUTCOME",
    "PATH_OF_EFFECT",
    "MODERATOR",
    "CONTROL",
    "CONFOUNDER",
  ]);
});

test("D — Unknown value remains UNKNOWN", () => {
  const result = resolveVaiVariables({
    analysisContext: { analysisContextId: "analysis-unknown-value" },
    applications: [{ source: demand({ value: null }), role: "OUTCOME" }],
  });
  assert.equal(result.variables[0]?.value.kind, "UNKNOWN");
});

test("E — Unknown direction remains UNKNOWN", () => {
  const result = resolveVaiVariables({
    analysisContext: { analysisContextId: "analysis-unknown-direction" },
    applications: [{ source: demand({ direction: null }), role: "OUTCOME" }],
  });
  assert.equal(result.variables[0]?.direction, "UNKNOWN");
});

test("F — Ambiguous semantics: CAP_AV does not become Available Capacity", () => {
  const result = resolveVaiVariables({
    analysisContext: { analysisContextId: "analysis-cap-av" },
    applications: [{ source: capAv(), role: "LEVER" }],
  });
  const variable = result.variables[0];
  assert.equal(variable?.displayName, "CAP_AV");
  assert.equal(variable?.semanticMeaning, null);
  assert.equal(variable?.semanticStatus, "AMBIGUOUS");
  assert.notEqual(variable?.displayName, "Available Capacity");
});

test("G — Provenance preserves original source/evidence reference", () => {
  const result = resolveVaiVariables({
    analysisContext: { analysisContextId: "analysis-evidence" },
    applications: [{
      source: demand({
        sourceKind: "EVIDENCE",
        authority: "CC:8",
        sourceRef: "evidence:obs-demand-18",
      }),
      role: "LEVER",
    }],
  });
  assert.equal(result.variables[0]?.provenance.sourceRef, "evidence:obs-demand-18");
  assert.equal(result.variables[0]?.provenance.authority, "CC:8");
  const diagnostics = formatVaiResolveDiagnostics(result);
  assert.match(diagnostics[0]?.provenance ?? "", /evidence:obs-demand-18/);
});

test("H — Causal safety: Variable association is not a causal assertion", () => {
  const result = resolveVaiVariables({
    analysisContext: { analysisContextId: "analysis-association" },
    applications: [
      { source: demand(), role: "LEVER" },
      {
        source: demand({
          variableId: "vai:capacity-gap-lens",
          displayName: "Capacity Gap",
          sourceKind: "OBJECT_ATTRIBUTE",
          sourceRef: CAPACITY_PROBLEM,
          semanticMeaning: "Capacity Gap",
          value: null,
          unit: null,
          relatedObjectIds: [CAPACITY_PROBLEM],
        }),
        role: "OUTCOME",
      },
    ],
  });
  assert.equal(result.causalAssertion, false);
  assert.equal(result.variables[0]?.causalAssertion, false);
  assert.equal(result.variables[0]?.causalClaim, null);
  assert.equal(result.variables[1]?.relatedObjectIds.includes(CAPACITY_PROBLEM), true);
});

test("I — Mutation safety: resolution does not mutate canonical input or catalog", () => {
  const source = demand();
  const applications = [{ source, role: "MODERATOR" as const }];
  const snapshot = JSON.stringify({ source, applications, catalog: getDefaultNexoraMVPObjectInteractionCatalog().objects.length });
  const result = resolveVaiVariables({
    analysisContext: { analysisContextId: "analysis-mutation" },
    applications,
  });
  assert.equal(result.canonicalMutation, false);
  assert.equal(JSON.stringify({ source, applications, catalog: getDefaultNexoraMVPObjectInteractionCatalog().objects.length }), snapshot);
  assert.equal(VAI_FOUNDATION_CONTRACT.createsObjects, false);
});

test("J — Existing authority parity: manager-confirmed meaning outranks analytical labels", () => {
  const unresolved = resolveVaiVariables({
    analysisContext: { analysisContextId: "analysis-unconfirmed" },
    applications: [{ source: capAv(), role: "CONTROL" }],
  });
  const confirmed = resolveVaiVariables({
    analysisContext: { analysisContextId: "analysis-confirmed" },
    applications: [{
      source: capAv({
        confirmedMeaning: "Available Capacity",
        confirmationSource: "manager",
        semanticState: "UNDERSTOOD",
        requestedDisplayName: "Plant Loading",
      }),
      role: "CONTROL",
    }],
  });
  assert.equal(unresolved.variables[0]?.displayName, "CAP_AV");
  assert.equal(confirmed.variables[0]?.displayName, "Available Capacity");
  assert.equal(confirmed.variables[0]?.semanticStatus, "MANAGER_CONFIRMED");
  assert.equal(confirmed.variables[0]?.provenance.sourceKind, "MANAGER_CONFIRMED_SEMANTICS");
  assert.equal(VAI_AUTHORITY_BOUNDARY.parallelSemanticAuthority, false);
});
