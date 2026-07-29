/**
 * EX-2:2 — Executive Journal Experience Registry.
 *
 * Deterministic immutable closed-world Registry for discovering the approved
 * EX-2:1 Executive Journal Experience Foundation. Consumes EX-2:1 by exact
 * reference only. Metadata-only — no UI, routes, RTC runtime, production
 * behavior, networking, persistence, or deployment.
 *
 * Ownership: owned exclusively by EX-2:2.
 *
 * Public exports:
 *   ExecutiveJournalExperienceRegistryId
 *   ExecutiveJournalExperienceRegistryNamespace
 *   ExecutiveJournalExperienceRegistryStatus
 *   ExecutiveJournalExperienceRegistryReadiness
 *   ExecutiveJournalExperienceRegistry
 *   resolveExecutiveJournalExperienceById()
 *   resolveExecutiveJournalExperienceByNamespace()
 *   resolveExecutiveJournalExperienceByAlias()
 *   resolveExecutiveJournalExperienceIdentity()
 *   getExecutiveJournalExperienceRegistrySummary()
 */

import {
  ExecutiveJournalExperienceFoundation,
  getExecutiveJournalExperienceFoundationSummary,
} from "./executiveJournalExperienceFoundation.ts";
import {
  ExecutiveJournalExperienceRegistryConflictCodes,
  ExecutiveJournalExperienceRegistryContracts,
} from "./executiveJournalExperienceRegistryContracts.ts";
import {
  ExecutiveJournalExperienceFoundationRegistryEntry,
  ExecutiveJournalExperienceRegistryCanonicalEntries,
  ExecutiveJournalExperienceRegistrySealResult,
  registerExecutiveJournalExperienceEntries,
} from "./executiveJournalExperienceRegistryEntries.ts";
import {
  ExecutiveJournalExperienceRegistryApprovedAliases,
  ExecutiveJournalExperienceRegistryId,
  ExecutiveJournalExperienceRegistryIdentity,
  ExecutiveJournalExperienceRegistryNamespace,
  ExecutiveJournalExperienceRegistryNextPhase,
  ExecutiveJournalExperienceRegistryPhase,
  ExecutiveJournalExperienceRegistryPreviousPhase,
  ExecutiveJournalExperienceRegistryReadinessValue,
  ExecutiveJournalExperienceRegistryStatusValue,
  ExecutiveJournalExperienceRegistryTitle,
  isWellFormedExecutiveJournalExperienceRegistryIdentity,
} from "./executiveJournalExperienceRegistryIdentity.ts";
import {
  ExecutiveJournalExperienceRegistryLifecycle,
  isCanonicalExecutiveJournalExperienceRegistryLifecycleState,
} from "./executiveJournalExperienceRegistryLifecycle.ts";
import {
  ExecutiveJournalExperienceRegistryAuthorization,
  ExecutiveJournalExperienceRegistryDependencyBoundaries,
  ExecutiveJournalExperienceRegistryMetadata,
  ExecutiveJournalExperienceRegistryOpenIssuesAndGates,
  ExecutiveJournalExperienceRegistryOwnership,
  ExecutiveJournalExperienceRegistryPhaseMetadata,
  ExecutiveJournalExperienceRegistryPrinciples,
  ExecutiveJournalExperienceRegistryUpstreamPreservation,
} from "./executiveJournalExperienceRegistryMetadata.ts";
import type {
  ExecutiveJournalExperienceRegistryEntry,
  ExecutiveJournalExperienceRegistryResolveResult,
  ExecutiveJournalExperienceRegistrySummary,
} from "./executiveJournalExperienceRegistryTypes.ts";

export {
  ExecutiveJournalExperienceRegistryId,
  ExecutiveJournalExperienceRegistryNamespace,
  ExecutiveJournalExperienceRegistryPhase,
  ExecutiveJournalExperienceRegistryPreviousPhase,
  ExecutiveJournalExperienceRegistryNextPhase,
  ExecutiveJournalExperienceRegistryTitle,
  ExecutiveJournalExperienceRegistryApprovedAliases,
};

export const ExecutiveJournalExperienceRegistryStatus =
  ExecutiveJournalExperienceRegistryStatusValue;
export const ExecutiveJournalExperienceRegistryReadiness =
  ExecutiveJournalExperienceRegistryReadinessValue;

export {
  registerExecutiveJournalExperienceEntries,
  ExecutiveJournalExperienceFoundationRegistryEntry,
  ExecutiveJournalExperienceRegistryCanonicalEntries,
};

export { isCanonicalExecutiveJournalExperienceRegistryLifecycleState };

if (ExecutiveJournalExperienceRegistrySealResult.ok !== true) {
  throw new Error(
    "EX-2:2 registry seal failed for the canonical EX-2:1 Foundation entry.",
  );
}

const sealedEntries = ExecutiveJournalExperienceRegistrySealResult.entries;

const byControlId = Object.freeze(
  Object.fromEntries(
    sealedEntries.map((entry) => [entry.controlId, entry]),
  ) as Readonly<Record<string, ExecutiveJournalExperienceRegistryEntry>>,
);

const byNamespace = Object.freeze(
  Object.fromEntries(
    sealedEntries.map((entry) => [entry.namespace, entry]),
  ) as Readonly<Record<string, ExecutiveJournalExperienceRegistryEntry>>,
);

const byAlias = Object.freeze(
  Object.fromEntries(
    sealedEntries.flatMap((entry) =>
      entry.aliases.map((alias) => [alias, entry] as const)
    ),
  ) as Readonly<Record<string, ExecutiveJournalExperienceRegistryEntry>>,
);

const resolveFailure = (
  code: "UnknownIdentity" | "MalformedIdentity",
  query: string,
): ExecutiveJournalExperienceRegistryResolveResult =>
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
  entry: ExecutiveJournalExperienceRegistryEntry,
): ExecutiveJournalExperienceRegistryResolveResult =>
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
export function resolveExecutiveJournalExperienceById(
  controlId: unknown,
): ExecutiveJournalExperienceRegistryResolveResult {
  if (!isWellFormedExecutiveJournalExperienceRegistryIdentity(controlId)) {
    return resolveFailure("MalformedIdentity", String(controlId));
  }
  const entry = byControlId[controlId];
  if (!entry) {
    return resolveFailure("UnknownIdentity", controlId);
  }
  return resolveSuccess(controlId, "controlId", entry);
}

/** Resolve by canonical namespace. */
export function resolveExecutiveJournalExperienceByNamespace(
  namespace: unknown,
): ExecutiveJournalExperienceRegistryResolveResult {
  if (!isWellFormedExecutiveJournalExperienceRegistryIdentity(namespace)) {
    return resolveFailure("MalformedIdentity", String(namespace));
  }
  const entry = byNamespace[namespace];
  if (!entry) {
    return resolveFailure("UnknownIdentity", namespace);
  }
  return resolveSuccess(namespace, "namespace", entry);
}

/** Resolve by approved alias. */
export function resolveExecutiveJournalExperienceByAlias(
  alias: unknown,
): ExecutiveJournalExperienceRegistryResolveResult {
  if (!isWellFormedExecutiveJournalExperienceRegistryIdentity(alias)) {
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
export function resolveExecutiveJournalExperienceIdentity(
  query: unknown,
): ExecutiveJournalExperienceRegistryResolveResult {
  if (!isWellFormedExecutiveJournalExperienceRegistryIdentity(query)) {
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
export function isExecutiveJournalExperienceRegistered(
  query: unknown,
): boolean {
  return resolveExecutiveJournalExperienceIdentity(query).ok === true;
}

/** Enumerate sealed entries in deterministic order. */
export function enumerateExecutiveJournalExperienceRegistryEntries():
  readonly ExecutiveJournalExperienceRegistryEntry[] {
  return sealedEntries;
}

/**
 * Canonical immutable Executive Journal Experience Registry aggregate.
 */
export const ExecutiveJournalExperienceRegistry = Object.freeze({
  identity: ExecutiveJournalExperienceRegistryIdentity,
  lifecycle: ExecutiveJournalExperienceRegistryLifecycle,
  contracts: ExecutiveJournalExperienceRegistryContracts,
  conflictCatalogue: ExecutiveJournalExperienceRegistryConflictCodes,
  canonicalEntry: ExecutiveJournalExperienceFoundationRegistryEntry,
  entries: sealedEntries,
  sealedEntryCatalogue: ExecutiveJournalExperienceRegistryCanonicalEntries,
  principles: ExecutiveJournalExperienceRegistryPrinciples,
  authorization: ExecutiveJournalExperienceRegistryAuthorization,
  metadata: ExecutiveJournalExperienceRegistryMetadata,
  ownership: ExecutiveJournalExperienceRegistryOwnership,
  dependencyBoundaries:
    ExecutiveJournalExperienceRegistryDependencyBoundaries,
  phaseMetadata: ExecutiveJournalExperienceRegistryPhaseMetadata,
  upstream: ExecutiveJournalExperienceRegistryUpstreamPreservation,
  openIssuesAndGates: ExecutiveJournalExperienceRegistryOpenIssuesAndGates,
  foundation: ExecutiveJournalExperienceFoundation,
  status: ExecutiveJournalExperienceRegistryStatusValue,
  readiness: ExecutiveJournalExperienceRegistryReadinessValue,
  phase: ExecutiveJournalExperienceRegistryPhase,
  previousPhase: ExecutiveJournalExperienceRegistryPreviousPhase,
  nextPhase: ExecutiveJournalExperienceRegistryNextPhase,
  resolve: resolveExecutiveJournalExperienceIdentity,
  resolveById: resolveExecutiveJournalExperienceById,
  resolveByNamespace: resolveExecutiveJournalExperienceByNamespace,
  resolveByAlias: resolveExecutiveJournalExperienceByAlias,
  isRegistered: isExecutiveJournalExperienceRegistered,
  isCanonicalLifecycleState:
    isCanonicalExecutiveJournalExperienceRegistryLifecycleState,
  enumerate: enumerateExecutiveJournalExperienceRegistryEntries,
  statistics: Object.freeze({
    entryCount: sealedEntries.length,
    aliasCount: sealedEntries.reduce(
      (count, entry) => count + entry.aliases.length,
      0,
    ),
    contractCount: ExecutiveJournalExperienceRegistryContracts.length,
    conflictCodeCount: ExecutiveJournalExperienceRegistryConflictCodes.length,
    principleCount: ExecutiveJournalExperienceRegistryPrinciples.length,
    lifecycleStateCount:
      ExecutiveJournalExperienceRegistryLifecycle.stateCount,
    openIssueCount:
      ExecutiveJournalExperienceFoundation.openIssues.issueIds.length,
    pendingGateCount:
      ExecutiveJournalExperienceFoundation.pendingGates.length,
  }),
  upstreamDependencies: Object.freeze([
    "EX-2:1 — Executive Journal Experience Foundation",
  ]),
  metadataOnly: true as const,
  sideEffectFree: true as const,
  closedWorld: true as const,
  sealed: true as const,
  immutable: true as const,
  deterministic: true as const,
  storesRuntimeValues: false as const,
  executesTransitions: false as const,
  performsValidation: false as const,
  modifiesState: false as const,
  communicatesWithUi: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  createsRoute: false as const,
  createsProvider: false as const,
  createsUi: false as const,
  liveRtc2Integration: false as const,
  productionBehavior: false as const,
  deploymentAuthorized: false as const,
  resolvesOpenIssues: false as const,
  recreatesFoundation: false as const,
  acceptsFurtherRegistration: false as const,
  modelPhase: false as const,
  ex23Authorized: false as const,
  ex23Created: false as const,
  importsArchitecture: false as const,
  importsRtc: false as const,
  importsApp8: false as const,
  importsTier0: false as const,
} as const);

/** Deterministic frozen Registry summary — no sensitive payloads. */
export function getExecutiveJournalExperienceRegistrySummary():
  ExecutiveJournalExperienceRegistrySummary {
  const foundationSummary = getExecutiveJournalExperienceFoundationSummary();
  return Object.freeze({
    identity: ExecutiveJournalExperienceRegistryId,
    namespace: ExecutiveJournalExperienceRegistryNamespace,
    status: ExecutiveJournalExperienceRegistryStatusValue,
    readiness: ExecutiveJournalExperienceRegistryReadinessValue,
    phase: ExecutiveJournalExperienceRegistryPhase,
    previousPhase: ExecutiveJournalExperienceRegistryPreviousPhase,
    nextPhase: ExecutiveJournalExperienceRegistryNextPhase,
    metadataOnly: true as const,
    closedWorld: true as const,
    sealed: true as const,
    sideEffectFree: true as const,
    entryCount: 1 as const,
    canonicalRegisteredId:
      ExecutiveJournalExperienceFoundationRegistryEntry.controlId,
    canonicalRegisteredNamespace:
      ExecutiveJournalExperienceFoundationRegistryEntry.namespace,
    approvedAliases: ExecutiveJournalExperienceRegistryApprovedAliases,
    registeredEntryAliases:
      ExecutiveJournalExperienceFoundationRegistryEntry.aliases,
    authorizationId: "AD-EX2-09" as const,
    pendingGateIds: ExecutiveJournalExperienceFoundation.pendingGates,
    openIssueIds: Object.freeze([...foundationSummary.openIssueIds]) as readonly string[],
    ex23Authorized: false as const,
    routeAuthorized: false as const,
    productionAuthorized: false as const,
    deploymentAuthorized: false as const,
  });
}

export const getExecutiveJournalExperienceRegistry = () =>
  ExecutiveJournalExperienceRegistry;
