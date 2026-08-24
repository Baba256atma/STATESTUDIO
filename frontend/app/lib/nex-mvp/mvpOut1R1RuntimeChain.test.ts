/**
 * MVP-OUT:1-R1 — Outcome/Learning runtime chain completion.
 * Orchestration only. Does not invent Actual, Learning, timestamps, or APP-4 writes.
 */

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, test } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { projectGroundedCausalConstraintIntelligence } from "../executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import {
  resetOutcomeObservationCaptureForTests,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import { resetGroundedLearningForTests } from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import { resetPostDecisionCaptureForTests } from "./nexoraPostDecisionObservationCapture.ts";
import { resetDecisionOutcomeCommitmentForTests } from "./nexoraDecisionOutcomeCommitment.ts";
import {
  initializeExecutiveMemoryStorageEngine,
  resetExecutiveMemoryStorageEngineForTests,
} from "../executiveMemory/executiveMemoryStorageEngine.ts";
import {
  classifyNexoraExiUtterance,
  composeNexoraExecutiveIntelligenceExperience,
  projectNexoraExiConversationalAnswers,
} from "./nexoraExecutiveIntelligenceExperience.ts";
import {
  coordinateNexoraOutcomeLearningRuntime,
  integrateNexoraOutcomeLearningRuntime,
  nexoraOutcomeLearningRuntimeCoordinatorIdentity,
  nexoraOutcomeLearningRuntimeCoordinatorVersion,
} from "./nexoraOutcomeLearningRuntimeIntegration.ts";
import {
  createInitialNexoraMVPFlowDecisionRecords,
  createInitialNexoraMVPFlowExecutionRecords,
} from "./nexoraMVPExecutiveFlowFixtures.ts";
import { composeNexoraProfessionalAdvisorPresentation } from "./nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "./nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "./nexoraMVPPresentationState.ts";
import {
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
} from "./nexoraMVPExecutiveIntelligence.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "./nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "./nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "./nexoraMVPExecutivePresentationPlane.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "./nexoraMVPExecutiveStage2DFixedCamera.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";

function intelligence() {
  return projectGroundedCausalConstraintIntelligence({
    subjectId: "ctx-decision-capacity",
    subjectLabel: "Expand Capacity",
    subjectKind: "decision",
    isOverview: false,
    relationships: [],
  });
}

function liveCompose(subjectId: string) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = syncNexoraMVPObjectInteractionShellContext(
    selectNexoraMVPInteractionSubject(state, subjectId),
    {
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: state.environmentIntent,
    },
  );
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const presentation = applyExecutiveStageFixedCameraToStagePresentation(
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(
      applyExecutiveStage2DTopologyPlaneToStagePresentation(
        applyExecutivePresentationPlaneToStagePresentation(
          applyExecutiveNetworkTopologyToStagePresentation(
            applyExecutiveFocusVisualGrammarToStagePresentation(base, {
              presentationDepth: "minimum",
            }),
          ),
        ),
      ),
    ),
  );
  const advisorBridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
  const presentationViewModel = deriveNexoraMVPPresentationViewModel({
    presentationState: state.presentationState,
    workspace: state.workspace,
    environmentIntent: state.environmentIntent,
    subjectId: state.focusedSubject?.id ?? null,
    subjectKind: state.focusedSubject?.kind ?? null,
    subjectLabel: state.focusedSubject?.label ?? null,
  });
  const context = deriveNexoraMVPExecutiveIntelligenceContext({
    advisorBridge,
    presentationViewModel,
    focusedSubject: state.focusedSubject,
    selectedSubject: state.selectedSubject,
    breadcrumb: advisorBridge.breadcrumb,
  });
  const resolution = resolveNexoraMVPExecutiveIntelligence(context);
  const narrative = composeNexoraProfessionalAdvisorPresentation({
    advisor: resolution.advisor,
    insight: resolution.insight,
    intelligence: context,
    advisorBridge,
    nextBestAction: advisorBridge.nextBestAction,
    decisionBrief: advisorBridge.decisionBrief,
    decisionMemory: advisorBridge.decisionMemory,
  });
  return composeNexoraExecutiveIntelligenceExperience({
    narrative,
    presentationMode: advisorBridge.presentationMode,
    liveOutcomeAvailable: false,
    liveLearningAvailable: false,
    cc11Live: false,
    flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
    flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
  });
}

describe("MVP-OUT:1-R1 runtime chain", { concurrency: false }, () => {
  beforeEach(() => {
    resetOutcomeObservationCaptureForTests();
    resetGroundedLearningForTests();
    resetPostDecisionCaptureForTests();
    resetDecisionOutcomeCommitmentForTests();
    resetExecutiveMemoryStorageEngineForTests();
    initializeExecutiveMemoryStorageEngine("2026-01-01T00:00:00.000Z", "in_memory");
  });
  afterEach(() => {
    resetOutcomeObservationCaptureForTests();
    resetGroundedLearningForTests();
    resetPostDecisionCaptureForTests();
    resetDecisionOutcomeCommitmentForTests();
    resetExecutiveMemoryStorageEngineForTests();
  });

  test("coordinator is the existing seam, not a second authority", () => {
    const core = intelligence();
    const coordinated = coordinateNexoraOutcomeLearningRuntime({
      workspaceId: "nexora-mvp-out1-r1",
      subjectId: "ctx-decision-capacity",
      subjectKind: "decision",
      causal: core.causal,
      constraint: core.constraint,
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
    });
    const integrated = integrateNexoraOutcomeLearningRuntime({
      workspaceId: "nexora-mvp-out1-r1",
      subjectId: "ctx-decision-capacity",
      subjectKind: "decision",
      causal: core.causal,
      constraint: core.constraint,
      flowDecisions: createInitialNexoraMVPFlowDecisionRecords(),
      flowExecutions: createInitialNexoraMVPFlowExecutionRecords(),
    });
    assert.equal(
      coordinated.coordinatorIdentity,
      nexoraOutcomeLearningRuntimeCoordinatorIdentity,
    );
    assert.equal(
      nexoraOutcomeLearningRuntimeCoordinatorVersion,
      "1.0.0",
    );
    assert.equal(coordinated.identity, integrated.identity);
    assert.equal(coordinated.snapshot.decision?.decisionId, "ctx-decision-capacity");
    assert.equal(coordinated.snapshot.execution?.executionId, "ctx-execution-capacity");
    assert.equal(coordinated.cc11Live, false);
    assert.equal(coordinated.liveActualExists, false);
    assert.equal(coordinated.liveLearningCandidates, 0);
    assert.equal(coordinated.liveApp4Promotion, false);
    assert.equal(coordinated.snapshot.linkedActualEvidence.length, 0);
    assert.equal(coordinated.window?.status, "timing-incomplete");
    assert.equal(coordinated.decision?.committedAt, null);
    assert.equal(coordinated.execution?.startedAt, null);
    assert.equal(coordinated.edges.decisionToExpected, "MISSING");
    assert.equal(coordinated.edges.decisionToExecution, "CONNECTED");
    assert.equal(coordinated.edges.executionToObservation, "PARTIAL");
    assert.equal(coordinated.edges.dataRealityToOut1a, "PARTIAL");
    assert.equal(coordinated.edges.out1aToOut1, "CONNECTED");
    assert.equal(coordinated.edges.out1ToOut2, "CONNECTED");
    assert.equal(coordinated.edges.out2ToApp4, "TEST-ONLY");
    assert.equal(coordinated.edges.out2ToExi5, "CONNECTED");
    assert.equal(coordinated.edges.exi5ToAdvisorConversation, "CONNECTED");
  });

  test("AL — live /executive compose uses only LIVE evidence and stays pending", () => {
    const experience = liveCompose("ctx-decision-capacity");
    assert.equal(experience.coreOutcomeAssessment.actualOutcome, null);
    assert.equal(experience.coreLearningAssessment.candidates.length, 0);
    assert.equal(experience.outcomeLearningRuntime.linkedActualEvidence.length, 0);
    assert.equal(experience.outcomeLearningRuntime.coordinatorIdentity, nexoraOutcomeLearningRuntimeCoordinatorIdentity);
    assert.match(
      experience.outcomeLearning.didItWorkStatement,
      /No validated actual outcome|not available|still unknown/i,
    );
    const answers = projectNexoraExiConversationalAnswers(experience);
    assert.equal(classifyNexoraExiUtterance("What did we expect?"), "whatExpected");
    assert.ok(answers.whatExpected.length > 0);
    assert.equal(classifyNexoraExiUtterance("Did it work?"), "didItWork");
    assert.match(answers.didItWork, /No validated actual outcome|not available|still unknown/i);
    assert.equal(classifyNexoraExiUtterance("What did we learn?"), "learning");
    assert.match(
      answers.learning,
      /No promoted Learning is available yet|will not invent/i,
    );
    assert.equal(classifyNexoraExiUtterance("How sure are we?"), "outcomeConfidence");
    assert.ok(answers.outcomeConfidence.length > 0);
    assert.equal(classifyNexoraExiUtterance("Why did it happen?"), "whyOutcome");
    assert.match(
      answers.whyOutcome,
      /not currently have enough evidence to identify a cause|Causal attribution has not been established/i,
    );
  });

  test("AI/AJ — current KPI is Reality, not Actual; no fabricated Learning", () => {
    const core = intelligence();
    const result = coordinateNexoraOutcomeLearningRuntime({
      workspaceId: "nexora-mvp-out1-r1",
      subjectId: "obj-capacity",
      subjectKind: "object",
      causal: core.causal,
      constraint: core.constraint,
      currentKpi: {
        statement: "Capacity utilization is 91%.",
        dimension: "capacity-utilization",
        numericValue: 91,
      },
    });
    assert.equal(result.assessment.currentReality?.isOutcome, false);
    assert.equal(result.assessment.actualOutcome, null);
    assert.equal(result.learning.candidates.length, 0);
    assert.equal(result.edges.dataRealityToOut1a, "PARTIAL");
    assert.equal(result.edges.out2ToApp4, "TEST-ONLY");
  });

  test("FIX4 why? still uses Scenario impact when a Scenario evaluation is active", () => {
    const focus = executeNexoraConversationalExperience({
      utterance: "show delivery",
      executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
      conversationContext: Object.freeze({
        currentSubjectId: null,
        previousSubjectIds: Object.freeze([]),
      }),
      runtimeState: createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      messageIdSeed: "r1-fix4-focus",
    });
    const late = executeNexoraConversationalExperience({
      utterance: "what if delivery be too late",
      executiveContext: focus.nextExecutiveContext,
      runtimeState: focus.nextRuntimeState,
      scenarioSession: focus.nextScenarioSession,
      executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      messageIdSeed: "r1-fix4-late",
    });
    const why = executeNexoraConversationalExperience({
      utterance: "why?",
      executiveContext: late.nextExecutiveContext,
      runtimeState: late.nextRuntimeState,
      scenarioSession: late.nextScenarioSession,
      executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      messageIdSeed: "r1-fix4-why",
    });
    assert.equal(why.intentResult.intent.kind, "explain-scenario");
    assert.match(why.response, /modeled relationship/i);
  });

  test("no LLM, no CC:11 wiring, no automatic APP-4 in coordinator source", () => {
    const source = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "nexoraOutcomeLearningRuntimeIntegration.ts"),
      "utf8",
    );
    assert.match(source, /wiresCc11: false/);
    assert.match(source, /autoPromotesApp4: false/);
    assert.match(source, /usesLlm: false/);
    assert.doesNotMatch(source, /if \(subjectId === "obj-delivery"/);
  });
});
