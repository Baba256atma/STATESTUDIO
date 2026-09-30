import { toNexoraConversationContextSnapshot } from "./app/lib/conversational-control/executiveContextProjection.ts";
import { executeNexoraConversationalExperience } from "./app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectManagerObjectConversationalSubjects } from "./app/lib/manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "./app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function run(utterance: string, previous?: Turn): Turn {
  const executiveContext = previous?.nextExecutiveContext;
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: executiveContext ? toNexoraConversationContextSnapshot(executiveContext) : previous?.nextConversationContext,
    executiveContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({ workspace: "overview", presentationState: "minimum", environmentIntent: "neutral" }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    allowActiveStageContext: false,
    lastAppliedCommandId: previous?.commandResult?.command?.commandId ?? null,
    attentionNowMs: 1_725_000_000_000,
    messageIdSeed: `f18-${utterance}`,
  });
}

const seeds = (process.env.SEED ?? "Demand Surge").split("|");
let base: Turn | undefined;
for (const s of seeds) base = run(s, base);
for (const u of process.argv.slice(2)) {
  const t = run(u, base);
  const intent = t.intentResult.intent as { kind: string; scenarioPayload?: { operation?: string } };
  console.log(JSON.stringify({
    u,
    kind: intent.kind,
    op: intent.scenarioPayload?.operation ?? null,
    cont: t.managerObjectTurn.session.conversationContinuity?.activeSubjectId ?? null,
    lane: t.trace.experienceLane,
    decisions: t.nextDecisionSession?.decisions?.length ?? null,
    r: t.response.slice(0, 150),
  }));
}
