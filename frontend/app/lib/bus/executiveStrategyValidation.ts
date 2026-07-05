import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeIndex.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeIndex.ts";
import { getExecutiveStrategyManifest } from "./executiveStrategyManifest.ts";
import { EXECUTIVE_STRATEGY_PLATFORM_REGISTRY } from "./executiveStrategyRegistry.ts";
import type {
  ExecutiveStrategyPlatformManifest,
  ExecutiveStrategyPlatformRegistry,
  ExecutiveStrategyPlatformValidation,
} from "./executiveStrategyTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveStrategyPlatformValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateRegistry(registry: ExecutiveStrategyPlatformRegistry): readonly string[] {
  const errors: string[] = [];

  if (registry.identity.platformName !== "Executive Strategy Platform") errors.push("invalid-platform-name");
  if (registry.identity.platformId !== "BUS-17") errors.push("invalid-platform-id");
  if (registry.identity.version !== "1.0.0") errors.push("invalid-version");
  if (registry.identity.status !== "Foundation") errors.push("invalid-status");
  if (registry.identity.domainIdentity !== "Executive Strategy Domain") errors.push("invalid-domain-identity");
  if (registry.identity.namespace !== "executive.strategy") errors.push("invalid-namespace");
  if (registry.entities.length !== 17) errors.push("invalid-entity-count");
  if (registry.strategyTypes.length !== 17) errors.push("invalid-type-registry");
  if (registry.statuses.length === 0) errors.push("missing-status-registry");
  if (registry.priorities.length === 0) errors.push("missing-priority-registry");
  if (registry.lifecycles.length === 0) errors.push("missing-lifecycle-registry");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (registry.dependencies.length !== 2) errors.push("invalid-dependencies");
  if (!registry.dependencies.some((dependency) => dependency.dependencyId === "Executive KPI Platform Freeze")) errors.push("missing-kpi-freeze-dependency");
  if (!registry.dependencies.some((dependency) => dependency.dependencyId === "Executive OKR Platform Freeze")) errors.push("missing-okr-freeze-dependency");
  if (registry.consumers.length === 0) errors.push("missing-consumers");
  if (registry.compatibility.length === 0) errors.push("missing-compatibility");
  if (
    registry.extensionPolicy.foundationMutationAllowed ||
    registry.extensionPolicy.runtimeExecutionAllowed ||
    registry.extensionPolicy.businessLogicAllowed ||
    registry.extensionPolicy.strategyExecutionAllowed ||
    registry.extensionPolicy.orchestrationAllowed
  ) {
    errors.push("invalid-extension-policy");
  }

  errors.push(...duplicateValues(registry.entities.map((entity) => entity.entityId)).map((id) => `duplicate-entity-id:${id}`));
  errors.push(...duplicateValues(registry.entities.map((entity) => entity.contractName)).map((id) => `duplicate-contract-name:${id}`));
  errors.push(...duplicateValues(registry.publicApis.map((api) => api.apiName)).map((id) => `duplicate-public-api:${id}`));

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveStrategyPlatformManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.identity.platformId !== "BUS-17") errors.push("invalid-manifest-platform-id");
  if (!manifest.kpiFreezeAvailable) errors.push("kpi-freeze-unavailable");
  if (!manifest.okrFreezeAvailable) errors.push("okr-freeze-unavailable");
  if (manifest.domainDefinition.length !== 17) errors.push("invalid-manifest-domain-definition");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.dependencies.length !== 2) errors.push("invalid-manifest-dependencies");
  if (manifest.certificationStatus !== "Foundation Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveStrategyPlatform(
  registry: ExecutiveStrategyPlatformRegistry = EXECUTIVE_STRATEGY_PLATFORM_REGISTRY,
  manifest: ExecutiveStrategyPlatformManifest = getExecutiveStrategyManifest()
): ExecutiveStrategyPlatformValidation {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const errors = Object.freeze([
    ...(kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["kpi-platform-freeze-validation-failed"]),
    ...(okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["okr-platform-freeze-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);
  return result(errors);
}
