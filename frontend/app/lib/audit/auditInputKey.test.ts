import { describe, expect, it } from "vitest";

import { buildStableAuditInputKey } from "./auditInputKey";

describe("auditInputKey", () => {
  it("normalizes viewport width to stable audit buckets", () => {
    const keyA = buildStableAuditInputKey({
      kind: "topBarPriority",
      viewportWidth: 1050,
      quickActionsVisible: true,
    });
    const keyB = buildStableAuditInputKey({
      kind: "topBarPriority",
      viewportWidth: 1065,
      quickActionsVisible: true,
    });
    expect(keyA).toBe(keyB);
    expect(keyA).toContain('"viewportBucket":"desktop"');
    expect(keyA).toContain('"topBarCompact":true');
  });

  it("changes audit key when crossing a meaningful viewport bucket", () => {
    const mobile = buildStableAuditInputKey({ viewportWidth: 720 });
    const tablet = buildStableAuditInputKey({ viewportWidth: 900 });
    const desktop = buildStableAuditInputKey({ viewportWidth: 1200 });
    expect(mobile).not.toBe(tablet);
    expect(tablet).not.toBe(desktop);
  });
});
