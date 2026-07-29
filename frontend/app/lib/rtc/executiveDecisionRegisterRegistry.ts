/**
 * RTC-3:2 — Executive Decision Register Registry.
 *
 * Deterministic immutable registry for discovering and resolving the approved
 * Executive Decision Register Foundation. Consumes RTC-3:1 by reference only.
 * Metadata-only — no UI, confirmation, authority, or open-issue resolution.
 *
 * Ownership: owned exclusively by RTC-3:2.
 *
 * Public exports:
 *   ExecutiveDecisionRegisterRegistryId
 *   ExecutiveDecisionRegisterRegistryVersion
 *   ExecutiveDecisionRegisterRegistryName
 *   ExecutiveDecisionRegisterRegistryNamespace
 *   ExecutiveDecisionRegisterRegistryStatus
 *   ExecutiveDecisionRegisterRegistryReadiness
 *   ExecutiveDecisionRegisterRegistry
 *   resolveExecutiveDecisionRegisterRegistryEntry()
 *   isExecutiveDecisionRegisterRegistered()
 *   getExecutiveDecisionRegisterRegistrySummary()
 */

import { ExecutiveDecisionRegisterFoundation } from "./executiveDecisionRegisterFoundation.ts";
import { ExecutiveDecisionRegisterRegistryContracts } from "./executiveDecisionRegisterRegistryContracts.ts";
import {
  ExecutiveDecisionRegisterFoundationRegistryEntry,
  ExecutiveDecisionRegisterRegistryCanonicalEntries,
  ExecutiveDecisionRegisterRegistrySealResult,
  registerExecutiveDecisionRegisterEntries,
} from "./executiveDecisionRegisterRegistryEntries.ts";
import {
  ExecutiveDecisionRegisterRegistryId,
  ExecutiveDecisionRegisterRegistryIdentity,
  ExecutiveDecisionRegisterRegistryName,
  ExecutiveDecisionRegisterRegistryNamespace,
  ExecutiveDecisionRegisterRegistryNextPhase,
  ExecutiveDecisionRegisterRegistryReadiness,
  ExecutiveDecisionRegisterRegistryStatus,
  ExecutiveDecisionRegisterRegistryVersion,
  isWellFormedDecisionRegisterRegistryIdentity,
} from "./executiveDecisionRegisterRegistryIdentity.ts";
import {
  ExecutiveDecisionRegisterRegistryLifecycle,
  isCanonicalDecisionRegisterRegistryLifecycleState,
} from "./executiveDecisionRegisterRegistryLifecycle.ts";
import {
  ExecutiveDecisionRegisterRegistryAiMustNot,
  ExecutiveDecisionRegisterRegistryBoundaries,
  ExecutiveDecisionRegisterRegistryDecisions,
  ExecutiveDecisionRegisterRegistryMetadata,
  ExecutiveDecisionRegisterRegistryOpenIssues,
  ExecutiveDecisionRegisterRegistryOwnership,
  ExecutiveDecisionRegisterRegistryPrinciples,
  ExecutiveDecisionRegisterRegistryUpstreamDecisions,
} from "./executiveDecisionRegisterRegistryMetadata.ts";
import type {
  ExecutiveDecisionRegisterRegistryEntry,
  ExecutiveDecisionRegisterRegistryResolveResult,
  ExecutiveDecisionRegisterRegistrySummary,
} from "./executiveDecisionRegisterRegistryTypes.ts";

export {
  ExecutiveDecisionRegisterRegistryId,
  ExecutiveDecisionRegisterRegistryName,
  ExecutiveDecisionRegisterRegistryNamespace,
  ExecutiveDecisionRegisterRegistryReadiness,
  ExecutiveDecisionRegisterRegistryStatus,
  ExecutiveDecisionRegisterRegistryVersion,
};

export {
  registerExecutiveDecisionRegisterEntries,
  ExecutiveDecisionRegisterFoundationRegistryEntry,
  ExecutiveDecisionRegisterRegistryCanonicalEntries,
};

export { isCanonicalDecisionRegisterRegistryLifecycleState };

if (ExecutiveDecisionRegisterRegistrySealResult.ok !== true) {
  throw new Error(
    "RTC-3:2 registry seal failed for the canonical RTC-3:1 foundation entry.",
  );
}

const sealedEntries = ExecutiveDecisionRegisterRegistrySealResult.entries;

const byControlId = Object.freeze(
  Object.fromEntries(
    sealedEntries.map((entry) => [entry.controlId, entry]),
  ) as Readonly<Record<string, ExecutiveDecisionRegisterRegistryEntry>>,
);

const byNamespace = Object.freeze(
  Object.fromEntries(
    sealedEntries.map((entry) => [entry.namespace, entry]),
  ) as Readonly<Record<string, ExecutiveDecisionRegisterRegistryEntry>>,
);

const byAlias = Object.freeze(
  Object.fromEntries(
    sealedEntries.flatMap((entry) =>
      entry.aliases.map((alias) => [alias, entry] as const)
    ),
  ) as Readonly<Record<string, ExecutiveDecisionRegisterRegistryEntry>>,
);

const aliasCount = sealedEntries.reduce(
  (count, entry) => count + entry.aliases.length,
  0,
);

const resolveFailure = (
  code: "UnknownIdentity" | "MalformedIdentity",
  query: string,
): ExecutiveDecisionRegisterRegistryResolveResult =>
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
  entry: ExecutiveDecisionRegisterRegistryEntry,
): ExecutiveDecisionRegisterRegistryResolveResult =>
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
export function resolveExecutiveDecisionRegisterById(
  controlId: unknown,
): ExecutiveDecisionRegisterRegistryResolveResult {
  if (!isWellFormedDecisionRegisterRegistryIdentity(controlId)) {
    return resolveFailure("MalformedIdentity", String(controlId));
  }
  const entry = byControlId[controlId];
  if (!entry) {
    return resolveFailure("UnknownIdentity", controlId);
  }
  return resolveSuccess(controlId, "controlId", entry);
}

/** Resolve by canonical namespace. */
export function resolveExecutiveDecisionRegisterByNamespace(
  namespace: unknown,
): ExecutiveDecisionRegisterRegistryResolveResult {
  if (!isWellFormedDecisionRegisterRegistryIdentity(namespace)) {
    return resolveFailure("MalformedIdentity", String(namespace));
  }
  const entry = byNamespace[namespace];
  if (!entry) {
    return resolveFailure("UnknownIdentity", namespace);
  }
  return resolveSuccess(namespace, "namespace", entry);
}

/** Resolve by approved alias. */
export function resolveExecutiveDecisionRegisterByAlias(
  alias: unknown,
): ExecutiveDecisionRegisterRegistryResolveResult {
  if (!isWellFormedDecisionRegisterRegistryIdentity(alias)) {
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
export function resolveExecutiveDecisionRegisterRegistryEntry(
  query: unknown,
): ExecutiveDecisionRegisterRegistryResolveResult {
  if (!isWellFormedDecisionRegisterRegistryIdentity(query)) {
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
export function isExecutiveDecisionRegisterRegistered(
  query: unknown,
): boolean {
  return resolveExecutiveDecisionRegisterRegistryEntry(query).ok === true;
}

/** Enumerate sealed entries in deterministic order. */
export function enumerateExecutiveDecisionRegisterRegistryEntries():
  readonly ExecutiveDecisionRegisterRegistryEntry[] {
  return sealedEntries;
}

/**
 * Canonical immutable Executive Decision Register Registry aggregate.
 */
export const ExecutiveDecisionRegisterRegistry = Object.freeze({
  identity: ExecutiveDecisionRegisterRegistryIdentity,
  foundation: ExecutiveDecisionRegisterFoundation,
  lifecycle: ExecutiveDecisionRegisterRegistryLifecycle,
  contracts: ExecutiveDecisionRegisterRegistryContracts,
  entries: sealedEntries,
  canonicalEntry: ExecutiveDecisionRegisterFoundationRegistryEntry,
  principles: ExecutiveDecisionRegisterRegistryPrinciples,
  decisions: ExecutiveDecisionRegisterRegistryDecisions,
  upstreamDecisions: ExecutiveDecisionRegisterRegistryUpstreamDecisions,
  openIssues: ExecutiveDecisionRegisterRegistryOpenIssues,
  ownership: ExecutiveDecisionRegisterRegistryOwnership,
  boundaries: ExecutiveDecisionRegisterRegistryBoundaries,
  aiMustNot: ExecutiveDecisionRegisterRegistryAiMustNot,
  metadata: ExecutiveDecisionRegisterRegistryMetadata,
  status: ExecutiveDecisionRegisterRegistryStatus,
  readiness: ExecutiveDecisionRegisterRegistryReadiness,
  nextPhase: ExecutiveDecisionRegisterRegistryNextPhase,
  resolve: resolveExecutiveDecisionRegisterRegistryEntry,
  resolveById: resolveExecutiveDecisionRegisterById,
  resolveByNamespace: resolveExecutiveDecisionRegisterByNamespace,
  resolveByAlias: resolveExecutiveDecisionRegisterByAlias,
  isRegistered: isExecutiveDecisionRegisterRegistered,
  isCanonicalLifecycleState: isCanonicalDecisionRegisterRegistryLifecycleState,
  enumerate: enumerateExecutiveDecisionRegisterRegistryEntries,
  statistics: Object.freeze({
    entryCount: sealedEntries.length,
    aliasCount,
    contractCount: ExecutiveDecisionRegisterRegistryContracts.length,
    openIssueCount: ExecutiveDecisionRegisterRegistryOpenIssues.length,
    principleCount: ExecutiveDecisionRegisterRegistryPrinciples.length,
    lifecycleStateCount: ExecutiveDecisionRegisterRegistryLifecycle.stateCount,
    registryDecisionCount: ExecutiveDecisionRegisterRegistryDecisions.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-3:1 — Executive Decision Register Foundation",
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
  acceptsFurtherRegistration: false as const,
  modelPhase: false as const,
  validationPhase: false as const,
  manifestPhase: false as const,
  platformPhase: false as const,
  importsRtc2: false as const,
  importsRtc1: false as const,
  importsApp8: false as const,
} as const);

/** Deterministic frozen Registry summary. */
export function getExecutiveDecisionRegisterRegistrySummary():
  ExecutiveDecisionRegisterRegistrySummary {
  return Object.freeze({
    registryId: ExecutiveDecisionRegisterRegistryId,
    version: ExecutiveDecisionRegisterRegistryVersion,
    name: ExecutiveDecisionRegisterRegistryName,
    namespace: ExecutiveDecisionRegisterRegistryNamespace,
    status: ExecutiveDecisionRegisterRegistryStatus,
    readiness: ExecutiveDecisionRegisterRegistryReadiness,
    entryCount: sealedEntries.length,
    aliasCount,
    openIssueCount: ExecutiveDecisionRegisterRegistryOpenIssues.length,
    sourceFoundation: "RTC-3:1/ExecutiveDecisionRegisterFoundation" as const,
    nextPhase: ExecutiveDecisionRegisterRegistryNextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveDecisionRegisterRegistry = () =>
  ExecutiveDecisionRegisterRegistry;
