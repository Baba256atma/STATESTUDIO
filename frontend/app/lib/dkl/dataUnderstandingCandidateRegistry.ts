/**
 * DKL-3:2 — Candidate Registry.
 *
 * Registers every DKL-3:1 candidate type and candidate status as immutable
 * registry metadata. No inference. No candidate generation.
 *
 * Ownership: owned exclusively by DKL-3:2.
 */

import { DataUnderstandingContracts } from "./dataUnderstandingFoundation.ts";
import type {
  CandidateStatusRegistryEntry,
  CandidateTypeRegistryEntry,
  RegistryEntryIdentity,
} from "./dataUnderstandingRegistryTypes.ts";
import type {
  UnderstandingCandidateStatus,
  UnderstandingCandidateType,
  UnderstandingConfidenceLevel,
} from "./dataUnderstandingFoundationTypes.ts";
import type { ConfidenceLevelRegistryEntry } from "./dataUnderstandingRegistryTypes.ts";

const OWNER = "DKL-3 Data Understanding Platform";
const SOURCE_PHASE = "DKL-3:2";

const toKebab = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const typeIdentity = (candidateType: UnderstandingCandidateType): RegistryEntryIdentity =>
  Object.freeze({
    registryEntryId: `du-candidate-type-${toKebab(candidateType)}`,
    registryEntryKind: "CandidateType" as const,
    registryEntryName: candidateType,
    owner: OWNER,
    sourcePhase: SOURCE_PHASE,
    metadataOnly: true as const,
    immutable: true as const,
  });

const statusIdentity = (status: UnderstandingCandidateStatus): RegistryEntryIdentity =>
  Object.freeze({
    registryEntryId: `du-candidate-status-${toKebab(status)}`,
    registryEntryKind: "CandidateStatus" as const,
    registryEntryName: status,
    owner: OWNER,
    sourcePhase: SOURCE_PHASE,
    metadataOnly: true as const,
    immutable: true as const,
  });

const confidenceIdentity = (level: UnderstandingConfidenceLevel): RegistryEntryIdentity =>
  Object.freeze({
    registryEntryId: `du-confidence-${toKebab(level)}`,
    registryEntryKind: "ConfidenceLevel" as const,
    registryEntryName: level,
    owner: OWNER,
    sourcePhase: SOURCE_PHASE,
    metadataOnly: true as const,
    immutable: true as const,
  });

const TYPE_ENTRIES: readonly CandidateTypeRegistryEntry[] = Object.freeze(
  DataUnderstandingContracts.candidateTypes.map((candidateType) =>
    Object.freeze({
      identity: typeIdentity(candidateType),
      candidateType,
      provisional: true as const,
      isBusinessObject: false as const,
    }),
  ),
);

const STATUS_ENTRIES: readonly CandidateStatusRegistryEntry[] = Object.freeze(
  DataUnderstandingContracts.candidateStatuses.map((candidateStatus) =>
    Object.freeze({
      identity: statusIdentity(candidateStatus),
      candidateStatus,
    }),
  ),
);

const CONFIDENCE_ENTRIES: readonly ConfidenceLevelRegistryEntry[] = Object.freeze(
  DataUnderstandingContracts.confidenceLevels.map((confidenceLevel, ordinal) =>
    Object.freeze({
      identity: confidenceIdentity(confidenceLevel),
      confidenceLevel,
      ordinal,
      guaranteedTruth: false as const,
    }),
  ),
);

/** Canonical immutable candidate registry (types, statuses, confidence). */
export const DataUnderstandingCandidateRegistry = Object.freeze({
  kind: "CandidateRegistry",
  candidateTypes: TYPE_ENTRIES,
  candidateTypeCount: TYPE_ENTRIES.length,
  candidateStatuses: STATUS_ENTRIES,
  candidateStatusCount: STATUS_ENTRIES.length,
  confidenceLevels: CONFIDENCE_ENTRIES,
  confidenceLevelCount: CONFIDENCE_ENTRIES.length,
  candidatesAreNotBusinessObjects: true,
  noInferencePerformed: true,
  owner: OWNER,
  sourcePhase: SOURCE_PHASE,
  metadataOnly: true,
  immutable: true,
});
