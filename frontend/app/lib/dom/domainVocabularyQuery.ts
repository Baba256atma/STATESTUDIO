import type {
  DomainVocabularyRegistry,
  DomainVocabularyScope,
  DomainVocabularyStatus,
  RegisteredDomainVocabulary,
} from "./domainVocabularyIndex.ts";
import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainVocabularyFilter,
  DomainVocabularyQuery,
  DomainVocabularySortDirection,
  DomainVocabularySortKey,
} from "./domainVocabularyQueryTypes.ts";

function directionMultiplier(direction: DomainVocabularySortDirection): number {
  return direction === "desc" ? -1 : 1;
}

function compareVocabularies(
  left: RegisteredDomainVocabulary,
  right: RegisteredDomainVocabulary,
  sortKey: DomainVocabularySortKey
): number {
  if (sortKey === "domainId") {
    const byDomain = left.package.domainId.localeCompare(right.package.domainId);
    if (byDomain !== 0) return byDomain;
    return left.package.vocabularyId.localeCompare(right.package.vocabularyId);
  }

  if (sortKey === "registrationOrder") {
    const byOrder = left.registrationOrder - right.registrationOrder;
    if (byOrder !== 0) return byOrder;
    return left.package.vocabularyId.localeCompare(right.package.vocabularyId);
  }

  return left.package.vocabularyId.localeCompare(right.package.vocabularyId);
}

function vocabularyMatchesFilter(
  vocabulary: RegisteredDomainVocabulary,
  filter: DomainVocabularyFilter
): boolean {
  if (filter.domainId !== undefined && vocabulary.package.domainId !== filter.domainId) {
    return false;
  }

  if (filter.status !== undefined && vocabulary.package.status !== filter.status) {
    return false;
  }

  if (
    filter.scope !== undefined &&
    !vocabulary.package.terms.some((term) => term.scope === filter.scope)
  ) {
    return false;
  }

  if (
    filter.termId !== undefined &&
    !vocabulary.package.terms.some((term) => term.termId === filter.termId)
  ) {
    return false;
  }

  return true;
}

export function sortDomainVocabularies(
  vocabularies: readonly RegisteredDomainVocabulary[],
  sortKey: DomainVocabularySortKey = "registrationOrder",
  direction: DomainVocabularySortDirection = "asc"
): readonly RegisteredDomainVocabulary[] {
  const multiplier = directionMultiplier(direction);
  return Object.freeze(
    [...vocabularies].sort((left, right) => compareVocabularies(left, right, sortKey) * multiplier)
  );
}

export function filterDomainVocabularies(
  registry: DomainVocabularyRegistry,
  filter: DomainVocabularyFilter
): readonly RegisteredDomainVocabulary[] {
  return Object.freeze(
    registry.vocabularies.filter((vocabulary) => vocabularyMatchesFilter(vocabulary, filter))
  );
}

export function queryDomainVocabularies(
  registry: DomainVocabularyRegistry,
  query: DomainVocabularyQuery = Object.freeze({})
): readonly RegisteredDomainVocabulary[] {
  const filtered = query.filter
    ? filterDomainVocabularies(registry, query.filter)
    : registry.vocabularies;
  return sortDomainVocabularies(filtered, query.sortKey, query.direction);
}

export function findVocabulariesByDomain(
  registry: DomainVocabularyRegistry,
  domainId: DomainId
): readonly RegisteredDomainVocabulary[] {
  return queryDomainVocabularies(registry, {
    filter: Object.freeze({ domainId }),
    sortKey: "registrationOrder",
    direction: "asc",
  });
}

export function findVocabulariesByScope(
  registry: DomainVocabularyRegistry,
  scope: DomainVocabularyScope
): readonly RegisteredDomainVocabulary[] {
  return queryDomainVocabularies(registry, {
    filter: Object.freeze({ scope }),
    sortKey: "registrationOrder",
    direction: "asc",
  });
}

export function findVocabulariesByStatus(
  registry: DomainVocabularyRegistry,
  status: DomainVocabularyStatus
): readonly RegisteredDomainVocabulary[] {
  return queryDomainVocabularies(registry, {
    filter: Object.freeze({ status }),
    sortKey: "registrationOrder",
    direction: "asc",
  });
}

export function findVocabularyContainingTerm(
  registry: DomainVocabularyRegistry,
  termId: string
): RegisteredDomainVocabulary | null {
  return registry.vocabularies.find((vocabulary) =>
    vocabulary.package.terms.some((term) => term.termId === termId)
  ) ?? null;
}
