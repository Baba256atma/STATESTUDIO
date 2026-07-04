import { ExecutiveAssistantDashboardConnectionPlatform } from "./executiveAssistantDashboardConnectionIndex.ts";
import { ExecutiveAttentionSignalPlatformFacade } from "./executiveAttentionSignalIndex.ts";
import { ExecutiveAwarenessContextAggregatorPlatform } from "./executiveAwarenessContextAggregatorIndex.ts";
import { ExecutiveBlindSpotBridgePlatform } from "./executiveBlindSpotBridgeIndex.ts";
import { ExecutiveJudgmentExplanationBridgePlatform } from "./executiveJudgmentExplanationBridgeIndex.ts";
import { ExecutiveJudgmentRecommendationBridgePlatform } from "./executiveJudgmentRecommendationBridgeIndex.ts";
import { ExecutiveLayerConnectionContractPlatform } from "./executiveLayerConnectionIndex.ts";
import { ExecutivePrioritySignalPlatformFacade } from "./executivePrioritySignalIndex.ts";
import { ExecutiveReasoningJudgmentBridgePlatform } from "./executiveReasoningJudgmentBridgeIndex.ts";
import { ExecutiveSceneEveSignalBridgePlatform } from "./executiveSceneEveSignalBridgeIndex.ts";
import { ExecutiveTypeCRuntimeIntegrationPlatformFacade } from "./executiveTypeCRuntimeIntegrationIndex.ts";
import type { ExecutiveLayerConnectionCompatibilityMatrix } from "./executiveLayerConnectionPlatformFreezeTypes.ts";

export function getExecutiveLayerConnectionCompatibilityMatrix(): ExecutiveLayerConnectionCompatibilityMatrix {
  const connectionManifest = ExecutiveLayerConnectionContractPlatform.buildExecutiveConnectionManifest();
  const reasoningJudgmentManifest = ExecutiveReasoningJudgmentBridgePlatform.buildExecutiveReasoningJudgmentBridgeManifest();
  const judgmentRecommendationManifest = ExecutiveJudgmentRecommendationBridgePlatform.buildExecutiveJudgmentRecommendationBridgeManifest();
  const judgmentExplanationManifest = ExecutiveJudgmentExplanationBridgePlatform.buildExecutiveJudgmentExplanationBridgeManifest();
  const awarenessManifest = ExecutiveAwarenessContextAggregatorPlatform.buildExecutiveAwarenessContextManifest();
  const attentionManifest = ExecutiveAttentionSignalPlatformFacade.buildExecutiveAttentionSignalManifest();
  const priorityManifest = ExecutivePrioritySignalPlatformFacade.buildExecutivePrioritySignalManifest();
  const blindSpotManifest = ExecutiveBlindSpotBridgePlatform.buildExecutiveBlindSpotManifest();
  const assistantDashboardManifest = ExecutiveAssistantDashboardConnectionPlatform.buildExecutiveAssistantDashboardManifest();
  const sceneEveManifest = ExecutiveSceneEveSignalBridgePlatform.buildExecutiveSceneEveManifest();
  const runtimeManifest = ExecutiveTypeCRuntimeIntegrationPlatformFacade.buildExecutiveTypeCRuntimeManifest();

  return Object.freeze([
    Object.freeze({ platformId: "LAY-CONN-1", compatible: connectionManifest.platformVersion === "LAY-CONN-1", required: true, mode: "certified", notes: Object.freeze(["Certified Layer Connection Contracts."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-2", compatible: reasoningJudgmentManifest.bridgeId === "executive-reasoning-judgment-bridge", required: true, mode: "certified", notes: Object.freeze(["Certified Reasoning Judgment Bridge."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-3", compatible: judgmentRecommendationManifest.bridgeId === "executive-judgment-recommendation-bridge", required: true, mode: "certified", notes: Object.freeze(["Certified Judgment Recommendation Bridge."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-4", compatible: judgmentExplanationManifest.bridgeId === "executive-judgment-explanation-bridge", required: true, mode: "certified", notes: Object.freeze(["Certified Judgment Explanation Bridge."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-5", compatible: awarenessManifest.aggregatorId === "executive-awareness-context-aggregator", required: true, mode: "certified", notes: Object.freeze(["Certified Awareness Context Aggregator."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-6", compatible: attentionManifest.platformId === "executive-attention-signal-platform", required: true, mode: "certified", notes: Object.freeze(["Certified Attention Signal Platform."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-7", compatible: priorityManifest.platformId === "executive-priority-signal-platform", required: true, mode: "certified", notes: Object.freeze(["Certified Executive Priority Signal Platform."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-8", compatible: blindSpotManifest.platformId === "executive-blind-spot-bridge", required: true, mode: "certified", notes: Object.freeze(["Certified Executive Blind Spot Bridge."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-9", compatible: assistantDashboardManifest.platformId === "executive-assistant-dashboard-connection-api", required: true, mode: "certified", notes: Object.freeze(["Certified Assistant Dashboard Connection API."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-10", compatible: sceneEveManifest.platformId === "executive-scene-eve-signal-bridge", required: true, mode: "certified", notes: Object.freeze(["Certified Scene EVE Signal Bridge."] as const) }),
    Object.freeze({ platformId: "LAY-CONN-11", compatible: runtimeManifest.platformId === "executive-type-c-runtime-integration-platform", required: true, mode: "certified", notes: Object.freeze(["Certified Type-C Runtime Integration metadata platform."] as const) }),
  ]);
}
