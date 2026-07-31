/**
 * EX-2 Tier-0 Synthetic UI — facade, preview, harness verification.
 *
 * Structural, behavioral, accessibility, and boundary coverage.
 * node:test + renderToStaticMarkup (no testing-library, no jsdom).
 * Authorized by EX2-UI-AUTH-T0-2026-07-27-01.
 */

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  ExecutiveJournalSyntheticReadOnlyUiFacade,
  filterExecutiveJournalSyntheticUiRecords,
  mapProjectionToUiRecord,
  selectExecutiveJournalSyntheticUiRecord,
} from "./executiveJournalSyntheticUiFacade.ts";
import type { ExecutiveJournalSyntheticMetadataProjection } from "./executiveJournalSyntheticMetadata.ts";
import {
  ExecutiveJournalSyntheticPreviewUiId,
  ExecutiveJournalSyntheticReadOnlyUiFacadeId,
  ExecutiveJournalSyntheticUiCategoryFilters,
  ExecutiveJournalSyntheticUiConditionalDisplayFields,
  ExecutiveJournalSyntheticUiDisplayFields,
  ExecutiveJournalSyntheticUiLifecycleFilters,
  ExecutiveJournalSyntheticUiMarkerScreenReader,
  ExecutiveJournalSyntheticUiMarkerVisible,
  ExecutiveJournalSyntheticUiProductName,
  ExecutiveJournalSyntheticUiStateCopy,
  ExecutiveJournalSyntheticUiSubtitle,
  ExecutiveJournalSyntheticUiViewStates,
} from "./executiveJournalSyntheticUiTypes.ts";
import { ExecutiveJournalSyntheticPreview } from "./ExecutiveJournalSyntheticPreview.tsx";
import { ExecutiveJournalSyntheticHarness } from "./ExecutiveJournalSyntheticHarness.tsx";
import {
  ExecutiveJournalSyntheticUiCssText,
  ex2t0,
} from "./executiveJournalSyntheticUiStyles.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(HERE, "../..");

const PROHIBITED_COMPONENT_IMPORTS = Object.freeze([
  /fixtures/i,
  /provider/i,
  /adapter/i,
  /architecture/i,
  /\brtc\b/i,
  /decision-journal/i,
  /\bfetch\b/i,
  /localStorage/i,
  /sessionStorage/i,
  /Date\.now/,
  /Math\.random/,
  /dangerouslySetInnerHTML/,
] as const);

const EXCEPTIONAL_HARNESS_STATES = Object.freeze(
  ExecutiveJournalSyntheticUiViewStates.filter((state) => state !== "Ready"),
);

const mutateFrozen = (value: object): boolean => {
  try {
    // @ts-expect-error intentional mutation probe
    value.__mutation_probe__ = true;
    return true;
  } catch {
    return false;
  }
};

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

const countMatches = (html: string, pattern: RegExp): number =>
  (html.match(pattern) ?? []).length;

const assertSafeHarnessHtml = (html: string, stateLabel: string): void => {
  assert.match(html, new RegExp(ExecutiveJournalSyntheticUiMarkerVisible));
  assert.doesNotMatch(
    html,
    /EX2-SYNTH-/,
    `${stateLabel} HTML must not leak adapter rejection codes`,
  );
  assert.doesNotMatch(
    html,
    /\bat\s+\S+\s+\(/,
    `${stateLabel} HTML must not contain stack traces`,
  );
  assert.doesNotMatch(
    html,
    /(?:TypeError|ReferenceError|SyntaxError):/,
    `${stateLabel} HTML must not contain runtime error text`,
  );
};

const minimalValidProjection = (): Record<string, string> => ({
  entry_ref: "syn-entry-test-001",
  entry_category: "Commitment",
  lifecycle_state: "Accepted",
  origin_classification: "HumanOrigin",
  authority_state: "Present",
  integrity_state: "Verified",
  source_classification: "SyntheticSourceOnly",
  journal_ref: "syn-journal-test-001",
});

const collectAppPageFiles = (dir: string): string[] => {
  const entries = readdirSync(dir, { withFileTypes: true });
  const pages: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      pages.push(...collectAppPageFiles(fullPath));
      continue;
    }
    if (entry.name === "page.tsx") {
      pages.push(fullPath);
    }
  }
  return pages;
};

describe("EX-2 Tier-0 Synthetic UI", () => {
  describe("facade identity and loadView", () => {
    it("exposes certified facade identities and safety flags", () => {
      const facade = ExecutiveJournalSyntheticReadOnlyUiFacade;
      assert.equal(facade.facadeId, ExecutiveJournalSyntheticReadOnlyUiFacadeId);
      assert.equal(facade.uiId, ExecutiveJournalSyntheticPreviewUiId);
      assert.equal(facade.productName, ExecutiveJournalSyntheticUiProductName);
      assert.equal(facade.subtitle, ExecutiveJournalSyntheticUiSubtitle);
      assert.equal(facade.status, "CertifiedTier0SyntheticUi");
      assert.equal(
        facade.readiness,
        "ReadyForTier0SyntheticDevelopmentHarnessUse",
      );
      assert.equal(facade.authorizationId, "EX2-UI-AUTH-T0-2026-07-27-01");
      assert.equal(facade.uiCertificationId, "EX2-UI-CERT-T0-2026-07-27-01");
      assert.equal(
        facade.metadataCertificationId,
        "EX2-CERT-T0-2026-07-26-01",
      );
      assert.equal(facade.certificationId, "EX2-UI-CERT-T0-2026-07-27-01");
      assert.equal(facade.rawFixturesExposed, false);
      assert.equal(facade.providerInternalsExposed, false);
      assert.equal(facade.adapterInternalsExposed, false);
      assert.equal(facade.implemented, true);
      assert.equal(facade.immutable, true);
      assert.equal(facade.deterministic, true);
      assert.equal(facade.sideEffectFree, true);
      assert.equal(facade.assertFacadeId(facade.facadeId), facade.facadeId);
      assert.throws(() => facade.assertFacadeId("unknown"));
    });

    it("loadView(Normal) returns Ready with six immutable records", () => {
      const view = ExecutiveJournalSyntheticReadOnlyUiFacade.loadView("Normal");
      assert.equal(view.state, "Ready");
      if (view.state !== "Ready") {
        throw new Error("expected Ready view");
      }
      assert.equal(view.records.length, 6);
      assert.equal(view.markerVisible, ExecutiveJournalSyntheticUiMarkerVisible);
      assert.equal(
        view.markerScreenReader,
        ExecutiveJournalSyntheticUiMarkerScreenReader,
      );
      assert.equal(isDeeplyFrozen(view), true);
      assert.equal(mutateFrozen(view), false);
      for (const record of view.records) {
        assert.equal(typeof record.selectionKey, "string");
        assert.match(record.selectionKey, /^syn-entry-/);
        assert.equal(isDeeplyFrozen(record), true);
        assert.equal(mutateFrozen(record.display), false);
      }
    });

    it("createDemoView covers all nine states with markers", () => {
      for (const state of ExecutiveJournalSyntheticUiViewStates) {
        const view = ExecutiveJournalSyntheticReadOnlyUiFacade.createDemoView(state);
        assert.equal(view.markerVisible, ExecutiveJournalSyntheticUiMarkerVisible);
        if (state === "Ready") {
          assert.equal(view.state, "Ready");
          assert.equal(view.records.length, 6);
        } else if (state === "IntegrityUnavailable") {
          assert.equal(view.state, "IntegrityUnavailable");
          assert.equal(view.message, ExecutiveJournalSyntheticUiStateCopy.IntegrityUnavailable);
        } else {
          assert.equal(view.state, state);
          assert.equal("message" in view, true);
        }
      }
    });

    it("PrivacyRejected demo strips adapter rejection codes", () => {
      const view = ExecutiveJournalSyntheticReadOnlyUiFacade.createDemoView("PrivacyRejected");
      assert.equal(view.state, "PrivacyRejected");
      if (view.state !== "PrivacyRejected") {
        throw new Error("expected PrivacyRejected");
      }
      assert.equal(view.message, ExecutiveJournalSyntheticUiStateCopy.PrivacyRejected);
      const serialized = JSON.stringify(view);
      assert.doesNotMatch(serialized, /EX2-SYNTH-/);
    });

    it("loadView is deterministic across repeated calls", () => {
      const first = ExecutiveJournalSyntheticReadOnlyUiFacade.loadView("Normal");
      const second = ExecutiveJournalSyntheticReadOnlyUiFacade.loadView("Normal");
      assert.deepEqual(
        JSON.parse(JSON.stringify(first)),
        JSON.parse(JSON.stringify(second)),
      );
    });
  });

  describe("mapProjectionToUiRecord and selection", () => {
    it("maps a minimal valid projection and rejects denied fields", () => {
      const valid = minimalValidProjection();
      const mapped = mapProjectionToUiRecord(
        valid as unknown as ExecutiveJournalSyntheticMetadataProjection,
      );
      assert.ok(mapped);
      assert.equal(mapped!.selectionKey, valid.entry_ref);
      assert.equal(mapped!.display.entry_category, "Commitment");
      assert.equal(mapped!.conditional.journal_ref, valid.journal_ref);

      const forged = {
        ...valid,
        journal_body: "forged narrative payload",
      };
      assert.equal(
        mapProjectionToUiRecord(
          forged as unknown as ExecutiveJournalSyntheticMetadataProjection,
        ),
        null,
      );
    });

    it("selectRecord resolves by selectionKey and rejects unknown keys", () => {
      const view = ExecutiveJournalSyntheticReadOnlyUiFacade.loadView("Normal");
      assert.equal(view.state, "Ready");
      if (view.state !== "Ready") {
        throw new Error("expected Ready");
      }
      const firstKey = view.records[0]!.selectionKey;
      assert.equal(
        selectExecutiveJournalSyntheticUiRecord(view.records, firstKey)?.selectionKey,
        firstKey,
      );
      assert.equal(selectExecutiveJournalSyntheticUiRecord(view.records, null), null);
      assert.equal(
        selectExecutiveJournalSyntheticUiRecord(view.records, "syn-entry-missing"),
        null,
      );
    });
  });

  describe("pure filter helpers", () => {
    const loadReadyRecords = () => {
      const readyView = ExecutiveJournalSyntheticReadOnlyUiFacade.loadView("Normal");
      assert.equal(readyView.state, "Ready");
      if (readyView.state !== "Ready") {
        throw new Error("expected Ready");
      }
      return [...readyView.records];
    };

    it("filters by category while preserving order", () => {
      const source = loadReadyRecords();
      const filtered = filterExecutiveJournalSyntheticUiRecords(source, "Risk", "All");
      assert.ok(filtered.length >= 1);
      for (const item of filtered) {
        assert.equal(item.display.entry_category, "Risk");
      }
      const indices = filtered.map((item) =>
        source.findIndex((row) => row.selectionKey === item.selectionKey),
      );
      assert.deepEqual(indices, [...indices].sort((a, b) => a - b));
    });

    it("filters by lifecycle", () => {
      const source = loadReadyRecords();
      const filtered = filterExecutiveJournalSyntheticUiRecords(
        source,
        "All",
        "Proposed",
      );
      assert.ok(filtered.length >= 1);
      for (const item of filtered) {
        assert.equal(item.display.lifecycle_state, "Proposed");
      }
    });

    it("applies combined category and lifecycle filters", () => {
      const source = loadReadyRecords();
      const filtered = filterExecutiveJournalSyntheticUiRecords(
        source,
        "Commitment",
        "Accepted",
      );
      assert.ok(filtered.length >= 1);
      for (const item of filtered) {
        assert.equal(item.display.entry_category, "Commitment");
        assert.equal(item.display.lifecycle_state, "Accepted");
      }
    });

    it("returns empty results without mutating the source array", () => {
      const source = loadReadyRecords();
      const before = source.map((item) => item.selectionKey);
      const filtered = filterExecutiveJournalSyntheticUiRecords(
        source,
        "Control",
        "Proposed",
      );
      assert.equal(filtered.length, 0);
      assert.deepEqual(
        source.map((item) => item.selectionKey),
        before,
      );
      assert.equal(Object.isFrozen(filtered), true);
    });
  });

  describe("ExecutiveJournalSyntheticPreview Ready rendering", () => {
    const readyView = ExecutiveJournalSyntheticReadOnlyUiFacade.loadView("Normal");

    it("renders title, subtitle, marker, and display fields", () => {
      const html = renderToStaticMarkup(
        React.createElement(ExecutiveJournalSyntheticPreview, { view: readyView }),
      );
      assert.ok(html.includes(ExecutiveJournalSyntheticUiProductName));
      assert.ok(html.includes(ExecutiveJournalSyntheticUiSubtitle));
      assert.ok(html.includes(ExecutiveJournalSyntheticUiMarkerVisible));
      assert.match(
        html,
        new RegExp(
          `aria-label="${ExecutiveJournalSyntheticUiMarkerScreenReader.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
        ),
      );
      for (const field of ExecutiveJournalSyntheticUiDisplayFields) {
        assert.match(html, new RegExp(`data-field="${field}"`));
      }
    });

    it("renders conditional refs when present and hides entry_ref from body", () => {
      const html = renderToStaticMarkup(
        React.createElement(ExecutiveJournalSyntheticPreview, { view: readyView }),
      );
      assert.match(html, /data-field="journal_ref"/);
      assert.doesNotMatch(html, /data-field="entry_ref"/);
      assert.doesNotMatch(html, /aria-label="syn-entry-/);
      for (const match of html.matchAll(/aria-label="([^"]+)"/g)) {
        const label = match[1] ?? "";
        assert.doesNotMatch(
          label,
          /^syn-entry-/,
          `accessible name must not lead with entry_ref: ${label}`,
        );
      }
    });

    it("injects canonical CSS with real responsive media queries", () => {
      const html = renderToStaticMarkup(
        React.createElement(ExecutiveJournalSyntheticPreview, { view: readyView }),
      );
      assert.match(html, /data-ex2-t0-canonical-css="true"/);
      assert.match(html, /class="ex2t0-layout"/);
      assert.match(html, /@media \(min-width: 1024px\)/);
      assert.match(
        html,
        /\.ex2t0-layout\s*\{\s*grid-template-columns:\s*minmax\(16rem,\s*0\.95fr\)\s+minmax\(18rem,\s*1\.25fr\)/,
      );
      assert.match(html, /@media \(prefers-reduced-motion: reduce\)/);
      assert.equal(html.includes(ExecutiveJournalSyntheticUiCssText), true);
      assert.doesNotMatch(html, /desktopLayout/);
      assert.doesNotMatch(html, /data-layout=/);
      assert.match(html, new RegExp(ExecutiveJournalSyntheticUiMarkerVisible));
    });

    it("meets Ready accessibility structure with native button list semantics", () => {
      const html = renderToStaticMarkup(
        React.createElement(ExecutiveJournalSyntheticPreview, { view: readyView }),
      );
      assert.equal(countMatches(html, /<h1\b/g), 1);
      assert.equal(countMatches(html, /<main\b/g), 1);
      assert.match(html, /aria-live="polite"/);
      assert.match(html, /aria-label="Synthetic preview filters"/);
      assert.match(html, /<label[^>]+for="[^"]+"[^>]*>Category<\/label>/);
      assert.match(html, /<label[^>]+for="[^"]+"[^>]*>Lifecycle<\/label>/);
      assert.doesNotMatch(html, /role="listbox"/);
      assert.doesNotMatch(html, /role="option"/);
      assert.match(html, /aria-pressed="true"/);
      assert.match(html, /type="button"/);
      assert.match(html, new RegExp(`class="${ex2t0.recordButtonSelected}"`));
    });

    it("uses the certified global and detail marker ownership exactly once each", () => {
      const html = renderToStaticMarkup(
        React.createElement(ExecutiveJournalSyntheticPreview, { view: readyView }),
      );
      assert.equal(
        countMatches(html, /data-testid="ex2-t0-synthetic-marker"/g),
        1,
      );
      assert.equal(
        countMatches(html, /data-testid="ex2-t0-detail-synthetic-marker"/g),
        1,
      );
      assert.equal(
        countMatches(
          html,
          new RegExp(
            ExecutiveJournalSyntheticUiMarkerVisible.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            ),
            "g",
          ),
        ),
        2,
      );
    });

    it("useId wires filter labels under renderToStaticMarkup", () => {
      const html = renderToStaticMarkup(
        React.createElement(ExecutiveJournalSyntheticPreview, { view: readyView }),
      );
      const categoryLabel = html.match(
        /<label[^>]+for="([^"]+)"[^>]*>Category<\/label>/,
      );
      const categorySelect = html.match(
        /id="([^"]+)"[^>]*data-testid="ex2-t0-category-filter"/,
      );
      const lifecycleLabel = html.match(
        /<label[^>]+for="([^"]+)"[^>]*>Lifecycle<\/label>/,
      );
      const lifecycleSelect = html.match(
        /id="([^"]+)"[^>]*data-testid="ex2-t0-lifecycle-filter"/,
      );
      assert.ok(categoryLabel?.[1]);
      assert.ok(categorySelect?.[1]);
      assert.equal(categoryLabel![1], categorySelect![1]);
      assert.ok(lifecycleLabel?.[1]);
      assert.ok(lifecycleSelect?.[1]);
      assert.equal(lifecycleLabel![1], lifecycleSelect![1]);
      assert.notEqual(categoryLabel![1], lifecycleLabel![1]);
    });
  });

  describe("ExecutiveJournalSyntheticHarness states", () => {
    for (const state of ExecutiveJournalSyntheticUiViewStates) {
      it(`renders harness state ${state} with safe copy and marker`, () => {
        const html = renderToStaticMarkup(
          React.createElement(ExecutiveJournalSyntheticHarness, { demoState: state }),
        );
        assert.match(html, new RegExp(`data-demo-state="${state}"`));
        assert.match(html, /data-production="false"/);
        assert.match(html, /data-route="none"/);
        assert.match(
          html,
          /Available only through the gated local development route\. No live journal data\./,
        );
        assert.doesNotMatch(html, /Not mounted by App Router/);
        assert.equal(
          countMatches(html, /data-testid="ex2-t0-synthetic-marker"/g),
          1,
        );
        assert.equal(
          countMatches(
            html,
            /data-testid="ex2-t0-detail-synthetic-marker"/g,
          ),
          state === "Ready" || state === "IntegrityUnavailable" ? 1 : 0,
        );
        assertSafeHarnessHtml(html, state);
        if (state !== "Ready") {
          assert.match(html, new RegExp(ExecutiveJournalSyntheticUiStateCopy[state]));
        }
      });
    }

    it("renders all exceptional harness states without rejection codes", () => {
      for (const state of EXCEPTIONAL_HARNESS_STATES) {
        const html = renderToStaticMarkup(
          React.createElement(ExecutiveJournalSyntheticHarness, { demoState: state }),
        );
        assertSafeHarnessHtml(html, state);
      }
    });
  });

  describe("source boundaries", () => {
    const previewSource = readFileSync(
      join(HERE, "ExecutiveJournalSyntheticPreview.tsx"),
      "utf8",
    );
    const harnessSource = readFileSync(
      join(HERE, "ExecutiveJournalSyntheticHarness.tsx"),
      "utf8",
    );
    const facadeSource = readFileSync(
      join(HERE, "executiveJournalSyntheticUiFacade.ts"),
      "utf8",
    );
    const stylesSource = readFileSync(
      join(HERE, "executiveJournalSyntheticUiStyles.ts"),
      "utf8",
    );

    it("Preview and Harness avoid prohibited imports", () => {
      for (const [label, source] of [
        ["ExecutiveJournalSyntheticPreview.tsx", previewSource],
        ["ExecutiveJournalSyntheticHarness.tsx", harnessSource],
      ] as const) {
        for (const pattern of PROHIBITED_COMPONENT_IMPORTS) {
          assert.equal(
            pattern.test(source),
            false,
            `${label} must not match ${pattern}`,
          );
        }
      }
    });

    it("facade imports metadata package only and does not re-export fixtures", () => {
      assert.match(
        facadeSource,
        /from ["']\.\/executiveJournalSyntheticMetadata\.ts["']/,
      );
      assert.doesNotMatch(
        facadeSource,
        /from ["']\.\/executiveJournalSyntheticMetadataFixtures/,
      );
      assert.doesNotMatch(facadeSource, /export\s*\{[^}]*Fixtures/);
      assert.doesNotMatch(facadeSource, /ExecutiveJournalSyntheticMetadataFixtures/);
    });

    it("canonical style path contains responsive, marker, motion, and wrap rules", () => {
      assert.match(ExecutiveJournalSyntheticUiCssText, /@media \(min-width: 1024px\)/);
      assert.match(ExecutiveJournalSyntheticUiCssText, /\.ex2t0-marker\b/);
      assert.match(
        ExecutiveJournalSyntheticUiCssText,
        /@media \(prefers-reduced-motion: reduce\)/,
      );
      assert.match(ExecutiveJournalSyntheticUiCssText, /overflow-wrap/);
      assert.match(stylesSource, /export const ExecutiveJournalSyntheticUiCssText/);
      assert.match(previewSource, /ExecutiveJournalSyntheticUiCssText/);
      assert.match(previewSource, /ex2t0\.layout/);
      assert.doesNotMatch(previewSource, /desktopLayout/);
      assert.doesNotMatch(previewSource, /role=["']listbox["']/);
      assert.equal(
        existsSync(join(HERE, "ExecutiveJournalSyntheticPreview.module.css")),
        false,
      );
    });

    it("uses accessible theme tokens for selected text and preserves a distinct focus ring", () => {
      assert.match(
        ExecutiveJournalSyntheticUiCssText,
        /--ex2-t0-selected-bg:\s*var\(\s*--nx-nav-tile-active-bg,/,
      );
      assert.match(
        ExecutiveJournalSyntheticUiCssText,
        /--ex2-t0-selected-text:\s*var\(--nx-nav-short-active,\s*#bfdbfe\)/,
      );
      assert.match(
        ExecutiveJournalSyntheticUiCssText,
        /\.ex2t0-record-button-selected \.ex2t0-record-primary,\s*\.ex2t0-record-button-selected \.ex2t0-record-secondary\s*\{\s*color:\s*var\(--ex2-t0-selected-text\)/,
      );
      assert.match(
        ExecutiveJournalSyntheticUiCssText,
        /\.ex2t0-record-button-selected:focus-visible\s*\{\s*outline:\s*3px solid var\(--ex2-t0-focus\)/,
      );
      assert.doesNotMatch(ExecutiveJournalSyntheticUiCssText, /background:\s*#243b55/);
    });

    it("keeps the centered mobile layout bounded without horizontal overflow", () => {
      assert.match(
        ExecutiveJournalSyntheticUiCssText,
        /max-width:\s*72rem;\s*margin:\s*0 auto;/,
      );
      assert.match(ExecutiveJournalSyntheticUiCssText, /overflow-x:\s*hidden/);
      assert.match(
        ExecutiveJournalSyntheticUiCssText,
        /\.ex2t0-layout\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*1fr;/,
      );
    });

    it("DOM evidence excludes denied privacy and authority controls", () => {
      const html = renderToStaticMarkup(
        React.createElement(ExecutiveJournalSyntheticHarness, { demoState: "Ready" }),
      );
      assert.doesNotMatch(html, /<a\s/i);
      assert.doesNotMatch(html, /\bhref=/i);
      assert.doesNotMatch(
        html,
        /\b(?:copy|export|download|retry|edit|confirm|dispute)\b/i,
      );
      assert.doesNotMatch(html, /localStorage|sessionStorage|indexedDB|fetch\(/i);
      assert.doesNotMatch(html, /data-field="entry_ref"/);
      assert.doesNotMatch(html, /record total|result count|pagination/i);
      assert.match(html, /AI-proposed — non-authoritative/);
    });

    it("allows only the authorized canonical App Router harness page", () => {
      const pages = collectAppPageFiles(APP_ROOT);
      const harnessPages: string[] = [];
      for (const pagePath of pages) {
        const source = readFileSync(pagePath, "utf8");
        assert.doesNotMatch(source, /ExecutiveJournalSyntheticPreview/);
        assert.doesNotMatch(source, /ExecutiveJournalSyntheticPreviewUI/);
        assert.doesNotMatch(source, /executiveJournalSyntheticUiFacade/);
        if (/ExecutiveJournalSyntheticHarness/.test(source)) {
          harnessPages.push(pagePath);
          assert.match(
            pagePath,
            /app\/executive\/journal-preview\/page\.tsx$/,
          );
          assert.match(source, /\bnotFound\(\)/);
          assert.doesNotMatch(source, /ex2-tier0-route-marker/);
          assert.doesNotMatch(source, /Synthetic \/ Tier 0 \/ Non-production/);
          assert.match(
            harnessSource,
            /Available only through the gated local\s+development route\. No live journal data\./,
          );
          assert.doesNotMatch(source, /^["']use client["'];/m);
          assert.doesNotMatch(source, /NEXT_PUBLIC_/);
        }
      }
      assert.equal(harnessPages.length, 1);
    });
  });

  describe("conditional display field coverage", () => {
    it("Ready detail exposes at least one conditional ref from fixtures", () => {
      const view = ExecutiveJournalSyntheticReadOnlyUiFacade.loadView("Normal");
      assert.equal(view.state, "Ready");
      if (view.state !== "Ready") {
        throw new Error("expected Ready");
      }
      const html = renderToStaticMarkup(
        React.createElement(ExecutiveJournalSyntheticPreview, { view }),
      );
      const renderedConditional = ExecutiveJournalSyntheticUiConditionalDisplayFields.filter(
        (field) => html.includes(`data-field="${field}"`),
      );
      assert.ok(renderedConditional.length >= 1);
    });
  });

  describe("filter vocabulary smoke", () => {
    it("uses closed category and lifecycle filter vocabularies", () => {
      assert.ok(ExecutiveJournalSyntheticUiCategoryFilters.includes("All"));
      assert.ok(ExecutiveJournalSyntheticUiLifecycleFilters.includes("All"));
      assert.equal(Object.isFrozen(ExecutiveJournalSyntheticUiCategoryFilters), true);
      assert.equal(Object.isFrozen(ExecutiveJournalSyntheticUiLifecycleFilters), true);
    });
  });

  describe("nine-state catalogue completeness", () => {
    it("ties harness coverage to the canonical nine-state catalogue", () => {
      assert.deepEqual([...ExecutiveJournalSyntheticUiViewStates], [
        "Loading",
        "Ready",
        "Empty",
        "NotFound",
        "PrivacyRejected",
        "UnsupportedVersion",
        "IntegrityUnavailable",
        "ProviderUnavailable",
        "Failure",
      ]);
      assert.equal(ExecutiveJournalSyntheticUiViewStates.length, 9);
      for (const state of ExecutiveJournalSyntheticUiViewStates) {
        const view = ExecutiveJournalSyntheticReadOnlyUiFacade.createDemoView(state);
        assert.equal(view.state, state);
        assert.equal(view.markerVisible, ExecutiveJournalSyntheticUiMarkerVisible);
      }
    });
  });

  describe("side-effect and dependency source inspection", () => {
    it("UI sources omit network, storage, entropy, and RTC/APP-8 imports", () => {
      const files = [
        "executiveJournalSyntheticUiTypes.ts",
        "executiveJournalSyntheticUiFacade.ts",
        "executiveJournalSyntheticUiStyles.ts",
        "ExecutiveJournalSyntheticPreview.tsx",
        "ExecutiveJournalSyntheticHarness.tsx",
      ];
      for (const name of files) {
        const source = readFileSync(join(HERE, name), "utf8");
        assert.doesNotMatch(source, /\bfetch\s*\(/);
        assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/i);
        assert.doesNotMatch(source, /Date\.now\s*\(|new\s+Date\s*\(|Math\.random\s*\(/);
        assert.doesNotMatch(source, /dangerouslySetInnerHTML/);
        assert.doesNotMatch(source, /from\s+["'][^"']*\/rtc\//);
        assert.doesNotMatch(source, /from\s+["'][^"']*decision-journal/);
        assert.doesNotMatch(source, /executiveJournalProductArchitecture/);
      }
      const preview = readFileSync(
        join(HERE, "ExecutiveJournalSyntheticPreview.tsx"),
        "utf8",
      );
      assert.doesNotMatch(preview, /Fixtures|MetadataProvider|MetadataAdapter/);
      assert.match(preview, /executiveJournalSyntheticUiFacade/);
    });
  });
});
