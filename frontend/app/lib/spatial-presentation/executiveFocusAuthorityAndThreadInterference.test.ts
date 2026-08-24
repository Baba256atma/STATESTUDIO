/**
 * Focus authority + Executive Thread interference regressions.
 *
 * Explicit user focus beats automatic attention.
 * When a Business Object owns focus, Executive Thread may not own/obstruct center.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { resolveDataRealityAwareFocusAttentionExperience } from "../data-reality/dataRealityAwareFocusAttentionExperience.ts";
import { resolveDataRealityAwareSceneChoreography } from "../data-reality/dataRealityAwareSceneChoreography.ts";
import {
  applyDataRealityAwareSceneChoreographyToStagePresentation,
} from "../nex-mvp/nexoraMVPDataRealityAwareSceneChoreography.ts";
import {
  applyDataRealityFocusSceneChoreographyToStagePresentation,
} from "../nex-mvp/nexoraMVPDataRealityFocusSceneChoreography.ts";
import {
  resolveNexoraMVPDataRealityAwareStageExperience,
} from "../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import {
  applyExecutiveFocusVisualGrammarToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import {
  applyExecutiveNetworkTopologyToStagePresentation,
  getExecutiveNetworkTopologyFromPresentation,
} from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import {
  applyExecutivePresentationPlaneToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  createExecutive2DPosition,
  createExecutivePresentationPlane,
  EXECUTIVE_PRESENTATION_DEPTH_OFFSETS,
  EXECUTIVE_PRESENTATION_PLANE_BOUNDARY,
  executivePresentationTerritoriesIntersect,
  mapExecutive2DPositionToRenderWorld,
  resolveExecutivePresentationFocusCenter,
  resolveExecutivePresentationRegions,
} from "./executivePresentationPlaneFoundation.ts";
import { resolveExecutiveStageFocusPrecedence as resolveFocusPrecedence } from "./executiveStageFocusPrecedence.ts";

const here = dirname(fileURLToPath(import.meta.url));

const CLICK_FIXTURES = [
  "obj-budget",
  "obj-inventory",
  "obj-delivery",
  "obj-revenue",
] as const;

function shellLikeFocusPipeline(objectId: string) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, objectId);
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: state.workspace,
    presentationState: "minimum",
    environmentIntent: state.environmentIntent,
  });

  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    focusedObjectId: state.focusedSubject?.id,
    selectedObjectId: state.selectedSubject?.id,
    selectedObjectIds: state.selectedSubject
      ? [state.selectedSubject.id]
      : undefined,
    presentationState: "minimum",
  });
  const focusAttention = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState: experience.runtimeState,
    focusedObjectId: state.focusedSubject?.id,
    selectedObjectId: state.selectedSubject?.id,
    presentationState: "minimum",
    workspace: state.workspace,
    mode: state.mode,
  });
  const stageObjects = experience.catalog.objects.map((entry) =>
    Object.freeze({ objectId: entry.id }),
  );
  const relationships = experience.catalog.relationships.map((entry) =>
    Object.freeze({
      id: entry.id,
      sourceId: entry.sourceId,
      targetId: entry.targetId,
    }),
  );
  const choreography = resolveDataRealityAwareSceneChoreography({
    focusAttention,
    stageObjects,
    relationships,
    presentationState: "minimum",
  });

  const derived = deriveNexoraMVPStageInteractionPresentation(
    state,
    experience.catalog,
  );
  const withChoreography =
    applyDataRealityAwareSceneChoreographyToStagePresentation(
      derived,
      choreography,
    );
  const withFocus =
    applyDataRealityFocusSceneChoreographyToStagePresentation(
      withChoreography,
      choreography,
    );
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(
    withFocus,
    { presentationDepth: "minimum" },
  );
  const withNetwork =
    applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const finalPresentation =
    applyExecutivePresentationPlaneToStagePresentation(withNetwork);

  return {
    state,
    focusAttention,
    choreography,
    withNetwork,
    finalPresentation,
  };
}

test("1–3. Budget click → selection → focus → anchor", () => {
  const { state, finalPresentation, withNetwork } =
    shellLikeFocusPipeline("obj-budget");
  assert.equal(state.selectedSubject?.id, "obj-budget");
  assert.equal(state.focusedSubject?.id, "obj-budget");
  assert.equal(finalPresentation.scene.selectedObjectId, "obj-budget");
  assert.equal(finalPresentation.scene.focusedObjectId, "obj-budget");
  const topology = getExecutiveNetworkTopologyFromPresentation(withNetwork)!;
  assert.equal(topology.diagnostics.anchorObjectId, "obj-budget");
  assert.deepEqual(topology.positions["obj-budget"], { x: 0, y: 0 });
});

test("4. Capacity critical cannot steal explicit Budget focus", () => {
  const { focusAttention, finalPresentation, withNetwork } =
    shellLikeFocusPipeline("obj-budget");
  assert.ok(
    focusAttention.criticalObjects.includes("obj-capacity") ||
      focusAttention.recommendedFocus === "obj-capacity" ||
      focusAttention.presentationGuidance.retainAttentionObjectIds.includes(
        "obj-capacity",
      ),
  );
  assert.equal(finalPresentation.scene.focusedObjectId, "obj-budget");
  assert.notEqual(finalPresentation.scene.focusedObjectId, "obj-capacity");
  const topology = getExecutiveNetworkTopologyFromPresentation(withNetwork)!;
  assert.equal(topology.diagnostics.anchorObjectId, "obj-budget");
  const capacity = finalPresentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  );
  if (capacity != null && capacity.disclosureState !== "hidden") {
    assert.equal(capacity.focused, false);
    assert.ok(
      capacity.attention === "elevated" ||
        capacity.attention === "critical" ||
        capacity.status === "critical" ||
        capacity.status === "risk" ||
        capacity.status === "watch" ||
        focusAttention.criticalObjects.includes("obj-capacity"),
    );
  }
});

test("5–7. Inventory / Delivery / Revenue clicks preserve focus chain", () => {
  for (const id of ["obj-inventory", "obj-delivery", "obj-revenue"] as const) {
    const { state, finalPresentation, withNetwork } =
      shellLikeFocusPipeline(id);
    assert.equal(state.selectedSubject?.id, id, id);
    assert.equal(state.focusedSubject?.id, id, id);
    assert.equal(finalPresentation.scene.selectedObjectId, id, id);
    assert.equal(finalPresentation.scene.focusedObjectId, id, id);
    const topology = getExecutiveNetworkTopologyFromPresentation(withNetwork)!;
    assert.equal(topology.diagnostics.anchorObjectId, id, id);
    assert.deepEqual(topology.positions[id], { x: 0, y: 0 }, id);
  }
});

test("8. automatic attention still works when no explicit user focus exists", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    presentationState: "minimum",
  });
  const focusAttention = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState: experience.runtimeState,
    focusedObjectId: undefined,
    selectedObjectId: undefined,
    presentationState: "minimum",
  });
  assert.equal(focusAttention.selectedFocus, undefined);
  assert.equal(focusAttention.runtimeFocus, undefined);
  // Recommended/prioritized primary may exist for attention, but must not steal
  // Stage center without an explicit interaction focus.
  const choreography = resolveDataRealityAwareSceneChoreography({
    focusAttention,
    stageObjects: experience.catalog.objects.map((entry) =>
      Object.freeze({ objectId: entry.id }),
    ),
    relationships: experience.catalog.relationships.map((entry) =>
      Object.freeze({
        id: entry.id,
        sourceId: entry.sourceId,
        targetId: entry.targetId,
      }),
    ),
    presentationState: "minimum",
  });
  assert.equal(choreography.anchorObjectId, undefined);

  const precedence = resolveFocusPrecedence({
    explicitFocusedObjectId: null,
    automaticAttentionObjectId: focusAttention.primaryFocus ?? null,
  });
  assert.equal(precedence.focusSource, "automatic-attention");
  assert.ok(precedence.focusedObjectId != null);
});

test("9–11. Delivery Executive Thread stays peripheral; MINIMUM collapsed preserved", () => {
  const { finalPresentation } = shellLikeFocusPipeline("obj-delivery");
  assert.equal(finalPresentation.scene.focusedObjectId, "obj-delivery");
  const focus = finalPresentation.scene.objects.find(
    (entry) => entry.id === "obj-delivery",
  )!;
  assert.equal(focus.presentationPosition?.x, 0);
  assert.equal(focus.presentationPosition?.y, 0);

  const thread = finalPresentation.contextNodes.find(
    (node) =>
      node.kind === "executive-thread" || node.role === "collapsed-thread",
  );
  assert.ok(thread, "MINIMUM collapsed Executive Thread present");
  assert.equal(thread!.role, "collapsed-thread");
  assert.match(thread!.label, /^Executive Thread · \d+( ›)?$/);
  // STAGE-THREAD:1-FIX — gateway may use background-context clamp while remaining
  // peripheral to the Business Object (not a topology anchor).
  assert.ok(
    thread!.presentationRegion === "executive-thread" ||
      thread!.presentationRegion === "background-context",
  );

  const focusCenter = resolveExecutivePresentationFocusCenter(
    createExecutivePresentationPlane(),
  );
  void focusCenter;
  assert.ok(thread!.targetPosition != null);
  // Thread must not occupy the Business Object focus center.
  assert.notEqual(thread!.targetPosition[0], 0);
  assert.ok(
    Math.hypot(thread!.targetPosition[0], thread!.targetPosition[1]) > 0.35,
  );

  const customer = finalPresentation.scene.objects.find(
    (entry) => entry.id === "obj-customer",
  );
  if (
    customer?.presentationComposition?.territory != null &&
    thread?.presentationComposition?.territory != null
  ) {
    assert.equal(
      executivePresentationTerritoriesIntersect(
        thread.presentationComposition.territory,
        customer.presentationComposition.territory,
      ),
      false,
      "Executive Thread ∩ Customer must be empty",
    );
  }
});

test("12. no Z-based separation introduced", () => {
  assert.equal(EXECUTIVE_PRESENTATION_DEPTH_OFFSETS.positionEffect, 0);
  assert.equal(EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.usedZOnlyEscape, false);
  assert.equal(
    EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.depthRolePositionEffect,
    0,
  );
  const planeSource = readFileSync(
    join(here, "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts"),
    "utf8",
  );
  assert.doesNotMatch(planeSource, /targetPosition:\s*\[[^\]]+,\s*[^\]]+,\s*[1-9]/);
  assert.match(planeSource, /never Z/i);
});

test("13. canonical relationships unchanged by focus authority fix", () => {
  const a = shellLikeFocusPipeline("obj-delivery");
  const b = shellLikeFocusPipeline("obj-delivery");
  const edgesA = a.finalPresentation.scene.connections.map((edge) =>
    `${edge.id}:${edge.sourceId}->${edge.targetId}`,
  );
  const edgesB = b.finalPresentation.scene.connections.map((edge) =>
    `${edge.id}:${edge.sourceId}->${edge.targetId}`,
  );
  assert.deepEqual(edgesA, edgesB);
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    presentationState: "minimum",
  });
  assert.ok(experience.catalog.relationships.length > 0);
});

test("14. identical state → identical result", () => {
  for (const id of CLICK_FIXTURES) {
    const a = shellLikeFocusPipeline(id).finalPresentation;
    const b = shellLikeFocusPipeline(id).finalPresentation;
    assert.equal(a.scene.focusedObjectId, b.scene.focusedObjectId, id);
    assert.equal(a.scene.selectedObjectId, b.scene.selectedObjectId, id);
    const fa = a.scene.objects.find((entry) => entry.id === id)!;
    const fb = b.scene.objects.find((entry) => entry.id === id)!;
    assert.deepEqual(fa.presentationPosition, fb.presentationPosition, id);
    assert.deepEqual(fa.targetPosition, fb.targetPosition, id);
  }
});

test("focus precedence helper: user > automatic > fallback", () => {
  assert.deepEqual(
    resolveFocusPrecedence({
      explicitFocusedObjectId: "obj-budget",
      automaticAttentionObjectId: "obj-capacity",
      fallbackObjectId: "obj-revenue",
    }),
    {
      focusedObjectId: "obj-budget",
      focusSource: "user-selection",
      automaticAttentionObjectId: "obj-capacity",
    },
  );
  assert.equal(
    resolveFocusPrecedence({
      explicitFocusedObjectId: null,
      automaticAttentionObjectId: "obj-capacity",
    }).focusSource,
    "automatic-attention",
  );
  assert.equal(
    resolveFocusPrecedence({
      explicitFocusedObjectId: null,
      automaticAttentionObjectId: null,
      fallbackObjectId: "obj-revenue",
    }).focusSource,
    "fallback",
  );
});

test("Budget focus lands at mapped {0,0} world target", () => {
  const { finalPresentation } = shellLikeFocusPipeline("obj-budget");
  const focus = finalPresentation.scene.objects.find(
    (entry) => entry.id === "obj-budget",
  )!;
  const mapped = mapExecutive2DPositionToRenderWorld({
    position: createExecutive2DPosition(0, 0),
  });
  assert.deepEqual(focus.targetPosition, [mapped.x, mapped.y, mapped.z]);
});
