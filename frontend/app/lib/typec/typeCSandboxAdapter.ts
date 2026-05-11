import { postJson } from "../api/client.ts";
import type { SceneJson } from "../sceneTypes.ts";
import type { TypeCDecisionRecommendation } from "./typeCDecisionRecommendation.ts";
import type { TypeCScenarioDraft } from "./typeCScenarioDrafts.ts";
import type { TypeCSandboxRequest, TypeCSandboxResult, TypeCSandboxStrategy } from "./typeCSandboxContracts.ts";

const FALLBACK_SANDBOX_RESULT: TypeCSandboxResult = {
  strategies: [],
  bestStrategyId: null,
  summary: "Autonomous sandbox is unavailable; no real system state was changed.",
  source: "sandbox",
};

function clampText(value: unknown, maxLength: number): string {
  const text = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function clamp01(value: unknown, fallback = 0.35): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(1, Math.max(0, Number(numeric.toFixed(2))));
}

function clampList(value: unknown, maxItems: number, maxLength = 160): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => clampText(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function cloneScene(sceneJson: SceneJson): SceneJson {
  return JSON.parse(JSON.stringify(sceneJson)) as SceneJson;
}

export function buildTypeCSandboxRequest(input: {
  sceneJson: SceneJson | null;
  currentRecommendation?: TypeCDecisionRecommendation | null;
  activeScenario?: TypeCScenarioDraft | null;
}): TypeCSandboxRequest | null {
  if (!input.sceneJson) return null;
  return {
    sceneSnapshot: cloneScene(input.sceneJson),
    currentRecommendation: input.currentRecommendation ?? null,
    activeScenario: input.activeScenario ?? null,
  };
}

export function fallbackTypeCSandboxResult(): TypeCSandboxResult {
  return {
    ...FALLBACK_SANDBOX_RESULT,
    strategies: [],
  };
}

function parseStrategy(raw: unknown): TypeCSandboxStrategy | null {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as Record<string, unknown>;
  const id = clampText(payload.id, 90);
  const title = clampText(payload.title, 120);
  const description = clampText(payload.description, 360);
  if (!id || !title || !description) return null;
  return {
    id,
    title,
    description,
    proposedActions: clampList(payload.proposedActions, 5),
    expectedBenefits: clampList(payload.expectedBenefits, 5),
    risks: clampList(payload.risks, 5),
    confidence: clamp01(payload.confidence),
  };
}

export function parseTypeCSandboxResult(raw: unknown): TypeCSandboxResult {
  if (!raw || typeof raw !== "object") {
    throw new Error("Malformed Type-C sandbox result");
  }
  const payload = raw as Record<string, unknown>;
  const strategies = Array.isArray(payload.strategies)
    ? payload.strategies.map(parseStrategy).filter((strategy): strategy is TypeCSandboxStrategy => Boolean(strategy)).slice(0, 4)
    : [];
  const summary = clampText(payload.summary, 460);
  if (!summary) throw new Error("Incomplete Type-C sandbox result");
  const bestStrategyId = clampText(payload.bestStrategyId, 90) || null;
  return {
    strategies,
    bestStrategyId: bestStrategyId && strategies.some((strategy) => strategy.id === bestStrategyId)
      ? bestStrategyId
      : strategies[0]?.id ?? null,
    summary,
    source: "sandbox",
  };
}

export function safeTypeCSandboxResult(raw: unknown): TypeCSandboxResult {
  try {
    return parseTypeCSandboxResult(raw);
  } catch {
    return fallbackTypeCSandboxResult();
  }
}

export async function requestTypeCSandboxResult(
  request: TypeCSandboxRequest,
  options?: { signal?: AbortSignal }
): Promise<TypeCSandboxResult> {
  try {
    const raw = await postJson<TypeCSandboxRequest, unknown>("/typec/sandbox/run", request, {
      signal: options?.signal,
    });
    return parseTypeCSandboxResult(raw);
  } catch {
    return fallbackTypeCSandboxResult();
  }
}
