import type { ExecutiveIntentResolutionContract } from "./executiveIntentResolutionTypes.ts";

const contract = (id: ExecutiveIntentResolutionContract["id"], name: string, description: string) => Object.freeze({
  id, name, description, status: "Defined", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveIntentResolutionContract);

export const ExecutiveIntentResolutionContracts = Object.freeze([
  contract("eng-3-contract-intent-identity", "Intent Identity", "Describes stable identity metadata for executive intent."),
  contract("eng-3-contract-intent-ownership", "Intent Ownership", "Describes ENG-3 ownership of specialized intent-resolution metadata."),
  contract("eng-3-contract-resolution-guarantees", "Resolution Guarantees", "Describes future resolution outcome guarantees without execution."),
  contract("eng-3-contract-capability-mapping", "Capability Mapping", "Describes references between intent and approved capabilities."),
  contract("eng-3-contract-domain-mapping", "Domain Mapping", "Describes references between intent and business domains."),
  contract("eng-3-contract-output-mapping", "Output Mapping", "Describes references between intent and output expectations."),
  contract("eng-3-contract-priority-metadata", "Priority Metadata", "Describes approved priority vocabulary."),
  contract("eng-3-contract-confidence-metadata", "Confidence Metadata", "Describes resolution-confidence vocabulary without inference."),
  contract("eng-3-contract-compatibility-metadata", "Compatibility Metadata", "Describes architectural compatibility boundaries."),
  contract("eng-3-contract-version-metadata", "Version Metadata", "Describes stable version ownership for foundation artifacts."),
] as const);
