/**
 * MRP:11:2:7 - Assistant intelligence cards contract.
 */

import type { AssistantExecutiveActionKind } from "../assistant-bridge/assistantDashboardBridgeContract.ts";
import type { DashboardMode } from "../dashboard/dashboardModeRuntimeContract.ts";

export type AssistantIntelligenceCardId =
  | "executive_insight"
  | "risk_signal"
  | "recommendation"
  | "scenario";

export type AssistantIntelligenceCardTone = "neutral" | "insight" | "risk" | "recommendation" | "scenario";

export type AssistantIntelligenceCardActionId =
  | "explain"
  | "analyze"
  | "compare"
  | "simulate"
  | "open_dashboard";

export type AssistantIntelligenceCardAction = Readonly<{
  id: AssistantIntelligenceCardActionId;
  label: string;
  bridgeAction: AssistantExecutiveActionKind | null;
  prompt?: string;
}>;

export type AssistantIntelligenceCardModel = Readonly<{
  id: AssistantIntelligenceCardId;
  title: string;
  icon: string;
  summary: string;
  detail: string;
  badge?: string;
  badgeTone?: "neutral" | "success" | "warning" | "danger" | "info";
  tone: AssistantIntelligenceCardTone;
  priority: number;
  action: AssistantIntelligenceCardAction;
}>;

export type AssistantIntelligenceCardsInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectName?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  activeScenarioId?: string | null;
  activeScenarioName?: string | null;
  activeScenarioLabel?: string | null;
  dashboardMode?: DashboardMode | null;
  decisionContextSummary?: string | null;
  assistantContextSummary?: string | null;
  workspaceContextLabel?: string | null;
  activeWorkspaceId?: string | null;
  dashboardContext?: string | null;
  hasRiskSignal?: boolean;
  hasScenarioConflict?: boolean;
  objectImpact?: "low" | "moderate" | "high" | "critical" | null;
}>;

export const ASSISTANT_INTELLIGENCE_CARD_LIMIT = 4;

export const DEFAULT_ASSISTANT_INTELLIGENCE_ACTIONS = Object.freeze({
  explain: Object.freeze({
    id: "explain",
    label: "Explain",
    bridgeAction: null,
  } satisfies AssistantIntelligenceCardAction),
  analyze: Object.freeze({
    id: "analyze",
    label: "Analyze",
    bridgeAction: "OPEN_ANALYZE",
  } satisfies AssistantIntelligenceCardAction),
  compare: Object.freeze({
    id: "compare",
    label: "Compare",
    bridgeAction: "OPEN_COMPARE",
  } satisfies AssistantIntelligenceCardAction),
  simulate: Object.freeze({
    id: "simulate",
    label: "Simulate",
    bridgeAction: "OPEN_SCENARIO",
  } satisfies AssistantIntelligenceCardAction),
  openDashboard: Object.freeze({
    id: "open_dashboard",
    label: "Open Dashboard",
    bridgeAction: null,
  } satisfies AssistantIntelligenceCardAction),
});
