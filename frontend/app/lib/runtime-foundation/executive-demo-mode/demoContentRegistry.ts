import type { DemoJourneyId, DemoScenario, ExecutiveDemoModeState } from "./executiveDemoModeTypes.ts";

export const EXECUTIVE_DEMO_SCENARIOS: readonly DemoScenario[] = Object.freeze([
  {
    scenarioId: "platform_overview",
    title: "Platform Overview",
    presentationType: "executive_walkthrough",
    capability: "Operational landscape and platform readiness",
    whyItMatters: "Executives can see whether Nexora is healthy, stable, and ready for review.",
    valueProvided: "A single controlled view of readiness, trust, validation, and launch posture.",
    evidenceRequired: ["dashboard", "readiness", "trust", "launch_gate"],
    supportedModes: ["demo_mode", "pilot_mode", "review_mode"],
    sequence: [
      {
        stepId: "overview_landscape",
        title: "Show operational landscape",
        focus: "Current platform state and executive readiness posture.",
        expectedEvidence: ["dashboard"],
        safeFallback: "Use the executive readiness summary if detailed indicators are incomplete.",
      },
      {
        stepId: "overview_readiness",
        title: "Review readiness posture",
        focus: "MVP readiness, trust, stability, and validation posture.",
        expectedEvidence: ["readiness", "trust", "stability", "validation"],
        safeFallback: "Pause on readiness summary and identify incomplete validations.",
      },
    ],
  },
  {
    scenarioId: "object_intelligence",
    title: "Object Intelligence",
    presentationType: "guided_demonstration",
    capability: "Object context, relationships, and insight generation",
    whyItMatters: "Decision makers can inspect operational context without losing focus or panel state.",
    valueProvided: "A stable object-centered path from selection to executive insight.",
    evidenceRequired: ["interaction_stability", "scene_sync", "panel_context"],
    supportedModes: ["demo_mode", "pilot_mode", "review_mode"],
    sequence: [
      {
        stepId: "object_select",
        title: "Select object",
        focus: "Object context remains preserved across panel changes.",
        expectedEvidence: ["interaction_stability"],
        safeFallback: "Use a read-only object context if scene synchronization is under review.",
      },
      {
        stepId: "object_relationships",
        title: "Review relationships",
        focus: "Operational context and relationship evidence remain explainable.",
        expectedEvidence: ["scene_sync", "panel_context"],
        safeFallback: "Summarize relationships from validated insight output.",
      },
    ],
  },
  {
    scenarioId: "fragility_analysis",
    title: "Fragility Analysis",
    presentationType: "stakeholder_review",
    capability: "Fragility signals and operational vulnerability explanation",
    whyItMatters: "Stakeholders can understand where operational pressure may become business risk.",
    valueProvided: "Readable risk indicators with supporting rationale and next focus.",
    evidenceRequired: ["trust", "risk_classification", "readiness"],
    supportedModes: ["demo_mode", "pilot_mode", "review_mode"],
    sequence: [
      {
        stepId: "fragility_signals",
        title: "Review fragility signals",
        focus: "Risk indicators, operational vulnerability, and evidence alignment.",
        expectedEvidence: ["trust", "risk_classification"],
        safeFallback: "Keep the walkthrough at validated risk summary level.",
      },
      {
        stepId: "fragility_rationale",
        title: "Explain rationale",
        focus: "Why the fragility signal matters and what should be monitored next.",
        expectedEvidence: ["readiness", "trust"],
        safeFallback: "Use the readiness gap list as the evidence trail.",
      },
    ],
  },
  {
    scenarioId: "scenario_simulation",
    title: "Scenario Simulation",
    presentationType: "guided_demonstration",
    capability: "Scenario creation, consequence propagation, and comparative outcomes",
    whyItMatters: "Executives can explore tradeoffs without destabilizing the runtime context.",
    valueProvided: "A controlled simulation path with preserved context and explainable recommendations.",
    evidenceRequired: ["simulation", "interaction_stability", "validation"],
    supportedModes: ["demo_mode", "pilot_mode", "review_mode"],
    sequence: [
      {
        stepId: "simulation_create",
        title: "Create scenario",
        focus: "Scenario context is created without invalid state propagation.",
        expectedEvidence: ["simulation", "interaction_stability"],
        safeFallback: "Use a prepared validation scenario if live simulation evidence is incomplete.",
      },
      {
        stepId: "simulation_compare",
        title: "Compare outcomes",
        focus: "Consequences, alternatives, and recommendations remain explainable.",
        expectedEvidence: ["validation", "trust"],
        safeFallback: "Present comparison from validated executive validation output.",
      },
    ],
  },
  {
    scenarioId: "executive_decision_support",
    title: "Executive Decision Support",
    presentationType: "executive_walkthrough",
    capability: "Recommendations, confidence, rationale, and alternative options",
    whyItMatters: "Executives can understand what Nexora recommends and why without technical translation.",
    valueProvided: "A concise decision-support path grounded in trust and launch evidence.",
    evidenceRequired: ["recommendation", "confidence", "explainability", "launch_gate"],
    supportedModes: ["demo_mode", "pilot_mode", "review_mode"],
    sequence: [
      {
        stepId: "decision_recommendation",
        title: "Review recommendation",
        focus: "Recommendation, confidence, rationale, and alternatives are visible.",
        expectedEvidence: ["recommendation", "confidence"],
        safeFallback: "Use executive launch summary when recommendation evidence is partial.",
      },
      {
        stepId: "decision_explainability",
        title: "Explain decision evidence",
        focus: "Evidence, risks, and next action remain clear.",
        expectedEvidence: ["explainability", "launch_gate"],
        safeFallback: "Keep the decision narrative advisory and evidence-led.",
      },
    ],
  },
]);

export function getDemoScenarioById(id: DemoJourneyId): DemoScenario | undefined {
  return EXECUTIVE_DEMO_SCENARIOS.find((scenario) => scenario.scenarioId === id);
}

export function listDemoScenariosForMode(mode: ExecutiveDemoModeState): readonly DemoScenario[] {
  if (mode === "disabled") return Object.freeze([]);
  return EXECUTIVE_DEMO_SCENARIOS.filter((scenario) => scenario.supportedModes.includes(mode));
}
