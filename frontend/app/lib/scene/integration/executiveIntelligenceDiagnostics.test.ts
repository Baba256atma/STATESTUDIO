import test from "node:test";
import assert from "node:assert/strict";

import {
  logE2100AcceptanceGateFailed,
  resetExecutiveIntelligenceDiagnosticsForTests,
} from "./executiveIntelligenceDiagnostics.ts";

test("AcceptanceGateFailed logs once per stable signature and summarizes repeats", () => {
  resetExecutiveIntelligenceDiagnosticsForTests();
  const originalDebug = globalThis.console.debug;
  const originalInfo = globalThis.console.info;
  const debugLogs: Array<{ label: string; payload: unknown }> = [];
  const infoLogs: Array<{ label: string; payload: unknown }> = [];
  globalThis.console.debug = ((label: string, payload: unknown) => {
    debugLogs.push({ label, payload });
  }) as typeof globalThis.console.debug;
  globalThis.console.info = ((label: string, payload: unknown) => {
    infoLogs.push({ label, payload });
  }) as typeof globalThis.console.info;

  try {
    const blockers = ["business acceptance incomplete"];
    const payload = { subsystem: "executive-intelligence" };
    const options = { sceneReady: true, inputSignature: "scene:a" };

    logE2100AcceptanceGateFailed(blockers, payload, options);
    logE2100AcceptanceGateFailed(blockers, payload, options);
    logE2100AcceptanceGateFailed(blockers, payload, options);

    assert.equal(debugLogs.filter((entry) => entry.label === "[E2:100][AcceptanceGateFailed]").length, 1);
    assert.equal(debugLogs.filter((entry) => entry.label === "[E2:100][AcceptanceGateFailedSummary]").length, 1);
    assert.equal(infoLogs.length, 1);
  } finally {
    globalThis.console.debug = originalDebug;
    globalThis.console.info = originalInfo;
    resetExecutiveIntelligenceDiagnosticsForTests();
  }
});
