import type { ExecutiveUxSignal } from "../ux/executiveSignalHierarchy.ts";
import { rankExecutiveUxSignals } from "../ux/executiveSignalHierarchy.ts";

export type ExecutiveFocusPriority =
  | "critical_blocker"
  | "active_propagation_drift"
  | "readiness_constraint"
  | "resilience_trend"
  | "historical_review";

export type ExecutiveFocusHierarchyRule = {
  priority: number;
  focus: ExecutiveFocusPriority;
  signalTypes: string[];
  executivePurpose: string;
};

export const EXECUTIVE_FOCUS_HIERARCHY: ExecutiveFocusHierarchyRule[] = [
  {
    priority: 1,
    focus: "critical_blocker",
    signalTypes: ["alert", "readiness"],
    executivePurpose: "Resolve or understand the condition blocking executive confidence.",
  },
  {
    priority: 2,
    focus: "active_propagation_drift",
    signalTypes: ["drift", "propagation", "fragility", "monitoring"],
    executivePurpose: "Understand where operational pressure is moving or re-emerging.",
  },
  {
    priority: 3,
    focus: "readiness_constraint",
    signalTypes: ["confidence", "readiness", "coordination"],
    executivePurpose: "Clarify whether evidence, timing, and coordination support review.",
  },
  {
    priority: 4,
    focus: "resilience_trend",
    signalTypes: ["resilience", "adaptation", "intervention"],
    executivePurpose: "Assess whether stabilization capacity is improving or weakening.",
  },
  {
    priority: 5,
    focus: "historical_review",
    signalTypes: ["memory", "review", "timeline", "narrative"],
    executivePurpose: "Use history and reasoning continuity as supporting context.",
  },
];

export function listExecutiveFocusHierarchy(): ExecutiveFocusHierarchyRule[] {
  return EXECUTIVE_FOCUS_HIERARCHY.map((rule) => ({
    ...rule,
    signalTypes: [...rule.signalTypes],
  }));
}

export function classifyExecutiveFocusPriority(signalType: string): ExecutiveFocusPriority {
  const normalized = String(signalType ?? "").trim().toLowerCase();
  return (
    listExecutiveFocusHierarchy().find((rule) => rule.signalTypes.includes(normalized))?.focus ??
    "historical_review"
  );
}

export function resolveDominantExecutiveFocus(signals: ExecutiveUxSignal[]): {
  focus: ExecutiveFocusPriority;
  primarySignalId?: string;
  rationale: string;
} {
  const ranked = rankExecutiveUxSignals(signals);
  const primary = ranked[0] ?? null;
  if (!primary) {
    return {
      focus: "historical_review",
      rationale: "No elevated executive signal is currently dominating attention.",
    };
  }
  const focus = classifyExecutiveFocusPriority(primary.sourceType);
  const rule = listExecutiveFocusHierarchy().find((item) => item.focus === focus);
  return {
    focus,
    primarySignalId: primary.id,
    rationale: rule?.executivePurpose ?? "Executive focus should follow the highest-ranked signal.",
  };
}
