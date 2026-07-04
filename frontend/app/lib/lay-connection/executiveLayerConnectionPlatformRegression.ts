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
import type { ExecutiveLayerConnectionRegression, ExecutiveLayerConnectionRegressionEntry } from "./executiveLayerConnectionPlatformFreezeTypes.ts";

function entry(phaseId: string, passed: boolean, diagnostics: readonly string[] = Object.freeze([])): ExecutiveLayerConnectionRegressionEntry {
  return Object.freeze({ phaseId, passed, diagnostics: Object.freeze([...diagnostics]) });
}

export function runExecutiveLayerConnectionRegression(): ExecutiveLayerConnectionRegression {
  const entries = Object.freeze([
    entry("LAY-CONN-1", ExecutiveLayerConnectionContractPlatform.validateExecutiveConnectionRegistry().valid),
    entry("LAY-CONN-2", ExecutiveReasoningJudgmentBridgePlatform.validateExecutiveReasoningJudgmentBridgeRegistry().valid),
    entry("LAY-CONN-3", ExecutiveJudgmentRecommendationBridgePlatform.validateExecutiveJudgmentRecommendationBridgeRegistry().valid),
    entry("LAY-CONN-4", ExecutiveJudgmentExplanationBridgePlatform.validateExecutiveJudgmentExplanationBridgeRegistry().valid),
    entry("LAY-CONN-5", ExecutiveAwarenessContextAggregatorPlatform.validateExecutiveAwarenessContextRegistry().valid),
    entry("LAY-CONN-6", ExecutiveAttentionSignalPlatformFacade.validateExecutiveAttentionSignalRegistry().valid),
    entry("LAY-CONN-7", ExecutivePrioritySignalPlatformFacade.validateExecutivePrioritySignalRegistry().valid),
    entry("LAY-CONN-8", ExecutiveBlindSpotBridgePlatform.validateExecutiveBlindSpotRegistry().valid),
    entry("LAY-CONN-9", ExecutiveAssistantDashboardConnectionPlatform.validateExecutiveAssistantDashboardRegistry().valid),
    entry("LAY-CONN-10", ExecutiveSceneEveSignalBridgePlatform.validateExecutiveSceneEveRegistry().valid),
    entry("LAY-CONN-11", ExecutiveTypeCRuntimeIntegrationPlatformFacade.validateExecutiveTypeCRuntimeRegistry().valid),
  ] as const);
  const failed = entries.filter((item) => !item.passed).map((item) => item.phaseId);

  return Object.freeze({
    status: failed.length === 0 ? "PASS" : "FAIL",
    entries,
    diagnostics: Object.freeze(failed.map((phaseId) => `regression-failed:${phaseId}`)),
  });
}
