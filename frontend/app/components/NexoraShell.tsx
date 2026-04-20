"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FragilityScannerMini } from "./scanner/FragilityScannerMini";
import { nx } from "./ui/nexoraTheme";
import type { FragilityDriver, FragilityScanResponse } from "../types/fragilityScanner";
import { CommandHeader } from "./layout/CommandHeader";
import { MultiSourceAssessPopover, type SaveScheduledPayload } from "./layout/MultiSourceAssessPopover";
import {
  deleteScheduledAssessment,
  loadScheduledAssessments,
  newScheduledAssessmentId,
  type ScheduledAssessmentDefinition,
  updateScheduledAssessment,
  upsertScheduledAssessment,
} from "../lib/scheduled/scheduledAssessmentStorage";
import { SceneSettingsMenu } from "./layout/SceneSettingsMenu";
import { normalizeStrategicCouncilResult } from "../lib/council/strategicCouncilClient";
import { fetchNexoraHealth, nexoraHealthIndicator } from "../lib/system/nexoraHealth";
import { emitNexoraB26HealthCheck } from "../lib/system/nexoraReliabilityLog";
import { useCustomerDemoMode } from "../lib/demo/useCustomerDemoMode";
import { buildExecutiveNarrative } from "../lib/narrative/narrativeBuilder";
import { CustomerDemoSelector } from "./demo/CustomerDemoSelector";
import { StrategicAssistantDrawer } from "./assistant/StrategicAssistantDrawer";
import {
  resolveRightPanelRailRoute,
  type RightPanelLeftNavKey,
  type RightPanelRailTab,
} from "../lib/ui/right-panel/rightPanelRouter";
import type { RightPanelView } from "../lib/ui/right-panel/rightPanelTypes";
import { emitDebugEvent } from "../lib/debug/debugEmit";
import { getRecentDebugEvents } from "../lib/debug/debugEventStore";
import { emitGuardRailAlerts, runGuardChecks } from "../lib/debug/debugGuardRails";
import { useInvestorDemo } from "./demo/InvestorDemoContext";
import { dispatchNexoraAction } from "../lib/actions/actionDispatchRegistry";
import { normalizeStartDemoFromTopBar } from "../lib/actions/actionNormalizer";
import { useNexoraRunbookGuidanceOptional } from "../lib/pilot/nexoraRunbookGuidanceContext";
import { getNexoraProductMode } from "../lib/product/nexoraProductMode.ts";

/** Single source of truth: right rail width for every inspector / executive panel state. */
const RIGHT_PANEL_WIDTH_PX = 430;

type NexoraShellProps = {
  children: React.ReactNode;
};

type LeftNavGroupKey = RightPanelLeftNavKey;
type InspectorEventTab = RightPanelRailTab;
type InspectorSectionChangedDetail = {
  section: ActiveSectionKey;
  eventTab: InspectorEventTab | null;
  source?: string | null;
};
type ActiveSectionKey =
  | "scene"
  | "objects"
  | "kpi"
  | "risk"
  | "loops"
  | "timeline"
  | "conflict"
  | "explanation"
  | "focus"
  | "memory"
  | "risk_flow"
  | "replay"
  | "advice"
  | "opponent"
  | "patterns"
  | "executive"
  | "war_room"
  | "collaboration"
  | "workspace"
  // MVP-FROZEN: reports/settings are retained for compatibility but not expanded for MVP.
  | "reports"
  | "settings";

const LEFT_NAV_ITEMS: Array<{
  key: LeftNavGroupKey;
  label: string;
  short: string;
  title: string;
}> = [
  { key: "scene_group", label: "Scene", short: "SCN", title: "Scene Intelligence" },
  { key: "strategy_group", label: "Simulation", short: "SIM", title: "Simulation And War Room" },
  { key: "risk_group", label: "Risk", short: "RSK", title: "Risk" },
  { key: "workflow_group", label: "Workflows", short: "WRK", title: "Workflows And Collaboration" },
  { key: "executive_group", label: "Executive", short: "EXE", title: "Executive Dashboard" },
];

function groupForSection(section: ActiveSectionKey): LeftNavGroupKey {
  if (section === "scene" || section === "objects" || section === "focus") return "scene_group";
  if (section === "timeline" || section === "advice" || section === "war_room") return "strategy_group";
  if (section === "risk" || section === "conflict" || section === "risk_flow" || section === "explanation") return "risk_group";
  if (
    section === "replay" ||
    section === "memory" ||
    section === "patterns" ||
    section === "opponent" ||
    section === "workspace" ||
    section === "collaboration"
  ) {
    return "workflow_group";
  }
  if (section === "executive") return "executive_group";
  return "scene_group";
}

function getRequestedViewForEventTab(eventTab: InspectorEventTab | null | undefined): RightPanelView {
  if (!eventTab) return null;
  if (eventTab === "scene") return "workspace";
  if (eventTab === "object_focus") return "object";
  if (eventTab === "memory_insights") return "memory";
  if (eventTab === "risk_flow") return "risk";
  if (eventTab === "fragility_scan") return "fragility";
  if (eventTab === "strategic_advice") return "advice";
  if (eventTab === "executive_dashboard") return "dashboard";
  if (eventTab === "opponent_moves") return "opponent";
  if (eventTab === "strategic_patterns") return "patterns";
  return eventTab as RightPanelView;
}

function getRequestedViewForLeftNav(key: LeftNavGroupKey): RightPanelView {
  if (key === "scene_group") return "workspace";
  if (key === "strategy_group") return "simulate";
  if (key === "risk_group") return "explanation";
  if (key === "workflow_group") return "memory";
  if (key === "executive_group") return "dashboard";
  return "workspace";
}

function getSectionForView(view: RightPanelView | null): ActiveSectionKey | null {
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
  if (view === "timeline" || view === "decision_timeline" || view === "confidence_calibration" || view === "outcome_feedback" || view === "pattern_intelligence" || view === "scenario_tree") {
    return "timeline";
  }
  if (view === "simulate" || view === "compare") return "timeline";
  return null;
}

const INSPECTOR_GROUPS: Record<
  LeftNavGroupKey,
  {
    label: string;
    tabs: Array<{ key: ActiveSectionKey; label: string; eventTab?: InspectorEventTab }>;
  }
> = {
  scene_group: {
    label: "Scene",
    tabs: [
      { key: "scene", label: "Scene", eventTab: "scene" },
      { key: "objects", label: "Objects", eventTab: "object" },
      { key: "focus", label: "Focus", eventTab: "object_focus" },
    ],
  },
  strategy_group: {
    label: "Simulation",
    tabs: [
      { key: "war_room", label: "War Room", eventTab: "war_room" },
      { key: "timeline", label: "Timeline", eventTab: "timeline" },
      { key: "advice", label: "Advice", eventTab: "strategic_advice" },
    ],
  },
  risk_group: {
    label: "Risk",
    tabs: [
      { key: "explanation", label: "Explanation", eventTab: "explanation" },
      { key: "conflict", label: "Conflict", eventTab: "conflict" },
      { key: "risk_flow", label: "Risk Flow", eventTab: "risk_flow" },
      { key: "risk", label: "Fragility", eventTab: "fragility_scan" },
    ],
  },
  workflow_group: {
    label: "Workflows",
    tabs: [
      { key: "replay", label: "Replay", eventTab: "replay" },
      { key: "memory", label: "Memory", eventTab: "memory_insights" },
      { key: "patterns", label: "Patterns", eventTab: "strategic_patterns" },
      { key: "opponent", label: "Opponent", eventTab: "opponent_moves" },
      { key: "collaboration", label: "Collab", eventTab: "collaboration" },
      { key: "workspace", label: "Workspace", eventTab: "workspace" },
    ],
  },
  executive_group: {
    label: "Executive",
    tabs: [{ key: "executive", label: "Dashboard", eventTab: "executive_dashboard" }],
  },
};

function prettyObjectName(id: string) {
  return String(id || "")
    .replace(/^obj_/, "")
    .replace(/_\d+$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function buildChatDockMessage(domainExperience: any, activeProfile?: any): string {
  if (activeProfile?.hero_summary) {
    const prompts = Array.isArray(activeProfile?.recommended_prompts)
      ? activeProfile.recommended_prompts.slice(0, 2).map((value: unknown) => String(value).trim()).filter(Boolean)
      : [];
    if (prompts.length > 0) {
      return `${activeProfile.label} ready. ${activeProfile.hero_summary} Try ${prompts.join(" or ")}.`;
    }
    return `${activeProfile.label} ready. ${activeProfile.hero_summary}`;
  }
  const label = String(domainExperience?.label ?? "Nexora").trim();
  const prompts = Array.isArray(domainExperience?.promptExamples)
    ? domainExperience.promptExamples.slice(0, 2).map((value: unknown) => String(value).trim()).filter(Boolean)
    : [];
  if (prompts.length > 0) {
    return `${label} workspace ready. Try a prompt like ${prompts.join(" or ")} to analyze pressure, fragility, and next actions.`;
  }
  return `${label} workspace ready. Enter a pressure prompt to analyze the current system.`;
}

function buildCommandPlaceholder(activeProfile: any, domainExperience: any): string {
  if (Array.isArray(activeProfile?.recommended_prompts) && activeProfile.recommended_prompts[0]) {
    return activeProfile.recommended_prompts[0];
  }
  if (Array.isArray(domainExperience?.promptExamples) && domainExperience.promptExamples[0]) {
    return String(domainExperience.promptExamples[0]);
  }
  return "Frame pressure, constraints, or the next best move…";
}

function traceClickRoute(detail: {
  label:
    | "[Nexora][ClickRoute] click_received"
    | "[Nexora][ClickRoute] target_resolved"
    | "[Nexora][ClickRoute] invalid_target_blocked"
    | "[Nexora][ClickRoute] unexpected_fallback_blocked"
    | "[Nexora][ClickRoute] wrong_scene_fallback_blocked";
  source: "left_nav" | "right_rail" | "shell_button" | "panel_button";
  clickedKey: string | null;
  rawTarget: string | null;
  resolvedView: string | null;
  fallbackView: string | null;
  reason: string | null;
}) {
  return;
}

function traceShellConsumeOnly(detail: {
  label:
    | "[Nexora][ShellConsumeOnly] state_consumed"
    | "[Nexora][ShellConsumeOnly] active_section_displayed"
    | "[Nexora][ShellConsumeOnly] downgrade_blocked"
    | "[Nexora][ShellConsumeOnly] display_fallback_used";
  currentRightPanelView: string | null;
  resolvedActiveSection: ActiveSectionKey;
  visibleSections: string[];
  semanticFamily: string | null;
  reason: string;
}) {
  return;
}

function traceViewSync(detail: {
  label:
    | "[Nexora][ViewSync] shell_active_tab"
    | "[Nexora][ViewSync] desync_detected"
    | "[Nexora][ViewSync] desync_fixed";
  activeTab: string | null;
  currentRightPanelView: string | null;
  renderedView: string | null;
  legacyTab: string | null;
  source: string;
  reason: string;
}) {
  return;
}

function NexoraStatusStripCard(props: { label: string; labelColor: string; text: string | null | undefined }) {
  const body = (props.text ?? "").trim();
  return (
    <div
      style={{
        minWidth: 0,
        flex: "1 1 0%",
        maxWidth: `min(${RIGHT_PANEL_WIDTH_PX}px, 42vw)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        padding: "5px 10px",
        borderRadius: 10,
        border: `1px solid ${nx.border}`,
        background: nx.chipSurface,
      }}
    >
      <div
        style={{
          color: props.labelColor,
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          lineHeight: 1.2,
        }}
      >
        {props.label}
      </div>
      <div
        style={{
          color: body ? nx.chipValueText : nx.lowMuted,
          fontSize: 11,
          fontWeight: 600,
          lineHeight: 1.35,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          wordBreak: "break-word",
        }}
        title={body || undefined}
      >
        {body || "—"}
      </div>
    </div>
  );
}

export default function NexoraShell({ children }: NexoraShellProps) {
  const pilotOperatorChrome = useMemo(() => getNexoraProductMode() === "pilot", []);
  const runbookGuidance = useNexoraRunbookGuidanceOptional();
  const investorDemo = useInvestorDemo();
  const handleStartInvestorDemoRouted = useCallback(() => {
    const handled = dispatchNexoraAction(normalizeStartDemoFromTopBar());
    if (!handled) {
      investorDemo.startDemo();
    }
  }, [investorDemo.startDemo]);
  const console = React.useMemo(
    () =>
      ({
        log: () => {},
        warn: () => {},
        error: () => {},
      }) as Pick<Console, "log" | "warn" | "error">,
    []
  );
  const [mode, setMode] = useState<"dashboard" | "studio">("dashboard");
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isAssistantDrawerOpen, setIsAssistantDrawerOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [multiSourcePopoverOpen, setMultiSourcePopoverOpen] = useState(false);
  const [multiSourceBusy, setMultiSourceBusy] = useState(false);
  const [multiSourceError, setMultiSourceError] = useState<string | null>(null);
  const [nexoraHealthTier, setNexoraHealthTier] = useState<"green" | "yellow" | "red">("red");
  const [scheduledDefs, setScheduledDefs] = useState<ScheduledAssessmentDefinition[]>([]);
  const lastRailAuditSignatureRef = React.useRef<string | null>(null);
  const lastRenderAuditRef = React.useRef<{ signature: string | null; count: number }>({
    signature: null,
    count: 0,
  });
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; role: "user" | "assistant"; text: string }>>(() => [
    {
      id: "m1",
      role: "assistant",
      text:
        getNexoraProductMode() === "pilot"
          ? "Describe your situation to begin. Press Enter to analyze."
          : "Workspace ready. Enter a pressure prompt to analyze the current system.",
    },
  ]);

  const assessBusinessTextFromCommandBar = useCallback(() => {
    const text = chatInput.trim();
    if (!text) return;
    window.dispatchEvent(
      new CustomEvent("nexora:run-business-text-ingestion", {
        detail: { text, source: "command_bar" },
      })
    );
  }, [chatInput]);

  useEffect(() => {
    let cancelled = false;
    const pollHealth = async () => {
      const h = await fetchNexoraHealth();
      if (cancelled) return;
      setNexoraHealthTier(nexoraHealthIndicator(h));
      emitNexoraB26HealthCheck({
        ok: h.ok,
        fetchSucceeded: h.fetchSucceeded,
        services: h.services,
      });
      if (
        process.env.NODE_ENV !== "production" &&
        typeof window !== "undefined" &&
        getNexoraProductMode() !== "pilot"
      ) {
        const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
        w.__NEXORA_DEBUG__ = { ...(w.__NEXORA_DEBUG__ ?? {}), lastHealth: h };
      }
    };
    void pollHealth();
    const intervalId = window.setInterval(pollHealth, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const onMultiSourceComplete = (event: Event) => {
      const detail = (event as CustomEvent<{ ok?: boolean; source?: string }>).detail;
      if (detail?.source !== "product") return;
      const ok = detail?.ok;
      setMultiSourceBusy(false);
      if (ok === true) {
        setMultiSourceError(null);
        setMultiSourcePopoverOpen(false);
      } else if (ok === false) {
        setMultiSourceError("System couldn't complete analysis. Please try again.");
      }
    };
    window.addEventListener("nexora:multi-source-assessment-complete", onMultiSourceComplete as EventListener);
    return () => window.removeEventListener("nexora:multi-source-assessment-complete", onMultiSourceComplete as EventListener);
  }, []);

  useEffect(() => {
    const sync = () => setScheduledDefs(loadScheduledAssessments());
    sync();
    window.addEventListener("nexora:scheduled-assessments-changed", sync);
    return () => window.removeEventListener("nexora:scheduled-assessments-changed", sync);
  }, []);

  const handleSaveScheduled = useCallback((payload: SaveScheduledPayload) => {
    const def: ScheduledAssessmentDefinition = {
      id: newScheduledAssessmentId(),
      name: payload.name.trim() || "Recurring assessment",
      sources: payload.request.sources,
      domain: payload.request.domain?.trim() ? payload.request.domain.trim() : null,
      scheduleType: payload.scheduleType,
      intervalMinutes: payload.scheduleType === "interval" ? payload.intervalMinutes : 60,
      dailyTime: payload.scheduleType === "daily" ? (payload.dailyTime ?? "09:00").trim() || "09:00" : null,
      enabled: true,
      lastRunAt: null,
      lastStatus: "idle",
      createdAt: Date.now(),
    };
    upsertScheduledAssessment(def);
    window.dispatchEvent(new CustomEvent("nexora:scheduled-assessments-changed"));
  }, []);

  const handleToggleScheduledEnabled = useCallback((id: string, enabled: boolean) => {
    updateScheduledAssessment(id, { enabled });
    window.dispatchEvent(new CustomEvent("nexora:scheduled-assessments-changed"));
  }, []);

  const handleDeleteScheduled = useCallback((id: string) => {
    deleteScheduledAssessment(id);
    window.dispatchEvent(new CustomEvent("nexora:scheduled-assessments-changed"));
  }, []);

  const sendChat = useCallback((overrideText?: string, options?: { source?: "user" | "guided_prompt" }) => {
    const text = String(overrideText ?? chatInput).trim();
    if (!text) return;
    const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const userId = `${requestId}-user`;
    const pendingId = `${requestId}-pending`;
    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      { id: userId, role: "user", text },
      { id: pendingId, role: "assistant", text: "Analyzing..." },
    ]);
    window.dispatchEvent(
      new CustomEvent("nexora:submit-chat", {
        detail: { text, requestId, source: options?.source ?? "user" },
      })
    );
  }, [chatInput]);

  useEffect(() => {
    const onChatResult = (event: Event) => {
      const detail = (event as CustomEvent<{ reply?: string; ok?: boolean; requestId?: string }>).detail ?? {};
      const requestId = typeof detail.requestId === "string" ? detail.requestId : null;
      const reply =
        typeof detail.reply === "string" && detail.reply.trim().length
          ? detail.reply
          : detail.ok === false
          ? "Backend request failed. Please check server connection."
          : "Done.";

      setChatMessages((prev) => {
        if (!requestId) {
          return [...prev, { id: `${Date.now()}-${Math.random().toString(16).slice(2)}-assistant`, role: "assistant", text: reply }];
        }
        const pendingId = `${requestId}-pending`;
        const idx = prev.findIndex((m) => m.id === pendingId);
        if (idx === -1) {
          return [...prev, { id: `${requestId}-assistant`, role: "assistant", text: reply }];
        }
        const next = [...prev];
        next[idx] = { ...next[idx], text: reply };
        return next;
      });
    };

    window.addEventListener("nexora:chat-result", onChatResult as EventListener);
    return () => window.removeEventListener("nexora:chat-result", onChatResult as EventListener);
  }, []);

  const [inspectorContext, setInspectorContext] = useState<any>(null);
  useEffect(() => {
    const onInspectorContext = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail;
      setInspectorContext(detail ?? null);
    };
    window.addEventListener("nexora:inspector-context", onInspectorContext as EventListener);
    return () => window.removeEventListener("nexora:inspector-context", onInspectorContext as EventListener);
  }, []);
  
  const [activeSection, setActiveSection] = useState<ActiveSectionKey>(mode === "studio" ? "objects" : "executive");
  const domainExperience = inspectorContext?.domainExperience ?? inspectorContext?.domainSelection ?? null;
  const {
    activeProfile,
    activeProfileId,
    setActiveProfile,
    recommendedPrompts,
    headerContextLabel,
  } = useCustomerDemoMode(domainExperience?.domainId ?? null);
  const sharedCoreEngine = inspectorContext?.sharedCoreEngine ?? null;
  const visibleNavGroupSet = useMemo(() => {
    const raw = Array.isArray(domainExperience?.visibleNavGroups) ? domainExperience.visibleNavGroups : [];
    return new Set(raw.map((value: string) => String(value)));
  }, [domainExperience]);
  const visibleSectionSet = useMemo(() => {
    const raw = Array.isArray(domainExperience?.visibleSections) ? domainExperience.visibleSections : [];
    return new Set(raw.map((value: string) => String(value)));
  }, [domainExperience]);
  const upstreamRightPanelView =
    typeof inspectorContext?.rightPanelView === "string"
      ? (inspectorContext.rightPanelView as RightPanelView)
      : null;
  const navItems = useMemo(
    () =>
      LEFT_NAV_ITEMS.filter(
        (item) => visibleNavGroupSet.size === 0 || visibleNavGroupSet.has(item.key)
      ),
    [visibleNavGroupSet]
  );
  const upstreamMappedSection = useMemo(
    () => getSectionForView(upstreamRightPanelView),
    [upstreamRightPanelView]
  );
  const resolvedActiveSection = useMemo(() => {
    if (!upstreamMappedSection) {
      return activeSection;
    }

    // Preserve local sub-navigation within the same family when upstream view points at that family.
    if (upstreamMappedSection === "focus" && (activeSection === "objects" || activeSection === "focus")) {
      return activeSection;
    }
    if (
      upstreamMappedSection === "risk" &&
      (activeSection === "risk" || activeSection === "risk_flow" || activeSection === "explanation")
    ) {
      return activeSection;
    }
    if (upstreamMappedSection === "scene" && activeSection === "scene") {
      return activeSection;
    }
    if (upstreamMappedSection === "timeline" && activeSection === "timeline") {
      return activeSection;
    }
    if (upstreamMappedSection === "executive" && activeSection === "executive") {
      return activeSection;
    }

    return upstreamMappedSection;
  }, [activeSection, upstreamMappedSection]);

  const shellDebugSigRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    const sig = `${resolvedActiveSection}|${upstreamRightPanelView ?? ""}|${upstreamMappedSection ?? ""}`;
    if (shellDebugSigRef.current === sig) return;
    shellDebugSigRef.current = sig;
    emitDebugEvent({
      type: "shell_section_resolved",
      layer: "shell",
      source: "NexoraShell",
      status: "info",
      message: `Shell section ${resolvedActiveSection}`,
      metadata: {
        resolvedActiveSection,
        upstreamRightPanelView,
        upstreamMappedSection,
      },
    });
  }, [resolvedActiveSection, upstreamRightPanelView, upstreamMappedSection]);

  const sectionTitle = useMemo(() => {
    const map: Record<typeof activeSection, string> = {
      scene: "Scene",
      objects: "Objects",
      kpi: "KPI",
      risk: "Risk",
      loops: "Loops",
      timeline: "Timeline",
      conflict: "Conflict Map",
      explanation: "Explanation",
      focus: "Object Focus",
      memory: "Memory Insights",
      risk_flow: "Risk Flow",
      replay: "Replay",
      advice: "Strategic Advice",
      opponent: "Opponent Moves",
      patterns: "Strategic Patterns",
      executive: "Executive Dashboard",
      war_room: "War Room",
      collaboration: "Collaboration",
      workspace: "Workspace",
      reports: "Reports",
      settings: "Settings",
    };
    return map[resolvedActiveSection];
  }, [resolvedActiveSection]);

  const inspectorHint = useMemo(() => {
    switch (resolvedActiveSection) {
      case "scene":
        return "Review the current operating picture and scene-level business condition.";
      case "objects":
        return "Inspect the entities carrying pressure, leverage, or strategic relevance.";
      case "kpi":
        return "Track the business indicators that define current system health.";
      case "risk":
        return "See which fragility and pressure signals deserve executive attention.";
      case "loops":
        return "Review reinforcing and balancing loops shaping the current state.";
      case "timeline":
        return "Step through the likely sequence of effects before acting.";
      case "conflict":
        return "Review the main strategic tensions currently active in the system.";
      case "explanation":
        return "Read the problem, drivers, impact, and recommended move in plain language.";
      case "focus":
        return "Explain why the current focus matters and what to do next.";
      case "memory":
        return "Bring forward recurring patterns and previously seen pressure signatures.";
      case "risk_flow":
        return "Trace how pressure moves from source to downstream impact.";
      case "replay":
        return "Review the recent decision trail and what changed over time.";
      case "advice":
        return "See the next business move Nexora is recommending right now.";
      case "opponent":
        return "Review external pressure and the best response posture.";
      case "patterns":
        return "Surface repeated strategic patterns across memory, conflict, and propagation.";
      case "executive":
        return "Use the executive surface to understand condition, pressure, and next moves fast.";
      case "war_room":
        return "Compose strategic actions and request non-destructive decision overlays for the current scene.";
      case "collaboration":
        return "Capture aligned notes, viewpoints, and decision context for the current episode.";
      case "workspace":
        return "Product workspace, saved scenarios, and saved reports.";
      case "reports":
        return "Review saved reports, exports, and executive snapshots.";
      case "settings":
        return "Adjust workspace preferences and operating defaults.";
      default:
        return "Choose a surface to inspect the current business state.";
    }
  }, [resolvedActiveSection]);

  const activeNavGroup = useMemo(() => groupForSection(resolvedActiveSection), [resolvedActiveSection]);
  const sceneJson = inspectorContext?.sceneJson ?? inspectorContext?.responseData?.scene_json ?? null;
  const fragilityScanResult = (inspectorContext?.responseData?.fragility_scan ??
    inspectorContext?.fragilityScanResult ??
    null) as FragilityScanResponse | null;

  const renderedChatMessages = useMemo(() => {
    if (!domainExperience) return chatMessages;
    if (chatMessages.length !== 1 || chatMessages[0]?.id !== "m1" || chatMessages[0]?.role !== "assistant") {
      return chatMessages;
    }
    return [{ ...chatMessages[0], text: buildChatDockMessage(domainExperience, activeProfile) }];
  }, [activeProfile, chatMessages, domainExperience]);
  const scenarioLabel = useMemo(() => {
    const sceneMeta = inspectorContext?.sceneJson?.meta ?? inspectorContext?.responseData?.scene_json?.meta ?? null;
    return String(
      sceneMeta?.label ??
        sceneMeta?.title ??
        sceneMeta?.demo_title ??
        domainExperience?.label ??
        "Strategic Scenario"
    ).trim() || "Strategic Scenario";
  }, [domainExperience?.label, inspectorContext?.responseData?.scene_json?.meta, inspectorContext?.sceneJson?.meta]);
  const sceneObjects = useMemo(() => {
    const items = sceneJson?.scene?.objects;
    return Array.isArray(items) ? items : [];
  }, [sceneJson]);
  const fragility = inspectorContext?.sceneJson?.scene?.fragility ?? inspectorContext?.responseData?.fragility ?? null;
  const sceneMeta = inspectorContext?.sceneJson?.scene?.scene ?? inspectorContext?.responseData?.scene_json?.scene?.scene ?? null;
  const fragilityScore = Number(fragilityScanResult?.fragility_score ?? fragility?.score ?? 0);
  const fragilityLevel = String(fragilityScanResult?.fragility_level ?? fragility?.level ?? "-");
  const volatility = Number(sceneMeta?.volatility ?? 0);
  const driverEntries = fragilityScanResult?.drivers?.length
    ? fragilityScanResult.drivers.map((driver: FragilityDriver) => [driver.label, driver.score] as const)
    : Object.entries((fragility?.drivers ?? {}) as Record<string, unknown>);
  const dominantDriver = useMemo(() => {
    if (!driverEntries.length) return null;
    return [...driverEntries]
      .map(([key, value]) => ({ key, value: Number(value ?? 0) }))
      .sort((a, b) => b.value - a.value)[0];
  }, [driverEntries]);
  const focusedObjectId = (inspectorContext?.focusedId ?? inspectorContext?.selectedObjectId ?? null) as string | null;
  const selectedObjectInfo = inspectorContext?.selectedObjectInfo ?? null;
  const focusedObject = useMemo(() => {
    if (!focusedObjectId) return null;
    const byScene = sceneObjects.find((o: any) => String(o?.id ?? "") === focusedObjectId);
    if (byScene) return byScene;
    if (selectedObjectInfo?.id === focusedObjectId) return selectedObjectInfo;
    return null;
  }, [focusedObjectId, sceneObjects, selectedObjectInfo]);
  const objectSelection = inspectorContext?.objectSelection ?? null;
  const selectedObjectId =
    typeof inspectorContext?.selectedObjectId === "string" ? inspectorContext.selectedObjectId : null;
  const focusReasoning = useMemo(() => {
    const rankings = Array.isArray(objectSelection?.rankings) ? objectSelection.rankings : [];
    if (!focusedObjectId || !rankings.length) return null;
    return rankings.find((r: any) => String(r?.id ?? "") === focusedObjectId) ?? null;
  }, [objectSelection, focusedObjectId]);
  const strategicAdvice = inspectorContext?.strategicAdvice ?? null;
  const decisionResult = inspectorContext?.decisionResult ?? null;
  const strategicCouncil = useMemo(
    () =>
      normalizeStrategicCouncilResult(
        inspectorContext?.responseData?.strategic_council ??
          inspectorContext?.sceneJson?.strategic_council ??
          null
      ),
    [inspectorContext?.responseData?.strategic_council, inspectorContext?.sceneJson?.strategic_council]
  );
  const riskPropagation =
    inspectorContext?.riskPropagation ??
    inspectorContext?.responseData?.risk_propagation ??
    inspectorContext?.sceneJson?.risk_propagation ??
    null;
  const activeGroupConfig = useMemo(() => {
    const resolvedGroupKey = activeNavGroup as LeftNavGroupKey;
    const base = INSPECTOR_GROUPS[resolvedGroupKey];
    const filteredTabs = (base?.tabs ?? []).filter((tab) => {
      if (
        tab.key === "war_room" ||
        tab.key === resolvedActiveSection ||
        visibleSectionSet.size === 0 ||
        visibleSectionSet.has(tab.key)
      ) {
        return true;
      }
      return false;
    });
    return {
      ...(base ?? INSPECTOR_GROUPS.scene_group),
      tabs: filteredTabs.length > 0 ? filteredTabs : base?.tabs ?? [],
    };
  }, [
    activeNavGroup,
    visibleSectionSet,
    resolvedActiveSection,
  ]);
  const activeSubTabs = useMemo(() => activeGroupConfig?.tabs ?? [], [activeGroupConfig]);
  const visibleSections = useMemo(
    () => Array.from(visibleSectionSet.values()),
    [visibleSectionSet]
  );
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    console.log("[Nexora][PanelFamily]", {
      upstreamView: upstreamRightPanelView ?? null,
      mappedSection: upstreamMappedSection ?? null,
      activeSection,
      resolvedSection: resolvedActiveSection,
      activeNavGroup,
      availableTabs: activeSubTabs.map((tab) => tab.key),
      collapsedToDashboard:
        upstreamMappedSection !== null &&
        upstreamMappedSection !== "executive" &&
        resolvedActiveSection === "executive",
    });
  }, [
    activeNavGroup,
    activeSection,
    activeSubTabs,
    resolvedActiveSection,
    upstreamMappedSection,
    upstreamRightPanelView,
  ]);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    console.log("[Nexora][Subnav]", {
      upstreamView: upstreamRightPanelView ?? null,
      mappedSection: upstreamMappedSection ?? null,
      resolvedActiveSection,
      activeNavGroup,
      visibleSections,
      availableTabs: activeSubTabs.map((tab) => tab.key),
      renderedSubnav: activeSubTabs.map((tab) => tab.label),
      collapsedToDashboardReason:
        resolvedActiveSection === "executive" && upstreamMappedSection !== "executive"
          ? "upstream_section_mismatch_or_stale_view"
          : null,
    });
    console.log("[Nexora][NexoraShell]", {
      mode,
      isInspectorOpen,
      groupLabel: activeGroupConfig?.label ?? null,
    });
  }, [
    activeGroupConfig?.label,
    activeNavGroup,
    activeSubTabs,
    isInspectorOpen,
    mode,
    resolvedActiveSection,
    upstreamMappedSection,
    upstreamRightPanelView,
    visibleSections,
  ]);
  const conflicts = Array.isArray(inspectorContext?.conflicts) ? inspectorContext.conflicts : [];
  const focusedAdvice = useMemo(() => {
    const list = Array.isArray(strategicAdvice?.recommended_actions) ? strategicAdvice.recommended_actions : [];
    if (!focusedObjectId) return [];
    return list.filter((a: any) => Array.isArray(a?.targets) && a.targets.includes(focusedObjectId));
  }, [strategicAdvice, focusedObjectId]);
  const systemStatus = useMemo(() => {
    const normalizedLevel = String(fragilityLevel || "").toLowerCase();
    if (normalizedLevel.includes("high") || fragilityScore >= 0.7) {
      return { label: "Critical" as const, tone: "critical" as const };
    }
    if (normalizedLevel.includes("medium") || normalizedLevel.includes("moderate") || fragilityScore >= 0.4) {
      return { label: "Warning" as const, tone: "warning" as const };
    }
    return { label: "Stable" as const, tone: "stable" as const };
  }, [fragilityLevel, fragilityScore]);
  const activeModeLabel = useMemo(() => {
    if (activeProfile?.default_mode) return activeProfile.default_mode;
    if (resolvedActiveSection === "war_room") return "War Room";
    if (
      resolvedActiveSection === "executive" ||
      resolvedActiveSection === "timeline" ||
      resolvedActiveSection === "advice" ||
      resolvedActiveSection === "risk_flow" ||
      resolvedActiveSection === "conflict"
    ) {
      return "Strategy";
    }
    return "Business";
  }, [activeProfile?.default_mode, resolvedActiveSection]);
  const councilSummary = useMemo(() => {
    if (!strategicCouncil) return null;
    return `Council: ${strategicCouncil.disagreements[0]?.summary ?? strategicCouncil.synthesis.recommended_direction}`;
  }, [strategicCouncil]);
  const executiveNarrative = useMemo(
    () =>
      buildExecutiveNarrative({
        fragilityScanResult,
        scenarioResult: inspectorContext?.responseData?.decision_simulation ?? decisionResult?.simulation_result ?? null,
        decisionResult,
        strategicAdvice,
        executiveSummarySurface: inspectorContext?.responseData?.executive_summary_surface ?? null,
      }),
    [
      decisionResult,
      fragilityScanResult,
      inspectorContext?.responseData?.decision_simulation,
      inspectorContext?.responseData?.executive_summary_surface,
      strategicAdvice,
    ]
  );
  const demoPresentation = inspectorContext?.demoPresentation ?? null;
  const demoContentActive =
    Boolean(activeProfile?.id) || String(inspectorContext?.sourceLabel ?? "").toLowerCase() === "demo";
  const demoFlowStepIndex = useMemo(() => {
    if (!demoPresentation) return 0;
    if (!demoPresentation.loadDone) return 0;
    if (!demoPresentation.askedDone) return 1;
    return 2;
  }, [demoPresentation]);
  const demoValueMomentLabel = useMemo(() => {
    if (!demoContentActive) return null;
    if (demoPresentation?.insightOpen) return "Insight ready";
    if (demoPresentation?.guidedPromptsVisible) return "Prompts ready";
    if (demoPresentation?.loadDone && demoPresentation?.askedDone) return "Output in view";
    if (demoPresentation?.loadDone) return "Scenario ready";
    return null;
  }, [demoContentActive, demoPresentation]);
  const handleFragilityScanComplete = useCallback((result: FragilityScanResponse) => {
    window.dispatchEvent(
      new CustomEvent("nexora:apply-fragility-scan", {
        detail: { result },
      })
    );
  }, []);
  const setInspectorSection = React.useCallback((
    section: ActiveSectionKey,
    eventTab?: InspectorEventTab,
    requestedView?: RightPanelView | null,
    leftNavKey?: LeftNavGroupKey | null
  ) => {
    const explicitSection = section;
    setActiveSection(section);
    setIsInspectorOpen(true);
    window.dispatchEvent(
      new CustomEvent<InspectorSectionChangedDetail>("nexora:inspector-section-changed", {
        detail: { section, eventTab: eventTab ?? null, source: "legacy-ui:user-nav" },
      })
    );
    const nextView =
      requestedView ??
      getRequestedViewForEventTab(eventTab) ??
      getRequestedViewForLeftNav(groupForSection(section));
    if (nextView) {
      window.dispatchEvent(
        new CustomEvent("nexora:open-right-panel", {
          detail: {
            view: nextView,
            tab: eventTab ?? null,
            leftNav: leftNavKey ?? null,
            section: explicitSection,
            source: "ui:user-nav",
          },
        })
      );
    }
    emitDebugEvent({
      type: "subtab_resolved",
      layer: "shell",
      source: "NexoraShell",
      status: "info",
      message: `Inspector section resolved to ${explicitSection}`,
      metadata: {
        section: explicitSection,
        eventTab: eventTab ?? null,
        nextView: nextView ?? null,
        leftNavKey: leftNavKey ?? null,
        openedPanel: Boolean(nextView),
      },
    });
    emitGuardRailAlerts(
      runGuardChecks(
        {
          trigger: "subtab_resolve",
          subtab: { eventTab: eventTab ?? null, resolvedNextView: nextView ?? null },
        },
        getRecentDebugEvents()
      )
    );
  }, []);
  const focusObjectFromInspector = useCallback(
    (id: string) => {
      if (!id) return;
      window.dispatchEvent(
        new CustomEvent("nexora:set-focus-object", {
          detail: { id },
        })
      );
      setInspectorSection("focus", "object_focus");
    },
    [setInspectorSection]
  );
  const handleLoadDemo = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("nexora:load-demo-scenario", {
        detail: {
          demo: activeProfile?.scenario_script_id ?? domainExperience?.defaultDemoId ?? "retail_supply_chain_fragility",
          domainId: activeProfile?.domain ?? domainExperience?.domainId ?? "general",
          profileId: activeProfile?.id ?? null,
        },
      })
    );
  }, [activeProfile?.domain, activeProfile?.id, activeProfile?.scenario_script_id, domainExperience?.defaultDemoId, domainExperience?.domainId]);
  const commandPlaceholder = useMemo(() => {
    if (getNexoraProductMode() === "pilot") {
      return "Describe the situation… (Enter to analyze)";
    }
    return buildCommandPlaceholder(activeProfile, domainExperience);
  }, [activeProfile, domainExperience]);
  const displayPrompts = useMemo(
    () =>
      (recommendedPrompts.length ? recommendedPrompts : Array.isArray(domainExperience?.promptExamples) ? domainExperience.promptExamples : [])
        .map((value: unknown) => String(value).trim())
        .filter(Boolean)
        .slice(0, 3),
    [domainExperience?.promptExamples, recommendedPrompts]
  );
  const submitPresetPrompt = useCallback((text: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora] assistant prompt clicked", { prompt: text });
    }
    sendChat(text, { source: "guided_prompt" });
  }, [sendChat]);
  const toggleAssistantDrawer = useCallback(() => {
    setIsAssistantDrawerOpen((prev) => {
      const next = !prev;
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora] assistant drawer toggled", { isOpen: next });
      }
      return next;
    });
  }, []);
  const handleAssistantSubmit = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora] assistant submit triggered from drawer");
    }
    sendChat();
  }, [sendChat]);
  const handleSaveSnapshot = useCallback(() => {
    window.dispatchEvent(new CustomEvent("nexora:save-decision-snapshot"));
  }, []);
  const handleOpenReplay = useCallback(() => {
    setInspectorSection("replay", "replay");
  }, [setInspectorSection]);

  React.useEffect(() => {
    const onOpenRightPanel = (event: Event) => {
      const detail = (event as CustomEvent<{ tab?: string; view?: string | null; section?: string | null }>).detail;
      const nextView =
        typeof detail?.view === "string" ? (detail.view as RightPanelView) : null;
      const explicitSection =
        typeof detail?.section === "string"
          ? (detail.section as ActiveSectionKey)
          : null;
      const derivedSection = getSectionForView(nextView);
      const nextSection = explicitSection ?? derivedSection;
      if (
        process.env.NODE_ENV !== "production" &&
        explicitSection &&
        derivedSection &&
        explicitSection !== derivedSection
      ) {
        console.log("[Nexora][SectionPrecedence]", {
          explicitSection: explicitSection ?? null,
          derivedSection: derivedSection ?? null,
          nextView: nextView ?? null,
        });
      }
      if (nextSection) {
        setActiveSection(nextSection as ActiveSectionKey);
      }
    };
    window.addEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
    return () => window.removeEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
  }, []);

  useEffect(() => {
    const onRightPanelTabChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ tab?: string; view?: string | null }>).detail;
      const nextView =
        typeof detail?.view === "string" ? (detail.view as RightPanelView) : null;
      const explicitSection =
        typeof detail?.tab === "string"
          ? (detail.tab as ActiveSectionKey)
          : null;
      const derivedSection = getSectionForView(nextView);
      const nextSection = explicitSection ?? derivedSection;
      if (
        process.env.NODE_ENV !== "production" &&
        explicitSection &&
        derivedSection &&
        explicitSection !== derivedSection
      ) {
        console.log("[Nexora][SectionPrecedence]", {
          explicitSection: explicitSection ?? null,
          derivedSection: derivedSection ?? null,
          nextView: nextView ?? null,
        });
      }
      if (nextSection) {
        setActiveSection(nextSection as ActiveSectionKey);
      }
    };
    window.addEventListener("nexora:right-panel-tab-changed", onRightPanelTabChanged as EventListener);
    return () => window.removeEventListener("nexora:right-panel-tab-changed", onRightPanelTabChanged as EventListener);
  }, []);
  return (
    <div
      id="nexora-shell"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
        minHeight: 0,
        background: nx.bgApp,
      }}
    >
      <div
        id="nexora-shell-inner"
        style={{
          width: "100%",
          maxWidth: "none",
          margin: 0,
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 0,
          minHeight: 0,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxSizing: "border-box",
          padding: 0,
        }}
      >
        <CommandHeader
          pilotOperatorChrome={pilotOperatorChrome}
          scenarioLabel={scenarioLabel}
          activeModeLabel={activeModeLabel}
          contextLabel={headerContextLabel ?? domainExperience?.label ?? null}
          statusLabel={systemStatus.label}
          statusTone={systemStatus.tone}
          systemHealthTier={nexoraHealthTier}
          councilSummary={councilSummary}
          decisionHeadline={executiveNarrative.decisionHeadline}
          topDriverLabel={executiveNarrative.topDriverLabel}
          profileSelector={
            pilotOperatorChrome ? null : <CustomerDemoSelector activeProfileId={activeProfileId} onChange={setActiveProfile} />
          }
          commandValue={chatInput}
          commandPlaceholder={commandPlaceholder}
          onCommandChange={setChatInput}
          onCommandSubmit={sendChat}
          onAssessBusinessText={assessBusinessTextFromCommandBar}
          onOpenMultiSourceAssess={() => setMultiSourcePopoverOpen(true)}
          onLoadDemo={pilotOperatorChrome ? undefined : handleLoadDemo}
          onSnapshot={pilotOperatorChrome ? undefined : handleSaveSnapshot}
          onReplay={pilotOperatorChrome ? undefined : handleOpenReplay}
          onStartInvestorDemo={pilotOperatorChrome ? null : handleStartInvestorDemoRouted}
          investorDemoActive={investorDemo.demo.active}
          commandBarMicroHint={pilotOperatorChrome ? null : (runbookGuidance?.hints.commandBar ?? null)}
        />
        <MultiSourceAssessPopover
          open={multiSourcePopoverOpen}
          onClose={() => {
            if (!multiSourceBusy) setMultiSourcePopoverOpen(false);
          }}
          defaultDomain={domainExperience?.domainId ?? null}
          submitting={multiSourceBusy}
          errorMessage={multiSourceError}
          onRunAssessment={(req) => {
            setMultiSourceError(null);
            setMultiSourceBusy(true);
            window.dispatchEvent(
              new CustomEvent("nexora:run-multi-source-assessment", {
                detail: { sources: req.sources, domain: req.domain ?? null },
              })
            );
          }}
          scheduledDefinitions={scheduledDefs}
          onToggleScheduledEnabled={handleToggleScheduledEnabled}
          onDeleteScheduled={handleDeleteScheduled}
          onSaveScheduled={handleSaveScheduled}
        />

      {/* BODY: LEFT NAV + STAGE + RIGHT RAIL */}
      <div
        id="nexora-layout"
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          overflow: "hidden",
          minWidth: 0,
          width: "100%",
          maxWidth: "none",
        }}
      >
        {/* LEFT NAV */}
        <aside
          id="nexora-leftnav"
          style={{
            width: 72,
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: "72px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "14px 8px",
            borderRight: `1px solid ${nx.border}`,
            background: nx.leftNavBg,
            backdropFilter: "blur(10px)",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              color: nx.lowMuted,
              fontSize: 10,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              fontWeight: 700,
              textAlign: "left",
            }}
          >
            Workspace
          </div>
          <div
            id="nexora-leftnav-primary"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: 0,
              minHeight: 0,
              overflowY: "auto",
              paddingRight: 2,
            }}
          >
            {navItems.map((item) => {
              const isActive = activeNavGroup === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  title={item.title}
                  aria-label={item.title}
                  onClick={() => {
                    const requestedView = getRequestedViewForLeftNav(item.key);
                    const nextSection = getSectionForView(requestedView) ?? activeSection;
                    setInspectorSection(nextSection, undefined, requestedView, item.key);
                  }}
                  style={{
                    height: 54,
                    borderRadius: 12,
                    border: isActive ? `1px solid ${nx.navTileActiveBorder}` : `1px solid ${nx.border}`,
                    background: isActive ? nx.navTileActiveBg : nx.navTileInactiveBg,
                    color: isActive ? nx.text : nx.muted,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 700,
                    boxShadow: isActive ? nx.navTileActiveShadow : "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 3,
                    padding: "0 8px",
                  }}
                  aria-pressed={isActive}
                >
                  <span style={{ fontSize: 10, letterSpacing: "0.12em", lineHeight: 1, textTransform: "uppercase", color: isActive ? nx.navShortActive : nx.lowMuted }}>
                    {item.short}
                  </span>
                  <span style={{ fontSize: 12, lineHeight: 1.2, textAlign: "left" }}>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div
            id="nexora-leftnav-utilities"
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 4,
            }}
          >
            <SceneSettingsMenu variant="navIcon" />
          </div>
        </aside>

        {mode === "studio" ? (
          <aside
            id="nexora-layers-panel"
            style={{
              width: 260,
              flexGrow: 0,
              flexShrink: 0,
              flexBasis: "260px",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              borderRight: `1px solid ${nx.studioPanelBorder}`,
              background: nx.studioPanelBg,
              overflow: "hidden",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                padding: 12,
                borderBottom: `1px solid ${nx.border}`,
                color: nx.text,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Layers
              </div>
              <div style={{ fontSize: 12, color: nx.muted }}>Studio</div>
            </div>

            <div
              style={{
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                minHeight: 0,
                overflow: "auto",
                padding: 10,
                color: nx.muted,
                fontSize: 12,
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
              }}
              onWheelCapture={(e) => e.stopPropagation()}
              onTouchMoveCapture={(e) => e.stopPropagation()}
            >
              <div style={{ marginBottom: 10, color: nx.text, fontWeight: 700, fontSize: 13 }}>
                Object Tree
              </div>

              {(
                [
                  { key: "objects", label: "Objects" },
                  { key: "kpi", label: "KPI" },
                  { key: "risk", label: "Risk" },
                  { key: "loops", label: "Loops" },
                ] as const
              ).map((item) => {
                const isActive = resolvedActiveSection === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveSection(item.key)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 10px",
                      borderRadius: 12,
                      border: isActive ? `1px solid ${nx.navTileActiveBorder}` : `1px solid ${nx.border}`,
                      background: isActive ? nx.accentSoft : nx.bgControl,
                      color: isActive ? nx.text : nx.muted,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 8,
                    }}
                    aria-pressed={isActive}
                  >
                    <span>{item.label}</span>
                    <span style={{ fontSize: 11, opacity: 0.8 }}>→</span>
                  </button>
                );
              })}

            </div>
          </aside>
        ) : null}

        {/* CENTER STAGE */}
        <main
          id="nexora-stage"
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "auto",
            minWidth: 0,
            minHeight: 0,
            position: "relative",
            overflow: "hidden",
            background: nx.stageBg,
            boxShadow: nx.stageInset,
          }}
        >
          <div
            id="nexora-canvas-host"
            style={{
              position: "absolute",
              inset: 0,
              minWidth: 0,
              minHeight: 0,
            }}
          >
            {children}
          </div>

          {mode === "studio" ? (
            <div
              id="nexora-toolbar"
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                right: 10,
                zIndex: 5,
                pointerEvents: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 14,
                border: `1px solid ${nx.border}`,
                background: nx.bgHud,
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                {(
                  [
                    { key: "select", label: "Select" },
                    { key: "move", label: "Move" },
                    { key: "link", label: "Link" },
                    { key: "focus", label: "Focus" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    style={{
                      height: 30,
                      padding: "0 10px",
                      borderRadius: 12,
                      border: `1px solid ${nx.border}`,
                      background: nx.bgControl,
                      color: nx.muted,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                    title={t.label}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 12, color: nx.muted }}>Studio</div>
                <button
                  type="button"
                  onClick={() => setIsInspectorOpen(true)}
                  style={{
                    height: 30,
                    padding: "0 10px",
                    borderRadius: 12,
                    border: `1px solid ${nx.border}`,
                    background: nx.bgControl,
                    color: nx.muted,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                  title="Open Inspector"
                >
                  Inspector
                </button>
              </div>
            </div>
          ) : null}

          <div
            id="nexora-stage-overlay"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          />

          <div
            id="nexora-stage-assistant"
            style={{
              position: "absolute",
              right: 12,
              bottom: 12,
              zIndex: 4,
              pointerEvents: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              minHeight: 0,
              ...(isAssistantDrawerOpen
                ? {
                    width: "min(320px, calc(100% - 24px))",
                    maxWidth: 320,
                    height: "40vh",
                    maxHeight: "40vh",
                  }
                : { width: "auto", maxWidth: "min(320px, calc(100% - 24px))" }),
            }}
          >
            <StrategicAssistantDrawer
              isOpen={isAssistantDrawerOpen}
              onToggle={toggleAssistantDrawer}
              title="Strategic Assistant"
              subtitle={demoContentActive ? `${scenarioLabel}` : "Executive intelligence for the active view."}
              profileLabel={activeProfile?.label ?? null}
              messages={renderedChatMessages}
              promptChips={displayPrompts}
              inputValue={chatInput}
              inputPlaceholder={commandPlaceholder}
              onInputChange={setChatInput}
              onSubmit={handleAssistantSubmit}
              onPromptSelect={submitPresetPrompt}
              isBusy={renderedChatMessages[renderedChatMessages.length - 1]?.text === "Analyzing..."}
              demoModeActive={demoContentActive}
              demoValueHint={demoValueMomentLabel}
              demoFlowActiveStep={demoFlowStepIndex}
            />
          </div>
        </main>

        {/* RIGHT RAIL — fixed width; last column in layout row */}
        <aside
          id="nexora-right-rail"
          style={{
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: `${RIGHT_PANEL_WIDTH_PX}px`,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            borderLeft: `1px solid ${nx.borderStrong}`,
            background: nx.rightRailBg,
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            id="nexora-inspector"
            style={{
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: 0,
              minHeight: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
          <div
            id="nexora-inspector-header"
            style={{
              flexShrink: 0,
              padding: "16px 16px 12px",
              borderBottom: `1px solid ${nx.border}`,
              color: nx.text,
              fontWeight: 700,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: isInspectorOpen ? 12 : 0 }}>
              <div style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {isInspectorOpen ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
                        Executive rail
                      </span>
                      {demoContentActive ? (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: nx.accentMuted,
                            padding: "2px 7px",
                            borderRadius: 8,
                            border: `1px solid ${nx.borderStrong}`,
                            background: nx.accentSoft,
                          }}
                        >
                          Demo mode
                        </span>
                      ) : null}
                      {demoValueMomentLabel && demoContentActive ? (
                        <span style={{ fontSize: 10, fontWeight: 600, color: nx.muted }}>{demoValueMomentLabel}</span>
                      ) : null}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}>{activeGroupConfig?.label ?? sectionTitle}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: nx.muted, lineHeight: 1.45, maxWidth: "100%" }}>
                      Context and controls for the selected surface.
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 800, color: nx.muted }}>Insights</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsInspectorOpen((v) => !v)}
                aria-label={isInspectorOpen ? "Collapse inspector" : "Expand inspector"}
                title={isInspectorOpen ? "Collapse" : "Expand"}
                style={{
                  height: 28,
                  width: 28,
                  borderRadius: 8,
                  border: `1px solid ${nx.border}`,
                  background: nx.bgDeep,
                  color: nx.muted,
                  cursor: "pointer",
                  flexGrow: 0,
                  flexShrink: 0,
                  flexBasis: "auto",
                }}
              >
                {isInspectorOpen ? "⟩" : "⟨"}
              </button>
            </div>
            {isInspectorOpen ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
                {activeSubTabs.map((tab) => {
                  const isActive = resolvedActiveSection === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      title={tab.label}
                      aria-label={tab.label}
                      onClick={() => {
                        const route = resolveRightPanelRailRoute(tab.eventTab ?? null);
                        if (!route) {
                          return;
                        }
                        emitDebugEvent({
                          type: "subtab_clicked",
                          layer: "shell",
                          source: "NexoraShell",
                          status: "info",
                          message: `Subtab ${tab.label}`,
                          metadata: { tabKey: tab.key, eventTab: tab.eventTab ?? null },
                        });
                        setInspectorSection(tab.key, tab.eventTab, route.resolvedView);
                      }}
                      style={{
                        height: 30,
                        borderRadius: 999,
                        padding: "0 10px",
                        border: isActive ? `1px solid ${nx.navTileActiveBorder}` : `1px solid ${nx.border}`,
                        background: isActive ? nx.navTileActiveBg : nx.surfacePanel,
                        color: isActive ? nx.text : nx.muted,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {isInspectorOpen ? (
            <div
              id="nexora-inspector-body"
              style={{
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                minHeight: 0,
                overflow: "auto",
                padding: "14px 16px 16px",
                color: nx.muted,
                fontSize: 13,
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
              }}
              onWheelCapture={(e) => e.stopPropagation()}
              onTouchMoveCapture={(e) => e.stopPropagation()}
            >
              {mode === "dashboard" && resolvedActiveSection === "scene" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid ${nx.border}`,
                      background: nx.bgElevated,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ color: nx.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      Scene Overview
                    </div>
                    <div style={{ color: nx.textSoft, fontSize: 12 }}>
                      System-wide state and current operational context
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid ${nx.border}`,
                      background: nx.bgElevated,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div style={{ color: nx.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      System Health
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ color: nx.muted }}>Fragility</span>
                      <span style={{ color: nx.text, fontWeight: 700 }}>{fragilityScore.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ color: nx.muted }}>Level</span>
                      <span style={{ color: nx.text, fontWeight: 700 }}>{fragilityLevel}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ color: nx.muted }}>Volatility</span>
                      <span style={{ color: nx.text, fontWeight: 700 }}>{volatility.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ color: nx.muted }}>Risk drivers</span>
                      <span style={{ color: nx.text, fontWeight: 700 }}>{driverEntries.length}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      border: `1px solid ${nx.border}`,
                      background: nx.bgControl,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ color: nx.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      Dominant Signal
                    </div>
                    <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
                      {dominantDriver ? `Primary pressure: ${dominantDriver.key}` : "No dominant system pressure is active right now."}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      border: `1px solid ${nx.border}`,
                      background: nx.bgControl,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ color: nx.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      Active Context
                    </div>
                    <div style={{ color: nx.textSoft, fontSize: 12 }}>
                      Active loop: {inspectorContext?.activeLoopId ?? "-"}
                    </div>
                    <div style={{ color: nx.textSoft, fontSize: 12 }}>
                      Scene mode: {inspectorContext?.activeMode ?? "-"}
                    </div>
                    <div style={{ color: nx.textSoft, fontSize: 12 }}>
                      Dashboard mode: {mode === "dashboard" ? "Dashboard" : "Studio"}
                    </div>
                  </div>
                </div>
              ) : mode === "dashboard" && resolvedActiveSection === "objects" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid ${nx.border}`,
                      background: nx.bgElevated,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ color: nx.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      Objects
                    </div>
                    <div style={{ color: nx.textSoft, fontSize: 12 }}>
                      Browse system components in the current scene
                    </div>
                  </div>
                  {sceneObjects.length ? (
                    sceneObjects.map((obj: any, idx: number) => {
                      const id = String(obj?.id ?? `obj_${idx}`);
                      const isFocused = focusedObjectId === id;
                      const emphasis = Number(obj?.emphasis ?? obj?.intensity ?? 0);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => focusObjectFromInspector(id)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: 10,
                            borderRadius: 10,
                            border: isFocused ? `1px solid ${nx.navTileActiveBorder}` : `1px solid ${nx.border}`,
                            background: isFocused ? nx.accentSoft : nx.bgControl,
                            color: nx.text,
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            cursor: "pointer",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                            <span style={{ fontWeight: 700, fontSize: 13 }}>
                              {String(obj?.label ?? obj?.name ?? prettyObjectName(id))}
                            </span>
                            <span style={{ color: isFocused ? nx.accentMuted : nx.muted, fontSize: 11 }}>
                              {isFocused ? "Focused" : "Focus"}
                            </span>
                          </div>
                          <div style={{ color: nx.muted, fontSize: 11 }}>ID: {id}</div>
                          <div style={{ color: nx.textSoft, fontSize: 12 }}>
                            Emphasis: {Number.isFinite(emphasis) ? emphasis.toFixed(2) : "-"}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        border: `1px solid ${nx.border}`,
                        background: nx.bgControl,
                        color: nx.lowMuted,
                        fontSize: 12,
                      }}
                    >
                      No scene objects are available in the current operating view.
                    </div>
                  )}
                </div>
              ) : mode === "dashboard" && resolvedActiveSection === "focus" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid ${nx.border}`,
                      background: nx.bgElevated,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ color: nx.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      Focus
                    </div>
                    <div style={{ color: nx.textSoft, fontSize: 12 }}>
                      Current object under analysis
                    </div>
                  </div>

                  {!focusedObjectId ? (
                    <div
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        border: `1px solid ${nx.border}`,
                        background: nx.bgControl,
                        color: nx.lowMuted,
                        fontSize: 12,
                        lineHeight: 1.5,
                      }}
                    >
                      No object is in executive focus yet. Select one in the scene or use the Objects surface to set focus.
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          padding: 12,
                          borderRadius: 12,
                          border: `1px solid ${nx.border}`,
                          background: nx.bgElevated,
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>
                          {String(focusedObject?.label ?? selectedObjectInfo?.label ?? prettyObjectName(focusedObjectId))}
                        </div>
                        <div style={{ color: nx.muted, fontSize: 11 }}>ID: {focusedObjectId}</div>
                        <div style={{ color: nx.textSoft, fontSize: 12 }}>
                          Type: {String(focusedObject?.type ?? selectedObjectInfo?.type ?? "-")}
                        </div>
                        <div style={{ color: nx.textSoft, fontSize: 12 }}>
                          Emphasis: {Number(focusedObject?.emphasis ?? selectedObjectInfo?.override?.emphasis ?? 0).toFixed(2)}
                        </div>
                        <div style={{ color: nx.textSoft, fontSize: 12 }}>
                          Focus mode: {String(inspectorContext?.focusPinned ? "Pinned" : inspectorContext?.focusMode ?? "selected")}
                        </div>
                      </div>

                      <div
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          border: `1px solid ${nx.border}`,
                          background: nx.bgControl,
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <div style={{ color: nx.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                          Drivers And Reasoning
                        </div>
                        <div style={{ color: nx.textSoft, fontSize: 12 }}>
                          {focusReasoning
                            ? `Priority ${Number(focusReasoning?.score ?? 0).toFixed(2)} · ${String(focusReasoning?.why ?? "Focused by system relevance")}`
                            : "Nexora has not built a strong focus explanation for this object yet."}
                        </div>
                        {Array.isArray(selectedObjectInfo?.tags) && selectedObjectInfo.tags.length ? (
                          <div style={{ color: nx.accentMuted, fontSize: 11 }}>
                            Tags: {selectedObjectInfo.tags.join(", ")}
                          </div>
                        ) : null}
                      </div>

                      <div
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          border: `1px solid ${nx.border}`,
                          background: nx.bgControl,
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <div style={{ color: nx.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                          Suggested Actions
                        </div>
                        {focusedAdvice.length ? (
                          focusedAdvice.slice(0, 3).map((a: any, idx: number) => (
                            <div key={idx} style={{ color: nx.text, fontSize: 12 }}>
                              {a?.action ?? "Action"}
                            </div>
                          ))
                        ) : (
                          <div style={{ color: nx.lowMuted, fontSize: 12 }}>
                            No direct executive action is targeting this object in the current scene.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : mode === "dashboard" && resolvedActiveSection === "risk" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid ${nx.border}`,
                      background: nx.bgElevated,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ color: nx.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      Fragility Scanner
                    </div>
                    <div style={{ color: nx.textSoft, fontSize: 12, lineHeight: 1.5 }}>
                      Scan a short business update to reveal fragility level, weak points, and the drivers worth inspecting first.
                    </div>
                    {fragilityScanResult ? (
                      <div style={{ color: nx.muted, fontSize: 11 }}>
                        Last scan: {fragilityLevel.toUpperCase()} · {fragilityScore.toFixed(2)}
                      </div>
                    ) : null}
                  </div>

                  <FragilityScannerMini
                    initialResult={fragilityScanResult}
                    onScanComplete={handleFragilityScanComplete}
                  />
                </div>
              ) : mode === "dashboard" && resolvedActiveSection === "timeline" ? (
                <div id="nexora-inspector-timeline-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "conflict" ? (
                <div id="nexora-inspector-conflict-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "explanation" ? (
                <div id="nexora-inspector-riskflow-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "memory" ? (
                <div id="nexora-inspector-memory-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "risk_flow" ? (
                <div id="nexora-inspector-riskflow-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "replay" ? (
                <div id="nexora-inspector-replay-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "advice" ? (
                <div id="nexora-inspector-advice-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "opponent" ? (
                <div id="nexora-inspector-opponent-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "patterns" ? (
                <div id="nexora-inspector-patterns-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "executive" ? (
                <div id="nexora-inspector-exec-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "war_room" ? (
                <div id="nexora-inspector-warroom-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "collaboration" ? (
                <div id="nexora-inspector-collab-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "workspace" ? (
                <div id="nexora-inspector-workspace-host" style={{ width: "100%", height: "100%" }} />
              ) : (
                <>
                  <div style={{ marginBottom: 10, color: nx.text, fontWeight: 700 }}>
                    {sectionTitle} Panel
                  </div>
                  <div style={{ lineHeight: 1.5 }}>{inspectorHint}</div>
                  <div
                    style={{
                      marginTop: 12,
                      padding: 10,
                      borderRadius: 12,
                      border: `1px solid ${nx.border}`,
                      background: nx.bgDeep,
                    }}
                  >
                    <div style={{ fontSize: 12, color: nx.muted }}>Mode</div>
                    <div style={{ marginTop: 4, fontSize: 13, color: nx.text }}>
                      {mode === "dashboard" ? "Dashboard" : "Studio"}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div
              id="nexora-inspector-body"
              style={{
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
              }}
            >
              <button
                type="button"
                onClick={() => setIsInspectorOpen(true)}
                aria-label="Expand inspector"
                title="Expand Inspector"
                style={{
                  width: 40,
                  height: 120,
                  borderRadius: 12,
                  border: `1px solid ${nx.border}`,
                  background: nx.bgDeep,
                  color: nx.muted,
                  cursor: "pointer",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  letterSpacing: 1,
                  fontSize: 12,
                }}
              >
                INSPECT
              </button>
            </div>
          )}

          {isInspectorOpen ? (
            <div
              id="nexora-inspector-footer"
              style={{
                flexShrink: 0,
                padding: 10,
                borderTop: `1px solid ${nx.border}`,
              }}
            />
          ) : null}
          </div>
        </aside>
      </div>

      <div
        id="nexora-status-strip"
        style={{
          minHeight: 56,
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: "auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          gap: 12,
          padding: "6px 14px",
          boxSizing: "border-box",
          borderTop: `1px solid ${nx.border}`,
          background: nx.bgDeep,
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            gap: 10,
            minWidth: 0,
            flex: "1 1 0%",
          }}
        >
          <NexoraStatusStripCard
            label="System"
            labelColor={nx.accentInk}
            text={executiveNarrative.systemStateSummary}
          />
          <NexoraStatusStripCard
            label="Risk"
            labelColor={nx.warning}
            text={executiveNarrative.keyRiskStatement}
          />
        </div>
        <div
          id="nexora-replay-bar"
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            color: nx.muted,
            fontSize: 11,
            fontWeight: 600,
            whiteSpace: "nowrap",
            paddingLeft: 8,
          }}
        >
          Timeline · Replay · Snapshots
        </div>
      </div>

      </div>
    </div>
  );
}
