/**
 * MRA:3-FINAL-FIX1 — isolated CC:5 referent parity (Tests A–G).
 * Live /executive must preserve the same transitions. No phrase-specific patches.
 */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { toNexoraConversationContextSnapshot } from "../conversational-control/executiveContextProjection.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { activateManagerObjectFromClick } from "../manager-object/managerObjectActive.ts";
import { syncNexoraExecutiveContextFromRuntimeState } from "../nex-mvp/nexoraMVPExecutiveContextAwareness.ts";
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
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const T0 = "2026-09-10T22:00:00.000Z";
const ambiguous = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function overview() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  previous?: Turn,
  overlay?: {
    readonly executiveContext?: Turn["nextExecutiveContext"];
    readonly runtimeState?: Turn["nextRuntimeState"];
    readonly previousManagerObjectSession?: Turn["managerObjectTurn"]["session"];
    readonly previousUtterance?: string | null;
    readonly lastAppliedCommandId?: string | null;
  },
): Turn {
  const executiveContext = overlay?.executiveContext ?? previous?.nextExecutiveContext;
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: executiveContext
      ? toNexoraConversationContextSnapshot(executiveContext)
      : previous?.nextConversationContext,
    executiveContext,
    executiveSubjects: subjects,
    runtimeState: overlay?.runtimeState ?? previous?.nextRuntimeState ?? overview(),
    catalog,
    previousManagerObjectSession:
      overlay?.previousManagerObjectSession ?? previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    allowActiveStageContext: false,
    previousUtterance: overlay?.previousUtterance,
    lastAppliedCommandId: overlay?.lastAppliedCommandId,
    messageIdSeed: `mra-3-final-fix1-${utterance}`,
  });
}

function seedUniqueCsv(fileName: string) {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: ambiguous.length,
    csvText: ambiguous,
    importId: `mra-3-final-fix1:${fileName}`,
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

describe("MRA:3-FINAL-FIX1 isolated/live referent parity (CC:5)", () => {
  it("Test A: Scenarios → CSV → Capacity Gap → explain it is Capacity Gap", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const scenarios = run("show me scenarios");
    const csv = run("is there any CSV files?", scenarios);
    assert.equal(csv.managerObjectTurn.session.conversationContinuity?.activeSubjectKind, "data");
    const named = run("Capacity Gap", csv);
    assert.equal(named.contextualManagerMeaning.objectReference?.canonicalName, "Capacity Gap");
    assert.equal(named.managerObjectTurn.session.conversationContinuity?.activeSubjectKind, "problem");
    const explained = run("explain it.", named);
    assert.equal(explained.intentResult.intent.kind, "explain");
    assert.match(explained.response, /Capacity Gap/i);
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan explores/i);
  });

  it("Test B: Scenarios → CSV → Margin Pressure → explain it is Margin Pressure", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const csv = run("is there any CSV files?", run("show me scenarios"));
    const named = run("Margin Pressure", csv);
    const explained = run("explain it.", named);
    assert.match(explained.response, /Margin Pressure/i);
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan explores/i);
  });

  it("Test C: CSV → KPI → explain it is the KPI", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const csv = run("is there any CSV files?");
    const kpi = run("look at Capacity", csv);
    assert.equal(kpi.contextualManagerMeaning.objectReference?.canonicalName, "Capacity");
    const explained = run("explain it.", kpi);
    assert.match(explained.response, /Capacity/i);
    assert.doesNotMatch(explained.response, /data-ux3-ambiguous\.csv is under review/i);
  });

  it("Test D: Problem → Scenario → explain it is the Scenario", () => {
    const problem = run("Capacity Gap");
    const scenario = run("Demand Surge", problem);
    const explained = run("explain it.", scenario);
    assert.match(explained.response, /Demand Surge/i);
    assert.doesNotMatch(explained.response, /^Capacity Gap/i);
  });

  it("Test E: Scenario → CSV inventory → explain it is the CSV (FIX2-FIX1)", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const csv = run("is there any CSV files?", run("show me scenarios"));
    const explained = run("explain it.", csv);
    assert.match(explained.response, /data-ux3-ambiguous\.csv/i);
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan explores/i);
  });

  it("Test F: Decision → Execution → explain it is the Execution", () => {
    const decision = run("Expand Capacity");
    const execution = run("Capacity Expansion", decision);
    const explained = run("explain it.", execution);
    assert.match(explained.response, /Capacity Expansion/i);
  });

  it("Stage click does not keep an older Stage object after the manager re-names Capacity Gap", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const named = run("Capacity Gap", run("is there any CSV files?", run("show me scenarios")));
    const clickedState = selectNexoraMVPInteractionSubject(
      named.nextRuntimeState,
      "obj-revenue",
      catalog,
    );
    const synced = syncNexoraExecutiveContextFromRuntimeState({
      previousContext: named.nextExecutiveContext,
      nextState: clickedState,
      syncSource: "runtime",
      executiveSubjects: subjects,
      catalog,
    });
    const clickedSession = activateManagerObjectFromClick(
      named.managerObjectTurn.session,
      clickedState.focusedSubject?.id ?? "obj-revenue",
    );
    const restored = run("look at Capacity Gap", named, {
      executiveContext: synced.nextContext,
      runtimeState: clickedState,
      previousManagerObjectSession: clickedSession,
      previousUtterance: "Capacity Gap",
      lastAppliedCommandId: named.commandResult?.command?.commandId ?? null,
    });
    assert.match(restored.response, /Capacity Gap/i);
    assert.notEqual(restored.nextRuntimeState.focusedSubject?.id, "obj-revenue");
    const explained = run("explain it.", restored);
    assert.equal(explained.intentResult.intent.kind, "explain");
    assert.equal(
      explained.managerObjectTurn.session.conversationContinuity?.activeSubjectKind,
      "problem",
    );
    assert.match(explained.response, /Capacity Gap/i);
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan explores/i);
    assert.doesNotMatch(explained.response, /Revenue is improving/i);
    assert.equal(explained.trace.compositionSelectedSubjectKind, "problem");
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan explores/i);
  });

  it("Test G: CSV → Problem → HELP → ambiguous it clarifies", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const csv = run("is there any CSV files?");
    const named = run("Capacity Gap", csv);
    const help = run("what can Nexora do?", named);
    const ambiguousIt = run("explain it.", help);
    assert.equal(ambiguousIt.clarificationTurn.action, "clarify");
  });
});
