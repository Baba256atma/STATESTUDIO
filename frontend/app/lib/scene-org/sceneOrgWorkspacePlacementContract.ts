import type {
  SceneOrgCanonicalReference,
  SceneOrgRegionId,
} from "./sceneOrgRegionContract";
import type { SceneOrgVisibilityLevel } from "./sceneOrgVisibilityContract";
import {
  isLegacyWorkflowWorkspaceIdentifier,
  isProtectedDemoWorkspaceId,
} from "../workspace/workspaceRegistryContract";
import {
  parseSceneOrgSavedSceneSpatialState,
  type SceneOrgSavedSceneSpatialState,
} from "./sceneOrgSavedSceneSpatialState";
import {
  CAUSAL_INVESTIGATION_VIEW,
  DECISION_SOLAR_VIEW,
  ORGANIZATIONAL_SOLAR_VIEW,
  parseStagePresentationView,
  type StagePresentationView,
} from "./organizationalSolarView";
import {
  parseCanonicalTopologyPresentation,
  type CanonicalTopologyType,
} from "./canonicalTopologyEngine";

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
  /** Set only for demo_workspace. Absent means a legacy unowned scene. */
  demoProfileId?: "manufacturing" | "project";
  /**
   * Manager Deck that owns this Scene.
   * Absent on Demo Scenes and on manager records saved before Deck ownership.
   */
  ownerDeckId?: string;
  /**
   * Scene-owned stage-plane positions. Absent on Scenes saved before spatial
   * persistence; those Scenes keep the layout solver.
   */
  spatialState?: SceneOrgSavedSceneSpatialState;
  /**
   * Stage presentation mode. Absent means the existing Stage view.
   * Organizational Solar is a presentation mode, not a workflow or a Deck.
   */
  stageView?: StagePresentationView;
  /**
   * NexoCause identities only. Resolved Dataset values are not scene truth.
   * Absent on Scenes saved before investigation selection.
   */
  causalSelection?: SceneOrgCausalSelection;
  /**
   * Selected topology presentation. Absent means no topology layout was chosen.
   * This is not a copy of the canonical relationship graph.
   */
  topologyPresentation?: CanonicalTopologyType;
  /**
   * Content revision of this Scene record. Absent on records saved before
   * revision checks. Readers treat absence as revision 1. That is compatibility
   * on read, not a reconstructed history of earlier edits.
   */
  revision?: number;
}>;

export type SceneOrgCausalSelection = Readonly<{
  investigationId: string;
  hypothesisId: string | null;
  canonicalObjectId: string | null;
}>;

function causalIdentity(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (text.length === 0 || text.length > 180 || /\s/.test(text)) return null;
  return text;
}

/** Keeps investigation identities. Any other field, including a resolved value, drops the selection. */
export function parseSceneOrgCausalSelection(value: unknown): SceneOrgCausalSelection | null {
  if (value == null || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const allowed = new Set(["investigationId", "hypothesisId", "canonicalObjectId"]);
  if (Object.keys(record).some((key) => !allowed.has(key))) return null;
  const investigationId = causalIdentity(record.investigationId);
  if (!investigationId) return null;
  const hypothesisId = record.hypothesisId == null ? null : causalIdentity(record.hypothesisId);
  const canonicalObjectId = record.canonicalObjectId == null ? null : causalIdentity(record.canonicalObjectId);
  if (record.hypothesisId != null && hypothesisId == null) return null;
  if (record.canonicalObjectId != null && canonicalObjectId == null) return null;
  return Object.freeze({ investigationId, hypothesisId, canonicalObjectId });
}

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
  readonly demoProfileId?: "manufacturing" | "project" | null;
  readonly ownerDeckId?: string | null;
  readonly spatialState?: SceneOrgSavedSceneSpatialState | null;
  readonly stageView?: StagePresentationView | null;
  readonly topologyPresentation?: CanonicalTopologyType | null;
  readonly causalSelection?: SceneOrgCausalSelection | null;
  readonly revision?: number | null;
}): SceneOrgSavedScene {
  const sceneId = input.sceneId.trim();
  const name = input.name.trim();
  if (sceneId.length === 0 || name.length === 0) {
    throw new Error("ORG:4 Saved Scenes require an identity and name.");
  }
  const managerWorkspaceId = savedSceneManagerWorkspaceId(input.managerWorkspaceId);
  const demoProfileId =
    managerWorkspaceId === "demo_workspace" &&
    (input.demoProfileId === "manufacturing" || input.demoProfileId === "project")
      ? input.demoProfileId
      : null;
  const ownerDeckId =
    managerWorkspaceId &&
    !isProtectedDemoWorkspaceId(managerWorkspaceId) &&
    typeof input.ownerDeckId === "string" &&
    input.ownerDeckId.trim().length > 0
      ? input.ownerDeckId.trim()
      : null;
  const spatialState = input.spatialState == null
    ? null
    : parseSceneOrgSavedSceneSpatialState(input.spatialState);
  if (input.spatialState != null && spatialState == null) {
    throw new Error("ORG:4 Saved Scenes reject an invalid spatial layout.");
  }
  const parsedView = parseStagePresentationView(input.stageView);
  const stageView = parsedView === ORGANIZATIONAL_SOLAR_VIEW
    || parsedView === DECISION_SOLAR_VIEW
    || parsedView === CAUSAL_INVESTIGATION_VIEW
    ? parsedView
    : null;
  const causalSelection = stageView === CAUSAL_INVESTIGATION_VIEW
    ? parseSceneOrgCausalSelection(input.causalSelection)
    : null;
  const topologyPresentation = parseCanonicalTopologyPresentation(input.topologyPresentation);
  const revision = Number.isInteger(input.revision) && (input.revision ?? 0) >= 1
    ? input.revision
    : null;
  return Object.freeze({
    sceneId,
    name,
    kind: input.kind,
    sceneIntentType: input.sceneIntentType,
    canonicalReferences: Object.freeze([...input.canonicalReferences]),
    layout: Object.freeze({ ...input.layout }),
    visibility: Object.freeze({ ...(input.visibility ?? {}) }),
    ...(managerWorkspaceId ? { managerWorkspaceId } : {}),
    ...(demoProfileId ? { demoProfileId } : {}),
    ...(ownerDeckId ? { ownerDeckId } : {}),
    ...(spatialState ? { spatialState } : {}),
    ...(stageView ? { stageView } : {}),
    ...(causalSelection ? { causalSelection } : {}),
    ...(topologyPresentation ? { topologyPresentation } : {}),
    ...(revision ? { revision } : {}),
  });
}

/** True when two Scenes belong to the same Workspace, Demo Profile, and Deck collection. */
export function sameSceneOrgSavedSceneCollection(
  scene: Pick<SceneOrgSavedScene, "managerWorkspaceId" | "demoProfileId" | "ownerDeckId">,
  owner: {
    readonly managerWorkspaceId: string | null;
    readonly demoProfileId?: "manufacturing" | "project" | null;
    readonly ownerDeckId?: string | null;
  },
): boolean {
  return (scene.managerWorkspaceId ?? null) === owner.managerWorkspaceId
    && (scene.demoProfileId ?? null) === (owner.demoProfileId ?? null)
    && (scene.ownerDeckId ?? null) === (owner.ownerDeckId ?? null);
}

/**
 * Keeps a stable name-derived id inside one collection.
 * A record owned by another Workspace, Deck, or Demo Profile keeps its id.
 */
export function allocateSceneOrgSavedSceneId(input: {
  readonly requestedSceneId: string;
  readonly scenes: readonly SceneOrgSavedScene[];
  readonly managerWorkspaceId: string;
  readonly ownerDeckId: string | null;
  readonly demoProfileId?: "manufacturing" | "project" | null;
}): string {
  const owner = {
    managerWorkspaceId: input.managerWorkspaceId,
    ownerDeckId: input.ownerDeckId,
    demoProfileId: input.demoProfileId ?? null,
  };
  const occupied = input.scenes.find((scene) => scene.sceneId === input.requestedSceneId);
  if (!occupied || sameSceneOrgSavedSceneCollection(occupied, owner)) return input.requestedSceneId;
  const scope = input.ownerDeckId ?? input.demoProfileId ?? input.managerWorkspaceId;
  let candidate = `${input.requestedSceneId}-${scope}`;
  const collision = input.scenes.find((scene) => scene.sceneId === candidate);
  if (collision && !sameSceneOrgSavedSceneCollection(collision, owner)) {
    candidate = `${input.requestedSceneId}-${scope}-${input.managerWorkspaceId}`;
  }
  return candidate;
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
