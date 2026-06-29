/**
 * APP-4:12 — Executive Memory Dashboard health analyzer.
 */

import { EXECUTIVE_MEMORY_DASHBOARD_HEALTH_THRESHOLDS } from "./executiveMemoryDashboardConstants.ts";
import type {
  ExecutiveMemoryDashboardAssistantSummary,
  ExecutiveMemoryDashboardHealth,
  ExecutiveMemoryDashboardHealthThresholds,
  ExecutiveMemoryDashboardIntegrity,
  ExecutiveMemoryDashboardSummary,
} from "./executiveMemoryDashboardTypes.ts";

export function analyzeExecutiveMemoryDashboardHealth(input: {
  summary: ExecutiveMemoryDashboardSummary;
  integrity: ExecutiveMemoryDashboardIntegrity;
  assistant: ExecutiveMemoryDashboardAssistantSummary;
  thresholds?: ExecutiveMemoryDashboardHealthThresholds;
}): ExecutiveMemoryDashboardHealth {
  const thresholds = input.thresholds ?? EXECUTIVE_MEMORY_DASHBOARD_HEALTH_THRESHOLDS;
  const indicators: string[] = [];
  let level: ExecutiveMemoryDashboardHealth["level"] = "healthy";

  const totalViolations =
    input.integrity.brokenReferences +
    input.integrity.invalidVersionChains +
    input.integrity.orphanRecords +
    input.integrity.validationFailures;

  if (totalViolations >= thresholds.integrityViolationCritical) {
    level = "critical";
    indicators.push("Critical integrity violation count exceeded threshold.");
  } else if (totalViolations >= thresholds.integrityViolationWarning) {
    level = level === "healthy" ? "warning" : level;
    indicators.push("Integrity violations detected.");
  }

  if (input.integrity.integrityWarnings >= thresholds.ungovernedRecordWarning) {
    level = level === "critical" ? "critical" : "warning";
    indicators.push("Ungoverned storage records detected.");
  }

  if (input.summary.ungovernedMemories >= thresholds.ungovernedRecordWarning) {
    level = level === "critical" ? "critical" : "warning";
    if (!indicators.some((entry) => entry.includes("Ungoverned"))) {
      indicators.push("Ungoverned memories present in platform.");
    }
  }

  if (input.summary.totalMemories > 0) {
    const archivedRatio = input.summary.archivedMemories / input.summary.totalMemories;
    if (archivedRatio >= thresholds.archivedRatioWarning) {
      level = level === "critical" ? "critical" : "warning";
      indicators.push("High archived memory ratio.");
    }
  }

  if (input.assistant.accessDenials >= thresholds.accessDenialCritical) {
    level = "critical";
    indicators.push("Critical assistant access denial count.");
  } else if (input.assistant.accessDenials >= thresholds.accessDenialWarning) {
    level = level === "critical" ? "critical" : "warning";
    indicators.push("Elevated assistant access denials.");
  }

  if (indicators.length === 0) {
    indicators.push("Platform health indicators within thresholds.");
  }

  return Object.freeze({
    level,
    indicators: Object.freeze(indicators),
    readOnly: true as const,
  });
}

export const ExecutiveMemoryDashboardHealthAnalyzer = Object.freeze({
  analyzeExecutiveMemoryDashboardHealth,
});
