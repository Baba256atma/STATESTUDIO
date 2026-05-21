import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../enterprise/governance/adaptiveGovernanceTypes";
import { deriveMVPReadinessStatus } from "../../../components/runtime/mvpReadinessDashboardUtils";
import { selectLatestMVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationSelectors";
import { selectLatestExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilitySelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilitySelectors";
import { selectLatestMVPProductionReadinessGate } from "../launch-gate/productionReadinessGateSelectors";
import { runMVPSmokeTestSuite } from "../smoke-tests/mvpSmokeTestRunner";
import { evaluateMVPDemoMode } from "./demoModeEngine";
import type { MVPDemoModeResult } from "./demoModeTypes";

/**
 * D9:10:7 — Passive MVP executive demo mode + controlled pilot presentation.
 * Production Readiness Gate → Demo Mode → Controlled Pilot Presentation
 */
export function integrateDemoModeWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  now?: number;
}): MVPDemoModeResult {
  const organizationId = params.organizationId.trim() || "nexora-default";

  const gate = selectLatestMVPProductionReadinessGate(organizationId);
  const foundation = selectLatestMVPStrategicReadinessSnapshot(organizationId);
  const operational = selectLatestExecutiveOperationalReliabilitySnapshot(organizationId);
  const interaction = selectLatestExecutiveInteractionStabilitySnapshot(organizationId);

  const readinessDashboardStatus = deriveMVPReadinessStatus({
    organizationId,
    foundation,
    operational,
    interaction,
  });

  const smokeTestSuite = runMVPSmokeTestSuite({
    organizationId,
    now: params.now,
  });

  return evaluateMVPDemoMode({
    organizationId,
    productionReadinessGate: gate,
    mvpStrategicReadinessSnapshot: foundation,
    operationalReliabilitySnapshot: operational,
    executiveInteractionStabilitySnapshot: interaction,
    smokeTestSuite,
    readinessDashboardStatus,
    now: params.now,
  });
}
