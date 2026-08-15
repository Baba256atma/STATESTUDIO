/**
 * P2:8.6 — End-to-End Stage Reality Certification tests.
 *
 * Exercises the live production Stage Reality chain. Does not mock outcomes.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  DATA_REALITY_END_TO_END_STAGE_REALITY_CERTIFICATION_BOUNDARY,
  DATA_REALITY_STAGE_REALITY_CERTIFICATION_STATUS_STRUCTURAL_PASS,
  MANUAL_VISUAL_VALIDATION_REQUIRED,
  certifyDataRealityEndToEndStageReality,
  dataRealityEndToEndStageRealityCertificationArchitecturalRole,
  dataRealityEndToEndStageRealityCertificationIdentity,
  dataRealityEndToEndStageRealityCertificationNamespace,
  dataRealityEndToEndStageRealityCertificationPhase,
  dataRealityEndToEndStageRealityCertificationReadiness,
  dataRealityEndToEndStageRealityCertificationVersion,
  getDataRealityEndToEndStageRealityCertificationIdentity,
} from "./dataRealityEndToEndStageRealityCertification.ts";
import {
  DATA_REALITY_FOCUS_READABILITY_CAMERA,
  DATA_REALITY_OVERVIEW_READABILITY_CAMERA,
  DATA_REALITY_READABILITY_CRITICAL_FLOORS,
} from "./dataRealityDensityCameraExecutiveReadabilityValidation.ts";
import { resolveNexoraMVPDataRealityVisualStageAudit } from "../nex-mvp/nexoraMVPDataRealityVisualStageAudit.ts";
import { resolveNexoraMVPDataRealityStageRealityCertification } from "../nex-mvp/nexoraMVPDataRealityStageRealityCertification.ts";
import { NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES } from "../nex-mvp/nexoraMVPStageFixtures.ts";

function baselineOverview() {
  return resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "baseline",
    selectedObjectId: null,
    focusedObjectId: null,
  });
}

function pressureOverview() {
  return resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
}

function pressureFocus(objectId: string) {
  return resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: objectId,
    focusedObjectId: objectId,
  });
}

function objectOf(
  bundle: ReturnType<typeof resolveNexoraMVPDataRealityVisualStageAudit>,
  id: string,
) {
  return bundle.presentation.scene.objects.find((entry) => entry.id === id)!;
}

test("P2:8.6 identity and certification-only boundary", () => {
  const identity = getDataRealityEndToEndStageRealityCertificationIdentity();
  assert.equal(
    dataRealityEndToEndStageRealityCertificationIdentity,
    "P2:8.6/DataRealityEndToEndStageRealityCertification",
  );
  assert.equal(identity.version, "2.8.6");
  assert.equal(
    dataRealityEndToEndStageRealityCertificationNamespace,
    "nexora.data-reality.stage-reality-certification",
  );
  assert.equal(
    dataRealityEndToEndStageRealityCertificationPhase,
    "EndToEndStageRealityCertification",
  );
  assert.equal(
    dataRealityEndToEndStageRealityCertificationArchitecturalRole,
    "DataRealityEndToEndStageRealityCertificationBoundary",
  );
  assert.equal(
    dataRealityEndToEndStageRealityCertificationReadiness,
    "ReadyForStagePolish",
  );
  assert.equal(
    DATA_REALITY_END_TO_END_STAGE_REALITY_CERTIFICATION_BOUNDARY.certificationOnly,
    true,
  );
  assert.equal(
    DATA_REALITY_END_TO_END_STAGE_REALITY_CERTIFICATION_BOUNDARY.repairsUpstreamDefects,
    false,
  );
  assert.equal(
    DATA_REALITY_END_TO_END_STAGE_REALITY_CERTIFICATION_BOUNDARY.certifiesHumanPerceptionAutomatically,
    false,
  );
});

test("TEST 1 — Baseline overview certifies", () => {
  const certification = certifyDataRealityEndToEndStageReality();
  const scenario = certification.scenarios.find(
    (entry) => entry.scenarioId === "baseline-overview",
  )!;
  assert.equal(scenario.structuralPass, true);
  const bundle = baselineOverview();
  assert.equal(bundle.presentation.scene.mode, "overview");
  assert.equal(objectOf(bundle, "obj-revenue").executiveVisualState, "normal");
});

test("TEST 2 — Operational Pressure overview certifies", () => {
  const certification = certifyDataRealityEndToEndStageReality();
  const scenario = certification.scenarios.find(
    (entry) => entry.scenarioId === "operational-pressure-overview",
  )!;
  assert.equal(scenario.structuralPass, true);
  const bundle = pressureOverview();
  assert.equal(objectOf(bundle, "obj-revenue").executiveVisualState, "attention");
  assert.equal(objectOf(bundle, "obj-capacity").executiveVisualState, "critical");
});

test("TEST 3 — Dataset A/B produce different Stage state", () => {
  const a = baselineOverview();
  const b = pressureOverview();
  assert.notEqual(
    objectOf(a, "obj-capacity").executiveVisualState,
    objectOf(b, "obj-capacity").executiveVisualState,
  );
  assert.notEqual(
    objectOf(a, "obj-revenue").executiveVisualState,
    objectOf(b, "obj-revenue").executiveVisualState,
  );
});

test("TEST 4 — Dataset A/B preserve Stage object IDs", () => {
  const a = baselineOverview()
    .presentation.scene.objects.map((entry) => entry.id)
    .sort();
  const b = pressureOverview()
    .presentation.scene.objects.map((entry) => entry.id)
    .sort();
  assert.deepEqual(a, b);
});

test("TEST 5 — Revenue normal/attention transition follows canonical Dataset reality", () => {
  assert.equal(
    objectOf(baselineOverview(), "obj-revenue").executiveVisualState,
    "normal",
  );
  assert.equal(
    objectOf(pressureOverview(), "obj-revenue").executiveVisualState,
    "attention",
  );
});

test("TEST 6 — critical objects remain critical through presentation", () => {
  const bundle = pressureFocus("obj-revenue");
  for (const id of [
    "obj-capacity",
    "obj-inventory",
    "obj-delivery",
    "obj-customer",
  ]) {
    assert.equal(objectOf(bundle, id).executiveVisualState, "critical");
    assert.equal(objectOf(bundle, id).stateMarker, "critical");
  }
});

test("TEST 7 — unresolved remains unresolved", () => {
  const certification = certifyDataRealityEndToEndStageReality();
  const finding = certification.findings.find(
    (entry) => entry.invariantId === "unresolved-never-normal",
  )!;
  assert.equal(finding.status, "pass");
  const cost = pressureFocus("obj-revenue").audit.findings.filter(
    (entry) => entry.subjectId === "cost",
  );
  assert.ok(
    cost.every(
      (entry) =>
        entry.status === "unresolved-as-designed" ||
        entry.status === "visible-and-consistent" ||
        entry.status === "not-applicable",
    ),
  );
});

test("TEST 8 — unresolved never becomes normal", () => {
  const bundle = pressureFocus("obj-revenue");
  assert.equal(
    bundle.presentation.scene.objects.some(
      (entry) =>
        entry.executiveVisualState === "unresolved" &&
        entry.stateMarker === "none",
    ),
    false,
  );
  assert.ok(
    !bundle.presentation.scene.objects.some((entry) => entry.id === "obj-cost"),
  );
});

test("TEST 9 — overview has no anchor", () => {
  for (const bundle of [baselineOverview(), pressureOverview()]) {
    assert.equal(bundle.presentation.scene.focusedObjectId, null);
    assert.equal(
      bundle.presentation.scene.objects.every((entry) => entry.focused === false),
      true,
    );
  }
});

test("TEST 10 — Revenue focus produces exactly one anchor", () => {
  const bundle = pressureFocus("obj-revenue");
  const focused = bundle.presentation.scene.objects.filter(
    (entry) => entry.focused,
  );
  assert.equal(focused.length, 1);
  assert.equal(focused[0]!.id, "obj-revenue");
});

test("TEST 11 — Revenue attention remains attention while focused", () => {
  const revenue = objectOf(pressureFocus("obj-revenue"), "obj-revenue");
  assert.equal(revenue.focused, true);
  assert.equal(revenue.executiveVisualState, "attention");
  assert.notEqual(revenue.executiveVisualState, "critical");
});

test("TEST 12 — Customer canonical Revenue relationship preserved", () => {
  const edge = pressureFocus("obj-revenue").presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.ok(
    (edge.sourceId === "obj-customer" && edge.targetId === "obj-revenue") ||
      (edge.sourceId === "obj-revenue" && edge.targetId === "obj-customer"),
  );
  assert.equal(edge.visualRole, "anchor-incident");
  assert.equal(edge.emphasized, true);
});

test("TEST 13 — Customer critical severity preserved while related", () => {
  const customer = objectOf(pressureFocus("obj-revenue"), "obj-customer");
  assert.equal(customer.role, "related");
  assert.equal(customer.executiveVisualState, "critical");
  assert.equal(customer.focused, false);
});

test("TEST 14 — Capacity critical severity preserved while competing", () => {
  const floors = DATA_REALITY_READABILITY_CRITICAL_FLOORS;
  const capacity = objectOf(pressureFocus("obj-revenue"), "obj-capacity");
  assert.equal(capacity.role, "unrelated");
  assert.equal(capacity.executiveVisualState, "critical");
  assert.ok(capacity.opacity >= floors.minOpacity);
  assert.ok(capacity.scale >= floors.minScale);
  assert.ok(capacity.emissiveIntensity >= floors.minEmissive);
});

test("TEST 15 — Revenue ↔ Capacity remains non-edge", () => {
  const certification = certifyDataRealityEndToEndStageReality();
  assert.equal(
    certification.counts.revenueCapacityCanonicalEdgePresent,
    false,
  );
  const bundle = pressureFocus("obj-revenue");
  assert.equal(
    bundle.presentation.scene.connections.some(
      (entry) =>
        (entry.sourceId === "obj-revenue" &&
          entry.targetId === "obj-capacity") ||
        (entry.sourceId === "obj-capacity" &&
          entry.targetId === "obj-revenue"),
    ),
    false,
  );
});

test("TEST 16 — simultaneous critical/attention does not create edge", () => {
  const bundle = pressureFocus("obj-revenue");
  assert.equal(objectOf(bundle, "obj-revenue").executiveVisualState, "attention");
  assert.equal(objectOf(bundle, "obj-capacity").executiveVisualState, "critical");
  assert.equal(
    bundle.presentation.scene.connections.some(
      (entry) =>
        entry.sourceId === "obj-revenue" && entry.targetId === "obj-capacity",
    ),
    false,
  );
});

test("TEST 17 — context reveal depth remains 1", () => {
  const certification = certifyDataRealityEndToEndStageReality();
  assert.equal(certification.counts.revealDepthHops, 1);
});

test("TEST 18 — hidden overflow remains respected", () => {
  const bundle = pressureFocus("obj-revenue");
  for (const node of bundle.presentation.contextNodes) {
    if (node.opacity < 0.5) assert.ok(node.opacity <= 0.2);
  }
});

test("TEST 19 — competing attention does not become context", () => {
  const capacity = objectOf(pressureFocus("obj-revenue"), "obj-capacity");
  assert.equal(capacity.role, "unrelated");
  assert.notEqual(capacity.role, "related");
  assert.notEqual(capacity.role, "focused");
});

test("TEST 20 — canonical direction preserved", () => {
  const edge = pressureFocus("obj-revenue").presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.ok(
    edge.directionCue === "source-to-target" || edge.directionCue === "none",
  );
});

test("TEST 21 — relation strings preserved", () => {
  const edge = pressureFocus("obj-revenue").presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.equal(edge.relation, "related");
  assert.equal(edge.impliesCausality, false);
});

test("TEST 22 — false relationship count = 0", () => {
  assert.equal(
    certifyDataRealityEndToEndStageReality().counts.falseRelationshipCount,
    0,
  );
});

test("TEST 23 — false context count = 0", () => {
  assert.equal(
    certifyDataRealityEndToEndStageReality().counts.falseContextCount,
    0,
  );
});

test("TEST 24 — computed-but-not-visible count = 0", () => {
  assert.equal(
    certifyDataRealityEndToEndStageReality().counts.computedButNotVisibleCount,
    0,
  );
});

test("TEST 25 — visually-misleading count = 0", () => {
  assert.equal(
    certifyDataRealityEndToEndStageReality().counts.visuallyMisleadingCount,
    0,
  );
});

test("TEST 26 — critical-obscured count = 0", () => {
  assert.equal(
    certifyDataRealityEndToEndStageReality().counts.criticalObscuredCount,
    0,
  );
});

test("TEST 27 — anchor-clipped count = 0", () => {
  assert.equal(
    certifyDataRealityEndToEndStageReality().counts.anchorClippedCount,
    0,
  );
});

test("TEST 28 — label-conflict count remains within certified gate", () => {
  assert.equal(
    certifyDataRealityEndToEndStageReality().counts.labelConflictCount,
    0,
  );
});

test("TEST 29 — background edge noise remains within certified gate", () => {
  assert.equal(
    certifyDataRealityEndToEndStageReality().counts.connectionNoiseCount,
    0,
  );
});

test("TEST 30 — overview camera matches certified plan", () => {
  const camera = pressureOverview().presentation.scene.camera;
  assert.deepEqual(camera.position, DATA_REALITY_OVERVIEW_READABILITY_CAMERA.position);
  assert.deepEqual(camera.target, DATA_REALITY_OVERVIEW_READABILITY_CAMERA.target);
  assert.equal(camera.fov, DATA_REALITY_OVERVIEW_READABILITY_CAMERA.fov);
});

test("TEST 31 — focus camera matches certified plan", () => {
  const camera = pressureFocus("obj-revenue").presentation.scene.camera;
  assert.deepEqual(camera.position, DATA_REALITY_FOCUS_READABILITY_CAMERA.position);
  assert.deepEqual(camera.target, DATA_REALITY_FOCUS_READABILITY_CAMERA.target);
  assert.equal(camera.fov, DATA_REALITY_FOCUS_READABILITY_CAMERA.fov);
});

test("TEST 32 — focus switch leaves exactly one anchor", () => {
  const inventory = pressureFocus("obj-inventory");
  assert.equal(
    inventory.presentation.scene.objects.filter((entry) => entry.focused).length,
    1,
  );
  assert.equal(objectOf(inventory, "obj-inventory").focused, true);
});

test("TEST 33 — focus switch removes stale context", () => {
  const revenue = pressureFocus("obj-revenue");
  const inventory = pressureFocus("obj-inventory");
  assert.equal(objectOf(inventory, "obj-revenue").focused, false);
  assert.notDeepEqual(
    revenue.presentation.contextNodes.map((entry) => entry.id),
    inventory.presentation.contextNodes.map((entry) => entry.id),
  );
});

test("TEST 34 — focus switch removes stale foreground-edge ownership", () => {
  const inventory = pressureFocus("obj-inventory");
  const customerRevenue = inventory.presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.equal(customerRevenue.emphasized, false);
  assert.equal(customerRevenue.visualRole, "background");
});

test("TEST 35 — clear focus removes anchor", () => {
  const cleared = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
  assert.equal(cleared.presentation.scene.focusedObjectId, null);
  assert.equal(
    cleared.presentation.scene.objects.every((entry) => entry.focused === false),
    true,
  );
});

test("TEST 36 — clear focus restores overview camera", () => {
  const cleared = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
  assert.deepEqual(
    cleared.presentation.scene.camera.position,
    DATA_REALITY_OVERVIEW_READABILITY_CAMERA.position,
  );
});

test("TEST 37 — clear focus restores overview density/labels", () => {
  const cleared = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
  assert.equal(cleared.presentation.scene.mode, "overview");
  assert.equal(cleared.presentation.contextNodes.length, 0);
  assert.ok(
    cleared.presentation.scene.objects.some(
      (entry) => entry.labelProminence === "minimal",
    ),
  );
});

test("TEST 38 — clear focus preserves executive severity", () => {
  const cleared = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
  assert.equal(objectOf(cleared, "obj-capacity").executiveVisualState, "critical");
  assert.equal(objectOf(cleared, "obj-customer").executiveVisualState, "critical");
  assert.equal(objectOf(cleared, "obj-revenue").executiveVisualState, "attention");
});

test("TEST 39 — object identities survive overview → focus → clear", () => {
  const overview = pressureOverview()
    .presentation.scene.objects.map((entry) => entry.id)
    .sort();
  const focus = pressureFocus("obj-revenue")
    .presentation.scene.objects.map((entry) => entry.id)
    .sort();
  const cleared = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  })
    .presentation.scene.objects.map((entry) => entry.id)
    .sort();
  assert.deepEqual(overview, focus);
  assert.deepEqual(focus, cleared);
  for (const id of [
    "obj-revenue",
    "obj-capacity",
    "obj-inventory",
    "obj-delivery",
    "obj-customer",
  ]) {
    assert.ok(overview.includes(id));
  }
});

test("TEST 40 — same input produces deterministic certification result", () => {
  const a = certifyDataRealityEndToEndStageReality();
  const b = certifyDataRealityEndToEndStageReality();
  assert.deepEqual(a.findings, b.findings);
  assert.deepEqual(a.counts, b.counts);
  assert.equal(a.structuralStatus, b.structuralStatus);
});

test("TEST 41 — P2:8.2 guarantees preserved", () => {
  const floors = DATA_REALITY_READABILITY_CRITICAL_FLOORS;
  const capacity = objectOf(pressureFocus("obj-revenue"), "obj-capacity");
  assert.ok(capacity.opacity >= floors.minOpacity);
  assert.equal(capacity.stateMarker, "critical");
  assert.equal(
    objectOf(pressureFocus("obj-revenue"), "obj-revenue").executiveVisualState,
    "attention",
  );
});

test("TEST 42 — P2:8.3 guarantees preserved", () => {
  const revenue = objectOf(pressureFocus("obj-revenue"), "obj-revenue");
  assert.equal(revenue.role, "focused");
  assert.deepEqual(revenue.targetPosition, [0, 0.42, 0]);
  assert.equal(
    pressureFocus("obj-revenue").presentation.scene.objects.filter(
      (entry) => entry.focused,
    ).length,
    1,
  );
});

test("TEST 43 — P2:8.4 guarantees preserved", () => {
  const bundle = pressureFocus("obj-revenue");
  const edge = bundle.presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.equal(edge.visualRole, "anchor-incident");
  assert.ok(
    bundle.presentation.scene.connections.every((connection) =>
      NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.some(
        (fixture) => fixture.id === connection.id,
      ),
    ),
  );
});

test("TEST 44 — P2:8.5 guarantees preserved", () => {
  const certification = certifyDataRealityEndToEndStageReality();
  assert.equal(certification.counts.labelConflictCount, 0);
  assert.equal(certification.counts.criticalObscuredCount, 0);
  assert.equal(certification.counts.anchorClippedCount, 0);
  const density = pressureFocus("obj-revenue").audit.findings.find(
    (entry) => entry.subjectId === "stage-density",
  )!;
  const camera = pressureFocus("obj-revenue").audit.findings.find(
    (entry) => entry.subjectId === "stage-camera",
  )!;
  assert.equal(density.status, "visible-and-consistent");
  assert.equal(camera.status, "visible-and-consistent");
});

test("TEST 45 — human visual status cannot become passed without explicit sign-off evidence", () => {
  const auto = certifyDataRealityEndToEndStageReality();
  assert.notEqual(auto.humanVisualSignoffStatus, "passed");
  assert.ok(
    auto.humanVisualSignoffStatus === "not-performed" ||
      auto.humanVisualSignoffStatus === "pending",
  );
  assert.equal(
    auto.provenance.manualVisualValidationRequired,
    MANUAL_VISUAL_VALIDATION_REQUIRED,
  );

  const withoutEvidence = certifyDataRealityEndToEndStageReality({
    humanVisualSignoffStatus: "passed",
  });
  assert.equal(withoutEvidence.humanVisualSignoffStatus, "pending");

  const withEvidence = certifyDataRealityEndToEndStageReality({
    humanVisualSignoffStatus: "passed",
    humanVisualEvidence: Object.freeze([
      "Baseline overview calm",
      "Pressure overview criticals discoverable",
      "Revenue focus ownership clear",
    ]),
  });
  assert.equal(withEvidence.humanVisualSignoffStatus, "passed");
});

test("E2E — structural certification passes with honest human pending status", () => {
  const certification = resolveNexoraMVPDataRealityStageRealityCertification();
  assert.equal(certification.structuralStatus, "certified");
  assert.equal(certification.semanticTruthPreserved, true);
  assert.equal(certification.canonicalRelationshipsPreserved, true);
  assert.equal(certification.canonicalContextPreserved, true);
  assert.equal(certification.deterministic, true);
  assert.equal(certification.regressionSafe, true);
  assert.equal(certification.noParallelTruth, true);
  assert.equal(certification.certificationLevel, "Level-A-Structural");
  assert.equal(
    certification.statusLabel,
    DATA_REALITY_STAGE_REALITY_CERTIFICATION_STATUS_STRUCTURAL_PASS,
  );
  assert.ok(
    certification.invariants.every((entry) => entry.status === "PASS"),
  );
});
