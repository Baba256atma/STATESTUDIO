/**
 * NEX-MVP:5 — Workspace Dial component / composition tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraWorkspaceDial } from "./NexoraWorkspaceDial.tsx";
import { NexoraWorkspaceDialMount } from "../NexoraWorkspaceDialMount.tsx";
import { NexoraExecutiveShell } from "../NexoraExecutiveShell.tsx";
import {
  applyNexoraMVPWorkspaceChangeToInteraction,
  deriveNexoraMVPSceneEnvironmentVisualState,
} from "../../../lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  selectNexoraMVPInteractionSubject,
} from "../../../lib/nex-mvp/nexoraMVPObjectInteraction.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

describe("NEX-MVP:5 Workspace Dial component", () => {
  it("1. Dial renders", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraWorkspaceDial, {
        activeWorkspace: "overview",
        onWorkspaceChange: () => undefined,
      }),
    );
    assert.match(html, /data-testid="nexora-workspace-dial"/);
    assert.match(html, /data-testid="nexora-workspace-dial-face"/);
  });

  it("2. active workspace is indicated", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraWorkspaceDial, {
        activeWorkspace: "scenario",
        onWorkspaceChange: () => undefined,
      }),
    );
    assert.match(html, /data-active-workspace="scenario"/);
    assert.match(html, /data-testid="nexora-workspace-dial-active-label"/);
    assert.match(html, /Scenario/);
    assert.match(
      html,
      /aria-selected="true"[^>]*data-testid="nexora-workspace-option-scenario"|data-testid="nexora-workspace-option-scenario"[^>]*aria-selected="true"/,
    );
  });

  it("3. Dial initializes from canonical snapshot (via mount)", () => {
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /data-testid="nexora-workspace-dial-mount"/);
    assert.match(html, /data-active-workspace="overview"/);
    assert.match(html, /data-nex-mvp="5"/);
  });

  it("4. choosing Problem updates workspace intent (pure path)", () => {
    const next = applyNexoraMVPWorkspaceChangeToInteraction(
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
      "problem",
    );
    assert.equal(next.workspace, "problem");
    assert.equal(next.environmentIntent, "investigate");
  });

  it("5. choosing Scenario updates workspace intent (pure path)", () => {
    const next = applyNexoraMVPWorkspaceChangeToInteraction(
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
      "scenario",
    );
    assert.equal(next.workspace, "scenario");
    assert.equal(next.environmentIntent, "simulate");
  });

  it("6. previous/next controls exist", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraWorkspaceDial, {
        activeWorkspace: "scenario",
        onWorkspaceChange: () => undefined,
      }),
    );
    assert.match(html, /data-testid="nexora-workspace-dial-previous"/);
    assert.match(html, /data-testid="nexora-workspace-dial-next"/);
  });

  it("7. keyboard interaction surface is wired", () => {
    const source = readFileSync(join(HERE, "NexoraWorkspaceDial.tsx"), "utf8");
    assert.match(source, /ArrowLeft/);
    assert.match(source, /ArrowRight/);
    assert.match(source, /Home/);
    assert.match(source, /End/);
    assert.match(source, /onKeyDown/);
  });

  it("8. Dial respects boundaries", () => {
    const start = renderToStaticMarkup(
      React.createElement(NexoraWorkspaceDial, {
        activeWorkspace: "overview",
        onWorkspaceChange: () => undefined,
      }),
    );
    assert.match(start, /data-edge-policy="stop-at-ends"/);
    assert.match(
      start,
      /data-testid="nexora-workspace-dial-previous"[^>]*disabled/,
    );

    const end = renderToStaticMarkup(
      React.createElement(NexoraWorkspaceDial, {
        activeWorkspace: "execution",
        onWorkspaceChange: () => undefined,
      }),
    );
    assert.match(end, /data-testid="nexora-workspace-dial-next"[^>]*disabled/);
  });

  it("9. Stage receives new environment intent", () => {
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /data-environment-intent="neutral"/);
    assert.match(html, /data-environment-treatment="balanced"/);
    const visual = deriveNexoraMVPSceneEnvironmentVisualState("simulate");
    assert.equal(visual.intent, "simulate");
  });

  it("10. focused object remains focused when valid", () => {
    let state = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    });
    state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
    state = applyNexoraMVPWorkspaceChangeToInteraction(state, "decision");
    assert.equal(state.focusedSubject?.id, "obj-capacity");
  });

  it("11. presentation state remains unchanged", () => {
    const state = applyNexoraMVPWorkspaceChangeToInteraction(
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "operation",
        environmentIntent: "neutral",
      }),
      "execution",
    );
    assert.equal(state.presentationState, "operation");
  });

  it("12. Advisor context bridge receives workspace update", () => {
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /data-testid="nexora-advisor-bridge-summary"/);
    assert.match(html, /overview · minimum · neutral/);
  });

  it("13. no route navigation is required", () => {
    const dial = readFileSync(join(HERE, "NexoraWorkspaceDial.tsx"), "utf8");
    const mount = readFileSync(
      join(HERE, "../NexoraWorkspaceDialMount.tsx"),
      "utf8",
    );
    const shell = readFileSync(
      join(HERE, "../NexoraExecutiveShell.tsx"),
      "utf8",
    );
    for (const source of [dial, mount, shell]) {
      assert.doesNotMatch(source, /router\.push|useRouter|\/executive\/problem/);
    }
  });

  it("14. no private upstream runtime imports were introduced", () => {
    const files = [
      "NexoraWorkspaceDial.tsx",
      "NexoraSceneEnvironmentController.tsx",
      join("..", "NexoraWorkspaceDialMount.tsx"),
      join("../../../lib/nex-mvp/nexoraMVPWorkspacePresentation.ts"),
    ];
    for (const file of files) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/(?:nol|dri|ex-dri|rex)(?:\/[^"']*)?["']/,
      );
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/nex-mvp\/nexoraMVPUpstreamIntegration["']/,
      );
    }
  });

  it("mount hosts dial in Stage control zone", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraWorkspaceDialMount, {
        activeWorkspace: "problem",
        onWorkspaceChange: () => undefined,
      }),
    );
    assert.match(html, /data-testid="nexora-workspace-dial-mount"/);
    assert.match(html, /data-testid="nexora-workspace-dial"/);
    assert.match(html, /position:\s*absolute/);
    assert.match(html, /bottom:\s*0\.85rem/);
    assert.match(html, /right:\s*0\.85rem/);
  });
});
