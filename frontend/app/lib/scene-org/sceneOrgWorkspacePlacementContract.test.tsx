import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveShell } from "@/app/executive/nex-mvp/NexoraExecutiveShell.tsx";
import { NexoraWorkspaceRegionBoundary } from "@/app/executive/nex-mvp/scene-org/NexoraWorkspaceRegionBoundary.tsx";
import { NexoraExecutiveQueueOverlay } from "@/app/executive/nex-mvp/stage/NexoraExecutiveQueueOverlay.tsx";
import { createSceneOrgCanonicalReference } from "./sceneOrgRegionContract.ts";
import {
  SCENE_ORG_NORMAL_STAGE_CARD_RULE,
  SCENE_ORG_PLACEMENT_AUTHORITY_GUARD,
  SCENE_ORG_REGION_PLACEMENT_POLICY,
  SCENE_ORG_SAVED_SCENE_KINDS,
  SCENE_ORG_SURFACE_PLACEMENT,
  createSceneOrgSavedScene,
  projectSceneOrgStagePresentation,
  resolveSceneOrgSavedSceneCaptureId,
  resolveSceneOrgSavedScene,
} from "./sceneOrgWorkspacePlacementContract.ts";

const references = ["obj-risk", "obj-capacity", "obj-margin", "obj-revenue"].map(
  (canonicalId) =>
    createSceneOrgCanonicalReference({
      canonicalId,
      kind: "object",
      owner: "canonical MO/Object catalog",
    }),
);

test("ORG:4 places NMI and Attention in Left Management presentation", () => {
  assert.equal(SCENE_ORG_SURFACE_PLACEMENT.NMI_NAVIGATION, "left-management");
  assert.equal(SCENE_ORG_SURFACE_PLACEMENT.ATTENTION, "left-management");
  const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
  const left = html.indexOf('data-scene-org-region="left-management"');
  const stage = html.indexOf('data-scene-org-region="center-stage"');
  assert.ok(left >= 0 && stage > left);
  assert.match(html, /data-testid="executive-nav-nmi"/);
  assert.match(html, /<aside[^>]*hidden=""[^>]*data-testid="nexora-executive-queue"/);
  const nmi = renderToStaticMarkup(
    React.createElement(NexoraExecutiveQueueOverlay, {
      placement: "left-management",
      entries: [
        {
          category: "problem",
          count: 1,
          objectIds: ["ctx-problem-capacity"],
          isSemanticObject: false,
          isActive: false,
        },
      ],
      onSelectCategory: () => undefined,
    }),
  );
  assert.match(nmi, /data-scene-org-placement="left-management"/);
  assert.match(nmi, /data-testid="nexora-executive-queue"/);
});

test("ORG:4 keeps raw CSV/data files out of permanent primary Left navigation", () => {
  assert.equal(SCENE_ORG_SURFACE_PLACEMENT.RAW_CSV_DATA, "detail-workspace");
  assert.equal(
    SCENE_ORG_REGION_PLACEMENT_POLICY["left-management"]
      .permanentRawDataNavigation,
    false,
  );
});

test("ORG:4 keeps the existing authoritative Stage in Center", () => {
  assert.equal(SCENE_ORG_SURFACE_PLACEMENT.MANAGEMENT_STAGE, "center-stage");
  const html = renderToStaticMarkup(
    React.createElement(
      NexoraWorkspaceRegionBoundary,
      { region: "center-stage" },
      React.createElement("span", { "data-testid": "nexora-stage-mount" }),
    ),
  );
  assert.match(html, /data-testid="nexora-stage-mount"/);
  assert.match(html, /data-scene-org-normal-card-limit="0-3"/);
});

test("ORG:4 normal card presentation preserves authority order and shows at most three", () => {
  const result = projectSceneOrgStagePresentation({
    mode: "NORMAL_MANAGEMENT_CARDS",
    authorityAdmitted: references,
  });
  assert.equal(SCENE_ORG_NORMAL_STAGE_CARD_RULE.calculatesRelevance, false);
  assert.deepEqual(result.visible, references.slice(0, 3));
  assert.deepEqual(result.deferred, references.slice(3));
  assert.ok(result.visible.length <= 3);
});

test("ORG:4 Theatre compositions are never truncated by the normal card rule", () => {
  const result = projectSceneOrgStagePresentation({
    mode: "THEATRE_COMPOSITION",
    authorityAdmitted: references,
  });
  assert.equal(SCENE_ORG_NORMAL_STAGE_CARD_RULE.theatreCompositionExempt, true);
  assert.equal(result.visible.length, 4);
  assert.equal(result.deferred.length, 0);
  assert.deepEqual(result.visible, references);
});

test("ORG:4 routes deep-detail surfaces away from permanent Stage presentation", () => {
  assert.equal(SCENE_ORG_SURFACE_PLACEMENT.PROVENANCE_MAPPING, "detail-workspace");
  assert.equal(
    SCENE_ORG_SURFACE_PLACEMENT.CONNECTION_CONFIGURATION,
    "detail-workspace",
  );
  assert.equal(
    SCENE_ORG_REGION_PLACEMENT_POLICY["center-stage"].permanentDeepDetail,
    false,
  );
});

test("ORG:4 Saved Scene metadata stores references and view preferences only", () => {
  assert.deepEqual(SCENE_ORG_SAVED_SCENE_KINDS, [
    "TEMPORARY",
    "SAVED",
    "DEFAULT_MANAGER",
  ]);
  const scene = createSceneOrgSavedScene({
    sceneId: "scene-capacity-review",
    name: "Capacity Review",
    kind: "SAVED",
    sceneIntentType: "problem-investigation",
    canonicalReferences: references.slice(0, 2),
    layout: {
      presentationDepth: "minimum",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "closed",
    },
    visibility: { "center-stage": "PRIMARY", "right-context": "SUPPORTING" },
    // Runtime callers may carry extra data; the factory deliberately ignores it.
    ...({ kpiValues: [91], evidence: ["copied"], csvRows: [["forbidden"]] } as object),
  });
  assert.deepEqual(Object.keys(scene).sort(), [
    "canonicalReferences",
    "kind",
    "layout",
    "name",
    "sceneId",
    "sceneIntentType",
    "visibility",
  ]);
  assert.equal(JSON.stringify(scene).includes("forbidden"), false);
  assert.equal(JSON.stringify(scene).includes("kpiValues"), false);
});

test("ORG:FINAL Saved Scene capture prefers current workspace focus over a stale conversational referent", () => {
  assert.equal(
    resolveSceneOrgSavedSceneCaptureId({
      focusedSubjectId: "ctx-decision-reprice",
      selectedSubjectId: "ctx-decision-reprice",
      resolvedReferentId: "obj-capacity",
    }),
    "ctx-decision-reprice",
  );
  assert.equal(
    resolveSceneOrgSavedSceneCaptureId({
      focusedSubjectId: null,
      selectedSubjectId: null,
      resolvedReferentId: "obj-capacity",
    }),
    "obj-capacity",
  );
});

test("ORG:4 reopening a Saved Scene resolves fresh canonical live content", () => {
  const scene = createSceneOrgSavedScene({
    sceneId: "scene-risk",
    name: "Risk Review",
    kind: "DEFAULT_MANAGER",
    sceneIntentType: "risk-review",
    canonicalReferences: [references[0]!],
    layout: {
      presentationDepth: "report",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "closed",
    },
  });
  let liveStatus = "watch";
  const first = resolveSceneOrgSavedScene(scene, (reference) => ({
    id: reference.canonicalId,
    status: liveStatus,
  }));
  liveStatus = "urgent";
  const reopened = resolveSceneOrgSavedScene(scene, (reference) => ({
    id: reference.canonicalId,
    status: liveStatus,
  }));
  assert.equal(first.live[0]?.content?.status, "watch");
  assert.equal(reopened.live[0]?.content?.status, "urgent");
  assert.equal(reopened.live[0]?.reference, references[0]);
});

test("ORG:4 creates no relevance, truth, composition, workflow, or persistence authority", () => {
  assert.deepEqual(SCENE_ORG_PLACEMENT_AUTHORITY_GUARD, {
    createsRelevanceAuthority: false,
    createsBusinessTruth: false,
    createsSceneComposer: false,
    createsWorkflow: false,
    createsPersistenceStore: false,
    copiesCanonicalBusinessState: false,
    addsNaturalLanguageRouting: false,
  });
});
