/**
 * EXS-5 — Mock Executive Decision dataset.
 * Visual commitment states only. No runtime / AI / workflow backend.
 */

export type DecisionStatus =
  | "Draft"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Archived";

export type DecisionSourceKind =
  | "single-scenario"
  | "scenario-combination"
  | "manual";

export type ExecutiveDecision = {
  readonly id: string;
  readonly name: string;
  readonly status: DecisionStatus;
  readonly sourceKind: DecisionSourceKind;
  readonly scenarioSourceIds: readonly string[];
  readonly scenarioSourceLabel: string;
  readonly risk: "Low" | "Medium" | "High";
  readonly confidence: number;
  readonly owner: string;
  readonly createdDate: string;
  readonly reason: string;
  readonly benefits: readonly string[];
  readonly risks: readonly string[];
  readonly nextStep: string;
  readonly whyThis: string;
  readonly whyNotAlternatives: string;
  readonly expectedImpact: string;
  readonly locked: boolean;
};

export type DecisionJournalEntry = {
  readonly id: string;
  readonly decisionId: string;
  readonly decisionName: string;
  readonly reason: string;
  readonly owner: string;
  readonly approvalState: DecisionStatus;
  readonly summary: string;
  readonly createdDate: string;
};

export type DecisionTimelinePack = {
  readonly id: string;
  readonly title: string;
  readonly decisionId: string;
  readonly risk: "warning" | "risk" | "success";
};

export const DECISION_TRANSITION_MS = 250;

export const DECISION_STATUS_COLOR: Record<DecisionStatus, string> = {
  Draft: "#98A2B3",
  "Under Review": "#FDB022",
  Approved: "#12B76A",
  Rejected: "#F04438",
  Archived: "#667085",
};

export const INITIAL_DECISIONS: readonly ExecutiveDecision[] = Object.freeze([
  {
    id: "decision-a",
    name: "Increase Capacity",
    status: "Draft",
    sourceKind: "single-scenario",
    scenarioSourceIds: ["scenario-b"],
    scenarioSourceLabel: "Scenario B",
    risk: "Medium",
    confidence: 74,
    owner: "COO · Nova",
    createdDate: "2026-03-28",
    reason: "Internal capacity protects long-term service quality for Production Delay.",
    benefits: [
      "Durable Factory throughput",
      "Retains operational learning inside Nova",
    ],
    risks: ["Front-loaded cost", "Slower first-week relief"],
    nextStep: "Move to Under Review with Finance and Operations.",
    whyThis:
      "Scenario B best matches the executive goal of structural recovery over temporary outsourcing.",
    whyNotAlternatives:
      "Scenario A is faster but builds less internal capability. Combined A+C spreads ownership too thin for week-one execution.",
    expectedImpact:
      "Budget → Capacity → Inventory cover → Customer OTIF improvement over 10 weeks (mock).",
    locked: false,
  },
  {
    id: "decision-b",
    name: "Outsource Relief",
    status: "Under Review",
    sourceKind: "single-scenario",
    scenarioSourceIds: ["scenario-a"],
    scenarioSourceLabel: "Scenario A",
    risk: "Low",
    confidence: 82,
    owner: "VP Supply · Nova",
    createdDate: "2026-03-27",
    reason: "Fastest path to stabilize Inventory cover during Production Delay.",
    benefits: ["Faster Customer protection", "Lower near-term operational load"],
    risks: ["Vendor coordination overhead", "Weaker internal capability build"],
    nextStep: "Approve if partner capacity is confirmed this week.",
    whyThis:
      "Scenario A delivers the clearest near-term impact on Inventory and Customer.",
    whyNotAlternatives:
      "Scenario B is stronger structurally but too slow for the current service window. Combined path adds coordination cost.",
    expectedImpact:
      "Supplier → Warehouse → Production → Shipping → Customer recovery in ~6 weeks (mock).",
    locked: false,
  },
]);

export function createDecisionFromScenarios(input: {
  readonly name: string;
  readonly scenarioIds: readonly string[];
  readonly scenarioLabel: string;
  readonly sourceKind: DecisionSourceKind;
}): ExecutiveDecision {
  return {
    id: `decision-${Date.now().toString(36)}`,
    name: input.name,
    status: "Draft",
    sourceKind: input.sourceKind,
    scenarioSourceIds: input.scenarioIds,
    scenarioSourceLabel: input.scenarioLabel,
    risk: "Medium",
    confidence: 70,
    owner: "Executive · Nova",
    createdDate: new Date().toISOString().slice(0, 10),
    reason: `Executive commitment framed from ${input.scenarioLabel} against Production Delay.`,
    benefits: ["Clear executive ownership", "Traceable scenario lineage"],
    risks: ["Mock confidence only", "Needs future runtime validation"],
    nextStep: "Review impact story, then Approve or Return for Analysis.",
    whyThis: `Selected path: ${input.scenarioLabel}.`,
    whyNotAlternatives: "Alternatives remain available for comparison before approval.",
    expectedImpact: "Impact narrative inherits the selected scenario story (mock).",
    locked: false,
  };
}

export function createManualDecision(name: string): ExecutiveDecision {
  return createDecisionFromScenarios({
    name: name.trim() || "Manual Executive Decision",
    scenarioIds: [],
    scenarioLabel: "Manual Executive Decision",
    sourceKind: "manual",
  });
}

export function toJournalEntry(decision: ExecutiveDecision): DecisionJournalEntry {
  return {
    id: `journal-${decision.id}`,
    decisionId: decision.id,
    decisionName: decision.name,
    reason: decision.reason,
    owner: decision.owner,
    approvalState: decision.status,
    summary: `${decision.name} · ${decision.status} · ${decision.scenarioSourceLabel}`,
    createdDate: decision.createdDate,
  };
}

export function toDecisionTimelinePack(
  decision: ExecutiveDecision,
): DecisionTimelinePack {
  return {
    id: `pack-decision-${decision.id}`,
    title: `Decision · ${decision.name}`,
    decisionId: decision.id,
    risk:
      decision.status === "Approved"
        ? "success"
        : decision.status === "Rejected"
          ? "risk"
          : "warning",
  };
}
