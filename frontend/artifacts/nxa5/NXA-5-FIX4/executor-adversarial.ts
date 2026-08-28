/**
 * NXA:5-FIX4 executor adversarial transcript (same conversation authority as /executive).
 */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { executeNexoraConversationalExperience } from "../../../app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import {
  classifyRequestStageRelationship,
  projectAuthoritativeStageContext,
} from "../../../app/lib/manager-object/nexoraNxa5Fix4StageContextIntelligence.ts";
import { projectManagerObjectConversationalSubjects } from "../../../app/lib/manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../../../app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const out = dirname(fileURLToPath(import.meta.url));

const ADVERSARIAL = Object.freeze([
  "show me scenarios",
  "what is on stage?",
  "why are they here?",
  "which one is more important for business?",
  "I am talking about scenarios",
  "risk",
  "explain Demand Surge",
  "what is on stage now?",
  "what is Capacity?",
  "what is on stage now?",
  "show Capacity",
  "what is on stage now?",
  "go back to scenarios",
  "compare them",
]);

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
    messageIdSeed: `nxa5-fix4-live-${utterance}`,
  });
}

function stageOf(state: Turn["nextRuntimeState"]) {
  const projected = projectAuthoritativeStageContext({ runtimeState: state, catalog });
  return {
    presentationType: projected.presentationType,
    focus: projected.focus?.label ?? null,
    collection: projected.collection?.kind ?? null,
    members: projected.collection?.members.map((item) => item.label) ?? [],
    workspace: projected.workspace,
  };
}

async function main() {
  const emptyRuntime = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });

  let previous: Turn | undefined;
  const turns = [];
  for (const utterance of ADVERSARIAL) {
    const incomingRuntime = previous?.nextRuntimeState ?? emptyRuntime;
    const incoming = projectAuthoritativeStageContext({ runtimeState: incomingRuntime, catalog });
    const before = stageOf(incomingRuntime);
    const result = run(utterance, previous);
    const after = stageOf(result.nextRuntimeState);
    const relationship = classifyRequestStageRelationship({
      utterance,
      intentKind: result.intentResult.intent.kind,
      stage: incoming,
      pendingCriterion:
        previous?.ncaConversationState?.pendingQuestion?.expectedInformation === "PRIORITY",
      pendingConsent: previous?.ncaConversationState?.pendingPresentationConsent ?? null,
    });
    turns.push({
      utterance,
      canonicalIntent: result.intentResult.intent.kind,
      nluIntent: result.naturalLanguageUnderstanding?.communicativeIntent ?? null,
      stageBefore: before,
      relationship,
      pendingBefore: previous?.ncaConversationState?.pendingQuestion?.purpose ?? null,
      pendingAfter: result.ncaConversationState?.pendingQuestion?.purpose ?? null,
      advisor: result.response,
      mutated: JSON.stringify(after) !== JSON.stringify(before),
      commit: result.shouldCommitRuntime,
      stageAfter: after,
      observations: (result.managerObjectTurn.session.managerObservations ?? []).length,
    });
    previous = result;
  }

  const report = {
    identity: "NXA:5-FIX4/ExecutorAdversarial",
    turns,
  };
  await writeFile(join(out, "executor-adversarial.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    turns: turns.length,
    last: turns.map((item) => ({
      u: item.utterance,
      kind: item.canonicalIntent,
      rel: item.relationship,
      col: item.stageAfter.collection,
      focus: item.stageAfter.focus,
      commit: item.commit,
    })),
  }, null, 2));
}

void main();
