import test from "node:test";
import assert from "node:assert/strict";

import {
  getDiagnosticStatus,
  installDiagnosticConsoleHelper,
  isDiagnosticEnabled,
  resetDiagnosticSwitchForTests,
} from "./diagnosticSwitch.ts";

test.beforeEach(() => {
  resetDiagnosticSwitchForTests();
});

test.afterEach(() => {
  resetDiagnosticSwitchForTests();
});

test("diagnostics are enabled in development by default", () => {
  assert.equal(isDiagnosticEnabled(), true);
  assert.equal(isDiagnosticEnabled("sceneRenderSource"), true);
  assert.equal(isDiagnosticEnabled("panel"), false);
  assert.equal(isDiagnosticEnabled("scene"), false);
  assert.equal(isDiagnosticEnabled("acceptanceGate"), false);
});

test("panel diagnostics are quiet until the panel scope is enabled", () => {
  installDiagnosticConsoleHelper();
  const helper = (globalThis as unknown as {
    nexoraDiagnostics: {
      enableScope: (scope: string) => unknown;
      disableScope: (scope: string) => unknown;
    };
  }).nexoraDiagnostics;

  assert.equal(isDiagnosticEnabled("panel"), false);
  helper.enableScope("panel");
  assert.equal(isDiagnosticEnabled("panel"), true);
  helper.disableScope("panel");
  assert.equal(isDiagnosticEnabled("panel"), false);
});

test("scene diagnostics are quiet until the scene scope is enabled", () => {
  installDiagnosticConsoleHelper();
  const helper = (globalThis as unknown as {
    nexoraDiagnostics: {
      enableScope: (scope: string) => unknown;
      disableScope: (scope: string) => unknown;
    };
  }).nexoraDiagnostics;

  assert.equal(isDiagnosticEnabled("scene"), false);
  helper.enableScope("scene");
  assert.equal(isDiagnosticEnabled("scene"), true);
  helper.disableScope("scene");
  assert.equal(isDiagnosticEnabled("scene"), false);
});

test("acceptance gate diagnostics are quiet until the scope is enabled", () => {
  installDiagnosticConsoleHelper();
  const helper = (globalThis as unknown as {
    nexoraDiagnostics: {
      enableScope: (scope: string) => unknown;
      disableScope: (scope: string) => unknown;
    };
  }).nexoraDiagnostics;

  assert.equal(isDiagnosticEnabled("acceptanceGate"), false);
  helper.enableScope("acceptanceGate");
  assert.equal(isDiagnosticEnabled("acceptanceGate"), true);
  helper.disableScope("acceptanceGate");
  assert.equal(isDiagnosticEnabled("acceptanceGate"), false);
});

test("console helper disables global diagnostics and scoped diagnostics", () => {
  installDiagnosticConsoleHelper();
  const helper = (globalThis as unknown as {
    nexoraDiagnostics: {
      disable: () => unknown;
      enable: () => unknown;
      disableScope: (scope: string) => unknown;
    };
  }).nexoraDiagnostics;

  helper.disable();
  assert.equal(isDiagnosticEnabled(), false);
  assert.equal(isDiagnosticEnabled("sceneRenderSource"), false);

  helper.enable();
  helper.disableScope("sceneRenderSource");
  assert.equal(isDiagnosticEnabled(), true);
  assert.equal(isDiagnosticEnabled("sceneRenderSource"), false);
  assert.equal(getDiagnosticStatus().scopes.sceneRenderSource, false);
});
