import { getExecutiveOkrAlignmentManifest } from "./executiveOkrAlignmentManifest.ts";
import { EXECUTIVE_OKR_ALIGNMENT_REGISTRY } from "./executiveOkrAlignmentRegistry.ts";
import type {
  ExecutiveOkrAlignment,
  ExecutiveOkrAlignmentManifest,
  ExecutiveOkrAlignmentRegistry,
  ExecutiveOkrAlignmentValidation,
} from "./executiveOkrAlignmentTypes.ts";
import {
  EXECUTIVE_OKR_KPI_LINKAGE_IDS,
  listExecutiveKeyResults,
  listExecutiveObjectives,
} from "./executiveOkrDefinitionPlatform.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveOkrAlignmentValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateAlignment(
  alignment: ExecutiveOkrAlignment,
  registry: ExecutiveOkrAlignmentRegistry,
  validObjectiveIds: ReadonlySet<string>,
  validKeyResultIds: ReadonlySet<string>,
  validKpiIds: ReadonlySet<string>
): readonly string[] {
  const errors: string[] = [];
  const categories = new Set(registry.categories);
  const strengthLevels = new Set(registry.strengthLevels);
  const dependencyTypes = new Set(registry.dependencyTypes);
  const strategicThemes = new Set(registry.strategicThemes);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (!alignment.alignmentId) errors.push("missing-alignment-id");
  if (!alignment.alignmentName) errors.push(`missing-alignment-name:${alignment.alignmentId}`);
  if (!alignment.alignmentDescription) errors.push(`missing-alignment-description:${alignment.alignmentId}`);
  if (!validObjectiveIds.has(alignment.sourceObjectiveId)) errors.push(`invalid-source-objective:${alignment.alignmentId}`);
  if (!validObjectiveIds.has(alignment.targetObjectiveId)) errors.push(`invalid-target-objective:${alignment.alignmentId}`);
  if (!validKeyResultIds.has(alignment.keyResultId)) errors.push(`invalid-key-result:${alignment.alignmentId}`);
  if (alignment.linkedKpiIds.length === 0) errors.push(`missing-kpi-links:${alignment.alignmentId}`);
  for (const kpiId of alignment.linkedKpiIds) {
    if (!validKpiIds.has(kpiId)) errors.push(`invalid-kpi-reference:${alignment.alignmentId}:${kpiId}`);
  }
  if (!strategicThemes.has(alignment.strategicTheme)) errors.push(`invalid-strategic-theme:${alignment.alignmentId}`);
  if (!alignment.initiative) errors.push(`missing-initiative:${alignment.alignmentId}`);
  if (!categories.has(alignment.alignmentCategory)) errors.push(`invalid-category:${alignment.alignmentId}`);
  if (!strengthLevels.has(alignment.alignmentStrength)) errors.push(`invalid-strength:${alignment.alignmentId}`);
  if (!dependencyTypes.has(alignment.dependencyType)) errors.push(`invalid-dependency-type:${alignment.alignmentId}`);
  if (!alignment.businessDomain) errors.push(`missing-business-domain:${alignment.alignmentId}`);
  if (!alignment.executiveOwner) errors.push(`missing-executive-owner:${alignment.alignmentId}`);
  if (!alignment.governanceReference) errors.push(`missing-governance-reference:${alignment.alignmentId}`);
  if (!lifecycleStates.has(alignment.lifecycleState)) errors.push(`invalid-lifecycle:${alignment.alignmentId}`);
  if (!alignment.metadata.metadataOnly || !alignment.metadata.immutable) errors.push(`invalid-alignment-metadata:${alignment.alignmentId}`);
  if (!alignment.metadataOnly || !alignment.immutable) errors.push(`invalid-entry-metadata:${alignment.alignmentId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveOkrAlignmentRegistry): readonly string[] {
  const errors: string[] = [];
  const validObjectiveIds = new Set(listExecutiveObjectives().map((objective) => objective.objectiveId));
  const validKeyResultIds = new Set(listExecutiveKeyResults().map((keyResult) => keyResult.keyResultId));
  const validKpiIds = new Set(EXECUTIVE_OKR_KPI_LINKAGE_IDS);

  if (registry.platformId !== "BUS-15") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive OKR Alignment Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-13") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-14") errors.push("invalid-definition-platform");
  if (registry.kpiFreezeDependency !== "BUS-12") errors.push("invalid-kpi-freeze-dependency");
  if (registry.alignments.length === 0) errors.push("missing-alignments");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.strengthLevels.length === 0) errors.push("missing-strength-levels");
  if (registry.dependencyTypes.length === 0) errors.push("missing-dependency-types");
  if (registry.strategicThemes.length === 0) errors.push("missing-strategic-themes");
  if (registry.lifecycleStates.length === 0) errors.push("missing-lifecycle-states");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.alignments.map((alignment) => alignment.alignmentId)).map((id) => `duplicate-alignment-id:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const alignment of registry.alignments) {
    errors.push(...validateAlignment(alignment, registry, validObjectiveIds, validKeyResultIds, validKpiIds));
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveOkrAlignmentManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-15") errors.push("invalid-manifest-platform");
  if (manifest.foundationPlatformId !== "BUS-13") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-14") errors.push("invalid-manifest-definition");
  if (manifest.kpiFreezeDependency !== "BUS-12") errors.push("invalid-manifest-kpi-freeze");
  if (!manifest.foundationAvailable) errors.push("foundation-unavailable");
  if (!manifest.definitionsAvailable) errors.push("definitions-unavailable");
  if (!manifest.kpiFreezeAvailable) errors.push("kpi-freeze-unavailable");
  if (manifest.alignmentCount === 0) errors.push("missing-manifest-alignments");
  if (manifest.categoryCount === 0) errors.push("missing-manifest-categories");
  if (manifest.strengthLevelCount === 0) errors.push("missing-manifest-strength-levels");
  if (manifest.dependencyTypeCount === 0) errors.push("missing-manifest-dependency-types");
  if (manifest.strategicThemeCount === 0) errors.push("missing-manifest-strategic-themes");
  if (manifest.lifecycleStateCount === 0) errors.push("missing-manifest-lifecycle-states");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Alignment Platform Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveOkrAlignments(
  registry: ExecutiveOkrAlignmentRegistry = EXECUTIVE_OKR_ALIGNMENT_REGISTRY,
  manifest: ExecutiveOkrAlignmentManifest = getExecutiveOkrAlignmentManifest()
): ExecutiveOkrAlignmentValidation {
  const errors = Object.freeze([
    ...(manifest.foundationAvailable ? [] : ["foundation-validation-failed"]),
    ...(manifest.definitionsAvailable ? [] : ["definition-validation-failed"]),
    ...(manifest.kpiFreezeAvailable ? [] : ["kpi-freeze-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);
  return result(errors);
}
