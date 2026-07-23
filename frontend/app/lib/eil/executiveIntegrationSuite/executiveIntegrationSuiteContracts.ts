/**
 * EIL-8:1 — Executive Integration Suite Foundation Contracts.
 *
 * Exactly eight immutable suite contracts.
 * Metadata only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-8:1.
 */

/** Closed suite-contract key vocabulary. */
export type SuiteContractKey =
  | "SuiteContract"
  | "ModuleCompositionContract"
  | "PublicIndexContract"
  | "DependencyContract"
  | "CompatibilityContract"
  | "SuiteIdentityContract"
  | "SuiteLifecycleContract"
  | "SuitePublicationContract";

/** Immutable suite contract descriptor. */
export interface ExecutiveIntegrationSuiteContract {
  readonly contractId: `EIL-8:1/Contract/${SuiteContractKey}`;
  readonly contractKey: SuiteContractKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-suite.foundation";
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
}

const contract = (
  contractKey: SuiteContractKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationSuiteContract =>
  Object.freeze({
    contractId: `EIL-8:1/Contract/${contractKey}` as const,
    contractKey,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-suite.foundation" as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight immutable suite contracts in deterministic order.
 */
export const ExecutiveIntegrationSuiteContracts: readonly ExecutiveIntegrationSuiteContract[] =
  Object.freeze([
    contract(
      "SuiteContract",
      "Suite Contract",
      "Canonical metadata contract for Executive Integration Suite identity and composition.",
      1,
    ),
    contract(
      "ModuleCompositionContract",
      "Module Composition Contract",
      "Declares EIL-1 through EIL-7 module membership by Public Index reference.",
      2,
    ),
    contract(
      "PublicIndexContract",
      "Public Index Contract",
      "Requires exclusive composition through released Public Indexes.",
      3,
    ),
    contract(
      "DependencyContract",
      "Dependency Contract",
      "Declares Public Index–only dependency direction for Suite Foundation.",
      4,
    ),
    contract(
      "CompatibilityContract",
      "Compatibility Contract",
      "Declares architectural compatibility across composed EIL modules.",
      5,
    ),
    contract(
      "SuiteIdentityContract",
      "Suite Identity Contract",
      "Binds canonical Suite Foundation identity metadata.",
      6,
    ),
    contract(
      "SuiteLifecycleContract",
      "Suite Lifecycle Contract",
      "Declares the Suite architectural lifecycle ladder stages.",
      7,
    ),
    contract(
      "SuitePublicationContract",
      "Suite Publication Contract",
      "Declares metadata-only Suite publication readiness without runtime surfaces.",
      8,
    ),
  ]);
