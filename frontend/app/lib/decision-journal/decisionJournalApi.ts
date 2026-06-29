/**
 * APP-8:7 — Decision Journal API + Consumer Contract Layer.
 */

import { DECISION_JOURNAL_MUST_NOT_OWN } from "./decisionJournalConstants.ts";
import { createDecisionJournalFoundation } from "./decisionJournalFoundation.ts";
import { initializeDecisionJournalEngine } from "./decisionJournalEngine.ts";
import { initializeDecisionJournalQueryLayer } from "./decisionJournalQuery.ts";
import { initializeDecisionJournalReflectionLayer } from "./decisionJournalReflection.ts";
import { initializeDecisionJournalEvidenceAssumptionLayer } from "./decisionJournalEvidenceAssumption.ts";
import { initializeDecisionJournalRetrospectiveLayer } from "./decisionJournalRetrospective.ts";
import { createDecisionJournalApiFacade } from "./decisionJournalApiFacade.ts";
import {
  buildDecisionJournalApiManifest,
  DECISION_JOURNAL_API_SELF_MANIFEST,
} from "./decisionJournalApiManifest.ts";
import {
  DECISION_JOURNAL_API_CONTRACT_VERSION,
  DECISION_JOURNAL_API_TAGS,
  type DecisionJournalApi,
  type DecisionJournalApiCapabilityManifest,
  type DecisionJournalApiEngineState,
} from "./decisionJournalApiTypes.ts";
import {
  validateDecisionJournalApiContract as validateApiContractShape,
  validateDecisionJournalApiManifest,
  validateDecisionJournalApiPrerequisites,
} from "./decisionJournalApiValidation.ts";
import {
  getDecisionJournalConsumerContract,
  listDecisionJournalConsumerContracts,
} from "./decisionJournalConsumerContracts.ts";
import { validateDecisionJournalConsumerAccess } from "./decisionJournalConsumerValidation.ts";
import type { DecisionJournalConsumerAccessRequest } from "./decisionJournalApiTypes.ts";
import { runDecisionJournalApiCertification } from "./decisionJournalApiRunner.ts";

export { DECISION_JOURNAL_API_SELF_MANIFEST, DECISION_JOURNAL_API_PUBLIC_RULES } from "./decisionJournalApiManifest.ts";

let apiLayerInitialized = false;
let apiLayerTimestamp = "2026-01-01T00:00:00.000Z";
let decisionJournalApiInstance: DecisionJournalApi | null = null;

function initializePrerequisiteLayers(timestamp: string): void {
  createDecisionJournalFoundation(timestamp);
  initializeDecisionJournalEngine(timestamp);
  initializeDecisionJournalQueryLayer(timestamp);
  initializeDecisionJournalReflectionLayer(timestamp);
  initializeDecisionJournalEvidenceAssumptionLayer(timestamp);
  initializeDecisionJournalRetrospectiveLayer(timestamp);
}

export function initializeDecisionJournalApiLayer(
  timestamp: string = apiLayerTimestamp
): DecisionJournalApiEngineState {
  apiLayerTimestamp = timestamp;
  initializePrerequisiteLayers(timestamp);
  apiLayerInitialized = true;
  decisionJournalApiInstance = createDecisionJournalApiFacade(() => runDecisionJournalApiCertification());
  return getDecisionJournalApiEngineState(timestamp);
}

export function isDecisionJournalApiLayerInitialized(): boolean {
  return apiLayerInitialized;
}

export function getDecisionJournalApiEngineState(
  timestamp: string = apiLayerTimestamp
): DecisionJournalApiEngineState {
  return Object.freeze({
    engineId: "decision-journal-api-layer",
    contractVersion: DECISION_JOURNAL_API_CONTRACT_VERSION,
    initialized: apiLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionJournalApiLayerForTests(): void {
  apiLayerInitialized = false;
  apiLayerTimestamp = "2026-01-01T00:00:00.000Z";
  decisionJournalApiInstance = null;
}

export function createDecisionJournalApi(timestamp: string = apiLayerTimestamp): DecisionJournalApi {
  initializeDecisionJournalApiLayer(timestamp);
  return getDecisionJournalApi();
}

export function getDecisionJournalApi(): DecisionJournalApi {
  if (!decisionJournalApiInstance) {
    throw new Error("Decision Journal API is not initialized. Call createDecisionJournalApi() first.");
  }
  return decisionJournalApiInstance;
}

export function getDecisionJournalApiManifest(
  timestamp: string = apiLayerTimestamp
): DecisionJournalApiCapabilityManifest {
  return buildDecisionJournalApiManifest(timestamp);
}

export function validateDecisionJournalApiContractSurface(): ReturnType<typeof validateApiContractShape> {
  return validateApiContractShape(decisionJournalApiInstance);
}

export { getDecisionJournalConsumerContract, listDecisionJournalConsumerContracts };

export function validateDecisionJournalConsumerAccessRequest(
  request: DecisionJournalConsumerAccessRequest
): ReturnType<typeof validateDecisionJournalConsumerAccess> {
  return validateDecisionJournalConsumerAccess(request);
}

export function validateDecisionJournalApiContract(): ReturnType<typeof validateDecisionJournalApiContractSurface> {
  const contract = validateDecisionJournalApiContractSurface();
  const manifest = validateDecisionJournalApiManifest(getDecisionJournalApiManifest());
  const prerequisites = validateDecisionJournalApiPrerequisites();
  const issues = [...contract.issues, ...manifest.issues, ...prerequisites.issues];
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export { runDecisionJournalApiCertification };

export const DECISION_JOURNAL_API_VERSION = DECISION_JOURNAL_API_CONTRACT_VERSION;
export const DecisionJournalApiLayer = Object.freeze({
  createDecisionJournalApi,
  getDecisionJournalApi,
  getDecisionJournalApiManifest,
  validateDecisionJournalApiContract,
  getDecisionJournalConsumerContract,
  validateDecisionJournalConsumerAccess: validateDecisionJournalConsumerAccessRequest,
  version: DECISION_JOURNAL_API_CONTRACT_VERSION,
  tags: DECISION_JOURNAL_API_TAGS,
  mustNotOwn: DECISION_JOURNAL_MUST_NOT_OWN,
});

export { DECISION_JOURNAL_API_TAGS };
