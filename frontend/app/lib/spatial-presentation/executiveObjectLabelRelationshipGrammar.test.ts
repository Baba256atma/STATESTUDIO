/**
 * STAGE-OBJ:3 — Label & Relationship Readability Grammar invariants A–AD.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
} from "./executiveStage2DFixedCamera.ts";
import { resolveExecutiveStage2DTopologyReadability } from "./executiveStage2DTopologyReadability.ts";
import {
  resolveExecutiveObjectLabelCollisions,
  resolveExecutiveObjectLabelPresentation,
} from "./executiveObjectLabelInformationDensity.ts";
import {
  EXECUTIVE_OBJECT_LABEL_RELATIONSHIP_GRAMMAR_BOUNDARY,
  EXECUTIVE_STAGE_LABEL_SECTOR_TO_SIDE,
  EXECUTIVE_STAGE_RELATIONSHIP_VISUAL_ROLE,
  EXECUTIVE_STAGE_SECTOR_BREATHING,
  applyExecutiveStageSectorBreathing,
  formatExecutiveObjectStageLabel,
  getExecutiveObjectLabelRelationshipGrammarIdentity,
  resolveExecutiveLabelPlacementSideForSector,
  resolveExecutiveLabelVisibilityClass,
  resolveExecutiveObjectLabelGrammarPresentation,
  resolveExecutiveStageAngularSector,
  verifyExecutiveObjectLabelRelationshipGrammar,
} from "./executiveObjectLabelRelationshipGrammar.ts";
import { setExecutiveObjectPresenceV2Enabled } from "./executiveObjectPresenceIdentity.ts";

const here = dirname(fileURLToPath(import.meta.url));

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

function readability(objectId: string) {
  return resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: objectId,
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
    relationships: [
      Object.freeze({ id: "r1", sourceId: "obj-budget", targetId: "obj-capacity" }),
      Object.freeze({ id: "r2", sourceId: "obj-budget", targetId: "obj-delivery" }),
      Object.freeze({ id: "r3", sourceId: "obj-capacity", targetId: "obj-delivery" }),
      Object.freeze({ id: "r4", sourceId: "obj-delivery", targetId: "obj-customer" }),
      Object.freeze({ id: "r5", sourceId: "obj-revenue", targetId: "obj-customer" }),
      Object.freeze({ id: "r6", sourceId: "obj-revenue", targetId: "obj-budget" }),
      Object.freeze({ id: "r7", sourceId: "obj-capacity", targetId: "obj-inventory" }),
      Object.freeze({ id: "r8", sourceId: "obj-delivery", targetId: "obj-risk" }),
    ],
  });
}

test("identity STAGE-OBJ:3 / 4.3.0", () => {
  const identity = getExecutiveObjectLabelRelationshipGrammarIdentity();
  assert.equal(
    identity.id,
    "STAGE-OBJ:3/ExecutiveObjectLabelRelationshipReadabilityGrammar",
  );
  assert.equal(identity.version, "4.3.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-object-label-relationship-grammar",
  );
  assert.equal(verifyExecutiveObjectLabelRelationshipGrammar().ok, true);
});

test("A–E — semantic z=0, anchor, camera, geometry/Deep-Z boundary untouched", () => {
  const presentation = pipeline("obj-revenue");
  const anchor = presentation.scene.objects.find(
    (entry) => entry.id === "obj-revenue",
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
  const layout = readability("obj-revenue");
  assert.equal(layout.anchorPosition.x, 0);
  assert.equal(layout.anchorPosition.y, 0);
  assert.equal(layout.anchorPosition.z, 0);
  assert.equal(
    EXECUTIVE_OBJECT_LABEL_RELATIONSHIP_GRAMMAR_BOUNDARY.changesSemanticZ,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_LABEL_RELATIONSHIP_GRAMMAR_BOUNDARY.movesCamera,
    false,
  );
});

test("F — hard XY overlap remains 0", () => {
  const layout = readability("obj-revenue");
  assert.equal(layout.layoutOverlapCount ?? 0, 0);
  assert.ok(
    layout.layoutStatus === "valid" || layout.layoutStatus === "degraded",
  );
});

test("G–J — anchor label priority / collision hide lower first", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const resolved = resolveExecutiveObjectLabelCollisions({
    candidates: [
      {
        objectId: "anchor",
        priorityRank: 100,
        stageOrder: 0,
        level: "detail",
        prominence: "full",
        visible: true,
        screenX: 640,
        screenY: 360,
        width: 120,
        height: 36,
        preferredPlacementSide: "top",
      },
      {
        objectId: "neighbor",
        priorityRank: 70,
        stageOrder: 1,
        level: "identity",
        prominence: "normal",
        visible: true,
        screenX: 640,
        screenY: 360,
        width: 120,
        height: 36,
        preferredPlacementSide: "right",
      },
      {
        objectId: "background",
        priorityRank: 20,
        stageOrder: 2,
        level: "identity",
        prominence: "minimal",
        visible: true,
        screenX: 640,
        screenY: 360,
        width: 120,
        height: 36,
        preferredPlacementSide: "bottom",
      },
    ],
    viewportWidth: 1280,
    viewportHeight: 720,
  });
  assert.equal(resolved.byId.get("anchor")?.visible, true);
  assert.ok(
    resolved.byId.get("background")?.action === "hide" ||
      resolved.byId.get("background")?.visible === false ||
      resolved.byId.get("neighbor")?.action !== "none",
  );
});

test("K — reserved regions escape (dial) remains in collision authority", () => {
  const source = readFileSync(
    join(here, "executiveObjectLabelInformationDensity.ts"),
    "utf8",
  );
  assert.match(source, /isInDialExclusion/);
  assert.match(source, /EXECUTIVE_SAFE_FRAMING_MARGINS/);
});

test("L — redundant semantic-kind formatter cleans presentation only", () => {
  const a = formatExecutiveObjectStageLabel({
    objectName: "SCENARIO · SCENARIO · Pricing Response",
    objectKind: "scenario",
    stateText: "watch",
  });
  assert.equal(a.primaryLine.includes("SCENARIO · SCENARIO"), false);
  assert.match(a.primaryLine, /PRICING RESPONSE/i);
  assert.equal(a.cleanedKindPrefix, true);
  assert.equal(a.secondaryLine, "watch");

  const b = formatExecutiveObjectStageLabel({
    objectName: "DECISION · DECISION · Approve Repricing",
    objectKind: "decision",
  });
  assert.equal(b.primaryLine.includes("DECISION · DECISION"), false);
});

test("M–N / U / X — relationship truth & 1-hop unchanged by breathing", () => {
  assert.equal(
    EXECUTIVE_OBJECT_LABEL_RELATIONSHIP_GRAMMAR_BOUNDARY.inventsRelationships,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_LABEL_RELATIONSHIP_GRAMMAR_BOUNDARY.changesRelationshipTruth,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_LABEL_RELATIONSHIP_GRAMMAR_BOUNDARY.changesNeighborhoodDepth,
    false,
  );
  const layout = readability("obj-revenue");
  assert.equal(layout.mode, "anchored");
  assert.ok((layout.relatedObjectIds?.length ?? 0) >= 1);
});

test("O–P — primary stronger than secondary; caps below object dominance", () => {
  assert.ok(
    EXECUTIVE_STAGE_RELATIONSHIP_VISUAL_ROLE.primaryOpacityCap >
      EXECUTIVE_STAGE_RELATIONSHIP_VISUAL_ROLE.secondaryOpacityCap,
  );
  assert.ok(
    EXECUTIVE_STAGE_RELATIONSHIP_VISUAL_ROLE.primaryLineWidthCap >
      EXECUTIVE_STAGE_RELATIONSHIP_VISUAL_ROLE.secondaryLineWidthCap,
  );
  assert.ok(EXECUTIVE_STAGE_RELATIONSHIP_VISUAL_ROLE.primaryOpacityCap <= 0.55);
});

test("Q–S — routes remain readability authority with body avoidance", () => {
  const source = readFileSync(
    join(here, "executiveStage2DTopologyReadability.ts"),
    "utf8",
  );
  assert.match(source, /resolveExecutiveStage2DConnectionRoutes/);
  assert.match(source, /bendClearancePadding/);
  assert.match(source, /applyExecutiveStageSectorBreathing/);
});

test("T–W — sector breathing never moves anchor; deterministic; bounds", () => {
  const positions = {
    "obj-revenue": Object.freeze({ x: 0, y: 0, z: 0 }),
    a: Object.freeze({ x: 0.05, y: 1.4, z: 0 }),
    b: Object.freeze({ x: -0.05, y: 1.35, z: 0 }),
    c: Object.freeze({ x: 0.02, y: 1.5, z: 0 }),
  };
  const classifications = {
    "obj-revenue": "anchor" as const,
    a: "related" as const,
    b: "related" as const,
    c: "related" as const,
  };
  const first = applyExecutiveStageSectorBreathing({
    positions,
    relatedObjectIds: ["a", "b", "c"],
    anchorObjectId: "obj-revenue",
    classifications,
  });
  const second = applyExecutiveStageSectorBreathing({
    positions,
    relatedObjectIds: ["a", "b", "c"],
    anchorObjectId: "obj-revenue",
    classifications,
  });
  assert.equal(first.positions["obj-revenue"]!.x, 0);
  assert.equal(first.positions["obj-revenue"]!.y, 0);
  assert.equal(first.positions["obj-revenue"]!.z, 0);
  assert.deepEqual(first.positions, second.positions);
  assert.ok(first.sectorCompression > 0);
  assert.ok(EXECUTIVE_STAGE_SECTOR_BREATHING.minAngularSeparation > 0);

  // Opposite-sector vertical stack must also breathe.
  const vertical = applyExecutiveStageSectorBreathing({
    positions: {
      "obj-revenue": Object.freeze({ x: 0, y: 0, z: 0 }),
      demand: Object.freeze({ x: 0, y: 1.4, z: 0 }),
      customer: Object.freeze({ x: 0, y: -1.4, z: 0 }),
    },
    relatedObjectIds: ["demand", "customer"],
    anchorObjectId: "obj-revenue",
    classifications: {
      "obj-revenue": "anchor",
      demand: "related",
      customer: "related",
    },
  });
  assert.ok(vertical.sectorCompression > 0);
  assert.ok(vertical.adjustedCount >= 1);
  assert.ok(
    Math.abs(vertical.positions.demand!.x) > 0.2 ||
      Math.abs(vertical.positions.customer!.x) > 0.2,
  );
});

test("sector map — N/NE/E/... placement vocabulary", () => {
  assert.equal(resolveExecutiveStageAngularSector(0, 1), "N");
  assert.equal(resolveExecutiveStageAngularSector(1, 0), "E");
  assert.equal(resolveExecutiveStageAngularSector(0, -1), "S");
  assert.equal(resolveExecutiveStageAngularSector(-1, 0), "W");
  assert.equal(resolveExecutiveLabelPlacementSideForSector("NE"), "top-right");
  assert.equal(EXECUTIVE_STAGE_LABEL_SECTOR_TO_SIDE.SW, "bottom-left");
});

test("AA–AC — presentation density / context subordinate", () => {
  assert.equal(
    resolveExecutiveLabelVisibilityClass({
      focused: true,
      presentationLevel: "minimum",
    }),
    "full",
  );
  assert.equal(
    resolveExecutiveLabelVisibilityClass({
      role: "related",
      presentationLevel: "minimum",
    }),
    "compact",
  );
  assert.equal(
    resolveExecutiveLabelVisibilityClass({
      role: "context",
      presentationLevel: "operation",
    }),
    "minimal",
  );
  assert.equal(
    resolveExecutiveLabelVisibilityClass({
      role: "background",
      overview: false,
    }),
    "hidden",
  );
});

test("AD — critical unrelated does not outrank related placement priority", () => {
  const related = resolveExecutiveObjectLabelGrammarPresentation({
    objectX: 1,
    objectY: 0,
    role: "related",
  });
  const criticalBg = resolveExecutiveObjectLabelGrammarPresentation({
    objectX: -1,
    objectY: 0,
    role: "background",
  });
  assert.ok(related.collisionPriority > criticalBg.collisionPriority);
});

test("label content hierarchy — name above state (presence V2)", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const label = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-revenue",
    objectName: "Revenue",
    objectKind: "object",
    status: "watch",
    stateMarker: "attention",
    spatialRole: "focus",
    focused: true,
    selected: true,
    densityProfile: "balanced",
    cameraDistance: 11,
    stageOrder: 0,
  });
  assert.equal(label.lines[0], "REVENUE");
  if (label.lines.length > 1) {
    assert.notEqual(label.lines[1], label.lines[0]);
  }
});

test("Y–Z motion contracts present in Stage hosts", () => {
  const connections = readFileSync(
    join(
      here,
      "../../executive/nex-mvp/stage/NexoraStageConnections.tsx",
    ),
    "utf8",
  );
  assert.match(connections, /resolveLiveRoute/);
  assert.match(connections, /edgeAttach/);
  const objectHost = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(objectHost, /labelCollision/);
});
