/**
 * DKL-5:3 — Trust, Result, Summary, Quality Signal, Status, Severity models.
 *
 * Ownership: owned exclusively by DKL-5:3.
 */

import { KnowledgeValidationRegistry } from "./knowledgeValidationRegistry.ts";
import { field, model } from "./knowledgeValidationModelHelpers.ts";
import type { CanonicalModelDescriptor } from "./knowledgeValidationModelTypes.ts";

const signalIds = Object.freeze(
  KnowledgeValidationRegistry.collections.knowledgeQualitySignals.map((e) => e.id),
);
const trustLevelIds = Object.freeze(
  KnowledgeValidationRegistry.collections.trustLevels.map((e) => e.id),
);

export const KnowledgeQualitySignalModel: CanonicalModelDescriptor = model(
  "KnowledgeQualitySignal",
  "Knowledge Quality Signal Model",
  "Quality signal declaration referencing the 20 registered signals. No scores or numeric confidence aggregation.",
  Object.freeze(["knowledgeQualitySignals", "validationDimensions"]),
  Object.freeze([
    field("signalId", "string", "Stable declared signal identifier."),
    field("signalType", "registryReference", "Registered quality signal type."),
    field("dimension", "registryReference", "Registered validation dimension."),
    field("targetReference", "string", "Target subject reference."),
    field("supportingFindings", "string[]", "Supporting finding references."),
    field("supportingEvidence", "string[]", "Supporting evidence references."),
    field("polarity", "string", "Declared polarity."),
    field("severity", "registryReference", "Registered severity."),
    field("consumerImpact", "string", "Declared consumer impact."),
    field("clarificationRecommended", "boolean", "Declared clarification recommendation."),
    field("blockingStatus", "boolean", "Declared blocking status."),
    field("ownership", "string", "Owning architectural owner."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("status", "ModelStatus", "Declared status."),
    field("numericScoreCalculated", "false", "Always false — no numeric scoring."),
  ]),
);

export const KnowledgeTrustDeclarationModel: CanonicalModelDescriptor = model(
  "KnowledgeTrustDeclaration",
  "Knowledge Trust Declaration Model",
  "Evidence-based trust declaration. trustCalculated and aiConfidenceUsed are always false.",
  Object.freeze(["trustLevels", "knowledgeQualitySignals"]),
  Object.freeze([
    field("declarationId", "string", "Stable declared trust declaration identifier."),
    field("trustLevel", "registryReference", "Registered trust level."),
    field("targetReference", "string", "Target subject reference."),
    field("evidenceReferences", "string[]", "Evidence reference identifiers."),
    field("supportingFindings", "string[]", "Supporting finding references."),
    field("limitingFindings", "string[]", "Limiting finding references."),
    field("unresolvedAmbiguity", "string[]", "Unresolved ambiguity references."),
    field("unresolvedConflicts", "string[]", "Unresolved conflict references."),
    field("provenanceStatus", "string", "Declared provenance status."),
    field("completenessStatus", "string", "Declared completeness status."),
    field("consistencyStatus", "string", "Declared consistency status."),
    field("consumerSuitability", "ValidationConsumerSuitability", "Consumer suitability declaration."),
    field("executiveUseSuitability", "ValidationExecutiveUsability", "Executive usability declaration."),
    field("explanation", "string", "Explainable trust narrative."),
    field("limitations", "string[]", "Limitation references."),
    field("ownership", "string", "Owning architectural owner."),
    field("sourcePhase", "string", "Declaring source phase."),
    field("lifecycle", "ModelLifecycleState", "Declared lifecycle state."),
    field("compatibility", "string", "Compatibility metadata."),
    field("trustCalculated", "false", "Always false — trust is declared, not calculated."),
    field("aiConfidenceUsed", "false", "Always false — AI confidence is forbidden."),
  ]),
);

export const ValidationResultModel: CanonicalModelDescriptor = model(
  "ValidationResult",
  "Validation Result Model",
  "Immutable validation result. Non-perfect knowledge is not automatically declared unusable.",
  Object.freeze(["validationOutcomes", "validationStatuses", "validationSeverities"]),
  Object.freeze([
    field("resultId", "string", "Stable declared result identifier."),
    field("targetReference", "string", "Target subject reference."),
    field("status", "registryReference", "Registered validation status."),
    field("outcome", "registryReference", "Registered validation outcome."),
    field("severity", "registryReference", "Registered severity."),
    field("qualitySignals", "string[]", "Quality signal references."),
    field("findings", "string[]", "Finding references."),
    field("issues", "string[]", "Issue references."),
    field("conflicts", "string[]", "Conflict references."),
    field("ambiguities", "string[]", "Ambiguity references."),
    field("limitations", "string[]", "Limitation references."),
    field("trustDeclaration", "KnowledgeTrustDeclaration", "Trust declaration reference."),
    field("consumerReadiness", "ValidationConsumerSuitability", "Consumer readiness declaration."),
    field("executiveUsability", "ValidationExecutiveUsability", "Executive usability declaration."),
    field("explanation", "string", "Explainable result narrative."),
    field("nonPerfectKnowledgeAutomaticallyUnusable", "false", "Always false."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("ownership", "string", "Owning architectural owner."),
    field("lifecycle", "ModelLifecycleState", "Declared lifecycle state."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const ValidationSummaryModel: CanonicalModelDescriptor = model(
  "ValidationSummary",
  "Validation Summary Model",
  "Validation summary with count fields only — counts are not calculated in this phase.",
  Object.freeze(["validationOutcomes", "validationSeverities", "consumerReadinessStates"]),
  Object.freeze([
    field("validationId", "string", "Related validation aggregate identifier."),
    field("targetCount", "number", "Declared target count field — not calculated here."),
    field("ruleCount", "number", "Declared rule count field — not calculated here."),
    field("evidenceCount", "number", "Declared evidence count field — not calculated here."),
    field("findingCount", "number", "Declared finding count field — not calculated here."),
    field("issueCount", "number", "Declared issue count field — not calculated here."),
    field("conflictCount", "number", "Declared conflict count field — not calculated here."),
    field("ambiguityCount", "number", "Declared ambiguity count field — not calculated here."),
    field("limitationCount", "number", "Declared limitation count field — not calculated here."),
    field("signalCount", "number", "Declared signal count field — not calculated here."),
    field("blockingCount", "number", "Declared blocking count field — not calculated here."),
    field("nonBlockingCount", "number", "Declared non-blocking count field — not calculated here."),
    field("outcomeDistribution", "string", "Declared outcome distribution."),
    field("severityDistribution", "string", "Declared severity distribution."),
    field("consumerReadinessDeclaration", "string", "Consumer readiness declaration."),
    field("executiveUsabilityDeclaration", "string", "Executive usability declaration."),
    field("overallExplanation", "string", "Overall explanation."),
    field("countsCalculatedInPhase", "false", "Always false — counts are fields only."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("ownership", "string", "Owning architectural owner."),
  ]),
);

export const ValidationStatusModel: CanonicalModelDescriptor = model(
  "ValidationStatus",
  "Validation Status Model",
  "Structural status declaration referencing registered validation statuses.",
  Object.freeze(["validationStatuses"]),
  Object.freeze([
    field("statusId", "string", "Stable declared status identifier."),
    field("status", "registryReference", "Registered validation status."),
    field("targetReference", "string", "Target subject reference."),
    field("ownership", "string", "Owning architectural owner."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const ValidationSeverityModel: CanonicalModelDescriptor = model(
  "ValidationSeverity",
  "Validation Severity Model",
  "Structural severity declaration referencing registered severities.",
  Object.freeze(["validationSeverities"]),
  Object.freeze([
    field("severityId", "string", "Stable declared severity identifier."),
    field("severity", "registryReference", "Registered validation severity."),
    field("targetReference", "string", "Target subject reference."),
    field("findingReference", "string", "Related finding reference."),
    field("ownership", "string", "Owning architectural owner."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const SignalTrustRegistrySnapshot = Object.freeze({
  signalIds,
  trustLevelIds,
  signalCount: signalIds.length,
  trustLevelCount: trustLevelIds.length,
  expectedSignalCount: 20,
});
