import type { SceneJson } from "../sceneTypes";
import type { NexoraIntentRoute } from "../router/intentRouterTypes";
import type { ActiveModeContext } from "../modes/productModesContract";
import type { EnvironmentConfig } from "../ops/environmentDeploymentContract";
import type { UnifiedSceneReaction } from "../scene/unifiedReaction";

export type NexoraLocalDecisionPayload = {
  actions?: ReadonlyArray<unknown>;
  assistantReply?: string | null;
} & Record<string, unknown>;

export type NexoraAdviceInput = {
  text: string;
  route: NexoraIntentRoute;
  currentScene: SceneJson | null;
};

export type NexoraExecutionHandlers = {
  runBackendChat?: (text: string) => Promise<unknown>;
  runScanner?: (text: string, scene: SceneJson | null) => Promise<unknown>;
  runSimulation?: (text: string, scene: SceneJson | null) => Promise<unknown>;
  generateAdvice?: (input: NexoraAdviceInput) => Promise<unknown>;
  applySceneActions?: (
    actions: ReadonlyArray<unknown>,
    scene: SceneJson | null
  ) => Promise<unknown> | unknown;
  runLocalDecisionRouter?: (text: string) => Promise<NexoraLocalDecisionPayload | unknown> | NexoraLocalDecisionPayload | unknown;
};

export type NexoraExecutionInput = {
  userText: string;
  route: NexoraIntentRoute;
  activeMode: string;
  activeDomain?: string;
  currentScene: SceneJson | null;
  currentRightPanelTab?: string | null;
  selectedObjectId?: string | null;
  objectProfiles?: Record<string, unknown>;
  productModeContext?: ActiveModeContext | Record<string, unknown> | null;
  memoryState?: unknown | null;
  environmentConfig?: EnvironmentConfig | null;
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
  backendPayload?: unknown | null;
  scannerPayload?: unknown | null;
  simulationPayload?: unknown | null;
  advicePayload?: unknown | null;
  localDecisionPayload?: NexoraLocalDecisionPayload | unknown | null;

  highlightedObjectIds: string[];
  focusedObjectId?: string | null;

  allowSceneMutation: boolean;
  appliedSceneMutation: "none" | "highlight_only" | "soft_reaction" | "full_update";
  scenePatch?: unknown | null;
  sceneReplacement?: SceneJson | null;

  panelUpdates?: Record<string, unknown>;
  objectProfileUpdates?: Record<string, unknown>;

  unifiedReaction?: UnifiedSceneReaction | null;
};
