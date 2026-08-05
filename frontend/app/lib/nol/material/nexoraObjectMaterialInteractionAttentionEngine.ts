/**
 * NOL-2:5 — NexoraObject Material Interaction & Attention Engine
 *
 * Converts interaction and executive-attention signals into
 * renderer-independent material responses for NexoraObjects.
 *
 * Upstream: NOL-2:1 + NOL-2:2 + NOL-2:3 + NOL-2:4 only.
 * Identity: NOL-2:5/NexoraObjectMaterialInteractionAttentionEngine
 */

import {
  materialRepresentationFoundationIdentity,
  materialRepresentationSchemaVersion,
  type NexoraObjectAffordance,
  type NexoraObjectAffordanceDescriptor,
  type NexoraObjectRepresentation,
  type NexoraObjectSeedColor,
} from "./nexoraObjectMaterialRepresentationFoundation.ts";
import {
  materialStateResolutionModelIdentity,
  materialStateResolutionSchemaVersion,
  type NexoraObjectGlowLevel,
  type NexoraObjectMaterialLayer,
  type NexoraObjectMaterialState,
  type NexoraObjectOutlineLevel,
  type NexoraObjectResolvedEmphasis,
} from "./nexoraObjectMaterialStateResolutionModel.ts";
import {
  representationTransitionBehaviorEngineIdentity,
  representationTransitionBehaviorSchemaVersion,
  type NexoraObjectRepresentationBehaviorDescriptor,
  type NexoraObjectRepresentationBehaviorType,
  type NexoraObjectRepresentationTransitionState,
} from "./nexoraObjectRepresentationTransitionBehaviorEngine.ts";
import {
  representationContextAdaptiveDensityEngineIdentity,
  representationContextAdaptiveDensitySchemaVersion,
  type NexoraObjectAdaptiveRepresentationRecommendation,
  type NexoraObjectStageDensity,
} from "./nexoraObjectRepresentationContextAdaptiveDensityEngine.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const materialInteractionAttentionEngineIdentity =
  "NOL-2:5/NexoraObjectMaterialInteractionAttentionEngine" as const;

export const materialInteractionAttentionEngineVersion = "1.0.0" as const;

export const materialInteractionAttentionSchemaVersion = "1.0.0" as const;

export const NOL_MATERIAL_ATTENTION_IDENTITY =
  materialInteractionAttentionEngineIdentity;
export const NOL_MATERIAL_ATTENTION_VERSION =
  materialInteractionAttentionEngineVersion;
export const NOL_MATERIAL_ATTENTION_SCHEMA_VERSION =
  materialInteractionAttentionSchemaVersion;

export const NOL_MATERIAL_ATTENTION_UPSTREAM = Object.freeze([
  materialRepresentationFoundationIdentity,
  materialStateResolutionModelIdentity,
  representationTransitionBehaviorEngineIdentity,
  representationContextAdaptiveDensityEngineIdentity,
] as const);

// ─── Constants ──────────────────────────────────────────────────────────────

export type NexoraObjectMaterialInteractionState =
  | "Idle"
  | "Hovered"
  | "Selected"
  | "Focused"
  | "Operating"
  | "Disabled"
  | "Historical";

export type NexoraObjectMaterialAttentionState =
  | "None"
  | "Observe"
  | "Notice"
  | "Warning"
  | "Critical"
  | "Immediate";

export type NexoraObjectAttentionSource =
  | "Status"
  | "Director"
  | "Advisor"
  | "Workspace"
  | "Timeline"
  | "Scenario"
  | "Decision"
  | "Execution"
  | "User"
  | "System";

export const NEXORA_OBJECT_INTERACTION_PRIORITY = Object.freeze({
  Historical: 0,
  Disabled: 1,
  Operating: 2,
  Focused: 3,
  Selected: 4,
  Hovered: 5,
  Idle: 6,
} as const satisfies Record<NexoraObjectMaterialInteractionState, number>);

export const NEXORA_OBJECT_ATTENTION_LEVEL_PRIORITY = Object.freeze({
  Immediate: 0,
  Critical: 1,
  Warning: 2,
  Notice: 3,
  Observe: 4,
  None: 5,
} as const satisfies Record<NexoraObjectMaterialAttentionState, number>);

export const NEXORA_OBJECT_ATTENTION_SOURCE_PRIORITY = Object.freeze({
  System: 0,
  Director: 1,
  Execution: 2,
  Decision: 3,
  Scenario: 4,
  Advisor: 5,
  Timeline: 6,
  Workspace: 7,
  User: 8,
  Status: 9,
} as const satisfies Record<NexoraObjectAttentionSource, number>);

const REASON_ORDER: readonly NexoraObjectMaterialAttentionReason[] =
  Object.freeze([
    "SystemSafety",
    "CriticalStatus",
    "WarningStatus",
    "DirectorAttention",
    "ExecutionBlocked",
    "ExecutionFailed",
    "DecisionRequired",
    "ScenarioImpact",
    "AdvisorAttention",
    "TimelineAttention",
    "Operating",
    "Focused",
    "Selected",
    "AttentionPath",
    "RecentlyChanged",
    "HistoricalFocus",
    "BackgroundContext",
  ]);

const MUTATION_AFFORDANCES = Object.freeze([
  "AddToStage",
  "RemoveFromStage",
  "Approve",
  "Reject",
  "Cancel",
  "Start",
  "Pause",
  "Resume",
  "Complete",
  "Edit",
] as const satisfies readonly NexoraObjectAffordance[]);

const SUPPORTED_ATTENTION_BEHAVIORS: readonly NexoraObjectRepresentationBehaviorType[] =
  Object.freeze([
    "AttentionPulse",
    "FocusPull",
    "BackgroundDim",
    "DepthShift",
    "IndicatorReveal",
    "RelationshipReveal",
    "HistoricalMute",
    "OperationLock",
  ]);

const ATTENTION_LEVELS: readonly NexoraObjectMaterialAttentionState[] =
  Object.freeze([
    "None",
    "Observe",
    "Notice",
    "Warning",
    "Critical",
    "Immediate",
  ]);

const INTERACTION_STATES: readonly NexoraObjectMaterialInteractionState[] =
  Object.freeze([
    "Idle",
    "Hovered",
    "Selected",
    "Focused",
    "Operating",
    "Disabled",
    "Historical",
  ]);

const ATTENTION_SOURCES: readonly NexoraObjectAttentionSource[] = Object.freeze([
  "Status",
  "Director",
  "Advisor",
  "Workspace",
  "Timeline",
  "Scenario",
  "Decision",
  "Execution",
  "User",
  "System",
]);

const INTERACTION_SIGNAL_TYPES = Object.freeze([
  "HoverEnter",
  "HoverLeave",
  "Select",
  "Deselect",
  "Focus",
  "Blur",
  "OperationEnter",
  "OperationExit",
  "Disable",
  "Enable",
  "HistoricalEnter",
  "HistoricalExit",
] as const);

const INTERACTION_SIGNAL_SOURCES = Object.freeze([
  "Director",
  "Workspace",
  "Explorer",
  "Timeline",
  "User",
  "System",
] as const);

const CONTEXT_SOURCES = Object.freeze([
  "Director",
  "Workspace",
  "Advisor",
  "Timeline",
  "Explorer",
  "System",
] as const);

const STAGE_MODES = Object.freeze([
  "Overview",
  "Inspection",
  "Presentation",
  "Operation",
  "Replay",
] as const);

const STAGE_DENSITIES: readonly NexoraObjectStageDensity[] = Object.freeze([
  "Sparse",
  "Balanced",
  "Dense",
  "Critical",
]);

const DEFAULT_ATTENTION_BUDGET: NexoraObjectAttentionBudget = Object.freeze({
  maximumImmediateObjects: 1,
  maximumCriticalObjects: 3,
  maximumPulsingObjects: 2,
  maximumStrongGlowObjects: 4,
});

// ─── Types ──────────────────────────────────────────────────────────────────

export interface NexoraObjectAttentionSignal {
  readonly signalId: string;
  readonly objectId: string;
  readonly source: NexoraObjectAttentionSource;
  readonly level: NexoraObjectMaterialAttentionState;
  readonly reason: string;
  readonly priority: number;
  readonly persistent: boolean;
  readonly suppressible: boolean;
  readonly pathId?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly createdAt: string;
  readonly expiresAt?: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface NexoraObjectInteractionSignal {
  readonly signalId: string;
  readonly objectId: string;
  readonly type:
    | "HoverEnter"
    | "HoverLeave"
    | "Select"
    | "Deselect"
    | "Focus"
    | "Blur"
    | "OperationEnter"
    | "OperationExit"
    | "Disable"
    | "Enable"
    | "HistoricalEnter"
    | "HistoricalExit";
  readonly source:
    | "Director"
    | "Workspace"
    | "Explorer"
    | "Timeline"
    | "User"
    | "System";
  readonly occurredAt: string;
  readonly correlationId?: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface NexoraObjectMaterialInteractionAttentionContext {
  readonly source:
    | "Director"
    | "Workspace"
    | "Advisor"
    | "Timeline"
    | "Explorer"
    | "System";
  readonly stageDensity: NexoraObjectStageDensity;
  readonly stageMode:
    | "Overview"
    | "Inspection"
    | "Presentation"
    | "Operation"
    | "Replay";
  readonly reducedMotion: boolean;
  readonly currentTime: string;
  readonly activeAttentionPathId?: string;
  readonly focusedObjectId?: string;
  readonly activeOperationObjectId?: string;
  readonly suppressRepeatedAttention?: boolean;
  readonly attentionCooldownMs?: number;
}

export interface NexoraObjectMaterialInteractionAttentionInput {
  readonly representation: NexoraObjectRepresentation;
  readonly materialState: NexoraObjectMaterialState;
  readonly transitionState: NexoraObjectRepresentationTransitionState;
  readonly adaptiveRecommendation: NexoraObjectAdaptiveRepresentationRecommendation;
  readonly interactionSignals: readonly NexoraObjectInteractionSignal[];
  readonly attentionSignals: readonly NexoraObjectAttentionSignal[];
  readonly context: NexoraObjectMaterialInteractionAttentionContext;
}

export interface NexoraObjectAttentionPulseDescriptor {
  readonly enabled: boolean;
  readonly intensity: "None" | "Low" | "Medium" | "High";
  readonly repetitions: number;
  readonly durationWeight: number;
  readonly cooldownApplied: boolean;
  readonly reducedMotionApplied: boolean;
}

export type NexoraObjectMaterialAttentionReason =
  | "CriticalStatus"
  | "WarningStatus"
  | "DirectorAttention"
  | "AdvisorAttention"
  | "TimelineAttention"
  | "ScenarioImpact"
  | "DecisionRequired"
  | "ExecutionBlocked"
  | "ExecutionFailed"
  | "Focused"
  | "Selected"
  | "Operating"
  | "RecentlyChanged"
  | "AttentionPath"
  | "HistoricalFocus"
  | "SystemSafety"
  | "BackgroundContext";

export interface NexoraObjectMaterialInteractionResponse {
  readonly objectId: string;
  readonly interactionState: NexoraObjectMaterialInteractionState;
  readonly attentionState: NexoraObjectMaterialAttentionState;
  readonly materialState: NexoraObjectMaterialState;
  readonly emphasis: NexoraObjectResolvedEmphasis;
  readonly layer: NexoraObjectMaterialLayer;
  readonly glow: NexoraObjectGlowLevel;
  readonly outline: NexoraObjectOutlineLevel;
  readonly dimmed: boolean;
  readonly pulse: NexoraObjectAttentionPulseDescriptor;
  readonly affordances: readonly NexoraObjectAffordanceDescriptor[];
  readonly activeSignalIds: readonly string[];
  readonly suppressedSignalIds: readonly string[];
  readonly reasons: readonly NexoraObjectMaterialAttentionReason[];
}

export interface NexoraObjectMaterialAttentionPlan {
  readonly objectId: string;
  readonly accepted: boolean;
  readonly previousResponse?: NexoraObjectMaterialInteractionResponse;
  readonly projectedResponse: NexoraObjectMaterialInteractionResponse;
  readonly activeSignals: readonly NexoraObjectAttentionSignal[];
  readonly suppressedSignals: readonly NexoraObjectAttentionSignal[];
  readonly dominantSignal?: NexoraObjectAttentionSignal;
  readonly behaviors: readonly NexoraObjectRepresentationBehaviorDescriptor[];
  readonly warnings: readonly NexoraObjectMaterialAttentionWarning[];
  readonly errors: readonly NexoraObjectMaterialAttentionError[];
}

export interface NexoraObjectMaterialAttentionResult {
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly response: NexoraObjectMaterialInteractionResponse;
  readonly plan: NexoraObjectMaterialAttentionPlan;
  readonly events: readonly NexoraObjectMaterialAttentionEvent[];
  readonly warnings: readonly NexoraObjectMaterialAttentionWarning[];
  readonly errors: readonly NexoraObjectMaterialAttentionError[];
}

export interface NexoraObjectAttentionPath {
  readonly pathId: string;
  readonly objectIds: readonly string[];
  readonly rootObjectId: string;
  readonly targetObjectId?: string;
  readonly source: NexoraObjectAttentionSource;
  readonly level: NexoraObjectMaterialAttentionState;
  readonly reason: string;
}

export type NexoraObjectAttentionPathRole =
  | "Root"
  | "Intermediate"
  | "Target"
  | "Outside";

export interface NexoraObjectAttentionPathResolution {
  readonly pathId: string;
  readonly objectIds: readonly string[];
  readonly roles: Readonly<Record<string, NexoraObjectAttentionPathRole>>;
  readonly attentionByObjectId: Readonly<
    Record<string, NexoraObjectMaterialAttentionState>
  >;
  readonly mayDimOutside: boolean;
  readonly performedGraphTraversal: false;
}

export interface NexoraObjectMaterialInteractionCollectionEntry {
  readonly input: NexoraObjectMaterialInteractionAttentionInput;
  readonly previousResponse?: NexoraObjectMaterialInteractionResponse;
}

export interface NexoraObjectMaterialInteractionAttentionCollectionResult {
  readonly accepted: boolean;
  readonly results: readonly NexoraObjectMaterialAttentionResult[];
  readonly budgetApplied: boolean;
  readonly focusDominantObjectId?: string;
  readonly operationDominantObjectId?: string;
  readonly warnings: readonly NexoraObjectMaterialAttentionWarning[];
  readonly errors: readonly NexoraObjectMaterialAttentionError[];
}

export interface NexoraObjectAttentionBudget {
  readonly maximumImmediateObjects: number;
  readonly maximumCriticalObjects: number;
  readonly maximumPulsingObjects: number;
  readonly maximumStrongGlowObjects: number;
}

export interface NexoraObjectAttentionBudgetEntry {
  readonly objectId: string;
  readonly attentionState: NexoraObjectMaterialAttentionState;
  readonly seedColor: NexoraObjectSeedColor;
  readonly adaptiveRank: number;
  readonly isFocused: boolean;
  readonly isOperating: boolean;
}

export interface NexoraObjectAttentionBudgetAllocation {
  readonly objectId: string;
  readonly originalAttentionState: NexoraObjectMaterialAttentionState;
  readonly allocatedAttentionState: NexoraObjectMaterialAttentionState;
  readonly pulseAllowed: boolean;
  readonly strongGlowAllowed: boolean;
  readonly downgraded: boolean;
}

export interface NexoraObjectAttentionBudgetResult {
  readonly budget: NexoraObjectAttentionBudget;
  readonly allocations: readonly NexoraObjectAttentionBudgetAllocation[];
  readonly warnings: readonly NexoraObjectMaterialAttentionWarning[];
}

export interface NexoraObjectAttentionSuppressionState {
  readonly objectId: string;
  readonly signalId: string;
  readonly lastPresentedAt?: string;
  readonly suppressedUntil?: string;
  readonly presentationCount: number;
}

export type NexoraObjectMaterialAttentionEventType =
  | "InteractionStateResolved"
  | "AttentionActivated"
  | "AttentionChanged"
  | "AttentionSuppressed"
  | "AttentionCleared"
  | "AttentionPathActivated"
  | "AttentionBudgetApplied"
  | "MaterialResponseChanged"
  | "AttentionResolutionRejected";

export interface NexoraObjectMaterialAttentionEvent {
  readonly eventId: string;
  readonly objectId: string;
  readonly type: NexoraObjectMaterialAttentionEventType;
  readonly occurredAt: string;
  readonly source: NexoraObjectAttentionSource;
  readonly signalId?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface NexoraObjectMaterialAttentionRecord {
  readonly recordId: string;
  readonly objectId: string;
  readonly interactionState: NexoraObjectMaterialInteractionState;
  readonly attentionState: NexoraObjectMaterialAttentionState;
  readonly dominantSignalId?: string;
  readonly activeSignalIds: readonly string[];
  readonly suppressedSignalIds: readonly string[];
  readonly occurredAt: string;
  readonly source: NexoraObjectAttentionSource;
  readonly reasons: readonly NexoraObjectMaterialAttentionReason[];
}

export interface NexoraObjectMaterialAttentionSnapshot {
  readonly snapshotId: string;
  readonly createdAt: string;
  readonly responses: readonly NexoraObjectMaterialInteractionResponse[];
}

export interface NexoraObjectMaterialAttentionDifference {
  readonly objectId: string;
  readonly interactionChanged: boolean;
  readonly attentionChanged: boolean;
  readonly dominantSignalChanged: boolean;
  readonly emphasisChanged: boolean;
  readonly layerChanged: boolean;
  readonly glowChanged: boolean;
  readonly pulseChanged: boolean;
  readonly dimmingChanged: boolean;
  readonly affordanceChanged: boolean;
  readonly changed: boolean;
}

export interface NexoraObjectMaterialAttentionSnapshotComparison {
  readonly differences: readonly NexoraObjectMaterialAttentionDifference[];
  readonly interactionChanged: boolean;
  readonly attentionChanged: boolean;
  readonly glowOrPulseChanged: boolean;
  readonly dimmingChanged: boolean;
  readonly affordanceChanged: boolean;
}

export type NexoraObjectMaterialAttentionWarningCode =
  | "ATTENTION_SIGNAL_SUPPRESSED"
  | "ATTENTION_SIGNAL_EXPIRED"
  | "ATTENTION_BUDGET_DOWNGRADED"
  | "ATTENTION_REDUCED_MOTION_APPLIED"
  | "ATTENTION_HISTORICAL_LIMIT_APPLIED"
  | "ATTENTION_BACKGROUND_DIMMED"
  | "ATTENTION_OPERATION_READ_ONLY"
  | "ATTENTION_NO_VISUAL_CHANGE";

export interface NexoraObjectMaterialAttentionWarning {
  readonly code: NexoraObjectMaterialAttentionWarningCode;
  readonly message: string;
  readonly objectId?: string;
  readonly signalId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export type NexoraObjectMaterialAttentionErrorCode =
  | "ATTENTION_INVALID_INPUT"
  | "ATTENTION_OBJECT_ID_MISMATCH"
  | "ATTENTION_INVALID_SIGNAL"
  | "ATTENTION_DUPLICATE_SIGNAL_ID"
  | "ATTENTION_INVALID_TIMESTAMP"
  | "ATTENTION_INVALID_PRIORITY"
  | "ATTENTION_INVALID_STATE"
  | "ATTENTION_INVALID_PATH"
  | "ATTENTION_INVALID_BUDGET"
  | "ATTENTION_HIDDEN_INTERACTION_FORBIDDEN"
  | "ATTENTION_HISTORICAL_MUTATION_FORBIDDEN"
  | "ATTENTION_SEED_COLOR_CONFLICT"
  | "ATTENTION_INVARIANT_VIOLATION"
  | "ATTENTION_UNSUPPORTED_VERSION";

export interface NexoraObjectMaterialAttentionError {
  readonly code: NexoraObjectMaterialAttentionErrorCode;
  readonly message: string;
  readonly objectId?: string;
  readonly signalId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export class NexoraObjectMaterialInteractionAttentionException extends Error {
  readonly code: NexoraObjectMaterialAttentionErrorCode;
  readonly objectId?: string;
  readonly signalId?: string;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraObjectMaterialAttentionError) {
    super(error.message);
    this.name = "NexoraObjectMaterialInteractionAttentionException";
    this.code = error.code;
    this.objectId = error.objectId;
    this.signalId = error.signalId;
    this.details = error.details;
  }
}

export interface NexoraObjectMaterialAttentionDependencies {
  readonly now: () => string;
  readonly createEventId: () => string;
  readonly createRecordId: () => string;
  readonly createSnapshotId: () => string;
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
  code: NexoraObjectMaterialAttentionErrorCode,
  message: string,
  extras?: Partial<NexoraObjectMaterialAttentionError>,
): NexoraObjectMaterialAttentionError {
  return Object.freeze({ code, message, ...extras });
}

function warn(
  code: NexoraObjectMaterialAttentionWarningCode,
  message: string,
  extras?: Partial<NexoraObjectMaterialAttentionWarning>,
): NexoraObjectMaterialAttentionWarning {
  return Object.freeze({ code, message, ...extras });
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

function isValidIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  return Number.isFinite(Date.parse(value));
}

function isJsonSafe(value: unknown, depth = 0): boolean {
  if (depth > 32) return false;
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return true;
  }
  if (typeof value === "number") {
    return Number.isFinite(value);
  }
  if (typeof value === "function" || typeof value === "symbol") return false;
  if (Array.isArray(value)) {
    return value.every((item: unknown) => isJsonSafe(item, depth + 1));
  }
  if (typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) return false;
    return Object.values(value as Record<string, unknown>).every(
      (item: unknown) => isJsonSafe(item, depth + 1),
    );
  }
  return false;
}

function sortReasons(
  reasons: readonly NexoraObjectMaterialAttentionReason[],
): readonly NexoraObjectMaterialAttentionReason[] {
  return Object.freeze(
    [...new Set(reasons)].sort(
      (a, b) => REASON_ORDER.indexOf(a) - REASON_ORDER.indexOf(b),
    ),
  );
}

function attentionRank(level: NexoraObjectMaterialAttentionState): number {
  return NEXORA_OBJECT_ATTENTION_LEVEL_PRIORITY[level];
}

function strongerAttention(
  a: NexoraObjectMaterialAttentionState,
  b: NexoraObjectMaterialAttentionState,
): NexoraObjectMaterialAttentionState {
  return attentionRank(a) <= attentionRank(b) ? a : b;
}

function downgradeAttention(
  level: NexoraObjectMaterialAttentionState,
): NexoraObjectMaterialAttentionState {
  if (level === "Immediate") return "Critical";
  if (level === "Critical") return "Warning";
  if (level === "Warning") return "Notice";
  if (level === "Notice") return "Observe";
  if (level === "Observe") return "None";
  return "None";
}

function seedRank(seed: NexoraObjectSeedColor): number {
  if (seed === "Red") return 0;
  if (seed === "Yellow") return 1;
  return 2;
}

function cloneMaterialState(
  state: NexoraObjectMaterialState,
  patch: {
    readonly emphasis: NexoraObjectResolvedEmphasis;
    readonly layer: NexoraObjectMaterialLayer;
    readonly glow: NexoraObjectGlowLevel;
    readonly outline: NexoraObjectOutlineLevel;
    readonly opacity: number;
    readonly cacheKeySuffix: string;
  },
): NexoraObjectMaterialState {
  const seedColor = state.seedColor;
  const material = deepFreeze({
    ...state.material,
    color: deepFreeze({ ...state.material.color }),
    depth: deepFreeze({ ...state.material.depth }),
    light: deepFreeze({ ...state.material.light }),
    border: deepFreeze({ ...state.material.border }),
    shadow: deepFreeze({ ...state.material.shadow }),
  });
  if (material.color.seed !== seedColor) {
    throw new NexoraObjectMaterialInteractionAttentionException(
      err(
        "ATTENTION_SEED_COLOR_CONFLICT",
        "Material interaction attempted to change Seed color.",
        { details: { before: seedColor, after: material.color.seed } },
      ),
    );
  }
  const cacheKey = `${state.cacheKey}|attn:${patch.cacheKeySuffix}`;
  return deepFreeze({
    ...state,
    material,
    seedColor,
    emphasis: patch.emphasis,
    layer: patch.layer,
    glow: patch.glow,
    outline: patch.outline,
    opacity: patch.opacity,
    visibility: state.visibility && patch.opacity > 0,
    cacheKey,
    materialStateId: `${state.materialStateId}|${patch.cacheKeySuffix}`,
  } satisfies NexoraObjectMaterialState);
}

function projectAffordances(
  representation: NexoraObjectRepresentation,
  interactionState: NexoraObjectMaterialInteractionState,
): readonly NexoraObjectAffordanceDescriptor[] {
  const suppressMutation =
    interactionState === "Historical" || interactionState === "Disabled";
  const nonInteractive =
    interactionState === "Disabled" ||
    (!representation.visible && interactionState === "Idle");

  return deepFreeze(
    representation.affordances.map(
      (descriptor: NexoraObjectAffordanceDescriptor) => {
        const isMutation = (
          MUTATION_AFFORDANCES as readonly string[]
        ).includes(descriptor.affordance);
        if (nonInteractive) {
          return deepFreeze({
            ...descriptor,
            enabled: false,
            reasonDisabled:
              descriptor.reasonDisabled ??
              "Object is non-interactive for material attention.",
          });
        }
        if (suppressMutation && isMutation) {
          return deepFreeze({
            ...descriptor,
            enabled: false,
            reasonDisabled:
              interactionState === "Historical"
                ? "Historical interaction disables mutation affordances."
                : "Disabled interaction disables mutation affordances.",
          });
        }
        return deepFreeze({ ...descriptor });
      },
    ),
  );
}

function reasonFromSource(
  source: NexoraObjectAttentionSource,
  level: NexoraObjectMaterialAttentionState,
  reasonText: string,
): NexoraObjectMaterialAttentionReason {
  if (source === "System" || level === "Immediate") return "SystemSafety";
  if (source === "Status" && level === "Critical") return "CriticalStatus";
  if (source === "Status" && level === "Warning") return "WarningStatus";
  if (source === "Director") return "DirectorAttention";
  if (source === "Advisor") return "AdvisorAttention";
  if (source === "Timeline") return "TimelineAttention";
  if (source === "Scenario") return "ScenarioImpact";
  if (source === "Decision") return "DecisionRequired";
  if (source === "Execution") {
    const lower = reasonText.toLowerCase();
    if (lower.includes("fail")) return "ExecutionFailed";
    return "ExecutionBlocked";
  }
  return "BackgroundContext";
}

function behavior(
  name: NexoraObjectRepresentationBehaviorType,
  phase: NexoraObjectRepresentationBehaviorDescriptor["phase"],
  intensity: NexoraObjectRepresentationBehaviorDescriptor["intensity"],
  durationWeight: number,
  reversible = true,
  payload: Readonly<Record<string, unknown>> = {},
): NexoraObjectRepresentationBehaviorDescriptor {
  return Object.freeze({
    behavior: name,
    phase,
    intensity,
    durationWeight,
    reversible,
    payload: Object.freeze({ ...payload }),
  });
}

let defaultEventSeq = 0;
let defaultRecordSeq = 0;
let defaultSnapshotSeq = 0;

export const defaultNexoraObjectMaterialAttentionDependencies: NexoraObjectMaterialAttentionDependencies =
  Object.freeze({
    now: () => new Date().toISOString(),
    createEventId: () => {
      defaultEventSeq += 1;
      return `nia-evt-${defaultEventSeq}`;
    },
    createRecordId: () => {
      defaultRecordSeq += 1;
      return `nia-rec-${defaultRecordSeq}`;
    },
    createSnapshotId: () => {
      defaultSnapshotSeq += 1;
      return `nia-snap-${defaultSnapshotSeq}`;
    },
  });

function resolveDeps(
  dependencies?: NexoraObjectMaterialAttentionDependencies,
): NexoraObjectMaterialAttentionDependencies {
  return dependencies ?? defaultNexoraObjectMaterialAttentionDependencies;
}

function compareAttentionSignals(
  a: NexoraObjectAttentionSignal,
  b: NexoraObjectAttentionSignal,
): number {
  const levelDelta = attentionRank(a.level) - attentionRank(b.level);
  if (levelDelta !== 0) return levelDelta;
  if (b.priority !== a.priority) return b.priority - a.priority;
  const sourceDelta =
    resolveNexoraObjectAttentionSourcePriority(a.source) -
    resolveNexoraObjectAttentionSourcePriority(b.source);
  if (sourceDelta !== 0) return sourceDelta;
  return a.signalId.localeCompare(b.signalId);
}

function isSignalExpired(
  signal: NexoraObjectAttentionSignal,
  currentTime: string,
): boolean {
  if (!signal.expiresAt) return false;
  if (!isValidIsoTimestamp(signal.expiresAt) || !isValidIsoTimestamp(currentTime)) {
    return false;
  }
  return Date.parse(signal.expiresAt) < Date.parse(currentTime);
}

function isOperationRepresentation(
  representation: NexoraObjectRepresentation,
  adaptive: NexoraObjectAdaptiveRepresentationRecommendation,
): boolean {
  return (
    representation.state === "Operation" ||
    adaptive.recommendedState === "Operation"
  );
}

function createBaselineStatusSignals(
  objectId: string,
  seed: NexoraObjectSeedColor,
  currentTime: string,
): readonly NexoraObjectAttentionSignal[] {
  if (seed === "Red") {
    return Object.freeze([
      deepFreeze({
        signalId: `status-critical:${objectId}`,
        objectId,
        source: "Status" as const,
        level: "Critical" as const,
        reason: "CriticalStatus",
        priority: 0,
        persistent: true,
        suppressible: true,
        createdAt: currentTime,
        payload: Object.freeze({ seed }),
      }),
    ]);
  }
  if (seed === "Yellow") {
    return Object.freeze([
      deepFreeze({
        signalId: `status-warning:${objectId}`,
        objectId,
        source: "Status" as const,
        level: "Warning" as const,
        reason: "WarningStatus",
        priority: 0,
        persistent: true,
        suppressible: true,
        createdAt: currentTime,
        payload: Object.freeze({ seed }),
      }),
    ]);
  }
  return Object.freeze([]);
}

function emptyPulse(
  reducedMotionApplied = false,
  cooldownApplied = false,
): NexoraObjectAttentionPulseDescriptor {
  return deepFreeze({
    enabled: false,
    intensity: "None" as const,
    repetitions: 0,
    durationWeight: 0,
    cooldownApplied,
    reducedMotionApplied,
  });
}

function responseEquality(
  a: NexoraObjectMaterialInteractionResponse,
  b: NexoraObjectMaterialInteractionResponse,
): boolean {
  return (
    a.interactionState === b.interactionState &&
    a.attentionState === b.attentionState &&
    a.emphasis === b.emphasis &&
    a.layer === b.layer &&
    a.glow === b.glow &&
    a.outline === b.outline &&
    a.dimmed === b.dimmed &&
    a.pulse.enabled === b.pulse.enabled &&
    a.pulse.intensity === b.pulse.intensity &&
    a.pulse.repetitions === b.pulse.repetitions &&
    a.materialState.seedColor === b.materialState.seedColor &&
    a.activeSignalIds.join("|") === b.activeSignalIds.join("|") &&
    a.suppressedSignalIds.join("|") === b.suppressedSignalIds.join("|")
  );
}

// ─── Source priority ────────────────────────────────────────────────────────

export function resolveNexoraObjectAttentionSourcePriority(
  source: NexoraObjectAttentionSource,
): number {
  return NEXORA_OBJECT_ATTENTION_SOURCE_PRIORITY[source];
}

// ─── Interaction resolution ─────────────────────────────────────────────────

export function resolveNexoraObjectMaterialInteractionState(input: {
  readonly representation: NexoraObjectRepresentation;
  readonly adaptiveRecommendation: NexoraObjectAdaptiveRepresentationRecommendation;
  readonly interactionSignals: readonly NexoraObjectInteractionSignal[];
  readonly context: NexoraObjectMaterialInteractionAttentionContext;
}): NexoraObjectMaterialInteractionState {
  const { representation, adaptiveRecommendation, context } = input;
  const objectId = representation.objectId;

  let hovered = false;
  let selected = false;
  let focused = false;
  let operating = false;
  let disabled = false;
  let historical =
    representation.profile === "Historical" || context.stageMode === "Replay";

  const signals = [...input.interactionSignals]
    .filter((signal) => signal.objectId === objectId)
    .sort((a, b) => {
      const timeDelta = Date.parse(a.occurredAt) - Date.parse(b.occurredAt);
      if (timeDelta !== 0) return timeDelta;
      return a.signalId.localeCompare(b.signalId);
    });

  for (const signal of signals) {
    switch (signal.type) {
      case "HoverEnter":
        hovered = true;
        break;
      case "HoverLeave":
        hovered = false;
        break;
      case "Select":
        selected = true;
        break;
      case "Deselect":
        selected = false;
        break;
      case "Focus":
        focused = true;
        break;
      case "Blur":
        focused = false;
        break;
      case "OperationEnter":
        operating = true;
        break;
      case "OperationExit":
        operating = false;
        break;
      case "Disable":
        disabled = true;
        break;
      case "Enable":
        disabled = false;
        break;
      case "HistoricalEnter":
        historical = true;
        break;
      case "HistoricalExit":
        historical = false;
        break;
    }
  }

  if (context.focusedObjectId === objectId) {
    focused = true;
  }
  if (context.activeOperationObjectId === objectId) {
    operating = true;
  }

  const canOperate =
    operating &&
    isOperationRepresentation(representation, adaptiveRecommendation);

  if (!representation.visible) {
    if (disabled) return "Disabled";
    return "Idle";
  }

  if (historical) return "Historical";
  if (disabled) return "Disabled";
  if (canOperate) return "Operating";
  if (focused) return "Focused";
  if (selected) return "Selected";
  if (hovered) return "Hovered";
  return "Idle";
}

// ─── Attention resolution ───────────────────────────────────────────────────

export function resolveNexoraObjectMaterialAttentionState(input: {
  readonly objectId: string;
  readonly seedColor: NexoraObjectSeedColor;
  readonly attentionSignals: readonly NexoraObjectAttentionSignal[];
  readonly context: NexoraObjectMaterialInteractionAttentionContext;
  readonly includeStatusBaseline?: boolean;
}): {
  readonly attentionState: NexoraObjectMaterialAttentionState;
  readonly activeSignals: readonly NexoraObjectAttentionSignal[];
  readonly expiredSignalIds: readonly string[];
  readonly dominantSignal?: NexoraObjectAttentionSignal;
} {
  const includeBaseline = input.includeStatusBaseline !== false;
  const baseline = includeBaseline
    ? createBaselineStatusSignals(
        input.objectId,
        input.seedColor,
        input.context.currentTime,
      )
    : Object.freeze([]);

  const expiredSignalIds: string[] = [];
  const candidates: NexoraObjectAttentionSignal[] = [];

  for (const signal of [...baseline, ...input.attentionSignals]) {
    if (signal.objectId !== input.objectId) continue;
    if (signal.level === "None") continue;
    if (isSignalExpired(signal, input.context.currentTime)) {
      expiredSignalIds.push(signal.signalId);
      continue;
    }
    candidates.push(signal);
  }

  candidates.sort(compareAttentionSignals);
  const dominantSignal = candidates[0];
  const attentionState = dominantSignal?.level ?? "None";

  return deepFreeze({
    attentionState,
    activeSignals: Object.freeze(candidates),
    expiredSignalIds: Object.freeze(expiredSignalIds),
    dominantSignal,
  });
}

// ─── Suppression ────────────────────────────────────────────────────────────

export function resolveNexoraObjectAttentionSuppression(
  signals: readonly NexoraObjectAttentionSignal[],
  suppressionStates: readonly NexoraObjectAttentionSuppressionState[],
  context: NexoraObjectMaterialInteractionAttentionContext,
): readonly string[] {
  const suppressed = new Set<string>();
  const stateBySignal = new Map(
    suppressionStates.map((state) => [state.signalId, state] as const),
  );
  const cooldownMs =
    typeof context.attentionCooldownMs === "number" &&
    Number.isFinite(context.attentionCooldownMs)
      ? Math.max(0, context.attentionCooldownMs)
      : 0;
  const currentMs = isValidIsoTimestamp(context.currentTime)
    ? Date.parse(context.currentTime)
    : Number.NaN;

  const signatureCounts = new Map<string, number>();

  for (const signal of signals) {
    const isImmediateSafety =
      signal.level === "Immediate" ||
      (signal.source === "System" && signal.persistent);
    const isPersistentRedStatus =
      signal.persistent &&
      signal.source === "Status" &&
      signal.level === "Critical" &&
      signal.payload.seed === "Red";

    if (isImmediateSafety || isPersistentRedStatus) {
      continue;
    }

    if (!signal.suppressible) continue;

    const state = stateBySignal.get(signal.signalId);
    if (
      state?.suppressedUntil &&
      isValidIsoTimestamp(state.suppressedUntil) &&
      isValidIsoTimestamp(context.currentTime) &&
      Date.parse(state.suppressedUntil) > Date.parse(context.currentTime)
    ) {
      suppressed.add(signal.signalId);
      continue;
    }

    if (context.suppressRepeatedAttention === false) continue;

    const signature = `${signal.objectId}|${signal.level}|${signal.reason}`;
    const count = (signatureCounts.get(signature) ?? 0) + 1;
    signatureCounts.set(signature, count);

    if (count > 1 && !signal.persistent) {
      suppressed.add(signal.signalId);
      continue;
    }

    if (
      cooldownMs > 0 &&
      !signal.persistent &&
      state?.lastPresentedAt &&
      isValidIsoTimestamp(state.lastPresentedAt) &&
      Number.isFinite(currentMs)
    ) {
      const elapsed = currentMs - Date.parse(state.lastPresentedAt);
      if (elapsed >= 0 && elapsed < cooldownMs) {
        suppressed.add(signal.signalId);
      }
    }
  }

  return Object.freeze([...suppressed].sort((a, b) => a.localeCompare(b)));
}

// ─── Pulse ──────────────────────────────────────────────────────────────────

function resolvePulse(input: {
  readonly interactionState: NexoraObjectMaterialInteractionState;
  readonly attentionState: NexoraObjectMaterialAttentionState;
  readonly dominantSignal?: NexoraObjectAttentionSignal;
  readonly context: NexoraObjectMaterialInteractionAttentionContext;
  readonly cooldownApplied: boolean;
  readonly stageDensity: NexoraObjectStageDensity;
}): NexoraObjectAttentionPulseDescriptor {
  const { interactionState, attentionState, dominantSignal, context } = input;

  if (interactionState === "Hovered") {
    return emptyPulse(context.reducedMotion, input.cooldownApplied);
  }

  if (context.reducedMotion) {
    return deepFreeze({
      enabled: false,
      intensity: "None" as const,
      repetitions: 0,
      durationWeight: 0,
      cooldownApplied: input.cooldownApplied,
      reducedMotionApplied: true,
    });
  }

  if (input.cooldownApplied) {
    return emptyPulse(false, true);
  }

  const mayPulse =
    attentionState === "Immediate" ||
    attentionState === "Critical" ||
    (attentionState === "Warning" &&
      dominantSignal &&
      dominantSignal.source !== "Status");

  if (!mayPulse) {
    return emptyPulse(false, false);
  }

  const dense =
    input.stageDensity === "Dense" || input.stageDensity === "Critical";
  const intensity =
    attentionState === "Immediate"
      ? "High"
      : attentionState === "Critical"
        ? dense
          ? "Medium"
          : "High"
        : "Low";
  const repetitions =
    attentionState === "Immediate" ? (dense ? 1 : 2) : dense ? 1 : 2;

  return deepFreeze({
    enabled: true,
    intensity: intensity as "Low" | "Medium" | "High",
    repetitions,
    durationWeight: attentionState === "Immediate" ? 1 : 0.75,
    cooldownApplied: false,
    reducedMotionApplied: false,
  });
}

// ─── Material mapping ───────────────────────────────────────────────────────

function mapVisualTreatment(input: {
  readonly interactionState: NexoraObjectMaterialInteractionState;
  readonly attentionState: NexoraObjectMaterialAttentionState;
  readonly dimmed: boolean;
  readonly base: NexoraObjectMaterialState;
}): {
  readonly emphasis: NexoraObjectResolvedEmphasis;
  readonly layer: NexoraObjectMaterialLayer;
  readonly glow: NexoraObjectGlowLevel;
  readonly outline: NexoraObjectOutlineLevel;
  readonly opacity: number;
} {
  const { interactionState, attentionState, dimmed, base } = input;

  let emphasis: NexoraObjectResolvedEmphasis = base.emphasis;
  let layer: NexoraObjectMaterialLayer = base.layer;
  let glow: NexoraObjectGlowLevel = base.glow;
  let outline: NexoraObjectOutlineLevel = base.outline;
  let opacity = base.opacity;

  switch (interactionState) {
    case "Idle":
      layer = layer === "Background" ? "Background" : "Normal";
      break;
    case "Hovered":
      emphasis = strongerEmphasis(emphasis, "Soft");
      outline = strongerOutline(outline, "Thin");
      break;
    case "Selected":
      emphasis = strongerEmphasis(emphasis, "Medium");
      layer = "Selected";
      outline = strongerOutline(outline, "Normal");
      glow = strongerGlow(glow, "Soft");
      break;
    case "Focused":
      emphasis = strongerEmphasis(emphasis, "Strong");
      layer = "Focused";
      glow = strongerGlow(glow, "Normal");
      outline = strongerOutline(outline, "Normal");
      break;
    case "Operating":
      emphasis = strongerEmphasis(emphasis, "Strong");
      layer = "Overlay";
      glow = strongerGlow(glow, "Strong");
      outline = strongerOutline(outline, "Bold");
      break;
    case "Disabled":
      emphasis = "None";
      layer = "Background";
      glow = "None";
      outline = "None";
      opacity = Math.min(opacity, 0.55);
      break;
    case "Historical":
      layer = "Historical";
      emphasis = strongerEmphasis(emphasis, "Soft");
      glow = "None";
      outline = strongerOutline(outline, "Thin");
      opacity = Math.min(opacity, 0.75);
      break;
  }

  switch (attentionState) {
    case "Observe":
      emphasis = strongerEmphasis(emphasis, "Soft");
      break;
    case "Notice":
      emphasis = strongerEmphasis(emphasis, "Medium");
      layer = preferLayer(layer, "Attention");
      glow = strongerGlow(glow, "Soft");
      break;
    case "Warning":
      emphasis = strongerEmphasis(emphasis, "Medium");
      layer = preferLayer(layer, "Attention");
      glow = strongerGlow(glow, "Normal");
      outline = strongerOutline(outline, "Normal");
      break;
    case "Critical":
      emphasis = "Critical";
      layer = preferLayer(layer, "Attention");
      glow = strongerGlow(glow, "Strong");
      outline = strongerOutline(outline, "Bold");
      break;
    case "Immediate":
      emphasis = "Critical";
      layer = "Overlay";
      glow = "Strong";
      outline = "Bold";
      break;
    case "None":
      break;
  }

  if (dimmed) {
    opacity = Math.min(opacity, 0.45);
    if (emphasis === "Critical") {
      // Critical background objects remain identifiable.
      opacity = Math.max(opacity, 0.55);
    } else {
      emphasis = "None";
      glow = weakerGlow(glow);
    }
  }

  return { emphasis, layer, glow, outline, opacity };
}

function strongerEmphasis(
  current: NexoraObjectResolvedEmphasis,
  candidate: NexoraObjectResolvedEmphasis,
): NexoraObjectResolvedEmphasis {
  const order: Record<NexoraObjectResolvedEmphasis, number> = {
    None: 0,
    Soft: 1,
    Medium: 2,
    Strong: 3,
    Critical: 4,
  };
  return order[candidate] > order[current] ? candidate : current;
}

function strongerGlow(
  current: NexoraObjectGlowLevel,
  candidate: NexoraObjectGlowLevel,
): NexoraObjectGlowLevel {
  const order: Record<NexoraObjectGlowLevel, number> = {
    None: 0,
    Soft: 1,
    Normal: 2,
    Strong: 3,
  };
  return order[candidate] > order[current] ? candidate : current;
}

function weakerGlow(current: NexoraObjectGlowLevel): NexoraObjectGlowLevel {
  if (current === "Strong") return "Normal";
  if (current === "Normal") return "Soft";
  if (current === "Soft") return "None";
  return "None";
}

function strongerOutline(
  current: NexoraObjectOutlineLevel,
  candidate: NexoraObjectOutlineLevel,
): NexoraObjectOutlineLevel {
  const order: Record<NexoraObjectOutlineLevel, number> = {
    None: 0,
    Thin: 1,
    Normal: 2,
    Bold: 3,
  };
  return order[candidate] > order[current] ? candidate : current;
}

function preferLayer(
  current: NexoraObjectMaterialLayer,
  candidate: NexoraObjectMaterialLayer,
): NexoraObjectMaterialLayer {
  const order: Record<NexoraObjectMaterialLayer, number> = {
    Historical: 10,
    Background: 20,
    Normal: 30,
    Selected: 40,
    Attention: 50,
    Focused: 60,
    Overlay: 70,
  };
  return order[candidate] > order[current] ? candidate : current;
}

export function resolveNexoraObjectInteractionMaterialState(input: {
  readonly materialState: NexoraObjectMaterialState;
  readonly interactionState: NexoraObjectMaterialInteractionState;
  readonly attentionState: NexoraObjectMaterialAttentionState;
  readonly dimmed?: boolean;
}): NexoraObjectMaterialState {
  const dimmed = input.dimmed === true;
  const treatment = mapVisualTreatment({
    interactionState: input.interactionState,
    attentionState: input.attentionState,
    dimmed,
    base: input.materialState,
  });
  return cloneMaterialState(input.materialState, {
    ...treatment,
    cacheKeySuffix: [
      input.interactionState,
      input.attentionState,
      dimmed ? "dim" : "full",
      treatment.emphasis,
      treatment.layer,
      treatment.glow,
      treatment.outline,
    ].join(":"),
  });
}

// ─── Background dimming ─────────────────────────────────────────────────────

export function resolveNexoraObjectBackgroundDimming(input: {
  readonly objectId: string;
  readonly interactionState: NexoraObjectMaterialInteractionState;
  readonly attentionState: NexoraObjectMaterialAttentionState;
  readonly context: NexoraObjectMaterialInteractionAttentionContext;
  readonly attentionPathObjectIds?: readonly string[];
  readonly forceDimBackground?: boolean;
}): boolean {
  const {
    objectId,
    interactionState,
    attentionState,
    context,
    attentionPathObjectIds,
  } = input;

  if (
    interactionState === "Focused" ||
    interactionState === "Operating" ||
    attentionState === "Immediate" ||
    attentionState === "Critical"
  ) {
    return false;
  }

  if (context.focusedObjectId === objectId) return false;
  if (context.activeOperationObjectId === objectId) return false;

  if (
    attentionPathObjectIds &&
    attentionPathObjectIds.includes(objectId) &&
    input.forceDimBackground !== true
  ) {
    return false;
  }

  const hasFocusContext = Boolean(
    context.focusedObjectId || context.activeOperationObjectId,
  );
  if (!hasFocusContext && input.forceDimBackground !== true) {
    return false;
  }

  return (
    input.forceDimBackground === true ||
    interactionState === "Idle" ||
    interactionState === "Disabled" ||
    interactionState === "Historical" ||
    attentionState === "None" ||
    attentionState === "Observe"
  );
}

// ─── Attention path ─────────────────────────────────────────────────────────

export function resolveNexoraObjectAttentionPath(
  path: NexoraObjectAttentionPath,
  candidateObjectIds: readonly string[] = path.objectIds,
): NexoraObjectAttentionPathResolution {
  if (!path.pathId || path.objectIds.length === 0) {
    throw new NexoraObjectMaterialInteractionAttentionException(
      err(
        "ATTENTION_INVALID_PATH",
        "Attention path requires pathId and ordered objectIds.",
        { details: { pathId: path.pathId } },
      ),
    );
  }
  if (path.rootObjectId !== path.objectIds[0]) {
    throw new NexoraObjectMaterialInteractionAttentionException(
      err(
        "ATTENTION_INVALID_PATH",
        "Attention path rootObjectId must equal the first objectId.",
        {
          details: {
            rootObjectId: path.rootObjectId,
            first: path.objectIds[0],
          },
        },
      ),
    );
  }
  if (
    path.targetObjectId &&
    !path.objectIds.includes(path.targetObjectId)
  ) {
    throw new NexoraObjectMaterialInteractionAttentionException(
      err(
        "ATTENTION_INVALID_PATH",
        "Attention path targetObjectId must be present in objectIds.",
        { details: { targetObjectId: path.targetObjectId } },
      ),
    );
  }

  const pathSet = new Set(path.objectIds);
  const roles: Record<string, NexoraObjectAttentionPathRole> = {};
  const attentionByObjectId: Record<string, NexoraObjectMaterialAttentionState> =
    {};

  for (const objectId of candidateObjectIds) {
    if (!pathSet.has(objectId)) {
      roles[objectId] = "Outside";
      attentionByObjectId[objectId] = "None";
      continue;
    }
    if (objectId === path.rootObjectId) {
      roles[objectId] = "Root";
      attentionByObjectId[objectId] = strongerAttention(path.level, "Notice");
      continue;
    }
    if (path.targetObjectId && objectId === path.targetObjectId) {
      roles[objectId] = "Target";
      attentionByObjectId[objectId] = strongerAttention(
        path.level === "None" ? "Notice" : path.level,
        "Notice",
      );
      continue;
    }
    roles[objectId] = "Intermediate";
    attentionByObjectId[objectId] = "Observe";
  }

  return deepFreeze({
    pathId: path.pathId,
    objectIds: Object.freeze([...path.objectIds]),
    roles: Object.freeze(roles),
    attentionByObjectId: Object.freeze(attentionByObjectId),
    mayDimOutside: true,
    performedGraphTraversal: false as const,
  });
}

// ─── Budget ─────────────────────────────────────────────────────────────────

export function allocateNexoraObjectAttentionBudget(
  entries: readonly NexoraObjectAttentionBudgetEntry[],
  budget: NexoraObjectAttentionBudget = DEFAULT_ATTENTION_BUDGET,
): NexoraObjectAttentionBudgetResult {
  const budgetErrors = validateAttentionBudget(budget);
  if (budgetErrors.length > 0) {
    throw new NexoraObjectMaterialInteractionAttentionException(budgetErrors[0]!);
  }

  const sorted = [...entries].sort((a, b) => {
    const seedDelta = seedRank(a.seedColor) - seedRank(b.seedColor);
    if (seedDelta !== 0) return seedDelta;
    const levelDelta =
      attentionRank(a.attentionState) - attentionRank(b.attentionState);
    if (levelDelta !== 0) return levelDelta;
    if (a.isOperating !== b.isOperating) return a.isOperating ? -1 : 1;
    if (a.isFocused !== b.isFocused) return a.isFocused ? -1 : 1;
    if (a.adaptiveRank !== b.adaptiveRank) {
      return a.adaptiveRank - b.adaptiveRank;
    }
    return a.objectId.localeCompare(b.objectId);
  });

  let immediateLeft = budget.maximumImmediateObjects;
  let criticalLeft = budget.maximumCriticalObjects;
  let pulsingLeft = budget.maximumPulsingObjects;
  let strongGlowLeft = budget.maximumStrongGlowObjects;
  const warnings: NexoraObjectMaterialAttentionWarning[] = [];
  const allocations: NexoraObjectAttentionBudgetAllocation[] = [];

  for (const entry of sorted) {
    let allocated = entry.attentionState;
    let downgraded = false;

    if (allocated === "Immediate" && immediateLeft <= 0) {
      allocated = downgradeAttention(allocated);
      downgraded = true;
    }
    if (
      (allocated === "Immediate" || allocated === "Critical") &&
      criticalLeft <= 0
    ) {
      allocated = downgradeAttention(
        allocated === "Immediate" ? "Critical" : allocated,
      );
      downgraded = true;
    }

    if (allocated === "Immediate") immediateLeft -= 1;
    if (allocated === "Immediate" || allocated === "Critical") {
      criticalLeft -= 1;
    }

    const wantsPulse =
      allocated === "Immediate" || allocated === "Critical";
    const pulseAllowed = wantsPulse && pulsingLeft > 0;
    if (pulseAllowed) pulsingLeft -= 1;

    const wantsStrongGlow =
      allocated === "Immediate" ||
      allocated === "Critical" ||
      entry.isOperating ||
      entry.isFocused;
    const strongGlowAllowed = wantsStrongGlow && strongGlowLeft > 0;
    if (strongGlowAllowed) strongGlowLeft -= 1;

    if (downgraded) {
      warnings.push(
        warn(
          "ATTENTION_BUDGET_DOWNGRADED",
          `Attention for ${entry.objectId} downgraded from ${entry.attentionState} to ${allocated}.`,
          {
            objectId: entry.objectId,
            details: {
              original: entry.attentionState,
              allocated,
            },
          },
        ),
      );
    }

    allocations.push(
      deepFreeze({
        objectId: entry.objectId,
        originalAttentionState: entry.attentionState,
        allocatedAttentionState: allocated,
        pulseAllowed,
        strongGlowAllowed,
        downgraded,
      }),
    );
  }

  // Preserve original entry order in output.
  const byId = new Map(
    allocations.map((allocation) => [allocation.objectId, allocation] as const),
  );
  const ordered = entries.map((entry) => byId.get(entry.objectId)!);

  return deepFreeze({
    budget,
    allocations: Object.freeze(ordered),
    warnings: Object.freeze(warnings),
  });
}

function validateAttentionBudget(
  budget: NexoraObjectAttentionBudget,
): readonly NexoraObjectMaterialAttentionError[] {
  const errors: NexoraObjectMaterialAttentionError[] = [];
  const keys: (keyof NexoraObjectAttentionBudget)[] = [
    "maximumImmediateObjects",
    "maximumCriticalObjects",
    "maximumPulsingObjects",
    "maximumStrongGlowObjects",
  ];
  for (const key of keys) {
    if (!isNonNegativeInteger(budget[key])) {
      errors.push(
        err(
          "ATTENTION_INVALID_BUDGET",
          `Attention budget ${key} must be a non-negative integer.`,
          { details: { key, value: budget[key] } },
        ),
      );
    }
  }
  return Object.freeze(errors);
}

// ─── Behaviors ──────────────────────────────────────────────────────────────

export function recommendNexoraObjectAttentionBehaviors(input: {
  readonly response: NexoraObjectMaterialInteractionResponse;
  readonly context: NexoraObjectMaterialInteractionAttentionContext;
}): readonly NexoraObjectRepresentationBehaviorDescriptor[] {
  const { response, context } = input;
  const behaviors: NexoraObjectRepresentationBehaviorDescriptor[] = [];

  if (response.pulse.enabled && !context.reducedMotion) {
    behaviors.push(
      behavior(
        "AttentionPulse",
        "During",
        response.pulse.intensity === "None" ? "Low" : response.pulse.intensity,
        response.pulse.durationWeight,
        true,
        { repetitions: response.pulse.repetitions },
      ),
    );
  }

  if (
    response.interactionState === "Focused" ||
    response.interactionState === "Operating"
  ) {
    behaviors.push(behavior("FocusPull", "During", "High", 0.8));
  }

  if (response.dimmed) {
    behaviors.push(behavior("BackgroundDim", "During", "Medium", 0.5));
  }

  if (
    response.attentionState === "Critical" ||
    response.attentionState === "Immediate" ||
    response.interactionState === "Focused"
  ) {
    behaviors.push(behavior("DepthShift", "During", "Medium", 0.4));
    behaviors.push(behavior("IndicatorReveal", "During", "Medium", 0.3));
  }

  if (response.reasons.includes("AttentionPath")) {
    behaviors.push(behavior("RelationshipReveal", "During", "Low", 0.35));
  }

  if (response.interactionState === "Historical") {
    behaviors.push(behavior("HistoricalMute", "During", "Low", 0.25));
  }

  if (response.interactionState === "Operating") {
    behaviors.push(behavior("OperationLock", "During", "Medium", 0.5));
  }

  const filtered = behaviors.filter((descriptor) =>
    SUPPORTED_ATTENTION_BEHAVIORS.includes(descriptor.behavior),
  );

  return deepFreeze(filtered);
}

// ─── Clear / reset ──────────────────────────────────────────────────────────

export function clearNexoraObjectAttentionSignals(
  signals: readonly NexoraObjectAttentionSignal[],
  options?: {
    readonly clearPersistent?: boolean;
    readonly objectId?: string;
  },
): readonly NexoraObjectAttentionSignal[] {
  const clearPersistent = options?.clearPersistent === true;
  const objectId = options?.objectId;

  return deepFreeze(
    signals.filter((signal) => {
      if (objectId && signal.objectId !== objectId) return true;
      if (signal.source === "Status" && !clearPersistent) return true;
      if (signal.persistent && !clearPersistent) return true;
      return false;
    }),
  );
}

export function resetNexoraObjectMaterialInteractionAttention(
  input: Pick<
    NexoraObjectMaterialInteractionAttentionInput,
    "representation" | "materialState" | "adaptiveRecommendation" | "context"
  >,
): NexoraObjectMaterialInteractionResponse {
  const interactionState = resolveNexoraObjectMaterialInteractionState({
    representation: input.representation,
    adaptiveRecommendation: input.adaptiveRecommendation,
    interactionSignals: Object.freeze([]),
    context: {
      ...input.context,
      focusedObjectId: undefined,
      activeOperationObjectId: undefined,
    },
  });

  // Representation-derived default without attention signals.
  const resolvedInteraction =
    input.representation.profile === "Historical" ||
    input.context.stageMode === "Replay"
      ? "Historical"
      : !input.representation.visible
        ? "Idle"
        : interactionState === "Historical"
          ? "Historical"
          : "Idle";

  const materialState = resolveNexoraObjectInteractionMaterialState({
    materialState: input.materialState,
    interactionState: resolvedInteraction,
    attentionState: "None",
    dimmed: false,
  });

  if (materialState.seedColor !== input.materialState.seedColor) {
    throw new NexoraObjectMaterialInteractionAttentionException(
      err(
        "ATTENTION_SEED_COLOR_CONFLICT",
        "Reset attempted to change Seed color.",
        { objectId: input.representation.objectId },
      ),
    );
  }

  return deepFreeze({
    objectId: input.representation.objectId,
    interactionState: resolvedInteraction,
    attentionState: "None",
    materialState,
    emphasis: materialState.emphasis,
    layer: materialState.layer,
    glow: materialState.glow,
    outline: materialState.outline,
    dimmed: false,
    pulse: emptyPulse(input.context.reducedMotion),
    affordances: projectAffordances(
      input.representation,
      resolvedInteraction,
    ),
    activeSignalIds: Object.freeze([]),
    suppressedSignalIds: Object.freeze([]),
    reasons: Object.freeze([]),
  });
}

// ─── Primary resolution ─────────────────────────────────────────────────────

export function resolveNexoraObjectMaterialInteractionAttention(
  input: NexoraObjectMaterialInteractionAttentionInput,
  dependencies?: NexoraObjectMaterialAttentionDependencies,
  previousResponse?: NexoraObjectMaterialInteractionResponse,
): NexoraObjectMaterialAttentionResult {
  const deps = resolveDeps(dependencies);
  const warnings: NexoraObjectMaterialAttentionWarning[] = [];
  const errors = [
    ...validateNexoraObjectMaterialInteractionAttentionInput(input),
  ];

  if (errors.length > 0) {
    const fallback = resetNexoraObjectMaterialInteractionAttention(input);
    const plan = deepFreeze({
      objectId: input.representation.objectId,
      accepted: false,
      previousResponse,
      projectedResponse: fallback,
      activeSignals: Object.freeze([]),
      suppressedSignals: Object.freeze([]),
      behaviors: Object.freeze([]),
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors),
    } satisfies NexoraObjectMaterialAttentionPlan);

    return deepFreeze({
      accepted: false,
      changed: false,
      response: fallback,
      plan,
      events: Object.freeze([
        deepFreeze({
          eventId: deps.createEventId(),
          objectId: input.representation.objectId,
          type: "AttentionResolutionRejected" as const,
          occurredAt: deps.now(),
          source: "System" as const,
          payload: Object.freeze({
            errorCodes: errors.map((error) => error.code),
          }),
        }),
      ]),
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors),
    });
  }

  const objectId = input.representation.objectId;

  const interactionState = resolveNexoraObjectMaterialInteractionState({
    representation: input.representation,
    adaptiveRecommendation: input.adaptiveRecommendation,
    interactionSignals: input.interactionSignals,
    context: input.context,
  });

  const attentionResolution = resolveNexoraObjectMaterialAttentionState({
    objectId,
    seedColor: input.representation.material.color.seed,
    attentionSignals: input.attentionSignals,
    context: input.context,
    includeStatusBaseline: true,
  });

  for (const signalId of attentionResolution.expiredSignalIds) {
    warnings.push(
      warn("ATTENTION_SIGNAL_EXPIRED", `Attention signal ${signalId} expired.`, {
        objectId,
        signalId,
      }),
    );
  }

  const suppressedSignalIds = resolveNexoraObjectAttentionSuppression(
    attentionResolution.activeSignals,
    Object.freeze([]),
    input.context,
  );
  const suppressedSet = new Set(suppressedSignalIds);
  const activeSignals = attentionResolution.activeSignals.filter(
    (signal) => !suppressedSet.has(signal.signalId),
  );
  const suppressedSignals = attentionResolution.activeSignals.filter(
    (signal) => suppressedSet.has(signal.signalId),
  );

  for (const signal of suppressedSignals) {
    warnings.push(
      warn(
        "ATTENTION_SIGNAL_SUPPRESSED",
        `Attention signal ${signal.signalId} suppressed.`,
        { objectId, signalId: signal.signalId },
      ),
    );
  }

  const dominantSignal = [...activeSignals].sort(compareAttentionSignals)[0];
  const attentionState = dominantSignal?.level ?? "None";

  const dimmed = resolveNexoraObjectBackgroundDimming({
    objectId,
    interactionState,
    attentionState,
    context: input.context,
  });

  if (dimmed) {
    warnings.push(
      warn(
        "ATTENTION_BACKGROUND_DIMMED",
        `Object ${objectId} recommended for background dimming.`,
        { objectId },
      ),
    );
  }

  const cooldownApplied = suppressedSignals.length > 0;
  const pulse = resolvePulse({
    interactionState,
    attentionState,
    dominantSignal,
    context: input.context,
    cooldownApplied,
    stageDensity: input.context.stageDensity,
  });

  if (pulse.reducedMotionApplied) {
    warnings.push(
      warn(
        "ATTENTION_REDUCED_MOTION_APPLIED",
        "Reduced motion disabled repeated attention pulse.",
        { objectId },
      ),
    );
  }

  if (
    interactionState === "Operating" &&
    (input.representation.readOnly ||
      input.representation.profile === "Historical")
  ) {
    warnings.push(
      warn(
        "ATTENTION_OPERATION_READ_ONLY",
        "Operating interaction is read-only for this representation.",
        { objectId },
      ),
    );
  }

  if (interactionState === "Historical") {
    warnings.push(
      warn(
        "ATTENTION_HISTORICAL_LIMIT_APPLIED",
        "Historical interaction suppresses mutation affordances.",
        { objectId },
      ),
    );
  }

  const materialState = resolveNexoraObjectInteractionMaterialState({
    materialState: input.materialState,
    interactionState,
    attentionState,
    dimmed,
  });

  const reasons: NexoraObjectMaterialAttentionReason[] = [];
  if (dominantSignal) {
    reasons.push(
      reasonFromSource(
        dominantSignal.source,
        dominantSignal.level,
        dominantSignal.reason,
      ),
    );
  }
  if (interactionState === "Focused") reasons.push("Focused");
  if (interactionState === "Selected") reasons.push("Selected");
  if (interactionState === "Operating") reasons.push("Operating");
  if (interactionState === "Historical") reasons.push("HistoricalFocus");
  if (input.adaptiveRecommendation.reasons.includes("AttentionPath")) {
    reasons.push("AttentionPath");
  }
  if (input.adaptiveRecommendation.reasons.includes("RecentChange")) {
    reasons.push("RecentlyChanged");
  }
  if (dimmed) reasons.push("BackgroundContext");

  const response = deepFreeze({
    objectId,
    interactionState,
    attentionState,
    materialState,
    emphasis: materialState.emphasis,
    layer: materialState.layer,
    glow: materialState.glow,
    outline: materialState.outline,
    dimmed,
    pulse,
    affordances: projectAffordances(input.representation, interactionState),
    activeSignalIds: Object.freeze(
      activeSignals.map((signal) => signal.signalId),
    ),
    suppressedSignalIds: Object.freeze([...suppressedSignalIds]),
    reasons: sortReasons(reasons),
  } satisfies NexoraObjectMaterialInteractionResponse);

  const behaviors = recommendNexoraObjectAttentionBehaviors({
    response,
    context: input.context,
  });

  const changed = previousResponse
    ? !responseEquality(previousResponse, response)
    : response.interactionState !== "Idle" ||
      response.attentionState !== "None" ||
      response.dimmed ||
      response.pulse.enabled;

  if (!changed) {
    warnings.push(
      warn(
        "ATTENTION_NO_VISUAL_CHANGE",
        "Material interaction attention produced no visual change.",
        { objectId },
      ),
    );
  }

  const events: NexoraObjectMaterialAttentionEvent[] = [
    deepFreeze({
      eventId: deps.createEventId(),
      objectId,
      type: "InteractionStateResolved" as const,
      occurredAt: deps.now(),
      source: mapContextSource(input.context.source),
      correlationId: dominantSignal?.correlationId,
      causationId: dominantSignal?.causationId,
      payload: Object.freeze({ interactionState }),
    }),
  ];

  if (attentionState !== "None") {
    events.push(
      deepFreeze({
        eventId: deps.createEventId(),
        objectId,
        type: "AttentionActivated" as const,
        occurredAt: deps.now(),
        source: dominantSignal?.source ?? "Status",
        signalId: dominantSignal?.signalId,
        correlationId: dominantSignal?.correlationId,
        causationId: dominantSignal?.causationId,
        payload: Object.freeze({ attentionState }),
      }),
    );
  }

  if (
    previousResponse &&
    previousResponse.attentionState !== attentionState
  ) {
    events.push(
      deepFreeze({
        eventId: deps.createEventId(),
        objectId,
        type: "AttentionChanged" as const,
        occurredAt: deps.now(),
        source: dominantSignal?.source ?? "System",
        signalId: dominantSignal?.signalId,
        correlationId: dominantSignal?.correlationId,
        causationId: dominantSignal?.causationId,
        payload: Object.freeze({
          previous: previousResponse.attentionState,
          next: attentionState,
        }),
      }),
    );
  }

  for (const signal of suppressedSignals) {
    events.push(
      deepFreeze({
        eventId: deps.createEventId(),
        objectId,
        type: "AttentionSuppressed" as const,
        occurredAt: deps.now(),
        source: signal.source,
        signalId: signal.signalId,
        correlationId: signal.correlationId,
        causationId: signal.causationId,
        payload: Object.freeze({ reason: signal.reason }),
      }),
    );
  }

  if (changed) {
    events.push(
      deepFreeze({
        eventId: deps.createEventId(),
        objectId,
        type: "MaterialResponseChanged" as const,
        occurredAt: deps.now(),
        source: mapContextSource(input.context.source),
        signalId: dominantSignal?.signalId,
        correlationId: dominantSignal?.correlationId,
        causationId: dominantSignal?.causationId,
        payload: Object.freeze({
          interactionState,
          attentionState,
          dimmed,
        }),
      }),
    );
  }

  const plan = deepFreeze({
    objectId,
    accepted: true,
    previousResponse,
    projectedResponse: response,
    activeSignals: Object.freeze(activeSignals),
    suppressedSignals: Object.freeze(suppressedSignals),
    dominantSignal,
    behaviors,
    warnings: Object.freeze(warnings),
    errors: Object.freeze([]),
  } satisfies NexoraObjectMaterialAttentionPlan);

  return deepFreeze({
    accepted: true,
    changed,
    response,
    plan,
    events: Object.freeze(events),
    warnings: Object.freeze(warnings),
    errors: Object.freeze([]),
  });
}

function mapContextSource(
  source: NexoraObjectMaterialInteractionAttentionContext["source"],
): NexoraObjectAttentionSource {
  if (source === "Explorer") return "Workspace";
  return source;
}

// ─── Collection resolution ──────────────────────────────────────────────────

export function resolveNexoraObjectMaterialInteractionAttentionCollection(
  entries: readonly NexoraObjectMaterialInteractionCollectionEntry[],
  options?: {
    readonly budget?: NexoraObjectAttentionBudget;
    readonly attentionPath?: NexoraObjectAttentionPath;
    readonly dependencies?: NexoraObjectMaterialAttentionDependencies;
  },
): NexoraObjectMaterialInteractionAttentionCollectionResult {
  const deps = resolveDeps(options?.dependencies);
  const warnings: NexoraObjectMaterialAttentionWarning[] = [];
  const errors: NexoraObjectMaterialAttentionError[] = [];

  const pathResolution = options?.attentionPath
    ? resolveNexoraObjectAttentionPath(
        options.attentionPath,
        entries.map((entry) => entry.input.representation.objectId),
      )
    : undefined;

  if (pathResolution) {
    warnings.push(
      warn(
        "ATTENTION_NO_VISUAL_CHANGE",
        `Attention path ${pathResolution.pathId} applied without graph traversal.`,
        { details: { pathId: pathResolution.pathId } },
      ),
    );
  }

  const preliminary = entries.map((entry) => {
    const result = resolveNexoraObjectMaterialInteractionAttention(
      entry.input,
      deps,
      entry.previousResponse,
    );
    warnings.push(...result.warnings);
    errors.push(...result.errors);
    return { entry, result };
  });

  // One focus dominant, one operation dominant.
  let focusDominantObjectId: string | undefined;
  let operationDominantObjectId: string | undefined;
  for (const item of preliminary) {
    const objectId = item.entry.input.representation.objectId;
    const interaction = item.result.response.interactionState;
    if (
      !focusDominantObjectId &&
      (interaction === "Focused" ||
        item.entry.input.context.focusedObjectId === objectId)
    ) {
      focusDominantObjectId = objectId;
    }
    if (
      !operationDominantObjectId &&
      (interaction === "Operating" ||
        item.entry.input.context.activeOperationObjectId === objectId)
    ) {
      operationDominantObjectId = objectId;
    }
  }

  const budgetEntries: NexoraObjectAttentionBudgetEntry[] = preliminary.map(
    (item) =>
      deepFreeze({
        objectId: item.entry.input.representation.objectId,
        attentionState: item.result.response.attentionState,
        seedColor: item.entry.input.representation.material.color.seed,
        adaptiveRank: item.entry.input.adaptiveRecommendation.rank,
        isFocused:
          item.entry.input.representation.objectId === focusDominantObjectId,
        isOperating:
          item.entry.input.representation.objectId ===
          operationDominantObjectId,
      }),
  );

  const budgetResult = allocateNexoraObjectAttentionBudget(
    budgetEntries,
    options?.budget ?? DEFAULT_ATTENTION_BUDGET,
  );
  warnings.push(...budgetResult.warnings);

  const allocationById = new Map(
    budgetResult.allocations.map(
      (allocation) => [allocation.objectId, allocation] as const,
    ),
  );

  const results: NexoraObjectMaterialAttentionResult[] = [];

  for (const item of preliminary) {
    const objectId = item.entry.input.representation.objectId;
    const allocation = allocationById.get(objectId)!;
    let response = item.result.response;

    const isFocusDominant = objectId === focusDominantObjectId;
    const isOperationDominant = objectId === operationDominantObjectId;

    let interactionState = response.interactionState;
    if (interactionState === "Focused" && !isFocusDominant) {
      interactionState =
        interactionState === "Focused" ? "Selected" : interactionState;
      if (
        item.entry.input.context.focusedObjectId &&
        item.entry.input.context.focusedObjectId !== objectId
      ) {
        // demote non-dominant focus to selected/hovered/idle based on signals
        const signals = item.entry.input.interactionSignals;
        const hasSelect = signals.some(
          (signal) =>
            signal.objectId === objectId && signal.type === "Select",
        );
        const hasHover = signals.some(
          (signal) =>
            signal.objectId === objectId && signal.type === "HoverEnter",
        );
        interactionState = hasSelect
          ? "Selected"
          : hasHover
            ? "Hovered"
            : response.interactionState === "Historical" ||
                response.interactionState === "Disabled"
              ? response.interactionState
              : "Idle";
      }
    }
    if (interactionState === "Operating" && !isOperationDominant) {
      interactionState =
        objectId === focusDominantObjectId ? "Focused" : "Selected";
    }

    let attentionState = allocation.allocatedAttentionState;
    if (pathResolution?.attentionByObjectId[objectId]) {
      attentionState = strongerAttention(
        attentionState,
        pathResolution.attentionByObjectId[objectId]!,
      );
    }

    const dimmed = resolveNexoraObjectBackgroundDimming({
      objectId,
      interactionState,
      attentionState,
      context: item.entry.input.context,
      attentionPathObjectIds: pathResolution?.objectIds,
      forceDimBackground:
        pathResolution?.roles[objectId] === "Outside" &&
        Boolean(focusDominantObjectId || operationDominantObjectId),
    });

    const pulseBase = resolvePulse({
      interactionState,
      attentionState,
      dominantSignal: item.result.plan.dominantSignal,
      context: item.entry.input.context,
      cooldownApplied: response.suppressedSignalIds.length > 0,
      stageDensity: item.entry.input.context.stageDensity,
    });
    const pulse = deepFreeze({
      ...pulseBase,
      enabled: pulseBase.enabled && allocation.pulseAllowed,
      repetitions:
        pulseBase.enabled && allocation.pulseAllowed
          ? pulseBase.repetitions
          : 0,
      intensity:
        pulseBase.enabled && allocation.pulseAllowed
          ? pulseBase.intensity
          : ("None" as const),
    });

    let materialState = resolveNexoraObjectInteractionMaterialState({
      materialState: item.entry.input.materialState,
      interactionState,
      attentionState,
      dimmed,
    });

    if (!allocation.strongGlowAllowed && materialState.glow === "Strong") {
      materialState = cloneMaterialState(materialState, {
        emphasis: materialState.emphasis,
        layer: materialState.layer,
        glow: "Normal",
        outline: materialState.outline,
        opacity: materialState.opacity,
        cacheKeySuffix: "glow-cap",
      });
    }

    const reasons = [...response.reasons];
    if (pathResolution && pathResolution.roles[objectId] !== "Outside") {
      reasons.push("AttentionPath");
    }

    response = deepFreeze({
      ...response,
      interactionState,
      attentionState,
      materialState,
      emphasis: materialState.emphasis,
      layer: materialState.layer,
      glow: materialState.glow,
      outline: materialState.outline,
      dimmed,
      pulse,
      affordances: projectAffordances(
        item.entry.input.representation,
        interactionState,
      ),
      reasons: sortReasons(reasons),
    });

    const behaviors = recommendNexoraObjectAttentionBehaviors({
      response,
      context: item.entry.input.context,
    });

    const changed = item.entry.previousResponse
      ? !responseEquality(item.entry.previousResponse, response)
      : item.result.changed || allocation.downgraded;

    const events = [...item.result.events];
    if (allocation.downgraded) {
      events.push(
        deepFreeze({
          eventId: deps.createEventId(),
          objectId,
          type: "AttentionBudgetApplied" as const,
          occurredAt: deps.now(),
          source: "System" as const,
          payload: Object.freeze({
            original: allocation.originalAttentionState,
            allocated: allocation.allocatedAttentionState,
          }),
        }),
      );
    }
    if (pathResolution && pathResolution.roles[objectId] !== "Outside") {
      events.push(
        deepFreeze({
          eventId: deps.createEventId(),
          objectId,
          type: "AttentionPathActivated" as const,
          occurredAt: deps.now(),
          source: options!.attentionPath!.source,
          payload: Object.freeze({
            pathId: pathResolution.pathId,
            role: pathResolution.roles[objectId],
          }),
        }),
      );
    }

    results.push(
      deepFreeze({
        accepted: item.result.accepted && errors.length === 0,
        changed,
        response,
        plan: deepFreeze({
          ...item.result.plan,
          projectedResponse: response,
          behaviors,
          warnings: Object.freeze([
            ...item.result.plan.warnings,
            ...budgetResult.warnings.filter(
              (warning) => warning.objectId === objectId,
            ),
          ]),
        }),
        events: Object.freeze(events),
        warnings: Object.freeze([
          ...item.result.warnings,
          ...budgetResult.warnings.filter(
            (warning) => warning.objectId === objectId,
          ),
        ]),
        errors: item.result.errors,
      }),
    );
  }

  return deepFreeze({
    accepted: errors.length === 0 && results.every((result) => result.accepted),
    results: Object.freeze(results),
    budgetApplied: budgetResult.allocations.some(
      (allocation) => allocation.downgraded,
    ),
    focusDominantObjectId,
    operationDominantObjectId,
    warnings: Object.freeze(warnings),
    errors: Object.freeze(errors),
  });
}

// ─── Records / history / snapshots ──────────────────────────────────────────

export function createNexoraObjectMaterialAttentionRecord(
  response: NexoraObjectMaterialInteractionResponse,
  options?: {
    readonly source?: NexoraObjectAttentionSource;
    readonly dominantSignalId?: string;
    readonly dependencies?: NexoraObjectMaterialAttentionDependencies;
  },
): NexoraObjectMaterialAttentionRecord {
  const deps = resolveDeps(options?.dependencies);
  return deepFreeze({
    recordId: deps.createRecordId(),
    objectId: response.objectId,
    interactionState: response.interactionState,
    attentionState: response.attentionState,
    dominantSignalId:
      options?.dominantSignalId ?? response.activeSignalIds[0],
    activeSignalIds: Object.freeze([...response.activeSignalIds]),
    suppressedSignalIds: Object.freeze([...response.suppressedSignalIds]),
    occurredAt: deps.now(),
    source: options?.source ?? "System",
    reasons: Object.freeze([...response.reasons]),
  });
}

export function projectNexoraObjectMaterialAttentionHistory(
  records: readonly NexoraObjectMaterialAttentionRecord[],
): readonly NexoraObjectMaterialAttentionRecord[] {
  return deepFreeze(
    [...records].sort((a, b) => {
      const timeDelta = Date.parse(a.occurredAt) - Date.parse(b.occurredAt);
      if (timeDelta !== 0) return timeDelta;
      return a.recordId.localeCompare(b.recordId);
    }),
  );
}

export function createNexoraObjectMaterialAttentionSnapshot(
  responses: readonly NexoraObjectMaterialInteractionResponse[],
  dependencies?: NexoraObjectMaterialAttentionDependencies,
): NexoraObjectMaterialAttentionSnapshot {
  const deps = resolveDeps(dependencies);
  const ordered = [...responses].sort((a, b) =>
    a.objectId.localeCompare(b.objectId),
  );
  return deepFreeze({
    snapshotId: deps.createSnapshotId(),
    createdAt: deps.now(),
    responses: Object.freeze(ordered.map((response) => deepFreeze(response))),
  });
}

export function compareNexoraObjectMaterialAttentionSnapshots(
  previous: NexoraObjectMaterialAttentionSnapshot,
  next: NexoraObjectMaterialAttentionSnapshot,
): NexoraObjectMaterialAttentionSnapshotComparison {
  const prevMap = new Map(
    previous.responses.map((response) => [response.objectId, response] as const),
  );
  const nextMap = new Map(
    next.responses.map((response) => [response.objectId, response] as const),
  );
  const ids = [...new Set([...prevMap.keys(), ...nextMap.keys()])].sort(
    (a, b) => a.localeCompare(b),
  );

  const differences: NexoraObjectMaterialAttentionDifference[] = [];

  for (const objectId of ids) {
    const prev = prevMap.get(objectId);
    const nxt = nextMap.get(objectId);
    const interactionChanged =
      (prev?.interactionState ?? "Idle") !== (nxt?.interactionState ?? "Idle");
    const attentionChanged =
      (prev?.attentionState ?? "None") !== (nxt?.attentionState ?? "None");
    const dominantSignalChanged =
      (prev?.activeSignalIds[0] ?? "") !== (nxt?.activeSignalIds[0] ?? "");
    const emphasisChanged = (prev?.emphasis ?? "None") !== (nxt?.emphasis ?? "None");
    const layerChanged = (prev?.layer ?? "Normal") !== (nxt?.layer ?? "Normal");
    const glowChanged = (prev?.glow ?? "None") !== (nxt?.glow ?? "None");
    const pulseChanged =
      JSON.stringify(prev?.pulse ?? null) !==
      JSON.stringify(nxt?.pulse ?? null);
    const dimmingChanged = Boolean(prev?.dimmed) !== Boolean(nxt?.dimmed);
    const affordanceChanged =
      JSON.stringify(prev?.affordances ?? []) !==
      JSON.stringify(nxt?.affordances ?? []);
    const changed =
      interactionChanged ||
      attentionChanged ||
      dominantSignalChanged ||
      emphasisChanged ||
      layerChanged ||
      glowChanged ||
      pulseChanged ||
      dimmingChanged ||
      affordanceChanged;

    differences.push(
      deepFreeze({
        objectId,
        interactionChanged,
        attentionChanged,
        dominantSignalChanged,
        emphasisChanged,
        layerChanged,
        glowChanged,
        pulseChanged,
        dimmingChanged,
        affordanceChanged,
        changed,
      }),
    );
  }

  return deepFreeze({
    differences: Object.freeze(differences),
    interactionChanged: differences.some(
      (difference) => difference.interactionChanged,
    ),
    attentionChanged: differences.some(
      (difference) => difference.attentionChanged,
    ),
    glowOrPulseChanged: differences.some(
      (difference) => difference.glowChanged || difference.pulseChanged,
    ),
    dimmingChanged: differences.some((difference) => difference.dimmingChanged),
    affordanceChanged: differences.some(
      (difference) => difference.affordanceChanged,
    ),
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateNexoraObjectAttentionSignal(
  signal: NexoraObjectAttentionSignal,
): readonly NexoraObjectMaterialAttentionError[] {
  const errors: NexoraObjectMaterialAttentionError[] = [];

  if (!signal || typeof signal !== "object") {
    return Object.freeze([
      err("ATTENTION_INVALID_SIGNAL", "Attention signal must be an object."),
    ]);
  }
  if (typeof signal.signalId !== "string" || signal.signalId.length === 0) {
    errors.push(
      err("ATTENTION_INVALID_SIGNAL", "Attention signalId must be a non-empty string.", {
        signalId: signal.signalId,
      }),
    );
  }
  if (typeof signal.objectId !== "string" || signal.objectId.length === 0) {
    errors.push(
      err("ATTENTION_INVALID_SIGNAL", "Attention objectId must be a non-empty string.", {
        signalId: signal.signalId,
      }),
    );
  }
  if (!(ATTENTION_SOURCES as readonly string[]).includes(signal.source)) {
    errors.push(
      err("ATTENTION_INVALID_SIGNAL", `Unsupported attention source: ${String(signal.source)}.`, {
        signalId: signal.signalId,
        objectId: signal.objectId,
      }),
    );
  }
  if (!(ATTENTION_LEVELS as readonly string[]).includes(signal.level)) {
    errors.push(
      err("ATTENTION_INVALID_STATE", `Unsupported attention level: ${String(signal.level)}.`, {
        signalId: signal.signalId,
        objectId: signal.objectId,
      }),
    );
  }
  if (typeof signal.reason !== "string") {
    errors.push(
      err("ATTENTION_INVALID_SIGNAL", "Attention reason must be a string.", {
        signalId: signal.signalId,
        objectId: signal.objectId,
      }),
    );
  }
  if (!isFiniteNumber(signal.priority) || signal.priority < 0) {
    errors.push(
      err(
        "ATTENTION_INVALID_PRIORITY",
        "Attention priority must be a finite non-negative number.",
        {
          signalId: signal.signalId,
          objectId: signal.objectId,
          details: { priority: signal.priority },
        },
      ),
    );
  }
  if (typeof signal.persistent !== "boolean" || typeof signal.suppressible !== "boolean") {
    errors.push(
      err(
        "ATTENTION_INVALID_SIGNAL",
        "Attention persistent and suppressible flags must be booleans.",
        { signalId: signal.signalId, objectId: signal.objectId },
      ),
    );
  }
  if (!isValidIsoTimestamp(signal.createdAt)) {
    errors.push(
      err("ATTENTION_INVALID_TIMESTAMP", "Attention createdAt must be a valid ISO timestamp.", {
        signalId: signal.signalId,
        objectId: signal.objectId,
        details: { createdAt: signal.createdAt },
      }),
    );
  }
  if (signal.expiresAt !== undefined && !isValidIsoTimestamp(signal.expiresAt)) {
    errors.push(
      err("ATTENTION_INVALID_TIMESTAMP", "Attention expiresAt must be a valid ISO timestamp.", {
        signalId: signal.signalId,
        objectId: signal.objectId,
        details: { expiresAt: signal.expiresAt },
      }),
    );
  }
  if (!signal.payload || typeof signal.payload !== "object" || !isJsonSafe(signal.payload)) {
    errors.push(
      err("ATTENTION_INVALID_SIGNAL", "Attention payload must be JSON-safe.", {
        signalId: signal.signalId,
        objectId: signal.objectId,
      }),
    );
  }

  return Object.freeze(errors);
}

export function validateNexoraObjectInteractionSignal(
  signal: NexoraObjectInteractionSignal,
): readonly NexoraObjectMaterialAttentionError[] {
  const errors: NexoraObjectMaterialAttentionError[] = [];

  if (!signal || typeof signal !== "object") {
    return Object.freeze([
      err("ATTENTION_INVALID_SIGNAL", "Interaction signal must be an object."),
    ]);
  }
  if (typeof signal.signalId !== "string" || signal.signalId.length === 0) {
    errors.push(
      err("ATTENTION_INVALID_SIGNAL", "Interaction signalId must be a non-empty string."),
    );
  }
  if (typeof signal.objectId !== "string" || signal.objectId.length === 0) {
    errors.push(
      err("ATTENTION_INVALID_SIGNAL", "Interaction objectId must be a non-empty string.", {
        signalId: signal.signalId,
      }),
    );
  }
  if (!(INTERACTION_SIGNAL_TYPES as readonly string[]).includes(signal.type)) {
    errors.push(
      err("ATTENTION_INVALID_SIGNAL", `Unsupported interaction signal type: ${String(signal.type)}.`, {
        signalId: signal.signalId,
        objectId: signal.objectId,
      }),
    );
  }
  if (!(INTERACTION_SIGNAL_SOURCES as readonly string[]).includes(signal.source)) {
    errors.push(
      err("ATTENTION_INVALID_SIGNAL", `Unsupported interaction signal source: ${String(signal.source)}.`, {
        signalId: signal.signalId,
        objectId: signal.objectId,
      }),
    );
  }
  if (!isValidIsoTimestamp(signal.occurredAt)) {
    errors.push(
      err(
        "ATTENTION_INVALID_TIMESTAMP",
        "Interaction occurredAt must be a valid ISO timestamp.",
        {
          signalId: signal.signalId,
          objectId: signal.objectId,
          details: { occurredAt: signal.occurredAt },
        },
      ),
    );
  }
  if (!signal.payload || typeof signal.payload !== "object" || !isJsonSafe(signal.payload)) {
    errors.push(
      err("ATTENTION_INVALID_SIGNAL", "Interaction payload must be JSON-safe.", {
        signalId: signal.signalId,
        objectId: signal.objectId,
      }),
    );
  }

  return Object.freeze(errors);
}

export function validateNexoraObjectMaterialInteractionAttentionInput(
  input: NexoraObjectMaterialInteractionAttentionInput,
): readonly NexoraObjectMaterialAttentionError[] {
  const errors: NexoraObjectMaterialAttentionError[] = [];

  if (!input || typeof input !== "object") {
    return Object.freeze([
      err("ATTENTION_INVALID_INPUT", "Interaction attention input must be an object."),
    ]);
  }

  const objectId = input.representation?.objectId;
  if (typeof objectId !== "string" || objectId.length === 0) {
    errors.push(
      err("ATTENTION_INVALID_INPUT", "Representation objectId is required."),
    );
    return Object.freeze(errors);
  }

  if (input.materialState?.seedColor !== input.representation.material.color.seed) {
    errors.push(
      err(
        "ATTENTION_SEED_COLOR_CONFLICT",
        "Material state Seed color must match representation Seed color.",
        {
          objectId,
          details: {
            materialSeed: input.materialState?.seedColor,
            representationSeed: input.representation.material.color.seed,
          },
        },
      ),
    );
  }

  if (input.materialState?.material?.color?.seed !== input.representation.material.color.seed) {
    errors.push(
      err(
        "ATTENTION_SEED_COLOR_CONFLICT",
        "Nested material Seed color must match representation Seed color.",
        { objectId },
      ),
    );
  }

  if (input.transitionState?.objectId !== objectId) {
    errors.push(
      err(
        "ATTENTION_OBJECT_ID_MISMATCH",
        "Transition state objectId must match representation objectId.",
        {
          objectId,
          details: { transitionObjectId: input.transitionState?.objectId },
        },
      ),
    );
  }

  if (input.adaptiveRecommendation?.objectId !== objectId) {
    errors.push(
      err(
        "ATTENTION_OBJECT_ID_MISMATCH",
        "Adaptive recommendation objectId must match representation objectId.",
        {
          objectId,
          details: {
            adaptiveObjectId: input.adaptiveRecommendation?.objectId,
          },
        },
      ),
    );
  }

  if (!input.context || typeof input.context !== "object") {
    errors.push(err("ATTENTION_INVALID_INPUT", "Resolution context is required.", { objectId }));
  } else {
    if (!(CONTEXT_SOURCES as readonly string[]).includes(input.context.source)) {
      errors.push(
        err("ATTENTION_INVALID_INPUT", `Unsupported context source: ${String(input.context.source)}.`, {
          objectId,
        }),
      );
    }
    if (!(STAGE_DENSITIES as readonly string[]).includes(input.context.stageDensity)) {
      errors.push(
        err("ATTENTION_INVALID_INPUT", `Unsupported stage density: ${String(input.context.stageDensity)}.`, {
          objectId,
        }),
      );
    }
    if (!(STAGE_MODES as readonly string[]).includes(input.context.stageMode)) {
      errors.push(
        err("ATTENTION_INVALID_INPUT", `Unsupported stage mode: ${String(input.context.stageMode)}.`, {
          objectId,
        }),
      );
    }
    if (typeof input.context.reducedMotion !== "boolean") {
      errors.push(
        err("ATTENTION_INVALID_INPUT", "Context reducedMotion must be a boolean.", { objectId }),
      );
    }
    if (!isValidIsoTimestamp(input.context.currentTime)) {
      errors.push(
        err("ATTENTION_INVALID_TIMESTAMP", "Context currentTime must be a valid ISO timestamp.", {
          objectId,
          details: { currentTime: input.context.currentTime },
        }),
      );
    }
    if (
      input.context.attentionCooldownMs !== undefined &&
      !isFiniteNumber(input.context.attentionCooldownMs)
    ) {
      errors.push(
        err("ATTENTION_INVALID_INPUT", "Context attentionCooldownMs must be finite when provided.", {
          objectId,
        }),
      );
    }
  }

  const interactionSignals = input.interactionSignals ?? [];
  const attentionSignals = input.attentionSignals ?? [];
  const signalIds: string[] = [];

  for (const signal of interactionSignals) {
    errors.push(...validateNexoraObjectInteractionSignal(signal));
    if (signal.objectId !== objectId) {
      errors.push(
        err(
          "ATTENTION_OBJECT_ID_MISMATCH",
          "Interaction signal objectId must match representation objectId.",
          { objectId, signalId: signal.signalId, details: { signalObjectId: signal.objectId } },
        ),
      );
    }
    signalIds.push(signal.signalId);
  }

  for (const signal of attentionSignals) {
    errors.push(...validateNexoraObjectAttentionSignal(signal));
    if (signal.objectId !== objectId) {
      errors.push(
        err(
          "ATTENTION_OBJECT_ID_MISMATCH",
          "Attention signal objectId must match representation objectId.",
          { objectId, signalId: signal.signalId, details: { signalObjectId: signal.objectId } },
        ),
      );
    }
    signalIds.push(signal.signalId);
  }

  if (new Set(signalIds).size !== signalIds.length) {
    errors.push(
      err("ATTENTION_DUPLICATE_SIGNAL_ID", "Signal IDs must be unique within an input.", {
        objectId,
      }),
    );
  }

  if (!input.representation.visible) {
    const interactiveSignals = interactionSignals.filter((signal) =>
      (
        [
          "HoverEnter",
          "Select",
          "Focus",
          "OperationEnter",
        ] as readonly NexoraObjectInteractionSignal["type"][]
      ).includes(signal.type),
    );
    if (interactiveSignals.length > 0) {
      // Hidden objects may resolve to Disabled/Idle; warn via dedicated error only when Operation forced.
      const operationForced = interactiveSignals.some(
        (signal) => signal.type === "OperationEnter",
      );
      if (operationForced) {
        errors.push(
          err(
            "ATTENTION_HIDDEN_INTERACTION_FORBIDDEN",
            "Hidden representations cannot enter Operating interaction.",
            { objectId },
          ),
        );
      }
    }
  }

  return Object.freeze(errors);
}

export function validateNexoraObjectMaterialInteractionResponse(
  response: NexoraObjectMaterialInteractionResponse,
): readonly NexoraObjectMaterialAttentionError[] {
  const errors: NexoraObjectMaterialAttentionError[] = [];

  if (!response || typeof response !== "object") {
    return Object.freeze([
      err("ATTENTION_INVALID_STATE", "Interaction response must be an object."),
    ]);
  }

  if (typeof response.objectId !== "string" || response.objectId.length === 0) {
    errors.push(err("ATTENTION_INVALID_STATE", "Response objectId is required."));
  }
  if (!(INTERACTION_STATES as readonly string[]).includes(response.interactionState)) {
    errors.push(
      err("ATTENTION_INVALID_STATE", `Unsupported interaction state: ${String(response.interactionState)}.`, {
        objectId: response.objectId,
      }),
    );
  }
  if (!(ATTENTION_LEVELS as readonly string[]).includes(response.attentionState)) {
    errors.push(
      err("ATTENTION_INVALID_STATE", `Unsupported attention state: ${String(response.attentionState)}.`, {
        objectId: response.objectId,
      }),
    );
  }
  if (!response.materialState) {
    errors.push(
      err("ATTENTION_INVALID_STATE", "Response materialState is required.", {
        objectId: response.objectId,
      }),
    );
  } else if (
    response.materialState.seedColor !== response.materialState.material.color.seed
  ) {
    errors.push(
      err("ATTENTION_SEED_COLOR_CONFLICT", "Response Seed color facets disagree.", {
        objectId: response.objectId,
      }),
    );
  }

  if (!response.pulse || !isNonNegativeInteger(response.pulse.repetitions)) {
    errors.push(
      err("ATTENTION_INVALID_STATE", "Pulse repetitions must be a non-negative integer.", {
        objectId: response.objectId,
      }),
    );
  }
  if (
    response.pulse?.reducedMotionApplied &&
    response.pulse.repetitions > 0
  ) {
    errors.push(
      err(
        "ATTENTION_INVARIANT_VIOLATION",
        "Reduced motion must prevent repeated pulse.",
        { objectId: response.objectId },
      ),
    );
  }

  if (
    (response.interactionState === "Historical" ||
      response.interactionState === "Disabled") &&
    response.affordances.some(
      (descriptor) =>
        (MUTATION_AFFORDANCES as readonly string[]).includes(descriptor.affordance) &&
        descriptor.enabled,
    )
  ) {
    errors.push(
      err(
        "ATTENTION_HISTORICAL_MUTATION_FORBIDDEN",
        "Historical/Disabled responses must disable mutation affordances.",
        { objectId: response.objectId },
      ),
    );
  }

  return Object.freeze(errors);
}

export function assertNexoraObjectMaterialInteractionAttentionInvariants(
  input: NexoraObjectMaterialInteractionAttentionInput,
  result: NexoraObjectMaterialAttentionResult,
): void {
  const errors: NexoraObjectMaterialAttentionError[] = [
    ...validateNexoraObjectMaterialInteractionAttentionInput(input),
    ...validateNexoraObjectMaterialInteractionResponse(result.response),
  ];

  const objectId = input.representation.objectId;
  if (result.response.objectId !== objectId) {
    errors.push(
      err("ATTENTION_OBJECT_ID_MISMATCH", "Result objectId must match input objectId.", {
        objectId,
      }),
    );
  }

  if (
    result.response.materialState.seedColor !==
    input.representation.material.color.seed
  ) {
    errors.push(
      err("ATTENTION_SEED_COLOR_CONFLICT", "Attention must never change Seed color.", {
        objectId,
      }),
    );
  }

  if (
    result.response.interactionState === "Operating" &&
    input.representation.state !== "Operation" &&
    input.adaptiveRecommendation.recommendedState !== "Operation"
  ) {
    errors.push(
      err(
        "ATTENTION_INVARIANT_VIOLATION",
        "Operating state requires Operation representation.",
        { objectId },
      ),
    );
  }

  if (
    result.response.interactionState === "Focused" &&
    !input.representation.visible
  ) {
    errors.push(
      err(
        "ATTENTION_INVARIANT_VIOLATION",
        "Focused state requires visible representation.",
        { objectId },
      ),
    );
  }

  if (!input.representation.visible && result.response.interactionState === "Operating") {
    errors.push(
      err(
        "ATTENTION_HIDDEN_INTERACTION_FORBIDDEN",
        "Hidden representations are not interactive.",
        { objectId },
      ),
    );
  }

  for (const signalId of result.response.suppressedSignalIds) {
    const signal = result.plan.suppressedSignals.find(
      (candidate) => candidate.signalId === signalId,
    );
    if (
      signal &&
      (signal.level === "Immediate" ||
        (signal.source === "System" && signal.persistent))
    ) {
      errors.push(
        err(
          "ATTENTION_INVARIANT_VIOLATION",
          "Immediate safety signals are never suppressed.",
          { objectId, signalId },
        ),
      );
    }
  }

  if (result.response.pulse.reducedMotionApplied && result.response.pulse.repetitions !== 0) {
    errors.push(
      err(
        "ATTENTION_INVARIANT_VIOLATION",
        "Reduced motion prevents repeated pulse.",
        { objectId },
      ),
    );
  }

  if (
    (input.representation.material.color.seed === "Red" ||
      result.response.attentionState === "Critical" ||
      result.response.attentionState === "Immediate") &&
    input.adaptiveRecommendation.recommendedDensity === "Compact" &&
    result.response.materialState.seedColor !== input.representation.material.color.seed
  ) {
    errors.push(
      err(
        "ATTENTION_INVARIANT_VIOLATION",
        "Critical compact objects must retain visible status Seed.",
        { objectId },
      ),
    );
  }

  if (!Object.isFrozen(result) || !Object.isFrozen(result.response)) {
    errors.push(
      err(
        "ATTENTION_INVARIANT_VIOLATION",
        "All outputs must be deeply immutable.",
        { objectId },
      ),
    );
  }

  if (errors.length > 0) {
    throw new NexoraObjectMaterialInteractionAttentionException(errors[0]!);
  }
}

// ─── Serialization ──────────────────────────────────────────────────────────

function serializationEnvelope<T extends object>(
  payloadKey: string,
  payload: T,
): string {
  return JSON.stringify({
    engineIdentity: materialInteractionAttentionEngineIdentity,
    engineVersion: materialInteractionAttentionEngineVersion,
    schemaVersion: materialInteractionAttentionSchemaVersion,
    foundationIdentity: materialRepresentationFoundationIdentity,
    foundationSchemaVersion: materialRepresentationSchemaVersion,
    materialIdentity: materialStateResolutionModelIdentity,
    materialSchemaVersion: materialStateResolutionSchemaVersion,
    transitionIdentity: representationTransitionBehaviorEngineIdentity,
    transitionSchemaVersion: representationTransitionBehaviorSchemaVersion,
    adaptiveIdentity: representationContextAdaptiveDensityEngineIdentity,
    adaptiveSchemaVersion: representationContextAdaptiveDensitySchemaVersion,
    [payloadKey]: payload,
  });
}

function parseEnvelope<T>(
  json: string,
  payloadKey: string,
  missingCode: NexoraObjectMaterialAttentionErrorCode,
  missingMessage: string,
): T {
  let parsed: {
    readonly schemaVersion?: string;
    readonly [key: string]: unknown;
  };
  try {
    parsed = JSON.parse(json) as {
      readonly schemaVersion?: string;
      readonly [key: string]: unknown;
    };
  } catch {
    throw new NexoraObjectMaterialInteractionAttentionException(
      err("ATTENTION_INVALID_INPUT", "Serialized payload is not valid JSON."),
    );
  }

  if (parsed.schemaVersion !== materialInteractionAttentionSchemaVersion) {
    throw new NexoraObjectMaterialInteractionAttentionException(
      err(
        "ATTENTION_UNSUPPORTED_VERSION",
        `Unsupported attention schema: ${String(parsed.schemaVersion)}`,
        { details: { schemaVersion: parsed.schemaVersion } },
      ),
    );
  }

  const payload = parsed[payloadKey];
  if (!payload || typeof payload !== "object") {
    throw new NexoraObjectMaterialInteractionAttentionException(
      err(missingCode, missingMessage),
    );
  }
  return deepFreeze(payload as T);
}

export function serializeNexoraObjectAttentionSignal(
  signal: NexoraObjectAttentionSignal,
): string {
  const errors = validateNexoraObjectAttentionSignal(signal);
  if (errors.length > 0) {
    throw new NexoraObjectMaterialInteractionAttentionException(errors[0]!);
  }
  return serializationEnvelope("signal", {
    signalId: signal.signalId,
    objectId: signal.objectId,
    source: signal.source,
    level: signal.level,
    reason: signal.reason,
    priority: signal.priority,
    persistent: signal.persistent,
    suppressible: signal.suppressible,
    pathId: signal.pathId,
    correlationId: signal.correlationId,
    causationId: signal.causationId,
    createdAt: signal.createdAt,
    expiresAt: signal.expiresAt,
    payload: signal.payload,
  });
}

export function deserializeNexoraObjectAttentionSignal(
  json: string,
): NexoraObjectAttentionSignal {
  const signal = parseEnvelope<NexoraObjectAttentionSignal>(
    json,
    "signal",
    "ATTENTION_INVALID_SIGNAL",
    "Missing attention signal payload.",
  );
  const errors = validateNexoraObjectAttentionSignal(signal);
  if (errors.length > 0) {
    throw new NexoraObjectMaterialInteractionAttentionException(errors[0]!);
  }
  return signal;
}

export function serializeNexoraObjectMaterialInteractionResponse(
  response: NexoraObjectMaterialInteractionResponse,
): string {
  const errors = validateNexoraObjectMaterialInteractionResponse(response);
  if (errors.length > 0) {
    throw new NexoraObjectMaterialInteractionAttentionException(errors[0]!);
  }
  return serializationEnvelope("response", {
    objectId: response.objectId,
    interactionState: response.interactionState,
    attentionState: response.attentionState,
    materialState: response.materialState,
    emphasis: response.emphasis,
    layer: response.layer,
    glow: response.glow,
    outline: response.outline,
    dimmed: response.dimmed,
    pulse: response.pulse,
    affordances: response.affordances,
    activeSignalIds: response.activeSignalIds,
    suppressedSignalIds: response.suppressedSignalIds,
    reasons: response.reasons,
  });
}

export function deserializeNexoraObjectMaterialInteractionResponse(
  json: string,
): NexoraObjectMaterialInteractionResponse {
  const response = parseEnvelope<NexoraObjectMaterialInteractionResponse>(
    json,
    "response",
    "ATTENTION_INVALID_STATE",
    "Missing interaction response payload.",
  );
  const errors = validateNexoraObjectMaterialInteractionResponse(response);
  if (errors.length > 0) {
    throw new NexoraObjectMaterialInteractionAttentionException(errors[0]!);
  }
  return response;
}

export function serializeNexoraObjectMaterialAttentionRecord(
  record: NexoraObjectMaterialAttentionRecord,
): string {
  return serializationEnvelope("record", {
    recordId: record.recordId,
    objectId: record.objectId,
    interactionState: record.interactionState,
    attentionState: record.attentionState,
    dominantSignalId: record.dominantSignalId,
    activeSignalIds: record.activeSignalIds,
    suppressedSignalIds: record.suppressedSignalIds,
    occurredAt: record.occurredAt,
    source: record.source,
    reasons: record.reasons,
  });
}

export function deserializeNexoraObjectMaterialAttentionRecord(
  json: string,
): NexoraObjectMaterialAttentionRecord {
  const record = parseEnvelope<NexoraObjectMaterialAttentionRecord>(
    json,
    "record",
    "ATTENTION_INVALID_STATE",
    "Missing attention record payload.",
  );
  if (!isValidIsoTimestamp(record.occurredAt)) {
    throw new NexoraObjectMaterialInteractionAttentionException(
      err(
        "ATTENTION_INVALID_TIMESTAMP",
        "Attention record occurredAt must be a valid ISO timestamp.",
        { objectId: record.objectId },
      ),
    );
  }
  return record;
}

export function serializeNexoraObjectMaterialAttentionSnapshot(
  snapshot: NexoraObjectMaterialAttentionSnapshot,
): string {
  return serializationEnvelope("snapshot", {
    snapshotId: snapshot.snapshotId,
    createdAt: snapshot.createdAt,
    responses: snapshot.responses,
  });
}

export function deserializeNexoraObjectMaterialAttentionSnapshot(
  json: string,
): NexoraObjectMaterialAttentionSnapshot {
  const snapshot = parseEnvelope<NexoraObjectMaterialAttentionSnapshot>(
    json,
    "snapshot",
    "ATTENTION_INVALID_STATE",
    "Missing attention snapshot payload.",
  );
  if (!isValidIsoTimestamp(snapshot.createdAt)) {
    throw new NexoraObjectMaterialInteractionAttentionException(
      err(
        "ATTENTION_INVALID_TIMESTAMP",
        "Attention snapshot createdAt must be a valid ISO timestamp.",
      ),
    );
  }
  for (const response of snapshot.responses) {
    const errors = validateNexoraObjectMaterialInteractionResponse(response);
    if (errors.length > 0) {
      throw new NexoraObjectMaterialInteractionAttentionException(errors[0]!);
    }
  }
  return snapshot;
}

// ─── Summary / facade ───────────────────────────────────────────────────────

export function getNexoraObjectMaterialInteractionAttentionEngineSummary() {
  return Object.freeze({
    identity: materialInteractionAttentionEngineIdentity,
    version: materialInteractionAttentionEngineVersion,
    schemaVersion: materialInteractionAttentionSchemaVersion,
    upstream: NOL_MATERIAL_ATTENTION_UPSTREAM,
    frameworkIndependent: true,
    rendererIndependent: true,
    noBusinessMutation: true,
    seedColorsImmutable: true,
  });
}

export const NexoraObjectMaterialInteractionAttentionEngine = Object.freeze({
  identity: materialInteractionAttentionEngineIdentity,
  version: materialInteractionAttentionEngineVersion,
  schemaVersion: materialInteractionAttentionSchemaVersion,
  resolveInteractionState: resolveNexoraObjectMaterialInteractionState,
  resolveAttentionState: resolveNexoraObjectMaterialAttentionState,
  resolveSourcePriority: resolveNexoraObjectAttentionSourcePriority,
  resolveInteractionMaterialState: resolveNexoraObjectInteractionMaterialState,
  resolveBackgroundDimming: resolveNexoraObjectBackgroundDimming,
  resolveSuppression: resolveNexoraObjectAttentionSuppression,
  resolveAttentionPath: resolveNexoraObjectAttentionPath,
  allocateBudget: allocateNexoraObjectAttentionBudget,
  recommendBehaviors: recommendNexoraObjectAttentionBehaviors,
  resolve: resolveNexoraObjectMaterialInteractionAttention,
  resolveCollection: resolveNexoraObjectMaterialInteractionAttentionCollection,
  clearSignals: clearNexoraObjectAttentionSignals,
  reset: resetNexoraObjectMaterialInteractionAttention,
  createRecord: createNexoraObjectMaterialAttentionRecord,
  projectHistory: projectNexoraObjectMaterialAttentionHistory,
  createSnapshot: createNexoraObjectMaterialAttentionSnapshot,
  compareSnapshots: compareNexoraObjectMaterialAttentionSnapshots,
  validateAttentionSignal: validateNexoraObjectAttentionSignal,
  validateInteractionSignal: validateNexoraObjectInteractionSignal,
  validateInput: validateNexoraObjectMaterialInteractionAttentionInput,
  validateResponse: validateNexoraObjectMaterialInteractionResponse,
  assertInvariants: assertNexoraObjectMaterialInteractionAttentionInvariants,
  serializeAttentionSignal: serializeNexoraObjectAttentionSignal,
  deserializeAttentionSignal: deserializeNexoraObjectAttentionSignal,
  serializeResponse: serializeNexoraObjectMaterialInteractionResponse,
  deserializeResponse: deserializeNexoraObjectMaterialInteractionResponse,
  serializeRecord: serializeNexoraObjectMaterialAttentionRecord,
  deserializeRecord: deserializeNexoraObjectMaterialAttentionRecord,
  serializeSnapshot: serializeNexoraObjectMaterialAttentionSnapshot,
  deserializeSnapshot: deserializeNexoraObjectMaterialAttentionSnapshot,
  summary: getNexoraObjectMaterialInteractionAttentionEngineSummary,
});
