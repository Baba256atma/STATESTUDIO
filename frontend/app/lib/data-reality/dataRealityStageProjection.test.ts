/**
 * P0:5 — Data Reality → Stage projection adapter unit tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { resolveDatasetExecutiveReality } from "./dataRealityFoundation.ts";
import {
  DATA_REALITY_STAGE_PROJECTION_BOUNDARY,
  NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS,
  dataRealityStageProjectionIdentity,
  dataRealityStageProjectionVersion,
  getDataRealityStageIdentityBindings,
  getDataRealityStageProjectionIdentity,
  mapExecutiveStateToMvpRuntimeAttention,
  projectDataRealityToExecutiveRuntime,
  type NexoraDataRealityStageObjectProjection,
} from "./dataRealityStageProjection.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import { getExecutiveOperationsKpiDefinitions } from "./demo/executiveOperationsKPIDefinitions.ts";
import { getExecutiveOperationsResolvedObjectBindings } from "./demo/executiveOperationsObjectBindings.ts";
import { getExecutiveOperationsExecutiveStateRules } from "./demo/executiveOperationsExecutiveStateRules.ts";

const here = dirname(fileURLToPath(import.meta.url));

function snapshotFor(
  scenario: "baseline" | "operational-pressure",
) {
  const dataset =
    scenario === "operational-pressure"
      ? getExecutiveOperationsPressureDataset()
      : getExecutiveOperationsDemoDataset();
  return resolveDatasetExecutiveReality(dataset, {
    bindings: getExecutiveOperationsResolvedObjectBindings(),
    definitions: getExecutiveOperationsKpiDefinitions(),
    rules: getExecutiveOperationsExecutiveStateRules(),
  }).snapshot;
}

function projectionByStageId(
  projections: readonly NexoraDataRealityStageObjectProjection[],
  stageObjectId: string,
) {
  return projections.find((entry) => entry.stageObjectId === stageObjectId);
}

test("P0:5 identity and boundary", () => {
  const identity = getDataRealityStageProjectionIdentity();
  assert.equal(
    dataRealityStageProjectionIdentity,
    "P0:5/NexoraDataRealityStageProjection",
  );
  assert.equal(identity.id, "P0:5/NexoraDataRealityStageProjection");
  assert.equal(dataRealityStageProjectionVersion, "1.0.0");
  assert.equal(DATA_REALITY_STAGE_PROJECTION_BOUNDARY.ownsParallelRuntime, false);
  assert.equal(DATA_REALITY_STAGE_PROJECTION_BOUNDARY.projectsNolStatus, false);
  assert.equal(DATA_REALITY_STAGE_PROJECTION_BOUNDARY.projectsRexAttention, false);
  assert.equal(
    DATA_REALITY_STAGE_PROJECTION_BOUNDARY.consumesExistingMvpStatusAttention,
    true,
  );
  assert.equal(
    DATA_REALITY_STAGE_PROJECTION_BOUNDARY.mutatesSelectionFocus,
    false,
  );
});

test("Test 1 — Identity Registry has five Stage mappings; Cost absent", () => {
  const bindings = getDataRealityStageIdentityBindings();
  assert.equal(bindings.length, 5);
  assert.equal(bindings, NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS);
  assert.equal(
    bindings.some((binding) => binding.objectKey === "cost"),
    false,
  );
  assert.deepEqual(
    bindings.map((binding) => binding.mvpStageObjectId).sort(),
    [
      "obj-capacity",
      "obj-customer",
      "obj-delivery",
      "obj-inventory",
      "obj-revenue",
    ],
  );
});

test("Test 2 — Revenue mapping", () => {
  const binding = getDataRealityStageIdentityBindings().find(
    (entry) => entry.objectKey === "revenue",
  )!;
  assert.equal(
    binding.nexoraObjectId,
    "nexora.executive-operations.object.revenue",
  );
  assert.equal(binding.mvpStageObjectId, "obj-revenue");
});

test("Test 3 — Production mapping", () => {
  const binding = getDataRealityStageIdentityBindings().find(
    (entry) => entry.objectKey === "production",
  )!;
  assert.equal(
    binding.nexoraObjectId,
    "nexora.executive-operations.object.production",
  );
  assert.equal(binding.mvpStageObjectId, "obj-capacity");
  assert.equal(binding.alignment, "semantic-approximate");
});

test("Test 4 — Warehouse mapping", () => {
  const binding = getDataRealityStageIdentityBindings().find(
    (entry) => entry.objectKey === "warehouse",
  )!;
  assert.equal(binding.mvpStageObjectId, "obj-inventory");
});

test("Test 5 — Shipping mapping", () => {
  const binding = getDataRealityStageIdentityBindings().find(
    (entry) => entry.objectKey === "shipping",
  )!;
  assert.equal(binding.mvpStageObjectId, "obj-delivery");
});

test("Test 6 — Customer mapping", () => {
  const binding = getDataRealityStageIdentityBindings().find(
    (entry) => entry.objectKey === "customer",
  )!;
  assert.equal(binding.mvpStageObjectId, "obj-customer");
});

test("Test 7 — Dataset A Projection", () => {
  const result = projectDataRealityToExecutiveRuntime(snapshotFor("baseline"));
  assert.equal(result.status, "projected");
  assert.equal(result.projections.length, 5);

  assert.deepEqual(projectionByStageId(result.projections, "obj-revenue"), {
    stageObjectId: "obj-revenue",
    nexoraObjectId: "nexora.executive-operations.object.revenue",
    objectKey: "revenue",
    executiveState: "normal",
    mvpStatus: "stable",
    mvpAttention: "normal",
    reasons: projectionByStageId(result.projections, "obj-revenue")!.reasons,
  });
  assert.equal(
    projectionByStageId(result.projections, "obj-capacity")!.mvpAttention,
    "important",
  );
  assert.equal(
    projectionByStageId(result.projections, "obj-capacity")!.mvpStatus,
    "watch",
  );
  assert.equal(
    projectionByStageId(result.projections, "obj-inventory")!.executiveState,
    "attention",
  );
  assert.equal(
    projectionByStageId(result.projections, "obj-delivery")!.executiveState,
    "attention",
  );
  assert.equal(
    projectionByStageId(result.projections, "obj-customer")!.executiveState,
    "attention",
  );
});

test("Test 8 — Dataset B Projection", () => {
  const result = projectDataRealityToExecutiveRuntime(
    snapshotFor("operational-pressure"),
  );
  assert.equal(result.status, "projected");
  assert.equal(
    projectionByStageId(result.projections, "obj-revenue")!.executiveState,
    "attention",
  );
  assert.equal(
    projectionByStageId(result.projections, "obj-capacity")!.mvpAttention,
    "critical",
  );
  assert.equal(
    projectionByStageId(result.projections, "obj-capacity")!.mvpStatus,
    "risk",
  );
  assert.equal(
    projectionByStageId(result.projections, "obj-inventory")!.executiveState,
    "critical",
  );
  assert.equal(
    projectionByStageId(result.projections, "obj-delivery")!.executiveState,
    "critical",
  );
  assert.equal(
    projectionByStageId(result.projections, "obj-customer")!.executiveState,
    "critical",
  );
});

test("Test 9 — A/B identity stability", () => {
  const a = projectDataRealityToExecutiveRuntime(snapshotFor("baseline"));
  const b = projectDataRealityToExecutiveRuntime(
    snapshotFor("operational-pressure"),
  );
  assert.deepEqual(
    a.projections.map((p) => p.stageObjectId).sort(),
    b.projections.map((p) => p.stageObjectId).sort(),
  );
  assert.deepEqual(
    a.projections.map((p) => p.nexoraObjectId).sort(),
    b.projections.map((p) => p.nexoraObjectId).sort(),
  );
  assert.notDeepEqual(
    a.projections.map((p) => `${p.stageObjectId}:${p.executiveState}`).sort(),
    b.projections.map((p) => `${p.stageObjectId}:${p.executiveState}`).sort(),
  );
});

test("Test 10 — Reason preservation", () => {
  const result = projectDataRealityToExecutiveRuntime(
    snapshotFor("operational-pressure"),
  );
  const production = projectionByStageId(result.projections, "obj-capacity")!;
  assert.ok(production.reasons.length > 0);
  assert.equal(
    production.reasons[0]!.ruleId,
    "production-capacity-state-rule",
  );
  assert.equal(production.reasons[0]!.value, 96);
  assert.equal(production.reasons[0]!.state, "critical");
});

test("Test 11 — Unknown Stage mapping issue", () => {
  const snapshot = snapshotFor("baseline");
  const withUnmapped = Object.freeze({
    ...snapshot,
    objectStates: Object.freeze([
      ...snapshot.objectStates,
      Object.freeze({
        objectKey: "orphan",
        nexoraObjectId: "nexora.executive-operations.object.orphan",
        state: "critical" as const,
        reasons: Object.freeze([
          Object.freeze({
            kpiId: "kpi.orphan",
            kpiName: "Orphan",
            value: 1,
            unit: "%",
            state: "critical" as const,
            ruleId: "orphan-rule",
          }),
        ]),
      }),
    ]),
  });
  const result = projectDataRealityToExecutiveRuntime(withUnmapped);
  assert.equal(result.status, "partial");
  assert.ok(
    result.issues.some((issue) => issue.code === "UNMAPPED_STAGE_OBJECT"),
  );
  assert.equal(
    result.projections.some((p) => p.objectKey === "orphan"),
    false,
  );
});

test("Test 12 — No fake normal for unmapped", () => {
  const snapshot = snapshotFor("baseline");
  const onlyUnmapped = Object.freeze({
    ...snapshot,
    objectStates: Object.freeze([
      Object.freeze({
        objectKey: "cost",
        nexoraObjectId: "nexora.executive-operations.object.cost",
        state: "attention" as const,
        reasons: Object.freeze([
          Object.freeze({
            kpiId: "kpi.cost.fake",
            kpiName: "Fake",
            value: 1,
            unit: "%",
            state: "attention" as const,
            ruleId: "fake",
          }),
        ]),
      }),
    ]),
  });
  const result = projectDataRealityToExecutiveRuntime(onlyUnmapped);
  assert.equal(result.status, "invalid");
  assert.equal(result.projections.length, 0);
  assert.equal(
    result.projections.some((p) => p.mvpAttention === "normal"),
    false,
  );
});

test("Test 13 — Interaction independence (projection has no selection/focus fields)", () => {
  const result = projectDataRealityToExecutiveRuntime(snapshotFor("baseline"));
  for (const projection of result.projections) {
    assert.equal("selected" in projection, false);
    assert.equal("focused" in projection, false);
    assert.equal("selection" in projection, false);
  }
  assert.equal(
    DATA_REALITY_STAGE_PROJECTION_BOUNDARY.mutatesSelectionFocus,
    false,
  );
});

test("Test 14 — Determinism", () => {
  const snapshot = snapshotFor("baseline");
  const a = projectDataRealityToExecutiveRuntime(snapshot);
  const b = projectDataRealityToExecutiveRuntime(snapshot);
  assert.deepEqual(a, b);
});

test("Test 15 — Immutability", () => {
  const snapshot = snapshotFor("baseline");
  const snapshotJson = JSON.stringify(snapshot);
  const bindingsJson = JSON.stringify(getDataRealityStageIdentityBindings());
  const result = projectDataRealityToExecutiveRuntime(snapshot);
  assert.equal(result.status, "projected");
  assert.equal(JSON.stringify(snapshot), snapshotJson);
  assert.equal(
    JSON.stringify(getDataRealityStageIdentityBindings()),
    bindingsJson,
  );
});

test("Test 16 — Runtime mapping vocabulary", () => {
  assert.deepEqual(mapExecutiveStateToMvpRuntimeAttention("normal"), {
    executiveState: "normal",
    mvpStatus: "stable",
    mvpAttention: "normal",
  });
  assert.deepEqual(mapExecutiveStateToMvpRuntimeAttention("attention"), {
    executiveState: "attention",
    mvpStatus: "watch",
    mvpAttention: "important",
  });
  assert.deepEqual(mapExecutiveStateToMvpRuntimeAttention("critical"), {
    executiveState: "critical",
    mvpStatus: "risk",
    mvpAttention: "critical",
  });
});

test("Test 17 — Adapter has no React/Three.js/Stage mesh imports", () => {
  const source = readFileSync(join(here, "dataRealityStageProjection.ts"), "utf8");
  assert.equal(/from\s+["']react["']/.test(source), false);
  assert.equal(/from\s+["']three["']/.test(source), false);
  assert.equal(/nexoraMVPStageFixtures/.test(source), false);
  assert.equal(/nexora3DExecutiveStage/.test(source), false);
  assert.equal(/AnimatableObject/.test(source), false);
});

test("Test 18 — No KPI / threshold logic in projection adapter", () => {
  const source = readFileSync(join(here, "dataRealityStageProjection.ts"), "utf8");
  assert.equal(source.includes("computeNexoraKPI"), false);
  assert.equal(source.includes("resolveKPIExecutiveState"), false);
  assert.equal(source.includes("minInclusive"), false);
  assert.equal(source.includes("ZERO_DENOMINATOR"), false);
});

test("Test 19 — No parallel runtime vocabulary invented", () => {
  const source = readFileSync(join(here, "dataRealityStageProjection.ts"), "utf8");
  assert.equal(source.includes('"stable"'), true);
  assert.equal(source.includes('"watch"'), true);
  assert.equal(source.includes('"risk"'), true);
  assert.equal(/new\s+AttentionEngine/.test(source), false);
  assert.equal(DATA_REALITY_STAGE_PROJECTION_BOUNDARY.ownsParallelRuntime, false);
});

test("Test 20 — Public boundary: no private NOL/DRI/REX imports", () => {
  const source = readFileSync(join(here, "dataRealityStageProjection.ts"), "utf8");
  assert.equal(/from\s+["']@\/app\/lib\/nol\//.test(source), false);
  assert.equal(/from\s+["']@\/app\/lib\/dri\//.test(source), false);
  assert.equal(/from\s+["']@\/app\/lib\/rex\//.test(source), false);
  assert.equal(/from\s+["']@\/app\/lib\/ex-dri\//.test(source), false);
  assert.equal(/from\s+["']@\/app\/lib\/nex-ci\//.test(source), false);
});
