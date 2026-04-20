/**
 * Retail fragility demo + generic prompt-feedback shaping used by HomeScreen chat.
 * Pure / semi-pure helpers — no React state; callers apply results.
 */
import { clamp } from "../lib/sizeCommands";
import type { SceneJson } from "../lib/sceneTypes";
import {
  getObjectDependencies,
  getObjectDisplayLabel,
  getObjectSemanticMeta,
  getObjectSemanticTags,
  getSceneObjectsFromPayload,
  matchObjectsFromPrompt,
  tokenizeSemanticText,
  type SemanticObject,
} from "../lib/objectSemantics";
import {
  buildSimulationResult,
  createSimulationInputFromPrompt,
  type SimulationRelation,
} from "../lib/decision/simulationContract";
import {
  buildReplaySequence,
  compareScenarioSnapshots,
  createScenarioSnapshot,
} from "../lib/decision/scenarioComparisonReplayContract";
import { buildExecutiveInsightFromSimulation } from "../lib/decision/executiveExplainabilityContract";
import { buildCanonicalRecommendation } from "../lib/decision/recommendation/buildCanonicalRecommendation";
import {
  buildStrategyAwareExecutiveNotes,
  buildStrategyKpiContext,
} from "../lib/strategy/strategyKpiContract";
import { buildDecisionCockpitState } from "../lib/cockpit/decisionCockpitContract";
import type { ActiveModeContext } from "../lib/modes/productModesContract";
import { buildReasoningOutput, createReasoningInput } from "../lib/reasoning/aiReasoningContract";
import { orchestrateMultiAgentDecision } from "../lib/reasoning/multiAgentDecisionEngineContract";
import {
  appendAuditEvents,
  appendTrustProvenance,
  buildProjectGovernanceContext,
  createAuditEvent,
  createTrustProvenance,
} from "../lib/governance/governanceTrustAuditContract";
import { isFeatureEnabled, type EnvironmentConfig } from "../lib/ops/environmentDeploymentContract";
import { buildPlatformAssemblyState } from "../lib/platform/platformAssemblyContract";
import {
  readSceneJsonActiveLoop,
  readSceneJsonMetaString,
  sceneJsonFromUnknown,
  asRecord,
  extractSceneObjectIds,
} from "./homeScreenResponseReaders";
import { normalizeSceneJson } from "./homeScreenUtils";
import { resolveRetailHighlightedObjectIds } from "../lib/domains/retail/resolveRetailPrimaryObject";
import { resolveUnifiedReactionPolicy } from "../lib/reactions/reactionPolicy";
import { normalizeUnifiedSceneReaction, type UnifiedSceneReaction } from "../lib/scene/unifiedReaction";
import { enforceSafeDefaults, sanitizeDecisionPayload } from "../lib/ops/aiPipelineGuard";
import type { DemoVisualMode } from "../lib/demo/demoScript";
import type { MemoryStateV1 } from "../lib/memory/memoryTypes";
import type { NexoraExecutiveFramingStyle } from "../lib/domain/domainExperienceRegistry";

type RetailDemoChatPayload = Record<string, unknown> & {
  scene_json?: unknown;
};

export type RetailTriggerConfig = {
  id:
    | "supplier_delay"
    | "inventory_drop"
    | "demand_spike"
    | "price_increase"
    | "delivery_disruption"
    | "cash_pressure"
    | "customer_trust_drop"
    | "operational_bottleneck";
  tests: RegExp[];
  targets: string[];
  riskEdges: Array<{ from: string; to: string; base: number; delta: number }>;
  driverDelta: Partial<Record<"inventory_pressure" | "time_pressure" | "quality_risk", number>>;
  kpiRiskDelta: number;
  riskSummary: string;
  timelineSteps: [string, string, string];
  adviceAction: string;
  adviceImpact: string;
  adviceWhy: string;
};

export const RETAIL_DEMO_ID = "retail_supply_chain_fragility";

const RETAIL_TRIGGER_CONFIGS: RetailTriggerConfig[] = [
  {
    id: "supplier_delay",
    tests: [/\bsupplier\b.*\bdelay\b/i, /\bdelay\b.*\bsupplier\b/i],
    targets: ["obj_supplier_1", "obj_delivery_1", "obj_delay_1", "obj_inventory_1"],
    riskEdges: [
      { from: "obj_supplier_1", to: "obj_delivery_1", base: 0.68, delta: 0.18 },
      { from: "obj_delay_1", to: "obj_delivery_1", base: 0.64, delta: 0.14 },
      { from: "obj_delivery_1", to: "obj_inventory_1", base: 0.58, delta: 0.12 },
      { from: "obj_inventory_1", to: "obj_customer_satisfaction_1", base: 0.48, delta: 0.08 },
    ],
    driverDelta: { inventory_pressure: 0.1, time_pressure: 0.16, quality_risk: 0.06 },
    kpiRiskDelta: 0.08,
    riskSummary: "Supplier delay is increasing operational risk and is now propagating into capacity and customer impact.",
    timelineSteps: [
      "Immediate: operational flow weakens.",
      "Near-term: capacity buffers tighten.",
      "Follow-up: customer commitments become harder to protect.",
    ],
    adviceAction: "Protect critical capacity and activate backup supply options.",
    adviceImpact: "Stabilizes core flow while reducing downstream customer and service risk.",
    adviceWhy: "Supplier latency is now the dominant source of business-system fragility.",
  },
  {
    id: "inventory_drop",
    tests: [/\binventory\b.*\bdrop\b/i, /\bdrop\b.*\binventory\b/i, /\binventory\b.*\bdecrease\b/i],
    targets: ["obj_inventory_1", "obj_warehouse_1", "obj_order_flow_1", "obj_customer_satisfaction_1"],
    riskEdges: [
      { from: "obj_inventory_1", to: "obj_order_flow_1", base: 0.6, delta: 0.14 },
      { from: "obj_inventory_1", to: "obj_customer_satisfaction_1", base: 0.56, delta: 0.12 },
      { from: "obj_order_flow_1", to: "obj_cash_pressure_1", base: 0.5, delta: 0.09 },
      { from: "obj_warehouse_1", to: "obj_order_flow_1", base: 0.47, delta: 0.07 },
    ],
    driverDelta: { inventory_pressure: 0.17, time_pressure: 0.08, quality_risk: 0.07 },
    kpiRiskDelta: 0.09,
    riskSummary: "Capacity pressure increased and is now stressing fulfillment flow, cash exposure, and customer outcomes.",
    timelineSteps: [
      "Immediate: capacity coverage declines.",
      "Near-term: fulfillment pressure increases.",
      "Follow-up: customer trust may weaken.",
    ],
    adviceAction: "Rebalance capacity and prioritize critical commitments.",
    adviceImpact: "Protects fulfillment reliability while containing customer-impact risk.",
    adviceWhy: "Capacity depletion is the most immediate bottleneck in the current business state.",
  },
  {
    id: "demand_spike",
    tests: [/\bdemand\b.*\bspike\b/i, /\bspike\b.*\bdemand\b/i],
    targets: ["obj_demand_1", "obj_order_flow_1", "obj_inventory_1", "obj_warehouse_1"],
    riskEdges: [
      { from: "obj_demand_1", to: "obj_order_flow_1", base: 0.63, delta: 0.16 },
      { from: "obj_order_flow_1", to: "obj_inventory_1", base: 0.58, delta: 0.12 },
      { from: "obj_inventory_1", to: "obj_warehouse_1", base: 0.54, delta: 0.09 },
      { from: "obj_order_flow_1", to: "obj_cash_pressure_1", base: 0.49, delta: 0.08 },
    ],
    driverDelta: { inventory_pressure: 0.14, time_pressure: 0.12, quality_risk: 0.05 },
    kpiRiskDelta: 0.07,
    riskSummary: "Demand volatility increased and is accelerating pressure across flow, capacity, and operations.",
    timelineSteps: [
      "Immediate: incoming demand rises.",
      "Near-term: capacity burns down faster.",
      "Follow-up: operational strain spreads across the system.",
    ],
    adviceAction: "Increase short-term capacity and monitor buffer burn.",
    adviceImpact: "Reduces service-level degradation during demand surges.",
    adviceWhy: "Demand shock is propagating through every core business flow node.",
  },
  {
    id: "price_increase",
    tests: [/\bprice\b.*\bincrease\b/i, /\bincrease\b.*\bprice\b/i, /\bprice\b.*\brise\b/i, /\bprice\b.*\bpressure\b/i, /\bpressure\b.*\bprice\b/i],
    targets: ["obj_price_1", "obj_demand_1", "obj_cash_pressure_1", "obj_customer_satisfaction_1"],
    riskEdges: [
      { from: "obj_price_1", to: "obj_demand_1", base: 0.62, delta: 0.13 },
      { from: "obj_price_1", to: "obj_cash_pressure_1", base: 0.6, delta: 0.15 },
      { from: "obj_demand_1", to: "obj_customer_satisfaction_1", base: 0.52, delta: 0.08 },
      { from: "obj_cash_pressure_1", to: "obj_customer_satisfaction_1", base: 0.44, delta: 0.07 },
    ],
    driverDelta: { inventory_pressure: 0.06, time_pressure: 0.05, quality_risk: 0.09 },
    kpiRiskDelta: 0.08,
    riskSummary: "Pricing pressure increased and is raising demand sensitivity, cash pressure, and customer-retention risk.",
    timelineSteps: [
      "Immediate: pricing pressure rises.",
      "Near-term: demand sensitivity changes.",
      "Follow-up: margin and cash pressure become visible.",
    ],
    adviceAction: "Assess margin exposure and prepare pricing and communication scenarios.",
    adviceImpact: "Protects revenue stability while reducing customer churn risk.",
    adviceWhy: "Price shock is now a cross-functional risk driver for business performance.",
  },
  {
    id: "delivery_disruption",
    tests: [
      /\bdelivery\b.*\bdisruption\b/i,
      /\bdisruption\b.*\bdelivery\b/i,
      /\bdelivery\b.*\bbreakdown\b/i,
      /\bdelivery\b.*\blate\b/i,
      /\blate\b.*\bdelivery\b/i,
      /\bdelivery\b.*\btoo late\b/i,
      /\btoo late\b.*\bdelivery\b/i,
      /\bdelivery delay\b/i,
      /\bdelayed delivery\b/i,
    ],
    targets: ["obj_delivery_1", "obj_delay_1", "obj_inventory_1", "obj_order_flow_1"],
    riskEdges: [
      { from: "obj_delivery_1", to: "obj_inventory_1", base: 0.64, delta: 0.16 },
      { from: "obj_delay_1", to: "obj_delivery_1", base: 0.66, delta: 0.16 },
      { from: "obj_inventory_1", to: "obj_order_flow_1", base: 0.58, delta: 0.11 },
      { from: "obj_order_flow_1", to: "obj_customer_satisfaction_1", base: 0.5, delta: 0.1 },
    ],
    driverDelta: { inventory_pressure: 0.12, time_pressure: 0.18, quality_risk: 0.06 },
    kpiRiskDelta: 0.09,
    riskSummary: "Operational flow disruption increased execution risk and is now propagating into capacity and fulfillment reliability.",
    timelineSteps: [
      "Immediate: execution flow weakens.",
      "Near-term: operations and capacity coordination suffer.",
      "Follow-up: customer-facing delays become visible.",
    ],
    adviceAction: "Stabilize execution flow and reroute critical work.",
    adviceImpact: "Contains disruption propagation and protects high-priority commitments.",
    adviceWhy: "Operational flow is the most exposed control point in the current business system.",
  },
  {
    id: "cash_pressure",
    tests: [/\bcash\b.*\bpressure\b/i, /\bpressure\b.*\bcash\b/i],
    targets: ["obj_cash_pressure_1", "obj_order_flow_1", "obj_price_1", "obj_customer_satisfaction_1"],
    riskEdges: [
      { from: "obj_cash_pressure_1", to: "obj_order_flow_1", base: 0.52, delta: 0.12 },
      { from: "obj_price_1", to: "obj_cash_pressure_1", base: 0.58, delta: 0.11 },
      { from: "obj_order_flow_1", to: "obj_customer_satisfaction_1", base: 0.46, delta: 0.08 },
    ],
    driverDelta: { inventory_pressure: 0.05, time_pressure: 0.08, quality_risk: 0.12 },
    kpiRiskDelta: 0.08,
    riskSummary: "Cash pressure is tightening decision room and is now threatening service continuity and customer confidence.",
    timelineSteps: [
      "Immediate: financial flexibility narrows.",
      "Near-term: operational trade-offs become harder.",
      "Follow-up: customer trust and growth options weaken.",
    ],
    adviceAction: "Protect liquidity, prioritize critical commitments, and reduce non-essential load.",
    adviceImpact: "Preserves operating stability while containing avoidable downstream risk.",
    adviceWhy: "Cash pressure is turning operational strain into a strategic constraint.",
  },
  {
    id: "customer_trust_drop",
    tests: [/\bcustomer\b.*\btrust\b.*\bdrop\b/i, /\btrust\b.*\bdrop\b/i, /\bcustomer\b.*\btrust\b/i],
    targets: ["obj_customer_satisfaction_1", "obj_order_flow_1", "obj_delivery_1", "obj_cash_pressure_1"],
    riskEdges: [
      { from: "obj_order_flow_1", to: "obj_customer_satisfaction_1", base: 0.5, delta: 0.11 },
      { from: "obj_delivery_1", to: "obj_customer_satisfaction_1", base: 0.52, delta: 0.1 },
      { from: "obj_customer_satisfaction_1", to: "obj_cash_pressure_1", base: 0.42, delta: 0.08 },
    ],
    driverDelta: { inventory_pressure: 0.04, time_pressure: 0.07, quality_risk: 0.13 },
    kpiRiskDelta: 0.08,
    riskSummary: "Customer trust is weakening and is now feeding back into revenue pressure, execution risk, and strategic resilience.",
    timelineSteps: [
      "Immediate: customer confidence slips.",
      "Near-term: service and retention pressure rise together.",
      "Follow-up: commercial and strategic options narrow.",
    ],
    adviceAction: "Protect key customer commitments and address the root service failure quickly.",
    adviceImpact: "Limits trust erosion while protecting revenue and operating credibility.",
    adviceWhy: "Customer trust is a lagging outcome that quickly becomes a strategic risk multiplier.",
  },
  {
    id: "operational_bottleneck",
    tests: [/\boperational\b.*\bbottleneck\b/i, /\bbottleneck\b/i],
    targets: ["obj_delivery_1", "obj_warehouse_1", "obj_order_flow_1", "obj_inventory_1"],
    riskEdges: [
      { from: "obj_delivery_1", to: "obj_order_flow_1", base: 0.54, delta: 0.12 },
      { from: "obj_warehouse_1", to: "obj_order_flow_1", base: 0.51, delta: 0.11 },
      { from: "obj_order_flow_1", to: "obj_inventory_1", base: 0.49, delta: 0.08 },
    ],
    driverDelta: { inventory_pressure: 0.09, time_pressure: 0.14, quality_risk: 0.07 },
    kpiRiskDelta: 0.08,
    riskSummary: "An operational bottleneck is constraining throughput and is now increasing pressure across flow, capacity, and customer outcomes.",
    timelineSteps: [
      "Immediate: throughput slows.",
      "Near-term: backlogs build across dependent work.",
      "Follow-up: customer and financial pressure become harder to contain.",
    ],
    adviceAction: "Relieve the bottleneck, re-sequence critical work, and protect downstream commitments.",
    adviceImpact: "Restores flow control while preventing broader business disruption.",
    adviceWhy: "A constrained operating node can quickly become the system's dominant risk source.",
  },
];

export function normalizeTextForRetail(text: string): string {
  return String(text || "").toLowerCase().trim();
}

export function detectRetailTriggerConfig(text: string): RetailTriggerConfig | null {
  const t = normalizeTextForRetail(text);
  for (const cfg of RETAIL_TRIGGER_CONFIGS) {
    if (cfg.tests.some((rx) => rx.test(t))) return cfg;
  }
  return null;
}

export function isRetailScenePayload(
  payload: RetailDemoChatPayload | null | undefined,
  fallbackScene?: SceneJson | null
): boolean {
  const payloadScene = payload?.scene_json ? normalizeSceneJson(payload.scene_json) : null;
  const scene = payloadScene ?? fallbackScene ?? null;
  if (!scene) return false;

  const sceneObjectIds = extractSceneObjectIds(scene);
  if (!sceneObjectIds.length) return false;

  const requiredRetailKeys = ["obj_supplier_1", "obj_inventory_1", "obj_delivery_1"];
  const resolvedRequiredRetailIds = resolveRetailHighlightedObjectIds(requiredRetailKeys, sceneObjectIds);

  return resolvedRequiredRetailIds.length >= 3;
}

export function isRetailDemoScene(scene: SceneJson | null | undefined): boolean {
  return String(scene?.meta?.demo_id ?? "").trim().toLowerCase() === RETAIL_DEMO_ID;
}

export function upsertRiskEdge(
  edges: any[],
  from: string,
  to: string,
  base: number,
  delta: number
): any[] {
  const next = Array.isArray(edges) ? edges.map((e) => ({ ...e })) : [];
  const idx = next.findIndex((e) => String(e?.from ?? "") === from && String(e?.to ?? "") === to);
  const prev = idx >= 0 ? Number(next[idx]?.weight ?? base) : base;
  const weight = clamp(prev + delta, 0, 0.95);
  if (idx >= 0) {
    next[idx] = { ...next[idx], from, to, weight };
  } else {
    next.push({ from, to, weight });
  }
  return next;
}

function normalizePromptText(text: string): string {
  return String(text || "").toLowerCase().trim();
}

function tokenizePrompt(text: string): string[] {
  return tokenizeSemanticText(normalizePromptText(text)).filter((t) => t.length >= 3);
}

function summarizePropagationPath(labels: string[]): string {
  if (!labels.length) return "the relevant dependency chain";
  if (labels.length === 1) return labels[0];
  return labels.slice(0, 3).join(" -> ");
}

function getSemanticRole(obj: any): string {
  return String(getObjectSemanticMeta(obj)?.role ?? obj?.role ?? "").trim();
}

function roleStage(role: string): number {
  if (role === "risk_source") return 0;
  if (role === "core_system_node") return 1;
  if (role === "flow_node" || role === "operational_node" || role === "support_node") return 2;
  if (role === "buffer_node") return 3;
  if (role === "strategic_node" || role === "kpi_sensitive_node") return 4;
  if (role === "downstream_impact_node" || role === "customer_or_outcome_node") return 5;
  return 6;
}

function orderObjectsForPropagation(objects: any[]): any[] {
  return [...objects].sort((a, b) => {
    const stageDelta = roleStage(getSemanticRole(a)) - roleStage(getSemanticRole(b));
    if (stageDelta !== 0) return stageDelta;
    return getObjectDisplayLabel(a).localeCompare(getObjectDisplayLabel(b));
  });
}

function buildGenericRiskSummary(args: { primaryRole: string; matchedNames: string[]; matchedDependencies: string[] }): string {
  const primary = args.matchedNames[0] ?? "the primary node";
  const secondary = args.matchedNames[1] ?? args.matchedDependencies[0] ?? "connected operations";
  if (args.primaryRole === "risk_source") {
    return `${primary} is the leading source of system stress, and pressure is now moving into ${secondary}.`;
  }
  if (args.primaryRole === "buffer_node") {
    return `${primary} is losing protective capacity, making ${secondary} more fragile.`;
  }
  if (args.primaryRole === "flow_node" || args.primaryRole === "operational_node") {
    return `${primary} is becoming a flow constraint, and stress is spreading into ${secondary}.`;
  }
  if (args.primaryRole === "strategic_node" || args.primaryRole === "kpi_sensitive_node") {
    return `${primary} is becoming a strategic pressure point, with likely spillover into ${secondary}.`;
  }
  if (args.primaryRole === "customer_or_outcome_node" || args.primaryRole === "downstream_impact_node") {
    return `${primary} is already showing downstream impact, signalling broader fragility in ${secondary}.`;
  }
  return `${primary} is the main pressure point, and stress is beginning to spread into ${secondary}.`;
}

function buildGenericTimelineSteps(args: { primaryRole: string; matchedNames: string[]; matchedDependencies: string[] }): [string, string, string] {
  const primary = args.matchedNames[0] ?? "the primary node";
  const secondary = args.matchedNames[1] ?? args.matchedDependencies[0] ?? "connected operations";
  const tertiary =
    args.matchedNames[2] ?? args.matchedDependencies[1] ?? args.matchedNames[1] ?? "downstream outcomes";
  if (args.primaryRole === "risk_source") {
    return [
      `Immediate: disruption starts at ${primary}.`,
      `Near-term: operational stress spreads into ${secondary}.`,
      `Follow-up: ${tertiary} becomes harder to protect.`,
    ];
  }
  if (args.primaryRole === "buffer_node") {
    return [
      `Immediate: resilience weakens at ${primary}.`,
      `Near-term: pressure reaches ${secondary}.`,
      `Follow-up: ${tertiary} loses stability.`,
    ];
  }
  if (args.primaryRole === "customer_or_outcome_node" || args.primaryRole === "downstream_impact_node") {
    return [
      `Immediate: ${primary} shows visible strain.`,
      `Near-term: ${secondary} requires containment.`,
      `Follow-up: ${tertiary} becomes a broader business concern.`,
    ];
  }
  return [
    `Immediate: pressure appears at ${primary}.`,
    `Near-term: impact spreads into ${secondary}.`,
    `Follow-up: ${tertiary} becomes harder to stabilize.`,
  ];
}

function buildGenericAdvice(args: { primaryRole: string; matchedNames: string[]; matchedSemanticTags: string[] }) {
  const primary = args.matchedNames[0] ?? "the exposed node";
  const secondary = args.matchedNames[1] ?? "the connected flow";
  const hasRiskTag = args.matchedSemanticTags.some((tag) => /risk|pressure|fragility/i.test(tag));
  if (args.primaryRole === "risk_source") {
    return {
      action: `Contain ${primary} and protect ${secondary}.`,
      impact: "Reduces the chance that upstream disruption spreads across the system.",
      why: `${primary} is the clearest source of current fragility.`,
    };
  }
  if (args.primaryRole === "buffer_node") {
    return {
      action: `Protect ${primary} and rebuild resilience around ${secondary}.`,
      impact: "Restores shock absorption before downstream performance degrades further.",
      why: `${primary} is the system's main protective buffer in this scenario.`,
    };
  }
  if (args.primaryRole === "customer_or_outcome_node" || args.primaryRole === "downstream_impact_node") {
    return {
      action: `Protect ${primary} and address the upstream driver in ${secondary}.`,
      impact: "Contains visible impact while reducing the source of recurring damage.",
      why: `${primary} signals that the system is already leaking value to the customer side.`,
    };
  }
  if (args.primaryRole === "strategic_node" || args.primaryRole === "kpi_sensitive_node") {
    return {
      action: `Stabilize ${primary} and reduce pressure on ${secondary}.`,
      impact: "Prevents operational strain from turning into a larger business constraint.",
      why: `${primary} is now a business-level pressure node, not just an operational signal.`,
    };
  }
  return {
    action: `Protect ${primary} and stabilize ${secondary}.`,
    impact: hasRiskTag
      ? "Contains current pressure before it spreads across the system."
      : "Reduces propagation risk while preserving system continuity.",
    why: `${primary} is currently the clearest leverage point for limiting downstream disruption.`,
  };
}

export function mapDemoVisualModeToReactionMode(mode: DemoVisualMode) {
  if (mode === "shock" || mode === "fragility") return "risk" as const;
  if (mode === "propagation") return "propagation" as const;
  if (mode === "decision") return "decision" as const;
  if (mode === "outcome") return "neutral_acknowledgement" as const;
  return "focus" as const;
}

export function buildReadableDemoReply(args: {
  riskSummary: string;
  timelineSteps: string[];
  action: string;
  matchedNames?: string[];
}): string {
  const matched = Array.isArray(args.matchedNames) ? args.matchedNames.filter(Boolean) : [];
  const focusText =
    matched.length >= 2
      ? `Focus areas: ${matched.slice(0, 2).join(" and ")}. `
      : matched.length === 1
      ? `Focus area: ${matched[0]}. `
      : "";
  const [immediate, nearTerm, followUp] = Array.isArray(args.timelineSteps) ? args.timelineSteps : [];
  return [
    `${focusText}Risk: ${args.riskSummary}`,
    `Timeline: ${immediate ?? ""} ${nearTerm ?? ""} ${followUp ?? ""}`.trim(),
    `Recommended action: ${args.action}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildExecutiveSummarySurface(args: {
  matchedNames?: string[];
  primaryRole?: string;
  riskSummary?: string;
  timelineSteps?: string[];
  adviceAction?: string;
  adviceWhy?: string;
  domainLabel?: string;
  framingStyle?: "systemic" | "operational" | "financial" | "resilience" | "strategic";
}): { happened: string; why_it_matters: string; what_to_do: string; summary: string } {
  const matched = Array.isArray(args.matchedNames) ? args.matchedNames.filter(Boolean) : [];
  const primary = matched[0] ?? "The primary node";
  const secondary = matched[1] ?? "connected operations";
  const followUp = Array.isArray(args.timelineSteps) ? String(args.timelineSteps[2] ?? "").trim() : "";
  const adviceAction = String(args.adviceAction ?? "Protect the exposed node and stabilize the system.").trim();
  const riskSummary = String(args.riskSummary ?? "").trim() || `${primary} is now under pressure.`;
  const framingStyle = String(args.framingStyle ?? "systemic").trim();
  const domainLabel = String(args.domainLabel ?? "system").trim() || "system";

  let happened = riskSummary;
  let whyItMatters =
    followUp || `${primary} is connected to dependent operations, so the disruption is becoming systemic.`;

  if (args.primaryRole === "risk_source") {
    happened = `${primary} is now stressing ${secondary}.`;
    whyItMatters = followUp || "The disruption is no longer isolated; it is spreading into core operations.";
  } else if (args.primaryRole === "buffer_node") {
    happened = `${primary} is weakening and can no longer absorb pressure cleanly.`;
    whyItMatters = followUp || "If buffer capacity erodes further, downstream service and customer risk will rise.";
  } else if (args.primaryRole === "strategic_node" || args.primaryRole === "kpi_sensitive_node") {
    happened = `${primary} is becoming a broader business constraint.`;
    whyItMatters = followUp || "This matters because financial and operating pressure are now reinforcing each other.";
  } else if (args.primaryRole === "customer_or_outcome_node" || args.primaryRole === "downstream_impact_node") {
    happened = `${primary} is already showing visible downstream impact.`;
    whyItMatters = followUp || "This matters because customer-facing impact usually signals a wider system failure.";
  }

  if (framingStyle === "financial") {
    happened = `${primary} is increasing financial exposure across the ${domainLabel.toLowerCase()} system.`;
    whyItMatters = followUp || "This matters because liquidity, downside risk, and concentration can reinforce each other quickly.";
  } else if (framingStyle === "resilience") {
    happened = `${primary} is weakening service resilience across connected dependencies.`;
    whyItMatters = followUp || "This matters because localized failures can propagate into broader reliability loss.";
  } else if (framingStyle === "strategic") {
    happened = `${primary} is shifting the strategic position and response space.`;
    whyItMatters = followUp || "This matters because pressure is now shaping competitive choices, not just local execution.";
  } else if (framingStyle === "operational") {
    happened = `${primary} is pressuring core operations in the ${domainLabel.toLowerCase()} system.`;
    whyItMatters = followUp || "This matters because operational pressure is moving from one node into wider business continuity risk.";
  }

  const actionLead =
    framingStyle === "strategic"
      ? "Recommended strategic response"
      : framingStyle === "financial"
      ? "Recommended financial action"
      : framingStyle === "resilience"
      ? "Recommended resilience action"
      : "Recommended action";
  const whatToDo = `${actionLead}: ${adviceAction}`;
  const summary = `${happened} ${whyItMatters} ${whatToDo}`.trim();
  return {
    happened,
    why_it_matters: whyItMatters,
    what_to_do: whatToDo,
    summary,
  };
}

export function buildUnifiedReactionFromRetailTriggerConfig(
  cfg: RetailTriggerConfig,
  scene: SceneJson | null | undefined
): UnifiedSceneReaction {
  const sceneObjectIds = extractSceneObjectIds(scene);
  const resolvedHighlightedObjectIds = resolveRetailHighlightedObjectIds(cfg.targets, sceneObjectIds);
  const resolvedRiskSources = resolveRetailHighlightedObjectIds(
    cfg.riskEdges.map((edge) => edge.from),
    sceneObjectIds
  );
  const resolvedRiskTargets = resolveRetailHighlightedObjectIds(
    cfg.riskEdges.map((edge) => edge.to),
    sceneObjectIds
  );
  const shouldDimUnrelated = resolvedHighlightedObjectIds.length > 0;

  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora][RetailHighlightResolution]", {
      rawRetailTargets: cfg.targets,
      resolvedRetailTargets: resolvedHighlightedObjectIds,
      dimUnrelatedObjects: shouldDimUnrelated,
      sceneObjectIds: shouldDimUnrelated ? undefined : sceneObjectIds,
    });
  }

  return normalizeUnifiedSceneReaction(resolveUnifiedReactionPolicy({
    source: "chat",
    reason: cfg.riskSummary,
    fallbackHighlightText: [cfg.riskSummary, ...cfg.timelineSteps, cfg.adviceAction].join(" "),
    highlightedObjectIds: resolvedHighlightedObjectIds,
    riskSources: resolvedRiskSources,
    riskTargets: resolvedRiskTargets,
    reactionModeHint: resolvedRiskSources.length > 0 || resolvedRiskTargets.length > 0 ? "risk" : "focus",
    activeLoopId: null,
    loopSuggestions: [],
    actions: [],
    allowFocusMutation: true,
    sceneJson: null,
  }));
}

export function applyGenericPromptFeedbackEnhancement(
  rawPayload: any,
  userText: string,
  fallbackScene: SceneJson | null,
  modeContext?: ActiveModeContext | null,
  reasoningHints?: {
    workspaceId?: string;
    selectedObjectId?: string | null;
    memoryState?: any;
    environmentConfig?: EnvironmentConfig | null;
  }
): any {
  if (!rawPayload || typeof rawPayload !== "object") return rawPayload;

  const objects = getSceneObjectsFromPayload(rawPayload, fallbackScene);
  const matched = matchObjectsFromPrompt(userText, objects, 3);
  const matchedIds = matched.map((m) => m.id);
  if (!matchedIds.length) return rawPayload;

  const next: any = { ...rawPayload };
  const matchedObjects = matchedIds
    .map((id) => objects.find((o: any) => String(o?.id ?? o?.name ?? "") === id))
    .filter(Boolean);
  const orderedMatchedObjects = orderObjectsForPropagation(matchedObjects);
  const matchedNames = orderedMatchedObjects.map((o: any) => getObjectDisplayLabel(o));
  const matchedTopics = tokenizePrompt(userText).slice(0, 5);
  const matchedSemanticTags = Array.from(
    new Set(
      orderedMatchedObjects
        .flatMap((o: any) => getObjectSemanticTags(o))
        .map((x: any) => String(x || "").trim())
        .filter(Boolean)
    )
  ).slice(0, 5);
  const matchedDependencies = Array.from(
    new Set(orderedMatchedObjects.flatMap((o: any) => getObjectDependencies(o)))
  ).slice(0, 5);
  const primaryRole = getSemanticRole(orderedMatchedObjects[0]);
  const propagationPath = summarizePropagationPath([...matchedNames, ...matchedDependencies]);

  const baseSelection =
    (next?.object_selection && typeof next.object_selection === "object" ? next.object_selection : null) ??
    (next?.scene_json?.object_selection && typeof next.scene_json.object_selection === "object"
      ? next.scene_json.object_selection
      : null) ??
    {};
  const priorHighlights = Array.isArray(baseSelection?.highlighted_objects) ? baseSelection.highlighted_objects : [];
  const orderedMatchedIds = orderedMatchedObjects.map((o: any) => String(o?.id ?? o?.name ?? ""));
  const highlighted = Array.from(new Set([...orderedMatchedIds, ...priorHighlights])).slice(0, 4);
  next.object_selection = {
    ...baseSelection,
    highlighted_objects: highlighted,
    ranked_objects: matched.map((item) => ({ id: item.id, score: Number((item.score / 10).toFixed(2)) })),
  };

  const baseRisk =
    (next?.risk_propagation && typeof next.risk_propagation === "object" ? next.risk_propagation : null) ??
    (next?.scene_json?.risk_propagation && typeof next.scene_json.risk_propagation === "object"
      ? next.scene_json.risk_propagation
      : null) ??
    (next?.scene_json?.scene?.risk_propagation && typeof next.scene_json.scene.risk_propagation === "object"
      ? next.scene_json.scene.risk_propagation
      : null) ??
    {};
  const priorSources = Array.isArray(baseRisk?.sources) ? baseRisk.sources : [];
  const riskSources = Array.from(new Set([...priorSources, ...orderedMatchedIds]));
  const riskSummary = buildGenericRiskSummary({ primaryRole, matchedNames, matchedDependencies });
  next.risk_propagation = {
    ...baseRisk,
    sources: riskSources.slice(0, 3),
    path: propagationPath,
    summary:
      typeof baseRisk?.summary === "string" && baseRisk.summary.trim().length > 20
        ? baseRisk.summary
        : riskSummary,
  };

  const timelineSteps = buildGenericTimelineSteps({ primaryRole, matchedNames, matchedDependencies });
  next.timeline_impact = {
    trigger: "generic_prompt_feedback",
    immediate: timelineSteps[0],
    near_term: timelineSteps[1],
    follow_up: timelineSteps[2],
    steps: timelineSteps,
    path: propagationPath,
  };

  const baseAdvice =
    (next?.strategic_advice && typeof next.strategic_advice === "object" ? next.strategic_advice : null) ??
    (next?.scene_json?.strategic_advice && typeof next.scene_json.strategic_advice === "object"
      ? next.scene_json.strategic_advice
      : null) ??
    {};
  const genericAdvice = buildGenericAdvice({ primaryRole, matchedNames, matchedSemanticTags });
  const genericAction = {
    id: `generic_${matchedIds[0] ?? "node"}`,
    type: "generic_response",
    action: genericAdvice.action,
    targets: orderedMatchedIds,
    impact: genericAdvice.impact,
    priority: 1,
  };
  const existingActions = Array.isArray(baseAdvice?.recommended_actions) ? baseAdvice.recommended_actions : [];
  next.strategic_advice = {
    ...baseAdvice,
    primary_recommendation: genericAction,
    recommended_actions: [genericAction, ...existingActions.filter((action: any) => action?.action !== genericAction.action)].slice(0, 3),
    why: genericAdvice.why,
    summary: `Recommended action: ${genericAction.action}`,
    confidence: Number.isFinite(Number(baseAdvice?.confidence)) ? Number(baseAdvice.confidence) : 0.72,
  };

  next.reply = buildReadableDemoReply({
    riskSummary: next.risk_propagation?.summary ?? riskSummary,
    timelineSteps,
    action: next.strategic_advice?.primary_recommendation?.action ?? genericAction.action,
    matchedNames,
  });
  const executiveSummarySurface = buildExecutiveSummarySurface({
    matchedNames,
    primaryRole,
    riskSummary: next.risk_propagation?.summary ?? riskSummary,
    timelineSteps,
    adviceAction: next.strategic_advice?.primary_recommendation?.action ?? genericAction.action,
    adviceWhy: next.strategic_advice?.why ?? genericAdvice.why,
    domainLabel: modeContext?.project_domain ?? "system",
    framingStyle: "systemic",
  });
  next.executive_summary_surface = executiveSummarySurface;
  next.analysis_summary = executiveSummarySurface.summary;

  const nextSjMeta = asRecord(asRecord(next?.scene_json)?.["meta"]);
  const fallbackMeta = asRecord(fallbackScene?.meta);
  const projectId = String(
    nextSjMeta?.["project_id"] ??
      nextSjMeta?.["demo_id"] ??
      fallbackMeta?.["project_id"] ??
      fallbackMeta?.["demo_id"] ??
      "default"
  );
  const nextSjScene = asRecord(asRecord(next?.scene_json)?.["scene"]);
  const relationList = Array.isArray(nextSjScene?.["relations"]) ? nextSjScene["relations"] : [];
  const simInput = createSimulationInputFromPrompt({
    text: userText,
    matchedObjectIds: matchedIds,
    topics: matchedTopics,
    kind: "decision",
    magnitude: 0.62,
    metadata: { source: "prompt_feedback_generic" },
  });
  const decisionSimulation = buildSimulationResult({
    projectId,
    scenarioName: `Prompt Scenario: ${userText}`,
    input: simInput,
    objects: objects as SemanticObject[],
    relations: relationList as SimulationRelation[],
    riskSummary: next.risk_propagation?.summary ?? riskSummary,
    timelineSteps,
    recommendation: next.strategic_advice?.primary_recommendation?.action ?? genericAction.action,
    confidence: Number(next?.strategic_advice?.confidence ?? 0.72),
    affectedDimensions: ["dependency_stability", "operational_pressure", ...matchedSemanticTags].slice(0, 4),
  });
  next.decision_simulation = decisionSimulation;
  const scenarioSnapshot = createScenarioSnapshot({
    projectId,
    simulation: decisionSimulation,
    sceneJson: sceneJsonFromUnknown(next?.scene_json) ?? fallbackScene ?? null,
    semanticObjectMeta: orderedMatchedObjects.reduce((acc: Record<string, any>, o: any) => {
      const oid = String(o?.id ?? o?.name ?? "").trim();
      if (!oid) return acc;
      acc[oid] = o?.semantic ?? {
        category: o?.category,
        role: o?.role,
        domain: o?.domain,
        tags: Array.isArray(o?.tags) ? o.tags : undefined,
      };
      return acc;
    }, {}),
    baselineRef: decisionSimulation?.comparisonReady?.baseline?.scenarioId
      ? {
          projectId,
          scenarioId: String(decisionSimulation.comparisonReady.baseline.scenarioId),
          timestamp: Date.now(),
          name: "Baseline",
        }
      : null,
  });
  const replaySequence = buildReplaySequence(scenarioSnapshot);
  const scenarioComparison = compareScenarioSnapshots({
    baseline: null,
    current: scenarioSnapshot,
    mode: "baseline_vs_impacted",
  });
  const semanticMetaById = orderedMatchedObjects.reduce(
    (acc: Record<string, { role?: string; category?: string; domain?: string }>, o: any) => {
      const id = String(o?.id ?? o?.name ?? "").trim();
      if (!id) return acc;
      acc[id] = {
        role: String(o?.semantic?.role ?? o?.role ?? "").trim() || undefined,
        category: String(o?.semantic?.category ?? o?.category ?? "").trim() || undefined,
        domain: String(o?.semantic?.domain ?? o?.domain ?? "").trim() || undefined,
      };
      return acc;
    },
    {}
  );
  const executiveInsight = buildExecutiveInsightFromSimulation({
    simulation: decisionSimulation,
    comparison: scenarioComparison,
    semanticMetaById,
  });
  const strategyKpiContext = buildStrategyKpiContext({
    simulation: decisionSimulation,
    comparison: scenarioComparison,
    objects: objects as SemanticObject[],
    semanticObjectMeta: orderedMatchedObjects.reduce((acc: Record<string, any>, o: any) => {
      const oid = String(o?.id ?? o?.name ?? "").trim();
      if (!oid) return acc;
      acc[oid] = o?.semantic ?? {};
      return acc;
    }, {}),
    domain:
      readSceneJsonMetaString(next?.scene_json, "domain") ||
      readSceneJsonMetaString(fallbackScene, "domain") ||
      undefined,
  });
  const executiveInsightWithStrategy = {
    ...executiveInsight,
    summary: executiveSummarySurface.summary,
    explanation_notes: Array.from(
      new Set([
        executiveSummarySurface.happened,
        executiveSummarySurface.why_it_matters,
        ...(Array.isArray(executiveInsight?.explanation_notes) ? executiveInsight.explanation_notes : []),
        ...buildStrategyAwareExecutiveNotes({
          strategy: strategyKpiContext.strategy,
          summary: strategyKpiContext.summary,
        }),
      ])
    ),
    comparison_insights: Array.from(
      new Set([
        ...(Array.isArray(executiveInsight?.comparison_insights) ? executiveInsight.comparison_insights : []),
        ...(strategyKpiContext.comparison?.notes ?? []),
      ])
    ),
  };
  next.decision_scenario_snapshot = scenarioSnapshot;
  next.decision_replay = replaySequence;
  next.decision_comparison = scenarioComparison;
  next.executive_insight = executiveInsightWithStrategy;
  next.strategy_kpi = {
    ...strategyKpiContext,
    generated_from: "generic_prompt_feedback",
  };
  const decisionCockpit = buildDecisionCockpitState({
    workspaceId: "default_workspace",
    projectId,
    projectName: readSceneJsonMetaString(next?.scene_json, "project_name") || undefined,
    projectDomain: readSceneJsonMetaString(next?.scene_json, "domain") || undefined,
    sceneJson: sceneJsonFromUnknown(next?.scene_json) ?? fallbackScene ?? null,
    payload: next,
    selectedObjectId: null,
    selectedObjectLabel: null,
    focusMode: "all",
    focusPinned: false,
    activeLoopId: readSceneJsonActiveLoop(next?.scene_json) || null,
    memoryState: null,
    modeContext: modeContext ?? undefined,
  });
  next.decision_cockpit = decisionCockpit;
  next.decision_cockpit = {
    ...decisionCockpit,
    executive: {
      ...decisionCockpit.executive,
      summary: executiveSummarySurface.summary,
      happened: executiveSummarySurface.happened,
      why_it_matters: executiveSummarySurface.why_it_matters,
      what_to_do: executiveSummarySurface.what_to_do,
    },
  };
  if (modeContext) {
    next.product_mode = modeContext;
  }
  const memoryObjects = reasoningHints?.memoryState?.objects ?? {};
  const volatileNodes = Object.entries(memoryObjects)
    .filter(([, value]: any) => Number(value?.volatility ?? 0) >= 0.35)
    .map(([id]) => id)
    .slice(0, 5);
  const recurringPatterns = Object.keys(reasoningHints?.memoryState?.loops ?? {}).slice(0, 5);
  const reasoningInput = createReasoningInput({
    prompt: userText,
    context: {
      workspace_id: reasoningHints?.workspaceId,
      project_id: projectId,
      project_domain:
        readSceneJsonMetaString(next?.scene_json, "domain") ||
        readSceneJsonMetaString(fallbackScene, "domain") ||
        undefined,
      selected_object_id: reasoningHints?.selectedObjectId ?? null,
      active_mode: modeContext ?? null,
      memory_signals: {
        volatile_nodes: volatileNodes,
        recurring_patterns: recurringPatterns,
      },
      scanner_context:
        next?.scanner && typeof next.scanner === "object"
          ? {
              source_type: String(next?.scanner?.lastSource?.type ?? "").trim() || undefined,
              source_id: String(next?.scanner?.lastSource?.id ?? "").trim() || undefined,
              confidence: Number.isFinite(Number(next?.scanner?.confidence))
                ? Number(next?.scanner?.confidence)
                : undefined,
            }
          : undefined,
    },
    semanticObjects: objects as SemanticObject[],
    simulationContext: {
      baseline_available: !!scenarioComparison?.baselineReady?.baselineAvailable,
      active_scenario_id: String(decisionSimulation?.scenario?.id ?? "").trim() || undefined,
    },
    strategyContext: {
      at_risk_kpis: strategyKpiContext?.summary?.at_risk_kpis ?? [],
      threatened_objectives: strategyKpiContext?.summary?.threatened_objectives ?? [],
    },
  });
  const aiReasoning = buildReasoningOutput(reasoningInput);
  next.ai_reasoning = aiReasoning;
  const multiAgentEnabled =
    isFeatureEnabled(reasoningHints?.environmentConfig, "multi_agent") &&
    !(
      isFeatureEnabled(reasoningHints?.environmentConfig, "disable_multi_agent_if_unstable") &&
      (
        Number(aiReasoning?.confidence?.score ?? aiReasoning?.confidence ?? 0.5) < 0.45 ||
        (Array.isArray(aiReasoning?.ambiguity_notes) && aiReasoning.ambiguity_notes.length > 2)
      )
    );
  const multiAgentDecision = multiAgentEnabled
    ? orchestrateMultiAgentDecision({
        context: {
          workspace_id: reasoningHints?.workspaceId,
          project_id: projectId,
          project_domain:
            readSceneJsonMetaString(next?.scene_json, "domain") ||
            readSceneJsonMetaString(fallbackScene, "domain") ||
            undefined,
          prompt: userText,
          selected_object_id: reasoningHints?.selectedObjectId ?? null,
          mode_context: modeContext ?? null,
          matched_object_ids: matchedIds,
          semantic_signals: {
            tags: matchedSemanticTags,
            dependencies: matchedDependencies,
          },
          reasoning: aiReasoning,
          simulation: decisionSimulation,
          comparison: scenarioComparison,
          strategy: strategyKpiContext?.strategy ?? null,
          memory: {
            volatile_nodes: volatileNodes,
            recurring_patterns: recurringPatterns,
          },
          scanner:
            next?.scanner && typeof next.scanner === "object"
              ? {
                  source_type: String(next?.scanner?.lastSource?.type ?? "").trim() || undefined,
                  confidence: Number.isFinite(Number(next?.scanner?.confidence))
                    ? Number(next?.scanner?.confidence)
                    : undefined,
                  unresolved_items: Array.isArray(next?.scanner?.unresolvedItems) ? next.scanner.unresolvedItems : [],
                }
              : null,
          exploration:
            next?.autonomous_exploration && typeof next.autonomous_exploration === "object"
              ? {
                  fragile_object_ids: Array.isArray(next?.autonomous_exploration?.summary?.fragile_object_ids)
                    ? next.autonomous_exploration.summary.fragile_object_ids
                    : [],
                  highest_severity: Number.isFinite(Number(next?.autonomous_exploration?.summary?.highest_severity))
                    ? Number(next.autonomous_exploration.summary.highest_severity)
                    : undefined,
                  mitigation_ideas: Array.isArray(next?.autonomous_exploration?.summary?.top_mitigation_ideas)
                    ? next.autonomous_exploration.summary.top_mitigation_ideas
                    : [],
                }
              : null,
        },
      })
    : {
        plan: {
          mode: "single_path",
          selected_agents: [],
          reason: "Multi-agent disabled by environment capability flags.",
        },
        contributions: [],
        merged: {
          findings: [],
          matched_objects: matchedIds.slice(0, 6),
          scenario_suggestions: [],
          recommendations: [],
          explanation_notes: [],
        },
        conflicts: [],
        consensus: {
          agreement_topics: [],
          disagreement_topics: [],
          unresolved_ambiguities: ["Multi-agent path disabled in current environment."],
          merged_confidence: aiReasoning?.confidence?.score ?? 0.5,
        },
        trace: {
          invoked_count: 0,
          agent_order: [],
        },
      };
  next.multi_agent_decision = multiAgentDecision;
  const platformAssembly = buildPlatformAssemblyState({
    workspaceId: reasoningHints?.workspaceId ?? "default_workspace",
    projectId,
    projectName: readSceneJsonMetaString(next?.scene_json, "project_name") || undefined,
    projectDomain:
      readSceneJsonMetaString(next?.scene_json, "domain") ||
      readSceneJsonMetaString(fallbackScene, "domain") ||
      undefined,
    selectedObjectId: reasoningHints?.selectedObjectId ?? null,
    focusMode: (modeContext?.detail_profile?.object_detail === "minimal" ? "all" : "selected") as "all" | "selected",
    modeContext: modeContext ?? null,
    reasoning: aiReasoning,
    simulation: decisionSimulation,
    comparison: scenarioComparison,
    replay: replaySequence,
    executive: executiveInsightWithStrategy,
    strategy: strategyKpiContext?.strategy ?? null,
    cockpit: decisionCockpit,
    memory: {
      volatile_nodes: volatileNodes,
      recurring_patterns: recurringPatterns,
    },
    theme: readSceneJsonMetaString(next?.scene_json, "theme") || "night",
    environmentConfig: reasoningHints?.environmentConfig ?? null,
  });
  next.platform_assembly = platformAssembly;
  const governanceContext = buildProjectGovernanceContext({
    workspace_id: reasoningHints?.workspaceId ?? "default_workspace",
    project_id: projectId,
    project_status: modeContext?.mode_id === "demo" ? "experimental" : "draft",
    scenario_status: "draft",
    recommendation_status: "review",
    governance: {
      trusted_source_classification:
        next?.scanner || next?.external_integration ? "mixed" : "trusted",
      role_intent_hints: [String(modeContext?.mode_id ?? "manager")],
    },
  });
  const reasoningProv = createTrustProvenance({
    kind: "prompt_interpretation",
    source: {
      source_id: "prompt_input",
      source_label: "User Prompt",
      source_type: "prompt",
      subsystem: "ai_reasoning",
      version: "a19",
    },
    transformation_path: ["prompt", "semantic_match", "reasoning_path_selection"],
    confidence: aiReasoning?.confidence?.score,
    uncertainty_notes: aiReasoning?.ambiguity_notes,
  });
  const simulationProv = createTrustProvenance({
    kind: "simulation_output",
    source: {
      source_id: String(decisionSimulation?.scenario?.id ?? "simulation"),
      source_label: String(decisionSimulation?.scenario?.name ?? "Scenario"),
      source_type: "simulation",
      subsystem: "simulation_engine",
      version: "a10",
    },
    transformation_path: ["scenario_input", "propagation", "timeline", "impact_summary"],
    confidence: decisionSimulation?.confidence,
    uncertainty_notes: decisionSimulation?.impact?.uncertainty ? [decisionSimulation.impact.uncertainty] : undefined,
  });
  const recommendationProv = createTrustProvenance({
    kind: "recommendation_output",
    source: {
      source_id: "strategic_advice",
      source_label: "Strategic Advice",
      source_type: "advice",
      subsystem: "explainability_strategy",
      version: "a12-a13",
    },
    transformation_path: ["risk_summary", "strategy_kpi", "advice_generation"],
    confidence: Number(next?.strategic_advice?.confidence ?? aiReasoning?.confidence?.score ?? 0.72),
  });
  const multiAgentProv = createTrustProvenance({
    kind: "multi_agent_output",
    source: {
      source_id: "multi_agent_decision",
      source_label: "Multi-Agent",
      source_type: "agent_orchestration",
      subsystem: "multi_agent_engine",
      version: "a23",
    },
    transformation_path: ["agent_selection", "agent_contributions", "consensus_merge"],
    confidence: multiAgentDecision?.consensus?.merged_confidence,
    uncertainty_notes: multiAgentDecision?.consensus?.unresolved_ambiguities,
  });
  next.governance_context = governanceContext;
  next.trust_provenance = appendTrustProvenance(next?.trust_provenance, [
    reasoningProv,
    simulationProv,
    recommendationProv,
    multiAgentProv,
  ]);
  next.audit_events = appendAuditEvents(next?.audit_events, [
    createAuditEvent({
      event_type: "prompt_submitted",
      category: "prompt_reasoning",
      workspace_id: reasoningHints?.workspaceId ?? "default_workspace",
      project_id: projectId,
      origin_type: "user",
      actor_hint: "prompt",
      affected_entity: "prompt",
      provenance_ref_id: reasoningProv.id,
    }),
    createAuditEvent({
      event_type: "reasoning_generated",
      category: "prompt_reasoning",
      workspace_id: reasoningHints?.workspaceId ?? "default_workspace",
      project_id: projectId,
      origin_type: "agent",
      actor_hint: "ai_reasoning",
      affected_entity: aiReasoning.path,
      provenance_ref_id: reasoningProv.id,
      explanation_notes: aiReasoning?.ambiguity_notes,
    }),
    createAuditEvent({
      event_type: "simulation_run",
      category: "simulation_scenario",
      workspace_id: reasoningHints?.workspaceId ?? "default_workspace",
      project_id: projectId,
      origin_type: "system",
      actor_hint: "simulation_engine",
      affected_entity: String(decisionSimulation?.scenario?.id ?? "scenario"),
      provenance_ref_id: simulationProv.id,
    }),
    createAuditEvent({
      event_type: "recommendation_generated",
      category: "recommendation_explainability",
      workspace_id: reasoningHints?.workspaceId ?? "default_workspace",
      project_id: projectId,
      origin_type: "agent",
      actor_hint: "recommendation_agent",
      affected_entity: "strategic_advice",
      provenance_ref_id: recommendationProv.id,
    }),
  ]);

  next.prompt_feedback = {
    matched_objects: matchedIds,
    matched_topics: matchedTopics,
    scene_feedback: {
      highlighted_objects: highlighted,
      emphasis_updates: matchedIds.map((id, i) => ({ id, emphasis: Number((0.86 - i * 0.1).toFixed(2)) })),
    },
    risk_feedback: {
      summary: next.risk_propagation?.summary ?? riskSummary,
      affected_dimensions: ["dependency_stability", "operational_pressure", ...matchedSemanticTags].slice(0, 4),
      changed_drivers: matchedTopics.slice(0, 3),
    },
    timeline_feedback: {
      steps: timelineSteps,
      dependency_hints: matchedDependencies,
    },
    advice_feedback: {
      summary: next.strategic_advice?.summary,
      recommendation: next.strategic_advice?.primary_recommendation?.action ?? genericAction.action,
    },
    strategy_kpi: {
      summary: strategyKpiContext.summary,
      kpi_impacts: strategyKpiContext.kpi_impacts,
      objective_impacts: strategyKpiContext.objective_impacts,
      comparison_notes: strategyKpiContext.comparison?.notes ?? [],
    },
    decision_cockpit: {
      scene: decisionCockpit.scene,
      risk: decisionCockpit.risk,
      strategy: decisionCockpit.strategy,
      comparison: decisionCockpit.comparison,
      advice: decisionCockpit.advice,
      executive: decisionCockpit.executive,
    },
    reasoning: {
      intent: aiReasoning.intent,
      path: aiReasoning.path,
      confidence: aiReasoning.confidence,
      matched_concepts: aiReasoning.matched_concepts,
      trace: aiReasoning.trace,
      ambiguity_notes: aiReasoning.ambiguity_notes,
    },
    multi_agent: {
      plan: multiAgentDecision.plan,
      consensus: multiAgentDecision.consensus,
      conflicts: multiAgentDecision.conflicts,
      merged: multiAgentDecision.merged,
      trace: multiAgentDecision.trace,
    },
    governance: {
      project_status: governanceContext.project_status,
      scenario_status: governanceContext.scenario_status,
      recommendation_status: governanceContext.recommendation_status,
      trust_classification: governanceContext.governance.trusted_source_classification,
      environment: reasoningHints?.environmentConfig?.deployment?.environment,
    },
    trust_provenance: {
      latest_ids: [reasoningProv.id, simulationProv.id, recommendationProv.id, multiAgentProv.id],
      latest_kinds: [
        reasoningProv.kind,
        simulationProv.kind,
        recommendationProv.kind,
        multiAgentProv.kind,
      ],
    },
    audit: {
      latest_event_types: ["prompt_submitted", "reasoning_generated", "simulation_run", "recommendation_generated"],
      total_events: Array.isArray(next.audit_events) ? next.audit_events.length : 0,
    },
    deployment_ops: {
      environment: reasoningHints?.environmentConfig?.deployment?.environment,
      logging_mode: reasoningHints?.environmentConfig?.logging_mode,
      safe_mode: reasoningHints?.environmentConfig?.runtime_safety?.safe_mode,
      restricted_mode: reasoningHints?.environmentConfig?.runtime_safety?.restricted_mode,
      enabled_features: reasoningHints?.environmentConfig
        ? Object.entries(reasoningHints.environmentConfig.features)
            .filter(([, enabled]) => !!enabled)
            .map(([feature]) => feature)
        : [],
    },
    platform_assembly: {
      lifecycle: platformAssembly.lifecycle,
      active_project: platformAssembly.activeProject,
      active_mode: platformAssembly.activeMode
        ? { mode_id: platformAssembly.activeMode.mode_id, mode_label: platformAssembly.activeMode.mode_label }
        : null,
      reasoning_context: platformAssembly.reasoningContext,
      simulation_context: platformAssembly.simulationContext,
      cockpit_context: platformAssembly.cockpitContext,
      extension_points: platformAssembly.extension_points,
      environment_context: platformAssembly.environment_context,
    },
    simulation: decisionSimulation,
    scenario_snapshot: scenarioSnapshot,
    replay: replaySequence,
    comparison: scenarioComparison,
    executive_insight: executiveInsightWithStrategy,
  };

  const baseReply = typeof next.reply === "string" && next.reply.trim().length ? `${next.reply.trim()} ` : "";
  if (!baseReply.toLowerCase().includes("recommended action")) {
    next.reply = `${baseReply}${next.risk_propagation.summary} Timeline: ${timelineSteps.join(" ")} Recommended action: ${genericAction.action}`;
  }
  if (typeof next.analysis_summary !== "string" || next.analysis_summary.trim().length < 12) {
    next.analysis_summary = `${next.risk_propagation.summary} ${timelineSteps[1]}`;
  }

  next.canonical_recommendation = buildCanonicalRecommendation(next);

  return enforceSafeDefaults(sanitizeDecisionPayload(next));
}

type ChatPayloadRecord = Record<string, unknown>;

function extractPayloadRiskPropagation(payload: ChatPayloadRecord): Record<string, unknown> | null {
  if (payload.risk_propagation && typeof payload.risk_propagation === "object") return payload.risk_propagation as Record<string, unknown>;
  const ctx = payload.context;
  if (ctx && typeof ctx === "object" && (ctx as ChatPayloadRecord).risk_propagation && typeof (ctx as ChatPayloadRecord).risk_propagation === "object") {
    return (ctx as ChatPayloadRecord).risk_propagation as Record<string, unknown>;
  }
  const sj = payload.scene_json;
  if (sj && typeof sj === "object") {
    const s = sj as Record<string, unknown>;
    if (s.risk_propagation && typeof s.risk_propagation === "object") return s.risk_propagation as Record<string, unknown>;
    const scene = s.scene;
    if (scene && typeof scene === "object" && (scene as Record<string, unknown>).risk_propagation && typeof (scene as Record<string, unknown>).risk_propagation === "object") {
      return (scene as Record<string, unknown>).risk_propagation as Record<string, unknown>;
    }
  }
  return null;
}

function extractPayloadStrategicAdvice(payload: ChatPayloadRecord): Record<string, unknown> | null {
  if (payload.strategic_advice && typeof payload.strategic_advice === "object") return payload.strategic_advice as Record<string, unknown>;
  const ctx = payload.context;
  if (ctx && typeof ctx === "object" && (ctx as ChatPayloadRecord).strategic_advice && typeof (ctx as ChatPayloadRecord).strategic_advice === "object") {
    return (ctx as ChatPayloadRecord).strategic_advice as Record<string, unknown>;
  }
  const sj = payload.scene_json;
  if (sj && typeof sj === "object") {
    const s = sj as Record<string, unknown>;
    if (s.strategic_advice && typeof s.strategic_advice === "object") return s.strategic_advice as Record<string, unknown>;
    const scene = s.scene;
    if (scene && typeof scene === "object" && (scene as Record<string, unknown>).strategic_advice && typeof (scene as Record<string, unknown>).strategic_advice === "object") {
      return (scene as Record<string, unknown>).strategic_advice as Record<string, unknown>;
    }
  }
  return null;
}

function extractPayloadObjectSelection(payload: ChatPayloadRecord): Record<string, unknown> | null {
  if (payload.object_selection && typeof payload.object_selection === "object") return payload.object_selection as Record<string, unknown>;
  const ctx = payload.context;
  if (ctx && typeof ctx === "object" && (ctx as ChatPayloadRecord).object_selection && typeof (ctx as ChatPayloadRecord).object_selection === "object") {
    return (ctx as ChatPayloadRecord).object_selection as Record<string, unknown>;
  }
  const sj = payload.scene_json;
  if (sj && typeof sj === "object" && (sj as Record<string, unknown>).object_selection && typeof (sj as Record<string, unknown>).object_selection === "object") {
    return (sj as Record<string, unknown>).object_selection as Record<string, unknown>;
  }
  return null;
}

function extractPayloadConflicts(payload: ChatPayloadRecord): unknown[] {
  if (Array.isArray(payload.conflicts)) return payload.conflicts;
  const sj = payload.scene_json;
  if (sj && typeof sj === "object") {
    const s = sj as Record<string, unknown>;
    const scene = s.scene;
    if (scene && typeof scene === "object") {
      const sc = scene as Record<string, unknown>;
      if (Array.isArray(sc.conflicts)) return sc.conflicts;
    }
  }
  const sceneRoot = payload.scene;
  if (sceneRoot && typeof sceneRoot === "object") {
    const sc = sceneRoot as Record<string, unknown>;
    if (Array.isArray(sc.conflicts)) return sc.conflicts;
  }
  return [];
}

export type RetailDemoChatReasoningHints = {
  workspaceId?: string;
  selectedObjectId?: string | null;
  memoryState?: MemoryStateV1 | null;
  environmentConfig?: EnvironmentConfig | null;
};

export type RetailDemoChatPayloadEnhancementOptions = {
  modeContext: ActiveModeContext | null;
  reasoningHints?: RetailDemoChatReasoningHints;
  domainLabel: string;
  executiveFramingStyle: NexoraExecutiveFramingStyle;
};

function applyRetailCatalogLayerToEnhancedPayload(
  genericEnhanced: ChatPayloadRecord,
  userText: string,
  fallbackScene: SceneJson | null,
  domainLabel: string,
  executiveFramingStyle: NexoraExecutiveFramingStyle
): ChatPayloadRecord {
  const cfg = detectRetailTriggerConfig(userText);
  if (!cfg) return genericEnhanced;

  const next: ChatPayloadRecord = { ...genericEnhanced };

  const baseRisk = extractPayloadRiskPropagation(next) ?? {};
  let nextEdges = Array.isArray(baseRisk.edges) ? [...(baseRisk.edges as unknown[])] : [];
  cfg.riskEdges.forEach((edge) => {
    nextEdges = upsertRiskEdge(nextEdges, edge.from, edge.to, edge.base, edge.delta);
  });
  const nextSources = Array.from(
    new Set(nextEdges.map((e: unknown) => String((e as Record<string, unknown>)?.from ?? "")).filter(Boolean))
  );
  next.risk_propagation = {
    ...baseRisk,
    edges: nextEdges,
    sources: nextSources,
    summary: cfg.riskSummary,
  };

  const baseAdvice = extractPayloadStrategicAdvice(next) ?? {};
  const primaryAdvice = {
    id: `retail_${cfg.id}`,
    type: "retail_response",
    action: cfg.adviceAction,
    targets: cfg.targets,
    impact: cfg.adviceImpact,
    priority: 1,
  };
  const existingActions = Array.isArray(baseAdvice.recommended_actions)
    ? (baseAdvice.recommended_actions as unknown[]).filter(
        (a: unknown) => a && (a as Record<string, unknown>).action !== cfg.adviceAction
      ).slice(0, 2)
    : [];
  next.strategic_advice = {
    ...baseAdvice,
    recommended_actions: [primaryAdvice, ...existingActions],
    primary_recommendation: primaryAdvice,
    why: cfg.adviceWhy,
    confidence: Math.max(0.72, Number(baseAdvice.confidence ?? 0.72)),
    summary: `Recommended action: ${cfg.adviceAction}`,
  };

  const baseSelection = extractPayloadObjectSelection(next) ?? {};
  const priorHighlights = Array.isArray(baseSelection.highlighted_objects) ? baseSelection.highlighted_objects : [];
  next.object_selection = {
    ...baseSelection,
    highlighted_objects: Array.from(new Set([...cfg.targets, ...(priorHighlights as string[])])),
  };

  const baseConflicts = extractPayloadConflicts(next);
  const conflictSeeds = cfg.targets.slice(0, 3);
  const seededConflicts =
    conflictSeeds.length >= 2 ? [{ pair: [conflictSeeds[0], conflictSeeds[1]], score: 0.65 }] : [];
  const mergedConflicts: unknown[] = [...seededConflicts];
  if (Array.isArray(baseConflicts)) mergedConflicts.push(...baseConflicts);
  next.conflicts = mergedConflicts.slice(0, 4);

  const baseScene =
    next.scene_json && typeof next.scene_json === "object" ? (next.scene_json as Record<string, unknown>) : null;
  if (baseScene?.scene && typeof baseScene.scene === "object") {
    const scene = baseScene.scene as Record<string, unknown>;
    const prevFragility = (scene.fragility as Record<string, unknown> | undefined) ?? {};
    const prevDrivers = (prevFragility.drivers as Record<string, number> | undefined) ?? {};
    const dInv = clamp(
      Number(prevDrivers.inventory_pressure ?? 0.45) + Number(cfg.driverDelta.inventory_pressure ?? 0),
      0,
      1
    );
    const dTime = clamp(Number(prevDrivers.time_pressure ?? 0.45) + Number(cfg.driverDelta.time_pressure ?? 0), 0, 1);
    const dQuality = clamp(Number(prevDrivers.quality_risk ?? 0.42) + Number(cfg.driverDelta.quality_risk ?? 0), 0, 1);
    const prevRisk = Number((scene.kpi as Record<string, unknown> | undefined)?.risk ?? 0.52);
    const nextRisk = clamp(prevRisk + cfg.kpiRiskDelta, 0, 1);
    const nextScore = clamp(Number(prevFragility.score ?? 0.5) + cfg.kpiRiskDelta * 0.8, 0, 1);

    scene.fragility = {
      ...prevFragility,
      score: nextScore,
      level: nextScore >= 0.7 ? "high" : nextScore >= 0.45 ? "medium" : "low",
      drivers: {
        ...prevDrivers,
        inventory_pressure: dInv,
        time_pressure: dTime,
        quality_risk: dQuality,
      },
    };
    const prevKpi = (scene.kpi as Record<string, unknown> | undefined) ?? {};
    scene.kpi = {
      ...prevKpi,
      risk: nextRisk,
    };
    next.scene_json = baseScene;
  }

  const timelineImpact = {
    trigger: cfg.id,
    immediate: cfg.timelineSteps[0],
    near_term: cfg.timelineSteps[1],
    follow_up: cfg.timelineSteps[2],
    steps: cfg.timelineSteps,
  };
  next.timeline_impact = timelineImpact;

  const sceneForLabels = next.scene_json && typeof next.scene_json === "object" ? (next.scene_json as Record<string, unknown>) : null;
  const objectsForLabels =
    sceneForLabels?.scene && typeof sceneForLabels.scene === "object"
      ? ((sceneForLabels.scene as Record<string, unknown>).objects as unknown[])
      : [];

  const matchedNames = cfg.targets
    .map((id) => {
      const obj = objectsForLabels.find(
        (candidate: unknown) => String((candidate as Record<string, unknown>)?.id ?? "") === id
      );
      return obj ? getObjectDisplayLabel(obj as SemanticObject) : "";
    })
    .filter(Boolean);

  next.reply = buildReadableDemoReply({
    riskSummary: cfg.riskSummary,
    timelineSteps: cfg.timelineSteps,
    action: cfg.adviceAction,
    matchedNames,
  });
  const executiveSummarySurface = buildExecutiveSummarySurface({
    matchedNames,
    riskSummary: cfg.riskSummary,
    timelineSteps: cfg.timelineSteps,
    adviceAction: cfg.adviceAction,
    adviceWhy: cfg.adviceWhy,
    domainLabel,
    framingStyle: executiveFramingStyle,
  });
  next.executive_summary_surface = executiveSummarySurface;
  next.analysis_summary = executiveSummarySurface.summary;
  if (next.executive_insight && typeof next.executive_insight === "object") {
    const ei = next.executive_insight as Record<string, unknown>;
    next.executive_insight = {
      ...ei,
      summary: executiveSummarySurface.summary,
      explanation_notes: Array.from(
        new Set([
          executiveSummarySurface.happened,
          executiveSummarySurface.why_it_matters,
          ...(Array.isArray(ei.explanation_notes) ? (ei.explanation_notes as unknown[]) : []),
        ])
      ),
    };
  }
  if (next.decision_cockpit && typeof next.decision_cockpit === "object") {
    const dc = next.decision_cockpit as Record<string, unknown>;
    const ex = (dc.executive as Record<string, unknown> | undefined) ?? {};
    next.decision_cockpit = {
      ...dc,
      executive: {
        ...ex,
        summary: executiveSummarySurface.summary,
        happened: executiveSummarySurface.happened,
        why_it_matters: executiveSummarySurface.why_it_matters,
        what_to_do: executiveSummarySurface.what_to_do,
      },
    };
  }

  next.canonical_recommendation = buildCanonicalRecommendation(next);

  return enforceSafeDefaults(sanitizeDecisionPayload(next)) as ChatPayloadRecord;
}

export function applyRetailDemoChatPayloadEnhancement(
  rawPayload: unknown,
  userText: string,
  fallbackScene: SceneJson | null,
  options: RetailDemoChatPayloadEnhancementOptions
): unknown {
  if (!rawPayload || typeof rawPayload !== "object") return rawPayload;
  const genericEnhanced = applyGenericPromptFeedbackEnhancement(
    rawPayload,
    userText,
    fallbackScene,
    options.modeContext,
    options.reasoningHints
  ) as ChatPayloadRecord;
  if (!isRetailScenePayload(genericEnhanced, fallbackScene)) return genericEnhanced;
  if (!isRetailDemoScene(fallbackScene)) return genericEnhanced;
  return applyRetailCatalogLayerToEnhancedPayload(
    genericEnhanced,
    userText,
    fallbackScene,
    options.domainLabel,
    options.executiveFramingStyle
  );
}

/** Pulse targets for retail fragility demo when user text matches a catalog trigger. */
export function resolveRetailDemoPulseObjectIdsForPrompt(text: string): string[] | null {
  const cfg = detectRetailTriggerConfig(text);
  return cfg ? [...cfg.targets] : null;
}
