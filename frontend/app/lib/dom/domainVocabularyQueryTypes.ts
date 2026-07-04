import type {
  DomainTermId,
  DomainVocabularyEntry,
  DomainVocabularyId,
  DomainVocabularyRegistry,
  DomainVocabularyScope,
  DomainVocabularyStatus,
  RegisteredDomainVocabulary,
} from "./domainVocabularyIndex.ts";
import type { DomainId } from "./domainFoundationIndex.ts";

export type DomainVocabularySortKey = "vocabularyId" | "domainId" | "registrationOrder";

export type DomainVocabularySortDirection = "asc" | "desc";

export type DomainVocabularyFilter = Readonly<{
  domainId?: DomainId;
  scope?: DomainVocabularyScope;
  status?: DomainVocabularyStatus;
  termId?: DomainTermId;
}>;

export type DomainVocabularyQuery = Readonly<{
  filter?: DomainVocabularyFilter;
  sortKey?: DomainVocabularySortKey;
  direction?: DomainVocabularySortDirection;
}>;

export type DomainTermQuery = Readonly<{
  domainId?: DomainId;
  scope?: DomainVocabularyScope;
  status?: DomainVocabularyStatus;
  termId?: DomainTermId;
}>;

export type DomainTermLookupResult = Readonly<{
  found: boolean;
  vocabulary: RegisteredDomainVocabulary | null;
  term: DomainVocabularyEntry | null;
}>;

export type DomainSynonymResolutionResult = Readonly<{
  resolved: boolean;
  synonym: string;
  normalizedSynonym: string;
  vocabulary: RegisteredDomainVocabulary | null;
  term: DomainVocabularyEntry | null;
}>;

export type DomainVocabularySnapshotEntry = Readonly<{
  vocabularyId: DomainVocabularyId;
  domainId: DomainId;
  registrationOrder: number;
  status: DomainVocabularyStatus;
  termIds: readonly DomainTermId[];
  termCount: number;
  fingerprint: string;
}>;

export type DomainVocabularySnapshot = Readonly<{
  contractVersion: DomainVocabularyRegistry["contractVersion"];
  registryId: string;
  frozen: boolean;
  vocabularyCount: number;
  entries: readonly DomainVocabularySnapshotEntry[];
  fingerprint: string;
}>;

export type DomainVocabularyDiffType = "added" | "removed" | "modified";

export type DomainVocabularyDiffEntry = Readonly<{
  type: DomainVocabularyDiffType;
  vocabularyId: DomainVocabularyId;
  left: DomainVocabularySnapshotEntry | null;
  right: DomainVocabularySnapshotEntry | null;
}>;

export type DomainVocabularyDiff = Readonly<{
  equal: boolean;
  leftFingerprint: string;
  rightFingerprint: string;
  entries: readonly DomainVocabularyDiffEntry[];
}>;
