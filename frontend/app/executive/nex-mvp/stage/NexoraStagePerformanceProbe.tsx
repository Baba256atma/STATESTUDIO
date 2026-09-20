"use client";

import { useEffect } from "react";
import {
  stageProdBrowserPerformanceMeasurementIdentity,
  summarizeStageProdFrameTimestamps,
} from "@/app/lib/stage-prod/stageProdBrowserPerformanceMeasurement.ts";

const SAMPLE_MS = 1_500;
const MAX_PROBE_MS = 30_000;
const STABILITY_QUIET_MS = 300;

type ProbeState =
  | "waiting-investigation"
  | "stabilizing-idle"
  | "idle"
  | "ready-comparison"
  | "motion"
  | "stabilizing-post-motion"
  | "post-motion"
  | "ready-interaction"
  | "interaction"
  | "complete"
  | "timeout";

export function NexoraStagePerformanceProbe() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("stagePerfProbe") !== "1") return;
    const host = document.querySelector<HTMLElement>(
      '[data-testid="nexora-3d-executive-stage"]',
    );
    if (!host) return;

    let state: ProbeState = "waiting-investigation";
    let stateStartedAt = performance.now();
    let frameId = 0;
    let idleTimestamps: number[] = [];
    let motionTimestamps: number[] = [];
    let postMotionTimestamps: number[] = [];
    let interactionStartedAt: number | null = null;
    let interactionBaseline: string | null = null;
    let interactionLatencyMs: number | null = null;
    let animationStartedAt: number | null = null;
    let animationCompletedAt: number | null = null;
    let idleMotionWrites = 0;
    let postMotionWrites = 0;
    const probeStartedAt = performance.now();
    let lastMotionMutationAt = probeStartedAt;

    const signature = () =>
      [
        host.getAttribute("data-stage-prod-composition-signature"),
        host.getAttribute("data-stage-focused-object-id"),
        host.getAttribute("data-stage-prod-scene-family"),
      ].join("|");
    const motionSettled = () =>
      host.getAttribute("data-stage-motion-settled") === "true";
    const sceneFamily = () =>
      host.getAttribute("data-stage-prod-scene-family") ?? "none";
    const publishStatus = () => {
      host.setAttribute("data-stage-perf-probe", "stage-prod-8a");
      host.setAttribute("data-stage-perf-probe-status", state);
      host.setAttribute(
        "data-stage-perf-probe-identity",
        stageProdBrowserPerformanceMeasurementIdentity,
      );
      host.setAttribute("data-stage-perf-probe-writes", "false");
    };
    const publishResult = () => {
      host.setAttribute(
        "data-stage-perf-probe-result",
        JSON.stringify({
          identity: stageProdBrowserPerformanceMeasurementIdentity,
          sampleWindowMs: SAMPLE_MS,
          stabilityQuietMs: STABILITY_QUIET_MS,
          idle: summarizeStageProdFrameTimestamps(idleTimestamps),
          motion: summarizeStageProdFrameTimestamps(motionTimestamps),
          postMotion: summarizeStageProdFrameTimestamps(postMotionTimestamps),
          animationObservedMs:
            animationStartedAt != null && animationCompletedAt != null
              ? Math.round((animationCompletedAt - animationStartedAt) * 1000) /
                1000
              : null,
          interactionLatencyMs,
          idleMotionAttributeWrites: idleMotionWrites,
          postMotionAttributeWrites: postMotionWrites,
          finalSceneFamily: sceneFamily(),
          finalCompositionIds:
            host.getAttribute("data-stage-prod-composition-object-ids") ??
            "none",
          finalFocusedObjectId:
            host.getAttribute("data-stage-focused-object-id") ?? "none",
          reducedMotion: window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches,
          writesCanonicalManagementState: false,
        }),
      );
    };

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (!record.attributeName?.startsWith("data-stage-motion-")) continue;
        lastMotionMutationAt = performance.now();
        if (state === "idle") idleMotionWrites += 1;
        if (state === "post-motion") postMotionWrites += 1;
      }
    });
    observer.observe(host, { attributes: true });

    const onPointerDown = () => {
      if (state !== "ready-interaction") return;
      state = "interaction";
      stateStartedAt = performance.now();
      interactionStartedAt = stateStartedAt;
      interactionBaseline = signature();
      publishStatus();
    };
    host.addEventListener("pointerdown", onPointerDown, true);
    publishStatus();

    const tick = (now: number) => {
      const family = sceneFamily();
      const settled = motionSettled();
      if (
        state === "waiting-investigation" &&
        family === "investigation" &&
        settled
      ) {
        state = "stabilizing-idle";
        stateStartedAt = now;
        lastMotionMutationAt = now;
        publishStatus();
      }
      if (
        state === "stabilizing-idle" &&
        now - lastMotionMutationAt >= STABILITY_QUIET_MS
      ) {
        state = "idle";
        stateStartedAt = now;
        idleTimestamps = [];
        idleMotionWrites = 0;
        publishStatus();
      }
      if (state === "idle") {
        idleTimestamps.push(now);
        if (now - stateStartedAt >= SAMPLE_MS) {
          state = "ready-comparison";
          stateStartedAt = now;
          publishStatus();
        }
      } else if (
        state === "ready-comparison" &&
        family === "comparison" &&
        !settled
      ) {
        state = "motion";
        stateStartedAt = now;
        animationStartedAt = now;
        motionTimestamps = [now];
        publishStatus();
      } else if (state === "motion") {
        motionTimestamps.push(now);
        if (settled) {
          animationCompletedAt = now;
          state = "stabilizing-post-motion";
          stateStartedAt = now;
          lastMotionMutationAt = now;
          publishStatus();
        }
      } else if (
        state === "stabilizing-post-motion" &&
        now - lastMotionMutationAt >= STABILITY_QUIET_MS
      ) {
        state = "post-motion";
        stateStartedAt = now;
        postMotionTimestamps = [now];
        postMotionWrites = 0;
        publishStatus();
      } else if (state === "post-motion") {
        postMotionTimestamps.push(now);
        if (now - stateStartedAt >= SAMPLE_MS) {
          state = "ready-interaction";
          stateStartedAt = now;
          publishResult();
          publishStatus();
        }
      } else if (
        state === "interaction" &&
        interactionStartedAt != null &&
        interactionBaseline !== signature()
      ) {
        interactionLatencyMs =
          Math.round((now - interactionStartedAt) * 1000) / 1000;
        state = "complete";
        publishResult();
        publishStatus();
      }

      if (state !== "complete" && now - probeStartedAt >= MAX_PROBE_MS) {
        state = "timeout";
        publishResult();
        publishStatus();
      }
      if (state !== "complete" && state !== "timeout") {
        frameId = window.requestAnimationFrame(tick);
      }
    };
    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      host.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, []);

  return null;
}
