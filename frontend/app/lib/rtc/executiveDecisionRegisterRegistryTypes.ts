/**
 * RTC-3:2 — Executive Decision Register Registry Types.
 *
 * Closed vocabularies and discriminated result types for registry discovery.
 * Metadata-only. No runtime enforcement. No UI.
 *
 * Ownership: owned exclusively by RTC-3:2.
 */

import { ExecutiveDecisionRegisterFoundation } from "./executiveDecisionRegisterFoundation.ts";

/** Registry status. */
export type ExecutiveDecisionRegisterRegistryStatus = "Registry";

/** Immediate next-phase readiness (project vocabulary from RTC-1:2 / RTC-2:2). */
export type ExecutiveDecisionRegisterRegistryReadiness = "ReadyForModel";

/** Registry lifecycle states (metadata only). */
export type ExecutiveDecisionRegisterRegistryLifecycleState =
  | "Declared"
  | "Populated"
  | "Sealed";

/**
 * Explicit non-success codes for lookup and registration.
 * Resolve failures use UnknownIdentity / MalformedIdentity (established RTC registry names).
 */
export type ExecutiveDecisionRegisterRegistryErrorCode =
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
export type ExecutiveDecisionRegisterRegistryOperation =
  | "Register"
  | "ResolveById"
  | "ResolveByNamespace"
  | "ResolveByAlias"
  | "Resolve"
  | "Enumerate"
  | "Summarize";

/**
 * Canonical registry entry wrapping the RTC-3:1 foundation by reference.
 * MUST NOT clone or rewrite the foundation aggregate.
 */
export interface ExecutiveDecisionRegisterRegistryEntry {
  readonly entryId: "RTC-3:2/Entry/ExecutiveDecisionRegisterFoundation";
  readonly controlId: "RTC-3:1/ExecutiveDecisionRegisterFoundation";
  readonly namespace: "nexora.rtc.executive.decision.register.foundation";
  readonly aliases: readonly string[];
  readonly order: 1;
  readonly status: "Registered";
  readonly foundationReadiness: "ReadyForRegistry";
  readonly foundation: typeof ExecutiveDecisionRegisterFoundation;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly storesRuntimeValues: false;
  readonly executable: false;
}

/** Successful resolution preserves exact canonical entry reference. */
export interface ExecutiveDecisionRegisterRegistryResolveSuccess {
  readonly ok: true;
  readonly code: "Resolved";
  readonly query: string;
  readonly resolvedBy: "controlId" | "namespace" | "alias";
  readonly entry: ExecutiveDecisionRegisterRegistryEntry;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Explicit non-success for unknown or malformed identity. */
export interface ExecutiveDecisionRegisterRegistryResolveFailure {
  readonly ok: false;
  readonly code: "UnknownIdentity" | "MalformedIdentity";
  readonly query: string;
  readonly entry: null;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export type ExecutiveDecisionRegisterRegistryResolveResult =
  | ExecutiveDecisionRegisterRegistryResolveSuccess
  | ExecutiveDecisionRegisterRegistryResolveFailure;

/** Successful sealed registration set. */
export interface ExecutiveDecisionRegisterRegistryRegisterSuccess {
  readonly ok: true;
  readonly code: "Registered";
  readonly entries: readonly ExecutiveDecisionRegisterRegistryEntry[];
  readonly entryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Registration conflict or invariant failure. */
export interface ExecutiveDecisionRegisterRegistryRegisterFailure {
  readonly ok: false;
  readonly code: Exclude<
    ExecutiveDecisionRegisterRegistryErrorCode,
    "UnknownIdentity" | "MalformedIdentity"
  >;
  readonly detail: string;
  readonly entries: null;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export type ExecutiveDecisionRegisterRegistryRegisterResult =
  | ExecutiveDecisionRegisterRegistryRegisterSuccess
  | ExecutiveDecisionRegisterRegistryRegisterFailure;

/** Deterministic registry summary. */
export interface ExecutiveDecisionRegisterRegistrySummary {
  readonly registryId: "RTC-3:2/ExecutiveDecisionRegisterRegistry";
  readonly version: "1.0.0";
  readonly name: "Executive Decision Register Registry";
  readonly namespace: "nexora.rtc.executive.decision.register.registry";
  readonly status: ExecutiveDecisionRegisterRegistryStatus;
  readonly readiness: ExecutiveDecisionRegisterRegistryReadiness;
  readonly entryCount: number;
  readonly aliasCount: number;
  readonly openIssueCount: number;
  readonly sourceFoundation: "RTC-3:1/ExecutiveDecisionRegisterFoundation";
  readonly nextPhase: "RTC-3:3 — Executive Decision Register Model";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Canonical registry identity descriptor. */
export interface ExecutiveDecisionRegisterRegistryIdentityDescriptor {
  readonly id: "RTC-3:2/ExecutiveDecisionRegisterRegistry";
  readonly name: "Executive Decision Register Registry";
  readonly phaseId: "RTC-3:2";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.decision.register.registry";
  readonly status: ExecutiveDecisionRegisterRegistryStatus;
  readonly readiness: ExecutiveDecisionRegisterRegistryReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Decision Register";
  readonly sourceFoundation: "RTC-3:1/ExecutiveDecisionRegisterFoundation";
  readonly upstream: "RTC-3:1 — Executive Decision Register Foundation";
  readonly nextPhase: "RTC-3:3 — Executive Decision Register Model";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
