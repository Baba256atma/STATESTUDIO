/**
 * P2:8.3 — Focus & Scene Choreography Validation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_FOCUS_SCENE_CHOREOGRAPHY_VALIDATION_BOUNDARY,
  DATA_REALITY_FOCUS_SCENE_CRITICAL_BACKGROUND_FLOORS,
  dataRealityFocusSceneChoreographyValidationArchitecturalRole,
  dataRealityFocusSceneChoreographyValidationIdentity,
  dataRealityFocusSceneChoreographyValidationNamespace,
  dataRealityFocusSceneChoreographyValidationPhase,
  dataRealityFocusSceneChoreographyValidationReadiness,
  dataRealityFocusSceneChoreographyValidationVersion,
  extractObservedFocusScenePresentation,
  getDataRealityFocusSceneChoreographyValidationIdentity,
  validateFocusSceneChoreography,
} from "./dataRealityFocusSceneChoreographyValidation.ts";
import { resolveDataRealityObjectVisualState } from "./dataRealityObjectStateVisualValidation.ts";
import { resolveNexoraMVPDataRealityVisualStageAudit } from "../nex-mvp/nexoraMVPDataRealityVisualStageAudit.ts";
import { NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES } from "../nex-mvp/nexoraMVPStageFixtures.ts";

const here = dirname(fileURLToPath(import.meta.url));

function pressureFocus(objectId: string) {
  return resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: objectId,
    focusedObjectId: objectId,
  });
}

test("P2:8.3 identity and boundary", () => {
  const identity = getDataRealityFocusSceneChoreographyValidationIdentity();
  assert.equal(
    dataRealityFocusSceneChoreographyValidationIdentity,
    "P2:8.3/DataRealityFocusSceneChoreographyValidation",
  );
  assert.equal(identity.version, "2.8.3");
  assert.equal(
    dataRealityFocusSceneChoreographyValidationNamespace,
    "nexora.data-reality.focus-scene-choreography-validation",
  );
  assert.equal(
    dataRealityFocusSceneChoreographyValidationPhase,
    "FocusSceneChoreographyValidation",
  );
  assert.equal(
    dataRealityFocusSceneChoreographyValidationArchitecturalRole,
    "DataRealityFocusSceneChoreographyValidationBoundary",
  );
  assert.equal(
    dataRealityFocusSceneChoreographyValidationReadiness,
    "ReadyForConnectionsContextVisualValidation",
  );
  assert.equal(
    DATA_REALITY_FOCUS_SCENE_CHOREOGRAPHY_VALIDATION_BOUNDARY.recomputesChoreography,
    false,
  );
  assert.equal(
    DATA_REALITY_FOCUS_SCENE_CHOREOGRAPHY_VALIDATION_BOUNDARY.weakensCriticalDiscoverability,
    false,
  );
});

test("TEST 1 — only one anchor exists at a time", () => {
  const bundle = pressureFocus("obj-revenue");
  const focused = bundle.presentation.scene.objects.filter((o) => o.focused);
  assert.equal(focused.length, 1);
  assert.equal(focused[0]!.id, "obj-revenue");
  assert.equal(bundle.audit.anchorObjectId, "obj-revenue");
});

test("TEST 2 — focused object owns anchor role", () => {
  const bundle = pressureFocus("obj-revenue");
  const revenue = bundle.presentation.scene.objects.find(
    (o) => o.id === "obj-revenue",
  )!;
  assert.equal(revenue.role, "focused");
  assert.equal(revenue.focused, true);
  assert.deepEqual(revenue.targetPosition, [0, 0.42, 0.14]);
  assert.ok(revenue.scale >= 1.3);
});

test("TEST 3 — attention + anchor remains attention", () => {
  const bundle = pressureFocus("obj-revenue");
  const revenue = bundle.presentation.scene.objects.find(
    (o) => o.id === "obj-revenue",
  )!;
  assert.equal(revenue.executiveVisualState, "attention");
  assert.equal(revenue.stateMarker, "attention");
  assert.notEqual(revenue.stateMarker, "critical");
  assert.equal(revenue.status, "watch");
  assert.equal(revenue.attention, "important");
});

test("TEST 4 — normal + anchor remains normal", () => {
  // Budget is unresolved unbound in pressure; use baseline revenue as normal.
  const bundle = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "baseline",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });
  const revenue = bundle.presentation.scene.objects.find(
    (o) => o.id === "obj-revenue",
  )!;
  assert.equal(revenue.executiveVisualState, "normal");
  assert.equal(revenue.stateMarker, "none");
  assert.equal(revenue.focused, true);
  assert.equal(revenue.role, "focused");
});

test("TEST 5 — critical + anchor remains critical", () => {
  const bundle = pressureFocus("obj-capacity");
  const capacity = bundle.presentation.scene.objects.find(
    (o) => o.id === "obj-capacity",
  )!;
  assert.equal(capacity.focused, true);
  assert.equal(capacity.executiveVisualState, "critical");
  assert.equal(capacity.stateMarker, "critical");
});

test("TEST 6 — unresolved + anchor remains unresolved", () => {
  const state = resolveDataRealityObjectVisualState({
    objectId: "obj-budget",
    mvpStatus: "unresolved",
    mvpAttention: "normal",
    interactionRole: "focused",
    focused: true,
  });
  assert.equal(state.executiveState, "unresolved");
  assert.equal(state.marker, "unresolved");
  assert.equal(state.focusCue, "focused");
  assert.notEqual(state.executiveState, "normal");
});

test("TEST 7 — background critical remains discoverable", () => {
  const bundle = pressureFocus("obj-revenue");
  const capacity = bundle.presentation.scene.objects.find(
    (o) => o.id === "obj-capacity",
  )!;
  const floors = DATA_REALITY_FOCUS_SCENE_CRITICAL_BACKGROUND_FLOORS;
  assert.equal(capacity.role, "unrelated");
  assert.ok(capacity.scale >= floors.minScale);
  assert.ok(capacity.opacity >= floors.minOpacity);
  assert.ok(capacity.emissiveIntensity >= floors.minEmissive);
  assert.equal(capacity.stateMarker, "critical");
});

test("TEST 8 — background critical does not become focused", () => {
  const bundle = pressureFocus("obj-revenue");
  for (const id of [
    "obj-capacity",
    "obj-inventory",
    "obj-delivery",
    "obj-customer",
  ]) {
    const object = bundle.presentation.scene.objects.find((o) => o.id === id)!;
    if (object.role === "unrelated") {
      assert.equal(object.focused, false);
      assert.equal(object.selected, false);
    }
  }
});

test("TEST 9 — competing critical does not enter related context without edge", () => {
  const bundle = pressureFocus("obj-revenue");
  const capacity = bundle.presentation.scene.objects.find(
    (o) => o.id === "obj-capacity",
  )!;
  // Revenue↔Capacity is non-edge; capacity must not be related solely by severity.
  assert.notEqual(capacity.role, "related");
  assert.equal(capacity.role, "unrelated");
});

test("TEST 10 — Revenue ↔ Capacity remains non-edge", () => {
  const bundle = pressureFocus("obj-revenue");
  const fabricated = bundle.presentation.scene.connections.some(
    (entry) =>
      (entry.sourceId === "obj-revenue" &&
        entry.targetId === "obj-capacity") ||
      (entry.sourceId === "obj-capacity" && entry.targetId === "obj-revenue"),
  );
  assert.equal(fabricated, false);
  const finding = bundle.audit.findings.find(
    (entry) => entry.subjectId === "canonical-non-edges",
  )!;
  assert.equal(finding.status, "visible-and-consistent");
});

test("TEST 11 — P2:7 context remains 1-hop", () => {
  const bundle = pressureFocus("obj-revenue");
  const context = bundle.audit.findings.find(
    (entry) => entry.dimension === "context",
  )!;
  assert.equal(
    (context.expectedState as { revealDepthHops?: number }).revealDepthHops,
    1,
  );
  assert.notEqual(context.status, "visually-misleading");
});

test("TEST 12 — canonical context distinguishable from competing attention", () => {
  const bundle = pressureFocus("obj-revenue");
  const related = bundle.presentation.scene.objects.filter(
    (o) => o.role === "related",
  );
  const competingCritical = bundle.presentation.scene.objects.filter(
    (o) =>
      o.role === "unrelated" &&
      o.executiveVisualState === "critical" &&
      o.id !== "obj-revenue",
  );
  assert.ok(related.every((o) => o.focused === false));
  assert.ok(competingCritical.length >= 1);
  assert.ok(
    competingCritical.every(
      (object) => object.focused === false && object.role === "unrelated",
    ),
  );
  assert.ok(related.every((object) => object.role === "related"));
});

test("TEST 13 — focus switch removes previous anchor", () => {
  const a = pressureFocus("obj-revenue");
  const b = pressureFocus("obj-inventory");
  const aFocused = a.presentation.scene.objects.filter((o) => o.focused);
  const bFocused = b.presentation.scene.objects.filter((o) => o.focused);
  assert.equal(aFocused[0]!.id, "obj-revenue");
  assert.equal(bFocused[0]!.id, "obj-inventory");
  assert.equal(bFocused.length, 1);
  const revenueAfter = b.presentation.scene.objects.find(
    (o) => o.id === "obj-revenue",
  )!;
  assert.equal(revenueAfter.focused, false);
  assert.notEqual(revenueAfter.role, "focused");
});

test("TEST 14 — clear focus removes anchor state", () => {
  const cleared = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
  assert.equal(cleared.presentation.scene.mode, "overview");
  assert.equal(cleared.presentation.scene.focusedObjectId, null);
  assert.equal(
    cleared.presentation.scene.objects.every((o) => o.focused === false),
    true,
  );
  assert.equal(
    cleared.presentation.scene.objects.every((o) => o.role !== "focused"),
    true,
  );
});

test("TEST 15 — clear focus restores overview choreography", () => {
  const focused = pressureFocus("obj-revenue");
  const cleared = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
  assert.equal(focused.presentation.scene.mode, "focus");
  assert.equal(cleared.presentation.scene.mode, "overview");
  for (const object of cleared.presentation.scene.objects) {
    assert.deepEqual(object.targetPosition, object.overviewPosition);
  }
});

test("TEST 16 — clear focus does not reset executive severity", () => {
  const cleared = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
  const capacity = cleared.presentation.scene.objects.find(
    (o) => o.id === "obj-capacity",
  )!;
  assert.equal(capacity.status, "risk");
  assert.equal(capacity.attention, "critical");
  assert.equal(capacity.executiveVisualState, "critical");
  assert.equal(capacity.stateMarker, "critical");
});

test("TEST 17 — stable object IDs survive overview/focus/clear", () => {
  const overview = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
  });
  const focused = pressureFocus("obj-revenue");
  const cleared = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
  const ids = (bundle: typeof overview) =>
    bundle.presentation.scene.objects.map((o) => o.id).sort();
  assert.deepEqual(ids(overview), ids(focused));
  assert.deepEqual(ids(focused), ids(cleared));
});

test("TEST 18 — P2:8.2 severity floors remain preserved", () => {
  const bundle = pressureFocus("obj-revenue");
  const floors = DATA_REALITY_FOCUS_SCENE_CRITICAL_BACKGROUND_FLOORS;
  for (const id of ["obj-capacity", "obj-inventory", "obj-delivery"]) {
    const object = bundle.presentation.scene.objects.find((o) => o.id === id)!;
    if (object.role !== "unrelated") continue;
    assert.ok(object.scale >= floors.minScale);
    assert.ok(object.opacity >= floors.minOpacity);
    assert.ok(object.emissiveIntensity >= floors.minEmissive);
  }
});

test("TEST 19 — no new computed-but-not-visible regression", () => {
  const bundle = pressureFocus("obj-revenue");
  assert.equal(bundle.audit.summary.computedButNotVisibleCount, 0);
});

test("TEST 20 — no new visually-misleading regression", () => {
  const bundle = pressureFocus("obj-revenue");
  assert.equal(bundle.audit.summary.visuallyMisleadingCount, 0);
});

test("TEST 21 — deterministic choreography validation output", () => {
  const a = pressureFocus("obj-revenue");
  const b = pressureFocus("obj-revenue");
  assert.deepEqual(a.presentation.scene.objects, b.presentation.scene.objects);
  assert.deepEqual(a.audit.findings, b.audit.findings);
  const observedA = extractObservedFocusScenePresentation(a.presentation);
  const observedB = extractObservedFocusScenePresentation(b.presentation);
  assert.deepEqual(observedA, observedB);
});

test("E2E — P2:8.1 focus-anchor becomes visible-and-consistent", () => {
  const beforeStatus = "visible-but-weak"; // documented prior P2:8.2 residual
  const bundle = pressureFocus("obj-revenue");
  const anchor = bundle.audit.findings.find(
    (entry) => entry.dimension === "focus-anchor",
  )!;
  assert.equal(anchor.status, "visible-and-consistent");
  assert.notEqual(anchor.status, beforeStatus);
  assert.equal(bundle.audit.summary.computedButNotVisibleCount, 0);
  assert.equal(bundle.audit.summary.visuallyMisleadingCount, 0);
});

test("E2E — Scenario E Revenue focus under Operational Pressure", () => {
  const bundle = pressureFocus("obj-revenue");
  const revenue = bundle.presentation.scene.objects.find(
    (o) => o.id === "obj-revenue",
  )!;
  assert.equal(revenue.executiveVisualState, "attention");
  assert.equal(revenue.focused, true);
  assert.equal(revenue.role, "focused");

  const capacity = bundle.presentation.scene.objects.find(
    (o) => o.id === "obj-capacity",
  )!;
  assert.equal(capacity.executiveVisualState, "critical");
  assert.equal(capacity.focused, false);
  assert.equal(capacity.role, "unrelated");

  assert.equal(
    bundle.presentation.scene.connections.some(
      (c) =>
        (c.sourceId === "obj-revenue" && c.targetId === "obj-capacity") ||
        (c.sourceId === "obj-capacity" && c.targetId === "obj-revenue"),
    ),
    false,
  );
  assert.deepEqual(
    bundle.presentation.scene.connections.map((c) => c.id).sort(),
    NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((c) => c.id).sort(),
  );
});

test("Direct validator — validateFocusSceneChoreography statuses", () => {
  const bundle = pressureFocus("obj-revenue");
  // Build a minimal validation by importing resolve path internals through observed
  // + rehydrating choreography from presentation roles.
  const observed = extractObservedFocusScenePresentation(bundle.presentation);
  assert.equal(observed.focusedObjectId, "obj-revenue");
  assert.equal(observed.objects.filter((o) => o.focused).length, 1);

  // Synthetic choreography mirror from observed roles for unit validation.
  const choreography = {
    anchorObjectId: "obj-revenue",
    objects: observed.objects.map((object, index) =>
      Object.freeze({
        objectId: object.objectId,
        role:
          object.role === "focused"
            ? ("anchor" as const)
            : object.role === "related"
              ? ("related" as const)
              : ("background" as const),
        focusRole: "none" as const,
        isAnchor: object.role === "focused",
        isRelated: object.role === "related",
        isBackground: object.role === "unrelated",
        retainAttention:
          object.role === "unrelated" &&
          object.executiveVisualState === "critical",
        targetPositionRole: "native" as const,
        targetScaleRole: "native" as const,
        targetOpacityRole: "full" as const,
        shouldReveal: true,
        shouldDeemphasize: object.role === "unrelated",
        transitionPriority: index,
      }),
    ),
    attentionRetention: Object.freeze({
      objectIds: Object.freeze(
        observed.objects
          .filter(
            (o) =>
              o.role === "unrelated" && o.executiveVisualState === "critical",
          )
          .map((o) => o.objectId),
      ),
      reason: "critical-recommended-unresolved" as const,
    }),
    relationshipSummaryPlaceholder: true,
  };

  const result = validateFocusSceneChoreography({
    scenario: "operational-pressure",
    choreography: choreography as never,
    connectionsContext: {
      relationshipSummary: {
        revealDepthHops: 1,
        maxDirectContextItems: 8,
        incidentConnectionCount: 0,
        revealedConnectionCount: 0,
        backgroundConnectionCount: 0,
        revealedContextCount: 0,
        retainedAttentionObjectCount: 0,
        fabricatedEdgeCount: 0,
      },
      connections: [],
      relatedObjects: [],
      contextItems: [],
      revealedConnectionIds: [],
      backgroundConnectionIds: [],
      revealedContextIds: [],
      retainedAttentionContextIds: [],
    } as never,
    observed,
  });

  assert.equal(result.summary.singleAnchor, true);
  assert.equal(result.summary.focusOwnsAnchor, true);
  assert.equal(result.summary.nonEdgesPreserved, true);
  assert.equal(result.summary.contextOneHop, true);
  assert.equal(result.summary.severitySuppressedCount, 0);
  assert.equal(result.summary.falseRelationshipCount, 0);
  assert.equal(result.summary.weakAnchorCount, 0);

  const again = validateFocusSceneChoreography({
    scenario: "operational-pressure",
    choreography: choreography as never,
    connectionsContext: {
      relationshipSummary: {
        revealDepthHops: 1,
        maxDirectContextItems: 8,
        incidentConnectionCount: 0,
        revealedConnectionCount: 0,
        backgroundConnectionCount: 0,
        revealedContextCount: 0,
        retainedAttentionObjectCount: 0,
        fabricatedEdgeCount: 0,
      },
      connections: [],
      relatedObjects: [],
      contextItems: [],
      revealedConnectionIds: [],
      backgroundConnectionIds: [],
      revealedContextIds: [],
      retainedAttentionContextIds: [],
    } as never,
    observed,
  });
  assert.deepEqual(result, again);
});

test("Source boundary — validator does not recompute engines", () => {
  const source = readFileSync(
    join(here, "dataRealityFocusSceneChoreographyValidation.ts"),
    "utf8",
  );
  assert.equal(source.includes("computeNexoraKPIs"), false);
  assert.equal(source.includes("resolveObjectExecutiveStates"), false);
  assert.equal(
    source.includes("resolveDataRealityAwareSceneChoreography("),
    false,
  );
  assert.equal(
    source.includes("resolveDataRealityAwareConnectionsContext("),
    false,
  );
});
