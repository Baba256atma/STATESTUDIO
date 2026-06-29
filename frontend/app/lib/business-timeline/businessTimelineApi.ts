/**
 * APP-7:6 — Business Timeline API + Consumer Contract Layer.
 */

import { BUSINESS_TIMELINE_MUST_NOT_OWN } from "./businessTimelineConstants.ts";
import { createBusinessTimelineFoundation } from "./businessTimelineFoundation.ts";
import { initializeBusinessEventEngine } from "./businessEventEngine.ts";
import { initializeBusinessTimelineQueryLayer } from "./businessTimelineQuery.ts";
import { initializeBusinessTimelineLifecycleLayer } from "./businessTimelineLifecycle.ts";
import { initializeBusinessTimelineContextLayer } from "./businessTimelineContext.ts";
import { createBusinessTimelineApiFacade } from "./businessTimelineApiFacade.ts";
import {
  buildBusinessTimelineApiManifest,
  BUSINESS_TIMELINE_API_SELF_MANIFEST,
} from "./businessTimelineApiManifest.ts";
import {
  BUSINESS_TIMELINE_API_CONTRACT_VERSION,
  BUSINESS_TIMELINE_API_TAGS,
  type BusinessTimelineApi,
  type BusinessTimelineApiCapabilityManifest,
  type BusinessTimelineApiEngineState,
} from "./businessTimelineApiTypes.ts";
import {
  validateBusinessTimelineApiContract as validateApiContractShape,
  validateBusinessTimelineApiManifest,
  validateBusinessTimelineApiPrerequisites,
} from "./businessTimelineApiValidation.ts";
import {
  getBusinessTimelineConsumerContract,
  listBusinessTimelineConsumerContracts,
} from "./businessTimelineConsumerContracts.ts";
import {
  validateBusinessTimelineConsumerAccess,
} from "./businessTimelineConsumerValidation.ts";
import type { BusinessTimelineConsumerAccessRequest } from "./businessTimelineApiTypes.ts";
import { runBusinessTimelineApiCertification } from "./businessTimelineApiRunner.ts";

export { BUSINESS_TIMELINE_API_SELF_MANIFEST, BUSINESS_TIMELINE_API_PUBLIC_RULES } from "./businessTimelineApiManifest.ts";

let apiLayerInitialized = false;
let apiLayerTimestamp = "2026-01-01T00:00:00.000Z";
let businessTimelineApiInstance: BusinessTimelineApi | null = null;

function initializePrerequisiteLayers(timestamp: string): void {
  createBusinessTimelineFoundation(timestamp);
  initializeBusinessEventEngine(timestamp);
  initializeBusinessTimelineQueryLayer(timestamp);
  initializeBusinessTimelineLifecycleLayer(timestamp);
  initializeBusinessTimelineContextLayer(timestamp);
}

export function initializeBusinessTimelineApiLayer(timestamp: string = apiLayerTimestamp): BusinessTimelineApiEngineState {
  apiLayerTimestamp = timestamp;
  initializePrerequisiteLayers(timestamp);
  apiLayerInitialized = true;
  businessTimelineApiInstance = createBusinessTimelineApiFacade(() => runBusinessTimelineApiCertification());
  return getBusinessTimelineApiEngineState(timestamp);
}

export function isBusinessTimelineApiLayerInitialized(): boolean {
  return apiLayerInitialized;
}

export function getBusinessTimelineApiEngineState(timestamp: string = apiLayerTimestamp): BusinessTimelineApiEngineState {
  return Object.freeze({
    engineId: "business-timeline-api-layer",
    contractVersion: BUSINESS_TIMELINE_API_CONTRACT_VERSION,
    initialized: apiLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetBusinessTimelineApiLayerForTests(): void {
  apiLayerInitialized = false;
  apiLayerTimestamp = "2026-01-01T00:00:00.000Z";
  businessTimelineApiInstance = null;
}

export function createBusinessTimelineApi(timestamp: string = apiLayerTimestamp): BusinessTimelineApi {
  initializeBusinessTimelineApiLayer(timestamp);
  return getBusinessTimelineApi();
}

export function getBusinessTimelineApi(): BusinessTimelineApi {
  if (!businessTimelineApiInstance) {
    throw new Error("Business Timeline API is not initialized. Call createBusinessTimelineApi() first.");
  }
  return businessTimelineApiInstance;
}

export function getBusinessTimelineApiManifest(timestamp: string = apiLayerTimestamp): BusinessTimelineApiCapabilityManifest {
  return buildBusinessTimelineApiManifest(timestamp);
}

export function validateBusinessTimelineApiContractSurface(): ReturnType<typeof validateApiContractShape> {
  return validateApiContractShape(businessTimelineApiInstance);
}

export { getBusinessTimelineConsumerContract, listBusinessTimelineConsumerContracts };

export function validateBusinessTimelineConsumerAccessRequest(
  request: BusinessTimelineConsumerAccessRequest
): ReturnType<typeof validateBusinessTimelineConsumerAccess> {
  return validateBusinessTimelineConsumerAccess(request);
}

export function validateBusinessTimelineApiContract(): ReturnType<typeof validateBusinessTimelineApiContractSurface> {
  const contract = validateBusinessTimelineApiContractSurface();
  const manifest = validateBusinessTimelineApiManifest(getBusinessTimelineApiManifest());
  const prerequisites = validateBusinessTimelineApiPrerequisites();
  const issues = [...contract.issues, ...manifest.issues, ...prerequisites.issues];
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export { runBusinessTimelineApiCertification };

export const BUSINESS_TIMELINE_API_VERSION = BUSINESS_TIMELINE_API_CONTRACT_VERSION;
export const BusinessTimelineApiLayer = Object.freeze({
  createBusinessTimelineApi,
  getBusinessTimelineApi,
  getBusinessTimelineApiManifest,
  validateBusinessTimelineApiContract,
  getBusinessTimelineConsumerContract,
  validateBusinessTimelineConsumerAccess: validateBusinessTimelineConsumerAccessRequest,
  version: BUSINESS_TIMELINE_API_CONTRACT_VERSION,
  tags: BUSINESS_TIMELINE_API_TAGS,
  mustNotOwn: BUSINESS_TIMELINE_MUST_NOT_OWN,
});

export { BUSINESS_TIMELINE_API_TAGS };
