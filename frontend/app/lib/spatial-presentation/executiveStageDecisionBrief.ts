/**
 * STAGE-PROD:4 — Executive Decision Brief.
 *
 * Decision-relevant focus → grounded Situation / Evidence / Impact / Options /
 * Recommendation (from PROD:3 NBA) / Decision Required.
 * Synthesis only — never auto-approves or invents unsupported claims.
 *
 * DRI-7 remains deferred on Stage path (same as PROD:3).
 */

import type { ExecutiveChangeComparisonResult } from "./executiveStageChangeIntelligence.ts";
import type {
  ExecutiveNextBestAction,
  ExecutiveNextBestActionResult,
} from "./executiveStageNextBestAction.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageDecisionBriefIdentity =
  "STAGE-PROD:4/ExecutiveStageDecisionBrief" as const;

export const executiveStageDecisionBriefVersion = "1.0.0" as const;

export const executiveStageDecisionBriefNamespace =
  "nexora.spatial-presentation.executive-stage-decision-brief" as const;

export const executiveStageDecisionBriefPhase =
  "ExecutiveDecisionBrief" as const;

export const executiveStageDecisionBriefArchitecturalRole =
  "PresentationOnlyExecutiveDecisionBriefAuthority" as const;

export type ExecutiveStageDecisionBriefIdentity = {
  readonly id: typeof executiveStageDecisionBriefIdentity;
  readonly version: typeof executiveStageDecisionBriefVersion;
  readonly namespace: typeof executiveStageDecisionBriefNamespace;
  readonly phase: typeof executiveStageDecisionBriefPhase;
  readonly architecturalRole: typeof executiveStageDecisionBriefArchitecturalRole;
};

const IDENTITY: ExecutiveStageDecisionBriefIdentity = Object.freeze({
  id: executiveStageDecisionBriefIdentity,
  version: executiveStageDecisionBriefVersion,
  namespace: executiveStageDecisionBriefNamespace,
  phase: executiveStageDecisionBriefPhase,
  architecturalRole: executiveStageDecisionBriefArchitecturalRole,
});

export function getExecutiveStageDecisionBriefIdentity(): ExecutiveStageDecisionBriefIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY = Object.freeze({
  architecturalRole: executiveStageDecisionBriefArchitecturalRole,
  briefIsSemanticObject: false as const,
  inventsAiNarrative: false as const,
  inventsCausalClaims: false as const,
  inventsOptions: false as const,
  inventsDoNothing: false as const,
  autoApprovesDecisions: false as const,
  autoStartsExecutions: false as const,
  autoResolvesProblems: false as const,
  recomputesNbaIndependently: false as const,
  movesCamera: false as const,
  changesSemanticZ: false as const,
  implementsDecisionBrief: true as const,
  presentationOnly: true as const,
  dri7Integrated: false as const,
});

export const EXECUTIVE_DECISION_BRIEF_LIMITS = Object.freeze({
  maxEvidenceItems: 6,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveBriefCompleteness = "sufficient" | "partial" | "unavailable";

export type ExecutiveBriefReasonCode =
  | "mode-ineligible"
  | "subject-missing"
  | "no-decision-pressure"
  | "insufficient-truth"
  | "situation-from-state"
  | "evidence-critical-state"
  | "evidence-unresolved"
  | "evidence-related-problem"
  | "evidence-related-risk"
  | "evidence-decision-status"
  | "evidence-execution-status"
  | "evidence-recent-change"
  | "impact-canonical-relation"
  | "options-from-scenarios"
  | "recommendation-from-nba"
  | "decision-required-from-context"
  | "partial-brief"
  | "sufficient-brief";

export type ExecutiveBriefSection = {
  readonly label: string;
  readonly text: string;
  readonly sourceObjectIds: readonly string[];
  readonly sourceRelationshipIds?: readonly string[];
  readonly sourceChangeIds?: readonly string[];
  readonly sourceGuidanceIds?: readonly string[];
};

export type ExecutiveBriefEvidenceItem = {
  readonly id: string;
  readonly text: string;
  readonly sourceObjectIds: readonly string[];
  readonly sourceKind: string;
  readonly importance: number;
  readonly sourceRelationshipIds?: readonly string[];
  readonly sourceChangeIds?: readonly string[];
};

export type ExecutiveBriefOption = {
  readonly id: string;
  readonly label: string;
  readonly objectId?: string;
  readonly optionKind: "scenario" | "decision-path" | "existing-alternative";
  readonly status?: string;
  readonly sourceObjectIds: readonly string[];
};

export type ExecutiveBriefRecommendation = {
  readonly text: string;
  readonly actionId: string | null;
  readonly actionKind: string | null;
  readonly targetObjectId?: string | null;
  readonly sourceGuidanceIds: readonly string[];
  readonly sourceObjectIds: readonly string[];
};

export type ExecutiveDecisionBrief = {
  readonly subjectObjectId: string;
  readonly situation: ExecutiveBriefSection;
  readonly evidence: readonly ExecutiveBriefEvidenceItem[];
  readonly impact: ExecutiveBriefSection | null;
  readonly options: readonly ExecutiveBriefOption[];
  readonly recommendation: ExecutiveBriefRecommendation | null;
  readonly decisionRequired: ExecutiveBriefSection | null;
  readonly completeness: "sufficient" | "partial";
  readonly reasonCodes: readonly ExecutiveBriefReasonCode[];
  readonly isSemanticObject: false;
};

export type ExecutiveDecisionBriefResult = {
  readonly subjectObjectId: string | null;
  readonly eligible: boolean;
  readonly available: boolean;
  readonly brief: ExecutiveDecisionBrief | null;
  readonly completeness: ExecutiveBriefCompleteness;
  readonly reasonCodes: readonly ExecutiveBriefReasonCode[];
  readonly suppressedReason: ExecutiveBriefReasonCode | null;
};

export type ExecutiveBriefSubjectInput = {
  readonly subjectId: string;
  readonly objectKind: string;
  readonly label?: string;
  readonly attention?: string;
  readonly status?: string;
  readonly executiveState?: string | null;
  readonly unresolved?: boolean;
  readonly family?: "business-object" | "executive-work" | string;
};

export type ExecutiveBriefLinkInput = {
  readonly objectId: string;
  readonly contextId: string;
  readonly relation?: string;
  readonly linkId?: string;
};

export type ExecutiveBriefRelationshipInput = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
};

export type ExecutiveDecisionBriefFacts = {
  readonly subject: ExecutiveBriefSubjectInput;
  readonly executiveState: string;
  readonly relatedProblems: readonly ExecutiveBriefSubjectInput[];
  readonly relatedRisks: readonly ExecutiveBriefSubjectInput[];
  readonly relatedScenarios: readonly ExecutiveBriefSubjectInput[];
  readonly relatedDecisions: readonly ExecutiveBriefSubjectInput[];
  readonly relatedExecutions: readonly ExecutiveBriefSubjectInput[];
  readonly relatedBusinessObjects: readonly ExecutiveBriefSubjectInput[];
  readonly relatedRelationshipIds: readonly string[];
  readonly meaningfulChanges: readonly {
    readonly objectId: string;
    readonly changeKind: string;
    readonly annotation: string;
    readonly importance: number;
  }[];
  readonly nbaRecommended: ExecutiveNextBestAction | null;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeToken(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().trim();
}

function labelOf(subject: ExecutiveBriefSubjectInput): string {
  return subject.label?.trim() || subject.subjectId;
}

function kindOf(subject: ExecutiveBriefSubjectInput): string {
  return normalizeToken(subject.objectKind);
}

function isCritical(subject: ExecutiveBriefSubjectInput): boolean {
  const attention = normalizeToken(subject.attention);
  const state = normalizeToken(subject.executiveState);
  return attention === "critical" || state === "critical";
}

function isUnresolved(subject: ExecutiveBriefSubjectInput): boolean {
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

function isDelayedOrBlocked(subject: ExecutiveBriefSubjectInput): boolean {
  const status = normalizeToken(subject.status);
  return status === "delayed" || status === "blocked" || status === "at-risk";
}

function executiveStateLabel(subject: ExecutiveBriefSubjectInput): string {
  if (isCritical(subject)) return "critical";
  const attention = normalizeToken(subject.attention);
  if (attention === "important" || attention === "elevated") return "attention";
  const status = normalizeToken(subject.status);
  if (status === "risk" || status === "unresolved") return "unresolved";
  if (status === "watch") return "watch";
  if (status === "delayed") return "delayed";
  if (status === "blocked") return "blocked";
  return "stable";
}

function byId(
  subjects: readonly ExecutiveBriefSubjectInput[],
): Map<string, ExecutiveBriefSubjectInput> {
  return new Map(subjects.map((subject) => [subject.subjectId, subject]));
}

function relatedContextIds(
  subjectId: string,
  links: readonly ExecutiveBriefLinkInput[],
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
  links: readonly ExecutiveBriefLinkInput[],
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

function relatedBusinessNeighbors(
  subjectId: string,
  relationships: readonly ExecutiveBriefRelationshipInput[],
  subjectsById: Map<string, ExecutiveBriefSubjectInput>,
): Readonly<{
  readonly neighbors: readonly ExecutiveBriefSubjectInput[];
  readonly relationshipIds: readonly string[];
}> {
  const neighbors: ExecutiveBriefSubjectInput[] = [];
  const relationshipIds: string[] = [];
  for (const relationship of relationships) {
    let otherId: string | null = null;
    if (relationship.sourceId === subjectId) otherId = relationship.targetId;
    else if (relationship.targetId === subjectId)
      otherId = relationship.sourceId;
    if (otherId == null) continue;
    const other = subjectsById.get(otherId);
    if (other == null) continue;
    if (normalizeToken(other.family) === "executive-work") continue;
    neighbors.push(other);
    relationshipIds.push(relationship.id);
  }
  neighbors.sort((a, b) => compareIds(a.subjectId, b.subjectId));
  relationshipIds.sort(compareIds);
  return Object.freeze({
    neighbors: Object.freeze(neighbors),
    relationshipIds: Object.freeze(relationshipIds),
  });
}

function filterByKind(
  ids: readonly string[],
  subjectsById: Map<string, ExecutiveBriefSubjectInput>,
  kind: string,
): readonly ExecutiveBriefSubjectInput[] {
  return Object.freeze(
    ids
      .map((id) => subjectsById.get(id))
      .filter((entry): entry is ExecutiveBriefSubjectInput => entry != null)
      .filter((entry) => kindOf(entry) === kind)
      .sort((a, b) => compareIds(a.subjectId, b.subjectId)),
  );
}

function hasDecisionPressure(facts: ExecutiveDecisionBriefFacts): boolean {
  const subject = facts.subject;
  const kind = kindOf(subject);
  if (
    kind === "problem" ||
    kind === "risk" ||
    kind === "scenario" ||
    kind === "decision"
  ) {
    return true;
  }
  if (kind === "execution") {
    return (
      isDelayedOrBlocked(subject) &&
      (facts.relatedDecisions.length > 0 || facts.relatedScenarios.length > 0)
    );
  }
  // Business object / goal-like: needs critical/unresolved + decision context.
  const pressureState = isCritical(subject) || isUnresolved(subject);
  const decisionContext =
    facts.relatedProblems.length > 0 ||
    facts.relatedScenarios.length > 0 ||
    facts.relatedDecisions.length > 0 ||
    facts.relatedRisks.some((risk) => isCritical(risk) || isUnresolved(risk));
  return pressureState && decisionContext;
}

// ─── Fact assembly ──────────────────────────────────────────────────────────

export function assembleExecutiveDecisionBriefFacts(input: {
  readonly subject: ExecutiveBriefSubjectInput;
  readonly subjects: readonly ExecutiveBriefSubjectInput[];
  readonly links?: readonly ExecutiveBriefLinkInput[];
  readonly relationships?: readonly ExecutiveBriefRelationshipInput[];
  readonly changeComparison?: ExecutiveChangeComparisonResult | null;
  readonly nextBestAction?: ExecutiveNextBestActionResult | null;
}): ExecutiveDecisionBriefFacts {
  const subjectsById = byId(input.subjects);
  const links = input.links ?? [];
  const subject = input.subject;
  const kind = kindOf(subject);

  let contextIds: readonly string[] = [];
  let businessIds: readonly string[] = [];

  if (normalizeToken(subject.family) === "executive-work" || kind !== "object") {
    contextIds = Object.freeze([subject.subjectId]);
    businessIds = relatedObjectIdsForContext(subject.subjectId, links);
    // Sibling scenarios share business anchors.
    const siblingContexts = new Set<string>([subject.subjectId]);
    for (const businessId of businessIds) {
      for (const contextId of relatedContextIds(businessId, links)) {
        siblingContexts.add(contextId);
      }
    }
    contextIds = Object.freeze([...siblingContexts].sort(compareIds));
  } else {
    contextIds = relatedContextIds(subject.subjectId, links);
    businessIds = Object.freeze([subject.subjectId]);
  }

  const allProblems = filterByKind(contextIds, subjectsById, "problem");
  // Expand scenario/decision/execution candidates via shared-problem business anchors.
  const expandedContextIds = new Set<string>(contextIds);
  for (const problem of allProblems) {
    for (const businessId of relatedObjectIdsForContext(problem.subjectId, links)) {
      for (const contextId of relatedContextIds(businessId, links)) {
        expandedContextIds.add(contextId);
      }
    }
  }
  const optionContextIds = Object.freeze([...expandedContextIds].sort(compareIds));

  const allScenarios = filterByKind(optionContextIds, subjectsById, "scenario");
  const allDecisions = filterByKind(optionContextIds, subjectsById, "decision");
  const allExecutions = filterByKind(optionContextIds, subjectsById, "execution");

  const relatedProblems = Object.freeze(
    kind === "problem"
      ? Object.freeze([subject])
      : allProblems.filter((entry) => entry.subjectId !== subject.subjectId),
  );
  const relatedScenarios = Object.freeze(
    kind === "scenario"
      ? allScenarios
      : allScenarios.filter((entry) => entry.subjectId !== subject.subjectId),
  );
  const relatedDecisions = Object.freeze(
    kind === "decision"
      ? Object.freeze([subject])
      : allDecisions.filter((entry) => entry.subjectId !== subject.subjectId),
  );
  const relatedExecutions = Object.freeze(
    kind === "execution"
      ? Object.freeze([subject])
      : allExecutions.filter((entry) => entry.subjectId !== subject.subjectId),
  );

  // Surface Risk business object when it shares a related problem, or is a graph neighbor.
  const relatedRisks = Object.freeze(
    input.subjects
      .filter((entry) => {
        if (entry.subjectId === subject.subjectId) return false;
        const isRisk =
          kindOf(entry) === "risk" ||
          entry.subjectId === "obj-risk" ||
          normalizeToken(entry.label) === "risk";
        if (!isRisk) return false;
        if (businessIds.includes(entry.subjectId)) return true;
        return relatedProblems.some((problem) =>
          relatedObjectIdsForContext(problem.subjectId, links).includes(
            entry.subjectId,
          ),
        );
      })
      .sort((a, b) => compareIds(a.subjectId, b.subjectId)),
  );

  const graph = relatedBusinessNeighbors(
    subject.subjectId,
    input.relationships ?? [],
    subjectsById,
  );
  const relatedBusinessObjects = Object.freeze(
    [
      ...new Map(
        [
          ...graph.neighbors,
          ...businessIds
            .map((id) => subjectsById.get(id))
            .filter(
              (entry): entry is ExecutiveBriefSubjectInput =>
                entry != null && entry.subjectId !== subject.subjectId,
            ),
        ].map((entry) => [entry.subjectId, entry] as const),
      ).values(),
    ].sort((a, b) => compareIds(a.subjectId, b.subjectId)),
  );

  const meaningfulChanges = Object.freeze(
    (input.changeComparison?.changes ?? [])
      .filter(
        (change) =>
          change.objectId === subject.subjectId ||
          contextIds.includes(change.objectId) ||
          businessIds.includes(change.objectId),
      )
      .map((change) =>
        Object.freeze({
          objectId: change.objectId,
          changeKind: change.changeKind,
          annotation: change.annotation,
          importance: change.importance,
        }),
      )
      .sort((a, b) => {
        if (b.importance !== a.importance) return b.importance - a.importance;
        return compareIds(a.objectId, b.objectId);
      }),
  );

  const nba =
    input.nextBestAction?.subjectObjectId === subject.subjectId
      ? (input.nextBestAction.recommendedAction ?? null)
      : null;

  return Object.freeze({
    subject,
    executiveState: executiveStateLabel(subject),
    relatedProblems,
    relatedRisks,
    relatedScenarios,
    relatedDecisions,
    relatedExecutions,
    relatedBusinessObjects,
    relatedRelationshipIds: graph.relationshipIds,
    meaningfulChanges,
    nbaRecommended: nba,
  });
}

function emptyUnavailable(input: {
  readonly subjectObjectId: string | null;
  readonly reason: ExecutiveBriefReasonCode;
  readonly eligible?: boolean;
}): ExecutiveDecisionBriefResult {
  return Object.freeze({
    subjectObjectId: input.subjectObjectId,
    eligible: input.eligible ?? false,
    available: false,
    brief: null,
    completeness: "unavailable",
    reasonCodes: Object.freeze([input.reason]),
    suppressedReason: input.reason,
  });
}

// ─── Eligibility ────────────────────────────────────────────────────────────

export function isExecutiveDecisionBriefEligible(input: {
  readonly presentationMode: "overview" | "object-focus" | "collection" | "preparation";
  readonly primaryStageSubjectId: string | null;
  readonly subjects: readonly ExecutiveBriefSubjectInput[];
  readonly links?: readonly ExecutiveBriefLinkInput[];
  readonly relationships?: readonly ExecutiveBriefRelationshipInput[];
  readonly changeComparison?: ExecutiveChangeComparisonResult | null;
  readonly nextBestAction?: ExecutiveNextBestActionResult | null;
}): Readonly<{
  readonly eligible: boolean;
  readonly reasonCode: ExecutiveBriefReasonCode;
}> {
  if (
    input.presentationMode !== "object-focus" ||
    input.primaryStageSubjectId == null
  ) {
    return Object.freeze({
      eligible: false,
      reasonCode: "mode-ineligible" as const,
    });
  }
  const subject = input.subjects.find(
    (entry) => entry.subjectId === input.primaryStageSubjectId,
  );
  if (subject == null) {
    return Object.freeze({
      eligible: false,
      reasonCode: "subject-missing" as const,
    });
  }
  const facts = assembleExecutiveDecisionBriefFacts({
    subject,
    subjects: input.subjects,
    links: input.links,
    relationships: input.relationships,
    changeComparison: input.changeComparison,
    nextBestAction: input.nextBestAction,
  });
  if (!hasDecisionPressure(facts)) {
    return Object.freeze({
      eligible: false,
      reasonCode: "no-decision-pressure" as const,
    });
  }
  return Object.freeze({
    eligible: true,
    reasonCode: "situation-from-state" as const,
  });
}

// ─── Section builders ───────────────────────────────────────────────────────

function buildSituation(facts: ExecutiveDecisionBriefFacts): ExecutiveBriefSection {
  const subject = facts.subject;
  const name = labelOf(subject);
  const kind = kindOf(subject);
  let text: string;
  if (kind === "problem") {
    text = `${name} remains an unresolved problem in ${facts.executiveState} state.`;
  } else if (kind === "risk" || subject.subjectId === "obj-risk") {
    text = `${name} is currently in a ${facts.executiveState} risk state.`;
  } else if (kind === "scenario") {
    text = `${name} is an available scenario under review (${facts.executiveState}).`;
  } else if (kind === "decision") {
    text = `Decision ${name} is currently in a ${facts.executiveState} state.`;
  } else if (kind === "execution") {
    text = `Execution ${name} is currently ${facts.executiveState}.`;
  } else {
    text = `${name} is currently in a ${facts.executiveState} operating state.`;
  }
  const change = facts.meaningfulChanges.find(
    (entry) => entry.objectId === subject.subjectId,
  );
  if (change != null && change.changeKind === "deteriorated") {
    text = `${text} Recent comparison shows deterioration.`;
  }
  return Object.freeze({
    label: "Situation",
    text,
    sourceObjectIds: Object.freeze([subject.subjectId]),
    sourceChangeIds: change != null ? Object.freeze([change.objectId]) : Object.freeze([]),
  });
}

function buildEvidence(
  facts: ExecutiveDecisionBriefFacts,
): readonly ExecutiveBriefEvidenceItem[] {
  const items: ExecutiveBriefEvidenceItem[] = [];
  const subject = facts.subject;

  items.push(
    Object.freeze({
      id: `ev-state-${subject.subjectId}`,
      text: `${labelOf(subject)} executive state is ${facts.executiveState}`,
      sourceObjectIds: Object.freeze([subject.subjectId]),
      sourceKind: "executive-state",
      importance: isCritical(subject) ? 900 : isUnresolved(subject) ? 700 : 400,
    }),
  );

  for (const problem of facts.relatedProblems) {
    if (problem.subjectId === subject.subjectId && kindOf(subject) === "problem") {
      continue;
    }
    items.push(
      Object.freeze({
        id: `ev-problem-${problem.subjectId}`,
        text: `Related problem ${labelOf(problem)} is ${executiveStateLabel(problem)}`,
        sourceObjectIds: Object.freeze([problem.subjectId, subject.subjectId]),
        sourceKind: "problem",
        importance: isCritical(problem) ? 850 : 750,
      }),
    );
  }

  for (const risk of facts.relatedRisks) {
    items.push(
      Object.freeze({
        id: `ev-risk-${risk.subjectId}`,
        text: `Related risk ${labelOf(risk)} is ${executiveStateLabel(risk)}`,
        sourceObjectIds: Object.freeze([risk.subjectId, subject.subjectId]),
        sourceKind: "risk",
        importance: isCritical(risk) ? 820 : 620,
      }),
    );
  }

  for (const decision of facts.relatedDecisions) {
    if (decision.subjectId === subject.subjectId) continue;
    items.push(
      Object.freeze({
        id: `ev-decision-${decision.subjectId}`,
        text: `Related decision ${labelOf(decision)} is ${executiveStateLabel(decision)}`,
        sourceObjectIds: Object.freeze([decision.subjectId, subject.subjectId]),
        sourceKind: "decision",
        importance: 640,
      }),
    );
  }

  for (const execution of facts.relatedExecutions) {
    if (execution.subjectId === subject.subjectId) continue;
    items.push(
      Object.freeze({
        id: `ev-execution-${execution.subjectId}`,
        text: `Related execution ${labelOf(execution)} is ${executiveStateLabel(execution)}`,
        sourceObjectIds: Object.freeze([execution.subjectId, subject.subjectId]),
        sourceKind: "execution",
        importance: isDelayedOrBlocked(execution) ? 780 : 520,
      }),
    );
  }

  for (const change of facts.meaningfulChanges) {
    items.push(
      Object.freeze({
        id: `ev-change-${change.objectId}-${change.changeKind}`,
        text:
          change.annotation.trim() ||
          `${change.objectId} ${change.changeKind} in recent comparison`,
        sourceObjectIds: Object.freeze([change.objectId]),
        sourceKind: "recent-change",
        importance: 800 + Math.min(change.importance, 100),
        sourceChangeIds: Object.freeze([change.objectId]),
      }),
    );
  }

  // Deduplicate by normalized text stem (same state claim).
  const deduped = new Map<string, ExecutiveBriefEvidenceItem>();
  for (const item of items) {
    const key = normalizeToken(item.text).replace(/\s+/g, " ");
    const existing = deduped.get(key);
    if (existing == null || item.importance > existing.importance) {
      deduped.set(key, item);
    }
  }

  return Object.freeze(
    [...deduped.values()]
      .sort((a, b) => {
        if (b.importance !== a.importance) return b.importance - a.importance;
        return compareIds(a.id, b.id);
      })
      .slice(0, EXECUTIVE_DECISION_BRIEF_LIMITS.maxEvidenceItems),
  );
}

function buildImpact(
  facts: ExecutiveDecisionBriefFacts,
): ExecutiveBriefSection | null {
  if (
    facts.relatedBusinessObjects.length === 0 &&
    facts.relatedRelationshipIds.length === 0
  ) {
    // Still allow impact via context-linked business objects for executive-work.
    if (facts.relatedBusinessObjects.length === 0) return null;
  }
  const neighbors = facts.relatedBusinessObjects;
  if (neighbors.length === 0) return null;
  const primary = neighbors[0]!;
  return Object.freeze({
    label: "Impact",
    text: `${labelOf(facts.subject)} is related to ${labelOf(primary)}.`,
    sourceObjectIds: Object.freeze([facts.subject.subjectId, primary.subjectId]),
    sourceRelationshipIds: facts.relatedRelationshipIds,
  });
}

function buildOptions(
  facts: ExecutiveDecisionBriefFacts,
): readonly ExecutiveBriefOption[] {
  const kind = kindOf(facts.subject);
  const scenarios =
    kind === "scenario"
      ? facts.relatedScenarios.filter(
          (entry) => entry.subjectId !== facts.subject.subjectId,
        )
      : facts.relatedScenarios;

  return Object.freeze(
    scenarios.map((scenario) =>
      Object.freeze({
        id: `opt-${scenario.subjectId}`,
        label: labelOf(scenario),
        objectId: scenario.subjectId,
        optionKind: "scenario" as const,
        status: scenario.status,
        sourceObjectIds: Object.freeze([scenario.subjectId]),
      }),
    ),
  );
}

function buildRecommendation(
  facts: ExecutiveDecisionBriefFacts,
): ExecutiveBriefRecommendation | null {
  const nba = facts.nbaRecommended;
  if (nba == null) return null;
  return Object.freeze({
    text: nba.label,
    actionId: nba.id,
    actionKind: nba.kind,
    targetObjectId: nba.targetObjectId ?? null,
    sourceGuidanceIds: Object.freeze([nba.id]),
    sourceObjectIds: Object.freeze(
      [facts.subject.subjectId, nba.targetObjectId].filter(
        (id): id is string => id != null,
      ),
    ),
  });
}

function buildDecisionRequired(
  facts: ExecutiveDecisionBriefFacts,
): ExecutiveBriefSection | null {
  const kind = kindOf(facts.subject);
  const scenarios = facts.relatedScenarios.filter(
    (entry) => entry.subjectId !== facts.subject.subjectId || kind !== "scenario",
  );
  const decisions = facts.relatedDecisions.filter(
    (entry) => entry.subjectId !== facts.subject.subjectId || kind === "decision",
  );

  if (kind === "decision") {
    return Object.freeze({
      label: "Decision Required",
      text: `Approve, reject, or revise ${labelOf(facts.subject)} through the existing decision workflow.`,
      sourceObjectIds: Object.freeze([facts.subject.subjectId]),
    });
  }

  if (scenarios.length >= 2) {
    return Object.freeze({
      label: "Decision Required",
      text: `Choose among the available scenario alternatives related to ${labelOf(facts.subject)}.`,
      sourceObjectIds: Object.freeze([
        facts.subject.subjectId,
        ...scenarios.map((entry) => entry.subjectId),
      ]),
    });
  }

  if (scenarios.length === 1 && decisions.length > 0) {
    const decision = decisions[0]!;
    return Object.freeze({
      label: "Decision Required",
      text: `Decide whether ${labelOf(decision)} should proceed, given ${labelOf(scenarios[0]!)}.`,
      sourceObjectIds: Object.freeze([
        facts.subject.subjectId,
        scenarios[0]!.subjectId,
        decision.subjectId,
      ]),
    });
  }

  if (decisions.length > 0 && kind !== "execution") {
    const decision = decisions[0]!;
    return Object.freeze({
      label: "Decision Required",
      text: `Decide whether ${labelOf(decision)} should proceed to approval.`,
      sourceObjectIds: Object.freeze([facts.subject.subjectId, decision.subjectId]),
    });
  }

  if (kind === "execution" && isDelayedOrBlocked(facts.subject) && decisions.length > 0) {
    return Object.freeze({
      label: "Decision Required",
      text: `Decide whether to revise the related decision given delayed execution ${labelOf(facts.subject)}.`,
      sourceObjectIds: Object.freeze([
        facts.subject.subjectId,
        decisions[0]!.subjectId,
      ]),
    });
  }

  return null;
}

function completenessOf(input: {
  readonly situation: ExecutiveBriefSection | null;
  readonly evidence: readonly ExecutiveBriefEvidenceItem[];
  readonly options: readonly ExecutiveBriefOption[];
  readonly decisionRequired: ExecutiveBriefSection | null;
}): "sufficient" | "partial" | "unavailable" {
  if (input.situation == null || input.evidence.length < 1) {
    return "unavailable";
  }
  if (input.options.length > 0 || input.decisionRequired != null) {
    return "sufficient";
  }
  return "partial";
}

// ─── Resolver ───────────────────────────────────────────────────────────────

export function resolveExecutiveDecisionBrief(input: {
  readonly presentationMode: "overview" | "object-focus" | "collection" | "preparation";
  readonly primaryStageSubjectId: string | null;
  readonly subjects: readonly ExecutiveBriefSubjectInput[];
  readonly links?: readonly ExecutiveBriefLinkInput[];
  readonly relationships?: readonly ExecutiveBriefRelationshipInput[];
  readonly changeComparison?: ExecutiveChangeComparisonResult | null;
  readonly nextBestAction?: ExecutiveNextBestActionResult | null;
}): ExecutiveDecisionBriefResult {
  const eligibility = isExecutiveDecisionBriefEligible(input);
  if (!eligibility.eligible) {
    return emptyUnavailable({
      subjectObjectId: input.primaryStageSubjectId,
      reason: eligibility.reasonCode,
      eligible: false,
    });
  }

  const subject = input.subjects.find(
    (entry) => entry.subjectId === input.primaryStageSubjectId,
  );
  if (subject == null) {
    return emptyUnavailable({
      subjectObjectId: input.primaryStageSubjectId,
      reason: "subject-missing",
    });
  }

  const facts = assembleExecutiveDecisionBriefFacts({
    subject,
    subjects: input.subjects,
    links: input.links,
    relationships: input.relationships,
    changeComparison: input.changeComparison,
    nextBestAction: input.nextBestAction,
  });

  const situation = buildSituation(facts);
  const evidence = buildEvidence(facts);
  const impact = buildImpact(facts);
  const options = buildOptions(facts);
  const recommendation = buildRecommendation(facts);
  const decisionRequired = buildDecisionRequired(facts);
  const completeness = completenessOf({
    situation,
    evidence,
    options,
    decisionRequired,
  });

  if (completeness === "unavailable") {
    return emptyUnavailable({
      subjectObjectId: subject.subjectId,
      reason: "insufficient-truth",
      eligible: true,
    });
  }

  const reasonCodes: ExecutiveBriefReasonCode[] = [
    "situation-from-state",
    completeness === "sufficient" ? "sufficient-brief" : "partial-brief",
  ];
  if (evidence.some((item) => item.sourceKind === "recent-change")) {
    reasonCodes.push("evidence-recent-change");
  }
  if (impact != null) reasonCodes.push("impact-canonical-relation");
  if (options.length > 0) reasonCodes.push("options-from-scenarios");
  if (recommendation != null) reasonCodes.push("recommendation-from-nba");
  if (decisionRequired != null) reasonCodes.push("decision-required-from-context");

  const brief: ExecutiveDecisionBrief = Object.freeze({
    subjectObjectId: subject.subjectId,
    situation,
    evidence,
    impact,
    options,
    recommendation,
    decisionRequired,
    completeness,
    reasonCodes: Object.freeze(reasonCodes),
    isSemanticObject: false,
  });

  return Object.freeze({
    subjectObjectId: subject.subjectId,
    eligible: true,
    available: true,
    brief,
    completeness,
    reasonCodes: brief.reasonCodes,
    suppressedReason: null,
  });
}

// ─── Observability / verify ─────────────────────────────────────────────────

export function buildExecutiveDecisionBriefObservability(
  result: ExecutiveDecisionBriefResult,
): Readonly<Record<string, string | number | boolean | null>> {
  const brief = result.brief;
  return Object.freeze({
    briefSubjectId: result.subjectObjectId,
    briefEligible: result.eligible,
    briefAvailable: result.available,
    briefCompleteness: result.completeness,
    briefSituationSourceIds:
      brief?.situation.sourceObjectIds.join("|") ?? "none",
    briefEvidenceCount: brief?.evidence.length ?? 0,
    briefEvidenceSourceIds:
      brief?.evidence
        .flatMap((item) => item.sourceObjectIds)
        .filter((id, index, all) => all.indexOf(id) === index)
        .join("|") ?? "none",
    briefImpactSourceIds: brief?.impact?.sourceObjectIds.join("|") ?? "none",
    briefOptionIds: brief?.options.map((option) => option.id).join("|") ?? "none",
    briefRecommendationActionId: brief?.recommendation?.actionId ?? "none",
    briefDecisionRequiredPresent: brief?.decisionRequired != null,
    briefReasonCodes: result.reasonCodes.join("|") || "none",
    briefSuppressedReason: result.suppressedReason,
    briefIsSemanticObject: false,
  });
}

export function verifyExecutiveStageDecisionBrief(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly safetyValid: boolean;
  readonly dri7Deferred: boolean;
}> {
  const identity = getExecutiveStageDecisionBriefIdentity();
  const identityValid =
    identity.id === "STAGE-PROD:4/ExecutiveStageDecisionBrief" &&
    identity.version === "1.0.0" &&
    identity.namespace ===
      "nexora.spatial-presentation.executive-stage-decision-brief";

  const boundaryValid =
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.briefIsSemanticObject === false &&
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.implementsDecisionBrief === true &&
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.recomputesNbaIndependently === false &&
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.dri7Integrated === false;

  const safetyValid =
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.autoApprovesDecisions === false &&
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.inventsOptions === false &&
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.inventsDoNothing === false &&
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.inventsCausalClaims === false;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    safetyValid;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    safetyValid,
    dri7Deferred: true,
  });
}
