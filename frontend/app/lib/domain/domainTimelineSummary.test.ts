import { test } from "node:test";
import * as assert from "node:assert/strict";

import { summarizePropagationTimeline } from "./domainTimelineSummary.ts";
import type { DomainTimelineFrame } from "./domainTimelinePropagation.ts";

const singleFrame: DomainTimelineFrame = {
  timestamp: 1,
  highlightedObjectIds: ["supplier", "inventory"],
  highlightedEdgeIds: ["supplier-inventory"],
  activePropagationEvents: [
    {
      id: "event",
      sourceObjectId: "supplier",
      targetObjectId: "inventory",
      propagationType: "risk",
      severity: "high",
      propagationStrength: 0.8,
      timestamp: 1,
    },
  ],
};

test("timeline summary is generated for one frame", () => {
  const summary = summarizePropagationTimeline({ frames: [singleFrame] });

  assert.equal(
    summary,
    "Supplier pressure is expected to affect Inventory through risk flow."
  );
});

test("timeline summary is executive concise for multiple frames", () => {
  const summary = summarizePropagationTimeline({
    frames: [
      singleFrame,
      {
        ...singleFrame,
        timestamp: 2,
        activePropagationEvents: [
          {
            ...singleFrame.activePropagationEvents[0],
            id: "event-2",
            sourceObjectId: "inventory",
            targetObjectId: "delivery",
            propagationStrength: 0.5,
            timestamp: 2,
          },
        ],
      },
    ],
  });

  assert.ok(summary.includes("2 propagation steps"));
  assert.ok(summary.length < 180);
});

test("timeline summary handles empty frames", () => {
  assert.equal(
    summarizePropagationTimeline({ frames: [] }),
    "No propagation timeline is available yet."
  );
});
