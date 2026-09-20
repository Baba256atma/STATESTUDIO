/** NPA-T STAGE-PROD:7 — existing Advisor/context ↔ production Stage synchronization. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  activateManagerObjectFromClick,
  createEmptyManagerObjectSession,
  type ManagerObjectSession,
} from "@/app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectStageProdContextualVisuals } from "./stageProdVisualSpecification.ts";
import { projectStageProdDirectorComposition } from "./stageProdDirectorComposition.ts";
import { projectStageProdInteractiveDisclosure } from "./stageProdInteractiveDisclosure.ts";
import { projectStageProdLiveFoundation } from "./stageProdProjectLiveFoundation.ts";
import { projectStageProdSceneMotion } from "./stageProdSceneMotion.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const comparisonIds = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function initial(): NexoraMVPObjectInteractionState {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function talk(
  utterance: string,
  options: Readonly<{
    previous?: Turn;
    runtime?: NexoraMVPObjectInteractionState;
    session?: ManagerObjectSession;
  }> = {},
): Turn {
  const previous = options.previous;
  return executeNexoraConversationalExperience({
    utterance,
    executiveContext: previous?.nextExecutiveContext,
    conversationContext: previous?.nextConversationContext,
    executiveSubjects: subjects,
    runtimeState: options.runtime ?? previous?.nextRuntimeState ?? initial(),
    catalog,
    previousManagerObjectSession:
      options.session ??
      previous?.managerObjectTurn.session ??
      createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    allowActiveStageContext: false,
    messageIdSeed: `stage-prod-7:${utterance}`,
  });
}

function presentation(state: NexoraMVPObjectInteractionState) {
  return deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
}

function investigation(state: NexoraMVPObjectInteractionState) {
  return projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    investigationLevel: "understand",
  });
}

test("A — named Advisor conversation focuses the same canonical Object on Stage", () => {
  const result = talk("Explain Capacity Gap.");
  const stage = presentation(result.nextRuntimeState);
  const bridge = buildNexoraMVPAdvisorContextBridge(result.nextRuntimeState, stage);
  const theatre = investigation(result.nextRuntimeState);
  const live = projectStageProdLiveFoundation({
    theatre,
    focusedCanonicalObjectId: result.nextRuntimeState.focusedSubject?.id,
    conversationalReferentId: bridge.advisorSubjectId,
  });

  assert.equal(result.shouldCommitRuntime, true);
  assert.equal(result.directorPlan?.intent, "FOCUS_OBJECT");
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "ctx-problem-capacity");
  assert.equal(bridge.advisorSubjectId, "ctx-problem-capacity");
  assert.equal(theatre.objectInvestigation?.objectId, "ctx-problem-capacity");
  assert.equal(live.identities.focusedCanonicalObjectId, "ctx-problem-capacity");
  assert.equal(live.identities.conversationalReferentId, "ctx-problem-capacity");
});

test("B — canonical conversation Comparison reaches the exact Stage participants", () => {
  const result = talk("Compare Demand Surge and Pricing Response.");
  const active = result.managerObjectTurn.session.ncaConversationState?.activeComparison;
  assert.deepEqual(active?.candidateIds, comparisonIds);
  const state = resetNexoraMVPObjectInteractionOverview(result.nextRuntimeState);
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    ncaActiveComparison: active,
    comparisonLevel: "compare",
  });
  const composition = projectStageProdDirectorComposition({
    presentation: presentation(state),
    theatre,
  });
  assert.equal(composition.family, "comparison");
  assert.deepEqual(composition.canonicalObjectIds, comparisonIds);
});

test("C — Stage activation hands the exact canonical referent to Advisor", () => {
  const state = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-capacity", catalog);
  const session = activateManagerObjectFromClick(
    createEmptyManagerObjectSession(),
    "ctx-problem-capacity",
  );
  const result = talk("Explain it.", { runtime: state, session });
  const bridge = buildNexoraMVPAdvisorContextBridge(
    result.nextRuntimeState,
    presentation(result.nextRuntimeState),
  );
  assert.equal(result.managerObjectTurn.activeObjectId, "ctx-problem-capacity");
  assert.equal(result.managerObjectTurn.session.conversationContinuity?.activeSubjectId, "ctx-problem-capacity");
  assert.equal(bridge.advisorSubjectId, "ctx-problem-capacity");
  assert.match(result.response, /Capacity Gap/i);
});

test("D — one supported deictic follow-up preserves Stage-originated identity", () => {
  const state = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-capacity", catalog);
  const session = activateManagerObjectFromClick(createEmptyManagerObjectSession(), "ctx-problem-capacity");
  const result = talk("Explain it.", { runtime: state, session });
  assert.equal(result.managerObjectTurn.activeObjectId, "ctx-problem-capacity");
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "ctx-problem-capacity");
  assert.match(result.response, /Capacity Gap/i);
});

test("E — explicit named subject replaces stale Stage-originated focus", () => {
  const state = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-capacity", catalog);
  const session = activateManagerObjectFromClick(createEmptyManagerObjectSession(), "ctx-problem-capacity");
  const result = talk("Explain Margin Pressure.", { runtime: state, session });
  assert.equal(result.managerObjectTurn.activeObjectId, "ctx-problem-margin");
  assert.equal(result.directorPlan?.primaryTarget?.id, "ctx-problem-margin");
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "ctx-problem-margin");
});

test("F — synchronization consumes resolved IDs rather than display-label lookup", () => {
  const result = talk("Explain Capacity Gap.");
  assert.equal(result.naturalLanguageUnderstanding.objectReference?.subjectId, "ctx-problem-capacity");
  assert.equal(result.directorPlan?.primaryTarget?.id, "ctx-problem-capacity");
  const disclosure = projectStageProdInteractiveDisclosure({
    selectedCanonicalObjectId: "ctx-problem-capacity",
    visibleCanonicalObjectIds: ["ctx-problem-capacity"],
    investigation: investigation(result.nextRuntimeState).objectInvestigation,
    disclosureVisible: true,
  });
  assert.equal(disclosure.lookedUpByLabel, false);
});

test("G — Investigation → Comparison releases stale singular focus and disclosure", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-capacity", catalog);
  const session = activateManagerObjectFromClick(createEmptyManagerObjectSession(), "ctx-problem-capacity");
  const result = talk("Compare Demand Surge and Pricing Response.", { runtime: focused, session });
  const active = result.managerObjectTurn.session.ncaConversationState?.activeComparison;
  const comparisonState = resetNexoraMVPObjectInteractionOverview(result.nextRuntimeState);
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: comparisonState,
    catalog,
    ncaActiveComparison: active,
  });
  const composition = projectStageProdDirectorComposition({
    presentation: presentation(comparisonState),
    theatre,
  });
  const stale = projectStageProdInteractiveDisclosure({
    selectedCanonicalObjectId: "ctx-problem-capacity",
    visibleCanonicalObjectIds: composition.canonicalObjectIds,
    investigation: investigation(focused).objectInvestigation,
    disclosureVisible: true,
  });
  assert.equal(comparisonState.focusedSubject, null);
  assert.deepEqual(composition.canonicalObjectIds, comparisonIds);
  assert.equal(stale.status, "stale");
});

test("H — disclosure visibility remains presentation-only", () => {
  const result = talk("Explain Capacity Gap.");
  const theatre = investigation(result.nextRuntimeState);
  const before = buildNexoraMVPAdvisorContextBridge(result.nextRuntimeState, presentation(result.nextRuntimeState));
  const closed = projectStageProdInteractiveDisclosure({
    selectedCanonicalObjectId: "ctx-problem-capacity",
    visibleCanonicalObjectIds: ["ctx-problem-capacity"],
    investigation: theatre.objectInvestigation,
    disclosureVisible: false,
  });
  const after = buildNexoraMVPAdvisorContextBridge(result.nextRuntimeState, presentation(result.nextRuntimeState));
  assert.equal(closed.status, "dismissed");
  assert.equal(closed.writesCanonicalManagementState, false);
  assert.equal(after.advisorSubjectId, before.advisorSubjectId);
});

test("I — motion projects positions but cannot own conversation context", () => {
  const result = talk("Explain Capacity Gap.");
  const theatre = investigation(result.nextRuntimeState);
  const composition = projectStageProdDirectorComposition({
    presentation: presentation(result.nextRuntimeState),
    theatre,
  });
  const bridge = buildNexoraMVPAdvisorContextBridge(result.nextRuntimeState, composition.presentation);
  const motion = projectStageProdSceneMotion({ objects: composition.presentation.scene.objects });
  assert.equal(motion.authority, "STAGE-MOTION:1");
  assert.equal(motion.writesCanonicalManagementState, false);
  assert.equal(bridge.advisorSubjectId, "ctx-problem-capacity");
});

test("J — contextual visuals preserve canonical association without Advisor analysis", () => {
  const result = talk("Explain Capacity Gap.");
  const theatre = investigation(result.nextRuntimeState);
  const composition = projectStageProdDirectorComposition({
    presentation: presentation(result.nextRuntimeState),
    theatre,
  });
  const visuals = projectStageProdContextualVisuals({ theatre, composition });
  assert.equal(visuals.writesCanonicalManagementState, false);
  assert.equal(visuals.parallelChartTruth, false);
  for (const spec of visuals.specs) {
    assert.ok(spec.canonicalObjectIds.includes("ctx-problem-capacity"));
  }
});

test("K — synchronization performs no canonical business writes", () => {
  const result = talk("Explain Capacity Gap.");
  const theatre = investigation(result.nextRuntimeState);
  const live = projectStageProdLiveFoundation({ theatre });
  assert.equal(result.decisionCommitmentResult, null);
  assert.equal(theatre.writes.decisionState, false);
  assert.equal(theatre.writes.executionState, false);
  assert.equal(live.writesCanonicalManagementState, false);
});

test("L — production seams remain the only authorities", () => {
  const shell = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  assert.match(shell, /buildNexoraMVPAdvisorContextBridge\(interaction, stageInteraction\)/);
  assert.match(shell, /projectNexoraDecisionTheatreFoundation\(/);
  assert.match(shell, /resetNexoraMVPObjectInteractionOverview\(/);
  assert.match(shell, /activeComparison\.candidateIds\.length >= 2/);
  assert.doesNotMatch(shell, /stageProd(?:Sync|Synchronization)Store/i);
});
