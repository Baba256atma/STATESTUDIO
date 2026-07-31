import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  ExecutiveJournalPreviewCanonicalPath,
  ExecutiveJournalPreviewRouteEnabledValue,
  ExecutiveJournalPreviewRouteFlagName,
  resolveExecutiveJournalPreviewRouteAccess,
} from "./executiveJournalPreviewRouteAccess.ts";

const pageSource = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

describe("EX-2 Tier-0 synthetic preview route access", () => {
  it("allows development with exact true", () => {
    assert.deepEqual(
      resolveExecutiveJournalPreviewRouteAccess("development", "true"),
      {
        result: "Allowed",
        reason: "AuthorizedLocalEnvironmentAndExactFlag",
      },
    );
  });

  it("allows test with exact true", () => {
    assert.equal(
      resolveExecutiveJournalPreviewRouteAccess("test", "true").result,
      "Allowed",
    );
  });

  for (const [name, environment, flag] of [
    ["production plus true", "production", "true"],
    ["missing flag", "development", undefined],
    ["false", "development", "false"],
    ["uppercase variant", "development", "TRUE"],
    ["whitespace variant", "development", " true "],
    ["empty value", "development", ""],
    ["unknown environment", "staging", "true"],
  ] as const) {
    it(`denies ${name}`, () => {
      assert.equal(
        resolveExecutiveJournalPreviewRouteAccess(environment, flag).result,
        "Denied",
      );
    });
  }

  it("records exact route and server flag identities", () => {
    assert.equal(
      ExecutiveJournalPreviewCanonicalPath,
      "/executive/journal-preview",
    );
    assert.equal(
      ExecutiveJournalPreviewRouteFlagName,
      "EX2_TIER0_PREVIEW_ENABLED",
    );
    assert.equal(ExecutiveJournalPreviewRouteEnabledValue, "true");
  });

  it("keeps the route page server-owned and fail closed", () => {
    assert.doesNotMatch(pageSource, /^["']use client["'];/m);
    assert.match(pageSource, /from ["']next\/navigation["']/);
    assert.match(pageSource, /\bnotFound\(\)/);
    assert.match(pageSource, /process\.env\.NODE_ENV/);
    assert.match(
      pageSource,
      /process\.env\[ExecutiveJournalPreviewRouteFlagName\]/,
    );
    assert.doesNotMatch(pageSource, /NEXT_PUBLIC_/);
  });

  it("imports only the certified harness and route-local access helper", () => {
    assert.match(
      pageSource,
      /@\/app\/lib\/ex\/ExecutiveJournalSyntheticHarness/,
    );
    assert.match(pageSource, /\.\/executiveJournalPreviewRouteAccess/);
    assert.doesNotMatch(
      pageSource,
      /executiveJournalSynthetic(MetadataProvider|MetadataAdapter|MetadataFixtures|UiFacade)/,
    );
  });

  it("delegates marker ownership to the certified harness without adding controls", () => {
    assert.doesNotMatch(pageSource, /ex2-tier0-route-marker/);
    assert.doesNotMatch(pageSource, /Synthetic \/ Tier 0 \/ Non-production/);
    assert.match(pageSource, /ExecutiveJournalSyntheticHarness/);
    assert.doesNotMatch(
      pageSource,
      /<(button|form|input|select|textarea)\b/i,
    );
    assert.doesNotMatch(
      pageSource,
      />\s*(Create|Edit|Delete|Approve|Confirm|Export|Upload|Execute)\b/i,
    );
  });

  it("contains no prohibited runtime dependency or side-effect API", () => {
    for (const prohibited of [
      /\bRTC-[123]\b/i,
      /\bAPP-8\b/i,
      /executiveStagePublicIndex/,
      /\bfetch\s*\(/,
      /XMLHttpRequest/,
      /WebSocket/,
      /localStorage/,
      /sessionStorage/,
      /indexedDB/,
      /sendBeacon/,
      /analytics/,
      /telemetry/i,
      /cloud/i,
    ]) {
      assert.doesNotMatch(pageSource, prohibited);
    }
  });
});
