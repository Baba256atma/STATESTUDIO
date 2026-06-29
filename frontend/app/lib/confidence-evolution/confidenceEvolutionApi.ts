/**
 * APP-9:7 — Confidence API + Consumer Contract Layer.
 */

import { CONFIDENCE_EVOLUTION_MUST_NOT_OWN } from "./confidenceEvolutionConstants.ts";
import { createConfidenceEvolutionFoundation } from "./confidenceEvolutionFoundation.ts";
import { initializeConfidenceEvolutionEngine } from "./confidenceEvolutionEngine.ts";
import { initializeConfidenceEvolutionQueryLayer } from "./confidenceEvolutionQuery.ts";
import { initializeConfidenceEvolutionTrendLayer } from "./confidenceEvolutionTrend.ts";
import { initializeConfidenceEvidenceReasonLayer } from "./confidenceEvolutionEvidenceReason.ts";
import { initializeConfidenceCalibrationLayer } from "./confidenceEvolutionCalibration.ts";
import { createConfidenceEvolutionApiFacade } from "./confidenceEvolutionApiFacade.ts";
import {
  buildConfidenceEvolutionApiManifest,
  CONFIDENCE_EVOLUTION_API_SELF_MANIFEST,
} from "./confidenceEvolutionApiManifest.ts";
import {
  CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_API_TAGS,
  type ConfidenceEvolutionApi,
  type ConfidenceEvolutionApiCapabilityManifest,
  type ConfidenceEvolutionApiEngineState,
} from "./confidenceEvolutionApiTypes.ts";
import {
  validateConfidenceEvolutionApiContract as validateApiContractShape,
  validateConfidenceEvolutionApiManifest,
  validateConfidenceEvolutionApiPrerequisites,
} from "./confidenceEvolutionApiValidation.ts";
import {
  getConfidenceEvolutionConsumerContract,
  listConfidenceEvolutionConsumerContracts,
} from "./confidenceEvolutionConsumerContracts.ts";
import { validateConfidenceEvolutionConsumerAccess } from "./confidenceEvolutionConsumerValidation.ts";
import type { ConfidenceEvolutionConsumerAccessRequest } from "./confidenceEvolutionApiTypes.ts";
import { runConfidenceEvolutionApiCertification } from "./confidenceEvolutionApiRunner.ts";

export { CONFIDENCE_EVOLUTION_API_SELF_MANIFEST, CONFIDENCE_EVOLUTION_API_PUBLIC_RULES } from "./confidenceEvolutionApiManifest.ts";

let apiLayerInitialized = false;
let apiLayerTimestamp = "2026-01-01T00:00:00.000Z";
let confidenceEvolutionApiInstance: ConfidenceEvolutionApi | null = null;

function initializePrerequisiteLayers(timestamp: string): void {
  createConfidenceEvolutionFoundation(timestamp);
  initializeConfidenceEvolutionEngine(timestamp);
  initializeConfidenceEvolutionQueryLayer(timestamp);
  initializeConfidenceEvolutionTrendLayer(timestamp);
  initializeConfidenceEvidenceReasonLayer(timestamp);
  initializeConfidenceCalibrationLayer(timestamp);
}

export function initializeConfidenceEvolutionApiLayer(
  timestamp: string = apiLayerTimestamp
): ConfidenceEvolutionApiEngineState {
  apiLayerTimestamp = timestamp;
  initializePrerequisiteLayers(timestamp);
  apiLayerInitialized = true;
  confidenceEvolutionApiInstance = createConfidenceEvolutionApiFacade(() =>
    runConfidenceEvolutionApiCertification()
  );
  return getConfidenceEvolutionApiEngineState(timestamp);
}

export function isConfidenceEvolutionApiLayerInitialized(): boolean {
  return apiLayerInitialized;
}

export function getConfidenceEvolutionApiEngineState(
  timestamp: string = apiLayerTimestamp
): ConfidenceEvolutionApiEngineState {
  return Object.freeze({
    engineId: "confidence-evolution-api-layer",
    contractVersion: CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION,
    initialized: apiLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetConfidenceEvolutionApiLayerForTests(): void {
  apiLayerInitialized = false;
  apiLayerTimestamp = "2026-01-01T00:00:00.000Z";
  confidenceEvolutionApiInstance = null;
}

export function createConfidenceEvolutionApi(timestamp: string = apiLayerTimestamp): ConfidenceEvolutionApi {
  initializeConfidenceEvolutionApiLayer(timestamp);
  return getConfidenceEvolutionApi();
}

export function getConfidenceEvolutionApi(): ConfidenceEvolutionApi {
  if (!confidenceEvolutionApiInstance) {
    throw new Error("Confidence Evolution API is not initialized. Call createConfidenceEvolutionApi() first.");
  }
  return confidenceEvolutionApiInstance;
}

export function getConfidenceEvolutionApiManifest(
  timestamp: string = apiLayerTimestamp
): ConfidenceEvolutionApiCapabilityManifest {
  return buildConfidenceEvolutionApiManifest(timestamp);
}

export function validateConfidenceEvolutionApiContractSurface(): ReturnType<typeof validateApiContractShape> {
  return validateApiContractShape(confidenceEvolutionApiInstance);
}

export { getConfidenceEvolutionConsumerContract, listConfidenceEvolutionConsumerContracts };

export function validateConfidenceEvolutionConsumerAccessRequest(
  request: ConfidenceEvolutionConsumerAccessRequest
): ReturnType<typeof validateConfidenceEvolutionConsumerAccess> {
  return validateConfidenceEvolutionConsumerAccess(request);
}

export function validateConfidenceEvolutionApiContract(): ReturnType<typeof validateConfidenceEvolutionApiContractSurface> {
  const contract = validateConfidenceEvolutionApiContractSurface();
  const manifest = validateConfidenceEvolutionApiManifest(getConfidenceEvolutionApiManifest());
  const prerequisites = validateConfidenceEvolutionApiPrerequisites();
  const issues = [...contract.issues, ...manifest.issues, ...prerequisites.issues];
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export { runConfidenceEvolutionApiCertification };

export const CONFIDENCE_EVOLUTION_API_VERSION = CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION;
export const ConfidenceEvolutionApiLayer = Object.freeze({
  createConfidenceEvolutionApi,
  getConfidenceEvolutionApi,
  getConfidenceEvolutionApiManifest,
  validateConfidenceEvolutionApiContract,
  getConfidenceEvolutionConsumerContract,
  validateConfidenceEvolutionConsumerAccess: validateConfidenceEvolutionConsumerAccessRequest,
  version: CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION,
  tags: CONFIDENCE_EVOLUTION_API_TAGS,
  mustNotOwn: CONFIDENCE_EVOLUTION_MUST_NOT_OWN,
});

export { CONFIDENCE_EVOLUTION_API_TAGS };
