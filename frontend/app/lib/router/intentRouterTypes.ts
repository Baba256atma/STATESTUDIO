import type { SceneJson } from "../sceneTypes";
import type { CanonicalRightPanelView } from "../ui/right-panel/rightPanelTypes";

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

// Intent router now uses canonical right-panel view names to avoid legacy tab drift.
export type NexoraRoutePanelTab = CanonicalRightPanelView;

export type NexoraIntentRoute = {
  intent: IntentKind;
  confidence: number;
  primaryObjectId: string | null;
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
  method: string;
  reason: string;
  fallbackUsed: boolean;
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
