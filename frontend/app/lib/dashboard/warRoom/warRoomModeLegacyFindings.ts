/**
 * MRP:6:1 — Legacy war room routing findings (documented, not duplicated).
 */

export const WAR_ROOM_MODE_LEGACY_FINDINGS = Object.freeze({
  dashboardRuntime: {
    path: "frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx",
    behavior: "Sole authority for executive workspace modes including war_room.",
    risk: "None — War Room is a Dashboard mode, not a separate panel.",
    status: "authority_preserved",
  },
  executiveWarRoomRuntime: {
    path: "frontend/app/lib/scene/warroom/executiveWarRoomRuntime.ts",
    behavior: "Scene-layer war room store and playback — separate from Dashboard War Room mode.",
    risk: "Name collision; Dashboard War Room must not invoke scene war room runtime on mount.",
    status: "decoupled",
  },
  warRoomController: {
    path: "frontend/app/lib/warroom/warRoomController.ts",
    behavior: "Legacy war room flow controller and action templates.",
    risk: "Competing authority if wired to Dashboard shell without contract.",
    status: "legacy_not_wired",
  },
  executiveWarRoomOrchestration: {
    path: "frontend/app/lib/simulation/warroom/executiveWarRoomOrchestrationEngine.ts",
    behavior: "Simulation-layer war room orchestration engine.",
    risk: "Must not execute from workspace shell in MRP:6:1.",
    status: "legacy_engine_not_wired",
  },
  warRoomIntelligence: {
    path: "frontend/app/lib/dashboard/warRoomIntelligence/warRoomIntelligenceContract.ts",
    behavior: "Phase 4 intelligence module — future slot in WAR_ROOM_WORKSPACE_MODULES.",
    risk: "Future wiring must use module slots, not bypass Dashboard.",
    status: "future_module_host",
  },
  rightPanelHost: {
    path: "frontend/app/components/right-panel/RightPanelHost.tsx",
    behavior: "Legacy war_room view opened via requestPanelAuthorityOpen.",
    risk: "Competing destination if Object Panel War Room reopens legacy panel.",
    status: "isolated_fallback_only",
  },
  focusAnalyzeCompareScenario: {
    path: "frontend/app/lib/dashboard/{focus,analyze,compare,scenario}/*ModeContract.ts",
    behavior: "Shared read-only object context via FocusModeContextInput.",
    risk: "None — War Room reuses same pattern.",
    status: "shared_context_source",
  },
  useWarRoomState: {
    path: "frontend/app/lib/warroom/useWarRoomState.ts",
    behavior: "Legacy React hook for war room session state.",
    risk: "Duplicate session store if mounted alongside Dashboard workspace.",
    status: "not_used_in_mrp_shell",
  },
});
