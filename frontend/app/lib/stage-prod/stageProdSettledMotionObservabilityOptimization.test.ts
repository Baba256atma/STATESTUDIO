/** NPA-T STAGE-PROD:8B — settled motion observability optimization. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  advanceExecutiveStageMotion,
  getActiveExecutiveStageMotionTransition,
  registerExecutiveStageMotionLivePositionReader,
  resetExecutiveStageMotionForTests,
  sampleExecutiveStageMotionObject,
  setExecutiveStageMotionReducedMotion,
  syncExecutiveStageMotionTargets,
  writeExecutiveStageMotionObservabilityToHost,
  type ExecutiveStageMotionTargetEntry,
  type ExecutiveStageMotionVec3,
} from "@/app/lib/spatial-presentation/executiveStageMotion.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const OBJECT_ID = "ctx-scenario-pricing";

type LiveSample = Readonly<{
  position: ExecutiveStageMotionVec3;
  opacity: number;
  scale: number;
  visible: boolean;
}>;

function createHost() {
  const attributes = new Map<string, string>();
  const writes: Array<Readonly<{ name: string; value: string }>> = [];
  const element = {
    getAttribute: (name: string) => attributes.get(name) ?? null,
    setAttribute: (name: string, value: string) => {
      attributes.set(name, value);
      writes.push(Object.freeze({ name, value }));
    },
  } as unknown as Element;
  return { attributes, writes, element };
}

function targets(position: ExecutiveStageMotionVec3) {
  return new Map<string, ExecutiveStageMotionTargetEntry>([
    [
      OBJECT_ID,
      Object.freeze({ position, opacity: 1, scale: 1, visible: true }),
    ],
  ]);
}

function liveSample(nowMs: number): LiveSample {
  const sample = sampleExecutiveStageMotionObject(OBJECT_ID, nowMs, {
    position: [0, 0, 0],
    opacity: 1,
    scale: 1,
    visible: true,
  });
  return Object.freeze({
    position: sample.position,
    opacity: sample.opacity,
    scale: sample.scale,
    visible: sample.visible,
  });
}

function publish(host: Element, sample: LiveSample): void {
  writeExecutiveStageMotionObservabilityToHost(
    host,
    Object.freeze({ [OBJECT_ID]: sample }),
  );
}

test("A — identical settled observability skips every redundant DOM write", () => {
  resetExecutiveStageMotionForTests();
  const host = createHost();
  writeExecutiveStageMotionObservabilityToHost(host.element, {});
  assert.equal(host.writes.length, 13);

  host.writes.length = 0;
  writeExecutiveStageMotionObservabilityToHost(host.element, {});
  assert.equal(host.writes.length, 0);
  assert.equal(host.attributes.get("data-stage-motion-settled"), "true");
});

test("B/C — genuine active progress and live interpolation remain observable", () => {
  resetExecutiveStageMotionForTests();
  registerExecutiveStageMotionLivePositionReader(() => [0, 0, 0]);
  syncExecutiveStageMotionTargets({
    targets: targets([2, 0, 0]),
    anchorObjectId: OBJECT_ID,
    nowMs: 0,
  });
  const host = createHost();

  advanceExecutiveStageMotion(100);
  publish(host.element, liveSample(100));
  const firstBundle = host.attributes.get("data-stage-motion-samples-bundle");
  host.writes.length = 0;

  advanceExecutiveStageMotion(200);
  publish(host.element, liveSample(200));
  const secondBundle = host.attributes.get("data-stage-motion-samples-bundle");
  assert.notEqual(secondBundle, firstBundle);
  assert.ok(host.writes.some(({ name }) => name === "data-stage-motion-progress"));
  assert.ok(
    host.writes.some(({ name }) => name === "data-stage-motion-samples-bundle"),
  );
});

test("D/E/G/I — final settlement publishes exactly, then a new canonical motion resumes safely", () => {
  resetExecutiveStageMotionForTests();
  registerExecutiveStageMotionLivePositionReader(() => [0, 0, 0]);
  syncExecutiveStageMotionTargets({
    targets: targets([2, 0, 0]),
    anchorObjectId: OBJECT_ID,
    nowMs: 0,
  });
  const host = createHost();

  advanceExecutiveStageMotion(450);
  publish(host.element, liveSample(450));
  assert.equal(host.attributes.get("data-stage-motion-progress"), "1.000");
  assert.equal(host.attributes.get("data-stage-motion-settled"), "true");
  const settledBundle = JSON.parse(
    host.attributes.get("data-stage-motion-samples-bundle")!,
  );
  assert.deepEqual(settledBundle.live[OBJECT_ID].position, [2, 0, 0]);
  assert.deepEqual(Object.keys(settledBundle.target), [OBJECT_ID]);

  host.writes.length = 0;
  syncExecutiveStageMotionTargets({
    targets: targets([3, 0, 0]),
    anchorObjectId: OBJECT_ID,
    nowMs: 500,
  });
  advanceExecutiveStageMotion(600);
  publish(host.element, liveSample(600));
  assert.equal(host.attributes.get("data-stage-motion-settled"), "false");
  assert.ok(host.writes.length > 0);
  assert.ok(
    host.writes.every(({ name }) => name.startsWith("data-stage-motion-")),
  );
  assert.equal(getActiveExecutiveStageMotionTransition()?.targets.has(OBJECT_ID), true);
});

test("F — reduced motion still publishes the exact final state", () => {
  resetExecutiveStageMotionForTests();
  setExecutiveStageMotionReducedMotion(true);
  registerExecutiveStageMotionLivePositionReader(() => [0, 0, 0]);
  syncExecutiveStageMotionTargets({
    targets: targets([2, 0, 0]),
    anchorObjectId: OBJECT_ID,
    nowMs: 0,
  });
  const host = createHost();

  advanceExecutiveStageMotion(80);
  publish(host.element, liveSample(80));
  assert.equal(host.attributes.get("data-stage-motion-duration-ms"), "80");
  assert.equal(host.attributes.get("data-stage-motion-settled"), "true");
  const bundle = JSON.parse(
    host.attributes.get("data-stage-motion-samples-bundle")!,
  );
  assert.deepEqual(bundle.live[OBJECT_ID].position, [2, 0, 0]);
});

test("H — performance probe remains query-gated, read-only measurement infrastructure", () => {
  const probe = readFileSync(
    join(
      HERE,
      "../../executive/nex-mvp/stage/NexoraStagePerformanceProbe.tsx",
    ),
    "utf8",
  );
  assert.match(probe, /params\.get\("stagePerfProbe"\) !== "1"/);
  assert.match(probe, /writesCanonicalManagementState: false/);
  assert.doesNotMatch(probe, /fetch\(|localStorage|sessionStorage/);
});
