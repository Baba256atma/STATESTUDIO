/**
 * DKL-8:2 — Knowledge Governance Policy Registry.
 *
 * Registers classification, sensitivity, access, usage, retention, disposition,
 * audit, compliance, evidence, exception, policy-reference, and decision-
 * reference vocabularies from DKL-8:1. Metadata only.
 *
 * Ownership: owned exclusively by DKL-8:2.
 */

import { KnowledgeGovernanceFoundationPlatform } from "./knowledgeGovernanceFoundation.ts";
import type {
  KnowledgeGovernanceAccessIntentRegistration,
  KnowledgeGovernanceAuditIntentRegistration,
  KnowledgeGovernanceClassificationRegistration,
  KnowledgeGovernanceComplianceIntentRegistration,
  KnowledgeGovernanceDecisionReferenceKindRegistration,
  KnowledgeGovernanceDispositionRegistration,
  KnowledgeGovernanceEvidenceKindRegistration,
  KnowledgeGovernanceExceptionCategoryRegistration,
  KnowledgeGovernancePolicyReferenceKindRegistration,
  KnowledgeGovernanceRetentionRegistration,
  KnowledgeGovernanceSensitivityRegistration,
  KnowledgeGovernanceUsagePolicyRegistration,
} from "./knowledgeGovernanceRegistryTypes.ts";

const foundation = KnowledgeGovernanceFoundationPlatform;

const MUTATING_ACCESS = Object.freeze(
  new Set(["Modify", "Approve", "Archive", "Delete", "Administer"]),
);

/** Five classification registrations in foundation order. */
export const KnowledgeGovernanceClassificationRegistry: readonly KnowledgeGovernanceClassificationRegistration[] =
  Object.freeze(
    foundation.classification.map((item) =>
      Object.freeze({
        id: `DKL-8:2/Classification/${item.level}`,
        name: item.level,
        description: item.description,
        category: "classification" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: item.deterministicOrder,
        level: item.level,
        ordinal: item.deterministicOrder,
        relativeRestriction: item.deterministicOrder,
        impliesPermissions: false as const,
      }),
    ),
  );

/** Thirteen sensitivity dimension registrations. */
export const KnowledgeGovernanceSensitivityRegistry: readonly KnowledgeGovernanceSensitivityRegistration[] =
  Object.freeze(
    foundation.sensitivity.map((item) =>
      Object.freeze({
        id: `DKL-8:2/Sensitivity/${item.dimension}`,
        name: item.dimension,
        description: item.description,
        category: "sensitivity" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: item.deterministicOrder,
        dimension: item.dimension,
        independentFromClassification: true as const,
        implementsPrivacyLaw: false as const,
      }),
    ),
  );

/** Twelve access intent registrations. */
export const KnowledgeGovernanceAccessIntentRegistry: readonly KnowledgeGovernanceAccessIntentRegistration[] =
  Object.freeze(
    foundation.accessIntent.map((item) =>
      Object.freeze({
        id: `DKL-8:2/AccessIntent/${item.intent}`,
        name: item.intent,
        description: item.description,
        category: "accessIntent" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: item.deterministicOrder,
        intent: item.intent,
        intentCategory: "Access" as const,
        mutatingMeaning: MUTATING_ACCESS.has(item.intent),
        governanceSignificance: item.description,
        runtimeEnforcementStatus: "Unavailable" as const,
      }),
    ),
  );

/** Usage policy category registrations from foundation usage policy. */
export const KnowledgeGovernanceUsagePolicyRegistry: readonly KnowledgeGovernanceUsagePolicyRegistration[] =
  Object.freeze([
    Object.freeze({
      id: "DKL-8:2/UsagePolicy/KnowledgeUsagePolicy",
      name: "KnowledgeUsagePolicy",
      description: foundation.usagePolicy.description,
      category: "usagePolicy" as const,
      status: "Registered" as const,
      owner: "DKL-8" as const,
      sourcePhase: "DKL-8:1" as const,
      version: "1.0.0" as const,
      stability: "FoundationAligned" as const,
      public: true as const,
      deprecated: false as const,
      runtimeBehavior: "None" as const,
      metadataOnly: true as const,
      deterministicOrder: 1,
      executesPolicy: false as const,
    }),
  ]);

/** Nine retention intent registrations. */
export const KnowledgeGovernanceRetentionRegistry: readonly KnowledgeGovernanceRetentionRegistration[] =
  Object.freeze(
    foundation.retention.map((item) =>
      Object.freeze({
        id: `DKL-8:2/Retention/${item.retentionKind}`,
        name: item.retentionKind,
        description: item.description,
        category: "retention" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: item.deterministicOrder,
        retentionKind: item.retentionKind,
        schedulesDeletion: false as const,
      }),
    ),
  );

/** Eight disposition intent registrations. */
export const KnowledgeGovernanceDispositionRegistry: readonly KnowledgeGovernanceDispositionRegistration[] =
  Object.freeze(
    foundation.disposition.map((item) =>
      Object.freeze({
        id: `DKL-8:2/Disposition/${item.dispositionKind}`,
        name: item.dispositionKind,
        description: item.description,
        category: "disposition" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: item.deterministicOrder,
        dispositionKind: item.dispositionKind,
        representsIntentOnly: true as const,
        executesDisposition: false as const,
      }),
    ),
  );

/** Five audit intent registrations. */
export const KnowledgeGovernanceAuditIntentRegistry: readonly KnowledgeGovernanceAuditIntentRegistration[] =
  Object.freeze(
    foundation.audit.map((item) =>
      Object.freeze({
        id: `DKL-8:2/AuditIntent/${item.category}`,
        name: item.category,
        description: item.description,
        category: "auditIntent" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: item.deterministicOrder,
        auditCategory: item.category,
        implementsLogging: false as const,
      }),
    ),
  );

/** Four compliance intent registrations. */
export const KnowledgeGovernanceComplianceIntentRegistry: readonly KnowledgeGovernanceComplianceIntentRegistration[] =
  Object.freeze(
    foundation.compliance.map((item) =>
      Object.freeze({
        id: `DKL-8:2/ComplianceIntent/${item.category}`,
        name: item.category,
        description: item.description,
        category: "complianceIntent" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: item.deterministicOrder,
        complianceCategory: item.category,
        interpretsLaw: false as const,
        executesControls: false as const,
      }),
    ),
  );

/** Twelve evidence kind registrations. */
export const KnowledgeGovernanceEvidenceKindRegistry: readonly KnowledgeGovernanceEvidenceKindRegistration[] =
  Object.freeze(
    foundation.evidence.map((item) =>
      Object.freeze({
        id: `DKL-8:2/Evidence/${item.evidenceKind}`,
        name: item.evidenceKind,
        description: item.description,
        category: "evidenceKind" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: item.deterministicOrder,
        evidenceKind: item.evidenceKind,
        referenceOnly: true as const,
      }),
    ),
  );

const EXCEPTION_CATEGORIES = Object.freeze([
  "ClassificationException",
  "AccessException",
  "RetentionException",
  "DispositionException",
  "UsageException",
  "ComplianceException",
  "OwnershipException",
  "LifecycleException",
] as const);

/** Eight exception category registrations supported by foundation exception contract. */
export const KnowledgeGovernanceExceptionCategoryRegistry: readonly KnowledgeGovernanceExceptionCategoryRegistration[] =
  Object.freeze(
    EXCEPTION_CATEGORIES.map((exceptionCategory, index) =>
      Object.freeze({
        id: `DKL-8:2/ExceptionCategory/${exceptionCategory}`,
        name: exceptionCategory,
        description: `Declarative ${exceptionCategory} category under foundation exception contract.`,
        category: "exceptionCategory" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: index + 1,
        exceptionCategory,
        grantsAutomatically: false as const,
        implementsWorkflow: false as const,
      }),
    ),
  );

/** Policy reference kind registry. */
export const KnowledgeGovernancePolicyReferenceKindRegistry: readonly KnowledgeGovernancePolicyReferenceKindRegistration[] =
  Object.freeze([
    Object.freeze({
      id: "DKL-8:2/PolicyReferenceKind/KnowledgePolicyReference",
      name: "KnowledgePolicyReference",
      description: foundation.policyReference.description,
      category: "policyReferenceKind" as const,
      status: "Registered" as const,
      owner: "DKL-8" as const,
      sourcePhase: "DKL-8:1" as const,
      version: "1.0.0" as const,
      stability: "FoundationAligned" as const,
      public: true as const,
      deprecated: false as const,
      runtimeBehavior: "None" as const,
      metadataOnly: true as const,
      deterministicOrder: 1,
      referenceOnly: true as const,
    }),
  ]);

/** Decision reference kind registry. */
export const KnowledgeGovernanceDecisionReferenceKindRegistry: readonly KnowledgeGovernanceDecisionReferenceKindRegistration[] =
  Object.freeze([
    Object.freeze({
      id: "DKL-8:2/DecisionReferenceKind/KnowledgeGovernanceDecisionReference",
      name: "KnowledgeGovernanceDecisionReference",
      description: foundation.decisionReference.description,
      category: "decisionReferenceKind" as const,
      status: "Registered" as const,
      owner: "DKL-8" as const,
      sourcePhase: "DKL-8:1" as const,
      version: "1.0.0" as const,
      stability: "FoundationAligned" as const,
      public: true as const,
      deprecated: false as const,
      runtimeBehavior: "None" as const,
      metadataOnly: true as const,
      deterministicOrder: 1,
      makesExecutiveDecision: false as const,
      referenceOnly: true as const,
    }),
  ]);
