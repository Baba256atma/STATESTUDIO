/**
 * PHASE-2 / DS1:3 — Business Knowledge Layer contract.
 * Semantic vocabulary only — no AI, calculations, sync, or registry logic.
 */

import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_MINIMUM_OVERALL_SCORE,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import type {
  BusinessKnowledgeArtifactRecord,
  BusinessKnowledgeCategory,
  BusinessKnowledgeConceptType,
  BusinessKnowledgeLifecycleState,
  BusinessKnowledgeMetadata,
  BusinessKnowledgeOwnershipContract,
  BusinessKnowledgeRelationshipRecord,
  BusinessKnowledgeScoreDimensions,
  BusinessKnowledgeSecurityProfile,
  BusinessKnowledgeValidationIssue,
  BusinessKnowledgeValidationResult,
  BusinessKnowledgeWorkspaceId,
} from "./businessKnowledgeLayerTypes.ts";

export const BUSINESS_KNOWLEDGE_LAYER_VERSION = "PHASE-2/DS1:3" as const;
export const BUSINESS_KNOWLEDGE_LAYER_SOURCE = "phase-2-business-knowledge-layer" as const;
export const NEXORA_BUSINESS_KNOWLEDGE_LAYER_LOG_PREFIX = "[NexoraBusinessKnowledgeLayer]" as const;

export const BUSINESS_KNOWLEDGE_LAYER_TAGS = Object.freeze([
  "[DS13_BUSINESS_KNOWLEDGE]",
  "[SEMANTIC_VOCABULARY_DEFINED]",
  "[WORKSPACE_KNOWLEDGE_OWNED]",
  "[DS14_READY]",
] as const);

export const BUSINESS_KNOWLEDGE_LAYER_FREEZE_TAGS = Object.freeze([
  "[DS1_3_CERTIFIED]",
  "[BUSINESS_KNOWLEDGE_LAYER_FROZEN]",
  "[PHASE2_DS1_3_COMPLETE]",
] as const);

export const BUSINESS_KNOWLEDGE_CONCEPT_TYPES = Object.freeze([
  "business_domain",
  "department",
  "business_function",
  "process",
  "activity",
  "kpi_definition",
  "risk_definition",
  "resource",
  "stakeholder",
  "business_entity",
  "business_term",
  "business_rule",
] as const satisfies readonly BusinessKnowledgeConceptType[]);

export const BUSINESS_KNOWLEDGE_CATEGORIES = Object.freeze([
  "organization",
  "operations",
  "performance",
  "governance",
  "vocabulary",
  "custom",
] as const satisfies readonly BusinessKnowledgeCategory[]);

export const BUSINESS_KNOWLEDGE_LIFECYCLE_STATES = Object.freeze([
  "draft",
  "defined",
  "reviewed",
  "published",
  "deprecated",
  "archived",
] as const satisfies readonly BusinessKnowledgeLifecycleState[]);

export const BUSINESS_KNOWLEDGE_RELATIONSHIP_TYPES = Object.freeze([
  "contains",
  "part_of",
  "measures",
  "applies_to",
  "defines",
  "owned_by",
  "references",
  "related_to",
  "custom",
] as const);

export const BUSINESS_KNOWLEDGE_MUST_NOT_OWN = Object.freeze([
  "ai_reasoning",
  "recommendations",
  "kpi_calculations",
  "risk_calculations",
  "scenario_generation",
  "object_creation",
  "relationship_discovery",
  "parsing",
  "upload",
  "synchronization",
  "registry_runtime",
  "dashboard_rendering",
  "assistant_logic",
] as const);

export const BUSINESS_KNOWLEDGE_CONCEPT_HIERARCHY = Object.freeze({
  business_domain: Object.freeze(["department", "business_function", "process"]),
  department: Object.freeze(["stakeholder", "resource"]),
  business_function: Object.freeze(["process", "activity"]),
  process: Object.freeze(["activity", "kpi_definition", "risk_definition"]),
  activity: Object.freeze(["business_rule", "resource"]),
  kpi_definition: Object.freeze([]),
  risk_definition: Object.freeze([]),
  resource: Object.freeze([]),
  stakeholder: Object.freeze([]),
  business_entity: Object.freeze(["business_term"]),
  business_term: Object.freeze([]),
  business_rule: Object.freeze([]),
} as const satisfies Readonly<Record<BusinessKnowledgeConceptType, readonly BusinessKnowledgeConceptType[]>>);

export const BUSINESS_KNOWLEDGE_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "data-sources/",
  "dataSourceRegistryRuntime",
  "workspace/workspaceDataSourceRegistry.ts",
  "workspaceRegistryStore",
  "dashboardIntelligence/",
  "executiveIntelligencePlatform/",
  "workspaceKpiCalculationEngine",
  "workspaceRiskDetectionEngine",
  "workspaceScenarioSimulationEngine",
  "assistantRuntime",
  "InputCenter",
  "RightPanelHost",
  "RelationshipRenderer",
  "executiveBusinessDataSourceContract.ts",
  "workspaceDataSourceRegistryAdapterContract.ts",
] as const);

export const BUSINESS_KNOWLEDGE_DEFAULT_SECURITY_PROFILE = Object.freeze({
  classification: "internal",
  crossWorkspaceAccess: false,
} satisfies BusinessKnowledgeSecurityProfile);

export const BUSINESS_KNOWLEDGE_LAYER_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-2/DS1:3",
  title: "Business Knowledge Layer",
  goal: "Library-only semantic vocabulary explaining business meaning of data sources.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/businessKnowledge/businessKnowledgeLayerTypes.ts",
    "frontend/app/lib/businessKnowledge/businessKnowledgeLayerContract.ts",
    "frontend/app/lib/businessKnowledge/businessKnowledgeLayerDiagnostics.ts",
    "frontend/app/lib/businessKnowledge/businessKnowledgeLayerCertification.ts",
    "frontend/app/lib/businessKnowledge/businessKnowledgeLayerCertification.test.ts",
    "docs/ds1-3-build-report.md",
    "docs/ds1-3-analysis-report.md",
    "docs/ds1-3-freeze-report.md",
  ]),
  forbiddenPatterns: BUSINESS_KNOWLEDGE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["DS1:1", "DS1:2", "STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: BUSINESS_KNOWLEDGE_LAYER_TAGS,
} satisfies StageManifest);

export const BUSINESS_KNOWLEDGE_LAYER_MODULE_PATHS = Object.freeze(
  BUSINESS_KNOWLEDGE_LAYER_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const CONCEPT_SET = new Set<string>(BUSINESS_KNOWLEDGE_CONCEPT_TYPES);
const CATEGORY_SET = new Set<string>(BUSINESS_KNOWLEDGE_CATEGORIES);
const LIFECYCLE_SET = new Set<string>(BUSINESS_KNOWLEDGE_LIFECYCLE_STATES);
const RELATIONSHIP_SET = new Set<string>(BUSINESS_KNOWLEDGE_RELATIONSHIP_TYPES);

const CONCEPT_CATEGORY_MAP: Readonly<Record<BusinessKnowledgeConceptType, BusinessKnowledgeCategory>> = Object.freeze({
  business_domain: "organization",
  department: "organization",
  business_function: "organization",
  process: "operations",
  activity: "operations",
  kpi_definition: "performance",
  risk_definition: "governance",
  resource: "operations",
  stakeholder: "organization",
  business_entity: "vocabulary",
  business_term: "vocabulary",
  business_rule: "governance",
});

const EXAMPLE_TS = "2026-06-22T00:00:00.000Z";

function issue(code: string, message: string): BusinessKnowledgeValidationIssue {
  return Object.freeze({ code, message });
}

export function computeBusinessKnowledgeLayerOverallScore(dimensions: BusinessKnowledgeScoreDimensions): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsBusinessKnowledgeLayerMinimumScore(overall: number): boolean {
  return overall >= STAGE_MINIMUM_OVERALL_SCORE;
}

export function resolveBusinessKnowledgeCategoryForConcept(
  conceptType: BusinessKnowledgeConceptType
): BusinessKnowledgeCategory {
  return CONCEPT_CATEGORY_MAP[conceptType];
}

export function buildBusinessKnowledgeOwnershipContract(
  record: Pick<BusinessKnowledgeArtifactRecord, "knowledgeArtifactId" | "workspaceId">
): BusinessKnowledgeOwnershipContract {
  return Object.freeze({
    knowledgeArtifactId: record.knowledgeArtifactId.trim(),
    workspaceId: record.workspaceId.trim(),
    isolationPolicy: "workspace-exclusive",
  });
}

export function validateBusinessKnowledgeOwnership(input: {
  record: Pick<BusinessKnowledgeArtifactRecord, "knowledgeArtifactId" | "workspaceId">;
  expectedWorkspaceId?: BusinessKnowledgeWorkspaceId | null;
}): BusinessKnowledgeValidationResult {
  const issues: BusinessKnowledgeValidationIssue[] = [];
  const workspaceId = input.record.workspaceId?.trim() ?? "";
  const knowledgeArtifactId = input.record.knowledgeArtifactId?.trim() ?? "";
  if (!workspaceId) issues.push(issue("missing_workspace_id", "Knowledge artifact requires workspaceId."));
  if (!knowledgeArtifactId) issues.push(issue("missing_artifact_id", "Knowledge artifact requires knowledgeArtifactId."));
  if (input.expectedWorkspaceId?.trim() && workspaceId && input.expectedWorkspaceId.trim() !== workspaceId) {
    issues.push(issue("workspace_mismatch", "Knowledge workspaceId does not match expected workspace."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateBusinessKnowledgeRelationshipRecord(
  input: Partial<BusinessKnowledgeRelationshipRecord>
): BusinessKnowledgeValidationResult {
  const issues: BusinessKnowledgeValidationIssue[] = [
    ...validateBusinessKnowledgeOwnership({
      record: { knowledgeArtifactId: input.fromArtifactId ?? "", workspaceId: input.workspaceId ?? "" },
    }).issues,
  ];
  if (!input.toArtifactId?.trim()) issues.push(issue("missing_to_artifact", "Relationship requires toArtifactId."));
  if (!input.fromArtifactId?.trim()) issues.push(issue("missing_from_artifact", "Relationship requires fromArtifactId."));
  if (input.relationshipType && !RELATIONSHIP_SET.has(input.relationshipType)) {
    issues.push(issue("invalid_relationship_type", `Unsupported relationship "${input.relationshipType}".`));
  }
  if (input.fromArtifactId?.trim() && input.toArtifactId?.trim() && input.fromArtifactId === input.toArtifactId) {
    issues.push(issue("self_relationship", "Relationship cannot link an artifact to itself."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateBusinessKnowledgeArtifactRecord(
  input: Partial<BusinessKnowledgeArtifactRecord>
): BusinessKnowledgeValidationResult {
  const issues = [
    ...validateBusinessKnowledgeOwnership({
      record: { knowledgeArtifactId: input.knowledgeArtifactId ?? "", workspaceId: input.workspaceId ?? "" },
    }).issues,
  ];
  if (!input.displayName?.trim()) issues.push(issue("missing_display_name", "displayName is required."));
  if (!input.description?.trim()) issues.push(issue("missing_description", "description is required for semantic definition."));
  if (input.conceptType && !CONCEPT_SET.has(input.conceptType)) {
    issues.push(issue("invalid_concept_type", `Unsupported concept "${input.conceptType}".`));
  }
  if (input.knowledgeCategory && !CATEGORY_SET.has(input.knowledgeCategory)) {
    issues.push(issue("invalid_category", `Unsupported category "${input.knowledgeCategory}".`));
  }
  if (input.lifecycleState && !LIFECYCLE_SET.has(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle", `Unsupported lifecycle "${input.lifecycleState}".`));
  }
  if (input.securityProfile?.crossWorkspaceAccess !== undefined && input.securityProfile.crossWorkspaceAccess !== false) {
    issues.push(issue("invalid_security", "crossWorkspaceAccess must remain false."));
  }
  if (input.source && input.source !== BUSINESS_KNOWLEDGE_LAYER_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-2-business-knowledge-layer."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function exampleMetadata(conceptType: BusinessKnowledgeConceptType): BusinessKnowledgeMetadata {
  return Object.freeze({
    owner: "Executive Steward",
    tags: Object.freeze(["example", conceptType]),
    definitionSource: "DS1:3 semantic example",
  });
}

export function resolveBusinessKnowledgeConceptExample(
  conceptType: BusinessKnowledgeConceptType
): BusinessKnowledgeArtifactRecord {
  const labels: Record<BusinessKnowledgeConceptType, [string, string]> = {
    business_domain: ["Supply Chain Operations", "Top-level domain for logistics and fulfillment."],
    department: ["Logistics Department", "Organizational unit responsible for distribution."],
    business_function: ["Demand Planning", "Capability for forecasting customer demand."],
    process: ["Order Fulfillment", "End-to-end process from order to delivery."],
    activity: ["Pick and Pack", "Warehouse activity preparing orders for shipment."],
    kpi_definition: ["On-Time Delivery Rate", "Percentage of orders delivered by promise date — definition only."],
    risk_definition: ["Supplier Concentration", "Risk of single-source supplier dependency — definition only."],
    resource: ["Warehouse Capacity", "Available storage and throughput capacity."],
    stakeholder: ["Regional Distribution Manager", "Role accountable for regional delivery performance."],
    business_entity: ["Customer Account", "Named business entity in commercial operations."],
    business_term: ["Lead Time", "Elapsed time from order placement to delivery."],
    business_rule: ["VP Approval Threshold", "Orders over $50K require VP approval — declarative rule."],
  };
  const [displayName, description] = labels[conceptType];
  return Object.freeze({
    contractVersion: BUSINESS_KNOWLEDGE_LAYER_VERSION,
    knowledgeArtifactId: `bkl-example-${conceptType}`,
    workspaceId: "workspace-example-001",
    conceptType,
    knowledgeCategory: resolveBusinessKnowledgeCategoryForConcept(conceptType),
    displayName,
    description,
    lifecycleState: "defined",
    metadata: exampleMetadata(conceptType),
    bindings: Object.freeze({
      businessDataSourceIds: Object.freeze(["ebds-example-operational"]),
      adapterLinkIds: Object.freeze(["wra-example-operational"]),
      primaryBusinessDomain: "operational",
    }),
    securityProfile: BUSINESS_KNOWLEDGE_DEFAULT_SECURITY_PROFILE,
    createdAt: EXAMPLE_TS,
    updatedAt: EXAMPLE_TS,
    source: BUSINESS_KNOWLEDGE_LAYER_SOURCE,
  });
}

export const BUSINESS_KNOWLEDGE_CONCEPT_EXAMPLES = Object.freeze(
  Object.fromEntries(
    BUSINESS_KNOWLEDGE_CONCEPT_TYPES.map((conceptType) => [
      conceptType,
      resolveBusinessKnowledgeConceptExample(conceptType),
    ])
  ) as Record<BusinessKnowledgeConceptType, BusinessKnowledgeArtifactRecord>
);

export function resolveBusinessKnowledgeRelationshipExample(): BusinessKnowledgeRelationshipRecord {
  return Object.freeze({
    relationshipId: "bkl-rel-example-001",
    workspaceId: "workspace-example-001",
    fromArtifactId: "bkl-example-process",
    toArtifactId: "bkl-example-activity",
    relationshipType: "contains",
    createdAt: EXAMPLE_TS,
  });
}
