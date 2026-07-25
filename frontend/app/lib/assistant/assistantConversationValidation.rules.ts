/** ASSISTANT-1:4 — Exactly 40 immutable declarative validation rules. */
import { AssistantConversationModel } from "./assistantConversationModel.ts";
import type { AssistantConversationValidationRuleMetadata } from "./assistantConversationValidation.types.ts";

const rulesByCategory = Object.freeze([
  ["Canonical IDs", "Unique Identities", "Stable Identifiers", "Namespace Correctness", "Version Consistency"],
  ["Model Completeness", "Required Metadata", "Parent Child Relationships", "Lifecycle References", "Relationship Integrity"],
  ["Registry References", "Canonical Vocabulary Usage", "Missing Registry Entries", "Duplicate Registry References", "Registry Identity Stability"],
  ["Relationship Direction", "Circular Dependency Absence", "Valid References", "No Orphan Models", "Explicit Relationship Types"],
  ["Valid Lifecycle States", "Transition Definitions", "Completion State", "Archive State", "Lifecycle Ordering"],
  ["Required Fields", "Status Metadata", "Version Metadata", "Tags Metadata", "Category Consistency"],
  ["No Runtime Logic", "No AI Implementation", "No Persistence", "No Networking Or UI", "No Rendering Or Execution"],
  ["Public Exports", "Export Uniqueness", "Immutable Exports", "Naming Consistency", "Dependency Safety"],
] as const);

const categories = Object.freeze([
  "Identity Validation",
  "Structure Validation",
  "Registry Validation",
  "Relationship Validation",
  "Lifecycle Validation",
  "Metadata Validation",
  "Boundary Validation",
  "Export Validation",
] as const);

export const AssistantConversationValidationRules:
readonly AssistantConversationValidationRuleMetadata[] = Object.freeze(
  rulesByCategory.flatMap((rules, categoryIndex) =>
    rules.map((name, ruleIndex) => {
      const index = categoryIndex * 5 + ruleIndex;
      return Object.freeze({
        ruleId: `ASSISTANT-1:4/Rule/${String(index + 1).padStart(2, "0")}`,
        name,
        description: `Declare ${name} for canonical Conversation Model metadata.`,
        category: categories[categoryIndex],
        severity: categoryIndex === 6 ? "Critical" : "Error",
        validationTarget: AssistantConversationModel.identity.id,
        expectedResult: "Satisfied",
        order: index + 1,
        executable: false,
        metadataOnly: true,
        immutable: true,
      });
    }),
  ),
);

export const AssistantConversationValidationCategories = categories;
