/**
 * RTC-2:2 — Executive Journal Runtime Registry.
 *
 * Deterministic immutable registry for discovering and resolving the approved
 * Executive Journal Runtime Foundation. Consumes RTC-2:1 by reference only.
 * Metadata-only — no UI, capture, disclosure, or open-issue resolution.
 *
 * Ownership: owned exclusively by RTC-2:2.
 *
 * Public exports:
 *   ExecutiveJournalRuntimeRegistryId
 *   ExecutiveJournalRuntimeRegistryVersion
 *   ExecutiveJournalRuntimeRegistryName
 *   ExecutiveJournalRuntimeRegistryNamespace
 *   ExecutiveJournalRuntimeRegistryStatus
 *   ExecutiveJournalRuntimeRegistryReadiness
 *   ExecutiveJournalRuntimeRegistry
 *   resolveExecutiveJournalRuntimeRegistryEntry()
 *   isExecutiveJournalRuntimeRegistered()
 *   getExecutiveJournalRuntimeRegistrySummary()
 */

import { ExecutiveJournalRuntimeFoundation } from "./executiveJournalRuntimeFoundation.ts";
import { ExecutiveJournalRuntimeRegistryContracts } from "./executiveJournalRuntimeRegistryContracts.ts";
import {
  ExecutiveJournalRuntimeFoundationRegistryEntry,
  ExecutiveJournalRuntimeRegistryCanonicalEntries,
  ExecutiveJournalRuntimeRegistrySealResult,
  registerExecutiveJournalRuntimeEntries,
} from "./executiveJournalRuntimeRegistryEntries.ts";
import {
  ExecutiveJournalRuntimeRegistryId,
  ExecutiveJournalRuntimeRegistryIdentity,
  ExecutiveJournalRuntimeRegistryName,
  ExecutiveJournalRuntimeRegistryNamespace,
  ExecutiveJournalRuntimeRegistryNextPhase,
  ExecutiveJournalRuntimeRegistryReadiness,
  ExecutiveJournalRuntimeRegistryStatus,
  ExecutiveJournalRuntimeRegistryVersion,
  isWellFormedJournalRegistryIdentity,
} from "./executiveJournalRuntimeRegistryIdentity.ts";
import { ExecutiveJournalRuntimeRegistryLifecycle } from "./executiveJournalRuntimeRegistryLifecycle.ts";
import {
  ExecutiveJournalAiMustNot,
  ExecutiveJournalRuntimeRegistryBoundaries,
  ExecutiveJournalRuntimeRegistryDecisions,
  ExecutiveJournalRuntimeRegistryMetadata,
  ExecutiveJournalRuntimeRegistryOpenIssues,
  ExecutiveJournalRuntimeRegistryOwnership,
  ExecutiveJournalRuntimeRegistryPrinciples,
} from "./executiveJournalRuntimeRegistryMetadata.ts";
import type {
  ExecutiveJournalRuntimeRegistryEntry,
  ExecutiveJournalRuntimeRegistryResolveResult,
  ExecutiveJournalRuntimeRegistrySummary,
} from "./executiveJournalRuntimeRegistryTypes.ts";

export {
  ExecutiveJournalRuntimeRegistryId,
  ExecutiveJournalRuntimeRegistryName,
  ExecutiveJournalRuntimeRegistryNamespace,
  ExecutiveJournalRuntimeRegistryReadiness,
  ExecutiveJournalRuntimeRegistryStatus,
  ExecutiveJournalRuntimeRegistryVersion,
};

export {
  registerExecutiveJournalRuntimeEntries,
  ExecutiveJournalRuntimeFoundationRegistryEntry,
  ExecutiveJournalRuntimeRegistryCanonicalEntries,
};

if (ExecutiveJournalRuntimeRegistrySealResult.ok !== true) {
  throw new Error(
    "RTC-2:2 registry seal failed for the canonical RTC-2:1 foundation entry.",
  );
}

const sealedEntries = ExecutiveJournalRuntimeRegistrySealResult.entries;

const byControlId = Object.freeze(
  Object.fromEntries(
    sealedEntries.map((entry) => [entry.controlId, entry]),
  ) as Readonly<Record<string, ExecutiveJournalRuntimeRegistryEntry>>,
);

const byNamespace = Object.freeze(
  Object.fromEntries(
    sealedEntries.map((entry) => [entry.namespace, entry]),
  ) as Readonly<Record<string, ExecutiveJournalRuntimeRegistryEntry>>,
);

const byAlias = Object.freeze(
  Object.fromEntries(
    sealedEntries.flatMap((entry) =>
      entry.aliases.map((alias) => [alias, entry] as const)
    ),
  ) as Readonly<Record<string, ExecutiveJournalRuntimeRegistryEntry>>,
);

const aliasCount = sealedEntries.reduce(
  (count, entry) => count + entry.aliases.length,
  0,
);

const resolveFailure = (
  code: "UnknownIdentity" | "MalformedIdentity",
  query: string,
): ExecutiveJournalRuntimeRegistryResolveResult =>
  Object.freeze({
    ok: false as const,
    code,
    query,
    entry: null,
    metadataOnly: true as const,
    immutable: true as const,
  });

const resolveSuccess = (
  query: string,
  resolvedBy: "controlId" | "namespace" | "alias",
  entry: ExecutiveJournalRuntimeRegistryEntry,
): ExecutiveJournalRuntimeRegistryResolveResult =>
  Object.freeze({
    ok: true as const,
    code: "Resolved" as const,
    query,
    resolvedBy,
    entry,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Resolve by canonical control ID. */
export function resolveExecutiveJournalRuntimeById(
  controlId: unknown,
): ExecutiveJournalRuntimeRegistryResolveResult {
  if (!isWellFormedJournalRegistryIdentity(controlId)) {
    return resolveFailure("MalformedIdentity", String(controlId));
  }
  const entry = byControlId[controlId];
  if (!entry) {
    return resolveFailure("UnknownIdentity", controlId);
  }
  return resolveSuccess(controlId, "controlId", entry);
}

/** Resolve by canonical namespace. */
export function resolveExecutiveJournalRuntimeByNamespace(
  namespace: unknown,
): ExecutiveJournalRuntimeRegistryResolveResult {
  if (!isWellFormedJournalRegistryIdentity(namespace)) {
    return resolveFailure("MalformedIdentity", String(namespace));
  }
  const entry = byNamespace[namespace];
  if (!entry) {
    return resolveFailure("UnknownIdentity", namespace);
  }
  return resolveSuccess(namespace, "namespace", entry);
}

/** Resolve by approved alias. */
export function resolveExecutiveJournalRuntimeByAlias(
  alias: unknown,
): ExecutiveJournalRuntimeRegistryResolveResult {
  if (!isWellFormedJournalRegistryIdentity(alias)) {
    return resolveFailure("MalformedIdentity", String(alias));
  }
  const entry = byAlias[alias];
  if (!entry) {
    return resolveFailure("UnknownIdentity", alias);
  }
  return resolveSuccess(alias, "alias", entry);
}

/**
 * Resolve by control ID, namespace, or approved alias (closed world).
 * Does not normalize case, whitespace, or partial identifiers.
 */
export function resolveExecutiveJournalRuntimeRegistryEntry(
  query: unknown,
): ExecutiveJournalRuntimeRegistryResolveResult {
  if (!isWellFormedJournalRegistryIdentity(query)) {
    return resolveFailure("MalformedIdentity", String(query));
  }
  const byId = byControlId[query];
  if (byId) {
    return resolveSuccess(query, "controlId", byId);
  }
  const byNs = byNamespace[query];
  if (byNs) {
    return resolveSuccess(query, "namespace", byNs);
  }
  const byAl = byAlias[query];
  if (byAl) {
    return resolveSuccess(query, "alias", byAl);
  }
  return resolveFailure("UnknownIdentity", query);
}

/** Predicate: whether a control ID, namespace, or alias is registered. */
export function isExecutiveJournalRuntimeRegistered(
  query: unknown,
): boolean {
  return resolveExecutiveJournalRuntimeRegistryEntry(query).ok === true;
}

/** Enumerate sealed entries in deterministic order. */
export function enumerateExecutiveJournalRuntimeRegistryEntries():
  readonly ExecutiveJournalRuntimeRegistryEntry[] {
  return sealedEntries;
}

/**
 * Canonical immutable Executive Journal Runtime Registry aggregate.
 */
export const ExecutiveJournalRuntimeRegistry = Object.freeze({
  identity: ExecutiveJournalRuntimeRegistryIdentity,
  foundation: ExecutiveJournalRuntimeFoundation,
  lifecycle: ExecutiveJournalRuntimeRegistryLifecycle,
  contracts: ExecutiveJournalRuntimeRegistryContracts,
  entries: sealedEntries,
  canonicalEntry: ExecutiveJournalRuntimeFoundationRegistryEntry,
  principles: ExecutiveJournalRuntimeRegistryPrinciples,
  decisions: ExecutiveJournalRuntimeRegistryDecisions,
  openIssues: ExecutiveJournalRuntimeRegistryOpenIssues,
  ownership: ExecutiveJournalRuntimeRegistryOwnership,
  boundaries: ExecutiveJournalRuntimeRegistryBoundaries,
  aiMustNot: ExecutiveJournalAiMustNot,
  metadata: ExecutiveJournalRuntimeRegistryMetadata,
  status: ExecutiveJournalRuntimeRegistryStatus,
  readiness: ExecutiveJournalRuntimeRegistryReadiness,
  nextPhase: ExecutiveJournalRuntimeRegistryNextPhase,
  resolve: resolveExecutiveJournalRuntimeRegistryEntry,
  resolveById: resolveExecutiveJournalRuntimeById,
  resolveByNamespace: resolveExecutiveJournalRuntimeByNamespace,
  resolveByAlias: resolveExecutiveJournalRuntimeByAlias,
  isRegistered: isExecutiveJournalRuntimeRegistered,
  enumerate: enumerateExecutiveJournalRuntimeRegistryEntries,
  statistics: Object.freeze({
    entryCount: sealedEntries.length,
    aliasCount,
    contractCount: ExecutiveJournalRuntimeRegistryContracts.length,
    openIssueCount: ExecutiveJournalRuntimeRegistryOpenIssues.length,
    principleCount: ExecutiveJournalRuntimeRegistryPrinciples.length,
    lifecycleStateCount: ExecutiveJournalRuntimeRegistryLifecycle.stateCount,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-2:1 — Executive Journal Runtime Foundation",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  storesRuntimeValues: false as const,
  executesTransitions: false as const,
  performsValidation: false as const,
  modifiesState: false as const,
  communicatesWithUi: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  aiAuthorityBehavior: false as const,
  resolvesOpenIssues: false as const,
  recreatesFoundation: false as const,
  modelPhase: false as const,
  validationPhase: false as const,
  manifestPhase: false as const,
  platformPhase: false as const,
} as const);

/** Deterministic frozen Registry summary. */
export function getExecutiveJournalRuntimeRegistrySummary():
  ExecutiveJournalRuntimeRegistrySummary {
  return Object.freeze({
    registryId: ExecutiveJournalRuntimeRegistryId,
    version: ExecutiveJournalRuntimeRegistryVersion,
    name: ExecutiveJournalRuntimeRegistryName,
    namespace: ExecutiveJournalRuntimeRegistryNamespace,
    status: ExecutiveJournalRuntimeRegistryStatus,
    readiness: ExecutiveJournalRuntimeRegistryReadiness,
    entryCount: sealedEntries.length,
    aliasCount,
    openIssueCount: ExecutiveJournalRuntimeRegistryOpenIssues.length,
    sourceFoundation: "RTC-2:1/ExecutiveJournalRuntimeFoundation" as const,
    nextPhase: ExecutiveJournalRuntimeRegistryNextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveJournalRuntimeRegistry = () =>
  ExecutiveJournalRuntimeRegistry;
