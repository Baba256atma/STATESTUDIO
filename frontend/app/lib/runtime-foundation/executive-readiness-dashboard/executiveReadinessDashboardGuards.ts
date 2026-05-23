import type {
  ExecutiveReadinessDashboardModel,
  ExecutiveReadinessGap,
  RuntimeHealthClassification,
  RuntimeHealthSurface,
} from "./executiveReadinessDashboardTypes.ts";

function validScore(score: number): boolean {
  return Number.isFinite(score) && score >= 0 && score <= 1;
}

export function validateRuntimeHealthSurface(surface: RuntimeHealthSurface | null | undefined): surface is RuntimeHealthSurface {
  if (!surface) return false;
  return Boolean(surface.explanation.trim() && validScore(surface.confidence));
}

export function validateExecutiveReadinessGap(gap: ExecutiveReadinessGap | null | undefined): gap is ExecutiveReadinessGap {
  if (!gap) return false;
  return Boolean(gap.gapId.trim() && gap.description.trim() && gap.rationale.trim() && gap.recommendedNextAction.trim());
}

export function validateRuntimeHealthClassification(
  classification: RuntimeHealthClassification | null | undefined
): classification is RuntimeHealthClassification {
  if (!classification) return false;
  return Boolean(
    classification.classificationId.trim() &&
      classification.explanation.trim() &&
      classification.affectedArea.trim() &&
      classification.recommendedFollowUp.trim() &&
      validScore(classification.confidence)
  );
}

export function validateExecutiveReadinessDashboard(
  dashboard: ExecutiveReadinessDashboardModel | null | undefined
): dashboard is ExecutiveReadinessDashboardModel {
  if (!dashboard) return false;
  if (!dashboard.dashboardId.trim() || !dashboard.organizationId.trim() || !dashboard.signature.trim()) return false;
  if (!Number.isFinite(dashboard.generatedAt)) return false;
  if (!validateRuntimeHealthSurface(dashboard.healthSurface)) return false;
  if (!dashboard.indicators.every((item) => item.indicatorId.trim() && item.label.trim() && validScore(item.score))) return false;
  if (!dashboard.gaps.every(validateExecutiveReadinessGap)) return false;
  return dashboard.classifications.every(validateRuntimeHealthClassification);
}

