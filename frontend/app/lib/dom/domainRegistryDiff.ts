import type { DomainId } from "./domainFoundationIndex.ts";
import type { DomainRegistrySnapshot, DomainSnapshotEntry } from "./domainRegistryQueryIndex.ts";
import {
  DOMAIN_REGISTRY_STATS_CONTRACT_VERSION,
  type DomainRegistryDiff,
  type DomainRegistryDiffEntry,
  type DomainRegistryDiffSummary,
  type DomainRegistryDiffType,
  type DomainRegistryDiffValidationResult,
} from "./domainRegistryStatsTypes.ts";

function snapshotEntryMap(snapshot: DomainRegistrySnapshot): Readonly<Record<DomainId, DomainSnapshotEntry>> {
  return Object.freeze(Object.fromEntries(snapshot.entries.map((entry) => [entry.domainId, entry])));
}

function entriesEqual(left: DomainSnapshotEntry, right: DomainSnapshotEntry): boolean {
  return (
    left.name === right.name &&
    left.category === right.category &&
    left.status === right.status &&
    left.registrationOrder === right.registrationOrder &&
    left.versionMajor === right.versionMajor &&
    left.versionMinor === right.versionMinor &&
    left.versionPatch === right.versionPatch &&
    left.capabilityIds.join(",") === right.capabilityIds.join(",") &&
    left.dependencyIds.join(",") === right.dependencyIds.join(",")
  );
}

function buildDiffEntry(
  diffType: DomainRegistryDiffType,
  domainId: DomainId,
  leftEntry: DomainSnapshotEntry | null,
  rightEntry: DomainSnapshotEntry | null
): DomainRegistryDiffEntry {
  return Object.freeze({
    diffType,
    domainId,
    leftEntry,
    rightEntry,
  });
}

function buildSummary(entries: readonly DomainRegistryDiffEntry[]): DomainRegistryDiffSummary {
  const summary = {
    added: 0,
    removed: 0,
    modified: 0,
    unchanged: 0,
    total: entries.length,
  };

  for (const entry of entries) {
    summary[entry.diffType] += 1;
  }

  return Object.freeze(summary);
}

export function diffDomainRegistrySnapshots(
  left: DomainRegistrySnapshot,
  right: DomainRegistrySnapshot
): DomainRegistryDiff {
  const leftMap = snapshotEntryMap(left);
  const rightMap = snapshotEntryMap(right);
  const domainIds = Object.freeze(
    [...new Set([...Object.keys(leftMap), ...Object.keys(rightMap)])].sort((leftId, rightId) => leftId.localeCompare(rightId))
  );

  const entries = domainIds.map((domainId) => {
    const leftEntry = leftMap[domainId] ?? null;
    const rightEntry = rightMap[domainId] ?? null;

    if (leftEntry && !rightEntry) {
      return buildDiffEntry("removed", domainId, leftEntry, null);
    }
    if (!leftEntry && rightEntry) {
      return buildDiffEntry("added", domainId, null, rightEntry);
    }
    if (leftEntry && rightEntry && !entriesEqual(leftEntry, rightEntry)) {
      return buildDiffEntry("modified", domainId, leftEntry, rightEntry);
    }
    return buildDiffEntry("unchanged", domainId, leftEntry, rightEntry);
  });

  return Object.freeze({
    contractVersion: DOMAIN_REGISTRY_STATS_CONTRACT_VERSION,
    summary: buildSummary(entries),
    entries: Object.freeze(entries),
    deterministic: true,
  });
}

export function summarizeDomainRegistryDiff(diff: DomainRegistryDiff): DomainRegistryDiffSummary {
  return Object.freeze({ ...diff.summary });
}

export function validateDomainRegistryDiff(diff: DomainRegistryDiff): DomainRegistryDiffValidationResult {
  const issues: string[] = [];

  if (diff.contractVersion !== DOMAIN_REGISTRY_STATS_CONTRACT_VERSION) {
    issues.push("Diff contract version must be DOM-1:3.");
  }

  if (diff.deterministic !== true) {
    issues.push("Diff must be deterministic.");
  }

  if (diff.entries.length !== diff.summary.total) {
    issues.push("Diff summary total must match entry count.");
  }

  const summaryCounts = {
    added: 0,
    removed: 0,
    modified: 0,
    unchanged: 0,
  };

  for (const entry of diff.entries) {
    summaryCounts[entry.diffType] += 1;

    if (entry.diffType === "added" && entry.rightEntry === null) {
      issues.push(`Added diff entry ${entry.domainId} must include a right entry.`);
    }
    if (entry.diffType === "removed" && entry.leftEntry === null) {
      issues.push(`Removed diff entry ${entry.domainId} must include a left entry.`);
    }
    if (entry.diffType === "modified" && (entry.leftEntry === null || entry.rightEntry === null)) {
      issues.push(`Modified diff entry ${entry.domainId} must include both left and right entries.`);
    }
    if (entry.diffType === "unchanged" && (entry.leftEntry === null || entry.rightEntry === null)) {
      issues.push(`Unchanged diff entry ${entry.domainId} must include both left and right entries.`);
    }
  }

  if (summaryCounts.added !== diff.summary.added) {
    issues.push("Diff summary added count is inconsistent.");
  }
  if (summaryCounts.removed !== diff.summary.removed) {
    issues.push("Diff summary removed count is inconsistent.");
  }
  if (summaryCounts.modified !== diff.summary.modified) {
    issues.push("Diff summary modified count is inconsistent.");
  }
  if (summaryCounts.unchanged !== diff.summary.unchanged) {
    issues.push("Diff summary unchanged count is inconsistent.");
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}
