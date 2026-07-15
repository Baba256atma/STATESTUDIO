const capability = (id: string, name: string, description: string) => Object.freeze({
  id, name, description, status: "Defined", metadataOnly: true, immutable: true,
} as const);

export const ExecutiveContextAssemblyCapabilities = Object.freeze([
  capability(
    "eng-4-capability-context-identification",
    "Context Identification",
    "Architectural capability to identify executive context participants without runtime discovery.",
  ),
  capability(
    "eng-4-capability-context-aggregation",
    "Context Aggregation",
    "Architectural capability describing aggregation membership without performing aggregation.",
  ),
  capability(
    "eng-4-capability-context-classification",
    "Context Classification",
    "Architectural capability describing classification vocabulary without inference.",
  ),
  capability(
    "eng-4-capability-context-composition",
    "Context Composition",
    "Architectural capability describing composition structure without assembling runtime context.",
  ),
  capability(
    "eng-4-capability-context-normalization",
    "Context Normalization",
    "Architectural capability describing normalization rules as metadata only.",
  ),
  capability(
    "eng-4-capability-context-metadata",
    "Context Metadata",
    "Architectural capability describing metadata publication for executive context artifacts.",
  ),
  capability(
    "eng-4-capability-context-validation",
    "Context Validation",
    "Architectural capability describing validation gates for later phases without execution.",
  ),
  capability(
    "eng-4-capability-context-snapshot-definition",
    "Context Snapshot Definition",
    "Architectural capability describing snapshot definitions without capturing state.",
  ),
  capability(
    "eng-4-capability-context-version-metadata",
    "Context Version Metadata",
    "Architectural capability describing version ownership metadata for context artifacts.",
  ),
  capability(
    "eng-4-capability-context-publication",
    "Context Publication",
    "Architectural capability describing publication readiness metadata without release logistics.",
  ),
] as const);
