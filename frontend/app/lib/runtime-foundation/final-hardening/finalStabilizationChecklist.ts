/** D9:10:9 — Deterministic MVP final stabilization checklist definitions. */

import type { HardeningCheckCategory } from "./finalStabilizationChecklistTypes";

export type FinalStabilizationChecklistDefinition = {
  checkId: string;
  category: HardeningCheckCategory;
  title: string;
  description: string;
  required: boolean;
  /** Key used in passedChecks / warningChecks output arrays when applicable */
  outputKey: string;
};

export const FINAL_STABILIZATION_CHECKLIST_DEFINITIONS: readonly FinalStabilizationChecklistDefinition[] =
  Object.freeze([
    {
      checkId: "lint_validation",
      category: "lint_validation",
      title: "Lint validation",
      description: "npm run lint passes without blocking errors.",
      required: true,
      outputKey: "lint_validation",
    },
    {
      checkId: "type_validation",
      category: "type_validation",
      title: "Type validation",
      description: "npx tsc --noEmit passes without new errors.",
      required: true,
      outputKey: "type_validation",
    },
    {
      checkId: "build_validation",
      category: "build_validation",
      title: "Build validation",
      description: "Frontend build completes without blocking failures.",
      required: false,
      outputKey: "build_validation",
    },
    {
      checkId: "no_panel_flash",
      category: "panel_stability",
      title: "No panel flash",
      description: "Executive analyze flow does not flash or destabilize panels.",
      required: true,
      outputKey: "no_panel_flash",
    },
    {
      checkId: "scene_contract_aligned",
      category: "scene_stability",
      title: "Scene contract consistency",
      description: "Scene reactions follow valid contracts without destructive overwrite.",
      required: true,
      outputKey: "scene_contract_aligned",
    },
    {
      checkId: "chat_pipeline_deduped",
      category: "chat_pipeline",
      title: "Chat pipeline dedupe",
      description: "Duplicate chat input does not cause repeated panel or scene reactions.",
      required: true,
      outputKey: "chat_pipeline_deduped",
    },
    {
      checkId: "selection_context_persists",
      category: "runtime_stability",
      title: "Selection context persistence",
      description: "Selected object context persists through analysis lifecycle.",
      required: true,
      outputKey: "selection_context_persists",
    },
    {
      checkId: "readiness_dashboard_operational",
      category: "fallback_safety",
      title: "Readiness dashboard",
      description: "MVP readiness dashboard renders safely with fallback for missing signals.",
      required: true,
      outputKey: "readiness_dashboard_operational",
    },
    {
      checkId: "smoke_tests_no_critical",
      category: "smoke_tests",
      title: "Smoke tests",
      description: "MVP smoke test suite has no critical failures.",
      required: true,
      outputKey: "smoke_tests",
    },
    {
      checkId: "launch_gate_demo_ready",
      category: "launch_gate",
      title: "Launch gate",
      description: "Production readiness gate is go_for_demo or better.",
      required: true,
      outputKey: "launch_gate",
    },
    {
      checkId: "demo_mode_ready",
      category: "demo_mode",
      title: "Demo mode",
      description: "Executive demo mode is demo_ready or pilot_ready.",
      required: true,
      outputKey: "demo_mode",
    },
    {
      checkId: "feedback_loop_safe",
      category: "feedback_loop",
      title: "Feedback loop",
      description: "Pilot feedback capture and learning loop operate safely without sensitive data requirements.",
      required: true,
      outputKey: "feedback_loop",
    },
    {
      checkId: "fallback_no_crash",
      category: "fallback_safety",
      title: "Fallback safety",
      description: "Missing runtime signals fallback safely without crash or false ready claims.",
      required: true,
      outputKey: "fallback_safety",
    },
    {
      checkId: "no_false_production_ready",
      category: "trust_readiness",
      title: "False-ready protection",
      description: "No false production-ready claim when evidence or launch posture is incomplete.",
      required: true,
      outputKey: "no_false_production_ready",
    },
    {
      checkId: "runtime_stability",
      category: "runtime_stability",
      title: "Runtime stability",
      description: "Enterprise runtime foundation and operational reliability are stable.",
      required: true,
      outputKey: "runtime_stability",
    },
    {
      checkId: "ui_stability",
      category: "ui_stability",
      title: "UI stability",
      description: "Executive UI interaction stability is acceptable for MVP candidate.",
      required: true,
      outputKey: "ui_stability",
    },
    {
      checkId: "trust_readiness",
      category: "trust_readiness",
      title: "Trust readiness",
      description: "Runtime trust is not untrusted and executive trust signals are bounded.",
      required: true,
      outputKey: "trust_readiness",
    },
    {
      checkId: "explainability_available",
      category: "explainability",
      title: "Explainability",
      description: "Explainability signals are available for executive rationale.",
      required: false,
      outputKey: "explainability",
    },
    {
      checkId: "manual_smoke_confirmation",
      category: "smoke_tests",
      title: "Manual smoke confirmation",
      description: "Repeat analyze and panel transition flows manually verified before release.",
      required: false,
      outputKey: "manual_smoke_test_confirmation",
    },
    {
      checkId: "panel_transition_latency",
      category: "panel_stability",
      title: "Panel transition latency",
      description: "Panel transition latency remains acceptable during executive demo.",
      required: false,
      outputKey: "panel_transition_latency",
    },
  ]);

export function getFinalStabilizationCheckDefinition(checkId: string) {
  return FINAL_STABILIZATION_CHECKLIST_DEFINITIONS.find((d) => d.checkId === checkId);
}
