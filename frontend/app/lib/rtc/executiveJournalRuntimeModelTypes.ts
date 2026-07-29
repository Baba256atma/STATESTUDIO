/**
 * RTC-2:3 — Executive Journal Runtime Model Types.
 *
 * Closed model vocabularies and discriminated state distinctions.
 * Metadata-only. No runtime enforcement. No UI.
 *
 * Ownership: owned exclusively by RTC-2:3.
 */

/** Model status. */
export type ExecutiveJournalRuntimeModelStatus = "Model";

/** Immediate next-phase readiness (RTC-1:3 vocabulary). */
export type ExecutiveJournalRuntimeModelReadiness = "ReadyForValidation";

/** Model lifecycle states (metadata only). */
export type ExecutiveJournalRuntimeModelLifecycleState =
  | "Declared"
  | "Structured"
  | "Sealed";

/** Canonical entity kinds. */
export type ExecutiveJournalRuntimeEntityKind =
  | "Journal"
  | "Intent"
  | "Decision"
  | "Commitment"
  | "Risk"
  | "Exception"
  | "Outcome"
  | "EvidenceReference"
  | "AuthorityReference"
  | "Correction"
  | "Dispute"
  | "Projection"
  | "DisclosureRecord"
  | "DispositionRecord";

/** Proposed versus accepted. */
export type ExecutiveJournalAcceptanceState = "Proposed" | "Accepted";

/** Dispute lifecycle. */
export type ExecutiveJournalDisputeState =
  | "Undisputed"
  | "Disputed"
  | "Resolved";

/** Current versus superseded. */
export type ExecutiveJournalCurrencyState = "Current" | "Superseded";

/** Open versus closed. */
export type ExecutiveJournalClosureState = "Open" | "Closed";

/** Active versus disposed. */
export type ExecutiveJournalDispositionState = "Active" | "Disposed";

/** Authoritative versus derived — not optional flags. */
export type ExecutiveJournalAuthorityKind = "Authoritative" | "Derived";

/** Shared executive record versus private reflection. */
export type ExecutiveJournalRecordVisibility =
  | "SharedExecutiveRecord"
  | "PrivateReflection";

/** Human-confirmed versus AI-proposed. */
export type ExecutiveJournalConfirmationSource =
  | "HumanConfirmed"
  | "AiProposed";

/** Closed information categories (foundation-aligned). */
export type ExecutiveJournalInformationCategory =
  | "PrivateReflection"
  | "RestrictedWorking"
  | "ExecutiveRecord"
  | "RegulatedPrivileged";

/** Entity field declaration — structure only. */
export interface ExecutiveJournalRuntimeEntityField {
  readonly fieldId: string;
  readonly fieldName: string;
  readonly description: string;
  readonly required: boolean;
  readonly isReference: boolean;
  readonly order: number;
  readonly mutable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Entity model declaration. */
export interface ExecutiveJournalRuntimeEntityModel {
  readonly entityId: `RTC-2:3/Entity/${ExecutiveJournalRuntimeEntityKind}`;
  readonly entityName: ExecutiveJournalRuntimeEntityKind;
  readonly description: string;
  readonly root: boolean;
  readonly fields: readonly ExecutiveJournalRuntimeEntityField[];
  readonly fieldCount: number;
  readonly requiresAuthorityRef: boolean;
  readonly allowsPrivateReflection: boolean;
  readonly mayBeDerived: boolean;
  readonly stableIdentity: true;
  readonly storesRuntimeValues: false;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical model identity descriptor. */
export interface ExecutiveJournalRuntimeModelIdentityDescriptor {
  readonly id: "RTC-2:3/ExecutiveJournalRuntimeModel";
  readonly name: "Executive Journal Runtime Model";
  readonly phaseId: "RTC-2:3";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.journal.model";
  readonly status: ExecutiveJournalRuntimeModelStatus;
  readonly readiness: ExecutiveJournalRuntimeModelReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Journal Runtime";
  readonly sourceRegistry: "RTC-2:2/ExecutiveJournalRuntimeRegistry";
  readonly upstream: "RTC-2:2 — Executive Journal Runtime Registry";
  readonly nextPhase: "RTC-2:4 — Executive Journal Runtime Validation";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic model summary. */
export interface ExecutiveJournalRuntimeModelSummary {
  readonly modelId: "RTC-2:3/ExecutiveJournalRuntimeModel";
  readonly version: "1.0.0";
  readonly name: "Executive Journal Runtime Model";
  readonly namespace: "nexora.rtc.executive.journal.model";
  readonly status: ExecutiveJournalRuntimeModelStatus;
  readonly readiness: ExecutiveJournalRuntimeModelReadiness;
  readonly rootEntity: "Journal";
  readonly entityCount: number;
  readonly contractCount: number;
  readonly invariantCount: number;
  readonly openIssueCount: number;
  readonly sourceRegistry: "RTC-2:2/ExecutiveJournalRuntimeRegistry";
  readonly nextPhase: "RTC-2:4 — Executive Journal Runtime Validation";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
