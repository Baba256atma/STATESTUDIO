/**
 * NOL-4:1 — NexoraObject Director Runtime Adapter Foundation.
 * Semantic bridge from the frozen NOL-3 public surface to runtime adapters.
 * This module plans data only; it never constructs or executes renderer objects.
 */

import { directorIntegrationPublicIndexIdentity } from "../nexoraObjectDirectorIntegrationPublicIndex.ts";

export const directorRuntimeAdapterFoundationIdentity =
  "NOL-4:1/NexoraObjectDirectorRuntimeAdapterFoundation" as const;
export const directorRuntimeAdapterFoundationVersion = "1.0.0" as const;
export const directorRuntimeAdapterFoundationSchemaVersion = "1.0.0" as const;
export const directorRuntimeAdapterFoundationUpstream =
  directorIntegrationPublicIndexIdentity;

export type NexoraDirectorRuntimeAdapterState =
  | "Created"
  | "Initializing"
  | "Ready"
  | "Busy"
  | "Paused"
  | "Stopped"
  | "Failed";
export type NexoraDirectorRuntimeHealth =
  | "Healthy"
  | "Degraded"
  | "Unavailable";
export type NexoraDirectorRuntimeRequestMode =
  | "Atomic"
  | "BestEffort"
  | "Simulation";

export interface NexoraDirectorRuntimeCapabilities {
  readonly cameraIntents: boolean;
  readonly focus: boolean;
  readonly interaction: boolean;
  readonly animationHints: boolean;
  readonly attention: boolean;
  readonly labels: boolean;
  readonly indicators: boolean;
  readonly relationships: boolean;
  readonly clustering: boolean;
  readonly timelineReplay: boolean;
  readonly operationOverlays: boolean;
  readonly themeSwitching: boolean;
  readonly reducedMotion: boolean;
  readonly diagnostics: boolean;
}

export type NexoraDirectorRuntimeFeature =
  keyof NexoraDirectorRuntimeCapabilities;

export interface NexoraDirectorRuntimeCompatibility {
  readonly compatible: boolean;
  readonly adapterVersion: string;
  readonly engineVersion: string;
  readonly schemaVersion: string;
  readonly warnings: readonly string[];
}

export interface NexoraDirectorRuntimeAdapterContext {
  readonly runtimeId: string;
  readonly adapterVersion: string;
  readonly engineVersion: string;
  readonly runtimeState: NexoraDirectorRuntimeAdapterState;
  readonly capabilities: NexoraDirectorRuntimeCapabilities;
  readonly compatibility: NexoraDirectorRuntimeCompatibility;
  readonly timestamp: string;
  readonly diagnosticsEnabled: boolean;
  readonly reducedMotion: boolean;
  readonly metadata: Readonly<Record<string, unknown>>;
}

/** Structural NOL-3 plan contracts keep NOL-4 coupled only to the public index. */
export interface NexoraDirectorRuntimeSynchronizationPlan {
  readonly requestId: string;
  readonly accepted: boolean;
  readonly commands: readonly Readonly<Record<string, unknown>>[];
  readonly projectedState?: Readonly<Record<string, unknown>>;
  readonly [key: string]: unknown;
}
export interface NexoraDirectorRuntimeRoutingPlan {
  readonly planId: string;
  readonly accepted: boolean;
  readonly [key: string]: unknown;
}
export interface NexoraDirectorRuntimeCameraFocusPlan {
  readonly requestId: string;
  readonly accepted: boolean;
  readonly commands: readonly Readonly<Record<string, unknown>>[];
  readonly [key: string]: unknown;
}

export interface NexoraDirectorRuntimeAdapterRequest {
  readonly requestId: string;
  readonly synchronizationPlan: NexoraDirectorRuntimeSynchronizationPlan;
  readonly routingPlans: readonly NexoraDirectorRuntimeRoutingPlan[];
  readonly cameraFocusPlan: NexoraDirectorRuntimeCameraFocusPlan;
  readonly runtimeContext: NexoraDirectorRuntimeAdapterContext;
  readonly mode: NexoraDirectorRuntimeRequestMode;
}

export type NexoraDirectorRuntimeCommandType =
  | "CreateRuntimeObject"
  | "UpdateRuntimeObject"
  | "ReuseRuntimeObject"
  | "RemoveRuntimeObject"
  | "ShowRuntimeObject"
  | "HideRuntimeObject"
  | "UpdateInteraction"
  | "UpdateFocus"
  | "UpdateCameraIntent"
  | "UpdateAttention"
  | "UpdateAnimation"
  | "UpdateRelationships"
  | "UpdateIndicators"
  | "UpdateLabels"
  | "UpdateTimeline"
  | "UpdateDiagnostics";

export interface NexoraDirectorRuntimeCommand {
  readonly commandId: string;
  readonly requestId: string;
  readonly type: NexoraDirectorRuntimeCommandType;
  readonly order: number;
  readonly source: "Synchronization" | "Routing" | "CameraFocus" | "Adapter";
  readonly sourceId: string;
  readonly objectId?: string;
  readonly runtimeObjectId?: string;
  readonly revision?: number;
  readonly dependsOnCommandIds: readonly string[];
  readonly reversible: boolean;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorRuntimeDiagnostics {
  readonly commandCount: number;
  readonly commandCounts: Readonly<Partial<Record<NexoraDirectorRuntimeCommandType, number>>>;
  readonly unsupportedFeatures: readonly NexoraDirectorRuntimeFeature[];
  readonly compatibilityWarnings: readonly string[];
  readonly runtimeHealth: NexoraDirectorRuntimeHealth;
  readonly adapterReady: boolean;
}

export interface NexoraDirectorRuntimeSnapshot {
  readonly schemaVersion: typeof directorRuntimeAdapterFoundationSchemaVersion;
  readonly runtimeId: string;
  readonly revision: number;
  readonly state: NexoraDirectorRuntimeAdapterState;
  readonly capabilities: NexoraDirectorRuntimeCapabilities;
  readonly plannedCommands: readonly NexoraDirectorRuntimeCommand[];
  readonly health: NexoraDirectorRuntimeHealth;
  readonly timestamp: string;
}

export interface NexoraDirectorRuntimeAdapterResponse {
  readonly accepted: boolean;
  readonly runtimeRevision: number;
  readonly plannedCommands: readonly NexoraDirectorRuntimeCommand[];
  readonly diagnostics: NexoraDirectorRuntimeDiagnostics;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
  readonly snapshot: NexoraDirectorRuntimeSnapshot;
}

export interface NexoraDirectorRuntimeNegotiation {
  readonly supportedFeatures: readonly NexoraDirectorRuntimeFeature[];
  readonly unsupportedFeatures: readonly NexoraDirectorRuntimeFeature[];
  readonly degraded: boolean;
  readonly compatibility: NexoraDirectorRuntimeCompatibility;
  readonly health: NexoraDirectorRuntimeHealth;
}

export interface NexoraDirectorRuntimeProjection {
  readonly runtimeId: string;
  readonly state: NexoraDirectorRuntimeAdapterState;
  readonly health: NexoraDirectorRuntimeHealth;
  readonly revision: number;
  readonly commandCount: number;
  readonly capabilities: NexoraDirectorRuntimeCapabilities;
}

export interface NexoraDirectorRuntimeSnapshotComparison {
  readonly equal: boolean;
  readonly revisionChanged: boolean;
  readonly stateChanged: boolean;
  readonly capabilitiesChanged: boolean;
  readonly plannedCommandsChanged: boolean;
  readonly revisionDelta: number;
}

export interface NexoraDirectorRuntimeValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

const CAPABILITY_KEYS = Object.freeze([
  "cameraIntents", "focus", "interaction", "animationHints", "attention",
  "labels", "indicators", "relationships", "clustering", "timelineReplay",
  "operationOverlays", "themeSwitching", "reducedMotion", "diagnostics",
] as const satisfies readonly NexoraDirectorRuntimeFeature[]);

const TRANSITIONS: Readonly<Record<NexoraDirectorRuntimeAdapterState, readonly NexoraDirectorRuntimeAdapterState[]>> =
  Object.freeze({
    Created: Object.freeze(["Initializing", "Failed"] as const),
    Initializing: Object.freeze(["Ready", "Failed"] as const),
    Ready: Object.freeze(["Busy", "Paused", "Stopped", "Failed"] as const),
    Busy: Object.freeze(["Ready", "Failed"] as const),
    Paused: Object.freeze(["Ready", "Failed"] as const),
    Stopped: Object.freeze(["Failed"] as const),
    Failed: Object.freeze(["Failed"] as const),
  });

const COMMAND_MAP: Readonly<Record<string, NexoraDirectorRuntimeCommandType>> =
  Object.freeze({
    CreateSceneObject: "CreateRuntimeObject", BindSceneObject: "CreateRuntimeObject",
    UpdateSceneObject: "UpdateRuntimeObject", UpdateHierarchy: "UpdateRuntimeObject",
    UpdateRendering: "UpdateRuntimeObject", UpdateClustering: "UpdateRuntimeObject",
    ReuseSceneObject: "ReuseRuntimeObject", RemoveSceneObject: "RemoveRuntimeObject",
    DetachSceneObject: "RemoveRuntimeObject", ShowSceneObject: "ShowRuntimeObject",
    HideSceneObject: "HideRuntimeObject", UpdateInteraction: "UpdateInteraction",
    UpdatePicking: "UpdateInteraction", UpdateEventRoutes: "UpdateInteraction",
    UpdateCameraIntent: "UpdateCameraIntent", UpdateAnimationIntent: "UpdateAnimation",
    UpdateRelationships: "UpdateRelationships", FocusObject: "UpdateFocus",
    ClearFocus: "UpdateFocus", RestoreFocus: "UpdateFocus", SetCameraIntent: "UpdateCameraIntent",
    SetFramingMode: "UpdateCameraIntent", PreserveUserCamera: "UpdateCameraIntent",
    RecommendCameraTransition: "UpdateCameraIntent", DimBackground: "UpdateAttention",
    RestoreBackground: "UpdateAttention", RevealAttentionPath: "UpdateAttention",
    RevealNeighborhood: "UpdateRelationships", RevealCluster: "UpdateRelationships",
  });

function deepFreeze<T>(value: T, seen = new Set<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return value;
  seen.add(value as object);
  for (const item of Object.values(value as Record<string, unknown>)) deepFreeze(item, seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function frozenClone<T>(value: T): T {
  return deepFreeze(clone(value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isDeeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  return Object.values(value as Record<string, unknown>).every((v) => isDeeplyFrozen(v, seen));
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (isRecord(value)) return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
  return JSON.stringify(value);
}

function containsRendererObject(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return false;
  seen.add(value as object);
  const constructorName = (value as { constructor?: { name?: string } }).constructor?.name;
  if (constructorName && /^(Mesh|Scene|Camera|Material|WebGL|WebGPU|Object3D)/i.test(constructorName)) return true;
  return Object.entries(value as Record<string, unknown>).some(([key, child]) =>
    /^(mesh|scene|camera|material|geometry|webgl|webgpu|renderer)$/i.test(key) || containsRendererObject(child, seen));
}

export function transitionDirectorRuntimeAdapterState(
  from: NexoraDirectorRuntimeAdapterState,
  to: NexoraDirectorRuntimeAdapterState,
): NexoraDirectorRuntimeAdapterState {
  if (!TRANSITIONS[from]?.includes(to)) throw new Error(`Illegal runtime lifecycle transition: ${from} -> ${to}`);
  return to;
}

export function createDirectorRuntimeAdapterContext(
  input: NexoraDirectorRuntimeAdapterContext,
): NexoraDirectorRuntimeAdapterContext {
  if (!input.runtimeId || !input.adapterVersion || !input.engineVersion) throw new Error("Runtime identity and versions are required");
  const errors = validateCapabilities(input.capabilities);
  if (errors.length) throw new Error(errors.join("; "));
  if (containsRendererObject(input)) throw new Error("Renderer objects are forbidden in runtime adapter context");
  return frozenClone(input);
}

export function createDirectorRuntimeRequest(
  input: NexoraDirectorRuntimeAdapterRequest,
): NexoraDirectorRuntimeAdapterRequest {
  const candidate = frozenClone(input);
  const result = validateRuntimeRequest(candidate);
  if (!result.valid) throw new Error(result.errors.join("; "));
  return candidate;
}

function normalizeCommand(
  raw: Readonly<Record<string, unknown>>, requestId: string,
  source: NexoraDirectorRuntimeCommand["source"], sourceId: string, order: number,
): NexoraDirectorRuntimeCommand {
  const rawType = typeof raw.type === "string" ? raw.type : undefined;
  const type = (rawType ? COMMAND_MAP[rawType] : undefined) ??
    (source === "Routing" ? "UpdateInteraction" : "UpdateRuntimeObject");
  const payload = isRecord(raw.payload) ? raw.payload : raw;
  const command: NexoraDirectorRuntimeCommand = {
    commandId: `${requestId}:runtime:${order}`,
    requestId, type, order, source, sourceId,
    ...(typeof raw.objectId === "string" ? { objectId: raw.objectId } : {}),
    ...(typeof raw.sceneObjectId === "string" ? { runtimeObjectId: raw.sceneObjectId } : {}),
    ...(typeof raw.revision === "number" ? { revision: raw.revision } : {}),
    dependsOnCommandIds: Object.freeze([]),
    reversible: raw.reversible !== false,
    payload: frozenClone(payload),
  };
  return deepFreeze(command);
}

export function planDirectorRuntimeOperations(
  request: NexoraDirectorRuntimeAdapterRequest,
): readonly NexoraDirectorRuntimeCommand[] {
  const validation = validateRuntimeRequest(request);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  const commands: NexoraDirectorRuntimeCommand[] = [];
  const add = (raw: Readonly<Record<string, unknown>>, source: NexoraDirectorRuntimeCommand["source"], sourceId: string) =>
    commands.push(normalizeCommand(raw, request.requestId, source, sourceId, commands.length));
  request.synchronizationPlan.commands.forEach((command) => add(command, "Synchronization", request.synchronizationPlan.requestId));
  request.routingPlans.forEach((plan) => {
    if (plan.accepted) add(plan, "Routing", plan.planId);
  });
  request.cameraFocusPlan.commands.forEach((command) => add(command, "CameraFocus", request.cameraFocusPlan.requestId));
  return deepFreeze(commands);
}

export function calculateDirectorRuntimeHealth(
  state: NexoraDirectorRuntimeAdapterState,
  capabilities: NexoraDirectorRuntimeCapabilities,
  compatibility: NexoraDirectorRuntimeCompatibility,
): NexoraDirectorRuntimeHealth {
  if (state === "Failed" || state === "Stopped" || !compatibility.compatible) return "Unavailable";
  if (state !== "Ready" || CAPABILITY_KEYS.some((key) => !capabilities[key]) || compatibility.warnings.length) return "Degraded";
  return "Healthy";
}

export function negotiateRuntimeCapabilities(
  requested: readonly NexoraDirectorRuntimeFeature[],
  context: NexoraDirectorRuntimeAdapterContext,
): NexoraDirectorRuntimeNegotiation {
  const unique = [...new Set(requested)].sort();
  const supportedFeatures = unique.filter((key) => context.capabilities[key]);
  const unsupportedFeatures = unique.filter((key) => !context.capabilities[key]);
  return deepFreeze({
    supportedFeatures, unsupportedFeatures,
    degraded: unsupportedFeatures.length > 0 || !context.compatibility.compatible,
    compatibility: frozenClone(context.compatibility),
    health: calculateDirectorRuntimeHealth(context.runtimeState, context.capabilities, context.compatibility),
  });
}

function diagnostics(commands: readonly NexoraDirectorRuntimeCommand[], context: NexoraDirectorRuntimeAdapterContext): NexoraDirectorRuntimeDiagnostics {
  const counts: Partial<Record<NexoraDirectorRuntimeCommandType, number>> = {};
  commands.forEach(({ type }) => { counts[type] = (counts[type] ?? 0) + 1; });
  const unsupported = CAPABILITY_KEYS.filter((key) => !context.capabilities[key]);
  return deepFreeze({
    commandCount: commands.length, commandCounts: counts,
    unsupportedFeatures: unsupported,
    compatibilityWarnings: [...context.compatibility.warnings],
    runtimeHealth: calculateDirectorRuntimeHealth(context.runtimeState, context.capabilities, context.compatibility),
    adapterReady: context.runtimeState === "Ready" && context.compatibility.compatible,
  });
}

export function createDirectorRuntimeResponse(input: {
  readonly request: NexoraDirectorRuntimeAdapterRequest;
  readonly runtimeRevision: number;
  readonly plannedCommands?: readonly NexoraDirectorRuntimeCommand[];
  readonly warnings?: readonly string[];
  readonly errors?: readonly string[];
}): NexoraDirectorRuntimeAdapterResponse {
  const plannedCommands = input.plannedCommands ?? planDirectorRuntimeOperations(input.request);
  const errors = [...(input.errors ?? [])];
  const context = input.request.runtimeContext;
  const snapshot: NexoraDirectorRuntimeSnapshot = deepFreeze({
    schemaVersion: directorRuntimeAdapterFoundationSchemaVersion,
    runtimeId: context.runtimeId, revision: input.runtimeRevision,
    state: context.runtimeState, capabilities: frozenClone(context.capabilities),
    plannedCommands: frozenClone(plannedCommands),
    health: calculateDirectorRuntimeHealth(context.runtimeState, context.capabilities, context.compatibility),
    timestamp: context.timestamp,
  });
  const response = deepFreeze({
    accepted: errors.length === 0 && input.request.synchronizationPlan.accepted && input.request.cameraFocusPlan.accepted,
    runtimeRevision: input.runtimeRevision, plannedCommands: frozenClone(plannedCommands),
    diagnostics: diagnostics(plannedCommands, context),
    warnings: [...(input.warnings ?? [])], errors, snapshot,
  });
  const result = validateRuntimeResponse(response);
  if (!result.valid) throw new Error(result.errors.join("; "));
  return response;
}

export function projectDirectorRuntime(response: NexoraDirectorRuntimeAdapterResponse): NexoraDirectorRuntimeProjection {
  return deepFreeze({
    runtimeId: response.snapshot.runtimeId, state: response.snapshot.state,
    health: response.snapshot.health, revision: response.runtimeRevision,
    commandCount: response.plannedCommands.length,
    capabilities: frozenClone(response.snapshot.capabilities),
  });
}

export function compareDirectorRuntimeSnapshots(left: NexoraDirectorRuntimeSnapshot, right: NexoraDirectorRuntimeSnapshot): NexoraDirectorRuntimeSnapshotComparison {
  const stateChanged = left.state !== right.state;
  const revisionChanged = left.revision !== right.revision;
  const capabilitiesChanged = stable(left.capabilities) !== stable(right.capabilities);
  const plannedCommandsChanged = stable(left.plannedCommands) !== stable(right.plannedCommands);
  return deepFreeze({
    equal: !stateChanged && !revisionChanged && !capabilitiesChanged && !plannedCommandsChanged,
    revisionChanged, stateChanged, capabilitiesChanged, plannedCommandsChanged,
    revisionDelta: right.revision - left.revision,
  });
}

function validateCapabilities(value: unknown): string[] {
  if (!isRecord(value)) return ["Capabilities must be an object"];
  return CAPABILITY_KEYS.filter((key) => typeof value[key] !== "boolean").map((key) => `Capability ${key} must be boolean`);
}

function result(errors: string[], warnings: string[] = []): NexoraDirectorRuntimeValidationResult {
  return deepFreeze({ valid: errors.length === 0, errors, warnings });
}

export function validateDirectorRuntimeAdapter(context: unknown): NexoraDirectorRuntimeValidationResult {
  const errors: string[] = [];
  if (!isRecord(context)) return result(["Runtime context must be an object"]);
  if (typeof context.runtimeId !== "string" || !context.runtimeId) errors.push("runtimeId is required");
  if (!Object.hasOwn(TRANSITIONS, String(context.runtimeState))) errors.push("runtimeState is invalid");
  errors.push(...validateCapabilities(context.capabilities));
  if (!isRecord(context.compatibility) || context.compatibility.schemaVersion !== directorRuntimeAdapterFoundationSchemaVersion) errors.push("Unsupported runtime schema version");
  if (containsRendererObject(context)) errors.push("Renderer objects are forbidden");
  if (!isDeeplyFrozen(context)) errors.push("Runtime context must be deeply immutable");
  return result(errors);
}

export function validateRuntimeRequest(request: unknown): NexoraDirectorRuntimeValidationResult {
  const errors: string[] = [];
  if (!isRecord(request)) return result(["Runtime request must be an object"]);
  if (typeof request.requestId !== "string" || !request.requestId) errors.push("requestId is required");
  if (!["Atomic", "BestEffort", "Simulation"].includes(String(request.mode))) errors.push("Runtime request mode is invalid");
  if (!isRecord(request.synchronizationPlan) || !Array.isArray(request.synchronizationPlan.commands)) errors.push("synchronizationPlan is invalid");
  if (!Array.isArray(request.routingPlans)) errors.push("routingPlans must be an array");
  if (!isRecord(request.cameraFocusPlan) || !Array.isArray(request.cameraFocusPlan.commands)) errors.push("cameraFocusPlan is invalid");
  if (containsRendererObject(request)) errors.push("Renderer objects are forbidden");
  if (!isDeeplyFrozen(request)) errors.push("Runtime request must be deeply immutable");
  return result(errors);
}

export function validateRuntimeResponse(response: unknown): NexoraDirectorRuntimeValidationResult {
  const errors: string[] = [];
  if (!isRecord(response)) return result(["Runtime response must be an object"]);
  if (typeof response.accepted !== "boolean") errors.push("accepted must be boolean");
  if (!Number.isInteger(response.runtimeRevision) || Number(response.runtimeRevision) < 0) errors.push("runtimeRevision must be a non-negative integer");
  if (!Array.isArray(response.plannedCommands)) errors.push("plannedCommands must be an array");
  if (!isRecord(response.snapshot) || response.snapshot.schemaVersion !== directorRuntimeAdapterFoundationSchemaVersion) errors.push("Runtime snapshot schema is unsupported");
  if (containsRendererObject(response)) errors.push("Renderer objects are forbidden");
  if (!isDeeplyFrozen(response)) errors.push("Runtime response must be deeply immutable");
  return result(errors);
}

export function assertDirectorRuntimeAdapterInvariants(value: NexoraDirectorRuntimeAdapterContext | NexoraDirectorRuntimeAdapterRequest | NexoraDirectorRuntimeAdapterResponse): void {
  const validation = "runtimeContext" in value ? validateRuntimeRequest(value) : "snapshot" in value ? validateRuntimeResponse(value) : validateDirectorRuntimeAdapter(value);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
}

interface Envelope<T> {
  readonly identity: typeof directorRuntimeAdapterFoundationIdentity;
  readonly schemaVersion: typeof directorRuntimeAdapterFoundationSchemaVersion;
  readonly kind: "Context" | "Request" | "Response" | "Snapshot";
  readonly payload: T;
}

function serialize<T>(kind: Envelope<T>["kind"], payload: T): string {
  if (containsRendererObject(payload)) throw new Error("Renderer objects are not serializable by NOL-4");
  return JSON.stringify({ identity: directorRuntimeAdapterFoundationIdentity, schemaVersion: directorRuntimeAdapterFoundationSchemaVersion, kind, payload });
}

function deserialize<T>(json: string, kind: Envelope<T>["kind"]): T {
  const parsed: unknown = JSON.parse(json);
  if (!isRecord(parsed) || parsed.identity !== directorRuntimeAdapterFoundationIdentity || parsed.schemaVersion !== directorRuntimeAdapterFoundationSchemaVersion || parsed.kind !== kind) throw new Error("Unsupported or invalid runtime adapter serialization envelope");
  if (containsRendererObject(parsed.payload)) throw new Error("Renderer objects are forbidden");
  return deepFreeze(parsed.payload as T);
}

export const serializeDirectorRuntimeContext = (value: NexoraDirectorRuntimeAdapterContext): string => serialize("Context", value);
export const deserializeDirectorRuntimeContext = (json: string): NexoraDirectorRuntimeAdapterContext => {
  const value = deserialize<NexoraDirectorRuntimeAdapterContext>(json, "Context");
  const validation = validateDirectorRuntimeAdapter(value); if (!validation.valid) throw new Error(validation.errors.join("; ")); return value;
};
export const serializeDirectorRuntimeRequest = (value: NexoraDirectorRuntimeAdapterRequest): string => serialize("Request", value);
export const deserializeDirectorRuntimeRequest = (json: string): NexoraDirectorRuntimeAdapterRequest => {
  const value = deserialize<NexoraDirectorRuntimeAdapterRequest>(json, "Request");
  const validation = validateRuntimeRequest(value); if (!validation.valid) throw new Error(validation.errors.join("; ")); return value;
};
export const serializeDirectorRuntimeResponse = (value: NexoraDirectorRuntimeAdapterResponse): string => serialize("Response", value);
export const deserializeDirectorRuntimeResponse = (json: string): NexoraDirectorRuntimeAdapterResponse => {
  const value = deserialize<NexoraDirectorRuntimeAdapterResponse>(json, "Response");
  const validation = validateRuntimeResponse(value); if (!validation.valid) throw new Error(validation.errors.join("; ")); return value;
};
export const serializeDirectorRuntimeSnapshot = (value: NexoraDirectorRuntimeSnapshot): string => serialize("Snapshot", value);
export const deserializeDirectorRuntimeSnapshot = (json: string): NexoraDirectorRuntimeSnapshot => {
  const value = deserialize<NexoraDirectorRuntimeSnapshot>(json, "Snapshot");
  if (value.schemaVersion !== directorRuntimeAdapterFoundationSchemaVersion) throw new Error("Unsupported runtime snapshot schema version");
  return value;
};
