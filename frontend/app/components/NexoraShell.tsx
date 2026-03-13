"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { nx } from "./ui/nexoraTheme";

type NexoraShellProps = {
  children: React.ReactNode;
};

type LeftNavGroupKey = "scene_group" | "strategy_group" | "risk_group" | "replay_group" | "memory_group" | "workspace_group" | "executive_group";
type InspectorEventTab =
  | "scene"
  | "object"
  | "timeline"
  | "conflict"
  | "object_focus"
  | "memory_insights"
  | "risk_flow"
  | "replay"
  | "strategic_advice"
  | "opponent_moves"
  | "strategic_patterns"
  | "executive_dashboard"
  | "collaboration"
  | "workspace";
type ActiveSectionKey =
  | "scene"
  | "objects"
  | "kpi"
  | "risk"
  | "loops"
  | "timeline"
  | "conflict"
  | "focus"
  | "memory"
  | "risk_flow"
  | "replay"
  | "advice"
  | "opponent"
  | "patterns"
  | "executive"
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
  { key: "scene_group", label: "Scene", short: "SCN", title: "Scene" },
  { key: "strategy_group", label: "Sim", short: "SIM", title: "Simulation" },
  { key: "risk_group", label: "Risk", short: "RSK", title: "Risk" },
  { key: "replay_group", label: "Replay", short: "RPL", title: "Replay" },
  { key: "memory_group", label: "Intel", short: "INT", title: "Intelligence" },
  { key: "workspace_group", label: "Work", short: "WKS", title: "Workspace" },
  { key: "executive_group", label: "Exec", short: "EXE", title: "Executive Dashboard" },
];

function groupForSection(section: ActiveSectionKey): LeftNavGroupKey {
  if (section === "scene" || section === "objects" || section === "focus") return "scene_group";
  if (section === "timeline" || section === "advice") return "strategy_group";
  if (section === "risk" || section === "conflict" || section === "risk_flow") return "risk_group";
  if (section === "replay") return "replay_group";
  if (section === "memory" || section === "patterns" || section === "opponent") return "memory_group";
  if (section === "workspace" || section === "collaboration") return "workspace_group";
  if (section === "executive") return "executive_group";
  return "scene_group";
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
      { key: "timeline", label: "Timeline", eventTab: "timeline" },
      { key: "advice", label: "Advice", eventTab: "strategic_advice" },
    ],
  },
  risk_group: {
    label: "Risk",
    tabs: [
      { key: "conflict", label: "Conflict", eventTab: "conflict" },
      { key: "risk_flow", label: "Risk Flow", eventTab: "risk_flow" },
      { key: "risk", label: "Fragility" },
    ],
  },
  replay_group: {
    label: "Replay",
    tabs: [{ key: "replay", label: "Replay", eventTab: "replay" }],
  },
  memory_group: {
    label: "Intelligence",
    tabs: [
      { key: "memory", label: "Memory", eventTab: "memory_insights" },
      { key: "patterns", label: "Patterns", eventTab: "strategic_patterns" },
      { key: "opponent", label: "Opponent", eventTab: "opponent_moves" },
    ],
  },
  workspace_group: {
    label: "Workspace",
    tabs: [
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

function buildChatDockMessage(domainExperience: any): string {
  const label = String(domainExperience?.label ?? "Nexora").trim();
  const prompts = Array.isArray(domainExperience?.promptExamples)
    ? domainExperience.promptExamples.slice(0, 2).map((value: unknown) => String(value).trim()).filter(Boolean)
    : [];
  if (prompts.length > 0) {
    return `${label} workspace ready. Try a prompt like ${prompts.join(" or ")} to analyze pressure, fragility, and next actions.`;
  }
  return `${label} workspace ready. Enter a pressure prompt to analyze the current system.`;
}

export default function NexoraShell({ children }: NexoraShellProps) {
  const [mode, setMode] = useState<"dashboard" | "studio">("dashboard");
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; role: "user" | "assistant"; text: string }>>([
    { id: "m1", role: "assistant", text: "Workspace ready. Enter a pressure prompt to analyze the current system." },
  ]);

  const sendChat = useCallback(() => {
    const text = chatInput.trim();
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
        detail: { text, requestId },
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
  const sharedCoreEngine = inspectorContext?.sharedCoreEngine ?? null;
  const visibleNavGroupSet = useMemo(() => {
    const raw = Array.isArray(domainExperience?.visibleNavGroups) ? domainExperience.visibleNavGroups : [];
    return new Set(raw.map((value: string) => String(value)));
  }, [domainExperience]);
  const visibleSectionSet = useMemo(() => {
    const raw = Array.isArray(domainExperience?.visibleSections) ? domainExperience.visibleSections : [];
    return new Set(raw.map((value: string) => String(value)));
  }, [domainExperience]);
  const navItems = useMemo(
    () =>
      LEFT_NAV_ITEMS.filter(
        (item) => visibleNavGroupSet.size === 0 || visibleNavGroupSet.has(item.key)
      ),
    [visibleNavGroupSet]
  );
  const resolvedActiveSection = useMemo(() => {
    if (visibleSectionSet.size === 0 || visibleSectionSet.has(activeSection)) return activeSection;
    return (
      navItems
        .flatMap((item) => INSPECTOR_GROUPS[item.key]?.tabs ?? [])
        .find((tab) => visibleSectionSet.has(tab.key))
        ?.key ?? activeSection
    );
  }, [activeSection, navItems, visibleSectionSet]);

  const sectionTitle = useMemo(() => {
    const map: Record<typeof activeSection, string> = {
      scene: "Scene",
      objects: "Objects",
      kpi: "KPI",
      risk: "Risk",
      loops: "Loops",
      timeline: "Timeline",
      conflict: "Conflict Map",
      focus: "Object Focus",
      memory: "Memory Insights",
      risk_flow: "Risk Flow",
      replay: "Replay",
      advice: "Strategic Advice",
      opponent: "Opponent Moves",
      patterns: "Strategic Patterns",
      executive: "Executive Dashboard",
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
        return "Scene controls and quick actions will appear here.";
      case "objects":
        return "Object list and selection details will appear here.";
      case "kpi":
        return "KPI summary, filters, and actions will appear here.";
      case "risk":
        return "Risk signals, thresholds, and alerts will appear here.";
      case "loops":
        return "Loops and dependencies controls will appear here.";
      case "timeline":
        return "Timeline simulation controls will appear here.";
      case "conflict":
        return "Conflict mapping and object tensions will appear here.";
      case "focus":
        return "Object relevance and focus rankings will appear here.";
      case "memory":
        return "Memory-based strategic insights will appear here.";
      case "risk_flow":
        return "Risk propagation flow between system objects will appear here.";
      case "replay":
        return "Decision replay timeline and playback controls will appear here.";
      case "advice":
        return "Strategic recommendation and next-best action guidance will appear here.";
      case "opponent":
        return "External actor moves and best response guidance will appear here.";
      case "patterns":
        return "Repeated strategic patterns from memory, conflict, and propagation signals will appear here.";
      case "executive":
        return "Manager summary of system health, risk, actions, pressure, and recurring patterns.";
      case "collaboration":
        return "Shared manager/analyst notes and viewpoints for the current episode.";
      case "workspace":
        return "Product workspace, saved scenarios, and saved reports.";
      case "reports":
        return "Reports, exports, and snapshots will appear here.";
      case "settings":
        return "Workspace settings will appear here.";
      default:
        return "Select a section to see details.";
    }
  }, [resolvedActiveSection]);

  const activeNavGroup = useMemo(() => groupForSection(resolvedActiveSection), [resolvedActiveSection]);
  const activeGroupConfig = useMemo(() => {
    const fallbackGroupKey = navItems[0]?.key ?? "scene_group";
    const base = INSPECTOR_GROUPS[
      (visibleNavGroupSet.size === 0 || visibleNavGroupSet.has(activeNavGroup)
        ? activeNavGroup
        : fallbackGroupKey) as LeftNavGroupKey
    ];
    const filteredTabs = (base?.tabs ?? []).filter(
      (tab) => visibleSectionSet.size === 0 || visibleSectionSet.has(tab.key)
    );
    return {
      ...(base ?? INSPECTOR_GROUPS.scene_group),
      tabs: filteredTabs.length > 0 ? filteredTabs : base?.tabs ?? [],
    };
  }, [activeNavGroup, navItems, visibleNavGroupSet, visibleSectionSet]);
  const activeSubTabs = useMemo(() => activeGroupConfig?.tabs ?? [], [activeGroupConfig]);
  const sceneJson = inspectorContext?.sceneJson ?? inspectorContext?.responseData?.scene_json ?? null;

  const renderedChatMessages = useMemo(() => {
    if (!domainExperience) return chatMessages;
    if (chatMessages.length !== 1 || chatMessages[0]?.id !== "m1" || chatMessages[0]?.role !== "assistant") {
      return chatMessages;
    }
    return [{ ...chatMessages[0], text: buildChatDockMessage(domainExperience) }];
  }, [chatMessages, domainExperience]);
  const sceneObjects = useMemo(() => {
    const items = sceneJson?.scene?.objects;
    return Array.isArray(items) ? items : [];
  }, [sceneJson]);
  const fragility = inspectorContext?.sceneJson?.scene?.fragility ?? inspectorContext?.responseData?.fragility ?? null;
  const sceneMeta = inspectorContext?.sceneJson?.scene?.scene ?? inspectorContext?.responseData?.scene_json?.scene?.scene ?? null;
  const fragilityScore = Number(fragility?.score ?? 0);
  const fragilityLevel = String(fragility?.level ?? "-");
  const volatility = Number(sceneMeta?.volatility ?? 0);
  const driverEntries = Object.entries((fragility?.drivers ?? {}) as Record<string, unknown>);
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
  const focusReasoning = useMemo(() => {
    const rankings = Array.isArray(objectSelection?.rankings) ? objectSelection.rankings : [];
    if (!focusedObjectId || !rankings.length) return null;
    return rankings.find((r: any) => String(r?.id ?? "") === focusedObjectId) ?? null;
  }, [objectSelection, focusedObjectId]);
  const strategicAdvice = inspectorContext?.strategicAdvice ?? null;
  const focusedAdvice = useMemo(() => {
    const list = Array.isArray(strategicAdvice?.recommended_actions) ? strategicAdvice.recommended_actions : [];
    if (!focusedObjectId) return [];
    return list.filter((a: any) => Array.isArray(a?.targets) && a.targets.includes(focusedObjectId));
  }, [strategicAdvice, focusedObjectId]);
  const setInspectorSection = React.useCallback((section: ActiveSectionKey, eventTab?: InspectorEventTab) => {
    setActiveSection(section);
    setIsInspectorOpen(true);
    if (eventTab) {
      window.dispatchEvent(
        new CustomEvent("nexora:open-right-panel", {
          detail: { tab: eventTab },
        })
      );
    }
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

  React.useEffect(() => {
    const onOpenRightPanel = (event: Event) => {
      const detail = (event as CustomEvent<{ tab?: string }>).detail;
      const tab = detail?.tab;
      if (!tab) return;
      if (tab === "scene") setActiveSection("scene");
      else if (tab === "object") setActiveSection("objects");
      else if (tab === "timeline") setActiveSection("timeline");
      else if (tab === "conflict") setActiveSection("conflict");
      else if (tab === "object_focus") setActiveSection("focus");
      else if (tab === "memory_insights") setActiveSection("memory");
      else if (tab === "risk_flow") setActiveSection("risk_flow");
      else if (tab === "replay") setActiveSection("replay");
      else if (tab === "strategic_advice") setActiveSection("advice");
      else if (tab === "opponent_moves") setActiveSection("opponent");
      else if (tab === "strategic_patterns") setActiveSection("patterns");
      else if (tab === "executive_dashboard") setActiveSection("executive");
      else if (tab === "collaboration") setActiveSection("collaboration");
      else if (tab === "workspace") setActiveSection("workspace");
    };
    window.addEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
    return () => window.removeEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
  }, []);

  useEffect(() => {
    const onRightPanelTabChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ tab?: string }>).detail;
      const tab = detail?.tab;
      if (!tab) return;
      if (tab === "scene") setActiveSection("scene");
      else if (tab === "object") setActiveSection("objects");
      else if (tab === "object_focus") setActiveSection("focus");
      else if (tab === "timeline") setActiveSection("timeline");
      else if (tab === "conflict") setActiveSection("conflict");
      else if (tab === "memory_insights") setActiveSection("memory");
      else if (tab === "risk_flow") setActiveSection("risk_flow");
      else if (tab === "replay") setActiveSection("replay");
      else if (tab === "strategic_advice") setActiveSection("advice");
      else if (tab === "opponent_moves") setActiveSection("opponent");
      else if (tab === "strategic_patterns") setActiveSection("patterns");
      else if (tab === "executive_dashboard") setActiveSection("executive");
      else if (tab === "collaboration") setActiveSection("collaboration");
      else if (tab === "workspace") setActiveSection("workspace");
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
        background:
          "radial-gradient(130% 120% at 0% 0%, #0b1220 0%, #071019 55%, #050a14 100%)",
      }}
    >
      {/* TOP BAR */}
      <div
        id="nexora-topbar"
        style={{
          height: 52,
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 12px",
          borderBottom: `1px solid ${nx.border}`,
          background: "rgba(15,23,42,0.72)",
          backdropFilter: "blur(8px)",
          minWidth: 0,
        }}
      >
        <div id="nexora-topbar-left" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ fontWeight: 800, color: nx.text, letterSpacing: 0.3, fontSize: 15 }}>
            {domainExperience?.label ? `Nexora • ${domainExperience.label}` : "Nexora"}
          </div>
          <div style={{ color: nx.lowMuted, fontSize: 11, whiteSpace: "nowrap" }}>
            {sharedCoreEngine?.label ? `${sharedCoreEngine.label} / domain overlay` : "Shared core / domain overlay"}
          </div>
          <div
            id="nexora-mode-switch"
            style={{
              display: "flex",
              gap: 6,
              padding: 4,
              borderRadius: 10,
              border: `1px solid ${nx.border}`,
              background: "rgba(2,6,23,0.36)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode("dashboard");
                setActiveSection((prev) => (prev === "reports" || prev === "settings" ? prev : "executive"));
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "none",
                background: mode === "dashboard" ? "rgba(96,165,250,0.2)" : "transparent",
                color: mode === "dashboard" ? nx.text : nx.muted,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
              aria-label="Dashboard mode"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("studio");
                setActiveSection((prev) => (prev === "reports" || prev === "settings" ? prev : "objects"));
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "none",
                background: mode === "studio" ? "rgba(96,165,250,0.2)" : "transparent",
                color: mode === "studio" ? nx.text : nx.muted,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
              aria-label="Studio mode"
            >
              Studio
            </button>
          </div>
        </div>

        <div id="nexora-topbar-center" style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
          <input
            id="nexora-command-input"
            placeholder="Command / Search..."
            style={{
              width: "100%",
              maxWidth: 520,
              height: 34,
              borderRadius: 12,
              border: `1px solid ${nx.border}`,
              outline: "none",
              padding: "0 12px",
              background: "rgba(2,6,23,0.55)",
              color: nx.text,
            }}
          />
        </div>

        <div id="nexora-topbar-right" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(
                    new CustomEvent("nexora:load-demo-scenario", {
                  detail: {
                    demo: domainExperience?.defaultDemoId ?? "retail_supply_chain_fragility",
                    domainId: domainExperience?.domainId ?? "general",
                  },
                })
              )
            }
            style={{
              height: 34,
              padding: "0 10px",
              borderRadius: 12,
              border: "1px solid rgba(96,165,250,0.35)",
              background: "rgba(59,130,246,0.2)",
              color: "#dbeafe",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {domainExperience?.label ? `Load ${domainExperience.label} Demo` : "Load MVP Demo"}
          </button>
          <button
            type="button"
            style={{
              height: 34,
              padding: "0 10px",
              borderRadius: 12,
              border: `1px solid ${nx.border}`,
              background: "rgba(2,6,23,0.4)",
              color: nx.muted,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Snapshot
          </button>
          <button
            type="button"
            style={{
              height: 34,
              padding: "0 10px",
              borderRadius: 12,
              border: `1px solid ${nx.border}`,
              background: "rgba(2,6,23,0.4)",
              color: nx.muted,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Replay
          </button>
        </div>
      </div>

      {/* BODY: LEFT NAV + STAGE + RIGHT RAIL */}
      <div
        id="nexora-layout"
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* LEFT NAV */}
        <aside
          id="nexora-leftnav"
          style={{
            width: 88,
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "12px 10px",
            borderRight: `1px solid ${nx.border}`,
            background: "rgba(7, 16, 25, 0.92)",
            backdropFilter: "blur(8px)",
            minHeight: 0,
            minWidth: 0,
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
              textAlign: "center",
            }}
          >
            Navigate
          </div>
          <div
            id="nexora-leftnav-primary"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              minHeight: 0,
              overflowY: "auto",
              paddingRight: 2,
            }}
          >
            {navItems.map((item) => {
              const isActive = activeNavGroup === item.key;
              const defaultTab = INSPECTOR_GROUPS[item.key].tabs[0];
              return (
                <button
                  key={item.key}
                  type="button"
                  title={item.title}
                  aria-label={item.title}
                  onClick={() => {
                    setInspectorSection(defaultTab.key, defaultTab.eventTab);
                  }}
                  style={{
                    height: 56,
                    borderRadius: 12,
                    border: isActive
                      ? "1px solid rgba(96,165,250,0.45)"
                      : `1px solid ${nx.border}`,
                    background: isActive
                      ? "rgba(96,165,250,0.16)"
                      : "rgba(2,6,23,0.52)",
                    color: isActive ? nx.text : nx.muted,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 700,
                    boxShadow: isActive ? "inset 0 0 0 1px rgba(96,165,250,0.16)" : "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                  aria-pressed={isActive}
                >
                  <span style={{ fontSize: 11, letterSpacing: 0.4, lineHeight: 1 }}>{item.short}</span>
                  <span style={{ fontSize: 10, lineHeight: 1 }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {mode === "studio" ? (
          <aside
            id="nexora-layers-panel"
            style={{
              width: 260,
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              borderRight: "1px solid rgba(120,170,255,0.18)",
              background: "rgba(15, 23, 42, 0.58)",
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
                flex: 1,
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
                      border: isActive
                        ? "1px solid rgba(96,165,250,0.45)"
                        : `1px solid ${nx.border}`,
                      background: isActive ? "rgba(96,165,250,0.14)" : "rgba(2,6,23,0.45)",
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

              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 12,
                  border: `1px solid ${nx.border}`,
                  background: "rgba(2,6,23,0.5)",
                }}
              >
                <div style={{ fontSize: 12, color: nx.muted }}>Tip</div>
                <div style={{ marginTop: 4, lineHeight: 1.5 }}>
                  Studio mode uses Layers + Toolbar. No scene logic changed.
                </div>
              </div>
            </div>
          </aside>
        ) : null}

        {/* CENTER STAGE */}
        <main
          id="nexora-stage"
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            position: "relative",
            overflow: "hidden",
            background: "radial-gradient(90% 80% at 50% 20%, #0b1726 0%, #081220 54%, #060d17 100%)",
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
                background: "rgba(15,23,42,0.68)",
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
                      background: "rgba(2,6,23,0.45)",
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
                    background: "rgba(2,6,23,0.45)",
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
        </main>

        {/* RIGHT RAIL (placeholder for inspector/chat later) */}
        <aside
          id="nexora-right-rail"
          style={{
            width: isInspectorOpen ? 360 : 56,
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            borderLeft: `1px solid ${nx.border}`,
            background: "rgba(15, 23, 42, 0.62)",
            backdropFilter: "blur(10px)",
            minWidth: 0,
          }}
        >
          <div
            id="nexora-inspector"
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
          <div
            id="nexora-inspector-header"
            style={{
              padding: 12,
              borderBottom: `1px solid ${nx.border}`,
              color: nx.text,
              fontWeight: 700,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: isInspectorOpen ? 10 : 0 }}>
              <div style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {isInspectorOpen ? `Inspector · ${activeGroupConfig?.label ?? sectionTitle}` : "Inspector"}
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
                  background: "rgba(2,6,23,0.5)",
                  color: nx.muted,
                  cursor: "pointer",
                  flex: "0 0 auto",
                }}
              >
                {isInspectorOpen ? "⟩" : "⟨"}
              </button>
            </div>
            {isInspectorOpen ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {activeSubTabs.map((tab) => {
                  const isActive = resolvedActiveSection === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      title={tab.label}
                      aria-label={tab.label}
                      onClick={() => setInspectorSection(tab.key, tab.eventTab)}
                      style={{
                        height: 30,
                        borderRadius: 999,
                        padding: "0 10px",
                        border: isActive
                          ? "1px solid rgba(96,165,250,0.35)"
                          : `1px solid ${nx.border}`,
                        background: isActive
                          ? "rgba(59,130,246,0.14)"
                          : "rgba(15,23,42,0.72)",
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
                flex: 1,
                minHeight: 0,
                overflow: "auto",
                padding: 12,
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
                      background: "rgba(15,23,42,0.78)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      Scene Overview
                    </div>
                    <div style={{ color: "#cbd5e1", fontSize: 12 }}>
                      System-wide state and current operational context
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid ${nx.border}`,
                      background: "rgba(15,23,42,0.78)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      System Health
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ color: "#94a3b8" }}>Fragility</span>
                      <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{fragilityScore.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ color: "#94a3b8" }}>Level</span>
                      <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{fragilityLevel}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ color: "#94a3b8" }}>Volatility</span>
                      <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{volatility.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ color: "#94a3b8" }}>Risk drivers</span>
                      <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{driverEntries.length}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      border: `1px solid ${nx.border}`,
                      background: "rgba(2,6,23,0.45)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      Dominant Signal
                    </div>
                    <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700 }}>
                      {dominantDriver ? `Dominant driver: ${dominantDriver.key}` : "No dominant system signal detected yet."}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      border: `1px solid ${nx.border}`,
                      background: "rgba(2,6,23,0.45)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      Active Context
                    </div>
                    <div style={{ color: "#cbd5e1", fontSize: 12 }}>
                      Active loop: {inspectorContext?.activeLoopId ?? "-"}
                    </div>
                    <div style={{ color: "#cbd5e1", fontSize: 12 }}>
                      Scene mode: {inspectorContext?.activeMode ?? "-"}
                    </div>
                    <div style={{ color: "#cbd5e1", fontSize: 12 }}>
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
                      background: "rgba(15,23,42,0.78)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      Objects
                    </div>
                    <div style={{ color: "#cbd5e1", fontSize: 12 }}>
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
                            border: isFocused ? "1px solid rgba(96,165,250,0.35)" : `1px solid ${nx.border}`,
                            background: isFocused ? "rgba(59,130,246,0.14)" : "rgba(2,6,23,0.45)",
                            color: "#e2e8f0",
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
                            <span style={{ color: isFocused ? "#93c5fd" : "#94a3b8", fontSize: 11 }}>
                              {isFocused ? "Focused" : "Focus"}
                            </span>
                          </div>
                          <div style={{ color: "#94a3b8", fontSize: 11 }}>ID: {id}</div>
                          <div style={{ color: "#cbd5e1", fontSize: 12 }}>
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
                        background: "rgba(2,6,23,0.45)",
                        color: "#64748b",
                        fontSize: 12,
                      }}
                    >
                      No scene objects available yet.
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
                      background: "rgba(15,23,42,0.78)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      Focus
                    </div>
                    <div style={{ color: "#cbd5e1", fontSize: 12 }}>
                      Current object under analysis
                    </div>
                  </div>

                  {!focusedObjectId ? (
                    <div
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        border: `1px solid ${nx.border}`,
                        background: "rgba(2,6,23,0.45)",
                        color: "#64748b",
                        fontSize: 12,
                        lineHeight: 1.5,
                      }}
                    >
                      No focused object yet. Click an object in the scene or choose one from the Objects tab.
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          padding: 12,
                          borderRadius: 12,
                          border: `1px solid ${nx.border}`,
                          background: "rgba(15,23,42,0.78)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <div style={{ color: "#e2e8f0", fontSize: 16, fontWeight: 800 }}>
                          {String(focusedObject?.label ?? selectedObjectInfo?.label ?? prettyObjectName(focusedObjectId))}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: 11 }}>ID: {focusedObjectId}</div>
                        <div style={{ color: "#cbd5e1", fontSize: 12 }}>
                          Type: {String(focusedObject?.type ?? selectedObjectInfo?.type ?? "-")}
                        </div>
                        <div style={{ color: "#cbd5e1", fontSize: 12 }}>
                          Emphasis: {Number(focusedObject?.emphasis ?? selectedObjectInfo?.override?.emphasis ?? 0).toFixed(2)}
                        </div>
                        <div style={{ color: "#cbd5e1", fontSize: 12 }}>
                          Focus mode: {String(inspectorContext?.focusPinned ? "Pinned" : inspectorContext?.focusMode ?? "selected")}
                        </div>
                      </div>

                      <div
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          border: `1px solid ${nx.border}`,
                          background: "rgba(2,6,23,0.45)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                          Drivers And Reasoning
                        </div>
                        <div style={{ color: "#cbd5e1", fontSize: 12 }}>
                          {focusReasoning
                            ? `Priority ${Number(focusReasoning?.score ?? 0).toFixed(2)} · ${String(focusReasoning?.why ?? "Focused by system relevance")}`
                            : "No focused-object reasoning available yet."}
                        </div>
                        {Array.isArray(selectedObjectInfo?.tags) && selectedObjectInfo.tags.length ? (
                          <div style={{ color: "#93c5fd", fontSize: 11 }}>
                            Tags: {selectedObjectInfo.tags.join(", ")}
                          </div>
                        ) : null}
                      </div>

                      <div
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          border: `1px solid ${nx.border}`,
                          background: "rgba(2,6,23,0.45)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                          Suggested Actions
                        </div>
                        {focusedAdvice.length ? (
                          focusedAdvice.slice(0, 3).map((a: any, idx: number) => (
                            <div key={idx} style={{ color: "#e2e8f0", fontSize: 12 }}>
                              {a?.action ?? "Action"}
                            </div>
                          ))
                        ) : (
                          <div style={{ color: "#64748b", fontSize: 12 }}>
                            No direct strategic action targets this object yet.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : mode === "dashboard" && resolvedActiveSection === "timeline" ? (
                <div id="nexora-inspector-timeline-host" style={{ width: "100%", height: "100%" }} />
              ) : mode === "dashboard" && resolvedActiveSection === "conflict" ? (
                <div id="nexora-inspector-conflict-host" style={{ width: "100%", height: "100%" }} />
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
                      background: "rgba(2,6,23,0.5)",
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
                flex: 1,
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
                  background: "rgba(2,6,23,0.5)",
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
                padding: 10,
                borderTop: `1px solid ${nx.border}`,
              }}
            />
          ) : null}
          {/* Chat Dock below Inspector */}
          {isInspectorOpen && isChatOpen ? (
            <div
              id="nexora-chat-dock"
              style={{
                flex: "0 0 auto",
                minHeight: 0,
                borderTop: `1px solid ${nx.border}`,
                background: "rgba(15, 23, 42, 0.55)",
                overflow: "hidden",
              }}
            >
              <div
                id="nexora-chat-panel"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: 280,
                  minHeight: 0,
                }}
              >
                <div
                  style={{
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    borderBottom: `1px solid ${nx.border}`,
                  }}
                >
                  <div style={{ color: nx.text, fontWeight: 700, fontSize: 13 }}>Chat</div>
                  <button
                    type="button"
                    onClick={() => setIsChatOpen(false)}
                    title="Hide chat"
                    aria-label="Hide chat"
                    style={{
                      height: 28,
                      padding: "0 10px",
                      borderRadius: 8,
                      border: `1px solid ${nx.border}`,
                      background: "rgba(2,6,23,0.45)",
                      color: nx.muted,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Hide
                  </button>
                </div>

                <div
                  id="nexora-chat-scroll"
                  style={{
                    flex: 1,
                    minHeight: 0,
                    overflow: "auto",
                    padding: 10,
                    overscrollBehavior: "contain",
                    WebkitOverflowScrolling: "touch",
                  }}
                  onWheelCapture={(e) => e.stopPropagation()}
                  onTouchMoveCapture={(e) => e.stopPropagation()}
                >
                  {renderedChatMessages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        marginBottom: 8,
                        display: "flex",
                        justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "92%",
                          padding: "8px 10px",
                          borderRadius: 12,
                          border: `1px solid ${nx.border}`,
                          background:
                            m.role === "user" ? "rgba(96,165,250,0.14)" : "rgba(2,6,23,0.45)",
                          color: m.role === "user" ? nx.text : nx.muted,
                          fontSize: 12,
                          lineHeight: 1.4,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: 10,
                    borderTop: `1px solid ${nx.border}`,
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <input
                    id="nexora-chat-input"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendChat();
                    }}
                    placeholder="Ask about system pressure or try a demo prompt..."
                    style={{
                      flex: 1,
                      minWidth: 0,
                      height: 34,
                      borderRadius: 12,
                      border: `1px solid ${nx.border}`,
                      outline: "none",
                      padding: "0 12px",
                      background: "rgba(2,6,23,0.55)",
                      color: nx.text,
                      fontSize: 12,
                    }}
                  />
                  <button
                    type="button"
                    onClick={sendChat}
                    style={{
                      height: 34,
                      padding: "0 12px",
                      borderRadius: 8,
                      border: "1px solid rgba(96,165,250,0.35)",
                      background: "rgba(59,130,246,0.2)",
                      color: "#dbeafe",
                      cursor: "pointer",
                      fontSize: 12,
                      flex: "0 0 auto",
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : isInspectorOpen && !isChatOpen ? (
            <div
              id="nexora-chat-dock"
              style={{
                flex: "0 0 auto",
                borderTop: `1px solid ${nx.border}`,
                padding: 10,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                title="Show chat"
                aria-label="Show chat"
                style={{
                  height: 32,
                  padding: "0 12px",
                  borderRadius: 8,
                  border: `1px solid ${nx.border}`,
                  background: "rgba(2,6,23,0.45)",
                  color: nx.muted,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Show Chat
              </button>
            </div>
          ) : null}
          </div>
        </aside>
      </div>

      {/* BOTTOM BAR */}
      <div
        id="nexora-bottom-bar"
        style={{
          height: 44,
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          borderTop: `1px solid ${nx.border}`,
          background: "rgba(15,23,42,0.72)",
          backdropFilter: "blur(8px)",
          color: nx.muted,
          fontSize: 12,
        }}
      >
        <div id="nexora-replay-bar">Timeline · Replay · Snapshots</div>
      </div>

      {/* Chat dock lives inside #nexora-right-rail */}
    </div>
  );
}
