import { describe, expect, it, beforeEach } from "vitest";
import {
  getIgnoredWorkspaceHydrationPayloadCountForTests,
  resetWorkspaceHydrationPayloadGateForTests,
  shouldIgnoreWorkspaceHydrationPayload,
  traceEmptyWorkspaceHydrationPayloadIgnored,
} from "./workspaceHydrationPayloadGate";

describe("workspaceHydrationPayloadGate", () => {
  beforeEach(() => {
    resetWorkspaceHydrationPayloadGateForTests();
  });

  it("ignores empty workspace payload after hydration", () => {
    expect(
      shouldIgnoreWorkspaceHydrationPayload({
        source: "workspace",
        objectCountBefore: 3,
        objectCountAfter: 0,
        hydrationCompleted: true,
        sceneAlreadyHasObjects: true,
      })
    ).toBe(true);
  });

  it("does not ignore explicit user clear attempts", () => {
    expect(
      shouldIgnoreWorkspaceHydrationPayload({
        source: "workspace",
        objectCountBefore: 3,
        objectCountAfter: 0,
        hydrationCompleted: true,
        explicitUserClear: true,
      })
    ).toBe(false);
  });

  it("does not ignore non-workspace empty clears", () => {
    expect(
      shouldIgnoreWorkspaceHydrationPayload({
        source: "unknown",
        objectCountBefore: 3,
        objectCountAfter: 0,
        hydrationCompleted: true,
      })
    ).toBe(false);
  });

  it("does not ignore workspace hydration into an empty scene", () => {
    expect(
      shouldIgnoreWorkspaceHydrationPayload({
        source: "workspace",
        objectCountBefore: 0,
        objectCountAfter: 0,
        hydrationCompleted: false,
      })
    ).toBe(false);
  });

  it("dedupes startup ignore diagnostics by signature", () => {
    const input = {
      source: "workspace",
      objectCountBefore: 2,
      objectCountAfter: 0,
      hydrationCompleted: true,
    };
    traceEmptyWorkspaceHydrationPayloadIgnored(input);
    traceEmptyWorkspaceHydrationPayloadIgnored(input);
    expect(getIgnoredWorkspaceHydrationPayloadCountForTests()).toBe(1);
  });
});
