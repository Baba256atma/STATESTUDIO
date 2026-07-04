import { ExecutiveLayerConnectionContractPlatform } from "./executiveLayerConnectionIndex.ts";
import { ExecutiveReasoningPlatformFreeze } from "../app-reason/executiveReasoningPlatformFreezeIndex.ts";
import { ExecutiveJudgmentPlatformFreeze } from "../executive-judgment/executiveJudgmentPlatformFreezeIndex.ts";
import type { ExecutiveBridgeCompatibility } from "./executiveReasoningJudgmentBridgeTypes.ts";

export function getExecutiveReasoningJudgmentBridgeCompatibilityMatrix(): readonly ExecutiveBridgeCompatibility[] {
  const connectionManifest = ExecutiveLayerConnectionContractPlatform.buildExecutiveConnectionManifest();
  const reasoningState = ExecutiveReasoningPlatformFreeze.getExecutiveReasoningPlatformFreezeState();
  const judgmentState = ExecutiveJudgmentPlatformFreeze.getExecutiveJudgmentPlatformFreezeState();

  return Object.freeze([
    Object.freeze({
      platformId: "LAY-CONN-1",
      compatible: connectionManifest.platformVersion === "LAY-CONN-1",
      required: true,
      notes: Object.freeze(["Consumes the certified connection contract platform facade."] as const),
    }),
    Object.freeze({
      platformId: "APP-REASON",
      compatible: reasoningState.status === "PASS",
      required: true,
      notes: Object.freeze(["Consumes the certified executive reasoning platform freeze facade."] as const),
    }),
    Object.freeze({
      platformId: "APP-JUDGE",
      compatible: judgmentState.status === "PASS",
      required: true,
      notes: Object.freeze(["Consumes the certified executive judgment platform freeze facade."] as const),
    }),
  ]);
}
