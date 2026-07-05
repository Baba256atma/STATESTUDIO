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
import { EXECUTIVE_STRATEGIC_THEME_REGISTRY } from "./executiveStrategicThemeRegistry.ts";
import type {
  ExecutiveStrategicTheme,
  ExecutiveStrategicThemeManifest,
  ExecutiveStrategicThemeRegistry,
  ExecutiveStrategicThemeValidation,
} from "./executiveStrategicThemeTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveStrategicThemeValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateTheme(theme: ExecutiveStrategicTheme, themeIds: ReadonlySet<string>, strategyIds: ReadonlySet<string>): readonly string[] {
  const errors: string[] = [];

  if (!theme.identity.themeId) errors.push("missing-theme-id");
  if (!theme.identity.themeKey) errors.push(`missing-theme-key:${theme.identity.themeId}`);
  if (!theme.name.displayName) errors.push(`missing-theme-name:${theme.identity.themeId}`);
  if (!theme.description) errors.push(`missing-theme-description:${theme.identity.themeId}`);
  if (!theme.purpose.purposeStatement) errors.push(`missing-theme-purpose:${theme.identity.themeId}`);
  if (!theme.scope.scopeStatement) errors.push(`missing-theme-scope:${theme.identity.themeId}`);
  if (theme.parentThemeId && !themeIds.has(theme.parentThemeId)) errors.push(`invalid-parent-theme:${theme.identity.themeId}`);
  if (!theme.childThemeIds.every((childThemeId) => themeIds.has(childThemeId))) errors.push(`invalid-child-theme:${theme.identity.themeId}`);
  if (!theme.strategyReferenceIds.every((strategyId) => strategyIds.has(strategyId))) errors.push(`invalid-strategy-reference:${theme.identity.themeId}`);
  if (theme.kpiReferences.length === 0) errors.push(`missing-kpi-references:${theme.identity.themeId}`);
  if (theme.okrReferences.length === 0) errors.push(`missing-okr-references:${theme.identity.themeId}`);
  if (theme.stakeholders.length === 0) errors.push(`missing-stakeholders:${theme.identity.themeId}`);
  if (theme.successCriteria.length === 0) errors.push(`missing-success-criteria:${theme.identity.themeId}`);
  if (!theme.metadata.metadataOnly || !theme.metadata.immutable) errors.push(`invalid-theme-metadata:${theme.identity.themeId}`);
  if (!theme.version.versionLabel) errors.push(`missing-theme-version:${theme.identity.themeId}`);
  if (!theme.metadataOnly || !theme.immutable) errors.push(`invalid-theme-entry-metadata:${theme.identity.themeId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveStrategicThemeRegistry): readonly string[] {
  const errors: string[] = [];
  const themeIds = new Set(registry.themes.map((theme) => theme.identity.themeId));
  const strategyIds = new Set(
    listExecutiveStrategyDefinitions().map((definition) => definition.identity.strategyId)
  );

  if (registry.platformId !== "BUS-19") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive Strategic Themes Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-17") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-18") errors.push("invalid-definition-platform");
  if (registry.kpiFreezeDependency !== "BUS-12") errors.push("invalid-kpi-freeze-dependency");
  if (registry.okrFreezeDependency !== "BUS-16") errors.push("invalid-okr-freeze-dependency");
  if (registry.themes.length === 0) errors.push("missing-themes");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.statuses.length === 0) errors.push("missing-statuses");
  if (registry.priorities.length === 0) errors.push("missing-priorities");
  if (registry.lifecycles.length === 0) errors.push("missing-lifecycles");
  if (registry.owners.length === 0) errors.push("missing-owners");
  if (registry.versions.length === 0) errors.push("missing-versions");
  if (registry.relationships.length === 0) errors.push("missing-relationships");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (
    registry.extensionPolicy.themeMutationAllowed ||
    registry.extensionPolicy.runtimeExecutionAllowed ||
    registry.extensionPolicy.objectiveManagementAllowed ||
    registry.extensionPolicy.initiativeManagementAllowed ||
    registry.extensionPolicy.roadmapGenerationAllowed ||
    registry.extensionPolicy.businessLogicAllowed
  ) {
    errors.push("invalid-extension-policy");
  }
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.themes.map((theme) => theme.identity.themeId)).map((id) => `duplicate-theme-id:${id}`));
  errors.push(...duplicateValues(registry.relationships.map((relationship) => relationship.relationshipId)).map((id) => `duplicate-relationship-id:${id}`));
  errors.push(...duplicateValues(registry.versions.map((version) => version.versionId)).map((id) => `duplicate-version-id:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const theme of registry.themes) {
    errors.push(...validateTheme(theme, themeIds, strategyIds));
  }
  for (const relationship of registry.relationships) {
    if (!relationship.relationshipId) errors.push("missing-relationship-id");
    if (!relationship.sourceId) errors.push(`missing-relationship-source:${relationship.relationshipId}`);
    if (!relationship.targetId) errors.push(`missing-relationship-target:${relationship.relationshipId}`);
    if (!relationship.metadataOnly || !relationship.immutable) errors.push(`invalid-relationship-metadata:${relationship.relationshipId}`);
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveStrategicThemeManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-19") errors.push("invalid-manifest-platform-id");
  if (manifest.foundationPlatformId !== "BUS-17") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-18") errors.push("invalid-manifest-definition");
  if (!manifest.strategyFoundationAvailable) errors.push("strategy-foundation-unavailable");
  if (!manifest.strategyDefinitionsAvailable) errors.push("strategy-definitions-unavailable");
  if (!manifest.kpiFreezeAvailable) errors.push("kpi-freeze-unavailable");
  if (!manifest.okrFreezeAvailable) errors.push("okr-freeze-unavailable");
  if (manifest.themeCount === 0) errors.push("missing-manifest-themes");
  if (manifest.relationshipCount === 0) errors.push("missing-manifest-relationships");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.versionCount === 0) errors.push("missing-manifest-versions");
  if (manifest.certificationStatus !== "Strategic Themes Platform Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveStrategicTheme(
  registry: ExecutiveStrategicThemeRegistry = EXECUTIVE_STRATEGIC_THEME_REGISTRY,
  manifest?: ExecutiveStrategicThemeManifest
): ExecutiveStrategicThemeValidation {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const strategyDefinitions = listExecutiveStrategyDefinitions();
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
    ...(kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["kpi-platform-freeze-validation-failed"]),
    ...(okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["okr-platform-freeze-validation-failed"]),
    ...validateRegistry(registry),
    ...(manifest ? validateManifest(manifest) : []),
  ]);
  return result(errors);
}
