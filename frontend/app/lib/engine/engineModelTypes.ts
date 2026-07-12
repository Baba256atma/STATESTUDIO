export type ExecutiveEngineOwnerLayer = "Advisor" | "Engine" | "BUS" | "OPS" | "LAY" | "APP" | "CORE" | "CORE-TEN";
export type ExecutiveEngineModelLifecycle = "planned" | "active" | "certified" | "frozen" | "released";
export type ExecutiveEngineModelId = "executive-request" | "executive-intent" | "executive-goal" | "executive-context" | "executive-plan" | "executive-plan-step" | "executive-reasoning-record" | "executive-decision" | "executive-decision-option" | "executive-coordination-instruction" | "executive-outcome";

export interface ExecutiveEngineConfidenceMetadata { readonly level: string; readonly basisReferences: readonly string[]; readonly metadataOnly: true }
export interface ExecutiveEngineTimeMetadata { readonly valueReference: string; readonly timezoneReference?: string; readonly metadataOnly: true }

export interface ExecutiveRequest {
  readonly requestId: string; readonly requestType: string; readonly title: string; readonly description: string;
  readonly source: string; readonly requesterReference: string; readonly tenantReference: string;
  readonly workspaceReference: string; readonly priority: string; readonly urgency: string;
  readonly requestedOutcome: string; readonly submittedTimestampMetadata: ExecutiveEngineTimeMetadata;
  readonly lifecycleStatus: ExecutiveEngineModelLifecycle;
}
export interface ExecutiveGoal {
  readonly goalId: string; readonly goalType: string; readonly title: string; readonly description: string;
  readonly desiredOutcome: string; readonly successCriteria: readonly string[]; readonly priority: string;
  readonly constraintReferences: readonly string[]; readonly dependencyReferences: readonly string[]; readonly status: string;
}
export interface ExecutiveIntent {
  readonly intentId: string; readonly requestReference: string; readonly intentCategory: string;
  readonly intentDescription: string; readonly confidenceMetadata: ExecutiveEngineConfidenceMetadata;
  readonly ambiguityStatus: string; readonly goalReferences: readonly string[];
  readonly relevantCapabilityReferences: readonly string[]; readonly candidatePlatformReferences: readonly string[];
  readonly lifecycleStatus: ExecutiveEngineModelLifecycle;
}
export interface ExecutiveContext {
  readonly contextId: string; readonly requestReference: string; readonly tenantReference: string; readonly workspaceReference: string;
  readonly actorReferences: readonly string[]; readonly businessDomainReferences: readonly string[];
  readonly operationDomainReferences: readonly string[]; readonly relevantEntityReferences: readonly string[];
  readonly dataSourceReferences: readonly string[]; readonly timeHorizonMetadata: ExecutiveEngineTimeMetadata;
  readonly constraintReferences: readonly string[]; readonly assumptionReferences: readonly string[];
  readonly contextCompletenessStatus: string;
}
export interface ExecutivePlanStep {
  readonly stepId: string; readonly sequence: number; readonly title: string; readonly responsibility: string;
  readonly ownerLayer: ExecutiveEngineOwnerLayer; readonly capabilityReference: string;
  readonly inputReferences: readonly string[]; readonly outputReferences: readonly string[];
  readonly dependencyReferences: readonly string[]; readonly blockingStatus: string;
}
export interface ExecutivePlan {
  readonly planId: string; readonly requestReference: string; readonly intentReference: string;
  readonly goalReferences: readonly string[]; readonly planType: string; readonly orderedStepReferences: readonly string[];
  readonly requiredCapabilityReferences: readonly string[]; readonly requiredPlatformReferences: readonly string[];
  readonly dependencyReferences: readonly string[]; readonly constraintReferences: readonly string[];
  readonly expectedOutcomeReferences: readonly string[]; readonly lifecycleStatus: ExecutiveEngineModelLifecycle;
}
export interface ExecutiveReasoningRecord {
  readonly reasoningRecordId: string; readonly requestReference: string; readonly reasoningCategory: string;
  readonly inputReferences: readonly string[]; readonly observationReferences: readonly string[];
  readonly inferenceReferences: readonly string[]; readonly assumptionReferences: readonly string[];
  readonly evidenceReferences: readonly string[]; readonly uncertaintyMetadata: ExecutiveEngineConfidenceMetadata;
  readonly conclusionReferences: readonly string[]; readonly lifecycleStatus: ExecutiveEngineModelLifecycle;
}
export interface ExecutiveDecisionOption {
  readonly optionId: string; readonly title: string; readonly description: string;
  readonly benefitReferences: readonly string[]; readonly costReferences: readonly string[];
  readonly riskReferences: readonly string[]; readonly constraintReferences: readonly string[];
  readonly scoreMetadata: Readonly<{ valueReference: string; metadataOnly: true }>; readonly status: string;
}
export interface ExecutiveDecision {
  readonly decisionId: string; readonly requestReference: string; readonly goalReference: string;
  readonly decisionType: string; readonly decisionStatement: string; readonly consideredOptionReferences: readonly string[];
  readonly selectedOptionReference?: string; readonly evidenceReferences: readonly string[];
  readonly reasoningRecordReferences: readonly string[]; readonly riskReferences: readonly string[];
  readonly confidenceMetadata: ExecutiveEngineConfidenceMetadata; readonly approvalStatus: string;
  readonly lifecycleStatus: ExecutiveEngineModelLifecycle;
}
export interface ExecutiveCoordinationInstruction {
  readonly instructionId: string; readonly planReference: string; readonly stepReference: string;
  readonly targetLayer: ExecutiveEngineOwnerLayer; readonly targetPlatform: string; readonly targetCapability: string;
  readonly requestedOperationMetadata: Readonly<{ operationReference: string; metadataOnly: true }>;
  readonly inputContractReferences: readonly string[]; readonly expectedOutputContractReferences: readonly string[];
  readonly dependencyReferences: readonly string[]; readonly executionPolicyMetadata: Readonly<{ policyReference: string; metadataOnly: true }>;
  readonly status: string;
}
export interface ExecutiveOutcome {
  readonly outcomeId: string; readonly requestReference: string; readonly intentReference: string;
  readonly goalReferences: readonly string[]; readonly planReference: string; readonly decisionReferences: readonly string[];
  readonly findingReferences: readonly string[]; readonly recommendationReferences: readonly string[];
  readonly riskReferences: readonly string[]; readonly confidenceMetadata: ExecutiveEngineConfidenceMetadata;
  readonly executiveSummaryReference: string; readonly advisorHandoffMetadata: Readonly<{ handoffReference: string; metadataOnly: true }>;
  readonly completionStatus: string;
}

export interface ExecutiveEngineModelDescriptor {
  readonly id: ExecutiveEngineModelId; readonly name: string; readonly description: string;
  readonly owner: "Engine"; readonly category: "ConceptualModel"; readonly fields: readonly string[];
  readonly referencePolicies: readonly string[]; readonly publicVisibility: true;
  readonly lifecycleStatus: "active"; readonly sourcePhase: "ENG-1:3";
  readonly runtimeClassification: "MetadataOnly"; readonly metadataOnly: true; readonly immutable: true;
}
export interface ExecutiveEngineModelRelationship {
  readonly order: number; readonly source: ExecutiveEngineModelId; readonly target: ExecutiveEngineModelId;
  readonly relationship: "DescribesFlowTo"; readonly runtimeExecution: false; readonly metadataOnly: true;
}
