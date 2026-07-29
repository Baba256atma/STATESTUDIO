import type { SceneJson } from "../sceneTypes";
import type { ActiveModeContext, ModePanelPreference, ModeWorkflowPreference } from "../modes/productModesContract";
import type { KpiImpactSummary } from "../strategy/strategyKpiContract";

export type CockpitSceneSummary = {
  object_count: number;
  relation_count: number;
  loop_count: number;
  highlighted_object_count: number;
  active_loop_id?: string | null;
  scene_health?: "stable" | "watch" | "critical";
};

export type CockpitSelectionSummary = {
  selected_object_id?: string | null;
  selected_label?: string | null;
  highlighted_object_ids: string[];
  focused_mode?: "all" | "selected";
  focus_pinned?: boolean;
};

export type CockpitRiskSummary = {
  summary: string;
  sources: string[];
  affected_dimensions: string[];
  level?: "low" | "moderate" | "high";
};

export type CockpitTimelineSummary = {
  immediate?: string;
  near_term?: string;
  follow_up?: string;
  steps: string[];
  replay_ready: boolean;
};

export type CockpitStrategySummary = {
  summary?: string;
  at_risk_kpis: string[];
  improved_kpis: string[];
  threatened_objectives: string[];
  improved_objectives: string[];
};

export type CockpitComparisonSummary = {
  mode?: string;
  summary?: string;
  baseline_available: boolean;
  comparable: boolean;
  changed_objects_count?: number;
};

export type CockpitAdviceSummary = {
  summary?: string;
  primary_action?: string;
  confidence?: number;
  why?: string;
};

export type CockpitHistorySummary = {
  memory_available: boolean;
  volatile_nodes: string[];
  recurring_loop_ids: string[];
  notes?: string[];
};

export type DecisionCockpitState = {
  mode?: {
    active_mode_id: string;
    role_label: string;
    detail_level: string;
    explanation_depth: string;
    panel_preferences: ModePanelPreference[];
    workflow_preferences: ModeWorkflowPreference[];
  };
  workspace: {
    workspace_id: string;
    project_id: string;
    project_name?: string;
    project_domain?: string;
  };
  scenario: {
    scenario_id?: string;
    scenario_name?: string;
    comparison_mode?: string;
    replay_ready: boolean;
  };
  scene: CockpitSceneSummary;
  selection: CockpitSelectionSummary;
  risk: CockpitRiskSummary;
  timeline: CockpitTimelineSummary;
  strategy: CockpitStrategySummary;
  comparison: CockpitComparisonSummary;
  advice: CockpitAdviceSummary;
  history: CockpitHistorySummary;
  executive: {
    summary?: string;
    happened?: string;
    why_it_matters?: string;
    what_to_do?: string;
    confidence_level?: string;
    confidence_score?: number;
    key_drivers?: string[];
  };
};

function uniq(xs: string[]): string[] {
  return Array.from(new Set((xs ?? []).map((x) => String(x || "").trim()).filter(Boolean)));
}

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function inferRiskLevel(summary: string, confidence?: number): "low" | "moderate" | "high" {
  const s = String(summary || "").toLowerCase();
  const c = clamp01(Number(confidence ?? 0.5));
  if (s.includes("critical") || s.includes("severe") || c >= 0.8) return "high";
  if (s.includes("elevated") || s.includes("pressure") || c >= 0.5) return "moderate";
  return "low";
}

function inferSceneHealth(riskLevel: "low" | "moderate" | "high"): "stable" | "watch" | "critical" {
  if (riskLevel === "high") return "critical";
  if (riskLevel === "moderate") return "watch";
  return "stable";
}

type CockpitSourcePayload = Record<string, unknown>;

type MemoryObjectSnapshot = {
  volatility?: number;
};

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
}

function readNestedRecord(root: Record<string, unknown>, key: string): Record<string, unknown> | null {
  return readRecord(root[key]);
}

function pickTimelineSteps(payload: CockpitSourcePayload): string[] {
  const timeline = readNestedRecord(payload, "timeline_impact");
  if (timeline && Array.isArray(timeline.steps)) {
    return timeline.steps.map((step) => String(step));
  }
  const decisionSimulation = readNestedRecord(payload, "decision_simulation");
  const simTimeline = Array.isArray(decisionSimulation?.timeline)
    ? decisionSimulation.timeline
        .map((step) => {
          const record = readRecord(step);
          return record && typeof record.summary === "string" ? record.summary : "";
        })
        .filter(Boolean)
    : [];
  return simTimeline;
}

export function buildDecisionCockpitState(params: {
  workspaceId: string;
  projectId: string;
  projectName?: string;
  projectDomain?: string;
  sceneJson?: SceneJson | null;
  payload?: CockpitSourcePayload | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  focusMode?: "all" | "selected";
  focusPinned?: boolean;
  activeLoopId?: string | null;
  memoryState?: {
    objects?: Record<string, { volatility?: number }>;
    loops?: Record<string, unknown>;
  } | null;
  modeContext?: ActiveModeContext | null;
}): DecisionCockpitState {
  const payload: CockpitSourcePayload = params.payload ?? {};
  const scene = params.sceneJson ?? (readRecord(payload.scene_json) as SceneJson | null) ?? null;

  const objectCount = Array.isArray(scene?.scene?.objects) ? scene.scene.objects.length : 0;
  const relationCount = Array.isArray(scene?.scene?.relations) ? scene.scene.relations.length : 0;
  const loopCount = Array.isArray(scene?.scene?.loops) ? scene.scene.loops.length : 0;

  const objectSelection = readNestedRecord(payload, "object_selection");
  const promptFeedback = readNestedRecord(payload, "prompt_feedback");
  const sceneFeedback = promptFeedback ? readNestedRecord(promptFeedback, "scene_feedback") : null;
  const decisionScenarioSnapshot = readNestedRecord(payload, "decision_scenario_snapshot");
  const snapshotScene = decisionScenarioSnapshot ? readNestedRecord(decisionScenarioSnapshot, "scene") : null;

  const highlights = uniq(
    readStringArray(objectSelection?.highlighted_objects).concat(
      readStringArray(sceneFeedback?.highlighted_objects),
      readStringArray(snapshotScene?.highlightedObjectIds)
    )
  );

  const riskPropagation = readNestedRecord(payload, "risk_propagation");
  const decisionSimulation = readNestedRecord(payload, "decision_simulation");
  const simulationRisk = decisionSimulation ? readNestedRecord(decisionSimulation, "risk") : null;
  const promptRiskFeedback = promptFeedback ? readNestedRecord(promptFeedback, "risk_feedback") : null;

  const riskSummary = String(
    riskPropagation?.summary ??
      simulationRisk?.summary ??
      "Risk summary is not available yet."
  );
  const affectedDimensions = uniq(
    readStringArray(simulationRisk?.affectedDimensions).concat(
      readStringArray(promptRiskFeedback?.affected_dimensions)
    )
  );
  const riskSources = uniq(readStringArray(riskPropagation?.sources));
  const riskLevel = inferRiskLevel(riskSummary, Number(decisionSimulation?.confidence ?? 0.5));

  const timelineImpact = readNestedRecord(payload, "timeline_impact");
  const timelineSteps = pickTimelineSteps(payload).filter(Boolean);
  const immediate = String(timelineImpact?.immediate ?? timelineSteps[0] ?? "").trim() || undefined;
  const nearTerm = String(timelineImpact?.near_term ?? timelineSteps[1] ?? "").trim() || undefined;
  const followUp = String(timelineImpact?.follow_up ?? timelineSteps[2] ?? "").trim() || undefined;

  const strategyKpi = readNestedRecord(payload, "strategy_kpi");
  const strategySummaryRaw =
    readRecord(strategyKpi?.summary) ??
    readNestedRecord(readRecord(strategyKpi?.strategy) ?? {}, "impact_summary");
  const strategySummary = strategySummaryRaw as Partial<KpiImpactSummary> | null;
  const strategy = {
    summary: String(strategySummary?.summary ?? "").trim() || undefined,
    at_risk_kpis: uniq(readStringArray(strategySummary?.at_risk_kpis)),
    improved_kpis: uniq(readStringArray(strategySummary?.improved_kpis)),
    threatened_objectives: uniq(readStringArray(strategySummary?.threatened_objectives)),
    improved_objectives: uniq(readStringArray(strategySummary?.improved_objectives)),
  };

  const decisionComparison = readNestedRecord(payload, "decision_comparison");
  const baselineReady = readRecord(decisionComparison?.baselineReady);
  const comparisonDelta = decisionComparison ? readNestedRecord(decisionComparison, "delta") : null;
  const changedObjects = comparisonDelta ? readNestedRecord(comparisonDelta, "changedObjects") : null;
  const comparisonChangedCount =
    readStringArray(changedObjects?.added).length + readStringArray(changedObjects?.removed).length;

  const memoryObjects = params.memoryState?.objects ?? {};
  const volatileNodes = Object.entries(memoryObjects)
    .filter(([, value]) => Number((value as MemoryObjectSnapshot)?.volatility ?? 0) >= 0.35)
    .map(([id]) => id)
    .slice(0, 5);

  const recurringLoops = Object.keys(params.memoryState?.loops ?? {}).slice(0, 5);

  const executiveInsight = readNestedRecord(payload, "executive_insight");
  const drivers = Array.isArray(executiveInsight?.drivers)
    ? executiveInsight.drivers
        .slice(0, 4)
        .map((driver) => {
          const record = readRecord(driver);
          return record && typeof record.object_id === "string" ? record.object_id : "";
        })
        .filter(Boolean)
    : [];

  const decisionReplay = readNestedRecord(payload, "decision_replay");
  const strategicAdvice = readNestedRecord(payload, "strategic_advice");
  const primaryRecommendation = strategicAdvice ? readNestedRecord(strategicAdvice, "primary_recommendation") : null;
  const executiveSummarySurface = readNestedRecord(payload, "executive_summary_surface");
  const executiveConfidence = executiveInsight ? readRecord(executiveInsight.confidence) : null;

  return {
    mode: params.modeContext
      ? {
          active_mode_id: params.modeContext.mode_id,
          role_label: params.modeContext.role_label,
          detail_level: params.modeContext.detail_profile.level,
          explanation_depth: params.modeContext.detail_profile.explanation_depth,
          panel_preferences: params.modeContext.panel_preferences,
          workflow_preferences: params.modeContext.workflow_preferences,
        }
      : undefined,
    workspace: {
      workspace_id: String(params.workspaceId || "default_workspace"),
      project_id: String(params.projectId || "default"),
      project_name: params.projectName,
      project_domain: params.projectDomain,
    },
    scenario: {
      scenario_id: typeof decisionSimulation?.scenario === "object" && decisionSimulation.scenario !== null
        ? String((decisionSimulation.scenario as Record<string, unknown>).id ?? "").trim() || undefined
        : undefined,
      scenario_name: typeof decisionSimulation?.scenario === "object" && decisionSimulation.scenario !== null
        ? String((decisionSimulation.scenario as Record<string, unknown>).name ?? "").trim() || undefined
        : undefined,
      comparison_mode: typeof decisionComparison?.mode === "string"
        ? String(decisionComparison.mode).trim() || undefined
        : undefined,
      replay_ready: Array.isArray(decisionReplay?.steps) && decisionReplay.steps.length > 0,
    },
    scene: {
      object_count: objectCount,
      relation_count: relationCount,
      loop_count: loopCount,
      highlighted_object_count: highlights.length,
      active_loop_id: params.activeLoopId ?? null,
      scene_health: inferSceneHealth(riskLevel),
    },
    selection: {
      selected_object_id: params.selectedObjectId ?? null,
      selected_label: params.selectedObjectLabel ?? null,
      highlighted_object_ids: highlights,
      focused_mode: params.focusMode,
      focus_pinned: !!params.focusPinned,
    },
    risk: {
      summary: riskSummary,
      sources: riskSources,
      affected_dimensions: affectedDimensions,
      level: riskLevel,
    },
    timeline: {
      immediate,
      near_term: nearTerm,
      follow_up: followUp,
      steps: timelineSteps,
      replay_ready: Array.isArray(decisionReplay?.steps) && decisionReplay.steps.length > 0,
    },
    strategy,
    comparison: {
      mode: typeof decisionComparison?.mode === "string" ? String(decisionComparison.mode).trim() || undefined : undefined,
      summary: typeof decisionComparison?.summary === "string"
        ? String(decisionComparison.summary).trim() || undefined
        : undefined,
      baseline_available: baselineReady?.baselineAvailable === true,
      comparable: baselineReady?.comparable === true,
      changed_objects_count: Number.isFinite(comparisonChangedCount) ? comparisonChangedCount : undefined,
    },
    advice: {
      summary: typeof strategicAdvice?.summary === "string" ? String(strategicAdvice.summary).trim() || undefined : undefined,
      primary_action:
        typeof primaryRecommendation?.action === "string"
          ? String(primaryRecommendation.action).trim() || undefined
          : undefined,
      confidence: Number.isFinite(Number(strategicAdvice?.confidence))
        ? Number(strategicAdvice?.confidence)
        : undefined,
      why: typeof strategicAdvice?.why === "string" ? String(strategicAdvice.why).trim() || undefined : undefined,
    },
    history: {
      memory_available: !!params.memoryState,
      volatile_nodes: volatileNodes,
      recurring_loop_ids: recurringLoops,
      notes: volatileNodes.length
        ? ["Historical volatility remains concentrated in a subset of nodes."]
        : ["Historical volatility signals are currently limited."],
    },
    executive: {
      summary:
        String(executiveSummarySurface?.summary ?? executiveInsight?.summary ?? "").trim() ||
        undefined,
      happened:
        String(executiveSummarySurface?.happened ?? "").trim() || undefined,
      why_it_matters:
        String(executiveSummarySurface?.why_it_matters ?? "").trim() || undefined,
      what_to_do:
        String(executiveSummarySurface?.what_to_do ?? "").trim() || undefined,
      confidence_level: typeof executiveConfidence?.level === "string"
        ? String(executiveConfidence.level).trim() || undefined
        : undefined,
      confidence_score: Number.isFinite(Number(executiveConfidence?.score))
        ? Number(executiveConfidence?.score)
        : undefined,
      key_drivers: uniq(drivers),
    },
  };
}
