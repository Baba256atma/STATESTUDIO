import { runE2WorkspaceAudit } from "./e2WorkspaceAuditRuntime";
import { validateExecutiveFirst30Seconds } from "./executiveFirst30SecondsValidation";
import { buildWorkspaceConsistencyReport } from "./workspaceConsistencyReport";
import { reviewHudQuality } from "./hudQualityReview";
import { validateExecutiveWorkflow } from "./executiveWorkflowValidation";
import { buildWorkspaceScalabilityReport } from "./workspaceScalabilityReport";
import { reviewDayNightReadiness } from "./dayNightReadinessReview";
import { runWorkspaceStabilityGate } from "./workspaceStabilityGate";
import { runTypeCReferenceAudit } from "./typeCReferenceAudit";
import { resolveE2WorkspaceReadinessAssessment } from "./e3ReadinessGate";
import type { E2WorkspaceReadinessAssessment, E2WorkspaceReadinessContext } from "./e2ReadinessTypes";
import { logE2WorkspaceAudit } from "./e2ReadinessInstrumentation";

/** Single entry point for E2:50 completion audit + E3 readiness gate. */
export function runE2CompletionAudit(context: E2WorkspaceReadinessContext): E2WorkspaceReadinessAssessment {
  const workspaceAudit = runE2WorkspaceAudit(context);
  const first30Seconds = validateExecutiveFirst30Seconds(context);
  const consistency = buildWorkspaceConsistencyReport(context);
  const hudQuality = reviewHudQuality(context);
  const workflow = validateExecutiveWorkflow(context);
  const scalability = buildWorkspaceScalabilityReport(context);
  const dayNight = reviewDayNightReadiness(context);
  const stability = runWorkspaceStabilityGate(context);
  const referenceAudit = runTypeCReferenceAudit(context);

  const assessment = resolveE2WorkspaceReadinessAssessment(context, {
    workspaceAudit,
    first30Seconds,
    consistency,
    hudQuality,
    workflow,
    scalability,
    dayNight,
    stability,
    referenceAudit,
  });

  logE2WorkspaceAudit("assessment_complete", {
    e3Status: assessment.e3Gate.status,
    executiveUsableToday: assessment.executiveUsableToday,
    summary: assessment.summary,
  });

  return assessment;
}
