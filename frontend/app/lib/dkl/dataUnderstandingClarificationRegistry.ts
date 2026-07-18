/**
 * DKL-3:2 — Clarification Registry.
 *
 * Registers clarification types, statuses, resolution states, ownership, and
 * policies as immutable registry metadata. No clarification engine.
 *
 * Ownership: owned exclusively by DKL-3:2.
 */

import { DataUnderstandingContracts } from "./dataUnderstandingFoundation.ts";
import type {
  ClarificationResolutionRegistryEntry,
  ClarificationResolutionState,
  ClarificationStatusRegistryEntry,
  ClarificationType,
  ClarificationTypeRegistryEntry,
  RegistryEntryIdentity,
} from "./dataUnderstandingRegistryTypes.ts";
import type { ClarificationStatus } from "./dataUnderstandingFoundationTypes.ts";

const OWNER = "DKL-3 Data Understanding Platform";
const SOURCE_PHASE = "DKL-3:2";

const toKebab = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const makeIdentity = (
  kind: RegistryEntryIdentity["registryEntryKind"],
  prefix: string,
  name: string,
): RegistryEntryIdentity =>
  Object.freeze({
    registryEntryId: `${prefix}-${toKebab(name)}`,
    registryEntryKind: kind,
    registryEntryName: name,
    owner: OWNER,
    sourcePhase: SOURCE_PHASE,
    metadataOnly: true as const,
    immutable: true as const,
  });

const CLARIFICATION_TYPES: readonly ClarificationType[] = Object.freeze([
  "ColumnMeaning",
  "DatasetPurpose",
  "AmbiguousFormat",
  "ConflictingEvidence",
  "MissingContext",
  "RelationshipConfirmation",
]);

const TYPE_DESCRIPTIONS: Readonly<Record<ClarificationType, string>> = Object.freeze({
  ColumnMeaning: "The provisional meaning of a selected column requires confirmation.",
  DatasetPurpose: "The overall purpose of the dataset requires confirmation.",
  AmbiguousFormat: "A value format admits multiple plausible interpretations.",
  ConflictingEvidence: "Evidence items support incompatible interpretations.",
  MissingContext: "Required source or organizational context is absent.",
  RelationshipConfirmation: "A hinted relationship between subjects requires confirmation.",
});

const RESOLUTION_STATES: readonly ClarificationResolutionState[] = Object.freeze([
  "Unresolved",
  "ResolvedByUser",
  "ResolvedByPolicy",
  "DismissedWithoutResolution",
]);

const TERMINAL_RESOLUTIONS: readonly ClarificationResolutionState[] = Object.freeze([
  "ResolvedByUser",
  "ResolvedByPolicy",
  "DismissedWithoutResolution",
]);

const TYPE_ENTRIES: readonly ClarificationTypeRegistryEntry[] = Object.freeze(
  CLARIFICATION_TYPES.map((clarificationType) =>
    Object.freeze({
      identity: makeIdentity("ClarificationType", "du-clarification-type", clarificationType),
      clarificationType,
      description: TYPE_DESCRIPTIONS[clarificationType],
    }),
  ),
);

const STATUS_ENTRIES: readonly ClarificationStatusRegistryEntry[] = Object.freeze(
  DataUnderstandingContracts.clarificationStatuses.map((clarificationStatus: ClarificationStatus) =>
    Object.freeze({
      identity: makeIdentity(
        "ClarificationStatus",
        "du-clarification-status",
        clarificationStatus,
      ),
      clarificationStatus,
    }),
  ),
);

const RESOLUTION_ENTRIES: readonly ClarificationResolutionRegistryEntry[] = Object.freeze(
  RESOLUTION_STATES.map((resolutionState) =>
    Object.freeze({
      identity: makeIdentity(
        "ClarificationResolutionState",
        "du-clarification-resolution",
        resolutionState,
      ),
      resolutionState,
      terminal: TERMINAL_RESOLUTIONS.includes(resolutionState),
    }),
  ),
);

/** Canonical immutable clarification registry. */
export const DataUnderstandingClarificationRegistry = Object.freeze({
  kind: "ClarificationRegistry",
  clarificationTypes: TYPE_ENTRIES,
  clarificationTypeCount: TYPE_ENTRIES.length,
  clarificationStatuses: STATUS_ENTRIES,
  clarificationStatusCount: STATUS_ENTRIES.length,
  resolutionStates: RESOLUTION_ENTRIES,
  resolutionStateCount: RESOLUTION_ENTRIES.length,
  policies: Object.freeze({
    requireClarificationForBlockingAmbiguity:
      DataUnderstandingContracts.processingPolicies.requireClarificationForBlockingAmbiguity,
    preserveAmbiguity: DataUnderstandingContracts.processingPolicies.preserveAmbiguity,
    clarificationEngineForbidden: true,
    uiRenderingForbidden: true,
  }),
  owner: OWNER,
  sourcePhase: SOURCE_PHASE,
  metadataOnly: true,
  immutable: true,
});
