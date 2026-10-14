import type {
  SceneOrgCanonicalReference,
  SceneOrgRegionId,
} from "./sceneOrgRegionContract";
import type { SceneOrgVisibilityLevel } from "./sceneOrgVisibilityContract";
import { isLegacyWorkflowWorkspaceIdentifier } from "../workspace/workspaceRegistryContract";

/** NPA-T ORG:4 — placement and saved-view metadata, never business truth. */
export const sceneOrgWorkspacePlacementContractIdentity =
  "NPA-T ORG:4/WorkspacePlacementStageCardsSavedScenes" as const;

export type SceneOrgPlacedSurface =
  | "NMI_NAVIGATION"
  | "ATTENTION"
  | "MANAGEMENT_STAGE"
  | "ADVISOR_CONTEXT"
  | "RAW_CSV_DATA"
  | "PROVENANCE_MAPPING"
  | "CONNECTION_CONFIGURATION";

export const SCENE_ORG_SURFACE_PLACEMENT: Readonly<
  Record<SceneOrgPlacedSurface, SceneOrgRegionId>
> = Object.freeze({
  NMI_NAVIGATION: "left-management",
  ATTENTION: "left-management",
  MANAGEMENT_STAGE: "center-stage",
  ADVISOR_CONTEXT: "right-context",
  RAW_CSV_DATA: "detail-workspace",
  PROVENANCE_MAPPING: "detail-workspace",
  CONNECTION_CONFIGURATION: "detail-workspace",
});

export const SCENE_ORG_REGION_PLACEMENT_POLICY = Object.freeze({
  "left-management": Object.freeze({
    responsibility: "NMI, Attention, and high-level management orientation",
    permanentRawDataNavigation: false,
  }),
  "center-stage": Object.freeze({
    responsibility: "authority-composed active management scene",
    permanentDeepDetail: false,
  }),
  "right-context": Object.freeze({
    responsibility: "Advisor and supporting contextual intelligence",
  }),
  "detail-workspace": Object.freeze({
    responsibility: "CSV, provenance, mappings, connections, and configuration",
  }),
});

export const SCENE_ORG_NORMAL_STAGE_CARD_RULE = Object.freeze({
  minimum: 0,
  maximum: 3,
  appliesTo: "normal-management-cards",
  preservesAuthorityOrder: true,
  calculatesRelevance: false,
  theatreCompositionExempt: true,
  deepDetailExcluded: true,
});

export type SceneOrgStagePresentationMode =
  | "NORMAL_MANAGEMENT_CARDS"
  | "THEATRE_COMPOSITION";

export type SceneOrgStagePresentation<T extends SceneOrgCanonicalReference> =
  Readonly<{
    mode: SceneOrgStagePresentationMode;
    visible: readonly T[];
    deferred: readonly T[];
    authorityOrderPreserved: true;
    relevanceCalculated: false;
  }>;

/**
 * Applies display density after DIR/DTH/Stage admission. It preserves the
 * supplied order and references and therefore performs no relevance ranking.
 */
export function projectSceneOrgStagePresentation<
  T extends SceneOrgCanonicalReference,
>(input: {
  readonly mode: SceneOrgStagePresentationMode;
  readonly authorityAdmitted: readonly T[];
}): SceneOrgStagePresentation<T> {
  const splitAt =
    input.mode === "THEATRE_COMPOSITION"
      ? input.authorityAdmitted.length
      : SCENE_ORG_NORMAL_STAGE_CARD_RULE.maximum;
  return Object.freeze({
    mode: input.mode,
    visible: Object.freeze(input.authorityAdmitted.slice(0, splitAt)),
    deferred: Object.freeze(input.authorityAdmitted.slice(splitAt)),
    authorityOrderPreserved: true,
    relevanceCalculated: false,
  });
}

export const SCENE_ORG_SAVED_SCENE_KINDS = Object.freeze([
  "TEMPORARY",
  "SAVED",
  "DEFAULT_MANAGER",
] as const);

export type SceneOrgSavedSceneKind =
  (typeof SCENE_ORG_SAVED_SCENE_KINDS)[number];

export type SceneOrgSavedSceneLayoutPreferences = Readonly<{
  presentationDepth: "minimum" | "report" | "operation";
  leftRegion: "management";
  rightRegion: "contextual" | "collapsed";
  detailWorkspace: "closed" | "open";
}>;

export type SceneOrgSavedScene = Readonly<{
  sceneId: string;
  name: string;
  kind: SceneOrgSavedSceneKind;
  sceneIntentType: string;
  canonicalReferences: readonly SceneOrgCanonicalReference[];
  layout: SceneOrgSavedSceneLayoutPreferences;
  visibility: Readonly<Partial<Record<SceneOrgRegionId, SceneOrgVisibilityLevel>>>;
  /** Canonical Manager Workspace that owns this Scene. Absent means unassigned. */
  managerWorkspaceId?: string;
}>;

/** Workflow-mode strings are not Manager Workspace owners. */
export function savedSceneManagerWorkspaceId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const workspaceId = value.trim();
  if (workspaceId.length === 0 || isLegacyWorkflowWorkspaceIdentifier(workspaceId)) return null;
  return workspaceId;
}

/**
 * Captures the canonical subject currently presented in the workspace. Direct
 * Stage/Activity navigation can be newer than the conversation referent, so
 * the referent is fallback context rather than the Saved Scene owner.
 */
export function resolveSceneOrgSavedSceneCaptureId(input: {
  readonly focusedSubjectId: string | null;
  readonly selectedSubjectId: string | null;
  readonly resolvedReferentId: string | null;
}): string | null {
  return (
    input.focusedSubjectId ??
    input.selectedSubjectId ??
    input.resolvedReferentId ??
    null
  );
}

/** Whitelists reference/view fields so business-state payloads cannot persist. */
export function createSceneOrgSavedScene(input: {
  readonly sceneId: string;
  readonly name: string;
  readonly kind: SceneOrgSavedSceneKind;
  readonly sceneIntentType: string;
  readonly canonicalReferences: readonly SceneOrgCanonicalReference[];
  readonly layout: SceneOrgSavedSceneLayoutPreferences;
  readonly visibility?: Partial<Record<SceneOrgRegionId, SceneOrgVisibilityLevel>>;
  readonly managerWorkspaceId?: string | null;
}): SceneOrgSavedScene {
  const sceneId = input.sceneId.trim();
  const name = input.name.trim();
  if (sceneId.length === 0 || name.length === 0) {
    throw new Error("ORG:4 Saved Scenes require an identity and name.");
  }
  const managerWorkspaceId = savedSceneManagerWorkspaceId(input.managerWorkspaceId);
  return Object.freeze({
    sceneId,
    name,
    kind: input.kind,
    sceneIntentType: input.sceneIntentType,
    canonicalReferences: Object.freeze([...input.canonicalReferences]),
    layout: Object.freeze({ ...input.layout }),
    visibility: Object.freeze({ ...(input.visibility ?? {}) }),
    ...(managerWorkspaceId ? { managerWorkspaceId } : {}),
  });
}

export type SceneOrgResolvedSavedScene<T> = Readonly<{
  scene: SceneOrgSavedScene;
  status:
    | "resolved-current-canonical-subject"
    | "no-canonical-reference"
    | "canonical-subject-missing";
  restoredCanonicalId: string | null;
  live: readonly Readonly<{
    reference: SceneOrgCanonicalReference;
    content: T | null;
  }>[];
}>;

/** Resolves every reopen from canonical authorities; no content is cached. */
export function resolveSceneOrgSavedScene<T>(
  scene: SceneOrgSavedScene,
  resolveCanonical: (reference: SceneOrgCanonicalReference) => T | null,
): SceneOrgResolvedSavedScene<T> {
  const live = Object.freeze(
    scene.canonicalReferences.map((reference) =>
      Object.freeze({ reference, content: resolveCanonical(reference) }),
    ),
  );
  const restored = live.find((entry) => entry.content != null) ?? null;
  return Object.freeze({
    scene,
    status:
      restored != null
        ? "resolved-current-canonical-subject"
        : scene.canonicalReferences.length === 0
          ? "no-canonical-reference"
          : "canonical-subject-missing",
    restoredCanonicalId: restored?.reference.canonicalId ?? null,
    live,
  });
}

export const SCENE_ORG_PLACEMENT_AUTHORITY_GUARD = Object.freeze({
  createsRelevanceAuthority: false,
  createsBusinessTruth: false,
  createsSceneComposer: false,
  createsWorkflow: false,
  createsPersistenceStore: false,
  copiesCanonicalBusinessState: false,
  addsNaturalLanguageRouting: false,
});
