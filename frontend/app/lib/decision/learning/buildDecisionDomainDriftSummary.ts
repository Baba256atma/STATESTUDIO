import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type { DomainDriftSummary } from "./strategicLearningTypes";

const KEYWORDS = [
  "delivery",
  "cost",
  "risk",
  "stability",
  "resilience",
  "supply",
  "inventory",
  "margin",
  "throughput",
  "service",
];

function text(value: unknown) {
  return String(value ?? "").toLowerCase();
}

function topKeywords(entries: DecisionMemoryEntry[]) {
  const counts = new Map<string, number>();
  entries.forEach((entry) => {
    const body = [entry.title, entry.situation_summary, entry.recommendation_summary, entry.feedback_summary].map(text).join(" ");
    KEYWORDS.forEach((keyword) => {
      if (body.includes(keyword)) {
        counts.set(keyword, (counts.get(keyword) ?? 0) + 1);
      }
    });
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([keyword]) => keyword.replace(/\b\w/g, (match) => match.toUpperCase()));
}

export function buildDecisionDomainDriftSummary(memoryEntries: DecisionMemoryEntry[]): DomainDriftSummary {
  if (memoryEntries.length < 4) {
    return {
      drift_detected: false,
      affected_domains: [],
      summary: "Domain drift is still hard to judge. Nexora needs more historical coverage before it can tell whether current conditions are shifting.",
      implications: ["Capture more replay-backed decisions to improve drift detection."],
    };
  }

  const midpoint = Math.max(2, Math.floor(memoryEntries.length / 2));
  const recent = memoryEntries.slice(0, midpoint);
  const older = memoryEntries.slice(midpoint);
  const recentKeywords = topKeywords(recent);
  const olderKeywords = topKeywords(older);
  const affectedDomains = recentKeywords.filter((keyword) => !olderKeywords.includes(keyword));
  const recentWorse = recent.filter((entry) => entry.outcome_status === "worse_than_expected").length;
  const olderWorse = older.filter((entry) => entry.outcome_status === "worse_than_expected").length;
  const driftDetected = affectedDomains.length > 0 || recentWorse > olderWorse;

  const implications = driftDetected
    ? [
        affectedDomains.length
          ? `Recent decision pressure is shifting toward ${affectedDomains.join(", ")}.`
          : "Recent decision pressure is behaving differently than older cases.",
        recentWorse > olderWorse
          ? "Recent outcomes are underperforming more often, so confidence should be treated more cautiously."
          : "Recommendation behavior should be checked against more recent evidence before assuming older patterns still apply.",
      ]
    : ["Recent decisions are broadly consistent with older operating conditions."];

  return {
    drift_detected: driftDetected,
    affected_domains: affectedDomains,
    summary: driftDetected
      ? "Recent decisions suggest the operating context is shifting, so older patterns should not be trusted without review."
      : "No strong domain drift is visible yet. Current learning still appears broadly consistent with earlier decision history.",
    implications,
  };
}
