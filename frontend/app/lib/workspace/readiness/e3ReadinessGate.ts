import type {
  E2WorkspaceReadinessAssessment,
  E2WorkspaceReadinessContext,
  E3ReadinessGateReport,
  E3ReadinessStatus,
} from "./e2ReadinessTypes";
import { logE3ReadinessGate } from "./e2ReadinessInstrumentation";

/** E2:50 Part 10 — E3 transition readiness gate. */
export function runE3ReadinessGate(input: {
  workspaceAuditScore: number;
  first30SecondsPassed: boolean;
  consistencyScore: number;
  consistencyLevel: string;
  hudQualityPassed: boolean;
  workflowPassed: boolean;
  scalabilityPassed: boolean;
  dayNightPassed: boolean;
  stabilityPassed: boolean;
  referenceAlignmentScore: number;
  criticalIssueCount: number;
}): E3ReadinessGateReport {
  const uxReadiness = Math.round(
    (input.first30SecondsPassed ? 85 : 55) * 0.4 +
      input.consistencyScore * 0.3 +
      (input.hudQualityPassed ? 90 : 60) * 0.3
  );

  const technicalReadiness = Math.round(
    (input.stabilityPassed ? 90 : 50) * 0.5 + (input.scalabilityPassed ? 88 : 55) * 0.5
  );

  const executiveReadiness = Math.round(
    (input.workflowPassed ? 88 : 52) * 0.5 + (input.first30SecondsPassed ? 86 : 58) * 0.5
  );

  const visualReadiness = Math.round(
    input.referenceAlignmentScore * 0.6 + (input.dayNightPassed ? 92 : 62) * 0.4
  );

  const architecturalReadiness = Math.round(
    input.workspaceAuditScore * 0.7 + (input.criticalIssueCount === 0 ? 95 : 45) * 0.3
  );

  const blockers: string[] = [];
  const notes: string[] = [];

  if (input.criticalIssueCount > 0) blockers.push(`${input.criticalIssueCount} critical workspace audit issue(s).`);
  if (!input.stabilityPassed) blockers.push("Stability gate failed.");
  if (!input.workflowPassed) notes.push("Executive workflow has friction points.");
  if (input.consistencyLevel === "inconsistent") notes.push("Workspace consistency is inconsistent.");
  if (input.referenceAlignmentScore < 70) notes.push("Type-C reference alignment below target.");
  if (!input.scalabilityPassed) notes.push("Scalability review flagged density concerns at higher object counts.");
  if (!input.first30SecondsPassed) notes.push("First-30-seconds orientation needs improvement.");

  let status: E3ReadinessStatus = "READY";
  const minDimension = Math.min(
    uxReadiness,
    technicalReadiness,
    executiveReadiness,
    visualReadiness,
    architecturalReadiness
  );

  if (blockers.length > 0 || minDimension < 60 || input.criticalIssueCount > 0) {
    status = "NOT_READY";
  } else if (notes.length > 0 || minDimension < 75) {
    status = "READY_WITH_NOTES";
  }

  const report: E3ReadinessGateReport = {
    status,
    uxReadiness,
    technicalReadiness,
    executiveReadiness,
    visualReadiness,
    architecturalReadiness,
    blockers,
    notes,
  };

  logE3ReadinessGate("completed", { status, minDimension, blockers: blockers.length });
  return report;
}

export function isExecutiveWorkspaceUsableToday(assessment: E2WorkspaceReadinessAssessment): boolean {
  return (
    assessment.e3Gate.status !== "NOT_READY" &&
    assessment.first30Seconds.passed &&
    assessment.workflow.passed &&
    assessment.workspaceAudit.criticalIssues.length === 0
  );
}

function buildSummary(assessment: E2WorkspaceReadinessAssessment): string {
  const gate = assessment.e3Gate.status;
  const usable = assessment.executiveUsableToday ? "demonstrably usable" : "not yet demonstrably usable";
  return `E2 completion audit: E3 gate ${gate}. Workspace is ${usable} for executives today. Alignment ${assessment.referenceAudit.alignmentScore}%. Audit score ${assessment.workspaceAudit.score}%.`;
}

/** Orchestrates the full E2:50 readiness assessment. */
export function resolveE2WorkspaceReadinessAssessment(
  context: E2WorkspaceReadinessContext,
  parts: {
    workspaceAudit: E2WorkspaceReadinessAssessment["workspaceAudit"];
    first30Seconds: E2WorkspaceReadinessAssessment["first30Seconds"];
    consistency: E2WorkspaceReadinessAssessment["consistency"];
    hudQuality: E2WorkspaceReadinessAssessment["hudQuality"];
    workflow: E2WorkspaceReadinessAssessment["workflow"];
    scalability: E2WorkspaceReadinessAssessment["scalability"];
    dayNight: E2WorkspaceReadinessAssessment["dayNight"];
    stability: E2WorkspaceReadinessAssessment["stability"];
    referenceAudit: E2WorkspaceReadinessAssessment["referenceAudit"];
  }
): E2WorkspaceReadinessAssessment {
  const e3Gate = runE3ReadinessGate({
    workspaceAuditScore: parts.workspaceAudit.score,
    first30SecondsPassed: parts.first30Seconds.passed,
    consistencyScore: parts.consistency.score,
    consistencyLevel: parts.consistency.level,
    hudQualityPassed: parts.hudQuality.passed,
    workflowPassed: parts.workflow.passed,
    scalabilityPassed: parts.scalability.passed,
    dayNightPassed: parts.dayNight.passed,
    stabilityPassed: parts.stability.passed,
    referenceAlignmentScore: parts.referenceAudit.alignmentScore,
    criticalIssueCount: parts.workspaceAudit.criticalIssues.length,
  });

  const assessment: E2WorkspaceReadinessAssessment = {
    assessedAt: new Date().toISOString(),
    workspaceAudit: parts.workspaceAudit,
    first30Seconds: parts.first30Seconds,
    consistency: parts.consistency,
    hudQuality: parts.hudQuality,
    workflow: parts.workflow,
    scalability: parts.scalability,
    dayNight: parts.dayNight,
    stability: parts.stability,
    referenceAudit: parts.referenceAudit,
    e3Gate,
    executiveUsableToday: false,
    summary: "",
  };

  assessment.executiveUsableToday = isExecutiveWorkspaceUsableToday(assessment);
  assessment.summary = buildSummary(assessment);
  return assessment;
}
