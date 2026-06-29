/**
 * APP-1:5 — Executive Time Transition Approval metadata.
 * Approval requirements only — no user interaction.
 */

import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";

export type ExecutiveTimeTransitionApprovalLevel =
  | "none"
  | "manager"
  | "executive"
  | "multi_stage"
  | "policy";

export type ExecutiveTimeTransitionApprovalRequirement = Readonly<{
  level: ExecutiveTimeTransitionApprovalLevel;
  stage: string;
  required: boolean;
  granted: boolean;
  label: string;
}>;

export type ExecutiveTimeTransitionApprovalResult = Readonly<{
  approvalRequired: boolean;
  valid: boolean;
  requirements: readonly ExecutiveTimeTransitionApprovalRequirement[];
  blockingIssues: readonly string[];
}>;

const APPROVAL_BY_ENTITY: Readonly<Partial<Record<ExecutiveTimeEntityType, ExecutiveTimeTransitionApprovalLevel>>> =
  Object.freeze({
    decision: "executive",
    scenario: "manager",
    risk: "policy",
    kpi: "none",
  });

export function resolveApprovalLevel(entityType: ExecutiveTimeEntityType): ExecutiveTimeTransitionApprovalLevel {
  return APPROVAL_BY_ENTITY[entityType] ?? "none";
}

export function validateTransitionApproval(input: {
  entityType: ExecutiveTimeEntityType;
  fromState: string;
  toState: string;
  approvalGranted?: boolean;
  overrideLevel?: ExecutiveTimeTransitionApprovalLevel;
}): ExecutiveTimeTransitionApprovalResult {
  const level = input.overrideLevel ?? resolveApprovalLevel(input.entityType);
  const requirements: ExecutiveTimeTransitionApprovalRequirement[] = [];
  const blockingIssues: string[] = [];

  if (level === "none") {
    requirements.push(Object.freeze({
      level: "none",
      stage: "none",
      required: false,
      granted: true,
      label: "No approval required.",
    }));
    return Object.freeze({
      approvalRequired: false,
      valid: true,
      requirements: Object.freeze(requirements),
      blockingIssues: Object.freeze([]),
    });
  }

  const granted = input.approvalGranted === true;
  requirements.push(Object.freeze({
    level,
    stage: level === "multi_stage" ? "stage_1" : level,
    required: true,
    granted,
    label: `${level} approval required for ${input.fromState} → ${input.toState}.`,
  }));

  if (!granted) {
    blockingIssues.push(`${level} approval is required before transition.`);
  }

  return Object.freeze({
    approvalRequired: true,
    valid: granted,
    requirements: Object.freeze(requirements),
    blockingIssues: Object.freeze(blockingIssues),
  });
}
