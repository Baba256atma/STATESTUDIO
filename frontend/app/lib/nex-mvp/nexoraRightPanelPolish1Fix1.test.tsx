/** NPA-T RIGHT-PANEL-POLISH:1-FIX1 — one Next Best Action; quieter lower Advisor. */

import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraAdvisorInsightRegion } from "@/app/executive/nex-mvp/NexoraAdvisorInsightRegion.tsx";
import {
  emptyNexoraDecisionTheatreSceneSemanticInput,
  projectNexoraDecisionTheatreAdvisorGuidance,
  projectNexoraDecisionTheatreFoundation,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const two = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;

function fixture(
  subjectId: string | null,
  extra?: Omit<Parameters<typeof projectNexoraDecisionTheatreFoundation>[0], "stageState">,
) {
  const selected =
    subjectId == null
      ? createInitialNexoraMVPObjectInteractionState({
          workspace: "overview",
          presentationState: "operation",
          environmentIntent: "neutral",
        })
      : selectNexoraMVPInteractionSubject(
          createInitialNexoraMVPObjectInteractionState({
            workspace: "overview",
            presentationState: "operation",
            environmentIntent: "neutral",
          }),
          subjectId,
          catalog,
        );
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
  return {
    state: selected,
    theatre,
    advisorBridge: buildNexoraMVPAdvisorContextBridge(selected, interaction),
    presentationViewModel: deriveNexoraMVPPresentationViewModel({
      presentationState: selected.presentationState,
      workspace: selected.workspace,
      environmentIntent: selected.environmentIntent,
      subjectId: subject?.id ?? null,
      subjectKind: subject?.kind ?? null,
      subjectLabel: subject?.label ?? null,
    }),
  };
}

function renderAdvisor(
  pack: ReturnType<typeof fixture>,
  extra?: { conversationalMessages?: readonly { id: string; role: "manager" | "nexora"; text: string }[] },
) {
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
      onSubmitConversationalUtterance: () => undefined,
      conversationalMessages: extra?.conversationalMessages ?? [],
    }),
  );
}

function readinessFixture(subjectId: string | null = null) {
  return fixture(subjectId, {
    sceneSemanticInput: emptyNexoraDecisionTheatreSceneSemanticInput({
      canonicalSemanticResultRef: `compare:${two.join(",")}`,
      canonicalOperation: "COMPARE",
      conversationIntentKind: "compare-scenarios",
      comparison: Object.freeze({
        active: true,
        memberIds: Object.freeze([...two]),
        criterion: "COST",
        criterionAmbiguous: false,
        criterionResolution: null,
      }),
    }),
    authoritativeDecisions: [
      Object.freeze({
        decisionId: "cc10:decision:ctx-scenario-demand",
        title: "Demand Surge",
        status: "Approved",
        scenarioId: "ctx-scenario-demand",
        committedBy: "manager" as const,
      }),
    ],
    executionRuntimeAvailable: true,
  });
}

test("FIX1 — Next Best Action uses only the primary DTH next-step field", () => {
  const pack = readinessFixture();
  const copy = pack.theatre.executionReadiness?.advisorReadable;
  assert.ok(copy);
  const guidance = projectNexoraDecisionTheatreAdvisorGuidance(pack.theatre);
  assert.equal(guidance?.recommendation, copy.whatHappensNext);
  assert.notEqual(guidance?.recommendation, `${copy.whatHappensNext} ${copy.startBoundary}`);
  assert.match(copy.startBoundary, /explicit start|has not been started/i);
  const html = renderAdvisor(pack);
  const primary =
    html.match(
      /data-testid="nexora-advisor-recommendation-primary"[^>]*>([^<]+)</,
    )?.[1] ?? "";
  assert.equal(primary, copy.whatHappensNext);
  assert.doesNotMatch(primary, /Viewing this scene does not start execution/i);
  assert.doesNotMatch(primary, /Starting work requires an explicit start/i);
  assert.match(html, /data-testid="nexora-advisor-readiness-owner"/);
  assert.match(html, /Not established/);
  assert.match(html, /not the same as a blocker/i);
  assert.doesNotMatch(html, /data-testid="nexora-advisor-evidence"/);
  assert.doesNotMatch(html, /data-testid="nexora-advisor-recent-change"/);
  assert.doesNotMatch(html, /data-testid="nexora-advisor-actions"/);
});

test("FIX1 — workflow guidance keeps Investigation Priority and Needs Attention secondary", () => {
  const html = renderAdvisor(readinessFixture());
  assert.match(html, /data-testid="nexora-advisor-top-priority"[^>]*data-advisor-weight="secondary"/);
  assert.match(html, /data-testid="nexora-advisor-attention"[^>]*data-advisor-weight="secondary"/);
});

test("FIX1 — conversation history is marked as history, Ask Nexora remains", () => {
  const overview = renderAdvisor(fixture(null));
  const readiness = renderAdvisor(readinessFixture(), {
    conversationalMessages: [
      { id: "m1", role: "manager", text: "Compare them." },
      { id: "m2", role: "nexora", text: "Demand Surge is approved." },
    ],
  });
  assert.match(overview, /data-testid="nexora-advisor-ask"/);
  assert.match(readiness, /data-testid="nexora-advisor-ask"/);
  assert.match(readiness, /data-advisor-history="true"/);
  assert.doesNotMatch(overview, /data-testid="nexora-advisor-readiness"/);
});

test("FIX1 — normal Object context does not fabricate Next Best Action from DTH:9", () => {
  const html = renderAdvisor(fixture("obj-capacity"));
  assert.doesNotMatch(html, /Committed Decision · Execution not started/);
  assert.doesNotMatch(html, /data-testid="nexora-advisor-readiness"/);
});
