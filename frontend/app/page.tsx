"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { smoothValue } from "./lib/smooth";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { chatToBackend } from "./lib/api";
import { analyzeFull } from "./lib/api/analyzeApi";
import type { SceneJson } from "./lib/sceneTypes";
import { SceneRenderer } from "./components/SceneRenderer";
import { ChatHUD } from "./components/ChatHUD";
import { SceneStateProvider, useSetSelectedId } from "./components/SceneContext";
import { InspectorHUD } from "./components/InspectorHUD";
import { clamp, parseSizeCommand, parseSelectedSizeCommand } from "./lib/sizeCommands";
import { useSelectedId, useOverrides, useSetOverride, useClearAllOverrides, usePruneOverridesTo } from "./components/SceneContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

type Msg = { role: "user" | "assistant"; text: string };
type ScenePrefs = {
  theme: "day" | "night" | "stars";
  starDensity: number;
  showGrid: boolean;
  showAxes: boolean;
  orbitMode: "auto" | "manual";
  globalScale: number;
  shadowsEnabled?: boolean;
  overridePolicy?: "keep" | "match" | "clear";
};
type PersistedProject = {
  version: "1";
  savedAt: string;
  sessionId: string | null;
  activeMode: string;
  sceneJson: any | null;
  messages: Msg[];
};

const PROJECT_KEY = "statestudio.project.v1";
const HISTORY_KEY = "statestudio.history.v1";
const SESSION_KEY = "statestudio.sessionId";
const PREFS_KEY = "statestudio.prefs.v1";
const defaultPrefs: ScenePrefs = {
  theme: "night",
  starDensity: 0.6,
  showGrid: true,
  showAxes: true,
  orbitMode: "auto",
  globalScale: 1,
  shadowsEnabled: true,
  overridePolicy: "match",
};

function saveProject(p: PersistedProject) {
  try {
    window.localStorage.setItem(PROJECT_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

function loadProject(): PersistedProject | null {
  try {
    const raw = window.localStorage.getItem(PROJECT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version === "1") return parsed as PersistedProject;
  } catch {
    // ignore
  }
  return null;
}

function loadHistory(): PersistedProject[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((p) => p?.version === "1");
  } catch {
    // ignore
  }
  return [];
}

function pushHistory(snapshot: PersistedProject) {
  try {
    const history = loadHistory();
    history.push(snapshot);
    const trimmed = history.slice(-10);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

function HomePageContent() {
  const [input, setInput] = useState("Quality has dropped and inventory is low with delays");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [sceneJson, setSceneJson] = useState<SceneJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<string>("business");
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);
  const [noSceneUpdate, setNoSceneUpdate] = useState(false);
  const [isDraggingHUD, setIsDraggingHUD] = useState(false);
  const [prefs, setPrefs] = useState<ScenePrefs>(defaultPrefs);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [cameraLockedByUser, setCameraLockedByUser] = useState(false);
  const [episodeId, setEpisodeId] = useState<string | null>(null);
  const camPos =
    sceneJson?.scene?.camera?.pos ?? ([0, 3, 8] as [number, number, number]);
  const starCount = Math.round(800 + (6000 - 800) * Math.max(0, Math.min(1, prefs.starDensity)));

  useEffect(() => {
    const loaded = loadProject();
    if (loaded) {
      setMessages(loaded.messages ?? []);
      setSceneJson(loaded.sceneJson ?? null);
      setActiveMode(loaded.activeMode ?? "business");
      if (loaded.sessionId) {
        try {
          window.localStorage.setItem(SESSION_KEY, loaded.sessionId);
        } catch {
          // ignore
        }
      }
    }
    try {
      const raw = window.localStorage.getItem(PREFS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          (parsed.theme === "day" || parsed.theme === "night" || parsed.theme === "stars") &&
          typeof parsed.starDensity === "number" &&
          typeof parsed.showGrid === "boolean" &&
          typeof parsed.showAxes === "boolean" &&
          (parsed.orbitMode === "auto" || parsed.orbitMode === "manual")
        ) {
          const globalScale =
            typeof parsed.globalScale === "number" && Number.isFinite(parsed.globalScale)
              ? clamp(parsed.globalScale, 0.2, 2)
              : 1;
          const overridePolicy =
            parsed.overridePolicy === "keep" || parsed.overridePolicy === "clear" ? parsed.overridePolicy : "match";
          const shadowsEnabled = typeof parsed.shadowsEnabled === "boolean" ? parsed.shadowsEnabled : false;
          setPrefs({ ...(parsed as ScenePrefs), globalScale, overridePolicy, shadowsEnabled });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs]);

  useEffect(() => {
    if (prefs.orbitMode === "auto") setCameraLockedByUser(false);
  }, [prefs.orbitMode]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Handle selected-object size commands first (no backend call)
    try {
      const hasSelectedKeyword = /\bselected\b/i.test(text);
      const selectedId = selectedIdRef.current;
      if (hasSelectedKeyword) {
        if (!selectedId) {
          const userMsg: Msg = { role: "user", text };
          const assistantMsg: Msg = { role: "assistant", text: "⚠️ No object selected. Click an object first." };
          const nextMessages = [...messages, userMsg, assistantMsg];
          setMessages(nextMessages);
          setNoSceneUpdate(false);
          setSourceLabel(null);
          const sessionId = (() => {
            try {
              return window.localStorage.getItem(SESSION_KEY);
            } catch {
              return null;
            }
          })();
          const snapshot: PersistedProject = {
            version: "1",
            savedAt: new Date().toISOString(),
            sessionId,
            activeMode,
            sceneJson,
            messages: nextMessages,
          };
          saveProject(snapshot);
          pushHistory(snapshot);
          setInput("");
          return;
        }

        const cur = overridesRef.current[selectedId]?.scale ?? 1;
        const sel = parseSelectedSizeCommand(text, cur);
        if (sel.handled) {
          const userMsg: Msg = { role: "user", text };
          const assistantMsg: Msg = { role: "assistant", text: sel.reply };
          const nextMessages = [...messages, userMsg, assistantMsg];
          setMessages(nextMessages);
          // apply override
          setOverrideRef.current(selectedId, { scale: sel.nextScale });
          setNoSceneUpdate(false);
          setSourceLabel(null);
          const sessionId = (() => {
            try {
              return window.localStorage.getItem(SESSION_KEY);
            } catch {
              return null;
            }
          })();
          const snapshot: PersistedProject = {
            version: "1",
            savedAt: new Date().toISOString(),
            sessionId,
            activeMode,
            sceneJson,
            messages: nextMessages,
          };
          saveProject(snapshot);
          pushHistory(snapshot);
          setInput("");
          return;
        }
      }
    } catch (err) {
      // fall through to normal flow on any error
    }

    // Global size commands handled next
    const sizeResult = parseSizeCommand(text, prefs.globalScale);
    if (sizeResult.handled) {
      const userMsg: Msg = { role: "user", text };
      const assistantMsg: Msg = { role: "assistant", text: sizeResult.reply };
      const nextMessages = [...messages, userMsg, assistantMsg];
      setMessages(nextMessages);
      setPrefs((prev) => ({ ...prev, globalScale: sizeResult.nextScale }));
      setNoSceneUpdate(false);
      setSourceLabel(null);
      const sessionId = (() => {
        try {
          return window.localStorage.getItem(SESSION_KEY);
        } catch {
          return null;
        }
      })();
      const snapshot: PersistedProject = {
        version: "1",
        savedAt: new Date().toISOString(),
        sessionId,
        activeMode,
        sceneJson,
        messages: nextMessages,
      };
      saveProject(snapshot);
      pushHistory(snapshot);
      setInput("");
      return;
    }

    // Default: send to backend
    const userMsg: Msg = { role: "user", text };
    const baseMessages = [...messages, userMsg];
    setMessages(baseMessages);
    setLoading(true);
    setNoSceneUpdate(false);
    setSourceLabel(null);
    setCameraLockedByUser(false);

    try {
      const data = await chatToBackend(text);
      const nextActiveMode = data.active_mode ?? activeMode;
      setActiveMode(nextActiveMode);
      if (data.scene_json) {
        setSceneJson(data.scene_json);

        // apply override policy
        try {
          const policy = prefs.overridePolicy ?? "match";
          if (policy === "clear") {
            clearAllOverridesRef.current?.();
          } else if (policy === "match") {
            const objs: any[] = data.scene_json?.scene?.objects ?? [];
            const validIds = objs.map((o: any, idx: number) => o.id ?? o.name ?? `${o.type ?? "obj"}:${idx}`);
            pruneOverridesRef.current?.(validIds);
          }
        } catch (e) {
          // ignore policy errors
        }
      } else setNoSceneUpdate(true);
      const assistantMsg: Msg = { role: "assistant", text: data.reply };
      const finalMessages = [...baseMessages, assistantMsg];
      setMessages(finalMessages);
      setSourceLabel(data.source ?? null);

      const sessionId = (() => {
        try {
          return window.localStorage.getItem(SESSION_KEY);
        } catch {
          return null;
        }
      })();

      const snapshot: PersistedProject = {
        version: "1",
        savedAt: new Date().toISOString(),
        sessionId,
        activeMode: nextActiveMode,
        sceneJson: data.scene_json ?? sceneJson,
        messages: finalMessages,
      };
      saveProject(snapshot);
      pushHistory(snapshot);

      try {
        const replay = await analyzeFull({ episodeId, text });
        if (replay?.episode_id) setEpisodeId(replay.episode_id);
      } catch {
        // ignore replay errors to keep chat responsive
      }
    } catch (e: any) {
      const msg =
        e?.name === "AbortError"
          ? "Request timed out. Please try again."
          : e?.message ?? "Error";
      setMessages((m) => [...m, { role: "assistant", text: msg }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }, [activeMode, episodeId, input, loading, messages, prefs.globalScale, prefs.overridePolicy, sceneJson]);

  const handleUndo = useCallback(() => {
    const history = loadHistory();
    if (history.length < 2) return;
    history.pop(); // remove current
    const prev = history[history.length - 1];
    if (!prev) return;

    setActiveMode(prev.activeMode ?? "business");
    setSceneJson(prev.sceneJson ?? null);
    setMessages(prev.messages ?? []);
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      if (prev.sessionId) window.localStorage.setItem(SESSION_KEY, prev.sessionId);
    } catch {
      // ignore
    }
    saveProject({
      ...prev,
      savedAt: new Date().toISOString(),
    });
  }, []);

  const handleExport = useCallback(() => {
    const sessionId = (() => {
      try {
        return window.localStorage.getItem(SESSION_KEY);
      } catch {
        return null;
      }
    })();
    const project: PersistedProject = {
      version: "1",
      savedAt: new Date().toISOString(),
      sessionId,
      activeMode,
      sceneJson,
      messages,
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "statestudio-project.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [activeMode, messages, sceneJson]);

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (parsed?.version !== "1") throw new Error("Invalid version");
        if (!parsed.activeMode || !parsed.messages) throw new Error("Invalid project");

        setActiveMode(parsed.activeMode ?? "business");
        setSceneJson(parsed.sceneJson ?? null);
        setMessages(parsed.messages ?? []);
        if (parsed.sessionId) {
          try {
            window.localStorage.setItem(SESSION_KEY, parsed.sessionId);
          } catch {
            // ignore
          }
        }
        const project: PersistedProject = {
          version: "1",
          savedAt: new Date().toISOString(),
          sessionId: parsed.sessionId ?? null,
          activeMode: parsed.activeMode ?? "business",
          sceneJson: parsed.sceneJson ?? null,
          messages: parsed.messages ?? [],
        };
        saveProject(project);
        pushHistory(project);
      } catch (err: any) {
        setMessages((m) => [...m, { role: "assistant", text: err?.message ?? "Import failed" }]);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDragStart = useCallback(() => setIsDraggingHUD(true), []);
  const handleDragEnd = useCallback(() => setIsDraggingHUD(false), []);

  const handlePrefsChange = useCallback((next: ScenePrefs) => {
    setPrefs(next);
  }, []);

  const selectedSetterRef = useRef<(id: string | null) => void>(() => {});
  const selectedIdRef = useRef<string | null>(null);
  const overridesRef = useRef<Record<string, any>>({});
  const setOverrideRef = useRef<(id: string, patch: any) => void>(() => {});
  const clearAllOverridesRef = useRef<() => void>(() => {});
  const pruneOverridesRef = useRef<(ids: string[]) => void>(() => {});

  const SetterRegistrar = ({
    refSetter,
  }: {
    refSetter: React.MutableRefObject<(id: string | null) => void>;
  }) => {
    const setSelectedId = useSetSelectedId();
    useEffect(() => {
      refSetter.current = setSelectedId;
    }, [setSelectedId, refSetter]);
    return null;
  };

  const FullRegistrar = ({
    selectedIdRefLocal,
    overridesRefLocal,
    setOverrideRefLocal,
  }: {
    selectedIdRefLocal: React.MutableRefObject<string | null>;
    overridesRefLocal: React.MutableRefObject<Record<string, any>>;
    setOverrideRefLocal: React.MutableRefObject<(id: string, patch: any) => void>;
  }) => {
    const selectedId = useSelectedId();
    const overrides = useOverrides();
    const setOverride = useSetOverride();
    const clearAll = useClearAllOverrides();
    const pruneTo = usePruneOverridesTo();
    useEffect(() => {
      selectedIdRefLocal.current = selectedId;
    }, [selectedId, selectedIdRefLocal]);
    useEffect(() => {
      overridesRefLocal.current = overrides;
    }, [overrides, overridesRefLocal]);
    useEffect(() => {
      setOverrideRefLocal.current = setOverride;
    }, [setOverride, setOverrideRefLocal]);
    useEffect(() => {
      clearAllOverridesRef.current = clearAll;
    }, [clearAll]);
    useEffect(() => {
      pruneOverridesRef.current = pruneTo;
    }, [pruneTo]);
    return null;
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Three.js */}
      <Canvas shadows={!!prefs.shadowsEnabled} camera={{ position: camPos, fov: 50 }} onPointerMissed={() => selectedSetterRef.current(null)}>
        {prefs.theme === "day" && <color attach="background" args={["#e9edf5"]} />}
        {prefs.theme === "night" && <color attach="background" args={["#05060a"]} />}
        {prefs.theme === "stars" && <color attach="background" args={["#050b2a"]} />}
        {prefs.theme === "stars" && (
          <Stars radius={80} depth={50} count={starCount} factor={4} saturation={0} fade speed={1} />
        )}
        {prefs.theme === "day" && (
          <>
            <hemisphereLight intensity={0.55} />
            <directionalLight position={[6, 10, 4]} intensity={0.9} />
          </>
        )}
        <OrbitControls
          enabled={!isDraggingHUD}
          onStart={() => {
            setIsOrbiting(true);
            if (prefs.orbitMode === "manual") setCameraLockedByUser(true);
          }}
          onEnd={() => setIsOrbiting(false)}
        />
        <AnimatedScaleGroup target={prefs.globalScale}>
          {prefs.showGrid && <gridHelper args={[20, 20]} />}
          {prefs.showAxes && <axesHelper args={[4]} />}
          <SceneStateProvider stateVector={sceneJson?.state_vector ?? {}}>
            <SceneRenderer
              sceneJson={
                sceneJson
                  ? {
                      ...sceneJson,
                      meta: {
                        ...(sceneJson.meta || {}),
                        cameraLockedByUser:
                          prefs.orbitMode === "manual" ? cameraLockedByUser : isOrbiting,
                      },
                    }
                  : null
              }
              shadowsEnabled={!!prefs.shadowsEnabled}
            />
            {/* pass object index list into ChatHUD via provider children (we'll wire at top-level prop) */}
            <SetterRegistrar refSetter={selectedSetterRef} />
            <FullRegistrar
              selectedIdRefLocal={selectedIdRef}
              overridesRefLocal={overridesRef}
              setOverrideRefLocal={setOverrideRef}
            />
          </SceneStateProvider>
        </AnimatedScaleGroup>
      </Canvas>

      {/* Chat Overlay */}
      <ChatHUD
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSend={send}
        activeMode={activeMode}
        onUndo={handleUndo}
        onExport={handleExport}
        onImport={handleImport}
        loading={loading}
        sourceLabel={sourceLabel}
        noSceneUpdate={noSceneUpdate}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        prefs={prefs}
        onPrefsChange={handlePrefsChange}
        objects={(sceneJson?.scene?.objects ?? []).map((o: any, idx: number) => {
          const id = o.id ?? (o.name as string) ?? `${o.type ?? "obj"}:${idx}`;
          const label = (o.name as string) ?? id;
          return { id, label, type: o.type };
        })}
      />
      <InspectorHUD data={sceneJson?.state_vector} />

      {/* Small loading badge */}
      {loading && (
        <div
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            padding: "6px 10px",
            borderRadius: 10,
            background: "rgba(0,0,0,0.55)",
            color: "white",
            fontSize: 12,
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          Sending…
        </div>
      )}
    </div>
  );
}

function AnimatedScaleGroup({ target, children }: { target: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group | null>(null);
  const current = useRef<number>(target);
  const speed = 12; // smoothing speed

  useEffect(() => {
    // initialize to target on mount
    const g = ref.current;
    if (g) g.scale.set(target, target, target);
    current.current = target;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    current.current = smoothValue(current.current, target, speed, delta);
    const v = current.current;
    g.scale.set(v, v, v);
  });

  return <group ref={ref}>{children}</group>;
}

export default function HomePage() {
  return (
    <ErrorBoundary>
      <HomePageContent />
    </ErrorBoundary>
  );
}
