/**
 * DKL-2:4 — Ownership & Dependency Validation Rules.
 *
 * Eight deterministic, metadata-only rules: four validating architectural
 * ownership separation (category: Ownership) and four validating forward-only
 * dependency boundaries (category: Dependency). All checks read only approved
 * public metadata; no filesystem import-graph inspection occurs.
 *
 * Ownership: owned exclusively by DKL-2:4.
 * Dependency rules: depends only on the DKL-2:1 public foundation, the DKL-2:2
 * and DKL-2:3 public manifests, and DKL-2:4 validation types.
 */

import {
  DataSourceKnowledgeRegistryContracts,
  DataSourceKnowledgeRegistryFoundation,
  DataSourceKnowledgeRegistryOwnership,
} from "./dataSourceKnowledgeRegistryFoundation.ts";
import { DataSourceKnowledgeRegistryManifest } from "./dataSourceKnowledgeRegistryPlatform.ts";
import { DataSourceRegistryModelManifest } from "./dataSourceRegistryModelPlatform.ts";
import {
  createValidationRule,
  type ValidationRule,
} from "./dataSourceKnowledgeValidationTypes.ts";

const REQUIRED_NEVER_OWNED = [
  "discovery",
  "ingestion",
  "parsing",
  "storage",
  "ai-reasoning",
  "knowledge-graph-creation",
] as const;

const FORBIDDEN_PLATFORMS = [
  "Engine",
  "OPS",
  "BUS",
  "Advisor",
  "Director",
  "Scene",
  "EVE",
  "NEA",
  "Persistence",
  "Integrations",
] as const;

export const OwnershipValidationRules: readonly ValidationRule[] = Object.freeze([
  createValidationRule({
    id: "dsk-val-ownership-phase-separation",
    name: "Phase ownership is correctly separated",
    description:
      "DKL-2:1 owns foundation contracts and vocabularies; DKL-2:2 owns registries; DKL-2:3 owns models; DKL-2:4 owns validation declarations.",
    category: "Ownership",
    severity: "High",
    readinessImpact: "Overlapping ownership would violate single-owner architecture.",
    evaluate: () => {
      const owns = DataSourceKnowledgeRegistryOwnership.owns as readonly string[];
      const foundationOwns =
        owns.includes("registry-contracts") && owns.includes("metadata");
      const registryOwns = DataSourceKnowledgeRegistryManifest.platformId === "DKL-2:2";
      const modelOwns = DataSourceRegistryModelManifest.phaseId === "DKL-2:3";
      return {
        passed: foundationOwns && registryOwns && modelOwns,
        evidence: Object.freeze([
          `foundationOwnsContractsAndMetadata=${String(foundationOwns)}`,
          `registryPhase=${DataSourceKnowledgeRegistryManifest.platformId}`,
          `modelPhase=${DataSourceRegistryModelManifest.phaseId}`,
          "validationOwner=DKL-2:4",
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-ownership-never-owns-runtime",
    name: "No phase owns forbidden runtime concerns",
    description:
      "The foundation never owns discovery, ingestion, parsing, storage, AI reasoning, or knowledge-graph creation.",
    category: "Ownership",
    severity: "Critical",
    readinessImpact: "Owning runtime concerns would violate the metadata-only mandate.",
    evaluate: () => {
      const neverOwns = DataSourceKnowledgeRegistryOwnership.neverOwns as readonly string[];
      const passed = REQUIRED_NEVER_OWNED.every((concern) => neverOwns.includes(concern));
      return {
        passed,
        evidence: Object.freeze([
          `neverOwnsCount=${neverOwns.length}`,
          `runtimeConcernsDisowned=${String(passed)}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-ownership-no-overlap",
    name: "Owned and forbidden responsibility sets do not overlap",
    description: "No owned responsibility appears in the never-owned or forbidden sets.",
    category: "Ownership",
    severity: "Critical",
    readinessImpact: "Overlapping responsibility sets would create ambiguous ownership.",
    evaluate: () => {
      const owns = DataSourceKnowledgeRegistryOwnership.owns as readonly string[];
      const neverOwns = DataSourceKnowledgeRegistryOwnership.neverOwns as readonly string[];
      const noOverlap = owns.every((entry) => !neverOwns.includes(entry));
      const foundationImmutable = DataSourceKnowledgeRegistryFoundation.immutable === true;
      return {
        passed: noOverlap && foundationImmutable,
        evidence: Object.freeze([
          `noOverlap=${String(noOverlap)}`,
          `foundationImmutable=${String(foundationImmutable)}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-ownership-future-phases",
    name: "Future DKL platforms retain downstream ownership",
    description:
      "Discovery, understanding, storage, and knowledge construction remain owned by future DKL phases, not by DKL-2:1 through DKL-2:4.",
    category: "Ownership",
    severity: "Medium",
    readinessImpact: "Claiming downstream ownership would duplicate future-phase scope.",
    evaluate: () => {
      const neverOwns = DataSourceKnowledgeRegistryOwnership.neverOwns as readonly string[];
      const disownsDownstream =
        neverOwns.includes("discovery") &&
        neverOwns.includes("storage") &&
        neverOwns.includes("knowledge-graph-creation");
      return {
        passed: disownsDownstream,
        evidence: Object.freeze([
          "futureOwned=discovery,understanding,storage,knowledge-construction",
          `downstreamDisowned=${String(disownsDownstream)}`,
        ]),
      };
    },
  }),
]);

export const DependencyValidationRules: readonly ValidationRule[] = Object.freeze([
  createValidationRule({
    id: "dsk-val-dependency-foundation",
    name: "DKL-2:1 depends only on the DKL-1 Public Index",
    description: "The foundation declares DKL-1 Public Index as its only dependency.",
    category: "Dependency",
    severity: "Critical",
    readinessImpact: "Foundation dependency drift would break the layer boundary.",
    evaluate: () => {
      const allowed = DataSourceKnowledgeRegistryContracts.allowedDependencies as readonly string[];
      const dependsOn = DataSourceKnowledgeRegistryFoundation.identity.dependsOn as readonly string[];
      const passed =
        allowed.length === 1 &&
        allowed[0] === "DKL-1 Public Index" &&
        dependsOn.length === 1 &&
        dependsOn[0].includes("DKL-1");
      return {
        passed,
        evidence: Object.freeze([
          `allowed=${allowed.join(",")}`,
          `dependsOn=${dependsOn.join(",")}`,
        ]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-dependency-registry",
    name: "DKL-2:2 depends only on DKL-2:1 public APIs",
    description: "The registry manifest declares DKL-2:1 as its sole dependency.",
    category: "Dependency",
    severity: "Critical",
    readinessImpact: "Registry dependency drift would break forward-only ordering.",
    evaluate: () => {
      const passed = DataSourceKnowledgeRegistryManifest.dependency === "DKL-2:1";
      return {
        passed,
        evidence: Object.freeze([`registryDependency=${DataSourceKnowledgeRegistryManifest.dependency}`]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-dependency-model",
    name: "DKL-2:3 depends only on DKL-2:1 and DKL-2:2 public APIs",
    description: "The model manifest declares DKL-2:1 and DKL-2:2 as its only dependencies.",
    category: "Dependency",
    severity: "Critical",
    readinessImpact: "Model dependency drift would break forward-only ordering.",
    evaluate: () => {
      const deps = DataSourceRegistryModelManifest.dependency as readonly string[];
      const passed = deps.length === 2 && deps[0] === "DKL-2:1" && deps[1] === "DKL-2:2";
      return {
        passed,
        evidence: Object.freeze([`modelDependency=${deps.join(",")}`]),
      };
    },
  }),
  createValidationRule({
    id: "dsk-val-dependency-forward-only",
    name: "DKL-2:4 dependencies are forward-only with no forbidden platform",
    description:
      "DKL-2:4 depends only on DKL-2:1 through DKL-2:3, declares no forbidden platform, and represents no circular dependency.",
    category: "Dependency",
    severity: "Critical",
    readinessImpact: "A forbidden or circular dependency would break the architecture.",
    evaluate: () => {
      const validationDependencies = ["DKL-2:1", "DKL-2:2", "DKL-2:3"] as const;
      const forwardOnly = validationDependencies.every((dep) => dep < "DKL-2:4");
      const noForbidden = validationDependencies.every(
        (dep) => !(FORBIDDEN_PLATFORMS as readonly string[]).includes(dep)
      );
      return {
        passed: forwardOnly && noForbidden,
        evidence: Object.freeze([
          `dependencies=${validationDependencies.join(",")}`,
          `forwardOnly=${String(forwardOnly)}`,
          `noForbiddenPlatform=${String(noForbidden)}`,
        ]),
      };
    },
  }),
]);
