import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveValidationContext,
  ValidationAssertionResult,
  ValidationSeverity,
} from "./executiveValidationTypes.ts";

function score(value: number): number {
  return Number(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)).toFixed(2));
}

function assertion(params: {
  id: string;
  component: string;
  passed: boolean;
  description: string;
  severity: ValidationSeverity;
  confidence?: number;
  recommendation: string;
  likelyCause?: string | null;
  skipped?: boolean;
}): ValidationAssertionResult {
  return {
    assertionId: stableSignature(["d10-validation-assertion", params.id, params.component]).slice(0, 56),
    component: params.component,
    passed: params.passed,
    skipped: params.skipped,
    description: params.description,
    severity: params.severity,
    confidence: score(params.confidence ?? 0.86),
    recommendation: params.recommendation,
    likelyCause: params.likelyCause ?? null,
  };
}

export function validateJourneyA(ctx: ExecutiveValidationContext): readonly ValidationAssertionResult[] {
  return Object.freeze([
    assertion({
      id: "dashboard_available",
      component: "dashboard",
      passed: Boolean(ctx.dashboard),
      description: "Executive readiness dashboard must be available.",
      severity: "critical",
      recommendation: "Build the executive readiness dashboard before demo validation.",
      likelyCause: "Dashboard aggregation did not run.",
    }),
    assertion({
      id: "readiness_available",
      component: "readiness",
      passed: Boolean(ctx.readinessRegistry && ctx.readinessSnapshot),
      description: "Readiness registry and executive readiness snapshot must be available.",
      severity: "critical",
      recommendation: "Run D10 readiness aggregation before validating entry flow.",
      likelyCause: "Readiness intelligence is missing.",
    }),
    assertion({
      id: "trust_available",
      component: "runtime_trust",
      passed: Boolean(ctx.reliabilitySnapshot),
      description: "Runtime trust evaluation must be available.",
      severity: "warning",
      recommendation: "Run D10 trust evaluation before executive review.",
      likelyCause: "Trust intelligence is missing.",
    }),
  ]);
}

export function validateJourneyB(ctx: ExecutiveValidationContext): readonly ValidationAssertionResult[] {
  const interaction = ctx.interactionSnapshot;
  return Object.freeze([
    assertion({
      id: "context_preserved",
      component: "executive_context",
      passed: interaction?.summary.contextPreserved === true,
      description: "Object context must remain preserved after selection.",
      severity: "critical",
      recommendation: "Preserve selected and focused object context through panel updates.",
      likelyCause: "Context preservation guard did not receive object state.",
    }),
    assertion({
      id: "panel_safe",
      component: "panel",
      passed: !interaction?.classifications.some((item) => item.affectedComponent === "panel_routing" && item.severity === "critical"),
      description: "Panel transitions must not produce critical routing issues.",
      severity: "critical",
      recommendation: "Block invalid object-focus panel transitions before render.",
      likelyCause: "Panel route lacks object ownership.",
    }),
    assertion({
      id: "scene_sync",
      component: "scene",
      passed: !interaction?.classifications.some((item) => item.affectedComponent === "scene_focus" && item.severity !== "informational"),
      description: "Scene synchronization must remain clean during object selection.",
      severity: "warning",
      recommendation: "Reconcile scene focus with selected object before applying UI updates.",
      likelyCause: "Scene focus drift detected.",
    }),
  ]);
}

export function validateJourneyC(ctx: ExecutiveValidationContext): readonly ValidationAssertionResult[] {
  const reliability = ctx.reliabilitySnapshot;
  return Object.freeze([
    assertion({
      id: "analysis_output",
      component: "analysis_workflow",
      passed: (reliability?.evaluations.length ?? 0) > 0,
      description: "Analysis workflow must produce at least one trust-evaluated output.",
      severity: "critical",
      recommendation: "Ensure analysis output is passed into trust evaluation.",
      likelyCause: "No executive-facing artifact was evaluated.",
    }),
    assertion({
      id: "confidence_visible",
      component: "confidence",
      passed: (reliability?.summary.trustScore ?? 0) > 0,
      description: "Analysis must expose confidence or trust score.",
      severity: "warning",
      recommendation: "Surface confidence score for the analyzed output.",
      likelyCause: "Confidence evidence is missing.",
    }),
    assertion({
      id: "trust_evaluation_available",
      component: "runtime_trust",
      passed: Boolean(reliability),
      description: "Trust evaluation must be available for analysis output.",
      severity: "warning",
      recommendation: "Run trust evaluation after analysis workflow completes.",
      likelyCause: "Trust snapshot is missing.",
    }),
  ]);
}

export function validateJourneyD(ctx: ExecutiveValidationContext): readonly ValidationAssertionResult[] {
  const reliability = ctx.reliabilitySnapshot;
  return Object.freeze([
    assertion({
      id: "rationale_available",
      component: "recommendation",
      passed: Boolean(reliability?.evaluations.some((item) => item.supportingFactors.length > 0)),
      description: "Recommendation must include supporting rationale.",
      severity: "warning",
      recommendation: "Attach supporting factors to recommendation trust evaluation.",
      likelyCause: "Recommendation rationale is thin.",
    }),
    assertion({
      id: "recommendation_confidence",
      component: "confidence",
      passed: (reliability?.summary.trustScore ?? 0) >= 0.6,
      description: "Recommendation confidence should be sufficient for executive review.",
      severity: "warning",
      recommendation: "Review evidence quality behind low-confidence recommendation.",
      likelyCause: "Trust score below executive review threshold.",
    }),
    assertion({
      id: "no_contradictions",
      component: "consistency",
      passed: reliability?.consistency.consistent === true,
      description: "Recommendation review must not contain contradictory outputs.",
      severity: "critical",
      recommendation: "Resolve conflicting conclusions before executive review.",
      likelyCause: "Runtime consistency analysis found contradictions.",
    }),
  ]);
}

export function validateJourneyE(ctx: ExecutiveValidationContext): readonly ValidationAssertionResult[] {
  const interaction = ctx.interactionSnapshot;
  const reliability = ctx.reliabilitySnapshot;
  return Object.freeze([
    assertion({
      id: "simulation_stable",
      component: "simulation",
      passed: interaction?.stabilityState === "stable" || interaction?.stabilityState === "recovering",
      description: "Simulation exploration must keep UI state stable or recovering.",
      severity: "warning",
      recommendation: "Resolve unstable interaction classifications before simulation demo.",
      likelyCause: "Simulation or workflow transition created unstable UI state.",
    }),
    assertion({
      id: "simulation_context_preserved",
      component: "simulation_context",
      passed: interaction?.summary.contextPreserved === true,
      description: "Simulation context must remain preserved during exploration.",
      severity: "warning",
      recommendation: "Carry simulation and decision context through workflow transitions.",
      likelyCause: "Context was not preserved across simulation update.",
    }),
    assertion({
      id: "simulation_explainable",
      component: "recommendation",
      passed: Boolean(reliability?.evaluations.some((item) => item.supportingFactors.length > 0)),
      description: "Simulation recommendations must remain explainable.",
      severity: "warning",
      recommendation: "Provide supporting factors for simulation-driven recommendations.",
      likelyCause: "Simulation recommendation lacks explanation evidence.",
    }),
  ]);
}

export function validateRuntimeIntegrity(ctx: ExecutiveValidationContext): readonly ValidationAssertionResult[] {
  return Object.freeze([
    assertion({
      id: "dashboard_not_critical",
      component: "dashboard",
      passed: ctx.dashboard?.healthSurface.status !== "critical",
      description: "Dashboard health must not be critical.",
      severity: "critical",
      recommendation: "Resolve critical dashboard classifications before demo.",
      likelyCause: "Readiness, trust, stability, or validation has critical gaps.",
    }),
    assertion({
      id: "readiness_consistent",
      component: "readiness",
      passed: ctx.readinessSnapshot?.isNexoraReady === true || (ctx.readinessSnapshot?.blocked.length ?? 0) === 0,
      description: "Readiness state must not contain unresolved blockers.",
      severity: "critical",
      recommendation: "Resolve readiness blockers before validation signoff.",
      likelyCause: "Blocked readiness items remain.",
    }),
    assertion({
      id: "interaction_no_critical",
      component: "interaction",
      passed: !ctx.interactionSnapshot?.classifications.some((item) => item.severity === "critical"),
      description: "Interaction stability must have no critical classifications.",
      severity: "critical",
      recommendation: "Prevent critical interaction issues before executive review.",
      likelyCause: "Runtime guardrail detected invalid propagation.",
    }),
  ]);
}

