/**
 * NPA-T MLEVEL:3 — classify level interaction; never own navigation or referents.
 */

import type { ManagementLevelRole } from "./nmiManagementLevelPathContract.ts";
import { nmiManagementLevelInteractionIdentity } from "./nmiManagementLevelInteractionIdentity.ts";

export const MANAGEMENT_LEVEL_INTERACTION_KINDS = Object.freeze([
  "HOVER",
  "FOCUS",
  "DISCLOSURE",
  "ACTIVATE",
] as const);
export type ManagementLevelInteractionKind =
  (typeof MANAGEMENT_LEVEL_INTERACTION_KINDS)[number];

export const MANAGEMENT_LEVEL_ACTIVATION_SURFACES = Object.freeze([
  "POINTER",
  "KEYBOARD",
] as const);
export type ManagementLevelActivationSurface =
  (typeof MANAGEMENT_LEVEL_ACTIVATION_SURFACES)[number];

export const MANAGEMENT_LEVEL_INTENTS = Object.freeze([
  "DRILL_DOWN",
  "DRILL_UP",
  "ACTIVATE",
  "NONE",
] as const);
export type ManagementLevelIntent = (typeof MANAGEMENT_LEVEL_INTENTS)[number];

export type ManagementLevelInteractionRequest = {
  readonly identity: typeof nmiManagementLevelInteractionIdentity;
  readonly kind: ManagementLevelInteractionKind;
  readonly surface: ManagementLevelActivationSurface | null;
  readonly sourceCanonicalId: string | null;
  readonly targetCanonicalId: string | null;
  readonly sourceLevel: ManagementLevelRole | null;
  readonly intent: ManagementLevelIntent;
  readonly navigation: "CANONICAL_NAVIGATION" | "NONE";
  readonly opensDetailWorkspace: false;
  readonly mutatesLocalLevelStack: false;
  readonly restoresSnapshot: false;
  readonly synthesizesObject: false;
  readonly usesTrailAsHierarchy: false;
  readonly usesInferredMoParentChild: false;
  readonly usesSceneGraphParentId: false;
};

export const NMI_MANAGEMENT_LEVEL_INTERACTION_CONTRACT = Object.freeze({
  identity: nmiManagementLevelInteractionIdentity,
  navigationAuthority: "selectNexoraMVPInteractionSubject / onSelectSubject",
  pathAuthority: "NPA-T MLEVEL:1/ManagementLevelPath",
  spatialAuthority: "NPA-T MLEVEL:2/ManagementLevelSpatialPlacement",
  hierarchyAuthority: "NMI:1 belongs_to",
  referentAuthority: "MO / conversation / Stage selection",
  rightContextAuthority: "SCENE-ORG ORG:5 projectSceneOrgRightContext",
  advisorAuthority: "NMI:8 advisorBundle / existing Stage advisor bridge",
  ownsHierarchy: false as const,
  ownsNavigationStore: false as const,
  ownsDrillStack: false as const,
  ownsReferentStore: false as const,
  ownsRightContext: false as const,
  ownsAdvisorContext: false as const,
  secondStage: false as const,
  secondDirector: false as const,
  secondSceneGraph: false as const,
  interpolationImplemented: false as const,
  startsMlevel4: false as const,
});
