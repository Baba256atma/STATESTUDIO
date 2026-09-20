/** NPA-T STAGE-PROD:5 — activate → identify → disclose → dismiss. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Nexora3DExecutiveStage } from "@/app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx";
import { NexoraDecisionTheatreInvestigationSurface } from "@/app/executive/nex-mvp/stage/NexoraDecisionTheatreInvestigationSurface.tsx";
import { NexoraStageContextualVisual } from "@/app/executive/nex-mvp/stage/NexoraStageContextualVisual.tsx";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState.ts";
import { deriveNexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import type { StageProdStatusCardVisualSpec } from "./stageProdVisualSpecification.ts";
import {
  projectStageProdInteractiveDisclosure,
  stageProdInteractiveDisclosureIdentity,
} from "./stageProdInteractiveDisclosure.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function selectedCapacity() {
  const before = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const state = selectNexoraMVPInteractionSubject(
    before,
    "ctx-problem-capacity",
    catalog,
  );
  const interaction = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    investigationLevel: "investigate",
  });
  assert.ok(theatre.objectInvestigation);
  return { before, state, interaction, theatre, investigation: theatre.objectInvestigation };
}

function renderHost() {
  const fixture = selectedCapacity();
  return renderToStaticMarkup(
    React.createElement(Nexora3DExecutiveStage, {
      workspaceLabel: "Overview",
      interaction: fixture.interaction,
      environment: deriveNexoraMVPSceneEnvironmentVisualState("neutral"),
      presentationViewModel: deriveNexoraMVPPresentationViewModel({
        presentationState: "minimum",
        workspace: "overview",
        environmentIntent: "neutral",
        subjectId: "ctx-problem-capacity",
        subjectKind: "problem",
        subjectLabel: "Capacity Gap",
      }),
      advisorBridge: buildNexoraMVPAdvisorContextBridge(fixture.state, fixture.interaction),
      onSelectSubject: () => undefined,
      onStepBack: () => undefined,
      onOverview: () => undefined,
      onPresentationStateChange: () => undefined,
      onPresentationAction: () => undefined,
      theatreComposition: fixture.theatre,
    }),
  );
}

function renderDisclosure() {
  const { investigation } = selectedCapacity();
  return renderToStaticMarkup(
    React.createElement(NexoraDecisionTheatreInvestigationSurface, {
      investigation,
      onLevelChange: () => undefined,
      onClose: () => undefined,
      onAsk: () => undefined,
    }),
  );
}

test("A — Object activation preserves Capacity Gap canonical ID", () => {
  const { state } = selectedCapacity();
  assert.equal(state.selectedSubject?.id, "ctx-problem-capacity");
  assert.equal(state.focusedSubject?.id, "ctx-problem-capacity");
});

test("B — visible selection receives existing Stage focus presentation", () => {
  const html = renderHost();
  assert.match(html, /data-testid="nexora-stage-object-control-ctx-problem-capacity"/);
  assert.match(html, /data-selected="true"/);
  assert.match(html, /aria-pressed="true"/);
});

test("C — disclosure renders only the existing DTH investigation", () => {
  const { investigation } = selectedCapacity();
  const result = projectStageProdInteractiveDisclosure({
    selectedCanonicalObjectId: investigation.objectId,
    visibleCanonicalObjectIds: [investigation.objectId],
    investigation,
    disclosureVisible: true,
  });
  assert.equal(result.investigation, investigation);
  assert.match(renderDisclosure(), /Capacity Gap/);
  assert.match(renderDisclosure(), /data-stage-prod-disclosed-object-id="ctx-problem-capacity"/);
});

test("D — dismissal removes detail without changing Stage or canonical state", () => {
  const { state, interaction, investigation } = selectedCapacity();
  const before = JSON.stringify({ state, scene: interaction.scene });
  const result = projectStageProdInteractiveDisclosure({
    selectedCanonicalObjectId: investigation.objectId,
    visibleCanonicalObjectIds: [investigation.objectId],
    investigation,
    disclosureVisible: false,
  });
  assert.equal(result.status, "dismissed");
  assert.equal(result.investigation, null);
  assert.equal(JSON.stringify({ state, scene: interaction.scene }), before);
});

test("E — duplicate labels cannot substitute for canonical identity", () => {
  const { investigation } = selectedCapacity();
  const result = projectStageProdInteractiveDisclosure({
    selectedCanonicalObjectId: "duplicate-capacity-id",
    visibleCanonicalObjectIds: ["duplicate-capacity-id", investigation.objectId],
    investigation,
    disclosureVisible: true,
  });
  assert.equal(result.status, "stale");
  assert.equal(result.lookedUpByLabel, false);
  assert.equal(result.investigation, null);
});

test("F — visual inspection preserves exact Object and source association", () => {
  const spec: StageProdStatusCardVisualSpec = Object.freeze({
    identity: "NPA-T STAGE-PROD:4/ContextualVisualSpecification:test",
    family: "STATUS_CARD",
    title: "Capacity Gap",
    status: "active",
    evidenceSummary: "Existing evidence",
    provenance: Object.freeze(["evidence:capacity"]),
    sceneScriptId: "scene:capacity",
    canonicalObjectIds: Object.freeze(["ctx-problem-capacity"]),
    sourceIds: Object.freeze(["evidence:capacity"]),
    evidenceStates: Object.freeze(["inferred"]),
    sceneRole: "contextual-support",
    writesCanonicalManagementState: false,
    isBusinessObject: false,
    isDataObject: false,
  });
  const html = renderToStaticMarkup(React.createElement(NexoraStageContextualVisual, { spec }));
  assert.match(html, /data-testid="nexora-stage-visual-inspection"/);
  assert.match(html, /data-stage-visual-inspection-object-ids="ctx-problem-capacity"/);
  assert.match(html, /data-stage-visual-inspection-source-ids="evidence:capacity"/);
});

test("G — disclosure preserves evidence and provenance semantics", () => {
  const { investigation } = selectedCapacity();
  const html = renderDisclosure();
  assert.match(html, new RegExp(`data-stage-prod-disclosure-provenance="${investigation.provenance.join("\\|")}`));
  assert.match(html, new RegExp(`data-stage-prod-disclosure-evidence="${investigation.evidence.map((item) => item.epistemicStatus).join("\\|")}`));
  assert.equal(investigation.derivationMetadata.inventedEvidence, false);
});

test("H — relationship disclosure preserves upstream causality status", () => {
  const { investigation } = selectedCapacity();
  assert.equal(investigation.derivationMetadata.inventedCausality, false);
  const html = renderDisclosure();
  for (const relationship of investigation.relationships) {
    assert.match(html, new RegExp(`data-stage-prod-related-object-id="${relationship.id}"`));
    assert.match(html, new RegExp(`data-stage-prod-causal-status="${relationship.causalStatus}"`));
  }
});

test("I — primary activation and dismissal controls are keyboard-native", () => {
  const host = renderHost();
  const disclosure = renderDisclosure();
  assert.match(host, /<button[^>]*data-testid="nexora-stage-object-control-ctx-problem-capacity"/);
  assert.match(host, /data-stage-prod-activation="canonical-id"/);
  assert.match(disclosure, /<button[^>]*data-testid="nexora-theatre-investigation-close"/);
  assert.match(disclosure, /aria-label="Close Capacity Gap disclosure"/);
});

test("J — stale selection is omitted and never attached by label", () => {
  const { investigation } = selectedCapacity();
  const result = projectStageProdInteractiveDisclosure({
    selectedCanonicalObjectId: investigation.objectId,
    visibleCanonicalObjectIds: ["ctx-problem-other"],
    investigation,
    disclosureVisible: true,
  });
  assert.equal(result.status, "stale");
  assert.equal(result.investigation, null);
  assert.equal(result.staleObjectSubstituted, false);
});

test("K — activation, inspection, disclosure, and dismissal are read-only", () => {
  const source = readFileSync(join(FRONTEND, "app/lib/stage-prod/stageProdInteractiveDisclosure.ts"), "utf8");
  assert.equal(stageProdInteractiveDisclosureIdentity, "NPA-T STAGE-PROD:5/InteractiveDisclosure");
  assert.doesNotMatch(source, /createDecision|startExecution|commitPrepared|updateEvidence/);
  assert.match(renderHost(), /data-stage-prod-activation-writes="false"/);
  assert.match(renderDisclosure(), /data-stage-prod-disclosure-writes="false"/);
});

test("L — STAGE-PROD:1–4 production authority path remains intact", () => {
  const mount = readFileSync(join(FRONTEND, "app/executive/nex-mvp/NexoraStageMount.tsx"), "utf8");
  const host = readFileSync(join(FRONTEND, "app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"), "utf8");
  assert.match(mount, /projectStageProdLiveFoundation/);
  assert.match(mount, /<Nexora3DExecutiveStage/);
  assert.match(host, /projectStageProdDirectorComposition/);
  assert.match(host, /projectStageProdContextualVisuals/);
  assert.match(host, /onSelectSubject\(object\.id\)/);
});
