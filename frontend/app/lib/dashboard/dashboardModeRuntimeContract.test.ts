import { describe, expect, it, beforeEach } from "vitest";

import {
  mapDashboardModeToLegacyContext,
  mapLegacyDashboardContextToMode,
  mapLegacyRouteToDashboardMode,
  syncDashboardModeAndContext,
} from "./dashboardModeLegacyBridge.ts";
import {
  DEFAULT_DASHBOARD_MODE,
  dashboardModeLabel,
  normalizeDashboardMode,
  resetDashboardModeRuntimeContractForTests,
  resolveDashboardModeRoute,
  resolveDashboardRuntimeState,
} from "./dashboardModeRuntimeContract.ts";
import { reduceNexoraWorkspaceState, createDefaultNexoraWorkspaceState } from "../workspace/nexoraWorkspaceStateContract.ts";

describe("dashboardModeRuntimeContract", () => {
  beforeEach(() => {
    resetDashboardModeRuntimeContractForTests();
  });

  it("defaults to overview mode", () => {
    const runtime = resolveDashboardRuntimeState({});
    expect(runtime.mode).toBe("overview");
    expect(runtime.defaultMode).toBe(DEFAULT_DASHBOARD_MODE);
  });

  it("falls back invalid mode to overview", () => {
    expect(normalizeDashboardMode("invalid_mode")).toBe("overview");
    expect(normalizeDashboardMode(null)).toBe("overview");
  });

  it("accepts timeline as a dedicated dashboard mode", () => {
    expect(normalizeDashboardMode("timeline")).toBe("timeline");
  });

  it("routes unknown requests to overview with redirect flag", () => {
    const result = resolveDashboardModeRoute({
      requestedMode: "invalid_mode",
      source: "legacy_router",
    });
    expect(result.mode).toBe("overview");
    expect(result.redirected).toBe(true);
  });

  it("maps legacy dashboard contexts to runtime modes", () => {
    expect(mapLegacyDashboardContextToMode("risk")).toBe("analyze");
    expect(mapLegacyDashboardContextToMode("timeline")).toBe("timeline");
    expect(mapDashboardModeToLegacyContext("compare")).toBe("compare");
    expect(mapDashboardModeToLegacyContext("scenario")).toBe("scenario");
  });

  it("maps legacy routes to runtime modes", () => {
    expect(mapLegacyRouteToDashboardMode("compare")).toBe("compare");
    expect(mapLegacyRouteToDashboardMode("object_focus")).toBe("focus");
  });

  it("keeps workspace dashboardMode authoritative on setDashboardMode", () => {
    const state = reduceNexoraWorkspaceState(createDefaultNexoraWorkspaceState(), {
      type: "setDashboardMode",
      mode: "war_room",
    });
    expect(state.dashboardMode).toBe("war_room");
    expect(state.dashboardContext).toBe("war_room");
  });

  it("syncs dashboardMode when legacy setDashboardContext is used", () => {
    const state = reduceNexoraWorkspaceState(createDefaultNexoraWorkspaceState(), {
      type: "setDashboardContext",
      context: "risk",
    });
    expect(state.dashboardMode).toBe("analyze");
    expect(state.dashboardContext).toBe("risk");
  });

  it("does not change dashboardMode when assistant tab is selected", () => {
    const state = reduceNexoraWorkspaceState(createDefaultNexoraWorkspaceState(), {
      type: "setMRPTab",
      tab: "assistant",
    });
    expect(state.activeMRPTab).toBe("assistant");
    expect(state.dashboardMode).toBe("overview");
  });

  it("labels runtime modes for UI", () => {
    expect(dashboardModeLabel("analyze")).toBe("Analyze");
    expect(dashboardModeLabel("focus")).toBe("Focus");
  });

  it("sync helper prefers explicit dashboardMode input", () => {
    const synced = syncDashboardModeAndContext({ dashboardMode: "compare" });
    expect(synced.dashboardMode).toBe("compare");
    expect(synced.dashboardContext).toBe("compare");
  });
});
