export type ProductModeId = "manager" | "analyst" | "scanner" | "demo" | "executive";

export type ModeDetailProfile = {
  level: "concise" | "standard" | "detailed" | "technical";
  explanation_depth: "brief" | "balanced" | "deep";
  simulation_depth: "summary" | "standard" | "propagation";
  object_detail: "minimal" | "standard" | "deep";
};

export type ModePanelPreference = {
  panel: "scene" | "selection" | "risk" | "timeline" | "strategy" | "comparison" | "advice" | "history" | "workspace";
  priority: number;
  visible: boolean;
  expanded_by_default?: boolean;
};

export type ModeWorkflowPreference = {
  workflow:
    | "analyze_project"
    | "compare_scenarios"
    | "review_executive_summary"
    | "inspect_dependencies"
    | "scanner_import_enrich"
    | "replay_impact";
  emphasis: "low" | "medium" | "high";
};

export type RoleExperienceProfile = {
  id: ProductModeId;
  role_label: string;
  emphasis_profile: {
    risk: number;
    kpi: number;
    explainability: number;
    simulation: number;
    detail: number;
    advice: number;
    history: number;
  };
  panel_preferences: ModePanelPreference[];
  detail_profile: ModeDetailProfile;
  workflow_preferences: ModeWorkflowPreference[];
  tool_hints?: string[];
};

export type ProductMode = {
  id: ProductModeId;
  label: string;
  description: string;
  intended_role: string;
  profile: RoleExperienceProfile;
};

export type ActiveModeContext = {
  mode_id: ProductModeId;
  mode_label: string;
  role_label: string;
  project_domain?: string;
  workspace_id?: string;
  project_id?: string;
  panel_preferences: ModePanelPreference[];
  detail_profile: ModeDetailProfile;
  workflow_preferences: ModeWorkflowPreference[];
  tool_hints?: string[];
};

function basePanels(): ModePanelPreference[] {
  return [
    { panel: "scene", priority: 3, visible: true },
    { panel: "selection", priority: 4, visible: true },
    { panel: "risk", priority: 1, visible: true, expanded_by_default: true },
    { panel: "timeline", priority: 2, visible: true },
    { panel: "strategy", priority: 2, visible: true },
    { panel: "comparison", priority: 3, visible: true },
    { panel: "advice", priority: 1, visible: true, expanded_by_default: true },
    { panel: "history", priority: 4, visible: true },
    { panel: "workspace", priority: 5, visible: true },
  ];
}

const PRODUCT_MODES: Record<ProductModeId, ProductMode> = {
  manager: {
    id: "manager",
    label: "Manager",
    description: "Operational manager view with KPI, risk, and recommendation emphasis.",
    intended_role: "manager",
    profile: {
      id: "manager",
      role_label: "Manager",
      emphasis_profile: { risk: 0.9, kpi: 0.9, explainability: 0.6, simulation: 0.6, detail: 0.5, advice: 1, history: 0.5 },
      panel_preferences: basePanels().map((p) =>
        p.panel === "risk" || p.panel === "advice" || p.panel === "strategy"
          ? { ...p, priority: 1 }
          : p.panel === "history"
          ? { ...p, priority: 5 }
          : p
      ),
      detail_profile: { level: "standard", explanation_depth: "balanced", simulation_depth: "standard", object_detail: "standard" },
      workflow_preferences: [
        { workflow: "analyze_project", emphasis: "high" },
        { workflow: "review_executive_summary", emphasis: "high" },
        { workflow: "compare_scenarios", emphasis: "medium" },
      ],
      tool_hints: ["kpi", "risk", "advice"],
    },
  },
  analyst: {
    id: "analyst",
    label: "Analyst",
    description: "Analyst view with deeper propagation and dependency detail.",
    intended_role: "analyst",
    profile: {
      id: "analyst",
      role_label: "Analyst",
      emphasis_profile: { risk: 0.7, kpi: 0.6, explainability: 0.8, simulation: 1, detail: 1, advice: 0.5, history: 0.7 },
      panel_preferences: basePanels().map((p) =>
        p.panel === "selection" || p.panel === "comparison" || p.panel === "history"
          ? { ...p, priority: 1 }
          : p.panel === "advice"
          ? { ...p, priority: 4 }
          : p
      ),
      detail_profile: { level: "detailed", explanation_depth: "deep", simulation_depth: "propagation", object_detail: "deep" },
      workflow_preferences: [
        { workflow: "inspect_dependencies", emphasis: "high" },
        { workflow: "compare_scenarios", emphasis: "high" },
        { workflow: "replay_impact", emphasis: "high" },
      ],
      tool_hints: ["simulation", "comparison", "memory"],
    },
  },
  scanner: {
    id: "scanner",
    label: "Scanner",
    description: "Scanner workflow mode focused on project ingestion and enrichment.",
    intended_role: "scanner_operator",
    profile: {
      id: "scanner",
      role_label: "Scanner Operator",
      emphasis_profile: { risk: 0.5, kpi: 0.4, explainability: 0.5, simulation: 0.5, detail: 0.8, advice: 0.3, history: 0.4 },
      panel_preferences: basePanels().map((p) =>
        p.panel === "workspace" || p.panel === "selection"
          ? { ...p, priority: 1, expanded_by_default: true }
          : p.panel === "advice"
          ? { ...p, visible: false }
          : p
      ),
      detail_profile: { level: "detailed", explanation_depth: "balanced", simulation_depth: "standard", object_detail: "deep" },
      workflow_preferences: [
        { workflow: "scanner_import_enrich", emphasis: "high" },
        { workflow: "analyze_project", emphasis: "medium" },
      ],
      tool_hints: ["scanner", "workspace", "semantics"],
    },
  },
  demo: {
    id: "demo",
    label: "Demo",
    description: "Demo storytelling mode with clean summaries and guided flow.",
    intended_role: "demo_presenter",
    profile: {
      id: "demo",
      role_label: "Demo Presenter",
      emphasis_profile: { risk: 0.8, kpi: 0.7, explainability: 0.5, simulation: 0.6, detail: 0.3, advice: 0.9, history: 0.2 },
      panel_preferences: basePanels().map((p) =>
        p.panel === "scene" || p.panel === "risk" || p.panel === "advice"
          ? { ...p, priority: 1 }
          : p.panel === "history"
          ? { ...p, visible: false }
          : p
      ),
      detail_profile: { level: "concise", explanation_depth: "brief", simulation_depth: "summary", object_detail: "minimal" },
      workflow_preferences: [
        { workflow: "analyze_project", emphasis: "high" },
        { workflow: "review_executive_summary", emphasis: "high" },
      ],
      tool_hints: ["demo", "summary"],
    },
  },
  executive: {
    id: "executive",
    label: "Executive",
    description: "Executive mode focused on concise strategic decision output.",
    intended_role: "executive",
    profile: {
      id: "executive",
      role_label: "Executive",
      emphasis_profile: { risk: 0.9, kpi: 1, explainability: 0.7, simulation: 0.5, detail: 0.2, advice: 1, history: 0.3 },
      panel_preferences: basePanels().map((p) =>
        p.panel === "risk" || p.panel === "strategy" || p.panel === "advice"
          ? { ...p, priority: 1, expanded_by_default: true }
          : p.panel === "selection" || p.panel === "history"
          ? { ...p, visible: false }
          : p
      ),
      detail_profile: { level: "concise", explanation_depth: "brief", simulation_depth: "summary", object_detail: "minimal" },
      workflow_preferences: [
        { workflow: "review_executive_summary", emphasis: "high" },
        { workflow: "compare_scenarios", emphasis: "medium" },
      ],
      tool_hints: ["executive_summary", "kpi", "recommendation"],
    },
  },
};

export function getProductMode(modeId?: string | null): ProductMode {
  const id = String(modeId || "manager").trim().toLowerCase() as ProductModeId;
  return PRODUCT_MODES[id] ?? PRODUCT_MODES.manager;
}

export function listProductModes(): ProductMode[] {
  return Object.values(PRODUCT_MODES);
}

export function buildActiveModeContext(params: {
  modeId?: string | null;
  projectDomain?: string;
  workspaceId?: string;
  projectId?: string;
}): ActiveModeContext {
  const mode = getProductMode(params.modeId);
  return {
    mode_id: mode.id,
    mode_label: mode.label,
    role_label: mode.profile.role_label,
    project_domain: params.projectDomain,
    workspace_id: params.workspaceId,
    project_id: params.projectId,
    panel_preferences: mode.profile.panel_preferences,
    detail_profile: mode.profile.detail_profile,
    workflow_preferences: mode.profile.workflow_preferences,
    tool_hints: mode.profile.tool_hints,
  };
}
