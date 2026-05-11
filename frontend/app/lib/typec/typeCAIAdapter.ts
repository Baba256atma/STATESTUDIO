import { postJson } from "../api/client.ts";
import type { TypeCAdaptiveGuidance } from "./typeCAdaptiveGuidance.ts";
import type { TypeCAIInsightRequest, TypeCAIInsightResponse } from "./typeCAIContracts.ts";
import type { TypeCDecisionRecommendation } from "./typeCDecisionRecommendation.ts";
import type { TypeCLearningSignals } from "./typeCMemory.ts";

const FALLBACK_AI_INSIGHT: TypeCAIInsightResponse = {
  executiveSummary: "AI insight is unavailable; deterministic guidance remains the source of truth.",
  strategicInsight: "Use the current recommendation, adaptive guidance, and memory patterns for review.",
  cautionNote: "No AI output was applied to routing, execution, scene state, or memory.",
  suggestedQuestions: [
    "What assumption should be validated first?",
    "Which risk would change the recommendation?",
  ],
  confidence: 0.25,
  source: "ai_assisted",
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

function clampList(value: unknown, maxItems: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => clampText(item, 140))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function fallbackTypeCAIInsightResponse(): TypeCAIInsightResponse {
  return {
    ...FALLBACK_AI_INSIGHT,
    suggestedQuestions: [...FALLBACK_AI_INSIGHT.suggestedQuestions],
  };
}

export function buildTypeCAIInsightRequest(input: {
  decisionRecommendation: TypeCDecisionRecommendation | null;
  adaptiveGuidance: TypeCAdaptiveGuidance | null;
  memorySummary?: TypeCLearningSignals;
}): TypeCAIInsightRequest {
  return {
    decisionRecommendation: input.decisionRecommendation,
    adaptiveGuidance: input.adaptiveGuidance,
    memorySummary: input.memorySummary
      ? {
          repeatedRisks: input.memorySummary.repeatedRisks.slice(0, 4),
          stablePatterns: input.memorySummary.stablePatterns.slice(0, 4),
          unstablePatterns: input.memorySummary.unstablePatterns.slice(0, 4),
        }
      : undefined,
  };
}

export function parseTypeCAIInsightResponse(raw: unknown): TypeCAIInsightResponse {
  if (!raw || typeof raw !== "object") {
    throw new Error("Malformed Type-C AI response");
  }
  const payload = raw as Record<string, unknown>;
  const executiveSummary = clampText(payload.executiveSummary, 420);
  const strategicInsight = clampText(payload.strategicInsight, 420);
  const cautionNote = clampText(payload.cautionNote, 320);
  const suggestedQuestions = clampList(payload.suggestedQuestions, 4);
  if (!executiveSummary || !strategicInsight || !cautionNote) {
    throw new Error("Incomplete Type-C AI response");
  }
  return {
    executiveSummary,
    strategicInsight,
    cautionNote,
    suggestedQuestions,
    confidence: clamp01(payload.confidence),
    source: "ai_assisted",
  };
}

export function safeTypeCAIInsightResponse(raw: unknown): TypeCAIInsightResponse {
  try {
    return parseTypeCAIInsightResponse(raw);
  } catch {
    return fallbackTypeCAIInsightResponse();
  }
}

export async function requestTypeCAIInsight(
  request: TypeCAIInsightRequest,
  options?: { signal?: AbortSignal }
): Promise<TypeCAIInsightResponse> {
  try {
    const raw = await postJson<TypeCAIInsightRequest, unknown>("/typec/ai/insight", request, {
      signal: options?.signal,
    });
    return parseTypeCAIInsightResponse(raw);
  } catch {
    return fallbackTypeCAIInsightResponse();
  }
}
