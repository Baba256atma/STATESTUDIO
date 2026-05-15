import { useCallback, useEffect, useMemo, useRef, type Dispatch, type SetStateAction } from "react";

import type { SceneJson } from "../../../lib/sceneTypes.ts";
import {
  applyTypeCConnectionSuggestionsToScene,
} from "../../../lib/typec/typeCConnectionSuggestions.ts";
import type { TypeCConnectionSuggestion } from "../../../lib/typec/typeCConnectionSuggestions.ts";
import {
  buildTypeCDecisionRecommendation,
  type TypeCDecisionRecommendation,
} from "../../../lib/typec/typeCDecisionRecommendation.ts";
import {
  compareTypeCScenarioSimulations,
  type TypeCScenarioComparison,
} from "../../../lib/typec/typeCScenarioComparison.ts";
import { buildTypeCScenarioDrafts, type TypeCScenarioDraft } from "../../../lib/typec/typeCScenarioDrafts.ts";
import {
  clearTypeCScenarioSimulation,
  simulateTypeCScenario,
  type TypeCScenarioSimulation,
} from "../../../lib/typec/typeCScenarioSimulation.ts";
import {
  acknowledgeTypeCAlert,
  buildTypeCAlerts,
  clearTypeCAlerts,
  mergeTypeCAlerts,
  type TypeCAlert,
} from "../../../lib/typec/typeCAlerts.ts";
import {
  pauseTypeCExecution,
  startTypeCExecution,
  stopTypeCExecution,
  type TypeCExecutionState,
} from "../../../lib/typec/typeCExecutionState.ts";
import {
  buildTypeCAIExecutiveInsight,
  type TypeCAIExecutiveInsight,
} from "../../../lib/typec/aiTypeCExecutiveInsight.ts";
import {
  requestTypeCAIInsight as requestTypeCAIInsightApi,
} from "../../../lib/typec/typeCAIAdapter.ts";
import type { TypeCAIInsightRequest, TypeCAIInsightResponse } from "../../../lib/typec/typeCAIContracts.ts";
import {
  requestTypeCMultiAgentInsight as requestTypeCMultiAgentInsightApi,
} from "../../../lib/typec/typeCMultiAgentAdapter.ts";
import type { TypeCMultiAgentInsight, TypeCMultiAgentRequest } from "../../../lib/typec/typeCMultiAgentContracts.ts";
import {
  requestTypeCSandboxResult as requestTypeCSandboxResultApi,
} from "../../../lib/typec/typeCSandboxAdapter.ts";
import type { TypeCSandboxRequest, TypeCSandboxResult, TypeCSandboxStrategy } from "../../../lib/typec/typeCSandboxContracts.ts";
import {
  addScenarioToState,
  buildTypeCScenarioFromScene,
  ignoreTypeCScenario,
  markScenarioReadyForDecision,
  selectTypeCScenario,
} from "../../../lib/typec/typeCScenarioBuilder.ts";
import { buildTypeCDecisionDraft, type TypeCDecisionDraft } from "../../../lib/typec/typeCDecisionDraft.ts";
import {
  buildTypeCDecisionReadinessSnapshot,
  type TypeCDecisionReadinessSnapshot,
} from "../../../lib/typec/typeCDecisionReadiness.ts";
import {
  buildTypeCExecutiveSummary as buildTypeCExecutiveSummaryFromDraft,
  type TypeCExecutiveSummary,
} from "../../../lib/typec/typeCExecutiveSummary.ts";
import {
  addTypeCMemoryEntry,
  buildTypeCMemoryEntry,
  clearTypeCMemory,
  createEmptyTypeCMemoryState,
  type TypeCMemoryState,
} from "../../../lib/typec/typeCMemory.ts";
import {
  createTypeCPipelineEvent,
  type TypeCPipelineEvent,
  type TypeCPipelineEventInput,
} from "../../../lib/typec/typeCPipelineTracker.ts";
import type { TypeCScenarioState } from "../../../lib/typec/typeCScenarioTypes.ts";
import {
  TYPE_C_ORCHESTRATION_EXTRACTION_PLAN,
  type TypeCApplySceneUpdateRef,
  type TypeCOrchestrationCallbacks,
  type TypeCOrchestrationRefs,
  type TypeCOrchestrationState,
  type TypeCExecutiveInsightContextRef,
  type TypeCOpenSimPanelForTypeCRef,
  type UseTypeCOrchestrationContract,
} from "./useTypeCOrchestration.types.ts";

/** Minimal Type-C orchestration snapshot when HomeScreen has not passed `state` yet (O1:4 placeholder only). */
function buildTypeCOrchestrationFallbackState(): TypeCOrchestrationState {
  const emptyScenarioState: TypeCScenarioState = { scenarios: [], selectedScenarioId: null };
  const emptyMemory = createEmptyTypeCMemoryState();
  return {
    scenario: {
      typeCScenarioState: emptyScenarioState,
      typeCDecisionReadiness: null,
      typeCDecisionDraft: null,
      typeCCommandExecutiveSummary: null,
    },
    ai: {
      typeCAIExecutiveInsight: null,
      typeCAIInsight: null,
      typeCAIInsightLoading: false,
      typeCAIInsightError: null,
    },
    multiAgent: {
      typeCMultiAgentInsight: null,
      typeCMultiAgentLoading: false,
      typeCMultiAgentError: null,
    },
    sandbox: {
      typeCSandboxResult: null,
      typeCSandboxLoading: false,
      typeCSandboxError: null,
    },
    simulation: {
      connectionSuggestions: null,
      scenarioDrafts: null,
      activeTypeCScenario: null,
      activeSimulation: null,
      scenarioComparison: null,
      scenarioComparisonDrafts: null,
      decisionRecommendation: null,
    },
    execution: {
      executionState: null,
      executionScenario: null,
    },
    alertsMemory: {
      typeCAlerts: [],
      typeCMemoryState: emptyMemory,
    },
  };
}

const TYPE_C_ORCHESTRATION_FALLBACK_STATE: TypeCOrchestrationState = buildTypeCOrchestrationFallbackState();

export type UseTypeCOrchestrationInput = {
  enabled: boolean;
  mode: string;
  typeCMode: string;
  sceneJson: SceneJson | null;
  state?: TypeCOrchestrationState | null;
  refs?: Partial<TypeCOrchestrationRefs> | null;
  setTypeCScenarioState: Dispatch<SetStateAction<TypeCScenarioState>>;
  setTypeCDecisionReadiness: Dispatch<SetStateAction<TypeCDecisionReadinessSnapshot | null>>;
  setTypeCDecisionDraft: Dispatch<SetStateAction<TypeCDecisionDraft | null>>;
  setTypeCCommandExecutiveSummary: Dispatch<SetStateAction<TypeCExecutiveSummary | null>>;
  typeCExecutiveInsightContextRef: TypeCExecutiveInsightContextRef;
  canGenerateTypeCAIInsight: boolean;
  canRunTypeCMultiAgent: boolean;
  typeCAIInsightRequest: TypeCAIInsightRequest;
  typeCMultiAgentRequest: TypeCMultiAgentRequest;
  typeCSandboxRequest: TypeCSandboxRequest | null;
  setTypeCAIExecutiveInsight: Dispatch<SetStateAction<TypeCAIExecutiveInsight | null>>;
  setTypeCAIInsight: Dispatch<SetStateAction<TypeCAIInsightResponse | null>>;
  setTypeCAIInsightLoading: Dispatch<SetStateAction<boolean>>;
  setTypeCAIInsightError: Dispatch<SetStateAction<string | null>>;
  setTypeCMultiAgentInsight: Dispatch<SetStateAction<TypeCMultiAgentInsight | null>>;
  setTypeCMultiAgentLoading: Dispatch<SetStateAction<boolean>>;
  setTypeCMultiAgentError: Dispatch<SetStateAction<string | null>>;
  setTypeCSandboxResult: Dispatch<SetStateAction<TypeCSandboxResult | null>>;
  setTypeCSandboxLoading: Dispatch<SetStateAction<boolean>>;
  setTypeCSandboxError: Dispatch<SetStateAction<string | null>>;
  applyTypeCSceneUpdateRef: TypeCApplySceneUpdateRef;
  openTypeCSimPanelRef: TypeCOpenSimPanelForTypeCRef;
  setConnectionSuggestions: Dispatch<SetStateAction<TypeCConnectionSuggestion[] | null>>;
  setScenarioDrafts: Dispatch<SetStateAction<TypeCScenarioDraft[] | null>>;
  setActiveTypeCScenario: Dispatch<SetStateAction<TypeCScenarioDraft | null>>;
  setActiveSimulation: Dispatch<SetStateAction<TypeCScenarioSimulation | null>>;
  setScenarioComparison: Dispatch<SetStateAction<TypeCScenarioComparison | null>>;
  setScenarioComparisonDrafts: Dispatch<SetStateAction<TypeCScenarioDraft[] | null>>;
  setDecisionRecommendation: Dispatch<SetStateAction<TypeCDecisionRecommendation | null>>;
  setExecutionState: Dispatch<SetStateAction<TypeCExecutionState | null>>;
  setExecutionScenario: Dispatch<SetStateAction<TypeCScenarioDraft | null>>;
  setTypeCAlerts: Dispatch<SetStateAction<TypeCAlert[]>>;
  setTypeCMemoryState: Dispatch<SetStateAction<TypeCMemoryState>>;
};

export type UseTypeCOrchestrationResult = UseTypeCOrchestrationContract & {
  enabled: boolean;
  mode: string;
  extractionPlan: typeof TYPE_C_ORCHESTRATION_EXTRACTION_PLAN;
};

/**
 * O1:4–O1:7 / O1:9 — Type-C orchestration hook: HomeScreen-owned state/refs; callbacks for scenario/decision (O1:5),
 * AI/sandbox/multi-agent (O1:6), connection/simulation/compare (O1:7), and execution/alerts/memory (O1:9).
 * O1:10 — verified single ownership of those callbacks (HomeScreen destructures only; no parallel implementations).
 */
export function useTypeCOrchestration(input: UseTypeCOrchestrationInput): UseTypeCOrchestrationResult {
  const placeholderLastSig = useRef<string | null>(null);
  const placeholderExecPanel = useRef<{ signature: string; at: number } | null>(null);
  const placeholderPipeline = useRef<TypeCPipelineEvent[]>([]);

  const resolvedState = useMemo(
    () => input.state ?? TYPE_C_ORCHESTRATION_FALLBACK_STATE,
    [input.state]
  );

  const resolvedRefs = useMemo<TypeCOrchestrationRefs>(
    () => ({
      lastTypeCSignatureRef: input.refs?.lastTypeCSignatureRef ?? placeholderLastSig,
      lastTypeCExecutiveActionPanelRef: input.refs?.lastTypeCExecutiveActionPanelRef ?? placeholderExecPanel,
      typeCPipelineEventsRef: input.refs?.typeCPipelineEventsRef ?? placeholderPipeline,
    }),
    [
      input.refs?.lastTypeCSignatureRef,
      input.refs?.lastTypeCExecutiveActionPanelRef,
      input.refs?.typeCPipelineEventsRef,
      placeholderLastSig,
      placeholderExecPanel,
      placeholderPipeline,
    ]
  );

  const pipelineEventsRef = resolvedRefs.typeCPipelineEventsRef;

  const trackTypeCPipelineEvent = useCallback((eventInput: TypeCPipelineEventInput) => {
    if (process.env.NODE_ENV === "production") return;

    const event = createTypeCPipelineEvent(eventInput);
    pipelineEventsRef.current = [...pipelineEventsRef.current.slice(-24), event];

    if (typeof window !== "undefined") {
      const debugWindow = window as typeof window & {
        __NEXORA_DEBUG__?: Record<string, unknown>;
      };
      debugWindow.__NEXORA_DEBUG__ = debugWindow.__NEXORA_DEBUG__ ?? {};
      debugWindow.__NEXORA_DEBUG__.typeCPipelineEvents = pipelineEventsRef.current;
    }

    globalThis.console.debug("[Nexora][TypeC][PipelineEvent]", event);
  }, [pipelineEventsRef]);

  const refreshTypeCDecisionReadiness = useCallback(
    (scenarioStateOverride?: TypeCScenarioState): TypeCDecisionReadinessSnapshot => {
      const scenarioState = scenarioStateOverride ?? resolvedState.scenario.typeCScenarioState;
      const snapshot = buildTypeCDecisionReadinessSnapshot({
        scene: input.sceneJson,
        scenarioState,
      });

      input.setTypeCDecisionReadiness((prev) => {
        if (prev?.id === snapshot.id) return prev;
        return snapshot;
      });

      if (process.env.NODE_ENV !== "production") {
        const logPayload = {
          level: snapshot.level,
          scenarioId: snapshot.scenarioId,
          missing: snapshot.missing,
        };
        globalThis.console.debug("[Nexora][TypeC][DecisionReadinessSnapshot]", logPayload);
        if (snapshot.level === "not_ready") {
          globalThis.console.debug("[Nexora][TypeC][DecisionReadinessSkipped]", logPayload);
        }
      }

      trackTypeCPipelineEvent({
        step: "decision_readiness_snapshot",
        scenarioId: snapshot.scenarioId ?? undefined,
        reason: snapshot.level,
      });

      return snapshot;
    },
    [input.sceneJson, input.setTypeCDecisionReadiness, resolvedState.scenario.typeCScenarioState, trackTypeCPipelineEvent]
  );

  const createTypeCDecisionDraft = useCallback((): boolean => {
    if (input.typeCMode !== "type_c") {
      if (process.env.NODE_ENV !== "production") {
        globalThis.console.debug("[Nexora][TypeC][DecisionDraftSkipped]", {
          reason: "mode_not_type_c",
        });
      }
      trackTypeCPipelineEvent({
        step: "skipped",
        intentType: "create_decision_draft",
        reason: "mode_not_type_c",
      });
      return false;
    }

    const readiness =
      resolvedState.scenario.typeCDecisionReadiness ??
      buildTypeCDecisionReadinessSnapshot({
        scene: input.sceneJson,
        scenarioState: resolvedState.scenario.typeCScenarioState,
      });
    const draft = buildTypeCDecisionDraft({
      readiness,
      scene: input.sceneJson,
    });

    if (!draft) {
      if (process.env.NODE_ENV !== "production") {
        globalThis.console.debug("[Nexora][TypeC][DecisionDraftSkipped]", {
          reason: "draft_build_failed",
        });
      }
      trackTypeCPipelineEvent({
        step: "skipped",
        intentType: "create_decision_draft",
        reason: "draft_build_failed",
      });
      return false;
    }

    input.setTypeCDecisionReadiness((prev) => {
      if (prev?.id === readiness.id) return prev;
      return readiness;
    });
    input.setTypeCDecisionDraft((prev) => {
      if (prev?.id === draft.id) return prev;
      return draft;
    });

    trackTypeCPipelineEvent({
      step: "decision_draft_created",
      scenarioId: draft.scenarioId ?? undefined,
      reason: draft.posture,
    });

    if (process.env.NODE_ENV !== "production") {
      globalThis.console.info("[Nexora][TypeC][DecisionDraftCreated]", {
        posture: draft.posture,
        confidence: draft.confidence,
        scenarioId: draft.scenarioId,
      });
    }

    return true;
  }, [
    input.sceneJson,
    input.setTypeCDecisionDraft,
    input.setTypeCDecisionReadiness,
    input.typeCMode,
    resolvedState.scenario.typeCDecisionReadiness,
    resolvedState.scenario.typeCScenarioState,
    trackTypeCPipelineEvent,
  ]);

  const createTypeCExecutiveSummary = useCallback((): boolean => {
    if (input.typeCMode !== "type_c") {
      if (process.env.NODE_ENV !== "production") {
        globalThis.console.debug("[Nexora][TypeC][ExecutiveSummarySkipped]", {
          reason: "mode_not_type_c",
        });
      }
      trackTypeCPipelineEvent({
        step: "skipped",
        intentType: "create_executive_summary",
        reason: "mode_not_type_c",
      });
      return false;
    }

    const readiness =
      resolvedState.scenario.typeCDecisionReadiness ??
      buildTypeCDecisionReadinessSnapshot({
        scene: input.sceneJson,
        scenarioState: resolvedState.scenario.typeCScenarioState,
      });
    const draft =
      resolvedState.scenario.typeCDecisionDraft ??
      buildTypeCDecisionDraft({
        readiness,
        scene: input.sceneJson,
      });
    const summary = buildTypeCExecutiveSummaryFromDraft({ draft });

    if (!summary) {
      if (process.env.NODE_ENV !== "production") {
        globalThis.console.debug("[Nexora][TypeC][ExecutiveSummarySkipped]", {
          reason: "summary_build_failed",
        });
      }
      trackTypeCPipelineEvent({
        step: "skipped",
        intentType: "create_executive_summary",
        reason: "summary_build_failed",
      });
      return false;
    }

    if (!resolvedState.scenario.typeCDecisionReadiness) {
      input.setTypeCDecisionReadiness(readiness);
    }
    if (!resolvedState.scenario.typeCDecisionDraft && draft) {
      input.setTypeCDecisionDraft(draft);
    }
    input.setTypeCCommandExecutiveSummary((prev) => {
      if (prev?.id === summary.id) return prev;
      return summary;
    });

    trackTypeCPipelineEvent({
      step: "executive_summary_created",
      scenarioId: summary.scenarioId ?? undefined,
      reason: summary.confidence.label,
    });

    if (process.env.NODE_ENV !== "production") {
      globalThis.console.info("[Nexora][TypeC][ExecutiveSummaryCreated]", {
        scenarioId: summary.scenarioId,
        confidence: summary.confidence.value,
        confidenceLabel: summary.confidence.label,
        headline: summary.headline,
      });
    }

    return true;
  }, [
    input.sceneJson,
    input.setTypeCDecisionDraft,
    input.setTypeCDecisionReadiness,
    input.setTypeCCommandExecutiveSummary,
    input.typeCMode,
    resolvedState.scenario.typeCDecisionDraft,
    resolvedState.scenario.typeCDecisionReadiness,
    resolvedState.scenario.typeCScenarioState,
    trackTypeCPipelineEvent,
  ]);

  const createTypeCScenarioDraft = useCallback((): boolean => {
    if (input.typeCMode !== "type_c" || !input.sceneJson) {
      if (process.env.NODE_ENV !== "production") {
        globalThis.console.debug("[Nexora][TypeC][ScenarioDraftSkipped]", {
          reason: input.typeCMode !== "type_c" ? "mode_not_type_c" : "missing_scene",
        });
      }
      trackTypeCPipelineEvent({
        step: "skipped",
        intentType: "create_scenario",
        reason: input.typeCMode !== "type_c" ? "mode_not_type_c" : "missing_scene",
      });
      return false;
    }

    input.setTypeCScenarioState((prev) => {
      const scenario = buildTypeCScenarioFromScene(input.sceneJson);
      if (!scenario) {
        if (process.env.NODE_ENV !== "production") {
          globalThis.console.debug("[Nexora][TypeC][ScenarioDraftSkipped]", {
            reason: "insufficient_scene_graph",
          });
        }
        trackTypeCPipelineEvent({
          step: "skipped",
          intentType: "create_scenario",
          reason: "insufficient_scene_graph",
        });
        return prev;
      }

      const next = addScenarioToState(prev, scenario);
      if (next === prev) {
        if (process.env.NODE_ENV !== "production") {
          globalThis.console.debug("[Nexora][TypeC][ScenarioDraftSkipped]", {
            reason: "duplicate_scenario",
            scenarioId: scenario.id,
          });
        }
        trackTypeCPipelineEvent({
          step: "skipped",
          intentType: "create_scenario",
          scenarioId: scenario.id,
          reason: "duplicate_scenario",
        });
        return prev;
      }

      if (process.env.NODE_ENV !== "production") {
        globalThis.console.info("[Nexora][TypeC][ScenarioDraftCreated]", {
          scenarioId: scenario.id,
        });
      }
      trackTypeCPipelineEvent({
        step: "scenario_draft_created",
        intentType: "create_scenario",
        objectIds: scenario.objectIds,
        scenarioId: scenario.id,
      });
      globalThis.queueMicrotask(() => refreshTypeCDecisionReadiness(next));
      return next;
    });

    return true;
  }, [input.sceneJson, input.setTypeCScenarioState, input.typeCMode, refreshTypeCDecisionReadiness, trackTypeCPipelineEvent]);

  const applyTypeCScenarioStatusIntent = useCallback(
    (intentType: "select_scenario" | "ignore_scenario" | "ready_for_decision"): boolean => {
      if (input.typeCMode !== "type_c") return false;

      input.setTypeCScenarioState((prev) => {
        const buildDraftState = (): TypeCScenarioState => {
          if (!input.sceneJson) return prev;
          const scenario = buildTypeCScenarioFromScene(input.sceneJson);
          if (!scenario) return prev;
          return addScenarioToState(prev, scenario);
        };
        const latestDraftId = (state: TypeCScenarioState): string | null =>
          [...state.scenarios].reverse().find((scenario) => scenario.status === "draft")?.id ?? null;
        const firstDraftId = (state: TypeCScenarioState): string | null =>
          state.scenarios.find((scenario) => scenario.status === "draft")?.id ?? null;
        const logSkipped = (reason: string) => {
          if (process.env.NODE_ENV !== "production") {
            globalThis.console.debug("[Nexora][TypeC][ScenarioStatusSkipped]", { intent: intentType, reason });
          }
          trackTypeCPipelineEvent({
            step: "skipped",
            intentType,
            reason,
          });
        };

        if (intentType === "select_scenario") {
          if (prev.selectedScenarioId) {
            if (process.env.NODE_ENV !== "production") {
              globalThis.console.debug("[Nexora][TypeC][ScenarioSelected]", { scenarioId: prev.selectedScenarioId });
            }
            trackTypeCPipelineEvent({
              step: "scenario_selected",
              intentType,
              scenarioId: prev.selectedScenarioId,
              reason: "already_selected",
            });
            return prev;
          }
          const working = buildDraftState();
          const scenarioId = working.selectedScenarioId ?? firstDraftId(working);
          if (!scenarioId) {
            logSkipped("no_draft_scenario");
            return prev;
          }
          const next = selectTypeCScenario(working, scenarioId);
          if (next === working) {
            logSkipped("selection_noop");
            return prev;
          }
          if (process.env.NODE_ENV !== "production") {
            globalThis.console.debug("[Nexora][TypeC][ScenarioSelected]", { scenarioId });
          }
          trackTypeCPipelineEvent({
            step: "scenario_selected",
            intentType,
            scenarioId,
          });
          globalThis.queueMicrotask(() => refreshTypeCDecisionReadiness(next));
          return next;
        }

        if (intentType === "ignore_scenario") {
          const scenarioId = prev.selectedScenarioId ?? latestDraftId(prev);
          if (!scenarioId) {
            logSkipped("no_scenario_to_ignore");
            return prev;
          }
          const next = ignoreTypeCScenario(prev, scenarioId);
          if (next === prev) {
            logSkipped("ignore_noop");
            return prev;
          }
          if (process.env.NODE_ENV !== "production") {
            globalThis.console.debug("[Nexora][TypeC][ScenarioIgnored]", { scenarioId });
          }
          trackTypeCPipelineEvent({
            step: "scenario_ignored",
            intentType,
            scenarioId,
          });
          globalThis.queueMicrotask(() => refreshTypeCDecisionReadiness(next));
          return next;
        }

        let working = prev.selectedScenarioId ? prev : buildDraftState();
        const scenarioId = working.selectedScenarioId ?? firstDraftId(working);
        if (!scenarioId) {
          logSkipped("no_scenario_to_mark_ready");
          return prev;
        }
        if (working.scenarios.find((scenario) => scenario.id === scenarioId)?.status === "draft") {
          working = selectTypeCScenario(working, scenarioId);
        }
        const next = markScenarioReadyForDecision(working, scenarioId);
        if (next === working) {
          logSkipped("ready_noop");
          return prev;
        }
        if (process.env.NODE_ENV !== "production") {
          globalThis.console.debug("[Nexora][TypeC][ScenarioReadyForDecision]", { scenarioId });
        }
        trackTypeCPipelineEvent({
          step: "scenario_ready_for_decision",
          intentType,
          scenarioId,
        });
        globalThis.queueMicrotask(() => refreshTypeCDecisionReadiness(next));
        return next;
      });

      return true;
    },
    [input.sceneJson, input.setTypeCScenarioState, input.typeCMode, refreshTypeCDecisionReadiness, trackTypeCPipelineEvent]
  );

  const enhanceTypeCExecutiveSummary = useCallback((): TypeCAIExecutiveInsight | null => {
    const { typeCExecutiveSummary, focusedId, selectedObjectIdState } = input.typeCExecutiveInsightContextRef.current;
    if (!typeCExecutiveSummary) return null;
    const objects = Array.isArray(input.sceneJson?.scene?.objects) ? input.sceneJson.scene.objects : [];
    const labelFor = (id: string | null | undefined): string | null => {
      if (!id) return null;
      const object = objects.find((candidate) => String(candidate.id ?? "") === id);
      const label = String(object?.label ?? object?.name ?? object?.display_label ?? "").trim();
      return label || null;
    };
    const insight = buildTypeCAIExecutiveInsight({
      deterministicSummary: typeCExecutiveSummary,
      sceneContext: {
        objectCount: objects.length,
        selectedObjectLabel: labelFor(selectedObjectIdState),
        focusedObjectLabel: labelFor(focusedId),
      },
    });

    input.setTypeCAIExecutiveInsight(insight);

    if (process.env.NODE_ENV !== "production") {
      globalThis.console.info("[Nexora][TypeC][AIExecutiveInsightCreated]", {
        source: insight.source,
        headline: insight.headline,
      });
    }

    return insight;
  }, [input.sceneJson, input.setTypeCAIExecutiveInsight, input.typeCExecutiveInsightContextRef]);

  const handleEnhanceTypeCExecutiveSummary = useCallback(async (): Promise<void> => {
    const insight = enhanceTypeCExecutiveSummary();
    if (!insight) {
      throw new Error("type_c_ai_insight_unavailable");
    }
  }, [enhanceTypeCExecutiveSummary]);

  const handleGenerateTypeCAIInsight = useCallback(async () => {
    if (!input.canGenerateTypeCAIInsight || resolvedState.ai.typeCAIInsightLoading) return;
    input.setTypeCAIInsightLoading(true);
    input.setTypeCAIInsightError(null);
    try {
      const insight = await requestTypeCAIInsightApi(input.typeCAIInsightRequest);
      input.setTypeCAIInsight(insight);
      globalThis.console.info("[Nexora][TypeC][AIInsightGenerated]", {
        confidence: insight.confidence,
      });
    } catch {
      input.setTypeCAIInsightError("AI insight failed. Deterministic guidance is still available.");
    } finally {
      input.setTypeCAIInsightLoading(false);
    }
  }, [
    input.canGenerateTypeCAIInsight,
    input.setTypeCAIInsight,
    input.setTypeCAIInsightError,
    input.setTypeCAIInsightLoading,
    input.typeCAIInsightRequest,
    resolvedState.ai.typeCAIInsightLoading,
  ]);

  const handleCloseTypeCAIInsight = useCallback(() => {
    input.setTypeCAIInsight(null);
    input.setTypeCAIInsightError(null);
  }, [input.setTypeCAIInsight, input.setTypeCAIInsightError]);

  const handleRunTypeCMultiAgent = useCallback(async () => {
    if (!input.canRunTypeCMultiAgent || resolvedState.multiAgent.typeCMultiAgentLoading) return;
    input.setTypeCMultiAgentLoading(true);
    input.setTypeCMultiAgentError(null);
    try {
      const insight = await requestTypeCMultiAgentInsightApi(input.typeCMultiAgentRequest);
      input.setTypeCMultiAgentInsight(insight);
      globalThis.console.info("[Nexora][TypeC][MultiAgentInsightGenerated]", {
        agents: insight.agentResponses.length,
        confidence: insight.synthesis.confidence,
      });
    } catch {
      input.setTypeCMultiAgentError("Strategic intelligence failed. Deterministic guidance is still available.");
    } finally {
      input.setTypeCMultiAgentLoading(false);
    }
  }, [
    input.canRunTypeCMultiAgent,
    input.setTypeCMultiAgentError,
    input.setTypeCMultiAgentInsight,
    input.setTypeCMultiAgentLoading,
    input.typeCMultiAgentRequest,
    resolvedState.multiAgent.typeCMultiAgentLoading,
  ]);

  const handleCloseTypeCMultiAgent = useCallback(() => {
    input.setTypeCMultiAgentInsight(null);
    input.setTypeCMultiAgentError(null);
  }, [input.setTypeCMultiAgentError, input.setTypeCMultiAgentInsight]);

  const handleRunTypeCSandbox = useCallback(async () => {
    if (!input.typeCSandboxRequest || resolvedState.sandbox.typeCSandboxLoading) return;
    input.setTypeCSandboxLoading(true);
    input.setTypeCSandboxError(null);
    try {
      const result = await requestTypeCSandboxResultApi(input.typeCSandboxRequest);
      input.setTypeCSandboxResult(result);
      globalThis.console.info("[Nexora][TypeC][SandboxRunComplete]", {
        strategies: result.strategies.length,
        bestStrategyId: result.bestStrategyId ?? null,
      });
    } catch {
      input.setTypeCSandboxError("Autonomous sandbox failed. No real system state was changed.");
    } finally {
      input.setTypeCSandboxLoading(false);
    }
  }, [
    input.setTypeCSandboxError,
    input.setTypeCSandboxLoading,
    input.setTypeCSandboxResult,
    input.typeCSandboxRequest,
    resolvedState.sandbox.typeCSandboxLoading,
  ]);

  const handleCloseTypeCSandbox = useCallback(() => {
    input.setTypeCSandboxResult(null);
    input.setTypeCSandboxError(null);
  }, [input.setTypeCSandboxError, input.setTypeCSandboxResult]);

  const handleReviewTypeCSandboxStrategy = useCallback((strategy: TypeCSandboxStrategy) => {
    globalThis.console.debug("[Nexora][TypeC][SandboxStrategyReview]", {
      strategyId: strategy.id,
      title: strategy.title,
    });
  }, []);

  const handleCompareTypeCSandboxStrategy = useCallback((strategy: TypeCSandboxStrategy) => {
    globalThis.console.debug("[Nexora][TypeC][SandboxStrategyCompare]", {
      strategyId: strategy.id,
      title: strategy.title,
    });
  }, []);

  const handlePromoteTypeCSandboxStrategy = useCallback((strategy: TypeCSandboxStrategy) => {
    globalThis.console.debug("[Nexora][TypeC][SandboxStrategyPromotedToReviewQueue]", {
      strategyId: strategy.id,
      title: strategy.title,
      advisoryOnly: true,
    });
  }, []);

  const cancelTypeCConnectionSuggestions = useCallback(() => {
    input.setConnectionSuggestions(null);
  }, [input.setConnectionSuggestions]);

  const cancelTypeCScenarioDrafts = useCallback(() => {
    input.setScenarioDrafts(null);
  }, [input.setScenarioDrafts]);

  const applyTypeCConnectionSuggestions = useCallback(
    (suggestions: TypeCConnectionSuggestion[]) => {
      if (!suggestions.length) {
        input.setConnectionSuggestions(null);
        return;
      }

      const applyScene = input.applyTypeCSceneUpdateRef.current;
      if (!applyScene) return;

      applyScene(
        (prev) => {
          if (!prev) return prev;
          const next = applyTypeCConnectionSuggestionsToScene(prev, suggestions);
          if (next !== prev) {
            const drafts = buildTypeCScenarioDrafts({
              sceneJson: next,
              newConnections: suggestions,
            });
            globalThis.queueMicrotask(() => {
              input.setScenarioDrafts(drafts.length ? drafts : null);
            });
          }
          return next;
        },
        "type_c_connection_suggestions_apply",
        { bypassDedupe: true }
      );

      input.setConnectionSuggestions(null);
    },
    [input.applyTypeCSceneUpdateRef, input.setConnectionSuggestions, input.setScenarioDrafts]
  );

  const openTypeCScenarioDraftWarRoom = useCallback(
    (draft: TypeCScenarioDraft) => {
      if (!draft) return;
      if (!input.sceneJson) return;
      const simulation = simulateTypeCScenario({
        scenario: draft,
        sceneJson: input.sceneJson,
      });
      globalThis.console.info("[Nexora][TypeC][ScenarioDraftOpenWarRoom]", {
        scenarioId: draft.id,
        title: draft.title,
        riskLevel: simulation.riskLevel,
      });
      input.setActiveTypeCScenario(draft);
      input.setActiveSimulation(simulation);
      const openSim = input.openTypeCSimPanelRef.current;
      if (openSim) {
        openSim("war_room", "type_c_scenario_draft_open_war_room", draft.id);
      }
      input.setScenarioDrafts(null);
    },
    [
      input.openTypeCSimPanelRef,
      input.sceneJson,
      input.setActiveSimulation,
      input.setActiveTypeCScenario,
      input.setScenarioDrafts,
    ]
  );

  const compareTypeCScenarioDrafts = useCallback(
    (drafts: TypeCScenarioDraft[]) => {
      const sceneJson = input.sceneJson;
      if (!sceneJson || drafts.length < 2) return;
      const simulations = drafts.map((draft) =>
        simulateTypeCScenario({
          scenario: draft,
          sceneJson,
        })
      );
      const comparison = compareTypeCScenarioSimulations({
        scenarios: drafts,
        simulations,
      });
      const recommendation = buildTypeCDecisionRecommendation({ comparison });
      input.setScenarioComparison(comparison);
      input.setScenarioComparisonDrafts(drafts);
      input.setDecisionRecommendation(recommendation);
      globalThis.console.info("[Nexora][TypeC][ScenarioComparisonCreated]", {
        scenarioIds: comparison.scenarioIds,
        bestOptionId: comparison.bestOptionId,
        highestRiskScenarioId: comparison.highestRiskScenarioId,
        recommendedScenarioId: recommendation.recommendedScenarioId,
      });
    },
    [
      input.sceneJson,
      input.setDecisionRecommendation,
      input.setScenarioComparison,
      input.setScenarioComparisonDrafts,
    ]
  );

  const closeTypeCScenarioCompare = useCallback(() => {
    input.setScenarioComparison(null);
    input.setScenarioComparisonDrafts(null);
    input.setDecisionRecommendation(null);
  }, [input.setDecisionRecommendation, input.setScenarioComparison, input.setScenarioComparisonDrafts]);

  const openBestTypeCScenarioInWarRoom = useCallback(() => {
    if (!resolvedState.simulation.scenarioComparison?.bestOptionId) return;
    const draft = resolvedState.simulation.scenarioComparisonDrafts?.find(
      (candidate) => candidate.id === resolvedState.simulation.scenarioComparison?.bestOptionId
    );
    if (!draft) return;
    input.setScenarioComparison(null);
    input.setScenarioComparisonDrafts(null);
    input.setDecisionRecommendation(null);
    openTypeCScenarioDraftWarRoom(draft);
  }, [
    input.setDecisionRecommendation,
    input.setScenarioComparison,
    input.setScenarioComparisonDrafts,
    openTypeCScenarioDraftWarRoom,
    resolvedState.simulation.scenarioComparison,
    resolvedState.simulation.scenarioComparisonDrafts,
  ]);

  const exitTypeCScenarioSimulation = useCallback(() => {
    input.setActiveSimulation(clearTypeCScenarioSimulation());
    input.setActiveTypeCScenario(null);
    globalThis.console.info("[Nexora][TypeC][ScenarioSimulationExited]");
  }, [input.setActiveSimulation, input.setActiveTypeCScenario]);

  const handleStartTypeCExecution = useCallback(() => {
    const scenarioId = resolvedState.simulation.decisionRecommendation?.recommendedScenarioId;
    if (!scenarioId || !input.sceneJson) return;
    const draft = resolvedState.simulation.scenarioComparisonDrafts?.find((candidate) => candidate.id === scenarioId);
    if (!draft) return;
    const simulation = simulateTypeCScenario({
      scenario: draft,
      sceneJson: input.sceneJson,
    });
    const nextExecution = startTypeCExecution({
      scenario: draft,
      simulation,
    });
    input.setExecutionScenario(draft);
    input.setExecutionState(nextExecution);
    input.setTypeCAlerts(clearTypeCAlerts());
    input.setActiveTypeCScenario(draft);
    input.setActiveSimulation(simulation);
    globalThis.console.info("[Nexora][TypeC][ExecutionStarted]", {
      scenarioId: draft.id,
      riskLevel: nextExecution.riskLevel,
      monitoredSignals: nextExecution.monitoredSignals.length,
    });
  }, [
    input.sceneJson,
    input.setActiveSimulation,
    input.setActiveTypeCScenario,
    input.setExecutionScenario,
    input.setExecutionState,
    input.setTypeCAlerts,
    resolvedState.simulation.decisionRecommendation,
    resolvedState.simulation.scenarioComparisonDrafts,
  ]);

  const handlePauseTypeCExecution = useCallback(() => {
    input.setExecutionState((prev) => pauseTypeCExecution(prev));
    globalThis.console.info("[Nexora][TypeC][ExecutionPaused]");
  }, [input.setExecutionState]);

  const handleStopTypeCExecution = useCallback(() => {
    const executionState = resolvedState.execution.executionState;
    const memoryEntry = executionState
      ? buildTypeCMemoryEntry({
          executionState,
          decisionRecommendation: resolvedState.simulation.decisionRecommendation,
        })
      : null;
    if (memoryEntry) {
      input.setTypeCMemoryState((prev) => addTypeCMemoryEntry(prev, memoryEntry));
      globalThis.console.info("[Nexora][TypeC][MemoryEntryAdded]", {
        scenarioId: memoryEntry.scenarioId,
        outcome: memoryEntry.outcome,
        riskLevel: memoryEntry.riskLevel,
      });
    }
    input.setExecutionState(stopTypeCExecution());
    input.setExecutionScenario(null);
    input.setTypeCAlerts(clearTypeCAlerts());
    input.setActiveSimulation(clearTypeCScenarioSimulation());
    input.setActiveTypeCScenario(null);
    globalThis.console.info("[Nexora][TypeC][ExecutionStopped]");
  }, [
    input.setActiveSimulation,
    input.setActiveTypeCScenario,
    input.setExecutionScenario,
    input.setExecutionState,
    input.setTypeCAlerts,
    input.setTypeCMemoryState,
    resolvedState.execution.executionState,
    resolvedState.simulation.decisionRecommendation,
  ]);

  const handleAcknowledgeTypeCAlert = useCallback(
    (alertId: string) => {
      input.setTypeCAlerts((prev) => acknowledgeTypeCAlert(prev, alertId));
      globalThis.console.info("[Nexora][TypeC][AlertAcknowledged]", { alertId });
    },
    [input.setTypeCAlerts]
  );

  const handleClearTypeCAlerts = useCallback(() => {
    input.setTypeCAlerts(clearTypeCAlerts());
    globalThis.console.info("[Nexora][TypeC][AlertsCleared]");
  }, [input.setTypeCAlerts]);

  const handleClearTypeCMemory = useCallback(() => {
    input.setTypeCMemoryState(clearTypeCMemory());
    globalThis.console.info("[Nexora][TypeC][MemoryCleared]");
  }, [input.setTypeCMemoryState]);

  useEffect(() => {
    const executionState = resolvedState.execution.executionState;
    if (
      !executionState ||
      (executionState.status !== "running" && executionState.status !== "paused")
    ) {
      return undefined;
    }

    const refreshAlerts = () => {
      const nextAlerts = buildTypeCAlerts({ executionState });
      input.setTypeCAlerts((prev) => mergeTypeCAlerts(prev, nextAlerts));
    };

    refreshAlerts();
    const id = window.setInterval(refreshAlerts, 4_000);
    return () => window.clearInterval(id);
  }, [input.setTypeCAlerts, resolvedState.execution.executionState]);

  const callbacks = useMemo<TypeCOrchestrationCallbacks>(
    () => ({
      trackTypeCPipelineEvent,
      refreshTypeCDecisionReadiness,
      createTypeCDecisionDraft,
      createTypeCExecutiveSummary,
      createTypeCScenarioDraft,
      applyTypeCScenarioStatusIntent,
      enhanceTypeCExecutiveSummary,
      handleEnhanceTypeCExecutiveSummary,
      handleGenerateTypeCAIInsight,
      handleCloseTypeCAIInsight,
      handleRunTypeCMultiAgent,
      handleCloseTypeCMultiAgent,
      handleRunTypeCSandbox,
      handleCloseTypeCSandbox,
      handleReviewTypeCSandboxStrategy,
      handleCompareTypeCSandboxStrategy,
      handlePromoteTypeCSandboxStrategy,
      cancelTypeCConnectionSuggestions,
      cancelTypeCScenarioDrafts,
      applyTypeCConnectionSuggestions,
      openTypeCScenarioDraftWarRoom,
      compareTypeCScenarioDrafts,
      closeTypeCScenarioCompare,
      openBestTypeCScenarioInWarRoom,
      exitTypeCScenarioSimulation,
      handleStartTypeCExecution,
      handlePauseTypeCExecution,
      handleStopTypeCExecution,
      handleAcknowledgeTypeCAlert,
      handleClearTypeCAlerts,
      handleClearTypeCMemory,
    }),
    [
      applyTypeCConnectionSuggestions,
      applyTypeCScenarioStatusIntent,
      cancelTypeCConnectionSuggestions,
      cancelTypeCScenarioDrafts,
      closeTypeCScenarioCompare,
      compareTypeCScenarioDrafts,
      createTypeCDecisionDraft,
      createTypeCExecutiveSummary,
      createTypeCScenarioDraft,
      enhanceTypeCExecutiveSummary,
      exitTypeCScenarioSimulation,
      handleAcknowledgeTypeCAlert,
      handleClearTypeCAlerts,
      handleCloseTypeCAIInsight,
      handleClearTypeCMemory,
      handleCloseTypeCMultiAgent,
      handleCloseTypeCSandbox,
      handleCompareTypeCSandboxStrategy,
      handleEnhanceTypeCExecutiveSummary,
      handleGenerateTypeCAIInsight,
      handlePauseTypeCExecution,
      handlePromoteTypeCSandboxStrategy,
      handleReviewTypeCSandboxStrategy,
      handleRunTypeCMultiAgent,
      handleRunTypeCSandbox,
      handleStartTypeCExecution,
      handleStopTypeCExecution,
      openBestTypeCScenarioInWarRoom,
      openTypeCScenarioDraftWarRoom,
      refreshTypeCDecisionReadiness,
      trackTypeCPipelineEvent,
    ]
  );

  return useMemo(
    (): UseTypeCOrchestrationResult => ({
      state: resolvedState,
      refs: resolvedRefs,
      callbacks,
      enabled: input.enabled,
      mode: input.mode,
      extractionPlan: TYPE_C_ORCHESTRATION_EXTRACTION_PLAN,
    }),
    [callbacks, input.enabled, input.mode, resolvedRefs, resolvedState]
  );
}
