/**
 * RTC-2:2 — Executive Journal Runtime Registry Entries.
 *
 * Canonical RTC-2:1 foundation registry entry and registration sealing.
 * Imports the foundation aggregate by reference — never recreates it.
 *
 * Ownership: owned exclusively by RTC-2:2.
 */

import {
  ExecutiveJournalRuntimeFoundation,
  ExecutiveJournalRuntimeFoundationId,
  ExecutiveJournalRuntimeFoundationNamespace,
} from "./executiveJournalRuntimeFoundation.ts";
import { ExecutiveJournalRuntimeFoundationEntryAliases } from "./executiveJournalRuntimeRegistryIdentity.ts";
import type {
  ExecutiveJournalRuntimeRegistryEntry,
  ExecutiveJournalRuntimeRegistryRegisterResult,
} from "./executiveJournalRuntimeRegistryTypes.ts";

/** Candidate shape accepted by registration validation (tests + seal). */
export interface ExecutiveJournalRuntimeRegistryCandidate {
  readonly entryId: string;
  readonly controlId: string;
  readonly namespace: string;
  readonly aliases: readonly string[];
  readonly order: number;
  readonly foundationReadiness: string;
  readonly foundation: {
    readonly identity: { readonly foundationId: string };
    readonly readiness: string;
  };
}

/**
 * Canonical sealed entry for RTC-2:1 Executive Journal Runtime Foundation.
 * `foundation` is the exact imported aggregate reference.
 */
export const ExecutiveJournalRuntimeFoundationRegistryEntry:
  ExecutiveJournalRuntimeRegistryEntry = Object.freeze({
    entryId: "RTC-2:2/Entry/ExecutiveJournalRuntimeFoundation" as const,
    controlId: ExecutiveJournalRuntimeFoundationId,
    namespace: ExecutiveJournalRuntimeFoundationNamespace,
    aliases: ExecutiveJournalRuntimeFoundationEntryAliases,
    order: 1 as const,
    status: "Registered" as const,
    foundationReadiness: "ReadyForRegistry" as const,
    foundation: ExecutiveJournalRuntimeFoundation,
    metadataOnly: true as const,
    immutable: true as const,
    storesRuntimeValues: false as const,
    executable: false as const,
  });

/**
 * Ordered canonical entry collection (exactly one foundation entry).
 */
export const ExecutiveJournalRuntimeRegistryCanonicalEntries = Object.freeze([
  ExecutiveJournalRuntimeFoundationRegistryEntry,
] as const satisfies readonly ExecutiveJournalRuntimeRegistryEntry[]);

const failure = (
  code: Exclude<
    ExecutiveJournalRuntimeRegistryRegisterResult,
    { ok: true }
  >["code"],
  detail: string,
): ExecutiveJournalRuntimeRegistryRegisterResult =>
  Object.freeze({
    ok: false as const,
    code,
    detail,
    entries: null,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Validate and seal candidate registry entries.
 * Rejects duplicates, alias collisions, identity mismatches, and unreadiness.
 * Successful seal accepts only the exact imported RTC-2:1 foundation reference.
 */
export function registerExecutiveJournalRuntimeEntries(
  candidates: readonly ExecutiveJournalRuntimeRegistryCandidate[],
): ExecutiveJournalRuntimeRegistryRegisterResult {
  if (candidates.length === 0) {
    return failure(
      "FoundationNotReadyForRegistry",
      "No candidates supplied for registration.",
    );
  }

  const controlIds = new Set<string>();
  const namespaces = new Set<string>();
  const aliasOwners = new Map<string, string>();
  const sealed: ExecutiveJournalRuntimeRegistryEntry[] = [];

  for (const candidate of candidates) {
    if (candidate.foundation.readiness !== "ReadyForRegistry") {
      return failure(
        "FoundationNotReadyForRegistry",
        `Foundation readiness is ${candidate.foundation.readiness}.`,
      );
    }

    if (candidate.foundationReadiness !== "ReadyForRegistry") {
      return failure(
        "FoundationNotReadyForRegistry",
        "Entry foundationReadiness must be ReadyForRegistry.",
      );
    }

    if (candidate.controlId !== candidate.foundation.identity.foundationId) {
      return failure(
        "IdentityKeyMismatch",
        "Entry controlId does not match foundation identity.",
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

    for (const alias of candidate.aliases) {
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

    // Also reject aliases that collide with this candidate's upcoming canonical keys
    // when compared against later logic — covered above for prior keys.

    controlIds.add(candidate.controlId);
    namespaces.add(candidate.namespace);
    for (const alias of candidate.aliases) {
      aliasOwners.set(alias, candidate.controlId);
    }

    if (
      candidate.foundation !== ExecutiveJournalRuntimeFoundation
      || candidate.controlId !== ExecutiveJournalRuntimeFoundationId
      || candidate.namespace !== ExecutiveJournalRuntimeFoundationNamespace
    ) {
      // Structural conflicts already handled. Non-canonical foundations cannot seal.
      // Keep candidate keys in sets so subsequent duplicates still detect correctly,
      // then fail closed for non-canonical seal attempts.
      return failure(
        "IdentityKeyMismatch",
        "Candidate is not the canonical RTC-2:1 foundation registration.",
      );
    }

    sealed.push(ExecutiveJournalRuntimeFoundationRegistryEntry);
  }

  for (const entry of sealed) {
    for (const alias of entry.aliases) {
      if (controlIds.has(alias) || namespaces.has(alias)) {
        return failure(
          "AliasCanonicalCollision",
          `Alias collides with sealed canonical identity: ${alias}`,
        );
      }
    }
  }

  const ordered = Object.freeze(
    [...sealed].sort((left, right) => left.order - right.order),
  );

  return Object.freeze({
    ok: true as const,
    code: "Registered" as const,
    entries: ordered,
    entryCount: ordered.length,
    metadataOnly: true as const,
    immutable: true as const,
  });
}

/** Seal result for the canonical production entry set. */
export const ExecutiveJournalRuntimeRegistrySealResult =
  registerExecutiveJournalRuntimeEntries(
    ExecutiveJournalRuntimeRegistryCanonicalEntries,
  );
