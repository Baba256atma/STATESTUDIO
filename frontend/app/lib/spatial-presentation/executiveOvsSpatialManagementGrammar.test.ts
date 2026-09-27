/**
 * NPA-T STAGE-SPATIAL:1 — focused spatial management grammar tests A–L.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DTH_EXP_FUTURE_TRANSITION_SEMANTICS,
  DTH_EXP_NORMALIZED_STAGE_SPACE,
} from "../dth-exp/dthExpSpatialLayoutContract.ts";
import {
  DTH_EXP_SPATIAL_LAYOUT_ENGINE,
  dthExpSpatialLayoutIdentity,
  dthExpSpatialLayoutVersion,
} from "../dth-exp/dthExpSpatialLayoutIdentity.ts";
import type {
  DthExpSpatialActorLayout,
  DthExpSpatialLayoutProjection,
  DthExpSpatialRelationshipPath,
} from "../dth-exp/dthExpSpatialLayoutContract.ts";
import type { DthExpNexoRecipeFamily } from "../dth-exp/dthExpSceneRecipeContract.ts";
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
  applyExecutiveOvsIsometricPlacementToStagePresentation,
  overlayExecutiveOvsSpatialConnectionPresentation,
  projectExecutiveOvsIsometricTheatreVisual,
  resolveExecutiveOvsSpatialHierarchyPresentation,
} from "./executiveOvsIsometricTheatreVisual.ts";

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

function actorLayout(
  id: string,
  lane: string,
  x: number,
  y: number,
  extras: Partial<
    Pick<
      DthExpSpatialActorLayout,
      "size" | "sizeReason" | "depth" | "emphasis" | "disclosure"
    >
  > = {},
): DthExpSpatialActorLayout {
  const position = Object.freeze({ x, y });
  const size = extras.size ?? Object.freeze({ width: 0.08, height: 0.08 });
  const emphasis = extras.emphasis ?? "low";
  const disclosure = extras.disclosure ?? "visible";
  return Object.freeze({
    actorId: `actor:${id}`,
    canonicalObjectId: id,
    engine: DTH_EXP_SPATIAL_LAYOUT_ENGINE,
    lane,
    region: lane,
    order: 0,
    position,
    size,
    sizeReason: extras.sizeReason ?? "supporting-context",
    depth: extras.depth ?? "middle",
    emphasis,
    disclosure,
    grouping: lane,
    distanceFromFocal: 0,
    proximityImpliesCausality: false,
    layoutReason: `stage-spatial:test:${lane}`,
    animationTarget: Object.freeze({
      position,
      size,
      emphasis,
      disclosure,
      grouping: lane,
      interpolationImplemented: false as const,
      durationMs: null,
      easing: null,
    }),
  });
}

function path(
  id: string,
  from: string,
  to: string,
  extras: Partial<
    Pick<DthExpSpatialRelationshipPath, "presentationKind" | "semanticRelation">
  > = {},
): DthExpSpatialRelationshipPath {
  return Object.freeze({
    relationshipId: id,
    fromCanonicalObjectId: from,
    toCanonicalObjectId: to,
    fromPosition: Object.freeze({ x: 0.3, y: 0.5 }),
    toPosition: Object.freeze({ x: 0.7, y: 0.5 }),
    presentationKind: extras.presentationKind ?? "directional",
    semanticRelation: extras.semanticRelation ?? null,
    sourceAuthority: "NMI:1/relationship",
    sourceRef: `nmi:${id}`,
    impliesCausality: false,
    upgradesAssociationToCause: false,
  });
}

function spatial(
  family: DthExpNexoRecipeFamily,
  actors: readonly DthExpSpatialActorLayout[],
  relationshipPaths: readonly DthExpSpatialRelationshipPath[] = [],
): DthExpSpatialLayoutProjection {
  return Object.freeze({
    identity: dthExpSpatialLayoutIdentity,
    version: dthExpSpatialLayoutVersion,
    engine: DTH_EXP_SPATIAL_LAYOUT_ENGINE,
    family,
    coordinateSpace: DTH_EXP_NORMALIZED_STAGE_SPACE,
    sceneRef: "dth-exp:stage-spatial-test",
    focalCanonicalObjectId: actors[0]?.canonicalObjectId ?? null,
    density: "sparse",
    actors,
    relationshipPaths,
    evidenceHints: Object.freeze([]),
    futureTransitionSemantics: DTH_EXP_FUTURE_TRANSITION_SEMANTICS,
    animationEngine: false,
    interpolationImplemented: false,
    liveStageWiring: false,
    mutatesTheatreScene: false,
    mutatesCanonicalObjects: false,
    proximityImpliesCausality: false,
    parallelTimelineAuthority: false,
    bottleneckFamily: false,
    declaresOutcomeSuccess: false,
    layoutProvenance: "DTH-EXP:5A/SharedSpatialGrammar",
  });
}

test("A — Actor size consumption: existing DTH-EXP size affects unfocused presentation", () => {
  const presentation = pipeline("obj-capacity");
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_FLOW", [
      actorLayout("obj-capacity", "focal", 0.5, 0.5, {
        size: Object.freeze({ width: 0.14, height: 0.14 }),
        sizeReason: "focal-attention",
        depth: "foreground",
      }),
      actorLayout("obj-budget", "upstream", 0.28, 0.5, {
        size: Object.freeze({ width: 0.08, height: 0.08 }),
        sizeReason: "supporting-context",
        depth: "middle",
      }),
      actorLayout("obj-inventory", "upstream", 0.22, 0.62, {
        size: Object.freeze({ width: 0.04, height: 0.04 }),
        sizeReason: "collapsed-distant-context",
        depth: "background",
        disclosure: "collapsed",
      }),
    ]),
    objects: presentation.scene.objects,
  });
  const applied = applyExecutiveOvsIsometricPlacementToStagePresentation(
    presentation,
    visual,
  );
  const beforeCapacity = presentation.scene.objects.find((entry) => entry.id === "obj-capacity");
  const afterCapacity = applied.scene.objects.find((entry) => entry.id === "obj-capacity");
  const afterBudget = applied.scene.objects.find((entry) => entry.id === "obj-budget");
  const afterInventory = applied.scene.objects.find((entry) => entry.id === "obj-inventory");
  assert.ok(beforeCapacity && afterCapacity && afterBudget && afterInventory);
  assert.equal(afterCapacity.scale, beforeCapacity.scale);
  assert.ok(afterBudget.scale > afterInventory.scale);
  assert.equal(
    visual.actorPlacements.find((entry) => entry.canonicalObjectId === "obj-budget")?.size.width,
    0.08,
  );
});

test("B — Depth consumption: foreground/middle/background without Object Z", () => {
  const presentation = pipeline("obj-capacity");
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_FLOW", [
      actorLayout("obj-capacity", "focal", 0.5, 0.5, {
        depth: "foreground",
        sizeReason: "focal-attention",
        size: Object.freeze({ width: 0.14, height: 0.14 }),
      }),
      actorLayout("obj-delivery", "downstream", 0.72, 0.5, {
        depth: "middle",
      }),
      actorLayout("obj-revenue", "downstream", 0.88, 0.5, {
        depth: "background",
        disclosure: "de-emphasized",
        size: Object.freeze({ width: 0.04, height: 0.04 }),
        sizeReason: "collapsed-distant-context",
      }),
    ]),
    objects: presentation.scene.objects,
  });
  const applied = applyExecutiveOvsIsometricPlacementToStagePresentation(
    presentation,
    visual,
  );
  const foreground = applied.scene.objects.find((entry) => entry.id === "obj-capacity");
  const background = applied.scene.objects.find((entry) => entry.id === "obj-revenue");
  assert.ok(foreground && background);
  assert.equal(foreground.targetPosition[2], 0);
  assert.equal(background.targetPosition[2], 0);
  assert.ok(foreground.opacity > background.opacity);
  assert.notEqual(background.labelProminence, "full");
  const hierarchy = resolveExecutiveOvsSpatialHierarchyPresentation({
    focused: false,
    scale: 1,
    opacity: 1,
    labelProminence: "full",
    size: { width: 0.04, height: 0.04 },
    sizeReason: "collapsed-distant-context",
    depth: "background",
    emphasis: "none",
    disclosure: "collapsed",
  });
  assert.equal(hierarchy.worldZ, 0);
  assert.ok(hierarchy.opacity < 1);
});

test("C — Emphasis is composition, not OVS:2 semantic state", () => {
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_FLOW", [
      actorLayout("obj-capacity", "focal", 0.5, 0.5, { emphasis: "high" }),
    ]),
    objects: [
      {
        id: "obj-capacity",
        kind: "object",
        status: "watch",
        executiveVisualState: "watch",
        focused: true,
      },
    ],
  });
  assert.equal(visual.actorPlacements[0]?.emphasis, "high");
  assert.equal(visual.actorPlacements[0]?.managementClass, "watch");
  const presentation = pipeline("obj-capacity");
  const applied = applyExecutiveOvsIsometricPlacementToStagePresentation(
    presentation,
    visual,
  );
  const object = applied.scene.objects.find((entry) => entry.id === "obj-capacity");
  assert.equal(object?.status, presentation.scene.objects.find((entry) => entry.id === "obj-capacity")?.status);
});

test("D — Canonical Object world Z remains 0", () => {
  const presentation = pipeline("obj-capacity");
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_FLOW", [
      actorLayout("obj-capacity", "focal", 0.5, 0.5, { depth: "foreground" }),
      actorLayout("obj-budget", "upstream", 0.28, 0.5, { depth: "background" }),
    ]),
    objects: presentation.scene.objects,
  });
  const applied = applyExecutiveOvsIsometricPlacementToStagePresentation(
    presentation,
    visual,
  );
  for (const placement of visual.actorPlacements) {
    assert.equal(placement.semanticZ, 0);
    assert.equal(placement.worldPosition[2], 0);
  }
  for (const object of applied.scene.objects) {
    if (!visual.actorPlacements.some((entry) => entry.canonicalObjectId === object.id)) {
      continue;
    }
    assert.equal(object.targetPosition[2], 0);
  }
});

test("E — FLOW uses existing lanes and path", () => {
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_FLOW", [
      actorLayout("obj-budget", "upstream", 0.28, 0.5),
      actorLayout("obj-capacity", "focal", 0.5, 0.5),
      actorLayout("obj-delivery", "downstream", 0.72, 0.5),
    ]),
  });
  assert.equal(visual.consumedFamily, "NEXO_FLOW");
  assert.ok(visual.structures.some((entry) => entry.primitive === "platform"));
  assert.ok(visual.structures.some((entry) => entry.primitive === "lane" && entry.lane === "upstream"));
  assert.ok(visual.structures.some((entry) => entry.primitive === "lane" && entry.lane === "focal"));
  assert.ok(visual.structures.some((entry) => entry.primitive === "lane" && entry.lane === "downstream"));
  assert.ok(visual.structures.some((entry) => entry.primitive === "path"));
  assert.ok(visual.structures.some((entry) => entry.primitive === "node-support"));
});

test("F — RISK grouping/support without invented edges", () => {
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial(
      "NEXO_RISK",
      [
        actorLayout("obj-risk", "focal", 0.62, 0.55),
        actorLayout("obj-delivery", "subject", 0.38, 0.42),
      ],
      [path("rel-risk-delivery", "obj-risk", "obj-delivery", { semanticRelation: "affects" })],
    ),
    connections: [{ id: "rel-risk-delivery", sourceId: "obj-risk", targetId: "obj-delivery" }],
  });
  assert.ok(visual.structures.some((entry) => entry.primitive === "grouped-zone"));
  assert.ok(visual.structures.some((entry) => entry.primitive === "node-support"));
  assert.deepEqual(
    visual.relationshipRefs.map((entry) => entry.relationshipId),
    ["rel-risk-delivery"],
  );
  assert.equal(visual.relationshipRefs[0]?.semanticRelation, "affects");
  assert.equal(visual.relationshipRefs[0]?.impliesCausality, false);
});

test("G — BARS adds no new 3D bar structures", () => {
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_BARS", [actorLayout("obj-revenue", "baseline", 0.3, 0.22)]),
  });
  assert.equal(visual.dataRepresentation, "precision-2d");
  assert.equal(visual.structures.length, 0);
  const source = readFileSync(join(here, "./executiveOvsIsometricTheatreVisual.ts"), "utf8");
  assert.doesNotMatch(source, /BarChart|Chart\.js|recharts/);
});

test("H — Relationship metadata reaches Stage connection presentation", () => {
  const presentation = pipeline("obj-capacity");
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial(
      "NEXO_FLOW",
      [
        actorLayout("obj-budget", "upstream", 0.28, 0.5),
        actorLayout("obj-capacity", "focal", 0.5, 0.5),
      ],
      [
        path("rel-budget-capacity", "obj-budget", "obj-capacity", {
          presentationKind: "directional",
          semanticRelation: "supports",
        }),
      ],
    ),
    connections: presentation.scene.connections,
    objects: presentation.scene.objects,
  });
  const applied = applyExecutiveOvsIsometricPlacementToStagePresentation(
    presentation,
    visual,
  );
  const overlay = applied.scene.connections.find(
    (entry) =>
      entry.id === "rel-budget-capacity" ||
      (entry.sourceId === "obj-budget" && entry.targetId === "obj-capacity"),
  );
  assert.ok(overlay);
  assert.equal(overlay.presentationKind, "directional");
  assert.equal(overlay.directionCue, "source-to-target");
  assert.equal(overlay.relation, "supports");
  assert.equal(overlay.impliesCausality, false);
});

test("I — Unknown relation remains a directional presentation association", () => {
  const overlay = overlayExecutiveOvsSpatialConnectionPresentation(
    {
      id: "fixture-edge",
      sourceId: "obj-budget",
      targetId: "obj-capacity",
      emphasized: false,
      opacity: 0.4,
    },
    {
      relationshipId: "fixture-edge",
      fromCanonicalObjectId: "obj-budget",
      toCanonicalObjectId: "obj-capacity",
      sourceAuthority: "fixture",
      presentationKind: "directional",
      semanticRelation: null,
      impliesCausality: false,
      upgradesAssociationToCause: false,
      renderedBy: "NexoraStageConnections",
    },
    { source: "low", target: "low" },
  );
  assert.equal(overlay.relation, undefined);
  assert.equal(overlay.presentationKind, "directional");
  assert.equal(overlay.directionCue, "source-to-target");
  assert.notEqual(overlay.relation, "causes");
  assert.notEqual(overlay.relation, "threatens");
  assert.notEqual(overlay.relation, "supports");
  assert.notEqual(overlay.relation, "depends_on");
  const source = readFileSync(join(here, "./executiveOvsIsometricTheatreVisual.ts"), "utf8");
  assert.match(source, /NMI_MANAGEMENT_RELATIONS/);
});

test("J — Causal safety: presentation does not upgrade association into cause", () => {
  const overlay = overlayExecutiveOvsSpatialConnectionPresentation(
    {
      id: "assoc",
      sourceId: "obj-staffing",
      targetId: "obj-capacity",
      emphasized: true,
      opacity: 0.74,
      lineWidth: 1.45,
    },
    {
      relationshipId: "assoc",
      fromCanonicalObjectId: "obj-staffing",
      toCanonicalObjectId: "obj-capacity",
      sourceAuthority: "NMI:1/relationship",
      presentationKind: "candidate",
      semanticRelation: "associated",
      impliesCausality: false,
      upgradesAssociationToCause: false,
      renderedBy: "NexoraStageConnections",
    },
    { source: "high", target: "medium" },
  );
  assert.equal(overlay.impliesCausality, false);
  assert.equal(overlay.linePattern, "dashed");
  assert.notEqual(overlay.relation, "causes");
  assert.equal(overlay.relation, undefined);
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial(
      "NEXO_CAUSE",
      [actorLayout("obj-staffing", "candidates", 0.22, 0.4)],
      [path("assoc", "obj-staffing", "obj-capacity", { presentationKind: "candidate", semanticRelation: "associated" })],
    ),
  });
  assert.equal(visual.relationshipRefs[0]?.impliesCausality, false);
  assert.equal(visual.relationshipRefs[0]?.upgradesAssociationToCause, false);
});

test("K — Structures remain noncanonical and nonselectable", () => {
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_FLOW", [actorLayout("obj-capacity", "focal", 0.5, 0.5)]),
  });
  assert.ok(visual.structures.length > 0);
  for (const entry of visual.structures) {
    assert.equal(entry.isCanonicalObject, false);
    assert.equal(entry.canonicalObjectId, null);
  }
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsIsometricTheatreStructures.tsx"),
    "utf8",
  );
  assert.match(renderer, /raycast=\{\(\) => null\}/);
  assert.match(renderer, /selectable: false/);
  assert.doesNotMatch(renderer, /data-canonical-id/);
  assert.doesNotMatch(renderer, /useFrame\(/);
});

test("L — Canonical Object selection identity is unchanged", () => {
  const presentation = pipeline("obj-capacity");
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_FLOW", [actorLayout("obj-capacity", "focal", 0.5, 0.5)]),
    objects: presentation.scene.objects,
  });
  const applied = applyExecutiveOvsIsometricPlacementToStagePresentation(
    presentation,
    visual,
  );
  assert.equal(applied.scene.focusedObjectId, "obj-capacity");
  assert.equal(
    applied.scene.objects.find((entry) => entry.id === "obj-capacity")?.id,
    "obj-capacity",
  );
  const objectHost = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(objectHost, /data-canonical-id/);
  const camera = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraExecutiveCameraController.tsx"),
    "utf8",
  );
  const visualSource = readFileSync(join(here, "./executiveOvsIsometricTheatreVisual.ts"), "utf8");
  assert.doesNotMatch(visualSource, /NexoraExecutiveCameraController/);
  assert.doesNotMatch(visualSource, /OrbitControls/);
  assert.match(camera, /lookAt/);
});
