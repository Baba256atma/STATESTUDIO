/**
 * Sprint 1 + Sprint 2 — Executive Cockpit Integration & Visual Polish.
 *
 * /executive composes the real EXS-1 → EXS-7 cockpit with Sprint 2 tokens.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ExecutiveCockpit } from "./components/ExecutiveCockpit.tsx";
import { ExecutiveShell } from "./components/ExecutiveShell.tsx";
import ExecutivePage from "./page.tsx";

const HERE = dirname(fileURLToPath(import.meta.url));

describe("Sprint 1 Executive Cockpit Integration", () => {
  it("composes Exs1Cockpit without redirecting to /executive/exs1", () => {
    const pageSource = readFileSync(join(HERE, "page.tsx"), "utf8");
    const cockpitSource = readFileSync(
      join(HERE, "components/ExecutiveCockpit.tsx"),
      "utf8",
    );
    assert.doesNotMatch(pageSource, /\bredirect\s*\(/i);
    assert.doesNotMatch(pageSource, /from ["']next\/navigation["']/);
    assert.doesNotMatch(pageSource, /href=["']\/executive\/exs1["']/);
    assert.match(
      cockpitSource,
      /from ["']\.\.\/exs1\/components\/Exs1Cockpit["']/,
    );
    assert.match(cockpitSource, /Exs1Cockpit/);
  });

  it("renders /executive as the real Executive Cockpit", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutivePage));
    assert.match(html, /data-testid="executive-page"/);
    assert.match(html, /data-testid="executive-shell"/);
    assert.match(html, /data-testid="executive-cockpit"/);
    assert.match(html, /data-testid="exs1-cockpit"/);
    assert.match(html, /data-testid="executive-cockpit-shell"/);
    assert.match(html, /data-testid="executive-context-bar"/);
    assert.match(html, /data-testid="executive-left-nav"/);
    assert.match(html, /data-testid="executive-advisor-panel"/);
    assert.match(html, /data-testid="executive-timeline-dock"/);
    assert.match(html, /data-testid="executive-status-bar"/);
    assert.match(html, /data-testid="executive-mode-selector"/);
    assert.match(html, /data-testid="exs1-stage"/);
    assert.match(html, /Production Delay/);
    assert.match(html, /EXS-7/);
  });

  it("removes all placeholder UI from the production shell", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutiveShell));
    assert.doesNotMatch(html, /Placeholder/);
    assert.doesNotMatch(html, /Coming Soon/);
    assert.doesNotMatch(html, /Mock Landing/);
    assert.doesNotMatch(html, /Journal Placeholder/);
    assert.doesNotMatch(html, /Timeline Placeholder/);
    assert.doesNotMatch(html, /data-testid="journal-placeholder"/);
    assert.doesNotMatch(html, /data-testid="timeline-placeholder"/);
    assert.doesNotMatch(html, /data-testid="executive-stage-host"/);
    assert.match(html, /data-testid="executive-cockpit-shell"/);
  });

  it("keeps /executive/exs1 as a sandbox composition of the same cockpit", () => {
    const sandbox = readFileSync(join(HERE, "exs1/page.tsx"), "utf8");
    assert.match(sandbox, /Exs1Cockpit/);
    assert.match(sandbox, /data-testid="exs1-page"/);
    const html = renderToStaticMarkup(React.createElement(ExecutiveCockpit));
    assert.match(html, /data-testid="exs1-cockpit"/);
    assert.match(html, /data-testid="executive-mode-selector"/);
  });
});

describe("Sprint 2 Executive Visual Polish", () => {
  it("ships Sprint 2 visual tokens and style guide", () => {
    const theme = readFileSync(
      join(HERE, "exs1/shell/executiveCockpitTheme.ts"),
      "utf8",
    );
    assert.match(theme, /export const motion/);
    assert.match(theme, /export const typeScale/);
    assert.match(theme, /export const elevation/);
    assert.match(theme, /export const directorLanguage/);
    assert.match(theme, /export const radius/);
    const guide = readFileSync(
      join(HERE, "exs1/shell/EXECUTIVE_VISUAL_STYLE_GUIDE.md"),
      "utf8",
    );
    assert.match(guide, /Motion Guidelines/);
    assert.match(guide, /Director Language/);
  });

  it("renders polished mode selector and case-file packs", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutivePage));
    assert.match(html, /Executive Mode/);
    assert.match(html, /data-testid="executive-mode-trigger"/);
    assert.match(html, /Case/);
    assert.match(html, /Director/);
    assert.match(html, /EXS-7 · S3/);
  });
});

describe("Sprint 3 Executive Data Experience", () => {
  it("ships mock data sources and mapping helpers", () => {
    const config = readFileSync(
      join(HERE, "exs1/data/ExecutiveDataConfig.ts"),
      "utf8",
    );
    assert.match(config, /INITIAL_DATA_SOURCES/);
    assert.match(config, /sales\.csv/);
    assert.match(config, /INITIAL_DATA_MAPPINGS/);
    assert.match(config, /createDataSource/);
    assert.match(config, /toDataJournalEntry/);
  });

  it("keeps Data inactive until Left Nav opens Data", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutivePage));
    assert.match(html, /data-data-active="false"/);
    assert.doesNotMatch(html, /data-testid="executive-data-explorer"/);
    assert.match(html, /data-testid="executive-cockpit-shell"/);
  });
});
