import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  NexoraDetailWorkspaceBoundary,
  NexoraWorkspaceRegionBoundary,
} from "@/app/executive/nex-mvp/scene-org/NexoraWorkspaceRegionBoundary.tsx";
import { createSceneOrgCanonicalReference } from "./sceneOrgRegionContract.ts";
import {
  SCENE_ORG_REGION_VISIBILITY_POLICY,
  SCENE_ORG_VISIBILITY_AUTHORITY_GUARD,
  SCENE_ORG_VISIBILITY_LEVELS,
  projectSceneOrgVisibility,
} from "./sceneOrgVisibilityContract.ts";

const focus = createSceneOrgCanonicalReference({
  canonicalId: "obj-risk",
  kind: "object",
  owner: "canonical MO/Object catalog",
});

test("ORG:3 classifies current authority-selected management focus as PRIMARY", () => {
  const projection = projectSceneOrgVisibility({
    reference: focus,
    level: "PRIMARY",
    region: "center-stage",
    classifiedBy: "DIR:1",
  });
  assert.equal(projection.level, "PRIMARY");
  assert.equal(projection.treatment, "visible-dominant");
  assert.equal(projection.reference, focus);
});

test("ORG:3 keeps supporting context subordinate to PRIMARY Stage content", () => {
  assert.deepEqual(SCENE_ORG_VISIBILITY_LEVELS, [
    "PRIMARY",
    "SUPPORTING",
    "DEFERRED",
    "DEEP_DETAIL",
  ]);
  assert.equal(
    SCENE_ORG_REGION_VISIBILITY_POLICY["center-stage"].defaultLevel,
    "PRIMARY",
  );
  assert.equal(
    SCENE_ORG_REGION_VISIBILITY_POLICY["right-context"].defaultLevel,
    "SUPPORTING",
  );
  const supporting = projectSceneOrgVisibility({
    reference: focus,
    level: "SUPPORTING",
    region: "right-context",
    classifiedBy: "CC:5/NCA/NXA/ECA/MO",
  });
  assert.equal(supporting.treatment, "visible-subordinate");
});

test("ORG:3 keeps deferred information collapsed without losing canonical identity", () => {
  const deferred = projectSceneOrgVisibility({
    reference: focus,
    level: "DEFERRED",
    region: "right-context",
    classifiedBy: "NEX-MVP/STAGE-PROD",
  });
  assert.equal(deferred.treatment, "collapsed-until-requested");
  assert.equal(deferred.reference, focus);
  assert.equal(deferred.reference.canonicalId, "obj-risk");
});

test("ORG:3 routes deep CSV/configuration classification to Detail, not Stage or Left", () => {
  const csv = createSceneOrgCanonicalReference({
    canonicalId: "csv-source-quarterly-risk",
    kind: "data-source",
    owner: "RDI:2 CSV lifecycle",
  });
  const detail = projectSceneOrgVisibility({
    reference: csv,
    level: "DEEP_DETAIL",
    region: "detail-workspace",
    classifiedBy: "RDI:2 CSV lifecycle",
  });
  assert.equal(detail.treatment, "detail-workspace-only");
  for (const region of ["left-management", "center-stage"] as const) {
    assert.throws(
      () =>
        projectSceneOrgVisibility({
          reference: csv,
          level: "DEEP_DETAIL",
          region,
          classifiedBy: "RDI:2 CSV lifecycle",
        }),
      /does not belong/,
    );
  }
});

test("ORG:3 visibility projection cannot modify canonical business state", () => {
  const canonicalBusinessState = Object.freeze({
    id: focus.canonicalId,
    status: "at-risk",
    evidenceCount: 4,
  });
  const before = JSON.stringify(canonicalBusinessState);
  const projection = projectSceneOrgVisibility({
    reference: focus,
    level: "DEFERRED",
    region: "right-context",
    classifiedBy: "DTH/DTH-EXP",
  });
  assert.equal(JSON.stringify(canonicalBusinessState), before);
  assert.deepEqual(Object.keys(projection).sort(), [
    "classifiedBy",
    "level",
    "reference",
    "region",
    "treatment",
  ]);
  assert.equal(Object.isFrozen(projection), true);
});

test("ORG:3 production seams expose treatment while existing authorities retain relevance", () => {
  assert.deepEqual(SCENE_ORG_VISIBILITY_AUTHORITY_GUARD, {
    presentationOnly: true,
    consumesAuthoritativeSelection: true,
    calculatesPriority: false,
    calculatesRelevance: false,
    ownsAdmission: false,
    mutatesCanonicalState: false,
    createsDirectorLogic: false,
  });
  const html = renderToStaticMarkup(
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        NexoraWorkspaceRegionBoundary,
        { region: "center-stage", canonicalTargetId: focus.canonicalId },
        React.createElement("span", null, "existing Stage"),
      ),
      React.createElement(
        NexoraWorkspaceRegionBoundary,
        { region: "right-context", referentId: focus.canonicalId },
        React.createElement("span", null, "existing Advisor"),
      ),
      React.createElement(NexoraDetailWorkspaceBoundary, { target: focus }),
    ),
  );
  assert.match(html, /data-scene-org-default-visibility="PRIMARY"/);
  assert.match(html, /data-scene-org-default-visibility="SUPPORTING"/);
  assert.match(html, /data-scene-org-default-visibility="DEEP_DETAIL"/);
  assert.match(html, /data-scene-org-canonical-target="obj-risk"/);
});
