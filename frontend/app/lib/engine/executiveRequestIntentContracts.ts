import type { ExecutiveRequestIntentContractDescriptor } from "./executiveRequestIntentTypes.ts";

const contract = (
  id: string,
  name: string,
  responsibility: ExecutiveRequestIntentContractDescriptor["responsibility"],
  description: string,
) => Object.freeze({
  id, name, responsibility, description,
  status: "Defined", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentContractDescriptor);

export const ExecutiveRequestIntentContracts = Object.freeze([
  contract("executive-request-contract", "Executive Request Contract", "Request", "Describes the identity and architectural representation of an executive request."),
  contract("executive-intent-contract", "Executive Intent Contract", "Intent", "Describes the identity and architectural representation of executive intent."),
  contract("request-classification-contract", "Classification Contract", "Classification", "Describes approved request classification metadata."),
  contract("request-priority-contract", "Priority Contract", "Priority", "Describes request priority vocabulary without prioritization logic."),
  contract("request-scope-contract", "Scope Contract", "Scope", "Describes the declared architectural scope of a request."),
  contract("request-context-contract", "Context Contract", "Context", "Describes immutable references to separately owned context metadata."),
  contract("request-metadata-contract", "Metadata Contract", "Metadata", "Describes the canonical metadata envelope for request and intent records."),
] as const);
