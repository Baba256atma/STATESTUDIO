"use client";

import { useEffect, useRef } from "react";

export type EmotionalTarget = {
  id: string;
  baseScale: number;
  baseOpacity: number;
  state: "stable" | "warning" | "critical";
  intensity: number;
};

export type UseEmotionalFxEngineArgs = {
  sceneReady: boolean;
  mapNexoraIdToSceneId: (id: string) => string | null;
  nexoraMvp: unknown;
  effectiveActiveLoopId: string | null;
  loops: unknown[];
  kpi: unknown;
  setOverride: (id: string, patch: { scale?: number; opacity?: number }) => void;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function useEmotionalFxEngine({
  sceneReady,
  mapNexoraIdToSceneId,
  nexoraMvp,
  effectiveActiveLoopId,
  loops,
  kpi,
  setOverride,
}: UseEmotionalFxEngineArgs) {
  const targetsRef = useRef<EmotionalTarget[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sceneReady) return;
    if (typeof setOverride !== "function") return;

    const mvp: any = nexoraMvp as any;
    const list: any[] = Array.isArray(mvp?.objects) ? mvp.objects : [];

    const targets: EmotionalTarget[] = [];

    const upsert = (next: EmotionalTarget) => {
      const idx = targets.findIndex((t) => t.id === next.id);
      if (idx === -1) {
        targets.push(next);
        return;
      }
      const prev = targets[idx];
      const rank = (s: EmotionalTarget["state"]) => (s === "critical" ? 2 : s === "warning" ? 1 : 0);
      targets[idx] = {
        id: prev.id,
        state: rank(next.state) > rank(prev.state) ? next.state : prev.state,
        intensity: Math.max(prev.intensity, next.intensity),
        baseScale: Math.max(prev.baseScale, next.baseScale),
        baseOpacity: Math.max(prev.baseOpacity, next.baseOpacity),
      };
    };

    // Base targets from MVP objects
    for (const o of list) {
      const rawId = String(o?.id ?? "").trim();
      const sceneId = mapNexoraIdToSceneId(rawId);
      if (!sceneId) continue;

      const intensity = clamp01(Number(o?.intensity ?? 0));
      const state: EmotionalTarget["state"] =
        o?.state === "stable" || o?.state === "warning" || o?.state === "critical" ? o.state : "stable";

      const baseScale = 1.0 + intensity * 0.55;
      const baseOpacity = state === "critical" ? 1.0 : state === "warning" ? 0.94 : 0.88;

      setOverride(sceneId, { scale: baseScale, opacity: baseOpacity });
      upsert({ id: sceneId, baseScale, baseOpacity, state, intensity });
    }

    // Loop mood boost (best-effort)
    try {
      const loopId = effectiveActiveLoopId ?? null;
      if (loopId && Array.isArray(loops) && loops.length) {
        const loop = loops.find((l: any) => String(l?.id ?? "") === String(loopId));
        const edges: any[] = Array.isArray((loop as any)?.edges) ? (loop as any).edges : [];
        const nodeIds = new Set<string>();
        for (const e of edges) {
          const from = typeof e?.from === "string" ? e.from : null;
          const to = typeof e?.to === "string" ? e.to : null;
          if (from) nodeIds.add(from);
          if (to) nodeIds.add(to);
        }

        const kk: any = kpi as any;
        const moodBase = clamp01(
          (typeof kk?.overall?.risk === "number" ? kk.overall.risk : 0) ||
            (typeof kk?.risk === "number" ? kk.risk : 0) ||
            0.25
        );

        for (const id of nodeIds) {
          const boost = clamp01(0.25 + moodBase * 0.75);
          upsert({
            id,
            baseScale: 1.0 + boost * 0.45,
            baseOpacity: 0.92,
            state: "warning",
            intensity: boost,
          });
        }
      }
    } catch {
      // ignore
    }

    targetsRef.current = targets;
  }, [sceneReady, nexoraMvp, mapNexoraIdToSceneId, effectiveActiveLoopId, loops, kpi, setOverride]);

  useEffect(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = window.setInterval(() => {
      const targets = targetsRef.current || [];
      if (!targets.length) return;

      const active = targets.filter((t) => t && t.state !== "stable");
      if (!active.length) return;

      const time = Date.now();

      for (const t of active) {
        const strength = t.state === "critical" ? 1.0 : 0.7;
        const intensity = clamp01(t.intensity + 0.2);

        const speed = t.state === "critical" ? 210 : 280;
        const wave = (Math.sin(time / speed) + 1) / 2;

        const ampScale = (t.state === "critical" ? 0.08 : 0.055) * strength * intensity;
        const ampOpacity = (t.state === "critical" ? 0.06 : 0.04) * strength * intensity;

        const nextScale = t.baseScale * (1 + ampScale * (wave - 0.5) * 2);
        const nextOpacity = clamp01(t.baseOpacity + ampOpacity * (wave - 0.5) * 2);

        setOverride(t.id, { scale: nextScale, opacity: nextOpacity });
      }
    }, 80);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [setOverride]);
}
