import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  openNexoraMVPExecutiveQueueCollection,
  resolveNexoraMVPPrimaryStageSubject,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  type NexoraMVPObjectInteractionState,
} from "./nexoraMVPObjectInteraction.ts";
import {
  applyNexoraMVPExecutiveCollectionIntegrity,
  NEXORA_MVP_COLLECTION_INTEGRITY_CONTRACT,
} from "./nexoraMVPExecutiveCollectionIntegrity.ts";
import {
  resolveExecutiveStage2DHardSeparatedLayout,
} from "../spatial-presentation/executiveStage2DHardSeparation.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "./nexoraMVPExecutiveStage2DFixedCamera.ts";
import type { ExecutiveQueueCategory } from "../spatial-presentation/executiveStageProductivityContract.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initial(): NexoraMVPObjectInteractionState {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function collection(category: ExecutiveQueueCategory) {
  const state = openNexoraMVPExecutiveQueueCollection(initial(), category);
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  return {
    state,
    presentation: applyNexoraMVPExecutiveCollectionIntegrity(base),
  };
}

function integrityOf(
  presentation: ReturnType<typeof applyNexoraMVPExecutiveCollectionIntegrity>,
) {
  return (
    presentation.scene as typeof presentation.scene & {
      readonly collectionIntegrity: {
        readonly contract: string;
        readonly memberIds: readonly string[];
        readonly duplicateObjectIds: readonly string[];
        readonly overlapCount: number;
        readonly minObservedGap: number;
        readonly requiredGap: number;
        readonly topologyZ: 0;
        readonly snapshots: readonly {
          readonly subjectId: string;
          readonly collectionMember: boolean;
          readonly presentationRole: string;
          readonly targetPosition: readonly [number, number, number];
          readonly primaryBodyCount: number;
          readonly interactive: boolean;
          readonly bodyBounds: {
            readonly minX: number;
            readonly maxX: number;
            readonly minY: number;
            readonly maxY: number;
          };
        }[];
      };
    }
  ).collectionIntegrity;
}

test("A–F/X — canonical membership is unique, one body, separated, and context-free", () => {
  const { presentation } = collection("problem");
  const integrity = integrityOf(presentation);
  assert.equal(integrity.contract, NEXORA_MVP_COLLECTION_INTEGRITY_CONTRACT);
  assert.deepEqual(integrity.memberIds, [
    "ctx-problem-capacity",
    "ctx-problem-margin",
  ]);
  assert.equal(new Set(integrity.memberIds).size, integrity.memberIds.length);
  assert.deepEqual(integrity.duplicateObjectIds, []);
  assert.equal(integrity.overlapCount, 0);
  assert.ok(integrity.minObservedGap >= integrity.requiredGap);
  assert.ok(
    integrity.snapshots.every(
      (entry) =>
        entry.collectionMember &&
        entry.presentationRole === "collection-member" &&
        entry.primaryBodyCount === 1,
    ),
  );
  const visible = presentation.scene.objects.filter(
    (object) => object.disclosureState !== "hidden" && object.opacity > 0.05,
  );
  assert.deepEqual(
    visible.map((object) => object.id).sort(),
    [...integrity.memberIds].sort(),
  );
});

test("G–I/R/S/P — all Queue peer collections use hard XY separation at z=0", () => {
  for (const category of [
    "scenario",
    "decision",
    "execution",
  ] as const) {
    const { presentation } = collection(category);
    const integrity = integrityOf(presentation);
    assert.ok(integrity.memberIds.length > 0, category);
    assert.equal(integrity.overlapCount, 0, category);
    assert.ok(integrity.minObservedGap >= integrity.requiredGap, category);
    assert.equal(integrity.topologyZ, 0, category);
    assert.ok(
      integrity.snapshots.every(
        (entry) =>
          entry.targetPosition[2] === 0 &&
          !(entry.targetPosition[0] === 0 && entry.targetPosition[1] === 0),
      ),
      category,
    );
  }
});

test("J–M/O/T — member click centers, Advisor follows, and Back restores collection identity", () => {
  const opened = collection("problem");
  for (const subjectId of [
    "ctx-problem-margin",
    "ctx-problem-capacity",
  ] as const) {
    const focusedState = selectNexoraMVPInteractionSubject(
      opened.state,
      subjectId,
    );
    const focused = deriveNexoraMVPStageInteractionPresentation(focusedState);
    const body = focused.scene.objects.find((object) => object.id === subjectId);
    assert.deepEqual(body?.targetPosition, [0, 0, 0]);
    assert.equal(
      resolveNexoraMVPPrimaryStageSubject(focusedState).advisorSubjectId,
      subjectId,
    );
    assert.equal(focusedState.stage2dNavigationTrail.objectIds.at(-1), subjectId);

    const restoredState = stepBackNexoraMVPObjectInteraction(focusedState);
    const restored = applyNexoraMVPExecutiveCollectionIntegrity(
      deriveNexoraMVPStageInteractionPresentation(restoredState),
    );
    assert.equal(restored.presentationMode, "collection");
    assert.deepEqual(integrityOf(restored).memberIds, [
      "ctx-problem-capacity",
      "ctx-problem-margin",
    ]);
    assert.equal(integrityOf(restored).overlapCount, 0);
  }
});

test("N/Q/W — no stale/duplicate render identity and camera remains fixed-2d", () => {
  const { presentation } = collection("problem");
  const visibleIds = presentation.scene.objects
    .filter((object) => object.disclosureState !== "hidden")
    .map((object) => object.id);
  assert.equal(new Set(visibleIds).size, visibleIds.length);
  const fixed =
    applyExecutiveStageFixedCameraToStagePresentation(presentation);
  assert.deepEqual(fixed.scene.camera.position, [0, 0, 11]);
  assert.deepEqual(fixed.scene.camera.target, [0, 0, 0]);

  const sceneSource = readFileSync(
    join(
      here,
      "../../executive/nex-mvp/stage/NexoraStageScene.tsx",
    ),
    "utf8",
  );
  assert.match(sceneSource, /key=\{object\.id\}/);
});

test("R — no-anchor hard separation preserves peer semantics", () => {
  const result = resolveExecutiveStage2DHardSeparatedLayout({
    anchorObjectId: null,
    positions: {
      a: { x: -0.2, y: 0.1, z: 0 },
      b: { x: -0.1, y: 0.1, z: 0 },
    },
    classifications: { a: "related", b: "related" },
    orderedIds: ["a", "b"],
  });
  assert.equal(result.overlapCount, 0);
  assert.ok(result.minObservedGap >= result.minVisualGap);
  assert.ok(
    Object.values(result.positions).every(
      (position) => position.z === 0,
    ),
  );
  assert.ok(
    Object.values(result.positions).every(
      (position) => !(position.x === 0 && position.y === 0),
    ),
  );
});

test("D/F/U/V — labels and state stay subordinate without changing conversation/workflow authorities", () => {
  const stageObjectSource = readFileSync(
    join(
      here,
      "../../executive/nex-mvp/stage/NexoraStageObject.tsx",
    ),
    "utf8",
  );
  assert.match(stageObjectSource, /!isCollectionMember/);
  assert.match(stageObjectSource, /visualLayerRole: "state-marker"/);
  assert.match(stageObjectSource, /visualLayerRole: "state-territory"/);

  const collectionSource = readFileSync(
    join(here, "nexoraMVPExecutiveCollectionIntegrity.ts"),
    "utf8",
  );
  assert.doesNotMatch(collectionSource, /conversational|workflowPhase/);
  assert.match(collectionSource, /interactive: true/);
  assert.match(collectionSource, /labelVisible: true/);
});
