/** WS-10:3 — Canonical executive timeline representation metadata. */
import { TimelineWorkspaceRegistry } from "./timelineWorkspaceRegistry.ts";

export const TimelineWorkspaceRepresentationModel = Object.freeze({
  id: "WS-10:3/Representation/ExecutiveTimeline",
  name: "Executive Timeline Representation",
  fields: Object.freeze([
    "Identity",
    "Title",
    "Description",
    "Timeline Scope",
    "Timeline Granularity",
    "Historical Record References",
    "Timeline Event References",
    "Executive Milestone References",
    "Workspace Transition References",
    "Value Workspace References",
    "Executive History References",
    "Lifecycle",
    "Readiness",
    "Metadata",
  ]),
  eventCategoryVocabulary: TimelineWorkspaceRegistry.eventCategories,
  recordTypeVocabulary: TimelineWorkspaceRegistry.recordTypes,
  transitionVocabulary: TimelineWorkspaceRegistry.transitionTypes,
  granularityVocabulary: TimelineWorkspaceRegistry.granularities,
  referenceVocabulary: TimelineWorkspaceRegistry.historicalReferenceTypes,
  runtimeValues: false,
  navigationRuntime: false,
  metadataOnly: true,
  immutable: true,
} as const);
