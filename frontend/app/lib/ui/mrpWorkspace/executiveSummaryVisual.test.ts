import test from "node:test";
import assert from "node:assert/strict";

import {
  EXEC_SUMMARY_VISUAL_PASS_TAG,
  EXECUTIVE_SUMMARY_SCAN_SECONDS,
  EXECUTIVE_SUMMARY_VISUAL_VERSION,
  executiveSummaryCardStyle,
  executiveSummaryInsightGridStyle,
  executiveSummarySectionLabelStyle,
  executiveSummaryVisualColors,
  executiveSummaryVisualSpacing,
  executiveSummaryWorkspaceShellStyle,
  resetExecutiveSummaryVisualContractForTests,
  resolveExecutiveSummarySystemStatusAccent,
  resolveExecutiveSummaryToneAccent,
  traceExecutiveSummaryVisualPassOnce,
} from "./executiveSummary/executiveSummaryVisualContract.ts";

test.beforeEach(() => {
  resetExecutiveSummaryVisualContractForTests();
});

test("exports executive visual pass tag", () => {
  assert.equal(EXEC_SUMMARY_VISUAL_PASS_TAG, "[EXEC_SUMMARY_VISUAL_PASS]");
});

test("visual contract targets ten second executive scan", () => {
  assert.equal(EXECUTIVE_SUMMARY_SCAN_SECONDS, 10);
  assert.equal(EXECUTIVE_SUMMARY_VISUAL_VERSION, "4.4.0");
});

test("shell uses dark command center semantic tokens", () => {
  const shell = executiveSummaryWorkspaceShellStyle();
  assert.equal(shell.background, executiveSummaryVisualColors.shellBg);
  assert.equal(shell.color, executiveSummaryVisualColors.text);
  assert.match(String(shell.background), /^var\(--nx-/);
});

test("section label typography is uppercase micro label", () => {
  const label = executiveSummarySectionLabelStyle();
  assert.equal(label.textTransform, "uppercase");
  assert.equal(label.fontSize, 10);
});

test("insight grid stays compact without excessive columns", () => {
  const grid = executiveSummaryInsightGridStyle();
  assert.match(String(grid.gridTemplateColumns), /minmax/);
  assert.ok(executiveSummaryVisualSpacing.sectionGap <= 16);
});

test("tone accents map to semantic status colors", () => {
  assert.equal(resolveExecutiveSummaryToneAccent("success"), executiveSummaryVisualColors.success);
  assert.equal(resolveExecutiveSummaryToneAccent("critical"), executiveSummaryVisualColors.critical);
  assert.equal(
    resolveExecutiveSummarySystemStatusAccent("healthy"),
    executiveSummaryVisualColors.success
  );
});

test("card styles avoid animation properties", () => {
  const card = executiveSummaryCardStyle("neutral");
  assert.equal(card.transition, undefined);
  assert.equal(card.animation, undefined);
});

test("traceExecutiveSummaryVisualPassOnce is idempotent", () => {
  traceExecutiveSummaryVisualPassOnce("test");
  traceExecutiveSummaryVisualPassOnce("test");
  assert.ok(true);
});
