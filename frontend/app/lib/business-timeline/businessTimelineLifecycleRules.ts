/**
 * APP-7:4 — Business lifecycle classification rules.
 */

import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import { clampLifecycleConfidence, type BusinessLifecyclePhase } from "./businessTimelineLifecycleTypes.ts";

export const BUSINESS_LIFECYCLE_PHASE_LABELS = Object.freeze({
  founding: "Founding",
  "early-growth": "Early Growth",
  growth: "Growth",
  expansion: "Expansion",
  transformation: "Transformation",
  crisis: "Crisis",
  recovery: "Recovery",
  stabilization: "Stabilization",
  decline: "Decline",
  renewal: "Renewal",
  unknown: "Unknown",
} as const satisfies Readonly<Record<BusinessLifecyclePhase, string>>);

export const BUSINESS_LIFECYCLE_PHASE_DESCRIPTIONS = Object.freeze({
  founding: "Organization establishment and initial corporate formation period.",
  "early-growth": "Early traction, product-market fit, and initial revenue milestones.",
  growth: "Sustained scaling, revenue growth, and operational momentum.",
  expansion: "Geographic, product, or market expansion initiatives.",
  transformation: "Strategic or operational transformation initiatives.",
  crisis: "Operational incidents, failures, or elevated risk events.",
  recovery: "Recovery actions following crisis or disruption.",
  stabilization: "Operational stabilization and steady-state execution.",
  decline: "Contraction, reduction, or downward business trajectory.",
  renewal: "Strategic renewal and repositioning after decline.",
  unknown: "Events that do not match a known lifecycle classification rule.",
} as const satisfies Readonly<Record<BusinessLifecyclePhase, string>>);

type PhaseRule = Readonly<{
  phase: BusinessLifecyclePhase;
  confidence: number;
  reason: string;
}>;

function rule(phase: BusinessLifecyclePhase, confidence: number, reason: string): PhaseRule {
  return Object.freeze({ phase, confidence: clampLifecycleConfidence(confidence), reason });
}

export function classifyEventLifecyclePhase(event: BusinessEngineEvent): PhaseRule {
  if (event.type === "expansion") {
    return rule("expansion", 0.92, "Event type expansion maps to expansion phase.");
  }
  if (event.type === "transformation") {
    return rule("transformation", 0.92, "Event type transformation maps to transformation phase.");
  }
  if (event.type === "reduction") {
    return rule("decline", 0.9, "Event type reduction maps to decline phase.");
  }
  if (event.type === "incident" || event.type === "failure") {
    return rule("crisis", 0.93, "Incident or failure maps to crisis phase.");
  }
  if (event.category === "corporate" && event.type === "milestone") {
    return rule("founding", 0.95, "Corporate milestone maps to founding phase.");
  }
  if (event.type === "acquisition" || event.type === "merger") {
    return rule("expansion", 0.88, "Acquisition or merger maps to expansion phase.");
  }
  if (event.type === "investment") {
    return rule("growth", 0.86, "Investment event maps to growth phase.");
  }
  if (event.category === "risk" && event.type === "achievement") {
    return rule("recovery", 0.78, "Risk category achievement maps to recovery phase.");
  }
  if (event.type === "achievement" && (event.category === "product" || event.category === "sales")) {
    return rule("early-growth", 0.84, "Product or sales achievement maps to early-growth phase.");
  }
  if (event.type === "achievement") {
    return rule("growth", 0.8, "Achievement maps to growth phase.");
  }
  if (event.category === "financial" && event.type === "milestone") {
    return rule("growth", 0.82, "Financial milestone maps to growth phase.");
  }
  if (event.type === "operational" && event.category === "operations") {
    return rule("stabilization", 0.81, "Operational event maps to stabilization phase.");
  }
  if (event.category === "strategy" && event.type === "transformation") {
    return rule("renewal", 0.85, "Strategy transformation maps to renewal phase.");
  }
  if (event.type === "milestone") {
    return rule("early-growth", 0.65, "Generic milestone maps to early-growth phase.");
  }
  return rule("unknown", 0.35, "No lifecycle rule matched; unknown phase assigned.");
}

const IMPORTANCE_RANK = Object.freeze({
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
} as const);

export function maxImportance(
  left: BusinessEngineEvent["importance"],
  right: BusinessEngineEvent["importance"]
): BusinessEngineEvent["importance"] {
  return IMPORTANCE_RANK[left] >= IMPORTANCE_RANK[right] ? left : right;
}

export const BusinessTimelineLifecycleRules = Object.freeze({
  classifyEventLifecyclePhase,
  maxImportance,
});
