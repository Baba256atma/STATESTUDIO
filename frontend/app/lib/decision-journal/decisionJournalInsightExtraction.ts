/**
 * APP-8:4 — Decision Journal insight extraction.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type { DecisionWorkspaceId } from "./decisionJournalTypes.ts";
import {
  clampInsightConfidence,
  confidenceForRepeatedPattern,
  DECISION_JOURNAL_REFLECTION_RULES,
  isHighConfidenceLevel,
  normalizeReflectionPatternKey,
  scoreConfidenceLevel,
  severityForRepeatedPattern,
} from "./decisionJournalReflectionRules.ts";
import type {
  DecisionJournalAlternativeSummary,
  DecisionJournalConfidenceReflectionSummary,
  DecisionJournalConstraintSummary,
  DecisionJournalEvidenceSummary,
  DecisionJournalInsightItem,
  DecisionJournalPatternSummary,
  DecisionJournalReviewSummary,
  DecisionJournalTradeoffSummary,
} from "./decisionJournalReflectionTypes.ts";

function incrementPatternMap(
  map: Map<string, { pattern: string; entryIds: Set<string> }>,
  rawValue: string,
  entryId: string
): void {
  const normalizedKey = normalizeReflectionPatternKey(rawValue);
  if (normalizedKey.length === 0) {
    return;
  }
  const existing = map.get(normalizedKey);
  if (existing) {
    existing.entryIds.add(entryId);
    return;
  }
  map.set(normalizedKey, { pattern: rawValue.trim(), entryIds: new Set([entryId]) });
}

function mapToPatternSummaries(
  map: Map<string, { pattern: string; entryIds: Set<string> }>,
  minOccurrences: number
): readonly DecisionJournalPatternSummary[] {
  return Object.freeze(
    [...map.entries()]
      .map(([, value]) =>
        Object.freeze({
          pattern: value.pattern,
          normalizedKey: normalizeReflectionPatternKey(value.pattern),
          occurrenceCount: value.entryIds.size,
          entryIds: Object.freeze([...value.entryIds].sort()),
          readOnly: true as const,
        })
      )
      .filter((pattern) => pattern.occurrenceCount >= minOccurrences)
      .sort((left, right) => right.occurrenceCount - left.occurrenceCount || left.pattern.localeCompare(right.pattern))
  );
}

function collectListPatterns(
  entries: readonly DecisionJournalEngineEntry[],
  field: "assumptions" | "acceptedRisks" | "constraints" | "tradeoffs"
): Map<string, { pattern: string; entryIds: Set<string> }> {
  const map = new Map<string, { pattern: string; entryIds: Set<string> }>();
  for (const entry of entries) {
    for (const value of entry[field]) {
      incrementPatternMap(map, value, entry.id);
    }
  }
  return map;
}

export function extractAssumptionPatterns(
  entries: readonly DecisionJournalEngineEntry[]
): readonly DecisionJournalPatternSummary[] {
  return mapToPatternSummaries(
    collectListPatterns(entries, "assumptions"),
    DECISION_JOURNAL_REFLECTION_RULES.repeatedPatternMinOccurrences
  );
}

export function extractRiskPatterns(
  entries: readonly DecisionJournalEngineEntry[]
): readonly DecisionJournalPatternSummary[] {
  return mapToPatternSummaries(
    collectListPatterns(entries, "acceptedRisks"),
    DECISION_JOURNAL_REFLECTION_RULES.repeatedPatternMinOccurrences
  );
}

export function summarizeDecisionJournalEvidence(
  entries: readonly DecisionJournalEngineEntry[]
): DecisionJournalEvidenceSummary {
  let totalReferences = 0;
  let entriesWithNoEvidence = 0;
  let entriesWithEvidence = 0;

  for (const entry of entries) {
    totalReferences += entry.evidenceReferences.length;
    if (entry.evidenceReferences.length <= DECISION_JOURNAL_REFLECTION_RULES.lowEvidenceMaxCount) {
      entriesWithNoEvidence += 1;
    } else {
      entriesWithEvidence += 1;
    }
  }

  return Object.freeze({
    totalReferences,
    entriesWithNoEvidence,
    entriesWithEvidence,
    averageReferencesPerEntry: entries.length === 0 ? 0 : totalReferences / entries.length,
    readOnly: true as const,
  });
}

export function summarizeDecisionJournalConfidence(
  entries: readonly DecisionJournalEngineEntry[]
): DecisionJournalConfidenceReflectionSummary {
  const distribution: Record<string, number> = {};
  let scoreTotal = 0;

  for (const entry of entries) {
    distribution[entry.confidence] = (distribution[entry.confidence] ?? 0) + 1;
    scoreTotal += scoreConfidenceLevel(entry.confidence);
  }

  let dominantLevel: string | null = null;
  let dominantCount = 0;
  for (const [level, count] of Object.entries(distribution)) {
    if (count > dominantCount) {
      dominantLevel = level;
      dominantCount = count;
    }
  }

  return Object.freeze({
    distribution: Object.freeze({ ...distribution }),
    dominantLevel,
    averageScore: entries.length === 0 ? 0 : clampInsightConfidence(scoreTotal / entries.length),
    readOnly: true as const,
  });
}

export function summarizeDecisionJournalReviews(
  entries: readonly DecisionJournalEngineEntry[]
): DecisionJournalReviewSummary {
  let unreviewedCount = 0;
  let reviewedCount = 0;
  let draftWithoutReviewers = 0;
  let activeWithoutReviewers = 0;

  for (const entry of entries) {
    const isReviewed = entry.status === "reviewed";
    if (isReviewed) {
      reviewedCount += 1;
    } else {
      unreviewedCount += 1;
    }
    if (entry.status === "draft" && entry.reviewers.length === 0) {
      draftWithoutReviewers += 1;
    }
    if (entry.status === "active" && entry.reviewers.length === 0) {
      activeWithoutReviewers += 1;
    }
  }

  return Object.freeze({
    unreviewedCount,
    reviewedCount,
    draftWithoutReviewers,
    activeWithoutReviewers,
    readOnly: true as const,
  });
}

function buildAlternativeSummary(entries: readonly DecisionJournalEngineEntry[]): DecisionJournalAlternativeSummary {
  let totalAlternatives = 0;
  let entriesWithNone = 0;
  let entriesWithMany = 0;

  for (const entry of entries) {
    totalAlternatives += entry.alternatives.length;
    if (entry.alternatives.length === 0) {
      entriesWithNone += 1;
    }
    if (entry.alternatives.length >= DECISION_JOURNAL_REFLECTION_RULES.manyAlternativesThreshold) {
      entriesWithMany += 1;
    }
  }

  return Object.freeze({
    totalAlternatives,
    entriesWithNone,
    entriesWithMany,
    averageAlternativesPerEntry: entries.length === 0 ? 0 : totalAlternatives / entries.length,
    readOnly: true as const,
  });
}

function buildTradeoffSummary(entries: readonly DecisionJournalEngineEntry[]): DecisionJournalTradeoffSummary {
  let totalTradeoffs = 0;
  for (const entry of entries) {
    totalTradeoffs += entry.tradeoffs.length;
  }
  return Object.freeze({
    totalTradeoffs,
    repeatedPatterns: mapToPatternSummaries(
      collectListPatterns(entries, "tradeoffs"),
      DECISION_JOURNAL_REFLECTION_RULES.repeatedPatternMinOccurrences
    ),
    readOnly: true as const,
  });
}

function buildConstraintSummary(entries: readonly DecisionJournalEngineEntry[]): DecisionJournalConstraintSummary {
  let totalConstraints = 0;
  for (const entry of entries) {
    totalConstraints += entry.constraints.length;
  }
  return Object.freeze({
    totalConstraints,
    repeatedPatterns: mapToPatternSummaries(
      collectListPatterns(entries, "constraints"),
      DECISION_JOURNAL_REFLECTION_RULES.repeatedPatternMinOccurrences
    ),
    readOnly: true as const,
  });
}

function buildInsightId(
  workspaceId: DecisionWorkspaceId,
  type: DecisionJournalInsightItem["type"],
  index: number
): string {
  const safeWorkspace = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return `decision-journal-insight-${safeWorkspace}-${type}-${String(index).padStart(4, "0")}`;
}

function repeatedPatternInsight(
  workspaceId: DecisionWorkspaceId,
  type: "repeated-assumption" | "repeated-risk" | "repeated-constraint" | "repeated-tradeoff",
  pattern: DecisionJournalPatternSummary,
  index: number,
  label: string
): DecisionJournalInsightItem {
  return Object.freeze({
    id: buildInsightId(workspaceId, type, index),
    workspaceId,
    type,
    title: `Repeated ${label}: ${pattern.pattern}`,
    description: `${label} "${pattern.pattern}" appears in ${pattern.occurrenceCount} journal entries.`,
    entryIds: pattern.entryIds,
    severity: severityForRepeatedPattern(pattern.occurrenceCount),
    confidence: confidenceForRepeatedPattern(pattern.occurrenceCount),
    metadata: Object.freeze({
      pattern: pattern.pattern,
      occurrenceCount: String(pattern.occurrenceCount),
    }),
    readOnly: true as const,
  });
}

function isUnreviewedEntry(entry: DecisionJournalEngineEntry): boolean {
  return entry.status !== "reviewed" && entry.reviewers.length === 0;
}

export function extractDecisionJournalInsights(
  entries: readonly DecisionJournalEngineEntry[],
  workspaceId: DecisionWorkspaceId
): readonly DecisionJournalInsightItem[] {
  const insights: DecisionJournalInsightItem[] = [];
  let index = 0;

  for (const pattern of extractAssumptionPatterns(entries)) {
    insights.push(repeatedPatternInsight(workspaceId, "repeated-assumption", pattern, index++, "assumption"));
  }
  for (const pattern of extractRiskPatterns(entries)) {
    insights.push(repeatedPatternInsight(workspaceId, "repeated-risk", pattern, index++, "risk"));
  }
  for (const pattern of buildConstraintSummary(entries).repeatedPatterns) {
    insights.push(repeatedPatternInsight(workspaceId, "repeated-constraint", pattern, index++, "constraint"));
  }
  for (const pattern of buildTradeoffSummary(entries).repeatedPatterns) {
    insights.push(repeatedPatternInsight(workspaceId, "repeated-tradeoff", pattern, index++, "tradeoff"));
  }

  for (const entry of entries) {
    if (entry.evidenceReferences.length <= DECISION_JOURNAL_REFLECTION_RULES.lowEvidenceMaxCount) {
      insights.push(
        Object.freeze({
          id: buildInsightId(workspaceId, "low-evidence", index++),
          workspaceId,
          type: "low-evidence",
          title: "Low evidence references",
          description: `Entry "${entry.title}" has no evidence references.`,
          entryIds: Object.freeze([entry.id]),
          severity: "medium",
          confidence: 0.9,
          metadata: Object.freeze({ entryId: entry.id }),
          readOnly: true as const,
        })
      );
    }

    if (
      isHighConfidenceLevel(entry.confidence) &&
      entry.evidenceReferences.length <= DECISION_JOURNAL_REFLECTION_RULES.lowEvidenceMaxCount
    ) {
      insights.push(
        Object.freeze({
          id: buildInsightId(workspaceId, "high-confidence-low-evidence", index++),
          workspaceId,
          type: "high-confidence-low-evidence",
          title: "High confidence with low evidence",
          description: `Entry "${entry.title}" is ${entry.confidence} confidence but has no evidence references.`,
          entryIds: Object.freeze([entry.id]),
          severity: "high",
          confidence: 0.85,
          metadata: Object.freeze({ entryId: entry.id, confidence: entry.confidence }),
          readOnly: true as const,
        })
      );
    }

    if (entry.alternatives.length >= DECISION_JOURNAL_REFLECTION_RULES.manyAlternativesThreshold) {
      insights.push(
        Object.freeze({
          id: buildInsightId(workspaceId, "many-alternatives", index++),
          workspaceId,
          type: "many-alternatives",
          title: "Many alternatives considered",
          description: `Entry "${entry.title}" documents ${entry.alternatives.length} alternatives.`,
          entryIds: Object.freeze([entry.id]),
          severity: "low",
          confidence: 0.75,
          metadata: Object.freeze({
            entryId: entry.id,
            alternativeCount: String(entry.alternatives.length),
          }),
          readOnly: true as const,
        })
      );
    }

    if (entry.alternatives.length === 0) {
      insights.push(
        Object.freeze({
          id: buildInsightId(workspaceId, "no-alternatives", index++),
          workspaceId,
          type: "no-alternatives",
          title: "No alternatives documented",
          description: `Entry "${entry.title}" documents no alternatives.`,
          entryIds: Object.freeze([entry.id]),
          severity: "medium",
          confidence: 0.8,
          metadata: Object.freeze({ entryId: entry.id }),
          readOnly: true as const,
        })
      );
    }

    if (isUnreviewedEntry(entry)) {
      insights.push(
        Object.freeze({
          id: buildInsightId(workspaceId, "unreviewed-entry", index++),
          workspaceId,
          type: "unreviewed-entry",
          title: "Unreviewed journal entry",
          description: `Entry "${entry.title}" has status "${entry.status}" and no reviewers assigned.`,
          entryIds: Object.freeze([entry.id]),
          severity: entry.status === "active" ? "medium" : "low",
          confidence: 0.7,
          metadata: Object.freeze({ entryId: entry.id, status: entry.status }),
          readOnly: true as const,
        })
      );
    }
  }

  const confidenceSummary = summarizeDecisionJournalConfidence(entries);
  if (
    entries.length >= DECISION_JOURNAL_REFLECTION_RULES.confidencePatternMinEntries &&
    confidenceSummary.dominantLevel !== null
  ) {
    const dominantCount = confidenceSummary.distribution[confidenceSummary.dominantLevel] ?? 0;
    if (dominantCount / entries.length >= DECISION_JOURNAL_REFLECTION_RULES.confidencePatternDominanceRatio) {
      insights.push(
        Object.freeze({
          id: buildInsightId(workspaceId, "confidence-pattern", index++),
          workspaceId,
          type: "confidence-pattern",
          title: "Confidence distribution pattern",
          description: `${dominantCount} of ${entries.length} entries share confidence level "${confidenceSummary.dominantLevel}".`,
          entryIds: Object.freeze(
            entries.filter((entry) => entry.confidence === confidenceSummary.dominantLevel).map((entry) => entry.id)
          ),
          severity: "low",
          confidence: clampInsightConfidence(dominantCount / entries.length),
          metadata: Object.freeze({
            dominantLevel: confidenceSummary.dominantLevel,
            dominantCount: String(dominantCount),
          }),
          readOnly: true as const,
        })
      );
    }
  }

  return Object.freeze(
    insights.sort((left, right) => left.id.localeCompare(right.id) || left.type.localeCompare(right.type))
  );
}

export const DecisionJournalInsightExtraction = Object.freeze({
  extractAssumptionPatterns,
  extractRiskPatterns,
  summarizeDecisionJournalEvidence,
  summarizeDecisionJournalConfidence,
  summarizeDecisionJournalReviews,
  extractDecisionJournalInsights,
  buildAlternativeSummary,
  buildTradeoffSummary,
  buildConstraintSummary,
});

export { buildAlternativeSummary, buildTradeoffSummary, buildConstraintSummary };
