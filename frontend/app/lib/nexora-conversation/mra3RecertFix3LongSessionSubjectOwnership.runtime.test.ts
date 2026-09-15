/** MRA:3-RECERT-FIX3 — stale collection/comparison primary eligibility. */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { toNexoraConversationContextSnapshot } from "../conversational-control/executiveContextProjection.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import type { NexoraConversationalAdvisorGrounding } from "../conversational-control/conversationalExperience.ts";
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
import { composeExecutiveInvestigationAnswer } from "../manager-object/executiveInvestigationComposer.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const csv = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";
const STALE_SCENARIO_SELECTION =
  /current scenario candidates|comparable investigation priority evidence for Capacity Expansion Plan/i;

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

function run(utterance: string, previous?: Turn): Turn {
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
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    allowActiveStageContext: false,
    lastAppliedCommandId: previous?.commandResult?.command?.commandId ?? null,
    advisorGrounding: attentionGrounding,
    attentionNowMs: 1_725_000_000_000,
    messageIdSeed: `mra-3-recert-fix3-${utterance}`,
  });
}

function chain(...utterances: string[]): Turn {
  let current: Turn | undefined;
  for (const utterance of utterances) current = run(utterance, current);
  return current!;
}

function assertSubject(turn: Turn, expected: RegExp, id?: string) {
  assert.match(turn.response, expected);
  assert.doesNotMatch(turn.response, STALE_SCENARIO_SELECTION);
  if (id) {
    assert.equal(
      turn.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      id,
    );
  }
}

function seedCsv() {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName: "fix3.csv",
    fileSize: csv.length,
    csvText: csv,
    importId: "mra-3-recert-fix3:csv",
    importedAt: "2026-09-11T18:00:00.000Z",
  });
  const parse = parseCsvDeterministically(csv);
  saveCsvImportCandidate(Object.freeze({
    workspaceId: "overview",
    candidateId: csvImportCandidateId("overview", input.fileName),
    fileName: input.fileName,
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

afterEach(() => resetCsvRealDataImportStoreForTests());

describe("MRA:3-RECERT-FIX3 long-session subject ownership", () => {
  it("A: Scenario collection → Demand Surge → investigate it", () => {
    assertSubject(chain("show me scenarios", "Demand Surge", "investigate it"), /Demand Surge/i, "ctx-scenario-demand");
  });

  it("B: Scenario collection → Demand Surge → tell me more", () => {
    assertSubject(chain("show me scenarios", "Demand Surge", "tell me more about it"), /Demand Surge/i, "ctx-scenario-demand");
  });

  it("B2: targeted investigation follow-ups keep Demand Surge after comparison history", () => {
    let turn = chain("show me scenarios", "which one has less risk?", "Demand Surge", "investigate it");
    turn = run("look deeper into it", turn);
    assertSubject(turn, /Demand Surge/i, "ctx-scenario-demand");
    turn = run("what else do we know about it?", turn);
    assertSubject(turn, /Demand Surge/i, "ctx-scenario-demand");
  });

  it("C: Scenario comparison → Demand Surge → investigate it", () => {
    assertSubject(chain("show me scenarios", "which one has less risk?", "Demand Surge", "investigate it"), /Demand Surge/i, "ctx-scenario-demand");
  });

  it("D: attention Margin Pressure → explicit Demand Surge → investigate it", () => {
    assertSubject(chain("What needs my attention first?", "Demand Surge", "investigate it"), /Demand Surge/i, "ctx-scenario-demand");
  });

  it("E: old Scenario recommendation → explicit Demand Surge → explain it", () => {
    assertSubject(chain("Capacity Expansion Plan", "What do you recommend?", "Demand Surge", "explain it"), /Demand Surge/i, "ctx-scenario-demand");
  });

  it("F: CSV → Capacity Gap → investigate it", () => {
    seedCsv();
    assertSubject(chain("is there any CSV files?", "Capacity Gap", "investigate it"), /Capacity Gap/i, "ctx-problem-capacity");
  });

  it("F2: explicit return exits stale comparison before Capacity Gap follow-ups", () => {
    let turn = chain(
      "show me scenarios",
      "which one has less risk?",
      "Okay, go back to Capacity Gap.",
      "explain it",
      "investigate it",
    );
    assertSubject(turn, /Capacity Gap/i, "ctx-problem-capacity");
    assert.equal(turn.nextRuntimeState.focusedSubject?.id, "ctx-problem-capacity");
  });

  it("G: Problem → KPI → tell me more", () => {
    assertSubject(chain("Capacity Gap", "look at Capacity", "tell me more about it"), /Capacity/i, "obj-capacity");
  });

  it("H: Problem → Risk → what else do we know", () => {
    assertSubject(chain("Margin Pressure", "show me Risk", "what else do we know about it?"), /Risk/i, "obj-risk");
  });

  it("H2: Risk remains primary through evidence, uncertainty, and investigation", () => {
    let turn = chain(
      "Margin Pressure",
      "show me Risk",
      "what evidence do we have?",
      "what don't we know?",
      "investigate it",
    );
    assertSubject(turn, /Risk/i, "obj-risk");
    assert.equal(turn.managerObjectTurn.session.activeObjectId, "obj-risk");
  });

  it("I: explicit named investigation changes subject", () => {
    assertSubject(chain("Demand Surge", "Investigate Margin Pressure"), /Margin Pressure/i, "ctx-problem-margin");
  });

  it("J: no subject investigation selection remains selection", () => {
    const selected = run("What should I investigate?");
    assert.match(selected.response, /investigat|attention|which item|enough evidence/i);
  });

  it("K: explicit comparison after single subject remains comparison", () => {
    const compared = chain("Demand Surge", "show me scenarios", "compare them");
    assert.match(compared.response, /compar|scenario|evidence/i);
  });

  it("L: collection ordinal after single subject changes subject", () => {
    const ordinal = chain("Capacity Gap", "show me scenarios", "explain the second one");
    assert.match(ordinal.response, /Demand Surge/i);
  });

  it("stale investigation thread becomes supporting-only after a newer focus", () => {
    const result = composeExecutiveInvestigationAnswer({
      utterance: "What don't we know?",
      ask: "unknowns",
      focusId: "obj-risk",
      thread: Object.freeze({
        question: "Why did this happen?",
        subjectId: "ctx-scenario-demand",
        subjectLabel: "Demand Surge",
        candidateIds: Object.freeze([]),
        observations: Object.freeze([]),
      }),
    });
    assert.equal(result.thread?.subjectId, "obj-risk");
    assert.match(result.answer, /Risk/i);
    assert.doesNotMatch(result.answer, /condition of Demand Surge/i);
  });
});
