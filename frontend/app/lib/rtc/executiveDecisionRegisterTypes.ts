/**
 * RTC-3:1 — Executive Decision Register Foundation Types.
 *
 * Closed vocabularies and readonly contracts for the Decision Register.
 * Metadata-only. No runtime enforcement. No UI.
 *
 * Ownership: owned exclusively by RTC-3:1.
 */

/** Foundation status. */
export type ExecutiveDecisionRegisterFoundationStatus = "Foundation";

/** Immediate next-phase readiness. */
export type ExecutiveDecisionRegisterFoundationReadiness = "ReadyForRegistry";

/**
 * Closed decision-record lifecycle states.
 * Append-only transitions; no in-place authoritative mutation.
 */
export type ExecutiveDecisionRegisterLifecycleState =
  | "Proposed"
  | "Confirmed"
  | "Effective"
  | "Disputed"
  | "Superseded"
  | "Closed"
  | "Disposed";

/** Canonical decision-event descriptor names. */
export type ExecutiveDecisionRegisterEventName =
  | "DecisionProposed"
  | "DecisionConfirmed"
  | "DecisionBecameEffective"
  | "DecisionCorrected"
  | "DecisionDisputed"
  | "DecisionDisputeResolved"
  | "DecisionSuperseded"
  | "DecisionClosed"
  | "DecisionOutcomeReferenced"
  | "DecisionDisposed";

/** Public contract names exposed by Foundation. */
export type ExecutiveDecisionRegisterContractName =
  | "DecisionRecord"
  | "DecisionAuthority"
  | "DecisionConfirmation"
  | "DecisionProvenance"
  | "DecisionEvidence"
  | "DecisionPrivacy"
  | "DecisionAiBoundary"
  | "DecisionProjection"
  | "DecisionTelemetry";

/** Closed privacy categories for decision records. */
export type ExecutiveDecisionRegisterPrivacyCategory =
  | "SharedExecutiveRecord"
  | "RestrictedExecutiveRecord"
  | "RegulatedOrPrivilegedRecord";

/** Closed evidence reference kinds. */
export type ExecutiveDecisionRegisterEvidenceKind =
  | "EvidenceReference"
  | "VersionPinnedEvidence"
  | "ContentAddressedEvidence"
  | "UnavailableEvidence"
  | "DisputedEvidence";

/** Declared future projection surfaces (not implemented here). */
export type ExecutiveDecisionRegisterProjectionName =
  | "CurrentDecisionRegister"
  | "DecisionTimeline"
  | "SupersessionChain"
  | "DisputeRegister"
  | "DecisionOutcomeRelationshipView"
  | "AuthorityAndConfirmationEvidenceView";

/** Actor kinds relevant to confirmation and authority. */
export type ExecutiveDecisionRegisterActorKind =
  | "Human"
  | "Ai"
  | "System";

/** Foundation identity descriptor. */
export interface ExecutiveDecisionRegisterIdentityDescriptor {
  readonly foundationId: "RTC-3:1/ExecutiveDecisionRegisterFoundation";
  readonly foundationName: "Executive Decision Register Foundation";
  readonly foundationVersion: "1.0.0";
  readonly foundationNamespace: "nexora.rtc.executive.decision.register.foundation";
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly phase: "RTC-3";
  readonly stage: "Foundation";
  readonly sourcePhase: "RTC-3:1";
  readonly owner: "RTC-3 Executive Decision Register Foundation";
  readonly status: ExecutiveDecisionRegisterFoundationStatus;
  readonly readiness: ExecutiveDecisionRegisterFoundationReadiness;
  readonly target: "Nexora Executive Experience MVP";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Register and decision identity format metadata. */
export interface ExecutiveDecisionRegisterIdentityFormatDescriptor {
  readonly identityId: "RTC-3:1/DecisionRegisterIdentityFormat";
  readonly registerPrefix: "RTC-EDR";
  readonly decisionPrefix: "RTC-DEC";
  readonly eventPrefix: "RTC-DEVT";
  readonly registerExample: "RTC-EDR-00000001";
  readonly decisionExample: "RTC-DEC-00000001";
  readonly eventExample: "RTC-DEVT-00000001";
  readonly registerPattern: "RTC-EDR-{8-digit-sequence}";
  readonly decisionPattern: "RTC-DEC-{8-digit-sequence}";
  readonly eventPattern: "RTC-DEVT-{time-sortable-unique}";
  readonly eventIdNeverReused: true;
  readonly sequenceAssignedByWriterOnly: true;
  readonly appendOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Lifecycle declaration for decision records. */
export interface ExecutiveDecisionRegisterLifecycleDeclaration {
  readonly lifecycleId: "RTC-3:1/ExecutiveDecisionRegisterLifecycle";
  readonly sourcePhase: "RTC-3:1";
  readonly states: readonly ExecutiveDecisionRegisterLifecycleState[];
  readonly stateCount: number;
  readonly transitions: Readonly<
    Record<
      ExecutiveDecisionRegisterLifecycleState,
      readonly ExecutiveDecisionRegisterLifecycleState[]
    >
  >;
  readonly stateSemantics: Readonly<
    Record<ExecutiveDecisionRegisterLifecycleState, string>
  >;
  readonly appendOnly: true;
  readonly correctionsDoNotErase: true;
  readonly proposedIsNonAuthoritative: true;
  readonly confirmedRequiresHumanAndAuthority: true;
  readonly consequentialStatesRequireAuthorityRef: true;
  readonly supersessionRequiresPredecessorRef: true;
  readonly disputePreservesChallengedDecisionRef: true;
  readonly dispositionPreservesGovernanceEvidence: true;
  readonly reopeningRequiresNewLifecycleEvent: true;
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Event descriptor declaration. */
export interface ExecutiveDecisionRegisterEventDeclaration {
  readonly eventId: string;
  readonly eventName: ExecutiveDecisionRegisterEventName;
  readonly description: string;
  readonly dispatches: false;
  readonly persists: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Contract declaration. */
export interface ExecutiveDecisionRegisterContractDeclaration {
  readonly contractId: string;
  readonly contractName: ExecutiveDecisionRegisterContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly executable: false;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical decision descriptor field contract (no payloads). */
export interface ExecutiveDecisionRegisterDecisionDescriptorFieldFlags {
  readonly decisionIdentity: true;
  readonly journalOrRegisterIdentity: true;
  readonly decisionState: true;
  readonly claimSchemaReference: true;
  readonly actorReference: true;
  readonly authorityReference: true;
  readonly purpose: true;
  readonly classification: true;
  readonly recordCategory: true;
  readonly effectivePoint: true;
  readonly evidenceReferences: true;
  readonly alternativesReferences: true;
  readonly rationaleReference: true;
  readonly constraintReferences: true;
  readonly causationReference: true;
  readonly correlationReference: true;
  readonly producingEventReferences: true;
  readonly predecessorOrSupersessionReferences: true;
  readonly disputeReferences: true;
  readonly outcomeReferences: true;
  readonly integrityRequirements: true;
  readonly containsDecisionPayload: false;
}

/** Deterministic foundation summary. */
export interface ExecutiveDecisionRegisterFoundationSummary {
  readonly foundationId: "RTC-3:1/ExecutiveDecisionRegisterFoundation";
  readonly version: "1.0.0";
  readonly name: "Executive Decision Register Foundation";
  readonly namespace: "nexora.rtc.executive.decision.register.foundation";
  readonly status: ExecutiveDecisionRegisterFoundationStatus;
  readonly readiness: ExecutiveDecisionRegisterFoundationReadiness;
  readonly contractCount: number;
  readonly eventCount: number;
  readonly lifecycleStateCount: number;
  readonly decisionCount: number;
  readonly openIssueCount: number;
  readonly nextPhase: "RTC-3:2 — Executive Decision Register Registry";
  readonly importsRtc2: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
