/**
 * MRA:3 isolated CC:5 real-manager simulations. Validation only. Does not rewrite MRA:1/MRA:2 evidence.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { executeNexoraConversationalExperience } from "../app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import {
  commitPreparedCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
} from "../app/lib/data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../app/lib/data-reality/csvRealDataVerticalSlice.ts";
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

const outDir = join(
  dirname(fileURLToPath(import.meta.url)),
  process.env.MRA_ARTIFACT_DIR ?? "../artifacts/mra/MRA-3",
);
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const T0 = "2026-09-09T23:00:00.000Z";
const READY_CSV = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";
const LEAK = /\b(?:NCA(?::|-)|NXA(?::|-)|ECA(?::|-)|CC:\d|DTH|MANAGER AUTHORITY REQUIREMENT|DECISION REQUIREMENT|canonicalWriter)\b/i;

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
    intent: turn.ecaActionPlan?.intent ?? null,
    nextAction: turn.ecaActionPlan?.nextAction ?? null,
    ncaPost3Owner: turn.ncaPost3Diagnostics?.primaryResponseOwner ?? null,
    mutationOperation: turn.ecaWorkingContext?.mutationProposal?.operation ?? null,
    mutationStatus: turn.ecaWorkingContext?.mutationProposal?.status ?? null,
    decisionStatus: turn.decisionCommitmentResult?.status ?? null,
    eca8State: turn.ecaCommitmentJudgment?.commitmentState ?? null,
    eca8Challenge: turn.ecaCommitmentJudgment?.preDecisionChallenge ?? null,
    eca8Confirmation: turn.ecaCommitmentJudgment?.confirmationRequired ?? null,
    canonicalApprovedDecisions:
      turn.decisionRuntime?.listDecisions().filter((item) => item.status === "Approved").length ?? 0,
    canonicalExecutions: turn.executionRuntime?.listExecutions().length ?? 0,
    stageVisible: stage.visibleMembers.map((item) => item.label),
    stageFocus: stage.focus?.label ?? null,
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
    messageIdSeed: `mra-3-${utterance.slice(0, 48)}`,
  });
}

function runJourney(
  id: string,
  persona: string,
  title: string,
  utterances: readonly string[],
  seed?: (previous?: Turn) => Turn | undefined,
) {
  let previous: Turn | undefined = seed?.();
  const turns = utterances.map((utterance) => {
    previous = runTurn(utterance, previous);
    return snapshot(utterance, previous);
  });
  return { id, persona, title, turns, last: previous };
}

function seedReadyCsv() {
  resetCsvRealDataImportStoreForTests();
  const prepared = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName: "capacity-ready.csv",
    fileSize: READY_CSV.length,
    csvText: READY_CSV,
    importId: "mra-3:ready",
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

const j1 = runJourney("J1-orientation", "C", "Business orientation", [
  "I'm Sam. I own this business.",
  "what's going on",
  "whats the goal here",
  "show me problems",
  "whats on stage",
  "no I mean the problems we actually have",
  "show me again",
]);

const j2 = runJourney("J2-investigation", "A", "Problem investigation", [
  "What are the main problems?",
  "look at capcity",
  "what does that mean",
  "why is that happening?",
  "what evidence do we have?",
  "now margin",
  "go back to the first problem",
  "explain it",
]);

seedReadyCsv();
const j3 = runJourney("J3-data", "A", "Real data conversation", [
  "What CSV do you have?",
  "Explain the CSV file you currently have and tell me what you understand from it.",
  "tell me about my data",
  "what fields are confirmed?",
  "what about totalCapacity",
  "that's used capacity over total, treat it as utilization",
  "What KPI can you calculate?",
  "Can this CSV support Capacity Gap?",
  "does that prove capacity caused delivery issues?",
]);

const j4 = runJourney("J4-scenarios", "B", "Scenario development", [
  "show me problems",
  "investigate Capacity Gap",
  "what can we do",
  "show me scenarios",
  "compare them",
  "explain the second one",
  "I prefer Demand Surge",
  "is that a real scenario or just advice?",
]);

const j5 = runJourney("J5-challenge", "B", "Recommendation challenge", [
  "show me problems",
  "what should I do?",
  "Why?",
  "Are you sure?",
  "What information are you missing?",
  "What happens if we do nothing?",
  "Is this your recommendation or already a decision?",
]);

const j6 = runJourney("J6-decision", "C", "Decision commitment", [
  "show scenarios",
  "Compare them.",
  "I prefer Demand Surge.",
  "why aren't we deciding",
  "Approve Demand Surge",
  "is that approved?",
]);

const j7 = runJourney("J7-execution", "C", "Execution after decision", [
  ...j6.turns.map((t) => t.utterance),
  "What happens next?",
  "are we ready to execute?",
  "start it",
  "how is it going",
]);

const j8 = runJourney("J8-deviation", "B", "Deviation during execution", [
  ...["show scenarios", "Approve Demand Surge", "start it"],
  "we're slipping a week",
  "Are we still on track?",
  "What changed?",
  "Should we change the plan?",
  "Does this affect the decision?",
]);

const j9 = runJourney("J9-outcome", "C", "Outcome and causality", [
  ...["show scenarios", "Approve Demand Surge", "start it"],
  "baseline was 91 and we hit 94. goal is 96",
  "Did our decision cause the improvement?",
  "so did it work",
]);

const j10 = runJourney("J10-mutation", "A", "Mutation safety", [
  "Add Supplier Delay as a Risk.",
  "wait",
  "no",
  "Add Supplier Delay as a Risk.",
  "yes",
  "delete Margin Pressure",
  "no",
  "Add this as a Risk.",
  "forget that for now",
  "show me problems",
  "yes",
]);

const longUtterances = [
  "hi",
  "whats going on with delivery",
  "show me problems",
  "how many we have",
  "look at Capacity Gap",
  "why",
  "explian it",
  "what about the data?",
  "What CSV do you have?",
  "Explain the CSV file you currently have and tell me what you understand from it.",
  "what don't you understand",
  "can this support the capacity issue",
  "does it prove the cause",
  "ok forget data for a minute",
  "whats on stage",
  "show me what is on Stage",
  "Focus on Risk.",
  "whats on stage now",
  "go back to problems",
  "the second one",
  "no I mean Capacity Gap",
  "what should I do now?",
  "why are you recommending this?",
  "are you sure",
  "I don’t know",
  "show me scenarios",
  "compare them",
  "the first one",
  "and the other one?",
  "I like Demand Surge",
  "is that already a decision",
  "Approve Demand Surge",
  "what about weather in Paris",
  "go back to the problem",
  "are we ready",
  "start it",
  "who's owning this",
  "any blockers",
  "we're delayed",
  "still on track?",
  "should we change the plan",
  "Add a Risk called Late Parts.",
  "no cancel",
  "show me KPIs",
  "show me evidence",
  "show me goals",
  "now tell me about Demand Surge",
  "investigate it",
  "what about the first problem?",
  "how is execution going",
  "did the decision cause better delivery",
  "thanks",
];

seedReadyCsv();
const longSession = runJourney("LONG-50", "mixed", "Long conversation stress", longUtterances);

const deferred002 = runJourney("DEF-002", "C", "Deferred MRA-1-002 explicit approve", [
  "show scenarios",
  "Compare them.",
  "Approve Demand Surge",
]);

const deferred008 = runJourney("DEF-008", "A", "Deferred MRA-1-008 investigate it", [
  "show me all problems",
  "focus on Capacity Gap",
  "now tell me about Demand Surge",
  "investigate it",
]);

const deferred012 = runJourney("DEF-012", "B", "Deferred MRA-1-012 collection kinds", [
  "show me goals",
  "show me KPIs",
  "show me evidence",
  "show me outcomes",
  "show me data objects",
]);

let navPrevious: Turn | undefined;
const navTurns: ReturnType<typeof snapshot>[] = [];
function navSay(utterance: string) {
  navPrevious = runTurn(utterance, navPrevious);
  navTurns.push(snapshot(utterance, navPrevious));
}
navSay("show me problems");
navSay("Capacity Gap");
if (navPrevious) {
  const clicked = {
    ...navPrevious,
    nextRuntimeState: selectNexoraMVPInteractionSubject(navPrevious.nextRuntimeState, "ctx-problem-margin"),
  } as Turn;
  navPrevious = clicked;
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
navSay("go back to the problem");
if (navPrevious) {
  navPrevious = {
    ...navPrevious,
    nextRuntimeState: resetNexoraMVPObjectInteractionOverview(navPrevious.nextRuntimeState),
  } as Turn;
  navTurns.push(snapshot("(Overview reset)", navPrevious, { synthetic: "overview" }));
}
navSay("whats on stage");

const journeys = [
  j1, j2, j3, j4, j5, j6, j7, j8, j9, j10,
  longSession, deferred002, deferred008, deferred012,
  { id: "NAV-stress", persona: "C", title: "Stage click / back / forward", turns: navTurns, last: navPrevious },
];

resetCsvRealDataImportStoreForTests();
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "runtime-turns.json"),
  JSON.stringify(
    {
      identity: "NPA-T MRA:3/RuntimeManagerSimulation",
      recordedAt: new Date().toISOString(),
      validationOnly: true,
      longSessionTurns: longUtterances.length,
      journeys: journeys.map(({ last: _last, ...rest }) => rest),
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    identity: "NPA-T MRA:3/RuntimeManagerSimulation",
    journeys: journeys.length,
    turns: journeys.reduce((n, j) => n + j.turns.length, 0),
    longSessionTurns: longUtterances.length,
    leaks: journeys.flatMap((j) => j.turns.filter((t) => t.leak).map((t) => `${j.id}:${t.utterance}`)),
  }),
);
