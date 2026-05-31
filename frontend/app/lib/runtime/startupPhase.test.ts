import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  STARTUP_WINDOW_MS,
  isStartupPhase,
  markHydrationComplete,
  markPanelStable,
  markSceneStable,
  markStartupCompleted,
  resetStartupPhaseForTests,
} from "./startupPhase";

describe("startupPhase", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetStartupPhaseForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts in startup phase", () => {
    expect(isStartupPhase()).toBe(true);
  });

  it("ends startup when hydration, scene, and panel are stable", () => {
    markHydrationComplete();
    expect(isStartupPhase()).toBe(true);
    markSceneStable();
    expect(isStartupPhase()).toBe(true);
    markPanelStable();
    expect(isStartupPhase()).toBe(false);
  });

  it("ends startup after timeout", () => {
    vi.advanceTimersByTime(STARTUP_WINDOW_MS);
    expect(isStartupPhase()).toBe(false);
  });

  it("markStartupCompleted exits startup immediately", () => {
    markStartupCompleted();
    expect(isStartupPhase()).toBe(false);
  });
});
