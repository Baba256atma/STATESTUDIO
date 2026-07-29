/**
 * RTC-3:2 — Executive Decision Register Registry Entries.
 *
 * Canonical RTC-3:1 foundation registry entry and registration sealing.
 * Imports the foundation aggregate by reference — never recreates it.
 *
 * Ownership: owned exclusively by RTC-3:2.
 */

import {
  ExecutiveDecisionRegisterFoundation,
  ExecutiveDecisionRegisterFoundationId,
  ExecutiveDecisionRegisterFoundationNamespace,
} from "./executiveDecisionRegisterFoundation.ts";
import { ExecutiveDecisionRegisterFoundationEntryAliases } from "./executiveDecisionRegisterRegistryIdentity.ts";
import type {
  ExecutiveDecisionRegisterRegistryEntry,
  ExecutiveDecisionRegisterRegistryRegisterResult,
} from "./executiveDecisionRegisterRegistryTypes.ts";

/** Candidate shape accepted by registration validation (tests + seal). */
export interface ExecutiveDecisionRegisterRegistryCandidate {
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
 * Canonical sealed entry for RTC-3:1 Executive Decision Register Foundation.
 * `foundation` is the exact imported aggregate reference.
 */
export const ExecutiveDecisionRegisterFoundationRegistryEntry:
  ExecutiveDecisionRegisterRegistryEntry = Object.freeze({
    entryId: "RTC-3:2/Entry/ExecutiveDecisionRegisterFoundation" as const,
    controlId: ExecutiveDecisionRegisterFoundationId,
    namespace: ExecutiveDecisionRegisterFoundationNamespace,
    aliases: ExecutiveDecisionRegisterFoundationEntryAliases,
    order: 1 as const,
    status: "Registered" as const,
    foundationReadiness: "ReadyForRegistry" as const,
    foundation: ExecutiveDecisionRegisterFoundation,
    metadataOnly: true as const,
    immutable: true as const,
    storesRuntimeValues: false as const,
    executable: false as const,
  });

/**
 * Ordered canonical entry collection (exactly one foundation entry).
 */
export const ExecutiveDecisionRegisterRegistryCanonicalEntries = Object.freeze([
  ExecutiveDecisionRegisterFoundationRegistryEntry,
] as const satisfies readonly ExecutiveDecisionRegisterRegistryEntry[]);

const failure = (
  code: Exclude<
    ExecutiveDecisionRegisterRegistryRegisterResult,
    { ok: true }
  >["code"],
  detail: string,
): ExecutiveDecisionRegisterRegistryRegisterResult =>
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
 * Successful seal accepts only the exact imported RTC-3:1 foundation reference.
 */
export function registerExecutiveDecisionRegisterEntries(
  candidates: readonly ExecutiveDecisionRegisterRegistryCandidate[],
): ExecutiveDecisionRegisterRegistryRegisterResult {
  if (candidates.length === 0) {
    return failure(
      "FoundationNotReadyForRegistry",
      "No candidates supplied for registration.",
    );
  }

  const controlIds = new Set<string>();
  const namespaces = new Set<string>();
  const aliasOwners = new Map<string, string>();
  const sealed: ExecutiveDecisionRegisterRegistryEntry[] = [];

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

    if (
      candidate.foundation !== ExecutiveDecisionRegisterFoundation
      || candidate.controlId !== ExecutiveDecisionRegisterFoundationId
      || candidate.namespace !== ExecutiveDecisionRegisterFoundationNamespace
    ) {
      return failure(
        "IdentityKeyMismatch",
        "Candidate is not the canonical RTC-3:1 foundation registration.",
      );
    }

    sealed.push(ExecutiveDecisionRegisterFoundationRegistryEntry);
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
export const ExecutiveDecisionRegisterRegistrySealResult =
  registerExecutiveDecisionRegisterEntries(
    ExecutiveDecisionRegisterRegistryCanonicalEntries,
  );
