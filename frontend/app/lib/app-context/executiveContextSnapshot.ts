import type { ExecutiveContext } from "./executiveContextIndex.ts";
import { queryExecutiveContext } from "./executiveContextQuery.ts";
import type {
  ExecutiveContextDiff,
  ExecutiveContextDiffEntry,
  ExecutiveContextSnapshot,
  ExecutiveContextSnapshotEntry,
} from "./executiveContextQueryTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function fingerprint(entries: readonly ExecutiveContextSnapshotEntry[]): string {
  return stableHash(entries.map((entry) => `${entry.section}:${entry.value}`).join("||"));
}

export function buildExecutiveContextSnapshot(context: ExecutiveContext): ExecutiveContextSnapshot {
  const entries = queryExecutiveContext(context);
  return Object.freeze({
    contextId: context.identity.contextId,
    entryCount: entries.length,
    entries,
    fingerprint: fingerprint(entries),
    metadataOnly: true,
    deterministic: true,
  });
}

export function validateExecutiveContextSnapshot(snapshot: ExecutiveContextSnapshot) {
  const valid =
    snapshot.contextId.trim().length > 0 &&
    snapshot.entryCount === snapshot.entries.length &&
    snapshot.fingerprint === fingerprint(snapshot.entries) &&
    snapshot.metadataOnly &&
    snapshot.deterministic;

  return Object.freeze({
    valid,
    issues: Object.freeze(
      valid ? [] : [Object.freeze({ code: "invalid_context_snapshot", message: "Executive context snapshot is invalid." })]
    ),
  });
}

export function compareExecutiveContextSnapshots(left: ExecutiveContextSnapshot, right: ExecutiveContextSnapshot): boolean {
  return left.fingerprint === right.fingerprint;
}

export function diffExecutiveContextSnapshots(
  left: ExecutiveContextSnapshot,
  right: ExecutiveContextSnapshot
): ExecutiveContextDiff {
  const leftBySection = new Map(left.entries.map((entry) => [entry.section, entry]));
  const rightBySection = new Map(right.entries.map((entry) => [entry.section, entry]));
  const sections = Object.freeze([...new Set([...leftBySection.keys(), ...rightBySection.keys()])].sort());
  const entries: ExecutiveContextDiffEntry[] = sections.map((section) => {
    const leftEntry = leftBySection.get(section);
    const rightEntry = rightBySection.get(section);
    if (!leftEntry && rightEntry) {
      return Object.freeze({ section, type: "added" as const, leftValue: null, rightValue: rightEntry.value });
    }
    if (leftEntry && !rightEntry) {
      return Object.freeze({ section, type: "removed" as const, leftValue: leftEntry.value, rightValue: null });
    }
    if (leftEntry && rightEntry && leftEntry.value !== rightEntry.value) {
      return Object.freeze({ section, type: "modified" as const, leftValue: leftEntry.value, rightValue: rightEntry.value });
    }
    return Object.freeze({ section, type: "unchanged" as const, leftValue: leftEntry?.value ?? null, rightValue: rightEntry?.value ?? null });
  });

  return Object.freeze({
    equal: entries.every((entry) => entry.type === "unchanged"),
    entries: Object.freeze(entries),
    metadataOnly: true,
  });
}
