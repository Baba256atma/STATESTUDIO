/**
 * Phase C — Enterprise Connector Platform coverage.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Exs1Cockpit } from "../components/Exs1Cockpit.tsx";
import { createInitialMetadataCatalog } from "../metadata/index.ts";
import { createExecutiveRuntimeStore } from "../runtime/ExecutiveRuntimeStore.ts";
import { processRuntimeEventForIntelligence } from "../intelligence/index.ts";
import {
  SAMPLE_INVENTORY_CSV,
  createConnectorPlatform,
  createCsvConnector,
  parseCsvText,
  validateDiscoveredSchema,
} from "./index.ts";
import { ExecutiveConnectorExplorer } from "./ExecutiveConnectorExplorer.tsx";
import { ExecutiveConnectorProvider } from "./ExecutiveConnectorProvider.tsx";
import { ExecutiveMetadataProvider } from "../metadata/ExecutiveMetadataProvider.tsx";
import { ExecutiveRuntimeProvider } from "../runtime/ExecutiveRuntimeProvider.tsx";
import { ExecutiveDataProvider } from "../data/ExecutiveDataProvider.tsx";

describe("Phase C Enterprise Connectors", () => {
  it("parses CSV and discovers schema for the reference connector", async () => {
    const parsed = parseCsvText(SAMPLE_INVENTORY_CSV);
    assert.ok(parsed.headers.includes("MAT_QTY"));
    assert.ok(parsed.rows.length >= 10);

    const csv = createCsvConnector();
    await csv.connect({ label: "inventory.csv", payload: SAMPLE_INVENTORY_CSV });
    const preview = await csv.preview();
    assert.equal(preview.schema.sourceLabel, "inventory.csv");
    assert.ok(preview.schema.columns.some((c) => c.name === "MAT_QTY"));
    assert.ok(preview.stats.rowCount >= 10);
    const validation = validateDiscoveredSchema(preview.schema, {
      requireFormat: "csv",
    });
    assert.equal(validation.ok, true);
  });

  it("completes CSV → map → approve → Runtime publish → Intelligence signal", async () => {
    const store = createExecutiveRuntimeStore({ initialMode: "Problem" });
    const catalog = createInitialMetadataCatalog();
    const platform = createConnectorPlatform();

    platform.startSession("connector-csv");
    await platform.connect({
      label: "inventory.csv",
      payload: SAMPLE_INVENTORY_CSV,
    });
    await platform.discoverAndPreview();
    platform.applySuggestedMappings(catalog);
    const mapped = platform
      .getSession()!
      .mappings.filter((m) => m.status === "Suggested" || m.status === "Mapped");
    assert.ok(mapped.some((m) => m.columnName === "MAT_QTY"));
    platform.approve("Executive Manager");
    const { session, journal } = await platform.publish(store);
    assert.equal(session.lifecycle, "Published");
    assert.match(journal.summary, /\[Connector\]/);
    assert.ok(
      store.getState().data.sources.some((s) => s.name === "inventory.csv"),
    );
    const event = store.getState().events.find(
      (e) =>
        e.type === "DataUpdated" &&
        Boolean((e.payload as { published?: boolean } | undefined)?.published),
    );
    assert.ok(event);
    const intel = processRuntimeEventForIntelligence({
      event: event!,
      previous: null,
      current: store.getState(),
      catalog,
      existing: [],
    });
    assert.ok(intel.created);
    assert.match(intel.created!.summary, /Updated|Observation|Warning|Information/i);
  });

  it("keeps non-CSV connectors as shells", async () => {
    const platform = createConnectorPlatform();
    const excel = platform.manager.getConnector("connector-excel");
    assert.ok(excel?.descriptor.shell);
    const health = await excel!.health();
    assert.equal(health.state, "Disconnected");
    const validation = await excel!.validate();
    assert.equal(validation.ok, false);
  });

  it("renders Enterprise Connectors explorer", () => {
    const html = renderToStaticMarkup(
      <ExecutiveRuntimeProvider showInspector={false}>
        <ExecutiveDataProvider>
          <ExecutiveMetadataProvider>
            <ExecutiveConnectorProvider>
              <ExecutiveConnectorExplorer onOpenPublish={() => {}} />
            </ExecutiveConnectorProvider>
          </ExecutiveMetadataProvider>
        </ExecutiveDataProvider>
      </ExecutiveRuntimeProvider>,
    );
    assert.match(html, /data-testid="executive-connector-explorer"/);
    assert.match(html, /Enterprise Connectors/);
    assert.match(html, /data-testid="executive-connector-card-connector-csv"/);
    assert.match(html, /data-testid="connector-search"/);
  });

  it("exposes connectors in cockpit without breaking Runtime IDs", () => {
    const html = renderToStaticMarkup(<Exs1Cockpit />);
    assert.match(html, /data-testid="exs1-object-inventory"/);
    assert.match(html, /data-meta-label="Inventory"/);
    assert.match(html, /EXS-7 · Beta/);
  });
});
