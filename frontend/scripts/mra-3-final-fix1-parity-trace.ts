import { executeNexoraConversationalExperience } from "../app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
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
const T0 = "2026-09-10T21:00:00.000Z";
const AMBIGUOUS = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";
resetCsvRealDataImportStoreForTests();
const fileName = "data-ux3-ambiguous.csv";
const csvInput = Object.freeze({
  workspaceId: "overview" as const,
  fileName,
  fileSize: AMBIGUOUS.length,
  csvText: AMBIGUOUS,
  importId: "parity",
  importedAt: T0,
});
const parse = parseCsvDeterministically(AMBIGUOUS);
saveCsvImportCandidate(Object.freeze({
  workspaceId: "overview",
  candidateId: csvImportCandidateId("overview", fileName),
  fileName,
  status: "preview",
  input: csvInput,
  parse,
  mapping: interpretCsvSemantics({
    input: csvInput,
    parse,
    structural: suggestCsvColumnMappings(parse.columns, csvInput.importId),
  }),
  prepared: null,
  error: null,
  replacementSourceContextId: null,
}));

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;
let previous: Turn | undefined;

function run(utterance: string) {
  previous = executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `parity-${utterance}`,
  });
  const session = previous.managerObjectTurn.session;
  const continuity = session.conversationContinuity;
  const nca = session.ncaConversationState;
  console.log(JSON.stringify({
    utterance,
    intent: previous.intentResult.intent.kind,
    referent: previous.contextualManagerMeaning.objectReference?.canonicalName ?? null,
    kind: previous.contextualManagerMeaning.objectReference?.subjectKind ?? null,
    provenance: previous.contextualManagerMeaning.provenance,
    continuityId: continuity?.activeSubjectId ?? null,
    continuityKind: continuity?.activeSubjectKind ?? null,
    presentedIds: continuity?.presentedIds ?? [],
    lastCollection: nca?.lastCollection ?? null,
    ncaActive: nca?.activeSubject ?? null,
    dialogue: session.advisorDataDialogue ?? null,
    execCurrent: previous.nextExecutiveContext.currentSubject ?? null,
    stageFocus: previous.nextRuntimeState.focusedSubject?.label ?? null,
    stageCollection: previous.nextRuntimeState.collectionContext?.category ?? null,
    reply: previous.response.slice(0, 220),
  }, null, 2));
}

for (const utterance of [
  "show me scenarios",
  "is there any CSV files?",
  "explain it",
  "Capacity Gap",
  "explain it",
]) {
  run(utterance);
}
