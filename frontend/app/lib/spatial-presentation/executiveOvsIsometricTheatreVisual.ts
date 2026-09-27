/**
 * NPA-T OVS:3 — Data Visualization & Isometric Theatre.
 *
 * Presentation only. Consumes DTH-EXP:5A spatial layout and existing OVS:1–2
 * Object mapping. Does not select Nexo families, invent Objects, infer
 * relationships, or replace 2D precision charts.
 */

import type { DthExpNexoRecipeFamily } from "../dth-exp/dthExpSceneRecipeContract.ts";
import type {
  DthExpSpatialActorLayout,
  DthExpSpatialLayoutProjection,
  DthExpSpatialRelationshipPath,
} from "../dth-exp/dthExpSpatialLayoutContract.ts";
import type { VaiContextualRole } from "../vai/vaiContract.ts";
import { NMI_MANAGEMENT_RELATIONS } from "../nmi/nmiRelationshipContract.ts";
import type {
  NexoraMVPStageConnectionPresentation,
  NexoraMVPStageObjectPresentation,
} from "../nex-mvp/nexora3DExecutiveStage.ts";
import type { NexoraMVPStageInteractionPresentation } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { resolveExecutiveOvsObjectVisualLanguage } from "./executiveOvsObjectVisualLanguage.ts";
import { resolveExecutiveOvsObjectStateVisual } from "./executiveOvsObjectStateVisual.ts";
import { projectExecutiveOvsObjectKindHandoff } from "./projectExecutiveOvsObjectKindHandoff.ts";

export const executiveOvsIsometricTheatreVisualIdentity =
  "NPA-T OVS:3/DataVisualizationIsometricTheatre" as const;

export const executiveOvsIsometricTheatreVisualVersion = "1.0.0" as const;

export const executiveOvsIsometricTheatreVisualNamespace =
  "nexora.spatial-presentation.ovs-isometric-theatre-visual" as const;

export const executiveOvsIsometricTheatreVisualArchitecturalRole =
  "PresentationOnlyExecutiveIsometricTheatreExpression" as const;

const IDENTITY = Object.freeze({
  id: executiveOvsIsometricTheatreVisualIdentity,
  version: executiveOvsIsometricTheatreVisualVersion,
  namespace: executiveOvsIsometricTheatreVisualNamespace,
  architecturalRole: executiveOvsIsometricTheatreVisualArchitecturalRole,
});

export function getExecutiveOvsIsometricTheatreVisualIdentity() {
  return IDENTITY;
}

export const EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY = Object.freeze({
  architecturalRole: executiveOvsIsometricTheatreVisualArchitecturalRole,
  ownsObjectCatalog: false as const,
  inventsBusinessStates: false as const,
  ownsTheatreRecipes: false as const,
  ownsDirectorSelection: false as const,
  ownsRelationshipTruth: false as const,
  ownsDataTruth: false as const,
  ownsChartAuthority: false as const,
  ownsCamera: false as const,
  ownsMotion: false as const,
  introducesSecondCanvas: false as const,
  introducesNexoRoadmap: false as const,
  independentUseFrame: false as const,
  motionIsOnlyMeaningCarrier: false as const,
  proximityImpliesCausality: false as const,
  replacesPrecisionChartsWithR3f: false as const,
  changesGeometryFamily: false as const,
});

export const EXECUTIVE_OVS_CERTIFIED_NEXO_FAMILIES = Object.freeze([
  "NEXO_BUBBLE",
  "NEXO_BARS",
  "NEXO_FLOW",
  "NEXO_IMPACT",
  "NEXO_RISK",
  "NEXO_TIME",
  "NEXO_CAUSE",
  "NEXO_EXECUTION",
  "NEXO_OUTCOME",
] as const satisfies readonly DthExpNexoRecipeFamily[]);

export const EXECUTIVE_OVS_ISOMETRIC_PRIMITIVES = Object.freeze([
  "platform",
  "lane",
  "path",
  "bridge",
  "node-support",
  "grouped-zone",
  "timeline-track",
  "dependency-elevation",
] as const);

export type ExecutiveOvsIsometricPrimitive =
  (typeof EXECUTIVE_OVS_ISOMETRIC_PRIMITIVES)[number];

export const EXECUTIVE_OVS_ISOMETRIC_STAGE_EXTENT = Object.freeze({
  x: 5.2,
  y: 3.0,
});

export type ExecutiveOvsIsometricSceneStatus = "available" | "unavailable";

export type ExecutiveOvsIsometricDataRepresentation =
  | "isometric-2_5d"
  | "precision-2d";

export type ExecutiveOvsIsometricActorPlacement = Readonly<{
  canonicalObjectId: string;
  label: string;
  geometryFamily: string;
  geometryPrimitive: string;
  managementClass: string;
  interactionClass: string;
  worldPosition: readonly [number, number, number];
  semanticZ: 0;
  isCanonicalObject: true;
  vaiRole: VaiContextualRole | null;
  vaiImpliesConfirmedCause: false;
  lane: string;
  size: Readonly<{ width: number; height: number }>;
  sizeReason: DthExpSpatialActorLayout["sizeReason"];
  depth: DthExpSpatialActorLayout["depth"];
  emphasis: DthExpSpatialActorLayout["emphasis"];
  disclosure: DthExpSpatialActorLayout["disclosure"];
}>;

export type ExecutiveOvsIsometricStructure = Readonly<{
  structureId: string;
  primitive: ExecutiveOvsIsometricPrimitive;
  purpose: string;
  worldPosition: readonly [number, number, number];
  worldSize: readonly [number, number, number];
  canonicalObjectId: null;
  isCanonicalObject: false;
  lane: string | null;
}>;

export type ExecutiveOvsIsometricRelationshipRef = Readonly<{
  relationshipId: string;
  fromCanonicalObjectId: string;
  toCanonicalObjectId: string;
  sourceAuthority: string;
  presentationKind: DthExpSpatialRelationshipPath["presentationKind"];
  semanticRelation: string | null;
  impliesCausality: false;
  upgradesAssociationToCause: false;
  renderedBy: "NexoraStageConnections";
}>;

const NMI_KIND_SET = new Set<string>(NMI_MANAGEMENT_RELATIONS);
const DTH_EXP_SUPPORTING_SIZE = 0.08;

export type ExecutiveOvsSpatialHierarchyPresentation = Readonly<{
  scale: number;
  opacity: number;
  labelProminence: NexoraMVPStageObjectPresentation["labelProminence"];
  worldZ: 0;
}>;

export function resolveExecutiveOvsSpatialHierarchyPresentation(input: Readonly<{
  focused: boolean;
  scale: number;
  opacity: number;
  labelProminence: NexoraMVPStageObjectPresentation["labelProminence"];
  size: Readonly<{ width: number; height: number }>;
  sizeReason: DthExpSpatialActorLayout["sizeReason"];
  depth: DthExpSpatialActorLayout["depth"];
  emphasis: DthExpSpatialActorLayout["emphasis"];
  disclosure: DthExpSpatialActorLayout["disclosure"];
}>): ExecutiveOvsSpatialHierarchyPresentation {
  let scale = input.scale;
  const relative = input.size.width / DTH_EXP_SUPPORTING_SIZE;
  if (!input.focused) {
    const factor = Math.min(1.12, Math.max(0.74, relative));
    scale = input.scale * factor;
  }

  let opacity = input.opacity;
  let labelProminence = input.labelProminence;
  if (
    input.depth === "background" ||
    input.disclosure === "collapsed" ||
    input.disclosure === "de-emphasized"
  ) {
    opacity = Math.min(opacity, input.opacity * 0.62);
    if (labelProminence === "full") labelProminence = "reduced";
    if (input.disclosure === "collapsed") labelProminence = "minimal";
  } else if (input.depth === "foreground") {
    opacity = Math.max(opacity, Math.min(1, input.opacity));
    if (labelProminence === "minimal") labelProminence = "reduced";
  }

  if (input.emphasis === "high" && input.depth !== "background") {
    opacity = Math.min(1, Math.max(opacity, input.opacity));
  }
  if (input.disclosure === "hidden") {
    opacity = Math.min(opacity, input.opacity);
  }

  return Object.freeze({
    scale,
    opacity,
    labelProminence,
    worldZ: 0 as const,
  });
}

export function overlayExecutiveOvsSpatialConnectionPresentation(
  connection: NexoraMVPStageConnectionPresentation,
  ref: ExecutiveOvsIsometricRelationshipRef,
  endpointEmphasis: Readonly<{
    source: DthExpSpatialActorLayout["emphasis"] | null;
    target: DthExpSpatialActorLayout["emphasis"] | null;
  }>,
): NexoraMVPStageConnectionPresentation {
  const nmiRelation =
    ref.semanticRelation != null && NMI_KIND_SET.has(ref.semanticRelation)
      ? ref.semanticRelation
      : connection.relation;
  const directional = ref.presentationKind === "directional";
  const candidate =
    ref.presentationKind === "candidate" || ref.presentationKind === "contextual";
  const endpointHigh =
    endpointEmphasis.source === "high" || endpointEmphasis.target === "high";
  const emphasized = connection.emphasized || endpointHigh;
  const baseWidth = connection.lineWidth ?? (connection.emphasized ? 1.45 : 0.95);
  const lineWidth = directional
    ? Math.min(1.65, baseWidth + (emphasized ? 0.18 : 0.12))
    : baseWidth;
  const opacity = Math.min(
    1,
    connection.opacity + (emphasized && connection.opacity > 0 ? 0.06 : 0),
  );
  return Object.freeze({
    ...connection,
    emphasized,
    opacity,
    relation: nmiRelation,
    directionCue: directional ? "source-to-target" : (connection.directionCue ?? "none"),
    lineWidth,
    linePattern: candidate ? "dashed" : (connection.linePattern ?? "solid"),
    presentationKind: ref.presentationKind,
    impliesCausality: false as const,
  });
}

export type ExecutiveOvsIsometricTheatreVisual = Readonly<{
  contract: "ovs-3";
  identity: typeof executiveOvsIsometricTheatreVisualIdentity;
  consumedFamily: DthExpNexoRecipeFamily;
  sceneStatus: ExecutiveOvsIsometricSceneStatus;
  unavailableReason: string | null;
  dataRepresentation: ExecutiveOvsIsometricDataRepresentation;
  actorPlacements: readonly ExecutiveOvsIsometricActorPlacement[];
  structures: readonly ExecutiveOvsIsometricStructure[];
  relationshipRefs: readonly ExecutiveOvsIsometricRelationshipRef[];
  evidencePlacement: "near-existing-hints";
  reducedMotion: boolean;
  motionHint: "none";
  introducesNexoRoadmap: false;
}>;

export type ExecutiveOvsIsometricObjectSnapshot = Readonly<{
  id: string;
  label?: string | null;
  kind?: string | null;
  status?: string | null;
  attention?: string | null;
  executiveVisualState?: string | null;
  selected?: boolean;
  focused?: boolean;
}>;

export type ExecutiveOvsIsometricTheatreVisualInput = Readonly<{
  spatial: DthExpSpatialLayoutProjection;
  objects?: readonly ExecutiveOvsIsometricObjectSnapshot[];
  connections?: readonly Pick<
    NexoraMVPStageConnectionPresentation,
    "id" | "sourceId" | "targetId"
  >[];
  bubbleDimensionsAvailable?: boolean;
  vaiRolesByCanonicalObjectId?: Readonly<
    Partial<Record<string, VaiContextualRole>>
  >;
  reducedMotion?: boolean;
}>;

function freezePos(
  x: number,
  y: number,
  z: number,
): readonly [number, number, number] {
  return Object.freeze([x, y, z] as const);
}

export function mapExecutiveOvsNormalizedPointToStageWorld(
  point: Readonly<{ x: number; y: number }>,
): readonly [number, number, number] {
  const x = (point.x - 0.5) * EXECUTIVE_OVS_ISOMETRIC_STAGE_EXTENT.x;
  const y = (point.y - 0.5) * EXECUTIVE_OVS_ISOMETRIC_STAGE_EXTENT.y;
  return freezePos(x, y, 0);
}

function structure(
  structureId: string,
  primitive: ExecutiveOvsIsometricPrimitive,
  purpose: string,
  position: readonly [number, number, number],
  size: readonly [number, number, number],
  lane: string | null = null,
): ExecutiveOvsIsometricStructure {
  return Object.freeze({
    structureId,
    primitive,
    purpose,
    worldPosition: position,
    worldSize: size,
    canonicalObjectId: null,
    isCanonicalObject: false as const,
    lane,
  });
}

type ActorWorldBounds = Readonly<{
  cx: number;
  cy: number;
  w: number;
  h: number;
  minX: number;
  maxX: number;
}>;

function boundsOfActors(
  actors: readonly DthExpSpatialActorLayout[],
  padX: number,
  padY: number,
  minW: number,
  minH: number,
): ActorWorldBounds {
  if (actors.length === 0) {
    return Object.freeze({ cx: 0, cy: 0, w: minW, h: minH, minX: -minW / 2, maxX: minW / 2 });
  }
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const actor of actors) {
    const world = mapExecutiveOvsNormalizedPointToStageWorld(actor.position);
    minX = Math.min(minX, world[0]);
    maxX = Math.max(maxX, world[0]);
    minY = Math.min(minY, world[1]);
    maxY = Math.max(maxY, world[1]);
  }
  const w = Math.min(5.4, Math.max(minW, maxX - minX + padX * 2));
  const h = Math.min(2.6, Math.max(minH, maxY - minY + padY * 2));
  return Object.freeze({
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    w,
    h,
    minX,
    maxX,
  });
}

function nodeSupportForFocal(
  actors: readonly DthExpSpatialActorLayout[],
  focalCanonicalObjectId: string | null,
): ExecutiveOvsIsometricStructure | null {
  if (focalCanonicalObjectId == null) return null;
  const focal = actors.find((actor) => actor.canonicalObjectId === focalCanonicalObjectId);
  if (focal == null) return null;
  const world = mapExecutiveOvsNormalizedPointToStageWorld(focal.position);
  return structure(
    "ovs3-structure-focal-node-support",
    "node-support",
    "focal-management-anchor",
    freezePos(world[0], world[1], -0.05),
    freezePos(1.05, 1.05, 0.03),
  );
}

function structuresForFamily(
  family: DthExpNexoRecipeFamily,
  actors: readonly DthExpSpatialActorLayout[],
  focalCanonicalObjectId: string | null,
): readonly ExecutiveOvsIsometricStructure[] {
  const lanes = [...new Set(actors.map((actor) => actor.lane))];
  const scene = boundsOfActors(actors, 0.85, 0.55, 2.4, 1.15);
  const focalSupport = nodeSupportForFocal(actors, focalCanonicalObjectId);

  if (family === "NEXO_FLOW") {
    const flowLanes = lanes.length > 0 ? lanes : ["upstream", "focal", "downstream"];
    return Object.freeze([
      structure(
        "ovs3-structure-flow-platform",
        "platform",
        "management-flow-ground",
        freezePos(scene.cx, scene.cy, -0.08),
        freezePos(Math.min(4.8, scene.w), Math.min(1.55, Math.max(1.2, scene.h)), 0.045),
      ),
      ...flowLanes.map((lane) => {
        const members = actors.filter((actor) => actor.lane === lane);
        const box = boundsOfActors(members.length > 0 ? members : actors, 0.55, 0.42, 1.25, 0.95);
        return structure(
          `ovs3-structure-flow-lane-${lane}`,
          "lane",
          "flow-sequence-lane",
          freezePos(box.cx, box.cy, -0.06),
          freezePos(Math.min(1.7, box.w), Math.min(1.15, box.h), 0.025),
          lane,
        );
      }),
      structure(
        "ovs3-structure-flow-path",
        "path",
        "progression-floor-not-relationship",
        freezePos(scene.cx, scene.cy, -0.07),
        freezePos(Math.min(4.4, Math.max(2.4, scene.maxX - scene.minX + 1.1)), 0.22, 0.022),
      ),
      ...(focalSupport ? [focalSupport] : []),
    ]);
  }

  if (family === "NEXO_RISK") {
    const subjectLane =
      lanes.find((lane) => lane === "subject" || lane === "affected") ??
      lanes.find((lane) => lane !== "risks" && lane !== "focal") ??
      null;
    const subjectActors = subjectLane
      ? actors.filter((actor) => actor.lane === subjectLane)
      : actors.filter((actor) => actor.canonicalObjectId !== focalCanonicalObjectId);
    const zone = boundsOfActors(
      subjectActors.length > 0 ? subjectActors : actors,
      0.7,
      0.5,
      1.8,
      1.2,
    );
    return Object.freeze([
      structure(
        "ovs3-structure-risk-platform",
        "platform",
        "risk-investigation-ground",
        freezePos(scene.cx, scene.cy, -0.08),
        freezePos(Math.min(4.4, scene.w), Math.min(2.1, scene.h), 0.045),
      ),
      structure(
        "ovs3-structure-risk-subject-zone",
        "grouped-zone",
        "affected-or-subject-grouping",
        freezePos(zone.cx, zone.cy, -0.055),
        freezePos(Math.min(2.4, zone.w), Math.min(1.7, zone.h), 0.022),
        subjectLane,
      ),
      ...(focalSupport ? [focalSupport] : []),
    ]);
  }

  if (family === "NEXO_CAUSE" || family === "NEXO_IMPACT") {
    const groupLane =
      lanes.find((lane) => lane !== "focal-condition" && lane !== "outcome") ??
      "candidates";
    const groupActors = actors.filter((actor) => actor.lane === groupLane);
    const zone = boundsOfActors(
      groupActors.length > 0 ? groupActors : actors,
      0.55,
      0.45,
      1.9,
      1.4,
    );
    return Object.freeze([
      structure(
        "ovs3-structure-cause-platform",
        "platform",
        "dependency-ground",
        freezePos(scene.cx, scene.cy, -0.08),
        freezePos(Math.min(4.8, scene.w), Math.min(2.2, scene.h), 0.045),
      ),
      structure(
        "ovs3-structure-cause-zone",
        "grouped-zone",
        "candidate-or-variable-grouping",
        freezePos(zone.cx, zone.cy, -0.05),
        freezePos(Math.min(2.2, zone.w), Math.min(1.9, zone.h), 0.022),
        groupLane,
      ),
      structure(
        "ovs3-structure-cause-elevation",
        "dependency-elevation",
        "visual-depth-not-causal-claim",
        freezePos(scene.cx + Math.min(1.45, scene.w * 0.28), scene.cy, -0.04),
        freezePos(1.7, 1.35, 0.05),
      ),
    ]);
  }

  if (family === "NEXO_TIME") {
    return Object.freeze([
      structure(
        "ovs3-structure-time-track",
        "timeline-track",
        "nexo-time-visualization-technique",
        freezePos(scene.cx, scene.cy, -0.07),
        freezePos(Math.min(5.0, Math.max(3.2, scene.w)), 0.32, 0.022),
      ),
    ]);
  }

  if (family === "NEXO_EXECUTION") {
    const executionLanes = lanes.length > 0 ? lanes : ["planned", "active", "blocked", "completed"];
    return Object.freeze([
      structure(
        "ovs3-structure-execution-platform",
        "platform",
        "execution-scene-ground",
        freezePos(scene.cx, scene.cy, -0.08),
        freezePos(Math.min(4.8, scene.w), Math.min(1.8, scene.h), 0.045),
      ),
      ...executionLanes.map((lane) => {
        const members = actors.filter((actor) => actor.lane === lane);
        const box = boundsOfActors(members.length > 0 ? members : actors, 0.45, 0.4, 1.1, 0.9);
        return structure(
          `ovs3-structure-execution-lane-${lane}`,
          "lane",
          "execution-classification-lane",
          freezePos(box.cx, box.cy, -0.06),
          freezePos(Math.min(1.55, box.w), Math.min(1.1, box.h), 0.025),
          lane,
        );
      }),
    ]);
  }

  if (family === "NEXO_OUTCOME") {
    const zones = lanes.filter((lane) => lane === "goal" || lane === "observed");
    return Object.freeze([
      structure(
        "ovs3-structure-outcome-platform",
        "platform",
        "outcome-scene-ground",
        freezePos(scene.cx, scene.cy, -0.08),
        freezePos(Math.min(4.4, scene.w), Math.min(1.7, scene.h), 0.045),
      ),
      ...zones.map((lane) => {
        const members = actors.filter((actor) => actor.lane === lane);
        const box = boundsOfActors(members.length > 0 ? members : actors, 0.5, 0.4, 1.3, 1.0);
        return structure(
          `ovs3-structure-outcome-zone-${lane}`,
          "grouped-zone",
          "goal-or-observed-grouping",
          freezePos(box.cx, box.cy, -0.055),
          freezePos(Math.min(2.0, box.w), Math.min(1.4, box.h), 0.022),
          lane,
        );
      }),
    ]);
  }

  if (family === "NEXO_BUBBLE") {
    return Object.freeze([
      structure(
        "ovs3-structure-portfolio-platform",
        "platform",
        "portfolio-field",
        freezePos(scene.cx, scene.cy, -0.08),
        freezePos(Math.min(5.0, scene.w), Math.min(2.6, scene.h), 0.04),
      ),
    ]);
  }

  if (family === "NEXO_BARS") {
    return Object.freeze([]);
  }

  return Object.freeze([
    structure(
      "ovs3-structure-shared-platform",
      "platform",
      "restrained-scene-ground",
      freezePos(scene.cx, scene.cy, -0.08),
      freezePos(Math.min(4.6, scene.w), Math.min(1.9, scene.h), 0.045),
    ),
    ...(focalSupport ? [focalSupport] : []),
  ]);
}

function dataRepresentation(
  family: DthExpNexoRecipeFamily,
): ExecutiveOvsIsometricDataRepresentation {
  if (family === "NEXO_BARS") return "precision-2d";
  return "isometric-2_5d";
}

export function projectExecutiveOvsIsometricTheatreVisual(
  input: ExecutiveOvsIsometricTheatreVisualInput,
): ExecutiveOvsIsometricTheatreVisual {
  const spatial = input.spatial;
  const family = spatial.family;
  const reducedMotion = input.reducedMotion === true;
  const objectById = new Map((input.objects ?? []).map((object) => [object.id, object]));

  if (family === "NEXO_BUBBLE" && input.bubbleDimensionsAvailable !== true) {
    return Object.freeze({
      contract: "ovs-3" as const,
      identity: executiveOvsIsometricTheatreVisualIdentity,
      consumedFamily: family,
      sceneStatus: "unavailable" as const,
      unavailableReason:
        "NexoBubble portfolio scene requires encoded x/y dimensions from upstream; OVS does not fabricate plot variables",
      dataRepresentation: "isometric-2_5d" as const,
      actorPlacements: Object.freeze([]),
      structures: Object.freeze([]),
      relationshipRefs: Object.freeze([]),
      evidencePlacement: "near-existing-hints" as const,
      reducedMotion,
      motionHint: "none" as const,
      introducesNexoRoadmap: false as const,
    });
  }

  const actorPlacements = Object.freeze(
    spatial.actors.map((actor) => {
      const snapshot = objectById.get(actor.canonicalObjectId);
      const objectKind = projectExecutiveOvsObjectKindHandoff({
        id: actor.canonicalObjectId,
        kind: snapshot?.kind ?? null,
      });
      const geometry = resolveExecutiveOvsObjectVisualLanguage({
        objectKind,
        enabled: true,
      });
      const state = resolveExecutiveOvsObjectStateVisual({
        objectKind,
        status: snapshot?.status ?? null,
        attention: snapshot?.attention ?? null,
        executiveVisualState: snapshot?.executiveVisualState ?? null,
        focused: snapshot?.focused === true,
        selected: snapshot?.selected === true,
        reducedMotion,
      });
      const vaiRole =
        input.vaiRolesByCanonicalObjectId?.[actor.canonicalObjectId] ?? null;
      return Object.freeze({
        canonicalObjectId: actor.canonicalObjectId,
        label: snapshot?.label ?? actor.canonicalObjectId,
        geometryFamily: geometry.family,
        geometryPrimitive: geometry.primitive,
        managementClass: state.managementClass,
        interactionClass: state.interactionClass,
        worldPosition: mapExecutiveOvsNormalizedPointToStageWorld(actor.position),
        semanticZ: 0 as const,
        isCanonicalObject: true as const,
        vaiRole,
        vaiImpliesConfirmedCause: false as const,
        lane: actor.lane,
        size: actor.size,
        sizeReason: actor.sizeReason,
        depth: actor.depth,
        emphasis: actor.emphasis,
        disclosure: actor.disclosure,
      });
    }),
  );

  const allowedIds = new Set(
    spatial.relationshipPaths.map((path) => path.relationshipId),
  );
  const stageConnectionIds = new Set((input.connections ?? []).map((item) => item.id));
  const relationshipRefs = Object.freeze(
    spatial.relationshipPaths
      .filter((path) => {
        if (input.connections == null || input.connections.length === 0) return true;
        return (
          stageConnectionIds.has(path.relationshipId) ||
          (input.connections ?? []).some(
            (connection) =>
              connection.sourceId === path.fromCanonicalObjectId &&
              connection.targetId === path.toCanonicalObjectId,
          )
        );
      })
      .filter((path) => allowedIds.has(path.relationshipId))
      .map((path) =>
        Object.freeze({
          relationshipId: path.relationshipId,
          fromCanonicalObjectId: path.fromCanonicalObjectId,
          toCanonicalObjectId: path.toCanonicalObjectId,
          sourceAuthority: path.sourceAuthority,
          presentationKind: path.presentationKind,
          semanticRelation: path.semanticRelation,
          impliesCausality: false as const,
          upgradesAssociationToCause: false as const,
          renderedBy: "NexoraStageConnections" as const,
        }),
      ),
  );

  return Object.freeze({
    contract: "ovs-3" as const,
    identity: executiveOvsIsometricTheatreVisualIdentity,
    consumedFamily: family,
    sceneStatus: "available" as const,
    unavailableReason: null,
    dataRepresentation: dataRepresentation(family),
    actorPlacements,
    structures: structuresForFamily(family, spatial.actors, spatial.focalCanonicalObjectId),
    relationshipRefs,
    evidencePlacement: "near-existing-hints" as const,
    reducedMotion,
    motionHint: "none" as const,
    introducesNexoRoadmap: false as const,
  });
}

export function projectExecutiveOvsManagementPathVisual(input: Readonly<{
  flow: DthExpSpatialLayoutProjection;
  time?: DthExpSpatialLayoutProjection | null;
  objects?: readonly ExecutiveOvsIsometricObjectSnapshot[];
  reducedMotion?: boolean;
}>): ExecutiveOvsIsometricTheatreVisual {
  const flowVisual = projectExecutiveOvsIsometricTheatreVisual({
    spatial: input.flow,
    objects: input.objects,
    reducedMotion: input.reducedMotion,
  });
  if (input.flow.family !== "NEXO_FLOW") {
    return flowVisual;
  }
  const timeStructures =
    input.time?.family === "NEXO_TIME"
      ? projectExecutiveOvsIsometricTheatreVisual({
          spatial: input.time,
          objects: input.objects,
          reducedMotion: input.reducedMotion,
        }).structures
      : [];
  return Object.freeze({
    ...flowVisual,
    structures: Object.freeze([...flowVisual.structures, ...timeStructures]),
    introducesNexoRoadmap: false as const,
  });
}

export function applyExecutiveOvsIsometricPlacementToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  visual: ExecutiveOvsIsometricTheatreVisual,
): NexoraMVPStageInteractionPresentation {
  if (visual.sceneStatus !== "available") return presentation;
  const byId = new Map(
    visual.actorPlacements.map((placement) => [
      placement.canonicalObjectId,
      placement,
    ]),
  );
  const objects = presentation.scene.objects.map((object) => {
    const placement = byId.get(object.id);
    if (placement == null) return object;
    const hierarchy = resolveExecutiveOvsSpatialHierarchyPresentation({
      focused: object.focused,
      scale: object.scale,
      opacity: object.opacity,
      labelProminence: object.labelProminence,
      size: placement.size,
      sizeReason: placement.sizeReason,
      depth: placement.depth,
      emphasis: placement.emphasis,
      disclosure: placement.disclosure,
    });
    return Object.freeze({
      ...object,
      targetPosition: freezePos(
        placement.worldPosition[0],
        placement.worldPosition[1],
        0,
      ),
      scale: hierarchy.scale,
      opacity: hierarchy.opacity,
      labelProminence: hierarchy.labelProminence,
    }) as NexoraMVPStageObjectPresentation;
  });
  const refsById = new Map(
    visual.relationshipRefs.map((ref) => [ref.relationshipId, ref]),
  );
  const refsByEnds = new Map(
    visual.relationshipRefs.map((ref) => [
      `${ref.fromCanonicalObjectId}->${ref.toCanonicalObjectId}`,
      ref,
    ]),
  );
  const emphasisById = new Map(
    visual.actorPlacements.map((placement) => [
      placement.canonicalObjectId,
      placement.emphasis,
    ]),
  );
  const connections = presentation.scene.connections.map((connection) => {
    const ref =
      refsById.get(connection.id) ??
      refsByEnds.get(`${connection.sourceId}->${connection.targetId}`) ??
      null;
    if (ref == null) {
      return Object.freeze({
        ...connection,
        impliesCausality: false as const,
      });
    }
    return overlayExecutiveOvsSpatialConnectionPresentation(connection, ref, {
      source: emphasisById.get(connection.sourceId) ?? null,
      target: emphasisById.get(connection.targetId) ?? null,
    });
  });
  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      objects: Object.freeze(objects),
      connections: Object.freeze(connections),
    }),
  });
}

export function getExecutiveOvsIsometricTheatreObservability(
  visual: ExecutiveOvsIsometricTheatreVisual | null,
) {
  return Object.freeze({
    contract: "ovs-3",
    identity: executiveOvsIsometricTheatreVisualIdentity,
    enabled: visual != null && visual.sceneStatus === "available" ? "true" : "false",
    family: visual?.consumedFamily ?? "none",
    sceneStatus: visual?.sceneStatus ?? "unavailable",
    dataRepresentation: visual?.dataRepresentation ?? "precision-2d",
    structureCount: String(visual?.structures.length ?? 0),
    roadmapFamily: "none",
  });
}

export function verifyExecutiveOvsIsometricTheatreVisual(): true {
  if (IDENTITY.id !== "NPA-T OVS:3/DataVisualizationIsometricTheatre") {
    throw new Error("OVS:3 identity mismatch");
  }
  const boundary = EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY;
  if (boundary.ownsObjectCatalog) {
    throw new Error("OVS:3 must not own an Object catalog");
  }
  if (boundary.inventsBusinessStates) {
    throw new Error("OVS:3 must not invent business states");
  }
  if (boundary.ownsTheatreRecipes || boundary.ownsDirectorSelection) {
    throw new Error("OVS:3 must not own Theatre or Director selection");
  }
  if (boundary.ownsRelationshipTruth || boundary.ownsDataTruth) {
    throw new Error("OVS:3 must not own relationship or data truth");
  }
  if (boundary.ownsChartAuthority || boundary.replacesPrecisionChartsWithR3f) {
    throw new Error("OVS:3 must not own or replace precision charts");
  }
  if (boundary.introducesNexoRoadmap) {
    throw new Error("OVS:3 must not introduce NexoRoadmap");
  }
  if (boundary.independentUseFrame) {
    throw new Error("OVS:3 must not own a useFrame loop");
  }
  if (EXECUTIVE_OVS_CERTIFIED_NEXO_FAMILIES.length !== 9) {
    throw new Error("OVS:3 must reuse the nine certified Nexo families");
  }
  return true;
}
