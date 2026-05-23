import type { ExecutiveValidationScenario } from "./executiveValidationTypes.ts";

export const EXECUTIVE_VALIDATION_SCENARIOS: readonly ExecutiveValidationScenario[] = Object.freeze([
  {
    scenarioId: "journey_a_platform_entry",
    title: "Journey A - executive entry",
    category: "platform_entry",
    journey: "A",
    description: "Executive enters Nexora and expects platform readiness, trust, and dashboard data.",
    expectedOutcome: "System loads, readiness is available, trust is available, dashboard is operational.",
    requiredSignals: ["dashboard", "readiness", "trust"],
  },
  {
    scenarioId: "journey_b_object_selection",
    title: "Journey B - object selection",
    category: "object_selection",
    journey: "B",
    description: "Executive selects an object and expects object context, panel, and scene state to remain stable.",
    expectedOutcome: "Context is preserved, panel updates safely, scene synchronization remains clean.",
    requiredSignals: ["interaction_context", "scene_sync"],
  },
  {
    scenarioId: "journey_c_request_analysis",
    title: "Journey C - request analysis",
    category: "analysis_workflow",
    journey: "C",
    description: "Executive requests analysis and expects output, confidence, and trust evidence.",
    expectedOutcome: "Workflow output exists, confidence is visible, trust evaluation is available.",
    requiredSignals: ["trust", "confidence"],
  },
  {
    scenarioId: "journey_d_recommendation_review",
    title: "Journey D - recommendation review",
    category: "recommendation_review",
    journey: "D",
    description: "Executive reviews a recommendation and expects rationale, confidence, and no contradictions.",
    expectedOutcome: "Recommendation remains explainable with confidence and no contradictory outputs.",
    requiredSignals: ["recommendation", "consistency"],
  },
  {
    scenarioId: "journey_e_simulation_exploration",
    title: "Journey E - simulation exploration",
    category: "simulation_workflow",
    journey: "E",
    description: "Executive explores simulation and expects stable state, preserved context, and explainable recommendations.",
    expectedOutcome: "Simulation context stays stable and recommendations remain explainable.",
    requiredSignals: ["simulation", "interaction_stability"],
  },
  {
    scenarioId: "runtime_integrity_validation",
    title: "Runtime integrity validation",
    category: "runtime_integrity",
    journey: "integrity",
    description: "Validates panel, workflow, state, context, trust, and readiness consistency.",
    expectedOutcome: "No critical runtime integrity gaps are present.",
    requiredSignals: ["dashboard", "readiness", "trust", "interaction_stability"],
  },
]);

export function getExecutiveValidationScenarioById(id: string): ExecutiveValidationScenario | undefined {
  return EXECUTIVE_VALIDATION_SCENARIOS.find((scenario) => scenario.scenarioId === id);
}

