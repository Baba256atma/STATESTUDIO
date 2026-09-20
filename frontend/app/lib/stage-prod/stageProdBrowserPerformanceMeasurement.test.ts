import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  STAGE_PROD_BROWSER_PERFORMANCE_BOUNDARY,
  stageProdBrowserPerformanceMeasurementIdentity,
  summarizeStageProdFrameTimestamps,
} from "./stageProdBrowserPerformanceMeasurement.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

test("A — measurement authority is read-only and query-gated", () => {
  assert.equal(
    stageProdBrowserPerformanceMeasurementIdentity,
    "NPA-T STAGE-PROD:8A/BrowserPerformanceMeasurement",
  );
  assert.equal(STAGE_PROD_BROWSER_PERFORMANCE_BOUNDARY.readOnly, true);
  assert.equal(STAGE_PROD_BROWSER_PERFORMANCE_BOUNDARY.queryGated, true);
  assert.equal(
    STAGE_PROD_BROWSER_PERFORMANCE_BOUNDARY.writesCanonicalManagementState,
    false,
  );
  assert.equal(
    STAGE_PROD_BROWSER_PERFORMANCE_BOUNDARY.createsTelemetryBackend,
    false,
  );
  assert.equal(
    STAGE_PROD_BROWSER_PERFORMANCE_BOUNDARY.createsSecondAnimationEngine,
    false,
  );
});

test("B — a 60 Hz sample reports measured cadence without inventing frames", () => {
  const timestamps = Array.from({ length: 121 }, (_, index) => index * (1000 / 60));
  const summary = summarizeStageProdFrameTimestamps(timestamps);
  assert.equal(summary.frameCount, 121);
  assert.equal(summary.observationMs, 2000);
  assert.equal(summary.averageFrameIntervalMs, 16.667);
  assert.equal(summary.fps, 60);
  assert.equal(summary.framesOver33_4Ms, 0);
  assert.equal(summary.framesOver50Ms, 0);
});

test("C — long frames remain visible in the baseline", () => {
  const summary = summarizeStageProdFrameTimestamps([0, 16, 32, 90, 106]);
  assert.equal(summary.frameCount, 5);
  assert.equal(summary.maxFrameIntervalMs, 58);
  assert.equal(summary.framesOver33_4Ms, 1);
  assert.equal(summary.framesOver50Ms, 1);
});

test("D — insufficient samples do not claim FPS", () => {
  const summary = summarizeStageProdFrameTimestamps([10]);
  assert.equal(summary.frameCount, 1);
  assert.equal(summary.fps, null);
  assert.equal(summary.averageFrameIntervalMs, null);
});

test("E — production probe is explicitly gated and uses the existing Stage host", () => {
  const probe = readFileSync(
    join(
      HERE,
      "../../executive/nex-mvp/stage/NexoraStagePerformanceProbe.tsx",
    ),
    "utf8",
  );
  const stage = readFileSync(
    join(HERE, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(probe, /params\.get\("stagePerfProbe"\) !== "1"/);
  assert.match(probe, /requestAnimationFrame\(tick\)/);
  assert.match(probe, /STABILITY_QUIET_MS = 300/);
  assert.match(probe, /"stabilizing-idle"/);
  assert.match(probe, /"stabilizing-post-motion"/);
  assert.match(probe, /now - lastMotionMutationAt >= STABILITY_QUIET_MS/);
  assert.match(probe, /data-testid="nexora-3d-executive-stage"/);
  assert.match(probe, /writesCanonicalManagementState: false/);
  assert.doesNotMatch(probe, /fetch\(|localStorage|sessionStorage/);
  assert.match(stage, /<NexoraStagePerformanceProbe \/>/);
});
