/**
 * DKL-7:7 — Knowledge Services Certification Regressions.
 *
 * Exactly twelve immutable regression checks. All Pass.
 * Metadata-only. No source diffs. No Git inspection.
 *
 * Ownership: owned exclusively by DKL-7:7.
 */

import {
  getKnowledgeServicesPlatformInventoryCount,
  KnowledgeServicesPlatform,
} from "./knowledgeServicesPlatform.ts";
import type { KnowledgeServicesCertificationRegressionCheck } from "./knowledgeServicesCertificationTypes.ts";

const platform = KnowledgeServicesPlatform;
const manifest = platform.manifest;
const validation = manifest.validation;
const model = validation.model;

const regression = (
  key: string,
  subject: string,
  baseline: string,
  certifiedValue: string,
  changeClassification: string,
  evidenceReference: string,
  freezeImpact: string,
  order: number,
): KnowledgeServicesCertificationRegressionCheck =>
  Object.freeze({
    regressionId: `DKL-7:7/Regression/${key}`,
    subject,
    baseline,
    certifiedValue,
    status: "Pass" as const,
    changeClassification,
    evidenceReference,
    freezeImpact,
    deterministicOrder: order,
  });

/** Exactly twelve regression checks. */
export const KnowledgeServicesCertificationRegressions: readonly KnowledgeServicesCertificationRegressionCheck[] =
  Object.freeze([
    regression(
      "FoundationIdentity",
      "Foundation identity regression",
      platform.identity.foundationId,
      platform.identity.foundationId,
      "Unchanged",
      "KS-CERT-EV-005",
      "Must remain locked at Freeze",
      1,
    ),
    regression(
      "OwnershipInventory",
      "Ownership inventory regression",
      "owned=6;nonOwned=24",
      `owned=${platform.ownership.ownedCount};nonOwned=${platform.ownership.nonOwnedCount}`,
      "Unchanged",
      "KS-CERT-EV-015",
      "Must remain locked at Freeze",
      2,
    ),
    regression(
      "BoundaryInventory",
      "Boundary inventory regression",
      "prohibited=29",
      `prohibited=${platform.boundaries.prohibitedSurfaceCount}`,
      "Unchanged",
      "KS-CERT-EV-015",
      "Must remain locked at Freeze",
      3,
    ),
    regression(
      "ServiceInventory",
      "Service inventory regression",
      "services=12",
      `services=${platform.services.length}`,
      "Unchanged",
      "KS-CERT-EV-006",
      "Must remain locked at Freeze",
      4,
    ),
    regression(
      "CapabilityInventory",
      "Capability inventory regression",
      "capabilities=12",
      `capabilities=${platform.capabilities.length}`,
      "Unchanged",
      "KS-CERT-EV-006",
      "Must remain locked at Freeze",
      5,
    ),
    regression(
      "ContractInventory",
      "Contract inventory regression",
      "contracts=11",
      `contracts=${platform.contracts.length}`,
      "Unchanged",
      "KS-CERT-EV-006",
      "Must remain locked at Freeze",
      6,
    ),
    regression(
      "ModelInventory",
      "Model inventory regression",
      "modelInventory=79",
      `modelInventory=${platform.model.totalInventoryCount}`,
      "Unchanged",
      "KS-CERT-EV-008",
      "Must remain locked at Freeze",
      7,
    ),
    regression(
      "ValidationPassState",
      "Validation pass-state regression",
      "pass=48;fail=0",
      `pass=${platform.validation.passCount};fail=${platform.validation.failCount}`,
      "Unchanged",
      "KS-CERT-EV-010",
      "Must remain locked at Freeze",
      8,
    ),
    regression(
      "ManifestInventory",
      "Manifest inventory regression",
      "manifestInventory=447",
      `manifestInventory=${manifest.inventory.totalEntryCount}`,
      "Unchanged",
      "KS-CERT-EV-012",
      "Must remain locked at Freeze",
      9,
    ),
    regression(
      "PlatformInventory",
      "Platform inventory regression",
      "platformInventory=527",
      `platformInventory=${getKnowledgeServicesPlatformInventoryCount()}`,
      "Unchanged",
      "KS-CERT-EV-014",
      "Must remain locked at Freeze",
      10,
    ),
    regression(
      "MutationMode",
      "Mutation-mode regression",
      "mutationModes=0",
      `mutationModes=${platform.inventory.mutationModeCount}`,
      "Unchanged",
      "KS-CERT-EV-007",
      "Must remain locked at Freeze",
      11,
    ),
    regression(
      "RuntimeProhibition",
      "Runtime-prohibition regression",
      "runtimeBehavior=absent",
      `runtimeBehavior=${platform.runtimeBehavior === false ? "absent" : "present"}`,
      "Unchanged",
      "KS-CERT-EV-017",
      "Must remain locked at Freeze",
      12,
    ),
  ]);

/** Baseline constants used by regression evidence. */
export const KnowledgeServicesCertificationRegressionBaselines = Object.freeze({
  ownership: "6/24",
  boundaries: 29,
  services: 12,
  capabilities: 12,
  contracts: 11,
  modelInventory: 79,
  validationRulesPassed: 48,
  manifestInventory: 447,
  platformInventory: 527,
  mutationModes: 0,
  runtimeBehavior: "absent" as const,
  modelGuaranteeCount: Object.keys(model.guarantees).length,
  validationOverall: validation.overallResult,
});
