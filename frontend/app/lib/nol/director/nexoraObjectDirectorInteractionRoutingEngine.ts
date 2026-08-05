/**
 * NOL-3:4 — NexoraObject Director Interaction Routing Engine
 *
 * Canonical interaction routing between Director scene bindings and semantic
 * actions. Produces routing plans and queues only — no renderer execution.
 *
 * Upstream: NOL-3:1, NOL-3:2, and NOL-3:3 only.
 * Identity: NOL-3:4/NexoraObjectDirectorInteractionRoutingEngine
 */

import {
  createNexoraDirectorSceneObjectId,
  nexoraObjectDirectorIntegrationFoundationIdentity,
  projectNexoraDirectorEventRoutes,
  type NexoraDirectorEventRoute,
  type NexoraObjectDirectorIntegrationPackage,
} from "./nexoraObjectDirectorIntegrationFoundation.ts";
import {
  directorSceneBindingModelIdentity,
  type NexoraDirectorSceneBinding,
} from "./nexoraObjectDirectorSceneBindingModel.ts";
import {
  nexoraObjectDirectorSceneSynchronizationEngineIdentity,
} from "./nexoraObjectDirectorSceneSynchronizationEngine.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraObjectDirectorInteractionRoutingEngineIdentity =
  "NOL-3:4/NexoraObjectDirectorInteractionRoutingEngine" as const;

export const nexoraObjectDirectorInteractionRoutingEngineVersion =
  "1.0.0" as const;

export const nexoraObjectDirectorInteractionRoutingSchemaVersion =
  "1.0.0" as const;

export const NOL_DIRECTOR_INTERACTION_ROUTING_IDENTITY =
  nexoraObjectDirectorInteractionRoutingEngineIdentity;
export const NOL_DIRECTOR_INTERACTION_ROUTING_VERSION =
  nexoraObjectDirectorInteractionRoutingEngineVersion;
export const NOL_DIRECTOR_INTERACTION_ROUTING_SCHEMA_VERSION =
  nexoraObjectDirectorInteractionRoutingSchemaVersion;

export const NOL_DIRECTOR_INTERACTION_ROUTING_UPSTREAM = Object.freeze([
  nexoraObjectDirectorIntegrationFoundationIdentity,
  directorSceneBindingModelIdentity,
  nexoraObjectDirectorSceneSynchronizationEngineIdentity,
] as const);

// ─── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_PRIORITY: Readonly<
  Record<NexoraDirectorInteractionType, number>
> = Object.freeze({
  Focus: 100,
  Unfocus: 100,
  Select: 100,
  Deselect: 100,
  OpenOperation: 100,
  DoubleClick: 95,
  OpenReport: 90,
  Inspect: 50,
  ContextMenu: 50,
  TimelineJump: 50,
  RelationshipInspect: 50,
  DragStart: 20,
  Drag: 20,
  DragEnd: 20,
  Hover: 10,
  HoverEnd: 10,
  Keyboard: 5,
  System: 0,
});

const EXECUTION_INTERACTION_TYPES = Object.freeze(
  new Set<NexoraDirectorInteractionType>([
    "Select",
    "Deselect",
    "Focus",
    "Unfocus",
    "OpenOperation",
    "DragStart",
    "Drag",
    "DragEnd",
    "DoubleClick",
  ]),
);

const INSPECTION_SAFE_INTERACTION_TYPES = Object.freeze(
  new Set<NexoraDirectorInteractionType>([
    "Hover",
    "HoverEnd",
    "Inspect",
    "OpenReport",
    "TimelineJump",
    "RelationshipInspect",
    "ContextMenu",
    "System",
  ]),
);

const EXECUTION_SEMANTIC_ACTIONS = Object.freeze(
  new Set<NexoraDirectorSemanticAction>([
    "SelectObject",
    "FocusObject",
    "OpenOperation",
    "BeginOperation",
    "ExpandCluster",
    "CollapseCluster",
    "CancelOperation",
  ]),
);

const INTERACTION_TO_EVENT_ROUTE = Object.freeze({
  Hover: "Hover",
  Select: "Select",
  Deselect: "Select",
  Focus: "Focus",
  Unfocus: "Focus",
  OpenReport: "OpenReport",
  OpenOperation: "OpenOperation",
  DoubleClick: "OpenReport",
  RelationshipInspect: "InspectRelationship",
  TimelineJump: "InspectTimeline",
} as const satisfies Partial<
  Record<NexoraDirectorInteractionType, NexoraDirectorEventRoute["event"]>
>);

const SEMANTIC_PERMISSIONS: Readonly<
  Record<NexoraDirectorSemanticAction, readonly string[]>
> = Object.freeze({
  FocusObject: Object.freeze(["focusable"]),
  SelectObject: Object.freeze(["selectable"]),
  OpenReport: Object.freeze(["inspectable"]),
  OpenOperation: Object.freeze(["operable"]),
  OpenPack: Object.freeze(["inspectable"]),
  OpenTimeline: Object.freeze(["inspectable"]),
  InspectRelationship: Object.freeze(["inspectable"]),
  InspectObject: Object.freeze(["inspectable"]),
  ExpandCluster: Object.freeze(["selectable"]),
  CollapseCluster: Object.freeze(["selectable"]),
  HighlightAttention: Object.freeze([]),
  BeginOperation: Object.freeze(["operable"]),
  CancelOperation: Object.freeze(["operable"]),
  ShowHistory: Object.freeze(["inspectable"]),
  RevealNeighbors: Object.freeze(["inspectable"]),
  None: Object.freeze([]),
});

// ─── Types ──────────────────────────────────────────────────────────────────

export type NexoraDirectorInteractionType =
  | "Hover"
  | "HoverEnd"
  | "Select"
  | "Deselect"
  | "Focus"
  | "Unfocus"
  | "Inspect"
  | "OpenReport"
  | "OpenOperation"
  | "DoubleClick"
  | "ContextMenu"
  | "DragStart"
  | "Drag"
  | "DragEnd"
  | "TimelineJump"
  | "RelationshipInspect"
  | "Keyboard"
  | "System";

export type NexoraDirectorInteractionTarget =
  | "Runtime"
  | "Workspace"
  | "Advisor"
  | "Timeline"
  | "Explorer"
  | "Director"
  | "System";

export type NexoraDirectorSemanticAction =
  | "FocusObject"
  | "SelectObject"
  | "OpenReport"
  | "OpenOperation"
  | "OpenPack"
  | "OpenTimeline"
  | "InspectRelationship"
  | "InspectObject"
  | "ExpandCluster"
  | "CollapseCluster"
  | "HighlightAttention"
  | "BeginOperation"
  | "CancelOperation"
  | "ShowHistory"
  | "RevealNeighbors"
  | "None";

export type NexoraDirectorInteractionPermission =
  | "Allowed"
  | "ReadOnly"
  | "Disabled"
  | "Hidden"
  | "Historical"
  | "Locked";

export interface NexoraDirectorInteractionEvent {
  readonly eventId: string;
  readonly interactionType: NexoraDirectorInteractionType;
  readonly objectId: string;
  readonly sceneObjectId: string;
  readonly bindingId: string;
  readonly timestamp: string;
  readonly source:
    | "Director"
    | "Workspace"
    | "Advisor"
    | "Timeline"
    | "Explorer"
    | "System";
  readonly modifiers: Readonly<Record<string, unknown>>;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly priority: number;
}

export interface NexoraDirectorInteractionRoutingPlan {
  readonly planId: string;
  readonly accepted: boolean;
  readonly priority: number;
  readonly interaction: NexoraDirectorInteractionEvent;
  readonly semanticAction: NexoraDirectorSemanticAction;
  readonly target: NexoraDirectorInteractionTarget;
  readonly permission: NexoraDirectorInteractionPermission;
  readonly requiredPermissions: readonly string[];
  readonly warnings: readonly NexoraDirectorInteractionRoutingWarning[];
  readonly errors: readonly NexoraDirectorInteractionRoutingError[];
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorInteractionRoutingQueue {
  readonly queueId: string;
  readonly plans: readonly NexoraDirectorInteractionRoutingPlan[];
}

export interface NexoraDirectorInteractionRoutingSnapshot {
  readonly snapshotId: string;
  readonly queue: NexoraDirectorInteractionRoutingQueue;
  readonly createdAt: string;
}

export interface NexoraDirectorInteractionRoutingContext {
  readonly integrationPackage: NexoraObjectDirectorIntegrationPackage;
  readonly binding: NexoraDirectorSceneBinding;
  readonly synchronizationRevision?: number;
  readonly locked?: boolean;
  readonly allowHistoricalInspection?: boolean;
}

export interface NexoraDirectorInteractionInput {
  readonly eventId?: string;
  readonly interactionType: NexoraDirectorInteractionType;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly bindingId?: string;
  readonly timestamp?: string;
  readonly source?: NexoraDirectorInteractionEvent["source"];
  readonly modifiers?: Readonly<Record<string, unknown>>;
  readonly payload?: Readonly<Record<string, unknown>>;
  readonly priority?: number;
}

export interface NexoraDirectorInteractionRoutingDependencies {
  readonly now: () => string;
  readonly createEventId: () => string;
  readonly createPlanId: () => string;
  readonly createQueueId: () => string;
  readonly createSnapshotId: () => string;
}

export interface NexoraDirectorInteractionRoutingBatchRequest {
  readonly items: readonly {
    readonly eventOrInput: NexoraDirectorInteractionEvent | NexoraDirectorInteractionInput;
    readonly context: NexoraDirectorInteractionRoutingContext;
  }[];
  readonly mode: "Atomic" | "BestEffort";
}

export interface NexoraDirectorInteractionRoutingBatchResult {
  readonly accepted: boolean;
  readonly mode: "Atomic" | "BestEffort";
  readonly plans: readonly NexoraDirectorInteractionRoutingPlan[];
  readonly acceptedEventIds: readonly string[];
  readonly rejectedEventIds: readonly string[];
  readonly errors: readonly NexoraDirectorInteractionRoutingError[];
  readonly warnings: readonly NexoraDirectorInteractionRoutingWarning[];
}

export interface NexoraDirectorInteractionRoutingSimulationOptions {
  readonly stopOnFailure?: boolean;
}

export type NexoraDirectorInteractionRoutingWarningCode =
  | "DIRECTOR_ROUTING_READ_ONLY_INSPECTION"
  | "DIRECTOR_ROUTING_LOCKED_INSPECTION_ONLY"
  | "DIRECTOR_ROUTING_HISTORICAL_INSPECTION"
  | "DIRECTOR_ROUTING_FLAG_DISABLED"
  | "DIRECTOR_ROUTING_BEST_EFFORT_PARTIAL";

export interface NexoraDirectorInteractionRoutingWarning {
  readonly code: NexoraDirectorInteractionRoutingWarningCode;
  readonly message: string;
  readonly eventId?: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export type NexoraDirectorInteractionRoutingErrorCode =
  | "DIRECTOR_ROUTING_INVALID_EVENT"
  | "DIRECTOR_ROUTING_INVALID_PLAN"
  | "DIRECTOR_ROUTING_INVALID_CONTEXT"
  | "DIRECTOR_ROUTING_PERMISSION_DENIED"
  | "DIRECTOR_ROUTING_INTERACTION_NOT_ALLOWED"
  | "DIRECTOR_ROUTING_INVARIANT_VIOLATION"
  | "DIRECTOR_ROUTING_RENDERER_OBJECT_FORBIDDEN"
  | "DIRECTOR_ROUTING_UNSUPPORTED_VERSION"
  | "DIRECTOR_ROUTING_ATOMIC_REJECTED";

export interface NexoraDirectorInteractionRoutingError {
  readonly code: NexoraDirectorInteractionRoutingErrorCode;
  readonly message: string;
  readonly eventId?: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export class NexoraObjectDirectorInteractionRoutingException extends Error {
  readonly code: NexoraDirectorInteractionRoutingErrorCode;
  readonly eventId?: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraDirectorInteractionRoutingError) {
    super(error.message);
    this.name = "NexoraObjectDirectorInteractionRoutingException";
    this.code = error.code;
    this.eventId = error.eventId;
    this.objectId = error.objectId;
    this.sceneObjectId = error.sceneObjectId;
    this.details = error.details;
  }
}

export type NexoraDirectorInteractionRoutingValidationResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly errors: readonly NexoraDirectorInteractionRoutingError[];
    };

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

function isDeeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object") return true;
  if (seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  if (Array.isArray(value)) {
    return value.every((item) => isDeeplyFrozen(item, seen));
  }
  return Object.values(value as Record<string, unknown>).every((item) =>
    isDeeplyFrozen(item, seen),
  );
}

function isJsonSafe(value: unknown, seen = new Set<object>()): boolean {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  ) {
    return typeof value !== "number" || Number.isFinite(value);
  }
  if (typeof value === "function" || typeof value === "symbol") return false;
  if (typeof value !== "object") return false;
  if (seen.has(value as object)) return true;
  seen.add(value as object);
  if (Array.isArray(value)) {
    return value.every((item) => isJsonSafe(item, seen));
  }
  return Object.values(value as Record<string, unknown>).every((item) =>
    isJsonSafe(item, seen),
  );
}

function containsForbiddenRendererKeys(
  value: unknown,
  path = "",
): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "function") return path || "<root>";
  if (typeof value !== "object") return null;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      const found = containsForbiddenRendererKeys(value[i], `${path}[${i}]`);
      if (found) return found;
    }
    return null;
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    const lower = key.toLowerCase();
    if (
      lower.includes("mesh") ||
      lower.includes("three") ||
      lower.includes("webgl") ||
      lower.includes("webgpu") ||
      lower.includes("html") ||
      lower.includes("dom") ||
      lower.includes("react") ||
      lower === "geometryref" ||
      lower === "materialref" ||
      lower === "sceneref" ||
      lower === "camerainstance" ||
      lower === "coordinates" ||
      lower === "worldposition" ||
      lower === "matrix4" ||
      lower === "vector3"
    ) {
      return path ? `${path}.${key}` : key;
    }
    const found = containsForbiddenRendererKeys(
      record[key],
      path ? `${path}.${key}` : key,
    );
    if (found) return found;
  }
  return null;
}

function err(
  code: NexoraDirectorInteractionRoutingErrorCode,
  message: string,
  extras?: Partial<NexoraDirectorInteractionRoutingError>,
): NexoraDirectorInteractionRoutingError {
  return Object.freeze({ code, message, ...extras });
}

function warn(
  code: NexoraDirectorInteractionRoutingWarningCode,
  message: string,
  extras?: Partial<NexoraDirectorInteractionRoutingWarning>,
): NexoraDirectorInteractionRoutingWarning {
  return Object.freeze({ code, message, ...extras });
}

function throwRouting(error: NexoraDirectorInteractionRoutingError): never {
  throw new NexoraObjectDirectorInteractionRoutingException(error);
}

export function defaultDeps(): NexoraDirectorInteractionRoutingDependencies {
  let seq = 0;
  return Object.freeze({
    now: () => new Date().toISOString(),
    createEventId: () => {
      seq += 1;
      return `dir-route-evt:${seq}`;
    },
    createPlanId: () => {
      seq += 1;
      return `dir-route-plan:${seq}`;
    },
    createQueueId: () => {
      seq += 1;
      return `dir-route-queue:${seq}`;
    },
    createSnapshotId: () => {
      seq += 1;
      return `dir-route-snap:${seq}`;
    },
  });
}

function resolveDeps(
  dependencies?: NexoraDirectorInteractionRoutingDependencies,
): NexoraDirectorInteractionRoutingDependencies {
  return dependencies ?? defaultDeps();
}

function isHistoricalLifecycle(
  pkg: NexoraObjectDirectorIntegrationPackage,
  binding: NexoraDirectorSceneBinding,
): boolean {
  if (pkg.interaction.state === "Historical") return true;
  if (binding.metadata.lifecycle === "Historical") return true;
  if (pkg.metadata.correlationId === "historical") return true;
  return false;
}

function defaultTargetForType(
  interactionType: NexoraDirectorInteractionType,
): NexoraDirectorInteractionTarget {
  switch (interactionType) {
    case "Hover":
    case "HoverEnd":
    case "ContextMenu":
    case "DragStart":
    case "Drag":
    case "DragEnd":
    case "Keyboard":
      return "Director";
    case "Select":
    case "Deselect":
    case "Focus":
    case "Unfocus":
    case "OpenReport":
      return "Workspace";
    case "Inspect":
    case "RelationshipInspect":
      return "Advisor";
    case "OpenOperation":
    case "DoubleClick":
      return "Runtime";
    case "TimelineJump":
      return "Timeline";
    case "System":
      return "System";
    default:
      return "Director";
  }
}

function defaultSemanticActionForType(
  interactionType: NexoraDirectorInteractionType,
  pkg: NexoraObjectDirectorIntegrationPackage,
): NexoraDirectorSemanticAction {
  switch (interactionType) {
    case "Hover":
      return "HighlightAttention";
    case "HoverEnd":
    case "DragStart":
    case "Drag":
    case "DragEnd":
    case "Keyboard":
      return "None";
    case "Select":
      return "SelectObject";
    case "Deselect":
      return "SelectObject";
    case "Focus":
    case "Unfocus":
      return "FocusObject";
    case "Inspect":
    case "ContextMenu":
      return "InspectObject";
    case "OpenReport":
      return "OpenReport";
    case "OpenOperation":
      return pkg.interaction.operable ? "BeginOperation" : "OpenOperation";
    case "DoubleClick":
      if (pkg.sceneObject.representationState === "Operation") {
        return pkg.interaction.operable ? "BeginOperation" : "OpenOperation";
      }
      return "OpenReport";
    case "TimelineJump":
      return "OpenTimeline";
    case "RelationshipInspect":
      return "InspectRelationship";
    case "System":
      return "None";
    default:
      return "None";
  }
}

function resolveTargetForDoubleClick(
  pkg: NexoraObjectDirectorIntegrationPackage,
): NexoraDirectorInteractionTarget {
  if (pkg.sceneObject.representationState === "Operation") {
    return "Runtime";
  }
  return "Workspace";
}

function packageFlagSatisfied(
  pkg: NexoraObjectDirectorIntegrationPackage,
  flag: string,
): boolean {
  switch (flag) {
    case "selectable":
      return pkg.interaction.selectable;
    case "focusable":
      return pkg.interaction.focusable;
    case "operable":
      return pkg.interaction.operable;
    case "inspectable":
      return pkg.interaction.inspectable;
    default:
      return true;
  }
}

function isInspectionInteraction(
  interactionType: NexoraDirectorInteractionType,
): boolean {
  return (INSPECTION_SAFE_INTERACTION_TYPES as ReadonlySet<string>).has(
    interactionType,
  );
}

function isExecutionInteraction(
  interactionType: NexoraDirectorInteractionType,
): boolean {
  return (EXECUTION_INTERACTION_TYPES as ReadonlySet<string>).has(
    interactionType,
  );
}

function permissionWarnings(
  permission: NexoraDirectorInteractionPermission,
  event: NexoraDirectorInteractionEvent,
): NexoraDirectorInteractionRoutingWarning[] {
  switch (permission) {
    case "ReadOnly":
      return [
        warn(
          "DIRECTOR_ROUTING_READ_ONLY_INSPECTION",
          "Read-only object allows inspection interactions only.",
          {
            eventId: event.eventId,
            objectId: event.objectId,
            sceneObjectId: event.sceneObjectId,
          },
        ),
      ];
    case "Locked":
      return [
        warn(
          "DIRECTOR_ROUTING_LOCKED_INSPECTION_ONLY",
          "Locked object rejects execution actions.",
          {
            eventId: event.eventId,
            objectId: event.objectId,
            sceneObjectId: event.sceneObjectId,
          },
        ),
      ];
    case "Historical":
      return [
        warn(
          "DIRECTOR_ROUTING_HISTORICAL_INSPECTION",
          "Historical object allows inspection-safe interactions only.",
          {
            eventId: event.eventId,
            objectId: event.objectId,
            sceneObjectId: event.sceneObjectId,
          },
        ),
      ];
    default:
      return [];
  }
}

function evaluateAcceptance(
  interactionType: NexoraDirectorInteractionType,
  semanticAction: NexoraDirectorSemanticAction,
  permission: NexoraDirectorInteractionPermission,
  pkg: NexoraObjectDirectorIntegrationPackage,
  context: NexoraDirectorInteractionRoutingContext,
): {
  readonly accepted: boolean;
  readonly errors: readonly NexoraDirectorInteractionRoutingError[];
  readonly warnings: readonly NexoraDirectorInteractionRoutingWarning[];
} {
  const errors: NexoraDirectorInteractionRoutingError[] = [];
  const warnings: NexoraDirectorInteractionRoutingWarning[] = [];

  if (permission === "Hidden") {
    errors.push(
      err(
        "DIRECTOR_ROUTING_PERMISSION_DENIED",
        "Hidden objects reject all interactions.",
        { objectId: pkg.objectId, sceneObjectId: pkg.sceneObject.sceneObjectId },
      ),
    );
    return { accepted: false, errors: Object.freeze(errors), warnings: Object.freeze(warnings) };
  }

  if (permission === "Disabled") {
    if (interactionType !== "System") {
      errors.push(
        err(
          "DIRECTOR_ROUTING_PERMISSION_DENIED",
          "Disabled objects reject all interactions except System.",
          {
            objectId: pkg.objectId,
            sceneObjectId: pkg.sceneObject.sceneObjectId,
          },
        ),
      );
      return { accepted: false, errors: Object.freeze(errors), warnings: Object.freeze(warnings) };
    }
    return { accepted: true, errors: Object.freeze(errors), warnings: Object.freeze(warnings) };
  }

  if (permission === "Locked") {
    if (
      isExecutionInteraction(interactionType) ||
      (EXECUTION_SEMANTIC_ACTIONS as ReadonlySet<string>).has(semanticAction)
    ) {
      errors.push(
        err(
          "DIRECTOR_ROUTING_PERMISSION_DENIED",
          "Locked objects reject execution actions.",
          {
            objectId: pkg.objectId,
            sceneObjectId: pkg.sceneObject.sceneObjectId,
            details: { interactionType, semanticAction },
          },
        ),
      );
      return { accepted: false, errors: Object.freeze(errors), warnings: Object.freeze(warnings) };
    }
    if (!isInspectionInteraction(interactionType)) {
      errors.push(
        err(
          "DIRECTOR_ROUTING_PERMISSION_DENIED",
          "Locked objects allow inspection interactions only.",
          {
            objectId: pkg.objectId,
            sceneObjectId: pkg.sceneObject.sceneObjectId,
          },
        ),
      );
      return { accepted: false, errors: Object.freeze(errors), warnings: Object.freeze(warnings) };
    }
  }

  if (permission === "ReadOnly" || permission === "Historical") {
    const allowHistorical =
      context.allowHistoricalInspection !== false;
    if (permission === "Historical" && !allowHistorical) {
      errors.push(
        err(
          "DIRECTOR_ROUTING_PERMISSION_DENIED",
          "Historical inspection is disabled for this context.",
          {
            objectId: pkg.objectId,
            sceneObjectId: pkg.sceneObject.sceneObjectId,
          },
        ),
      );
      return { accepted: false, errors: Object.freeze(errors), warnings: Object.freeze(warnings) };
    }

    if (
      isExecutionInteraction(interactionType) ||
      interactionType === "Deselect" ||
      (EXECUTION_SEMANTIC_ACTIONS as ReadonlySet<string>).has(semanticAction)
    ) {
      errors.push(
        err(
          "DIRECTOR_ROUTING_PERMISSION_DENIED",
          "Read-only and historical objects reject execution actions.",
          {
            objectId: pkg.objectId,
            sceneObjectId: pkg.sceneObject.sceneObjectId,
            details: { permission, interactionType },
          },
        ),
      );
      return { accepted: false, errors: Object.freeze(errors), warnings: Object.freeze(warnings) };
    }

    if (!isInspectionInteraction(interactionType)) {
      errors.push(
        err(
          "DIRECTOR_ROUTING_INTERACTION_NOT_ALLOWED",
          "Only inspection-safe interactions are allowed.",
          {
            objectId: pkg.objectId,
            sceneObjectId: pkg.sceneObject.sceneObjectId,
          },
        ),
      );
      return { accepted: false, errors: Object.freeze(errors), warnings: Object.freeze(warnings) };
    }
  }

  if (permission === "Allowed") {
    const required = SEMANTIC_PERMISSIONS[semanticAction];
    for (const flag of required) {
      if (!packageFlagSatisfied(pkg, flag)) {
        errors.push(
          err(
            "DIRECTOR_ROUTING_INTERACTION_NOT_ALLOWED",
            `Interaction requires ${flag}.`,
            {
              objectId: pkg.objectId,
              sceneObjectId: pkg.sceneObject.sceneObjectId,
              details: { flag, semanticAction },
            },
          ),
        );
        warnings.push(
          warn(
            "DIRECTOR_ROUTING_FLAG_DISABLED",
            `Package flag ${flag} is disabled.`,
            {
              objectId: pkg.objectId,
              sceneObjectId: pkg.sceneObject.sceneObjectId,
            },
          ),
        );
        return { accepted: false, errors: Object.freeze(errors), warnings: Object.freeze(warnings) };
      }
    }
  }

  return { accepted: true, errors: Object.freeze(errors), warnings: Object.freeze(warnings) };
}

// ─── Public APIs ────────────────────────────────────────────────────────────

export function evaluateInteractionPermission(
  context: NexoraDirectorInteractionRoutingContext,
): NexoraDirectorInteractionPermission {
  const pkg = context.integrationPackage;
  const { sceneObject, interaction, rendering } = pkg;

  if (!sceneObject.visible || rendering.renderingLevel === "Hidden") {
    return "Hidden";
  }
  if (context.locked === true) {
    return "Locked";
  }
  if (interaction.state === "Disabled") {
    return "Disabled";
  }
  if (isHistoricalLifecycle(pkg, context.binding)) {
    return "Historical";
  }
  if (sceneObject.readOnly) {
    return "ReadOnly";
  }
  return "Allowed";
}

export function resolveInteractionTarget(
  interactionType: NexoraDirectorInteractionType,
  context: NexoraDirectorInteractionRoutingContext,
): NexoraDirectorInteractionTarget {
  void context;
  if (interactionType === "DoubleClick") {
    return resolveTargetForDoubleClick(context.integrationPackage);
  }
  if (interactionType === "OpenOperation") {
    return "Runtime";
  }
  return defaultTargetForType(interactionType);
}

export function resolveSemanticAction(
  interactionType: NexoraDirectorInteractionType,
  context: NexoraDirectorInteractionRoutingContext,
): NexoraDirectorSemanticAction {
  return defaultSemanticActionForType(
    interactionType,
    context.integrationPackage,
  );
}

export function normalizeDirectorInteraction(
  input: NexoraDirectorInteractionInput,
  context: NexoraDirectorInteractionRoutingContext,
  dependencies?: NexoraDirectorInteractionRoutingDependencies,
): NexoraDirectorInteractionEvent {
  const deps = resolveDeps(dependencies);
  const pkg = context.integrationPackage;
  const binding = context.binding;

  const objectId = input.objectId ?? pkg.objectId ?? binding.objectId;
  const sceneObjectId =
    input.sceneObjectId ??
    pkg.sceneObject.sceneObjectId ??
    binding.sceneObjectId ??
    createNexoraDirectorSceneObjectId(objectId);
  const bindingId = input.bindingId ?? binding.bindingId;
  const priority =
    input.priority ?? DEFAULT_PRIORITY[input.interactionType] ?? 0;

  let payload = input.payload ?? {};
  if (input.interactionType === "Deselect") {
    payload = { ...payload, deselect: true };
  }
  if (input.interactionType === "Unfocus") {
    payload = { ...payload, unfocus: true };
  }

  const event = deepFreeze({
    eventId: input.eventId ?? deps.createEventId(),
    interactionType: input.interactionType,
    objectId,
    sceneObjectId,
    bindingId,
    timestamp: input.timestamp ?? deps.now(),
    source: input.source ?? ("Director" as const),
    modifiers: deepFreeze({ ...(input.modifiers ?? {}) }),
    payload: deepFreeze(payload),
    priority,
  });

  const validation = validateInteractionEvent(event);
  if (!validation.ok) {
    throwRouting(validation.errors[0]!);
  }
  return event;
}

export function createInteractionRoutingPlan(
  event: NexoraDirectorInteractionEvent,
  context: NexoraDirectorInteractionRoutingContext,
  dependencies?: NexoraDirectorInteractionRoutingDependencies,
): NexoraDirectorInteractionRoutingPlan {
  const deps = resolveDeps(dependencies);
  const pkg = context.integrationPackage;

  if (
    event.objectId !== pkg.objectId ||
    event.sceneObjectId !== pkg.sceneObject.sceneObjectId ||
    event.bindingId !== context.binding.bindingId
  ) {
    throwRouting(
      err(
        "DIRECTOR_ROUTING_INVALID_CONTEXT",
        "Interaction event does not match routing context.",
        {
          eventId: event.eventId,
          objectId: event.objectId,
          sceneObjectId: event.sceneObjectId,
          details: {
            contextObjectId: pkg.objectId,
            contextBindingId: context.binding.bindingId,
          },
        },
      ),
    );
  }

  const permission = evaluateInteractionPermission(context);
  const semanticAction = resolveSemanticAction(event.interactionType, context);
  const target = resolveInteractionTarget(event.interactionType, context);
  const requiredPermissions = SEMANTIC_PERMISSIONS[semanticAction];

  const routeEvent = INTERACTION_TO_EVENT_ROUTE[
    event.interactionType as keyof typeof INTERACTION_TO_EVENT_ROUTE
  ];

  const acceptance = evaluateAcceptance(
    event.interactionType,
    semanticAction,
    permission,
    pkg,
    context,
  );

  const warnings = [
    ...permissionWarnings(permission, event),
    ...acceptance.warnings,
  ];

  const plan = deepFreeze({
    planId: deps.createPlanId(),
    accepted: acceptance.accepted,
    priority: event.priority,
    interaction: event,
    semanticAction,
    target,
    permission,
    requiredPermissions,
    warnings: Object.freeze(warnings),
    errors: acceptance.errors,
    metadata: deepFreeze({
      routeEvent: routeEvent ?? null,
      synchronizationRevision: context.synchronizationRevision ?? null,
      representationState: pkg.sceneObject.representationState,
    }),
  });

  assertInteractionRoutingInvariants(plan);
  return plan;
}

function isCompleteInteractionEvent(
  value: NexoraDirectorInteractionEvent | NexoraDirectorInteractionInput,
): value is NexoraDirectorInteractionEvent {
  return (
    "eventId" in value &&
    typeof value.eventId === "string" &&
    "timestamp" in value &&
    typeof value.timestamp === "string" &&
    "objectId" in value &&
    typeof value.objectId === "string" &&
    "sceneObjectId" in value &&
    typeof value.sceneObjectId === "string" &&
    "bindingId" in value &&
    typeof value.bindingId === "string" &&
    "priority" in value &&
    typeof value.priority === "number"
  );
}

export function routeDirectorInteraction(
  eventOrInput: NexoraDirectorInteractionEvent | NexoraDirectorInteractionInput,
  context: NexoraDirectorInteractionRoutingContext,
  dependencies?: NexoraDirectorInteractionRoutingDependencies,
): NexoraDirectorInteractionRoutingPlan {
  const event = isCompleteInteractionEvent(eventOrInput)
    ? eventOrInput
    : normalizeDirectorInteraction(eventOrInput, context, dependencies);
  return createInteractionRoutingPlan(event, context, dependencies);
}

export function orderInteractionRoutingQueue(
  plans: readonly NexoraDirectorInteractionRoutingPlan[],
): readonly NexoraDirectorInteractionRoutingPlan[] {
  return Object.freeze(
    [...plans].sort((left, right) => {
      if (left.priority !== right.priority) {
        return right.priority - left.priority;
      }
      const leftTs = left.interaction.timestamp;
      const rightTs = right.interaction.timestamp;
      if (leftTs !== rightTs) {
        return leftTs.localeCompare(rightTs);
      }
      return left.interaction.eventId.localeCompare(right.interaction.eventId);
    }),
  );
}

export function createInteractionRoutingQueue(
  plans: readonly NexoraDirectorInteractionRoutingPlan[],
  dependencies?: NexoraDirectorInteractionRoutingDependencies,
): NexoraDirectorInteractionRoutingQueue {
  const deps = resolveDeps(dependencies);
  const ordered = orderInteractionRoutingQueue(plans);
  for (const plan of ordered) {
    assertInteractionRoutingInvariants(plan);
  }
  return deepFreeze({
    queueId: deps.createQueueId(),
    plans: ordered,
  });
}

export function routeDirectorInteractionBatch(
  request: NexoraDirectorInteractionRoutingBatchRequest,
  dependencies?: NexoraDirectorInteractionRoutingDependencies,
): NexoraDirectorInteractionRoutingBatchResult {
  const deps = resolveDeps(dependencies);
  const plans: NexoraDirectorInteractionRoutingPlan[] = [];
  const acceptedEventIds: string[] = [];
  const rejectedEventIds: string[] = [];
  const errors: NexoraDirectorInteractionRoutingError[] = [];
  const warnings: NexoraDirectorInteractionRoutingWarning[] = [];
  let hasFailure = false;

  for (const item of request.items) {
    try {
      const plan = routeDirectorInteraction(
        item.eventOrInput,
        item.context,
        deps,
      );
      plans.push(plan);
      if (plan.accepted) {
        acceptedEventIds.push(plan.interaction.eventId);
      } else {
        hasFailure = true;
        rejectedEventIds.push(plan.interaction.eventId);
        errors.push(...plan.errors);
        if (request.mode === "Atomic") {
          const atomicPlans = plans.map((existing) =>
            existing.accepted
              ? deepFreeze({ ...existing, accepted: false })
              : existing,
          );
          return deepFreeze({
            accepted: false,
            mode: request.mode,
            plans: Object.freeze(atomicPlans),
            acceptedEventIds: Object.freeze([]),
            rejectedEventIds: Object.freeze(
              request.items.map((entry) => {
                const evt = entry.eventOrInput;
                return "eventId" in evt && evt.eventId
                  ? evt.eventId
                  : "pending";
              }),
            ),
            errors: Object.freeze([
              ...errors,
              err(
                "DIRECTOR_ROUTING_ATOMIC_REJECTED",
                "Atomic batch rejected because one interaction failed routing.",
              ),
            ]),
            warnings: Object.freeze(warnings),
          });
        }
      }
      warnings.push(...plan.warnings);
    } catch (caught) {
      hasFailure = true;
      const routingError =
        caught instanceof NexoraObjectDirectorInteractionRoutingException
          ? err(caught.code, caught.message, {
              eventId: caught.eventId,
              objectId: caught.objectId,
              sceneObjectId: caught.sceneObjectId,
              details: caught.details,
            })
          : err(
              "DIRECTOR_ROUTING_INVARIANT_VIOLATION",
              caught instanceof Error ? caught.message : "Unknown routing error.",
            );
      errors.push(routingError);
      rejectedEventIds.push(
        "eventId" in item.eventOrInput && item.eventOrInput.eventId
          ? item.eventOrInput.eventId
          : "unknown",
      );
      if (request.mode === "Atomic") {
        return deepFreeze({
          accepted: false,
          mode: request.mode,
          plans: Object.freeze([]),
          acceptedEventIds: Object.freeze([]),
          rejectedEventIds: Object.freeze(
            request.items.map((entry) => {
              const evt = entry.eventOrInput;
              return "eventId" in evt && evt.eventId ? evt.eventId : "unknown";
            }),
          ),
          errors: Object.freeze([
            ...errors,
            err(
              "DIRECTOR_ROUTING_ATOMIC_REJECTED",
              "Atomic batch rejected because one interaction failed routing.",
            ),
          ]),
          warnings: Object.freeze(warnings),
        });
      }
    }
  }

  if (hasFailure && request.mode === "BestEffort") {
    warnings.push(
      warn(
        "DIRECTOR_ROUTING_BEST_EFFORT_PARTIAL",
        "BestEffort batch completed with rejected interactions.",
        { details: { rejectedCount: rejectedEventIds.length } },
      ),
    );
  }

  return deepFreeze({
    accepted: !hasFailure,
    mode: request.mode,
    plans: Object.freeze(plans),
    acceptedEventIds: Object.freeze(acceptedEventIds),
    rejectedEventIds: Object.freeze(rejectedEventIds),
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
  });
}

export function simulateInteractionRouting(
  sequence: readonly {
    readonly input: NexoraDirectorInteractionInput | NexoraDirectorInteractionEvent;
    readonly context: NexoraDirectorInteractionRoutingContext;
  }[],
  dependencies?: NexoraDirectorInteractionRoutingDependencies,
  options?: NexoraDirectorInteractionRoutingSimulationOptions,
): readonly NexoraDirectorInteractionRoutingPlan[] {
  const deps = resolveDeps(dependencies);
  const plans: NexoraDirectorInteractionRoutingPlan[] = [];

  for (let index = 0; index < sequence.length; index += 1) {
    const item = sequence[index]!;
    const frozenContext = deepFreeze({
      integrationPackage: item.context.integrationPackage,
      binding: item.context.binding,
      synchronizationRevision: item.context.synchronizationRevision,
      locked: item.context.locked,
      allowHistoricalInspection: item.context.allowHistoricalInspection,
    });
    const plan = routeDirectorInteraction(item.input, frozenContext, deps);
    plans.push(plan);
    if (options?.stopOnFailure && !plan.accepted) {
      break;
    }
  }

  return Object.freeze(plans);
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateInteractionEvent(
  event: NexoraDirectorInteractionEvent,
): NexoraDirectorInteractionRoutingValidationResult {
  const errors: NexoraDirectorInteractionRoutingError[] = [];

  if (!event.eventId) {
    errors.push(
      err("DIRECTOR_ROUTING_INVALID_EVENT", "eventId must be non-empty.", {
        eventId: event.eventId,
      }),
    );
  }
  if (!event.objectId) {
    errors.push(
      err("DIRECTOR_ROUTING_INVALID_EVENT", "objectId must be non-empty.", {
        eventId: event.eventId,
      }),
    );
  }
  if (!event.sceneObjectId) {
    errors.push(
      err("DIRECTOR_ROUTING_INVALID_EVENT", "sceneObjectId must be non-empty.", {
        eventId: event.eventId,
        objectId: event.objectId,
      }),
    );
  }
  if (
    event.objectId &&
    event.sceneObjectId !== createNexoraDirectorSceneObjectId(event.objectId)
  ) {
    errors.push(
      err(
        "DIRECTOR_ROUTING_INVALID_EVENT",
        "sceneObjectId must be deterministic for objectId.",
        {
          eventId: event.eventId,
          objectId: event.objectId,
          sceneObjectId: event.sceneObjectId,
        },
      ),
    );
  }
  if (!event.bindingId) {
    errors.push(
      err("DIRECTOR_ROUTING_INVALID_EVENT", "bindingId must be non-empty.", {
        eventId: event.eventId,
        objectId: event.objectId,
      }),
    );
  }
  if (!event.timestamp) {
    errors.push(
      err("DIRECTOR_ROUTING_INVALID_EVENT", "timestamp must be non-empty.", {
        eventId: event.eventId,
      }),
    );
  }
  if (!Number.isFinite(event.priority)) {
    errors.push(
      err("DIRECTOR_ROUTING_INVALID_EVENT", "priority must be finite.", {
        eventId: event.eventId,
        details: { priority: event.priority },
      }),
    );
  }
  if (!isJsonSafe(event.modifiers) || !isJsonSafe(event.payload)) {
    errors.push(
      err(
        "DIRECTOR_ROUTING_INVALID_EVENT",
        "modifiers and payload must be JSON-safe.",
        { eventId: event.eventId },
      ),
    );
  }
  const forbidden = containsForbiddenRendererKeys(event);
  if (forbidden) {
    errors.push(
      err(
        "DIRECTOR_ROUTING_RENDERER_OBJECT_FORBIDDEN",
        `Renderer-specific value found at ${forbidden}`,
        { eventId: event.eventId, details: { path: forbidden } },
      ),
    );
  }

  return errors.length === 0
    ? { ok: true }
    : { ok: false, errors: Object.freeze(errors) };
}

export function validateRoutingPlan(
  plan: NexoraDirectorInteractionRoutingPlan,
): NexoraDirectorInteractionRoutingValidationResult {
  const errors: NexoraDirectorInteractionRoutingError[] = [];
  const eventValidation = validateInteractionEvent(plan.interaction);
  if (!eventValidation.ok) {
    errors.push(...eventValidation.errors);
  }
  if (!plan.planId) {
    errors.push(
      err("DIRECTOR_ROUTING_INVALID_PLAN", "planId must be non-empty.", {
        eventId: plan.interaction.eventId,
      }),
    );
  }
  if (!Number.isFinite(plan.priority)) {
    errors.push(
      err("DIRECTOR_ROUTING_INVALID_PLAN", "priority must be finite.", {
        eventId: plan.interaction.eventId,
      }),
    );
  }
  if (!isDeeplyFrozen(plan)) {
    errors.push(
      err(
        "DIRECTOR_ROUTING_INVARIANT_VIOLATION",
        "Routing plan must be deeply immutable.",
        { eventId: plan.interaction.eventId },
      ),
    );
  }
  const forbidden = containsForbiddenRendererKeys(plan);
  if (forbidden) {
    errors.push(
      err(
        "DIRECTOR_ROUTING_RENDERER_OBJECT_FORBIDDEN",
        `Renderer-specific value found at ${forbidden}`,
        { eventId: plan.interaction.eventId, details: { path: forbidden } },
      ),
    );
  }

  return errors.length === 0
    ? { ok: true }
    : { ok: false, errors: Object.freeze(errors) };
}

export function assertInteractionRoutingInvariants(
  plan: NexoraDirectorInteractionRoutingPlan,
): void {
  const result = validateRoutingPlan(plan);
  if (!result.ok) {
    throwRouting(result.errors[0]!);
  }
}

// ─── Serialization ──────────────────────────────────────────────────────────

function serializeEnvelope(
  kind: string,
  payload: Record<string, unknown>,
): string {
  return JSON.stringify({
    identity: nexoraObjectDirectorInteractionRoutingEngineIdentity,
    version: nexoraObjectDirectorInteractionRoutingEngineVersion,
    schemaVersion: nexoraObjectDirectorInteractionRoutingSchemaVersion,
    kind,
    ...payload,
  });
}

function parseEnvelope(json: string, kind: string): Record<string, unknown> {
  const parsed = JSON.parse(json) as Record<string, unknown>;
  if (
    parsed.schemaVersion !== nexoraObjectDirectorInteractionRoutingSchemaVersion
  ) {
    throwRouting(
      err(
        "DIRECTOR_ROUTING_UNSUPPORTED_VERSION",
        `Unsupported interaction routing schema: ${String(parsed.schemaVersion)}`,
        { details: { kind, schemaVersion: parsed.schemaVersion } },
      ),
    );
  }
  if (parsed.kind !== kind) {
    throwRouting(
      err(
        "DIRECTOR_ROUTING_INVALID_PLAN",
        `Expected envelope kind ${kind}, received ${String(parsed.kind)}.`,
        { details: { expected: kind, received: parsed.kind } },
      ),
    );
  }
  return parsed;
}

export function serializeInteractionEvent(
  event: NexoraDirectorInteractionEvent,
): string {
  const validation = validateInteractionEvent(event);
  if (!validation.ok) {
    throwRouting(validation.errors[0]!);
  }
  return serializeEnvelope("event", { event });
}

export function deserializeInteractionEvent(
  json: string,
): NexoraDirectorInteractionEvent {
  const parsed = parseEnvelope(json, "event");
  const restored = deepFreeze(parsed.event as NexoraDirectorInteractionEvent);
  const validation = validateInteractionEvent(restored);
  if (!validation.ok) {
    throwRouting(validation.errors[0]!);
  }
  return restored;
}

export function serializeInteractionRoutingPlan(
  plan: NexoraDirectorInteractionRoutingPlan,
): string {
  assertInteractionRoutingInvariants(plan);
  return serializeEnvelope("plan", { plan });
}

export function deserializeInteractionRoutingPlan(
  json: string,
): NexoraDirectorInteractionRoutingPlan {
  const parsed = parseEnvelope(json, "plan");
  const restored = deepFreeze(
    parsed.plan as NexoraDirectorInteractionRoutingPlan,
  );
  assertInteractionRoutingInvariants(restored);
  return restored;
}

export function serializeInteractionRoutingSnapshot(
  snapshot: NexoraDirectorInteractionRoutingSnapshot,
): string {
  return serializeEnvelope("snapshot", { snapshot });
}

export function deserializeInteractionRoutingSnapshot(
  json: string,
): NexoraDirectorInteractionRoutingSnapshot {
  const parsed = parseEnvelope(json, "snapshot");
  return deepFreeze(parsed.snapshot as NexoraDirectorInteractionRoutingSnapshot);
}

export function getNexoraObjectDirectorInteractionRoutingEngineSummary() {
  return Object.freeze({
    identity: nexoraObjectDirectorInteractionRoutingEngineIdentity,
    version: nexoraObjectDirectorInteractionRoutingEngineVersion,
    schemaVersion: nexoraObjectDirectorInteractionRoutingSchemaVersion,
    upstream: NOL_DIRECTOR_INTERACTION_ROUTING_UPSTREAM,
    upstreamRouteProjectionAvailable:
      typeof projectNexoraDirectorEventRoutes === "function",
    frameworkIndependent: true,
    rendererIndependent: true,
    noRuntimeMutation: true,
  });
}

export const NexoraObjectDirectorInteractionRoutingEngine = Object.freeze({
  identity: nexoraObjectDirectorInteractionRoutingEngineIdentity,
  version: nexoraObjectDirectorInteractionRoutingEngineVersion,
  schemaVersion: nexoraObjectDirectorInteractionRoutingSchemaVersion,
  evaluateInteractionPermission,
  resolveInteractionTarget,
  resolveSemanticAction,
  normalizeDirectorInteraction,
  createInteractionRoutingPlan,
  routeDirectorInteraction,
  orderInteractionRoutingQueue,
  createInteractionRoutingQueue,
  routeDirectorInteractionBatch,
  simulateInteractionRouting,
  validateInteractionEvent,
  validateRoutingPlan,
  assertInteractionRoutingInvariants,
  serializeInteractionEvent,
  deserializeInteractionEvent,
  serializeInteractionRoutingPlan,
  deserializeInteractionRoutingPlan,
  serializeInteractionRoutingSnapshot,
  deserializeInteractionRoutingSnapshot,
  summary: getNexoraObjectDirectorInteractionRoutingEngineSummary,
});
