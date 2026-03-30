import type { ScenarioActionContract } from "../simulation/scenarioActionTypes";
import type { EvolutionState, RecentMemoryState } from "../evolution/evolutionTypes";
import type { SystemIntelligenceResult } from "../intelligence/systemIntelligenceTypes";
import type { DecisionPathResult, ScenarioOverlayPackage } from "../simulation/scenarioActionTypes";
import type { PropagationOverlayState } from "../simulation/propagationTypes";
import type { CompareFocusDimension, CompareModeState, CompareResult, CompareViewMode } from "../compare/compareTypes";
import type {
  StrategyGenerationMode,
  StrategyGenerationResult,
  StrategyGenerationState,
  StrategyPreferredFocus,
} from "../strategy-generation/strategyGenerationTypes";

export type WarRoomViewMode = "idle" | "compose" | "result" | "compare";

export type WarRoomMode = "idle" | "analysis" | "simulation" | "decision";

export type WarRoomOutputMode = "propagation" | "decision_path" | "mixed";

export type WarRoomActionKind = "stress" | "optimize" | "redistribute" | "stabilize";

export type ScenarioAction = {
  type: WarRoomActionKind;
  targetId: string;
  intensity: number;
  context?: Record<string, any>;
};

export type PropagationRequest = {
  sourceId: string;
  intensity: number;
  depth: number;
  decay: number;
  model: "linear" | "exponential";
};

export type DecisionPathRequest = {
  sourceId: string;
  objective: string;
  constraints: string[];
  horizon: number;
};

export type Scenario = {
  id: string;
  title: string;
  trigger: ScenarioAction;
  propagationConfig: {
    depth: number;
    decay: number;
    spreadModel: "linear" | "exponential";
  };
  decisionConfig: {
    objective: string;
    constraints: string[];
    horizon: number;
  };
  origin: "chat" | "scanner" | "composer" | "manual";
  outputMode: WarRoomOutputMode;
  contract: ScenarioActionContract;
  createdAt: number;
};

export type PropagationState = {
  scenarioId: string;
  request: PropagationRequest;
  status: "pending" | "active" | "idle";
  resultMode: "backend" | "preview" | "idle";
  nodeCount: number;
  edgeCount: number;
};

export type DecisionPathState = {
  scenarioId: string;
  request: DecisionPathRequest;
  status: "pending" | "active" | "idle";
  resultMode: "backend" | "preview" | "idle";
  nodeCount: number;
  edgeCount: number;
};

export type WarRoomDraftState = {
  selectedObjectId: string | null;
  actionKind: WarRoomActionKind | null;
  targetObjectIds: string[];
  label: string;
  description: string;
  outputMode: WarRoomOutputMode;
  parameters: Record<string, unknown>;
  isDirty: boolean;
};

export type WarRoomState = {
  activeScenarioId: string | null;
  scenarios: Record<string, Scenario>;
  activePropagation: PropagationState | null;
  activeDecisionPath: DecisionPathState | null;
  focusTargetId: string | null;
  mode: WarRoomMode;
  compare: CompareModeState;
  strategyGeneration: StrategyGenerationState;
};

export type WarRoomSessionState = {
  active: boolean;
  viewMode: WarRoomViewMode;
  draft: WarRoomDraftState;
  lastActionId?: string | null;
  lastRunAt?: number | null;
  source: "war_room";
};

export type WarRoomOverlaySummary = {
  active: boolean;
  actionId: string | null;
  sourceObjectId: string | null;
  overlayMode: "propagation" | "decision_path" | "mixed" | "idle";
  resultMode: "backend" | "preview" | "idle";
  loading: boolean;
  error: string | null;
  propagationNodeCount: number;
  propagationEdgeCount: number;
  decisionNodeCount: number;
  decisionEdgeCount: number;
};

export type WarRoomOverlayDetail = {
  propagation: PropagationOverlayState | null;
  decisionPath: DecisionPathResult | null;
  scenarioAction: ScenarioActionContract | null;
  overlayPackage: ScenarioOverlayPackage | null;
};

export type WarRoomRunResult = {
  scenario: Scenario;
  ranAt: number;
};

export type ChatTriggerInput = {
  kind: "chat";
  message?: string | null;
  payload?: unknown;
  selectedObjectId?: string | null;
};

export type ScannerTriggerInput = {
  kind: "scanner";
  targetId?: string | null;
  payload?: unknown;
};

export type ManualTriggerInput = {
  kind: "manual";
  targetId?: string | null;
  actionType?: WarRoomActionKind | null;
  intensity?: number;
  context?: Record<string, unknown>;
};

export type UnifiedTriggerInput = ChatTriggerInput | ScannerTriggerInput | ManualTriggerInput;

export type RendererBridge = {
  setPropagationState: (next: PropagationState | null) => void;
  setDecisionPathState: (next: DecisionPathState | null) => void;
  setFocusTarget: (targetId: string | null) => void;
};

export type WarRoomController = {
  state: WarRoomState;
  session: WarRoomSessionState;
  overlaySummary: WarRoomOverlaySummary | null;
  intelligence: SystemIntelligenceResult | null;
  intelligenceLoading: boolean;
  intelligenceError: string | null;
  comparison: CompareResult | null;
  comparisonLoading: boolean;
  comparisonError: string | null;
  strategyGeneration: StrategyGenerationResult | null;
  recentMemory: RecentMemoryState;
  evolutionState: EvolutionState | null;
  evolutionLoading: boolean;
  scenarioTrigger: ScenarioActionContract | null;
  canRun: boolean;
  availableScenarios: Scenario[];
  openWarRoom: () => void;
  closeWarRoom: () => void;
  updateDraft: (patch: Partial<WarRoomDraftState>) => void;
  setSelectedObject: (nextId: string | null) => void;
  setActionKind: (nextKind: WarRoomActionKind | null) => void;
  setOutputMode: (nextMode: WarRoomOutputMode) => void;
  setTargets: (targetIds: string[]) => void;
  runScenario: (scenarioId?: string | null) => WarRoomRunResult | null;
  refreshScenario: () => WarRoomRunResult | null;
  stopScenario: () => void;
  clearScenario: () => void;
  setCompareScenarioA: (scenarioId: string | null) => void;
  setCompareScenarioB: (scenarioId: string | null) => void;
  setCompareFocusDimension: (dimension: CompareFocusDimension) => void;
  setCompareViewMode: (mode: CompareViewMode) => void;
  runCompare: () => Promise<CompareResult | null>;
  clearCompare: () => void;
  setStrategyGenerationMode: (mode: StrategyGenerationMode) => void;
  setStrategyPreferredFocus: (focus: StrategyPreferredFocus) => void;
  generateStrategies: () => Promise<StrategyGenerationResult | null>;
  clearStrategies: () => void;
  selectGeneratedStrategy: (strategyId: string | null) => void;
  runGeneratedStrategy: (strategyId?: string | null) => WarRoomRunResult | null;
  refreshEvolution: () => Promise<void>;
  runEvolutionLearningPass: () => Promise<void>;
  updateScenarioOutcome: (recordId: string, outcomeStatus: "unknown" | "positive" | "negative" | "mixed") => Promise<void>;
  updateFocus: (targetId: string | null) => void;
  switchMode: (mode: WarRoomMode) => void;
  applyOverlaySummary: (summary: WarRoomOverlaySummary | null, detail?: WarRoomOverlayDetail | null) => void;
};
