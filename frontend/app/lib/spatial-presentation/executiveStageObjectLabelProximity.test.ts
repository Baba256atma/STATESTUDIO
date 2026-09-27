/**
 * NPA-T STAGE-LABEL:FIX1 — Object caption proximity & association (A–R).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { applyExecutiveStageFixedCameraToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
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
import { setExecutiveObjectPresenceV2Enabled } from "./executiveObjectPresenceIdentity.ts";
import { EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS } from "./executiveObjectLabelInformationDensity.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_FOV,
} from "./executiveStage2DFixedCamera.ts";
import { executiveStageSafeViewportCameraFitIdentity } from "./executiveStageSafeViewportCameraFit.ts";
import { executiveThreadCollapseControlPlacementIdentity } from "./executiveThreadExpansion.ts";
import {
  EXECUTIVE_STAGE_LABEL_POLICY,
  EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY,
  getExecutiveStageObjectLabelTerritoryIdentity,
  resolveExecutiveStageOwnedLabelContent,
  resolveExecutiveStageOwnedLabelPlacement,
} from "./executiveStageObjectLabelTerritory.ts";

const here = dirname(fileURLToPath(import.meta.url));

function pipeline(objectId: string, expandThread = false) {
  setExecutiveObjectPresenceV2Enabled(true);
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
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
    presentationDepth: "minimum",
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const withFlat = applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  const withRecomp =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(withFlat);
  const withLabels = applyExecutiveStageObjectLabelTerritoryToStagePresentation(
    withRecomp,
    { presentationLevel: "minimum" },
  );
  return applyExecutiveStageFixedCameraToStagePresentation(withLabels);
}

function labeled(presentation: ReturnType<typeof pipeline>) {
  return presentation.scene.objects.filter(
    (object) =>
      object.disclosureState !== "hidden" &&
      object.labelVisible !== false &&
      (object.opacity ?? 0) > 0.05 &&
      object.labelVisibilityMode !== "hidden",
  );
}

function captionCenter(object: {
  readonly targetPosition: readonly [number, number, number];
  readonly labelWorldOffsetX?: number;
  readonly labelWorldOffsetY?: number;
}) {
  return {
    x: object.targetPosition[0] + (object.labelWorldOffsetX ?? 0),
    y: object.targetPosition[1] + (object.labelWorldOffsetY ?? 0),
  };
}

function dist(
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  return Math.hypot(ax - bx, ay - by);
}

test("A — every visible Object has one STAGE-LABEL:1 primary caption", () => {
  const presentation = pipeline("obj-capacity", true);
  for (const object of labeled(presentation)) {
    assert.equal(object.stageLabelContract, "stage-label-1", object.id);
    assert.ok(
      (object.labelPrimaryLine ?? object.label).trim().length > 0,
      object.id,
    );
  }
});

test("B — name + state/role belong to the same owned caption", () => {
  const work = resolveExecutiveStageOwnedLabelContent({
    objectName: "Capacity Expansion",
    objectKind: "execution",
    status: "stable",
    presentationLevel: "minimum",
  });
  assert.equal(work.primaryLine.toUpperCase().includes("CAPACITY EXPANSION"), true);
  assert.equal(work.secondaryLine, "Execution");

  const capacity = resolveExecutiveStageOwnedLabelContent({
    objectName: "Capacity",
    objectKind: "kpi",
    status: "watch",
    presentationLevel: "minimum",
  });
  assert.equal(capacity.primaryLine.toUpperCase(), "CAPACITY");
  assert.equal(capacity.secondaryLine, "WATCH");
});

test("C/D/E/F/G/H — Capacity family captions attach to their own Objects", () => {
  const presentation = pipeline("obj-capacity", true);
  const capacity = labeled(presentation).find((o) => o.id === "obj-capacity");
  const execution = labeled(presentation).find(
    (o) => o.id === "ctx-execution-capacity",
  );
  const problem = labeled(presentation).find(
    (o) => o.id === "ctx-problem-capacity",
  );
  const scenario = labeled(presentation).find(
    (o) => o.id === "ctx-scenario-capacity",
  );
  const decision = labeled(presentation).find(
    (o) => o.id === "ctx-decision-capacity",
  );

  assert.ok(capacity);
  assert.match((capacity!.labelPrimaryLine ?? "").toUpperCase(), /CAPACITY/);
  assert.equal((capacity!.labelSecondaryLine ?? "").toUpperCase(), "WATCH");

  assert.ok(execution);
  assert.match(
    (execution!.labelPrimaryLine ?? "").toUpperCase(),
    /CAPACITY EXPANSION/,
  );
  assert.equal((execution!.labelSecondaryLine ?? "").toUpperCase(), "EXECUTION");

  assert.ok(problem);
  assert.match((problem!.labelPrimaryLine ?? "").toUpperCase(), /CAPACITY GAP/);
  assert.equal((problem!.labelSecondaryLine ?? "").toUpperCase(), "PROBLEM");

  assert.ok(scenario);
  assert.match(
    (scenario!.labelPrimaryLine ?? "").toUpperCase(),
    /CAPACITY EXPANSION PLAN/,
  );
  assert.equal((scenario!.labelSecondaryLine ?? "").toUpperCase(), "SCENARIO");

  assert.ok(decision);
  assert.match((decision!.labelPrimaryLine ?? "").toUpperCase(), /EXPAND CAPACITY/);
  assert.equal((decision!.labelSecondaryLine ?? "").toUpperCase(), "DECISION");

  const pair = [
    ["capacity", capacity!],
    ["execution", execution!],
    ["problem", problem!],
    ["scenario", scenario!],
    ["decision", decision!],
  ] as const;

  for (const [name, object] of pair) {
    const caption = captionCenter(object);
    const ownerDist = dist(
      caption.x,
      caption.y,
      object.targetPosition[0],
      object.targetPosition[1],
    );
    for (const [otherName, other] of pair) {
      if (other.id === object.id) continue;
      const otherDist = dist(
        caption.x,
        caption.y,
        other.targetPosition[0],
        other.targetPosition[1],
      );
      assert.ok(
        ownerDist + EXECUTIVE_STAGE_LABEL_POLICY.associationPad <= otherDist + 1e-6,
        `${name} caption closer to ${otherName} than owner (${ownerDist} vs ${otherDist})`,
      );
    }
  }

  const execCaption = captionCenter(execution!);
  const capBody = capacity!.targetPosition;
  assert.ok(
    execCaption.y < capBody[1] - 0.05 ||
      Math.abs(execCaption.x - capBody[0]) > 0.35,
    "Execution caption must not sit in the Capacity crown",
  );
});

test("I/J — Thread expanded and collapsed keep owned captions", () => {
  for (const expanded of [true, false]) {
    const presentation = pipeline("obj-capacity", expanded);
    const capacity = labeled(presentation).find((o) => o.id === "obj-capacity");
    assert.ok(capacity, `capacity missing expanded=${expanded}`);
    assert.equal(capacity!.stageLabelContract, "stage-label-1");
    const caption = captionCenter(capacity!);
    assert.ok(
      dist(
        caption.x,
        caption.y,
        capacity!.targetPosition[0],
        capacity!.targetPosition[1],
      ) < 2.2,
    );
  }
});

test("K/L — Advisor chrome is not a second label authority", () => {
  const identity = getExecutiveStageObjectLabelTerritoryIdentity();
  assert.equal(
    identity.id,
    "STAGE-LABEL:1/ObjectOwnedLabelTerritoryCollisionAuthority",
  );
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraExecutiveObjectLabel.tsx"),
    "utf8",
  );
  assert.match(renderer, /data-object-caption="primary"/);
  assert.doesNotMatch(renderer, /labelRegistry|new caption store/i);
});

test("M — hover does not free-float owned captions", () => {
  const stageObject = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(stageObject, /screenOffsetX: 0/);
  assert.match(stageObject, /screenOffsetY: 0/);
  assert.match(stageObject, /stage-label-1/);
});

test("N — focus/selected still one primary caption; SP:2.5 opacity unchanged", () => {
  assert.equal(EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.full, 0.96);
  assert.equal(EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.normal, 0.88);
  assert.equal(EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.minimal, 0.64);
  assert.ok(0.88 + EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.hoverLift <= 0.94 + 1e-9);
  const presentation = pipeline("obj-capacity", true);
  const capacity = labeled(presentation).find((o) => o.id === "obj-capacity")!;
  assert.equal(capacity.focused, true);
  assert.equal(capacity.stageLabelContract, "stage-label-1");
});

test("O — long names stay in one caption and do not steal neighbors", () => {
  const layout = resolveExecutiveStageOwnedLabelPlacement({
    objects: [
      {
        id: "obj-capacity",
        label: "Capacity",
        kind: "kpi",
        status: "watch",
        x: 0,
        y: 0,
        halfExtent: 0.48,
        focused: true,
        role: "focused",
      },
      {
        id: "ctx-execution-capacity",
        label: "Capacity Expansion Programme Review",
        kind: "execution",
        status: "stable",
        x: 0.2,
        y: -2.05,
        halfExtent: 0.34,
        role: "related",
      },
    ],
    presentationLevel: "minimum",
    anchorObjectId: "obj-capacity",
  });
  const execution = layout.byId.get("ctx-execution-capacity")!;
  assert.ok(execution.visibility !== "hidden");
  const cap = layout.byId.get("obj-capacity")!;
  const execCaptionX = execution.anchorPoint[0] + execution.worldOffsetX;
  const execCaptionY = execution.anchorPoint[1] + execution.worldOffsetY;
  const ownerDist = dist(
    execCaptionX,
    execCaptionY,
    execution.anchorPoint[0],
    execution.anchorPoint[1],
  );
  const neighborDist = dist(
    execCaptionX,
    execCaptionY,
    cap.anchorPoint[0],
    cap.anchorPoint[1],
  );
  assert.ok(ownerDist + EXECUTIVE_STAGE_LABEL_POLICY.associationPad <= neighborDist);
});

test("P — STAGE-CAMERA:FIX1 pose character unchanged", () => {
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG, 8);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG, 10);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_FOV, 42);
  assert.equal(
    executiveStageSafeViewportCameraFitIdentity,
    "NPA-T STAGE-CAMERA:FIX1/SafeViewportCameraFit",
  );
  const cameraSource = readFileSync(
    join(here, "./executiveStageSafeViewportCameraFit.ts"),
    "utf8",
  );
  assert.match(cameraSource, /NPA-T STAGE-CAMERA:FIX1\/SafeViewportCameraFit/);
});

test("Q — Object XY/Z protection", () => {
  assert.equal(EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.movesObjects, false);
  assert.equal(EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.changesSemanticZ, false);
  const expanded = pipeline("obj-capacity", true);
  const collapsed = pipeline("obj-capacity", false);
  const a = expanded.scene.objects.find((o) => o.id === "obj-capacity")!;
  const b = collapsed.scene.objects.find((o) => o.id === "obj-capacity")!;
  assert.deepEqual(
    [a.targetPosition[0], a.targetPosition[1], a.targetPosition[2]],
    [b.targetPosition[0], b.targetPosition[1], b.targetPosition[2]],
  );
});

test("R — no new label/object/collision/layout/scene authority", () => {
  const identity = getExecutiveStageObjectLabelTerritoryIdentity();
  assert.equal(
    identity.id,
    "STAGE-LABEL:1/ObjectOwnedLabelTerritoryCollisionAuthority",
  );
  assert.equal(
    executiveThreadCollapseControlPlacementIdentity,
    "STAGE-THREAD:FIX1/CollapseThreadControlPlacement",
  );
  const territory = readFileSync(
    join(here, "./executiveStageObjectLabelTerritory.ts"),
    "utf8",
  );
  assert.doesNotMatch(territory, /createLabelRegistry|secondCollisionEngine/);
  assert.match(territory, /STAGE-LABEL:FIX1/);
});
