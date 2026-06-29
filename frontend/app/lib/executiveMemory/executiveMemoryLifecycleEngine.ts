/**
 * APP-4:10 — Executive Memory Lifecycle Engine.
 */

import { EXECUTIVE_MEMORY_LIFECYCLE_CONTRACT_VERSION } from "./executiveMemoryLifecycleConstants.ts";
import {
  initializeExecutiveMemoryRetentionPolicies,
  resetExecutiveMemoryRetentionPoliciesForTests,
  getRetentionPolicies,
  registerRetentionPolicy,
} from "./executiveMemoryLifecycleRetentionManager.ts";
import { resetExecutiveMemoryLifecycleRegistryForTests, listExecutiveMemoryLifecycles } from "./executiveMemoryLifecycleRegistry.ts";
import {
  archiveMemoryLifecycle,
  compareVersionsOperation,
  createMemoryVersionOperation,
  getExecutiveMemoryLifecycleStatistics,
  getLatestVersionOperation,
  getMemoryVersionHistoryOperation,
  inspectMemoryIntegrityOperation,
  inspectMergeHistory,
  inspectSplitHistory,
  mergeExecutiveMemoriesOperation,
  registerGovernedMemory,
  restoreExecutiveMemoryVersion,
  restoreSupersededMemoryOperation,
  splitExecutiveMemoryOperation,
  supersedeExecutiveMemoryOperation,
  applyRetentionPolicyOperation,
  validateMemoryLifecycle,
  validateMerge,
  validateSplit,
} from "./executiveMemoryLifecycleRepository.ts";
import type { ExecutiveMemoryLifecycleEngineState } from "./executiveMemoryLifecycleTypes.ts";

let initialized = false;

export function initializeExecutiveMemoryLifecycleEngine(
  timestamp: string
): Readonly<{ success: boolean; reason: string; state: ExecutiveMemoryLifecycleEngineState | null }> {
  initializeExecutiveMemoryRetentionPolicies();
  initialized = true;
  return Object.freeze({
    success: true,
    reason: "Executive Memory Lifecycle engine initialized.",
    state: getExecutiveMemoryLifecycleEngineState(timestamp),
  });
}

export function isExecutiveMemoryLifecycleEngineInitialized(): boolean {
  return initialized;
}

export function getExecutiveMemoryLifecycleEngineState(
  timestamp: string
): ExecutiveMemoryLifecycleEngineState {
  return Object.freeze({
    engineId: "executive-memory-lifecycle-engine",
    contractVersion: EXECUTIVE_MEMORY_LIFECYCLE_CONTRACT_VERSION,
    initialized,
    governedMemoryCount: listExecutiveMemoryLifecycles().length,
    registeredPolicyCount: getRetentionPolicies().length,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveMemoryLifecycleEngineForTests(): void {
  initialized = false;
  resetExecutiveMemoryLifecycleRegistryForTests();
  resetExecutiveMemoryRetentionPoliciesForTests();
}

export {
  registerGovernedMemory,
  createMemoryVersionOperation as createMemoryVersion,
  getMemoryVersionHistoryOperation as getMemoryVersionHistory,
  getLatestVersionOperation as getLatestVersion,
  compareVersionsOperation as compareVersions,
  mergeExecutiveMemoriesOperation as mergeExecutiveMemories,
  splitExecutiveMemoryOperation as splitExecutiveMemory,
  supersedeExecutiveMemoryOperation as supersedeExecutiveMemory,
  restoreSupersededMemoryOperation as restoreSupersededMemory,
  archiveMemoryLifecycle,
  restoreExecutiveMemoryVersion,
  applyRetentionPolicyOperation as applyRetentionPolicy,
  inspectMemoryIntegrityOperation as inspectMemoryIntegrity,
  validateMemoryLifecycle,
  validateMerge,
  validateSplit,
  inspectMergeHistory,
  inspectSplitHistory,
  getExecutiveMemoryLifecycleStatistics,
  getRetentionPolicies,
  registerRetentionPolicy,
};

export const ExecutiveMemoryLifecycleEngine = Object.freeze({
  initializeExecutiveMemoryLifecycleEngine,
  isExecutiveMemoryLifecycleEngineInitialized,
  getExecutiveMemoryLifecycleEngineState,
  resetExecutiveMemoryLifecycleEngineForTests,
  registerGovernedMemory,
  createMemoryVersion: createMemoryVersionOperation,
  getMemoryVersionHistory: getMemoryVersionHistoryOperation,
  getLatestVersion: getLatestVersionOperation,
  compareVersions: compareVersionsOperation,
  mergeExecutiveMemories: mergeExecutiveMemoriesOperation,
  splitExecutiveMemory: splitExecutiveMemoryOperation,
  supersedeExecutiveMemory: supersedeExecutiveMemoryOperation,
  restoreSupersededMemory: restoreSupersededMemoryOperation,
  archiveMemoryLifecycle,
  restoreExecutiveMemoryVersion,
  applyRetentionPolicy: applyRetentionPolicyOperation,
  inspectMemoryIntegrity: inspectMemoryIntegrityOperation,
  validateMemoryLifecycle,
  validateMerge,
  validateSplit,
  inspectMergeHistory,
  inspectSplitHistory,
  getExecutiveMemoryLifecycleStatistics,
  getRetentionPolicies,
  registerRetentionPolicy,
  version: EXECUTIVE_MEMORY_LIFECYCLE_CONTRACT_VERSION,
});
