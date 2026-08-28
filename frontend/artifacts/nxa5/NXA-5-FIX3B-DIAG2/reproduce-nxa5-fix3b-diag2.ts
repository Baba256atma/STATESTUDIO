/**
 * NXA:5-FIX3B-DIAG2 — read-only reproduction. Does not change production/tests.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveNexoraConversationalIntent } from "../../../app/lib/conversational-control/conversationalIntentResolver.ts";
import { normalizeNexoraConversationalUtterance } from "../../../app/lib/conversational-control/conversationalIntentNormalization.ts";
import { executeNexoraConversationalExperience } from "../../../app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyManagerObjectSession } from "../../../app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../../../app/lib/manager-object/managerObjectCatalog.ts";
import { interpretCanonicalManagerMeaning } from "../../../app/lib/manager-object/canonicalManagerMeaningInterpreter.ts";
import { interpretExecutiveCollectionQuery } from "../../../app/lib/manager-object/nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import {
  inferExpectedInformation,
  isContextualShortAnswer,
} from "../../../app/lib/manager-object/nexoraNca2ConversationState.ts";
import { interpretExecutiveComparisonMeaning } from "../../../app/lib/manager-object/nexoraNcaPost4CollectionComparison.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../../../app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectConversationPathTrace } from "../../../app/lib/nexora-certification/nxaConversationPathTrace.ts";
import { createConversationDiagnosis } from "../../../app/lib/nexora-certification/nxaConversationDiagnosis.ts";
import {
  getDiagnosticStatus,
  installDiagnosticConsoleHelper,
  isDiagnosticEnabled,
} from "../../../app/lib/runtime/diagnosticSwitch.ts";

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

installDiagnosticConsoleHelper();
const diagnostics = (globalThis as unknown as {
  nexoraDiagnostics: {
    enableScope: (s: string) => unknown;
    disableScope: (s: string) => unknown;
  };
}).nexoraDiagnostics;
diagnostics.enableScope("nxaConversation");

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function slimState(turn: ReturnType<typeof executeNexoraConversationalExperience>) {
  const nca = turn.ncaConversationState;
  const session = turn.managerObjectTurn.session;
  return {
    response: turn.response,
    intentKind: turn.intentResult.intent.kind,
    nluOp: turn.naturalLanguageUnderstanding.requestedOperation,
    nluIntent: turn.naturalLanguageUnderstanding.communicativeIntent,
    nluSubject: turn.naturalLanguageUnderstanding.objectReference?.canonicalName ?? null,
    nluKind: turn.naturalLanguageUnderstanding.objectReference?.subjectKind ?? null,
    nluAmbiguity: turn.naturalLanguageUnderstanding.ambiguity,
    collectionQuery: interpretExecutiveCollectionQuery(turn.trace.utterance),
    pendingClarification: session.pendingClarification
      ? {
          question: session.pendingClarification.question,
          reason: session.pendingClarification.reason,
          expectedAnswer: session.pendingClarification.expectedAnswer,
          loopCount: session.pendingClarification.loopCount,
          candidates: session.pendingClarification.candidates.map((item) => ({
            id: item.subjectId,
            name: item.canonicalName,
            kind: item.subjectKind,
          })),
        }
      : null,
    nca2Pending: nca?.pendingQuestion
      ? {
          question: nca.pendingQuestion.question,
          purpose: nca.pendingQuestion.purpose,
          expectedInformation: nca.pendingQuestion.expectedInformation,
          status: nca.pendingQuestion.status,
          valid: nca.pendingQuestion.valid,
          inferredExpected: nca.pendingQuestion.question
            ? inferExpectedInformation(nca.pendingQuestion.question)
            : null,
        }
      : null,
    nca2Move: turn.ncaDialogueMove ?? nca?.dialogueMove ?? null,
    lastAnswer: nca?.lastAnswer ?? null,
    answeredMissing: nca?.answeredMissing ?? [],
    lastCollection: nca?.lastCollection ?? null,
    activeComparison: nca?.activeComparison ?? null,
    activeSubject: nca?.activeSubject ?? null,
    clarificationAction: turn.clarificationTurn?.action ?? null,
    clarificationQuestion: turn.clarificationTurn?.question ?? null,
    post4: turn.ncaPost4Comparison
      ? {
          criterion: turn.ncaPost4Comparison.criterion,
          mode: turn.ncaPost4Comparison.mode,
          ids: turn.ncaPost4Comparison.candidateSet.candidateIds,
        }
      : null,
    director: {
      intent: turn.directorPlan?.intent ?? null,
      mutation: turn.directorPlan?.mutationRequired ?? null,
      reason: turn.directorPlan?.reason ?? null,
      stageEffect: turn.directorPlan?.stageEffect ?? null,
    },
    stage: {
      mode: turn.nextRuntimeState.mode,
      focus: turn.nextRuntimeState.focusedSubject?.id ?? null,
      collection: turn.nextRuntimeState.collectionContext?.category ?? null,
      members: turn.nextRuntimeState.collectionContext?.objectIds ?? [],
      shouldCommit: turn.shouldCommitRuntime,
    },
    investigation: session.investigationSubjectId ?? null,
    managerObservations: session.managerObservations ?? [],
    observationCount: (session.managerObservations ?? []).length,
    navigationGoal: turn.managerObjectTurn.navigation.goal,
    evidenceTrace: {
      explanationEvidence: turn.managerObjectTurn.explanation.evidence.map((item) => item.text),
      trustedClaims: turn.trustedCommunication.claims.map((item) => ({
        kind: item.kind,
        text: item.text,
        confidence: item.confidence,
      })),
    },
    executiveContext: {
      subject: turn.nextExecutiveContext.currentSubject,
      problem: turn.nextExecutiveContext.currentProblem,
      execution: turn.nextExecutiveContext.currentExecution,
      decision: turn.nextExecutiveContext.currentDecision,
      goal: turn.nextExecutiveContext.currentGoal,
    },
    nxa4: turn.proactiveAdvisoryEvaluation
      ? {
          shouldSpeak: turn.proactiveAdvisoryEvaluation.disposition === "SPEAK",
          message: turn.proactiveAdvisoryEvaluation.managerMessage,
        }
      : null,
    path: null as ReturnType<typeof projectConversationPathTrace> | null,
  };
}

function runSequence(utterances: readonly string[]) {
  let previous: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
  let runtime = initial();
  const turns = [];
  for (const utterance of utterances) {
    const normalized = normalizeNexoraConversationalUtterance(utterance);
    const cc1 = resolveNexoraConversationalIntent({ utterance });
    const nlu = interpretCanonicalManagerMeaning({ utterance, subjects });
    const before = previous
      ? {
          pendingClarification: previous.managerObjectTurn.session.pendingClarification?.question ?? null,
          nca2Pending: previous.ncaConversationState?.pendingQuestion?.question ?? null,
          nca2Expected: previous.ncaConversationState?.pendingQuestion?.expectedInformation ?? null,
          lastAnswer: previous.ncaConversationState?.lastAnswer ?? null,
          collection: previous.nextRuntimeState.collectionContext?.category ?? null,
          members: previous.nextRuntimeState.collectionContext?.objectIds ?? [],
          focus: previous.nextRuntimeState.focusedSubject?.id ?? null,
          answeredMissing: previous.ncaConversationState?.answeredMissing ?? [],
          claims: previous.trustedCommunication.claims,
          investigation: previous.managerObjectTurn.session.investigationSubjectId ?? null,
          observations: previous.managerObjectTurn.session.managerObservations ?? [],
          execCtxProblem: previous.nextExecutiveContext.currentProblem,
          execCtxExecution: previous.nextExecutiveContext.currentExecution,
        }
      : null;
    const shortAnswer = isContextualShortAnswer(
      utterance,
      previous?.ncaConversationState?.pendingQuestion ?? null,
      previous?.ncaConversationState?.lastOfferedOptions ?? [],
    );
    const result = executeNexoraConversationalExperience({
      utterance,
      runtimeState: runtime,
      catalog,
      executiveSubjects: subjects,
      conversationContext: previous?.nextConversationContext,
      executiveContext: previous?.nextExecutiveContext,
      previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
      scenarioSession: previous?.nextScenarioSession ?? null,
      decisionSession: previous?.nextDecisionSession ?? null,
      messageIdSeed: `nxa5-fix3b-diag2-${utterance.slice(0, 32)}`,
    });
    const path = projectConversationPathTrace({
      utterance,
      inheritedSubjectId: runtime.focusedSubject?.id ?? null,
      result,
    });
    const after = slimState(result);
    after.path = path;
    turns.push({
      utterance,
      normalized,
      cc1Kind: cc1.intent.kind,
      cc1Hints: cc1.intent.targetHints,
      nluOp: nlu.requestedOperation,
      nluIntent: nlu.communicativeIntent,
      nluSubject: nlu.objectReference?.canonicalName ?? null,
      nluAmbiguity: nlu.ambiguity,
      collectionQuery: interpretExecutiveCollectionQuery(utterance),
      comparison: interpretExecutiveComparisonMeaning({
        utterance,
        intentKind: cc1.intent.kind,
        activeCollectionPresent: Boolean(runtime.collectionContext),
      }),
      wouldNca2ConsumeAsShortAnswer: shortAnswer,
      before,
      after,
      mutated: before
        ? {
            nca2Pending: before.nca2Pending !== (after.nca2Pending?.question ?? null),
            lastAnswer: JSON.stringify(before.lastAnswer) !== JSON.stringify(after.lastAnswer),
            answeredMissing: JSON.stringify(before.answeredMissing) !== JSON.stringify(after.answeredMissing),
            collection: before.collection !== after.stage.collection,
            members: JSON.stringify(before.members) !== JSON.stringify(after.stage.members),
            focus: before.focus !== after.stage.focus,
            claimsCount: before.claims.length !== after.evidenceTrace.trustedClaims.length,
            investigation: JSON.stringify(before.investigation) !== JSON.stringify(after.investigation),
            observations: JSON.stringify(before.observations) !== JSON.stringify(after.managerObservations),
            execProblem: JSON.stringify(before.execCtxProblem) !== JSON.stringify(after.executiveContext.problem),
            execExecution: JSON.stringify(before.execCtxExecution) !== JSON.stringify(after.executiveContext.execution),
            shouldCommit: after.stage.shouldCommit,
          }
        : null,
    });
    previous = result;
    runtime = result.nextRuntimeState;
  }
  return turns;
}

const fullConversation = runSequence([
  "hi",
  "show problems",
  "show all executive",
  "I am asking of Executions",
  "show me execution",
]);

const matrix = {
  D1: runSequence(["show executions"]),
  D2: runSequence(["show execution"]),
  D3: runSequence(["show me all executions"]),
  D4: runSequence(["show all executive"]),
  D5: runSequence(["show problems", "show all executive"]),
  D6: runSequence(["show problems", "show all executive", "I mean Executions"]),
  D7: runSequence(["show problems", "which one is important?", "show executions"]),
  D8: runSequence(["show problems", "which one is important?", "urgency"]),
  D9: runSequence(["show problems", "why is Capacity Gap happening?", "orders increased 20%"]),
  D10: runSequence(["show scenarios", "exlpain Demand Surge"]),
};

const turnA = fullConversation[2]!;
const turnB = fullConversation[3]!;
const turnC = fullConversation[4]!;

function diagnosis(input: Parameters<typeof createConversationDiagnosis>[0] & {
  impactClassification: readonly string[];
  severity: string;
  fix3bAttribution: string;
}) {
  return { ...createConversationDiagnosis(input), impactClassification: input.impactClassification, severity: input.severity, fix3bAttribution: input.fix3bAttribution };
}

const diagnoses = {
  irrelevantClarification: diagnosis({
    defectId: "NXA-5-FIX3B-DIAG2-A",
    utteranceSequence: ["show problems", "show all executive"],
    setup: "Problems collection active, then show all executive.",
    currentFocus: null,
    activeCollection: "problem",
    journeyOrDialogue: turnA.after.nca2Move,
    refreshOrRestoration: null,
    expected: "Relevant clarification among actual candidates (e.g. Executions vs Executive Overview) or high-confidence collection resolve.",
    actual: turnA.after.response,
    firstDivergentLayer: "CC:1 does not match show-execution (noun executive ≠ executions?). Intent is focus with unresolved NLU referent. FINAL:6.3 then asks MISSING_SUBJECT using current Problems members (Capacity Gap, Margin Pressure), not Executions vs Executive Overview. KIND_LABEL object→KPI is the mixed-kind composer; this catalog used same-kind problem names.",
    authoritativeOwner: "FINAL:6.3 clarification gate/question composer + CC:1 collection noun list",
    neighboringBehaviors: [
      "interpretExecutiveCollectionQuery requires executions? not executive",
      "CC:1 show-execution regex requires executions?",
      "FIX3B comparison-criterion is not this pending type",
    ],
    focusedReproductionCommand: "tsx artifacts/nxa5/NXA-5-FIX3B-DIAG2/reproduce-nxa5-fix3b-diag2.ts",
    failureClass: "deterministic",
    evidenceRequiredBeforeFix: [],
    verdict: "REPRODUCED",
    impactClassification: ["IRRELEVANT_CLARIFICATION", "REFERENCE_RESOLUTION_DEFECT", "UNCOVERED_CAPABILITY_GAP", "PRE_EXISTING_REGRESSION"],
    severity: "P2",
    fix3bAttribution: "unrelated-to-FIX3B / pre-existing 6.3+CC:1 gap; Problems context supplies mixed-kind candidates",
  }),
  correctionMisclassification: diagnosis({
    defectId: "NXA-5-FIX3B-DIAG2-B",
    utteranceSequence: ["show problems", "show all executive", "I am asking of Executions"],
    setup: "After 6.3 Problem/KPI clarification pending.",
    currentFocus: null,
    activeCollection: turnB.after.stage.collection,
    journeyOrDialogue: turnB.after.nca2Move,
    refreshOrRestoration: null,
    expected: "Meta-correction to Executions collection; no hypothesis strengthening.",
    actual: turnB.after.response,
    firstDivergentLayer: "NCA:2 isContextualShortAnswer + extractAnswer(FREE_TEXT) consumes the utterance as ANSWER_NEXORA because inferExpectedInformation(6.3 question) is FREE_TEXT. composeNca2ContinuityResponse then emits capacity-pressure copy. 6.3 isNewCompleteRequest/isCorrection do not treat 'I am asking of' as collection correction. lockPresentedResponse is false on the clarify finish path so NCA:2 overwrites the 6.3 re-ask.",
    authoritativeOwner: "NCA:2 interpretNcaDialogueTurn / composeNca2ContinuityResponse; orchestrator clarify path does not lock NCA:2",
    neighboringBehaviors: [
      "isCorrectionUtterance requires 'i was asking about' not 'i am asking of'",
      "CORRECT NLU cues are i meant / was talking about, not I am asking of",
      "FIX3B PRIORITY extractAnswer would reject this text; that path is not active here",
    ],
    focusedReproductionCommand: "tsx artifacts/nxa5/NXA-5-FIX3B-DIAG2/reproduce-nxa5-fix3b-diag2.ts",
    failureClass: "deterministic",
    evidenceRequiredBeforeFix: [],
    verdict: "REPRODUCED",
    impactClassification: ["MANAGER_CORRECTION_MISCLASSIFICATION", "FALSE_EVIDENCE_CLAIM", "STALE_DIALOGUE_STATE", "PRE_EXISTING_REGRESSION"],
    severity: "P1",
    fix3bAttribution: "exposed/interaction: FIX3B did not introduce FREE_TEXT acceptance or capacity-pressure copy; clarify-path unlock predates FIX3B",
  }),
  hijack: diagnosis({
    defectId: "NXA-5-FIX3B-DIAG2-C",
    utteranceSequence: ["show problems", "show all executive", "I am asking of Executions", "show me execution"],
    setup: "6.3 pendingClarification survives turn B; loopCount increments.",
    currentFocus: null,
    activeCollection: turnC.after.stage.collection,
    journeyOrDialogue: turnC.after.nca2Move,
    refreshOrRestoration: null,
    expected: "show-execution collection via existing CC:1 regex executions?",
    actual: turnC.after.response,
    firstDivergentLayer: "FINAL:6.3 pending path: show-execution is not isNewCompleteRequest (needs objectReference plus FOCUS/EXPLAIN/COMPARE/INVESTIGATE; collection intents are omitted). Unmatched pending re-ask reaches loopCount>=2 fail copy. finish() still runs POST:3+DIR; shouldCommitRuntime ORs director.mutationRequired, so Stage commits Executions while Advisor shows the fail sentence.",
    authoritativeOwner: "FINAL:6.3 isNewCompleteRequest + orchestrator early clarify/fail return",
    neighboringBehaviors: [
      "CC:1 isolated would classify show me execution as show-execution",
      "FIX3B B9 covers NCA:2 comparison-criterion vs show decisions, not 6.3 pendingClarification",
      "isContextualShortAnswer already excludes utterances starting with show",
    ],
    focusedReproductionCommand: "tsx artifacts/nxa5/NXA-5-FIX3B-DIAG2/reproduce-nxa5-fix3b-diag2.ts",
    failureClass: "deterministic",
    evidenceRequiredBeforeFix: [],
    verdict: "REPRODUCED",
    impactClassification: ["PENDING_QUESTION_HIJACK", "EXPLICIT_COMMAND_PRECEDENCE_DEFECT", "ADVISOR_STAGE_DIVERGENCE", "UNCOVERED_CAPABILITY_GAP"],
    severity: "P1",
    fix3bAttribution: "unrelated-to-FIX3B 6.3 pending vs collection-command; suite lacked this interruption case",
  }),
};

diagnostics.disableScope("nxaConversation");

writeFileSync(join(outDir, "full-conversation-traces.json"), JSON.stringify({ identity: "NXA:5-FIX3B-DIAG2/FullConversation", nxaConversationAfterDisable: isDiagnosticEnabled("nxaConversation"), diagnosticStatus: getDiagnosticStatus(), turns: fullConversation }, null, 2));
writeFileSync(join(outDir, "d1-d10-matrix.json"), JSON.stringify({
  identity: "NXA:5-FIX3B-DIAG2/IndependentMatrix",
  summary: Object.fromEntries(Object.entries(matrix).map(([id, turns]) => [id, turns.map((turn) => ({
    utterance: turn.utterance,
    response: turn.after.response,
    intent: turn.cc1Kind,
    dir: turn.after.director.intent,
    collection: turn.after.stage.collection,
    members: turn.after.stage.members,
    nca2Move: turn.after.nca2Move,
    clarAction: turn.after.clarificationAction,
  }))])),
  turns: matrix,
}, null, 2));
writeFileSync(join(outDir, "diagnosis-records.json"), JSON.stringify(diagnoses, null, 2));
writeFileSync(join(outDir, "state-audit-turn-B.json"), JSON.stringify({
  identity: "NXA:5-FIX3B-DIAG2/StateAuditTurnB",
  utterance: "I am asking of Executions",
  before: turnB.before,
  after: {
    response: turnB.after.response,
    nca2Pending: turnB.after.nca2Pending,
    lastAnswer: turnB.after.lastAnswer,
    answeredMissing: turnB.after.answeredMissing,
    pendingClarification: turnB.after.pendingClarification,
    stage: turnB.after.stage,
    director: turnB.after.director,
    investigation: turnB.after.investigation,
    managerObservations: turnB.after.managerObservations,
    evidenceTrace: turnB.after.evidenceTrace,
    executiveContext: turnB.after.executiveContext,
    navigationGoal: turnB.after.navigationGoal,
  },
  mutated: turnB.mutated,
}, null, 2));

console.log(JSON.stringify({
  nxaConversationAfterDisable: isDiagnosticEnabled("nxaConversation"),
  full: fullConversation.map((turn) => ({ u: turn.utterance, r: turn.after.response, intent: turn.cc1Kind, move: turn.after.nca2Move, clar: turn.after.clarificationAction, dir: turn.after.director.intent, col: turn.after.stage.collection, commit: turn.after.stage.shouldCommit })),
  D1: matrix.D1[0]!.after.response,
  D2: matrix.D2[0]!.after.response,
  D3: matrix.D3[0]!.after.response,
  D4: matrix.D4[0]!.after.response,
  D7: matrix.D7.map((turn) => turn.after.response),
  D8: matrix.D8.at(-1)!.after.response,
  D10: { intent: matrix.D10[1]!.cc1Kind, dir: matrix.D10[1]!.after.director.intent },
  turnBMutated: turnB.mutated,
}, null, 2));
