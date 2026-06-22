import type { WorkspaceDomainId } from "./workspaceDomainContract.ts";
import type { WorkspaceGoal } from "./workspaceGoalContract.ts";
import type { WorkspaceObject } from "./workspaceApprovedModelContract.ts";

export type WorkspaceRelationshipType =
  | "influences"
  | "depends_on"
  | "supports"
  | "constrains"
  | "feeds";

export type WorkspaceRelationshipRule = {
  sourceName: string;
  targetName: string;
  relationshipType: WorkspaceRelationshipType;
  reason: string;
  confidence: number;
};

export type WorkspaceRelationshipTypeRule = {
  sourceType: string;
  targetType: string;
  relationshipType: WorkspaceRelationshipType;
  reason: string;
  confidence: number;
};

const NAMED_RULES_BY_DOMAIN = Object.freeze({
    finance: Object.freeze([
      {
        sourceName: "revenue",
        targetName: "cash flow",
        relationshipType: "influences",
        reason: "Incoming revenue contributes directly to available operating cash.",
        confidence: 0.9,
      },
      {
        sourceName: "expenses",
        targetName: "cash flow",
        relationshipType: "influences",
        reason: "Operating expenses reduce available cash and shape liquidity pressure.",
        confidence: 0.88,
      },
      {
        sourceName: "forecast",
        targetName: "revenue",
        relationshipType: "feeds",
        reason: "Revenue forecasts inform expected inflows and planning assumptions.",
        confidence: 0.82,
      },
      {
        sourceName: "accounts receivable",
        targetName: "cash flow",
        relationshipType: "feeds",
        reason: "Collected receivables convert billed revenue into cash inflows.",
        confidence: 0.84,
      },
      {
        sourceName: "accounts payable",
        targetName: "cash flow",
        relationshipType: "constrains",
        reason: "Payables timing constrains when cash leaves the business.",
        confidence: 0.8,
      },
      {
        sourceName: "investments",
        targetName: "cash flow",
        relationshipType: "influences",
        reason: "Investment decisions affect cash deployment and future liquidity.",
        confidence: 0.74,
      },
    ]),
    manufacturing: Object.freeze([
      {
        sourceName: "suppliers",
        targetName: "inventory",
        relationshipType: "feeds",
        reason: "Supplier deliveries replenish inventory available for production.",
        confidence: 0.86,
      },
      {
        sourceName: "inventory",
        targetName: "production",
        relationshipType: "feeds",
        reason: "Production consumes inventory to fulfill operating throughput.",
        confidence: 0.88,
      },
      {
        sourceName: "production",
        targetName: "orders",
        relationshipType: "supports",
        reason: "Production capacity supports order fulfillment commitments.",
        confidence: 0.84,
      },
      {
        sourceName: "orders",
        targetName: "customers",
        relationshipType: "influences",
        reason: "Order delivery performance directly influences customer outcomes.",
        confidence: 0.8,
      },
      {
        sourceName: "quality",
        targetName: "production",
        relationshipType: "constrains",
        reason: "Quality standards constrain how production can run without rework.",
        confidence: 0.82,
      },
      {
        sourceName: "logistics",
        targetName: "inventory",
        relationshipType: "supports",
        reason: "Logistics moves inventory between locations to keep supply available.",
        confidence: 0.78,
      },
    ]),
    supply_chain: Object.freeze([
      {
        sourceName: "suppliers",
        targetName: "inventory",
        relationshipType: "feeds",
        reason: "Supplier reliability feeds inventory availability across the network.",
        confidence: 0.86,
      },
      {
        sourceName: "inventory",
        targetName: "orders",
        relationshipType: "supports",
        reason: "Inventory buffers support order fulfillment under demand variability.",
        confidence: 0.82,
      },
      {
        sourceName: "orders",
        targetName: "logistics",
        relationshipType: "feeds",
        reason: "Order volume feeds logistics workload and routing decisions.",
        confidence: 0.8,
      },
      {
        sourceName: "lead times",
        targetName: "inventory",
        relationshipType: "constrains",
        reason: "Lead time performance constrains how quickly inventory can be replenished.",
        confidence: 0.84,
      },
    ]),
    project_management: Object.freeze([
      {
        sourceName: "tasks",
        targetName: "milestones",
        relationshipType: "feeds",
        reason: "Completed tasks feed milestone progress and schedule confidence.",
        confidence: 0.86,
      },
      {
        sourceName: "resources",
        targetName: "tasks",
        relationshipType: "supports",
        reason: "Assigned resources support task execution and delivery pace.",
        confidence: 0.84,
      },
      {
        sourceName: "schedule",
        targetName: "milestones",
        relationshipType: "constrains",
        reason: "Schedule commitments constrain when milestones can realistically land.",
        confidence: 0.82,
      },
      {
        sourceName: "budget",
        targetName: "resources",
        relationshipType: "constrains",
        reason: "Budget limits constrain how many resources can be allocated to delivery work.",
        confidence: 0.8,
      },
      {
        sourceName: "risks",
        targetName: "schedule",
        relationshipType: "influences",
        reason: "Project risks influence whether the schedule stays achievable.",
        confidence: 0.78,
      },
    ]),
    operations: Object.freeze([
      {
        sourceName: "workflows",
        targetName: "capacity",
        relationshipType: "feeds",
        reason: "Workflow demand feeds how much capacity the operation must absorb.",
        confidence: 0.84,
      },
      {
        sourceName: "capacity",
        targetName: "service levels",
        relationshipType: "supports",
        reason: "Available capacity supports the service levels the operation can sustain.",
        confidence: 0.82,
      },
      {
        sourceName: "backlog",
        targetName: "service levels",
        relationshipType: "constrains",
        reason: "Backlog growth constrains how consistently service levels can be maintained.",
        confidence: 0.8,
      },
      {
        sourceName: "incidents",
        targetName: "workflows",
        relationshipType: "constrains",
        reason: "Incidents constrain normal workflow execution until response work completes.",
        confidence: 0.78,
      },
    ]),
    sales: Object.freeze([
      {
        sourceName: "pipeline",
        targetName: "forecast",
        relationshipType: "feeds",
        reason: "Pipeline movement feeds forecast confidence and expected revenue timing.",
        confidence: 0.86,
      },
      {
        sourceName: "opportunities",
        targetName: "pipeline",
        relationshipType: "feeds",
        reason: "Opportunity progression feeds the shape and health of the sales pipeline.",
        confidence: 0.84,
      },
      {
        sourceName: "accounts",
        targetName: "opportunities",
        relationshipType: "supports",
        reason: "Account relationships support opportunity creation and expansion.",
        confidence: 0.8,
      },
      {
        sourceName: "revenue",
        targetName: "forecast",
        relationshipType: "influences",
        reason: "Recent revenue performance influences forecast calibration.",
        confidence: 0.78,
      },
    ]),
    human_resources: Object.freeze([
      {
        sourceName: "hiring pipeline",
        targetName: "teams",
        relationshipType: "feeds",
        reason: "Hiring pipeline progress feeds team capacity over time.",
        confidence: 0.82,
      },
      {
        sourceName: "skills",
        targetName: "roles",
        relationshipType: "supports",
        reason: "Available skills support which roles teams can credibly cover.",
        confidence: 0.8,
      },
      {
        sourceName: "retention",
        targetName: "teams",
        relationshipType: "influences",
        reason: "Retention outcomes influence team stability and delivery continuity.",
        confidence: 0.78,
      },
    ]),
    technology: Object.freeze([
      {
        sourceName: "platforms",
        targetName: "services",
        relationshipType: "supports",
        reason: "Core platforms support the services built and operated on top of them.",
        confidence: 0.84,
      },
      {
        sourceName: "incidents",
        targetName: "services",
        relationshipType: "constrains",
        reason: "Incidents constrain service reliability until remediation completes.",
        confidence: 0.82,
      },
      {
        sourceName: "technical debt",
        targetName: "roadmap",
        relationshipType: "constrains",
        reason: "Technical debt constrains how aggressively the roadmap can advance.",
        confidence: 0.8,
      },
    ]),
    custom: Object.freeze([]),
  }) as Readonly<Partial<Record<WorkspaceDomainId, readonly WorkspaceRelationshipRule[]>>>;

const TYPE_PAIR_RULES: readonly WorkspaceRelationshipTypeRule[] = Object.freeze([
  {
    sourceType: "external_party",
    targetType: "resource",
    relationshipType: "feeds",
    reason: "External inputs feed internal resource availability.",
    confidence: 0.72,
  },
  {
    sourceType: "resource",
    targetType: "process",
    relationshipType: "feeds",
    reason: "Resources feed process execution and throughput.",
    confidence: 0.74,
  },
  {
    sourceType: "process",
    targetType: "demand",
    relationshipType: "supports",
    reason: "Operating processes support demand fulfillment.",
    confidence: 0.7,
  },
  {
    sourceType: "financial_stream",
    targetType: "financial_metric",
    relationshipType: "influences",
    reason: "Financial streams influence the metric they roll up into.",
    confidence: 0.76,
  },
  {
    sourceType: "planning_model",
    targetType: "financial_stream",
    relationshipType: "feeds",
    reason: "Planning models feed assumptions about future financial streams.",
    confidence: 0.72,
  },
  {
    sourceType: "work_item",
    targetType: "schedule_marker",
    relationshipType: "feeds",
    reason: "Work items feed progress toward schedule markers.",
    confidence: 0.72,
  },
  {
    sourceType: "constraint",
    targetType: "process",
    relationshipType: "constrains",
    reason: "Constraints limit how a process can operate.",
    confidence: 0.68,
  },
  {
    sourceType: "driver",
    targetType: "outcome",
    relationshipType: "influences",
    reason: "System drivers influence expected outcomes.",
    confidence: 0.66,
  },
]);

const GOAL_KEYWORD_RULES: ReadonlyArray<{
  keyword: string;
  relationshipType: WorkspaceRelationshipType;
  confidenceBoost: number;
}> = Object.freeze([
  { keyword: "cash", relationshipType: "influences", confidenceBoost: 0.04 },
  { keyword: "delivery", relationshipType: "supports", confidenceBoost: 0.03 },
  { keyword: "risk", relationshipType: "constrains", confidenceBoost: 0.03 },
  { keyword: "efficiency", relationshipType: "feeds", confidenceBoost: 0.02 },
]);

function normalizeToken(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeType(value: string): string {
  return value.trim().toLowerCase();
}

function findObjectByName(objects: readonly WorkspaceObject[], name: string): WorkspaceObject | null {
  const target = normalizeToken(name);
  const exact = objects.find((object) => normalizeToken(object.objectName) === target);
  if (exact) return exact;
  return objects.find((object) => normalizeToken(object.objectName).includes(target)) ?? null;
}

function findObjectByType(objects: readonly WorkspaceObject[], type: string): WorkspaceObject | null {
  const target = normalizeType(type);
  return objects.find((object) => normalizeType(object.objectType) === target) ?? null;
}

function goalKeywordBoost(
  goals: readonly WorkspaceGoal[],
  relationshipType: WorkspaceRelationshipType
): number {
  const goalText = goals.map((goal) => `${goal.goalName} ${goal.goalType}`).join(" ").toLowerCase();
  return GOAL_KEYWORD_RULES.reduce((boost, rule) => {
    if (!goalText.includes(rule.keyword)) return boost;
    if (rule.relationshipType !== relationshipType) return boost;
    return boost + rule.confidenceBoost;
  }, 0);
}

function situationKeywordBoost(situationText: string, sourceName: string, targetName: string): number {
  const text = situationText.toLowerCase();
  const source = sourceName.toLowerCase();
  const target = targetName.toLowerCase();
  if (text.includes(source) && text.includes(target)) return 0.03;
  if (text.includes(source) || text.includes(target)) return 0.015;
  return 0;
}

export type GeneratedWorkspaceRelationshipCandidate = {
  sourceObjectId: string;
  targetObjectId: string;
  sourceObjectName: string;
  targetObjectName: string;
  relationshipType: WorkspaceRelationshipType;
  reason: string;
  confidence: number;
  ruleId: string;
};

export function generateWorkspaceRelationshipCandidates(input: {
  domainId: WorkspaceDomainId;
  situationText: string;
  goals: readonly WorkspaceGoal[];
  objects: readonly WorkspaceObject[];
}): GeneratedWorkspaceRelationshipCandidate[] {
  if (input.objects.length < 2) return [];

  const candidates: GeneratedWorkspaceRelationshipCandidate[] = [];
  const seen = new Set<string>();

  const pushCandidate = (candidate: GeneratedWorkspaceRelationshipCandidate): void => {
    const key = `${candidate.sourceObjectId}->${candidate.targetObjectId}:${candidate.relationshipType}`;
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push(candidate);
  };

  const namedRules = NAMED_RULES_BY_DOMAIN[input.domainId] ?? [];
  for (const rule of namedRules) {
    const source = findObjectByName(input.objects, rule.sourceName);
    const target = findObjectByName(input.objects, rule.targetName);
    if (!source || !target || source.objectId === target.objectId) continue;
    pushCandidate({
      sourceObjectId: source.objectId,
      targetObjectId: target.objectId,
      sourceObjectName: source.objectName,
      targetObjectName: target.objectName,
      relationshipType: rule.relationshipType,
      reason: rule.reason,
      confidence: Math.min(
        0.95,
        rule.confidence +
          goalKeywordBoost(input.goals, rule.relationshipType) +
          situationKeywordBoost(input.situationText, source.objectName, target.objectName)
      ),
      ruleId: `named:${input.domainId}:${rule.sourceName}->${rule.targetName}:${rule.relationshipType}`,
    });
  }

  for (const rule of TYPE_PAIR_RULES) {
    const source = findObjectByType(input.objects, rule.sourceType);
    const target = findObjectByType(input.objects, rule.targetType);
    if (!source || !target || source.objectId === target.objectId) continue;
    pushCandidate({
      sourceObjectId: source.objectId,
      targetObjectId: target.objectId,
      sourceObjectName: source.objectName,
      targetObjectName: target.objectName,
      relationshipType: rule.relationshipType,
      reason: rule.reason,
      confidence: Math.min(
        0.9,
        rule.confidence +
          goalKeywordBoost(input.goals, rule.relationshipType) +
          situationKeywordBoost(input.situationText, source.objectName, target.objectName)
      ),
      ruleId: `type:${rule.sourceType}->${rule.targetType}:${rule.relationshipType}`,
    });
  }

  return candidates;
}
