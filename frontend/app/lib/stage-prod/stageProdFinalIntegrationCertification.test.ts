/** NPA-T STAGE-PROD:FINAL — bounded cross-phase certification evidence. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { STAGE_PROD_LIVE_FOUNDATION_BOUNDARY } from "./stageProdLiveFoundationBoundary.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const ARTIFACTS = join(FRONTEND, "artifacts/stage-prod");

function source(path: string): string {
  return readFileSync(join(FRONTEND, path), "utf8");
}

function artifact<T>(path: string): T {
  return JSON.parse(readFileSync(join(ARTIFACTS, path), "utf8")) as T;
}

test("A/O — one production host preserves the single-authority read-only boundary", () => {
  const shell = source("app/executive/nex-mvp/NexoraExecutiveShell.tsx");
  const mount = source("app/executive/nex-mvp/NexoraStageMount.tsx");
  assert.equal((shell.match(/<NexoraStageMount/g) ?? []).length, 1);
  assert.equal((mount.match(/<Nexora3DExecutiveStage/g) ?? []).length, 1);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.parallelStageStore, false);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.parallelDirector, false);
  assert.equal(STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.parallelTheatre, false);
  assert.equal(
    STAGE_PROD_LIVE_FOUNDATION_BOUNDARY.writesCanonicalManagementState,
    false,
  );
});

test("B–D — canonical rendering, composition, and contextual visuals retain certified evidence", () => {
  for (const phase of ["1", "2", "3", "4"] as const) {
    const certification = readFileSync(
      join(ARTIFACTS, `STAGE-PROD-${phase}/CERTIFICATION.md`),
      "utf8",
    );
    assert.match(certification, /CERTIFIED/);
  }
  const objectTest = source(
    "app/lib/stage-prod/stageProdLiveObjectRendering.test.tsx",
  );
  assert.match(objectTest, /problem[\s\S]*scenario[\s\S]*decision[\s\S]*execution/);
  const visualTest = source(
    "app/lib/stage-prod/stageProdVisualSpecification.test.tsx",
  );
  assert.match(visualTest, /Trend/);
  assert.match(visualTest, /COMPARISON/);
  assert.match(visualTest, /STATUS_CARD/);
});

test("E–M — interaction, motion, comparison, and Advisor evidence preserve exact IDs", () => {
  const interaction = artifact<{
    pass: boolean;
    visibleCanonicalId: string;
    disclosed: { selected: string; focused: string };
  }>("STAGE-PROD-5/live-executive-interaction.json");
  const playback = artifact<{
    pass: boolean;
    standard: {
      intermediate: unknown;
      sceneA: { ids: string[] };
      sceneB: { ids: string[] };
    };
  }>("STAGE-PROD-6C/live-animation-playback.json");
  const synchronization = artifact<{
    conversationToStage: { canonicalId: string };
    stageToConversation: { canonicalId: string };
    namedSwitch: { canonicalId: string };
    comparison: { canonicalObjectIds: string[] };
    writesCanonicalManagementState: boolean;
    browserErrors: unknown[];
  }>("STAGE-PROD-7/live-advisor-stage-synchronization.json");

  assert.equal(interaction.pass, true);
  assert.equal(interaction.visibleCanonicalId, "ctx-problem-capacity");
  assert.equal(interaction.disclosed.selected, "ctx-problem-capacity");
  assert.equal(interaction.disclosed.focused, "ctx-problem-capacity");
  assert.equal(playback.pass, true);
  assert.ok(playback.standard.intermediate);
  assert.ok(playback.standard.sceneA.ids.includes("ctx-problem-capacity"));
  assert.deepEqual(playback.standard.sceneB.ids, [
    "ctx-scenario-demand",
    "ctx-scenario-pricing",
  ]);
  assert.equal(
    synchronization.conversationToStage.canonicalId,
    "ctx-problem-capacity",
  );
  assert.equal(
    synchronization.stageToConversation.canonicalId,
    "ctx-problem-capacity",
  );
  assert.equal(synchronization.namedSwitch.canonicalId, "ctx-problem-margin");
  assert.deepEqual(synchronization.comparison.canonicalObjectIds, [
    "ctx-scenario-pricing",
    "ctx-scenario-demand",
  ]);
  assert.equal(synchronization.writesCanonicalManagementState, false);
  assert.deepEqual(synchronization.browserErrors, []);
});

test("N — final real-browser performance evidence remains production-certified", () => {
  const performance = artifact<{
    result: string;
    performanceDebt: string;
    stableIdle: { fps: number; motionAttributeWritesPerSecond: number };
    activeAnimation: {
      fps: number;
      genuineIntermediateObservations: number;
      framesOver33_4Ms: number;
    };
    stablePostAnimation: {
      fps: number;
      motionAttributeWritesPerSecond: number;
    };
    interaction: { latencyMs: number };
    browserRuntimeErrors: unknown[];
  }>("STAGE-PROD-8C/production-performance-certification.json");

  assert.equal(performance.result, "CERTIFIED");
  assert.equal(performance.performanceDebt, "CLOSED");
  assert.ok(performance.stableIdle.fps >= 110);
  assert.equal(performance.stableIdle.motionAttributeWritesPerSecond, 0);
  assert.ok(performance.activeAnimation.fps >= 110);
  assert.ok(performance.activeAnimation.genuineIntermediateObservations > 0);
  assert.equal(performance.activeAnimation.framesOver33_4Ms, 0);
  assert.ok(performance.stablePostAnimation.fps >= 110);
  assert.equal(performance.stablePostAnimation.motionAttributeWritesPerSecond, 0);
  assert.ok(performance.interaction.latencyMs < 50);
  assert.deepEqual(performance.browserRuntimeErrors, []);
});

test("certification probe remains query-gated and creates no performance authority", () => {
  const probe = source(
    "app/executive/nex-mvp/stage/NexoraStagePerformanceProbe.tsx",
  );
  assert.match(probe, /params\.get\("stagePerfProbe"\) !== "1"/);
  assert.match(probe, /writesCanonicalManagementState: false/);
  assert.doesNotMatch(probe, /fetch\(|localStorage|sessionStorage/);
});
