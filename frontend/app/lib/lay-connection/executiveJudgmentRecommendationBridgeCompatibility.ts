import { ExecutiveJudgmentPlatformFreeze } from "../executive-judgment/executiveJudgmentPlatformFreezeIndex.ts";
import { getExecutiveRecommendationCompatibility } from "../executive-recommendation/executiveRecommendationPlatformFreezeCompatibility.ts";
import {
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION,
  getExecutiveRecommendationPlatformRegistry,
} from "../executive-recommendation/executiveRecommendationPlatformFreezeRegistry.ts";
import { ExecutiveLayerConnectionContractPlatform } from "./executiveLayerConnectionIndex.ts";
import { ExecutiveReasoningJudgmentBridgePlatform } from "./executiveReasoningJudgmentBridgeIndex.ts";
import type { ExecutiveRecommendationCompatibility } from "./executiveJudgmentRecommendationBridgeTypes.ts";

export function getExecutiveJudgmentRecommendationBridgeCompatibilityMatrix(): readonly ExecutiveRecommendationCompatibility[] {
  const connectionManifest = ExecutiveLayerConnectionContractPlatform.buildExecutiveConnectionManifest();
  const reasoningJudgmentManifest = ExecutiveReasoningJudgmentBridgePlatform.buildExecutiveReasoningJudgmentBridgeManifest();
  const judgmentState = ExecutiveJudgmentPlatformFreeze.getExecutiveJudgmentPlatformFreezeState();
  const recommendationRegistry = getExecutiveRecommendationPlatformRegistry();
  const recommendationCompatibility = getExecutiveRecommendationCompatibility();

  return Object.freeze([
    Object.freeze({
      platformId: "LAY-CONN-1",
      compatible: connectionManifest.platformVersion === "LAY-CONN-1",
      required: true,
      notes: Object.freeze(["Consumes the certified connection contract platform facade."] as const),
    }),
    Object.freeze({
      platformId: "LAY-CONN-2",
      compatible: reasoningJudgmentManifest.bridgeId === "executive-reasoning-judgment-bridge",
      required: true,
      notes: Object.freeze(["Consumes the certified reasoning to judgment bridge facade."] as const),
    }),
    Object.freeze({
      platformId: "APP-JUDGE",
      compatible: judgmentState.status === "PASS",
      required: true,
      notes: Object.freeze(["Consumes the certified executive judgment platform freeze facade."] as const),
    }),
    Object.freeze({
      platformId: "APP-RECOMMENDATION",
      compatible:
        recommendationRegistry.registryVersion === EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION &&
        recommendationRegistry.phaseCount >= 9 &&
        recommendationCompatibility.app12Platform.compatible,
      required: true,
      notes: Object.freeze(["Consumes the certified executive recommendation platform freeze facade."] as const),
    }),
  ]);
}
