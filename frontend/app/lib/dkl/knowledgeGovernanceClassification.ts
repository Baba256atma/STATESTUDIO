/**
 * DKL-8:1 — Knowledge Governance Classification.
 *
 * Classification, sensitivity, access intent, retention, and disposition
 * vocabularies. Declarative metadata only — no enforcement.
 *
 * Ownership: owned exclusively by DKL-8:1.
 */

import type {
  KnowledgeAccessIntent,
  KnowledgeClassification,
  KnowledgeClassificationLevel,
  KnowledgeDispositionKind,
  KnowledgeDispositionPolicy,
  KnowledgeRetentionKind,
  KnowledgeRetentionPolicy,
  KnowledgeSensitivity,
  KnowledgeSensitivityDimension,
} from "./knowledgeGovernanceFoundationTypes.ts";

const classification = (
  level: KnowledgeClassificationLevel,
  description: string,
  order: number,
): KnowledgeClassification =>
  Object.freeze({
    classificationId: `DKL-8:1/Classification/${level}`,
    level,
    description,
    separateFromAccessPermission: true as const,
    separateFromTrustLevel: true as const,
    separateFromValidationResult: true as const,
    separateFromBusinessPriority: true as const,
    separateFromExecutiveImportance: true as const,
    separateFromDataQuality: true as const,
    deterministicOrder: order,
  });

/** Five classification levels — separate from access/trust/quality. */
export const KnowledgeGovernanceClassifications: readonly KnowledgeClassification[] =
  Object.freeze([
    classification("Public", "May be shared without organizational restriction.", 1),
    classification("Internal", "Intended for internal organizational use.", 2),
    classification(
      "Confidential",
      "Requires controlled internal handling.",
      3,
    ),
    classification(
      "Restricted",
      "Requires elevated restriction and limited circulation.",
      4,
    ),
    classification(
      "HighlyRestricted",
      "Highest classification restriction within DKL-8 vocabulary.",
      5,
    ),
  ]);

const sensitivity = (
  dimension: KnowledgeSensitivityDimension,
  description: string,
  order: number,
): KnowledgeSensitivity =>
  Object.freeze({
    sensitivityId: `DKL-8:1/Sensitivity/${dimension}`,
    dimension,
    description,
    independentFromClassification: true as const,
    implementsPrivacyLaw: false as const,
    deterministicOrder: order,
  });

/** Sensitivity dimensions — independent of classification. */
export const KnowledgeGovernanceSensitivities: readonly KnowledgeSensitivity[] =
  Object.freeze([
    sensitivity("Personal", "Personal information sensitivity.", 1),
    sensitivity("Financial", "Financial information sensitivity.", 2),
    sensitivity("Commercial", "Commercial information sensitivity.", 3),
    sensitivity("Operational", "Operational information sensitivity.", 4),
    sensitivity("Strategic", "Strategic information sensitivity.", 5),
    sensitivity("Legal", "Legal information sensitivity.", 6),
    sensitivity("Security", "Security information sensitivity.", 7),
    sensitivity("Executive", "Executive information sensitivity.", 8),
    sensitivity("Customer", "Customer information sensitivity.", 9),
    sensitivity("Employee", "Employee information sensitivity.", 10),
    sensitivity("Supplier", "Supplier information sensitivity.", 11),
    sensitivity("Contractual", "Contractual information sensitivity.", 12),
    sensitivity(
      "IntellectualProperty",
      "Intellectual property information sensitivity.",
      13,
    ),
  ]);

const access = (
  intent: KnowledgeAccessIntent["intent"],
  description: string,
  order: number,
): KnowledgeAccessIntent =>
  Object.freeze({
    accessIntentId: `DKL-8:1/AccessIntent/${intent}`,
    intent,
    description,
    declarativeOnly: true as const,
    authenticates: false as const,
    authorizes: false as const,
    issuesTokens: false as const,
    enforcesPermissions: false as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Access intents — governance metadata, not enforcement. */
export const KnowledgeGovernanceAccessIntents: readonly KnowledgeAccessIntent[] =
  Object.freeze([
    access("Read", "Intent to read governed knowledge.", 1),
    access("Reference", "Intent to reference governed knowledge.", 2),
    access("Query", "Intent to query governed knowledge.", 3),
    access("Traverse", "Intent to traverse related governed knowledge.", 4),
    access("Export", "Intent to export governed knowledge.", 5),
    access("Share", "Intent to share governed knowledge.", 6),
    access("Modify", "Intent to modify governed knowledge.", 7),
    access("Approve", "Intent to approve a governance action.", 8),
    access("Archive", "Intent to archive governed knowledge.", 9),
    access("Delete", "Intent to delete governed knowledge.", 10),
    access("Audit", "Intent to audit governed knowledge use.", 11),
    access("Administer", "Intent to administer governance settings.", 12),
  ]);

const retention = (
  retentionKind: KnowledgeRetentionKind,
  description: string,
  order: number,
): KnowledgeRetentionPolicy =>
  Object.freeze({
    retentionId: `DKL-8:1/Retention/${retentionKind}`,
    retentionKind,
    description,
    schedulesDeletion: false as const,
    mutatesRepository: false as const,
    deterministicOrder: order,
  });

/** Retention intents — no deletion scheduling. */
export const KnowledgeGovernanceRetentions: readonly KnowledgeRetentionPolicy[] =
  Object.freeze([
    retention("Permanent", "Retain permanently under policy.", 1),
    retention("FixedDuration", "Retain for a fixed declared duration.", 2),
    retention("UntilSuperseded", "Retain until superseded.", 3),
    retention("UntilProjectClosure", "Retain until project closure.", 4),
    retention("UntilContractClosure", "Retain until contract closure.", 5),
    retention("UntilLegalRelease", "Retain until legal release.", 6),
    retention("UntilPolicyChange", "Retain until policy change.", 7),
    retention("ManualReview", "Retain pending manual review.", 8),
    retention("Unspecified", "Retention not yet specified.", 9),
  ]);

const disposition = (
  dispositionKind: KnowledgeDispositionKind,
  description: string,
  order: number,
): KnowledgeDispositionPolicy =>
  Object.freeze({
    dispositionId: `DKL-8:1/Disposition/${dispositionKind}`,
    dispositionKind,
    description,
    executesDisposition: false as const,
    mutatesRepository: false as const,
    deterministicOrder: order,
  });

/** Disposition intents — no repository mutation. */
export const KnowledgeGovernanceDispositions: readonly KnowledgeDispositionPolicy[] =
  Object.freeze([
    disposition("Retain", "Retain governed knowledge in place.", 1),
    disposition("Archive", "Archive governed knowledge.", 2),
    disposition("Anonymize", "Anonymize governed knowledge.", 3),
    disposition("Detach", "Detach governed knowledge from active use.", 4),
    disposition("Restrict", "Restrict governed knowledge further.", 5),
    disposition("Delete", "Delete governed knowledge when authorized.", 6),
    disposition("Review", "Review disposition before action.", 7),
    disposition("Transfer", "Transfer governed knowledge custody.", 8),
  ]);

/** Classification package aggregate for foundation platform section. */
export const KnowledgeGovernanceClassificationPackage = Object.freeze({
  packageId: "DKL-8:1/ClassificationPackage",
  classifications: KnowledgeGovernanceClassifications,
  sensitivities: KnowledgeGovernanceSensitivities,
  accessIntents: KnowledgeGovernanceAccessIntents,
  retentions: KnowledgeGovernanceRetentions,
  dispositions: KnowledgeGovernanceDispositions,
  classificationSeparateFromSensitivity: true as const,
  accessIntentIsNotEnforcement: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
