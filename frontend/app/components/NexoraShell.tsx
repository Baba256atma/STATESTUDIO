"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FragilityScannerMini } from "./scanner/FragilityScannerMini";
import { nx } from "./ui/nexoraTheme";
import type { FragilityDriver, FragilityScanResponse } from "../types/fragilityScanner";
import { CommandHeader } from "./layout/CommandHeader";
import { normalizeStrategicCouncilResult } from "../lib/council/strategicCouncilClient";
import { useCustomerDemoMode } from "../lib/demo/useCustomerDemoMode";
import { buildExecutiveNarrative } from "../lib/narrative/narrativeBuilder";
import { CustomerDemoSelector } from "./demo/CustomerDemoSelector";
import { StrategicAssistantDrawer } from "./assistant/StrategicAssistantDrawer";

type NexoraShellProps = {
  children: React.ReactNode;
};

type LeftNavGroupKey = "scene_group" | "strategy_group" | "risk_group" | "workflow_group" | "executive_group";
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
  | "war_room"
  | "collaboration"
  | "workspace";
type CanonicalPanelOpenView =
  | "scene"
  | "dashboard"
  | "object"
  | "timeline"
  | "conflict"
  | "advice"
  | "risk"
  | "replay"
  | "war_room"
  | "collaboration"
  | "workspace"
  | "memory";
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

function mapInspectorEventTabToCanonicalView(
  eventTab: InspectorEventTab | null | undefined
): CanonicalPanelOpenView | null {
  if (!eventTab) return null;
  if (eventTab === "object_focus") return "object";
  if (eventTab === "memory_insights") return "memory";
  if (eventTab === "risk_flow") return "risk";
  if (eventTab === "strategic_advice") return "advice";
  if (eventTab === "executive_dashboard") return "dashboard";
  if (eventTab === "opponent_moves" || eventTab === "strategic_patterns") return "workspace";
  return eventTab;
}

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
  if (section === "risk" || section === "conflict" || section === "risk_flow") return "risk_group";
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
      { key: "conflict", label: "Conflict", eventTab: "conflict" },
      { key: "risk_flow", label: "Risk Flow", eventTab: "risk_flow" },
      { key: "risk", label: "Fragility" },
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
  return "Ask about pressure, fragility, risk, or the next best move";
}

export default function NexoraShell({ children }: NexoraShellProps) {
  const [mode, setMode] = useState<"dashboard" | "studio">("dashboard");
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isAssistantDrawerOpen, setIsAssistantDrawerOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; role: "user" | "assistant"; text: string }>>([
    { id: "m1", role: "assistant", text: "Workspace ready. Enter a pressure prompt to analyze the current system." },
  ]);

  const sendChat = useCallback((overrideText?: string) => {
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
  const {
    activeProfile,
    activeProfileId,
    setActiveProfile,
    recommendedPrompts,
    heroSummary,
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
  const navItems = useMemo(
    () =>
      LEFT_NAV_ITEMS.filter(
        (item) => visibleNavGroupSet.size === 0 || visibleNavGroupSet.has(item.key)
      ),
    [visibleNavGroupSet]
  );
  const resolvedActiveSection = useMemo(() => {
    if (activeSection === "war_room") return activeSection;
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
  const activeGroupConfig = useMemo(() => {
    const fallbackGroupKey = navItems[0]?.key ?? "scene_group";
    const base = INSPECTOR_GROUPS[
      (visibleNavGroupSet.size === 0 || visibleNavGroupSet.has(activeNavGroup)
        ? activeNavGroup
        : fallbackGroupKey) as LeftNavGroupKey
    ];
    const filteredTabs = (base?.tabs ?? []).filter(
      (tab) => tab.key === "war_room" || visibleSectionSet.size === 0 || visibleSectionSet.has(tab.key)
    );
    return {
      ...(base ?? INSPECTOR_GROUPS.scene_group),
      tabs: filteredTabs.length > 0 ? filteredTabs : base?.tabs ?? [],
    };
  }, [activeNavGroup, navItems, visibleNavGroupSet, visibleSectionSet]);
  const activeSubTabs = useMemo(() => activeGroupConfig?.tabs ?? [], [activeGroupConfig]);
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
  const lastInsight = useMemo(() => {
    if (!inspectorContext?.responseData?.analysis_summary && !inspectorContext?.responseData?.executive_summary_surface?.summary && heroSummary) {
      return heroSummary;
    }
    const fromBackend = String(
      inspectorContext?.responseData?.analysis_summary ??
        inspectorContext?.responseData?.executive_summary_surface?.summary ??
        ""
    ).trim();
    if (fromBackend) return fromBackend;
    const assistantMessage = [...renderedChatMessages].reverse().find((message) => message.role === "assistant");
    return assistantMessage?.text ?? "Ask about pressure, fragility, risk, or the next best move.";
  }, [heroSummary, inspectorContext?.responseData?.analysis_summary, inspectorContext?.responseData?.executive_summary_surface?.summary, renderedChatMessages]);
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
  const handleFragilityScanComplete = useCallback((result: FragilityScanResponse) => {
    window.dispatchEvent(
      new CustomEvent("nexora:apply-fragility-scan", {
        detail: { result },
      })
    );
  }, []);
  const setInspectorSection = React.useCallback((section: ActiveSectionKey, eventTab?: InspectorEventTab) => {
    if (process.env.NODE_ENV !== "production" && eventTab === "executive_dashboard") {
      console.log("[Nexora] Dashboard clicked");
    }
    setActiveSection(section);
    setIsInspectorOpen(true);
    window.dispatchEvent(
      new CustomEvent<InspectorSectionChangedDetail>("nexora:inspector-section-changed", {
        detail: { section, eventTab: eventTab ?? null, source: "legacy-ui:user-nav" },
      })
    );
    if (eventTab) {
      const canonicalView = mapInspectorEventTabToCanonicalView(eventTab);
      window.dispatchEvent(
        new CustomEvent("nexora:open-right-panel", {
          detail: { view: canonicalView, tab: eventTab, source: "canonical-ui:user-nav" },
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
  const commandPlaceholder = useMemo(() => buildCommandPlaceholder(activeProfile, domainExperience), [activeProfile, domainExperience]);
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
    sendChat(text);
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
      else if (tab === "war_room") setActiveSection("war_room");
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
      else if (tab === "war_room") setActiveSection("war_room");
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
      <CommandHeader
        scenarioLabel={scenarioLabel}
        activeModeLabel={activeModeLabel}
        contextLabel={headerContextLabel ?? domainExperience?.label ?? null}
        statusLabel={systemStatus.label}
        statusTone={systemStatus.tone}
        councilSummary={councilSummary}
        systemStateSummary={executiveNarrative.systemStateSummary}
        keyRiskStatement={executiveNarrative.keyRiskStatement}
        decisionHeadline={executiveNarrative.decisionHeadline}
        topDriverLabel={executiveNarrative.topDriverLabel}
        profileSelector={<CustomerDemoSelector activeProfileId={activeProfileId} onChange={setActiveProfile} />}
        commandValue={chatInput}
        commandPlaceholder={commandPlaceholder}
        onCommandChange={setChatInput}
        onCommandSubmit={sendChat}
        onLoadDemo={handleLoadDemo}
        onSnapshot={handleSaveSnapshot}
        onReplay={handleOpenReplay}
      />

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
            width: 108,
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            padding: "16px 12px",
            borderRight: `1px solid ${nx.border}`,
            background: "linear-gradient(180deg, rgba(7,16,25,0.96), rgba(8,16,28,0.9))",
            backdropFilter: "blur(10px)",
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
              textAlign: "left",
            }}
          >
            System Nav
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
                    height: 62,
                    borderRadius: 16,
                    border: isActive
                      ? "1px solid rgba(96,165,250,0.45)"
                      : `1px solid ${nx.border}`,
                    background: isActive
                      ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(15,23,42,0.88))"
                      : "rgba(2,6,23,0.52)",
                    color: isActive ? nx.text : nx.muted,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 700,
                    boxShadow: isActive ? "inset 0 0 0 1px rgba(96,165,250,0.16), 0 12px 24px rgba(2,6,23,0.24)" : "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 3,
                    padding: "0 12px",
                    transition: "transform 180ms ease, border-color 180ms ease, background 180ms ease",
                    transform: isActive ? "translateX(2px)" : "translateX(0px)",
                  }}
                  aria-pressed={isActive}
                >
                  <span style={{ fontSize: 10, letterSpacing: "0.12em", lineHeight: 1, textTransform: "uppercase", color: isActive ? "#bfdbfe" : nx.lowMuted }}>
                    {item.short}
                  </span>
                  <span style={{ fontSize: 12, lineHeight: 1.2, textAlign: "left" }}>{item.label}</span>
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
            width: isInspectorOpen ? (resolvedActiveSection === "executive" ? 420 : 388) : 56,
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            borderLeft: `1px solid ${nx.border}`,
            background: "linear-gradient(180deg, rgba(15,23,42,0.78), rgba(8,16,28,0.82))",
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
                {isInspectorOpen ? `Executive Rail · ${activeGroupConfig?.label ?? sectionTitle}` : "Rail"}
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
                          ? "linear-gradient(135deg, rgba(59,130,246,0.16), rgba(15,23,42,0.76))"
                          : "rgba(15,23,42,0.72)",
                        color: isActive ? nx.text : nx.muted,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 180ms ease",
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
                      {dominantDriver ? `Primary pressure: ${dominantDriver.key}` : "No dominant system pressure is active right now."}
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
                      No object is in executive focus yet. Select one in the scene or use the Objects surface to set focus.
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
                            : "Nexora has not built a strong focus explanation for this object yet."}
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
                      background: "rgba(15,23,42,0.78)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
                      Fragility Scanner
                    </div>
                    <div style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.5 }}>
                      Scan a short business update to reveal fragility level, weak points, and the drivers worth inspecting first.
                    </div>
                    {fragilityScanResult ? (
                      <div style={{ color: "#94a3b8", fontSize: 11 }}>
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
          </div>
        </aside>
      </div>

      <div
        style={{
          position: "absolute",
          right: 16,
          bottom: 58,
          zIndex: 8,
          pointerEvents: "auto",
        }}
      >
        <StrategicAssistantDrawer
          isOpen={isAssistantDrawerOpen}
          onToggle={toggleAssistantDrawer}
          title="Strategic Assistant"
          subtitle={`Current read: ${lastInsight}`}
          profileLabel={activeProfile?.label ?? null}
          messages={renderedChatMessages}
          promptChips={displayPrompts}
          inputValue={chatInput}
          inputPlaceholder={commandPlaceholder}
          onInputChange={setChatInput}
          onSubmit={handleAssistantSubmit}
          onPromptSelect={submitPresetPrompt}
          isBusy={renderedChatMessages[renderedChatMessages.length - 1]?.text === "Analyzing..."}
        />
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
