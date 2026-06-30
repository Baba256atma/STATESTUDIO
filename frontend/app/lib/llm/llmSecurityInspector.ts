/**
 * LLM-10 — Prompt, context, and metadata inspection.
 */

import { LLM_SECURITY_CONTRACT_VERSION } from "./llmSecurityContracts.ts";
import { resolveDefaultSecurityPolicyKey } from "./llmSecurityPolicies.ts";
import {
  collectInspectableText,
  createEmptyRedactionSummary,
  redactContextPackage,
  redactPromptPackage,
} from "./llmSecurityRedaction.ts";
import { lookupSecurityPolicy } from "./llmSecurityRegistry.ts";
import type {
  LlmSecurityDecision,
  LlmSecurityInspectionInput,
  LlmSecurityInspectionResult,
  LlmSecurityPolicyRegistration,
} from "./llmSecurityTypes.ts";
import {
  getDefaultSecurityCompatibility,
  validateSecurityInspectionInput,
  validateSecurityPolicyCompatibility,
} from "./llmSecurityValidation.ts";

function containsDenyMarker(text: string, markers: readonly string[]): readonly string[] {
  const hits: string[] = [];
  for (const marker of markers) {
    if (text.includes(marker)) {
      hits.push(marker);
    }
  }
  return Object.freeze(hits);
}

function buildDecisionId(requestId: string, timestamp: string): string {
  return `security-decision-${requestId}-${timestamp}`;
}

function resolveWarnings(
  policy: LlmSecurityPolicyRegistration,
  inspectableText: readonly string[],
  redactionTotal: number
): readonly string[] {
  const warnings: string[] = [];
  if (policy.policyKey === "internal" && inspectableText.some((text) => text.includes("internal-ref-") || text.includes("INTERNAL_"))) {
    warnings.push("Internal reference detected; redaction applied where configured.");
  }
  if (redactionTotal > 0) {
    warnings.push(`Applied ${redactionTotal} redaction(s) before outbound eligibility.`);
  }
  return Object.freeze(warnings);
}

export function inspectPromptSecurity(
  input: LlmSecurityInspectionInput,
  timestamp: string = new Date(0).toISOString()
): LlmSecurityInspectionResult {
  const validation = validateSecurityInspectionInput(input);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues[0]?.message ?? "Security inspection input is invalid.",
      decision: null,
      readOnly: true as const,
    });
  }

  const policyKey = input.policyKey ?? resolveDefaultSecurityPolicyKey();
  const policy = lookupSecurityPolicy(policyKey);
  if (!policy) {
    return Object.freeze({
      success: false,
      reason: "Security policy is not registered.",
      decision: null,
      readOnly: true as const,
    });
  }

  const compatibilityValidation = validateSecurityPolicyCompatibility(policy);
  if (!compatibilityValidation.valid) {
    return Object.freeze({
      success: false,
      reason: compatibilityValidation.issues[0]?.message ?? "Security policy compatibility failed.",
      decision: null,
      readOnly: true as const,
    });
  }

  const metadataRecords = Object.freeze([
    input.runtimeMetadata ?? Object.freeze({}),
    input.userMetadata ?? Object.freeze({}),
    input.workspaceMetadata ?? Object.freeze({}),
    input.providerMetadata ?? Object.freeze({}),
    input.additionalMetadata ?? Object.freeze({}),
  ]);

  const inspectableText = collectInspectableText(input.promptPackage, input.contextPackage, metadataRecords);
  const denyHits = inspectableText.flatMap((text) => [...containsDenyMarker(text, policy.denyMarkers)]);
  const metadataDeny =
    input.runtimeMetadata?.securityDeny === "true" ||
    input.additionalMetadata?.securityDeny === "true" ||
    input.runtimeMetadata?.restrictedBlock === "true" ||
    input.additionalMetadata?.restrictedBlock === "true";

  if (
    policy.blockUnresolvedContext &&
    input.contextPackage &&
    input.contextPackage.unresolvedReferences.length > 0
  ) {
    const decision = Object.freeze({
      decisionId: buildDecisionId(input.promptPackage.promptId, timestamp),
      decision: "deny" as const,
      appliedPolicies: Object.freeze([policy.policyKey]),
      redactionSummary: createEmptyRedactionSummary(),
      warnings: Object.freeze(["Unresolved context references blocked by policy."]),
      validationResult: "valid" as const,
      compatibility: getDefaultSecurityCompatibility(),
      redactedPromptPackage: null,
      redactedContextPackage: null,
      timestamp,
      readOnly: true as const,
    });
    return Object.freeze({
      success: true,
      reason: "Security decision: deny (unresolved context).",
      decision,
      readOnly: true as const,
    });
  }

  if (denyHits.length > 0 || metadataDeny) {
    const decision = Object.freeze({
      decisionId: buildDecisionId(input.promptPackage.promptId, timestamp),
      decision: "deny" as const,
      appliedPolicies: Object.freeze([policy.policyKey]),
      redactionSummary: createEmptyRedactionSummary(),
      warnings: Object.freeze([
        denyHits.length > 0 ? `Deny marker detected: ${denyHits[0]}` : "Explicit security deny metadata present.",
      ]),
      validationResult: "valid" as const,
      compatibility: Object.freeze([LLM_SECURITY_CONTRACT_VERSION, policy.version]),
      redactedPromptPackage: null,
      redactedContextPackage: null,
      timestamp,
      readOnly: true as const,
    });
    return Object.freeze({
      success: true,
      reason: "Security decision: deny.",
      decision,
      readOnly: true as const,
    });
  }

  const redactedPrompt = redactPromptPackage(input.promptPackage, policy);
  const redactedContext = input.contextPackage ? redactContextPackage(input.contextPackage, policy) : null;
  const warnings = resolveWarnings(policy, inspectableText, redactedPrompt.summary?.totalRedactions ?? 0);

  const decision = Object.freeze({
    decisionId: buildDecisionId(input.promptPackage.promptId, timestamp),
    decision: policy.allowAfterRedaction ? ("allow" as const) : ("deny" as const),
    appliedPolicies: Object.freeze([policy.policyKey]),
    redactionSummary: redactedPrompt.summary ?? createEmptyRedactionSummary(),
    warnings,
    validationResult: "valid" as const,
    compatibility: Object.freeze([LLM_SECURITY_CONTRACT_VERSION, policy.version, input.promptPackage.promptVersion]),
    redactedPromptPackage: redactedPrompt.package,
    redactedContextPackage: redactedContext,
    timestamp,
    readOnly: true as const,
  });

  return Object.freeze({
    success: true,
    reason: decision.decision === "allow" ? "Security decision: allow." : "Security decision: deny.",
    decision,
    readOnly: true as const,
  });
}
