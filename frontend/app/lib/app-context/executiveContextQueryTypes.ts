import type { ExecutiveContext } from "./executiveContextIndex.ts";

export type ExecutiveContextSection =
  | "identity"
  | "metadata"
  | "workspace"
  | "domain"
  | "objects"
  | "kpis"
  | "risks"
  | "scenario"
  | "timeline"
  | "simulation"
  | "intent"
  | "goal"
  | "constraints";

export type ExecutiveContextQuery = Readonly<{
  sections?: readonly ExecutiveContextSection[];
  includeEmpty?: boolean;
}>;

export type ExecutiveContextFilter = Readonly<{
  section?: ExecutiveContextSection;
  contains?: string;
}>;

export type ExecutiveContextSortKey = "section" | "valueSize";

export type ExecutiveContextLookupResult<T> = Readonly<{
  found: boolean;
  section: ExecutiveContextSection;
  value: T | null;
}>;

export type ExecutiveContextSnapshotEntry = Readonly<{
  section: ExecutiveContextSection;
  value: string;
  valueSize: number;
}>;

export type ExecutiveContextSnapshot = Readonly<{
  contextId: string;
  entryCount: number;
  entries: readonly ExecutiveContextSnapshotEntry[];
  fingerprint: string;
  metadataOnly: true;
  deterministic: true;
}>;

export type ExecutiveContextDiffType = "added" | "removed" | "modified" | "unchanged";

export type ExecutiveContextDiffEntry = Readonly<{
  section: ExecutiveContextSection;
  type: ExecutiveContextDiffType;
  leftValue: string | null;
  rightValue: string | null;
}>;

export type ExecutiveContextDiff = Readonly<{
  equal: boolean;
  entries: readonly ExecutiveContextDiffEntry[];
  metadataOnly: true;
}>;

export type ExecutiveContextInspectionResult = Readonly<{
  valid: boolean;
  contextId: string;
  sections: readonly ExecutiveContextSection[];
  capabilities: readonly string[];
  summary: string;
  context: ExecutiveContext;
  metadataOnly: true;
}>;
