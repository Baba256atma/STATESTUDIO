/**
 * DRI-4:1 — Director Runtime Interaction Orchestration Foundation.
 *
 * Establishes immutable interaction vocabulary and plain-data primitives for
 * describing executive interactions before semantic interpretation.
 *
 * User Action ≠ Director Intent.
 * This module records observations only; it does not resolve intent, orchestrate
 * focus/selection, plan reactions, or mutate scenes.
 */

import { directorRuntimeSceneOrchestrationPublicIndexIdentity } from
  "@/app/lib/dri/directorRuntimeSceneOrchestrationPublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionOrchestrationFoundationIdentity =
  "DRI-4:1/DirectorRuntimeInteractionOrchestrationFoundation" as const;
export const directorRuntimeInteractionOrchestrationFoundationVersion =
  "4.1.0" as const;
export const directorRuntimeInteractionOrchestrationFoundationNamespace =
  "nexora.dri.interaction.orchestration.foundation" as const;
export const directorRuntimeInteractionOrchestrationFoundationUpstream =
  directorRuntimeSceneOrchestrationPublicIndexIdentity;

// ─── Interaction kinds (semantic categories, not DOM events) ────────────────

export const DIRECTOR_INTERACTION_KINDS = Object.freeze([
  "select",
  "activate",
  "focus",
  "hover",
  "open",
  "close",
  "back",
  "navigate",
  "expand",
  "collapse",
  "inspect",
  "invoke",
] as const);
export type DirectorInteractionKind = (typeof DIRECTOR_INTERACTION_KINDS)[number];

// ─── Interaction sources (executive surfaces) ───────────────────────────────

export const DIRECTOR_INTERACTION_SOURCES = Object.freeze([
  "stage",
  "object",
  "connection",
  "goal",
  "pack",
  "timeline",
  "live-lens",
  "advisor",
  "insight",
  "explorer",
  "mode-selector",
  "system",
] as const);
export type DirectorInteractionSource = (typeof DIRECTOR_INTERACTION_SOURCES)[number];

// ─── Interaction target kinds ───────────────────────────────────────────────

export const DIRECTOR_INTERACTION_TARGET_KINDS = Object.freeze([
  "scene",
  "object",
  "connection",
  "goal",
  "pack",
  "timeline-entry",
  "lens",
  "mode",
  "advisor-item",
  "insight-item",
  "explorer-item",
  "control",
  "none",
] as const);
export type DirectorInteractionTargetKind =
  (typeof DIRECTOR_INTERACTION_TARGET_KINDS)[number];

// ─── Lifecycle vocabulary (no transitions) ──────────────────────────────────

export const DIRECTOR_INTERACTION_LIFECYCLE_VALUES = Object.freeze([
  "observed",
  "accepted",
  "rejected",
  "consumed",
] as const);
export type DirectorInteractionLifecycle =
  (typeof DIRECTOR_INTERACTION_LIFECYCLE_VALUES)[number];

// ─── Interaction scope ──────────────────────────────────────────────────────

export const DIRECTOR_INTERACTION_SCOPES = Object.freeze([
  "local",
  "scene",
  "workspace",
  "global",
] as const);
export type DirectorInteractionScope = (typeof DIRECTOR_INTERACTION_SCOPES)[number];

// ─── Platform-neutral qualifiers ────────────────────────────────────────────

export const DIRECTOR_INTERACTION_QUALIFIERS = Object.freeze([
  "primary",
  "secondary",
  "additive",
  "range",
  "repeat",
] as const);
export type DirectorInteractionQualifier =
  (typeof DIRECTOR_INTERACTION_QUALIFIERS)[number];

// ─── Plain-data structures ──────────────────────────────────────────────────

export interface DirectorInteractionTarget {
  readonly kind: DirectorInteractionTargetKind;
  readonly id: string;
  readonly parentId?: string;
  readonly scope?: DirectorInteractionScope;
}

export interface DirectorInteractionObservation {
  readonly interactionId: string;
  readonly kind: DirectorInteractionKind;
  readonly source: DirectorInteractionSource;
  readonly target: DirectorInteractionTarget;
  readonly sequence: number;
  readonly scope?: DirectorInteractionScope;
  readonly contextRef?: string;
  readonly orderKey?: string | number;
  readonly qualifiers?: readonly DirectorInteractionQualifier[];
}

export interface CreateDirectorInteractionTargetInput {
  readonly kind: DirectorInteractionTargetKind;
  readonly id: string;
  readonly parentId?: string;
  readonly scope?: DirectorInteractionScope;
}

export interface CreateDirectorInteractionObservationInput {
  readonly interactionId: string;
  readonly kind: DirectorInteractionKind;
  readonly source: DirectorInteractionSource;
  readonly target: CreateDirectorInteractionTargetInput;
  readonly sequence: number;
  readonly scope?: DirectorInteractionScope;
  readonly contextRef?: string;
  readonly orderKey?: string | number;
  readonly qualifiers?: readonly DirectorInteractionQualifier[];
}

// ─── Predicates / normalization ─────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isDirectorInteractionKind(
  value: unknown,
): value is DirectorInteractionKind {
  return (DIRECTOR_INTERACTION_KINDS as readonly unknown[]).includes(value);
}

export function isDirectorInteractionSource(
  value: unknown,
): value is DirectorInteractionSource {
  return (DIRECTOR_INTERACTION_SOURCES as readonly unknown[]).includes(value);
}

export function isDirectorInteractionTargetKind(
  value: unknown,
): value is DirectorInteractionTargetKind {
  return (DIRECTOR_INTERACTION_TARGET_KINDS as readonly unknown[]).includes(value);
}

export function isDirectorInteractionLifecycle(
  value: unknown,
): value is DirectorInteractionLifecycle {
  return (DIRECTOR_INTERACTION_LIFECYCLE_VALUES as readonly unknown[]).includes(value);
}

export function isDirectorInteractionScope(
  value: unknown,
): value is DirectorInteractionScope {
  return (DIRECTOR_INTERACTION_SCOPES as readonly unknown[]).includes(value);
}

export function isDirectorInteractionQualifier(
  value: unknown,
): value is DirectorInteractionQualifier {
  return (DIRECTOR_INTERACTION_QUALIFIERS as readonly unknown[]).includes(value);
}

export function isDirectorInteractionSequence(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) &&
    Number.isSafeInteger(value) && value >= 0;
}

export function normalizeDirectorInteractionKind(
  value: unknown,
): DirectorInteractionKind {
  if (!isDirectorInteractionKind(value)) {
    throw new TypeError("interaction kind must be a known Director interaction kind");
  }
  return value;
}

export function normalizeDirectorInteractionSource(
  value: unknown,
): DirectorInteractionSource {
  if (!isDirectorInteractionSource(value)) {
    throw new TypeError("interaction source must be a known Director interaction source");
  }
  return value;
}

export function normalizeDirectorInteractionTargetKind(
  value: unknown,
): DirectorInteractionTargetKind {
  if (!isDirectorInteractionTargetKind(value)) {
    throw new TypeError("target kind must be a known Director interaction target kind");
  }
  return value;
}

export function normalizeDirectorInteractionLifecycle(
  value: unknown,
): DirectorInteractionLifecycle {
  if (!isDirectorInteractionLifecycle(value)) {
    throw new TypeError("lifecycle must be a known Director interaction lifecycle value");
  }
  return value;
}

export function normalizeDirectorInteractionScope(
  value: unknown,
): DirectorInteractionScope {
  if (!isDirectorInteractionScope(value)) {
    throw new TypeError("scope must be a known Director interaction scope");
  }
  return value;
}

export function normalizeDirectorInteractionQualifier(
  value: unknown,
): DirectorInteractionQualifier {
  if (!isDirectorInteractionQualifier(value)) {
    throw new TypeError("qualifier must be a known Director interaction qualifier");
  }
  return value;
}

export function normalizeDirectorInteractionSequence(value: unknown): number {
  if (!isDirectorInteractionSequence(value)) {
    throw new TypeError("sequence must be a non-negative safe integer");
  }
  return value;
}

function requireOpaqueId(value: unknown, field: string): string {
  if (!isNonEmptyString(value)) {
    throw new TypeError(`${field} must be a non-empty opaque identifier`);
  }
  return value;
}

function normalizeOptionalParentId(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  return requireOpaqueId(value, "parentId");
}

function normalizeOptionalContextRef(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  return requireOpaqueId(value, "contextRef");
}

function normalizeOptionalOrderKey(value: unknown): string | number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "string") {
    if (!isNonEmptyString(value)) {
      throw new TypeError("orderKey must be a non-empty string or finite number");
    }
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) return value;
  throw new TypeError("orderKey must be a non-empty string or finite number");
}

function normalizeQualifiers(
  values: readonly DirectorInteractionQualifier[] | undefined,
): readonly DirectorInteractionQualifier[] | undefined {
  if (values === undefined) return undefined;
  const normalized = Object.freeze(values.map(normalizeDirectorInteractionQualifier));
  return normalized;
}

function normalizeTargetIdentity(
  kind: DirectorInteractionTargetKind,
  id: unknown,
): string {
  if (kind === "none") {
    if (id === undefined || id === null) return "";
    if (typeof id !== "string") {
      throw new TypeError("target id must be a string");
    }
    return id;
  }
  return requireOpaqueId(id, "target id");
}

// ─── Construction helpers ───────────────────────────────────────────────────

export function createDirectorInteractionTarget(
  input: CreateDirectorInteractionTargetInput,
): DirectorInteractionTarget {
  const kind = normalizeDirectorInteractionTargetKind(input.kind);
  const id = normalizeTargetIdentity(kind, input.id);
  const parentId = normalizeOptionalParentId(input.parentId);
  const scope = input.scope === undefined
    ? undefined
    : normalizeDirectorInteractionScope(input.scope);
  return Object.freeze({
    kind,
    id,
    ...(parentId === undefined ? {} : { parentId }),
    ...(scope === undefined ? {} : { scope }),
  });
}

export function createDirectorInteractionObservation(
  input: CreateDirectorInteractionObservationInput,
): DirectorInteractionObservation {
  const interactionId = requireOpaqueId(input.interactionId, "interactionId");
  const kind = normalizeDirectorInteractionKind(input.kind);
  const source = normalizeDirectorInteractionSource(input.source);
  const target = createDirectorInteractionTarget(input.target);
  const sequence = normalizeDirectorInteractionSequence(input.sequence);
  const scope = input.scope === undefined
    ? undefined
    : normalizeDirectorInteractionScope(input.scope);
  const contextRef = normalizeOptionalContextRef(input.contextRef);
  const orderKey = normalizeOptionalOrderKey(input.orderKey);
  const qualifiers = normalizeQualifiers(input.qualifiers);
  return Object.freeze({
    interactionId,
    kind,
    source,
    target,
    sequence,
    ...(scope === undefined ? {} : { scope }),
    ...(contextRef === undefined ? {} : { contextRef }),
    ...(orderKey === undefined ? {} : { orderKey }),
    ...(qualifiers === undefined ? {} : { qualifiers }),
  });
}

/** Deterministic sequence comparison: negative if a < b, zero if equal, positive if a > b. */
export function compareDirectorInteractionSequence(a: number, b: number): number {
  const left = normalizeDirectorInteractionSequence(a);
  const right = normalizeDirectorInteractionSequence(b);
  return left === right ? 0 : left < right ? -1 : 1;
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionOrchestrationFoundationApiNames = Object.freeze([
  "isDirectorInteractionKind",
  "isDirectorInteractionSource",
  "isDirectorInteractionTargetKind",
  "isDirectorInteractionLifecycle",
  "isDirectorInteractionScope",
  "isDirectorInteractionQualifier",
  "isDirectorInteractionSequence",
  "normalizeDirectorInteractionKind",
  "normalizeDirectorInteractionSource",
  "normalizeDirectorInteractionTargetKind",
  "normalizeDirectorInteractionLifecycle",
  "normalizeDirectorInteractionScope",
  "normalizeDirectorInteractionQualifier",
  "normalizeDirectorInteractionSequence",
  "createDirectorInteractionTarget",
  "createDirectorInteractionObservation",
  "compareDirectorInteractionSequence",
  "verifyDirectorRuntimeInteractionOrchestrationFoundation",
] as const);

export const directorRuntimeInteractionOrchestrationFoundationRegistry = Object.freeze({
  interactionKinds: DIRECTOR_INTERACTION_KINDS,
  interactionKindCount: DIRECTOR_INTERACTION_KINDS.length,
  interactionSources: DIRECTOR_INTERACTION_SOURCES,
  interactionSourceCount: DIRECTOR_INTERACTION_SOURCES.length,
  targetKinds: DIRECTOR_INTERACTION_TARGET_KINDS,
  targetKindCount: DIRECTOR_INTERACTION_TARGET_KINDS.length,
  lifecycleValues: DIRECTOR_INTERACTION_LIFECYCLE_VALUES,
  lifecycleValueCount: DIRECTOR_INTERACTION_LIFECYCLE_VALUES.length,
  scopes: DIRECTOR_INTERACTION_SCOPES,
  scopeCount: DIRECTOR_INTERACTION_SCOPES.length,
  qualifiers: DIRECTOR_INTERACTION_QUALIFIERS,
  qualifierCount: DIRECTOR_INTERACTION_QUALIFIERS.length,
  publicApis: directorRuntimeInteractionOrchestrationFoundationApiNames,
  publicApiCount: directorRuntimeInteractionOrchestrationFoundationApiNames.length,
});

export const directorRuntimeInteractionOrchestrationFoundation = Object.freeze({
  phase: "DRI-4:1" as const,
  name: "DirectorRuntimeInteractionOrchestrationFoundation" as const,
  identity: directorRuntimeInteractionOrchestrationFoundationIdentity,
  namespace: directorRuntimeInteractionOrchestrationFoundationNamespace,
  version: directorRuntimeInteractionOrchestrationFoundationVersion,
  layer: "DirectorRuntimeInteractionOrchestration" as const,
  stage: "Foundation" as const,
  status: "FoundationReady" as const,
  upstreamDependency: directorRuntimeInteractionOrchestrationFoundationUpstream,
  deterministic: true as const,
  foundation: true as const,
  philosophy: "user-action-is-not-director-intent" as const,
  interactionKinds: DIRECTOR_INTERACTION_KINDS,
  interactionSources: DIRECTOR_INTERACTION_SOURCES,
  targetKinds: DIRECTOR_INTERACTION_TARGET_KINDS,
  lifecycleValues: DIRECTOR_INTERACTION_LIFECYCLE_VALUES,
  scopes: DIRECTOR_INTERACTION_SCOPES,
  qualifiers: DIRECTOR_INTERACTION_QUALIFIERS,
  publicApiSurface: directorRuntimeInteractionOrchestrationFoundationApiNames,
  registry: directorRuntimeInteractionOrchestrationFoundationRegistry,
  sceneOrchestrationBoundary: "DRI-3:9-public-index-only" as const,
});

export function verifyDirectorRuntimeInteractionOrchestrationFoundation(): boolean {
  const foundation = directorRuntimeInteractionOrchestrationFoundation;
  const registry = directorRuntimeInteractionOrchestrationFoundationRegistry;
  return (
    foundation.identity ===
      "DRI-4:1/DirectorRuntimeInteractionOrchestrationFoundation" &&
    foundation.version === "4.1.0" &&
    foundation.namespace === "nexora.dri.interaction.orchestration.foundation" &&
    foundation.layer === "DirectorRuntimeInteractionOrchestration" &&
    foundation.stage === "Foundation" &&
    foundation.status === "FoundationReady" &&
    foundation.deterministic === true &&
    foundation.foundation === true &&
    foundation.upstreamDependency ===
      "DRI-3:9/DirectorRuntimeSceneOrchestrationPublicIndex" &&
    foundation.upstreamDependency ===
      directorRuntimeSceneOrchestrationPublicIndexIdentity &&
    registry.interactionKindCount === DIRECTOR_INTERACTION_KINDS.length &&
    registry.interactionSourceCount === DIRECTOR_INTERACTION_SOURCES.length &&
    registry.targetKindCount === DIRECTOR_INTERACTION_TARGET_KINDS.length &&
    registry.lifecycleValueCount === DIRECTOR_INTERACTION_LIFECYCLE_VALUES.length &&
    registry.scopeCount === DIRECTOR_INTERACTION_SCOPES.length &&
    registry.qualifierCount === DIRECTOR_INTERACTION_QUALIFIERS.length &&
    registry.publicApiCount ===
      directorRuntimeInteractionOrchestrationFoundationApiNames.length &&
    new Set(DIRECTOR_INTERACTION_KINDS).size === DIRECTOR_INTERACTION_KINDS.length &&
    new Set(DIRECTOR_INTERACTION_SOURCES).size === DIRECTOR_INTERACTION_SOURCES.length &&
    new Set(DIRECTOR_INTERACTION_TARGET_KINDS).size ===
      DIRECTOR_INTERACTION_TARGET_KINDS.length &&
    new Set(DIRECTOR_INTERACTION_LIFECYCLE_VALUES).size ===
      DIRECTOR_INTERACTION_LIFECYCLE_VALUES.length &&
    new Set(DIRECTOR_INTERACTION_SCOPES).size === DIRECTOR_INTERACTION_SCOPES.length &&
    Object.isFrozen(foundation) &&
    Object.isFrozen(registry)
  );
}
