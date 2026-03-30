import { getSceneObjectsFromPayload, matchObjectsFromPrompt, tokenizeSemanticText } from "../objectSemantics";
import type { SceneJson } from "../sceneTypes";
import { clampConfidence, matchSceneObjectIdsFromText, normalizeRouterText } from "./intentRouterRules";

export type IntentResolutionResult = {
  intent: "greeting" | "object_focus" | "multi_object_focus" | "selected_fallback" | "general";
  matched_object_ids: string[];
  primary_object_id: string | null;
  confidence: number;
  method: "greeting_guard" | "scene_semantic" | "scene_id_match" | "selected_context" | "none";
  reason: string;
  fallback_used: boolean;
};

type ResolveIntentResolutionInput = {
  text: string;
  sceneJson?: SceneJson | null;
  availableSceneObjectIds: string[];
  selectedObjectId?: string | null;
};

const GREETING_TERMS = new Set(["hello", "hi", "hey", "thanks", "thank", "yo"]);
const VAGUE_TERMS = new Set([
  "this",
  "that",
  "it",
  "here",
  "there",
  "selected",
  "focus",
  "object",
  "node",
  "explain",
  "inspect",
  "show",
  "tell",
  "about",
  "details",
]);
const DIRECT_OBJECT_HINTS = new Set(["inventory", "delivery", "delay", "warehouse", "price", "cash", "risk", "capacity", "supplier"]);

function isGreetingPrompt(normalizedText: string, tokens: string[]): boolean {
  if (!normalizedText) return false;
  if (tokens.length > 5) return false;
  return tokens.some((token) => GREETING_TERMS.has(token));
}

function isVaguePrompt(tokens: string[]): boolean {
  if (!tokens.length) return true;
  const meaningfulTokens = tokens.filter((token) => !VAGUE_TERMS.has(token));
  return meaningfulTokens.length === 0;
}

function hasDirectObjectLanguage(tokens: string[]): boolean {
  return tokens.some((token) => DIRECT_OBJECT_HINTS.has(token));
}

export function resolveIntentResolutionV2(input: ResolveIntentResolutionInput): IntentResolutionResult {
  const normalizedText = normalizeRouterText(input.text);
  const tokens = tokenizeSemanticText(normalizedText);

  if (isGreetingPrompt(normalizedText, tokens)) {
    return {
      intent: "greeting",
      matched_object_ids: [],
      primary_object_id: null,
      confidence: 0.14,
      method: "greeting_guard",
      reason: "Greeting-style input detected; suppressing object focus.",
      fallback_used: false,
    };
  }

  const sceneObjects = getSceneObjectsFromPayload({ scene_json: input.sceneJson }, input.sceneJson ?? null);
  const semanticMatches = matchObjectsFromPrompt(input.text, sceneObjects, 5);
  const directIdMatches = matchSceneObjectIdsFromText(input.text, input.availableSceneObjectIds ?? []).slice(0, 5);
  const scoreById = new Map<string, number>();

  for (const match of semanticMatches) {
    scoreById.set(match.id, Math.max(scoreById.get(match.id) ?? 0, match.score / 10));
  }
  for (const objectId of directIdMatches) {
    scoreById.set(objectId, Math.max(scoreById.get(objectId) ?? 0, 0.82));
  }

  const rankedMatches = [...scoreById.entries()]
    .sort((a, b) => (b[1] !== a[1] ? b[1] - a[1] : a[0].localeCompare(b[0])))
    .map(([id, score]) => ({ id, score }));

  const topMatch = rankedMatches[0] ?? null;
  const vaguePrompt = isVaguePrompt(tokens);
  const selectedObjectId = typeof input.selectedObjectId === "string" && input.selectedObjectId.trim().length > 0
    ? input.selectedObjectId.trim()
    : null;

  let primaryObjectId = topMatch?.id ?? null;
  let method: IntentResolutionResult["method"] = topMatch
    ? directIdMatches.includes(topMatch.id)
      ? "scene_id_match"
      : "scene_semantic"
    : "none";
  let fallbackUsed = false;

  if (selectedObjectId) {
    const topScore = topMatch?.score ?? 0;
    const selectedShouldWin =
      vaguePrompt ||
      (!hasDirectObjectLanguage(tokens) && topScore < 0.64) ||
      (!topMatch && tokens.length <= 4);
    if (selectedShouldWin) {
      primaryObjectId = selectedObjectId;
      method = "selected_context";
      fallbackUsed = true;
      if (!scoreById.has(selectedObjectId)) {
        scoreById.set(selectedObjectId, 0.56);
      }
    }
  }

  const matchedObjectIds = [...scoreById.entries()]
    .sort((a, b) => (b[1] !== a[1] ? b[1] - a[1] : a[0].localeCompare(b[0])))
    .map(([id]) => id)
    .filter((id, index, list) => list.indexOf(id) === index)
    .slice(0, 4);

  const confidence = clampConfidence(
    primaryObjectId
      ? Math.max(scoreById.get(primaryObjectId) ?? 0, fallbackUsed ? 0.56 : 0.42)
      : tokens.length === 0
      ? 0
      : 0.18
  );

  const result: IntentResolutionResult = {
    intent:
      primaryObjectId && matchedObjectIds.length > 1
        ? "multi_object_focus"
        : primaryObjectId && fallbackUsed
        ? "selected_fallback"
        : primaryObjectId
        ? "object_focus"
        : "general",
    matched_object_ids: primaryObjectId
      ? [primaryObjectId, ...matchedObjectIds.filter((id) => id !== primaryObjectId)].slice(0, 4)
      : matchedObjectIds,
    primary_object_id: primaryObjectId,
    confidence,
    method,
    reason: primaryObjectId
      ? fallbackUsed
        ? `Using selected object ${primaryObjectId} because the prompt was context-heavy or vague.`
        : `Resolved ${primaryObjectId} from scene semantics with ${method}.`
      : "No meaningful object focus was inferred from the prompt.",
    fallback_used: fallbackUsed,
  };

  if (process.env.NODE_ENV !== "production") {
    console.debug("[Nexora][Intent] input", { text: input.text, normalizedText });
    console.debug("[Nexora][Intent] matched objects", result.matched_object_ids);
    console.debug("[Nexora][Intent] primary object", result.primary_object_id);
    console.debug("[Nexora][Intent] confidence", result.confidence);
    if (result.fallback_used) {
      console.debug("[Nexora][Intent] fallback used", { method: result.method, reason: result.reason });
    }
  }

  return result;
}
