/**
 * NPA-T POST-ECA:3 — Data Library conversation integration.
 * Reuses DATA-ADV:1. Does not start ECA:13 or POST-ECA:4.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  commitPreparedCsvRealDataImport,
  csvImportCandidateId,
  exportCsvRealDataImportState,
  hydrateCsvRealDataImportState,
  removeCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "../data-reality/csvSemanticUnderstanding.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { answerAdvisorDataInquiry } from "../manager-object/nexoraAdvisorDataInquiry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { judgeEcaExecutiveDialogueStrategy, nextEcaDialogueStrategySession } from "./ecaExecutiveDialogueStrategy.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import { composeEcaWorkingConversationContext, type EcaStageContext } from "./ecaWorkingConversationContext.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const T0 = "2026-09-08T20:00:00.000Z";
const ambiguous = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";
const ready = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";

const GENERIC = /couldn't find a clear match/i;
const OUTCOME = /which business outcome/i;
const PRODUCT = /executive decision workspace/i;

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function overview() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(utterance: string, previous?: Turn, runtimeState = previous?.nextRuntimeState ?? overview()): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState,
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `post-eca-3-${utterance}`,
  });
}

function mappingFor(fileName: string, csvText: string) {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: csvText.length,
    csvText,
    importId: `post-eca-3:${fileName}`,
    importedAt: T0,
  });
  const parse = parseCsvDeterministically(csvText);
  return interpretCsvSemantics({ input, parse, structural: suggestCsvColumnMappings(parse.columns, input.importId) });
}

function savePending(fileName: string, csvText: string) {
  saveCsvImportCandidate(Object.freeze({
    workspaceId: "overview",
    candidateId: csvImportCandidateId("overview", fileName),
    fileName,
    status: "preview",
    input: Object.freeze({
      workspaceId: "overview" as const,
      fileName,
      fileSize: csvText.length,
      csvText,
      importId: `post-eca-3:${fileName}`,
      importedAt: T0,
    }),
    parse: parseCsvDeterministically(csvText),
    mapping: mappingFor(fileName, csvText),
    prepared: null,
    error: null,
    replacementSourceContextId: null,
  }));
}

function commitReady(fileName: string, csvText = ready) {
  const prepared = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName,
    fileSize: csvText.length,
    csvText,
    importId: `post-eca-3-ready:${fileName}`,
    importedAt: T0,
  });
  assert.equal(prepared.ready, true);
  commitPreparedCsvRealDataImport({ prepared, expectedWorkspaceId: "overview", mode: "new", committedAt: T0 });
}

function emptyStage(): EcaStageContext {
  return Object.freeze({
    available: true,
    workspace: "overview",
    focus: null,
    selected: null,
    visible: Object.freeze([]),
    collection: null,
    theatreSceneId: null,
  });
}

describe("POST-ECA:3 Data Library conversation", () => {
  it("A — explain all CSV files uses Data Library, not generic match", () => {
    resetCsvRealDataImportStoreForTests();
    savePending("operations.csv", ambiguous);
    commitReady("delivery.csv");
    const direct = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "explain all CSV files you have" });
    assert.ok(direct?.text);
    assert.match(direct.text, /operations\.csv|delivery\.csv/i);
    const turn = run("explain all CSV files you have");
    assert.doesNotMatch(turn.response, GENERIC);
    assert.match(turn.response, /operations\.csv/i);
    assert.match(turn.response, /delivery\.csv/i);
    assert.equal(turn.shouldCommitRuntime, false);
  });

  it("B — explian Data is not an entity-match failure", () => {
    resetCsvRealDataImportStoreForTests();
    const turn = run("explian Data ?");
    assert.doesNotMatch(turn.response, GENERIC);
    assert.match(turn.response, /Data is where Nexora keeps/i);
  });

  it("C — explain Data source is a concept answer", () => {
    resetCsvRealDataImportStoreForTests();
    const turn = run("explain Data source ?");
    assert.doesNotMatch(turn.response, GENERIC);
    assert.match(turn.response, /Data Source is where Nexora receives/i);
  });

  it("D — CSV availability does not ask for an Outcome", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("orders.csv");
    const turn = run("do you have any file like CSV ?");
    assert.doesNotMatch(turn.response, OUTCOME);
    assert.match(turn.response, /orders\.csv/i);
  });

  it("E — empty library", () => {
    resetCsvRealDataImportStoreForTests();
    const turn = run("Do you have any CSV files?");
    assert.match(turn.response, /No CSV/i);
    assert.doesNotMatch(turn.response, /operations\.csv|delivery\.csv|capacity\.csv|orders\.csv/i);
  });

  it("F — multiple sources list actual names only", () => {
    resetCsvRealDataImportStoreForTests();
    savePending("alpha.csv", ambiguous);
    commitReady("beta.csv");
    const text = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "What CSV files do you have?" })?.text ?? "";
    assert.match(text, /alpha\.csv/i);
    assert.match(text, /beta\.csv/i);
    assert.doesNotMatch(text, /delivery\.csv|capacity\.csv/i);
  });

  it("G — pending is not accepted evidence", () => {
    resetCsvRealDataImportStoreForTests();
    savePending("new.csv", ambiguous);
    const text = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "Do you have my new file? Explain new.csv." })?.text
      ?? answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "Explain new.csv." })?.text
      ?? "";
    assert.match(text, /new\.csv/i);
    assert.match(text, /under review|pending|not accepted/i);
  });

  it("H — multiple pending", () => {
    resetCsvRealDataImportStoreForTests();
    savePending("one.csv", ambiguous);
    savePending("two.csv", ambiguous);
    const text = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "Which files are waiting for review?" })?.text ?? "";
    assert.match(text, /one\.csv/i);
    assert.match(text, /two\.csv/i);
  });

  it("I/J — specific source vs unknown", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("delivery.csv");
    const known = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "Explain delivery.csv." });
    assert.match(known?.text ?? "", /delivery\.csv/i);
    const unknown = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "Explain fake.csv." });
    assert.match(unknown?.text ?? "", /don't currently have a source named fake\.csv/i);
  });

  it("K — source pronoun binds the second listed file", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("first.csv");
    commitReady("second.csv");
    const list = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "What CSV files do you have?" });
    assert.match(list?.text ?? "", /first\.csv/i);
    assert.match(list?.text ?? "", /second\.csv/i);
    const follow = answerAdvisorDataInquiry({
      workspaceId: "overview",
      utterance: "Explain the second one.",
      dialogue: list?.dialogue,
    });
    const names = list?.diagnostics?.resolvedSourceNames ?? [];
    assert.equal(names.length >= 2, true);
    assert.match(follow?.text ?? "", new RegExp((names[1] ?? "").replace(".", "\\.")));
  });

  it("L — Stage focus does not block CSV inventory", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("library.csv");
    const focused = run("Focus on Risk.");
    const inventory = run("do you have any file like CSV ?", focused);
    assert.match(inventory.response, /library\.csv/i);
    assert.doesNotMatch(inventory.response, OUTCOME);
    assert.equal(inventory.nextRuntimeState.focusedSubject?.id, focused.nextRuntimeState.focusedSubject?.id);
  });

  it("M/N — provenance vs inventory", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("capacity.csv");
    const focused = run("Focus on Risk.");
    const using = run("What data is this using?", focused);
    assert.doesNotMatch(using.response, /You currently have \d+ CSV/i);
    const have = run("What data do you have?", focused);
    assert.match(have.response, /capacity\.csv/i);
    assert.doesNotMatch(have.response, PRODUCT);
  });

  it("O — ECA:4 existing-data bridge", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("margin.csv");
    const need = run("What do you need to investigate Margin Pressure?");
    const have = run("Do we already have that data?", need);
    assert.doesNotMatch(have.response, OUTCOME);
    assert.doesNotMatch(have.response, GENERIC);
  });

  it("P — CAP_AV stays unconfirmed", () => {
    resetCsvRealDataImportStoreForTests();
    savePending("capacity.csv", ambiguous);
    const field = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "What does CAP_AV mean?" });
    assert.match(field?.text ?? "", /has not been confirmed|don't have enough information|may mean|neither meaning is confirmed/i);
    assert.ok(field?.clarification);
  });

  it("Q — removed source is not active", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("capacity.csv");
    const sourceId = csvImportCandidateId("overview", "capacity.csv");
    const removed = removeCsvRealDataImport({
      workspaceId: "overview",
      sourceContextId: sourceId,
      activeSourceContextId: null,
      removedAt: T0,
    });
    assert.equal(removed.removed, true);
    const still = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "Do you still use capacity.csv?" });
    assert.match(still?.text ?? "", /no longer active|removed/i);
    assert.doesNotMatch(still?.text ?? "", /currently in use/i);
  });

  it("R — refresh matches restored library", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("restored.csv");
    const snapshot = exportCsvRealDataImportState();
    resetCsvRealDataImportStoreForTests();
    hydrateCsvRealDataImportState(snapshot);
    const text = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "What CSV files do you have?" })?.text ?? "";
    assert.match(text, /restored\.csv/i);
  });

  it("S — library existence is not Stage visibility", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("hidden.csv");
    const stage = run("what is on the stage?");
    assert.doesNotMatch(stage.response, /hidden\.csv/i);
    const files = run("What CSV files do you have?", stage);
    assert.match(files.response, /hidden\.csv/i);
  });

  it("T — read questions write nothing", () => {
    resetCsvRealDataImportStoreForTests();
    savePending("pending.csv", ambiguous);
    commitReady("ready.csv");
    const before = exportCsvRealDataImportState();
    const start = overview();
    const turn = run("explain all CSV files you have");
    assert.deepEqual(exportCsvRealDataImportState(), before);
    assert.deepEqual(turn.nextRuntimeState, start);
    assert.equal(turn.shouldCommitRuntime, false);
  });

  it("Sequence 1 — Stage then CSV", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("ops.csv");
    const stage = run("what is on the stage?");
    const csv = run("explain all CSV files you have.", stage);
    assert.match(csv.response, /ops\.csv/i);
    assert.doesNotMatch(csv.response, GENERIC);
  });

  it("Sequence 2 — list then second file", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("a.csv");
    commitReady("b.csv");
    const list = run("What CSV files do you have?");
    assert.match(list.response, /a\.csv|b\.csv/i);
    const second = run("Explain the second one.", list);
    assert.doesNotMatch(second.response, GENERIC);
    assert.match(second.response, /a\.csv|b\.csv/i);
  });

  it("Sequence 6 — objective continuity after CSV side question", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("ops.csv");
    const investigate = run("Investigate Risk.");
    const csv = run("What CSV files do you have?", investigate);
    assert.match(csv.response, /ops\.csv/i);
    const resume = run("Okay, continue with Risk.", csv);
    assert.doesNotMatch(resume.response, GENERIC);
    const subjectsForEca = Object.freeze(subjects.map((subject) => Object.freeze({
      id: subject.subjectId,
      label: subject.canonicalName,
      kind: subject.subjectKind,
    })));
    const working = composeEcaWorkingConversationContext({
      utterance: "Investigate Risk.",
      meaning: null,
      stage: emptyStage(),
      subjects: subjectsForEca,
    });
    const start = judgeEcaExecutiveDialogueStrategy({
      utterance: "Investigate Risk.",
      workingContext: working,
      actionPlan: planEcaExecutiveConversationAction({ utterance: "Investigate Risk.", workingContext: working }),
    });
    const sideWorking = composeEcaWorkingConversationContext({
      utterance: "What CSV files do you have?",
      meaning: null,
      stage: emptyStage(),
      subjects: subjectsForEca,
    });
    const side = judgeEcaExecutiveDialogueStrategy({
      utterance: "What CSV files do you have?",
      workingContext: sideWorking,
      actionPlan: planEcaExecutiveConversationAction({ utterance: "What CSV files do you have?", workingContext: sideWorking }),
      session: nextEcaDialogueStrategySession(null, "Investigate Risk.", start),
    });
    assert.equal(side.relationshipToCurrentTurn, "SIDE_QUESTION");
  });
});
