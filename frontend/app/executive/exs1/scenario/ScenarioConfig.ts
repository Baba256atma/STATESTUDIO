/**
 * EXS-3 — Mock Scenario Engineering dataset.
 * Static presentation values only. No runtime / scoring engine.
 */

import type { Exs1ObjectId } from "../exs1Types";

export type ScenarioMetricLevel = "Low" | "Medium" | "High";

export type ScenarioRankSort =
  | "highest-roi"
  | "lowest-risk"
  | "fastest"
  | "balanced"
  | "custom";

export type ExecutiveScenario = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly color: string;
  readonly cost: ScenarioMetricLevel;
  readonly risk: ScenarioMetricLevel;
  readonly roi: ScenarioMetricLevel;
  readonly time: ScenarioMetricLevel;
  readonly confidence: number;
  readonly durationLabel: string;
  readonly objectCount: number;
  readonly objectIds: readonly Exs1ObjectId[];
  readonly advantages: readonly string[];
  readonly weaknesses: readonly string[];
  readonly questions: readonly string[];
  readonly nextStep: string;
  readonly combinedFrom?: readonly string[];
};

export const SCENARIO_TRANSITION_MS = 250;

export const SCENARIO_RANK_OPTIONS: readonly {
  readonly id: ScenarioRankSort;
  readonly label: string;
}[] = Object.freeze([
  { id: "highest-roi", label: "Highest ROI" },
  { id: "lowest-risk", label: "Lowest Risk" },
  { id: "fastest", label: "Fastest" },
  { id: "balanced", label: "Balanced" },
  { id: "custom", label: "Custom" },
]);

const LEVEL_RANK: Record<ScenarioMetricLevel, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

export const INITIAL_SCENARIOS: readonly ExecutiveScenario[] = Object.freeze([
  {
    id: "scenario-a",
    name: "Scenario A",
    description: "Outsource bottleneck operations to recover lead time.",
    color: "#7A5AF8",
    cost: "Medium",
    risk: "Low",
    roi: "High",
    time: "Medium",
    confidence: 82,
    durationLabel: "6 weeks",
    objectCount: 14,
    objectIds: ["supplier", "factory", "inventory", "decision"],
    advantages: [
      "Faster relief on Factory pressure",
      "Inventory cover stabilizes sooner",
    ],
    weaknesses: ["Vendor coordination overhead", "Less internal capability build"],
    questions: ["Can the partner absorb volume this month?"],
    nextStep: "Compare with Scenario B on Inventory recovery speed.",
  },
  {
    id: "scenario-b",
    name: "Scenario B",
    description: "Increase internal capacity on the critical Factory line.",
    color: "#2E90FA",
    cost: "High",
    risk: "Medium",
    roi: "Medium",
    time: "High",
    confidence: 74,
    durationLabel: "10 weeks",
    objectCount: 12,
    objectIds: ["factory", "inventory", "revenue", "decision"],
    advantages: [
      "Builds durable internal capacity",
      "Protects long-term Revenue quality",
    ],
    weaknesses: ["Higher near-term cost", "Slower first response"],
    questions: ["Is overtime available without quality loss?"],
    nextStep: "Rank against Scenario A on risk tolerance.",
  },
  {
    id: "scenario-c",
    name: "Scenario C",
    description: "Onboard a second Supplier to diversify inbound risk.",
    color: "#12B76A",
    cost: "Medium",
    risk: "Medium",
    roi: "High",
    time: "Low",
    confidence: 69,
    durationLabel: "4 weeks",
    objectCount: 11,
    objectIds: ["supplier", "inventory", "customer", "decision"],
    advantages: [
      "Diversifies Supplier risk",
      "Fastest calendar path in this mock set",
    ],
    weaknesses: ["Qualification uncertainty", "Split-lot complexity"],
    questions: ["Is dual-source quality acceptable for key SKUs?"],
    nextStep: "Combine with Scenario A for a hybrid path.",
  },
]);

export const SCENARIO_COLORS = Object.freeze([
  "#7A5AF8",
  "#2E90FA",
  "#12B76A",
  "#F79009",
  "#F04438",
  "#EE46BC",
]);

export function sortScenarios(
  scenarios: readonly ExecutiveScenario[],
  sort: ScenarioRankSort,
): ExecutiveScenario[] {
  const list = [...scenarios];
  switch (sort) {
    case "highest-roi":
      return list.sort(
        (a, b) => LEVEL_RANK[b.roi] - LEVEL_RANK[a.roi] || b.confidence - a.confidence,
      );
    case "lowest-risk":
      return list.sort(
        (a, b) => LEVEL_RANK[a.risk] - LEVEL_RANK[b.risk] || b.confidence - a.confidence,
      );
    case "fastest":
      return list.sort(
        (a, b) => LEVEL_RANK[a.time] - LEVEL_RANK[b.time] || b.confidence - a.confidence,
      );
    case "balanced":
      return list.sort((a, b) => {
        const score = (s: ExecutiveScenario) =>
          LEVEL_RANK[s.roi] * 2 - LEVEL_RANK[s.risk] - LEVEL_RANK[s.cost] + s.confidence / 100;
        return score(b) - score(a);
      });
    case "custom":
    default:
      return list;
  }
}

export function createMockScenario(input: {
  readonly name: string;
  readonly description: string;
  readonly color: string;
  readonly cloneFrom?: ExecutiveScenario | null;
}): ExecutiveScenario {
  const clone = input.cloneFrom;
  const id = `scenario-${Date.now().toString(36)}`;
  if (clone) {
    return {
      ...clone,
      id,
      name: input.name,
      description: input.description || clone.description,
      color: input.color,
      combinedFrom: undefined,
    };
  }
  return {
    id,
    name: input.name,
    description: input.description || "New executive scenario (mock).",
    color: input.color,
    cost: "Medium",
    risk: "Medium",
    roi: "Medium",
    time: "Medium",
    confidence: 70,
    durationLabel: "8 weeks",
    objectCount: 10,
    objectIds: ["factory", "inventory", "decision"],
    advantages: ["Fresh option framed for Production Delay"],
    weaknesses: ["Mock metrics — not engine-scored"],
    questions: ["What constraint should this scenario attack first?"],
    nextStep: "Select and compare against Scenario A.",
  };
}

export function createCombinedScenario(
  a: ExecutiveScenario,
  b: ExecutiveScenario,
): ExecutiveScenario {
  const objectIds = Array.from(new Set([...a.objectIds, ...b.objectIds]));
  return {
    id: `scenario-combined-${Date.now().toString(36)}`,
    name: `Combined · ${a.name.replace("Scenario ", "")}+${b.name.replace("Scenario ", "")}`,
    description: `UI-only merge of ${a.name} and ${b.name}. No runtime merge.`,
    color: a.color,
    cost: "High",
    risk: "Medium",
    roi: "High",
    time: "Medium",
    confidence: Math.round((a.confidence + b.confidence) / 2),
    durationLabel: "Hybrid",
    objectCount: objectIds.length + 8,
    objectIds: objectIds as Exs1ObjectId[],
    advantages: [
      `Blends strengths of ${a.name}`,
      `Inherits reach of ${b.name}`,
    ],
    weaknesses: ["Combined path is mock-only", "Needs future runtime validation"],
    questions: ["Which half of the hybrid should lead execution?"],
    nextStep: "Mark as Selected if this hybrid is the working path.",
    combinedFrom: [a.id, b.id],
  };
}
