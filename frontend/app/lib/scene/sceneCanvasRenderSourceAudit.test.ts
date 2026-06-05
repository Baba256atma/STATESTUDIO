import test from "node:test";
import assert from "node:assert/strict";

import { getSceneCanvasPropChanges, shouldSceneCanvasPropsRender } from "./sceneCanvasRenderSourceAudit.ts";
import type { SceneCanvasProps } from "../../components/SceneCanvas.tsx";

function baseProps(): SceneCanvasProps {
  const noop = () => {};
  return {
    prefs: { motionIntensity: "normal" },
    resolvedUiTheme: "night",
    motionCalm: false,
    camPos: [0, 0, 10],
    starCount: 100,
    isDraggingHUD: false,
    focusPinned: false,
    focusMode: "all",
    focusedId: null,
    effectiveActiveLoopId: null,
    cameraLockedByUser: false,
    isOrbiting: false,
    sceneJson: { scene: { objects: [{ id: "a" }] } },
    objectSelection: null,
    getUxForObject: () => null,
    objectUxById: {},
    selectedObjectId: null,
    loops: [],
    showLoops: true,
    showLoopLabels: false,
    selectedSetterRef: { current: noop },
    selectedIdRef: { current: null },
    overridesRef: { current: {} },
    setOverrideRef: { current: noop },
    clearAllOverridesRef: { current: noop },
    pruneOverridesRef: { current: noop },
    onPointerMissed: noop,
    onOrbitStart: noop,
    onOrbitEnd: noop,
    onSelectedChange: noop,
  };
}

test("SceneCanvas prop audit reports exact changed selection prop details", () => {
  const prev = baseProps();
  const next = {
    ...prev,
    selectedObjectId: "a",
  };

  const changes = getSceneCanvasPropChanges(prev, next);
  assert.deepEqual(changes.map((change) => change.propName), ["selectedObjectId"]);
  assert.equal(changes[0]?.changeType, "primitive-change");
  assert.equal(changes[0]?.shouldCauseSceneRender, true);
  assert.equal(shouldSceneCanvasPropsRender(prev, next), true);
});

test("SceneCanvas prop audit ignores diagnostic-only object identity churn", () => {
  const prev = baseProps();
  const next = {
    ...prev,
    quickActionsDock: {
      model: { actions: [] },
      themeMode: "night" as const,
      onAction: () => {},
    },
  };

  const changes = getSceneCanvasPropChanges(prev, next);
  assert.equal(changes.length, 1);
  assert.equal(changes[0]?.propName, "quickActionsDock");
  assert.equal(changes[0]?.shouldCauseSceneRender, false);
  assert.equal(shouldSceneCanvasPropsRender(prev, next), false);
});

test("SceneCanvas comparator ignores semantic-equal propagation payload references", () => {
  const prev = {
    ...baseProps(),
    propagationPayload: { paths: [{ id: "p1", score: 0.8 }] },
  };
  const next = {
    ...prev,
    propagationPayload: { paths: [{ id: "p1", score: 0.8 }] },
  };

  const changes = getSceneCanvasPropChanges(prev, next);
  assert.equal(changes.length, 0);
  assert.equal(shouldSceneCanvasPropsRender(prev, next), false);
});

test("SceneCanvas comparator ignores volatile propagation payload metadata", () => {
  const prev = {
    ...baseProps(),
    propagationPayload: {
      canonical_recommendation: { created_at: 100, primary: { title: "A" } },
      decision_simulation: {
        impacted_nodes: ["a"],
        propagation: [{ source: "a", target: "b", weight: 0.5 }],
      },
    },
  };
  const next = {
    ...prev,
    propagationPayload: {
      canonical_recommendation: { created_at: 200, primary: { title: "B" } },
      decision_simulation: {
        impacted_nodes: ["a"],
        propagation: [{ source: "a", target: "b", weight: 0.5 }],
      },
    },
  };

  const changes = getSceneCanvasPropChanges(prev, next);
  assert.equal(changes.length, 0);
  assert.equal(shouldSceneCanvasPropsRender(prev, next), false);
});

test("SceneCanvas comparator does not render for propagation-only semantic changes", () => {
  const prev = {
    ...baseProps(),
    propagationPayload: {
      decision_simulation: {
        impacted_nodes: ["a"],
        propagation: [{ source: "a", target: "b", weight: 0.5 }],
      },
    },
  };
  const next = {
    ...prev,
    propagationPayload: {
      decision_simulation: {
        impacted_nodes: ["a", "b"],
        propagation: [{ source: "a", target: "b", weight: 0.9 }],
      },
    },
  };

  const changes = getSceneCanvasPropChanges(prev, next);
  assert.equal(changes.length, 1);
  assert.equal(changes[0]?.propName, "propagationPayload");
  assert.equal(changes[0]?.shouldCauseSceneRender, false);
  assert.equal(shouldSceneCanvasPropsRender(prev, next), false);
});

test("SceneCanvas comparator ignores semantic-equal HUD payload references", () => {
  const prev = {
    ...baseProps(),
    timelineHud: { events: [{ id: "e1", title: "Event" }], focusedEventId: "e1" },
  } as SceneCanvasProps;
  const next = {
    ...prev,
    timelineHud: { events: [{ id: "e1", title: "Event" }], focusedEventId: "e1" },
  } as SceneCanvasProps;

  const changes = getSceneCanvasPropChanges(prev, next);
  assert.equal(changes.length, 0);
  assert.equal(shouldSceneCanvasPropsRender(prev, next), false);
});
