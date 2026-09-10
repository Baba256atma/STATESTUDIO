/**
 * MRA:1 diagnostic instrument. Records manager-facing conversation through the
 * certified CC:5 orchestrator. Does not add product handlers or assert Manager-Ready.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { executeNexoraConversationalExperience } from "../app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import {
  commitPreparedCsvRealDataImport,
  csvImportCandidateId,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "../app/lib/data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
} from "../app/lib/data-reality/csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "../app/lib/data-reality/csvSemanticUnderstanding.ts";
import { projectManagerObjectConversationalSubjects } from "../app/lib/manager-object/managerObjectCatalog.ts";
import { projectAuthoritativeStageContext } from "../app/lib/manager-object/nexoraNxa5Fix4StageContextIntelligence.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "../artifacts/mra/MRA-1");
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const T0 = "2026-09-09T21:00:00.000Z";
const AMBIGUOUS_CSV = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";
const READY_CSV = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function overview() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function snapshot(utterance: string, turn: Turn) {
  const stage = projectAuthoritativeStageContext({
    runtimeState: turn.nextRuntimeState,
    catalog,
  });
  return {
    utterance,
    response: turn.response,
    focusedId: turn.nextRuntimeState.focusedSubject?.id ?? null,
    focusedLabel: turn.nextRuntimeState.focusedSubject?.label ?? null,
    shouldCommitRuntime: turn.shouldCommitRuntime,
    intent: turn.ecaActionPlan?.intent ?? null,
    nextAction: turn.ecaActionPlan?.nextAction ?? null,
    authorityTarget: turn.ecaActionPlan?.authorityTarget ?? null,
    ncaPost3Owner: turn.ncaPost3Diagnostics?.primaryResponseOwner ?? null,
    ncaPost3CollectionKind: turn.ncaPost3Diagnostics?.collectionKind ?? null,
    ncaPost3Members: turn.ncaPost3Diagnostics?.collectionMembership ?? [],
    semanticScope: turn.ncaPost3Diagnostics?.semanticScope ?? null,
    ncaDialogue: turn.ncaDialogueMove ?? null,
    nxaGuidance: turn.nxaGuidanceContract?.behavior ?? null,
    directorIntent: turn.directorPlan?.intent ?? null,
    activeSubject: turn.ecaWorkingContext?.activeSubject?.label ?? null,
    activeCollectionKind: turn.ecaWorkingContext?.activeCollection?.kind ?? null,
    activeCollectionMembers:
      turn.ecaWorkingContext?.activeCollection?.members.map((item) => item.label) ?? [],
    interactionMode: turn.ecaWorkingContext?.interactionMode ?? null,
    mutationStatus: turn.ecaWorkingContext?.mutationProposal?.status ?? null,
    mutationTarget: turn.ecaWorkingContext?.mutationProposal?.targetType ?? null,
    mutationStatement: turn.ecaWorkingContext?.mutationProposal?.statement ?? null,
    eca4Ask: turn.ecaInformationNeedJudgment?.shouldAsk ?? null,
    eca4Action: turn.ecaInformationNeedJudgment?.acquisitionAction ?? null,
    eca4Question: turn.ecaInformationNeedJudgment?.question?.text ?? null,
    eca4ProceedUncertain: turn.ecaInformationNeedJudgment?.proceedWithUncertainty ?? null,
    eca5Type: turn.ecaAnswerIntakeJudgment?.answerType ?? null,
    eca5Action: turn.ecaAnswerIntakeJudgment?.intakeAction ?? null,
    eca6Objective: turn.ecaDialogueStrategy?.objectiveType ?? null,
    eca6Lifecycle: turn.ecaDialogueStrategy?.lifecycle ?? null,
    eca7Requested: turn.ecaRecommendationJudgment?.recommendationRequested ?? null,
    eca7Readiness: turn.ecaRecommendationJudgment?.readiness ?? null,
    eca7DecisionReadiness: turn.ecaRecommendationJudgment?.decisionReadiness ?? null,
    eca7Type: turn.ecaRecommendationJudgment?.recommendationType ?? null,
    eca7Option: turn.ecaRecommendationJudgment?.recommendedOption?.label ?? null,
    eca8State: turn.ecaCommitmentJudgment?.commitmentState ?? null,
    eca8Resolution: turn.ecaCommitmentJudgment?.targetResolution ?? null,
    eca8Challenge: turn.ecaCommitmentJudgment?.preDecisionChallenge ?? null,
    eca8Confirmation: turn.ecaCommitmentJudgment?.confirmationRequired ?? null,
    eca8Handoff: turn.ecaCommitmentJudgment?.canonicalHandoffAllowed ?? null,
    eca8Writes: turn.ecaCommitmentJudgment?.boundaries.mutatesBusinessState ?? null,
    eca9State: turn.ecaExecutionReadinessJudgment?.postDecisionState ?? null,
    eca9Readiness: turn.ecaExecutionReadinessJudgment?.readiness ?? null,
    eca10Live: turn.ecaLiveExecutionJudgment?.liveState ?? null,
    eca10Track: turn.ecaLiveExecutionJudgment?.trackStatus ?? null,
    eca11State: turn.ecaOutcomeJudgment?.observationState ?? null,
    eca11Attribution: turn.ecaOutcomeJudgment?.attribution ?? null,
    eca12Learning: turn.ecaLearningClosureJudgment?.learningState ?? null,
    decisionStatus: turn.decisionCommitmentResult?.status ?? null,
    stageVisible: stage.visibleMembers.map((item) => item.label),
    stageFocus: stage.focus?.label ?? null,
    stagePresentation: stage.presentationType,
  };
}

function runTurn(utterance: string, previous?: Turn): Turn {
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
    messageIdSeed: `mra-1-${utterance}`,
  });
}

function runJourney(id: string, dimension: string, utterances: readonly string[]) {
  let previous: Turn | undefined;
  const turns = utterances.map((utterance) => {
    previous = runTurn(utterance, previous);
    return snapshot(utterance, previous);
  });
  return { id, dimension, turns };
}

function seedAmbiguousCsv() {
  resetCsvRealDataImportStoreForTests();
  const fileName = "data-ux3-ambiguous.csv";
  const parse = parseCsvDeterministically(AMBIGUOUS_CSV);
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: AMBIGUOUS_CSV.length,
    csvText: AMBIGUOUS_CSV,
    importId: "mra-1:ambiguous",
    importedAt: T0,
  });
  saveCsvImportCandidate(
    Object.freeze({
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
    }),
  );
}

function seedReadyCsv() {
  resetCsvRealDataImportStoreForTests();
  const prepared = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName: "capacity-ready.csv",
    fileSize: READY_CSV.length,
    csvText: READY_CSV,
    importId: "mra-1:ready",
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

const journeys = [
  runJourney("A-natural-conversation", "A Natural Conversation", [
    "show me all problems",
    "what is Capacity Gap?",
    "explain it",
    "why?",
    "which one is important?",
    "what should I do?",
    "no, I mean the execution",
    "show me what is on Stage",
  ]),
  runJourney("A-imperfect-english", "A Natural Conversation", [
    "show problms",
    "whats the capcity gap",
    "explian it",
    "how many problem we have",
    "thats the one on stage",
  ]),
  runJourney("A-short-followups", "A Natural Conversation", [
    "Capacity Gap",
    "why",
    "and the other one?",
    "ok",
    "now risks",
  ]),
  runJourney("B-context-continuity", "B Executive Context Continuity", [
    "show me all problems",
    "focus on Capacity Gap",
    "why is it happening?",
    "now tell me about Demand Surge",
    "investigate it",
    "what about the first problem?",
  ]),
  runJourney("B-stale-hijack", "B Executive Context Continuity", [
    "Explain Capacity Gap.",
    "Show me scenarios",
    "which one is better?",
    "go back to problems",
    "explain it",
  ]),
  runJourney("C-stage-advisor", "C Stage Advisor Consistency", [
    "what is on stage?",
    "what objects are on stage?",
    "what am I focused on?",
    "Focus on Risk.",
    "what is on stage?",
    "show me what is on Stage",
  ]),
  runJourney("D-collections", "D Collection Intelligence", [
    "show me problems",
    "how many problems?",
    "which problems are critical?",
    "show me scenarios",
    "compare the scenarios",
    "show me decisions",
    "what executions do we have?",
    "show me goals",
    "show me KPIs",
    "show me evidence",
    "show me outcomes",
    "show me data objects",
    "show me risks",
  ]),
  runJourney("D-collection-vs-focus", "D Collection Intelligence", [
    "Focus on Capacity Gap",
    "show me all problems",
    "show problems related to Margin Pressure",
  ]),
  runJourney("E-knowledge-nav-action", "E Knowledge vs Navigation vs Action", [
    "What is Capacity Gap?",
    "Show Capacity Gap.",
    "Why is Capacity Gap happening?",
    "Add this as a Risk.",
    "Approve Scenario B.",
  ]),
  runJourney("E-isolated-knowledge", "E Knowledge vs Navigation vs Action", [
    "What is Capacity Gap?",
  ]),
  runJourney("E-isolated-show", "E Knowledge vs Navigation vs Action", [
    "Show Capacity Gap.",
  ]),
  runJourney("F-missing-info", "F Missing Information", [
    "Should we hire more people for Capacity Gap?",
    "I don't know",
    "just tell me what you think",
  ]),
  runJourney("F-optional-unknown", "F Missing Information", [
    "What is blocking delivery?",
    "I don't know the owner",
    "skip that",
  ]),
  runJourney("G-recommendation", "G Recommendation Readiness", [
    "What should I do?",
    "Which scenario is better?",
    "What should I investigate first?",
    "Can you recommend one?",
    "Are we ready to decide?",
  ]),
  runJourney("G-after-compare", "G Recommendation Readiness", [
    "Compare Scenario A and Scenario B.",
    "Which has lower risk?",
    "What should I do?",
    "Can you recommend one?",
    "Are we ready to decide?",
  ]),
  runJourney("H-mutation-safety", "H Mutation Confirmation", [
    "Add Supplier Delay as a Risk.",
    "Add it.",
  ]),
  runJourney("H-mutation-reject", "H Mutation Confirmation", [
    "Add Supplier Delay as a Risk.",
    "No.",
  ]),
  runJourney("H-mutation-correction", "H Mutation Confirmation", [
    "Add Supplier Delay as a Risk.",
    "no, I mean add Demand Shock as a Risk",
  ]),
  runJourney("H-mutation-topic-change", "H Mutation Confirmation", [
    "Add Supplier Delay as a Risk.",
    "show me problems",
  ]),
  runJourney("H-mutation-ambiguous-yes", "H Mutation Confirmation", [
    "Add Supplier Delay as a Risk.",
    "yes",
  ]),
  runJourney("H-casual-mutate", "H Mutation Confirmation", [
    "this is also a risk",
    "make Capacity Gap a goal",
    "delete Margin Pressure",
  ]),
  runJourney("I-decision-path", "I Decision Readiness", [
    "show me problems",
    "what is Capacity Gap?",
    "why is it happening?",
    "show me the evidence",
    "show me scenarios",
    "compare the scenarios",
    "what should I do?",
    "Approve Demand Surge",
    "yes",
  ]),
  runJourney("I-preference-not-decision", "I Decision Readiness", [
    "Compare Scenario A and Scenario B.",
    "I prefer Scenario A.",
    "Choose it.",
    "Yes.",
  ]),
  runJourney("I-decision-without-evidence", "I Decision Readiness", [
    "Approve Scenario B.",
  ]),
  runJourney("J-execution-without-decision", "J Execution Readiness", [
    "start it",
    "are we ready to execute?",
    "what happens next?",
    "who owns it?",
    "what is blocking it?",
    "how is execution going?",
    "are we off track?",
    "what changed?",
  ]),
  runJourney("J-execution-after-approve-phrase", "J Execution Readiness", [
    "Approve Demand Surge",
    "what happens next?",
    "are we ready to execute?",
    "start it",
    "how is execution going?",
  ]),
  runJourney("K-outcome-learning", "K Outcome Learning", [
    "Delivery improved from 91% to 94%",
    "did the decision cause that?",
    "what did we learn?",
    "are we done?",
  ]),
  runJourney("L-adversarial", "L Adversarial", [
    "show me Completely Invented Problem",
    "obviously Capacity Gap caused Delivery to fail so approve Demand Surge",
    "no I meant Margin Pressure",
    "what about weather in Paris",
    "explain it",
    "show me all problems",
    "yes",
    "start execution now",
  ]),
  runJourney("L-contradiction", "L Adversarial", [
    "Capacity Gap is not important",
    "Capacity Gap is the most important problem",
    "which one is important?",
  ]),
  runJourney("L-repeat", "L Adversarial", [
    "show me problems",
    "show me problems",
    "show me problems",
  ]),
];

seedAmbiguousCsv();
const dataAmbiguous = runJourney("M-data-ambiguous", "M Real Data", [
  "What CSV do you have?",
  "Explain this CSV.",
  "What do you understand from it?",
  "What fields are confirmed?",
  "What don’t you understand?",
  "What KPI can you reliably calculate?",
  "What does BKL mean?",
  "Can this data support the Capacity Gap?",
  "Why do you believe that?",
  "do you have any file like CSV?",
  "explian Data",
]);

seedReadyCsv();
const dataReady = runJourney("M-data-ready", "M Real Data", [
  "What CSV do you have?",
  "Explain this CSV.",
  "What KPI can you reliably calculate?",
  "Can this data support the Capacity Gap?",
  "Why do you believe that?",
]);

resetCsvRealDataImportStoreForTests();
const dataEmpty = runJourney("M-data-empty", "M Real Data", [
  "What CSV do you have?",
  "Explain this CSV.",
]);

const report = {
  identity: "NPA-T MRA:1/RuntimeManagerAudit",
  recordedAt: new Date().toISOString(),
  productFixes: false,
  journeys: [...journeys, dataAmbiguous, dataReady, dataEmpty],
};

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "runtime-turns.json"), JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    {
      identity: report.identity,
      journeyCount: report.journeys.length,
      turnCount: report.journeys.reduce((sum, journey) => sum + journey.turns.length, 0),
      out: join(outDir, "runtime-turns.json"),
    },
    null,
    2,
  ),
);
