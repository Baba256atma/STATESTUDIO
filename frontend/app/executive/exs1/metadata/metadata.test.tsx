/**
 * Phase A — Executive Metadata & Knowledge Engine coverage.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildExecutiveAdvisorContext } from "../advisor/ExecutiveAdvisorContextBuilder.ts";
import { Exs1Cockpit } from "../components/Exs1Cockpit.tsx";
import { createExecutiveRuntimeStore } from "../runtime/ExecutiveRuntimeStore.ts";
import {
  EXECUTIVE_KNOWLEDGE_GRAPH,
  createInitialMetadataCatalog,
  resolveFieldDisplayName,
  resolveObjectDisplayName,
  searchMetadata,
} from "./index.ts";
import { ExecutiveMetadataExplorer } from "./ExecutiveMetadataExplorer.tsx";
import { ExecutiveMetadataProvider } from "./ExecutiveMetadataProvider.tsx";

describe("Phase A Executive Metadata & Knowledge", () => {
  it("ships object, field, domain, KPI, glossary, and relations registries", () => {
    assert.ok(EXECUTIVE_KNOWLEDGE_GRAPH.objects.length >= 6);
    assert.ok(EXECUTIVE_KNOWLEDGE_GRAPH.fields.some((f) => f.technicalName === "MAT_QTY"));
    assert.ok(EXECUTIVE_KNOWLEDGE_GRAPH.domains.some((d) => d.name === "Supply Chain"));
    assert.ok(
      EXECUTIVE_KNOWLEDGE_GRAPH.kpis.some((k) => k.name === "Inventory Health"),
    );
    assert.ok(
      EXECUTIVE_KNOWLEDGE_GRAPH.glossary.some((g) => g.term === "Lead Time"),
    );
    assert.ok(EXECUTIVE_KNOWLEDGE_GRAPH.relations.length >= 3);
  });

  it("resolves technical fields and object IDs to executive language", () => {
    const catalog = createInitialMetadataCatalog();
    assert.equal(resolveFieldDisplayName(catalog, "MAT_QTY"), "Available Inventory");
    assert.equal(resolveFieldDisplayName(catalog, "Inventory Qty"), "Available Inventory");
    assert.equal(resolveObjectDisplayName(catalog, "inventory"), "Inventory");
    const hits = searchMetadata(catalog, "stock", "Synonyms");
    assert.ok(hits.some((h) => h.title === "Inventory"));
  });

  it("lets Advisor context prefer metadata display names", () => {
    const store = createExecutiveRuntimeStore();
    store.actions.selectObject("inventory");
    store.actions.setNav("Data");
    store.actions.setSelectedSource("source-inventory-sap");
    const catalog = createInitialMetadataCatalog();
    const context = buildExecutiveAdvisorContext(store.getState(), catalog);
    assert.equal(context.selectedObjectLabel, "Inventory");
    assert.equal(context.highlightedFieldDisplayName, "Available Inventory");
  });

  it("renders Knowledge explorer surfaces", () => {
    const html = renderToStaticMarkup(
      <ExecutiveMetadataProvider>
        <ExecutiveMetadataExplorer />
      </ExecutiveMetadataProvider>,
    );
    assert.match(html, /data-testid="executive-metadata-explorer"/);
    assert.match(html, /data-testid="knowledge-section-objects"/);
    assert.match(html, /data-testid="knowledge-section-fields"/);
    assert.match(html, /data-testid="knowledge-object-inventory"/);
    assert.match(html, /data-testid="executive-metadata-inspector"/);
    assert.match(html, /data-testid="executive-metadata-search"/);
  });

  it("keeps cockpit Runtime IDs while exposing Knowledge nav", () => {
    const html = renderToStaticMarkup(<Exs1Cockpit />);
    assert.match(html, /data-testid="executive-nav-knowledge"/);
    assert.match(html, /data-testid="exs1-object-inventory"/);
    assert.match(html, /data-meta-label="Inventory"/);
    assert.match(html, /EXS-7 · Beta/);
  });
});
