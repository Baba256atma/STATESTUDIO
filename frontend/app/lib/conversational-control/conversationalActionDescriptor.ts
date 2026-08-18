/**
 * UX:4-FIX3 — shared conversational projection of an existing executive action.
 *
 * This descriptor never executes an action. It lets CC understand which
 * canonical action the Advisor already presented.
 */

export type NexoraConversationalActionKind =
  | "navigate-subject"
  | "open-collection"
  | "information"
  | "consequential";

export type NexoraConversationalActionDescriptor = {
  readonly actionId: string;
  readonly label: string;
  readonly actionKind: NexoraConversationalActionKind;
  readonly targetSubjectId: string | null;
  readonly targetCollection: string | null;
  readonly sourceCapability:
    | "advisor-intelligence"
    | "next-best-action"
    | "decision"
    | "execution";
  readonly consequenceLevel: "none" | "confirmation-required";
};

export function freezeNexoraConversationalActionDescriptor(
  descriptor: NexoraConversationalActionDescriptor,
): NexoraConversationalActionDescriptor {
  return Object.freeze({ ...descriptor });
}

export type NexoraConversationalActionInvocationResolution = {
  readonly status: "resolved" | "ambiguous" | "not-found";
  readonly matchedUtterance: boolean;
  readonly descriptor: NexoraConversationalActionDescriptor | null;
  readonly semanticUtterance: string | null;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[?!.,]+$/g, "")
    .replace(/['’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isContextualActionReference(value: string): boolean {
  return /^(?:review|open|show(?: me)?|investigate|lets review)(?: (?:it|this|that|that problem|this problem|the problem|problem|the scenario|scenario|the decision|decision|the execution|execution))?$/.test(
    normalize(value),
  );
}

function contextualActionTargetKind(value: string): string | null {
  const match = normalize(value).match(
    /(?:^| )(?:the )?(problem|scenario|decision|execution)$/,
  );
  return match?.[1] ?? null;
}

export function resolveNexoraConversationalActionInvocation(input: {
  readonly utterance: string;
  readonly primaryAction?: NexoraConversationalActionDescriptor | null;
  readonly availableActions?: readonly NexoraConversationalActionDescriptor[];
  readonly subjectNameById: Readonly<Record<string, string>>;
  readonly subjectKindById?: Readonly<Record<string, string>>;
}): NexoraConversationalActionInvocationResolution {
  const normalized = normalize(input.utterance);
  const safeActions = (input.availableActions ?? []).filter(
    (action) =>
      action.actionKind === "navigate-subject" &&
      action.consequenceLevel === "none" &&
      action.targetSubjectId != null,
  );
  const exact = safeActions.filter(
    (action) => normalize(action.label) === normalized,
  );
  const contextual = isContextualActionReference(input.utterance);
  const contextualTargetKind = contextualActionTargetKind(input.utterance);
  const kindSpecific = contextualTargetKind
    ? safeActions.filter(
        (action) =>
          action.targetSubjectId != null &&
          input.subjectKindById?.[action.targetSubjectId] ===
            contextualTargetKind,
      )
    : [];
  const exactLabelMatched = exact.length > 0;
  const candidates =
    exact.length > 0
      ? exact
      : kindSpecific.length > 0
        ? kindSpecific
      : contextual && input.primaryAction
        ? [input.primaryAction].filter(
            (action) =>
              action.actionKind === "navigate-subject" &&
              action.consequenceLevel === "none" &&
              action.targetSubjectId != null,
          )
        : contextual
          ? safeActions
          : [];

  const uniqueTargets = new Map(
    candidates
      .filter((action) => action.targetSubjectId != null)
      .map((action) => [action.targetSubjectId!, action]),
  );
  if (uniqueTargets.size !== 1) {
    return Object.freeze({
      status: uniqueTargets.size > 1 ? "ambiguous" : "not-found",
      matchedUtterance: contextual || exactLabelMatched,
      descriptor: null,
      semanticUtterance: null,
    });
  }
  const descriptor = [...uniqueTargets.values()][0]!;
  const targetName = descriptor.targetSubjectId
    ? input.subjectNameById[descriptor.targetSubjectId]
    : null;
  if (!targetName) {
    return Object.freeze({
      status: "not-found",
      matchedUtterance: contextual || exactLabelMatched,
      descriptor: null,
      semanticUtterance: null,
    });
  }
  return Object.freeze({
    status: "resolved",
    matchedUtterance: true,
    descriptor,
    semanticUtterance: `Focus on ${targetName}`,
  });
}
