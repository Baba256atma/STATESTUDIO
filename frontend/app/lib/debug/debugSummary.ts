/**
 * Dev-only strategic summaries on top of deterministic diagnosis — no LLM, no product logic.
 */

import type { SelfDebugDiagnosis } from "./debugDiagnosis";
import type { DebugEvent, DebugLayer } from "./debugEventTypes";

export type SummaryWhere = DebugLayer | "multiple";

export type SummaryKeyEvent = {
  type: string;
  layer: string;
  message: string;
};

export type StrategicDebugSummary = {
  headline: string;
  what_happened: string;
  why_it_happened: string;
  where_it_failed: SummaryWhere;
  confidence: "high" | "medium" | "low";
  key_events: SummaryKeyEvent[];
  recommended_next_check: string;
  /** Stable template id used for this summary (for tests / docs). */
  template_key: string;
};

function diagnosisTemplateKey(d: SelfDebugDiagnosis): string {
  const { id } = d;
  const pairs: Array<[string, string]> = [
    ["panel-open-but-fallback-", "panel_open_but_fallback"],
    ["subtab-mismatch-", "subtab_mismatch"],
    ["scene-drop-", "scene_drop"],
    ["chat-incomplete-", "chat_incomplete"],
    ["chat-intent-no-panel-req-", "chat_intent_no_panel_req"],
    ["chat-panel-no-render-legacy-", "chat_panel_no_render_legacy"],
    ["chat-panel-no-render-", "chat_panel_no_render"],
    ["chat-panel-blocked-", "chat_panel_blocked"],
    ["chat-scene-no-apply-legacy-", "chat_scene_no_apply_legacy"],
    ["chat-scene-no-apply-", "chat_scene_no_apply"],
    ["chat-unexpected-noop-", "chat_unexpected_noop"],
    ["chat-empty-effect-", "chat_empty_effect"],
  ];
  for (const [prefix, key] of pairs) {
    if (id.startsWith(prefix)) return key;
  }
  if (id === "host-requested-vs-rendered") return "host_mismatch";
  if (id === "shell-upstream-section-drift") return "shell_upstream_drift";
  if (id === "contract-failed-then-render") return "contract_failed_then_render";
  if (id === "fallback-churn") return "fallback_churn";
  if (id === "post-success-context") return "post_success_context";
  if (id === "chat-repeated-errors") return "chat_repeated_errors";
  return "unknown";
}

function eventToKeyEvent(e: DebugEvent): SummaryKeyEvent {
  return {
    type: e.type,
    layer: e.layer,
    message: e.message.length > 120 ? `${e.message.slice(0, 117)}…` : e.message,
  };
}

function buildKeyEvents(diagnosis: SelfDebugDiagnosis, events: DebugEvent[], max = 6): SummaryKeyEvent[] {
  const byId = new Map(events.map((e) => [e.id, e]));
  const out: SummaryKeyEvent[] = [];
  const seenIds = new Set<string>();
  for (const sid of diagnosis.supportingEventIds) {
    const ev = byId.get(sid);
    if (ev) {
      seenIds.add(ev.id);
      out.push(eventToKeyEvent(ev));
    }
    if (out.length >= max) return out;
  }
  const want = Math.min(max, Math.max(3, diagnosis.supportingEventIds.length || 3));
  const tail = events.slice(-20);
  for (let i = tail.length - 1; i >= 0 && out.length < want; i--) {
    const ev = tail[i];
    if (seenIds.has(ev.id)) continue;
    seenIds.add(ev.id);
    out.push(eventToKeyEvent(ev));
  }
  return out.slice(0, max);
}

function whereFrom(diagnosis: SelfDebugDiagnosis): SummaryWhere {
  return diagnosis.layer === "multiple" ? "multiple" : (diagnosis.layer as SummaryWhere);
}

type Template = {
  headline: string;
  what_happened: string;
  why_it_happened: string;
  recommended_next_check: string;
};

const TEMPLATES: Record<string, (d: SelfDebugDiagnosis) => Template> = {
  host_mismatch: () => ({
    headline: "Panel state and host render disagree",
    what_happened:
      "The right rail host rendered a different panel identity than the panel state requested. That split usually shows up as flicker, wrong content, or a momentary blank.",
    why_it_happened:
      "Something downstream of routing still overrode or diverged from the canonical panel view before paint.",
    recommended_next_check:
      "Compare `rightPanelState.view` to `RightPanelHost` render path and any props that force `viewToRender`; confirm inspector open state.",
  }),

  panel_open_but_fallback: () => ({
    headline: "Panel routing opened, but the host had no target",
    what_happened:
      "Routing accepted an open decision with a concrete view, yet the host fell back to “no panel target.” The chain broke between state commit and host mount.",
    why_it_happened:
      "Open gating, missing view on state, or inspector closed path can leave the host without a renderable target even after a successful resolve.",
    recommended_next_check:
      "Verify `rightPanelState.isOpen` and `view` at host entry; trace `RightPanelHost` early return and portal host continuity.",
  }),

  shell_upstream_drift: () => ({
    headline: "Shell section drifted from the active panel story",
    what_happened:
      "The shell’s active section no longer lines up with the upstream panel view mapping. Subnav and rail can feel “wrong family” or stuck on a default.",
    why_it_happened:
      "Stale inspector context, family-preservation rules, or delayed context dispatch can decouple shell from the true panel view.",
    recommended_next_check:
      "Trace `nexora:inspector-context` and `getSectionForView`; confirm `rightPanelView` updates when the panel changes.",
  }),

  subtab_mismatch: () => ({
    headline: "Subtab selection drifted from what you clicked",
    what_happened:
      "The clicked subtab and the section recorded after resolution diverged outside the allowed same-family cases.",
    why_it_happened:
      "Rail route resolution, event ordering, or a race between shell section and `nexora:open-right-panel` can land on a sibling tab.",
    recommended_next_check:
      "Inspect `resolveRightPanelRailRoute`, `setInspectorSection`, and listeners that reorder `open-right-panel` detail.",
  }),

  scene_drop: () => ({
    headline: "Scene update never completed",
    what_happened:
      "A unified scene reaction was requested, but nothing in the log shows it reaching an applied (or explicitly blocked) outcome in the expected window.",
    why_it_happened:
      "Duplicate signatures, empty reactions, overwrite policy, or chat-correlated skips can drop work before apply.",
    recommended_next_check:
      "Read `scene_update_requested` / `debug_warning` / `scene_overwrite_blocked` in order; confirm `applyUnifiedSceneReaction` early exits.",
  }),

  contract_failed_then_render: () => ({
    headline: "Panel contract failed validation, then still rendered",
    what_happened:
      "Shared panel data failed schema validation and was salvaged, yet a render still occurred—often with thin or misleading content.",
    why_it_happened:
      "Adapters and Zod slices disagree; salvage keeps the app running but hides shape drift until you read the contract log.",
    recommended_next_check:
      "Open `[Nexora][PanelContractInvalid]` console group for paths; align adapter output with `panelDataContract` for the active panel family.",
  }),

  fallback_churn: () => ({
    headline: "Repeated host fallbacks after a successful open",
    what_happened:
      "After an open decision, the host logged multiple fallbacks in quick succession—classic churn, not a single miss.",
    why_it_happened:
      "Resolver empty states, rapid invalidation, or oscillating view/data can repeatedly fail readiness checks.",
    recommended_next_check:
      "Correlate `panel_resolved` with `hasRenderableResolved` on host events; look for contract or data clears between renders.",
  }),

  post_success_context: () => ({
    headline: "Post-success focus or selection was guarded",
    what_happened:
      "After a success path, focus or object context was blocked, preserved, or redirected by post-success guards.",
    why_it_happened:
      "Intentional safety: avoid stealing focus from the user or from an invalid target—but it can look like “chat broke my selection.”",
    recommended_next_check:
      "Trace `tracePostSuccessContextDecision` labels and `ContextGuardBlocked` vs accepted paths for the same turn.",
  }),

  chat_incomplete: () => ({
    headline: "Chat pipeline started but never finished cleanly",
    what_happened:
      "The dev log shows `chat_request_started` without a matching `chat_response_completed` for the same turn.",
    why_it_happened:
      "An exception, abort, or missing `finally` path can strand a turn without a terminal completion event.",
    recommended_next_check:
      "Reproduce with network tab open; confirm `finalizeChatRequest` runs and no silent `return` skips `finally`.",
  }),

  chat_intent_no_panel_req: () => ({
    headline: "Intent aimed at panels, but execution never requested one",
    what_happened:
      "Routing said panels should move, yet no `chat_panel_request` appeared—so execution never surfaced a panel intent to the rest of the chain.",
    why_it_happened:
      "`shouldOpenPanel` / execution flags may have stayed false despite `preferredPanel`, or an early branch short-circuited.",
    recommended_next_check:
      "Inspect `executeNexoraAction` result for `shouldOpenPanel` and `preferredPanel` right after intent.",
  }),

  chat_panel_no_render: () => ({
    headline: "Chat asked for a panel change; the host never confirmed render",
    what_happened:
      "A `chat_panel_request` fired, but no host event carried the same chat correlation—so the UI never “closed the loop” in the debug trace.",
    why_it_happened:
      "Inspector closed, gating, or host emit without chat linkage (older logs) can break correlation even when something painted.",
    recommended_next_check:
      "Confirm `panel_rendered` includes `chatCorrelationId`; open inspector and retry the same prompt.",
  }),

  chat_panel_no_render_legacy: () => ({
    headline: "Chat panel signal without a nearby host render (weak linkage)",
    what_happened:
      "This diagnosis used a short event window only because the chat turn lacked correlation metadata on host events.",
    why_it_happened:
      "Older captures or non-chat panel paths won’t carry `chatCorrelationId` on `panel_rendered`.",
    recommended_next_check:
      "Re-run on current build; prefer traces where host events include chat correlation.",
  }),

  chat_panel_blocked: () => ({
    headline: "Chat-driven panel open was blocked by the controller",
    what_happened:
      "After the chat path requested a panel update, `panel_resolved` returned a block with the same chat correlation.",
    why_it_happened:
      "Locks, preserve rules, same-context no-ops, or object-context requirements can veto an otherwise valid intent.",
    recommended_next_check:
      "Read the block `reason` on `panel_resolved`; compare to click-intent lock and `meaningful_object_panel_preserved`.",
  }),

  chat_scene_no_apply: () => ({
    headline: "Chat expected scene work; nothing correlated applied",
    what_happened:
      "`chat_scene_request` did not pair with a correlated apply, block, or explicit skip for that chat turn.",
    why_it_happened:
      "Unified reaction may have been empty, duplicate, or applied outside the instrumented path.",
    recommended_next_check:
      "Search the same correlation for `scene_update_requested` and `debug_warning` reaction_empty / duplicate.",
  }),

  chat_scene_no_apply_legacy: () => ({
    headline: "Chat scene signal without a clear apply (window-only)",
    what_happened:
      "Scene linkage used a time window because the turn lacked full chat correlation on scene events.",
    why_it_happened:
      "Same as correlated case, but harder to prove—treat as a hint, not proof.",
    recommended_next_check:
      "Upgrade to a correlated repro and re-check `chat_scene_request` → `scene_update_applied`.",
  }),

  chat_unexpected_noop: () => ({
    headline: "Chat expected backend work but landed in a no-op fallback",
    what_happened:
      "Intent required the backend, yet the turn ended in `chat_noop_result`—reply only, no payload-driven effects.",
    why_it_happened:
      "Execution may have errored softly, been preempted by local routing, or never received a usable backend payload.",
    recommended_next_check:
      "Inspect `chat_action_extracted` for `hasBackendPayload` and errors; verify network and `executeNexoraAction` branches.",
  }),

  chat_repeated_errors: () => ({
    headline: "Multiple chat errors in recent history",
    what_happened:
      "At least two `chat_error` events appeared close together—stability or environment issue more than a single bad prompt.",
    why_it_happened:
      "Timeouts, backend 5xx, or repeated aborts surface the same user-visible failure path.",
    recommended_next_check:
      "Check API health, timeout config, and whether overlapping sends abort each other.",
  }),

  chat_empty_effect: () => ({
    headline: "Chat succeeded but left no panel or scene footprint",
    what_happened:
      "The turn completed successfully while intent claimed UI or scene impact—yet no panel request, scene request, or apply appeared in the correlated chain.",
    why_it_happened:
      "Explain-only replies, dropped effects, or intent flags that didn’t translate into execution flags.",
    recommended_next_check:
      "Compare `chat_intent_detected` flags to `chat_action_extracted`; confirm `shouldAffectPanels` / scene mutation actually drive execution.",
  }),

  unknown: (d: SelfDebugDiagnosis) => ({
    headline: d.title.length > 72 ? `${d.title.slice(0, 69)}…` : d.title,
    what_happened:
      d.explanation.length > 280 ? `${d.explanation.slice(0, 277)}…` : d.explanation,
    why_it_happened:
      "This pattern is not mapped to a dedicated narrative yet—the raw diagnosis text above is the source of truth.",
    recommended_next_check:
      "Use the event chain and diagnosis id to extend `debugSummary` templates if this repeats in your workflow.",
  }),
};

function pickTemplate(key: string): (d: SelfDebugDiagnosis) => Template {
  return TEMPLATES[key] ?? TEMPLATES.unknown;
}

/**
 * Build a single strategic summary from the primary (highest-priority) diagnosis.
 */
export function buildStrategicDebugSummary(
  events: DebugEvent[],
  diagnoses: SelfDebugDiagnosis[]
): StrategicDebugSummary {
  if (!diagnoses.length) {
    const tail = events.slice(-4).map(eventToKeyEvent);
    const lastEv = events.length > 0 ? events[events.length - 1] : null;
    const whereFallback = (lastEv?.layer as SummaryWhere | undefined) ?? "chat";
    return {
      headline: "No deterministic failure pattern matched",
      what_happened:
        tail.length > 0
          ? "Recent activity is visible in the log, but nothing in the current window tripped a rule-based diagnosis."
          : "There is not enough recent debug data to characterize a failure yet.",
      why_it_happened:
        "Either the scenario is healthy, outside the tuned rules, or you need a longer repro before patterns emerge.",
      where_it_failed: whereFallback,
      confidence: "low",
      key_events: tail.slice(0, 6),
      recommended_next_check:
        "Reproduce the issue, then re-open Self-Debug; if it persists, capture the raw chain and consider adding a diagnosis rule.",
      template_key: "no_diagnosis",
    };
  }

  const primary = diagnoses[0];
  const key = diagnosisTemplateKey(primary);
  const body = pickTemplate(key)(primary);

  return {
    headline: body.headline,
    what_happened: body.what_happened,
    why_it_happened: body.why_it_happened,
    where_it_failed: whereFrom(primary),
    confidence: primary.confidence,
    key_events: buildKeyEvents(primary, events),
    recommended_next_check: body.recommended_next_check,
    template_key: key,
  };
}

/*
 * Example outputs (illustrative — actual strings come from templates above):
 *
 * Panel failure (host_mismatch):
 *   headline: "Panel state and host render disagree"
 *   what_happened: "The right rail host rendered..."
 *
 * Chat no-op (chat_unexpected_noop):
 *   headline: "Chat expected backend work but landed in a no-op fallback"
 *
 * Scene drop (scene_drop):
 *   headline: "Scene update never completed"
 *
 * Subtab mismatch (subtab_mismatch):
 *   headline: "Subtab selection drifted from what you clicked"
 */
