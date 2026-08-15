/**
 * NEX-MVP:2 — Nexora Executive Shell composition tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  getNexoraExecutiveShellIdentity,
  nexoraExecutiveShellUpstreamIdentity,
  verifyNexoraExecutiveShell,
} from "../../lib/nex-mvp/nexoraExecutiveShell.ts";
import { getNexoraMVPPrimarySurface } from "../../lib/nex-mvp/nexoraMVPApplicationFoundation.ts";
import { ExecutiveShell } from "../components/ExecutiveShell.tsx";
import { NexoraExecutiveShell } from "./NexoraExecutiveShell.tsx";

const HERE = dirname(fileURLToPath(import.meta.url));

describe("NEX-MVP:2 Nexora Executive Shell", () => {
  it("1. exposes NEX-MVP:2 identity and version", () => {
    const identity = getNexoraExecutiveShellIdentity();
    assert.equal(identity.id, "NEX-MVP:2/NexoraExecutiveShell");
    assert.equal(identity.version, "1.2.0");
    assert.equal(identity.namespace, "nexora.mvp.executive-shell");
    assert.equal(identity.architecturalRole, "MVPExecutiveExperienceShell");
  });

  it("2. depends on NEX-MVP:1 application foundation", () => {
    assert.equal(
      nexoraExecutiveShellUpstreamIdentity,
      "NEX-MVP:1/NexoraMVPApplicationFoundation",
    );
    const shellSource = readFileSync(
      join(HERE, "NexoraExecutiveShell.tsx"),
      "utf8",
    );
    assert.match(
      shellSource,
      /@\/app\/lib\/nex-mvp\/nexoraMVPApplicationFoundation/,
    );
    assert.match(shellSource, /@\/app\/lib\/nex-mvp\/nexoraExecutiveShell/);
  });

  it("3. canonical shell renders at /executive", () => {
    // /executive page is an async server component (searchParams Promise).
    // Composition is verified via ExecutiveShell; page wiring is source-checked.
    const pageSource = readFileSync(join(HERE, "../page.tsx"), "utf8");
    assert.match(pageSource, /data-testid="executive-page"/);
    assert.match(pageSource, /datasetScenario/);
    assert.match(pageSource, /searchParams/);
    assert.match(pageSource, /dataset=baseline|dataset=operational-pressure/);

    const html = renderToStaticMarkup(
      React.createElement(ExecutiveShell, { datasetScenario: "baseline" }),
    );
    assert.match(html, /data-testid="executive-shell"/);
    assert.match(html, /data-testid="executive-cockpit"/);
    assert.match(html, /data-testid="nexora-executive-shell"/);
    assert.match(html, /data-nex-mvp="8"/);
    assert.match(html, /NEX-MVP:8\/NexoraExecutiveFlowIntegration/);
    assert.match(
      html,
      /data-shell-identity="NEX-MVP:2\/NexoraExecutiveShell"/,
    );
  });

  it("4. Context Bar exists", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveShell),
    );
    assert.match(html, /data-testid="executive-context-bar"/);
  });

  it("5. Left Navigation exists", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveShell),
    );
    assert.match(html, /data-testid="executive-left-nav"/);
    assert.match(html, /data-testid="executive-nav-home"/);
    assert.match(html, /data-testid="executive-nav-objects"/);
  });

  it("6. Stage exists and is primary", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveShell),
    );
    assert.match(html, /data-testid="executive-stage-frame"/);
    assert.match(html, /data-testid="executive-stage-column"/);
    assert.equal(getNexoraMVPPrimarySurface(), "stage");
    assert.match(html, /data-active-surface="stage"/);
  });

  it("7. Stage mount exists", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveShell),
    );
    assert.match(html, /data-testid="nexora-stage-mount"/);
    assert.match(html, /data-mvp-surface="stage"/);
  });

  it("8. Workspace Dial mount exists", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveShell),
    );
    assert.match(html, /data-testid="nexora-workspace-dial-mount"/);
    assert.match(html, /data-mvp-mount="workspace-dial"/);
    assert.match(html, /data-testid="nexora-workspace-option-overview"/);
    assert.match(html, /data-testid="nexora-workspace-option-execution"/);
  });

  it("9. Advisor/Insight region exists", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveShell),
    );
    assert.match(html, /data-testid="executive-advisor-panel"/);
    assert.match(html, /data-testid="nexora-advisor-insight-region"/);
    assert.match(html, /data-testid="executive-advisor-tab-assist"/);
    assert.match(html, /data-testid="executive-advisor-tab-insight"/);
  });

  it("10. Timeline exists beneath Stage in stage column", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveShell),
    );
    assert.match(html, /data-testid="executive-stage-column"/);
    assert.match(html, /data-testid="executive-timeline-dock"/);
    const stageColumn = html.match(
      /data-testid="executive-stage-column"[\s\S]*?data-testid="executive-timeline-dock"/,
    );
    assert.ok(stageColumn);
    const stageBeforeTimeline = html.indexOf('data-testid="executive-stage-frame"');
    const timelineAt = html.indexOf('data-testid="executive-timeline-dock"');
    assert.ok(stageBeforeTimeline >= 0 && timelineAt > stageBeforeTimeline);
  });

  it("11. Status Bar exists", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveShell),
    );
    assert.match(html, /data-testid="executive-status-bar"/);
    assert.match(html, /NEX-MVP · 1\.2\.0/);
  });

  it("12. Explorer Drawer host exists", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveShell),
    );
    assert.match(html, /data-testid="executive-explorer-drawer"/);
    assert.match(html, /data-open="false"/);
  });

  it("13. Floating Panel host exists", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveShell),
    );
    assert.match(html, /data-testid="nexora-floating-panel-host"/);
    assert.match(html, /data-open="false"/);
  });

  it("14. shell consumes canonical MVP bootstrap state", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveShell),
    );
    assert.match(html, /data-active-workspace="overview"/);
    assert.match(html, /data-presentation-state="minimum"/);
    assert.match(html, /data-environment-intent="neutral"/);
    assert.match(html, /data-active-surface="stage"/);
  });

  it("15. default workspace and presentation are represented", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutiveShell));
    assert.match(html, /data-active-workspace="overview"/);
    assert.match(html, /data-presentation-state="minimum"/);
    assert.match(html, /data-testid="nexora-3d-executive-stage"/);
    assert.match(html, /data-stage-mode="overview"/);
    assert.match(html, />Overview</);
  });

  it("16. main region composes nav, stage, and advisor", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveShell),
    );
    assert.match(html, /data-testid="nexora-executive-main-region"/);
    assert.match(html, /data-theme-mode="night"/);
  });

  it("17. shell chrome stays free of direct Three.js / R3F imports", () => {
    const shellSource = readFileSync(
      join(HERE, "NexoraExecutiveShell.tsx"),
      "utf8",
    );
    const dialSource = readFileSync(
      join(HERE, "NexoraWorkspaceDialMount.tsx"),
      "utf8",
    );
    for (const source of [shellSource, dialSource]) {
      assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
      assert.doesNotMatch(source, /@react-three\/fiber/);
      assert.doesNotMatch(source, /@react-three\/drei/);
      assert.doesNotMatch(source, /WebGLRenderer/);
    }
    const mountSource = readFileSync(join(HERE, "NexoraStageMount.tsx"), "utf8");
    assert.match(mountSource, /Nexora3DExecutiveStage/);
    assert.equal(verifyNexoraExecutiveShell().noThreeJsStageClaim, true);
  });

  it("18. no prohibited private upstream imports", () => {
    const files = [
      "NexoraExecutiveShell.tsx",
      "NexoraStageMount.tsx",
      "NexoraWorkspaceDialMount.tsx",
      "NexoraAdvisorInsightRegion.tsx",
    ];
    for (const file of files) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/nol(?:\/[^"']*)?["']/,
      );
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/dri(?:\/[^"']*)?["']/,
      );
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/ex-dri(?:\/[^"']*)?["']/,
      );
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/rex(?:\/[^"']*)?["']/,
      );
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/nex-ci\/(?!executiveCockpitIntegrationPublicIndex)[^"']*["']/,
      );
    }
  });

  it("19. preserves /executive/exs1 sandbox pointer to Exs1Cockpit", () => {
    const sandbox = readFileSync(join(HERE, "../exs1/page.tsx"), "utf8");
    assert.match(sandbox, /Exs1Cockpit/);
    assert.match(sandbox, /data-testid="exs1-page"/);
  });
});
