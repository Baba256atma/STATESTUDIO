/**
 * P2:8.4 — Connections & Context Visual Validation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_CONNECTIONS_CONTEXT_VISUAL_VALIDATION_BOUNDARY,
  dataRealityConnectionsContextVisualValidationArchitecturalRole,
  dataRealityConnectionsContextVisualValidationIdentity,
  dataRealityConnectionsContextVisualValidationNamespace,
  dataRealityConnectionsContextVisualValidationPhase,
  dataRealityConnectionsContextVisualValidationReadiness,
  dataRealityConnectionsContextVisualValidationVersion,
  extractObservedConnectionsContextVisualEvidence,
  getDataRealityConnectionsContextVisualValidationIdentity,
  resolveDataRealityConnectionVisualState,
  resolveDataRealityConnectionVisualStatesFromContext,
  resolveDataRealityContextVisualStatesFromContext,
  validateConnectionsContextVisual,
} from "./dataRealityConnectionsContextVisualValidation.ts";
import { resolveNexoraMVPDataRealityVisualStageAudit } from "../nex-mvp/nexoraMVPDataRealityVisualStageAudit.ts";
import { resolveNexoraMVPConnectionsContextVisualValidation } from "../nex-mvp/nexoraMVPDataRealityConnectionsContextVisualState.ts";
import { resolveDataRealityAwareMVPRuntimeState } from "./dataRealityAwareMVPRuntimeState.ts";
import { resolveDataRealityAwareFocusAttentionExperience } from "./dataRealityAwareFocusAttentionExperience.ts";
import { resolveDataRealityAwareSceneChoreography } from "./dataRealityAwareSceneChoreography.ts";
import { resolveDataRealityAwareConnectionsContext } from "./dataRealityAwareConnectionsContext.ts";
import { getExecutiveOperationsPressureDataset } from "./demo/executiveOperationsDemoDataset.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
} from "../nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import { DATA_REALITY_FOCUS_SCENE_CRITICAL_BACKGROUND_FLOORS } from "./dataRealityFocusSceneChoreographyValidation.ts";

const here = dirname(fileURLToPath(import.meta.url));

function pressureFocus(objectId: string) {
  return resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: objectId,
    focusedObjectId: objectId,
  });
}

function resolveP27(objectId: string) {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const runtimeState = resolveDataRealityAwareMVPRuntimeState({
    dataset: getExecutiveOperationsPressureDataset(),
    focusedObjectId: objectId,
    selectedObjectId: objectId,
    requestedIntent: "investigate",
    responseMode: "standard",
    presentationState: "report",
  });
  const focusAttention = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
    focusedObjectId: objectId,
    selectedObjectId: objectId,
    presentationState: "report",
  });
  const choreography = resolveDataRealityAwareSceneChoreography({
    focusAttention,
    stageObjects: catalog.objects.map((entry) =>
      Object.freeze({ objectId: entry.id }),
    ),
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    presentationState: "report",
  });
  const connectionsContext = resolveDataRealityAwareConnectionsContext({
    choreography,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    contextLinks: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
    contextSubjects: NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
    presentationState: "report",
  });
  return { choreography, connectionsContext };
}

function validateBundle(
  bundle: ReturnType<typeof resolveNexoraMVPDataRealityVisualStageAudit>,
  objectId: string | null,
) {
  const connectionsContext =
    objectId == null
      ? (() => {
          const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
          const runtimeState = resolveDataRealityAwareMVPRuntimeState({
            dataset: getExecutiveOperationsPressureDataset(),
            requestedIntent: "investigate",
            responseMode: "standard",
            presentationState: "report",
          });
          const focusAttention = resolveDataRealityAwareFocusAttentionExperience({
            runtimeState,
            presentationState: "report",
          });
          const choreography = resolveDataRealityAwareSceneChoreography({
            focusAttention,
            stageObjects: catalog.objects.map((entry) =>
              Object.freeze({ objectId: entry.id }),
            ),
            relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
            presentationState: "report",
          });
          return resolveDataRealityAwareConnectionsContext({
            choreography,
            relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
            contextLinks: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
            contextSubjects: NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
            presentationState: "report",
          });
        })()
      : resolveP27(objectId).connectionsContext;

  return resolveNexoraMVPConnectionsContextVisualValidation({
    scenario: bundle.scenario,
    presentation: bundle.presentation,
    connectionsContext,
  });
}

test("P2:8.4 identity and boundary", () => {
  const identity = getDataRealityConnectionsContextVisualValidationIdentity();
  assert.equal(
    dataRealityConnectionsContextVisualValidationIdentity,
    "P2:8.4/DataRealityConnectionsContextVisualValidation",
  );
  assert.equal(identity.version, "2.8.4");
  assert.equal(
    dataRealityConnectionsContextVisualValidationNamespace,
    "nexora.data-reality.connections-context-visual-validation",
  );
  assert.equal(
    dataRealityConnectionsContextVisualValidationPhase,
    "ConnectionsContextVisualValidation",
  );
  assert.equal(
    dataRealityConnectionsContextVisualValidationArchitecturalRole,
    "DataRealityConnectionsContextVisualValidationBoundary",
  );
  assert.equal(
    dataRealityConnectionsContextVisualValidationReadiness,
    "ReadyForDensityCameraExecutiveReadabilityValidation",
  );
  assert.equal(
    DATA_REALITY_CONNECTIONS_CONTEXT_VISUAL_VALIDATION_BOUNDARY.inventsRelationships,
    false,
  );
  assert.equal(
    DATA_REALITY_CONNECTIONS_CONTEXT_VISUAL_VALIDATION_BOUNDARY.infersCausality,
    false,
  );
  assert.equal(
    DATA_REALITY_CONNECTIONS_CONTEXT_VISUAL_VALIDATION_BOUNDARY.revealDepthHops,
    1,
  );
});

test("TEST 1 — anchor-incident canonical edges become foreground", () => {
  const bundle = pressureFocus("obj-revenue");
  const edge = bundle.presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.equal(edge.emphasized, true);
  assert.ok(edge.opacity >= 0.55);
  assert.equal(edge.visualRole, "anchor-incident");
});

test("TEST 2 — non-incident edges remain background/subdued", () => {
  const bundle = pressureFocus("obj-revenue");
  const edge = bundle.presentation.scene.connections.find(
    (entry) => entry.id === "rel-capacity-delivery",
  )!;
  assert.equal(edge.emphasized, false);
  assert.ok(edge.opacity <= 0.2);
  assert.equal(edge.visualRole, "background");
});

test("TEST 3 — canonical edge identity remains stable", () => {
  const bundle = pressureFocus("obj-revenue");
  assert.deepEqual(
    bundle.presentation.scene.connections.map((entry) => entry.id).sort(),
    NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((entry) => entry.id).sort(),
  );
});

test("TEST 4 — source/target direction is preserved", () => {
  const bundle = pressureFocus("obj-revenue");
  const edge = bundle.presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.equal(edge.sourceId, "obj-customer");
  assert.equal(edge.targetId, "obj-revenue");
  assert.equal(edge.directionCue, "source-to-target");
});

test("TEST 5 — canonical relation strings are preserved", () => {
  const visual = resolveDataRealityConnectionVisualState({
    connectionId: "rel-customer-revenue",
    sourceId: "obj-customer",
    targetId: "obj-revenue",
    relation: "related",
    direction: "directed",
    isAnchorIncident: true,
    isForeground: true,
    anchorObjectId: "obj-revenue",
  });
  assert.equal(visual.relation, "related");
  assert.equal(visual.impliesCausality, false);
  const bundle = pressureFocus("obj-revenue");
  const edge = bundle.presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.equal(edge.relation, "related");
  assert.equal(edge.impliesCausality, false);
});

test("TEST 6 — context remains 1-hop", () => {
  const { connectionsContext } = resolveP27("obj-revenue");
  assert.equal(connectionsContext.relationshipSummary.revealDepthHops, 1);
  const validated = validateBundle(pressureFocus("obj-revenue"), "obj-revenue");
  assert.equal(validated.validation.summary.revealDepthHops, 1);
  assert.equal(validated.validation.summary.falseContextCount, 0);
});

test("TEST 7 — hidden overflow remains hidden", () => {
  const { connectionsContext } = resolveP27("obj-revenue");
  const hidden = resolveDataRealityContextVisualStatesFromContext(
    connectionsContext,
  ).filter((entry) => entry.revealRole === "hidden");
  const bundle = pressureFocus("obj-revenue");
  for (const item of hidden) {
    const node = bundle.presentation.contextNodes.find(
      (entry) => entry.id === item.contextId,
    );
    if (node) assert.ok(node.opacity <= 0.2);
  }
});

test("TEST 8 — related context is visually associated with the anchor", () => {
  const bundle = pressureFocus("obj-revenue");
  assert.ok(bundle.presentation.contextNodes.length > 0);
  assert.ok(
    bundle.presentation.contextNodes.every(
      (node) => node.role === "context" && node.opacity >= 0.8,
    ),
  );
  assert.ok(
    bundle.presentation.contextConnections.some(
      (entry) =>
        entry.sourceId === "obj-revenue" &&
        entry.visualRole === "context" &&
        entry.opacity >= 0.5,
    ),
  );
});

test("TEST 9 — context does not accidentally become peer executive object", () => {
  const bundle = pressureFocus("obj-revenue");
  for (const node of bundle.presentation.contextNodes) {
    assert.ok(node.scale <= 0.72);
    assert.notEqual(node.kind, "object");
    assert.equal(node.role, "context");
  }
});

test("TEST 10 — competing attention does not gain anchor relationship styling", () => {
  const bundle = pressureFocus("obj-revenue");
  const capacityEdge = bundle.presentation.scene.connections.find(
    (entry) =>
      (entry.sourceId === "obj-revenue" && entry.targetId === "obj-capacity") ||
      (entry.sourceId === "obj-capacity" && entry.targetId === "obj-revenue"),
  );
  assert.equal(capacityEdge, undefined);
  const capacity = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  assert.equal(capacity.role, "unrelated");
  assert.equal(capacity.executiveVisualState, "critical");
});

test("TEST 11 — proximity alone does not create relation styling", () => {
  const bundle = pressureFocus("obj-revenue");
  // No unexpected edges beyond canonical fixture set.
  for (const connection of bundle.presentation.scene.connections) {
    assert.ok(
      NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.some(
        (entry) => entry.id === connection.id,
      ),
    );
  }
});

test("TEST 12 — Revenue ↔ Capacity remains non-edge", () => {
  const bundle = pressureFocus("obj-revenue");
  const fabricated = bundle.presentation.scene.connections.some(
    (entry) =>
      (entry.sourceId === "obj-revenue" &&
        entry.targetId === "obj-capacity") ||
      (entry.sourceId === "obj-capacity" && entry.targetId === "obj-revenue"),
  );
  assert.equal(fabricated, false);
  const validated = validateBundle(bundle, "obj-revenue");
  assert.equal(validated.validation.summary.falseRelationshipCount, 0);
  assert.equal(validated.validation.summary.nonEdgesPreserved, true);
});

test("TEST 13 — no false edge from simultaneous critical severity", () => {
  const bundle = pressureFocus("obj-revenue");
  const criticalIds = bundle.presentation.scene.objects
    .filter((entry) => entry.executiveVisualState === "critical")
    .map((entry) => entry.id);
  assert.ok(criticalIds.includes("obj-capacity"));
  assert.ok(criticalIds.includes("obj-customer"));
  // Customer may be related; Capacity must not gain an edge from severity.
  assert.equal(
    bundle.presentation.scene.connections.some(
      (entry) =>
        entry.emphasized &&
        ((entry.sourceId === "obj-revenue" &&
          entry.targetId === "obj-capacity") ||
          (entry.sourceId === "obj-capacity" &&
            entry.targetId === "obj-revenue")),
    ),
    false,
  );
});

test("TEST 14 — focus switch transfers foreground edge ownership", () => {
  const revenue = pressureFocus("obj-revenue");
  const inventory = pressureFocus("obj-inventory");
  const revenueForeground = revenue.presentation.scene.connections
    .filter((entry) => entry.emphasized)
    .map((entry) => entry.id)
    .sort();
  const inventoryForeground = inventory.presentation.scene.connections
    .filter((entry) => entry.emphasized)
    .map((entry) => entry.id)
    .sort();
  assert.ok(revenueForeground.includes("rel-customer-revenue"));
  assert.ok(inventoryForeground.includes("rel-inventory-capacity"));
  assert.notDeepEqual(revenueForeground, inventoryForeground);
});

test("TEST 15 — prior anchor edges are not stale after switch", () => {
  const inventory = pressureFocus("obj-inventory");
  const customerRevenue = inventory.presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.equal(customerRevenue.emphasized, false);
  assert.ok(customerRevenue.opacity <= 0.2);
  assert.equal(customerRevenue.visualRole, "background");
});

test("TEST 16 — clear focus removes anchor-local relationship emphasis", () => {
  const cleared = resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
  assert.equal(cleared.presentation.scene.mode, "overview");
  assert.equal(
    cleared.presentation.scene.connections.every(
      (entry) => entry.emphasized === false,
    ),
    true,
  );
  assert.equal(cleared.presentation.contextNodes.length, 0);
});

test("TEST 17 — executive severity remains unchanged by edge styling", () => {
  const bundle = pressureFocus("obj-revenue");
  const customer = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-customer",
  )!;
  assert.equal(customer.executiveVisualState, "critical");
  assert.equal(customer.stateMarker, "critical");
  const edge = bundle.presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.equal(edge.emphasized, true);
});

test("TEST 18 — P2:8.3 focus hierarchy remains intact", () => {
  const bundle = pressureFocus("obj-revenue");
  const revenue = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-revenue",
  )!;
  assert.equal(revenue.focused, true);
  assert.equal(revenue.role, "focused");
  assert.deepEqual(revenue.targetPosition, [0, 0.42, 0]);
  const focused = bundle.presentation.scene.objects.filter((entry) => entry.focused);
  assert.equal(focused.length, 1);
});

test("TEST 19 — P2:8.2 critical discoverability remains intact", () => {
  const bundle = pressureFocus("obj-revenue");
  const floors = DATA_REALITY_FOCUS_SCENE_CRITICAL_BACKGROUND_FLOORS;
  const capacity = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  assert.equal(capacity.role, "unrelated");
  assert.ok(capacity.scale >= floors.minScale);
  assert.ok(capacity.opacity >= floors.minOpacity);
  assert.ok(capacity.emissiveIntensity >= floors.minEmissive);
});

test("TEST 20 — no computed-but-not-visible regression", () => {
  const bundle = pressureFocus("obj-revenue");
  assert.equal(bundle.audit.summary.computedButNotVisibleCount, 0);
});

test("TEST 21 — no visually-misleading regression", () => {
  const bundle = pressureFocus("obj-revenue");
  assert.equal(bundle.audit.summary.visuallyMisleadingCount, 0);
});

test("TEST 22 — same canonical input produces deterministic visual output", () => {
  const a = pressureFocus("obj-revenue");
  const b = pressureFocus("obj-revenue");
  assert.deepEqual(a.presentation.scene.connections, b.presentation.scene.connections);
  assert.deepEqual(a.presentation.contextNodes, b.presentation.contextNodes);
  const va = validateBundle(a, "obj-revenue");
  const vb = validateBundle(b, "obj-revenue");
  assert.deepEqual(va.validation, vb.validation);
});

test("E2E — Scenario E critical related object keeps severity + relation separate", () => {
  const bundle = pressureFocus("obj-revenue");
  const customer = bundle.presentation.scene.objects.find(
    (entry) => entry.id === "obj-customer",
  )!;
  const edge = bundle.presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  )!;
  assert.equal(customer.role, "related");
  assert.equal(customer.executiveVisualState, "critical");
  assert.equal(customer.stateMarker, "critical");
  assert.equal(edge.visualRole, "anchor-incident");
  assert.equal(edge.emphasized, true);
});

test("E2E — P2:8.1 connections/context remain visible-and-consistent", () => {
  const bundle = pressureFocus("obj-revenue");
  const connectionFindings = bundle.audit.findings.filter(
    (entry) => entry.dimension === "connections",
  );
  const contextFindings = bundle.audit.findings.filter(
    (entry) => entry.dimension === "context",
  );
  assert.ok(
    connectionFindings.every(
      (entry) =>
        entry.status === "visible-and-consistent" ||
        entry.status === "not-applicable",
    ),
  );
  assert.ok(
    contextFindings.every((entry) => entry.status === "visible-and-consistent"),
  );
  assert.equal(bundle.audit.summary.computedButNotVisibleCount, 0);
  assert.equal(bundle.audit.summary.visuallyMisleadingCount, 0);
});

test("Direct resolver — overview subdues edges", () => {
  const visual = resolveDataRealityConnectionVisualState({
    connectionId: "rel-customer-revenue",
    sourceId: "obj-customer",
    targetId: "obj-revenue",
    relation: "related",
    direction: "directed",
  });
  assert.equal(visual.role, "background");
  assert.equal(visual.emphasis, "background");
  assert.ok(visual.opacity <= 0.28);
  assert.equal(visual.directionCue, "none");
});

test("Source boundary — module does not recompute engines", () => {
  const source = readFileSync(
    join(here, "dataRealityConnectionsContextVisualValidation.ts"),
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
  assert.ok(source.includes("inventsRelationships: false"));
});

test("extractObservedConnectionsContextVisualEvidence is deterministic", () => {
  const bundle = pressureFocus("obj-revenue");
  const a = extractObservedConnectionsContextVisualEvidence(bundle.presentation);
  const b = extractObservedConnectionsContextVisualEvidence(bundle.presentation);
  assert.deepEqual(a, b);
  assert.ok(a.connections.some((entry) => entry.visualRole === "anchor-incident"));
});
