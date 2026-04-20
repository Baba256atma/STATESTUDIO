import {
  clampConfidence,
  includesAnyKeyword,
  normalizeRouterText,
  scoreKeywordHits,
} from "./intentRouterRules";
import { traceHighlightFlow } from "../debug/highlightDebugTrace";
import { resolveIntentResolutionV2 } from "./intentResolution";
import type {
  IntentKind,
  NexoraIntentRoute,
  NexoraIntentRouterInput,
  NexoraRoutePanelTab,
  RouteTarget,
  SceneMutationPolicy,
  UIMutationPolicy,
} from "./intentRouterTypes";

const FRAGILITY_KEYWORDS = [
  "scan",
  "scanner",
  "fragility",
  "risk",
  "pressure",
  "weakness",
  "analyze system weakness",
  "where is pressure",
];

const SIMULATION_KEYWORDS = [
  "what if",
  "simulate",
  "simulation",
  "scenario",
  "run a scenario",
  "if supplier delays",
];

const STRATEGY_KEYWORDS = [
  "what should we do",
  "recommend",
  "best action",
  "strategic advice",
  "next move",
  "strategy",
];

const TIMELINE_KEYWORDS = ["timeline", "sequence", "follow up", "near term"];
const CONFLICT_KEYWORDS = ["conflict", "tradeoff", "trade off", "tension"];
const REPLAY_KEYWORDS = ["replay", "playback", "reconstruct"];
const EXECUTIVE_KEYWORDS = ["executive summary", "dashboard", "brief", "summary"];
const WORKSPACE_KEYWORDS = ["workspace", "project", "import", "export", "save", "load"];
const OBJECT_FOCUS_KEYWORDS = ["focus on", "highlight", "show", "inspect", "node"];
const SCENE_FOCUS_KEYWORDS = ["scene", "system", "map", "show scene"];
const GREETING_KEYWORDS = ["hello", "hi", "hey", "thanks", "thank you"];
const EXPLICIT_COMMAND_PREFIXES = ["show", "open", "focus", "highlight", "scan", "simulate", "run", "analyze"];

type ScoredIntent = {
  intent: IntentKind;
  score: number;
  matchedKeywords: string[];
};

function getModeBonus(domainMode: string, intent: IntentKind): number {
  if (!domainMode) return 0;
  if (intent === "fragility_scan" && (domainMode.includes("fragility") || domainMode.includes("scanner"))) {
    return 0.22;
  }
  if (intent === "simulation_run" && (domainMode.includes("scenario") || domainMode.includes("studio"))) {
    return 0.22;
  }
  if (
    (intent === "strategy_advice" || intent === "conflict_view" || intent === "replay_view") &&
    domainMode.includes("war room")
  ) {
    return 0.18;
  }
  if (intent === "strategy_advice" && domainMode.includes("strategy")) {
    return 0.2;
  }
  return 0;
}

function isExplicitCommand(text: string): boolean {
  const normalized = normalizeRouterText(text);
  return EXPLICIT_COMMAND_PREFIXES.some((keyword) => normalized.startsWith(`${keyword} `) || normalized === keyword);
}

function inferSceneMutation(intent: IntentKind, confidence: number): SceneMutationPolicy {
  if (
    intent === "timeline_view" ||
    intent === "conflict_view" ||
    intent === "replay_view" ||
    intent === "executive_summary" ||
    intent === "workspace_action"
  ) {
    return "none";
  }
  if (confidence < 0.45) return "none";
  if (confidence < 0.7) return "highlight_only";
  if (confidence < 0.85) return "soft_reaction";
  if (intent === "simulation_run" || intent === "fragility_scan") return "full_update";
  return "soft_reaction";
}

function inferUIPolicy(intent: IntentKind, sceneMutation: SceneMutationPolicy): UIMutationPolicy {
  if (intent === "timeline_view" || intent === "conflict_view" || intent === "replay_view" || intent === "executive_summary") {
    return "panel_only";
  }
  if (intent === "workspace_action") return "analysis_only";
  if (intent === "chat_general" || intent === "unknown") return "chat_only";
  if (sceneMutation === "none") return "panel_only";
  if (sceneMutation === "highlight_only") return "scene_and_panel";
  return "scene_and_panel";
}

function inferTarget(intent: IntentKind): RouteTarget {
  switch (intent) {
    case "fragility_scan":
      return "scanner";
    case "simulation_run":
      return "simulation";
    case "strategy_advice":
      return "strategy";
    case "timeline_view":
      return "timeline";
    case "conflict_view":
      return "conflict";
    case "replay_view":
      return "replay";
    case "workspace_action":
      return "workspace";
    case "object_focus":
    case "scene_focus":
      return "scene";
    case "executive_summary":
      return "inspector";
    default:
      return "chat";
  }
}

function inferPreferredPanel(intent: IntentKind): NexoraRoutePanelTab | null {
  switch (intent) {
    case "fragility_scan":
      return "fragility";
    case "simulation_run":
      return "simulate";
    case "strategy_advice":
      return "advice";
    case "timeline_view":
      return "timeline";
    case "conflict_view":
      return "conflict";
    case "replay_view":
      return "replay";
    case "executive_summary":
      return "dashboard";
    case "workspace_action":
      return "workspace";
    case "object_focus":
      return "object";
    case "scene_focus":
      return "workspace";
    default:
      return null;
  }
}

function pickHighestIntent(scored: ScoredIntent[]): ScoredIntent {
  return scored.sort((a, b) => b.score - a.score)[0] ?? { intent: "unknown", score: 0, matchedKeywords: [] };
}

export function resolveNexoraIntentRoute(input: NexoraIntentRouterInput): NexoraIntentRoute {
  const text = String(input.text || "");
  const normalizedText = normalizeRouterText(text);
  const domainMode = normalizeRouterText(
    `${input.activeMode ?? ""} ${input.activeDomain ?? ""} ${String(input.productModeContext?.mode_id ?? "")}`
  );
  const resolution = resolveIntentResolutionV2({
    text,
    sceneJson: input.sceneJson,
    availableSceneObjectIds: input.availableSceneObjectIds ?? [],
    selectedObjectId: input.selectedObjectId ?? null,
  });
  const matchedObjectIds = resolution.matched_object_ids.slice(0, 4);
  const explicitCommandBonus = isExplicitCommand(text) ? 0.1 : 0;
  const objectBonus = matchedObjectIds.length > 0 ? 0.08 + resolution.confidence * 0.16 : 0;

  const fragility = scoreKeywordHits(text, FRAGILITY_KEYWORDS);
  const simulation = scoreKeywordHits(text, SIMULATION_KEYWORDS);
  const strategy = scoreKeywordHits(text, STRATEGY_KEYWORDS);
  const timeline = scoreKeywordHits(text, TIMELINE_KEYWORDS);
  const conflict = scoreKeywordHits(text, CONFLICT_KEYWORDS);
  const replay = scoreKeywordHits(text, REPLAY_KEYWORDS);
  const executive = scoreKeywordHits(text, EXECUTIVE_KEYWORDS);
  const workspace = scoreKeywordHits(text, WORKSPACE_KEYWORDS);
  const objectFocus = scoreKeywordHits(text, OBJECT_FOCUS_KEYWORDS);
  const sceneFocus = scoreKeywordHits(text, SCENE_FOCUS_KEYWORDS);
  const greetings = resolution.intent === "greeting" ? GREETING_KEYWORDS.filter(Boolean).slice(0, 1) : includesAnyKeyword(text, GREETING_KEYWORDS);

  const scored: ScoredIntent[] = [
    {
      intent: "fragility_scan",
      score: fragility.score + getModeBonus(domainMode, "fragility_scan") + explicitCommandBonus + objectBonus * 0.4,
      matchedKeywords: fragility.matched,
    },
    {
      intent: "simulation_run",
      score: simulation.score + getModeBonus(domainMode, "simulation_run") + explicitCommandBonus,
      matchedKeywords: simulation.matched,
    },
    {
      intent: "strategy_advice",
      score: strategy.score + getModeBonus(domainMode, "strategy_advice") + explicitCommandBonus * 0.7,
      matchedKeywords: strategy.matched,
    },
    {
      intent: "timeline_view",
      score: timeline.score + explicitCommandBonus * 0.8,
      matchedKeywords: timeline.matched,
    },
    {
      intent: "conflict_view",
      score: conflict.score + getModeBonus(domainMode, "conflict_view") + explicitCommandBonus * 0.8,
      matchedKeywords: conflict.matched,
    },
    {
      intent: "replay_view",
      score: replay.score + getModeBonus(domainMode, "replay_view") + explicitCommandBonus * 0.8,
      matchedKeywords: replay.matched,
    },
    {
      intent: "executive_summary",
      score: executive.score + explicitCommandBonus * 0.6,
      matchedKeywords: executive.matched,
    },
    {
      intent: "workspace_action",
      score: workspace.score + explicitCommandBonus * 0.5,
      matchedKeywords: workspace.matched,
    },
    {
      intent: "object_focus",
      score:
        (resolution.primary_object_id ? 0.28 : matchedObjectIds.length > 0 ? 0.2 : 0) +
        objectBonus +
        objectFocus.score +
        resolution.confidence * 0.18 +
        (normalizedText.startsWith("focus on") || normalizedText.startsWith("highlight") ? 0.14 : 0),
      matchedKeywords: [...objectFocus.matched, ...matchedObjectIds.map((id) => normalizeRouterText(id))],
    },
    {
      intent: "scene_focus",
      score: sceneFocus.score + (matchedObjectIds.length > 1 ? 0.08 : 0),
      matchedKeywords: sceneFocus.matched,
    },
  ];

  let topIntent = pickHighestIntent(scored);
  if (resolution.intent === "greeting" || (greetings.length > 0 && topIntent.score < 0.35)) {
    topIntent = { intent: "chat_general", score: 0.42, matchedKeywords: greetings };
  } else if (resolution.primary_object_id && resolution.confidence >= 0.6 && topIntent.score < 0.34) {
    topIntent = {
      intent: "object_focus",
      score: Math.max(0.48, resolution.confidence),
      matchedKeywords: [...topIntent.matchedKeywords, resolution.primary_object_id],
    };
  } else if (topIntent.score < 0.25) {
    topIntent = { intent: "unknown", score: 0.18, matchedKeywords: [] };
  }

  const confidence = clampConfidence(topIntent.score);
  const sceneMutation = inferSceneMutation(topIntent.intent, confidence);
  const uiMutation = inferUIPolicy(topIntent.intent, sceneMutation);
  const preferredPanel = inferPreferredPanel(topIntent.intent);
  const preferredInspectorTab =
    topIntent.intent === "timeline_view" ||
    topIntent.intent === "conflict_view" ||
    topIntent.intent === "replay_view" ||
    topIntent.intent === "executive_summary"
      ? preferredPanel
      : null;

  const shouldCallBackend =
    topIntent.intent !== "timeline_view" &&
    topIntent.intent !== "conflict_view" &&
    topIntent.intent !== "replay_view" &&
    topIntent.intent !== "executive_summary";

  const shouldRunScanner = topIntent.intent === "fragility_scan" && confidence >= 0.45;
  const shouldRunSimulation = topIntent.intent === "simulation_run" && confidence >= 0.45;
  const shouldGenerateAdvice =
    topIntent.intent === "strategy_advice" || topIntent.intent === "executive_summary";
  const shouldAffectScene = sceneMutation !== "none";
  const shouldAffectPanels = uiMutation === "panel_only" || uiMutation === "scene_and_panel";

  const explanationBase =
    topIntent.intent === "unknown"
      ? "Keeping this in chat mode because the intent is low-confidence."
      : `Routing to ${topIntent.intent} for ${input.activeDomain ?? input.activeMode ?? "default"} mode.`;
  const explanationKeywords = topIntent.matchedKeywords.length
    ? ` Matched: ${topIntent.matchedKeywords.join(", ")}.`
    : matchedObjectIds.length
    ? ` Matched objects: ${matchedObjectIds.join(", ")}.`
    : "";

  const routeResult: NexoraIntentRoute = {
    intent: topIntent.intent,
    confidence,
    primaryObjectId: resolution.primary_object_id,
    target: inferTarget(topIntent.intent),
    uiMutation,
    sceneMutation,
    preferredPanel,
    preferredInspectorTab,
    shouldCallBackend,
    shouldRunScanner,
    shouldRunSimulation,
    shouldGenerateAdvice,
    shouldAffectScene,
    shouldAffectPanels,
    matchedObjectIds,
    matchedKeywords: topIntent.matchedKeywords,
    method: resolution.method,
    reason: resolution.reason,
    fallbackUsed: resolution.fallback_used,
    domainMode: domainMode || "general",
    explanation: `${explanationBase}${explanationKeywords}${resolution.reason ? ` ${resolution.reason}` : ""}`.trim(),
  };

  traceHighlightFlow("router", {
    text,
    activeMode: input.activeMode ?? null,
    activeDomain: input.activeDomain ?? null,
    intent: routeResult.intent,
    confidence: routeResult.confidence,
    target: routeResult.target,
    uiMutation: routeResult.uiMutation,
    sceneMutation: routeResult.sceneMutation,
    shouldAffectScene: routeResult.shouldAffectScene,
    preferredPanel: routeResult.preferredPanel ?? null,
    matchedObjectIds: routeResult.matchedObjectIds,
    primaryObjectId: routeResult.primaryObjectId,
    method: routeResult.method,
    fallbackUsed: routeResult.fallbackUsed,
    matchedKeywords: routeResult.matchedKeywords,
    availableSceneObjectIds: (input.availableSceneObjectIds ?? []).slice(0, 12),
  });

  return routeResult;
}
