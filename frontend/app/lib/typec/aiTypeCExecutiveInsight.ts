import type { TypeCExecutiveSummary } from "./typeCExecutiveSummary.ts";

export type TypeCAIExecutiveInsightInput = {
  deterministicSummary: TypeCExecutiveSummary;
  sceneContext?: {
    objectCount: number;
    selectedObjectLabel?: string | null;
    focusedObjectLabel?: string | null;
  };
};

export type TypeCAIExecutiveInsight = {
  headline: string;
  executiveBrief: string;
  strategicRisk: string;
  recommendedMove: string;
  confidenceNote: string;
  source: "ai_enhanced";
};

const FALLBACK_HEADLINE = "Executive insight unavailable";
const FALLBACK_BRIEF = "Add objects or run analysis before enhancing the executive view.";
const FALLBACK_RISK = "Current signals are too weak for a stronger risk interpretation.";
const FALLBACK_MOVE = "Build the Type-C graph, then request executive enhancement again.";
const FALLBACK_CONFIDENCE = "Low confidence: deterministic summary has limited signal.";

function clampText(value: string, maxLength: number): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function safeLine(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function labelFromContext(input: TypeCAIExecutiveInsightInput): string | null {
  const focused = safeLine(input.sceneContext?.focusedObjectLabel);
  if (focused) return focused;
  const selected = safeLine(input.sceneContext?.selectedObjectLabel);
  if (selected) return selected;
  return null;
}

function isWeakSummary(summary: TypeCExecutiveSummary): boolean {
  return (
    summary.headline === "No executive insight available" ||
    summary.confidence.value <= 15 ||
    (!summary.why.length && !summary.nextActions.length && !summary.riskNotes.length)
  );
}

function confidenceNote(summary: TypeCExecutiveSummary): string {
  return `${summary.confidence.label} confidence (${summary.confidence.value}%): enhanced wording follows deterministic signals only.`;
}

export function buildTypeCAIExecutiveInsightInput(input: TypeCAIExecutiveInsightInput): TypeCAIExecutiveInsightInput {
  const selectedObjectLabel = safeLine(input.sceneContext?.selectedObjectLabel) || null;
  const focusedObjectLabel = safeLine(input.sceneContext?.focusedObjectLabel) || null;
  return {
    deterministicSummary: input.deterministicSummary,
    sceneContext: input.sceneContext
      ? {
          objectCount: Math.max(0, Math.floor(Number(input.sceneContext.objectCount) || 0)),
          selectedObjectLabel,
          focusedObjectLabel,
        }
      : undefined,
  };
}

export function isTypeCEnhanceDisabled(
  summary: TypeCExecutiveSummary,
  hasEnhancer = true,
  hasSelectedObject = true
): boolean {
  const isFallbackSummary =
    summary.headline === "No executive insight available" ||
    summary.recommendation === "Add objects or run analysis to generate insights";
  const lowConfidenceWithoutSelection = summary.confidence.label === "Low" && !hasSelectedObject;
  return !hasEnhancer || isFallbackSummary || summary.why.length === 0 || lowConfidenceWithoutSelection;
}

export function buildTypeCAIExecutiveInsight(input: TypeCAIExecutiveInsightInput): TypeCAIExecutiveInsight {
  const safeInput = buildTypeCAIExecutiveInsightInput(input);
  const { deterministicSummary } = safeInput;
  const objectLabel = labelFromContext(safeInput);
  const objectCount = safeInput.sceneContext?.objectCount ?? 0;

  if (isWeakSummary(deterministicSummary)) {
    return {
      headline: FALLBACK_HEADLINE,
      executiveBrief: FALLBACK_BRIEF,
      strategicRisk: FALLBACK_RISK,
      recommendedMove: FALLBACK_MOVE,
      confidenceNote: FALLBACK_CONFIDENCE,
      source: "ai_enhanced",
    };
  }

  const riskAnchor =
    deterministicSummary.riskNotes[0] ??
    deterministicSummary.why[0] ??
    "Risk remains localized to the known Type-C graph.";
  const actionAnchor =
    deterministicSummary.nextActions[0] ??
    deterministicSummary.recommendation ??
    "Review the current structure before committing.";
  const scope = objectLabel ? ` around ${objectLabel}` : objectCount > 0 ? ` across ${objectCount} objects` : "";

  return {
    headline: clampText(deterministicSummary.headline, 96),
    executiveBrief: clampText(`${deterministicSummary.recommendation} The current read is based on deterministic Type-C structure${scope}.`, 180),
    strategicRisk: clampText(riskAnchor, 140),
    recommendedMove: clampText(actionAnchor, 140),
    confidenceNote: clampText(confidenceNote(deterministicSummary), 120),
    source: "ai_enhanced",
  };
}
