/** ASSISTANT-3:4 — Exactly 40 immutable declarative validation rules. */
import { AssistantIntentDialogueModel } from "./assistantIntentDialogueModel.ts";
import type { AssistantIntentDialogueValidationRuleMetadata } from "./assistantIntentDialogueValidation.types.ts";

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
    "Status Metadata",
    "Version Metadata",
    "Tags Metadata",
    "Category And Description Metadata",
  ],
  [
    "No Runtime Behaviour",
    "No NLP Implementation",
    "No Intent Classification",
    "No AI Implementation",
    "No Persistence Networking Rendering Or UI",
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

export const AssistantIntentDialogueValidationRules:
readonly AssistantIntentDialogueValidationRuleMetadata[] = Object.freeze(
  rulesByCategory.flatMap((rules, categoryIndex) =>
    rules.map((name, ruleIndex) => {
      const index = categoryIndex * 5 + ruleIndex;
      return Object.freeze({
        ruleId: `ASSISTANT-3:4/Rule/${String(index + 1).padStart(2, "0")}`,
        name,
        description:
          `Declare ${name} for canonical Intent & Dialogue Model metadata.`,
        category: categories[categoryIndex],
        severity: categoryIndex === 6 ? "Critical" : "Error",
        validationTarget: AssistantIntentDialogueModel.identity.id,
        expectedResult: "Satisfied",
        order: index + 1,
        executable: false,
        metadataOnly: true,
        immutable: true,
      });
    }),
  ),
);

export const AssistantIntentDialogueValidationCategories = categories;

export const AssistantIntentDialogueValidationRuleMetadataCount =
  ruleMetadataFields.length;
