/**
 * APP-4:13 — Executive Memory Platform Certification manifest builder.
 */

import {
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_STATUS,
  EXECUTIVE_MEMORY_PLATFORM_DOCUMENTATION_FILES,
  EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY,
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TEST_FILES,
  EXECUTIVE_MEMORY_PLATFORM_READINESS_STATUS,
} from "./executiveMemoryPlatformCertificationConstants.ts";
import type { ExecutiveMemoryPlatformCertificationManifest } from "./executiveMemoryPlatformCertificationTypes.ts";

function buildArchitectureHash(contractVersions: Readonly<Record<string, string>>): string {
  const payload = Object.entries(contractVersions)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([phaseId, version]) => `${phaseId}:${version}`)
    .join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (hash * 31 + payload.charCodeAt(index)) >>> 0;
  }
  return `arch-${hash.toString(16)}`;
}

export function buildExecutiveMemoryPlatformCertificationManifest(
  certificationDate: string
): ExecutiveMemoryPlatformCertificationManifest {
  const contractVersions = Object.freeze(
    Object.fromEntries(
      EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY.map((phase) => [phase.phaseId, phase.contractVersion])
    )
  );

  return Object.freeze({
    certificationVersion: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    platformStatus: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_STATUS,
    readinessStatus: EXECUTIVE_MEMORY_PLATFORM_READINESS_STATUS,
    certificationDate,
    certifiedPhases: Object.freeze(EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY.map((phase) => phase.phaseId)),
    certifiedModules: Object.freeze(
      EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY.map((phase) => `${phase.phaseId}:${phase.title}`)
    ),
    contractVersions,
    certificationTestFiles: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TEST_FILES,
    documentationFiles: EXECUTIVE_MEMORY_PLATFORM_DOCUMENTATION_FILES,
    architectureHash: buildArchitectureHash(contractVersions),
    metadataOnly: true as const,
    readOnly: true as const,
  });
}

export const ExecutiveMemoryPlatformCertificationManifestBuilder = Object.freeze({
  buildExecutiveMemoryPlatformCertificationManifest,
});
