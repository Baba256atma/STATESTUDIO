import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiDefinitionManifest } from "./executiveKpiDefinitionManifest.ts";
import { EXECUTIVE_KPI_DEFINITION_REGISTRY } from "./executiveKpiDefinitionRegistry.ts";
import type {
  ExecutiveKpiDefinition,
  ExecutiveKpiDefinitionManifest,
  ExecutiveKpiDefinitionRegistry,
  ExecutiveKpiDefinitionValidation,
} from "./executiveKpiDefinitionTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveKpiDefinitionValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateDefinition(definition: ExecutiveKpiDefinition, registry: ExecutiveKpiDefinitionRegistry): readonly string[] {
  const errors: string[] = [];
  const categoryNames = new Set(registry.categories.map((category) => category.category));
  const directions = new Set(registry.directions);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (!definition.kpiId) errors.push("missing-kpi-id");
  if (!definition.name) errors.push(`missing-kpi-name:${definition.kpiId}`);
  if (!definition.description) errors.push(`missing-kpi-description:${definition.kpiId}`);
  if (!categoryNames.has(definition.category)) errors.push(`invalid-category:${definition.kpiId}`);
  if (!directions.has(definition.direction)) errors.push(`invalid-direction:${definition.kpiId}`);
  if (!lifecycleStates.has(definition.lifecycleState)) errors.push(`invalid-lifecycle:${definition.kpiId}`);
  if (!definition.owner.ownerId || !definition.owner.ownerName || !definition.owner.ownerRole) errors.push(`invalid-owner:${definition.kpiId}`);
  if (!definition.businessDomain) errors.push(`missing-business-domain:${definition.kpiId}`);
  if (!definition.sourceRequirement.metadataOnly || !definition.confidenceRequirement.metadataOnly || !definition.governanceMetadata.metadataOnly) errors.push(`invalid-metadata-requirement:${definition.kpiId}`);
  if (!definition.metadataOnly || !definition.immutable) errors.push(`invalid-definition-metadata:${definition.kpiId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveKpiDefinitionRegistry): readonly string[] {
  const errors: string[] = [];

  if (registry.platformId !== "BUS-2") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive KPI Definition Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-1") errors.push("invalid-foundation-platform");
  if (registry.definitions.length === 0) errors.push("missing-definitions");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.directions.length === 0) errors.push("missing-directions");
  if (registry.lifecycleStates.length === 0) errors.push("missing-lifecycle-states");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.definitions.map((definition) => definition.kpiId)).map((id) => `duplicate-kpi-id:${id}`));
  errors.push(...duplicateValues(registry.categories.map((category) => category.category)).map((id) => `duplicate-category:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const definition of registry.definitions) {
    errors.push(...validateDefinition(definition, registry));
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveKpiDefinitionManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-2") errors.push("invalid-manifest-platform");
  if (manifest.foundationPlatformId !== "BUS-1") errors.push("invalid-manifest-foundation");
  if (!manifest.foundationAvailable) errors.push("foundation-unavailable");
  if (manifest.definitionCount === 0) errors.push("missing-manifest-definitions");
  if (manifest.categoryCount === 0) errors.push("missing-manifest-categories");
  if (manifest.directionCount === 0) errors.push("missing-manifest-directions");
  if (manifest.lifecycleStateCount === 0) errors.push("missing-manifest-lifecycle-states");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Definition Foundation Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveKpiDefinitions(
  registry: ExecutiveKpiDefinitionRegistry = EXECUTIVE_KPI_DEFINITION_REGISTRY,
  manifest: ExecutiveKpiDefinitionManifest = getExecutiveKpiDefinitionManifest()
): ExecutiveKpiDefinitionValidation {
  const foundation = getExecutiveKpiPlatform();
  const errors = Object.freeze([
    ...(foundation.validation.valid ? [] : ["foundation-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}
