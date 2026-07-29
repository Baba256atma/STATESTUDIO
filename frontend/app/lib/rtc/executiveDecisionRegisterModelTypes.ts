/**
 * RTC-3:3 — Executive Decision Register Model Types.
 *
 * Closed model vocabularies, entity kinds, relationships, and state distinctions.
 * Metadata-only. No runtime enforcement. No UI.
 *
 * Ownership: owned exclusively by RTC-3:3.
 */

/** Model status. */
export type ExecutiveDecisionRegisterModelStatus = "Model";

/** Immediate next-phase readiness (RTC-1:3 / RTC-2:3 vocabulary). */
export type ExecutiveDecisionRegisterModelReadiness = "ReadyForValidation";

/** Model lifecycle states (metadata only). */
export type ExecutiveDecisionRegisterModelLifecycleState =
  | "Declared"
  | "Structured"
  | "Sealed";

/** Canonical entity kinds — exactly fourteen. */
export type ExecutiveDecisionRegisterEntityKind =
  | "DecisionRegister"
  | "DecisionRecord"
  | "DecisionProposal"
  | "DecisionAuthority"
  | "DecisionConfirmation"
  | "DecisionAlternative"
  | "DecisionConstraint"
  | "DecisionEvidence"
  | "DecisionCorrection"
  | "DecisionDispute"
  | "DecisionSupersession"
  | "DecisionOutcomeReference"
  | "DecisionProjection"
  | "DecisionDisposition";

/** Authority state. */
export type ExecutiveDecisionRegisterAuthorityState =
  | "NonAuthoritative"
  | "Authoritative";

/** Origin state. */
export type ExecutiveDecisionRegisterOriginState =
  | "HumanAuthored"
  | "AiProposed"
  | "SystemDerived";

/** Decision lifecycle (foundation-aligned). */
export type ExecutiveDecisionRegisterDecisionLifecycleState =
  | "Proposed"
  | "Confirmed"
  | "Effective"
  | "Disputed"
  | "Superseded"
  | "Closed"
  | "Disposed";

/** Currency. */
export type ExecutiveDecisionRegisterCurrencyState =
  | "Current"
  | "Superseded";

/** Dispute. */
export type ExecutiveDecisionRegisterDisputeState =
  | "Undisputed"
  | "Disputed"
  | "Resolved";

/** Closure. */
export type ExecutiveDecisionRegisterClosureState = "Open" | "Closed";

/** Disposition. */
export type ExecutiveDecisionRegisterDispositionState =
  | "Active"
  | "Disposed";

/** Evidence category (foundation-aligned naming for model surface). */
export type ExecutiveDecisionRegisterEvidenceCategory =
  | "Referenced"
  | "VersionPinned"
  | "ContentAddressed"
  | "Unavailable"
  | "Disputed";

/** Privacy categories — private reflection is outside this model. */
export type ExecutiveDecisionRegisterPrivacyCategory =
  | "SharedExecutiveRecord"
  | "RestrictedExecutiveRecord"
  | "RegulatedOrPrivilegedRecord";

/** Append-only relationship kinds. */
export type ExecutiveDecisionRegisterRelationshipKind =
  | "ProposedFrom"
  | "ConfirmedBy"
  | "Corrects"
  | "Disputes"
  | "ResolvesDispute"
  | "Supersedes"
  | "ReferencesOutcome"
  | "DerivedFrom"
  | "DisposedBy";

/** Entity field declaration — structure only. */
export interface ExecutiveDecisionRegisterEntityField {
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
export interface ExecutiveDecisionRegisterEntityModel {
  readonly entityId: `RTC-3:3/Entity/${ExecutiveDecisionRegisterEntityKind}`;
  readonly entityName: ExecutiveDecisionRegisterEntityKind;
  readonly description: string;
  readonly root: boolean;
  readonly parentRoot: "DecisionRegister";
  readonly fields: readonly ExecutiveDecisionRegisterEntityField[];
  readonly fieldCount: number;
  readonly lifecycleApplicability: readonly string[];
  readonly requiresAuthorityRef: boolean;
  readonly requiresHumanConfirmation: boolean;
  readonly requiresProvenance: boolean;
  readonly requiresEvidence: boolean;
  readonly privacyCategoryRequired: boolean;
  readonly classificationRequired: boolean;
  readonly allowedRelationshipKinds: readonly ExecutiveDecisionRegisterRelationshipKind[];
  readonly requiresProducingEvent: boolean;
  readonly projectionEligible: boolean;
  readonly telemetryRestricted: true;
  readonly appendOnly: true;
  readonly aiMayCreateAuthoritative: false;
  readonly allowsPrivateReflection: false;
  readonly mayBeDerived: boolean;
  readonly stableIdentity: true;
  readonly storesRuntimeValues: false;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical model identity descriptor. */
export interface ExecutiveDecisionRegisterModelIdentityDescriptor {
  readonly id: "RTC-3:3/ExecutiveDecisionRegisterModel";
  readonly name: "Executive Decision Register Model";
  readonly phaseId: "RTC-3:3";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.decision.register.model";
  readonly status: ExecutiveDecisionRegisterModelStatus;
  readonly readiness: ExecutiveDecisionRegisterModelReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Decision Register";
  readonly sourceRegistry: "RTC-3:2/ExecutiveDecisionRegisterRegistry";
  readonly upstream: "RTC-3:2 — Executive Decision Register Registry";
  readonly nextPhase: "RTC-3:4 — Executive Decision Register Validation";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic model summary. */
export interface ExecutiveDecisionRegisterModelSummary {
  readonly modelId: "RTC-3:3/ExecutiveDecisionRegisterModel";
  readonly version: "1.0.0";
  readonly name: "Executive Decision Register Model";
  readonly namespace: "nexora.rtc.executive.decision.register.model";
  readonly status: ExecutiveDecisionRegisterModelStatus;
  readonly readiness: ExecutiveDecisionRegisterModelReadiness;
  readonly rootEntity: "DecisionRegister";
  readonly entityCount: number;
  readonly relationshipKindCount: number;
  readonly contractCount: number;
  readonly openIssueCount: number;
  readonly sourceRegistry: "RTC-3:2/ExecutiveDecisionRegisterRegistry";
  readonly nextPhase: "RTC-3:4 — Executive Decision Register Validation";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
