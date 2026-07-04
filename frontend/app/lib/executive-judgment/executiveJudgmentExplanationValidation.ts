import type { StructuredExecutiveJudgmentExplanation } from "./executiveJudgmentExplanationBuilder.ts";
import { getExecutiveJudgmentExplanationRegistry } from "./executiveJudgmentExplanationRegistry.ts";

export type ExecutiveJudgmentExplanationValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    field: string;
    message: string;
  }>[];
}>;

function issue(code: string, field: string, message: string) {
  return Object.freeze({ code, field, message });
}

export function validateExecutiveJudgmentExplanation(explanation: StructuredExecutiveJudgmentExplanation): ExecutiveJudgmentExplanationValidation {
  const issues = [];
  const registry = getExecutiveJudgmentExplanationRegistry();
  const sectionIds = explanation.sections.map((section) => section.sectionId);
  const sectionTypes = new Set(explanation.sections.map((section) => section.sectionType));
  if (!explanation.explanationId) issues.push(issue("missing_explanation_identifier", "explanationId", "Explanation identifier is required."));
  if (!explanation.judgmentId) issues.push(issue("missing_judgment_identifier", "judgmentId", "Judgment identifier is required."));
  if (new Set(sectionIds).size !== sectionIds.length) {
    issues.push(issue("duplicate_section_identifier", "sections", "Explanation sections must not contain duplicate identifiers."));
  }
  if (!registry.sectionTypes.every((sectionType) => sectionTypes.has(sectionType))) {
    issues.push(issue("missing_section_hierarchy", "sections", "Explanation must include every registered section type."));
  }
  if (explanation.traceabilityMap.some((entry) => !sectionIds.includes(entry.targetSectionId))) {
    issues.push(issue("invalid_traceability_reference", "traceabilityMap", "Traceability targets must reference existing sections."));
  }
  if (explanation.sections.some((section) => section.references.length === 0 && section.sectionType !== "known-gaps")) {
    issues.push(issue("missing_summary_references", "sections", "Explanation sections must include summary references."));
  }
  if (!Object.isFrozen(explanation) || !Object.isFrozen(explanation.sections)) {
    issues.push(issue("mutable_explanation_output", "explanation", "Explanation output must be immutable."));
  }
  if (!explanation.deterministic || !explanation.metadataOnly || !explanation.metadata.metadataOnly) {
    issues.push(issue("invalid_explanation_flags", "explanation", "Explanation output must be deterministic and metadata-only."));
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}
