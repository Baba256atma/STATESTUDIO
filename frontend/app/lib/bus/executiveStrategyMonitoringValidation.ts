import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeIndex.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeIndex.ts";
import {
  EXECUTIVE_STRATEGY_PLATFORM_REGISTRY,
  EXECUTIVE_STRATEGY_PUBLIC_APIS,
} from "./executiveStrategyIndex.ts";
import {
  EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
  listExecutiveStrategyDefinitions,
} from "./executiveStrategyDefinitionIndex.ts";
import {
  EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_THEME_REGISTRY,
  listExecutiveStrategicThemes,
} from "./executiveStrategicThemeIndex.ts";
import {
  EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY,
  listExecutiveStrategicObjectives,
} from "./executiveStrategicObjectiveIndex.ts";
import {
  EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY,
  listExecutiveStrategicInitiatives,
} from "./executiveStrategicInitiativeIndex.ts";
import {
  EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
  listExecutiveStrategicRoadmaps,
} from "./executiveStrategicRoadmapIndex.ts";
import {
  EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY,
  listExecutiveStrategyAlignments,
} from "./executiveStrategyAlignmentIndex.ts";
import { EXECUTIVE_STRATEGY_MONITORING_REGISTRY } from "./executiveStrategyMonitoringRegistry.ts";
import type {
  ExecutiveStrategyMonitoring,
  ExecutiveStrategyMonitoringManifest,
  ExecutiveStrategyMonitoringRegistry,
  ExecutiveStrategyMonitoringValidation,
} from "./executiveStrategyMonitoringTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(
  errors: readonly string[],
  warnings: readonly string[] = Object.freeze([])
): ExecutiveStrategyMonitoringValidation {
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([...warnings]),
  });
}

function validateMonitoring(
  monitoring: ExecutiveStrategyMonitoring,
  strategyIds: ReadonlySet<string>,
  themeIds: ReadonlySet<string>,
  objectiveIds: ReadonlySet<string>,
  initiativeIds: ReadonlySet<string>,
  roadmapIds: ReadonlySet<string>,
  evidenceIds: ReadonlySet<string>,
  dependencyIds: ReadonlySet<string>,
  cadenceIds: ReadonlySet<string>,
  eventIds: ReadonlySet<string>,
  thresholdIds: ReadonlySet<string>
): readonly string[] {
  const errors: string[] = [];

  if (!monitoring.identity.monitoringId) errors.push("missing-monitoring-id");
  if (!monitoring.identity.monitoringKey) errors.push(`missing-monitoring-key:${monitoring.identity.monitoringId}`);
  if (!monitoring.name.displayName) errors.push(`missing-monitoring-name:${monitoring.identity.monitoringId}`);
  if (!monitoring.description) errors.push(`missing-monitoring-description:${monitoring.identity.monitoringId}`);
  if (!monitoring.scope.scopeStatement) errors.push(`missing-monitoring-scope:${monitoring.identity.monitoringId}`);
  if (!monitoring.purpose.purposeStatement) errors.push(`missing-monitoring-purpose:${monitoring.identity.monitoringId}`);
  if (monitoring.stakeholders.length === 0) errors.push(`missing-monitoring-stakeholders:${monitoring.identity.monitoringId}`);
  if (monitoring.eventTypes.length === 0) errors.push(`missing-monitoring-events:${monitoring.identity.monitoringId}`);
  if (monitoring.thresholdDefinitions.length === 0) errors.push(`missing-monitoring-thresholds:${monitoring.identity.monitoringId}`);
  if (monitoring.evidence.length === 0) errors.push(`missing-monitoring-evidence:${monitoring.identity.monitoringId}`);
  if (monitoring.dependencies.length === 0) errors.push(`missing-monitoring-dependencies:${monitoring.identity.monitoringId}`);
  if (monitoring.kpiReferences.length === 0) errors.push(`missing-kpi-references:${monitoring.identity.monitoringId}`);
  if (monitoring.okrReferences.length === 0) errors.push(`missing-okr-references:${monitoring.identity.monitoringId}`);
  if (!strategyIds.size || !monitoring.strategyReferenceIds.every((id) => strategyIds.has(id))) {
    errors.push(`invalid-strategy-reference:${monitoring.identity.monitoringId}`);
  }
  if (!monitoring.themeReferenceIds.every((id) => themeIds.has(id))) {
    errors.push(`invalid-theme-reference:${monitoring.identity.monitoringId}`);
  }
  if (!monitoring.objectiveReferenceIds.every((id) => objectiveIds.has(id))) {
    errors.push(`invalid-objective-reference:${monitoring.identity.monitoringId}`);
  }
  if (!monitoring.initiativeReferenceIds.every((id) => initiativeIds.has(id))) {
    errors.push(`invalid-initiative-reference:${monitoring.identity.monitoringId}`);
  }
  if (!monitoring.roadmapReferenceIds.every((id) => roadmapIds.has(id))) {
    errors.push(`invalid-roadmap-reference:${monitoring.identity.monitoringId}`);
  }
  if (!evidenceIds.has(monitoring.evidence[0]?.evidenceId ?? "")) {
    errors.push(`invalid-evidence-reference:${monitoring.identity.monitoringId}`);
  }
  if (!monitoring.evidence.every((item) => evidenceIds.has(item.evidenceId))) {
    errors.push(`invalid-evidence-reference:${monitoring.identity.monitoringId}`);
  }
  if (!monitoring.dependencies.every((item) => dependencyIds.has(item.dependencyId))) {
    errors.push(`invalid-dependency-reference:${monitoring.identity.monitoringId}`);
  }
  if (!cadenceIds.has(monitoring.cadence.cadenceId)) {
    errors.push(`invalid-cadence-reference:${monitoring.identity.monitoringId}`);
  }
  if (!monitoring.eventTypes.every((item) => eventIds.has(item.eventTypeId))) {
    errors.push(`invalid-event-reference:${monitoring.identity.monitoringId}`);
  }
  if (!monitoring.thresholdDefinitions.every((item) => thresholdIds.has(item.thresholdId))) {
    errors.push(`invalid-threshold-reference:${monitoring.identity.monitoringId}`);
  }
  if (!monitoring.metadata.metadataOnly || !monitoring.metadata.immutable) {
    errors.push(`invalid-monitoring-metadata:${monitoring.identity.monitoringId}`);
  }
  if (!monitoring.version.versionLabel) errors.push(`missing-monitoring-version:${monitoring.identity.monitoringId}`);
  if (!monitoring.metadataOnly || !monitoring.immutable) {
    errors.push(`invalid-monitoring-entry-metadata:${monitoring.identity.monitoringId}`);
  }

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveStrategyMonitoringRegistry): readonly string[] {
  const errors: string[] = [];
  const strategyIds = new Set(listExecutiveStrategyDefinitions().map((definition) => definition.identity.strategyId));
  const themeIds = new Set(listExecutiveStrategicThemes().map((theme) => theme.identity.themeId));
  const objectiveIds = new Set(listExecutiveStrategicObjectives().map((objective) => objective.identity.objectiveId));
  const initiativeIds = new Set(listExecutiveStrategicInitiatives().map((initiative) => initiative.identity.initiativeId));
  const roadmapIds = new Set(listExecutiveStrategicRoadmaps().map((roadmap) => roadmap.identity.roadmapId));
  const evidenceIds = new Set(registry.evidence.map((item) => item.evidenceId));
  const dependencyIds = new Set(registry.dependencies.map((item) => item.dependencyId));
  const cadenceIds = new Set(registry.cadences.map((item) => item.cadenceId));
  const eventIds = new Set(registry.events.map((item) => item.eventTypeId));
  const thresholdIds = new Set(registry.thresholds.map((item) => item.thresholdId));

  if (registry.platformId !== "BUS-24") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive Strategy Monitoring Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-17") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-18") errors.push("invalid-definition-platform");
  if (registry.themePlatformId !== "BUS-19") errors.push("invalid-theme-platform");
  if (registry.objectivePlatformId !== "BUS-20") errors.push("invalid-objective-platform");
  if (registry.initiativePlatformId !== "BUS-21") errors.push("invalid-initiative-platform");
  if (registry.roadmapPlatformId !== "BUS-22") errors.push("invalid-roadmap-platform");
  if (registry.alignmentPlatformId !== "BUS-23") errors.push("invalid-alignment-platform");
  if (registry.kpiFreezeDependency !== "BUS-12") errors.push("invalid-kpi-freeze-dependency");
  if (registry.okrFreezeDependency !== "BUS-16") errors.push("invalid-okr-freeze-dependency");
  if (registry.monitorings.length === 0) errors.push("missing-monitorings");
  if (registry.profiles.length === 0) errors.push("missing-profiles");
  if (registry.dimensions.length === 0) errors.push("missing-dimensions");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.statuses.length === 0) errors.push("missing-statuses");
  if (registry.priorities.length === 0) errors.push("missing-priorities");
  if (registry.lifecycles.length === 0) errors.push("missing-lifecycles");
  if (registry.cadences.length === 0) errors.push("missing-cadences");
  if (registry.events.length === 0) errors.push("missing-events");
  if (registry.thresholds.length === 0) errors.push("missing-thresholds");
  if (registry.evidence.length === 0) errors.push("missing-evidence");
  if (registry.dependencies.length === 0) errors.push("missing-dependencies");
  if (registry.owners.length === 0) errors.push("missing-owners");
  if (registry.versions.length === 0) errors.push("missing-versions");
  if (registry.relationships.length === 0) errors.push("missing-relationships");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (
    registry.extensionPolicy.monitoringMutationAllowed ||
    registry.extensionPolicy.runtimeExecutionAllowed ||
    registry.extensionPolicy.eventProcessingAllowed ||
    registry.extensionPolicy.thresholdEvaluationAllowed ||
    registry.extensionPolicy.simulationAllowed ||
    registry.extensionPolicy.businessLogicAllowed
  ) {
    errors.push("invalid-extension-policy");
  }
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.monitorings.map((item) => item.identity.monitoringId)).map((id) => `duplicate-monitoring-id:${id}`));
  errors.push(...duplicateValues(registry.relationships.map((item) => item.relationshipId)).map((id) => `duplicate-relationship-id:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));
  errors.push(...duplicateValues(registry.versions.map((item) => item.versionId)).map((id) => `duplicate-version-id:${id}`));
  errors.push(...duplicateValues(registry.cadences.map((item) => item.cadenceId)).map((id) => `duplicate-cadence-id:${id}`));
  errors.push(...duplicateValues(registry.events.map((item) => item.eventTypeId)).map((id) => `duplicate-event-id:${id}`));
  errors.push(...duplicateValues(registry.thresholds.map((item) => item.thresholdId)).map((id) => `duplicate-threshold-id:${id}`));

  for (const monitoring of registry.monitorings) {
    errors.push(...validateMonitoring(monitoring, strategyIds, themeIds, objectiveIds, initiativeIds, roadmapIds, evidenceIds, dependencyIds, cadenceIds, eventIds, thresholdIds));
  }
  for (const relationship of registry.relationships) {
    if (!relationship.relationshipId) errors.push("missing-relationship-id");
    if (!relationship.sourceId) errors.push(`missing-relationship-source:${relationship.relationshipId}`);
    if (!relationship.targetId) errors.push(`missing-relationship-target:${relationship.relationshipId}`);
    if (!relationship.metadataOnly || !relationship.immutable) {
      errors.push(`invalid-relationship-metadata:${relationship.relationshipId}`);
    }
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveStrategyMonitoringManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-24") errors.push("invalid-manifest-platform-id");
  if (manifest.foundationPlatformId !== "BUS-17") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-18") errors.push("invalid-manifest-definition");
  if (manifest.themePlatformId !== "BUS-19") errors.push("invalid-manifest-theme-platform");
  if (manifest.objectivePlatformId !== "BUS-20") errors.push("invalid-manifest-objective-platform");
  if (manifest.initiativePlatformId !== "BUS-21") errors.push("invalid-manifest-initiative-platform");
  if (manifest.roadmapPlatformId !== "BUS-22") errors.push("invalid-manifest-roadmap-platform");
  if (manifest.alignmentPlatformId !== "BUS-23") errors.push("invalid-manifest-alignment-platform");
  if (!manifest.strategyFoundationAvailable) errors.push("strategy-foundation-unavailable");
  if (!manifest.strategyDefinitionsAvailable) errors.push("strategy-definitions-unavailable");
  if (!manifest.strategicThemesAvailable) errors.push("strategic-themes-unavailable");
  if (!manifest.strategicObjectivesAvailable) errors.push("strategic-objectives-unavailable");
  if (!manifest.strategicInitiativesAvailable) errors.push("strategic-initiatives-unavailable");
  if (!manifest.strategicRoadmapsAvailable) errors.push("strategic-roadmaps-unavailable");
  if (!manifest.strategyAlignmentAvailable) errors.push("strategy-alignment-unavailable");
  if (!manifest.kpiFreezeAvailable) errors.push("kpi-freeze-unavailable");
  if (!manifest.okrFreezeAvailable) errors.push("okr-freeze-unavailable");
  if (manifest.monitoringCount === 0) errors.push("missing-manifest-monitorings");
  if (manifest.relationshipCount === 0) errors.push("missing-manifest-relationships");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.versionCount === 0) errors.push("missing-manifest-versions");
  if (manifest.certificationStatus !== "Strategy Monitoring Platform Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveStrategyMonitoring(
  registry: ExecutiveStrategyMonitoringRegistry = EXECUTIVE_STRATEGY_MONITORING_REGISTRY,
  manifest?: ExecutiveStrategyMonitoringManifest
): ExecutiveStrategyMonitoringValidation {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
  const strategicObjectives = listExecutiveStrategicObjectives();
  const strategicInitiatives = listExecutiveStrategicInitiatives();
  const strategicRoadmaps = listExecutiveStrategicRoadmaps();
  const strategyAlignments = listExecutiveStrategyAlignments();
  const errors = Object.freeze([
    ...(
      EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.identity.platformId === "BUS-17" &&
      EXECUTIVE_STRATEGY_PUBLIC_APIS.length > 0
        ? []
        : ["strategy-foundation-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.platformId === "BUS-18" &&
      strategyDefinitions.length > 0 &&
      EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS.length > 0
        ? []
        : ["strategy-definition-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGIC_THEME_REGISTRY.platformId === "BUS-19" &&
      strategicThemes.length > 0 &&
      EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS.length > 0
        ? []
        : ["strategic-theme-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.platformId === "BUS-20" &&
      strategicObjectives.length > 0 &&
      EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS.length > 0
        ? []
        : ["strategic-objective-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.platformId === "BUS-21" &&
      strategicInitiatives.length > 0 &&
      EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS.length > 0
        ? []
        : ["strategic-initiative-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.platformId === "BUS-22" &&
      strategicRoadmaps.length > 0 &&
      EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS.length > 0
        ? []
        : ["strategic-roadmap-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.platformId === "BUS-23" &&
      strategyAlignments.length > 0 &&
      EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS.length > 0
        ? []
        : ["strategy-alignment-validation-failed"]
    ),
    ...(kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["kpi-platform-freeze-validation-failed"]),
    ...(okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["okr-platform-freeze-validation-failed"]),
    ...validateRegistry(registry),
    ...(manifest ? validateManifest(manifest) : []),
  ]);
  return result(errors);
}
