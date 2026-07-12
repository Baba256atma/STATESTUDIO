import type {
  WorkflowCapability,
  WorkflowMetadata,
  WorkflowPublicApi,
} from "./workflowIntelligenceTypes.ts";
import { WorkflowIntelligenceIdentity } from "./workflowIntelligenceIdentity.ts";

const workflowMetadata = Object.freeze({
  platformId: WorkflowIntelligenceIdentity.platformId,
  platformVersion: WorkflowIntelligenceIdentity.platformVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  sourceDependencies: Object.freeze(["OPS-1:9", "OPS-2:9"]),
  tags: Object.freeze(["ops", "workflow-intelligence", "metadata-only"]),
} as const satisfies WorkflowMetadata);

export const ExecutiveWorkflowContract = Object.freeze({
  id: "workflow-executive",
  name: "Executive Workflow",
  description: "Canonical metadata contract for executive-level workflow definitions.",
  category: "Executive",
  status: "Defined",
  stage: "Defined",
  trigger: "DecisionTrigger",
  approval: "MultiApproval",
  metadata: workflowMetadata,
} as const satisfies WorkflowCapability);

export const OperationalWorkflowContract = Object.freeze({
  id: "workflow-operational",
  name: "Operational Workflow",
  description: "Canonical metadata contract for operational workflow definitions.",
  category: "Operational",
  status: "Defined",
  stage: "Sequenced",
  trigger: "ManualTrigger",
  approval: "NoApproval",
  metadata: workflowMetadata,
} as const satisfies WorkflowCapability);

export const ApprovalWorkflowContract = Object.freeze({
  id: "workflow-approval",
  name: "Approval Workflow",
  description: "Canonical metadata contract for approval-oriented workflow definitions.",
  category: "Approval",
  status: "Defined",
  stage: "Approved",
  trigger: "ApprovalTrigger",
  approval: "SingleApproval",
  metadata: workflowMetadata,
} as const satisfies WorkflowCapability);

export const ReviewWorkflowContract = Object.freeze({
  id: "workflow-review",
  name: "Review Workflow",
  description: "Canonical metadata contract for review-oriented workflow definitions.",
  category: "Review",
  status: "Defined",
  stage: "Ready",
  trigger: "ManualTrigger",
  approval: "SingleApproval",
  metadata: workflowMetadata,
} as const satisfies WorkflowCapability);

export const EscalationWorkflowContract = Object.freeze({
  id: "workflow-escalation",
  name: "Escalation Workflow",
  description: "Canonical metadata contract for escalation workflow definitions.",
  category: "Escalation",
  status: "Defined",
  stage: "Ready",
  trigger: "DecisionTrigger",
  approval: "MultiApproval",
  metadata: workflowMetadata,
} as const satisfies WorkflowCapability);

export const AutomatedWorkflowContract = Object.freeze({
  id: "workflow-automated",
  name: "Automated Workflow",
  description: "Canonical metadata contract for automated workflow definitions.",
  category: "Automated",
  status: "Defined",
  stage: "Cataloged",
  trigger: "ScheduleTrigger",
  approval: "NoApproval",
  metadata: workflowMetadata,
} as const satisfies WorkflowCapability);

export const ManualWorkflowContract = Object.freeze({
  id: "workflow-manual",
  name: "Manual Workflow",
  description: "Canonical metadata contract for manual workflow definitions.",
  category: "Manual",
  status: "Defined",
  stage: "Cataloged",
  trigger: "ManualTrigger",
  approval: "NoApproval",
  metadata: workflowMetadata,
} as const satisfies WorkflowCapability);

export const WorkflowIntelligenceContracts = Object.freeze({
  executive: ExecutiveWorkflowContract,
  operational: OperationalWorkflowContract,
  approval: ApprovalWorkflowContract,
  review: ReviewWorkflowContract,
  escalation: EscalationWorkflowContract,
  automated: AutomatedWorkflowContract,
  manual: ManualWorkflowContract,
  all: Object.freeze([
    ExecutiveWorkflowContract,
    OperationalWorkflowContract,
    ApprovalWorkflowContract,
    ReviewWorkflowContract,
    EscalationWorkflowContract,
    AutomatedWorkflowContract,
    ManualWorkflowContract,
  ]),
} as const);

export const WorkflowIntelligencePublicApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveWorkflowIntelligenceFoundation",
    exportPath: "./workflowIntelligenceIndex.ts",
    kind: "Object",
    stability: "Stable",
    description: "Immutable namespace for workflow intelligence foundation.",
  } as const satisfies WorkflowPublicApi),
  Object.freeze({
    name: "buildWorkflowIntelligenceManifest",
    exportPath: "./workflowIntelligenceIndex.ts",
    kind: "Function",
    stability: "Stable",
    description: "Deterministic manifest builder for workflow intelligence metadata.",
  } as const satisfies WorkflowPublicApi),
  Object.freeze({
    name: "validateWorkflowIntelligenceFoundation",
    exportPath: "./workflowIntelligenceIndex.ts",
    kind: "Function",
    stability: "Stable",
    description: "Architectural integrity validator for workflow intelligence metadata.",
  } as const satisfies WorkflowPublicApi),
] as const);
