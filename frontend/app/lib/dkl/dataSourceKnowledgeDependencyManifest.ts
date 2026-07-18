/**
 * DKL-2:5 — Dependency Manifest.
 *
 * Immutable, metadata-only description of the forward-only, cycle-free,
 * public-API-only dependency graph for DKL-2:1 through DKL-2:5. Declared from
 * static architectural metadata — no TypeScript import graph or filesystem is
 * inspected at runtime.
 *
 * Ownership: owned exclusively by DKL-2:5.
 * Dependency rules: depends only on the DKL-2:5 manifest types.
 */

import {
  type DependencyManifestDescriptor,
  type DependencyManifestEntry,
} from "./dataSourceKnowledgeManifestTypes.ts";

const dependencyEntry = (
  phaseId: string,
  directDependencies: readonly string[],
  transitiveDependencies: readonly string[]
): DependencyManifestEntry =>
  Object.freeze({
    phaseId,
    directDependencies: Object.freeze([...directDependencies]),
    transitiveDependencies: Object.freeze([...transitiveDependencies]),
    metadataOnly: true,
    immutable: true,
  });

const dependencyEntries: readonly DependencyManifestEntry[] = Object.freeze([
  dependencyEntry("DKL-2:1", ["DKL-1 Public Index"], []),
  dependencyEntry("DKL-2:2", ["DKL-2:1"], ["DKL-1 Public Index"]),
  dependencyEntry("DKL-2:3", ["DKL-2:1", "DKL-2:2"], ["DKL-1 Public Index"]),
  dependencyEntry(
    "DKL-2:4",
    ["DKL-2:1", "DKL-2:2", "DKL-2:3"],
    ["DKL-1 Public Index"]
  ),
  dependencyEntry(
    "DKL-2:5",
    ["DKL-2:1", "DKL-2:2", "DKL-2:3", "DKL-2:4"],
    ["DKL-1 Public Index"]
  ),
]);

export const DataSourceKnowledgeDependencyManifest = Object.freeze({
  entries: dependencyEntries,
  forbiddenDependencies: Object.freeze([
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
    "Runtime Connectors",
    "AI/LLM Services",
  ]),
  forwardOnly: true,
  cycleFree: true,
  publicApiOnly: true,
  metadataOnly: true,
  immutable: true,
} as const satisfies DependencyManifestDescriptor);
