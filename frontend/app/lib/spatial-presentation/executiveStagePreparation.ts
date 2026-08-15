/**
 * STAGE-PROD:6 — Executive Daily / Meeting Preparation.
 *
 * Temporary presentation context that selects real semantic Objects for Stage
 * disclosure + Advisor summary. Not a semantic Object. No auto-focus.
 * No LLM agenda. No calendar integration.
 *
 * Builds on STAGE-PROD:0–5. Reuses collection-style layout (no fake center).
 */

import type { ExecutiveChangeComparisonResult } from "./executiveStageChangeIntelligence.ts";
import type { ExecutiveDecisionMemoryView } from "./executiveStageDecisionMemory.ts";
import type { ExecutiveNextBestActionResult } from "./executiveStageNextBestAction.ts";
import {
  EXECUTIVE_STAGE_COLLECTION_BUDGET,
  resolveExecutiveCollectionLayout,
} from "./executiveStageQueueFoundation.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStagePreparationIdentity =
  "STAGE-PROD:6/ExecutiveStagePreparation" as const;

export const executiveStagePreparationVersion = "1.0.0" as const;

export const executiveStagePreparationNamespace =
  "nexora.spatial-presentation.executive-stage-preparation" as const;

export const executiveStagePreparationPhase =
  "ExecutiveDailyMeetingPreparation" as const;

export const executiveStagePreparationArchitecturalRole =
  "PresentationOnlyExecutivePreparationAuthority" as const;

export type ExecutiveStagePreparationIdentity = {
  readonly id: typeof executiveStagePreparationIdentity;
  readonly version: typeof executiveStagePreparationVersion;
  readonly namespace: typeof executiveStagePreparationNamespace;
  readonly phase: typeof executiveStagePreparationPhase;
  readonly architecturalRole: typeof executiveStagePreparationArchitecturalRole;
};

const IDENTITY: ExecutiveStagePreparationIdentity = Object.freeze({
  id: executiveStagePreparationIdentity,
  version: executiveStagePreparationVersion,
  namespace: executiveStagePreparationNamespace,
  phase: executiveStagePreparationPhase,
  architecturalRole: executiveStagePreparationArchitecturalRole,
});

export function getExecutiveStagePreparationIdentity(): ExecutiveStagePreparationIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_PREPARATION_BOUNDARY = Object.freeze({
  architecturalRole: executiveStagePreparationArchitecturalRole,
  preparationIsSemanticObject: false as const,
  inventsAiSummary: false as const,
  inventsMeetingAgenda: false as const,
  autoFocusesObject: false as const,
  autoApprovesDecisions: false as const,
  autoStartsExecutions: false as const,
  createsWorkspace: false as const,
  movesCamera: false as const,
  changesSemanticZ: false as const,
  implementsPreparation: true as const,
  presentationOnly: true as const,
  /** Live-recompute members from current truth; preserve mode/subject. */
  refreshPolicy: "live-recompute" as const,
  naturalLanguageParsing: false as const,
  calendarIntegration: false as const,
});

export const EXECUTIVE_STAGE_PREPARATION_BUDGET = Object.freeze({
  /** STAGE-PROD:6V — calibrated from 8 → 6 for Daily/Meeting density. */
  maxVisible: 6,
  minVisible: 1,
  preferredVisible: 5,
});

export const EXECUTIVE_PREPARATION_TRAIL_PREFIX = "nexora-preparation:" as const;

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutivePreparationMode = "daily" | "meeting";

export type ExecutivePreparationSubject = {
  readonly kind:
    | "topic"
    | "goal"
    | "object"
    | "project"
    | "team"
    | "freeform-context";
  readonly label: string;
  readonly semanticObjectIds?: readonly string[];
  readonly keywords?: readonly string[];
};

export type ExecutivePreparationReasonCode =
  | "critical"
  | "pending-decision"
  | "blocked-delayed-execution"
  | "meaningful-deterioration"
  | "unresolved-problem"
  | "recent-material-change"
  | "meeting-relevance"
  | "watch-priority"
  | "goal-pressure"
  | "outcome-review-available"
  | "nba-action-pressure";

export type ExecutivePreparationPrimaryReason =
  | "Became Critical"
  | "Decision Required"
  | "Execution Delayed"
  | "Unresolved Problem"
  | "Meeting-Relevant Change"
  | "Recent Change"
  | "Watch Priority"
  | "Goal Under Pressure"
  | "Outcome Review Available"
  | "Meeting Relevant";

export type ExecutivePreparationCandidate = {
  readonly objectId: string;
  readonly objectKind: string;
  readonly label: string;
  readonly priority: number;
  readonly primaryReason: ExecutivePreparationPrimaryReason;
  readonly primaryReasonCode: ExecutivePreparationReasonCode;
  readonly supportingReasonCodes: readonly ExecutivePreparationReasonCode[];
};

export type ExecutivePreparationSummaryItem = {
  readonly objectId: string;
  readonly label: string;
  readonly reason: string;
  readonly priority: number;
};

export type ExecutivePreparationSummary = {
  readonly headline: string;
  readonly priorityItems: readonly ExecutivePreparationSummaryItem[];
  readonly decisionCount: number;
  readonly executionExceptionCount: number;
  readonly meaningfulChangeCount: number;
  readonly hiddenPriorityCount: number;
  readonly reasonCodes: readonly string[];
};

export type ExecutivePreparationContext = {
  readonly mode: ExecutivePreparationMode;
  readonly scopeKey: string;
  readonly subject: ExecutivePreparationSubject | null;
  readonly includedObjectIds: readonly string[];
  readonly watchObjectIds: readonly string[];
  readonly priorityObjectIds: readonly string[];
  readonly hiddenObjectIds: readonly string[];
  readonly candidates: readonly ExecutivePreparationCandidate[];
  readonly summary: ExecutivePreparationSummary;
  readonly enteredFrom: "daily-preparation" | "meeting-preparation";
  readonly isSemanticObject: false;
};

export type ExecutivePreparationResult = {
  readonly context: ExecutivePreparationContext;
  readonly eligible: boolean;
  readonly candidateCount: number;
  readonly includedCount: number;
  readonly hiddenCount: number;
};

export type ExecutivePreparationSubjectInput = {
  readonly subjectId: string;
  readonly objectKind: string;
  readonly label?: string;
  readonly attention?: string;
  readonly status?: string;
  readonly executiveState?: string | null;
  readonly family?: string;
  readonly unresolved?: boolean;
};

export type ExecutivePreparationLinkInput = {
  readonly objectId: string;
  readonly contextId: string;
  readonly relation?: string;
};

export type ExecutivePreparationRelationshipInput = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeToken(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().trim();
}

function labelOf(subject: ExecutivePreparationSubjectInput): string {
  return subject.label?.trim() || subject.subjectId;
}

function kindOf(subject: ExecutivePreparationSubjectInput): string {
  return normalizeToken(subject.objectKind);
}

function isCritical(subject: ExecutivePreparationSubjectInput): boolean {
  return (
    normalizeToken(subject.attention) === "critical" ||
    normalizeToken(subject.executiveState) === "critical"
  );
}

function isUnresolved(subject: ExecutivePreparationSubjectInput): boolean {
  if (subject.unresolved === true) return true;
  const status = normalizeToken(subject.status);
  return (
    status === "risk" ||
    status === "unresolved" ||
    status === "watch" ||
    status === "blocked" ||
    status === "delayed"
  );
}

function isDelayedOrBlocked(subject: ExecutivePreparationSubjectInput): boolean {
  const status = normalizeToken(subject.status);
  return status === "delayed" || status === "blocked" || status === "at-risk";
}

function isPendingDecision(subject: ExecutivePreparationSubjectInput): boolean {
  if (kindOf(subject) !== "decision") return false;
  const status = normalizeToken(subject.status);
  return (
    status === "watch" ||
    status === "under-review" ||
    status === "draft" ||
    normalizeToken(subject.attention) === "important" ||
    normalizeToken(subject.attention) === "critical"
  );
}

export function buildExecutivePreparationScopeKey(input: {
  readonly workspace: string;
  readonly modelId?: string | null;
}): string {
  return `workspace:${input.workspace}|model:${input.modelId?.trim() || "default"}`;
}

export function encodeExecutivePreparationTrailId(
  mode: ExecutivePreparationMode,
  subject?: ExecutivePreparationSubject | null,
): string {
  if (mode === "daily") return `${EXECUTIVE_PREPARATION_TRAIL_PREFIX}daily`;
  const label = encodeURIComponent(subject?.label?.trim() || "meeting");
  const kind = subject?.kind ?? "topic";
  const hasMeta =
    (subject?.keywords?.length ?? 0) > 0 ||
    (subject?.semanticObjectIds?.length ?? 0) > 0;
  if (!hasMeta) {
    return `${EXECUTIVE_PREPARATION_TRAIL_PREFIX}meeting:${kind}:${label}`;
  }
  const meta = encodeURIComponent(
    JSON.stringify({
      keywords: subject?.keywords ?? [],
      semanticObjectIds: subject?.semanticObjectIds ?? [],
    }),
  );
  return `${EXECUTIVE_PREPARATION_TRAIL_PREFIX}meeting:${kind}:${label}:${meta}`;
}

export function isExecutivePreparationTrailId(id: string): boolean {
  return id.startsWith(EXECUTIVE_PREPARATION_TRAIL_PREFIX);
}

export function decodeExecutivePreparationTrailId(id: string): Readonly<{
  readonly mode: ExecutivePreparationMode;
  readonly subject: ExecutivePreparationSubject | null;
}> | null {
  if (!isExecutivePreparationTrailId(id)) return null;
  const rest = id.slice(EXECUTIVE_PREPARATION_TRAIL_PREFIX.length);
  if (rest === "daily") {
    return Object.freeze({ mode: "daily" as const, subject: null });
  }
  if (rest.startsWith("meeting:")) {
    const parts = rest.split(":");
    const kind = (parts[1] ?? "topic") as ExecutivePreparationSubject["kind"];
    let label = "Meeting";
    let keywords: readonly string[] | undefined;
    let semanticObjectIds: readonly string[] | undefined;
    if (parts.length >= 4) {
      try {
        const parsed = JSON.parse(
          decodeURIComponent(parts[parts.length - 1] ?? ""),
        ) as {
          keywords?: readonly string[];
          semanticObjectIds?: readonly string[];
        };
        if (
          parsed != null &&
          typeof parsed === "object" &&
          (Array.isArray(parsed.keywords) ||
            Array.isArray(parsed.semanticObjectIds))
        ) {
          keywords = Object.freeze([...(parsed.keywords ?? [])]);
          semanticObjectIds = Object.freeze([
            ...(parsed.semanticObjectIds ?? []),
          ]);
          label = decodeURIComponent(
            parts.slice(2, -1).join(":") || "Meeting",
          );
        } else {
          label = decodeURIComponent(parts.slice(2).join(":") || "Meeting");
        }
      } catch {
        label = decodeURIComponent(parts.slice(2).join(":") || "Meeting");
      }
    } else {
      label = decodeURIComponent(parts.slice(2).join(":") || "Meeting");
    }
    return Object.freeze({
      mode: "meeting" as const,
      subject: Object.freeze({
        kind,
        label,
        ...(keywords != null ? { keywords } : {}),
        ...(semanticObjectIds != null ? { semanticObjectIds } : {}),
      }),
    });
  }
  return null;
}

function primaryReasonFor(
  code: ExecutivePreparationReasonCode,
): ExecutivePreparationPrimaryReason {
  switch (code) {
    case "critical":
      return "Became Critical";
    case "pending-decision":
      return "Decision Required";
    case "blocked-delayed-execution":
      return "Execution Delayed";
    case "unresolved-problem":
      return "Unresolved Problem";
    case "meaningful-deterioration":
    case "recent-material-change":
      return "Recent Change";
    case "meeting-relevance":
      return "Meeting Relevant";
    case "watch-priority":
      return "Watch Priority";
    case "goal-pressure":
      return "Goal Under Pressure";
    case "outcome-review-available":
      return "Outcome Review Available";
    default:
      return "Meeting Relevant";
  }
}

function reasonRank(code: ExecutivePreparationReasonCode): number {
  const order: ExecutivePreparationReasonCode[] = [
    "critical",
    "pending-decision",
    "blocked-delayed-execution",
    "meaningful-deterioration",
    "unresolved-problem",
    "recent-material-change",
    "meeting-relevance",
    "watch-priority",
    "goal-pressure",
    "outcome-review-available",
    "nba-action-pressure",
  ];
  const index = order.indexOf(code);
  return index < 0 ? 99 : index;
}

function pickPrimary(
  codes: readonly ExecutivePreparationReasonCode[],
): ExecutivePreparationReasonCode {
  return [...codes].sort((a, b) => reasonRank(a) - reasonRank(b))[0]!;
}

function deterioratedIds(
  changeComparison: ExecutiveChangeComparisonResult | null | undefined,
): Set<string> {
  return new Set(
    (changeComparison?.changes ?? [])
      .filter((change) => change.changeKind === "deteriorated")
      .map((change) => change.objectId),
  );
}

function changedIds(
  changeComparison: ExecutiveChangeComparisonResult | null | undefined,
): Set<string> {
  return new Set(changeComparison?.changedObjectIds ?? []);
}

function relatedIdsFor(
  subjectId: string,
  links: readonly ExecutivePreparationLinkInput[],
  relationships: readonly ExecutivePreparationRelationshipInput[],
): Set<string> {
  const related = new Set<string>([subjectId]);
  for (const link of links) {
    if (link.objectId === subjectId) related.add(link.contextId);
    if (link.contextId === subjectId) related.add(link.objectId);
  }
  for (const relationship of relationships) {
    if (relationship.sourceId === subjectId) related.add(relationship.targetId);
    if (relationship.targetId === subjectId) related.add(relationship.sourceId);
  }
  return related;
}

function expandMeetingRelevance(input: {
  readonly subject: ExecutivePreparationSubject;
  readonly subjects: readonly ExecutivePreparationSubjectInput[];
  readonly links: readonly ExecutivePreparationLinkInput[];
  readonly relationships: readonly ExecutivePreparationRelationshipInput[];
}): Set<string> {
  const seeds = new Set<string>([
    ...(input.subject.semanticObjectIds ?? []),
  ]);
  const keywords = (input.subject.keywords ?? [
    input.subject.label,
  ]).map((entry) => normalizeToken(entry));

  for (const subject of input.subjects) {
    const label = normalizeToken(subject.label);
    if (keywords.some((keyword) => keyword && label.includes(keyword))) {
      seeds.add(subject.subjectId);
    }
  }

  const related = new Set<string>();
  for (const seed of seeds) {
    for (const id of relatedIdsFor(
      seed,
      input.links,
      input.relationships,
    )) {
      related.add(id);
    }
  }
  // 1-hop only from seeds (already in relatedIdsFor).
  return related;
}

function buildCandidateMap(): Map<
  string,
  {
    subject: ExecutivePreparationSubjectInput;
    codes: ExecutivePreparationReasonCode[];
    priority: number;
  }
> {
  return new Map();
}

function upsertCandidate(
  map: Map<
    string,
    {
      subject: ExecutivePreparationSubjectInput;
      codes: ExecutivePreparationReasonCode[];
      priority: number;
    }
  >,
  subject: ExecutivePreparationSubjectInput,
  code: ExecutivePreparationReasonCode,
  priorityBoost: number,
): void {
  const existing = map.get(subject.subjectId);
  if (existing == null) {
    map.set(subject.subjectId, {
      subject,
      codes: [code],
      priority: priorityBoost,
    });
    return;
  }
  if (!existing.codes.includes(code)) existing.codes.push(code);
  existing.priority = Math.max(existing.priority, priorityBoost);
}

function finalizeCandidates(
  map: Map<
    string,
    {
      subject: ExecutivePreparationSubjectInput;
      codes: ExecutivePreparationReasonCode[];
      priority: number;
    }
  >,
): ExecutivePreparationCandidate[] {
  return [...map.values()]
    .map((entry) => {
      const primary = pickPrimary(entry.codes);
      return Object.freeze({
        objectId: entry.subject.subjectId,
        objectKind: entry.subject.objectKind,
        label: labelOf(entry.subject),
        priority: entry.priority + (100 - reasonRank(primary)),
        primaryReason: primaryReasonFor(primary),
        primaryReasonCode: primary,
        supportingReasonCodes: Object.freeze(
          entry.codes.filter((code) => code !== primary),
        ),
      });
    })
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return compareIds(a.objectId, b.objectId);
    });
}

function buildSummary(input: {
  readonly mode: ExecutivePreparationMode;
  readonly subject: ExecutivePreparationSubject | null;
  readonly included: readonly ExecutivePreparationCandidate[];
  readonly hiddenCount: number;
  readonly decisionCount: number;
  readonly executionExceptionCount: number;
  readonly meaningfulChangeCount: number;
}): ExecutivePreparationSummary {
  const headline =
    input.mode === "daily"
      ? `${input.included.length} item${input.included.length === 1 ? "" : "s"} need attention.`
      : `${input.subject?.label ?? "Meeting"} · ${input.included.length} prepared.`;
  return Object.freeze({
    headline,
    priorityItems: Object.freeze(
      input.included.map((entry) =>
        Object.freeze({
          objectId: entry.objectId,
          label: entry.label,
          reason: entry.primaryReason,
          priority: entry.priority,
        }),
      ),
    ),
    decisionCount: input.decisionCount,
    executionExceptionCount: input.executionExceptionCount,
    meaningfulChangeCount: input.meaningfulChangeCount,
    hiddenPriorityCount: input.hiddenCount,
    reasonCodes: Object.freeze(
      input.included.map((entry) => entry.primaryReasonCode),
    ),
  });
}

function toResult(input: {
  readonly mode: ExecutivePreparationMode;
  readonly scopeKey: string;
  readonly subject: ExecutivePreparationSubject | null;
  readonly candidates: readonly ExecutivePreparationCandidate[];
  readonly watchObjectIds: readonly string[];
  readonly changeComparison?: ExecutiveChangeComparisonResult | null;
}): ExecutivePreparationResult {
  const maxVisible = EXECUTIVE_STAGE_PREPARATION_BUDGET.maxVisible;
  const included = Object.freeze(input.candidates.slice(0, maxVisible));
  const hidden = Object.freeze(input.candidates.slice(maxVisible));
  const includedIds = Object.freeze(included.map((entry) => entry.objectId));
  const watchObjectIds = Object.freeze(
    input.watchObjectIds.filter((id) => !includedIds.includes(id)),
  );
  const decisionCount = included.filter(
    (entry) => normalizeToken(entry.objectKind) === "decision",
  ).length;
  const executionExceptionCount = included.filter(
    (entry) =>
      normalizeToken(entry.objectKind) === "execution" &&
      entry.primaryReasonCode === "blocked-delayed-execution",
  ).length;
  const summary = buildSummary({
    mode: input.mode,
    subject: input.subject,
    included,
    hiddenCount: hidden.length,
    decisionCount,
    executionExceptionCount,
    meaningfulChangeCount: input.changeComparison?.changedObjectIds.length ?? 0,
  });
  const context: ExecutivePreparationContext = Object.freeze({
    mode: input.mode,
    scopeKey: input.scopeKey,
    subject: input.subject,
    includedObjectIds: includedIds,
    watchObjectIds,
    priorityObjectIds: includedIds,
    hiddenObjectIds: Object.freeze(hidden.map((entry) => entry.objectId)),
    candidates: included,
    summary,
    enteredFrom:
      input.mode === "daily"
        ? ("daily-preparation" as const)
        : ("meeting-preparation" as const),
    isSemanticObject: false,
  });
  return Object.freeze({
    context,
    eligible: true,
    candidateCount: input.candidates.length,
    includedCount: included.length,
    hiddenCount: hidden.length,
  });
}

// ─── Resolvers ──────────────────────────────────────────────────────────────

export function resolveExecutiveDailyPreparation(input: {
  readonly scopeKey: string;
  readonly subjects: readonly ExecutivePreparationSubjectInput[];
  readonly links?: readonly ExecutivePreparationLinkInput[];
  readonly relationships?: readonly ExecutivePreparationRelationshipInput[];
  readonly changeComparison?: ExecutiveChangeComparisonResult | null;
  readonly nextBestActionsBySubject?: Readonly<
    Record<string, ExecutiveNextBestActionResult | null | undefined>
  >;
  readonly decisionMemoryByDecisionId?: Readonly<
    Record<string, ExecutiveDecisionMemoryView | null | undefined>
  >;
}): ExecutivePreparationResult {
  const map = buildCandidateMap();
  const deteriorated = deterioratedIds(input.changeComparison);
  const changed = changedIds(input.changeComparison);

  for (const subject of input.subjects) {
    const kind = kindOf(subject);
    if (isCritical(subject)) {
      upsertCandidate(map, subject, "critical", 900);
    }
    if (deteriorated.has(subject.subjectId)) {
      upsertCandidate(map, subject, "meaningful-deterioration", 850);
    } else if (changed.has(subject.subjectId)) {
      upsertCandidate(map, subject, "recent-material-change", 620);
    }
    if (kind === "decision" && isPendingDecision(subject)) {
      upsertCandidate(map, subject, "pending-decision", 820);
    }
    if (kind === "execution" && isDelayedOrBlocked(subject)) {
      upsertCandidate(map, subject, "blocked-delayed-execution", 800);
    }
    if (kind === "problem" && isUnresolved(subject)) {
      upsertCandidate(map, subject, "unresolved-problem", 760);
    }
    if (
      (normalizeToken(subject.attention) === "important" ||
        normalizeToken(subject.attention) === "elevated") &&
      kind === "object"
    ) {
      // Watch-priority business objects only if already elevated — not stable normal.
      if (!isCritical(subject) && isUnresolved(subject)) {
        upsertCandidate(map, subject, "watch-priority", 540);
      }
    }
    const nba = input.nextBestActionsBySubject?.[subject.subjectId];
    if (nba?.recommendedAction != null) {
      upsertCandidate(map, subject, "nba-action-pressure", 580);
    }
    const memory = input.decisionMemoryByDecisionId?.[subject.subjectId];
    if (memory?.available === true && memory.outcomeTrace != null) {
      upsertCandidate(map, subject, "outcome-review-available", 560);
    }
  }

  const candidates = finalizeCandidates(map);
  // Exclude stable low-priority business objects that only got weak signals.
  const filtered = candidates.filter((entry) => {
    if (entry.priority < 500) return false;
    return true;
  });

  const watchObjectIds = input.subjects
    .filter(
      (subject) =>
        isCritical(subject) &&
        !filtered.slice(0, EXECUTIVE_STAGE_PREPARATION_BUDGET.maxVisible).some(
          (entry) => entry.objectId === subject.subjectId,
        ),
    )
    .map((subject) => subject.subjectId)
    .sort(compareIds);

  return toResult({
    mode: "daily",
    scopeKey: input.scopeKey,
    subject: null,
    candidates: filtered,
    watchObjectIds,
    changeComparison: input.changeComparison,
  });
}

export function resolveExecutiveMeetingPreparation(input: {
  readonly scopeKey: string;
  readonly subject: ExecutivePreparationSubject;
  readonly subjects: readonly ExecutivePreparationSubjectInput[];
  readonly links?: readonly ExecutivePreparationLinkInput[];
  readonly relationships?: readonly ExecutivePreparationRelationshipInput[];
  readonly changeComparison?: ExecutiveChangeComparisonResult | null;
  readonly decisionMemoryByDecisionId?: Readonly<
    Record<string, ExecutiveDecisionMemoryView | null | undefined>
  >;
}): ExecutivePreparationResult {
  const links = input.links ?? [];
  const relationships = input.relationships ?? [];
  const relevant = expandMeetingRelevance({
    subject: input.subject,
    subjects: input.subjects,
    links,
    relationships,
  });
  const deteriorated = deterioratedIds(input.changeComparison);
  const changed = changedIds(input.changeComparison);
  const map = buildCandidateMap();
  const subjectsById = new Map(
    input.subjects.map((subject) => [subject.subjectId, subject]),
  );

  for (const objectId of relevant) {
    const subject = subjectsById.get(objectId);
    if (subject == null) continue;
    const kind = kindOf(subject);
    upsertCandidate(map, subject, "meeting-relevance", 500);
    if (isCritical(subject)) upsertCandidate(map, subject, "critical", 900);
    if (kind === "decision" && isPendingDecision(subject)) {
      upsertCandidate(map, subject, "pending-decision", 820);
    }
    if (kind === "execution" && isDelayedOrBlocked(subject)) {
      upsertCandidate(map, subject, "blocked-delayed-execution", 800);
    }
    if (kind === "problem" && isUnresolved(subject)) {
      upsertCandidate(map, subject, "unresolved-problem", 760);
    }
    if (deteriorated.has(objectId)) {
      upsertCandidate(map, subject, "meaningful-deterioration", 850);
    } else if (changed.has(objectId)) {
      upsertCandidate(map, subject, "recent-material-change", 620);
    }
    const memory = input.decisionMemoryByDecisionId?.[objectId];
    if (memory?.available === true) {
      upsertCandidate(map, subject, "outcome-review-available", 560);
    }
  }

  const candidates = finalizeCandidates(map);
  // Global critical unrelated → Watch only, not meeting members.
  const watchObjectIds = input.subjects
    .filter(
      (subject) =>
        isCritical(subject) &&
        !relevant.has(subject.subjectId),
    )
    .map((subject) => subject.subjectId)
    .sort(compareIds);

  return toResult({
    mode: "meeting",
    scopeKey: input.scopeKey,
    subject: input.subject,
    candidates,
    watchObjectIds,
    changeComparison: input.changeComparison,
  });
}

export function resolveExecutivePreparationLayout(input: {
  readonly objectIds: readonly string[];
}): ReturnType<typeof resolveExecutiveCollectionLayout> {
  return resolveExecutiveCollectionLayout({
    objectIds: input.objectIds.slice(
      0,
      Math.max(
        EXECUTIVE_STAGE_COLLECTION_BUDGET.maxVisible,
        EXECUTIVE_STAGE_PREPARATION_BUDGET.maxVisible,
      ),
    ),
  });
}

// ─── Observability / verify ─────────────────────────────────────────────────

export function buildExecutivePreparationObservability(
  result: ExecutivePreparationResult | null,
): Readonly<Record<string, string | number | boolean | null>> {
  const context = result?.context;
  return Object.freeze({
    preparationActive: result != null,
    preparationMode: context?.mode ?? "none",
    preparationScopeKey: context?.scopeKey ?? "none",
    preparationSubjectKind: context?.subject?.kind ?? "none",
    preparationSubjectLabel: context?.subject?.label ?? "none",
    preparationCandidateCount: result?.candidateCount ?? 0,
    preparationIncludedCount: result?.includedCount ?? 0,
    preparationHiddenCount: result?.hiddenCount ?? 0,
    preparationIncludedObjectIds:
      context?.includedObjectIds.join("|") ?? "none",
    preparationPriorityObjectIds:
      context?.priorityObjectIds.join("|") ?? "none",
    preparationWatchObjectIds: context?.watchObjectIds.join("|") ?? "none",
    preparationDecisionCount: context?.summary.decisionCount ?? 0,
    preparationExecutionExceptionCount:
      context?.summary.executionExceptionCount ?? 0,
    preparationChangeCount: context?.summary.meaningfulChangeCount ?? 0,
    preparationRefreshPolicy:
      EXECUTIVE_STAGE_PREPARATION_BOUNDARY.refreshPolicy,
    advisorPreparationContext:
      context == null
        ? "none"
        : context.mode === "daily"
          ? "Daily Preparation"
          : `${context.subject?.label ?? "Meeting"} · Prepared Context`,
    preparationEnteredFrom: context?.enteredFrom ?? "none",
    preparationIsSemanticObject: false,
  });
}

export function verifyExecutiveStagePreparation(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly safetyValid: boolean;
}> {
  const identity = getExecutiveStagePreparationIdentity();
  const identityValid =
    identity.id === "STAGE-PROD:6/ExecutiveStagePreparation" &&
    identity.version === "1.0.0";
  const boundaryValid =
    EXECUTIVE_STAGE_PREPARATION_BOUNDARY.preparationIsSemanticObject ===
      false &&
    EXECUTIVE_STAGE_PREPARATION_BOUNDARY.autoFocusesObject === false &&
    EXECUTIVE_STAGE_PREPARATION_BOUNDARY.createsWorkspace === false &&
    EXECUTIVE_STAGE_PREPARATION_BOUNDARY.calendarIntegration === false;
  const safetyValid =
    EXECUTIVE_STAGE_PREPARATION_BOUNDARY.autoApprovesDecisions === false &&
    EXECUTIVE_STAGE_PREPARATION_BOUNDARY.autoStartsExecutions === false &&
    EXECUTIVE_STAGE_PREPARATION_BOUNDARY.inventsAiSummary === false;
  return Object.freeze({
    ok:
      options?.forceFailure !== true &&
      identityValid &&
      boundaryValid &&
      safetyValid,
    identityValid,
    boundaryValid,
    safetyValid,
  });
}
