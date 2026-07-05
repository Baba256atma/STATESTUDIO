import { buildBusinessSuiteArchitectureManifest } from "./businessSuiteArchitectureIndex.ts";
import { buildBusinessSuiteBoundaryManifest, validateBusinessSuiteBoundary } from "./businessSuiteBoundaryIndex.ts";
import { buildBusinessSuiteDependencyManifest, validateBusinessSuiteDependencyMap } from "./businessSuiteDependencyIndex.ts";
import { buildBusinessSuiteApiPolicyManifest, validateBusinessSuiteApiPolicy } from "./businessSuiteApiPolicyIndex.ts";
import { buildBusinessSuiteRoadmapManifest } from "./businessSuiteRoadmapManifest.ts";
import type { BusinessSuiteRoadmapManifest, BusinessSuiteRoadmapValidation } from "./businessSuiteRoadmapTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): BusinessSuiteRoadmapValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

export function validateBusinessSuiteRoadmap(
  manifest: BusinessSuiteRoadmapManifest = buildBusinessSuiteRoadmapManifest()
): BusinessSuiteRoadmapValidation {
  const errors: string[] = [];
  const rebuilt = buildBusinessSuiteRoadmapManifest();
  const boundaryManifest = buildBusinessSuiteBoundaryManifest();
  const knownPlatformIds = new Set(boundaryManifest.platformBoundaryCatalog.map((boundary) => boundary.platformId));
  const waveIds = new Set(manifest.implementationWaves.map((wave) => wave.waveId));
  const milestoneIds = new Set(manifest.milestoneCatalog.map((milestone) => milestone.milestoneId));
  const releaseIds = new Set(manifest.releaseGroups.map((release) => release.releaseId));

  if (manifest.architectureId !== "BUS-ARCH") errors.push("invalid-architecture-id");
  if (manifest.roadmapVersion !== "1.0.0") errors.push("invalid-roadmap-version");
  if (!manifest.metadata.metadataOnly || !manifest.metadata.immutable) errors.push("invalid-roadmap-metadata");
  if (manifest.deterministicFingerprint !== rebuilt.deterministicFingerprint) errors.push("manifest-not-deterministic");
  if (buildBusinessSuiteArchitectureManifest().metadata.architectureId !== "BUS-ARCH") errors.push("bus-arch-1-incompatible");
  if (!validateBusinessSuiteBoundary().valid) errors.push("bus-arch-2-incompatible");
  if (!validateBusinessSuiteDependencyMap().valid) errors.push("bus-arch-3-incompatible");
  if (!validateBusinessSuiteApiPolicy().valid) errors.push("bus-arch-4-incompatible");
  if (buildBusinessSuiteDependencyManifest().dependencyCatalog.length === 0) errors.push("bus-arch-3-missing-dependencies");
  if (buildBusinessSuiteApiPolicyManifest().publicApiCatalog.length === 0) errors.push("bus-arch-4-missing-public-apis");

  errors.push(...duplicateValues(manifest.milestoneCatalog.map((milestone) => milestone.milestoneId)).map((id) => `duplicate-milestone:${id}`));
  errors.push(...duplicateValues(manifest.platformPriorityCatalog.map((priority) => priority.platformId)).map((id) => `duplicate-priority:${id}`));
  errors.push(...duplicateValues(manifest.releaseGroups.map((release) => release.releaseId)).map((id) => `duplicate-release:${id}`));
  errors.push(...duplicateValues(manifest.certificationStages.map((stage) => stage.stageId)).map((id) => `duplicate-certification-stage:${id}`));
  errors.push(...duplicateValues(manifest.futureExpansionCatalog.map((expansion) => expansion.expansionId)).map((id) => `duplicate-expansion:${id}`));

  for (let index = 0; index < manifest.implementationWaves.length; index += 1) {
    if (manifest.implementationWaves[index]?.order !== index + 1) errors.push(`invalid-wave-order:${manifest.implementationWaves[index]?.waveId ?? index}`);
  }
  for (let index = 0; index < manifest.certificationStages.length; index += 1) {
    if (manifest.certificationStages[index]?.order !== index + 1) errors.push(`invalid-certification-order:${manifest.certificationStages[index]?.stageId ?? index}`);
  }
  for (const milestone of manifest.milestoneCatalog) {
    if (!waveIds.has(milestone.implementationWaveId)) errors.push(`unknown-milestone-wave:${milestone.milestoneId}`);
    if (!milestone.targetPlatformIds.every((platformId) => knownPlatformIds.has(platformId))) errors.push(`unknown-milestone-platform:${milestone.milestoneId}`);
    if (!milestone.prerequisites.every((prerequisite) => prerequisite.startsWith("BUS-ARCH-") || milestoneIds.has(prerequisite))) {
      errors.push(`unknown-milestone-prerequisite:${milestone.milestoneId}`);
    }
    if (!milestone.metadataOnly || !milestone.immutable) errors.push(`invalid-milestone:${milestone.milestoneId}`);
  }
  for (const priority of manifest.platformPriorityCatalog) {
    if (!knownPlatformIds.has(priority.platformId)) errors.push(`unknown-priority-platform:${priority.priorityId}`);
    if (!priority.metadataOnly || !priority.immutable) errors.push(`invalid-priority:${priority.priorityId}`);
  }
  for (const release of manifest.releaseGroups) {
    if (!release.includedPlatformIds.every((platformId) => knownPlatformIds.has(platformId))) errors.push(`unknown-release-platform:${release.releaseId}`);
    if (!release.dependencyRequirements.every((dependency) => dependency.startsWith("BUS-ARCH-") || releaseIds.has(dependency))) {
      errors.push(`unknown-release-dependency:${release.releaseId}`);
    }
    if (release.certificationRequirements.length === 0 || release.compatibilityRequirements.length === 0) errors.push(`incomplete-release:${release.releaseId}`);
    if (!release.metadataOnly || !release.immutable) errors.push(`invalid-release:${release.releaseId}`);
  }
  for (const stage of manifest.certificationStages) {
    if (!stage.metadataOnly || !stage.immutable) errors.push(`invalid-certification-stage:${stage.stageId}`);
  }
  for (const expansion of manifest.futureExpansionCatalog) {
    if (!waveIds.has(expansion.targetWaveId)) errors.push(`unknown-expansion-wave:${expansion.expansionId}`);
    if (!expansion.targetPlatformIds.every((platformId) => knownPlatformIds.has(platformId))) errors.push(`unknown-expansion-platform:${expansion.expansionId}`);
    if (!expansion.prerequisites.every((prerequisite) => milestoneIds.has(prerequisite))) errors.push(`unknown-expansion-prerequisite:${expansion.expansionId}`);
    if (!expansion.metadataOnly || !expansion.immutable) errors.push(`invalid-expansion:${expansion.expansionId}`);
  }

  return result(errors);
}
