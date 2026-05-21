import { getStabilityOptimizationStore } from "./stabilityOptimizationStore";
import type {
  AdaptiveResilienceIndicator,
  EnterpriseResiliencePathway,
  OperationalSustainabilitySignal,
  StabilityOptimizationSnapshot,
  StabilityReinforcementTopology,
  StrategicStabilityOptimization,
} from "./stabilityOptimizationTypes";

/** Readonly selectors for future resilience optimization dashboards and sustainability panels. */

export function selectStrategicStabilityOptimizations(
  organizationId: string
): readonly StrategicStabilityOptimization[] {
  return getStabilityOptimizationStore(organizationId).getState().stabilityOptimizations;
}

export function selectStabilityOptimizationSnapshots(
  organizationId: string
): readonly StabilityOptimizationSnapshot[] {
  return getStabilityOptimizationStore(organizationId).getState().snapshots;
}

export function selectLatestStabilityOptimizationSnapshot(
  organizationId: string
): StabilityOptimizationSnapshot | null {
  return getStabilityOptimizationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseResiliencePathways(
  organizationId: string
): readonly EnterpriseResiliencePathway[] {
  return getStabilityOptimizationStore(organizationId).getState().resiliencePathways;
}

export function selectOperationalSustainabilitySignals(
  organizationId: string
): readonly OperationalSustainabilitySignal[] {
  return getStabilityOptimizationStore(organizationId).getState().sustainabilitySignals;
}

export function selectStabilityReinforcementTopologies(
  organizationId: string
): readonly StabilityReinforcementTopology[] {
  return getStabilityOptimizationStore(organizationId).getState().reinforcementTopologies;
}

export function selectAdaptiveResilienceIndicators(
  organizationId: string
): readonly AdaptiveResilienceIndicator[] {
  return getStabilityOptimizationStore(organizationId).getState().adaptiveResilienceIndicators;
}

export function selectStabilityOptimizationSignature(organizationId: string): string {
  return getStabilityOptimizationStore(organizationId).getState().signature;
}
