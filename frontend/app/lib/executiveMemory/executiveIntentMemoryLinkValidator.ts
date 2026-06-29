/**
 * APP-4:5 — Executive Intent ↔ Memory link validator.
 */

import { isReservedIntentId } from "../executiveIntent/executiveIntentValidation.ts";
import { hasExecutiveMemory } from "./executiveMemoryStorageEngine.ts";
import {
  EXECUTIVE_INTENT_MEMORY_LINK_LIMITS,
  EXECUTIVE_INTENT_MEMORY_LINK_RELATIONSHIP_KEYS,
  EXECUTIVE_INTENT_MEMORY_LINK_STATE_KEYS,
  EXECUTIVE_INTENT_MEMORY_LINK_TYPE_KEYS,
} from "./executiveIntentMemoryLinkConstants.ts";
import { getExecutiveIntentLinkTarget, isExecutiveIntentLinkTargetRegistered } from "./executiveIntentMemoryLinkIntentRegistry.ts";
import type {
  ExecutiveIntentMemoryLink,
  ExecutiveIntentMemoryLinkQuery,
} from "./executiveIntentMemoryLinkTypes.ts";

export type ExecutiveIntentMemoryLinkValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveIntentMemoryLinkValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveIntentMemoryLinkValidationIssue[];
  readOnly: true;
}>;

function issue(code: string, message: string, field?: string): ExecutiveIntentMemoryLinkValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ExecutiveIntentMemoryLinkValidationIssue[]): ExecutiveIntentMemoryLinkValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

function isIsoTimestamp(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

export function isExecutiveIntentMemoryLinkType(value: string): boolean {
  return (EXECUTIVE_INTENT_MEMORY_LINK_TYPE_KEYS as readonly string[]).includes(value);
}

export function isExecutiveIntentMemoryLinkRelationship(value: string): boolean {
  return (EXECUTIVE_INTENT_MEMORY_LINK_RELATIONSHIP_KEYS as readonly string[]).includes(value);
}

export function isExecutiveIntentMemoryLinkState(value: string): boolean {
  return (EXECUTIVE_INTENT_MEMORY_LINK_STATE_KEYS as readonly string[]).includes(value);
}

function validateRelationshipTargets(link: ExecutiveIntentMemoryLink, issues: ExecutiveIntentMemoryLinkValidationIssue[]): void {
  switch (link.relationship) {
    case "intent_memory":
      if (!link.memoryId) {
        issues.push(issue("validation_failure", "intent_memory links require memoryId.", "memoryId"));
      }
      break;
    case "intent_goal":
      if (!link.goalId) {
        issues.push(issue("validation_failure", "intent_goal links require goalId.", "goalId"));
      }
      break;
    case "intent_scenario":
      if (!link.scenarioId) {
        issues.push(issue("validation_failure", "intent_scenario links require scenarioId.", "scenarioId"));
      }
      break;
    case "intent_decision":
      if (!link.decisionId) {
        issues.push(issue("validation_failure", "intent_decision links require decisionId.", "decisionId"));
      }
      break;
    case "intent_evidence":
      if (!link.evidenceId) {
        issues.push(issue("validation_failure", "intent_evidence links require evidenceId.", "evidenceId"));
      }
      break;
    case "intent_reference":
      if (!link.referenceId) {
        issues.push(issue("validation_failure", "intent_reference links require referenceId.", "referenceId"));
      }
      break;
    case "intent_business_context":
      if (!link.memoryId) {
        issues.push(issue("validation_failure", "intent_business_context links require memoryId.", "memoryId"));
      }
      break;
    default:
      break;
  }
}

export function validateExecutiveIntentMemoryLink(
  link: ExecutiveIntentMemoryLink
): ExecutiveIntentMemoryLinkValidationResult {
  const issues: ExecutiveIntentMemoryLinkValidationIssue[] = [];

  if (link.linkId.trim().length === 0) {
    issues.push(issue("malformed_identifier", "Link id must not be empty.", "linkId"));
  }
  if (isReservedIntentId(link.intentId)) {
    issues.push(issue("validation_failure", "Intent id is reserved.", "intentId"));
  }
  if (!isExecutiveIntentMemoryLinkType(link.linkType)) {
    issues.push(issue("invalid_link_type", "Link type is invalid.", "linkType"));
  }
  if (!isExecutiveIntentMemoryLinkRelationship(link.relationship)) {
    issues.push(issue("validation_failure", "Link relationship is invalid.", "relationship"));
  }
  if (!isExecutiveIntentMemoryLinkState(link.lifecycle)) {
    issues.push(issue("invalid_lifecycle", "Link lifecycle is invalid.", "lifecycle"));
  }
  if (!isIsoTimestamp(link.createdAt) || !isIsoTimestamp(link.updatedAt)) {
    issues.push(issue("validation_failure", "Link timestamps must be valid ISO dates.", "createdAt"));
  }
  if (link.metadata.label.length > EXECUTIVE_INTENT_MEMORY_LINK_LIMITS.maxLabelLength) {
    issues.push(issue("validation_failure", "Link label exceeds maximum length.", "metadata.label"));
  }
  if (link.metadata.notes.length > EXECUTIVE_INTENT_MEMORY_LINK_LIMITS.maxNotesLength) {
    issues.push(issue("validation_failure", "Link notes exceed maximum length.", "metadata.notes"));
  }
  if (Object.keys(link.metadata.customMetadata).length > EXECUTIVE_INTENT_MEMORY_LINK_LIMITS.maxCustomMetadataKeys) {
    issues.push(issue("validation_failure", "Custom metadata key count exceeds maximum.", "metadata.customMetadata"));
  }

  if (link.intentId === link.memoryId) {
    issues.push(issue("self_link_prohibited", "Intent id cannot equal memory id.", "intentId"));
  }

  validateRelationshipTargets(link, issues);

  if (!isExecutiveIntentLinkTargetRegistered(link.intentId)) {
    issues.push(issue("missing_intent", `Intent is not registered for linking: ${link.intentId}.`, "intentId"));
  } else {
    const target = getExecutiveIntentLinkTarget(link.intentId);
    if (target && target.workspaceId !== link.workspaceId) {
      issues.push(issue("validation_failure", "Link workspace must match registered intent workspace.", "workspaceId"));
    }
  }

  if (link.memoryId && !hasExecutiveMemory(link.memoryId)) {
    issues.push(issue("missing_memory", `Memory record not found: ${link.memoryId}.`, "memoryId"));
  }

  return result(issues);
}

export function validateExecutiveIntentMemoryLinkQuery(
  query: ExecutiveIntentMemoryLinkQuery
): ExecutiveIntentMemoryLinkValidationResult {
  const issues: ExecutiveIntentMemoryLinkValidationIssue[] = [];
  if (query.linkType && !isExecutiveIntentMemoryLinkType(query.linkType)) {
    issues.push(issue("invalid_link_type", "Query link type is invalid.", "linkType"));
  }
  if (query.relationship && !isExecutiveIntentMemoryLinkRelationship(query.relationship)) {
    issues.push(issue("validation_failure", "Query relationship is invalid.", "relationship"));
  }
  if (query.lifecycle && !isExecutiveIntentMemoryLinkState(query.lifecycle)) {
    issues.push(issue("invalid_lifecycle", "Query lifecycle is invalid.", "lifecycle"));
  }
  return result(issues);
}

export function buildExecutiveIntentMemoryLinkSignature(link: ExecutiveIntentMemoryLink): string {
  return [
    link.intentId,
    link.relationship,
    link.linkType,
    link.memoryId ?? "",
    link.goalId ?? "",
    link.scenarioId ?? "",
    link.decisionId ?? "",
    link.evidenceId ?? "",
    link.referenceId ?? "",
  ].join("|");
}

export const ExecutiveIntentMemoryLinkValidator = Object.freeze({
  validateExecutiveIntentMemoryLink,
  validateExecutiveIntentMemoryLinkQuery,
  isExecutiveIntentMemoryLinkType,
  isExecutiveIntentMemoryLinkRelationship,
  isExecutiveIntentMemoryLinkState,
  buildExecutiveIntentMemoryLinkSignature,
});
