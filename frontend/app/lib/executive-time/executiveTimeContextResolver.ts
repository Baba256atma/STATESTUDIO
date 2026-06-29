/**
 * APP-1:2 — Executive Time Context Resolver.
 * Context catalog, window metadata, lens, and normalization — no business data.
 */

import {
  EXECUTIVE_TIME_CONTEXT_KEYS,
  EXECUTIVE_TIME_DEFAULT_CONTEXT,
  isExecutiveTimeContextKey,
} from "./executiveTimeContract.ts";
import type {
  ExecutiveTimeContextCategory,
  ExecutiveTimeContextComparisonMetadata,
  ExecutiveTimeContextKey,
  ExecutiveTimeContextLens,
  ExecutiveTimeContextObject,
  ExecutiveTimeContextWindow,
  ExecutiveTimeCustomRange,
  ExecutiveTimeValidationIssue,
  ExecutiveTimeValidationResult,
} from "./executiveTimeTypes.ts";

export const EXECUTIVE_TIME_CONTEXT_ENGINE_VERSION = "APP-1/2" as const;

type ContextBlueprint = Readonly<{
  id: ExecutiveTimeContextKey;
  name: string;
  category: ExecutiveTimeContextCategory;
  description: string;
  isRelative: boolean;
  supportsProjection: boolean;
  supportsHistory: boolean;
  supportsComparison: boolean;
  lens: ExecutiveTimeContextLens;
  windowKind: ExecutiveTimeContextWindow["windowKind"];
  relativeOffset?: Readonly<{ unit: "day" | "week" | "month" | "quarter" | "year"; amount: number }>;
}>;

const CONTEXT_BLUEPRINTS: readonly ContextBlueprint[] = Object.freeze([
  bp("now", "Now", "current", "Instantaneous executive view.", "operational", "instant"),
  bp("today", "Today", "current", "Current calendar day.", "operational", "range", { unit: "day", amount: 0 }),
  bp("this_week", "This Week", "current", "Current calendar week.", "operational", "range", { unit: "week", amount: 0 }),
  bp("this_month", "This Month", "current", "Current calendar month.", "management", "range", { unit: "month", amount: 0 }),
  bp("this_quarter", "This Quarter", "current", "Current calendar quarter.", "management", "range", { unit: "quarter", amount: 0 }),
  bp("this_year", "This Year", "current", "Current calendar year.", "strategic", "range", { unit: "year", amount: 0 }),
  bp("yesterday", "Yesterday", "historical", "Previous calendar day.", "operational", "range", { unit: "day", amount: -1 }, true),
  bp("last_week", "Last Week", "historical", "Previous calendar week.", "operational", "range", { unit: "week", amount: -1 }, true),
  bp("last_month", "Last Month", "historical", "Previous calendar month.", "management", "range", { unit: "month", amount: -1 }, true),
  bp("last_quarter", "Last Quarter", "historical", "Previous calendar quarter.", "management", "range", { unit: "quarter", amount: -1 }, true),
  bp("last_year", "Last Year", "historical", "Previous calendar year.", "strategic", "range", { unit: "year", amount: -1 }, true),
  bp("tomorrow", "Tomorrow", "future", "Next calendar day.", "tactical", "range", { unit: "day", amount: 1 }, false, true),
  bp("next_week", "Next Week", "future", "Next calendar week.", "tactical", "range", { unit: "week", amount: 1 }, false, true),
  bp("next_month", "Next Month", "future", "Next calendar month.", "management", "range", { unit: "month", amount: 1 }, false, true),
  bp("next_quarter", "Next Quarter", "future", "Next calendar quarter.", "management", "range", { unit: "quarter", amount: 1 }, false, true),
  bp("next_year", "Next Year", "future", "Next calendar year.", "strategic", "range", { unit: "year", amount: 1 }, false, true),
  bp("custom_range", "Custom Range", "flexible", "User-defined temporal range.", "management", "custom"),
  bp("future_projection", "Future Projection", "strategic", "Forward-looking projection horizon.", "forecast", "projection", undefined, false, true, true),
  bp("past_review", "Past Review", "strategic", "Retrospective review horizon.", "retrospective", "range", undefined, true, false, true),
]);

function bp(
  id: ExecutiveTimeContextKey,
  name: string,
  category: ExecutiveTimeContextCategory,
  description: string,
  lens: ExecutiveTimeContextLens,
  windowKind: ExecutiveTimeContextWindow["windowKind"],
  relativeOffset?: ContextBlueprint["relativeOffset"],
  supportsHistory = false,
  supportsProjection = false,
  supportsComparison = true
): ContextBlueprint {
  return Object.freeze({
    id,
    name,
    category,
    description,
    isRelative: relativeOffset !== undefined || id === "now",
    supportsProjection,
    supportsHistory,
    supportsComparison,
    lens,
    windowKind,
    relativeOffset,
  });
}

const blueprintById = new Map<ExecutiveTimeContextKey, ContextBlueprint>(
  CONTEXT_BLUEPRINTS.map((entry) => [entry.id, entry])
);

function issue(code: string, message: string): ExecutiveTimeValidationIssue {
  return Object.freeze({ code, message });
}

function startOfDayUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function endOfDayUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

function addDaysUtc(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function startOfWeekUtc(date: Date): Date {
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return startOfDayUtc(addDaysUtc(date, diff));
}

function endOfWeekUtc(date: Date): Date {
  return endOfDayUtc(addDaysUtc(startOfWeekUtc(date), 6));
}

function startOfMonthUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function endOfMonthUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999));
}

function quarterIndex(date: Date): number {
  return Math.floor(date.getUTCMonth() / 3);
}

function startOfQuarterUtc(date: Date): Date {
  const quarter = quarterIndex(date);
  return new Date(Date.UTC(date.getUTCFullYear(), quarter * 3, 1));
}

function endOfQuarterUtc(date: Date): Date {
  const start = startOfQuarterUtc(date);
  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 3, 0, 23, 59, 59, 999));
}

function startOfYearUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
}

function endOfYearUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
}

function shiftAnchor(date: Date, offset: NonNullable<ContextBlueprint["relativeOffset"]>): Date {
  const next = new Date(date);
  switch (offset.unit) {
    case "day":
      return addDaysUtc(next, offset.amount);
    case "week":
      return addDaysUtc(next, offset.amount * 7);
    case "month":
      return new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + offset.amount, next.getUTCDate()));
    case "quarter":
      return new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + offset.amount * 3, next.getUTCDate()));
    case "year":
      return new Date(Date.UTC(next.getUTCFullYear() + offset.amount, next.getUTCMonth(), next.getUTCDate()));
  }
}

function resolveRangeForOffset(
  anchor: Date,
  offset: NonNullable<ContextBlueprint["relativeOffset"]>
): Readonly<{ start: Date; end: Date }> {
  const shifted = shiftAnchor(anchor, offset);
  switch (offset.unit) {
    case "day":
      return Object.freeze({ start: startOfDayUtc(shifted), end: endOfDayUtc(shifted) });
    case "week":
      return Object.freeze({ start: startOfWeekUtc(shifted), end: endOfWeekUtc(shifted) });
    case "month":
      return Object.freeze({ start: startOfMonthUtc(shifted), end: endOfMonthUtc(shifted) });
    case "quarter":
      return Object.freeze({ start: startOfQuarterUtc(shifted), end: endOfQuarterUtc(shifted) });
    case "year":
      return Object.freeze({ start: startOfYearUtc(shifted), end: endOfYearUtc(shifted) });
  }
}

export function resolveContextWindow(input: {
  contextId: ExecutiveTimeContextKey;
  anchorDate?: string;
  customRange?: ExecutiveTimeCustomRange | null;
}): ExecutiveTimeContextWindow {
  const blueprint = blueprintById.get(input.contextId);
  const anchor = input.anchorDate ? new Date(input.anchorDate) : new Date();
  const anchorIso = anchor.toISOString();

  if (!blueprint) {
    return Object.freeze({
      startBoundary: anchorIso,
      endBoundary: anchorIso,
      projectionHorizon: null,
      windowKind: "instant",
    });
  }

  if (blueprint.id === "now") {
    return Object.freeze({
      startBoundary: anchorIso,
      endBoundary: anchorIso,
      projectionHorizon: null,
      windowKind: "instant",
    });
  }

  if (blueprint.id === "custom_range") {
    const start = input.customRange?.startBoundary ?? anchorIso;
    const end = input.customRange?.endBoundary ?? anchorIso;
    return Object.freeze({
      startBoundary: start,
      endBoundary: end,
      projectionHorizon: null,
      windowKind: "custom",
    });
  }

  if (blueprint.id === "future_projection") {
    const horizon = endOfQuarterUtc(addDaysUtc(anchor, 90)).toISOString();
    return Object.freeze({
      startBoundary: anchorIso,
      endBoundary: horizon,
      projectionHorizon: horizon,
      windowKind: "projection",
    });
  }

  if (blueprint.id === "past_review") {
    const start = startOfQuarterUtc(addDaysUtc(anchor, -90)).toISOString();
    return Object.freeze({
      startBoundary: start,
      endBoundary: anchorIso,
      projectionHorizon: null,
      windowKind: "range",
    });
  }

  if (blueprint.relativeOffset) {
    const range = resolveRangeForOffset(anchor, blueprint.relativeOffset);
    return Object.freeze({
      startBoundary: range.start.toISOString(),
      endBoundary: range.end.toISOString(),
      projectionHorizon: null,
      windowKind: "range",
    });
  }

  return Object.freeze({
    startBoundary: anchorIso,
    endBoundary: anchorIso,
    projectionHorizon: null,
    windowKind: blueprint.windowKind,
  });
}

export function resolveContextLens(contextId: ExecutiveTimeContextKey): ExecutiveTimeContextLens {
  return blueprintById.get(contextId)?.lens ?? "operational";
}

export function resolveContextComparisonMetadata(input: {
  primaryContextId: ExecutiveTimeContextKey;
  secondaryContextId: ExecutiveTimeContextKey;
}): ExecutiveTimeContextComparisonMetadata {
  const primary = blueprintById.get(input.primaryContextId);
  const secondary = blueprintById.get(input.secondaryContextId);
  const supported = Boolean(primary?.supportsComparison && secondary?.supportsComparison);
  return Object.freeze({
    primaryContextId: input.primaryContextId,
    secondaryContextId: input.secondaryContextId,
    comparisonLabel: `${primary?.name ?? input.primaryContextId} vs ${secondary?.name ?? input.secondaryContextId}`,
    supported,
    metadata: Object.freeze({
      contractOnly: true,
      comparisonLogicImplemented: false,
      primaryCategory: primary?.category ?? null,
      secondaryCategory: secondary?.category ?? null,
    }),
  });
}

export function getDefaultContext(): ExecutiveTimeContextKey {
  return EXECUTIVE_TIME_DEFAULT_CONTEXT;
}

export function listContexts(): readonly ExecutiveTimeContextObject[] {
  const anchor = new Date().toISOString();
  return Object.freeze(
    CONTEXT_BLUEPRINTS.map((blueprint) =>
      buildContextObject(blueprint.id, { anchorDate: anchor, customRange: null })
    )
  );
}

export function isValidContext(value: string): value is ExecutiveTimeContextKey {
  return isExecutiveTimeContextKey(value) && blueprintById.has(value);
}

export function normalizeContext(input: {
  contextId?: string | null;
  anchorDate?: string;
  customRange?: ExecutiveTimeCustomRange | null;
}): ExecutiveTimeContextObject {
  const contextId = isValidContext(input.contextId ?? "")
    ? input.contextId!
    : getDefaultContext();
  return buildContextObject(contextId as ExecutiveTimeContextKey, {
    anchorDate: input.anchorDate,
    customRange: input.customRange ?? null,
  });
}

export function resolveContext(input: {
  contextId: ExecutiveTimeContextKey;
  anchorDate?: string;
  customRange?: ExecutiveTimeCustomRange | null;
}): ExecutiveTimeContextObject | null {
  if (!isValidContext(input.contextId)) return null;
  return buildContextObject(input.contextId, {
    anchorDate: input.anchorDate,
    customRange: input.customRange ?? null,
  });
}

export function resolveContextMetadata(contextId: ExecutiveTimeContextKey): Readonly<Record<string, unknown>> {
  const context = resolveContext({ contextId });
  if (!context) return Object.freeze({});
  return Object.freeze({
    id: context.id,
    category: context.category,
    lens: context.lens,
    isRelative: context.isRelative,
    supportsProjection: context.supportsProjection,
    supportsHistory: context.supportsHistory,
    supportsComparison: context.supportsComparison,
    windowKind: context.window.windowKind,
    projectionHorizon: context.window.projectionHorizon,
    engineVersion: EXECUTIVE_TIME_CONTEXT_ENGINE_VERSION,
  });
}

export function validateExecutiveTimeContextInput(input: {
  contextId?: string | null;
  customRange?: ExecutiveTimeCustomRange | null;
}): ExecutiveTimeValidationResult {
  const issues: ExecutiveTimeValidationIssue[] = [];
  if (input.contextId && !isValidContext(input.contextId)) {
    issues.push(issue("invalid_context_id", `Unknown context id "${input.contextId}".`));
  }
  if (input.contextId === "custom_range" || input.customRange) {
    if (!input.customRange?.startBoundary?.trim() || !input.customRange?.endBoundary?.trim()) {
      issues.push(issue("invalid_custom_range", "custom_range requires startBoundary and endBoundary."));
    } else if (Date.parse(input.customRange.startBoundary) > Date.parse(input.customRange.endBoundary)) {
      issues.push(issue("custom_range_order", "custom_range startBoundary must be before endBoundary."));
    }
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function getRequiredContextIds(): readonly ExecutiveTimeContextKey[] {
  return EXECUTIVE_TIME_CONTEXT_KEYS;
}

function buildContextObject(
  contextId: ExecutiveTimeContextKey,
  input: { anchorDate?: string; customRange: ExecutiveTimeCustomRange | null }
): ExecutiveTimeContextObject {
  const blueprint = blueprintById.get(contextId)!;
  const window = resolveContextWindow({
    contextId,
    anchorDate: input.anchorDate,
    customRange: input.customRange,
  });
  return Object.freeze({
    id: blueprint.id,
    name: blueprint.name,
    category: blueprint.category,
    description: blueprint.description,
    startBoundary: window.startBoundary,
    endBoundary: window.endBoundary,
    isRelative: blueprint.isRelative,
    supportsProjection: blueprint.supportsProjection,
    supportsHistory: blueprint.supportsHistory,
    supportsComparison: blueprint.supportsComparison,
    lens: blueprint.lens,
    window,
    metadata: Object.freeze({
      engineVersion: EXECUTIVE_TIME_CONTEXT_ENGINE_VERSION,
      windowKind: window.windowKind,
      configurable: true,
    }),
  });
}
