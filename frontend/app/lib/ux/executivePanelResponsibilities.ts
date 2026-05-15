import type { CanonicalRightPanelView } from "../ui/right-panel/rightPanelTypes.ts";
import type { ExecutiveUxSignalLevel } from "./executiveSignalHierarchy.ts";

export type ExecutivePanelResponsibilityId =
  | "executive_dashboard"
  | "war_room"
  | "monitoring"
  | "risk_flow"
  | "timeline"
  | "advice"
  | "compare"
  | "decision_strip"
  | "scene_overlay"
  | "object_overlay";

export type ExecutivePanelResponsibility = {
  id: ExecutivePanelResponsibilityId;
  label: string;
  primaryResponsibility: string;
  ownsSignals: string[];
  visibilityLevel: ExecutiveUxSignalLevel;
  canonicalView?: CanonicalRightPanelView;
  maxPrimaryItems: number;
};

export const EXECUTIVE_PANEL_RESPONSIBILITIES: ExecutivePanelResponsibility[] = [
  {
    id: "decision_strip",
    label: "Primary Decision Strip",
    primaryResponsibility: "Immediate executive focus and decision blockers.",
    ownsSignals: ["alert", "readiness", "compressed_briefing"],
    visibilityLevel: "immediate_focus",
    maxPrimaryItems: 1,
  },
  {
    id: "executive_dashboard",
    label: "Executive Dashboard",
    primaryResponsibility: "Calm executive overview and top strategic context.",
    ownsSignals: ["compressed_briefing", "narrative", "resilience", "adaptation"],
    visibilityLevel: "strategic_context",
    canonicalView: "dashboard",
    maxPrimaryItems: 3,
  },
  {
    id: "war_room",
    label: "War Room",
    primaryResponsibility: "Strategic workflow, comparison, readiness, and decision framing.",
    ownsSignals: ["scenario", "comparison", "recommendation", "readiness", "coordination"],
    visibilityLevel: "strategic_context",
    canonicalView: "war_room",
    maxPrimaryItems: 3,
  },
  {
    id: "monitoring",
    label: "Monitoring",
    primaryResponsibility: "Operational watch state, unresolved instability, and drift.",
    ownsSignals: ["monitoring", "drift", "forecast", "memory"],
    visibilityLevel: "strategic_context",
    canonicalView: "fragility",
    maxPrimaryItems: 3,
  },
  {
    id: "risk_flow",
    label: "Risk Flow",
    primaryResponsibility: "Propagation visibility, fragility corridors, and risk movement.",
    ownsSignals: ["risk", "fragility", "propagation", "intervention"],
    visibilityLevel: "strategic_context",
    canonicalView: "risk",
    maxPrimaryItems: 3,
  },
  {
    id: "timeline",
    label: "Timeline",
    primaryResponsibility: "Temporal reasoning, stability direction, and history.",
    ownsSignals: ["timeline", "forecast", "memory", "review"],
    visibilityLevel: "supporting_intelligence",
    canonicalView: "timeline",
    maxPrimaryItems: 2,
  },
  {
    id: "advice",
    label: "Advice",
    primaryResponsibility: "Intervention guidance, recommendation rationale, and confidence.",
    ownsSignals: ["recommendation", "intervention", "confidence", "readiness"],
    visibilityLevel: "strategic_context",
    canonicalView: "advice",
    maxPrimaryItems: 2,
  },
  {
    id: "compare",
    label: "Compare",
    primaryResponsibility: "Strategic alternatives and tradeoffs.",
    ownsSignals: ["comparison", "scenario", "confidence"],
    visibilityLevel: "supporting_intelligence",
    canonicalView: "compare",
    maxPrimaryItems: 2,
  },
  {
    id: "scene_overlay",
    label: "Scene Overlays",
    primaryResponsibility: "Quiet object and edge emphasis without stealing panel focus.",
    ownsSignals: ["propagation", "fragility", "attention"],
    visibilityLevel: "supporting_intelligence",
    maxPrimaryItems: 2,
  },
  {
    id: "object_overlay",
    label: "Object Overlays",
    primaryResponsibility: "Object-local semantic hints and context.",
    ownsSignals: ["object", "risk", "relationship"],
    visibilityLevel: "supporting_intelligence",
    canonicalView: "object_focus",
    maxPrimaryItems: 1,
  },
];

export function listExecutivePanelResponsibilities(): ExecutivePanelResponsibility[] {
  return EXECUTIVE_PANEL_RESPONSIBILITIES.map((item) => ({
    ...item,
    ownsSignals: [...item.ownsSignals],
  }));
}

export function getExecutivePanelResponsibility(
  id: ExecutivePanelResponsibilityId
): ExecutivePanelResponsibility | null {
  return listExecutivePanelResponsibilities().find((item) => item.id === id) ?? null;
}

export function recommendPanelForSignal(params: {
  sourceType?: string | null;
  level?: ExecutiveUxSignalLevel | null;
}): ExecutivePanelResponsibility {
  const sourceType = String(params.sourceType ?? "").trim().toLowerCase();
  if (params.level === "immediate_focus") {
    return getExecutivePanelResponsibility("decision_strip")!;
  }
  if (sourceType === "comparison" && params.level === "supporting_intelligence") {
    return getExecutivePanelResponsibility("compare")!;
  }
  return (
    listExecutivePanelResponsibilities().find((panel) => panel.ownsSignals.includes(sourceType)) ??
    getExecutivePanelResponsibility("executive_dashboard")!
  );
}
