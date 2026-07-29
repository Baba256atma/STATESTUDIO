/**
 * RTC-1:1 — Executive Context Runtime Foundation Types.
 *
 * Readonly contracts and closed vocabularies for the Executive Context Runtime.
 * Metadata-only. No runtime enforcement. No UI.
 *
 * Ownership: owned exclusively by RTC-1:1.
 */

/** Foundation status. */
export type ExecutiveContextRuntimeFoundationStatus = "Foundation";

/** Immediate next-phase readiness. */
export type ExecutiveContextRuntimeFoundationReadiness = "ReadyForRegistry";

/**
 * Formal Executive Context lifecycle states.
 * Only one context may remain Active.
 */
export type ExecutiveContextLifecycleState =
  | "Created"
  | "Initialized"
  | "Active"
  | "Updated"
  | "Snapshot"
  | "Archived";

/** Foundation-recognised runtime context events only. */
export type ExecutiveContextRuntimeEventName =
  | "ContextCreated"
  | "ContextActivated"
  | "ContextUpdated"
  | "ContextSnapshotCreated"
  | "ContextArchived"
  | "ContextRestored";

/** Minimum Executive Context structural sections. */
export type ExecutiveContextSectionName =
  | "Identity"
  | "Lifecycle"
  | "Manager"
  | "Company"
  | "Workspace"
  | "Pack"
  | "FocusedObject"
  | "Timeline"
  | "Journal"
  | "Stage"
  | "Advisor"
  | "Director"
  | "Metadata";

/** Public runtime contract names exposed by Foundation. */
export type ExecutiveContextRuntimeContractName =
  | "ExecutiveContext"
  | "ExecutiveContextIdentity"
  | "ExecutiveContextLifecycle"
  | "ExecutiveContextSnapshot"
  | "ExecutiveContextActivation"
  | "ExecutiveContextConsumer"
  | "ExecutiveContextEvent"
  | "ExecutiveContextIntegrity";

/** Declared runtime consumers (read-only). */
export type ExecutiveContextRuntimeConsumerName =
  | "DirectorRuntime"
  | "ExecutiveJournalRuntime"
  | "TimelineRuntime"
  | "StageRuntime"
  | "WorkspaceRuntime"
  | "AssistantRuntime";

/** Declared activation source categories. */
export type ExecutiveContextActivationSourceCategory =
  | "Manager"
  | "Runtime"
  | "System";

/** Canonical foundation identity descriptor. */
export interface ExecutiveContextRuntimeIdentityDescriptor {
  readonly foundationId: "RTC-1:1/ExecutiveContextRuntimeFoundation";
  readonly foundationName: "Executive Context Runtime Foundation";
  readonly foundationVersion: "1.0.0";
  readonly foundationNamespace: "nexora.rtc.executive.context.foundation";
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly phase: "RTC-1";
  readonly stage: "Foundation";
  readonly sourcePhase: "RTC-1:1";
  readonly owner: "RTC-1 Executive Context Runtime Foundation";
  readonly status: ExecutiveContextRuntimeFoundationStatus;
  readonly readiness: ExecutiveContextRuntimeFoundationReadiness;
  readonly target: "Nexora Executive Experience MVP";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Context identity format metadata (identity never changes; state evolves). */
export interface ExecutiveContextIdentityFormatDescriptor {
  readonly identityId: "RTC-1:1/ContextIdentityFormat";
  readonly prefix: "RTC-CTX";
  readonly example: "RTC-CTX-00000001";
  readonly pattern: "RTC-CTX-{8-digit-sequence}";
  readonly identityImmutable: true;
  readonly stateEvolvesViaSnapshot: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Lifecycle declaration for Executive Context. */
export interface ExecutiveContextLifecycleDeclaration {
  readonly lifecycleId: "RTC-1:1/ExecutiveContextLifecycle";
  readonly sourcePhase: "RTC-1:1";
  readonly states: readonly ExecutiveContextLifecycleState[];
  readonly stateCount: number;
  readonly transitions: Readonly<
    Record<
      ExecutiveContextLifecycleState,
      readonly ExecutiveContextLifecycleState[]
    >
  >;
  readonly singleActiveContext: true;
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Declarative runtime contract (non-executable). */
export interface ExecutiveContextRuntimeContractDeclaration {
  readonly contractId: `RTC-1:1/Contract/${ExecutiveContextRuntimeContractName}`;
  readonly contractName: ExecutiveContextRuntimeContractName;
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
export interface ExecutiveContextRuntimeEventDeclaration {
  readonly eventId: `RTC-1:1/Event/${ExecutiveContextRuntimeEventName}`;
  readonly eventName: ExecutiveContextRuntimeEventName;
  readonly description: string;
  readonly dispatches: false;
  readonly businessEvent: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative context section. */
export interface ExecutiveContextSectionDeclaration {
  readonly sectionId: `RTC-1:1/Section/${ExecutiveContextSectionName}`;
  readonly sectionName: ExecutiveContextSectionName;
  readonly description: string;
  readonly required: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative read-only consumer. */
export interface ExecutiveContextRuntimeConsumerDeclaration {
  readonly consumerId: `RTC-1:1/Consumer/${ExecutiveContextRuntimeConsumerName}`;
  readonly consumerName: ExecutiveContextRuntimeConsumerName;
  readonly accessMode: "ReadOnly";
  readonly mayMutateContext: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative activation source. */
export interface ExecutiveContextActivationSourceDeclaration {
  readonly sourceId: string;
  readonly category: ExecutiveContextActivationSourceCategory;
  readonly action: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Deterministic foundation summary. */
export interface ExecutiveContextRuntimeFoundationSummary {
  readonly foundationId: "RTC-1:1/ExecutiveContextRuntimeFoundation";
  readonly version: "1.0.0";
  readonly name: "Executive Context Runtime Foundation";
  readonly namespace: "nexora.rtc.executive.context.foundation";
  readonly status: ExecutiveContextRuntimeFoundationStatus;
  readonly readiness: ExecutiveContextRuntimeFoundationReadiness;
  readonly sectionCount: number;
  readonly contractCount: number;
  readonly eventCount: number;
  readonly lifecycleStateCount: number;
  readonly consumerCount: number;
  readonly responsibilityCount: number;
  readonly guaranteeCount: number;
  readonly nextPhase: "RTC-1:2 — Executive Context Runtime Registry";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
