/**
 * LLM-10 — Deterministic redaction with placeholder replacement.
 */

import { LLM_SECURITY_REDACTION_REPLACEMENTS } from "./llmSecurityContracts.ts";
import { isLlmSecurityRedactionRuleKey } from "./llmSecurityPolicies.ts";
import type { LlmContextPackage } from "./llmContextTypes.ts";
import type { LlmPromptPackage, LlmPromptSection } from "./llmPromptTypes.ts";
import type {
  LlmSecurityPolicyRegistration,
  LlmSecurityRedactionResult,
  LlmSecurityRedactionRuleKey,
  LlmSecurityRedactionSummary,
} from "./llmSecurityTypes.ts";

type RedactionMatch = Readonly<{
  ruleKey: LlmSecurityRedactionRuleKey;
  start: number;
  end: number;
  replacement: string;
}>;

function findRuleMatches(text: string, ruleKey: LlmSecurityRedactionRuleKey): readonly RedactionMatch[] {
  const replacement = LLM_SECURITY_REDACTION_REPLACEMENTS[ruleKey];
  const matches: RedactionMatch[] = [];
  const addMatch = (start: number, end: number) => {
    matches.push(Object.freeze({ ruleKey, start, end, replacement }));
  };

  switch (ruleKey) {
    case "secret_placeholder": {
      for (const marker of ["secret=", "SECRET_"]) {
        let index = text.indexOf(marker);
        while (index >= 0) {
          addMatch(index, index + marker.length);
          index = text.indexOf(marker, index + marker.length);
        }
      }
      break;
    }
    case "credential_reference": {
      for (const marker of ["credential-ref-", "CREDENTIAL_"]) {
        let index = text.indexOf(marker);
        while (index >= 0) {
          addMatch(index, index + marker.length);
          index = text.indexOf(marker, index + marker.length);
        }
      }
      break;
    }
    case "api_key_placeholder": {
      for (const marker of ["api_key=", "API_KEY_", "sk-"]) {
        let index = text.indexOf(marker);
        while (index >= 0) {
          addMatch(index, index + marker.length);
          index = text.indexOf(marker, index + marker.length);
        }
      }
      break;
    }
    case "password_placeholder": {
      for (const marker of ["password=", "PASSWORD_"]) {
        let index = text.indexOf(marker);
        while (index >= 0) {
          addMatch(index, index + marker.length);
          index = text.indexOf(marker, index + marker.length);
        }
      }
      break;
    }
    case "pii_placeholder": {
      const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
      let match = emailPattern.exec(text);
      while (match) {
        addMatch(match.index, match.index + match[0].length);
        match = emailPattern.exec(text);
      }
      break;
    }
    case "internal_reference_placeholder": {
      for (const marker of ["internal-ref-", "INTERNAL_"]) {
        let index = text.indexOf(marker);
        while (index >= 0) {
          addMatch(index, index + marker.length);
          index = text.indexOf(marker, index + marker.length);
        }
      }
      break;
    }
  }

  return Object.freeze(matches);
}

function applyRedactionToText(
  text: string,
  enabledRules: readonly LlmSecurityRedactionRuleKey[]
): Readonly<{ value: string; redactionCount: number; rules: Readonly<Record<string, number>> }> {
  const allMatches: RedactionMatch[] = [];
  for (const ruleKey of enabledRules) {
    if (!isLlmSecurityRedactionRuleKey(ruleKey)) {
      continue;
    }
    allMatches.push(...findRuleMatches(text, ruleKey));
  }
  if (allMatches.length === 0) {
    return Object.freeze({ value: text, redactionCount: 0, rules: Object.freeze({}) });
  }
  const sorted = [...allMatches].sort((left, right) => left.start - right.start || right.end - left.end);
  const rules: Record<string, number> = {};
  let cursor = 0;
  let output = "";
  for (const match of sorted) {
    if (match.start < cursor) {
      continue;
    }
    output += text.slice(cursor, match.start);
    output += match.replacement;
    cursor = match.end;
    rules[match.ruleKey] = (rules[match.ruleKey] ?? 0) + 1;
  }
  output += text.slice(cursor);
  const redactionCount = Object.values(rules).reduce((total, count) => total + count, 0);
  return Object.freeze({ value: output, redactionCount, rules: Object.freeze(rules) });
}

function redactPromptSection(
  section: LlmPromptSection,
  enabledRules: readonly LlmSecurityRedactionRuleKey[]
): Readonly<{ section: LlmPromptSection; redactionCount: number; rules: Readonly<Record<string, number>> }> {
  const result = applyRedactionToText(section.contentRef, enabledRules);
  if (result.redactionCount === 0) {
    return Object.freeze({ section, redactionCount: 0, rules: Object.freeze({}) });
  }
  return Object.freeze({
    section: Object.freeze({ ...section, contentRef: result.value, readOnly: true as const }),
    redactionCount: result.redactionCount,
    rules: result.rules,
  });
}

function mergeRuleCounts(
  left: Readonly<Record<string, number>>,
  right: Readonly<Record<string, number>>
): Readonly<Record<string, number>> {
  const merged: Record<string, number> = { ...left };
  for (const [key, count] of Object.entries(right)) {
    merged[key] = (merged[key] ?? 0) + count;
  }
  return Object.freeze(merged);
}

export function createEmptyRedactionSummary(): LlmSecurityRedactionSummary {
  return Object.freeze({
    totalRedactions: 0,
    redactionsByRule: Object.freeze({}),
    affectedSectionIds: Object.freeze([]),
    readOnly: true as const,
  });
}

export function redactPromptPackage(
  promptPackage: LlmPromptPackage,
  policy: LlmSecurityPolicyRegistration
): LlmSecurityRedactionResult {
  const redactionsByRule: Record<string, number> = {};
  const affectedSectionIds: string[] = [];
  let totalRedactions = 0;
  const redactedSections: LlmPromptSection[] = [];

  for (const section of promptPackage.sections) {
    const result = redactPromptSection(section, policy.enabledRedactionRules);
    redactedSections.push(result.section);
    if (result.redactionCount > 0) {
      affectedSectionIds.push(section.sectionId);
      totalRedactions += result.redactionCount;
      Object.assign(redactionsByRule, mergeRuleCounts(redactionsByRule, result.rules));
    }
  }

  const metadataEntries = Object.entries(promptPackage.metadata);
  const redactedMetadata: Record<string, string> = {};
  for (const [key, value] of metadataEntries) {
    const result = applyRedactionToText(value, policy.enabledRedactionRules);
    redactedMetadata[key] = result.value;
    if (result.redactionCount > 0) {
      if (!affectedSectionIds.includes("metadata")) {
        affectedSectionIds.push("metadata");
      }
      totalRedactions += result.redactionCount;
      Object.assign(redactionsByRule, mergeRuleCounts(redactionsByRule, result.rules));
    }
  }

  const summary = Object.freeze({
    totalRedactions,
    redactionsByRule: Object.freeze({ ...redactionsByRule }),
    affectedSectionIds: Object.freeze([...affectedSectionIds]),
    readOnly: true as const,
  });

  const redactedPackage = Object.freeze({
    ...promptPackage,
    sections: Object.freeze(redactedSections),
    metadata: Object.freeze(redactedMetadata),
    readOnly: true as const,
  });

  return Object.freeze({
    success: true,
    reason: totalRedactions > 0 ? "Prompt package redacted." : "No redaction required.",
    package: redactedPackage,
    summary,
    readOnly: true as const,
  });
}

export function redactContextPackage(
  contextPackage: LlmContextPackage,
  policy: LlmSecurityPolicyRegistration
): LlmContextPackage {
  const redactedSections = contextPackage.sections.map((section) => {
    const result = applyRedactionToText(section.contentRef, policy.enabledRedactionRules);
    if (result.redactionCount === 0) {
      return section;
    }
    return Object.freeze({ ...section, contentRef: result.value, readOnly: true as const });
  });
  const redactedMetadata: Record<string, string> = {};
  for (const [key, value] of Object.entries(contextPackage.metadata)) {
    redactedMetadata[key] = applyRedactionToText(value, policy.enabledRedactionRules).value;
  }
  return Object.freeze({
    ...contextPackage,
    sections: Object.freeze(redactedSections),
    metadata: Object.freeze(redactedMetadata),
    readOnly: true as const,
  });
}

export function collectInspectableText(
  promptPackage: LlmPromptPackage,
  contextPackage: LlmContextPackage | null | undefined,
  metadata: readonly Readonly<Record<string, string>>[]
): readonly string[] {
  const values: string[] = [];
  for (const section of promptPackage.sections) {
    values.push(section.contentRef);
  }
  for (const [key, value] of Object.entries(promptPackage.metadata)) {
    values.push(`${key}=${value}`);
  }
  if (contextPackage) {
    for (const section of contextPackage.sections) {
      values.push(section.contentRef);
    }
    for (const reference of contextPackage.unresolvedReferences) {
      values.push(reference.refId);
    }
    for (const [key, value] of Object.entries(contextPackage.metadata)) {
      values.push(`${key}=${value}`);
    }
  }
  for (const record of metadata) {
    for (const [key, value] of Object.entries(record)) {
      values.push(`${key}=${value}`);
    }
  }
  return Object.freeze(values);
}

export { applyRedactionToText, findRuleMatches };
