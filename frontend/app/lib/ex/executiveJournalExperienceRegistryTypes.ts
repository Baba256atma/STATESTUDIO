/**
 * EX-2:2 — Executive Journal Experience Registry Types.
 *
 * Closed vocabularies and discriminated result types for closed-world
 * Registry discovery. Metadata-only. No runtime enforcement. No UI.
 *
 * Ownership: owned exclusively by EX-2:2.
 */

import type { ExecutiveJournalExperienceFoundation } from "./executiveJournalExperienceFoundation.ts";

/** Registry status. */
export type ExecutiveJournalExperienceRegistryStatus = "Registry";

/** Immediate next-phase readiness. */
export type ExecutiveJournalExperienceRegistryReadiness = "ReadyForModel";

/** Registry lifecycle states (metadata only). */
export type ExecutiveJournalExperienceRegistryLifecycleState =
  | "Declared"
  | "Populated"
  | "Sealed";

/** Closed resolution success/failure codes. */
export type ExecutiveJournalExperienceRegistryResolveCode =
  | "Resolved"
  | "UnknownIdentity"
  | "MalformedIdentity";

/**
 * Closed registration/conflict codes.
 * Preserves RTC registry names and extends with EX-2:2 seal/reference codes.
 */
export type ExecutiveJournalExperienceRegistryConflictCode =
  | "DuplicateCanonicalId"
  | "DuplicateNamespace"
  | "DuplicateAlias"
  | "AliasCanonicalCollision"
  | "AliasAmbiguous"
  | "IdentityKeyMismatch"
  | "FoundationNotReadyForRegistry"
  | "EntryReferenceMismatch"
  | "UnexpectedEntry"
  | "RegistryAlreadySealed";

export type ExecutiveJournalExperienceRegistryResolvedBy =
  | "controlId"
  | "namespace"
  | "alias";

/**
 * Canonical registry entry wrapping EX-2:1 Foundation by exact reference.
 * MUST NOT clone or rewrite the Foundation aggregate.
 */
export interface ExecutiveJournalExperienceRegistryEntry {
  readonly entryId: "EX-2:2/Entry/ExecutiveJournalExperienceFoundation";
  readonly controlId: "EX-2:1/ExecutiveJournalExperienceFoundation";
  readonly namespace: "nexora.ex.executive.journal.experience.foundation";
  readonly status: "Foundation";
  readonly readiness: "ReadyForRegistry";
  readonly phase: "EX-2:1";
  readonly aliases: readonly [
    "ExecutiveJournalExperienceFoundation",
    "EX-2:1",
  ];
  readonly order: 1;
  readonly foundation: typeof ExecutiveJournalExperienceFoundation;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Successful resolution preserves exact canonical entry and Foundation. */
export interface ExecutiveJournalExperienceRegistryResolveSuccess {
  readonly ok: true;
  readonly code: "Resolved";
  readonly query: string;
  readonly resolvedBy: ExecutiveJournalExperienceRegistryResolvedBy;
  readonly entry: ExecutiveJournalExperienceRegistryEntry;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Explicit non-success for unknown or malformed identity. */
export interface ExecutiveJournalExperienceRegistryResolveFailure {
  readonly ok: false;
  readonly code: "UnknownIdentity" | "MalformedIdentity";
  readonly query: string;
  readonly entry: null;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export type ExecutiveJournalExperienceRegistryResolveResult =
  | ExecutiveJournalExperienceRegistryResolveSuccess
  | ExecutiveJournalExperienceRegistryResolveFailure;

/** Successful sealed registration set. */
export interface ExecutiveJournalExperienceRegistryRegisterSuccess {
  readonly ok: true;
  readonly code: "Registered";
  readonly entries: readonly ExecutiveJournalExperienceRegistryEntry[];
  readonly entryCount: 1;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Registration conflict or invariant failure. */
export interface ExecutiveJournalExperienceRegistryRegisterFailure {
  readonly ok: false;
  readonly code: ExecutiveJournalExperienceRegistryConflictCode;
  readonly detail: string;
  readonly entries: null;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export type ExecutiveJournalExperienceRegistryRegisterResult =
  | ExecutiveJournalExperienceRegistryRegisterSuccess
  | ExecutiveJournalExperienceRegistryRegisterFailure;

/** Deterministic Registry summary — no sensitive payloads. */
export interface ExecutiveJournalExperienceRegistrySummary {
  readonly identity: "EX-2:2/ExecutiveJournalExperienceRegistry";
  readonly namespace: "nexora.ex.executive.journal.experience.registry";
  readonly status: "Registry";
  readonly readiness: "ReadyForModel";
  readonly phase: "EX-2:2";
  readonly previousPhase: "EX-2:1 — Executive Journal Experience Foundation";
  readonly nextPhase: "EX-2:3 — Executive Journal Experience Model";
  readonly metadataOnly: true;
  readonly closedWorld: true;
  readonly sealed: true;
  readonly sideEffectFree: true;
  readonly entryCount: 1;
  readonly canonicalRegisteredId: "EX-2:1/ExecutiveJournalExperienceFoundation";
  readonly canonicalRegisteredNamespace: "nexora.ex.executive.journal.experience.foundation";
  readonly approvedAliases: readonly [
    "ExecutiveJournalExperienceRegistry",
    "EX-2:2",
  ];
  readonly registeredEntryAliases: readonly [
    "ExecutiveJournalExperienceFoundation",
    "EX-2:1",
  ];
  readonly authorizationId: "AD-EX2-09";
  readonly pendingGateIds: readonly ["G-EX2-04", "G-EX2-07", "G-EX2-12"];
  readonly openIssueIds: readonly string[];
  readonly ex23Authorized: false;
  readonly routeAuthorized: false;
  readonly productionAuthorized: false;
  readonly deploymentAuthorized: false;
}
