/**
 * STAGE-OBJ:4 — Executive Stage Visual Balance & Final Object Certification.
 */

import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  applyExecutiveStageFixedCameraToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import {
  applyExecutiveStage2DTopologyPlaneToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import {
  applyExecutiveStage2DTopologyRecompositionToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
} from "./executiveStage2DFixedCamera.ts";
import { resolveExecutiveStage2DTopologyReadability } from "./executiveStage2DTopologyReadability.ts";
import {
  EXECUTIVE_STAGE_VISUAL_BALANCE_BOUNDARY,
  EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET,
  countAnchorPeripheralRenderedEdges,
  enforceExecutiveStageNoOrphanLabel,
  getExecutiveStageVisualBalanceIdentity,
  isExecutiveStagePeripheralEligible,
  rankExecutiveStagePeripheralCandidate,
  resolveExecutiveStageVisualBalance,
  selectExecutiveStagePeripheralObjectIds,
  verifyExecutiveStageVisualBalance,
} from "./executiveStageVisualBalance.ts";
import { setExecutiveObjectPresenceV2Enabled } from "./executiveObjectPresenceIdentity.ts";

const here = dirname(fileURLToPath(import.meta.url));
void here;

function pipeline(objectId: string) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, objectId);
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: "minimum",
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const withFlat = applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  const withRecomp =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(withFlat);
  return applyExecutiveStageFixedCameraToStagePresentation(withRecomp);
}

function canonicalEdge(a: string, b: string): boolean {
  return NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.some(
    (edge) =>
      (edge.sourceId === a && edge.targetId === b) ||
      (edge.sourceId === b && edge.targetId === a),
  );
}

test("identity STAGE-OBJ:4 / 4.4.0", () => {
  const identity = getExecutiveStageVisualBalanceIdentity();
  assert.equal(
    identity.id,
    "STAGE-OBJ:4/ExecutiveStageVisualBalanceFinalObjectCertification",
  );
  assert.equal(identity.version, "4.4.0");
  assert.equal(verifyExecutiveStageVisualBalance().ok, true);
  assert.equal(
    EXECUTIVE_STAGE_VISUAL_BALANCE_BOUNDARY.inventsRelationships,
    false,
  );
});

test("A–F — one anchor at origin, z=0, camera fixed", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const presentation = pipeline("obj-capacity");
  assert.equal(presentation.scene.focusedObjectId, "obj-capacity");
  const anchor = presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  assert.deepEqual(anchor.targetPosition, [0, 0, 0]);
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.equal(object.targetPosition[2], 0);
  }
  assert.deepEqual(presentation.scene.camera.position, [
    0,
    0,
    EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  ]);
  assert.deepEqual(presentation.scene.camera.target, [0, 0, 0]);
});

test("I/X — related only from canonical 1-hop", () => {
  const layout = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-capacity",
    presentationState: "minimum",
    objects: [
      "obj-budget",
      "obj-capacity",
      "obj-delivery",
      "obj-revenue",
      "obj-customer",
      "obj-risk",
      "obj-inventory",
      "obj-demand",
    ].map((id) => Object.freeze({ objectId: id })),
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((edge) =>
      Object.freeze({
        id: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      }),
    ),
  });
  for (const relatedId of layout.relatedObjectIds) {
    assert.equal(canonicalEdge("obj-capacity", relatedId), true);
  }
  assert.equal(layout.neighborhoodDepth, 1);
});

test("J/K/AG — peripheral visibility never invents Capacity↔peripheral edge", () => {
  const presentation = pipeline("obj-capacity");
  const peripheral = presentation.scene.objects.filter(
    (object) => object.role === "peripheral",
  );
  assert.ok(peripheral.length >= 1);
  for (const object of peripheral) {
    const rendered = countAnchorPeripheralRenderedEdges({
      anchorObjectId: "obj-capacity",
      peripheralObjectId: object.id,
      renderedConnections: presentation.scene.connections,
      canonicalEdgeExists: canonicalEdge("obj-capacity", object.id),
    });
    if (!canonicalEdge("obj-capacity", object.id)) {
      assert.equal(rendered, 0);
    }
  }
});

test("Capacity→Budget — related body + owned label + canonical edge only", () => {
  const presentation = pipeline("obj-capacity");
  const budget = presentation.scene.objects.find(
    (object) => object.id === "obj-budget",
  )!;
  assert.equal(budget.role, "related");
  assert.ok(budget.opacity >= EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET.relatedBodyOpacityMin);
  assert.equal(budget.labelVisible, true);
  assert.ok(budget.targetPosition[0] !== 0 || budget.targetPosition[1] !== 0);
  assert.equal(canonicalEdge("obj-capacity", "obj-budget"), true);
  const edge = presentation.scene.connections.find(
    (connection) =>
      (connection.sourceId === "obj-capacity" &&
        connection.targetId === "obj-budget") ||
      (connection.sourceId === "obj-budget" &&
        connection.targetId === "obj-capacity"),
  );
  assert.ok(edge);
  assert.notEqual(edge!.visualRole, "hidden");
});

test("L/M/AH — no orphan labels; peripheral keeps recognizable body", () => {
  const presentation = pipeline("obj-capacity");
  for (const object of presentation.scene.objects) {
    if (object.labelVisible === false) continue;
    assert.ok(
      object.opacity >=
        EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET.orphanLabelMinBodyOpacity,
      `${object.id} orphan label`,
    );
  }
  const peripheral = presentation.scene.objects.filter(
    (object) => object.role === "peripheral",
  );
  for (const object of peripheral) {
    assert.ok(
      object.opacity >=
        EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET.peripheralBodyOpacityMin,
    );
    assert.ok(object.scale >= EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET.peripheralScaleMin);
    assert.equal(object.labelVisible, true);
  }
  assert.equal(
    enforceExecutiveStageNoOrphanLabel({
      bodyOpacity: 0.1,
      labelVisible: true,
    }),
    false,
  );
});

test("AA — peripheral ranking uses existing executive truth only", () => {
  assert.ok(
    rankExecutiveStagePeripheralCandidate({ attention: "critical" }) >
      rankExecutiveStagePeripheralCandidate({ status: "watch" }),
  );
  assert.equal(
    isExecutiveStagePeripheralEligible({ attention: "normal", status: "stable" }),
    false,
  );
  const selected = selectExecutiveStagePeripheralObjectIds({
    candidates: [
      { objectId: "a", attention: "elevated" },
      { objectId: "b", attention: "critical" },
      { objectId: "c", status: "unresolved" },
      { objectId: "d", attention: "important" },
      { objectId: "e", attention: "normal" },
    ],
    excludeIds: new Set(),
    maxPeripheral: 3,
  });
  assert.deepEqual(selected, ["b", "d", "c"]);
  assert.ok(selected.length <= EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET.maxPeripheral);
});

test("G/H — hard overlap 0", () => {
  const layout = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-capacity",
    presentationState: "minimum",
    objects: [
      "obj-budget",
      "obj-capacity",
      "obj-delivery",
      "obj-revenue",
      "obj-customer",
      "obj-risk",
      "obj-inventory",
      "obj-demand",
    ].map((id) =>
      Object.freeze({
        objectId: id,
        attention:
          id === "obj-risk"
            ? "critical"
            : id === "obj-customer"
              ? "important"
              : "normal",
        status: id === "obj-demand" ? "watch" : "stable",
      }),
    ),
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((edge) =>
      Object.freeze({
        id: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      }),
    ),
  });
  assert.equal(layout.layoutOverlapCount ?? 0, 0);
});

test("V/W — visual balance never moves anchor / relationship truth", () => {
  assert.equal(EXECUTIVE_STAGE_VISUAL_BALANCE_BOUNDARY.movesAnchor, false);
  assert.equal(
    EXECUTIVE_STAGE_VISUAL_BALANCE_BOUNDARY.changesRelationshipTruth,
    false,
  );
  const diagnostic = resolveExecutiveStageVisualBalance({
    positions: {
      a: { x: 0, y: 0 },
      b: { x: 1, y: 0 },
      c: { x: -1, y: 1 },
    },
    visualRoles: {
      a: "anchor",
      b: "related",
      c: "peripheral",
    },
    labelVisibleCount: 3,
    primaryEdgeCount: 1,
  });
  assert.ok(Number.isFinite(diagnostic.visualCentroidX));
  assert.ok(Number.isFinite(diagnostic.leftRightBalance));
});

test("AB — Advisor/focus subject remains Capacity when Capacity clicked", () => {
  const presentation = pipeline("obj-capacity");
  assert.equal(presentation.focusedSubjectId, "obj-capacity");
  assert.equal(presentation.scene.focusedObjectId, "obj-capacity");
  assert.equal(
    presentation.scene.selectedObjectId ?? presentation.scene.focusedObjectId,
    "obj-capacity",
  );
});
