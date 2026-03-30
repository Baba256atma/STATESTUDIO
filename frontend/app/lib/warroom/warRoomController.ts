"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { requestComparison } from "../compare/compareClient";
import type { CompareResult } from "../compare/compareTypes";
import {
  requestEvolutionState,
  requestRecentMemory,
  runEvolutionPass,
  saveMemoryRecord,
  updateObservedOutcome,
} from "../evolution/evolutionClient";
import type { EvolutionState, RecentMemoryState } from "../evolution/evolutionTypes";
import { requestSystemIntelligence } from "../intelligence/systemIntelligenceClient";
import type { SystemIntelligenceResult } from "../intelligence/systemIntelligenceTypes";
import { requestScenarioAction } from "../simulation/scenarioActionClient";
import { requestStrategyGeneration } from "../strategy-generation/strategyGenerationClient";
import type { StrategyGenerationResult } from "../strategy-generation/strategyGenerationTypes";
import { buildScenarioFromAction, buildScenarioFromChatPayload, buildScenarioFromDraft, buildScenarioFromScanner } from "./scenarioComposer";
import { createRendererBridge } from "./rendererBridge";
import { useScenarioComposer } from "./useScenarioComposer";
import type { ScenarioActionContract } from "../simulation/scenarioActionTypes";
import type {
  DecisionPathState,
  PropagationState,
  Scenario,
  WarRoomController,
  WarRoomOverlayDetail,
  WarRoomMode,
  WarRoomOverlaySummary,
  WarRoomRunResult,
  WarRoomState,
} from "./warRoomTypes";
import type { SceneJson } from "../sceneTypes";

type UseWarRoomControllerParams = {
  selectedObjectId?: string | null;
  sceneJson?: SceneJson | null;
  responseData?: unknown;
};

function normalizeId(value: string | null | undefined): string | null {
  const next = String(value ?? "").trim();
  return next.length > 0 ? next : null;
}

function upsertScenarioMap(current: Record<string, Scenario>, scenario: Scenario | null): Record<string, Scenario> {
  if (!scenario) return current;
  return {
    ...current,
    [scenario.id]: scenario,
  };
}

function resolveModeFromScenario(scenario: Scenario | null): WarRoomMode {
  if (!scenario) return "idle";
  if (scenario.outputMode === "decision_path") return "decision";
  if (scenario.outputMode === "mixed") return "simulation";
  return scenario.origin === "scanner" ? "analysis" : "simulation";
}

function buildPendingPropagationState(scenario: Scenario): PropagationState | null {
  if (scenario.outputMode === "decision_path") return null;
  return {
    scenarioId: scenario.id,
    request: {
      sourceId: scenario.trigger.targetId,
      intensity: scenario.trigger.intensity,
      depth: scenario.propagationConfig.depth,
      decay: scenario.propagationConfig.decay,
      model: scenario.propagationConfig.spreadModel,
    },
    status: "pending",
    resultMode: "idle",
    nodeCount: 0,
    edgeCount: 0,
  };
}

function buildPendingDecisionState(scenario: Scenario): DecisionPathState | null {
  if (scenario.outputMode === "propagation") return null;
  return {
    scenarioId: scenario.id,
    request: {
      sourceId: scenario.trigger.targetId,
      objective: scenario.decisionConfig.objective,
      constraints: scenario.decisionConfig.constraints,
      horizon: scenario.decisionConfig.horizon,
    },
    status: "pending",
    resultMode: "idle",
    nodeCount: 0,
    edgeCount: 0,
  };
}

function mapGeneratedActionToWarRoomActionKind(actionKind: string): Scenario["trigger"]["type"] {
  if (actionKind === "stress_reduce") return "stabilize";
  if (actionKind === "strategy_apply") return "optimize";
  if (actionKind === "decision_path_request") return "optimize";
  if (actionKind === "propagation_request") return "redistribute";
  return "stress";
}

function mapRequestedOutputsToOutputMode(outputs: string[] | undefined): Scenario["outputMode"] {
  const requested = Array.isArray(outputs) ? outputs : [];
  if (requested.includes("propagation") && requested.includes("decision_path")) return "mixed";
  if (requested.includes("decision_path")) return "decision_path";
  return "propagation";
}

export function useWarRoomController(params: UseWarRoomControllerParams): WarRoomController {
  const selectedObjectId = normalizeId(params.selectedObjectId);
  const composer = useScenarioComposer(selectedObjectId);
  const {
    draft,
    updateDraft,
    setSelectedObject,
    setActionKind,
    setOutputMode,
    setTargets,
    clearDraft,
    canRun,
  } = composer;
  const [active, setActive] = useState(false);
  const [viewMode, setViewMode] = useState<"idle" | "compose" | "result" | "compare">("idle");
  const [state, setState] = useState<WarRoomState>({
    activeScenarioId: null,
    scenarios: {},
    activePropagation: null,
    activeDecisionPath: null,
    focusTargetId: selectedObjectId,
    mode: "idle",
    compare: {
      active: false,
      scenarioAId: null,
      scenarioBId: null,
      comparisonResult: null,
      focusDimension: "balanced",
      mode: "summary",
    },
    strategyGeneration: {
      active: false,
      result: null,
      selectedStrategyId: null,
      loading: false,
      error: null,
      mode: "explore",
      preferredFocus: "risk",
    },
  });
  const [scenarioTrigger, setScenarioTrigger] = useState<ScenarioActionContract | null>(null);
  const [overlaySummary, setOverlaySummary] = useState<WarRoomOverlaySummary | null>(null);
  const [overlayDetail, setOverlayDetail] = useState<WarRoomOverlayDetail | null>(null);
  const [intelligence, setIntelligence] = useState<SystemIntelligenceResult | null>(null);
  const [intelligenceLoading, setIntelligenceLoading] = useState(false);
  const [intelligenceError, setIntelligenceError] = useState<string | null>(null);
  const [intelligenceByScenarioId, setIntelligenceByScenarioId] = useState<Record<string, SystemIntelligenceResult>>({});
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [recentMemory, setRecentMemory] = useState<RecentMemoryState>({
    scenario_records: [],
    strategy_records: [],
    comparison_records: [],
  });
  const [evolutionState, setEvolutionState] = useState<EvolutionState | null>(null);
  const [evolutionLoading, setEvolutionLoading] = useState(false);
  const [lastActionId, setLastActionId] = useState<string | null>(null);
  const [lastRunAt, setLastRunAt] = useState<number | null>(null);
  const lastPrefilledIdRef = useRef<string | null>(selectedObjectId);
  const savedScenarioRecordIdsRef = useRef<Set<string>>(new Set());
  const savedComparisonRecordIdsRef = useRef<Set<string>>(new Set());
  const savedStrategyRecordIdsRef = useRef<Set<string>>(new Set());

  const rendererBridge = useMemo(
    () =>
      createRendererBridge({
        setPropagationState: (next) =>
          setState((current) => ({
            ...current,
            activePropagation: next,
          })),
        setDecisionPathState: (next) =>
          setState((current) => ({
            ...current,
            activeDecisionPath: next,
          })),
        setFocusTarget: (targetId) =>
          setState((current) => ({
            ...current,
            focusTargetId: normalizeId(targetId),
          })),
      }),
    []
  );

  useEffect(() => {
    if (!selectedObjectId) return;
    const currentDraftId = normalizeId(draft.selectedObjectId);
    const shouldPrefill =
      !currentDraftId ||
      currentDraftId === lastPrefilledIdRef.current ||
      (!scenarioTrigger && draft.actionKind === null);
    if (shouldPrefill) {
      setSelectedObject(selectedObjectId);
      lastPrefilledIdRef.current = selectedObjectId;
    }
    rendererBridge.setFocusTarget(selectedObjectId);
  }, [draft.actionKind, draft.selectedObjectId, rendererBridge, scenarioTrigger, selectedObjectId, setSelectedObject]);

  const chatScenario = useMemo(
    () => buildScenarioFromChatPayload({ payload: params.responseData, selectedObjectId }),
    [params.responseData, selectedObjectId]
  );
  const scannerScenario = useMemo(
    () => buildScenarioFromScanner({ sceneJson: params.sceneJson ?? null, payload: params.responseData }),
    [params.responseData, params.sceneJson]
  );
  const draftScenario = useMemo(() => buildScenarioFromDraft(draft), [draft]);

  useEffect(() => {
    setState((current) => {
      let nextScenarios = { ...current.scenarios };
      nextScenarios = upsertScenarioMap(nextScenarios, chatScenario);
      nextScenarios = upsertScenarioMap(nextScenarios, scannerScenario);
      nextScenarios = upsertScenarioMap(nextScenarios, draftScenario);
      return {
        ...current,
        scenarios: nextScenarios,
      };
    });
  }, [chatScenario, draftScenario, scannerScenario]);

  const availableScenarios = useMemo(() => {
    return Object.values(state.scenarios).sort((a, b) => b.createdAt - a.createdAt);
  }, [state.scenarios]);

  const openWarRoom = useCallback(() => {
    setActive(true);
    setViewMode((current) => (current === "idle" ? "compose" : current));
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][WarRoom] opened");
    }
  }, []);

  const refreshEvolution = useCallback(async () => {
    setEvolutionLoading(true);
    const [memory, evolution] = await Promise.all([requestRecentMemory(12), requestEvolutionState()]);
    setRecentMemory(memory);
    setEvolutionState(evolution);
    setEvolutionLoading(false);
  }, []);

  const closeWarRoom = useCallback(() => {
    setActive(false);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][WarRoom] closed");
    }
  }, []);

  const switchMode = useCallback((mode: WarRoomMode) => {
    setState((current) => ({ ...current, mode }));
  }, []);

  const updateFocus = useCallback(
    (targetId: string | null) => {
      rendererBridge.setFocusTarget(targetId);
    },
    [rendererBridge]
  );

  const runScenario = useCallback(
    (scenarioId?: string | null): WarRoomRunResult | null => {
      const resolvedId =
        normalizeId(scenarioId) ??
        state.activeScenarioId ??
        draftScenario?.id ??
        scannerScenario?.id ??
        chatScenario?.id ??
        null;
      const scenario =
        (resolvedId ? state.scenarios[resolvedId] ?? null : null) ??
        (draftScenario && draftScenario.id === resolvedId ? draftScenario : null) ??
        (scannerScenario && scannerScenario.id === resolvedId ? scannerScenario : null) ??
        (chatScenario && chatScenario.id === resolvedId ? chatScenario : null);
      if (!scenario) return null;

      const nextPropagation = buildPendingPropagationState(scenario);
      const nextDecision = buildPendingDecisionState(scenario);
      rendererBridge.setPropagationState(nextPropagation);
      rendererBridge.setDecisionPathState(nextDecision);
      rendererBridge.setFocusTarget(scenario.trigger.targetId);
      setScenarioTrigger(scenario.contract);
      setLastActionId(scenario.contract.intent.action_id);
      const ranAt = Date.now();
      setLastRunAt(ranAt);
      setOverlaySummary(null);
      setActive(true);
      setViewMode("result");
      setState((current) => ({
        ...current,
        scenarios: upsertScenarioMap(current.scenarios, scenario),
        activeScenarioId: scenario.id,
        focusTargetId: scenario.trigger.targetId,
        mode: resolveModeFromScenario(scenario),
      }));
      if (process.env.NODE_ENV !== "production") {
        console.debug("[Nexora][WarRoom] run requested", {
          scenarioId: scenario.id,
          sourceId: scenario.trigger.targetId,
          mode: scenario.outputMode,
        });
      }
      return { scenario, ranAt };
    },
    [chatScenario?.id, draftScenario, rendererBridge, scannerScenario?.id, state.activeScenarioId, state.scenarios]
  );

  const refreshScenario = useCallback(() => runScenario(), [runScenario]);

  const stopScenario = useCallback(() => {
    rendererBridge.setPropagationState(null);
    rendererBridge.setDecisionPathState(null);
    setScenarioTrigger(null);
    setOverlaySummary(null);
    setState((current) => ({
      ...current,
      activeScenarioId: null,
      activePropagation: null,
      activeDecisionPath: null,
      mode: "idle",
      compare: {
        ...current.compare,
        active: false,
        comparisonResult: null,
      },
      strategyGeneration: {
        ...current.strategyGeneration,
        active: false,
        result: null,
        selectedStrategyId: null,
        loading: false,
        error: null,
      },
    }));
  }, [rendererBridge]);

  const clearScenario = useCallback(() => {
    stopScenario();
    setLastActionId(null);
    setLastRunAt(null);
    clearDraft(selectedObjectId);
    setViewMode(active ? "compose" : "idle");
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][WarRoom] cleared");
    }
  }, [active, clearDraft, selectedObjectId, stopScenario]);

  const setCompareScenarioA = useCallback((scenarioId: string | null) => {
    setState((current) => ({
      ...current,
      compare: {
        ...current.compare,
        scenarioAId: normalizeId(scenarioId),
      },
    }));
  }, []);

  const setCompareScenarioB = useCallback((scenarioId: string | null) => {
    setState((current) => ({
      ...current,
      compare: {
        ...current.compare,
        scenarioBId: normalizeId(scenarioId),
      },
    }));
  }, []);

  const setCompareFocusDimension = useCallback((dimension: WarRoomState["compare"]["focusDimension"]) => {
    setState((current) => ({
      ...current,
      compare: {
        ...current.compare,
        focusDimension: dimension,
      },
    }));
  }, []);

  const setCompareViewMode = useCallback((mode: WarRoomState["compare"]["mode"]) => {
    setViewMode("compare");
    setState((current) => ({
      ...current,
      compare: {
        ...current.compare,
        mode,
      },
    }));
  }, []);

  const clearCompare = useCallback(() => {
    setComparisonError(null);
    setComparisonLoading(false);
    setViewMode((current) => (current === "compare" ? "result" : current));
    setState((current) => ({
      ...current,
      compare: {
        ...current.compare,
        active: false,
        comparisonResult: null,
      },
    }));
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][WarRoom] compare cleared");
    }
  }, []);

  const setStrategyGenerationMode = useCallback((mode: WarRoomState["strategyGeneration"]["mode"]) => {
    setState((current) => ({
      ...current,
      strategyGeneration: {
        ...current.strategyGeneration,
        mode,
      },
    }));
  }, []);

  const setStrategyPreferredFocus = useCallback((focus: WarRoomState["strategyGeneration"]["preferredFocus"]) => {
    setState((current) => ({
      ...current,
      strategyGeneration: {
        ...current.strategyGeneration,
        preferredFocus: focus,
      },
    }));
  }, []);

  const clearStrategies = useCallback(() => {
    setState((current) => ({
      ...current,
      strategyGeneration: {
        ...current.strategyGeneration,
        active: false,
        result: null,
        selectedStrategyId: null,
        loading: false,
        error: null,
      },
    }));
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][WarRoom] strategies cleared");
    }
  }, []);

  const selectGeneratedStrategy = useCallback((strategyId: string | null) => {
    setState((current) => ({
      ...current,
      strategyGeneration: {
        ...current.strategyGeneration,
        selectedStrategyId: normalizeId(strategyId),
      },
    }));
  }, []);

  const applyOverlaySummary = useCallback(
    (summary: WarRoomOverlaySummary | null, detail?: WarRoomOverlayDetail | null) => {
      setOverlaySummary(summary);
      setOverlayDetail(detail ?? null);
      if (summary === null) {
        if (scenarioTrigger) {
          setScenarioTrigger(null);
          setIntelligence(null);
          setIntelligenceError(null);
          setState((current) => ({
            ...current,
            activeScenarioId: null,
            activePropagation: null,
            activeDecisionPath: null,
            mode: "idle",
          }));
          if (process.env.NODE_ENV !== "production") {
            console.debug("[Nexora][WarRoom] stale action invalidated", {
              actionId: scenarioTrigger.intent.action_id,
            });
          }
        }
        return;
      }

      setState((current) => ({
        ...current,
        activePropagation: current.activePropagation
          ? {
              ...current.activePropagation,
              status: summary.propagationNodeCount > 0 || summary.loading ? "active" : current.activePropagation.status,
              resultMode:
                summary.propagationNodeCount > 0
                  ? summary.resultMode
                  : current.activePropagation.resultMode,
              nodeCount: summary.propagationNodeCount,
              edgeCount: summary.propagationEdgeCount,
            }
          : null,
        activeDecisionPath: current.activeDecisionPath
          ? {
              ...current.activeDecisionPath,
              status: summary.decisionNodeCount > 0 || summary.loading ? "active" : current.activeDecisionPath.status,
              resultMode:
                summary.decisionNodeCount > 0
                  ? summary.resultMode
                  : current.activeDecisionPath.resultMode,
              nodeCount: summary.decisionNodeCount,
              edgeCount: summary.decisionEdgeCount,
            }
          : null,
      }));
    },
    [scenarioTrigger]
  );

  useEffect(() => {
    const activeScenario =
      state.activeScenarioId && state.scenarios[state.activeScenarioId]
        ? state.scenarios[state.activeScenarioId]
        : null;
    if (!activeScenario || !scenarioTrigger) {
      setIntelligence(null);
      setIntelligenceLoading(false);
      setIntelligenceError(null);
      return;
    }

    let cancelled = false;
    setIntelligenceLoading(true);
    setIntelligenceError(null);

    void requestSystemIntelligence({
      scenario_action: scenarioTrigger,
      propagation: overlayDetail?.propagation ?? null,
      decision_path: overlayDetail?.decisionPath ?? null,
      scanner_summary: params.responseData && typeof params.responseData === "object"
        ? ((params.responseData as any).fragility_scan ?? null)
        : null,
      scene_json: (params.sceneJson as Record<string, unknown> | null) ?? null,
      current_focus_object_id: state.focusTargetId,
      mode: state.mode === "idle" ? "analysis" : state.mode,
    }).then((result) => {
      if (cancelled) return;
      setIntelligence(result);
      if (result && activeScenario) {
        setIntelligenceByScenarioId((current) => ({
          ...current,
          [activeScenario.id]: result,
        }));
      }
      setIntelligenceLoading(false);
      setIntelligenceError(result ? null : "System intelligence is unavailable for the current context.");
    }).catch((error) => {
      if (cancelled) return;
      setIntelligence(null);
      setIntelligenceLoading(false);
      setIntelligenceError(error instanceof Error ? error.message : "System intelligence failed.");
    });

    return () => {
      cancelled = true;
    };
  }, [
    overlaySummary,
    overlayDetail,
    params.responseData,
    params.sceneJson,
    scenarioTrigger,
    state.activeDecisionPath,
    state.activePropagation,
    state.activeScenarioId,
    state.focusTargetId,
    state.mode,
    state.scenarios,
  ]);

  const ensureScenarioIntelligence = useCallback(
    async (scenario: Scenario): Promise<SystemIntelligenceResult | null> => {
      const cached = intelligenceByScenarioId[scenario.id];
      if (cached) return cached;
      if (state.activeScenarioId === scenario.id && intelligence) return intelligence;

      const scenarioPayload = await requestScenarioAction({
        contract: scenario.contract,
        sceneJson: params.sceneJson ?? null,
        loops: params.sceneJson?.scene?.loops ?? null,
        maxDepth: scenario.propagationConfig.depth,
        decay: scenario.propagationConfig.decay,
      });
      if (!scenarioPayload) return null;

      const result = await requestSystemIntelligence({
        scenario_action: scenario.contract,
        propagation: scenarioPayload.propagation ?? null,
        decision_path: scenarioPayload.decisionPath ?? null,
        scanner_summary:
          params.responseData && typeof params.responseData === "object"
            ? ((params.responseData as any).fragility_scan ?? null)
            : null,
        scene_json: (params.sceneJson as Record<string, unknown> | null) ?? null,
        current_focus_object_id: scenario.trigger.targetId,
        mode:
          scenario.outputMode === "decision_path"
            ? "decision"
            : scenario.outputMode === "mixed"
            ? "simulation"
            : scenario.origin === "scanner"
            ? "analysis"
            : "simulation",
      });
      if (result) {
        setIntelligenceByScenarioId((current) => ({
          ...current,
          [scenario.id]: result,
        }));
      }
      return result;
    },
    [intelligence, intelligenceByScenarioId, params.responseData, params.sceneJson, state.activeScenarioId]
  );

  const runCompare = useCallback(async (): Promise<CompareResult | null> => {
    const scenarioA =
      (state.compare.scenarioAId ? state.scenarios[state.compare.scenarioAId] ?? null : null) ??
      availableScenarios[0] ??
      null;
    const scenarioB =
      (state.compare.scenarioBId ? state.scenarios[state.compare.scenarioBId] ?? null : null) ??
      availableScenarios.find((scenario) => scenario.id !== scenarioA?.id) ??
      null;
    if (!scenarioA || !scenarioB || scenarioA.id === scenarioB.id) {
      setComparisonError("Select two distinct scenarios before running compare mode.");
      return null;
    }

    setComparisonLoading(true);
    setComparisonError(null);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][WarRoom] compare requested", {
        scenarioAId: scenarioA.id,
        scenarioBId: scenarioB.id,
        focusDimension: state.compare.focusDimension,
      });
    }

    const [intelligenceA, intelligenceB] = await Promise.all([
      ensureScenarioIntelligence(scenarioA),
      ensureScenarioIntelligence(scenarioB),
    ]);

    if (!intelligenceA || !intelligenceB) {
      setComparisonLoading(false);
      setComparisonError("Comparison needs intelligence for both scenarios.");
      return null;
    }

    const result = await requestComparison({
      scenarioA: { scenario: scenarioA, intelligence: intelligenceA },
      scenarioB: { scenario: scenarioB, intelligence: intelligenceB },
      focusDimension: state.compare.focusDimension,
    });
    setComparisonLoading(false);
    if (!result) {
      setComparisonError("Compare mode is unavailable for the selected scenarios.");
      return null;
    }
    setState((current) => ({
      ...current,
      compare: {
        ...current.compare,
        active: true,
        scenarioAId: scenarioA.id,
        scenarioBId: scenarioB.id,
        comparisonResult: result,
      },
    }));
    setViewMode("compare");
    setComparisonError(null);
    return result;
  }, [availableScenarios, ensureScenarioIntelligence, state.compare.focusDimension, state.compare.scenarioAId, state.compare.scenarioBId, state.scenarios]);

  const generateStrategies = useCallback(async (): Promise<StrategyGenerationResult | null> => {
    if (!intelligence) {
      setState((current) => ({
        ...current,
        strategyGeneration: {
          ...current.strategyGeneration,
          error: "Run or load a strategic scenario first so Nexora has intelligence to synthesize from.",
        },
      }));
      return null;
    }

    setState((current) => ({
      ...current,
      strategyGeneration: {
        ...current.strategyGeneration,
        loading: true,
        error: null,
      },
    }));

    const activeScenario =
      state.activeScenarioId && state.scenarios[state.activeScenarioId]
        ? state.scenarios[state.activeScenarioId]
        : draftScenario ?? scannerScenario ?? chatScenario ?? null;

    const result = await requestStrategyGeneration({
      intelligence,
      currentScenario: activeScenario
        ? {
            id: activeScenario.id,
            title: activeScenario.title,
            outputMode: activeScenario.outputMode,
            trigger: activeScenario.trigger,
          }
        : null,
      constraints: {
        preferredFocus: state.strategyGeneration.preferredFocus,
        maxStrategies: 4,
        riskTolerance: 0.5,
      },
      mode: state.strategyGeneration.mode,
      scene_json: (params.sceneJson as Record<string, unknown> | null) ?? null,
    });

    setState((current) => ({
      ...current,
      strategyGeneration: {
        ...current.strategyGeneration,
        active: !!result?.strategies.length,
        result,
        selectedStrategyId: result?.recommended_strategy_id ?? result?.strategies[0]?.strategy.strategy_id ?? null,
        loading: false,
        error: result ? null : "Strategy generation is unavailable for the current context.",
      },
    }));
    return result;
  }, [chatScenario, draftScenario, intelligence, params.sceneJson, scannerScenario, state.activeScenarioId, state.scenarios, state.strategyGeneration.mode, state.strategyGeneration.preferredFocus]);

  const runGeneratedStrategy = useCallback((strategyId?: string | null): WarRoomRunResult | null => {
    const result = state.strategyGeneration.result;
    if (!result) return null;
    const selectedId =
      normalizeId(strategyId) ??
      state.strategyGeneration.selectedStrategyId ??
      result.recommended_strategy_id ??
      result.strategies[0]?.strategy.strategy_id ??
      null;
    const evaluated = result.strategies.find((item) => item.strategy.strategy_id === selectedId) ?? null;
    const action = evaluated?.strategy.actions[0] ?? null;
    if (!evaluated || !action?.source_object_id) return null;

    const scenario = buildScenarioFromAction({
      action: {
        type: mapGeneratedActionToWarRoomActionKind(action.action_kind),
        targetId: action.source_object_id,
        intensity: Number(action.parameters?.intensity ?? 0.6),
        context: action.parameters ?? {},
      },
      outputMode: mapRequestedOutputsToOutputMode(action.requested_outputs),
      label: evaluated.strategy.title,
      description: evaluated.strategy.description,
      targetObjectIds: action.target_object_ids,
      parameters: action.parameters ?? {},
      origin: "composer",
      actionId: action.action_id,
      createdAt: action.created_at,
    });

    setState((current) => ({
      ...current,
      scenarios: upsertScenarioMap(current.scenarios, scenario),
      strategyGeneration: {
        ...current.strategyGeneration,
        selectedStrategyId: evaluated.strategy.strategy_id,
      },
    }));
    return runScenario(scenario.id);
  }, [runScenario, state.strategyGeneration.result, state.strategyGeneration.selectedStrategyId]);

  const runEvolutionLearningPass = useCallback(async () => {
    setEvolutionLoading(true);
    const evolution = await runEvolutionPass();
    const memory = await requestRecentMemory(12);
    setEvolutionState(evolution);
    setRecentMemory(memory);
    setEvolutionLoading(false);
  }, []);

  const updateScenarioOutcome = useCallback(async (recordId: string, outcomeStatus: "unknown" | "positive" | "negative" | "mixed") => {
    await updateObservedOutcome({
      recordId,
      outcomeStatus,
    });
    await refreshEvolution();
  }, [refreshEvolution]);

  const session = useMemo(
    () => ({
      active,
      viewMode,
      draft,
      lastActionId,
      lastRunAt,
      source: "war_room" as const,
    }),
    [active, draft, lastActionId, lastRunAt, viewMode]
  );

  useEffect(() => {
    void refreshEvolution();
  }, [refreshEvolution]);

  useEffect(() => {
    const activeScenario =
      state.activeScenarioId && state.scenarios[state.activeScenarioId]
        ? state.scenarios[state.activeScenarioId]
        : null;
    if (!activeScenario || !scenarioTrigger || !intelligence) return;
    const recordId = `scenario:${scenarioTrigger.intent.action_id}`;
    if (savedScenarioRecordIdsRef.current.has(recordId)) return;
    savedScenarioRecordIdsRef.current.add(recordId);
    void saveMemoryRecord({
      scenario_record: {
        record_id: recordId,
        timestamp: Date.now() / 1000,
        scenario_id: activeScenario.id,
        scenario_title: activeScenario.title,
        source_action_ids: [scenarioTrigger.intent.action_id],
        source_object_ids: [scenarioTrigger.intent.source_object_id].filter(Boolean),
        mode: state.mode === "idle" ? "analysis" : state.mode,
        propagation_snapshot: overlayDetail?.propagation ?? null,
        decision_path_snapshot: overlayDetail?.decisionPath ?? null,
        intelligence_snapshot: intelligence,
        selected_strategy_id: state.strategyGeneration.selectedStrategyId,
        predicted_summary: {
          headline: intelligence.summary.headline,
          expected_impact: state.strategyGeneration.result?.strategies[0]?.expected_impact ?? null,
          expected_risk: state.strategyGeneration.result?.strategies[0]?.risk_level ?? null,
        },
        tags: [activeScenario.outputMode],
      },
    }).then(() => refreshEvolution());
  }, [intelligence, overlayDetail, refreshEvolution, scenarioTrigger, state.activeScenarioId, state.mode, state.scenarios, state.strategyGeneration.result, state.strategyGeneration.selectedStrategyId]);

  useEffect(() => {
    const comparison = state.compare.comparisonResult;
    const scenarioAId = state.compare.scenarioAId;
    const scenarioBId = state.compare.scenarioBId;
    if (!comparison || !scenarioAId || !scenarioBId) return;
    const recordId = `comparison:${scenarioAId}:${scenarioBId}:${state.compare.focusDimension}`;
    if (savedComparisonRecordIdsRef.current.has(recordId)) return;
    savedComparisonRecordIdsRef.current.add(recordId);
    const topAdvice = comparison.advice[0] ?? null;
    void saveMemoryRecord({
      comparison_record: {
        record_id: recordId,
        timestamp: Date.now() / 1000,
        scenario_a_id: scenarioAId,
        scenario_b_id: scenarioBId,
        winner: comparison.summary.winner === "A" || comparison.summary.winner === "B" || comparison.summary.winner === "tie" ? comparison.summary.winner : "unknown",
        recommendation: topAdvice?.recommendation ?? null,
        user_choice: "unknown",
        confidence: comparison.summary.confidence,
      },
    }).then(() => refreshEvolution());
  }, [refreshEvolution, state.compare.comparisonResult, state.compare.focusDimension, state.compare.scenarioAId, state.compare.scenarioBId]);

  useEffect(() => {
    const result = state.strategyGeneration.result;
    if (!result?.strategies.length) return;
    const unsaved = result.strategies.filter((item) => !savedStrategyRecordIdsRef.current.has(item.strategy.strategy_id));
    if (!unsaved.length) return;
    unsaved.forEach((item) => savedStrategyRecordIdsRef.current.add(item.strategy.strategy_id));
    void saveMemoryRecord({
      strategy_records: unsaved.map((item) => ({
        record_id: `strategy:${item.strategy.strategy_id}`,
        timestamp: Date.now() / 1000,
        strategy_id: item.strategy.strategy_id,
        title: item.strategy.title,
        rationale: item.strategy.rationale,
        actions: item.strategy.actions,
        predicted_score: item.score,
        chosen: state.strategyGeneration.selectedStrategyId === item.strategy.strategy_id,
        outcome_status: "unknown",
      })),
    }).then(() => refreshEvolution());
  }, [refreshEvolution, state.strategyGeneration.result, state.strategyGeneration.selectedStrategyId]);

  return {
    state,
    session,
    overlaySummary,
    intelligence,
    intelligenceLoading,
    intelligenceError,
    comparison: state.compare.comparisonResult,
    comparisonLoading,
    comparisonError,
    strategyGeneration: state.strategyGeneration.result,
    recentMemory,
    evolutionState,
    evolutionLoading,
    scenarioTrigger,
    canRun,
    availableScenarios,
    openWarRoom,
    closeWarRoom,
    updateDraft,
    setSelectedObject,
    setActionKind,
    setOutputMode,
    setTargets,
    runScenario,
    refreshScenario,
    stopScenario,
    clearScenario,
    setCompareScenarioA,
    setCompareScenarioB,
    setCompareFocusDimension,
    setCompareViewMode,
    runCompare,
    clearCompare,
    setStrategyGenerationMode,
    setStrategyPreferredFocus,
    generateStrategies,
    clearStrategies,
    selectGeneratedStrategy,
    runGeneratedStrategy,
    refreshEvolution,
    runEvolutionLearningPass,
    updateScenarioOutcome,
    updateFocus,
    switchMode,
    applyOverlaySummary,
  };
}
