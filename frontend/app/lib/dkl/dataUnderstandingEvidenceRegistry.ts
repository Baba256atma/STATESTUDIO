/**
 * DKL-3:2 — Evidence Registry.
 *
 * Registers every DKL-3:1 evidence category with limitations, ownership,
 * deterministic identifiers, and static priority tiers. Never calculates
 * evidence.
 *
 * Ownership: owned exclusively by DKL-3:2.
 */

import { DataUnderstandingEvidenceCatalog } from "./dataUnderstandingFoundation.ts";
import type {
  EvidenceCategoryRegistryEntry,
  EvidencePriorityTier,
  RegistryEntryIdentity,
} from "./dataUnderstandingRegistryTypes.ts";
import type { EvidenceCategory } from "./dataUnderstandingFoundationTypes.ts";

const OWNER = "DKL-3 Data Understanding Platform";
const SOURCE_PHASE = "DKL-3:2";

const toKebab = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const identity = (category: EvidenceCategory): RegistryEntryIdentity =>
  Object.freeze({
    registryEntryId: `du-evidence-${toKebab(category)}`,
    registryEntryKind: "EvidenceCategory" as const,
    registryEntryName: category,
    owner: OWNER,
    sourcePhase: SOURCE_PHASE,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Static, declared priority tiers. Registry metadata — not computed scores. */
const PRIORITY_TIERS: Readonly<Record<EvidenceCategory, EvidencePriorityTier>> = Object.freeze({
  HeaderName: "Primary",
  PrimitiveType: "Primary",
  SampleValues: "Primary",
  UserSelection: "Primary",
  UserConfirmation: "Primary",
  ValueDistribution: "Secondary",
  NullPattern: "Secondary",
  UniquenessPattern: "Secondary",
  FormatPattern: "Secondary",
  CrossColumnPattern: "Secondary",
  SourceRegistry: "Contextual",
  ConnectorContext: "Contextual",
  ContentTypeContext: "Contextual",
  DatasetName: "Contextual",
  ParserDiagnostic: "Contextual",
});

const PRIORITY_TIER_ORDER: readonly EvidencePriorityTier[] = Object.freeze([
  "Primary",
  "Secondary",
  "Contextual",
]);

const ENTRIES: readonly EvidenceCategoryRegistryEntry[] = Object.freeze(
  DataUnderstandingEvidenceCatalog.entries.map((entry) =>
    Object.freeze({
      identity: identity(entry.category),
      category: entry.category,
      description: entry.description,
      limitationsRequired: true as const,
      exampleLimitation: entry.exampleLimitation,
      priorityTier: PRIORITY_TIERS[entry.category],
    }),
  ),
);

/** Canonical immutable evidence registry. */
export const DataUnderstandingEvidenceRegistry = Object.freeze({
  kind: "EvidenceRegistry",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  priorityTiers: PRIORITY_TIER_ORDER,
  priorityTierCount: PRIORITY_TIER_ORDER.length,
  strengths: DataUnderstandingEvidenceCatalog.strengths,
  limitationsRequired: true,
  evidenceNeverCalculatedHere: true,
  owner: OWNER,
  sourcePhase: SOURCE_PHASE,
  metadataOnly: true,
  immutable: true,
});
