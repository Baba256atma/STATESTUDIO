/**
 * LLM-5 — Approved context reference resolution.
 */

import { LLM_CONTEXT_PLACEHOLDER_SOURCE_KEYS } from "./llmContextContracts.ts";
import { getLlmContextSourceOrder, isLlmContextPlaceholderSource } from "./llmContextSources.ts";
import type {
  LlmContextReference,
  LlmContextResolutionResult,
  LlmContextSection,
} from "./llmContextTypes.ts";

const approvedReferenceCatalog = new Map<string, LlmContextReference>();

export function resetLlmContextApprovedReferencesForTests(): void {
  approvedReferenceCatalog.clear();
}

export function registerApprovedContextReference(reference: LlmContextReference): void {
  approvedReferenceCatalog.set(reference.referenceId, reference);
}

export function seedApprovedContextReferences(references: readonly LlmContextReference[]): void {
  for (const reference of references) {
    registerApprovedContextReference(reference);
  }
}

export function isContextReferenceApproved(referenceId: string): boolean {
  const entry = approvedReferenceCatalog.get(referenceId);
  return entry?.approved === true;
}

export function buildContextContentRef(reference: LlmContextReference): string {
  return `context-ref://${reference.sourceKey}/${reference.refId}`;
}

export function resolveContextReference(reference: LlmContextReference): LlmContextResolutionResult {
  if (!reference.approved) {
    return Object.freeze({
      reference,
      section: null,
      resolved: false,
      reason: "Reference is not approved.",
      readOnly: true as const,
    });
  }

  const catalogEntry = approvedReferenceCatalog.get(reference.referenceId);
  if (!catalogEntry || !catalogEntry.approved) {
    return Object.freeze({
      reference,
      section: null,
      resolved: false,
      reason: `Unresolved reference: ${reference.referenceId}`,
      readOnly: true as const,
    });
  }

  const resolutionStatus = isLlmContextPlaceholderSource(reference.sourceKey) ? "placeholder" : "resolved";
  const section: LlmContextSection = Object.freeze({
    sectionId: `context-section-${reference.referenceId}`,
    sourceKey: reference.sourceKey,
    order: getLlmContextSourceOrder(reference.sourceKey),
    contentRef: buildContextContentRef(reference),
    referenceId: reference.referenceId,
    resolutionStatus,
    readOnly: true as const,
  });

  return Object.freeze({
    reference,
    section,
    resolved: true,
    reason: resolutionStatus === "placeholder" ? "Placeholder reference resolved." : "Reference resolved.",
    readOnly: true as const,
  });
}

export function resolveContextReferences(
  references: readonly LlmContextReference[]
): Readonly<{ sections: readonly LlmContextSection[]; unresolved: readonly LlmContextReference[] }> {
  const sections: LlmContextSection[] = [];
  const unresolved: LlmContextReference[] = [];
  for (const reference of references) {
    const result = resolveContextReference(reference);
    if (result.resolved && result.section) {
      sections.push(result.section);
    } else {
      unresolved.push(reference);
    }
  }
  return Object.freeze({
    sections: Object.freeze([...sections].sort((left, right) => left.order - right.order)),
    unresolved: Object.freeze(unresolved),
  });
}

export function isPlaceholderResolutionAllowed(sourceKey: string): boolean {
  return (LLM_CONTEXT_PLACEHOLDER_SOURCE_KEYS as readonly string[]).includes(sourceKey);
}
