import type { NexoraConversationPurpose } from "./nexoraConversationalMove.ts";
import type { NexoraConversationCoverage } from "./nexoraConversationProgression.ts";
import type {
  NexoraConversationObjective,
  NexoraConversationThreadStatus,
} from "./nexoraConversationObjective.ts";
import type { NexoraConversationCoverageThread } from "./nexoraConversationWorkingContext.ts";

export type NexoraConversationPurposeCoverage = {
  readonly purpose: NexoraConversationPurpose;
  readonly coverage: NexoraConversationCoverage;
};

export type NexoraConversationThread = {
  readonly threadId: string;
  readonly objective: NexoraConversationObjective;
  readonly primarySubject: string;
  readonly relatedSubjects: readonly string[];
  readonly coveredPurposes: readonly NexoraConversationPurposeCoverage[];
  readonly openPurposes: readonly NexoraConversationPurpose[];
  readonly status: NexoraConversationThreadStatus;
};

export function conversationThreadId(
  objective: NexoraConversationObjective,
  primarySubject: string,
): string {
  return `${objective}:${primarySubject}`;
}

export function purposeIsCovered(coverage: NexoraConversationCoverage): boolean {
  return coverage !== "NONE";
}

export function projectConversationThread(input: {
  readonly threads: readonly NexoraConversationCoverageThread[];
  readonly primarySubject: string;
  readonly objective: NexoraConversationObjective;
  readonly availablePurposes: readonly NexoraConversationPurpose[];
  readonly relatedSubjects?: readonly string[];
  readonly superseded?: boolean;
}): NexoraConversationThread {
  const forSubject = input.threads.filter((item) => item.subjectId === input.primarySubject);
  const coveredPurposes = Object.freeze(
    forSubject
      .filter((item) => {
        if (item.lastMove === "SHOW") {
          return item.lastCapabilityResult === "SUCCEEDED";
        }
        return purposeIsCovered(item.coverage);
      })
      .map((item) =>
        Object.freeze({
          purpose: item.purpose,
          coverage: item.coverage,
        }),
      ),
  );
  const coveredSet = new Set(coveredPurposes.map((item) => item.purpose));
  const openPurposes = Object.freeze(
    input.availablePurposes.filter((purpose) => !coveredSet.has(purpose)),
  );
  const status = input.superseded
    ? ("SUPERSEDED" as const)
    : coveredPurposes.length >= 2
      ? ("SUFFICIENTLY_COVERED" as const)
      : ("ACTIVE" as const);
  return Object.freeze({
    threadId: conversationThreadId(input.objective, input.primarySubject),
    objective: input.objective,
    primarySubject: input.primarySubject,
    relatedSubjects: Object.freeze([...(input.relatedSubjects ?? [])]),
    coveredPurposes,
    openPurposes,
    status,
  });
}

export function objectiveFromPurpose(
  purpose: NexoraConversationPurpose,
  previous: NexoraConversationObjective | null,
): NexoraConversationObjective {
  if (previous === "UNDERSTAND_SUBJECT" && (purpose === "COMPARE" || purpose === "WHY_PRESENT" || purpose === "WHY_RELEVANT")) {
    return "UNDERSTAND_SUBJECT";
  }
  if (purpose === "CAPABILITY") return "LEARN_CAPABILITY";
  if (purpose === "APPEARS" || purpose === "FOCUS") return "UNDERSTAND_STAGE";
  if (purpose === "INVESTIGATE") return "INVESTIGATE_SUBJECT";
  if (purpose === "COMPARE") return previous ?? "COMPARE_SUBJECTS";
  if (purpose === "CAUSE") return "RESOLVE_UNCERTAINTY";
  return "UNDERSTAND_SUBJECT";
}

export function availablePurposesForUnderstandSubject(input: {
  readonly compare: boolean;
  readonly whyPresent: boolean;
}): readonly NexoraConversationPurpose[] {
  const purposes: NexoraConversationPurpose[] = ["IDENTIFY"];
  if (input.whyPresent) purposes.push("WHY_PRESENT");
  if (input.compare) purposes.push("COMPARE");
  return Object.freeze(purposes);
}
