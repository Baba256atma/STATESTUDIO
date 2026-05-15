import type { MutableRefObject } from "react";

import type { SceneJson } from "../../../lib/sceneTypes.ts";
import type { TypeCAIExecutiveInsight } from "../../../lib/typec/aiTypeCExecutiveInsight.ts";
import type { TypeCAIInsightRequest, TypeCAIInsightResponse } from "../../../lib/typec/typeCAIContracts.ts";
import type { TypeCAlert } from "../../../lib/typec/typeCAlerts.ts";
import type { TypeCDecisionDraft } from "../../../lib/typec/typeCDecisionDraft.ts";
import type { TypeCDecisionReadinessSnapshot } from "../../../lib/typec/typeCDecisionReadiness.ts";
import type { TypeCDecisionRecommendation } from "../../../lib/typec/typeCDecisionRecommendation.ts";
import type { TypeCExecutiveSummary } from "../../../lib/typec/typeCExecutiveSummary.ts";
import type { TypeCExecutionState } from "../../../lib/typec/typeCExecutionState.ts";
import type { TypeCMemoryState } from "../../../lib/typec/typeCMemory.ts";
import type { TypeCMultiAgentInsight, TypeCMultiAgentRequest } from "../../../lib/typec/typeCMultiAgentContracts.ts";
import type { TypeCConnectionSuggestion } from "../../../lib/typec/typeCConnectionSuggestions.ts";
import type { TypeCPipelineEvent, TypeCPipelineEventInput } from "../../../lib/typec/typeCPipelineTracker.ts";
import type { TypeCSandboxRequest, TypeCSandboxResult, TypeCSandboxStrategy } from "../../../lib/typec/typeCSandboxContracts.ts";
import type { TypeCScenarioComparison } from "../../../lib/typec/typeCScenarioComparison.ts";
import type { TypeCScenarioDraft } from "../../../lib/typec/typeCScenarioDrafts.ts";
import type { TypeCScenarioSimulation } from "../../../lib/typec/typeCScenarioSimulation.ts";
import type { TypeCScenarioState } from "../../../lib/typec/typeCScenarioTypes.ts";

// ======================================================
// Type-C Orchestration State Ownership
// ======================================================
//
// This file stabilizes extraction boundaries for Type-C orchestration before any logic moves out of
// `HomeScreen.tsx`. It holds **types and metadata only**: no hooks, no runtime orchestration, no UI.
//
// Group types mirror the `useState` / `useRef` clusters behind the O1 extraction boundary comment
// `O1 Extraction Boundary: Type-C orchestration` in HomeScreen. See `HomeScreenOptimizationInventory.md`.

/** A. Scenario + decision readiness + command summary (Type-C “command deck” read model). */
export type TypeCScenarioOrchestrationState = Readonly<{
  typeCScenarioState: TypeCScenarioState;
  typeCDecisionReadiness: TypeCDecisionReadinessSnapshot | null;
  typeCDecisionDraft: TypeCDecisionDraft | null;
  typeCCommandExecutiveSummary: TypeCExecutiveSummary | null;
}>;

/** B. Type-C AI insight request lifecycle (executive + adapter response). */
export type TypeCAIOrchestrationState = Readonly<{
  typeCAIExecutiveInsight: TypeCAIExecutiveInsight | null;
  typeCAIInsight: TypeCAIInsightResponse | null;
  typeCAIInsightLoading: boolean;
  typeCAIInsightError: string | null;
}>;

/** C. Multi-agent insight request lifecycle. */
export type TypeCMultiAgentOrchestrationState = Readonly<{
  typeCMultiAgentInsight: TypeCMultiAgentInsight | null;
  typeCMultiAgentLoading: boolean;
  typeCMultiAgentError: string | null;
}>;

/** D. Sandbox (strategy lab) request lifecycle. */
export type TypeCSandboxOrchestrationState = Readonly<{
  typeCSandboxResult: TypeCSandboxResult | null;
  typeCSandboxLoading: boolean;
  typeCSandboxError: string | null;
}>;

/** E. Scenario drafts, simulations, comparisons, and surfaced recommendations. */
export type TypeCSimulationOrchestrationState = Readonly<{
  connectionSuggestions: readonly TypeCConnectionSuggestion[] | null;
  scenarioDrafts: readonly TypeCScenarioDraft[] | null;
  activeTypeCScenario: TypeCScenarioDraft | null;
  activeSimulation: TypeCScenarioSimulation | null;
  scenarioComparison: TypeCScenarioComparison | null;
  scenarioComparisonDrafts: readonly TypeCScenarioDraft[] | null;
  decisionRecommendation: TypeCDecisionRecommendation | null;
}>;

/** F. Execution loop state bound to a scenario draft. */
export type TypeCExecutionOrchestrationState = Readonly<{
  executionState: TypeCExecutionState | null;
  executionScenario: TypeCScenarioDraft | null;
}>;

/** G. Alerts + durable Type-C memory (learning / recall surface). */
export type TypeCMemoryOrchestrationState = Readonly<{
  typeCAlerts: readonly TypeCAlert[];
  typeCMemoryState: TypeCMemoryState;
}>;

/** Master read model: all Type-C orchestration groups composed (mirrors HomeScreen Type-C zone). */
export type TypeCOrchestrationState = Readonly<{
  scenario: TypeCScenarioOrchestrationState;
  ai: TypeCAIOrchestrationState;
  multiAgent: TypeCMultiAgentOrchestrationState;
  sandbox: TypeCSandboxOrchestrationState;
  simulation: TypeCSimulationOrchestrationState;
  execution: TypeCExecutionOrchestrationState;
  alertsMemory: TypeCMemoryOrchestrationState;
}>;

/** Refs owned by Type-C orchestration (dedupe / panel routing hints / pipeline trace). */
export type TypeCOrchestrationRefs = Readonly<{
  lastTypeCSignatureRef: MutableRefObject<string | null>;
  lastTypeCExecutiveActionPanelRef: MutableRefObject<{ signature: string; at: number } | null>;
  typeCPipelineEventsRef: MutableRefObject<TypeCPipelineEvent[]>;
}>;

/**
 * Callback name → orchestration subgroup (for O1+ extraction prompts).
 * Keys align with `useCallback` identifiers in `HomeScreen.tsx` under the Type-C boundary.
 */
export type TypeCOrchestrationCallbackMap = {
  refreshTypeCDecisionReadiness: "decision";
  createTypeCDecisionDraft: "decision";
  createTypeCExecutiveSummary: "decision";
  createTypeCScenarioDraft: "scenario";
  applyTypeCScenarioStatusIntent: "scenario";
  applyTypeCConnectionSuggestions: "simulation";
  cancelTypeCConnectionSuggestions: "simulation";
  cancelTypeCScenarioDrafts: "simulation";
  openTypeCScenarioDraftWarRoom: "simulation";
  compareTypeCScenarioDrafts: "simulation";
  closeTypeCScenarioCompare: "simulation";
  openBestTypeCScenarioInWarRoom: "simulation";
  exitTypeCScenarioSimulation: "simulation";
  handleStartTypeCExecution: "execution";
  handlePauseTypeCExecution: "execution";
  handleStopTypeCExecution: "execution";
  handleAcknowledgeTypeCAlert: "alerts";
  handleClearTypeCAlerts: "alerts";
  handleClearTypeCMemory: "memory";
};

export const TYPE_C_ORCHESTRATION_EXTRACTION_PLAN = {
  phase: "O1",
  zone: "type_c_orchestration",
  extractionOrder: ["types", "state", "callbacks", "effects", "derived_state", "panel_wiring"] as const,
  protectedAreas: ["scene_apply", "right_panel_routing", "chat_pipeline"] as const,
} as const;

/** O1:5 — Scenario + decision callbacks surfaced by `useTypeCOrchestration` (implementation in hook module). */
export type TypeCScenarioDecisionCallbacks = {
  trackTypeCPipelineEvent: (eventInput: TypeCPipelineEventInput) => void;
  refreshTypeCDecisionReadiness: (scenarioStateOverride?: TypeCScenarioState) => TypeCDecisionReadinessSnapshot;
  createTypeCDecisionDraft: () => boolean;
  createTypeCExecutiveSummary: () => boolean;
  createTypeCScenarioDraft: () => boolean;
  applyTypeCScenarioStatusIntent: (intentType: "select_scenario" | "ignore_scenario" | "ready_for_decision") => boolean;
};

/**
 * HomeScreen-owned ref updated each render after focus + executive summary resolve; the hook reads
 * `.current` when AI executive insight is requested (O1:6 — avoids moving `useTypeCOrchestration` below late hooks).
 */
export type TypeCExecutiveInsightContextRef = MutableRefObject<{
  focusedId: string | null;
  selectedObjectIdState: string | null;
  typeCExecutiveSummary: TypeCExecutiveSummary | null;
}>;

/** O1:6 — Type-C AI insight, multi-agent insight, sandbox run, and AI executive insight callbacks. */
export type TypeCAISandboxMultiAgentCallbacks = {
  enhanceTypeCExecutiveSummary: () => TypeCAIExecutiveInsight | null;
  handleEnhanceTypeCExecutiveSummary: () => Promise<void>;
  handleGenerateTypeCAIInsight: () => Promise<void>;
  handleCloseTypeCAIInsight: () => void;
  handleRunTypeCMultiAgent: () => Promise<void>;
  handleCloseTypeCMultiAgent: () => void;
  handleRunTypeCSandbox: () => Promise<void>;
  handleCloseTypeCSandbox: () => void;
  handleReviewTypeCSandboxStrategy: (strategy: TypeCSandboxStrategy) => void;
  handleCompareTypeCSandboxStrategy: (strategy: TypeCSandboxStrategy) => void;
  handlePromoteTypeCSandboxStrategy: (strategy: TypeCSandboxStrategy) => void;
};

/** `useSceneApplyController` assigns `applySceneChangeSafe` here in a `useEffect` (O2:6). */
export type TypeCApplySceneUpdateFn = (
  nextOrUpdater: SceneJson | null | ((prev: SceneJson | null) => SceneJson | null),
  source: string,
  options?: { bypassDedupe?: boolean }
) => void;

export type TypeCApplySceneUpdateRef = MutableRefObject<TypeCApplySceneUpdateFn | null>;

/** Type-C reads this ref; HomeScreen passes the ref into `useRightPanelController` / `useRightPanelControllerBridgeWiring`, which assign `openSimPanel` in an effect (O3:6). */
export type TypeCOpenSimPanelForTypeCRef = MutableRefObject<
  ((view: string, reason: string, contextId?: string | null) => void) | null
>;

/** O1:7 — connection suggestions, scenario drafts, simulation, comparison, decision recommendation wiring. */
export type TypeCConnectionSimulationCompareCallbacks = {
  cancelTypeCConnectionSuggestions: () => void;
  cancelTypeCScenarioDrafts: () => void;
  applyTypeCConnectionSuggestions: (suggestions: TypeCConnectionSuggestion[]) => void;
  openTypeCScenarioDraftWarRoom: (draft: TypeCScenarioDraft) => void;
  compareTypeCScenarioDrafts: (drafts: TypeCScenarioDraft[]) => void;
  closeTypeCScenarioCompare: () => void;
  openBestTypeCScenarioInWarRoom: () => void;
  exitTypeCScenarioSimulation: () => void;
};

/** O1:9 — execution lifecycle, alerts, and memory callbacks (implementation in `useTypeCOrchestration`). */
export type TypeCExecutionAlertsMemoryCallbacks = {
  handleStartTypeCExecution: () => void;
  handlePauseTypeCExecution: () => void;
  handleStopTypeCExecution: () => void;
  handleAcknowledgeTypeCAlert: (alertId: string) => void;
  handleClearTypeCAlerts: () => void;
  handleClearTypeCMemory: () => void;
};

export type TypeCOrchestrationCallbacks = TypeCScenarioDecisionCallbacks &
  TypeCAISandboxMultiAgentCallbacks &
  TypeCConnectionSimulationCompareCallbacks &
  TypeCExecutionAlertsMemoryCallbacks;

/** `useTypeCOrchestration` return shape: orchestration snapshot + refs + O1:5 / O1:6 / O1:7 / O1:9 callbacks (O1:10 cleanup: no duplicate HomeScreen locals). */
export type UseTypeCOrchestrationContract = Readonly<{
  state: TypeCOrchestrationState;
  refs: TypeCOrchestrationRefs;
  callbacks: TypeCOrchestrationCallbacks;
}>;
