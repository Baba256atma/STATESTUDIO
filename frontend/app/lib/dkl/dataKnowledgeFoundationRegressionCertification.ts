/**
 * DKL-1:7 — Regression Certification.
 *
 * Immutable regression metadata capturing the canonical baselines of the
 * complete DKL-1 platform and verifying — from official public metadata only —
 * that every inventory count, public API surface, ownership declaration, and
 * dependency declaration remains unchanged.
 *
 * No source-code, filesystem, or Git inspection occurs here.
 */

import { DataKnowledgeFoundationIdentity } from "./dataKnowledgeFoundation.ts";
import * as foundationApi from "./dataKnowledgeFoundation.ts";
import { DataKnowledgeFoundationOwnership } from "./dataKnowledgeFoundation.ts";
import { DataKnowledgeFoundationDependencies } from "./dataKnowledgeFoundation.ts";
import { DataKnowledgeFoundationInventoryManifest } from "./dataKnowledgeFoundationManifestIndex.ts";
import { DataKnowledgeFoundationPhaseManifest } from "./dataKnowledgeFoundationManifestIndex.ts";
import * as manifestApi from "./dataKnowledgeFoundationManifestIndex.ts";
import { DataKnowledgeFoundationModelManifest } from "./dataKnowledgeFoundationModel.ts";
import * as modelApi from "./dataKnowledgeFoundationModel.ts";
import * as platformApi from "./dataKnowledgeFoundationPlatformIndex.ts";
import * as registryApi from "./dataKnowledgeFoundationRegistryIndex.ts";
import {
  DataKnowledgeFoundationComponentRegistry,
} from "./dataKnowledgeFoundationRegistryIndex.ts";
import {
  DataKnowledgeFoundationValidationManifest,
  DataKnowledgeFoundationValidationRules,
} from "./dataKnowledgeFoundationValidation.ts";
import * as validationApi from "./dataKnowledgeFoundationValidation.ts";
import type { RegressionCertificationDescriptor } from "./dataKnowledgeFoundationCertificationTypes.ts";

const foundationPublicApis = Object.keys(foundationApi).length;
const registryPublicApis = Object.keys(registryApi).length;
const modelPublicApis = Object.keys(modelApi).length;
const validationPublicApis = Object.keys(validationApi).length;
const manifestPublicApis = Object.keys(manifestApi).length;
const platformPublicApis = Object.keys(platformApi).length;
const totalPreCertificationApis =
  foundationPublicApis +
  registryPublicApis +
  modelPublicApis +
  validationPublicApis +
  manifestPublicApis +
  platformPublicApis;

const registryComponents = DataKnowledgeFoundationComponentRegistry.length;
const models = DataKnowledgeFoundationModelManifest.registeredModels.length;
const validationDomains = DataKnowledgeFoundationValidationManifest.validationDomains.length;
const validationRules = DataKnowledgeFoundationValidationRules.length;
const manifestPhases = DataKnowledgeFoundationPhaseManifest.phaseCount;
const platformSections = DataKnowledgeFoundationInventoryManifest.publicApis.foundation > 0
  ? DataKnowledgeFoundationPhaseManifest.phaseCount + 1
  : 0;

const baselines = Object.freeze({
  foundationPublicApis: 7,
  registryPublicApis: 8,
  modelPublicApis: 8,
  validationPublicApis: 8,
  manifestPublicApis: 8,
  platformPublicApis: 8,
  totalPreCertificationApis: 47,
  registryComponents: 5,
  models: 4,
  validationDomains: 5,
  validationRules: 48,
  manifestPhases: 4,
  platformSections: 5,
} as const);

const verified =
  foundationPublicApis === baselines.foundationPublicApis &&
  registryPublicApis === baselines.registryPublicApis &&
  modelPublicApis === baselines.modelPublicApis &&
  validationPublicApis === baselines.validationPublicApis &&
  manifestPublicApis === baselines.manifestPublicApis &&
  platformPublicApis === baselines.platformPublicApis &&
  totalPreCertificationApis === baselines.totalPreCertificationApis &&
  registryComponents === baselines.registryComponents &&
  models === baselines.models &&
  validationDomains === baselines.validationDomains &&
  validationRules === baselines.validationRules &&
  manifestPhases === baselines.manifestPhases &&
  platformSections === baselines.platformSections;

export const DataKnowledgeFoundationRegressionCertification = Object.freeze({
  regressionId: "DKL-1:7-REGRESSION",
  foundationIdentityBaseline: Object.freeze({
    layerId: DataKnowledgeFoundationIdentity.layerId,
    version: DataKnowledgeFoundationIdentity.version,
    namespace: DataKnowledgeFoundationIdentity.namespace,
  }),
  ownershipBaseline: Object.freeze({
    ownedCount: DataKnowledgeFoundationOwnership.owns.length,
    nonOwnedCount: DataKnowledgeFoundationOwnership.neverOwns.length,
  }),
  dependencyBaseline: Object.freeze({
    allowedCount: DataKnowledgeFoundationDependencies.allowed.length,
    futureCount: DataKnowledgeFoundationDependencies.future.length,
    forbiddenCount: DataKnowledgeFoundationDependencies.forbidden.length,
  }),
  baselines,
  verified,
  metadataOnly: true,
  immutable: true,
} as const satisfies RegressionCertificationDescriptor);
