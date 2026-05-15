import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCompressedInsightSummary,
  buildCompressedInsightTitle,
  buildExecutiveBriefingFocus,
} from "./compressionNarratives.ts";

test("compression narratives are concise executive language", () => {
  const title = buildCompressedInsightTitle({
    focus: "Supplier dependency",
    priority: "critical",
  });
  const summary = buildCompressedInsightSummary({
    focus: "Supplier dependency",
    objectCount: 3,
    signalCount: 4,
    priority: "critical",
  });

  assert.equal(title, "Supplier dependency is the dominant executive pressure");
  assert.ok(summary.includes("executive risk"));
  assert.ok(summary.length < 140);
});

test("executive briefing focus reflects low confidence", () => {
  assert.equal(
    buildExecutiveBriefingFocus({ focus: "Supplier dependency", confidence: "low" }),
    "Clarify evidence around Supplier dependency."
  );
});
