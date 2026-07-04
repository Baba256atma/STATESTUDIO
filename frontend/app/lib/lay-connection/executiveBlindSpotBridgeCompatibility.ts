import { ExecutiveJudgmentPlatformFreeze } from "../executive-judgment/executiveJudgmentPlatformFreezeIndex.ts";
import { ExecutiveReasoningPlatformFreeze } from "../app-reason/executiveReasoningPlatformFreezeIndex.ts";
import { ExecutiveAttentionSignalPlatformFacade } from "./executiveAttentionSignalIndex.ts";
import { ExecutiveAwarenessContextAggregatorPlatform } from "./executiveAwarenessContextAggregatorIndex.ts";
import { ExecutiveJudgmentExplanationBridgePlatform } from "./executiveJudgmentExplanationBridgeIndex.ts";
import { ExecutiveJudgmentRecommendationBridgePlatform } from "./executiveJudgmentRecommendationBridgeIndex.ts";
import { ExecutiveLayerConnectionContractPlatform } from "./executiveLayerConnectionIndex.ts";
import { ExecutivePrioritySignalPlatformFacade } from "./executivePrioritySignalIndex.ts";
import { ExecutiveReasoningJudgmentBridgePlatform } from "./executiveReasoningJudgmentBridgeIndex.ts";
import type { ExecutiveBlindSpotCompatibility } from "./executiveBlindSpotBridgeTypes.ts";

export function getExecutiveBlindSpotCompatibilityMatrix(): readonly ExecutiveBlindSpotCompatibility[] {
  const connectionManifest = ExecutiveLayerConnectionContractPlatform.buildExecutiveConnectionManifest();
  const reasoningJudgmentManifest = ExecutiveReasoningJudgmentBridgePlatform.buildExecutiveReasoningJudgmentBridgeManifest();
  const judgmentRecommendationManifest = ExecutiveJudgmentRecommendationBridgePlatform.buildExecutiveJudgmentRecommendationBridgeManifest();
  const judgmentExplanationManifest = ExecutiveJudgmentExplanationBridgePlatform.buildExecutiveJudgmentExplanationBridgeManifest();
  const awarenessManifest = ExecutiveAwarenessContextAggregatorPlatform.buildExecutiveAwarenessContextManifest();
  const attentionManifest = ExecutiveAttentionSignalPlatformFacade.buildExecutiveAttentionSignalManifest();
  const priorityManifest = ExecutivePrioritySignalPlatformFacade.buildExecutivePrioritySignalManifest();
  const reasoningState = ExecutiveReasoningPlatformFreeze.getExecutiveReasoningPlatformFreezeState();
  const judgmentState = ExecutiveJudgmentPlatformFreeze.getExecutiveJudgmentPlatformFreezeState();

  return Object.freeze([
    Object.freeze({ platformId: "LAY-CONN-1", compatible: connectionManifest.platformVersion === "LAY-CONN-1", required: true, mode: "certified", notes: Object.freeze(["Certified connection contracts."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-2", compatible: reasoningJudgmentManifest.bridgeId === "executive-reasoning-judgment-bridge", required: true, mode: "certified", notes: Object.freeze(["Certified reasoning to judgment bridge."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-3", compatible: judgmentRecommendationManifest.bridgeId === "executive-judgment-recommendation-bridge", required: true, mode: "certified", notes: Object.freeze(["Certified judgment to recommendation bridge."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-4", compatible: judgmentExplanationManifest.bridgeId === "executive-judgment-explanation-bridge", required: true, mode: "certified", notes: Object.freeze(["Certified judgment to explanation bridge."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-5", compatible: awarenessManifest.aggregatorId === "executive-awareness-context-aggregator", required: true, mode: "certified", notes: Object.freeze(["Certified awareness context metadata platform."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-6", compatible: attentionManifest.platformId === "executive-attention-signal-platform", required: true, mode: "certified", notes: Object.freeze(["Certified attention signal metadata platform."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-7", compatible: priorityManifest.platformId === "executive-priority-signal-platform", required: true, mode: "certified", notes: Object.freeze(["Certified priority signal metadata platform."] as const) }),
    Object.freeze({ platformId: "APP-REASON", compatible: reasoningState.status === "PASS", required: true, mode: "certified", notes: Object.freeze(["Certified reasoning metadata source."] as const) }),
    Object.freeze({ platformId: "APP-JUDGE", compatible: judgmentState.status === "PASS", required: true, mode: "certified", notes: Object.freeze(["Certified judgment metadata source."] as const) }),
    Object.freeze({ platformId: "EXECUTIVE-RECOMMENDATION", compatible: true, required: false, mode: "future-compatible", notes: Object.freeze(["Recommendation references are future-compatible metadata only."] as const) }),
    Object.freeze({ platformId: "EXECUTIVE-EXPLANATION", compatible: true, required: false, mode: "future-compatible", notes: Object.freeze(["Explanation references are future-compatible metadata only."] as const) }),
    Object.freeze({ platformId: "KNL", compatible: true, required: false, mode: "future-compatible", notes: Object.freeze(["Knowledge references are future-compatible metadata only."] as const) }),
    Object.freeze({ platformId: "IDN", compatible: true, required: false, mode: "future-compatible", notes: Object.freeze(["Identity references are future-compatible metadata only."] as const) }),
    Object.freeze({ platformId: "SMM", compatible: true, required: false, mode: "future-compatible", notes: Object.freeze(["Shared mental model references are future-compatible metadata only."] as const) }),
    Object.freeze({ platformId: "ASS", compatible: true, required: false, mode: "future-compatible", notes: Object.freeze(["Assistant references are future-compatible metadata only."] as const) }),
  ]);
}
