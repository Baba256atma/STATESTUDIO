import type { TypeCDecisionDraft } from "./typeCDecisionDraft.ts";

export type TypeCExecutiveSummary = {
  headline: string;
  recommendation: string;
  confidence: {
    label: "Low" | "Medium" | "High";
    value: number;
  };
  why: string[];
  nextActions: string[];
  riskNotes: string[];
  id?: string;
  decisionDraftId?: string;
  scenarioId?: string | null;
  createdAt?: string;
};

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function confidenceLabel(confidence: number): TypeCExecutiveSummary["confidence"]["label"] {
  if (confidence < 40) return "Low";
  if (confidence < 70) return "Medium";
  return "High";
}

function stableSummaryId(input: {
  draftId: string;
  posture: TypeCDecisionDraft["posture"];
  confidence: number;
}): string {
  const confidencePart = Math.round(input.confidence * 100);
  return `typec_executive_summary_${input.draftId}_${input.posture}_${confidencePart}`;
}

export function buildTypeCExecutiveSummary(input: {
  draft: TypeCDecisionDraft | null;
}): TypeCExecutiveSummary | null {
  try {
    const { draft } = input;
    if (!draft) return null;

    const confidenceValue = clampPercent(draft.confidence * 100);
    const postureCopy = draft.posture;
    const headline =
      postureCopy === "recommend"
        ? "Scenario is ready for executive review"
        : postureCopy === "investigate"
          ? "More investigation needed"
          : "Decision is not ready yet";
    const recommendation =
      postureCopy === "recommend"
        ? "Proceed to structured review before execution."
        : postureCopy === "investigate"
          ? "Investigate missing scenario structure before committing."
          : "Hold decision until the scenario has enough structure.";
    const riskNotes =
      postureCopy === "recommend"
        ? ["Recommendation is structural, not AI-generated."]
        : [...draft.reasons];

    return {
      id: stableSummaryId({
        draftId: draft.id,
        posture: postureCopy,
        confidence: draft.confidence,
      }),
      decisionDraftId: draft.id,
      scenarioId: draft.scenarioId,
      headline,
      recommendation,
      confidence: {
        label: confidenceLabel(confidenceValue),
        value: confidenceValue,
      },
      why: [...draft.reasons],
      nextActions: [...draft.nextActions],
      riskNotes,
      createdAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
