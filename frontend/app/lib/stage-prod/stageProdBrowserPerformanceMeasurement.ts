/** NPA-T STAGE-PROD:8A — bounded browser-performance measurement contracts. */

export const stageProdBrowserPerformanceMeasurementIdentity =
  "NPA-T STAGE-PROD:8A/BrowserPerformanceMeasurement" as const;

export const STAGE_PROD_BROWSER_PERFORMANCE_BOUNDARY = Object.freeze({
  readOnly: true as const,
  queryGated: true as const,
  createsSecondAnimationEngine: false as const,
  createsTelemetryBackend: false as const,
  writesCanonicalManagementState: false as const,
});

export type StageProdFrameSummary = Readonly<{
  observationMs: number;
  frameCount: number;
  averageFrameIntervalMs: number | null;
  fps: number | null;
  p95FrameIntervalMs: number | null;
  maxFrameIntervalMs: number | null;
  framesOver33_4Ms: number;
  framesOver50Ms: number;
}>;

function rounded(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function summarizeStageProdFrameTimestamps(
  timestamps: readonly number[],
): StageProdFrameSummary {
  if (timestamps.length < 2) {
    return Object.freeze({
      observationMs: 0,
      frameCount: timestamps.length,
      averageFrameIntervalMs: null,
      fps: null,
      p95FrameIntervalMs: null,
      maxFrameIntervalMs: null,
      framesOver33_4Ms: 0,
      framesOver50Ms: 0,
    });
  }
  const intervals = timestamps.slice(1).map((value, index) => {
    return value - (timestamps[index] ?? value);
  });
  const observationMs =
    (timestamps[timestamps.length - 1] ?? 0) - (timestamps[0] ?? 0);
  const sorted = [...intervals].sort((left, right) => left - right);
  const total = intervals.reduce((sum, value) => sum + value, 0);
  return Object.freeze({
    observationMs: rounded(observationMs),
    frameCount: timestamps.length,
    averageFrameIntervalMs: rounded(total / intervals.length),
    fps: observationMs > 0
      ? rounded((intervals.length * 1000) / observationMs)
      : null,
    p95FrameIntervalMs: rounded(
      sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] ?? 0,
    ),
    maxFrameIntervalMs: rounded(Math.max(...intervals)),
    framesOver33_4Ms: intervals.filter((value) => value > 33.4).length,
    framesOver50Ms: intervals.filter((value) => value > 50).length,
  });
}
