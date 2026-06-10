"use client";

import { useEffect } from "react";

import {
  measureAssistantRailLayout,
  publishAssistantRailLayoutMeasurement,
  traceAssistantRailLayout,
} from "../../lib/assistant/assistantRailWidthRuntime";

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
    window.addEventListener("resize", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
    };
  }, [active]);
}

export default useAssistantRailLayoutObserver;
