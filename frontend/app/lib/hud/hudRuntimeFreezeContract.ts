/**
 * MRP_HUD:10:5 — HUD runtime freeze contract.
 * Freezes layout enforcement from MRP_HUD:10:1–10:3 for Type-C workspace.
 */

export const HUD_RUNTIME_FREEZE_V1 = Object.freeze({
  id: "HUD_RUNTIME_FREEZE_V1",
  version: "1.0.0",
  frozenAt: "MRP_HUD:10:5",
  phases: Object.freeze([
    "MRP_HUD:10:1",
    "MRP_HUD:10:2",
    "MRP_HUD:10:3",
    "MRP_HUD:10:5A",
  ] as const),
  zones: Object.freeze({
    scenePanel: "Zone A — Scene Left Safe Zone",
    objectPanel: "Zone C — Scene Right Safe Zone",
    timeline: "Zone D — Timeline Safe Zone",
    mrp: "Zone E — MRP Safe Zone",
    assistant: "Zone E — Assistant (MRP tab boundary)",
    floatingOverlay: "Zone F — Floating Overlay Zone",
    topControls: "Top bar / executive controls lane",
    commandDock: "Bottom command dock clearance band",
  }),
  frozenBehaviors: Object.freeze({
    objectPanelSafeZone: Object.freeze({
      minGapToMrp: 12,
      enforcement: "object_panel_clamps_left_of_mrp",
      mrpNeverMoves: true,
    }),
    timelineSafeZone: Object.freeze({
      minGapToObjectPanel: 12,
      minGapToScenePanel: 12,
      minGapToMrp: 12,
      minBottomInset: 16,
      enforcement: "timeline_clamps_inside_scene_bottom_band",
      zIndex: 4,
    }),
    scenePanelSafeZone: Object.freeze({
      enforcement: "scene_panel_left_dock_inside_scene_host",
    }),
    mrpBoundary: Object.freeze({
      host: "nexora-visible-mrp-host",
      enforcement: "mrp_width_reserved_never_overlapped_by_object_panel",
    }),
    assistantBoundary: Object.freeze({
      enforcement: "assistant_mounts_inside_mrp_only",
      dashboardTabIsolation: true,
    }),
    hudOverlapDiagnostics: Object.freeze({
      auditTrace: "[NexoraHUDAudit]",
      freezeTrace: "[NexoraHUDFreeze]",
      brakeTrace: "[Nexora][HUDZoneBrake]",
    }),
    hudDebounceStrategy: Object.freeze({
      layoutSignatureDedupe: true,
      brakeSignatureOncePerSession: true,
      verySmallWidthDiagnosticOnly: true,
      verySmallWidthThresholdPx: 900,
      writeSkipTrace: "[NexoraTimelineZoneWriteSkipped]",
    }),
    objectClickSingleWrite: Object.freeze({
      phase: "MRP_HUD:10:5A",
      canonicalIntent: "object_click|objectId|dashboard|sources",
      dedupTrace: "[NexoraObjectClickDedup]",
      maxWritesPerClick: 1,
      interactionFrameMs: 400,
      legacyRedirectAbsorbed: true,
      blockedTraces: Object.freeze([
        "duplicate_NEXORA_RIGHT_PANEL_WRITE",
        "repeated_DashboardRedirect",
        "repeated_DeprecatedSurface",
      ]),
    }),
    accordionStability: Object.freeze({
      enforcement: "single_open_accordion_per_surface",
      noExternalStoreSnapshotError: true,
      scrollbarsPreserved: true,
    }),
  }),
  frozenSubsystems: Object.freeze([
    "object_panel_safe_zone_contract",
    "object_panel_safe_zone_runtime",
    "timeline_zone_contract",
    "timeline_zone_runtime",
    "hud_zone_contract_audit",
    "scene_hud_zone_layout_enforcement",
    "hud_overlap_diagnostics",
    "hud_debounce_strategy",
    "object_click_panel_dedup_contract",
    "object_click_panel_dedup_runtime",
  ] as const),
  notFrozen: Object.freeze([
    "visual_polish",
    "final_panel_styling",
    "content_design",
    "advanced_timeline_features",
    "object_panel_content_design",
    "future_war_room_overlays",
    "final_theme_polish",
  ] as const),
  invariants: Object.freeze([
    "no_visible_object_panel_mrp_overlap_at_supported_widths",
    "no_visible_timeline_object_panel_overlap",
    "no_visible_timeline_scene_panel_overlap",
    "no_duplicate_hud_owners",
    "no_zero_size_active_hud_hosts",
    "no_repeated_hud_layout_writes_for_same_signature",
    "hud_zone_brake_never_spams_same_signature",
    "object_selection_does_not_cause_timeline_layout_loop",
    "resize_recomputes_zones_without_animation",
    "object_click_single_panel_authority_write_maximum",
    "no_idle_time_object_click_replay",
    "no_duplicate_object_click_dashboard_redirect",
  ] as const),
  extensionPolicy:
    "No HUD layout or zone ownership changes until visual polish phase unless an explicit freeze override is approved.",
} as const);

export type HudRuntimeFreezeZoneId =
  | "scenePanel"
  | "objectPanel"
  | "timeline"
  | "mrp"
  | "assistant"
  | "floatingOverlay"
  | "topControls"
  | "commandDock";

export type HudRuntimeFreezeStatus = "pass" | "warning" | "fail";

export const HUD_RUNTIME_FREEZE_ZONE_IDS: readonly HudRuntimeFreezeZoneId[] = Object.freeze([
  "scenePanel",
  "objectPanel",
  "timeline",
  "mrp",
  "assistant",
  "floatingOverlay",
  "topControls",
  "commandDock",
]);

export const HUD_SUPPORTED_MIN_VIEWPORT_WIDTH_PX = 768;

export function isHudRuntimeFrozen(): boolean {
  return true;
}
