export type {
  DomainSynonymResolutionResult,
  DomainTermLookupResult,
  DomainTermQuery,
  DomainVocabularyDiff,
  DomainVocabularyDiffEntry,
  DomainVocabularyDiffType,
  DomainVocabularyFilter,
  DomainVocabularyQuery,
  DomainVocabularySnapshot,
  DomainVocabularySnapshotEntry,
  DomainVocabularySortDirection,
  DomainVocabularySortKey,
} from "./domainVocabularyQueryTypes.ts";
export {
  filterDomainVocabularies,
  findVocabulariesByDomain,
  findVocabulariesByScope,
  findVocabulariesByStatus,
  findVocabularyContainingTerm,
  queryDomainVocabularies,
  sortDomainVocabularies,
} from "./domainVocabularyQuery.ts";
export {
  findDomainTerm,
  findTermsByDomain,
  findTermsByScope,
  findTermsByStatus,
  resolveDomainSynonym,
} from "./domainTermLookup.ts";
export {
  buildDomainVocabularySnapshot,
  compareDomainVocabularySnapshots,
  diffDomainVocabularySnapshots,
  validateDomainVocabularySnapshot,
} from "./domainVocabularySnapshot.ts";

import {
  findDomainTerm,
  findTermsByDomain,
  findTermsByScope,
  findTermsByStatus,
  resolveDomainSynonym,
} from "./domainTermLookup.ts";
import {
  filterDomainVocabularies,
  findVocabulariesByDomain,
  findVocabulariesByScope,
  findVocabulariesByStatus,
  findVocabularyContainingTerm,
  queryDomainVocabularies,
  sortDomainVocabularies,
} from "./domainVocabularyQuery.ts";
import {
  buildDomainVocabularySnapshot,
  compareDomainVocabularySnapshots,
  diffDomainVocabularySnapshots,
  validateDomainVocabularySnapshot,
} from "./domainVocabularySnapshot.ts";

export const DomainVocabularyQueryLayer = Object.freeze({
  queryDomainVocabularies,
  filterDomainVocabularies,
  sortDomainVocabularies,
  findVocabulariesByDomain,
  findVocabulariesByScope,
  findVocabulariesByStatus,
  findVocabularyContainingTerm,
  findDomainTerm,
  findTermsByDomain,
  findTermsByScope,
  findTermsByStatus,
  resolveDomainSynonym,
  buildDomainVocabularySnapshot,
  validateDomainVocabularySnapshot,
  compareDomainVocabularySnapshots,
  diffDomainVocabularySnapshots,
});
