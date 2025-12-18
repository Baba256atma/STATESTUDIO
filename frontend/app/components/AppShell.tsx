"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { VisualState } from "../lib/visualState";
import { TopBar } from "./TopBar";
import { InsightCard } from "./InsightCard";
import { ReplayBar } from "./ReplayBar";
import { SettingsPanel } from "./SettingsPanel";
import { SceneViewport } from "./SceneViewport";
import { useReplayEpisode } from "../hooks/useReplayEpisode";
import { useReplayPlayer } from "../hooks/useReplayPlayer";
import { useReplayEpisodesList } from "../hooks/useReplayEpisodesList";
import { parseVisualState } from "../lib/visualState";
import { buildInsight } from "../lib/insight/buildInsight";
import { seedDemo } from "../lib/api/replayApi";

const mockVisualState: VisualState = {
  t: 0,
  focus: "node_core",
  nodes: [
    {
      id: "node_core",
      shape: "sphere",
      pos: [0, 0, 0],
      color: "#8fb3ff",
      intensity: 0.6,
      opacity: 0.9,
      scale: 1.2,
    },
    {
      id: "node_limit",
      shape: "dodeca",
      pos: [1.8, 0.6, -0.4],
      color: "#f0b96a",
      intensity: 0.5,
      opacity: 0.85,
    },
    {
      id: "node_growth",
      shape: "ico",
      pos: [-1.6, -0.4, 0.6],
      color: "#8bd7a1",
      intensity: 0.7,
      opacity: 0.9,
    },
  ],
  loops: [
    {
      id: "loop_reinforce",
      type: "R",
      center: [0, 0, 0],
      radius: 1.6,
      intensity: 0.5,
      flowSpeed: 0.6,
    },
    {
      id: "loop_balance",
      type: "B",
      center: [0, 0, 0],
      radius: 2.4,
      intensity: 0.4,
      flowSpeed: 0.4,
      bottleneck: 0.6,
      delay: 0.4,
    },
  ],
  levers: [
    {
      id: "lever_policy",
      target: "node_limit",
      pos: [2.6, -0.8, 0.2],
      strength: 0.5,
    },
  ],
  flows: [
    {
      id: "flow_growth_to_limit",
      from: "node_growth",
      to: "node_limit",
      type: "tube",
      speed: 0.4,
      intensity: 0.6,
      color: "#b9c4ff",
    },
  ],
  field: {
    chaos: 0.35,
    density: 0.4,
    noiseAmp: 0.3,
  },
};

export function AppShell() {
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [episodeId, setEpisodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"live" | "replay">("live");
  const [visualState, setVisualState] = useState<VisualState>(mockVisualState);
  const [focusId, setFocusId] = useState<string | null>(mockVisualState.focus ?? null);
  const [focusSource, setFocusSource] = useState<"replay" | "user">("replay");
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [replayLoadBehavior, setReplayLoadBehavior] = useState<"start" | "end" | null>(
    null
  );
  const [lastValidReplayVisual, setLastValidReplayVisual] = useState<VisualState | null>(
    null
  );
  const [ui, setUi] = useState({
    isSettingsOpen: false,
    isInsightOpen: true,
    backgroundMode: "night" as const,
    orbitMode: "auto" as const,
    showAxes: false,
  });
  const replayEpisode = useReplayEpisode(selectedEpisodeId);
  const episodesList = useReplayEpisodesList();
  const hasReplayFrames = (replayEpisode.episode?.frames?.length ?? 0) > 0;
  const replayDuration =
    Number.isFinite(replayEpisode.episode?.duration) && replayEpisode.episode?.duration
      ? Math.max(0, replayEpisode.episode.duration)
      : Math.max(0, replayEpisode.episode?.frames?.slice(-1)?.[0]?.t ?? 0);
  const lastGoodVisualRef = useRef<VisualState>(mockVisualState);
  const [visualWarning, setVisualWarning] = useState<string | null>(null);
  const player = useReplayPlayer(
    replayEpisode.episode?.frames ?? null,
    replayDuration
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) {
      setUi((prev) => ({ ...prev, isInsightOpen: false }));
    }
  }, []);

  useEffect(() => {
    if (selectedEpisodeId) setEpisodeId(selectedEpisodeId);
  }, [selectedEpisodeId]);

  const replayVisualState = useMemo(() => {
    if (!player.currentFrame?.visual) return null;
    const parsed = parseVisualState(player.currentFrame.visual);
    return parsed.ok ? parsed.data : null;
  }, [player.currentFrame]);

  useEffect(() => {
    if (replayVisualState) {
      setLastValidReplayVisual(replayVisualState);
    }
  }, [replayVisualState]);

  useEffect(() => {
    if (!replayEpisode.episode) {
      setVisualState(mockVisualState);
      setFocusSource("replay");
      setFocusId(mockVisualState.focus ?? null);
      setLastValidReplayVisual(null);
    }
  }, [replayEpisode.episode]);

  useEffect(() => {
    if (viewMode !== "replay") return;
    if (!replayEpisode.error) return;
    setViewMode("live");
  }, [replayEpisode.error, viewMode]);

  const activeVisualCandidate = useMemo(() => {
    if (viewMode === "replay") {
      if (replayVisualState) return replayVisualState;
      if (lastValidReplayVisual) return lastValidReplayVisual;
    }
    return visualState;
  }, [lastValidReplayVisual, replayVisualState, visualState, viewMode]);

  const validatedVisual = useMemo(() => {
    const parsed = parseVisualState(activeVisualCandidate);
    if (parsed.ok) {
      lastGoodVisualRef.current = parsed.data;
      setVisualWarning(null);
      return parsed.data;
    }
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[VisualState] invalid payload:", parsed.error);
    }
    setVisualWarning("Visual payload invalid");
    return lastGoodVisualRef.current;
  }, [activeVisualCandidate]);

  useEffect(() => {
    if (viewMode !== "replay") return;
    if (focusSource === "user") return;
    const focusFromVisual =
      replayVisualState && typeof replayVisualState.focus === "string"
        ? replayVisualState.focus
        : lastValidReplayVisual?.focus ?? null;
    if (focusFromVisual !== null) {
      setFocusId(focusFromVisual);
    }
  }, [focusSource, lastValidReplayVisual, replayVisualState, viewMode]);

  const lastReplayIdRef = React.useRef<string | null>(null);
  useEffect(() => {
    if (viewMode !== "replay") return;
    const episode = replayEpisode.episode;
    if (!episode) return;
    if (lastReplayIdRef.current === episode.episode_id) return;
    lastReplayIdRef.current = episode.episode_id;
    if (replayLoadBehavior === "start") {
      player.scrub(0);
      player.play();
    } else {
      player.pause();
      player.scrub(episode.duration || 0);
    }
    setReplayLoadBehavior(null);
    setFocusSource("replay");
  }, [player, replayEpisode.episode, replayLoadBehavior, viewMode]);

  const handleStartDemo = async (demoId: "growth" | "fixes" | "escalation") => {
    setDemoLoading(true);
    setDemoError(null);
    try {
      const result = await seedDemo(demoId);
      setSelectedEpisodeId(result.episode_id);
      setViewMode("replay");
      setReplayLoadBehavior("start");
      episodesList.reload();
    } catch (err: any) {
      setDemoError(err?.message ?? "Failed to start demo");
    } finally {
      setDemoLoading(false);
    }
  };

  const currentInsight = player.currentFrame ? buildInsight(player.currentFrame) : null;
  const replayVisualWarning =
    viewMode === "replay" && player.currentFrame && !replayVisualState && lastValidReplayVisual;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 text-white">
      {replayEpisode.error && (
        <div className="absolute left-1/2 top-14 z-30 -translate-x-1/2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/80">
          Replay unavailable. Switched to live view.
        </div>
      )}
      {episodesList.error && !replayEpisode.error && (
        <div className="absolute left-1/2 top-14 z-30 -translate-x-1/2 rounded-md border border-white/10 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
          {episodesList.error}
        </div>
      )}
      {replayEpisode.loading && (
        <div className="absolute left-1/2 top-24 z-30 -translate-x-1/2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/80">
          Loading replay…
        </div>
      )}
      {viewMode === "replay" && !replayEpisode.loading && selectedEpisodeId && !hasReplayFrames && (
        <div className="absolute left-1/2 top-24 z-30 -translate-x-1/2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
          No frames recorded yet. Switch to Live or run a demo.
        </div>
      )}
      {replayVisualWarning && (
        <div className="absolute left-1/2 top-32 z-30 -translate-x-1/2 rounded-md border border-amber-200/30 bg-amber-500/15 px-3 py-2 text-xs text-amber-100">
          Current frame missing visual. Showing last valid state.
        </div>
      )}
      {visualWarning && (
        <div className="absolute left-1/2 top-40 z-30 -translate-x-1/2 rounded-md border border-amber-200/30 bg-amber-500/15 px-3 py-2 text-xs text-amber-100">
          {visualWarning}
        </div>
      )}
      <SceneViewport
        visualState={validatedVisual}
        focusId={focusId}
        backgroundMode={ui.backgroundMode}
        orbitMode={ui.orbitMode}
        showAxes={ui.showAxes}
        onFocus={(id) => {
          setFocusId(id);
          setFocusSource("user");
        }}
      />

      <TopBar
        modeLabel={viewMode === "replay" ? "Replay" : "Live"}
        onToggleSettings={() => setUi((prev) => ({ ...prev, isSettingsOpen: !prev.isSettingsOpen }))}
        episodes={episodesList.episodes}
        selectedEpisodeId={selectedEpisodeId}
        onEpisodeChange={(episodeId) => setSelectedEpisodeId(episodeId)}
        onReloadEpisode={() => {
          episodesList.reload();
          replayEpisode.reload();
        }}
        episodesLoading={episodesList.loading}
        episodeId={episodeId}
        onOpenReplay={() => {
          if (episodeId) {
            setSelectedEpisodeId(episodeId);
            setViewMode("replay");
            setReplayLoadBehavior("end");
          }
        }}
        viewMode={viewMode}
        onBackToLive={() => setViewMode("live")}
        onReplayFromStart={() => {
          setViewMode("replay");
          player.scrub(0);
          player.play();
        }}
      />

      <SettingsPanel
        isOpen={ui.isSettingsOpen}
        backgroundMode={ui.backgroundMode}
        orbitMode={ui.orbitMode}
        showAxes={ui.showAxes}
        onBackgroundModeChange={(mode) => setUi((prev) => ({ ...prev, backgroundMode: mode }))}
        onOrbitModeChange={(mode) => setUi((prev) => ({ ...prev, orbitMode: mode }))}
        onShowAxesChange={(next) => setUi((prev) => ({ ...prev, showAxes: next }))}
        onClose={() => setUi((prev) => ({ ...prev, isSettingsOpen: false }))}
        onStartDemo={handleStartDemo}
        demoLoading={demoLoading}
        demoError={demoError}
      />

      <InsightCard
        isOpen={ui.isInsightOpen}
        onToggle={() => setUi((prev) => ({ ...prev, isInsightOpen: !prev.isInsightOpen }))}
        focusId={focusId}
        insight={currentInsight}
        onSelectLever={() => setFocusId("lever_policy")}
      />

      <ReplayBar
        isPlaying={player.isPlaying}
        speed={player.speed}
        currentTime={player.currentTime}
        duration={replayDuration}
        hasFrames={hasReplayFrames}
        loading={replayEpisode.loading}
        onPlayPause={player.togglePlay}
        onSpeedChange={player.setSpeed}
        onScrub={player.scrub}
        onStep={player.step}
      />
    </div>
  );
}
