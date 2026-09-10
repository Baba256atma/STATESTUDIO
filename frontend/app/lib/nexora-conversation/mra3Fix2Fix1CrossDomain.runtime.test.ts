/**
 * MRA:3-FIX2-FIX1 — cross-domain referential continuity and assistant-introduced referents.
 * Extends FINAL:6.2 / DATA-ADV. Does not add a second reference resolver.
 */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

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
const T0 = "2026-09-10T18:00:00.000Z";
const ambiguous = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function overview() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(utterance: string, previous?: Turn): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? overview(),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `mra-3-fix2-fix1-${utterance}`,
  });
}

function seedUniqueCsv(fileName: string) {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: ambiguous.length,
    csvText: ambiguous,
    importId: `mra-3-fix2-fix1:${fileName}`,
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

afterEach(() => {
  resetCsvRealDataImportStoreForTests();
});

describe("MRA:3-FIX2-FIX1 cross-domain referential continuity", () => {
  it("Test A: Scenarios → CSV inventory → explain it resolves the CSV", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const scenarios = run("show me scenarios");
    assert.match(scenarios.response, /Capacity Expansion Plan/i);
    const csv = run("is there any CSV files?", scenarios);
    assert.match(csv.response, /data-ux3-ambiguous\.csv/i);
    assert.equal(
      csv.managerObjectTurn.session.conversationContinuity?.activeSubjectKind,
      "data",
    );
    const explained = run("explain it.", csv);
    assert.match(explained.response, /data-ux3-ambiguous\.csv/i);
    assert.match(explained.response, /Confirmed fields|Still unresolved|under review|pending/i);
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan/i);
  });

  it("Test B: CSV → Capacity Gap → explain it resolves the Problem", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const csv = run("is there any CSV files?");
    const named = run("Capacity Gap", csv);
    const explained = run("explain it.", named);
    assert.match(explained.response, /Capacity Gap/i);
    assert.doesNotMatch(explained.response, /data-ux3-ambiguous\.csv is under review/i);
  });

  it("Test C: Problem → Scenario → explain it resolves the Scenario", () => {
    const problem = run("Capacity Gap");
    const scenario = run("Demand Surge", problem);
    const explained = run("explain it.", scenario);
    assert.match(explained.response, /Demand Surge/i);
    assert.doesNotMatch(explained.response, /^Capacity Gap/i);
  });

  it("Test D: Scenario → KPI → explain it resolves Capacity", () => {
    const scenarios = run("show me scenarios");
    const kpi = run("look at Capacity", scenarios);
    assert.equal(
      kpi.contextualManagerMeaning.objectReference?.canonicalName,
      "Capacity",
    );
    const explained = run("explain it.", kpi);
    assert.match(explained.response, /Capacity/i);
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan/i);
  });

  it("Test E: unique CSV inventory → tell me more about it stays on the CSV", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const csv = run("is there any CSV files?");
    const more = run("tell me more about it", csv);
    assert.match(more.response, /data-ux3-ambiguous\.csv/i);
    assert.match(more.response, /Confirmed fields|Still unresolved|under review|pending/i);
  });

  it("Test F: CSV then unrelated question then it does not guess", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const scenarios = run("show me scenarios");
    const csv = run("is there any CSV files?", scenarios);
    const help = run("what can Nexora do?", csv);
    const ambiguousIt = run("explain it.", help);
    assert.equal(ambiguousIt.clarificationTurn.action, "clarify");
    assert.doesNotMatch(ambiguousIt.response, /Capacity Expansion Plan explores/i);
  });

  it("Decision then named Execution then explain it follows the newer referent", () => {
    const decision = run("Expand Capacity");
    const execution = run("Capacity Expansion", decision);
    const explained = run("explain it.", execution);
    assert.match(explained.response, /Capacity Expansion/i);
  });

  it("FIX2 first-problem then explain it still binds Capacity Gap", () => {
    const listed = run("show me problems");
    const named = run("Capacity Gap", listed);
    const other = run("Explain Delivery.", named);
    const back = run("go back to the first problem", other);
    const explained = run("Explain it", back);
    assert.match(explained.response, /Capacity Gap/i);
  });
});
