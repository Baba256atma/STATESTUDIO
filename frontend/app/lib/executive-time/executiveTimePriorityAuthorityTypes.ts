/**
 * APP-1:5.5 — Executive Time Priority Authority types.
 * Contract-only separation: policy metadata, engine interface, immutable result.
 */

import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";

export const EXECUTIVE_TIME_PRIORITY_AUTHORITY_VERSION = "APP-1/5.5" as const;

export const EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER = "executive-time-priority-engine" as const;

export const EXECUTIVE_TIME_PRIORITY_POLICY_OWNER = "executive-time-priority-policy" as const;

export const EXECUTIVE_TIME_PRIORITY_RESULT_OWNER = "executive-time-priority-result" as const;

export type ExecutiveTimePriorityLevel =
  | "critical"
  | "urgent"
  | "soon"
  | "normal"
  | "later"
  | "expired";

export type ExecutiveTimePriorityPolicyDefinition = Readonly<{
  id: string;
  priority: ExecutiveTimePriorityLevel;
  description: string;
  evaluationOrder: number;
  severityWeight: number;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimePriorityContributingFactor = Readonly<{
  factorId: string;
  label: string;
  weight: number;
}>;

export type ExecutiveTimePriorityEvaluationRequest = Readonly<{
  workspaceId: string;
  entityId: string;
  entityType: ExecutiveTimeEntityType;
  currentState: string;
  actor: string;
  reason: string;
  targetState?: string;
  targetDeadline?: string;
  targetWindow?: Readonly<{ start: string; end: string }>;
  approvalGranted?: boolean;
  requiredDependencies?: readonly string[];
  metadata?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimePriorityResult = Readonly<{
  priority: ExecutiveTimePriorityLevel;
  confidence: number;
  explanation: string;
  matchedPolicies: readonly ExecutiveTimePriorityPolicyDefinition[];
  contributingFactors: readonly ExecutiveTimePriorityContributingFactor[];
  warnings: readonly string[];
  escalationLevel: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimePriorityExplanation = Readonly<{
  summary: string;
  priority: ExecutiveTimePriorityLevel;
  confidence: number;
  matchedPolicyIds: readonly string[];
  warnings: readonly string[];
  ownership: Readonly<{
    policyOwner: typeof EXECUTIVE_TIME_PRIORITY_POLICY_OWNER;
    engineOwner: typeof EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER;
    resultOwner: typeof EXECUTIVE_TIME_PRIORITY_RESULT_OWNER;
  }>;
}>;

export type ExecutiveTimePriorityPolicyValidationResult = Readonly<{
  valid: boolean;
  policyId: string;
  messages: readonly string[];
}>;

export type ExecutiveTimePriorityEngineContract = Readonly<{
  evaluationOwner: typeof EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER;
  evaluatePriority: (request: ExecutiveTimePriorityEvaluationRequest) => ExecutiveTimePriorityResult;
  evaluateMultiple: (requests: readonly ExecutiveTimePriorityEvaluationRequest[]) => readonly ExecutiveTimePriorityResult[];
  validatePolicy: (policyId: string) => ExecutiveTimePriorityPolicyValidationResult;
  resolvePolicy: (input: { policyId?: string; priority?: ExecutiveTimePriorityLevel }) => ExecutiveTimePriorityPolicyDefinition | null;
  explainPriority: (result: ExecutiveTimePriorityResult) => ExecutiveTimePriorityExplanation;
}>;

export type ExecutiveTimePriorityOwnershipRules = Readonly<{
  policyOwns: readonly string[];
  engineOwns: readonly string[];
  resultOwns: readonly string[];
}>;

export type ExecutiveTimePriorityReadOnlyDependency = Readonly<{
  moduleId: string;
  operations: readonly string[];
  mutationPermitted: false;
}>;

export type ExecutiveTimePriorityReadOnlyDependencies = Readonly<{
  context: ExecutiveTimePriorityReadOnlyDependency;
  camera: ExecutiveTimePriorityReadOnlyDependency;
  state: ExecutiveTimePriorityReadOnlyDependency;
  transitionEngine: ExecutiveTimePriorityReadOnlyDependency;
}>;

export type ExecutiveTimePriorityFutureIntegrations = Readonly<{
  dashboard: Readonly<{ consumerId: "dashboard"; validationOnly: true; integrationImplemented: false }>;
  assistant: Readonly<{ consumerId: "assistant"; validationOnly: true; integrationImplemented: false }>;
  timeline: Readonly<{ consumerId: "timeline"; validationOnly: true; integrationImplemented: false }>;
  recommendation: Readonly<{ consumerId: "recommendation"; validationOnly: true; integrationImplemented: false }>;
  scenario: Readonly<{ consumerId: "scenario"; validationOnly: true; integrationImplemented: false }>;
  risk: Readonly<{ consumerId: "risk"; validationOnly: true; integrationImplemented: false }>;
  kpi: Readonly<{ consumerId: "kpi"; validationOnly: true; integrationImplemented: false }>;
  decision: Readonly<{ consumerId: "decision"; validationOnly: true; integrationImplemented: false }>;
}>;

export type ExecutiveTimePriorityAuthorityCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  checks: readonly ExecutiveTimeCertificationCheck[];
  passedChecks: readonly ExecutiveTimeCertificationCheck[];
  failedChecks: readonly ExecutiveTimeCertificationCheck[];
  warnings: readonly string[];
  tags: readonly string[];
  summary: string;
  generatedAt: string;
}>;

export class ExecutiveTimePriorityEvaluationDeferredError extends Error {
  readonly code = "PRIORITY_EVALUATION_DEFERRED_TO_APP_1_6" as const;

  constructor() {
    super("Priority evaluation is deferred to APP-1:6. Contract-only phase.");
    this.name = "ExecutiveTimePriorityEvaluationDeferredError";
  }
}
