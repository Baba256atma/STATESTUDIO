import type {
  ProjectModelMetadata,
  ProjectPhaseDescriptor,
} from "./projectModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-4:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze([
    "OPS-1:9",
    "OPS-2:9",
    "OPS-3:9",
    "OPS-4:1",
    "OPS-4:2",
  ]),
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ProjectModelMetadata);

export const ProjectPhaseModel = Object.freeze([
  Object.freeze({
    phaseId: "phase-initiation",
    phaseName: "Initiation",
    phaseCategory: "Definition",
    expectedWorkflows: Object.freeze(["workflow-executive"]),
    expectedMilestones: Object.freeze(["milestone-charter-approved"]),
    metadata,
  }),
  Object.freeze({
    phaseId: "phase-planning",
    phaseName: "Planning",
    phaseCategory: "Structuring",
    expectedWorkflows: Object.freeze(["workflow-operational", "workflow-review"]),
    expectedMilestones: Object.freeze(["milestone-plan-baselined"]),
    metadata,
  }),
  Object.freeze({
    phaseId: "phase-execution-design",
    phaseName: "Execution Design",
    phaseCategory: "Sequencing",
    expectedWorkflows: Object.freeze(["workflow-approval", "workflow-escalation"]),
    expectedMilestones: Object.freeze(["milestone-design-approved"]),
    metadata,
  }),
  Object.freeze({
    phaseId: "phase-readiness",
    phaseName: "Readiness",
    phaseCategory: "Readiness",
    expectedWorkflows: Object.freeze(["workflow-review"]),
    expectedMilestones: Object.freeze(["milestone-readiness-confirmed"]),
    metadata,
  }),
  Object.freeze({
    phaseId: "phase-closure-definition",
    phaseName: "Closure Definition",
    phaseCategory: "Cataloging",
    expectedWorkflows: Object.freeze(["workflow-manual"]),
    expectedMilestones: Object.freeze(["milestone-closeout-documented"]),
    metadata,
  }),
] as const satisfies readonly ProjectPhaseDescriptor[]);

