/**
 * STAGE-2D:4 — Anchored Topology Readability & Navigation Polish invariants.
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
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  resolveExecutiveStageFixedCamera,
} from "./executiveStage2DFixedCamera.ts";
import {
  EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS,
} from "./executiveStage2DTopologyRecomposition.ts";
import {
  EXECUTIVE_STAGE_2D_PRESENTATION_FOOTPRINT,
  EXECUTIVE_STAGE_2D_READABILITY_BOUNDARY,
  EXECUTIVE_STAGE_2D_READABILITY_LAYOUT,
  getExecutiveStage2DTopologyReadabilityIdentity,
  prioritizeExecutiveStage2DSecondaryCandidates,
  resolveExecutiveStage2DEscapeOverviewAction,
  resolveExecutiveStage2DPairMinimumSeparation,
  resolveExecutiveStage2DTopologyReadability,
  shouldResetExecutiveStage2DToOverview,
  verifyExecutiveStage2DTopologyReadability,
} from "./executiveStage2DTopologyReadability.ts";

const here = dirname(fileURLToPath(import.meta.url));

function pipeline(
  objectId: string | null,
  presentationState: "minimum" | "report" | "operation" = "minimum",
) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState,
    environmentIntent: "neutral",
  });
  if (objectId) {
    state = selectNexoraMVPInteractionSubject(state, objectId);
    state = syncNexoraMVPObjectInteractionShellContext(state, {
      workspace: state.workspace,
      presentationState,
      environmentIntent: state.environmentIntent,
    });
  }
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: presentationState,
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

function fixtureObjects() {
  return [
    Object.freeze({ objectId: "obj-revenue", attention: "elevated" }),
    Object.freeze({ objectId: "obj-capacity", attention: "critical" }),
    Object.freeze({ objectId: "obj-budget", attention: "normal" }),
    Object.freeze({ objectId: "obj-delivery", attention: "normal" }),
    Object.freeze({ objectId: "obj-customer", attention: "normal" }),
    Object.freeze({ objectId: "obj-risk", attention: "normal" }),
    Object.freeze({ objectId: "obj-inventory", attention: "normal" }),
    Object.freeze({ objectId: "obj-demand", attention: "normal" }),
  ];
}

function fixtureRelationships() {
  return NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((edge) =>
    Object.freeze({
      id: edge.id,
      sourceId: edge.sourceId,
      targetId: edge.targetId,
    }),
  );
}

test("STAGE-2D:4 identity / version / namespace", () => {
  const identity = getExecutiveStage2DTopologyReadabilityIdentity();
  assert.equal(identity.id, "STAGE-2D:4/ExecutiveStage2DTopologyReadability");
  assert.equal(identity.version, "2.4.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-stage-2d-topology-readability",
  );
  assert.equal(verifyExecutiveStage2DTopologyReadability().ok, true);
  assert.equal(EXECUTIVE_STAGE_2D_READABILITY_BOUNDARY.inventsRelationships, false);
});

test("Invariant A — Escape returns Overview", () => {
  const { state } = pipeline("obj-revenue");
  assert.notEqual(state.mode, "overview");
  assert.equal(
    resolveExecutiveStage2DEscapeOverviewAction({ topologyMode: "anchored" }),
    "reset-overview",
  );
  const overview = resetNexoraMVPObjectInteractionOverview(state);
  assert.equal(overview.mode, "overview");
  assert.equal(overview.focusedSubject, null);
  assert.equal(overview.selectedSubject, null);
});

test("Invariant B — Escape in Overview is a no-op", () => {
  assert.equal(
    resolveExecutiveStage2DEscapeOverviewAction({ topologyMode: "overview" }),
    "noop",
  );
  assert.equal(
    shouldResetExecutiveStage2DToOverview({
      source: "escape",
      topologyMode: "overview",
    }),
    false,
  );
});

test("Invariant C — Empty Stage click returns Overview", () => {
  assert.equal(
    shouldResetExecutiveStage2DToOverview({
      source: "background",
      topologyMode: "anchored",
      hitKind: "none",
    }),
    true,
  );
  const { state } = pipeline("obj-delivery");
  const overview = resetNexoraMVPObjectInteractionOverview(state);
  assert.equal(overview.mode, "overview");
});

test("Invariant D — Object click does not trigger background reset", () => {
  assert.equal(
    shouldResetExecutiveStage2DToOverview({
      source: "background",
      topologyMode: "anchored",
      hitKind: "object",
    }),
    false,
  );
});

test("Invariant E — Connection/interactive element does not trigger background reset", () => {
  for (const hitKind of [
    "connection",
    "context",
    "overlay",
    "ui-control",
  ] as const) {
    assert.equal(
      shouldResetExecutiveStage2DToOverview({
        source: "background",
        topologyMode: "anchored",
        hitKind,
      }),
      false,
      hitKind,
    );
  }
  const connectionsSource = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageConnections.tsx"),
    "utf8",
  );
  assert.match(connectionsSource, /stopPropagation/);
  assert.match(connectionsSource, /stageHitKind: "connection"/);
});

test("Invariant F — Anchor remains exact center", () => {
  const result = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-delivery",
    presentationState: "operation",
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
  });
  assert.deepEqual(result.anchorPosition, { x: 0, y: 0, z: 0 });
  assert.deepEqual(result.positions["obj-delivery"], { x: 0, y: 0, z: 0 });
});

test("Invariant G — Camera regression", () => {
  const { presentation } = pipeline("obj-revenue");
  const camera = presentation.scene.camera;
  const fixed = resolveExecutiveStageFixedCamera();
  assert.deepEqual(camera.position, [
    fixed.position.x,
    fixed.position.y,
    fixed.position.z,
  ]);
  assert.deepEqual(camera.target, [0, 0, 0]);
  assert.equal(fixed.position.z, EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE);
});

test("Invariant H — z=0 regression", () => {
  const result = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-delivery",
    presentationState: "report",
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
  });
  for (const position of Object.values(result.positions)) {
    assert.equal(position.z, 0);
  }
  for (const route of result.connectionRoutes) {
    for (const point of route.points) {
      assert.equal(point.z, 0);
    }
  }
});

test("Invariant I — Direct-neighbor truth preserved", () => {
  const result = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-revenue",
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
  });
  const expected = new Set(
    fixtureRelationships()
      .filter(
        (edge) =>
          edge.sourceId === "obj-revenue" || edge.targetId === "obj-revenue",
      )
      .map((edge) =>
        edge.sourceId === "obj-revenue" ? edge.targetId : edge.sourceId,
      ),
  );
  for (const relatedId of result.relatedObjectIds) {
    assert.ok(expected.has(relatedId), relatedId);
  }
  assert.ok(!result.relatedObjectIds.includes("obj-capacity"));
});

test("Invariant J — Critical non-neighbor remains non-related", () => {
  const result = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-revenue",
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
  });
  assert.ok(!result.relatedObjectIds.includes("obj-capacity"));
  assert.ok(result.backgroundObjectIds.includes("obj-capacity"));
});

test("Invariant K — Adaptive spacing / footprint-aware minimum separation", () => {
  const crowded = Array.from({ length: 6 }, (_, index) =>
    Object.freeze({ objectId: `obj-n${index}` }),
  );
  const relationships = crowded.map((object, index) =>
    Object.freeze({
      id: `rel-a-${index}`,
      sourceId: "obj-a",
      targetId: object.objectId,
    }),
  );
  const result = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-a",
    presentationState: "operation",
    objects: [
      Object.freeze({ objectId: "obj-a" }),
      ...crowded,
    ],
    relationships,
  });
  assert.equal(result.densityBand, "high");
  const ids = [result.anchorObjectId!, ...result.relatedObjectIds];
  for (let i = 0; i < ids.length; i += 1) {
    for (let j = i + 1; j < ids.length; j += 1) {
      const left = result.positions[ids[i]!]!;
      const right = result.positions[ids[j]!]!;
      const leftClass = result.classifications[ids[i]!]!;
      const rightClass = result.classifications[ids[j]!]!;
      const required = resolveExecutiveStage2DPairMinimumSeparation(
        leftClass === "hidden" ? "related" : leftClass,
        rightClass === "hidden" ? "related" : rightClass,
        "operation",
      );
      const distance = Math.hypot(right.x - left.x, right.y - left.y);
      assert.ok(
        distance + 1e-6 >= required * 0.85,
        `${ids[i]}-${ids[j]} distance=${distance} required=${required}`,
      );
    }
  }
  assert.ok(
    resolveExecutiveStage2DPairMinimumSeparation(
      "related",
      "related",
      "operation",
    ) >
      resolveExecutiveStage2DPairMinimumSeparation(
        "related",
        "related",
        "minimum",
      ),
  );
  assert.ok(
    EXECUTIVE_STAGE_2D_PRESENTATION_FOOTPRINT.operation.related >
      EXECUTIVE_STAGE_2D_PRESENTATION_FOOTPRINT.minimum.related,
  );
});

test("Invariant L — Bounds", () => {
  const result = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-delivery",
    presentationState: "operation",
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
  });
  const bounds = EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS;
  for (const objectId of [
    result.anchorObjectId!,
    ...result.relatedObjectIds,
    ...result.secondaryObjectIds,
    ...result.backgroundObjectIds,
  ]) {
    const position = result.positions[objectId];
    if (position == null) continue;
    assert.ok(position.x >= bounds.minX && position.x <= bounds.maxX);
    assert.ok(position.y >= bounds.minY && position.y <= bounds.maxY);
  }
});

test("Invariant M — Secondary density respects cap/prioritization", () => {
  const candidates = [
    Object.freeze({ id: "ctx-low", attention: "normal", opacity: 0.2 }),
    Object.freeze({ id: "ctx-decision", kind: "decision", attention: "elevated", opacity: 0.8 }),
    Object.freeze({ id: "ctx-goal", kind: "goal", attention: "important", opacity: 0.7 }),
    Object.freeze({ id: "ctx-problem", kind: "problem", attention: "normal", opacity: 0.5 }),
    Object.freeze({ id: "ctx-evidence", kind: "evidence", attention: "normal", opacity: 0.4 }),
    Object.freeze({ id: "ctx-action", kind: "action", attention: "normal", opacity: 0.3 }),
  ];
  const prioritized = prioritizeExecutiveStage2DSecondaryCandidates(
    candidates,
    EXECUTIVE_STAGE_2D_READABILITY_LAYOUT.maxSecondaryVisible,
  );
  assert.equal(
    prioritized.visibleIds.length,
    EXECUTIVE_STAGE_2D_READABILITY_LAYOUT.maxSecondaryVisible,
  );
  assert.equal(prioritized.overflowCount, 2);
  assert.ok(prioritized.visibleIds.includes("ctx-goal"));
  assert.ok(prioritized.visibleIds.includes("ctx-decision"));
  assert.ok(!prioritized.visibleIds.includes("ctx-low"));

  const result = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-delivery",
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    secondaryCandidates: candidates,
  });
  assert.ok(
    result.secondaryVisibleCount <=
      EXECUTIVE_STAGE_2D_READABILITY_LAYOUT.maxSecondaryVisible,
  );
  assert.equal(result.secondaryOverflowCount, 2);
});

test("Invariant N — Determinism", () => {
  const input = {
    anchorObjectId: "obj-revenue",
    presentationState: "report" as const,
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    secondaryCandidates: [
      Object.freeze({ id: "ctx-a", kind: "goal", attention: "elevated" }),
      Object.freeze({ id: "ctx-b", kind: "decision", attention: "important" }),
    ],
  };
  const a = resolveExecutiveStage2DTopologyReadability(input);
  const b = resolveExecutiveStage2DTopologyReadability(input);
  assert.deepEqual(a.positions, b.positions);
  assert.deepEqual(a.connectionRoutes, b.connectionRoutes);
  assert.deepEqual(a.relatedObjectIds, b.relatedObjectIds);
});

test("Invariant O — Connection routing preserves endpoints/identity", () => {
  const result = resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: "obj-delivery",
    presentationState: "report",
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
  });
  assert.ok(result.connectionRoutes.length > 0);
  for (const route of result.connectionRoutes) {
    const source = result.positions[route.sourceId];
    const target = result.positions[route.targetId];
    assert.ok(source);
    assert.ok(target);
    assert.deepEqual(route.endpoints[0], source);
    assert.deepEqual(route.endpoints[1], target);
    assert.ok(
      fixtureRelationships().some((edge) => edge.id === route.connectionId),
    );
    if (route.routeKind === "straight") {
      assert.equal(route.points.length, 2);
      assert.equal(route.controlPoint, null);
    } else {
      assert.equal(route.points.length, 3);
      assert.ok(route.controlPoint);
      assert.equal(route.controlPoint.z, 0);
    }
  }
});

test("Invariant P — Overview restoration", () => {
  const focused = pipeline("obj-delivery");
  assert.equal(focused.presentation.scene.mode, "focus");
  const overviewState = resetNexoraMVPObjectInteractionOverview(focused.state);
  const overview = pipeline(null);
  assert.equal(overviewState.mode, "overview");
  assert.equal(overview.presentation.scene.mode, "overview");
  const readability = (
    overview.presentation.scene as {
      readonly stage2dReadability?: { readonly mode: string };
    }
  ).stage2dReadability;
  assert.equal(readability?.mode ?? "overview", "overview");
  assert.equal(
    shouldResetExecutiveStage2DToOverview({
      source: "overview-control",
      topologyMode: "anchored",
    }),
    true,
  );
});

test("Stage host exposes STAGE-2D:4 observability", () => {
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-related-visible/);
  assert.match(host, /data-stage-secondary-visible/);
  assert.match(host, /data-stage-hidden-count/);
  assert.match(host, /data-stage-routing-mode/);
  assert.match(host, /data-stage-readability-contract/);
  const shell = readFileSync(
    join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  assert.match(shell, /STAGE-2D:4/);
  assert.match(shell, /onOverview\(\)/);
  const canvas = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageCanvas.tsx"),
    "utf8",
  );
  assert.match(canvas, /shouldResetExecutiveStage2DToOverview/);
  assert.match(canvas, /data-stage-background-boundary/);
});
