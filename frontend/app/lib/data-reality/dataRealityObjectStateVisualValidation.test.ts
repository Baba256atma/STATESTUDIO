/**
 * P2:8.2 — Object State Visual Validation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_OBJECT_STATE_VISUAL_VALIDATION_BOUNDARY,
  DATA_REALITY_OBJECT_STATE_VISUAL_VALIDATION_PROVENANCE_CHAIN,
  dataRealityObjectStateVisualValidationArchitecturalRole,
  dataRealityObjectStateVisualValidationIdentity,
  dataRealityObjectStateVisualValidationNamespace,
  dataRealityObjectStateVisualValidationPhase,
  dataRealityObjectStateVisualValidationReadiness,
  dataRealityObjectStateVisualValidationVersion,
  getDataRealityObjectStateVisualValidationIdentity,
  isDataRealityObjectVisualStateStrongerThan,
  mapMvpVocabularyToObjectExecutiveVisualState,
  resolveDataRealityObjectVisualState,
} from "./dataRealityObjectStateVisualValidation.ts";
import { dataRealityVisualStageAuditIdentity } from "./dataRealityVisualStageAudit.ts";
import { resolveNexoraMVPDataRealityVisualStageAudit } from "../nex-mvp/nexoraMVPDataRealityVisualStageAudit.ts";
import {
  applyDataRealityObjectVisualStateToStagePresentation,
  resolveNexoraMVPObjectVisualStateFromPresentation,
} from "../nex-mvp/nexoraMVPDataRealityObjectVisualState.ts";
import { NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES } from "../nex-mvp/nexoraMVPStageFixtures.ts";

const here = dirname(fileURLToPath(import.meta.url));

test("P2:8.2 identity and boundary", () => {
  const identity = getDataRealityObjectStateVisualValidationIdentity();
  assert.equal(
    dataRealityObjectStateVisualValidationIdentity,
    "P2:8.2/DataRealityObjectStateVisualValidation",
  );
  assert.equal(identity.version, "2.8.2");
  assert.equal(
    dataRealityObjectStateVisualValidationNamespace,
    "nexora.data-reality.object-state-visual-validation",
  );
  assert.equal(
    dataRealityObjectStateVisualValidationPhase,
    "ObjectStateVisualValidation",
  );
  assert.equal(
    dataRealityObjectStateVisualValidationArchitecturalRole,
    "DataRealityObjectStateVisualValidationBoundary",
  );
  assert.equal(
    dataRealityObjectStateVisualValidationReadiness,
    "ReadyForFocusChoreographyValidation",
  );
  assert.equal(
    DATA_REALITY_OBJECT_STATE_VISUAL_VALIDATION_BOUNDARY.ownsKpiComputation,
    false,
  );
  assert.equal(
    DATA_REALITY_OBJECT_STATE_VISUAL_VALIDATION_BOUNDARY.introducesDashboardUi,
    false,
  );
  assert.equal(
    DATA_REALITY_OBJECT_STATE_VISUAL_VALIDATION_BOUNDARY.encodesStateByColorAlone,
    false,
  );
  assert.equal(
    DATA_REALITY_OBJECT_STATE_VISUAL_VALIDATION_BOUNDARY.immediateAuditSource,
    dataRealityVisualStageAuditIdentity,
  );
  assert.ok(
    DATA_REALITY_OBJECT_STATE_VISUAL_VALIDATION_PROVENANCE_CHAIN.includes(
      "P2:8.2 Object State Visual Validation",
    ),
  );
});

test("TEST 1 — normal produces normal presentation", () => {
  const state = resolveDataRealityObjectVisualState({
    objectId: "obj-revenue",
    mvpStatus: "stable",
    mvpAttention: "normal",
    interactionRole: "normal",
  });
  assert.equal(state.executiveState, "normal");
  assert.equal(state.marker, "none");
  assert.equal(state.emphasis, "normal");
  assert.ok(state.scale <= 1.02);
  assert.ok(state.emissiveIntensity < 0.12);
  assert.equal(mapMvpVocabularyToObjectExecutiveVisualState("stable", "normal"), "normal");
});

test("TEST 2 — attention is visually stronger than normal", () => {
  const normal = resolveDataRealityObjectVisualState({
    objectId: "a",
    mvpStatus: "stable",
    mvpAttention: "normal",
  });
  const attention = resolveDataRealityObjectVisualState({
    objectId: "b",
    mvpStatus: "watch",
    mvpAttention: "important",
  });
  assert.equal(attention.executiveState, "attention");
  assert.equal(attention.marker, "attention");
  assert.ok(isDataRealityObjectVisualStateStrongerThan(attention, normal));
  assert.ok(attention.scale > normal.scale);
  assert.ok(attention.emissiveIntensity > normal.emissiveIntensity);
  assert.ok(attention.rimIntensity > normal.rimIntensity);
});

test("TEST 3 — critical is stronger/more persistent than attention", () => {
  const attention = resolveDataRealityObjectVisualState({
    objectId: "a",
    mvpStatus: "watch",
    mvpAttention: "important",
  });
  const critical = resolveDataRealityObjectVisualState({
    objectId: "b",
    mvpStatus: "risk",
    mvpAttention: "critical",
  });
  assert.equal(critical.executiveState, "critical");
  assert.equal(critical.marker, "critical");
  assert.equal(critical.labelPriority, "persistent");
  assert.ok(isDataRealityObjectVisualStateStrongerThan(critical, attention));
  assert.ok(critical.scale > attention.scale);
  assert.ok(critical.emissiveIntensity > attention.emissiveIntensity);
});

test("TEST 4 — unresolved does not resolve to normal presentation", () => {
  const unresolved = resolveDataRealityObjectVisualState({
    objectId: "obj-budget",
    mvpStatus: "unresolved",
    mvpAttention: "normal",
  });
  const normal = resolveDataRealityObjectVisualState({
    objectId: "obj-revenue",
    mvpStatus: "stable",
    mvpAttention: "normal",
  });
  assert.equal(unresolved.executiveState, "unresolved");
  assert.equal(unresolved.marker, "unresolved");
  assert.notEqual(unresolved.marker, "none");
  assert.notEqual(unresolved.executiveState, "normal");
  assert.ok(unresolved.rimIntensity > normal.rimIntensity);
});

test("TEST 5 — selected normal does not become semantically critical", () => {
  const selected = resolveDataRealityObjectVisualState({
    objectId: "obj-revenue",
    mvpStatus: "stable",
    mvpAttention: "normal",
    selected: true,
    focused: false,
  });
  assert.equal(selected.executiveState, "normal");
  assert.equal(selected.marker, "none");
  assert.equal(selected.selectionCue, "selected");
  assert.equal(selected.focusCue, "none");
  assert.ok(
    selected.reason.some((entry) =>
      entry.includes("not semantically critical"),
    ),
  );
});

test("TEST 6 — focused attention preserves attention semantics", () => {
  const focused = resolveDataRealityObjectVisualState({
    objectId: "obj-capacity",
    mvpStatus: "watch",
    mvpAttention: "important",
    interactionRole: "focused",
    focused: true,
  });
  assert.equal(focused.executiveState, "attention");
  assert.equal(focused.marker, "attention");
  assert.equal(focused.focusCue, "focused");
  assert.ok(focused.scale >= 1.24);
  assert.notEqual(focused.executiveState, "critical");
});

test("TEST 7 — background critical remains discoverable", () => {
  const backgroundCritical = resolveDataRealityObjectVisualState({
    objectId: "obj-capacity",
    mvpStatus: "risk",
    mvpAttention: "critical",
    interactionRole: "unrelated",
    focused: false,
    retainAttention: true,
  });
  assert.equal(backgroundCritical.executiveState, "critical");
  assert.equal(backgroundCritical.marker, "critical");
  assert.equal(backgroundCritical.visibility, "deemphasized");
  assert.ok(backgroundCritical.scale >= 1.1);
  assert.ok(backgroundCritical.opacity >= 0.74);
  assert.ok(backgroundCritical.emissiveIntensity >= 0.32);
  assert.equal(backgroundCritical.labelPriority, "persistent");
});

test("TEST 8 — focus and severity remain independent", () => {
  const focusedNormal = resolveDataRealityObjectVisualState({
    objectId: "obj-revenue",
    mvpStatus: "stable",
    mvpAttention: "normal",
    interactionRole: "focused",
    focused: true,
  });
  const backgroundCritical = resolveDataRealityObjectVisualState({
    objectId: "obj-capacity",
    mvpStatus: "risk",
    mvpAttention: "critical",
    interactionRole: "unrelated",
    focused: false,
  });
  assert.equal(focusedNormal.executiveState, "normal");
  assert.equal(focusedNormal.focusCue, "focused");
  assert.equal(backgroundCritical.executiveState, "critical");
  assert.equal(backgroundCritical.focusCue, "none");
  assert.notEqual(focusedNormal.marker, "critical");
  assert.equal(backgroundCritical.marker, "critical");
});

test("TEST 9 — P2:6 anchor role is preserved after visual apply", () => {
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });
  assert.equal(bundle.audit.anchorObjectId, "obj-revenue");
  const revenue = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-revenue",
  )!;
  assert.equal(revenue.focused, true);
  assert.equal(revenue.role, "focused");
  assert.deepEqual(revenue.targetPosition, [0, 0.42, 0]);
  assert.ok(revenue.scale >= 1.32);
});

test("TEST 10 — P2:7 relationship state is untouched", () => {
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });
  const connectionIds = bundle.presentation.scene.connections
    .map((entry) => entry.id)
    .sort();
  const canonicalIds = NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map(
    (entry) => entry.id,
  ).sort();
  assert.deepEqual(connectionIds, canonicalIds);
  for (const fixture of NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES) {
    const live = bundle.presentation.scene.connections.find(
      (entry) => entry.id === fixture.id,
    )!;
    assert.equal(live.sourceId, fixture.sourceId);
    assert.equal(live.targetId, fixture.targetId);
  }
});

test("TEST 11 — canonical non-edges remain non-edges", () => {
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });
  const fabricated = bundle.presentation.scene.connections.some(
    (entry) =>
      (entry.sourceId === "obj-revenue" &&
        entry.targetId === "obj-capacity") ||
      (entry.sourceId === "obj-capacity" && entry.targetId === "obj-revenue"),
  );
  assert.equal(fabricated, false);
  const nonEdgeFinding = bundle.audit.findings.find(
    (entry) => entry.subjectId === "canonical-non-edges",
  )!;
  assert.equal(nonEdgeFinding.status, "visible-and-consistent");
});

test("TEST 12 — same input produces deterministic visual output", () => {
  const input = {
    objectId: "obj-inventory",
    mvpStatus: "risk",
    mvpAttention: "critical",
    interactionRole: "unrelated" as const,
    focused: false,
    retainAttention: true,
  };
  const a = resolveDataRealityObjectVisualState(input);
  const b = resolveDataRealityObjectVisualState(input);
  assert.deepEqual(a, b);

  const bundleA = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-inventory",
    focusedObjectId: "obj-inventory",
  });
  const bundleB = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-inventory",
    focusedObjectId: "obj-inventory",
  });
  assert.deepEqual(bundleA.presentation.scene.objects, bundleB.presentation.scene.objects);
});

test("TEST 13 — Dataset changes produce visual-state changes on stable IDs", () => {
  const baseline = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "baseline",
  });
  const pressure = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
  });

  const baselineIds = baseline.presentation.scene.objects.map((o) => o.id).sort();
  const pressureIds = pressure.presentation.scene.objects.map((o) => o.id).sort();
  assert.deepEqual(baselineIds, pressureIds);

  const baselineCapacity = baseline.presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  const pressureCapacity = pressure.presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  assert.equal(baselineCapacity.id, pressureCapacity.id);
  assert.notEqual(
    baselineCapacity.executiveVisualState,
    pressureCapacity.executiveVisualState,
  );
  assert.equal(baselineCapacity.executiveVisualState, "attention");
  assert.equal(pressureCapacity.executiveVisualState, "critical");
  assert.ok(
    (pressureCapacity.emissiveIntensity ?? 0) >
      (baselineCapacity.emissiveIntensity ?? 0),
  );
});

test("TEST 14 — existing Stage rendering remains compatible", () => {
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "baseline",
  });
  for (const object of bundle.presentation.scene.objects) {
    assert.equal(typeof object.scale, "number");
    assert.equal(typeof object.opacity, "number");
    assert.equal(typeof object.emissiveIntensity, "number");
    assert.ok(["full", "reduced", "minimal"].includes(object.labelProminence));
    assert.ok(object.executiveVisualState !== undefined);
    assert.ok(object.stateMarker !== undefined);
    assert.equal(typeof object.rimIntensity, "number");
  }

  const reapplied = applyDataRealityObjectVisualStateToStagePresentation(
    bundle.presentation,
  );
  assert.equal(reapplied.scene.objects.length, bundle.presentation.scene.objects.length);
  assert.deepEqual(
    reapplied.scene.connections,
    bundle.presentation.scene.connections,
  );
});

test("E2E — Scenario E focus competition keeps background critical discoverable", () => {
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });
  const revenue = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-revenue",
  )!;
  const capacity = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;

  assert.equal(revenue.focused, true);
  assert.equal(capacity.focused, false);
  assert.equal(capacity.role, "unrelated");
  assert.equal(capacity.executiveVisualState, "critical");
  assert.equal(capacity.stateMarker, "critical");
  assert.ok(capacity.scale >= 1.1);
  assert.ok(capacity.opacity >= 0.74);
  assert.ok(capacity.emissiveIntensity >= 0.32);

  const capacityStateFinding = bundle.audit.findings.find(
    (entry) =>
      entry.subjectId === "production" &&
      entry.dimension === "executive-state",
  )!;
  assert.notEqual(capacityStateFinding.status, "computed-but-not-visible");
  assert.notEqual(capacityStateFinding.status, "visually-misleading");
});

test("E2E — P2:8.1 object-state high findings reduced after P2:8.2", () => {
  const focused = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });
  const objectStateMissing = focused.audit.findings.filter(
    (entry) =>
      (entry.dimension === "executive-state" ||
        entry.dimension === "attention") &&
      entry.status === "computed-but-not-visible",
  );
  assert.equal(objectStateMissing.length, 0);
  assert.equal(focused.audit.summary.visuallyMisleadingCount, 0);
  assert.equal(focused.audit.summary.blockerCount, 0);
});

test("Source boundary — resolver does not recompute upstream engines", () => {
  const source = readFileSync(
    join(here, "dataRealityObjectStateVisualValidation.ts"),
    "utf8",
  );
  assert.equal(source.includes("computeNexoraKPIs"), false);
  assert.equal(source.includes("resolveObjectExecutiveStates"), false);
  assert.equal(source.includes("resolveDataRealityAwareSceneChoreography"), false);
  assert.equal(source.includes("resolveDataRealityAwareConnectionsContext"), false);
  assert.ok(source.includes("encodesStateByColorAlone: false"));
});

test("Helper — presentation bridge preserves identity fields", () => {
  const sample = {
    id: "obj-delivery",
    label: "Delivery",
    kind: "object",
    role: "unrelated" as const,
    overviewPosition: [1, 0, 1] as const,
    targetPosition: [1.2, -0.2, 1.2] as const,
    scale: 0.78,
    opacity: 0.28,
    emissiveIntensity: 0.02,
    labelProminence: "minimal" as const,
    selected: false,
    focused: false,
    attention: "critical" as const,
    status: "risk",
  };
  const visual = resolveNexoraMVPObjectVisualStateFromPresentation(sample);
  assert.equal(visual.objectId, "obj-delivery");
  assert.equal(visual.executiveState, "critical");
  const applied = applyDataRealityObjectVisualStateToStagePresentation({
    mode: "focus",
    selectedSubjectId: "obj-revenue",
    focusedSubjectId: "obj-revenue",
    canStepBack: true,
    breadcrumb: Object.freeze([]),
    scene: {
      mode: "focus",
      focusedObjectId: "obj-revenue",
      selectedObjectId: "obj-revenue",
      presentationState: "report",
      environmentIntent: "neutral",
      objects: Object.freeze([sample]),
      connections: Object.freeze([]),
      camera: {
        position: [0, 3.4, 6.2],
        target: [0, 0.25, 0],
        fov: 40,
      },
    },
    contextNodes: Object.freeze([]),
    contextConnections: Object.freeze([]),
    emphasizedObjectIds: Object.freeze(["obj-revenue"]),
    subordinateObjectIds: Object.freeze(["obj-delivery"]),
    emphasizedRelationshipIds: Object.freeze([]),
  } as never);
  const out = applied.scene.objects[0]!;
  assert.equal(out.id, "obj-delivery");
  assert.equal(out.status, "risk");
  assert.equal(out.attention, "critical");
  assert.equal(out.stateMarker, "critical");
  assert.ok(out.scale >= 1.1);
});
