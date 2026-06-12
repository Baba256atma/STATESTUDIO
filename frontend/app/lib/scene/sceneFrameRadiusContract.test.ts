import test from "node:test";
import assert from "node:assert/strict";

import {
  resetSceneFrameRadiusContractForTests,
  resolveSceneFrameBorderRadius,
  SCENE_FRAME_RADIUS_PX,
  SCENE_FRAME_RADIUS_SCOPE,
  traceSceneFrameRadius,
} from "./sceneFrameRadiusContract.ts";

test.beforeEach(() => {
  resetSceneFrameRadiusContractForTests();
});

test("scene frame radius uses executive 5px token", () => {
  assert.equal(SCENE_FRAME_RADIUS_PX, 5);
  assert.equal(resolveSceneFrameBorderRadius(), 5);
});

test("traceSceneFrameRadius logs scene-only runtime guard once", () => {
  const logs: string[] = [];
  const original = globalThis.console?.log;
  globalThis.console.log = (message?: unknown) => {
    logs.push(String(message ?? ""));
  };
  try {
    traceSceneFrameRadius();
    traceSceneFrameRadius();
    assert.equal(logs.length, 1);
    assert.match(logs[0] ?? "", new RegExp(`radius=${SCENE_FRAME_RADIUS_PX}px scope=${SCENE_FRAME_RADIUS_SCOPE}`));
  } finally {
    globalThis.console.log = original;
  }
});
