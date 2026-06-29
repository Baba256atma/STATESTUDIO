/**
 * APP-1:6 — Executive Time Priority Escalation metadata.
 * Escalation labels only — no scheduling or notifications.
 */

import type { ExecutiveTimePriorityLevel } from "./executiveTimePriorityAuthorityTypes.ts";

export type ExecutiveTimePriorityEscalationDefinition = Readonly<{
  priority: ExecutiveTimePriorityLevel;
  escalationLevel: string;
  description: string;
}>;

export const EXECUTIVE_TIME_PRIORITY_ESCALATION_DEFINITIONS: readonly ExecutiveTimePriorityEscalationDefinition[] =
  Object.freeze([
    Object.freeze({ priority: "critical", escalationLevel: "Immediate", description: "Immediate executive attention." }),
    Object.freeze({ priority: "urgent", escalationLevel: "Today", description: "Action required today." }),
    Object.freeze({ priority: "soon", escalationLevel: "Next Working Window", description: "Address in the next working window." }),
    Object.freeze({ priority: "normal", escalationLevel: "Standard Queue", description: "Standard temporal queue." }),
    Object.freeze({ priority: "later", escalationLevel: "Deferred", description: "Deferred temporal attention." }),
    Object.freeze({ priority: "expired", escalationLevel: "Immediate Review", description: "Temporal window elapsed — review required." }),
  ]);

const ESCALATION_BY_PRIORITY = Object.freeze(
  Object.fromEntries(
    EXECUTIVE_TIME_PRIORITY_ESCALATION_DEFINITIONS.map((entry) => [entry.priority, entry])
  ) as Record<ExecutiveTimePriorityLevel, ExecutiveTimePriorityEscalationDefinition>
);

export function resolveEscalationLevel(priority: ExecutiveTimePriorityLevel): string {
  return ESCALATION_BY_PRIORITY[priority]?.escalationLevel ?? "Standard Queue";
}

export function resolveEscalationDefinition(
  priority: ExecutiveTimePriorityLevel
): ExecutiveTimePriorityEscalationDefinition {
  return ESCALATION_BY_PRIORITY[priority] ?? ESCALATION_BY_PRIORITY.normal;
}
