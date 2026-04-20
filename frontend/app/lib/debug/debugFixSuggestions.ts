/**
 * Dev-only, deterministic “what to inspect next” hints — no auto-fix, no product side effects, no LLM.
 * Maps strategic summary `template_key` (aligned with primary diagnosis) to safe developer guidance.
 */

import type { SelfDebugDiagnosis } from "./debugDiagnosis";
import type { DebugEvent } from "./debugEventTypes";
import type { StrategicDebugSummary } from "./debugSummary";

export type FixSuggestion = {
  title: string;
  why_this_matters: string;
  what_to_check: string;
  where_to_check: string;
  confidence: "high" | "medium" | "low";
};

const MAX_SUGGESTIONS = 4;

type Row = FixSuggestion;

const BY_TEMPLATE: Record<string, Row[]> = {
  host_mismatch: [
    {
      title: "Verify RightPanelHost render conditions",
      why_this_matters:
        "The host is the final render authority; if it disagrees with panel state, symptoms show up here first.",
      what_to_check:
        "Trace `viewToRender` vs `props.rightPanelState.view` and any path that rewrites the effective view before paint.",
      where_to_check:
        "`frontend/app/components/right-panel/RightPanelHost.tsx`, host warning metadata from the correlation bridge.",
      confidence: "high",
    },
    {
      title: "Compare `rightPanelState.view` to what the user expects",
      why_this_matters: "Routing may be correct while stale or overridden state still drives the rail.",
      what_to_check:
        "Inspect `setRightPanelState` / `applyPanelControllerRequest` decisions immediately before the mismatch event.",
      where_to_check: "`frontend/app/screens/HomeScreen.tsx` (panel controller, `requestRightPanelOpen`).",
      confidence: "high",
    },
    {
      title: "Check portal / inspector host resolution",
      why_this_matters:
        "A missing or recycled DOM host can make the panel appear wrong even when React state looks fine.",
      what_to_check:
        "Confirm the inspector portal target exists and matches `activeInspectorHostId` when the issue fires.",
      where_to_check: "`HomeScreen.tsx` (inspector portal, `RightPanelHost` mount).",
      confidence: "medium",
    },
  ],

  panel_open_but_fallback: [
    {
      title: "Inspect host target resolution after an open decision",
      why_this_matters: "Open + no target means the chain broke between controller output and host props.",
      what_to_check:
        "`rightPanelState.isOpen`, `rightPanelState.view`, and early returns in `RightPanelHost` (e.g. closed inspector).",
      where_to_check: "`RightPanelHost.tsx`, `HomeScreen.tsx` (panel state + open gating).",
      confidence: "high",
    },
    {
      title: "Check whether panel data is renderable for the resolved view",
      why_this_matters: "Resolver-managed views can fall back when merged data is empty or fails readiness checks.",
      what_to_check:
        "`hasRenderableResolvedPanelData`, `buildPanelResolvedData`, and contract validation logs for the active view.",
      where_to_check: "`RightPanelHost.tsx`, `panelDataContract.ts`, `buildPanelResolvedData` path.",
      confidence: "medium",
    },
    {
      title: "Review guarded fallback branches",
      why_this_matters: "Fallback is intentional protection; you need to see which branch fired and why.",
      what_to_check: "`panel_fallback_used` metadata and nearby `panel_resolved` / `chatCorrelationId` linkage in self-debug.",
      where_to_check: "`RightPanelHost.tsx` (`RightPanelFallback`), `debugDiagnosis.ts` (panel-open-but-fallback rule).",
      confidence: "medium",
    },
  ],

  chat_unexpected_noop: [
    {
      title: "Inspect `chat_action_extracted` for the same turn",
      why_this_matters: "Execution flags tell you whether backend work was supposed to run and what actually ran.",
      what_to_check: "`hasBackendPayload`, `ok`, `errors`, and `executedSteps` on the execution result in the event metadata.",
      where_to_check: "`HomeScreen.tsx` (`sendText` / `executeNexoraAction` handling), `actionExecutionLayer.ts`.",
      confidence: "high",
    },
    {
      title: "Verify backend response and network",
      why_this_matters: "A failed or empty response often collapses into a fallback reply without throwing loudly.",
      what_to_check: "Network tab, response body shape, and `chat_error` / backend error events in the same correlation window.",
      where_to_check: "`HomeScreen.tsx` (backend branch), API client used by `chatToBackend`.",
      confidence: "high",
    },
    {
      title: "Re-read intent flags (`shouldCallBackend`)",
      why_this_matters: "If intent never asked for backend, a “no-op” outcome may be logically consistent.",
      what_to_check: "`chat_intent_detected` metadata vs `chat_noop_result` for the same `correlationId`.",
      where_to_check: "`intentRouter.ts`, `HomeScreen.tsx` (`resolveNexoraIntentRoute` usage).",
      confidence: "medium",
    },
  ],

  scene_drop: [
    {
      title: "Compare `scene_update_requested` to `scene_update_applied`",
      why_this_matters: "The gap between them is exactly where reactions are skipped, blocked, or deduped.",
      what_to_check: "Same chat correlation on both events; look for `debug_warning` reaction_empty / duplicate between them.",
      where_to_check: "`HomeScreen.tsx` (`applyUnifiedSceneReaction`), `debugDiagnosis.ts` (scene-drop rule).",
      confidence: "high",
    },
    {
      title: "Inspect reaction / scene mutation policy",
      why_this_matters: "Policy can downgrade full updates to highlights or block replacements without a hard error.",
      what_to_check: "`allowSceneReplacement`, `scene_overwrite_blocked`, and `appliedSceneMutation` in execution + scene events.",
      where_to_check: "`actionExecutionLayer.ts`, `unifiedReaction.ts` / `reactionNormalizer.ts`.",
      confidence: "medium",
    },
    {
      title: "Verify overwrite guard behavior",
      why_this_matters: "Guards prevent destructive scene swaps; they also explain “requested but not applied.”",
      what_to_check: "Events with `scene_overwrite_blocked` and metadata on the same turn as `chat_scene_request`.",
      where_to_check: "`HomeScreen.tsx` (unified reaction options), self-debug scene events.",
      confidence: "medium",
    },
  ],

  subtab_mismatch: [
    {
      title: "Check tab → view mapping (rail router)",
      why_this_matters: "Wrong `resolvedView` early guarantees a mismatch with what the shell shows.",
      what_to_check: "`resolveRightPanelRailRoute(tab.eventTab)` output vs the tab you clicked.",
      where_to_check: "`rightPanelRouter.ts`, `NexoraShell.tsx` (subtab onClick).",
      confidence: "high",
    },
    {
      title: "Inspect `setInspectorSection` and dispatched events",
      why_this_matters:
        "Ordering between section state, `nexora:inspector-section-changed`, and `nexora:open-right-panel` can drift.",
      what_to_check: "Self-debug `subtab_clicked` / `subtab_resolved` pair and `shell_section_resolved` for the same interaction.",
      where_to_check: "`NexoraShell.tsx` (`setInspectorSection`).",
      confidence: "high",
    },
    {
      title: "Verify alias / normalization for event tabs",
      why_this_matters: "Legacy tab strings that normalize differently than UI labels produce “first click wrong” bugs.",
      what_to_check: "Event tab string on the button vs `mapLegacyTabToRightPanelView` / inspector tab types.",
      where_to_check: "`rightPanelRouter.ts`, `rightPanelTypes.ts`, `NexoraShell.tsx` (tab config).",
      confidence: "medium",
    },
  ],

  shell_upstream_drift: [
    {
      title: "Trace inspector context into NexoraShell",
      why_this_matters:
        "Shell section is derived from upstream `rightPanelView`; stale context collapses subnav to the wrong family.",
      what_to_check: "`nexora:inspector-context` payload and `resolvedActiveSection` vs `getSectionForView(upstreamRightPanelView)`.",
      where_to_check: "`NexoraShell.tsx`, `HomeScreen.tsx` (context dispatch effect).",
      confidence: "high",
    },
    {
      title: "Confirm family-preservation rules",
      why_this_matters: "Same-family preservation is intentional but can mask upstream changes if mis-tuned.",
      what_to_check: "`resolvedActiveSection` useMemo branches (risk/risk_flow, objects/focus, etc.).",
      where_to_check: "`NexoraShell.tsx`.",
      confidence: "medium",
    },
  ],

  contract_failed_then_render: [
    {
      title: "Inspect salvaged panel slices in the contract log",
      why_this_matters: "Salvage keeps the UI alive but drops or reshapes fields the panel needs.",
      what_to_check: "Console `[Nexora][PanelContractInvalid]` / `[Nexora][PanelContractSalvaged]` for rejected slices.",
      where_to_check: "`panelDataContract.ts`, adapters under `lib/panels/`.",
      confidence: "high",
    },
    {
      title: "Align adapter output with the active panel family",
      why_this_matters: "Schema drift shows up as empty panels even though something “rendered.”",
      what_to_check: "Expected shape for the current `RightPanelView` vs normalized payload keys.",
      where_to_check: "`buildPanelResolvedData`, `panelDataAdapter.ts`, panel-specific builders.",
      confidence: "medium",
    },
  ],

  fallback_churn: [
    {
      title: "Correlate repeated `panel_fallback_used` with resolver readiness",
      why_this_matters: "Churn usually means data or view oscillation, not a single bad click.",
      what_to_check: "`hasRenderableResolved` on host events and rapid `panel_resolved` / `panel_requested` pairs.",
      where_to_check: "`RightPanelHost.tsx`, `HomeScreen.tsx` (data visibility / `visibleResponseData`).",
      confidence: "medium",
    },
  ],

  post_success_context: [
    {
      title: "Review post-success focus guards",
      why_this_matters: "Guards protect UX but can look like chat “reset” your selection.",
      what_to_check: "`tracePostSuccessContextDecision` / `post_success_invalidation` events and `ContextGuardBlocked` paths.",
      where_to_check: "`HomeScreen.tsx` (`syncFocusedObjectFromResponse`, post-success handlers).",
      confidence: "medium",
    },
  ],

  chat_incomplete: [
    {
      title: "Ensure chat `finally` always records completion",
      why_this_matters: "Missing `chat_response_completed` usually means an abnormal exit from the pipeline.",
      what_to_check: "Unhandled throw between `chat_request_started` and `finalizeChatRequest`; stale request aborts.",
      where_to_check: "`HomeScreen.tsx` (`sendText` try/catch/finally).",
      confidence: "high",
    },
  ],

  chat_intent_no_panel_req: [
    {
      title: "Trace `shouldOpenPanel` from execution result",
      why_this_matters: "Intent can advertise a panel while execution never sets the open flag.",
      what_to_check: "`executeNexoraAction` result fields vs `chat_panel_request` emission conditions in `sendText`.",
      where_to_check: "`actionExecutionLayer.ts`, `HomeScreen.tsx`.",
      confidence: "high",
    },
  ],

  chat_panel_no_render: [
    {
      title: "Confirm host events carry `chatCorrelationId`",
      why_this_matters: "Without linkage, diagnosis cannot prove the host ran for that chat turn.",
      what_to_check: "`panel_rendered` / `panel_fallback_used` metadata after correlation hardening; inspector open state.",
      where_to_check: "`RightPanelHost.tsx`, `debugCorrelationBridge.ts`.",
      confidence: "high",
    },
    {
      title: "Retry with inspector open",
      why_this_matters: "Host returns null when the rail is collapsed, which can look like a missing render.",
      what_to_check: "`rightPanelState.isOpen` and `RightPanelHost` early return when closed.",
      where_to_check: "`RightPanelHost.tsx`, shell inspector toggles in `NexoraShell.tsx`.",
      confidence: "medium",
    },
  ],

  chat_panel_no_render_legacy: [
    {
      title: "Reproduce on current build with correlation enabled",
      why_this_matters: "Legacy diagnosis used timing windows; explicit metadata is more trustworthy.",
      what_to_check: "Upgrade trace and compare `chatCorrelationId` on host vs chat events.",
      where_to_check: "Self-debug event list, `debugDiagnosis.ts` (chat panel rules).",
      confidence: "low",
    },
  ],

  chat_panel_blocked: [
    {
      title: "Read `panel_resolved` block reason",
      why_this_matters: "The controller encodes the precise policy that vetoed the open.",
      what_to_check: "`reason` and `decisionKind` on the blocked event; click-intent lock TTL.",
      where_to_check: "`panelController.ts`, `HomeScreen.tsx` (`applyPanelControllerRequest`).",
      confidence: "high",
    },
  ],

  chat_scene_no_apply: [
    {
      title: "Find reaction skip warnings in the same correlation",
      why_this_matters: "Empty or duplicate reactions explain missing applies without backend involvement.",
      what_to_check: "`debug_warning` with `reaction_empty` / `reaction_duplicate` and matching `chatCorrelationId`.",
      where_to_check: "`HomeScreen.tsx` (`applyUnifiedSceneReaction`).",
      confidence: "high",
    },
  ],

  chat_scene_no_apply_legacy: [
    {
      title: "Prefer a correlated repro",
      why_this_matters: "Window-only linkage can implicate the wrong turn.",
      what_to_check: "Same `chatCorrelationId` on `chat_scene_request` and scene events.",
      where_to_check: "`debugDiagnosis.ts`, `applyUnifiedSceneReaction` emits.",
      confidence: "low",
    },
  ],

  chat_repeated_errors: [
    {
      title: "Stabilize environment before chasing code",
      why_this_matters: "Repeated `chat_error` often indicates API, timeout, or double-submit issues.",
      what_to_check: "HTTP status, abort controllers, overlapping `sendText` calls.",
      where_to_check: "`HomeScreen.tsx` (active chat request ref, timeout), network panel.",
      confidence: "high",
    },
  ],

  chat_empty_effect: [
    {
      title: "Diff intent flags from execution outcome",
      why_this_matters: "Explains why a “successful” chat left no panel/scene footprint.",
      what_to_check: "`shouldAffectPanels` / `shouldAffectScene` vs `chat_panel_request` / `chat_scene_request` in the chain.",
      where_to_check: "`HomeScreen.tsx`, `intentRouter.ts`, `actionExecutionLayer.ts`.",
      confidence: "medium",
    },
  ],

  no_diagnosis: [
    {
      title: "Widen the repro or capture more events",
      why_this_matters: "Rules only fire on known patterns; intermittent issues may sit outside the last 120 events.",
      what_to_check: "Clear log, reproduce once, then inspect full chain and correlation ids.",
      where_to_check: "`debugEventStore.ts` cap, `debugDiagnosis.ts` window size.",
      confidence: "low",
    },
    {
      title: "Add a targeted diagnosis if this repeats",
      why_this_matters: "Repeated blind spots deserve a new deterministic rule, not guesswork.",
      what_to_check: "Stable event sequence across failures; propose a rule in `debugDiagnosis.ts`.",
      where_to_check: "`debugDiagnosis.ts`, `debugSummary.ts` / `debugFixSuggestions.ts` templates.",
      confidence: "low",
    },
  ],

  unknown: [
    {
      title: "Start from the raw diagnosis title and explanation",
      why_this_matters: "Unmapped rules still carry accurate machine-readable detail.",
      what_to_check: "Supporting event ids and layers on the diagnosis row in the inspector.",
      where_to_check: "`debugDiagnosis.ts` (rule that produced this id), linked source files by layer.",
      confidence: "medium",
    },
    {
      title: "Extend `debugFixSuggestions` mapping if this id repeats",
      why_this_matters: "Turns one-off investigation into repeatable guidance for the team.",
      what_to_check: "Stable `diagnosis.id` prefix; add a template bucket with safe inspection steps.",
      where_to_check: "`debugFixSuggestions.ts`.",
      confidence: "low",
    },
  ],
};

/**
 * Deterministic suggestions keyed by `summary.template_key` (same normalization as strategic summary).
 * `diagnosis` and `events` are accepted for API stability and light future context; they do not mutate state.
 */
export function buildFixSuggestions(
  summary: StrategicDebugSummary,
  diagnosis: SelfDebugDiagnosis | null,
  _events: DebugEvent[],
): FixSuggestion[] {
  void diagnosis;
  void _events;
  const rows = BY_TEMPLATE[summary.template_key] ?? BY_TEMPLATE.unknown;
  return rows.slice(0, MAX_SUGGESTIONS);
}
