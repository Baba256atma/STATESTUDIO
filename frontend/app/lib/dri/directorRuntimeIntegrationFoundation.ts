/**
 * DRI-1:1 — Director Runtime Integration Foundation
 *
 * Defines the deterministic, one-way boundary from authoritative Runtime
 * state to NOL/Director presentation contracts. This module describes the
 * integration only; it performs no synchronization or presentation work.
 */

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeIntegrationFoundationIdentity =
  "DRI-1:1/DirectorRuntimeIntegrationFoundation" as const;
export const directorRuntimeIntegrationFoundationVersion = "1.1.0" as const;
export const directorRuntimeIntegrationFoundationNamespace =
  "nexora.dri.runtime.integration.foundation" as const;

export const directorRuntimeIntegrationFoundationMetadata = Object.freeze({
  identity: directorRuntimeIntegrationFoundationIdentity,
  version: directorRuntimeIntegrationFoundationVersion,
  namespace: directorRuntimeIntegrationFoundationNamespace,
  layer: "DRI" as const,
  phase: "DRI-1" as const,
  stage: "Foundation" as const,
  status: "FoundationReady" as const,
});

// ─── Canonical vocabulary ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INTEGRATION_SOURCE_KINDS = Object.freeze([
  "runtime-context",
  "runtime-object",
  "runtime-goal",
  "runtime-pack",
  "runtime-kpi",
  "runtime-decision",
  "runtime-execution",
  "runtime-monitoring",
  "runtime-timeline",
] as const);

export type DirectorRuntimeIntegrationSourceKind =
  (typeof DIRECTOR_RUNTIME_INTEGRATION_SOURCE_KINDS)[number];

export const DIRECTOR_RUNTIME_INTEGRATION_TARGET_KINDS = Object.freeze([
  "scene",
  "node",
  "relationship",
  "composition",
  "focus",
  "visibility",
  "interaction",
  "presentation",
  "status",
] as const);

export type DirectorRuntimeIntegrationTargetKind =
  (typeof DIRECTOR_RUNTIME_INTEGRATION_TARGET_KINDS)[number];

export const DIRECTOR_RUNTIME_INTEGRATION_STATES = Object.freeze([
  "idle",
  "ready",
  "binding",
  "synchronized",
  "stale",
  "blocked",
  "error",
] as const);

export type DirectorRuntimeIntegrationState =
  (typeof DIRECTOR_RUNTIME_INTEGRATION_STATES)[number];

export const directorRuntimeIntegrationDirection =
  "runtime-to-director" as const;
export type DirectorRuntimeIntegrationDirection =
  typeof directorRuntimeIntegrationDirection;

// ─── Plain-data contracts ──────────────────────────────────────────────────

export interface DirectorRuntimeIntegrationSourceReference {
  readonly sourceKind: DirectorRuntimeIntegrationSourceKind;
  readonly sourceId: string;
  readonly runtimeRevision: string | number;
}

export interface DirectorRuntimeIntegrationTargetReference {
  readonly targetKind: DirectorRuntimeIntegrationTargetKind;
  readonly targetId: string;
}

export interface DirectorRuntimeIntegrationBindingDescriptor {
  readonly bindingId: string;
  readonly source: DirectorRuntimeIntegrationSourceReference;
  readonly target: DirectorRuntimeIntegrationTargetReference;
  readonly state: DirectorRuntimeIntegrationState;
}

export const directorRuntimeIntegrationAuthority = Object.freeze({
  runtime: "authoritative-operational-state" as const,
  dri: "integration-interpreting-boundary" as const,
  nolDirector: "presentation-representation" as const,
  directorPresentationIsAuthoritative: false as const,
});

export const directorRuntimeIntegrationDeterminism = Object.freeze({
  equivalentInputsProduceEquivalentDescriptions: true as const,
  internallyGeneratedIds: false as const,
  internallyGeneratedTimestamps: false as const,
  hiddenMutableState: false as const,
});

export const directorRuntimeIntegrationImmutability = Object.freeze({
  exportedStructuresAreImmutable: true as const,
  inputObjectsAreNotMutated: true as const,
});

// ─── Structural helpers ────────────────────────────────────────────────────

export function isDirectorRuntimeIntegrationSourceKind(
  value: unknown,
): value is DirectorRuntimeIntegrationSourceKind {
  return (DIRECTOR_RUNTIME_INTEGRATION_SOURCE_KINDS as readonly unknown[]).includes(
    value,
  );
}

export function isDirectorRuntimeIntegrationTargetKind(
  value: unknown,
): value is DirectorRuntimeIntegrationTargetKind {
  return (DIRECTOR_RUNTIME_INTEGRATION_TARGET_KINDS as readonly unknown[]).includes(
    value,
  );
}

export function isDirectorRuntimeIntegrationState(
  value: unknown,
): value is DirectorRuntimeIntegrationState {
  return (DIRECTOR_RUNTIME_INTEGRATION_STATES as readonly unknown[]).includes(
    value,
  );
}

function requireOpaqueId(value: string, field: string): void {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${field} must be a non-empty opaque identifier`);
  }
}

export function createDirectorRuntimeIntegrationSourceReference(
  input: DirectorRuntimeIntegrationSourceReference,
): DirectorRuntimeIntegrationSourceReference {
  if (!isDirectorRuntimeIntegrationSourceKind(input.sourceKind)) {
    throw new TypeError("sourceKind must be a known integration source kind");
  }
  requireOpaqueId(input.sourceId, "sourceId");
  if (
    (typeof input.runtimeRevision !== "string" &&
      typeof input.runtimeRevision !== "number") ||
    (typeof input.runtimeRevision === "string" &&
      input.runtimeRevision.length === 0) ||
    (typeof input.runtimeRevision === "number" &&
      !Number.isFinite(input.runtimeRevision))
  ) {
    throw new TypeError("runtimeRevision must be a non-empty opaque revision");
  }
  return Object.freeze({
    sourceKind: input.sourceKind,
    sourceId: input.sourceId,
    runtimeRevision: input.runtimeRevision,
  });
}

export function createDirectorRuntimeIntegrationTargetReference(
  input: DirectorRuntimeIntegrationTargetReference,
): DirectorRuntimeIntegrationTargetReference {
  if (!isDirectorRuntimeIntegrationTargetKind(input.targetKind)) {
    throw new TypeError("targetKind must be a known integration target kind");
  }
  requireOpaqueId(input.targetId, "targetId");
  return Object.freeze({
    targetKind: input.targetKind,
    targetId: input.targetId,
  });
}

export function createDirectorRuntimeIntegrationBindingDescriptor(
  input: DirectorRuntimeIntegrationBindingDescriptor,
): DirectorRuntimeIntegrationBindingDescriptor {
  requireOpaqueId(input.bindingId, "bindingId");
  if (!isDirectorRuntimeIntegrationState(input.state)) {
    throw new TypeError("state must be a known integration state");
  }
  return Object.freeze({
    bindingId: input.bindingId,
    source: createDirectorRuntimeIntegrationSourceReference(input.source),
    target: createDirectorRuntimeIntegrationTargetReference(input.target),
    state: input.state,
  });
}

// ─── Deterministic registry ────────────────────────────────────────────────

export interface DirectorRuntimeIntegrationFoundationRegistryEntry {
  readonly order: number;
  readonly concept: string;
}

export const directorRuntimeIntegrationFoundationRegistry = Object.freeze([
  Object.freeze({ order: 1, concept: "identity" }),
  Object.freeze({ order: 2, concept: "integration-direction" }),
  Object.freeze({ order: 3, concept: "source-kinds" }),
  Object.freeze({ order: 4, concept: "target-kinds" }),
  Object.freeze({ order: 5, concept: "integration-states" }),
  Object.freeze({ order: 6, concept: "runtime-source-reference" }),
  Object.freeze({ order: 7, concept: "director-target-reference" }),
  Object.freeze({ order: 8, concept: "binding-descriptor" }),
  Object.freeze({ order: 9, concept: "runtime-authority" }),
  Object.freeze({ order: 10, concept: "determinism" }),
  Object.freeze({ order: 11, concept: "immutability" }),
] as const satisfies readonly DirectorRuntimeIntegrationFoundationRegistryEntry[]);

export const directorRuntimeIntegrationFoundationRegistryCount =
  directorRuntimeIntegrationFoundationRegistry.length;

export function getDirectorRuntimeIntegrationFoundationRegistry():
  readonly DirectorRuntimeIntegrationFoundationRegistryEntry[] {
  return directorRuntimeIntegrationFoundationRegistry;
}

export function verifyDirectorRuntimeIntegrationFoundation(): boolean {
  return (
    directorRuntimeIntegrationFoundationMetadata.identity ===
      "DRI-1:1/DirectorRuntimeIntegrationFoundation" &&
    directorRuntimeIntegrationFoundationMetadata.version === "1.1.0" &&
    directorRuntimeIntegrationFoundationMetadata.namespace ===
      "nexora.dri.runtime.integration.foundation" &&
    directorRuntimeIntegrationFoundationMetadata.status === "FoundationReady" &&
    directorRuntimeIntegrationDirection === "runtime-to-director" &&
    directorRuntimeIntegrationFoundationRegistryCount ===
      directorRuntimeIntegrationFoundationRegistry.length
  );
}
