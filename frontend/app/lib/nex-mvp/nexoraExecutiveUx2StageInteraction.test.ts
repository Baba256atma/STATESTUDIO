/**
 * UX:2 — Stage Interaction invariants A–J against the live click→render path.
 *
 * Reuses the existing interaction + STAGE-2D pipeline. Does not introduce a
 * second Stage authority.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  resolveDataRealityAwareAdvisorPrimarySubjectId,
} from "../data-reality/dataRealityAwareAdvisorExperienceBinding.ts";
import {
  resolveDataRealityAwarePrimaryFocusObjectId,
} from "../data-reality/dataRealityAwareFocusAttentionExperience.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "./nexoraMVPExecutiveStage2DFixedCamera.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "./nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "./nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "./nexoraMVPExecutivePresentationPlane.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  syncNexoraMVPObjectInteractionShellContext,
  type NexoraMVPObjectInteractionState,
  type NexoraMVPStageInteractionPresentation,
} from "./nexoraMVPObjectInteraction.ts";
import {
  NEXORA_MVP_CONTEXT_LINK_FIXTURES,
} from "./nexoraMVPObjectInteractionFixtures.ts";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "./nexoraMVPDataRealityAwareStageExperience.ts";
import { NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES } from "./nexoraMVPStageFixtures.ts";
import {
  EXECUTIVE_STAGE_2D_CENTER,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  resolveExecutiveStageFixedCamera,
} from "../spatial-presentation/executiveStage2DFixedCamera.ts";
import {
  EXECUTIVE_STAGE_UX2_INTERACTION_LAW,
} from "../spatial-presentation/executiveStage2DTopologyRecomposition.ts";
import {
  resolveExecutiveStage2DVisibleBounds,
  resolveExecutiveStage2DVisualFootprint,
} from "../spatial-presentation/executiveStage2DHardSeparation.ts";
import { EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION } from "../spatial-presentation/executiveStageReservedRegionContainment.ts";
import { EXECUTIVE_STAGE_MOTION } from "../spatial-presentation/executiveStageMotion.ts";

const here = dirname(fileURLToPath(import.meta.url));

function selectSubject(
  state: NexoraMVPObjectInteractionState,
  subjectId: string | null,
): NexoraMVPObjectInteractionState {
  const next = selectNexoraMVPInteractionSubject(state, subjectId);
  return syncNexoraMVPObjectInteractionShellContext(next, {
    workspace: next.workspace,
    presentationState: "minimum",
    environmentIntent: next.environmentIntent,
  });
}

function compose(
  state: NexoraMVPObjectInteractionState,
): NexoraMVPStageInteractionPresentation {
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

function pipeline(subjectId: string | null) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (subjectId) {
    state = selectSubject(state, subjectId);
  }
  return Object.freeze({ state, presentation: compose(state) });
}

function visibleObjects(presentation: NexoraMVPStageInteractionPresentation) {
  return presentation.scene.objects.filter(
    (object) =>
      object.disclosureState !== "hidden" &&
      object.opacity > 0.05 &&
      object.interactive !== false,
  );
}

function canonicalNeighborIds(anchorId: string): readonly string[] {
  const neighbors = new Set<string>();
  for (const edge of NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES) {
    if (edge.sourceId === anchorId) neighbors.add(edge.targetId);
    if (edge.targetId === anchorId) neighbors.add(edge.sourceId);
  }
  for (const link of NEXORA_MVP_CONTEXT_LINK_FIXTURES) {
    if (link.objectId === anchorId) neighbors.add(link.contextId);
    if (link.contextId === anchorId) neighbors.add(link.objectId);
  }
  return Object.freeze([...neighbors]);
}

function readabilityOf(presentation: NexoraMVPStageInteractionPresentation) {
  return (
    presentation.scene as {
      readonly stage2dReadability?: {
        readonly mode?: string;
        readonly anchorObjectId?: string | null;
        readonly relatedObjectIds?: readonly string[];
        readonly secondaryObjectIds?: readonly string[];
        readonly peripheralObjectIds?: readonly string[];
        readonly hiddenObjectIds?: readonly string[];
        readonly layoutStatus?: string;
        readonly layoutOverlapCount?: number;
        readonly positions?: Readonly<
          Record<string, { readonly x: number; readonly y: number; readonly z: number }>
        >;
      };
    }
  ).stage2dReadability;
}

test("UX:2 interaction law is click-to-center on a fixed XY plane", () => {
  assert.equal(
    EXECUTIVE_STAGE_UX2_INTERACTION_LAW.statement,
    "CLICK OBJECT → CENTER → RECOMPOSE RELATED CONTEXT",
  );
  assert.equal(EXECUTIVE_STAGE_UX2_INTERACTION_LAW.camera, "fixed");
  assert.equal(EXECUTIVE_STAGE_UX2_INTERACTION_LAW.topologyZ, 0);
  assert.deepEqual(EXECUTIVE_STAGE_UX2_INTERACTION_LAW.anchorTarget, {
    x: 0,
    y: 0,
    z: 0,
  });
  assert.deepEqual(
    [...EXECUTIVE_STAGE_UX2_INTERACTION_LAW.focusPrecedence],
    [
      "direct-user-click",
      "navigation-restore",
      "automatic-attention",
      "recommendation",
      "fallback",
    ],
  );
  assert.equal(EXECUTIVE_STAGE_UX2_INTERACTION_LAW.queueIsTopology, false);
  assert.equal(EXECUTIVE_STAGE_MOTION.topologyDurationMs, 450);
  const camera = resolveExecutiveStageFixedCamera();
  assert.deepEqual(camera.position, {
    x: 0,
    y: 0,
    z: EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  });
  assert.deepEqual(camera.target, { x: 0, y: 0, z: 0 });
  assert.deepEqual(EXECUTIVE_STAGE_2D_CENTER, { x: 0, y: 0, z: 0 });
});

test("A — Explicit click wins: clicked === focused === anchor", () => {
  for (const id of [
    "obj-customer",
    "obj-capacity",
    "obj-revenue",
    "obj-risk",
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
    "ctx-decision-capacity",
    "ctx-execution-capacity",
  ]) {
    const { state, presentation } = pipeline(id);
    assert.equal(state.selectedSubject?.id, id, id);
    assert.equal(state.focusedSubject?.id, id, id);
    assert.equal(presentation.scene.focusedObjectId, id, id);
    assert.equal(presentation.scene.selectedObjectId, id, id);
    assert.equal(readabilityOf(presentation)?.anchorObjectId, id, id);
  }
});

test("B — Center invariant: anchor target is exactly (0,0)", () => {
  for (const id of [
    "obj-customer",
    "obj-capacity",
    "obj-revenue",
    "ctx-problem-capacity",
    "ctx-scenario-pricing",
    "ctx-decision-reprice",
    "ctx-execution-rollout",
  ]) {
    const { presentation } = pipeline(id);
    const anchor = presentation.scene.objects.find((entry) => entry.id === id);
    assert.ok(anchor, `missing Stage object ${id}`);
    assert.equal(anchor!.targetPosition[0], 0, `${id} x`);
    assert.equal(anchor!.targetPosition[1], 0, `${id} y`);
    const position = readabilityOf(presentation)?.positions?.[id];
    assert.equal(position?.x, 0, `${id} readability x`);
    assert.equal(position?.y, 0, `${id} readability y`);
  }
});

test("C — Topology depth is z === 0", () => {
  for (const id of ["obj-customer", "ctx-problem-margin", null]) {
    const { presentation } = pipeline(id);
    for (const object of presentation.scene.objects) {
      if (object.disclosureState === "hidden") continue;
      assert.equal(object.targetPosition[2], 0, object.id);
    }
    for (const node of presentation.contextNodes) {
      assert.equal(node.targetPosition[2], 0, node.id);
    }
    assert.deepEqual(presentation.scene.camera.position, [0, 0, 11]);
    assert.deepEqual(presentation.scene.camera.target, [0, 0, 0]);
  }
});

test("D — Unrelated objects are excluded from the focused composition", () => {
  const { presentation } = pipeline("obj-customer");
  const readability = readabilityOf(presentation);
  const allowed = new Set([
    "obj-customer",
    ...(readability?.relatedObjectIds ?? []),
    ...(readability?.secondaryObjectIds ?? []),
    ...(readability?.peripheralObjectIds ?? []),
  ]);
  for (const object of visibleObjects(presentation)) {
    assert.ok(
      allowed.has(object.id),
      `visible unrelated object ${object.id}`,
    );
  }
  const budget = presentation.scene.objects.find(
    (entry) => entry.id === "obj-budget",
  );
  assert.ok(budget);
  assert.equal(
    budget!.disclosureState === "hidden" || budget!.opacity <= 0.05,
    true,
    "Budget is not related to Customer",
  );
  const relatedKnown = new Set(canonicalNeighborIds("obj-customer"));
  assert.ok(relatedKnown.has("obj-delivery"));
  assert.ok(relatedKnown.has("obj-revenue"));
});

test("E — Visible related objects are backed by canonical relationships", () => {
  const { presentation } = pipeline("ctx-problem-capacity");
  const readability = readabilityOf(presentation);
  const neighbors = new Set(canonicalNeighborIds("ctx-problem-capacity"));
  assert.ok(neighbors.has("obj-capacity"));
  assert.ok(neighbors.has("obj-delivery"));
  for (const relatedId of readability?.relatedObjectIds ?? []) {
    assert.ok(
      neighbors.has(relatedId),
      `related ${relatedId} has no canonical edge to Capacity Gap`,
    );
    const related = presentation.scene.objects.find(
      (entry) => entry.id === relatedId,
    );
    assert.ok(related);
    assert.notEqual(related!.disclosureState, "hidden");
    assert.ok(related!.opacity > 0.05);
  }
});

test("F — Visible object bounds satisfy minimum XY separation", () => {
  const { presentation } = pipeline("obj-capacity");
  const readability = readabilityOf(presentation);
  assert.ok(
    readability?.layoutStatus === "valid" ||
      readability?.layoutStatus === "degraded",
  );
  assert.equal(readability?.layoutOverlapCount ?? 0, 0);
  const visible = visibleObjects(presentation);
  for (let i = 0; i < visible.length; i += 1) {
    const left = visible[i]!;
    const leftClass =
      left.id === presentation.scene.focusedObjectId ? "anchor" : "related";
    const leftFoot = resolveExecutiveStage2DVisualFootprint(leftClass, "minimum");
    const leftBounds = resolveExecutiveStage2DVisibleBounds(
      left.targetPosition[0],
      left.targetPosition[1],
      leftFoot.halfExtent,
    );
    assert.ok(
      leftBounds.minY >=
        EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect.minY - 1e-6,
      `${left.id} collides with bottom reserved region`,
    );
    for (let j = i + 1; j < visible.length; j += 1) {
      const right = visible[j]!;
      const rightClass =
        right.id === presentation.scene.focusedObjectId ? "anchor" : "related";
      const rightFoot = resolveExecutiveStage2DVisualFootprint(
        rightClass,
        "minimum",
      );
      const rightBounds = resolveExecutiveStage2DVisibleBounds(
        right.targetPosition[0],
        right.targetPosition[1],
        rightFoot.halfExtent,
      );
      const leftInsideRight =
        leftBounds.minX >= rightBounds.minX &&
        leftBounds.maxX <= rightBounds.maxX &&
        leftBounds.minY >= rightBounds.minY &&
        leftBounds.maxY <= rightBounds.maxY;
      const rightInsideLeft =
        rightBounds.minX >= leftBounds.minX &&
        rightBounds.maxX <= leftBounds.maxX &&
        rightBounds.minY >= leftBounds.minY &&
        rightBounds.maxY <= leftBounds.maxY;
      assert.equal(
        leftInsideRight || rightInsideLeft,
        false,
        `${left.id} inside ${right.id}`,
      );
      assert.ok(
        left.targetPosition[0] !== right.targetPosition[0] ||
          left.targetPosition[1] !== right.targetPosition[1],
        `${left.id} shares center with ${right.id}`,
      );
    }
  }
});

test("G — Back restores the previous Stage composition", () => {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectSubject(state, "obj-capacity");
  state = selectSubject(state, "ctx-problem-capacity");
  state = selectSubject(state, "ctx-scenario-capacity");
  assert.equal(state.focusedSubject?.id, "ctx-scenario-capacity");

  state = stepBackNexoraMVPObjectInteraction(state);
  assert.equal(state.focusedSubject?.id, "ctx-problem-capacity");
  let presentation = compose(state);
  assert.equal(presentation.scene.focusedObjectId, "ctx-problem-capacity");
  assert.deepEqual(
    presentation.scene.objects.find((entry) => entry.id === "ctx-problem-capacity")
      ?.targetPosition.slice(0, 2),
    [0, 0],
  );

  state = stepBackNexoraMVPObjectInteraction(state);
  assert.equal(state.focusedSubject?.id, "obj-capacity");
  presentation = compose(state);
  assert.equal(presentation.scene.focusedObjectId, "obj-capacity");

  state = stepBackNexoraMVPObjectInteraction(state);
  assert.equal(state.mode, "overview");
  assert.equal(state.focusedSubject, null);
  presentation = compose(state);
  assert.equal(presentation.scene.mode, "overview");
  assert.equal(presentation.scene.focusedObjectId, null);
});

test("H — Escape restores Overview", () => {
  let state = selectSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    "obj-customer",
  );
  state = selectSubject(state, "obj-revenue");
  state = resetNexoraMVPObjectInteractionOverview(state);
  assert.equal(state.mode, "overview");
  assert.equal(state.focusedSubject, null);
  assert.equal(state.selectedSubject, null);
  const presentation = compose(state);
  assert.equal(presentation.scene.mode, "overview");
  assert.equal(presentation.scene.focusedObjectId, null);
  assert.ok(presentation.scene.objects.every((object) => object.focused !== true));
  const bridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(bridge.focusedSubject, null);
  assert.equal(bridge.interactionMode, "overview");
});

test("I — Advisor subject stays synchronized with Stage subject", () => {
  for (const id of [
    "obj-customer",
    "obj-capacity",
    "ctx-problem-capacity",
    "ctx-decision-capacity",
  ]) {
    const { state, presentation } = pipeline(id);
    const bridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
    assert.equal(bridge.focusedSubject?.id, id);
    assert.equal(bridge.advisorSubjectId, id);
    assert.equal(presentation.scene.focusedObjectId, id);
  }
});

test("J — Automatic attention cannot steal center from explicit focus", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "pressure",
    focusedObjectId: "obj-customer",
    selectedObjectId: "obj-customer",
    selectedObjectIds: ["obj-customer"],
    presentationState: "minimum",
    currentWorkspace: "overview",
    requestedIntent: "investigate",
  });
  assert.equal(
    resolveDataRealityAwarePrimaryFocusObjectId(
      experience.runtimeState,
      "obj-customer",
      "obj-customer",
    ),
    "obj-customer",
  );
  assert.equal(
    resolveDataRealityAwareAdvisorPrimarySubjectId(
      experience.runtimeState,
      "obj-customer",
      "obj-customer",
    ),
    "obj-customer",
  );
  const { presentation } = pipeline("obj-customer");
  assert.equal(presentation.scene.focusedObjectId, "obj-customer");
  assert.deepEqual(
    presentation.scene.objects.find((entry) => entry.id === "obj-customer")
      ?.targetPosition.slice(0, 2),
    [0, 0],
  );
});

test("Overview is a valid Stage state, not an arbitrary center", () => {
  const { presentation } = pipeline(null);
  assert.equal(presentation.scene.mode, "overview");
  assert.equal(presentation.scene.focusedObjectId, null);
  assert.equal(readabilityOf(presentation)?.mode, "overview");
  assert.ok(presentation.scene.objects.some((object) => object.opacity > 0.2));
  assert.ok(presentation.scene.objects.every((object) => object.focused !== true));
});

test("UX:2 is wired through the existing Stage host, not a new authority", () => {
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  const shell = readFileSync(
    join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  assert.match(host, /data-ux2="stage-interaction"/);
  assert.match(host, /data-ux2-center-law="click-object-center-recompose"/);
  assert.match(shell, /selectNexoraMVPInteractionSubject/);
  assert.match(shell, /applyExecutiveStage2DTopologyRecompositionToStagePresentation/);
  assert.match(shell, /resetNexoraMVPObjectInteractionOverview/);
  assert.doesNotMatch(host, /OrbitControls/);
});
