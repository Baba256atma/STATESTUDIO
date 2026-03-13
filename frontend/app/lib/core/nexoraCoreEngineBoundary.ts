export interface NexoraCoreEngineBoundary {
  id: string;
  label: string;
  principle: string;
  sharedResponsibilities: string[];
  sharedContracts: string[];
  notes: string[];
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

export const NEXORA_SHARED_CORE_ENGINE: NexoraCoreEngineBoundary = {
  id: "nexora_shared_core_engine_v1",
  label: "Nexora Shared Core Engine",
  principle: "one_core_engine_multiple_domain_experiences",
  sharedResponsibilities: uniq([
    "core_object_language",
    "core_relation_language",
    "loop_behavior",
    "risk_propagation",
    "runtime_model",
    "simulation",
    "outcome_comparison_replay",
    "executive_insight",
    "strategic_narrative",
    "autonomous_scenario_exploration",
    "multi_source_scanning",
  ]),
  sharedContracts: uniq([
    "Core-14 Object System",
    "Core Relation Typology",
    "Loop System Contract",
    "Risk Propagation Engine",
    "Domain Runtime Integration Contract",
    "Simulation & Scenario Engine Contract",
    "Outcome Comparison & Replay Contract",
    "Executive Insight & Recommendation Contract",
    "Strategic Narrative & Decision Story Engine",
    "Autonomous Scenario Exploration Engine",
    "Multi-Source Scanner Architecture",
  ]),
  notes: [
    "Domains must shape the product experience without forking the engine.",
    "Runtime, simulation, fragility, and insight logic stay shared across domains.",
    "Domain packs configure vocabulary, demos, panels, prompts, cockpit emphasis, and framing.",
  ],
};
