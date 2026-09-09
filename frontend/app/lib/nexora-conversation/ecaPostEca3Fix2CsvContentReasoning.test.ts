/**
 * NPA-T POST-ECA:3-FIX2 — CSV content reasoning and clarification escape.
 * Reuses DATA-ADV:1 and applyCsvSemanticClarification. Does not start POST-ECA:4, ECA:13, or DATA-ADV:3.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  commitPreparedCsvRealDataImport,
  csvImportCandidateId,
  exportCsvRealDataImportState,
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
  applyAdvisorDataSemanticClarification,
  classifyAdvisorDataConversation,
} from "../manager-object/nexoraAdvisorDataInquiry.ts";
import {
  beginNcaCsvSemanticClarification,
  resolveNcaCsvSemanticReply,
} from "../manager-object/nexoraNcaCsvSemanticClarification.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { judgeEcaExecutiveDialogueStrategy, nextEcaDialogueStrategySession } from "./ecaExecutiveDialogueStrategy.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import { composeEcaWorkingConversationContext, type EcaStageContext } from "./ecaWorkingConversationContext.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const T0 = "2026-09-09T19:00:00.000Z";
const ambiguous = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";
const ready = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";
const INVENTORY = /There are \d+ CSV files? in the current Data Library/i;
const WHICH = /Which one do you want me to explain/i;
const GENERIC = /couldn't find a clear match/i;

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
    messageIdSeed: `post-eca-3-fix2-${utterance}`,
  });
}

function mappingFor(fileName: string, csvText: string) {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: csvText.length,
    csvText,
    importId: `post-eca-3-fix2:${fileName}`,
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
      importId: `post-eca-3-fix2:${fileName}`,
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
    importId: `post-eca-3-fix2-ready:${fileName}`,
    importedAt: T0,
  });
  assert.equal(prepared.ready, true);
  commitPreparedCsvRealDataImport({ prepared, expectedWorkspaceId: "overview", mode: "new", committedAt: T0 });
}

function seedAmbiguous() {
  resetCsvRealDataImportStoreForTests();
  savePending("data-ux3-ambiguous.csv", ambiguous);
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

function ask(utterance: string, dialogue?: NonNullable<ReturnType<typeof answerAdvisorDataInquiry>>["dialogue"]) {
  return answerAdvisorDataInquiry({
    workspaceId: "overview",
    utterance,
    dialogue,
    focusedObjectLabel: "Capacity Gap",
  });
}

describe("POST-ECA:3-FIX2 CSV content reasoning", () => {
  it("A — field coverage names actual columns, not Which one", () => {
    seedAmbiguous();
    assert.equal(classifyAdvisorDataConversation("Which columns of data-ux3-ambiguous.csv do you understand, and which columns have an unclear business meaning?"), "field-coverage");
    const text = ask("Which columns of data-ux3-ambiguous.csv do you understand, and which columns have an unclear business meaning?")?.text ?? "";
    assert.doesNotMatch(text, WHICH);
    assert.doesNotMatch(text, INVENTORY);
    assert.match(text, /CAP_AV/i);
    assert.match(text, /BKL/i);
    assert.match(text, /unknown meaning|not confirmed/i);
    const turn = run("Which columns of data-ux3-ambiguous.csv do you understand, and which columns have an unclear business meaning?");
    assert.doesNotMatch(turn.response, WHICH);
    assert.match(turn.response, /CAP_AV/i);
  });

  it("B — CAP_AV remains ambiguous and asks for meaning", () => {
    seedAmbiguous();
    const named = run("I mean data-ux3-ambiguous.csv.");
    assert.doesNotMatch(named.response, WHICH);
    const cap = run("What does CAP_AV mean in this file?", named);
    assert.match(cap.response, /CAP_AV is a field in data-ux3-ambiguous\.csv/i);
    assert.match(cap.response, /Available Capacity|Capacity Availability/i);
    assert.match(cap.response, /neither meaning is confirmed/i);
  });

  it("C — BKL question escapes pending CAP_AV clarification", () => {
    seedAmbiguous();
    const cap = ask("What does CAP_AV mean in this file?");
    assert.ok(cap?.clarification);
    const session = beginNcaCsvSemanticClarification({ ncaConversationState: null }, cap.clarification);
    assert.equal(resolveNcaCsvSemanticReply(session, "What does BKL mean? If you are not sure, tell me what information you need from me."), null);
    const bkl = ask("What does BKL mean? If you are not sure, tell me what information you need from me.", cap?.dialogue);
    assert.match(bkl?.text ?? "", /BKL is a field in data-ux3-ambiguous\.csv/i);
    assert.doesNotMatch(bkl?.text ?? "", /Understood\. CAP_AV remains unresolved/i);
    assert.doesNotMatch(bkl?.text ?? "", /Available Capacity/i);
  });

  it("D — BKL unknown does not invent meaning", () => {
    seedAmbiguous();
    const text = ask("What does BKL mean?")?.text ?? "";
    assert.match(text, /don't have enough information|unknown/i);
    assert.doesNotMatch(text, /backlog/i);
  });

  it("E — KPI capability is not inventory", () => {
    seedAmbiguous();
    const named = ask("I mean data-ux3-ambiguous.csv.");
    const text = ask("What useful KPIs can you calculate from this CSV with the fields you currently understand?", named?.dialogue)?.text ?? "";
    assert.doesNotMatch(text, INVENTORY);
    assert.match(text, /KPI|calculate|confirmed/i);
    assert.match(text, /BKL/i);
    assert.doesNotMatch(text, /BKL means backlog/i);
  });

  it("F — evidence relevance is not forced BKL clarification", () => {
    seedAmbiguous();
    const bkl = ask("What does BKL mean?");
    const session = beginNcaCsvSemanticClarification({ ncaConversationState: null }, bkl?.clarification ?? {
      fieldId: "x",
      sourceColumn: "BKL",
      sourceContextId: "x",
      workspaceId: "overview",
      question: "What does it represent?",
      proposedMeaning: null,
    });
    assert.equal(resolveNcaCsvSemanticReply(session, "Does this CSV provide evidence related to Capacity Gap?"), null);
    const text = ask("Does this CSV provide evidence related to Capacity Gap?", bkl?.dialogue)?.text ?? "";
    assert.doesNotMatch(text, /I still need a meaning for BKL/i);
    assert.doesNotMatch(text, /What does it represent/i);
    assert.match(text, /Capacity Gap|pending|evidence/i);
    assert.match(text, /not a confirmed relationship|cannot treat it as evidence|causality/i);
  });

  it("G — bounded conclusion is not inventory", () => {
    seedAmbiguous();
    const named = ask("I mean data-ux3-ambiguous.csv.");
    const text = ask("What can you conclude from this CSV, and what can you NOT conclude yet?", named?.dialogue)?.text ?? "";
    assert.doesNotMatch(text, INVENTORY);
    assert.match(text, /cannot/i);
    assert.match(text, /pending review|accepted evidence/i);
  });

  it("H — row count does not require unresolved meanings", () => {
    seedAmbiguous();
    const named = ask("I mean data-ux3-ambiguous.csv.");
    const text = ask("How many rows are in this CSV?", named?.dialogue)?.text ?? "";
    assert.match(text, /1 data row/i);
    assert.doesNotMatch(text, /What does it represent/i);
  });

  it("I/J — numeric observation without invented meaning", () => {
    seedAmbiguous();
    const named = ask("I mean data-ux3-ambiguous.csv.");
    const text = ask("What values does BKL contain?", named?.dialogue)?.text ?? "";
    assert.match(text, /120|numeric|range/i);
    assert.doesNotMatch(text, /backlog increased/i);
  });

  it("K — pending source can be inspected, not accepted evidence", () => {
    seedAmbiguous();
    const text = ask("What can you conclude from data-ux3-ambiguous.csv?")?.text ?? "";
    assert.match(text, /pending review/i);
    assert.doesNotMatch(text, /accepted evidence for Capacity Gap/i);
  });

  it("L — confirmed source uses accepted status", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("capacity.csv");
    const text = ask("Does this CSV provide evidence related to Capacity Gap?")?.text ?? "";
    assert.match(text, /capacity\.csv|accepted evidence|supports|do not have a confirmed evidence relationship/i);
    assert.doesNotMatch(text, /data-ux3-ambiguous/i);
  });

  it("M — I don't know does not loop CAP_AV", () => {
    seedAmbiguous();
    const cap = ask("What does CAP_AV mean in this file?");
    const fieldId = cap?.clarification?.fieldId;
    assert.ok(fieldId);
    const written = applyAdvisorDataSemanticClarification("overview", csvImportCandidateId("overview", "data-ux3-ambiguous.csv"), fieldId, "I don't know.");
    assert.match(written.acknowledgement, /remains unresolved/i);
    const again = ask("What useful KPIs can you calculate from this CSV with the fields you currently understand?", cap?.dialogue);
    assert.doesNotMatch(again?.text ?? "", /Which meaning is correct for this source/i);
    assert.doesNotMatch(again?.text ?? "", INVENTORY);
  });

  it("N — explicit confirmation uses canonical writer", () => {
    seedAmbiguous();
    const cap = ask("What does CAP_AV mean in this file?");
    const fieldId = cap?.clarification?.fieldId;
    assert.ok(fieldId);
    const written = applyAdvisorDataSemanticClarification(
      "overview",
      csvImportCandidateId("overview", "data-ux3-ambiguous.csv"),
      fieldId,
      "CAP_AV means Available Capacity.",
    );
    assert.equal(written.resolved, true);
    assert.match(written.acknowledgement, /Available Capacity/i);
  });

  it("O — this CSV continues the selected source", () => {
    seedAmbiguous();
    const named = ask("I mean data-ux3-ambiguous.csv.");
    const kpi = ask("What useful KPIs can you calculate from this CSV?", named?.dialogue);
    assert.match(kpi?.text ?? "", /data-ux3-ambiguous\.csv/i);
    assert.doesNotMatch(kpi?.text ?? "", INVENTORY);
  });

  it("P — explicit source switch", () => {
    seedAmbiguous();
    commitReady("capacity.csv");
    const first = ask("I mean data-ux3-ambiguous.csv.");
    const second = ask("Explain capacity.csv.", first?.dialogue);
    assert.match(second?.text ?? "", /capacity\.csv/i);
  });

  it("Q — FIX1 inventory still works", () => {
    seedAmbiguous();
    const text = ask("How many CSV files do we have?")?.text ?? "";
    assert.match(text, /There are 1 CSV file in the current Data Library/i);
  });

  it("R — provenance remains object-specific", () => {
    resetCsvRealDataImportStoreForTests();
    commitReady("capacity.csv");
    const text = run("What CSV is Capacity Gap using?").response;
    assert.doesNotMatch(text, INVENTORY);
    assert.doesNotMatch(text, GENERIC);
  });

  it("S — ECA:6 side question", () => {
    seedAmbiguous();
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
      utterance: "What can you conclude from this CSV?",
      meaning: null,
      stage: emptyStage(),
      subjects: subjectsForEca,
    });
    const side = judgeEcaExecutiveDialogueStrategy({
      utterance: "What can you conclude from this CSV?",
      workingContext: sideWorking,
      actionPlan: planEcaExecutiveConversationAction({ utterance: "What can you conclude from this CSV?", workingContext: sideWorking }),
      session: nextEcaDialogueStrategySession(null, "Investigate Risk.", start),
    });
    assert.equal(side.relationshipToCurrentTurn, "SIDE_QUESTION");
  });

  it("T — analytical questions are read-only", () => {
    seedAmbiguous();
    const before = exportCsvRealDataImportState();
    const start = overview();
    const turn = run("What useful KPIs can you calculate from this CSV with the fields you currently understand?");
    assert.deepEqual(exportCsvRealDataImportState(), before);
    assert.deepEqual(turn.nextRuntimeState, start);
    assert.equal(turn.shouldCommitRuntime, false);
  });

  it("Sequence 1 — exact reported conversation", () => {
    seedAmbiguous();
    const t1 = run("I mean data-ux3-ambiguous.csv.");
    assert.doesNotMatch(t1.response, WHICH);
    const t2 = run("Which columns of data-ux3-ambiguous.csv do you understand, and which columns have an unclear business meaning?", t1);
    assert.match(t2.response, /CAP_AV/i);
    assert.doesNotMatch(t2.response, WHICH);
    const t3 = run("What does CAP_AV mean in this file?", t2);
    assert.match(t3.response, /neither meaning is confirmed/i);
    const t4 = run("What does BKL mean? If you are not sure, tell me what information you need from me.", t3);
    assert.match(t4.response, /BKL is a field/i);
    assert.doesNotMatch(t4.response, /Understood\. CAP_AV remains unresolved/i);
    const t6 = run("What useful KPIs can you calculate from this CSV with the fields you currently understand?", t4);
    assert.doesNotMatch(t6.response, INVENTORY);
    const t7 = run("Does this CSV provide evidence related to Capacity Gap?", t6);
    assert.doesNotMatch(t7.response, /I still need a meaning for BKL/i);
    const t9 = run("What can you conclude from this CSV, and what can you NOT conclude yet?", t7);
    assert.doesNotMatch(t9.response, INVENTORY);
    assert.match(t9.response, /cannot/i);
  });

  it("Sequence 2 — clarification escape then KPI", () => {
    seedAmbiguous();
    const cap = run("What does CAP_AV mean?");
    const bkl = run("What does BKL mean?", cap);
    assert.match(bkl.response, /BKL is a field/i);
    const kpi = run("What KPIs can you calculate without resolving either field?", bkl);
    assert.doesNotMatch(kpi.response, INVENTORY);
    assert.doesNotMatch(kpi.response, /Which meaning is correct/i);
  });

  it("Sequence 3 — unknown then continue", () => {
    seedAmbiguous();
    const bkl = ask("What does BKL mean?");
    assert.ok(bkl?.clarification?.fieldId);
    applyAdvisorDataSemanticClarification(
      "overview",
      csvImportCandidateId("overview", "data-ux3-ambiguous.csv"),
      bkl.clarification.fieldId,
      "I don't know.",
    );
    const next = ask("What can you still tell me from the CSV?", bkl.dialogue);
    assert.doesNotMatch(next?.text ?? "", /What does it represent/i);
    assert.match(next?.text ?? "", /inspect|row|unresolved|cannot/i);
  });

  it("Sequence 4 — confirm then re-evaluate", () => {
    seedAmbiguous();
    const cap = ask("What does CAP_AV mean?");
    assert.ok(cap?.clarification?.fieldId);
    applyAdvisorDataSemanticClarification(
      "overview",
      csvImportCandidateId("overview", "data-ux3-ambiguous.csv"),
      cap.clarification.fieldId,
      "CAP_AV means Available Capacity.",
    );
    const kpi = ask("Does that change what you can calculate?", cap.dialogue);
    assert.match(kpi?.text ?? "", /Available Capacity|confirmed|KPI|calculate/i);
  });

  it("Sequence 5 — CSV then object evidence", () => {
    seedAmbiguous();
    const explain = run("Explain data-ux3-ambiguous.csv.");
    const evidence = run("Does it provide evidence for Capacity Gap?", explain);
    assert.doesNotMatch(evidence.response, INVENTORY);
    const why = run("Why?", evidence);
    assert.doesNotMatch(why.response, GENERIC);
    const missing = run("What information is still missing?", why);
    assert.match(missing.response, /CAP_AV|BKL|pending|unresolved|missing|meaning/i);
  });

  it("Sequence 6 — business, data, business", () => {
    seedAmbiguous();
    const gap = run("Explain Capacity Gap.");
    const files = run("What CSV files do we have?", gap);
    assert.match(files.response, /data-ux3-ambiguous\.csv/i);
    const explain = run("Explain data-ux3-ambiguous.csv.", files);
    const help = run("Does it help us understand Capacity Gap?", explain);
    assert.doesNotMatch(help.response, INVENTORY);
    const resume = run("Continue with Capacity Gap.", help);
    assert.match(resume.response, /Capacity Gap|scenario|continue/i);
  });

  it("Sequence 7 — Stage then CSV evidence about Risk", () => {
    seedAmbiguous();
    const stage = run("What is on Stage?");
    const risk = run("Show Risk.", stage);
    const explain = run("Explain this.", risk);
    const data = run("What can data-ux3-ambiguous.csv tell us about this Risk?", explain);
    assert.doesNotMatch(data.response, INVENTORY);
    assert.doesNotMatch(data.response, /hidden\.csv/i);
    assert.match(data.response, /data-ux3-ambiguous\.csv|pending|evidence|Risk|cannot/i);
  });

  it("Sequence 8 — no fabricated KPI from unknown fields", () => {
    seedAmbiguous();
    const text = ask("What useful KPIs can you calculate from this CSV with the fields you currently understand?")?.text ?? "";
    assert.doesNotMatch(text, /backlog level/i);
    assert.match(text, /unknown|not a valid KPI|cannot calculate a business-valid KPI/i);
  });
});
