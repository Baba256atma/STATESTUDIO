"use client";

import { useLayoutEffect, useState, type RefObject } from "react";
import {
  EXECUTIVE_STAGE_SAFE_VIEWPORT_OCCLUSION_TESTIDS,
  measureExecutiveStageSafeViewportInsets,
  type ExecutiveStageSafeViewportInsets,
} from "@/app/lib/spatial-presentation/executiveStageSafeViewportCameraFit";

const EMPTY: ExecutiveStageSafeViewportInsets = Object.freeze({
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  width: 1440,
  height: 900,
});

/**
 * Layout-change measurement only. No per-frame DOM polling.
 */
export function useExecutiveStageSafeViewportInsets(
  canvasHostRef: RefObject<HTMLElement | null>,
): ExecutiveStageSafeViewportInsets {
  const [insets, setInsets] = useState<ExecutiveStageSafeViewportInsets>(EMPTY);

  useLayoutEffect(() => {
    const canvasHost = canvasHostRef.current;
    if (canvasHost == null || typeof ResizeObserver === "undefined") return;

    const read = () => {
      const canvas = canvasHost.getBoundingClientRect();
      const frame =
        canvasHost.closest('[data-testid="executive-stage-frame"]') ??
        canvasHost;
      const overlays = EXECUTIVE_STAGE_SAFE_VIEWPORT_OCCLUSION_TESTIDS.map(
        (id) => frame.querySelector(`[data-testid="${id}"]`),
      )
        .filter((node): node is Element => node != null)
        .map((node) => node.getBoundingClientRect());
      const next = measureExecutiveStageSafeViewportInsets({
        canvas: {
          left: canvas.left,
          top: canvas.top,
          right: canvas.right,
          bottom: canvas.bottom,
          width: canvas.width,
          height: canvas.height,
        },
        overlays,
      });
      setInsets((prev) =>
        prev.left === next.left &&
        prev.right === next.right &&
        prev.top === next.top &&
        prev.bottom === next.bottom &&
        prev.width === next.width &&
        prev.height === next.height
          ? prev
          : next,
      );
    };

    read();
    const observer = new ResizeObserver(read);
    observer.observe(canvasHost);
    const frame = canvasHost.closest('[data-testid="executive-stage-frame"]');
    if (frame instanceof Element) observer.observe(frame);
    frame?.addEventListener("toggle", read, true);
    window.addEventListener("resize", read);
    return () => {
      observer.disconnect();
      frame?.removeEventListener("toggle", read, true);
      window.removeEventListener("resize", read);
    };
  }, [canvasHostRef]);

  return insets;
}
