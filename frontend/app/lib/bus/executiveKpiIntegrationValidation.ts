import { getExecutiveKpiBusinessImpactPlatform } from "./executiveKpiBusinessImpactPlatform.ts";
import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { EXECUTIVE_KPI_COMPATIBILITY_MATRIX } from "./executiveKpiIntegrationCompatibility.ts";
import { getExecutiveKpiIntegrationManifest } from "./executiveKpiIntegrationManifest.ts";
import { EXECUTIVE_KPI_INTEGRATION_REGISTRY } from "./executiveKpiIntegrationRegistry.ts";
import type {
  ExecutiveKpiIntegrationManifest,
  ExecutiveKpiIntegrationRegistry,
  ExecutiveKpiIntegrationValidation,
} from "./executiveKpiIntegrationTypes.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiReportingPlatform } from "./executiveKpiReportingPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiStrategicAlignmentPlatform } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveKpiIntegrationValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateRegistry(registry: ExecutiveKpiIntegrationRegistry): readonly string[] {
  const errors: string[] = [];
  const phaseIds = new Set(registry.integratedPhaseIds);
  const categories = new Set(registry.categories);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (registry.platformId !== "BUS-11") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive KPI Integration Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.integratedPhaseIds.length !== 10) errors.push("invalid-integrated-phase-count");
  if (registry.phases.length !== registry.integratedPhaseIds.length) errors.push("phase-registry-incomplete");
  if (registry.dependencies.length !== registry.integratedPhaseIds.length) errors.push("dependency-map-incomplete");
  if (registry.consumers.length === 0) errors.push("consumer-registry-incomplete");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.lifecycleStates.length === 0) errors.push("missing-lifecycle-states");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.phases.map((phase) => phase.integrationId)).map((id) => `duplicate-integration-id:${id}`));
  errors.push(...duplicateValues(registry.integratedPhaseIds).map((id) => `duplicate-phase-id:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const phase of registry.phases) {
    if (!phaseIds.has(phase.phaseId)) errors.push(`unknown-phase:${phase.phaseId}`);
    for (const dependencyId of phase.phaseDependencyIds) {
      if (!phaseIds.has(dependencyId)) errors.push(`unknown-phase-dependency:${phase.phaseId}:${dependencyId}`);
    }
    if (phase.providedPublicApis.length === 0) errors.push(`missing-provided-public-apis:${phase.phaseId}`);
    if (!categories.has(phase.integrationCategory)) errors.push(`invalid-category:${phase.phaseId}`);
    if (!lifecycleStates.has(phase.lifecycleState)) errors.push(`invalid-lifecycle:${phase.phaseId}`);
    if (!phase.metadata.metadataOnly || !phase.metadata.immutable) errors.push(`invalid-phase-metadata:${phase.phaseId}`);
    if (!phase.metadataOnly || !phase.immutable) errors.push(`invalid-phase-entry-metadata:${phase.phaseId}`);
  }

  for (const dependency of registry.dependencies) {
    if (!phaseIds.has(dependency.phaseId)) errors.push(`unknown-dependency-phase:${dependency.phaseId}`);
    for (const dependencyId of dependency.dependsOnPhaseIds) {
      if (!phaseIds.has(dependencyId)) errors.push(`unknown-dependency-reference:${dependency.phaseId}:${dependencyId}`);
    }
    if (!dependency.metadataOnly) errors.push(`invalid-dependency-metadata:${dependency.dependencyId}`);
  }

  for (const consumer of registry.consumers) {
    if (!consumer.consumerId) errors.push("missing-consumer-id");
    if (consumer.consumptionBoundary !== "Public API Only") errors.push(`invalid-consumer-boundary:${consumer.consumerId}`);
    if (!consumer.metadataOnly || !consumer.immutable) errors.push(`invalid-consumer-metadata:${consumer.consumerId}`);
  }

  return Object.freeze(errors);
}

function validateCompatibilityMatrix(): readonly string[] {
  const errors: string[] = [];
  const requiredTargets = new Set(["BUS-1", "BUS-2", "BUS-3", "BUS-4", "BUS-5", "BUS-6", "BUS-7", "BUS-8", "BUS-9", "BUS-10", "CORE", "DS", "INT", "KNL", "APP", "LAY", "OPS", "EVE", "Future BUS phases"]);
  const matrixTargets = new Set(EXECUTIVE_KPI_COMPATIBILITY_MATRIX.map((entry) => entry.targetLayer));

  for (const target of requiredTargets) {
    if (!matrixTargets.has(target)) errors.push(`missing-compatibility:${target}`);
  }
  errors.push(...duplicateValues(EXECUTIVE_KPI_COMPATIBILITY_MATRIX.map((entry) => entry.compatibilityId)).map((id) => `duplicate-compatibility-id:${id}`));
  for (const entry of EXECUTIVE_KPI_COMPATIBILITY_MATRIX) {
    if (!entry.metadataOnly || !entry.immutable) errors.push(`invalid-compatibility-metadata:${entry.compatibilityId}`);
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveKpiIntegrationManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-11") errors.push("invalid-manifest-platform");
  if (!manifest.bus1Available) errors.push("bus-1-unavailable");
  if (!manifest.bus2Available) errors.push("bus-2-unavailable");
  if (!manifest.bus3Available) errors.push("bus-3-unavailable");
  if (!manifest.bus4Available) errors.push("bus-4-unavailable");
  if (!manifest.bus5Available) errors.push("bus-5-unavailable");
  if (!manifest.bus6Available) errors.push("bus-6-unavailable");
  if (!manifest.bus7Available) errors.push("bus-7-unavailable");
  if (!manifest.bus8Available) errors.push("bus-8-unavailable");
  if (!manifest.bus9Available) errors.push("bus-9-unavailable");
  if (!manifest.bus10Available) errors.push("bus-10-unavailable");
  if (manifest.phaseCount !== 10) errors.push("invalid-manifest-phase-count");
  if (manifest.dependencyCount !== 10) errors.push("invalid-manifest-dependency-count");
  if (manifest.compatibilityCount === 0) errors.push("missing-manifest-compatibility");
  if (manifest.consumerCount === 0) errors.push("missing-manifest-consumers");
  if (manifest.categoryCount === 0) errors.push("missing-manifest-categories");
  if (manifest.lifecycleStateCount === 0) errors.push("missing-manifest-lifecycle-states");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Integration Platform Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveKpiIntegration(
  registry: ExecutiveKpiIntegrationRegistry = EXECUTIVE_KPI_INTEGRATION_REGISTRY,
  manifest: ExecutiveKpiIntegrationManifest = getExecutiveKpiIntegrationManifest()
): ExecutiveKpiIntegrationValidation {
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
  const errors = Object.freeze([
    ...(bus1.validation.valid ? [] : ["bus-1-validation-failed"]),
    ...(bus2.validation.valid ? [] : ["bus-2-validation-failed"]),
    ...(bus3.validation.valid ? [] : ["bus-3-validation-failed"]),
    ...(bus4.validation.valid ? [] : ["bus-4-validation-failed"]),
    ...(bus5.validation.valid ? [] : ["bus-5-validation-failed"]),
    ...(bus6.validation.valid ? [] : ["bus-6-validation-failed"]),
    ...(bus7.validation.valid ? [] : ["bus-7-validation-failed"]),
    ...(bus8.validation.valid ? [] : ["bus-8-validation-failed"]),
    ...(bus9.validation.valid ? [] : ["bus-9-validation-failed"]),
    ...(bus10.validation.valid ? [] : ["bus-10-validation-failed"]),
    ...validateRegistry(registry),
    ...validateCompatibilityMatrix(),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}
