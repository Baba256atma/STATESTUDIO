/**
 * DKL-1:1 — Data Knowledge Layer Foundation.
 *
 * Immutable ownership declarations for the Data Knowledge Layer.
 * Declares the responsibilities DKL exclusively owns and those it never owns.
 * Metadata only — no runtime behavior.
 */

import type { DataKnowledgeOwnershipDescriptor } from "./dataKnowledgeFoundationTypes.ts";

export const DataKnowledgeFoundationOwnership = Object.freeze({
  owns: Object.freeze([
    "business-objects",
    "knowledge-objects",
    "knowledge-relationships",
    "knowledge-metadata",
    "knowledge-identity",
  ]),
  neverOwns: Object.freeze([
    "communication",
    "decision-logic",
    "visual-components",
    "user-sessions",
  ]),
  metadataOnly: true,
  immutable: true,
} as const satisfies DataKnowledgeOwnershipDescriptor);
