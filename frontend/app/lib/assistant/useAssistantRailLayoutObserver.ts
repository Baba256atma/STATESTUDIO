"use client";

import { useEffect } from "react";

import { bindWindowListener } from "../dom/domListenerLifecycle";
import {
  measureAssistantRailLayout,
  publishAssistantRailLayoutMeasurement,
  traceAssistantRailLayout,
} from "../assistant/assistantRailWidthRuntime";

/** Observes assistant rail geometry and emits dev trace metrics. */
export function useAssistantRailLayoutObserver(active: boolean): void {
  useEffect(() => {
    if (!active || typeof window === "undefined") return;

    let frame = 0;
    let lastSignature = "";

    const sample = () => {
      const measurement = measureAssistantRailLayout();
      if (!measurement) return;
      const signature = [
        Math.round(measurement.assistantWidth),
        Math.round(measurement.sceneWidth),
        measurement.readingComfort,
      ].join("|");
      if (signature === lastSignature) return;
      lastSignature = signature;
      publishAssistantRailLayoutMeasurement(measurement);
      traceAssistantRailLayout(measurement);
    };

    const schedule = () => {
      frame = window.requestAnimationFrame(sample);
    };

    schedule();
    const unbindResize = bindWindowListener("resize", schedule, undefined, {
      component: "AssistantRailLayoutObserver",
      eventType: "resize",
    });

    return () => {
      window.cancelAnimationFrame(frame);
      unbindResize();
    };
  }, [active]);
}

export default useAssistantRailLayoutObserver;
