/**
 * APP-1:3 — Executive Time Camera types.
 * Temporal navigation metadata — no UI, persistence, or consumer integration.
 */

import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";
import type { ExecutiveTimeContextKey, ExecutiveTimeWorkspaceId } from "./executiveTimeTypes.ts";

export const EXECUTIVE_TIME_CAMERA_VERSION = "APP-1/3" as const;

export type ExecutiveTimeCameraMode =
  | "follow_now"
  | "manual"
  | "historical"
  | "forecast"
  | "comparison";

export type ExecutiveTimeCameraNavigationSource =
  | "user"
  | "assistant"
  | "dashboard"
  | "scenario"
  | "automation"
  | "system";

export type ExecutiveTimeCameraNavigationReason =
  | "manual_selection"
  | "shortcut"
  | "comparison"
  | "review"
  | "planning"
  | "forecast"
  | "restore"
  | "initialization";

export type ExecutiveTimeCameraPosition = Readonly<{
  currentContext: ExecutiveTimeContextKey;
  previousContext: ExecutiveTimeContextKey | null;
  navigationReason: ExecutiveTimeCameraNavigationReason;
  navigationSource: ExecutiveTimeCameraNavigationSource;
  timestamp: string;
  workspaceId: ExecutiveTimeWorkspaceId;
  version: typeof EXECUTIVE_TIME_CAMERA_VERSION;
  mode: ExecutiveTimeCameraMode;
}>;

export type ExecutiveTimeCameraError = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveTimeCameraNavigationRequest = Readonly<{
  workspaceId: ExecutiveTimeWorkspaceId;
  source?: ExecutiveTimeCameraNavigationSource;
  reason?: ExecutiveTimeCameraNavigationReason;
  validateWorkspace?: boolean;
  replayFromHistory?: boolean;
}>;

export type ExecutiveTimeCameraMoveRequest = ExecutiveTimeCameraNavigationRequest &
  Readonly<{
    contextId: ExecutiveTimeContextKey;
  }>;

export type ExecutiveTimeCameraNavigationResult = Readonly<{
  success: boolean;
  position: ExecutiveTimeCameraPosition | null;
  error: ExecutiveTimeCameraError | null;
}>;

export type ExecutiveTimeCameraHistoryEntry = Readonly<{
  position: ExecutiveTimeCameraPosition;
  recordedAt: string;
}>;

export type ExecutiveTimeCameraHistorySnapshot = Readonly<{
  workspaceId: ExecutiveTimeWorkspaceId;
  entries: readonly ExecutiveTimeCameraHistoryEntry[];
  cursor: number;
  canPrevious: boolean;
  canNext: boolean;
}>;

export type ExecutiveTimeCameraDashboardBinding = Readonly<{
  consumerId: "dashboard";
  readOnly: true;
  integrationImplemented: false;
  consumes: "resolveCurrentContext";
}>;

export type ExecutiveTimeCameraAssistantBinding = Readonly<{
  consumerId: "assistant";
  readOnly: true;
  integrationImplemented: false;
  consumes: "resolveCurrentContext";
}>;

export type ExecutiveTimeCameraTimelineBinding = Readonly<{
  consumerId: "timeline";
  readOnly: true;
  integrationImplemented: false;
  consumes: "resolveCurrentContext";
}>;

export type ExecutiveTimeCameraScenarioBinding = Readonly<{
  consumerId: "scenario";
  readOnly: true;
  integrationImplemented: false;
  consumes: "resolveCurrentContext";
}>;

export type ExecutiveTimeCameraRecommendationBinding = Readonly<{
  consumerId: "recommendation";
  readOnly: true;
  integrationImplemented: false;
  consumes: "resolveCurrentContext";
}>;

export type ExecutiveTimeCameraConsumerBindings = Readonly<{
  dashboard: ExecutiveTimeCameraDashboardBinding;
  assistant: ExecutiveTimeCameraAssistantBinding;
  timeline: ExecutiveTimeCameraTimelineBinding;
  scenario: ExecutiveTimeCameraScenarioBinding;
  recommendation: ExecutiveTimeCameraRecommendationBinding;
}>;

export type ExecutiveTimeCameraCertificationResult = Readonly<{
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
