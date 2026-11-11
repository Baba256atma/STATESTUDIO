/**
 * NPA-T NEXOCAUSE-SCENARIO-HANDOFF:1
 *
 * Orchestrates one manager handoff from an accepted hypothesis into the
 * existing Decision Domain. It does not own investigations, evidence,
 * scenarios, or decisions. A Scenario remains a proposal, not causal proof.
 */

import { NEXORA_EXECUTIVE_DECK_ID } from "../deck/nexoraDeckIdentityContract.ts";
import { listWorkspaceDecks } from "../deck/nexoraDeckRegistry.ts";
import { workspaceMutationsBlocked } from "../workspace/workspaceDeletionGuard.ts";
import { isProtectedDemoWorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { getWorkspaceById } from "../workspace/workspaceRegistryStore.ts";
import {
  getCausalHypothesis,
  getCausalInvestigation,
} from "./canonicalCausalInvestigationDomain.ts";
import {
  commitDecisionScenarioHandoff,
  getDecisionScenario,
  listDecisionGoals,
  listExecutionPlans,
  listManagerDecisions,
  type CausalScenarioOrigin,
  type DecisionScenario,
} from "./canonicalDecisionDomain.ts";
import {
  assessCausalHypothesisReadiness,
  latestEvidenceAuthorization,
  type CausalHypothesisReadinessAssessment,
} from "./causalHypothesisReview.ts";

export const causalScenarioHandoffIdentity =
  "NPA-T NEXOCAUSE-SCENARIO-HANDOFF:1/CausalScenarioHandoff" as const;

export type CausalScenarioHandoffFailure =
  | "protected-workspace"
  | "invalid-workspace"
  | "deletion-in-progress"
  | "invalid-deck"
  | "wrong-deck"
  | "missing"
  | "ineligible-status"
  | "missing-review"
  | "blocked-evidence"
  | "stale-handoff"
  | "reassessment-required"
  | "acknowledgment-required"
  | "limitations-required"
  | "invalid-goal"
  | "archived-goal"
  | "deleted-goal"
  | "invalid-name"
  | "operation-conflict"
  | "claim-unrecorded"
  | "storage-failed"
  | "revision-conflict"
  | "corrupt"
  | "unauthorized";

export type CausalScenarioHandoffProposal = Readonly<{
  identity: typeof causalScenarioHandoffIdentity;
  workspaceId: string;
  deckId: string;
  investigationId: string;
  hypothesisId: string;
  reviewId: string;
  problemStatement: string;
  hypothesisStatement: string;
  hypothesisStatus: "ACCEPTED_FOR_SCENARIO";
  evidence: CausalHypothesisReadinessAssessment;
  evidenceFingerprint: string;
  supportingObservationIds: readonly string[];
  conflictingObservationIds: readonly string[];
  assumptions: readonly string[];
  limitations: readonly string[];
  causalProof: false;
  approvalMeaning: "A Scenario is a proposal to evaluate. It does not establish causation, approve a Decision, or create an Execution Plan.";
}>;

export type CausalScenarioHandoffReceipt = Readonly<{
  scenario: DecisionScenario;
  replayed: boolean;
  evidenceSupportedCausal: false;
  decisionCount: number;
  planCount: number;
}>;

export type CausalScenarioHandoffResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; reason: CausalScenarioHandoffFailure }>;

function fail<T>(reason: CausalScenarioHandoffFailure): CausalScenarioHandoffResult<T> {
  return Object.freeze({ ok: false, reason });
}

function context(workspaceId: string, deckId: string): CausalScenarioHandoffFailure | null {
  if (isProtectedDemoWorkspaceId(workspaceId)) return "protected-workspace";
  if (workspaceMutationsBlocked(workspaceId)) return "deletion-in-progress";
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) return "invalid-workspace";
  if (workspace.status !== "active") return "invalid-workspace";
  if (deckId.length === 0 || deckId === NEXORA_EXECUTIVE_DECK_ID) return "invalid-deck";
  const deck = listWorkspaceDecks(workspaceId).find((entry) => entry.deckId === deckId);
  if (!deck || deck.status !== "ACTIVE") return "invalid-deck";
  return null;
}

function proposalFor(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly investigationId: string;
  readonly hypothesisId: string;
}): CausalScenarioHandoffResult<CausalScenarioHandoffProposal> {
  const workspaceId = input.workspaceId.trim();
  const deckId = input.deckId.trim();
  const rejected = context(workspaceId, deckId);
  if (rejected) return fail(rejected);
  const investigation = getCausalInvestigation(workspaceId, input.investigationId);
  if (!investigation || investigation.lifecycleStatus === "DELETED" || investigation.lifecycleStatus === "ARCHIVED") return fail("missing");
  if (investigation.deckId !== deckId) return fail("wrong-deck");
  const hypothesis = getCausalHypothesis(workspaceId, input.hypothesisId);
  if (!hypothesis || hypothesis.investigationId !== investigation.investigationId) return fail("missing");
  if (hypothesis.deckId !== deckId) return fail("wrong-deck");
  if (hypothesis.status === "ARCHIVED") return fail("ineligible-status");
  if (hypothesis.status !== "ACCEPTED_FOR_SCENARIO") return fail("ineligible-status");
  const review = latestEvidenceAuthorization(workspaceId, hypothesis.hypothesisId);
  if (!review) return fail("missing-review");
  const readiness = assessCausalHypothesisReadiness({
    workspaceId,
    deckId,
    investigationId: investigation.investigationId,
    hypothesisId: hypothesis.hypothesisId,
  });
  if (!readiness.ok) {
    return fail(readiness.reason === "protected-workspace" || readiness.reason === "corrupt" || readiness.reason === "unauthorized" || readiness.reason === "wrong-deck" || readiness.reason === "missing"
      ? readiness.reason
      : "blocked-evidence");
  }
  if (readiness.value.classification === "BLOCKED") return fail("blocked-evidence");
  if (review.evidenceFingerprint !== readiness.value.evidenceFingerprint) return fail("reassessment-required");
  if (review.hypothesisStatement == null) return fail("claim-unrecorded");
  if (review.hypothesisStatement.trim().replace(/\s+/g, " ") !== hypothesis.statement.trim().replace(/\s+/g, " ")) {
    return fail("reassessment-required");
  }
  const supportingObservationIds = readiness.value.items
    .filter((item) => item.managerRole === "SUPPORTING")
    .map((item) => item.observationId);
  const conflictingObservationIds = readiness.value.items
    .filter((item) => item.availability === "CONFLICTING" || item.managerRole === "CONFLICTING")
    .map((item) => item.observationId);
  return {
    ok: true,
    value: Object.freeze({
      identity: causalScenarioHandoffIdentity,
      workspaceId,
      deckId,
      investigationId: investigation.investigationId,
      hypothesisId: hypothesis.hypothesisId,
      reviewId: review.reviewId,
      problemStatement: investigation.problemStatement,
      hypothesisStatement: hypothesis.statement,
      hypothesisStatus: "ACCEPTED_FOR_SCENARIO" as const,
      evidence: readiness.value,
      evidenceFingerprint: readiness.value.evidenceFingerprint,
      supportingObservationIds: Object.freeze(supportingObservationIds),
      conflictingObservationIds: Object.freeze(conflictingObservationIds),
      assumptions: hypothesis.assumptions,
      limitations: hypothesis.limitations,
      causalProof: false as const,
      approvalMeaning: "A Scenario is a proposal to evaluate. It does not establish causation, approve a Decision, or create an Execution Plan." as const,
    }),
  };
}

export function prepareCausalScenarioHandoff(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly investigationId: string;
  readonly hypothesisId: string;
}): CausalScenarioHandoffResult<CausalScenarioHandoffProposal> {
  return proposalFor(input);
}

export function commitCausalScenarioHandoff(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly investigationId: string;
  readonly hypothesisId: string;
  readonly targetGoalId: string;
  readonly scenarioName: string;
  readonly intervention: string;
  readonly assumptions: readonly string[];
  readonly limitations: readonly string[];
  readonly operationId: string;
  readonly evidenceFingerprint: string;
  readonly acknowledgeLimitations: boolean;
  readonly now?: string;
}): CausalScenarioHandoffResult<CausalScenarioHandoffReceipt> {
  if (input.acknowledgeLimitations !== true) return fail("acknowledgment-required");
  const limitations = input.limitations.map((entry) => entry.trim()).filter((entry) => entry.length > 0);
  if (limitations.length === 0) return fail("limitations-required");
  const prepared = proposalFor(input);
  if (!prepared.ok) return prepared;
  if (prepared.value.evidenceFingerprint !== input.evidenceFingerprint) return fail("stale-handoff");
  const goal = listDecisionGoals(input.workspaceId.trim(), input.deckId.trim()).find((entry) => entry.goalId === input.targetGoalId);
  if (!goal) return fail("invalid-goal");
  if (goal.lifecycleStatus === "DELETED") return fail("deleted-goal");
  if (goal.lifecycleStatus === "ARCHIVED") return fail("archived-goal");
  if (goal.lifecycleStatus !== "ACTIVE" || goal.deckId !== prepared.value.deckId) return fail("invalid-goal");
  const origin: CausalScenarioOrigin = Object.freeze({
    identity: "NPA-T NEXOCAUSE-SCENARIO-HANDOFF:1/CausalScenarioOrigin",
    version: 1,
    originType: "NEXOCAUSE",
    investigationId: prepared.value.investigationId,
    hypothesisId: prepared.value.hypothesisId,
    reviewId: prepared.value.reviewId,
    workspaceId: prepared.value.workspaceId,
    deckId: prepared.value.deckId,
    evidenceFingerprint: prepared.value.evidenceFingerprint,
    observationIds: Object.freeze([...prepared.value.evidence.items.map((item) => item.observationId)]),
    assumptions: Object.freeze(input.assumptions.map((entry) => entry.trim()).filter((entry) => entry.length > 0)),
    limitations: Object.freeze(limitations),
    handedOffAt: input.now ?? new Date().toISOString(),
    operationId: input.operationId.trim(),
    causalProof: false,
  });
  const handoffInput = {
    workspaceId: prepared.value.workspaceId,
    deckId: prepared.value.deckId,
    goalId: goal.goalId,
    name: input.scenarioName,
    description: input.intervention,
    origin,
    operationId: input.operationId,
    now: input.now,
  };
  let committed = commitDecisionScenarioHandoff(handoffInput);
  if (!committed.ok && committed.reason === "revision-conflict") {
    committed = commitDecisionScenarioHandoff(handoffInput);
  }
  if (!committed.ok) {
    if (committed.reason === "duplicate") return fail("operation-conflict");
    if (committed.reason === "storage-failed" || committed.reason === "storage-unavailable") return fail("storage-failed");
    if (committed.reason === "revision-conflict") return fail("revision-conflict");
    if (committed.reason === "invalid-name") return fail("invalid-name");
    if (committed.reason === "wrong-deck") return fail("wrong-deck");
    if (committed.reason === "protected-workspace") return fail("protected-workspace");
    if (committed.reason === "corrupt") return fail("corrupt");
    return fail("invalid-goal");
  }
  const workspaceId = prepared.value.workspaceId;
  const deckId = prepared.value.deckId;
  return {
    ok: true,
    value: Object.freeze({
      scenario: committed.value.scenario,
      replayed: committed.value.replayed,
      evidenceSupportedCausal: false,
      decisionCount: listManagerDecisions(workspaceId, deckId).length,
      planCount: listExecutionPlans(workspaceId, deckId).length,
    }),
  };
}

export type ScenarioEvidenceCurrency = Readonly<{
  scenarioId: string;
  historicalFingerprint: string | null;
  currentFingerprint: string | null;
  changedSinceHandoff: boolean;
  referenceStatus: "CURRENT" | "UNAVAILABLE" | "ARCHIVED" | "DELETED" | "NO_PROVENANCE";
  currentAvailability: readonly string[];
  limitations: readonly string[];
  causalProof: false;
}>;

/** Current resolver reading for a Scenario. Does not rewrite historical provenance. */
export function assessScenarioEvidenceCurrency(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly scenarioId: string;
}): ScenarioEvidenceCurrency {
  const scenario = getDecisionScenario(input.workspaceId, input.scenarioId);
  const origin = scenario?.causalOrigin;
  if (!scenario || scenario.deckId !== input.deckId || !origin) {
    return Object.freeze({
      scenarioId: input.scenarioId,
      historicalFingerprint: origin?.evidenceFingerprint ?? null,
      currentFingerprint: null,
      changedSinceHandoff: false,
      referenceStatus: "NO_PROVENANCE",
      currentAvailability: Object.freeze([]),
      limitations: Object.freeze(["This Scenario has no NexoCause provenance to compare."]),
      causalProof: false as const,
    });
  }
  const investigation = getCausalInvestigation(input.workspaceId, origin.investigationId);
  if (!investigation || investigation.deckId !== origin.deckId) {
    return Object.freeze({
      scenarioId: scenario.scenarioId,
      historicalFingerprint: origin.evidenceFingerprint,
      currentFingerprint: null,
      changedSinceHandoff: false,
      referenceStatus: "UNAVAILABLE",
      currentAvailability: Object.freeze(["UNAVAILABLE"]),
      limitations: Object.freeze(["The original investigation is unavailable. This does not change the handoff record."]),
      causalProof: false as const,
    });
  }
  if (investigation.lifecycleStatus === "ARCHIVED" || investigation.lifecycleStatus === "DELETED") {
    return Object.freeze({
      scenarioId: scenario.scenarioId,
      historicalFingerprint: origin.evidenceFingerprint,
      currentFingerprint: null,
      changedSinceHandoff: false,
      referenceStatus: investigation.lifecycleStatus,
      currentAvailability: Object.freeze([investigation.lifecycleStatus]),
      limitations: Object.freeze(["The original investigation is not an active source. The handoff fingerprint is unchanged."]),
      causalProof: false as const,
    });
  }
  const readiness = assessCausalHypothesisReadiness({
    workspaceId: input.workspaceId,
    deckId: origin.deckId,
    investigationId: origin.investigationId,
    hypothesisId: origin.hypothesisId,
  });
  if (!readiness.ok) {
    return Object.freeze({
      scenarioId: scenario.scenarioId,
      historicalFingerprint: origin.evidenceFingerprint,
      currentFingerprint: null,
      changedSinceHandoff: false,
      referenceStatus: "UNAVAILABLE",
      currentAvailability: Object.freeze([readiness.reason]),
      limitations: Object.freeze(["Current evidence could not be resolved. The handoff fingerprint is unchanged."]),
      causalProof: false as const,
    });
  }
  const changed = readiness.value.evidenceFingerprint !== origin.evidenceFingerprint;
  return Object.freeze({
    scenarioId: scenario.scenarioId,
    historicalFingerprint: origin.evidenceFingerprint,
    currentFingerprint: readiness.value.evidenceFingerprint,
    changedSinceHandoff: changed,
    referenceStatus: "CURRENT",
    currentAvailability: Object.freeze(readiness.value.items.map((item) => item.availability)),
    limitations: Object.freeze(changed
      ? ["Current evidence differs from the evidence recorded at handoff.", ...origin.limitations]
      : origin.limitations),
    causalProof: false as const,
  });
}
