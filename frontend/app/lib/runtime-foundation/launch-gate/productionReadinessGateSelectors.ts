import { getProductionReadinessGateStore } from "./productionReadinessGateStore";
import type {
  LaunchBlocker,
  LaunchRisk,
  MVPProductionReadinessGate,
  ProductionReadinessGateHistoryEntry,
} from "./productionReadinessGateTypes";

/** Readonly selectors for MVP readiness dashboard and executive launch summary surfaces. */

export function selectMVPProductionReadinessGates(
  organizationId: string
): readonly MVPProductionReadinessGate[] {
  return getProductionReadinessGateStore(organizationId).getState().readinessGates;
}

export function selectLatestMVPProductionReadinessGate(
  organizationId: string
): MVPProductionReadinessGate | null {
  return getProductionReadinessGateStore(organizationId).getState().readinessGates[0] ?? null;
}

export function selectLaunchBlockerHistory(organizationId: string): readonly LaunchBlocker[] {
  return getProductionReadinessGateStore(organizationId).getState().blockerHistory;
}

export function selectLaunchRiskHistory(organizationId: string): readonly LaunchRisk[] {
  return getProductionReadinessGateStore(organizationId).getState().launchRiskHistory;
}

export function selectProductionReadinessGateHistory(
  organizationId: string
): readonly ProductionReadinessGateHistoryEntry[] {
  return getProductionReadinessGateStore(organizationId).getState().gateHistory;
}

export function selectProductionReadinessGateSignature(organizationId: string): string {
  return getProductionReadinessGateStore(organizationId).getState().signature;
}
