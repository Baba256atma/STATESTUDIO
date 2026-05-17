/**
 * D7:2:8 — Regional systemic risk gravity modeling (deterministic).
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { OrganizationalFlowState } from "../flow/flowDynamicsTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { RegionGravityMetrics, RegionGravityProfile } from "./systemicRiskGravityTypes.ts";
import { logGravityDev } from "./gravityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function buildRegionalGravityProfiles(input: {
  topology: OperationalUniverseTopology;
  equilibriumState: EnterpriseEquilibriumState;
  fragilityMap: OperationalFragilityMap;
  pressureState?: EnterprisePressureState;
  momentumState?: EnterpriseMomentumState;
  recoveryState?: OrganizationalRecoveryState;
  flowState?: OrganizationalFlowState;
  regionMetrics?: Readonly<Record<string, RegionGravityMetrics>>;
  stressFactor?: number;
}): RegionGravityProfile[] {
  const fragilityByRegion = new Map(
    input.fragilityMap.regionProfiles.map((p) => [p.regionId, p])
  );
  const equilibriumByRegion = new Map(
    input.equilibriumState.regionProfiles.map((p) => [p.regionId, p])
  );
  const recoveryByRegion = new Map(
    (input.recoveryState?.regionProfiles ?? []).map((p) => [p.regionId, p])
  );
  const pressureByRegion = new Map(
    (input.pressureState?.regionAccumulations ?? []).map((a) => [a.regionId, a])
  );
  const momentumByRegion = new Map(
    (input.momentumState?.regionProfiles ?? []).map((p) => [p.regionId, p])
  );

  const dependencyCount = new Map<string, number>();
  for (const rel of input.topology.crossDomainRelationships) {
    dependencyCount.set(rel.sourceRegionId, (dependencyCount.get(rel.sourceRegionId) ?? 0) + 1);
    dependencyCount.set(rel.targetRegionId, (dependencyCount.get(rel.targetRegionId) ?? 0) + 1);
  }
  const maxDeps = Math.max(1, ...[...dependencyCount.values()]);

  const profiles: RegionGravityProfile[] = [];

  for (const region of input.topology.operationalRegions) {
    const metrics = input.regionMetrics?.[region.regionId];
    const fragility = fragilityByRegion.get(region.regionId);
    const equilibrium = equilibriumByRegion.get(region.regionId);
    const recovery = recoveryByRegion.get(region.regionId);
    const pressure = pressureByRegion.get(region.regionId);
    const momentum = momentumByRegion.get(region.regionId);

    const fragilityScore = clamp01(fragility?.fragilityScore ?? metrics?.fragility ?? 0.3);
    const pressureLoad = clamp01(pressure?.accumulatedPressure ?? metrics?.operationalLoad ?? 0.35);
    const recoveryCapacity = clamp01(
      metrics?.recoveryCapacity ?? recovery?.recoveryCapacityScore ?? 0.5
    );
    const dependencyCentrality = clamp01((dependencyCount.get(region.regionId) ?? 0) / maxDeps);

    const instabilityAttraction = clamp01(
      fragilityScore * 0.35 +
        pressureLoad * 0.25 +
        dependencyCentrality * 0.2 +
        (1 - recoveryCapacity) * 0.2
    );
    const recoverySuppression = clamp01(
      (1 - recoveryCapacity) * 0.45 +
        (equilibrium?.driftVelocity ?? 0.3) * 0.3 +
        (momentum?.degradationRate ?? 0.25) * 0.25
    );
    const collapseConvergence = clamp01(
      instabilityAttraction * 0.4 +
        (input.fragilityMap.systemicExposureScore ?? 0.3) * 0.25 +
        (input.equilibriumState.instabilityDriftScore ?? 0.3) * 0.2 +
        (input.stressFactor ?? 0) * 0.15
    );
    const destabilizingInfluence = clamp01(
      instabilityAttraction * 0.35 +
        recoverySuppression * 0.35 +
        (momentum?.momentumVector != null && momentum.momentumVector < 0
          ? Math.abs(momentum.momentumVector) * 0.3
          : 0.1)
    );

    const gravityScore = clamp01(
      instabilityAttraction * 0.3 +
        collapseConvergence * 0.25 +
        destabilizingInfluence * 0.25 +
        recoverySuppression * 0.2
    );

    const drivers: string[] = [];
    if (fragilityScore > 0.55) drivers.push("high fragility concentration");
    if (dependencyCentrality > 0.6) drivers.push("dependency gravity centrality");
    if (recoverySuppression > 0.55) drivers.push("recovery suppression field");
    if (pressureLoad > 0.6) drivers.push("elevated dependency pressure");
    if (input.equilibriumState.imbalanceZones.includes(region.regionId)) {
      drivers.push("operational imbalance distortion");
    }
    if (drivers.length === 0 && gravityScore > 0.4) {
      drivers.push("moderate systemic risk gravity");
    }

    profiles.push(
      Object.freeze({
        regionId: region.regionId,
        gravityScore,
        instabilityAttraction,
        dependencyCentrality,
        recoverySuppression,
        collapseConvergence,
        destabilizingInfluence,
        drivers: Object.freeze([...new Set(drivers)].sort()),
      })
    );
  }

  logGravityDev("RiskGravity", {
    profileCount: profiles.length,
    topologyId: input.topology.topologyId,
  });

  return profiles.sort((a, b) => a.regionId.localeCompare(b.regionId));
}
