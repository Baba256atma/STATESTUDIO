import type { SceneJson } from "../sceneTypes";

export type IntentKind =
  | "chat_general"
  | "object_focus"
  | "scene_focus"
  | "fragility_scan"
  | "simulation_run"
  | "strategy_advice"
  | "timeline_view"
  | "conflict_view"
  | "replay_view"
  | "executive_summary"
  | "workspace_action"
  | "unknown";

export type RouteTarget =
  | "chat"
  | "scene"
  | "scanner"
  | "simulation"
  | "strategy"
  | "timeline"
  | "conflict"
  | "replay"
  | "workspace"
  | "inspector";

export type UIMutationPolicy =
  | "chat_only"
  | "panel_only"
  | "scene_only"
  | "scene_and_panel"
  | "analysis_only";

export type SceneMutationPolicy =
  | "none"
  | "highlight_only"
  | "soft_reaction"
  | "full_update";

export type NexoraRoutePanelTab =
  | "chat"
  | "object"
  | "loops"
  | "kpi"
  | "decisions"
  | "scene"
  | "montecarlo"
  | "timeline"
  | "conflict"
  | "object_focus"
  | "memory_insights"
  | "risk_flow"
  | "replay"
  | "strategic_advice"
  | "opponent_moves"
  | "strategic_patterns"
  | "executive_dashboard"
  | "collaboration"
  | "workspace";

export type NexoraIntentRoute = {
  intent: IntentKind;
  confidence: number;
  target: RouteTarget;
  uiMutation: UIMutationPolicy;
  sceneMutation: SceneMutationPolicy;
  preferredPanel?: NexoraRoutePanelTab | null;
  preferredInspectorTab?: NexoraRoutePanelTab | null;
  shouldCallBackend: boolean;
  shouldRunScanner: boolean;
  shouldRunSimulation: boolean;
  shouldGenerateAdvice: boolean;
  shouldAffectScene: boolean;
  shouldAffectPanels: boolean;
  matchedObjectIds: string[];
  matchedKeywords: string[];
  domainMode: string;
  explanation: string;
};

export type NexoraIntentRouterInput = {
  text: string;
  activeMode?: string | null;
  activeDomain?: string | null;
  currentRightPanelTab?: NexoraRoutePanelTab | null;
  selectedObjectId?: string | null;
  availableSceneObjectIds: string[];
  sceneJson?: SceneJson | null;
  objectProfiles?: Record<string, unknown> | null;
  productModeContext?: Record<string, unknown> | null;
};
