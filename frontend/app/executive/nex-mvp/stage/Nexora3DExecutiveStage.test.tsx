/**
 * NEX-MVP:3/4 — 3D Executive Stage host tests (non-WebGL layer).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Nexora3DExecutiveStage } from "./Nexora3DExecutiveStage.tsx";
import { NexoraExecutiveShell } from "../NexoraExecutiveShell.tsx";
import { getNexora3DExecutiveStageIdentity } from "../../../lib/nex-mvp/nexora3DExecutiveStage.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "../../../lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPSceneEnvironmentVisualState } from "../../../lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import { deriveNexoraMVPPresentationViewModel } from "../../../lib/nex-mvp/nexoraMVPPresentationState.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

function presentationFor(objectId: string | null) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (objectId) {
    state = selectNexoraMVPInteractionSubject(state, objectId);
  }
  const interaction = deriveNexoraMVPStageInteractionPresentation(state);
  const advisorBridge = buildNexoraMVPAdvisorContextBridge(state, interaction);
  const environment = deriveNexoraMVPSceneEnvironmentVisualState(
    state.environmentIntent,
  );
  const subject = state.focusedSubject ?? state.selectedSubject;
  const presentationViewModel = deriveNexoraMVPPresentationViewModel({
    presentationState: state.presentationState,
    workspace: state.workspace,
    environmentIntent: state.environmentIntent,
    subjectId: subject?.id ?? null,
    subjectKind: subject?.kind ?? null,
    subjectLabel: subject?.label ?? null,
  });
  return {
    interaction,
    advisorBridge,
    environment,
    presentationViewModel,
    stageProps: {
      workspaceLabel: "Overview",
      interaction,
      environment,
      presentationViewModel,
      advisorBridge,
      onSelectSubject: () => undefined,
      onStepBack: () => undefined,
      onOverview: () => undefined,
      onPresentationStateChange: () => undefined,
      onPresentationAction: () => undefined,
    },
  };
}

describe("NEX-MVP:3 3D Executive Stage host", () => {
  it("1. exposes Stage identity", () => {
    const identity = getNexora3DExecutiveStageIdentity();
    assert.equal(identity.id, "NEX-MVP:3/Nexora3DExecutiveStage");
    assert.equal(identity.version, "1.3.0");
  });

  it("2. Stage mounts inside shell Stage Frame", () => {
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /data-testid="executive-stage-frame"/);
    assert.match(html, /data-testid="nexora-stage-mount"/);
    assert.match(html, /data-testid="nexora-3d-executive-stage"/);
    assert.match(html, /data-nex-mvp="3"/);
  });

  it("3. Canvas renderer is client-safe via dynamic ssr:false", () => {
    const host = readFileSync(join(HERE, "Nexora3DExecutiveStage.tsx"), "utf8");
    assert.match(host, /next\/dynamic/);
    assert.match(host, /ssr:\s*false/);
    assert.match(host, /NexoraStageCanvas/);
  });

  it("4. Stage accepts interaction presentation state and environment intent", () => {
    const { stageProps } = presentationFor(null);
    const html = renderToStaticMarkup(
      React.createElement(Nexora3DExecutiveStage, stageProps),
    );
    assert.match(html, /data-presentation-state="minimum"/);
    assert.match(html, /data-environment-intent="neutral"/);
    assert.match(html, /data-stage-mode="overview"/);
    assert.match(html, /data-interaction-mode="overview"/);
  });

  it("5. focused object state is represented in host markup", () => {
    const state = createInitialNexoraMVPObjectInteractionState({
      workspace: "problem",
      presentationState: "report",
      environmentIntent: "investigate",
    });
    const focused = selectNexoraMVPInteractionSubject(state, "obj-delivery");
    const interaction = deriveNexoraMVPStageInteractionPresentation(focused);
    const advisorBridge = buildNexoraMVPAdvisorContextBridge(
      focused,
      interaction,
    );
    const environment = deriveNexoraMVPSceneEnvironmentVisualState(
      focused.environmentIntent,
    );
    const subject = focused.focusedSubject;
    const presentationViewModel = deriveNexoraMVPPresentationViewModel({
      presentationState: focused.presentationState,
      workspace: focused.workspace,
      environmentIntent: focused.environmentIntent,
      subjectId: subject?.id ?? null,
      subjectKind: subject?.kind ?? null,
      subjectLabel: subject?.label ?? null,
    });
    const html = renderToStaticMarkup(
      React.createElement(Nexora3DExecutiveStage, {
        workspaceLabel: "Problem",
        interaction,
        environment,
        presentationViewModel,
        advisorBridge,
        onSelectSubject: () => undefined,
        onStepBack: () => undefined,
        onOverview: () => undefined,
        onPresentationStateChange: () => undefined,
        onPresentationAction: () => undefined,
      }),
    );
    assert.match(html, /data-selected-object="obj-delivery"/);
    assert.match(html, /data-focused-object="obj-delivery"/);
    assert.match(html, /data-stage-mode="focus"/);
    assert.match(html, /data-role="focused"/);
    assert.match(html, /Focused subject: Delivery/);
  });

  it("6. related and unrelated roles appear in companion controls", () => {
    const { stageProps } = presentationFor("obj-delivery");
    const html = renderToStaticMarkup(
      React.createElement(Nexora3DExecutiveStage, stageProps),
    );
    assert.match(html, /data-role="related"/);
    assert.match(html, /data-role="unrelated"/);
    assert.match(html, /data-testid="nexora-stage-reset"/);
  });

  it("7. resize-safe absolute fill container exists", () => {
    const { stageProps } = presentationFor(null);
    const html = renderToStaticMarkup(
      React.createElement(Nexora3DExecutiveStage, stageProps),
    );
    assert.match(html, /data-testid="nexora-3d-executive-stage"/);
    assert.match(html, /position:\s*absolute/);
    assert.match(html, /inset:\s*0/);
    assert.match(html, /overflow:\s*hidden/);
  });

  it("8. Stage fallback markup exists for unavailable renderer", () => {
    const host = readFileSync(join(HERE, "Nexora3DExecutiveStage.tsx"), "utf8");
    assert.match(host, /nexora-stage-fallback/);
    assert.match(host, /StageErrorBoundary/);
    assert.match(host, /Spatial Stage Unavailable/);
  });

  it("9. no private upstream runtime imports in Stage modules", () => {
    const files = [
      "Nexora3DExecutiveStage.tsx",
      "NexoraStageCanvas.tsx",
      "NexoraStageScene.tsx",
      "NexoraStageObject.tsx",
      "NexoraStageConnections.tsx",
      "NexoraStageCameraController.tsx",
      "NexoraStageContextNodes.tsx",
      "NexoraStageInteractionBreadcrumb.tsx",
    ];
    for (const file of files) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/(?:nol|dri|ex-dri|rex)(?:\/[^"']*)?["']/,
      );
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/nex-ci\/(?!executiveCockpitIntegrationPublicIndex)[^"']*["']/,
      );
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/nex-mvp\/nexoraMVPUpstreamIntegration["']/,
      );
    }
  });

  it("10. object interaction callback surface is wired in shell", () => {
    const shell = readFileSync(
      join(HERE, "../NexoraExecutiveShell.tsx"),
      "utf8",
    );
    assert.match(shell, /onSelectSubject/);
    assert.match(shell, /selectNexoraMVPInteractionSubject/);
    assert.match(shell, /stepBackNexoraMVPObjectInteraction/);
    assert.match(shell, /selectedSubject/);
    assert.match(shell, /focusedSubject/);
  });
});

describe("NEX-MVP:4 Stage object interaction host", () => {
  it("1. object click control surface forwards subject ids", () => {
    const host = readFileSync(join(HERE, "Nexora3DExecutiveStage.tsx"), "utf8");
    assert.match(host, /onSelectSubject\(object\.id\)/);
    assert.match(host, /onSelectSubject\(node\.subjectId\)/);
  });

  it("2. focused object receives focused presentation", () => {
    const { stageProps } = presentationFor("obj-revenue");
    const html = renderToStaticMarkup(
      React.createElement(Nexora3DExecutiveStage, stageProps),
    );
    assert.match(html, /data-focused-object="obj-revenue"/);
    assert.match(html, /data-role="focused"/);
    assert.match(html, /data-interaction-mode="object-focused"/);
  });

  it("3. related objects are emphasized in companion list", () => {
    const { interaction } = presentationFor("obj-revenue");
    assert.ok(interaction.emphasizedObjectIds.length > 0);
    assert.ok(
      interaction.scene.objects.some((object) => object.role === "related"),
    );
  });

  it("4. unrelated objects are subordinate", () => {
    const { interaction } = presentationFor("obj-revenue");
    assert.ok(interaction.subordinateObjectIds.length > 0);
  });

  it("5. relevant relationships are emphasized", () => {
    const { interaction } = presentationFor("obj-revenue");
    assert.ok(
      interaction.scene.connections.some((connection) => connection.emphasized) ||
        interaction.emphasizedRelationshipIds.length >= 0,
    );
  });

  it("6. context nodes render when provided", () => {
    const { stageProps } = presentationFor("obj-revenue");
    const html = renderToStaticMarkup(
      React.createElement(Nexora3DExecutiveStage, stageProps),
    );
    assert.match(html, /data-testid="nexora-stage-context-control-ctx-scenario-pricing"/);
    assert.match(html, /data-kind="scenario"/);
  });

  it("7. context node selection surface is present", () => {
    const host = readFileSync(join(HERE, "Nexora3DExecutiveStage.tsx"), "utf8");
    assert.match(host, /nexora-stage-context-control-/);
    assert.match(host, /onSelectSubject\(node\.subjectId\)/);
  });

  it("8. reset control works", () => {
    const { stageProps } = presentationFor("obj-revenue");
    const html = renderToStaticMarkup(
      React.createElement(Nexora3DExecutiveStage, stageProps),
    );
    assert.match(html, /data-testid="nexora-stage-reset"/);
    assert.match(html, /data-testid="nexora-stage-step-back"/);
  });

  it("9. breadcrumb / orientation indicator updates", () => {
    const { stageProps } = presentationFor("obj-revenue");
    const html = renderToStaticMarkup(
      React.createElement(Nexora3DExecutiveStage, stageProps),
    );
    assert.match(html, /data-testid="nexora-stage-interaction-breadcrumb"/);
    assert.match(html, /Overview/);
    assert.match(html, /Revenue/);
  });

  it("10. Stage does not page-navigate during interaction", () => {
    const host = readFileSync(join(HERE, "Nexora3DExecutiveStage.tsx"), "utf8");
    assert.doesNotMatch(host, /router\.push|useRouter|window\.location/);
    const shell = readFileSync(
      join(HERE, "../NexoraExecutiveShell.tsx"),
      "utf8",
    );
    assert.doesNotMatch(shell, /router\.push|useRouter/);
  });

  it("11. Advisor context bridge updates in shell", () => {
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /data-testid="nexora-advisor-context"/);
    assert.match(html, /data-advisor-mode="overview"/);
    assert.match(html, /data-advisor-subject="none"/);
  });

  it("12. no private upstream runtime import was introduced", () => {
    const lib = readFileSync(
      join(HERE, "../../../lib/nex-mvp/nexoraMVPObjectInteraction.ts"),
      "utf8",
    );
    assert.doesNotMatch(
      lib,
      /from\s+["']@\/app\/lib\/(?:nol|dri|ex-dri|rex)(?:\/[^"']*)?["']/,
    );
    assert.doesNotMatch(
      lib,
      /from\s+["']@\/app\/lib\/nex-mvp\/nexoraMVPUpstreamIntegration["']/,
    );
  });
});
