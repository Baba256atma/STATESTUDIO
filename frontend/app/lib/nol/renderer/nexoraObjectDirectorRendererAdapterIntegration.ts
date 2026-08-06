/** NOL-5:4 — stable consumer integration for the Director Renderer Adapter Engine. */
import {
  collectRendererAdapterEngineErrors,
  collectRendererAdapterEngineWarnings,
  engineId,
  engineVersion,
  executeRendererAdapterCollectionEngine,
  executeRendererAdapterEngine,
  freezeRendererObject,
  rendererAdapterEnginePolicy,
  validateRendererAdapterEngineCollectionRequest,
  validateRendererAdapterEngineRequest,
  verifyRendererAdapterEngine,
  verifyRendererValueFrozen,
  type NexoraObjectDirectorRendererAdapterEngineCollectionRequest,
  type NexoraObjectDirectorRendererAdapterEngineCollectionResult,
  type NexoraObjectDirectorRendererAdapterEngineRequest,
  type NexoraObjectDirectorRendererAdapterEngineResult,
} from "./nexoraObjectDirectorRendererAdapterEngine.ts";

// NOL-5:4 exposes canonical immutability primitives to validation consumers.
export { freezeRendererObject, verifyRendererValueFrozen };

export const integrationId = "NOL-5:4/NexoraObjectDirectorRendererAdapterIntegration" as const;
export const integrationVersion = "5.4.0" as const;
export const integrationNamespace = "nexora.nol.renderer.adapter.integration" as const;
export const integrationStatus = "Integration" as const;
export const integrationLock = "NOL-5-4-DIRECTOR-RENDERER-ADAPTER-INTEGRATION-LOCKED" as const;

export type RendererObject = NonNullable<NexoraObjectDirectorRendererAdapterEngineResult["output"]>["rendererObject"];
export type RendererAdapterIntegrationMode = "strict" | "compatible";
export type RendererAdapterIntegrationStatus = "accepted" | "partially-accepted" | "rejected";

export interface NexoraObjectDirectorRendererAdapterIntegrationRequest {
  readonly integrationId: string;
  readonly engineRequest: NexoraObjectDirectorRendererAdapterEngineRequest;
  readonly consumerId: string;
  readonly mode: RendererAdapterIntegrationMode;
  readonly includeTrace: boolean;
  readonly includeSummary: boolean;
}

export interface NexoraObjectDirectorRendererAdapterCollectionIntegrationRequest {
  readonly integrationId: string;
  readonly engineRequest: NexoraObjectDirectorRendererAdapterEngineCollectionRequest;
  readonly consumerId: string;
  readonly mode: RendererAdapterIntegrationMode;
  readonly includeTrace: boolean;
  readonly includeSummary: boolean;
  readonly preserveOrder: true;
}

export interface NexoraObjectDirectorRendererAdapterIntegrationResult {
  readonly integrationId: string;
  readonly consumerId: string;
  readonly accepted: boolean;
  readonly mode: RendererAdapterIntegrationMode;
  readonly engineResult: NexoraObjectDirectorRendererAdapterEngineResult;
  readonly rendererObject: RendererObject | null;
  readonly summary: RendererAdapterIntegrationSummary | null;
  readonly trace: RendererAdapterIntegrationTrace | null;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
  readonly compatible: boolean;
  readonly deterministic: true;
  readonly deeplyFrozen: true;
}

export interface NexoraObjectDirectorRendererAdapterIntegrationItemResult {
  readonly index: number;
  readonly sourceRuntimeId: string;
  readonly accepted: boolean;
  readonly rendererObject: RendererObject | null;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
  readonly deterministic: true;
  readonly deeplyFrozen: true;
}

export interface NexoraObjectDirectorRendererAdapterCollectionIntegrationResult {
  readonly integrationId: string;
  readonly consumerId: string;
  readonly accepted: boolean;
  readonly mode: RendererAdapterIntegrationMode;
  readonly engineResult: NexoraObjectDirectorRendererAdapterEngineCollectionResult;
  readonly rendererObjects: readonly RendererObject[];
  readonly itemResults: readonly NexoraObjectDirectorRendererAdapterIntegrationItemResult[];
  readonly summary: RendererAdapterIntegrationSummary | null;
  readonly trace: RendererAdapterIntegrationTrace | null;
  readonly sourceCount: number;
  readonly outputCount: number;
  readonly failedCount: number;
  readonly orderPreserved: true;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
  readonly compatible: boolean;
  readonly deterministic: true;
  readonly deeplyFrozen: true;
}

export interface RendererAdapterIntegrationValidationResult {
  readonly valid: boolean;
  readonly integrationIdValid: boolean;
  readonly consumerIdValid: boolean;
  readonly modeValid: boolean;
  readonly engineRequestValid: boolean;
  readonly dependencyCompatible: boolean;
  readonly violations: readonly string[];
}

export interface RendererAdapterIntegrationSummary {
  readonly integrationId: string;
  readonly consumerId: string;
  readonly mode: RendererAdapterIntegrationMode;
  readonly sourceCount: number;
  readonly acceptedCount: number;
  readonly rejectedCount: number;
  readonly outputCount: number;
  readonly warningCount: number;
  readonly errorCount: number;
  readonly orderPreserved: boolean;
  readonly compatible: boolean;
  readonly status: RendererAdapterIntegrationStatus;
}

export type RendererAdapterIntegrationStage =
  | "integration-request-received"
  | "integration-request-validated"
  | "engine-executed"
  | "engine-result-normalized"
  | "integration-summary-created"
  | "integration-result-frozen";

export interface RendererAdapterIntegrationTrace {
  readonly integrationId: string;
  readonly stages: readonly RendererAdapterIntegrationStage[];
  readonly completed: boolean;
  readonly deterministic: true;
}

export interface NexoraObjectDirectorRendererAdapterIntegrationPolicy {
  readonly engineOnlyDependency: true;
  readonly synchronous: true;
  readonly pure: true;
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly runtimeMutationForbidden: true;
  readonly rendererExecutionForbidden: true;
  readonly strictModeSupported: true;
  readonly compatibleModeSupported: true;
  readonly collectionOrderPreserved: true;
  readonly partialResultsSupported: true;
  readonly deeplyFrozenOutputs: true;
}

export interface NexoraObjectDirectorRendererAdapterIntegrationCompatibility {
  readonly integrationIdentity: string;
  readonly engineIdentity: string;
  readonly compatibleEngineVersion: string;
  readonly engineOnlyDependency: true;
  readonly strictModeCompatible: boolean;
  readonly compatibleModeCompatible: boolean;
  readonly collectionModeCompatible: boolean;
  readonly rendererFrameworkAgnostic: true;
}

export interface RendererAdapterIntegrationReadinessReport {
  readonly ready: boolean;
  readonly identityReady: boolean;
  readonly engineReady: boolean;
  readonly policyReady: boolean;
  readonly compatibilityReady: boolean;
  readonly pipelineReady: boolean;
  readonly publicSurfacesFrozen: boolean;
  readonly violations: readonly string[];
}

export interface RendererAdapterIntegrationDeterminismReport {
  readonly deterministic: boolean;
  readonly requestEquivalent: boolean;
  readonly engineResultEquivalent: boolean;
  readonly rendererOutputEquivalent: boolean;
  readonly summaryEquivalent: boolean;
  readonly traceEquivalent: boolean;
  readonly warningEquivalent: boolean;
  readonly errorEquivalent: boolean;
  readonly violations: readonly string[];
}

export interface NexoraObjectDirectorRendererAdapterIntegrationVerificationReport {
  readonly valid: boolean;
  readonly identityValid: boolean;
  readonly namespaceValid: boolean;
  readonly versionValid: boolean;
  readonly lockValid: boolean;
  readonly dependencyValid: boolean;
  readonly engineCompatible: boolean;
  readonly policyValid: boolean;
  readonly registryValid: boolean;
  readonly pipelineValid: boolean;
  readonly readinessValid: boolean;
  readonly publicSurfacesFrozen: boolean;
  readonly deterministicExecutionValid: boolean;
  readonly violations: readonly string[];
}

export interface RendererAdapterIntegrationModeResolution {
  readonly mode: RendererAdapterIntegrationMode;
  readonly engineStrict: boolean;
  readonly supported: boolean;
}

export const rendererAdapterIntegrationModes = freezeRendererObject(["strict", "compatible"] as const satisfies readonly RendererAdapterIntegrationMode[]);
export const rendererAdapterIntegrationModeCount = rendererAdapterIntegrationModes.length;

export const rendererAdapterIntegrationStages = freezeRendererObject([
  "integration-request-received",
  "integration-request-validated",
  "engine-executed",
  "engine-result-normalized",
  "integration-summary-created",
  "integration-result-frozen",
] as const satisfies readonly RendererAdapterIntegrationStage[]);
export const rendererAdapterIntegrationStageCount = rendererAdapterIntegrationStages.length;

export const rendererAdapterIntegrationPipeline = freezeRendererObject([
  { id: "validate-integration-request", order: 1, name: "Validate Integration Request", required: true },
  { id: "resolve-integration-mode", order: 2, name: "Resolve Integration Mode", required: true },
  { id: "execute-adapter-engine", order: 3, name: "Execute Adapter Engine", required: true },
  { id: "normalize-engine-result", order: 4, name: "Normalize Engine Result", required: true },
  { id: "create-integration-summary", order: 5, name: "Create Integration Summary", required: true },
  { id: "freeze-integration-result", order: 6, name: "Freeze Integration Result", required: true },
] as const);
export const rendererAdapterIntegrationPipelineStepCount = rendererAdapterIntegrationPipeline.length;

export const rendererAdapterIntegrationPolicy: NexoraObjectDirectorRendererAdapterIntegrationPolicy = freezeRendererObject({
  engineOnlyDependency: true,
  synchronous: true,
  pure: true,
  deterministic: true,
  sideEffectFree: true,
  runtimeMutationForbidden: true,
  rendererExecutionForbidden: true,
  strictModeSupported: true,
  compatibleModeSupported: true,
  collectionOrderPreserved: true,
  partialResultsSupported: true,
  deeplyFrozenOutputs: true,
} as const);

export const rendererAdapterIntegrationCompatibility: NexoraObjectDirectorRendererAdapterIntegrationCompatibility = freezeRendererObject({
  integrationIdentity: integrationId,
  engineIdentity: engineId,
  compatibleEngineVersion: engineVersion,
  engineOnlyDependency: true,
  strictModeCompatible: true,
  compatibleModeCompatible: true,
  collectionModeCompatible: true,
  rendererFrameworkAgnostic: true,
} as const);

export const rendererAdapterIntegrationRegistry = freezeRendererObject([
  "Request Validation",
  "Mode Resolution",
  "Single Integration",
  "Collection Integration",
  "Result Normalization",
  "Summary Creation",
  "Trace Creation",
  "Readiness",
  "Compatibility",
  "Verification",
] as const);
export const rendererAdapterIntegrationRegistryCount = rendererAdapterIntegrationRegistry.length;

export const rendererAdapterIntegrationPublicApiSurface = freezeRendererObject([
  "validateRendererAdapterIntegrationRequest",
  "validateRendererAdapterCollectionIntegrationRequest",
  "resolveRendererAdapterIntegrationMode",
  "integrateRendererAdapterObject",
  "integrateRendererAdapterCollection",
  "normalizeRendererAdapterEngineResult",
  "normalizeRendererAdapterCollectionEngineResult",
  "createRendererAdapterIntegrationSummary",
  "createRendererAdapterIntegrationTrace",
  "assessRendererAdapterIntegrationReadiness",
  "isRendererAdapterIntegrationAccepted",
  "isRendererAdapterCollectionIntegrationAccepted",
  "verifyRendererAdapterIntegrationDeterminism",
  "verifyRendererAdapterIntegration",
] as const);
export const rendererAdapterIntegrationPublicApiCount = rendererAdapterIntegrationPublicApiSurface.length;

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function structurallyEquivalent(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((value, index) => structurallyEquivalent(value, right[index]));
  if (!record(left) || !record(right)) return false;
  const leftKeys = Object.keys(left).sort(), rightKeys = Object.keys(right).sort();
  return leftKeys.length === rightKeys.length && leftKeys.every((key, index) => key === rightKeys[index] && structurallyEquivalent(left[key], right[key]));
}

function integrationValidationResult(
  integrationIdValue: unknown,
  consumerIdValue: unknown,
  modeValue: unknown,
  engineRequestValid: boolean,
  dependencyCompatible: boolean,
  additionalViolations: readonly string[] = [],
): RendererAdapterIntegrationValidationResult {
  const integrationIdValid = typeof integrationIdValue === "string" && integrationIdValue.trim().length > 0;
  const consumerIdValid = typeof consumerIdValue === "string" && consumerIdValue.trim().length > 0;
  const modeValid = rendererAdapterIntegrationModes.includes(modeValue as RendererAdapterIntegrationMode);
  const violations: string[] = [...additionalViolations];
  if (!integrationIdValid) violations.push("integrationId is required");
  if (!consumerIdValid) violations.push("consumerId is required");
  if (!modeValid) violations.push("Integration mode is unsupported");
  if (!engineRequestValid) violations.push("Engine request is invalid");
  if (!dependencyCompatible) violations.push("NOL-5:3 Engine is incompatible");
  return freezeRendererObject({ valid: integrationIdValid && consumerIdValid && modeValid && engineRequestValid && dependencyCompatible && additionalViolations.length === 0, integrationIdValid, consumerIdValid, modeValid, engineRequestValid, dependencyCompatible, violations: collectRendererAdapterEngineErrors(violations) });
}

export function resolveRendererAdapterIntegrationMode(mode: RendererAdapterIntegrationMode): RendererAdapterIntegrationModeResolution {
  const supported = rendererAdapterIntegrationModes.includes(mode);
  return freezeRendererObject({ mode, engineStrict: mode === "strict", supported });
}

export function validateRendererAdapterIntegrationRequest(request: NexoraObjectDirectorRendererAdapterIntegrationRequest): RendererAdapterIntegrationValidationResult {
  const value: Partial<NexoraObjectDirectorRendererAdapterIntegrationRequest> = record(request) ? request : {};
  const resolution = resolveRendererAdapterIntegrationMode(value.mode as RendererAdapterIntegrationMode);
  const engineRequest = record(value.engineRequest) ? { ...value.engineRequest, strict: resolution.engineStrict } : value.engineRequest;
  const engineValidation = validateRendererAdapterEngineRequest(engineRequest as NexoraObjectDirectorRendererAdapterEngineRequest);
  const compatibleRecovery = resolution.mode === "compatible" && engineValidation.requestIdValid && engineValidation.runtimeObjectValid && engineValidation.sourceRuntimeIdValid && engineValidation.contractCompatible
    && engineValidation.violations.every((violation) => violation === "requestedRendererState is invalid");
  const engineRequestValid = engineValidation.valid || compatibleRecovery;
  return integrationValidationResult(value.integrationId, value.consumerId, value.mode, engineRequestValid, verifyRendererAdapterEngine().valid, engineRequestValid ? [] : engineValidation.violations);
}

export function validateRendererAdapterCollectionIntegrationRequest(request: NexoraObjectDirectorRendererAdapterCollectionIntegrationRequest): RendererAdapterIntegrationValidationResult {
  const value: Partial<NexoraObjectDirectorRendererAdapterCollectionIntegrationRequest> = record(request) ? request : {};
  const resolution = resolveRendererAdapterIntegrationMode(value.mode as RendererAdapterIntegrationMode);
  const engineRequest = record(value.engineRequest) ? { ...value.engineRequest, strict: resolution.engineStrict, preserveOrder: true } : value.engineRequest;
  const engineValidation = validateRendererAdapterEngineCollectionRequest(engineRequest as NexoraObjectDirectorRendererAdapterEngineCollectionRequest);
  const orderViolation = value.preserveOrder === true ? [] : ["preserveOrder must be true"];
  const compatibleCollection = resolution.mode === "compatible" && engineValidation.requestIdValid && engineValidation.contractCompatible && record(value.engineRequest) && Array.isArray(value.engineRequest.inputs);
  const engineRequestValid = (engineValidation.valid || compatibleCollection) && orderViolation.length === 0;
  return integrationValidationResult(value.integrationId, value.consumerId, value.mode, engineRequestValid, verifyRendererAdapterEngine().valid, [...orderViolation, ...(engineRequestValid ? [] : engineValidation.violations)]);
}

export function createRendererAdapterIntegrationTrace(integrationIdValue: string, stages: readonly RendererAdapterIntegrationStage[]): RendererAdapterIntegrationTrace {
  if (!integrationIdValue.trim()) throw new TypeError("integrationId is required");
  const seen = new Set<string>();
  stages.forEach((stage, index) => {
    if (!rendererAdapterIntegrationStages.includes(stage) || seen.has(stage) || rendererAdapterIntegrationStages[index] !== stage) throw new TypeError("Integration stages must be known, unique, and ordered");
    seen.add(stage);
  });
  return freezeRendererObject({ integrationId: integrationIdValue, stages: [...stages], completed: stages.length === rendererAdapterIntegrationStages.length, deterministic: true });
}

export function createRendererAdapterIntegrationSummary(
  result: NexoraObjectDirectorRendererAdapterIntegrationResult | NexoraObjectDirectorRendererAdapterCollectionIntegrationResult,
): RendererAdapterIntegrationSummary {
  const collection = "itemResults" in result;
  const sourceCount = collection ? result.sourceCount : 1;
  const outputCount = collection ? result.outputCount : result.rendererObject ? 1 : 0;
  const acceptedCount = collection ? result.itemResults.filter((item) => item.accepted).length : result.accepted ? 1 : 0;
  const rejectedCount = sourceCount - acceptedCount;
  const status: RendererAdapterIntegrationStatus = outputCount === 0 ? "rejected" : rejectedCount > 0 ? "partially-accepted" : "accepted";
  return freezeRendererObject({ integrationId: result.integrationId, consumerId: result.consumerId, mode: result.mode, sourceCount, acceptedCount, rejectedCount, outputCount, warningCount: result.warnings.length, errorCount: result.errors.length, orderPreserved: collection ? result.orderPreserved : true, compatible: result.compatible, status });
}

export function normalizeRendererAdapterEngineResult(
  request: NexoraObjectDirectorRendererAdapterIntegrationRequest,
  engineResult: NexoraObjectDirectorRendererAdapterEngineResult,
): NexoraObjectDirectorRendererAdapterIntegrationResult {
  const rendererObject = engineResult.accepted && engineResult.output ? engineResult.output.rendererObject : null;
  const compatible = verifyRendererAdapterEngine().valid && engineResult.deterministic && engineResult.deeplyFrozen;
  const base: NexoraObjectDirectorRendererAdapterIntegrationResult = freezeRendererObject({ integrationId: request.integrationId, consumerId: request.consumerId, accepted: engineResult.accepted && rendererObject !== null, mode: request.mode, engineResult, rendererObject, summary: null, trace: null, warnings: collectRendererAdapterEngineWarnings(engineResult.warnings), errors: collectRendererAdapterEngineErrors(engineResult.errors), compatible, deterministic: true, deeplyFrozen: true });
  return freezeRendererObject({ ...base, summary: request.includeSummary ? createRendererAdapterIntegrationSummary(base) : null, trace: request.includeTrace ? createRendererAdapterIntegrationTrace(request.integrationId, rendererAdapterIntegrationStages) : null });
}

export function normalizeRendererAdapterCollectionEngineResult(
  request: NexoraObjectDirectorRendererAdapterCollectionIntegrationRequest,
  engineResult: NexoraObjectDirectorRendererAdapterEngineCollectionResult,
): NexoraObjectDirectorRendererAdapterCollectionIntegrationResult {
  const rendererObjects = freezeRendererObject(engineResult.accepted ? engineResult.itemResults.flatMap((item) => item.accepted && item.output ? [item.output.rendererObject] : []) : []);
  const itemResults = freezeRendererObject(engineResult.itemResults.map((item, index): NexoraObjectDirectorRendererAdapterIntegrationItemResult => freezeRendererObject({ index, sourceRuntimeId: request.engineRequest.inputs[index]?.sourceRuntimeId ?? "", accepted: item.accepted && item.output !== null, rendererObject: item.accepted && item.output ? item.output.rendererObject : null, warnings: collectRendererAdapterEngineWarnings(item.warnings), errors: collectRendererAdapterEngineErrors(item.errors), deterministic: true, deeplyFrozen: true })));
  const compatible = verifyRendererAdapterEngine().valid && engineResult.deterministic && engineResult.deeplyFrozen;
  const base: NexoraObjectDirectorRendererAdapterCollectionIntegrationResult = freezeRendererObject({ integrationId: request.integrationId, consumerId: request.consumerId, accepted: engineResult.accepted, mode: request.mode, engineResult, rendererObjects, itemResults, summary: null, trace: null, sourceCount: engineResult.sourceCount, outputCount: engineResult.outputCount, failedCount: engineResult.failedCount, orderPreserved: true, warnings: collectRendererAdapterEngineWarnings(engineResult.warnings), errors: collectRendererAdapterEngineErrors(engineResult.errors), compatible, deterministic: true, deeplyFrozen: true });
  return freezeRendererObject({ ...base, summary: request.includeSummary ? createRendererAdapterIntegrationSummary(base) : null, trace: request.includeTrace ? createRendererAdapterIntegrationTrace(request.integrationId, rendererAdapterIntegrationStages) : null });
}

export function integrateRendererAdapterObject(request: NexoraObjectDirectorRendererAdapterIntegrationRequest): NexoraObjectDirectorRendererAdapterIntegrationResult {
  const validation = validateRendererAdapterIntegrationRequest(request);
  const resolution = resolveRendererAdapterIntegrationMode(request.mode);
  const normalizedEngineRequest = freezeRendererObject({ ...request.engineRequest, strict: resolution.engineStrict });
  const normalizationRequest = validation.valid ? request : freezeRendererObject({ ...request, includeTrace: false, includeSummary: false });
  const normalized = normalizeRendererAdapterEngineResult(normalizationRequest, executeRendererAdapterEngine(normalizedEngineRequest));
  if (validation.valid) return normalized;
  const rejectedBase = freezeRendererObject({ ...normalized, accepted: false, rendererObject: null, summary: null, errors: collectRendererAdapterEngineErrors(normalized.errors, validation.violations) });
  return freezeRendererObject({ ...rejectedBase, summary: request.includeSummary ? createRendererAdapterIntegrationSummary(rejectedBase) : null });
}

export function integrateRendererAdapterCollection(request: NexoraObjectDirectorRendererAdapterCollectionIntegrationRequest): NexoraObjectDirectorRendererAdapterCollectionIntegrationResult {
  const validation = validateRendererAdapterCollectionIntegrationRequest(request);
  const resolution = resolveRendererAdapterIntegrationMode(request.mode);
  const normalizedEngineRequest = freezeRendererObject({ ...request.engineRequest, strict: resolution.engineStrict, preserveOrder: true as const });
  const normalizationRequest = validation.valid ? request : freezeRendererObject({ ...request, includeTrace: false, includeSummary: false });
  const normalized = normalizeRendererAdapterCollectionEngineResult(normalizationRequest, executeRendererAdapterCollectionEngine(normalizedEngineRequest));
  if (validation.valid) return normalized;
  const rejectedBase = freezeRendererObject({ ...normalized, accepted: false, rendererObjects: freezeRendererObject([] as RendererObject[]), summary: null, errors: collectRendererAdapterEngineErrors(normalized.errors, validation.violations) });
  return freezeRendererObject({ ...rejectedBase, summary: request.includeSummary ? createRendererAdapterIntegrationSummary(rejectedBase) : null });
}

export function isRendererAdapterIntegrationAccepted(result: NexoraObjectDirectorRendererAdapterIntegrationResult): result is NexoraObjectDirectorRendererAdapterIntegrationResult & { readonly accepted: true; readonly rendererObject: RendererObject } {
  return result.accepted && result.rendererObject !== null;
}

export function isRendererAdapterCollectionIntegrationAccepted(result: NexoraObjectDirectorRendererAdapterCollectionIntegrationResult): boolean {
  return result.accepted && result.rendererObjects.length > 0;
}

export function assessRendererAdapterIntegrationReadiness(): RendererAdapterIntegrationReadinessReport {
  const identityReady = integrationId === "NOL-5:4/NexoraObjectDirectorRendererAdapterIntegration" && integrationVersion === "5.4.0" && integrationNamespace === "nexora.nol.renderer.adapter.integration" && integrationStatus === "Integration" && integrationLock === "NOL-5-4-DIRECTOR-RENDERER-ADAPTER-INTEGRATION-LOCKED";
  const engineReady = verifyRendererAdapterEngine().valid;
  const policyReady = Object.values(rendererAdapterIntegrationPolicy).every((value) => value === true) && rendererAdapterEnginePolicy.deterministic;
  const compatibilityReady = rendererAdapterIntegrationCompatibility.engineIdentity === engineId && rendererAdapterIntegrationCompatibility.compatibleEngineVersion === engineVersion && rendererAdapterIntegrationCompatibility.strictModeCompatible && rendererAdapterIntegrationCompatibility.compatibleModeCompatible && rendererAdapterIntegrationCompatibility.collectionModeCompatible;
  const pipelineReady = rendererAdapterIntegrationModes.length === rendererAdapterIntegrationModeCount && rendererAdapterIntegrationStages.length === rendererAdapterIntegrationStageCount && rendererAdapterIntegrationPipeline.length === rendererAdapterIntegrationPipelineStepCount && rendererAdapterIntegrationPipeline.every((entry, index) => entry.order === index + 1 && entry.required) && rendererAdapterIntegrationRegistry.length === rendererAdapterIntegrationRegistryCount && rendererAdapterIntegrationPublicApiSurface.length === rendererAdapterIntegrationPublicApiCount;
  const publicSurfacesFrozen = [rendererAdapterIntegrationModes, rendererAdapterIntegrationStages, rendererAdapterIntegrationPipeline, rendererAdapterIntegrationPolicy, rendererAdapterIntegrationCompatibility, rendererAdapterIntegrationRegistry, rendererAdapterIntegrationPublicApiSurface].every(verifyRendererValueFrozen);
  const violations: string[] = [];
  if (!identityReady) violations.push("Integration identity is not ready");
  if (!engineReady) violations.push("Engine is not ready");
  if (!policyReady) violations.push("Integration policy is not ready");
  if (!compatibilityReady) violations.push("Integration compatibility is not ready");
  if (!pipelineReady) violations.push("Integration pipeline or registry is not ready");
  if (!publicSurfacesFrozen) violations.push("An Integration public surface is mutable");
  return freezeRendererObject({ ready: violations.length === 0, identityReady, engineReady, policyReady, compatibilityReady, pipelineReady, publicSurfacesFrozen, violations });
}

type IntegrationRequest = NexoraObjectDirectorRendererAdapterIntegrationRequest | NexoraObjectDirectorRendererAdapterCollectionIntegrationRequest;
type IntegrationResult = NexoraObjectDirectorRendererAdapterIntegrationResult | NexoraObjectDirectorRendererAdapterCollectionIntegrationResult;

function executeIntegration(request: IntegrationRequest): IntegrationResult {
  return "preserveOrder" in request ? integrateRendererAdapterCollection(request) : integrateRendererAdapterObject(request);
}

export function verifyRendererAdapterIntegrationDeterminism(request: IntegrationRequest, equivalentRequest: IntegrationRequest = request): RendererAdapterIntegrationDeterminismReport {
  const first = executeIntegration(request), second = executeIntegration(equivalentRequest);
  const requestEquivalent = structurallyEquivalent(request, equivalentRequest);
  const engineResultEquivalent = structurallyEquivalent(first.engineResult, second.engineResult);
  const rendererOutputEquivalent = structurallyEquivalent("rendererObjects" in first ? first.rendererObjects : first.rendererObject, "rendererObjects" in second ? second.rendererObjects : second.rendererObject);
  const summaryEquivalent = structurallyEquivalent(first.summary, second.summary);
  const traceEquivalent = structurallyEquivalent(first.trace, second.trace);
  const warningEquivalent = structurallyEquivalent(first.warnings, second.warnings);
  const errorEquivalent = structurallyEquivalent(first.errors, second.errors);
  const violations: string[] = [];
  if (!requestEquivalent) violations.push("Requests are not structurally equivalent");
  if (!engineResultEquivalent) violations.push("Engine results are not structurally equivalent");
  if (!rendererOutputEquivalent) violations.push("Renderer outputs are not structurally equivalent");
  if (!summaryEquivalent) violations.push("Summaries are not structurally equivalent");
  if (!traceEquivalent) violations.push("Traces are not structurally equivalent");
  if (!warningEquivalent) violations.push("Warnings are not structurally equivalent");
  if (!errorEquivalent) violations.push("Errors are not structurally equivalent");
  return freezeRendererObject({ deterministic: violations.length === 0, requestEquivalent, engineResultEquivalent, rendererOutputEquivalent, summaryEquivalent, traceEquivalent, warningEquivalent, errorEquivalent, violations });
}

export function verifyRendererAdapterIntegration(): NexoraObjectDirectorRendererAdapterIntegrationVerificationReport {
  const identityValid = integrationId === "NOL-5:4/NexoraObjectDirectorRendererAdapterIntegration" && integrationStatus === "Integration";
  const namespaceValid = integrationNamespace === "nexora.nol.renderer.adapter.integration";
  const versionValid = integrationVersion === "5.4.0";
  const lockValid = integrationLock === "NOL-5-4-DIRECTOR-RENDERER-ADAPTER-INTEGRATION-LOCKED";
  const dependencyValid = rendererAdapterIntegrationPolicy.engineOnlyDependency;
  const engineCompatible = verifyRendererAdapterEngine().valid && rendererAdapterIntegrationCompatibility.engineIdentity === engineId && rendererAdapterIntegrationCompatibility.compatibleEngineVersion === engineVersion;
  const policyValid = Object.values(rendererAdapterIntegrationPolicy).every((value) => value === true);
  const registryValid = rendererAdapterIntegrationRegistry.length === rendererAdapterIntegrationRegistryCount && rendererAdapterIntegrationRegistry.join("|") === "Request Validation|Mode Resolution|Single Integration|Collection Integration|Result Normalization|Summary Creation|Trace Creation|Readiness|Compatibility|Verification";
  const pipelineValid = rendererAdapterIntegrationModes.join("|") === "strict|compatible" && rendererAdapterIntegrationStages.join("|") === "integration-request-received|integration-request-validated|engine-executed|engine-result-normalized|integration-summary-created|integration-result-frozen" && rendererAdapterIntegrationPipeline.every((entry, index) => entry.order === index + 1 && entry.required);
  const readinessValid = assessRendererAdapterIntegrationReadiness().ready;
  const publicSurfacesFrozen = [rendererAdapterIntegrationModes, rendererAdapterIntegrationStages, rendererAdapterIntegrationPipeline, rendererAdapterIntegrationPolicy, rendererAdapterIntegrationCompatibility, rendererAdapterIntegrationRegistry, rendererAdapterIntegrationPublicApiSurface].every(verifyRendererValueFrozen);
  const probeRuntime = freezeRendererObject({ runtimeObjectId: "integration-probe-runtime", objectId: "integration-probe-object", sceneObjectId: "integration-probe-scene", sourceCommandIds: [], generation: 1, lifecycle: "Active", visible: true, interactive: true, focused: false, operating: false, attentionLevel: "None", renderingLevel: "Normal", cameraIntent: "None", relationshipMode: "Direct", labelMode: "Full", indicatorMode: "Essential", animationPending: false, lastExecutionState: "Completed", updatedAt: "integration-probe" });
  const probeRequest = freezeRendererObject({ integrationId: "integration-probe", consumerId: "integration-verifier", mode: "strict", includeTrace: true, includeSummary: true, engineRequest: freezeRendererObject({ requestId: "integration-probe-engine", input: freezeRendererObject({ runtimeObject: probeRuntime, sourceRuntimeId: "integration-probe-runtime", preserveRuntimeMetadata: true }), strict: true, includeWarnings: true }) } as const satisfies NexoraObjectDirectorRendererAdapterIntegrationRequest);
  const deterministicExecutionValid = verifyRendererAdapterIntegrationDeterminism(probeRequest).deterministic;
  const violations: string[] = [];
  if (!identityValid) violations.push("Integration identity or status is invalid");
  if (!namespaceValid) violations.push("Integration namespace is invalid");
  if (!versionValid) violations.push("Integration version is invalid");
  if (!lockValid) violations.push("Integration lock is invalid");
  if (!dependencyValid) violations.push("Integration dependency is invalid");
  if (!engineCompatible) violations.push("Engine compatibility is invalid");
  if (!policyValid) violations.push("Integration policy is incomplete");
  if (!registryValid) violations.push("Integration registry is invalid");
  if (!pipelineValid) violations.push("Integration modes, stages, or pipeline are invalid");
  if (!readinessValid) violations.push("Integration readiness is invalid");
  if (!publicSurfacesFrozen) violations.push("An Integration public surface is mutable");
  if (!deterministicExecutionValid) violations.push("Integration execution is not deterministic");
  return freezeRendererObject({ valid: violations.length === 0, identityValid, namespaceValid, versionValid, lockValid, dependencyValid, engineCompatible, policyValid, registryValid, pipelineValid, readinessValid, publicSurfacesFrozen, deterministicExecutionValid, violations });
}
