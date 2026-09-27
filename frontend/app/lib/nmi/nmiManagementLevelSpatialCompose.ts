/**
 * NPA-T MLEVEL:2 — project certified ManagementLevelPath into Stage spatial slots.
 * Does not walk belongs_to. Does not invent ancestors. Physical Z stays 0.
 */

import { SCENE_ORG_NORMAL_STAGE_CARD_RULE } from "@/app/lib/scene-org/sceneOrgWorkspacePlacementContract.ts";
import { DTH_EXP_NORMALIZED_STAGE_SPACE } from "@/app/lib/dth-exp/dthExpSpatialLayoutContract.ts";
import { EXECUTIVE_STAGE_2D_DEPTH } from "@/app/lib/spatial-presentation/executiveStage2DFixedCamera.ts";
import type { ManagementLevelPath, ManagementLevelRole, ManagementLevelSubjectProjection } from "./nmiManagementLevelPathContract.ts";
import {
  MANAGEMENT_LEVEL_DEPTH_ORDER,
  MANAGEMENT_LEVEL_INFORMATION_DENSITY,
  MANAGEMENT_LEVEL_INTERACTION_MODE,
  MANAGEMENT_LEVEL_SCALE,
  MANAGEMENT_LEVEL_SCALE_CLASS,
  MANAGEMENT_LEVEL_SEMANTIC_DEPTH,
  MANAGEMENT_LEVEL_SPATIAL_PRIORITY,
  NMI_MANAGEMENT_LEVEL_SPATIAL_CONTRACT,
  type ManagementLevelSpatialComposition,
  type ManagementLevelSpatialConnector,
  type ManagementLevelSpatialLayoutMode,
  type ManagementLevelSpatialPlacement,
  type ManagementLevelSpatialSlot,
} from "./nmiManagementLevelSpatialContract.ts";
import { nmiManagementLevelSpatialIdentity } from "./nmiManagementLevelSpatialIdentity.ts";

export type NmiManagementLevelSpatialComposeInput = {
  readonly path?: ManagementLevelPath | null;
  readonly layoutMode?: ManagementLevelSpatialLayoutMode;
};

const WORLD_SPAN = 6;

type SlotMetrics = {
  readonly nx: number;
  readonly ny: number;
  readonly width: number;
  readonly height: number;
};

const SLOT_METRICS: Readonly<
  Record<
    ManagementLevelSpatialLayoutMode,
    Readonly<Record<1 | 2 | 3, Readonly<Partial<Record<ManagementLevelRole, SlotMetrics>>>>>
  >
> = Object.freeze({
  FULL: Object.freeze({
    1: Object.freeze({
      ACTIVE: Object.freeze({ nx: 0.5, ny: 0.46, width: 0.56, height: 0.38 }),
    }),
    2: Object.freeze({
      ACTIVE: Object.freeze({ nx: 0.5, ny: 0.34, width: 0.56, height: 0.32 }),
      PARENT: Object.freeze({ nx: 0.5, ny: 0.74, width: 0.4, height: 0.18 }),
    }),
    3: Object.freeze({
      ACTIVE: Object.freeze({ nx: 0.5, ny: 0.28, width: 0.56, height: 0.28 }),
      PARENT: Object.freeze({ nx: 0.5, ny: 0.6, width: 0.4, height: 0.16 }),
      GRANDPARENT: Object.freeze({ nx: 0.5, ny: 0.84, width: 0.3, height: 0.12 }),
    }),
  }),
  COMPRESSED: Object.freeze({
    1: Object.freeze({
      ACTIVE: Object.freeze({ nx: 0.5, ny: 0.44, width: 0.54, height: 0.34 }),
    }),
    2: Object.freeze({
      ACTIVE: Object.freeze({ nx: 0.5, ny: 0.32, width: 0.54, height: 0.28 }),
      PARENT: Object.freeze({ nx: 0.5, ny: 0.66, width: 0.36, height: 0.16 }),
    }),
    3: Object.freeze({
      ACTIVE: Object.freeze({ nx: 0.5, ny: 0.26, width: 0.54, height: 0.24 }),
      PARENT: Object.freeze({ nx: 0.5, ny: 0.52, width: 0.36, height: 0.14 }),
      GRANDPARENT: Object.freeze({ nx: 0.5, ny: 0.74, width: 0.26, height: 0.1 }),
    }),
  }),
  MINIMAL: Object.freeze({
    1: Object.freeze({
      ACTIVE: Object.freeze({ nx: 0.5, ny: 0.42, width: 0.5, height: 0.3 }),
    }),
    2: Object.freeze({
      ACTIVE: Object.freeze({ nx: 0.5, ny: 0.3, width: 0.5, height: 0.24 }),
      PARENT: Object.freeze({ nx: 0.5, ny: 0.6, width: 0.32, height: 0.14 }),
    }),
    3: Object.freeze({
      ACTIVE: Object.freeze({ nx: 0.5, ny: 0.24, width: 0.5, height: 0.22 }),
      PARENT: Object.freeze({ nx: 0.5, ny: 0.48, width: 0.32, height: 0.12 }),
      GRANDPARENT: Object.freeze({ nx: 0.5, ny: 0.68, width: 0.22, height: 0.09 }),
    }),
  }),
});

function emptyComposition(layoutMode: ManagementLevelSpatialLayoutMode): ManagementLevelSpatialComposition {
  return Object.freeze({
    identity: nmiManagementLevelSpatialIdentity,
    layoutMode,
    slots: Object.freeze([]),
    connectors: Object.freeze([]),
    visibleLevelCount: 0,
    placeholderSlots: 0,
    cardAuthority: SCENE_ORG_NORMAL_STAGE_CARD_RULE,
    multipliesStageCardLimit: false,
    levelCards: false,
    plane: "xy",
    physicalZ: EXECUTIVE_STAGE_2D_DEPTH,
    usesZForHierarchy: false,
    normalizedSpace: DTH_EXP_NORMALIZED_STAGE_SPACE,
    resolvesHierarchy: false,
    ownsHierarchy: false,
    ownsObjectTruth: false,
    ownsStageTruth: false,
    ownsOvs: false,
    ownsTheatre: false,
    ownsReferentTruth: false,
    secondStage: false,
    secondSceneGraph: false,
    secondCanvas: false,
    secondDirector: false,
    startsMlevel3: false,
  });
}

function toWorld(nx: number, ny: number): Readonly<{ x: number; y: number; z: typeof EXECUTIVE_STAGE_2D_DEPTH }> {
  return Object.freeze({
    x: (nx - 0.5) * WORLD_SPAN,
    y: (ny - 0.5) * WORLD_SPAN,
    z: EXECUTIVE_STAGE_2D_DEPTH,
  });
}

function placementOf(metrics: SlotMetrics): ManagementLevelSpatialPlacement {
  const world = toWorld(metrics.nx, metrics.ny);
  return Object.freeze({
    plane: "xy",
    normalized: Object.freeze({ x: metrics.nx, y: metrics.ny }),
    world,
    width: metrics.width,
    height: metrics.height,
    worldZ: EXECUTIVE_STAGE_2D_DEPTH,
  });
}

function slotFromSubject(
  subject: ManagementLevelSubjectProjection,
  metrics: SlotMetrics,
): ManagementLevelSpatialSlot {
  const placement = placementOf(metrics);
  const role = subject.role;
  return Object.freeze({
    role,
    canonicalId: subject.canonicalId,
    kind: subject.kind,
    displayIdentity: subject.displayIdentity,
    depthOrder: MANAGEMENT_LEVEL_DEPTH_ORDER[role],
    spatialPriority: MANAGEMENT_LEVEL_SPATIAL_PRIORITY[role],
    detailMode: subject.detail,
    presentationMode: subject.presentationMode,
    interactionMode: MANAGEMENT_LEVEL_INTERACTION_MODE[role],
    scaleClass: MANAGEMENT_LEVEL_SCALE_CLASS[role],
    scale: MANAGEMENT_LEVEL_SCALE[role],
    semanticDepth: MANAGEMENT_LEVEL_SEMANTIC_DEPTH[role],
    informationDensity: MANAGEMENT_LEVEL_INFORMATION_DENSITY[role],
    placement,
    animationTarget: placement,
    interpolationImplemented: false,
    visibility: "VISIBLE",
    clickable: true,
    disabled: false,
    secondaryLabels: role === "ACTIVE",
    supportingDecoration: role === "ACTIVE",
    stageCardEligible: role === "ACTIVE",
    groundTreatment: role === "ACTIVE" ? "quiet-anchor" : "none",
    copiesCanonicalObject: false,
    mutatesOvsManagementState: false,
    mutatesOvsGeometry: false,
    mutatesSelectionFocusWatchCritical: false,
    encodesLevelAsExecutiveState: false,
    impliesCausality: false,
    impliesDependsOn: false,
  });
}

function connectorBetween(
  parent: ManagementLevelSpatialSlot,
  child: ManagementLevelSpatialSlot,
): ManagementLevelSpatialConnector {
  return Object.freeze({
    fromRole: parent.role,
    toRole: child.role,
    fromCanonicalId: parent.canonicalId,
    toCanonicalId: child.canonicalId,
    from: parent.placement.normalized,
    to: child.placement.normalized,
    meaning: "hierarchical-containment",
    sourceAuthority: "NMI:1 belongs_to via MLEVEL:1",
    impliesCausality: false,
    impliesDependsOn: false,
    impliesConstraint: false,
    impliesExecutionFlow: false,
  });
}

export function composeNmiManagementLevelSpatial(
  input: NmiManagementLevelSpatialComposeInput = {},
): ManagementLevelSpatialComposition {
  const layoutMode = input.layoutMode ?? "FULL";
  const path = input.path ?? null;
  if (!path?.active) return emptyComposition(layoutMode);

  const subjects: ManagementLevelSubjectProjection[] = [path.active];
  if (path.parent) subjects.push(path.parent);
  if (path.grandparent) subjects.push(path.grandparent);

  const count = subjects.length as 1 | 2 | 3;
  const metricsByRole = SLOT_METRICS[layoutMode][count];
  const slots = Object.freeze(
    subjects.map((subject) => {
      const metrics = metricsByRole[subject.role];
      if (!metrics) {
        throw new Error(`MLEVEL:2 missing metrics for ${subject.role} at depth ${count}`);
      }
      return slotFromSubject(subject, metrics);
    }),
  );

  const connectors: ManagementLevelSpatialConnector[] = [];
  const parent = slots.find((slot) => slot.role === "PARENT");
  const active = slots.find((slot) => slot.role === "ACTIVE");
  const grandparent = slots.find((slot) => slot.role === "GRANDPARENT");
  if (parent && active) connectors.push(connectorBetween(parent, active));
  if (grandparent && parent) connectors.push(connectorBetween(grandparent, parent));

  return Object.freeze({
    ...emptyComposition(layoutMode),
    slots,
    connectors: Object.freeze(connectors),
    visibleLevelCount: count,
  });
}

export function renderNmiManagementLevelSpatialSvg(composition: ManagementLevelSpatialComposition): string {
  const boxes = composition.slots
    .map((slot) => {
      const x = (slot.placement.normalized.x - slot.placement.width / 2) * 360 + 20;
      const y = (1 - slot.placement.normalized.y - slot.placement.height / 2) * 240 + 20;
      const w = slot.placement.width * 360;
      const h = slot.placement.height * 240;
      const fill =
        slot.role === "ACTIVE" ? "#1e3a5f" : slot.role === "PARENT" ? "#334155" : "#475569";
      const stroke = slot.role === "ACTIVE" ? "#93c5fd" : slot.role === "PARENT" ? "#94a3b8" : "#64748b";
      const label = `${slot.displayIdentity ?? slot.canonicalId}`;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${slot.role === "ACTIVE" ? 3 : 1.5}" />
<text x="${(x + w / 2).toFixed(1)}" y="${(y + h / 2 - 6).toFixed(1)}" text-anchor="middle" fill="#e2e8f0" font-family="system-ui" font-size="${slot.role === "ACTIVE" ? 14 : 11}">${escapeSvg(label)}</text>
<text x="${(x + w / 2).toFixed(1)}" y="${(y + h / 2 + 12).toFixed(1)}" text-anchor="middle" fill="#94a3b8" font-family="system-ui" font-size="10">${slot.detailMode} · ${slot.presentationMode}</text>`;
    })
    .join("\n");
  const lines = composition.connectors
    .map((connector) => {
      const x1 = connector.from.x * 360 + 20;
      const y1 = (1 - connector.from.y) * 240 + 20;
      const x2 = connector.to.x * 360 + 20;
      const y2 = (1 - connector.to.y) * 240 + 20;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#64748b" stroke-width="1.5" />`;
    })
    .join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280" viewBox="0 0 400 280">
<rect width="400" height="280" fill="#0f172a" />
${lines}
${boxes}
</svg>`;
}

function escapeSvg(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export { NMI_MANAGEMENT_LEVEL_SPATIAL_CONTRACT };
