import { executeNexoraConversationalExperience } from "./app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectManagerObjectConversationalSubjects } from "./app/lib/manager-object/managerObjectCatalog.ts";
import { createInitialNexoraMVPObjectInteractionState, getDefaultNexoraMVPObjectInteractionCatalog } from "./app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
type Turn = ReturnType<typeof executeNexoraConversationalExperience>;
function run(utterance: string, previous?: Turn): Turn {
  return executeNexoraConversationalExperience({ utterance, conversationContext: previous?.nextConversationContext, executiveContext: previous?.nextExecutiveContext, executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({ workspace: "overview", presentationState: "minimum", environmentIntent: "neutral" }), catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null, scenarioSession: previous?.nextScenarioSession ?? null, decisionSession: previous?.nextDecisionSession ?? null,
    decisionRuntime: previous ? previous.decisionRuntime : undefined, executionRuntime: previous ? previous.executionRuntime : undefined, messageIdSeed: `mra-2-${utterance}` });
}
for (const seq of process.argv.slice(2)) {
  let t: Turn | undefined; for (const u of seq.split("|")) t = run(u, t);
  const any = t as any;
  console.log(seq, "\n  =>", t!.response.slice(0, 140), "\n  nca:", JSON.stringify(any.ncaDialogue?.move ?? any.managerObjectTurn?.session?.ncaDialogue?.move ?? null), "obj:", t!.contextualManagerMeaning.objectReference?.canonicalName ?? null, "prov:", t!.contextualManagerMeaning.provenance, "intent:", t!.intentResult.intent.kind);
}
