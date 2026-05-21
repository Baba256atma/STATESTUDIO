import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../enterprise/governance/adaptiveGovernanceTypes";
import { deriveMVPReadinessStatus } from "../../../components/runtime/mvpReadinessDashboardUtils";
import { selectLatestMVPDemoModeState } from "../demo-mode/demoModeSelectors";
import { selectLatestMVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationSelectors";
import { selectLatestExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilitySelectors";
import { selectLatestPilotLearningSnapshot } from "../feedback-loop/pilotFeedbackSelectors";
import { selectLatestMVPProductionReadinessGate } from "../launch-gate/productionReadinessGateSelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilitySelectors";
import { runMVPSmokeTestSuite } from "../smoke-tests/mvpSmokeTestRunner";
import { evaluateMVPFinalHardening } from "./finalHardeningEngine";
import type { MVPFinalHardeningResult } from "./finalStabilizationChecklistTypes";

/**
 * D9:10:9 — Passive MVP final stabilization + production candidate hardening.
 * Pilot Feedback Loop → Final Hardening
 */
export function integrateMVPFinalHardeningWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  now?: number;
}): MVPFinalHardeningResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const foundation = selectLatestMVPStrategicReadinessSnapshot(organizationId);
  const operational = selectLatestExecutiveOperationalReliabilitySnapshot(organizationId);
  const interaction = selectLatestExecutiveInteractionStabilitySnapshot(organizationId);

  const readinessDashboardStatus = deriveMVPReadinessStatus({
    organizationId,
    foundation,
    operational,
    interaction,
  });

  return evaluateMVPFinalHardening({
    organizationId,
    readinessDashboardStatus,
    smokeTestSuite: runMVPSmokeTestSuite({ organizationId, now: params.now }),
    productionReadinessGate: selectLatestMVPProductionReadinessGate(organizationId),
    demoModeSnapshot: selectLatestMVPDemoModeState(organizationId),
    pilotLearningSnapshot: selectLatestPilotLearningSnapshot(organizationId),
    operationalReliabilitySnapshot: operational,
    executiveInteractionStabilitySnapshot: interaction,
    explainabilityAvailable: Boolean(
      params.cognitionSnapshot?.organizationalLearningLine?.trim()
    ),
    now: params.now,
  });
}
