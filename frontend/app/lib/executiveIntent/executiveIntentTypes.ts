/**
 * APP-3:1 — Executive Intent domain types.
 * Immutable contract vocabulary — no extraction, reasoning, scoring, or execution.
 */

export type ExecutiveIntentWorkspaceId = string;
export type IntentIdentifier = string;

export type ExecutiveIntentCertificationStatus = "pending" | "pass" | "fail";
export type ExecutiveIntentFreezeState = "open" | "frozen";
export type ExecutiveIntentArchitectureStatus = "build" | "certified";

export type ExecutiveIntentPlatformIdentity = Readonly<{
  appId: "APP-3";
  title: "Executive Intent";
  version: string;
  status: ExecutiveIntentArchitectureStatus;
  certificationStatus: ExecutiveIntentCertificationStatus;
  freezeState: ExecutiveIntentFreezeState;
  architectureVersion: string;
}>;

export type IntentCategory =
  | "strategic"
  | "financial"
  | "operational"
  | "growth"
  | "innovation"
  | "risk_reduction"
  | "customer"
  | "people"
  | "compliance"
  | "technology"
  | "custom";

export type IntentPriority = "very_low" | "low" | "medium" | "high" | "critical";

export type IntentStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled"
  | "archived";

export type IntentScope =
  | "enterprise"
  | "business_unit"
  | "department"
  | "project"
  | "scenario"
  | "object"
  | "custom";

export type IntentLifecycleStage =
  | "created"
  | "validated"
  | "approved"
  | "activated"
  | "updated"
  | "completed"
  | "archived";

export type IntentSource =
  | "executive"
  | "assistant"
  | "imported"
  | "workspace"
  | "scenario"
  | "manual"
  | "api";

export type IntentRelationType =
  | "parent"
  | "child"
  | "depends_on"
  | "supports"
  | "blocks"
  | "conflicts_with"
  | "supersedes"
  | "related";

export type IntentTag = Readonly<{
  tagId: string;
  label: string;
  readOnly: true;
}>;

export type IntentVersion = Readonly<{
  versionId: string;
  semanticVersion: string;
  createdAt: string;
  readOnly: true;
}>;

export type IntentReference = Readonly<{
  referenceId: string;
  referenceType: string;
  label: string;
  targetId: string;
  readOnly: true;
}>;

export type IntentEvidence = Readonly<{
  evidenceId: string;
  source: string;
  summary: string;
  readOnly: true;
}>;

export type IntentConstraint = Readonly<{
  constraintId: string;
  label: string;
  description: string;
  readOnly: true;
}>;

export type IntentAssumption = Readonly<{
  assumptionId: string;
  label: string;
  description: string;
  readOnly: true;
}>;

export type IntentDependency = Readonly<{
  dependencyId: string;
  targetIntentId: IntentIdentifier;
  relationType: IntentRelationType;
  readOnly: true;
}>;

export type IntentRelation = Readonly<{
  relationId: string;
  sourceIntentId: IntentIdentifier;
  targetIntentId: IntentIdentifier;
  relationType: IntentRelationType;
  readOnly: true;
}>;

export type IntentTarget = Readonly<{
  targetId: string;
  targetType: IntentScope;
  label: string;
  readOnly: true;
}>;

export type IntentScopeDescriptor = Readonly<{
  scope: IntentScope;
  scopeRef: string | null;
  label: string;
  readOnly: true;
}>;

export type IntentConfidenceReference = Readonly<{
  confidenceRefId: string;
  level: string | null;
  summary: string;
  readOnly: true;
}>;

export type IntentConflictReference = Readonly<{
  conflictRefId: string;
  conflictIntentId: IntentIdentifier | null;
  summary: string;
  readOnly: true;
}>;

export type IntentMetadata = Readonly<{
  intentId: IntentIdentifier;
  title: string;
  summary: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  version: IntentVersion;
  owner: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  tags: readonly IntentTag[];
  priority: IntentPriority;
  status: IntentStatus;
  scope: IntentScopeDescriptor;
  category: IntentCategory;
  source: IntentSource;
  lifecycle: IntentLifecycleStage;
  references: readonly IntentReference[];
  assumptions: readonly IntentAssumption[];
  constraints: readonly IntentConstraint[];
  dependencies: readonly IntentDependency[];
  evidence: readonly IntentEvidence[];
  confidenceReference: IntentConfidenceReference | null;
  conflictReference: IntentConflictReference | null;
  customMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ExecutiveIntent = Readonly<{
  intentId: IntentIdentifier;
  workspaceId: ExecutiveIntentWorkspaceId;
  metadata: IntentMetadata;
  relations: readonly IntentRelation[];
  readOnly: true;
  contractVersion: string;
}>;

export type IntentSnapshot = Readonly<{
  snapshotId: string;
  intentId: IntentIdentifier;
  workspaceId: ExecutiveIntentWorkspaceId;
  capturedAt: string;
  metadata: IntentMetadata;
  readOnly: true;
}>;

export type IntentSummary = Readonly<{
  intentId: IntentIdentifier;
  title: string;
  summary: string;
  priority: IntentPriority;
  status: IntentStatus;
  category: IntentCategory;
  readOnly: true;
}>;

export type IntentExplanation = Readonly<{
  explanationId: string;
  intentId: IntentIdentifier;
  summary: string;
  rationale: string;
  readOnly: true;
}>;

export type IntentLifecycleDefinition = Readonly<{
  key: IntentLifecycleStage;
  order: number;
  label: string;
  description: string;
}>;

export type ExecutiveIntentValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
}>;

export type ExecutiveIntentValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveIntentValidationIssue[];
}>;

export type ExecutiveIntentFuturePhase =
  | "intent_extraction"
  | "intent_classification"
  | "intent_evolution"
  | "intent_timeline"
  | "intent_confidence"
  | "intent_conflict_detection"
  | "intent_recommendation"
  | "intent_memory"
  | "intent_analytics";

export type ExecutiveIntentFutureCompatibility = Readonly<{
  app3Ready: true;
  extractionReady: true;
  classificationReady: true;
  evolutionReady: true;
  timelineReady: true;
  confidenceReady: true;
  conflictDetectionReady: true;
  recommendationReady: true;
  memoryReady: true;
  analyticsReady: true;
  governanceReady: true;
  decisionJournalReady: true;
  executiveTimeConsumerOnly: true;
  readOnly: true;
  metadataOnly: true;
}>;

export type ExecutiveIntentReservedField = Readonly<{
  fieldKey: string;
  reservedFor: ExecutiveIntentFuturePhase;
  description: string;
}>;

export type ExecutiveIntentCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;
