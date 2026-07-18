/**
 * DKL-1:8 — Freeze Locks.
 *
 * Immutable lock declarations that permanently protect every certified area of
 * the DKL-1 architecture. Locks are declarative metadata only — they describe
 * protection, they do not enforce it at runtime. No source or Git inspection.
 */

import {
  createFreezeLock,
  type FreezeLockDescriptor,
} from "./dataKnowledgeFoundationFreezeTypes.ts";

export const DataKnowledgeFoundationFreezeLocks: readonly FreezeLockDescriptor[] = Object.freeze([
  createFreezeLock({
    id: "dkl-freeze-lock-public-api",
    name: "Public API Lock",
    target: "Certified public APIs (DKL-1:1 → DKL-1:7)",
    protectionLevel: "PERMANENT",
    reason: "The 55 certified public APIs are frozen and must not change.",
    sourcePhase: "DKL-1:7",
  }),
  createFreezeLock({
    id: "dkl-freeze-lock-ownership",
    name: "Ownership Lock",
    target: "Foundation ownership declarations",
    protectionLevel: "PERMANENT",
    reason: "Owned and never-owned responsibility boundaries are frozen.",
    sourcePhase: "DKL-1:1",
  }),
  createFreezeLock({
    id: "dkl-freeze-lock-dependency",
    name: "Dependency Lock",
    target: "Foundation dependency declarations",
    protectionLevel: "PERMANENT",
    reason: "Allowed, future, and forbidden dependency directions are frozen.",
    sourcePhase: "DKL-1:1",
  }),
  createFreezeLock({
    id: "dkl-freeze-lock-model",
    name: "Model Lock",
    target: "Model structure and inventories",
    protectionLevel: "STRICT",
    reason: "Model surfaces, business types, relationships, and metadata fields are frozen.",
    sourcePhase: "DKL-1:3",
  }),
  createFreezeLock({
    id: "dkl-freeze-lock-registry",
    name: "Registry Lock",
    target: "Registry components and public API entries",
    protectionLevel: "STRICT",
    reason: "Registered components and public API inventory are frozen.",
    sourcePhase: "DKL-1:2",
  }),
  createFreezeLock({
    id: "dkl-freeze-lock-validation",
    name: "Validation Lock",
    target: "Validation domains and rules",
    protectionLevel: "STRICT",
    reason: "The 48 validation rules across five domains are frozen.",
    sourcePhase: "DKL-1:4",
  }),
  createFreezeLock({
    id: "dkl-freeze-lock-manifest",
    name: "Manifest Lock",
    target: "Manifest structure and inventories",
    protectionLevel: "STRICT",
    reason: "Phase, inventory, dependency, and compatibility manifests are frozen.",
    sourcePhase: "DKL-1:5",
  }),
  createFreezeLock({
    id: "dkl-freeze-lock-platform",
    name: "Platform Lock",
    target: "Platform aggregation and sections",
    protectionLevel: "STRICT",
    reason: "The five canonical platform sections and manifest-driven summary are frozen.",
    sourcePhase: "DKL-1:6",
  }),
  createFreezeLock({
    id: "dkl-freeze-lock-certification",
    name: "Certification Lock",
    target: "Certification gates and metadata",
    protectionLevel: "PERMANENT",
    reason: "The 16 certification gates, compatibility, and regression baselines are frozen.",
    sourcePhase: "DKL-1:7",
  }),
]);
