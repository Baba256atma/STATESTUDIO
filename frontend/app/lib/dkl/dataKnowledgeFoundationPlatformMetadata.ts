/**
 * DKL-1:6 — Platform Metadata.
 *
 * Immutable identity, certification, and guarantee metadata for the DKL
 * Foundation platform. Metadata only — no runtime behavior.
 */

import type { DataKnowledgePlatformMetadataDescriptor } from "./dataKnowledgeFoundationPlatformTypes.ts";

export const DataKnowledgeFoundationPlatformMetadata = Object.freeze({
  platformId: "DKL-1:6",
  name: "Data Knowledge Foundation Platform",
  namespace: "nexora.dkl.foundation.platform",
  version: "1.0.0",
  stability: "STABLE",
  certification: "CERTIFIED",
  buildStatus: "CERTIFIED",
  readiness: "ReadyForCertification",
  guarantees: Object.freeze({
    metadataOnly: true,
    runtimeFree: true,
    deepFrozen: true,
    deterministic: true,
    publicApiStable: true,
    manifestDriven: true,
    ownershipProtected: true,
    dependencyProtected: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const satisfies DataKnowledgePlatformMetadataDescriptor);
