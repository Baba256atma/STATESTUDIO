/**
 * MRA:3-FINAL independent manager simulation. Validation only. Does not patch product code.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { executeNexoraConversationalExperience } from "../app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import {
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
  csvImportCandidateId,
} from "../app/lib/data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
} from "../app/lib/data-reality/csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "../app/lib/data-reality/csvSemanticUnderstanding.ts";
import { commitPreparedCsvRealDataImport } from "../app/lib/data-reality/csvRealDataImportStore.ts";
import { projectManagerObjectConversationalSubjects } from "../app/lib/manager-object/managerObjectCatalog.ts";
import { projectAuthoritativeStageContext } from "../app/lib/manager-object/nexoraNxa5Fix4StageContextIntelligence.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  openNexoraMVPExecutiveQueueCollection,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
} from "../app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "../artifacts/mra/MRA-3-FINAL");
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const T0 = "2026-09-10T20:00:00.000Z";
const READY_CSV = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";
const AMBIGUOUS = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";
const LEAK =
  /\b(?:NCA(?::|-)|NXA(?::|-)|ECA(?::|-)|CC:\d|DTH|POST:\d|DATA-ADV|MANAGER AUTHORITY REQUIREMENT|DECISION REQUIREMENT|canonicalWriter|INSUFFICIENT_REALITY)\b/i;

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function overview() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function snapshot(utterance: string, turn: Turn, extra?: Record<string, unknown>) {
  const stage = projectAuthoritativeStageContext({
    runtimeState: turn.nextRuntimeState,
    catalog,
  });
  return {
    utterance,
    response: turn.response,
    leak: LEAK.test(turn.response),
    focusedId: turn.nextRuntimeState.focusedSubject?.id ?? null,
    focusedLabel: turn.nextRuntimeState.focusedSubject?.label ?? null,
    shouldCommitRuntime: turn.shouldCommitRuntime,
    intentKind: turn.intentResult.intent.kind,
    clarify: turn.clarificationTurn.action,
    referent: turn.contextualManagerMeaning.objectReference?.canonicalName ?? null,
    operation: turn.contextualManagerMeaning.requestedOperation,
    mutationOperation: turn.ecaWorkingContext?.mutationProposal?.operation ?? null,
    mutationStatus: turn.ecaWorkingContext?.mutationProposal?.status ?? null,
    decisionStatus: turn.decisionCommitmentResult?.status ?? null,
    canonicalApprovedDecisions:
      turn.decisionRuntime?.listDecisions().filter((item) => item.status === "Approved").length ?? 0,
    canonicalExecutions: turn.executionRuntime?.listExecutions().length ?? 0,
    stageVisible: stage.visibleMembers.map((item) => item.label),
    stageFocus: stage.focus?.label ?? null,
    continuityKind: turn.managerObjectTurn.session.conversationContinuity?.activeSubjectKind ?? null,
    ...extra,
  };
}

function runTurn(utterance: string, previous?: Turn, runtimeState = previous?.nextRuntimeState): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState: runtimeState ?? overview(),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    decisionRuntime: previous ? previous.decisionRuntime : undefined,
    executionRuntime: previous ? previous.executionRuntime : undefined,
    messageIdSeed: `mra-3-final-${utterance.slice(0, 56)}`,
  });
}

function runJourney(id: string, title: string, utterances: readonly string[], seedCsv: "none" | "ready" | "ambiguous" = "none") {
  if (seedCsv === "ready") seedReadyCsv();
  if (seedCsv === "ambiguous") seedAmbiguousCsv();
  if (seedCsv === "none") resetCsvRealDataImportStoreForTests();
  let previous: Turn | undefined;
  const turns = utterances.map((utterance) => {
    previous = runTurn(utterance, previous);
    return snapshot(utterance, previous);
  });
  return { id, title, turns, last: previous };
}

function seedReadyCsv() {
  resetCsvRealDataImportStoreForTests();
  const prepared = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName: "capacity-ready.csv",
    fileSize: READY_CSV.length,
    csvText: READY_CSV,
    importId: "mra-3-final:ready",
    importedAt: T0,
  });
  if (!prepared.ready) throw new Error("ready CSV did not prepare");
  commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: "overview",
    mode: "new",
    committedAt: T0,
  });
}

function seedAmbiguousCsv() {
  resetCsvRealDataImportStoreForTests();
  const fileName = "data-ux3-ambiguous.csv";
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: AMBIGUOUS.length,
    csvText: AMBIGUOUS,
    importId: "mra-3-final:ambiguous",
    importedAt: T0,
  });
  const parse = parseCsvDeterministically(AMBIGUOUS);
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

const j1 = runJourney("J1-orientation", "Entrance and orientation", [
  "hi, I'm Sam. I run operations here.",
  "what is this?",
  "where am I?",
  "whats on stage",
  "what do you already know about the business?",
  "whats the goal",
  "show me problems",
  "what can you help me with",
]);

const j2 = runJourney("J2-stage", "Stage collection and clicks", [
  "What's on Stage?",
  "Show me the Problems.",
  "Explain this one.",
  "Go back.",
  "Show me the scenarios.",
  "What is this?",
]);

const j3 = runJourney("J3-investigation", "Problem investigation", [
  "What are the main problems?",
  "look at capcity",
  "explain it",
  "Why?",
  "What do we know?",
  "What don't we know?",
  "What should I investigate next?",
  "what evidence do we have",
  "now look at Margin Pressure",
  "go back to the first problem",
  "explain it",
]);

const j4 = runJourney("J4-cross-domain", "Cross-domain referential continuity", [
  "show me scenarios",
  "is there any CSV files?",
  "explain it",
  "Capacity Gap",
  "explain it",
  "Demand Surge",
  "tell me more about it",
  "look at Capacity",
  "what's going on with that?",
  "what can Nexora do?",
  "explain it",
], "ambiguous");

const j5 = runJourney("J5-data", "Real data conversation", [
  "Do you have any CSV files?",
  "Explain it.",
  "What do you understand from it?",
  "What fields do you understand?",
  "What don’t you understand?",
  "What KPI can you calculate reliably?",
  "Can this data support the Capacity Gap?",
  "Does it prove Capacity Gap caused the delivery problem?",
], "ready");

const j6 = runJourney("J6-scenario-rec", "Scenario compare and recommendation", [
  "show me problems",
  "investigate Capacity Gap",
  "show me scenarios",
  "compare them",
  "explain the second one",
  "which one is more important?",
  "risk exposure",
  "What should I do?",
  "Why?",
  "Are you sure?",
  "What information are you missing?",
  "is that a decision already or just your advice",
]);

function continueJourney(id: string, title: string, previous: Turn | undefined, utterances: readonly string[]) {
  let current = previous;
  const turns = utterances.map((utterance) => {
    current = runTurn(utterance, current);
    return snapshot(utterance, current!);
  });
  return { id, title, turns, last: current };
}

const j7 = runJourney("J7-decision", "Decision commitment", [
  "show me scenarios",
  "compare them",
  "I prefer Demand Surge",
  "why aren't we deciding",
  "Approve Demand Surge",
  "is that approved?",
]);

const j8 = continueJourney("J8-execution", "Execution after approval", j7.last, [
  "What happens next?",
  "are we ready to execute?",
  "start it",
  "Did it start?",
  "Who owns it?",
  "What’s blocking it?",
  "How is it going?",
]);

const j9 = runJourney("J9-mutation", "Mutation safety", [
  "Add this as a Risk.",
  "wait no that's not right",
  "show me problems",
  "yes",
  "Add Supplier Delay as a Risk.",
  "yes",
  "delete Margin Pressure",
  "no",
  "Add Supplier Delay as a Risk.",
  "cancel",
]);

const j10 = runJourney("J10-outcome", "Outcome and causality", [
  "show me scenarios",
  "Approve Demand Surge",
  "start it",
  "baseline was 91 and we hit 94. goal is 96",
  "Did our Decision cause this improvement?",
]);

const longUtterances = [
  "hey",
  "whats going on",
  "whats on stage",
  "show me problems",
  "how many we have",
  "look at capcity",
  "why",
  "what do we know",
  "what dont we know",
  "show me scenarios",
  "is there any CSV files?",
  "explain it",
  "what fields are unclear",
  "can this support the capacity issue",
  "does it prove the cause",
  "ok Capacity Gap",
  "explain it",
  "Demand Surge",
  "tell me more about it",
  "look at Capacity",
  "what's going on with that?",
  "what can you actually do for me",
  "explain it",
  "no I mean Capacity",
  "show me problems",
  "the first one",
  "investigate it",
  "what should I do",
  "why",
  "are you sure",
  "compare the scenarios",
  "which one is more important",
  "risk exposure",
  "I prefer Demand Surge",
  "is that already a decision",
  "Approve Demand Surge",
  "what happens next",
  "are we ready",
  "start it",
  "did it start",
  "who owns it",
  "any blockers",
  "how is it going",
  "Add this as a Risk.",
  "forget it, show me problems",
  "yes",
  "delete Margin Pressure",
  "no cancel that",
  "we're delayed a week",
  "did the decision cause better delivery",
  "thanks",
  "go back to the first problem",
  "explain it",
];

seedAmbiguousCsv();
const longSession = runJourney("LONG-52", "Long real-manager session", longUtterances, "ambiguous");

let navPrevious: Turn | undefined;
const navTurns: ReturnType<typeof snapshot>[] = [];
function navSay(utterance: string) {
  navPrevious = runTurn(utterance, navPrevious);
  navTurns.push(snapshot(utterance, navPrevious));
}
resetCsvRealDataImportStoreForTests();
navSay("show me problems");
navSay("Capacity Gap");
if (navPrevious) {
  navPrevious = {
    ...navPrevious,
    nextRuntimeState: selectNexoraMVPInteractionSubject(navPrevious.nextRuntimeState, "ctx-problem-margin"),
  } as Turn;
  navTurns.push(snapshot("(stage click Margin Pressure)", navPrevious, { synthetic: "stage-click" }));
}
navSay("explain it");
if (navPrevious) {
  navPrevious = {
    ...navPrevious,
    nextRuntimeState: openNexoraMVPExecutiveQueueCollection(navPrevious.nextRuntimeState, "problem"),
  } as Turn;
  navTurns.push(snapshot("(open Problems collection)", navPrevious, { synthetic: "collection-nav" }));
}
navSay("whats on stage");
if (navPrevious) {
  navPrevious = {
    ...navPrevious,
    nextRuntimeState: stepBackNexoraMVPObjectInteraction(navPrevious.nextRuntimeState),
  } as Turn;
  navTurns.push(snapshot("(Stage Back)", navPrevious, { synthetic: "back" }));
}
if (navPrevious) {
  navPrevious = {
    ...navPrevious,
    nextRuntimeState: stepForwardNexoraMVPObjectInteraction(navPrevious.nextRuntimeState),
  } as Turn;
  navTurns.push(snapshot("(Stage Forward)", navPrevious, { synthetic: "forward" }));
}
if (navPrevious) {
  navPrevious = {
    ...navPrevious,
    nextRuntimeState: resetNexoraMVPObjectInteractionOverview(navPrevious.nextRuntimeState),
  } as Turn;
  navTurns.push(snapshot("(Overview reset)", navPrevious, { synthetic: "overview" }));
}
navSay("whats on stage");
navSay("Show me the Problems.");

const journeys = [
  j1, j2, j3, j4, j5, j6, j7, j8, j9, j10,
  longSession,
  { id: "NAV", title: "Stage click / collection / back / forward / overview", turns: navTurns, last: navPrevious },
];

resetCsvRealDataImportStoreForTests();
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "runtime-turns.json"),
  JSON.stringify(
    {
      identity: "NPA-T MRA:3-FINAL/RuntimeManagerSimulation",
      recordedAt: new Date().toISOString(),
      validationOnly: true,
      longSessionTurns: longUtterances.length,
      journeys: journeys.map(({ last: _last, ...rest }) => rest),
    },
    null,
    2,
  ),
);

const leaks = journeys.flatMap((j) => j.turns.filter((t) => t.leak).map((t) => `${j.id}:${t.utterance}`));
console.log(JSON.stringify({
  identity: "NPA-T MRA:3-FINAL/RuntimeManagerSimulation",
  journeys: journeys.length,
  turns: journeys.reduce((n, j) => n + j.turns.length, 0),
  longSessionTurns: longUtterances.length,
  leaks,
}, null, 2));
