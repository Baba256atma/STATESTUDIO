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
import {
  EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
  listExecutiveStrategicRoadmaps,
} from "./executiveStrategicRoadmapIndex.ts";
import { EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY } from "./executiveStrategyAlignmentRegistry.ts";
import type {
  ExecutiveStrategyAlignment,
  ExecutiveStrategyAlignmentManifest,
  ExecutiveStrategyAlignmentRegistry,
  ExecutiveStrategyAlignmentValidation,
} from "./executiveStrategyAlignmentTypes.ts";

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
): ExecutiveStrategyAlignmentValidation {
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([...warnings]),
  });
}

function validateAlignment(
  alignment: ExecutiveStrategyAlignment,
  strategyIds: ReadonlySet<string>,
  themeIds: ReadonlySet<string>,
  objectiveIds: ReadonlySet<string>,
  initiativeIds: ReadonlySet<string>,
  roadmapIds: ReadonlySet<string>,
  evidenceIds: ReadonlySet<string>,
  constraintIds: ReadonlySet<string>,
  dependencyIds: ReadonlySet<string>
): readonly string[] {
  const errors: string[] = [];

  if (!alignment.identity.alignmentId) errors.push("missing-alignment-id");
  if (!alignment.identity.alignmentKey) errors.push(`missing-alignment-key:${alignment.identity.alignmentId}`);
  if (!alignment.name.displayName) errors.push(`missing-alignment-name:${alignment.identity.alignmentId}`);
  if (!alignment.description) errors.push(`missing-alignment-description:${alignment.identity.alignmentId}`);
  if (!alignment.scope.scopeStatement) errors.push(`missing-alignment-scope:${alignment.identity.alignmentId}`);
  if (!alignment.purpose.purposeStatement) errors.push(`missing-alignment-purpose:${alignment.identity.alignmentId}`);
  if (!alignment.context.contextStatement) errors.push(`missing-alignment-context:${alignment.identity.alignmentId}`);
  if (alignment.stakeholders.length === 0) errors.push(`missing-alignment-stakeholders:${alignment.identity.alignmentId}`);
  if (alignment.evidence.length === 0) errors.push(`missing-alignment-evidence:${alignment.identity.alignmentId}`);
  if (alignment.constraints.length === 0) errors.push(`missing-alignment-constraints:${alignment.identity.alignmentId}`);
  if (alignment.risks.length === 0) errors.push(`missing-alignment-risks:${alignment.identity.alignmentId}`);
  if (alignment.dependencies.length === 0) errors.push(`missing-alignment-dependencies:${alignment.identity.alignmentId}`);
  if (alignment.kpiReferences.length === 0) errors.push(`missing-kpi-references:${alignment.identity.alignmentId}`);
  if (alignment.okrReferences.length === 0) errors.push(`missing-okr-references:${alignment.identity.alignmentId}`);
  if (!alignment.strategyReferenceIds.every((id) => strategyIds.has(id))) {
    errors.push(`invalid-strategy-reference:${alignment.identity.alignmentId}`);
  }
  if (!alignment.themeReferenceIds.every((id) => themeIds.has(id))) {
    errors.push(`invalid-theme-reference:${alignment.identity.alignmentId}`);
  }
  if (!alignment.objectiveReferenceIds.every((id) => objectiveIds.has(id))) {
    errors.push(`invalid-objective-reference:${alignment.identity.alignmentId}`);
  }
  if (!alignment.initiativeReferenceIds.every((id) => initiativeIds.has(id))) {
    errors.push(`invalid-initiative-reference:${alignment.identity.alignmentId}`);
  }
  if (!alignment.roadmapReferenceIds.every((id) => roadmapIds.has(id))) {
    errors.push(`invalid-roadmap-reference:${alignment.identity.alignmentId}`);
  }
  if (!alignment.evidence.every((item) => evidenceIds.has(item.evidenceId))) {
    errors.push(`invalid-evidence-reference:${alignment.identity.alignmentId}`);
  }
  if (!alignment.constraints.every((item) => constraintIds.has(item.constraintId))) {
    errors.push(`invalid-constraint-reference:${alignment.identity.alignmentId}`);
  }
  if (!alignment.dependencies.every((item) => dependencyIds.has(item.dependencyId))) {
    errors.push(`invalid-dependency-reference:${alignment.identity.alignmentId}`);
  }
  if (!alignment.metadata.metadataOnly || !alignment.metadata.immutable) {
    errors.push(`invalid-alignment-metadata:${alignment.identity.alignmentId}`);
  }
  if (!alignment.version.versionLabel) errors.push(`missing-alignment-version:${alignment.identity.alignmentId}`);
  if (!alignment.metadataOnly || !alignment.immutable) {
    errors.push(`invalid-alignment-entry-metadata:${alignment.identity.alignmentId}`);
  }

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveStrategyAlignmentRegistry): readonly string[] {
  const errors: string[] = [];
  const strategyIds = new Set(listExecutiveStrategyDefinitions().map((definition) => definition.identity.strategyId));
  const themeIds = new Set(listExecutiveStrategicThemes().map((theme) => theme.identity.themeId));
  const objectiveIds = new Set(listExecutiveStrategicObjectives().map((objective) => objective.identity.objectiveId));
  const initiativeIds = new Set(listExecutiveStrategicInitiatives().map((initiative) => initiative.identity.initiativeId));
  const roadmapIds = new Set(listExecutiveStrategicRoadmaps().map((roadmap) => roadmap.identity.roadmapId));
  const evidenceIds = new Set(registry.evidence.map((item) => item.evidenceId));
  const constraintIds = new Set(registry.constraints.map((item) => item.constraintId));
  const dependencyIds = new Set(registry.dependencies.map((item) => item.dependencyId));

  if (registry.platformId !== "BUS-23") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive Strategy Alignment Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-17") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-18") errors.push("invalid-definition-platform");
  if (registry.themePlatformId !== "BUS-19") errors.push("invalid-theme-platform");
  if (registry.objectivePlatformId !== "BUS-20") errors.push("invalid-objective-platform");
  if (registry.initiativePlatformId !== "BUS-21") errors.push("invalid-initiative-platform");
  if (registry.roadmapPlatformId !== "BUS-22") errors.push("invalid-roadmap-platform");
  if (registry.kpiFreezeDependency !== "BUS-12") errors.push("invalid-kpi-freeze-dependency");
  if (registry.okrFreezeDependency !== "BUS-16") errors.push("invalid-okr-freeze-dependency");
  if (registry.alignments.length === 0) errors.push("missing-alignments");
  if (registry.alignmentTypes.length === 0) errors.push("missing-alignment-types");
  if (registry.alignmentStatuses.length === 0) errors.push("missing-alignment-statuses");
  if (registry.priorities.length === 0) errors.push("missing-priorities");
  if (registry.lifecycles.length === 0) errors.push("missing-lifecycles");
  if (registry.evidence.length === 0) errors.push("missing-evidence");
  if (registry.constraints.length === 0) errors.push("missing-constraints");
  if (registry.dependencies.length === 0) errors.push("missing-dependencies");
  if (registry.owners.length === 0) errors.push("missing-owners");
  if (registry.versions.length === 0) errors.push("missing-versions");
  if (registry.relationships.length === 0) errors.push("missing-relationships");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (
    registry.extensionPolicy.alignmentMutationAllowed ||
    registry.extensionPolicy.runtimeExecutionAllowed ||
    registry.extensionPolicy.scoringAllowed ||
    registry.extensionPolicy.monitoringAllowed ||
    registry.extensionPolicy.simulationAllowed ||
    registry.extensionPolicy.businessLogicAllowed
  ) {
    errors.push("invalid-extension-policy");
  }
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.alignments.map((item) => item.identity.alignmentId)).map((id) => `duplicate-alignment-id:${id}`));
  errors.push(...duplicateValues(registry.relationships.map((item) => item.relationshipId)).map((id) => `duplicate-relationship-id:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));
  errors.push(...duplicateValues(registry.versions.map((item) => item.versionId)).map((id) => `duplicate-version-id:${id}`));
  errors.push(...duplicateValues(registry.evidence.map((item) => item.evidenceId)).map((id) => `duplicate-evidence-id:${id}`));
  errors.push(...duplicateValues(registry.constraints.map((item) => item.constraintId)).map((id) => `duplicate-constraint-id:${id}`));
  errors.push(...duplicateValues(registry.dependencies.map((item) => item.dependencyId)).map((id) => `duplicate-dependency-id:${id}`));

  for (const alignment of registry.alignments) {
    errors.push(...validateAlignment(alignment, strategyIds, themeIds, objectiveIds, initiativeIds, roadmapIds, evidenceIds, constraintIds, dependencyIds));
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

function validateManifest(manifest: ExecutiveStrategyAlignmentManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-23") errors.push("invalid-manifest-platform-id");
  if (manifest.foundationPlatformId !== "BUS-17") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-18") errors.push("invalid-manifest-definition");
  if (manifest.themePlatformId !== "BUS-19") errors.push("invalid-manifest-theme-platform");
  if (manifest.objectivePlatformId !== "BUS-20") errors.push("invalid-manifest-objective-platform");
  if (manifest.initiativePlatformId !== "BUS-21") errors.push("invalid-manifest-initiative-platform");
  if (manifest.roadmapPlatformId !== "BUS-22") errors.push("invalid-manifest-roadmap-platform");
  if (!manifest.strategyFoundationAvailable) errors.push("strategy-foundation-unavailable");
  if (!manifest.strategyDefinitionsAvailable) errors.push("strategy-definitions-unavailable");
  if (!manifest.strategicThemesAvailable) errors.push("strategic-themes-unavailable");
  if (!manifest.strategicObjectivesAvailable) errors.push("strategic-objectives-unavailable");
  if (!manifest.strategicInitiativesAvailable) errors.push("strategic-initiatives-unavailable");
  if (!manifest.strategicRoadmapsAvailable) errors.push("strategic-roadmaps-unavailable");
  if (!manifest.kpiFreezeAvailable) errors.push("kpi-freeze-unavailable");
  if (!manifest.okrFreezeAvailable) errors.push("okr-freeze-unavailable");
  if (manifest.alignmentCount === 0) errors.push("missing-manifest-alignments");
  if (manifest.relationshipCount === 0) errors.push("missing-manifest-relationships");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.versionCount === 0) errors.push("missing-manifest-versions");
  if (manifest.certificationStatus !== "Strategy Alignment Platform Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveStrategyAlignment(
  registry: ExecutiveStrategyAlignmentRegistry = EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY,
  manifest?: ExecutiveStrategyAlignmentManifest
): ExecutiveStrategyAlignmentValidation {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
  const strategicObjectives = listExecutiveStrategicObjectives();
  const strategicInitiatives = listExecutiveStrategicInitiatives();
  const strategicRoadmaps = listExecutiveStrategicRoadmaps();
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
    ...(
      EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.platformId === "BUS-22" &&
      strategicRoadmaps.length > 0 &&
      EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS.length > 0
        ? []
        : ["strategic-roadmap-validation-failed"]
    ),
    ...(kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["kpi-platform-freeze-validation-failed"]),
    ...(okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" ? [] : ["okr-platform-freeze-validation-failed"]),
    ...validateRegistry(registry),
    ...(manifest ? validateManifest(manifest) : []),
  ]);
  return result(errors);
}
