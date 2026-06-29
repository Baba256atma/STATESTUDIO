/**
 * APP-1:4.5 — Executive Time Transition Authority types.
 * Separation-of-concerns contract — validation/authorization only, no mutation.
 */

import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";

export const EXECUTIVE_TIME_TRANSITION_AUTHORITY_VERSION = "APP-1/4.5" as const;

export const EXECUTIVE_TIME_STATE_MUTATION_OWNER = "executive-time-state-engine" as const;

export type ExecutiveTimeTransitionRequest = Readonly<{
  workspaceId: string;
  entityId: string;
  entityType: ExecutiveTimeEntityType;
  currentState: string;
  requestedState: string;
  actor: string;
  transitionReason: string;
  requiresApproval?: boolean;
  approvalGranted?: boolean;
  metadata?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimeTransitionAuthorityResult = Readonly<{
  approved: boolean;
  rejected: boolean;
  reason: string;
  currentState: string;
  requestedState: string;
  entityType: ExecutiveTimeEntityType;
  entityId: string;
  workspaceId: string;
  validationMessages: readonly string[];
  requiredApprovals: readonly string[];
  requiredDependencies: readonly string[];
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimeTransitionDecisionExplanation = Readonly<{
  summary: string;
  validationMessages: readonly string[];
  requiredApprovals: readonly string[];
  requiredDependencies: readonly string[];
  ownership: Readonly<{
    transitionEngine: "validation-and-authorization-only";
    stateEngine: typeof EXECUTIVE_TIME_STATE_MUTATION_OWNER;
  }>;
}>;

export type ExecutiveTimeApprovedTransitionInput = Readonly<{
  authorityResult: ExecutiveTimeTransitionAuthorityResult;
  actor: string;
  timestamp: string;
}>;

export type ExecutiveTimeStateMutationResult = Readonly<{
  success: boolean;
  workspaceId: string;
  entityId: string;
  entityType: ExecutiveTimeEntityType;
  previousState: string;
  currentState: string;
  appliedAt: string;
  reason: string;
  mutationOwner: typeof EXECUTIVE_TIME_STATE_MUTATION_OWNER;
}>;

export type ExecutiveTimeStateMutationContract = Readonly<{
  mutationOwner: typeof EXECUTIVE_TIME_STATE_MUTATION_OWNER;
  applyApprovedTransition: (input: ExecutiveTimeApprovedTransitionInput) => ExecutiveTimeStateMutationResult;
}>;

export type ExecutiveTimeTransitionFutureIntegrations = Readonly<{
  scenario: Readonly<{ consumerId: "scenario"; validationOnly: true; integrationImplemented: false }>;
  kpi: Readonly<{ consumerId: "kpi"; validationOnly: true; integrationImplemented: false }>;
  risk: Readonly<{ consumerId: "risk"; validationOnly: true; integrationImplemented: false }>;
  decision: Readonly<{ consumerId: "decision"; validationOnly: true; integrationImplemented: false }>;
  timeline: Readonly<{ consumerId: "timeline"; validationOnly: true; integrationImplemented: false }>;
  dashboard: Readonly<{ consumerId: "dashboard"; validationOnly: true; integrationImplemented: false }>;
  assistant: Readonly<{ consumerId: "assistant"; validationOnly: true; integrationImplemented: false }>;
}>;

export type ExecutiveTimeTransitionAuthorityCertificationResult = Readonly<{
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

export type ExecutiveTimeTransitionOwnershipRules = Readonly<{
  stateEngineOwns: readonly string[];
  transitionEngineOwns: readonly string[];
}>;
