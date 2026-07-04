import {
  EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_ID,
  EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_METADATA,
  EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_VERSION,
  EXECUTIVE_JUDGMENT_RECOMMENDATION_PAYLOAD_TYPES,
} from "./executiveJudgmentRecommendationBridgeContracts.ts";
import { getExecutiveJudgmentRecommendationBridgeCompatibilityMatrix } from "./executiveJudgmentRecommendationBridgeCompatibility.ts";
import type { ExecutiveRecommendationRegistry } from "./executiveJudgmentRecommendationBridgeTypes.ts";

export const EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveJudgmentRecommendationBridge",
  "buildExecutiveJudgmentRecommendationBridgeManifest",
  "validateExecutiveJudgmentRecommendationBridge",
  "validateExecutiveJudgmentRecommendationBridgeManifest",
  "getExecutiveJudgmentRecommendationBridgeRegistry",
  "getExecutiveJudgmentRecommendationBridgeCompatibilityMatrix",
] as const);

export function getExecutiveJudgmentRecommendationBridgeRegistry(): ExecutiveRecommendationRegistry {
  return Object.freeze({
    bridgeId: EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_ID,
    supportedProducers: Object.freeze(["APP-JUDGE"] as const),
    supportedConsumers: Object.freeze(["APP-RECOMMENDATION"] as const),
    supportedPayloadTypes: EXECUTIVE_JUDGMENT_RECOMMENDATION_PAYLOAD_TYPES,
    supportedContractVersions: Object.freeze([EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_VERSION] as const),
    compatibilityMatrix: getExecutiveJudgmentRecommendationBridgeCompatibilityMatrix(),
    extensionPolicy: EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_METADATA,
    publicApis: EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_PUBLIC_APIS,
  });
}
