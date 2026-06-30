/**
 * SMM-4 — Snapshot & Version Platform manifest.
 */

import {
  SMM_SNAPSHOT_CONTRACT_VERSION,
  SMM_SNAPSHOT_PLATFORM_ID,
  SMM_SNAPSHOT_PLATFORM_NAME,
  SMM_SNAPSHOT_REGISTRY_KEYS,
} from "./sharedMentalModelSnapshotContracts.ts";
import type {
  SharedMentalModelSnapshotPlatformManifest,
  SharedMentalModelSnapshotRegistryBundle,
} from "./sharedMentalModelSnapshotTypes.ts";
import {
  getDefaultSnapshotCompatibility,
  validateSharedMentalModelSnapshotPlatformManifest,
  validateSharedMentalModelSnapshotRegistry,
} from "./sharedMentalModelSnapshotValidation.ts";

export function getSharedMentalModelSnapshotManifest(
  registry: SharedMentalModelSnapshotRegistryBundle
): SharedMentalModelSnapshotPlatformManifest {
  const validation = validateSharedMentalModelSnapshotRegistry(registry);
  const manifest = Object.freeze({
    manifestId: "smm-snapshot-version-platform-manifest",
    platformId: SMM_SNAPSHOT_PLATFORM_ID,
    version: SMM_SNAPSHOT_CONTRACT_VERSION,
    title: SMM_SNAPSHOT_PLATFORM_NAME,
    goal: "Immutable snapshot creation, version lineage, and deterministic model evolution metadata.",
    registryKeys: SMM_SNAPSHOT_REGISTRY_KEYS,
    snapshotCount: registry.snapshotCount,
    versionCount: registry.versionCount,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultSnapshotCompatibility(),
    readOnly: true as const,
  });
  const manifestValidation = validateSharedMentalModelSnapshotPlatformManifest(manifest);
  return Object.freeze({
    ...manifest,
    validationResult: validation.valid && manifestValidation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
