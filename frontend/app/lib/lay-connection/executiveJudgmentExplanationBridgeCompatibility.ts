import { ExecutiveJudgmentPlatformFreeze } from "../executive-judgment/executiveJudgmentPlatformFreezeIndex.ts";
import { ExecutiveLayerConnectionContractPlatform } from "./executiveLayerConnectionIndex.ts";
import { ExecutiveJudgmentRecommendationBridgePlatform } from "./executiveJudgmentRecommendationBridgeIndex.ts";
import { ExecutiveReasoningJudgmentBridgePlatform } from "./executiveReasoningJudgmentBridgeIndex.ts";
import type { ExecutiveExplanationCompatibility } from "./executiveJudgmentExplanationBridgeTypes.ts";

export function getExecutiveJudgmentExplanationBridgeCompatibilityMatrix(): readonly ExecutiveExplanationCompatibility[] {
  const connectionManifest = ExecutiveLayerConnectionContractPlatform.buildExecutiveConnectionManifest();
  const reasoningJudgmentManifest = ExecutiveReasoningJudgmentBridgePlatform.buildExecutiveReasoningJudgmentBridgeManifest();
  const judgmentRecommendationManifest = ExecutiveJudgmentRecommendationBridgePlatform.buildExecutiveJudgmentRecommendationBridgeManifest();
  const judgmentState = ExecutiveJudgmentPlatformFreeze.getExecutiveJudgmentPlatformFreezeState();

  return Object.freeze([
    Object.freeze({
      platformId: "LAY-CONN-1",
      compatible: connectionManifest.platformVersion === "LAY-CONN-1",
      required: true,
      mode: "certified",
      notes: Object.freeze(["Consumes the certified connection contract platform facade."] as const),
    }),
    Object.freeze({
      platformId: "LAY-CONN-2",
      compatible: reasoningJudgmentManifest.bridgeId === "executive-reasoning-judgment-bridge",
      required: true,
      mode: "certified",
      notes: Object.freeze(["Consumes the certified reasoning to judgment bridge facade."] as const),
    }),
    Object.freeze({
      platformId: "LAY-CONN-3",
      compatible: judgmentRecommendationManifest.bridgeId === "executive-judgment-recommendation-bridge",
      required: true,
      mode: "certified",
      notes: Object.freeze(["Consumes the certified judgment to recommendation bridge facade."] as const),
    }),
    Object.freeze({
      platformId: "APP-JUDGE",
      compatible: judgmentState.status === "PASS",
      required: true,
      mode: "certified",
      notes: Object.freeze(["Consumes the certified executive judgment platform freeze facade."] as const),
    }),
    Object.freeze({
      platformId: "EXECUTIVE-EXPLANATION",
      compatible: true,
      required: false,
      mode: "future-compatible",
      notes: Object.freeze(["No separate certified explanation platform is required by this metadata bridge."] as const),
    }),
  ]);
}
