import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../enterprise/governance/adaptiveGovernanceTypes";
import { deriveMVPReadinessStatus } from "../../../components/runtime/mvpReadinessDashboardUtils";
import { selectLatestMVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationSelectors";
import { selectLatestExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilitySelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilitySelectors";
import { runMVPSmokeTestSuite } from "../smoke-tests/mvpSmokeTestRunner";
import { evaluateMVPProductionReadinessGate } from "./productionReadinessGateEngine";
import type { MVPProductionReadinessGateResult } from "./productionReadinessGateTypes";

/**
 * D9:10:6 — Passive MVP production readiness gate + executive launch decision.
 * Runtime Foundation → Operational Reliability → Executive Interaction Stability
 * → MVP Readiness Dashboard → MVP Smoke Test Harness → Production Readiness Gate
 */
export function integrateProductionReadinessGateWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  now?: number;
}): MVPProductionReadinessGateResult {
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

  const smokeTestSuite = runMVPSmokeTestSuite({
    organizationId,
    now: params.now,
  });

  return evaluateMVPProductionReadinessGate({
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    mvpStrategicReadinessSnapshot: foundation,
    operationalReliabilitySnapshot: operational,
    executiveInteractionStabilitySnapshot: interaction,
    smokeTestSuite,
    readinessDashboardStatus,
    explainabilityAvailable: Boolean(
      params.cognitionSnapshot?.organizationalLearningLine?.trim()
    ),
    now: params.now,
  });
}
