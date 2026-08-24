/**
 * P2:8.5 — Density, Camera & Executive Readability Validation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_CAMERA_DISTANCE_BOUNDS,
  DATA_REALITY_DENSITY_CAMERA_EXECUTIVE_READABILITY_VALIDATION_BOUNDARY,
  DATA_REALITY_FOCUS_READABILITY_CAMERA,
  DATA_REALITY_OVERVIEW_READABILITY_CAMERA,
  DATA_REALITY_READABILITY_CRITICAL_FLOORS,
  dataRealityDensityCameraExecutiveReadabilityValidationArchitecturalRole,
  dataRealityDensityCameraExecutiveReadabilityValidationIdentity,
  dataRealityDensityCameraExecutiveReadabilityValidationNamespace,
  dataRealityDensityCameraExecutiveReadabilityValidationPhase,
  dataRealityDensityCameraExecutiveReadabilityValidationReadiness,
  dataRealityDensityCameraExecutiveReadabilityValidationVersion,
  extractObservedExecutiveReadabilityEvidence,
  getDataRealityDensityCameraExecutiveReadabilityValidationIdentity,
  resolveDataRealityCameraReadabilityState,
  resolveDataRealityLabelReadabilityState,
  validateExecutiveReadability,
} from "./dataRealityDensityCameraExecutiveReadabilityValidation.ts";
import { resolveNexoraMVPDataRealityVisualStageAudit } from "../nex-mvp/nexoraMVPDataRealityVisualStageAudit.ts";
import { resolveNexoraMVPExecutiveReadabilityValidation } from "../nex-mvp/nexoraMVPDataRealityExecutiveReadability.ts";
import { NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES } from "../nex-mvp/nexoraMVPStageFixtures.ts";

const here = dirname(fileURLToPath(import.meta.url));

function pressureFocus(objectId: string) {
  return resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: objectId,
    focusedObjectId: objectId,
  });
}

function pressureOverview() {
  return resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
}

function baselineOverview() {
  return resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "baseline",
    selectedObjectId: null,
    focusedObjectId: null,
  });
}

function cameraDistance(camera: {
  readonly position: readonly [number, number, number];
  readonly target: readonly [number, number, number];
}): number {
  return Math.hypot(
    camera.position[0] - camera.target[0],
    camera.position[1] - camera.target[1],
    camera.position[2] - camera.target[2],
  );
}

test("P2:8.5 identity and boundary", () => {
  const identity =
    getDataRealityDensityCameraExecutiveReadabilityValidationIdentity();
  assert.equal(
    dataRealityDensityCameraExecutiveReadabilityValidationIdentity,
    "P2:8.5/DataRealityDensityCameraExecutiveReadabilityValidation",
  );
  assert.equal(identity.version, "2.8.5");
  assert.equal(
    dataRealityDensityCameraExecutiveReadabilityValidationNamespace,
    "nexora.data-reality.density-camera-executive-readability-validation",
  );
  assert.equal(
    dataRealityDensityCameraExecutiveReadabilityValidationPhase,
    "DensityCameraExecutiveReadabilityValidation",
  );
  assert.equal(
    dataRealityDensityCameraExecutiveReadabilityValidationArchitecturalRole,
    "DataRealityDensityCameraExecutiveReadabilityValidationBoundary",
  );
  assert.equal(
    dataRealityDensityCameraExecutiveReadabilityValidationReadiness,
    "ReadyForEndToEndStageRealityCertification",
  );
  assert.equal(
    DATA_REALITY_DENSITY_CAMERA_EXECUTIVE_READABILITY_VALIDATION_BOUNDARY.createsLayoutEngine,
    false,
  );
  assert.equal(
    DATA_REALITY_DENSITY_CAMERA_EXECUTIVE_READABILITY_VALIDATION_BOUNDARY.actsAsSemanticFilter,
    false,
  );
  assert.equal(
    DATA_REALITY_DENSITY_CAMERA_EXECUTIVE_READABILITY_VALIDATION_BOUNDARY.revealDepthHops,
    1,
  );
});

test("TEST 1 — overview camera fits all required primary objects", () => {
  const bundle = pressureOverview();
  assert.equal(bundle.presentation.scene.mode, "overview");
  assert.equal(bundle.presentation.scene.objects.length >= 8, true);
  const distance = cameraDistance(bundle.presentation.scene.camera);
  assert.ok(distance <= DATA_REALITY_CAMERA_DISTANCE_BOUNDS.maxUseful);
  assert.ok(distance >= DATA_REALITY_CAMERA_DISTANCE_BOUNDS.minFocus);
  assert.deepEqual(
    bundle.presentation.scene.camera.position,
    DATA_REALITY_OVERVIEW_READABILITY_CAMERA.position,
  );
});

test("TEST 2 — focus camera keeps anchor in validated frame", () => {
  const bundle = pressureFocus("obj-revenue");
  const revenue = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-revenue",
  )!;
  assert.equal(revenue.focused, true);
  assert.deepEqual(revenue.targetPosition, [0, 0.42, 0.14]);
  assert.deepEqual(
    bundle.presentation.scene.camera.target,
    DATA_REALITY_FOCUS_READABILITY_CAMERA.target,
  );
  const distance = cameraDistance(bundle.presentation.scene.camera);
  assert.ok(distance >= DATA_REALITY_CAMERA_DISTANCE_BOUNDS.minFocus);
  assert.ok(distance <= DATA_REALITY_CAMERA_DISTANCE_BOUNDS.maxUseful);
});

test("TEST 3 — focus camera keeps canonical context discoverable", () => {
  const bundle = pressureFocus("obj-revenue");
  const customer = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-customer",
  )!;
  assert.equal(customer.role, "related");
  assert.ok(customer.opacity >= 0.7);
  assert.ok(
    bundle.presentation.contextNodes.some(
      (node) =>
        node.role === "collapsed-thread" || node.opacity >= 0.5,
    ),
  );
});

test("TEST 4 — focus camera keeps required competing criticals discoverable", () => {
  const floors = DATA_REALITY_READABILITY_CRITICAL_FLOORS;
  const bundle = pressureFocus("obj-revenue");
  for (const id of ["obj-capacity", "obj-inventory", "obj-delivery"]) {
    const object = bundle.presentation.scene.objects.find(
      (entry) => entry.id === id,
    )!;
    assert.equal(object.role, "unrelated");
    assert.ok(object.opacity >= floors.minOpacity);
    assert.ok(object.scale >= floors.minScale);
    assert.ok(object.emissiveIntensity >= floors.minEmissive);
  }
});

test("TEST 5 — anchor is not clipped", () => {
  const bundle = pressureFocus("obj-revenue");
  const validated = resolveNexoraMVPExecutiveReadabilityValidation({
    scenario: bundle.scenario,
    presentation: bundle.presentation,
  });
  assert.equal(validated.validation.summary.anchorClippedCount, 0);
  const revenue = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-revenue",
  )!;
  assert.ok(Math.hypot(revenue.targetPosition[0], revenue.targetPosition[2]) <= 0.45);
});

test("TEST 6 — critical objects are not removed for density", () => {
  const overview = pressureOverview();
  const focus = pressureFocus("obj-revenue");
  for (const id of [
    "obj-revenue",
    "obj-capacity",
    "obj-inventory",
    "obj-delivery",
    "obj-customer",
  ]) {
    assert.ok(overview.presentation.scene.objects.some((entry) => entry.id === id));
    assert.ok(focus.presentation.scene.objects.some((entry) => entry.id === id));
  }
});

test("TEST 7 — critical severity floors remain preserved", () => {
  const floors = DATA_REALITY_READABILITY_CRITICAL_FLOORS;
  const bundle = pressureFocus("obj-revenue");
  const capacity = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  assert.equal(capacity.executiveVisualState, "critical");
  assert.equal(capacity.stateMarker, "critical");
  assert.ok(capacity.opacity >= floors.minOpacity);
  assert.ok(capacity.scale >= floors.minScale);
  assert.ok(capacity.emissiveIntensity >= floors.minEmissive);
});

test("TEST 8 — label priority favors anchor", () => {
  const bundle = pressureFocus("obj-revenue");
  const revenue = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-revenue",
  )!;
  assert.equal(revenue.labelProminence, "full");
  const label = resolveDataRealityLabelReadabilityState({
    objectId: "obj-revenue",
    mode: "focus",
    role: "focused",
    focused: true,
    executiveVisualState: "attention",
  });
  assert.equal(label.priority, "anchor");
});

test("TEST 9 — critical persistent labels remain supported", () => {
  const label = resolveDataRealityLabelReadabilityState({
    objectId: "obj-capacity",
    mode: "focus",
    role: "unrelated",
    focused: false,
    executiveVisualState: "critical",
    stateMarker: "critical",
  });
  assert.equal(label.priority, "critical-persistent");
  assert.equal(label.persistentViaMarker, true);
  assert.equal(label.prominence, "minimal");
  const bundle = pressureFocus("obj-revenue");
  const capacity = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  assert.equal(capacity.stateMarker, "critical");
  assert.equal(capacity.labelProminence, "minimal");
});

test("TEST 10 — low-priority labels may be subdued deterministically", () => {
  const pressure = pressureOverview();
  assert.ok(
    pressure.presentation.scene.objects.some(
      (entry) => entry.labelProminence === "minimal",
    ),
  );
  const baseline = baselineOverview();
  const subdued = baseline.presentation.scene.objects.filter(
    (entry) => entry.labelProminence === "minimal",
  );
  assert.ok(subdued.length > 0);
});

test("TEST 11 — context labels remain subordinate", () => {
  const bundle = pressureFocus("obj-revenue");
  for (const node of bundle.presentation.contextNodes) {
    assert.ok(node.scale <= 0.72);
    assert.equal(
      node.role === "context" ||
        node.role === "source-anchor" ||
        node.role === "collapsed-thread",
      true,
    );
  }
});

test("TEST 12 — context node count remains within P2:7 contract", () => {
  const bundle = pressureFocus("obj-revenue");
  const validated = resolveNexoraMVPExecutiveReadabilityValidation({
    scenario: bundle.scenario,
    presentation: bundle.presentation,
  });
  assert.ok(validated.validation.metrics.visibleContextCount <= 6);
  assert.equal(validated.validation.summary.contextCrowdedCount, 0);
});

test("TEST 13 — context remains 1-hop", () => {
  const bundle = pressureFocus("obj-revenue");
  const validated = resolveNexoraMVPExecutiveReadabilityValidation({
    scenario: bundle.scenario,
    presentation: bundle.presentation,
  });
  assert.equal(validated.validation.summary.revealDepthHops, 1);
  assert.equal(validated.validation.metrics.revealDepthHops, 1);
});

test("TEST 14 — hidden overflow remains hidden", () => {
  const bundle = pressureFocus("obj-revenue");
  for (const node of bundle.presentation.contextNodes) {
    if (node.opacity < 0.5) {
      assert.ok(node.opacity <= 0.2);
    }
  }
});

test("TEST 15 — foreground edge readability values remain preserved", () => {
  const bundle = pressureFocus("obj-revenue");
  const edge = bundle.presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.equal(edge.visualRole, "anchor-incident");
  assert.equal(edge.emphasized, true);
  assert.ok(edge.opacity >= 0.55);
});

test("TEST 16 — background edge density remains subdued", () => {
  const overview = pressureOverview();
  assert.ok(
    overview.presentation.scene.connections.every(
      (entry) => entry.emphasized === false && entry.opacity <= 0.15,
    ),
  );
  const focus = pressureFocus("obj-revenue");
  const background = focus.presentation.scene.connections.filter(
    (entry) => entry.visualRole === "background",
  );
  assert.ok(background.every((entry) => entry.opacity <= 0.12));
});

test("TEST 17 — Revenue ↔ Capacity remains non-edge", () => {
  const bundle = pressureFocus("obj-revenue");
  const fabricated = bundle.presentation.scene.connections.some(
    (entry) =>
      (entry.sourceId === "obj-revenue" &&
        entry.targetId === "obj-capacity") ||
      (entry.sourceId === "obj-capacity" &&
        entry.targetId === "obj-revenue"),
  );
  assert.equal(fabricated, false);
  const validated = resolveNexoraMVPExecutiveReadabilityValidation({
    scenario: bundle.scenario,
    presentation: bundle.presentation,
  });
  assert.equal(validated.validation.summary.nonEdgesPreserved, true);
});

test("TEST 18 — object IDs remain stable", () => {
  const a = pressureFocus("obj-revenue");
  const b = pressureFocus("obj-revenue");
  assert.deepEqual(
    a.presentation.scene.objects.map((entry) => entry.id).sort(),
    b.presentation.scene.objects.map((entry) => entry.id).sort(),
  );
});

test("TEST 19 — overview positions are deterministic", () => {
  const a = pressureOverview();
  const b = pressureOverview();
  assert.deepEqual(
    a.presentation.scene.objects.map((entry) => ({
      id: entry.id,
      targetPosition: entry.targetPosition,
    })),
    b.presentation.scene.objects.map((entry) => ({
      id: entry.id,
      targetPosition: entry.targetPosition,
    })),
  );
});

test("TEST 20 — focus positions are deterministic", () => {
  const a = pressureFocus("obj-revenue");
  const b = pressureFocus("obj-revenue");
  assert.deepEqual(
    a.presentation.scene.objects.map((entry) => ({
      id: entry.id,
      targetPosition: entry.targetPosition,
      role: entry.role,
    })),
    b.presentation.scene.objects.map((entry) => ({
      id: entry.id,
      targetPosition: entry.targetPosition,
      role: entry.role,
    })),
  );
});

test("TEST 21 — focus switch produces deterministic framing", () => {
  const revenue = pressureFocus("obj-revenue");
  const inventory = pressureFocus("obj-inventory");
  const focusCamera = resolveDataRealityCameraReadabilityState("focus");
  assert.deepEqual(
    revenue.presentation.scene.camera.position,
    focusCamera.position,
  );
  assert.deepEqual(
    revenue.presentation.scene.camera.target,
    focusCamera.target,
  );
  assert.deepEqual(
    inventory.presentation.scene.camera.position,
    DATA_REALITY_FOCUS_READABILITY_CAMERA.position,
  );
  assert.equal(
    revenue.presentation.scene.focusedObjectId,
    "obj-revenue",
  );
  assert.equal(
    inventory.presentation.scene.focusedObjectId,
    "obj-inventory",
  );
});

test("TEST 22 — clear focus restores overview camera/framing", () => {
  const cleared = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
  assert.equal(cleared.presentation.scene.mode, "overview");
  assert.deepEqual(
    cleared.presentation.scene.camera.position,
    DATA_REALITY_OVERVIEW_READABILITY_CAMERA.position,
  );
  assert.equal(cleared.presentation.contextNodes.length, 0);
});

test("TEST 23 — no stale density state remains", () => {
  const focus = pressureFocus("obj-revenue");
  const cleared = pressureOverview();
  assert.ok(
    focus.presentation.scene.connections.some((entry) => entry.emphasized),
  );
  assert.ok(
    cleared.presentation.scene.connections.every(
      (entry) => entry.emphasized === false,
    ),
  );
  assert.equal(cleared.presentation.scene.mode, "overview");
});

test("TEST 24 — no new false relationship", () => {
  const bundle = pressureFocus("obj-revenue");
  for (const connection of bundle.presentation.scene.connections) {
    assert.ok(
      NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.some(
        (entry) => entry.id === connection.id,
      ),
    );
  }
});

test("TEST 25 — no new false context", () => {
  const bundle = pressureFocus("obj-revenue");
  const validated = resolveNexoraMVPExecutiveReadabilityValidation({
    scenario: bundle.scenario,
    presentation: bundle.presentation,
  });
  assert.equal(validated.validation.summary.contextCrowdedCount, 0);
  assert.ok(
    bundle.presentation.contextNodes.every(
      (node) => node.scale <= 0.72 && node.role !== "focused",
    ),
  );
});

test("TEST 26 — no new computed-but-not-visible", () => {
  assert.equal(pressureOverview().audit.summary.computedButNotVisibleCount, 0);
  assert.equal(
    pressureFocus("obj-revenue").audit.summary.computedButNotVisibleCount,
    0,
  );
});

test("TEST 27 — no new visually-misleading", () => {
  assert.equal(pressureOverview().audit.summary.visuallyMisleadingCount, 0);
  assert.equal(
    pressureFocus("obj-revenue").audit.summary.visuallyMisleadingCount,
    0,
  );
});

test("TEST 28 — same inputs produce same readability result", () => {
  const a = pressureFocus("obj-revenue");
  const b = pressureFocus("obj-revenue");
  const va = resolveNexoraMVPExecutiveReadabilityValidation({
    scenario: a.scenario,
    presentation: a.presentation,
  });
  const vb = resolveNexoraMVPExecutiveReadabilityValidation({
    scenario: b.scenario,
    presentation: b.presentation,
  });
  assert.deepEqual(va.validation, vb.validation);
  assert.deepEqual(a.presentation.scene.camera, b.presentation.scene.camera);
});

test("E2E — P2:8.1 density/camera become visible-and-consistent", () => {
  for (const bundle of [
    baselineOverview(),
    pressureOverview(),
    pressureFocus("obj-revenue"),
  ]) {
    const density = bundle.audit.findings.find(
      (entry) => entry.subjectId === "stage-density",
    )!;
    const camera = bundle.audit.findings.find(
      (entry) => entry.subjectId === "stage-camera",
    )!;
    assert.equal(density.status, "visible-and-consistent");
    assert.equal(camera.status, "visible-and-consistent");
  }
});

test("E2E — Operational Pressure overview remains readable with multiple criticals", () => {
  const bundle = pressureOverview();
  const criticals = bundle.presentation.scene.objects.filter(
    (entry) => entry.executiveVisualState === "critical",
  );
  assert.ok(criticals.length >= 3);
  const floors = DATA_REALITY_READABILITY_CRITICAL_FLOORS;
  assert.ok(
    criticals.every(
      (entry) =>
        entry.opacity >= floors.minOpacity &&
        entry.scale >= floors.minScale,
    ),
  );
  const prominent = bundle.presentation.scene.objects.filter(
    (entry) => entry.labelProminence !== "minimal",
  ).length;
  assert.ok(prominent < bundle.presentation.scene.objects.length);
});

test("E2E — P2:8.2/8.3/8.4 regressions hold under readability apply", () => {
  const bundle = pressureFocus("obj-revenue");
  const revenue = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-revenue",
  )!;
  const customer = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-customer",
  )!;
  const capacity = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  assert.equal(revenue.role, "focused");
  assert.equal(customer.role, "related");
  assert.equal(customer.executiveVisualState, "critical");
  assert.equal(capacity.role, "unrelated");
  assert.equal(capacity.executiveVisualState, "critical");
  const edge = bundle.presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.equal(edge.visualRole, "anchor-incident");
  assert.equal(bundle.audit.summary.computedButNotVisibleCount, 0);
  assert.equal(bundle.audit.summary.visuallyMisleadingCount, 0);
});

test("Source boundary — module does not create layout engine or recompute semantics", () => {
  const source = readFileSync(
    join(here, "dataRealityDensityCameraExecutiveReadabilityValidation.ts"),
    "utf8",
  );
  assert.equal(source.includes("forceDirected"), false);
  assert.equal(source.includes("computeNexoraKPIs"), false);
  assert.equal(source.includes("resolveObjectExecutiveStates"), false);
  assert.ok(source.includes("createsLayoutEngine: false"));
  assert.ok(source.includes("actsAsSemanticFilter: false"));
});

test("extractObservedExecutiveReadabilityEvidence is deterministic", () => {
  const bundle = pressureFocus("obj-revenue");
  const a = extractObservedExecutiveReadabilityEvidence(bundle.presentation);
  const b = extractObservedExecutiveReadabilityEvidence(bundle.presentation);
  assert.deepEqual(a, b);
  const validated = validateExecutiveReadability({
    scenario: "operational-pressure",
    observed: a,
  });
  assert.equal(validated.summary.criticalObscuredCount, 0);
  assert.equal(validated.summary.anchorClippedCount, 0);
});
