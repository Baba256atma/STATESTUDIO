/**
 * NPA-T STAGE-THREAD:FIX1 — Collapse Thread placement & click safety.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Nexora3DExecutiveStage } from "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx";
import {
  buildNexoraMVPAdvisorContextBridge,
  collapsedExecutiveThreadSubjectId,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "../nex-mvp/nexoraMVPPresentationState.ts";
import { deriveNexoraMVPSceneEnvironmentVisualState } from "../nex-mvp/nexoraMVPWorkspacePresentation.ts";
import {
  EXECUTIVE_THREAD_COLLAPSE_CONTROL_SURFACE,
  formatExecutiveThreadGatewayLabel,
  getExecutiveThreadCollapseControlPlacementIdentity,
  isExecutiveThreadDiscoverableGatewayNode,
  isExecutiveThreadQuietCollapseNode,
} from "./executiveThreadExpansion.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const STAGE_DIR = join(HERE, "../../executive/nex-mvp/stage");

function stageFor(objectId: string, expandThread: boolean) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, objectId);
  if (expandThread) {
    state = selectNexoraMVPInteractionSubject(
      state,
      collapsedExecutiveThreadSubjectId(objectId),
    );
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
    state,
    interaction,
    html: renderToStaticMarkup(
      React.createElement(Nexora3DExecutiveStage, {
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
      }),
    ),
  };
}

describe("STAGE-THREAD:FIX1 unified Executive Thread control", () => {
  it("A — Collapsed → EXECUTIVE THREAD · N visible", () => {
    const { html, interaction } = stageFor("obj-capacity", false);
    const gateway = interaction.contextNodes.find(
      isExecutiveThreadDiscoverableGatewayNode,
    );
    assert.ok(gateway);
    const count = gateway!.gatewayCount ?? gateway!.collapsedMemberIds?.length ?? 0;
    assert.match(html, /data-testid="nexora-stage-thread-control"/);
    assert.match(html, /data-stage-thread-control="open"/);
    assert.match(html, new RegExp(formatExecutiveThreadGatewayLabel(count)));
    assert.doesNotMatch(html, /data-stage-thread-control="collapse"/);
  });

  it("B — Collapsed → COLLAPSE THREAD absent", () => {
    const { html, interaction } = stageFor("obj-capacity", false);
    assert.equal(interaction.threadExpansion?.expanded, false);
    assert.doesNotMatch(html, />Collapse Thread</);
    assert.match(html, /data-stage-thread-control-state="open"/);
  });

  it("C — Expanded → COLLAPSE THREAD visible", () => {
    const { html, interaction } = stageFor("obj-capacity", true);
    assert.equal(interaction.threadExpansion?.expanded, true);
    assert.ok(interaction.contextNodes.some(isExecutiveThreadQuietCollapseNode));
    assert.match(html, /data-testid="nexora-stage-thread-control"/);
    assert.match(html, /data-stage-thread-control="collapse"/);
    assert.match(html, />Collapse Thread</);
    assert.match(html, /aria-label="Collapse Executive Thread"/);
  });

  it("D — Expanded → EXECUTIVE THREAD · N absent", () => {
    const { html } = stageFor("obj-capacity", true);
    assert.doesNotMatch(html, /data-stage-thread-control="open"/);
    assert.doesNotMatch(html, /Executive Thread · /);
  });

  it("E — Both use the same logical control region", () => {
    const collapsed = stageFor("obj-capacity", false);
    const expanded = stageFor("obj-capacity", true);
    const identity = getExecutiveThreadCollapseControlPlacementIdentity();
    assert.equal(identity.ownerTestId, "nexora-stage-interaction-breadcrumb");
    assert.equal(identity.controlTestId, "nexora-stage-thread-control");
    for (const html of [collapsed.html, expanded.html]) {
      const bar = html.indexOf(
        'data-testid="nexora-stage-interaction-breadcrumb"',
      );
      const control = html.indexOf('data-testid="nexora-stage-thread-control"');
      assert.ok(bar >= 0 && control > bar);
    }
  });

  it("F — Floating scene Thread pill absent", () => {
    const collapsed = stageFor("obj-capacity", false);
    const expanded = stageFor("obj-capacity", true);
    for (const html of [collapsed.html, expanded.html]) {
      assert.doesNotMatch(
        html,
        /data-testid="nexora-stage-context-control-thread-obj-capacity"/,
      );
      assert.doesNotMatch(html, /data-visual-audit="stage-thread-gateway"/);
    }
    const nodes = readFileSync(
      join(STAGE_DIR, "NexoraStageContextNodes.tsx"),
      "utf8",
    );
    const scene = readFileSync(join(STAGE_DIR, "NexoraStageScene.tsx"), "utf8");
    assert.match(nodes, /role !== "collapsed-thread"/);
    assert.match(scene, /role !== "collapsed-thread"/);
  });

  it("G — Authoritative count preserved", () => {
    const { html, interaction } = stageFor("obj-capacity", false);
    const gateway = interaction.contextNodes.find(
      isExecutiveThreadDiscoverableGatewayNode,
    )!;
    const count = gateway.gatewayCount ?? gateway.collapsedMemberIds?.length ?? 0;
    assert.ok(count > 0);
    assert.match(html, new RegExp(`data-gateway-count="${count}"`));
    assert.match(html, new RegExp(formatExecutiveThreadGatewayLabel(count)));
    const risk = stageFor("obj-risk", false);
    const riskGateway = risk.interaction.contextNodes.find(
      isExecutiveThreadDiscoverableGatewayNode,
    );
    if (riskGateway != null) {
      const riskCount =
        riskGateway.gatewayCount ??
        riskGateway.collapsedMemberIds?.length ??
        0;
      assert.match(
        risk.html,
        new RegExp(`data-gateway-count="${riskCount}"`),
      );
    }
  });

  it("H — Open handler unchanged (select-subject toggle)", () => {
    let state = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    });
    state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
    assert.equal(state.expandExecutiveThread, false);
    state = selectNexoraMVPInteractionSubject(
      state,
      collapsedExecutiveThreadSubjectId("obj-capacity"),
    );
    assert.equal(state.expandExecutiveThread, true);
  });

  it("I — Collapse handler unchanged (same select-subject toggle)", () => {
    let state = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    });
    state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
    state = selectNexoraMVPInteractionSubject(
      state,
      collapsedExecutiveThreadSubjectId("obj-capacity"),
    );
    const focused = state.focusedSubject?.id;
    state = selectNexoraMVPInteractionSubject(
      state,
      collapsedExecutiveThreadSubjectId("obj-capacity"),
    );
    assert.equal(state.expandExecutiveThread, false);
    assert.equal(state.focusedSubject?.id, focused);
  });

  it("J — Object click independent of Thread control", () => {
    const host = readFileSync(
      join(STAGE_DIR, "Nexora3DExecutiveStage.tsx"),
      "utf8",
    );
    assert.match(host, /onSelectSubject\(object\.id\)/);
    assert.match(host, /onSelectSubject\(threadControlNode\.subjectId\)/);
    assert.doesNotMatch(host, /onSelectSubject\(object\.id\).*thread-/);
  });

  it("K — Relationship area unobstructed (no world occupancy)", () => {
    const identity = getExecutiveThreadCollapseControlPlacementIdentity();
    assert.equal(identity.worldOccupancy, false);
    const collapsed = stageFor("obj-capacity", false);
    assert.match(
      collapsed.html,
      /data-stage-thread-control-world-occupancy="false"/,
    );
  });

  it("L — Advisor-open compatible surface", () => {
    const { html } = stageFor("obj-capacity", false);
    assert.match(
      html,
      /data-stage-thread-collapse-surface="nexora-stage-interaction-breadcrumb"/,
    );
    assert.match(html, /data-testid="nexora-stage-thread-control"/);
  });

  it("M — Advisor-closed uses the same Stage-control", () => {
    const { html } = stageFor("obj-capacity", true);
    assert.match(html, /data-testid="nexora-stage-thread-control"/);
    assert.match(html, /data-stage-thread-control="collapse"/);
  });

  it("N — Camera/Safe Viewport unchanged", () => {
    const cameraFit = readFileSync(
      join(HERE, "executiveStageSafeViewportCameraFit.ts"),
      "utf8",
    );
    const controller = readFileSync(
      join(STAGE_DIR, "NexoraExecutiveCameraController.tsx"),
      "utf8",
    );
    assert.match(cameraFit, /NPA-T STAGE-CAMERA:FIX1\/SafeViewportCameraFit/);
    assert.match(controller, /NexoraExecutiveCameraController/);
    assert.doesNotMatch(controller, /OrbitControls/);
  });

  it("O — Object XY/Z not used to place Thread control", () => {
    const host = readFileSync(
      join(STAGE_DIR, "Nexora3DExecutiveStage.tsx"),
      "utf8",
    );
    const breadcrumb = readFileSync(
      join(STAGE_DIR, "NexoraStageInteractionBreadcrumb.tsx"),
      "utf8",
    );
    assert.match(host, /threadControlAction=\{threadControlAction\}/);
    assert.doesNotMatch(host, /threadControlNode\.targetPosition/);
    assert.doesNotMatch(breadcrumb, /targetPosition/);
  });

  it("P — Director / Nexo files not rewritten as Thread UI", () => {
    const host = readFileSync(
      join(STAGE_DIR, "Nexora3DExecutiveStage.tsx"),
      "utf8",
    );
    assert.doesNotMatch(host, /ThreadManagerV2/);
  });

  it("Q — OVS / visual systems not used for Thread chrome", () => {
    const breadcrumb = readFileSync(
      join(STAGE_DIR, "NexoraStageInteractionBreadcrumb.tsx"),
      "utf8",
    );
    assert.doesNotMatch(breadcrumb, /Watch rim|ovs-1|Deep-Z/);
  });

  it("R — No new authority", () => {
    const identity = getExecutiveThreadCollapseControlPlacementIdentity();
    assert.equal(
      identity.id,
      "STAGE-THREAD:FIX1/CollapseThreadControlPlacement",
    );
    assert.equal(EXECUTIVE_THREAD_COLLAPSE_CONTROL_SURFACE.kind, "stage-thread-control");
    const expansion = readFileSync(
      join(HERE, "executiveThreadExpansion.ts"),
      "utf8",
    );
    assert.doesNotMatch(expansion, /ThreadManagerV2/);
    assert.doesNotMatch(expansion, /createsSecondLayoutEngine: true/);
    const host = readFileSync(
      join(STAGE_DIR, "Nexora3DExecutiveStage.tsx"),
      "utf8",
    );
    assert.match(host, /NexoraStageInteractionBreadcrumb/);
    assert.doesNotMatch(host, /NexoraThreadToolbar/);
    const breadcrumb = readFileSync(
      join(STAGE_DIR, "NexoraStageInteractionBreadcrumb.tsx"),
      "utf8",
    );
    assert.match(breadcrumb, /data-testid="nexora-stage-thread-control"/);
    assert.match(
      breadcrumb,
      /threadControlAction && onThreadControl && threadControlLabel \? \(\s*<button/,
    );
  });
});
