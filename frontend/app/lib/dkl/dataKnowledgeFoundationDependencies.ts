/**
 * DKL-1:1 — Data Knowledge Layer Foundation.
 *
 * Immutable dependency declarations for the Data Knowledge Layer.
 * Declares allowed, future, and forbidden dependency directions.
 * Metadata only — no runtime resolution or loading occurs here.
 */

import type { DataKnowledgeDependencyDescriptor } from "./dataKnowledgeFoundationTypes.ts";

export const DataKnowledgeFoundationDependencies = Object.freeze({
  allowed: Object.freeze(["CORE", "CORE-TEN", "BUS", "OPS", "NEA"]),
  future: Object.freeze(["EXECUTIVE-ENGINE"]),
  forbidden: Object.freeze([
    "UI",
    "ADVISOR",
    "SCENE",
    "EXTERNAL-APIS",
    "DATABASE-DRIVERS",
    "HTTP-CLIENTS",
    "AI-MODELS",
  ]),
  metadataOnly: true,
  immutable: true,
} as const satisfies DataKnowledgeDependencyDescriptor);
