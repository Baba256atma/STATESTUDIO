/** ASSISTANT-7:4 — Exactly 40 immutable declarative validation rules. */
import { AssistantExecutiveActionPlanningModel } from "./assistantExecutiveActionPlanningModel.ts";
import type { AssistantExecutiveActionPlanningValidationRuleMetadata } from "./assistantExecutiveActionPlanningValidation.types.ts";

const rulesByCategory = Object.freeze([
  [
    "Canonical IDs",
    "Namespace Integrity",
    "Version Consistency",
    "Stable Identities",
    "Unique Identifiers",
  ],
  [
    "Registry References",
    "Canonical Vocabularies",
    "Missing Registry Entries",
    "Duplicate Registry References",
    "Registry Identity Stability",
  ],
  [
    "Domain Model Completeness",
    "Required Model Metadata",
    "Model Consistency",
    "Structural Integrity",
    "Model Uniqueness",
  ],
  [
    "Relationship Integrity",
    "Parent Child Relationships",
    "Reference Validity",
    "Circular Dependency Detection",
    "Orphan Model Detection",
  ],
  [
    "Lifecycle Definition",
    "Lifecycle References",
    "Transition Completeness",
    "Terminal States",
    "Lifecycle Consistency",
  ],
  [
    "Required Metadata Fields",
    "Status Version And Tags Metadata",
    "Category And Description Metadata",
    "Immutable Collections",
    "Dynamic Inventory Counts",
  ],
  [
    "No Runtime Behaviour",
    "No Planning Engine Or Task Execution",
    "No Scheduling Or Assignment",
    "No Workflow Automation Or Persistence",
    "No Networking Rendering UI Or AI",
  ],
  [
    "Public Exports",
    "Export Uniqueness",
    "Immutable Exports",
    "Naming Consistency",
    "Deterministic Ordering",
  ],
] as const);

const categories = Object.freeze([
  "Identity Validation",
  "Registry Validation",
  "Model Validation",
  "Relationship Validation",
  "Lifecycle Validation",
  "Metadata Validation",
  "Boundary Validation",
  "Export Validation",
] as const);

const ruleMetadataFields = Object.freeze([
  "ruleId",
  "name",
  "description",
  "category",
  "severity",
  "validationTarget",
  "expectedResult",
] as const);

export const AssistantExecutiveActionPlanningValidationRules:
readonly AssistantExecutiveActionPlanningValidationRuleMetadata[] =
  Object.freeze(
    rulesByCategory.flatMap((rules, categoryIndex) =>
      rules.map((name, ruleIndex) => {
        const index = categoryIndex * 5 + ruleIndex;
        return Object.freeze({
          ruleId: `ASSISTANT-7:4/Rule/${String(index + 1).padStart(2, "0")}`,
          name,
          description:
            `Declare ${name} for canonical Executive Action Planning Model metadata.`,
          category: categories[categoryIndex],
          severity: categoryIndex === 6 ? "Critical" : "Error",
          validationTarget:
            AssistantExecutiveActionPlanningModel.identity.id,
          expectedResult: "Satisfied",
          order: index + 1,
          executable: false,
          metadataOnly: true,
          immutable: true,
        });
      }),
    ),
  );

export const AssistantExecutiveActionPlanningValidationCategories =
  categories;

export const AssistantExecutiveActionPlanningValidationRuleMetadataCount =
  ruleMetadataFields.length;
