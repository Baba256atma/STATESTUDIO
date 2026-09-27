import type {
  SceneOrgCanonicalReference,
  SceneOrgRegionId,
} from "./sceneOrgRegionContract";

/**
 * NPA-T ORG:3 — presentation hierarchy only.
 *
 * Classification is supplied by an existing relevance authority. This module
 * maps that classification to display treatment; it never scores or admits
 * business information itself.
 */
export const sceneOrgVisibilityContractIdentity =
  "NPA-T ORG:3/InformationHierarchyVisibility" as const;

export const SCENE_ORG_VISIBILITY_LEVELS = Object.freeze([
  "PRIMARY",
  "SUPPORTING",
  "DEFERRED",
  "DEEP_DETAIL",
] as const);

export type SceneOrgVisibilityLevel =
  (typeof SCENE_ORG_VISIBILITY_LEVELS)[number];

export type SceneOrgVisibilityTreatment =
  | "visible-dominant"
  | "visible-subordinate"
  | "collapsed-until-requested"
  | "detail-workspace-only";

export const SCENE_ORG_VISIBILITY_TREATMENT: Readonly<
  Record<SceneOrgVisibilityLevel, SceneOrgVisibilityTreatment>
> = Object.freeze({
  PRIMARY: "visible-dominant",
  SUPPORTING: "visible-subordinate",
  DEFERRED: "collapsed-until-requested",
  DEEP_DETAIL: "detail-workspace-only",
});

export type SceneOrgExistingRelevanceAuthority =
  | "NMI:1-8"
  | "STAGE-PROD Queue/Attention"
  | "DIR:1"
  | "DTH/DTH-EXP"
  | "NEX-MVP/STAGE-PROD"
  | "CC:5/NCA/NXA/ECA/MO"
  | "RDI/Data Reality/Gate"
  | "RDI:2 CSV lifecycle";

export type SceneOrgRegionVisibilityPolicy = Readonly<{
  region: SceneOrgRegionId;
  defaultLevel: SceneOrgVisibilityLevel;
  accepts: readonly SceneOrgVisibilityLevel[];
  responsibility: string;
}>;

export const SCENE_ORG_REGION_VISIBILITY_POLICY: Readonly<
  Record<SceneOrgRegionId, SceneOrgRegionVisibilityPolicy>
> = Object.freeze({
  "left-management": Object.freeze({
    region: "left-management",
    defaultLevel: "SUPPORTING",
    accepts: Object.freeze(["PRIMARY", "SUPPORTING", "DEFERRED"] as const),
    responsibility: "Navigation, Attention, and high-level orientation; no raw or deep data.",
  }),
  "center-stage": Object.freeze({
    region: "center-stage",
    defaultLevel: "PRIMARY",
    accepts: Object.freeze(["PRIMARY", "SUPPORTING", "DEFERRED"] as const),
    responsibility: "Primary management situation with only authority-selected supporting context.",
  }),
  "right-context": Object.freeze({
    region: "right-context",
    defaultLevel: "SUPPORTING",
    accepts: Object.freeze(["SUPPORTING", "DEFERRED"] as const),
    responsibility: "Advisor and contextual intelligence subordinate to the active Stage situation.",
  }),
  "detail-workspace": Object.freeze({
    region: "detail-workspace",
    defaultLevel: "DEEP_DETAIL",
    accepts: Object.freeze(["DEEP_DETAIL"] as const),
    responsibility: "CSV, provenance, mappings, connections, and configuration detail.",
  }),
});

export const SCENE_ORG_VISIBILITY_AUTHORITY_GUARD = Object.freeze({
  presentationOnly: true,
  consumesAuthoritativeSelection: true,
  calculatesPriority: false,
  calculatesRelevance: false,
  ownsAdmission: false,
  mutatesCanonicalState: false,
  createsDirectorLogic: false,
});

export type SceneOrgVisibilityProjection = Readonly<{
  reference: SceneOrgCanonicalReference;
  level: SceneOrgVisibilityLevel;
  treatment: SceneOrgVisibilityTreatment;
  region: SceneOrgRegionId;
  classifiedBy: SceneOrgExistingRelevanceAuthority;
}>;

/** Maps an externally supplied classification without copying business state. */
export function projectSceneOrgVisibility(input: {
  readonly reference: SceneOrgCanonicalReference;
  readonly level: SceneOrgVisibilityLevel;
  readonly region: SceneOrgRegionId;
  readonly classifiedBy: SceneOrgExistingRelevanceAuthority;
}): SceneOrgVisibilityProjection {
  const policy = SCENE_ORG_REGION_VISIBILITY_POLICY[input.region];
  if (!policy.accepts.includes(input.level)) {
    throw new Error(
      `ORG:3 ${input.level} information does not belong in ${input.region}.`,
    );
  }
  return Object.freeze({
    reference: input.reference,
    level: input.level,
    treatment: SCENE_ORG_VISIBILITY_TREATMENT[input.level],
    region: input.region,
    classifiedBy: input.classifiedBy,
  });
}
