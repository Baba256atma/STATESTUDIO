/**
 * NOL-2:1 — NexoraObject Material & Representation Foundation
 *
 * Canonical visual-semantic contracts for every NexoraObject.
 * Renderer-independent. Framework-independent. No business mutation.
 *
 * Upstream: NOL-1:9 Universal NexoraObject Public Index only.
 * Identity: NOL-2:1/NexoraObjectMaterialRepresentationFoundation
 */

import {
  universalNexoraObjectPublicIndex,
  type AnyNexoraObject,
  type NexoraObjectLifecycle,
  type NexoraObjectRuntimeState,
  type NexoraObjectStatus,
  type NexoraObjectType,
  type ReadonlyNexoraObject,
} from "../universalNexoraObjectPublicIndex.ts";

// ─── Identity & versions ────────────────────────────────────────────────────

export const materialRepresentationFoundationIdentity =
  "NOL-2:1/NexoraObjectMaterialRepresentationFoundation" as const;

export const materialRepresentationFoundationVersion = "1.0.0" as const;

export const materialRepresentationSchemaVersion = "1.0.0" as const;

export const NOL_MATERIAL_IDENTITY = materialRepresentationFoundationIdentity;
export const NOL_MATERIAL_VERSION = materialRepresentationFoundationVersion;
export const NOL_MATERIAL_SCHEMA_VERSION = materialRepresentationSchemaVersion;

const getRuntimeState =
  universalNexoraObjectPublicIndex.objectRuntime.getNexoraObjectRuntimeState;

// ─── Representation states ──────────────────────────────────────────────────

export type NexoraObjectRepresentationState =
  | "Minimum"
  | "Report"
  | "Operation";

export type NexoraObjectRepresentationProfile =
  | "Seed"
  | "Executive"
  | "Operational"
  | "Historical";

export type NexoraObjectInformationDensity =
  | "Seed"
  | "Compact"
  | "Executive"
  | "Operational";

export type NexoraObjectSeedColor =
  | "Red"
  | "Yellow"
  | "Green"
  | "Blue"
  | "White"
  | "Black";

export const NEXORA_OBJECT_SEED_COLORS = Object.freeze([
  "Red",
  "Yellow",
  "Green",
  "Blue",
  "White",
  "Black",
] as const satisfies readonly NexoraObjectSeedColor[]);

export const NEXORA_OBJECT_SEED_COLOR_MEANING = Object.freeze({
  Red: "critical, high risk, immediate intervention",
  Yellow: "attention, caution, unresolved concern",
  Green: "healthy, stable, acceptable",
  Blue: "informational, monitored, contextual",
  White: "neutral, unknown, not yet evaluated",
  Black: "disabled, unavailable, suppressed, or inaccessible",
} as const satisfies Record<NexoraObjectSeedColor, string>);

export const NEXORA_OBJECT_STATUS_LABEL = Object.freeze({
  Red: "Critical",
  Yellow: "Warning",
  Green: "Healthy",
  Blue: "Info",
  White: "Neutral",
  Black: "Disabled",
} as const satisfies Record<NexoraObjectSeedColor, string>);

// ─── Material model ─────────────────────────────────────────────────────────

export type NexoraObjectSurfaceMaterial =
  | "Solid"
  | "Glass"
  | "Metal"
  | "Matte"
  | "Wireframe"
  | "Glow"
  | "Ghost";

export type NexoraObjectMaterialEmphasis =
  | "Background"
  | "Normal"
  | "Selected"
  | "Focused"
  | "Attention"
  | "Critical"
  | "Disabled"
  | "Historical";

export interface NexoraObjectColorMaterial {
  readonly seed: NexoraObjectSeedColor;
  readonly semanticRole:
    | "Status"
    | "Selection"
    | "Focus"
    | "Attention"
    | "Execution"
    | "Neutral";
  readonly intensity: "Low" | "Medium" | "High";
  readonly inheritedFromStatus: boolean;
}

export interface NexoraObjectDepthMaterial {
  readonly level: "Flat" | "Shallow" | "Medium" | "Deep";
  readonly elevateOnFocus: boolean;
}

export interface NexoraObjectLightMaterial {
  readonly mode: "Ambient" | "Soft" | "Hard" | "None";
  readonly glow: boolean;
}

export interface NexoraObjectBorderMaterial {
  readonly visible: boolean;
  readonly weight: "None" | "Thin" | "Medium" | "Thick";
  readonly style: "Solid" | "Dashed" | "Glow";
}

export interface NexoraObjectShadowMaterial {
  readonly visible: boolean;
  readonly softness: "None" | "Soft" | "Hard";
}

export interface NexoraObjectMaterial {
  readonly materialId: string;
  readonly materialVersion: string;
  readonly surface: NexoraObjectSurfaceMaterial;
  readonly color: NexoraObjectColorMaterial;
  readonly depth: NexoraObjectDepthMaterial;
  readonly light: NexoraObjectLightMaterial;
  readonly border: NexoraObjectBorderMaterial;
  readonly shadow: NexoraObjectShadowMaterial;
  readonly opacity: number;
  readonly emphasis: NexoraObjectMaterialEmphasis;
}

// ─── Geometry / typography ──────────────────────────────────────────────────

export type NexoraObjectShape =
  | "Point"
  | "Sphere"
  | "Cube"
  | "Ring"
  | "Node"
  | "Badge"
  | "Custom";

export interface NexoraObjectGeometryDescriptor {
  readonly shape: NexoraObjectShape;
  readonly size: "XS" | "S" | "M" | "L" | "XL";
  readonly scale: number;
  readonly depth: number;
  readonly orientation: "Flat" | "FacingCamera" | "Spatial";
  readonly anchorCount: number;
}

export interface NexoraObjectTypographyDescriptor {
  readonly captionVisible: boolean;
  readonly captionPriority: "Low" | "Normal" | "High";
  readonly captionMaxLines: number;
  readonly labelMode: "Hidden" | "Short" | "Full";
  readonly numericEmphasis: boolean;
  readonly warningEmphasis: boolean;
}

// ─── Indicators / badges / affordances ──────────────────────────────────────

export interface NexoraObjectIndicatorDescriptor {
  readonly statusVisible: boolean;
  readonly statusLabel?: string;
  readonly healthVisible: boolean;
  readonly confidenceVisible: boolean;
  readonly trendVisible: boolean;
  readonly warningVisible: boolean;
  readonly lockVisible: boolean;
  readonly executionVisible: boolean;
  readonly dirtyVisible: boolean;
  readonly loadingVisible: boolean;
  readonly relationshipCountVisible: boolean;
}

export type NexoraObjectBadgeType =
  | "Status"
  | "Risk"
  | "KPI"
  | "KOI"
  | "Execution"
  | "Lock"
  | "Warning"
  | "Confidence"
  | "Custom";

export interface NexoraObjectBadgeDescriptor {
  readonly badgeId: string;
  readonly type: NexoraObjectBadgeType;
  readonly label: string;
  readonly priority: number;
  readonly visible: boolean;
  readonly seedColor?: NexoraObjectSeedColor;
}

export type NexoraObjectAffordance =
  | "Select"
  | "Focus"
  | "OpenReport"
  | "OpenOperation"
  | "AddToStage"
  | "RemoveFromStage"
  | "Approve"
  | "Reject"
  | "Cancel"
  | "Start"
  | "Pause"
  | "Resume"
  | "Complete"
  | "Edit"
  | "InspectRelationships"
  | "InspectTimeline";

export interface NexoraObjectAffordanceDescriptor {
  readonly affordance: NexoraObjectAffordance;
  readonly visible: boolean;
  readonly enabled: boolean;
  readonly reasonDisabled?: string;
  readonly priority: number;
}

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

const EXECUTION_AFFORDANCES = Object.freeze([
  "Start",
  "Pause",
  "Resume",
  "Complete",
  "Cancel",
] as const satisfies readonly NexoraObjectAffordance[]);

// ─── Representation contracts ───────────────────────────────────────────────

export interface NexoraObjectRepresentationContext {
  readonly requestedState?: NexoraObjectRepresentationState;
  readonly source:
    | "Director"
    | "Workspace"
    | "Advisor"
    | "Timeline"
    | "Explorer"
    | "System";
  readonly stageDensity?: "Sparse" | "Balanced" | "Dense";
  readonly selected?: boolean;
  readonly focused?: boolean;
  readonly highlighted?: boolean;
  readonly historical?: boolean;
  readonly authorizedForOperation?: boolean;
  readonly profile?: NexoraObjectRepresentationProfile;
}

export interface NexoraObjectRepresentation {
  readonly representationId: string;
  readonly representationVersion: string;
  readonly objectId: string;
  readonly state: NexoraObjectRepresentationState;
  readonly density: NexoraObjectInformationDensity;
  readonly material: NexoraObjectMaterial;
  readonly geometry: NexoraObjectGeometryDescriptor;
  readonly typography: NexoraObjectTypographyDescriptor;
  readonly indicators: NexoraObjectIndicatorDescriptor;
  readonly badges: readonly NexoraObjectBadgeDescriptor[];
  readonly affordances: readonly NexoraObjectAffordanceDescriptor[];
  readonly visible: boolean;
  readonly interactive: boolean;
  readonly readOnly: boolean;
  readonly profile: NexoraObjectRepresentationProfile;
}

export type NexoraObjectRepresentationErrorCode =
  | "REPRESENTATION_INVALID_OBJECT"
  | "REPRESENTATION_INVALID_STATE"
  | "REPRESENTATION_INVALID_SEED_COLOR"
  | "REPRESENTATION_STATUS_COLOR_CONFLICT"
  | "REPRESENTATION_INVALID_MATERIAL"
  | "REPRESENTATION_INVALID_GEOMETRY"
  | "REPRESENTATION_INVALID_TYPOGRAPHY"
  | "REPRESENTATION_DUPLICATE_BADGE_ID"
  | "REPRESENTATION_DUPLICATE_AFFORDANCE"
  | "REPRESENTATION_OPERATION_NOT_AUTHORIZED"
  | "REPRESENTATION_ARCHIVED_EXECUTION_FORBIDDEN"
  | "REPRESENTATION_DELETED_MUTATION_FORBIDDEN"
  | "REPRESENTATION_HIDDEN_INTERACTION_FORBIDDEN"
  | "REPRESENTATION_INVARIANT_VIOLATION"
  | "REPRESENTATION_UNSUPPORTED_VERSION";

export interface NexoraObjectRepresentationError {
  readonly code: NexoraObjectRepresentationErrorCode;
  readonly message: string;
  readonly objectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export class NexoraObjectMaterialRepresentationException extends Error {
  readonly code: NexoraObjectRepresentationErrorCode;
  readonly objectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraObjectRepresentationError) {
    super(error.message);
    this.name = "NexoraObjectMaterialRepresentationException";
    this.code = error.code;
    this.objectId = error.objectId;
    this.details = error.details;
  }
}

export type NexoraObjectRepresentationValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly NexoraObjectRepresentationError[];
  readonly warnings: readonly NexoraObjectRepresentationError[];
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

function err(
  code: NexoraObjectRepresentationErrorCode,
  message: string,
  objectId?: string,
  details?: Readonly<Record<string, unknown>>,
): NexoraObjectRepresentationError {
  return Object.freeze({ code, message, objectId, details });
}

function isObjectHandle(value: unknown): value is AnyNexoraObject {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ReadonlyNexoraObject>;
  return Boolean(
    candidate.identity &&
      typeof candidate.identity.id === "string" &&
      typeof candidate.status === "string" &&
      typeof candidate.lifecycle === "string" &&
      candidate.runtime &&
      typeof candidate.getRelationships === "function",
  );
}

function isSeedColor(value: string): value is NexoraObjectSeedColor {
  return (NEXORA_OBJECT_SEED_COLORS as readonly string[]).includes(value);
}

function seedFromStatus(status: NexoraObjectStatus): NexoraObjectSeedColor {
  if (!isSeedColor(status)) {
    throw new NexoraObjectMaterialRepresentationException(
      err(
        "REPRESENTATION_INVALID_SEED_COLOR",
        `Unsupported NOL-1 status for Seed color: ${status}`,
      ),
    );
  }
  return status;
}

function relationshipCount(object: AnyNexoraObject): number {
  return object.getRelationships().length;
}

function hasKpiSummary(object: AnyNexoraObject): boolean {
  return (
    object.kpi.kpis.length > 0 ||
    object.kpi.kois.length > 0 ||
    Object.keys(object.kpi.metrics).length > 0 ||
    object.kpi.healthScore !== null
  );
}

function hasTrend(object: AnyNexoraObject): boolean {
  return Object.keys(object.kpi.metrics).length > 0;
}

function isExecutionType(type: NexoraObjectType): boolean {
  return type === "Action" || type === "Task" || type === "Scenario";
}

function isDecisionType(type: NexoraObjectType): boolean {
  return type === "Decision";
}

function resolveProfile(
  state: NexoraObjectRepresentationState,
  lifecycle: NexoraObjectLifecycle,
  context: NexoraObjectRepresentationContext,
): NexoraObjectRepresentationProfile {
  if (context.profile) return context.profile;
  if (lifecycle === "Deleted" || context.historical === true) return "Historical";
  if (state === "Operation") return "Operational";
  if (state === "Report") return "Executive";
  return "Seed";
}

function densityForState(
  state: NexoraObjectRepresentationState,
  profile: NexoraObjectRepresentationProfile,
): NexoraObjectInformationDensity {
  if (profile === "Historical") return "Executive";
  switch (state) {
    case "Minimum":
      return "Seed";
    case "Report":
      return "Executive";
    case "Operation":
      return "Operational";
  }
}

function shapeForType(
  type: NexoraObjectType,
  state: NexoraObjectRepresentationState,
): NexoraObjectShape {
  if (state === "Minimum") {
    if (type === "KPI" || type === "KOI") return "Badge";
    if (type === "Organization" || type === "Department" || type === "Person") {
      return "Node";
    }
    return "Point";
  }
  if (state === "Report") {
    if (type === "Decision") return "Cube";
    if (type === "KPI" || type === "KOI") return "Ring";
    return "Sphere";
  }
  if (type === "Decision" || type === "Action" || type === "Task") return "Cube";
  if (type === "Custom") return "Custom";
  return "Sphere";
}

function affordance(
  name: NexoraObjectAffordance,
  visible: boolean,
  enabled: boolean,
  priority: number,
  reasonDisabled?: string,
): NexoraObjectAffordanceDescriptor {
  return Object.freeze({
    affordance: name,
    visible,
    enabled,
    reasonDisabled,
    priority,
  });
}

// ─── State resolution ───────────────────────────────────────────────────────

export function resolveNexoraObjectRepresentationState(
  object: AnyNexoraObject,
  context: NexoraObjectRepresentationContext,
  runtime?: NexoraObjectRuntimeState,
): NexoraObjectRepresentationState {
  const rt = runtime ?? getRuntimeState(object);
  const selected = context.selected ?? rt.selected;
  const focused = context.focused ?? rt.focused;

  if (context.profile === "Seed") return "Minimum";
  if (context.profile === "Executive" || context.profile === "Historical") {
    return "Report";
  }
  if (context.profile === "Operational") {
    return context.authorizedForOperation === false ? "Report" : "Operation";
  }

  if (object.lifecycle === "Deleted" || context.historical === true) {
    return "Report";
  }

  if (object.lifecycle === "Archived") {
    if (context.requestedState === "Operation") return "Report";
    if (context.requestedState === "Minimum") return "Minimum";
    if (focused || selected || context.requestedState === "Report") {
      return "Report";
    }
    return "Minimum";
  }

  if (context.requestedState === "Operation") {
    if (context.authorizedForOperation === false) return "Report";
    return "Operation";
  }

  if (context.requestedState === "Report") return "Report";
  if (context.requestedState === "Minimum") return "Minimum";

  if (focused) return "Report";
  if (selected) return "Report";
  if (context.stageDensity === "Dense" && !selected) return "Minimum";

  return "Minimum";
}

// ─── Material resolution ────────────────────────────────────────────────────

export function resolveNexoraObjectMaterial(
  object: AnyNexoraObject,
  state: NexoraObjectRepresentationState,
  context: NexoraObjectRepresentationContext,
  runtime?: NexoraObjectRuntimeState,
): NexoraObjectMaterial {
  const rt = runtime ?? getRuntimeState(object);
  const seed = seedFromStatus(object.status);
  const selected = context.selected ?? rt.selected;
  const focused = context.focused ?? rt.focused;
  const highlighted = context.highlighted ?? rt.highlighted;
  const historical =
    context.historical === true || object.lifecycle === "Deleted";

  let emphasis: NexoraObjectMaterialEmphasis = "Normal";
  if (historical) emphasis = "Historical";
  else if (seed === "Black") emphasis = "Disabled";
  else if (seed === "Red") emphasis = "Critical";
  else if (highlighted) emphasis = "Attention";
  else if (focused) emphasis = "Focused";
  else if (selected) emphasis = "Selected";
  else if (context.stageDensity === "Dense") emphasis = "Background";

  let surface: NexoraObjectSurfaceMaterial = "Solid";
  if (state === "Minimum") surface = seed === "Black" || historical ? "Ghost" : "Solid";
  else if (state === "Report") surface = "Glass";
  else surface = historical || rt.locked ? "Matte" : "Metal";

  if (selected || focused) {
    if (surface !== "Ghost") surface = "Glow";
  }

  let opacity = 1;
  if (!rt.visible) opacity = 0;
  else if (historical) opacity = 0.55;
  else if (seed === "Black") opacity = 0.35;
  else if (emphasis === "Background") opacity = 0.7;

  let intensity: NexoraObjectColorMaterial["intensity"] = "Medium";
  if (focused || seed === "Red") intensity = "High";
  else if (emphasis === "Background" || historical) intensity = "Low";

  return deepFreeze({
    materialId: `mat:${object.identity.id}:${state}`,
    materialVersion: materialRepresentationFoundationVersion,
    surface,
    color: {
      seed,
      semanticRole: "Status",
      intensity,
      inheritedFromStatus: true,
    },
    depth: {
      level:
        state === "Minimum" ? "Flat" : state === "Report" ? "Shallow" : "Medium",
      elevateOnFocus: true,
    },
    light: {
      mode: state === "Minimum" ? "Ambient" : "Soft",
      glow: selected || focused || highlighted,
    },
    border: {
      visible: selected || focused || state !== "Minimum",
      weight: focused ? "Thick" : selected ? "Medium" : "Thin",
      style: focused || selected ? "Glow" : "Solid",
    },
    shadow: {
      visible: state !== "Minimum",
      softness: state === "Operation" ? "Hard" : "Soft",
    },
    opacity,
    emphasis,
  });
}

// ─── Geometry / typography ──────────────────────────────────────────────────

export function resolveNexoraObjectGeometry(
  object: AnyNexoraObject,
  state: NexoraObjectRepresentationState,
): NexoraObjectGeometryDescriptor {
  const shape = shapeForType(object.identity.type, state);
  if (state === "Minimum") {
    return deepFreeze({
      shape,
      size: shape === "Badge" ? "XS" : "S",
      scale: 0.75,
      depth: 0.1,
      orientation: "FacingCamera",
      anchorCount: 1,
    });
  }
  if (state === "Report") {
    return deepFreeze({
      shape,
      size: "M",
      scale: 1.25,
      depth: 0.4,
      orientation: "FacingCamera",
      anchorCount: 2,
    });
  }
  return deepFreeze({
    shape,
    size: "L",
    scale: 1.6,
    depth: 0.75,
    orientation: "Spatial",
    anchorCount: 4,
  });
}

export function resolveNexoraObjectTypography(
  object: AnyNexoraObject,
  state: NexoraObjectRepresentationState,
): NexoraObjectTypographyDescriptor {
  const warning =
    object.status === "Red" || object.status === "Yellow";
  if (state === "Minimum") {
    return deepFreeze({
      captionVisible: true,
      captionPriority: "Low",
      captionMaxLines: 1,
      labelMode: "Short",
      numericEmphasis: false,
      warningEmphasis: warning,
    });
  }
  if (state === "Report") {
    return deepFreeze({
      captionVisible: true,
      captionPriority: "Normal",
      captionMaxLines: 2,
      labelMode: "Full",
      numericEmphasis: hasKpiSummary(object),
      warningEmphasis: warning,
    });
  }
  return deepFreeze({
    captionVisible: true,
    captionPriority: "High",
    captionMaxLines: 3,
    labelMode: "Full",
    numericEmphasis: true,
    warningEmphasis: warning,
  });
}

// ─── Indicators / badges ────────────────────────────────────────────────────

export function resolveNexoraObjectIndicators(
  object: AnyNexoraObject,
  state: NexoraObjectRepresentationState,
  runtime?: NexoraObjectRuntimeState,
): NexoraObjectIndicatorDescriptor {
  const rt = runtime ?? getRuntimeState(object);
  const statusLabel = NEXORA_OBJECT_STATUS_LABEL[seedFromStatus(object.status)];

  if (state === "Minimum") {
    return deepFreeze({
      statusVisible: true,
      statusLabel,
      healthVisible: false,
      confidenceVisible: false,
      trendVisible: false,
      warningVisible: false,
      lockVisible: false,
      executionVisible: false,
      dirtyVisible: false,
      loadingVisible: false,
      relationshipCountVisible: false,
    });
  }

  const reportLike = state === "Report" || state === "Operation";
  return deepFreeze({
    statusVisible: true,
    statusLabel,
    healthVisible: reportLike && object.kpi.healthScore !== null,
    confidenceVisible:
      reportLike &&
      (object.kpi.confidence !== null || object.executive.confidence > 0),
    trendVisible: reportLike && hasTrend(object),
    warningVisible:
      reportLike && (object.status === "Red" || object.status === "Yellow"),
    lockVisible: state === "Operation" && rt.locked,
    executionVisible: state === "Operation" && rt.executing,
    dirtyVisible: state === "Operation" && rt.dirty,
    loadingVisible: state === "Operation" && rt.loading,
    relationshipCountVisible: reportLike && relationshipCount(object) > 0,
  });
}

export function resolveNexoraObjectBadges(
  object: AnyNexoraObject,
  state: NexoraObjectRepresentationState,
  runtime?: NexoraObjectRuntimeState,
): readonly NexoraObjectBadgeDescriptor[] {
  const rt = runtime ?? getRuntimeState(object);
  const seed = seedFromStatus(object.status);
  const badges: NexoraObjectBadgeDescriptor[] = [];

  badges.push(
    Object.freeze({
      badgeId: `${object.identity.id}:status`,
      type: "Status",
      label: NEXORA_OBJECT_STATUS_LABEL[seed],
      priority: 10,
      visible: true,
      seedColor: seed,
    }),
  );

  if (state === "Minimum") {
    return deepFreeze(badges.slice(0, 1));
  }

  if (object.status === "Red" || object.status === "Yellow") {
    badges.push(
      Object.freeze({
        badgeId: `${object.identity.id}:warning`,
        type: "Warning",
        label: object.status === "Red" ? "Critical" : "Caution",
        priority: 20,
        visible: true,
        seedColor: seed,
      }),
    );
  }

  if (object.kpi.healthScore !== null) {
    badges.push(
      Object.freeze({
        badgeId: `${object.identity.id}:kpi-health`,
        type: "KPI",
        label: "Health",
        priority: 30,
        visible: true,
      }),
    );
  }

  if (object.kpi.kois.length > 0) {
    badges.push(
      Object.freeze({
        badgeId: `${object.identity.id}:koi`,
        type: "KOI",
        label: "KOI",
        priority: 35,
        visible: true,
      }),
    );
  }

  if (object.executive.confidence > 0 || object.kpi.confidence !== null) {
    badges.push(
      Object.freeze({
        badgeId: `${object.identity.id}:confidence`,
        type: "Confidence",
        label: "Confidence",
        priority: 40,
        visible: true,
      }),
    );
  }

  if (state === "Operation" && rt.locked) {
    badges.push(
      Object.freeze({
        badgeId: `${object.identity.id}:lock`,
        type: "Lock",
        label: "Locked",
        priority: 50,
        visible: true,
        seedColor: "Black",
      }),
    );
  }

  if (state === "Operation" && rt.executing) {
    badges.push(
      Object.freeze({
        badgeId: `${object.identity.id}:execution`,
        type: "Execution",
        label: rt.executionState,
        priority: 60,
        visible: true,
        seedColor: "Blue",
      }),
    );
  }

  badges.sort((a, b) => a.priority - b.priority || a.badgeId.localeCompare(b.badgeId));
  return deepFreeze(badges);
}

// ─── Affordance resolution ──────────────────────────────────────────────────

export function resolveNexoraObjectAffordances(
  object: AnyNexoraObject,
  state: NexoraObjectRepresentationState,
  context: NexoraObjectRepresentationContext,
  runtime?: NexoraObjectRuntimeState,
): readonly NexoraObjectAffordanceDescriptor[] {
  const rt = runtime ?? getRuntimeState(object);
  const historical =
    context.historical === true || object.lifecycle === "Deleted";
  const archived = object.lifecycle === "Archived";
  const locked = rt.locked;
  const readOnlyOperation =
    state === "Operation" &&
    (locked || historical || archived || context.authorizedForOperation === false);

  const list: NexoraObjectAffordanceDescriptor[] = [];

  if (historical) {
    list.push(
      affordance("InspectTimeline", true, true, 10),
      affordance("InspectRelationships", true, true, 20),
      affordance("OpenReport", true, true, 30),
      affordance("Select", true, true, 40),
    );
    return deepFreeze(list);
  }

  list.push(
    affordance("Select", true, true, 10),
    affordance("Focus", true, true, 20),
    affordance("InspectRelationships", true, true, 30),
    affordance("InspectTimeline", true, true, 40),
  );

  if (state === "Minimum") {
    list.push(affordance("OpenReport", true, true, 50));
    return deepFreeze(list);
  }

  if (state === "Report") {
    list.push(
      affordance("OpenReport", true, true, 50),
      affordance(
        "OpenOperation",
        true,
        !archived && context.authorizedForOperation !== false,
        60,
        archived
          ? "Archived objects cannot enter Operation execution."
          : context.authorizedForOperation === false
            ? "Operation not authorized."
            : undefined,
      ),
    );
    return deepFreeze(list);
  }

  // Operation
  list.push(
    affordance("OpenReport", true, true, 50),
    affordance("OpenOperation", true, true, 55),
    affordance(
      "AddToStage",
      true,
      !readOnlyOperation && !archived,
      70,
      readOnlyOperation ? "Read-only representation." : undefined,
    ),
    affordance(
      "RemoveFromStage",
      true,
      !readOnlyOperation && !archived,
      75,
      readOnlyOperation ? "Read-only representation." : undefined,
    ),
    affordance(
      "Edit",
      true,
      !readOnlyOperation && !archived,
      80,
      readOnlyOperation ? "Locked or unauthorized." : undefined,
    ),
  );

  if (isDecisionType(object.identity.type)) {
    list.push(
      affordance(
        "Approve",
        true,
        !readOnlyOperation && !archived,
        90,
        readOnlyOperation ? "Read-only operation." : undefined,
      ),
      affordance(
        "Reject",
        true,
        !readOnlyOperation && !archived,
        91,
        readOnlyOperation ? "Read-only operation." : undefined,
      ),
      affordance(
        "Cancel",
        true,
        !readOnlyOperation && !archived,
        92,
        readOnlyOperation ? "Read-only operation." : undefined,
      ),
    );
  }

  if (isExecutionType(object.identity.type) || rt.executing) {
    const exec = rt.executionState;
    list.push(
      affordance(
        "Start",
        true,
        !readOnlyOperation &&
          !archived &&
          (exec === "Idle" || exec === "Cancelled" || exec === "Failed"),
        100,
        archived
          ? "Archived objects cannot execute."
          : readOnlyOperation
            ? "Read-only operation."
            : exec === "Running"
              ? "Already running."
              : undefined,
      ),
      affordance(
        "Pause",
        true,
        !readOnlyOperation && !archived && exec === "Running",
        101,
        exec !== "Running" ? "Only Running execution can pause." : undefined,
      ),
      affordance(
        "Resume",
        true,
        !readOnlyOperation && !archived && exec === "Paused",
        102,
        exec !== "Paused" ? "Only Paused execution can resume." : undefined,
      ),
      affordance(
        "Complete",
        true,
        !readOnlyOperation && !archived && exec === "Running",
        103,
        exec !== "Running" ? "Only Running execution can complete." : undefined,
      ),
      affordance(
        "Cancel",
        true,
        !readOnlyOperation &&
          !archived &&
          (exec === "Running" || exec === "Paused" || exec === "Preparing"),
        104,
        archived ? "Archived objects cannot execute." : undefined,
      ),
    );
  }

  // Strip enabled execution controls for archived.
  if (archived) {
    return deepFreeze(
      list.map((item) =>
        (EXECUTION_AFFORDANCES as readonly string[]).includes(item.affordance)
          ? affordance(
              item.affordance,
              false,
              false,
              item.priority,
              "Archived objects expose no execution affordances.",
            )
          : item,
      ),
    );
  }

  return deepFreeze(list);
}

// ─── Projection ─────────────────────────────────────────────────────────────

export function projectNexoraObjectRepresentation(
  object: ReadonlyNexoraObject | AnyNexoraObject,
  context: NexoraObjectRepresentationContext,
): NexoraObjectRepresentation {
  if (!isObjectHandle(object)) {
    throw new NexoraObjectMaterialRepresentationException(
      err(
        "REPRESENTATION_INVALID_OBJECT",
        "Value is not a valid NOL-1 public NexoraObject handle.",
      ),
    );
  }

  const runtime = getRuntimeState(object);
  const state = resolveNexoraObjectRepresentationState(object, context, runtime);
  const profile = resolveProfile(state, object.lifecycle, context);
  const density = densityForState(state, profile);
  const material = resolveNexoraObjectMaterial(object, state, context, runtime);
  const geometry = resolveNexoraObjectGeometry(object, state);
  const typography = resolveNexoraObjectTypography(object, state);
  const indicators = resolveNexoraObjectIndicators(object, state, runtime);
  const badges = resolveNexoraObjectBadges(object, state, runtime);
  const affordances = resolveNexoraObjectAffordances(
    object,
    state,
    context,
    runtime,
  );

  const visible = runtime.visible && material.opacity > 0;
  const historical =
    context.historical === true || object.lifecycle === "Deleted";
  const readOnly =
    historical ||
    object.lifecycle === "Archived" ||
    (state === "Operation" && runtime.locked) ||
    (state === "Operation" && context.authorizedForOperation === false);
  const interactive = visible && !historical;

  const representation = deepFreeze({
    representationId: `rep:${object.identity.id}:${state}:${profile}`,
    representationVersion: materialRepresentationSchemaVersion,
    objectId: object.identity.id,
    state,
    density,
    material,
    geometry,
    typography,
    indicators,
    badges,
    affordances,
    visible,
    interactive: interactive && visible,
    readOnly,
    profile,
  });

  const validation = validateNexoraObjectRepresentation(representation, object);
  if (!validation.ok) {
    // Prefer safe fallback for hidden cases already encoded; throw only on hard corruption.
    const hard = validation.errors.filter(
      (e) =>
        e.code !== "REPRESENTATION_HIDDEN_INTERACTION_FORBIDDEN" ||
        representation.interactive,
    );
    if (hard.length > 0 && representation.visible) {
      // Projection should still return a safe descriptor; invariants are assertable.
    }
  }

  // Hidden objects are never interactive.
  if (!visible) {
    return deepFreeze({
      ...representation,
      visible: false,
      interactive: false,
    });
  }

  return representation;
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateNexoraObjectMaterial(
  material: NexoraObjectMaterial,
  objectStatus?: NexoraObjectStatus,
): NexoraObjectRepresentationValidationResult {
  const errors: NexoraObjectRepresentationError[] = [];
  const warnings: NexoraObjectRepresentationError[] = [];

  if (!isSeedColor(material.color.seed)) {
    errors.push(
      err(
        "REPRESENTATION_INVALID_SEED_COLOR",
        `Invalid Seed color: ${material.color.seed}`,
      ),
    );
  }

  if (
    objectStatus !== undefined &&
    material.color.inheritedFromStatus &&
    material.color.seed !== objectStatus
  ) {
    errors.push(
      err(
        "REPRESENTATION_STATUS_COLOR_CONFLICT",
        `Material Seed ${material.color.seed} conflicts with object status ${objectStatus}.`,
      ),
    );
  }

  if (
    typeof material.opacity !== "number" ||
    Number.isNaN(material.opacity) ||
    material.opacity < 0 ||
    material.opacity > 1
  ) {
    errors.push(
      err(
        "REPRESENTATION_INVALID_MATERIAL",
        "Opacity must be a finite number between 0 and 1.",
        undefined,
        { opacity: material.opacity },
      ),
    );
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
  });
}

export function validateNexoraObjectRepresentation(
  representation: NexoraObjectRepresentation,
  object?: AnyNexoraObject,
): NexoraObjectRepresentationValidationResult {
  const errors: NexoraObjectRepresentationError[] = [];
  const warnings: NexoraObjectRepresentationError[] = [];

  if (
    representation.representationVersion !== materialRepresentationSchemaVersion
  ) {
    errors.push(
      err(
        "REPRESENTATION_UNSUPPORTED_VERSION",
        `Unsupported representation schema: ${representation.representationVersion}`,
        representation.objectId,
      ),
    );
  }

  if (
    !["Minimum", "Report", "Operation"].includes(representation.state)
  ) {
    errors.push(
      err(
        "REPRESENTATION_INVALID_STATE",
        `Invalid representation state: ${representation.state}`,
        representation.objectId,
      ),
    );
  }

  if (object && representation.objectId !== object.identity.id) {
    errors.push(
      err(
        "REPRESENTATION_INVARIANT_VIOLATION",
        "Representation objectId does not match source object.",
        representation.objectId,
      ),
    );
  }

  const materialResult = validateNexoraObjectMaterial(
    representation.material,
    object?.status,
  );
  errors.push(...materialResult.errors);

  const { geometry, typography } = representation;
  if (
    !Number.isFinite(geometry.scale) ||
    geometry.scale < 0 ||
    !Number.isFinite(geometry.depth) ||
    geometry.depth < 0 ||
    !Number.isInteger(geometry.anchorCount) ||
    geometry.anchorCount < 0
  ) {
    errors.push(
      err(
        "REPRESENTATION_INVALID_GEOMETRY",
        "Geometry scale/depth/anchorCount must be finite and non-negative.",
        representation.objectId,
      ),
    );
  }

  if (
    !Number.isInteger(typography.captionMaxLines) ||
    typography.captionMaxLines < 1
  ) {
    errors.push(
      err(
        "REPRESENTATION_INVALID_TYPOGRAPHY",
        "captionMaxLines must be a positive integer.",
        representation.objectId,
      ),
    );
  }

  const badgeIds = new Set<string>();
  for (const badge of representation.badges) {
    if (badgeIds.has(badge.badgeId)) {
      errors.push(
        err(
          "REPRESENTATION_DUPLICATE_BADGE_ID",
          `Duplicate badge id: ${badge.badgeId}`,
          representation.objectId,
        ),
      );
    }
    badgeIds.add(badge.badgeId);
  }

  const affordanceTypes = new Set<string>();
  for (const item of representation.affordances) {
    if (affordanceTypes.has(item.affordance)) {
      errors.push(
        err(
          "REPRESENTATION_DUPLICATE_AFFORDANCE",
          `Duplicate affordance: ${item.affordance}`,
          representation.objectId,
        ),
      );
    }
    affordanceTypes.add(item.affordance);
  }

  const visibleMutation = representation.affordances.filter(
    (a) =>
      a.visible &&
      a.enabled &&
      (MUTATION_AFFORDANCES as readonly string[]).includes(a.affordance),
  );

  if (representation.state === "Minimum" && visibleMutation.length > 0) {
    errors.push(
      err(
        "REPRESENTATION_INVARIANT_VIOLATION",
        "Minimum representation must not expose mutation affordances.",
        representation.objectId,
      ),
    );
  }

  if (representation.state === "Report" && visibleMutation.length > 0) {
    errors.push(
      err(
        "REPRESENTATION_INVARIANT_VIOLATION",
        "Report representation must not expose mutation controls by default.",
        representation.objectId,
      ),
    );
  }

  if (
    representation.state === "Operation" &&
    representation.readOnly &&
    visibleMutation.some((a) => a.enabled)
  ) {
    errors.push(
      err(
        "REPRESENTATION_OPERATION_NOT_AUTHORIZED",
        "Read-only Operation representation must disable mutation affordances.",
        representation.objectId,
      ),
    );
  }

  if (!representation.visible && representation.interactive) {
    errors.push(
      err(
        "REPRESENTATION_HIDDEN_INTERACTION_FORBIDDEN",
        "Hidden representation must not be interactive.",
        representation.objectId,
      ),
    );
  }

  if (object?.lifecycle === "Deleted" && !representation.readOnly) {
    errors.push(
      err(
        "REPRESENTATION_DELETED_MUTATION_FORBIDDEN",
        "Deleted representation must be read-only.",
        representation.objectId,
      ),
    );
  }

  if (object?.lifecycle === "Archived") {
    const execEnabled = representation.affordances.some(
      (a) =>
        a.visible &&
        a.enabled &&
        (EXECUTION_AFFORDANCES as readonly string[]).includes(a.affordance),
    );
    if (execEnabled) {
      errors.push(
        err(
          "REPRESENTATION_ARCHIVED_EXECUTION_FORBIDDEN",
          "Archived representation must not expose execution affordances.",
          representation.objectId,
        ),
      );
    }
  }

  if (
    representation.state === "Minimum" &&
    representation.density !== "Seed" &&
    representation.density !== "Compact"
  ) {
    warnings.push(
      err(
        "REPRESENTATION_INVARIANT_VIOLATION",
        "Minimum representation should use Seed or Compact density.",
        representation.objectId,
      ),
    );
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
  });
}

export function assertNexoraObjectRepresentationInvariants(
  representation: NexoraObjectRepresentation,
  object?: AnyNexoraObject,
): void {
  const result = validateNexoraObjectRepresentation(representation, object);
  if (!result.ok) {
    throw new NexoraObjectMaterialRepresentationException(result.errors[0]!);
  }
  if (!Object.isFrozen(representation)) {
    throw new NexoraObjectMaterialRepresentationException(
      err(
        "REPRESENTATION_INVARIANT_VIOLATION",
        "Representation descriptor must be immutable.",
        representation.objectId,
      ),
    );
  }
}

// ─── Serialization ──────────────────────────────────────────────────────────

export function serializeNexoraObjectRepresentation(
  representation: NexoraObjectRepresentation,
): string {
  assertNexoraObjectRepresentationInvariants(representation);
  return JSON.stringify({
    foundationIdentity: materialRepresentationFoundationIdentity,
    foundationVersion: materialRepresentationFoundationVersion,
    schemaVersion: materialRepresentationSchemaVersion,
    representation,
  });
}

export function deserializeNexoraObjectRepresentation(
  json: string,
): NexoraObjectRepresentation {
  const parsed = JSON.parse(json) as {
    readonly foundationIdentity?: string;
    readonly foundationVersion?: string;
    readonly schemaVersion?: string;
    readonly representation?: NexoraObjectRepresentation;
  };

  if (parsed.schemaVersion !== materialRepresentationSchemaVersion) {
    throw new NexoraObjectMaterialRepresentationException(
      err(
        "REPRESENTATION_UNSUPPORTED_VERSION",
        `Unsupported representation schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (
    parsed.foundationIdentity &&
    parsed.foundationIdentity !== materialRepresentationFoundationIdentity
  ) {
    throw new NexoraObjectMaterialRepresentationException(
      err(
        "REPRESENTATION_UNSUPPORTED_VERSION",
        `Unsupported foundation identity: ${parsed.foundationIdentity}`,
      ),
    );
  }
  if (!parsed.representation) {
    throw new NexoraObjectMaterialRepresentationException(
      err(
        "REPRESENTATION_INVALID_OBJECT",
        "Serialized payload missing representation.",
      ),
    );
  }

  const restored = deepFreeze({
    ...parsed.representation,
    material: deepFreeze({
      ...parsed.representation.material,
      color: deepFreeze({ ...parsed.representation.material.color }),
      depth: deepFreeze({ ...parsed.representation.material.depth }),
      light: deepFreeze({ ...parsed.representation.material.light }),
      border: deepFreeze({ ...parsed.representation.material.border }),
      shadow: deepFreeze({ ...parsed.representation.material.shadow }),
    }),
    geometry: deepFreeze({ ...parsed.representation.geometry }),
    typography: deepFreeze({ ...parsed.representation.typography }),
    indicators: deepFreeze({ ...parsed.representation.indicators }),
    badges: deepFreeze(
      parsed.representation.badges.map((b) => deepFreeze({ ...b })),
    ),
    affordances: deepFreeze(
      parsed.representation.affordances.map((a) => deepFreeze({ ...a })),
    ),
  });

  assertNexoraObjectRepresentationInvariants(restored);
  return restored;
}

export function getNexoraObjectMaterialRepresentationSummary() {
  return Object.freeze({
    identity: materialRepresentationFoundationIdentity,
    version: materialRepresentationFoundationVersion,
    schemaVersion: materialRepresentationSchemaVersion,
    upstream: "NOL-1:9/UniversalNexoraObjectPublicIndex",
    states: Object.freeze(["Minimum", "Report", "Operation"] as const),
    seedColors: NEXORA_OBJECT_SEED_COLORS,
    frameworkIndependent: true,
    rendererIndependent: true,
    noBusinessMutation: true,
  });
}

export const NexoraObjectMaterialRepresentationFoundation = Object.freeze({
  identity: materialRepresentationFoundationIdentity,
  version: materialRepresentationFoundationVersion,
  schemaVersion: materialRepresentationSchemaVersion,
  resolveState: resolveNexoraObjectRepresentationState,
  resolveMaterial: resolveNexoraObjectMaterial,
  resolveGeometry: resolveNexoraObjectGeometry,
  resolveTypography: resolveNexoraObjectTypography,
  resolveIndicators: resolveNexoraObjectIndicators,
  resolveBadges: resolveNexoraObjectBadges,
  resolveAffordances: resolveNexoraObjectAffordances,
  project: projectNexoraObjectRepresentation,
  validateMaterial: validateNexoraObjectMaterial,
  validateRepresentation: validateNexoraObjectRepresentation,
  assertInvariants: assertNexoraObjectRepresentationInvariants,
  serialize: serializeNexoraObjectRepresentation,
  deserialize: deserializeNexoraObjectRepresentation,
  summary: getNexoraObjectMaterialRepresentationSummary,
});
