/**
 * STAGE-THREAD:1 / STAGE-THREAD:1-FIX — Executive Thread Expansion + Gateway Discoverability.
 * Invariants A–X.
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
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  collapsedExecutiveThreadSubjectId,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MVP_CONTEXT_LINK_FIXTURES } from "../nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
} from "./executiveStage2DFixedCamera.ts";
import { EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT } from "./executiveStage2DHardSeparation.ts";
import { setExecutiveObjectPresenceV2Enabled } from "./executiveObjectPresenceIdentity.ts";
import {
  EXECUTIVE_THREAD_EXPANSION_BOUNDARY,
  EXECUTIVE_THREAD_GATEWAY_FOOTPRINT,
  EXECUTIVE_THREAD_GATEWAY_SECTORS,
  formatExecutiveThreadGatewayLabel,
  getExecutiveThreadExpansionIdentity,
  getExecutiveThreadGatewayDiscoverabilityIdentity,
  measureExecutiveThreadGatewayContainment,
  measureExecutiveThreadGatewayObjectOverlap,
  resolveExecutiveThreadGatewayPosition,
  resolveExecutiveThreadProjectableSubjects,
  verifyExecutiveThreadExpansion,
} from "./executiveThreadExpansion.ts";

function pipeline(objectId: string, expandThread = false) {
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
  return {
    state,
    presentation: applyExecutiveStageFixedCameraToStagePresentation(withRecomp),
  };
}

function collapsedGateway(presentation: ReturnType<typeof pipeline>["presentation"]) {
  return presentation.contextNodes.find(
    (node) =>
      node.role === "collapsed-thread" &&
      node.gatewayMode === "discoverable-collapsed",
  );
}

function quietCollapse(presentation: ReturnType<typeof pipeline>["presentation"]) {
  return presentation.contextNodes.find(
    (node) =>
      node.role === "collapsed-thread" &&
      node.gatewayMode === "quiet-collapse",
  );
}

test("identity STAGE-THREAD:1 / STAGE-THREAD:1-FIX / 5.1.1", () => {
  const identity = getExecutiveThreadExpansionIdentity();
  const fix = getExecutiveThreadGatewayDiscoverabilityIdentity();
  assert.equal(
    identity.id,
    "STAGE-THREAD:1/ExecutiveThreadExpansionDecisionObjectProjection",
  );
  assert.equal(identity.version, "5.1.1");
  assert.equal(
    fix.id,
    "STAGE-THREAD:1-FIX/ExecutiveThreadGatewayDiscoverability",
  );
  assert.equal(fix.contract, "stage-thread-1-fix");
  assert.equal(verifyExecutiveThreadExpansion().ok, true);
  assert.equal(verifyExecutiveThreadExpansion().gatewayFootprintLargerThanLegacy, true);
  assert.equal(EXECUTIVE_THREAD_EXPANSION_BOUNDARY.replacesBusinessAnchor, false);
  assert.equal(EXECUTIVE_THREAD_EXPANSION_BOUNDARY.movesCamera, false);
});

test("A — Collapsed Thread gateway visible when projectable subjects > 0", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const { presentation } = pipeline("obj-capacity", false);
  const gateway = collapsedGateway(presentation);
  assert.ok(gateway);
  assert.ok(gateway!.opacity >= 0.9);
  assert.equal(gateway!.labelVisible, true);
  assert.equal(gateway!.interactive, true);
});

test("B — Count equals canonical projectable subject count", () => {
  const subjects = resolveExecutiveThreadProjectableSubjects({
    anchorObjectId: "obj-capacity",
    contextSubjects: [
      {
        id: "ctx-problem-capacity",
        label: "Capacity Gap",
        kind: "problem",
        status: "watch",
        attention: "important",
      },
      {
        id: "ctx-scenario-capacity",
        label: "Capacity Expansion Plan",
        kind: "scenario",
        status: "watch",
        attention: "important",
      },
      {
        id: "ctx-decision-capacity",
        label: "Expand Capacity",
        kind: "decision",
        status: "stable",
        attention: "elevated",
      },
      {
        id: "ctx-execution-capacity",
        label: "Capacity Expansion",
        kind: "execution",
        status: "stable",
        attention: "elevated",
      },
    ],
    contextLinks: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  });
  assert.equal(subjects.length, 4);
  setExecutiveObjectPresenceV2Enabled(true);
  const { presentation } = pipeline("obj-capacity", false);
  const gateway = collapsedGateway(presentation)!;
  assert.equal(gateway.gatewayCount, subjects.length);
  assert.equal(
    gateway.label,
    formatExecutiveThreadGatewayLabel(subjects.length),
  );
});

test("C — Gateway footprint larger than previous subordinate context treatment", () => {
  assert.ok(
    EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.hitWidth >
      EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.legacyHitSize * 1.5,
  );
  assert.ok(
    EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.hitHeight >
      EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.legacyHitSize * 1.2,
  );
  assert.ok(EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.width >= 1.15);
  assert.ok(EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.width <= 1.55);
  assert.ok(EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.height >= 0.34);
  assert.ok(EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.height <= 0.48);
});

test("D — Gateway has valid hit target", () => {
  assert.ok(
    EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.hitWidth >=
      EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.width,
  );
  assert.ok(
    EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.hitHeight >=
      EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.height,
  );
  setExecutiveObjectPresenceV2Enabled(true);
  const { presentation } = pipeline("obj-capacity", false);
  const gateway = collapsedGateway(presentation)!;
  assert.equal(gateway.interactive, true);
});

test("E/F/G — Gateway does not overlap BOs / reserved / clipped", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const { presentation } = pipeline("obj-capacity", false);
  const gateway = collapsedGateway(presentation)!;
  const [gx, gy, gz] = gateway.targetPosition;
  assert.equal(gz, 0);
  const objects = presentation.scene.objects
    .filter((object) => object.disclosureState !== "hidden" && object.opacity > 0.05)
    .map((object) => {
      const classification =
        (
          presentation.scene as {
            readonly stage2dReadability?: {
              readonly classifications?: Readonly<Record<string, string>>;
            };
          }
        ).stage2dReadability?.classifications?.[object.id] ??
        (object.id === presentation.scene.focusedObjectId
          ? "anchor"
          : object.role === "related"
            ? "related"
            : "peripheral");
      const half =
        classification === "anchor"
          ? EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.anchor
          : classification === "related"
            ? EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.related
            : EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.secondary;
      return Object.freeze({
        x: object.targetPosition[0],
        y: object.targetPosition[1],
        halfExtent: half,
      });
    });
  const overlap = measureExecutiveThreadGatewayObjectOverlap({
    gatewayX: gx,
    gatewayY: gy,
    objects,
  });
  assert.equal(overlap, 0);
  const containment = measureExecutiveThreadGatewayContainment({
    gatewayX: gx,
    gatewayY: gy,
  });
  assert.equal(containment.clipped, false);
  assert.equal(containment.reservedCollisionCount, 0);
});

test("H/I/J — Click expands; Capacity remains anchor; no trail push", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const { state, presentation } = pipeline("obj-capacity", true);
  assert.equal(state.expandExecutiveThread, true);
  assert.equal(state.focusedSubject?.id, "obj-capacity");
  assert.equal(presentation.scene.focusedObjectId, "obj-capacity");
  assert.equal(presentation.threadExpansion?.expanded, true);
  const capacity = presentation.scene.objects.find(
    (object) => object.id === "obj-capacity",
  )!;
  assert.equal(capacity.targetPosition[0], 0);
  assert.equal(capacity.targetPosition[1], 0);
  assert.equal(capacity.targetPosition[2], 0);
  assert.ok(
    !state.stage2dNavigationTrail.objectIds.some((id) =>
      id.startsWith("thread-"),
    ),
  );
});

test("K — Expanded state projects canonical subjects", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const { presentation } = pipeline("obj-capacity", true);
  for (const id of [
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
    "ctx-decision-capacity",
    "ctx-execution-capacity",
  ]) {
    const object = presentation.scene.objects.find((entry) => entry.id === id);
    assert.ok(object, id);
    assert.ok(object!.opacity > 0.2, id);
    assert.notEqual(object!.disclosureState, "hidden", id);
    assert.equal(object!.targetPosition[2], 0, id);
  }
});

test("L/M — Expanded replaces prominent gateway with quiet Collapse; collapse restores", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const expanded = pipeline("obj-capacity", true).presentation;
  assert.equal(collapsedGateway(expanded), undefined);
  const collapse = quietCollapse(expanded);
  assert.ok(collapse);
  assert.equal(collapse!.label, "Collapse Thread");
  assert.ok(collapse!.opacity < 0.85);
  assert.ok(
    (collapse!.scale ?? 1) <= EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.width,
  );

  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
  state = selectNexoraMVPInteractionSubject(
    state,
    collapsedExecutiveThreadSubjectId("obj-capacity"),
  );
  assert.equal(state.expandExecutiveThread, true);
  state = selectNexoraMVPInteractionSubject(
    state,
    collapsedExecutiveThreadSubjectId("obj-capacity"),
  );
  assert.equal(state.expandExecutiveThread, false);
  const restored = deriveNexoraMVPStageInteractionPresentation(state);
  assert.equal(restored.threadExpansion?.expanded, false);
});

test("N/O — Business-object switch collapses; Overview clears expansion", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
  state = selectNexoraMVPInteractionSubject(
    state,
    collapsedExecutiveThreadSubjectId("obj-capacity"),
  );
  assert.equal(state.expandExecutiveThread, true);
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue");
  assert.equal(state.expandExecutiveThread, false);
  assert.equal(state.focusedSubject?.id, "obj-revenue");

  state = selectNexoraMVPInteractionSubject(
    state,
    collapsedExecutiveThreadSubjectId("obj-revenue"),
  );
  assert.equal(state.expandExecutiveThread, true);
  state = selectNexoraMVPInteractionSubject(state, null);
  assert.equal(state.mode === "overview" || state.expandExecutiveThread !== true, true);
});

test("P — No relationship inference", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const { presentation } = pipeline("obj-capacity", true);
  const catalogIds = new Set(
    NEXORA_MVP_CONTEXT_LINK_FIXTURES.map((link) => link.id),
  );
  for (const connection of presentation.scene.connections) {
    if (connection.visualRole !== "context") continue;
    assert.ok(
      catalogIds.has(connection.id) ||
        connection.id.startsWith("thread-link-"),
      connection.id,
    );
  }
});

test("Q/R/S — Anchor {0,0,0}; semantic z===0; fixed camera unchanged", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const { presentation } = pipeline("obj-capacity", true);
  const capacity = presentation.scene.objects.find(
    (object) => object.id === "obj-capacity",
  )!;
  assert.deepEqual(
    [capacity.targetPosition[0], capacity.targetPosition[1], capacity.targetPosition[2]],
    [0, 0, 0],
  );
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.equal(object.targetPosition[2], 0);
  }
  assert.equal(presentation.scene.camera.position[0], 0);
  assert.equal(presentation.scene.camera.position[1], 0);
  assert.equal(
    presentation.scene.camera.position[2],
    EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  );
  assert.deepEqual(presentation.scene.camera.target, [0, 0, 0]);
});

test("T — Deep-Z unchanged", () => {
  assert.equal(EXECUTIVE_THREAD_EXPANSION_BOUNDARY.changesSemanticZ, false);
  assert.equal(EXECUTIVE_THREAD_EXPANSION_BOUNDARY.movesCamera, false);
});

test("U/V — hard overlap / clipped remain zero", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const { presentation } = pipeline("obj-capacity", true);
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
});

test("W — Deterministic placement", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const a = pipeline("obj-capacity", false).presentation;
  const b = pipeline("obj-capacity", false).presentation;
  const ga = collapsedGateway(a)!;
  const gb = collapsedGateway(b)!;
  assert.deepEqual(ga.targetPosition, gb.targetPosition);
  const preferred = EXECUTIVE_THREAD_GATEWAY_SECTORS[0]!;
  const resolved = resolveExecutiveThreadGatewayPosition();
  assert.equal(resolved.sectorIndex, 0);
  assert.equal(resolved.x, preferred.x);
  assert.equal(resolved.y, preferred.y);
  assert.equal(resolved.z, 0);
  // Occupied layout still deterministic across runs.
  assert.equal(ga.targetPosition[2], 0);
});

test("X — Minimum/Report/Operation retain gateway discoverability", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  for (const level of ["minimum", "report", "operation"] as const) {
    let state = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: level,
      environmentIntent: "neutral",
    });
    state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
    const base = deriveNexoraMVPStageInteractionPresentation(state);
    const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
      presentationDepth: level,
    });
    const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
    const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
    const withFlat = applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
    const presentation =
      applyExecutiveStageFixedCameraToStagePresentation(
        applyExecutiveStage2DTopologyRecompositionToStagePresentation(withFlat),
      );
    const gateway = collapsedGateway(presentation);
    assert.ok(gateway, level);
    assert.match(gateway!.label, /Executive Thread · \d+/i, level);
    assert.ok(gateway!.opacity >= 0.85, level);
    assert.equal(gateway!.interactive, true, level);
    assert.ok((gateway!.gatewayCount ?? 0) > 0, level);
  }
});

test("projected subject click keeps Capacity as business focus", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
  state = selectNexoraMVPInteractionSubject(
    state,
    collapsedExecutiveThreadSubjectId("obj-capacity"),
  );
  state = selectNexoraMVPInteractionSubject(state, "ctx-problem-capacity");
  assert.equal(state.focusedSubject?.id, "obj-capacity");
  assert.equal(state.selectedSubject?.id, "ctx-problem-capacity");
  assert.equal(state.mode, "object-focused");
  assert.equal(state.expandExecutiveThread, true);
});
