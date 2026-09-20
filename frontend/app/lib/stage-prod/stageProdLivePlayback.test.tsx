/** NPA-T STAGE-PROD:6C — focused production playback seam tests. */

import assert from "node:assert/strict";
import test from "node:test";

import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  advanceExecutiveStageMotion,
  resetExecutiveStageMotionForTests,
  sampleExecutiveStageMotionObject,
  syncExecutiveStageMotionTargets,
  writeExecutiveStageMotionObservabilityToHost,
} from "@/app/lib/spatial-presentation/executiveStageMotion.ts";
import { projectStageProdDirectorComposition } from "./stageProdDirectorComposition.ts";
import { projectStageProdSceneMotion } from "./stageProdSceneMotion.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const scenarioIds = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;

test("A–C — authoritative NCA comparison reconstructs the production Comparison Scene", () => {
  const investigation = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    "ctx-problem-capacity",
    catalog,
  );
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: investigation,
    catalog,
    ncaActiveComparison: Object.freeze({
      candidateIds: Object.freeze([...scenarioIds]),
      candidateKind: "scenario",
      criterion: "COST",
    }),
  });
  const composition = projectStageProdDirectorComposition({
    presentation: deriveNexoraMVPStageInteractionPresentation(
      investigation,
      catalog,
      { consultExecutiveChangeSessionStore: false },
    ),
    theatre,
  });

  assert.equal(theatre.sceneIntent.intentKind, "COMPARE_CANDIDATES");
  assert.equal(composition.family, "comparison");
  assert.deepEqual([...composition.canonicalObjectIds], [...scenarioIds]);
  assert.equal(composition.writesCanonicalManagementState, false);
});

test("D/J — live-sample observability reports genuine bounded rendered state without writes", () => {
  const id = scenarioIds[0];
  const projection = projectStageProdSceneMotion({
    objects: [
      {
        id,
        label: "Pricing Response",
        kind: "scenario",
        role: "related",
        targetPosition: [1.5, 0, 0] as const,
        opacity: 1,
        scale: 1,
        disclosureState: "visible-related",
      } as never,
    ],
  });
  resetExecutiveStageMotionForTests();
  syncExecutiveStageMotionTargets({
    targets: projection.targets,
    anchorObjectId: null,
    nowMs: 0,
  });
  advanceExecutiveStageMotion(100);
  const target = projection.targets.get(id)!;
  const live = sampleExecutiveStageMotionObject(id, 100, {
    position: target.position,
    opacity: target.opacity,
    scale: target.scale,
    visible: target.visible,
  });
  const attributes = new Map<string, string>();
  writeExecutiveStageMotionObservabilityToHost(
    {
      getAttribute: (name: string) => attributes.get(name) ?? null,
      setAttribute: (name: string, value: string) => attributes.set(name, value),
    } as never,
    Object.freeze({
      [id]: Object.freeze({
        position: live.position,
        opacity: live.opacity,
        scale: live.scale,
        visible: live.visible,
      }),
    }),
  );
  const bundle = JSON.parse(attributes.get("data-stage-motion-samples-bundle")!);

  assert.equal(bundle.from[id].opacity, 0.12);
  assert.ok(bundle.live[id].opacity > bundle.from[id].opacity);
  assert.ok(bundle.live[id].opacity < bundle.target[id].opacity);
  assert.equal(projection.writesCanonicalManagementState, false);
});
