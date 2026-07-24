/** WS-9:3 — Canonical executive value representation metadata. */
import { ValueWorkspaceRegistry } from "./valueWorkspaceRegistry.ts";

export const ValueWorkspaceRepresentationModel = Object.freeze({
  id: "WS-9:3/Representation/ExecutiveValue",
  name: "Executive Value Representation",
  fields: Object.freeze([
    "Identity",
    "Title",
    "Description",
    "Value Category",
    "Value Dimensions",
    "Outcome References",
    "Evidence References",
    "Impact References",
    "Measurement References",
    "ROI References",
    "Executive Summary",
    "Lifecycle",
    "Readiness",
    "Metadata",
  ]),
  categoryVocabulary: ValueWorkspaceRegistry.valueCategories,
  dimensionVocabulary: ValueWorkspaceRegistry.valueDimensions,
  outcomeVocabulary: ValueWorkspaceRegistry.outcomeTypes,
  measurementVocabulary: ValueWorkspaceRegistry.measurementTypes,
  roiVocabulary: ValueWorkspaceRegistry.roiTypes,
  runtimeValues: false,
  calculatedValues: false,
  metadataOnly: true,
  immutable: true,
} as const);
