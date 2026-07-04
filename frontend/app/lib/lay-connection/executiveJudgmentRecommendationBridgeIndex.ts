export type {
  ExecutiveDecisionConstraint,
  ExecutiveDecisionEvidence,
  ExecutiveDecisionTradeoff,
  ExecutiveJudgmentInput,
  ExecutiveJudgmentRecommendationBridge as ExecutiveJudgmentRecommendationBridgeContract,
  ExecutiveRecommendationBridgeLifecycle,
  ExecutiveRecommendationBridgeResult,
  ExecutiveRecommendationCertification,
  ExecutiveRecommendationCompatibility,
  ExecutiveRecommendationConfidence,
  ExecutiveRecommendationContext,
  ExecutiveRecommendationIntent,
  ExecutiveRecommendationManifest,
  ExecutiveRecommendationMetadata,
  ExecutiveRecommendationPayloadType,
  ExecutiveRecommendationRegistry,
  ExecutiveRecommendationRequest,
  ExecutiveRecommendationValidation,
} from "./executiveJudgmentRecommendationBridgeTypes.ts";

export {
  EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_ID,
  EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_METADATA,
  EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_VERSION,
  EXECUTIVE_JUDGMENT_RECOMMENDATION_PAYLOAD_TYPES,
  ExecutiveJudgmentRecommendationBridge,
} from "./executiveJudgmentRecommendationBridgeContracts.ts";
export { getExecutiveJudgmentRecommendationBridgeCompatibilityMatrix } from "./executiveJudgmentRecommendationBridgeCompatibility.ts";
export { buildExecutiveJudgmentRecommendationBridgeManifest } from "./executiveJudgmentRecommendationBridgeManifest.ts";
export {
  EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_PUBLIC_APIS,
  getExecutiveJudgmentRecommendationBridgeRegistry,
} from "./executiveJudgmentRecommendationBridgeRegistry.ts";
export {
  validateExecutiveJudgmentRecommendationBridge,
  validateExecutiveJudgmentRecommendationBridgeManifest,
  validateExecutiveJudgmentRecommendationBridgeRegistry,
} from "./executiveJudgmentRecommendationBridgeValidation.ts";

import { ExecutiveJudgmentRecommendationBridge } from "./executiveJudgmentRecommendationBridgeContracts.ts";
import { getExecutiveJudgmentRecommendationBridgeCompatibilityMatrix } from "./executiveJudgmentRecommendationBridgeCompatibility.ts";
import { buildExecutiveJudgmentRecommendationBridgeManifest } from "./executiveJudgmentRecommendationBridgeManifest.ts";
import { getExecutiveJudgmentRecommendationBridgeRegistry } from "./executiveJudgmentRecommendationBridgeRegistry.ts";
import {
  validateExecutiveJudgmentRecommendationBridge,
  validateExecutiveJudgmentRecommendationBridgeManifest,
  validateExecutiveJudgmentRecommendationBridgeRegistry,
} from "./executiveJudgmentRecommendationBridgeValidation.ts";

export const ExecutiveJudgmentRecommendationBridgePlatform = Object.freeze({
  ExecutiveJudgmentRecommendationBridge,
  buildExecutiveJudgmentRecommendationBridgeManifest,
  validateExecutiveJudgmentRecommendationBridge,
  validateExecutiveJudgmentRecommendationBridgeManifest,
  validateExecutiveJudgmentRecommendationBridgeRegistry,
  getExecutiveJudgmentRecommendationBridgeRegistry,
  getExecutiveJudgmentRecommendationBridgeCompatibilityMatrix,
});
