import type {
  ExecutiveJudgmentContextItem,
  NormalizedExecutiveJudgmentContext,
} from "./executiveJudgmentContextEngine.ts";
import type { ExecutiveJudgmentEvidenceAssessmentCollection } from "./executiveJudgmentEvidenceEngine.ts";
import type { ExecutiveJudgmentConstraintAssessmentCollection } from "./executiveJudgmentConstraintEngine.ts";
import type { ExecutiveJudgmentTradeoffDomain } from "./executiveJudgmentTradeoffRegistry.ts";

export type ExecutiveJudgmentTradeoffStatus = "available" | "incomplete" | "invalid";
export type ExecutiveJudgmentTradeoffLevel = "none" | "partial" | "complete";
export type ExecutiveJudgmentTradeoffDirection = "balanced" | "left-bound" | "right-bound";

export type NormalizedExecutiveJudgmentTradeoffRecord = Readonly<{
  tradeoffId: string;
  tradeoffType: ExecutiveJudgmentTradeoffDomain;
  category: ExecutiveJudgmentTradeoffDomain;
  dimension: string;
  scope: readonly string[];
  participants: readonly string[];
  relationship: string;
  dependencies: readonly string[];
  direction: ExecutiveJudgmentTradeoffDirection;
  source: string;
  status: ExecutiveJudgmentTradeoffStatus;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentTradeoffCollection = Readonly<{
  contextId: string;
  evidenceContextId: string;
  constraintContextId: string;
  records: readonly NormalizedExecutiveJudgmentTradeoffRecord[];
  duplicateIdsRemoved: readonly string[];
  deterministic: true;
  metadataOnly: true;
}>;

const TRADEOFF_PATTERNS: readonly Readonly<{
  domain: ExecutiveJudgmentTradeoffDomain;
  left: string;
  right: string;
}>[] = Object.freeze([
  Object.freeze({ domain: "cost-benefit", left: "cost", right: "benefit" }),
  Object.freeze({ domain: "speed-quality", left: "speed", right: "quality" }),
  Object.freeze({ domain: "risk-return", left: "risk", right: "return" }),
  Object.freeze({ domain: "short-long-term", left: "short", right: "long" }),
  Object.freeze({ domain: "efficiency-resilience", left: "efficiency", right: "resilience" }),
  Object.freeze({ domain: "flexibility-stability", left: "flexibility", right: "stability" }),
  Object.freeze({ domain: "growth-control", left: "growth", right: "control" }),
  Object.freeze({ domain: "resource-impact", left: "resource", right: "impact" }),
  Object.freeze({ domain: "innovation-reliability", left: "innovation", right: "reliability" }),
  Object.freeze({ domain: "complexity-simplicity", left: "complexity", right: "simplicity" }),
]);

function domainFor(item: ExecutiveJudgmentContextItem): ExecutiveJudgmentTradeoffDomain {
  const text = `${item.id} ${item.label} ${item.description}`.toLowerCase();
  return TRADEOFF_PATTERNS.find((pattern) => text.includes(pattern.left) || text.includes(pattern.right))?.domain ?? "cost-benefit";
}

function directionFor(item: ExecutiveJudgmentContextItem): ExecutiveJudgmentTradeoffDirection {
  const text = `${item.label} ${item.description}`.toLowerCase();
  const pattern = TRADEOFF_PATTERNS.find((entry) => text.includes(entry.left) || text.includes(entry.right));
  if (!pattern) return "balanced";
  if (text.includes(pattern.left) && !text.includes(pattern.right)) return "left-bound";
  if (text.includes(pattern.right) && !text.includes(pattern.left)) return "right-bound";
  return "balanced";
}

function normalizeRecord(
  item: ExecutiveJudgmentContextItem,
  evidenceIds: readonly string[],
  constraintIds: readonly string[]
): NormalizedExecutiveJudgmentTradeoffRecord {
  const tradeoffId = item.id.trim();
  const references = Object.freeze([...new Set(item.references.map((reference) => reference.trim()).filter(Boolean))].sort());
  const dependencies = Object.freeze(references.filter((reference) => evidenceIds.includes(reference) || constraintIds.includes(reference)).sort());
  const category = domainFor(item);
  const source = item.source.trim();
  const status: ExecutiveJudgmentTradeoffStatus = tradeoffId && item.label.trim() && source ? "available" : "incomplete";
  return Object.freeze({
    tradeoffId,
    tradeoffType: category,
    category,
    dimension: category,
    scope: Object.freeze(["executive-judgment"]),
    participants: references,
    relationship: references.length > 1 ? "multi-participant" : "single-participant",
    dependencies,
    direction: directionFor(item),
    source,
    status,
    metadataOnly: true,
  });
}

export function normalizeExecutiveJudgmentTradeoffs(
  context: NormalizedExecutiveJudgmentContext,
  evidence: ExecutiveJudgmentEvidenceAssessmentCollection,
  constraints: ExecutiveJudgmentConstraintAssessmentCollection
): ExecutiveJudgmentTradeoffCollection {
  const evidenceIds = evidence.assessments.map((assessment) => assessment.evidenceId);
  const constraintIds = constraints.assessments.map((assessment) => assessment.constraintId);
  const byId = new Map<string, NormalizedExecutiveJudgmentTradeoffRecord>();
  const duplicateIds: string[] = [];
  for (const item of context.availableAlternatives) {
    const record = normalizeRecord(item, evidenceIds, constraintIds);
    if (!record.tradeoffId) continue;
    if (byId.has(record.tradeoffId)) {
      duplicateIds.push(record.tradeoffId);
      continue;
    }
    byId.set(record.tradeoffId, record);
  }

  return Object.freeze({
    contextId: context.baseContext.contextId,
    evidenceContextId: evidence.contextId,
    constraintContextId: constraints.contextId,
    records: Object.freeze([...byId.values()].sort((left, right) => left.tradeoffId.localeCompare(right.tradeoffId))),
    duplicateIdsRemoved: Object.freeze([...new Set(duplicateIds)].sort()),
    deterministic: true,
    metadataOnly: true,
  });
}
