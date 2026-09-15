/**
 * MRA:3-RECERT-FIX1 — deictic follow-up referent-to-composition fidelity.
 */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { toNexoraConversationContextSnapshot } from "../conversational-control/executiveContextProjection.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
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
const T0 = "2026-09-10T23:00:00.000Z";
const ambiguous = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";
const EXPANSION = /Capacity Expansion Plan/i;

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function overview() {
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
    runtimeState: previous?.nextRuntimeState ?? overview(),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    allowActiveStageContext: false,
    lastAppliedCommandId: previous?.commandResult?.command?.commandId ?? null,
    messageIdSeed: `mra-3-recert-fix1-${utterance}`,
  });
}

function seedUniqueCsv(fileName: string) {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: ambiguous.length,
    csvText: ambiguous,
    importId: `mra-3-recert-fix1:${fileName}`,
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

function assertPrimarySubject(turn: Turn, name: RegExp, anti?: RegExp) {
  assert.match(turn.response, name);
  if (anti) assert.doesNotMatch(turn.response, anti);
}

afterEach(() => {
  resetCsvRealDataImportStoreForTests();
});

describe("MRA:3-RECERT-FIX1 deictic follow-up fidelity", () => {
  it("Test A: collection then Demand Surge then tell me more stays Demand Surge", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const focused = run(
      "Demand Surge",
      run(
        "explain it",
        run("Capacity Gap", run("is there any CSV files?", run("show me scenarios"))),
      ),
    );
    const more = run("tell me more about it", focused);
    assertPrimarySubject(more, /Demand Surge/i, /^Investigate Capacity Expansion Plan/i);
    assert.doesNotMatch(more.response, /Investigate Capacity Expansion Plan/i);
    assert.equal(
      more.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "ctx-scenario-demand",
    );
  });

  it("Test B: Capacity Expansion Plan then tell me more stays that Scenario", () => {
    const more = run("tell me more about it", run("Capacity Expansion Plan"));
    assertPrimarySubject(more, /Capacity Expansion Plan/i);
  });

  it("Test C: Pricing Response then tell me more stays Pricing Response", () => {
    const more = run("tell me more about it", run("Pricing Response"));
    assertPrimarySubject(more, /Pricing Response/i, EXPANSION);
  });

  it("Demand Surge operations keep the same subject", () => {
    const focused = run("Demand Surge");
    const explain = run("explain it", focused);
    assertPrimarySubject(explain, /Demand Surge/i, /^Investigate Capacity Expansion Plan/i);
    const more = run("tell me more about it", focused);
    assertPrimarySubject(more, /Demand Surge/i, /Investigate Capacity Expansion Plan/i);
    const investigate = run("investigate it", focused);
    assertPrimarySubject(investigate, /Demand Surge/i, /Investigate Capacity Expansion Plan/i);
    const deeper = run("look deeper into it", focused);
    assertPrimarySubject(deeper, /Demand Surge/i, /Investigate Capacity Expansion Plan/i);
    const elseKnown = run("what else do we know about it?", focused);
    assertPrimarySubject(elseKnown, /Demand Surge/i, /Investigate Capacity Expansion Plan/i);
    const sure = run("how sure are you?", explain);
    assert.equal(
      sure.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "ctx-scenario-demand",
    );
    assert.doesNotMatch(sure.response, /Investigate Capacity Expansion Plan/i);
    const why = run("why?", explain);
    assert.equal(
      why.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "ctx-scenario-demand",
    );
    assert.doesNotMatch(why.response, /Investigate Capacity Expansion Plan/i);
    const impact = run("what impact could it have?", explain);
    assert.equal(
      impact.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "ctx-scenario-demand",
    );
    assert.doesNotMatch(impact.response, /Investigate Capacity Expansion Plan/i);
  });

  it("explicit named follow-up outranks continuity", () => {
    const named = run(
      "Tell me more about Capacity Expansion Plan.",
      run("Demand Surge"),
    );
    assertPrimarySubject(named, /Capacity Expansion Plan/i);
    const gap = run("Investigate Capacity Gap.", run("Demand Surge"));
    assertPrimarySubject(gap, /Capacity Gap/i);
  });

  it("cross-object deictic follow-ups keep the named subject", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const problem = run("tell me more about it", run("Capacity Gap"));
    assertPrimarySubject(problem, /Capacity Gap/i, EXPANSION);
    const kpi = run("tell me more about it", run("look at Capacity"));
    assertPrimarySubject(kpi, /Capacity/i, EXPANSION);
    const risk = run("investigate it", run("Risk"));
    assertPrimarySubject(risk, /Risk/i, EXPANSION);
    const decision = run(
      "explain it",
      run("Approve Repricing", run("show me scenarios")),
    );
    assertPrimarySubject(decision, /Approve Repricing/i, EXPANSION);
    const decisionMore = run("tell me more about it", decision);
    assert.equal(
      decisionMore.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "ctx-decision-reprice",
    );
    assert.doesNotMatch(decisionMore.response, /Investigate Capacity Expansion Plan/i);
    const execution = run(
      "what else do we know about it?",
      run("Pricing Rollout"),
    );
    assert.equal(
      execution.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "ctx-execution-rollout",
    );
    assert.doesNotMatch(execution.response, /Investigate Capacity Expansion Plan/i);
    const csv = run("tell me more about it", run("is there any CSV files?"));
    assert.match(csv.response, /data-ux3-ambiguous\.csv/i);
    assert.doesNotMatch(csv.response, /Investigate Capacity Expansion Plan/i);
  });

  it("historical CSV then Problem explain it is unchanged", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const explained = run(
      "explain it",
      run("Capacity Gap", run("is there any CSV files?", run("show me scenarios"))),
    );
    assert.match(explained.response, /Capacity Gap/i);
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan explores/i);
  });

  it("unrelated interruption then it clarifies instead of guessing a Scenario", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const help = run(
      "what can Nexora do?",
      run("is there any CSV files?", run("show me scenarios")),
    );
    const ambiguousIt = run("tell me more about it", help);
    assert.equal(ambiguousIt.clarificationTurn.action, "clarify");
    assert.doesNotMatch(ambiguousIt.response, /Investigate Capacity Expansion Plan/i);
  });
});
