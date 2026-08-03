import {
  ExecutiveTimelineExperienceRegistryAllEntries,
  ExecutiveTimelineExperienceRegistryCatalogues,
  lookupExecutiveTimelineExperienceRegistryEntry,
} from "./executiveTimelineExperienceRegistryCatalogues.ts";
import type { ExecutiveTimelineExperienceRegistryValidationRule } from "./executiveTimelineExperienceRegistryTypes.ts";

const EXPECTED_COUNTS = Object.freeze({
  EventTypes: 12,
  NavigationModes: 8,
  MarkerTypes: 10,
  PlaybackStates: 6,
  SynchronizationModes: 6,
  ViewModes: 8,
  InteractionTypes: 10,
  ReadinessStates: 5,
} as const);

const rule = (
  name:
    | "UniqueIdentifiers"
    | "UniqueNames"
    | "DeterministicOrdering"
    | "ImmutableCollections"
    | "FailClosedLookup"
    | "NoDuplicateAliases"
    | "CanonicalNaming"
    | "RegistryCompleteness"
    | "CatalogueIntegrity"
    | "MetadataConsistency",
  order: number,
  statement: string,
): ExecutiveTimelineExperienceRegistryValidationRule =>
  Object.freeze({
    ruleId: `EX-3:2/Validation/${name}`,
    name,
    order,
    statement,
    result: "Pass" as const,
    failClosed: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const ids = ExecutiveTimelineExperienceRegistryAllEntries.map(
  (entry) => entry.entryId,
);
const names = ExecutiveTimelineExperienceRegistryAllEntries.map(
  (entry) => entry.name,
);
const aliases = ExecutiveTimelineExperienceRegistryAllEntries.flatMap(
  (entry) => entry.aliases,
);

const uniqueIds = new Set(ids).size === ids.length;
const uniqueNames = new Set(names).size === names.length;
const deterministicOrdering = ExecutiveTimelineExperienceRegistryCatalogues.every(
  (catalogue) =>
    catalogue.entries.every((entry, index) => entry.order === index + 1)
    && catalogue.order
      === ExecutiveTimelineExperienceRegistryCatalogues.indexOf(catalogue) + 1,
);
const immutableCollections =
  Object.isFrozen(ExecutiveTimelineExperienceRegistryCatalogues)
  && ExecutiveTimelineExperienceRegistryCatalogues.every(
    (catalogue) =>
      Object.isFrozen(catalogue)
      && Object.isFrozen(catalogue.entries)
      && catalogue.entries.every((entry) => Object.isFrozen(entry)),
  );
const failClosedLookup =
  lookupExecutiveTimelineExperienceRegistryEntry(null) === null
  && lookupExecutiveTimelineExperienceRegistryEntry("") === null
  && lookupExecutiveTimelineExperienceRegistryEntry(" Unknown ") === null
  && lookupExecutiveTimelineExperienceRegistryEntry("WorkspaceChanged")
    !== null;
const noDuplicateAliases = new Set(aliases).size === aliases.length
  && aliases.every((alias) => !names.includes(alias) && !ids.includes(alias));
const canonicalNaming = ExecutiveTimelineExperienceRegistryAllEntries.every(
  (entry) =>
    /^EX-3:2\/[A-Za-z]+\/[A-Za-z][A-Za-z0-9]*$/.test(entry.entryId)
    && /^[A-Z][A-Za-z0-9]*$/.test(entry.name),
);
const registryCompleteness =
  ExecutiveTimelineExperienceRegistryCatalogues.length === 8
  && ExecutiveTimelineExperienceRegistryAllEntries.length === 65;
const catalogueIntegrity = ExecutiveTimelineExperienceRegistryCatalogues.every(
  (catalogue) =>
    catalogue.entryCount === EXPECTED_COUNTS[catalogue.kind]
    && catalogue.entries.length === catalogue.entryCount
    && catalogue.entries.every(
      (entry) => entry.catalogueKind === catalogue.kind,
    ),
);
const metadataConsistency =
  ExecutiveTimelineExperienceRegistryAllEntries.every(
    (entry) =>
      entry.metadataOnly === true
      && entry.immutable === true
      && entry.entryId.endsWith(`/${entry.name}`),
  );

const checks = Object.freeze({
  UniqueIdentifiers: uniqueIds,
  UniqueNames: uniqueNames,
  DeterministicOrdering: deterministicOrdering,
  ImmutableCollections: immutableCollections,
  FailClosedLookup: failClosedLookup,
  NoDuplicateAliases: noDuplicateAliases,
  CanonicalNaming: canonicalNaming,
  RegistryCompleteness: registryCompleteness,
  CatalogueIntegrity: catalogueIntegrity,
  MetadataConsistency: metadataConsistency,
} as const);

export const ExecutiveTimelineExperienceRegistryValidationRules =
  Object.freeze([
    rule("UniqueIdentifiers", 1, "Every registry entry identifier is unique."),
    rule("UniqueNames", 2, "Every registry entry name is unique."),
    rule(
      "DeterministicOrdering",
      3,
      "Catalogue and entry order values are contiguous and deterministic.",
    ),
    rule(
      "ImmutableCollections",
      4,
      "All catalogues and entries are frozen immutable collections.",
    ),
    rule(
      "FailClosedLookup",
      5,
      "Unknown or malformed lookups return null without repair.",
    ),
    rule(
      "NoDuplicateAliases",
      6,
      "Aliases do not collide with names, identifiers, or other aliases.",
    ),
    rule(
      "CanonicalNaming",
      7,
      "Entry identifiers and names follow canonical Timeline Registry naming.",
    ),
    rule(
      "RegistryCompleteness",
      8,
      "Exactly eight catalogues and sixty-five registered entries are present.",
    ),
    rule(
      "CatalogueIntegrity",
      9,
      "Each catalogue entry count and kind membership remain exact.",
    ),
    rule(
      "MetadataConsistency",
      10,
      "Every entry remains metadata-only, immutable, and self-consistent.",
    ),
  ] as const);

for (const validationRule of ExecutiveTimelineExperienceRegistryValidationRules) {
  if (!checks[validationRule.name]) {
    throw new Error(
      `EX-3:2 Registry validation failed: ${validationRule.name}`,
    );
  }
}

export const ExecutiveTimelineExperienceRegistryValidation = Object.freeze({
  validationId: "EX-3:2/ExecutiveTimelineExperienceRegistryValidation" as const,
  rules: ExecutiveTimelineExperienceRegistryValidationRules,
  ruleCount: 10 as const,
  allPassed: true as const,
  failClosed: true as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
});
