/**
 * STAGE-PROD:0 — Executive Stage Productivity Contract certification (A–J).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  applyExecutiveStage2DTopologyRecompositionToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import {
  applyExecutiveStageFixedCameraToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import {
  applyExecutiveStage2DTopologyPlaneToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  resetNexoraMVPObjectInteractionOverview,
  resolveNexoraMVPExecutiveQueueSummary,
  resolveNexoraMVPExecutiveStageDisclosure,
  resolveNexoraMVPPrimaryStageSubject,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  buildNexoraMVPAdvisorContextBridge,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "../nex-mvp/nexoraMVPStageFixtures.ts";
import { EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION } from "./executiveStageReservedRegionContainment.ts";
import {
  EXECUTIVE_STAGE_DENSITY_RESOLUTION_ORDER,
  EXECUTIVE_STAGE_INTERACTION_PRECEDENCE,
  EXECUTIVE_STAGE_PRODUCTIVITY_AUTHORITY_TABLE,
  EXECUTIVE_STAGE_PRODUCTIVITY_BOUNDARY,
  EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS,
  EXECUTIVE_STAGE_PROGRESSIVE_DISCLOSURE_ORDER,
  EXECUTIVE_STAGE_WATCH_BUDGET,
  buildExecutiveStageProductivityObservability,
  executiveStageProductivityContractIdentity,
  executiveStageProductivityContractNamespace,
  executiveStageProductivityContractVersion,
  getExecutiveStageProductivityContractIdentity,
  isExecutiveQueueEntrySemanticObject,
  rankExecutiveWatchCandidates,
  resolveExecutiveQuestionForObject,
  resolveExecutiveQueueSummary,
  resolveExecutiveStageDisclosure,
  resolveExecutiveStageSpatialRole,
  resolvePrimaryStageSubjectId,
  verifyExecutiveStageProductivityContract,
} from "./executiveStageProductivityContract.ts";

const here = dirname(fileURLToPath(import.meta.url));

function overviewState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function focusPipeline(objectId: string) {
  let state = overviewState();
  state = selectNexoraMVPInteractionSubject(state, objectId);
  const derived = deriveNexoraMVPStageInteractionPresentation(state);
  const withRecomposition =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(derived);
  const withPlane =
    applyExecutiveStage2DTopologyPlaneToStagePresentation(withRecomposition);
  const finalPresentation =
    applyExecutiveStageFixedCameraToStagePresentation(withPlane);
  return { state, derived, finalPresentation };
}

test("STAGE-PROD:0 identity + verify + authority table", () => {
  const identity = getExecutiveStageProductivityContractIdentity();
  assert.equal(identity.id, executiveStageProductivityContractIdentity);
  assert.equal(identity.version, executiveStageProductivityContractVersion);
  assert.equal(identity.namespace, executiveStageProductivityContractNamespace);
  const verified = verifyExecutiveStageProductivityContract();
  assert.equal(verified.ok, true);
  assert.ok(EXECUTIVE_STAGE_PRODUCTIVITY_AUTHORITY_TABLE.length >= 10);
  assert.equal(
    EXECUTIVE_STAGE_PRODUCTIVITY_BOUNDARY.queueEntriesAreSemanticObjects,
    false,
  );
  assert.deepEqual(
    [...EXECUTIVE_STAGE_INTERACTION_PRECEDENCE],
    [
      "direct-object-click",
      "navigation-restore",
      "automatic-focus",
      "attention",
      "fallback",
    ],
  );
  assert.deepEqual(
    [...EXECUTIVE_STAGE_PROGRESSIVE_DISCLOSURE_ORDER],
    ["center", "direct-related", "watch-worthy", "collection-disclosed"],
  );
  assert.equal(EXECUTIVE_STAGE_DENSITY_RESOLUTION_ORDER[0], "preserve-center");
});

test("A — Overview: progressive disclosure, queue reserved, watch separated", () => {
  const state = overviewState();
  const disclosure = resolveNexoraMVPExecutiveStageDisclosure(state);
  assert.equal(disclosure.presentationMode, "overview");
  assert.equal(disclosure.queueRegionReserved, true);
  assert.equal(disclosure.watchRegionReserved, true);

  // Without inventing a company object — no fake center.
  assert.equal(disclosure.centerObjectId, null);

  // Do not populate Overview with every known Business Object.
  const visibleBusiness = disclosure.entries.filter(
    (entry) =>
      entry.objectKind === "object" && entry.spatialRole !== "hidden",
  );
  assert.ok(visibleBusiness.length < NEXORA_MVP_STAGE_OBJECT_FIXTURES.length);
  assert.ok(
    visibleBusiness.every(
      (entry) =>
        entry.spatialRole === "watch" ||
        entry.spatialRole === "related" ||
        entry.spatialRole === "center",
    ),
  );

  // Watch remains semantically separate from Queue.
  const queue = resolveNexoraMVPExecutiveQueueSummary();
  assert.ok(queue.every((entry) => entry.isCollectionControl === true));
  assert.ok(queue.every((entry) => isExecutiveQueueEntrySemanticObject(entry) === false));
  for (const watchId of disclosure.watchObjectIds) {
    assert.ok(
      !queue.some((entry) => entry.objectIds.includes(watchId)),
      `Watch object ${watchId} must not be a Queue collection control member as the control itself`,
    );
  }

  const hardQueue = EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.hardReservedRegions.find(
    (region) => region.id === "executive-queue",
  );
  assert.ok(hardQueue, "Executive Queue hard region must be reserved");

  // Certification fixture with Company + Goals when present in model.
  const withContext = resolveExecutiveStageDisclosure({
    subjects: [
      Object.freeze({
        subjectId: "company-nexora",
        objectKind: "company",
        family: "business-object" as const,
      }),
      Object.freeze({
        subjectId: "goal-growth",
        objectKind: "goal",
        family: "business-object" as const,
        attention: "important",
      }),
      Object.freeze({
        subjectId: "obj-risk",
        objectKind: "object",
        attention: "critical",
        status: "risk",
      }),
      Object.freeze({
        subjectId: "obj-budget",
        objectKind: "object",
        attention: "normal",
        status: "stable",
      }),
    ],
    relationships: [],
    presentationMode: "overview",
    executiveContextObjectId: "company-nexora",
  });
  assert.equal(withContext.centerObjectId, "company-nexora");
  assert.ok(withContext.relatedObjectIds.includes("goal-growth"));
  assert.ok(withContext.watchObjectIds.includes("obj-risk"));
  assert.ok(withContext.hiddenObjectIds.includes("obj-budget"));
});

test("B — Goal click → CENTER (0,0); unrelated hidden; queue fixed", () => {
  const disclosure = resolveExecutiveStageDisclosure({
    subjects: [
      Object.freeze({
        subjectId: "goal-growth",
        objectKind: "goal",
        family: "business-object" as const,
      }),
      Object.freeze({
        subjectId: "obj-revenue",
        objectKind: "object",
        attention: "elevated",
      }),
      Object.freeze({
        subjectId: "obj-budget",
        objectKind: "object",
        attention: "normal",
      }),
      Object.freeze({
        subjectId: "obj-risk",
        objectKind: "object",
        attention: "critical",
        status: "risk",
      }),
    ],
    relationships: [
      Object.freeze({
        id: "rel-goal-revenue",
        sourceId: "goal-growth",
        targetId: "obj-revenue",
      }),
    ],
    presentationMode: "object-focus",
    primaryStageSubjectId: "goal-growth",
  });
  assert.equal(disclosure.centerObjectId, "goal-growth");
  assert.equal(
    disclosure.byId.get("goal-growth")?.spatialRole,
    "center",
  );
  assert.ok(disclosure.relatedObjectIds.includes("obj-revenue"));
  assert.ok(disclosure.watchObjectIds.includes("obj-risk"));
  assert.ok(disclosure.hiddenObjectIds.includes("obj-budget"));
  assert.equal(disclosure.queueRegionReserved, true);

  const question = resolveExecutiveQuestionForObject({ objectKind: "goal" });
  assert.equal(question.question, "Are we achieving it?");
});

test("C — Business Object click → (0,0); Advisor follows Capacity", () => {
  const { state, finalPresentation } = focusPipeline("obj-capacity");
  const focus = finalPresentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  );
  assert.ok(focus);
  assert.equal(focus!.presentationPosition?.x ?? focus!.targetPosition[0], 0);
  assert.equal(focus!.presentationPosition?.y ?? focus!.targetPosition[1], 0);
  assert.equal(focus!.disclosureState, "visible-primary");
  assert.equal(focus!.spatialRole, "center");

  const primary = resolveNexoraMVPPrimaryStageSubject(state);
  assert.equal(primary.primaryStageSubjectId, "obj-capacity");
  assert.equal(primary.advisorSubjectId, "obj-capacity");

  const bridge = buildNexoraMVPAdvisorContextBridge(state, finalPresentation);
  assert.equal(bridge.primaryStageSubjectId, "obj-capacity");
  assert.equal(bridge.advisorSubjectId, "obj-capacity");
  assert.equal(bridge.focusedSubject?.id, "obj-capacity");

  const disclosure = resolveNexoraMVPExecutiveStageDisclosure(state);
  assert.equal(disclosure.centerObjectId, "obj-capacity");
  assert.ok(disclosure.relatedObjectIds.length >= 1);
  // Watch remains separate from related.
  for (const watchId of disclosure.watchObjectIds) {
    assert.ok(!disclosure.relatedObjectIds.includes(watchId));
    assert.notEqual(watchId, "obj-capacity");
  }
});

test("D — Problem Object click → kind problem, spatial role center", () => {
  const disclosure = resolveExecutiveStageDisclosure({
    subjects: [
      Object.freeze({
        subjectId: "ctx-problem-capacity",
        objectKind: "problem",
        workKind: "problem" as const,
        family: "executive-work" as const,
        linkedBusinessObjectIds: Object.freeze(["obj-capacity"]),
      }),
      Object.freeze({
        subjectId: "obj-capacity",
        objectKind: "object",
        family: "business-object" as const,
        attention: "important",
      }),
    ],
    relationships: [],
    presentationMode: "object-focus",
    primaryStageSubjectId: "ctx-problem-capacity",
  });
  const problem = disclosure.byId.get("ctx-problem-capacity");
  assert.ok(problem);
  assert.equal(problem!.objectKind, "problem");
  assert.equal(problem!.spatialRole, "center");
  assert.equal(disclosure.centerObjectId, "ctx-problem-capacity");
  assert.notEqual(problem!.objectKind, problem!.spatialRole);
});

test("E — Attention competition: direct focus A wins; B may Watch", () => {
  const primary = resolvePrimaryStageSubjectId({
    clickedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    focusedObjectId: "obj-capacity",
    attentionObjectId: "obj-risk",
    automaticFocusObjectId: "obj-risk",
    presentationMode: "object-focus",
  });
  assert.equal(primary.primaryStageSubjectId, "obj-capacity");
  assert.equal(primary.precedenceRank, "direct-object-click");

  const disclosure = resolveExecutiveStageDisclosure({
    subjects: [
      Object.freeze({
        subjectId: "obj-capacity",
        objectKind: "object",
        attention: "important",
      }),
      Object.freeze({
        subjectId: "obj-risk",
        objectKind: "object",
        attention: "critical",
        status: "risk",
        recommended: true,
      }),
      Object.freeze({
        subjectId: "obj-budget",
        objectKind: "object",
        attention: "normal",
      }),
    ],
    relationships: [
      Object.freeze({
        id: "rel-budget-capacity",
        sourceId: "obj-budget",
        targetId: "obj-capacity",
      }),
    ],
    presentationMode: "object-focus",
    primaryStageSubjectId: "obj-capacity",
  });
  assert.equal(disclosure.centerObjectId, "obj-capacity");
  assert.ok(disclosure.watchObjectIds.includes("obj-risk"));
  assert.notEqual(disclosure.centerObjectId, "obj-risk");
});

test("F — Reserved-region pressure: no semantic Object in Queue territory", () => {
  const queue = EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS.executiveQueue;
  const hard = EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.hardReservedRegions.find(
    (region) => region.id === queue.id,
  );
  assert.ok(hard);
  assert.equal(hard!.minX, queue.minX);
  assert.equal(hard!.maxX, queue.maxX);

  const { finalPresentation } = focusPipeline("obj-capacity");
  const readability = (
    finalPresentation.scene as {
      readonly stage2dReadability?: {
        readonly positions?: Readonly<
          Record<string, { readonly x: number; readonly y: number }>
        >;
        readonly classifications?: Readonly<Record<string, string>>;
      };
    }
  ).stage2dReadability;

  // After full STAGE-2D readability pipeline, centers must stay out of Queue.
  // When readability positions are present, certify against the hard region.
  if (readability?.positions != null) {
    for (const [objectId, position] of Object.entries(readability.positions)) {
      const classification = readability.classifications?.[objectId];
      if (classification === "hidden") continue;
      const insideQueue =
        position.x >= queue.minX &&
        position.x <= queue.maxX &&
        position.y >= queue.minY &&
        position.y <= queue.maxY;
      assert.equal(
        insideQueue,
        false,
        `${objectId} must not sit inside Executive Queue region`,
      );
    }
  }

  const center = finalPresentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  );
  assert.equal(center?.presentationPosition?.x ?? center?.targetPosition[0], 0);
  assert.equal(center?.presentationPosition?.y ?? center?.targetPosition[1], 0);
});

test("G — Watch overflow: deterministic top subset; overflow presentation-hidden", () => {
  const candidates = [
    Object.freeze({ subjectId: "w1", attention: "critical", status: "risk" }),
    Object.freeze({ subjectId: "w2", attention: "important", status: "watch" }),
    Object.freeze({ subjectId: "w3", attention: "elevated", status: "watch" }),
    Object.freeze({ subjectId: "w4", attention: "elevated", recommended: true }),
    Object.freeze({ subjectId: "w5", attention: "important", status: "unresolved" }),
    Object.freeze({ subjectId: "w6", attention: "elevated" }),
  ];
  const ranked = rankExecutiveWatchCandidates({
    candidates,
    maxVisible: EXECUTIVE_STAGE_WATCH_BUDGET.maxVisible,
  });
  assert.equal(ranked.visibleIds.length, EXECUTIVE_STAGE_WATCH_BUDGET.maxVisible);
  assert.ok(ranked.overflowIds.length >= 2);
  assert.deepEqual(
    ranked.visibleIds,
    rankExecutiveWatchCandidates({
      candidates,
      maxVisible: EXECUTIVE_STAGE_WATCH_BUDGET.maxVisible,
    }).visibleIds,
  );

  const disclosure = resolveExecutiveStageDisclosure({
    subjects: [
      Object.freeze({
        subjectId: "obj-capacity",
        objectKind: "object",
        attention: "important",
      }),
      ...candidates.map((candidate) =>
        Object.freeze({
          ...candidate,
          objectKind: "object",
          family: "business-object" as const,
        }),
      ),
    ],
    relationships: [],
    presentationMode: "object-focus",
    primaryStageSubjectId: "obj-capacity",
    watchBudgetMax: 4,
  });
  assert.ok(disclosure.watchObjectIds.length <= 4);
  assert.ok(
    disclosure.hiddenObjectIds.some((id) =>
      ranked.overflowIds.includes(id),
    ),
  );
});

test("H — Navigation restore: Back returns semantic CENTER + Advisor", () => {
  let state = overviewState();
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue");
  assert.equal(state.focusedSubject?.id, "obj-revenue");
  state = stepBackNexoraMVPObjectInteraction(state);
  assert.equal(state.focusedSubject?.id, "obj-capacity");

  const primary = resolveNexoraMVPPrimaryStageSubject(state);
  assert.equal(primary.primaryStageSubjectId, "obj-capacity");
  assert.equal(primary.advisorSubjectId, "obj-capacity");

  const presentation = deriveNexoraMVPStageInteractionPresentation(state);
  const bridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(bridge.advisorSubjectId, "obj-capacity");

  const disclosure = resolveNexoraMVPExecutiveStageDisclosure(state);
  assert.equal(disclosure.centerObjectId, "obj-capacity");
});

test("I — Escape → Overview clears focus; executive context center when available", () => {
  let state = overviewState();
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
  state = resetNexoraMVPObjectInteractionOverview(state);
  assert.equal(state.mode, "overview");
  assert.equal(state.focusedSubject, null);
  assert.equal(state.selectedSubject, null);

  const disclosure = resolveNexoraMVPExecutiveStageDisclosure(state);
  assert.equal(disclosure.presentationMode, "overview");
  assert.equal(disclosure.centerObjectId, null);
});

test("J — topologyZ === 0 for every semantic Stage Object", () => {
  const { finalPresentation } = focusPipeline("obj-capacity");
  for (const object of finalPresentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.equal(object.targetPosition[2], 0, object.id);
    if (object.presentationPosition != null) {
      // presentationPosition is XY only — topology Z contract remains 0.
      assert.equal(
        Object.prototype.hasOwnProperty.call(object.presentationPosition, "z"),
        false,
      );
    }
  }
  const disclosure = resolveNexoraMVPExecutiveStageDisclosure(
    selectNexoraMVPInteractionSubject(overviewState(), "obj-capacity"),
  );
  assert.equal(disclosure.topologyZContract, 0);
  assert.equal(disclosure.cameraContract, "fixed-2d-target-origin");
});

test("Watch vs Queue semantic distinction + object-kind vs spatial-role", () => {
  const queue = resolveExecutiveQueueSummary({
    subjects: [
      Object.freeze({
        subjectId: "ctx-problem-a",
        workKind: "problem" as const,
        family: "executive-work" as const,
      }),
      Object.freeze({
        subjectId: "obj-capacity",
        objectKind: "object",
        attention: "important",
      }),
    ],
  });
  const problems = queue.find((entry) => entry.category === "problem");
  assert.equal(problems?.count, 1);
  assert.equal(problems?.isSemanticObject, false);
  assert.equal(problems?.participatesInTopology, false);

  assert.equal(
    resolveExecutiveStageSpatialRole({
      objectId: "obj-capacity",
      watchObjectIds: ["obj-capacity"],
    }),
    "watch",
  );
  assert.equal(
    resolveExecutiveQuestionForObject({ objectKind: "problem" }).question,
    "What is causing it / what needs resolution?",
  );
});

test("Observability payload excludes sensitive business fields", () => {
  const disclosure = resolveExecutiveStageDisclosure({
    subjects: NEXORA_MVP_STAGE_OBJECT_FIXTURES.map((object) =>
      Object.freeze({
        subjectId: object.id,
        label: object.label,
        objectKind: object.kind,
        attention: object.attention,
        status: object.status,
      }),
    ),
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((relationship) =>
      Object.freeze({
        id: relationship.id,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
      }),
    ),
    presentationMode: "object-focus",
    primaryStageSubjectId: "obj-capacity",
  });
  const observability = buildExecutiveStageProductivityObservability(disclosure, {
    "obj-capacity": { x: 0, y: 0 },
  });
  const serialized = JSON.stringify(observability);
  assert.equal(observability.centerObjectId, "obj-capacity");
  assert.ok(!serialized.includes("Margin Pressure"));
  assert.ok(!serialized.includes("Utilization"));
  for (const entry of observability.objects) {
    assert.equal(entry.topologyZ, 0);
    assert.ok(
      entry.spatialRole === "center" ||
        entry.spatialRole === "related" ||
        entry.spatialRole === "watch" ||
        entry.spatialRole === "hidden",
    );
  }
});

test("Collection presentation mode does not invent a fake center Object", () => {
  const disclosure = resolveExecutiveStageDisclosure({
    subjects: [
      Object.freeze({
        subjectId: "ctx-problem-a",
        workKind: "problem" as const,
        family: "executive-work" as const,
      }),
      Object.freeze({
        subjectId: "ctx-problem-b",
        workKind: "problem" as const,
        family: "executive-work" as const,
      }),
      Object.freeze({
        subjectId: "obj-risk",
        objectKind: "object",
        attention: "critical",
      }),
    ],
    relationships: [],
    presentationMode: "collection",
    collectionCategory: "problem",
    collectionObjectIds: ["ctx-problem-a", "ctx-problem-b"],
  });
  assert.equal(disclosure.centerObjectId, null);
  assert.ok(disclosure.collectionObjectIds.includes("ctx-problem-a"));
  assert.ok(disclosure.collectionObjectIds.includes("ctx-problem-b"));
  assert.ok(disclosure.watchObjectIds.includes("obj-risk"));
  assert.ok(!disclosure.relatedObjectIds.includes("ctx-problem-a"));
});

test("Source boundary: contract does not implement Queue expansion / NBA", () => {
  const source = readFileSync(
    join(here, "executiveStageProductivityContract.ts"),
    "utf8",
  );
  assert.match(source, /implementsQueueExpansion: false/);
  assert.match(source, /implementsNextBestAction: false/);
  assert.match(source, /CENTER → RELATED → WATCH → EXECUTIVE QUEUE/);
});
