/**
 * APP-4:10 — Executive Memory retention policy manager.
 */

import {
  EXECUTIVE_MEMORY_RETENTION_POLICY_IDS,
} from "./executiveMemoryLifecycleConstants.ts";
import { createExecutiveMemoryRetentionPolicy } from "./executiveMemoryLifecycleModel.ts";
import {
  getExecutiveMemoryLifecycle,
  listExecutiveMemoryRetentionPolicyRecords,
  registerExecutiveMemoryRetentionPolicyRecord,
  resetExecutiveMemoryLifecycleRegistryForTests,
  commitExecutiveMemoryLifecycle,
} from "./executiveMemoryLifecycleRegistry.ts";
import { validateExecutiveMemoryRetentionPolicy } from "./executiveMemoryLifecycleValidator.ts";
import type { ExecutiveMemoryRetentionPolicy } from "./executiveMemoryLifecycleTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";

function seedBuiltInRetentionPolicies(): void {
  const builtIns: ExecutiveMemoryRetentionPolicy[] = [
    createExecutiveMemoryRetentionPolicy({
      policyId: EXECUTIVE_MEMORY_RETENTION_POLICY_IDS.keepForever,
      label: "Keep Forever",
      policyType: "keep_forever",
      archiveAfterDays: null,
      description: "Retain memory indefinitely without automatic archival.",
    }),
    createExecutiveMemoryRetentionPolicy({
      policyId: EXECUTIVE_MEMORY_RETENTION_POLICY_IDS.archiveAfterPeriod,
      label: "Archive After Period",
      policyType: "archive_after_period",
      archiveAfterDays: 365,
      description: "Eligible for archival after configured period.",
    }),
    createExecutiveMemoryRetentionPolicy({
      policyId: EXECUTIVE_MEMORY_RETENTION_POLICY_IDS.protectedMemory,
      label: "Protected Memory",
      policyType: "protected_memory",
      archiveAfterDays: null,
      description: "Protected from merge and split operations.",
    }),
    createExecutiveMemoryRetentionPolicy({
      policyId: EXECUTIVE_MEMORY_RETENTION_POLICY_IDS.temporaryMemory,
      label: "Temporary Memory",
      policyType: "temporary_memory",
      archiveAfterDays: 30,
      description: "Short-lived memory with limited retention window.",
    }),
    createExecutiveMemoryRetentionPolicy({
      policyId: EXECUTIVE_MEMORY_RETENTION_POLICY_IDS.regulatoryRetention,
      label: "Regulatory Retention",
      policyType: "regulatory_retention",
      archiveAfterDays: null,
      description: "Regulatory retention policy without automatic deletion.",
    }),
  ];
  for (const policy of builtIns) {
    registerExecutiveMemoryRetentionPolicyRecord(policy);
  }
}

export function initializeExecutiveMemoryRetentionPolicies(): void {
  if (listExecutiveMemoryRetentionPolicyRecords().length === 0) {
    seedBuiltInRetentionPolicies();
  }
}

export function resetExecutiveMemoryRetentionPoliciesForTests(): void {
  resetExecutiveMemoryLifecycleRegistryForTests();
  seedBuiltInRetentionPolicies();
}

export function registerRetentionPolicy(
  policy: ExecutiveMemoryRetentionPolicy
): Readonly<{ success: boolean; reason: string }> {
  const validation = validateExecutiveMemoryRetentionPolicy(policy);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
    });
  }
  registerExecutiveMemoryRetentionPolicyRecord(policy);
  return Object.freeze({ success: true, reason: "Retention policy registered." });
}

export function getRetentionPolicies(): readonly ExecutiveMemoryRetentionPolicy[] {
  initializeExecutiveMemoryRetentionPolicies();
  return listExecutiveMemoryRetentionPolicyRecords();
}

export function getRetentionPolicy(policyId: string): ExecutiveMemoryRetentionPolicy | null {
  initializeExecutiveMemoryRetentionPolicies();
  return listExecutiveMemoryRetentionPolicyRecords().find((entry) => entry.policyId === policyId) ?? null;
}

export function applyRetentionPolicy(input: {
  memoryId: ExecutiveMemoryId;
  policyId: string;
  timestamp: string;
}): Readonly<{ success: boolean; reason: string }> {
  initializeExecutiveMemoryRetentionPolicies();
  const policy = getRetentionPolicy(input.policyId);
  if (!policy) {
    return Object.freeze({ success: false, reason: `Retention policy not found: ${input.policyId}.` });
  }
  const lifecycle = getExecutiveMemoryLifecycle(input.memoryId);
  if (!lifecycle) {
    return Object.freeze({ success: false, reason: `Lifecycle not found: ${input.memoryId}.` });
  }
  commitExecutiveMemoryLifecycle(
    Object.freeze({
      ...lifecycle,
      retentionPolicyId: input.policyId,
      updatedAt: input.timestamp,
      readOnly: true as const,
    })
  );
  return Object.freeze({ success: true, reason: "Retention policy applied." });
}

export const ExecutiveMemoryRetentionManager = Object.freeze({
  initializeExecutiveMemoryRetentionPolicies,
  resetExecutiveMemoryRetentionPoliciesForTests,
  registerRetentionPolicy,
  getRetentionPolicies,
  getRetentionPolicy,
  applyRetentionPolicy,
});
