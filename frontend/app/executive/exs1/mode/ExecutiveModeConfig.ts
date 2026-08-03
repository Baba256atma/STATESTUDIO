/**
 * EXS-2 — Mock visual configuration for every Executive Mode.
 * Pure UI orchestration. No runtime / AI / business engine.
 */

import type { ExecutiveModeId } from "../shell/executiveCockpitTypes";
import type { Exs1ObjectId } from "../exs1Types";

export type ExecutiveModeTransitionState =
  | "idle"
  | "entering"
  | "active"
  | "exiting";

export type ExecutiveModeAdvisorSurface = {
  readonly title: string;
  readonly suggestionCards: readonly string[];
  readonly quickActions: readonly string[];
  readonly guidance: string;
  readonly packPerspective: string;
};

export type ExecutiveModeInsightSurface = {
  readonly title: string;
  readonly body: string;
  readonly guidance: string;
};

export type ExecutiveModeVisualConfig = {
  readonly id: ExecutiveModeId;
  readonly accent: string;
  readonly connectionColor: string;
  readonly overlayTint: string;
  readonly overlayLabel: string;
  readonly emphasis: "standard" | "war-room";
  readonly focusObjectIds: readonly Exs1ObjectId[];
  readonly badgeLabels: readonly string[];
  readonly directorCaption: string;
  readonly advisor: ExecutiveModeAdvisorSurface;
  readonly insight: ExecutiveModeInsightSurface;
};

export const EXECUTIVE_MODE_TRANSITION_MS = 250;

export const EXECUTIVE_MODE_CONFIG: Record<
  ExecutiveModeId,
  ExecutiveModeVisualConfig
> = {
  Goal: {
    id: "Goal",
    accent: "#32D583",
    connectionColor: "#32D583",
    overlayTint: "rgba(50, 213, 131, 0.12)",
    overlayLabel: "Goals · KPIs · Targets",
    emphasis: "standard",
    focusObjectIds: ["revenue", "customer", "decision"],
    badgeLabels: ["Goal", "KPI", "Target"],
    directorCaption: "Highlight goals, KPIs, and target objects",
    advisor: {
      title: "Executive Goal",
      suggestionCards: [
        "Protect on-time revenue this quarter",
        "Hold customer service above threshold",
        "Align Decision node to target cover days",
      ],
      quickActions: ["Review KPIs", "Pin Target", "Share Goal"],
      guidance: "Keep attention on outcome objects that define success.",
      packPerspective: "Production Delay viewed as a threat to goal attainment.",
    },
    insight: {
      title: "Target KPI",
      body: "Primary KPI at risk: Inventory cover days feeding Customer OTIF.",
      guidance: "Track Revenue and Customer as goal anchors.",
    },
  },
  Problem: {
    id: "Problem",
    accent: "#F79009",
    connectionColor: "#F04438",
    overlayTint: "rgba(247, 144, 9, 0.14)",
    overlayLabel: "Risk · Issue · Constraint",
    emphasis: "standard",
    focusObjectIds: ["supplier", "factory", "inventory"],
    badgeLabels: ["Risk", "Issue", "Constraint"],
    directorCaption: "Highlight risk, issue, and constraint objects",
    advisor: {
      title: "Executive Problem",
      suggestionCards: [
        "Supplier lead-time variance rising",
        "Factory bottleneck amplifying delay",
        "Inventory cover below threshold",
      ],
      quickActions: ["Inspect Inventory", "Trace Constraint", "Open Pack"],
      guidance: "Frame the problem before exploring scenarios.",
      packPerspective: "Production Delay as root-cause problem framing.",
    },
    insight: {
      title: "Root Cause",
      body: "Root cause mock: inbound Supplier variance → Factory WIP → Inventory thinning.",
      guidance: "Stay with the constraint chain before jumping to solutions.",
    },
  },
  Analysis: {
    id: "Analysis",
    accent: "#38bdf8",
    connectionColor: "#38bdf8",
    overlayTint: "rgba(56, 189, 248, 0.12)",
    overlayLabel: "Relationships · Dependencies · Evidence",
    emphasis: "standard",
    focusObjectIds: [
      "supplier",
      "factory",
      "inventory",
      "customer",
      "revenue",
      "decision",
    ],
    badgeLabels: ["Link", "Dependency", "Evidence"],
    directorCaption: "Show relationships, dependencies, and evidence",
    advisor: {
      title: "Executive Analysis",
      suggestionCards: [
        "Map dependency pressure across the chain",
        "Weight evidence on Inventory and Factory",
        "Separate correlation from constraint",
      ],
      quickActions: ["Show Links", "Evidence List", "Compare Nodes"],
      guidance: "Use relationships to validate the problem narrative.",
      packPerspective: "Production Delay as an evidence map across objects.",
    },
    insight: {
      title: "Dependency Map",
      body: "Strongest dependency path: Supplier → Factory → Inventory → Customer.",
      guidance: "Evidence density is highest around Inventory.",
    },
  },
  Scenario: {
    id: "Scenario",
    accent: "#7A5AF8",
    connectionColor: "#7A5AF8",
    overlayTint: "rgba(122, 90, 248, 0.14)",
    overlayLabel: "Scenario Comparison",
    emphasis: "standard",
    focusObjectIds: ["supplier", "factory", "inventory", "decision"],
    badgeLabels: ["A", "B", "C"],
    directorCaption: "Scenario badges, colors, and scenario objects",
    advisor: {
      title: "Scenario Comparison",
      suggestionCards: [
        "A · Expedite Supplier",
        "B · Reallocate Factory capacity",
        "C · Renegotiate Customer commitments",
      ],
      quickActions: ["Compare A/B", "Pin Scenario", "Preview Impact"],
      guidance: "Compare possible solutions without changing the Pack.",
      packPerspective: "Production Delay as a set of possible solutions.",
    },
    insight: {
      title: "Scenario Comparison",
      body: "Scenario B reduces Inventory pressure fastest in this mock view.",
      guidance: "Keep comparison visual — no engine evaluation yet.",
    },
  },
  Decision: {
    id: "Decision",
    accent: "#1570EF",
    connectionColor: "#1570EF",
    overlayTint: "rgba(21, 112, 239, 0.14)",
    overlayLabel: "Decision · Impacts",
    emphasis: "standard",
    focusObjectIds: ["decision", "inventory", "customer", "revenue"],
    badgeLabels: ["Decision", "Impact"],
    directorCaption: "Highlight decision node and impacts",
    advisor: {
      title: "Decision Review",
      suggestionCards: [
        "Chosen action centers on the Decision node",
        "Impacts flow to Inventory, Customer, Revenue",
        "Hold Pack context while reviewing tradeoffs",
      ],
      quickActions: ["Review Impact", "Lock Choice", "Note Rationale"],
      guidance: "Decision mode interprets the same Pack as a chosen action.",
      packPerspective: "Production Delay as the chosen executive action path.",
    },
    insight: {
      title: "Decision Impact",
      body: "Mock impact: Decision → Inventory recovery → Customer service protection.",
      guidance: "Impacts are presentation-only until runtime arrives.",
    },
  },
  Execution: {
    id: "Execution",
    accent: "#12B76A",
    connectionColor: "#12B76A",
    overlayTint: "rgba(18, 183, 106, 0.12)",
    overlayLabel: "Progress · Execution Path",
    emphasis: "standard",
    focusObjectIds: ["supplier", "factory", "inventory"],
    badgeLabels: ["Step", "Progress", "Path"],
    directorCaption: "Show progress and execution path",
    advisor: {
      title: "Execution Progress",
      suggestionCards: [
        "Path: Supplier → Factory → Inventory",
        "Progress mock: 42% along recovery path",
        "Watch Factory as the active execution gate",
      ],
      quickActions: ["Next Step", "Mark Done", "Escalate Gate"],
      guidance: "Execution shows path progress without runtime completion logic.",
      packPerspective: "Production Delay as an execution recovery path.",
    },
    insight: {
      title: "Path Progress",
      body: "Execution path is active at Factory with Inventory as the next gate.",
      guidance: "Progress markers are mock visuals only.",
    },
  },
  Monitoring: {
    id: "Monitoring",
    accent: "#039855",
    connectionColor: "#039855",
    overlayTint: "rgba(3, 152, 85, 0.12)",
    overlayLabel: "Status · Alerts · Health",
    emphasis: "standard",
    focusObjectIds: ["inventory", "customer", "revenue"],
    badgeLabels: ["Health", "Alert", "Status"],
    directorCaption: "Show status, alerts, and health",
    advisor: {
      title: "Executive Monitoring",
      suggestionCards: [
        "Inventory health: warning",
        "Customer service alert active",
        "Revenue status watched weekly",
      ],
      quickActions: ["Open Alerts", "Health Strip", "Mute Noise"],
      guidance: "Monitor health signals without leaving the cockpit page.",
      packPerspective: "Production Delay as a live health/alert interpretation.",
    },
    insight: {
      title: "Health Watch",
      body: "Health overlay flags Inventory and Customer as attention points.",
      guidance: "Alerts are mock presentation signals.",
    },
  },
  "War Room": {
    id: "War Room",
    accent: "#D92D20",
    connectionColor: "#D92D20",
    overlayTint: "rgba(217, 45, 32, 0.16)",
    overlayLabel: "Critical Focus",
    emphasis: "war-room",
    focusObjectIds: ["inventory", "factory", "decision"],
    badgeLabels: ["Critical"],
    directorCaption: "Maximum focus · critical objects only",
    advisor: {
      title: "War Room",
      suggestionCards: [
        "Critical: Inventory cover breach",
        "Critical: Factory bottleneck",
        "Critical: Decision required now",
      ],
      quickActions: ["Focus Critical", "Silence Noise", "Call Decision"],
      guidance: "War Room removes distraction and keeps only critical objects.",
      packPerspective: "Production Delay under maximum executive pressure.",
    },
    insight: {
      title: "Critical Set",
      body: "Only Inventory, Factory, and Decision remain in the critical set.",
      guidance: "Dark emphasis is presentational — no runtime escalation.",
    },
  },
};

export function getExecutiveModeConfig(
  mode: ExecutiveModeId,
): ExecutiveModeVisualConfig {
  return EXECUTIVE_MODE_CONFIG[mode];
}
