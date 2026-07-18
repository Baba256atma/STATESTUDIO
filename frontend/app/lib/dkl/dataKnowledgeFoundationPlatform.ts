/**
 * DKL-1:6 — Data Knowledge Foundation Platform.
 *
 * The single canonical, immutable, metadata-only platform surface for the DKL
 * Foundation. It aggregates — by reference — the official public artifacts of
 * DKL-1:1 through DKL-1:5 alongside platform metadata, a manifest-driven
 * registry, and a deterministic summary.
 *
 * Zero runtime behavior: no I/O, no network, no filesystem, no database,
 * no parsing, no reflection, no dynamic import, no async, no side effects.
 * It introduces no new architecture and modifies no earlier phase.
 */

import { DataKnowledgeFoundation } from "./dataKnowledgeFoundation.ts";
import { DataKnowledgeFoundationManifest } from "./dataKnowledgeFoundationManifestIndex.ts";
import { DataKnowledgeFoundationModel } from "./dataKnowledgeFoundationModel.ts";
import { DataKnowledgeFoundationPlatformMetadata } from "./dataKnowledgeFoundationPlatformMetadata.ts";
import { DataKnowledgeFoundationPlatformRegistry } from "./dataKnowledgeFoundationPlatformRegistry.ts";
import { DataKnowledgeFoundationPlatformSummary } from "./dataKnowledgeFoundationPlatformSummary.ts";
import type {
  DataKnowledgeFoundationPlatformDescriptor,
  DataKnowledgePlatformMetadataDescriptor,
  DataKnowledgePlatformRegistryDescriptor,
  DataKnowledgePlatformSummaryDescriptor,
} from "./dataKnowledgeFoundationPlatformTypes.ts";
import { DataKnowledgeFoundationRegistry } from "./dataKnowledgeFoundationRegistryIndex.ts";
import { DataKnowledgeFoundationValidation } from "./dataKnowledgeFoundationValidation.ts";

export {
  DataKnowledgeFoundationPlatformMetadata,
  DataKnowledgeFoundationPlatformRegistry,
  DataKnowledgeFoundationPlatformSummary,
};

export const DataKnowledgeFoundationPlatform = Object.freeze({
  metadata: DataKnowledgeFoundationPlatformMetadata,
  registry: DataKnowledgeFoundationPlatformRegistry,
  foundation: DataKnowledgeFoundation,
  registrySection: DataKnowledgeFoundationRegistry,
  model: DataKnowledgeFoundationModel,
  validation: DataKnowledgeFoundationValidation,
  manifest: DataKnowledgeFoundationManifest,
  summary: DataKnowledgeFoundationPlatformSummary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataKnowledgeFoundationPlatformDescriptor);

export const getDataKnowledgeFoundationPlatform = (): DataKnowledgeFoundationPlatformDescriptor =>
  DataKnowledgeFoundationPlatform;

export const getDataKnowledgeFoundationPlatformSummary = (): DataKnowledgePlatformSummaryDescriptor =>
  DataKnowledgeFoundationPlatformSummary;

export const getDataKnowledgeFoundationPlatformMetadata = (): DataKnowledgePlatformMetadataDescriptor =>
  DataKnowledgeFoundationPlatformMetadata;

export const getDataKnowledgeFoundationPlatformRegistry = (): DataKnowledgePlatformRegistryDescriptor =>
  DataKnowledgeFoundationPlatformRegistry;
