/**
 * NPA-T MLEVEL:2 — spatial slots for a certified ManagementLevelPath.
 * Stage XY placement only. Does not own hierarchy, OVS, cards, or Theatre.
 */

import { SCENE_ORG_NORMAL_STAGE_CARD_RULE } from "@/app/lib/scene-org/sceneOrgWorkspacePlacementContract.ts";
import { EXECUTIVE_STAGE_2D_DEPTH } from "@/app/lib/spatial-presentation/executiveStage2DFixedCamera.ts";
import type { DthExpSpatialDepth } from "@/app/lib/dth-exp/dthExpSpatialLayoutContract.ts";
import { DTH_EXP_NORMALIZED_STAGE_SPACE } from "@/app/lib/dth-exp/dthExpSpatialLayoutContract.ts";
import type { NmiNodeKind } from "./nmiContract.ts";
import type {
  ManagementLevelDetail,
  ManagementLevelPresentationMode,
  ManagementLevelRole,
} from "./nmiManagementLevelPathContract.ts";
import { nmiManagementLevelSpatialIdentity } from "./nmiManagementLevelSpatialIdentity.ts";

export const MANAGEMENT_LEVEL_SPATIAL_LAYOUT_MODES = Object.freeze([
  "FULL",
  "COMPRESSED",
  "MINIMAL",
] as const);
export type ManagementLevelSpatialLayoutMode =
  (typeof MANAGEMENT_LEVEL_SPATIAL_LAYOUT_MODES)[number];

export const MANAGEMENT_LEVEL_SCALE_CLASS = Object.freeze({
  ACTIVE: "WORKING",
  PARENT: "CONTEXT",
  GRANDPARENT: "ORIENTATION",
} as const);
export type ManagementLevelScaleClass =
  (typeof MANAGEMENT_LEVEL_SCALE_CLASS)[ManagementLevelRole];

export const MANAGEMENT_LEVEL_INTERACTION_MODE = Object.freeze({
  ACTIVE: "PRIMARY",
  PARENT: "NAVIGABLE_CONTEXT",
  GRANDPARENT: "NAVIGABLE_CONTEXT",
} as const);
export type ManagementLevelInteractionMode =
  (typeof MANAGEMENT_LEVEL_INTERACTION_MODE)[ManagementLevelRole];

export const MANAGEMENT_LEVEL_INFORMATION_DENSITY = Object.freeze({
  ACTIVE: "FULL",
  PARENT: "REDUCED",
  GRANDPARENT: "MINIMAL",
} as const);

export const MANAGEMENT_LEVEL_SPATIAL_PRIORITY = Object.freeze({
  ACTIVE: 3,
  PARENT: 2,
  GRANDPARENT: 1,
} as const);

export const MANAGEMENT_LEVEL_DEPTH_ORDER = Object.freeze({
  ACTIVE: 1,
  PARENT: 2,
  GRANDPARENT: 3,
} as const);

export const MANAGEMENT_LEVEL_SEMANTIC_DEPTH: Readonly<
  Record<ManagementLevelRole, DthExpSpatialDepth>
> = Object.freeze({
  ACTIVE: "foreground",
  PARENT: "middle",
  GRANDPARENT: "background",
});

export const MANAGEMENT_LEVEL_SCALE = Object.freeze({
  ACTIVE: 1,
  PARENT: 0.72,
  GRANDPARENT: 0.52,
} as const);

export type ManagementLevelSpatialPoint = {
  readonly x: number;
  readonly y: number;
};

export type ManagementLevelSpatialPlacement = {
  readonly plane: "xy";
  readonly normalized: ManagementLevelSpatialPoint;
  readonly world: Readonly<{ x: number; y: number; z: typeof EXECUTIVE_STAGE_2D_DEPTH }>;
  readonly width: number;
  readonly height: number;
  readonly worldZ: typeof EXECUTIVE_STAGE_2D_DEPTH;
};

export type ManagementLevelSpatialSlot = {
  readonly role: ManagementLevelRole;
  readonly canonicalId: string;
  readonly kind: NmiNodeKind | null;
  readonly displayIdentity: string | null;
  readonly depthOrder: 1 | 2 | 3;
  readonly spatialPriority: 1 | 2 | 3;
  readonly detailMode: ManagementLevelDetail;
  readonly presentationMode: ManagementLevelPresentationMode;
  readonly interactionMode: ManagementLevelInteractionMode;
  readonly scaleClass: ManagementLevelScaleClass;
  readonly scale: number;
  readonly semanticDepth: DthExpSpatialDepth;
  readonly informationDensity: "FULL" | "REDUCED" | "MINIMAL";
  readonly placement: ManagementLevelSpatialPlacement;
  readonly animationTarget: ManagementLevelSpatialPlacement;
  readonly interpolationImplemented: false;
  readonly visibility: "VISIBLE";
  readonly clickable: true;
  readonly disabled: false;
  readonly secondaryLabels: boolean;
  readonly supportingDecoration: boolean;
  readonly stageCardEligible: boolean;
  readonly groundTreatment: "none" | "quiet-anchor";
  readonly copiesCanonicalObject: false;
  readonly mutatesOvsManagementState: false;
  readonly mutatesOvsGeometry: false;
  readonly mutatesSelectionFocusWatchCritical: false;
  readonly encodesLevelAsExecutiveState: false;
  readonly impliesCausality: false;
  readonly impliesDependsOn: false;
};

export type ManagementLevelSpatialConnector = {
  readonly fromRole: ManagementLevelRole;
  readonly toRole: ManagementLevelRole;
  readonly fromCanonicalId: string;
  readonly toCanonicalId: string;
  readonly from: ManagementLevelSpatialPoint;
  readonly to: ManagementLevelSpatialPoint;
  readonly meaning: "hierarchical-containment";
  readonly sourceAuthority: "NMI:1 belongs_to via MLEVEL:1";
  readonly impliesCausality: false;
  readonly impliesDependsOn: false;
  readonly impliesConstraint: false;
  readonly impliesExecutionFlow: false;
};

export type ManagementLevelSpatialComposition = {
  readonly identity: typeof nmiManagementLevelSpatialIdentity;
  readonly layoutMode: ManagementLevelSpatialLayoutMode;
  readonly slots: readonly ManagementLevelSpatialSlot[];
  readonly connectors: readonly ManagementLevelSpatialConnector[];
  readonly visibleLevelCount: 0 | 1 | 2 | 3;
  readonly placeholderSlots: 0;
  readonly cardAuthority: typeof SCENE_ORG_NORMAL_STAGE_CARD_RULE;
  readonly multipliesStageCardLimit: false;
  readonly levelCards: false;
  readonly plane: "xy";
  readonly physicalZ: typeof EXECUTIVE_STAGE_2D_DEPTH;
  readonly usesZForHierarchy: false;
  readonly normalizedSpace: typeof DTH_EXP_NORMALIZED_STAGE_SPACE;
  readonly resolvesHierarchy: false;
  readonly ownsHierarchy: false;
  readonly ownsObjectTruth: false;
  readonly ownsStageTruth: false;
  readonly ownsOvs: false;
  readonly ownsTheatre: false;
  readonly ownsReferentTruth: false;
  readonly secondStage: false;
  readonly secondSceneGraph: false;
  readonly secondCanvas: false;
  readonly secondDirector: false;
  readonly startsMlevel3: false;
};

export const NMI_MANAGEMENT_LEVEL_SPATIAL_CONTRACT = Object.freeze({
  identity: nmiManagementLevelSpatialIdentity,
  pathAuthority: "NPA-T MLEVEL:1/ManagementLevelPath",
  hierarchyAuthority: "NMI:1/UnifiedManagementModel belongs_to",
  selectionAuthority: "NMI:6 selectedCanonicalId / Stage selection",
  placementOwner: "MLEVEL:2 presentation projection",
  stagePlaneAuthority: "STAGE-2D:1/2 XY + Z=0",
  normalizedSpaceAuthority: "DTH-EXP:5A normalized scene space",
  objectVisualAuthority: "OVS",
  theatreAuthority: "DTH / DIR:1",
  cardAuthority: SCENE_ORG_NORMAL_STAGE_CARD_RULE,
  regionAuthority: "SCENE-ORG center-stage",
  referentAuthority: "MO / conversation / Stage selection",
  usesZForHierarchy: false as const,
  resolvesHierarchy: false as const,
  multipliesStageCardLimit: false as const,
  levelCards: false as const,
  secondStage: false as const,
  secondSceneGraph: false as const,
  secondCanvas: false as const,
  secondDirector: false as const,
  startsMlevel3: false as const,
  interpolationImplemented: false as const,
});
