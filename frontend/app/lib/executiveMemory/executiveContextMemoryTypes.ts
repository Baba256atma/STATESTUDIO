/**
 * APP-4:8 — Executive Context Memory domain types.
 */

import type { ExecutiveMemoryId, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";
import type {
  EXECUTIVE_CONTEXT_MEMORY_REFERENCE_TYPE_KEYS,
  EXECUTIVE_CONTEXT_MEMORY_STATE_KEYS,
} from "./executiveContextMemoryConstants.ts";

export type ExecutiveContextMemoryId = string;
export type ExecutiveContextState = (typeof EXECUTIVE_CONTEXT_MEMORY_STATE_KEYS)[number];
export type ExecutiveContextReferenceType = (typeof EXECUTIVE_CONTEXT_MEMORY_REFERENCE_TYPE_KEYS)[number];

export type ExecutiveContextReference = Readonly<{
  referenceId: string;
  referenceType: ExecutiveContextReferenceType;
  targetId: string;
  label: string;
  readOnly: true;
}>;

export type ExecutiveBusinessContext = Readonly<{
  contextId: string;
  domain: string;
  businessUnit: string;
  department: string;
  market: string;
  description: string;
  readOnly: true;
}>;

export type ExecutiveMarketContext = Readonly<{
  marketContextId: string;
  region: string;
  conditions: string;
  trend: "declining" | "stable" | "growing" | "volatile" | "unknown";
  description: string;
  readOnly: true;
}>;

export type ExecutiveOrganizationContext = Readonly<{
  organizationContextId: string;
  structure: string;
  maturity: "emerging" | "developing" | "mature" | "transforming" | "unknown";
  capacity: "constrained" | "balanced" | "expanded" | "unknown";
  description: string;
  readOnly: true;
}>;

export type ExecutiveResourceEntry = Readonly<{
  resourceId: string;
  label: string;
  availability: "limited" | "available" | "abundant" | "unknown";
  capacity: string;
  readOnly: true;
}>;

export type ExecutiveResourceContext = Readonly<{
  resourceContextId: string;
  resources: readonly ExecutiveResourceEntry[];
  description: string;
  readOnly: true;
}>;

export type ExecutiveStakeholderContext = Readonly<{
  stakeholderId: string;
  name: string;
  role: string;
  influence: "low" | "medium" | "high" | "unknown";
  interest: "low" | "medium" | "high" | "unknown";
  readOnly: true;
}>;

export type ExecutivePolicyEntry = Readonly<{
  policyId: string;
  label: string;
  scope: string;
  status: "draft" | "active" | "deprecated" | "unknown";
  readOnly: true;
}>;

export type ExecutivePolicyContext = Readonly<{
  policyContextId: string;
  policies: readonly ExecutivePolicyEntry[];
  regulatorySummary: string;
  readOnly: true;
}>;

export type ExecutiveExternalEvent = Readonly<{
  eventId: string;
  label: string;
  source: string;
  occurredAt: string;
  impact: "low" | "medium" | "high" | "unknown";
  readOnly: true;
}>;

export type ExecutiveExternalContext = Readonly<{
  externalContextId: string;
  events: readonly ExecutiveExternalEvent[];
  description: string;
  readOnly: true;
}>;

export type ExecutiveContextSnapshot = Readonly<{
  snapshotId: string;
  capturedAt: string;
  label: string;
  summary: string;
  readOnly: true;
}>;

export type ExecutiveContextMetadata = Readonly<{
  title: string;
  summary: string;
  owner: string;
  sourceModule: string;
  customMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ExecutiveContextMemoryVersion = Readonly<{
  versionId: string;
  semanticVersion: string;
  schemaVersion: string;
  contractVersion: string;
  createdAt: string;
  readOnly: true;
}>;

export type ExecutiveContextMemory = Readonly<{
  memoryId: ExecutiveContextMemoryId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  goalId: string | null;
  intentId: string | null;
  scenarioId: string | null;
  decisionId: string | null;
  executiveMemoryIds: readonly ExecutiveMemoryId[];
  businessContext: ExecutiveBusinessContext;
  marketContext: ExecutiveMarketContext;
  organizationContext: ExecutiveOrganizationContext;
  resourceContext: ExecutiveResourceContext;
  stakeholders: readonly ExecutiveStakeholderContext[];
  policyContext: ExecutivePolicyContext;
  externalContext: ExecutiveExternalContext;
  contextSnapshot: ExecutiveContextSnapshot;
  strategicPriorities: readonly string[];
  assumptions: readonly string[];
  businessConstraints: readonly string[];
  riskIds: readonly string[];
  kpiIds: readonly string[];
  timelineIds: readonly string[];
  references: readonly ExecutiveContextReference[];
  metadata: ExecutiveContextMetadata;
  lifecycle: ExecutiveContextState;
  version: ExecutiveContextMemoryVersion;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  schemaVersion: string;
  contractVersion: string;
  readOnly: true;
}>;

export type CreateExecutiveContextMemoryInput = Readonly<{
  memoryId: ExecutiveContextMemoryId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  goalId?: string | null;
  intentId?: string | null;
  scenarioId?: string | null;
  decisionId?: string | null;
  executiveMemoryIds?: readonly ExecutiveMemoryId[];
  businessContext: ExecutiveBusinessContext;
  marketContext: ExecutiveMarketContext;
  organizationContext: ExecutiveOrganizationContext;
  resourceContext: ExecutiveResourceContext;
  stakeholders?: readonly ExecutiveStakeholderContext[];
  policyContext: ExecutivePolicyContext;
  externalContext: ExecutiveExternalContext;
  contextSnapshot: ExecutiveContextSnapshot;
  strategicPriorities?: readonly string[];
  assumptions?: readonly string[];
  businessConstraints?: readonly string[];
  riskIds?: readonly string[];
  kpiIds?: readonly string[];
  timelineIds?: readonly string[];
  references?: readonly ExecutiveContextReference[];
  metadata: ExecutiveContextMetadata;
  version: ExecutiveContextMemoryVersion;
  createdAt: string;
  updatedAt: string;
  schemaVersion?: string;
  contractVersion?: string;
}>;

export type UpdateExecutiveContextMemoryInput = Readonly<{
  metadata?: Readonly<{
    title?: string;
    summary?: string;
    customMetadata?: Readonly<Record<string, string>>;
  }>;
  marketContext?: ExecutiveMarketContext;
  organizationContext?: ExecutiveOrganizationContext;
  strategicPriorities?: readonly string[];
  assumptions?: readonly string[];
  businessConstraints?: readonly string[];
}>;

export type ExecutiveContextMemoryQuery = Readonly<{
  memoryId?: ExecutiveContextMemoryId;
  workspaceId?: ExecutiveMemoryWorkspaceId;
  goalId?: string;
  intentId?: string;
  scenarioId?: string;
  decisionId?: string;
  businessContextId?: string;
  stakeholderId?: string;
  externalEventId?: string;
  lifecycle?: ExecutiveContextState;
}>;

export type ExecutiveContextWorkspaceRegistration = Readonly<{
  workspaceId: ExecutiveMemoryWorkspaceId;
  label?: string | null;
}>;

export type ExecutiveContextMemoryError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveContextMemoryResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: ExecutiveContextMemoryError | null;
  readOnly: true;
}>;

export type ExecutiveContextStatistics = Readonly<{
  totalMemories: number;
  activeMemories: number;
  archivedMemories: number;
  memoriesByWorkspace: Readonly<Record<string, number>>;
  memoriesByGoal: Readonly<Record<string, number>>;
  memoriesByScenario: Readonly<Record<string, number>>;
  memoriesByDecision: Readonly<Record<string, number>>;
  memoriesByBusinessContext: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type ExecutiveContextMemoryGraph = Readonly<{
  memoryId: ExecutiveContextMemoryId | null;
  workspaceId: ExecutiveMemoryWorkspaceId | null;
  linkedGoalIds: readonly string[];
  linkedIntentIds: readonly string[];
  linkedScenarioIds: readonly string[];
  linkedDecisionIds: readonly string[];
  linkedExecutiveMemoryIds: readonly ExecutiveMemoryId[];
  linkedBusinessContextIds: readonly string[];
  linkedStakeholderIds: readonly string[];
  linkedResourceIds: readonly string[];
  linkedRiskIds: readonly string[];
  linkedKpiIds: readonly string[];
  linkedExternalEventIds: readonly string[];
  directReferenceCount: number;
  readOnly: true;
}>;

export type ExecutiveContextMemoryEngineState = Readonly<{
  engineId: "executive-context-memory-engine";
  contractVersion: string;
  initialized: boolean;
  memoryCount: number;
  registeredWorkspaceCount: number;
  timestamp: string;
  readOnly: true;
}>;
