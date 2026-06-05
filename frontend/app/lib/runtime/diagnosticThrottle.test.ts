import test from "node:test";
import assert from "node:assert/strict";

import { devLogThrottled, resetDiagnosticThrottleForTests } from "./diagnosticThrottle.ts";
import { resetDiagnosticSwitchForTests } from "./diagnosticSwitch.ts";

test.beforeEach(() => {
  resetDiagnosticSwitchForTests();
  resetDiagnosticThrottleForTests();
});

test.afterEach(() => {
  resetDiagnosticSwitchForTests();
});

test("devLogThrottled emits once per interval for identical payload", () => {
  const infos: unknown[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    infos.push(args[0]);
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
    assert.equal(infos.filter((label) => label === "[TestThrottle]").length, 1);
  } finally {
    globalThis.console.info = originalInfo;
  }
});
