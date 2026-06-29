/**
 * APP-7:5 — Business timeline context confidence and proximity rules.
 */

import {
  BUSINESS_CONTEXT_DEFAULT_PROXIMITY_DAYS,
  clampContextConfidence,
  type BusinessEventRelationshipType,
} from "./businessTimelineContextTypes.ts";

export const BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE = Object.freeze({
  previous: 0.99,
  next: 0.99,
  "same-category": 0.72,
  "same-type": 0.7,
  "same-tag": 0.68,
  "same-lifecycle-phase": 0.85,
  "milestone-related": 0.8,
  "temporal-proximity": 0.65,
  "possible-cause": 0.58,
  "possible-effect": 0.58,
  unknown: 0.35,
} as const satisfies Readonly<Record<BusinessEventRelationshipType, number>>);

export function daysBetween(earlierIso: string, laterIso: string): number {
  const earlier = Date.parse(earlierIso);
  const later = Date.parse(laterIso);
  if (!Number.isFinite(earlier) || !Number.isFinite(later)) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.abs(later - earlier) / (1000 * 60 * 60 * 24);
}

export function isWithinProximity(
  leftOccurredAt: string,
  rightOccurredAt: string,
  proximityDays: number = BUSINESS_CONTEXT_DEFAULT_PROXIMITY_DAYS
): boolean {
  return daysBetween(leftOccurredAt, rightOccurredAt) <= proximityDays;
}

export function temporalProximityConfidence(
  leftOccurredAt: string,
  rightOccurredAt: string,
  proximityDays: number = BUSINESS_CONTEXT_DEFAULT_PROXIMITY_DAYS
): number {
  const distance = daysBetween(leftOccurredAt, rightOccurredAt);
  if (distance > proximityDays) {
    return 0;
  }
  if (distance === 0) {
    return clampContextConfidence(BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE["temporal-proximity"]);
  }
  const ratio = 1 - distance / proximityDays;
  return clampContextConfidence(BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE["temporal-proximity"] * ratio);
}

export function sharesAnyTag(left: readonly string[], right: readonly string[]): boolean {
  return left.some((tag) => right.includes(tag));
}

export function isPossibleCausalPair(
  earlierCategory: string,
  earlierType: string,
  laterCategory: string,
  laterType: string
): boolean {
  if (earlierCategory === laterCategory) {
    return true;
  }
  if (earlierType === laterType) {
    return true;
  }
  const causalPairs = [
    ["risk", "operations"],
    ["investment", "financial"],
    ["strategy", "product"],
  ] as const;
  return causalPairs.some(([from, to]) => earlierCategory === from && laterCategory === to);
}

export const BusinessTimelineContextRules = Object.freeze({
  daysBetween,
  isWithinProximity,
  temporalProximityConfidence,
  sharesAnyTag,
  isPossibleCausalPair,
});
