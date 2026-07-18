/**
 * DKL-3:2 — Understanding Subject Registry.
 *
 * Registers the seven DKL-3:1 understanding subject kinds as immutable
 * registry metadata. Registry only. No interpretation.
 *
 * Ownership: owned exclusively by DKL-3:2.
 */

import { DataUnderstandingContracts } from "./dataUnderstandingFoundation.ts";
import type {
  RegistryEntryIdentity,
  UnderstandingSubjectRegistryEntry,
} from "./dataUnderstandingRegistryTypes.ts";
import type { UnderstandingSubjectKind } from "./dataUnderstandingFoundationTypes.ts";

const OWNER = "DKL-3 Data Understanding Platform";
const SOURCE_PHASE = "DKL-3:2";

const toKebab = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const identity = (subjectKind: UnderstandingSubjectKind): RegistryEntryIdentity =>
  Object.freeze({
    registryEntryId: `du-subject-${toKebab(subjectKind)}`,
    registryEntryKind: "UnderstandingSubject" as const,
    registryEntryName: subjectKind,
    owner: OWNER,
    sourcePhase: SOURCE_PHASE,
    metadataOnly: true as const,
    immutable: true as const,
  });

const DESCRIPTIONS: Readonly<Record<UnderstandingSubjectKind, string>> = Object.freeze({
  Dataset: "The whole dataset as a single understanding subject.",
  Column: "One selected column projected from the parser preview.",
  ValuePattern: "A recurring value pattern observed within preview scope.",
  RowStructure: "The structural shape of preview rows.",
  RelationshipHint: "A potential structural relationship between subjects.",
  SourceContext: "The registered DKL-2 source, connector, and content context.",
  DiagnosticContext: "Parser diagnostic context carried by the intake package.",
});

const ENTRIES: readonly UnderstandingSubjectRegistryEntry[] = Object.freeze(
  DataUnderstandingContracts.subjectKinds.map((subjectKind) =>
    Object.freeze({
      identity: identity(subjectKind),
      subjectKind,
      description: DESCRIPTIONS[subjectKind],
    }),
  ),
);

/** Canonical immutable understanding-subject registry. */
export const DataUnderstandingSubjectRegistry = Object.freeze({
  kind: "UnderstandingSubjectRegistry",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  owner: OWNER,
  sourcePhase: SOURCE_PHASE,
  metadataOnly: true,
  immutable: true,
});
