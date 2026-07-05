import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeIndex.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeIndex.ts";
import {
  EXECUTIVE_STRATEGY_PLATFORM_REGISTRY,
  EXECUTIVE_STRATEGY_PUBLIC_APIS,
} from "./executiveStrategyRegistry.ts";
import {
  EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
  listExecutiveStrategyDefinitions,
} from "./executiveStrategyDefinitionRegistry.ts";
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
import { EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY } from "./executiveStrategicInitiativeRegistry.ts";
import type {
  ExecutiveStrategicInitiative,
  ExecutiveStrategicInitiativeManifest,
  ExecutiveStrategicInitiativeRegistry,
  ExecutiveStrategicInitiativeValidation,
} from "./executiveStrategicInitiativeTypes.ts";

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
): ExecutiveStrategicInitiativeValidation {
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([...warnings]),
  });
}

function validateInitiative(
  initiative: ExecutiveStrategicInitiative,
  initiativeIds: ReadonlySet<string>,
  strategyIds: ReadonlySet<string>,
  themeIds: ReadonlySet<string>,
  objectiveIds: ReadonlySet<string>,
  milestoneIds: ReadonlySet<string>
): readonly string[] {
  const errors: string[] = [];

  if (!initiative.identity.initiativeId) errors.push("missing-initiative-id");
  if (!initiative.identity.initiativeKey) errors.push(`missing-initiative-key:${initiative.identity.initiativeId}`);
  if (!initiative.name.displayName) errors.push(`missing-initiative-name:${initiative.identity.initiativeId}`);
  if (!initiative.description) errors.push(`missing-initiative-description:${initiative.identity.initiativeId}`);
  if (!initiative.purpose.purposeStatement) errors.push(`missing-initiative-purpose:${initiative.identity.initiativeId}`);
  if (!initiative.scope.scopeStatement) errors.push(`missing-initiative-scope:${initiative.identity.initiativeId}`);
  if (initiative.parentInitiativeId && !initiativeIds.has(initiative.parentInitiativeId)) {
    errors.push(`invalid-parent-initiative:${initiative.identity.initiativeId}`);
  }
  if (!initiative.childInitiativeIds.every((childInitiativeId) => initiativeIds.has(childInitiativeId))) {
    errors.push(`invalid-child-initiative:${initiative.identity.initiativeId}`);
  }
  if (!initiative.strategyReferenceIds.every((strategyId) => strategyIds.has(strategyId))) {
    errors.push(`invalid-strategy-reference:${initiative.identity.initiativeId}`);
  }
  if (!initiative.themeReferenceIds.every((themeId) => themeIds.has(themeId))) {
    errors.push(`invalid-theme-reference:${initiative.identity.initiativeId}`);
  }
  if (!initiative.objectiveReferenceIds.every((objectiveId) => objectiveIds.has(objectiveId))) {
    errors.push(`invalid-objective-reference:${initiative.identity.initiativeId}`);
  }
  if (!initiative.dependencies.every((dependency) => initiativeIds.has(dependency.targetInitiativeId))) {
    errors.push(`invalid-dependency-reference:${initiative.identity.initiativeId}`);
  }
  if (!initiative.milestones.every((milestone) => milestoneIds.has(milestone.milestoneId))) {
    errors.push(`invalid-milestone-reference:${initiative.identity.initiativeId}`);
  }
  if (initiative.kpiReferences.length === 0) errors.push(`missing-kpi-references:${initiative.identity.initiativeId}`);
  if (initiative.okrReferences.length === 0) errors.push(`missing-okr-references:${initiative.identity.initiativeId}`);
  if (initiative.riskReferences.length === 0) errors.push(`missing-risk-references:${initiative.identity.initiativeId}`);
  if (initiative.milestones.length === 0) errors.push(`missing-milestones:${initiative.identity.initiativeId}`);
  if (initiative.deliverables.length === 0) errors.push(`missing-deliverables:${initiative.identity.initiativeId}`);
  if (initiative.stakeholders.length === 0) errors.push(`missing-stakeholders:${initiative.identity.initiativeId}`);
  if (initiative.successCriteria.length === 0) errors.push(`missing-success-criteria:${initiative.identity.initiativeId}`);
  if (!initiative.metadata.metadataOnly || !initiative.metadata.immutable) {
    errors.push(`invalid-initiative-metadata:${initiative.identity.initiativeId}`);
  }
  if (!initiative.version.versionLabel) errors.push(`missing-initiative-version:${initiative.identity.initiativeId}`);
  if (!initiative.metadataOnly || !initiative.immutable) {
    errors.push(`invalid-initiative-entry-metadata:${initiative.identity.initiativeId}`);
  }

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveStrategicInitiativeRegistry): readonly string[] {
  const errors: string[] = [];
  const initiativeIds = new Set(registry.initiatives.map((initiative) => initiative.identity.initiativeId));
  const strategyIds = new Set(listExecutiveStrategyDefinitions().map((definition) => definition.identity.strategyId));
  const themeIds = new Set(listExecutiveStrategicThemes().map((theme) => theme.identity.themeId));
  const objectiveIds = new Set(listExecutiveStrategicObjectives().map((objective) => objective.identity.objectiveId));
  const milestoneIds = new Set(registry.milestones.map((milestone) => milestone.milestoneId));

  if (registry.platformId !== "BUS-21") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive Strategic Initiatives Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-17") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-18") errors.push("invalid-definition-platform");
  if (registry.themePlatformId !== "BUS-19") errors.push("invalid-theme-platform");
  if (registry.objectivePlatformId !== "BUS-20") errors.push("invalid-objective-platform");
  if (registry.kpiFreezeDependency !== "BUS-12") errors.push("invalid-kpi-freeze-dependency");
  if (registry.okrFreezeDependency !== "BUS-16") errors.push("invalid-okr-freeze-dependency");
  if (registry.initiatives.length === 0) errors.push("missing-initiatives");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.statuses.length === 0) errors.push("missing-statuses");
  if (registry.priorities.length === 0) errors.push("missing-priorities");
  if (registry.lifecycles.length === 0) errors.push("missing-lifecycles");
  if (registry.owners.length === 0) errors.push("missing-owners");
  if (registry.versions.length === 0) errors.push("missing-versions");
  if (registry.milestones.length === 0) errors.push("missing-milestones");
  if (registry.relationships.length === 0) errors.push("missing-relationships");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (
    registry.extensionPolicy.initiativeMutationAllowed ||
    registry.extensionPolicy.runtimeExecutionAllowed ||
    registry.extensionPolicy.roadmapSchedulingAllowed ||
    registry.extensionPolicy.monitoringAllowed ||
    registry.extensionPolicy.planningAllowed ||
    registry.extensionPolicy.businessLogicAllowed
  ) {
    errors.push("invalid-extension-policy");
  }
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.initiatives.map((initiative) => initiative.identity.initiativeId)).map((id) => `duplicate-initiative-id:${id}`));
  errors.push(...duplicateValues(registry.relationships.map((relationship) => relationship.relationshipId)).map((id) => `duplicate-relationship-id:${id}`));
  errors.push(...duplicateValues(registry.milestones.map((milestone) => milestone.milestoneId)).map((id) => `duplicate-milestone-id:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));
  errors.push(...duplicateValues(registry.versions.map((version) => version.versionId)).map((id) => `duplicate-version-id:${id}`));

  for (const initiative of registry.initiatives) {
    errors.push(...validateInitiative(initiative, initiativeIds, strategyIds, themeIds, objectiveIds, milestoneIds));
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

function validateManifest(manifest: ExecutiveStrategicInitiativeManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-21") errors.push("invalid-manifest-platform-id");
  if (manifest.foundationPlatformId !== "BUS-17") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-18") errors.push("invalid-manifest-definition");
  if (manifest.themePlatformId !== "BUS-19") errors.push("invalid-manifest-theme-platform");
  if (manifest.objectivePlatformId !== "BUS-20") errors.push("invalid-manifest-objective-platform");
  if (!manifest.strategyFoundationAvailable) errors.push("strategy-foundation-unavailable");
  if (!manifest.strategyDefinitionsAvailable) errors.push("strategy-definitions-unavailable");
  if (!manifest.strategicThemesAvailable) errors.push("strategic-themes-unavailable");
  if (!manifest.strategicObjectivesAvailable) errors.push("strategic-objectives-unavailable");
  if (!manifest.kpiFreezeAvailable) errors.push("kpi-freeze-unavailable");
  if (!manifest.okrFreezeAvailable) errors.push("okr-freeze-unavailable");
  if (manifest.initiativeCount === 0) errors.push("missing-manifest-initiatives");
  if (manifest.milestoneCount === 0) errors.push("missing-manifest-milestones");
  if (manifest.relationshipCount === 0) errors.push("missing-manifest-relationships");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.versionCount === 0) errors.push("missing-manifest-versions");
  if (manifest.certificationStatus !== "Strategic Initiatives Platform Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveStrategicInitiative(
  registry: ExecutiveStrategicInitiativeRegistry = EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY,
  manifest?: ExecutiveStrategicInitiativeManifest
): ExecutiveStrategicInitiativeValidation {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
  const strategicObjectives = listExecutiveStrategicObjectives();
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
    ...(kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["kpi-platform-freeze-validation-failed"]),
    ...(okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["okr-platform-freeze-validation-failed"]),
    ...validateRegistry(registry),
    ...(manifest ? validateManifest(manifest) : []),
  ]);
  return result(errors);
}
