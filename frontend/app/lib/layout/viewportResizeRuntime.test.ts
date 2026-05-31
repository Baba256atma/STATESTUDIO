import { describe, expect, it } from "vitest";

import {
  buildViewportResizeSignature,
  normalizeAuditViewportInputs,
  resolveViewportBucket,
  shouldCommitViewportWidthUpdate,
} from "./viewportResizeRuntime";

describe("viewportResizeRuntime", () => {
  it("maps viewport widths to mobile, tablet, and desktop buckets", () => {
    expect(resolveViewportBucket(390)).toBe("mobile");
    expect(resolveViewportBucket(900)).toBe("tablet");
    expect(resolveViewportBucket(1440)).toBe("desktop");
  });

  it("ignores sub-bucket pixel drift", () => {
    expect(shouldCommitViewportWidthUpdate(1200, 1210)).toBe(false);
    expect(shouldCommitViewportWidthUpdate(900, 980)).toBe(false);
  });

  it("detects meaningful bucket and compact breakpoint changes", () => {
    expect(shouldCommitViewportWidthUpdate(760, 780)).toBe(true);
    expect(shouldCommitViewportWidthUpdate(1090, 1110)).toBe(true);
    expect(shouldCommitViewportWidthUpdate(1000, 1030)).toBe(true);
  });

  it("builds stable audit viewport fields", () => {
    const normalized = normalizeAuditViewportInputs({
      viewportWidth: 1060,
      viewportHeight: 900,
      commandBarVisible: true,
    });
    expect(normalized.viewportBucket).toBe("desktop");
    expect(normalized.topBarCompact).toBe(true);
    expect(normalized.viewportWidth).toBeUndefined();
    expect(normalized.viewportHeight).toBeUndefined();
    expect(buildViewportResizeSignature(1060)).toBe(buildViewportResizeSignature(1075));
  });
});
