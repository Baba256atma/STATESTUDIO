import test from "node:test";
import assert from "node:assert/strict";

import {
  flushNexoraLoopGuardDiagnosticsForTests,
  resetNexoraLoopGuardDiagnosticsForTests,
  traceNexoraLoopGuard,
} from "./nexoraLoopGuardDiagnostics.ts";

test.beforeEach(() => {
  resetNexoraLoopGuardDiagnosticsForTests();
});

test.afterEach(() => {
  flushNexoraLoopGuardDiagnosticsForTests();
});

test("traceNexoraLoopGuard throttles repeated identical messages", async () => {
  const logs: Array<Record<string, unknown>> = [];
  const originalWarn = globalThis.console.warn;
  globalThis.console.warn = ((label: unknown, payload?: unknown) => {
    if (label === "[NexoraLoopGuard]" && payload && typeof payload === "object") {
      logs.push(payload as Record<string, unknown>);
    }
  }) as typeof globalThis.console.warn;

  try {
    for (let index = 0; index < 50; index += 1) {
      traceNexoraLoopGuard({
        source: "object_click",
        action: "selection_resolved",
        reason: "readonly_selection",
        stateSignature: "sig-repeat",
        objectId: "obj-1",
      });
    }
    flushNexoraLoopGuardDiagnosticsForTests();
    assert.equal(logs.length, 1);
    assert.equal(logs[0]?.action, "selection_resolved");
    assert.equal(logs[0]?.suppressedCount, 49);
  } finally {
    globalThis.console.warn = originalWarn;
  }
});

test("traceNexoraLoopGuard emits distinct messages separately", () => {
  const logs: Array<Record<string, unknown>> = [];
  const originalWarn = globalThis.console.warn;
  globalThis.console.warn = ((label: unknown, payload?: unknown) => {
    if (label === "[NexoraLoopGuard]" && payload && typeof payload === "object") {
      logs.push(payload as Record<string, unknown>);
    }
  }) as typeof globalThis.console.warn;

  try {
    traceNexoraLoopGuard({
      source: "left_nav",
      action: "write_applied",
      reason: "changed_mode",
      stateSignature: "sig-a",
    });
    traceNexoraLoopGuard({
      source: "left_nav",
      action: "write_applied",
      reason: "changed_mode",
      stateSignature: "sig-b",
    });
    flushNexoraLoopGuardDiagnosticsForTests();
    assert.equal(logs.length, 2);
  } finally {
    globalThis.console.warn = originalWarn;
  }
});
