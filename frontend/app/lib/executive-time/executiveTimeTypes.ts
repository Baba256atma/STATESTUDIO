/**
 * APP-1:1 — Executive Time Foundation types.
 * Metadata-first temporal vocabulary — no UI, prediction, or workflow execution.
 */

export type ExecutiveTimeWorkspaceId = string;

export type ExecutiveTimeContextKey =
  | "now"
  | "today"
  | "this_week"
  | "this_month"
  | "this_quarter"
  | "this_year"
  | "yesterday"
  | "last_week"
  | "last_month"
  | "last_quarter"
  | "last_year"
  | "tomorrow"
  | "next_week"
  | "next_month"
  | "next_quarter"
  | "next_year"
  | "custom_range"
  | "future_projection"
  | "past_review";

export type ExecutiveTimeContextCategory =
  | "current"
  | "historical"
  | "future"
  | "flexible"
  | "strategic";

export type ExecutiveTimeContextLens =
  | "operational"
  | "management"
  | "strategic"
  | "forecast"
  | "retrospective"
  | "tactical";

export type ExecutiveTimeCustomRange = Readonly<{
  startBoundary: string;
  endBoundary: string;
}>;

export type ExecutiveTimeContextWindow = Readonly<{
  startBoundary: string;
  endBoundary: string;
  projectionHorizon: string | null;
  windowKind: "instant" | "range" | "projection" | "custom";
}>;

export type ExecutiveTimeContextObject = Readonly<{
  id: ExecutiveTimeContextKey;
  name: string;
  category: ExecutiveTimeContextCategory;
  description: string;
  startBoundary: string;
  endBoundary: string;
  isRelative: boolean;
  supportsProjection: boolean;
  supportsHistory: boolean;
  supportsComparison: boolean;
  lens: ExecutiveTimeContextLens;
  window: ExecutiveTimeContextWindow;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimeContextComparisonMetadata = Readonly<{
  primaryContextId: ExecutiveTimeContextKey;
  secondaryContextId: ExecutiveTimeContextKey;
  comparisonLabel: string;
  supported: boolean;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimeContextStoreRecord = Readonly<{
  workspaceId: ExecutiveTimeWorkspaceId;
  currentContextId: ExecutiveTimeContextKey;
  customRange: ExecutiveTimeCustomRange | null;
  contextMetadata: Readonly<Record<string, unknown>>;
  version: string;
  updatedAt: string;
}>;

export type ExecutiveTimeContextSwitchResult = Readonly<{
  success: boolean;
  previousContextId: ExecutiveTimeContextKey | null;
  currentContextId: ExecutiveTimeContextKey;
  workspaceId: ExecutiveTimeWorkspaceId;
  updatedAt: string;
  reason: string;
}>;

export type ExecutiveTimeContextEngineCertificationResult = Readonly<{
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

export type ExecutiveTimeStateKey =
  | "draft"
  | "planned"
  | "active"
  | "waiting"
  | "blocked"
  | "completed"
  | "expired"
  | "archived";

export type ExecutiveTimePriorityKey =
  | "critical"
  | "urgent"
  | "soon"
  | "normal"
  | "later"
  | "expired";

export type ExecutiveTimeEventCategory =
  | "scenario"
  | "decision"
  | "kpi"
  | "risk"
  | "object"
  | "relationship"
  | "data_source"
  | "assistant"
  | "dashboard"
  | "manual";

export type ExecutiveTimeContextDefinition = Readonly<{
  key: ExecutiveTimeContextKey;
  label: string;
  description: string;
}>;

export type ExecutiveTimeStateDefinition = Readonly<{
  key: ExecutiveTimeStateKey;
  label: string;
  description: string;
}>;

export type ExecutiveTimePriorityDefinition = Readonly<{
  key: ExecutiveTimePriorityKey;
  label: string;
  description: string;
  rank: number;
}>;

export type ExecutiveTimeEventCategoryDefinition = Readonly<{
  key: ExecutiveTimeEventCategory;
  label: string;
  description: string;
}>;

export type ExecutiveTimeTransitionRule = Readonly<{
  ruleId: string;
  fromState: ExecutiveTimeStateKey;
  toState: ExecutiveTimeStateKey;
  label: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimeTransition = Readonly<{
  fromState: ExecutiveTimeStateKey;
  toState: ExecutiveTimeStateKey;
  reason: string;
  timestamp: string;
  actor: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimeEvent = Readonly<{
  id: string;
  workspaceId: ExecutiveTimeWorkspaceId;
  title: string;
  description: string;
  category: ExecutiveTimeEventCategory;
  timestamp: string;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  state: ExecutiveTimeStateKey;
  priority: ExecutiveTimePriorityKey;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimeEventInput = Readonly<{
  id: string;
  workspaceId: ExecutiveTimeWorkspaceId;
  title?: string;
  description?: string;
  category?: ExecutiveTimeEventCategory | string;
  timestamp?: string;
  relatedEntityId?: string | null;
  relatedEntityType?: string | null;
  state?: ExecutiveTimeStateKey | string;
  priority?: ExecutiveTimePriorityKey | string;
  metadata?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimeValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveTimeValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveTimeValidationIssue[];
}>;

export type ExecutiveTimeRegistrySnapshot = Readonly<{
  contractVersion: string;
  contexts: readonly ExecutiveTimeContextDefinition[];
  states: readonly ExecutiveTimeStateDefinition[];
  priorities: readonly ExecutiveTimePriorityDefinition[];
  eventCategories: readonly ExecutiveTimeEventCategoryDefinition[];
  transitionRules: readonly ExecutiveTimeTransitionRule[];
  generatedAt: string;
}>;

export type ExecutiveTimeRegistryRegistrationResult = Readonly<{
  success: boolean;
  reason: string;
}>;

export type ExecutiveTimeCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveTimeCertificationResult = Readonly<{
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
