import type { NormalizedExecutiveJudgmentContext } from "./executiveJudgmentContextNormalizer.ts";
import { getExecutiveJudgmentContextRegistry } from "./executiveJudgmentContextRegistry.ts";

export type ExecutiveJudgmentContextValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    section: string;
    message: string;
  }>[];
}>;

function issue(code: string, section: string, message: string) {
  return Object.freeze({ code, section, message });
}

function sectionItems(context: NormalizedExecutiveJudgmentContext, section: string) {
  if (section === "platformMetadata") {
    return context.platformMetadata;
  }
  return context[section as Exclude<keyof NormalizedExecutiveJudgmentContext, "baseContext" | "platformMetadata" | "sectionOrder" | "deterministic" | "metadataOnly">];
}

function hasDuplicates(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateExecutiveJudgmentContext(context: NormalizedExecutiveJudgmentContext): ExecutiveJudgmentContextValidation {
  const registry = getExecutiveJudgmentContextRegistry();
  const issues = [];
  for (const entry of registry.sections) {
    const values = sectionItems(context, entry.section);
    if (entry.required && values.length === 0) {
      issues.push(issue("missing_required_section", entry.section, `${entry.section} is required.`));
    }
  }

  const identityIds = context.identity.map((item) => item.id);
  const intentIds = context.intent.map((item) => item.id);
  const reasoningIds = context.reasoningMetadata.map((item) => item.id);
  const platformIds = context.platformMetadata.map((item) => item.platformId);

  if (hasDuplicates(identityIds)) issues.push(issue("duplicate_identifier", "identity", "Identity section contains duplicate identifiers."));
  if (hasDuplicates(intentIds)) issues.push(issue("duplicate_identifier", "intent", "Intent section contains duplicate identifiers."));
  if (hasDuplicates(reasoningIds)) issues.push(issue("duplicate_identifier", "reasoningMetadata", "Reasoning metadata contains duplicate identifiers."));
  if (hasDuplicates(platformIds)) issues.push(issue("duplicate_platform", "platformMetadata", "Platform metadata contains duplicate identifiers."));
  if (!context.platformMetadata.every((platform) => platform.compatible && platform.metadataOnly)) {
    issues.push(issue("platform_incompatible", "platformMetadata", "All platform metadata entries must be compatible and metadata-only."));
  }
  if (!Object.isFrozen(context) || !Object.isFrozen(context.baseContext)) {
    issues.push(issue("mutable_context", "context", "Executive Judgment Context must be immutable."));
  }
  if (!context.metadataOnly || !context.deterministic) {
    issues.push(issue("invalid_context_flags", "context", "Executive Judgment Context must be deterministic and metadata-only."));
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}
