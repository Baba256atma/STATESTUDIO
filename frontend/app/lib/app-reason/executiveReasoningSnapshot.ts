import { ExecutiveReasoningFoundation, type ExecutiveReasoningRegistry } from "./executiveReasoningIndex.ts";
import type {
  ExecutiveReasoningDiff,
  ExecutiveReasoningDiffEntry,
  ExecutiveReasoningSnapshot,
  ExecutiveReasoningSnapshotEntry,
} from "./executiveReasoningQueryTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function entryValue(entry: ExecutiveReasoningSnapshotEntry): string {
  return `${entry.packageId}:${entry.contractIds.join(",")}:${entry.value}`;
}

function fingerprint(entries: readonly ExecutiveReasoningSnapshotEntry[]): string {
  return stableHash(entries.map(entryValue).join("||"));
}

export function buildExecutiveReasoningSnapshot(registry: ExecutiveReasoningRegistry): ExecutiveReasoningSnapshot {
  const entries = Object.freeze(
    ExecutiveReasoningFoundation.listExecutiveReasoningPackages(registry).map((registered) => {
      const value = JSON.stringify(registered.package);
      return Object.freeze({
        packageId: registered.package.packageId,
        contractIds: Object.freeze(registered.package.contracts.map((contract) => contract.contractId)),
        value,
        valueSize: value.length,
      });
    })
  );
  return Object.freeze({
    registryId: registry.registryId,
    packageCount: registry.packages.length,
    contractCount: entries.reduce((sum, entry) => sum + entry.contractIds.length, 0),
    entries,
    fingerprint: fingerprint(entries),
    metadataOnly: true,
    deterministic: true,
  });
}

export function validateExecutiveReasoningSnapshot(snapshot: ExecutiveReasoningSnapshot) {
  const valid =
    snapshot.registryId === "executive-reasoning-registry" &&
    snapshot.packageCount === snapshot.entries.length &&
    snapshot.contractCount === snapshot.entries.reduce((sum, entry) => sum + entry.contractIds.length, 0) &&
    snapshot.fingerprint === fingerprint(snapshot.entries) &&
    snapshot.metadataOnly &&
    snapshot.deterministic;

  return Object.freeze({
    valid,
    issues: Object.freeze(
      valid ? [] : [Object.freeze({ code: "invalid_reasoning_snapshot", message: "Executive reasoning snapshot is invalid." })]
    ),
  });
}

export function compareExecutiveReasoningSnapshots(left: ExecutiveReasoningSnapshot, right: ExecutiveReasoningSnapshot): boolean {
  return left.fingerprint === right.fingerprint;
}

export function diffExecutiveReasoningSnapshots(
  left: ExecutiveReasoningSnapshot,
  right: ExecutiveReasoningSnapshot
): ExecutiveReasoningDiff {
  const leftByPackage = new Map(left.entries.map((entry) => [entry.packageId, entry]));
  const rightByPackage = new Map(right.entries.map((entry) => [entry.packageId, entry]));
  const packageIds = [...new Set([...leftByPackage.keys(), ...rightByPackage.keys()])].sort();
  const entries: ExecutiveReasoningDiffEntry[] = packageIds.map((packageId) => {
    const leftEntry = leftByPackage.get(packageId);
    const rightEntry = rightByPackage.get(packageId);
    if (!leftEntry && rightEntry) {
      return Object.freeze({ packageId, type: "added" as const, leftValue: null, rightValue: rightEntry.value });
    }
    if (leftEntry && !rightEntry) {
      return Object.freeze({ packageId, type: "removed" as const, leftValue: leftEntry.value, rightValue: null });
    }
    if (leftEntry && rightEntry && leftEntry.value !== rightEntry.value) {
      return Object.freeze({ packageId, type: "modified" as const, leftValue: leftEntry.value, rightValue: rightEntry.value });
    }
    return Object.freeze({ packageId, type: "unchanged" as const, leftValue: leftEntry?.value ?? null, rightValue: rightEntry?.value ?? null });
  });
  return Object.freeze({
    equal: entries.every((entry) => entry.type === "unchanged"),
    entries: Object.freeze(entries),
    metadataOnly: true,
  });
}
