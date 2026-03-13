import type { SceneJson } from "../sceneTypes";
import type { ActiveModeContext, ModePanelPreference, ModeWorkflowPreference } from "../modes/productModesContract";

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

function pickTimelineSteps(payload: any): string[] {
  const timeline = payload?.timeline_impact;
  if (Array.isArray(timeline?.steps)) return timeline.steps.map((x: any) => String(x));
  const simTimeline = Array.isArray(payload?.decision_simulation?.timeline)
    ? payload.decision_simulation.timeline.map((s: any) => String(s?.summary ?? "")).filter(Boolean)
    : [];
  return simTimeline;
}

export function buildDecisionCockpitState(params: {
  workspaceId: string;
  projectId: string;
  projectName?: string;
  projectDomain?: string;
  sceneJson?: SceneJson | null;
  payload?: any;
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
  const payload = params.payload ?? {};
  const scene = params.sceneJson ?? payload?.scene_json ?? null;

  const objectCount = Array.isArray(scene?.scene?.objects) ? scene.scene.objects.length : 0;
  const relationCount = Array.isArray((scene as any)?.scene?.relations) ? (scene as any).scene.relations.length : 0;
  const loopCount = Array.isArray(scene?.scene?.loops) ? scene.scene.loops.length : 0;

  const highlights = uniq(
    (
      payload?.object_selection?.highlighted_objects ??
      payload?.prompt_feedback?.scene_feedback?.highlighted_objects ??
      payload?.decision_scenario_snapshot?.scene?.highlightedObjectIds ??
      []
    ).map(String)
  );

  const riskSummary = String(
    payload?.risk_propagation?.summary ??
      payload?.decision_simulation?.risk?.summary ??
      "Risk summary is not available yet."
  );
  const affectedDimensions = uniq(
    (
      payload?.decision_simulation?.risk?.affectedDimensions ??
      payload?.prompt_feedback?.risk_feedback?.affected_dimensions ??
      []
    ).map(String)
  );
  const riskSources = uniq((payload?.risk_propagation?.sources ?? []).map(String));
  const riskLevel = inferRiskLevel(riskSummary, Number(payload?.decision_simulation?.confidence ?? 0.5));

  const timelineSteps = pickTimelineSteps(payload).filter(Boolean);
  const immediate = String(payload?.timeline_impact?.immediate ?? timelineSteps[0] ?? "").trim() || undefined;
  const nearTerm = String(payload?.timeline_impact?.near_term ?? timelineSteps[1] ?? "").trim() || undefined;
  const followUp = String(payload?.timeline_impact?.follow_up ?? timelineSteps[2] ?? "").trim() || undefined;

  const strategySummary = payload?.strategy_kpi?.summary ?? payload?.strategy_kpi?.strategy?.impact_summary ?? null;
  const strategy = {
    summary: String(strategySummary?.summary ?? "").trim() || undefined,
    at_risk_kpis: uniq((strategySummary?.at_risk_kpis ?? []).map(String)),
    improved_kpis: uniq((strategySummary?.improved_kpis ?? []).map(String)),
    threatened_objectives: uniq((strategySummary?.threatened_objectives ?? []).map(String)),
    improved_objectives: uniq((strategySummary?.improved_objectives ?? []).map(String)),
  };

  const baselineReady = payload?.decision_comparison?.baselineReady;
  const comparisonChangedCount = Number(
    payload?.decision_comparison?.delta?.changedObjects?.added?.length ?? 0
  ) + Number(payload?.decision_comparison?.delta?.changedObjects?.removed?.length ?? 0);

  const memoryObjects = params.memoryState?.objects ?? {};
  const volatileNodes = Object.entries(memoryObjects)
    .filter(([, value]: any) => Number(value?.volatility ?? 0) >= 0.35)
    .map(([id]) => id)
    .slice(0, 5);

  const recurringLoops = Object.keys(params.memoryState?.loops ?? {}).slice(0, 5);

  const drivers = Array.isArray(payload?.executive_insight?.drivers)
    ? payload.executive_insight.drivers.slice(0, 4).map((d: any) => String(d?.object_id ?? "")).filter(Boolean)
    : [];

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
      scenario_id: String(payload?.decision_simulation?.scenario?.id ?? "").trim() || undefined,
      scenario_name: String(payload?.decision_simulation?.scenario?.name ?? "").trim() || undefined,
      comparison_mode: String(payload?.decision_comparison?.mode ?? "").trim() || undefined,
      replay_ready: !!payload?.decision_replay?.steps?.length,
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
      replay_ready: !!payload?.decision_replay?.steps?.length,
    },
    strategy,
    comparison: {
      mode: String(payload?.decision_comparison?.mode ?? "").trim() || undefined,
      summary: String(payload?.decision_comparison?.summary ?? "").trim() || undefined,
      baseline_available: !!baselineReady?.baselineAvailable,
      comparable: !!baselineReady?.comparable,
      changed_objects_count: Number.isFinite(comparisonChangedCount) ? comparisonChangedCount : undefined,
    },
    advice: {
      summary: String(payload?.strategic_advice?.summary ?? "").trim() || undefined,
      primary_action: String(payload?.strategic_advice?.primary_recommendation?.action ?? "").trim() || undefined,
      confidence: Number.isFinite(Number(payload?.strategic_advice?.confidence))
        ? Number(payload?.strategic_advice?.confidence)
        : undefined,
      why: String(payload?.strategic_advice?.why ?? "").trim() || undefined,
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
        String(payload?.executive_summary_surface?.summary ?? payload?.executive_insight?.summary ?? "").trim() ||
        undefined,
      happened:
        String(payload?.executive_summary_surface?.happened ?? "").trim() || undefined,
      why_it_matters:
        String(payload?.executive_summary_surface?.why_it_matters ?? "").trim() || undefined,
      what_to_do:
        String(payload?.executive_summary_surface?.what_to_do ?? "").trim() || undefined,
      confidence_level: String(payload?.executive_insight?.confidence?.level ?? "").trim() || undefined,
      confidence_score: Number.isFinite(Number(payload?.executive_insight?.confidence?.score))
        ? Number(payload?.executive_insight?.confidence?.score)
        : undefined,
      key_drivers: uniq(drivers),
    },
  };
}
