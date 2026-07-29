/**
 * RTC-2:1 — Executive Journal Runtime Foundation Types.
 *
 * Readonly contracts and closed vocabularies for the Executive Journal Runtime.
 * Metadata-only. No runtime enforcement. No UI.
 *
 * Ownership: owned exclusively by RTC-2:1.
 */

/** Foundation status. */
export type ExecutiveJournalRuntimeFoundationStatus = "Foundation";

/** Immediate next-phase readiness. */
export type ExecutiveJournalRuntimeFoundationReadiness = "ReadyForRegistry";

/**
 * Canonical journal record states (§2.3).
 * Corrections supersede; they do not erase.
 */
export type ExecutiveJournalLifecycleState =
  | "Proposed"
  | "Accepted"
  | "Disputed"
  | "Superseded"
  | "Closed"
  | "Disposed";

/** Foundation-recognised processing lifecycle events (§2.2). */
export type ExecutiveJournalRuntimeEventName =
  | "Propose"
  | "Evaluate"
  | "Confirm"
  | "Commit"
  | "Project"
  | "Notify"
  | "Review"
  | "Dispose";

/** Logical architecture layers (§2.1). */
export type ExecutiveJournalSectionName =
  | "CaptureAdapters"
  | "PolicyAuthorityGate"
  | "EventWriter"
  | "CanonicalEventStore"
  | "ProjectionEngine"
  | "QueryExportPlane"
  | "OperationsPlane";

/** Public runtime contract names exposed by Foundation. */
export type ExecutiveJournalRuntimeContractName =
  | "JournalEventEnvelope"
  | "JournalAuthority"
  | "JournalInformationClass"
  | "JournalProjection"
  | "JournalDisclosure"
  | "JournalCorrection"
  | "JournalIntegrity"
  | "JournalAiBoundary";

/** Declared foundation event families (§3.2). */
export type ExecutiveJournalEventFamilyName =
  | "Intent"
  | "Decision"
  | "Commitment"
  | "RiskException"
  | "Outcome"
  | "Governance";

/** Declared information classes (§4.2). */
export type ExecutiveJournalInformationClassName =
  | "PrivateReflection"
  | "RestrictedWorking"
  | "ExecutiveRecord"
  | "RegulatedPrivileged";

/** Declared read-side consumers / projection surfaces. */
export type ExecutiveJournalRuntimeConsumerName =
  | "DecisionRegister"
  | "CommitmentLedger"
  | "RiskExceptionRegister"
  | "OutcomeTimeline"
  | "ControlEvidence"
  | "ExecutiveExperience"
  | "IndependentAssurance";

/** Declared capture source categories (§2.1 Capture adapters). */
export type ExecutiveJournalCaptureSourceCategory =
  | "JournalUI"
  | "MeetingWorkflow"
  | "ApprovedAPI"
  | "ApprovedConnector"
  | "CorrectionWorkflow"
  | "RetentionDisposition";

/** Canonical foundation identity descriptor. */
export interface ExecutiveJournalRuntimeIdentityDescriptor {
  readonly foundationId: "RTC-2:1/ExecutiveJournalRuntimeFoundation";
  readonly foundationName: "Executive Journal Runtime Foundation";
  readonly foundationVersion: "1.0.0";
  readonly foundationNamespace: "nexora.rtc.executive.journal.foundation";
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly phase: "RTC-2";
  readonly stage: "Foundation";
  readonly sourcePhase: "RTC-2:1";
  readonly owner: "RTC-2 Executive Journal Runtime Foundation";
  readonly status: ExecutiveJournalRuntimeFoundationStatus;
  readonly readiness: ExecutiveJournalRuntimeFoundationReadiness;
  readonly target: "Nexora Executive Experience MVP";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Journal and event identity format metadata. */
export interface ExecutiveJournalIdentityFormatDescriptor {
  readonly identityId: "RTC-2:1/JournalIdentityFormat";
  readonly journalPrefix: "RTC-JRN";
  readonly eventPrefix: "RTC-JEVT";
  readonly journalExample: "RTC-JRN-00000001";
  readonly eventExample: "RTC-JEVT-00000001";
  readonly journalPattern: "RTC-JRN-{8-digit-sequence}";
  readonly eventPattern: "RTC-JEVT-{time-sortable-unique}";
  readonly eventIdNeverReused: true;
  readonly sequenceAssignedByWriterOnly: true;
  readonly appendOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Lifecycle declaration for journal records. */
export interface ExecutiveJournalLifecycleDeclaration {
  readonly lifecycleId: "RTC-2:1/ExecutiveJournalLifecycle";
  readonly sourcePhase: "RTC-2:1";
  readonly states: readonly ExecutiveJournalLifecycleState[];
  readonly stateCount: number;
  readonly transitions: Readonly<
    Record<
      ExecutiveJournalLifecycleState,
      readonly ExecutiveJournalLifecycleState[]
    >
  >;
  readonly appendOnly: true;
  readonly correctionsDoNotErase: true;
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Declarative runtime contract (non-executable). */
export interface ExecutiveJournalRuntimeContractDeclaration {
  readonly contractId: `RTC-2:1/Contract/${ExecutiveJournalRuntimeContractName}`;
  readonly contractName: ExecutiveJournalRuntimeContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly executable: false;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative runtime event (non-dispatching). */
export interface ExecutiveJournalRuntimeEventDeclaration {
  readonly eventId: `RTC-2:1/Event/${ExecutiveJournalRuntimeEventName}`;
  readonly eventName: ExecutiveJournalRuntimeEventName;
  readonly description: string;
  readonly dispatches: false;
  readonly businessEvent: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative architecture section. */
export interface ExecutiveJournalSectionDeclaration {
  readonly sectionId: `RTC-2:1/Section/${ExecutiveJournalSectionName}`;
  readonly sectionName: ExecutiveJournalSectionName;
  readonly description: string;
  readonly required: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative read-side consumer. */
export interface ExecutiveJournalRuntimeConsumerDeclaration {
  readonly consumerId: `RTC-2:1/Consumer/${ExecutiveJournalRuntimeConsumerName}`;
  readonly consumerName: ExecutiveJournalRuntimeConsumerName;
  readonly accessMode: "ReadOnly";
  readonly mayMutateJournal: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative capture source. */
export interface ExecutiveJournalCaptureSourceDeclaration {
  readonly sourceId: string;
  readonly category: ExecutiveJournalCaptureSourceCategory;
  readonly action: string;
  readonly description: string;
  readonly mayAcceptAsDecision: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Deterministic foundation summary. */
export interface ExecutiveJournalRuntimeFoundationSummary {
  readonly foundationId: "RTC-2:1/ExecutiveJournalRuntimeFoundation";
  readonly version: "1.0.0";
  readonly name: "Executive Journal Runtime Foundation";
  readonly namespace: "nexora.rtc.executive.journal.foundation";
  readonly status: ExecutiveJournalRuntimeFoundationStatus;
  readonly readiness: ExecutiveJournalRuntimeFoundationReadiness;
  readonly sectionCount: number;
  readonly contractCount: number;
  readonly eventCount: number;
  readonly lifecycleStateCount: number;
  readonly consumerCount: number;
  readonly responsibilityCount: number;
  readonly guaranteeCount: number;
  readonly nextPhase: "RTC-2:2 — Executive Journal Runtime Registry";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
