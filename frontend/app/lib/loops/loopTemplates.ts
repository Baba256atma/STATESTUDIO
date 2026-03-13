import type { LoopType, SceneLoop, SceneLoopEdge } from "../sceneTypes";
import { clamp01 } from "./loopContract";

export type LoopTemplate = {
  type: LoopType;
  label: string;
  description: string;
  defaultSeverity: number; // 0..1
  defaultStatus: "active" | "warning" | "paused" | "resolved";
  kpis: string[];
  edges: SceneLoopEdge[];
  suggestions: string[];
  objectRoles?: string[];
};

export const LOOP_TEMPLATES: Record<LoopType, LoopTemplate> = {
  quality_protection: {
    type: "quality_protection",
    label: "Quality Protection",
    description: "Quality safeguards that reduce rework and protect delivery commitments.",
    defaultSeverity: 0.35,
    defaultStatus: "active",
    kpis: ["defect_rate", "rework", "customer_sentiment"],
    edges: [
      { from: "obj_quality", to: "obj_delivery", weight: 0.5 },
      { from: "obj_quality", to: "obj_customer", weight: 0.45 },
      { from: "obj_customer", to: "obj_risk", weight: 0.35 },
    ],
    suggestions: [
      "Tighten quality gates before handoff.",
      "Add lightweight inspection on risky items.",
      "Reduce rework by clarifying acceptance criteria.",
      "Stabilize critical paths before scaling volume.",
    ],
    objectRoles: ["quality", "delivery", "customer", "risk"],
  },
  cost_compression: {
    type: "cost_compression",
    label: "Cost Compression",
    description: "Cost-cutting pressure impacting throughput and risk exposure.",
    defaultSeverity: 0.45,
    defaultStatus: "active",
    kpis: ["cost", "throughput", "defect_rate"],
    edges: [
      { from: "obj_cost", to: "obj_delivery", weight: 0.55 },
      { from: "obj_cost", to: "obj_quality", weight: 0.45 },
      { from: "obj_quality", to: "obj_risk", weight: 0.4 },
    ],
    suggestions: [
      "Protect core capacity while reducing cost.",
      "Prefer automation over blanket headcount cuts.",
      "Sequence savings to avoid service disruption.",
      "Add guardrails for risk hotspots during cost moves.",
    ],
    objectRoles: ["cost", "delivery", "quality", "risk"],
  },
  delivery_customer: {
    type: "delivery_customer",
    label: "Delivery & Customer",
    description: "Delivery reliability shaping customer trust and demand stability.",
    defaultSeverity: 0.4,
    defaultStatus: "active",
    kpis: ["delivery", "customer_sentiment", "backlog"],
    edges: [
      { from: "obj_delivery", to: "obj_customer", weight: 0.6 },
      { from: "obj_customer", to: "obj_delivery", weight: 0.45 },
      { from: "obj_risk", to: "obj_delivery", weight: 0.35 },
    ],
    suggestions: [
      "Stabilize lead times for top customer segments.",
      "Communicate ETAs transparently during spikes.",
      "Remove bottlenecks that drive expedites.",
      "Pair delivery fixes with customer updates.",
    ],
    objectRoles: ["delivery", "customer", "risk"],
  },
  risk_ignorance: {
    type: "risk_ignorance",
    label: "Risk Ignorance",
    description: "Invisible risks accumulating until incidents surface.",
    defaultSeverity: 0.55,
    defaultStatus: "active",
    kpis: ["risk", "incident_rate", "stability"],
    edges: [
      { from: "obj_risk", to: "obj_delivery", weight: 0.55 },
      { from: "obj_risk", to: "obj_quality", weight: 0.5 },
      { from: "obj_risk", to: "obj_stability", weight: 0.45 },
    ],
    suggestions: [
      "Surface top 3 risks with owners and mitigations.",
      "Add early-warning signals to catch drift.",
      "Create a rollback path before high-risk changes.",
      "Run tabletop drills for critical failure modes.",
    ],
    objectRoles: ["risk", "delivery", "quality", "stability"],
  },
  stability_balance: {
    type: "stability_balance",
    label: "Stability & Balance",
    description: "Balancing load, stability, and capacity to prevent whiplash.",
    defaultSeverity: 0.3,
    defaultStatus: "active",
    kpis: ["stability", "capacity", "latency"],
    edges: [
      { from: "obj_stability", to: "obj_delivery", weight: 0.5 },
      { from: "obj_delivery", to: "obj_stability", weight: 0.45 },
      { from: "obj_stability", to: "obj_risk", weight: 0.4 },
    ],
    suggestions: [
      "Level work-in-progress to reduce volatility.",
      "Add slack capacity for critical paths.",
      "Sequence changes to avoid overlapping churn.",
      "Monitor stability KPIs alongside throughput goals.",
    ],
    objectRoles: ["stability", "delivery", "risk"],
  },
};

export function listLoopTemplates(): LoopTemplate[] {
  return [
    LOOP_TEMPLATES.quality_protection,
    LOOP_TEMPLATES.cost_compression,
    LOOP_TEMPLATES.delivery_customer,
    LOOP_TEMPLATES.risk_ignorance,
    LOOP_TEMPLATES.stability_balance,
  ];
}

export function makeLoopFromTemplate(
  type: LoopType,
  options?: { id?: string; severity?: number; status?: LoopTemplate["defaultStatus"]; overrides?: Partial<SceneLoop> }
): SceneLoop {
  const tpl = LOOP_TEMPLATES[type];
  if (!tpl) {
    return {
      id: options?.id ?? `loop_${type}_${Date.now()}`,
      type,
      severity: clamp01(options?.severity ?? 0.35),
      status: options?.status ?? "active",
      edges: [],
    };
  }

  const severity = clamp01(options?.severity ?? tpl.defaultSeverity);
  const status = options?.status ?? tpl.defaultStatus;
  const id = options?.id ?? `loop_${type}_${Date.now()}`;

  const base: SceneLoop = {
    id,
    type,
    status,
    severity,
    kpis: [...tpl.kpis],
    edges: Array.isArray(tpl.edges) ? tpl.edges.map((e) => ({ ...e })) : [],
    suggestions: Array.isArray(tpl.suggestions) ? [...tpl.suggestions] : [],
    label: tpl.label,
  };

  if (options?.overrides) {
    return {
      ...base,
      ...options.overrides,
      edges: options.overrides.edges ? options.overrides.edges : base.edges,
    };
  }

  return base;
}
