/**
 * E2:80 — Viewport resize throttling + meaningful layout signatures for audits/HUD.
 */

import { resolveExecutiveWorkspaceBreakpoint } from "../ui/executiveWorkspaceLayout";
import { bucketViewportWidth } from "./hudLayoutSignature";

export type ViewportBucket = "mobile" | "tablet" | "desktop";

export function resolveViewportBucket(viewportWidth: number): ViewportBucket {
  if (viewportWidth < 768) return "mobile";
  if (viewportWidth < 1024) return "tablet";
  return "desktop";
}

export function buildViewportResizeSignature(viewportWidth: number): string {
  return JSON.stringify({
    bucket: resolveViewportBucket(viewportWidth),
    workspaceBreakpoint: resolveExecutiveWorkspaceBreakpoint(viewportWidth),
    topBarCompact: viewportWidth < 1100,
    layoutWidth: bucketViewportWidth(viewportWidth),
  });
}

export function shouldCommitViewportWidthUpdate(previousWidth: number, nextWidth: number): boolean {
  return buildViewportResizeSignature(previousWidth) !== buildViewportResizeSignature(nextWidth);
}

export function normalizeAuditViewportInputs(input: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...input };
  if (typeof next.viewportWidth === "number") {
    const width = Math.round(next.viewportWidth);
    next.viewportBucket = resolveViewportBucket(width);
    next.workspaceBreakpoint = resolveExecutiveWorkspaceBreakpoint(width);
    next.topBarCompact = width < 1100;
    delete next.viewportWidth;
  }
  if ("viewportHeight" in next) {
    delete next.viewportHeight;
  }
  for (const [key, value] of Object.entries(next)) {
    if (typeof value === "number") {
      next[key] = Math.round(value);
    }
  }
  return next;
}

export function scheduleViewportResizeCommit(
  run: () => void,
  options?: { target?: Window | null; delayMs?: number }
): () => void {
  const target = options?.target ?? (typeof window !== "undefined" ? window : null);
  if (!target) {
    run();
    return () => {};
  }

  const delayMs = options?.delayMs ?? 80;
  let timeoutId: number | null = null;
  const onResize = () => {
    if (timeoutId != null) {
      target.clearTimeout(timeoutId);
    }
    timeoutId = target.setTimeout(() => {
      timeoutId = null;
      run();
    }, delayMs);
  };

  target.addEventListener("resize", onResize, { passive: true });
  return () => {
    if (timeoutId != null) {
      target.clearTimeout(timeoutId);
      timeoutId = null;
    }
    target.removeEventListener("resize", onResize);
  };
}
