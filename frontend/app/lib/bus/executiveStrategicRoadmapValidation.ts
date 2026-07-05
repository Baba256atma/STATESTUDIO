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
import { EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY } from "./executiveStrategicRoadmapRegistry.ts";
import type {
  ExecutiveStrategicRoadmap,
  ExecutiveStrategicRoadmapManifest,
  ExecutiveStrategicRoadmapRegistry,
  ExecutiveStrategicRoadmapValidation,
} from "./executiveStrategicRoadmapTypes.ts";

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
): ExecutiveStrategicRoadmapValidation {
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([...warnings]),
  });
}

function validateRoadmap(
  roadmap: ExecutiveStrategicRoadmap,
  roadmapIds: ReadonlySet<string>,
  phaseIds: ReadonlySet<string>,
  milestoneIds: ReadonlySet<string>,
  strategyIds: ReadonlySet<string>,
  themeIds: ReadonlySet<string>,
  objectiveIds: ReadonlySet<string>,
  initiativeIds: ReadonlySet<string>
): readonly string[] {
  const errors: string[] = [];
  const roadmapPhaseIds = new Set(roadmap.phases.map((phase) => phase.phaseId));
  const roadmapSequenceIds = new Set<string>();
  const roadmapSequenceOrders = new Set<number>();

  if (!roadmap.identity.roadmapId) errors.push("missing-roadmap-id");
  if (!roadmap.identity.roadmapKey) errors.push(`missing-roadmap-key:${roadmap.identity.roadmapId}`);
  if (!roadmap.name.displayName) errors.push(`missing-roadmap-name:${roadmap.identity.roadmapId}`);
  if (!roadmap.description) errors.push(`missing-roadmap-description:${roadmap.identity.roadmapId}`);
  if (!roadmap.purpose.purposeStatement) errors.push(`missing-roadmap-purpose:${roadmap.identity.roadmapId}`);
  if (!roadmap.scope.scopeStatement) errors.push(`missing-roadmap-scope:${roadmap.identity.roadmapId}`);
  if (!roadmap.timeHorizon.horizonLabel) errors.push(`missing-roadmap-time-horizon:${roadmap.identity.roadmapId}`);
  if (roadmap.phases.length === 0) errors.push(`missing-roadmap-phases:${roadmap.identity.roadmapId}`);
  if (roadmap.sequence.length === 0) errors.push(`missing-roadmap-sequence:${roadmap.identity.roadmapId}`);
  if (roadmap.milestones.length === 0) errors.push(`missing-roadmap-milestones:${roadmap.identity.roadmapId}`);
  if (roadmap.stakeholders.length === 0) errors.push(`missing-roadmap-stakeholders:${roadmap.identity.roadmapId}`);
  if (roadmap.successCriteria.length === 0) errors.push(`missing-roadmap-success-criteria:${roadmap.identity.roadmapId}`);
  if (roadmap.kpiReferences.length === 0) errors.push(`missing-kpi-references:${roadmap.identity.roadmapId}`);
  if (roadmap.okrReferences.length === 0) errors.push(`missing-okr-references:${roadmap.identity.roadmapId}`);
  if (roadmap.riskReferences.length === 0) errors.push(`missing-risk-references:${roadmap.identity.roadmapId}`);
  if (!roadmap.strategyReferenceIds.every((strategyId) => strategyIds.has(strategyId))) {
    errors.push(`invalid-strategy-reference:${roadmap.identity.roadmapId}`);
  }
  if (!roadmap.themeReferenceIds.every((themeId) => themeIds.has(themeId))) {
    errors.push(`invalid-theme-reference:${roadmap.identity.roadmapId}`);
  }
  if (!roadmap.objectiveReferenceIds.every((objectiveId) => objectiveIds.has(objectiveId))) {
    errors.push(`invalid-objective-reference:${roadmap.identity.roadmapId}`);
  }
  if (!roadmap.initiativeReferenceIds.every((initiativeId) => initiativeIds.has(initiativeId))) {
    errors.push(`invalid-initiative-reference:${roadmap.identity.roadmapId}`);
  }
  if (!roadmap.dependencies.every((dependency) => roadmapIds.has(dependency.targetRoadmapId))) {
    errors.push(`invalid-roadmap-dependency:${roadmap.identity.roadmapId}`);
  }
  if (!roadmap.milestones.every((milestone) => milestoneIds.has(milestone.milestoneId))) {
    errors.push(`invalid-roadmap-milestone:${roadmap.identity.roadmapId}`);
  }
  if (!roadmap.phases.every((phase) => phaseIds.has(phase.phaseId))) {
    errors.push(`invalid-roadmap-phase:${roadmap.identity.roadmapId}`);
  }

  for (const phase of roadmap.phases) {
    if (!phase.phaseId) errors.push(`missing-phase-id:${roadmap.identity.roadmapId}`);
    if (!phase.phaseName) errors.push(`missing-phase-name:${roadmap.identity.roadmapId}`);
    if (!phase.phaseDescription) errors.push(`missing-phase-description:${phase.phaseId}`);
    if (!phase.metadataOnly || !phase.immutable) errors.push(`invalid-phase-metadata:${phase.phaseId}`);
  }

  for (const entry of roadmap.sequence) {
    if (roadmapSequenceIds.has(entry.sequenceId)) {
      errors.push(`duplicate-sequence-id:${entry.sequenceId}`);
    }
    roadmapSequenceIds.add(entry.sequenceId);
    if (roadmapSequenceOrders.has(entry.sequenceOrder)) {
      errors.push(`duplicate-sequence-order:${roadmap.identity.roadmapId}:${entry.sequenceOrder}`);
    }
    roadmapSequenceOrders.add(entry.sequenceOrder);
    if (!roadmapPhaseIds.has(entry.fromPhaseId) || !roadmapPhaseIds.has(entry.toPhaseId)) {
      errors.push(`invalid-sequence-phase:${entry.sequenceId}`);
    }
    if (entry.fromPhaseId === entry.toPhaseId) {
      errors.push(`self-referential-sequence:${entry.sequenceId}`);
    }
    if (!entry.metadataOnly || !entry.immutable) {
      errors.push(`invalid-sequence-metadata:${entry.sequenceId}`);
    }
  }

  if (!roadmap.metadata.metadataOnly || !roadmap.metadata.immutable) {
    errors.push(`invalid-roadmap-metadata:${roadmap.identity.roadmapId}`);
  }
  if (!roadmap.version.versionLabel) errors.push(`missing-roadmap-version:${roadmap.identity.roadmapId}`);
  if (!roadmap.metadataOnly || !roadmap.immutable) {
    errors.push(`invalid-roadmap-entry-metadata:${roadmap.identity.roadmapId}`);
  }

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveStrategicRoadmapRegistry): readonly string[] {
  const errors: string[] = [];
  const roadmapIds = new Set(registry.roadmaps.map((roadmap) => roadmap.identity.roadmapId));
  const phaseIds = new Set(registry.phases.map((phase) => phase.phaseId));
  const milestoneIds = new Set(registry.milestones.map((milestone) => milestone.milestoneId));
  const strategyIds = new Set(listExecutiveStrategyDefinitions().map((definition) => definition.identity.strategyId));
  const themeIds = new Set(listExecutiveStrategicThemes().map((theme) => theme.identity.themeId));
  const objectiveIds = new Set(listExecutiveStrategicObjectives().map((objective) => objective.identity.objectiveId));
  const initiativeIds = new Set(listExecutiveStrategicInitiatives().map((initiative) => initiative.identity.initiativeId));

  if (registry.platformId !== "BUS-22") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive Strategic Roadmaps Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-17") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-18") errors.push("invalid-definition-platform");
  if (registry.themePlatformId !== "BUS-19") errors.push("invalid-theme-platform");
  if (registry.objectivePlatformId !== "BUS-20") errors.push("invalid-objective-platform");
  if (registry.initiativePlatformId !== "BUS-21") errors.push("invalid-initiative-platform");
  if (registry.kpiFreezeDependency !== "BUS-12") errors.push("invalid-kpi-freeze-dependency");
  if (registry.okrFreezeDependency !== "BUS-16") errors.push("invalid-okr-freeze-dependency");
  if (registry.roadmaps.length === 0) errors.push("missing-roadmaps");
  if (registry.phases.length === 0) errors.push("missing-phases");
  if (registry.milestones.length === 0) errors.push("missing-milestones");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.statuses.length === 0) errors.push("missing-statuses");
  if (registry.priorities.length === 0) errors.push("missing-priorities");
  if (registry.lifecycles.length === 0) errors.push("missing-lifecycles");
  if (registry.owners.length === 0) errors.push("missing-owners");
  if (registry.versions.length === 0) errors.push("missing-versions");
  if (registry.relationships.length === 0) errors.push("missing-relationships");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (
    registry.extensionPolicy.roadmapMutationAllowed ||
    registry.extensionPolicy.runtimeExecutionAllowed ||
    registry.extensionPolicy.schedulingAllowed ||
    registry.extensionPolicy.calendarLogicAllowed ||
    registry.extensionPolicy.simulationAllowed ||
    registry.extensionPolicy.businessLogicAllowed
  ) {
    errors.push("invalid-extension-policy");
  }
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.roadmaps.map((roadmap) => roadmap.identity.roadmapId)).map((id) => `duplicate-roadmap-id:${id}`));
  errors.push(...duplicateValues(registry.phases.map((phase) => phase.phaseId)).map((id) => `duplicate-phase-id:${id}`));
  errors.push(...duplicateValues(registry.milestones.map((milestone) => milestone.milestoneId)).map((id) => `duplicate-milestone-id:${id}`));
  errors.push(...duplicateValues(registry.relationships.map((relationship) => relationship.relationshipId)).map((id) => `duplicate-relationship-id:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));
  errors.push(...duplicateValues(registry.versions.map((version) => version.versionId)).map((id) => `duplicate-version-id:${id}`));

  for (const roadmap of registry.roadmaps) {
    errors.push(...validateRoadmap(roadmap, roadmapIds, phaseIds, milestoneIds, strategyIds, themeIds, objectiveIds, initiativeIds));
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

function validateManifest(manifest: ExecutiveStrategicRoadmapManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-22") errors.push("invalid-manifest-platform-id");
  if (manifest.foundationPlatformId !== "BUS-17") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-18") errors.push("invalid-manifest-definition");
  if (manifest.themePlatformId !== "BUS-19") errors.push("invalid-manifest-theme-platform");
  if (manifest.objectivePlatformId !== "BUS-20") errors.push("invalid-manifest-objective-platform");
  if (manifest.initiativePlatformId !== "BUS-21") errors.push("invalid-manifest-initiative-platform");
  if (!manifest.strategyFoundationAvailable) errors.push("strategy-foundation-unavailable");
  if (!manifest.strategyDefinitionsAvailable) errors.push("strategy-definitions-unavailable");
  if (!manifest.strategicThemesAvailable) errors.push("strategic-themes-unavailable");
  if (!manifest.strategicObjectivesAvailable) errors.push("strategic-objectives-unavailable");
  if (!manifest.strategicInitiativesAvailable) errors.push("strategic-initiatives-unavailable");
  if (!manifest.kpiFreezeAvailable) errors.push("kpi-freeze-unavailable");
  if (!manifest.okrFreezeAvailable) errors.push("okr-freeze-unavailable");
  if (manifest.roadmapCount === 0) errors.push("missing-manifest-roadmaps");
  if (manifest.phaseCount === 0) errors.push("missing-manifest-phases");
  if (manifest.milestoneCount === 0) errors.push("missing-manifest-milestones");
  if (manifest.relationshipCount === 0) errors.push("missing-manifest-relationships");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.versionCount === 0) errors.push("missing-manifest-versions");
  if (manifest.certificationStatus !== "Strategic Roadmaps Platform Certified") {
    errors.push("invalid-certification-status");
  }
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveStrategicRoadmap(
  registry: ExecutiveStrategicRoadmapRegistry = EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
  manifest?: ExecutiveStrategicRoadmapManifest
): ExecutiveStrategicRoadmapValidation {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
  const strategicObjectives = listExecutiveStrategicObjectives();
  const strategicInitiatives = listExecutiveStrategicInitiatives();
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
    ...(kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["kpi-platform-freeze-validation-failed"]),
    ...(okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["okr-platform-freeze-validation-failed"]),
    ...validateRegistry(registry),
    ...(manifest ? validateManifest(manifest) : []),
  ]);
  return result(errors);
}
