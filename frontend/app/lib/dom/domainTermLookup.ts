import type {
  DomainTermId,
  DomainVocabularyEntry,
  DomainVocabularyRegistry,
  DomainVocabularyScope,
  DomainVocabularyStatus,
  RegisteredDomainVocabulary,
} from "./domainVocabularyIndex.ts";
import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainSynonymResolutionResult,
  DomainTermLookupResult,
} from "./domainVocabularyQueryTypes.ts";

function normalizeSynonym(value: string): string {
  return value.trim().toLowerCase();
}

function termLookupResult(
  vocabulary: RegisteredDomainVocabulary | null,
  term: DomainVocabularyEntry | null
): DomainTermLookupResult {
  return Object.freeze({
    found: Boolean(vocabulary && term),
    vocabulary,
    term,
  });
}

function termsFromVocabularies(
  vocabularies: readonly RegisteredDomainVocabulary[],
  predicate: (term: DomainVocabularyEntry, vocabulary: RegisteredDomainVocabulary) => boolean
): readonly DomainTermLookupResult[] {
  const results: DomainTermLookupResult[] = [];
  for (const vocabulary of vocabularies) {
    for (const term of vocabulary.package.terms) {
      if (predicate(term, vocabulary)) {
        results.push(termLookupResult(vocabulary, term));
      }
    }
  }
  return Object.freeze(results);
}

export function findDomainTerm(
  registry: DomainVocabularyRegistry,
  termId: DomainTermId
): DomainTermLookupResult {
  for (const vocabulary of registry.vocabularies) {
    const term = vocabulary.package.terms.find((entry) => entry.termId === termId) ?? null;
    if (term) {
      return termLookupResult(vocabulary, term);
    }
  }
  return termLookupResult(null, null);
}

export function findTermsByDomain(
  registry: DomainVocabularyRegistry,
  domainId: DomainId
): readonly DomainTermLookupResult[] {
  return termsFromVocabularies(
    registry.vocabularies.filter((vocabulary) => vocabulary.package.domainId === domainId),
    () => true
  );
}

export function findTermsByScope(
  registry: DomainVocabularyRegistry,
  scope: DomainVocabularyScope
): readonly DomainTermLookupResult[] {
  return termsFromVocabularies(registry.vocabularies, (term) => term.scope === scope);
}

export function findTermsByStatus(
  registry: DomainVocabularyRegistry,
  status: DomainVocabularyStatus
): readonly DomainTermLookupResult[] {
  return termsFromVocabularies(registry.vocabularies, (term) => term.status === status);
}

export function resolveDomainSynonym(
  registry: DomainVocabularyRegistry,
  synonym: string
): DomainSynonymResolutionResult {
  const normalizedSynonym = normalizeSynonym(synonym);
  for (const vocabulary of registry.vocabularies) {
    for (const term of vocabulary.package.terms) {
      if (term.synonyms.some((entry) => entry.normalizedLabel === normalizedSynonym)) {
        return Object.freeze({
          resolved: true,
          synonym,
          normalizedSynonym,
          vocabulary,
          term,
        });
      }
    }
  }

  return Object.freeze({
    resolved: false,
    synonym,
    normalizedSynonym,
    vocabulary: null,
    term: null,
  });
}
