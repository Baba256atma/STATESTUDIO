"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { clamp, round2 } from "../lib/sizeCommands";
import {
  useSelectedId,
  useSetSelectedId,
  useSetOverride,
  useClearOverride,
  useOverrides,
  useUndoOverrides,
  useRedoOverrides,
  useCanUndoOverrides,
  useCanRedoOverrides,
  useSetCaption,
  useToggleCaption,
} from "./SceneContext";

const STORAGE_KEY = "statestudio.chatHUD.v1";

type Msg = { role: "user" | "assistant"; text: string };

export function ChatHUD({
  messages,
  input,
  onInputChange,
  onSend,
  activeMode,
  onUndo,
  onExport,
  onImport,
  loading,
  sourceLabel,
  noSceneUpdate,
  onDragStart,
  onDragEnd,
  prefs,
  onPrefsChange,
  objects,
}: {
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
  onDragStart?: () => void;
  onDragEnd?: () => void;
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
}) {
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [showProps, setShowProps] = useState<boolean>(false);
  const [hoverBtn, setHoverBtn] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);

  // Panel position (drag)
  const [pos, setPos] = useState({ x: 16, y: 72 });
  const dragging = useRef(false);
  const dragOffset = useRef({ dx: 0, dy: 0 });

  const panelRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);

  // Scene context hooks: declare early so effects can safely reference them
  const selectedId = useSelectedId();
  const setSelectedId = useSetSelectedId();
  const setOverride = useSetOverride();
  const clearOverride = useClearOverride();
  const overrides = useOverrides();
  const setCaption = useSetCaption();
  const toggleCaption = useToggleCaption();
  const selectedOverrideValue = selectedId ? overrides[selectedId]?.scale ?? 1 : 1;
  const [objectsOpen, setObjectsOpen] = useState(false);
  const [objectSearch, setObjectSearch] = useState("");
  const undoOverrides = useUndoOverrides();
  const redoOverrides = useRedoOverrides();
  const canUndo = useCanUndoOverrides();
  const canRedo = useCanRedoOverrides();

  function onPointerDownHeader(e: React.PointerEvent) {
    if (maximized) return;

    // Only allow drag when pressing the header itself (not buttons)
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;

    dragging.current = true;
    pointerIdRef.current = e.pointerId;
    dragOffset.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    onDragStart?.();

    // Keep drag stable on mobile as well
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function stopDrag() {
    dragging.current = false;
    pointerIdRef.current = null;
    onDragEnd?.();
  }

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging.current) return;
      if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;

      const x = e.clientX - dragOffset.current.dx;
      const y = e.clientY - dragOffset.current.dy;

      const rect = panelRef.current?.getBoundingClientRect();
      const w = rect?.width ?? 360;
      const h = rect?.height ?? 360;

      const padding = 8;
      const clampedX = Math.max(padding, Math.min(window.innerWidth - w - padding, x));
      const clampedY = Math.max(padding, Math.min(window.innerHeight - h - padding, y));

      setPos({ x: clampedX, y: clampedY });
    }

    function onUp(e: PointerEvent) {
      if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
      stopDrag();
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [maximized, pos.x, pos.y]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);

      if (typeof saved?.x === "number" && typeof saved?.y === "number") {
        setPos({ x: saved.x, y: saved.y });
      }
      // Intentionally do NOT restore minimized/maximized from storage to avoid hidden UI on mount.
    } catch {
      // ignore
    }
    // only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ x: pos.x, y: pos.y, minimized, maximized })
      );
    } catch {
      // ignore
    }
  }, [pos.x, pos.y, minimized, maximized]);

  useEffect(() => {
    if (minimized) setShowControls(false);
  }, [minimized]);

  // Auto-open when an object is selected: restore HUD and maximize (do not switch view)
  useEffect(() => {
    if (selectedId) {
      if (minimized) setMinimized(false);
      setMaximized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const panelStyle: React.CSSProperties = useMemo(() => {
    const base: React.CSSProperties = {
      position: "absolute",
      left: maximized ? 12 : pos.x,
      top: maximized ? 12 : pos.y,
      width: maximized ? "min(760px, 96vw)" : "min(420px, 92vw)",
      height: minimized ? 56 : maximized ? "min(78vh, 640px)" : "min(520px, 70vh)",
      minHeight: minimized ? 56 : 300,
      background: "rgba(16, 16, 22, 0.90)",
      border: "2px solid red", // debug border to ensure visibility
      borderRadius: 16,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      zIndex: 1000,
      boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
      userSelect: "none",
      opacity: 1,
      visibility: "visible",
    };

    // When maximized, we keep the panel fixed (no drag) by logic above
    return base;
  }, [pos.x, pos.y, minimized, maximized]);

  // Auto-scroll to the latest message
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || minimized) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, minimized]);

  function updatePrefs(partial: Partial<typeof prefs>) {
    onPrefsChange({ ...prefs, ...partial });
  }

  const importInputRef = useRef<HTMLInputElement>(null);
  const [showMore, setShowMore] = useState(false);
  const modeChipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 7px",
    borderRadius: 999,
    background:
      activeMode === "business"
        ? "rgba(30, 64, 175, 0.32)" // dark blue
        : activeMode === "spirit"
        ? "rgba(167, 139, 250, 0.12)"
        : "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.90)",
    fontSize: 11,
    fontWeight: 500,
    border:
      activeMode === "business"
        ? "1px solid rgba(147, 197, 253, 0.24)"
        : "1px solid rgba(255,255,255,0.06)",
    letterSpacing: 0.2,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };
  function triggerImport() {
    importInputRef.current?.click();
  }
  function handleImportChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onImport(file);
    if (e.target) e.target.value = "";
  }


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = document.activeElement as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
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

  return (
    <div style={{ position: "fixed", left: 16, top: 72, zIndex: 1000 }}>
      {/* header-selected overlay removed; showing selected in header */}

      <div ref={panelRef} style={panelStyle}>
      {/* Header */}
      <div
        onPointerDown={onPointerDownHeader}
        onDoubleClick={() => setMaximized((v) => !v)}
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          cursor: maximized ? "default" : "grab",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 12,
                height: 12,
                marginTop: 3,
                borderRadius: 999,
                background: "rgba(34, 211, 238, 0.92)",
                boxShadow: "0 0 18px rgba(34, 211, 238, 0.45)",
                flex: "0 0 auto",
              }}
            />
            <div
              style={{
                fontWeight: 900,
                fontSize: 15,
                letterSpacing: 0.25,
                color: "rgba(255,255,255,0.98)",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
            >
              StateStudio
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 34 }}>
            <div style={modeChipStyle}>{(activeMode || "business").toLowerCase()}</div>
          </div>
        </div>

        {/* Header menu removed; instead show selected summary */}
        <div style={{ marginLeft: 12, marginRight: 12 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
            {selectedId ? `Selected: ${objects?.find((o) => o.id === selectedId)?.label ?? selectedId}` : ""}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoverBtn("undo")}
            onMouseLeave={() => setHoverBtn(null)}
            onClick={onUndo}
            style={{
              ...iconBtnStyle,
              ...(hoverBtn === "undo" ? iconBtnHoverStyle : null),
            }}
            title="Undo"
            aria-label="Undo"
          >
            ↶
          </button>
          {/* Chat/Props toggle button (small text) */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              if (minimized) setMinimized(false);
              setShowMore(false);
              setShowProps((v) => !v);
            }}
            title={showProps ? "Back to chat" : "Open properties"}
            style={{
              height: 32,
              padding: "0 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.88)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500,
            }}
            aria-label={showProps ? "Back to chat" : "Open properties"}
          >
            {showProps ? "Chat" : "Props"}
          </button>
          {/* Export/Import moved to bottom toolbar */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoverBtn("min")}
            onMouseLeave={() => setHoverBtn(null)}
            onClick={() => setMinimized((v) => !v)}
            style={{
              ...iconBtnStyle,
              ...(hoverBtn === "min" ? iconBtnHoverStyle : null),
            }}
            title={minimized ? "Restore" : "Minimize"}
            aria-label={minimized ? "Restore" : "Minimize"}
          >
            {minimized ? "▢" : "—"}
          </button>

          <button
            onPointerDown={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoverBtn("max")}
            onMouseLeave={() => setHoverBtn(null)}
            onClick={() => setMaximized((v) => !v)}
            style={{
              ...iconBtnStyle,
              ...(hoverBtn === "max" ? iconBtnHoverStyle : null),
            }}
            title={maximized ? "Normal" : "Maximize"}
            aria-label={maximized ? "Normal" : "Maximize"}
          >
            {maximized ? "❐" : "⤢"}
          </button>
        </div>
      </div>

      {/* Scene panel: Control Center (shown in Properties view) */}
      {!minimized && showProps && (
        <div
          style={{
            padding: 12,
            borderBottom: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.03)",
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              background: "rgba(0,0,0,0.18)",
              display: "grid",
              gap: 10,
              maxHeight: 220,
              overflow: "auto",
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
                    background:
                      prefs.theme === t ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
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
                onChange={(e) =>
                  updatePrefs({ globalScale: clamp(parseFloat(e.target.value), 0.2, 2) })
                }
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: 12, opacity: 0.8 }}>
                {round2(prefs.globalScale).toFixed(2)}x
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <label style={{ fontSize: 12, opacity: 0.8 }}>Override Policy</label>
              <select
                value={prefs.overridePolicy}
                onChange={(e) => updatePrefs({ overridePolicy: e.target.value as any })}
                style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)", color: "white" }}
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
                    background:
                      prefs.orbitMode === m ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
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

      {/* Body */}
      {!minimized && (
        <>
          {!showProps && (
            <>
              <div
                ref={scrollRef}
                style={{
                  flex: 1,
                  padding: 12,
                  overflowY: "auto",
                  userSelect: "text",
                  fontSize: 13,
                  lineHeight: 1.35,
                }}
              >
                <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                  {loading && (
                    <span style={{ fontSize: 12, opacity: 0.85, padding: "2px 6px" }}>Thinking…</span>
                  )}
                  {sourceLabel && (
                    <span
                      style={{
                        fontSize: 12,
                        padding: "2px 6px",
                        borderRadius: 6,
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.08)",
                      }}
                    >
                      Source: {sourceLabel === "ai" ? "AI" : "Fallback"}
                    </span>
                  )}
                  {noSceneUpdate && (
                    <span style={{ fontSize: 12, opacity: 0.8 }}>
                      No scene update (mode mismatch or no changes).
                    </span>
                  )}
                </div>

                {messages.length === 0 ? (
                  <div style={{ opacity: 0.7, fontSize: 13 }}>
                    Type something like: <br />
                    <span style={{ fontFamily: "monospace" }}>
                      quality dropped, inventory is low, and we have delays
                    </span>
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ opacity: 0.65, fontSize: 12, marginBottom: 4 }}>
                        {m.role === "user" ? "You" : "Assistant"}
                      </div>
                      <div
                        style={{
                          padding: "8px 10px",
                          borderRadius: 10,
                          background:
                            m.role === "user"
                              ? "rgba(80,140,255,0.18)"
                              : "rgba(255,255,255,0.10)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          fontSize: 13,
                          lineHeight: 1.35,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input bar with compact more menu */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  padding: 12,
                  borderTop: "1px solid rgba(255,255,255,0.10)",
                  alignItems: "center",
                }}
              >
                <input
                  value={input}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSend();
                  }}
                  placeholder="Type…"
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(0,0,0,0.25)",
                    color: "white",
                    outline: "none",
                  }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
                  <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => setShowMore((v) => !v)}
                    title="More"
                    style={{
                      height: 36,
                      width: 36,
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.03)",
                      color: "white",
                      cursor: "pointer",
                      fontSize: 18,
                    }}
                  >
                    ⋯
                  </button>

                  {showMore && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        bottom: 46,
                        background: "rgba(6,6,8,0.98)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        padding: 8,
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        minWidth: 140,
                        zIndex: 2000,
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setShowMore(false);
                          onExport();
                        }}
                        style={{ ...pillStyle, padding: "8px 10px", textAlign: "left" }}
                      >
                        Export JSON
                      </button>
                      <button
                        onClick={() => {
                          setShowMore(false);
                          importInputRef.current?.click();
                        }}
                        style={{ ...pillStyle, padding: "8px 10px", textAlign: "left" }}
                      >
                        Import JSON
                      </button>
                    </div>
                  )}

                  <button
                    onClick={onSend}
                    style={{
                      height: 40,
                      padding: "0 14px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: "rgba(34, 211, 238, 0.18)",
                      color: "rgba(255,255,255,0.95)",
                      cursor: "pointer",
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}

          {showProps && (
            <>
              {/* Objects panel */}
              <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>Objects</div>
                  <button onClick={() => setObjectsOpen((v) => !v)} style={{ ...pillStyle }}>{objectsOpen ? "Hide" : "Show"}</button>
                </div>
                {objectsOpen && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input
                      placeholder="Search objects"
                      value={objectSearch}
                      onChange={(e) => setObjectSearch(e.target.value)}
                      style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)", color: "white" }}
                    />
                    <div style={{ maxHeight: 220, overflow: "auto", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", padding: 6 }}>
                      {(objects ?? [])
                        .filter((it) => {
                          const q = objectSearch.trim().toLowerCase();
                          if (!q) return true;
                          return (
                            (it.label ?? it.id).toLowerCase().includes(q) ||
                            it.id.toLowerCase().includes(q)
                          );
                        })
                        .slice(0, 50)
                        .map((it) => (
                          <div
                            key={it.id}
                            onClick={() => setSelectedId(it.id)}
                            style={{
                              padding: "6px 8px",
                              borderRadius: 6,
                              marginBottom: 6,
                              cursor: "pointer",
                              background:
                                selectedId === it.id
                                  ? "rgba(34,211,238,0.12)"
                                  : "transparent",
                              border:
                                selectedId === it.id
                                  ? "1px solid rgba(34,211,238,0.28)"
                                  : "1px solid transparent",
                            }}
                          >
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{it.label}</div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>{it.id}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected object panel (Object) */}
              {selectedId && (
                <div
                  style={{
                    padding: 12,
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 700 }}>Selected Object</div>
                      <div style={{ fontSize: 12, opacity: 0.8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedId}
                      </div>

                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>Selected Size</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input
                            type="range"
                            min={0.2}
                            max={2}
                            step={0.05}
                            value={selectedOverrideValue}
                            onChange={(e) => {
                              if (!selectedId) return;
                              const v = clamp(parseFloat(e.target.value), 0.2, 2);
                              setOverride(selectedId, { scale: v });
                            }}
                            style={{ flex: 1 }}
                          />
                          <div style={{ fontSize: 12, opacity: 0.85, width: 56, textAlign: "right" }}>{round2(selectedOverrideValue).toFixed(2)}x</div>
                        </div>
                      </div>

                      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {/* Position inputs */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ fontSize: 12, opacity: 0.85 }}>Position (x,y,z)</div>
                          <div style={{ display: "flex", gap: 6 }}>
                            {([0, 1, 2] as const).map((i) => {
                              const v = selectedId ? (overrides[selectedId]?.position ?? [0, 0, 0])[i] ?? 0 : 0;
                              return (
                                <input
                                  key={i}
                                  type="number"
                                  step={0.1}
                                  value={String(Number(v))}
                                  onChange={(e) => {
                                    if (!selectedId) return;
                                    const cur = overrides[selectedId]?.position ?? [0, 0, 0];
                                    const next = [...cur] as [number, number, number];
                                    next[i] = Number(e.target.value) || 0;
                                    setOverride(selectedId, { position: next });
                                  }}
                                  style={{ flex: 1, padding: "6px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)", color: "white" }}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Rotation inputs (degrees) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ fontSize: 12, opacity: 0.85 }}>Rotation (°)</div>
                          <div style={{ display: "flex", gap: 6 }}>
                            {([0, 1, 2] as const).map((i) => {
                              const rad = selectedId ? (overrides[selectedId]?.rotation ?? [0, 0, 0])[i] ?? 0 : 0;
                              const deg = Math.round((rad * 180) / Math.PI);
                              return (
                                <input
                                  key={i}
                                  type="number"
                                  step={5}
                                  value={String(deg)}
                                  onChange={(e) => {
                                    if (!selectedId) return;
                                    const cur = overrides[selectedId]?.rotation ?? [0, 0, 0];
                                    const nextDeg = Number(e.target.value) || 0;
                                    const next = [...cur] as [number, number, number];
                                    next[i] = (nextDeg * Math.PI) / 180;
                                    setOverride(selectedId, { rotation: next });
                                  }}
                                  style={{ flex: 1, padding: "6px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)", color: "white" }}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Color + Visible */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ fontSize: 12, opacity: 0.85 }}>Color & Visibility</div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <input
                              type="color"
                              value={(selectedId && (overrides[selectedId]?.color ?? "#cccccc")) || "#cccccc"}
                              onChange={(e) => {
                                if (!selectedId) return;
                                setOverride(selectedId, { color: e.target.value });
                              }}
                              style={{ width: 40, height: 28, padding: 0, borderRadius: 6, border: "none" }}
                            />
                            <input
                              type="text"
                              value={(selectedId && (overrides[selectedId]?.color ?? "#cccccc")) || "#cccccc"}
                              onChange={(e) => {
                                if (!selectedId) return;
                                setOverride(selectedId, { color: e.target.value });
                              }}
                              style={{ flex: 1, padding: "6px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)", color: "white" }}
                            />
                            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <input
                                type="checkbox"
                                checked={selectedId ? (overrides[selectedId]?.visible ?? true) : true}
                                onChange={(e) => {
                                  if (!selectedId) return;
                                  setOverride(selectedId, { visible: e.target.checked });
                                }}
                              />
                              <span style={{ fontSize: 12, opacity: 0.85 }}>Visible</span>
                            </label>
                          </div>
                        </div>

                        {/* Caption controls */}
                        <div style={{ marginTop: 8 }}>
                          <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>Caption</div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                              type="text"
                              value={(selectedId && (overrides[selectedId]?.caption ?? "")) || ""}
                              onChange={(e) => {
                                if (!selectedId) return;
                                setCaption(selectedId, e.target.value);
                              }}
                              placeholder="Caption text"
                              style={{ flex: 1, padding: "6px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)", color: "white" }}
                            />
                            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <input
                                type="checkbox"
                                checked={selectedId ? (overrides[selectedId]?.showCaption ?? false) : false}
                                onChange={(e) => {
                                  if (!selectedId) return;
                                  toggleCaption(selectedId, e.target.checked);
                                }}
                              />
                              <span style={{ fontSize: 12, opacity: 0.85 }}>Show Caption</span>
                            </label>
                            <button
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={() => {
                                if (!selectedId) return;
                                setCaption(selectedId, "");
                                toggleCaption(selectedId, false);
                              }}
                              style={{ ...pillStyle, padding: "6px 8px" }}
                            >
                              Clear Caption
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => undoOverrides()}
                          disabled={!canUndo}
                          style={{ ...pillStyle, padding: "8px 10px", opacity: canUndo ? 1 : 0.45 }}
                        >
                          Undo
                        </button>
                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => redoOverrides()}
                          disabled={!canRedo}
                          style={{ ...pillStyle, padding: "8px 10px", opacity: canRedo ? 1 : 0.45 }}
                        >
                          Redo
                        </button>
                      </div>
                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => selectedId && clearOverride(selectedId)}
                        style={{ ...pillStyle, padding: "8px 10px" }}
                      >
                        Reset Selected (All)
                      </button>
                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => setSelectedId(null)}
                        style={{ ...pillStyle, padding: "8px 10px" }}
                      >
                        Deselect
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* finished panels */}
          {/* Properties bottom toolbar: export/import + chat toggle */}
          {showProps && !minimized && (
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: 12,
                borderTop: "1px solid rgba(255,255,255,0.10)",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div style={{ position: "relative" }}>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => setShowMore((v) => !v)}
                  title="More"
                  style={{
                    height: 36,
                    width: 36,
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.03)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                >
                  ⋯
                </button>

                {showMore && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      bottom: 46,
                      background: "rgba(6,6,8,0.98)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      padding: 8,
                      borderRadius: 8,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      minWidth: 140,
                      zIndex: 2000,
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setShowMore(false);
                        onExport();
                      }}
                      style={{ ...pillStyle, padding: "8px 10px", textAlign: "left" }}
                    >
                      Export JSON
                    </button>
                    <button
                      onClick={() => {
                        setShowMore(false);
                        importInputRef.current?.click();
                      }}
                      style={{ ...pillStyle, padding: "8px 10px", textAlign: "left" }}
                    >
                      Import JSON
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}
        </>
      )}
      {/* Hidden import input available for both Chat and Properties views */}
      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        style={{ display: "none" }}
        onChange={handleImportChange}
      />
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  height: 32,
  width: 32,
  borderRadius: 10,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 120ms ease, background 120ms ease, border-color 120ms ease",
};

const iconBtnHoverStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.10)",
  borderColor: "rgba(255,255,255,0.22)",
  transform: "translateY(-1px)",
};

const pillStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.16)",
  color: "white",
  background: "rgba(255,255,255,0.06)",
  cursor: "pointer",
  fontSize: 12,
};

const checkboxStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  cursor: "pointer",
};
