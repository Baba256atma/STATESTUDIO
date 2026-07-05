import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeIndex.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeIndex.ts";
import { getExecutiveStrategyManifest } from "./executiveStrategyIndex.ts";
import { getExecutiveStrategyDefinitionManifest } from "./executiveStrategyDefinitionManifest.ts";
import { EXECUTIVE_STRATEGY_DEFINITION_REGISTRY } from "./executiveStrategyDefinitionRegistry.ts";
import type {
  ExecutiveStrategyDefinition,
  ExecutiveStrategyDefinitionManifest,
  ExecutiveStrategyDefinitionRegistry,
  ExecutiveStrategyDefinitionValidation,
} from "./executiveStrategyDefinitionTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveStrategyDefinitionValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateStrategyDefinition(strategy: ExecutiveStrategyDefinition): readonly string[] {
  const errors: string[] = [];

  if (!strategy.identity.strategyId) errors.push("missing-strategy-id");
  if (!strategy.identity.strategyKey) errors.push(`missing-strategy-key:${strategy.identity.strategyId}`);
  if (!strategy.name.displayName) errors.push(`missing-strategy-name:${strategy.identity.strategyId}`);
  if (!strategy.description) errors.push(`missing-strategy-description:${strategy.identity.strategyId}`);
  if (!strategy.mission.missionStatement) errors.push(`missing-mission:${strategy.identity.strategyId}`);
  if (!strategy.vision.visionStatement) errors.push(`missing-vision:${strategy.identity.strategyId}`);
  if (!strategy.strategicIntent.intentStatement) errors.push(`missing-strategic-intent:${strategy.identity.strategyId}`);
  if (!strategy.timeHorizon) errors.push(`missing-time-horizon:${strategy.identity.strategyId}`);
  if (!strategy.metadata.metadataOnly || !strategy.metadata.immutable) errors.push(`invalid-metadata:${strategy.identity.strategyId}`);
  if (!strategy.version.versionLabel) errors.push(`missing-version-label:${strategy.identity.strategyId}`);
  if (strategy.kpiReferences.length === 0) errors.push(`missing-kpi-references:${strategy.identity.strategyId}`);
  if (strategy.okrReferences.length === 0) errors.push(`missing-okr-references:${strategy.identity.strategyId}`);
  if (strategy.stakeholders.length === 0) errors.push(`missing-stakeholders:${strategy.identity.strategyId}`);
  if (strategy.successCriteria.length === 0) errors.push(`missing-success-criteria:${strategy.identity.strategyId}`);
  if (!strategy.metadataOnly || !strategy.immutable) errors.push(`invalid-entry-metadata:${strategy.identity.strategyId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveStrategyDefinitionRegistry): readonly string[] {
  const errors: string[] = [];

  if (registry.platformId !== "BUS-18") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive Strategy Definition Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-17") errors.push("invalid-foundation-platform");
  if (registry.kpiFreezeDependency !== "BUS-12") errors.push("invalid-kpi-freeze-dependency");
  if (registry.okrFreezeDependency !== "BUS-16") errors.push("invalid-okr-freeze-dependency");
  if (registry.strategyDefinitions.length === 0) errors.push("missing-strategy-definitions");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.statuses.length === 0) errors.push("missing-statuses");
  if (registry.priorities.length === 0) errors.push("missing-priorities");
  if (registry.lifecycles.length === 0) errors.push("missing-lifecycles");
  if (registry.versions.length === 0) errors.push("missing-versions");
  if (registry.owners.length === 0) errors.push("missing-owners");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (
    registry.extensionPolicy.definitionMutationAllowed ||
    registry.extensionPolicy.runtimeExecutionAllowed ||
    registry.extensionPolicy.planningAllowed ||
    registry.extensionPolicy.simulationAllowed ||
    registry.extensionPolicy.businessLogicAllowed
  ) {
    errors.push("invalid-extension-policy");
  }
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.strategyDefinitions.map((strategy) => strategy.identity.strategyId)).map((id) => `duplicate-strategy-id:${id}`));
  errors.push(...duplicateValues(registry.versions.map((version) => version.versionId)).map((id) => `duplicate-version-id:${id}`));
  errors.push(...duplicateValues(registry.owners.map((owner) => owner.ownerId)).map((id) => `duplicate-owner-id:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const strategy of registry.strategyDefinitions) {
    errors.push(...validateStrategyDefinition(strategy));
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveStrategyDefinitionManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-18") errors.push("invalid-manifest-platform-id");
  if (manifest.foundationPlatformId !== "BUS-17") errors.push("invalid-manifest-foundation");
  if (!manifest.strategyFoundationAvailable) errors.push("strategy-foundation-unavailable");
  if (!manifest.kpiFreezeAvailable) errors.push("kpi-freeze-unavailable");
  if (!manifest.okrFreezeAvailable) errors.push("okr-freeze-unavailable");
  if (manifest.strategyDefinitionCount === 0) errors.push("missing-manifest-definitions");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.versionCount === 0) errors.push("missing-manifest-versions");
  if (manifest.certificationStatus !== "Definition Platform Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveStrategyDefinition(
  registry: ExecutiveStrategyDefinitionRegistry = EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
  manifest: ExecutiveStrategyDefinitionManifest = getExecutiveStrategyDefinitionManifest()
): ExecutiveStrategyDefinitionValidation {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const foundationManifest = getExecutiveStrategyManifest();
  const errors = Object.freeze([
    ...(foundationManifest.certificationStatus === "Foundation Certified" ? [] : ["strategy-foundation-validation-failed"]),
    ...(kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["kpi-platform-freeze-validation-failed"]),
    ...(okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["okr-platform-freeze-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);
  return result(errors);
}
