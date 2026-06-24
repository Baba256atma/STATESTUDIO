import { describe, expect, it } from "vitest";

import type { NexoraRelationship } from "../../../lib/relationships/relationshipTypes";
import {
  interpolateLinePoint,
  readRelationshipFlowStrength,
  resolveFlowBallProgress,
  resolveRelationshipFlowBallConfig,
  resolveRelationshipFlowStrengthTier,
  shouldShowRelationshipFlowBalls,
} from "./relationshipFlowRuntime";

const baseRelationship = (overrides: Partial<NexoraRelationship> = {}): NexoraRelationship => ({
  id: "rel-1",
  sourceId: "obj-a",
  targetId: "obj-b",
  type: "dependency",
  direction: "uni",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("relationshipFlowRuntime", () => {
  it("maps strength tiers to ball count and speed", () => {
    expect(resolveRelationshipFlowBallConfig(0.1)).toEqual({
      tier: "very_weak",
      ballCount: 1,
      speedMultiplier: 0.3,
    });
    expect(resolveRelationshipFlowBallConfig(0.3)).toEqual({
      tier: "weak",
      ballCount: 2,
      speedMultiplier: 0.5,
    });
    expect(resolveRelationshipFlowBallConfig(0.5)).toEqual({
      tier: "normal",
      ballCount: 3,
      speedMultiplier: 1,
    });
    expect(resolveRelationshipFlowBallConfig(0.7)).toEqual({
      tier: "strong",
      ballCount: 4,
      speedMultiplier: 1.5,
    });
    expect(resolveRelationshipFlowBallConfig(0.95)).toEqual({
      tier: "very_strong",
      ballCount: 5,
      speedMultiplier: 2,
    });
  });

  it("shows flow balls only for selected object network roles", () => {
    expect(
      shouldShowRelationshipFlowBalls({
        selectedObjectId: "obj-a",
        focusRole: "direct_dependency",
      })
    ).toBe(true);
    expect(
      shouldShowRelationshipFlowBalls({
        selectedObjectId: "obj-a",
        focusRole: "unrelated",
      })
    ).toBe(false);
    expect(
      shouldShowRelationshipFlowBalls({
        selectedObjectId: null,
        focusRole: "direct_dependency",
      })
    ).toBe(false);
  });

  it("reads strength from metadata strength or relationshipStrength", () => {
    expect(readRelationshipFlowStrength(baseRelationship({ metadata: { strength: 0.82 } }))).toBe(0.82);
    expect(
      readRelationshipFlowStrength(
        baseRelationship({ metadata: { relationshipStrength: 0.66 } })
      )
    ).toBe(0.66);
    expect(readRelationshipFlowStrength(baseRelationship({ metadata: undefined }))).toBe(0.5);
  });

  it("interpolates source to target along the line", () => {
    expect(interpolateLinePoint([0, 0, 0], [10, 0, 0], 0)).toEqual([0, 0, 0]);
    expect(interpolateLinePoint([0, 0, 0], [10, 0, 0], 1)).toEqual([10, 0, 0]);
    expect(interpolateLinePoint([0, 0, 0], [10, 0, 0], 0.5)).toEqual([5, 0, 0]);
  });

  it("keeps flow progress within padded endpoints", () => {
    const progress = resolveFlowBallProgress(0, 1, 0);
    expect(progress).toBeGreaterThanOrEqual(0.08);
    expect(progress).toBeLessThanOrEqual(0.92);
    expect(resolveRelationshipFlowStrengthTier(0.79)).toBe("strong");
  });
});
