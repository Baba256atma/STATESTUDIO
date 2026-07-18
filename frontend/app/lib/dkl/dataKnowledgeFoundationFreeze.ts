/**
 * DKL-1:8 — Data Knowledge Foundation Freeze.
 *
 * The single canonical, immutable, metadata-only freeze platform for the
 * complete Nexora Data Knowledge Foundation (DKL-1:1 → DKL-1:7). It aggregates —
 * by reference — the freeze registry, the compatibility declarations, the lock
 * registry, the freeze manifest, and a deterministic summary. It declares the
 * DKL Foundation immutable and ready for public release.
 *
 * Zero runtime behavior: no I/O, no network, no filesystem, no database,
 * no parsing, no reflection, no dynamic import, no async, no side effects.
 * It introduces no new architecture and modifies no earlier phase.
 */

import { DataKnowledgeFoundationFreezeCompatibility } from "./dataKnowledgeFoundationFreezeCompatibility.ts";
import { DataKnowledgeFoundationFreezeLocks } from "./dataKnowledgeFoundationFreezeLocks.ts";
import { DataKnowledgeFoundationFreezeManifest } from "./dataKnowledgeFoundationFreezeManifest.ts";
import { DataKnowledgeFoundationFreezeRegistry } from "./dataKnowledgeFoundationFreezeRegistry.ts";
import type {
  DataKnowledgeFoundationFreezeDescriptor,
  FreezeLockDescriptor,
  FreezeSummaryDescriptor,
} from "./dataKnowledgeFoundationFreezeTypes.ts";

const compatibilityCount = [
  DataKnowledgeFoundationFreezeCompatibility.foundationCompatible,
  DataKnowledgeFoundationFreezeCompatibility.registryCompatible,
  DataKnowledgeFoundationFreezeCompatibility.modelCompatible,
  DataKnowledgeFoundationFreezeCompatibility.validationCompatible,
  DataKnowledgeFoundationFreezeCompatibility.manifestCompatible,
  DataKnowledgeFoundationFreezeCompatibility.platformCompatible,
  DataKnowledgeFoundationFreezeCompatibility.certificationCompatible,
].filter((compatible) => compatible === true).length;

const SUMMARY: FreezeSummaryDescriptor = Object.freeze({
  freezeId: "DKL-1:8",
  frozenPhases: DataKnowledgeFoundationFreezeRegistry.frozenPhaseCount,
  frozenApis: DataKnowledgeFoundationFreezeRegistry.frozenPublicApiCount,
  lockCount: DataKnowledgeFoundationFreezeLocks.length,
  compatibilityCount,
  freezeStatus: "FROZEN",
  readiness: "ReadyForPublicIndex",
  stability: "STABLE",
  metadataOnly: true,
  immutable: true,
});

export const DataKnowledgeFoundationFreeze = Object.freeze({
  registry: DataKnowledgeFoundationFreezeRegistry,
  compatibility: DataKnowledgeFoundationFreezeCompatibility,
  locks: DataKnowledgeFoundationFreezeLocks,
  manifest: DataKnowledgeFoundationFreezeManifest,
  summary: SUMMARY,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataKnowledgeFoundationFreezeDescriptor);

export const getDataKnowledgeFoundationFreeze = (): DataKnowledgeFoundationFreezeDescriptor =>
  DataKnowledgeFoundationFreeze;

export const getDataKnowledgeFoundationFreezeSummary = (): FreezeSummaryDescriptor => SUMMARY;

export const getDataKnowledgeFoundationFreezeLockById = (
  id: string
): FreezeLockDescriptor | undefined =>
  DataKnowledgeFoundationFreezeLocks.find((lock) => lock.id === id);
