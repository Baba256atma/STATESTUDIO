/**
 * DKL-3:8 — Data Understanding Freeze Summary.
 *
 * Immutable freeze summary totals. Deterministic metadata only.
 *
 * Ownership: owned exclusively by DKL-3:8.
 */

import { DataUnderstandingFreezeRegistry } from "./dataUnderstandingFreezeRegistry.ts";
import { DataUnderstandingFreezeCompatibility } from "./dataUnderstandingFreezeCompatibility.ts";
import { DataUnderstandingFreezeLocks } from "./dataUnderstandingFreezeLocks.ts";
import { DataUnderstandingFreezeManifest } from "./dataUnderstandingFreezeManifest.ts";
import {
  DATA_UNDERSTANDING_FREEZE_IDENTITY,
  DATA_UNDERSTANDING_FREEZE_VERSION,
} from "./dataUnderstandingFreezeRegistry.ts";

/** Canonical immutable freeze summary. */
export const DataUnderstandingFreezeSummary = Object.freeze({
  summaryId: "DKL-3:8/FreezeSummary",
  freezeId: DATA_UNDERSTANDING_FREEZE_IDENTITY.freezeId,
  version: DATA_UNDERSTANDING_FREEZE_VERSION,
  frozenPhases: DataUnderstandingFreezeRegistry.frozenPhaseCount,
  frozenApis: DataUnderstandingFreezeRegistry.frozenPublicApiCount,
  lockCount: DataUnderstandingFreezeLocks.lockCount,
  compatibilityCount: DataUnderstandingFreezeCompatibility.entryCount,
  componentCount: DataUnderstandingFreezeRegistry.componentCount,
  dependencyCount: DataUnderstandingFreezeManifest.counts.dependencyCount,
  freezeStatus: "Frozen" as const,
  stability: "Stable" as const,
  readiness: "ReadyForPublicIndex" as const,
  nextPhase: "DKL-3:9 — Data Understanding Public Index",
  blockingIssueCount: 0,
  warningCount: 0,
  metadataOnly: true,
  freezeOnly: true,
  immutable: true,
  deterministic: true,
});
