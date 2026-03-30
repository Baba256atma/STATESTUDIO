import type { SceneJson } from "../sceneTypes";
import type { NexoraIntentRoute } from "../router/intentRouterTypes";

export type NexoraExecutionHandlers = {
  runBackendChat?: (text: string) => Promise<any>;
  runScanner?: (text: string, scene: SceneJson | null) => Promise<any>;
  runSimulation?: (text: string, scene: SceneJson | null) => Promise<any>;
  generateAdvice?: (input: any) => Promise<any>;
  applySceneActions?: (actions: any[], scene: SceneJson | null) => Promise<any> | any;
  runLocalDecisionRouter?: (text: string) => Promise<any> | any;
};

export type NexoraExecutionInput = {
  userText: string;
  route: NexoraIntentRoute;
  activeMode: string;
  activeDomain?: string;
  currentScene: SceneJson | null;
  currentRightPanelTab?: string | null;
  selectedObjectId?: string | null;
  objectProfiles?: Record<string, any>;
  productModeContext?: any | null;
  memoryState?: any | null;
  environmentConfig?: any | null;
  handlers: NexoraExecutionHandlers;
};

export type NexoraExecutionStep =
  | "open_panel"
  | "open_inspector_tab"
  | "local_decision"
  | "backend_chat"
  | "scanner"
  | "simulation"
  | "strategy"
  | "object_focus"
  | "scene_effect"
  | "panel_effect"
  | "finalize";

export type NexoraExecutionResult = {
  ok: boolean;
  executedSteps: NexoraExecutionStep[];
  skippedSteps: NexoraExecutionStep[];
  warnings: string[];
  errors: string[];

  routeIntent: string;
  routeTarget: string;
  executionSummary: string;

  preferredPanel?: string | null;
  preferredInspectorTab?: string | null;

  shouldOpenPanel: boolean;
  shouldUpdateInspector: boolean;

  chatReply?: string | null;
  backendPayload?: any | null;
  scannerPayload?: any | null;
  simulationPayload?: any | null;
  advicePayload?: any | null;
  localDecisionPayload?: any | null;

  highlightedObjectIds: string[];
  focusedObjectId?: string | null;

  allowSceneMutation: boolean;
  appliedSceneMutation: "none" | "highlight_only" | "soft_reaction" | "full_update";
  scenePatch?: any | null;
  sceneReplacement?: SceneJson | null;

  panelUpdates?: Record<string, any>;
  objectProfileUpdates?: Record<string, any>;

  unifiedReaction?: any | null;
};
