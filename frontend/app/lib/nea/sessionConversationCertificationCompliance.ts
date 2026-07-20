/**
 * NEA-3:7 — Session & Conversation Certification Compliance.
 *
 * Immutable architectural compliance declarations for Session & Conversation.
 * Declarative only. No runtime evaluation.
 *
 * Ownership: owned exclusively by NEA-3:7.
 */

import {
  SessionConversationPlatform,
  SessionConversationPlatformId,
} from "./sessionConversationPlatform.ts";
import type { SessionConversationComplianceDeclaration } from "./sessionConversationCertificationTypes.ts";

const platform = SessionConversationPlatform;

const compliance = (
  key: string,
  complianceName: string,
  description: string,
  order: number,
): SessionConversationComplianceDeclaration =>
  Object.freeze({
    complianceId: `NEA-3:7/Compliance/${key}`,
    complianceName,
    description,
    compliant: true as const,
    platformReference: `${SessionConversationPlatformId}/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical compliance declarations. */
export const SessionConversationCertificationComplianceDeclarations: readonly SessionConversationComplianceDeclaration[] =
  Object.freeze([
    compliance(
      "PhaseChain",
      "Phase Chain",
      "NEA-3:1 through NEA-3:6 phase chain is composed through Platform namespace.",
      1,
    ),
    compliance(
      "CanonicalReferences",
      "Canonical References",
      "All upstream surfaces are referenced; none are reconstructed.",
      2,
    ),
    compliance(
      "SessionIdentityRegistry",
      "Session Identity Registry",
      "Session identities are certified through the Registry collections surface.",
      3,
    ),
    compliance(
      "ConversationIdentityRegistry",
      "Conversation Identity Registry",
      "Conversation identities are certified through the Registry collections surface.",
      4,
    ),
    compliance(
      "Ownership",
      "Ownership",
      "Ownership remains unique per phase; Platform does not claim upstream ownership.",
      5,
    ),
    compliance(
      "Inventories",
      "Inventories",
      "Inventories are derived from canonical collections without hardcoding.",
      6,
    ),
    compliance(
      "NamespaceComposition",
      "Namespace Composition",
      "Platform namespace includes foundation, registry, model, validation, manifest, and platform.",
      7,
    ),
    compliance(
      "PublicSurface",
      "Public Surface",
      "Each phase exposes a controlled eight-export public surface.",
      8,
    ),
    compliance(
      "Immutability",
      "Immutability",
      "Platform and upstream surfaces declare immutable metadata-only architecture.",
      9,
    ),
    compliance(
      "DependencyDirection",
      "Dependency Direction",
      "Dependency direction is Platform → Manifest → Validation → Model → Registry → Foundation.",
      10,
    ),
  ]);

/** Canonical immutable compliance catalog. */
export const SessionConversationCertificationComplianceCatalog = Object.freeze({
  catalogId: "NEA-3:7/ComplianceCatalog",
  sourcePhase: "NEA-3:7" as const,
  platformId: SessionConversationPlatformId,
  declarations: SessionConversationCertificationComplianceDeclarations,
  complianceCount:
    SessionConversationCertificationComplianceDeclarations.length,
  allCompliant: SessionConversationCertificationComplianceDeclarations.every(
    (item) => item.compliant === true,
  ),
  platformManifestOnly: platform.dependency.manifestOnly,
  platformImmutable: platform.immutable,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
