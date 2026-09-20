/** NPA-T STAGE-PROD:6B — focused live Scene animation tests. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraStageContextualVisual } from "@/app/executive/nex-mvp/stage/NexoraStageContextualVisual.tsx";
import {
  emptyNexoraDecisionTheatreSceneSemanticInput,
  projectNexoraDecisionTheatreFoundation,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  advanceExecutiveStageMotion,
  EXECUTIVE_STAGE_MOTION,
  registerExecutiveStageMotionLivePositionReader,
  resetExecutiveStageMotionForTests,
  sampleExecutiveStageMotionObject,
  setExecutiveStageMotionReducedMotion,
  syncExecutiveStageMotionTargets,
  type ExecutiveStageMotionTargetEntry,
} from "@/app/lib/spatial-presentation/executiveStageMotion.ts";
import { projectStageProdInteractiveDisclosure } from "./stageProdInteractiveDisclosure.ts";
import {
  projectStageProdDirectorComposition,
  type StageProdDirectorComposition,
} from "./stageProdDirectorComposition.ts";
import {
  projectStageProdSceneMotion,
  stageProdRelationshipAnimationStatus,
  stageProdSceneMotionIdentity,
} from "./stageProdSceneMotion.ts";
import type { StageProdStatusCardVisualSpec } from "./stageProdVisualSpecification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const CAPACITY_GAP_ID = "ctx-problem-capacity";
const SCENARIO_IDS = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function initial(): NexoraMVPObjectInteractionState {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function presentation(state: NexoraMVPObjectInteractionState) {
  return deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
}

function investigation() {
  const state = selectNexoraMVPInteractionSubject(initial(), CAPACITY_GAP_ID, catalog);
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    investigationLevel: "understand",
  });
  return {
    state,
    theatre,
    composition: projectStageProdDirectorComposition({
      presentation: presentation(state),
      theatre,
    }),
  };
}

function comparison() {
  const state = initial();
  const sceneSemanticInput = emptyNexoraDecisionTheatreSceneSemanticInput({
    canonicalSemanticResultRef: `stage-prod-6b:${SCENARIO_IDS.join(",")}`,
    canonicalOperation: "COMPARE",
    conversationIntentKind: "compare-scenarios",
    comparison: Object.freeze({
      active: true,
      memberIds: Object.freeze([...SCENARIO_IDS]),
      criterion: "COST",
      criterionAmbiguous: false,
      criterionResolution: null,
    }),
  });
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    sceneSemanticInput,
    comparisonLevel: "compare",
  });
  return {
    state,
    theatre,
    composition: projectStageProdDirectorComposition({
      presentation: presentation(state),
      theatre,
    }),
  };
}

function motion(composition: StageProdDirectorComposition) {
  return projectStageProdSceneMotion({
    objects: composition.presentation.scene.objects,
    contextNodes: composition.presentation.contextNodes,
  });
}

function fallback(target: ExecutiveStageMotionTargetEntry) {
  return {
    position: target.position,
    opacity: target.opacity,
    scale: target.scale,
    visible: target.visible,
  };
}

test("A — existing canonical Object interpolates from old to new composition position", () => {
  const oldComposition = projectStageProdDirectorComposition({
    presentation: presentation(initial()),
  });
  const nextComposition = investigation().composition;
  const oldMotion = motion(oldComposition);
  const nextMotion = motion(nextComposition);
  const movedId = oldMotion.canonicalObjectIds.find((id) => {
    const from = oldMotion.targets.get(id)?.position;
    const to = nextMotion.targets.get(id)?.position;
    return from != null && to != null && JSON.stringify(from) !== JSON.stringify(to);
  });
  assert.ok(movedId, "expected a shared canonical Object with a new position");
  const from = oldMotion.targets.get(movedId)!;
  const to = nextMotion.targets.get(movedId)!;

  resetExecutiveStageMotionForTests();
  syncExecutiveStageMotionTargets({ targets: oldMotion.targets, anchorObjectId: null, nowMs: 0 });
  advanceExecutiveStageMotion(EXECUTIVE_STAGE_MOTION.topologyDurationMs);
  registerExecutiveStageMotionLivePositionReader((id) => oldMotion.targets.get(id)?.position ?? null);
  const transition = syncExecutiveStageMotionTargets({
    targets: nextMotion.targets,
    anchorObjectId: CAPACITY_GAP_ID,
    nowMs: 500,
  });
  assert.deepEqual(transition.fromPositions.get(movedId), from.position);
  assert.deepEqual(transition.targetPositions.get(movedId), to.position);
  const middle = sampleExecutiveStageMotionObject(movedId, 650, fallback(to));
  assert.notDeepEqual(middle.position, from.position);
  assert.notDeepEqual(middle.position, to.position);
  const end = sampleExecutiveStageMotionObject(movedId, 950, fallback(to));
  assert.deepEqual(end.position, to.position);
});

test("B — transition targets preserve canonical IDs and never match labels", () => {
  const projection = motion(comparison().composition);
  assert.equal(projection.matchesByCanonicalId, true);
  assert.deepEqual(
    SCENARIO_IDS.filter((id) => projection.canonicalObjectIds.includes(id)),
    [...SCENARIO_IDS],
  );
  assert.equal(projection.targets.has("Pricing Response"), false);
  assert.equal(projection.targets.has("Demand Surge"), false);
});

test("C — newly visible comparison Object uses bounded STAGE-MOTION enter opacity/scale", () => {
  const oldMotion = motion(investigation().composition);
  const nextMotion = motion(comparison().composition);
  const enteredId = SCENARIO_IDS.find((id) => !oldMotion.targets.has(id));
  assert.ok(enteredId);
  resetExecutiveStageMotionForTests();
  syncExecutiveStageMotionTargets({ targets: oldMotion.targets, anchorObjectId: CAPACITY_GAP_ID, nowMs: 0 });
  advanceExecutiveStageMotion(450);
  const transition = syncExecutiveStageMotionTargets({ targets: nextMotion.targets, anchorObjectId: null, nowMs: 500 });
  const target = nextMotion.targets.get(enteredId)!;
  const start = sampleExecutiveStageMotionObject(enteredId, 500, fallback(target));
  assert.equal(transition.targets.has(enteredId), true);
  assert.equal(start.opacity, EXECUTIVE_STAGE_MOTION.enterOpacityFrom);
  assert.equal(start.scale, EXECUTIVE_STAGE_MOTION.enterScaleFrom * target.scale);
  const end = sampleExecutiveStageMotionObject(enteredId, 950, fallback(target));
  assert.equal(end.opacity, target.opacity);
  assert.equal(end.scale, target.scale);
});

test("D — retained Object exit fades by the same ID and removed Object is never substituted", () => {
  const id = CAPACITY_GAP_ID;
  const visible = new Map<string, ExecutiveStageMotionTargetEntry>([
    [id, Object.freeze({ position: [0, 0, 0] as const, visible: true, opacity: 1, scale: 1 })],
  ]);
  const hidden = new Map<string, ExecutiveStageMotionTargetEntry>([
    [id, Object.freeze({ position: [0, 0, 0] as const, visible: false, opacity: 0, scale: 0.92 })],
  ]);
  resetExecutiveStageMotionForTests();
  syncExecutiveStageMotionTargets({ targets: visible, anchorObjectId: id, nowMs: 0 });
  advanceExecutiveStageMotion(450);
  syncExecutiveStageMotionTargets({ targets: hidden, anchorObjectId: null, nowMs: 500 });
  const middle = sampleExecutiveStageMotionObject(id, 550, fallback(hidden.get(id)!));
  assert.ok(middle.opacity > 0 && middle.opacity < 1);
  const end = sampleExecutiveStageMotionObject(id, 950, fallback(hidden.get(id)!));
  assert.equal(end.opacity, 0);
  assert.equal(end.visible, false);
  assert.equal(motion(comparison().composition).targets.has(id), false);
});

test("E — valid Investigation transitions to valid Comparison through one motion authority", () => {
  const first = investigation();
  const second = comparison();
  const fromMotion = motion(first.composition);
  const toMotion = motion(second.composition);
  assert.equal(first.composition.family, "investigation");
  assert.equal(second.composition.family, "comparison");
  assert.notEqual(first.composition.structuralSignature, second.composition.structuralSignature);
  assert.equal(fromMotion.authority, "STAGE-MOTION:1");
  assert.equal(toMotion.authority, "STAGE-MOTION:1");
  resetExecutiveStageMotionForTests();
  const from = syncExecutiveStageMotionTargets({ targets: fromMotion.targets, anchorObjectId: CAPACITY_GAP_ID, nowMs: 0 });
  advanceExecutiveStageMotion(450);
  const to = syncExecutiveStageMotionTargets({ targets: toMotion.targets, anchorObjectId: null, nowMs: 500 });
  assert.notEqual(from.fingerprint, to.fingerprint);
  assert.deepEqual([...to.targets.entries()], [...toMotion.targets.entries()]);
  assert.equal(first.composition.writesCanonicalManagementState, false);
  assert.equal(second.composition.writesCanonicalManagementState, false);
});

test("F — relationship endpoint motion is existing; appearance animation is explicitly deferred", () => {
  const connections = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/stage/NexoraStageConnections.tsx"),
    "utf8",
  );
  assert.equal(stageProdRelationshipAnimationStatus.status, "DEFERRED");
  assert.match(connections, /resolveExecutiveStage2DVisualAttachmentPosition/);
  assert.match(connections, /getActiveExecutiveStageMotionTransition/);
  assert.doesNotMatch(connections, /relationshipOpacityTransition|retainExitingRelationship/);
});

test("G — STAGE-PROD:5 drops stale Capacity Gap disclosure in Comparison", () => {
  const first = investigation();
  assert.ok(first.theatre.objectInvestigation);
  const next = comparison();
  const result = projectStageProdInteractiveDisclosure({
    selectedCanonicalObjectId: CAPACITY_GAP_ID,
    visibleCanonicalObjectIds: next.composition.canonicalObjectIds,
    investigation: first.theatre.objectInvestigation,
    disclosureVisible: true,
  });
  assert.equal(result.status, "stale");
  assert.equal(result.investigation, null);
  assert.equal(result.staleObjectSubstituted, false);
});

test("H — STAGE-PROD:4 Cards/Charts remain outside Object motion authority", () => {
  const spec: StageProdStatusCardVisualSpec = Object.freeze({
    identity: "NPA-T STAGE-PROD:4/ContextualVisualSpecification:6b-isolation",
    family: "STATUS_CARD",
    title: "Capacity Gap",
    status: "watch",
    evidenceSummary: "Existing evidence",
    provenance: Object.freeze(["evidence:capacity"]),
    sceneScriptId: "scene:capacity",
    canonicalObjectIds: Object.freeze([CAPACITY_GAP_ID]),
    sourceIds: Object.freeze(["evidence:capacity"]),
    evidenceStates: Object.freeze(["inferred"]),
    sceneRole: "contextual-support",
    writesCanonicalManagementState: false,
    isBusinessObject: false,
    isDataObject: false,
  });
  const html = renderToStaticMarkup(React.createElement(NexoraStageContextualVisual, { spec }));
  assert.doesNotMatch(html, /STAGE-MOTION:1|stage-prod-scene-motion|nexora-stage-object-motion/);
  assert.match(html, /data-stage-visual-writes="false"/);
});

test("I — reduced motion reaches the identical final Comparison Scene", () => {
  const projection = motion(comparison().composition);
  resetExecutiveStageMotionForTests();
  setExecutiveStageMotionReducedMotion(true);
  const transition = syncExecutiveStageMotionTargets({ targets: projection.targets, anchorObjectId: null, nowMs: 0 });
  assert.equal(transition.durationMs, EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs);
  advanceExecutiveStageMotion(EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs);
  for (const id of SCENARIO_IDS) {
    const target = projection.targets.get(id)!;
    const sample = sampleExecutiveStageMotionObject(id, EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs, fallback(target));
    assert.deepEqual(sample.position, target.position);
    assert.equal(sample.opacity, target.opacity);
    assert.equal(sample.scale, target.scale);
  }
});

test("J — Scene animation projection is read-only and adds no second engine", () => {
  const projection = motion(comparison().composition);
  const source = readFileSync(join(HERE, "stageProdSceneMotion.ts"), "utf8");
  const controller = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/stage/NexoraStageMotionController.tsx"),
    "utf8",
  );
  assert.equal(projection.identity, stageProdSceneMotionIdentity);
  assert.equal(projection.writesCanonicalManagementState, false);
  assert.equal(projection.continuousAnimation, false);
  assert.doesNotMatch(source, /requestAnimationFrame|useFrame|setInterval|setTimeout/);
  assert.doesNotMatch(source, /createDecision|startExecution|updateEvidence/);
  assert.match(controller, /projectStageProdSceneMotion/);
  assert.equal((controller.match(/useFrame\(/g) ?? []).length, 1);
});
