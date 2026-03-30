import type { SceneJson } from "../sceneTypes";
import type { NexoraIntentRoute } from "../router/intentRouterTypes";
import { traceHighlightFlow } from "../debug/highlightDebugTrace";
import { resolveUnifiedReactionPolicy } from "../reactions/reactionPolicy";
import { hasForcedSceneUpdate, normalizeUnifiedSceneReaction } from "../scene/unifiedReaction";
import type {
  NexoraExecutionInput,
  NexoraExecutionResult,
  NexoraExecutionStep,
} from "./actionExecutionTypes";

type HighlightSelectionPayload = {
  object_selection?: {
    highlighted_objects?: unknown[];
  } | null;
  scene_json?: {
    object_selection?: {
      highlighted_objects?: unknown[];
    } | null;
  } | null;
  context?: {
    object_selection?: {
      highlighted_objects?: unknown[];
    } | null;
  } | null;
  highlightedObjectIds?: unknown[];
  suggested_objects?: unknown[];
};

type PrimaryExecutionPayload = {
  reply?: string | null;
  risk_propagation?: {
    sources?: unknown[];
    targets?: unknown[];
  } | null;
  loop_analysis?: {
    active_loop_id?: string | null;
    suggestions?: unknown[];
  } | null;
  active_loop_id?: string | null;
  loop_suggestions?: unknown[];
  actions?: unknown[];
  scene_json?: SceneJson | null;
};

type MessageLikeError = {
  message?: string;
};

function createBaseExecutionResult(input: NexoraExecutionInput): NexoraExecutionResult {
  return {
    ok: true,
    executedSteps: [],
    skippedSteps: [],
    warnings: [],
    errors: [],
    routeIntent: input.route.intent,
    routeTarget: input.route.target,
    executionSummary: input.route.explanation,
    preferredPanel: input.route.preferredPanel ?? null,
    preferredInspectorTab: input.route.preferredInspectorTab ?? null,
    shouldOpenPanel: !!input.route.preferredPanel && input.route.shouldAffectPanels,
    shouldUpdateInspector: !!input.route.preferredInspectorTab,
    chatReply: null,
    backendPayload: null,
    scannerPayload: null,
    simulationPayload: null,
    advicePayload: null,
    localDecisionPayload: null,
    highlightedObjectIds: [],
    focusedObjectId: input.route.primaryObjectId ?? input.route.matchedObjectIds[0] ?? input.selectedObjectId ?? null,
    allowSceneMutation: input.route.sceneMutation !== "none",
    appliedSceneMutation: "none",
    scenePatch: null,
    sceneReplacement: null,
    panelUpdates: {
      preferredPanel: input.route.preferredPanel ?? null,
      preferredInspectorTab: input.route.preferredInspectorTab ?? null,
    },
    objectProfileUpdates: {},
    unifiedReaction: null,
  };
}

function markStep(result: NexoraExecutionResult, step: NexoraExecutionStep, executed: boolean): void {
  if (executed) {
    result.executedSteps.push(step);
  } else {
    result.skippedSteps.push(step);
  }
}

function extractHighlightedObjectIds(payload: HighlightSelectionPayload | null | undefined): string[] {
  const ids = Array.isArray(payload?.object_selection?.highlighted_objects)
    ? payload.object_selection.highlighted_objects
    : Array.isArray(payload?.scene_json?.object_selection?.highlighted_objects)
    ? payload.scene_json.object_selection.highlighted_objects
    : Array.isArray(payload?.context?.object_selection?.highlighted_objects)
    ? payload.context.object_selection.highlighted_objects
    : Array.isArray(payload?.highlightedObjectIds)
    ? payload.highlightedObjectIds
    : Array.isArray(payload?.suggested_objects)
    ? payload.suggested_objects
    : [];
  return ids.map(String).filter(Boolean);
}

function pickPrimaryPayload(result: NexoraExecutionResult): PrimaryExecutionPayload | null {
  return (result.backendPayload ??
    result.scannerPayload ??
    result.simulationPayload ??
    result.advicePayload ??
    null) as PrimaryExecutionPayload | null;
}

function deriveUnifiedReactionPayload(
  payload: PrimaryExecutionPayload | null,
  route: NexoraIntentRoute,
  highlightedObjectIds: string[]
) {
  if (!route.shouldAffectScene) return null;
  return normalizeUnifiedSceneReaction(resolveUnifiedReactionPolicy({
    source: route.target === "scanner" ? "scanner" : "chat",
    reason: route.explanation,
    highlightedObjectIds,
    riskSources: Array.isArray(payload?.risk_propagation?.sources) ? payload.risk_propagation.sources.map(String) : [],
    riskTargets: Array.isArray(payload?.risk_propagation?.targets) ? payload.risk_propagation.targets.map(String) : [],
    reactionModeHint:
      route.intent === "fragility_scan"
        ? "risk"
        : route.intent === "simulation_run"
        ? "propagation"
        : route.intent === "strategy_advice"
        ? "decision"
        : route.intent === "object_focus"
        ? "focus"
        : null,
    activeLoopId: payload?.loop_analysis?.active_loop_id ?? payload?.active_loop_id ?? null,
    loopSuggestions: Array.isArray(payload?.loop_analysis?.suggestions)
      ? payload.loop_analysis.suggestions
      : Array.isArray(payload?.loop_suggestions)
      ? payload.loop_suggestions
      : [],
    actions: route.sceneMutation === "full_update" && Array.isArray(payload?.actions) ? payload.actions : [],
    allowFocusMutation: route.sceneMutation !== "none",
    sceneJson: null,
  }));
}

function enforceSceneMutationPolicy(
  result: NexoraExecutionResult,
  route: NexoraIntentRoute,
  payload: PrimaryExecutionPayload | null,
  currentScene: SceneJson | null
): void {
  if (route.sceneMutation === "none") {
    result.appliedSceneMutation = "none";
    result.sceneReplacement = null;
    result.scenePatch = null;
    markStep(result, "scene_effect", false);
    return;
  }

  const highlightedObjectIds = result.highlightedObjectIds;
  if (route.sceneMutation === "highlight_only") {
    result.appliedSceneMutation = highlightedObjectIds.length > 0 ? "highlight_only" : "none";
    result.scenePatch = highlightedObjectIds.length > 0 ? { highlightedObjectIds } : null;
    markStep(result, "scene_effect", highlightedObjectIds.length > 0);
    return;
  }

  if (route.sceneMutation === "soft_reaction") {
    result.appliedSceneMutation =
      highlightedObjectIds.length > 0 || Array.isArray(payload?.actions) ? "soft_reaction" : "none";
    result.scenePatch =
      highlightedObjectIds.length > 0 || Array.isArray(payload?.actions)
        ? {
            highlightedObjectIds,
            actions: Array.isArray(payload?.actions) ? payload.actions : [],
          }
        : null;
    markStep(result, "scene_effect", !!result.scenePatch);
    return;
  }

  if (route.sceneMutation === "full_update") {
    const nextScene =
      payload?.scene_json && typeof payload.scene_json === "object"
        ? (payload.scene_json as SceneJson)
        : currentScene ?? null;
    const allowForcedSceneReplacement = !!payload?.scene_json && hasForcedSceneUpdate(payload, nextScene);
    result.appliedSceneMutation = allowForcedSceneReplacement
      ? "full_update"
      : highlightedObjectIds.length > 0
      ? "soft_reaction"
      : "none";
    result.sceneReplacement = allowForcedSceneReplacement ? nextScene : null;
    result.scenePatch = !allowForcedSceneReplacement && highlightedObjectIds.length > 0 ? { highlightedObjectIds } : null;
    markStep(result, "scene_effect", !!result.sceneReplacement || !!result.scenePatch);
  }
}

export async function executeNexoraAction(input: NexoraExecutionInput): Promise<NexoraExecutionResult> {
  const result = createBaseExecutionResult(input);
  const initialHighlightedObjectIds = [...result.highlightedObjectIds];

  markStep(result, "open_panel", result.shouldOpenPanel);
  markStep(result, "open_inspector_tab", result.shouldUpdateInspector);

  if (result.focusedObjectId) {
    result.highlightedObjectIds = input.route.shouldAffectScene ? [result.focusedObjectId] : [];
    markStep(result, "object_focus", true);
  } else {
    markStep(result, "object_focus", false);
  }

  if (input.handlers.runLocalDecisionRouter) {
    try {
      const localDecisionPayload = await input.handlers.runLocalDecisionRouter(input.userText);
      const hasActions = Array.isArray(localDecisionPayload?.actions) && localDecisionPayload.actions.length > 0;
      if (hasActions) {
        result.localDecisionPayload = localDecisionPayload;
        result.chatReply =
          typeof localDecisionPayload?.assistantReply === "string" ? localDecisionPayload.assistantReply : null;
        markStep(result, "local_decision", true);
      } else {
        markStep(result, "local_decision", false);
      }
    } catch (error: unknown) {
      result.warnings.push((error as MessageLikeError | null)?.message ?? "Local decision router failed.");
      markStep(result, "local_decision", false);
    }
  } else {
    markStep(result, "local_decision", false);
  }

  if (!result.localDecisionPayload && input.route.shouldRunScanner && input.handlers.runScanner) {
    try {
      result.scannerPayload = await input.handlers.runScanner(input.userText, input.currentScene);
      markStep(result, "scanner", true);
    } catch (error: unknown) {
      result.warnings.push((error as MessageLikeError | null)?.message ?? "Scanner execution failed.");
      markStep(result, "scanner", false);
    }
  } else {
    markStep(result, "scanner", false);
  }

  if (!result.localDecisionPayload && input.route.shouldRunSimulation && input.handlers.runSimulation) {
    try {
      result.simulationPayload = await input.handlers.runSimulation(input.userText, input.currentScene);
      markStep(result, "simulation", true);
    } catch (error: unknown) {
      result.warnings.push((error as MessageLikeError | null)?.message ?? "Simulation execution failed.");
      markStep(result, "simulation", false);
    }
  } else {
    markStep(result, "simulation", false);
  }

  if (!result.localDecisionPayload && input.route.shouldGenerateAdvice && input.handlers.generateAdvice) {
    try {
      result.advicePayload = await input.handlers.generateAdvice({
        text: input.userText,
        route: input.route,
        currentScene: input.currentScene,
      });
      markStep(result, "strategy", true);
    } catch (error: unknown) {
      result.warnings.push((error as MessageLikeError | null)?.message ?? "Advice generation failed.");
      markStep(result, "strategy", false);
    }
  } else {
    markStep(result, "strategy", false);
  }

  if (!result.localDecisionPayload && input.route.shouldCallBackend && input.handlers.runBackendChat) {
    try {
      result.backendPayload = await input.handlers.runBackendChat(input.userText);
      markStep(result, "backend_chat", true);
    } catch (error: unknown) {
      result.errors.push((error as MessageLikeError | null)?.message ?? "Backend chat execution failed.");
      result.ok = false;
      markStep(result, "backend_chat", false);
    }
  } else {
    markStep(result, "backend_chat", false);
  }

  const primaryPayload = pickPrimaryPayload(result);
  if (!result.chatReply) {
    result.chatReply =
      typeof primaryPayload?.reply === "string"
        ? primaryPayload.reply
        : !input.route.shouldCallBackend
        ? input.route.explanation
        : null;
  }

  const payloadHighlights = extractHighlightedObjectIds(primaryPayload);
  if (payloadHighlights.length > 0) {
    result.highlightedObjectIds = payloadHighlights;
  }
  result.focusedObjectId = result.highlightedObjectIds[0] ?? result.focusedObjectId ?? null;
  result.unifiedReaction = deriveUnifiedReactionPayload(primaryPayload, input.route, result.highlightedObjectIds);
  enforceSceneMutationPolicy(result, input.route, primaryPayload, input.currentScene);
  markStep(result, "panel_effect", result.shouldOpenPanel || result.shouldUpdateInspector);
  markStep(result, "finalize", true);
  result.executionSummary = `${input.route.intent} -> ${result.executedSteps.join(", ") || "no-op"}`;

  traceHighlightFlow("execution", {
    routeIntent: input.route.intent,
    routeTarget: input.route.target,
    routeSceneMutation: input.route.sceneMutation,
    routeShouldAffectScene: input.route.shouldAffectScene,
    incomingHighlightedObjectIds: initialHighlightedObjectIds,
    outgoingHighlightedObjectIds: result.highlightedObjectIds,
    focusedObjectId: result.focusedObjectId ?? null,
    allowSceneMutation: result.allowSceneMutation,
    appliedSceneMutation: result.appliedSceneMutation,
    hasSceneReplacement: !!result.sceneReplacement,
    hasScenePatch: !!result.scenePatch,
    panelUpdateKeys: Object.keys(result.panelUpdates ?? {}),
    unifiedReaction: result.unifiedReaction
      ? {
          highlightedObjectIds: result.unifiedReaction.highlightedObjectIds ?? [],
          dimUnrelatedObjects: result.unifiedReaction.dimUnrelatedObjects ?? false,
          riskSources: result.unifiedReaction.riskSources ?? [],
          riskTargets: result.unifiedReaction.riskTargets ?? [],
        }
      : null,
    warnings: result.warnings,
    errors: result.errors,
  });

  return result;
}
