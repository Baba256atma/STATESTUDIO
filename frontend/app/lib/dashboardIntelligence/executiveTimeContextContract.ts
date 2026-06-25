/**
 * INT-1.3 — Executive Time Context Contract.
 * Unified time understanding: PAST, NOW, FUTURE — architecture only.
 */

import type { IntelligenceTimelinePosition } from "./intelligenceContextContract.ts";
import type { IntelligenceConsumerId } from "./singleIntelligenceSourceContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const EXECUTIVE_TIME_CONTEXT_VERSION = "INT-1.3" as const;

export const EXECUTIVE_TIME_CONTEXT_TAGS = Object.freeze([
  "[INT13_TIME_CONTEXT]",
  "[EXECUTIVE_TIME_CONTEXT]",
  "[TIME_CONTEXT_BUILDER]",
  "[TIME_CONTEXT_REGISTRY]",
  "[PAST_NOW_FUTURE]",
  "[IMMUTABLE_TIME_CONTEXT]",
  "[INT13_COMPLETE]",
] as const);

export const NEXORA_EXECUTIVE_TIME_CONTEXT_LOG_PREFIX = "[NexoraExecutiveTimeContext]" as const;

export const EXECUTIVE_TIME_CONTEXT_SOURCE = "int-1-3-executive-time-context" as const;

export type ExecutiveTimeState = "past" | "now" | "future";

export const EXECUTIVE_TIME_STATES = Object.freeze([
  "past",
  "now",
  "future",
] as const satisfies readonly ExecutiveTimeState[]);

export type ExecutiveTimeFutureExtension = Readonly<Record<string, unknown>>;

export type ExecutiveTimeContext = Readonly<{
  contractVersion: typeof EXECUTIVE_TIME_CONTEXT_VERSION;
  timeContextId: string;
  timeState: ExecutiveTimeState;
  referenceTimestamp: string;
  requestedTime: string | null;
  timelinePosition: IntelligenceTimelinePosition;
  source: typeof EXECUTIVE_TIME_CONTEXT_SOURCE;
  confidence: null;
  version: typeof EXECUTIVE_TIME_CONTEXT_VERSION;
  futureExtension: ExecutiveTimeFutureExtension;
}>;

export type BuildExecutiveTimeContextInput = Readonly<{
  timeState?: ExecutiveTimeState | null;
  referenceTimestamp?: string | null;
  requestedTime?: string | null;
  timelinePosition?: Partial<IntelligenceTimelinePosition> | null;
  futureExtension?: ExecutiveTimeFutureExtension | null;
}>;

export type ExecutiveTimeContextValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveTimeContextValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveTimeContextValidationIssue[];
}>;

export type ExecutiveTimeContextRegistryState = Readonly<{
  contractVersion: typeof EXECUTIVE_TIME_CONTEXT_VERSION;
  currentTimeContext: ExecutiveTimeContext | null;
  previousTimeContext: ExecutiveTimeContext | null;
  activeVersion: typeof EXECUTIVE_TIME_CONTEXT_VERSION;
  changeCounter: number;
  updatedAt: string;
}>;

export type ExecutiveTimeContextEventType =
  | "TimeContextCreated"
  | "TimeContextChanged"
  | "TimeContextValidated"
  | "TimeContextRejected"
  | "TimeContextUpdated";

export type ExecutiveTimeContextEvent = Readonly<{
  type: ExecutiveTimeContextEventType;
  timeContextId: string | null;
  timeState: ExecutiveTimeState | null;
  timestamp: string;
}>;

export type ExecutiveTimeContextDiagnostics = Readonly<{
  timeContextId: string;
  consumer: IntelligenceConsumerId | null;
  workspace: WorkspaceId | null;
  timeState: ExecutiveTimeState;
  contextVersion: typeof EXECUTIVE_TIME_CONTEXT_VERSION;
  timelinePosition: IntelligenceTimelinePosition;
  validationResult: ExecutiveTimeContextValidationResult;
  executionTimeMs: number;
  generatedAt: string;
}>;

export type ExecutiveTimeContextBuildResult = Readonly<{
  success: boolean;
  timeContext: ExecutiveTimeContext | null;
  validation: ExecutiveTimeContextValidationResult;
  reason: string;
  message: string;
}>;

export const EXECUTIVE_TIME_STATE_MEANINGS: Readonly<Record<ExecutiveTimeState, string>> =
  Object.freeze({
    past: "Already happened — historical, timeline, completed.",
    now: "Current business state — live status, current risks, KPIs, relationships.",
    future: "Hypothetical — simulation, prediction, what-if, planned.",
  });

export const EXECUTIVE_TIME_RESERVED_EXTENSIONS = Object.freeze([
  "historical_replay",
  "executive_timeline",
  "planning_horizon",
  "forecast_window",
  "quarter_comparison",
  "year_comparison",
  "multi_period_analysis",
  "scenario_horizon",
  "scheduled_plans",
] as const);

export const EXECUTIVE_TIME_METADATA_KEYS = Object.freeze({
  timeState: "executiveTimeState",
  referenceTimestamp: "executiveReferenceTimestamp",
  requestedTime: "executiveRequestedTime",
  timeContextId: "executiveTimeContextId",
  timeVersion: "executiveTimeVersion",
} as const);
