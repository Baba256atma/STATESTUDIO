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
import { EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY } from "./executiveStrategicObjectiveRegistry.ts";
import type {
  ExecutiveStrategicObjective,
  ExecutiveStrategicObjectiveManifest,
  ExecutiveStrategicObjectiveRegistry,
  ExecutiveStrategicObjectiveValidation,
} from "./executiveStrategicObjectiveTypes.ts";

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
): ExecutiveStrategicObjectiveValidation {
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([...warnings]),
  });
}

function validateObjective(
  objective: ExecutiveStrategicObjective,
  objectiveIds: ReadonlySet<string>,
  strategyIds: ReadonlySet<string>,
  themeIds: ReadonlySet<string>
): readonly string[] {
  const errors: string[] = [];

  if (!objective.identity.objectiveId) errors.push("missing-objective-id");
  if (!objective.identity.objectiveKey) errors.push(`missing-objective-key:${objective.identity.objectiveId}`);
  if (!objective.name.displayName) errors.push(`missing-objective-name:${objective.identity.objectiveId}`);
  if (!objective.description) errors.push(`missing-objective-description:${objective.identity.objectiveId}`);
  if (!objective.purpose.purposeStatement) errors.push(`missing-objective-purpose:${objective.identity.objectiveId}`);
  if (!objective.scope.scopeStatement) errors.push(`missing-objective-scope:${objective.identity.objectiveId}`);
  if (objective.parentObjectiveId && !objectiveIds.has(objective.parentObjectiveId)) {
    errors.push(`invalid-parent-objective:${objective.identity.objectiveId}`);
  }
  if (!objective.childObjectiveIds.every((childObjectiveId) => objectiveIds.has(childObjectiveId))) {
    errors.push(`invalid-child-objective:${objective.identity.objectiveId}`);
  }
  if (!objective.strategyReferenceIds.every((strategyId) => strategyIds.has(strategyId))) {
    errors.push(`invalid-strategy-reference:${objective.identity.objectiveId}`);
  }
  if (!objective.themeReferenceIds.every((themeId) => themeIds.has(themeId))) {
    errors.push(`invalid-theme-reference:${objective.identity.objectiveId}`);
  }
  if (objective.kpiReferences.length === 0) errors.push(`missing-kpi-references:${objective.identity.objectiveId}`);
  if (objective.okrReferences.length === 0) errors.push(`missing-okr-references:${objective.identity.objectiveId}`);
  if (objective.riskReferences.length === 0) errors.push(`missing-risk-references:${objective.identity.objectiveId}`);
  if (objective.stakeholders.length === 0) errors.push(`missing-stakeholders:${objective.identity.objectiveId}`);
  if (objective.successCriteria.length === 0) errors.push(`missing-success-criteria:${objective.identity.objectiveId}`);
  if (!objective.dependencies.every((dependency) => objectiveIds.has(dependency.targetObjectiveId))) {
    errors.push(`invalid-dependency-reference:${objective.identity.objectiveId}`);
  }
  if (!objective.metadata.metadataOnly || !objective.metadata.immutable) {
    errors.push(`invalid-objective-metadata:${objective.identity.objectiveId}`);
  }
  if (!objective.version.versionLabel) errors.push(`missing-objective-version:${objective.identity.objectiveId}`);
  if (!objective.metadataOnly || !objective.immutable) {
    errors.push(`invalid-objective-entry-metadata:${objective.identity.objectiveId}`);
  }

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveStrategicObjectiveRegistry): readonly string[] {
  const errors: string[] = [];
  const objectiveIds = new Set(registry.objectives.map((objective) => objective.identity.objectiveId));
  const strategyIds = new Set(
    listExecutiveStrategyDefinitions().map((definition) => definition.identity.strategyId)
  );
  const themeIds = new Set(listExecutiveStrategicThemes().map((theme) => theme.identity.themeId));

  if (registry.platformId !== "BUS-20") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive Strategic Objectives Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-17") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-18") errors.push("invalid-definition-platform");
  if (registry.themePlatformId !== "BUS-19") errors.push("invalid-theme-platform");
  if (registry.kpiFreezeDependency !== "BUS-12") errors.push("invalid-kpi-freeze-dependency");
  if (registry.okrFreezeDependency !== "BUS-16") errors.push("invalid-okr-freeze-dependency");
  if (registry.objectives.length === 0) errors.push("missing-objectives");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.statuses.length === 0) errors.push("missing-statuses");
  if (registry.priorities.length === 0) errors.push("missing-priorities");
  if (registry.lifecycles.length === 0) errors.push("missing-lifecycles");
  if (registry.owners.length === 0) errors.push("missing-owners");
  if (registry.versions.length === 0) errors.push("missing-versions");
  if (registry.relationships.length === 0) errors.push("missing-relationships");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (
    registry.extensionPolicy.objectiveMutationAllowed ||
    registry.extensionPolicy.runtimeExecutionAllowed ||
    registry.extensionPolicy.initiativeManagementAllowed ||
    registry.extensionPolicy.roadmapManagementAllowed ||
    registry.extensionPolicy.planningAllowed ||
    registry.extensionPolicy.businessLogicAllowed
  ) {
    errors.push("invalid-extension-policy");
  }
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.objectives.map((objective) => objective.identity.objectiveId)).map((id) => `duplicate-objective-id:${id}`));
  errors.push(...duplicateValues(registry.relationships.map((relationship) => relationship.relationshipId)).map((id) => `duplicate-relationship-id:${id}`));
  errors.push(...duplicateValues(registry.versions.map((version) => version.versionId)).map((id) => `duplicate-version-id:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const objective of registry.objectives) {
    errors.push(...validateObjective(objective, objectiveIds, strategyIds, themeIds));
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

function validateManifest(manifest: ExecutiveStrategicObjectiveManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-20") errors.push("invalid-manifest-platform-id");
  if (manifest.foundationPlatformId !== "BUS-17") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-18") errors.push("invalid-manifest-definition");
  if (manifest.themePlatformId !== "BUS-19") errors.push("invalid-manifest-theme-platform");
  if (!manifest.strategyFoundationAvailable) errors.push("strategy-foundation-unavailable");
  if (!manifest.strategyDefinitionsAvailable) errors.push("strategy-definitions-unavailable");
  if (!manifest.strategicThemesAvailable) errors.push("strategic-themes-unavailable");
  if (!manifest.kpiFreezeAvailable) errors.push("kpi-freeze-unavailable");
  if (!manifest.okrFreezeAvailable) errors.push("okr-freeze-unavailable");
  if (manifest.objectiveCount === 0) errors.push("missing-manifest-objectives");
  if (manifest.relationshipCount === 0) errors.push("missing-manifest-relationships");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.versionCount === 0) errors.push("missing-manifest-versions");
  if (manifest.certificationStatus !== "Strategic Objectives Platform Certified") {
    errors.push("invalid-certification-status");
  }
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveStrategicObjective(
  registry: ExecutiveStrategicObjectiveRegistry = EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY,
  manifest?: ExecutiveStrategicObjectiveManifest
): ExecutiveStrategicObjectiveValidation {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
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
    ...(kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["kpi-platform-freeze-validation-failed"]),
    ...(okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["okr-platform-freeze-validation-failed"]),
    ...validateRegistry(registry),
    ...(manifest ? validateManifest(manifest) : []),
  ]);
  return result(errors);
}
