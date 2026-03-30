import { fetchJson } from "../api/fetchJson";
import { apiBase } from "../apiBase";
import type {
  CouncilAgentInput,
  CouncilAgentOpinion,
  CouncilDisagreement,
  CouncilSynthesis,
  StrategicCouncilResult,
} from "./strategicCouncilTypes";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => asString(item)).filter(Boolean) : [];
}

function normalizeOpinion(value: unknown): CouncilAgentOpinion | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const role = asString(record.role) as CouncilAgentOpinion["role"];
  if (role !== "ceo" && role !== "cfo" && role !== "coo") return null;
  return {
    role,
    headline: asString(record.headline),
    summary: asString(record.summary),
    priorities: asStringArray(record.priorities),
    concerns: asStringArray(record.concerns),
    recommended_actions: asStringArray(record.recommended_actions),
    confidence: asNumber(record.confidence),
  };
}

function normalizeDisagreement(value: unknown): CouncilDisagreement | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  return {
    dimension: asString(record.dimension),
    ceo_position: asString(record.ceo_position) || null,
    cfo_position: asString(record.cfo_position) || null,
    coo_position: asString(record.coo_position) || null,
    tension_level: asNumber(record.tension_level),
    summary: asString(record.summary),
  };
}

function normalizeSynthesis(value: unknown): CouncilSynthesis | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  return {
    headline: asString(record.headline),
    summary: asString(record.summary),
    recommended_direction: asString(record.recommended_direction),
    top_actions: asStringArray(record.top_actions),
    tradeoffs: asStringArray(record.tradeoffs),
    confidence: asNumber(record.confidence),
  };
}

export function normalizeStrategicCouncilResult(value: unknown): StrategicCouncilResult | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const synthesis = normalizeSynthesis(record.synthesis);
  if (!synthesis) return null;
  return {
    active: !!record.active,
    opinions: (Array.isArray(record.opinions) ? record.opinions : [])
      .map(normalizeOpinion)
      .filter((item): item is CouncilAgentOpinion => !!item),
    disagreements: (Array.isArray(record.disagreements) ? record.disagreements : [])
      .map(normalizeDisagreement)
      .filter((item): item is CouncilDisagreement => !!item),
    synthesis,
    meta: {
      version: asString((record.meta as Record<string, unknown> | undefined)?.version, "v1"),
      mode: asString((record.meta as Record<string, unknown> | undefined)?.mode, "business"),
      source: asString((record.meta as Record<string, unknown> | undefined)?.source, "strategic_council"),
      timestamp: asNumber((record.meta as Record<string, unknown> | undefined)?.timestamp, Date.now()),
    },
  };
}

export async function requestStrategicCouncil(input: CouncilAgentInput): Promise<StrategicCouncilResult | null> {
  const response = await fetchJson(`${apiBase()}/system/strategic-council/run`, {
    method: "POST",
    body: input,
    timeoutMs: 12000,
    retryNetworkErrors: false,
  });
  return normalizeStrategicCouncilResult((response as Record<string, unknown> | null)?.council);
}
