/**
 * EXS-4 — Mock Scenario Impact dataset.
 * Visual impact stories only. No runtime / simulation / scoring.
 */

import type { Exs1ObjectId } from "../exs1Types";

export type ImpactStatus = "Affected" | "Neutral" | "Improved" | "Critical";
export type ImpactLevel = "Low" | "Medium" | "High" | "Critical";
export type ImpactVisualBehavior =
  | "growing"
  | "shrinking"
  | "warning-ring"
  | "success-ring"
  | "attention-halo"
  | "none";

export type ScenarioImpactNode = {
  readonly objectId: Exs1ObjectId;
  readonly label: string;
  readonly status: ImpactStatus;
  readonly level: ImpactLevel;
  readonly confidence: number;
  readonly department: string;
  readonly behavior: ImpactVisualBehavior;
  readonly order: number;
};

export type ScenarioImpactStory = {
  readonly scenarioId: string;
  readonly title: string;
  readonly summary: string;
  readonly estimatedDirection: string;
  readonly confidence: number;
  readonly affectedDepartments: readonly string[];
  readonly concerns: readonly string[];
  readonly risks: readonly string[];
  readonly benefits: readonly string[];
  readonly questions: readonly string[];
  readonly chain: readonly ScenarioImpactNode[];
};

export const IMPACT_TRANSITION_MS = 250;

export const IMPACT_STATUS_COLOR: Record<ImpactStatus, string> = {
  Affected: "#F79009",
  Neutral: "#98A2B3",
  Improved: "#12B76A",
  Critical: "#F04438",
};

export const IMPACT_LEVEL_COLOR: Record<ImpactLevel, string> = {
  Low: "#32D583",
  Medium: "#FDB022",
  High: "#F79009",
  Critical: "#D92D20",
};

export const SCENARIO_IMPACT_STORIES: Record<string, ScenarioImpactStory> =
  Object.freeze({
    "scenario-a": {
      scenarioId: "scenario-a",
      title: "Outsource Relief Path",
      summary:
        "Outsourcing eases Supplier pressure, restocks Inventory, and restores Production flow toward Customer delivery.",
      estimatedDirection: "Stabilizing · Service recovery",
      confidence: 82,
      affectedDepartments: ["Procurement", "Operations", "Logistics", "Sales"],
      concerns: [
        "Partner capacity must hold for 6 weeks",
        "Internal learning curve may pause",
      ],
      risks: ["Vendor quality variance", "Handoff friction at Factory"],
      benefits: ["Faster Inventory cover", "Customer OTIF protection"],
      questions: [
        "Which SKUs should move to the partner first?",
        "What is the exit ramp back to internal capacity?",
      ],
      chain: [
        {
          objectId: "supplier",
          label: "Supplier",
          status: "Improved",
          level: "High",
          confidence: 84,
          department: "Procurement",
          behavior: "success-ring",
          order: 0,
        },
        {
          objectId: "inventory",
          label: "Warehouse",
          status: "Improved",
          level: "Medium",
          confidence: 80,
          department: "Logistics",
          behavior: "growing",
          order: 1,
        },
        {
          objectId: "factory",
          label: "Production",
          status: "Affected",
          level: "Medium",
          confidence: 76,
          department: "Operations",
          behavior: "attention-halo",
          order: 2,
        },
        {
          objectId: "decision",
          label: "Shipping",
          status: "Affected",
          level: "Low",
          confidence: 72,
          department: "Logistics",
          behavior: "growing",
          order: 3,
        },
        {
          objectId: "customer",
          label: "Customer",
          status: "Improved",
          level: "High",
          confidence: 78,
          department: "Sales",
          behavior: "success-ring",
          order: 4,
        },
      ],
    },
    "scenario-b": {
      scenarioId: "scenario-b",
      title: "Capacity Investment Path",
      summary:
        "Budget deployed into capacity lifts Factory throughput, then Revenue quality — slower first response, durable gains.",
      estimatedDirection: "Expanding · Structural strength",
      confidence: 74,
      affectedDepartments: ["Finance", "Operations", "Strategy"],
      concerns: ["Cash commitment is front-loaded", "Time-to-relief is longer"],
      risks: ["Overtime quality drift", "Delayed Customer relief"],
      benefits: ["Internal capability retained", "Stronger long-term Revenue"],
      questions: [
        "Is the capital window approved this quarter?",
        "Which line is the capacity gate?",
      ],
      chain: [
        {
          objectId: "decision",
          label: "Budget",
          status: "Critical",
          level: "High",
          confidence: 70,
          department: "Finance",
          behavior: "warning-ring",
          order: 0,
        },
        {
          objectId: "factory",
          label: "Investment",
          status: "Affected",
          level: "High",
          confidence: 73,
          department: "Operations",
          behavior: "attention-halo",
          order: 1,
        },
        {
          objectId: "inventory",
          label: "Capacity",
          status: "Improved",
          level: "Medium",
          confidence: 75,
          department: "Operations",
          behavior: "growing",
          order: 2,
        },
        {
          objectId: "revenue",
          label: "Revenue",
          status: "Improved",
          level: "High",
          confidence: 77,
          department: "Finance",
          behavior: "success-ring",
          order: 3,
        },
        {
          objectId: "customer",
          label: "Profit",
          status: "Neutral",
          level: "Low",
          confidence: 68,
          department: "Sales",
          behavior: "none",
          order: 4,
        },
      ],
    },
    "scenario-c": {
      scenarioId: "scenario-c",
      title: "Second Supplier Path",
      summary:
        "Dual-sourcing diversifies inbound risk quickly, protecting Inventory and Customer commitments.",
      estimatedDirection: "Diversifying · Fast mitigation",
      confidence: 69,
      affectedDepartments: ["Procurement", "Quality", "Sales"],
      concerns: ["Qualification uncertainty", "Split-lot complexity"],
      risks: ["Quality mismatch", "Short-term coordination load"],
      benefits: ["Fastest calendar path", "Supplier concentration reduced"],
      questions: [
        "Which SKUs accept dual-source quality?",
        "How do we stage the second Supplier ramp?",
      ],
      chain: [
        {
          objectId: "supplier",
          label: "Supplier",
          status: "Critical",
          level: "High",
          confidence: 71,
          department: "Procurement",
          behavior: "warning-ring",
          order: 0,
        },
        {
          objectId: "inventory",
          label: "Warehouse",
          status: "Affected",
          level: "Medium",
          confidence: 70,
          department: "Logistics",
          behavior: "attention-halo",
          order: 1,
        },
        {
          objectId: "factory",
          label: "Production",
          status: "Neutral",
          level: "Low",
          confidence: 66,
          department: "Operations",
          behavior: "none",
          order: 2,
        },
        {
          objectId: "customer",
          label: "Customer",
          status: "Improved",
          level: "Medium",
          confidence: 72,
          department: "Sales",
          behavior: "success-ring",
          order: 3,
        },
        {
          objectId: "decision",
          label: "Delivery",
          status: "Affected",
          level: "Medium",
          confidence: 69,
          department: "Logistics",
          behavior: "growing",
          order: 4,
        },
      ],
    },
  });

export function getScenarioImpactStory(
  scenarioId: string | null | undefined,
): ScenarioImpactStory | null {
  if (!scenarioId) return null;
  if (SCENARIO_IMPACT_STORIES[scenarioId]) {
    return SCENARIO_IMPACT_STORIES[scenarioId]!;
  }
  // Combined / custom scenarios — merged mock story
  return {
    scenarioId,
    title: "Merged Impact Story",
    summary:
      "Combined scenario merges dual relief paths into one executive impact narrative (mock).",
    estimatedDirection: "Hybrid · Balanced recovery",
    confidence: 76,
    affectedDepartments: ["Procurement", "Operations", "Finance", "Sales"],
    concerns: ["Hybrid coordination overhead", "Needs future runtime validation"],
    risks: ["Split ownership of gates", "Message dilution across teams"],
    benefits: ["Broader object coverage", "Flexible executive narrative"],
    questions: ["Which half of the hybrid leads week one?"],
    chain: [
      {
        objectId: "supplier",
        label: "Supplier",
        status: "Affected",
        level: "High",
        confidence: 74,
        department: "Procurement",
        behavior: "attention-halo",
        order: 0,
      },
      {
        objectId: "factory",
        label: "Production",
        status: "Critical",
        level: "High",
        confidence: 75,
        department: "Operations",
        behavior: "warning-ring",
        order: 1,
      },
      {
        objectId: "inventory",
        label: "Warehouse",
        status: "Improved",
        level: "Medium",
        confidence: 77,
        department: "Logistics",
        behavior: "growing",
        order: 2,
      },
      {
        objectId: "customer",
        label: "Customer",
        status: "Improved",
        level: "High",
        confidence: 78,
        department: "Sales",
        behavior: "success-ring",
        order: 3,
      },
      {
        objectId: "revenue",
        label: "ROI",
        status: "Affected",
        level: "Medium",
        confidence: 73,
        department: "Finance",
        behavior: "attention-halo",
        order: 4,
      },
    ],
  };
}
