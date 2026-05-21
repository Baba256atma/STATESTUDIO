import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestMVPDemoModeState } from "../demo-mode/demoModeSelectors";
import { selectLatestMVPFinalHardeningSnapshot } from "../final-hardening/finalHardeningSelectors";
import { selectLatestPilotLearningSnapshot } from "../feedback-loop/pilotFeedbackSelectors";
import { selectLatestExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilitySelectors";
import { selectLatestMVPProductionReadinessGate } from "../launch-gate/productionReadinessGateSelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilitySelectors";
import { runMVPSmokeTestSuite } from "../smoke-tests/mvpSmokeTestRunner";
import { evaluateFinalMVPCompletion } from "./finalMVPCompletionEngine";
import type { FinalMVPCompletionResult } from "./finalMVPCompletionTypes";

/**
 * D9:10:10 — Final MVP completion runtime + publish-ready executive intelligence.
 * Final Hardening → Final MVP Completion (D9:10 capstone)
 */
export function integrateFinalMVPCompletionWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  now?: number;
}): FinalMVPCompletionResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  return evaluateFinalMVPCompletion({
    organizationId,
    finalHardeningSnapshot: selectLatestMVPFinalHardeningSnapshot(organizationId),
    productionReadinessGate: selectLatestMVPProductionReadinessGate(organizationId),
    demoModeSnapshot: selectLatestMVPDemoModeState(organizationId),
    smokeTestSuite: runMVPSmokeTestSuite({ organizationId, now: params.now }),
    operationalReliabilitySnapshot: selectLatestExecutiveOperationalReliabilitySnapshot(organizationId),
    executiveInteractionStabilitySnapshot: selectLatestExecutiveInteractionStabilitySnapshot(organizationId),
    pilotLearningSnapshot: selectLatestPilotLearningSnapshot(organizationId),
    now: params.now,
  });
}
