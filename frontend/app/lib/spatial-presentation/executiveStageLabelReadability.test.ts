/**
 * STAGE-LABEL-READABILITY — preferred 24px caption separation.
 * Spacing is measured on solver bounds, not only non-overlap.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_STAGE_LABEL_MEASUREMENT,
  executiveStageLabelReadabilityGapWorld,
  resolveExecutiveStageOwnedLabelPlacement,
} from "./executiveStageObjectLabelTerritory.ts";

type Box = { minX: number; maxX: number; minY: number; maxY: number };

function separationWorld(a: Box, b: Box): number {
  const gapX = Math.max(b.minX - a.maxX, a.minX - b.maxX, 0);
  const gapY = Math.max(b.minY - a.maxY, a.minY - b.maxY, 0);
  if (gapX === 0 && gapY === 0) return 0;
  if (gapX === 0) return gapY;
  if (gapY === 0) return gapX;
  return Math.hypot(gapX, gapY);
}

function place(
  objects: readonly {
    id: string;
    label: string;
    x: number;
    y: number;
    valueText?: string;
  }[],
  viewport: { width: number; height: number },
  obstacles?: readonly { id: string; bounds: Box }[],
) {
  return resolveExecutiveStageOwnedLabelPlacement({
    presentationLevel: "minimum",
    viewport,
    obstacles,
    objects: objects.map((object) => ({
      id: object.id,
      label: object.label,
      kind: "object",
      status: "stable",
      x: object.x,
      y: object.y,
      halfExtent: 0.42,
      valueText: object.valueText,
    })),
  });
}

function minGapPx(
  layout: ReturnType<typeof resolveExecutiveStageOwnedLabelPlacement>,
  viewportHeight: number,
): number {
  const visible = layout.ownerships.filter((entry) => entry.visibility !== "hidden");
  let min = Number.POSITIVE_INFINITY;
  for (let i = 0; i < visible.length; i += 1) {
    for (let j = i + 1; j < visible.length; j += 1) {
      const world = separationWorld(visible[i]!.bounds, visible[j]!.bounds);
      min = Math.min(
        min,
        (world * viewportHeight) / EXECUTIVE_STAGE_LABEL_MEASUREMENT.distanceFactor,
      );
    }
  }
  return min;
}

function assertReadable(
  layout: ReturnType<typeof resolveExecutiveStageOwnedLabelPlacement>,
  viewportHeight: number,
) {
  assert.equal(layout.labelLabelOverlapCount, 0);
  assert.equal(layout.bodyOverlapCount, 0);
  assert.equal(layout.clippedCount, 0);
  assert.equal(layout.ownerViolationCount, 0);
  const gap = minGapPx(layout, viewportHeight);
  assert.ok(
    gap + 0.5 >= EXECUTIVE_STAGE_LABEL_MEASUREMENT.preferredEdgeGapPx,
    `gap ${gap.toFixed(1)}px is below 24`,
  );
}

const shortViewport = { width: 800, height: 515 };

test("readability gap scales with the measured viewport", () => {
  const tall = executiveStageLabelReadabilityGapWorld(929);
  const short = executiveStageLabelReadabilityGapWorld(515);
  assert.ok(short > tall);
  assert.ok(Math.abs(short - (24 * 10) / 515) < 1e-6);
});

test("two short labels keep a shared side and at least 24px", () => {
  const viewport = { width: 1440, height: 900 };
  const layout = place(
    [
      { id: "a", label: "Cost", x: -2.2, y: 0.1, valueText: "12" },
      { id: "b", label: "Risk", x: 2.2, y: 0.1, valueText: "3" },
    ],
    viewport,
  );
  assert.equal(layout.visibleCount, 2);
  for (const ownership of layout.ownerships) {
    assert.ok(ownership.resolvedSide === "top-right" || ownership.resolvedSide === "top");
  }
  assertReadable(layout, viewport.height);
});

test("two long adjacent labels move off a tight shared band", () => {
  const layout = place(
    [
      { id: "cost", label: "Operating Cost", x: -0.7, y: 0.15, valueText: "324,800 USD" },
      { id: "inventory", label: "Inventory", x: 0.7, y: 0.15, valueText: "140 units" },
    ],
    shortViewport,
  );
  assert.equal(layout.visibleCount, 2);
  assertReadable(layout, shortViewport.height);
  for (const ownership of layout.ownerships) {
    assert.ok(
      ownership.resolvedSide === "top-right" || ownership.resolvedSide === "top",
    );
  }
});

test("three flow peers at the 800 stage clear 24px", () => {
  const layout = place(
    [
      { id: "cost", label: "Operating Cost", x: -2.41, y: 0.18, valueText: "324,800 USD" },
      { id: "inventory", label: "Inventory", x: 0.09, y: 0.18, valueText: "140 units" },
      { id: "revenue", label: "Revenue", x: 2.5, y: 0.13, valueText: "546,400 USD" },
    ],
    shortViewport,
  );
  assert.equal(layout.visibleCount, 3);
  assertReadable(layout, shortViewport.height);
});

test("five flow peers stay contained and separated", () => {
  const viewport = { width: 1544, height: 929 };
  const layout = place(
    [0, 1, 2, 3, 4].map((index) => ({
      id: `peer-${index}`,
      label: index === 2 ? "Operating Cost" : "Peer",
      x: -2.525 + index * 1.2625,
      y: index % 2 === 0 ? 0.23 : 0.13,
      valueText: index === 2 ? "80" : "12",
    })),
    viewport,
  );
  assert.equal(layout.visibleCount, 5);
  assertReadable(layout, viewport.height);
});

test("mixed lengths, owner association, and body clearance", () => {
  const viewport = { width: 1440, height: 749 };
  const objects = [
    { id: "cost", label: "Operating Cost", x: -2.41, y: 0.18, valueText: "324,800 USD" },
    { id: "inventory", label: "Units", x: 0.09, y: 0.18, valueText: "4" },
    { id: "revenue", label: "Revenue", x: 2.5, y: 0.13, valueText: "546,400 USD" },
  ];
  const layout = place(objects, viewport);
  assertReadable(layout, viewport.height);
  for (const ownership of layout.ownerships) {
    const owner = objects.find((object) => object.id === ownership.ownerObjectId)!;
    for (const other of objects) {
      if (other.id === owner.id) continue;
      const ownerDist = Math.hypot(
        (ownership.bounds.minX + ownership.bounds.maxX) / 2 - owner.x,
        (ownership.bounds.minY + ownership.bounds.maxY) / 2 - owner.y,
      );
      const otherDist = Math.hypot(
        (ownership.bounds.minX + ownership.bounds.maxX) / 2 - other.x,
        (ownership.bounds.minY + ownership.bounds.maxY) / 2 - other.y,
      );
      assert.ok(ownerDist <= otherDist + 0.05);
    }
    const body = {
      minX: owner.x - 0.42,
      maxX: owner.x + 0.42,
      minY: owner.y - 0.42,
      maxY: owner.y + 0.42,
    };
    assert.ok(separationWorld(ownership.bounds, body) > 0);
  }
});

test("a decision-theatre caption stays an obstacle", () => {
  const obstacle = {
    id: "data-source",
    bounds: { minX: 1.7, maxX: 3.1, minY: -0.9, maxY: -0.35 },
  };
  const layout = place(
    [
      { id: "revenue", label: "Revenue", x: 2.2, y: 0.1, valueText: "546,400 USD" },
      { id: "inventory", label: "Inventory", x: 0, y: 0.1, valueText: "140 units" },
    ],
    { width: 1440, height: 749 },
    [obstacle],
  );
  assert.equal(layout.visibleCount, 2);
  assert.equal(layout.bodyOverlapCount, 0);
  for (const ownership of layout.ownerships) {
    if (ownership.visibility === "hidden") continue;
    assert.ok(separationWorld(ownership.bounds, obstacle.bounds) > 0);
  }
});

test("placement is deterministic", () => {
  const input = [
    { id: "cost", label: "Operating Cost", x: -2.41, y: 0.18, valueText: "324,800 USD" },
    { id: "inventory", label: "Inventory", x: 0.09, y: 0.18, valueText: "140 units" },
    { id: "revenue", label: "Revenue", x: 2.5, y: 0.13, valueText: "546,400 USD" },
  ];
  const a = place(input, shortViewport);
  const b = place(input, shortViewport);
  assert.deepEqual(
    a.ownerships.map((entry) => [entry.ownerObjectId, entry.resolvedSide, entry.worldOffsetX, entry.worldOffsetY]),
    b.ownerships.map((entry) => [entry.ownerObjectId, entry.resolvedSide, entry.worldOffsetX, entry.worldOffsetY]),
  );
});

test("flow, network, and hub coordinates remain readable", () => {
  const flow = place(
    [
      { id: "a", label: "Alpha", x: -2.5, y: 0.13 },
      { id: "b", label: "Beta", x: 0, y: 0.23 },
      { id: "c", label: "Gamma", x: 2.5, y: 0.13 },
    ],
    { width: 1544, height: 929 },
  );
  assertReadable(flow, 929);
  const network = place(
    [
      { id: "hub", label: "Center", x: 0, y: 0 },
      { id: "left", label: "Left Peer", x: -1.3, y: 0.4 },
      { id: "right", label: "Right Peer", x: 1.3, y: -0.4 },
    ],
    { width: 1544, height: 929 },
  );
  assertReadable(network, 929);
  const ring = place(
    [
      { id: "company", label: "Company", x: 0, y: 0 },
      { id: "sat-a", label: "Capacity", x: -1.72, y: 0 },
      { id: "sat-b", label: "Risk", x: 1.72, y: 0 },
    ],
    { width: 1544, height: 929 },
  );
  assertReadable(ring, 929);
});
