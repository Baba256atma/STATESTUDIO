import { getExecutiveOkrDefinitionManifest } from "./executiveOkrDefinitionManifest.ts";
import { EXECUTIVE_OKR_DEFINITION_REGISTRY } from "./executiveOkrDefinitionRegistry.ts";
import type {
  ExecutiveKeyResult,
  ExecutiveObjective,
  ExecutiveOkrDefinitionManifest,
  ExecutiveOkrDefinitionRegistry,
  ExecutiveOkrDefinitionValidation,
} from "./executiveOkrDefinitionTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveOkrDefinitionValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateKpiLinks(ownerId: string, linkedKpiIds: readonly string[], validKpiIds: ReadonlySet<string>, prefix: string): readonly string[] {
  const errors: string[] = [];
  if (linkedKpiIds.length === 0) errors.push(`missing-kpi-links:${ownerId}`);
  for (const kpiId of linkedKpiIds) {
    if (!validKpiIds.has(kpiId)) errors.push(`${prefix}:${ownerId}:${kpiId}`);
  }
  return Object.freeze(errors);
}

function validateObjective(objective: ExecutiveObjective, registry: ExecutiveOkrDefinitionRegistry, validKpiIds: ReadonlySet<string>, validKeyResultIds: ReadonlySet<string>): readonly string[] {
  const errors: string[] = [];
  const objectiveCategories = new Set(registry.objectiveCategories);
  const strategicHorizons = new Set(registry.strategicHorizons);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (!objective.objectiveId) errors.push("missing-objective-id");
  if (!objective.objectiveName) errors.push(`missing-objective-name:${objective.objectiveId}`);
  if (!objective.objectiveDescription) errors.push(`missing-objective-description:${objective.objectiveId}`);
  if (!objectiveCategories.has(objective.objectiveCategory)) errors.push(`invalid-objective-category:${objective.objectiveId}`);
  if (!objective.businessDomain) errors.push(`missing-business-domain:${objective.objectiveId}`);
  if (!objective.executiveOwner.metadataOnly) errors.push(`invalid-objective-owner:${objective.objectiveId}`);
  if (!strategicHorizons.has(objective.strategicHorizon)) errors.push(`invalid-strategic-horizon:${objective.objectiveId}`);
  if (!objective.reviewCadence) errors.push(`missing-review-cadence:${objective.objectiveId}`);
  for (const keyResultId of objective.linkedKeyResultIds) {
    if (!validKeyResultIds.has(keyResultId)) errors.push(`invalid-key-result-link:${objective.objectiveId}:${keyResultId}`);
  }
  errors.push(...validateKpiLinks(objective.objectiveId, objective.linkedKpiIds, validKpiIds, "invalid-objective-kpi-link"));
  if (!objective.governanceReference) errors.push(`missing-governance-reference:${objective.objectiveId}`);
  if (!lifecycleStates.has(objective.lifecycleState)) errors.push(`invalid-lifecycle:${objective.objectiveId}`);
  if (!objective.metadata.metadataOnly || !objective.metadata.immutable) errors.push(`invalid-objective-metadata:${objective.objectiveId}`);
  if (!objective.metadataOnly || !objective.immutable) errors.push(`invalid-objective-entry-metadata:${objective.objectiveId}`);

  return Object.freeze(errors);
}

function validateKeyResult(keyResult: ExecutiveKeyResult, registry: ExecutiveOkrDefinitionRegistry, validKpiIds: ReadonlySet<string>, validObjectiveIds: ReadonlySet<string>): readonly string[] {
  const errors: string[] = [];
  const keyResultCategories = new Set(registry.keyResultCategories);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (!keyResult.keyResultId) errors.push("missing-key-result-id");
  if (!keyResult.keyResultName) errors.push(`missing-key-result-name:${keyResult.keyResultId}`);
  if (!keyResult.keyResultDescription) errors.push(`missing-key-result-description:${keyResult.keyResultId}`);
  if (!keyResultCategories.has(keyResult.keyResultCategory)) errors.push(`invalid-key-result-category:${keyResult.keyResultId}`);
  if (!validObjectiveIds.has(keyResult.parentObjectiveId)) errors.push(`invalid-parent-objective:${keyResult.keyResultId}`);
  errors.push(...validateKpiLinks(keyResult.keyResultId, keyResult.linkedKpiIds, validKpiIds, "invalid-key-result-kpi-link"));
  if (!keyResult.measurementMetadata.valueFree || !keyResult.measurementMetadata.metadataOnly) errors.push(`invalid-measurement-metadata:${keyResult.keyResultId}`);
  if (!keyResult.targetReference) errors.push(`missing-target-reference:${keyResult.keyResultId}`);
  if (!keyResult.businessDomain) errors.push(`missing-business-domain:${keyResult.keyResultId}`);
  if (!keyResult.owner.metadataOnly) errors.push(`invalid-key-result-owner:${keyResult.keyResultId}`);
  if (!keyResult.reviewCadence) errors.push(`missing-review-cadence:${keyResult.keyResultId}`);
  if (!keyResult.governanceReference) errors.push(`missing-governance-reference:${keyResult.keyResultId}`);
  if (!lifecycleStates.has(keyResult.lifecycleState)) errors.push(`invalid-lifecycle:${keyResult.keyResultId}`);
  if (!keyResult.metadata.metadataOnly || !keyResult.metadata.immutable) errors.push(`invalid-key-result-metadata:${keyResult.keyResultId}`);
  if (!keyResult.metadataOnly || !keyResult.immutable) errors.push(`invalid-key-result-entry-metadata:${keyResult.keyResultId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveOkrDefinitionRegistry): readonly string[] {
  const errors: string[] = [];
  const validObjectiveIds = new Set(registry.objectives.map((objective) => objective.objectiveId));
  const validKeyResultIds = new Set(registry.keyResults.map((keyResult) => keyResult.keyResultId));
  const validKpiIds = new Set(registry.kpiLinkageIds);

  if (registry.platformId !== "BUS-14") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive OKR Definition Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-13") errors.push("invalid-foundation-platform");
  if (registry.kpiFreezeDependency !== "BUS-12") errors.push("invalid-kpi-freeze-dependency");
  if (registry.objectives.length === 0) errors.push("missing-objectives");
  if (registry.keyResults.length === 0) errors.push("missing-key-results");
  if (registry.objectiveCategories.length === 0) errors.push("missing-objective-categories");
  if (registry.keyResultCategories.length === 0) errors.push("missing-key-result-categories");
  if (registry.strategicHorizons.length === 0) errors.push("missing-strategic-horizons");
  if (registry.lifecycleStates.length === 0) errors.push("missing-lifecycle-states");
  if (registry.kpiLinkageIds.length === 0) errors.push("missing-kpi-linkage-ids");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.objectives.map((objective) => objective.objectiveId)).map((id) => `duplicate-objective-id:${id}`));
  errors.push(...duplicateValues(registry.keyResults.map((keyResult) => keyResult.keyResultId)).map((id) => `duplicate-key-result-id:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const objective of registry.objectives) {
    errors.push(...validateObjective(objective, registry, validKpiIds, validKeyResultIds));
  }
  for (const keyResult of registry.keyResults) {
    errors.push(...validateKeyResult(keyResult, registry, validKpiIds, validObjectiveIds));
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveOkrDefinitionManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-14") errors.push("invalid-manifest-platform");
  if (manifest.foundationPlatformId !== "BUS-13") errors.push("invalid-manifest-foundation");
  if (manifest.kpiFreezeDependency !== "BUS-12") errors.push("invalid-manifest-kpi-freeze");
  if (!manifest.foundationAvailable) errors.push("foundation-unavailable");
  if (!manifest.kpiFreezeAvailable) errors.push("kpi-freeze-unavailable");
  if (manifest.objectiveCount === 0) errors.push("missing-manifest-objectives");
  if (manifest.keyResultCount === 0) errors.push("missing-manifest-key-results");
  if (manifest.objectiveCategoryCount === 0) errors.push("missing-manifest-objective-categories");
  if (manifest.keyResultCategoryCount === 0) errors.push("missing-manifest-key-result-categories");
  if (manifest.strategicHorizonCount === 0) errors.push("missing-manifest-strategic-horizons");
  if (manifest.lifecycleStateCount === 0) errors.push("missing-manifest-lifecycle-states");
  if (manifest.kpiLinkageCount === 0) errors.push("missing-manifest-kpi-linkages");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Definition Platform Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveOkrDefinitions(
  registry: ExecutiveOkrDefinitionRegistry = EXECUTIVE_OKR_DEFINITION_REGISTRY,
  manifest: ExecutiveOkrDefinitionManifest = getExecutiveOkrDefinitionManifest()
): ExecutiveOkrDefinitionValidation {
  const errors = Object.freeze([
    ...(manifest.foundationAvailable ? [] : ["foundation-validation-failed"]),
    ...(manifest.kpiFreezeAvailable ? [] : ["kpi-freeze-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);
  return result(errors);
}
