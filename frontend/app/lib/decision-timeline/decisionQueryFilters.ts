/**
 * APP-6:6 — Decision Query filter and sort engine.
 * Operates exclusively on APP-6:5 DecisionState records.
 */

import type { DecisionEngineLifecycle } from "./decisionEventTypes.ts";
import type { DecisionState } from "./decisionStateTypes.ts";
import type {
  DecisionQueryAttributes,
  DecisionQueryFilters,
  DecisionQuerySort,
  DecisionQuerySortField,
} from "./decisionQueryTypes.ts";

function parseTimestamp(value: string | null | undefined): number {
  if (!value) {
    return Number.NEGATIVE_INFINITY;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
}

function withinCreatedRange(
  generatedAt: string,
  createdAfter?: string,
  createdBefore?: string
): boolean {
  const value = Date.parse(generatedAt);
  if (!Number.isFinite(value)) {
    return false;
  }
  if (createdAfter && value < Date.parse(createdAfter)) {
    return false;
  }
  if (createdBefore && value > Date.parse(createdBefore)) {
    return false;
  }
  return true;
}

function matchesTags(
  requiredTags: readonly string[] | undefined,
  attributes: DecisionQueryAttributes | undefined
): boolean {
  if (!requiredTags || requiredTags.length === 0) {
    return true;
  }
  const available = attributes?.tags ?? [];
  return requiredTags.every((tag) => available.includes(tag));
}

function compareLifecycle(
  left: DecisionEngineLifecycle | null,
  right: DecisionEngineLifecycle | null
): number {
  const leftValue = left ?? "";
  const rightValue = right ?? "";
  return leftValue.localeCompare(rightValue);
}

function resolveSortValue(state: DecisionState, field: DecisionQuerySortField): string | number {
  switch (field) {
    case "createdAt":
      return parseTimestamp(state.generatedAt);
    case "updatedAt":
      return parseTimestamp(state.latestTimestamp ?? state.generatedAt);
    case "latestTimestamp":
      return parseTimestamp(state.latestTimestamp ?? state.generatedAt);
    case "currentLifecycle":
      return state.currentLifecycle ?? "";
    case "decisionId":
    default:
      return state.decisionId;
  }
}

export function applyDecisionQueryFilters(
  states: readonly DecisionState[],
  filters: DecisionQueryFilters,
  attributesByDecisionId: ReadonlyMap<string, DecisionQueryAttributes> = new Map()
): readonly DecisionState[] {
  return Object.freeze(
    states.filter((state) => {
      if (filters.workspaceId && state.workspaceId !== filters.workspaceId) {
        return false;
      }
      if (filters.decisionId && state.decisionId !== filters.decisionId) {
        return false;
      }
      if (filters.lifecycle && state.currentLifecycle !== filters.lifecycle) {
        return false;
      }
      if (filters.status && state.currentStatus !== filters.status) {
        return false;
      }
      if (filters.terminal !== undefined && state.isTerminal !== filters.terminal) {
        return false;
      }
      if (filters.active !== undefined) {
        const isActive = state.isTerminal === false && state.isValid === true;
        if (isActive !== filters.active) {
          return false;
        }
      }
      if (!withinCreatedRange(state.generatedAt, filters.createdAfter, filters.createdBefore)) {
        return false;
      }

      const attributes = attributesByDecisionId.get(state.decisionId);
      if (filters.category && attributes?.category !== filters.category) {
        return false;
      }
      if (!matchesTags(filters.tags, attributes)) {
        return false;
      }

      return true;
    })
  );
}

export function applyDecisionQuerySort(
  states: readonly DecisionState[],
  sort: DecisionQuerySort
): readonly DecisionState[] {
  const directionMultiplier = sort.direction === "desc" ? -1 : 1;
  return Object.freeze(
    [...states].sort((left, right) => {
      const leftValue = resolveSortValue(left, sort.field);
      const rightValue = resolveSortValue(right, sort.field);

      let comparison = 0;
      if (typeof leftValue === "number" && typeof rightValue === "number") {
        comparison = leftValue - rightValue;
      } else {
        comparison = String(leftValue).localeCompare(String(rightValue));
      }

      if (comparison !== 0) {
        return comparison * directionMultiplier;
      }

      return left.decisionId.localeCompare(right.decisionId) * directionMultiplier;
    })
  );
}

export const DecisionQueryFiltersEngine = Object.freeze({
  applyDecisionQueryFilters,
  applyDecisionQuerySort,
});
