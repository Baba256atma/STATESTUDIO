/** NPA-T STAGE-GUIDANCE:1 — DTH:8–12 textual guidance lives in existing Advisor. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraAdvisorInsightRegion } from "@/app/executive/nex-mvp/NexoraAdvisorInsightRegion.tsx";
import { NexoraStageMount } from "@/app/executive/nex-mvp/NexoraStageMount.tsx";
import {
  applyNexoraDecisionTheatreAdvisorGuidance,
  emptyNexoraDecisionTheatreSceneSemanticInput,
  projectNexoraDecisionTheatreAdvisorGuidance,
  projectNexoraDecisionTheatreFoundation,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { projectNexoraDecisionTheatreDataObjectsToStage } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState.ts";
import { deriveNexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const two = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;
const emptyDataObjectStage = projectNexoraDecisionTheatreDataObjectsToStage({
  dataObjects: Object.freeze([]),
  visibleDataObjectIds: Object.freeze([]),
  selectedDataObjectId: null,
  businessFocusId: null,
  stageObjects: Object.freeze([]),
});

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "operation",
    environmentIntent: "neutral",
  });
}

function compareInput(memberIds: readonly string[]) {
  return emptyNexoraDecisionTheatreSceneSemanticInput({
    canonicalSemanticResultRef: `compare:${memberIds.join(",")}`,
    canonicalOperation: "COMPARE",
    conversationIntentKind: "compare-scenarios",
    comparison: Object.freeze({
      active: true,
      memberIds: Object.freeze([...memberIds]),
      criterion: "COST",
      criterionAmbiguous: false,
      criterionResolution: null,
    }),
  });
}

function committedDecision() {
  return Object.freeze({
    decisionId: "cc10:decision:ctx-scenario-demand",
    title: "Demand Surge",
    status: "Approved",
    scenarioId: "ctx-scenario-demand",
    committedBy: "manager" as const,
  });
}

function startedExecution() {
  return Object.freeze({
    executionId: "execution-cc10:decision:ctx-scenario-demand",
    decisionId: "cc10:decision:ctx-scenario-demand",
    title: "Demand Surge rollout",
    status: "in-progress",
    ownerIds: Object.freeze([]),
    blockers: Object.freeze([]),
    risks: Object.freeze([]),
    milestones: Object.freeze([]),
  });
}

function fixture(
  extra?: Omit<Parameters<typeof projectNexoraDecisionTheatreFoundation>[0], "stageState">,
) {
  const state = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog);
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    investigationLevel: "understand",
    ...extra,
  });
  const interaction = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const subject = state.focusedSubject ?? state.selectedSubject;
  const presentationViewModel = deriveNexoraMVPPresentationViewModel({
    presentationState: state.presentationState,
    workspace: state.workspace,
    environmentIntent: state.environmentIntent,
    subjectId: subject?.id ?? null,
    subjectKind: subject?.kind ?? null,
    subjectLabel: subject?.label ?? null,
  });
  return {
    state,
    theatre,
    interaction,
    presentationViewModel,
    advisorBridge: buildNexoraMVPAdvisorContextBridge(state, interaction),
    subject,
  };
}

function renderStage(pack: ReturnType<typeof fixture>) {
  return renderToStaticMarkup(
    React.createElement(NexoraStageMount, {
      workspaceLabel: "Overview",
      interaction: pack.interaction,
      environment: deriveNexoraMVPSceneEnvironmentVisualState("neutral"),
      presentationViewModel: pack.presentationViewModel,
      advisorBridge: pack.advisorBridge,
      theatreComposition: pack.theatre,
      objectInvestigation: pack.theatre.objectInvestigation,
      investigationVisible: true,
      dataObjectStage: emptyDataObjectStage,
      decisionComparison: pack.theatre.decisionComparison,
      decisionCommitment: pack.theatre.decisionCommitment,
      executionReadiness: pack.theatre.executionReadiness,
      liveExecution: pack.theatre.liveExecution,
      outcomeObservation: pack.theatre.outcomeObservation,
      learningReassessment: pack.theatre.learningReassessment,
      onSelectSubject: () => undefined,
      onStepBack: () => undefined,
      onOverview: () => undefined,
      onPresentationStateChange: () => undefined,
      onPresentationAction: () => undefined,
      onSelectDataObject: () => undefined,
      onRemoveDataObjectFromStage: () => undefined,
      onOpenDataRail: () => undefined,
      onAskDataObject: () => undefined,
    }),
  );
}

function renderAdvisor(pack: ReturnType<typeof fixture>) {
  return renderToStaticMarkup(
    React.createElement(NexoraAdvisorInsightRegion, {
      tab: "Assist",
      onTabChange: () => undefined,
      advisorBridge: pack.advisorBridge,
      presentationViewModel: pack.presentationViewModel,
      focusedSubject: pack.state.focusedSubject,
      selectedSubject: pack.state.selectedSubject,
      onIntelligenceAction: () => undefined,
      theatreComposition: pack.theatre,
    }),
  );
}

const GUIDANCE_STAGE_CARDS = [
  "nexora-theatre-decision-commitment",
  "nexora-theatre-execution-readiness",
  "nexora-theatre-live-execution",
  "nexora-theatre-outcome-observation",
  "nexora-theatre-learning-reassessment",
] as const;

test("A — DTH:8 Decision Review Stage card is absent; Advisor receives commitment copy", () => {
  const pack = fixture({
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-demand",
  });
  assert.equal(pack.theatre.decisionCommitment?.state, "REVIEWING");
  const stage = renderStage(pack);
  for (const card of GUIDANCE_STAGE_CARDS) {
    assert.doesNotMatch(stage, new RegExp(`data-testid="${card}"`));
  }
  const guidance = projectNexoraDecisionTheatreAdvisorGuidance(pack.theatre);
  assert.equal(guidance?.phase, "commitment");
  assert.match(guidance?.situation ?? "", /Demand Surge|review/i);
  const advisor = renderAdvisor(pack);
  assert.match(advisor, /data-theatre-advisor-guidance="commitment"/);
  assert.match(advisor, /data-testid="nexora-advisor-situation"/);
  assert.match(advisor, /not yet committed/i);
  assert.doesNotMatch(advisor, />CC:10R</);
});

test("B — DTH:9 Execution Readiness Stage card is absent; Advisor keeps honest unknowns", () => {
  const pack = fixture({
    sceneSemanticInput: compareInput(two),
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  assert.equal(pack.theatre.executionReadiness?.readiness, "COMMITTED_AWAITING_EXECUTION");
  assert.equal(pack.theatre.executionReadiness?.supportedDimensions.owner.status, "unknown");
  assert.equal(pack.theatre.executionReadiness?.supportedDimensions.timing.status, "unknown");
  assert.equal(pack.theatre.executionReadiness?.supportedDimensions.resources.status, "unknown");
  assert.equal(pack.theatre.executionReadiness?.supportedDimensions.dependencies.status, "unknown");
  const stage = renderStage(pack);
  assert.doesNotMatch(stage, /data-testid="nexora-theatre-execution-readiness"/);
  assert.match(stage, /data-theatre-execution-readiness="COMMITTED_AWAITING_EXECUTION"/);
  const guidance = projectNexoraDecisionTheatreAdvisorGuidance(pack.theatre);
  assert.equal(guidance?.phase, "execution-readiness");
  assert.equal(
    guidance?.recommendation,
    pack.theatre.executionReadiness?.advisorReadable.whatHappensNext,
  );
  assert.equal(
    guidance?.recommendation?.includes(
      pack.theatre.executionReadiness?.advisorReadable.startBoundary ?? "",
    ),
    false,
  );
  assert.match(guidance?.situation ?? "", /committed Decision/i);
  assert.match(guidance?.situation ?? "", /has not started/i);
  assert.match(guidance?.whyItMatters ?? "", /owner is not established/i);
  assert.match(guidance?.whyItMatters ?? "", /timing is not established/i);
  assert.match(guidance?.whyItMatters ?? "", /resources is not established/i);
  assert.match(guidance?.whyItMatters ?? "", /dependencies is not established/i);
  assert.doesNotMatch(guidance?.situation ?? "", /has started\./i);
  const advisor = renderAdvisor(pack);
  assert.match(advisor, /data-theatre-advisor-guidance="execution-readiness"/);
  assert.match(advisor, /data-theatre-advisor-guidance-source="execution-readiness"/);
  assert.match(advisor, /committed Decision/i);
  assert.match(advisor, /not established/);
  assert.doesNotMatch(advisor, />CC:11</);
});

test("C — DTH:10 Active Execution Stage card is absent; Advisor uses live copy", () => {
  const pack = fixture({
    authoritativeDecisions: [committedDecision()],
    authoritativeExecutions: [startedExecution()],
    executionStarted: true,
    executionRuntimeAvailable: true,
  });
  assert.ok(pack.theatre.liveExecution);
  const stage = renderStage(pack);
  assert.doesNotMatch(stage, /data-testid="nexora-theatre-live-execution"/);
  const guidance = projectNexoraDecisionTheatreAdvisorGuidance(pack.theatre);
  assert.equal(guidance?.phase, "live-execution");
  const advisor = renderAdvisor(pack);
  assert.match(advisor, /data-theatre-advisor-guidance="live-execution"/);
});

test("D — overlay prefers later lifecycle phase and does not invent truth", () => {
  const ready = fixture({
    sceneSemanticInput: compareInput(two),
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  const applied = applyNexoraDecisionTheatreAdvisorGuidance(
    {
      situation: "Generic object copy.",
      whyItMatters: "Generic why.",
      recommendation: "Generic next.",
      evidenceSummary: "Generic evidence.",
    },
    ready.theatre,
  );
  assert.match(applied.situation, /committed Decision/);
  assert.equal(applied.situation.includes("Generic object copy."), false);
  assert.equal(projectNexoraDecisionTheatreAdvisorGuidance(ready.theatre)?.writesBusinessState, false);
});

test("E — DTH:11 Outcome Stage card is absent; Advisor receives observation copy", () => {
  const pack = fixture({
    ncaActiveComparison: Object.freeze({
      candidateIds: Object.freeze([...two]),
      candidateKind: "scenario",
      criterion: "COST",
    }),
    authoritativeDecisions: [committedDecision()],
    authoritativeExecutions: [{ ...startedExecution(), status: "completed" }],
    authoritativeOutcomeObservations: [
      Object.freeze({
        observationId: "outcome:delivery:94",
        executionId: "execution-cc10:decision:ctx-scenario-demand",
        decisionId: "cc10:decision:ctx-scenario-demand",
        goalId: "goal:delivery",
        measure: "Delivery",
        observedNumeric: 94,
        observedLabel: "94%",
        unit: "%",
        baselineNumeric: 91,
        baselineLabel: "91%",
        targetNumeric: 96,
        targetLabel: "96%",
        source: "kpi-observation" as const,
        phase: "unknown" as const,
        causalSupport: false as const,
        financialKnown: false,
      }),
    ],
    executionStarted: true,
    executionRuntimeAvailable: true,
  });
  assert.ok(pack.theatre.outcomeObservation);
  const stage = renderStage(pack);
  assert.doesNotMatch(stage, /data-testid="nexora-theatre-outcome-observation"/);
  const guidance = projectNexoraDecisionTheatreAdvisorGuidance(pack.theatre);
  assert.ok(
    guidance?.phase === "outcome-observation" ||
      guidance?.phase === "learning-reassessment",
  );
  const advisor = renderAdvisor(pack);
  assert.match(
    advisor,
    /data-theatre-advisor-guidance="(outcome-observation|learning-reassessment)"/,
  );
});

test("F — DTH:12 Learning Stage card is absent when learning is supported", () => {
  const pack = fixture({
    ncaActiveComparison: Object.freeze({
      candidateIds: Object.freeze([...two]),
      candidateKind: "scenario",
      criterion: "COST",
    }),
    authoritativeDecisions: [committedDecision()],
    authoritativeExecutions: [{ ...startedExecution(), status: "completed" }],
    authoritativeOutcomeObservations: [
      Object.freeze({
        observationId: "outcome:delivery:94",
        executionId: "execution-cc10:decision:ctx-scenario-demand",
        decisionId: "cc10:decision:ctx-scenario-demand",
        goalId: "goal:delivery",
        measure: "Delivery",
        observedNumeric: 94,
        observedLabel: "94%",
        unit: "%",
        baselineNumeric: 91,
        baselineLabel: "91%",
        targetNumeric: 96,
        targetLabel: "96%",
        source: "kpi-observation" as const,
        phase: "final" as const,
        causalSupport: false as const,
        financialKnown: false,
      }),
    ],
    executionStarted: true,
    executionRuntimeAvailable: true,
  });
  const stage = renderStage(pack);
  assert.doesNotMatch(stage, /data-testid="nexora-theatre-learning-reassessment"/);
  const guidance = projectNexoraDecisionTheatreAdvisorGuidance(pack.theatre);
  if (guidance?.phase === "learning-reassessment") {
    const advisor = renderAdvisor(pack);
    assert.match(advisor, /data-theatre-advisor-guidance="learning-reassessment"/);
  } else {
    assert.ok(
      guidance?.phase === "outcome-observation",
      "insufficient learning stays on outcome guidance rather than inventing learning",
    );
  }
});

test("G — DTH:7 Comparison remains a Stage Theatre surface", () => {
  const pack = fixture({
    sceneSemanticInput: compareInput(two),
  });
  assert.ok(pack.theatre.decisionComparison);
  assert.equal(pack.theatre.decisionCommitment, null);
  const stage = renderStage(pack);
  assert.match(stage, /data-testid="nexora-theatre-comparison"/);
  for (const card of GUIDANCE_STAGE_CARDS) {
    assert.doesNotMatch(stage, new RegExp(`data-testid="${card}"`));
  }
});

test("VIEW/ACTIONS and Object Card ownership are not redesigned", () => {
  const pack = fixture({
    sceneSemanticInput: compareInput(two),
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  const stage = renderStage(pack);
  assert.match(stage, /data-testid="nexora-presentation-state-selector"/);
  assert.match(stage, /data-testid="nexora-subject-operation"/);
  assert.doesNotMatch(stage, /data-testid="nexora-theatre-investigation"/);
  const mount = readFileSync(join(FRONTEND, "app/executive/nex-mvp/NexoraStageMount.tsx"), "utf8");
  assert.doesNotMatch(mount, /NexoraDecisionTheatreExecutionReadinessSurface/);
  assert.doesNotMatch(mount, /NexoraDecisionTheatreCommitmentSurface/);
  assert.doesNotMatch(mount, /NexoraDecisionTheatreLiveExecutionSurface/);
  assert.doesNotMatch(mount, /NexoraDecisionTheatreOutcomeObservationSurface/);
  assert.doesNotMatch(mount, /NexoraDecisionTheatreLearningReassessmentSurface/);
  assert.doesNotMatch(mount, /NexoraDecisionTheatreComparisonSurface/);
  const stageHost = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(stageHost, /NexoraDecisionTheatreComparisonSurface/);
});
