import type { MVPSmokeTestScenario } from "./mvpSmokeTestTypes";

/** Deterministic MVP executive runtime validation scenarios (no UI mutation). */

export const MVP_SMOKE_TEST_SCENARIOS: readonly MVPSmokeTestScenario[] = Object.freeze([
  {
    id: "repeat_analyze_same_object",
    title: "Repeat analyze same object",
    category: "analyze_flow",
    description:
      "Validates repeated analyze on the same object keeps selection stable without panel flash or duplicate scene reactions.",
    expectedBehavior:
      "Selected object remains stable; panel does not flash; scene does not duplicate reactions; runtime signatures dedupe.",
    failureIndicators: [
      "panel_flash",
      "duplicate_scene_reaction",
      "selection_context_loss",
      "signature_oscillation",
    ],
  },
  {
    id: "rapid_panel_switch",
    title: "Rapid panel switch",
    category: "panel_stability",
    description: "Validates rapid right-rail panel transitions remain coherent without disappearing panels.",
    expectedBehavior:
      "Panel state remains coherent; right rail stays visible; panel route signatures remain valid.",
    failureIndicators: ["panel_flash", "disappearing_panel", "invalid_panel_route", "right_rail_drop"],
  },
  {
    id: "chat_to_panel_to_scene",
    title: "Chat to panel to scene",
    category: "chat_pipeline",
    description: "Validates chat results update the panel once and scene reactions match bounded contracts.",
    expectedBehavior:
      "Chat updates panel once; scene reaction matches contract; no chat-panel-scene feedback loop.",
    failureIndicators: ["chat_panel_loop", "scene_contract_mismatch", "duplicate_panel_update"],
  },
  {
    id: "duplicate_chat_input",
    title: "Duplicate chat input",
    category: "chat_pipeline",
    description: "Validates duplicate chat pipeline signatures dedupe without repeated executive output or scene mutation.",
    expectedBehavior:
      "Duplicate pipeline signature dedupes; no duplicate executive output; no repeated scene mutation.",
    failureIndicators: [
      "duplicate_pipeline_output",
      "duplicate_panel_update",
      "repeated_scene_mutation",
    ],
  },
  {
    id: "selected_object_persistence",
    title: "Selected object persistence",
    category: "selection_context",
    description: "Validates selected object context remains locked through the analysis lifecycle.",
    expectedBehavior: "Selected object remains locked during analysis; no context loss across runtime evaluations.",
    failureIndicators: ["selection_context_loss", "object_context_unlocked"],
  },
  {
    id: "scene_contract_consistency",
    title: "Scene contract consistency",
    category: "scene_stability",
    description: "Validates scene changes occur only through valid reaction contracts without destructive overwrite.",
    expectedBehavior:
      "Scene changes only through valid contracts; scene signature remains consistent; no destructive overwrite.",
    failureIndicators: [
      "scene_contract_violation",
      "reaction_without_contract",
      "destructive_scene_overwrite",
    ],
  },
  {
    id: "readiness_dashboard_fallback",
    title: "Readiness dashboard fallback",
    category: "readiness_dashboard",
    description: "Validates missing runtime signals fall back safely without falsely reporting MVP ready.",
    expectedBehavior:
      "Missing runtime signals fallback safely; no crash; status becomes monitored or not ready, not falsely ready.",
    failureIndicators: ["false_mvp_ready", "readiness_crash", "missing_fallback"],
  },
  {
    id: "runtime_trust_stability",
    title: "Runtime trust stability",
    category: "runtime_trust",
    description: "Validates trust state does not degrade rapidly and reliability snapshots remain bounded.",
    expectedBehavior:
      "Trust state remains stable; reliability snapshots bounded; no rapid trust oscillation.",
    failureIndicators: ["trust_oscillation", "unbounded_snapshots", "trust_degradation"],
  },
]);

export function getMVPSmokeTestScenarioById(id: string): MVPSmokeTestScenario | undefined {
  return MVP_SMOKE_TEST_SCENARIOS.find((s) => s.id === id);
}
