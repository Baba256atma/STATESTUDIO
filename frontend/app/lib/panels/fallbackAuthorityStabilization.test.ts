import { describe, expect, it, beforeEach } from "vitest";
import {
  buildAuthorityStateSignature,
  isDashboardAuthorityNoOp,
  shouldCommitAuthorityState,
} from "./authorityStateSignature";
import {
  evaluateSystemFallbackBootstrap,
  markWorkspaceInitialized,
  resetSystemFallbackBootstrapGuardForTests,
} from "./systemFallbackBootstrapGuard";

describe("authorityStateSignature", () => {
  it("treats identical dashboard authority as a no-op", () => {
    const prev = {
      view: "dashboard",
      panelId: "dashboard",
      contextId: null,
      selectedObjectId: null,
      authoritySource: "system_fallback",
      isOpen: true,
    };
    const next = { ...prev, authoritySource: "system_fallback" };
    expect(isDashboardAuthorityNoOp(prev, next)).toBe(true);
    expect(shouldCommitAuthorityState(prev, next)).toBe(false);
  });

  it("commits when dashboard open state changes", () => {
    const prev = {
      view: "dashboard",
      panelId: "dashboard",
      contextId: null,
      selectedObjectId: null,
      authoritySource: "system_fallback",
      isOpen: false,
    };
    const next = { ...prev, isOpen: true };
    expect(isDashboardAuthorityNoOp(prev, next)).toBe(false);
    expect(shouldCommitAuthorityState(prev, next)).toBe(true);
  });

  it("builds stable signatures", () => {
    const sig = buildAuthorityStateSignature({
      view: "dashboard",
      panelId: "dashboard",
      contextId: null,
      selectedObjectId: "obj-1",
      authoritySource: "system_fallback",
      isOpen: true,
    });
    expect(sig).toContain("dashboard");
    expect(sig).toContain("obj-1");
  });
});

describe("systemFallbackBootstrapGuard", () => {
  beforeEach(() => {
    resetSystemFallbackBootstrapGuardForTests();
  });

  it("allows bootstrap when panel state is missing", () => {
    expect(
      evaluateSystemFallbackBootstrap({
        view: null,
        isOpen: false,
        reason: "initial_executive_open",
      }).allow
    ).toBe(true);
  });

  it("rejects fallback when stable dashboard is already open", () => {
    markWorkspaceInitialized(
      buildAuthorityStateSignature({
        view: "dashboard",
        panelId: "dashboard",
        contextId: null,
        selectedObjectId: null,
        authoritySource: "system_fallback",
        isOpen: true,
      })
    );
    const decision = evaluateSystemFallbackBootstrap({
      view: "dashboard",
      panelId: "dashboard",
      contextId: null,
      selectedObjectId: null,
      isOpen: true,
      contractValid: true,
      reason: "initial_executive_open",
    });
    expect(decision.allow).toBe(false);
    expect(decision.rejectReason).toBe("stable_dashboard");
  });
});
