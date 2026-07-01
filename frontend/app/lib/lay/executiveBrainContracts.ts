export const EXECUTIVE_BRAIN_PLATFORM_CONTRACT = Object.freeze({
  contractId: "lay-1:platform-contract",
  description: "Executive Brain platform metadata contract.",
  immutable: true,
  runtimeIntelligence: false,
});

export const EXECUTIVE_BRAIN_CAPABILITY_CONTRACT = Object.freeze({
  contractId: "lay-1:capability-contract",
  description: "Executive Brain capability registration contract.",
  immutable: true,
  runtimeIntelligence: false,
});

export const EXECUTIVE_BRAIN_ENGINE_CONTRACT = Object.freeze({
  contractId: "lay-1:engine-contract",
  description: "Future engine definition contract. Names only; no implementation.",
  immutable: true,
  runtimeIntelligence: false,
});

export const EXECUTIVE_BRAIN_CONFIGURATION_CONTRACT = Object.freeze({
  contractId: "lay-1:configuration-contract",
  description: "Executive Brain configuration metadata contract.",
  immutable: true,
  runtimeIntelligence: false,
});

export const EXECUTIVE_BRAIN_VALIDATION_CONTRACT = Object.freeze({
  contractId: "lay-1:validation-contract",
  description: "Executive Brain foundation validation result contract.",
  immutable: true,
  runtimeIntelligence: false,
});

export const EXECUTIVE_BRAIN_MANIFEST_CONTRACT = Object.freeze({
  contractId: "lay-1:manifest-contract",
  description: "Executive Brain immutable manifest contract.",
  immutable: true,
  runtimeIntelligence: false,
});

export const EXECUTIVE_BRAIN_CONTRACTS = Object.freeze([
  EXECUTIVE_BRAIN_PLATFORM_CONTRACT,
  EXECUTIVE_BRAIN_CAPABILITY_CONTRACT,
  EXECUTIVE_BRAIN_ENGINE_CONTRACT,
  EXECUTIVE_BRAIN_CONFIGURATION_CONTRACT,
  EXECUTIVE_BRAIN_VALIDATION_CONTRACT,
  EXECUTIVE_BRAIN_MANIFEST_CONTRACT,
] as const);
