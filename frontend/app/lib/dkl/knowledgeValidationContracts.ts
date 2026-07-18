/**
 * DKL-5:1 — Knowledge Validation Contracts.
 *
 * Canonical validation vocabulary, targets, dimensions, quality signals,
 * trust declaration, outcomes, severity, evidence/findings, ambiguity/conflict,
 * extension and compatibility policies. Contract definitions only — no execution.
 *
 * Ownership: owned exclusively by DKL-5:1.
 */

import type {
  CompatibilityPolicyDescriptor,
  EvidenceKind,
  ExtensionPolicyDescriptor,
  KnowledgeQualitySignalId,
  KnowledgeValidationTerminology,
  OutcomeDescriptor,
  QualitySignalDescriptor,
  SeverityDescriptor,
  TrustLevel,
  ValidationDimension,
  ValidationOutcomeStatus,
  ValidationSeverity,
  ValidationTargetCategory,
} from "./knowledgeValidationFoundationTypes.ts";
import { KNOWLEDGE_VALIDATION_DEFINITION } from "./knowledgeValidationFoundationTypes.ts";

const OWNER = "DKL-5 Knowledge Validation Platform";
const PHASE = "DKL-5:1" as const;

export const KNOWLEDGE_VALIDATION_TERMINOLOGY: KnowledgeValidationTerminology =
  Object.freeze({
    knowledgeValidation:
      "Evaluation of structural reliability, completeness, consistency, traceability, and usability of modeled knowledge.",
    validationTarget:
      "A DKL-4 modeling concept category that may later be evaluated by DKL-5.",
    qualitySignal:
      "An explicit, explainable declaration of a knowledge quality characteristic — not a calculated score.",
    trustDeclaration:
      "An evidence-referenced statement of trust level and limitations — not AI confidence.",
    validationFinding:
      "An explainable, traceable declaration describing a validation observation.",
    ambiguity:
      "Represented uncertainty that may materially affect meaning and may require clarification.",
    conflict:
      "Represented disagreement among knowledge participants or evidence within a declared scope.",
    limitation:
      "A declared constraint on usability that does not automatically make knowledge unusable.",
  });

export const VALIDATION_CONTRACT_KINDS = Object.freeze([
  "KnowledgeValidation",
  "ValidationTarget",
  "ValidationScope",
  "ValidationRule",
  "ValidationCriterion",
  "ValidationEvidence",
  "ValidationFinding",
  "ValidationIssue",
  "ValidationConflict",
  "ValidationAmbiguity",
  "ValidationLimitation",
  "ValidationResult",
  "ValidationSummary",
  "ValidationStatus",
  "ValidationSeverity",
  "KnowledgeQualitySignal",
  "KnowledgeTrustDeclaration",
  "ValidationReadiness",
  "ValidationProvenance",
  "ValidationBoundary",
] as const);

export const VALIDATION_TARGET_CATEGORIES: readonly ValidationTargetCategory[] =
  Object.freeze([
    "KnowledgeModel",
    "KnowledgeObject",
    "BusinessObject",
    "Entity",
    "Relationship",
    "Identity",
    "Metadata",
    "Hierarchy",
    "Composition",
    "Reference",
    "SemanticStructure",
    "Provenance",
    "Context",
    "Snapshot",
    "ObjectSet",
    "RelationshipSet",
    "Boundary",
    "Version",
    "Summary",
  ]);

export const VALIDATION_DIMENSIONS: readonly ValidationDimension[] = Object.freeze([
  "Identity",
  "Completeness",
  "Consistency",
  "Integrity",
  "ReferentialIntegrity",
  "StructuralValidity",
  "SemanticAlignment",
  "Provenance",
  "Traceability",
  "Ownership",
  "Compatibility",
  "Classification",
  "RelationshipValidity",
  "HierarchyValidity",
  "CompositionValidity",
  "Ambiguity",
  "Conflict",
  "FreshnessDeclaration",
  "ConsumerReadiness",
  "ExecutiveUsability",
]);

const signal = (
  id: KnowledgeQualitySignalId,
  name: string,
  dimension: ValidationDimension,
  meaning: string,
  polarity: QualitySignalDescriptor["polarity"],
  severity: ValidationSeverity,
  consumerImpact: string,
  clarificationRecommended: boolean,
  blockingStatus: boolean,
): QualitySignalDescriptor =>
  Object.freeze({
    id,
    name,
    dimension,
    meaning,
    polarity,
    severity,
    consumerImpact,
    clarificationRecommended,
    blockingStatus,
    ownership: OWNER,
    sourcePhase: PHASE,
  });

export const KNOWLEDGE_QUALITY_SIGNALS: readonly QualitySignalDescriptor[] =
  Object.freeze([
    signal("Complete", "Complete", "Completeness", "Required structural elements are present by declaration.", "Positive", "Informational", "Full structural usability within declared scope.", false, false),
    signal("MostlyComplete", "Mostly Complete", "Completeness", "Most required elements are present; minor gaps declared.", "Caution", "Low", "Usable with declared gaps.", false, false),
    signal("Partial", "Partial", "Completeness", "Material portions are present but incomplete.", "Caution", "Medium", "Partial analysis only.", false, false),
    signal("Missing", "Missing", "Completeness", "Required structural elements are absent.", "Negative", "High", "May block consumer readiness for affected scope.", true, false),
    signal("Consistent", "Consistent", "Consistency", "No declared structural contradictions.", "Positive", "Informational", "Consistent for declared scope.", false, false),
    signal("Conflicting", "Conflicting", "Conflict", "Declared contradictions exist among participants or evidence.", "Negative", "High", "May block specific conclusions.", true, false),
    signal("Clear", "Clear", "Ambiguity", "Meaning is unambiguous by declaration.", "Positive", "Informational", "Clear for consumer use.", false, false),
    signal("Ambiguous", "Ambiguous", "Ambiguity", "Meaning is uncertain in a material way.", "Caution", "Medium", "Clarification may be required.", true, false),
    signal("Traceable", "Traceable", "Traceability", "Provenance and evidence references are declared.", "Positive", "Informational", "Traceable for audit and explanation.", false, false),
    signal("Untraceable", "Untraceable", "Traceability", "Required provenance or evidence references are absent.", "Negative", "High", "Limits executive trust.", true, false),
    signal("Supported", "Supported", "Provenance", "Supporting evidence is declared.", "Positive", "Informational", "Supported for declared use.", false, false),
    signal("Unsupported", "Unsupported", "Provenance", "Required supporting evidence is not declared.", "Negative", "High", "Not suitable for unsupported conclusions.", true, false),
    signal("Current", "Current", "FreshnessDeclaration", "Freshness is declared current.", "Positive", "Informational", "Current by declaration.", false, false),
    signal("PotentiallyStale", "Potentially Stale", "FreshnessDeclaration", "Freshness may be outdated by declaration.", "Caution", "Medium", "Use with freshness limitation.", false, false),
    signal("Verified", "Verified", "Integrity", "Verification status is declared verified.", "Positive", "Informational", "Verified within declared criteria.", false, false),
    signal("Unverified", "Unverified", "Integrity", "Verification has not been declared.", "Caution", "Medium", "Unverified — limited trust.", false, false),
    signal("Reliable", "Reliable", "ExecutiveUsability", "Declared suitable for reliable executive use within scope.", "Positive", "Informational", "Suitable for executive consumption with scope.", false, false),
    signal("Limited", "Limited", "ExecutiveUsability", "Usable with explicit limitations.", "Caution", "Medium", "Usable with declared limitations.", false, false),
    signal("Restricted", "Restricted", "ConsumerReadiness", "Consumer use is restricted by declaration.", "Negative", "High", "Restricted consumers only.", false, false),
    signal("Ready", "Ready", "ConsumerReadiness", "Declared ready for approved consumers.", "Positive", "Informational", "Ready for approved consumers.", false, false),
  ]);

export const TRUST_LEVELS: readonly TrustLevel[] = Object.freeze([
  "Undeclared",
  "Unsupported",
  "Limited",
  "Conditional",
  "Supported",
  "Verified",
  "Restricted",
]);

export const KNOWLEDGE_TRUST_DECLARATION_CONTRACT = Object.freeze({
  contractId: "DKL-5:1/KnowledgeTrustDeclaration",
  fields: Object.freeze([
    "trustLevel",
    "supportingEvidenceReferences",
    "limitingFindings",
    "unresolvedAmbiguity",
    "conflicts",
    "provenanceStatus",
    "completenessStatus",
    "consistencyStatus",
    "consumerSuitability",
    "executiveUseDeclaration",
    "explanation",
    "owner",
    "sourcePhase",
  ]),
  notes: Object.freeze({
    evidenceBasedInFuturePhases: true,
    noAutomaticCalculation: true,
    noMathematicalCertainty: true,
    noAiConfidence: true,
    metadataOnly: true,
  }),
  ownership: OWNER,
  sourcePhase: PHASE,
  metadataOnly: true,
  immutable: true,
});

export const VALIDATION_OUTCOMES: readonly OutcomeDescriptor[] = Object.freeze([
  Object.freeze({
    status: "NotEvaluated" as const,
    meaning: "Validation has not been performed.",
    allowedUsage: "No validation claim may be made.",
    mayRemainUsable: false,
    clarificationRequired: false,
    blocksConclusions: true,
  }),
  Object.freeze({
    status: "Valid" as const,
    meaning: "No material structural validation failures declared.",
    allowedUsage: "Approved consumers may use within declared scope.",
    mayRemainUsable: true,
    clarificationRequired: false,
    blocksConclusions: false,
  }),
  Object.freeze({
    status: "ValidWithLimitations" as const,
    meaning: "Structurally acceptable with explicit limitations.",
    allowedUsage: "Available to consumers with declared limitations.",
    mayRemainUsable: true,
    clarificationRequired: false,
    blocksConclusions: false,
  }),
  Object.freeze({
    status: "Invalid" as const,
    meaning: "Material structural failure declared.",
    allowedUsage: "Must not be treated as structurally sound.",
    mayRemainUsable: false,
    clarificationRequired: false,
    blocksConclusions: true,
  }),
  Object.freeze({
    status: "Incomplete" as const,
    meaning: "Required elements are missing.",
    allowedUsage: "Partial analysis may be allowed within declared gaps.",
    mayRemainUsable: true,
    clarificationRequired: false,
    blocksConclusions: false,
  }),
  Object.freeze({
    status: "Ambiguous" as const,
    meaning: "Material ambiguity affects meaning.",
    allowedUsage: "May require clarification before specific conclusions.",
    mayRemainUsable: true,
    clarificationRequired: true,
    blocksConclusions: false,
  }),
  Object.freeze({
    status: "Conflicting" as const,
    meaning: "Declared conflicts exist within scope.",
    allowedUsage: "May block specific conclusions until conflict is scoped.",
    mayRemainUsable: true,
    clarificationRequired: true,
    blocksConclusions: true,
  }),
  Object.freeze({
    status: "Unsupported" as const,
    meaning: "Required evidence is not declared.",
    allowedUsage: "Unsupported conclusions must not be claimed.",
    mayRemainUsable: false,
    clarificationRequired: false,
    blocksConclusions: true,
  }),
  Object.freeze({
    status: "Restricted" as const,
    meaning: "Consumer use is restricted by declaration.",
    allowedUsage: "Restricted approved consumers only.",
    mayRemainUsable: true,
    clarificationRequired: false,
    blocksConclusions: false,
  }),
  Object.freeze({
    status: "ReadyForConsumer" as const,
    meaning: "Declared ready for approved consumer use.",
    allowedUsage: "Approved consumers may consume within scope.",
    mayRemainUsable: true,
    clarificationRequired: false,
    blocksConclusions: false,
  }),
  Object.freeze({
    status: "NotReadyForConsumer" as const,
    meaning: "Not ready for approved consumer use.",
    allowedUsage: "Must not be released to consumers.",
    mayRemainUsable: false,
    clarificationRequired: false,
    blocksConclusions: true,
  }),
]);

export const VALIDATION_SEVERITIES: readonly SeverityDescriptor[] = Object.freeze([
  Object.freeze({
    severity: "Informational" as const,
    meaning: "Non-blocking architectural observation.",
    architecturalImpact: "No structural barrier.",
  }),
  Object.freeze({
    severity: "Low" as const,
    meaning: "Minor architectural concern.",
    architecturalImpact: "Limited impact on usability.",
  }),
  Object.freeze({
    severity: "Medium" as const,
    meaning: "Material concern requiring awareness.",
    architecturalImpact: "May constrain specific uses.",
  }),
  Object.freeze({
    severity: "High" as const,
    meaning: "Significant structural or trust concern.",
    architecturalImpact: "May block conclusions or readiness.",
  }),
  Object.freeze({
    severity: "Critical" as const,
    meaning: "Severe architectural failure risk.",
    architecturalImpact: "Strong barrier to consumer readiness.",
  }),
  Object.freeze({
    severity: "Blocking" as const,
    meaning: "Blocks progression for the declared scope.",
    architecturalImpact: "Prevents ReadyForConsumer for affected scope.",
  }),
]);

export const EVIDENCE_KINDS: readonly EvidenceKind[] = Object.freeze([
  "Supporting",
  "Contradicting",
  "Missing",
  "Referenced",
  "Provenance",
]);

export const EVIDENCE_AND_FINDING_CONTRACTS = Object.freeze({
  validationEvidence: Object.freeze([
    "evidenceId",
    "evidenceKind",
    "targetReference",
    "dimension",
    "sourceReference",
    "explanation",
    "owner",
    "sourcePhase",
  ]),
  evidenceReference: Object.freeze([
    "referenceId",
    "referencedEvidenceId",
    "referenceKind",
    "owner",
  ]),
  supportingEvidence: Object.freeze(["supportsFindingId", "evidenceReference"]),
  contradictingEvidence: Object.freeze(["contradictsFindingId", "evidenceReference"]),
  missingEvidence: Object.freeze(["expectedEvidence", "impact", "dimension"]),
  validationFinding: Object.freeze([
    "findingId",
    "targetReference",
    "dimension",
    "severity",
    "status",
    "explanation",
    "impact",
    "recommendation",
    "evidenceReferences",
    "owner",
    "sourcePhase",
  ]),
  findingExplanation: Object.freeze(["summary", "detail", "evidenceAnchors"]),
  findingImpact: Object.freeze(["consumerImpact", "executiveImpact", "blocking"]),
  findingRecommendation: Object.freeze([
    "recommendationId",
    "declarationOnly",
    "text",
    "noDynamicGeneration",
  ]),
  findingOwnership: Object.freeze(["owner", "sourcePhase", "noTransfer"]),
  notes: Object.freeze({
    evidenceReferencedNotCopied: true,
    findingsExplainable: true,
    findingsTraceable: true,
    recommendationsAreDeclarationsOnly: true,
    noDynamicRecommendationGeneration: true,
  }),
});

export const AMBIGUITY_AND_CONFLICT_CONTRACTS = Object.freeze({
  ambiguousKnowledge: Object.freeze([
    "ambiguityId",
    "targetReference",
    "ambiguitySource",
    "candidates",
    "clarificationRequirement",
    "impact",
    "owner",
  ]),
  ambiguitySource: Object.freeze(["sourceKind", "sourceReference", "description"]),
  ambiguityCandidate: Object.freeze(["candidateId", "interpretation", "supportingEvidence"]),
  clarificationRequirement: Object.freeze([
    "required",
    "reason",
    "materialEffectOnMeaning",
    "noUserContactInThisPhase",
  ]),
  knowledgeConflict: Object.freeze([
    "conflictId",
    "participants",
    "conflictEvidence",
    "scope",
    "impact",
    "resolutionStatus",
    "owner",
  ]),
  conflictParticipants: Object.freeze(["participantReferences", "roles"]),
  conflictEvidence: Object.freeze(["evidenceReferences", "contradictionSummary"]),
  conflictScope: Object.freeze(["scopeKind", "affectedTargets", "boundaries"]),
  conflictImpact: Object.freeze(["blocksConclusions", "consumerImpact", "executiveImpact"]),
  conflictResolutionStatus: Object.freeze([
    "Unresolved",
    "Acknowledged",
    "Scoped",
    "Deferred",
    "Superseded",
  ] as const),
  notes: Object.freeze({
    identifiesAndRepresentsOnly: true,
    noEntityResolution: true,
    noSemanticChoice: true,
    noUserContact: true,
    noSourceModification: true,
  }),
});

export const KNOWLEDGE_VALIDATION_EXTENSION_POLICIES: readonly ExtensionPolicyDescriptor[] =
  Object.freeze([
    Object.freeze({
      policyId: "EXT-VAL-ADDITIVE",
      name: "Additive Validation Extensions",
      status: "AdditiveAllowed" as const,
      description:
        "New dimensions, targets, statuses, signals, evidence types, findings, conflicts, and ambiguity types may be added additively.",
    }),
    Object.freeze({
      policyId: "EXT-VAL-VERSIONED",
      name: "Versioned Extension Required",
      status: "AdditiveAllowed" as const,
      description:
        "Extensions must be explicit, versioned, backward-compatible, owned by DKL-5, and registered through future DKL-5 Registry.",
    }),
    Object.freeze({
      policyId: "EXT-VAL-CERTIFY",
      name: "Validate and Certify Before Release",
      status: "MigrationRequired" as const,
      description:
        "Extensions require validation and certification before public release.",
    }),
    Object.freeze({
      policyId: "EXT-VAL-RUNTIME-FORBIDDEN",
      name: "Mutable Runtime Registration Forbidden",
      status: "Forbidden" as const,
      description: "Mutable runtime registration of validation contracts is forbidden.",
    }),
  ]);

export const KNOWLEDGE_VALIDATION_COMPATIBILITY_POLICIES: readonly CompatibilityPolicyDescriptor[] =
  Object.freeze([
    Object.freeze({
      policyId: "COMPAT-DKL4-PUBLIC-INDEX",
      name: "DKL-4 Public Index Sole Upstream",
      status: "Compatible" as const,
      description:
        "DKL-5 consumes DKL-4 exclusively through knowledgeModelingPublicIndex.ts.",
    }),
    Object.freeze({
      policyId: "COMPAT-BACKWARD-ADDITIVE",
      name: "Backward-Compatible Additions",
      status: "Compatible" as const,
      description: "Additions must remain backward-compatible with released contracts.",
    }),
    Object.freeze({
      policyId: "COMPAT-STABLE-STATUS",
      name: "Stable Validation Status Meanings",
      status: "Compatible" as const,
      description: "Validation outcome status meanings must remain stable.",
    }),
    Object.freeze({
      policyId: "COMPAT-STABLE-SEVERITY",
      name: "Stable Severity Meanings",
      status: "Compatible" as const,
      description: "Severity meanings must remain stable.",
    }),
    Object.freeze({
      policyId: "COMPAT-STABLE-SIGNALS",
      name: "Stable Quality-Signal Identities",
      status: "Compatible" as const,
      description: "Quality-signal identities must remain stable once released.",
    }),
    Object.freeze({
      policyId: "COMPAT-NO-OWNERSHIP-TRANSFER",
      name: "No Ownership Transfer",
      status: "Forbidden" as const,
      description: "DKL-5 must not transfer or replace DKL-4 ownership.",
    }),
    Object.freeze({
      policyId: "COMPAT-NO-ENGINE",
      name: "No Direct Engine Behavior",
      status: "Forbidden" as const,
      description: "DKL-5 must not implement Executive Engine behavior.",
    }),
    Object.freeze({
      policyId: "COMPAT-NO-CLEANSING",
      name: "No Runtime Cleansing Responsibility",
      status: "Forbidden" as const,
      description: "DKL-5 must not assume data-cleaning or source-repair responsibility.",
    }),
    Object.freeze({
      policyId: "COMPAT-FORWARD-REGISTRY",
      name: "Forward Compatible to Registry",
      status: "ForwardCompatible" as const,
      description: "Foundation contracts are intended for DKL-5:2 Registry without schema rename.",
    }),
    Object.freeze({
      policyId: "COMPAT-ENGINE-RESTRICTED",
      name: "Executive Engine Restricted Downstream",
      status: "Restricted" as const,
      description:
        "Executive Engine may consume validation declarations later; Engine reasoning is not owned here.",
    }),
  ]);

export const PRODUCT_PHILOSOPHY = Object.freeze({
  executiveIntelligenceNotDataCleaning: true,
  assumeConnectedDataGenerallyUsable: true,
  avoidHeavyCleansingPipelines: true,
  avoidRepairingEverySourceProblem: true,
  detectImportantStructuralProblems: true,
  makeUncertaintyVisible: true,
  produceSimpleExplainableQualitySignals: true,
  preserveEvidenceAndProvenance: true,
  askClarificationOnlyWhenMaterial: true,
  neverClaimCertaintyWithoutEvidence: true,
  allowUsabilityWithDeclaredLimitations: true,
  communicateWhatWeKnowAndLimitations: true,
});

/** Canonical immutable Knowledge Validation contracts. */
export const KnowledgeValidationContracts = Object.freeze({
  definition: KNOWLEDGE_VALIDATION_DEFINITION,
  terminology: KNOWLEDGE_VALIDATION_TERMINOLOGY,
  contractKinds: VALIDATION_CONTRACT_KINDS,
  targetCategories: VALIDATION_TARGET_CATEGORIES,
  dimensions: VALIDATION_DIMENSIONS,
  qualitySignals: KNOWLEDGE_QUALITY_SIGNALS,
  trustLevels: TRUST_LEVELS,
  trustDeclaration: KNOWLEDGE_TRUST_DECLARATION_CONTRACT,
  outcomes: VALIDATION_OUTCOMES,
  outcomeStatuses: Object.freeze(
    VALIDATION_OUTCOMES.map((o) => o.status),
  ) as readonly ValidationOutcomeStatus[],
  severities: VALIDATION_SEVERITIES,
  evidenceKinds: EVIDENCE_KINDS,
  evidenceAndFindings: EVIDENCE_AND_FINDING_CONTRACTS,
  ambiguityAndConflict: AMBIGUITY_AND_CONFLICT_CONTRACTS,
  productPhilosophy: PRODUCT_PHILOSOPHY,
  extensionPolicies: KNOWLEDGE_VALIDATION_EXTENSION_POLICIES,
  compatibilityPolicies: KNOWLEDGE_VALIDATION_COMPATIBILITY_POLICIES,
  dkl4TargetMappingByReference: true,
  noRuntimeTargetInstances: true,
  noChecksExecuted: true,
  noScoreCalculation: true,
  noTrustCalculation: true,
  notes: Object.freeze({
    metadataOnly: true,
    definitionsOnly: true,
    noRuntimeValidation: true,
    noDataCleansing: true,
    noAiConfidence: true,
    noInference: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
