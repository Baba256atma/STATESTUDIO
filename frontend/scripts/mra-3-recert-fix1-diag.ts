import { executeNexoraConversationalExperience } from "../app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "../app/lib/conversational-control/conversationalIntentResolver.ts";
import { classifyExecutiveInvestigationAsk } from "../app/lib/conversational-control/conversationalIntentNormalization.ts";
import {
  csvImportCandidateId,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "../app/lib/data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  suggestCsvColumnMappings,
} from "../app/lib/data-reality/csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "../app/lib/data-reality/csvSemanticUnderstanding.ts";
import { projectManagerObjectConversationalSubjects } from "../app/lib/manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

function overview() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function run(u: string, p?: Turn) {
  return executeNexoraConversationalExperience({
    utterance: u,
    executiveContext: p?.nextExecutiveContext,
    conversationContext: p?.nextConversationContext,
    executiveSubjects: subjects,
    runtimeState: p?.nextRuntimeState ?? overview(),
    catalog,
    previousManagerObjectSession: p?.managerObjectTurn.session ?? null,
    scenarioSession: p?.nextScenarioSession ?? null,
    decisionSession: p?.nextDecisionSession ?? null,
    allowActiveStageContext: false,
    lastAppliedCommandId: p?.commandResult?.command?.commandId ?? null,
    messageIdSeed: `diag-${u}`,
  });
}

function dump(label: string, t: Turn) {
  console.log("\n====", label);
  console.log("raw cc1", resolveNexoraConversationalIntent({ utterance: t.intentResult.intent.normalizedUtterance }).intent.kind);
  console.log("cc1 kind/hints", t.intentResult.intent.kind, t.intentResult.intent.targetHints, t.intentResult.intent.scenarioPayload);
  console.log("investigationAsk", classifyExecutiveInvestigationAsk(t.intentResult.intent.normalizedUtterance));
  console.log("nlu op", t.contextualManagerMeaning.requestedOperation, t.contextualManagerMeaning.provenance, t.contextualManagerMeaning.continuityMove);
  console.log("nlu obj", t.contextualManagerMeaning.objectReference);
  console.log("primary", t.contextResult.context.primarySubject);
  console.log("currentSubject", t.nextExecutiveContext.currentSubject);
  console.log("currentScenario", t.nextExecutiveContext.currentScenario);
  console.log("continuity", t.managerObjectTurn.session.conversationContinuity);
  console.log("comp", {
    resolved: t.trace.compositionResolvedSubjectId,
    resolvedKind: t.trace.compositionResolvedSubjectKind,
    candidate: t.trace.compositionCandidateSubjectId,
    selected: t.trace.compositionSelectedSubjectId,
    compatible: t.trace.compositionFidelityCompatible,
    stale: t.trace.compositionStaleScenarioBlocked,
  });
  console.log("scenarioSession", t.nextScenarioSession?.activeScenarioId);
  console.log("command", t.commandResult?.command?.kind, t.commandResult?.command);
  console.log("invId", t.managerObjectTurn.session.investigationSubjectId);
  console.log("explore0", t.managerObjectTurn.exploration.recommendedPaths[0]);
  console.log("resp", t.response.slice(0, 280));
}

const named = run("Demand Surge");
dump("Demand Surge", named);
dump("explain it", run("explain it", named));
dump("tell me more about it", run("tell me more about it", named));
dump("what else", run("what else do we know about it?", named));
dump("impact", run("what impact could it have?", named));
dump("decision more", run("tell me more about it", run("Approve Repricing", run("show me scenarios"))));
dump("decision explain", run("explain it", run("Approve Repricing", run("show me scenarios"))));
dump("repricing focus", run("Approve Repricing"));
dump("repricing more", run("tell me more about it", run("Approve Repricing")));

const shown = run("Demand Surge", run("show me scenarios"));
dump("show→Demand Surge", shown);
dump("show→tell me more", run("tell me more about it", shown));
dump("show→explain it", run("explain it", shown));

const T0 = "2026-09-10T20:00:00.000Z";
const AMBIGUOUS = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";
resetCsvRealDataImportStoreForTests();
{
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
    status: "preview" as const,
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

let j4 = run("show me scenarios");
j4 = run("is there any CSV files?", j4);
j4 = run("explain it", j4);
j4 = run("Capacity Gap", j4);
j4 = run("explain it", j4);
dump("J4 Demand Surge", (j4 = run("Demand Surge", j4)));
dump("J4 tell me more", run("tell me more about it", j4));
dump("J4 explain it", run("explain it", j4));
