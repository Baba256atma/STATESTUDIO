/**
 * MRA:3-RECERT-FIX2 — targeted deictic investigation subject fidelity.
 */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { toNexoraConversationContextSnapshot } from "../conversational-control/executiveContextProjection.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import {
  isInvestigationSelectionUtterance,
  isTargetedDeicticInvestigationUtterance,
  normalizeNexoraConversationalUtterance,
} from "../conversational-control/conversationalIntentNormalization.ts";
import type { NexoraConversationalAdvisorGrounding } from "../conversational-control/conversationalExperience.ts";
import {
  createNexoraPendingTurnExpectation,
  type NexoraPendingTurnExpectation,
} from "../conversational-control/conversationalTurnExpectation.ts";
import {
  csvImportCandidateId,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  suggestCsvColumnMappings,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "../data-reality/csvSemanticUnderstanding.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const T0 = "2026-09-10T23:30:00.000Z";
const ambiguous = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";
const MARGIN = /Margin Pressure/i;
const LEAK =
  /\b(?:NCA(?::|-)|NXA(?::|-)|ECA(?::|-)|CC:\d|deictic|referent|composition subject)\b/i;

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function overview() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

const liveLikeGrounding: NexoraConversationalAdvisorGrounding = Object.freeze({
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

function run(
  utterance: string,
  previous?: Turn,
  extras?: {
    readonly advisorGrounding?: NexoraConversationalAdvisorGrounding | null;
    readonly pendingTurnExpectation?: NexoraPendingTurnExpectation | null;
  },
): Turn {
  const executiveContext = previous?.nextExecutiveContext;
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: executiveContext
      ? toNexoraConversationContextSnapshot(executiveContext)
      : previous?.nextConversationContext,
    executiveContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? overview(),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    allowActiveStageContext: false,
    lastAppliedCommandId: previous?.commandResult?.command?.commandId ?? null,
    advisorGrounding: extras?.advisorGrounding ?? liveLikeGrounding,
    pendingTurnExpectation: extras?.pendingTurnExpectation,
    attentionNowMs: 1_725_000_000_000,
    messageIdSeed: `mra-3-recert-fix2-${utterance}`,
  });
}

function seedUniqueCsv(fileName: string) {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: ambiguous.length,
    csvText: ambiguous,
    importId: `mra-3-recert-fix2:${fileName}`,
    importedAt: T0,
  });
  const parse = parseCsvDeterministically(ambiguous);
  saveCsvImportCandidate(Object.freeze({
    workspaceId: "overview",
    candidateId: csvImportCandidateId("overview", fileName),
    fileName,
    status: "preview",
    input,
    parse,
    mapping: interpretCsvSemantics({
      input,
      parse,
      structural: suggestCsvColumnMappings(parse.columns, input.importId),
    }),
    prepared: null,
    error: null,
    replacementSourceContextId: null,
  }));
}

function assertDemandSurge(turn: Turn) {
  assert.match(turn.response, /Demand Surge/i);
  assert.doesNotMatch(turn.response, /^Margin Pressure needs urgent attention/i);
  assert.doesNotMatch(turn.response, /Prioritize Margin Pressure/i);
  assert.doesNotMatch(turn.response, LEAK);
  assert.equal(
    turn.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
    "ctx-scenario-demand",
  );
}

afterEach(() => {
  resetCsvRealDataImportStoreForTests();
});

describe("MRA:3-RECERT-FIX2 targeted investigation fidelity", () => {
  it("investigate it is not a FOCUS navigation of a deictic token", () => {
    const intent = resolveNexoraConversationalIntent({ utterance: "investigate it" });
    assert.notEqual(intent.intent.kind, "focus");
    const named = resolveNexoraConversationalIntent({
      utterance: "Investigate Margin Pressure",
    });
    assert.equal(named.intent.kind, "focus");
    assert.equal(
      isTargetedDeicticInvestigationUtterance(
        normalizeNexoraConversationalUtterance("investigate it"),
      ),
      true,
    );
    assert.equal(
      isInvestigationSelectionUtterance(
        normalizeNexoraConversationalUtterance("What should I investigate?"),
      ),
      true,
    );
    assert.equal(
      isInvestigationSelectionUtterance(
        normalizeNexoraConversationalUtterance("investigate it"),
      ),
      false,
    );
  });

  it("A: Demand Surge then investigate it stays Demand Surge", () => {
    const focused = run("Demand Surge");
    const investigated = run("investigate it", focused, {
      advisorGrounding: {
        ...liveLikeGrounding,
        isOverview: false,
        currentSubjectId: "ctx-scenario-demand",
        currentSubjectLabel: "Demand Surge",
        situation: "Demand Surge explores volume upside with delivery risk.",
        whyItMatters: "Demand Surge is associated with Delivery.",
        recommendation: "Investigate further before committing to a course of action",
        primaryActionLabel: "Investigate Demand Surge",
      },
    });
    assertDemandSurge(investigated);
    assert.equal(investigated.trace.experienceLane, "explain");
  });

  it("live-like pending attention review cannot capture investigate it", () => {
    const focused = run("Demand Surge");
    const investigated = run("investigate it", focused, {
      pendingTurnExpectation: createNexoraPendingTurnExpectation({
        expectationId: "live-attention-review",
        questionKind: "review-subject",
        expectedAnswerKind: "confirmation",
        subjectId: "ctx-problem-margin",
        sourceCapability: "CC:5",
        confirmationLevel: "review",
      }),
    });
    assertDemandSurge(investigated);
  });

  it("B: look deeper into it stays Demand Surge", () => {
    assertDemandSurge(run("look deeper into it", run("Demand Surge")));
  });

  it("C: what else do we know about it stays Demand Surge", () => {
    assertDemandSurge(run("what else do we know about it?", run("Demand Surge")));
  });

  it("D–F: evidence / importance / missing keep Demand Surge continuity", () => {
    const focused = run("Demand Surge");
    const evidence = run("what evidence do we have about it?", focused);
    assert.equal(
      evidence.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "ctx-scenario-demand",
    );
    assert.doesNotMatch(evidence.response, /Prioritize Margin Pressure/i);
    const important = run("why is it important?", focused);
    assert.equal(
      important.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "ctx-scenario-demand",
    );
    assert.doesNotMatch(important.response, /Prioritize Margin Pressure/i);
    const missing = run("what are we missing about it?", focused);
    assert.equal(
      missing.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "ctx-scenario-demand",
    );
    assert.doesNotMatch(missing.response, /Prioritize Margin Pressure/i);
  });

  it("preserve explain / tell me more / how-sure / impact", () => {
    const focused = run("Demand Surge");
    assertDemandSurge(run("explain it", focused));
    assertDemandSurge(run("tell me more about it", focused));
    const sure = run("how sure are you?", run("explain it", focused));
    assert.equal(
      sure.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "ctx-scenario-demand",
    );
    assert.doesNotMatch(sure.response, /Prioritize Margin Pressure/i);
    const impact = run("what impact could it have?", run("explain it", focused));
    assert.equal(
      impact.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "ctx-scenario-demand",
    );
    assert.doesNotMatch(impact.response, /Prioritize Margin Pressure/i);
  });

  it("explicit Investigate Capacity Expansion Plan / Margin Pressure still changes subject", () => {
    const expansion = run("Investigate Capacity Expansion Plan.", run("Demand Surge"));
    assert.match(expansion.response, /Capacity Expansion Plan/i);
    const margin = run("Investigate Margin Pressure.", run("Demand Surge"));
    assert.match(margin.response, MARGIN);
  });

  it("cross-object investigate it keeps the named subject", () => {
    assert.match(run("investigate it", run("Capacity Gap")).response, /Capacity Gap/i);
    assert.doesNotMatch(run("investigate it", run("Capacity Gap")).response, /Prioritize Margin Pressure/i);
    const kpi = run("look deeper into it", run("look at Capacity"));
    assert.match(kpi.response, /Capacity/i);
    const risk = run("what else do we know about it?", run("Risk"));
    assert.match(risk.response, /Risk/i);
  });

  it("CSV then Capacity Gap then investigate it stays Capacity Gap", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const investigated = run(
      "investigate it",
      run("explain it", run("Capacity Gap", run("is there any CSV files?", run("show me scenarios")))),
    );
    assert.match(investigated.response, /Capacity Gap/i);
    assert.doesNotMatch(investigated.response, /Prioritize Margin Pressure/i);
  });

  it("selection utterance without a deictic referent may still use attention", () => {
    const choose = run("What should I investigate?");
    assert.match(
      choose.response,
      /Margin Pressure|Capacity Gap|investigate|attention|look at first|Which item|which one|enough evidence/i,
    );
  });

  it("ambiguous investigate it without a subject clarifies instead of promoting attention", () => {
    const clarify = run("investigate it");
    assert.notEqual(
      clarify.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "ctx-problem-margin",
    );
    assert.doesNotMatch(clarify.response, /Prioritize Margin Pressure/i);
  });
});
