import type {
  ExecutiveJudgmentContextItem,
  NormalizedExecutiveJudgmentContext,
} from "./executiveJudgmentContextEngine.ts";
import type { ExecutiveJudgmentEvidenceAssessmentCollection } from "./executiveJudgmentEvidenceEngine.ts";

export type ExecutiveJudgmentConstraintCategory = "resource" | "time" | "policy" | "dependency" | "scope" | "general";
export type ExecutiveJudgmentConstraintStatus = "available" | "incomplete" | "invalid";
export type ExecutiveJudgmentConstraintLevel = "none" | "partial" | "complete";

export type NormalizedExecutiveJudgmentConstraintRecord = Readonly<{
  constraintId: string;
  constraintType: ExecutiveJudgmentConstraintCategory;
  category: string;
  source: string;
  label: string;
  description: string;
  references: readonly string[];
  dependencies: readonly string[];
  scope: readonly string[];
  status: ExecutiveJudgmentConstraintStatus;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentConstraintCollection = Readonly<{
  contextId: string;
  evidenceContextId: string;
  records: readonly NormalizedExecutiveJudgmentConstraintRecord[];
  duplicateIdsRemoved: readonly string[];
  deterministic: true;
  metadataOnly: true;
}>;

function categoryFor(item: ExecutiveJudgmentContextItem): ExecutiveJudgmentConstraintCategory {
  const text = `${item.id} ${item.label} ${item.source}`.toLowerCase();
  if (text.includes("resource")) return "resource";
  if (text.includes("time") || text.includes("timeline")) return "time";
  if (text.includes("policy")) return "policy";
  if (text.includes("depend")) return "dependency";
  if (text.includes("scope")) return "scope";
  return "general";
}

function normalizeRecord(item: ExecutiveJudgmentContextItem, evidenceIds: readonly string[]): NormalizedExecutiveJudgmentConstraintRecord {
  const constraintId = item.id.trim();
  const references = Object.freeze([...new Set(item.references.map((reference) => reference.trim()).filter(Boolean))].sort());
  const dependencies = Object.freeze(references.filter((reference) => evidenceIds.includes(reference)).sort());
  const category = categoryFor(item);
  const source = item.source.trim();
  const label = item.label.trim();
  const description = item.description.trim();
  const status: ExecutiveJudgmentConstraintStatus = constraintId && source && label && description ? "available" : "incomplete";
  return Object.freeze({
    constraintId,
    constraintType: category,
    category,
    source,
    label,
    description,
    references,
    dependencies,
    scope: Object.freeze(["executive-judgment"]),
    status,
    metadataOnly: true,
  });
}

export function normalizeExecutiveJudgmentConstraints(
  context: NormalizedExecutiveJudgmentContext,
  evidence: ExecutiveJudgmentEvidenceAssessmentCollection
): ExecutiveJudgmentConstraintCollection {
  const evidenceIds = evidence.assessments.map((assessment) => assessment.evidenceId);
  const byId = new Map<string, NormalizedExecutiveJudgmentConstraintRecord>();
  const duplicateIds: string[] = [];
  for (const item of context.constraints) {
    const record = normalizeRecord(item, evidenceIds);
    if (!record.constraintId) continue;
    if (byId.has(record.constraintId)) {
      duplicateIds.push(record.constraintId);
      continue;
    }
    byId.set(record.constraintId, record);
  }

  return Object.freeze({
    contextId: context.baseContext.contextId,
    evidenceContextId: evidence.contextId,
    records: Object.freeze([...byId.values()].sort((left, right) => left.constraintId.localeCompare(right.constraintId))),
    duplicateIdsRemoved: Object.freeze([...new Set(duplicateIds)].sort()),
    deterministic: true,
    metadataOnly: true,
  });
}
