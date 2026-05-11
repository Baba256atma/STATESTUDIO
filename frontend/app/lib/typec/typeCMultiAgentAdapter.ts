import { postJson } from "../api/client.ts";
import type { TypeCAdaptiveGuidance } from "./typeCAdaptiveGuidance.ts";
import type { TypeCDecisionRecommendation } from "./typeCDecisionRecommendation.ts";
import type { TypeCLearningSignals } from "./typeCMemory.ts";
import type {
  TypeCAgentResponse,
  TypeCMultiAgentInsight,
  TypeCMultiAgentRequest,
  TypeCMultiAgentSynthesis,
} from "./typeCMultiAgentContracts.ts";

const FALLBACK_SYNTHESIS: TypeCMultiAgentSynthesis = {
  executiveSummary: "Strategic intelligence is unavailable; use deterministic guidance for review.",
  keyAgreement: "The deterministic recommendation remains the source of truth.",
  keyConflict: "No validated multi-agent disagreement is available.",
  strategicRecommendation: "Review the current recommendation manually before any execution.",
  cautionAreas: ["AI output was not applied to scene state, routing, or execution."],
  confidence: 0.25,
};

const FALLBACK_MULTI_AGENT: TypeCMultiAgentInsight = {
  agentResponses: [],
  synthesis: FALLBACK_SYNTHESIS,
  source: "multi_agent_ai",
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

export function fallbackTypeCMultiAgentInsight(): TypeCMultiAgentInsight {
  return {
    agentResponses: [],
    synthesis: {
      ...FALLBACK_SYNTHESIS,
      cautionAreas: [...FALLBACK_SYNTHESIS.cautionAreas],
    },
    source: "multi_agent_ai",
  };
}

export function buildTypeCMultiAgentRequest(input: {
  recommendation: TypeCDecisionRecommendation | null;
  adaptiveGuidance: TypeCAdaptiveGuidance | null;
  memorySummary?: TypeCLearningSignals;
}): TypeCMultiAgentRequest {
  return {
    recommendation: input.recommendation,
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

function parseAgent(raw: unknown): TypeCAgentResponse | null {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as Record<string, unknown>;
  const agent = clampText(payload.agent, 80);
  const insight = clampText(payload.insight, 360);
  if (!agent || !insight) return null;
  return {
    agent,
    insight,
    concerns: clampList(payload.concerns, 4),
    recommendations: clampList(payload.recommendations, 4),
    confidence: clamp01(payload.confidence),
  };
}

function parseSynthesis(raw: unknown): TypeCMultiAgentSynthesis {
  if (!raw || typeof raw !== "object") {
    throw new Error("Malformed Type-C multi-agent synthesis");
  }
  const payload = raw as Record<string, unknown>;
  const executiveSummary = clampText(payload.executiveSummary, 460);
  const keyAgreement = clampText(payload.keyAgreement, 360);
  const keyConflict = clampText(payload.keyConflict, 360);
  const strategicRecommendation = clampText(payload.strategicRecommendation, 420);
  if (!executiveSummary || !strategicRecommendation) {
    throw new Error("Incomplete Type-C multi-agent synthesis");
  }
  return {
    executiveSummary,
    keyAgreement: keyAgreement || "No validated agreement available.",
    keyConflict: keyConflict || "No validated conflict available.",
    strategicRecommendation,
    cautionAreas: clampList(payload.cautionAreas, 4),
    confidence: clamp01(payload.confidence),
  };
}

export function parseTypeCMultiAgentInsight(raw: unknown): TypeCMultiAgentInsight {
  if (!raw || typeof raw !== "object") {
    throw new Error("Malformed Type-C multi-agent response");
  }
  const payload = raw as Record<string, unknown>;
  const agentResponses = Array.isArray(payload.agentResponses)
    ? payload.agentResponses.map(parseAgent).filter((agent): agent is TypeCAgentResponse => Boolean(agent)).slice(0, 6)
    : [];
  return {
    agentResponses,
    synthesis: parseSynthesis(payload.synthesis),
    source: "multi_agent_ai",
  };
}

export function safeTypeCMultiAgentInsight(raw: unknown): TypeCMultiAgentInsight {
  try {
    return parseTypeCMultiAgentInsight(raw);
  } catch {
    return fallbackTypeCMultiAgentInsight();
  }
}

export async function requestTypeCMultiAgentInsight(
  request: TypeCMultiAgentRequest,
  options?: { signal?: AbortSignal }
): Promise<TypeCMultiAgentInsight> {
  try {
    const raw = await postJson<TypeCMultiAgentRequest, unknown>("/typec/ai/multi-agent", request, {
      signal: options?.signal,
    });
    return parseTypeCMultiAgentInsight(raw);
  } catch {
    return fallbackTypeCMultiAgentInsight();
  }
}
