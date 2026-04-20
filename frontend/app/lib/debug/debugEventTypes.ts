/**
 * Dev-only self-debug: canonical event contract for Nexora internal observability.
 * Not used by production product logic.
 */

export type DebugLayer =
  | "chat"
  | "intent"
  | "router"
  | "panel"
  | "shell"
  | "host"
  | "scene"
  | "contract"
  | "post_success";

export type DebugEventType =
  | "cta_clicked"
  | "panel_requested"
  | "panel_resolved"
  | "panel_rendered"
  | "panel_fallback_used"
  | "panel_reset_detected"
  | "shell_section_resolved"
  | "subtab_clicked"
  | "subtab_resolved"
  | "scene_update_requested"
  | "scene_update_applied"
  | "scene_overwrite_blocked"
  | "contract_validation_failed"
  | "post_success_invalidation"
  | "debug_warning"
  | "chat_submitted"
  | "chat_request_started"
  | "chat_intent_detected"
  | "chat_action_extracted"
  | "chat_panel_request"
  | "chat_scene_request"
  | "chat_response_completed"
  | "chat_noop_result"
  | "chat_error"
  | "chat_local_shortcut"
  /** Dev-only guard rail: non-blocking early warning (see `debugGuardRails`). */
  | "guard_warning"
  /** Dev-only guard rail: higher-severity pattern (still non-blocking). */
  | "guard_critical";

export type DebugEventStatus = "ok" | "info" | "warn" | "error" | "blocked";

/** High-level emitter domain for global loop protection and filtering (see `debugEventGuard`). */
export type DebugEventOrigin =
  | "system"
  | "chat"
  | "router"
  | "scene"
  | "panel"
  | "debug_inspector"
  | "render_cycle"
  | "unknown";

export type DebugEvent = {
  id: string;
  timestamp: number;
  type: DebugEventType;
  layer: DebugLayer;
  /** Canonical domain; inferred from `layer` when omitted at emit time (defaults to `unknown` if unmappable). */
  origin: DebugEventOrigin;
  /** Short emitter id, e.g. "HomeScreen", "RightPanelHost". */
  source: string;
  status: DebugEventStatus;
  message: string;
  /** Emitter-defined fields (metrics, paths, etc.). */
  metadata: Record<string, unknown>;
  correlationId?: string | null;
};

export type DebugEventInput = Omit<DebugEvent, "id" | "timestamp" | "origin"> &
  Partial<Pick<DebugEvent, "id" | "timestamp" | "correlationId" | "origin">>;
