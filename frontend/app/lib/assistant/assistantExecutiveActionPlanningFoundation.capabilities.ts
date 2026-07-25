/** ASSISTANT-7:1 — Exactly 12 immutable capability declarations. */
import type { AssistantExecutiveActionPlanningCapabilityMetadata } from "./assistantExecutiveActionPlanningFoundation.types.ts";

const declarations = Object.freeze([
  {
    name: "Executive Objective Awareness",
    description: "Awareness of Action Objectives as architectural metadata.",
    category: "Objective Awareness",
    architecturalResponsibility: "Action Objective",
    supportedConcepts: Object.freeze(["Action Objective", "Action Plan"]),
    boundaryReference: "ASSISTANT-7:1/Boundary/01",
  },
  {
    name: "Action Plan Awareness",
    description: "Awareness of Action Plan identity and classification metadata.",
    category: "Plan Awareness",
    architecturalResponsibility: "Action Plan",
    supportedConcepts: Object.freeze(["Action Plan", "Action Planning Context"]),
    boundaryReference: "ASSISTANT-7:1/Boundary/01",
  },
  {
    name: "Planned Action Awareness",
    description: "Awareness of Planned Action vocabulary metadata.",
    category: "Action Awareness",
    architecturalResponsibility: "Planned Action",
    supportedConcepts: Object.freeze(["Planned Action", "Action Plan"]),
    boundaryReference: "ASSISTANT-7:1/Boundary/01",
  },
  {
    name: "Action Sequence Awareness",
    description: "Awareness of descriptive action ordering metadata.",
    category: "Sequence Awareness",
    architecturalResponsibility: "Action Sequence",
    supportedConcepts: Object.freeze(["Action Sequence", "Planned Action"]),
    boundaryReference: "ASSISTANT-7:1/Boundary/01",
  },
  {
    name: "Action Dependency Awareness",
    description: "Awareness of descriptive dependency relationship metadata.",
    category: "Dependency Awareness",
    architecturalResponsibility: "Action Dependency",
    supportedConcepts: Object.freeze(["Action Dependency", "Planned Action"]),
    boundaryReference: "ASSISTANT-7:1/Boundary/01",
  },
  {
    name: "Action Priority Awareness",
    description: "Awareness of priority classification metadata.",
    category: "Priority Awareness",
    architecturalResponsibility: "Action Priority",
    supportedConcepts: Object.freeze(["Action Priority"]),
    boundaryReference: "ASSISTANT-7:1/Boundary/01",
  },
  {
    name: "Action Ownership Awareness",
    description: "Awareness of immutable owner reference metadata.",
    category: "Ownership Awareness",
    architecturalResponsibility: "Action Owner Reference",
    supportedConcepts: Object.freeze(["Action Owner Reference"]),
    boundaryReference: "ASSISTANT-7:1/Boundary/06",
  },
  {
    name: "Action Timing Awareness",
    description: "Awareness of descriptive time horizon metadata.",
    category: "Timing Awareness",
    architecturalResponsibility: "Action Time Horizon",
    supportedConcepts: Object.freeze(["Action Time Horizon"]),
    boundaryReference: "ASSISTANT-7:1/Boundary/05",
  },
  {
    name: "Milestone Awareness",
    description: "Awareness of descriptive milestone metadata.",
    category: "Milestone Awareness",
    architecturalResponsibility: "Action Milestone",
    supportedConcepts: Object.freeze(["Action Milestone"]),
    boundaryReference: "ASSISTANT-7:1/Boundary/05",
  },
  {
    name: "Constraint and Risk Awareness",
    description: "Awareness of constraint and risk reference metadata.",
    category: "Constraint Awareness",
    architecturalResponsibility: "Action Constraint",
    supportedConcepts: Object.freeze([
      "Action Constraint",
      "Action Risk Reference",
    ]),
    boundaryReference: "ASSISTANT-7:1/Boundary/04",
  },
  {
    name: "Cross-Workspace Planning Awareness",
    description:
      "Awareness of workspace-referenced planning context metadata.",
    category: "Workspace Awareness",
    architecturalResponsibility: "Action Planning Context",
    supportedConcepts: Object.freeze(["Action Planning Context"]),
    boundaryReference: "ASSISTANT-7:1/Boundary/03",
  },
  {
    name: "Action Planning Traceability",
    description:
      "Awareness of traceability across planning metadata identities.",
    category: "Traceability",
    architecturalResponsibility: "Action Planning Metadata",
    supportedConcepts: Object.freeze([
      "Action Plan",
      "Action Planning Context",
      "Action Outcome",
    ]),
    boundaryReference: "ASSISTANT-7:1/Boundary/12",
  },
] as const);

export const AssistantExecutiveActionPlanningFoundationCapabilities:
readonly AssistantExecutiveActionPlanningCapabilityMetadata[] = Object.freeze(
  declarations.map((declaration, index) => Object.freeze({
    id: `ASSISTANT-7:1/Capability/${String(index + 1).padStart(2, "0")}`,
    name: declaration.name,
    description: declaration.description,
    category: declaration.category,
    architecturalResponsibility: declaration.architecturalResponsibility,
    supportedConcepts: declaration.supportedConcepts,
    boundaryReference: declaration.boundaryReference,
    lifecycleReference: "ASSISTANT-7:1/Lifecycle",
    version: "1.0.0",
    status: "Declared",
    order: index + 1,
    implemented: false,
    metadataOnly: true,
    immutable: true,
  })),
);
