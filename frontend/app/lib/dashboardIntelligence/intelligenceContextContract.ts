/**
 * INT-1.2 — Unified Intelligence Context Contract.
 * One immutable context model shared by every presentation intelligence consumer.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type {
  DashboardIntelligenceMode,
  DashboardIntelligencePanelId,
} from "./dashboardIntelligenceContract.ts";
import type { IntelligenceConsumerId } from "./singleIntelligenceSourceContract.ts";
import type {
  BuildExecutiveTimeContextInput,
  ExecutiveTimeContext,
} from "./executiveTimeContextContract.ts";

export const INTELLIGENCE_CONTEXT_VERSION = "INT-1.2" as const;

export const INTELLIGENCE_CONTEXT_TAGS = Object.freeze([
  "[INT12_CONTEXT]",
  "[UNIFIED_INTELLIGENCE_CONTEXT]",
  "[CONTEXT_BUILDER]",
  "[CONTEXT_REGISTRY]",
  "[IMMUTABLE_CONTEXT]",
  "[CONTEXT_VERSIONING]",
  "[INT12_COMPLETE]",
] as const);

export const NEXORA_INTELLIGENCE_CONTEXT_LOG_PREFIX = "[NexoraIntelligenceContext]" as const;

export const INTELLIGENCE_CONTEXT_SOURCE = "int-1-2-intelligence-context" as const;

export type IntelligenceViewMode =
  | "overview"
  | "focus"
  | "detail"
  | "compare"
  | "reserved";

export type IntelligenceTimelinePosition = Readonly<{
  index: number | null;
  label: string | null;
  reserved: boolean;
}>;

export type IntelligenceContextFilters = Readonly<Record<string, string | null>>;

export type IntelligenceSelectionPath = readonly string[];

export type IntelligenceFutureExtension = Readonly<Record<string, unknown>>;

export type UnifiedIntelligenceContext = Readonly<{
  contractVersion: typeof INTELLIGENCE_CONTEXT_VERSION;
  contextId: string;
  workspace: WorkspaceId | null;
  selectedObject: string | null;
  selectedRelationship: string | null;
  selectedKpi: string | null;
  selectedRisk: string | null;
  selectedScenario: string | null;
  selectedDataSource: string | null;
  timelinePosition: IntelligenceTimelinePosition;
  selectionPath: IntelligenceSelectionPath;
  filters: IntelligenceContextFilters;
  viewMode: IntelligenceViewMode;
  dashboardMode: DashboardIntelligenceMode;
  panel: DashboardIntelligencePanelId;
  consumer: IntelligenceConsumerId;
  requestId: string;
  timestamp: string;
  executiveTimeContext: ExecutiveTimeContext;
  futureExtension: IntelligenceFutureExtension;
  source: typeof INTELLIGENCE_CONTEXT_SOURCE;
}>;

export type BuildIntelligenceContextInput = Readonly<{
  workspace?: WorkspaceId | null;
  selectedObject?: string | null;
  selectedRelationship?: string | null;
  selectedKpi?: string | null;
  selectedRisk?: string | null;
  selectedScenario?: string | null;
  selectedDataSource?: string | null;
  timelinePosition?: Partial<IntelligenceTimelinePosition> | null;
  selectionPath?: readonly string[] | null;
  filters?: Readonly<Record<string, string | null>> | null;
  viewMode?: IntelligenceViewMode | null;
  dashboardMode?: DashboardIntelligenceMode | null;
  panel?: DashboardIntelligencePanelId | null;
  consumer: IntelligenceConsumerId;
  requestId?: string | null;
  timestamp?: string | null;
  executiveTime?: BuildExecutiveTimeContextInput | null;
  futureExtension?: IntelligenceFutureExtension | null;
}>;

export type IntelligenceContextValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type IntelligenceContextValidationResult = Readonly<{
  valid: boolean;
  issues: readonly IntelligenceContextValidationIssue[];
}>;

export type IntelligenceContextSnapshot = Readonly<{
  snapshotId: string;
  context: UnifiedIntelligenceContext;
  capturedAt: string;
  reason: "created" | "updated" | "restored" | "validated";
}>;

export type IntelligenceContextRegistryState = Readonly<{
  contractVersion: typeof INTELLIGENCE_CONTEXT_VERSION;
  currentContext: UnifiedIntelligenceContext | null;
  previousContext: UnifiedIntelligenceContext | null;
  activeConsumer: IntelligenceConsumerId | null;
  contextVersion: typeof INTELLIGENCE_CONTEXT_VERSION;
  changeCounter: number;
  updatedAt: string;
}>;

export type IntelligenceContextEventType =
  | "ContextCreated"
  | "ContextUpdated"
  | "ContextChanged"
  | "ContextValidated"
  | "ContextRejected"
  | "ContextSnapshotCreated"
  | "ContextRestored";

export type IntelligenceContextEvent = Readonly<{
  type: IntelligenceContextEventType;
  contextId: string | null;
  consumer: IntelligenceConsumerId | null;
  workspace: WorkspaceId | null;
  timestamp: string;
}>;

export type IntelligenceContextDiagnostics = Readonly<{
  contextId: string;
  consumer: IntelligenceConsumerId;
  workspace: WorkspaceId | null;
  panel: DashboardIntelligencePanelId;
  dashboardMode: DashboardIntelligenceMode;
  viewMode: IntelligenceViewMode;
  selectedObject: string | null;
  selectedScenario: string | null;
  selectedRelationship: string | null;
  selectedKpi: string | null;
  selectedRisk: string | null;
  timelinePosition: IntelligenceTimelinePosition;
  contextVersion: typeof INTELLIGENCE_CONTEXT_VERSION;
  validationResult: IntelligenceContextValidationResult;
  executionTimeMs: number;
  generatedAt: string;
}>;

export type IntelligenceContextBuildResult = Readonly<{
  success: boolean;
  context: UnifiedIntelligenceContext | null;
  validation: IntelligenceContextValidationResult;
  reason: string;
  message: string;
}>;

export const INTELLIGENCE_CONTEXT_RESERVED_EXTENSIONS = Object.freeze([
  "executive_timeline",
  "war_room",
  "reports",
  "decision_center",
  "ai_panels",
  "executive_registry",
  "future_ds_engines",
] as const);

export const INTELLIGENCE_VIEW_MODES = Object.freeze([
  "overview",
  "focus",
  "detail",
  "compare",
  "reserved",
] as const satisfies readonly IntelligenceViewMode[]);
