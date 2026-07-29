/**
 * EX-2:2 — Executive Journal Experience Registry Entries.
 *
 * Canonical EX-2:1 Foundation registry entry and registration sealing.
 * Imports the Foundation aggregate by exact reference — never recreates it.
 *
 * Ownership: owned exclusively by EX-2:2.
 */

import {
  ExecutiveJournalExperienceFoundation,
  ExecutiveJournalExperienceFoundationId,
  ExecutiveJournalExperienceFoundationNamespace,
  ExecutiveJournalExperienceFoundationPhase,
  ExecutiveJournalExperienceFoundationReadiness,
  ExecutiveJournalExperienceFoundationStatus,
} from "./executiveJournalExperienceFoundation.ts";
import type {
  ExecutiveJournalExperienceRegistryConflictCode,
  ExecutiveJournalExperienceRegistryEntry,
  ExecutiveJournalExperienceRegistryRegisterResult,
} from "./executiveJournalExperienceRegistryTypes.ts";

/** Candidate shape accepted by registration validation (tests + seal). */
export interface ExecutiveJournalExperienceRegistryCandidate {
  readonly entryId: string;
  readonly controlId: string;
  readonly namespace: string;
  readonly status: string;
  readonly readiness: string;
  readonly phase: string;
  readonly aliases: readonly string[];
  readonly order: number;
  readonly foundation: {
    readonly identity: {
      readonly id: string;
      readonly namespace: string;
      readonly status: string;
      readonly readiness: string;
      readonly phase: string;
      readonly aliases: readonly string[];
    };
    readonly readiness: string;
    readonly status: string;
    readonly phase: string;
  };
}

const CANONICAL_ENTRY_ID =
  "EX-2:2/Entry/ExecutiveJournalExperienceFoundation" as const;

/**
 * Canonical sealed entry for EX-2:1 Foundation.
 * `foundation` is the exact imported aggregate reference.
 */
export const ExecutiveJournalExperienceFoundationRegistryEntry:
  ExecutiveJournalExperienceRegistryEntry = Object.freeze({
    entryId: CANONICAL_ENTRY_ID,
    controlId: ExecutiveJournalExperienceFoundationId,
    namespace: ExecutiveJournalExperienceFoundationNamespace,
    status: ExecutiveJournalExperienceFoundationStatus,
    readiness: ExecutiveJournalExperienceFoundationReadiness,
    phase: ExecutiveJournalExperienceFoundationPhase,
    aliases: ExecutiveJournalExperienceFoundation.identity.aliases,
    order: 1 as const,
    foundation: ExecutiveJournalExperienceFoundation,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Ordered canonical entry collection (exactly one Foundation entry).
 */
export const ExecutiveJournalExperienceRegistryCanonicalEntries =
  Object.freeze([
    ExecutiveJournalExperienceFoundationRegistryEntry,
  ] as const satisfies readonly ExecutiveJournalExperienceRegistryEntry[]);

let sealed = true;

const failure = (
  code: ExecutiveJournalExperienceRegistryConflictCode,
  detail: string,
): ExecutiveJournalExperienceRegistryRegisterResult =>
  Object.freeze({
    ok: false as const,
    code,
    detail,
    entries: null,
    metadataOnly: true as const,
    immutable: true as const,
  });

const aliasesMatchFoundation = (
  aliases: readonly string[],
): boolean => {
  const expected = ExecutiveJournalExperienceFoundation.identity.aliases;
  return aliases.length === expected.length
    && aliases.every((alias, index) => alias === expected[index]);
};

/**
 * Validate and seal candidate Registry entries.
 * Conflicts do not mutate the sealed canonical Registry.
 * Successful seal accepts only the exact imported EX-2:1 Foundation reference.
 */
export function registerExecutiveJournalExperienceEntries(
  candidates: readonly ExecutiveJournalExperienceRegistryCandidate[],
): ExecutiveJournalExperienceRegistryRegisterResult {
  if (sealed) {
    return failure(
      "RegistryAlreadySealed",
      "Registry is sealed and rejects further registration.",
    );
  }

  if (candidates.length === 0) {
    return failure(
      "UnexpectedEntry",
      "No candidates supplied for registration.",
    );
  }

  const controlIds = new Set<string>();
  const namespaces = new Set<string>();
  const aliasOwners = new Map<string, string>();
  const accepted: ExecutiveJournalExperienceRegistryEntry[] = [];

  for (const candidate of candidates) {
    if (candidate.foundation.readiness !== "ReadyForRegistry") {
      return failure(
        "FoundationNotReadyForRegistry",
        `Foundation readiness is ${candidate.foundation.readiness}.`,
      );
    }

    if (candidate.readiness !== "ReadyForRegistry") {
      return failure(
        "FoundationNotReadyForRegistry",
        "Entry readiness must be ReadyForRegistry.",
      );
    }

    if (
      candidate.controlId !== candidate.foundation.identity.id
      || candidate.namespace !== candidate.foundation.identity.namespace
      || candidate.status !== candidate.foundation.identity.status
      || candidate.readiness !== candidate.foundation.identity.readiness
      || candidate.phase !== candidate.foundation.identity.phase
    ) {
      return failure(
        "IdentityKeyMismatch",
        "Entry keys do not match Foundation identity fields.",
      );
    }

    if (controlIds.has(candidate.controlId)) {
      return failure(
        "DuplicateCanonicalId",
        `Duplicate controlId: ${candidate.controlId}`,
      );
    }

    if (namespaces.has(candidate.namespace)) {
      return failure(
        "DuplicateNamespace",
        `Duplicate namespace: ${candidate.namespace}`,
      );
    }

    const seenAliases = new Set<string>();
    for (const alias of candidate.aliases) {
      if (seenAliases.has(alias)) {
        return failure(
          "DuplicateAlias",
          `Duplicate alias within candidate: ${alias}`,
        );
      }
      seenAliases.add(alias);

      if (alias === candidate.controlId || alias === candidate.namespace) {
        return failure(
          "AliasCanonicalCollision",
          `Alias collides with canonical identity: ${alias}`,
        );
      }
      if (controlIds.has(alias) || namespaces.has(alias)) {
        return failure(
          "AliasCanonicalCollision",
          `Alias collides with a prior canonical identity: ${alias}`,
        );
      }
      const priorOwner = aliasOwners.get(alias);
      if (priorOwner !== undefined) {
        return failure(
          "AliasAmbiguous",
          `Alias already owned by ${priorOwner}: ${alias}`,
        );
      }
    }

    controlIds.add(candidate.controlId);
    namespaces.add(candidate.namespace);
    for (const alias of candidate.aliases) {
      aliasOwners.set(alias, candidate.controlId);
    }

    if (candidate.foundation !== ExecutiveJournalExperienceFoundation) {
      return failure(
        "EntryReferenceMismatch",
        "Candidate foundation is not the exact imported EX-2:1 aggregate.",
      );
    }

    if (
      candidate.controlId !== ExecutiveJournalExperienceFoundationId
      || candidate.namespace !== ExecutiveJournalExperienceFoundationNamespace
      || candidate.status !== ExecutiveJournalExperienceFoundationStatus
      || candidate.phase !== ExecutiveJournalExperienceFoundationPhase
      || candidate.entryId !== CANONICAL_ENTRY_ID
      || !aliasesMatchFoundation(candidate.aliases)
    ) {
      return failure(
        "UnexpectedEntry",
        "Candidate is not the canonical EX-2:1 Foundation registration.",
      );
    }

    accepted.push(ExecutiveJournalExperienceFoundationRegistryEntry);
  }

  for (const entry of accepted) {
    for (const alias of entry.aliases) {
      if (controlIds.has(alias) || namespaces.has(alias)) {
        return failure(
          "AliasCanonicalCollision",
          `Alias collides with sealed canonical identity: ${alias}`,
        );
      }
    }
  }

  if (accepted.length !== 1) {
    return failure(
      "UnexpectedEntry",
      `Expected exactly one Foundation entry, received ${accepted.length}.`,
    );
  }

  sealed = true;
  return Object.freeze({
    ok: true as const,
    code: "Registered" as const,
    entries: ExecutiveJournalExperienceRegistryCanonicalEntries,
    entryCount: 1 as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
}

/**
 * Test/support helper: temporarily unseal to exercise registration conflicts.
 * Production Registry remains sealed via the module-level canonical seal.
 */
export function __unsealExecutiveJournalExperienceRegistryForConflictTests():
  void {
  sealed = false;
}

/** Test helper: whether the registration seal flag is set. */
export function __isExecutiveJournalExperienceRegistrySealedForTests():
  boolean {
  return sealed;
}

/**
 * Test helper: reseal with the canonical Foundation entry after conflict tests.
 */
export function __resealExecutiveJournalExperienceRegistryForConflictTests():
  ExecutiveJournalExperienceRegistryRegisterResult {
  if (sealed) {
    return Object.freeze({
      ok: true as const,
      code: "Registered" as const,
      entries: ExecutiveJournalExperienceRegistryCanonicalEntries,
      entryCount: 1 as const,
      metadataOnly: true as const,
      immutable: true as const,
    });
  }
  return registerExecutiveJournalExperienceEntries(
    Object.freeze([
      Object.freeze({
        entryId: CANONICAL_ENTRY_ID,
        controlId: ExecutiveJournalExperienceFoundationId,
        namespace: ExecutiveJournalExperienceFoundationNamespace,
        status: ExecutiveJournalExperienceFoundationStatus,
        readiness: ExecutiveJournalExperienceFoundationReadiness,
        phase: ExecutiveJournalExperienceFoundationPhase,
        aliases: ExecutiveJournalExperienceFoundation.identity.aliases,
        order: 1,
        foundation: ExecutiveJournalExperienceFoundation,
      }),
    ]),
  );
}

/**
 * Canonical seal performed at module evaluation using the exact Foundation
 * entry. Production consumers always observe a sealed Registry.
 */
export const ExecutiveJournalExperienceRegistrySealResult:
  ExecutiveJournalExperienceRegistryRegisterResult = (() => {
    sealed = false;
    const result = registerExecutiveJournalExperienceEntries(
      Object.freeze([
        Object.freeze({
          entryId: CANONICAL_ENTRY_ID,
          controlId: ExecutiveJournalExperienceFoundationId,
          namespace: ExecutiveJournalExperienceFoundationNamespace,
          status: ExecutiveJournalExperienceFoundationStatus,
          readiness: ExecutiveJournalExperienceFoundationReadiness,
          phase: ExecutiveJournalExperienceFoundationPhase,
          aliases: ExecutiveJournalExperienceFoundation.identity.aliases,
          order: 1,
          foundation: ExecutiveJournalExperienceFoundation,
        }),
      ]),
    );
    if (result.ok !== true) {
      throw new Error(
        `EX-2:2 registry seal failed: ${result.code} — ${result.detail}`,
      );
    }
    return result;
  })();
