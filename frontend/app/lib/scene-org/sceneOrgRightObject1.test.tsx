/** NPA-T RIGHT-OBJECT:1 — Object Card lives in the existing Selected Object tab. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraAdvisorInsightRegion } from "@/app/executive/nex-mvp/NexoraAdvisorInsightRegion.tsx";
import { NexoraStageMount } from "@/app/executive/nex-mvp/NexoraStageMount.tsx";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { projectNexoraDecisionTheatreDataObjectsToStage } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState.ts";
import { deriveNexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import {
  openSceneOrgRightPackageTab,
  createEmptySceneOrgRightPackageTabSession,
  syncSceneOrgRightSelectedObjectTab,
} from "./sceneOrgRightPackageTabContract.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const emptyDataObjectStage = projectNexoraDecisionTheatreDataObjectsToStage({
  dataObjects: Object.freeze([]),
  visibleDataObjectIds: Object.freeze([]),
  selectedDataObjectId: null,
  businessFocusId: null,
  stageObjects: Object.freeze([]),
});

function focus(
  subjectId: string,
  presentationState: "minimum" | "report" | "operation" = "operation",
) {
  const state = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState,
      environmentIntent: "neutral",
    }),
    subjectId,
    catalog,
  );
  const interaction = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    investigationLevel: "understand",
  });
  const subject = state.focusedSubject ?? state.selectedSubject;
  const presentationViewModel = deriveNexoraMVPPresentationViewModel({
    presentationState: state.presentationState,
    workspace: state.workspace,
    environmentIntent: state.environmentIntent,
    subjectId: subject?.id ?? null,
    subjectKind: subject?.kind ?? null,
    subjectLabel: subject?.label ?? null,
  });
  const session = syncSceneOrgRightSelectedObjectTab(
    createEmptySceneOrgRightPackageTabSession(),
    {
      package: "investigation",
      canonicalId: subjectId,
      label: subject?.label ?? subjectId,
    },
  );
  const activated = openSceneOrgRightPackageTab(session, {
    package: "investigation",
    canonicalId: subjectId,
    label: subject?.label ?? subjectId,
  });
  return {
    state,
    interaction,
    theatre,
    presentationViewModel,
    advisorBridge: buildNexoraMVPAdvisorContextBridge(state, interaction),
    session: activated,
    subject,
  };
}

function renderStage(
  subjectId: string,
  presentationState: "minimum" | "report" | "operation" = "operation",
) {
  const fixture = focus(subjectId, presentationState);
  return {
    ...fixture,
    html: renderToStaticMarkup(
      React.createElement(NexoraStageMount, {
        workspaceLabel: "Overview",
        interaction: fixture.interaction,
        environment: deriveNexoraMVPSceneEnvironmentVisualState("neutral"),
        presentationViewModel: fixture.presentationViewModel,
        advisorBridge: fixture.advisorBridge,
        theatreComposition: fixture.theatre,
        objectInvestigation: fixture.theatre.objectInvestigation,
        investigationVisible: true,
        dataObjectStage: emptyDataObjectStage,
        onSelectSubject: () => undefined,
        onStepBack: () => undefined,
        onOverview: () => undefined,
        onPresentationStateChange: () => undefined,
        onPresentationAction: () => undefined,
        onSelectDataObject: () => undefined,
        onRemoveDataObjectFromStage: () => undefined,
        onOpenDataRail: () => undefined,
        onAskDataObject: () => undefined,
      }),
    ),
  };
}

function renderRight(subjectId: string) {
  const fixture = focus(subjectId);
  return {
    ...fixture,
    html: renderToStaticMarkup(
      React.createElement(NexoraAdvisorInsightRegion, {
        tab: "Assist",
        onTabChange: () => undefined,
        advisorBridge: fixture.advisorBridge,
        presentationViewModel: fixture.presentationViewModel,
        focusedSubject: fixture.state.focusedSubject,
        selectedSubject: fixture.state.selectedSubject,
        onIntelligenceAction: () => undefined,
        packageTabSession: fixture.session,
        theatreComposition: fixture.theatre,
        investigationLevel: "understand",
      }),
    ),
  };
}

test("A — Object Card is absent from Stage while the Object remains", () => {
  const { html } = renderStage("ctx-problem-capacity");
  assert.doesNotMatch(html, /data-testid="nexora-theatre-investigation"/);
  assert.match(html, /data-testid="nexora-stage-object-control-ctx-problem-capacity"/);
  assert.match(html, /data-focused-object="ctx-problem-capacity"/);
});

test("B — Object Card appears in the existing Selected Object tab", () => {
  const { html, subject } = renderRight("ctx-problem-capacity");
  assert.match(html, /data-testid="nexora-right-package-tab-ctx-problem-capacity"/);
  assert.match(html, /data-testid="nexora-right-package-working-context"/);
  assert.match(html, /data-testid="nexora-theatre-investigation"/);
  assert.match(html, /data-object-card-host="right-panel"/);
  assert.match(html, /data-theatre-investigation-object-id="ctx-problem-capacity"/);
  assert.match(html, new RegExp(subject?.label ?? "Capacity Gap"));
  assert.doesNotMatch(html, /Open in Right/);
});

test("C — Selected Object tab follows canonical subject changes", () => {
  const capacity = syncSceneOrgRightSelectedObjectTab(
    createEmptySceneOrgRightPackageTabSession(),
    { package: "investigation", canonicalId: "ctx-problem-capacity", label: "Capacity Gap" },
  );
  const decision = syncSceneOrgRightSelectedObjectTab(capacity, {
    package: "investigation",
    canonicalId: "ctx-decision-capacity",
    label: "Expand Capacity",
  });
  const inventory = syncSceneOrgRightSelectedObjectTab(decision, {
    package: "investigation",
    canonicalId: "obj-inventory",
    label: "Inventory",
  });
  assert.equal(inventory.tabs.length, 1);
  assert.equal(inventory.tabs[0]?.canonicalId, "obj-inventory");
  assert.equal(inventory.tabs[0]?.label, "Inventory");
  const right = renderRight("ctx-decision-capacity");
  assert.match(right.html, /data-theatre-investigation-object-id="ctx-decision-capacity"/);
  assert.doesNotMatch(right.html, /data-theatre-investigation-object-id="ctx-problem-capacity"/);
});

test("D — VIEW remains a Stage control", () => {
  const stage = renderStage("ctx-problem-capacity").html;
  assert.match(stage, /data-testid="nexora-presentation-state-selector"/);
  const right = renderRight("ctx-problem-capacity").html;
  assert.doesNotMatch(right, /data-testid="nexora-presentation-state-selector"/);
});

test("E — ACTIONS remains a Stage control", () => {
  const stage = renderStage("ctx-problem-capacity").html;
  assert.match(stage, /data-testid="nexora-subject-operation"/);
  assert.match(stage, /Open Scenario|Open Capacity|Compare Scenarios/);
  const right = renderRight("ctx-problem-capacity").html;
  assert.doesNotMatch(right, /data-testid="nexora-subject-operation"/);
});

test("F — Stage Report remains on Stage", () => {
  const { html } = renderStage("ctx-problem-capacity", "report");
  assert.match(html, /data-testid="nexora-subject-report"/);
  assert.doesNotMatch(html, /data-testid="nexora-subject-operation"/);
});

test("G — textual Scene Evidence STATUS_CARD is absent from normal object focus", () => {
  const stage = renderStage("ctx-problem-capacity");
  const right = renderRight("ctx-problem-capacity");
  assert.doesNotMatch(stage.html, /data-testid="nexora-stage-contextual-visual"/);
  assert.doesNotMatch(stage.html, /data-stage-visual-family="STATUS_CARD"/);
  assert.match(right.html, /data-testid="nexora-theatre-investigation"/);
  assert.match(right.html, /data-testid="nexora-theatre-investigation-source"/);
  assert.match(
    stage.theatre.objectInvestigation?.advisorReadable.evidence ?? "",
    /evidence/i,
  );
});

test("H — Advisor tab remains available beside the Object tab", () => {
  const { html } = renderRight("ctx-problem-capacity");
  assert.match(html, /data-testid="executive-advisor-tab-assist"/);
});

test("I — Details tab remains available beside the Object tab", () => {
  const { html } = renderRight("ctx-problem-capacity");
  assert.match(html, /data-testid="executive-advisor-tab-insight"/);
});

test("J — Object Card is not duplicated on Stage and Right", () => {
  const stage = renderStage("ctx-problem-capacity").html;
  const right = renderRight("ctx-problem-capacity").html;
  assert.equal((stage.match(/data-testid="nexora-theatre-investigation"/g) ?? []).length, 0);
  assert.equal((right.match(/data-testid="nexora-theatre-investigation"/g) ?? []).length, 1);
  const mount = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/NexoraStageMount.tsx"),
    "utf8",
  );
  assert.doesNotMatch(mount, /NexoraDecisionTheatreInvestigationSurface/);
});
