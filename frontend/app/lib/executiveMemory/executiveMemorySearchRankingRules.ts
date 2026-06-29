/**
 * APP-4:9 — Executive Memory Ranking rule evaluation.
 */

import type { ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";
import type {
  ExecutiveMemoryRankingProfile,
  ExecutiveMemoryRankingRuleType,
  ExecutiveMemorySearchQuery,
} from "./executiveMemorySearchRankingTypes.ts";

export type ExecutiveMemoryRuleEvaluation = Readonly<{
  ruleType: ExecutiveMemoryRankingRuleType;
  value: number;
  matched: boolean;
  reason: string;
  readOnly: true;
}>;

function metadataCompleteness(record: ExecutiveMemoryStoredRecord): number {
  const checks = [
    record.record.goal !== null,
    record.record.intent !== null,
    record.record.scenario !== null,
    record.record.decision !== null,
    record.record.businessContext !== null,
    record.record.confidence !== null,
    record.record.evidence.length > 0,
    record.record.references.length > 0,
  ];
  return checks.filter(Boolean).length / checks.length;
}

function freshnessValue(record: ExecutiveMemoryStoredRecord, candidates: readonly ExecutiveMemoryStoredRecord[]): number {
  const timestamps = candidates.map((entry) => Date.parse(entry.record.updatedAt));
  const max = Math.max(...timestamps);
  const min = Math.min(...timestamps);
  const current = Date.parse(record.record.updatedAt);
  if (max === min) return 1;
  return (current - min) / (max - min);
}

export function evaluateExecutiveMemoryRankingRule(
  ruleType: ExecutiveMemoryRankingRuleType,
  record: ExecutiveMemoryStoredRecord,
  query: ExecutiveMemorySearchQuery,
  candidates: readonly ExecutiveMemoryStoredRecord[]
): ExecutiveMemoryRuleEvaluation {
  switch (ruleType) {
    case "exact_identifier_match": {
      const matched = Boolean(query.recordId && record.record.id === query.recordId);
      return Object.freeze({
        ruleType,
        value: matched ? 1 : 0,
        matched,
        reason: matched ? "+ Exact identifier match" : "No exact identifier match",
        readOnly: true as const,
      });
    }
    case "workspace_match": {
      const matched = Boolean(query.workspaceId && record.record.workspaceId === query.workspaceId);
      return Object.freeze({
        ruleType,
        value: matched ? 1 : 0,
        matched,
        reason: matched ? "+ Same workspace" : "Different workspace",
        readOnly: true as const,
      });
    }
    case "intent_linkage": {
      const matched = Boolean(query.intentId && record.record.intent?.intentId === query.intentId);
      return Object.freeze({
        ruleType,
        value: matched ? 1 : 0,
        matched,
        reason: matched ? "+ Same intent" : "Intent not linked",
        readOnly: true as const,
      });
    }
    case "scenario_linkage": {
      const matched = Boolean(query.scenarioId && record.record.scenario?.scenarioId === query.scenarioId);
      return Object.freeze({
        ruleType,
        value: matched ? 1 : 0,
        matched,
        reason: matched ? "+ Same scenario" : "Scenario not linked",
        readOnly: true as const,
      });
    }
    case "decision_linkage": {
      const matched = Boolean(query.decisionId && record.record.decision?.decisionId === query.decisionId);
      return Object.freeze({
        ruleType,
        value: matched ? 1 : 0,
        matched,
        reason: matched ? "+ Same decision" : "Decision not linked",
        readOnly: true as const,
      });
    }
    case "context_linkage": {
      const matched = Boolean(
        query.contextId && record.record.businessContext?.contextId === query.contextId
      );
      return Object.freeze({
        ruleType,
        value: matched ? 1 : 0,
        matched,
        reason: matched ? "+ Same business context" : "Business context not linked",
        readOnly: true as const,
      });
    }
    case "confidence_score": {
      const score = record.record.confidence?.score ?? 0;
      const matched = score > 0;
      return Object.freeze({
        ruleType,
        value: score,
        matched,
        reason: matched ? `+ Confidence ${score.toFixed(2)}` : "No confidence score",
        readOnly: true as const,
      });
    }
    case "record_freshness": {
      const value = freshnessValue(record, candidates);
      return Object.freeze({
        ruleType,
        value,
        matched: value > 0,
        reason: value > 0 ? "+ Recent update" : "Stale record",
        readOnly: true as const,
      });
    }
    case "active_state": {
      const matched = record.lifecycle === "active";
      return Object.freeze({
        ruleType,
        value: matched ? 1 : 0,
        matched,
        reason: matched ? "+ Active lifecycle" : "Archived lifecycle",
        readOnly: true as const,
      });
    }
    case "metadata_completeness": {
      const value = metadataCompleteness(record);
      return Object.freeze({
        ruleType,
        value,
        matched: value >= 0.5,
        reason: value >= 0.5 ? "+ Metadata completeness" : "Incomplete metadata",
        readOnly: true as const,
      });
    }
    default:
      return Object.freeze({
        ruleType,
        value: 0,
        matched: false,
        reason: "Unsupported rule",
        readOnly: true as const,
      });
  }
}

export function computeExecutiveMemoryRankingScore(
  record: ExecutiveMemoryStoredRecord,
  query: ExecutiveMemorySearchQuery,
  profile: ExecutiveMemoryRankingProfile,
  candidates: readonly ExecutiveMemoryStoredRecord[]
): { score: number; evaluations: readonly ExecutiveMemoryRuleEvaluation[] } {
  const evaluations: ExecutiveMemoryRuleEvaluation[] = [];
  let weightedSum = 0;
  let weightTotal = 0;

  for (const rankingRule of profile.rules) {
    if (!rankingRule.enabled) continue;
    const evaluation = evaluateExecutiveMemoryRankingRule(rankingRule.ruleType, record, query, candidates);
    evaluations.push(evaluation);
    weightedSum += rankingRule.weight * evaluation.value;
    weightTotal += rankingRule.weight;
  }

  const score = weightTotal === 0 ? 0 : Math.round((weightedSum / weightTotal) * 100);
  return { score, evaluations: Object.freeze(evaluations) };
}

export const ExecutiveMemoryRankingRules = Object.freeze({
  evaluateExecutiveMemoryRankingRule,
  computeExecutiveMemoryRankingScore,
});
