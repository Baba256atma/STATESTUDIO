import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ExecutiveLeftNav } from "@/app/executive/exs1/shell/ExecutiveLeftNav.tsx";
import { NexoraExecutiveShell } from "@/app/executive/nex-mvp/NexoraExecutiveShell.tsx";
import { NexoraExecutiveQueueOverlay } from "@/app/executive/nex-mvp/stage/NexoraExecutiveQueueOverlay.tsx";
import {
  SCENE_ORG_ACTIVITY_AUTHORITY_GUARD,
} from "./sceneOrgActivityWorkspaceContract.ts";
import {
  SCENE_ORG_DETAIL_AUTHORITY_GUARD,
} from "./sceneOrgDetailWorkspaceContract.ts";
import {
  SCENE_ORG_DUPLICATE_AUTHORITY_GUARD,
} from "./sceneOrgRegionContract.ts";
import {
  createSceneOrgRightPanelChromeState,
  updateSceneOrgRightPanelChrome,
} from "./sceneOrgRightContextContract.ts";
import {
  SCENE_ORG_NORMAL_STAGE_CARD_RULE,
  SCENE_ORG_PLACEMENT_AUTHORITY_GUARD,
} from "./sceneOrgWorkspacePlacementContract.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const entries = Object.freeze([
  Object.freeze({ category: "problem" as const, count: 2, objectIds: Object.freeze(["ctx-problem-capacity"]), isSemanticObject: false as const, isActive: false }),
  Object.freeze({ category: "scenario" as const, count: 1, objectIds: Object.freeze(["ctx-scenario-capacity"]), isSemanticObject: false as const, isActive: false }),
  Object.freeze({ category: "decision" as const, count: 1, objectIds: Object.freeze(["ctx-decision-capacity"]), isSemanticObject: false as const, isActive: false }),
  Object.freeze({ category: "execution" as const, count: 1, objectIds: Object.freeze(["ctx-execution-capacity"]), isSemanticObject: false as const, isActive: false }),
  Object.freeze({ category: "changes-since-visit" as const, count: 2, objectIds: Object.freeze(["obj-capacity"]), isSemanticObject: false as const, isActive: false, collectionKind: "productivity" as const }),
]);

test("ORG:8 compact navigation orders Hm → NMI → Dt → Jn → More", () => {
  const html = renderToStaticMarkup(
    React.createElement(ExecutiveLeftNav, {
      active: "Home",
      onSelect: () => undefined,
      compact: true,
      nmiOpen: false,
      onToggleNmi: () => undefined,
    }),
  );
  const positions = ["executive-nav-home", "executive-nav-nmi", "executive-nav-data", "executive-nav-journal", "executive-nav-more"].map((token) => html.indexOf(token));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((left, right) => left - right));
  assert.match(html, /data-testid="executive-nav-nmi"[^>]*aria-pressed="false"/);
});

test("ORG:8 NMI open state is a presentation control on the same compact rail", () => {
  const html = renderToStaticMarkup(
    React.createElement(ExecutiveLeftNav, {
      active: "Home",
      onSelect: () => undefined,
      compact: true,
      nmiOpen: true,
      onToggleNmi: () => undefined,
    }),
  );
  assert.match(html, /data-testid="executive-nav-nmi"[^>]*aria-pressed="true"/);
  assert.match(html, /title="Collapse NMI"/);
});

test("ORG:8 shell defaults to focused Stage density with NMI closed", () => {
  const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
  assert.match(html, /data-nmi-panel-open="false"/);
  assert.match(html, /<aside[^>]*hidden=""[^>]*data-testid="nexora-executive-queue"/);
  assert.match(html, /<aside[^>]*aria-hidden="true"[^>]*data-testid="nexora-executive-queue"/);
  assert.ok(html.indexOf('data-scene-org-region="center-stage"') < html.indexOf('data-scene-org-region="right-context"'));
});

test("ORG:8 opened NMI reuses existing Attention, Map, collection, and change contents", () => {
  const html = renderToStaticMarkup(
    React.createElement(NexoraExecutiveQueueOverlay, {
      placement: "left-management",
      entries,
      mapNodes: [],
      onSelectCategory: () => undefined,
    }),
  );
  for (const label of ["Attention", "Management Map", "Problems", "Scenarios", "Decisions", "Executions", "Recent Changes"]) {
    assert.match(html, new RegExp(label));
  }
  assert.match(html, /data-scene-org-placement="left-management"/);
  assert.match(html, /<details[^>]*open=""/);
});

test("ORG:8 preserves certified Stage density and Theatre exemption", () => {
  assert.deepEqual(SCENE_ORG_NORMAL_STAGE_CARD_RULE, {
    minimum: 0,
    maximum: 3,
    appliesTo: "normal-management-cards",
    preservesAuthorityOrder: true,
    calculatesRelevance: false,
    theatreCompositionExempt: true,
    deepDetailExcluded: true,
  });
});

test("ORG:8 Right collapse remains presentation-only", () => {
  const state = createSceneOrgRightPanelChromeState();
  const collapsed = updateSceneOrgRightPanelChrome(state, { kind: "TOGGLE_COLLAPSE" });
  assert.equal(collapsed.collapsed, true);
  assert.equal(collapsed.width, state.width);
});

test("ORG:8 introduces no replacement authority", () => {
  assert.ok(Object.values(SCENE_ORG_DUPLICATE_AUTHORITY_GUARD).every((value) => value === false));
  assert.ok(Object.values(SCENE_ORG_PLACEMENT_AUTHORITY_GUARD).every((value) => value === false));
  assert.equal(SCENE_ORG_DETAIL_AUTHORITY_GUARD.createsDataReality, false);
  assert.equal(SCENE_ORG_ACTIVITY_AUTHORITY_GUARD.createsEventLedger, false);
  assert.equal(SCENE_ORG_ACTIVITY_AUTHORITY_GUARD.createsWorkspaceRuntime, false);
});

test("ORG:FINAL workspace presentation actions cannot be overwritten by generic Runtime commit", () => {
  const shell = readFileSync(
    join(HERE, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  assert.match(
    shell,
    /result\.shouldCommitRuntime && workspaceResponse == null/,
  );
});
