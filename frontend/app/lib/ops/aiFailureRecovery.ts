import { buildCanonicalRecommendation } from "../decision/recommendation/buildCanonicalRecommendation";
import { enforceSafeDefaults, sanitizeDecisionPayload } from "./aiPipelineGuard";

export type FailureRecoveryResult = {
  recoveredPayload: Record<string, unknown>;
  recoveryActions: string[];
};

type RecoverFromFailureInput = {
  payload?: unknown;
  prompt?: string | null;
};

function text(value: unknown): string {
  return String(value ?? "").trim();
}

export function recoverFromFailure(input: RecoverFromFailureInput): FailureRecoveryResult {
  const base = enforceSafeDefaults(
    sanitizeDecisionPayload(
      input.payload && typeof input.payload === "object" ? (input.payload as Record<string, unknown>) : {}
    )
  ) as Record<string, unknown>;
  const recoveryActions: string[] = [];

  if (!base.ai_reasoning || typeof base.ai_reasoning !== "object") {
    base.ai_reasoning = {
      intent: "stabilize_decision_context",
      path: "rule_based_fallback",
      confidence: {
        score: 0.42,
        level: "low",
      },
      ambiguity_notes: [
        "Reasoning was rebuilt from safe fallback rules because the original reasoning block was unavailable.",
      ],
      matched_concepts: ["fallback", "stability", "safe_default"],
    };
    recoveryActions.push("Rebuilt fallback reasoning");
  }

  if (!base.decision_simulation || typeof base.decision_simulation !== "object") {
    const action =
      text((base.canonical_recommendation as { primary?: { action?: unknown } } | undefined)?.primary?.action) ||
      "No clear recommendation";
    base.decision_simulation = {
      scenario: {
        id: "fallback_simulation",
        name: "Fallback Simulation",
      },
      summary: `Fallback simulation prepared for ${action}.`,
      confidence: 0.5,
      impact: {
        summary: "Minimal simulation reconstructed from currently available decision context.",
        directlyAffectedObjectIds: [],
        downstreamObjectIds: [],
        risk_change: 0,
      },
      risk: {
        summary: "No major risks detected",
        affectedDimensions: ["stability"],
      },
    };
    recoveryActions.push("Rebuilt minimal simulation");
  }

  if (
    !base.canonical_recommendation ||
    typeof base.canonical_recommendation !== "object" ||
    !text((base.canonical_recommendation as { primary?: { action?: unknown } } | undefined)?.primary?.action)
  ) {
    const rebuiltRecommendation = buildCanonicalRecommendation(base);
    const fallbackDefaults = enforceSafeDefaults({}) as Record<string, unknown>;
    base.canonical_recommendation =
      rebuiltRecommendation ??
      ((fallbackDefaults.canonical_recommendation as Record<string, unknown> | undefined) ?? {});
    recoveryActions.push("Rebuilt canonical recommendation");
  }

  if (!base.executive_insight || typeof base.executive_insight !== "object") {
    base.executive_insight = {
      summary:
        text((base.executive_summary_surface as { summary?: unknown } | undefined)?.summary) ||
        text((base.decision_simulation as { summary?: unknown } | undefined)?.summary) ||
        "Executive insight rebuilt from fallback decision context.",
      confidence: {
        score: 0.5,
        level: "medium",
      },
      explanation_notes: [
        "Executive insight was reconstructed because the original block was missing.",
      ],
    };
    recoveryActions.push("Rebuilt executive insight");
  }

  if (!base.reply && text(input.prompt)) {
    base.reply = `Nexora recovered this decision context using safe defaults for: ${text(input.prompt)}`;
    recoveryActions.push("Added fallback reply");
  }

  base.safe_mode = true;
  base.reply =
    text(base.reply) ||
    "Unable to fully evaluate this scenario. Showing best available insight.";
  base.decision_confidence =
    typeof base.decision_confidence === "number" && Number.isFinite(base.decision_confidence)
      ? base.decision_confidence
      : 0.5;
  base.executive_summary_surface = {
    summary: "Best available insight is being shown in safe mode.",
    happened:
      text((base.executive_summary_surface as { happened?: unknown } | undefined)?.happened) ||
      "Decision context is incomplete, so Nexora is showing a stabilized fallback view.",
    why_it_matters:
      text((base.executive_summary_surface as { why_it_matters?: unknown } | undefined)?.why_it_matters) ||
      "The system could not fully evaluate the scenario, but a safe decision path is still available.",
    what_to_do:
      text((base.executive_summary_surface as { what_to_do?: unknown } | undefined)?.what_to_do) ||
      text((base.canonical_recommendation as { primary?: { action?: unknown } } | undefined)?.primary?.action) ||
      "No clear recommendation",
  };
  base.canonical_recommendation =
    base.canonical_recommendation && typeof base.canonical_recommendation === "object"
      ? base.canonical_recommendation
      : ((enforceSafeDefaults({} as Record<string, unknown>).canonical_recommendation as Record<string, unknown> | undefined) ?? {});

  return {
    recoveredPayload: enforceSafeDefaults(base) as Record<string, unknown>,
    recoveryActions,
  };
}
