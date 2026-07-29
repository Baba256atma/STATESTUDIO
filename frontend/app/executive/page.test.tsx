/**
 * EX-BOOTSTRAP-1 — Executive Experience Route Bootstrap Tests.
 *
 * Structural and render coverage for /executive.
 * No mocks. No network. No business logic.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { executiveStagePublicIndex } from "../lib/ex/executiveStagePublicIndex.ts";
import { ExecutiveShell } from "./components/ExecutiveShell.tsx";
import { ExecutiveStageHost } from "./components/ExecutiveStageHost.tsx";
import ExecutivePage from "./page.tsx";

const HERE = dirname(fileURLToPath(import.meta.url));

const BOOTSTRAP_FILES = Object.freeze([
  "page.tsx",
  "page.test.tsx",
] as const);

const COMPONENT_FILES = Object.freeze([
  "ExecutiveShell.tsx",
  "ExecutiveStageHost.tsx",
] as const);

const PROHIBITED_LIB_IMPORTS = Object.freeze([
  /from ["']@\/app\/lib\/ex\/executiveStageTypes/,
  /from ["']@\/app\/lib\/ex\/executiveStageRegistry/,
  /from ["']@\/app\/lib\/ex\/executiveStageModel/,
  /from ["']@\/app\/lib\/ex\/executiveStageValidation/,
  /from ["']@\/app\/lib\/ex\/executiveStageManifest/,
  /from ["']@\/app\/lib\/ex\/executiveStagePlatform/,
  /from ["']@\/app\/lib\/ex\/executiveStageCertification/,
  /from ["']@\/app\/lib\/ex\/executiveStageFreeze/,
  /from ["']@\/app\/lib\/ex\/executiveStageFoundation/,
  /from ["']@\/app\/lib\/ex\/executiveShell/,
  /from ["']\.\.\/lib\/ex\/executiveStage(Types|Registry|Model|Validation|Manifest|Platform|Certification|Freeze|Foundation)/,
  /from ["']\.\.\/lib\/ex\/executiveShell/,
]);

describe("EX-BOOTSTRAP-1 Executive Experience Route", () => {
  it("creates exactly four bootstrap files", () => {
    const pageDir = readdirSync(HERE);
    for (const file of BOOTSTRAP_FILES) {
      assert.ok(pageDir.includes(file), `missing ${file}`);
    }
    const componentsDir = readdirSync(join(HERE, "components"));
    for (const file of COMPONENT_FILES) {
      assert.ok(componentsDir.includes(file), `missing components/${file}`);
    }
    assert.equal(BOOTSTRAP_FILES.length + COMPONENT_FILES.length, 4);
  });

  it("page imports only the Public Index from lib/ex", () => {
    const source = readFileSync(join(HERE, "page.tsx"), "utf8");
    assert.match(
      source,
      /from ["']@\/app\/lib\/ex\/executiveStagePublicIndex["']/,
    );
    for (const pattern of PROHIBITED_LIB_IMPORTS) {
      assert.equal(
        pattern.test(source),
        false,
        `page.tsx must not match ${pattern}`,
      );
    }
    assert.doesNotMatch(
      source,
      /from ["']@\/app\/lib\/ex\/(?!executiveStagePublicIndex)/,
    );
  });

  it("StageHost imports only the Public Index from lib/ex", () => {
    const source = readFileSync(
      join(HERE, "components/ExecutiveStageHost.tsx"),
      "utf8",
    );
    assert.match(
      source,
      /from ["']@\/app\/lib\/ex\/executiveStagePublicIndex["']/,
    );
    for (const pattern of PROHIBITED_LIB_IMPORTS) {
      assert.equal(
        pattern.test(source),
        false,
        `ExecutiveStageHost.tsx must not match ${pattern}`,
      );
    }
  });

  it("renders Executive page with Runtime status and release banner", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutivePage));
    assert.match(html, /data-testid="executive-page"/);
    assert.match(html, /Executive Runtime/);
    assert.match(html, /ReadyForConsumer/);
    assert.match(html, /data-testid="runtime-readiness"/);
    assert.match(html, /data-testid="development-banner"/);
    assert.match(html, /Executive Experience/);
    assert.match(html, /Phase · EX-1 · Released · Certified · Frozen · Stable/);
    assert.match(html, new RegExp(executiveStagePublicIndex.readiness));
    assert.match(
      html,
      new RegExp(
        executiveStagePublicIndex.status.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      ),
    );
  });

  it("renders ExecutiveShell with Stage, Journal, and Timeline placeholders", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutiveShell));
    assert.match(html, /data-testid="executive-shell"/);
    assert.match(html, /data-testid="executive-stage-container"/);
    assert.match(html, /data-testid="journal-placeholder"/);
    assert.match(html, /data-testid="timeline-placeholder"/);
    assert.match(html, /Journal Placeholder/);
    assert.match(html, /Timeline Placeholder/);
  });

  it("renders ExecutiveStageHost with Stage title and Public Index metadata", () => {
    const html = renderToStaticMarkup(React.createElement(ExecutiveStageHost));
    assert.match(html, /data-testid="executive-stage-host"/);
    assert.match(html, /Executive Stage/);
    assert.match(html, /data-testid="stage-runtime-status"/);
    assert.match(html, /data-testid="stage-public-index-version"/);
    assert.match(html, /data-testid="stage-release-status"/);
    assert.match(html, new RegExp(`v${executiveStagePublicIndex.version}`));
    assert.match(html, /ReadyForConsumer/);
    assert.match(
      html,
      /Released · Certified · Frozen · Stable/,
    );
  });
});
