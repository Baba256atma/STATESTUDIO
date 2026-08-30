import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { executeNexoraConversationalExperience } from "../../../app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectManagerObjectConversationalSubjects } from "../../../app/lib/manager-object/managerObjectCatalog.ts";
import { interpretManagerTurnMeaning } from "../../../app/lib/manager-object/nexoraMvpFinal61NaturalLanguageUnderstanding.ts";
import { classifyManagerSpeechAct } from "../../../app/lib/manager-object/nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../../../app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const out = dirname(fileURLToPath(import.meta.url));
const ADVERSARIAL = [
  "show Capacity",
  "what happens if we ignore it?",
  "delivery is too late",
  "what did I just tell you?",
  "what is on Stage?",
  "why might Delivery be late?",
  "show Delivery",
  "inventory is too high",
  "what did I just report?",
] as const;

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function run(utterance: string, previous?: Turn): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nxa5-fix5-${utterance}`,
  });
}

async function main() {
  let previous: Turn | undefined;
  const turns = [];
  for (const utterance of ADVERSARIAL) {
    const before = {
      focus: previous?.nextRuntimeState.focusedSubject?.label ?? null,
      collection: previous?.nextRuntimeState.collectionContext?.category ?? null,
    };
    const meaning = interpretManagerTurnMeaning({ utterance, subjects });
    const result = run(utterance, previous);
    const after = {
      focus: result.nextRuntimeState.focusedSubject?.label ?? null,
      collection: result.nextRuntimeState.collectionContext?.category ?? null,
    };
    turns.push({
      utterance,
      speechAct: classifyManagerSpeechAct(utterance),
      operation: meaning.requestedOperation,
      explicitSubject: meaning.objectReference?.canonicalName ?? null,
      contextualSubject: result.contextualManagerMeaning?.objectReference?.canonicalName ?? null,
      intent: result.intentResult.intent.kind,
      observation: result.managerObjectTurn.session.managerObservations?.at(-1) ?? null,
      pending: result.ncaConversationState?.pendingQuestion?.purpose ?? null,
      reply: result.response,
      stageBefore: before,
      commit: result.shouldCommitRuntime,
      stageAfter: after,
    });
    previous = result;
  }
  await writeFile(join(out, "executor-adversarial.json"), JSON.stringify({ identity: "NXA:5-FIX5/Executor", turns }, null, 2));
  console.log(JSON.stringify(turns.map((item) => ({
    u: item.utterance,
    op: item.operation,
    subj: item.explicitSubject ?? item.contextualSubject,
    focus: item.stageAfter.focus,
    commit: item.commit,
    reply: item.reply.slice(0, 100),
  })), null, 2));
}

void main();
