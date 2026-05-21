/** D9:10:3 — MVP executive interaction stability + production-safe UI runtime types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { MVPStrategicReadinessSnapshot } from "./enterpriseRuntimeFoundationTypes";
import type { ExecutiveOperationalReliabilitySnapshot } from "./operationalReliabilityTypes";

export type InteractionStabilityCategory =
  | "panel_stability"
  | "scene_stability"
  | "chat_stability"
  | "right_rail_stability"
  | "command_stability"
  | "selection_stability"
  | "transition_stability"
  | "unknown";

export type ExecutiveUIState = "unstable" | "monitored" | "stable" | "production_safe" | "mvp_ready";

export type InteractionReliabilityLevel =
  | "weak"
  | "moderate"
  | "reliable"
  | "stable"
  | "executive_grade";

export type InteractionStabilityObservation = {
  observationId: string;
  category: InteractionStabilityCategory;
  reliabilityLevel: InteractionReliabilityLevel;
  headline: string;
  monitored: boolean;
  generatedAt: number;
};

export type PanelRuntimeReliability = {
  panelStable: boolean;
  panelFlashDetected: boolean;
  panelOscillationDetected: boolean;
  rightRailViewStable: boolean;
  panelViewSignature: string;
};

export type SceneInteractionReliability = {
  sceneSignature: string;
  sceneContractValid: boolean;
  duplicateSceneReaction: boolean;
  reactionWithoutContract: boolean;
};

export type ChatInteractionReliability = {
  chatPipelineSignature: string;
  chatPipelineDeduped: boolean;
  duplicatePanelUpdateForSameInput: boolean;
  chatPanelSceneLoopRisk: boolean;
};

export type UIStabilitySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly InteractionStabilityCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type ProductionSafeUISummary = {
  operationalTrustState: string;
  foundationRuntimeState: string;
  panelState: string;
  sceneState: string;
  chatState: string;
  selectionState: string;
  rightRailState: string;
  primaryUIRisk: string;
};

export type ExecutiveInteractionStabilitySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  interactionStabilityId: string;
  uiState: ExecutiveUIState;
  reliabilityLevel: InteractionReliabilityLevel;
  summary: string;
  stabilitySignals: readonly string[];
  uiRisks: readonly string[];
  confidence: number;
  activeStabilityCategories: readonly InteractionStabilityCategory[];
  stabilityObservations: readonly InteractionStabilityObservation[];
  panelRuntimeReliability: PanelRuntimeReliability;
  sceneInteractionReliability: SceneInteractionReliability;
  chatInteractionReliability: ChatInteractionReliability;
  productionSafeUISummary: ProductionSafeUISummary;
  uiStabilitySignals: readonly UIStabilitySignal[];
};

export type ExecutiveInteractionStabilityHistoryEntry = {
  entryId: string;
  uiState: ExecutiveUIState;
  reliabilityLevel: InteractionReliabilityLevel;
  headline: string;
  generatedAt: number;
};

export type ExecutiveInteractionStabilityState = {
  stabilitySnapshots: readonly ExecutiveInteractionStabilitySnapshot[];
  interactionObservations: readonly InteractionStabilityObservation[];
  interactionHistory: readonly ExecutiveInteractionStabilityHistoryEntry[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastUIState: ExecutiveUIState | null;
};

export type SelectionInteractionSignal = {
  selectionContextPreserved: boolean;
  selectedObjectId: string | null;
  selectionLostDuringAnalysis: boolean;
};

export type CommandInteractionSignal = {
  commandInteractionStable: boolean;
  duplicateCommandReaction: boolean;
  transitionOscillation: boolean;
};

export type ExecutiveInteractionStabilityInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  mvpStrategicReadinessSnapshot?: MVPStrategicReadinessSnapshot | null;
  operationalReliabilitySnapshot?: ExecutiveOperationalReliabilitySnapshot | null;
  panelRuntimeReliability?: PanelRuntimeReliability | null;
  sceneInteractionReliability?: SceneInteractionReliability | null;
  chatInteractionReliability?: ChatInteractionReliability | null;
  selectionInteraction?: SelectionInteractionSignal | null;
  commandInteraction?: CommandInteractionSignal | null;
  operationalTopologyStressed?: boolean;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  cognitionConverged?: boolean;
  runtimeStable?: boolean;
  sessionHydrated?: boolean;
  now?: number;
};

export type ExecutiveInteractionStabilityResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: ExecutiveInteractionStabilitySnapshot | null;
  activeStabilityCategoryCount: number;
  storeSignature: string;
};
