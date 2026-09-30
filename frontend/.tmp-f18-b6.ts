import { executeNexoraConversationalExperience } from "./app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectManagerObjectConversationalSubjects } from "./app/lib/manager-object/managerObjectCatalog.ts";
import { createInitialNexoraMVPObjectInteractionState, getDefaultNexoraMVPObjectInteractionCatalog } from "./app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
type Turn = ReturnType<typeof executeNexoraConversationalExperience>;
function run(utterance: string, previous?: Turn): Turn {
  return executeNexoraConversationalExperience({ utterance, conversationContext: previous?.nextConversationContext, executiveContext: previous?.nextExecutiveContext, executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({ workspace: "overview", presentationState: "minimum", environmentIntent: "neutral" }), catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null, scenarioSession: previous?.nextScenarioSession ?? null, decisionSession: previous?.nextDecisionSession ?? null, messageIdSeed: `f18b-${utterance}` });
}
for (const seq of process.argv.slice(2)) {
  let t: Turn | undefined; for (const u of seq.split("|")) t = run(u, t);
  console.log(seq, "=>", t!.contextualManagerMeaning.objectReference?.canonicalName ?? null, "|", t!.intentResult.intent.kind, "|", t!.clarificationTurn.action, "|", t!.response.slice(0, 90));
}
