/**
 * STAGE-TOP-LABEL-PLACEMENT — object captions use Top-Right, then Top-Center.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_STAGE_LABEL_MEASUREMENT,
  resolveExecutiveStageOwnedLabelPlacement,
} from "./executiveStageObjectLabelTerritory.ts";

const ALLOWED = new Set(["top-right", "top"]);

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
    kind?: string;
    valueText?: string;
    focused?: boolean;
  }[],
  viewport: { width: number; height: number } = { width: 1440, height: 900 },
  obstacles?: readonly { id: string; bounds: Box }[],
) {
  return resolveExecutiveStageOwnedLabelPlacement({
    presentationLevel: "minimum",
    viewport,
    obstacles,
    objects: objects.map((object) => ({
      id: object.id,
      label: object.label,
      kind: object.kind ?? "object",
      status: "stable",
      x: object.x,
      y: object.y,
      halfExtent: 0.42,
      valueText: object.valueText,
      focused: object.focused,
    })),
  });
}

function assertTopOnly(
  layout: ReturnType<typeof resolveExecutiveStageOwnedLabelPlacement>,
) {
  for (const ownership of layout.ownerships) {
    if (ownership.visibility === "hidden") continue;
    assert.ok(ALLOWED.has(ownership.resolvedSide), ownership.resolvedSide);
    assert.ok(ownership.worldOffsetY > 0, ownership.ownerObjectId);
  }
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

test("a single object uses Top-Right above its body", () => {
  const layout = place([{ id: "solo", label: "Revenue", x: 0, y: 0, valueText: "546,400 USD" }]);
  assert.equal(layout.visibleCount, 1);
  assert.equal(layout.ownerships[0]?.resolvedSide, "top-right");
  assert.ok((layout.ownerships[0]?.worldOffsetX ?? 0) > 0);
  assert.ok((layout.ownerships[0]?.worldOffsetY ?? 0) > 0);
  assert.equal(layout.bodyOverlapCount, 0);
  assert.equal(layout.clippedCount, 0);
});

test("two independent objects stay Top-Right when that side is legal", () => {
  const layout = place([
    { id: "a", label: "Cost", x: -1.6, y: 0.1, valueText: "12" },
    { id: "b", label: "Risk", x: 0.2, y: 0.1, valueText: "3" },
  ]);
  assert.equal(layout.visibleCount, 2);
  assertTopOnly(layout);
  assert.ok(layout.ownerships.every((entry) => entry.resolvedSide === "top-right"));
  assert.ok(minGapPx(layout, 900) + 0.5 >= 24);
});

test("Top-Right blocked by the stage edge falls back to Top-Center", () => {
  const layout = place(
    [{ id: "edge", label: "Operating Cost", x: 2.55, y: 0.1, valueText: "324,800 USD" }],
    { width: 800, height: 515 },
  );
  assert.equal(layout.visibleCount, 1);
  assert.equal(layout.ownerships[0]?.resolvedSide, "top");
  assert.equal(layout.clippedCount, 0);
  assert.equal(layout.bodyOverlapCount, 0);
});

test("Top-Center blocked discloses the caption instead of using a forbidden side", () => {
  const layout = place(
    [{ id: "boxed", label: "Revenue", x: 0, y: 0, valueText: "546,400 USD" }],
    { width: 1440, height: 900 },
    [{ id: "ceiling", bounds: { minX: -2.4, maxX: 2.8, minY: 0.35, maxY: 2.3 } }],
  );
  assert.equal(layout.visibleCount, 0);
  assert.equal(layout.ownerships[0]?.visibility, "hidden");
  assert.equal(layout.clippedCount, 0);
  assert.equal(layout.labelLabelOverlapCount, 0);
  assert.ok(
    layout.ownerships[0]?.resolvedSide === "top-right" ||
      layout.ownerships[0]?.resolvedSide === "top",
  );
});

test("three Business Demo peers stay above their objects", () => {
  const viewport = { width: 800, height: 515 };
  const objects = [
    { id: "cost", label: "Operating Cost", x: -2.41, y: 0.18, valueText: "324,800 USD" },
    { id: "inventory", label: "Inventory", x: 0.09, y: 0.18, valueText: "140 units" },
    { id: "revenue", label: "Revenue", x: 2.5, y: 0.13, valueText: "546,400 USD" },
  ];
  const layout = place(objects, viewport);
  assert.equal(layout.visibleCount, 3);
  assertTopOnly(layout);
  assert.equal(layout.labelLabelOverlapCount, 0);
  assert.equal(layout.bodyOverlapCount, 0);
  assert.equal(layout.clippedCount, 0);
  assert.equal(layout.ownerViolationCount, 0);
  for (const ownership of layout.ownerships) {
    const owner = objects.find((object) => object.id === ownership.ownerObjectId)!;
    const centerY = (ownership.bounds.minY + ownership.bounds.maxY) / 2;
    assert.ok(centerY > owner.y);
    for (const other of objects) {
      if (other.id === owner.id) continue;
      const ownerDist = Math.hypot(
        (ownership.bounds.minX + ownership.bounds.maxX) / 2 - owner.x,
        centerY - owner.y,
      );
      const otherDist = Math.hypot(
        (ownership.bounds.minX + ownership.bounds.maxX) / 2 - other.x,
        centerY - other.y,
      );
      assert.ok(ownerDist <= otherDist + 0.05);
    }
  }
});

test("five independent objects and mixed lengths stay on a top side", () => {
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
  assertTopOnly(layout);
  assert.equal(layout.clippedCount, 0);
  assert.equal(layout.bodyOverlapCount, 0);
  assert.ok(minGapPx(layout, viewport.height) + 0.5 >= 24);
});

test("long adjacent captions do not drop below the object", () => {
  const viewport = { width: 800, height: 515 };
  const layout = place(
    [
      { id: "cost", label: "Operating Cost", x: -0.7, y: 0.15, valueText: "324,800 USD" },
      { id: "inventory", label: "Inventory", x: 0.7, y: 0.15, valueText: "140 units" },
    ],
    viewport,
  );
  assertTopOnly(layout);
  assert.equal(layout.labelLabelOverlapCount, 0);
  assert.equal(layout.bodyOverlapCount, 0);
  if (layout.visibleCount === 2) {
    assert.ok(minGapPx(layout, viewport.height) + 0.5 >= 24);
  }
});

test("flow, network, company hub, and goal hub coordinates stay top-only", () => {
  const viewport = { width: 1544, height: 929 };
  const cases = [
    [
      { id: "a", label: "Alpha", x: -2.5, y: 0.13 },
      { id: "b", label: "Beta", x: 0, y: 0.23 },
      { id: "c", label: "Gamma", x: 2.5, y: 0.13 },
    ],
    [
      { id: "hub", label: "Center", x: 0, y: 0 },
      { id: "left", label: "Left Peer", x: -1.3, y: 0.4 },
      { id: "right", label: "Right Peer", x: 1.3, y: -0.4 },
    ],
    [
      { id: "company", label: "Company", x: 0, y: 0, kind: "company" },
      { id: "sat-a", label: "Capacity", x: -1.72, y: 0 },
      { id: "sat-b", label: "Risk", x: 1.72, y: 0, kind: "risk" },
    ],
    [
      { id: "goal", label: "Goal", x: 0, y: 0, kind: "goal" },
      { id: "problem", label: "Delay", x: -1.72, y: 0.2, kind: "problem" },
      { id: "risk", label: "Exposure", x: 1.72, y: -0.2, kind: "risk" },
    ],
  ];
  for (const objects of cases) {
    const layout = place(objects, viewport);
    assert.equal(layout.visibleCount, objects.length);
    assertTopOnly(layout);
    assert.equal(layout.bodyOverlapCount, 0);
    assert.equal(layout.clippedCount, 0);
    assert.ok(minGapPx(layout, viewport.height) + 0.5 >= 24);
  }
});

test("a Decision Theatre obstacle does not pull an object caption downward", () => {
  const obstacle = {
    id: "data-source",
    bounds: { minX: 1.6, maxX: 3.1, minY: -1.3, maxY: -0.45 },
  };
  const layout = place(
    [
      { id: "revenue", label: "Revenue", x: 2.2, y: 0.1, valueText: "546,400 USD" },
      { id: "inventory", label: "Inventory", x: 0, y: 0.1, valueText: "140 units" },
    ],
    { width: 1440, height: 749 },
    [obstacle],
  );
  assertTopOnly(layout);
  for (const ownership of layout.ownerships) {
    if (ownership.visibility === "hidden") continue;
    assert.ok(separationWorld(ownership.bounds, obstacle.bounds) > 0);
  }
});

test("placement is deterministic across workspaces, focus, and saved-scene recomputation", () => {
  const alpha = [
    { id: "ws-a:revenue", label: "Revenue", x: -1.5, y: 0.1, valueText: "10", focused: true },
    { id: "ws-a:cost", label: "Cost", x: 1.5, y: 0.1, valueText: "4" },
  ];
  const beta = [
    { id: "ws-b:revenue", label: "Revenue", x: -1.5, y: 0.1, valueText: "10", focused: true },
    { id: "ws-b:cost", label: "Cost", x: 1.5, y: 0.1, valueText: "4" },
  ];
  const first = place(alpha);
  const second = place(alpha);
  const otherWorkspace = place(beta);
  assert.deepEqual(
    first.ownerships.map((entry) => [entry.resolvedSide, entry.worldOffsetX, entry.worldOffsetY]),
    second.ownerships.map((entry) => [entry.resolvedSide, entry.worldOffsetX, entry.worldOffsetY]),
  );
  assert.deepEqual(
    first.ownerships.map((entry) => entry.resolvedSide),
    otherWorkspace.ownerships.map((entry) => entry.resolvedSide),
  );
  assert.notEqual(first.ownerships[0]?.ownerObjectId, otherWorkspace.ownerships[0]?.ownerObjectId);
  assertTopOnly(first);
  assert.equal(first.ownerships[0]?.resolvedSide, "top-right");
});
