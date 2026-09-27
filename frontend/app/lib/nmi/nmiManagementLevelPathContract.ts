/**
 * NPA-T MLEVEL:1 — visible Management Level path contract.
 * Projects L1/L2/L3 from NMI belongs_to. Does not own hierarchy or Stage state.
 */

import type { NmiNodeKind } from "./nmiContract.ts";
import { nmiManagementLevelPathIdentity } from "./nmiManagementLevelPathIdentity.ts";

export const MANAGEMENT_LEVEL_ROLES = Object.freeze(["ACTIVE", "PARENT", "GRANDPARENT"] as const);
export type ManagementLevelRole = (typeof MANAGEMENT_LEVEL_ROLES)[number];

export const MANAGEMENT_LEVEL_DETAIL = Object.freeze({
  ACTIVE: "FULL",
  PARENT: "SUMMARY",
  GRANDPARENT: "ORIENTATION",
} as const);

export type ManagementLevelDetail = (typeof MANAGEMENT_LEVEL_DETAIL)[ManagementLevelRole];

export const MANAGEMENT_LEVEL_PRESENTATION_MODE = Object.freeze({
  ACTIVE: "WORKING",
  PARENT: "CONTEXT",
  GRANDPARENT: "MINIMAL",
} as const);

export type ManagementLevelPresentationMode =
  (typeof MANAGEMENT_LEVEL_PRESENTATION_MODE)[ManagementLevelRole];

export const MANAGEMENT_LEVEL_PARENT_RESOLUTIONS = Object.freeze([
  "ABSENT",
  "CANONICAL",
  "AMBIGUOUS",
] as const);

export type ManagementLevelParentResolution = (typeof MANAGEMENT_LEVEL_PARENT_RESOLUTIONS)[number];

export type ManagementLevelAdjacentRelation = "SELF" | "PARENT_OF_ACTIVE" | "PARENT_OF_PARENT";

export type ManagementLevelSubjectProjection = {
  readonly canonicalId: string;
  readonly kind: NmiNodeKind | null;
  readonly displayIdentity: string | null;
  readonly role: ManagementLevelRole;
  readonly detail: ManagementLevelDetail;
  readonly presentationMode: ManagementLevelPresentationMode;
  readonly relationshipToActive: "SELF" | "PARENT" | "GRANDPARENT";
  readonly relationshipToAdjacent: ManagementLevelAdjacentRelation;
  readonly clickable: true;
  readonly interactive: true;
  readonly copiesCanonicalObject: false;
};

export type ManagementLevelPath = {
  readonly identity: typeof nmiManagementLevelPathIdentity;
  readonly active: ManagementLevelSubjectProjection | null;
  readonly parent: ManagementLevelSubjectProjection | null;
  readonly grandparent: ManagementLevelSubjectProjection | null;
  readonly visibleDepth: 0 | 1 | 2 | 3;
  readonly parentResolution: ManagementLevelParentResolution;
  readonly grandparentResolution: ManagementLevelParentResolution;
  readonly higherAncestryExists: boolean;
  readonly higherAncestryExpanded: false;
  readonly usesNavigationHistory: false;
  readonly usesTrailAsHierarchy: false;
  readonly usesInferredMoParentChild: false;
  readonly usesUndirectedBranchAsPath: false;
  readonly ownsHierarchy: false;
  readonly ownsObjectTruth: false;
  readonly ownsStageTruth: false;
  readonly ownsReferentTruth: false;
  readonly secondManagementGraph: false;
  readonly secondNmi: false;
  readonly secondStage: false;
  readonly secondSceneAuthority: false;
  readonly mutatesSelection: false;
  readonly mutatesLocalLevelStack: false;
  readonly inventsHierarchy: false;
  readonly hardcodesGrandparentAsCompany: false;
  readonly startsMlevel2: false;
};

export type ManagementLevelNavigationRequest =
  | {
      readonly kind: "CANONICAL_NAVIGATION";
      readonly canonicalId: string;
      readonly sourceRole: ManagementLevelRole;
      readonly mutatesLocalLevelStack: false;
      readonly restoresSnapshot: false;
      readonly synthesizesObject: false;
    }
  | {
      readonly kind: "NONE";
      readonly reason: "NO_ACTIVE_PATH" | "LEVEL_ABSENT";
      readonly mutatesLocalLevelStack: false;
    };

export const NMI_MANAGEMENT_LEVEL_PATH_CONTRACT = Object.freeze({
  identity: nmiManagementLevelPathIdentity,
  hierarchyAuthority: "NMI:1/UnifiedManagementModel belongs_to",
  mapAuthority: "NMI:2/ManagementMap",
  activeSubjectAuthority: "NMI:6 selectedCanonicalId / Stage selection",
  navigationAuthority: "NMI:5 / Stage selectNexoraMVPInteractionSubject",
  objectVisualAuthority: "OVS",
  theatreAuthority: "DTH / DIR:1",
  referentAuthority: "MO / conversation / Stage selection",
  visibleLevelCap: 3 as const,
  parentRelation: "belongs_to" as const,
  usesNavigationHistory: false as const,
  usesTrailAsHierarchy: false as const,
  usesInferredMoParentChild: false as const,
  usesUndirectedBranchAsPath: false as const,
  ownsHierarchy: false as const,
  ownsObjectTruth: false as const,
  ownsStageTruth: false as const,
  ownsReferentTruth: false as const,
  secondManagementGraph: false as const,
  secondNmi: false as const,
  secondStage: false as const,
  inventsHierarchy: false as const,
  hardcodesGrandparentAsCompany: false as const,
  startsMlevel2: false as const,
});
