"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { clamp, round2 } from "../lib/sizeCommands";
import type { LoopType, SceneLoop } from "../lib/sceneTypes";
import type { LayoutMode } from "../lib/contracts";
import { computeKpiSuggestions } from "../lib/kpi/kpiSuggestions";
import { formatLoopLabel, getLoopEdgePairs, loopStrength } from "./chatHudLoops";
import {
  useSelectedId,
  useSetSelectedId,
  useSetOverride,
  useClearOverride,
  useOverrides,
  useRedoOverrides,
  useUndoOverrides,
  useSetCaption,
  useToggleCaption,
  useViewMode,
  useSetViewMode,
  useSetChatOffset,
} from "./SceneContext";
import { nx } from "./ui/nexoraTheme";

const STORAGE_KEY = "statestudio.chatHUD.v1";
const SESSION_MESSAGES_KEY = "statestudio.chatHUD.sessionMessages.v1";

type Msg = { id?: string; role: "user" | "assistant"; text: string };

type ChatHUDProps = {
  messages: Msg[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  activeMode: string;
  onUndo: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  loading: boolean;
  sourceLabel: string | null;
  noSceneUpdate: boolean;
  prefs: {
    theme: "day" | "night" | "stars";
    starDensity: number;
    showGrid: boolean;
    showAxes: boolean;
    orbitMode: "auto" | "manual";
    globalScale: number;
    overridePolicy?: "keep" | "match" | "clear";
  };
  onPrefsChange: (next: {
    theme: "day" | "night" | "stars";
    starDensity: number;
    showGrid: boolean;
    showAxes: boolean;
    orbitMode: "auto" | "manual";
    globalScale: number;
    overridePolicy?: "keep" | "match" | "clear";
  }) => void;
  objects?: { id: string; label: string; type?: string }[];
  lastActionsCount?: number;
  onReplayEvents?: () => void;
  replaying?: boolean;
  replayError?: string | null;
  onPingBackend?: () => void;
  healthInfo?: string | null;
  analysisSummary?: string | null;
  sceneWarn?: string | null;
  focusPinned?: boolean;
  focusMode?: "all" | "selected";
  onToggleFocusMode?: () => void;
  onTogglePinFocus?: () => void;
  onClearFocus?: () => void;
  focusedId?: string | null;
  selectedObjectInfo?: {
    id: string;
    label: string;
    summary?: string;
    tags?: string[];
  } | null;
  onAskAboutSelected?: () => void;
  loopState?: SceneLoop[];
  kpi?: { inventory?: number; delivery?: number; risk?: number } | null;
  loopsCount?: number;
  showLoops?: boolean;
  onToggleLoops?: () => void;
  showLoopLabels?: boolean;
  onToggleLoopLabels?: () => void;
  onAddLoopFromTemplate?: (type: LoopType) => void;
  onAddInventoryInstance?: () => void;
  simRunning?: boolean;
  simSpeed?: number;
  onToggleSimRunning?: () => void;
  onSimStep?: () => void;
  onSetSimSpeed?: (v: number) => void;
  simLastError?: string | null;
  embedded?: boolean;
  resolveObjectLabel?: (id: string) => string;
  layoutMode?: LayoutMode;
};

export function ChatHUD({
  messages,
  input,
  onInputChange,
  onSend,
  activeMode,
  loading,
  sourceLabel,
  noSceneUpdate,
  prefs,
  onPrefsChange,
  objects,
  lastActionsCount,
  onReplayEvents,
  replaying,
  replayError,
  onPingBackend,
  healthInfo,
  analysisSummary,
  sceneWarn,
  focusPinned,
  onClearFocus,
  focusedId,
  loopState,
  kpi,
  loopsCount,
  showLoops,
  onToggleLoops,
  showLoopLabels,
  onToggleLoopLabels,
  onAddLoopFromTemplate,
  onAddInventoryInstance,
  simRunning,
  simSpeed,
  onToggleSimRunning,
  onSimStep,
  onSetSimSpeed,
  simLastError,
  embedded = true,
  resolveObjectLabel,
  layoutMode,
}: ChatHUDProps) {
  const viewMode = useViewMode();
  const setViewMode = useSetViewMode();
  const setChatOffset = useSetChatOffset();
  const [selectedTemplate, setSelectedTemplate] = useState<LoopType | "">("");
  const [showProps, setShowProps] = useState<boolean>(false);
  const [hoverBtn, setHoverBtn] = useState<string | null>(null);
  const [insightsOpen, setInsightsOpen] = useState<boolean>(false);
  const [dismissedSuggestionIds, setDismissedSuggestionIds] = useState<Record<string, boolean>>({});
  type KpiAlert = { id: string; level: "info" | "warn"; text: string };
  const [kpiAlerts, setKpiAlerts] = useState<KpiAlert[]>([]);
  const prevKpiRef = useRef<{ inventory?: number; delivery?: number; risk?: number } | null>(null);
  const prevLoopsCountRef = useRef<number | null>(null);
  const FIXED_POS = { x: 16, y: 72 };

  const panelRef = useRef<HTMLDivElement>(null);

  // Scene context hooks: declare early so effects can safely reference them
  const selectedId = useSelectedId();
  const setSelectedId = useSetSelectedId();
  const setOverride = useSetOverride();
  const clearOverride = useClearOverride();
  const overrides = useOverrides();
  const setCaption = useSetCaption();
  const toggleCaption = useToggleCaption();
  const selectedOverrideValue = selectedId ? overrides[selectedId]?.scale ?? 1 : 1;
  const kpiItems: { key: "inventory" | "delivery" | "risk"; label: string; value: number | undefined }[] = [
    { key: "inventory", label: "Inv", value: kpi?.inventory },
    { key: "delivery", label: "Del", value: kpi?.delivery },
    { key: "risk", label: "Risk", value: kpi?.risk },
  ];
  const loopTemplateOptions: LoopType[] = [
    "quality_protection",
    "cost_compression",
    "delivery_customer",
    "risk_ignorance",
    "stability_balance",
  ];

  const LOOP_IMPACT: Record<LoopType, { inventory?: number; delivery?: number; risk?: number }> = {
    quality_protection: { risk: -1, delivery: +0.4 },
    cost_compression: { inventory: -0.2, risk: +0.3 },
    delivery_customer: { delivery: +1, inventory: -0.1 },
    risk_ignorance: { risk: +1 },
    stability_balance: { risk: -0.6, delivery: +0.2 },
  };

  const getLoopTypeSafe = (l: any): LoopType | null => {
    const t = l?.type;
    if (typeof t === "string") return t as LoopType;
    const id = typeof l?.id === "string" ? l.id : "";
    const hit = loopTemplateOptions.find((opt) => id.includes(opt));
    return (hit ?? null) as LoopType | null;
  };

  const strongestLoops = useMemo(() => {
    if (!Array.isArray(loopState)) return [] as SceneLoop[];
    return [...loopState]
      .filter(Boolean)
      .sort((a, b) => loopStrength(b) - loopStrength(a));
  }, [loopState]);

  const topLoops = useMemo(() => {
    if (!Array.isArray(loopState)) return [];
    return [...loopState]
      .filter(Boolean)
      .sort((a, b) => loopStrength(b) - loopStrength(a))
      .slice(0, 3);
  }, [loopState]);

  const kpiExplain = useMemo(() => {
    const keys: Array<{ key: "inventory" | "delivery" | "risk"; title: string }> = [
      { key: "inventory", title: "Inventory" },
      { key: "delivery", title: "Delivery" },
      { key: "risk", title: "Risk" },
    ];

    const pickDrivers = (k: "inventory" | "delivery" | "risk") => {
      const candidates = strongestLoops
        .map((l) => ({ l, t: getLoopTypeSafe(l) }))
        .filter((x) => x.t && LOOP_IMPACT[x.t][k] !== undefined)
        .slice(0, 2)
        .map((x) => formatLoopLabel(x.l, resolveObjectLabel));

      if (candidates.length) return candidates;
      return topLoops.slice(0, 2).map((l) => formatLoopLabel(l, resolveObjectLabel));
    };

    return keys.map(({ key, title }) => {
      const v = kpi?.[key];
      const drivers = pickDrivers(key);
      const vTxt = v === undefined ? "—" : `${Math.round(v * 100)}%`;

      // Lightweight, user-friendly statement (rule-based for now)
      const reason = drivers.length ? `Drivers: ${drivers.join(" • ")}` : "Drivers: —";
      return { key, title, vTxt, reason };
    });
  }, [kpi, strongestLoops, topLoops]);

  const kpiSuggestions = useMemo(
    () => computeKpiSuggestions({ kpi, loopsCount }),
    [kpi, loopsCount]
  );
  const visibleSuggestions = useMemo(
    () => kpiSuggestions.filter((s) => !dismissedSuggestionIds[s.id]).slice(0, 3),
    [kpiSuggestions, dismissedSuggestionIds]
  );
  useEffect(() => {
    const prev = prevKpiRef.current;
    const curr = kpi ?? null;

    const nextAlerts: KpiAlert[] = [];

    const push = (level: KpiAlert["level"], text: string) => {
      nextAlerts.push({ id: `a_${Date.now()}_${Math.random().toString(16).slice(2)}`, level, text });
    };

    if (curr) {
      const risk = curr.risk;
      const delivery = curr.delivery;
      const inv = curr.inventory;

      // Threshold-crossing alerts (only when crossing upward/downward, not every render)
      if (typeof risk === "number" && (!prev || (typeof prev.risk === "number" ? prev.risk : 0) < 0.75) && risk >= 0.75) {
        push("warn", "Risk is high — consider activating protection/stability loops.");
      }

      if (typeof delivery === "number" && (!prev || (typeof prev.delivery === "number" ? prev.delivery : 1) > 0.35) && delivery <= 0.35) {
        push("warn", "Delivery is low — consider customer/delivery reinforcement loop.");
      }

      if (typeof inv === "number" && (!prev || (typeof prev.inventory === "number" ? prev.inventory : 0) < 0.75) && inv >= 0.75) {
        push("info", "Inventory is rising — monitor cost vs. stock stability.");
      }
    }

    if (typeof loopsCount === "number") {
      const prevLc = prevLoopsCountRef.current;
      if (typeof prevLc === "number" && loopsCount > prevLc) {
        push("info", `Loop added — total loops: ${loopsCount}.`);
      }
      prevLoopsCountRef.current = loopsCount;
    }

    prevKpiRef.current = curr;

    if (nextAlerts.length) {
      setKpiAlerts((old) => [...nextAlerts, ...old].slice(0, 4));
    }
  }, [kpi, loopsCount]);
  const [objectsOpen, setObjectsOpen] = useState(false);
  const [objectSearch, setObjectSearch] = useState("");
  const undoOverrides = useUndoOverrides();
  const redoOverrides = useRedoOverrides();
  const loadedRef = useRef(false);
  const safeMessages = Array.isArray(messages) ? messages : [];
  const [uiMessages, setUiMessages] = useState<Msg[]>(() => (Array.isArray(messages) ? messages : []));
  const didHydrateRef = useRef(false);

  // Keep UI history stable. Only adopt incoming messages when they are not shorter than what the UI already shows.
  useEffect(() => {
    setUiMessages((prev) => {
      if (!Array.isArray(safeMessages)) return prev;
      if (safeMessages.length >= prev.length) return safeMessages;
      return prev;
    });
  }, [safeMessages]);

  // Restore session messages after hydration to avoid SSR/CSR mismatch.
  useEffect(() => {
    if (didHydrateRef.current) return;
    didHydrateRef.current = true;

    // Only restore when parent didn't provide messages (common on deselection) and we have something in session.
    if (safeMessages.length) return;

    try {
      const raw = window.sessionStorage.getItem(SESSION_MESSAGES_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        setUiMessages(parsed as Msg[]);
      }
    } catch {
      // ignore
    }
  }, [safeMessages.length]);

  // Persist in-session chat history (only after hydration) so it survives ChatHUD remounts.
  useEffect(() => {
    if (!didHydrateRef.current) return;
    try {
      window.sessionStorage.setItem(SESSION_MESSAGES_KEY, JSON.stringify(uiMessages));
    } catch {
      // ignore
    }
  }, [uiMessages]);

  const lastMessage = uiMessages.length ? uiMessages[uiMessages.length - 1] : null;
  const updateChatOffsetFromPos = React.useCallback(
    (nextPos: { x: number; y: number }) => {
      const rect = panelRef.current?.getBoundingClientRect();
      const w = rect?.width ?? 360;
      const h = rect?.height ?? 260;
      const cx = nextPos.x + w / 2;
      const cy = nextPos.y + h / 2;

      const nx = window.innerWidth ? (cx - window.innerWidth / 2) / (window.innerWidth / 2) : 0;
      const ny = window.innerHeight ? (cy - window.innerHeight / 2) / (window.innerHeight / 2) : 0;

      const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));
      setChatOffset({ x: clamp1(nx), y: clamp1(ny) });
    },
    [setChatOffset]
  );

  const lastAssistantMessage = useMemo(() => {
    for (let i = uiMessages.length - 1; i >= 0; i -= 1) {
      const m = uiMessages[i];
      if (m?.role === "assistant") return m;
    }
    return null;
  }, [uiMessages]);

  // View rules (messenger style):
  // - full: show conversation history + panels
  // - input: show conversation history (same as full) but smaller height
  // - hidden: no body (input bar still visible)
  // IMPORTANT: We should never auto-hide the message history just because no object is selected.
  const visibleMessages = uiMessages;

  // If some parent logic (or a previous state) ends up putting us in "hidden" while nothing is selected,
  // force the chat back to a usable messenger-like state.
  useEffect(() => {
    if (!selectedId && viewMode === "hidden") {
      setViewMode("input");
    }
  }, [selectedId, viewMode, setViewMode]);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);

      if (saved?.viewMode === "full" || saved?.viewMode === "input") {
        setViewMode(saved.viewMode);
      }
    } catch {
      // ignore
    }
    // only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setViewMode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ viewMode }));
    } catch {
      // ignore
    }
  }, [viewMode]);

  useEffect(() => {
    const onResize = () => updateChatOffsetFromPos(FIXED_POS);
    window.addEventListener("resize", onResize);
    updateChatOffsetFromPos(FIXED_POS);
    return () => window.removeEventListener("resize", onResize);
  }, [viewMode, updateChatOffsetFromPos]);

  useEffect(() => {
    if (viewMode === "hidden") {
      setChatOffset({ x: 0, y: 0 });
    }
  }, [viewMode, setChatOffset]);

  // Auto view-mode from selection (respect pin)
  // Selecting an object should always open ":" unless focus is pinned.
  useEffect(() => {
    if (focusPinned) return;

    if (selectedId) {
      setViewMode("input");
    }
  }, [selectedId, focusPinned, setViewMode]);

  // In StateStudio we almost always render ChatHUD inside a panel (HUDShell/HUDPanels).
  // To avoid the composer (input+buttons) being clipped or rendered outside the parent,
  // treat ChatHUD as embedded by default unless the caller *explicitly* opts into overlay mode.
  const isPanelLayout = layoutMode === "split" || layoutMode === "floating";
  const effectiveEmbedded = embedded !== false || isPanelLayout;
  const isSplitLayout = layoutMode === "split";
  const panelStyle: React.CSSProperties = useMemo(() => {
    const base: React.CSSProperties = {
      position: "absolute",
      left: FIXED_POS.x,
      top: FIXED_POS.y,
      width: "min(520px, 96vw)",
      height:
        viewMode === "hidden"
          ? 220
          : viewMode === "input"
          ? insightsOpen
            ? "min(520px, 70vh)"
            : "min(380px, 48vh)"
          : "min(520px, 70vh)",
      minHeight:
        viewMode === "hidden"
          ? 200
          : viewMode === "input"
          ? insightsOpen
            ? 360
            : 280
          : 300,
      background: nx.bgHud,
      borderRadius: 16,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      color: nx.text,
      border: `1px solid ${nx.borderSoft}`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      zIndex: 1000,
      boxShadow: nx.shadowDrawer,
      userSelect: "none",
      pointerEvents: "auto",
      opacity: viewMode === "hidden" ? 0.98 : 1,
      visibility: "visible",
      transition: "height 220ms ease, min-height 220ms ease, opacity 180ms ease, transform 220ms ease",
      willChange: "height, min-height, opacity, transform",
      transform: viewMode === "hidden" ? "translateY(6px)" : "translateY(0px)",
    };

    if (!effectiveEmbedded) return base;

    return {
      ...base,
      position: "relative",
      left: undefined,
      top: undefined,
      width: "100%",
      height: "100%",
      minHeight: 0,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxSizing: "border-box",
      pointerEvents: "auto",
      zIndex: 60,
      transform: "none",
      userSelect: "none",
    };
  }, [effectiveEmbedded, viewMode, insightsOpen, layoutMode]);

  // Auto-scroll to the latest message
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastAutoAskedId = useRef<string | null>(null);
  const lastHintObjectIdRef = useRef<string | null>(null);
  const stickToBottomRef = useRef(true);

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Nexora][EventBinding] skipped_null_target", {
          file: "frontend/app/components/ChatHUD.tsx",
          function: "ChatHUD.useEffect(messagesScrollRef)",
          targetName: "messagesScrollRef",
        });
      }
      return;
    }

    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      stickToBottomRef.current = distanceFromBottom <= 120;
    };

    el.addEventListener("scroll", onScroll);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (viewMode === "hidden") return;
    if (!stickToBottomRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [uiMessages, loading, viewMode]);

  useEffect(() => {
    if (!selectedId) return;
    if (viewMode !== "full") return;
    if (showProps) return;
    if (loading) return;
    if (lastAutoAskedId.current === selectedId) return;
    lastAutoAskedId.current = selectedId;
    onInputChange("Tell me about the selected object.");
  }, [selectedId, viewMode, showProps, loading, onInputChange]);

  useEffect(() => {
    const id = focusedId ?? selectedId ?? null;
    if (!id) return;
    if (lastHintObjectIdRef.current === id) return;
    lastHintObjectIdRef.current = id;
    const label = resolveObjectLabel?.(id) ?? id;
    setUiMessages((prev) => [...prev, { role: "assistant", text: `Selected: ${label}. Ask about ${label}.` }]);
  }, [focusedId, selectedId, resolveObjectLabel]);

  function updatePrefs(partial: Partial<typeof prefs>) {
    onPrefsChange({ ...prefs, ...partial });
  }

  const isSendDisabled = !(input ?? "").trim() || loading;

  // If the 3D scene (OrbitControls / global listeners) captures wheel/touch events,
  // chat scrolling can feel "broken". We isolate scroll/wheel events inside ChatHUD.
  const stopSceneWheel = (e: React.WheelEvent) => {
    // Don't preventDefault — we still want the browser to scroll this container.
    e.stopPropagation();
  };

  const stopSceneTouchMove = (e: React.TouchEvent) => {
    // Same idea for touch devices.
    e.stopPropagation();
  };

  const handleSend = React.useCallback(() => {
    const text = (input ?? "").trim();
    if (!text || loading) return;

    // Optimistic UI append (so it works even when no object is selected)
    setUiMessages((prev) => [...prev, { id: `local-${Date.now()}`, role: "user", text }]);

    onSend();
  }, [input, loading, onSend]);

  const [moreOpen, setMoreOpen] = useState(false);

  const headerRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    rowGap: 8,
    flexWrap: "wrap",
    padding: "10px 12px 8px",
    borderBottom: `1px solid ${nx.border}`,
    overflow: "visible",
    flexShrink: 0,
    position: "relative",
    zIndex: 1,
  };

  const leftClusterStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    minWidth: 0,
    flex: 1,
    overflow: "visible",
  };

  const rightClusterStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    flexShrink: 0,
  };

  const pillStyle: React.CSSProperties = {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${nx.border}`,
    background: nx.bgPanelSoft,
    color: nx.text,
    cursor: "pointer",
    maxWidth: "min(420px, 72vw)",
    minWidth: 160,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
    lineHeight: 1.2,
    flexShrink: 1,
    display: "inline-flex",
    alignItems: "center",
  };

  const iconBtnStyle: React.CSSProperties = {
    height: 30,
    padding: "0 10px",
    borderRadius: 10,
    border: `1px solid ${nx.border}`,
    background: nx.bgPanelSoft,
    color: nx.textSoft,
    cursor: "pointer",
    fontSize: 12,
    flexShrink: 0,
  };

  const primaryBtnStyle: React.CSSProperties = {
    ...iconBtnStyle,
    background: nx.bgDeep,
  };

  const menuStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    top: "calc(100% + 8px)",
    minWidth: 240,
    maxWidth: 320,
    maxHeight: "min(60vh, 360px)",
    overflow: "hidden",
    borderRadius: 12,
    border: `1px solid ${nx.border}`,
    background: nx.popoverBg,
    boxShadow: nx.popoverShadow,
    padding: 8,
    zIndex: 5000,
  };

  const menuItemStyle: React.CSSProperties = {
    width: "100%",
    textAlign: "left",
    padding: "8px 10px",
    borderRadius: 10,
    border: "none",
    background: "transparent",
    color: nx.text,
    cursor: "pointer",
    fontSize: 13,
  };

  const moreWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = document.activeElement as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable) return;
      }
      const z = e.key.toLowerCase() === "z";
      const y = e.key.toLowerCase() === "y";
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (z && !e.shiftKey) {
        e.preventDefault();
        undoOverrides();
      } else if ((z && e.shiftKey) || (y && e.ctrlKey)) {
        e.preventDefault();
        redoOverrides();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undoOverrides, redoOverrides]);

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (moreWrapRef.current && t && !moreWrapRef.current.contains(t)) setMoreOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [moreOpen]);

  const outerStyle: React.CSSProperties = effectiveEmbedded
    ? {
        position: "relative",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",

        // IMPORTANT: embedded panels must be allowed to shrink inside flex parents.
        // If we force height/minHeight here, the input bar can render outside the parent.
        flex: 1,
        minHeight: 0,

        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        alignSelf: "stretch",
      }
    : {
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        // Overlay mode: allow the panel to position itself, but do not collapse the wrapper.
        // Collapsing to 0x0 can cause the composer to be invisible in some browsers/layouts.
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      };

  return (
    <div
      data-hud="chat"
      onWheelCapture={stopSceneWheel}
      onTouchMoveCapture={stopSceneTouchMove}
      style={outerStyle}
    >
      <div
        ref={panelRef}
        onWheelCapture={stopSceneWheel}
        onTouchMoveCapture={stopSceneTouchMove}
        style={{
          ...panelStyle,
          pointerEvents: "auto",
          ...(effectiveEmbedded ? { flex: "1 1 0%" } : null),
        }}
      >
        {/* Header */}
        <div style={headerRowStyle}>
          <div style={leftClusterStyle}>
            <div style={{ fontWeight: 700, letterSpacing: 0.2, flexShrink: 0 }}>Chat</div>

            {sceneWarn && process.env.NODE_ENV !== "production" ? (
              <span
                style={{
                  fontSize: 12,
                  opacity: 0.75,
                  maxWidth: "min(220px, 28vw)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {sceneWarn}
              </span>
            ) : null}
          </div>

          <div style={rightClusterStyle}>
            <button
              type="button"
              onClick={() => setInsightsOpen((v) => !v)}
              style={iconBtnStyle}
              title="Toggle KPI & loop insights"
            >
              {insightsOpen ? "Insights ▲" : "Insights ▼"}
            </button>

            <div ref={moreWrapRef} style={{ position: "relative" }}>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                style={primaryBtnStyle}
              >
                More ▾
              </button>

              {moreOpen && (
                <div style={menuStyle} onPointerDown={(e) => e.stopPropagation()}>
                  <div
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      fontSize: 12,
                      opacity: 0.85,
                      padding: "6px 10px",
                      background: nx.popoverBg,
                      borderBottom: `1px solid ${nx.borderSoft}`,
                    }}
                  >
                    {activeMode ? `Mode: ${activeMode}` : "Mode: —"}
                    {sourceLabel ? ` • ${sourceLabel}` : ""}
                    {healthInfo ? ` • ${healthInfo}` : ""}
                  </div>

                  <div style={{ maxHeight: "calc(min(60vh, 360px) - 44px)", overflowY: "auto", paddingTop: 6 }}>
                    <div style={{ height: 1, background: nx.divider, margin: "6px 0" }} />

                    <button
                      style={menuItemStyle}
                      onClick={() => {
                        setMoreOpen(false);
                        onClearFocus?.();
                      }}
                    >
                      Clear focus
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll region */}
        <div
          ref={messagesScrollRef}
          onWheelCapture={stopSceneWheel}
          onTouchMoveCapture={stopSceneTouchMove}
          style={{
            flex: "1 1 0%",
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {viewMode === "full" && showProps && (
            <div
              style={{
                padding: 12,
                borderBottom: `1px solid ${nx.border}`,
                background: nx.bgPanelSoft,
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: 10,
                  border: `1px solid ${nx.border}`,
                  borderRadius: 12,
                  background: nx.bgControl,
                  display: "grid",
                  gap: 10,
                  maxHeight: 220,
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: 0.2 }}>Control Center</div>
                  <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseEnter={() => setHoverBtn("controls_close")}
                    onMouseLeave={() => setHoverBtn(null)}
                    onClick={() => setShowProps(false)}
                    style={{
                      ...iconBtnStyle,
                      ...(hoverBtn === "controls_close" ? iconBtnHoverStyle : null),
                    }}
                    title="Close"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["day", "night", "stars"].map((t) => (
                    <button
                      key={t}
                      onClick={() => updatePrefs({ theme: t as any })}
                      style={{
                        ...pillStyle,
                        background: prefs.theme === t ? nx.accentSoft : nx.bgPanelSoft,
                      }}
                    >
                      {t === "day" ? "Day" : t === "night" ? "Night" : "Stars"}
                    </button>
                  ))}
                </div>

                {prefs.theme === "stars" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <label style={{ fontSize: 12, opacity: 0.8 }}>Star density</label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={prefs.starDensity}
                      onChange={(e) => updatePrefs({ starDensity: Number(e.target.value) })}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: 12, opacity: 0.8 }}>{(prefs.starDensity * 100).toFixed(0)}%</span>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <label style={{ fontSize: 12, opacity: 0.8 }}>Global Size</label>
                  <input
                    type="range"
                    min={0.2}
                    max={2}
                    step={0.05}
                    value={prefs.globalScale}
                    onChange={(e) => updatePrefs({ globalScale: clamp(parseFloat(e.target.value), 0.2, 2) })}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: 12, opacity: 0.8 }}>{round2(prefs.globalScale).toFixed(2)}x</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <label style={{ fontSize: 12, opacity: 0.8 }}>Override Policy</label>
                  <select
                    value={prefs.overridePolicy}
                    onChange={(e) => updatePrefs({ overridePolicy: e.target.value as any })}
                    style={{
                      padding: "6px 8px",
                      borderRadius: 8,
                      border: `1px solid ${nx.border}`,
                      background: nx.bgPanelSoft,
                      color: nx.text,
                    }}
                  >
                    <option value="keep">Keep</option>
                    <option value="match">Match Scene</option>
                    <option value="clear">Clear on Update</option>
                  </select>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>How local overrides behave when a new scene arrives</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <label style={{ fontSize: 12, opacity: 0.8 }}>Presets</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() =>
                        updatePrefs({
                          theme: "day",
                          starDensity: 0.6,
                          showGrid: true,
                          showAxes: true,
                          orbitMode: "manual",
                          globalScale: 1,
                          overridePolicy: "match",
                        })
                      }
                      style={{ ...pillStyle, padding: "6px 8px" }}
                    >
                      Business Day
                    </button>

                    <button
                      onClick={() =>
                        updatePrefs({
                          theme: "night",
                          starDensity: 0.6,
                          showGrid: false,
                          showAxes: false,
                          orbitMode: "auto",
                          globalScale: 1,
                          overridePolicy: "match",
                        })
                      }
                      style={{ ...pillStyle, padding: "6px 8px" }}
                    >
                      Night Calm
                    </button>

                    <button
                      onClick={() =>
                        updatePrefs({
                          theme: "stars",
                          starDensity: 0.8,
                          showGrid: false,
                          showAxes: false,
                          orbitMode: "auto",
                          globalScale: 0.9,
                          overridePolicy: "match",
                        })
                      }
                      style={{ ...pillStyle, padding: "6px 8px" }}
                    >
                      Star Meditation
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["auto", "manual"].map((m) => (
                    <button
                      key={m}
                      onClick={() => updatePrefs({ orbitMode: m as any })}
                      style={{
                        ...pillStyle,
                        background: prefs.orbitMode === m ? nx.accentSoft : nx.bgPanelSoft,
                      }}
                    >
                      {m === "auto" ? "Orbit Auto" : "Orbit Manual"}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <label style={checkboxStyle}>
                    <input
                      type="checkbox"
                      checked={prefs.showGrid}
                      onChange={(e) => updatePrefs({ showGrid: e.target.checked })}
                    />
                    <span>Show grid</span>
                  </label>
                  <label style={checkboxStyle}>
                    <input
                      type="checkbox"
                      checked={prefs.showAxes}
                      onChange={(e) => updatePrefs({ showAxes: e.target.checked })}
                    />
                    <span>Show axes</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {insightsOpen && !showProps && (
            <div
              style={{
                flexShrink: 0,
                margin: 12,
                marginBottom: 0,
                padding: "10px 10px",
                borderRadius: 12,
                background: nx.bgPanelSoft,
                border: `1px solid ${nx.border}`,
                display: "grid",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 800, fontSize: 12, opacity: 0.9, letterSpacing: 0.2 }}>KPI & Loops</div>
                <button type="button" onClick={() => setInsightsOpen(false)} style={iconBtnStyle} title="Close insights">
                  ✕
                </button>
              </div>
              {/* Keep your existing Insights JSX content here (no functional changes). */}
            </div>
          )}

          {/* Messages */}
          <div style={{ padding: 12 }}>
            {visibleMessages.length === 0 ? (
              <div style={{ opacity: 0.7, fontSize: 13 }}>
                Try something like: <br />
                <span style={{ fontFamily: "monospace" }}>increase intensity</span>
              </div>
            ) : (
              visibleMessages.map((m, i) => (
                <div key={m.id ?? `${i}-${m.role}`} style={{ marginBottom: 10 }}>
                  <div style={{ opacity: 0.65, fontSize: 12, marginBottom: 4 }}>{m.role === "user" ? "You" : "Assistant"}</div>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      background: m.role === "user" ? nx.chatBubbleUserBg : nx.chatBubbleAssistantBg,
                      border: `1px solid ${nx.borderSoft}`,
                      fontSize: 13,
                      lineHeight: 1.35,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.text && m.text.trim().length > 0 ? m.text : "I’m here—let me know what to adjust."}
                  </div>

                  {i === visibleMessages.length - 1 &&
                    m.role === "assistant" &&
                    typeof lastActionsCount === "number" &&
                    process.env.NODE_ENV !== "production" && (
                      <div style={{ marginTop: 4, fontSize: 11, color: nx.muted }}>
                        Applied: {lastActionsCount} action{lastActionsCount === 1 ? "" : "s"}
                      </div>
                    )}

                  {i === visibleMessages.length - 1 &&
                    m.role === "assistant" &&
                    analysisSummary &&
                    process.env.NODE_ENV !== "production" && (
                      <div style={{ marginTop: 4, fontSize: 11, color: nx.muted }}>{analysisSummary}</div>
                    )}
                </div>
              ))
            )}

            {loading ? <div style={{ marginBottom: 10, fontSize: 12, opacity: 0.7 }}>Assistant is typing…</div> : null}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Composer (always visible) */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexShrink: 0,
            width: "100%",
            borderTop: `1px solid ${nx.border}`,
            boxSizing: "border-box",
            padding: 10,
            background: nx.bgDeep,
            zIndex: 200,
            boxShadow: nx.workspaceShadow,
            position: "relative",
            pointerEvents: "auto",
            outline: `1px solid color-mix(in srgb, var(--nx-accent) 32%, transparent)`,
          }}
        >
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type here… (Enter to send, Shift+Enter for a new line)"
            rows={viewMode === "input" ? 3 : viewMode === "hidden" ? 2 : 2}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: `1px solid ${nx.border}`,
              background: nx.bgPanelSoft,
              color: nx.text,
              outline: "none",
              resize: "none",
              minHeight: viewMode === "input" ? 72 : viewMode === "hidden" ? 56 : 56,
              lineHeight: 1.35,
              display: "block",
              width: "100%",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              onClick={() => onInputChange("")}
              style={{
                height: 40,
                padding: "0 12px",
                borderRadius: 12,
                border: `1px solid ${nx.border}`,
                background: nx.bgPanelSoft,
                color: nx.textSoft,
                cursor: "pointer",
              }}
              title="Clear input"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={isSendDisabled}
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 12,
                border: `1px solid ${nx.primaryCtaBorder}`,
                background: nx.accentSoft,
                color: nx.accentInk,
                cursor: isSendDisabled ? "not-allowed" : "pointer",
                opacity: isSendDisabled ? 0.55 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
const iconBtnHoverStyle: React.CSSProperties = {
  background: "color-mix(in srgb, var(--nx-bg-elevated) 90%, var(--nx-accent) 10%)",
  borderColor: "color-mix(in srgb, var(--nx-border) 60%, var(--nx-accent) 40%)",
  transform: "translateY(-1px)",
};

const checkboxStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  cursor: "pointer",
  color: "var(--nx-text)",
};
