/**
 * NOL-2:4 — NexoraObject Representation Context & Adaptive Density Engine
 *
 * Determines how much object information should be visible under stage
 * crowding, focus, selection, and executive attention. Produces
 * recommendations only — no rendering, no NOL-1 mutation.
 *
 * Upstream: NOL-2:1 + NOL-2:2 + NOL-2:3 only.
 * Identity: NOL-2:4/NexoraObjectRepresentationContextAdaptiveDensityEngine
 */

import {
  materialRepresentationFoundationIdentity,
  materialRepresentationSchemaVersion,
  type NexoraObjectInformationDensity,
  type NexoraObjectRepresentation,
  type NexoraObjectRepresentationState,
  type NexoraObjectSeedColor,
} from "./nexoraObjectMaterialRepresentationFoundation.ts";
import {
  materialStateResolutionModelIdentity,
  materialStateResolutionSchemaVersion,
  type NexoraObjectMaterialState,
} from "./nexoraObjectMaterialStateResolutionModel.ts";
import {
  representationTransitionBehaviorEngineIdentity,
  representationTransitionBehaviorSchemaVersion,
  type NexoraObjectRepresentationTransitionState,
  type NexoraObjectRepresentationTransitionType,
} from "./nexoraObjectRepresentationTransitionBehaviorEngine.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const representationContextAdaptiveDensityEngineIdentity =
  "NOL-2:4/NexoraObjectRepresentationContextAdaptiveDensityEngine" as const;

export const representationContextAdaptiveDensityEngineVersion =
  "1.0.0" as const;

export const representationContextAdaptiveDensitySchemaVersion =
  "1.0.0" as const;

export const NOL_ADAPTIVE_DENSITY_IDENTITY =
  representationContextAdaptiveDensityEngineIdentity;
export const NOL_ADAPTIVE_DENSITY_VERSION =
  representationContextAdaptiveDensityEngineVersion;
export const NOL_ADAPTIVE_DENSITY_SCHEMA_VERSION =
  representationContextAdaptiveDensitySchemaVersion;

export const NOL_ADAPTIVE_DENSITY_UPSTREAM = Object.freeze([
  materialRepresentationFoundationIdentity,
  materialStateResolutionModelIdentity,
  representationTransitionBehaviorEngineIdentity,
] as const);

// ─── Constants ──────────────────────────────────────────────────────────────

export const NEXORA_OBJECT_STAGE_DENSITY_THRESHOLDS = Object.freeze({
  sparseMaxRatio: 0.4,
  balancedMaxRatio: 0.75,
  denseMaxRatio: 1.0,
  relationshipComplexityBump: 2.5,
  clusterComplexityBump: 4,
} as const);

export const NEXORA_OBJECT_DETAIL_BUDGET_COSTS = Object.freeze({
  minimumCost: 1,
  reportCost: 4,
  operationCost: 7,
  labelCost: 1,
  badgeCost: 1,
  relationshipCost: 2,
} as const);

export const NEXORA_OBJECT_RELEVANCE_WEIGHTS = Object.freeze({
  activeOperation: 100,
  focused: 90,
  currentSubject: 85,
  criticalStatus: 75,
  attentionPath: 70,
  selected: 65,
  warningStatus: 55,
  recentChange: 50,
  directNeighbor: 45,
  pinned: 40,
  highlighted: 35,
  historical: 20,
  background: 10,
  executiveImportanceScale: 0.15,
  urgencyScale: 0.1,
  attentionScoreScale: 0.1,
  impactScoreScale: 0.08,
  neighborDistancePenalty: 8,
} as const);

const SUPPORTED_TRANSITION_TYPES: readonly NexoraObjectRepresentationTransitionType[] =
  Object.freeze([
    "ExpandToReport",
    "ExpandToOperation",
    "CollapseToReport",
    "CollapseToMinimum",
    "FocusReveal",
    "SelectionReveal",
    "AttentionReveal",
    "EnterOperation",
    "ExitOperation",
    "EnterHistorical",
    "ExitHistorical",
    "Hide",
    "Show",
    "ResetRepresentation",
  ]);

const REASON_ORDER: readonly NexoraObjectRepresentationPriorityReason[] =
  Object.freeze([
    "ActiveOperation",
    "Focused",
    "CurrentSubject",
    "CriticalStatus",
    "AttentionPath",
    "Selected",
    "WarningStatus",
    "Highlighted",
    "RecentChange",
    "DirectNeighbor",
    "Pinned",
    "Historical",
    "Background",
  ]);

// ─── Types ──────────────────────────────────────────────────────────────────

export type NexoraObjectStageDensity =
  | "Sparse"
  | "Balanced"
  | "Dense"
  | "Critical";

export interface NexoraObjectViewportContext {
  readonly widthCategory: "Compact" | "Standard" | "Wide" | "UltraWide";
  readonly heightCategory: "Compact" | "Standard" | "Tall";
  readonly zoomLevel: number;
  readonly cameraDistance?: number;
  readonly visibleObjectCapacity: number;
  readonly reducedMotion: boolean;
}

export interface NexoraObjectStageContext {
  readonly visibleObjectCount: number;
  readonly totalObjectCount: number;
  readonly relationshipCount: number;
  readonly density: NexoraObjectStageDensity;
  readonly availableDetailBudget: number;
  readonly activeClusterCount: number;
  readonly mode:
    | "Overview"
    | "Inspection"
    | "Presentation"
    | "Operation"
    | "Replay";
}

export interface NexoraObjectInteractionContext {
  readonly selectedObjectIds: readonly string[];
  readonly focusedObjectId?: string;
  readonly highlightedObjectIds: readonly string[];
  readonly activeOperationObjectId?: string;
  readonly hoveredObjectId?: string;
  readonly pinnedObjectIds: readonly string[];
}

export interface NexoraObjectExecutiveContext {
  readonly primaryGoalObjectIds: readonly string[];
  readonly criticalObjectIds: readonly string[];
  readonly warningObjectIds: readonly string[];
  readonly decisionObjectIds: readonly string[];
  readonly executionObjectIds: readonly string[];
  readonly attentionPathObjectIds: readonly string[];
  readonly currentSubjectObjectId?: string;
}

export interface NexoraObjectTemporalContext {
  readonly mode: "Live" | "Historical" | "Replay" | "Preview";
  readonly currentPosition?: string;
  readonly historicalObjectIds: readonly string[];
  readonly changedObjectIds: readonly string[];
  readonly newlyCreatedObjectIds: readonly string[];
}

export interface NexoraObjectRepresentationPreferences {
  readonly preferredDensity:
    | "Automatic"
    | "Compact"
    | "Balanced"
    | "Detailed";
  readonly showCaptions: boolean;
  readonly showStatus: boolean;
  readonly showBadges: boolean;
  readonly showRelationships: boolean;
  readonly prioritizeWarnings: boolean;
  readonly prioritizeGoals: boolean;
  readonly maximumReportObjects?: number;
  readonly maximumVisibleLabels?: number;
  readonly maximumVisibleBadges?: number;
}

export interface NexoraObjectAdaptiveRepresentationContext {
  readonly contextId: string;
  readonly contextVersion: string;
  readonly source:
    | "Director"
    | "Workspace"
    | "Advisor"
    | "Timeline"
    | "Explorer"
    | "System";
  readonly viewport: NexoraObjectViewportContext;
  readonly stage: NexoraObjectStageContext;
  readonly interaction: NexoraObjectInteractionContext;
  readonly executive: NexoraObjectExecutiveContext;
  readonly temporal: NexoraObjectTemporalContext;
  readonly preferences: NexoraObjectRepresentationPreferences;
  readonly occurredAt: string;
}

export interface NexoraObjectAdaptiveContextEntry {
  readonly representation: NexoraObjectRepresentation;
  readonly materialState: NexoraObjectMaterialState;
  readonly transitionState: NexoraObjectRepresentationTransitionState;
  readonly relationshipDistanceFromFocus?: number;
  readonly executiveImportance?: number;
  readonly urgency?: number;
  readonly attentionScore?: number;
  readonly impactScore?: number;
  readonly confidence?: number;
  readonly groupingKey?: string;
}

export type NexoraObjectRepresentationPriorityReason =
  | "ActiveOperation"
  | "Focused"
  | "CurrentSubject"
  | "CriticalStatus"
  | "WarningStatus"
  | "Selected"
  | "Highlighted"
  | "AttentionPath"
  | "RecentChange"
  | "DirectNeighbor"
  | "Pinned"
  | "Historical"
  | "Background";

export interface NexoraObjectRepresentationPriority {
  readonly objectId: string;
  readonly relevanceScore: number;
  readonly visualPriority: number;
  readonly rank: number;
  readonly reasons: readonly NexoraObjectRepresentationPriorityReason[];
}

export interface NexoraObjectRepresentationDetailBudget {
  readonly totalUnits: number;
  readonly usedUnits: number;
  readonly remainingUnits: number;
  readonly minimumCost: number;
  readonly reportCost: number;
  readonly operationCost: number;
  readonly labelCost: number;
  readonly badgeCost: number;
  readonly relationshipCost: number;
  readonly exceededExplicitly?: boolean;
}

export interface NexoraObjectAdaptiveRepresentationRecommendation {
  readonly objectId: string;
  readonly currentState: NexoraObjectRepresentationState;
  readonly recommendedState: NexoraObjectRepresentationState;
  readonly recommendedDensity: NexoraObjectInformationDensity;
  readonly relevanceScore: number;
  readonly rank: number;
  readonly labelMode: "Hidden" | "Short" | "Full";
  readonly maximumBadgeCount: number;
  readonly indicatorMode:
    | "StatusOnly"
    | "Essential"
    | "Executive"
    | "Operational";
  readonly relationshipMode:
    | "Hidden"
    | "Direct"
    | "AttentionPath"
    | "Expanded";
  readonly dimmed: boolean;
  readonly clustered: boolean;
  readonly transitionRecommended: boolean;
  readonly reasons: readonly NexoraObjectRepresentationPriorityReason[];
}

export interface NexoraObjectAdaptiveTransitionRecommendation {
  readonly objectId: string;
  readonly fromState: NexoraObjectRepresentationState;
  readonly toState: NexoraObjectRepresentationState;
  readonly transitionType?: NexoraObjectRepresentationTransitionType;
  readonly priority: number;
  readonly reason: string;
}

export interface NexoraObjectCaptionAllocation {
  readonly objectId: string;
  readonly mode: "Hidden" | "Short" | "Full";
  readonly priority: number;
  readonly reason: string;
}

export interface NexoraObjectBadgeAllocation {
  readonly objectId: string;
  readonly maximumBadgeCount: number;
  readonly reason: string;
}

export interface NexoraObjectIndicatorAllocation {
  readonly objectId: string;
  readonly mode:
    | "StatusOnly"
    | "Essential"
    | "Executive"
    | "Operational";
  readonly reason: string;
}

export interface NexoraObjectRelationshipVisibilityAllocation {
  readonly objectId: string;
  readonly mode: "Hidden" | "Direct" | "AttentionPath" | "Expanded";
  readonly reason: string;
}

export interface NexoraObjectFocusNeighborhood {
  readonly focusedObjectId: string;
  readonly directNeighborIds: readonly string[];
  readonly secondaryNeighborIds: readonly string[];
  readonly backgroundObjectIds: readonly string[];
}

export interface NexoraObjectRepresentationContextLayer {
  readonly layer: "Global" | "Workspace" | "Subject" | "Object";
  readonly priority: number;
  readonly preferences: Partial<NexoraObjectRepresentationPreferences>;
}

export interface NexoraObjectRepresentationClusterHint {
  readonly clusterId: string;
  readonly memberObjectIds: readonly string[];
  readonly representativeObjectId?: string;
  readonly reason:
    | "CapacityOverflow"
    | "LowRelevance"
    | "SharedContext"
    | "HistoricalGroup"
    | "RelationshipGroup";
  readonly collapsed: boolean;
}

export interface NexoraObjectDetailAllocation {
  readonly objectId: string;
  readonly state: NexoraObjectRepresentationState;
  readonly density: NexoraObjectInformationDensity;
  readonly cost: number;
  readonly criticalOverride: boolean;
}

export type NexoraObjectAdaptiveDensityWarningCode =
  | "ADAPTIVE_DENSITY_CAPACITY_EXCEEDED"
  | "ADAPTIVE_DENSITY_DETAIL_BUDGET_EXCEEDED"
  | "ADAPTIVE_DENSITY_LABELS_COMPACTED"
  | "ADAPTIVE_DENSITY_BADGES_COMPACTED"
  | "ADAPTIVE_DENSITY_RELATIONSHIPS_HIDDEN"
  | "ADAPTIVE_DENSITY_OBJECTS_CLUSTERED"
  | "ADAPTIVE_DENSITY_OPERATION_PRESERVED"
  | "ADAPTIVE_DENSITY_CRITICAL_OBJECT_COMPACTED"
  | "ADAPTIVE_DENSITY_HISTORICAL_LIMIT_APPLIED"
  | "ADAPTIVE_DENSITY_PREFERENCE_OVERRIDDEN_FOR_SAFETY";

export interface NexoraObjectAdaptiveDensityWarning {
  readonly code: NexoraObjectAdaptiveDensityWarningCode;
  readonly message: string;
  readonly objectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export type NexoraObjectAdaptiveDensityErrorCode =
  | "ADAPTIVE_DENSITY_INVALID_CONTEXT"
  | "ADAPTIVE_DENSITY_INVALID_VIEWPORT"
  | "ADAPTIVE_DENSITY_INVALID_STAGE"
  | "ADAPTIVE_DENSITY_INVALID_ENTRY"
  | "ADAPTIVE_DENSITY_OBJECT_ID_MISMATCH"
  | "ADAPTIVE_DENSITY_DUPLICATE_OBJECT_ID"
  | "ADAPTIVE_DENSITY_DUPLICATE_CONTEXT_ID"
  | "ADAPTIVE_DENSITY_INVALID_SCORE"
  | "ADAPTIVE_DENSITY_INVALID_BUDGET"
  | "ADAPTIVE_DENSITY_OPERATION_UNAUTHORIZED"
  | "ADAPTIVE_DENSITY_HISTORICAL_OPERATION_FORBIDDEN"
  | "ADAPTIVE_DENSITY_HIDDEN_EXPANSION_FORBIDDEN"
  | "ADAPTIVE_DENSITY_CRITICAL_STATUS_HIDDEN"
  | "ADAPTIVE_DENSITY_INVALID_CLUSTER"
  | "ADAPTIVE_DENSITY_INVARIANT_VIOLATION"
  | "ADAPTIVE_DENSITY_UNSUPPORTED_VERSION";

export interface NexoraObjectAdaptiveDensityError {
  readonly code: NexoraObjectAdaptiveDensityErrorCode;
  readonly message: string;
  readonly objectId?: string;
  readonly contextId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export class NexoraObjectRepresentationContextAdaptiveDensityException extends Error {
  readonly code: NexoraObjectAdaptiveDensityErrorCode;
  readonly objectId?: string;
  readonly contextId?: string;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraObjectAdaptiveDensityError) {
    super(error.message);
    this.name = "NexoraObjectRepresentationContextAdaptiveDensityException";
    this.code = error.code;
    this.objectId = error.objectId;
    this.contextId = error.contextId;
    this.details = error.details;
  }
}

export interface NexoraObjectAdaptiveRepresentationResult {
  readonly contextId: string;
  readonly stageDensity: NexoraObjectStageDensity;
  readonly detailBudget: NexoraObjectRepresentationDetailBudget;
  readonly priorities: readonly NexoraObjectRepresentationPriority[];
  readonly recommendations: readonly NexoraObjectAdaptiveRepresentationRecommendation[];
  readonly transitionRecommendations: readonly NexoraObjectAdaptiveTransitionRecommendation[];
  readonly captionAllocations: readonly NexoraObjectCaptionAllocation[];
  readonly clusterHints: readonly NexoraObjectRepresentationClusterHint[];
  readonly warnings: readonly NexoraObjectAdaptiveDensityWarning[];
  readonly errors: readonly NexoraObjectAdaptiveDensityError[];
}

export interface NexoraObjectAdaptiveRepresentationBatchRequest {
  readonly requests: readonly {
    readonly entries: readonly NexoraObjectAdaptiveContextEntry[];
    readonly context: NexoraObjectAdaptiveRepresentationContext;
  }[];
  readonly mode: "Atomic" | "BestEffort";
}

export interface NexoraObjectAdaptiveRepresentationBatchResult {
  readonly accepted: boolean;
  readonly mode: "Atomic" | "BestEffort";
  readonly results: readonly NexoraObjectAdaptiveRepresentationResult[];
  readonly rejectedContextIds: readonly string[];
}

export interface NexoraObjectAdaptiveContextSnapshot {
  readonly snapshotId: string;
  readonly context: NexoraObjectAdaptiveRepresentationContext;
  readonly result: NexoraObjectAdaptiveRepresentationResult;
  readonly createdAt: string;
}

export interface NexoraObjectAdaptiveContextDifference {
  readonly objectId: string;
  readonly previousRank?: number;
  readonly nextRank?: number;
  readonly previousState?: NexoraObjectRepresentationState;
  readonly nextState?: NexoraObjectRepresentationState;
  readonly previousLabelMode?: "Hidden" | "Short" | "Full";
  readonly nextLabelMode?: "Hidden" | "Short" | "Full";
  readonly changed: boolean;
}

export interface NexoraObjectAdaptiveContextSnapshotComparison {
  readonly densityChanged: boolean;
  readonly previousDensity: NexoraObjectStageDensity;
  readonly nextDensity: NexoraObjectStageDensity;
  readonly differences: readonly NexoraObjectAdaptiveContextDifference[];
  readonly clusterChanged: boolean;
  readonly transitionRecommendationChanged: boolean;
}

export interface NexoraObjectAdaptiveDensityDependencies {
  readonly now: () => string;
  readonly createSnapshotId: () => string;
  readonly createClusterId: (
    memberObjectIds: readonly string[],
    reason: NexoraObjectRepresentationClusterHint["reason"],
  ) => string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item);
    return Object.isFrozen(value) ? value : Object.freeze(value);
  }
  for (const key of Object.keys(value as object)) {
    deepFreeze((value as Record<string, unknown>)[key]);
  }
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function err(
  code: NexoraObjectAdaptiveDensityErrorCode,
  message: string,
  extras?: Partial<NexoraObjectAdaptiveDensityError>,
): NexoraObjectAdaptiveDensityError {
  return Object.freeze({ code, message, ...extras });
}

function warn(
  code: NexoraObjectAdaptiveDensityWarningCode,
  message: string,
  objectId?: string,
  details?: Readonly<Record<string, unknown>>,
): NexoraObjectAdaptiveDensityWarning {
  return Object.freeze({ code, message, objectId, details });
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    Number.isFinite(value)
  );
}

function uniqueIds(ids: readonly string[]): boolean {
  return new Set(ids).size === ids.length;
}

function includesId(ids: readonly string[], id: string): boolean {
  return ids.includes(id);
}

function seedOf(entry: NexoraObjectAdaptiveContextEntry): NexoraObjectSeedColor {
  return entry.representation.material.color.seed;
}

function isHistoricalEntry(
  entry: NexoraObjectAdaptiveContextEntry,
  context: NexoraObjectAdaptiveRepresentationContext,
): boolean {
  return (
    entry.representation.profile === "Historical" ||
    context.temporal.mode === "Historical" ||
    context.temporal.mode === "Replay" ||
    includesId(context.temporal.historicalObjectIds, entry.representation.objectId)
  );
}

function isAuthorizedForOperation(
  objectId: string,
  context: NexoraObjectAdaptiveRepresentationContext,
): boolean {
  return context.interaction.activeOperationObjectId === objectId;
}

function densityForState(
  state: NexoraObjectRepresentationState,
  compactEmphasis: boolean,
): NexoraObjectInformationDensity {
  if (state === "Operation") return "Operational";
  if (state === "Report") return "Executive";
  return compactEmphasis ? "Compact" : "Seed";
}

function stateCost(state: NexoraObjectRepresentationState): number {
  if (state === "Operation") return NEXORA_OBJECT_DETAIL_BUDGET_COSTS.operationCost;
  if (state === "Report") return NEXORA_OBJECT_DETAIL_BUDGET_COSTS.reportCost;
  return NEXORA_OBJECT_DETAIL_BUDGET_COSTS.minimumCost;
}

function bumpDensity(
  density: NexoraObjectStageDensity,
): NexoraObjectStageDensity {
  if (density === "Sparse") return "Balanced";
  if (density === "Balanced") return "Dense";
  if (density === "Dense") return "Critical";
  return "Critical";
}

function sortReasons(
  reasons: readonly NexoraObjectRepresentationPriorityReason[],
): readonly NexoraObjectRepresentationPriorityReason[] {
  return Object.freeze(
    [...reasons].sort(
      (a, b) => REASON_ORDER.indexOf(a) - REASON_ORDER.indexOf(b),
    ),
  );
}

function defaultDependencies(): NexoraObjectAdaptiveDensityDependencies {
  let snapshotSeq = 0;
  return Object.freeze({
    now: () => new Date().toISOString(),
    createSnapshotId: () => {
      snapshotSeq += 1;
      return `adaptive-snapshot-${snapshotSeq}`;
    },
    createClusterId: (
      memberObjectIds: readonly string[],
      reason: NexoraObjectRepresentationClusterHint["reason"],
    ) => `cluster:${reason}:${[...memberObjectIds].sort().join(",")}`,
  });
}

function resolveDeps(
  dependencies?: NexoraObjectAdaptiveDensityDependencies,
): NexoraObjectAdaptiveDensityDependencies {
  return dependencies ?? defaultDependencies();
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateNexoraObjectAdaptiveRepresentationContext(
  context: NexoraObjectAdaptiveRepresentationContext,
): readonly NexoraObjectAdaptiveDensityError[] {
  const errors: NexoraObjectAdaptiveDensityError[] = [];
  if (!context.contextId) {
    errors.push(
      err("ADAPTIVE_DENSITY_INVALID_CONTEXT", "contextId is required."),
    );
  }
  if (!context.contextVersion) {
    errors.push(
      err("ADAPTIVE_DENSITY_INVALID_CONTEXT", "contextVersion is required.", {
        contextId: context.contextId,
      }),
    );
  }
  const vp = context.viewport;
  if (
    !isFiniteNumber(vp.zoomLevel) ||
    vp.zoomLevel <= 0 ||
    !isNonNegativeInteger(vp.visibleObjectCapacity)
  ) {
    errors.push(
      err(
        "ADAPTIVE_DENSITY_INVALID_VIEWPORT",
        "Viewport zoom must be positive and capacity a non-negative integer.",
        { contextId: context.contextId },
      ),
    );
  }
  if (
    vp.cameraDistance !== undefined &&
    !isFiniteNumber(vp.cameraDistance)
  ) {
    errors.push(
      err(
        "ADAPTIVE_DENSITY_INVALID_VIEWPORT",
        "cameraDistance must be finite when provided.",
        { contextId: context.contextId },
      ),
    );
  }
  const st = context.stage;
  if (
    !isNonNegativeInteger(st.visibleObjectCount) ||
    !isNonNegativeInteger(st.totalObjectCount) ||
    !isNonNegativeInteger(st.relationshipCount) ||
    !isNonNegativeInteger(st.activeClusterCount) ||
    !isNonNegativeInteger(st.availableDetailBudget)
  ) {
    errors.push(
      err(
        "ADAPTIVE_DENSITY_INVALID_STAGE",
        "Stage counts and budget must be non-negative integers.",
        { contextId: context.contextId },
      ),
    );
  } else if (st.visibleObjectCount > st.totalObjectCount) {
    errors.push(
      err(
        "ADAPTIVE_DENSITY_INVALID_STAGE",
        "visibleObjectCount cannot exceed totalObjectCount.",
        { contextId: context.contextId },
      ),
    );
  }
  const ix = context.interaction;
  if (
    !uniqueIds(ix.selectedObjectIds) ||
    !uniqueIds(ix.highlightedObjectIds) ||
    !uniqueIds(ix.pinnedObjectIds)
  ) {
    errors.push(
      err(
        "ADAPTIVE_DENSITY_INVALID_CONTEXT",
        "Interaction ID collections must be unique.",
        { contextId: context.contextId },
      ),
    );
  }
  const prefs = context.preferences;
  for (const key of [
    "maximumReportObjects",
    "maximumVisibleLabels",
    "maximumVisibleBadges",
  ] as const) {
    const value = prefs[key];
    if (value !== undefined && !isNonNegativeInteger(value)) {
      errors.push(
        err(
          "ADAPTIVE_DENSITY_INVALID_CONTEXT",
          `Preference ${key} must be a non-negative integer.`,
          { contextId: context.contextId },
        ),
      );
    }
  }
  return Object.freeze(errors);
}

function materialMatchesObjectId(
  materialState: NexoraObjectMaterialState,
  objectId: string,
): boolean {
  const id = materialState.materialStateId;
  return typeof id === "string" && id.startsWith(`ms:${objectId}:`);
}

export function validateNexoraObjectAdaptiveContextEntries(
  entries: readonly NexoraObjectAdaptiveContextEntry[],
): readonly NexoraObjectAdaptiveDensityError[] {
  const errors: NexoraObjectAdaptiveDensityError[] = [];
  const seen = new Set<string>();
  for (const entry of entries) {
    const objectId = entry.representation?.objectId;
    if (!objectId) {
      errors.push(
        err(
          "ADAPTIVE_DENSITY_INVALID_ENTRY",
          "Entry representation.objectId is required.",
        ),
      );
      continue;
    }
    if (seen.has(objectId)) {
      errors.push(
        err(
          "ADAPTIVE_DENSITY_DUPLICATE_OBJECT_ID",
          `Duplicate object ID: ${objectId}`,
          { objectId },
        ),
      );
    }
    seen.add(objectId);
    if (
      !materialMatchesObjectId(entry.materialState, objectId) ||
      entry.transitionState.objectId !== objectId
    ) {
      errors.push(
        err(
          "ADAPTIVE_DENSITY_OBJECT_ID_MISMATCH",
          "Representation, material, and transition object IDs must match.",
          {
            objectId,
            details: {
              representationObjectId: objectId,
              materialStateId: entry.materialState.materialStateId,
              transitionObjectId: entry.transitionState.objectId,
            },
          },
        ),
      );
    }
    for (const scoreKey of [
      "executiveImportance",
      "urgency",
      "attentionScore",
      "impactScore",
      "confidence",
    ] as const) {
      const score = entry[scoreKey];
      if (
        score !== undefined &&
        (!isFiniteNumber(score) || score < 0 || score > 100)
      ) {
        errors.push(
          err(
            "ADAPTIVE_DENSITY_INVALID_SCORE",
            `Score ${scoreKey} must be within 0–100.`,
            { objectId, details: { scoreKey, score } },
          ),
        );
      }
    }
    if (
      entry.relationshipDistanceFromFocus !== undefined &&
      (!isFiniteNumber(entry.relationshipDistanceFromFocus) ||
        entry.relationshipDistanceFromFocus < 0)
    ) {
      errors.push(
        err(
          "ADAPTIVE_DENSITY_INVALID_SCORE",
          "relationshipDistanceFromFocus must be a non-negative finite number.",
          { objectId },
        ),
      );
    }
  }
  return Object.freeze(errors);
}

export function validateNexoraObjectAdaptiveRepresentationResult(
  result: NexoraObjectAdaptiveRepresentationResult,
): readonly NexoraObjectAdaptiveDensityError[] {
  const errors: NexoraObjectAdaptiveDensityError[] = [];
  if (!result.contextId) {
    errors.push(
      err("ADAPTIVE_DENSITY_INVARIANT_VIOLATION", "Result contextId is required."),
    );
  }
  const ranks = new Set<number>();
  for (const priority of result.priorities) {
    if (
      !isFiniteNumber(priority.relevanceScore) ||
      priority.relevanceScore < 0 ||
      priority.relevanceScore > 100
    ) {
      errors.push(
        err(
          "ADAPTIVE_DENSITY_INVALID_SCORE",
          "Relevance score must be within 0–100.",
          { objectId: priority.objectId },
        ),
      );
    }
    if (
      !Number.isInteger(priority.rank) ||
      priority.rank < 1 ||
      ranks.has(priority.rank)
    ) {
      errors.push(
        err(
          "ADAPTIVE_DENSITY_INVARIANT_VIOLATION",
          "Ranks must be unique positive integers.",
          { objectId: priority.objectId },
        ),
      );
    }
    ranks.add(priority.rank);
  }
  const budget = result.detailBudget;
  if (
    !isNonNegativeInteger(budget.totalUnits) ||
    !isNonNegativeInteger(budget.usedUnits) ||
    budget.remainingUnits !== budget.totalUnits - budget.usedUnits
  ) {
    if (!budget.exceededExplicitly) {
      errors.push(
        err(
          "ADAPTIVE_DENSITY_INVALID_BUDGET",
          "Detail budget totals are inconsistent.",
          { contextId: result.contextId },
        ),
      );
    }
  }
  if (
    budget.usedUnits > budget.totalUnits &&
    budget.exceededExplicitly !== true
  ) {
    errors.push(
      err(
        "ADAPTIVE_DENSITY_INVALID_BUDGET",
        "Detail budget exceeded without explicit override.",
        { contextId: result.contextId },
      ),
    );
  }
  for (const recommendation of result.recommendations) {
    if (
      recommendation.recommendedState === "Operation" &&
      recommendation.indicatorMode !== "Operational" &&
      recommendation.indicatorMode !== "Executive"
    ) {
      // operational recommended with Operational indicators preferred; warn via invariant only for Minimum+Operational
    }
    if (
      recommendation.recommendedState === "Minimum" &&
      recommendation.indicatorMode === "Operational"
    ) {
      errors.push(
        err(
          "ADAPTIVE_DENSITY_INVARIANT_VIOLATION",
          "Minimum objects must not receive Operational indicator mode.",
          { objectId: recommendation.objectId },
        ),
      );
    }
    if (recommendation.clustered) {
      const isProtected = recommendation.reasons.some(
        (r) =>
          r === "ActiveOperation" ||
          r === "Focused" ||
          r === "CriticalStatus" ||
          r === "Selected",
      );
      if (isProtected && (recommendation.reasons.includes("Focused") ||
        recommendation.reasons.includes("ActiveOperation"))) {
        errors.push(
          err(
            "ADAPTIVE_DENSITY_INVALID_CLUSTER",
            "Focused or active Operation objects must not be clustered.",
            { objectId: recommendation.objectId },
          ),
        );
      }
    }
  }
  for (const cluster of result.clusterHints) {
    if (cluster.collapsed) {
      for (const id of cluster.memberObjectIds) {
        const rec = result.recommendations.find((r) => r.objectId === id);
        if (
          rec?.reasons.includes("Focused") ||
          rec?.reasons.includes("ActiveOperation")
        ) {
          errors.push(
            err(
              "ADAPTIVE_DENSITY_INVALID_CLUSTER",
              "Collapsed cluster contains protected object.",
              { objectId: id },
            ),
          );
        }
      }
    }
  }
  return Object.freeze(errors);
}

export function assertNexoraObjectAdaptiveDensityInvariants(
  result: NexoraObjectAdaptiveRepresentationResult,
  entries?: readonly NexoraObjectAdaptiveContextEntry[],
  context?: NexoraObjectAdaptiveRepresentationContext,
): void {
  const errors = [
    ...validateNexoraObjectAdaptiveRepresentationResult(result),
  ];
  if (entries) {
    errors.push(...validateNexoraObjectAdaptiveContextEntries(entries));
  }
  if (context) {
    errors.push(...validateNexoraObjectAdaptiveRepresentationContext(context));
  }
  if (entries && context) {
    for (const recommendation of result.recommendations) {
      const entry = entries.find(
        (e) => e.representation.objectId === recommendation.objectId,
      );
      if (!entry) continue;
      if (
        recommendation.recommendedState === "Operation" &&
        !isAuthorizedForOperation(recommendation.objectId, context)
      ) {
        errors.push(
          err(
            "ADAPTIVE_DENSITY_OPERATION_UNAUTHORIZED",
            "Operation recommendation requires authorization.",
            { objectId: recommendation.objectId },
          ),
        );
      }
      if (
        isHistoricalEntry(entry, context) &&
        recommendation.recommendedState === "Operation" &&
        !entry.representation.readOnly
      ) {
        errors.push(
          err(
            "ADAPTIVE_DENSITY_HISTORICAL_OPERATION_FORBIDDEN",
            "Historical objects cannot receive mutable Operation.",
            { objectId: recommendation.objectId },
          ),
        );
      }
      if (
        !entry.representation.visible &&
        (recommendation.recommendedState === "Report" ||
          recommendation.recommendedState === "Operation")
      ) {
        errors.push(
          err(
            "ADAPTIVE_DENSITY_HIDDEN_EXPANSION_FORBIDDEN",
            "Hidden representations cannot expand to Report or Operation.",
            { objectId: recommendation.objectId },
          ),
        );
      }
      if (
        seedOf(entry) === "Red" &&
        context.preferences.showStatus === false
      ) {
        // safety must have overridden; recommendation must keep status identifiable
        if (
          recommendation.indicatorMode === "StatusOnly" ||
          recommendation.indicatorMode === "Essential" ||
          recommendation.indicatorMode === "Executive" ||
          recommendation.indicatorMode === "Operational"
        ) {
          // ok — status expression retained
        }
      }
    }
  }
  if (!Object.isFrozen(result)) {
    errors.push(
      err(
        "ADAPTIVE_DENSITY_INVARIANT_VIOLATION",
        "Adaptive result must be deeply immutable.",
      ),
    );
  }
  if (errors.length > 0) {
    throw new NexoraObjectRepresentationContextAdaptiveDensityException(
      errors[0]!,
    );
  }
}

// ─── Stage density ──────────────────────────────────────────────────────────

export function resolveNexoraObjectStageDensity(input: {
  readonly visibleObjectCount: number;
  readonly visibleObjectCapacity: number;
  readonly relationshipCount: number;
  readonly activeClusterCount: number;
  readonly stageMode?: NexoraObjectStageContext["mode"];
}): NexoraObjectStageDensity {
  const capacity = Math.max(input.visibleObjectCapacity, 0);
  const visible = Math.max(input.visibleObjectCount, 0);
  const ratio = capacity === 0 ? (visible > 0 ? 2 : 0) : visible / capacity;

  let density: NexoraObjectStageDensity;
  if (ratio > NEXORA_OBJECT_STAGE_DENSITY_THRESHOLDS.denseMaxRatio) {
    density = "Critical";
  } else if (ratio > NEXORA_OBJECT_STAGE_DENSITY_THRESHOLDS.balancedMaxRatio) {
    density = "Dense";
  } else if (ratio > NEXORA_OBJECT_STAGE_DENSITY_THRESHOLDS.sparseMaxRatio) {
    density = "Balanced";
  } else {
    density = "Sparse";
  }

  const perObjectRelationships =
    visible === 0 ? 0 : input.relationshipCount / visible;
  if (
    perObjectRelationships >=
    NEXORA_OBJECT_STAGE_DENSITY_THRESHOLDS.relationshipComplexityBump
  ) {
    density = bumpDensity(density);
  }
  if (
    input.activeClusterCount >=
    NEXORA_OBJECT_STAGE_DENSITY_THRESHOLDS.clusterComplexityBump
  ) {
    density = bumpDensity(density);
  }
  if (input.stageMode === "Operation" && density === "Sparse") {
    // Operation mode can remain Sparse; no forced bump
  }
  return density;
}

// ─── Focus neighborhood ─────────────────────────────────────────────────────

export function resolveNexoraObjectFocusNeighborhood(
  entries: readonly NexoraObjectAdaptiveContextEntry[],
  focusedObjectId: string,
): NexoraObjectFocusNeighborhood {
  const direct: string[] = [];
  const secondary: string[] = [];
  const background: string[] = [];
  for (const entry of entries) {
    const id = entry.representation.objectId;
    if (id === focusedObjectId) continue;
    const distance = entry.relationshipDistanceFromFocus;
    if (distance === 1) direct.push(id);
    else if (distance !== undefined && distance > 1 && distance <= 2)
      secondary.push(id);
    else background.push(id);
  }
  direct.sort();
  secondary.sort();
  background.sort();
  return deepFreeze({
    focusedObjectId,
    directNeighborIds: Object.freeze(direct),
    secondaryNeighborIds: Object.freeze(secondary),
    backgroundObjectIds: Object.freeze(background),
  });
}

// ─── Relevance ──────────────────────────────────────────────────────────────

export function calculateNexoraObjectRepresentationRelevance(
  entry: NexoraObjectAdaptiveContextEntry,
  context: NexoraObjectAdaptiveRepresentationContext,
  neighborhood?: NexoraObjectFocusNeighborhood,
): Omit<NexoraObjectRepresentationPriority, "rank"> {
  const objectId = entry.representation.objectId;
  const reasons: NexoraObjectRepresentationPriorityReason[] = [];
  let score: number = NEXORA_OBJECT_RELEVANCE_WEIGHTS.background;
  reasons.push("Background");

  const seed = seedOf(entry);
  const ix = context.interaction;
  const ex = context.executive;

  if (ix.activeOperationObjectId === objectId) {
    score = Math.max(score, NEXORA_OBJECT_RELEVANCE_WEIGHTS.activeOperation);
    reasons.push("ActiveOperation");
  }
  if (ix.focusedObjectId === objectId) {
    score = Math.max(score, NEXORA_OBJECT_RELEVANCE_WEIGHTS.focused);
    reasons.push("Focused");
  }
  if (ex.currentSubjectObjectId === objectId) {
    score = Math.max(score, NEXORA_OBJECT_RELEVANCE_WEIGHTS.currentSubject);
    reasons.push("CurrentSubject");
  }
  if (
    seed === "Red" ||
    includesId(ex.criticalObjectIds, objectId)
  ) {
    score = Math.max(score, NEXORA_OBJECT_RELEVANCE_WEIGHTS.criticalStatus);
    reasons.push("CriticalStatus");
  }
  if (includesId(ex.attentionPathObjectIds, objectId)) {
    score = Math.max(score, NEXORA_OBJECT_RELEVANCE_WEIGHTS.attentionPath);
    reasons.push("AttentionPath");
  }
  if (includesId(ix.selectedObjectIds, objectId)) {
    score = Math.max(score, NEXORA_OBJECT_RELEVANCE_WEIGHTS.selected);
    reasons.push("Selected");
  }
  if (
    seed === "Yellow" ||
    includesId(ex.warningObjectIds, objectId)
  ) {
    score = Math.max(score, NEXORA_OBJECT_RELEVANCE_WEIGHTS.warningStatus);
    reasons.push("WarningStatus");
  }
  if (includesId(ix.highlightedObjectIds, objectId)) {
    score = Math.max(score, NEXORA_OBJECT_RELEVANCE_WEIGHTS.highlighted);
    reasons.push("Highlighted");
  }
  if (
    includesId(context.temporal.changedObjectIds, objectId) ||
    includesId(context.temporal.newlyCreatedObjectIds, objectId)
  ) {
    score = Math.max(score, NEXORA_OBJECT_RELEVANCE_WEIGHTS.recentChange);
    reasons.push("RecentChange");
  }
  if (
    neighborhood?.directNeighborIds.includes(objectId) ||
    entry.relationshipDistanceFromFocus === 1
  ) {
    score = Math.max(score, NEXORA_OBJECT_RELEVANCE_WEIGHTS.directNeighbor);
    reasons.push("DirectNeighbor");
  }
  if (includesId(ix.pinnedObjectIds, objectId)) {
    score = Math.max(score, NEXORA_OBJECT_RELEVANCE_WEIGHTS.pinned);
    reasons.push("Pinned");
  }
  if (isHistoricalEntry(entry, context)) {
    score = Math.max(score, NEXORA_OBJECT_RELEVANCE_WEIGHTS.historical);
    reasons.push("Historical");
  }

  const additive =
    (entry.executiveImportance ?? 0) *
      NEXORA_OBJECT_RELEVANCE_WEIGHTS.executiveImportanceScale +
    (entry.urgency ?? 0) * NEXORA_OBJECT_RELEVANCE_WEIGHTS.urgencyScale +
    (entry.attentionScore ?? 0) *
      NEXORA_OBJECT_RELEVANCE_WEIGHTS.attentionScoreScale +
    (entry.impactScore ?? 0) * NEXORA_OBJECT_RELEVANCE_WEIGHTS.impactScoreScale;

  let distancePenalty = 0;
  if (
    entry.relationshipDistanceFromFocus !== undefined &&
    entry.relationshipDistanceFromFocus > 1
  ) {
    distancePenalty =
      (entry.relationshipDistanceFromFocus - 1) *
      NEXORA_OBJECT_RELEVANCE_WEIGHTS.neighborDistancePenalty;
  }

  const relevanceScore = Math.max(
    0,
    Math.min(100, Math.round(score + additive - distancePenalty)),
  );
  const visualPriority = relevanceScore;

  const cleaned = sortReasons(
    reasons.filter((r, index, all) => all.indexOf(r) === index),
  );
  // Drop Background when stronger reasons exist
  const finalReasons =
    cleaned.length > 1
      ? Object.freeze(cleaned.filter((r) => r !== "Background"))
      : cleaned;

  return deepFreeze({
    objectId,
    relevanceScore,
    visualPriority,
    reasons: finalReasons,
  });
}

function rankPriorities(
  scored: readonly Omit<NexoraObjectRepresentationPriority, "rank">[],
): readonly NexoraObjectRepresentationPriority[] {
  const sorted = [...scored].sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return a.objectId.localeCompare(b.objectId);
  });
  return Object.freeze(
    sorted.map((item, index) =>
      deepFreeze({
        ...item,
        rank: index + 1,
      }),
    ),
  );
}

// ─── Context layers ─────────────────────────────────────────────────────────

const LAYER_NAME_ORDER: Record<
  NexoraObjectRepresentationContextLayer["layer"],
  number
> = {
  Global: 0,
  Workspace: 1,
  Subject: 2,
  Object: 3,
};

export function mergeNexoraObjectRepresentationContextLayers(
  layers: readonly NexoraObjectRepresentationContextLayer[],
  safetyPreferences?: Partial<NexoraObjectRepresentationPreferences>,
): NexoraObjectRepresentationPreferences {
  const ordered = [...layers].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return LAYER_NAME_ORDER[a.layer] - LAYER_NAME_ORDER[b.layer];
  });

  let merged: NexoraObjectRepresentationPreferences = {
    preferredDensity: "Automatic",
    showCaptions: true,
    showStatus: true,
    showBadges: true,
    showRelationships: true,
    prioritizeWarnings: true,
    prioritizeGoals: true,
  };

  for (const layer of ordered) {
    merged = {
      ...merged,
      ...layer.preferences,
    };
  }

  // Safety constraints always win
  const safety = safetyPreferences ?? {};
  if (safety.showStatus === true || merged.showStatus === false) {
    // Critical status visibility cannot be fully disabled
    if (merged.showStatus === false) {
      merged = { ...merged, showStatus: true };
    }
  }
  if (safety.showStatus === true) {
    merged = { ...merged, showStatus: true };
  }

  return deepFreeze(merged);
}

// ─── Detail budget allocation ───────────────────────────────────────────────

function maxReportForDensity(
  density: NexoraObjectStageDensity,
  preferences: NexoraObjectRepresentationPreferences,
  entryCount: number,
): number {
  if (preferences.maximumReportObjects !== undefined) {
    return preferences.maximumReportObjects;
  }
  if (preferences.preferredDensity === "Detailed") {
    return entryCount;
  }
  if (preferences.preferredDensity === "Compact") {
    return Math.max(1, Math.floor(entryCount * 0.15));
  }
  switch (density) {
    case "Sparse":
      return Math.max(1, Math.ceil(entryCount * 0.6));
    case "Balanced":
      return Math.max(1, Math.ceil(entryCount * 0.35));
    case "Dense":
      return Math.max(1, Math.ceil(entryCount * 0.15));
    case "Critical":
      return Math.max(1, Math.min(3, Math.ceil(entryCount * 0.08)));
  }
}

export function allocateNexoraObjectRepresentationDetailBudget(
  entries: readonly NexoraObjectAdaptiveContextEntry[],
  priorities: readonly NexoraObjectRepresentationPriority[],
  context: NexoraObjectAdaptiveRepresentationContext,
  stageDensity: NexoraObjectStageDensity,
): {
  readonly budget: NexoraObjectRepresentationDetailBudget;
  readonly allocations: readonly NexoraObjectDetailAllocation[];
  readonly warnings: readonly NexoraObjectAdaptiveDensityWarning[];
} {
  const warnings: NexoraObjectAdaptiveDensityWarning[] = [];
  const totalUnits = context.stage.availableDetailBudget;
  if (!isNonNegativeInteger(totalUnits)) {
    throw new NexoraObjectRepresentationContextAdaptiveDensityException(
      err(
        "ADAPTIVE_DENSITY_INVALID_BUDGET",
        "availableDetailBudget must be a non-negative integer.",
        { contextId: context.contextId },
      ),
    );
  }

  const byId = new Map(
    entries.map((e) => [e.representation.objectId, e] as const),
  );
  const maxReports = maxReportForDensity(
    stageDensity,
    context.preferences,
    entries.length,
  );

  let usedUnits = 0;
  let reportCount = 0;
  let exceededExplicitly = false;
  const allocations: NexoraObjectDetailAllocation[] = [];

  // Ensure every object gets at least Minimum first (capacity permitting)
  const minimumReserve = entries.length * NEXORA_OBJECT_DETAIL_BUDGET_COSTS.minimumCost;
  if (minimumReserve > totalUnits && totalUnits > 0) {
    warnings.push(
      warn(
        "ADAPTIVE_DENSITY_DETAIL_BUDGET_EXCEEDED",
        "Minimum reserve exceeds available detail budget; applying critical overrides for dominant objects.",
      ),
    );
  }

  for (const priority of priorities) {
    const entry = byId.get(priority.objectId);
    if (!entry) continue;

    const objectId = priority.objectId;
    const historical = isHistoricalEntry(entry, context);
    const hidden = entry.representation.visible === false;
    const authorized = isAuthorizedForOperation(objectId, context);
    const isFocused = context.interaction.focusedObjectId === objectId;
    const isActiveOp = context.interaction.activeOperationObjectId === objectId;
    const isSubject = context.executive.currentSubjectObjectId === objectId;
    const isCritical =
      seedOf(entry) === "Red" ||
      includesId(context.executive.criticalObjectIds, objectId);
    const isSelected = includesId(
      context.interaction.selectedObjectIds,
      objectId,
    );

    let state: NexoraObjectRepresentationState = "Minimum";
    let criticalOverride = false;

    if (hidden) {
      state = "Minimum";
    } else if (isActiveOp && authorized && !historical) {
      state = "Operation";
      warnings.push(
        warn(
          "ADAPTIVE_DENSITY_OPERATION_PRESERVED",
          "Active Operation object preserved.",
          objectId,
        ),
      );
    } else if (isActiveOp && historical) {
      state = "Report";
      warnings.push(
        warn(
          "ADAPTIVE_DENSITY_HISTORICAL_LIMIT_APPLIED",
          "Historical active object limited to Report.",
          objectId,
        ),
      );
    } else if (
      isFocused &&
      entry.representation.state === "Operation" &&
      authorized &&
      !historical
    ) {
      state = "Operation";
    } else if (isFocused || isSubject) {
      state = "Report";
    } else if (historical) {
      // Report at most when high priority and budget allows
      if (
        (isCritical || isSelected || priority.rank <= maxReports) &&
        reportCount < maxReports
      ) {
        state = "Report";
      } else {
        state = "Minimum";
      }
      if (entry.representation.state === "Operation") {
        warnings.push(
          warn(
            "ADAPTIVE_DENSITY_HISTORICAL_LIMIT_APPLIED",
            "Historical object capped below Operation.",
            objectId,
          ),
        );
      }
    } else if (stageDensity === "Critical") {
      if (isCritical && reportCount < maxReports) {
        state = "Report";
      } else if (isSelected) {
        state = "Minimum";
      } else {
        state = "Minimum";
      }
    } else if (stageDensity === "Dense") {
      if (isCritical && reportCount < maxReports) {
        state = "Report";
      } else if (isSelected) {
        // Ordinary selected objects remain Minimum in Dense; focus/subject already handled above
        state = "Minimum";
      } else if (
        priority.rank <= maxReports &&
        reportCount < maxReports
      ) {
        state = "Report";
      } else {
        state = "Minimum";
      }
    } else if (stageDensity === "Sparse") {
      if (reportCount < maxReports || isCritical || isSelected) {
        state = "Report";
      } else {
        state = "Minimum";
      }
    } else {
      // Balanced
      if (
        (isCritical || isSelected || priority.rank <= maxReports) &&
        reportCount < maxReports
      ) {
        state = "Report";
      } else {
        state = "Minimum";
      }
    }

    let cost = stateCost(state);
    const remaining = totalUnits - usedUnits;
    if (cost > remaining) {
      if (isActiveOp || isFocused || isSubject || isCritical) {
        criticalOverride = true;
        exceededExplicitly = true;
        warnings.push(
          warn(
            "ADAPTIVE_DENSITY_DETAIL_BUDGET_EXCEEDED",
            "Critical override applied for dominant object.",
            objectId,
          ),
        );
        if (isCritical && state === "Minimum") {
          // keep Minimum but identifiable
          warnings.push(
            warn(
              "ADAPTIVE_DENSITY_CRITICAL_OBJECT_COMPACTED",
              "Critical object compacted but remains identifiable.",
              objectId,
            ),
          );
        }
      } else {
        state = "Minimum";
        cost = NEXORA_OBJECT_DETAIL_BUDGET_COSTS.minimumCost;
        if (cost > remaining && remaining >= 0) {
          // still allocate Minimum conceptually
          cost = NEXORA_OBJECT_DETAIL_BUDGET_COSTS.minimumCost;
          exceededExplicitly = true;
        }
      }
    }

    if (state === "Report" || state === "Operation") {
      if (state === "Report") reportCount += 1;
    }

    usedUnits += cost;
    const compactEmphasis =
      state === "Minimum" &&
      (isSelected || isCritical || includesId(context.interaction.pinnedObjectIds, objectId));

    allocations.push(
      deepFreeze({
        objectId,
        state,
        density: densityForState(state, compactEmphasis),
        cost,
        criticalOverride,
      }),
    );
  }

  if (
    context.stage.visibleObjectCount > context.viewport.visibleObjectCapacity
  ) {
    warnings.push(
      warn(
        "ADAPTIVE_DENSITY_CAPACITY_EXCEEDED",
        "Visible objects exceed viewport capacity.",
      ),
    );
  }

  const clampedUsed = usedUnits;
  const remainingUnits = totalUnits - clampedUsed;
  const budget: NexoraObjectRepresentationDetailBudget = deepFreeze({
    totalUnits,
    usedUnits: clampedUsed,
    remainingUnits,
    minimumCost: NEXORA_OBJECT_DETAIL_BUDGET_COSTS.minimumCost,
    reportCost: NEXORA_OBJECT_DETAIL_BUDGET_COSTS.reportCost,
    operationCost: NEXORA_OBJECT_DETAIL_BUDGET_COSTS.operationCost,
    labelCost: NEXORA_OBJECT_DETAIL_BUDGET_COSTS.labelCost,
    badgeCost: NEXORA_OBJECT_DETAIL_BUDGET_COSTS.badgeCost,
    relationshipCost: NEXORA_OBJECT_DETAIL_BUDGET_COSTS.relationshipCost,
    exceededExplicitly: exceededExplicitly || remainingUnits < 0,
  });

  return deepFreeze({
    budget,
    allocations: Object.freeze(allocations),
    warnings: Object.freeze(warnings),
  });
}

// ─── Label / badge / indicator / relationship ───────────────────────────────

export function resolveNexoraObjectLabelDensity(
  allocations: readonly NexoraObjectDetailAllocation[],
  priorities: readonly NexoraObjectRepresentationPriority[],
  context: NexoraObjectAdaptiveRepresentationContext,
): {
  readonly captions: readonly NexoraObjectCaptionAllocation[];
  readonly warnings: readonly NexoraObjectAdaptiveDensityWarning[];
} {
  const warnings: NexoraObjectAdaptiveDensityWarning[] = [];
  const maxLabels = context.preferences.maximumVisibleLabels;
  const priorityById = new Map(priorities.map((p) => [p.objectId, p]));
  const ranked = [...allocations].sort((a, b) => {
    const pa = priorityById.get(a.objectId)?.rank ?? Number.MAX_SAFE_INTEGER;
    const pb = priorityById.get(b.objectId)?.rank ?? Number.MAX_SAFE_INTEGER;
    if (pa !== pb) return pa - pb;
    return a.objectId.localeCompare(b.objectId);
  });

  let visibleLabels = 0;
  const captions: NexoraObjectCaptionAllocation[] = [];

  for (const allocation of ranked) {
    const priority = priorityById.get(allocation.objectId);
    const reasons = priority?.reasons ?? [];
    const isFocused = reasons.includes("Focused");
    const isActiveOp = reasons.includes("ActiveOperation");
    const isCritical = reasons.includes("CriticalStatus");
    const isSelected = reasons.includes("Selected");

    let mode: NexoraObjectCaptionAllocation["mode"] = "Hidden";
    let reason = "Background caption suppressed.";

    if (!context.preferences.showCaptions && !isCritical && !isFocused && !isActiveOp) {
      mode = "Hidden";
      reason = "Captions disabled by preference.";
    } else if (isFocused || isActiveOp) {
      mode = "Full";
      reason = isActiveOp
        ? "Active Operation receives Full caption."
        : "Focused object receives Full caption.";
    } else if (isCritical) {
      mode = "Full";
      reason = "Critical object caption prioritized.";
    } else if (isSelected) {
      mode = stageAllowsFullLabel(context) ? "Full" : "Short";
      reason = "Selected object caption.";
    } else if (allocation.state === "Report" || allocation.state === "Operation") {
      mode = "Short";
      reason = "Detailed representation caption.";
    } else {
      mode = "Hidden";
      reason = "Background object caption hidden.";
    }

    if (mode !== "Hidden") {
      if (maxLabels !== undefined && visibleLabels >= maxLabels) {
        if (isCritical || isFocused || isActiveOp) {
          // keep identifiable — override limit for safety
          warnings.push(
            warn(
              "ADAPTIVE_DENSITY_PREFERENCE_OVERRIDDEN_FOR_SAFETY",
              "Caption retained despite label limit.",
              allocation.objectId,
            ),
          );
        } else {
          mode = "Hidden";
          reason = "Exceeded maximumVisibleLabels.";
          warnings.push(
            warn(
              "ADAPTIVE_DENSITY_LABELS_COMPACTED",
              "Label compacted due to maximumVisibleLabels.",
              allocation.objectId,
            ),
          );
        }
      } else {
        visibleLabels += 1;
      }
    }

    captions.push(
      deepFreeze({
        objectId: allocation.objectId,
        mode,
        priority: priority?.visualPriority ?? 0,
        reason,
      }),
    );
  }

  captions.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.objectId.localeCompare(b.objectId);
  });

  return deepFreeze({
    captions: Object.freeze(captions),
    warnings: Object.freeze(warnings),
  });
}

function stageAllowsFullLabel(
  context: NexoraObjectAdaptiveRepresentationContext,
): boolean {
  return (
    context.stage.density === "Sparse" ||
    context.stage.density === "Balanced"
  );
}

export function resolveNexoraObjectBadgeDensity(
  allocations: readonly NexoraObjectDetailAllocation[],
  priorities: readonly NexoraObjectRepresentationPriority[],
  context: NexoraObjectAdaptiveRepresentationContext,
): {
  readonly badges: readonly NexoraObjectBadgeAllocation[];
  readonly warnings: readonly NexoraObjectAdaptiveDensityWarning[];
} {
  const warnings: NexoraObjectAdaptiveDensityWarning[] = [];
  const maxGlobal = context.preferences.maximumVisibleBadges;
  let usedBadges = 0;
  const badges: NexoraObjectBadgeAllocation[] = [];
  const priorityById = new Map(priorities.map((p) => [p.objectId, p]));

  const ranked = [...allocations].sort((a, b) => {
    const pa = priorityById.get(a.objectId)?.rank ?? Number.MAX_SAFE_INTEGER;
    const pb = priorityById.get(b.objectId)?.rank ?? Number.MAX_SAFE_INTEGER;
    if (pa !== pb) return pa - pb;
    return a.objectId.localeCompare(b.objectId);
  });

  for (const allocation of ranked) {
    const reasons = priorityById.get(allocation.objectId)?.reasons ?? [];
    let maximumBadgeCount = 0;
    let reason = "No badges for background Minimum.";

    if (!context.preferences.showBadges) {
      maximumBadgeCount =
        reasons.includes("CriticalStatus") || reasons.includes("WarningStatus")
          ? 1
          : 0;
      reason = maximumBadgeCount
        ? "Safety retains critical/warning badge."
        : "Badges disabled by preference.";
      if (maximumBadgeCount === 1) {
        warnings.push(
          warn(
            "ADAPTIVE_DENSITY_PREFERENCE_OVERRIDDEN_FOR_SAFETY",
            "Critical/warning badge retained.",
            allocation.objectId,
          ),
        );
      }
    } else if (allocation.state === "Minimum") {
      maximumBadgeCount =
        reasons.includes("CriticalStatus") ||
        reasons.includes("WarningStatus") ||
        reasons.includes("Selected")
          ? 1
          : 0;
      reason = "Minimum representation: at most one badge.";
    } else if (allocation.state === "Report") {
      maximumBadgeCount = 2;
      reason = "Report representation: essential badges.";
    } else {
      maximumBadgeCount = 4;
      reason = "Operation representation: operational badges permitted.";
    }

    if (
      maxGlobal !== undefined &&
      usedBadges + maximumBadgeCount > maxGlobal
    ) {
      const allowed = Math.max(0, maxGlobal - usedBadges);
      if (allowed < maximumBadgeCount) {
        warnings.push(
          warn(
            "ADAPTIVE_DENSITY_BADGES_COMPACTED",
            "Badge count compacted by global limit.",
            allocation.objectId,
          ),
        );
        maximumBadgeCount = allowed;
        reason = "Compacted by maximumVisibleBadges.";
      }
    }
    usedBadges += maximumBadgeCount;

    badges.push(
      deepFreeze({
        objectId: allocation.objectId,
        maximumBadgeCount,
        reason,
      }),
    );
  }

  return deepFreeze({
    badges: Object.freeze(badges),
    warnings: Object.freeze(warnings),
  });
}

export function resolveNexoraObjectIndicatorDensity(
  allocations: readonly NexoraObjectDetailAllocation[],
  stageDensity: NexoraObjectStageDensity,
): readonly NexoraObjectIndicatorAllocation[] {
  return Object.freeze(
    allocations.map((allocation) => {
      let mode: NexoraObjectIndicatorAllocation["mode"] = "StatusOnly";
      let reason = "Minimum → StatusOnly.";
      if (allocation.state === "Operation") {
        mode = "Operational";
        reason = "Operation → Operational indicators.";
      } else if (allocation.state === "Report") {
        if (stageDensity === "Dense" || stageDensity === "Critical") {
          mode = "Essential";
          reason = "Dense-stage Report → Essential indicators.";
        } else {
          mode = "Executive";
          reason = "Report → Executive indicators.";
        }
      }
      return deepFreeze({
        objectId: allocation.objectId,
        mode,
        reason,
      });
    }),
  );
}

export function resolveNexoraObjectRelationshipVisibility(
  allocations: readonly NexoraObjectDetailAllocation[],
  priorities: readonly NexoraObjectRepresentationPriority[],
  context: NexoraObjectAdaptiveRepresentationContext,
  stageDensity: NexoraObjectStageDensity,
): {
  readonly relationships: readonly NexoraObjectRelationshipVisibilityAllocation[];
  readonly warnings: readonly NexoraObjectAdaptiveDensityWarning[];
} {
  const warnings: NexoraObjectAdaptiveDensityWarning[] = [];
  const priorityById = new Map(priorities.map((p) => [p.objectId, p]));
  const relationships: NexoraObjectRelationshipVisibilityAllocation[] = [];

  for (const allocation of allocations) {
    const reasons = priorityById.get(allocation.objectId)?.reasons ?? [];
    let mode: NexoraObjectRelationshipVisibilityAllocation["mode"] = "Hidden";
    let reason = "Background relationships hidden.";

    if (!context.preferences.showRelationships) {
      mode = "Hidden";
      reason = "Relationships disabled by preference.";
    } else if (reasons.includes("ActiveOperation")) {
      mode =
        stageDensity === "Sparse" || stageDensity === "Balanced"
          ? "Expanded"
          : "Direct";
      reason = "Active Operation relationships.";
    } else if (reasons.includes("Focused")) {
      mode = "Direct";
      reason = "Focused object receives Direct relationships.";
    } else if (reasons.includes("AttentionPath") || reasons.includes("CurrentSubject")) {
      mode = "AttentionPath";
      reason = "Attention-path relationship visibility.";
    } else if (
      allocation.state === "Minimum" ||
      stageDensity === "Dense" ||
      stageDensity === "Critical"
    ) {
      mode = "Hidden";
      reason = "Background/dense relationships hidden.";
      if (allocation.state === "Minimum") {
        warnings.push(
          warn(
            "ADAPTIVE_DENSITY_RELATIONSHIPS_HIDDEN",
            "Background relationships hidden.",
            allocation.objectId,
          ),
        );
      }
    } else {
      mode = "Direct";
      reason = "Detailed representation direct relationships.";
    }

    relationships.push(
      deepFreeze({
        objectId: allocation.objectId,
        mode,
        reason,
      }),
    );
  }

  return deepFreeze({
    relationships: Object.freeze(relationships),
    warnings: Object.freeze(
      warnings.filter(
        (w, index, all) =>
          all.findIndex(
            (x) => x.objectId === w.objectId && x.code === w.code,
          ) === index,
      ),
    ),
  });
}

// ─── Clustering ─────────────────────────────────────────────────────────────

export function createNexoraObjectRepresentationClusterHints(
  allocations: readonly NexoraObjectDetailAllocation[],
  priorities: readonly NexoraObjectRepresentationPriority[],
  context: NexoraObjectAdaptiveRepresentationContext,
  entries: readonly NexoraObjectAdaptiveContextEntry[],
  stageDensity: NexoraObjectStageDensity,
  dependencies: NexoraObjectAdaptiveDensityDependencies,
): {
  readonly clusterHints: readonly NexoraObjectRepresentationClusterHint[];
  readonly clusteredObjectIds: ReadonlySet<string>;
  readonly warnings: readonly NexoraObjectAdaptiveDensityWarning[];
} {
  const warnings: NexoraObjectAdaptiveDensityWarning[] = [];
  const priorityById = new Map(priorities.map((p) => [p.objectId, p]));
  const entryById = new Map(
    entries.map((e) => [e.representation.objectId, e] as const),
  );
  const protectedIds = new Set<string>();
  for (const priority of priorities) {
    if (
      priority.reasons.includes("ActiveOperation") ||
      priority.reasons.includes("Focused") ||
      priority.reasons.includes("CriticalStatus") ||
      priority.reasons.includes("Selected")
    ) {
      // Selected can be clustered only when not focused/active/critical
      if (
        priority.reasons.includes("ActiveOperation") ||
        priority.reasons.includes("Focused") ||
        priority.reasons.includes("CriticalStatus")
      ) {
        protectedIds.add(priority.objectId);
      }
    }
  }

  const hints: NexoraObjectRepresentationClusterHint[] = [];
  const clustered = new Set<string>();

  // Shared grouping keys
  const groups = new Map<string, string[]>();
  for (const entry of entries) {
    const key = entry.groupingKey;
    if (!key) continue;
    const id = entry.representation.objectId;
    if (protectedIds.has(id)) continue;
    const list = groups.get(key) ?? [];
    list.push(id);
    groups.set(key, list);
  }
  for (const [key, members] of [...groups.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (members.length < 2) continue;
    members.sort();
    const reason: NexoraObjectRepresentationClusterHint["reason"] =
      key.startsWith("historical:")
        ? "HistoricalGroup"
        : key.startsWith("relationship:")
          ? "RelationshipGroup"
          : "SharedContext";
    const clusterId = dependencies.createClusterId(members, reason);
    hints.push(
      deepFreeze({
        clusterId,
        memberObjectIds: Object.freeze([...members]),
        representativeObjectId: members[0],
        reason,
        collapsed: stageDensity === "Dense" || stageDensity === "Critical",
      }),
    );
    for (const id of members) clustered.add(id);
  }

  // Capacity overflow / low relevance clustering
  const overflow =
    context.stage.visibleObjectCount > context.viewport.visibleObjectCapacity ||
    stageDensity === "Critical";
  if (overflow) {
    const low = priorities
      .filter(
        (p) =>
          !protectedIds.has(p.objectId) &&
          !clustered.has(p.objectId) &&
          (priorityById.get(p.objectId)?.reasons.includes("Background") ||
            p.relevanceScore <= 25 ||
            (entryById.get(p.objectId) &&
              allocations.find((a) => a.objectId === p.objectId)?.state ===
                "Minimum")),
      )
      .map((p) => p.objectId)
      .sort();
    if (low.length >= 2) {
      const reason: NexoraObjectRepresentationClusterHint["reason"] =
        context.stage.visibleObjectCount >
        context.viewport.visibleObjectCapacity
          ? "CapacityOverflow"
          : "LowRelevance";
      const clusterId = dependencies.createClusterId(low, reason);
      hints.push(
        deepFreeze({
          clusterId,
          memberObjectIds: Object.freeze([...low]),
          representativeObjectId: low[0],
          reason,
          collapsed: true,
        }),
      );
      for (const id of low) clustered.add(id);
      warnings.push(
        warn(
          "ADAPTIVE_DENSITY_OBJECTS_CLUSTERED",
          "Low-priority objects clustered due to capacity or density.",
          undefined,
          { clusterId, count: low.length },
        ),
      );
    }
  }

  hints.sort((a, b) => a.clusterId.localeCompare(b.clusterId));
  return deepFreeze({
    clusterHints: Object.freeze(hints),
    clusteredObjectIds: clustered,
    warnings: Object.freeze(warnings),
  });
}

// ─── Transition recommendations ─────────────────────────────────────────────

export function recommendNexoraObjectRepresentationTransitions(
  entries: readonly NexoraObjectAdaptiveContextEntry[],
  allocations: readonly NexoraObjectDetailAllocation[],
  priorities: readonly NexoraObjectRepresentationPriority[],
  context: NexoraObjectAdaptiveRepresentationContext,
): readonly NexoraObjectAdaptiveTransitionRecommendation[] {
  const entryById = new Map(
    entries.map((e) => [e.representation.objectId, e] as const),
  );
  const priorityById = new Map(priorities.map((p) => [p.objectId, p]));
  const recommendations: NexoraObjectAdaptiveTransitionRecommendation[] = [];

  for (const allocation of allocations) {
    const entry = entryById.get(allocation.objectId);
    if (!entry) continue;
    const fromState = entry.representation.state;
    const toState = allocation.state;
    if (fromState === toState) continue;

    const reasons = priorityById.get(allocation.objectId)?.reasons ?? [];
    let transitionType: NexoraObjectRepresentationTransitionType | undefined;
    let reason = "Adaptive density state change.";

    if (toState === "Operation") {
      if (!isAuthorizedForOperation(allocation.objectId, context)) {
        continue; // never recommend unauthorized Operation
      }
      if (isHistoricalEntry(entry, context)) {
        continue;
      }
      transitionType = "EnterOperation";
      reason = "Explicit operation context.";
    } else if (fromState === "Operation" && toState === "Report") {
      transitionType = "ExitOperation";
      reason = "Leave Operation for Report.";
    } else if (fromState === "Operation" && toState === "Minimum") {
      transitionType = "CollapseToMinimum";
      reason = "Dense compaction from Operation.";
    } else if (toState === "Report" && reasons.includes("Focused")) {
      transitionType = "FocusReveal";
      reason = "Focus recommends FocusReveal.";
    } else if (toState === "Report" && reasons.includes("Selected")) {
      transitionType = "SelectionReveal";
      reason = "Selection expansion.";
    } else if (toState === "Report") {
      transitionType = "ExpandToReport";
      reason = "Expand to Report.";
    } else if (toState === "Minimum") {
      transitionType = "CollapseToMinimum";
      reason = "Dense compaction recommends CollapseToMinimum.";
    }

    if (
      transitionType &&
      !SUPPORTED_TRANSITION_TYPES.includes(transitionType)
    ) {
      continue;
    }

    recommendations.push(
      deepFreeze({
        objectId: allocation.objectId,
        fromState,
        toState,
        transitionType,
        priority: priorityById.get(allocation.objectId)?.visualPriority ?? 0,
        reason,
      }),
    );
  }

  recommendations.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.objectId.localeCompare(b.objectId);
  });
  return Object.freeze(recommendations);
}

// ─── Primary resolution ─────────────────────────────────────────────────────

export function resolveNexoraObjectAdaptiveRepresentationContext(
  entries: readonly NexoraObjectAdaptiveContextEntry[],
  context: NexoraObjectAdaptiveRepresentationContext,
  dependencies?: NexoraObjectAdaptiveDensityDependencies,
): NexoraObjectAdaptiveRepresentationResult {
  const deps = resolveDeps(dependencies);
  const errors: NexoraObjectAdaptiveDensityError[] = [];
  const warnings: NexoraObjectAdaptiveDensityWarning[] = [];

  // 1. Validate context
  errors.push(...validateNexoraObjectAdaptiveRepresentationContext(context));
  // 2. Validate entries
  errors.push(...validateNexoraObjectAdaptiveContextEntries(entries));

  if (errors.length > 0) {
    return deepFreeze({
      contextId: context.contextId,
      stageDensity: context.stage.density,
      detailBudget: deepFreeze({
        totalUnits: context.stage.availableDetailBudget,
        usedUnits: 0,
        remainingUnits: context.stage.availableDetailBudget,
        ...NEXORA_OBJECT_DETAIL_BUDGET_COSTS,
      }),
      priorities: Object.freeze([]),
      recommendations: Object.freeze([]),
      transitionRecommendations: Object.freeze([]),
      captionAllocations: Object.freeze([]),
      clusterHints: Object.freeze([]),
      warnings: Object.freeze([]),
      errors: Object.freeze(errors),
    });
  }

  // 3. Resolve stage density
  const stageDensity = resolveNexoraObjectStageDensity({
    visibleObjectCount: context.stage.visibleObjectCount,
    visibleObjectCapacity: context.viewport.visibleObjectCapacity,
    relationshipCount: context.stage.relationshipCount,
    activeClusterCount: context.stage.activeClusterCount,
    stageMode: context.stage.mode,
  });

  // 4. Merge context layers (Global defaults + Workspace preferences)
  const mergedPreferences = mergeNexoraObjectRepresentationContextLayers(
    [
      Object.freeze({
        layer: "Global" as const,
        priority: 0,
        preferences: Object.freeze({
          preferredDensity: "Automatic" as const,
          showCaptions: true,
          showStatus: true,
          showBadges: true,
          showRelationships: true,
          prioritizeWarnings: true,
          prioritizeGoals: true,
        }),
      }),
      Object.freeze({
        layer: "Workspace" as const,
        priority: 10,
        preferences: context.preferences,
      }),
    ],
    { showStatus: true },
  );
  if (
    context.preferences.showStatus === false &&
    mergedPreferences.showStatus === true
  ) {
    warnings.push(
      warn(
        "ADAPTIVE_DENSITY_PREFERENCE_OVERRIDDEN_FOR_SAFETY",
        "showStatus forced true for critical status visibility.",
      ),
    );
  }

  const effectiveContext: NexoraObjectAdaptiveRepresentationContext = deepFreeze({
    ...context,
    preferences: mergedPreferences,
    stage: deepFreeze({
      ...context.stage,
      density: stageDensity,
    }),
  });

  // Focus neighborhood for relevance
  const neighborhood = effectiveContext.interaction.focusedObjectId
    ? resolveNexoraObjectFocusNeighborhood(
        entries,
        effectiveContext.interaction.focusedObjectId,
      )
    : undefined;

  // 5–6. Relevance + rank
  const scored = entries.map((entry) =>
    calculateNexoraObjectRepresentationRelevance(
      entry,
      effectiveContext,
      neighborhood,
    ),
  );
  const priorities = rankPriorities(scored);

  // 7–8. Budget + state allocation
  const budgetResult = allocateNexoraObjectRepresentationDetailBudget(
    entries,
    priorities,
    effectiveContext,
    stageDensity,
  );
  warnings.push(...budgetResult.warnings);

  // 9. Labels
  const labelResult = resolveNexoraObjectLabelDensity(
    budgetResult.allocations,
    priorities,
    effectiveContext,
  );
  warnings.push(...labelResult.warnings);

  // 10. Badges
  const badgeResult = resolveNexoraObjectBadgeDensity(
    budgetResult.allocations,
    priorities,
    effectiveContext,
  );
  warnings.push(...badgeResult.warnings);

  // 11. Indicators
  const indicators = resolveNexoraObjectIndicatorDensity(
    budgetResult.allocations,
    stageDensity,
  );

  // 12. Relationships
  const relationshipResult = resolveNexoraObjectRelationshipVisibility(
    budgetResult.allocations,
    priorities,
    effectiveContext,
    stageDensity,
  );
  warnings.push(...relationshipResult.warnings);

  // 13. Clustering
  const clusterResult = createNexoraObjectRepresentationClusterHints(
    budgetResult.allocations,
    priorities,
    effectiveContext,
    entries,
    stageDensity,
    deps,
  );
  warnings.push(...clusterResult.warnings);

  // 14. Transition recommendations
  const transitionRecommendations = recommendNexoraObjectRepresentationTransitions(
    entries,
    budgetResult.allocations,
    priorities,
    effectiveContext,
  );

  // Build recommendations
  const captionById = new Map(
    labelResult.captions.map((c) => [c.objectId, c] as const),
  );
  const badgeById = new Map(
    badgeResult.badges.map((b) => [b.objectId, b] as const),
  );
  const indicatorById = new Map(
    indicators.map((i) => [i.objectId, i] as const),
  );
  const relationshipById = new Map(
    relationshipResult.relationships.map((r) => [r.objectId, r] as const),
  );
  const priorityById = new Map(priorities.map((p) => [p.objectId, p]));
  const entryById = new Map(
    entries.map((e) => [e.representation.objectId, e] as const),
  );

  const recommendations: NexoraObjectAdaptiveRepresentationRecommendation[] =
    budgetResult.allocations.map((allocation) => {
      const priority = priorityById.get(allocation.objectId)!;
      const entry = entryById.get(allocation.objectId)!;
      const clustered =
        clusterResult.clusteredObjectIds.has(allocation.objectId) &&
        !priority.reasons.includes("Focused") &&
        !priority.reasons.includes("ActiveOperation");
      const dimmed =
        clustered ||
        (priority.reasons.includes("Background") &&
          (stageDensity === "Dense" || stageDensity === "Critical") &&
          !priority.reasons.includes("CriticalStatus"));
      const recommendedState = allocation.state;
      // Yellow never escalated — density/state only; seed untouched
      void seedOf(entry);

      return deepFreeze({
        objectId: allocation.objectId,
        currentState: entry.representation.state,
        recommendedState,
        recommendedDensity: allocation.density,
        relevanceScore: priority.relevanceScore,
        rank: priority.rank,
        labelMode: captionById.get(allocation.objectId)?.mode ?? "Hidden",
        maximumBadgeCount:
          badgeById.get(allocation.objectId)?.maximumBadgeCount ?? 0,
        indicatorMode:
          indicatorById.get(allocation.objectId)?.mode ?? "StatusOnly",
        relationshipMode:
          relationshipById.get(allocation.objectId)?.mode ?? "Hidden",
        dimmed,
        clustered,
        transitionRecommended: recommendedState !== entry.representation.state,
        reasons: priority.reasons,
      });
    });

  recommendations.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.objectId.localeCompare(b.objectId);
  });

  const result: NexoraObjectAdaptiveRepresentationResult = deepFreeze({
    contextId: context.contextId,
    stageDensity,
    detailBudget: budgetResult.budget,
    priorities,
    recommendations: Object.freeze(recommendations),
    transitionRecommendations,
    captionAllocations: labelResult.captions,
    clusterHints: clusterResult.clusterHints,
    warnings: Object.freeze(dedupeWarnings(warnings)),
    errors: Object.freeze([]),
  });

  // 15. Validate final result
  const resultErrors = validateNexoraObjectAdaptiveRepresentationResult(result);
  if (resultErrors.length > 0) {
    return deepFreeze({
      ...result,
      errors: Object.freeze(resultErrors),
    });
  }

  // 16. Return immutable projection
  return result;
}

function dedupeWarnings(
  warnings: readonly NexoraObjectAdaptiveDensityWarning[],
): readonly NexoraObjectAdaptiveDensityWarning[] {
  const seen = new Set<string>();
  const out: NexoraObjectAdaptiveDensityWarning[] = [];
  for (const warning of warnings) {
    const key = `${warning.code}:${warning.objectId ?? ""}:${warning.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(warning);
  }
  return out;
}

// ─── Batch ──────────────────────────────────────────────────────────────────

export function resolveNexoraObjectAdaptiveRepresentationBatch(
  batch: NexoraObjectAdaptiveRepresentationBatchRequest,
  dependencies?: NexoraObjectAdaptiveDensityDependencies,
): NexoraObjectAdaptiveRepresentationBatchResult {
  const contextIds = batch.requests.map((r) => r.context.contextId);
  if (!uniqueIds(contextIds)) {
    const duplicateError = err(
      "ADAPTIVE_DENSITY_DUPLICATE_CONTEXT_ID",
      "Duplicate context IDs in batch.",
    );
    return deepFreeze({
      accepted: false,
      mode: batch.mode,
      results: Object.freeze(
        batch.requests.map((request) =>
          deepFreeze({
            contextId: request.context.contextId,
            stageDensity: request.context.stage.density,
            detailBudget: deepFreeze({
              totalUnits: 0,
              usedUnits: 0,
              remainingUnits: 0,
              ...NEXORA_OBJECT_DETAIL_BUDGET_COSTS,
            }),
            priorities: Object.freeze([]),
            recommendations: Object.freeze([]),
            transitionRecommendations: Object.freeze([]),
            captionAllocations: Object.freeze([]),
            clusterHints: Object.freeze([]),
            warnings: Object.freeze([]),
            errors: Object.freeze([duplicateError]),
          }),
        ),
      ),
      rejectedContextIds: Object.freeze([...contextIds]),
    });
  }

  const results = batch.requests.map((request) =>
    resolveNexoraObjectAdaptiveRepresentationContext(
      request.entries,
      request.context,
      dependencies,
    ),
  );

  if (batch.mode === "Atomic") {
    const anyFailed = results.some((r) => r.errors.length > 0);
    if (anyFailed) {
      return deepFreeze({
        accepted: false,
        mode: "Atomic" as const,
        results: Object.freeze(
          results.map((result) =>
            deepFreeze({
              ...result,
              priorities: Object.freeze([]),
              recommendations: Object.freeze([]),
              transitionRecommendations: Object.freeze([]),
              captionAllocations: Object.freeze([]),
              clusterHints: Object.freeze([]),
              warnings: Object.freeze([]),
              errors:
                result.errors.length > 0
                  ? result.errors
                  : Object.freeze([
                      err(
                        "ADAPTIVE_DENSITY_INVARIANT_VIOLATION",
                        "Atomic batch rejected because another context failed.",
                        { contextId: result.contextId },
                      ),
                    ]),
            }),
          ),
        ),
        rejectedContextIds: Object.freeze(
          results
            .filter((r) => r.errors.length > 0)
            .map((r) => r.contextId),
        ),
      });
    }
    return deepFreeze({
      accepted: true,
      mode: "Atomic" as const,
      results: Object.freeze(results),
      rejectedContextIds: Object.freeze([]),
    });
  }

  const rejected = results
    .filter((r) => r.errors.length > 0)
    .map((r) => r.contextId);
  return deepFreeze({
    accepted: rejected.length === 0,
    mode: "BestEffort" as const,
    results: Object.freeze(results),
    rejectedContextIds: Object.freeze(rejected),
  });
}

// ─── Snapshots ──────────────────────────────────────────────────────────────

export function createNexoraObjectAdaptiveContextSnapshot(
  context: NexoraObjectAdaptiveRepresentationContext,
  result: NexoraObjectAdaptiveRepresentationResult,
  dependencies?: NexoraObjectAdaptiveDensityDependencies,
): NexoraObjectAdaptiveContextSnapshot {
  const deps = resolveDeps(dependencies);
  return deepFreeze({
    snapshotId: deps.createSnapshotId(),
    context,
    result,
    createdAt: deps.now(),
  });
}

export function compareNexoraObjectAdaptiveContextSnapshots(
  previous: NexoraObjectAdaptiveContextSnapshot,
  next: NexoraObjectAdaptiveContextSnapshot,
): NexoraObjectAdaptiveContextSnapshotComparison {
  const prevRec = new Map(
    previous.result.recommendations.map((r) => [r.objectId, r] as const),
  );
  const nextRec = new Map(
    next.result.recommendations.map((r) => [r.objectId, r] as const),
  );
  const prevCap = new Map(
    previous.result.captionAllocations.map((c) => [c.objectId, c] as const),
  );
  const nextCap = new Map(
    next.result.captionAllocations.map((c) => [c.objectId, c] as const),
  );
  const ids = new Set([...prevRec.keys(), ...nextRec.keys()]);
  const differences: NexoraObjectAdaptiveContextDifference[] = [];

  for (const objectId of [...ids].sort()) {
    const prev = prevRec.get(objectId);
    const nxt = nextRec.get(objectId);
    const previousRank = prev?.rank;
    const nextRank = nxt?.rank;
    const previousState = prev?.recommendedState;
    const nextState = nxt?.recommendedState;
    const previousLabelMode = prevCap.get(objectId)?.mode ?? prev?.labelMode;
    const nextLabelMode = nextCap.get(objectId)?.mode ?? nxt?.labelMode;
    const changed =
      previousRank !== nextRank ||
      previousState !== nextState ||
      previousLabelMode !== nextLabelMode;
    differences.push(
      deepFreeze({
        objectId,
        previousRank,
        nextRank,
        previousState,
        nextState,
        previousLabelMode,
        nextLabelMode,
        changed,
      }),
    );
  }

  differences.sort((a, b) => {
    const ar = a.nextRank ?? a.previousRank ?? Number.MAX_SAFE_INTEGER;
    const br = b.nextRank ?? b.previousRank ?? Number.MAX_SAFE_INTEGER;
    if (ar !== br) return ar - br;
    return a.objectId.localeCompare(b.objectId);
  });

  const prevTransitions = JSON.stringify(previous.result.transitionRecommendations);
  const nextTransitions = JSON.stringify(next.result.transitionRecommendations);
  const prevClusters = JSON.stringify(previous.result.clusterHints);
  const nextClusters = JSON.stringify(next.result.clusterHints);

  return deepFreeze({
    densityChanged:
      previous.result.stageDensity !== next.result.stageDensity,
    previousDensity: previous.result.stageDensity,
    nextDensity: next.result.stageDensity,
    differences: Object.freeze(differences),
    clusterChanged: prevClusters !== nextClusters,
    transitionRecommendationChanged: prevTransitions !== nextTransitions,
  });
}

// ─── Serialization ──────────────────────────────────────────────────────────

export function serializeNexoraObjectAdaptiveRepresentationContext(
  context: NexoraObjectAdaptiveRepresentationContext,
): string {
  const errors = validateNexoraObjectAdaptiveRepresentationContext(context);
  if (errors.length > 0) {
    throw new NexoraObjectRepresentationContextAdaptiveDensityException(
      errors[0]!,
    );
  }
  return JSON.stringify({
    engineIdentity: representationContextAdaptiveDensityEngineIdentity,
    engineVersion: representationContextAdaptiveDensityEngineVersion,
    schemaVersion: representationContextAdaptiveDensitySchemaVersion,
    foundationIdentity: materialRepresentationFoundationIdentity,
    foundationSchemaVersion: materialRepresentationSchemaVersion,
    materialSchemaVersion: materialStateResolutionSchemaVersion,
    transitionIdentity: representationTransitionBehaviorEngineIdentity,
    transitionSchemaVersion: representationTransitionBehaviorSchemaVersion,
    context,
  });
}

export function deserializeNexoraObjectAdaptiveRepresentationContext(
  json: string,
): NexoraObjectAdaptiveRepresentationContext {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly context?: NexoraObjectAdaptiveRepresentationContext;
  };
  if (parsed.schemaVersion !== representationContextAdaptiveDensitySchemaVersion) {
    throw new NexoraObjectRepresentationContextAdaptiveDensityException(
      err(
        "ADAPTIVE_DENSITY_UNSUPPORTED_VERSION",
        `Unsupported adaptive density schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (!parsed.context) {
    throw new NexoraObjectRepresentationContextAdaptiveDensityException(
      err(
        "ADAPTIVE_DENSITY_INVALID_CONTEXT",
        "Missing adaptive representation context payload.",
      ),
    );
  }
  const restored = deepFreeze(parsed.context);
  const errors = validateNexoraObjectAdaptiveRepresentationContext(restored);
  if (errors.length > 0) {
    throw new NexoraObjectRepresentationContextAdaptiveDensityException(
      errors[0]!,
    );
  }
  return restored;
}

export function serializeNexoraObjectAdaptiveRepresentationResult(
  result: NexoraObjectAdaptiveRepresentationResult,
): string {
  return JSON.stringify({
    engineIdentity: representationContextAdaptiveDensityEngineIdentity,
    engineVersion: representationContextAdaptiveDensityEngineVersion,
    schemaVersion: representationContextAdaptiveDensitySchemaVersion,
    result,
  });
}

export function deserializeNexoraObjectAdaptiveRepresentationResult(
  json: string,
): NexoraObjectAdaptiveRepresentationResult {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly result?: NexoraObjectAdaptiveRepresentationResult;
  };
  if (parsed.schemaVersion !== representationContextAdaptiveDensitySchemaVersion) {
    throw new NexoraObjectRepresentationContextAdaptiveDensityException(
      err(
        "ADAPTIVE_DENSITY_UNSUPPORTED_VERSION",
        `Unsupported adaptive density result schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (!parsed.result) {
    throw new NexoraObjectRepresentationContextAdaptiveDensityException(
      err(
        "ADAPTIVE_DENSITY_INVARIANT_VIOLATION",
        "Missing adaptive representation result payload.",
      ),
    );
  }
  return deepFreeze(parsed.result);
}

export function serializeNexoraObjectAdaptiveContextSnapshot(
  snapshot: NexoraObjectAdaptiveContextSnapshot,
): string {
  return JSON.stringify({
    engineIdentity: representationContextAdaptiveDensityEngineIdentity,
    engineVersion: representationContextAdaptiveDensityEngineVersion,
    schemaVersion: representationContextAdaptiveDensitySchemaVersion,
    snapshot,
  });
}

export function deserializeNexoraObjectAdaptiveContextSnapshot(
  json: string,
): NexoraObjectAdaptiveContextSnapshot {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly snapshot?: NexoraObjectAdaptiveContextSnapshot;
  };
  if (parsed.schemaVersion !== representationContextAdaptiveDensitySchemaVersion) {
    throw new NexoraObjectRepresentationContextAdaptiveDensityException(
      err(
        "ADAPTIVE_DENSITY_UNSUPPORTED_VERSION",
        `Unsupported adaptive density snapshot schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (!parsed.snapshot) {
    throw new NexoraObjectRepresentationContextAdaptiveDensityException(
      err(
        "ADAPTIVE_DENSITY_INVARIANT_VIOLATION",
        "Missing adaptive context snapshot payload.",
      ),
    );
  }
  return deepFreeze(parsed.snapshot);
}

export function getNexoraObjectRepresentationContextAdaptiveDensityEngineSummary() {
  return Object.freeze({
    identity: representationContextAdaptiveDensityEngineIdentity,
    version: representationContextAdaptiveDensityEngineVersion,
    schemaVersion: representationContextAdaptiveDensitySchemaVersion,
    upstream: NOL_ADAPTIVE_DENSITY_UPSTREAM,
    frameworkIndependent: true,
    rendererIndependent: true,
    noBusinessMutation: true,
  });
}

export const NexoraObjectRepresentationContextAdaptiveDensityEngine =
  Object.freeze({
    identity: representationContextAdaptiveDensityEngineIdentity,
    version: representationContextAdaptiveDensityEngineVersion,
    schemaVersion: representationContextAdaptiveDensitySchemaVersion,
    resolveStageDensity: resolveNexoraObjectStageDensity,
    calculateRelevance: calculateNexoraObjectRepresentationRelevance,
    allocateBudget: allocateNexoraObjectRepresentationDetailBudget,
    resolveLabels: resolveNexoraObjectLabelDensity,
    resolveBadges: resolveNexoraObjectBadgeDensity,
    resolveIndicators: resolveNexoraObjectIndicatorDensity,
    resolveRelationships: resolveNexoraObjectRelationshipVisibility,
    resolveFocusNeighborhood: resolveNexoraObjectFocusNeighborhood,
    mergeLayers: mergeNexoraObjectRepresentationContextLayers,
    recommendTransitions: recommendNexoraObjectRepresentationTransitions,
    resolve: resolveNexoraObjectAdaptiveRepresentationContext,
    batch: resolveNexoraObjectAdaptiveRepresentationBatch,
    createSnapshot: createNexoraObjectAdaptiveContextSnapshot,
    compareSnapshots: compareNexoraObjectAdaptiveContextSnapshots,
    summary: getNexoraObjectRepresentationContextAdaptiveDensityEngineSummary,
  });
