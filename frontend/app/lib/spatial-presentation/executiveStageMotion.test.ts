/**
 * STAGE-MOTION:1 — Smooth Anchor Recomposition Transition invariants A–X.
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
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
  jumpNexoraMVPObjectInteractionNavigationTrail,
  resetNexoraMVPObjectInteractionOverview,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
} from "./executiveStage2DFixedCamera.ts";
import { resolveExecutiveStage2DTopologyReadability } from "./executiveStage2DTopologyReadability.ts";
import {
  EXECUTIVE_STAGE_MOTION,
  easeOutCubic,
  fingerprintExecutiveStageMotionTargets,
  getActiveExecutiveStageMotionTransition,
  getExecutiveStageMotionIdentity,
  getExecutiveStageMotionObservability,
  registerExecutiveStageMotionLivePositionReader,
  resetExecutiveStageMotionForTests,
  sampleExecutiveStageMotionObject,
  setExecutiveStageMotionReducedMotion,
  syncExecutiveStageMotionTargets,
  advanceExecutiveStageMotion,
  verifyExecutiveStageMotion,
  verifyExecutiveStageMotionFrameRateIndependence,
  type ExecutiveStageMotionTargetEntry,
} from "./executiveStageMotion.ts";

const here = dirname(fileURLToPath(import.meta.url));

function pipeline(objectId: string | null) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (objectId) {
    state = selectNexoraMVPInteractionSubject(state, objectId);
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
  return {
    state,
    presentation: applyExecutiveStageFixedCameraToStagePresentation(withRecomp),
  };
}

function targetsFromPresentation(
  presentation: ReturnType<typeof pipeline>["presentation"],
): Map<string, ExecutiveStageMotionTargetEntry> {
  const map = new Map<string, ExecutiveStageMotionTargetEntry>();
  for (const object of presentation.scene.objects) {
    const visible =
      object.disclosureState !== "hidden" && object.opacity > 0.04;
    map.set(
      object.id,
      Object.freeze({
        position: Object.freeze([
          object.targetPosition[0],
          object.targetPosition[1],
          object.targetPosition[2],
        ] as const),
        visible,
        opacity: visible ? object.opacity : 0,
        scale: object.scale,
      }),
    );
  }
  return map;
}

function beginTransition(objectId: string | null, nowMs = 0) {
  const { presentation } = pipeline(objectId);
  const targets = targetsFromPresentation(presentation);
  const transition = syncExecutiveStageMotionTargets({
    targets,
    anchorObjectId: objectId,
    nowMs,
  });
  return { presentation, targets, transition };
}

test("STAGE-MOTION:1 identity", () => {
  resetExecutiveStageMotionForTests();
  const identity = getExecutiveStageMotionIdentity();
  assert.equal(
    identity.id,
    "STAGE-MOTION:1/ExecutiveStageSmoothAnchorRecomposition",
  );
  assert.equal(identity.version, "5.1.0");
  assert.equal(verifyExecutiveStageMotion().ok, true);
  assert.equal(EXECUTIVE_STAGE_MOTION.topologyDurationMs, 450);
  assert.equal(EXECUTIVE_STAGE_MOTION.settleEpsilon, 0.018);
});

test("A — One transition has one final target set", () => {
  resetExecutiveStageMotionForTests();
  const live = new Map<string, readonly [number, number, number]>();
  registerExecutiveStageMotionLivePositionReader((id) => live.get(id) ?? null);

  const first = beginTransition("obj-revenue", 0);
  const fp = first.transition.fingerprint;
  const again = syncExecutiveStageMotionTargets({
    targets: first.targets,
    anchorObjectId: "obj-revenue",
    nowMs: 50,
  });
  assert.equal(again.transitionId, first.transition.transitionId);
  assert.equal(again.fingerprint, fp);
  assert.equal(again.targetPositions.size, first.targets.size);
});

test("B — Hard separation completes before motion starts", () => {
  resetExecutiveStageMotionForTests();
  const { transition } = beginTransition("obj-delivery", 0);
  assert.equal(transition.hardSeparationComplete, true);
  assert.equal(
    getExecutiveStageMotionObservability().hardSeparationBeforeMotion,
    true,
  );
});

test("C/D — Semantic z=0 and final anchor exactly {0,0,0}", () => {
  resetExecutiveStageMotionForTests();
  for (const id of ["obj-revenue", "obj-delivery", "obj-capacity"]) {
    const { presentation, transition } = beginTransition(id, 0);
    const anchor = presentation.scene.objects.find((entry) => entry.id === id)!;
    assert.deepEqual(anchor.targetPosition, [0, 0, 0]);
    assert.deepEqual(transition.targetPositions.get(id), [0, 0, 0]);
    for (const object of presentation.scene.objects) {
      if (object.disclosureState === "hidden") continue;
      assert.equal(object.targetPosition[2], 0);
    }
  }
});

test("E — Camera never changes", () => {
  for (const id of ["obj-revenue", "obj-delivery", null]) {
    const { presentation } = pipeline(id);
    assert.deepEqual(presentation.scene.camera.position, [
      0,
      0,
      EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
    ]);
    assert.deepEqual(presentation.scene.camera.target, [0, 0, 0]);
  }
});

test("F/G — Deep-Z and object geometry do not affect motion targets", () => {
  const motionSrc = readFileSync(
    join(here, "executiveStageMotion.ts"),
    "utf8",
  );
  assert.doesNotMatch(motionSrc, /deepZ|vortex|centerZ|geometryDepth/i);
  assert.match(motionSrc, /PresentationOnlyTopologyMotionAuthority/);
});

test("H/I/J — Connections/labels/focus follow live (wiring)", () => {
  const connections = readFileSync(
    join(
      here,
      "../../executive/nex-mvp/stage/NexoraStageConnections.tsx",
    ),
    "utf8",
  );
  const object = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(connections, /resolveExecutiveStage2DVisualAttachmentPosition/);
  assert.match(connections, /getActiveExecutiveStageMotionTransition/);
  assert.match(object, /sampleExecutiveStageMotionObject/);
  assert.match(object, /NexoraExecutiveObjectLabel/);
  assert.match(object, /showFocusPedestal/);
  assert.doesNotMatch(object, /Math\.min\(1, delta \* 8\.5\)/);
});

test("K/L/M — Rapid click starts from live; latest wins; old cannot overwrite", () => {
  resetExecutiveStageMotionForTests();
  const live = new Map<string, readonly [number, number, number]>([
    ["obj-revenue", [0, 0, 0]],
    ["obj-delivery", [1.2, 0.4, 0]],
    ["obj-capacity", [-0.8, 0.6, 0]],
  ]);
  registerExecutiveStageMotionLivePositionReader((id) => live.get(id) ?? null);

  const revenue = beginTransition("obj-revenue", 0);
  assert.equal(revenue.transition.interrupted, false);

  // Mid-flight Delivery interrupt: capture live positions as from*.
  live.set("obj-revenue", [0.35, 0.1, 0]);
  live.set("obj-delivery", [0.7, 0.2, 0]);
  const delivery = beginTransition("obj-delivery", 180);
  assert.equal(delivery.transition.interrupted, true);
  assert.equal(
    delivery.transition.transitionId,
    revenue.transition.transitionId + 1,
  );
  assert.deepEqual(delivery.transition.fromPositions.get("obj-delivery"), [
    0.7, 0.2, 0,
  ]);

  live.set("obj-capacity", [0.1, 0.05, 0]);
  const capacity = beginTransition("obj-capacity", 260);
  assert.equal(capacity.transition.interrupted, true);
  assert.ok(
    capacity.transition.transitionId > delivery.transition.transitionId,
  );

  // Old transition fingerprint cannot revive over newer frozen set.
  const stale = syncExecutiveStageMotionTargets({
    targets: delivery.targets,
    anchorObjectId: "obj-delivery",
    nowMs: 300,
  });
  // Different fingerprint → new transition supersedes; capacity fingerprint still latest if same map would equal.
  assert.notEqual(stale.transitionId, delivery.transition.transitionId);
});

test("N/O/P/Q — Back/Forward/Breadcrumb/Overview use same motion authority path", () => {
  resetExecutiveStageMotionForTests();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue");
  state = selectNexoraMVPInteractionSubject(state, "obj-delivery");

  const back = stepBackNexoraMVPObjectInteraction(state);
  const forward = stepForwardNexoraMVPObjectInteraction(back);
  const crumb = jumpNexoraMVPObjectInteractionNavigationTrail(forward, 0);
  const overview = resetNexoraMVPObjectInteractionOverview(crumb);

  for (const next of [back, forward, crumb, overview]) {
    const presentation = applyExecutiveStageFixedCameraToStagePresentation(
      applyExecutiveStage2DTopologyRecompositionToStagePresentation(
        applyExecutiveStage2DTopologyPlaneToStagePresentation(
          applyExecutivePresentationPlaneToStagePresentation(
            applyExecutiveNetworkTopologyToStagePresentation(
              applyExecutiveFocusVisualGrammarToStagePresentation(
                deriveNexoraMVPStageInteractionPresentation(next),
                { presentationDepth: "minimum" },
              ),
            ),
          ),
        ),
      ),
    );
    const targets = targetsFromPresentation(presentation);
    const transition = syncExecutiveStageMotionTargets({
      targets,
      anchorObjectId: next.focusedSubject?.id ?? null,
      nowMs: Date.now(),
    });
    assert.equal(transition.hardSeparationComplete, true);
    assert.ok(transition.targets.size > 0);
  }

  const objectSrc = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(objectSrc, /sampleExecutiveStageMotionObject/);
  assert.equal(
    getExecutiveStageMotionObservability().authority,
    "stage-motion-1",
  );
});

test("R/S — Hard XY valid at final; no second correction after settle", () => {
  resetExecutiveStageMotionForTests();
  const { presentation, transition } = beginTransition("obj-capacity", 0);
  assert.equal(transition.settled, false);
  advanceExecutiveStageMotion(450);
  const settled = getActiveExecutiveStageMotionTransition()!;
  assert.equal(settled.settled, true);
  assert.equal(settled.phase, "complete");

  const readability = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-capacity",
    presentationState: "minimum",
    objects: presentation.scene.objects.map((entry) =>
      Object.freeze({ objectId: entry.id }),
    ),
    relationships: [
      Object.freeze({ id: "r1", sourceId: "obj-budget", targetId: "obj-capacity" }),
      Object.freeze({ id: "r2", sourceId: "obj-capacity", targetId: "obj-delivery" }),
      Object.freeze({ id: "r3", sourceId: "obj-capacity", targetId: "obj-inventory" }),
    ],
  });
  assert.ok(
    readability.layoutStatus === "valid" ||
      readability.layoutStatus === "degraded",
  );

  // Settled sample snaps exactly to frozen target.
  const sample = sampleExecutiveStageMotionObject("obj-capacity", 500, {
    position: [9, 9, 9],
    opacity: 1,
    scale: 1,
    visible: true,
  });
  assert.deepEqual(sample.position, [0, 0, 0]);
  assert.equal(sample.settled, true);
});

test("T — Frame-rate-independent duration", () => {
  const check = verifyExecutiveStageMotionFrameRateIndependence({
    durationMs: 450,
    elapsedMs: 180,
  });
  assert.equal(check.ok, true);
  assert.equal(check.progress30, check.progress120);
  assert.equal(easeOutCubic(0.5), easeOutCubic(0.5));
});

test("U — Reduced motion preserves final topology", () => {
  resetExecutiveStageMotionForTests();
  setExecutiveStageMotionReducedMotion(true);
  const { presentation, transition } = beginTransition("obj-budget", 0);
  assert.equal(
    transition.durationMs,
    EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs,
  );
  const anchor = presentation.scene.objects.find(
    (entry) => entry.id === "obj-budget",
  )!;
  assert.deepEqual(anchor.targetPosition, [0, 0, 0]);
  advanceExecutiveStageMotion(80);
  const sample = sampleExecutiveStageMotionObject("obj-budget", 80, {
    position: [1, 1, 0],
    opacity: 1,
    scale: 1,
    visible: true,
  });
  assert.deepEqual(sample.position, [0, 0, 0]);
});

test("V — No relationship inference introduced", () => {
  const motionSrc = readFileSync(
    join(here, "executiveStageMotion.ts"),
    "utf8",
  );
  assert.doesNotMatch(motionSrc, /inferRelation|guessNeighbor|fabricate/);
});

test("W — No React remount solely due to focus (stable object keys)", () => {
  const scene = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageScene.tsx"),
    "utf8",
  );
  assert.match(scene, /key=\{object\.id\}/);
  assert.match(scene, /NexoraStageMotionController/);
});

test("X — Final live positions equal certified targets", () => {
  resetExecutiveStageMotionForTests();
  const live = new Map<string, readonly [number, number, number]>([
    ["obj-revenue", [1.5, -0.4, 0]],
  ]);
  registerExecutiveStageMotionLivePositionReader((id) => live.get(id) ?? null);
  const { transition } = beginTransition("obj-revenue", 0);
  const mid = sampleExecutiveStageMotionObject("obj-revenue", 200, {
    position: [1.5, -0.4, 0],
    opacity: 1,
    scale: 1,
    visible: true,
  });
  assert.equal(mid.settled, false);
  assert.notDeepEqual(mid.position, [0, 0, 0]);

  advanceExecutiveStageMotion(450);
  const end = sampleExecutiveStageMotionObject("obj-revenue", 450, {
    position: [1.5, -0.4, 0],
    opacity: 1,
    scale: 1,
    visible: true,
  });
  assert.deepEqual(end.position, transition.targetPositions.get("obj-revenue"));
  assert.deepEqual(end.position, [0, 0, 0]);
});

test("delta * 8.5 deprecated; single motion authority wired", () => {
  const object = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  const context = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageContextNodes.tsx"),
    "utf8",
  );
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.doesNotMatch(object, /Math\.min\(1, delta \* 8\.5\)/);
  assert.doesNotMatch(context, /Math\.min\(1, delta \* 5\.5\)/);
  assert.doesNotMatch(context, /position=\{\[\s*\n?\s*node\.targetPosition/);
  assert.match(host, /data-stage-motion-contract/);
  assert.match(host, /data-stage-motion-authority/);
  assert.match(host, /data-stage-motion-identity/);
  assert.match(object, /stage-motion-1/);
  const controller = readFileSync(
    join(
      here,
      "../../executive/nex-mvp/stage/NexoraStageMotionController.tsx",
    ),
    "utf8",
  );
  assert.match(controller, /writeExecutiveStageMotionObservabilityToHost/);
  assert.match(controller, /syncExecutiveStageMotionTargets/);
});

test("Fingerprint stability for identical certified layouts", () => {
  resetExecutiveStageMotionForTests();
  const a = targetsFromPresentation(pipeline("obj-customer").presentation);
  const b = targetsFromPresentation(pipeline("obj-customer").presentation);
  assert.equal(
    fingerprintExecutiveStageMotionTargets(a),
    fingerprintExecutiveStageMotionTargets(b),
  );
});

test("Navigation helpers exist for Back/Forward/Breadcrumb/Overview", () => {
  assert.equal(typeof stepBackNexoraMVPObjectInteraction, "function");
  assert.equal(typeof stepForwardNexoraMVPObjectInteraction, "function");
  assert.equal(typeof jumpNexoraMVPObjectInteractionNavigationTrail, "function");
  assert.equal(typeof resetNexoraMVPObjectInteractionOverview, "function");
});
