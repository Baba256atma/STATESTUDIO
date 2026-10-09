/** NPA-T RIGHT-PANEL-POLISH:1 — Advisor information hierarchy is scannable. */

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
  subjectId: string | null,
  extra?: Omit<Parameters<typeof projectNexoraDecisionTheatreFoundation>[0], "stageState">,
) {
  const selected =
    subjectId == null
      ? initial()
      : selectNexoraMVPInteractionSubject(initial(), subjectId, catalog);
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: selected,
    catalog,
    investigationLevel: "understand",
    ...extra,
  });
  const interaction = deriveNexoraMVPStageInteractionPresentation(selected, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const subject = selected.focusedSubject ?? selected.selectedSubject;
  const presentationViewModel = deriveNexoraMVPPresentationViewModel({
    presentationState: selected.presentationState,
    workspace: selected.workspace,
    environmentIntent: selected.environmentIntent,
    subjectId: subject?.id ?? null,
    subjectKind: subject?.kind ?? null,
    subjectLabel: subject?.label ?? null,
  });
  return {
    state: selected,
    theatre,
    interaction,
    presentationViewModel,
    advisorBridge: buildNexoraMVPAdvisorContextBridge(selected, interaction),
  };
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

test("A — Executive Overview remains scannable without fabricated readiness", () => {
  const html = renderAdvisor(fixture(null));
  assert.match(html, /data-testid="nexora-advisor-view-title"/);
  assert.match(html, /data-testid="nexora-advisor-situation"/);
  assert.doesNotMatch(html, /data-testid="nexora-advisor-readiness"/);
  assert.match(html, /data-right-panel-polish="1"/);
});

test("B — Execution Readiness is a compact situation plus scannable unknowns", () => {
  const pack = fixture("ctx-scenario-demand", {
    sceneSemanticInput: compareInput(two),
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  const guidance = projectNexoraDecisionTheatreAdvisorGuidance(pack.theatre);
  assert.equal(guidance?.phase, "execution-readiness");
  assert.equal(guidance?.hierarchy.situationStatus, "Committed Decision · Execution not started");
  assert.equal(guidance?.hierarchy.readinessRows.length, 6);
  assert.ok(
    guidance?.hierarchy.readinessRows.every(
      (row) => row.status !== "unknown" || row.value === "Not established",
    ),
  );
  const html = renderAdvisor(pack);
  assert.match(html, /data-testid="nexora-advisor-readiness"/);
  assert.match(html, /Committed Decision · Execution not started/);
  assert.match(html, /data-readiness-status="unknown"/);
  assert.doesNotMatch(html, /owner is not established/i);
  assert.doesNotMatch(html, /\bfailure\b|\bfailed\b/i);
  assert.match(html, /not the same as a blocker/i);
  assert.match(html, /Next Best Action/);
  assert.match(html, /data-testid="nexora-advisor-recommendation-primary"/);
  assert.doesNotMatch(html, /Viewing this scene does not start execution/i);
  assert.doesNotMatch(html, /data-testid="nexora-theatre-execution-readiness"/);
});

test("C — Active Execution stays concise and is not formatted as readiness", () => {
  const pack = fixture("ctx-scenario-demand", {
    authoritativeDecisions: [committedDecision()],
    authoritativeExecutions: [startedExecution()],
    executionStarted: true,
    executionRuntimeAvailable: true,
  });
  const guidance = projectNexoraDecisionTheatreAdvisorGuidance(pack.theatre);
  assert.equal(guidance?.phase, "live-execution");
  assert.equal(guidance?.hierarchy.readinessRows.length, 0);
  const html = renderAdvisor(pack);
  assert.match(html, /data-theatre-advisor-guidance="live-execution"/);
  assert.doesNotMatch(html, /data-testid="nexora-advisor-readiness"/);
});

test("D — Outcome is not formatted as readiness", () => {
  const pack = fixture("ctx-scenario-demand", {
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
  const guidance = projectNexoraDecisionTheatreAdvisorGuidance(pack.theatre);
  assert.ok(
    guidance?.phase === "outcome-observation" ||
      guidance?.phase === "learning-reassessment",
  );
  if (guidance?.phase === "outcome-observation") {
    assert.equal(guidance.hierarchy.readinessRows.length, 0);
  }
  const html = renderAdvisor(pack);
  assert.doesNotMatch(html, /data-testid="nexora-advisor-readiness"/);
});

test("E — Learning remains semantically distinct from readiness", () => {
  const pack = fixture("ctx-scenario-demand", {
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
  const html = renderAdvisor(pack);
  assert.doesNotMatch(html, /data-testid="nexora-advisor-readiness"/);
  const guidance = projectNexoraDecisionTheatreAdvisorGuidance(pack.theatre);
  assert.notEqual(guidance?.phase, "execution-readiness");
});

test("F — normal Object context does not fabricate workflow readiness", () => {
  for (const id of ["obj-capacity", "obj-customer", "obj-delivery"] as const) {
    const html = renderAdvisor(fixture(id));
    assert.match(html, /data-testid="nexora-advisor-situation"/);
    assert.doesNotMatch(html, /data-testid="nexora-advisor-readiness"/);
    assert.doesNotMatch(html, /Committed Decision · Execution not started/);
  }
});

test("RIGHT-OBJECT / Stage / conversation owners are unchanged", () => {
  const pack = fixture("ctx-scenario-demand", {
    sceneSemanticInput: compareInput(two),
    authoritativeDecisions: [committedDecision()],
    executionRuntimeAvailable: true,
  });
  const stage = renderToStaticMarkup(
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
  assert.match(stage, /data-testid="nexora-presentation-state-selector"/);
  assert.match(stage, /data-testid="nexora-subject-operation"/);
  const view = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/intelligence/NexoraAdvisorView.tsx"),
    "utf8",
  );
  assert.doesNotMatch(view, /createStore|new Advisor|Readiness tab/);
  const region = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/NexoraAdvisorInsightRegion.tsx"),
    "utf8",
  );
  assert.match(region, /data-testid="nexora-advisor-ask"/);
});
