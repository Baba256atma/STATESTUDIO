import type {
  ExecutiveJudgmentContextItem,
  NormalizedExecutiveJudgmentContext,
} from "./executiveJudgmentContextEngine.ts";

export type ExecutiveJudgmentEvidenceType = "document" | "metric" | "observation" | "reference" | "unknown";
export type ExecutiveJudgmentEvidenceStatus = "available" | "incomplete" | "invalid";
export type ExecutiveJudgmentEvidenceLevel = "none" | "partial" | "complete";

export type NormalizedExecutiveJudgmentEvidenceRecord = Readonly<{
  evidenceId: string;
  evidenceType: ExecutiveJudgmentEvidenceType;
  source: string;
  category: string;
  label: string;
  description: string;
  references: readonly string[];
  scope: readonly string[];
  status: ExecutiveJudgmentEvidenceStatus;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentEvidenceCollection = Readonly<{
  contextId: string;
  records: readonly NormalizedExecutiveJudgmentEvidenceRecord[];
  duplicateIdsRemoved: readonly string[];
  deterministic: true;
  metadataOnly: true;
}>;

function evidenceType(item: ExecutiveJudgmentContextItem): ExecutiveJudgmentEvidenceType {
  const source = item.source.toLowerCase();
  const label = item.label.toLowerCase();
  if (source.includes("kpi") || label.includes("metric")) return "metric";
  if (source.includes("document") || label.includes("document")) return "document";
  if (source.includes("reference") || item.references.length > 0) return "reference";
  if (source.length > 0) return "observation";
  return "unknown";
}

function normalizeRecord(item: ExecutiveJudgmentContextItem): NormalizedExecutiveJudgmentEvidenceRecord {
  const evidenceId = item.id.trim();
  const label = item.label.trim();
  const description = item.description.trim();
  const source = item.source.trim();
  const references = Object.freeze([...new Set(item.references.map((reference) => reference.trim()).filter(Boolean))].sort());
  const status: ExecutiveJudgmentEvidenceStatus = evidenceId && label && description && source ? "available" : "incomplete";
  return Object.freeze({
    evidenceId,
    evidenceType: evidenceType(item),
    source,
    category: source || "unspecified",
    label,
    description,
    references,
    scope: Object.freeze(["executive-judgment"]),
    status,
    metadataOnly: true,
  });
}

export function normalizeExecutiveJudgmentEvidence(context: NormalizedExecutiveJudgmentContext): ExecutiveJudgmentEvidenceCollection {
  const byId = new Map<string, NormalizedExecutiveJudgmentEvidenceRecord>();
  const duplicateIds: string[] = [];
  for (const item of context.availableEvidence) {
    const record = normalizeRecord(item);
    if (!record.evidenceId) continue;
    if (byId.has(record.evidenceId)) {
      duplicateIds.push(record.evidenceId);
      continue;
    }
    byId.set(record.evidenceId, record);
  }

  return Object.freeze({
    contextId: context.baseContext.contextId,
    records: Object.freeze([...byId.values()].sort((left, right) => left.evidenceId.localeCompare(right.evidenceId))),
    duplicateIdsRemoved: Object.freeze([...new Set(duplicateIds)].sort()),
    deterministic: true,
    metadataOnly: true,
  });
}
