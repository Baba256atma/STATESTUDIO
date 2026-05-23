import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveInteractionContext,
  ExecutiveInteractionEvent,
  InteractionComponent,
  InteractionIntegrityIssue,
  InteractionIssueType,
  StabilityEventSeverity,
} from "./interactionStabilityTypes.ts";

const DUPLICATE_WINDOW_MS = 750;

function issue(params: {
  type: InteractionIssueType;
  cause: string;
  source: string;
  component: InteractionComponent;
  severity: StabilityEventSeverity;
  correction: string;
  eventIds: readonly string[];
}): InteractionIntegrityIssue {
  return {
    issueId: stableSignature(["d10-interaction-issue", params.type, params.eventIds, params.cause]).slice(0, 56),
    issueType: params.type,
    cause: params.cause,
    source: params.source,
    affectedComponent: params.component,
    severity: params.severity,
    recommendedCorrection: params.correction,
    relatedEventIds: Object.freeze([...params.eventIds].sort()),
  };
}

export function analyzeInteractionIntegrity(params: {
  events: readonly ExecutiveInteractionEvent[];
  previousContext?: ExecutiveInteractionContext | null;
  nextContext: ExecutiveInteractionContext;
}): readonly InteractionIntegrityIssue[] {
  const ordered = [...params.events].sort((a, b) => a.generatedAt - b.generatedAt || a.eventId.localeCompare(b.eventId));
  const issues: InteractionIntegrityIssue[] = [];

  for (let i = 0; i < ordered.length; i += 1) {
    const current = ordered[i];
    if (current.targetPanel === "object_focus" && !current.objectId && !params.nextContext.selectedObjectId && !params.nextContext.focusedObjectId) {
      issues.push(issue({
        type: "invalid_panel_transition",
        cause: "Object focus panel cannot open without selected or focused object context.",
        source: current.source,
        component: "panel_routing",
        severity: "critical",
        correction: "Preserve object context or route to a non-object panel.",
        eventIds: [current.eventId],
      }));
    }
    if (current.sequence != null && current.sequence < 0) {
      issues.push(issue({
        type: "stale_execution_result",
        cause: "Execution result sequence is older than the active runtime sequence.",
        source: current.source,
        component: current.component,
        severity: "warning",
        correction: "Discard stale execution result before applying UI state.",
        eventIds: [current.eventId],
      }));
    }
    if (params.previousContext?.focusedObjectId && !params.nextContext.focusedObjectId && current.action !== "reset_focus") {
      issues.push(issue({
        type: "lost_focus_state",
        cause: "Focused object context was lost during a non-reset interaction.",
        source: current.source,
        component: "object_selection",
        severity: "warning",
        correction: "Carry forward focused object context through the update.",
        eventIds: [current.eventId],
      }));
    }

    for (let j = i + 1; j < ordered.length; j += 1) {
      const other = ordered[j];
      if (other.generatedAt - current.generatedAt > DUPLICATE_WINDOW_MS) break;
      if (current.actionSignature === other.actionSignature) {
        issues.push(issue({
          type: "duplicated_user_action",
          cause: "Same action signature appeared more than once inside the duplicate prevention window.",
          source: `${current.source}:${other.source}`,
          component: current.component,
          severity: "caution",
          correction: "Dedupe the repeated action before dispatching state updates.",
          eventIds: [current.eventId, other.eventId],
        }));
      }
      if (
        current.component === other.component &&
        current.action !== other.action &&
        current.generatedAt === other.generatedAt
      ) {
        issues.push(issue({
          type: "conflicting_interaction",
          cause: "Two different actions attempted to control the same component in one runtime tick.",
          source: `${current.source}:${other.source}`,
          component: current.component,
          severity: "warning",
          correction: "Allow one authoritative interaction per component per tick.",
          eventIds: [current.eventId, other.eventId],
        }));
      }
    }
  }

  return Object.freeze(Array.from(new Map(issues.map((item) => [item.issueId, item])).values()));
}

