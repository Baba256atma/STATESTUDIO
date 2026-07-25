/** ASSISTANT-2:4 — Exactly 40 immutable declarative validation rules. */
import { AssistantExecutiveMemoryModel } from "./assistantExecutiveMemoryModel.ts";
import type { AssistantExecutiveMemoryValidationRuleMetadata } from "./assistantExecutiveMemoryValidation.types.ts";

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
    "Duplicate Registry Entries",
    "Registry Identity Stability",
  ],
  [
    "Domain Model Completeness",
    "Required Model Metadata",
    "Model Consistency",
    "Model Uniqueness",
    "Structural Integrity",
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
    "Lifecycle Ordering",
  ],
  [
    "Required Metadata Fields",
    "Version Metadata",
    "Status Metadata",
    "Tags Metadata",
    "Category And Description Metadata",
  ],
  [
    "No Runtime Behaviour",
    "No Persistence",
    "No Retrieval Logic",
    "No Database Vector Or Embeddings",
    "No AI Networking Rendering Or UI",
  ],
  [
    "Public Exports",
    "Export Uniqueness",
    "Immutable Exports",
    "Naming Consistency",
    "Export Dependency Safety",
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

export const AssistantExecutiveMemoryValidationRules:
readonly AssistantExecutiveMemoryValidationRuleMetadata[] = Object.freeze(
  rulesByCategory.flatMap((rules, categoryIndex) =>
    rules.map((name, ruleIndex) => {
      const index = categoryIndex * 5 + ruleIndex;
      return Object.freeze({
        ruleId: `ASSISTANT-2:4/Rule/${String(index + 1).padStart(2, "0")}`,
        name,
        description:
          `Declare ${name} for canonical Executive Memory Model metadata.`,
        category: categories[categoryIndex],
        severity: categoryIndex === 6 ? "Critical" : "Error",
        validationTarget: AssistantExecutiveMemoryModel.identity.id,
        expectedResult: "Satisfied",
        order: index + 1,
        executable: false,
        metadataOnly: true,
        immutable: true,
      });
    }),
  ),
);

export const AssistantExecutiveMemoryValidationCategories = categories;

export const AssistantExecutiveMemoryValidationRuleMetadataCount =
  ruleMetadataFields.length;
