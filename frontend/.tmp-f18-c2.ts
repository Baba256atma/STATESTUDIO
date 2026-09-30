import { executeNexoraConversationalExperience } from "./app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectManagerObjectConversationalSubjects } from "./app/lib/manager-object/managerObjectCatalog.ts";
import { createInitialNexoraMVPObjectInteractionState, getDefaultNexoraMVPObjectInteractionCatalog } from "./app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const base = projectManagerObjectConversationalSubjects(catalog);
const margin = base.find((s) => s.subjectId === "ctx-problem-margin")!;
const extended = [...base, { ...margin, subjectId: "ctx-problem-cost", canonicalName: "Cost Overrun", aliases: ["cost overrun"] } as typeof margin];
type Turn = ReturnType<typeof executeNexoraConversationalExperience>;
function run(subjects: typeof base, utterance: string, previous?: Turn): Turn {
  return executeNexoraConversationalExperience({ utterance, conversationContext: previous?.nextConversationContext, executiveContext: previous?.nextExecutiveContext, executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({ workspace: "overview", presentationState: "minimum", environmentIntent: "neutral" }), catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null, scenarioSession: previous?.nextScenarioSession ?? null, decisionSession: previous?.nextDecisionSession ?? null,
    decisionRuntime: previous ? previous.decisionRuntime : undefined, executionRuntime: previous ? previous.executionRuntime : undefined, messageIdSeed: `c2-${utterance}` });
}
const which = process.argv[2] === "ext" ? extended : base;
for (const seq of process.argv.slice(3)) {
  let t: Turn | undefined; for (const u of seq.split("|")) t = run(which, u, t);
  console.log(seq, "\n  =>", t!.response.slice(0, 120), "| obj:", t!.contextualManagerMeaning.objectReference?.canonicalName ?? null, t!.contextualManagerMeaning.provenance, t!.intentResult.intent.kind, t!.clarificationTurn.action);
}
