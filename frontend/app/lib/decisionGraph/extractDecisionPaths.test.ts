import test from "node:test";
import assert from "node:assert/strict";

import { extractDecisionPaths } from "./extractDecisionPaths.ts";
import type { StrategicDecisionGraph } from "./strategicDecisionGraphTypes.ts";

test("extracts a stable executive decision path", () => {
  const graph: StrategicDecisionGraph = {
    id: "graph",
    nodes: [
      { id: "risk", type: "risk", title: "Supplier Risk", severity: "critical", createdAt: 0 },
      { id: "scenario", type: "scenario", title: "Supplier Scenario", createdAt: 0 },
      { id: "recommendation", type: "recommendation", title: "Diversify Supplier", createdAt: 0 },
      { id: "monitoring", type: "monitoring", title: "Monitor Supplier", createdAt: 0 },
    ],
    edges: [],
    createdAt: 0,
  };

  const paths = extractDecisionPaths({ graph });

  assert.equal(paths.length, 1);
  assert.deepEqual(paths[0].nodeIds, ["risk", "scenario", "recommendation", "monitoring"]);
  assert.match(paths[0].headline, /Supplier Risk/);
});
