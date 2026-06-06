import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import { buildStrategicAssumptionAwareness } from "./buildStrategicAssumptionAwareness.ts";
import type {
  BuildExecutiveReasoningTransparencyInput,
  ExecutiveConfidenceFactor,
  ExecutiveReasoningTransparency,
  ExecutiveReasoningTradeoff,
  ExecutiveUncertaintySource,
} from "./executiveReasoningTransparencyTypes.ts";

function text(value: unknown): string {
  return String(value ?? "").trim();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function pushUnique(target: string[], value: string, limit = 4): void {
  const next = text(value);
  if (!next || target.includes(next) || target.length >= limit) return;
  target.push(next);
}

function stableSignature(parts: readonly unknown[]): string {
  return parts
    .map((part) => {
      if (part == null) return "null";
      if (typeof part === "string" || typeof part === "number" || typeof part === "boolean") return String(part);
      try {
        return JSON.stringify(part);
      } catch {
        return String(part);
      }
    })
    .join("|");
}

function buildConfidenceFactors(
  meta: BuildExecutiveReasoningTransparencyInput["metaCognition"],
  recommendation: CanonicalRecommendation | null
): ExecutiveConfidenceFactor[] {
  const factors: ExecutiveConfidenceFactor[] = [];
  const evolution = meta.confidenceEvolution;

  factors.push({
    id: "confidence::evidence-posture",
    label: evolution.explanation,
    weight: evolution.direction === "decreased" ? "caution" : "primary",
  });

  if (recommendation?.reasoning.key_drivers?.length) {
    for (const driver of recommendation.reasoning.key_drivers.slice(0, 2)) {
      factors.push({
        id: `confidence::driver::${factors.length}`,
        label: text(driver),
        weight: "supporting",
      });
    }
  }

  if (meta.supportingSignals[0]) {
    factors.push({
      id: "confidence::primary-signal",
      label: meta.supportingSignals[0],
      weight: "supporting",
    });
  }

  if (meta.uncertainty.some((u) => u.severity === "high")) {
    factors.push({
      id: "confidence::uncertainty-caution",
      label: "High-severity uncertainty warrants conservative confidence interpretation.",
      weight: "caution",
    });
  }

  return factors.slice(0, 5);
}

function buildUncertaintySources(
  meta: BuildExecutiveReasoningTransparencyInput["metaCognition"]
): ExecutiveUncertaintySource[] {
  return meta.uncertainty.map((item) => ({
    id: item.id.replace("uncertainty::", "transparency-uncertainty::"),
    label: item.label,
    severity: item.severity,
    guidance:
      item.severity === "high"
        ? "Treat conclusions as provisional until additional operational evidence arrives."
        : item.severity === "medium"
          ? "Monitor for evidence shifts before committing resources."
          : "Uncertainty is present but does not block advisory review.",
  }));
}

function buildTradeoffs(recommendation: CanonicalRecommendation | null): ExecutiveReasoningTradeoff[] {
  if (!recommendation?.alternatives?.length) return [];
  return recommendation.alternatives.slice(0, 3).map((alt, index) => ({
    id: `tradeoff::alt-${index}`,
    label: text(alt.tradeoff ?? alt.impact_summary ?? alt.action) || "Alternative path carries a distinct tradeoff.",
    impact: index === 0 ? "favor_alternative" : "neutral",
  }));
}

function buildFragilityDrivers(
  pipelineStatus: BuildExecutiveReasoningTransparencyInput["pipelineStatus"]
): string[] {
  const drivers: string[] = [];
  const level = text(pipelineStatus?.fragilityLevel).toLowerCase();
  if (level) pushUnique(drivers, `Fragility posture: ${level}`);
  pushUnique(drivers, pipelineStatus?.insightLine ?? "");
  pushUnique(drivers, pipelineStatus?.summary ?? "");
  return drivers;
}

/**
 * F10:2 — Strategic assumption awareness + executive reasoning transparency layer.
 */
export function buildExecutiveReasoningTransparency(
  input: BuildExecutiveReasoningTransparencyInput
): ExecutiveReasoningTransparency {
  const meta = input.metaCognition;
  const recommendation = input.canonicalRecommendation ?? null;
  const advice = asRecord(input.strategicAdvice);
  const assumptionAwareness = buildStrategicAssumptionAwareness({
    metaCognition: meta,
    canonicalRecommendation: recommendation,
  });

  const primarySignals = [...meta.supportingSignals];
  const fragilityDrivers = buildFragilityDrivers(input.pipelineStatus);
  for (const driver of fragilityDrivers) {
    pushUnique(primarySignals, driver, 5);
  }

  const strategicConclusion =
    text(recommendation?.primary.action) ||
    text(advice?.recommendation ?? advice?.summary) ||
    meta.strategicReflection;

  const confidenceFactors = buildConfidenceFactors(meta, recommendation);
  const uncertaintySources = buildUncertaintySources(meta);
  const tradeoffs = buildTradeoffs(recommendation);

  const governanceNotes = [meta.governanceContext];
  if (recommendation?.source === "simulation") {
    governanceNotes.push("Simulation-derived guidance remains subject to executive approval.");
  }

  const advisoryLimits = [...meta.advisoryLimits];
  for (const gap of assumptionAwareness.dependencyGaps) {
    pushUnique(advisoryLimits, gap, 4);
  }

  const primaryUncertainty = uncertaintySources[0]?.label;
  const primaryTradeoff = tradeoffs[0]?.label;
  const reasoningSummary =
    primaryUncertainty && primaryTradeoff
      ? `${meta.strategicReflection} Key tradeoff: ${primaryTradeoff}. Primary uncertainty: ${primaryUncertainty}.`
      : primaryUncertainty
        ? `${meta.strategicReflection} Primary uncertainty: ${primaryUncertainty}.`
        : meta.strategicReflection;

  const advisoryId = recommendation?.id ?? `advisory::${meta.organizationId}`;
  const timestamp = Number.isFinite(input.timestamp) ? Number(input.timestamp) : meta.timestamp;

  const signature = stableSignature([
    meta.signature,
    assumptionAwareness.signature,
    advisoryId,
    strategicConclusion,
    primarySignals,
    advisoryLimits,
    confidenceFactors.map((f) => f.id),
  ]);

  const rightRailLine = `Why: ${primarySignals[0] ?? "signals forming"} · Assumption: ${
    assumptionAwareness.trackedAssumptions[0]?.label ?? "forming"
  } · ${uncertaintySources.length ? `Uncertainty: ${uncertaintySources[0].label}` : "Uncertainty: low"}`;

  const assistantLine = `${reasoningSummary} Evidence: ${primarySignals.slice(0, 2).join("; ") || "pending"}. ${
    meta.confidenceEvolution.explanation
  }`;

  const timelineLine = `Reasoning evolution: confidence ${meta.confidenceEvolution.direction}; ${
    assumptionAwareness.trackedAssumptions[0]?.stability ?? "forming"
  } assumptions; ${uncertaintySources.length} uncertainty source(s).`;

  return {
    advisoryId,
    strategicConclusion,
    primarySignals: Object.freeze(primarySignals.slice(0, 5)),
    assumptions: assumptionAwareness.trackedAssumptions,
    confidenceFactors: Object.freeze(confidenceFactors),
    uncertaintySources: Object.freeze(uncertaintySources),
    fragilityDrivers: Object.freeze(fragilityDrivers),
    tradeoffs: Object.freeze(tradeoffs),
    governanceNotes: Object.freeze(governanceNotes.filter(Boolean)),
    advisoryLimits: Object.freeze(advisoryLimits.slice(0, 4)),
    reasoningSummary,
    signature,
    timestamp,
    rightRailLine,
    assistantLine,
    timelineLine,
  };
}
