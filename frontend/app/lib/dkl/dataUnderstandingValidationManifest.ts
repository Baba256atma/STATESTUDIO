/**
 * DKL-3:4 — Data Understanding Validation Manifest.
 *
 * Immutable manifest describing the validation surface.
 *
 * Ownership: owned exclusively by DKL-3:4.
 */

import { DataUnderstandingValidationRules } from "./dataUnderstandingValidationRules.ts";
import type {
  DataUnderstandingValidationIdentity,
  DataUnderstandingValidationManifestDescriptor,
} from "./dataUnderstandingValidationTypes.ts";

export const DATA_UNDERSTANDING_VALIDATION_VERSION = "1.0.0";

export const DATA_UNDERSTANDING_VALIDATION_IDENTITY: DataUnderstandingValidationIdentity =
  Object.freeze({
    validationId: "DKL-3:4/DataUnderstandingValidation",
    validationVersion: DATA_UNDERSTANDING_VALIDATION_VERSION,
    validationName: "Data Understanding Validation",
    validationNamespace: "nexora.dkl.data-understanding.validation",
    owner: "DKL-3 Data Understanding Platform",
    sourcePhase: "DKL-3:4",
    platformId: "DKL-3",
    status: "ValidationComplete",
    readiness: "ReadyForManifest",
  });

export const DATA_UNDERSTANDING_VALIDATION_PUBLIC_API_NAMES: readonly string[] = Object.freeze([
  "DataUnderstandingValidation",
  "DataUnderstandingValidationRules",
  "DataUnderstandingValidationOwnership",
  "DataUnderstandingValidationBoundaries",
  "DataUnderstandingValidationManifest",
  "DataUnderstandingValidationReport",
  "DataUnderstandingValidationVersion",
  "validateDataUnderstandingModel",
]);

const CATEGORIES = Object.freeze([
  ...new Set(DataUnderstandingValidationRules.map((r) => r.category)),
]);

/** Canonical immutable validation manifest. */
export const DataUnderstandingValidationManifest: DataUnderstandingValidationManifestDescriptor =
  Object.freeze({
    validationId: DATA_UNDERSTANDING_VALIDATION_IDENTITY.validationId,
    version: DATA_UNDERSTANDING_VALIDATION_VERSION,
    name: DATA_UNDERSTANDING_VALIDATION_IDENTITY.validationName,
    owner: DATA_UNDERSTANDING_VALIDATION_IDENTITY.owner,
    sourcePhase: "DKL-3:4",
    ruleCount: DataUnderstandingValidationRules.length,
    categoryCount: CATEGORIES.length,
    publicApiCount: 8,
    metadataOnly: true,
    validationOnly: true,
    deterministic: true,
    immutable: true,
    semanticInferencePerformed: false,
    understandingPerformed: false,
    businessObjectsCreated: false,
    knowledgeGraphCreated: false,
    persistencePerformed: false,
    aiExecuted: false,
    engineReasoningPerformed: false,
    readiness: "ReadyForManifest",
    nextPhase: "DKL-3:5",
  });
