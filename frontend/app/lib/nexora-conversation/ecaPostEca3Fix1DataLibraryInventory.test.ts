/**
 * NPA-T POST-ECA:3-FIX1 — Data Library inventory routing vs business-context hijack.
 * Reuses DATA-ADV:1. Does not start ECA:13, POST-ECA:4, or FIX2.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  commitPreparedCsvRealDataImport,
  csvImportCandidateId,
  exportCsvRealDataImportState,
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
import {
  answerAdvisorDataInquiry,
  classifyAdvisorDataConversation,
} from "../manager-object/nexoraAdvisorDataInquiry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { judgeEcaExecutiveDialogueStrategy, nextEcaDialogueStrategySession } from "./ecaExecutiveDialogueStrategy.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import { composeEcaWorkingConversationContext, type EcaStageContext } from "./ecaWorkingConversationContext.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const T0 = "2026-09-09T17:00:00.000Z";
const ambiguous = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";
const ready = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";
const BLOCKING =
  "Nexora, check your Data Library. How many CSV files are currently in this project? List all CSV file names and their current status.";

const GENERIC = /couldn't find a clear match/i;
const OUTCOME = /which business outcome/i;
const SCENARIO_HIJACK = /Capacity Expansion Plan/i;
const RECOMMEND_GAP = /Recommendation:\s*Review Capacity Gap/i;
const ATTENTION = /needs attention/i;

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
    messageIdSeed: `post-eca-3-fix1-${utterance}`,
  });
}

function mappingFor(fileName: string, csvText: string) {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: csvText.length,
    csvText,
    importId: `post-eca-3-fix1:${fileName}`,
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
      importId: `post-eca-3-fix1:${fileName}`,
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
    importId: `post-eca-3-fix1-ready:${fileName}`,
    importedAt: T0,
  });
  assert.equal(prepared.ready, true);
  commitPreparedCsvRealDataImport({ prepared, expectedWorkspaceId: "overview", mode: "new", committedAt: T0 });
}

function seedLibrary() {
  resetCsvRealDataImportStoreForTests();
  savePending("data-ux3-ambiguous.csv", ambiguous);
  commitReady("capacity.csv");
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

function assertInventory(text: string, names: readonly string[]) {
  assert.doesNotMatch(text, GENERIC);
  assert.doesNotMatch(text, OUTCOME);
  assert.doesNotMatch(text, SCENARIO_HIJACK);
  assert.doesNotMatch(text, RECOMMEND_GAP);
  assert.doesNotMatch(text, ATTENTION);
  for (const name of names) assert.match(text, new RegExp(name.replace(".", "\\.")));
}

describe("POST-ECA:3-FIX1 Data Library inventory routing", () => {
  it("A — exact blocking query uses Data Library census, not Scenario", () => {
    seedLibrary();
    assert.equal(classifyAdvisorDataConversation(BLOCKING), "inventory");
    const direct = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: BLOCKING });
    assert.ok(direct?.text);
    assert.match(direct.text, /There are 2 CSV files in the current Data Library/i);
    assert.match(direct.text, /capacity\.csv — in use/i);
    assert.match(direct.text, /data-ux3-ambiguous\.csv — pending review/i);
    assert.equal(direct.diagnostics?.advisorDataRoute, "DATA-ADV:1/AdvisorDataInquiry");
    const turn = run(BLOCKING);
    assertInventory(turn.response, ["capacity.csv", "data-ux3-ambiguous.csv"]);
    assert.match(turn.response, /in use/i);
    assert.match(turn.response, /pending review/i);
    assert.equal(turn.shouldCommitRuntime, false);
  });

  it("B — active Scenario does not hijack the blocking query", () => {
    seedLibrary();
    const scenario = run("Explain Capacity Expansion Plan.");
    assert.match(scenario.response, SCENARIO_HIJACK);
    const turn = run(BLOCKING, scenario);
    assertInventory(turn.response, ["capacity.csv", "data-ux3-ambiguous.csv"]);
  });

  it("C — Stage focus on Approve Repricing does not hijack inventory", () => {
    seedLibrary();
    const focused = run("Focus on Approve Repricing.");
    const turn = run(BLOCKING, focused);
    assertInventory(turn.response, ["capacity.csv"]);
    assert.doesNotMatch(turn.response, /Approve Repricing is/i);
  });

  it("D — project scope counts CSV sources, not the Project object", () => {
    seedLibrary();
    const turn = run("How many CSV files are in this project?");
    assert.match(turn.response, /There are 2 CSV files in the current Data Library/i);
    assert.doesNotMatch(turn.response, SCENARIO_HIJACK);
  });

  it("E — status binds to CSV files", () => {
    seedLibrary();
    const turn = run("List all CSV files and their status.");
    assert.match(turn.response, /capacity\.csv/i);
    assert.match(turn.response, /in use|pending review/i);
    assert.doesNotMatch(turn.response, RECOMMEND_GAP);
  });

  it("F — count only", () => {
    seedLibrary();
    const turn = run("How many CSV files do you have?");
    assert.match(turn.response, /There are 2 CSV files in the current Data Library/i);
  });

  it("G — names only", () => {
    seedLibrary();
    const turn = run("List all CSV file names.");
    assert.match(turn.response, /capacity\.csv/i);
    assert.match(turn.response, /data-ux3-ambiguous\.csv/i);
  });

  it("H — status only", () => {
    seedLibrary();
    const turn = run("What is the status of each CSV source?");
    assert.match(turn.response, /capacity\.csv is in use/i);
    assert.match(turn.response, /data-ux3-ambiguous\.csv is pending review/i);
  });

  it("I — multi-clause Data Library request", () => {
    seedLibrary();
    const turn = run("Check Data Library, count the CSVs, list them, and tell me which are in use.");
    assert.match(turn.response, /There are 2 CSV files in the current Data Library/i);
    assert.match(turn.response, /capacity\.csv — in use/i);
    assert.match(turn.response, /data-ux3-ambiguous\.csv — pending review/i);
  });

  it("J — empty library", () => {
    resetCsvRealDataImportStoreForTests();
    const turn = run(BLOCKING);
    assert.match(turn.response, /There are currently no CSV files in the Data Library/i);
    assert.doesNotMatch(turn.response, /capacity\.csv/i);
    assert.doesNotMatch(turn.response, SCENARIO_HIJACK);
  });

  it("K — pending vs in use", () => {
    seedLibrary();
    const text = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: BLOCKING })?.text ?? "";
    assert.match(text, /capacity\.csv — in use/i);
    assert.match(text, /data-ux3-ambiguous\.csv — pending review/i);
    assert.doesNotMatch(text, /data-ux3-ambiguous\.csv — in use/i);
  });

  it("L — removed source is not active inventory", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("capacity.csv");
    const sourceId = csvImportCandidateId("overview", "capacity.csv");
    assert.equal(removeCsvRealDataImport({
      workspaceId: "overview",
      sourceContextId: sourceId,
      activeSourceContextId: null,
      removedAt: T0,
    }).removed, true);
    savePending("kept.csv", ambiguous);
    const text = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "List all CSV files and their status." })?.text ?? "";
    assert.match(text, /kept\.csv/i);
    assert.doesNotMatch(text, /capacity\.csv — in use/i);
  });

  it("M — library inventory outranks a selected CSV explanation", () => {
    seedLibrary();
    const selected = run("Explain capacity.csv.");
    const turn = run("How many CSV files do you have?", selected);
    assert.match(turn.response, /There are 2 CSV files in the current Data Library/i);
    assert.doesNotMatch(turn.response, SCENARIO_HIJACK);
  });

  it("N — current Problem does not hijack CSV inventory", () => {
    seedLibrary();
    const problem = run("Explain Capacity Gap.");
    const turn = run("What CSV files do we currently have?", problem);
    assertInventory(turn.response, ["capacity.csv"]);
    assert.doesNotMatch(turn.response, /Capacity Gap is/i);
  });

  it("O — current Risk does not hijack CSV inventory", () => {
    seedLibrary();
    const risk = run("Focus on Risk.");
    const turn = run("List the CSV files in this project.", risk);
    assertInventory(turn.response, ["capacity.csv"]);
  });

  it("P — inventory does not ask which Outcome", () => {
    seedLibrary();
    const turn = run("How many data files have I uploaded?");
    assert.doesNotMatch(turn.response, OUTCOME);
    assert.match(turn.response, /2 CSV file/i);
  });

  it("Q — non-Data project question stays on Problems", () => {
    seedLibrary();
    assert.equal(classifyAdvisorDataConversation("How many problems are in this project?"), null);
    const turn = run("How many problems are in this project?");
    assert.doesNotMatch(turn.response, /There are 2 CSV files in the current Data Library/i);
    assert.doesNotMatch(turn.response, /capacity\.csv — in use/i);
    const listed = run("Show me all Problems.");
    assert.match(listed.response, /problem|Capacity Gap|Margin Pressure/i);
  });

  it("R — specific provenance is not full library inventory", () => {
    seedLibrary();
    const focused = run("Explain Capacity Gap.");
    const turn = run("What CSV is Capacity Gap using?", focused);
    assert.doesNotMatch(turn.response, /There are 2 CSV files in the current Data Library/i);
    assert.doesNotMatch(turn.response, GENERIC);
  });

  it("S — ECA:6 treats inventory as a side question and can resume", () => {
    seedLibrary();
    const scenario = run("Review Capacity Expansion Plan.");
    const csv = run("Now check the Data Library. How many CSV files do we have?", scenario);
    assertInventory(csv.response, ["capacity.csv"]);
    const resume = run("Okay, continue with the scenario.", csv);
    assert.match(resume.response, /Capacity Expansion Plan|scenario/i);
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
      utterance: BLOCKING,
      meaning: null,
      stage: emptyStage(),
      subjects: subjectsForEca,
    });
    const side = judgeEcaExecutiveDialogueStrategy({
      utterance: BLOCKING,
      workingContext: sideWorking,
      actionPlan: planEcaExecutiveConversationAction({ utterance: BLOCKING, workingContext: sideWorking }),
      session: nextEcaDialogueStrategySession(null, "Investigate Risk.", start),
    });
    assert.equal(side.relationshipToCurrentTurn, "SIDE_QUESTION");
  });

  it("T — inventory is read-only", () => {
    seedLibrary();
    const before = exportCsvRealDataImportState();
    const start = overview();
    const turn = run(BLOCKING);
    assert.deepEqual(exportCsvRealDataImportState(), before);
    assert.deepEqual(turn.nextRuntimeState, start);
    assert.equal(turn.shouldCommitRuntime, false);
  });

  it("Sequence 1 — Stage and Problems then blocking query", () => {
    seedLibrary();
    const stage = run("What is on Stage?");
    const problems = run("Show me all Problems.", stage);
    const stageNow = run("What is on Stage now?", problems);
    const data = run(BLOCKING, stageNow);
    assertInventory(data.response, ["capacity.csv", "data-ux3-ambiguous.csv"]);
  });

  it("Sequence 2 — Scenario, Data side question, resume", () => {
    seedLibrary();
    const scenario = run("Explain Capacity Expansion Plan.");
    assert.match(scenario.response, SCENARIO_HIJACK);
    const data = run("Now check the Data Library. How many CSV files do we have?", scenario);
    assertInventory(data.response, ["capacity.csv"]);
    const resume = run("Okay, continue with the scenario.", data);
    assert.match(resume.response, /Capacity Expansion Plan|scenario/i);
  });

  it("Sequence 3 — list then pending source", () => {
    seedLibrary();
    const list = run("List all CSVs and their status.");
    assert.match(list.response, /pending review/i);
    const pending = run("Explain the pending one.", list);
    assert.match(pending.response, /data-ux3-ambiguous\.csv/i);
    assert.doesNotMatch(pending.response, GENERIC);
  });

  it("Sequence 4 — inventory then provenance", () => {
    seedLibrary();
    const count = run("How many CSVs do we have?");
    assert.match(count.response, /2 CSV file/i);
    const provenance = run("Which one supports Capacity Gap?", count);
    assert.doesNotMatch(provenance.response, GENERIC);
  });

  it("Sequence 5 — business, data, business", () => {
    seedLibrary();
    const review = run("Review Capacity Expansion Plan.");
    const data = run("What CSV files do we have?", review);
    assertInventory(data.response, ["capacity.csv"]);
    const resume = run("Continue with the scenario.", data);
    assert.match(resume.response, /Capacity Expansion Plan|scenario/i);
  });

  it("generalized inventory utterances still reach DATA-ADV:1", () => {
    seedLibrary();
    const utterances = [
      "How many CSVs are in my Data Library?",
      "Which CSV sources do you currently have?",
      "Show every CSV and its status.",
      "Give me the names and status of all CSV sources.",
      "Do we have any CSVs in this project?",
      "List all current data sources.",
    ];
    for (const utterance of utterances) {
      assert.equal(classifyAdvisorDataConversation(utterance), "inventory");
      const text = answerAdvisorDataInquiry({ workspaceId: "overview", utterance })?.text ?? "";
      assert.match(text, /capacity\.csv|data-ux3-ambiguous\.csv|2 CSV/i);
      assert.doesNotMatch(text, SCENARIO_HIJACK);
    }
  });
});
