import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveInteractionEvent,
  InteractionIntegrityIssue,
  InteractionLoopAnalysis,
} from "./interactionStabilityTypes.ts";

function loopIssue(cause: string, eventIds: readonly string[]): InteractionIntegrityIssue {
  return {
    issueId: stableSignature(["d10-interaction-loop", eventIds, cause]).slice(0, 56),
    issueType: "interaction_loop",
    cause,
    source: "interaction_loop_prevention",
    affectedComponent: "workflow_transition",
    severity: "critical",
    recommendedCorrection: "Stop propagation for the repeated interaction chain and keep the last stable context.",
    relatedEventIds: Object.freeze([...eventIds].sort()),
  };
}

export function analyzeInteractionLoops(events: readonly ExecutiveInteractionEvent[]): InteractionLoopAnalysis {
  const ordered = [...events].sort((a, b) => a.generatedAt - b.generatedAt || a.eventId.localeCompare(b.eventId));
  const issues: InteractionIntegrityIssue[] = [];
  const signatures = new Map<string, ExecutiveInteractionEvent[]>();
  for (const event of ordered) {
    const list = signatures.get(event.actionSignature) ?? [];
    list.push(event);
    signatures.set(event.actionSignature, list);
  }
  for (const list of signatures.values()) {
    if (list.length >= 3) {
      issues.push(loopIssue("Repeated dispatch cycle detected for one action signature.", list.map((event) => event.eventId)));
    }
  }
  for (let i = 0; i <= ordered.length - 3; i += 1) {
    const slice = ordered.slice(i, i + 3);
    const components = slice.map((event) => event.component).join(">");
    if (components === "panel_routing>scene_focus>panel_routing") {
      issues.push(loopIssue("Panel to scene to panel amplification chain detected.", slice.map((event) => event.eventId)));
    }
    const chainIds = slice.map((event) => event.executionChainId).filter(Boolean);
    if (chainIds.length === 3 && new Set(chainIds).size === 1 && new Set(slice.map((event) => event.actionSignature)).size === 1) {
      issues.push(loopIssue("Duplicate execution chain detected before completion.", slice.map((event) => event.eventId)));
    }
  }
  const unique = Array.from(new Map(issues.map((item) => [item.issueId, item])).values());
  return {
    loopDetected: unique.length > 0,
    prevented: unique.length > 0,
    issues: Object.freeze(unique),
    signature: stableSignature(["d10-interaction-loop-analysis", unique.map((item) => item.issueId)]),
  };
}

