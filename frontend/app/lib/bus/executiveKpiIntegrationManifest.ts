import { getExecutiveKpiBusinessImpactPlatform } from "./executiveKpiBusinessImpactPlatform.ts";
import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { EXECUTIVE_KPI_COMPATIBILITY_MATRIX } from "./executiveKpiIntegrationCompatibility.ts";
import { EXECUTIVE_KPI_INTEGRATION_REGISTRY } from "./executiveKpiIntegrationRegistry.ts";
import type { ExecutiveKpiIntegrationManifest } from "./executiveKpiIntegrationTypes.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiReportingPlatform } from "./executiveKpiReportingPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiStrategicAlignmentPlatform } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-11-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveKpiIntegrationManifest(): ExecutiveKpiIntegrationManifest {
  const bus1 = getExecutiveKpiPlatform();
  const bus2 = getExecutiveKpiDefinitionPlatform();
  const bus3 = getExecutiveKpiSourceMappingPlatform();
  const bus4 = getExecutiveKpiTargetPlatform();
  const bus5 = getExecutiveKpiGovernancePlatform();
  const bus6 = getExecutiveKpiScorecardPlatform();
  const bus7 = getExecutiveKpiInsightPlatform();
  const bus8 = getExecutiveKpiStrategicAlignmentPlatform();
  const bus9 = getExecutiveKpiBusinessImpactPlatform();
  const bus10 = getExecutiveKpiReportingPlatform();
  const registry = EXECUTIVE_KPI_INTEGRATION_REGISTRY;
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    ...registry.phases.map((phase) => `${phase.integrationId}:${phase.phaseId}:${phase.integrationCategory}:${phase.lifecycleState}`).sort(),
    ...registry.dependencies.map((dependency) => `${dependency.dependencyId}:${dependency.phaseId}:${dependency.dependsOnPhaseIds.join(",")}`).sort(),
    ...EXECUTIVE_KPI_COMPATIBILITY_MATRIX.map((entry) => `${entry.compatibilityId}:${entry.targetLayer}:${entry.compatibilityStatus}`).sort(),
    ...registry.consumers.map((consumer) => `${consumer.consumerId}:${consumer.consumerLayer}`).sort(),
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: registry.platformId,
    platformName: registry.platformName,
    version: registry.version,
    bus1Available: bus1.validation.valid,
    bus2Available: bus2.validation.valid,
    bus3Available: bus3.validation.valid,
    bus4Available: bus4.validation.valid,
    bus5Available: bus5.validation.valid,
    bus6Available: bus6.validation.valid,
    bus7Available: bus7.validation.valid,
    bus8Available: bus8.validation.valid,
    bus9Available: bus9.validation.valid,
    bus10Available: bus10.validation.valid,
    phaseCount: registry.phases.length,
    dependencyCount: registry.dependencies.length,
    compatibilityCount: EXECUTIVE_KPI_COMPATIBILITY_MATRIX.length,
    consumerCount: registry.consumers.length,
    categoryCount: registry.categories.length,
    lifecycleStateCount: registry.lifecycleStates.length,
    publicApis: registry.publicApis,
    certificationStatus: "Integration Platform Certified",
    deterministicFingerprint,
  });
}
