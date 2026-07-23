/**
 * EIL-9:1 — Executive Integration Layer Foundation Contracts.
 *
 * Exactly eight immutable layer contracts.
 * Metadata only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-9:1.
 */

/** Closed layer-contract key vocabulary. */
export type LayerContractKey =
  | "LayerContract"
  | "LayerCompositionContract"
  | "SuiteReferenceContract"
  | "DependencyContract"
  | "CompatibilityContract"
  | "LayerIdentityContract"
  | "LayerLifecycleContract"
  | "LayerPublicationContract";

/** Immutable layer contract descriptor. */
export interface ExecutiveIntegrationLayerContract {
  readonly contractId: `EIL-9:1/Contract/${LayerContractKey}`;
  readonly contractKey: LayerContractKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-layer.foundation";
  readonly status: "Declared";
  readonly runtimeResolved: false;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
}

const contract = (
  contractKey: LayerContractKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationLayerContract =>
  Object.freeze({
    contractId: `EIL-9:1/Contract/${contractKey}` as const,
    contractKey,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-layer.foundation" as const,
    status: "Declared" as const,
    runtimeResolved: false as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight immutable layer contracts in deterministic order.
 */
export const ExecutiveIntegrationLayerContracts: readonly ExecutiveIntegrationLayerContract[] =
  Object.freeze([
    contract(
      "LayerContract",
      "Layer Contract",
      "Canonical metadata contract for Executive Integration Layer identity and composition.",
      1,
    ),
    contract(
      "LayerCompositionContract",
      "Layer Composition Contract",
      "Declares layer composition of the released Executive Integration Suite Public Index.",
      2,
    ),
    contract(
      "SuiteReferenceContract",
      "Suite Reference Contract",
      "Requires exclusive composition through the EIL-8 Public Index reference.",
      3,
    ),
    contract(
      "DependencyContract",
      "Dependency Contract",
      "Declares EIL-8 Public Index–only dependency direction for Layer Foundation.",
      4,
    ),
    contract(
      "CompatibilityContract",
      "Compatibility Contract",
      "Declares architectural compatibility with the frozen Executive Integration Suite.",
      5,
    ),
    contract(
      "LayerIdentityContract",
      "Layer Identity Contract",
      "Locks canonical Layer Foundation identity metadata.",
      6,
    ),
    contract(
      "LayerLifecycleContract",
      "Layer Lifecycle Contract",
      "Declares immutable Layer Foundation lifecycle stage vocabulary.",
      7,
    ),
    contract(
      "LayerPublicationContract",
      "Layer Publication Contract",
      "Declares metadata-only publication surface for Layer Foundation.",
      8,
    ),
  ]);
