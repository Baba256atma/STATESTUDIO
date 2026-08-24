/**
 * MVP-OUT:1 — Outcome / Learning runtime integration seam.
 *
 * Orchestrates certified authorities. Does not evaluate Outcome, capture
 * semantics, interpret Learning, infer cause, persist memory, or present.
 */

import type { DataRealityAwareAdvisorBindingResult } from "../data-reality/dataRealityAwareAdvisorExperienceBinding.ts";
import type {
  CausalAssessment,
  ConstraintAssessment,
} from "../executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import {
  projectLiveOutcomeIntelligence,
  type ExecutiveOutcomeAssessment,
  type ExecutiveOutcomeExpectation,
} from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import {
  captureOutcomeObservation,
  openOutcomeObservationWindow,
  projectOutcomeObservationCapture,
  type OutcomeLinkBasis,
  type OutcomeObservationCaptureAssessment,
  type OutcomeObservationInput,
  type OutcomeObservationWindowRecord,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import {
  projectGroundedLearningIntelligence,
  promoteGroundedLearningToApp4,
  type App4GroundedLearningPromotionResult,
  type GroundedLearningIntelligence,
} from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import type {
  NexoraMVPFlowDecisionRecord,
  NexoraMVPFlowExecutionRecord,
} from "./nexoraMVPExecutiveFlowFixtures.ts";
import {
  composeNexoraExi5OutcomeLearningExperience,
  type ExecutiveOutcomeLearningExperience,
} from "./nexoraExecutiveIntelligenceExperienceExi5.ts";
import {
  collectNexoraLiveExpectedOutcome,
  resolveNexoraLiveLinkedSubjectOfKind,
} from "./nexoraLiveEpistemicProjection.ts";
import type { NexoraDecisionRuntimeAdapter } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import {
  resolveDecisionExpectedOutcomeBinding,
  type DecisionExpectedOutcomeBinding,
} from "./nexoraDecisionExpectedOutcomeBinding.ts";
import { registerPostDecisionCaptureContext } from "./nexoraPostDecisionObservationCapture.ts";
import {
  isPostBoundaryObservation,
  resolveDecisionOutcomeCommitment,
  type DecisionOutcomeCommitment,
} from "./nexoraDecisionOutcomeCommitment.ts";

export const nexoraOutcomeLearningRuntimeIntegrationIdentity =
  "MVP-OUT:1/OutcomeLearningRuntimeIntegration" as const;
export const nexoraOutcomeLearningRuntimeIntegrationVersion = "1.0.0" as const;
export const nexoraOutcomeLearningRuntimeIntegrationNamespace =
  "nexora.mvp.outcome-learning-runtime-integration" as const;

export const nexoraOutcomeLearningRuntimeCoordinatorIdentity =
  "MVP-OUT:1-R1/OutcomeLearningRuntimeCoordinator" as const;
export const nexoraOutcomeLearningRuntimeCoordinatorVersion = "1.0.0" as const;

export const MVP_OUT1_INTEGRATION_BOUNDARY = Object.freeze({
  role: "runtime-integration-orchestration" as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  ownsDataReality: false as const,
  ownsOutcomeObservation: false as const,
  ownsOutcomeEvaluation: false as const,
  ownsLearning: false as const,
  ownsCausality: false as const,
  ownsMemory: false as const,
  ownsPresentation: false as const,
  wiresCc11: false as const,
  autoPromotesApp4: false as const,
  usesLlm: false as const,
  inventsTimestamps: false as const,
  inventsProvenance: false as const,
  inventsActualOutcome: false as const,
  inventsLearning: false as const,
  currentKpiEqualsOutcome: false as const,
  executionCompletionEqualsOutcome: false as const,
  outcomeEqualsCausality: false as const,
  outcomeEqualsLearning: false as const,
  redesignsStage: false as const,
});

export type RuntimeIntegrationEdgeStatus =
  | "CONNECTED"
  | "PARTIAL"
  | "MISSING"
  | "TEST-ONLY";

export type OutcomeLearningDecisionRef = Readonly<{
  readonly decisionId: string;
  readonly status: string;
  readonly committed: boolean;
  readonly committedAt: string | null;
  readonly source: "nex-mvp-8-flow" | "explicit";
}>;

export type OutcomeLearningExecutionRef = Readonly<{
  readonly executionId: string;
  readonly status: string;
  readonly progress: string | null;
  readonly startedAt: string | null;
  readonly completedAt: string | null;
  readonly sourceDecisionId: string | null;
  readonly complete: boolean;
  readonly source: "nex-mvp-8-flow" | "explicit";
}>;

export type OutcomeLearningRuntimeEdges = Readonly<{
  readonly decisionToExpected: RuntimeIntegrationEdgeStatus;
  readonly decisionToCommitment: RuntimeIntegrationEdgeStatus;
  readonly decisionToExecution: RuntimeIntegrationEdgeStatus;
  readonly executionToObservation: RuntimeIntegrationEdgeStatus;
  readonly dataRealityToOut1a: RuntimeIntegrationEdgeStatus;
  readonly out1aToOut1: RuntimeIntegrationEdgeStatus;
  readonly out1ToOut2: RuntimeIntegrationEdgeStatus;
  readonly out2ToApp4: RuntimeIntegrationEdgeStatus;
  readonly out2ToExi5: RuntimeIntegrationEdgeStatus;
  readonly exi5ToAdvisorConversation: RuntimeIntegrationEdgeStatus;
}>;

export type IntegrateNexoraOutcomeLearningRuntimeInput = Readonly<{
  readonly workspaceId: string;
  readonly subjectId: string | null;
  readonly subjectKind?: string | null;
  readonly currentKpi?: {
    readonly statement: string;
    readonly dimension: string | null;
    readonly numericValue: number | null;
  } | null;
  readonly expected?: ExecutiveOutcomeExpectation | null;
  readonly collectLiveExpected?: boolean;
  readonly decision?: OutcomeLearningDecisionRef | null;
  readonly execution?: OutcomeLearningExecutionRef | null;
  readonly flowDecisions?: readonly NexoraMVPFlowDecisionRecord[];
  readonly flowExecutions?: readonly NexoraMVPFlowExecutionRecord[];
  readonly decisionRuntime?: NexoraDecisionRuntimeAdapter | null;
  readonly observations?: readonly OutcomeObservationInput[];
  readonly linkBasis?: OutcomeLinkBasis | null;
  readonly window?: OutcomeObservationWindowRecord | null;
  readonly committedAt?: string | null;
  readonly executionStartedAt?: string | null;
  readonly executionCompletedAt?: string | null;
  readonly expectedStartAt?: string | null;
  readonly expectedEndAt?: string | null;
  readonly baselineObservationId?: string | null;
  readonly recentChangePresent?: boolean;
  readonly recommendationPresent?: boolean;
  readonly causal: CausalAssessment;
  readonly constraint: ConstraintAssessment;
  readonly authorizeApp4Promotion?: boolean;
  readonly advisorBinding?: DataRealityAwareAdvisorBindingResult | null;
  readonly validatedDataSource?: boolean;
  readonly executionSubject?: boolean;
}>;

export type NexoraOutcomeLearningRuntimeSnapshot = Readonly<{
  readonly coordinatorIdentity: typeof nexoraOutcomeLearningRuntimeCoordinatorIdentity;
  readonly coordinatorVersion: typeof nexoraOutcomeLearningRuntimeCoordinatorVersion;
  readonly decision: OutcomeLearningDecisionRef | null;
  readonly execution: OutcomeLearningExecutionRef | null;
  readonly expectedOutcomes: readonly ExecutiveOutcomeExpectation[];
  readonly expectedBinding: DecisionExpectedOutcomeBinding;
  readonly outcomeCommitment: DecisionOutcomeCommitment;
  readonly observationWindow: OutcomeObservationWindowRecord | null;
  readonly observations: OutcomeObservationCaptureAssessment["observations"];
  readonly linkedActualEvidence: OutcomeObservationCaptureAssessment["linkedActuals"];
  readonly outcomeAssessment: ExecutiveOutcomeAssessment;
  readonly learningCandidates: GroundedLearningIntelligence["candidates"];
  readonly promotionEligibility: GroundedLearningIntelligence["promotions"];
  readonly historicalLearning: ExecutiveOutcomeLearningExperience["historicalLearning"];
  readonly experience: ExecutiveOutcomeLearningExperience;
}>;

export type NexoraOutcomeLearningRuntimeIntegration = Readonly<{
  readonly identity: typeof nexoraOutcomeLearningRuntimeIntegrationIdentity;
  readonly version: typeof nexoraOutcomeLearningRuntimeIntegrationVersion;
  readonly coordinatorIdentity: typeof nexoraOutcomeLearningRuntimeCoordinatorIdentity;
  readonly decision: OutcomeLearningDecisionRef | null;
  readonly execution: OutcomeLearningExecutionRef | null;
  readonly expected: ExecutiveOutcomeExpectation | null;
  readonly expectedBinding: DecisionExpectedOutcomeBinding;
  readonly outcomeCommitment: DecisionOutcomeCommitment;
  readonly window: OutcomeObservationWindowRecord | null;
  readonly capture: OutcomeObservationCaptureAssessment;
  readonly assessment: ExecutiveOutcomeAssessment;
  readonly learning: GroundedLearningIntelligence;
  readonly experience: ExecutiveOutcomeLearningExperience;
  readonly app4: readonly App4GroundedLearningPromotionResult[];
  readonly edges: OutcomeLearningRuntimeEdges;
  readonly snapshot: NexoraOutcomeLearningRuntimeSnapshot;
  readonly cc11Live: false;
  readonly liveActualExists: boolean;
  readonly liveLearningCandidates: number;
  readonly liveApp4Promotion: false | "authorized-seam";
  readonly authorityState: typeof MVP_OUT1_INTEGRATION_BOUNDARY;
}>;

function freezeList<T>(values: readonly T[]): readonly T[] {
  return Object.freeze([...values]);
}

function resolveFlowDecision(
  subjectId: string | null,
  input: IntegrateNexoraOutcomeLearningRuntimeInput,
): OutcomeLearningDecisionRef | null {
  if (input.decision) return input.decision;
  if (subjectId != null && input.decisionRuntime) {
    const fromRuntime = input.decisionRuntime.getDecision(subjectId);
    if (fromRuntime != null) {
      const approved = fromRuntime.status === "Approved";
      return Object.freeze({
        decisionId: fromRuntime.decisionId,
        status: fromRuntime.status,
        committed: approved,
        committedAt: approved
          ? (fromRuntime.committedAt ?? input.committedAt ?? null)
          : null,
        source: "explicit" as const,
      });
    }
  }
  const decisions = input.flowDecisions ?? [];
  const executions = input.flowExecutions ?? [];
  if (subjectId == null || decisions.length === 0) return null;
  const direct = decisions.find((entry) => entry.id === subjectId);
  const fromExecution = executions.find((entry) => entry.id === subjectId);
  const linkedId =
    direct?.id ??
    fromExecution?.sourceDecisionId ??
    resolveNexoraLiveLinkedSubjectOfKind(subjectId, "decision");
  const record = decisions.find((entry) => entry.id === linkedId) ?? null;
  if (record == null) return null;
  const committed = record.status === "approved";
  return Object.freeze({
    decisionId: record.id,
    status: record.status,
    committed,
    committedAt: committed ? (input.committedAt ?? null) : null,
    source: "nex-mvp-8-flow",
  });
}

function resolveFlowExecution(
  subjectId: string | null,
  decisionId: string | null,
  input: IntegrateNexoraOutcomeLearningRuntimeInput,
): OutcomeLearningExecutionRef | null {
  if (input.execution) return input.execution;
  const executions = input.flowExecutions ?? [];
  if (executions.length === 0) return null;
  const direct =
    (subjectId != null
      ? executions.find((entry) => entry.id === subjectId)
      : undefined) ??
    (decisionId != null
      ? executions.find((entry) => entry.sourceDecisionId === decisionId)
      : undefined) ??
    (subjectId != null
      ? executions.find(
          (entry) =>
            entry.id === resolveNexoraLiveLinkedSubjectOfKind(subjectId, "execution"),
        )
      : undefined) ??
    null;
  if (direct == null) return null;
  const complete = direct.status === "complete";
  return Object.freeze({
    executionId: direct.id,
    status: direct.status,
    progress: direct.progress,
    startedAt: input.executionStartedAt ?? null,
    completedAt: complete ? (input.executionCompletedAt ?? null) : null,
    sourceDecisionId: direct.sourceDecisionId,
    complete,
    source: "nex-mvp-8-flow",
  });
}

function classifyEdge(
  connected: boolean,
  partial: boolean,
  testOnly: boolean,
): RuntimeIntegrationEdgeStatus {
  if (testOnly && connected) return "TEST-ONLY";
  if (connected) return "CONNECTED";
  if (partial) return "PARTIAL";
  return "MISSING";
}

export function integrateNexoraOutcomeLearningRuntime(
  input: IntegrateNexoraOutcomeLearningRuntimeInput,
): NexoraOutcomeLearningRuntimeIntegration {
  const subjectId = input.subjectId;
  const decision = resolveFlowDecision(subjectId, input);
  const execution = resolveFlowExecution(subjectId, decision?.decisionId ?? null, input);
  const collected =
    input.collectLiveExpected === true && subjectId != null
      ? collectNexoraLiveExpectedOutcome(subjectId, input.subjectKind ?? null)
      : null;
  const explicitExpected =
    input.expected !== undefined ? input.expected : null;
  const expectedBinding = resolveDecisionExpectedOutcomeBinding({
    decisionId: decision?.decisionId ?? null,
    subjectId,
    explicitExpected,
  });
  const expected =
    expectedBinding.status === "bound"
      ? expectedBinding.expectation
      : (explicitExpected ?? collected);

  const outcomeCommitment = resolveDecisionOutcomeCommitment({
    decisionId: decision?.decisionId ?? null,
    subjectId,
    decisionCommitted: decision?.committed === true,
    committedAt: input.committedAt ?? decision?.committedAt ?? null,
    explicitExpected: expectedBinding.status === "bound" ? expectedBinding.expectation : null,
    inheritedScenarioExpected:
      expectedBinding.status !== "bound" && explicitExpected?.source === "scenario"
        ? explicitExpected
        : null,
  });

  const timingAt =
    input.committedAt ??
    outcomeCommitment.committedAt ??
    decision?.committedAt ??
    input.executionStartedAt ??
    execution?.startedAt ??
    input.expectedStartAt ??
    null;
  const window =
    input.window ??
    (subjectId != null &&
    (timingAt != null ||
      input.expectedEndAt != null ||
      decision != null ||
      execution != null)
      ? openOutcomeObservationWindow({
          subjectId,
          decisionId: decision?.decisionId ?? null,
          executionId: execution?.executionId ?? null,
          openedAt: timingAt,
          expectedStartAt: input.expectedStartAt ?? timingAt,
          expectedEndAt: input.expectedEndAt ?? null,
          baselineObservationId: input.baselineObservationId ?? null,
          expectedOutcomeIds: expected ? [expected.expectationId] : [],
        })
      : null);

  registerPostDecisionCaptureContext(
    Object.freeze({
      decisionId: decision?.decisionId ?? null,
      executionId: execution?.executionId ?? null,
      subjectId,
      expected,
      window,
      binding: expectedBinding,
      linkBasis: input.linkBasis ?? (expectedBinding.status === "bound" ? "metric-binding" : null),
    }),
  );

  const suppliedObservations = input.observations ?? [];
  for (const observation of suppliedObservations) {
    const postBoundary = isPostBoundaryObservation(observation.observedAt, timingAt);
    captureOutcomeObservation({
      observation,
      expected: expectedBinding.status === "bound" ? expected : null,
      window,
      linkBasis: postBoundary ? (input.linkBasis ?? null) : null,
    });
  }

  const capture = projectOutcomeObservationCapture({
    subjectId,
    expected,
    window,
    currentKpi: input.currentKpi ?? null,
  });

  const assessment = projectLiveOutcomeIntelligence({
    subjectId,
    decisionId: decision?.decisionId ?? null,
    executionId: execution?.executionId ?? null,
    expected,
    capture,
    currentReality: input.currentKpi
      ? {
          statement: input.currentKpi.statement,
          dimension: input.currentKpi.dimension,
          numericValue: input.currentKpi.numericValue,
        }
      : null,
    executionProgressOnly: execution != null && !execution.complete,
    recommendationPresent: input.recommendationPresent === true,
    decisionCommitted: decision?.committed === true,
    recentChangePresent: input.recentChangePresent === true,
  });

  const learning = projectGroundedLearningIntelligence({
    workspaceId: input.workspaceId,
    subjectId,
    createdAt:
      assessment.actualOutcome?.observedAt ??
      expected?.capturedAt ??
      "core-out2:session",
    assessment,
    capture,
    causal: input.causal,
    constraint: input.constraint,
    decisionId: assessment.decisionId,
    executionId: assessment.executionId,
    currentKpiOnly:
      input.currentKpi != null &&
      assessment.actualOutcome == null &&
      suppliedObservations.length === 0,
    executionCompleteOnly:
      execution?.complete === true && assessment.actualOutcome == null,
    expectedOnly: expected != null && assessment.actualOutcome == null,
    recommendationOnly: input.recommendationPresent === true && assessment.actualOutcome == null,
  });

  const authorized = input.authorizeApp4Promotion === true;
  const app4 = authorized
    ? freezeList(
        learning.promotions
          .map((promotion) => {
            const candidate = learning.candidates.find(
              (entry) => entry.learningId === promotion.learningId,
            );
            if (candidate == null) return null;
            return promoteGroundedLearningToApp4({
              candidate,
              promotion,
              owner: nexoraOutcomeLearningRuntimeIntegrationIdentity,
            });
          })
          .filter((entry): entry is App4GroundedLearningPromotionResult => entry != null),
      )
    : freezeList([]);

  const experience = composeNexoraExi5OutcomeLearningExperience({
    workspaceId: input.workspaceId,
    subjectId,
    assessment,
    learning,
    causal: input.causal,
    currentRealityStatement: assessment.currentReality?.statement ?? input.currentKpi?.statement ?? null,
    executionComplete: execution?.complete === true || input.executionSubject === true,
    observationLinked: assessment.actualOutcome?.outcomeLinked === true,
  });

  const linkedActuals = capture.linkedActuals.length > 0;
  const expectedHasCanonicalMetric =
    expected != null &&
    expected.dimension != null &&
    (expected.numericTarget != null ||
      expected.expectedDirection != null ||
      expected.comparator != null);
  const snapshot: NexoraOutcomeLearningRuntimeSnapshot = Object.freeze({
    coordinatorIdentity: nexoraOutcomeLearningRuntimeCoordinatorIdentity,
    coordinatorVersion: nexoraOutcomeLearningRuntimeCoordinatorVersion,
    decision,
    execution,
    expectedOutcomes: Object.freeze(expected ? [expected] : []),
    expectedBinding,
    outcomeCommitment,
    observationWindow: window,
    observations: capture.observations,
    linkedActualEvidence: capture.linkedActuals,
    outcomeAssessment: assessment,
    learningCandidates: learning.candidates,
    promotionEligibility: learning.promotions,
    historicalLearning: experience.historicalLearning,
    experience,
  });
  const edges: OutcomeLearningRuntimeEdges = Object.freeze({
    decisionToExpected: classifyEdge(
      decision != null &&
        expectedHasCanonicalMetric &&
        (expected?.source === "decision" || expected?.source === "decision-memory"),
      decision != null && expected != null,
      false,
    ),
    decisionToExecution: classifyEdge(
      decision != null && execution != null && execution.sourceDecisionId === decision.decisionId,
      execution != null,
      false,
    ),
    executionToObservation: classifyEdge(
      execution != null && (timingAt != null || suppliedObservations.length > 0),
      execution != null,
      suppliedObservations.length > 0 && timingAt != null,
    ),
    dataRealityToOut1a:
      suppliedObservations.length > 0
        ? "TEST-ONLY"
        : "PARTIAL",
    decisionToCommitment: classifyEdge(
      outcomeCommitment.status === "committed",
      decision != null,
      outcomeCommitment.status === "committed" && suppliedObservations.length > 0,
    ),
    out1aToOut1: classifyEdge(true, false, false),
    out1ToOut2: classifyEdge(true, false, false),
    out2ToApp4: !authorized
      ? "TEST-ONLY"
      : classifyEdge(app4.some((entry) => entry.promoted), true, false),
    out2ToExi5: classifyEdge(true, false, false),
    exi5ToAdvisorConversation: classifyEdge(true, false, false),
  });

  return Object.freeze({
    identity: nexoraOutcomeLearningRuntimeIntegrationIdentity,
    version: nexoraOutcomeLearningRuntimeIntegrationVersion,
    decision,
    execution,
    expected,
    expectedBinding,
    outcomeCommitment,
    window,
    capture,
    assessment,
    learning,
    experience,
    app4,
    edges,
    snapshot,
    coordinatorIdentity: nexoraOutcomeLearningRuntimeCoordinatorIdentity,
    cc11Live: false,
    liveActualExists: linkedActuals,
    liveLearningCandidates: learning.candidates.length,
    liveApp4Promotion: authorized ? "authorized-seam" : false,
    authorityState: MVP_OUT1_INTEGRATION_BOUNDARY,
  });
}

/** R1 orchestration alias — same seam, named coordinator, no second authority. */
export function coordinateNexoraOutcomeLearningRuntime(
  input: IntegrateNexoraOutcomeLearningRuntimeInput,
): NexoraOutcomeLearningRuntimeIntegration {
  return integrateNexoraOutcomeLearningRuntime(input);
}
