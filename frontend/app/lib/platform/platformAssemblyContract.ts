import type { ActiveModeContext } from "../modes/productModesContract";
import type { ReasoningOutput } from "../reasoning/aiReasoningContract";
import type { SimulationResult } from "../decision/simulationContract";
import type { ScenarioComparisonResult, ReplaySequence } from "../decision/scenarioComparisonReplayContract";
import type { ExecutiveInsight } from "../decision/executiveExplainabilityContract";
import type { ProjectStrategyLayer } from "../strategy/strategyKpiContract";
import type { DecisionCockpitState } from "../cockpit/decisionCockpitContract";
import type { EnvironmentConfig } from "../ops/environmentDeploymentContract";

export type ProjectLifecycleState =
  | "project_initialized"
  | "domain_recognized"
  | "semantics_normalized"
  | "scene_constructed"
  | "reasoning_initialized"
  | "simulation_ready"
  | "cockpit_active"
  | "memory_integrated"
  | "decision_loop_active";

export type PlatformEventType =
  | "prompt_received"
  | "object_selected"
  | "scenario_triggered"
  | "simulation_completed"
  | "explainability_generated"
  | "memory_updated"
  | "project_switched"
  | "mode_switched";

export type PlatformEvent = {
  type: PlatformEventType;
  timestamp: number;
  project_id?: string;
  workspace_id?: string;
  payload?: Record<string, unknown>;
};

export type NexoraSubsystem = {
  id:
    | "scene_rendering"
    | "semantic_layer"
    | "prompt_intelligence"
    | "simulation_engine"
    | "scenario_comparison"
    | "executive_explainability"
    | "strategy_kpi"
    | "decision_memory"
    | "cockpit"
    | "product_modes"
    | "visual_language"
    | "design_system"
    | "ai_reasoning"
    | "scanner_integration"
    | "workspace_project"
    | "persistence";
  status: "active" | "optional";
  capabilities: string[];
};

export type PlatformReasoningContext = {
  intent?: string;
  path?: string;
  confidence_band?: string;
  matched_concepts_count: number;
  ambiguity_count: number;
};

export type PlatformSimulationContext = {
  active_scenario_id?: string;
  affected_object_count: number;
  baseline_available: boolean;
  comparable: boolean;
};

export type PlatformCockpitContext = {
  scene_health?: string;
  risk_level?: string;
  summary?: string;
};

export type PlatformVisualContext = {
  theme?: string;
  mode_id?: string;
  visual_profile?: string;
};

export type NexoraPlatformState = {
  activeWorkspace: {
    id: string;
  };
  activeProject: {
    id: string;
    name?: string;
    domain?: string;
  };
  activeMode?: ActiveModeContext | null;
  activeScenario?: {
    id?: string;
    name?: string;
  };
  activeSelection?: {
    object_id?: string | null;
    focus_mode?: "all" | "selected";
  };
  lifecycle: {
    stage: ProjectLifecycleState;
    stages_completed: ProjectLifecycleState[];
  };
  reasoningContext: PlatformReasoningContext;
  simulationContext: PlatformSimulationContext;
  cockpitContext: PlatformCockpitContext;
  visualContext: PlatformVisualContext;
  subsystems: NexoraSubsystem[];
  lastEvent?: PlatformEvent;
  extension_points: {
    reasoning_adapters: string[];
    scanner_adapters: string[];
    domain_semantic_packs: string[];
    visual_language_packs: string[];
    simulation_models: string[];
    cockpit_extensions: string[];
  };
  environment_context?: {
    environment?: string;
    deployment_profile_id?: string;
    logging_mode?: string;
    enabled_features?: string[];
    restricted_mode?: boolean;
  };
};

export type PlatformAssemblyInput = {
  workspaceId: string;
  projectId: string;
  projectName?: string;
  projectDomain?: string;
  selectedObjectId?: string | null;
  focusMode?: "all" | "selected";
  modeContext?: ActiveModeContext | null;
  reasoning?: ReasoningOutput | null;
  simulation?: SimulationResult | null;
  comparison?: ScenarioComparisonResult | null;
  replay?: ReplaySequence | null;
  executive?: ExecutiveInsight | null;
  strategy?: ProjectStrategyLayer | null;
  cockpit?: DecisionCockpitState | null;
  memory?: {
    volatile_nodes?: string[];
    recurring_patterns?: string[];
  } | null;
  theme?: string;
  environmentConfig?: EnvironmentConfig | null;
};

function uniq(xs: string[]): string[] {
  return Array.from(new Set((xs ?? []).map((x) => String(x || "").trim()).filter(Boolean)));
}

export function listPlatformSubsystems(): NexoraSubsystem[] {
  return [
    { id: "scene_rendering", status: "active", capabilities: ["scene", "interaction", "selection"] },
    { id: "semantic_layer", status: "active", capabilities: ["object_semantics", "matching"] },
    { id: "prompt_intelligence", status: "active", capabilities: ["prompt_to_feedback"] },
    { id: "simulation_engine", status: "active", capabilities: ["scenario_simulation"] },
    { id: "scenario_comparison", status: "active", capabilities: ["comparison", "replay"] },
    { id: "executive_explainability", status: "active", capabilities: ["insight", "driver_explanations"] },
    { id: "strategy_kpi", status: "active", capabilities: ["kpi_impact", "objective_mapping"] },
    { id: "decision_memory", status: "optional", capabilities: ["pattern_hints", "volatility_signals"] },
    { id: "cockpit", status: "active", capabilities: ["panel_ready_summary"] },
    { id: "product_modes", status: "active", capabilities: ["experience_profiles"] },
    { id: "visual_language", status: "active", capabilities: ["object_role_visuals", "relation_visuals"] },
    { id: "design_system", status: "active", capabilities: ["tokens", "interaction_tokens", "motion_tokens"] },
    { id: "ai_reasoning", status: "active", capabilities: ["intent_inference", "path_selection"] },
    { id: "scanner_integration", status: "optional", capabilities: ["project_create", "project_enrich"] },
    { id: "workspace_project", status: "active", capabilities: ["project_local_state", "mode_switching"] },
    { id: "persistence", status: "active", capabilities: ["save_restore", "import_export"] },
  ];
}

export function inferLifecycleState(input: PlatformAssemblyInput): {
  stage: ProjectLifecycleState;
  stages_completed: ProjectLifecycleState[];
} {
  const stages: ProjectLifecycleState[] = ["project_initialized"];
  if (input.projectDomain) stages.push("domain_recognized");
  if (input.reasoning || input.strategy) stages.push("semantics_normalized");
  stages.push("scene_constructed");
  if (input.reasoning) stages.push("reasoning_initialized");
  if (input.simulation) stages.push("simulation_ready");
  if (input.cockpit) stages.push("cockpit_active");
  if (input.memory && ((input.memory.volatile_nodes?.length ?? 0) > 0 || (input.memory.recurring_patterns?.length ?? 0) > 0)) {
    stages.push("memory_integrated");
  }
  if (input.reasoning && input.simulation && input.cockpit) stages.push("decision_loop_active");
  return {
    stage: stages[stages.length - 1],
    stages_completed: stages,
  };
}

export function createPlatformEvent(params: {
  type: PlatformEventType;
  projectId?: string;
  workspaceId?: string;
  payload?: Record<string, unknown>;
  timestamp?: number;
}): PlatformEvent {
  return {
    type: params.type,
    timestamp: Number.isFinite(params.timestamp) ? Number(params.timestamp) : Date.now(),
    project_id: params.projectId,
    workspace_id: params.workspaceId,
    payload: params.payload,
  };
}

export function buildPlatformAssemblyState(input: PlatformAssemblyInput): NexoraPlatformState {
  const lifecycle = inferLifecycleState(input);
  const reasoningContext: PlatformReasoningContext = {
    intent: input.reasoning?.intent,
    path: input.reasoning?.path,
    confidence_band: input.reasoning?.confidence?.band,
    matched_concepts_count: input.reasoning?.matched_concepts?.length ?? 0,
    ambiguity_count: input.reasoning?.ambiguity_notes?.length ?? 0,
  };
  const simulationContext: PlatformSimulationContext = {
    active_scenario_id: input.simulation?.scenario?.id,
    affected_object_count:
      (input.simulation?.impact?.directlyAffectedObjectIds?.length ?? 0) +
      (input.simulation?.impact?.downstreamObjectIds?.length ?? 0),
    baseline_available: !!input.comparison?.baselineReady?.baselineAvailable,
    comparable: !!input.comparison?.baselineReady?.comparable,
  };
  const cockpitContext: PlatformCockpitContext = {
    scene_health: input.cockpit?.scene?.scene_health,
    risk_level: input.cockpit?.risk?.level,
    summary: input.cockpit?.executive?.summary ?? input.executive?.summary,
  };
  const visualContext: PlatformVisualContext = {
    theme: input.theme,
    mode_id: input.modeContext?.mode_id,
    visual_profile: input.modeContext?.detail_profile?.level,
  };

  return {
    activeWorkspace: {
      id: input.workspaceId,
    },
    activeProject: {
      id: input.projectId,
      name: input.projectName,
      domain: input.projectDomain,
    },
    activeMode: input.modeContext ?? null,
    activeScenario: {
      id: input.simulation?.scenario?.id,
      name: input.simulation?.scenario?.name,
    },
    activeSelection: {
      object_id: input.selectedObjectId ?? null,
      focus_mode: input.focusMode,
    },
    lifecycle,
    reasoningContext,
    simulationContext,
    cockpitContext,
    visualContext,
    subsystems: listPlatformSubsystems(),
    lastEvent: createPlatformEvent({
      type: input.reasoning ? "prompt_received" : "project_switched",
      projectId: input.projectId,
      workspaceId: input.workspaceId,
      payload: {
        intent: input.reasoning?.intent,
        scenario_id: input.simulation?.scenario?.id,
      },
    }),
    extension_points: {
      reasoning_adapters: ["rule_based", "model_assisted", "hybrid"],
      scanner_adapters: ["repo", "web", "document", "dataset"],
      domain_semantic_packs: uniq([String(input.projectDomain || "generic")]),
      visual_language_packs: ["default"],
      simulation_models: ["baseline_contract"],
      cockpit_extensions: ["panel_summary"],
    },
    environment_context: input.environmentConfig
      ? {
          environment: input.environmentConfig.deployment.environment,
          deployment_profile_id: input.environmentConfig.deployment.id,
          logging_mode: input.environmentConfig.logging_mode,
          enabled_features: Object.entries(input.environmentConfig.features)
            .filter(([, enabled]) => !!enabled)
            .map(([feature]) => feature),
          restricted_mode: !!input.environmentConfig.runtime_safety?.restricted_mode,
        }
      : undefined,
  };
}
