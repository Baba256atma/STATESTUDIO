/**
 * INT-1.1 — Runtime ownership contract.
 * Defines what Dashboard Intelligence Runtime owns vs presentation layers.
 */

export const RUNTIME_OWNERSHIP_VERSION = "INT-1.1" as const;

export type RuntimeOwnedCapability =
  | "routing"
  | "normalization"
  | "diagnostics"
  | "runtime_contracts"
  | "consumer_registry"
  | "refresh_coordination"
  | "access_policy"
  | "single_intelligence_gateway";

export type PresentationOwnedCapability = "rendering" | "layout" | "interaction" | "navigation";

export const RUNTIME_OWNED_CAPABILITIES = Object.freeze([
  "routing",
  "normalization",
  "diagnostics",
  "runtime_contracts",
  "consumer_registry",
  "refresh_coordination",
  "access_policy",
  "single_intelligence_gateway",
] as const satisfies readonly RuntimeOwnedCapability[]);

export const PRESENTATION_OWNED_CAPABILITIES = Object.freeze([
  "rendering",
  "layout",
  "interaction",
  "navigation",
] as const satisfies readonly PresentationOwnedCapability[]);

export type RuntimeOwnershipContract = Readonly<{
  contractVersion: typeof RUNTIME_OWNERSHIP_VERSION;
  runtimeOwns: readonly RuntimeOwnedCapability[];
  presentationOwns: readonly PresentationOwnedCapability[];
  rule: string;
}>;

export const RUNTIME_OWNERSHIP_CONTRACT: RuntimeOwnershipContract = Object.freeze({
  contractVersion: RUNTIME_OWNERSHIP_VERSION,
  runtimeOwns: RUNTIME_OWNED_CAPABILITIES,
  presentationOwns: PRESENTATION_OWNED_CAPABILITIES,
  rule:
    "Dashboard Intelligence Runtime is the single source of executive intelligence. Presentation layers request; runtime routes, normalizes, and diagnoses.",
});

export function isRuntimeOwnedCapability(
  capability: string
): capability is RuntimeOwnedCapability {
  return (RUNTIME_OWNED_CAPABILITIES as readonly string[]).includes(capability);
}

export function isPresentationOwnedCapability(
  capability: string
): capability is PresentationOwnedCapability {
  return (PRESENTATION_OWNED_CAPABILITIES as readonly string[]).includes(capability);
}
