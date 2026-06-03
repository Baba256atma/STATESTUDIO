import test from "node:test";
import assert from "node:assert/strict";

import { devLogThrottled, resetDiagnosticThrottleForTests } from "./diagnosticThrottle.ts";

test.beforeEach(() => {
  resetDiagnosticThrottleForTests();
});

test("devLogThrottled emits once per interval for identical payload", () => {
  const warnings: unknown[] = [];
  const originalWarn = globalThis.console.warn;
  globalThis.console.warn = (...args: unknown[]) => {
    warnings.push(args[0]);
  };
  try {
    devLogThrottled({
      key: "sig-a",
      label: "[TestThrottle]",
      payload: { blocker: "x" },
      intervalMs: 5000,
    });
    devLogThrottled({
      key: "sig-a",
      label: "[TestThrottle]",
      payload: { blocker: "x" },
      intervalMs: 5000,
    });
    assert.equal(warnings.length, 1);
  } finally {
    globalThis.console.warn = originalWarn;
  }
});
