import test from "node:test";
import assert from "node:assert/strict";

import {
  emitPhase2RuntimeCertification,
  resetPhase2RuntimeCertificationForTests,
  runPhase2RuntimeCertification,
} from "./nexoraPhase2RuntimeCertification.ts";
import { resetArchitectureFreezeRuntimeForTests } from "./nexoraArchitectureFreezeRuntime.ts";

test.beforeEach(() => {
  resetArchitectureFreezeRuntimeForTests();
  resetPhase2RuntimeCertificationForTests();
});

test("phase 2 certification passes static acceptance gates", () => {
  const result = runPhase2RuntimeCertification({ force: true });
  assert.ok(result.result === "PASS" || result.result === "PASS WITH WARNINGS");
  assert.equal(result.gates.every((gate) => gate.status === "PASS"), true);
  assert.equal(result.blockers.length, 0);
});

test("emitPhase2RuntimeCertification logs certification tags once", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    emitPhase2RuntimeCertification({ force: true });
    emitPhase2RuntimeCertification({ force: true });
    assert.equal(logs.filter((label) => label === "[Nexora][Phase2Smoke]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][RuntimeAudit]").length, 1);
    assert.ok(logs.filter((label) => label === "[Nexora][CanonicalSurface]").length >= 1);
    assert.equal(logs.filter((label) => label === "[Nexora][Phase2Certification]").length, 1);
  } finally {
    globalThis.console.info = originalInfo;
  }
});
