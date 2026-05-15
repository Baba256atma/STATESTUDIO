import test from "node:test";
import assert from "node:assert/strict";

import { deriveStrategicMeaning } from "./deriveStrategicMeaning.ts";

test("strategic meaning explains why the narrative matters", () => {
  const meaning = deriveStrategicMeaning({
    focus: "Supplier instability",
    tone: "urgent",
    relatedObjectIds: ["supplier", "inventory"],
    domainId: "supply_chain",
  });

  assert.match(meaning, /matters/);
  assert.match(meaning, /executive exposure/);
  assert.match(meaning, /supply chain/);
});
