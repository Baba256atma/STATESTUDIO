/**
 * APP-4:10 — Executive Memory integrity inspector.
 */

import { findExecutiveMemories } from "./executiveMemoryRetrievalEngine.ts";
import { hasExecutiveMemory } from "./executiveMemoryStorageEngine.ts";
import {
  getExecutiveMemoryLifecycle,
  listExecutiveMemoryLifecycles,
  getExecutiveMemoryVersionRecords,
} from "./executiveMemoryLifecycleRegistry.ts";
import { validateExecutiveMemoryVersionChain } from "./executiveMemoryLifecycleValidator.ts";
import { isExecutiveMemoryGovernanceState } from "./executiveMemoryLifecycleValidator.ts";
import type { ExecutiveMemoryIntegrityIssue, ExecutiveMemoryIntegrityReport } from "./executiveMemoryLifecycleTypes.ts";

function issue(code: string, message: string, memoryId?: string, field?: string): ExecutiveMemoryIntegrityIssue {
  return Object.freeze({ code, message, memoryId, field, readOnly: true as const });
}

export function inspectMemoryIntegrity(timestamp: string): ExecutiveMemoryIntegrityReport {
  const issues: ExecutiveMemoryIntegrityIssue[] = [];
  const lifecycles = listExecutiveMemoryLifecycles();
  const retrieval = findExecutiveMemories({});
  const storageIds = new Set(retrieval.records.map((entry) => entry.record.id));
  const lifecycleIds = new Set<string>();

  for (const lifecycle of lifecycles) {
    if (lifecycleIds.has(lifecycle.memoryId)) {
      issues.push(issue("integrity_violation", "Duplicate lifecycle identifier.", lifecycle.memoryId, "memoryId"));
    }
    lifecycleIds.add(lifecycle.memoryId);

    if (!isExecutiveMemoryGovernanceState(lifecycle.governanceState)) {
      issues.push(issue("integrity_violation", "Invalid governance state.", lifecycle.memoryId, "governanceState"));
    }
    if (!hasExecutiveMemory(lifecycle.memoryId)) {
      issues.push(issue("integrity_violation", "Orphan lifecycle without storage record.", lifecycle.memoryId, "memoryId"));
    }
    if (lifecycle.audit.author.trim().length === 0) {
      issues.push(issue("integrity_violation", "Missing audit author metadata.", lifecycle.memoryId, "audit.author"));
    }

    const chain = validateExecutiveMemoryVersionChain(lifecycle.canonicalMemoryId);
    if (!chain.valid) {
      for (const chainIssue of chain.issues) {
        issues.push(issue(chainIssue.code, chainIssue.message, lifecycle.memoryId, chainIssue.field));
      }
    }

    const versions = getExecutiveMemoryVersionRecords(lifecycle.canonicalMemoryId);
    if (versions.length === 0) {
      issues.push(issue("integrity_violation", "Missing version history.", lifecycle.memoryId, "versionId"));
    }
  }

  for (const record of retrieval.records) {
    for (const reference of record.record.references) {
      if (reference.referenceType === "custom") continue;
      if (!reference.targetId || reference.targetId.trim().length === 0) {
        issues.push(
          issue("integrity_violation", "Broken reference target id.", record.record.id, "references")
        );
      }
    }
    if (!lifecycleIds.has(record.record.id) && storageIds.has(record.record.id)) {
      issues.push(
        issue("integrity_violation", "Storage record without lifecycle governance.", record.record.id, "memoryId")
      );
    }
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    inspectedAt: timestamp,
    recordsInspected: lifecycles.length + retrieval.records.length,
    readOnly: true as const,
  });
}

export const ExecutiveMemoryIntegrityInspector = Object.freeze({
  inspectMemoryIntegrity,
});
