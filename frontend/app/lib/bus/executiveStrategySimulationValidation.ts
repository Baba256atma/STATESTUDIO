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
import {
  EXECUTIVE_STRATEGY_MONITORING_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_MONITORING_REGISTRY,
} from "./executiveStrategyMonitoringIndex.ts";
import { EXECUTIVE_STRATEGY_SIMULATION_REGISTRY } from "./executiveStrategySimulationRegistry.ts";
import type {
  ExecutiveStrategySimulation,
  ExecutiveStrategySimulationManifest,
  ExecutiveStrategySimulationRegistry,
  ExecutiveStrategySimulationValidation,
} from "./executiveStrategySimulationTypes.ts";

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
): ExecutiveStrategySimulationValidation {
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([...warnings]),
  });
}

function validateSimulation(
  simulation: ExecutiveStrategySimulation,
  strategyIds: ReadonlySet<string>,
  themeIds: ReadonlySet<string>,
  objectiveIds: ReadonlySet<string>,
  initiativeIds: ReadonlySet<string>,
  roadmapIds: ReadonlySet<string>,
  monitoringIds: ReadonlySet<string>,
  scenarioIds: ReadonlySet<string>,
  outcomeIds: ReadonlySet<string>,
  assumptionIds: ReadonlySet<string>,
  constraintIds: ReadonlySet<string>,
  evidenceIds: ReadonlySet<string>,
  dependencyIds: ReadonlySet<string>
): readonly string[] {
  const errors: string[] = [];
  if (!simulation.identity.simulationId) errors.push("missing-simulation-id");
  if (!simulation.identity.simulationKey) errors.push(`missing-simulation-key:${simulation.identity.simulationId}`);
  if (!simulation.name.displayName) errors.push(`missing-simulation-name:${simulation.identity.simulationId}`);
  if (!simulation.description) errors.push(`missing-simulation-description:${simulation.identity.simulationId}`);
  if (!simulation.purpose.purposeStatement) errors.push(`missing-simulation-purpose:${simulation.identity.simulationId}`);
  if (!simulation.scope.scopeStatement) errors.push(`missing-simulation-scope:${simulation.identity.simulationId}`);
  if (simulation.stakeholders.length === 0) errors.push(`missing-simulation-stakeholders:${simulation.identity.simulationId}`);
  if (simulation.assumptions.length === 0) errors.push(`missing-simulation-assumptions:${simulation.identity.simulationId}`);
  if (simulation.constraints.length === 0) errors.push(`missing-simulation-constraints:${simulation.identity.simulationId}`);
  if (simulation.outcomes.length === 0) errors.push(`missing-simulation-outcomes:${simulation.identity.simulationId}`);
  if (simulation.evidence.length === 0) errors.push(`missing-simulation-evidence:${simulation.identity.simulationId}`);
  if (simulation.dependencies.length === 0) errors.push(`missing-simulation-dependencies:${simulation.identity.simulationId}`);
  if (simulation.kpiReferences.length === 0) errors.push(`missing-kpi-references:${simulation.identity.simulationId}`);
  if (simulation.okrReferences.length === 0) errors.push(`missing-okr-references:${simulation.identity.simulationId}`);
  if (!scenarioIds.has(simulation.scenario.scenarioId)) errors.push(`invalid-scenario-reference:${simulation.identity.simulationId}`);
  if (!simulation.strategyReferenceIds.every((id) => strategyIds.has(id))) errors.push(`invalid-strategy-reference:${simulation.identity.simulationId}`);
  if (!simulation.themeReferenceIds.every((id) => themeIds.has(id))) errors.push(`invalid-theme-reference:${simulation.identity.simulationId}`);
  if (!simulation.objectiveReferenceIds.every((id) => objectiveIds.has(id))) errors.push(`invalid-objective-reference:${simulation.identity.simulationId}`);
  if (!simulation.initiativeReferenceIds.every((id) => initiativeIds.has(id))) errors.push(`invalid-initiative-reference:${simulation.identity.simulationId}`);
  if (!simulation.roadmapReferenceIds.every((id) => roadmapIds.has(id))) errors.push(`invalid-roadmap-reference:${simulation.identity.simulationId}`);
  if (!simulation.monitoringReferenceIds.every((id) => monitoringIds.has(id))) errors.push(`invalid-monitoring-reference:${simulation.identity.simulationId}`);
  if (!simulation.assumptions.every((item) => assumptionIds.has(item.assumptionId))) errors.push(`invalid-assumption-reference:${simulation.identity.simulationId}`);
  if (!simulation.constraints.every((item) => constraintIds.has(item.constraintId))) errors.push(`invalid-constraint-reference:${simulation.identity.simulationId}`);
  if (!simulation.outcomes.every((item) => outcomeIds.has(item.outcomeId))) errors.push(`invalid-outcome-reference:${simulation.identity.simulationId}`);
  if (!simulation.evidence.every((item) => evidenceIds.has(item.evidenceId))) errors.push(`invalid-evidence-reference:${simulation.identity.simulationId}`);
  if (!simulation.dependencies.every((item) => dependencyIds.has(item.dependencyId))) errors.push(`invalid-dependency-reference:${simulation.identity.simulationId}`);
  if (!simulation.metadata.metadataOnly || !simulation.metadata.immutable) errors.push(`invalid-simulation-metadata:${simulation.identity.simulationId}`);
  if (!simulation.version.versionLabel) errors.push(`missing-simulation-version:${simulation.identity.simulationId}`);
  if (!simulation.metadataOnly || !simulation.immutable) errors.push(`invalid-simulation-entry-metadata:${simulation.identity.simulationId}`);
  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveStrategySimulationRegistry): readonly string[] {
  const errors: string[] = [];
  const strategyIds = new Set(listExecutiveStrategyDefinitions().map((definition) => definition.identity.strategyId));
  const themeIds = new Set(listExecutiveStrategicThemes().map((theme) => theme.identity.themeId));
  const objectiveIds = new Set(listExecutiveStrategicObjectives().map((objective) => objective.identity.objectiveId));
  const initiativeIds = new Set(listExecutiveStrategicInitiatives().map((initiative) => initiative.identity.initiativeId));
  const roadmapIds = new Set(listExecutiveStrategicRoadmaps().map((roadmap) => roadmap.identity.roadmapId));
  const monitoringIds = new Set(["monitoring-profitable-growth-health", "monitoring-operational-resilience-health", "monitoring-innovation-integration-health"]);
  const scenarioIds = new Set(registry.scenarios.map((item) => item.scenarioId));
  const outcomeIds = new Set(registry.outcomes.map((item) => item.outcomeId));
  const assumptionIds = new Set(registry.assumptions.map((item) => item.assumptionId));
  const constraintIds = new Set(registry.constraints.map((item) => item.constraintId));
  const evidenceIds = new Set(registry.evidence.map((item) => item.evidenceId));
  const dependencyIds = new Set(registry.dependencies.map((item) => item.dependencyId));

  if (registry.platformId !== "BUS-25") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive Strategy Simulation Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-17") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-18") errors.push("invalid-definition-platform");
  if (registry.themePlatformId !== "BUS-19") errors.push("invalid-theme-platform");
  if (registry.objectivePlatformId !== "BUS-20") errors.push("invalid-objective-platform");
  if (registry.initiativePlatformId !== "BUS-21") errors.push("invalid-initiative-platform");
  if (registry.roadmapPlatformId !== "BUS-22") errors.push("invalid-roadmap-platform");
  if (registry.alignmentPlatformId !== "BUS-23") errors.push("invalid-alignment-platform");
  if (registry.monitoringPlatformId !== "BUS-24") errors.push("invalid-monitoring-platform");
  if (registry.kpiFreezeDependency !== "BUS-12") errors.push("invalid-kpi-freeze-dependency");
  if (registry.okrFreezeDependency !== "BUS-16") errors.push("invalid-okr-freeze-dependency");
  if (registry.simulations.length === 0) errors.push("missing-simulations");
  if (registry.profiles.length === 0) errors.push("missing-profiles");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.statuses.length === 0) errors.push("missing-statuses");
  if (registry.priorities.length === 0) errors.push("missing-priorities");
  if (registry.lifecycles.length === 0) errors.push("missing-lifecycles");
  if (registry.scenarios.length === 0) errors.push("missing-scenarios");
  if (registry.outcomes.length === 0) errors.push("missing-outcomes");
  if (registry.assumptions.length === 0) errors.push("missing-assumptions");
  if (registry.constraints.length === 0) errors.push("missing-constraints");
  if (registry.evidence.length === 0) errors.push("missing-evidence");
  if (registry.dependencies.length === 0) errors.push("missing-dependencies");
  if (registry.owners.length === 0) errors.push("missing-owners");
  if (registry.versions.length === 0) errors.push("missing-versions");
  if (registry.relationships.length === 0) errors.push("missing-relationships");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (
    registry.extensionPolicy.simulationMutationAllowed ||
    registry.extensionPolicy.runtimeExecutionAllowed ||
    registry.extensionPolicy.predictionAllowed ||
    registry.extensionPolicy.optimizationAllowed ||
    registry.extensionPolicy.orchestrationAllowed ||
    registry.extensionPolicy.businessLogicAllowed
  ) errors.push("invalid-extension-policy");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.simulations.map((item) => item.identity.simulationId)).map((id) => `duplicate-simulation-id:${id}`));
  errors.push(...duplicateValues(registry.relationships.map((item) => item.relationshipId)).map((id) => `duplicate-relationship-id:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));
  errors.push(...duplicateValues(registry.versions.map((item) => item.versionId)).map((id) => `duplicate-version-id:${id}`));
  errors.push(...duplicateValues(registry.scenarios.map((item) => item.scenarioId)).map((id) => `duplicate-scenario-id:${id}`));
  errors.push(...duplicateValues(registry.outcomes.map((item) => item.outcomeId)).map((id) => `duplicate-outcome-id:${id}`));
  errors.push(...duplicateValues(registry.assumptions.map((item) => item.assumptionId)).map((id) => `duplicate-assumption-id:${id}`));
  errors.push(...duplicateValues(registry.constraints.map((item) => item.constraintId)).map((id) => `duplicate-constraint-id:${id}`));

  for (const simulation of registry.simulations) {
    errors.push(...validateSimulation(simulation, strategyIds, themeIds, objectiveIds, initiativeIds, roadmapIds, monitoringIds, scenarioIds, outcomeIds, assumptionIds, constraintIds, evidenceIds, dependencyIds));
  }
  for (const relationship of registry.relationships) {
    if (!relationship.relationshipId) errors.push("missing-relationship-id");
    if (!relationship.sourceId) errors.push(`missing-relationship-source:${relationship.relationshipId}`);
    if (!relationship.targetId) errors.push(`missing-relationship-target:${relationship.relationshipId}`);
    if (!relationship.metadataOnly || !relationship.immutable) errors.push(`invalid-relationship-metadata:${relationship.relationshipId}`);
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveStrategySimulationManifest): readonly string[] {
  const errors: string[] = [];
  if (manifest.platformId !== "BUS-25") errors.push("invalid-manifest-platform-id");
  if (manifest.foundationPlatformId !== "BUS-17") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-18") errors.push("invalid-manifest-definition");
  if (manifest.themePlatformId !== "BUS-19") errors.push("invalid-manifest-theme-platform");
  if (manifest.objectivePlatformId !== "BUS-20") errors.push("invalid-manifest-objective-platform");
  if (manifest.initiativePlatformId !== "BUS-21") errors.push("invalid-manifest-initiative-platform");
  if (manifest.roadmapPlatformId !== "BUS-22") errors.push("invalid-manifest-roadmap-platform");
  if (manifest.alignmentPlatformId !== "BUS-23") errors.push("invalid-manifest-alignment-platform");
  if (manifest.monitoringPlatformId !== "BUS-24") errors.push("invalid-manifest-monitoring-platform");
  if (!manifest.strategyFoundationAvailable) errors.push("strategy-foundation-unavailable");
  if (!manifest.strategyDefinitionsAvailable) errors.push("strategy-definitions-unavailable");
  if (!manifest.strategicThemesAvailable) errors.push("strategic-themes-unavailable");
  if (!manifest.strategicObjectivesAvailable) errors.push("strategic-objectives-unavailable");
  if (!manifest.strategicInitiativesAvailable) errors.push("strategic-initiatives-unavailable");
  if (!manifest.strategicRoadmapsAvailable) errors.push("strategic-roadmaps-unavailable");
  if (!manifest.strategyAlignmentAvailable) errors.push("strategy-alignment-unavailable");
  if (!manifest.strategyMonitoringAvailable) errors.push("strategy-monitoring-unavailable");
  if (!manifest.kpiFreezeAvailable) errors.push("kpi-freeze-unavailable");
  if (!manifest.okrFreezeAvailable) errors.push("okr-freeze-unavailable");
  if (manifest.simulationCount === 0) errors.push("missing-manifest-simulations");
  if (manifest.relationshipCount === 0) errors.push("missing-manifest-relationships");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.versionCount === 0) errors.push("missing-manifest-versions");
  if (manifest.certificationStatus !== "Strategy Simulation Platform Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");
  return Object.freeze(errors);
}

export function validateExecutiveStrategySimulation(
  registry: ExecutiveStrategySimulationRegistry = EXECUTIVE_STRATEGY_SIMULATION_REGISTRY,
  manifest?: ExecutiveStrategySimulationManifest
): ExecutiveStrategySimulationValidation {
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
      EXECUTIVE_STRATEGY_PUBLIC_APIS.length > 0 ? [] : ["strategy-foundation-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.platformId === "BUS-18" &&
      strategyDefinitions.length > 0 &&
      EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS.length > 0 ? [] : ["strategy-definition-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGIC_THEME_REGISTRY.platformId === "BUS-19" &&
      strategicThemes.length > 0 &&
      EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS.length > 0 ? [] : ["strategic-theme-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.platformId === "BUS-20" &&
      strategicObjectives.length > 0 &&
      EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS.length > 0 ? [] : ["strategic-objective-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.platformId === "BUS-21" &&
      strategicInitiatives.length > 0 &&
      EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS.length > 0 ? [] : ["strategic-initiative-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.platformId === "BUS-22" &&
      strategicRoadmaps.length > 0 &&
      EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS.length > 0 ? [] : ["strategic-roadmap-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.platformId === "BUS-23" &&
      strategyAlignments.length > 0 &&
      EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS.length > 0 ? [] : ["strategy-alignment-validation-failed"]
    ),
    ...(
      EXECUTIVE_STRATEGY_MONITORING_REGISTRY.platformId === "BUS-24" &&
      EXECUTIVE_STRATEGY_MONITORING_PUBLIC_APIS.length > 0 ? [] : ["strategy-monitoring-validation-failed"]
    ),
    ...(kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["kpi-platform-freeze-validation-failed"]),
    ...(okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["okr-platform-freeze-validation-failed"]),
    ...validateRegistry(registry),
    ...(manifest ? validateManifest(manifest) : []),
  ]);
  return result(errors);
}
