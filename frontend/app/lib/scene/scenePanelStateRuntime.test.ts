import test from "node:test";
import assert from "node:assert/strict";

import {
  persistSceneInfoCollapsePreference,
} from "./sceneInfoPreferenceRuntime.ts";
import {
  resetPanelGovernanceRuntimeForTests,
  setPanelCollapseState,
} from "../workspace/panelGovernanceRuntime.ts";
import {
  resetScenePanelStateDiagnosticsForTests,
} from "./scenePanelStateRuntime.ts";

test.beforeEach(() => {
  resetPanelGovernanceRuntimeForTests();
  resetScenePanelStateDiagnosticsForTests();
});

test("persistSceneInfoCollapsePreference skips duplicate writes", () => {
  setPanelCollapseState("sceneInfoHud", "expanded");
  persistSceneInfoCollapsePreference(false, "effect");
  assert.doesNotThrow(() => {
    persistSceneInfoCollapsePreference(false, "effect");
  });
});
