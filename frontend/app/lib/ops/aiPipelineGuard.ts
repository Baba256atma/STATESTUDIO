export type ValidationResult = {
  isValid: boolean;
  missing: string[];
  warnings: string[];
};

type JsonLike =
  | null
  | boolean
  | number
  | string
  | JsonLike[]
  | { [key: string]: JsonLike };

const MAX_ARRAY_ITEMS = 50;
const MAX_DEPTH = 8;

function text(value: unknown): string {
  return String(value ?? "").trim();
}

function confidenceLevel(score: number): "low" | "medium" | "high" {
  if (score >= 0.75) return "high";
  if (score >= 0.45) return "medium";
  return "low";
}

function sanitizeValue(value: unknown, seen: WeakSet<object>, depth: number): JsonLike {
  if (depth > MAX_DEPTH) return null;
  if (value == null) return null;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "boolean") return value;
  if (typeof value === "bigint" || typeof value === "symbol" || typeof value === "function") {
    return null;
  }
  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_ARRAY_ITEMS)
      .map((entry) => sanitizeValue(entry, seen, depth + 1))
      .filter((entry) => entry !== undefined) as JsonLike[];
  }
  if (typeof value === "object") {
    if (seen.has(value as object)) return null;
    seen.add(value as object);
    const output: Record<string, JsonLike> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
      const sanitized = sanitizeValue(entry, seen, depth + 1);
      if (sanitized !== undefined && sanitized !== null) {
        output[key] = sanitized;
      }
    });
    seen.delete(value as object);
    return output;
  }
  return null;
}

export function sanitizeDecisionPayload<T>(payload: T): T {
  return sanitizeValue(payload, new WeakSet<object>(), 0) as T;
}

export function enforceSafeDefaults<T extends Record<string, unknown> | null | undefined>(payload: T): T {
  const next = payload && typeof payload === "object" ? { ...payload } : ({} as Record<string, unknown>);
  const canonicalRecommendation =
    next.canonical_recommendation && typeof next.canonical_recommendation === "object"
      ? { ...(next.canonical_recommendation as Record<string, unknown>) }
      : {};
  const primary =
    canonicalRecommendation.primary && typeof canonicalRecommendation.primary === "object"
      ? { ...(canonicalRecommendation.primary as Record<string, unknown>) }
      : {};
  const confidenceSource =
    typeof (canonicalRecommendation.confidence as { score?: unknown } | undefined)?.score === "number"
      ? Number((canonicalRecommendation.confidence as { score: number }).score)
      : 0.5;
  const confidenceScore = Number.isFinite(confidenceSource) ? confidenceSource : 0.5;
  const riskSummary =
    text((canonicalRecommendation.reasoning as { risk_summary?: unknown } | undefined)?.risk_summary) ||
    text((next.executive_insight as { summary?: unknown } | undefined)?.summary) ||
    "No major risks detected";

  next.canonical_recommendation = {
    ...canonicalRecommendation,
    primary: {
      ...primary,
      action: text(primary.action) || "No clear recommendation",
      target_ids: Array.isArray(primary.target_ids) ? primary.target_ids.slice(0, MAX_ARRAY_ITEMS) : [],
      impact_summary: text(primary.impact_summary) || riskSummary,
    },
    reasoning: {
      ...((canonicalRecommendation.reasoning as Record<string, unknown> | undefined) ?? {}),
      why:
        text((canonicalRecommendation.reasoning as { why?: unknown } | undefined)?.why) ||
        "Nexora is holding a safe fallback recommendation until stronger evidence is available.",
      risk_summary: riskSummary,
    },
    confidence: {
      score: confidenceScore,
      level: confidenceLevel(confidenceScore),
    },
    source: text(canonicalRecommendation.source) || "generic",
    created_at:
      typeof canonicalRecommendation.created_at === "number" && Number.isFinite(canonicalRecommendation.created_at)
        ? canonicalRecommendation.created_at
        : Date.now(),
  };

  next.decision_simulation = {
    summary:
      text((next.decision_simulation as { summary?: unknown } | undefined)?.summary) ||
      "Simulation unavailable. Showing a safe fallback view.",
    confidence:
      typeof (next.decision_simulation as { confidence?: unknown } | undefined)?.confidence === "number" &&
      Number.isFinite((next.decision_simulation as { confidence: number }).confidence)
        ? (next.decision_simulation as { confidence: number }).confidence
        : confidenceScore,
    risk: {
      summary:
        text((next.decision_simulation as { risk?: { summary?: unknown } } | undefined)?.risk?.summary) ||
        riskSummary,
      affectedDimensions: Array.isArray(
        (next.decision_simulation as { risk?: { affectedDimensions?: unknown[] } } | undefined)?.risk?.affectedDimensions
      )
        ? (
            (next.decision_simulation as { risk?: { affectedDimensions?: unknown[] } }).risk
              ?.affectedDimensions ?? []
          ).slice(0, MAX_ARRAY_ITEMS)
        : [],
    },
    impact:
      (next.decision_simulation as { impact?: unknown } | undefined)?.impact &&
      typeof (next.decision_simulation as { impact?: unknown }).impact === "object"
        ? (next.decision_simulation as { impact: unknown }).impact
        : { summary: riskSummary, directlyAffectedObjectIds: [] },
  };

  next.executive_insight = {
    ...(((next.executive_insight as Record<string, unknown> | undefined) ?? {})),
    summary:
      text((next.executive_insight as { summary?: unknown } | undefined)?.summary) ||
      riskSummary,
    confidence: {
      score:
        typeof (next.executive_insight as { confidence?: { score?: unknown } } | undefined)?.confidence?.score === "number"
          ? (next.executive_insight as { confidence: { score: number } }).confidence.score
          : confidenceScore,
      level:
        text((next.executive_insight as { confidence?: { level?: unknown } } | undefined)?.confidence?.level) ||
        confidenceLevel(confidenceScore),
    },
    explanation_notes: Array.isArray(
      (next.executive_insight as { explanation_notes?: unknown[] } | undefined)?.explanation_notes
    )
      ? ((next.executive_insight as { explanation_notes?: unknown[] }).explanation_notes ?? []).slice(0, MAX_ARRAY_ITEMS)
      : [riskSummary],
  };

  next.executive_summary_surface = {
    ...(((next.executive_summary_surface as Record<string, unknown> | undefined) ?? {})),
    summary:
      text((next.executive_summary_surface as { summary?: unknown } | undefined)?.summary) ||
      riskSummary,
    happened:
      text((next.executive_summary_surface as { happened?: unknown } | undefined)?.happened) ||
      riskSummary,
    why_it_matters:
      text((next.executive_summary_surface as { why_it_matters?: unknown } | undefined)?.why_it_matters) ||
      "Decision context is partially reconstructed from safe defaults.",
    what_to_do:
      text((next.executive_summary_surface as { what_to_do?: unknown } | undefined)?.what_to_do) ||
      "No clear recommendation",
  };

  if (!text(next.analysis_summary)) {
    next.analysis_summary = riskSummary;
  }

  if (!Array.isArray(next.audit_events)) {
    next.audit_events = [];
  }

  if (!Array.isArray(next.trust_provenance)) {
    next.trust_provenance = [];
  }

  if (!Array.isArray(next.decision_trace)) {
    next.decision_trace = [];
  }

  if (
    typeof next.decision_confidence !== "number" ||
    !Number.isFinite(next.decision_confidence)
  ) {
    next.decision_confidence = confidenceScore;
  }

  next.decision_cockpit =
    next.decision_cockpit && typeof next.decision_cockpit === "object"
      ? next.decision_cockpit
      : {
          executive: {
            summary: riskSummary,
            risk_posture: confidenceLevel(confidenceScore),
          },
        };

  next.strategy_kpi =
    next.strategy_kpi && typeof next.strategy_kpi === "object"
      ? next.strategy_kpi
      : {
          summary: "No KPI movement is available yet.",
          follow_up_summary: "Run a scenario to generate stronger KPI follow-up evidence.",
        };

  return next as T;
}

export function validateDecisionPayload(payload: unknown): ValidationResult {
  const target = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const missing: string[] = [];
  const warnings: string[] = [];

  if (!target.canonical_recommendation || typeof target.canonical_recommendation !== "object") {
    missing.push("canonical_recommendation");
  }
  if (!target.decision_simulation || typeof target.decision_simulation !== "object") {
    missing.push("decision_simulation");
  }
  if (!target.executive_insight || typeof target.executive_insight !== "object") {
    missing.push("executive_insight");
  }
  if (!target.executive_summary_surface || typeof target.executive_summary_surface !== "object") {
    warnings.push("executive_summary_surface is missing; panels may rely on fallback summaries.");
  }

  const action = text((target.canonical_recommendation as { primary?: { action?: unknown } } | undefined)?.primary?.action);
  if (!action) {
    warnings.push("canonical_recommendation.primary.action is empty.");
  }
  const simulationSummary = text((target.decision_simulation as { summary?: unknown } | undefined)?.summary);
  if (!simulationSummary) {
    warnings.push("decision_simulation.summary is empty.");
  }
  const confidence = (target.canonical_recommendation as { confidence?: { score?: unknown } } | undefined)?.confidence?.score;
  if (typeof confidence !== "number" || !Number.isFinite(confidence)) {
    warnings.push("canonical_recommendation.confidence.score is not finite.");
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}
