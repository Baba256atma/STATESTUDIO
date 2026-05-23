/** D10:3 - Production-safe executive interaction stability contracts. */

export type InteractionStabilityState = "stable" | "degraded" | "recovering" | "unstable";

export type StabilityEventSeverity = "informational" | "caution" | "warning" | "critical";

export type InteractionComponent =
  | "panel_routing"
  | "object_selection"
  | "scene_focus"
  | "chat_execution"
  | "simulation_execution"
  | "command_execution"
  | "workflow_transition"
  | "executive_context";

export type InteractionIssueType =
  | "duplicated_user_action"
  | "conflicting_interaction"
  | "invalid_navigation_transition"
  | "lost_focus_state"
  | "stale_execution_result"
  | "invalid_panel_transition"
  | "orphaned_runtime_state"
  | "interaction_loop";

export type ExecutiveInteractionEvent = {
  eventId: string;
  component: InteractionComponent;
  source: string;
  action: string;
  actionSignature: string;
  generatedAt: number;
  targetPanel?: string | null;
  previousPanel?: string | null;
  objectId?: string | null;
  workflowId?: string | null;
  executionChainId?: string | null;
  sequence?: number | null;
  parentEventId?: string | null;
};

export type ExecutiveInteractionContext = {
  selectedObjectId: string | null;
  focusedObjectId: string | null;
  activePanel: string | null;
  activeWorkflow: string | null;
  simulationContextId: string | null;
  decisionContextId: string | null;
  executiveInvestigationId: string | null;
  updatedAt: number;
  signature: string;
};

export type ContextPreservationOptions = {
  destructiveUpdate?: boolean;
  preservePanel?: boolean;
  preserveWorkflow?: boolean;
};

export type InteractionIntegrityIssue = {
  issueId: string;
  issueType: InteractionIssueType;
  cause: string;
  source: string;
  affectedComponent: InteractionComponent;
  severity: StabilityEventSeverity;
  recommendedCorrection: string;
  relatedEventIds: readonly string[];
};

export type StabilityEventClassification = {
  eventId: string;
  severity: StabilityEventSeverity;
  explanation: string;
  origin: string;
  affectedComponent: InteractionComponent;
  confidence: number;
  suggestedResolution: string;
};

export type RuntimeGuardrailDecision = {
  decisionId: string;
  allowed: boolean;
  stabilityState: InteractionStabilityState;
  preventedIssue: InteractionIntegrityIssue | null;
  preservedContext: ExecutiveInteractionContext;
  issues: readonly InteractionIntegrityIssue[];
  classifications: readonly StabilityEventClassification[];
  signature: string;
};

export type RuntimeStateConsistencyInput = {
  context: ExecutiveInteractionContext;
  validObjectIds?: readonly string[];
  panelState?: { activePanel: string | null; ownerObjectId?: string | null; transitionInFlight?: boolean };
  objectState?: { selectedObjectId: string | null; focusedObjectId: string | null };
  sceneState?: { focusedObjectId: string | null; synchronized: boolean };
  workflowState?: { activeWorkflow: string | null; executionChainId?: string | null; completed?: boolean };
  simulationState?: { activeSimulationId: string | null; stale?: boolean };
};

export type InteractionStabilityValidationResult = {
  stabilityState: InteractionStabilityState;
  issues: readonly InteractionIntegrityIssue[];
  classifications: readonly StabilityEventClassification[];
  contextPreserved: boolean;
  signature: string;
};

export type InteractionLoopAnalysis = {
  loopDetected: boolean;
  prevented: boolean;
  issues: readonly InteractionIntegrityIssue[];
  signature: string;
};

export type ExecutiveInteractionStabilitySummary = {
  interfaceStable: boolean;
  workflowsBehavingNormally: boolean;
  contextPreserved: boolean;
  highestRisk: StabilityEventClassification | null;
  concernCount: number;
};

export type ExecutiveInteractionStabilityRuntimeSnapshot = {
  snapshotId: string;
  organizationId: string;
  generatedAt: number;
  stabilityState: InteractionStabilityState;
  answer: string;
  summary: ExecutiveInteractionStabilitySummary;
  context: ExecutiveInteractionContext;
  issues: readonly InteractionIntegrityIssue[];
  classifications: readonly StabilityEventClassification[];
  requiresAttention: readonly string[];
  signature: string;
};

export type ExecutiveInteractionStabilityInput = {
  organizationId?: string;
  previousContext?: ExecutiveInteractionContext | null;
  nextContext?: Partial<Omit<ExecutiveInteractionContext, "signature">> | null;
  events?: readonly ExecutiveInteractionEvent[];
  consistency?: RuntimeStateConsistencyInput | null;
  options?: ContextPreservationOptions;
  now?: number;
};
