import { toNexoraConversationContextSnapshot } from "./app/lib/conversational-control/executiveContextProjection.ts";
import { executeNexoraConversationalExperience } from "./app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectManagerObjectConversationalSubjects } from "./app/lib/manager-object/managerObjectCatalog.ts";
import { createInitialNexoraMVPObjectInteractionState, getDefaultNexoraMVPObjectInteractionCatalog } from "./app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
type Turn = ReturnType<typeof executeNexoraConversationalExperience>;
function run(utterance: string, previous?: Turn): Turn {
  const executiveContext = previous?.nextExecutiveContext;
  return executeNexoraConversationalExperience({ utterance, conversationContext: executiveContext ? toNexoraConversationContextSnapshot(executiveContext) : previous?.nextConversationContext, executiveContext, executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({ workspace: "overview", presentationState: "minimum", environmentIntent: "neutral" }), catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null, scenarioSession: previous?.nextScenarioSession ?? null, decisionSession: previous?.nextDecisionSession ?? null,
    allowActiveStageContext: false, lastAppliedCommandId: previous?.commandResult?.command?.commandId ?? null, attentionNowMs: 1_725_000_000_000, messageIdSeed: `f18-${utterance}` });
}
const f = run("Demand Surge");
console.log("seed", f.shouldCommitRuntime, f.directorPlan?.mutationRequired, f.nextDecisionSession?.decisions?.length, JSON.stringify(f.nextScenarioSession?.candidateScenarioIds));
for (const u of ["investigate it", "explain it", "tell me more about it", "why?"]) {
  const t = run(u, f);
  console.log(u, "| commit", t.shouldCommitRuntime, "| mut", t.directorPlan?.mutationRequired, "| intent", t.directorPlan?.intent, "| dec", t.nextDecisionSession?.decisions?.length, "| cand", JSON.stringify(t.nextScenarioSession?.candidateScenarioIds), "| cmd", t.commandResult?.command?.kind, t.commandResult?.status, "| rt", t.runtimeResult?.status, "| focus", t.nextRuntimeState.focusedSubject?.id);
}
