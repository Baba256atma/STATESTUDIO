/**
 * NPA-T NPS:7 — Execution & Monitoring.
 *
 * Read-oriented path composition over NPS:6, ECA:9, ECA:10, and observed CC:11.
 * Does not write Execution, Decisions, Outcome, or Learning.
 */

import type { EcaExecutiveExecutionReadinessJudgment } from "@/app/lib/nexora-conversation/ecaExecutiveExecutionReadiness.ts";
import type { EcaLiveExecutionJudgment } from "@/app/lib/nexora-conversation/ecaLiveExecution.ts";
import {
  attemptNpsPathAdvancement,
  composeNpsProblemSolvingPath,
  type NpsCanonicalFacts,
  type NpsExecutionStatus,
  type NpsPathState,
  type NpsProblemSolvingPath,
  type NpsSupportingReference,
} from "./npsProblemSolvingPath.ts";
import type { NpsDecisionCommitment } from "./npsDecisionCommitment.ts";

export const NPS_EXECUTION_MONITORING_IDENTITY =
  "NPA-T NPS:7/ExecutionMonitoring" as const;

export const NPS_READINESS_STATUSES = Object.freeze([
  "NOT_READY",
  "ASSESSING",
  "READY_WITH_CONDITIONS",
  "READY",
  "BLOCKED",
  "ALREADY_EXECUTING",
] as const);
export type NpsReadinessStatus = (typeof NPS_READINESS_STATUSES)[number];

export const NPS_START_AUTHORIZATION_STATUSES = Object.freeze([
  "NOT_REQUESTED",
  "AWAITING_START_AUTHORIZATION",
  "AUTHORIZED",
  "AMBIGUOUS",
] as const);
export type NpsStartAuthorizationStatus = (typeof NPS_START_AUTHORIZATION_STATUSES)[number];

export const NPS_EXECUTION_HANDOFF_STATUSES = Object.freeze([
  "NOT_AUTHORIZED",
  "READY_FOR_CC11",
  "APPLIED",
  "REUSED",
  "FAILED",
] as const);
export type NpsExecutionHandoffStatus = (typeof NPS_EXECUTION_HANDOFF_STATUSES)[number];

export const NPS_MONITORING_STATUSES = Object.freeze([
  "NOT_STARTED",
  "ON_TRACK",
  "ATTENTION",
  "DEVIATING",
  "BLOCKED",
  "COMPLETED_PENDING_OUTCOME",
] as const);
export type NpsMonitoringStatus = (typeof NPS_MONITORING_STATUSES)[number];

export const NPS_EXECUTION_MONITORING_BOUNDARY = Object.freeze({
  identity: NPS_EXECUTION_MONITORING_IDENTITY,
  newAuthorityLayer: false as const,
  createsExecutionStore: false as const,
  createsMonitoringAuthority: false as const,
  readinessOwner: "ECA:9" as const,
  executionWriter: "CC:11" as const,
  monitoringOwner: "ECA:10" as const,
  outcomeOwner: "CORE-OUT / ECA:11" as const,
  autoStartsExecution: false as const,
  readinessEqualsStart: false as const,
  startEqualsStarted: false as const,
  completionEqualsOutcomeSuccess: false as const,
  inventsProgress: false as const,
  attentionEqualsIntervention: false as const,
  npsWritesExecution: false as const,
  npsWritesDecision: false as const,
  npsWritesOutcome: false as const,
  npsWritesLearning: false as const,
  pathAdvancementMutatesCanonicalState: false as const,
});

export type NpsCc11Observation = Readonly<{
  executionId: string | null;
  decisionId: string | null;
  title: string | null;
  status: string | null;
  progress: number | null;
  ownerIds: readonly string[];
  blockers: readonly { readonly label: string }[];
  risks: readonly { readonly label: string }[];
  milestones: readonly {
    readonly label: string;
    readonly planned?: string | null;
    readonly observed?: string | null;
    readonly completed?: boolean;
  }[];
  resultStatus: "none" | "created" | "reused" | "applied" | "failed" | "not-eligible" | "transition-not-allowed";
  managerStartIntent: boolean;
  ambiguousStartLanguage: boolean;
  doItLanguage: boolean;
}>;

export type NpsExecutionHandoff = Readonly<{
  owner: "CC:11";
  npsWritesExecution: false;
  problemId: string | null;
  decisionId: string | null;
  executionTarget: string | null;
  readinessStatus: NpsReadinessStatus;
  startAuthorization: NpsStartAuthorizationStatus;
  unresolvedConditions: readonly string[];
  blockers: readonly string[];
  risks: readonly string[];
  status: NpsExecutionHandoffStatus;
}>;

export type NpsOutcomeHandoff = Readonly<{
  problemId: string | null;
  decisionId: string | null;
  executionId: string | null;
  executionStatus: string | null;
  supportingReferences: readonly NpsSupportingReference[];
  readyForOutcomeReview: boolean;
}>;

export type NpsExecutionMonitoring = Readonly<{
  identity: typeof NPS_EXECUTION_MONITORING_IDENTITY;
  problemId: string | null;
  problemTitle: string | null;
  decisionId: string | null;
  decisionTitle: string | null;
  decisionStatus: "NONE" | "APPROVED";
  executionId: string | null;
  executionStatus: string | null;
  readinessStatus: NpsReadinessStatus;
  ownerReadiness: "KNOWN" | "UNKNOWN" | "NOT_APPLICABLE";
  resourceReadiness: "UNKNOWN";
  conditionReadiness: "READY" | "BLOCKED" | "UNKNOWN";
  dependencyReadiness: "UNKNOWN";
  blockers: readonly string[];
  risks: readonly string[];
  milestones: readonly NpsCc11Observation["milestones"][number][];
  progress: number | "UNKNOWN";
  deviations: readonly string[];
  attentionStatus: "NONE" | "ATTENTION";
  interventionStatus: "NONE" | "INTERVENTION_REVIEW";
  startAuthorizationStatus: NpsStartAuthorizationStatus;
  executionHandoffStatus: NpsExecutionHandoffStatus;
  nextStep: string | null;
  outcomeReadiness: "NOT_READY" | "READY_FOR_OUTCOME_REVIEW";
  outcomeHandoff: NpsOutcomeHandoff;
  executionHandoff: NpsExecutionHandoff;
  action: "CLARIFY_PROBLEM" | "CLARIFY_EXECUTION_TARGET" | "WAIT_FOR_DECISION" | "REVIEW_READINESS" | "AWAIT_START" | "HANDOFF_CC11" | "MONITOR" | "REVIEW_OUTCOME";
  supportingReferences: readonly NpsSupportingReference[];
  path: NpsProblemSolvingPath;
  managerProjection: Readonly<{ problem: string; text: string }>;
  canonicalMutations: readonly [];
  npsWritesExecution: false;
  writesDecision: false;
  writesOutcome: false;
  writesLearning: false;
  boundary: typeof NPS_EXECUTION_MONITORING_BOUNDARY;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function mapReadiness(eca: EcaExecutiveExecutionReadinessJudgment | null | undefined, blocked: boolean): NpsReadinessStatus {
  if (blocked) return "BLOCKED";
  const value = eca?.readiness;
  if (value === "READY") return "READY";
  if (value === "READY_WITH_CONDITIONS") return "READY_WITH_CONDITIONS";
  if (value === "BLOCKED") return "BLOCKED";
  if (value === "ALREADY_EXECUTING") return "ALREADY_EXECUTING";
  if (value === "NOT_READY") return "NOT_READY";
  return "ASSESSING";
}

function mapExecutionPathStatus(input: {
  approved: boolean;
  executionStatus: string | null;
  executionId: string | null;
  failed: boolean;
  progress: number | null;
}): NpsExecutionStatus {
  if (input.failed || !input.approved) return "NONE";
  const status = (input.executionStatus ?? "").toLowerCase();
  if (status === "completed") return "COMPLETED";
  if (status === "blocked" || status === "at-risk") return "MONITORING";
  if ((status === "in-progress" || status === "active") && input.progress != null) return "MONITORING";
  if (status === "in-progress" || status === "active") return "ACTIVE";
  if (input.executionId) return "READY";
  return "READY";
}

function managerText(input: {
  ownership: NpsProblemSolvingPath["problemOwnership"];
  problem: string;
  decision: string | null;
  readiness: NpsReadinessStatus;
  blocker: string | null;
  owner: string | null;
  risk: string | null;
  progress: number | "UNKNOWN";
  monitoring: NpsMonitoringStatus;
  executionTitle: string | null;
  next: string | null;
  started: boolean;
}): string {
  if (input.ownership !== "DETERMINED") {
    return "The active Problem is not determined. Clarify which Problem this Execution would belong to before starting.";
  }
  if (!input.started && (input.readiness === "BLOCKED" || input.readiness === "NOT_READY")) {
    return [
      input.decision ? `Decision: ${input.decision}` : null,
      `Problem: ${input.problem}`,
      "Execution readiness: Not ready yet.",
      input.blocker ? `Blocker: ${input.blocker}` : null,
      input.owner ? `Owner: ${input.owner}` : null,
      input.next ? `Next step: ${input.next}` : null,
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");
  }
  if (!input.started) {
    return [
      input.decision ? `Decision: ${input.decision}` : null,
      `Problem: ${input.problem}`,
      "Execution readiness: Ready.",
      input.owner ? `Owner: ${input.owner}` : null,
      input.risk ? `Known risks: ${input.risk}` : null,
      "Next step: Execution can be started when you authorize it.",
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");
  }
  const progressText = input.progress === "UNKNOWN" ? "Unknown" : `${input.progress}%`;
  return [
    `Execution: ${input.executionTitle ?? input.decision ?? "Current work"}`,
    `Progress: ${progressText}`,
    `Status: ${input.monitoring === "ATTENTION" || input.monitoring === "DEVIATING" ? "Needs attention." : input.monitoring === "COMPLETED_PENDING_OUTCOME" ? "Completed." : "In progress."}`,
    input.blocker ? `Current issue: ${input.blocker}` : null,
    input.risk ? `Risk: ${input.risk}` : null,
    input.next ? `Next step: ${input.next}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

export function composeNpsExecutionMonitoring(input: {
  readonly pathFacts: NpsCanonicalFacts;
  readonly commitment?: NpsDecisionCommitment | null;
  readonly ecaReadiness?: EcaExecutiveExecutionReadinessJudgment | null;
  readonly ecaLive?: EcaLiveExecutionJudgment | null;
  readonly cc11?: Partial<NpsCc11Observation>;
}): NpsExecutionMonitoring {
  const cc11: NpsCc11Observation = freeze({
    executionId: input.cc11?.executionId ?? null,
    decisionId: input.cc11?.decisionId ?? null,
    title: input.cc11?.title ?? null,
    status: input.cc11?.status ?? null,
    progress: input.cc11?.progress ?? null,
    ownerIds: freeze(input.cc11?.ownerIds ?? []),
    blockers: freeze(input.cc11?.blockers ?? []),
    risks: freeze(input.cc11?.risks ?? []),
    milestones: freeze(input.cc11?.milestones ?? []),
    resultStatus: input.cc11?.resultStatus ?? "none",
    managerStartIntent: input.cc11?.managerStartIntent === true,
    ambiguousStartLanguage: input.cc11?.ambiguousStartLanguage === true,
    doItLanguage: input.cc11?.doItLanguage === true,
  });

  const ownershipPath = composeNpsProblemSolvingPath(input.pathFacts);
  const conditions = freeze(input.commitment?.unresolvedConditions ?? []);
  const conditionBlocked = conditions.length > 0;
  const ecaBlockers = input.ecaReadiness?.blockerState === "KNOWN";
  const canonicalBlockers = freeze([
    ...cc11.blockers.map((item) => item.label),
    ...(conditionBlocked ? conditions : []),
  ]);
  const canonicalRisks = freeze(cc11.risks.map((item) => item.label));
  const approvedId =
    input.commitment?.approvedDecisionId ?? input.pathFacts.approvedDecisionId ?? cc11.decisionId;
  const failed = cc11.resultStatus === "failed" || cc11.resultStatus === "not-eligible" || cc11.resultStatus === "transition-not-allowed";
  const reused = cc11.resultStatus === "reused";
  const applied = cc11.resultStatus === "applied" || cc11.resultStatus === "created";
  const liveId = failed ? null : cc11.executionId;
  const liveStatus = failed ? null : cc11.status;

  if (ownershipPath.problemOwnership !== "DETERMINED") {
    return freeze({
      identity: NPS_EXECUTION_MONITORING_IDENTITY,
      problemId: input.pathFacts.problem.problemId,
      problemTitle: input.pathFacts.problem.problemLabel,
      decisionId: approvedId,
      decisionTitle: input.commitment?.committedOption ?? null,
      decisionStatus: approvedId ? "APPROVED" : "NONE",
      executionId: null,
      executionStatus: null,
      readinessStatus: "NOT_READY",
      ownerReadiness: "NOT_APPLICABLE",
      resourceReadiness: "UNKNOWN",
      conditionReadiness: "UNKNOWN",
      dependencyReadiness: "UNKNOWN",
      blockers: freeze([]),
      risks: freeze([]),
      milestones: freeze([]),
      progress: "UNKNOWN",
      deviations: freeze([]),
      attentionStatus: "NONE",
      interventionStatus: "NONE",
      startAuthorizationStatus: "NOT_REQUESTED",
      executionHandoffStatus: "NOT_AUTHORIZED",
      nextStep: "Determine the active Problem",
      outcomeReadiness: "NOT_READY",
      outcomeHandoff: freeze({
        problemId: null,
        decisionId: null,
        executionId: null,
        executionStatus: null,
        supportingReferences: freeze([]),
        readyForOutcomeReview: false,
      }),
      executionHandoff: freeze({
        owner: "CC:11",
        npsWritesExecution: false,
        problemId: null,
        decisionId: null,
        executionTarget: null,
        readinessStatus: "NOT_READY",
        startAuthorization: "NOT_REQUESTED",
        unresolvedConditions: freeze([]),
        blockers: freeze([]),
        risks: freeze([]),
        status: "NOT_AUTHORIZED",
      }),
      action: "CLARIFY_PROBLEM",
      supportingReferences: ownershipPath.supportingReferences,
      path: ownershipPath,
      managerProjection: freeze({
        problem: "Not determined",
        text: managerText({
          ownership: ownershipPath.problemOwnership,
          problem: "This Problem",
          decision: null,
          readiness: "NOT_READY",
          blocker: null,
          owner: null,
          risk: null,
          progress: "UNKNOWN",
          monitoring: "NOT_STARTED",
          executionTitle: null,
          next: "Determine the active Problem",
          started: false,
        }),
      }),
      canonicalMutations: freeze([]),
      npsWritesExecution: false,
      writesDecision: false,
      writesOutcome: false,
      writesLearning: false,
      boundary: NPS_EXECUTION_MONITORING_BOUNDARY,
    });
  }

  if (!approvedId) {
    const path = composeNpsProblemSolvingPath(input.pathFacts);
    return freeze({
      identity: NPS_EXECUTION_MONITORING_IDENTITY,
      problemId: path.problemId,
      problemTitle: path.problemLabel,
      decisionId: null,
      decisionTitle: null,
      decisionStatus: "NONE",
      executionId: null,
      executionStatus: null,
      readinessStatus: "NOT_READY",
      ownerReadiness: "NOT_APPLICABLE",
      resourceReadiness: "UNKNOWN",
      conditionReadiness: "UNKNOWN",
      dependencyReadiness: "UNKNOWN",
      blockers: freeze([]),
      risks: freeze([]),
      milestones: freeze([]),
      progress: "UNKNOWN",
      deviations: freeze([]),
      attentionStatus: "NONE",
      interventionStatus: "NONE",
      startAuthorizationStatus: "NOT_REQUESTED",
      executionHandoffStatus: "NOT_AUTHORIZED",
      nextStep: "Approve a Decision before checking execution readiness.",
      outcomeReadiness: "NOT_READY",
      outcomeHandoff: freeze({
        problemId: path.problemId,
        decisionId: null,
        executionId: null,
        executionStatus: null,
        supportingReferences: path.supportingReferences,
        readyForOutcomeReview: false,
      }),
      executionHandoff: freeze({
        owner: "CC:11",
        npsWritesExecution: false,
        problemId: path.problemId,
        decisionId: null,
        executionTarget: null,
        readinessStatus: "NOT_READY",
        startAuthorization: "NOT_REQUESTED",
        unresolvedConditions: freeze([]),
        blockers: freeze([]),
        risks: freeze([]),
        status: "NOT_AUTHORIZED",
      }),
      action: "WAIT_FOR_DECISION",
      supportingReferences: path.supportingReferences,
      path,
      managerProjection: freeze({
        problem: path.problemLabel ?? "This Problem",
        text: managerText({
          ownership: path.problemOwnership,
          problem: path.problemLabel ?? "This Problem",
          decision: null,
          readiness: "NOT_READY",
          blocker: null,
          owner: null,
          risk: null,
          progress: "UNKNOWN",
          monitoring: "NOT_STARTED",
          executionTitle: null,
          next: "Approve a Decision before checking execution readiness.",
          started: false,
        }),
      }),
      canonicalMutations: freeze([]),
      npsWritesExecution: false,
      writesDecision: false,
      writesOutcome: false,
      writesLearning: false,
      boundary: NPS_EXECUTION_MONITORING_BOUNDARY,
    });
  }

  const blocked = conditionBlocked || ecaBlockers || canonicalBlockers.length > 0 && !liveId;
  const readiness = liveId && /^(?:in-progress|at-risk|completed|blocked)$/i.test(liveStatus ?? "")
    ? "ALREADY_EXECUTING"
    : mapReadiness(input.ecaReadiness, blocked);
  const readyToStart = readiness === "READY" || readiness === "READY_WITH_CONDITIONS";
  let startAuth: NpsStartAuthorizationStatus = "NOT_REQUESTED";
  let handoff: NpsExecutionHandoffStatus = "NOT_AUTHORIZED";
  let action: NpsExecutionMonitoring["action"] = "REVIEW_READINESS";
  let next = "Confirm remaining conditions before starting execution.";

  if (failed) {
    handoff = "FAILED";
    startAuth = cc11.managerStartIntent ? "AUTHORIZED" : "NOT_REQUESTED";
    action = "REVIEW_READINESS";
    next = "Execution was not started. Review readiness again.";
  } else if (liveId && reused && cc11.managerStartIntent) {
    handoff = "REUSED";
    startAuth = "AUTHORIZED";
    action = "MONITOR";
    next = "Review the existing Execution rather than starting another.";
  } else if (liveId && (applied || liveStatus)) {
    handoff = applied ? "APPLIED" : liveId ? "REUSED" : "NOT_AUTHORIZED";
    startAuth = "AUTHORIZED";
    action = /completed/i.test(liveStatus ?? "") ? "REVIEW_OUTCOME" : "MONITOR";
    next = /completed/i.test(liveStatus ?? "")
      ? "Review the Outcome. Completion is not the same as success."
      : "Monitor progress from the recorded Execution.";
  } else if (blocked) {
    startAuth = cc11.managerStartIntent ? "NOT_REQUESTED" : "NOT_REQUESTED";
    handoff = "NOT_AUTHORIZED";
    action = "REVIEW_READINESS";
    next = `Confirm ${canonicalBlockers[0] ?? conditions[0] ?? "the unresolved condition"} before starting execution.`;
  } else if (cc11.ambiguousStartLanguage) {
    startAuth = "AMBIGUOUS";
    handoff = "NOT_AUTHORIZED";
    action = "AWAIT_START";
    next = "Say explicitly if you want to start execution.";
  } else if ((cc11.managerStartIntent || cc11.doItLanguage) && readyToStart && !blocked) {
    startAuth = "AUTHORIZED";
    handoff = "READY_FOR_CC11";
    action = "HANDOFF_CC11";
    next = "Record the start through Execution.";
  } else if (readyToStart) {
    startAuth = "AWAITING_START_AUTHORIZATION";
    action = "AWAIT_START";
    next = "Execution can be started when you authorize it.";
  }

  const progress: number | "UNKNOWN" = cc11.progress == null ? "UNKNOWN" : cc11.progress;
  const completed = /completed/i.test(liveStatus ?? "");
  const monitoring: NpsMonitoringStatus = !liveId
    ? "NOT_STARTED"
    : completed
      ? "COMPLETED_PENDING_OUTCOME"
      : canonicalBlockers.length > 0 && liveId
        ? "BLOCKED"
        : input.ecaLive?.trackStatus === "OFF_TRACK" || input.ecaLive?.deviation === "UNFAVORABLE_DEVIATION"
          ? "DEVIATING"
          : input.ecaLive?.primaryAttentionItem
            ? "ATTENTION"
            : "ON_TRACK";
  const attention = monitoring === "DEVIATING" || monitoring === "ATTENTION" || monitoring === "BLOCKED" ? "ATTENTION" : "NONE";
  const intervention: NpsExecutionMonitoring["interventionStatus"] =
    monitoring === "DEVIATING" || monitoring === "BLOCKED" ? "INTERVENTION_REVIEW" : "NONE";
  const deviations = freeze(
    [
      input.ecaLive?.primaryAttentionItem,
      monitoring === "DEVIATING" ? "Observed execution is behind the available baseline." : null,
    ].filter((item): item is string => Boolean(item)),
  );

  const pathStatus = mapExecutionPathStatus({
    approved: true,
    executionStatus: liveStatus,
    executionId: liveId,
    failed,
    progress: cc11.progress,
  });
  const path = composeNpsProblemSolvingPath(
    freeze({
      ...input.pathFacts,
      awaitingCommitment: false,
      approvedDecisionId: approvedId,
      execution: freeze({
        present: Boolean(liveId),
        executionId: liveId,
        status: failed ? "READY" : pathStatus === "NONE" ? "READY" : pathStatus,
        observedFrom: "CC:11 Execution",
      }),
      outcome: freeze({
        observed: false,
        problemResolved: null,
      }),
    }),
  );

  const ownerLabel = cc11.ownerIds[0] ?? null;
  const projectionText = managerText({
    ownership: path.problemOwnership,
    problem: path.problemLabel ?? "This Problem",
    decision: input.commitment?.committedOption ?? cc11.title ?? "External Capacity",
    readiness,
    blocker: canonicalBlockers[0] ?? null,
    owner: ownerLabel,
    risk: canonicalRisks[0] ?? null,
    progress,
    monitoring,
    executionTitle: cc11.title,
    next,
    started: Boolean(liveId) && !failed,
  });
  if (/\b(?:NPS|ECA|CC:\d|NCA|CORE-OUT|DTH|resolver|composer|authority)\b/i.test(projectionText)) {
    throw new Error("NPS:7 manager projection leaked architecture terminology");
  }

  return freeze({
    identity: NPS_EXECUTION_MONITORING_IDENTITY,
    problemId: path.problemId,
    problemTitle: path.problemLabel,
    decisionId: approvedId,
    decisionTitle: input.commitment?.committedOption ?? cc11.title,
    decisionStatus: "APPROVED",
    executionId: liveId,
    executionStatus: liveStatus,
    readinessStatus: readiness,
    ownerReadiness: ownerLabel ? "KNOWN" : input.ecaReadiness?.ownerState === "UNKNOWN" ? "UNKNOWN" : "NOT_APPLICABLE",
    resourceReadiness: "UNKNOWN",
    conditionReadiness: conditionBlocked || blocked ? "BLOCKED" : "READY",
    dependencyReadiness: "UNKNOWN",
    blockers: freeze(canonicalBlockers),
    risks: freeze(canonicalRisks),
    milestones: cc11.milestones,
    progress,
    deviations,
    attentionStatus: attention,
    interventionStatus: intervention,
    startAuthorizationStatus: startAuth,
    executionHandoffStatus: handoff,
    nextStep: next,
    outcomeReadiness: completed ? "READY_FOR_OUTCOME_REVIEW" : "NOT_READY",
    outcomeHandoff: freeze({
      problemId: path.problemId,
      decisionId: approvedId,
      executionId: liveId,
      executionStatus: liveStatus,
      supportingReferences: path.supportingReferences,
      readyForOutcomeReview: completed,
    }),
    executionHandoff: freeze({
      owner: "CC:11",
      npsWritesExecution: false,
      problemId: path.problemId,
      decisionId: approvedId,
      executionTarget: cc11.title ?? input.commitment?.committedOption ?? null,
      readinessStatus: readiness,
      startAuthorization: startAuth,
      unresolvedConditions: conditions,
      blockers: freeze(canonicalBlockers),
      risks: freeze(canonicalRisks),
      status: handoff,
    }),
    action,
    supportingReferences: path.supportingReferences,
    path,
    managerProjection: freeze({
      problem: path.problemLabel ?? "This Problem",
      text: projectionText,
    }),
    canonicalMutations: freeze([]),
    npsWritesExecution: false,
    writesDecision: false,
    writesOutcome: false,
    writesLearning: false,
    boundary: NPS_EXECUTION_MONITORING_BOUNDARY,
  });
}

export function npsPathStateAfterExecution(execution: NpsExecutionMonitoring): NpsPathState | null {
  return execution.path.currentState;
}

export function attemptNpsExecutionMonitoringAdvancement(
  execution: NpsExecutionMonitoring,
): ReturnType<typeof attemptNpsPathAdvancement> &
  Readonly<{ npsDecisionWrites: 0; executionWrites: 0; outcomeWrites: 0; learningWrites: 0 }> {
  const advanced = attemptNpsPathAdvancement(execution.path);
  return freeze({
    ...advanced,
    npsDecisionWrites: 0,
    executionWrites: 0,
    outcomeWrites: 0,
    learningWrites: 0,
  });
}
