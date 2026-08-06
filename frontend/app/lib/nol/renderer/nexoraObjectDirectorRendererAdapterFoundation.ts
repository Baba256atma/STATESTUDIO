/** NOL-5:1 — immutable translation boundary from Director Runtime to renderers. */
import type { NexoraDirectorRuntimeObjectState } from "../nexoraObjectDirectorRuntimePublicIndex.ts";

export type { NexoraDirectorRuntimeObjectState };

export const foundationId = "NOL-5:1/NexoraObjectDirectorRendererAdapterFoundation" as const;
export const foundationVersion = "1.0.0" as const;
export const foundationNamespace = "nexora.nol.renderer.adapter.foundation" as const;
export const foundationStatus = "Foundation" as const;
export const foundationLock = Object.freeze({
  identity: foundationId,
  upstream: "NOL-4:9/NexoraObjectDirectorRuntimePublicIndex",
  immutable: true,
  pure: true,
  rendererIndependent: true,
} as const);

export interface RendererPosition {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export type RendererState = "minimum" | "report" | "operation";
export type RendererVisibility = "visible" | "hidden" | "collapsed";
export type RendererSeedColor = "Green" | "Yellow" | "Red" | "Blue" | "White" | "Black";
export type RendererBadgeSeverity = "info" | "success" | "warning" | "critical";
export type RendererEmphasis = "normal" | "focused" | "attention" | "critical" | "operation" | "disabled";

export interface RendererBadge {
  readonly id: string;
  readonly text: string;
  readonly severity: RendererBadgeSeverity;
}

export interface RendererColor {
  readonly base: RendererSeedColor;
  readonly accent: RendererSeedColor;
  readonly background: RendererSeedColor;
  readonly text: RendererSeedColor;
}

export interface RendererObject {
  readonly id: string;
  readonly type: string;
  readonly caption: string;
  readonly position: RendererPosition;
  readonly scale: RendererPosition;
  readonly rotation: RendererPosition;
  readonly color: RendererColor;
  readonly status: string;
  readonly visibility: RendererVisibility;
  readonly emphasis: RendererEmphasis;
  readonly badges: readonly RendererBadge[];
  readonly label: string;
  readonly icon: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface RendererAdaptationHints {
  readonly type?: string;
  readonly caption?: string;
  readonly position?: RendererPosition;
  readonly scale?: RendererPosition;
  readonly rotation?: RendererPosition;
  readonly status?: string;
  readonly icon?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface RendererAdapterVerificationReport {
  readonly valid: boolean;
  readonly objectCount: number;
  readonly immutable: boolean;
  readonly rendererIndependent: boolean;
  readonly errors: readonly string[];
  readonly foundationId: typeof foundationId;
}

const ZERO = Object.freeze({ x: 0, y: 0, z: 0 } as const);
const UNIT = Object.freeze({ x: 1, y: 1, z: 1 } as const);

function deepFreeze<T>(value: T, seen = new Set<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return value;
  seen.add(value as object);
  Object.values(value as Record<string, unknown>).forEach((child) => deepFreeze(child, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, seen));
}

function rendererIndependent(value: unknown, seen = new Set<object>()): boolean {
  if (typeof value === "function" || value instanceof Promise) return false;
  if (value === null || typeof value !== "object" || seen.has(value as object)) return true;
  seen.add(value as object);
  const name = (value as { constructor?: { name?: string } }).constructor?.name;
  if (name && !["Object", "Array"].includes(name)) return false;
  return Object.entries(value as Record<string, unknown>).every(([key, child]) =>
    !/^(callback|handler|connection|instance|renderer|mesh|scene|camera|material|geometry|dom|canvas|svg)$/i.test(key)
    && rendererIndependent(child, seen));
}

function statusOf(runtimeObject: NexoraDirectorRuntimeObjectState, override?: string): string {
  if (override) return override;
  if (runtimeObject.lifecycle === "Failed" || runtimeObject.lastExecutionState === "Failed") return "Failed";
  if (runtimeObject.attentionLevel === "Critical" || runtimeObject.attentionLevel === "Immediate") return "Critical";
  if (runtimeObject.attentionLevel === "Warning") return "Warning";
  if (runtimeObject.operating || runtimeObject.lastExecutionState === "Running") return "Operating";
  return runtimeObject.lifecycle;
}

export function resolveRendererState(runtimeObject: NexoraDirectorRuntimeObjectState): RendererState {
  if (runtimeObject.operating || runtimeObject.renderingLevel === "Operation") return "operation";
  if (runtimeObject.focused || ["Important", "Focused"].includes(runtimeObject.renderingLevel) || ["Notice", "Warning", "Critical", "Immediate"].includes(runtimeObject.attentionLevel)) return "report";
  return "minimum";
}

export function resolveRendererColor(status: string): RendererColor {
  const normalized = status.toLowerCase();
  let base: RendererSeedColor = "White";
  if (/critical|failed|error|immediate/.test(normalized)) base = "Red";
  else if (/warning|degraded|partial|attention/.test(normalized)) base = "Yellow";
  else if (/healthy|completed|success|active|ready/.test(normalized)) base = "Green";
  else if (/created|running|operating|busy|observe|notice|info/.test(normalized)) base = "Blue";
  else if (/hidden|removed|detached|stopped|unavailable|disabled/.test(normalized)) base = "Black";
  return deepFreeze({ base, accent: base === "White" ? "Blue" : "White", background: base === "Black" ? "Black" : "White", text: base === "Black" ? "White" : "Black" });
}

export function resolveRendererVisibility(runtimeObject: NexoraDirectorRuntimeObjectState): RendererVisibility {
  if (["Detached", "Removed"].includes(runtimeObject.lifecycle) || runtimeObject.renderingLevel === "Hidden") return "collapsed";
  if (!runtimeObject.visible || runtimeObject.lifecycle === "Hidden") return "hidden";
  return "visible";
}

export function resolveRendererBadges(runtimeObject: NexoraDirectorRuntimeObjectState): readonly RendererBadge[] {
  const badges: RendererBadge[] = [];
  if (runtimeObject.lifecycle === "Failed" || runtimeObject.lastExecutionState === "Failed") badges.push({ id: "runtime-failed", text: "Failed", severity: "critical" });
  if (["Critical", "Immediate"].includes(runtimeObject.attentionLevel)) badges.push({ id: "runtime-critical", text: runtimeObject.attentionLevel, severity: "critical" });
  else if (runtimeObject.attentionLevel === "Warning") badges.push({ id: "runtime-warning", text: "Warning", severity: "warning" });
  if (runtimeObject.operating) badges.push({ id: "runtime-operation", text: "Operating", severity: "info" });
  if (runtimeObject.focused) badges.push({ id: "runtime-focused", text: "Focused", severity: "info" });
  if (runtimeObject.animationPending) badges.push({ id: "runtime-animation", text: "Pending", severity: "info" });
  return deepFreeze(badges);
}

export function resolveRendererLabel(runtimeObject: NexoraDirectorRuntimeObjectState, caption = runtimeObject.objectId): string {
  if (runtimeObject.labelMode === "Hidden") return "";
  if (runtimeObject.labelMode === "Short" && caption.length > 24) return `${caption.slice(0, 21)}...`;
  return caption;
}

export function freezeRendererObject<T>(rendererObject: T): T {
  return deepFreeze(rendererObject);
}

export function verifyRendererValueFrozen(value: unknown): boolean {
  return deeplyFrozen(value);
}

export function adaptRuntimeObject(runtimeObject: NexoraDirectorRuntimeObjectState, hints: RendererAdaptationHints = {}): RendererObject {
  const caption = hints.caption ?? runtimeObject.objectId;
  const status = statusOf(runtimeObject, hints.status);
  const state = resolveRendererState(runtimeObject);
  const emphasis: RendererEmphasis = runtimeObject.lifecycle === "Failed" ? "critical" : state === "operation" ? "operation" : runtimeObject.focused ? "focused" : ["Critical", "Immediate", "Warning"].includes(runtimeObject.attentionLevel) ? "attention" : resolveRendererVisibility(runtimeObject) !== "visible" ? "disabled" : "normal";
  return freezeRendererObject({
    id: runtimeObject.runtimeObjectId,
    type: hints.type ?? "NexoraObject",
    caption,
    position: hints.position ?? ZERO,
    scale: hints.scale ?? UNIT,
    rotation: hints.rotation ?? ZERO,
    color: resolveRendererColor(status),
    status,
    visibility: resolveRendererVisibility(runtimeObject),
    emphasis,
    badges: resolveRendererBadges(runtimeObject),
    label: resolveRendererLabel(runtimeObject, caption),
    icon: hints.icon ?? "object",
    metadata: deepFreeze({
      objectId: runtimeObject.objectId,
      sceneObjectId: runtimeObject.sceneObjectId,
      generation: runtimeObject.generation,
      rendererState: state,
      interactive: runtimeObject.interactive,
      cameraIntent: runtimeObject.cameraIntent,
      relationshipMode: runtimeObject.relationshipMode,
      indicatorMode: runtimeObject.indicatorMode,
      ...(hints.metadata ?? {}),
    }),
  });
}

export function adaptRuntimeCollection(runtimeObjects: readonly NexoraDirectorRuntimeObjectState[], hints: readonly RendererAdaptationHints[] = []): readonly RendererObject[] {
  return deepFreeze(runtimeObjects.map((runtimeObject, index) => adaptRuntimeObject(runtimeObject, hints[index])));
}

export function verifyRendererAdapter(value: RendererObject | readonly RendererObject[]): RendererAdapterVerificationReport {
  const objects = Array.isArray(value) ? value : [value];
  const errors: string[] = [];
  if (!deeplyFrozen(value)) errors.push("Renderer adapter output must be deeply immutable");
  if (!rendererIndependent(value)) errors.push("Renderer adapter output contains an executable or renderer-specific resource");
  for (const object of objects) {
    if (!object.id || !object.type || !object.caption) errors.push("Renderer object identity, type, and caption are required");
    if (![object.position, object.scale, object.rotation].every((vector) => [vector.x, vector.y, vector.z].every(Number.isFinite))) errors.push(`Renderer object ${object.id || "unknown"} has an invalid transform`);
  }
  return deepFreeze({ valid: errors.length === 0, objectCount: objects.length, immutable: deeplyFrozen(value), rendererIndependent: rendererIndependent(value), errors, foundationId });
}
