/**
 * NXA:5-FIX3-DIAG — read-only reproduction. Writes artifacts only.
 * Does not change production or test sources.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveNexoraConversationalIntent } from "../../../app/lib/conversational-control/conversationalIntentResolver.ts";
import { normalizeNexoraConversationalUtterance } from "../../../app/lib/conversational-control/conversationalIntentNormalization.ts";
import { executeNexoraConversationalExperience } from "../../../app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { interpretCanonicalManagerMeaning } from "../../../app/lib/manager-object/canonicalManagerMeaningInterpreter.ts";
import { overlayConversationalIntentWithCanonicalMeaning } from "../../../app/lib/manager-object/nexoraMvpFinal61NaturalLanguageUnderstanding.ts";
import { createEmptyManagerObjectSession } from "../../../app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../../../app/lib/manager-object/managerObjectCatalog.ts";
import { interpretExecutiveComparisonMeaning } from "../../../app/lib/manager-object/nexoraNcaPost4CollectionComparison.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../../../app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectConversationPathTrace } from "../../../app/lib/nexora-certification/nxaConversationPathTrace.ts";
import { isDiagnosticEnabled } from "../../../app/lib/runtime/diagnosticSwitch.ts";

const outDir = dirname(fileURLToPath(import.meta.url));
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

type ExperienceResult = ReturnType<typeof executeNexoraConversationalExperience>;
type RuntimeState = ReturnType<typeof initial>;

function snapshotTurn(
  utterance: string,
  previous: ExperienceResult | undefined,
  runtime: RuntimeState,
) {
  const normalized = normalizeNexoraConversationalUtterance(utterance);
  const cc1 = resolveNexoraConversationalIntent({ utterance });
  const nlu = interpretCanonicalManagerMeaning({ utterance, subjects });
  const overlaid = overlayConversationalIntentWithCanonicalMeaning(cc1, nlu);
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
    messageIdSeed: `nxa5-fix3-diag-${utterance.slice(0, 24)}`,
  });
  const path = projectConversationPathTrace({
    utterance,
    inheritedSubjectId: runtime.focusedSubject?.id ?? null,
    result,
  });
  return {
    utterance,
    normalized,
    cc1Kind: cc1.intent.kind,
    cc1Hints: cc1.intent.targetHints.map((item) => item.raw),
    nluOperation: nlu.requestedOperation,
    nluSubject: nlu.objectReference?.canonicalName ?? null,
    nluIntent: nlu.communicativeIntent,
    overlaidKind: overlaid.intent.kind,
    overlaidHints: overlaid.intent.targetHints.map((item) => item.raw),
    commandKind: result.commandResult?.command?.kind ?? null,
    commandPrimary: result.commandResult?.command?.primaryTargetId ?? null,
    runtimeStatus: result.runtimeResult?.status ?? null,
    runtimeAction: result.runtimeResult?.runtimeActionKind ?? null,
    nxaNeed: result.nxaAdvisorContract?.need ?? null,
    nxaNavigationAllowed: result.nxaAdvisorContract?.navigationAllowed ?? null,
    nxa5Type: result.executiveJudgment?.judgmentType ?? null,
    nxa5Criterion: result.executiveJudgment?.criterion ?? null,
    nxa5Preferred: result.executiveJudgment?.preferredCandidateId ?? null,
    nxa5Comparability: result.executiveJudgment?.comparability ?? null,
    comparisonActive: result.ncaPost4Comparison != null,
    comparisonCriterion: result.ncaPost4Comparison?.criterion ?? null,
    comparisonMode: result.ncaPost4Comparison?.mode ?? null,
    comparisonSource: result.ncaPost4Comparison?.candidateSet.source ?? null,
    comparisonIds: result.ncaPost4Comparison?.candidateSet.candidateIds ?? [],
    collectionMembers: result.ncaPost3Diagnostics
      ? {
          kind: result.ncaPost3Diagnostics.collectionKind,
          ids: result.ncaTurn ? undefined : undefined,
        }
      : null,
    post3Kind: result.ncaPost3Diagnostics?.collectionKind ?? null,
    post3MemberCount: result.ncaConversationState?.lastCollection?.memberIds?.length ?? 0,
    lastCollectionKind: result.ncaConversationState?.lastCollection?.kind ?? null,
    lastCollectionIds: result.ncaConversationState?.lastCollection?.memberIds ?? [],
    directorIntent: result.directorPlan?.intent ?? null,
    directorMutation: result.directorPlan?.mutationRequired ?? null,
    directorReason: result.directorPlan?.reason ?? null,
    shouldCommitRuntime: result.shouldCommitRuntime,
    response: result.response,
    path,
    consoleScopeEnabled: isDiagnosticEnabled("nxaConversation"),
    result,
  };
}

function runSequence(id: string, utterances: readonly string[]) {
  let previous: ExperienceResult | undefined;
  let runtime = initial();
  const turns = [];
  for (const utterance of utterances) {
    const turn = snapshotTurn(utterance, previous, runtime);
    previous = turn.result;
    runtime = turn.result.nextRuntimeState;
    const { result: _omit, ...rest } = turn;
    turns.push({
      ...rest,
      preTurnFocus: turn.path.inheritedSubject,
      postFocus: turn.path.focusId,
      postMode: turn.path.stageMode,
      postMembers: turn.path.collectionMemberIds,
    });
  }
  return { id, turns };
}

const comparisonCue = interpretExecutiveComparisonMeaning({
  utterance: "which one of prolems is important?",
  intentKind: "unknown",
  activeComparison: null,
  activeCollectionPresent: true,
});

const cases = {
  A: runSequence("A", ["show scenarios", "exlpain Demand Surge"]),
  A_control: runSequence("A_control", ["show scenarios", "explain Demand Surge"]),
  B: runSequence("B", ["show me problems", "which one of prolems is important?"]),
  C_observed: runSequence("C_observed", ["show scenarios", "exlpain Demand Surge", "show me all goals"]),
  C_independent: runSequence("C_independent", ["show Demand Surge", "show me all goals"]),
};

const compact = JSON.parse(JSON.stringify({
  identity: "NXA:5-FIX3-DIAG/Reproduction",
  nxaConversationScopeEnabled: isDiagnosticEnabled("nxaConversation"),
  comparisonCueForB: comparisonCue,
  cases: Object.fromEntries(
    Object.entries(cases).map(([key, value]) => [
      key,
      {
        id: value.id,
        turns: value.turns.map((turn) => ({
          utterance: turn.utterance,
          normalized: turn.normalized,
          cc1Kind: turn.cc1Kind,
          cc1Hints: turn.cc1Hints,
          nluOperation: turn.nluOperation,
          nluSubject: turn.nluSubject,
          nluIntent: turn.nluIntent,
          overlaidKind: turn.overlaidKind,
          overlaidHints: turn.overlaidHints,
          commandKind: turn.commandKind,
          commandPrimary: turn.commandPrimary,
          runtimeStatus: turn.runtimeStatus,
          runtimeAction: turn.runtimeAction,
          nxaNeed: turn.nxaNeed,
          nxaNavigationAllowed: turn.nxaNavigationAllowed,
          nxa5Type: turn.nxa5Type,
          nxa5Criterion: turn.nxa5Criterion,
          nxa5Preferred: turn.nxa5Preferred,
          nxa5Comparability: turn.nxa5Comparability,
          comparisonActive: turn.comparisonActive,
          comparisonCriterion: turn.comparisonCriterion,
          comparisonMode: turn.comparisonMode,
          comparisonSource: turn.comparisonSource,
          comparisonIds: turn.comparisonIds,
          post3Kind: turn.post3Kind,
          lastCollectionKind: turn.lastCollectionKind,
          lastCollectionIds: turn.lastCollectionIds,
          directorIntent: turn.directorIntent,
          directorMutation: turn.directorMutation,
          directorReason: turn.directorReason,
          shouldCommitRuntime: turn.shouldCommitRuntime,
          response: turn.response,
          path: turn.path,
          postFocus: turn.postFocus,
          postMode: turn.postMode,
          postMembers: turn.postMembers,
        })),
      },
    ]),
  ),
}));

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "reproduction-traces.json"), JSON.stringify(compact, null, 2));
console.log(JSON.stringify({
  scope: compact.nxaConversationScopeEnabled,
  A: compact.cases.A.turns[1],
  A_control: compact.cases.A_control.turns[1],
  B: compact.cases.B.turns[1],
  C_obs: compact.cases.C_observed.turns[2],
  C_ind: compact.cases.C_independent.turns[1],
}, null, 2));
