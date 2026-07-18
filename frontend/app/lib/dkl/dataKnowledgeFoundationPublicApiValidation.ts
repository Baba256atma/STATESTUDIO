/**
 * DKL-1:4 — Public API Validation domain.
 *
 * Deterministically validates the exact public API inventories of DKL-1:1,
 * DKL-1:2, and DKL-1:3 using their public module surfaces only.
 * Metadata only — no runtime behavior.
 */

import * as foundationApi from "./dataKnowledgeFoundation.ts";
import * as modelApi from "./dataKnowledgeFoundationModel.ts";
import { DataKnowledgeFoundationPublicApiRegistry } from "./dataKnowledgeFoundationPublicApiRegistry.ts";
import * as registryApi from "./dataKnowledgeFoundationRegistryIndex.ts";
import {
  createValidationDomain,
  createValidationRule,
} from "./dataKnowledgeFoundationValidationTypes.ts";

const FOUNDATION_PUBLIC_API = [
  "DataKnowledgeFoundation",
  "DataKnowledgeFoundationContracts",
  "DataKnowledgeFoundationDependencies",
  "DataKnowledgeFoundationIdentity",
  "DataKnowledgeFoundationOwnership",
  "getDataKnowledgeFoundation",
  "getDataKnowledgeFoundationSummary",
].sort();

const REGISTRY_PUBLIC_API = [
  "DataKnowledgeFoundationRegistry",
  "DataKnowledgeFoundationComponentRegistry",
  "DataKnowledgeFoundationContractRegistry",
  "DataKnowledgeFoundationPublicApiRegistry",
  "DataKnowledgeFoundationRegistryManifest",
  "getDataKnowledgeFoundationRegistry",
  "getDataKnowledgeFoundationRegistrySummary",
  "getDataKnowledgeFoundationComponentById",
].sort();

const MODEL_PUBLIC_API = [
  "DataKnowledgeFoundationModel",
  "DataKnowledgeObjectModel",
  "BusinessObjectModel",
  "KnowledgeRelationshipModel",
  "KnowledgeMetadataModel",
  "DataKnowledgeFoundationModelManifest",
  "getDataKnowledgeFoundationModel",
  "getDataKnowledgeFoundationModelSummary",
].sort();

const foundationKeys = Object.keys(foundationApi).sort();
const registryKeys = Object.keys(registryApi).sort();
const modelKeys = Object.keys(modelApi).sort();

const sameNames = (a: readonly string[], b: readonly string[]): boolean =>
  a.length === b.length && a.every((name, index) => name === b[index]);

const registeredApiNames = DataKnowledgeFoundationPublicApiRegistry.map((entry) => entry.name);
const noRegistryDuplicates = new Set(registeredApiNames).size === registeredApiNames.length;

const noLeakage =
  !modelKeys.includes("DataKnowledgeFoundation") &&
  !modelKeys.includes("DataKnowledgeFoundationRegistry") &&
  !registryKeys.includes("DataKnowledgeFoundation");

const rules = [
  createValidationRule({
    id: "DKL-VAL-P-01",
    domain: "public-api",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "DKL-1:1 exposes exactly seven public APIs",
    description: "The Foundation public surface must expose exactly seven APIs.",
    expected: "7",
    actual: String(foundationKeys.length),
    condition: foundationKeys.length === 7,
    evidence: { count: foundationKeys.length },
  }),
  createValidationRule({
    id: "DKL-VAL-P-02",
    domain: "public-api",
    severity: "ERROR",
    sourcePhase: "DKL-1:2",
    title: "DKL-1:2 exposes exactly eight public APIs",
    description: "The Registry public index must expose exactly eight APIs.",
    expected: "8",
    actual: String(registryKeys.length),
    condition: registryKeys.length === 8,
    evidence: { count: registryKeys.length },
  }),
  createValidationRule({
    id: "DKL-VAL-P-03",
    domain: "public-api",
    severity: "ERROR",
    sourcePhase: "DKL-1:3",
    title: "DKL-1:3 exposes exactly eight public APIs",
    description: "The Model public surface must expose exactly eight APIs.",
    expected: "8",
    actual: String(modelKeys.length),
    condition: modelKeys.length === 8,
    evidence: { count: modelKeys.length },
  }),
  createValidationRule({
    id: "DKL-VAL-P-04",
    domain: "public-api",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "DKL-1:1 public inventory is unchanged",
    description: "The Foundation public names must exactly match the certified inventory with no duplicates.",
    expected: FOUNDATION_PUBLIC_API.join(","),
    actual: foundationKeys.join(","),
    condition:
      sameNames(foundationKeys, FOUNDATION_PUBLIC_API) &&
      new Set(foundationKeys).size === foundationKeys.length,
    evidence: { unique: new Set(foundationKeys).size === foundationKeys.length },
  }),
  createValidationRule({
    id: "DKL-VAL-P-05",
    domain: "public-api",
    severity: "ERROR",
    sourcePhase: "DKL-1:2",
    title: "DKL-1:2 public inventory is unchanged",
    description: "The Registry public names must exactly match the certified inventory with no duplicates.",
    expected: REGISTRY_PUBLIC_API.join(","),
    actual: registryKeys.join(","),
    condition:
      sameNames(registryKeys, REGISTRY_PUBLIC_API) &&
      new Set(registryKeys).size === registryKeys.length,
    evidence: { unique: new Set(registryKeys).size === registryKeys.length },
  }),
  createValidationRule({
    id: "DKL-VAL-P-06",
    domain: "public-api",
    severity: "ERROR",
    sourcePhase: "DKL-1:3",
    title: "DKL-1:3 public inventory is unchanged",
    description: "The Model public names must exactly match the certified inventory with no duplicates.",
    expected: MODEL_PUBLIC_API.join(","),
    actual: modelKeys.join(","),
    condition:
      sameNames(modelKeys, MODEL_PUBLIC_API) && new Set(modelKeys).size === modelKeys.length,
    evidence: { unique: new Set(modelKeys).size === modelKeys.length },
  }),
  createValidationRule({
    id: "DKL-VAL-P-07",
    domain: "public-api",
    severity: "ERROR",
    sourcePhase: "DKL-1:2",
    title: "No public API is registered more than once",
    description: "The registry public API inventory must contain no duplicate API registrations.",
    expected: "no duplicate registered API names",
    actual: String(noRegistryDuplicates),
    condition: noRegistryDuplicates,
    evidence: { registeredCount: registeredApiNames.length, unique: noRegistryDuplicates },
  }),
  createValidationRule({
    id: "DKL-VAL-P-08",
    domain: "public-api",
    severity: "WARNING",
    sourcePhase: "DKL-1:3",
    title: "No accidental internal export leakage",
    description: "Later phases must not re-export earlier aggregate objects as their own public APIs.",
    expected: "no cross-phase export leakage",
    actual: String(noLeakage),
    condition: noLeakage,
    evidence: { noLeakage },
  }),
];

export const DataKnowledgeFoundationPublicApiValidation = createValidationDomain(
  "public-api",
  "Public API Validation",
  "DKL-1:1",
  rules
);
