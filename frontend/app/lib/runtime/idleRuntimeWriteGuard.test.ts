import { describe, expect, it, beforeEach } from "vitest";
import {
  getLastRuntimeWriteSignature,
  resetIdleRuntimeWriteGuardForTests,
  shouldProceedRuntimeWrite,
  shouldProceedRuntimeWriteDuringIdle,
} from "./idleRuntimeWriteGuard";
import {
  evaluateIdleRuntimeStability,
  resetIdleRuntimeStabilityGuardForTests,
} from "./idleRuntimeStabilityGuard";

describe("idleRuntimeWriteGuard", () => {
  beforeEach(() => {
    resetIdleRuntimeWriteGuardForTests();
    resetIdleRuntimeStabilityGuardForTests();
  });

  it("blocks repeated writes with the same signature", () => {
    expect(shouldProceedRuntimeWrite("visible-ui-state", "sig-a")).toBe(true);
    expect(shouldProceedRuntimeWrite("visible-ui-state", "sig-a")).toBe(false);
    expect(getLastRuntimeWriteSignature("visible-ui-state")).toBe("sig-a");
  });

  it("allows signature progression within the same domain", () => {
    expect(shouldProceedRuntimeWrite("scene-write:apply", "sig-a")).toBe(true);
    expect(shouldProceedRuntimeWrite("scene-write:apply", "sig-b")).toBe(true);
    expect(shouldProceedRuntimeWrite("scene-write:apply", "sig-b")).toBe(false);
  });

  it("blocks additional idle writes after the first signature is recorded", () => {
    const idleInput = {
      dashboardActive: true,
      authoritySignature: "auth-a",
      sceneSignature: "scene-a",
      selectedObjectId: null,
      contractValid: true,
    };
    evaluateIdleRuntimeStability(idleInput);
    evaluateIdleRuntimeStability(idleInput);

    expect(shouldProceedRuntimeWriteDuringIdle("panel-validation", "sig-a")).toBe(true);
    expect(shouldProceedRuntimeWriteDuringIdle("panel-validation", "sig-b")).toBe(false);
  });
});
