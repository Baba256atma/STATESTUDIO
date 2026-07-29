/**
 * RTC-2:2 — Executive Journal Runtime Registry Types.
 *
 * Closed vocabularies and discriminated result types for registry discovery.
 * Metadata-only. No runtime enforcement. No UI.
 *
 * Ownership: owned exclusively by RTC-2:2.
 */

import { ExecutiveJournalRuntimeFoundation } from "./executiveJournalRuntimeFoundation.ts";

/** Registry status. */
export type ExecutiveJournalRuntimeRegistryStatus = "Registry";

/** Immediate next-phase readiness (project vocabulary from RTC-1:2). */
export type ExecutiveJournalRuntimeRegistryReadiness = "ReadyForModel";

/** Registry lifecycle states (metadata only). */
export type ExecutiveJournalRuntimeRegistryLifecycleState =
  | "Declared"
  | "Populated"
  | "Sealed";

/** Explicit non-success codes for lookup and registration. */
export type ExecutiveJournalRuntimeRegistryErrorCode =
  | "UnknownIdentity"
  | "MalformedIdentity"
  | "DuplicateCanonicalId"
  | "DuplicateNamespace"
  | "DuplicateAlias"
  | "AliasCanonicalCollision"
  | "AliasAmbiguous"
  | "IdentityKeyMismatch"
  | "FoundationNotReadyForRegistry";

/** Registration / lookup operation kind. */
export type ExecutiveJournalRuntimeRegistryOperation =
  | "Register"
  | "ResolveById"
  | "ResolveByNamespace"
  | "ResolveByAlias"
  | "Resolve"
  | "Enumerate"
  | "Summarize";

/**
 * Canonical registry entry wrapping the RTC-2:1 foundation by reference.
 * MUST NOT clone or rewrite the foundation aggregate.
 */
export interface ExecutiveJournalRuntimeRegistryEntry {
  readonly entryId: "RTC-2:2/Entry/ExecutiveJournalRuntimeFoundation";
  readonly controlId: "RTC-2:1/ExecutiveJournalRuntimeFoundation";
  readonly namespace: "nexora.rtc.executive.journal.foundation";
  readonly aliases: readonly string[];
  readonly order: 1;
  readonly status: "Registered";
  readonly foundationReadiness: "ReadyForRegistry";
  readonly foundation: typeof ExecutiveJournalRuntimeFoundation;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly storesRuntimeValues: false;
  readonly executable: false;
}

/** Successful resolution preserves exact canonical entry reference. */
export interface ExecutiveJournalRuntimeRegistryResolveSuccess {
  readonly ok: true;
  readonly code: "Resolved";
  readonly query: string;
  readonly resolvedBy: "controlId" | "namespace" | "alias";
  readonly entry: ExecutiveJournalRuntimeRegistryEntry;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Explicit non-success for unknown or malformed identity. */
export interface ExecutiveJournalRuntimeRegistryResolveFailure {
  readonly ok: false;
  readonly code: "UnknownIdentity" | "MalformedIdentity";
  readonly query: string;
  readonly entry: null;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export type ExecutiveJournalRuntimeRegistryResolveResult =
  | ExecutiveJournalRuntimeRegistryResolveSuccess
  | ExecutiveJournalRuntimeRegistryResolveFailure;

/** Successful sealed registration set. */
export interface ExecutiveJournalRuntimeRegistryRegisterSuccess {
  readonly ok: true;
  readonly code: "Registered";
  readonly entries: readonly ExecutiveJournalRuntimeRegistryEntry[];
  readonly entryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Registration conflict or invariant failure. */
export interface ExecutiveJournalRuntimeRegistryRegisterFailure {
  readonly ok: false;
  readonly code: Exclude<
    ExecutiveJournalRuntimeRegistryErrorCode,
    "UnknownIdentity" | "MalformedIdentity"
  >;
  readonly detail: string;
  readonly entries: null;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export type ExecutiveJournalRuntimeRegistryRegisterResult =
  | ExecutiveJournalRuntimeRegistryRegisterSuccess
  | ExecutiveJournalRuntimeRegistryRegisterFailure;

/** Deterministic registry summary. */
export interface ExecutiveJournalRuntimeRegistrySummary {
  readonly registryId: "RTC-2:2/ExecutiveJournalRuntimeRegistry";
  readonly version: "1.0.0";
  readonly name: "Executive Journal Runtime Registry";
  readonly namespace: "nexora.rtc.executive.journal.registry";
  readonly status: ExecutiveJournalRuntimeRegistryStatus;
  readonly readiness: ExecutiveJournalRuntimeRegistryReadiness;
  readonly entryCount: number;
  readonly aliasCount: number;
  readonly openIssueCount: number;
  readonly sourceFoundation: "RTC-2:1/ExecutiveJournalRuntimeFoundation";
  readonly nextPhase: "RTC-2:3 — Executive Journal Runtime Model";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Canonical registry identity descriptor. */
export interface ExecutiveJournalRuntimeRegistryIdentityDescriptor {
  readonly id: "RTC-2:2/ExecutiveJournalRuntimeRegistry";
  readonly name: "Executive Journal Runtime Registry";
  readonly phaseId: "RTC-2:2";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.journal.registry";
  readonly status: ExecutiveJournalRuntimeRegistryStatus;
  readonly readiness: ExecutiveJournalRuntimeRegistryReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Journal Runtime";
  readonly sourceFoundation: "RTC-2:1/ExecutiveJournalRuntimeFoundation";
  readonly upstream: "RTC-2:1 — Executive Journal Runtime Foundation";
  readonly nextPhase: "RTC-2:3 — Executive Journal Runtime Model";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
