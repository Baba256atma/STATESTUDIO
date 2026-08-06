/** NOL-6:5 — immutable release boundary for certified Director Scene Binding. */
import {
  isNexoraObjectDirectorSceneBindingCertificationRegistryFrozen,
  nexoraObjectDirectorSceneBindingCertificationCapabilities,
  nexoraObjectDirectorSceneBindingCertificationCapabilityCount,
  nexoraObjectDirectorSceneBindingCertificationId,
  nexoraObjectDirectorSceneBindingCertificationNamespace,
  nexoraObjectDirectorSceneBindingCertificationPublicApiCount,
  nexoraObjectDirectorSceneBindingCertificationPublicApiSurface,
  nexoraObjectDirectorSceneBindingCertificationRegistry,
  nexoraObjectDirectorSceneBindingCertificationRegistryCount,
  nexoraObjectDirectorSceneBindingCertificationStatus,
  nexoraObjectDirectorSceneBindingCertificationVersion,
  sceneBindingCertificationLevels,
  sceneBindingCertificationOutcomes,
  verifyNexoraObjectDirectorSceneBindingCertificationRegistry,
} from "./nexoraObjectDirectorSceneBindingCertification.ts";

export const nexoraObjectDirectorSceneBindingFreezeId = "NOL-6:5/NexoraObjectDirectorSceneBindingFreeze" as const;
export const nexoraObjectDirectorSceneBindingFreezeVersion = "6.5.0" as const;
export const nexoraObjectDirectorSceneBindingFreezeNamespace = "nexora.nol.scene.binding.freeze" as const;

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

export type SceneBindingFreezeStatus = Readonly<{ released: true; certified: true; frozen: true; stable: true; readiness: "ready-for-platform" }>;
export const sceneBindingFreezeStatus: SceneBindingFreezeStatus = freezeOwned({ released: true, certified: true, frozen: true, stable: true, readiness: "ready-for-platform" });

export type SceneBindingFreezeLock = Readonly<{ lockId: "NOL-6-DIRECTOR-SCENE-BINDING-LOCKED"; active: true; reversible: false; scope: "director-scene-binding"; version: "6.5.0" }>;
export const nexoraObjectDirectorSceneBindingFreezeLock: SceneBindingFreezeLock = freezeOwned({ lockId: "NOL-6-DIRECTOR-SCENE-BINDING-LOCKED", active: true, reversible: false, scope: "director-scene-binding", version: "6.5.0" });

export type SceneBindingFrozenUpstream = Readonly<{ identity: string; version: string; namespace: string; dependencyRole: "sole-certified-upstream"; requiredOutcome: "certified"; requiresFreezeEligibility: true }>;
export const sceneBindingFrozenUpstream: SceneBindingFrozenUpstream = freezeOwned({ identity: nexoraObjectDirectorSceneBindingCertificationId, version: nexoraObjectDirectorSceneBindingCertificationVersion, namespace: nexoraObjectDirectorSceneBindingCertificationNamespace, dependencyRole: "sole-certified-upstream", requiredOutcome: "certified", requiresFreezeEligibility: true });

export type SceneBindingFreezeInvariantCategory = "identity" | "dependency" | "certification" | "immutability" | "api" | "registry" | "compatibility" | "consumer" | "release";
export const sceneBindingFreezeInvariantCategories = freezeOwned(["identity", "dependency", "certification", "immutability", "api", "registry", "compatibility", "consumer", "release"] as const satisfies readonly SceneBindingFreezeInvariantCategory[]);
export const sceneBindingFreezeInvariantCategoryCount = sceneBindingFreezeInvariantCategories.length;

const invariantDefinitions = [
  ["freeze-identity-fixed", "identity", "Freeze identity fixed"], ["freeze-version-fixed", "identity", "Freeze version fixed"], ["freeze-namespace-fixed", "identity", "Freeze namespace fixed"], ["release-status-fixed", "identity", "Release status fixed"], ["lock-identity-fixed", "identity", "Lock identity fixed"],
  ["certification-is-sole-production-dependency", "dependency", "Certification is sole production dependency"], ["no-foundation-direct-import", "dependency", "No Foundation direct import"], ["no-contracts-direct-import", "dependency", "No Contracts direct import"], ["no-validation-direct-import", "dependency", "No Validation direct import"], ["no-runtime-dependency", "dependency", "No runtime dependency"], ["no-renderer-dependency", "dependency", "No renderer dependency"], ["no-ui-dependency", "dependency", "No UI dependency"], ["no-react-dependency", "dependency", "No React dependency"], ["no-threejs-dependency", "dependency", "No Three.js dependency"], ["no-platform-dependency", "dependency", "No platform dependency"], ["no-adapter-dependency", "dependency", "No adapter dependency"], ["no-public-index-dependency", "dependency", "No Public Index dependency"],
  ["upstream-certification-identity-fixed", "certification", "Upstream certification identity fixed"], ["certified-outcome-required", "certification", "Certified outcome required"], ["freeze-eligible-result-required", "certification", "Freeze-eligible result required"], ["no-partial-certification-accepted", "certification", "No partial certification accepted"], ["no-rejected-certification-accepted", "certification", "No rejected certification accepted"], ["warning-policy-preserved", "certification", "Warning policy preserved"], ["certification-result-contract-fixed", "certification", "Certification result contract fixed"],
  ["all-freeze-exports-deeply-frozen", "immutability", "All Freeze exports deeply frozen"], ["no-caller-input-mutation", "immutability", "No caller input mutation"], ["no-caller-input-freezing", "immutability", "No caller input freezing"], ["no-mutable-registry", "immutability", "No mutable registry"], ["no-mutable-api-surface", "immutability", "No mutable API surface"], ["no-unlock-mechanism", "immutability", "No unlock mechanism"], ["no-runtime-state", "immutability", "No runtime state"],
  ["freeze-public-api-identities-fixed", "api", "Freeze Public API identities fixed"], ["freeze-api-count-dynamic", "api", "Freeze API count dynamic"], ["no-hidden-executable-api", "api", "No hidden executable API"], ["no-callback-api", "api", "No callback API"], ["no-async-api", "api", "No asynchronous API"], ["no-runtime-api", "api", "No runtime API"], ["no-renderer-api", "api", "No renderer API"],
  ["freeze-registry-ordered", "registry", "Freeze registry ordered"], ["freeze-registry-deeply-frozen", "registry", "Freeze registry deeply frozen"], ["freeze-registry-duplicate-free", "registry", "Freeze registry duplicate free"], ["freeze-registry-count-dynamic", "registry", "Freeze registry count dynamic"], ["freeze-registry-verifiable", "registry", "Freeze registry verifiable"], ["upstream-registry-compatible", "registry", "Upstream registry compatible"],
  ["nol-6-lineage-preserved", "compatibility", "NOL-6 lineage preserved"], ["public-certification-contract-preserved", "compatibility", "Public certification contract preserved"], ["semantic-version-fixed", "compatibility", "Semantic version fixed"], ["breaking-change-requires-new-phase", "compatibility", "Breaking change requires new phase"], ["downstream-cannot-redefine-freeze", "compatibility", "Downstream cannot redefine Freeze"], ["downstream-cannot-bypass-certification", "compatibility", "Downstream cannot bypass certification"],
  ["consumers-must-not-import-freeze-internals", "consumer", "Consumers must not import Freeze internals"], ["consumers-must-use-later-public-index", "consumer", "Consumers must use later Public Index"], ["platform-may-import-freeze", "consumer", "Platform may import Freeze"], ["adapter-may-consume-platform-only-when-defined", "consumer", "Adapter may consume Platform only when defined"], ["no-consumer-mutation", "consumer", "No consumer mutation"], ["no-consumer-override", "consumer", "No consumer override"],
  ["released-state-required", "release", "Released state required"], ["certified-state-required", "release", "Certified state required"], ["frozen-state-required", "release", "Frozen state required"], ["stable-state-required", "release", "Stable state required"], ["ready-for-platform-required", "release", "Ready for Platform required"], ["all-mandatory-invariants-pass", "release", "All mandatory invariants pass"],
] as const;

export type SceneBindingFreezeInvariantId = typeof invariantDefinitions[number][0];
export type SceneBindingFreezeInvariant = Readonly<{ id: SceneBindingFreezeInvariantId; title: string; description: string; category: SceneBindingFreezeInvariantCategory; mandatory: true; locked: true }>;
export const sceneBindingFreezeInvariants: readonly SceneBindingFreezeInvariant[] = freezeOwned(invariantDefinitions.map(([id, category, title]) => freezeOwned({ id, title, description: `${title} for the NOL-6 Director Scene Binding release boundary.`, category, mandatory: true, locked: true })));
export const sceneBindingFreezeInvariantCount = sceneBindingFreezeInvariants.length;

export type SceneBindingFrozenApiEntry = Readonly<{ exportName: string; kind: "constant" | "type" | "function" | "registry"; sourcePhase: "NOL-6:4"; locked: true; consumerVisible: boolean }>;
const frozenApiDefinitions = [
  ["nexoraObjectDirectorSceneBindingCertificationId", "constant"], ["nexoraObjectDirectorSceneBindingCertificationVersion", "constant"], ["nexoraObjectDirectorSceneBindingCertificationNamespace", "constant"], ["nexoraObjectDirectorSceneBindingCertificationStatus", "constant"], ["nexoraObjectDirectorSceneBindingCertificationDependency", "constant"],
  ["SceneBindingCertificationLevel", "type"], ["sceneBindingCertificationLevels", "constant"], ["sceneBindingCertificationLevelCount", "constant"], ["SceneBindingCertificationOutcome", "type"], ["sceneBindingCertificationOutcomes", "constant"], ["sceneBindingCertificationOutcomeCount", "constant"], ["SceneBindingCertificationSeverity", "type"], ["sceneBindingCertificationSeverities", "constant"], ["sceneBindingCertificationSeverityCount", "constant"], ["SceneBindingCertificationCode", "type"], ["sceneBindingCertificationCodes", "constant"], ["sceneBindingCertificationCodeCount", "constant"],
  ["SceneBindingCertificationRequirementId", "type"], ["SceneBindingCertificationRequirement", "type"], ["sceneBindingCertificationRequirements", "constant"], ["sceneBindingCertificationRequirementCount", "constant"], ["SceneBindingCertificationEvidence", "type"], ["SceneBindingCertificationInput", "type"], ["SceneBindingCertificationOptions", "type"], ["defaultSceneBindingCertificationOptions", "constant"], ["SceneBindingCertificationFinding", "type"], ["SceneBindingCertificationRequirementResult", "type"], ["SceneBindingCertificationLevelResult", "type"], ["SceneBindingCertificationResult", "type"],
  ["certifyNexoraObjectDirectorSceneBinding", "function"], ["evaluateNexoraObjectDirectorSceneBindingRequirement", "function"], ["resolveNexoraObjectDirectorSceneBindingCertificationOutcome", "function"], ["isNexoraObjectDirectorSceneBindingCertificationResult", "function"], ["getNexoraObjectDirectorSceneBindingCertificationSummary", "function"],
  ["nexoraObjectDirectorSceneBindingCertificationCapabilities", "constant"], ["nexoraObjectDirectorSceneBindingCertificationCapabilityCount", "constant"], ["nexoraObjectDirectorSceneBindingCertificationPublicApiSurface", "constant"], ["nexoraObjectDirectorSceneBindingCertificationPublicApiCount", "constant"], ["nexoraObjectDirectorSceneBindingCertificationRegistry", "registry"], ["nexoraObjectDirectorSceneBindingCertificationRegistryCount", "constant"], ["getNexoraObjectDirectorSceneBindingCertificationRegistry", "function"], ["getNexoraObjectDirectorSceneBindingCertificationRegistryCount", "function"], ["verifyNexoraObjectDirectorSceneBindingCertificationRegistry", "function"], ["isNexoraObjectDirectorSceneBindingCertificationRegistryFrozen", "function"],
] as const satisfies readonly (readonly [string, SceneBindingFrozenApiEntry["kind"]])[];
export const sceneBindingFrozenPublicApiSurface: readonly SceneBindingFrozenApiEntry[] = freezeOwned(frozenApiDefinitions.map(([exportName, kind]) => freezeOwned({ exportName, kind, sourcePhase: "NOL-6:4", locked: true, consumerVisible: true })));
export const sceneBindingFrozenPublicApiCount = sceneBindingFrozenPublicApiSurface.length;

export type SceneBindingFreezeCompatibilityPolicy = Readonly<{ semanticVersion: "6.5.0"; backwardCompatibilityRequired: true; additiveChangesAllowed: false; breakingChangesAllowed: false; mutationAllowed: false; directOverrideAllowed: false; extensionRequiresNewPhase: true; certificationBypassAllowed: false }>;
export const sceneBindingFreezeCompatibilityPolicy: SceneBindingFreezeCompatibilityPolicy = freezeOwned({ semanticVersion: "6.5.0", backwardCompatibilityRequired: true, additiveChangesAllowed: false, breakingChangesAllowed: false, mutationAllowed: false, directOverrideAllowed: false, extensionRequiresNewPhase: true, certificationBypassAllowed: false });

export type SceneBindingFreezeConsumerPolicy = Readonly<{ immediateAllowedConsumers: readonly ["NOL-6:6"]; eventualConsumerEntry: "NOL-6:9"; directFeatureConsumptionAllowed: false; internalImportAllowed: false; mutationAllowed: false; overrideAllowed: false }>;
export const sceneBindingFreezeConsumerPolicy: SceneBindingFreezeConsumerPolicy = freezeOwned({ immediateAllowedConsumers: freezeOwned(["NOL-6:6"] as const), eventualConsumerEntry: "NOL-6:9", directFeatureConsumptionAllowed: false, internalImportAllowed: false, mutationAllowed: false, overrideAllowed: false });

export const nexoraObjectDirectorSceneBindingFreezeCapabilities = freezeOwned(["release-identity-lock", "certification-boundary-lock", "dependency-boundary-lock", "public-api-surface-lock", "registry-lock", "compatibility-lock", "consumer-policy-lock", "immutability-lock", "semantic-version-lock", "lineage-lock", "freeze-verification", "platform-readiness-verification", "dynamic-api-count", "dynamic-registry-count", "deep-immutability", "structural-integrity", "downstream-drift-protection", "certification-bypass-protection", "runtime-isolation", "renderer-isolation", "ui-isolation"] as const);
export const nexoraObjectDirectorSceneBindingFreezeCapabilityCount = nexoraObjectDirectorSceneBindingFreezeCapabilities.length;

export const nexoraObjectDirectorSceneBindingFreezePublicApiSurface = freezeOwned(["verifyNexoraObjectDirectorSceneBindingFreeze", "isNexoraObjectDirectorSceneBindingFrozen", "isNexoraObjectDirectorSceneBindingReadyForPlatform", "getNexoraObjectDirectorSceneBindingFrozenApiSurface", "getNexoraObjectDirectorSceneBindingFrozenApiCount", "getNexoraObjectDirectorSceneBindingFreezeSummary", "getNexoraObjectDirectorSceneBindingFreezeRegistry", "getNexoraObjectDirectorSceneBindingFreezeRegistryCount", "verifyNexoraObjectDirectorSceneBindingFreezeRegistry", "isNexoraObjectDirectorSceneBindingFreezeRegistryFrozen"] as const);
export const nexoraObjectDirectorSceneBindingFreezePublicApiCount = nexoraObjectDirectorSceneBindingFreezePublicApiSurface.length;

export type SceneBindingFreezeRegistryEntry = Readonly<{ name: string; order: number }>;
export const nexoraObjectDirectorSceneBindingFreezeRegistry: readonly SceneBindingFreezeRegistryEntry[] = freezeOwned(["Identity", "Release Status", "Freeze Lock", "Certified Upstream", "Invariant Categories", "Freeze Invariants", "Frozen Public API Surface", "Compatibility Policy", "Consumer Policy", "Verification Contracts", "Public APIs", "Dependency Boundary", "Freeze Capabilities", "Readiness", "Release Information"].map((name, index) => freezeOwned({ name, order: index + 1 })));
export const nexoraObjectDirectorSceneBindingFreezeRegistryCount = nexoraObjectDirectorSceneBindingFreezeRegistry.length;

export function getNexoraObjectDirectorSceneBindingFreezeRegistry(): typeof nexoraObjectDirectorSceneBindingFreezeRegistry { return nexoraObjectDirectorSceneBindingFreezeRegistry; }
export function getNexoraObjectDirectorSceneBindingFreezeRegistryCount(): number { return nexoraObjectDirectorSceneBindingFreezeRegistry.length; }
export function isNexoraObjectDirectorSceneBindingFreezeRegistryFrozen(): boolean { return deeplyFrozen(nexoraObjectDirectorSceneBindingFreezeRegistry) && deeplyFrozen(nexoraObjectDirectorSceneBindingFreezeCapabilities) && deeplyFrozen(nexoraObjectDirectorSceneBindingFreezePublicApiSurface); }
export function verifyNexoraObjectDirectorSceneBindingFreezeRegistry(): Readonly<{ valid: boolean; ordered: boolean; unique: boolean; countValid: boolean; capabilitiesValid: boolean; publicApisValid: boolean; frozen: boolean; violations: readonly string[] }> {
  const ordered = nexoraObjectDirectorSceneBindingFreezeRegistry.every((entry, index) => entry.order === index + 1);
  const uniqueEntries = unique(nexoraObjectDirectorSceneBindingFreezeRegistry.map((entry) => entry.name));
  const countValid = nexoraObjectDirectorSceneBindingFreezeRegistryCount === nexoraObjectDirectorSceneBindingFreezeRegistry.length;
  const capabilitiesValid = nexoraObjectDirectorSceneBindingFreezeCapabilityCount === nexoraObjectDirectorSceneBindingFreezeCapabilities.length && unique([...nexoraObjectDirectorSceneBindingFreezeCapabilities]);
  const publicApisValid = nexoraObjectDirectorSceneBindingFreezePublicApiCount === nexoraObjectDirectorSceneBindingFreezePublicApiSurface.length && unique([...nexoraObjectDirectorSceneBindingFreezePublicApiSurface]);
  const frozen = isNexoraObjectDirectorSceneBindingFreezeRegistryFrozen();
  const checks: readonly [boolean, string][] = [[ordered, "Freeze registry order is invalid"], [uniqueEntries, "Freeze registry entries are duplicated"], [countValid, "Freeze registry count is invalid"], [capabilitiesValid, "Freeze capabilities are invalid"], [publicApisValid, "Freeze Public APIs are invalid"], [frozen, "Freeze registry is mutable"]];
  const violations = checks.filter(([passed]) => !passed).map(([, message]) => message);
  return freezeOwned({ valid: violations.length === 0, ordered, unique: uniqueEntries, countValid, capabilitiesValid, publicApisValid, frozen, violations: freezeOwned(violations) });
}

const checkDefinitions = [["freeze-identity", "Freeze identity"], ["freeze-version", "Freeze version"], ["freeze-namespace", "Freeze namespace"], ["lock-identity", "Lock identity"], ["lock-active", "Lock active"], ["lock-irreversible", "Lock irreversible"], ["release-status", "Release status"], ["sole-upstream", "Sole certified upstream"], ["certified-outcome", "Certified outcome requirement"], ["freeze-eligibility", "Freeze eligibility requirement"], ["invariant-uniqueness", "Invariant uniqueness"], ["invariant-mandatory", "Invariant mandatory state"], ["invariant-lock", "Invariant lock state"], ["api-uniqueness", "Frozen API uniqueness"], ["api-lock", "Frozen API lock state"], ["registry-valid", "Freeze registry validity"], ["registry-frozen", "Freeze registry immutability"], ["compatibility-policy", "Compatibility policy"], ["consumer-policy", "Consumer policy"], ["platform-readiness", "Platform readiness"]] as const;
export type SceneBindingFreezeCheckId = typeof checkDefinitions[number][0];
export type SceneBindingFreezeCheckResult = Readonly<{ checkId: SceneBindingFreezeCheckId; passed: boolean; message: string }>;
export type SceneBindingFreezeVerificationResult = Readonly<{ valid: boolean; lockActive: boolean; readyForPlatform: boolean; checkResults: readonly SceneBindingFreezeCheckResult[]; passedCheckCount: number; failedCheckCount: number }>;

function upstreamValid(): boolean {
  const registry = verifyNexoraObjectDirectorSceneBindingCertificationRegistry();
  const requiredApis = ["certifyNexoraObjectDirectorSceneBinding", "evaluateNexoraObjectDirectorSceneBindingRequirement", "resolveNexoraObjectDirectorSceneBindingCertificationOutcome", "isNexoraObjectDirectorSceneBindingCertificationResult", "getNexoraObjectDirectorSceneBindingCertificationSummary", "getNexoraObjectDirectorSceneBindingCertificationRegistry", "getNexoraObjectDirectorSceneBindingCertificationRegistryCount", "verifyNexoraObjectDirectorSceneBindingCertificationRegistry", "isNexoraObjectDirectorSceneBindingCertificationRegistryFrozen"];
  const publicApis: readonly string[] = nexoraObjectDirectorSceneBindingCertificationPublicApiSurface;
  return nexoraObjectDirectorSceneBindingCertificationId === "NOL-6:4/NexoraObjectDirectorSceneBindingCertification" && nexoraObjectDirectorSceneBindingCertificationVersion === "6.4.0" && nexoraObjectDirectorSceneBindingCertificationNamespace === "nexora.nol.scene.binding.certification" && nexoraObjectDirectorSceneBindingCertificationStatus === "ReadyForFreeze" && sceneBindingCertificationLevels.length === 4 && sceneBindingCertificationOutcomes.length === 3 && sceneBindingCertificationOutcomes.includes("certified") && nexoraObjectDirectorSceneBindingCertificationRegistry.length > 0 && nexoraObjectDirectorSceneBindingCertificationRegistryCount === nexoraObjectDirectorSceneBindingCertificationRegistry.length && registry.valid && isNexoraObjectDirectorSceneBindingCertificationRegistryFrozen() && requiredApis.every((name) => publicApis.includes(name)) && nexoraObjectDirectorSceneBindingCertificationPublicApiCount === nexoraObjectDirectorSceneBindingCertificationPublicApiSurface.length && nexoraObjectDirectorSceneBindingCertificationCapabilityCount === nexoraObjectDirectorSceneBindingCertificationCapabilities.length;
}

function verificationStates(): readonly boolean[] {
  const invariantIds = sceneBindingFreezeInvariants.map((entry) => entry.id), apiNames = sceneBindingFrozenPublicApiSurface.map((entry) => entry.exportName), registry = verifyNexoraObjectDirectorSceneBindingFreezeRegistry();
  const statusValid = sceneBindingFreezeStatus.released && sceneBindingFreezeStatus.certified && sceneBindingFreezeStatus.frozen && sceneBindingFreezeStatus.stable && sceneBindingFreezeStatus.readiness === "ready-for-platform";
  const compatibilityValid = sceneBindingFreezeCompatibilityPolicy.semanticVersion === nexoraObjectDirectorSceneBindingFreezeVersion && sceneBindingFreezeCompatibilityPolicy.backwardCompatibilityRequired && !sceneBindingFreezeCompatibilityPolicy.additiveChangesAllowed && !sceneBindingFreezeCompatibilityPolicy.breakingChangesAllowed && !sceneBindingFreezeCompatibilityPolicy.mutationAllowed && !sceneBindingFreezeCompatibilityPolicy.directOverrideAllowed && sceneBindingFreezeCompatibilityPolicy.extensionRequiresNewPhase && !sceneBindingFreezeCompatibilityPolicy.certificationBypassAllowed;
  const consumerValid = sceneBindingFreezeConsumerPolicy.immediateAllowedConsumers.length === 1 && sceneBindingFreezeConsumerPolicy.immediateAllowedConsumers[0] === "NOL-6:6" && sceneBindingFreezeConsumerPolicy.eventualConsumerEntry === "NOL-6:9" && !sceneBindingFreezeConsumerPolicy.directFeatureConsumptionAllowed && !sceneBindingFreezeConsumerPolicy.internalImportAllowed && !sceneBindingFreezeConsumerPolicy.mutationAllowed && !sceneBindingFreezeConsumerPolicy.overrideAllowed;
  return [nexoraObjectDirectorSceneBindingFreezeId === "NOL-6:5/NexoraObjectDirectorSceneBindingFreeze", nexoraObjectDirectorSceneBindingFreezeVersion === "6.5.0", nexoraObjectDirectorSceneBindingFreezeNamespace === "nexora.nol.scene.binding.freeze", nexoraObjectDirectorSceneBindingFreezeLock.lockId === "NOL-6-DIRECTOR-SCENE-BINDING-LOCKED", nexoraObjectDirectorSceneBindingFreezeLock.active, !nexoraObjectDirectorSceneBindingFreezeLock.reversible, statusValid, upstreamValid(), sceneBindingFrozenUpstream.requiredOutcome === "certified", sceneBindingFrozenUpstream.requiresFreezeEligibility, unique(invariantIds), sceneBindingFreezeInvariants.every((entry) => entry.mandatory), sceneBindingFreezeInvariants.every((entry) => entry.locked), unique(apiNames), sceneBindingFrozenPublicApiSurface.every((entry) => entry.locked && entry.sourcePhase === "NOL-6:4"), registry.valid, registry.frozen, compatibilityValid, consumerValid, statusValid && consumerValid && upstreamValid()];
}

export function verifyNexoraObjectDirectorSceneBindingFreeze(): SceneBindingFreezeVerificationResult {
  const states = verificationStates();
  const checkResults = freezeOwned(checkDefinitions.map(([checkId, title], index) => freezeOwned({ checkId, passed: states[index] === true, message: states[index] === true ? `${title} verified.` : `${title} failed.` })));
  const passedCheckCount = checkResults.filter((entry) => entry.passed).length;
  const failedCheckCount = checkResults.length - passedCheckCount;
  return freezeOwned({ valid: failedCheckCount === 0, lockActive: nexoraObjectDirectorSceneBindingFreezeLock.active, readyForPlatform: failedCheckCount === 0 && sceneBindingFreezeStatus.readiness === "ready-for-platform", checkResults, passedCheckCount, failedCheckCount });
}

export function isNexoraObjectDirectorSceneBindingFrozen(): boolean { const verification = verifyNexoraObjectDirectorSceneBindingFreeze(); return nexoraObjectDirectorSceneBindingFreezeLock.active && sceneBindingFreezeStatus.released && sceneBindingFreezeStatus.certified && sceneBindingFreezeStatus.frozen && sceneBindingFreezeStatus.stable && verification.valid && sceneBindingFreezeInvariants.every((entry) => entry.mandatory && entry.locked) && isNexoraObjectDirectorSceneBindingFreezeRegistryFrozen(); }
export function isNexoraObjectDirectorSceneBindingReadyForPlatform(): boolean { const verification = verifyNexoraObjectDirectorSceneBindingFreeze(); return verification.valid && verification.readyForPlatform && isNexoraObjectDirectorSceneBindingFrozen() && sceneBindingFreezeStatus.readiness === "ready-for-platform" && sceneBindingFreezeConsumerPolicy.immediateAllowedConsumers.includes("NOL-6:6"); }
export function getNexoraObjectDirectorSceneBindingFrozenApiSurface(): typeof sceneBindingFrozenPublicApiSurface { return sceneBindingFrozenPublicApiSurface; }
export function getNexoraObjectDirectorSceneBindingFrozenApiCount(): number { return sceneBindingFrozenPublicApiSurface.length; }
export function getNexoraObjectDirectorSceneBindingFreezeSummary(): Readonly<{ identity: string; version: string; namespace: string; lockId: string; released: boolean; certified: boolean; frozen: boolean; stable: boolean; readiness: "ready-for-platform"; invariantCount: number; frozenApiCount: number; registryEntryCount: number; soleDependency: string; nextPhase: "NOL-6:6" }> { return freezeOwned({ identity: nexoraObjectDirectorSceneBindingFreezeId, version: nexoraObjectDirectorSceneBindingFreezeVersion, namespace: nexoraObjectDirectorSceneBindingFreezeNamespace, lockId: nexoraObjectDirectorSceneBindingFreezeLock.lockId, released: sceneBindingFreezeStatus.released, certified: sceneBindingFreezeStatus.certified, frozen: sceneBindingFreezeStatus.frozen, stable: sceneBindingFreezeStatus.stable, readiness: sceneBindingFreezeStatus.readiness, invariantCount: sceneBindingFreezeInvariants.length, frozenApiCount: sceneBindingFrozenPublicApiSurface.length, registryEntryCount: nexoraObjectDirectorSceneBindingFreezeRegistry.length, soleDependency: sceneBindingFrozenUpstream.identity, nextPhase: "NOL-6:6" }); }
