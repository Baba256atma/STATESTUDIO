import { describe, expect, it, beforeEach } from "vitest";
import {
  evaluateIdleRuntimeStability,
  isIdleRuntimeLocked,
  resetIdleRuntimeStabilityGuardForTests,
} from "./idleRuntimeStabilityGuard";

describe("idleRuntimeStabilityGuard", () => {
  beforeEach(() => {
    resetIdleRuntimeStabilityGuardForTests();
  });

  it("locks after two identical stable snapshots", () => {
    const input = {
      dashboardActive: true,
      authoritySignature: "auth-1",
      sceneSignature: "scene-1",
      selectedObjectId: null,
      contractValid: true,
    };
    expect(evaluateIdleRuntimeStability(input)).toBe(false);
    expect(isIdleRuntimeLocked()).toBe(false);
    expect(evaluateIdleRuntimeStability(input)).toBe(true);
    expect(isIdleRuntimeLocked()).toBe(true);
  });

  it("unlocks when dashboard is inactive", () => {
    const stable = {
      dashboardActive: true,
      authoritySignature: "auth-1",
      sceneSignature: "scene-1",
      selectedObjectId: null,
      contractValid: true,
    };
    evaluateIdleRuntimeStability(stable);
    evaluateIdleRuntimeStability(stable);
    expect(isIdleRuntimeLocked()).toBe(true);

    evaluateIdleRuntimeStability({
      ...stable,
      dashboardActive: false,
    });
    expect(isIdleRuntimeLocked()).toBe(false);
  });
});
