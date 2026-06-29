/**
 * APP-1:4 — Executive Time State Engine types.
 * Entity lifecycle metadata — no workflow execution or persistence.
 */

import type { ExecutiveTimeCertificationCheck, ExecutiveTimeWorkspaceId } from "./executiveTimeTypes.ts";

export const EXECUTIVE_TIME_STATE_ENGINE_VERSION = "APP-1/4" as const;

export type ExecutiveTimeEntityType =
  | "scenario"
  | "decision"
  | "kpi"
  | "risk"
  | "object"
  | "relationship"
  | "data_source"
  | "report"
  | "dashboard"
  | "assistant"
  | "custom";

export type ExecutiveTimeEntityStateDefinition = Readonly<{
  id: string;
  name: string;
  entityType: ExecutiveTimeEntityType;
  description: string;
  lifecycleOrder: number;
  isTerminal: boolean;
  isEditable: boolean;
  isVisible: boolean;
  supportsTransition: boolean;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimeEntityStateSet = Readonly<{
  entityType: ExecutiveTimeEntityType;
  states: readonly ExecutiveTimeEntityStateDefinition[];
  defaultStateId: string;
  version: typeof EXECUTIVE_TIME_STATE_ENGINE_VERSION;
}>;

export type ExecutiveTimeStateTransitionContract = Readonly<{
  fromState: string;
  toState: string;
  entityType: ExecutiveTimeEntityType;
  transitionReason: string;
  actor: string;
  timestamp: string;
  requiresApproval: boolean;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimeStateRegistrySnapshot = Readonly<{
  version: typeof EXECUTIVE_TIME_STATE_ENGINE_VERSION;
  entityTypes: readonly ExecutiveTimeEntityType[];
  statesByEntity: Readonly<Record<string, readonly ExecutiveTimeEntityStateDefinition[]>>;
  generatedAt: string;
}>;

export type ExecutiveTimeStateRegistrationResult = Readonly<{
  success: boolean;
  reason: string;
}>;

export type ExecutiveTimeStateValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveTimeStateValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveTimeStateValidationIssue[];
}>;

export type ExecutiveTimeStateTemporalSnapshot = Readonly<{
  workspaceId: ExecutiveTimeWorkspaceId;
  currentContextId: string;
  cameraMode: string;
  cameraContext: string;
  readOnly: true;
  engineVersion: typeof EXECUTIVE_TIME_STATE_ENGINE_VERSION;
}>;

export type ExecutiveTimeStateFutureIntegrations = Readonly<{
  scenarioEngine: Readonly<{ consumerId: "scenario"; integrationImplemented: false; readOnly: true }>;
  riskEngine: Readonly<{ consumerId: "risk"; integrationImplemented: false; readOnly: true }>;
  kpiEngine: Readonly<{ consumerId: "kpi"; integrationImplemented: false; readOnly: true }>;
  decisionEngine: Readonly<{ consumerId: "decision"; integrationImplemented: false; readOnly: true }>;
  timeline: Readonly<{ consumerId: "timeline"; integrationImplemented: false; readOnly: true }>;
  dashboard: Readonly<{ consumerId: "dashboard"; integrationImplemented: false; readOnly: true }>;
  assistant: Readonly<{ consumerId: "assistant"; integrationImplemented: false; readOnly: true }>;
  recommendation: Readonly<{ consumerId: "recommendation"; integrationImplemented: false; readOnly: true }>;
}>;

export type ExecutiveTimeStateEngineCertificationResult = Readonly<{
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
