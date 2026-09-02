/**
 * DATA-UX:5 — read-only removal impact. Does not delete, mutate Focus, or
 * invent dependencies. Dependencies come only from Executive Source Intelligence.
 */

import {
  projectExecutiveSourceIntelligence,
  type ExecutiveSourceAffectedObject,
} from "./executiveSourceIntelligence.ts";
import type { CsvCommittedImport } from "./csvRealDataImportStore.ts";

export const csvSourceRemovalImpactIdentity =
  "DATA-UX:5/CsvSourceRemovalImpact" as const;

export const CSV_SOURCE_REMOVAL_IMPACT_CLASSES = Object.freeze([
  "NO_EXECUTIVE_IMPACT",
  "SHARED_SUPPORT_REMAINS",
  "DEPENDENT_DATA_BECOMES_UNAVAILABLE",
] as const);

export type CsvSourceRemovalImpactClass =
  (typeof CSV_SOURCE_REMOVAL_IMPACT_CLASSES)[number];

export type CsvSourceRemovalDependent = Readonly<{
  objectKey: string;
  objectLabel: string;
  stageObjectId: string | null;
  support: "sole" | "shared";
  currentlySuppliedByThisSource: boolean;
  remainingSourceLabels: readonly string[];
}>;

export type CsvSourceRemovalImpact = Readonly<{
  identity: typeof csvSourceRemovalImpactIdentity;
  sourceId: string;
  workspaceId: string;
  sourceLabel: string;
  isActiveSource: boolean;
  impactClass: CsvSourceRemovalImpactClass;
  dependents: readonly CsvSourceRemovalDependent[];
  managerSummary: string;
  historicalProvenanceRetained: true;
  mutatesDecision: false;
  mutatesExecution: false;
  mutatesOutcome: false;
  mutatesLearning: false;
  firstClickDeletes: false;
}>;

function overlappingPeers(
  objectKey: string,
  sourceId: string,
  peers: readonly CsvCommittedImport[],
): readonly CsvCommittedImport[] {
  return Object.freeze(
    peers.filter((peer) => {
      if (peer.sourceContextId === sourceId) return false;
      return projectExecutiveSourceIntelligence(peer).affectedObjects.some(
        (entry) => entry.objectKey === objectKey,
      );
    }),
  );
}

function classifyDependent(
  affected: ExecutiveSourceAffectedObject,
  source: CsvCommittedImport,
  peers: readonly CsvCommittedImport[],
  activeSourceContextId: string | null,
): CsvSourceRemovalDependent {
  const remaining = overlappingPeers(affected.objectKey, source.sourceContextId, peers);
  return Object.freeze({
    objectKey: affected.objectKey,
    objectLabel: affected.objectLabel,
    stageObjectId: affected.stageObjectId,
    support: remaining.length > 0 ? "shared" as const : "sole" as const,
    currentlySuppliedByThisSource: activeSourceContextId === source.sourceContextId,
    remainingSourceLabels: Object.freeze(remaining.map((entry) => entry.prepared.fileName)),
  });
}

function managerSummary(input: Readonly<{
  sourceLabel: string;
  isActive: boolean;
  dependents: readonly CsvSourceRemovalDependent[];
  impactClass: CsvSourceRemovalImpactClass;
}>): string {
  if (input.dependents.length === 0) {
    return `${input.sourceLabel} is not currently supplying any Executive Objects.`;
  }
  const labels = [...new Set(input.dependents.map((entry) => entry.objectLabel))];
  if (input.impactClass === "SHARED_SUPPORT_REMAINS") {
    return `${input.sourceLabel} is associated with ${labels.join(" and ")}. Other imported sources still support ${labels.length === 1 ? "that object" : "those objects"}.`;
  }
  if (!input.isActive) {
    return `${input.sourceLabel} is not the active source. Current business data stays as it is. This source will no longer be available.`;
  }
  return `Removing ${input.sourceLabel} will stop using it for current data behind ${labels.join(" and ")}.`;
}

export function analyzeCsvSourceRemovalImpact(input: Readonly<{
  source: CsvCommittedImport;
  peers: readonly CsvCommittedImport[];
  activeSourceContextId: string | null;
}>): CsvSourceRemovalImpact {
  const intelligence = projectExecutiveSourceIntelligence(input.source);
  const dependents = Object.freeze(
    intelligence.affectedObjects.map((entry) =>
      classifyDependent(entry, input.source, input.peers, input.activeSourceContextId),
    ),
  );
  const isActive = input.activeSourceContextId === input.source.sourceContextId;
  const impactClass: CsvSourceRemovalImpactClass =
    dependents.length === 0
      ? "NO_EXECUTIVE_IMPACT"
      : isActive
        ? "DEPENDENT_DATA_BECOMES_UNAVAILABLE"
        : dependents.some((entry) => entry.support === "shared")
          ? "SHARED_SUPPORT_REMAINS"
          : "NO_EXECUTIVE_IMPACT";
  return Object.freeze({
    identity: csvSourceRemovalImpactIdentity,
    sourceId: input.source.sourceContextId,
    workspaceId: input.source.workspaceId,
    sourceLabel: input.source.prepared.fileName,
    isActiveSource: isActive,
    impactClass,
    dependents,
    managerSummary: managerSummary({
      sourceLabel: input.source.prepared.fileName,
      isActive,
      dependents,
      impactClass,
    }),
    historicalProvenanceRetained: true as const,
    mutatesDecision: false as const,
    mutatesExecution: false as const,
    mutatesOutcome: false as const,
    mutatesLearning: false as const,
    firstClickDeletes: false as const,
  });
}
