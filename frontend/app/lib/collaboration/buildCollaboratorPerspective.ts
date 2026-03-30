import type {
  CollaborationInput,
  CollaboratorPerspective,
  CollaboratorRole,
} from "./collaborationTypes";

type BuildCollaboratorPerspectiveInput = {
  userId: string;
  userLabel: string;
  role: CollaboratorRole;
  inputs: CollaborationInput[];
  sharedRecommendation?: string | null;
  teamNextMove?: string | null;
};

const DEFAULT_PRIORITY_BY_ROLE: Record<CollaboratorRole, string[]> = {
  executive: ["Decision clarity", "Risk posture", "Next move"],
  manager: ["Coordination", "Execution readiness", "Escalation clarity"],
  analyst: ["Evidence quality", "Assumptions", "Uncertainty"],
  operator: ["Dependencies", "Execution safety", "Bottlenecks"],
  investor: ["Downside exposure", "Resilience", "Capital efficiency"],
  observer: ["Context clarity", "Decision traceability", "Shared understanding"],
};

function clean(values: unknown[], limit = 3) {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))).slice(0, limit);
}

export function buildCollaboratorPerspective(
  input: BuildCollaboratorPerspectiveInput
): CollaboratorPerspective {
  const sorted = [...input.inputs].sort((a, b) => b.timestamp - a.timestamp);
  const priorityPoints = clean([
    ...sorted
      .filter((entry) => entry.kind === "perspective" || entry.kind === "support")
      .map((entry) => entry.summary),
    ...DEFAULT_PRIORITY_BY_ROLE[input.role],
  ]);
  const concerns = clean([
    ...sorted
      .filter((entry) => entry.kind === "concern" || entry.kind === "challenge" || entry.kind === "evidence_request")
      .map((entry) => entry.summary),
  ]);

  const preferredNextAction =
    clean([
      ...sorted
        .filter((entry) => entry.kind === "approval_note" || entry.kind === "escalation_note" || entry.kind === "evidence_request")
        .map((entry) => entry.summary),
      input.teamNextMove,
      input.sharedRecommendation ? `Advance: ${input.sharedRecommendation}` : null,
    ], 1)[0] ?? null;

  return {
    user_id: input.userId,
    user_label: input.userLabel,
    role: input.role,
    priority_points: priorityPoints,
    concerns,
    preferred_next_action: preferredNextAction,
  };
}
