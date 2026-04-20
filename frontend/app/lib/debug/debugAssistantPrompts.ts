/**
 * Static copy for the dev-only internal assistant — no LLM, no runtime prompts to external services.
 */

export const DEV_ASSISTANT_INTENT_LABELS = {
  current_issue: "Current Issue",
  failure_layer: "Where It Failed",
  next_checks: "Next Checks",
  supporting_chain: "Supporting Chain",
  root_cause_plain: "Root Cause (plain)",
  guard_alerts: "Guard Alerts",
  investigation_plan: "Investigation Plan",
} as const;

/** Short numbered plans keyed like `StrategicDebugSummary.template_key`. */
export const INVESTIGATION_PLAN_BY_TEMPLATE: Record<string, string[]> = {
  host_mismatch: [
    "Open `RightPanelHost.tsx` and compare `viewToRender` to `rightPanelState.view` at the time of the host mismatch event.",
    "In `HomeScreen.tsx`, trace `applyPanelControllerRequest` and `setRightPanelState` for the same panel correlation id.",
    "Confirm inspector / portal mount: a missing host element can look like a routing bug.",
    "Re-run once with Self-Debug open and compare `panel_rendered` metadata to `panel_resolved`.",
  ],
  panel_open_but_fallback: [
    "Verify `rightPanelState.isOpen` and `view` when `panel_fallback_used` fires — host early-return paths matter.",
    "Read `panel_resolved` → `panel_rendered` ordering for the same `panelCorrelationId` / `chatCorrelationId`.",
    "Check `hasRenderableResolvedPanelData` / contract logs for the resolved family.",
    "If chat-linked, confirm `registerPanelSelfDebugLink` ran before host emit (correlation bridge).",
  ],
  chat_unexpected_noop: [
    "Open `chat_action_extracted` for the turn: `hasBackendPayload`, errors, `executedSteps`.",
    "Compare `chat_intent_detected.shouldCallBackend` to the noop outcome on the same correlation id.",
    "Inspect network / backend response shape in `HomeScreen` `sendText` path.",
    "If intent-only, confirm that is expected before treating it as a defect.",
  ],
  scene_drop: [
    "Align `scene_update_requested` → `scene_update_applied` (or `scene_overwrite_blocked`) on the same chat id.",
    "Search `debug_warning` with `reaction_empty` / `reaction_duplicate` between request and apply.",
    "Review `applyUnifiedSceneReaction` options: `allowSceneReplacement`, overwrite policy.",
    "Capture one more repro with a single chat turn to avoid cross-turn bleed in the log.",
  ],
  subtab_mismatch: [
    "Compare `subtab_clicked` vs `subtab_resolved` metadata (`eventTab`, `nextView`) in the event list.",
    "Trace `resolveRightPanelRailRoute` vs `setInspectorSection` in `NexoraShell.tsx`.",
    "Check legacy tab normalization in `rightPanelRouter.ts` if tabs look “almost right”.",
    "Reproduce with inspector open so shell + rail events stay in one window.",
  ],
  shell_upstream_drift: [
    "Trace `nexora:inspector-context` and `resolvedActiveSection` vs upstream `rightPanelView`.",
    "Read family-preservation branches in `NexoraShell.tsx` `resolvedActiveSection` memo.",
    "Confirm `getSectionForView` mapping still matches product tab config.",
  ],
  contract_failed_then_render: [
    "Open console `[Nexora][PanelContractInvalid]` for rejected paths and slices.",
    "Align adapter output with `panelDataContract` for the active `RightPanelView`.",
    "Treat salvage as a signal: UI may render with thin data until contract is fixed.",
  ],
  no_diagnosis: [
    "Clear Self-Debug, reproduce once, then re-read the full tail — intermittent issues need a clean window.",
    "If healthy, no rule will fire; if broken, add a narrow `debugDiagnosis` rule with supporting ids.",
    "Compare last 20 events manually for ordering surprises (abort, stale request, double submit).",
  ],
  chat_panel_no_render: [
    "Confirm `panel_rendered` / `panel_fallback_used` carry `chatCorrelationId` for this turn.",
    "Retry with inspector / rail open — host can short-circuit when the rail is collapsed.",
    "Trace `chat_panel_request` → `panel_resolved` → host emit order for the same ids.",
    "Read `RightPanelHost.tsx` early returns and portal mount assumptions.",
  ],
  chat_panel_blocked: [
    "Open the paired `panel_resolved` block metadata: `reason`, `decisionKind`, chat correlation.",
    "Compare controller locks and `meaningful_object_panel_preserved` with user intent.",
    "Check click-intent TTL vs late chat-driven opens in `panelController.ts`.",
  ],
  chat_scene_no_apply: [
    "Search the same `chatCorrelationId` for `scene_update_requested` then `scene_update_applied` or explicit skips.",
    "Read `debug_warning` with `reaction_empty` / `reaction_duplicate` between them.",
    "Inspect `applyUnifiedSceneReaction` options passed from chat execution.",
  ],
  chat_empty_effect: [
    "Diff `chat_intent_detected` flags vs `chat_action_extracted` for the same correlation id.",
    "Confirm whether the reply was intentionally explain-only vs dropped effects.",
    "Trace `shouldAffectPanels` / scene mutation flags into `executeNexoraAction` results.",
  ],
  chat_incomplete: [
    "Verify `finalizeChatRequest` / `chat_response_completed` always runs in `sendText` finally paths.",
    "Look for aborts, stale request ignores, or exceptions between `chat_request_started` and completion.",
  ],
  fallback_churn: [
    "Correlate `panel_fallback_used` bursts with `panel_resolved` and contract warnings.",
    "Check for rapid invalidations of merged panel data in `HomeScreen` / host readiness.",
  ],
  post_success_context: [
    "Read `post_success_invalidation` and `tracePostSuccessContextDecision` labels for the turn.",
    "Decide whether focus preservation vs promotion is the intended UX outcome.",
  ],
  chat_repeated_errors: [
    "Stabilize API / timeouts before deep-diving — overlapping `sendText` can amplify errors.",
    "Inspect `chat_error` metadata pairs for requestSeq and abort reasons.",
  ],
  unknown: [
    "Start from the primary diagnosis title + explanation in the inspector (source of truth for unmapped ids).",
    "List `supportingEventIds` in order and open each in the raw chain below.",
    "If the id repeats, add a `template_key` + investigation plan entry in `debugAssistantPrompts.ts`.",
  ],
};

export const DEFAULT_INVESTIGATION_PLAN = INVESTIGATION_PLAN_BY_TEMPLATE.unknown;
