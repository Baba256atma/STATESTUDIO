const contract = (id: string, name: string, description: string) => Object.freeze({
  id, name, description, status: "Defined", metadataOnly: true, immutable: true,
} as const);

export const ExecutiveContextAssemblyContracts = Object.freeze([
  contract(
    "eng-4-contract-executive-context",
    "Executive Context",
    "Describes the immutable architectural identity of an assembled executive context.",
  ),
  contract(
    "eng-4-contract-context-source",
    "Context Source",
    "Describes approved origin metadata for information that may participate in an executive context.",
  ),
  contract(
    "eng-4-contract-context-domain",
    "Context Domain",
    "Describes domain classifications eligible to participate in an executive context.",
  ),
  contract(
    "eng-4-contract-context-snapshot",
    "Context Snapshot",
    "Describes versioned snapshot identity for executive context assembly without capture execution.",
  ),
  contract(
    "eng-4-contract-context-metadata",
    "Context Metadata",
    "Describes the canonical metadata envelope owned by the Context Assembly Platform.",
  ),
  contract(
    "eng-4-contract-context-boundary",
    "Context Boundary",
    "Describes architectural boundaries separating context assembly metadata from forbidden runtime concerns.",
  ),
  contract(
    "eng-4-contract-context-validation",
    "Context Validation",
    "Describes validation metadata requirements for future context validation phases without execution.",
  ),
  contract(
    "eng-4-contract-public-context-api",
    "Public Context API",
    "Describes the approved public architectural API surface for Executive Context Assembly.",
  ),
] as const);
