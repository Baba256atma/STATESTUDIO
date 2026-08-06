/** NOL-6:6 — immutable integration surface for Director Scene Binding. */
import {
  isNexoraObjectDirectorSceneBindingFreezeRegistryFrozen,
  isNexoraObjectDirectorSceneBindingFrozen,
  isNexoraObjectDirectorSceneBindingReadyForPlatform,
  nexoraObjectDirectorSceneBindingFreezeId,
  nexoraObjectDirectorSceneBindingFreezeNamespace,
  nexoraObjectDirectorSceneBindingFreezeRegistry,
  nexoraObjectDirectorSceneBindingFreezeRegistryCount,
  nexoraObjectDirectorSceneBindingFreezeVersion,
  sceneBindingFreezeStatus,
  verifyNexoraObjectDirectorSceneBindingFreeze,
  verifyNexoraObjectDirectorSceneBindingFreezeRegistry,
} from "./nexoraObjectDirectorSceneBindingFreeze.ts";

export const nexoraObjectDirectorSceneBindingPlatformId = "NOL-6:6/NexoraObjectDirectorSceneBindingPlatform" as const;
export const nexoraObjectDirectorSceneBindingPlatformVersion = "6.6.0" as const;
export const nexoraObjectDirectorSceneBindingPlatformNamespace = "nexora.nol.scene.binding.platform" as const;

function freezeOwned<T>(value: T, visited: object[] = []): T {
  if (value === null || typeof value !== "object" || visited.includes(value as object)) return value;
  visited.push(value as object);
  for (const child of Object.values(value as Record<string, unknown>)) freezeOwned(child, visited);
  return Object.freeze(value);
}

function deeplyFrozen(value: unknown, visited: object[] = []): boolean {
  if (value === null || typeof value !== "object" || visited.includes(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  visited.push(value as object);
  return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, visited));
}

function unique(values: readonly string[]): boolean {
  return values.every((value, index) => values.indexOf(value) === index);
}

export type SceneBindingPlatformStatus = Readonly<{ released: true; certified: true; frozen: true; stable: true; readiness: "ready-for-adapter" }>;
export const sceneBindingPlatformStatus: SceneBindingPlatformStatus = freezeOwned({ released: true, certified: true, frozen: true, stable: true, readiness: "ready-for-adapter" });

export type SceneBindingPlatformMetadata = Readonly<{ identity: string; version: string; namespace: string; releaseState: "released"; readiness: "ready-for-adapter"; upstreamIdentity: string; semanticVersion: "6.6.0"; compatibilityVersion: string }>;
export const sceneBindingPlatformMetadata: SceneBindingPlatformMetadata = freezeOwned({ identity: nexoraObjectDirectorSceneBindingPlatformId, version: nexoraObjectDirectorSceneBindingPlatformVersion, namespace: nexoraObjectDirectorSceneBindingPlatformNamespace, releaseState: "released", readiness: "ready-for-adapter", upstreamIdentity: nexoraObjectDirectorSceneBindingFreezeId, semanticVersion: "6.6.0", compatibilityVersion: nexoraObjectDirectorSceneBindingFreezeVersion });

export type SceneBindingPlatformCapability = "scene-binding" | "platform-surface" | "freeze-integration" | "registry-access" | "api-surface-access" | "compatibility-check" | "consumer-policy" | "adapter-readiness" | "immutable-platform";
export const sceneBindingPlatformCapabilities = freezeOwned(["scene-binding", "platform-surface", "freeze-integration", "registry-access", "api-surface-access", "compatibility-check", "consumer-policy", "adapter-readiness", "immutable-platform"] as const satisfies readonly SceneBindingPlatformCapability[]);
export const sceneBindingPlatformCapabilityCount = sceneBindingPlatformCapabilities.length;

export type SceneBindingPlatformApiEntry = Readonly<{ exportName: string; category: string; source: "NOL-6:5"; visible: true }>;
const apiDefinitions = [
  ["nexoraObjectDirectorSceneBindingFreezeId", "identity"], ["nexoraObjectDirectorSceneBindingFreezeVersion", "identity"], ["nexoraObjectDirectorSceneBindingFreezeNamespace", "identity"],
  ["SceneBindingFreezeStatus", "status"], ["sceneBindingFreezeStatus", "status"], ["SceneBindingFreezeLock", "lock"], ["nexoraObjectDirectorSceneBindingFreezeLock", "lock"], ["SceneBindingFrozenUpstream", "upstream"], ["sceneBindingFrozenUpstream", "upstream"],
  ["SceneBindingFreezeInvariantCategory", "invariant"], ["sceneBindingFreezeInvariantCategories", "invariant"], ["sceneBindingFreezeInvariantCategoryCount", "invariant"], ["SceneBindingFreezeInvariantId", "invariant"], ["SceneBindingFreezeInvariant", "invariant"], ["sceneBindingFreezeInvariants", "invariant"], ["sceneBindingFreezeInvariantCount", "invariant"],
  ["SceneBindingFrozenApiEntry", "api-surface"], ["sceneBindingFrozenPublicApiSurface", "api-surface"], ["sceneBindingFrozenPublicApiCount", "api-surface"],
  ["SceneBindingFreezeCompatibilityPolicy", "policy"], ["sceneBindingFreezeCompatibilityPolicy", "policy"], ["SceneBindingFreezeConsumerPolicy", "policy"], ["sceneBindingFreezeConsumerPolicy", "policy"],
  ["nexoraObjectDirectorSceneBindingFreezeCapabilities", "capability"], ["nexoraObjectDirectorSceneBindingFreezeCapabilityCount", "capability"], ["nexoraObjectDirectorSceneBindingFreezePublicApiSurface", "api-surface"], ["nexoraObjectDirectorSceneBindingFreezePublicApiCount", "api-surface"],
  ["SceneBindingFreezeRegistryEntry", "registry"], ["nexoraObjectDirectorSceneBindingFreezeRegistry", "registry"], ["nexoraObjectDirectorSceneBindingFreezeRegistryCount", "registry"], ["getNexoraObjectDirectorSceneBindingFreezeRegistry", "registry-api"], ["getNexoraObjectDirectorSceneBindingFreezeRegistryCount", "registry-api"], ["isNexoraObjectDirectorSceneBindingFreezeRegistryFrozen", "registry-api"], ["verifyNexoraObjectDirectorSceneBindingFreezeRegistry", "registry-api"],
  ["SceneBindingFreezeCheckId", "verification"], ["SceneBindingFreezeCheckResult", "verification"], ["SceneBindingFreezeVerificationResult", "verification"], ["verifyNexoraObjectDirectorSceneBindingFreeze", "verification"], ["isNexoraObjectDirectorSceneBindingFrozen", "verification"], ["isNexoraObjectDirectorSceneBindingReadyForPlatform", "verification"],
  ["getNexoraObjectDirectorSceneBindingFrozenApiSurface", "api-surface"], ["getNexoraObjectDirectorSceneBindingFrozenApiCount", "api-surface"], ["getNexoraObjectDirectorSceneBindingFreezeSummary", "summary"],
] as const;
export const sceneBindingPlatformApiSurface: readonly SceneBindingPlatformApiEntry[] = freezeOwned(apiDefinitions.map(([exportName, category]) => freezeOwned({ exportName, category, source: "NOL-6:5", visible: true })));
export const sceneBindingPlatformApiCount = sceneBindingPlatformApiSurface.length;

export type SceneBindingPlatformConsumerPolicy = Readonly<{ immediateConsumer: "NOL-6:7"; finalConsumer: "NOL-6:9 Public Index"; directFeatureImportAllowed: false }>;
export const sceneBindingPlatformConsumerPolicy: SceneBindingPlatformConsumerPolicy = freezeOwned({ immediateConsumer: "NOL-6:7", finalConsumer: "NOL-6:9 Public Index", directFeatureImportAllowed: false });

export type SceneBindingPlatformAdapterPolicy = Readonly<{ adapterReady: true; freezeRequired: true; certificationRequired: true; validationRequired: false; runtimeRequired: false }>;
export const sceneBindingPlatformAdapterPolicy: SceneBindingPlatformAdapterPolicy = freezeOwned({ adapterReady: true, freezeRequired: true, certificationRequired: true, validationRequired: false, runtimeRequired: false });

export type SceneBindingPlatformCompatibilityPolicy = Readonly<{ breakingChangesAllowed: false; apiMutationAllowed: false; overrideAllowed: false; newPhaseRequired: true; backwardCompatible: true }>;
export const sceneBindingPlatformCompatibilityPolicy: SceneBindingPlatformCompatibilityPolicy = freezeOwned({ breakingChangesAllowed: false, apiMutationAllowed: false, overrideAllowed: false, newPhaseRequired: true, backwardCompatible: true });

export type SceneBindingPlatformRegistryEntry = Readonly<{ name: string; order: number }>;
export const nexoraObjectDirectorSceneBindingPlatformRegistry: readonly SceneBindingPlatformRegistryEntry[] = freezeOwned(["Identity", "Metadata", "Status", "Capabilities", "API Surface", "Consumer Policy", "Adapter Policy", "Compatibility Policy", "Public APIs", "Dependency", "Release Information"].map((name, index) => freezeOwned({ name, order: index + 1 })));
export const nexoraObjectDirectorSceneBindingPlatformRegistryCount = nexoraObjectDirectorSceneBindingPlatformRegistry.length;

export const nexoraObjectDirectorSceneBindingPlatformPublicApiSurface = freezeOwned(["getNexoraObjectDirectorSceneBindingPlatform", "getNexoraObjectDirectorSceneBindingPlatformRegistry", "getNexoraObjectDirectorSceneBindingPlatformRegistryCount", "getNexoraObjectDirectorSceneBindingPlatformApiSurface", "getNexoraObjectDirectorSceneBindingPlatformApiCount", "verifyNexoraObjectDirectorSceneBindingPlatform", "isNexoraObjectDirectorSceneBindingPlatformFrozen", "isNexoraObjectDirectorSceneBindingReadyForAdapter", "getNexoraObjectDirectorSceneBindingPlatformSummary", "verifyNexoraObjectDirectorSceneBindingPlatformRegistry", "isNexoraObjectDirectorSceneBindingPlatformRegistryFrozen"] as const);
export const nexoraObjectDirectorSceneBindingPlatformPublicApiCount = nexoraObjectDirectorSceneBindingPlatformPublicApiSurface.length;

export type SceneBindingPlatform = Readonly<{ metadata: SceneBindingPlatformMetadata; status: SceneBindingPlatformStatus; capabilities: readonly SceneBindingPlatformCapability[]; apiSurface: readonly SceneBindingPlatformApiEntry[]; consumerPolicy: SceneBindingPlatformConsumerPolicy; adapterPolicy: SceneBindingPlatformAdapterPolicy; compatibilityPolicy: SceneBindingPlatformCompatibilityPolicy; registry: readonly SceneBindingPlatformRegistryEntry[]; upstream: string }>;
export const nexoraObjectDirectorSceneBindingPlatform: SceneBindingPlatform = freezeOwned({ metadata: sceneBindingPlatformMetadata, status: sceneBindingPlatformStatus, capabilities: sceneBindingPlatformCapabilities, apiSurface: sceneBindingPlatformApiSurface, consumerPolicy: sceneBindingPlatformConsumerPolicy, adapterPolicy: sceneBindingPlatformAdapterPolicy, compatibilityPolicy: sceneBindingPlatformCompatibilityPolicy, registry: nexoraObjectDirectorSceneBindingPlatformRegistry, upstream: nexoraObjectDirectorSceneBindingFreezeId });

export function getNexoraObjectDirectorSceneBindingPlatform(): SceneBindingPlatform { return nexoraObjectDirectorSceneBindingPlatform; }
export function getNexoraObjectDirectorSceneBindingPlatformRegistry(): typeof nexoraObjectDirectorSceneBindingPlatformRegistry { return nexoraObjectDirectorSceneBindingPlatformRegistry; }
export function getNexoraObjectDirectorSceneBindingPlatformRegistryCount(): number { return nexoraObjectDirectorSceneBindingPlatformRegistry.length; }
export function getNexoraObjectDirectorSceneBindingPlatformApiSurface(): typeof sceneBindingPlatformApiSurface { return sceneBindingPlatformApiSurface; }
export function getNexoraObjectDirectorSceneBindingPlatformApiCount(): number { return sceneBindingPlatformApiSurface.length; }

export function isNexoraObjectDirectorSceneBindingPlatformRegistryFrozen(): boolean { return deeplyFrozen(nexoraObjectDirectorSceneBindingPlatformRegistry) && deeplyFrozen(nexoraObjectDirectorSceneBindingPlatformPublicApiSurface) && deeplyFrozen(sceneBindingPlatformCapabilities) && deeplyFrozen(sceneBindingPlatformApiSurface); }
export function verifyNexoraObjectDirectorSceneBindingPlatformRegistry(): Readonly<{ valid: boolean; ordered: boolean; unique: boolean; countValid: boolean; publicApisValid: boolean; frozen: boolean; violations: readonly string[] }> {
  const ordered = nexoraObjectDirectorSceneBindingPlatformRegistry.every((entry, index) => entry.order === index + 1);
  const uniqueEntries = unique(nexoraObjectDirectorSceneBindingPlatformRegistry.map((entry) => entry.name));
  const countValid = nexoraObjectDirectorSceneBindingPlatformRegistryCount === nexoraObjectDirectorSceneBindingPlatformRegistry.length;
  const publicApisValid = nexoraObjectDirectorSceneBindingPlatformPublicApiCount === nexoraObjectDirectorSceneBindingPlatformPublicApiSurface.length && unique([...nexoraObjectDirectorSceneBindingPlatformPublicApiSurface]);
  const frozen = isNexoraObjectDirectorSceneBindingPlatformRegistryFrozen();
  const checks: readonly [boolean, string][] = [[ordered, "Platform registry order is invalid"], [uniqueEntries, "Platform registry entries are duplicated"], [countValid, "Platform registry count is invalid"], [publicApisValid, "Platform Public APIs are invalid"], [frozen, "Platform registry is mutable"]];
  const violations = checks.filter(([passed]) => !passed).map(([, message]) => message);
  return freezeOwned({ valid: violations.length === 0, ordered, unique: uniqueEntries, countValid, publicApisValid, frozen, violations: freezeOwned(violations) });
}

const verificationDefinitions = [["identity", "Platform identity"], ["namespace", "Platform namespace"], ["version", "Platform version"], ["upstream-freeze", "Upstream Freeze"], ["registry", "Platform registry"], ["api-surface", "Platform API surface"], ["capabilities", "Platform capabilities"], ["consumer-policy", "Consumer policy"], ["adapter-policy", "Adapter policy"], ["compatibility-policy", "Compatibility policy"], ["readiness", "Adapter readiness"]] as const;
export type SceneBindingPlatformCheckId = typeof verificationDefinitions[number][0];
export type SceneBindingPlatformCheckResult = Readonly<{ checkId: SceneBindingPlatformCheckId; passed: boolean; message: string }>;
export type SceneBindingPlatformVerificationResult = Readonly<{ valid: boolean; readyForAdapter: boolean; checkResults: readonly SceneBindingPlatformCheckResult[]; passedCheckCount: number; failedCheckCount: number }>;

function upstreamFreezeValid(): boolean { const verification = verifyNexoraObjectDirectorSceneBindingFreeze(), registry = verifyNexoraObjectDirectorSceneBindingFreezeRegistry(); return nexoraObjectDirectorSceneBindingFreezeId === "NOL-6:5/NexoraObjectDirectorSceneBindingFreeze" && nexoraObjectDirectorSceneBindingFreezeVersion === "6.5.0" && nexoraObjectDirectorSceneBindingFreezeNamespace === "nexora.nol.scene.binding.freeze" && sceneBindingFreezeStatus.readiness === "ready-for-platform" && verification.valid && isNexoraObjectDirectorSceneBindingFrozen() && isNexoraObjectDirectorSceneBindingReadyForPlatform() && registry.valid && isNexoraObjectDirectorSceneBindingFreezeRegistryFrozen() && nexoraObjectDirectorSceneBindingFreezeRegistryCount === nexoraObjectDirectorSceneBindingFreezeRegistry.length; }
function verificationStates(): readonly boolean[] {
  const registry = verifyNexoraObjectDirectorSceneBindingPlatformRegistry(), apiNames = sceneBindingPlatformApiSurface.map((entry) => entry.exportName);
  const consumerValid = sceneBindingPlatformConsumerPolicy.immediateConsumer === "NOL-6:7" && sceneBindingPlatformConsumerPolicy.finalConsumer === "NOL-6:9 Public Index" && !sceneBindingPlatformConsumerPolicy.directFeatureImportAllowed;
  const adapterValid = sceneBindingPlatformAdapterPolicy.adapterReady && sceneBindingPlatformAdapterPolicy.freezeRequired && sceneBindingPlatformAdapterPolicy.certificationRequired && !sceneBindingPlatformAdapterPolicy.validationRequired && !sceneBindingPlatformAdapterPolicy.runtimeRequired;
  const compatibilityValid = !sceneBindingPlatformCompatibilityPolicy.breakingChangesAllowed && !sceneBindingPlatformCompatibilityPolicy.apiMutationAllowed && !sceneBindingPlatformCompatibilityPolicy.overrideAllowed && sceneBindingPlatformCompatibilityPolicy.newPhaseRequired && sceneBindingPlatformCompatibilityPolicy.backwardCompatible;
  const statusValid = sceneBindingPlatformStatus.released && sceneBindingPlatformStatus.certified && sceneBindingPlatformStatus.frozen && sceneBindingPlatformStatus.stable && sceneBindingPlatformStatus.readiness === "ready-for-adapter";
  return [nexoraObjectDirectorSceneBindingPlatformId === "NOL-6:6/NexoraObjectDirectorSceneBindingPlatform", nexoraObjectDirectorSceneBindingPlatformNamespace === "nexora.nol.scene.binding.platform", nexoraObjectDirectorSceneBindingPlatformVersion === "6.6.0", upstreamFreezeValid(), registry.valid, sceneBindingPlatformApiCount === sceneBindingPlatformApiSurface.length && unique(apiNames) && sceneBindingPlatformApiSurface.every((entry) => entry.source === "NOL-6:5" && entry.visible), sceneBindingPlatformCapabilityCount === sceneBindingPlatformCapabilities.length && unique([...sceneBindingPlatformCapabilities]), consumerValid, adapterValid, compatibilityValid, statusValid && adapterValid && upstreamFreezeValid()];
}

export function verifyNexoraObjectDirectorSceneBindingPlatform(): SceneBindingPlatformVerificationResult { const states = verificationStates(), checkResults = freezeOwned(verificationDefinitions.map(([checkId, title], index) => freezeOwned({ checkId, passed: states[index] === true, message: states[index] === true ? `${title} verified.` : `${title} failed.` }))), passedCheckCount = checkResults.filter((entry) => entry.passed).length, failedCheckCount = checkResults.length - passedCheckCount; return freezeOwned({ valid: failedCheckCount === 0, readyForAdapter: failedCheckCount === 0 && sceneBindingPlatformStatus.readiness === "ready-for-adapter", checkResults, passedCheckCount, failedCheckCount }); }
export function isNexoraObjectDirectorSceneBindingPlatformFrozen(): boolean { const verification = verifyNexoraObjectDirectorSceneBindingPlatform(); return verification.valid && sceneBindingPlatformStatus.frozen && deeplyFrozen(nexoraObjectDirectorSceneBindingPlatform) && isNexoraObjectDirectorSceneBindingPlatformRegistryFrozen(); }
export function isNexoraObjectDirectorSceneBindingReadyForAdapter(): boolean { const verification = verifyNexoraObjectDirectorSceneBindingPlatform(); return verification.valid && verification.readyForAdapter && isNexoraObjectDirectorSceneBindingPlatformFrozen() && sceneBindingPlatformAdapterPolicy.adapterReady; }
export function getNexoraObjectDirectorSceneBindingPlatformSummary(): Readonly<{ identity: string; version: string; namespace: string; readiness: "ready-for-adapter"; capabilityCount: number; apiCount: number; registryCount: number; upstream: string; nextPhase: "NOL-6:7" }> { return freezeOwned({ identity: nexoraObjectDirectorSceneBindingPlatformId, version: nexoraObjectDirectorSceneBindingPlatformVersion, namespace: nexoraObjectDirectorSceneBindingPlatformNamespace, readiness: sceneBindingPlatformStatus.readiness, capabilityCount: sceneBindingPlatformCapabilities.length, apiCount: sceneBindingPlatformApiSurface.length, registryCount: nexoraObjectDirectorSceneBindingPlatformRegistry.length, upstream: nexoraObjectDirectorSceneBindingFreezeId, nextPhase: "NOL-6:7" }); }
