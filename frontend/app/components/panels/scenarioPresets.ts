export type ScenarioPreset = {
  name: string;
  delta: Record<string, number>;
};

export type ScenarioDomain = "business" | "politics" | "strategy" | "generic";

export function buildScenarioPresets(domain: ScenarioDomain): ScenarioPreset[] {
  if (domain === "business") {
    return [
      { name: "Baseline", delta: {} },
      { name: "Inventory Boost", delta: { inventory: 0.2 } },
      { name: "Delivery Speedup", delta: { delivery: 0.15 } },
    ];
  }

  if (domain === "politics") {
    return [
      { name: "Baseline", delta: {} },
      { name: "Diplomatic Containment", delta: { risk: -0.15 } },
      { name: "Controlled De-escalation", delta: { risk: -0.25 } },
    ];
  }

  if (domain === "strategy") {
    return [
      { name: "Baseline", delta: {} },
      { name: "Defensive Pricing", delta: { risk: -0.1 } },
      { name: "Capacity Buffer", delta: { throughput: 0.15 } },
    ];
  }

  return [
    { name: "Baseline", delta: {} },
    { name: "Stabilize System", delta: { risk: -0.1 } },
    { name: "Aggressive Shift", delta: { risk: 0.1 } },
  ];
}
