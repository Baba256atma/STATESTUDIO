/**
 * DKL-1:8 — Freeze Manifest.
 *
 * One canonical, immutable, metadata-only freeze manifest aggregating the freeze
 * registry counts, the compatibility declarations, and the lock registry into a
 * single deep-frozen release descriptor. Metadata only — no runtime behavior.
 */

import { DataKnowledgeFoundationFreezeCompatibility } from "./dataKnowledgeFoundationFreezeCompatibility.ts";
import { DataKnowledgeFoundationFreezeLocks } from "./dataKnowledgeFoundationFreezeLocks.ts";
import { DataKnowledgeFoundationFreezeRegistry } from "./dataKnowledgeFoundationFreezeRegistry.ts";
import type { FreezeManifestDescriptor } from "./dataKnowledgeFoundationFreezeTypes.ts";

export const DataKnowledgeFoundationFreezeManifest = Object.freeze({
  freezeId: "DKL-1:8",
  name: "Data Knowledge Foundation Freeze",
  namespace: "nexora.dkl.foundation.freeze",
  version: "1.0.0",
  frozenPhases: DataKnowledgeFoundationFreezeRegistry.frozenPhaseCount,
  frozenApiCount: DataKnowledgeFoundationFreezeRegistry.frozenPublicApiCount,
  frozenModelCount: DataKnowledgeFoundationFreezeRegistry.frozenModelCount,
  frozenRegistryCount: DataKnowledgeFoundationFreezeRegistry.frozenRegistryComponentCount,
  frozenValidationCount: DataKnowledgeFoundationFreezeRegistry.frozenValidationRuleCount,
  frozenPlatformCount: DataKnowledgeFoundationFreezeRegistry.frozenPlatformSectionCount,
  frozenCertificationCount: DataKnowledgeFoundationFreezeRegistry.frozenCertificationGateCount,
  compatibility: DataKnowledgeFoundationFreezeCompatibility,
  locks: DataKnowledgeFoundationFreezeLocks,
  freezeStatus: "FROZEN",
  stability: "STABLE",
  readiness: "ReadyForPublicIndex",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies FreezeManifestDescriptor);
