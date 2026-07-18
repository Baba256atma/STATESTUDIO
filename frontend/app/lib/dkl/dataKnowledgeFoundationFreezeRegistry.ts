/**
 * DKL-1:8 — Freeze Registry.
 *
 * One immutable registry describing the frozen DKL-1 architecture. Every value
 * is sourced from the official public metadata of DKL-1:1 through DKL-1:7 — no
 * inventory is recomputed from internal files and nothing is duplicated.
 * Metadata only — no runtime behavior.
 */

import * as foundationApi from "./dataKnowledgeFoundation.ts";
import * as certificationApi from "./dataKnowledgeFoundationCertificationIndex.ts";
import {
  DataKnowledgeFoundationCertificationGates,
  DataKnowledgeFoundationRegressionCertification,
} from "./dataKnowledgeFoundationCertificationIndex.ts";
import {
  DataKnowledgeFoundationInventoryManifest,
  DataKnowledgeFoundationPhaseManifest,
} from "./dataKnowledgeFoundationManifestIndex.ts";
import * as manifestApi from "./dataKnowledgeFoundationManifestIndex.ts";
import { DataKnowledgeFoundationModelManifest } from "./dataKnowledgeFoundationModel.ts";
import * as modelApi from "./dataKnowledgeFoundationModel.ts";
import { getDataKnowledgeFoundationPlatformSummary } from "./dataKnowledgeFoundationPlatformIndex.ts";
import * as platformApi from "./dataKnowledgeFoundationPlatformIndex.ts";
import { DataKnowledgeFoundationComponentRegistry } from "./dataKnowledgeFoundationRegistryIndex.ts";
import * as registryApi from "./dataKnowledgeFoundationRegistryIndex.ts";
import {
  DataKnowledgeFoundationValidationRules,
} from "./dataKnowledgeFoundationValidation.ts";
import * as validationApi from "./dataKnowledgeFoundationValidation.ts";
import type { FreezeRegistryDescriptor } from "./dataKnowledgeFoundationFreezeTypes.ts";

const foundationApiCount = Object.keys(foundationApi).length;
const registryApiCount = Object.keys(registryApi).length;
const modelApiCount = Object.keys(modelApi).length;
const validationApiCount = Object.keys(validationApi).length;
const manifestApiCount = Object.keys(manifestApi).length;
const platformApiCount = Object.keys(platformApi).length;
const certificationApiCount = Object.keys(certificationApi).length;

const totalPublicApiCount =
  foundationApiCount +
  registryApiCount +
  modelApiCount +
  validationApiCount +
  manifestApiCount +
  platformApiCount +
  certificationApiCount;

const platformSummary = getDataKnowledgeFoundationPlatformSummary();

export const DataKnowledgeFoundationFreezeRegistry = Object.freeze({
  frozenPhases: Object.freeze([
    "DKL-1:1",
    "DKL-1:2",
    "DKL-1:3",
    "DKL-1:4",
    "DKL-1:5",
    "DKL-1:6",
    "DKL-1:7",
  ]),
  frozenPhaseCount: 7,
  frozenPublicApis: Object.freeze({
    foundation: foundationApiCount,
    registry: registryApiCount,
    model: modelApiCount,
    validation: validationApiCount,
    manifest: manifestApiCount,
    platform: platformApiCount,
    certification: certificationApiCount,
    total: totalPublicApiCount,
  }),
  frozenPublicApiCount: totalPublicApiCount,
  frozenModelCount: DataKnowledgeFoundationModelManifest.registeredModels.length,
  frozenRegistryComponentCount: DataKnowledgeFoundationComponentRegistry.length,
  frozenValidationRuleCount: DataKnowledgeFoundationValidationRules.length,
  frozenManifestPhaseCount: DataKnowledgeFoundationPhaseManifest.phaseCount,
  frozenPlatformSectionCount: platformSummary.sectionCount,
  frozenCertificationGateCount: DataKnowledgeFoundationCertificationGates.length,
  frozenInventory: DataKnowledgeFoundationInventoryManifest,
  frozenBaselines: DataKnowledgeFoundationRegressionCertification.baselines,
  metadataOnly: true,
  immutable: true,
} as const satisfies FreezeRegistryDescriptor);
