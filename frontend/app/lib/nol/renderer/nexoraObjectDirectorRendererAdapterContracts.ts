/** NOL-5:2 — immutable contracts for the Director Renderer Adapter boundary. */
import {
  adaptRuntimeObject,
  foundationId,
  foundationVersion,
  freezeRendererObject,
  resolveRendererColor,
  verifyRendererAdapter,
  verifyRendererValueFrozen,
  type RendererBadge,
  type RendererColor,
  type RendererObject,
  type RendererState,
  type RendererVisibility,
  type NexoraDirectorRuntimeObjectState,
} from "./nexoraObjectDirectorRendererAdapterFoundation.ts";

// NOL-5:2 is the supported doorway to Foundation behavior for downstream layers.
export { adaptRuntimeObject, freezeRendererObject, verifyRendererValueFrozen };
export type {
  NexoraDirectorRuntimeObjectState,
  RendererObject,
  RendererState,
  RendererVisibility,
};

export const contractsId = "NOL-5:2/NexoraObjectDirectorRendererAdapterContracts" as const;
export const contractsVersion = "5.2.0" as const;
export const contractsNamespace = "nexora.nol.renderer.adapter.contracts" as const;
export const contractsStatus = "Contracts" as const;
export const contractsLock = "NOL-5-2-DIRECTOR-RENDERER-ADAPTER-CONTRACTS-LOCKED" as const;

export interface NexoraObjectDirectorRendererAdapterInputContract {
  readonly runtimeObject: unknown;
  readonly sourceRuntimeId: string;
  readonly requestedRendererState?: RendererState;
  readonly preserveRuntimeMetadata: boolean;
}

export interface NexoraObjectDirectorRendererAdapterOutputContract {
  readonly rendererObject: RendererObject;
  readonly sourceRuntimeId: string;
  readonly adapted: boolean;
  readonly deeplyFrozen: boolean;
  readonly deterministic: boolean;
  readonly warnings: readonly string[];
}

export interface NexoraObjectDirectorRendererCollectionContract {
  readonly sourceCount: number;
  readonly outputCount: number;
  readonly orderPreserved: boolean;
  readonly rendererObjects: readonly RendererObject[];
  readonly deeplyFrozen: boolean;
}

export interface NexoraObjectDirectorRendererStateContract {
  readonly runtimeState: string;
  readonly rendererState: RendererState;
  readonly supported: boolean;
  readonly fallbackApplied: boolean;
}

export interface NexoraObjectDirectorRendererVisibilityContract {
  readonly runtimeVisibility: string;
  readonly rendererVisibility: RendererVisibility;
  readonly supported: boolean;
  readonly fallbackApplied: boolean;
}

export type RendererSeedPaletteKey = "green" | "yellow" | "red" | "blue" | "neutral";

export interface NexoraObjectDirectorRendererSeedColorContract {
  readonly runtimeStatus: string;
  readonly rendererColor: RendererColor;
  readonly paletteKey: RendererSeedPaletteKey;
  readonly supported: boolean;
  readonly fallbackApplied: boolean;
}

export interface NexoraObjectDirectorRendererBadgeContract {
  readonly badges: readonly RendererBadge[];
  readonly badgeCount: number;
  readonly immutable: boolean;
  readonly deterministic: boolean;
}

export interface NexoraObjectDirectorRendererLabelContract {
  readonly sourceCaption: string;
  readonly resolvedLabel: string;
  readonly fallbackApplied: boolean;
  readonly deterministic: boolean;
}

export interface NexoraObjectDirectorRendererAdapterGuarantees {
  readonly pure: true;
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly runtimeMutationForbidden: true;
  readonly rendererExecutionForbidden: true;
  readonly frameworkIndependent: true;
  readonly deeplyFrozenOutputs: true;
  readonly collectionOrderPreserved: true;
  readonly seedPaletteOnly: true;
}

export interface NexoraObjectDirectorRendererAdapterCompatibilityContract {
  readonly foundationIdentity: string;
  readonly contractsIdentity: string;
  readonly compatibleFoundationVersion: string;
  readonly rendererFrameworkAgnostic: true;
  readonly backwardCompatible: boolean;
}

export interface NexoraObjectDirectorRendererAdapterContractVerificationReport {
  readonly valid: boolean;
  readonly identityValid: boolean;
  readonly namespaceValid: boolean;
  readonly dependencyValid: boolean;
  readonly guaranteesValid: boolean;
  readonly contractsFrozen: boolean;
  readonly violations: readonly string[];
}

export interface RendererAdapterContractValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export const rendererAdapterGuarantees: NexoraObjectDirectorRendererAdapterGuarantees = freezeRendererObject({
  pure: true,
  deterministic: true,
  sideEffectFree: true,
  runtimeMutationForbidden: true,
  rendererExecutionForbidden: true,
  frameworkIndependent: true,
  deeplyFrozenOutputs: true,
  collectionOrderPreserved: true,
  seedPaletteOnly: true,
} as const);

export const rendererAdapterCompatibilityContract: NexoraObjectDirectorRendererAdapterCompatibilityContract = freezeRendererObject({
  foundationIdentity: foundationId,
  contractsIdentity: contractsId,
  compatibleFoundationVersion: foundationVersion,
  rendererFrameworkAgnostic: true,
  backwardCompatible: true,
} as const);

export const rendererSeedPaletteKeys = freezeRendererObject([
  "green",
  "yellow",
  "red",
  "blue",
  "neutral",
] as const satisfies readonly RendererSeedPaletteKey[]);

export const rendererAdapterContractRegistry = freezeRendererObject([
  "Input",
  "Output",
  "Collection",
  "State",
  "Visibility",
  "Seed Color",
  "Badge",
  "Label",
  "Guarantees",
  "Compatibility",
  "Verification",
] as const);

export const rendererAdapterContractCount = rendererAdapterContractRegistry.length;

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function result(errors: readonly string[]): RendererAdapterContractValidationResult {
  return freezeRendererObject({ valid: errors.length === 0, errors: [...errors] });
}

export function createRendererAdapterInputContract(
  runtimeObject: unknown,
  sourceRuntimeId: string,
  options: { readonly requestedRendererState?: RendererState; readonly preserveRuntimeMetadata?: boolean } = {},
): NexoraObjectDirectorRendererAdapterInputContract {
  if (runtimeObject === null || typeof runtimeObject !== "object" || !verifyRendererValueFrozen(runtimeObject)) throw new TypeError("Director Runtime input must already be immutable");
  if (!sourceRuntimeId) throw new TypeError("sourceRuntimeId is required");
  return freezeRendererObject({
    runtimeObject,
    sourceRuntimeId,
    ...(options.requestedRendererState ? { requestedRendererState: options.requestedRendererState } : {}),
    preserveRuntimeMetadata: options.preserveRuntimeMetadata ?? true,
  });
}

export function createRendererAdapterOutputContract(
  rendererObject: RendererObject,
  sourceRuntimeId: string,
  adapted = true,
  warnings: readonly string[] = [],
): NexoraObjectDirectorRendererAdapterOutputContract {
  if (!sourceRuntimeId) throw new TypeError("sourceRuntimeId is required");
  return freezeRendererObject({ rendererObject, sourceRuntimeId, adapted, deeplyFrozen: verifyRendererValueFrozen(rendererObject), deterministic: true, warnings: [...warnings] });
}

export function createRendererCollectionContract(
  sourceCount: number,
  rendererObjects: readonly RendererObject[],
  sourceOrder?: readonly string[],
  outputOrder?: readonly string[],
): NexoraObjectDirectorRendererCollectionContract {
  if (!Number.isInteger(sourceCount) || sourceCount < 0) throw new TypeError("sourceCount must be a non-negative integer");
  const derivedOutputOrder = outputOrder ?? rendererObjects.map((object) => object.id);
  const orderPreserved = sourceCount === rendererObjects.length && (!sourceOrder || (sourceOrder.length === derivedOutputOrder.length && sourceOrder.every((id, index) => id === derivedOutputOrder[index])));
  return freezeRendererObject({ sourceCount, outputCount: rendererObjects.length, orderPreserved, rendererObjects: [...rendererObjects], deeplyFrozen: rendererObjects.every(verifyRendererValueFrozen) });
}

export function createRendererStateContract(runtimeState: string, rendererState?: RendererState, supported = rendererState !== undefined): NexoraObjectDirectorRendererStateContract {
  const fallbackApplied = !supported || rendererState === undefined;
  return freezeRendererObject({ runtimeState, rendererState: fallbackApplied ? "minimum" : rendererState, supported: !fallbackApplied, fallbackApplied });
}

export function createRendererVisibilityContract(runtimeVisibility: string, rendererVisibility?: RendererVisibility, supported = rendererVisibility !== undefined): NexoraObjectDirectorRendererVisibilityContract {
  const fallbackApplied = !supported || rendererVisibility === undefined;
  return freezeRendererObject({ runtimeVisibility, rendererVisibility: fallbackApplied ? "hidden" : rendererVisibility, supported: !fallbackApplied, fallbackApplied });
}

export function createRendererSeedColorContract(runtimeStatus: string, requestedPaletteKey?: string): NexoraObjectDirectorRendererSeedColorContract {
  if (requestedPaletteKey !== undefined && !rendererSeedPaletteKeys.includes(requestedPaletteKey as RendererSeedPaletteKey)) throw new TypeError(`Unsupported Seed palette key: ${requestedPaletteKey}`);
  const statusColor = resolveRendererColor(runtimeStatus);
  const derivedKey: RendererSeedPaletteKey = statusColor.base === "Green" ? "green" : statusColor.base === "Yellow" ? "yellow" : statusColor.base === "Red" ? "red" : statusColor.base === "Blue" ? "blue" : "neutral";
  const paletteKey = (requestedPaletteKey as RendererSeedPaletteKey | undefined) ?? derivedKey;
  const rendererColor = requestedPaletteKey === undefined ? statusColor : resolveRendererColor(paletteKey === "green" ? "Healthy" : paletteKey === "yellow" ? "Warning" : paletteKey === "red" ? "Failed" : paletteKey === "blue" ? "Running" : "Unknown");
  return freezeRendererObject({ runtimeStatus, rendererColor, paletteKey, supported: derivedKey !== "neutral", fallbackApplied: requestedPaletteKey === undefined && derivedKey === "neutral" });
}

export function createRendererBadgeContract(badges: readonly RendererBadge[]): NexoraObjectDirectorRendererBadgeContract {
  const immutableBadges = freezeRendererObject(badges.map((badge) => ({ ...badge })));
  return freezeRendererObject({ badges: immutableBadges, badgeCount: immutableBadges.length, immutable: true, deterministic: true });
}

export function createRendererLabelContract(sourceCaption: string, resolvedLabel?: string): NexoraObjectDirectorRendererLabelContract {
  return freezeRendererObject({ sourceCaption, resolvedLabel: resolvedLabel ?? sourceCaption, fallbackApplied: resolvedLabel === undefined, deterministic: true });
}

export function validateRendererAdapterInputContract(value: unknown): RendererAdapterContractValidationResult {
  const errors: string[] = [];
  if (!record(value) || value.runtimeObject === null || typeof value.runtimeObject !== "object") return result(["runtimeObject is required"]);
  if (typeof value.sourceRuntimeId !== "string" || !value.sourceRuntimeId) errors.push("sourceRuntimeId is required");
  if (typeof value.preserveRuntimeMetadata !== "boolean") errors.push("preserveRuntimeMetadata must be boolean");
  if (value.requestedRendererState !== undefined && !["minimum", "report", "operation"].includes(String(value.requestedRendererState))) errors.push("requestedRendererState is invalid");
  if (!verifyRendererValueFrozen(value)) errors.push("input contract must be deeply frozen");
  return result(errors);
}

export function validateRendererAdapterOutputContract(value: unknown): RendererAdapterContractValidationResult {
  const errors: string[] = [];
  if (!record(value) || !record(value.rendererObject)) return result(["rendererObject is required"]);
  if (typeof value.sourceRuntimeId !== "string" || !value.sourceRuntimeId) errors.push("sourceRuntimeId is required");
  if (value.adapted !== true) errors.push("adapted must be true");
  if (value.deeplyFrozen !== true || !verifyRendererValueFrozen(value.rendererObject)) errors.push("rendererObject must be declared and proven deeply frozen");
  if (value.deterministic !== true) errors.push("deterministic must be true");
  if (!Array.isArray(value.warnings) || !Object.isFrozen(value.warnings)) errors.push("warnings must be an immutable array");
  if (!verifyRendererAdapter(value.rendererObject as unknown as RendererObject).valid) errors.push("rendererObject failed Foundation verification");
  if (!verifyRendererValueFrozen(value)) errors.push("output contract must be deeply frozen");
  return result(errors);
}

export function validateRendererAdapterGuarantees(value: unknown): RendererAdapterContractValidationResult {
  const required = ["pure", "deterministic", "sideEffectFree", "runtimeMutationForbidden", "rendererExecutionForbidden", "frameworkIndependent", "deeplyFrozenOutputs", "collectionOrderPreserved", "seedPaletteOnly"] as const;
  if (!record(value)) return result(["adapter guarantees are required"]);
  const errors = required.filter((key) => value[key] !== true).map((key) => `${key} must be exactly true`);
  if (!verifyRendererValueFrozen(value)) errors.push("adapter guarantees must be deeply frozen");
  return result(errors);
}

export function verifyRendererAdapterContracts(contractObjects: readonly unknown[] = []): NexoraObjectDirectorRendererAdapterContractVerificationReport {
  const identityValid = contractsId === "NOL-5:2/NexoraObjectDirectorRendererAdapterContracts" && contractsVersion === "5.2.0" && contractsStatus === "Contracts" && contractsLock === "NOL-5-2-DIRECTOR-RENDERER-ADAPTER-CONTRACTS-LOCKED";
  const namespaceValid = contractsNamespace === "nexora.nol.renderer.adapter.contracts";
  const dependencyValid = rendererAdapterCompatibilityContract.foundationIdentity === foundationId && rendererAdapterCompatibilityContract.compatibleFoundationVersion === foundationVersion;
  const guaranteesValid = validateRendererAdapterGuarantees(rendererAdapterGuarantees).valid;
  const registryValid = rendererAdapterContractRegistry.length === rendererAdapterContractCount && rendererAdapterContractRegistry.join("|") === "Input|Output|Collection|State|Visibility|Seed Color|Badge|Label|Guarantees|Compatibility|Verification";
  const compatibilityValid = rendererAdapterCompatibilityContract.contractsIdentity === contractsId && rendererAdapterCompatibilityContract.rendererFrameworkAgnostic && rendererAdapterCompatibilityContract.backwardCompatible;
  const contractsFrozen = [rendererAdapterGuarantees, rendererAdapterCompatibilityContract, rendererSeedPaletteKeys, rendererAdapterContractRegistry, ...contractObjects].every(verifyRendererValueFrozen);
  const violations: string[] = [];
  if (!identityValid) violations.push("Contract identity, version, status, or lock is invalid");
  if (!namespaceValid) violations.push("Contract namespace is invalid");
  if (!dependencyValid) violations.push("Foundation dependency is incompatible");
  if (!registryValid) violations.push("Contract registry is invalid");
  if (!guaranteesValid) violations.push("Adapter guarantees are incomplete");
  if (!compatibilityValid) violations.push("Compatibility contract is invalid");
  if (!contractsFrozen) violations.push("A public contract object is mutable");
  return freezeRendererObject({ valid: violations.length === 0, identityValid, namespaceValid, dependencyValid, guaranteesValid, contractsFrozen, violations });
}
