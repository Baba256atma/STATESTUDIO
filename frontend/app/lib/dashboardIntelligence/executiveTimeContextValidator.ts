/**
 * INT-1.3 — Executive Time Context validator.
 * No business calculations — state, version, timestamp, timeline compatibility only.
 */

import type { IntelligenceTimelinePosition } from "./intelligenceContextContract.ts";
import {
  EXECUTIVE_TIME_CONTEXT_VERSION,
  EXECUTIVE_TIME_STATES,
  type BuildExecutiveTimeContextInput,
  type ExecutiveTimeContextValidationIssue,
  type ExecutiveTimeContextValidationResult,
  type ExecutiveTimeContext,
  type ExecutiveTimeState,
} from "./executiveTimeContextContract.ts";

function issue(code: string, message: string): ExecutiveTimeContextValidationIssue {
  return Object.freeze({ code, message });
}

function result(
  issues: readonly ExecutiveTimeContextValidationIssue[]
): ExecutiveTimeContextValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

function isValidIsoTimestamp(value: string): boolean {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}

export function isExecutiveTimeState(value: string | null | undefined): value is ExecutiveTimeState {
  return EXECUTIVE_TIME_STATES.includes(value as ExecutiveTimeState);
}

export function validateExecutiveTimeContextInput(
  input: BuildExecutiveTimeContextInput
): ExecutiveTimeContextValidationResult {
  const issues: ExecutiveTimeContextValidationIssue[] = [];

  if (input.timeState != null && !isExecutiveTimeState(input.timeState)) {
    issues.push(
      issue("unsupported_time_state", `Time state "${String(input.timeState)}" is not supported.`)
    );
  }

  if (input.referenceTimestamp?.trim() && !isValidIsoTimestamp(input.referenceTimestamp.trim())) {
    issues.push(issue("invalid_reference_timestamp", "Reference timestamp must be a valid ISO string."));
  }

  if (input.timelinePosition?.index != null && input.timelinePosition.index < 0) {
    issues.push(issue("invalid_timeline_position", "Timeline position index cannot be negative."));
  }

  if (input.timeState === "past" && input.timelinePosition?.reserved === true && input.timelinePosition.index == null) {
    issues.push(
      issue(
        "past_timeline_inconsistent",
        "Past time state with timeline position should include an index or explicit label."
      )
    );
  }

  return result(issues);
}

export function validateExecutiveTimeContext(
  timeContext: ExecutiveTimeContext
): ExecutiveTimeContextValidationResult {
  const issues: ExecutiveTimeContextValidationIssue[] = [];

  if (timeContext.version !== EXECUTIVE_TIME_CONTEXT_VERSION) {
    issues.push(
      issue(
        "version_mismatch",
        `Time context version "${timeContext.version}" is incompatible with "${EXECUTIVE_TIME_CONTEXT_VERSION}".`
      )
    );
  }

  if (!isExecutiveTimeState(timeContext.timeState)) {
    issues.push(issue("unsupported_time_state", `Time state "${timeContext.timeState}" is not supported.`));
  }

  if (!isValidIsoTimestamp(timeContext.referenceTimestamp)) {
    issues.push(issue("invalid_reference_timestamp", "Reference timestamp must be a valid ISO string."));
  }

  if (timeContext.timelinePosition.index != null && timeContext.timelinePosition.index < 0) {
    issues.push(issue("invalid_timeline_position", "Timeline position index cannot be negative."));
  }

  if (timeContext.confidence !== null) {
    issues.push(issue("confidence_not_supported", "Executive time context confidence must remain null in INT-1.3."));
  }

  return result(issues);
}

export function validateTimelineCompatibility(input: {
  timeState: ExecutiveTimeState;
  timelinePosition: IntelligenceTimelinePosition;
}): ExecutiveTimeContextValidationResult {
  const issues: ExecutiveTimeContextValidationIssue[] = [];

  if (input.timeState === "future" && input.timelinePosition.reserved && input.timelinePosition.index != null) {
    issues.push(
      issue(
        "future_timeline_reserved_conflict",
        "Future time state cannot combine reserved timeline with explicit index in INT-1.3."
      )
    );
  }

  return result(issues);
}

export function isExecutiveTimeContextVersionCompatible(version: string | null | undefined): boolean {
  return version === EXECUTIVE_TIME_CONTEXT_VERSION;
}
