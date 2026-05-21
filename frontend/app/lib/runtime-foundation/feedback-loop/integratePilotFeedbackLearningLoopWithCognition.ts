import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../enterprise/governance/adaptiveGovernanceTypes";
import { deriveMVPReadinessStatus } from "../../../components/runtime/mvpReadinessDashboardUtils";
import { selectLatestMVPDemoModeState } from "../demo-mode/demoModeSelectors";
import { selectLatestMVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationSelectors";
import { selectLatestExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilitySelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilitySelectors";
import { runMVPSmokeTestSuite } from "../smoke-tests/mvpSmokeTestRunner";
import { evaluatePilotFeedbackLearningLoop } from "./pilotFeedbackEngine";
import type { PilotFeedbackLearningLoopResult } from "./pilotFeedbackTypes";

/**
 * D9:10:8 — Passive MVP pilot feedback learning loop.
 * Demo Mode → Pilot Feedback Learning Loop
 */
export function integratePilotFeedbackLearningLoopWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  now?: number;
}): PilotFeedbackLearningLoopResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const foundation = selectLatestMVPStrategicReadinessSnapshot(organizationId);
  const operational = selectLatestExecutiveOperationalReliabilitySnapshot(organizationId);
  const interaction = selectLatestExecutiveInteractionStabilitySnapshot(organizationId);
  const demoMode = selectLatestMVPDemoModeState(organizationId);
  const smokeTestSuite = runMVPSmokeTestSuite({ organizationId, now: params.now });

  const readinessDashboardStatus = deriveMVPReadinessStatus({
    organizationId,
    foundation,
    operational,
    interaction,
  });

  return evaluatePilotFeedbackLearningLoop({
    organizationId,
    demoModeSnapshot: demoMode,
    readinessDashboardStatus,
    smokeTestSuite,
    operationalReliabilitySnapshot: operational,
    now: params.now,
  });
}
