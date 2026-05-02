export type PanelSource =
  | "manual_user_nav"
  | "explicit_command"
  | "chat_intent"
  | "object_click"
  | "system_fallback";

export type PanelReason =
  | "analyze_object_success"
  | "executive_object_action"
  | "dashboard_click"
  | "manual_user_nav"
  | "chat_submit_open"
  | "chat_command"
  | "object_click_focus"
  | "object_click_passive"
  | "auto_reopen"
  | "visibility_guard"
  | "panel_close"
  | "unknown";

export function normalizePanelSource(input?: string | null): PanelSource {
  const s = String(input ?? "").toLowerCase();
  if (s.includes("left_nav") || s.includes("right_tab") || s.includes("tab_click") || s.includes("manual")) {
    return "manual_user_nav";
  }
  if (
    s.includes("analyze") ||
    s.includes("sub_button") ||
    s.includes("cta") ||
    s.includes("explicit_command") ||
    s.includes("component_panel") ||
    s.includes("strategic_command") ||
    s.includes("exe_preview") ||
    s.includes("dashboard_preview") ||
    s.includes("decision_strip")
  ) {
    return "explicit_command";
  }
  if (s.includes("chat")) {
    return "chat_intent";
  }
  if (s.includes("object_click") || s.includes("interaction")) {
    return "object_click";
  }
  return "system_fallback";
}

export function normalizePanelReason(input?: string | null): PanelReason {
  const r = String(input ?? "").toLowerCase();
  if (r.includes("dashboard_click")) return "dashboard_click";
  if (r.includes("manual_user_nav")) return "manual_user_nav";
  if (r.includes("analyze")) return "analyze_object_success";
  if (r.includes("executive")) return "executive_object_action";
  if (r.includes("chat_command")) return "chat_command";
  if (r.includes("chat")) return "chat_submit_open";
  if (r.includes("object_click_passive")) return "object_click_passive";
  if (r.includes("object_click")) return "object_click_focus";
  if (r.includes("visibility")) return "visibility_guard";
  if (r.includes("reopen")) return "auto_reopen";
  if (r.includes("close")) return "panel_close";
  return "unknown";
}
