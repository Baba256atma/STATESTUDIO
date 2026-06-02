/**
 * E2:100 — Pilot, demo, and deployment readiness checklists.
 */

import type {
  ExecutiveAcceptanceGate,
  ExecutiveIntelligenceChecklist,
  ExecutiveIntelligenceScorecard,
  ExecutiveValidationResult,
} from "./executiveIntelligenceTypes";

function completionPercent(items: readonly { complete: boolean }[]): number {
  if (!items.length) return 0;
  return Number(((items.filter((entry) => entry.complete).length / items.length) * 100).toFixed(1));
}

export function buildExecutiveIntelligenceChecklists(input: {
  validations: readonly ExecutiveValidationResult[];
  acceptanceGates: readonly ExecutiveAcceptanceGate[];
  scorecard: ExecutiveIntelligenceScorecard;
  mvpReady: boolean;
}): ExecutiveIntelligenceChecklist[] {
  const passedIds = new Set(input.validations.filter((entry) => entry.passed).map((entry) => entry.validationId));
  const gatePassed = (gateId: ExecutiveAcceptanceGate["gateId"]) =>
    input.acceptanceGates.find((entry) => entry.gateId === gateId)?.passed ?? false;

  const pilotItems = [
    { id: "pilot_war_room", label: "War Room operational for pilot operators", complete: passedIds.has("war_room_operational") },
    { id: "pilot_advisor", label: "Advisor generates explainable recommendations", complete: passedIds.has("advisor_operational") && passedIds.has("explainability_review") },
    { id: "pilot_twin", label: "Cognitive Twin synchronized with scene", complete: passedIds.has("twin_synchronized") },
    { id: "pilot_simulation", label: "Simulation workflows validated", complete: passedIds.has("simulation_readiness") },
    { id: "pilot_trust", label: "Confidence and recommendation trust validated", complete: passedIds.has("confidence_review") && passedIds.has("recommendation_review") },
    { id: "pilot_acceptance", label: "MVP acceptance gate passed", complete: gatePassed("mvp") },
  ];

  const demoItems = [
    { id: "demo_first_impression", label: "30-second first impression flow validated", complete: passedIds.has("first_impression_flow") },
    { id: "demo_orientation", label: "Executive orientation without training", complete: passedIds.has("executive_orientation") },
    { id: "demo_story", label: "Strategic story flow ready", complete: input.scorecard.demoReadinessScore >= 0.65 },
    { id: "demo_walkthrough", label: "5-minute guided walkthrough prepared", complete: input.scorecard.demoReadinessScore >= 0.5 },
    { id: "demo_idle", label: "Idle runtime silent during demo", complete: passedIds.has("idle_runtime_validation") },
    { id: "demo_acceptance", label: "Executive acceptance gate passed", complete: gatePassed("executive") },
  ];

  const deploymentItems = [
    { id: "deploy_runtime", label: "Runtime acceptance gate passed", complete: gatePassed("runtime") },
    { id: "deploy_stability", label: "Render and event stability validated", complete: passedIds.has("render_stability") && passedIds.has("event_validation") },
    { id: "deploy_isolation", label: "No failed subsystem modules", complete: passedIds.has("render_stability") },
    { id: "deploy_production_score", label: "Production candidate score above threshold", complete: input.scorecard.productionCandidateScore >= 0.72 },
    { id: "deploy_mvp_ready", label: "MVP readiness confirmed", complete: input.mvpReady },
    { id: "deploy_checklist_complete", label: "All critical validations green", complete: input.validations.filter((entry) => entry.critical).every((entry) => entry.passed) },
  ];

  return [
    { checklistId: "pilot", items: pilotItems, completionPercent: completionPercent(pilotItems) },
    { checklistId: "demo", items: demoItems, completionPercent: completionPercent(demoItems) },
    { checklistId: "deployment", items: deploymentItems, completionPercent: completionPercent(deploymentItems) },
  ];
}
