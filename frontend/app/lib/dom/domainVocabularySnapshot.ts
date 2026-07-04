import type {
  DomainVocabularyEntry,
  DomainVocabularyRegistry,
  DomainVocabularyValidationResult,
  RegisteredDomainVocabulary,
} from "./domainVocabularyIndex.ts";
import {
  DOMAIN_VOCABULARY_CONTRACT_VERSION,
  domainVocabularyValidationResult,
} from "./domainVocabularyIndex.ts";
import type {
  DomainVocabularyDiff,
  DomainVocabularyDiffEntry,
  DomainVocabularySnapshot,
  DomainVocabularySnapshotEntry,
} from "./domainVocabularyQueryTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function versionKey(entry: RegisteredDomainVocabulary): string {
  const version = entry.package.version;
  return [version.major, version.minor, version.patch, version.label ?? ""].join(".");
}

function termKey(term: DomainVocabularyEntry): string {
  const synonyms = term.synonyms
    .map((synonym) => `${synonym.label}:${synonym.normalizedLabel}`)
    .sort((left, right) => left.localeCompare(right))
    .join(",");

  return [
    term.termId,
    term.label,
    term.definition.language,
    term.definition.text,
    term.scope,
    term.status,
    synonyms,
  ].join("|");
}

function vocabularyFingerprint(entry: RegisteredDomainVocabulary): string {
  const terms = entry.package.terms
    .map(termKey)
    .sort((left, right) => left.localeCompare(right))
    .join(";");

  return stableHash(
    [
      entry.package.contractVersion,
      entry.package.vocabularyId,
      entry.package.domainId,
      entry.package.name,
      entry.package.description,
      versionKey(entry),
      entry.package.status,
      entry.registrationOrder,
      terms,
    ].join("||")
  );
}

function snapshotFingerprint(entries: readonly DomainVocabularySnapshotEntry[]): string {
  return stableHash(
    entries
      .map((entry) =>
        [
          entry.vocabularyId,
          entry.domainId,
          entry.registrationOrder,
          entry.status,
          entry.termIds.join(","),
          entry.termCount,
          entry.fingerprint,
        ].join("|")
      )
      .join("||")
  );
}

function snapshotEntry(entry: RegisteredDomainVocabulary): DomainVocabularySnapshotEntry {
  const termIds = Object.freeze(
    entry.package.terms.map((term) => term.termId).sort((left, right) => left.localeCompare(right))
  );

  return Object.freeze({
    vocabularyId: entry.package.vocabularyId,
    domainId: entry.package.domainId,
    registrationOrder: entry.registrationOrder,
    status: entry.package.status,
    termIds,
    termCount: termIds.length,
    fingerprint: vocabularyFingerprint(entry),
  });
}

export function buildDomainVocabularySnapshot(
  registry: DomainVocabularyRegistry
): DomainVocabularySnapshot {
  const entries = Object.freeze(
    registry.vocabularies
      .map(snapshotEntry)
      .sort((left, right) => left.vocabularyId.localeCompare(right.vocabularyId))
  );

  return Object.freeze({
    contractVersion: registry.contractVersion,
    registryId: registry.registryId,
    frozen: registry.frozen,
    vocabularyCount: entries.length,
    entries,
    fingerprint: snapshotFingerprint(entries),
  });
}

export function validateDomainVocabularySnapshot(
  snapshot: DomainVocabularySnapshot
): DomainVocabularyValidationResult {
  const issues = [];

  if (snapshot.contractVersion !== DOMAIN_VOCABULARY_CONTRACT_VERSION) {
    issues.push(
      Object.freeze({
        code: "invalid_snapshot_contract_version",
        field: "contractVersion",
        message: "Snapshot contract version must match DOM-2:1 vocabulary contract.",
        severity: "error" as const,
      })
    );
  }

  if (snapshot.vocabularyCount !== snapshot.entries.length) {
    issues.push(
      Object.freeze({
        code: "invalid_snapshot_vocabulary_count",
        field: "vocabularyCount",
        message: "Snapshot vocabulary count must match entry count.",
        severity: "error" as const,
      })
    );
  }

  if (snapshot.fingerprint !== snapshotFingerprint(snapshot.entries)) {
    issues.push(
      Object.freeze({
        code: "invalid_snapshot_fingerprint",
        field: "fingerprint",
        message: "Snapshot fingerprint must match deterministic entry fingerprint.",
        severity: "error" as const,
      })
    );
  }

  return domainVocabularyValidationResult(issues);
}

export function compareDomainVocabularySnapshots(
  left: DomainVocabularySnapshot,
  right: DomainVocabularySnapshot
): boolean {
  return left.fingerprint === right.fingerprint;
}

export function diffDomainVocabularySnapshots(
  left: DomainVocabularySnapshot,
  right: DomainVocabularySnapshot
): DomainVocabularyDiff {
  const leftById = new Map(left.entries.map((entry) => [entry.vocabularyId, entry]));
  const rightById = new Map(right.entries.map((entry) => [entry.vocabularyId, entry]));
  const vocabularyIds = [...new Set([...leftById.keys(), ...rightById.keys()])].sort((a, b) =>
    a.localeCompare(b)
  );
  const entries: DomainVocabularyDiffEntry[] = [];

  for (const vocabularyId of vocabularyIds) {
    const leftEntry = leftById.get(vocabularyId) ?? null;
    const rightEntry = rightById.get(vocabularyId) ?? null;
    if (!leftEntry && rightEntry) {
      entries.push(Object.freeze({ type: "added", vocabularyId, left: null, right: rightEntry }));
    } else if (leftEntry && !rightEntry) {
      entries.push(Object.freeze({ type: "removed", vocabularyId, left: leftEntry, right: null }));
    } else if (leftEntry && rightEntry && leftEntry.fingerprint !== rightEntry.fingerprint) {
      entries.push(Object.freeze({ type: "modified", vocabularyId, left: leftEntry, right: rightEntry }));
    }
  }

  return Object.freeze({
    equal: entries.length === 0,
    leftFingerprint: left.fingerprint,
    rightFingerprint: right.fingerprint,
    entries: Object.freeze(entries),
  });
}
