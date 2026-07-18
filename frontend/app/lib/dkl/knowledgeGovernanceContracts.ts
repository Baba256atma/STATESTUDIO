/**
 * DKL-8:1 — Knowledge Governance Contracts.
 *
 * Canonical governance foundation contracts, subjects, evidence kinds,
 * audit/compliance intents, and exception contracts. Declarations only.
 *
 * Ownership: owned exclusively by DKL-8:1.
 */

import type {
  KnowledgeAuditIntent,
  KnowledgeComplianceIntent,
  KnowledgeGovernanceContractDeclaration,
  KnowledgeGovernanceDecisionReference,
  KnowledgeGovernanceEvidence,
  KnowledgeGovernanceException,
  KnowledgeGovernanceSubject,
  KnowledgeGovernanceSubjectType,
  KnowledgePolicyReference,
  KnowledgeUsagePolicy,
} from "./knowledgeGovernanceFoundationTypes.ts";

const contract = (
  key: string,
  contractName: string,
  description: string,
  fields: readonly string[],
  order: number,
): KnowledgeGovernanceContractDeclaration =>
  Object.freeze({
    contractId: `DKL-8:1/Contract/${key}`,
    contractName,
    description,
    fields: Object.freeze([...fields]),
    metadataOnly: true as const,
    immutable: true as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Eighteen required foundation governance contracts. */
export const KnowledgeGovernanceContracts: readonly KnowledgeGovernanceContractDeclaration[] =
  Object.freeze([
    contract(
      "KnowledgeOwnership",
      "Knowledge Ownership",
      "Accountable ownership of governed organizational knowledge.",
      Object.freeze(["ownerRole", "subjectReference", "accountability"]),
      1,
    ),
    contract(
      "KnowledgeStewardship",
      "Knowledge Stewardship",
      "Stewardship for governance quality and policy alignment.",
      Object.freeze(["stewardRole", "subjectReference", "qualityDuty"]),
      2,
    ),
    contract(
      "KnowledgeClassification",
      "Knowledge Classification",
      "Classification level for governed knowledge.",
      Object.freeze(["classificationLevel", "subjectReference"]),
      3,
    ),
    contract(
      "KnowledgeSensitivity",
      "Knowledge Sensitivity",
      "Sensitivity dimensions independent of classification.",
      Object.freeze(["sensitivityDimensions", "subjectReference"]),
      4,
    ),
    contract(
      "KnowledgeAccessIntent",
      "Knowledge Access Intent",
      "Declarative access intent metadata — not enforcement.",
      Object.freeze(["accessIntent", "subjectReference", "policyReference"]),
      5,
    ),
    contract(
      "KnowledgeUsagePolicy",
      "Knowledge Usage Policy",
      "Declarative usage policy applicability for governed knowledge.",
      Object.freeze(["usagePolicyReference", "subjectReference", "scope"]),
      6,
    ),
    contract(
      "KnowledgeRetention",
      "Knowledge Retention",
      "Retention intent for governed knowledge.",
      Object.freeze(["retentionKind", "subjectReference", "policyReference"]),
      7,
    ),
    contract(
      "KnowledgeDisposition",
      "Knowledge Disposition",
      "Disposition intent for governed knowledge.",
      Object.freeze(["dispositionKind", "subjectReference", "policyReference"]),
      8,
    ),
    contract(
      "KnowledgeLineageGovernance",
      "Knowledge Lineage Governance",
      "Governance of lineage references without reconstructing lineage graphs.",
      Object.freeze(["lineageReference", "subjectReference", "policyReference"]),
      9,
    ),
    contract(
      "KnowledgeVersionGovernance",
      "Knowledge Version Governance",
      "Governance of knowledge version references.",
      Object.freeze(["versionReference", "subjectReference", "policyReference"]),
      10,
    ),
    contract(
      "KnowledgeAuditIntent",
      "Knowledge Audit Intent",
      "Audit requirement metadata — not audit storage or listeners.",
      Object.freeze([
        "auditRequirement",
        "actorRole",
        "eventCategory",
        "evidenceReferences",
      ]),
      11,
    ),
    contract(
      "KnowledgeComplianceIntent",
      "Knowledge Compliance Intent",
      "Compliance intent metadata — not legal interpretation or control execution.",
      Object.freeze([
        "complianceReference",
        "controlReference",
        "subjectReference",
      ]),
      12,
    ),
    contract(
      "KnowledgeLifecycleGovernance",
      "Knowledge Lifecycle Governance",
      "Declarative governance lifecycle states and allowed transitions.",
      Object.freeze(["lifecycleState", "allowedTransitions", "subjectReference"]),
      13,
    ),
    contract(
      "KnowledgePolicyApplicability",
      "Knowledge Policy Applicability",
      "Which policies apply to a governed subject.",
      Object.freeze(["policyReferences", "subjectReference", "scope"]),
      14,
    ),
    contract(
      "KnowledgeExceptionIntent",
      "Knowledge Exception Intent",
      "Exception request metadata without approval workflow execution.",
      Object.freeze([
        "requestedException",
        "affectedRule",
        "reason",
        "scope",
        "status",
      ]),
      15,
    ),
    contract(
      "KnowledgeGovernanceEvidence",
      "Knowledge Governance Evidence",
      "Evidence references explaining governance state without embedding objects.",
      Object.freeze(["evidenceKind", "reference", "subjectReference"]),
      16,
    ),
    contract(
      "GovernanceDecisionReference",
      "Governance Decision Reference",
      "Reference to a governance or executive decision without making decisions.",
      Object.freeze(["decisionReference", "subjectReference"]),
      17,
    ),
    contract(
      "GovernanceBoundaries",
      "Governance Boundaries",
      "Explicit ownership and prohibition boundaries for Knowledge Governance.",
      Object.freeze(["owns", "doesNotOwn", "prohibitedSurfaces"]),
      18,
    ),
  ]);

const subject = (
  subjectType: KnowledgeGovernanceSubjectType,
  description: string,
  order: number,
): KnowledgeGovernanceSubject =>
  Object.freeze({
    subjectTypeId: `DKL-8:1/Subject/${subjectType}`,
    subjectType,
    description,
    machineReadable: true as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Closed governance subject vocabulary. */
export const KnowledgeGovernanceSubjects: readonly KnowledgeGovernanceSubject[] =
  Object.freeze([
    subject("KnowledgeObject", "Governed organizational knowledge object.", 1),
    subject("BusinessObject", "Governed business object knowledge subject.", 2),
    subject("Entity", "Governed entity knowledge subject.", 3),
    subject("Relationship", "Governed relationship knowledge subject.", 4),
    subject("DocumentKnowledge", "Governed document knowledge subject.", 5),
    subject("EventKnowledge", "Governed event knowledge subject.", 6),
    subject("MetricKnowledge", "Governed metric knowledge subject.", 7),
    subject("DecisionKnowledge", "Governed decision knowledge subject.", 8),
    subject(
      "OperationalKnowledge",
      "Governed operational knowledge subject.",
      9,
    ),
    subject("StrategicKnowledge", "Governed strategic knowledge subject.", 10),
    subject(
      "ConversationKnowledge",
      "Governed conversation knowledge subject.",
      11,
    ),
    subject("RepositoryRecord", "Governed repository record subject.", 12),
    subject("KnowledgeVersion", "Governed knowledge version subject.", 13),
    subject("KnowledgeSnapshot", "Governed knowledge snapshot subject.", 14),
    subject(
      "KnowledgeServiceResult",
      "Governed knowledge service result subject.",
      15,
    ),
    subject(
      "KnowledgeGraphSegment",
      "Governed knowledge graph segment subject.",
      16,
    ),
    subject("Metadata", "Governed metadata subject.", 17),
    subject("DerivedKnowledge", "Governed derived knowledge subject.", 18),
    subject(
      "ExternalKnowledgeReference",
      "Governed external knowledge reference subject.",
      19,
    ),
  ]);

const evidence = (
  kind: KnowledgeGovernanceEvidence["evidenceKind"],
  description: string,
  order: number,
): KnowledgeGovernanceEvidence =>
  Object.freeze({
    evidenceKindId: `DKL-8:1/Evidence/${kind}`,
    evidenceKind: kind,
    description,
    referenceOnly: true as const,
    embedsUpstreamObject: false as const,
    deterministicOrder: order,
  });

/** Governance evidence kinds — references only. */
export const KnowledgeGovernanceEvidenceKinds: readonly KnowledgeGovernanceEvidence[] =
  Object.freeze([
    evidence("Policy", "Reference to a governing policy.", 1),
    evidence("Contract", "Reference to a governing contract.", 2),
    evidence("Source", "Reference to a knowledge source.", 3),
    evidence("OwnerDeclaration", "Reference to an owner declaration.", 4),
    evidence("StewardReview", "Reference to a steward review.", 5),
    evidence("AuditResult", "Reference to an audit result.", 6),
    evidence(
      "ComplianceRequirement",
      "Reference to a compliance requirement.",
      7,
    ),
    evidence("ExecutiveDecision", "Reference to an executive decision.", 8),
    evidence("SystemRule", "Reference to a system rule.", 9),
    evidence("RepositoryRecord", "Reference to a repository record identity.", 10),
    evidence("KnowledgeVersion", "Reference to a knowledge version identity.", 11),
    evidence("ExternalAuthority", "Reference to an external authority.", 12),
  ]);

const audit = (
  key: string,
  category: string,
  description: string,
  order: number,
): KnowledgeAuditIntent =>
  Object.freeze({
    auditIntentId: `DKL-8:1/AuditIntent/${key}`,
    category,
    description,
    implementsLogging: false as const,
    storesAuditEvents: false as const,
    evaluatesCompliance: false as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Audit intent vocabulary — metadata only. */
export const KnowledgeGovernanceAuditIntents: readonly KnowledgeAuditIntent[] =
  Object.freeze([
    audit(
      "AuditRequirement",
      "AuditRequirement",
      "Declares that audit evidence is required.",
      1,
    ),
    audit(
      "AuditActorRole",
      "AuditActorRole",
      "Declares the actor role expected for audit activity.",
      2,
    ),
    audit(
      "AuditEventCategory",
      "AuditEventCategory",
      "Declares categories of governance audit events.",
      3,
    ),
    audit(
      "RequiredEvidence",
      "RequiredEvidence",
      "Declares required evidence references for governance states.",
      4,
    ),
    audit(
      "ReviewFrequency",
      "ReviewFrequency",
      "Declares review frequency intent without scheduling.",
      5,
    ),
  ]);

const compliance = (
  key: string,
  category: string,
  description: string,
  order: number,
): KnowledgeComplianceIntent =>
  Object.freeze({
    complianceIntentId: `DKL-8:1/ComplianceIntent/${key}`,
    category,
    description,
    interpretsLaw: false as const,
    executesControls: false as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Compliance intent vocabulary — metadata only. */
export const KnowledgeGovernanceComplianceIntents: readonly KnowledgeComplianceIntent[] =
  Object.freeze([
    compliance(
      "ComplianceReference",
      "ComplianceReference",
      "Reference to a compliance requirement without legal interpretation.",
      1,
    ),
    compliance(
      "ControlReference",
      "ControlReference",
      "Reference to a control without executing the control.",
      2,
    ),
    compliance(
      "ExceptionReference",
      "ExceptionReference",
      "Reference to a governance exception record.",
      3,
    ),
    compliance(
      "GovernanceDecisionReference",
      "GovernanceDecisionReference",
      "Reference to a governance decision without making decisions.",
      4,
    ),
  ]);

/** Exception contract — no workflow execution. */
export const KnowledgeGovernanceExceptionContract: KnowledgeGovernanceException =
  Object.freeze({
    exceptionContractId: "DKL-8:1/Exception/KnowledgeGovernanceException",
    description:
      "Declarative exception request for a governance rule without approval workflow.",
    fields: Object.freeze([
      "requestedException",
      "affectedGovernanceRule",
      "reason",
      "requesterRole",
      "approverRole",
      "scope",
      "validityPeriod",
      "evidenceReferences",
      "reviewRequirement",
      "status",
    ]),
    grantsAutomatically: false,
    implementsWorkflow: false,
    createsTasks: false,
    sendsNotifications: false,
  });

/** Usage policy contract placeholder — declarative only. */
export const KnowledgeGovernanceUsagePolicy: KnowledgeUsagePolicy =
  Object.freeze({
    policyContractId: "DKL-8:1/UsagePolicy/KnowledgeUsagePolicy",
    description: "Declarative usage policy applicability contract.",
    declarativeOnly: true,
    executesPolicy: false,
  });

/** Policy reference contract — references only. */
export const KnowledgeGovernancePolicyReference: KnowledgePolicyReference =
  Object.freeze({
    policyReferenceId: "DKL-8:1/PolicyReference/KnowledgePolicyReference",
    description: "Reference to an applicable governance policy.",
    referenceOnly: true,
    embedsPolicyBody: false,
  });

/** Decision reference contract — no executive reasoning. */
export const KnowledgeGovernanceDecisionReferenceContract: KnowledgeGovernanceDecisionReference =
  Object.freeze({
    decisionReferenceId:
      "DKL-8:1/DecisionReference/KnowledgeGovernanceDecisionReference",
    description:
      "Reference to a governance or executive decision without decision-making.",
    referenceOnly: true,
    makesExecutiveDecision: false,
  });
