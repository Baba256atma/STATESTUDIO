/** NOL-5:3 — deterministic orchestration for immutable renderer adaptation. */
import {
  adaptRuntimeObject,
  contractsId,
  contractsVersion,
  createRendererAdapterOutputContract,
  createRendererCollectionContract,
  freezeRendererObject,
  rendererAdapterCompatibilityContract,
  rendererAdapterGuarantees,
  validateRendererAdapterInputContract,
  validateRendererAdapterOutputContract,
  verifyRendererAdapterContracts,
  verifyRendererValueFrozen,
  type NexoraDirectorRuntimeObjectState,
  type NexoraObjectDirectorRendererAdapterInputContract,
  type NexoraObjectDirectorRendererAdapterOutputContract,
  type NexoraObjectDirectorRendererCollectionContract,
} from "./nexoraObjectDirectorRendererAdapterContracts.ts";

// NOL-5:3 exposes the canonical immutable boundary primitive to integrations.
export { freezeRendererObject, verifyRendererValueFrozen };

export const engineId = "NOL-5:3/NexoraObjectDirectorRendererAdapterEngine" as const;
export const engineVersion = "5.3.0" as const;
export const engineNamespace = "nexora.nol.renderer.adapter.engine" as const;
export const engineStatus = "Engine" as const;
export const engineLock = "NOL-5-3-DIRECTOR-RENDERER-ADAPTER-ENGINE-LOCKED" as const;

export interface NexoraObjectDirectorRendererAdapterEngineRequest {
  readonly requestId: string;
  readonly input: NexoraObjectDirectorRendererAdapterInputContract;
  readonly strict: boolean;
  readonly includeWarnings: boolean;
}

export interface NexoraObjectDirectorRendererAdapterEngineCollectionRequest {
  readonly requestId: string;
  readonly inputs: readonly NexoraObjectDirectorRendererAdapterInputContract[];
  readonly strict: boolean;
  readonly includeWarnings: boolean;
  readonly preserveOrder: true;
}

export interface RendererAdapterEngineValidationResult {
  readonly valid: boolean;
  readonly requestIdValid: boolean;
  readonly inputValid: boolean;
  readonly runtimeObjectValid: boolean;
  readonly sourceRuntimeIdValid: boolean;
  readonly contractCompatible: boolean;
  readonly violations: readonly string[];
}

export interface NexoraObjectDirectorRendererAdapterEngineResult {
  readonly requestId: string;
  readonly accepted: boolean;
  readonly output: NexoraObjectDirectorRendererAdapterOutputContract | null;
  readonly validation: RendererAdapterEngineValidationResult;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
  readonly deterministic: true;
  readonly deeplyFrozen: true;
}

export interface NexoraObjectDirectorRendererAdapterEngineCollectionResult {
  readonly requestId: string;
  readonly accepted: boolean;
  readonly collection: NexoraObjectDirectorRendererCollectionContract | null;
  readonly itemResults: readonly NexoraObjectDirectorRendererAdapterEngineResult[];
  readonly sourceCount: number;
  readonly outputCount: number;
  readonly failedCount: number;
  readonly orderPreserved: true;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
  readonly deterministic: true;
  readonly deeplyFrozen: true;
}

export type RendererAdapterEngineStage =
  | "request-received"
  | "input-validated"
  | "runtime-adapted"
  | "output-contracted"
  | "output-validated"
  | "result-frozen";

export interface RendererAdapterEngineExecutionTrace {
  readonly requestId: string;
  readonly stages: readonly RendererAdapterEngineStage[];
  readonly completed: boolean;
  readonly deterministic: true;
}

export interface NexoraObjectDirectorRendererAdapterEnginePolicy {
  readonly synchronous: true;
  readonly pure: true;
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly runtimeMutationForbidden: true;
  readonly rendererExecutionForbidden: true;
  readonly strictValidationSupported: true;
  readonly collectionOrderPreserved: true;
  readonly partialCollectionResultsSupported: true;
  readonly deeplyFrozenOutputs: true;
}

export interface RendererAdapterEngineStatistics {
  readonly sourceCount: number;
  readonly acceptedCount: number;
  readonly rejectedCount: number;
  readonly outputCount: number;
  readonly warningCount: number;
  readonly errorCount: number;
}

export interface RendererAdapterEngineDeterminismReport {
  readonly deterministic: boolean;
  readonly requestEquivalent: boolean;
  readonly outputEquivalent: boolean;
  readonly warningEquivalent: boolean;
  readonly errorEquivalent: boolean;
  readonly violations: readonly string[];
}

export interface NexoraObjectDirectorRendererAdapterEngineVerificationReport {
  readonly valid: boolean;
  readonly identityValid: boolean;
  readonly namespaceValid: boolean;
  readonly versionValid: boolean;
  readonly lockValid: boolean;
  readonly dependencyValid: boolean;
  readonly contractsCompatible: boolean;
  readonly policyValid: boolean;
  readonly pipelineValid: boolean;
  readonly publicSurfacesFrozen: boolean;
  readonly violations: readonly string[];
}

export const rendererAdapterEnginePolicy: NexoraObjectDirectorRendererAdapterEnginePolicy = freezeRendererObject({
  synchronous: true,
  pure: true,
  deterministic: true,
  sideEffectFree: true,
  runtimeMutationForbidden: true,
  rendererExecutionForbidden: true,
  strictValidationSupported: true,
  collectionOrderPreserved: true,
  partialCollectionResultsSupported: true,
  deeplyFrozenOutputs: true,
} as const);

export const rendererAdapterEngineStages = freezeRendererObject([
  "request-received",
  "input-validated",
  "runtime-adapted",
  "output-contracted",
  "output-validated",
  "result-frozen",
] as const satisfies readonly RendererAdapterEngineStage[]);
export const rendererAdapterEngineStageCount = rendererAdapterEngineStages.length;

export const rendererAdapterEnginePipeline = freezeRendererObject([
  { id: "validate-request", order: 1, name: "Validate Request", required: true },
  { id: "validate-input-contract", order: 2, name: "Validate Input Contract", required: true },
  { id: "adapt-runtime-object", order: 3, name: "Adapt Runtime Object", required: true },
  { id: "create-output-contract", order: 4, name: "Create Output Contract", required: true },
  { id: "validate-output-contract", order: 5, name: "Validate Output Contract", required: true },
  { id: "freeze-result", order: 6, name: "Freeze Result", required: true },
] as const);
export const rendererAdapterEnginePipelineStepCount = rendererAdapterEnginePipeline.length;

export const rendererAdapterEngineRegistry = freezeRendererObject([
  "Request Validation",
  "Single Adaptation",
  "Collection Adaptation",
  "Output Contracting",
  "Strict Validation",
  "Warning Aggregation",
  "Execution Trace",
  "Statistics",
  "Verification",
] as const);
export const rendererAdapterEngineRegistryCount = rendererAdapterEngineRegistry.length;

export const rendererAdapterEnginePublicApiSurface = freezeRendererObject([
  "validateRendererAdapterEngineRequest",
  "validateRendererAdapterEngineCollectionRequest",
  "executeRendererAdapterEngine",
  "executeRendererAdapterCollectionEngine",
  "createRendererAdapterEngineTrace",
  "createRendererAdapterEngineStatistics",
  "collectRendererAdapterEngineWarnings",
  "collectRendererAdapterEngineErrors",
  "isRendererAdapterEngineResultAccepted",
  "verifyRendererAdapterEngineDeterminism",
  "verifyRendererAdapterEngine",
] as const);
export const rendererAdapterEnginePublicApiCount = rendererAdapterEnginePublicApiSurface.length;

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeMessages(collections: readonly (readonly string[])[]): readonly string[] {
  const messages: string[] = [];
  const seen = new Set<string>();
  for (const collection of collections) {
    for (const value of collection) {
      const normalized = value.trim();
      if (normalized && !seen.has(normalized)) {
        seen.add(normalized);
        messages.push(normalized);
      }
    }
  }
  return freezeRendererObject(messages);
}

function structurallyEquivalent(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left) && Array.isArray(right) && left.length === right.length
      && left.every((value, index) => structurallyEquivalent(value, right[index]));
  }
  if (!record(left) || !record(right)) return false;
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key, index) => key === rightKeys[index] && structurallyEquivalent(left[key], right[key]));
}

function presentationWarnings(input: NexoraObjectDirectorRendererAdapterInputContract): readonly string[] {
  const runtime = record(input.runtimeObject) ? input.runtimeObject : {};
  const warnings: string[] = [];
  if (input.requestedRendererState !== undefined && !["minimum", "report", "operation"].includes(String(input.requestedRendererState))) warnings.push("Unsupported optional visual state resolved through Foundation fallback");
  if (runtime.labelMode !== undefined && !["Hidden", "Short", "Full"].includes(String(runtime.labelMode))) warnings.push("Unsupported optional label mode resolved through Foundation fallback");
  if (runtime.renderingLevel !== undefined && !["Hidden", "Minimal", "Normal", "Important", "Focused", "Operation"].includes(String(runtime.renderingLevel))) warnings.push("Unsupported optional visibility resolved through Foundation fallback");
  if (runtime.lifecycle !== undefined && !["Created", "Active", "Hidden", "Detached", "Removed", "Failed"].includes(String(runtime.lifecycle))) warnings.push("Unknown optional status resolved through Seed neutral fallback");
  return collectRendererAdapterEngineWarnings(warnings);
}

function recoverableInputViolations(violations: readonly string[]): boolean {
  return violations.every((violation) => violation === "requestedRendererState is invalid");
}

export function collectRendererAdapterEngineWarnings(...collections: readonly (readonly string[])[]): readonly string[] {
  return normalizeMessages(collections);
}

export function collectRendererAdapterEngineErrors(...collections: readonly (readonly string[])[]): readonly string[] {
  return normalizeMessages(collections);
}

export function validateRendererAdapterEngineRequest(
  request: NexoraObjectDirectorRendererAdapterEngineRequest,
): RendererAdapterEngineValidationResult {
  const requestRecord: Partial<NexoraObjectDirectorRendererAdapterEngineRequest> = record(request) ? request : {};
  const input: Partial<NexoraObjectDirectorRendererAdapterInputContract> = record(requestRecord.input) ? requestRecord.input : {};
  const requestIdValid = typeof requestRecord.requestId === "string" && requestRecord.requestId.trim().length > 0;
  const runtimeObjectValid = record(input.runtimeObject);
  const sourceRuntimeIdValid = typeof input.sourceRuntimeId === "string" && input.sourceRuntimeId.trim().length > 0;
  const inputValidation = validateRendererAdapterInputContract(requestRecord.input);
  const inputValid = inputValidation.valid;
  const contractCompatible = verifyRendererAdapterContracts().valid
    && rendererAdapterCompatibilityContract.contractsIdentity === contractsId
    && rendererAdapterCompatibilityContract.backwardCompatible;
  const violations: string[] = [];
  if (!requestIdValid) violations.push("requestId is required");
  if (!runtimeObjectValid) violations.push("runtimeObject is required");
  if (!sourceRuntimeIdValid) violations.push("sourceRuntimeId is required");
  violations.push(...inputValidation.errors);
  if (!contractCompatible) violations.push("NOL-5:2 Contracts compatibility is invalid");
  return freezeRendererObject({
    valid: requestIdValid && inputValid && runtimeObjectValid && sourceRuntimeIdValid && contractCompatible,
    requestIdValid,
    inputValid,
    runtimeObjectValid,
    sourceRuntimeIdValid,
    contractCompatible,
    violations: collectRendererAdapterEngineErrors(violations),
  });
}

export function validateRendererAdapterEngineCollectionRequest(
  request: NexoraObjectDirectorRendererAdapterEngineCollectionRequest,
): RendererAdapterEngineValidationResult {
  const requestRecord: Partial<NexoraObjectDirectorRendererAdapterEngineCollectionRequest> = record(request) ? request : {};
  const requestIdValid = typeof requestRecord.requestId === "string" && requestRecord.requestId.trim().length > 0;
  const inputs = Array.isArray(requestRecord.inputs) ? requestRecord.inputs : [];
  const collectionValid = Array.isArray(requestRecord.inputs) && requestRecord.preserveOrder === true;
  const itemValidations = inputs.map((input, index) => validateRendererAdapterEngineRequest({
    requestId: `${String(requestRecord.requestId ?? "")}:${index + 1}`,
    input,
    strict: requestRecord.strict === true,
    includeWarnings: requestRecord.includeWarnings === true,
  }));
  const runtimeObjectValid = collectionValid && itemValidations.every((item) => item.runtimeObjectValid);
  const sourceRuntimeIdValid = collectionValid && itemValidations.every((item) => item.sourceRuntimeIdValid);
  const contractCompatible = verifyRendererAdapterContracts().valid && itemValidations.every((item) => item.contractCompatible);
  const inputValid = collectionValid && itemValidations.every((item) => item.inputValid);
  const violations: string[] = [];
  if (!requestIdValid) violations.push("requestId is required");
  if (!Array.isArray(requestRecord.inputs)) violations.push("inputs must be a readonly collection");
  if (requestRecord.preserveOrder !== true) violations.push("preserveOrder must be true");
  itemValidations.forEach((item, index) => item.violations.forEach((violation) => violations.push(`inputs[${index}]: ${violation}`)));
  return freezeRendererObject({
    valid: requestIdValid && inputValid && runtimeObjectValid && sourceRuntimeIdValid && contractCompatible,
    requestIdValid,
    inputValid,
    runtimeObjectValid,
    sourceRuntimeIdValid,
    contractCompatible,
    violations: collectRendererAdapterEngineErrors(violations),
  });
}

export function executeRendererAdapterEngine(
  request: NexoraObjectDirectorRendererAdapterEngineRequest,
): NexoraObjectDirectorRendererAdapterEngineResult {
  const validation = validateRendererAdapterEngineRequest(request);
  const inputValidation = record(request) ? validateRendererAdapterInputContract(request.input) : validateRendererAdapterInputContract(undefined);
  const fallbackWarnings = record(request) && record(request.input) ? presentationWarnings(request.input) : freezeRendererObject([] as string[]);
  const fatal = !validation.requestIdValid || !validation.runtimeObjectValid || !validation.sourceRuntimeIdValid
    || !validation.contractCompatible || (!inputValidation.valid && !recoverableInputViolations(inputValidation.errors));
  const strictRejected = record(request) && request.strict === true && (!validation.valid || fallbackWarnings.length > 0);
  const errors = fatal || strictRejected ? collectRendererAdapterEngineErrors(validation.violations, strictRejected ? fallbackWarnings : []) : freezeRendererObject([] as string[]);
  const warnings = record(request) && request.includeWarnings === true && !strictRejected
    ? collectRendererAdapterEngineWarnings(fallbackWarnings, inputValidation.errors)
    : freezeRendererObject([] as string[]);

  if (fatal || strictRejected) {
    return freezeRendererObject({ requestId: record(request) && typeof request.requestId === "string" ? request.requestId : "", accepted: false, output: null, validation, warnings, errors, deterministic: true, deeplyFrozen: true });
  }

  try {
    const rendererObject = adaptRuntimeObject(request.input.runtimeObject as NexoraDirectorRuntimeObjectState);
    const output = createRendererAdapterOutputContract(rendererObject, request.input.sourceRuntimeId, true, warnings);
    const outputValidation = validateRendererAdapterOutputContract(output);
    if (!outputValidation.valid) {
      return freezeRendererObject({ requestId: request.requestId, accepted: false, output: null, validation, warnings, errors: collectRendererAdapterEngineErrors(outputValidation.errors), deterministic: true, deeplyFrozen: true });
    }
    return freezeRendererObject({ requestId: request.requestId, accepted: true, output, validation, warnings, errors: freezeRendererObject([] as string[]), deterministic: true, deeplyFrozen: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Runtime adaptation failed";
    return freezeRendererObject({ requestId: request.requestId, accepted: false, output: null, validation, warnings, errors: collectRendererAdapterEngineErrors([message]), deterministic: true, deeplyFrozen: true });
  }
}

export function executeRendererAdapterCollectionEngine(
  request: NexoraObjectDirectorRendererAdapterEngineCollectionRequest,
): NexoraObjectDirectorRendererAdapterEngineCollectionResult {
  const validation = validateRendererAdapterEngineCollectionRequest(request);
  const inputs = record(request) && Array.isArray(request.inputs) ? request.inputs : [];
  const itemResults = inputs.map((input, index) => executeRendererAdapterEngine({
    requestId: `${record(request) && typeof request.requestId === "string" ? request.requestId : ""}:${index + 1}`,
    input,
    strict: record(request) && request.strict === true,
    includeWarnings: record(request) && request.includeWarnings === true,
  }));
  const outputs = itemResults.flatMap((item) => item.output ? [item.output.rendererObject] : []);
  const failedCount = itemResults.filter((item) => !item.accepted).length;
  const sourceCount = inputs.length;
  const outputCount = outputs.length;
  const strict = record(request) && request.strict === true;
  const accepted = validation.requestIdValid && validation.contractCompatible
    && (strict ? failedCount === 0 && validation.valid : outputCount > 0 || sourceCount === 0);
  const sourceOrder = inputs.map((input) => input.sourceRuntimeId);
  const outputOrder = itemResults.flatMap((item, index) => item.accepted ? [sourceOrder[index]] : []);
  const collection = accepted ? createRendererCollectionContract(sourceCount, outputs, sourceOrder, outputOrder) : null;
  const warnings = record(request) && request.includeWarnings === true
    ? collectRendererAdapterEngineWarnings(...itemResults.map((item) => item.warnings))
    : freezeRendererObject([] as string[]);
  const errors = collectRendererAdapterEngineErrors(
    ...(validation.valid ? [] : [validation.violations]),
    ...itemResults.map((item) => item.errors),
  );
  return freezeRendererObject({
    requestId: record(request) && typeof request.requestId === "string" ? request.requestId : "",
    accepted,
    collection,
    itemResults,
    sourceCount,
    outputCount,
    failedCount,
    orderPreserved: true,
    warnings,
    errors,
    deterministic: true,
    deeplyFrozen: true,
  });
}

export function createRendererAdapterEngineTrace(
  requestId: string,
  completedStages: readonly RendererAdapterEngineStage[],
): RendererAdapterEngineExecutionTrace {
  if (!requestId.trim()) throw new TypeError("requestId is required");
  const seen = new Set<string>();
  completedStages.forEach((stage, index) => {
    if (!rendererAdapterEngineStages.includes(stage) || seen.has(stage) || rendererAdapterEngineStages[index] !== stage) throw new TypeError("Engine stages must be known, unique, and ordered");
    seen.add(stage);
  });
  return freezeRendererObject({ requestId, stages: [...completedStages], completed: completedStages.length === rendererAdapterEngineStages.length, deterministic: true });
}

export function createRendererAdapterEngineStatistics(
  result: NexoraObjectDirectorRendererAdapterEngineResult | NexoraObjectDirectorRendererAdapterEngineCollectionResult,
): RendererAdapterEngineStatistics {
  if ("itemResults" in result) {
    const acceptedCount = result.itemResults.filter((item) => item.accepted).length;
    return freezeRendererObject({ sourceCount: result.sourceCount, acceptedCount, rejectedCount: result.failedCount, outputCount: result.outputCount, warningCount: result.warnings.length, errorCount: result.errors.length });
  }
  return freezeRendererObject({ sourceCount: 1, acceptedCount: result.accepted ? 1 : 0, rejectedCount: result.accepted ? 0 : 1, outputCount: result.output ? 1 : 0, warningCount: result.warnings.length, errorCount: result.errors.length });
}

export function isRendererAdapterEngineResultAccepted(
  result: NexoraObjectDirectorRendererAdapterEngineResult,
): result is NexoraObjectDirectorRendererAdapterEngineResult & { readonly accepted: true; readonly output: NexoraObjectDirectorRendererAdapterOutputContract } {
  return result.accepted && result.output !== null;
}

export function verifyRendererAdapterEngineDeterminism(
  request: NexoraObjectDirectorRendererAdapterEngineRequest,
  equivalentRequest: NexoraObjectDirectorRendererAdapterEngineRequest = request,
): RendererAdapterEngineDeterminismReport {
  const first = executeRendererAdapterEngine(request);
  const second = executeRendererAdapterEngine(equivalentRequest);
  const requestEquivalent = structurallyEquivalent(request, equivalentRequest);
  const outputEquivalent = structurallyEquivalent(first.output, second.output);
  const warningEquivalent = structurallyEquivalent(first.warnings, second.warnings);
  const errorEquivalent = structurallyEquivalent(first.errors, second.errors);
  const violations: string[] = [];
  if (!requestEquivalent) violations.push("Requests are not structurally equivalent");
  if (!outputEquivalent) violations.push("Outputs are not structurally equivalent");
  if (!warningEquivalent) violations.push("Warnings are not structurally equivalent");
  if (!errorEquivalent) violations.push("Errors are not structurally equivalent");
  return freezeRendererObject({ deterministic: violations.length === 0, requestEquivalent, outputEquivalent, warningEquivalent, errorEquivalent, violations });
}

export function verifyRendererAdapterEngine(): NexoraObjectDirectorRendererAdapterEngineVerificationReport {
  const identityValid = engineId === "NOL-5:3/NexoraObjectDirectorRendererAdapterEngine" && engineStatus === "Engine";
  const namespaceValid = engineNamespace === "nexora.nol.renderer.adapter.engine";
  const versionValid = engineVersion === "5.3.0";
  const lockValid = engineLock === "NOL-5-3-DIRECTOR-RENDERER-ADAPTER-ENGINE-LOCKED";
  const dependencyValid = contractsId === "NOL-5:2/NexoraObjectDirectorRendererAdapterContracts" && contractsVersion === "5.2.0";
  const contractsCompatible = verifyRendererAdapterContracts().valid && rendererAdapterGuarantees.deeplyFrozenOutputs && rendererAdapterCompatibilityContract.backwardCompatible;
  const policyValid = Object.values(rendererAdapterEnginePolicy).every((value) => value === true);
  const stagesValid = rendererAdapterEngineStages.length === rendererAdapterEngineStageCount
    && rendererAdapterEngineStages.every((stage, index) => stage === ["request-received", "input-validated", "runtime-adapted", "output-contracted", "output-validated", "result-frozen"][index]);
  const verificationRuntime = freezeRendererObject({
    runtimeObjectId: "engine-verification-runtime",
    objectId: "engine-verification-object",
    sceneObjectId: "engine-verification-scene",
    sourceCommandIds: [],
    generation: 1,
    lifecycle: "Active",
    visible: true,
    interactive: true,
    focused: false,
    operating: false,
    attentionLevel: "None",
    renderingLevel: "Normal",
    cameraIntent: "None",
    relationshipMode: "Direct",
    labelMode: "Full",
    indicatorMode: "Essential",
    animationPending: false,
    lastExecutionState: "Completed",
    updatedAt: "engine-verification",
  } as const satisfies NexoraDirectorRuntimeObjectState);
  const verificationRequest = freezeRendererObject({
    requestId: "engine-verification-request",
    input: freezeRendererObject({ runtimeObject: verificationRuntime, sourceRuntimeId: verificationRuntime.runtimeObjectId, preserveRuntimeMetadata: true }),
    strict: true,
    includeWarnings: true,
  } as const satisfies NexoraObjectDirectorRendererAdapterEngineRequest);
  const deterministicExecutionValid = verifyRendererAdapterEngineDeterminism(verificationRequest).deterministic;
  const pipelineValid = stagesValid && rendererAdapterEnginePipeline.length === rendererAdapterEnginePipelineStepCount
    && rendererAdapterEnginePipeline.every((entry, index) => entry.order === index + 1 && entry.required === true)
    && rendererAdapterEngineRegistry.length === rendererAdapterEngineRegistryCount
    && rendererAdapterEnginePublicApiSurface.length === rendererAdapterEnginePublicApiCount
    && deterministicExecutionValid;
  const publicSurfacesFrozen = [rendererAdapterEnginePolicy, rendererAdapterEngineStages, rendererAdapterEnginePipeline, rendererAdapterEngineRegistry, rendererAdapterEnginePublicApiSurface].every(verifyRendererValueFrozen);
  const violations: string[] = [];
  if (!identityValid) violations.push("Engine identity or status is invalid");
  if (!namespaceValid) violations.push("Engine namespace is invalid");
  if (!versionValid) violations.push("Engine version is invalid");
  if (!lockValid) violations.push("Engine lock is invalid");
  if (!dependencyValid) violations.push("Engine dependency is invalid");
  if (!contractsCompatible) violations.push("NOL-5:2 Contracts are incompatible");
  if (!policyValid) violations.push("Engine policy is incomplete");
  if (!pipelineValid) violations.push("Engine pipeline, stages, registry, or public API is invalid");
  if (!publicSurfacesFrozen) violations.push("An Engine public surface is mutable");
  return freezeRendererObject({ valid: violations.length === 0, identityValid, namespaceValid, versionValid, lockValid, dependencyValid, contractsCompatible, policyValid, pipelineValid, publicSurfacesFrozen, violations });
}
