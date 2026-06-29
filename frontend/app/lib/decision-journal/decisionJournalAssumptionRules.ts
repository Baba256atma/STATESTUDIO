/**
 * APP-8:5 — Decision Journal assumption scoring rules.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type { DecisionJournalAssumptionCoverage } from "./decisionJournalEvidenceAssumptionTypes.ts";
import { normalizeReflectionPatternKey } from "./decisionJournalReflectionRules.ts";
import { clampQualityConfidence } from "./decisionJournalEvidenceRules.ts";

export const DECISION_JOURNAL_ASSUMPTION_RULES = Object.freeze({
  lowAssumptionCount: 1,
  mediumAssumptionCount: 2,
  highAssumptionCount: 4,
  excessiveAssumptionCount: 5,
  manyAssumptionsThreshold: 4,
} as const);

export function calculateAssumptionCoverage(assumptionCount: number): DecisionJournalAssumptionCoverage {
  if (assumptionCount <= 0) {
    return "none";
  }
  if (assumptionCount === DECISION_JOURNAL_ASSUMPTION_RULES.lowAssumptionCount) {
    return "low";
  }
  if (assumptionCount === DECISION_JOURNAL_ASSUMPTION_RULES.mediumAssumptionCount) {
    return "medium";
  }
  if (assumptionCount <= DECISION_JOURNAL_ASSUMPTION_RULES.highAssumptionCount) {
    return "high";
  }
  return "excessive";
}

export function detectUnsupportedAssumptions(entry: DecisionJournalEngineEntry): readonly string[] {
  if (entry.evidenceReferences.length > 0 || entry.assumptions.length === 0) {
    return Object.freeze([]);
  }
  return Object.freeze([...entry.assumptions]);
}

export function detectAssumptionRiskOverlap(entry: DecisionJournalEngineEntry): readonly string[] {
  const overlaps: string[] = [];
  const riskKeys = new Set(entry.acceptedRisks.map((risk) => normalizeReflectionPatternKey(risk)));
  for (const assumption of entry.assumptions) {
    const assumptionKey = normalizeReflectionPatternKey(assumption);
    if (assumptionKey.length === 0) {
      continue;
    }
    for (const riskKey of riskKeys) {
      if (assumptionKey === riskKey || assumptionKey.includes(riskKey) || riskKey.includes(assumptionKey)) {
        overlaps.push(assumption);
        break;
      }
    }
  }
  return Object.freeze([...new Set(overlaps)]);
}

export function detectRepeatedAssumptionsForEntry(
  entry: DecisionJournalEngineEntry,
  workspaceAssumptionCounts: Readonly<Map<string, number>>
): readonly string[] {
  return Object.freeze(
    entry.assumptions.filter((assumption) => {
      const key = normalizeReflectionPatternKey(assumption);
      return key.length > 0 && (workspaceAssumptionCounts.get(key) ?? 0) >= 2;
    })
  );
}

export function buildWorkspaceAssumptionCounts(
  entries: readonly DecisionJournalEngineEntry[]
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const assumption of entry.assumptions) {
      const key = normalizeReflectionPatternKey(assumption);
      if (key.length === 0) {
        continue;
      }
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

export function scoreAssumptionQuality(entry: DecisionJournalEngineEntry): number {
  const count = entry.assumptions.length;
  if (count === 0) {
    return 0;
  }
  const coverage = calculateAssumptionCoverage(count);
  const coverageScore =
    coverage === "low"
      ? 0.25
      : coverage === "medium"
        ? 0.5
        : coverage === "high"
          ? 0.75
          : coverage === "excessive"
            ? 0.6
            : 0;
  const unsupportedPenalty = detectUnsupportedAssumptions(entry).length > 0 ? 0.2 : 0;
  return clampQualityConfidence(coverageScore - unsupportedPenalty);
}

export const DecisionJournalAssumptionRules = Object.freeze({
  DECISION_JOURNAL_ASSUMPTION_RULES,
  calculateAssumptionCoverage,
  detectUnsupportedAssumptions,
  detectAssumptionRiskOverlap,
  detectRepeatedAssumptionsForEntry,
  buildWorkspaceAssumptionCounts,
  scoreAssumptionQuality,
});
