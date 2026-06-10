import test from "node:test";
import assert from "node:assert/strict";

import { NEXORA_ARCHITECTURE_FREEZE_REGISTRY } from "./nexoraArchitectureFreezeRegistry.ts";
import {
  initializeNexoraArchitectureFreeze,
  reportDeprecatedSurface,
  reportArchitectureViolation,
  resetArchitectureFreezeRuntimeForTests,
  runArchitectureFreezeValidationPass,
  validateRightPanelActivation,
  validateSelectionOwnershipWrite,
} from "./nexoraArchitectureFreezeRuntime.ts";

test.beforeEach(() => {
  resetArchitectureFreezeRuntimeForTests();
});

test("registry exposes frozen contracts and coverage matrix", () => {
  assert.equal(NEXORA_ARCHITECTURE_FREEZE_REGISTRY.contracts.length, 22);
  assert.equal(NEXORA_ARCHITECTURE_FREEZE_REGISTRY.leftNavModeCount, 7);
  assert.ok(NEXORA_ARCHITECTURE_FREEZE_REGISTRY.coverageMatrix.rightPanel.includes("legacy_surface_detection"));
});

test("validation pass detects legacy right-rail surfaces", () => {
  const result = runArchitectureFreezeValidationPass({ force: true });
  assert.equal(result.ok, true);
  assert.equal(result.checks.find((check) => check.id === "mrp.legacy_surface_detection")?.passed, true);
});

test("initialize emits ArchitectureFreeze tag once", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeNexoraArchitectureFreeze();
    initializeNexoraArchitectureFreeze();
    assert.equal(logs.filter((label) => label === "[Nexora][ArchitectureFreeze]").length, 1);
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("deprecated surface and violation warnings dedupe", () => {
  const warnings: string[] = [];
  const originalWarn = globalThis.console.warn;
  globalThis.console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string") warnings.push(args[0]);
  };
  try {
    validateRightPanelActivation("workspace", "test");
    validateRightPanelActivation("workspace", "test");
    validateSelectionOwnershipWrite({ writer: "SceneContext.selectedId", source: "test" });
    validateSelectionOwnershipWrite({ writer: "SceneContext.selectedId", source: "test" });
    reportDeprecatedSurface({ surface: "object", source: "test" });
    reportDeprecatedSurface({ surface: "object", source: "test" });
    reportArchitectureViolation({
      contractId: "selection.single_owner",
      reason: "duplicate",
      source: "test",
    });
    reportArchitectureViolation({
      contractId: "selection.single_owner",
      reason: "duplicate",
      source: "test",
    });
    assert.equal(warnings.filter((label) => label === "[Nexora][DeprecatedSurface]").length, 2);
    assert.equal(warnings.filter((label) => label === "[Nexora][ArchitectureViolation]").length, 2);
  } finally {
    globalThis.console.warn = originalWarn;
  }
});
