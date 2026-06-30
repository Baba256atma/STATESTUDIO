/**
 * KNL-15 — Knowledge Platform Freeze manifest generation.
 */

import {
  EXTENSION_POLICY_KEYS,
  FREEZE_DEPENDENCY_KEYS,
  KNOWLEDGE_PLATFORM_CERTIFICATION_SUMMARY,
  KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE,
  KNOWLEDGE_PLATFORM_FREEZE_OWNER,
  KNOWLEDGE_PLATFORM_GOVERNANCE_SUMMARY,
  KNOWLEDGE_PLATFORM_LAYER_ID,
  KNOWLEDGE_PLATFORM_RELEASE_TAG,
  KNOWLEDGE_PLATFORM_RELEASE_VERSION,
  KNOWLEDGE_PLATFORM_ROOT_ID,
  KNOWLEDGE_PLATFORM_ROOT_NAME,
  KNL_FROZEN_PHASE_TARGETS,
} from "./knowledgePlatformFreezeCatalog.ts";
import { buildKnowledgePlatformCompatibilityMatrix } from "./knowledgePlatformFreezeCompatibility.ts";
import type {
  ExtensionPolicy,
  FreezeManifest,
  FreezeMetadata,
  PlatformIdentity,
  PlatformRegistry,
  PlatformRegistryEntry,
  ReleaseMetadata,
  ReleaseTag,
} from "./knowledgePlatformFreezeTypes.ts";

function createMetadata(metadataId: string, timestamp: string): FreezeMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
    namespace: KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE,
    owner: KNOWLEDGE_PLATFORM_FREEZE_OWNER,
    extensions: Object.freeze({ release: KNOWLEDGE_PLATFORM_RELEASE_VERSION }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

function buildExtensionPolicies(): readonly ExtensionPolicy[] {
  return Object.freeze(
    EXTENSION_POLICY_KEYS.map((policyKey) =>
      Object.freeze({
        policyId: `extension-policy-${policyKey}`,
        policyKey,
        label: policyKey,
        description: `${policyKey} extension policy for frozen KNL platform.`,
        enforced: true as const,
        readOnly: true as const,
      })
    )
  );
}

function buildPlatformRegistry(): PlatformRegistry {
  const entries: PlatformRegistryEntry[] = KNL_FROZEN_PHASE_TARGETS.map((target) =>
    Object.freeze({
      registryEntryId: `platform-registry-${target.key}`,
      phaseKey: target.key,
      phaseId: target.phaseId,
      platformId: target.platformId,
      label: target.label,
      frozen: true as const,
      readOnly: true as const,
    })
  );

  return Object.freeze({
    registryId: "knowledge-platform-registry",
    entries: Object.freeze(entries),
    contractVersion: KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildKnowledgePlatformFreezeManifest(timestamp: string): FreezeManifest {
  const platformIdentity: PlatformIdentity = Object.freeze({
    platformId: KNOWLEDGE_PLATFORM_ROOT_ID,
    platformName: KNOWLEDGE_PLATFORM_ROOT_NAME,
    layerId: KNOWLEDGE_PLATFORM_LAYER_ID,
    releaseVersion: KNOWLEDGE_PLATFORM_RELEASE_VERSION,
    readOnly: true as const,
  });

  const releaseMetadata: ReleaseMetadata = Object.freeze({
    releaseId: "knowledge-platform-release",
    releaseVersion: KNOWLEDGE_PLATFORM_RELEASE_VERSION,
    releaseTag: KNOWLEDGE_PLATFORM_RELEASE_TAG,
    releaseDate: timestamp,
    status: "released",
    contractVersion: KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
    metadata: createMetadata("release-metadata-root", timestamp),
    readOnly: true as const,
  });

  const releaseTag: ReleaseTag = Object.freeze({
    tagId: "knowledge-platform-release-tag",
    tag: KNOWLEDGE_PLATFORM_RELEASE_TAG,
    label: KNOWLEDGE_PLATFORM_RELEASE_TAG,
    description: "Official frozen release tag for Nexora Knowledge Platform.",
    readOnly: true as const,
  });

  return Object.freeze({
    manifestId: "knowledge-platform-freeze-manifest",
    platformIdentity,
    releaseMetadata,
    releaseTag,
    certifiedPhases: Object.freeze(
      KNL_FROZEN_PHASE_TARGETS.map((target) =>
        Object.freeze({
          phaseKey: target.key,
          phaseId: target.phaseId,
          platformId: target.platformId,
          label: target.label,
        })
      )
    ),
    dependencyChain: FREEZE_DEPENDENCY_KEYS,
    compatibilityMatrix: buildKnowledgePlatformCompatibilityMatrix(),
    platformRegistry: buildPlatformRegistry(),
    extensionPolicy: buildExtensionPolicies(),
    governanceSummary: KNOWLEDGE_PLATFORM_GOVERNANCE_SUMMARY,
    certificationSummary: KNOWLEDGE_PLATFORM_CERTIFICATION_SUMMARY,
    contractVersion: KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function getKnowledgePlatformFreezeManifest(timestamp: string = new Date(0).toISOString()): FreezeManifest {
  return buildKnowledgePlatformFreezeManifest(timestamp);
}

export function isFreezeManifestComplete(manifest: FreezeManifest): boolean {
  return (
    manifest.certifiedPhases.length === 14 &&
    manifest.dependencyChain.length === 14 &&
    manifest.compatibilityMatrix.entries.length === 7 &&
    manifest.platformRegistry.entries.length === 14 &&
    manifest.extensionPolicy.length === 4 &&
    manifest.releaseMetadata.status === "released" &&
    manifest.platformIdentity.layerId === "KNL"
  );
}

export const KnowledgePlatformFreezeManifestBuilder = Object.freeze({
  buildKnowledgePlatformFreezeManifest,
  getKnowledgePlatformFreezeManifest,
  isFreezeManifestComplete,
});
