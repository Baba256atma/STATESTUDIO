/** DRI-2:2 — immutable contracts around the DRI-2:1 binding semantics. */

import {
  RUNTIME_STATE_CONTEXT_BINDING_SCOPES,
  RUNTIME_STATE_CONTEXT_BINDING_STATUSES,
  createBoundRuntimeContext,
  createRuntimeStateContextBinding,
  directorRuntimeStateContextBindingFoundationIdentity,
  isRuntimeStateContextBindingBound,
  type BoundRuntimeContext,
  type RuntimeContextReference,
  type RuntimeStateContextBinding,
  type RuntimeStateContextBindingScope,
  type RuntimeStateContextBindingStatus,
  type RuntimeStateReference,
} from "@/app/lib/dri/directorRuntimeStateContextBindingFoundation";

export type {
  BoundRuntimeContext, RuntimeContextReference, RuntimeStateContextBinding,
  RuntimeStateContextBindingScope, RuntimeStateContextBindingStatus, RuntimeStateReference,
} from "@/app/lib/dri/directorRuntimeStateContextBindingFoundation";

export const directorRuntimeStateContextBindingContractsIdentity =
  "DRI-2:2/DirectorRuntimeStateContextBindingContracts" as const;
export const directorRuntimeStateContextBindingContractsVersion = "2.2.0" as const;
export const directorRuntimeStateContextBindingContractsNamespace =
  "nexora.dri.runtime.state-context-binding.contracts" as const;
export const directorRuntimeStateContextBindingContractsUpstream =
  directorRuntimeStateContextBindingFoundationIdentity;

export const RUNTIME_CONTEXT_DIMENSIONS = Object.freeze([
  "workspace", "goal", "object", "pack", "mode", "lens", "timelinePosition",
] as const);
export type RuntimeContextDimension = (typeof RUNTIME_CONTEXT_DIMENSIONS)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_COMPATIBILITY_STATES = Object.freeze([
  "compatible", "incomplete", "incompatible",
] as const);
export type RuntimeStateContextBindingCompatibilityState =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_COMPATIBILITY_STATES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_COMPATIBILITY_REASON_IDS = Object.freeze([
  "missing-required-context", "scope-context-mismatch", "invalid-runtime-state-reference",
  "invalid-binding-identity", "context-hierarchy-conflict",
] as const);
export type RuntimeStateContextBindingCompatibilityReasonId =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_COMPATIBILITY_REASON_IDS)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_CONSTRAINT_KINDS = Object.freeze([
  "identity", "scope", "context", "hierarchy", "runtime-state", "result", "compatibility",
] as const);
export type RuntimeStateContextBindingConstraintKind =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_CONSTRAINT_KINDS)[number];

export interface RuntimeStateContextBindingRequest {
  readonly bindingId: string;
  readonly runtimeState: RuntimeStateReference;
  readonly context: RuntimeContextReference;
  readonly scope: RuntimeStateContextBindingScope;
}

export interface RuntimeStateContextBindingRequirement {
  readonly scope: RuntimeStateContextBindingScope;
  readonly dimension: RuntimeContextDimension;
  readonly required: true;
}

export interface RuntimeStateContextBindingConstraint {
  readonly id: string;
  readonly kind: RuntimeStateContextBindingConstraintKind;
  readonly description: string;
}

export interface RuntimeStateContextBindingCompatibilityReason {
  readonly id: RuntimeStateContextBindingCompatibilityReasonId;
  readonly description: string;
}

export interface RuntimeStateContextBindingCompatibility {
  readonly state: RuntimeStateContextBindingCompatibilityState;
  readonly reasons: readonly RuntimeStateContextBindingCompatibilityReason[];
}

export interface RuntimeStateContextBindingResolution {
  readonly identity: Readonly<{ bindingId: string }>;
  readonly requestedScope: RuntimeStateContextBindingScope;
  readonly status: RuntimeStateContextBindingStatus;
  readonly runtimeState: RuntimeStateReference | null;
  readonly context: RuntimeContextReference;
  readonly requirements: readonly RuntimeStateContextBindingRequirement[];
  readonly constraints: readonly RuntimeStateContextBindingConstraint[];
}

export type RuntimeStateContextBindingConstraintState = "satisfied" | "violated" | "unknown";
export interface RuntimeStateContextBindingInspection {
  readonly bindingId: string;
  readonly runtimeStateId: string | null;
  readonly scope: RuntimeStateContextBindingScope;
  readonly status: RuntimeStateContextBindingStatus;
  readonly availableContextDimensions: readonly RuntimeContextDimension[];
  readonly missingRequiredDimensions: readonly RuntimeContextDimension[];
  readonly constraintState: RuntimeStateContextBindingConstraintState;
}

interface NonBoundRuntimeStateContextBindingResult {
  readonly binding: RuntimeStateContextBinding;
  readonly resolution: RuntimeStateContextBindingResolution;
  readonly compatibility: RuntimeStateContextBindingCompatibility;
}
export interface BoundRuntimeStateContextBindingResult {
  readonly status: "bound";
  readonly binding: RuntimeStateContextBinding & {
    readonly runtimeState: RuntimeStateReference;
    readonly status: "bound";
  };
  readonly boundContext: BoundRuntimeContext;
  readonly resolution: RuntimeStateContextBindingResolution;
  readonly compatibility: RuntimeStateContextBindingCompatibility;
}
export interface PartialRuntimeStateContextBindingResult
  extends NonBoundRuntimeStateContextBindingResult { readonly status: "partial"; }
export interface UnboundRuntimeStateContextBindingResult
  extends NonBoundRuntimeStateContextBindingResult { readonly status: "unbound"; }
export interface InvalidRuntimeStateContextBindingResult
  extends NonBoundRuntimeStateContextBindingResult { readonly status: "invalid"; }
export type RuntimeStateContextBindingResult = BoundRuntimeStateContextBindingResult |
  PartialRuntimeStateContextBindingResult | UnboundRuntimeStateContextBindingResult |
  InvalidRuntimeStateContextBindingResult;

const REQUIRED_DIMENSIONS_BY_SCOPE = Object.freeze({
  global: Object.freeze([] as const),
  workspace: Object.freeze(["workspace"] as const),
  goal: Object.freeze(["workspace", "goal"] as const),
  object: Object.freeze(["workspace", "goal", "object"] as const),
  pack: Object.freeze(["workspace", "goal", "object", "pack"] as const),
});
const CONTEXT_KEYS = Object.freeze({
  workspace: "workspaceId", goal: "goalId", object: "objectId", pack: "packId",
  mode: "modeId", lens: "lensId", timelinePosition: "timelinePosition",
} as const);

export const runtimeStateContextBindingRequirements = Object.freeze(
  RUNTIME_STATE_CONTEXT_BINDING_SCOPES.flatMap((scope) =>
    REQUIRED_DIMENSIONS_BY_SCOPE[scope].map((dimension) => Object.freeze({
      scope, dimension, required: true as const,
    }))),
);

export const runtimeStateContextBindingConstraints = Object.freeze([
  Object.freeze({ id: "binding-identity-valid", kind: "identity" as const,
    description: "The caller-supplied binding identity is non-empty." }),
  Object.freeze({ id: "scope-context-compatible", kind: "scope" as const,
    description: "The requested scope is supported by its context." }),
  Object.freeze({ id: "runtime-state-reference-valid", kind: "runtime-state" as const,
    description: "The runtime-state reference has a complete identity." }),
  Object.freeze({ id: "context-hierarchy-consistent", kind: "hierarchy" as const,
    description: "Context dimensions preserve the Foundation hierarchy." }),
  Object.freeze({ id: "bound-result-integrity", kind: "result" as const,
    description: "Only a bound result exposes a BoundRuntimeContext." }),
] as const satisfies readonly RuntimeStateContextBindingConstraint[]);

const REASON_DESCRIPTIONS: Readonly<Record<RuntimeStateContextBindingCompatibilityReasonId, string>> =
  Object.freeze({
    "missing-required-context": "One or more context dimensions required by the scope are absent.",
    "scope-context-mismatch": "The supplied context cannot satisfy the requested scope.",
    "invalid-runtime-state-reference": "The runtime-state reference identity is malformed.",
    "invalid-binding-identity": "The caller-supplied binding identity is malformed.",
    "context-hierarchy-conflict": "The supplied context contradicts the Foundation hierarchy.",
  });

function isAvailable(value: unknown): boolean {
  return (typeof value === "string" && value.trim().length > 0) ||
    (typeof value === "number" && Number.isFinite(value));
}

export function createRuntimeStateContextBindingRequest(
  input: RuntimeStateContextBindingRequest,
): RuntimeStateContextBindingRequest {
  return Object.freeze({
    bindingId: input.bindingId,
    runtimeState: Object.freeze({ ...input.runtimeState }),
    context: Object.freeze({ ...input.context }),
    scope: input.scope,
  });
}

export function resolveRuntimeStateContextBindingRequirements(
  scope: RuntimeStateContextBindingScope,
): readonly RuntimeStateContextBindingRequirement[] {
  return Object.freeze(runtimeStateContextBindingRequirements.filter((item) => item.scope === scope));
}

function dimensionsFor(context: RuntimeContextReference): readonly RuntimeContextDimension[] {
  return Object.freeze(RUNTIME_CONTEXT_DIMENSIONS.filter((dimension) =>
    isAvailable(context[CONTEXT_KEYS[dimension]])));
}

export function inspectRuntimeStateContextBinding(
  binding: RuntimeStateContextBinding,
): RuntimeStateContextBindingInspection {
  const available = dimensionsFor(binding.context);
  const missing = Object.freeze(resolveRuntimeStateContextBindingRequirements(binding.scope)
    .map(({ dimension }) => dimension).filter((dimension) => !available.includes(dimension)));
  return Object.freeze({
    bindingId: binding.bindingId,
    runtimeStateId: binding.runtimeState?.runtimeStateId ?? null,
    scope: binding.scope,
    status: binding.status,
    availableContextDimensions: available,
    missingRequiredDimensions: missing,
    constraintState: binding.status === "invalid" ? "violated" as const :
      binding.status === "bound" ? "satisfied" as const : "unknown" as const,
  });
}

function reason(id: RuntimeStateContextBindingCompatibilityReasonId) {
  return Object.freeze({ id, description: REASON_DESCRIPTIONS[id] });
}

export function resolveRuntimeStateContextBindingCompatibility(
  binding: RuntimeStateContextBinding,
): RuntimeStateContextBindingCompatibility {
  if (binding.status === "bound") return Object.freeze({ state: "compatible" as const, reasons: Object.freeze([]) });
  if (binding.status === "partial") return Object.freeze({
    state: "incomplete" as const, reasons: Object.freeze([reason("missing-required-context")]),
  });
  const reasons: RuntimeStateContextBindingCompatibilityReason[] = [];
  if (!binding.bindingId.trim()) reasons.push(reason("invalid-binding-identity"));
  if (binding.runtimeState !== null &&
      [binding.runtimeState.runtimeStateId, binding.runtimeState.runtimeStateVersion,
        binding.runtimeState.runtimeStateKind].some((value) => !value.trim()))
    reasons.push(reason("invalid-runtime-state-reference"));
  const available = dimensionsFor(binding.context);
  const hierarchyConflict = (available.includes("goal") && !available.includes("workspace")) ||
    (available.includes("object") && !available.includes("goal")) ||
    (available.includes("pack") && !available.includes("object"));
  if (hierarchyConflict) reasons.push(reason("context-hierarchy-conflict"));
  if (binding.status === "invalid" && reasons.length === 0) reasons.push(reason("scope-context-mismatch"));
  return Object.freeze({
    state: "incompatible" as const,
    reasons: Object.freeze(reasons),
  });
}

function resolveBinding(input: RuntimeStateContextBindingRequest | RuntimeStateContextBinding) {
  return createRuntimeStateContextBinding({
    bindingId: input.bindingId,
    runtimeState: input.runtimeState,
    context: input.context,
    scope: input.scope,
  });
}

export function createRuntimeStateContextBindingResult(
  input: RuntimeStateContextBindingRequest | RuntimeStateContextBinding,
): RuntimeStateContextBindingResult {
  const binding = resolveBinding(input);
  const resolution = Object.freeze({
    identity: Object.freeze({ bindingId: binding.bindingId }), requestedScope: binding.scope,
    status: binding.status, runtimeState: binding.runtimeState, context: binding.context,
    requirements: resolveRuntimeStateContextBindingRequirements(binding.scope),
    constraints: runtimeStateContextBindingConstraints,
  });
  const compatibility = resolveRuntimeStateContextBindingCompatibility(binding);
  if (isRuntimeStateContextBindingBound(binding)) {
    const boundContext = createBoundRuntimeContext(binding);
    if (boundContext !== null) return Object.freeze({
      status: "bound" as const, binding, boundContext, resolution, compatibility,
    });
  }
  return Object.freeze({ status: binding.status, binding, resolution, compatibility }) as
    PartialRuntimeStateContextBindingResult | UnboundRuntimeStateContextBindingResult |
    InvalidRuntimeStateContextBindingResult;
}

export function isBoundRuntimeStateContextBindingResult(
  result: RuntimeStateContextBindingResult,
): result is BoundRuntimeStateContextBindingResult {
  return result.status === "bound";
}

export const runtimeStateContextBindingContractFamilies = Object.freeze([
  "BindingRequest", "BindingResolution", "BindingResult", "BindingRequirement",
  "BindingConstraint", "BindingInspection", "BindingCompatibility", "ContractDescriptor",
] as const);
export const runtimeStateContextBindingContractTypeNames = Object.freeze([
  "RuntimeStateContextBindingRequest", "RuntimeStateContextBindingResolution",
  "RuntimeStateContextBindingResult", "BoundRuntimeStateContextBindingResult",
  "PartialRuntimeStateContextBindingResult", "UnboundRuntimeStateContextBindingResult",
  "InvalidRuntimeStateContextBindingResult", "RuntimeStateContextBindingRequirement",
  "RuntimeStateContextBindingConstraint", "RuntimeStateContextBindingInspection",
  "RuntimeStateContextBindingCompatibility", "RuntimeStateContextBindingCompatibilityReason",
] as const);
export const runtimeStateContextBindingContractsPublicApiSurface = Object.freeze([
  "createRuntimeStateContextBindingRequest", "resolveRuntimeStateContextBindingRequirements",
  "inspectRuntimeStateContextBinding", "resolveRuntimeStateContextBindingCompatibility",
  "createRuntimeStateContextBindingResult", "isBoundRuntimeStateContextBindingResult",
] as const);

export const runtimeStateContextBindingContractsRegistry = Object.freeze({
  contractFamilies: runtimeStateContextBindingContractFamilies,
  contractFamilyCount: runtimeStateContextBindingContractFamilies.length,
  contractTypes: runtimeStateContextBindingContractTypeNames,
  contractTypeCount: runtimeStateContextBindingContractTypeNames.length,
  requestResultContracts: Object.freeze(runtimeStateContextBindingContractTypeNames.slice(0, 7)),
  requirementContracts: Object.freeze(["RuntimeStateContextBindingRequirement"] as const),
  constraintContracts: Object.freeze(["RuntimeStateContextBindingConstraint"] as const),
  inspectionContracts: Object.freeze(["RuntimeStateContextBindingInspection"] as const),
  compatibilityContracts: Object.freeze([
    "RuntimeStateContextBindingCompatibility", "RuntimeStateContextBindingCompatibilityReason",
  ] as const),
  publicApis: runtimeStateContextBindingContractsPublicApiSurface,
  publicApiCount: runtimeStateContextBindingContractsPublicApiSurface.length,
});

export const directorRuntimeStateContextBindingContracts = Object.freeze({
  identity: directorRuntimeStateContextBindingContractsIdentity,
  version: directorRuntimeStateContextBindingContractsVersion,
  namespace: directorRuntimeStateContextBindingContractsNamespace,
  layer: "DRI" as const,
  capability: "RuntimeStateContextBinding" as const,
  stage: "Contracts" as const,
  immediateDependency: directorRuntimeStateContextBindingContractsUpstream,
  contractFamilies: runtimeStateContextBindingContractFamilies,
  bindingScopes: RUNTIME_STATE_CONTEXT_BINDING_SCOPES,
  bindingStatuses: RUNTIME_STATE_CONTEXT_BINDING_STATUSES,
  requirements: runtimeStateContextBindingRequirements,
  constraints: runtimeStateContextBindingConstraints,
  constraintVocabulary: RUNTIME_STATE_CONTEXT_BINDING_CONSTRAINT_KINDS,
  compatibilityVocabulary: RUNTIME_STATE_CONTEXT_BINDING_COMPATIBILITY_STATES,
  compatibilityReasonIds: RUNTIME_STATE_CONTEXT_BINDING_COMPATIBILITY_REASON_IDS,
  publicApiSurface: runtimeStateContextBindingContractsPublicApiSurface,
  registry: runtimeStateContextBindingContractsRegistry,
});
