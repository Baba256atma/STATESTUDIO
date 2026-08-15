/**
 * STAGE-PROD:5 — Executive Decision Memory & Outcome Trace.
 *
 * Finalized Decision → immutable context/evidence/options/rationale/expected
 * outcomes → later execution links + actual outcomes → deterministic comparison.
 *
 * Historical snapshots do not mutate when current truth changes.
 * Not a semantic Object. Not AI hindsight. Not causal inference.
 *
 * Persistence: session/runtime (Stage path has no durable store yet).
 */

import type { ExecutiveChangeComparisonResult } from "./executiveStageChangeIntelligence.ts";
import type { ExecutiveDecisionBriefResult } from "./executiveStageDecisionBrief.ts";
import type { ExecutiveNextBestActionResult } from "./executiveStageNextBestAction.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageDecisionMemoryIdentity =
  "STAGE-PROD:5/ExecutiveStageDecisionMemory" as const;

export const executiveStageDecisionMemoryVersion = "1.0.0" as const;

export const executiveStageDecisionMemoryNamespace =
  "nexora.spatial-presentation.executive-stage-decision-memory" as const;

export const executiveStageDecisionMemoryPhase =
  "ExecutiveDecisionMemory" as const;

export const executiveStageDecisionMemoryArchitecturalRole =
  "PresentationOnlyExecutiveDecisionMemoryAuthority" as const;

export type ExecutiveStageDecisionMemoryIdentity = {
  readonly id: typeof executiveStageDecisionMemoryIdentity;
  readonly version: typeof executiveStageDecisionMemoryVersion;
  readonly namespace: typeof executiveStageDecisionMemoryNamespace;
  readonly phase: typeof executiveStageDecisionMemoryPhase;
  readonly architecturalRole: typeof executiveStageDecisionMemoryArchitecturalRole;
};

const IDENTITY: ExecutiveStageDecisionMemoryIdentity = Object.freeze({
  id: executiveStageDecisionMemoryIdentity,
  version: executiveStageDecisionMemoryVersion,
  namespace: executiveStageDecisionMemoryNamespace,
  phase: executiveStageDecisionMemoryPhase,
  architecturalRole: executiveStageDecisionMemoryArchitecturalRole,
});

export function getExecutiveStageDecisionMemoryIdentity(): ExecutiveStageDecisionMemoryIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY = Object.freeze({
  architecturalRole: executiveStageDecisionMemoryArchitecturalRole,
  memoryIsSemanticObject: false as const,
  inventsRationale: false as const,
  inventsExpectedOutcomes: false as const,
  inventsCausalClaims: false as const,
  rewritesHistoryOnOutcome: false as const,
  classifiesGoodBadDecision: false as const,
  autoReversesDecisions: false as const,
  autoApprovesDecisions: false as const,
  movesCamera: false as const,
  changesSemanticZ: false as const,
  implementsDecisionMemory: true as const,
  presentationOnly: true as const,
  /** Stage path: session/runtime only — not organizational durable memory. */
  persistenceLevel: "session" as const,
});

export const EXECUTIVE_DECISION_FINAL_STATUSES = Object.freeze([
  "approved",
  "rejected",
  "committed",
  "finalized",
] as const);

export type ExecutiveDecisionFinalStatus =
  (typeof EXECUTIVE_DECISION_FINAL_STATUSES)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveDecisionEvidenceSnapshot = {
  readonly id: string;
  readonly text: string;
  readonly sourceObjectIds: readonly string[];
  readonly sourceKind: string;
};

export type ExecutiveDecisionContextSnapshot = {
  readonly subjectObjectIds: readonly string[];
  readonly executiveStates: readonly {
    readonly objectId: string;
    readonly label?: string;
    readonly executiveState?: string;
    readonly attentionState?: string;
    readonly status?: string;
  }[];
  readonly evidence: readonly ExecutiveDecisionEvidenceSnapshot[];
  readonly relatedGoalIds: readonly string[];
  readonly relatedProblemIds: readonly string[];
  readonly relatedRiskIds: readonly string[];
  readonly relatedScenarioIds: readonly string[];
  readonly recentChangeIds: readonly string[];
  readonly situationText?: string | null;
  readonly impactText?: string | null;
  readonly decisionRequiredText?: string | null;
  readonly capturedAt: string;
};

export type ExecutiveDecisionOptionMemory = {
  readonly objectId?: string;
  readonly label: string;
  readonly statusAtDecision?: string;
  readonly wasSelected: boolean;
};

export type ExecutiveDecisionRationale = {
  readonly text?: string;
  readonly reasonCodes: readonly string[];
  readonly sourceObjectIds: readonly string[];
  readonly sourceEvidenceIds: readonly string[];
  readonly sourceKind:
    | "explicit"
    | "decision-record"
    | "accepted-brief-context"
    | "structured-reason";
};

export type ExecutiveExpectedOutcome = {
  readonly id: string;
  readonly targetObjectId?: string;
  readonly metricKey?: string;
  readonly expectationKind:
    | "target-value"
    | "target-band"
    | "state-transition"
    | "milestone"
    | "qualitative";
  readonly targetValue?: number | string;
  readonly targetState?: string;
  readonly targetDate?: string;
  readonly comparator?: "lt" | "lte" | "gt" | "gte" | "eq";
  readonly worseWhen?: "higher" | "lower";
  readonly sourceKind: "scenario" | "decision" | "execution-plan" | "explicit";
};

export type ExecutiveDecisionExecutionLink = {
  readonly executionObjectId: string;
  readonly relationKind: string;
  readonly linkedAt: string;
  readonly executionStatusAtLink?: string;
};

export type ExecutiveActualOutcome = {
  readonly expectedOutcomeId?: string;
  readonly observedAt: string;
  readonly objectId?: string;
  readonly metricKey?: string;
  readonly actualValue?: number | string;
  readonly actualState?: string;
  readonly sourceKind: string;
};

export type ExecutiveOutcomeComparisonStatus =
  | "met"
  | "partially-met"
  | "not-met"
  | "unknown";

export type ExecutiveOutcomeComparison = {
  readonly expectedOutcomeId: string;
  readonly status: ExecutiveOutcomeComparisonStatus;
  readonly expected: string | number | null;
  readonly actual: string | number | null;
  readonly variance?: number;
  readonly sourceObjectIds: readonly string[];
};

export type ExecutiveDecisionOutcomeTraceStatus =
  | "not-yet-evaluable"
  | "insufficient-data"
  | "achieved"
  | "partially-achieved"
  | "not-achieved"
  | "mixed";

export type ExecutiveDecisionOutcomeTrace = {
  readonly status: ExecutiveDecisionOutcomeTraceStatus;
  readonly evaluatedAt: string;
  readonly comparisons: readonly ExecutiveOutcomeComparison[];
  readonly evidenceIds: readonly string[];
  readonly outcomeTraceVersion: number;
};

export type ExecutiveDecisionGuidanceAtDecision = {
  readonly actionId: string | null;
  readonly actionKind: string | null;
  readonly label: string | null;
  readonly reasonCode: string | null;
};

export type ExecutiveDecisionMemory = {
  readonly memoryId: string;
  readonly decisionObjectId: string;
  readonly scopeKey: string;
  readonly decisionStatus: string;
  readonly decisionVersion: string;
  readonly recordedAt: string;
  readonly contextSnapshot: ExecutiveDecisionContextSnapshot;
  readonly consideredOptions: readonly ExecutiveDecisionOptionMemory[];
  readonly selectedOptionId: string | null;
  readonly rationale: ExecutiveDecisionRationale | null;
  readonly expectedOutcomes: readonly ExecutiveExpectedOutcome[];
  readonly executionLinks: readonly ExecutiveDecisionExecutionLink[];
  readonly actualOutcomes: readonly ExecutiveActualOutcome[];
  readonly outcomeTrace: ExecutiveDecisionOutcomeTrace | null;
  readonly guidanceAtDecision: ExecutiveDecisionGuidanceAtDecision | null;
  readonly decisionSnapshotVersion: 1;
  readonly isSemanticObject: false;
};

export type ExecutiveDecisionMemoryHistoricalState = {
  readonly objectId: string;
  readonly label?: string;
  readonly executiveState?: string;
  readonly attentionState?: string;
  readonly status?: string;
};

export type ExecutiveDecisionMemoryCurrentState = {
  readonly objectId: string;
  readonly label?: string;
  readonly executiveState?: string;
  readonly attentionState?: string;
  readonly status?: string;
  readonly available: boolean;
};

export type ExecutiveDecisionMemoryView = {
  readonly available: boolean;
  readonly eligible: boolean;
  readonly memory: ExecutiveDecisionMemory | null;
  readonly historicalStates: readonly ExecutiveDecisionMemoryHistoricalState[];
  readonly currentStates: readonly ExecutiveDecisionMemoryCurrentState[];
  readonly historicalVsCurrentDifferent: boolean;
  readonly outcomeTrace: ExecutiveDecisionOutcomeTrace | null;
  readonly executionSummaries: readonly {
    readonly executionObjectId: string;
    readonly status: string | null;
    readonly relationKind: string;
  }[];
  readonly suppressedReason: string | null;
};

export type ExecutiveDecisionMemorySubjectInput = {
  readonly subjectId: string;
  readonly objectKind: string;
  readonly label?: string;
  readonly attention?: string;
  readonly status?: string;
  readonly executiveState?: string | null;
  readonly family?: string;
};

export type ExecutiveDecisionMemoryLinkInput = {
  readonly objectId: string;
  readonly contextId: string;
  readonly relation?: string;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeToken(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().trim();
}

export function buildExecutiveDecisionMemoryScopeKey(input: {
  readonly workspace: string;
  readonly modelId?: string | null;
}): string {
  const model = input.modelId?.trim() || "default";
  return `workspace:${input.workspace}|model:${model}`;
}

export function buildExecutiveDecisionMemoryId(input: {
  readonly scopeKey: string;
  readonly decisionObjectId: string;
  readonly decisionVersion: string;
}): string {
  return `mem:${input.scopeKey}:${input.decisionObjectId}:${input.decisionVersion}`;
}

export function isExecutiveDecisionFinalStatus(status: string): boolean {
  return (EXECUTIVE_DECISION_FINAL_STATUSES as readonly string[]).includes(
    normalizeToken(status),
  );
}

function executiveStateOf(
  subject: ExecutiveDecisionMemorySubjectInput,
): string {
  const attention = normalizeToken(subject.attention);
  const state = normalizeToken(subject.executiveState);
  if (attention === "critical" || state === "critical") return "critical";
  if (
    attention === "important" ||
    attention === "elevated" ||
    state === "attention"
  ) {
    return "attention";
  }
  const status = normalizeToken(subject.status);
  if (status === "risk" || status === "unresolved") return "unresolved";
  if (status === "watch") return "watch";
  return "normal";
}

// ─── Repository (session) ───────────────────────────────────────────────────

type ExecutiveDecisionMemoryStore = {
  readonly byId: Readonly<Record<string, ExecutiveDecisionMemory>>;
};

function emptyStore(): ExecutiveDecisionMemoryStore {
  return Object.freeze({ byId: Object.freeze({}) });
}

let sessionStore: ExecutiveDecisionMemoryStore = emptyStore();

export function resetExecutiveDecisionMemoryStoreForTests(): void {
  sessionStore = emptyStore();
}

export function getExecutiveDecisionMemoryStoreSnapshot(): ExecutiveDecisionMemoryStore {
  return sessionStore;
}

export type ExecutiveDecisionMemoryRepository = {
  readonly getByDecisionId: (
    decisionObjectId: string,
    scopeKey: string,
  ) => ExecutiveDecisionMemory | null;
  readonly getByMemoryId: (memoryId: string) => ExecutiveDecisionMemory | null;
  readonly save: (memory: ExecutiveDecisionMemory) => ExecutiveDecisionMemory;
  readonly appendOutcome: (input: {
    readonly memoryId: string;
    readonly actualOutcomes?: readonly ExecutiveActualOutcome[];
    readonly executionLinks?: readonly ExecutiveDecisionExecutionLink[];
    readonly outcomeTrace?: ExecutiveDecisionOutcomeTrace | null;
  }) => ExecutiveDecisionMemory | null;
  readonly listByScope: (scopeKey: string) => readonly ExecutiveDecisionMemory[];
};

function saveMemory(memory: ExecutiveDecisionMemory): ExecutiveDecisionMemory {
  sessionStore = Object.freeze({
    byId: Object.freeze({
      ...sessionStore.byId,
      [memory.memoryId]: memory,
    }),
  });
  return memory;
}

export const executiveDecisionMemoryRepository: ExecutiveDecisionMemoryRepository =
  Object.freeze({
    getByDecisionId(decisionObjectId, scopeKey) {
      const matches = Object.values(sessionStore.byId)
        .filter(
          (entry) =>
            entry.decisionObjectId === decisionObjectId &&
            entry.scopeKey === scopeKey,
        )
        .sort((a, b) => compareIds(b.recordedAt, a.recordedAt));
      return matches[0] ?? null;
    },
    getByMemoryId(memoryId) {
      return sessionStore.byId[memoryId] ?? null;
    },
    save(memory) {
      const existing = sessionStore.byId[memory.memoryId];
      if (existing != null) return existing;
      return saveMemory(memory);
    },
    appendOutcome(input) {
      const existing = sessionStore.byId[input.memoryId];
      if (existing == null) return null;
      const next = Object.freeze({
        ...existing,
        actualOutcomes: Object.freeze([
          ...existing.actualOutcomes,
          ...(input.actualOutcomes ?? []),
        ]),
        executionLinks: Object.freeze([
          ...existing.executionLinks,
          ...(input.executionLinks ?? []).filter(
            (link) =>
              !existing.executionLinks.some(
                (entry) =>
                  entry.executionObjectId === link.executionObjectId &&
                  entry.relationKind === link.relationKind,
              ),
          ),
        ]),
        outcomeTrace:
          input.outcomeTrace !== undefined
            ? input.outcomeTrace
            : existing.outcomeTrace,
        // Preserve immutable decision-time snapshot.
        contextSnapshot: existing.contextSnapshot,
        consideredOptions: existing.consideredOptions,
        rationale: existing.rationale,
        expectedOutcomes: existing.expectedOutcomes,
        guidanceAtDecision: existing.guidanceAtDecision,
      });
      return saveMemory(next);
    },
    listByScope(scopeKey) {
      return Object.freeze(
        Object.values(sessionStore.byId)
          .filter((entry) => entry.scopeKey === scopeKey)
          .sort((a, b) => compareIds(b.recordedAt, a.recordedAt)),
      );
    },
  });

// ─── Capture ────────────────────────────────────────────────────────────────

export type BuildExecutiveDecisionMemoryRecordInput = {
  readonly decisionObjectId: string;
  readonly decisionStatus: string;
  readonly scopeKey: string;
  readonly recordedAt?: string;
  readonly decisionVersion?: string;
  readonly subjects: readonly ExecutiveDecisionMemorySubjectInput[];
  readonly links?: readonly ExecutiveDecisionMemoryLinkInput[];
  readonly selectedOptionId?: string | null;
  readonly explicitRationale?: {
    readonly text: string;
    readonly reasonCodes?: readonly string[];
    readonly sourceObjectIds?: readonly string[];
  } | null;
  readonly decisionRecordReason?: string | null;
  readonly expectedOutcomes?: readonly ExecutiveExpectedOutcome[];
  readonly executionLinks?: readonly ExecutiveDecisionExecutionLink[];
  readonly decisionBrief?: ExecutiveDecisionBriefResult | null;
  readonly nextBestAction?: ExecutiveNextBestActionResult | null;
  readonly changeComparison?: ExecutiveChangeComparisonResult | null;
};

/**
 * Build an immutable Decision Memory record from decision-time truth.
 * Does not persist — caller uses repository.save / recordExecutiveDecisionMemory.
 */
export function buildExecutiveDecisionMemoryRecord(
  input: BuildExecutiveDecisionMemoryRecordInput,
): ExecutiveDecisionMemory | null {
  if (!isExecutiveDecisionFinalStatus(input.decisionStatus)) {
    return null;
  }

  const recordedAt = input.recordedAt ?? new Date().toISOString();
  const decisionVersion =
    input.decisionVersion?.trim() ||
    `${normalizeToken(input.decisionStatus)}@${recordedAt}`;
  const memoryId = buildExecutiveDecisionMemoryId({
    scopeKey: input.scopeKey,
    decisionObjectId: input.decisionObjectId,
    decisionVersion,
  });

  const subjectsById = new Map(
    input.subjects.map((subject) => [subject.subjectId, subject]),
  );
  const decision = subjectsById.get(input.decisionObjectId);
  const links = input.links ?? [];

  const relatedObjectIds = Object.freeze(
    [
      ...new Set(
        links
          .filter((link) => link.contextId === input.decisionObjectId)
          .map((link) => link.objectId),
      ),
    ].sort(compareIds),
  );

  const siblingContextIds = Object.freeze(
    [
      ...new Set(
        relatedObjectIds.flatMap((objectId) =>
          links
            .filter((link) => link.objectId === objectId)
            .map((link) => link.contextId),
        ),
      ),
    ].sort(compareIds),
  );

  const relatedProblems = siblingContextIds.filter((id) => {
    const subject = subjectsById.get(id);
    return normalizeToken(subject?.objectKind) === "problem";
  });
  const relatedScenarios = siblingContextIds.filter((id) => {
    const subject = subjectsById.get(id);
    return normalizeToken(subject?.objectKind) === "scenario";
  });
  const relatedRisks = [
    ...relatedObjectIds.filter((id) => {
      const subject = subjectsById.get(id);
      return (
        normalizeToken(subject?.objectKind) === "risk" ||
        id === "obj-risk" ||
        normalizeToken(subject?.label) === "risk"
      );
    }),
  ].sort(compareIds);

  const brief = input.decisionBrief?.brief ?? null;
  const evidenceFromBrief =
    brief?.evidence.map((item) =>
      Object.freeze({
        id: item.id,
        text: item.text,
        sourceObjectIds: item.sourceObjectIds,
        sourceKind: item.sourceKind,
      }),
    ) ?? [];

  const stateSubjects = [
    decision,
    ...relatedObjectIds.map((id) => subjectsById.get(id)),
    ...relatedProblems.map((id) => subjectsById.get(id)),
  ].filter((entry): entry is ExecutiveDecisionMemorySubjectInput => entry != null);

  const executiveStates = Object.freeze(
    [
      ...new Map(
        stateSubjects.map((subject) => [
          subject.subjectId,
          Object.freeze({
            objectId: subject.subjectId,
            label: subject.label,
            executiveState: executiveStateOf(subject),
            attentionState: subject.attention,
            status: subject.status,
          }),
        ]),
      ).values(),
    ].sort((a, b) => compareIds(a.objectId, b.objectId)),
  );

  const evidence: ExecutiveDecisionEvidenceSnapshot[] = [...evidenceFromBrief];
  for (const state of executiveStates) {
    const id = `ev-freeze-${state.objectId}`;
    if (evidence.some((item) => item.id === id)) continue;
    evidence.push(
      Object.freeze({
        id,
        text: `${state.label ?? state.objectId} was ${state.executiveState} at decision time`,
        sourceObjectIds: Object.freeze([state.objectId]),
        sourceKind: "executive-state",
      }),
    );
  }

  const recentChangeIds = Object.freeze(
    (input.changeComparison?.changes ?? [])
      .filter(
        (change) =>
          change.objectId === input.decisionObjectId ||
          relatedObjectIds.includes(change.objectId) ||
          relatedProblems.includes(change.objectId),
      )
      .map((change) => change.objectId)
      .filter((id, index, all) => all.indexOf(id) === index)
      .sort(compareIds),
  );

  const contextSnapshot: ExecutiveDecisionContextSnapshot = Object.freeze({
    subjectObjectIds: Object.freeze(
      [input.decisionObjectId, ...relatedObjectIds].filter(
        (id, index, all) => all.indexOf(id) === index,
      ),
    ),
    executiveStates,
    evidence: Object.freeze(evidence),
    relatedGoalIds: Object.freeze([] as string[]),
    relatedProblemIds: Object.freeze(relatedProblems),
    relatedRiskIds: Object.freeze(relatedRisks),
    relatedScenarioIds: Object.freeze(relatedScenarios),
    recentChangeIds,
    situationText: brief?.situation.text ?? null,
    impactText: brief?.impact?.text ?? null,
    decisionRequiredText: brief?.decisionRequired?.text ?? null,
    capturedAt: recordedAt,
  });

  const optionIds = new Set<string>(relatedScenarios);
  for (const option of brief?.options ?? []) {
    if (option.objectId != null) optionIds.add(option.objectId);
  }

  const selectedOptionId =
    input.selectedOptionId === undefined
      ? null
      : input.selectedOptionId;

  const consideredOptions = Object.freeze(
    [...optionIds]
      .sort(compareIds)
      .map((objectId) => {
        const subject = subjectsById.get(objectId);
        const briefOption = brief?.options.find(
          (option) => option.objectId === objectId,
        );
        return Object.freeze({
          objectId,
          label: briefOption?.label ?? subject?.label ?? objectId,
          statusAtDecision: subject?.status,
          wasSelected: selectedOptionId != null && selectedOptionId === objectId,
        });
      }),
  );

  let rationale: ExecutiveDecisionRationale | null = null;
  if (input.explicitRationale?.text?.trim()) {
    rationale = Object.freeze({
      text: input.explicitRationale.text.trim(),
      reasonCodes: Object.freeze([
        ...(input.explicitRationale.reasonCodes ?? ["explicit-rationale"]),
      ]),
      sourceObjectIds: Object.freeze([
        input.decisionObjectId,
        ...(input.explicitRationale.sourceObjectIds ?? []),
      ]),
      sourceEvidenceIds: Object.freeze(
        evidence.slice(0, 3).map((item) => item.id),
      ),
      sourceKind: "explicit" as const,
    });
  } else if (input.decisionRecordReason?.trim()) {
    rationale = Object.freeze({
      text: input.decisionRecordReason.trim(),
      reasonCodes: Object.freeze(["decision-record"]),
      sourceObjectIds: Object.freeze([input.decisionObjectId]),
      sourceEvidenceIds: Object.freeze([] as string[]),
      sourceKind: "decision-record" as const,
    });
  } else if (brief?.situation.text) {
    rationale = Object.freeze({
      text: brief.situation.text,
      reasonCodes: Object.freeze([...(brief.reasonCodes ?? [])]),
      sourceObjectIds: Object.freeze([
        input.decisionObjectId,
        ...brief.situation.sourceObjectIds,
      ]),
      sourceEvidenceIds: Object.freeze(evidence.map((item) => item.id)),
      sourceKind: "accepted-brief-context" as const,
    });
  }

  const nba = input.nextBestAction?.recommendedAction ?? null;
  const guidanceAtDecision =
    nba == null
      ? null
      : Object.freeze({
          actionId: nba.id,
          actionKind: nba.kind,
          label: nba.label,
          reasonCode: nba.reasonCode,
        });

  return Object.freeze({
    memoryId,
    decisionObjectId: input.decisionObjectId,
    scopeKey: input.scopeKey,
    decisionStatus: normalizeToken(input.decisionStatus),
    decisionVersion,
    recordedAt,
    contextSnapshot,
    consideredOptions,
    selectedOptionId,
    rationale,
    expectedOutcomes: Object.freeze([...(input.expectedOutcomes ?? [])]),
    executionLinks: Object.freeze([...(input.executionLinks ?? [])]),
    actualOutcomes: Object.freeze([] as ExecutiveActualOutcome[]),
    outcomeTrace: null,
    guidanceAtDecision,
    decisionSnapshotVersion: 1 as const,
    isSemanticObject: false as const,
  });
}

/**
 * Capture boundary: only final statuses create memory; idempotent by memoryId.
 */
export function recordExecutiveDecisionMemory(
  input: BuildExecutiveDecisionMemoryRecordInput,
  repository: ExecutiveDecisionMemoryRepository = executiveDecisionMemoryRepository,
): Readonly<{
  readonly recorded: boolean;
  readonly memory: ExecutiveDecisionMemory | null;
  readonly reason:
    | "recorded"
    | "duplicate"
    | "draft-skipped"
    | "not-final-status";
}> {
  if (!isExecutiveDecisionFinalStatus(input.decisionStatus)) {
    return Object.freeze({
      recorded: false,
      memory: null,
      reason:
        normalizeToken(input.decisionStatus) === "draft" ||
        normalizeToken(input.decisionStatus) === "under-review"
          ? ("draft-skipped" as const)
          : ("not-final-status" as const),
    });
  }

  const built = buildExecutiveDecisionMemoryRecord(input);
  if (built == null) {
    return Object.freeze({
      recorded: false,
      memory: null,
      reason: "not-final-status" as const,
    });
  }

  const existing = repository.getByMemoryId(built.memoryId);
  if (existing != null) {
    return Object.freeze({
      recorded: false,
      memory: existing,
      reason: "duplicate" as const,
    });
  }

  const saved = repository.save(built);
  return Object.freeze({
    recorded: true,
    memory: saved,
    reason: "recorded" as const,
  });
}

// ─── Outcome evaluation ─────────────────────────────────────────────────────

function compareNumeric(input: {
  readonly expected: number;
  readonly actual: number;
  readonly comparator?: ExecutiveExpectedOutcome["comparator"];
  readonly worseWhen?: ExecutiveExpectedOutcome["worseWhen"];
}): ExecutiveOutcomeComparisonStatus {
  const comparator = input.comparator ?? "lte";
  switch (comparator) {
    case "lt":
      return input.actual < input.expected ? "met" : "not-met";
    case "lte":
      return input.actual <= input.expected ? "met" : "not-met";
    case "gt":
      return input.actual > input.expected ? "met" : "not-met";
    case "gte":
      return input.actual >= input.expected ? "met" : "not-met";
    case "eq":
      return input.actual === input.expected ? "met" : "not-met";
    default:
      return "unknown";
  }
}

function aggregateTraceStatus(
  comparisons: readonly ExecutiveOutcomeComparison[],
): ExecutiveDecisionOutcomeTraceStatus {
  if (comparisons.length === 0) return "insufficient-data";
  const known = comparisons.filter((entry) => entry.status !== "unknown");
  if (known.length === 0) return "insufficient-data";
  const met = known.filter((entry) => entry.status === "met").length;
  const notMet = known.filter((entry) => entry.status === "not-met").length;
  const partial = known.filter(
    (entry) => entry.status === "partially-met",
  ).length;
  if (met === known.length) return "achieved";
  if (notMet === known.length) return "not-achieved";
  if (met > 0 && notMet > 0) return "mixed";
  if (partial > 0 || (met > 0 && met < known.length)) return "partially-achieved";
  return "mixed";
}

/**
 * Evaluate expected vs actual at an explicit boundary (not on every render).
 */
export function evaluateExecutiveDecisionOutcome(input: {
  readonly memory: ExecutiveDecisionMemory;
  readonly actualOutcomes: readonly ExecutiveActualOutcome[];
  readonly evaluatedAt?: string;
  readonly evaluationBoundaryReached?: boolean;
}): ExecutiveDecisionOutcomeTrace {
  const evaluatedAt = input.evaluatedAt ?? new Date().toISOString();
  if (input.evaluationBoundaryReached === false) {
    return Object.freeze({
      status: "not-yet-evaluable",
      evaluatedAt,
      comparisons: Object.freeze([] as ExecutiveOutcomeComparison[]),
      evidenceIds: Object.freeze([] as string[]),
      outcomeTraceVersion: (input.memory.outcomeTrace?.outcomeTraceVersion ?? 0) + 1,
    });
  }

  if (input.memory.expectedOutcomes.length === 0) {
    return Object.freeze({
      status: "insufficient-data",
      evaluatedAt,
      comparisons: Object.freeze([] as ExecutiveOutcomeComparison[]),
      evidenceIds: Object.freeze([] as string[]),
      outcomeTraceVersion: (input.memory.outcomeTrace?.outcomeTraceVersion ?? 0) + 1,
    });
  }

  const actualByExpected = new Map<string, ExecutiveActualOutcome>();
  for (const actual of input.actualOutcomes) {
    if (actual.expectedOutcomeId != null) {
      actualByExpected.set(actual.expectedOutcomeId, actual);
    }
  }

  const comparisons: ExecutiveOutcomeComparison[] = [];
  for (const expected of input.memory.expectedOutcomes) {
    const actual =
      actualByExpected.get(expected.id) ??
      input.actualOutcomes.find(
        (entry) =>
          entry.objectId === expected.targetObjectId &&
          (expected.metricKey == null ||
            entry.metricKey === expected.metricKey),
      );

    if (actual == null) {
      comparisons.push(
        Object.freeze({
          expectedOutcomeId: expected.id,
          status: "unknown" as const,
          expected:
            expected.targetValue ?? expected.targetState ?? null,
          actual: null,
          sourceObjectIds: Object.freeze(
            [expected.targetObjectId].filter(
              (id): id is string => id != null,
            ),
          ),
        }),
      );
      continue;
    }

    if (expected.expectationKind === "qualitative") {
      comparisons.push(
        Object.freeze({
          expectedOutcomeId: expected.id,
          status: "unknown" as const,
          expected: expected.targetState ?? expected.targetValue ?? null,
          actual: actual.actualState ?? actual.actualValue ?? null,
          sourceObjectIds: Object.freeze(
            [expected.targetObjectId, actual.objectId].filter(
              (id): id is string => id != null,
            ),
          ),
        }),
      );
      continue;
    }

    const expectedNum =
      typeof expected.targetValue === "number"
        ? expected.targetValue
        : Number(expected.targetValue);
    const actualNum =
      typeof actual.actualValue === "number"
        ? actual.actualValue
        : Number(actual.actualValue);

    if (
      Number.isFinite(expectedNum) &&
      Number.isFinite(actualNum) &&
      (expected.expectationKind === "target-value" ||
        expected.expectationKind === "target-band")
    ) {
      const status = compareNumeric({
        expected: expectedNum,
        actual: actualNum,
        comparator: expected.comparator,
        worseWhen: expected.worseWhen,
      });
      comparisons.push(
        Object.freeze({
          expectedOutcomeId: expected.id,
          status,
          expected: expectedNum,
          actual: actualNum,
          variance: actualNum - expectedNum,
          sourceObjectIds: Object.freeze(
            [expected.targetObjectId, actual.objectId].filter(
              (id): id is string => id != null,
            ),
          ),
        }),
      );
      continue;
    }

    if (
      expected.expectationKind === "state-transition" &&
      expected.targetState != null &&
      actual.actualState != null
    ) {
      comparisons.push(
        Object.freeze({
          expectedOutcomeId: expected.id,
          status:
            normalizeToken(expected.targetState) ===
            normalizeToken(actual.actualState)
              ? ("met" as const)
              : ("not-met" as const),
          expected: expected.targetState,
          actual: actual.actualState,
          sourceObjectIds: Object.freeze(
            [expected.targetObjectId, actual.objectId].filter(
              (id): id is string => id != null,
            ),
          ),
        }),
      );
      continue;
    }

    comparisons.push(
      Object.freeze({
        expectedOutcomeId: expected.id,
        status: "unknown" as const,
        expected: expected.targetValue ?? expected.targetState ?? null,
        actual: actual.actualValue ?? actual.actualState ?? null,
        sourceObjectIds: Object.freeze(
          [expected.targetObjectId, actual.objectId].filter(
            (id): id is string => id != null,
          ),
        ),
      }),
    );
  }

  const frozenComparisons = Object.freeze(comparisons);
  return Object.freeze({
    status: aggregateTraceStatus(frozenComparisons),
    evaluatedAt,
    comparisons: frozenComparisons,
    evidenceIds: Object.freeze(
      input.actualOutcomes
        .map((entry) => entry.objectId)
        .filter((id): id is string => id != null)
        .sort(compareIds),
    ),
    outcomeTraceVersion: (input.memory.outcomeTrace?.outcomeTraceVersion ?? 0) + 1,
  });
}

export function appendExecutiveDecisionOutcomeEvaluation(input: {
  readonly memoryId: string;
  readonly actualOutcomes: readonly ExecutiveActualOutcome[];
  readonly evaluationBoundaryReached?: boolean;
  readonly evaluatedAt?: string;
  readonly repository?: ExecutiveDecisionMemoryRepository;
}): ExecutiveDecisionMemory | null {
  const repository = input.repository ?? executiveDecisionMemoryRepository;
  const memory = repository.getByMemoryId(input.memoryId);
  if (memory == null) return null;
  const trace = evaluateExecutiveDecisionOutcome({
    memory,
    actualOutcomes: input.actualOutcomes,
    evaluatedAt: input.evaluatedAt,
    evaluationBoundaryReached: input.evaluationBoundaryReached,
  });
  return repository.appendOutcome({
    memoryId: input.memoryId,
    actualOutcomes: input.actualOutcomes,
    outcomeTrace: trace,
  });
}

// ─── View resolver ──────────────────────────────────────────────────────────

export function resolveExecutiveDecisionMemoryView(input: {
  readonly presentationMode: "overview" | "object-focus" | "collection" | "preparation";
  readonly primaryStageSubjectId: string | null;
  readonly primarySubjectKind?: string | null;
  readonly scopeKey: string;
  readonly subjects?: readonly ExecutiveDecisionMemorySubjectInput[];
  readonly repository?: ExecutiveDecisionMemoryRepository;
}): ExecutiveDecisionMemoryView {
  const repository = input.repository ?? executiveDecisionMemoryRepository;

  if (
    input.presentationMode !== "object-focus" ||
    input.primaryStageSubjectId == null
  ) {
    return Object.freeze({
      available: false,
      eligible: false,
      memory: null,
      historicalStates: Object.freeze([]),
      currentStates: Object.freeze([]),
      historicalVsCurrentDifferent: false,
      outcomeTrace: null,
      executionSummaries: Object.freeze([]),
      suppressedReason: "mode-ineligible",
    });
  }

  const kind = normalizeToken(input.primarySubjectKind);
  const subject = input.subjects?.find(
    (entry) => entry.subjectId === input.primaryStageSubjectId,
  );
  const isDecision =
    kind === "decision" ||
    normalizeToken(subject?.objectKind) === "decision";

  if (!isDecision) {
    return Object.freeze({
      available: false,
      eligible: false,
      memory: null,
      historicalStates: Object.freeze([]),
      currentStates: Object.freeze([]),
      historicalVsCurrentDifferent: false,
      outcomeTrace: null,
      executionSummaries: Object.freeze([]),
      suppressedReason: "non-decision-focus",
    });
  }

  const memory = repository.getByDecisionId(
    input.primaryStageSubjectId,
    input.scopeKey,
  );
  if (memory == null) {
    return Object.freeze({
      available: false,
      eligible: true,
      memory: null,
      historicalStates: Object.freeze([]),
      currentStates: Object.freeze([]),
      historicalVsCurrentDifferent: false,
      outcomeTrace: null,
      executionSummaries: Object.freeze([]),
      suppressedReason: "memory-missing",
    });
  }

  if (memory.scopeKey !== input.scopeKey) {
    return Object.freeze({
      available: false,
      eligible: true,
      memory: null,
      historicalStates: Object.freeze([]),
      currentStates: Object.freeze([]),
      historicalVsCurrentDifferent: false,
      outcomeTrace: null,
      executionSummaries: Object.freeze([]),
      suppressedReason: "scope-mismatch",
    });
  }

  const subjectsById = new Map(
    (input.subjects ?? []).map((entry) => [entry.subjectId, entry]),
  );

  const historicalStates = memory.contextSnapshot.executiveStates.map((state) =>
    Object.freeze({
      objectId: state.objectId,
      label: state.label,
      executiveState: state.executiveState,
      attentionState: state.attentionState,
      status: state.status,
    }),
  );

  const currentStates = historicalStates.map((historical) => {
    const current = subjectsById.get(historical.objectId);
    if (current == null) {
      return Object.freeze({
        objectId: historical.objectId,
        label: historical.label,
        executiveState: undefined,
        attentionState: undefined,
        status: undefined,
        available: false,
      });
    }
    return Object.freeze({
      objectId: current.subjectId,
      label: current.label,
      executiveState: executiveStateOf(current),
      attentionState: current.attention,
      status: current.status,
      available: true,
    });
  });

  const historicalVsCurrentDifferent = historicalStates.some((historical, index) => {
    const current = currentStates[index]!;
    if (!current.available) return true;
    return (
      normalizeToken(historical.executiveState) !==
        normalizeToken(current.executiveState) ||
      normalizeToken(historical.attentionState) !==
        normalizeToken(current.attentionState) ||
      normalizeToken(historical.status) !== normalizeToken(current.status)
    );
  });

  const executionSummaries = memory.executionLinks.map((link) => {
    const execution = subjectsById.get(link.executionObjectId);
    return Object.freeze({
      executionObjectId: link.executionObjectId,
      status: execution?.status ?? link.executionStatusAtLink ?? null,
      relationKind: link.relationKind,
    });
  });

  return Object.freeze({
    available: true,
    eligible: true,
    memory,
    historicalStates: Object.freeze(historicalStates),
    currentStates: Object.freeze(currentStates),
    historicalVsCurrentDifferent,
    outcomeTrace: memory.outcomeTrace,
    executionSummaries: Object.freeze(executionSummaries),
    suppressedReason: null,
  });
}

// ─── Observability / verify ─────────────────────────────────────────────────

export function buildExecutiveDecisionMemoryObservability(
  view: ExecutiveDecisionMemoryView,
): Readonly<Record<string, string | number | boolean | null>> {
  const memory = view.memory;
  return Object.freeze({
    decisionMemoryAvailable: view.available,
    decisionMemoryId: memory?.memoryId ?? "none",
    decisionMemoryDecisionId: memory?.decisionObjectId ?? "none",
    decisionMemoryScopeKey: memory?.scopeKey ?? "none",
    decisionMemoryCapturedAt: memory?.recordedAt ?? "none",
    decisionMemoryStatusAtCapture: memory?.decisionStatus ?? "none",
    decisionMemoryEvidenceCount: memory?.contextSnapshot.evidence.length ?? 0,
    decisionMemoryOptionCount: memory?.consideredOptions.length ?? 0,
    decisionMemorySelectedOptionId: memory?.selectedOptionId ?? "none",
    decisionMemoryExpectedOutcomeCount: memory?.expectedOutcomes.length ?? 0,
    decisionMemoryExecutionCount: memory?.executionLinks.length ?? 0,
    decisionMemoryRationaleAvailable: memory?.rationale != null,
    decisionMemoryRationaleSource: memory?.rationale?.sourceKind ?? "none",
    outcomeTraceAvailable: view.outcomeTrace != null,
    outcomeTraceStatus: view.outcomeTrace?.status ?? "none",
    outcomeTraceComparisonCount: view.outcomeTrace?.comparisons.length ?? 0,
    outcomeTraceLastEvaluatedAt: view.outcomeTrace?.evaluatedAt ?? "none",
    historicalVsCurrentStateDifferent: view.historicalVsCurrentDifferent,
    memoryPersistenceLevel:
      EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.persistenceLevel,
    memoryIsSemanticObject: false,
  });
}

export function verifyExecutiveStageDecisionMemory(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly safetyValid: boolean;
  readonly persistenceSessionOnly: boolean;
}> {
  const identity = getExecutiveStageDecisionMemoryIdentity();
  const identityValid =
    identity.id === "STAGE-PROD:5/ExecutiveStageDecisionMemory" &&
    identity.version === "1.0.0";

  const boundaryValid =
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.memoryIsSemanticObject === false &&
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.implementsDecisionMemory === true &&
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.rewritesHistoryOnOutcome === false;

  const safetyValid =
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.inventsCausalClaims === false &&
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.classifiesGoodBadDecision ===
      false &&
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.autoReversesDecisions === false;

  const persistenceSessionOnly =
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.persistenceLevel === "session";

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    safetyValid &&
    persistenceSessionOnly;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    safetyValid,
    persistenceSessionOnly,
  });
}
