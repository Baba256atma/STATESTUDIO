/**
 * NPA-T OVS:3 — isometric theatre visual tests A–L.
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
import { projectDthExpSpatialLayout } from "../dth-exp/dthExpProjectSpatialLayout.ts";
import {
  composeNexoraDirectorSceneContext,
  selectNexoraDirectorNexoFamily,
} from "../dth-exp/dthExpPublicIndex.ts";
import { directNexoraPresentation } from "../director/nexoraSemanticPresentationDirector.ts";
import { EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY } from "./executiveOvsObjectVisualLanguage.ts";
import { EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY } from "./executiveOvsObjectStateVisual.ts";
import { EXECUTIVE_STAGE_MOTION } from "./executiveStageMotion.ts";
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
  EXECUTIVE_OVS_CERTIFIED_NEXO_FAMILIES,
  EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY,
  getExecutiveOvsIsometricTheatreVisualIdentity,
  projectExecutiveOvsIsometricTheatreVisual,
  projectExecutiveOvsManagementPathVisual,
  verifyExecutiveOvsIsometricTheatreVisual,
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
): DthExpSpatialActorLayout {
  const position = Object.freeze({ x, y });
  return Object.freeze({
    actorId: `actor:${id}`,
    canonicalObjectId: id,
    engine: DTH_EXP_SPATIAL_LAYOUT_ENGINE,
    lane,
    region: lane,
    order: 0,
    position,
    size: Object.freeze({ width: 0.12, height: 0.12 }),
    sizeReason: "supporting-context",
    depth: "middle",
    emphasis: "low",
    disclosure: "visible",
    grouping: lane,
    distanceFromFocal: 0,
    proximityImpliesCausality: false,
    layoutReason: `shared-grammar:test:${lane}`,
    animationTarget: Object.freeze({
      position,
      size: Object.freeze({ width: 0.12, height: 0.12 }),
      emphasis: "low" as const,
      disclosure: "visible" as const,
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
): DthExpSpatialRelationshipPath {
  return Object.freeze({
    relationshipId: id,
    fromCanonicalObjectId: from,
    toCanonicalObjectId: to,
    fromPosition: Object.freeze({ x: 0.3, y: 0.5 }),
    toPosition: Object.freeze({ x: 0.7, y: 0.5 }),
    presentationKind: "directional",
    semanticRelation: "feeds",
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
    sceneRef: "dth-exp:test-scene",
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

test("A — Authority: OVS:3 owns no Object/Data/Relationship/Director/Theatre truth", () => {
  assert.equal(verifyExecutiveOvsIsometricTheatreVisual(), true);
  const identity = getExecutiveOvsIsometricTheatreVisualIdentity();
  assert.equal(identity.id, "NPA-T OVS:3/DataVisualizationIsometricTheatre");
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsObjectCatalog, false);
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.inventsBusinessStates, false);
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsTheatreRecipes, false);
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsDirectorSelection, false);
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsRelationshipTruth, false);
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsDataTruth, false);
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsChartAuthority, false);
  const source = readFileSync(join(here, "./executiveOvsIsometricTheatreVisual.ts"), "utf8");
  assert.doesNotMatch(source, /selectNexoraDirectorNexoFamily/);
  assert.doesNotMatch(source, /defineNexo\w+Recipe/);
  assert.doesNotMatch(source, /NEXO_ROADMAP/);
  assert.doesNotMatch(source, /defineNexoRoadmap/);
});

test("B — Canonical identity survives isometric repositioning", () => {
  const presentation = pipeline("obj-risk");
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial(
      "NEXO_FLOW",
      [actorLayout("obj-risk", "focal", 0.82, 0.5)],
    ),
    objects: presentation.scene.objects,
  });
  const applied = applyExecutiveOvsIsometricPlacementToStagePresentation(
    presentation,
    visual,
  );
  const before = presentation.scene.objects.find((entry) => entry.id === "obj-risk");
  const after = applied.scene.objects.find((entry) => entry.id === "obj-risk");
  assert.ok(before && after);
  assert.equal(after.id, "obj-risk");
  assert.deepEqual(
    applied.scene.objects.map((entry) => entry.id),
    presentation.scene.objects.map((entry) => entry.id),
  );
  assert.notDeepEqual(after.targetPosition, before.targetPosition);
  assert.equal(after.targetPosition[2], 0);
  assert.equal(applied.scene.focusedObjectId, presentation.scene.focusedObjectId);
});

test("C — OVS:1 geometry family remains unchanged", () => {
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_FLOW", [actorLayout("obj-risk", "focal", 0.5, 0.5)]),
    objects: [{ id: "obj-risk", kind: "risk", label: "Risk", status: "unresolved" }],
  });
  assert.equal(visual.actorPlacements[0]?.geometryFamily, "risk");
  assert.equal(visual.actorPlacements[0]?.geometryPrimitive, "diamond");
  const presentation = pipeline("obj-risk");
  const applied = applyExecutiveOvsIsometricPlacementToStagePresentation(
    presentation,
    visual,
  );
  assert.equal(
    applied.scene.objects.find((entry) => entry.id === "obj-risk")?.kind,
    presentation.scene.objects.find((entry) => entry.id === "obj-risk")?.kind,
  );
});

test("D — OVS:2 state presentation survives isometric composition", () => {
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_FLOW", [actorLayout("obj-risk", "focal", 0.5, 0.5)]),
    objects: [
      {
        id: "obj-risk",
        kind: "risk",
        label: "Risk",
        status: "unresolved",
        executiveVisualState: "unresolved",
        selected: true,
        focused: true,
      },
    ],
  });
  assert.equal(visual.actorPlacements[0]?.managementClass, "unresolved");
  assert.equal(visual.actorPlacements[0]?.interactionClass, "focused");
  const presentation = pipeline("obj-risk");
  const applied = applyExecutiveOvsIsometricPlacementToStagePresentation(
    presentation,
    visual,
  );
  const object = applied.scene.objects.find((entry) => entry.id === "obj-risk");
  assert.equal(object?.status, presentation.scene.objects.find((entry) => entry.id === "obj-risk")?.status);
  assert.equal(object?.selected, true);
  assert.equal(object?.focused, true);
});

test("E — Scene input consumes DTH-EXP spatial family rather than selecting one", () => {
  const directorPlan = directNexoraPresentation({
    owner: "WORKSPACE_STATE",
    presentationRequest: "NONE",
    primaryReference: null,
    references: Object.freeze([]),
    collectionKind: null,
    collectionScope: null,
    collectionMembers: Object.freeze([]),
    currentStage: createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
  });
  const selection = selectNexoraDirectorNexoFamily({
    directorPlan,
    canonicalSubjectId: "obj-capacity",
    managementNeed: "OPERATIONAL_FLOW",
  });
  const composed = composeNexoraDirectorSceneContext({
    selection,
    directorPlan,
    graph: Object.freeze({
      objects: Object.freeze([
        Object.freeze({
          object: Object.freeze({
            id: "obj-capacity",
            kind: "kpi",
            label: "Capacity",
            authority: "NEX-MVP:4/catalog",
          }),
          familyRelevance: Object.freeze(["NEXO_FLOW"] as const),
          participationHint: "focal",
          groupingHint: "focal",
          sceneRelevanceReason: "subject",
          vaiRoleRef: null,
          timeBucket: null,
          bottleneck: false,
          collectionMember: false,
        }),
        Object.freeze({
          object: Object.freeze({
            id: "obj-risk",
            kind: "risk",
            label: "Risk",
            authority: "NEX-MVP:4/catalog",
          }),
          familyRelevance: Object.freeze(["NEXO_FLOW"] as const),
          participationHint: "supporting",
          groupingHint: "downstream",
          sceneRelevanceReason: "related",
          vaiRoleRef: null,
          timeBucket: null,
          bottleneck: false,
          collectionMember: false,
        }),
      ]),
      relationships: Object.freeze([
        Object.freeze({
          relationshipId: "rel-capacity-risk",
          fromId: "obj-capacity",
          toId: "obj-risk",
          semanticRelation: "feeds",
          sourceAuthority: "NMI:1/relationship",
          sourceRef: "nmi:rel-capacity-risk",
        }),
      ]),
      evidence: Object.freeze([]),
      bindings: Object.freeze([]),
      bottleneckCanonicalObjectId: null,
      collectionMemberIds: Object.freeze([]),
    }),
  });
  const scene = composed.recipeResolution?.scene;
  assert.ok(scene);
  assert.equal(selection.selectedFamily, "NEXO_FLOW");
  const dthSpatial = projectDthExpSpatialLayout({
    scene,
    family: selection.selectedFamily!,
  });
  const visual = projectExecutiveOvsIsometricTheatreVisual({ spatial: dthSpatial });
  assert.equal(visual.consumedFamily, "NEXO_FLOW");
  assert.equal(visual.consumedFamily, dthSpatial.family);
  assert.ok(visual.structures.some((entry) => entry.primitive === "lane"));
});

test("F — Relationship integrity: only existing edges, Stage connections remain owner", () => {
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial(
      "NEXO_CAUSE",
      [actorLayout("obj-staffing", "candidates", 0.22, 0.4), actorLayout("obj-capacity", "focal-condition", 0.62, 0.5)],
      [
        path("rel-staffing-capacity", "obj-staffing", "obj-capacity"),
        path("rel-invented", "obj-staffing", "obj-ghost"),
      ],
    ),
    connections: [
      { id: "rel-staffing-capacity", sourceId: "obj-staffing", targetId: "obj-capacity" },
    ],
    vaiRolesByCanonicalObjectId: { "obj-staffing": "LEVER" },
  });
  assert.deepEqual(
    visual.relationshipRefs.map((entry) => entry.relationshipId),
    ["rel-staffing-capacity"],
  );
  assert.ok(visual.relationshipRefs.every((entry) => entry.impliesCausality === false));
  assert.ok(visual.relationshipRefs.every((entry) => entry.renderedBy === "NexoraStageConnections"));
  assert.equal(visual.actorPlacements.find((entry) => entry.canonicalObjectId === "obj-staffing")?.vaiRole, "LEVER");
  assert.equal(
    visual.actorPlacements.find((entry) => entry.canonicalObjectId === "obj-staffing")?.vaiImpliesConfirmedCause,
    false,
  );
  const presentation = pipeline("obj-capacity");
  const applied = applyExecutiveOvsIsometricPlacementToStagePresentation(presentation, visual);
  assert.deepEqual(
    applied.scene.connections.map((entry) => entry.id),
    presentation.scene.connections.map((entry) => entry.id),
  );
});

test("G — Precision data stays 2D; NexoBars does not become R3F charts", () => {
  const bars = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_BARS", [actorLayout("obj-revenue", "baseline", 0.3, 0.22)]),
  });
  assert.equal(bars.dataRepresentation, "precision-2d");
  assert.equal(bars.structures.length, 0);
  const contextual = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageContextualVisual.tsx"),
    "utf8",
  );
  assert.match(contextual, /NexoraEvidenceVisualView/);
  const source = readFileSync(join(here, "./executiveOvsIsometricTheatreVisual.ts"), "utf8");
  assert.doesNotMatch(source, /BarChart|Chart\.js|recharts/);
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.replacesPrecisionChartsWithR3f, false);
});

test("H — Isometric primitives cannot masquerade as canonical Objects", () => {
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_FLOW", [actorLayout("obj-capacity", "focal", 0.5, 0.5)]),
  });
  assert.ok(visual.structures.length > 0);
  for (const entry of visual.structures) {
    assert.equal(entry.isCanonicalObject, false);
    assert.equal(entry.canonicalObjectId, null);
    assert.match(entry.structureId, /^ovs3-structure-/);
  }
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsIsometricTheatreStructures.tsx"),
    "utf8",
  );
  assert.match(renderer, /isCanonicalObject: false/);
  assert.match(renderer, /raycast=\{\(\) => null\}/);
  assert.doesNotMatch(renderer, /data-canonical-id/);
  assert.doesNotMatch(renderer, /useFrame\(/);
});

test("I — Canonical labels and values survive presentation transformation", () => {
  const presentation = pipeline("obj-revenue");
  const before = presentation.scene.objects.find((entry) => entry.id === "obj-revenue");
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_BUBBLE", [actorLayout("obj-revenue", "portfolio-field", 0.2, 0.3)]),
    objects: presentation.scene.objects,
    bubbleDimensionsAvailable: true,
  });
  assert.equal(visual.sceneStatus, "available");
  assert.equal(visual.actorPlacements[0]?.label, before?.label);
  const applied = applyExecutiveOvsIsometricPlacementToStagePresentation(presentation, visual);
  const after = applied.scene.objects.find((entry) => entry.id === "obj-revenue");
  assert.equal(after?.label, before?.label);
  assert.equal(after?.primaryValue, before?.primaryValue);
});

test("J — Reduced motion keeps meaning without an OVS animation engine", () => {
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_FLOW", [actorLayout("obj-capacity", "focal", 0.5, 0.5)]),
    objects: [{ id: "obj-capacity", kind: "kpi", status: "watch", attention: "important" }],
    reducedMotion: true,
  });
  assert.equal(visual.reducedMotion, true);
  assert.equal(visual.motionHint, "none");
  assert.equal(visual.actorPlacements[0]?.managementClass, "watch");
  assert.equal(EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs, 80);
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.independentUseFrame, false);
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsMotion, false);
});

test("K — No NexoRoadmap family or registry", () => {
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.introducesNexoRoadmap, false);
  assert.deepEqual([...EXECUTIVE_OVS_CERTIFIED_NEXO_FAMILIES], [
    "NEXO_BUBBLE",
    "NEXO_BARS",
    "NEXO_FLOW",
    "NEXO_IMPACT",
    "NEXO_RISK",
    "NEXO_TIME",
    "NEXO_CAUSE",
    "NEXO_EXECUTION",
    "NEXO_OUTCOME",
  ]);
  const flow = spatial("NEXO_FLOW", [
    actorLayout("obj-capacity", "focal", 0.5, 0.5),
    actorLayout("obj-risk", "downstream", 0.72, 0.5),
  ]);
  const time = spatial("NEXO_TIME", [
    actorLayout("obj-capacity", "now", 0.5, 0.5),
  ]);
  const pathVisual = projectExecutiveOvsManagementPathVisual({ flow, time });
  assert.equal(pathVisual.introducesNexoRoadmap, false);
  assert.equal(pathVisual.consumedFamily, "NEXO_FLOW");
  assert.ok(pathVisual.structures.some((entry) => entry.primitive === "timeline-track"));
  const source = readFileSync(join(here, "./executiveOvsIsometricTheatreVisual.ts"), "utf8");
  assert.doesNotMatch(source, /NEXO_ROADMAP/);
  assert.doesNotMatch(source, /defineNexoRoadmap/);
});

test("Handoff-FIX1 — live kind object Risk stays diamond; Capacity stays operational", () => {
  const presentation = pipeline("obj-risk");
  const risk = presentation.scene.objects.find((entry) => entry.id === "obj-risk");
  const capacity = presentation.scene.objects.find((entry) => entry.id === "obj-capacity");
  assert.equal(risk?.kind, "object");
  assert.equal(capacity?.kind, "object");
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_RISK", [actorLayout("obj-risk", "focal", 0.5, 0.5)]),
    objects: presentation.scene.objects,
  });
  const riskActor = visual.actorPlacements.find((entry) => entry.canonicalObjectId === "obj-risk");
  assert.equal(riskActor?.geometryFamily, "risk");
  assert.equal(riskActor?.geometryPrimitive, "diamond");
  const capacityVisual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_FLOW", [actorLayout("obj-capacity", "focal", 0.5, 0.5)]),
    objects: presentation.scene.objects,
  });
  const capacityActor = capacityVisual.actorPlacements.find(
    (entry) => entry.canonicalObjectId === "obj-capacity",
  );
  assert.equal(capacityActor?.geometryFamily, "operational");
  assert.equal(capacityActor?.geometryPrimitive, "rounded-block");
});

test("L — Single Object authority guard continues to pass", () => {
  assert.equal(EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY.ownsObjectCatalog, false);
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.inventsBusinessStates, false);
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsObjectCatalog, false);
  const unavailable = projectExecutiveOvsIsometricTheatreVisual({
    spatial: spatial("NEXO_BUBBLE", [actorLayout("obj-revenue", "portfolio-field", 0.4, 0.4)]),
  });
  assert.equal(unavailable.sceneStatus, "unavailable");
  assert.match(unavailable.unavailableReason ?? "", /does not fabricate/);
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /projectExecutiveOvsIsometricTheatreVisual/);
  assert.match(host, /NexoraStageCanvas/);
  const canvas = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageCanvas.tsx"),
    "utf8",
  );
  assert.equal(canvas.split("<Canvas").length - 1, 1);
});
