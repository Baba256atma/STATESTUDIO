/** DRI-2:3 — stateless coordination engine for contract-safe binding evaluation. */

import {
  createRuntimeStateContextBindingRequest,
  createRuntimeStateContextBindingResult,
  directorRuntimeStateContextBindingContractsIdentity,
  inspectRuntimeStateContextBinding,
  isBoundRuntimeStateContextBindingResult,
  resolveRuntimeStateContextBindingCompatibility,
  resolveRuntimeStateContextBindingRequirements,
  type BoundRuntimeStateContextBindingResult,
  type RuntimeStateContextBinding,
  type RuntimeStateContextBindingCompatibility,
  type RuntimeStateContextBindingInspection,
  type RuntimeStateContextBindingRequest,
  type RuntimeStateContextBindingRequirement,
  type RuntimeStateContextBindingResult,
} from "@/app/lib/dri/directorRuntimeStateContextBindingContracts";

// Identity-preserving propagation for later certified consumer boundaries.
export { createRuntimeStateContextBindingRequest, isBoundRuntimeStateContextBindingResult };
export type {
  BoundRuntimeContext, RuntimeContextReference, RuntimeStateContextBindingScope,
  RuntimeStateContextBindingStatus, RuntimeStateReference,
} from "@/app/lib/dri/directorRuntimeStateContextBindingContracts";
export type {
  RuntimeStateContextBindingInspection, RuntimeStateContextBindingRequest,
  RuntimeStateContextBindingResult,
} from "@/app/lib/dri/directorRuntimeStateContextBindingContracts";

export const directorRuntimeStateContextBindingEngineIdentity =
  "DRI-2:3/DirectorRuntimeStateContextBindingEngine" as const;
export const directorRuntimeStateContextBindingEngineVersion = "2.3.0" as const;
export const directorRuntimeStateContextBindingEngineNamespace =
  "nexora.dri.runtime.state-context-binding.engine" as const;
export const directorRuntimeStateContextBindingEngineUpstream =
  directorRuntimeStateContextBindingContractsIdentity;

export const RUNTIME_STATE_CONTEXT_BINDING_ENGINE_EVALUATION_PHASES = Object.freeze([
  "normalize-input", "resolve-requirements", "evaluate-compatibility",
  "resolve-binding-result", "create-inspection", "create-output",
] as const);
export type RuntimeStateContextBindingEngineEvaluationPhase =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_ENGINE_EVALUATION_PHASES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_ENGINE_TRACE_PHASES = Object.freeze([
  "requirements-resolved", "context-inspected", "compatibility-resolved",
  "binding-resolved", "result-created", "inspection-created",
] as const);
export type RuntimeStateContextBindingEngineTracePhase =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_ENGINE_TRACE_PHASES)[number];

export type RuntimeStateContextBindingEngineSource =
  RuntimeStateContextBindingRequest | RuntimeStateContextBinding;

export interface RuntimeStateContextBindingEngineInput {
  readonly request: RuntimeStateContextBindingEngineSource;
}

export interface RuntimeStateContextBindingEngineTraceEntry {
  readonly phase: RuntimeStateContextBindingEngineTracePhase;
}

export interface RuntimeStateContextBindingEngineOutput {
  readonly request: RuntimeStateContextBindingEngineSource;
  readonly requirements: readonly RuntimeStateContextBindingRequirement[];
  readonly compatibility: RuntimeStateContextBindingCompatibility;
  readonly result: RuntimeStateContextBindingResult;
  readonly inspection: RuntimeStateContextBindingInspection;
  readonly trace: readonly RuntimeStateContextBindingEngineTraceEntry[];
}

export interface BoundRuntimeStateContextBindingEngineOutput
  extends RuntimeStateContextBindingEngineOutput {
  readonly result: BoundRuntimeStateContextBindingResult;
}

function isResolvedBinding(source: RuntimeStateContextBindingEngineSource):
  source is RuntimeStateContextBinding {
  return "status" in source;
}

export function normalizeRuntimeStateContextBindingEngineInput(
  input: RuntimeStateContextBindingEngineInput | RuntimeStateContextBindingRequest |
    RuntimeStateContextBinding,
): RuntimeStateContextBindingEngineInput {
  const source = "request" in input ? input.request : input;
  const request = isResolvedBinding(source)
    ? Object.freeze({
      bindingId: source.bindingId,
      runtimeState: source.runtimeState === null ? null : Object.freeze({ ...source.runtimeState }),
      context: Object.freeze({ ...source.context }),
      scope: source.scope,
      status: source.status,
    })
    : createRuntimeStateContextBindingRequest(source);
  return Object.freeze({ request });
}

function createTrace(): readonly RuntimeStateContextBindingEngineTraceEntry[] {
  return Object.freeze(RUNTIME_STATE_CONTEXT_BINDING_ENGINE_TRACE_PHASES.map((phase) =>
    Object.freeze({ phase })));
}

export function createRuntimeStateContextBindingEngineOutput(
  input: RuntimeStateContextBindingEngineInput,
): RuntimeStateContextBindingEngineOutput {
  const request = input.request;
  const requirements = resolveRuntimeStateContextBindingRequirements(request.scope);
  const result = createRuntimeStateContextBindingResult(request);
  const compatibility = resolveRuntimeStateContextBindingCompatibility(result.binding);
  const inspection = inspectRuntimeStateContextBinding(result.binding);
  return Object.freeze({
    request, requirements, compatibility, result, inspection, trace: createTrace(),
  });
}

export function executeRuntimeStateContextBindingEngine(
  input: RuntimeStateContextBindingEngineInput | RuntimeStateContextBindingRequest |
    RuntimeStateContextBinding,
): RuntimeStateContextBindingEngineOutput {
  return createRuntimeStateContextBindingEngineOutput(
    normalizeRuntimeStateContextBindingEngineInput(input),
  );
}

export function isRuntimeStateContextBindingEngineOutputBound(
  output: RuntimeStateContextBindingEngineOutput,
): output is BoundRuntimeStateContextBindingEngineOutput {
  return isBoundRuntimeStateContextBindingResult(output.result);
}

export const runtimeStateContextBindingEngineInputContractNames = Object.freeze([
  "RuntimeStateContextBindingEngineInput",
] as const);
export const runtimeStateContextBindingEngineOutputContractNames = Object.freeze([
  "RuntimeStateContextBindingEngineOutput", "BoundRuntimeStateContextBindingEngineOutput",
  "RuntimeStateContextBindingEngineTraceEntry",
] as const);
export const runtimeStateContextBindingEngineApiNames = Object.freeze([
  "normalizeRuntimeStateContextBindingEngineInput",
  "createRuntimeStateContextBindingEngineOutput",
  "executeRuntimeStateContextBindingEngine",
] as const);
export const runtimeStateContextBindingEnginePredicateNames = Object.freeze([
  "isRuntimeStateContextBindingEngineOutputBound",
] as const);
export const runtimeStateContextBindingEnginePublicApiSurface = Object.freeze([
  ...runtimeStateContextBindingEngineApiNames,
  ...runtimeStateContextBindingEnginePredicateNames,
] as const);

export const runtimeStateContextBindingEngineRegistry = Object.freeze({
  inputContracts: runtimeStateContextBindingEngineInputContractNames,
  inputContractCount: runtimeStateContextBindingEngineInputContractNames.length,
  outputContracts: runtimeStateContextBindingEngineOutputContractNames,
  outputContractCount: runtimeStateContextBindingEngineOutputContractNames.length,
  engineApis: runtimeStateContextBindingEngineApiNames,
  engineApiCount: runtimeStateContextBindingEngineApiNames.length,
  predicates: runtimeStateContextBindingEnginePredicateNames,
  predicateCount: runtimeStateContextBindingEnginePredicateNames.length,
  evaluationPhases: RUNTIME_STATE_CONTEXT_BINDING_ENGINE_EVALUATION_PHASES,
  evaluationPhaseCount: RUNTIME_STATE_CONTEXT_BINDING_ENGINE_EVALUATION_PHASES.length,
  tracePhases: RUNTIME_STATE_CONTEXT_BINDING_ENGINE_TRACE_PHASES,
  tracePhaseCount: RUNTIME_STATE_CONTEXT_BINDING_ENGINE_TRACE_PHASES.length,
  publicApiSurface: runtimeStateContextBindingEnginePublicApiSurface,
  publicApiCount: runtimeStateContextBindingEnginePublicApiSurface.length,
});

export const directorRuntimeStateContextBindingEngine = Object.freeze({
  identity: directorRuntimeStateContextBindingEngineIdentity,
  version: directorRuntimeStateContextBindingEngineVersion,
  namespace: directorRuntimeStateContextBindingEngineNamespace,
  layer: "DRI" as const,
  capability: "RuntimeStateContextBinding" as const,
  stage: "Engine" as const,
  immediateDependency: directorRuntimeStateContextBindingEngineUpstream,
  evaluationPhases: RUNTIME_STATE_CONTEXT_BINDING_ENGINE_EVALUATION_PHASES,
  characteristics: Object.freeze([
    "stateless", "synchronous", "deterministic", "immutable", "side-effect-free", "plain-data",
  ] as const),
  publicApiSurface: runtimeStateContextBindingEnginePublicApiSurface,
  registry: runtimeStateContextBindingEngineRegistry,
});
