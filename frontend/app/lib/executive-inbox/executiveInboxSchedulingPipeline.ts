/**
 * APP-11:6 — Executive Inbox Scheduling Engine deterministic pipeline.
 */

import { EXECUTIVE_INBOX_SCHEDULING_PIPELINE_STAGES } from "./executiveInboxSchedulingEngineConstants.ts";
import { registerScheduleIntent } from "./executiveInboxSchedulingEngineRegistry.ts";
import { buildExecutiveScheduleIntent } from "./executiveInboxSchedulingIntentBuilder.ts";
import type {
  ExecutiveInboxSchedulingRequest,
  ExecutiveScheduleIntent,
  ReminderScheduleInput,
  ScheduleGenerationResult,
} from "./executiveInboxSchedulingEngineTypes.ts";
import {
  validateExecutiveInboxSchedulingRequest,
  validateExecutiveScheduleIntent,
  validateSchedulingDependencies,
} from "./executiveInboxSchedulingEngineValidation.ts";

function emptyResult(
  request: ExecutiveInboxSchedulingRequest,
  reason: string,
  generationTimestamp: string
): ScheduleGenerationResult {
  return Object.freeze({
    success: false,
    reason,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    scheduleIntents: Object.freeze([]),
    registeredScheduleIds: Object.freeze([]),
    skippedEntries: 0,
    ineligibleEntries: 0,
    pipelineStages: EXECUTIVE_INBOX_SCHEDULING_PIPELINE_STAGES,
    generationTimestamp,
    readOnly: true as const,
  });
}

function sortEntriesDeterministically(
  entries: readonly ReminderScheduleInput[]
): readonly ReminderScheduleInput[] {
  return Object.freeze(
    [...entries].sort((left, right) => left.reminder.reminderId.localeCompare(right.reminder.reminderId))
  );
}

export function buildExecutiveScheduleIntents(
  request: ExecutiveInboxSchedulingRequest
): readonly ExecutiveScheduleIntent[] {
  const generationTimestamp = request.generationTimestamp ?? new Date(0).toISOString();
  const sortedEntries = sortEntriesDeterministically(request.entries);

  return Object.freeze(
    sortedEntries
      .map((entry) => buildExecutiveScheduleIntent(entry, generationTimestamp))
      .filter((intent) => intent.eligibility.eligible)
  );
}

export function generateExecutiveScheduleIntents(
  request: ExecutiveInboxSchedulingRequest
): ScheduleGenerationResult {
  const generationTimestamp = request.generationTimestamp ?? new Date(0).toISOString();

  const dependencyValidation = validateSchedulingDependencies();
  if (!dependencyValidation.valid) {
    return emptyResult(
      request,
      dependencyValidation.issues.map((issue) => issue.message).join("; "),
      generationTimestamp
    );
  }

  const requestValidation = validateExecutiveInboxSchedulingRequest(request);
  if (!requestValidation.valid) {
    return emptyResult(
      request,
      requestValidation.issues.map((issue) => issue.message).join("; "),
      generationTimestamp
    );
  }

  const sortedEntries = sortEntriesDeterministically(request.entries);
  const builtIntents: ExecutiveScheduleIntent[] = [];
  let ineligibleEntries = 0;

  for (const entry of sortedEntries) {
    const intent = buildExecutiveScheduleIntent(entry, generationTimestamp);
    if (!intent.eligibility.eligible) {
      ineligibleEntries += 1;
      continue;
    }
    builtIntents.push(intent);
  }

  const registeredScheduleIds: string[] = [];
  let skippedEntries = 0;

  for (const intent of builtIntents) {
    const intentValidation = validateExecutiveScheduleIntent(intent);
    if (!intentValidation.valid) {
      return emptyResult(
        request,
        `Schedule validation failed: ${intentValidation.issues.map((issue) => issue.message).join("; ")}`,
        generationTimestamp
      );
    }
    const registration = registerScheduleIntent(intent);
    if (!registration.success) {
      if (registration.error?.code === "duplicate_schedule") {
        skippedEntries += 1;
        continue;
      }
      return emptyResult(request, registration.reason, generationTimestamp);
    }
    registeredScheduleIds.push(intent.scheduleId);
  }

  const scheduleIntents = Object.freeze(
    registeredScheduleIds
      .map((scheduleId) => builtIntents.find((entry) => entry.scheduleId === scheduleId))
      .filter((entry): entry is ExecutiveScheduleIntent => entry !== undefined)
      .sort((left, right) => left.scheduleId.localeCompare(right.scheduleId))
  );

  return Object.freeze({
    success: scheduleIntents.length > 0 || ineligibleEntries > 0,
    reason:
      scheduleIntents.length > 0
        ? `Generated ${scheduleIntents.length} executive schedule intent record(s) deterministically.`
        : ineligibleEntries > 0
          ? "No reminder records met scheduling eligibility rules."
          : "No executive schedule intents were registered.",
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    scheduleIntents,
    registeredScheduleIds: Object.freeze(registeredScheduleIds),
    skippedEntries,
    ineligibleEntries,
    pipelineStages: EXECUTIVE_INBOX_SCHEDULING_PIPELINE_STAGES,
    generationTimestamp,
    readOnly: true as const,
  });
}

export const ExecutiveInboxSchedulingPipeline = Object.freeze({
  generateExecutiveScheduleIntents,
  buildExecutiveScheduleIntents,
  stages: EXECUTIVE_INBOX_SCHEDULING_PIPELINE_STAGES,
});
