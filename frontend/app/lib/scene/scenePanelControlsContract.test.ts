import test from "node:test";
import assert from "node:assert/strict";

import {
  SCENE_PANEL_CONTROL_ACTIONS,
  resetScenePanelControlsContractForTests,
} from "./scenePanelControlsContract.ts";

test.beforeEach(() => {
  resetScenePanelControlsContractForTests();
});

test("scene panel controls expose global fit and focus compact labels", () => {
  assert.deepEqual(
    SCENE_PANEL_CONTROL_ACTIONS.map((entry) => entry.id),
    ["global_view", "fit_scene", "focus"]
  );
  assert.deepEqual(
    SCENE_PANEL_CONTROL_ACTIONS.map((entry) => entry.label),
    ["GLOBAL", "FIT", "FOCUS"]
  );
});
