import test from "node:test";
import assert from "node:assert/strict";

import {
  OPERATIONAL_SCAN_SECONDS,
  OPERATIONAL_VISUAL_PASS_TAG,
  OPERATIONAL_VISUAL_VERSION,
  operationalActivityLevelChipStyle,
  operationalCardStyle,
  operationalInsightGridStyle,
  operationalSectionLabelStyle,
  operationalVisualColors,
  operationalVisualSpacing,
  operationalWorkspaceShellStyle,
  resetOperationalVisualContractForTests,
  resolveOperationalActivityLevelAccent,
  resolveOperationalStatusAccent,
  resolveOperationalToneAccent,
  traceOperationalVisualPassOnce,
} from "./operational/operationalVisualContract.ts";
import {
  executiveSummaryVisualColors,
  executiveSummaryVisualSpacing,
} from "./executiveSummary/executiveSummaryVisualContract.ts";

test.beforeEach(() => {
  resetOperationalVisualContractForTests();
});

test("exports operational visual pass tag", () => {
  assert.equal(OPERATIONAL_VISUAL_PASS_TAG, "[OPERATIONAL_VISUAL_PASS]");
});

test("visual contract targets ten second operational scan", () => {
  assert.equal(OPERATIONAL_SCAN_SECONDS, 10);
  assert.equal(OPERATIONAL_VISUAL_VERSION, "4.10.0");
});

test("shell uses dark command center semantic tokens aligned with executive summary", () => {
  const shell = operationalWorkspaceShellStyle();
  assert.equal(shell.background, operationalVisualColors.shellBg);
  assert.equal(shell.background, executiveSummaryVisualColors.shellBg);
  assert.equal(shell.color, operationalVisualColors.text);
  assert.match(String(shell.background), /^var\(--nx-/);
});

test("spacing matches executive summary for MRP consistency", () => {
  assert.deepEqual(operationalVisualSpacing, executiveSummaryVisualSpacing);
  assert.ok(operationalVisualSpacing.sectionGap <= 16);
});

test("section label typography is uppercase micro label", () => {
  const label = operationalSectionLabelStyle();
  assert.equal(label.textTransform, "uppercase");
  assert.equal(label.fontSize, 10);
});

test("insight grid stays compact without excessive columns", () => {
  const grid = operationalInsightGridStyle();
  assert.match(String(grid.gridTemplateColumns), /minmax/);
});

test("operational accents map to semantic status colors", () => {
  assert.equal(resolveOperationalToneAccent("success"), operationalVisualColors.success);
  assert.equal(resolveOperationalToneAccent("critical"), operationalVisualColors.critical);
  assert.equal(resolveOperationalStatusAccent("healthy"), operationalVisualColors.success);
  assert.equal(resolveOperationalActivityLevelAccent("high"), operationalVisualColors.critical);
});

test("card styles avoid animation properties", () => {
  const card = operationalCardStyle("neutral");
  assert.equal(card.transition, undefined);
  assert.equal(card.animation, undefined);
});

test("activity level chips avoid animation properties", () => {
  const chip = operationalActivityLevelChipStyle("medium", true);
  assert.equal(chip.transition, undefined);
  assert.equal(chip.animation, undefined);
});

test("traceOperationalVisualPassOnce is idempotent", () => {
  traceOperationalVisualPassOnce("test");
  traceOperationalVisualPassOnce("test");
  assert.ok(true);
});
