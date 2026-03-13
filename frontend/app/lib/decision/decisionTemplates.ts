import type { LoopType } from "../sceneTypes";

export type DecisionTemplateId =
  | "quality_protection"
  | "cost_compression"
  | "delivery_customer"
  | "risk_reduction";

export type DecisionTemplate = {
  id: DecisionTemplateId;
  title: string;
  tagline: string;
  // KPI weights: 0..3 (simple)
  kpiWeights: Record<string, number>;
  // Loop templates to add (LoopType values)
  suggestedLoops: Array<LoopType>;
  // Optional UI hints
  ui?: {
    showLoops?: boolean;
    focusMode?: "all" | "selected";
  };
};

export const DECISION_TEMPLATES: DecisionTemplate[] = [
  {
    id: "quality_protection",
    title: "Quality Protection",
    tagline: "Prioritize stability and safeguards over speed.",
    kpiWeights: {
      kpi_quality: 3,
      kpi_stability: 2,
      kpi_risk: 1,
    },
    suggestedLoops: ["quality_protection", "stability_balance"],
    ui: {
      showLoops: true,
      focusMode: "all",
    },
  },
  {
    id: "cost_compression",
    title: "Cost Compression",
    tagline: "Drive cost down while preserving essential outcomes.",
    kpiWeights: {
      kpi_cost: 3,
      kpi_delivery: 1,
      kpi_quality: 1,
    },
    suggestedLoops: ["cost_compression"],
    ui: {
      showLoops: true,
      focusMode: "all",
    },
  },
  {
    id: "delivery_customer",
    title: "Delivery / Customer",
    tagline: "Ship reliably and keep customer impact front-and-center.",
    kpiWeights: {
      kpi_delivery: 3,
      kpi_quality: 1,
      kpi_stability: 1,
    },
    suggestedLoops: ["delivery_customer"],
    ui: {
      showLoops: true,
      focusMode: "all",
    },
  },
  {
    id: "risk_reduction",
    title: "Risk Reduction",
    tagline: "Reduce exposure and volatility before scaling.",
    kpiWeights: {
      kpi_risk: 3,
      kpi_stability: 2,
      kpi_quality: 1,
    },
    suggestedLoops: ["stability_balance", "risk_ignorance"],
    ui: {
      showLoops: true,
      focusMode: "all",
    },
  },
];
