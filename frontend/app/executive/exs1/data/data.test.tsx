/**
 * Sprint 3 — Executive Data Experience coverage.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  INITIAL_DATA_MAPPINGS,
  INITIAL_DATA_SOURCES,
  createDataSource,
  filterSources,
  toDataJournalEntry,
  toDataTimelinePack,
} from "./ExecutiveDataConfig.ts";
import { ExecutiveDataExplorer, ExecutiveDataProvider } from "./index.ts";
import { ExecutiveModeProvider } from "../mode/ExecutiveModeProvider.tsx";

describe("Sprint 3 Executive Data Experience", () => {
  it("ships mock sources with required source-card fields", () => {
    assert.ok(INITIAL_DATA_SOURCES.length >= 4);
    const sales = INITIAL_DATA_SOURCES.find((s) => s.name === "sales.csv");
    assert.ok(sales);
    assert.equal(sales?.type, "CSV");
    assert.equal(sales?.status, "Connected");
    assert.ok(sales?.rows.includes("248"));
    assert.ok(sales?.objectsConnected.includes("Revenue"));
    assert.ok(INITIAL_DATA_MAPPINGS.some((m) => m.status === "Create Object"));
  });

  it("creates Data Pack and Journal helpers on add source", () => {
    const source = createDataSource({ name: "demo.csv", category: "CSV" });
    const pack = toDataTimelinePack(source);
    const journal = toDataJournalEntry(source, 2);
    assert.match(pack.title, /Data/);
    assert.equal(journal.sourceName, "demo.csv");
    assert.match(journal.summary, /Data/);
  });

  it("filters sources without mutating the catalog", () => {
    const connected = filterSources(INITIAL_DATA_SOURCES, "Connected", "");
    assert.ok(connected.every((s) => s.status === "Connected"));
    const csv = filterSources(INITIAL_DATA_SOURCES, "CSV", "sales");
    assert.ok(csv.some((s) => s.name === "sales.csv"));
    assert.equal(INITIAL_DATA_SOURCES.length >= 4, true);
  });

  it("renders Data Explorer catalog surfaces", () => {
    const html = renderToStaticMarkup(
      <ExecutiveModeProvider initialMode="Problem">
        <ExecutiveDataProvider>
          <ExecutiveDataExplorer onAddSource={() => {}} />
        </ExecutiveDataProvider>
      </ExecutiveModeProvider>,
    );
    assert.match(html, /data-testid="executive-data-explorer"/);
    assert.match(html, /Executive Data Catalog/);
    assert.match(html, /data-testid="data-add-source"/);
    assert.match(html, /data-testid="executive-data-catalog"/);
    assert.match(html, /data-testid="executive-source-card-source-sales-csv"/);
    assert.match(html, /data-testid="data-section-sources"/);
    assert.match(html, /data-testid="data-section-mappings"/);
    assert.match(html, /data-testid="executive-data-search"/);
    assert.match(html, /data-testid="executive-data-filter-bar"/);
  });
});
