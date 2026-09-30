import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import { SIM_TEST_6_MANUFACTURING_IMPATIENT } from "./nexoraSimulationLongSessionJourneys.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const report = runNexoraSimulationTestJourney({
  journey: SIM_TEST_6_MANUFACTURING_IMPATIENT,
  runId: "sim-test-6-fix14-impatient",
});

console.log("SUMMARY", JSON.stringify({
  signature: report.deterministicSignature,
  harnessStatus: report.harnessStatus,
  counts: report.findingCounts,
  groundTruthAccess: report.managerFirewall?.groundTruthAccess,
  findings: report.journeyFindings.map((finding) => ({
    turn: finding.managerTurn,
    classification: finding.classification,
    owner: finding.likelyOwner,
    observed: finding.observedBehavior,
    expected: finding.expectedInvariant,
    subjectId: finding.activeCanonicalSubjectId,
  })),
}));

for (const row of report.journeyObservations) {
  console.log("TURN", JSON.stringify({
    turn: row.turn,
    utterance: row.utterance,
    intent: row.intent,
    intended: row.intendedSubject,
    conversation: row.conversationSubjectId,
    canonical: row.canonicalSubjectId,
    nmi: row.nmiCanonicalId,
    advisor: row.advisorReferentId,
    advisorName: row.advisorReferentName,
    stage: row.stageActiveSubjectId,
    clarification: row.clarificationRequired,
    decisionId: row.decisionId,
    decisionCount: row.decisionCount,
    executionId: row.executionId,
    response: row.response,
  }));
}

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
let previous: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
for (const utterance of [
  "Status.", "Main problems. Now.", "Capacity. Details.", "Data.", "Why?", "Options.",
  "Compare.", "Go with B.", "Yes. Decide.", "Start it.", "Done yet?", "Delivery.",
  "This.", "Back to capacity.", "Supplier issue.", "Capacity again.", "Changed?", "Source?",
  "How is it going?", "Start it.", "Inventory.", "That one.", "Return to capacity.",
  "Outcome.", "Proven?", "Schedule issue.", "Capacity.", "Learn what?", "Now?",
  "The previous one.", "Anything else?", "Just fix it.", "Did it work?",
]) {
  const result = executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({
      workspace: "overview", presentationState: "minimum", environmentIntent: "neutral",
    }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `fix14-${utterance}`,
  });
  console.log("DIRECT", JSON.stringify({
    utterance,
    status: result.status,
    intent: result.intentResult.intent.kind,
    hints: result.intentResult.intent.targetHints.map((item) => item.raw),
    cc2: result.contextResult.context.primarySubject?.subjectId ?? null,
    nluOperation: result.naturalLanguageUnderstanding.requestedOperation,
    nluSubject: result.naturalLanguageUnderstanding.objectReference?.subjectId ?? null,
    provenance: result.contextualManagerMeaning.provenance,
    move: result.contextualManagerMeaning.continuityMove,
    contextualSubject: result.contextualManagerMeaning.objectReference?.subjectId ?? null,
    clarification: result.clarificationTurn.action,
    executiveSubject: result.nextExecutiveContext.currentSubject?.subjectId ?? null,
    managerActive: result.managerObjectTurn.activeObjectId,
    continuity: result.managerObjectTurn.session.conversationContinuity?.activeSubjectId ?? null,
    advisor: result.nxaAdvisorContract?.referentId ?? null,
    decision: result.decisionCommitmentResult?.decision?.decisionId ?? null,
    pendingDecision: result.nextDecisionSession?.pendingConfirmation?.candidateId ?? null,
  }));
  previous = result;
}
