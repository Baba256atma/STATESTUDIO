import { BusinessSuiteRoadmapRegistry } from "./businessSuiteRoadmapRegistry.ts";
import type { BusinessSuiteRoadmapManifest } from "./businessSuiteRoadmapTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-arch-5-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildBusinessSuiteRoadmapManifest(): BusinessSuiteRoadmapManifest {
  const registry = BusinessSuiteRoadmapRegistry;
  const deterministicFingerprint = fingerprint([
    registry.metadata.roadmapId,
    registry.metadata.roadmapVersion,
    ...registry.implementationWaveRegistry.map((wave) => `${wave.order}:${wave.waveId}`).sort(),
    ...registry.milestoneRegistry.map((milestone) => `${milestone.implementationWaveId}:${milestone.milestoneId}`).sort(),
    ...registry.platformPriorityRegistry.map((priority) => `${priority.platformId}:${priority.priority}`).sort(),
    ...registry.releaseRegistry.map((release) => `${release.releaseId}:${release.includedPlatformIds.join(",")}`).sort(),
    ...registry.certificationRegistry.map((stage) => `${stage.order}:${stage.stage}`).sort(),
    ...registry.expansionRegistry.map((expansion) => `${expansion.targetWaveId}:${expansion.expansionId}`).sort(),
  ]);

  return Object.freeze({
    architectureId: registry.metadata.architectureId,
    roadmapVersion: registry.metadata.roadmapVersion,
    implementationWaves: registry.implementationWaveRegistry,
    milestoneCatalog: registry.milestoneRegistry,
    platformPriorityCatalog: registry.platformPriorityRegistry,
    releaseGroups: registry.releaseRegistry,
    certificationStages: registry.certificationRegistry,
    futureExpansionCatalog: registry.expansionRegistry,
    metadata: registry.metadata,
    deterministicFingerprint,
  });
}
