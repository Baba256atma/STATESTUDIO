/**
 * MRP:11:2:8 — Final chat-first Assistant freeze contract.
 *
 * Freezes the completed MRP:11 Assistant UX stack before HUD zoning (MRP_HUD:10:1).
 */

import { CHAT_FIRST_ASSISTANT_FREEZE_V1 } from "./assistantRuntimeFreezeContract.ts";

export const CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1 = Object.freeze({
  id: "CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1",
  version: "1.0.0",
  supersedes: CHAT_FIRST_ASSISTANT_FREEZE_V1.id,
  frozenAt: "MRP:11:2:8",
  architecture: Object.freeze({
    assistantTab: "chat_first_integrated_main_right_panel_assistant_tab",
    chatHost: "executive_assistant_host_portal",
    intelligenceCards: "compact_horizontal_briefing_strip_max_4",
    suggestedQuestions: "executive_questions_support_panel",
    accordion: "single_open_support_panel_runtime",
    iconDock: "vertical_icon_dock_restores_single_panel",
    scrollContainers: "per_panel_scroll_container_with_hidden_collapsed_scrollbar",
    readingComfort: "adaptive_rail_width_and_reading_tokens",
    contextBridge: "read_only_dashboard_to_assistant_context_sync",
    dashboardBoundary: "main_right_panel_shell_tab_isolation",
  }),
  frozenSubsystems: Object.freeze([
    "chat_first_layout",
    "intelligence_cards_compact_zone",
    "suggested_questions_runtime",
    "support_accordion_runtime",
    "icon_dock_runtime",
    "scroll_container_behavior",
    "reading_comfort_tokens",
    "dashboard_assistant_boundary",
  ] as const),
  invariants: Object.freeze([
    ...CHAT_FIRST_ASSISTANT_FREEZE_V1.invariants,
    "intelligence_cards_remain_compact_max_124px",
    "intelligence_cards_max_four_cards",
    "chat_input_and_conversation_remain_primary",
    "dashboard_tab_does_not_mount_assistant_chat_host",
    "assistant_tab_does_not_mount_dashboard_home_surface",
    "object_context_updates_are_signature_deduped",
    "dom_listeners_skip_null_targets",
    "stability_gate_emits_once_per_session",
    "no_repeated_external_store_snapshot_allocation",
  ] as const),
  extensionPolicy:
    "No Assistant UX changes until MRP_HUD:10:1 unless an explicit freeze override is approved.",
} as const);

export type ChatFirstAssistantFinalFreezeId = typeof CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1.id;

export type AssistantFinalFreezeSubsystem =
  (typeof CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1.frozenSubsystems)[number];

export function isChatFirstAssistantFinalFrozen(): boolean {
  return true;
}
