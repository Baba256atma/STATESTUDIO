import type { DebugEvent, DebugEventType, DebugLayer } from "./debugEventTypes";
import type { RightPanelView } from "../ui/right-panel/rightPanelTypes";

export type SelfDebugDiagnosis = {
  id: string;
  title: string;
  layer: DebugLayer | "multiple";
  confidence: "low" | "medium" | "high";
  explanation: string;
  supportingEventIds: string[];
  /** Dev inspector tags, e.g. "chat". */
  tags?: string[];
};

const CHAT_FLOW_EVENT_TYPES: DebugEventType[] = [
  "chat_submitted",
  "chat_request_started",
  "chat_intent_detected",
  "chat_action_extracted",
  "chat_panel_request",
  "chat_scene_request",
  "chat_response_completed",
  "chat_noop_result",
  "chat_error",
  "chat_local_shortcut",
];

function correlationOf(event: DebugEvent): string | null {
  const fromMeta = event.metadata?.chatCorrelationId;
  if (typeof fromMeta === "string" && fromMeta.length > 0) return fromMeta;
  const c = event.correlationId;
  if (typeof c === "string" && c.length > 0) return c;
  return null;
}

/** Chat turn id only (ignores panel correlationId on host/router events). */
function chatTurnIdOf(event: DebugEvent): string | null {
  const fromMeta = event.metadata?.chatCorrelationId;
  if (typeof fromMeta === "string" && fromMeta.length > 0) return fromMeta;
  if (CHAT_FLOW_EVENT_TYPES.includes(event.type)) {
    const c = event.correlationId;
    if (typeof c === "string" && c.startsWith("chat-")) return c;
  }
  return null;
}

function scanForwardExclusive(
  events: DebugEvent[],
  startIdx: number,
  predicate: (e: DebugEvent) => boolean,
  maxHops = 64
): DebugEvent | null {
  for (let k = startIdx + 1; k < events.length && k <= startIdx + maxHops; k++) {
    if (events[k].type === "chat_submitted") break;
    if (predicate(events[k])) return events[k];
  }
  return null;
}

function sceneEventMatchesChatTurn(e: DebugEvent, chatC: string): boolean {
  return chatTurnIdOf(e) === chatC || correlationOf(e) === chatC;
}

export function isChatFlowDebugEvent(event: DebugEvent): boolean {
  return CHAT_FLOW_EVENT_TYPES.includes(event.type);
}

/**
 * Mirrors NexoraShell `getSectionForView` for deterministic diagnosis (keep in sync manually).
 */
function mapPanelViewToShellSection(view: RightPanelView | null): string | null {
  if (!view) return null;
  if (view === "workspace") return "scene";
  if (view === "object") return "focus";
  if (view === "risk" || view === "fragility") return "risk";
  if (view === "explanation") return "explanation";
  if (view === "conflict") return "conflict";
  if (view === "memory") return "memory";
  if (view === "replay") return "replay";
  if (view === "patterns") return "patterns";
  if (view === "opponent") return "opponent";
  if (view === "collaboration") return "collaboration";
  if (view === "dashboard") return "executive";
  if (view === "war_room") return "war_room";
  if (view === "advice") return "advice";
  if (
    view === "timeline" ||
    view === "decision_timeline" ||
    view === "confidence_calibration" ||
    view === "outcome_feedback" ||
    view === "pattern_intelligence" ||
    view === "scenario_tree"
  ) {
    return "timeline";
  }
  if (view === "simulate" || view === "compare") return "timeline";
  return null;
}

function sameShellFamily(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  if (a === "risk" && b === "risk_flow") return true;
  if (a === "risk_flow" && b === "risk") return true;
  const riskFamily = new Set(["risk", "risk_flow", "explanation"]);
  if (riskFamily.has(a) && riskFamily.has(b)) return true;
  if (a === "objects" && b === "focus") return true;
  if (a === "focus" && b === "objects") return true;
  return false;
}

function lastIndexOfType(events: DebugEvent[], type: DebugEventType, beforeIndex: number): number {
  for (let i = Math.min(beforeIndex, events.length - 1); i >= 0; i--) {
    if (events[i].type === type) return i;
  }
  return -1;
}

function collectIds(events: DebugEvent[]): string[] {
  return events.map((e) => e.id);
}

export function runSelfDebugDiagnosis(allEvents: DebugEvent[]): SelfDebugDiagnosis[] {
  const events = allEvents.slice(-120);
  const out: SelfDebugDiagnosis[] = [];

  // Host render mismatch (explicit warning from RightPanelHost)
  const mismatchWarn = [...events].reverse().find((e) => e.type === "debug_warning" && e.metadata?.code === "host_render_mismatch");
  if (mismatchWarn) {
    out.push({
      id: "host-requested-vs-rendered",
      title: "Requested panel view differs from host render target",
      layer: "host",
      confidence: "high",
      explanation:
        "RightPanelHost observed a rendered view that does not match the panel state view. This often correlates with flicker, wrong panel content, or continuity bugs.",
      supportingEventIds: [mismatchWarn.id],
      ...(mismatchWarn.metadata?.chatCorrelationId ? { tags: ["chat"] } : {}),
    });
  }

  // Panel resolved to open but host reports fallback (no target)
  for (let i = events.length - 1; i >= 0; i--) {
    const ev = events[i];
    if (ev.type !== "panel_fallback_used") continue;
    const meta = ev.metadata ?? {};
    if (meta.reason !== "no_panel_target") continue;
    let j = -1;
    const chatEv = typeof meta.chatCorrelationId === "string" ? String(meta.chatCorrelationId) : null;
    if (chatEv) {
      for (let k = i - 1; k >= 0; k--) {
        if (events[k].type !== "panel_resolved") continue;
        if (events[k].metadata?.chatCorrelationId === chatEv) {
          j = k;
          break;
        }
      }
    }
    if (j < 0) j = lastIndexOfType(events, "panel_resolved", i);
    if (j < 0) break;
    const resolved = events[j];
    const kind = resolved.metadata?.decisionKind;
    if (kind === "open" && resolved.metadata?.resolvedView) {
      out.push({
        id: `panel-open-but-fallback-${i}`,
        title: "Panel open decision did not produce a host target",
        layer: "panel",
        confidence: chatEv ? "high" : "medium",
        explanation:
          "Router produced an open decision with a resolved view, but the host later rendered a no-target fallback. Check panel state vs RightPanelHost props and inspector open gating.",
        supportingEventIds: [resolved.id, ev.id],
        ...(chatEv ? { tags: ["chat"] } : {}),
      });
      break;
    }
  }

  // Shell section vs mapped upstream view
  const lastShell = [...events].reverse().find((e) => e.type === "shell_section_resolved");
  if (lastShell) {
    const upstream = lastShell.metadata?.upstreamRightPanelView as RightPanelView | null | undefined;
    const section = lastShell.metadata?.resolvedActiveSection as string | null | undefined;
    const mapped = mapPanelViewToShellSection(upstream ?? null);
    if (upstream && mapped && section && !sameShellFamily(section, mapped)) {
      out.push({
        id: "shell-upstream-section-drift",
        title: "Shell active section disagrees with upstream panel view mapping",
        layer: "shell",
        confidence: "medium",
        explanation:
          "The shell resolved a section that does not match the canonical mapping for the current upstream right-panel view. Often indicates stale inspector context or family-preservation edge cases (e.g. dashboard-only collapse).",
        supportingEventIds: [lastShell.id],
      });
    }
  }

  // Subtab click vs resolved section (non-family)
  for (let i = 1; i < events.length; i++) {
    const cur = events[i];
    if (cur.type !== "subtab_resolved") continue;
    const clicked = events[i - 1];
    if (clicked.type !== "subtab_clicked") continue;
    const tabKey = clicked.metadata?.tabKey as string | null | undefined;
    const section = cur.metadata?.section as string | null | undefined;
    if (tabKey && section && !sameShellFamily(tabKey, section)) {
      out.push({
        id: `subtab-mismatch-${cur.id}`,
        title: "Subtab click target does not match resolved shell section",
        layer: "shell",
        confidence: "medium",
        explanation:
          "The clicked subtab key and the section recorded after resolution differ (outside same-family preservation). Check resolveRightPanelRailRoute and nexora:open-right-panel detail ordering.",
        supportingEventIds: [clicked.id, cur.id],
      });
      break;
    }
  }

  // Scene update requested but not applied — prefer chat-linked scan when possible
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].type !== "scene_update_requested") continue;
    const start = i;
    const reqEv = events[start];
    const chatC = chatTurnIdOf(reqEv);
    let applied = false;
    if (chatC) {
      const hit = scanForwardExclusive(events, start, (e) => e.type === "scene_update_applied" && sceneEventMatchesChatTurn(e, chatC));
      applied = Boolean(hit);
    } else {
      for (let j = i + 1; j < events.length; j++) {
        if (events[j].type === "scene_update_applied") {
          applied = true;
          break;
        }
        if (events[j].type === "chat_submitted") break;
      }
    }
    if (!applied) {
      const slice = events.slice(start, start + 48);
      const blocked = slice.find((e) => e.type === "scene_overwrite_blocked");
      out.push({
        id: `scene-drop-${events[start].id}`,
        title: blocked ? "Scene replacement blocked before apply" : "Scene update requested without apply",
        layer: "scene",
        confidence: blocked ? "high" : chatC ? "medium" : "low",
        explanation: blocked
          ? "A reaction carried scene JSON but replacement was not allowed; highlights may still apply."
          : chatC
            ? "A scene update was requested (chat-correlated) but no matching scene_update_applied followed in the same turn window."
            : "A scene update was requested but no matching applied event was recorded shortly after (skipped, duplicate, or early return).",
        supportingEventIds: collectIds(blocked ? [events[start], blocked] : [events[start]]),
      });
    }
    break;
  }

  // Contract validation failure near panel render
  const contractFail = [...events].reverse().find((e) => e.type === "contract_validation_failed");
  if (contractFail) {
    const failIdx = events.findIndex((e) => e.id === contractFail.id);
    const laterRender = events.slice(failIdx + 1).some((e) => e.type === "panel_rendered");
    if (laterRender) {
      out.push({
        id: "contract-failed-then-render",
        title: "Panel contract validation failed before a render",
        layer: "contract",
        confidence: "high",
        explanation:
          "Shared panel data failed Zod validation and was salvaged. If the UI looks empty or wrong, suspect adapter/schema drift for the active panel family.",
        supportingEventIds: [contractFail.id],
      });
    }
  }

  // Repeated fallbacks after successful open
  const opens = events.filter((e) => e.type === "panel_resolved" && e.metadata?.decisionKind === "open");
  const fallbacks = events.filter((e) => e.type === "panel_fallback_used");
  if (opens.length > 0 && fallbacks.length >= 2) {
    const lastOpen = opens[opens.length - 1];
    const afterOpen = events.filter((e) => e.timestamp >= lastOpen.timestamp);
    const fbAfter = afterOpen.filter((e) => e.type === "panel_fallback_used");
    if (fbAfter.length >= 2) {
      out.push({
        id: "fallback-churn",
        title: "Repeated panel fallbacks after an open decision",
        layer: "host",
        confidence: "low",
        explanation:
          "Multiple fallback renders followed a panel open. Can indicate invalidation churn, resolver empty states, or rapid view oscillation.",
        supportingEventIds: [lastOpen.id, ...fbAfter.slice(-2).map((e) => e.id)],
      });
    }
  }

  // Post-success invalidation / guard
  const postInvalid = [...events].reverse().find((e) => e.type === "post_success_invalidation");
  if (postInvalid) {
    out.push({
      id: "post-success-context",
      title: "Post-success context guard or invalidation fired",
      layer: "post_success",
      confidence: "medium",
      explanation:
        "Focus or selection context was blocked or preserved after a success path. Correlates with unexpected panel or focus resets.",
      supportingEventIds: [postInvalid.id],
    });
  }

  // —— Chat flow (correlationId on chat events; panel events may carry metadata.chatCorrelationId) ——
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].type !== "chat_submitted") continue;
    const c = correlationOf(events[i]);
    if (!c) break;
    const after = events.slice(i + 1);
    const nextSubmitAt = after.findIndex((e) => e.type === "chat_submitted");
    const windowEvents = nextSubmitAt === -1 ? after : after.slice(0, nextSubmitAt);
    const hasCompleted = windowEvents.some((e) => e.type === "chat_response_completed" && correlationOf(e) === c);
    const hasStarted = windowEvents.some((e) => e.type === "chat_request_started" && correlationOf(e) === c);
    const hasLocalShortcut = windowEvents.some((e) => e.type === "chat_local_shortcut" && correlationOf(e) === c);
    if (hasStarted && !hasCompleted && !hasLocalShortcut && windowEvents.length > 2) {
      out.push({
        id: `chat-incomplete-${events[i].id}`,
        title: "Chat pipeline started but no completion was recorded",
        layer: "chat",
        confidence: "medium",
        explanation:
          "A chat_request_started event exists for this turn without a matching chat_response_completed. Often indicates an unhandled throw, a missing finally path, or an aborted request before finalize.",
        supportingEventIds: [events[i].id],
        tags: ["chat"],
      });
    }
    break;
  }

  const lastIntent = [...events].reverse().find((e) => e.type === "chat_intent_detected");
  if (lastIntent) {
    const c = correlationOf(lastIntent);
    const preferredPanel = lastIntent.metadata?.preferredPanel;
    const shouldAffectPanels = lastIntent.metadata?.shouldAffectPanels === true;
    if (c && preferredPanel && shouldAffectPanels) {
      const ix = events.findIndex((e) => e.id === lastIntent.id);
      const afterIntent = events.slice(ix + 1);
      const panelReq = afterIntent.some((e) => e.type === "chat_panel_request" && correlationOf(e) === c);
      if (!panelReq) {
        out.push({
          id: `chat-intent-no-panel-req-${lastIntent.id}`,
          title: "Chat intent targets panels but no chat_panel_request followed",
          layer: "intent",
          confidence: "medium",
          explanation:
            "Routing marked panel impact with a preferred panel, but the execution summary did not record a chat_panel_request. Suspect execution-layer flags (shouldOpenPanel) or an early fallback path.",
          supportingEventIds: [lastIntent.id],
          tags: ["chat"],
        });
      }
    }
  }

  const lastPanelReq = [...events].reverse().find((e) => e.type === "chat_panel_request");
  if (lastPanelReq) {
    const c = chatTurnIdOf(lastPanelReq) ?? correlationOf(lastPanelReq);
    const ix = events.findIndex((e) => e.id === lastPanelReq.id);
    const hostOrFallback = c
      ? scanForwardExclusive(
          events,
          ix,
          (e) =>
            (e.type === "panel_rendered" || e.type === "panel_fallback_used") &&
            e.metadata?.chatCorrelationId === c
        )
      : null;
    const hostOrFallbackLoose =
      hostOrFallback ??
      scanForwardExclusive(events, ix, (e) => e.type === "panel_rendered" || e.type === "panel_fallback_used");

    if (c && !hostOrFallback) {
      out.push({
        id: `chat-panel-no-render-${lastPanelReq.id}`,
        title: "Chat requested a panel update but no host event matched this chat correlation",
        layer: "multiple",
        confidence: hostOrFallbackLoose ? "low" : "medium",
        explanation: hostOrFallbackLoose
          ? "A panel_rendered/fallback occurred without chatCorrelationId on the host event (pre-hardening log or non-chat panel). Prefer newer logs with host linkage."
          : "After chat_panel_request, no panel_rendered or panel_fallback_used carried the same chat correlation. Inspector may be closed, or the panel path did not reach the host.",
        supportingEventIds: [lastPanelReq.id, ...(hostOrFallbackLoose ? [hostOrFallbackLoose.id] : [])],
        tags: ["chat"],
      });
    } else if (!c && !hostOrFallbackLoose) {
      const rest = events.slice(ix + 1, ix + 22);
      const rendered = rest.some((e) => e.type === "panel_rendered");
      if (!rendered) {
        out.push({
          id: `chat-panel-no-render-legacy-${lastPanelReq.id}`,
          title: "Chat panel request with no correlated id — no render in short window",
          layer: "multiple",
          confidence: "low",
          explanation: "chat_panel_request had no chat correlation id; using a short event window only.",
          supportingEventIds: [lastPanelReq.id],
          tags: ["chat"],
        });
      }
    }
    if (c) {
      const blocked = scanForwardExclusive(
        events,
        ix,
        (e) =>
          e.type === "panel_resolved" &&
          e.metadata?.decisionKind === "block" &&
          e.metadata?.chatCorrelationId === c
      );
      if (blocked) {
        out.push({
          id: `chat-panel-blocked-${lastPanelReq.id}`,
          title: "Panel open from chat was blocked by the panel controller",
          layer: "router",
          confidence: "high",
          explanation:
            "A panel_resolved block occurred with the same chat correlation id after chat_panel_request. Check controller locks, preserve rules, and intent vs context.",
          supportingEventIds: [lastPanelReq.id, blocked.id],
          tags: ["chat"],
        });
      }
    }
  }

  const lastSceneReq = [...events].reverse().find((e) => e.type === "chat_scene_request");
  if (lastSceneReq) {
    const c = chatTurnIdOf(lastSceneReq) ?? correlationOf(lastSceneReq);
    const ix = events.findIndex((e) => e.id === lastSceneReq.id);
    if (c) {
      const applied = scanForwardExclusive(
        events,
        ix,
        (e) => e.type === "scene_update_applied" && sceneEventMatchesChatTurn(e, c)
      );
      const blocked = scanForwardExclusive(
        events,
        ix,
        (e) => e.type === "scene_overwrite_blocked" && sceneEventMatchesChatTurn(e, c)
      );
      const warned = scanForwardExclusive(
        events,
        ix,
        (e) =>
          e.type === "debug_warning" &&
          sceneEventMatchesChatTurn(e, c) &&
          (e.metadata?.code === "reaction_empty" || e.metadata?.code === "reaction_duplicate")
      );
      if (!applied && !blocked && !warned) {
        out.push({
          id: `chat-scene-no-apply-${lastSceneReq.id}`,
          title: "Chat requested scene work but no correlated scene apply/block/warning",
          layer: "scene",
          confidence: "medium",
          explanation:
            "chat_scene_request did not pair with a scene_update_applied, scene_overwrite_blocked, or reaction skip warning for the same chat turn. Reaction may have been dropped or applied outside unified reaction.",
          supportingEventIds: [lastSceneReq.id],
          tags: ["chat"],
        });
      }
    } else {
      const rest = events.slice(ix + 1, ix + 28);
      const applied = rest.some((e) => e.type === "scene_update_applied");
      const blocked = rest.some((e) => e.type === "scene_overwrite_blocked");
      if (!applied && !blocked && rest.length > 0) {
        out.push({
          id: `chat-scene-no-apply-legacy-${lastSceneReq.id}`,
          title: "Chat scene request (no chat id) — no apply in window",
          layer: "scene",
          confidence: "low",
          explanation: "Falling back to time-window heuristic only.",
          supportingEventIds: [lastSceneReq.id],
          tags: ["chat"],
        });
      }
    }
  }

  const noop = [...events].reverse().find((e) => e.type === "chat_noop_result");
  if (noop) {
    const c = correlationOf(noop);
    if (c) {
      const intentEv = [...events].reverse().find(
        (e) => e.type === "chat_intent_detected" && correlationOf(e) === c
      );
      if (intentEv && intentEv.metadata?.shouldCallBackend === true) {
        out.push({
          id: `chat-unexpected-noop-${noop.id}`,
          title: "Chat expected backend work but ended in a no-op fallback path",
          layer: "chat",
          confidence: "medium",
          explanation:
            "Intent required backend, but the turn used the no-backend fallback (chat_noop_result). Check execution errors, local decision preemption, or backend gating.",
          supportingEventIds: [noop.id, intentEv.id],
          tags: ["chat"],
        });
      }
    }
  }

  const chatErrors = events.filter((e) => e.type === "chat_error");
  if (chatErrors.length >= 2) {
    out.push({
      id: "chat-repeated-errors",
      title: "Multiple chat_error events in recent history",
      layer: "chat",
      confidence: "medium",
      explanation:
        "At least two chat_error events were recorded recently. Inspect network failures, timeouts, and backend error payloads.",
      supportingEventIds: chatErrors.slice(-2).map((e) => e.id),
      tags: ["chat"],
    });
  }

  const lastCompleted = [...events].reverse().find((e) => e.type === "chat_response_completed");
  if (lastCompleted && lastCompleted.metadata?.lifecycleStatus === "success") {
    const c = correlationOf(lastCompleted);
    if (c) {
      const chain = events.filter((e) => correlationOf(e) === c || chatTurnIdOf(e) === c);
      const hadEffect =
        chain.some((e) => e.type === "chat_panel_request") ||
        chain.some((e) => e.type === "chat_scene_request") ||
        chain.some((e) => e.type === "scene_update_applied") ||
        chain.some((e) => e.type === "chat_local_shortcut");
      const intentEv = chain.find((e) => e.type === "chat_intent_detected");
      const wantedEffect =
        intentEv &&
        (intentEv.metadata?.shouldAffectPanels === true || intentEv.metadata?.shouldAffectScene === true);
      if (wantedEffect && !hadEffect) {
        out.push({
          id: `chat-empty-effect-${lastCompleted.id}`,
          title: "Chat completed successfully but produced no panel/scene effect",
          layer: "multiple",
          confidence: "low",
          explanation:
            "Intent indicated UI/scene impact, yet no chat_panel_request, chat_scene_request, or scene_update_applied appeared in the correlated chain. May be an explain-only reply or execution dropped effects.",
          supportingEventIds: [lastCompleted.id, ...(intentEv ? [intentEv.id] : [])],
          tags: ["chat"],
        });
      }
    }
  }

  const rank: Record<SelfDebugDiagnosis["confidence"], number> = { high: 0, medium: 1, low: 2 };
  return out.sort((a, b) => rank[a.confidence] - rank[b.confidence]);
}
