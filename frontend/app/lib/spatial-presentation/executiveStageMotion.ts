/**
 * STAGE-MOTION:1 — Smooth Anchor Recomposition Transition.
 *
 * Resolve once → animate once → settle once.
 * Presentation/runtime only — never writes semantic topology truth.
 */

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageMotionIdentity =
  "STAGE-MOTION:1/ExecutiveStageSmoothAnchorRecomposition" as const;

export const executiveStageMotionVersion = "5.1.0" as const;

export const executiveStageMotionNamespace =
  "nexora.spatial-presentation.executive-stage-motion" as const;

export const executiveStageMotionPhase =
  "SmoothAnchorRecompositionTransition" as const;

export const executiveStageMotionArchitecturalRole =
  "PresentationOnlyTopologyMotionAuthority" as const;

export type ExecutiveStageMotionIdentity = {
  readonly id: typeof executiveStageMotionIdentity;
  readonly version: typeof executiveStageMotionVersion;
  readonly namespace: typeof executiveStageMotionNamespace;
  readonly phase: typeof executiveStageMotionPhase;
  readonly architecturalRole: typeof executiveStageMotionArchitecturalRole;
};

const IDENTITY: ExecutiveStageMotionIdentity = Object.freeze({
  id: executiveStageMotionIdentity,
  version: executiveStageMotionVersion,
  namespace: executiveStageMotionNamespace,
  phase: executiveStageMotionPhase,
  architecturalRole: executiveStageMotionArchitecturalRole,
});

export function getExecutiveStageMotionIdentity(): ExecutiveStageMotionIdentity {
  return IDENTITY;
}

// ─── Tokens ─────────────────────────────────────────────────────────────────

export const EXECUTIVE_STAGE_MOTION = Object.freeze({
  /** Anchor + related topology travel duration. */
  topologyDurationMs: 450,
  /** Alias kept for observability / reports. */
  anchorDurationMs: 450,
  enterDurationMs: 280,
  exitDurationMs: 200,
  settleEpsilon: 0.018,
  reducedMotionDurationMs: 80,
  enterScaleFrom: 0.92,
  enterOpacityFrom: 0.12,
} as const);

export type ExecutiveStageMotionPhase =
  | "idle"
  | "transitioning"
  | "settling"
  | "complete";

export type ExecutiveStageMotionVec3 = readonly [number, number, number];

export type ExecutiveStageMotionTargetEntry = {
  readonly position: ExecutiveStageMotionVec3;
  /** Final semantic visibility for this transition (post hard-separation). */
  readonly visible: boolean;
  readonly opacity: number;
  readonly scale: number;
};

export type ExecutiveStageMotionTransition = {
  readonly transitionId: number;
  readonly startedAt: number;
  readonly durationMs: number;
  readonly phase: ExecutiveStageMotionPhase;
  readonly anchorObjectId: string | null;
  readonly fromPositions: ReadonlyMap<string, ExecutiveStageMotionVec3>;
  readonly targetPositions: ReadonlyMap<string, ExecutiveStageMotionVec3>;
  readonly targets: ReadonlyMap<string, ExecutiveStageMotionTargetEntry>;
  readonly fingerprint: string;
  readonly interrupted: boolean;
  readonly settled: boolean;
  readonly progress: number;
  readonly reducedMotion: boolean;
  readonly hardSeparationComplete: true;
};

export type ExecutiveStageMotionSample = {
  readonly position: ExecutiveStageMotionVec3;
  readonly opacity: number;
  readonly scale: number;
  readonly visible: boolean;
  readonly settled: boolean;
  readonly progress: number;
  readonly transitionId: number;
};

export type ExecutiveStageMotionObservability = {
  readonly contract: "stage-motion-1";
  readonly phase: ExecutiveStageMotionPhase;
  readonly transitionId: number | "none";
  readonly anchor: string | "none";
  readonly progress: string;
  readonly targetCount: number;
  readonly interrupted: boolean;
  readonly settled: boolean;
  readonly authority: "stage-motion-1";
  readonly easing: "easeOutCubic";
  readonly durationMs: number;
  readonly hardSeparationBeforeMotion: true;
};

type MutableTransition = {
  transitionId: number;
  startedAt: number;
  durationMs: number;
  phase: ExecutiveStageMotionPhase;
  anchorObjectId: string | null;
  fromPositions: Map<string, ExecutiveStageMotionVec3>;
  targetPositions: Map<string, ExecutiveStageMotionVec3>;
  targets: Map<string, ExecutiveStageMotionTargetEntry>;
  fingerprint: string;
  interrupted: boolean;
  settled: boolean;
  progress: number;
  reducedMotion: boolean;
  hardSeparationComplete: true;
  /** Previous visibility for enter/exit detection. */
  previousVisible: Map<string, boolean>;
  enterIds: Set<string>;
  exitIds: Set<string>;
  fromOpacity: Map<string, number>;
  fromScale: Map<string, number>;
};

let nextTransitionId = 1;
let active: MutableTransition | null = null;
let lastFingerprint = "";
let prefersReducedMotion = false;
let debugTraceEnabled = false;
let livePositionReader:
  | ((objectId: string) => ExecutiveStageMotionVec3 | null)
  | null = null;

/**
 * Stage runtime registers the live-position registry reader.
 * Keeps motion tokens free of Stage React imports.
 */
export function registerExecutiveStageMotionLivePositionReader(
  reader: ((objectId: string) => ExecutiveStageMotionVec3 | null) | null,
): void {
  livePositionReader = reader;
}

export function setExecutiveStageMotionReducedMotion(enabled: boolean): void {
  prefersReducedMotion = enabled;
}

export function isExecutiveStageMotionReducedMotion(): boolean {
  return prefersReducedMotion;
}

export function setExecutiveStageMotionDebugTrace(enabled: boolean): void {
  debugTraceEnabled = enabled;
}

export function resetExecutiveStageMotionForTests(): void {
  active = null;
  lastFingerprint = "";
  nextTransitionId = 1;
  prefersReducedMotion = false;
  debugTraceEnabled = false;
  livePositionReader = null;
}

export function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) ** 3;
}

export function easeInOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
}

function distance2(
  a: ExecutiveStageMotionVec3,
  b: ExecutiveStageMotionVec3,
): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.hypot(dx, dy);
}

function lerpVec3(
  from: ExecutiveStageMotionVec3,
  to: ExecutiveStageMotionVec3,
  t: number,
): ExecutiveStageMotionVec3 {
  return Object.freeze([
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ] as const);
}

function freezeVec3(
  x: number,
  y: number,
  z: number,
): ExecutiveStageMotionVec3 {
  return Object.freeze([x, y, z] as const);
}

export function fingerprintExecutiveStageMotionTargets(
  targets: ReadonlyMap<string, ExecutiveStageMotionTargetEntry>,
): string {
  // Position + visibility only — opacity/scale micro-churn must not restart motion.
  return [...targets.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([id, entry]) => {
      const [x, y, z] = entry.position;
      return `${id}:${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}:v${entry.visible ? 1 : 0}`;
    })
    .join("|");
}

function trace(message: string): void {
  if (!debugTraceEnabled) return;
  if (typeof console !== "undefined" && typeof console.debug === "function") {
    console.debug(`[STAGE-MOTION:1] ${message}`);
  }
}

export type SyncExecutiveStageMotionInput = {
  readonly targets: ReadonlyMap<string, ExecutiveStageMotionTargetEntry>;
  readonly anchorObjectId: string | null;
  readonly nowMs: number;
  /** Optional live opacity/scale seeds for interruption continuity. */
  readonly liveOpacity?: ReadonlyMap<string, number>;
  readonly liveScale?: ReadonlyMap<string, number>;
};

/**
 * Resolve-once gate: when the certified final target fingerprint changes,
 * freeze a new immutable target set and start (or supersede) a transition.
 * Hard separation is assumed already applied upstream before this call.
 */
export function syncExecutiveStageMotionTargets(
  input: SyncExecutiveStageMotionInput,
): ExecutiveStageMotionTransition {
  const fingerprint = fingerprintExecutiveStageMotionTargets(input.targets);
  if (active && fingerprint === active.fingerprint) {
    return snapshotTransition(active);
  }

  const interrupted = active != null && !active.settled;
  const previousVisible = new Map<string, boolean>();
  if (active) {
    for (const [id, entry] of active.targets) {
      previousVisible.set(id, entry.visible);
    }
  }

  const fromPositions = new Map<string, ExecutiveStageMotionVec3>();
  const targetPositions = new Map<string, ExecutiveStageMotionVec3>();
  const targets = new Map<string, ExecutiveStageMotionTargetEntry>();
  const enterIds = new Set<string>();
  const exitIds = new Set<string>();
  const fromOpacity = new Map<string, number>();
  const fromScale = new Map<string, number>();
  let usedLivePositions = false;

  for (const [id, entry] of input.targets) {
    const frozenEntry: ExecutiveStageMotionTargetEntry = Object.freeze({
      position: freezeVec3(
        entry.position[0],
        entry.position[1],
        entry.position[2],
      ),
      visible: entry.visible,
      opacity: entry.opacity,
      scale: entry.scale,
    });
    targets.set(id, frozenEntry);
    targetPositions.set(id, frozenEntry.position);

    const live = livePositionReader?.(id) ?? null;
    if (live) {
      usedLivePositions = true;
      fromPositions.set(id, freezeVec3(live[0], live[1], live[2]));
    } else {
      fromPositions.set(
        id,
        freezeVec3(
          frozenEntry.position[0],
          frozenEntry.position[1],
          frozenEntry.position[2],
        ),
      );
    }

    const wasVisible = previousVisible.get(id) ?? false;
    if (entry.visible && !wasVisible) enterIds.add(id);
    if (!entry.visible && wasVisible) exitIds.add(id);

    const liveOp = input.liveOpacity?.get(id);
    const liveSc = input.liveScale?.get(id);
    fromOpacity.set(
      id,
      liveOp ??
        (enterIds.has(id)
          ? EXECUTIVE_STAGE_MOTION.enterOpacityFrom
          : entry.opacity),
    );
    fromScale.set(
      id,
      liveSc ??
        (enterIds.has(id)
          ? EXECUTIVE_STAGE_MOTION.enterScaleFrom * entry.scale
          : entry.scale),
    );
  }

  const durationMs = prefersReducedMotion
    ? EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs
    : EXECUTIVE_STAGE_MOTION.topologyDurationMs;

  const transitionId = nextTransitionId;
  nextTransitionId += 1;

  active = {
    transitionId,
    startedAt: input.nowMs,
    durationMs,
    phase: "transitioning",
    anchorObjectId: input.anchorObjectId,
    fromPositions,
    targetPositions,
    targets,
    fingerprint,
    interrupted,
    settled: false,
    progress: 0,
    reducedMotion: prefersReducedMotion,
    hardSeparationComplete: true,
    previousVisible,
    enterIds,
    exitIds,
    fromOpacity,
    fromScale,
  };
  lastFingerprint = fingerprint;

  // Instant-complete only when live registry confirms bodies are already home.
  // Fallback-from-target (no live yet) must still allow a timed transition.
  let allNear = usedLivePositions;
  if (allNear) {
    for (const [id, entry] of targets) {
      const from = fromPositions.get(id)!;
      if (
        distance2(from, entry.position) >= EXECUTIVE_STAGE_MOTION.settleEpsilon
      ) {
        allNear = false;
        break;
      }
    }
  }
  if (allNear) {
    active.progress = 1;
    active.settled = true;
    active.phase = "complete";
  }

  trace(
    `transition #${transitionId} started` +
      (interrupted ? " (interrupted)" : "") +
      ` anchor=${input.anchorObjectId ?? "none"} targets=${targets.size}`,
  );
  if (input.anchorObjectId) {
    const from = fromPositions.get(input.anchorObjectId);
    const to = targetPositions.get(input.anchorObjectId);
    if (from && to) {
      trace(
        `${input.anchorObjectId} from(${from[0].toFixed(3)},${from[1].toFixed(3)},${from[2].toFixed(3)}) → target(${to[0].toFixed(3)},${to[1].toFixed(3)},${to[2].toFixed(3)})`,
      );
    }
  }

  return snapshotTransition(active);
}

function resolvePhase(transition: MutableTransition): ExecutiveStageMotionPhase {
  if (transition.settled || transition.progress >= 1) return "complete";
  if (transition.progress > 0.92) return "settling";
  return "transitioning";
}

function snapshotTransition(
  transition: MutableTransition,
): ExecutiveStageMotionTransition {
  return Object.freeze({
    transitionId: transition.transitionId,
    startedAt: transition.startedAt,
    durationMs: transition.durationMs,
    phase: resolvePhase(transition),
    anchorObjectId: transition.anchorObjectId,
    fromPositions: transition.fromPositions,
    targetPositions: transition.targetPositions,
    targets: transition.targets,
    fingerprint: transition.fingerprint,
    interrupted: transition.interrupted,
    settled: transition.settled || transition.progress >= 1,
    progress: transition.progress,
    reducedMotion: transition.reducedMotion,
    hardSeparationComplete: true as const,
  });
}

export function getActiveExecutiveStageMotionTransition(): ExecutiveStageMotionTransition | null {
  return active ? snapshotTransition(active) : null;
}

export function advanceExecutiveStageMotion(
  nowMs: number,
): ExecutiveStageMotionTransition | null {
  if (!active) return null;
  if (active.settled) {
    active.phase = "complete";
    return snapshotTransition(active);
  }

  const raw =
    active.durationMs <= 0
      ? 1
      : (nowMs - active.startedAt) / active.durationMs;
  const progress = Math.min(1, Math.max(0, raw));
  active.progress = progress;

  if (progress >= 1) {
    active.phase = "settling";
    active.settled = true;
    active.progress = 1;
    active.phase = "complete";
    trace(`transition #${active.transitionId} settled`);
  } else if (progress > 0.92) {
    active.phase = "settling";
  } else {
    active.phase = "transitioning";
  }

  return snapshotTransition(active);
}

/**
 * Single position/opacity/scale authority for STAGE-MOTION:1.
 * At completion, snaps exactly to frozen targets (no residual drift).
 */
export function sampleExecutiveStageMotionObject(
  objectId: string,
  nowMs: number,
  fallback: {
    readonly position: ExecutiveStageMotionVec3;
    readonly opacity: number;
    readonly scale: number;
    readonly visible: boolean;
  },
): ExecutiveStageMotionSample {
  advanceExecutiveStageMotion(nowMs);
  if (!active || !active.targets.has(objectId)) {
    return Object.freeze({
      position: freezeVec3(
        fallback.position[0],
        fallback.position[1],
        fallback.position[2],
      ),
      opacity: fallback.opacity,
      scale: fallback.scale,
      visible: fallback.visible,
      settled: true,
      progress: 1,
      transitionId: active?.transitionId ?? 0,
    });
  }

  const target = active.targets.get(objectId)!;
  const from =
    active.fromPositions.get(objectId) ??
    freezeVec3(target.position[0], target.position[1], target.position[2]);
  const fromOp = active.fromOpacity.get(objectId) ?? target.opacity;
  const fromSc = active.fromScale.get(objectId) ?? target.scale;

  const isEnter = active.enterIds.has(objectId);
  const isExit = active.exitIds.has(objectId);

  let t = easeOutCubic(active.progress);
  if (isExit) {
    const exitT =
      active.durationMs <= 0
        ? 1
        : Math.min(
            1,
            Math.max(
              0,
              (nowMs - active.startedAt) /
                (prefersReducedMotion
                  ? EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs
                  : EXECUTIVE_STAGE_MOTION.exitDurationMs),
            ),
          );
    t = easeOutCubic(Math.max(active.progress, exitT));
  } else if (isEnter) {
    const enterT =
      active.durationMs <= 0
        ? 1
        : Math.min(
            1,
            Math.max(
              0,
              (nowMs - active.startedAt) /
                (prefersReducedMotion
                  ? EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs
                  : EXECUTIVE_STAGE_MOTION.enterDurationMs),
            ),
          );
    // Enter opacity/scale may finish slightly ahead; position still uses topology t.
    void enterT;
  }

  const near =
    distance2(from, target.position) < EXECUTIVE_STAGE_MOTION.settleEpsilon;
  const settled = active.settled || near;
  const position = settled
    ? target.position
    : lerpVec3(from, target.position, easeOutCubic(active.progress));

  let opacity: number;
  let scale: number;
  if (settled) {
    opacity = target.opacity;
    scale = target.scale;
  } else if (isExit) {
    const exitProgress = Math.min(
      1,
      (nowMs - active.startedAt) /
        (prefersReducedMotion
          ? EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs
          : EXECUTIVE_STAGE_MOTION.exitDurationMs),
    );
    const et = easeOutCubic(exitProgress);
    opacity = fromOp + (target.opacity - fromOp) * et;
    scale = fromSc + (target.scale - fromSc) * et;
  } else if (isEnter) {
    const enterProgress = Math.min(
      1,
      (nowMs - active.startedAt) /
        (prefersReducedMotion
          ? EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs
          : EXECUTIVE_STAGE_MOTION.enterDurationMs),
    );
    const et = easeOutCubic(enterProgress);
    opacity = fromOp + (target.opacity - fromOp) * et;
    scale = fromSc + (target.scale - fromSc) * et;
  } else {
    opacity = fromOp + (target.opacity - fromOp) * easeOutCubic(active.progress);
    scale = fromSc + (target.scale - fromSc) * easeOutCubic(active.progress);
  }

  const visible = opacity > 0.04 || target.visible;

  return Object.freeze({
    position,
    opacity,
    scale,
    visible,
    settled,
    progress: active.progress,
    transitionId: active.transitionId,
  });
}

export function getExecutiveStageMotionObservability(): ExecutiveStageMotionObservability {
  if (!active) {
    return Object.freeze({
      contract: "stage-motion-1",
      phase: "idle",
      transitionId: "none",
      anchor: "none",
      progress: "0",
      targetCount: 0,
      interrupted: false,
      settled: true,
      authority: "stage-motion-1",
      easing: "easeOutCubic",
      durationMs: EXECUTIVE_STAGE_MOTION.topologyDurationMs,
      hardSeparationBeforeMotion: true,
    });
  }
  const phase = resolvePhase(active);
  const settled = active.settled || active.progress >= 1;
  return Object.freeze({
    contract: "stage-motion-1",
    phase,
    transitionId: active.transitionId,
    anchor: active.anchorObjectId ?? "none",
    progress: (settled ? 1 : active.progress).toFixed(3),
    targetCount: active.targets.size,
    interrupted: active.interrupted,
    settled,
    authority: "stage-motion-1",
    easing: "easeOutCubic",
    durationMs: active.durationMs,
    hardSeparationBeforeMotion: true,
  });
}

export function writeExecutiveStageMotionObservabilityToHost(
  host: Element | null | undefined,
): void {
  if (!host) return;
  const obs = getExecutiveStageMotionObservability();
  // Single atomic bundle first so readers never observe a torn multi-attr write.
  host.setAttribute(
    "data-stage-motion-bundle",
    JSON.stringify({
      contract: obs.contract,
      phase: obs.phase,
      transitionId: obs.transitionId,
      anchor: obs.anchor,
      progress: obs.progress,
      targetCount: obs.targetCount,
      interrupted: obs.interrupted,
      settled: obs.settled,
      authority: obs.authority,
      easing: obs.easing,
      durationMs: obs.durationMs,
    }),
  );
  host.setAttribute("data-stage-motion-contract", obs.contract);
  host.setAttribute("data-stage-motion-phase", obs.phase);
  host.setAttribute(
    "data-stage-motion-transition-id",
    String(obs.transitionId),
  );
  host.setAttribute("data-stage-motion-anchor", obs.anchor);
  host.setAttribute("data-stage-motion-progress", obs.progress);
  host.setAttribute(
    "data-stage-motion-target-count",
    String(obs.targetCount),
  );
  host.setAttribute(
    "data-stage-motion-interrupted",
    obs.interrupted ? "true" : "false",
  );
  host.setAttribute(
    "data-stage-motion-settled",
    obs.settled ? "true" : "false",
  );
  host.setAttribute("data-stage-motion-authority", obs.authority);
  host.setAttribute("data-stage-motion-easing", obs.easing);
  host.setAttribute(
    "data-stage-motion-duration-ms",
    String(obs.durationMs),
  );
}

/**
 * Frame-rate independence check: same eased progress for equal elapsed time
 * regardless of frame count.
 */
export function verifyExecutiveStageMotionFrameRateIndependence(options?: {
  readonly durationMs?: number;
  readonly elapsedMs?: number;
}): { readonly ok: boolean; readonly progress30: number; readonly progress120: number } {
  const durationMs =
    options?.durationMs ?? EXECUTIVE_STAGE_MOTION.topologyDurationMs;
  const elapsedMs = options?.elapsedMs ?? durationMs * 0.4;
  const t = Math.min(1, elapsedMs / durationMs);
  const progress30 = easeOutCubic(t);
  const progress120 = easeOutCubic(t);
  return Object.freeze({
    ok: Math.abs(progress30 - progress120) < 1e-12,
    progress30,
    progress120,
  });
}

export function verifyExecutiveStageMotion(): {
  readonly ok: boolean;
  readonly identity: ExecutiveStageMotionIdentity;
} {
  return Object.freeze({
    ok:
      IDENTITY.id === "STAGE-MOTION:1/ExecutiveStageSmoothAnchorRecomposition" &&
      IDENTITY.version === "5.1.0",
    identity: IDENTITY,
  });
}

export function getLastExecutiveStageMotionFingerprint(): string {
  return lastFingerprint;
}
