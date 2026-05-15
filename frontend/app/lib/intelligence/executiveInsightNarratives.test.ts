import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  buildExecutiveInsightSummary,
  buildExecutiveInsightTitle,
  recommendExecutiveFocus,
} from "./executiveInsightNarratives.ts";

test("narratives are concise executive language", () => {
  assert.equal(
    buildExecutiveInsightTitle({ category: "fragility", primaryLabel: "Inventory" }),
    "Inventory Fragility Pressure"
  );
  assert.match(
    buildExecutiveInsightSummary({ category: "dependency", primaryLabel: "Supplier", secondaryLabel: "Inventory" }),
    /depends on Supplier/i
  );
});

test("focus recommendations map by category", () => {
  assert.equal(
    recommendExecutiveFocus({ category: "dependency", primaryLabel: "Supplier" }),
    "Reduce dependency concentration around Supplier."
  );
  assert.equal(
    recommendExecutiveFocus({ category: "financial", primaryLabel: "Liquidity" }),
    "Protect financial flexibility around Liquidity."
  );
});
