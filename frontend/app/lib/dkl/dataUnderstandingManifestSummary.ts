/**
 * DKL-3:5 — Data Understanding Manifest Summary.
 *
 * Immutable platform summary counts derived from inventory metadata.
 * Deterministic. Metadata only.
 *
 * Ownership: owned exclusively by DKL-3:5.
 */

import { DataUnderstandingContracts } from "./dataUnderstandingFoundation.ts";
import { DataUnderstandingEvidenceRegistry } from "./dataUnderstandingRegistry.ts";
import {
  DataUnderstandingModel,
  DataUnderstandingRelationshipModel,
} from "./dataUnderstandingModel.ts";
import { DataUnderstandingValidationRules } from "./dataUnderstandingValidation.ts";
import { DataUnderstandingManifestInventory } from "./dataUnderstandingManifestInventory.ts";
import { DataUnderstandingManifestDependencies } from "./dataUnderstandingManifestDependencies.ts";
import type { ManifestSummaryDescriptor } from "./dataUnderstandingManifestTypes.ts";

/** Five DKL-3 phases (1–5) each publish exactly eight public APIs. */
const TOTAL_PUBLIC_APIS = 40;

/** Canonical immutable platform summary. */
export const DataUnderstandingManifestSummary: ManifestSummaryDescriptor = Object.freeze({
  totalSubjects: DataUnderstandingContracts.subjectKinds.length,
  totalCandidateTypes: DataUnderstandingContracts.candidateTypes.length,
  totalEvidenceCategories: DataUnderstandingEvidenceRegistry.entryCount,
  totalRelationshipTypes: DataUnderstandingRelationshipModel.relationshipKindCount,
  totalValidationRules: DataUnderstandingValidationRules.length,
  totalPublicApis: TOTAL_PUBLIC_APIS,
  totalDependencies: DataUnderstandingManifestDependencies.entryCount,
  totalModels: DataUnderstandingModel.modelKindCount,
  totalRegistries: 1,
  totalComponents: DataUnderstandingManifestInventory.componentCount,
  totalReferences: DataUnderstandingManifestInventory.references.length,
  totalPhasesCompleted: 4,
  platformId: "DKL-3",
  nextPhase: "DKL-3:6",
});
