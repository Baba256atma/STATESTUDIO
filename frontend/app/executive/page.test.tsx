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
    assert.match(html, /EXS-7 · Beta/);
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

describe("Sprint 4 Executive Runtime Integration", () => {
  it("ships Executive Runtime store and hooks", () => {
    const store = readFileSync(
      join(HERE, "exs1/runtime/ExecutiveRuntimeStore.ts"),
      "utf8",
    );
    assert.match(store, /createExecutiveRuntimeStore/);
    assert.match(store, /ModeChanged/);
    assert.match(store, /PackSelected/);
    assert.match(store, /DecisionApproved/);
    assert.match(store, /ExecutionStarted/);
    assert.match(store, /SnapshotCreated/);
    const hooks = readFileSync(
      join(HERE, "exs1/runtime/hooks/useExecutiveRuntime.ts"),
      "utf8",
    );
    assert.match(hooks, /useRuntimeMode/);
    assert.match(hooks, /useRuntimeData/);
    assert.match(hooks, /useRuntimeDecision/);
  });

  it("renders cockpit as a Runtime consumer without UI regression", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutivePage));
    assert.match(html, /data-testid="exs1-cockpit"/);
    assert.match(html, /EXS-7 · Beta/);
    assert.match(html, /data-testid="executive-pack-production-delay"/);
    assert.match(html, /data-data-active="false"/);
    assert.match(html, /data-monitoring-active="false"/);
  });
});

describe("Sprint 5 Executive Advisor AI Integration", () => {
  it("ships Advisor engine, context builder, and prompt templates", () => {
    const engine = readFileSync(
      join(HERE, "exs1/advisor/ExecutiveAdvisorEngine.ts"),
      "utf8",
    );
    assert.match(engine, /runExecutiveAdvisorEngine/);
    const builder = readFileSync(
      join(HERE, "exs1/advisor/ExecutiveAdvisorContextBuilder.ts"),
      "utf8",
    );
    assert.match(builder, /buildExecutiveAdvisorContext/);
    const templates = readFileSync(
      join(HERE, "exs1/advisor/ExecutiveAdvisorPromptTemplates.ts"),
      "utf8",
    );
    assert.match(templates, /decision-review/);
    assert.match(templates, /monitoring-review/);
  });

  it("renders Runtime-aware Advisor Assist surface on /executive", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutivePage));
    assert.match(html, /data-testid="executive-advisor-panel"/);
    assert.match(html, /data-testid="executive-advisor-context-button"/);
    assert.match(html, /data-testid="executive-action-inbox-button"/);
    assert.match(html, /Approvals/);
    assert.match(html, /EXS-7 · Beta/);
  });
});

describe("Phase A Executive Metadata & Knowledge", () => {
  it("ships metadata registries and knowledge graph", () => {
    const registry = readFileSync(
      join(HERE, "exs1/metadata/ExecutiveMetadataRegistry.ts"),
      "utf8",
    );
    assert.match(registry, /resolveFieldDisplayName/);
    assert.match(registry, /searchMetadata/);
    const graph = readFileSync(
      join(HERE, "exs1/metadata/ExecutiveKnowledgeGraph.ts"),
      "utf8",
    );
    assert.match(graph, /EXECUTIVE_KNOWLEDGE_GRAPH/);
    assert.match(graph, /MAT_QTY|Available Inventory|supplies/);
  });

  it("exposes Knowledge nav without breaking cockpit anchors", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutivePage));
    assert.match(html, /data-testid="executive-nav-knowledge"/);
    assert.match(html, /data-testid="exs1-cockpit"/);
    assert.match(html, /data-testid="executive-advisor-panel"/);
    assert.match(html, /EXS-7 · Beta/);
  });
});

describe("Phase B Executive Runtime Intelligence", () => {
  it("ships Runtime Intelligence engines and signal types", () => {
    const engine = readFileSync(
      join(HERE, "exs1/intelligence/ExecutiveRuntimeIntelligence.ts"),
      "utf8",
    );
    assert.match(engine, /processRuntimeEventForIntelligence/);
    assert.match(engine, /recommendationFromSignals/);
    const signals = readFileSync(
      join(HERE, "exs1/intelligence/ExecutiveSignalTypes.ts"),
      "utf8",
    );
    assert.match(signals, /Decision Required/);
    assert.match(signals, /ExecutiveRecommendationContext/);
  });

  it("exposes Intelligence nav without breaking Runtime anchors", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutivePage));
    assert.match(html, /data-testid="executive-nav-intelligence"/);
    assert.match(html, /data-testid="exs1-object-inventory"/);
    assert.match(html, /data-testid="executive-advisor-panel"/);
    assert.match(html, /EXS-7 · Beta/);
  });
});

describe("Phase C Enterprise Connectors", () => {
  it("ships CSV connector platform and publish wizard", () => {
    const platform = readFileSync(
      join(HERE, "exs1/connectors/ExecutiveConnectorPlatform.ts"),
      "utf8",
    );
    assert.match(platform, /createConnectorPlatform/);
    assert.match(platform, /publish/);
    const csv = readFileSync(
      join(HERE, "exs1/connectors/connectors/CsvConnector.ts"),
      "utf8",
    );
    assert.match(csv, /createCsvConnector/);
    assert.match(csv, /SAMPLE_INVENTORY_CSV/);
  });

  it("keeps cockpit Runtime anchors with Beta version", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutivePage));
    assert.match(html, /data-testid="exs1-cockpit"/);
    assert.match(html, /data-testid="executive-advisor-panel"/);
    assert.match(html, /EXS-7 · Beta/);
  });
});

describe("Phase D Executive Scenario Simulation", () => {
  it("ships simulation engine and Inventory Shortage vertical slice", () => {
    const engine = readFileSync(
      join(HERE, "exs1/simulation/ExecutiveScenarioSimulationEngine.ts"),
      "utf8",
    );
    assert.match(engine, /runScenarioSimulation/);
    assert.match(engine, /captureBaselineSnapshot/);
    const config = readFileSync(
      join(HERE, "exs1/simulation/ExecutiveSimulationConfig.ts"),
      "utf8",
    );
    assert.match(config, /increase-safety-stock/);
    assert.match(config, /INVENTORY_SHORTAGE_BASELINE/);
  });

  it("exposes Simulations nav without breaking Runtime anchors", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutivePage));
    assert.match(html, /data-testid="executive-nav-simulations"/);
    assert.match(html, /data-testid="exs1-object-inventory"/);
    assert.match(html, /EXS-7 · Beta/);
  });
});

describe("Phase E Beta Preparation & Hardening", () => {
  it("ships beta validator, flags, and documentation", () => {
    const validator = readFileSync(
      join(HERE, "exs1/beta/ExecutiveBetaValidator.ts"),
      "utf8",
    );
    assert.match(validator, /runExecutiveBetaValidator/);
    const flags = readFileSync(
      join(HERE, "exs1/beta/ExecutiveFeatureFlags.ts"),
      "utf8",
    );
    assert.match(flags, /EnableSimulation/);
    assert.match(flags, /EnableConnectors/);
    const guide = readFileSync(
      join(HERE, "exs1/beta/docs/ExecutiveQuickStart.md"),
      "utf8",
    );
    assert.match(guide, /Connect CSV/);
  });

  it("exposes Settings and Beta version without breaking Runtime anchors", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutivePage));
    assert.match(html, /data-testid="executive-nav-settings"/);
    assert.match(html, /data-testid="exs1-object-inventory"/);
    assert.match(html, /EXS-7 · Beta/);
  });
});
