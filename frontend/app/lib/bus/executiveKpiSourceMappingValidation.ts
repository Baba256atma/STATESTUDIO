import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiSourceMappingManifest } from "./executiveKpiSourceMappingManifest.ts";
import { EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY } from "./executiveKpiSourceMappingRegistry.ts";
import type {
  ExecutiveKpiSourceMapping,
  ExecutiveKpiSourceMappingManifest,
  ExecutiveKpiSourceMappingRegistry,
  ExecutiveKpiSourceMappingValidation,
} from "./executiveKpiSourceMappingTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveKpiSourceMappingValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateMapping(mapping: ExecutiveKpiSourceMapping, registry: ExecutiveKpiSourceMappingRegistry, validKpiIds: ReadonlySet<string>): readonly string[] {
  const errors: string[] = [];
  const sourceTypes = new Set(registry.sourceTypes);
  const coverageLevels = new Set(registry.coverageLevels);
  const freshnessExpectations = new Set(registry.freshnessExpectations);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (!mapping.mappingId) errors.push("missing-mapping-id");
  if (!validKpiIds.has(mapping.kpiId)) errors.push(`invalid-kpi-reference:${mapping.mappingId}`);
  if (!sourceTypes.has(mapping.sourceType)) errors.push(`invalid-source-type:${mapping.mappingId}`);
  if (!mapping.sourceName) errors.push(`missing-source-name:${mapping.mappingId}`);
  if (!mapping.sourceDescription) errors.push(`missing-source-description:${mapping.mappingId}`);
  if (!mapping.sourceOwner.ownerId || !mapping.sourceOwner.ownerName || !mapping.sourceOwner.ownerRole) errors.push(`invalid-owner:${mapping.mappingId}`);
  if (!mapping.sourceDomain) errors.push(`missing-source-domain:${mapping.mappingId}`);
  if (mapping.requiredFields.length === 0) errors.push(`missing-required-fields:${mapping.mappingId}`);
  if (mapping.requiredFields.some((field) => !field.fieldId || !field.fieldName || !field.metadataOnly)) errors.push(`invalid-required-field:${mapping.mappingId}`);
  if (mapping.optionalFields.some((field) => !field.fieldId || !field.fieldName || !field.metadataOnly)) errors.push(`invalid-optional-field:${mapping.mappingId}`);
  if (!freshnessExpectations.has(mapping.freshnessExpectation)) errors.push(`invalid-freshness:${mapping.mappingId}`);
  if (!coverageLevels.has(mapping.coverageLevel)) errors.push(`invalid-coverage:${mapping.mappingId}`);
  if (!mapping.mappingConfidence.metadataOnly) errors.push(`invalid-confidence:${mapping.mappingId}`);
  if (!lifecycleStates.has(mapping.lifecycleState)) errors.push(`invalid-lifecycle:${mapping.mappingId}`);
  if (!mapping.governanceMetadata.metadataOnly) errors.push(`invalid-governance:${mapping.mappingId}`);
  if (!mapping.metadataOnly || !mapping.immutable) errors.push(`invalid-mapping-metadata:${mapping.mappingId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveKpiSourceMappingRegistry): readonly string[] {
  const errors: string[] = [];
  const definitions = getExecutiveKpiDefinitionPlatform();
  const validKpiIds = new Set(definitions.registry.definitions.map((definition) => definition.kpiId));

  if (registry.platformId !== "BUS-3") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive KPI Source Mapping Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-1") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-2") errors.push("invalid-definition-platform");
  if (registry.mappings.length === 0) errors.push("missing-mappings");
  if (registry.sourceTypes.length === 0) errors.push("missing-source-types");
  if (registry.coverageLevels.length === 0) errors.push("missing-coverage-levels");
  if (registry.freshnessExpectations.length === 0) errors.push("missing-freshness-expectations");
  if (registry.lifecycleStates.length === 0) errors.push("missing-lifecycle-states");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.mappings.map((mapping) => mapping.mappingId)).map((id) => `duplicate-mapping-id:${id}`));
  errors.push(...duplicateValues(registry.sourceTypes).map((id) => `duplicate-source-type:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const mapping of registry.mappings) {
    errors.push(...validateMapping(mapping, registry, validKpiIds));
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveKpiSourceMappingManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-3") errors.push("invalid-manifest-platform");
  if (manifest.foundationPlatformId !== "BUS-1") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-2") errors.push("invalid-manifest-definition-platform");
  if (!manifest.foundationAvailable) errors.push("foundation-unavailable");
  if (!manifest.definitionsAvailable) errors.push("definitions-unavailable");
  if (manifest.mappingCount === 0) errors.push("missing-manifest-mappings");
  if (manifest.sourceTypeCount === 0) errors.push("missing-manifest-source-types");
  if (manifest.coverageLevelCount === 0) errors.push("missing-manifest-coverage-levels");
  if (manifest.freshnessExpectationCount === 0) errors.push("missing-manifest-freshness");
  if (manifest.lifecycleStateCount === 0) errors.push("missing-manifest-lifecycle-states");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Source Mapping Foundation Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveKpiSourceMappings(
  registry: ExecutiveKpiSourceMappingRegistry = EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY,
  manifest: ExecutiveKpiSourceMappingManifest = getExecutiveKpiSourceMappingManifest()
): ExecutiveKpiSourceMappingValidation {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const errors = Object.freeze([
    ...(foundation.validation.valid ? [] : ["foundation-validation-failed"]),
    ...(definitions.validation.valid ? [] : ["definition-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}
