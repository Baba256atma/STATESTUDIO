import { getExecutiveKpiPlatformFreezeState } from "./executiveKpiPlatformFreezeIndex.ts";
import { getExecutiveOkrPlatformManifest } from "./executiveOkrPlatform.ts";
import {
  listExecutiveKeyResults,
  listExecutiveObjectives,
} from "./executiveOkrDefinitionPlatform.ts";
import { EXECUTIVE_OKR_ALIGNMENT_REGISTRY } from "./executiveOkrAlignmentRegistry.ts";
import type { ExecutiveOkrAlignmentManifest } from "./executiveOkrAlignmentTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-15-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveOkrAlignmentManifest(): ExecutiveOkrAlignmentManifest {
  const foundation = getExecutiveOkrPlatformManifest();
  const objectiveCount = listExecutiveObjectives().length;
  const keyResultCount = listExecutiveKeyResults().length;
  const kpiFreeze = getExecutiveKpiPlatformFreezeState();
  const registry = EXECUTIVE_OKR_ALIGNMENT_REGISTRY;
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    foundation.deterministicFingerprint,
    `${objectiveCount}:${keyResultCount}`,
    kpiFreeze.manifest.deterministicFingerprint,
    ...registry.alignments
      .map((alignment) => `${alignment.alignmentId}:${alignment.sourceObjectiveId}:${alignment.targetObjectiveId}:${alignment.keyResultId}:${alignment.alignmentCategory}:${alignment.dependencyType}:${alignment.lifecycleState}`)
      .sort(),
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: registry.platformId,
    platformName: registry.platformName,
    version: registry.version,
    foundationPlatformId: foundation.platformId,
    definitionPlatformId: registry.definitionPlatformId,
    kpiFreezeDependency: registry.kpiFreezeDependency,
    foundationAvailable: foundation.kpiFreezeAvailable,
    definitionsAvailable: objectiveCount > 0 && keyResultCount > 0,
    kpiFreezeAvailable: kpiFreeze.status === "PASS" && kpiFreeze.finalState === "Certified Frozen Released",
    alignmentCount: registry.alignments.length,
    categoryCount: registry.categories.length,
    strengthLevelCount: registry.strengthLevels.length,
    dependencyTypeCount: registry.dependencyTypes.length,
    strategicThemeCount: registry.strategicThemes.length,
    lifecycleStateCount: registry.lifecycleStates.length,
    publicApis: registry.publicApis,
    certificationStatus: "Alignment Platform Certified",
    deterministicFingerprint,
  });
}
