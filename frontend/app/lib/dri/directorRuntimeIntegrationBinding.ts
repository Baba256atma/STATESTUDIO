/**
 * DRI-1:4 — Director Runtime Integration Binding
 *
 * Immutable association definitions created from explicit DRI-1:3 mappings.
 * This layer describes bindings and lifecycle changes; it executes nothing.
 */

import {
  createDirectorRuntimeMappingRequest,
  createDirectorRuntimeMappingRule,
  directorRuntimeIntegrationMappingIdentity,
  directorRuntimeIntegrationMappingMetadata,
  isDirectorRuntimeMappingIntentKind,
  resolveDirectorRuntimeMapping,
  type DirectorRuntimeMappingIntentKind,
  type DirectorRuntimeMappingResolution,
  type DirectorRuntimeMappingRule,
} from "./directorRuntimeIntegrationMapping.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeIntegrationBindingIdentity =
  "DRI-1:4/DirectorRuntimeIntegrationBinding" as const;
export const directorRuntimeIntegrationBindingVersion = "1.4.0" as const;
export const directorRuntimeIntegrationBindingNamespace =
  "nexora.dri.runtime.integration.binding" as const;
export const directorRuntimeIntegrationBindingUpstream =
  directorRuntimeIntegrationMappingIdentity;

export const directorRuntimeIntegrationBindingMetadata = Object.freeze({
  identity: directorRuntimeIntegrationBindingIdentity,
  version: directorRuntimeIntegrationBindingVersion,
  namespace: directorRuntimeIntegrationBindingNamespace,
  layer: "DRI" as const,
  phase: "DRI-1" as const,
  stage: "Binding" as const,
  status: "BindingReady" as const,
  upstream: directorRuntimeIntegrationBindingUpstream,
  direction: directorRuntimeIntegrationMappingMetadata.direction,
  authority: directorRuntimeIntegrationMappingMetadata.authority,
});

// ─── Canonical vocabulary ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_BINDING_LIFECYCLE_STATES = Object.freeze([
  "declared", "active", "suspended", "stale", "replaced", "retired", "invalid",
] as const);
export type DirectorRuntimeBindingLifecycleState =
  (typeof DIRECTOR_RUNTIME_BINDING_LIFECYCLE_STATES)[number];

export const DIRECTOR_RUNTIME_BINDING_ACTIVATION_STATES = Object.freeze([
  "enabled", "disabled",
] as const);
export type DirectorRuntimeBindingActivationState =
  (typeof DIRECTOR_RUNTIME_BINDING_ACTIVATION_STATES)[number];

export const DIRECTOR_RUNTIME_BINDING_SCOPE_KINDS = Object.freeze([
  "global", "scene", "object", "goal", "pack", "session",
] as const);
export type DirectorRuntimeBindingScopeKind =
  (typeof DIRECTOR_RUNTIME_BINDING_SCOPE_KINDS)[number];

export const DIRECTOR_RUNTIME_BINDING_EXCLUSIVITY_MODES = Object.freeze([
  "shared", "exclusive-source", "exclusive-target", "exclusive-pair",
] as const);
export type DirectorRuntimeBindingExclusivityMode =
  (typeof DIRECTOR_RUNTIME_BINDING_EXCLUSIVITY_MODES)[number];

export const DIRECTOR_RUNTIME_BINDING_CONFLICT_KINDS = Object.freeze([
  "none", "duplicate", "source-conflict", "target-conflict", "intent-conflict",
  "revision-conflict", "exclusive-conflict",
] as const);
export type DirectorRuntimeBindingConflictKind =
  (typeof DIRECTOR_RUNTIME_BINDING_CONFLICT_KINDS)[number];

export function isDirectorRuntimeBindingLifecycleState(
  value: unknown,
): value is DirectorRuntimeBindingLifecycleState {
  return (DIRECTOR_RUNTIME_BINDING_LIFECYCLE_STATES as readonly unknown[])
    .includes(value);
}
export function isDirectorRuntimeBindingActivationState(
  value: unknown,
): value is DirectorRuntimeBindingActivationState {
  return (DIRECTOR_RUNTIME_BINDING_ACTIVATION_STATES as readonly unknown[])
    .includes(value);
}
export function isDirectorRuntimeBindingScopeKind(
  value: unknown,
): value is DirectorRuntimeBindingScopeKind {
  return (DIRECTOR_RUNTIME_BINDING_SCOPE_KINDS as readonly unknown[])
    .includes(value);
}
export function isDirectorRuntimeBindingExclusivityMode(
  value: unknown,
): value is DirectorRuntimeBindingExclusivityMode {
  return (DIRECTOR_RUNTIME_BINDING_EXCLUSIVITY_MODES as readonly unknown[])
    .includes(value);
}
export function isDirectorRuntimeBindingConflictKind(
  value: unknown,
): value is DirectorRuntimeBindingConflictKind {
  return (DIRECTOR_RUNTIME_BINDING_CONFLICT_KINDS as readonly unknown[])
    .includes(value);
}

// ─── Binding contracts ─────────────────────────────────────────────────────

type Mapping = DirectorRuntimeMappingResolution["mappings"][number];
type Source = Mapping["source"];
type Target = Mapping["target"];

export interface DirectorRuntimeBindingOwnership {
  readonly ownerId: string;
  readonly ownerKind: string;
}

export interface DirectorRuntimeBinding {
  readonly bindingId: string;
  readonly source: Source;
  readonly target: Target;
  readonly mappingId: string;
  readonly intentKind: DirectorRuntimeMappingIntentKind;
  readonly lifecycle: DirectorRuntimeBindingLifecycleState;
  readonly activation: DirectorRuntimeBindingActivationState;
  readonly scope: DirectorRuntimeBindingScopeKind;
  readonly exclusivity: DirectorRuntimeBindingExclusivityMode;
  readonly revisionSensitive: boolean;
  readonly owner?: DirectorRuntimeBindingOwnership;
  readonly direction: "runtime-to-director";
}

export interface DirectorRuntimeBindingInput {
  readonly bindingId: string;
  readonly mapping: Mapping;
  readonly intentKind: DirectorRuntimeMappingIntentKind;
  readonly lifecycle?: DirectorRuntimeBindingLifecycleState;
  readonly activation?: DirectorRuntimeBindingActivationState;
  readonly scope?: DirectorRuntimeBindingScopeKind;
  readonly exclusivity?: DirectorRuntimeBindingExclusivityMode;
  readonly revisionSensitive?: boolean;
  readonly owner?: DirectorRuntimeBindingOwnership;
  readonly direction?: "runtime-to-director";
}

export interface DirectorRuntimeBindingCollection {
  readonly collectionId: string;
  readonly bindings: readonly DirectorRuntimeBinding[];
}

export interface DirectorRuntimeBindingGroup {
  readonly groupId: string;
  readonly bindingIds: readonly string[];
}

export interface DirectorRuntimeBindingReplacement {
  readonly previousBindingId: string;
  readonly replacementBindingId: string;
}

export interface DirectorRuntimeBindingReplacementResult {
  readonly binding: DirectorRuntimeBinding;
  readonly replacement: DirectorRuntimeBindingReplacement;
}

export interface DirectorRuntimeBindingTransitionResult {
  readonly accepted: boolean;
  readonly previousState: DirectorRuntimeBindingLifecycleState;
  readonly nextState: DirectorRuntimeBindingLifecycleState;
  readonly binding: DirectorRuntimeBinding;
  readonly reason?: string;
}

function hasOpaqueId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function freezeSource(source: Source): Source {
  return Object.freeze({
    sourceKind: source.sourceKind,
    sourceId: source.sourceId,
    runtimeRevision: source.runtimeRevision,
  });
}

function freezeTarget(target: Target): Target {
  return Object.freeze({ targetKind: target.targetKind, targetId: target.targetId });
}

function cloneBinding(
  binding: DirectorRuntimeBinding,
  lifecycle = binding.lifecycle,
  activation = binding.activation,
): DirectorRuntimeBinding {
  return Object.freeze({
    bindingId: binding.bindingId,
    source: freezeSource(binding.source),
    target: freezeTarget(binding.target),
    mappingId: binding.mappingId,
    intentKind: binding.intentKind,
    lifecycle,
    activation,
    scope: binding.scope,
    exclusivity: binding.exclusivity,
    revisionSensitive: binding.revisionSensitive,
    ...(binding.owner
      ? { owner: Object.freeze({ ...binding.owner }) }
      : {}),
    direction: "runtime-to-director" as const,
  });
}

export function createDirectorRuntimeBinding(
  input: DirectorRuntimeBindingInput,
): DirectorRuntimeBinding {
  if (!hasOpaqueId(input.bindingId)) {
    throw new TypeError("bindingId must be an opaque identifier");
  }
  if (input.direction !== undefined && input.direction !== "runtime-to-director") {
    throw new TypeError("binding direction must be runtime-to-director");
  }
  const lifecycle = input.lifecycle ?? "declared";
  const activation = input.activation ?? "disabled";
  const scope = input.scope ?? "global";
  const exclusivity = input.exclusivity ?? "shared";
  if (!isDirectorRuntimeBindingLifecycleState(lifecycle)) {
    throw new TypeError("lifecycle must be a known binding lifecycle state");
  }
  if (!isDirectorRuntimeBindingActivationState(activation)) {
    throw new TypeError("activation must be a known binding activation state");
  }
  if (!isDirectorRuntimeBindingScopeKind(scope)) {
    throw new TypeError("scope must be a known binding scope");
  }
  if (!isDirectorRuntimeBindingExclusivityMode(exclusivity)) {
    throw new TypeError("exclusivity must be a known binding exclusivity mode");
  }
  if (!isDirectorRuntimeMappingIntentKind(input.intentKind)) {
    throw new TypeError("intentKind must be a known mapping intent");
  }
  if (input.owner && (!hasOpaqueId(input.owner.ownerId) || !hasOpaqueId(input.owner.ownerKind))) {
    throw new TypeError("binding owner fields must be opaque identifiers");
  }

  const rule = createDirectorRuntimeMappingRule({
    ruleId: input.mapping.mappingId,
    sourceKind: input.mapping.source.sourceKind,
    targetKind: input.mapping.target.targetKind,
    targetId: input.mapping.target.targetId,
    intentKind: input.intentKind,
  });
  const request = createDirectorRuntimeMappingRequest({
    requestId: input.bindingId,
    source: input.mapping.source,
    payload: {},
    targetKind: input.mapping.target.targetKind,
    requireUniqueTarget: true,
  });
  const resolution = resolveDirectorRuntimeMapping(request, [rule]);
  if (resolution.status !== "resolved" || resolution.mappings.length !== 1) {
    throw new TypeError("binding requires one valid resolved mapping");
  }
  const mapping = resolution.mappings[0]!;
  return Object.freeze({
    bindingId: input.bindingId,
    source: mapping.source,
    target: mapping.target,
    mappingId: mapping.mappingId,
    intentKind: input.intentKind,
    lifecycle,
    activation,
    scope,
    exclusivity,
    revisionSensitive: input.revisionSensitive === true,
    ...(input.owner ? { owner: Object.freeze({ ...input.owner }) } : {}),
    direction: "runtime-to-director" as const,
  });
}

export function createDirectorRuntimeBindingFromResolution(
  bindingId: string,
  resolution: DirectorRuntimeMappingResolution,
  rule: DirectorRuntimeMappingRule,
  options: Omit<DirectorRuntimeBindingInput, "bindingId" | "mapping" | "intentKind"> = {},
): DirectorRuntimeBinding {
  if (resolution.status !== "resolved") {
    throw new TypeError(`cannot bind a ${resolution.status} mapping resolution`);
  }
  const validRule = createDirectorRuntimeMappingRule(rule);
  const mapping = resolution.mappings.find(
    (candidate) => candidate.mappingId === validRule.ruleId,
  );
  if (!mapping || !resolution.matchedRuleIds.includes(validRule.ruleId)) {
    throw new TypeError("resolved mapping does not contain the supplied rule");
  }
  return createDirectorRuntimeBinding({
    ...options,
    bindingId,
    mapping,
    intentKind: validRule.intentKind,
  });
}

// ─── Lifecycle ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_BINDING_TRANSITIONS = Object.freeze([
  Object.freeze(["declared", "active"] as const),
  Object.freeze(["declared", "invalid"] as const),
  Object.freeze(["declared", "retired"] as const),
  Object.freeze(["active", "suspended"] as const),
  Object.freeze(["active", "stale"] as const),
  Object.freeze(["active", "replaced"] as const),
  Object.freeze(["active", "retired"] as const),
  Object.freeze(["active", "invalid"] as const),
  Object.freeze(["suspended", "active"] as const),
  Object.freeze(["suspended", "stale"] as const),
  Object.freeze(["suspended", "replaced"] as const),
  Object.freeze(["suspended", "retired"] as const),
  Object.freeze(["suspended", "invalid"] as const),
  Object.freeze(["stale", "active"] as const),
  Object.freeze(["stale", "replaced"] as const),
  Object.freeze(["stale", "retired"] as const),
  Object.freeze(["stale", "invalid"] as const),
  Object.freeze(["replaced", "retired"] as const),
  Object.freeze(["invalid", "retired"] as const),
] as const);

export const directorRuntimeBindingTransitionRuleCount =
  DIRECTOR_RUNTIME_BINDING_TRANSITIONS.length;

export function transitionDirectorRuntimeBinding(
  binding: DirectorRuntimeBinding,
  nextState: DirectorRuntimeBindingLifecycleState,
): DirectorRuntimeBindingTransitionResult {
  if (!isDirectorRuntimeBindingLifecycleState(nextState)) {
    throw new TypeError("nextState must be a known lifecycle state");
  }
  const accepted = DIRECTOR_RUNTIME_BINDING_TRANSITIONS.some(
    ([previous, next]) => previous === binding.lifecycle && next === nextState,
  );
  const nextActivation = accepted
    ? nextState === "active" ? "enabled" : "disabled"
    : binding.activation;
  return Object.freeze({
    accepted,
    previousState: binding.lifecycle,
    nextState: accepted ? nextState : binding.lifecycle,
    binding: accepted
      ? cloneBinding(binding, nextState, nextActivation)
      : cloneBinding(binding),
    ...(!accepted ? { reason: "BINDING_TRANSITION_NOT_ALLOWED" } : {}),
  });
}

function requireTransition(
  binding: DirectorRuntimeBinding,
  state: DirectorRuntimeBindingLifecycleState,
): DirectorRuntimeBinding {
  const result = transitionDirectorRuntimeBinding(binding, state);
  if (!result.accepted) throw new TypeError(result.reason);
  return result.binding;
}

export function activateDirectorRuntimeBinding(
  binding: DirectorRuntimeBinding,
): DirectorRuntimeBinding {
  return requireTransition(binding, "active");
}
export function suspendDirectorRuntimeBinding(
  binding: DirectorRuntimeBinding,
): DirectorRuntimeBinding {
  return requireTransition(binding, "suspended");
}
export function retireDirectorRuntimeBinding(
  binding: DirectorRuntimeBinding,
): DirectorRuntimeBinding {
  return requireTransition(binding, "retired");
}
export function markDirectorRuntimeBindingStale(
  binding: DirectorRuntimeBinding,
): DirectorRuntimeBinding {
  return requireTransition(binding, "stale");
}
export function replaceDirectorRuntimeBinding(
  binding: DirectorRuntimeBinding,
  replacementBindingId: string,
): DirectorRuntimeBindingReplacementResult {
  if (!hasOpaqueId(replacementBindingId)) {
    throw new TypeError("replacementBindingId must be an opaque identifier");
  }
  return Object.freeze({
    binding: requireTransition(binding, "replaced"),
    replacement: Object.freeze({
      previousBindingId: binding.bindingId,
      replacementBindingId,
    }),
  });
}

// ─── Collections, groups, queries, and conflicts ───────────────────────────

export function createDirectorRuntimeBindingCollection(
  collectionId: string,
  bindings: readonly DirectorRuntimeBinding[],
): DirectorRuntimeBindingCollection {
  if (!hasOpaqueId(collectionId)) {
    throw new TypeError("collectionId must be an opaque identifier");
  }
  return Object.freeze({
    collectionId,
    bindings: Object.freeze(bindings.map((binding) => cloneBinding(binding))),
  });
}

export function createDirectorRuntimeBindingGroup(
  groupId: string,
  bindingIds: readonly string[],
): DirectorRuntimeBindingGroup {
  if (!hasOpaqueId(groupId) || bindingIds.some((id) => !hasOpaqueId(id))) {
    throw new TypeError("group identities must be opaque identifiers");
  }
  return Object.freeze({ groupId, bindingIds: Object.freeze([...bindingIds]) });
}

export function findDirectorRuntimeBindingById(
  collection: DirectorRuntimeBindingCollection,
  bindingId: string,
): DirectorRuntimeBinding | undefined {
  return collection.bindings.find((binding) => binding.bindingId === bindingId);
}

function query(
  collection: DirectorRuntimeBindingCollection,
  predicate: (binding: DirectorRuntimeBinding) => boolean,
): readonly DirectorRuntimeBinding[] {
  return Object.freeze(collection.bindings.filter(predicate));
}

export function findDirectorRuntimeBindingsBySourceId(
  collection: DirectorRuntimeBindingCollection,
  sourceId: string,
): readonly DirectorRuntimeBinding[] {
  return query(collection, (binding) => binding.source.sourceId === sourceId);
}
export function findDirectorRuntimeBindingsByTargetId(
  collection: DirectorRuntimeBindingCollection,
  targetId: string,
): readonly DirectorRuntimeBinding[] {
  return query(collection, (binding) => binding.target.targetId === targetId);
}
export function findDirectorRuntimeBindingsByLifecycle(
  collection: DirectorRuntimeBindingCollection,
  lifecycle: DirectorRuntimeBindingLifecycleState,
): readonly DirectorRuntimeBinding[] {
  return isDirectorRuntimeBindingLifecycleState(lifecycle)
    ? query(collection, (binding) => binding.lifecycle === lifecycle)
    : Object.freeze([]);
}
export function findDirectorRuntimeBindingsByIntent(
  collection: DirectorRuntimeBindingCollection,
  intent: DirectorRuntimeMappingIntentKind,
): readonly DirectorRuntimeBinding[] {
  return isDirectorRuntimeMappingIntentKind(intent)
    ? query(collection, (binding) => binding.intentKind === intent)
    : Object.freeze([]);
}
export function findDirectorRuntimeBindingsByScope(
  collection: DirectorRuntimeBindingCollection,
  scope: DirectorRuntimeBindingScopeKind,
): readonly DirectorRuntimeBinding[] {
  return isDirectorRuntimeBindingScopeKind(scope)
    ? query(collection, (binding) => binding.scope === scope)
    : Object.freeze([]);
}

function sameSource(a: DirectorRuntimeBinding, b: DirectorRuntimeBinding): boolean {
  return a.source.sourceKind === b.source.sourceKind &&
    a.source.sourceId === b.source.sourceId;
}
function sameTarget(a: DirectorRuntimeBinding, b: DirectorRuntimeBinding): boolean {
  return a.target.targetKind === b.target.targetKind &&
    a.target.targetId === b.target.targetId;
}

export function detectDirectorRuntimeBindingConflict(
  candidate: DirectorRuntimeBinding,
  existingBindings: readonly DirectorRuntimeBinding[],
): DirectorRuntimeBindingConflictKind {
  for (const existing of existingBindings) {
    const sourceMatches = sameSource(candidate, existing);
    const targetMatches = sameTarget(candidate, existing);
    if (
      candidate.bindingId === existing.bindingId &&
      sourceMatches && targetMatches &&
      candidate.mappingId === existing.mappingId &&
      candidate.intentKind === existing.intentKind
    ) return "duplicate";
    if (
      sourceMatches && targetMatches &&
      (candidate.revisionSensitive || existing.revisionSensitive) &&
      candidate.source.runtimeRevision !== existing.source.runtimeRevision
    ) return "revision-conflict";
    if (
      sourceMatches &&
      (candidate.exclusivity === "exclusive-source" ||
        existing.exclusivity === "exclusive-source")
    ) return "source-conflict";
    if (
      targetMatches &&
      (candidate.exclusivity === "exclusive-target" ||
        existing.exclusivity === "exclusive-target")
    ) return "target-conflict";
    if (
      sourceMatches && targetMatches &&
      (candidate.exclusivity === "exclusive-pair" ||
        existing.exclusivity === "exclusive-pair")
    ) return "exclusive-conflict";
    if (sourceMatches && targetMatches && candidate.intentKind !== existing.intentKind) {
      return "intent-conflict";
    }
  }
  return "none";
}

// ─── Registry and verification ─────────────────────────────────────────────

export const directorRuntimeBindingRegistry = Object.freeze([
  Object.freeze({ order: 1, concept: "Binding Identity" }),
  Object.freeze({ order: 2, concept: "Binding Lifecycle" }),
  Object.freeze({ order: 3, concept: "Binding Activation" }),
  Object.freeze({ order: 4, concept: "Binding Scope" }),
  Object.freeze({ order: 5, concept: "Binding Exclusivity" }),
  Object.freeze({ order: 6, concept: "Binding Conflict" }),
  Object.freeze({ order: 7, concept: "Binding Transition" }),
  Object.freeze({ order: 8, concept: "Binding Collection" }),
  Object.freeze({ order: 9, concept: "Binding Group" }),
  Object.freeze({ order: 10, concept: "Binding Replacement" }),
  Object.freeze({ order: 11, concept: "Runtime Authority" }),
] as const);
export const directorRuntimeBindingRegistryCount =
  directorRuntimeBindingRegistry.length;

export function getDirectorRuntimeBindingRegistry(): typeof directorRuntimeBindingRegistry {
  return directorRuntimeBindingRegistry;
}

export function verifyDirectorRuntimeIntegrationBinding(): boolean {
  return (
    directorRuntimeIntegrationBindingMetadata.identity ===
      "DRI-1:4/DirectorRuntimeIntegrationBinding" &&
    directorRuntimeIntegrationBindingMetadata.upstream ===
      directorRuntimeIntegrationMappingIdentity &&
    directorRuntimeIntegrationBindingMetadata.direction ===
      "runtime-to-director" &&
    directorRuntimeBindingTransitionRuleCount ===
      DIRECTOR_RUNTIME_BINDING_TRANSITIONS.length &&
    directorRuntimeBindingRegistryCount === directorRuntimeBindingRegistry.length
  );
}
