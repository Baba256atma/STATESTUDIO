/** MRA:3-RECERT-FIX3-FIX1 — Manager–Object subject ownership parity. */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toNexoraConversationContextSnapshot } from "../conversational-control/executiveContextProjection.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import type { NexoraConversationalAdvisorGrounding } from "../conversational-control/conversationalExperience.ts";
import { freezeManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

const attentionGrounding: NexoraConversationalAdvisorGrounding = Object.freeze({
  isOverview: true,
  currentSubjectId: null,
  currentSubjectLabel: null,
  attentionSubjectId: "ctx-problem-margin",
  attentionSubjectLabel: "Margin Pressure",
  attentionReason: "Margin Pressure currently has the strongest validated attention signal.",
  situation: "There is no explicit subject. Nexora is showing the executive overview.",
  whyItMatters: null,
  recommendation: null,
  noRecommendationReason: null,
  primaryActionLabel: "Investigate Margin Pressure",
  evidenceState: "limited",
  evidenceSummary: "Evidence limited.",
  recommendationAuthority: "none",
});

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  previous?: Turn,
  previousSession = previous?.managerObjectTurn.session,
) {
  const executiveContext = previous?.nextExecutiveContext;
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: executiveContext
      ? toNexoraConversationContextSnapshot(executiveContext)
      : previous?.nextConversationContext,
    executiveContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? initialState(),
    catalog,
    previousManagerObjectSession: previousSession ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    allowActiveStageContext: false,
    lastAppliedCommandId: previous?.commandResult?.command?.commandId ?? null,
    advisorGrounding: attentionGrounding,
    attentionNowMs: 1_725_000_000_000,
    messageIdSeed: `mra-3-recert-fix3-fix1-${utterance}`,
  });
}

function investigate(subject: string) {
  const established = run(subject === "Risk" ? "Show me Risk" : subject);
  return run("investigate it", established);
}

describe("MRA:3-RECERT-FIX3-FIX1 Manager–Object parity", () => {
  it("A: canonical Risk outranks stale NCA Margin Pressure for a deictic investigation", () => {
    const risk = run("Show me Risk");
    assert.equal(
      risk.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "obj-risk",
    );
    const canonicalResult = run("investigate it", risk);
    assert.equal(
      canonicalResult.managerObjectTurn.session.conversationContinuity
        ?.activeSubjectId,
      "obj-risk",
    );
    assert.equal(
      canonicalResult.nextRuntimeState.focusedSubject?.id,
      "obj-risk",
    );
    assert.equal(canonicalResult.nxaAdvisorContract?.referentName, "Risk");
    assert.equal(canonicalResult.managerObjectTurn.session.activeObjectId, "obj-risk");
    assert.equal(canonicalResult.trace.compositionSelectedSubjectId, "obj-risk");

    const staleNcaSession = freezeManagerObjectSession({
      ...risk.managerObjectTurn.session,
      ncaConversationState: risk.managerObjectTurn.session.ncaConversationState
        ? Object.freeze({
            ...risk.managerObjectTurn.session.ncaConversationState,
            activeSubject: Object.freeze({
              id: "ctx-problem-margin",
              name: "Margin Pressure",
              kind: "problem",
            }),
          })
        : null,
    });

    const result = run("investigate it", risk, staleNcaSession);
    assert.equal(
      result.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "obj-risk",
    );
    assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-risk");
    assert.equal(result.managerObjectTurn.session.activeObjectId, "obj-risk");
    assert.equal(result.trace.compositionSelectedSubjectId, "obj-risk");
    assert.match(result.response, /Risk/i);
  });

  it("B: Demand Surge remains the Manager–Object subject", () => {
    assert.equal(
      investigate("Demand Surge").managerObjectTurn.session.activeObjectId,
      "ctx-scenario-demand",
    );
  });

  it("C: Capacity Gap remains the Manager–Object subject", () => {
    assert.equal(
      investigate("Capacity Gap").managerObjectTurn.session.activeObjectId,
      "ctx-problem-capacity",
    );
  });

  it("D: an explicit named investigation changes the Manager–Object subject", () => {
    const result = run("Investigate Margin Pressure", run("Demand Surge"));
    assert.equal(result.managerObjectTurn.session.activeObjectId, "ctx-problem-margin");
  });

  it("E: no established subject retains existing attention selection", () => {
    const result = run("What should I investigate?");
    assert.match(result.response, /investigat|attention|which item|enough evidence/i);
  });
});
