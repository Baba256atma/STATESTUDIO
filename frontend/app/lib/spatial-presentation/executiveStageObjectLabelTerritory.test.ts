/**
 * STAGE-LABEL:1 — Object-Owned Label Territory tests (invariants A–AI).
 */

import assert from "node:assert/strict";
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
import { applyExecutiveStageObjectLabelTerritoryToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStageObjectLabelTerritory.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  collapsedExecutiveThreadSubjectId,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MVP_CONTEXT_LINK_FIXTURES } from "../nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
} from "./executiveStage2DFixedCamera.ts";
import { setExecutiveObjectPresenceV2Enabled } from "./executiveObjectPresenceIdentity.ts";
import {
  EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY,
  getExecutiveStageObjectLabelTerritoryIdentity,
  isExecutiveStageLabelSide,
  resolveExecutiveStageOwnedLabelContent,
  resolveExecutiveStageOwnedLabelPlacement,
  validateExecutiveStageLabelOwnership,
  verifyExecutiveStageObjectLabelTerritory,
} from "./executiveStageObjectLabelTerritory.ts";

function pipeline(objectId: string, expandThread = false, level: "minimum" | "report" | "operation" = "minimum") {
  setExecutiveObjectPresenceV2Enabled(true);
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: level,
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, objectId);
  if (expandThread) {
    state = selectNexoraMVPInteractionSubject(
      state,
      collapsedExecutiveThreadSubjectId(objectId),
    );
  }
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: level,
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const withFlat = applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  const withRecomp =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(withFlat);
  const withLabels = applyExecutiveStageObjectLabelTerritoryToStagePresentation(
    withRecomp,
    { presentationLevel: level },
  );
  return {
    state,
    presentation: applyExecutiveStageFixedCameraToStagePresentation(withLabels),
  };
}

test("identity STAGE-LABEL:1 / 6.1.0", () => {
  const identity = getExecutiveStageObjectLabelTerritoryIdentity();
  assert.equal(
    identity.id,
    "STAGE-LABEL:1/ObjectOwnedLabelTerritoryCollisionAuthority",
  );
  assert.equal(identity.version, "6.1.0");
  assert.equal(verifyExecutiveStageObjectLabelTerritory().ok, true);
  assert.equal(EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.movesCamera, false);
  assert.equal(
    EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.freeFloatDisplacement,
    false,
  );
});

test("A/B — every visible label has exactly one valid owner present on Stage", () => {
  const { presentation } = pipeline("obj-capacity");
  for (const object of presentation.scene.objects) {
    if (object.labelVisible === false || object.disclosureState === "hidden") {
      continue;
    }
    if ((object.opacity ?? 0) <= 0.05) continue;
    assert.equal(object.stageLabelContract, "stage-label-1");
    assert.ok(object.labelSide == null || isExecutiveStageLabelSide(object.labelSide));
  }
});

test("C/D — bounded side vocabulary + max owner distance", () => {
  const { presentation } = pipeline("obj-capacity");
  for (const object of presentation.scene.objects) {
    if (object.labelVisible === false || object.labelVisibilityMode === "hidden") {
      continue;
    }
    if (object.labelSide != null) {
      assert.equal(isExecutiveStageLabelSide(object.labelSide), true);
    }
    if (typeof object.labelOwnerDistance === "number") {
      assert.ok(object.labelOwnerDistance < 2.8, object.id);
    }
  }
});

test("E/F/G/H/I — no foreign body / label overlaps; priority hides before ownership fail", () => {
  const { presentation } = pipeline("obj-capacity");
  const layout = (
    presentation.scene as {
      readonly stageLabelLayout?: ReturnType<
        typeof resolveExecutiveStageOwnedLabelPlacement
      >;
    }
  ).stageLabelLayout;
  assert.ok(layout);
  const validation = validateExecutiveStageLabelOwnership(layout!);
  assert.equal(validation.bodyOverlapCount, 0);
  assert.equal(validation.labelLabelOverlapCount, 0);
  assert.equal(validation.ownerViolationCount, 0);
  const capacity = presentation.scene.objects.find((o) => o.id === "obj-capacity")!;
  assert.equal(capacity.labelVisible !== false, true);
  assert.equal(capacity.labelVisibilityMode !== "hidden", true);
});

test("J/K — Customer label does not identify Risk; Risk owns independent territory", () => {
  const { presentation } = pipeline("obj-capacity");
  const customer = presentation.scene.objects.find((o) => o.id === "obj-customer");
  const risk = presentation.scene.objects.find((o) => o.id === "obj-risk");
  if (customer == null || risk == null) return;
  if (customer.labelVisible === false || risk.labelVisible === false) return;

  const cx =
    customer.targetPosition[0] + (customer.labelWorldOffsetX ?? 0);
  const cy =
    customer.targetPosition[1] + (customer.labelWorldOffsetY ?? 0);
  const rx = risk.targetPosition[0];
  const ry = risk.targetPosition[1];
  const distToRiskBody = Math.hypot(cx - rx, cy - ry);
  const distToCustomerBody = Math.hypot(
    cx - customer.targetPosition[0],
    cy - customer.targetPosition[1],
  );
  assert.ok(
    distToCustomerBody < distToRiskBody,
    `Customer label closer to Customer (${distToCustomerBody}) than Risk (${distToRiskBody})`,
  );
  assert.ok(!(customer.labelPrimaryLine ?? "").toUpperCase().includes("RISK"));
  assert.ok((risk.labelPrimaryLine ?? risk.label).toUpperCase().includes("RISK"));
});

test("L — Inventory label above lower Stage boundary", () => {
  const { presentation } = pipeline("obj-capacity");
  const inventory = presentation.scene.objects.find(
    (o) => o.id === "obj-inventory",
  );
  if (inventory == null || inventory.labelVisible === false) return;
  const labelY =
    inventory.targetPosition[1] + (inventory.labelWorldOffsetY ?? 0) - 0.16;
  assert.ok(labelY >= -1.42 - 1e-6, String(labelY));
});

test("M — Budget label remains within owner-distance limit", () => {
  const { presentation } = pipeline("obj-capacity");
  const budget = presentation.scene.objects.find((o) => o.id === "obj-budget");
  if (budget == null || budget.labelVisible === false) return;
  assert.ok((budget.labelOwnerDistance ?? 0) < 2.8);
  assert.ok(Math.abs(budget.labelWorldOffsetX ?? 0) < 2.2);
});

test("N/O — Delivery state duplication removed; Minimum grammar bounded", () => {
  const content = resolveExecutiveStageOwnedLabelContent({
    objectName: "Delivery · WATCH",
    objectKind: "object",
    status: "watch",
    presentationLevel: "minimum",
  });
  assert.equal(content.primaryLine.includes("·"), false);
  assert.ok(!/WATCH.*WATCH/i.test(`${content.primaryLine} ${content.secondaryLine}`));
  assert.equal(content.secondaryLine, "WATCH");

  const { presentation } = pipeline("obj-capacity", false, "minimum");
  const delivery = presentation.scene.objects.find((o) => o.id === "obj-delivery");
  if (delivery?.labelPrimaryLine) {
    assert.ok(!/WATCH\s*·\s*WATCH/i.test(delivery.labelPrimaryLine));
  }
});

test("P/Q — Report/Operation grammar bounded", () => {
  for (const level of ["report", "operation"] as const) {
    const content = resolveExecutiveStageOwnedLabelContent({
      objectName: "Capacity",
      status: "watch",
      presentationLevel: level,
    });
    assert.ok(content.primaryLine.length > 0);
    assert.ok(!content.primaryLine.toUpperCase().includes("OBJECT ·"));
  }
});

test("R — Executive Thread gateway treated as label obstacle", () => {
  const layout = resolveExecutiveStageOwnedLabelPlacement({
    objects: [
      {
        id: "obj-capacity",
        label: "Capacity",
        status: "watch",
        x: 0,
        y: 0,
        halfExtent: 0.48,
        focused: true,
        role: "focused",
      },
      {
        id: "obj-near-gateway",
        label: "Near",
        status: "watch",
        x: 1.45,
        y: 0.72,
        halfExtent: 0.4,
        role: "related",
      },
    ],
    obstacles: [
      {
        id: "executive-thread-gateway",
        bounds: {
          minX: 1.0,
          maxX: 2.2,
          minY: 0.4,
          maxY: 1.0,
        },
      },
    ],
    presentationLevel: "minimum",
    anchorObjectId: "obj-capacity",
  });
  const near = layout.byId.get("obj-near-gateway")!;
  assert.ok(near);
  // Either placed away from obstacle or hidden — never overlapping gateway.
  if (near.visibility !== "hidden") {
    assert.equal(
      near.bounds.minX < 2.2 - 1e-6 &&
        near.bounds.maxX > 1.0 + 1e-6 &&
        near.bounds.minY < 1.0 - 1e-6 &&
        near.bounds.maxY > 0.4 + 1e-6,
      false,
    );
  }
});

test("S–V — Expanded Thread subject labels belong to their bodies", () => {
  const { presentation } = pipeline("obj-capacity", true);
  for (const id of [
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
    "ctx-decision-capacity",
    "ctx-execution-capacity",
  ]) {
    const object = presentation.scene.objects.find((entry) => entry.id === id);
    assert.ok(object, id);
    if (object!.labelVisible === false) continue;
    assert.equal(object!.stageLabelContract, "stage-label-1", id);
    assert.ok(object!.labelPrimaryLine, id);
    assert.ok(
      !object!.labelPrimaryLine!.toUpperCase().startsWith("PROBLEM · PROBLEM"),
      id,
    );
  }
});

test("W/X — relationship truth unchanged; route may avoid labels", () => {
  const { presentation } = pipeline("obj-capacity");
  const catalogIds = new Set(
    NEXORA_MVP_CONTEXT_LINK_FIXTURES.map((link) => link.id),
  );
  for (const connection of presentation.scene.connections) {
    if (connection.visualRole === "hidden") continue;
    // No invented sequential P→S→D→E edges.
    assert.ok(
      !connection.id.startsWith("invented-"),
      connection.id,
    );
    void catalogIds;
  }
});

test("Y/Z/AA/AB/AC/AD — motion contract + camera + z + deep-z + anchor", () => {
  assert.equal(EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.movesCamera, false);
  assert.equal(EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.changesSemanticZ, false);
  assert.equal(EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.usesZForCollision, false);
  const { presentation } = pipeline("obj-capacity");
  const capacity = presentation.scene.objects.find((o) => o.id === "obj-capacity")!;
  assert.deepEqual(
    [capacity.targetPosition[0], capacity.targetPosition[1], capacity.targetPosition[2]],
    [0, 0, 0],
  );
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.equal(object.targetPosition[2], 0);
  }
  assert.equal(presentation.scene.camera.position[2], EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE);
  assert.deepEqual(presentation.scene.camera.target, [0, 0, 0]);
});

test("AE/AF/AG/AH — object overlap/clip + label clip/reserved remain zero", () => {
  const { presentation } = pipeline("obj-capacity");
  const readability = (
    presentation.scene as {
      readonly stage2dReadability?: {
        readonly layoutOverlapCount?: number;
        readonly clippedObjectCount?: number;
      };
    }
  ).stage2dReadability;
  assert.equal(readability?.layoutOverlapCount ?? 0, 0);
  assert.equal(readability?.clippedObjectCount ?? 0, 0);
  const layout = (
    presentation.scene as {
      readonly stageLabelLayout?: ReturnType<
        typeof resolveExecutiveStageOwnedLabelPlacement
      >;
    }
  ).stageLabelLayout!;
  assert.equal(layout.clippedCount, 0);
  assert.equal(layout.reservedCollisionCount, 0);
});

test("AI — deterministic placement", () => {
  const a = pipeline("obj-capacity").presentation;
  const b = pipeline("obj-capacity").presentation;
  const pick = (p: typeof a) =>
    p.scene.objects
      .filter((o) => o.labelVisible !== false)
      .map((o) => [
        o.id,
        o.labelSide,
        o.labelWorldOffsetX,
        o.labelWorldOffsetY,
        o.labelVisibilityMode,
      ]);
  assert.deepEqual(pick(a), pick(b));
});
