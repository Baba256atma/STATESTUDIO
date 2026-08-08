/**
 * DRI-2:1 — Runtime State & Context Binding Foundation.
 * Plain-data contracts only: this module does not own or execute runtime state.
 */

import { directorRuntimeIntegrationPublicIndexIdentity } from
  "@/app/lib/dri/directorRuntimeIntegrationPublicIndex";

export const directorRuntimeStateContextBindingFoundationIdentity =
  "DRI-2:1/DirectorRuntimeStateContextBindingFoundation" as const;
export const directorRuntimeStateContextBindingFoundationVersion = "2.1.0" as const;
export const directorRuntimeStateContextBindingFoundationNamespace =
  "nexora.dri.runtime.state-context-binding.foundation" as const;
export const directorRuntimeStateContextBindingFoundationUpstream =
  directorRuntimeIntegrationPublicIndexIdentity;

export const RUNTIME_STATE_CONTEXT_BINDING_SCOPES = Object.freeze([
  "global", "workspace", "goal", "object", "pack",
] as const);
export type RuntimeStateContextBindingScope =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_SCOPES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_STATUSES = Object.freeze([
  "unbound", "partial", "bound", "invalid",
] as const);
export type RuntimeStateContextBindingStatus =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_STATUSES)[number];
export type BoundRuntimeStateContextBindingStatus = "bound";

export interface RuntimeStateReference {
  readonly runtimeStateId: string;
  readonly runtimeStateVersion: string;
  readonly runtimeStateKind: string;
}

export interface RuntimeContextReference {
  readonly workspaceId?: string;
  readonly goalId?: string;
  readonly objectId?: string;
  readonly packId?: string;
  readonly modeId?: string;
  readonly lensId?: string;
  readonly timelinePosition?: string | number;
}

export interface RuntimeStateContextBindingIdentity {
  readonly bindingId: string;
}

export interface RuntimeStateContextBinding {
  readonly bindingId: string;
  readonly runtimeState: RuntimeStateReference | null;
  readonly context: RuntimeContextReference;
  readonly scope: RuntimeStateContextBindingScope;
  readonly status: RuntimeStateContextBindingStatus;
}

export interface BoundRuntimeContext {
  readonly identity: RuntimeStateContextBindingIdentity;
  readonly runtimeState: RuntimeStateReference;
  readonly context: RuntimeContextReference;
  readonly scope: RuntimeStateContextBindingScope;
  readonly status: BoundRuntimeStateContextBindingStatus;
}

export interface CreateRuntimeStateContextBindingInput {
  readonly bindingId: string;
  readonly runtimeState: RuntimeStateReference | null;
  readonly context?: RuntimeContextReference;
  readonly scope: RuntimeStateContextBindingScope;
}

const CONTEXT_KEY_BY_SCOPE = Object.freeze({
  workspace: "workspaceId", goal: "goalId", object: "objectId", pack: "packId",
} as const);

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasMalformedSuppliedValue(context: RuntimeContextReference): boolean {
  return Object.values(context).some((value) =>
    value !== undefined &&
    !((typeof value === "string" && value.trim().length > 0) ||
      (typeof value === "number" && Number.isFinite(value))),
  );
}

function hasContradictoryHierarchy(context: RuntimeContextReference): boolean {
  return (context.goalId !== undefined && context.workspaceId === undefined) ||
    (context.objectId !== undefined && context.goalId === undefined) ||
    (context.packId !== undefined && context.objectId === undefined);
}

export function resolveRuntimeStateContextBindingStatus(
  runtimeState: RuntimeStateReference | null,
  context: RuntimeContextReference,
  scope: RuntimeStateContextBindingScope,
): RuntimeStateContextBindingStatus {
  if (runtimeState === null) return "unbound";
  if (!isNonEmpty(runtimeState.runtimeStateId) ||
      !isNonEmpty(runtimeState.runtimeStateVersion) ||
      !isNonEmpty(runtimeState.runtimeStateKind) ||
      hasMalformedSuppliedValue(context) || hasContradictoryHierarchy(context)) return "invalid";
  if (scope === "global") return "bound";
  const requiredKey = CONTEXT_KEY_BY_SCOPE[scope];
  return isNonEmpty(context[requiredKey]) ? "bound" : "partial";
}

export function createRuntimeStateContextBinding(
  input: CreateRuntimeStateContextBindingInput,
): RuntimeStateContextBinding {
  const context = Object.freeze({ ...(input.context ?? {}) });
  const runtimeState = input.runtimeState === null ? null : Object.freeze({ ...input.runtimeState });
  return Object.freeze({
    bindingId: input.bindingId,
    runtimeState,
    context,
    scope: input.scope,
    status: isNonEmpty(input.bindingId)
      ? resolveRuntimeStateContextBindingStatus(runtimeState, context, input.scope)
      : "invalid" as const,
  });
}

export function isRuntimeStateContextBindingBound(
  binding: RuntimeStateContextBinding,
): binding is RuntimeStateContextBinding & {
  readonly runtimeState: RuntimeStateReference;
  readonly status: "bound";
} {
  return binding.status === "bound" && binding.runtimeState !== null;
}

export function createBoundRuntimeContext(
  binding: RuntimeStateContextBinding,
): BoundRuntimeContext | null {
  if (!isRuntimeStateContextBindingBound(binding)) return null;
  return Object.freeze({
    identity: Object.freeze({ bindingId: binding.bindingId }),
    runtimeState: Object.freeze({ ...binding.runtimeState }),
    context: Object.freeze({ ...binding.context }),
    scope: binding.scope,
    status: "bound" as const,
  });
}

export const runtimeStateContextBindingFoundationContractNames = Object.freeze([
  "RuntimeStateReference", "RuntimeContextReference", "RuntimeStateContextBinding",
  "BoundRuntimeContext", "RuntimeStateContextBindingStatus",
  "RuntimeStateContextBindingScope", "RuntimeStateContextBindingIdentity",
] as const);
export const runtimeStateContextBindingFoundationPublicApiNames = Object.freeze([
  "createRuntimeStateContextBinding", "resolveRuntimeStateContextBindingStatus",
  "isRuntimeStateContextBindingBound", "createBoundRuntimeContext",
] as const);

export const runtimeStateContextBindingFoundationRegistry = Object.freeze({
  contracts: runtimeStateContextBindingFoundationContractNames,
  contractCount: runtimeStateContextBindingFoundationContractNames.length,
  scopes: RUNTIME_STATE_CONTEXT_BINDING_SCOPES,
  scopeCount: RUNTIME_STATE_CONTEXT_BINDING_SCOPES.length,
  statuses: RUNTIME_STATE_CONTEXT_BINDING_STATUSES,
  statusCount: RUNTIME_STATE_CONTEXT_BINDING_STATUSES.length,
  publicApis: runtimeStateContextBindingFoundationPublicApiNames,
  publicApiCount: runtimeStateContextBindingFoundationPublicApiNames.length,
});

export const directorRuntimeStateContextBindingFoundation = Object.freeze({
  identity: directorRuntimeStateContextBindingFoundationIdentity,
  version: directorRuntimeStateContextBindingFoundationVersion,
  namespace: directorRuntimeStateContextBindingFoundationNamespace,
  layer: "DRI" as const,
  capability: "RuntimeStateContextBinding" as const,
  stage: "Foundation" as const,
  upstreamDependency: directorRuntimeStateContextBindingFoundationUpstream,
  contracts: runtimeStateContextBindingFoundationContractNames,
  bindingScopes: RUNTIME_STATE_CONTEXT_BINDING_SCOPES,
  bindingStatuses: RUNTIME_STATE_CONTEXT_BINDING_STATUSES,
  publicApiSurface: runtimeStateContextBindingFoundationPublicApiNames,
  registry: runtimeStateContextBindingFoundationRegistry,
});
