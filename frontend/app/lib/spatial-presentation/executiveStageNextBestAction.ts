/**
 * STAGE-PROD:3 — Executive Next Best Action.
 *
 * Focused semantic Object → deterministic recommended next step + alternatives.
 * Guides the executive through existing Nexora navigation/collections.
 * Does not decide, approve, commit, or invent AI advice.
 *
 * Builds on STAGE-PROD:0/1/2. Create Scenario/Decision are omitted until
 * real creation workflows exist (no dead buttons).
 */

import type { ExecutiveChangeComparisonResult } from "./executiveStageChangeIntelligence.ts";
import type { ExecutiveQueueCategory } from "./executiveStageProductivityContract.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageNextBestActionIdentity =
  "STAGE-PROD:3/ExecutiveStageNextBestAction" as const;

export const executiveStageNextBestActionVersion = "1.0.0" as const;

export const executiveStageNextBestActionNamespace =
  "nexora.spatial-presentation.executive-stage-next-best-action" as const;

export const executiveStageNextBestActionPhase =
  "ExecutiveNextBestAction" as const;

export const executiveStageNextBestActionArchitecturalRole =
  "PresentationOnlyExecutiveNextBestActionAuthority" as const;

export type ExecutiveStageNextBestActionIdentity = {
  readonly id: typeof executiveStageNextBestActionIdentity;
  readonly version: typeof executiveStageNextBestActionVersion;
  readonly namespace: typeof executiveStageNextBestActionNamespace;
  readonly phase: typeof executiveStageNextBestActionPhase;
  readonly architecturalRole: typeof executiveStageNextBestActionArchitecturalRole;
};

const IDENTITY: ExecutiveStageNextBestActionIdentity = Object.freeze({
  id: executiveStageNextBestActionIdentity,
  version: executiveStageNextBestActionVersion,
  namespace: executiveStageNextBestActionNamespace,
  phase: executiveStageNextBestActionPhase,
  architecturalRole: executiveStageNextBestActionArchitecturalRole,
});

export function getExecutiveStageNextBestActionIdentity(): ExecutiveStageNextBestActionIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY = Object.freeze({
  architecturalRole: executiveStageNextBestActionArchitecturalRole,
  nbaIsSemanticObject: false as const,
  inventsAiRecommendations: false as const,
  autoApprovesDecisions: false as const,
  autoStartsExecutions: false as const,
  autoResolvesProblems: false as const,
  createsObjectsWithoutWorkflow: false as const,
  movesCamera: false as const,
  changesSemanticZ: false as const,
  implementsNextBestAction: true as const,
  presentationOnly: true as const,
  /** Creation workflows not operational on Stage path — do not expose. */
  createScenarioAvailable: false as const,
  createDecisionAvailable: false as const,
});

export const EXECUTIVE_NBA_LIMITS = Object.freeze({
  maxRecommended: 1,
  maxAlternatives: 3,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveNextBestActionKind =
  | "inspect-related-object"
  | "inspect-problem"
  | "inspect-risk"
  | "open-scenario"
  | "compare-scenarios"
  | "review-decision"
  | "review-execution"
  | "inspect-change"
  | "acknowledge-change"
  | "no-action";

export type ExecutiveNextBestActionReasonCode =
  | "critical-related-problem"
  | "unresolved-related-problem"
  | "existing-scenario-ready"
  | "multiple-scenarios-compare"
  | "pending-decision"
  | "decision-under-review"
  | "approved-decision-has-execution"
  | "execution-delayed"
  | "execution-blocked"
  | "execution-review"
  | "related-risk-critical"
  | "recent-deterioration"
  | "inspect-related"
  | "no-action-stable"
  | "target-missing"
  | "mode-ineligible"
  | "unsafe-executive-action";

export type ExecutiveNextBestAction = {
  readonly id: string;
  readonly kind: ExecutiveNextBestActionKind;
  readonly subjectObjectId: string;
  readonly targetObjectId?: string;
  readonly targetCollection?: ExecutiveQueueCategory | "changes-since-visit";
  readonly label: string;
  readonly reason: string;
  readonly reasonCode: ExecutiveNextBestActionReasonCode;
  readonly priority: number;
  readonly confidence: "deterministic";
  readonly isSemanticObject: false;
};

export type ExecutiveNextBestActionResult = {
  readonly subjectObjectId: string | null;
  readonly recommendedAction: ExecutiveNextBestAction | null;
  readonly alternativeActions: readonly ExecutiveNextBestAction[];
  readonly reasonCodes: readonly string[];
  readonly eligible: boolean;
  readonly candidateCount: number;
  readonly deduplicatedCount: number;
  readonly suppressedCount: number;
};

export type ExecutiveNbaSubjectInput = {
  readonly subjectId: string;
  readonly objectKind: string;
  readonly label?: string;
  readonly attention?: string;
  readonly status?: string;
  readonly executiveState?: string | null;
  readonly unresolved?: boolean;
  readonly family?: "business-object" | "executive-work" | string;
};

export type ExecutiveNbaLinkInput = {
  readonly objectId: string;
  readonly contextId: string;
  readonly relation?: string;
};

export type ExecutiveNbaCapabilities = {
  readonly createScenario: boolean;
  readonly createDecision: boolean;
  readonly openScenarioCollection: boolean;
  readonly openChangeCollection: boolean;
  readonly acknowledgeChanges: boolean;
  readonly selectSubject: boolean;
};

export const DEFAULT_EXECUTIVE_NBA_CAPABILITIES: ExecutiveNbaCapabilities =
  Object.freeze({
    createScenario: false,
    createDecision: false,
    openScenarioCollection: true,
    openChangeCollection: true,
    acknowledgeChanges: true,
    selectSubject: true,
  });

export type ExecutiveNextBestActionExecutionIntent =
  | {
      readonly type: "select-subject";
      readonly subjectId: string;
      readonly actionId: string;
    }
  | {
      readonly type: "open-collection";
      readonly category: ExecutiveQueueCategory | "changes-since-visit";
      readonly actionId: string;
    }
  | {
      readonly type: "acknowledge-changes";
      readonly actionId: string;
    }
  | {
      readonly type: "unavailable";
      readonly actionId: string;
      readonly reasonCode: ExecutiveNextBestActionReasonCode;
    };

// ─── Helpers ────────────────────────────────────────────────────────────────

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeToken(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().trim();
}

function isCritical(subject: ExecutiveNbaSubjectInput): boolean {
  const attention = normalizeToken(subject.attention);
  const state = normalizeToken(subject.executiveState);
  return attention === "critical" || state === "critical";
}

function isUnresolved(subject: ExecutiveNbaSubjectInput): boolean {
  if (subject.unresolved === true) return true;
  const status = normalizeToken(subject.status);
  return (
    status === "risk" ||
    status === "unresolved" ||
    status === "blocked" ||
    status === "delayed" ||
    status === "watch"
  );
}

function isDelayedOrBlocked(subject: ExecutiveNbaSubjectInput): boolean {
  const status = normalizeToken(subject.status);
  return status === "delayed" || status === "blocked" || status === "at-risk";
}

function kindOf(subject: ExecutiveNbaSubjectInput): string {
  return normalizeToken(subject.objectKind);
}

function byId(
  subjects: readonly ExecutiveNbaSubjectInput[],
): Map<string, ExecutiveNbaSubjectInput> {
  return new Map(subjects.map((subject) => [subject.subjectId, subject]));
}

function relatedContextIds(
  subjectId: string,
  links: readonly ExecutiveNbaLinkInput[],
): readonly string[] {
  return Object.freeze(
    [
      ...new Set(
        links
          .filter((link) => link.objectId === subjectId)
          .map((link) => link.contextId),
      ),
    ].sort(compareIds),
  );
}

function relatedObjectIdsForContext(
  contextId: string,
  links: readonly ExecutiveNbaLinkInput[],
): readonly string[] {
  return Object.freeze(
    [
      ...new Set(
        links
          .filter((link) => link.contextId === contextId)
          .map((link) => link.objectId),
      ),
    ].sort(compareIds),
  );
}

function siblingContexts(
  contextId: string,
  links: readonly ExecutiveNbaLinkInput[],
  subjectsById: Map<string, ExecutiveNbaSubjectInput>,
  kind: string,
): readonly ExecutiveNbaSubjectInput[] {
  const objectIds = relatedObjectIdsForContext(contextId, links);
  const found: ExecutiveNbaSubjectInput[] = [];
  for (const objectId of objectIds) {
    for (const context of relatedContextIds(objectId, links)) {
      if (context === contextId) continue;
      const subject = subjectsById.get(context);
      if (subject != null && kindOf(subject) === kind) {
        found.push(subject);
      }
    }
  }
  return Object.freeze(
    [...new Map(found.map((entry) => [entry.subjectId, entry])).values()].sort(
      (a, b) => compareIds(a.subjectId, b.subjectId),
    ),
  );
}

function contextsOfKind(
  subjectId: string,
  kind: string,
  links: readonly ExecutiveNbaLinkInput[],
  subjectsById: Map<string, ExecutiveNbaSubjectInput>,
): readonly ExecutiveNbaSubjectInput[] {
  const subject = subjectsById.get(subjectId);
  if (subject == null) return Object.freeze([]);
  if (kindOf(subject) === "object" || subject.family === "business-object") {
    return Object.freeze(
      relatedContextIds(subjectId, links)
        .map((id) => subjectsById.get(id))
        .filter((entry): entry is ExecutiveNbaSubjectInput => entry != null)
        .filter((entry) => kindOf(entry) === kind)
        .sort((a, b) => compareIds(a.subjectId, b.subjectId)),
    );
  }
  return siblingContexts(subjectId, links, subjectsById, kind);
}

function makeAction(input: {
  readonly kind: ExecutiveNextBestActionKind;
  readonly subjectObjectId: string;
  readonly targetObjectId?: string;
  readonly targetCollection?: ExecutiveQueueCategory | "changes-since-visit";
  readonly label: string;
  readonly reason: string;
  readonly reasonCode: ExecutiveNextBestActionReasonCode;
  readonly priority: number;
}): ExecutiveNextBestAction {
  const targetKey =
    input.targetObjectId ?? input.targetCollection ?? "none";
  return Object.freeze({
    id: `nba:${input.kind}:${input.subjectObjectId}:${targetKey}`,
    kind: input.kind,
    subjectObjectId: input.subjectObjectId,
    targetObjectId: input.targetObjectId,
    targetCollection: input.targetCollection,
    label: input.label,
    reason: input.reason,
    reasonCode: input.reasonCode,
    priority: input.priority,
    confidence: "deterministic" as const,
    isSemanticObject: false as const,
  });
}

const FORBIDDEN_KINDS = Object.freeze([
  "approve-decision",
  "reject-decision",
  "commit-budget",
  "start-execution",
  "delete-object",
  "close-problem",
] as const);

// ─── Availability ───────────────────────────────────────────────────────────

export function isExecutiveNextBestActionAvailable(input: {
  readonly action: ExecutiveNextBestAction;
  readonly subjects: readonly ExecutiveNbaSubjectInput[];
  readonly capabilities?: ExecutiveNbaCapabilities;
}): Readonly<{
  readonly available: boolean;
  readonly suppressionReason: ExecutiveNextBestActionReasonCode | null;
}> {
  const capabilities =
    input.capabilities ?? DEFAULT_EXECUTIVE_NBA_CAPABILITIES;
  const action = input.action;

  if ((FORBIDDEN_KINDS as readonly string[]).includes(action.kind)) {
    return Object.freeze({
      available: false,
      suppressionReason: "unsafe-executive-action" as const,
    });
  }

  if (action.kind === "no-action") {
    return Object.freeze({ available: false, suppressionReason: "no-action-stable" as const });
  }

  if (action.targetObjectId != null) {
    const exists = input.subjects.some(
      (subject) => subject.subjectId === action.targetObjectId,
    );
    if (!exists) {
      return Object.freeze({
        available: false,
        suppressionReason: "target-missing" as const,
      });
    }
    if (!capabilities.selectSubject) {
      return Object.freeze({
        available: false,
        suppressionReason: "target-missing" as const,
      });
    }
  }

  if (action.kind === "compare-scenarios" && !capabilities.openScenarioCollection) {
    return Object.freeze({
      available: false,
      suppressionReason: "target-missing" as const,
    });
  }

  if (
    (action.kind === "inspect-change" || action.kind === "acknowledge-change") &&
    action.targetCollection === "changes-since-visit" &&
    !capabilities.openChangeCollection &&
    action.kind === "inspect-change"
  ) {
    return Object.freeze({
      available: false,
      suppressionReason: "target-missing" as const,
    });
  }

  if (action.kind === "acknowledge-change" && !capabilities.acknowledgeChanges) {
    return Object.freeze({
      available: false,
      suppressionReason: "target-missing" as const,
    });
  }

  return Object.freeze({ available: true, suppressionReason: null });
}

// ─── Candidate generation ───────────────────────────────────────────────────

function pushProblemActions(
  subject: ExecutiveNbaSubjectInput,
  problems: readonly ExecutiveNbaSubjectInput[],
  out: ExecutiveNextBestAction[],
  recentDeterioration: boolean,
): void {
  for (const problem of problems) {
    const criticalBoost =
      isCritical(subject) || isCritical(problem) ? 120 : 0;
    const changeBoost = recentDeterioration ? 80 : 0;
    const unresolvedBoost = isUnresolved(problem) ? 100 : 40;
    out.push(
      makeAction({
        kind: "inspect-problem",
        subjectObjectId: subject.subjectId,
        targetObjectId: problem.subjectId,
        label: `Review ${problem.label ?? "Problem"}`,
        reason:
          isCritical(subject) || isCritical(problem)
            ? "Critical subject has an unresolved related problem"
            : "Related problem needs review",
        reasonCode:
          isCritical(subject) || isCritical(problem)
            ? "critical-related-problem"
            : "unresolved-related-problem",
        priority: 900 + criticalBoost + unresolvedBoost + changeBoost,
      }),
    );
  }
}

function pushScenarioActions(
  subject: ExecutiveNbaSubjectInput,
  scenarios: readonly ExecutiveNbaSubjectInput[],
  out: ExecutiveNextBestAction[],
): void {
  if (scenarios.length >= 2) {
    out.push(
      makeAction({
        kind: "compare-scenarios",
        subjectObjectId: subject.subjectId,
        targetCollection: "scenario",
        label: "Compare Scenarios",
        reason: "Multiple related scenarios are available to compare",
        reasonCode: "multiple-scenarios-compare",
        priority: 780,
      }),
    );
  }
  for (const scenario of scenarios) {
    out.push(
      makeAction({
        kind: "open-scenario",
        subjectObjectId: subject.subjectId,
        targetObjectId: scenario.subjectId,
        label: `Review ${scenario.label ?? "Scenario"}`,
        reason: "An existing scenario is ready for review",
        reasonCode: "existing-scenario-ready",
        priority: 760,
      }),
    );
  }
}

function pushDecisionActions(
  subject: ExecutiveNbaSubjectInput,
  decisions: readonly ExecutiveNbaSubjectInput[],
  out: ExecutiveNextBestAction[],
): void {
  for (const decision of decisions) {
    const status = normalizeToken(decision.status);
    out.push(
      makeAction({
        kind: "review-decision",
        subjectObjectId: subject.subjectId,
        targetObjectId: decision.subjectId,
        label: `Review ${decision.label ?? "Decision"}`,
        reason:
          status === "watch" || status === "draft"
            ? "A decision is under review"
            : "A related decision needs review",
        reasonCode:
          status === "watch" || status === "draft"
            ? "decision-under-review"
            : "pending-decision",
        priority: 820,
      }),
    );
  }
}

function pushExecutionActions(
  subject: ExecutiveNbaSubjectInput,
  executions: readonly ExecutiveNbaSubjectInput[],
  out: ExecutiveNextBestAction[],
): void {
  for (const execution of executions) {
    const delayed = isDelayedOrBlocked(execution);
    out.push(
      makeAction({
        kind: "review-execution",
        subjectObjectId: subject.subjectId,
        targetObjectId: execution.subjectId,
        label: `Review ${execution.label ?? "Execution"}`,
        reason: delayed
          ? "Execution is delayed or blocked"
          : "Related execution needs review",
        reasonCode: delayed
          ? normalizeToken(execution.status) === "blocked"
            ? "execution-blocked"
            : "execution-delayed"
          : "execution-review",
        priority: delayed ? 860 : 700,
      }),
    );
  }
}

function pushRiskActions(
  subject: ExecutiveNbaSubjectInput,
  risks: readonly ExecutiveNbaSubjectInput[],
  out: ExecutiveNextBestAction[],
): void {
  for (const risk of risks) {
    if (!isCritical(risk) && !isUnresolved(risk)) continue;
    out.push(
      makeAction({
        kind: "inspect-risk",
        subjectObjectId: subject.subjectId,
        targetObjectId: risk.subjectId,
        label: `Inspect ${risk.label ?? "Risk"}`,
        reason: "Related risk requires attention",
        reasonCode: "related-risk-critical",
        priority: 740,
      }),
    );
  }
}

function collectCandidates(input: {
  readonly subject: ExecutiveNbaSubjectInput;
  readonly subjects: readonly ExecutiveNbaSubjectInput[];
  readonly links: readonly ExecutiveNbaLinkInput[];
  readonly changeComparison?: ExecutiveChangeComparisonResult | null;
}): ExecutiveNextBestAction[] {
  const subjectsById = byId(input.subjects);
  const subject = input.subject;
  const kind = kindOf(subject);
  const out: ExecutiveNextBestAction[] = [];
  const recentDeterioration =
    input.changeComparison?.changes.some(
      (change) =>
        change.objectId === subject.subjectId &&
        change.changeKind === "deteriorated",
    ) === true;

  const problems = contextsOfKind(
    subject.subjectId,
    "problem",
    input.links,
    subjectsById,
  );
  const scenarios = contextsOfKind(
    subject.subjectId,
    "scenario",
    input.links,
    subjectsById,
  );
  const decisions = contextsOfKind(
    subject.subjectId,
    "decision",
    input.links,
    subjectsById,
  );
  const executions = contextsOfKind(
    subject.subjectId,
    "execution",
    input.links,
    subjectsById,
  );
  const risks = [
    ...contextsOfKind(subject.subjectId, "risk", input.links, subjectsById),
    ...input.subjects.filter(
      (entry) =>
        kindOf(entry) === "risk" &&
        relatedContextIds(entry.subjectId, input.links).length === 0 &&
        relatedObjectIdsForContext(entry.subjectId, input.links).includes(
          subject.subjectId,
        ),
    ),
  ];
  // Business-object "risk" fixtures are objects with kind object labeled Risk —
  // use linked problems as risk proxies when subject is risk object.
  if (kind === "object" && normalizeToken(subject.label) === "risk") {
    pushProblemActions(subject, problems, out, recentDeterioration);
  }

  if (kind === "object" || subject.family === "business-object") {
    pushProblemActions(subject, problems, out, recentDeterioration);
    pushScenarioActions(subject, scenarios, out);
    pushDecisionActions(subject, decisions, out);
    pushExecutionActions(subject, executions, out);
    // Related risk objects via shared problem links are covered by problems.
  } else if (kind === "problem") {
    pushScenarioActions(subject, scenarios, out);
    pushDecisionActions(subject, decisions, out);
    const relatedObjects = relatedObjectIdsForContext(
      subject.subjectId,
      input.links,
    )
      .map((id) => subjectsById.get(id))
      .filter((entry): entry is ExecutiveNbaSubjectInput => entry != null);
    for (const related of relatedObjects) {
      out.push(
        makeAction({
          kind: "inspect-related-object",
          subjectObjectId: subject.subjectId,
          targetObjectId: related.subjectId,
          label: `Inspect ${related.label ?? "Object"}`,
          reason: "Inspect related business evidence",
          reasonCode: "inspect-related",
          priority: 650,
        }),
      );
    }
    pushExecutionActions(subject, executions, out);
  } else if (kind === "risk") {
    pushScenarioActions(subject, scenarios, out);
    pushDecisionActions(subject, decisions, out);
    pushProblemActions(subject, problems, out, recentDeterioration);
  } else if (kind === "scenario") {
    pushScenarioActions(subject, scenarios, out);
    pushDecisionActions(subject, decisions, out);
    pushProblemActions(subject, problems, out, false);
  } else if (kind === "decision") {
    // Never approve/reject — review only, plus related execution/scenario.
    pushScenarioActions(subject, scenarios, out);
    pushExecutionActions(subject, executions, out);
    out.push(
      makeAction({
        kind: "review-decision",
        subjectObjectId: subject.subjectId,
        targetObjectId: subject.subjectId,
        label: `Review ${subject.label ?? "Decision"}`,
        reason: "Decision requires executive review",
        reasonCode: "decision-under-review",
        priority: 850,
      }),
    );
  } else if (kind === "execution") {
    pushExecutionActions(subject, [subject], out);
    pushDecisionActions(subject, decisions, out);
  } else {
    // Goal / generic — prefer unresolved related problem.
    pushProblemActions(subject, problems, out, recentDeterioration);
    pushScenarioActions(subject, scenarios, out);
    pushDecisionActions(subject, decisions, out);
  }

  if (
    recentDeterioration &&
    input.changeComparison != null &&
    input.changeComparison.changedObjectIds.includes(subject.subjectId)
  ) {
    out.push(
      makeAction({
        kind: "inspect-change",
        subjectObjectId: subject.subjectId,
        targetCollection: "changes-since-visit",
        label: "Inspect Recent Changes",
        reason: "Subject recently deteriorated",
        reasonCode: "recent-deterioration",
        priority: 500,
      }),
    );
  }

  return out;
}

function dedupeActions(
  actions: readonly ExecutiveNextBestAction[],
): readonly ExecutiveNextBestAction[] {
  const best = new Map<string, ExecutiveNextBestAction>();
  for (const action of actions) {
    const key = `${action.kind}::${action.targetObjectId ?? action.targetCollection ?? "none"}`;
    const existing = best.get(key);
    if (existing == null || action.priority > existing.priority) {
      best.set(key, action);
    }
  }
  return Object.freeze(
    [...best.values()].sort((left, right) => {
      if (right.priority !== left.priority) return right.priority - left.priority;
      return compareIds(left.id, right.id);
    }),
  );
}

/**
 * Pure authoritative NBA resolver.
 * Overview/collection → ineligible. Object focus only.
 */
export function resolveExecutiveNextBestActions(input: {
  readonly presentationMode: "overview" | "object-focus" | "collection" | "preparation";
  readonly primaryStageSubjectId: string | null;
  readonly subjects: readonly ExecutiveNbaSubjectInput[];
  readonly links?: readonly ExecutiveNbaLinkInput[];
  readonly changeComparison?: ExecutiveChangeComparisonResult | null;
  readonly capabilities?: ExecutiveNbaCapabilities;
}): ExecutiveNextBestActionResult {
  const capabilities =
    input.capabilities ?? DEFAULT_EXECUTIVE_NBA_CAPABILITIES;

  if (
    input.presentationMode !== "object-focus" ||
    input.primaryStageSubjectId == null
  ) {
    return Object.freeze({
      subjectObjectId: input.primaryStageSubjectId,
      recommendedAction: null,
      alternativeActions: Object.freeze([] as ExecutiveNextBestAction[]),
      reasonCodes: Object.freeze(["mode-ineligible"]),
      eligible: false,
      candidateCount: 0,
      deduplicatedCount: 0,
      suppressedCount: 0,
    });
  }

  const subject = input.subjects.find(
    (entry) => entry.subjectId === input.primaryStageSubjectId,
  );
  if (subject == null) {
    return Object.freeze({
      subjectObjectId: input.primaryStageSubjectId,
      recommendedAction: null,
      alternativeActions: Object.freeze([] as ExecutiveNextBestAction[]),
      reasonCodes: Object.freeze(["target-missing"]),
      eligible: false,
      candidateCount: 0,
      deduplicatedCount: 0,
      suppressedCount: 0,
    });
  }

  const raw = collectCandidates({
    subject,
    subjects: input.subjects,
    links: input.links ?? [],
    changeComparison: input.changeComparison,
  });
  const deduped = dedupeActions(raw);

  const available: ExecutiveNextBestAction[] = [];
  let suppressed = 0;
  for (const action of deduped) {
    const check = isExecutiveNextBestActionAvailable({
      action,
      subjects: input.subjects,
      capabilities,
    });
    if (check.available) available.push(action);
    else suppressed += 1;
  }

  // Stable object with no actionable related work → quiet no-action.
  const hasInterventionSignal =
    isCritical(subject) ||
    isUnresolved(subject) ||
    available.some((action) => action.priority >= 700);

  if (!hasInterventionSignal || available.length === 0) {
    return Object.freeze({
      subjectObjectId: subject.subjectId,
      recommendedAction: null,
      alternativeActions: Object.freeze([] as ExecutiveNextBestAction[]),
      reasonCodes: Object.freeze(["no-action-stable"]),
      eligible: true,
      candidateCount: raw.length,
      deduplicatedCount: deduped.length,
      suppressedCount: suppressed + (available.length === 0 ? 0 : 0),
    });
  }

  const recommended = available[0] ?? null;
  const alternatives = Object.freeze(
    available.slice(1, 1 + EXECUTIVE_NBA_LIMITS.maxAlternatives),
  );

  return Object.freeze({
    subjectObjectId: subject.subjectId,
    recommendedAction: recommended,
    alternativeActions: alternatives,
    reasonCodes: Object.freeze(
      [
        ...(recommended != null ? [recommended.reasonCode] : []),
        ...alternatives.map((action) => action.reasonCode),
      ],
    ),
    eligible: true,
    candidateCount: raw.length,
    deduplicatedCount: deduped.length,
    suppressedCount: suppressed + Math.max(0, available.length - 1 - alternatives.length),
  });
}

/**
 * Route NBA click to existing navigation/collection/ack — never mutates business truth here.
 */
export function executeExecutiveNextBestAction(input: {
  readonly action: ExecutiveNextBestAction;
  readonly subjects: readonly ExecutiveNbaSubjectInput[];
  readonly capabilities?: ExecutiveNbaCapabilities;
}): ExecutiveNextBestActionExecutionIntent {
  const availability = isExecutiveNextBestActionAvailable({
    action: input.action,
    subjects: input.subjects,
    capabilities: input.capabilities,
  });
  if (!availability.available) {
    return Object.freeze({
      type: "unavailable" as const,
      actionId: input.action.id,
      reasonCode: availability.suppressionReason ?? "target-missing",
    });
  }

  if (input.action.targetObjectId != null) {
    return Object.freeze({
      type: "select-subject" as const,
      subjectId: input.action.targetObjectId,
      actionId: input.action.id,
    });
  }

  if (input.action.kind === "compare-scenarios") {
    return Object.freeze({
      type: "open-collection" as const,
      category: "scenario" as const,
      actionId: input.action.id,
    });
  }

  if (input.action.kind === "inspect-change") {
    return Object.freeze({
      type: "open-collection" as const,
      category: "changes-since-visit" as const,
      actionId: input.action.id,
    });
  }

  if (input.action.kind === "acknowledge-change") {
    return Object.freeze({
      type: "acknowledge-changes" as const,
      actionId: input.action.id,
    });
  }

  return Object.freeze({
    type: "unavailable" as const,
    actionId: input.action.id,
    reasonCode: "target-missing" as const,
  });
}

export function buildExecutiveNextBestActionObservability(
  result: ExecutiveNextBestActionResult,
): Readonly<Record<string, string | number | boolean | null>> {
  return Object.freeze({
    contract: executiveStageNextBestActionIdentity,
    nbaSubjectId: result.subjectObjectId,
    nbaEligible: result.eligible,
    nbaRecommendedActionId: result.recommendedAction?.id ?? null,
    nbaRecommendedActionKind: result.recommendedAction?.kind ?? null,
    nbaRecommendedTargetId:
      result.recommendedAction?.targetObjectId ??
      result.recommendedAction?.targetCollection ??
      null,
    nbaRecommendedReasonCode: result.recommendedAction?.reasonCode ?? null,
    nbaAlternativeActionIds: result.alternativeActions.map((a) => a.id).join("|") || "none",
    nbaCandidateCount: result.candidateCount,
    nbaDeduplicatedCount: result.deduplicatedCount,
    nbaSuppressedCount: result.suppressedCount,
    nbaPresentationVisible: result.recommendedAction != null,
  });
}

export function verifyExecutiveStageNextBestAction(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly safetyValid: boolean;
  readonly noDeadCreates: boolean;
}> {
  const identity = getExecutiveStageNextBestActionIdentity();
  const identityValid =
    identity.id === executiveStageNextBestActionIdentity &&
    identity.version === executiveStageNextBestActionVersion;
  const boundaryValid =
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.nbaIsSemanticObject === false &&
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.implementsNextBestAction === true &&
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.movesCamera === false;
  const safetyValid =
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.autoApprovesDecisions === false &&
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.autoStartsExecutions === false;
  const noDeadCreates =
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.createScenarioAvailable ===
      false &&
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.createDecisionAvailable === false;
  return Object.freeze({
    ok:
      options?.forceFailure === true
        ? false
        : identityValid && boundaryValid && safetyValid && noDeadCreates,
    identityValid,
    boundaryValid,
    safetyValid,
    noDeadCreates,
  });
}
