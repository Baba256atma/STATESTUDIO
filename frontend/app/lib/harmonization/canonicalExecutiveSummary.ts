import {
  avoidFalseCertainty,
  conciseExecutiveSentence,
  stableExecutiveHeadline,
} from "../intelligence/shared/executiveLanguage.ts";
import { uniqueStrings } from "../intelligence/shared/normalization.ts";
import { deriveExecutiveFocusSummary } from "../ux/deriveExecutiveFocusSummary.ts";
import type { ExecutiveUxSignal } from "../ux/executiveSignalHierarchy.ts";
import { harmonizeExecutiveTerminology } from "./executiveTerminologyRegistry.ts";
import { resolveDominantExecutiveFocus, type ExecutiveFocusPriority } from "./executiveFocusHierarchy.ts";

export type CanonicalExecutiveSummary = {
  id: string;
  headline: string;
  whatIsHappening: string;
  whyItMatters: string;
  whatRequiresAttention: string;
  whatIsChanging: string;
  whatToMonitorNext: string;
  dominantFocus: ExecutiveFocusPriority;
  relatedObjectIds: string[];
  sourceSignalIds: string[];
};

function harmonizedSentence(value: unknown, fallback: string): string {
  return avoidFalseCertainty(harmonizeExecutiveTerminology(conciseExecutiveSentence(value, fallback)));
}

export function deriveCanonicalExecutiveSummary(params: {
  signals?: ExecutiveUxSignal[] | null;
  whatIsChanging?: unknown;
  whyItMatters?: unknown;
  whatToMonitorNext?: unknown;
}): CanonicalExecutiveSummary {
  const signals = params.signals ?? [];
  const focusSummary = deriveExecutiveFocusSummary({ signals });
  const dominant = resolveDominantExecutiveFocus(signals);
  const headline = stableExecutiveHeadline({
    preferred: focusSummary.headline,
    fallback: "Executive operating picture is steady",
  });

  return {
    id: `canonical_exec_summary:${focusSummary.primarySignalId ?? "steady"}`,
    headline: harmonizeExecutiveTerminology(headline),
    whatIsHappening: harmonizedSentence(
      focusSummary.summary,
      "The executive operating picture is currently steady."
    ),
    whyItMatters: harmonizedSentence(
      params.whyItMatters,
      "This matters because executive attention should remain aligned to the highest-confidence operational pressure."
    ),
    whatRequiresAttention: harmonizedSentence(
      focusSummary.recommendedFocus ?? focusSummary.headline,
      "No immediate executive blocker requires elevated attention."
    ),
    whatIsChanging: harmonizedSentence(
      params.whatIsChanging,
      "No material operating movement is currently dominating the executive picture."
    ),
    whatToMonitorNext: harmonizedSentence(
      params.whatToMonitorNext,
      "Continue monitoring propagation, readiness, and resilience signals for material movement."
    ),
    dominantFocus: dominant.focus,
    relatedObjectIds: uniqueStrings(focusSummary.relatedObjectIds),
    sourceSignalIds: uniqueStrings([
      ...(focusSummary.primarySignalId ? [focusSummary.primarySignalId] : []),
      ...focusSummary.supportingSignalIds,
    ]),
  };
}

export function validateCanonicalExecutiveSummary(summary: CanonicalExecutiveSummary): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  if (!summary.headline.trim()) warnings.push("Canonical executive summary requires a headline.");
  if (!summary.whatIsHappening.trim()) warnings.push("Canonical executive summary requires current-state context.");
  if (!summary.whyItMatters.trim()) warnings.push("Canonical executive summary requires strategic meaning.");
  if (!summary.whatRequiresAttention.trim()) warnings.push("Canonical executive summary requires attention guidance.");
  if (!summary.whatIsChanging.trim()) warnings.push("Canonical executive summary requires change context.");
  if (!summary.whatToMonitorNext.trim()) warnings.push("Canonical executive summary requires monitoring guidance.");
  const joined = Object.values(summary).join(" ");
  if (/catastrophic|guaranteed|will definitely/i.test(joined)) {
    warnings.push("Canonical executive summary contains non-Type-C certainty or dramatic language.");
  }
  return { valid: warnings.length === 0, warnings };
}
