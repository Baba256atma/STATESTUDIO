/**
 * DKL-1:5 — Data Knowledge Foundation Manifest.
 *
 * The single authoritative, immutable, metadata-only architectural inventory of
 * the DKL Foundation. It aggregates the official public metadata of DKL-1:1
 * through DKL-1:4 into one deep-frozen manifest and exposes deterministic
 * accessors.
 *
 * Zero runtime behavior: no I/O, no network, no filesystem, no database,
 * no parsing, no reflection, no dynamic import, no async, no side effects.
 * It introduces no new architecture and modifies no earlier phase.
 */

import { DataKnowledgeFoundationCompatibilityManifest } from "./dataKnowledgeFoundationCompatibilityManifest.ts";
import { DataKnowledgeFoundationDependencyManifest } from "./dataKnowledgeFoundationDependencyManifest.ts";
import { DataKnowledgeFoundationInventoryManifest } from "./dataKnowledgeFoundationInventoryManifest.ts";
import type {
  DataKnowledgeFoundationManifestDescriptor,
  DataKnowledgeFoundationManifestSummary,
  DataKnowledgeManifestMetadataDescriptor,
  DataKnowledgeManifestReleaseDescriptor,
  PhaseManifestEntry,
} from "./dataKnowledgeFoundationManifestTypes.ts";
import { DataKnowledgeFoundationPhaseManifest } from "./dataKnowledgeFoundationPhaseManifest.ts";

const phases = DataKnowledgeFoundationPhaseManifest.phases;

const RELEASE: DataKnowledgeManifestReleaseDescriptor = Object.freeze({
  manifestId: "DKL-1:5",
  name: "Data Knowledge Foundation Manifest",
  namespace: "nexora.dkl.foundation.manifest",
  version: "1.0.0",
  buildStatus: "CERTIFIED",
  stability: "STABLE",
  certification: "CERTIFIED",
  readiness: "ReadyForPlatform",
  metadataOnly: true,
  immutable: true,
});

const METADATA: DataKnowledgeManifestMetadataDescriptor = Object.freeze({
  manifestId: "DKL-1:5",
  sourcePhases: Object.freeze(["DKL-1:1", "DKL-1:2", "DKL-1:3", "DKL-1:4"] as const),
  authoritative: true,
  metadataOnly: true,
  runtimeFree: true,
  deterministic: true,
  immutable: true,
});

export const DataKnowledgeFoundationManifest = Object.freeze({
  foundation: phases[0],
  registry: phases[1],
  model: phases[2],
  validation: phases[3],
  phases: DataKnowledgeFoundationPhaseManifest,
  inventory: DataKnowledgeFoundationInventoryManifest,
  dependencies: DataKnowledgeFoundationDependencyManifest,
  compatibility: DataKnowledgeFoundationCompatibilityManifest,
  release: RELEASE,
  metadata: METADATA,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataKnowledgeFoundationManifestDescriptor);

export {
  DataKnowledgeFoundationPhaseManifest,
  DataKnowledgeFoundationInventoryManifest,
  DataKnowledgeFoundationDependencyManifest,
  DataKnowledgeFoundationCompatibilityManifest,
};

const SUMMARY: DataKnowledgeFoundationManifestSummary = Object.freeze({
  manifestId: "DKL-1:5",
  version: "1.0.0",
  totalPhases: DataKnowledgeFoundationPhaseManifest.phaseCount,
  totalPublicApis: DataKnowledgeFoundationInventoryManifest.publicApis.total,
  totalModels: DataKnowledgeFoundationInventoryManifest.models.registeredModelCount,
  totalRegistryComponents: DataKnowledgeFoundationInventoryManifest.registry.components,
  totalValidationRules: DataKnowledgeFoundationInventoryManifest.validation.rules,
  certification: "CERTIFIED",
  readiness: "ReadyForPlatform",
  metadataOnly: true,
  immutable: true,
});

export const getDataKnowledgeFoundationManifest = (): DataKnowledgeFoundationManifestDescriptor =>
  DataKnowledgeFoundationManifest;

export const getDataKnowledgeFoundationManifestSummary = (): DataKnowledgeFoundationManifestSummary =>
  SUMMARY;

export const getDataKnowledgeFoundationPhaseById = (
  id: string
): PhaseManifestEntry | undefined => phases.find((entry) => entry.id === id);
