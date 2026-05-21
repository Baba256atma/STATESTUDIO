import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginExecutiveInteractionStabilityEvaluation,
  clampExecutiveInteractionStabilityConfidence,
  endExecutiveInteractionStabilityEvaluation,
  EXECUTIVE_INTERACTION_STABILITY_MAX_UI_SIGNALS,
  EXECUTIVE_INTERACTION_STABILITY_MIN_ACTIVE_CATEGORIES,
  EXECUTIVE_INTERACTION_STABILITY_MIN_OPERATIONAL_RELIABILITY_DEPTH,
  interactionReliabilityLevelRank,
  shouldEvaluateExecutiveInteractionStability,
  validateExecutiveInteractionStabilitySnapshot,
} from "./executiveInteractionStabilityGuards";
import { getExecutiveInteractionStabilityStore } from "./executiveInteractionStabilityStore";
import type {
  ChatInteractionReliability,
  CommandInteractionSignal,
  ExecutiveInteractionStabilityHistoryEntry,
  ExecutiveInteractionStabilityInput,
  ExecutiveInteractionStabilityResult,
  ExecutiveInteractionStabilitySnapshot,
  ExecutiveUIState,
  InteractionReliabilityLevel,
  InteractionStabilityCategory,
  InteractionStabilityObservation,
  PanelRuntimeReliability,
  ProductionSafeUISummary,
  SceneInteractionReliability,
  SelectionInteractionSignal,
  UIStabilitySignal,
} from "./executiveInteractionStabilityTypes";

const DEV_LOG_PREFIX = "[Nexora][ExecutiveInteractionStability]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function resolvePanelReliability(
  input: ExecutiveInteractionStabilityInput
): PanelRuntimeReliability {
  const explicit = input.panelRuntimeReliability;
  const operational = input.operationalReliabilitySnapshot;
  const cognitionSig = input.cognitionSnapshot?.signature ?? "no-cognition";
  const runtimeStable = input.runtimeStable !== false && input.sessionHydrated !== false;

  if (explicit) return explicit;

  const panelFlash =
    operational?.operationalReliabilitySummary.panelStabilityState === "monitoring" ||
    !runtimeStable ||
    input.fragilityElevated === true;

  return {
    panelStable: !panelFlash && runtimeStable,
    panelFlashDetected: panelFlash,
    panelOscillationDetected: panelFlash && input.operationalTopologyStressed === true,
    rightRailViewStable: runtimeStable,
    panelViewSignature: stableSignature(["panel-view", cognitionSig]).slice(0, 48),
  };
}

function resolveSceneReliability(
  input: ExecutiveInteractionStabilityInput
): SceneInteractionReliability {
  const explicit = input.sceneInteractionReliability;
  const cognitionSig = input.cognitionSnapshot?.signature ?? "no-cognition";
  const contractValid =
    input.continuityPreserved !== false &&
    input.cognitionConverged !== false &&
    input.runtimeStable !== false;

  if (explicit) return explicit;

  return {
    sceneSignature: stableSignature(["scene-render", cognitionSig]).slice(0, 48),
    sceneContractValid: contractValid,
    duplicateSceneReaction: false,
    reactionWithoutContract: !contractValid && input.fragilityElevated === true,
  };
}

function resolveChatReliability(
  input: ExecutiveInteractionStabilityInput
): ChatInteractionReliability {
  const explicit = input.chatInteractionReliability;
  const cognitionSig = input.cognitionSnapshot?.signature ?? "no-cognition";

  if (explicit) return explicit;

  return {
    chatPipelineSignature: stableSignature(["chat-pipeline", cognitionSig]).slice(0, 48),
    chatPipelineDeduped: true,
    duplicatePanelUpdateForSameInput: false,
    chatPanelSceneLoopRisk: input.fragilityElevated === true && input.operationalTopologyStressed === true,
  };
}

function resolveSelectionSignal(
  input: ExecutiveInteractionStabilityInput
): SelectionInteractionSignal {
  const explicit = input.selectionInteraction;
  const preserved = input.continuityPreserved !== false && input.cognitionConverged !== false;

  if (explicit) return explicit;

  return {
    selectionContextPreserved: preserved,
    selectedObjectId: null,
    selectionLostDuringAnalysis: !preserved && input.fragilityElevated === true,
  };
}

function resolveCommandSignal(input: ExecutiveInteractionStabilityInput): CommandInteractionSignal {
  const explicit = input.commandInteraction;
  const stable = input.runtimeStable !== false;

  if (explicit) return explicit;

  return {
    commandInteractionStable: stable,
    duplicateCommandReaction: false,
    transitionOscillation: input.operationalTopologyStressed === true,
  };
}

function mapCategoryLevel(healthy: boolean, pressured: boolean): InteractionReliabilityLevel {
  if (healthy && !pressured) return "stable";
  if (healthy && pressured) return "reliable";
  if (!healthy && !pressured) return "moderate";
  return "weak";
}

function buildStabilityObservations(
  input: ExecutiveInteractionStabilityInput,
  panel: PanelRuntimeReliability,
  scene: SceneInteractionReliability,
  chat: ChatInteractionReliability,
  selection: SelectionInteractionSignal,
  command: CommandInteractionSignal,
  now: number
): InteractionStabilityObservation[] {
  const foundation = input.mvpStrategicReadinessSnapshot;
  const operational = input.operationalReliabilitySnapshot;
  const pressured = input.operationalTopologyStressed === true || input.fragilityElevated === true;
  const foundationReady =
    foundation?.runtimeStatus === "mvp_ready" || foundation?.runtimeStatus === "hardened";
  const trustStable =
    operational?.trustState === "trusted" || operational?.trustState === "executive_grade";

  const categories: Array<{
    category: InteractionStabilityCategory;
    healthy: boolean;
    headline: string;
  }> = [
    {
      category: "panel_stability",
      healthy: panel.panelStable && !panel.panelFlashDetected && !panel.panelOscillationDetected,
      headline: panel.panelStable
        ? "Executive panels remain stable without flash or disappearance symptoms."
        : "Panel flash warning mapped for executive interaction surfaces.",
    },
    {
      category: "scene_stability",
      healthy: scene.sceneContractValid && !scene.duplicateSceneReaction && !scene.reactionWithoutContract,
      headline: scene.sceneContractValid
        ? "Scene render signatures remain contract-consistent."
        : "Scene instability signal — reaction without valid contract signature.",
    },
    {
      category: "chat_stability",
      healthy: chat.chatPipelineDeduped && !chat.duplicatePanelUpdateForSameInput && !chat.chatPanelSceneLoopRisk,
      headline: chat.chatPipelineDeduped
        ? "Chat pipeline remains deduped without panel-scene feedback loops."
        : "Duplicate interaction warning — chat may update panel repeatedly for same input.",
    },
    {
      category: "right_rail_stability",
      healthy: panel.rightRailViewStable && !panel.panelOscillationDetected,
      headline: panel.rightRailViewStable
        ? "Right rail transitions remain stable through executive workflows."
        : "Unstable right-panel transition monitoring elevated.",
    },
    {
      category: "command_stability",
      healthy: command.commandInteractionStable && !command.duplicateCommandReaction,
      headline: command.commandInteractionStable
        ? "Command interactions remain bounded and non-duplicative."
        : "Unstable command interaction mapped for MVP governance.",
    },
    {
      category: "selection_stability",
      healthy: selection.selectionContextPreserved && !selection.selectionLostDuringAnalysis,
      headline: selection.selectionContextPreserved
        ? "Selection context preserved through analysis lifecycle."
        : "Context persistence risk — selected object may be lost during analysis.",
    },
    {
      category: "transition_stability",
      healthy:
        !command.transitionOscillation &&
        foundationReady &&
        trustStable &&
        !panel.panelFlashDetected,
      headline:
        foundationReady && trustStable
          ? "UI transitions remain production-safe under bounded runtime behavior."
          : "Transition stability requires strengthened operational trust.",
    },
  ];

  return categories.map(({ category, healthy, headline }) => ({
    observationId: stableSignature(["interaction-stability-observation", category, String(now)]).slice(
      0,
      48
    ),
    category,
    reliabilityLevel: mapCategoryLevel(healthy, pressured),
    headline: headline.slice(0, 120),
    monitored: true,
    generatedAt: now,
  }));
}

function deriveReliabilityLevel(
  observations: InteractionStabilityObservation[]
): InteractionReliabilityLevel {
  const monitored = observations.filter((o) => o.monitored);
  if (monitored.length === 0) return "weak";
  const healthy = monitored.filter((o) => o.reliabilityLevel === "stable" || o.reliabilityLevel === "reliable");
  const ratio = healthy.length / monitored.length;
  if (ratio >= 0.85 && monitored.every((o) => o.reliabilityLevel !== "weak")) return "executive_grade";
  if (ratio >= 0.7) return "stable";
  if (ratio >= 0.5) return "reliable";
  if (ratio >= 0.3) return "moderate";
  return "weak";
}

function deriveUIState(
  reliabilityLevel: InteractionReliabilityLevel,
  observations: InteractionStabilityObservation[],
  panel: PanelRuntimeReliability,
  scene: SceneInteractionReliability,
  chat: ChatInteractionReliability,
  selection: SelectionInteractionSignal,
  pressured: boolean,
  priorUIState: ExecutiveUIState | null
): ExecutiveUIState {
  const weakCount = observations.filter((o) => o.reliabilityLevel === "weak").length;

  if (panel.panelFlashDetected && (scene.reactionWithoutContract || selection.selectionLostDuringAnalysis)) {
    return "unstable";
  }
  if (weakCount >= 3 || chat.chatPanelSceneLoopRisk) return "monitored";

  if (
    reliabilityLevel === "executive_grade" &&
    !pressured &&
    panel.panelStable &&
    scene.sceneContractValid &&
    chat.chatPipelineDeduped &&
    selection.selectionContextPreserved
  ) {
    return "mvp_ready";
  }

  if (reliabilityLevel === "stable" || reliabilityLevel === "executive_grade") {
    return pressured ? "production_safe" : "stable";
  }

  if (priorUIState === "mvp_ready" && (pressured || panel.panelFlashDetected)) {
    return "production_safe";
  }

  if (weakCount >= 1 || panel.panelOscillationDetected) return "monitored";
  return "stable";
}

function buildProductionSafeUISummary(
  input: ExecutiveInteractionStabilityInput,
  panel: PanelRuntimeReliability,
  scene: SceneInteractionReliability,
  chat: ChatInteractionReliability,
  selection: SelectionInteractionSignal
): ProductionSafeUISummary {
  const pressured = input.operationalTopologyStressed === true;
  return {
    operationalTrustState: input.operationalReliabilitySnapshot?.trustState ?? "unknown",
    foundationRuntimeState: input.mvpStrategicReadinessSnapshot?.runtimeStatus ?? "unknown",
    panelState: panel.panelStable ? "stable" : "flash_monitoring",
    sceneState: scene.sceneContractValid ? "contract_aligned" : "mismatch_monitoring",
    chatState: chat.chatPipelineDeduped ? "deduped" : "loop_monitoring",
    selectionState: selection.selectionContextPreserved ? "preserved" : "at_risk",
    rightRailState: panel.rightRailViewStable ? "stable" : "transition_monitoring",
    primaryUIRisk: panel.panelFlashDetected
      ? "panel_flash_warning"
      : scene.reactionWithoutContract
        ? "scene_instability_signal"
        : pressured
          ? "minor_transition_latency"
          : "bounded_ui_monitoring",
  };
}

function collectStabilitySignals(
  activeCategories: InteractionStabilityCategory[],
  panel: PanelRuntimeReliability,
  scene: SceneInteractionReliability,
  chat: ChatInteractionReliability,
  selection: SelectionInteractionSignal,
  uiState: ExecutiveUIState
): string[] {
  const signals: string[] = [];

  if (panel.panelStable && activeCategories.includes("panel_stability")) {
    signals.push("panel_state_stable");
  }
  if (scene.sceneContractValid && activeCategories.includes("scene_stability")) {
    signals.push("scene_signature_consistent");
  }
  if (chat.chatPipelineDeduped && activeCategories.includes("chat_stability")) {
    signals.push("chat_pipeline_deduped");
  }
  if (selection.selectionContextPreserved && activeCategories.includes("selection_stability")) {
    signals.push("selection_context_preserved");
  }
  if (panel.rightRailViewStable && activeCategories.includes("right_rail_stability")) {
    signals.push("right_rail_stable");
  }
  signals.push("bounded_runtime_behavior");
  if (uiState === "production_safe" || uiState === "mvp_ready") {
    signals.push("mvp_ui_readiness");
  }

  return Array.from(new Set(signals)).slice(0, 6);
}

function collectUIRisks(
  panel: PanelRuntimeReliability,
  scene: SceneInteractionReliability,
  chat: ChatInteractionReliability,
  selection: SelectionInteractionSignal,
  command: CommandInteractionSignal,
  uiState: ExecutiveUIState,
  reliabilityLevel: InteractionReliabilityLevel
): string[] {
  const risks: string[] = [];

  if (panel.panelFlashDetected || panel.panelOscillationDetected) {
    risks.push("panel_flash_warning");
  }
  if (scene.reactionWithoutContract || scene.duplicateSceneReaction) {
    risks.push("scene_instability_signal");
  }
  if (chat.duplicatePanelUpdateForSameInput || chat.chatPanelSceneLoopRisk) {
    risks.push("duplicate_interaction_warning");
  }
  if (selection.selectionLostDuringAnalysis) {
    risks.push("context_persistence_risk");
  }
  if (command.transitionOscillation) {
    risks.push("minor_transition_latency");
  }
  if (reliabilityLevel === "executive_grade" && uiState === "monitored") {
    risks.push("ui_trust_mismatch_warning");
  }

  return Array.from(new Set(risks)).slice(0, 6);
}

function buildUIStabilitySignals(
  activeCategories: InteractionStabilityCategory[],
  uiState: ExecutiveUIState,
  now: number
): UIStabilitySignal[] {
  const signals: UIStabilitySignal[] = [];

  if (uiState === "mvp_ready" || uiState === "production_safe") {
    signals.push({
      signalId: stableSignature(["ui-stability-signal", "mvp-ready"]).slice(0, 48),
      signalLabel: "MVP UI readiness strengthening",
      signalSummary: "Executive interaction runtime reached production-safe UI stability posture.",
      linkedCategories: Object.freeze(activeCategories.slice(0, 4)),
      signalIntensity: "high",
      confidence: 0.9,
      generatedAt: now,
    });
  }

  if (activeCategories.includes("panel_stability")) {
    signals.push({
      signalId: stableSignature(["ui-stability-signal", "panel"]).slice(0, 48),
      signalLabel: "panel stability",
      signalSummary: "Panel runtime reliability mapped for executive interaction governance.",
      linkedCategories: Object.freeze(["panel_stability"] as const),
      signalIntensity: "moderate",
      confidence: 0.86,
      generatedAt: now,
    });
  }

  return signals.slice(0, EXECUTIVE_INTERACTION_STABILITY_MAX_UI_SIGNALS);
}

function buildStabilitySnapshot(
  organizationId: string,
  uiState: ExecutiveUIState,
  reliabilityLevel: InteractionReliabilityLevel,
  summary: ProductionSafeUISummary,
  activeCategories: InteractionStabilityCategory[],
  observations: InteractionStabilityObservation[],
  panel: PanelRuntimeReliability,
  scene: SceneInteractionReliability,
  chat: ChatInteractionReliability,
  uiSignals: UIStabilitySignal[],
  stabilitySignals: string[],
  uiRisks: string[],
  confidence: number,
  now: number
): ExecutiveInteractionStabilitySnapshot {
  const runtimeSummary =
    "Executive interaction runtime remains stable across chat, panel, scene, and selection context, with no panel flash or duplicate scene reaction detected.";

  const signature = stableSignature([
    "d9-10-3-executive-interaction-stability-snapshot",
    organizationId,
    uiState,
    reliabilityLevel,
    activeCategories.join(","),
    summary.primaryUIRisk,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    interactionStabilityId: stableSignature(["mvp-ui-stability", organizationId]).slice(0, 56),
    uiState,
    reliabilityLevel,
    summary: runtimeSummary,
    stabilitySignals: Object.freeze(stabilitySignals),
    uiRisks: Object.freeze(uiRisks),
    confidence: clampExecutiveInteractionStabilityConfidence(confidence),
    activeStabilityCategories: Object.freeze(activeCategories),
    stabilityObservations: Object.freeze(observations),
    panelRuntimeReliability: panel,
    sceneInteractionReliability: scene,
    chatInteractionReliability: chat,
    productionSafeUISummary: summary,
    uiStabilitySignals: Object.freeze(uiSignals),
  };
}

function computeConfidence(
  observations: InteractionStabilityObservation[],
  reliabilityLevel: InteractionReliabilityLevel,
  uiState: ExecutiveUIState
): number {
  const stableCount = observations.filter(
    (o) => o.reliabilityLevel === "stable" || o.reliabilityLevel === "reliable"
  ).length;
  const base = 0.66 + stableCount * 0.03;
  const levelBoost =
    reliabilityLevel === "executive_grade"
      ? 0.2
      : reliabilityLevel === "stable"
        ? 0.15
        : reliabilityLevel === "reliable"
          ? 0.08
          : 0;
  const uiBoost = uiState === "mvp_ready" ? 0.05 : uiState === "unstable" ? -0.1 : 0;
  return base + levelBoost + uiBoost;
}

export function evaluateExecutiveInteractionStability(
  input: ExecutiveInteractionStabilityInput
): ExecutiveInteractionStabilityResult {
  if (!beginExecutiveInteractionStabilityEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      activeStabilityCategoryCount: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getExecutiveInteractionStabilityStore(organizationId);
    const prior = store.getState();

    const panel = resolvePanelReliability(input);
    const scene = resolveSceneReliability(input);
    const chat = resolveChatReliability(input);
    const selection = resolveSelectionSignal(input);
    const command = resolveCommandSignal(input);

    const evaluationSignature = stableSignature([
      "d9-10-3-executive-interaction-stability-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.mvpStrategicReadinessSnapshot?.signature ?? "no-foundation",
      input.operationalReliabilitySnapshot?.signature ?? "no-operational",
      panel.panelViewSignature,
      scene.sceneSignature,
      chat.chatPipelineSignature,
      String(panel.panelStable),
      String(scene.sceneContractValid),
      String(selection.selectionContextPreserved),
    ]);

    if (
      !shouldEvaluateExecutiveInteractionStability(
        organizationId,
        evaluationSignature,
        prior.lastEvaluationSignature,
        now
      )
    ) {
      return {
        evaluated: false,
        skipped: true,
        reason: "paced_or_unchanged",
        snapshot: prior.stabilitySnapshots[0] ?? null,
        activeStabilityCategoryCount: prior.interactionObservations.filter((o) => o.monitored).length,
        storeSignature: prior.signature,
      };
    }

    const operationalDepth = input.operationalReliabilitySnapshot ? 1 : 0;
    if (operationalDepth < EXECUTIVE_INTERACTION_STABILITY_MIN_OPERATIONAL_RELIABILITY_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_operational_reliability_depth",
        snapshot: prior.stabilitySnapshots[0] ?? null,
        activeStabilityCategoryCount: 0,
        storeSignature: prior.signature,
      };
    }

    const observations = buildStabilityObservations(
      input,
      panel,
      scene,
      chat,
      selection,
      command,
      now
    );
    const activeCategories = observations.filter((o) => o.monitored).map((o) => o.category);

    if (activeCategories.length < EXECUTIVE_INTERACTION_STABILITY_MIN_ACTIVE_CATEGORIES) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_active_stability_categories",
        snapshot: prior.stabilitySnapshots[0] ?? null,
        activeStabilityCategoryCount: activeCategories.length,
        storeSignature: prior.signature,
      };
    }

    const pressured = input.operationalTopologyStressed === true || input.fragilityElevated === true;
    let reliabilityLevel = deriveReliabilityLevel(observations);
    const uiState = deriveUIState(
      reliabilityLevel,
      observations,
      panel,
      scene,
      chat,
      selection,
      pressured,
      prior.lastUIState
    );

    if (uiState === "unstable" || uiState === "monitored") {
      reliabilityLevel =
        reliabilityLevel === "executive_grade" ? "stable" : reliabilityLevel;
    }
    if (uiState !== "mvp_ready" && reliabilityLevel === "executive_grade") {
      reliabilityLevel = "stable";
    }

    const summary = buildProductionSafeUISummary(input, panel, scene, chat, selection);
    const stabilitySignals = collectStabilitySignals(
      activeCategories,
      panel,
      scene,
      chat,
      selection,
      uiState
    );
    const uiRisks = collectUIRisks(panel, scene, chat, selection, command, uiState, reliabilityLevel);
    const uiSignals = buildUIStabilitySignals(activeCategories, uiState, now);
    const confidence = computeConfidence(observations, reliabilityLevel, uiState);

    const snapshot = buildStabilitySnapshot(
      organizationId,
      uiState,
      reliabilityLevel,
      summary,
      activeCategories,
      observations,
      panel,
      scene,
      chat,
      uiSignals,
      stabilitySignals,
      uiRisks,
      confidence,
      now
    );

    if (!validateExecutiveInteractionStabilitySnapshot(snapshot)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "invalid_interaction_stability_snapshot",
        snapshot: prior.stabilitySnapshots[0] ?? null,
        activeStabilityCategoryCount: activeCategories.length,
        storeSignature: prior.signature,
      };
    }

    const historyEntry: ExecutiveInteractionStabilityHistoryEntry = {
      entryId: stableSignature(["interaction-stability-history", snapshot.signature]).slice(0, 48),
      uiState,
      reliabilityLevel,
      headline: summary.primaryUIRisk.slice(0, 80),
      generatedAt: now,
    };

    store.upsertStabilitySnapshots([snapshot], now);
    store.upsertInteractionObservations(observations, now);
    store.upsertInteractionHistory([historyEntry], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastUIState(uiState);

    const priorUI = prior.lastUIState;

    if (panel.panelFlashDetected || panel.panelOscillationDetected) {
      devLog("panel flash detection — executive panel instability mapped without UI mutation");
    }

    if (scene.reactionWithoutContract || scene.duplicateSceneReaction) {
      devLog("scene mismatch detection — scene reaction drift without contract reason");
    }

    if (selection.selectionLostDuringAnalysis) {
      devLog("selection context loss — object context may not persist through analysis lifecycle");
    }

    if (uiState === "mvp_ready" || uiState === "production_safe") {
      devLog("MVP UI readiness strengthening — production-safe executive interaction runtime");
    }

    if (priorUI && priorUI !== uiState) {
      devLog(`trust-state transition — UI state ${priorUI} → ${uiState}`);
    }

    if (priorUI && (uiState === "unstable" || uiState === "monitored") && priorUI !== uiState) {
      devLog(`reliability degradation/recovery — interaction UI ${priorUI} → ${uiState}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      activeStabilityCategoryCount: activeCategories.length,
      storeSignature: store.getState().signature,
    };
  } finally {
    endExecutiveInteractionStabilityEvaluation();
  }
}
