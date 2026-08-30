/**
 * DTH:4 — War Room Atmosphere tests.
 * Does not replace DTH:1–3, Stage, Director, or Manager–Object tests.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  DTH3_PROOF_DECISION,
  DTH3_PROOF_GOAL,
  DTH3_PROOF_REL_SUPPORTED,
  DTH3_PROOF_SCENARIO,
  dth3ProofIconic,
} from "./nexoraDecisionTheatreVisualGrammarFixtures.ts";
import { projectNexoraDecisionTheatreVisualGrammar } from "./nexoraDecisionTheatreVisualProjection.ts";
import {
  evaluateNexoraDecisionTheatreInvariants,
  inspectNexoraDecisionTheatreProjection,
  NEXORA_DECISION_THEATRE_ATMOSPHERE_MODES,
  NEXORA_DECISION_THEATRE_ATMOSPHERE_REGISTRY,
  NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  nexoraDecisionTheatreAtmosphereIdentity,
  projectNexoraDecisionTheatreAtmosphere,
  projectNexoraDecisionTheatreFoundation,
  resolveNexoraDecisionTheatreAtmosphereSwatch,
  resolveReservedTheatreRequest,
} from "./nexoraDecisionTheatrePublicIndex.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectDefaultNexoraMvpConversationalSubjects();

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function project(
  state = initial(),
  extra?: Omit<Parameters<typeof projectNexoraDecisionTheatreFoundation>[0], "stageState" | "catalog">,
) {
  return projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    ...extra,
  });
}

function runConversation(utterance: string, state = initial()) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({
      currentSubjectId: state.focusedSubject?.id ?? null,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: state.workspace,
    }),
    executiveSubjects: subjects,
    runtimeState: state,
    catalog,
    messageIdSeed: `dth4-${utterance}`,
  });
}

test("atmosphere contract is renderer-neutral and versioned", () => {
  assert.equal(nexoraDecisionTheatreAtmosphereIdentity, "DTH:4/WarRoomAtmosphere");
  assert.equal(NEXORA_DECISION_THEATRE_ATMOSPHERE_MODES.length, 8);
  for (const mode of NEXORA_DECISION_THEATRE_ATMOSPHERE_MODES) {
    const entry = NEXORA_DECISION_THEATRE_ATMOSPHERE_REGISTRY[mode];
    assert.doesNotMatch(entry.rendererToken, /#([0-9a-f]{3,8})\b|\brgba?\(/i);
    assert.ok(entry.prohibitedInferences.length > 0);
  }
  const swatch = resolveNexoraDecisionTheatreAtmosphereSwatch("investigation");
  assert.match(swatch.radial, /rgba/);
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("war-room-atmosphere"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("scene-intent"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("object-investigation"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("decision-comparison"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("decision-commitment"));
  assert.equal(
    (NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES as readonly string[]).includes("scene-intent"),
    false,
  );
  assert.equal(NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES.length, 7);
  assert.equal(resolveReservedTheatreRequest("show the NexoGraph war room"), null);
  assert.equal(resolveReservedTheatreRequest("open scene intent"), null);
  assert.equal(resolveReservedTheatreRequest("open NexoTime replay"), "nexo-time-and-theatre-replay");
});

test("proofs 1-9: activation from whole-scene authority only", () => {
  assert.equal(projectNexoraDecisionTheatreAtmosphere(null).mode, "none");
  assert.equal(projectNexoraDecisionTheatreAtmosphere({}).mode, "none");
  assert.equal(
    projectNexoraDecisionTheatreAtmosphere({
      investigationSupported: true,
      criticalWholeSceneSupported: true,
    }).mode,
    "none",
  );
  assert.equal(projectNexoraDecisionTheatreAtmosphere({ executiveReviewSupported: true }).mode, "executive-review");
  assert.equal(projectNexoraDecisionTheatreAtmosphere({ investigationSupported: true }).mode, "investigation");
  assert.equal(projectNexoraDecisionTheatreAtmosphere({ futureExplorationSupported: true }).mode, "future-exploration");
  assert.equal(projectNexoraDecisionTheatreAtmosphere({ commitmentReviewSupported: true }).mode, "commitment-review");
  assert.equal(projectNexoraDecisionTheatreAtmosphere({ criticalWholeSceneSupported: true }).mode, "critical-response");
  assert.equal(projectNexoraDecisionTheatreAtmosphere({ recoveryObservedSupported: true }).mode, "recovery-or-improvement");
  assert.equal(projectNexoraDecisionTheatreAtmosphere({ contextInsufficientKnown: true }).mode, "context-insufficient");
});

test("proofs 10-16: non-escalation from objects, focus, collections, recommendation, expected improvement", () => {
  const focusedProblem = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const live = project(focusedProblem);
  assert.equal(live.warRoomAtmosphere.mode, "none");
  const criticalObject = projectNexoraDecisionTheatreVisualGrammar({
    executives: [{ ...DTH3_PROOF_DECISION, lifecycleStatus: "risk" }],
    iconicObjects: [],
    relationships: [],
  });
  assert.equal(criticalObject.presentations[0]?.stateToken, "state-critical");
  assert.equal(project(focusedProblem).warRoomAtmosphere.mode, "none");
  const scenarios = runConversation("show scenarios");
  assert.equal(scenarios.decisionTheatre?.warRoomAtmosphere.mode, "none");
  const decisions = runConversation("show decisions");
  assert.equal(decisions.decisionTheatre?.warRoomAtmosphere.mode, "none");
  assert.equal(
    projectNexoraDecisionTheatreAtmosphere({
      expectedImprovementOnly: true,
      recoveryObservedSupported: true,
    }).mode,
    "none",
  );
  assert.equal(projectNexoraDecisionTheatreAtmosphere({ recommendationPresent: true }).mode, "none");
  const selectedScenario = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-capacity", catalog);
  assert.equal(project(selectedScenario).warRoomAtmosphere.mode, "none");
});

test("proofs 17-24: atmosphere does not mutate NexoGraph object or relationship tokens", () => {
  const iconic = dth3ProofIconic("proof-scenario", "cost");
  const grammar = projectNexoraDecisionTheatreVisualGrammar({
    executives: [DTH3_PROOF_GOAL, DTH3_PROOF_SCENARIO, DTH3_PROOF_DECISION],
    iconicObjects: [iconic],
    relationships: [DTH3_PROOF_REL_SUPPORTED],
    grammar: {
      relationshipPresentations: [
        { relationshipId: "rel-supported", supportState: "established", direction: "source-to-target" },
      ],
    },
  });
  const withAtmosphere = project(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog), {
    atmosphereAuthority: { investigationSupported: true },
  });
  const without = project(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog));
  assert.equal(withAtmosphere.visualGrammar.atmosphere, "none");
  assert.deepEqual(
    withAtmosphere.visualGrammar.presentations.map((item) => [
      item.participantId,
      item.stateToken,
      item.scaleToken,
      item.opacityToken,
      item.haloToken,
      item.overlayFocus,
      item.overlaySelection,
    ]),
    without.visualGrammar.presentations.map((item) => [
      item.participantId,
      item.stateToken,
      item.scaleToken,
      item.opacityToken,
      item.haloToken,
      item.overlayFocus,
      item.overlaySelection,
    ]),
  );
  assert.deepEqual(withAtmosphere.visualGrammar.relationshipVisuals, without.visualGrammar.relationshipVisuals);
  assert.equal(grammar.relationshipVisuals[0]?.patternToken, "line-supported");
  assert.equal(withAtmosphere.warRoomAtmosphere.mode, "investigation");
  assert.ok(withAtmosphere.visibleExecutiveObjects.some((item) => item.focused));
});

test("proofs 25-30: determinism, transition hold, reduced motion, claims", () => {
  const first = projectNexoraDecisionTheatreAtmosphere({ investigationSupported: true, previousMode: "none" });
  const second = projectNexoraDecisionTheatreAtmosphere({ investigationSupported: true, previousMode: "none" });
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  const hold = projectNexoraDecisionTheatreAtmosphere({
    investigationSupported: true,
    previousMode: "investigation",
  });
  assert.equal(hold.transitionToken, "atmosphere-hold");
  const change = projectNexoraDecisionTheatreAtmosphere({
    investigationSupported: true,
    previousMode: "none",
  });
  assert.equal(change.transitionToken, "atmosphere-crossfade");
  const reduced = projectNexoraDecisionTheatreAtmosphere({
    investigationSupported: true,
    previousMode: "none",
    reducedMotion: true,
  });
  assert.equal(reduced.transitionToken, "atmosphere-immediate");
  assert.equal(reduced.mode, "investigation");
  assert.ok(change.claim);
  assert.equal(projectNexoraDecisionTheatreAtmosphere({}).claim, null);
  assert.equal(change.intensity, "subtle");
  assert.equal(
    projectNexoraDecisionTheatreAtmosphere({
      criticalWholeSceneSupported: true,
      intensitySupport: "moderate",
    }).intensity,
    "moderate",
  );
});

test("proofs 31-35: refresh, back/forward, read-only, unsupported, support removal", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  const authority = Object.freeze({ investigationSupported: true as const, previousMode: "none" as const });
  const first = project(focused, { atmosphereAuthority: authority });
  const refresh = project(focused, { atmosphereAuthority: authority });
  assert.equal(first.warRoomAtmosphere.mode, refresh.warRoomAtmosphere.mode);
  const next = selectNexoraMVPInteractionSubject(focused, "obj-capacity", catalog);
  const back = stepBackNexoraMVPObjectInteraction(next);
  assert.equal(project(back, { atmosphereAuthority: authority }).warRoomAtmosphere.mode, "investigation");
  const forward = stepForwardNexoraMVPObjectInteraction(back);
  assert.equal(project(forward, { atmosphereAuthority: authority }).warRoomAtmosphere.mode, "investigation");
  const explain = runConversation("Explain it", focused);
  assert.equal(explain.decisionTheatre?.warRoomAtmosphere.mode, "none");
  const unsupported = project(focused, {
    atmosphereAuthority: authority,
    managerQuestion: "open NexoTime replay",
  });
  assert.equal(unsupported.warRoomAtmosphere.mode, "investigation");
  assert.equal(unsupported.capabilities.requestedUnsupported, "nexo-time-and-theatre-replay");
  const removed = project(focused, { atmosphereAuthority: { previousMode: "investigation" } });
  assert.equal(removed.warRoomAtmosphere.mode, "none");
  assert.equal(removed.warRoomAtmosphere.transitionToken, "atmosphere-crossfade");
});

test("Advisor, diagnostics, DTH:1–3 regression, and atmosphere does not own Scene Intent", () => {
  const theatre = project(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog), {
    atmosphereAuthority: { executiveReviewSupported: true },
  });
  const text = JSON.stringify(theatre.advisorReadable);
  assert.doesNotMatch(text, /DTH:4|DTH:3|NexoGraph|War Room|WATCH|Scene Intent/);
  assert.match(theatre.advisorReadable.atmosphere.meaning, /executive review/i);
  assert.equal(theatre.warRoomAtmosphere.sceneIntentImplemented, false);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(theatre).ok, true);
  const diagnostics = inspectNexoraDecisionTheatreProjection({
    theatre,
    projectionInput: { stageState: selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog), catalog },
  });
  assert.equal(diagnostics.visualAtmosphere, "none");
  assert.equal(diagnostics.warRoomAtmosphereMode, "executive-review");
  assert.equal(diagnostics.unauthorizedMutation, false);
  const live = project();
  assert.equal(live.warRoomAtmosphere.mode, "none");
  assert.equal(live.visualGrammar.atmosphere, "none");
});
