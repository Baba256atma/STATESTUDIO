/**
 * INT-1.3 — Executive Time Context builder.
 * Sole creator of ExecutiveTimeContext — collect, normalize, freeze.
 */

import {
  buildExecutiveTimeContextDiagnostics,
  recordExecutiveTimeContextDiagnostics,
  recordExecutiveTimeContextEvent,
} from "./executiveTimeContextDiagnostics.ts";
import {
  EXECUTIVE_TIME_CONTEXT_SOURCE,
  EXECUTIVE_TIME_CONTEXT_VERSION,
  type BuildExecutiveTimeContextInput,
  type ExecutiveTimeContext,
  type ExecutiveTimeContextBuildResult,
  type ExecutiveTimeFutureExtension,
  type ExecutiveTimeState,
} from "./executiveTimeContextContract.ts";
import type { IntelligenceTimelinePosition } from "./intelligenceContextContract.ts";
import { registerExecutiveTimeContext } from "./executiveTimeContextRegistry.ts";
import {
  validateExecutiveTimeContext,
  validateExecutiveTimeContextInput,
  validateTimelineCompatibility,
} from "./executiveTimeContextValidator.ts";

let timeContextSequence = 0;

function nowIso(): string {
  return new Date().toISOString();
}

function nextTimeContextId(): string {
  timeContextSequence += 1;
  return `exec_time_ctx_${timeContextSequence}_${Date.now()}`;
}

function normalizeId(value: unknown): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

function normalizeTimeState(value: ExecutiveTimeState | null | undefined): ExecutiveTimeState {
  if (value === "past" || value === "now" || value === "future") return value;
  return "now";
}

function normalizeTimelinePosition(
  input: Partial<IntelligenceTimelinePosition> | null | undefined
): IntelligenceTimelinePosition {
  if (!input) {
    return Object.freeze({ index: null, label: null, reserved: true });
  }
  return Object.freeze({
    index: typeof input.index === "number" ? input.index : null,
    label: normalizeId(input.label),
    reserved: input.reserved ?? input.index == null,
  });
}

function normalizeFutureExtension(
  input: ExecutiveTimeFutureExtension | null | undefined
): ExecutiveTimeFutureExtension {
  if (!input) return Object.freeze({});
  return Object.freeze({ ...input });
}

function freezeTimeContext(context: ExecutiveTimeContext): ExecutiveTimeContext {
  return Object.freeze(context);
}

export function buildExecutiveTimeContext(
  input: BuildExecutiveTimeContextInput = Object.freeze({})
): ExecutiveTimeContextBuildResult {
  const startedAt = Date.now();
  const inputValidation = validateExecutiveTimeContextInput(input);
  if (!inputValidation.valid) {
    recordExecutiveTimeContextEvent({
      type: "TimeContextRejected",
      timeState: input.timeState ?? null,
    });
    return Object.freeze({
      success: false,
      timeContext: null,
      validation: inputValidation,
      reason: "input_invalid",
      message: "Executive time context input failed validation.",
    });
  }

  const timeState = normalizeTimeState(input.timeState);
  const timelinePosition = normalizeTimelinePosition(input.timelinePosition);
  const timelineValidation = validateTimelineCompatibility({ timeState, timelinePosition });
  if (!timelineValidation.valid) {
    recordExecutiveTimeContextEvent({ type: "TimeContextRejected", timeState });
    return Object.freeze({
      success: false,
      timeContext: null,
      validation: timelineValidation,
      reason: "timeline_incompatible",
      message: "Executive time context timeline compatibility failed.",
    });
  }

  const timeContext = freezeTimeContext(
    Object.freeze({
      contractVersion: EXECUTIVE_TIME_CONTEXT_VERSION,
      timeContextId: nextTimeContextId(),
      timeState,
      referenceTimestamp: normalizeId(input.referenceTimestamp) ?? nowIso(),
      requestedTime: normalizeId(input.requestedTime),
      timelinePosition,
      source: EXECUTIVE_TIME_CONTEXT_SOURCE,
      confidence: null,
      version: EXECUTIVE_TIME_CONTEXT_VERSION,
      futureExtension: normalizeFutureExtension(input.futureExtension),
    })
  );

  const validation = validateExecutiveTimeContext(timeContext);
  if (!validation.valid) {
    recordExecutiveTimeContextEvent({
      type: "TimeContextRejected",
      timeContextId: timeContext.timeContextId,
      timeState,
    });
    return Object.freeze({
      success: false,
      timeContext: null,
      validation,
      reason: "context_invalid",
      message: "Executive time context failed post-build validation.",
    });
  }

  registerExecutiveTimeContext(timeContext);
  recordExecutiveTimeContextEvent({
    type: "TimeContextCreated",
    timeContextId: timeContext.timeContextId,
    timeState,
  });
  recordExecutiveTimeContextEvent({
    type: "TimeContextValidated",
    timeContextId: timeContext.timeContextId,
    timeState,
  });

  recordExecutiveTimeContextDiagnostics(
    buildExecutiveTimeContextDiagnostics({
      timeContext,
      validation,
      executionTimeMs: Date.now() - startedAt,
    })
  );

  return Object.freeze({
    success: true,
    timeContext,
    validation,
    reason: "created",
    message: "Executive time context created.",
  });
}

export function updateExecutiveTimeContext(
  current: ExecutiveTimeContext,
  patch: BuildExecutiveTimeContextInput
): ExecutiveTimeContextBuildResult {
  const startedAt = Date.now();
  const merged = Object.freeze({
    timeState: patch.timeState ?? current.timeState,
    referenceTimestamp: patch.referenceTimestamp ?? current.referenceTimestamp,
    requestedTime: patch.requestedTime ?? current.requestedTime,
    timelinePosition: patch.timelinePosition ?? current.timelinePosition,
    futureExtension: patch.futureExtension ?? current.futureExtension,
  });

  const build = buildExecutiveTimeContext(merged);
  if (build.success && build.timeContext) {
    recordExecutiveTimeContextEvent({
      type: "TimeContextUpdated",
      timeContextId: build.timeContext.timeContextId,
      timeState: build.timeContext.timeState,
    });
    recordExecutiveTimeContextEvent({
      type: "TimeContextChanged",
      timeContextId: build.timeContext.timeContextId,
      timeState: build.timeContext.timeState,
    });
    recordExecutiveTimeContextDiagnostics(
      buildExecutiveTimeContextDiagnostics({
        timeContext: build.timeContext,
        validation: build.validation,
        executionTimeMs: Date.now() - startedAt,
      })
    );
  }
  return build;
}

export function resetExecutiveTimeContextBuilderForTests(): void {
  timeContextSequence = 0;
}

export const ExecutiveTimeContextBuilder = Object.freeze({
  buildExecutiveTimeContext,
  updateExecutiveTimeContext,
});
