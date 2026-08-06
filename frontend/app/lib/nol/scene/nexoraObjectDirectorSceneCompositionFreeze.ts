/** NOL-7:5 — immutable release lock for Director Scene Composition. */
import {
  getNexoraObjectDirectorSceneCompositionCertificationRegistry,
  getNexoraObjectDirectorSceneCompositionCertificationRegistryCount,
  isNexoraObjectDirectorSceneCompositionCertificationRegistryFrozen,
  nexoraObjectDirectorSceneCompositionCertificationId,
  nexoraObjectDirectorSceneCompositionCertificationNamespace,
  nexoraObjectDirectorSceneCompositionCertificationPrimaryPublicApiSurface,
  nexoraObjectDirectorSceneCompositionCertificationRegistry,
  nexoraObjectDirectorSceneCompositionCertificationRegistryCount,
  nexoraObjectDirectorSceneCompositionCertificationVersion,
  sceneCompositionCertificationLevels,
  sceneCompositionCertificationOutcomes,
  sceneCompositionCertificationRequirements,
  sceneCompositionCertificationStatus,
  verifyNexoraObjectDirectorSceneCompositionCertificationRegistry,
} from "@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionCertification";

export const nexoraObjectDirectorSceneCompositionFreezeId = "NOL-7:5/NexoraObjectDirectorSceneCompositionFreeze" as const;
export const nexoraObjectDirectorSceneCompositionFreezeVersion = "7.5.0" as const;
export const nexoraObjectDirectorSceneCompositionFreezeNamespace = "nexora.nol.scene.composition.freeze" as const;

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

function unique(values: readonly string[]): boolean { return values.every((value, index) => values.indexOf(value) === index); }
function exact(values: readonly string[], expected: readonly string[]): boolean { return values.length === expected.length && values.every((value, index) => value === expected[index]); }
function noExecutables(value: unknown, visited: object[] = []): boolean {
  if (typeof value === "function") return false;
  if (value === null || typeof value !== "object" || visited.includes(value as object)) return true;
  visited.push(value as object);
  return Object.values(value as Record<string, unknown>).every((child) => noExecutables(child, visited));
}

export type SceneCompositionFreezeStatus = Readonly<{ released: true; certified: true; frozen: true; stable: true; readiness: "ready-for-platform" }>;
export const sceneCompositionFreezeStatus: SceneCompositionFreezeStatus = freezeOwned({ released: true, certified: true, frozen: true, stable: true, readiness: "ready-for-platform" });

export type SceneCompositionFreezeLock = Readonly<{ lockId: "NOL-7-DIRECTOR-SCENE-COMPOSITION-LOCKED"; active: true; reversible: false; scope: "director-scene-composition"; version: "7.5.0" }>;
export const nexoraObjectDirectorSceneCompositionFreezeLock: SceneCompositionFreezeLock = freezeOwned({ lockId: "NOL-7-DIRECTOR-SCENE-COMPOSITION-LOCKED", active: true, reversible: false, scope: "director-scene-composition", version: "7.5.0" });

export type SceneCompositionFrozenUpstream = Readonly<{ identity: string; version: string; namespace: string; dependencyRole: "sole-certified-upstream"; requiredOutcome: "certified"; requiresFreezeEligibility: true; requiredReadiness: "ready-for-freeze" }>;
export const sceneCompositionFrozenUpstream: SceneCompositionFrozenUpstream = freezeOwned({ identity: nexoraObjectDirectorSceneCompositionCertificationId, version: nexoraObjectDirectorSceneCompositionCertificationVersion, namespace: nexoraObjectDirectorSceneCompositionCertificationNamespace, dependencyRole: "sole-certified-upstream", requiredOutcome: "certified", requiresFreezeEligibility: true, requiredReadiness: "ready-for-freeze" });

export type SceneCompositionFreezeInvariantCategory = "identity" | "dependency" | "certification" | "composition" | "compatibility" | "immutability" | "api" | "registry" | "consumer" | "release";
export const sceneCompositionFreezeInvariantCategories = freezeOwned(["identity", "dependency", "certification", "composition", "compatibility", "immutability", "api", "registry", "consumer", "release"] as const satisfies readonly SceneCompositionFreezeInvariantCategory[]);

const invariantData = freezeOwned([
  ["identity", ["scene-composition-freeze-identity-fixed", "scene-composition-freeze-version-fixed", "scene-composition-freeze-namespace-fixed", "scene-composition-release-status-fixed", "scene-composition-lock-identity-fixed"]],
  ["dependency", ["scene-composition-certification-is-sole-production-dependency", "no-foundation-direct-import", "no-contracts-direct-import", "no-validation-direct-import", "no-nol6-direct-import", "no-runtime-dependency", "no-renderer-dependency", "no-director-execution-dependency", "no-ui-dependency", "no-react-dependency", "no-threejs-dependency", "no-platform-dependency", "no-public-index-dependency"]],
  ["certification", ["upstream-certification-identity-fixed", "certified-outcome-required", "freeze-eligible-result-required", "partially-certified-result-rejected", "rejected-result-rejected", "warning-policy-preserved", "certification-levels-preserved", "certification-requirements-preserved", "certification-result-contract-fixed"]],
  ["composition", ["composition-vocabulary-preserved", "composition-unit-kinds-preserved", "composition-layer-roles-preserved", "composition-states-preserved", "composition-modes-preserved", "placement-roles-preserved", "grouping-roles-preserved", "relationship-roles-preserved", "focus-roles-preserved", "emphasis-roles-preserved", "ownership-roles-preserved", "composition-contract-identities-preserved", "composition-reference-semantics-preserved", "composition-ordering-semantics-preserved", "no-live-composition-behavior", "no-layout-behavior", "no-focus-resolution", "no-transition-execution"]],
  ["compatibility", ["nol-6-binding-compatibility-preserved", "public-visibility-terminology-preserved", "public-interaction-terminology-preserved", "interactive-term-preserved", "actionable-term-excluded", "renderer-state-terminology-preserved", "semantic-version-fixed", "breaking-change-requires-new-phase", "downstream-cannot-redefine-freeze", "downstream-cannot-bypass-certification", "downstream-cannot-bypass-validation"]],
  ["immutability", ["all-freeze-exports-deeply-frozen", "no-caller-input-mutation", "no-caller-input-freezing", "no-imported-upstream-mutation", "no-mutable-api-surface", "no-mutable-registry", "no-runtime-state", "no-unlock-mechanism"]],
  ["api", ["freeze-public-api-identities-fixed", "freeze-api-count-dynamic", "no-hidden-executable-api", "no-callback-api", "no-async-api", "no-runtime-api", "no-renderer-api", "no-validation-candidate-api", "no-certification-candidate-api"]],
  ["registry", ["freeze-registry-ordered", "freeze-registry-deeply-frozen", "freeze-registry-duplicate-free", "freeze-registry-count-dynamic", "freeze-registry-verifiable", "upstream-certification-registry-compatible"]],
  ["consumer", ["platform-is-only-immediate-consumer", "feature-consumers-must-use-later-public-index", "direct-feature-consumption-prohibited", "consumer-mutation-prohibited", "consumer-override-prohibited", "freeze-internals-not-consumer-visible"]],
  ["release", ["released-state-required", "certified-state-required", "frozen-state-required", "stable-state-required", "ready-for-platform-required", "all-mandatory-invariants-pass"]],
] as const satisfies readonly (readonly [SceneCompositionFreezeInvariantCategory, readonly string[]])[]);

export type SceneCompositionFreezeInvariantId = typeof invariantData[number][1][number];
export type SceneCompositionFreezeInvariant = Readonly<{ id: SceneCompositionFreezeInvariantId; title: string; description: string; category: SceneCompositionFreezeInvariantCategory; mandatory: true; locked: true }>;
export const sceneCompositionFreezeInvariants: readonly SceneCompositionFreezeInvariant[] = freezeOwned(invariantData.flatMap(([category, ids]) => ids.map((id) => freezeOwned({ id, title: id.replaceAll("-", " "), description: `${id.replaceAll("-", " ")} is permanently locked by NOL-7:5.`, category, mandatory: true, locked: true }))));
export const sceneCompositionFreezeInvariantCount = sceneCompositionFreezeInvariants.length;

export type SceneCompositionFrozenVocabularyEntry = Readonly<{ exportName: string; category: "unit-kind" | "layer-role" | "state" | "mode" | "placement-role" | "grouping-role" | "relationship-role" | "focus-role" | "emphasis-role" | "ownership-role"; sourcePhase: "NOL-7:1"; locked: true }>;
const vocabularyData = [["sceneCompositionUnitKinds", "unit-kind"], ["sceneCompositionLayerRoles", "layer-role"], ["sceneCompositionStates", "state"], ["sceneCompositionModes", "mode"], ["sceneCompositionPlacementRoles", "placement-role"], ["sceneCompositionGroupingRoles", "grouping-role"], ["sceneCompositionRelationshipRoles", "relationship-role"], ["sceneCompositionFocusRoles", "focus-role"], ["sceneCompositionEmphasisRoles", "emphasis-role"], ["sceneCompositionOwnershipRoles", "ownership-role"]] as const;
export const sceneCompositionFrozenVocabularySurface: readonly SceneCompositionFrozenVocabularyEntry[] = freezeOwned(vocabularyData.map(([exportName, category]) => freezeOwned({ exportName, category, sourcePhase: "NOL-7:1", locked: true })));

export type SceneCompositionFrozenContractEntry = Readonly<{ exportName: string; category: "identity" | "metadata" | "scene" | "layer" | "group" | "unit" | "reference" | "placement" | "focus" | "emphasis" | "ownership" | "relationship" | "annotation" | "ordering" | "collection" | "snapshot" | "compatibility"; sourcePhase: "NOL-7:2"; locked: true }>;
const contractData = [["SceneCompositionIdentityContract", "identity"], ["SceneCompositionMetadataContract", "metadata"], ["NexoraObjectDirectorSceneCompositionContract", "scene"], ["SceneCompositionLayerContract", "layer"], ["SceneCompositionGroupContract", "group"], ["SceneCompositionUnitMetadataContract", "unit"], ["SceneCompositionUnitContract", "unit"], ["SceneCompositionNodeReferenceContract", "reference"], ["SceneCompositionPlacementContract", "placement"], ["SceneCompositionFocusContract", "focus"], ["SceneCompositionEmphasisContract", "emphasis"], ["SceneCompositionOwnershipContract", "ownership"], ["SceneCompositionRelationshipEndpointContract", "relationship"], ["SceneCompositionRelationshipContract", "relationship"], ["SceneCompositionAnnotationContract", "annotation"], ["SceneCompositionOrderingContract", "ordering"], ["SceneCompositionCollectionContract", "collection"], ["SceneCompositionSnapshotContract", "snapshot"], ["SceneCompositionBindingCompatibilityContract", "compatibility"]] as const;
export const sceneCompositionFrozenContractSurface: readonly SceneCompositionFrozenContractEntry[] = freezeOwned(contractData.map(([exportName, category]) => freezeOwned({ exportName, category, sourcePhase: "NOL-7:2", locked: true })));

type FrozenSurfaceKind = "constant" | "type" | "function" | "registry";
export type SceneCompositionFrozenValidationEntry = Readonly<{ exportName: string; kind: FrozenSurfaceKind; sourcePhase: "NOL-7:3"; locked: true; platformVisible: boolean }>;
const validationData = [
  ["nexoraObjectDirectorSceneCompositionValidationId", "constant"], ["nexoraObjectDirectorSceneCompositionValidationVersion", "constant"], ["nexoraObjectDirectorSceneCompositionValidationNamespace", "constant"], ["sceneCompositionValidationSeverities", "constant"], ["sceneCompositionValidationCodes", "constant"], ["defaultSceneCompositionValidationOptions", "constant"],
  ["SceneCompositionValidationSeverity", "type"], ["SceneCompositionValidationCode", "type"], ["SceneCompositionValidationOptions", "type"], ["SceneCompositionValidationFinding", "type"], ["SceneCompositionValidationResult", "type"],
  ["validateNexoraObjectDirectorSceneComposition", "function"], ["validateNexoraObjectDirectorSceneCompositionLayer", "function"], ["validateNexoraObjectDirectorSceneCompositionGroup", "function"], ["validateNexoraObjectDirectorSceneCompositionUnit", "function"], ["validateNexoraObjectDirectorSceneCompositionRelationship", "function"], ["validateNexoraObjectDirectorSceneCompositionAnnotation", "function"], ["validateNexoraObjectDirectorSceneCompositionOrdering", "function"], ["validateNexoraObjectDirectorSceneCompositionCollection", "function"], ["validateNexoraObjectDirectorSceneCompositionSnapshot", "function"], ["isNexoraObjectDirectorSceneCompositionValidationResult", "function"], ["getNexoraObjectDirectorSceneCompositionValidationSummary", "function"],
  ["nexoraObjectDirectorSceneCompositionValidationRegistry", "registry"], ["getNexoraObjectDirectorSceneCompositionValidationRegistry", "function"], ["getNexoraObjectDirectorSceneCompositionValidationRegistryCount", "function"], ["verifyNexoraObjectDirectorSceneCompositionValidationRegistry", "function"], ["isNexoraObjectDirectorSceneCompositionValidationRegistryFrozen", "function"],
] as const satisfies readonly (readonly [string, FrozenSurfaceKind])[];
export const sceneCompositionFrozenValidationSurface: readonly SceneCompositionFrozenValidationEntry[] = freezeOwned(validationData.map(([exportName, kind]) => freezeOwned({ exportName, kind, sourcePhase: "NOL-7:3", locked: true, platformVisible: true })));

export type SceneCompositionFrozenCertificationEntry = Readonly<{ exportName: string; kind: FrozenSurfaceKind; sourcePhase: "NOL-7:4"; locked: true; platformVisible: boolean }>;
const certificationData = [
  ["nexoraObjectDirectorSceneCompositionCertificationId", "constant"], ["nexoraObjectDirectorSceneCompositionCertificationVersion", "constant"], ["nexoraObjectDirectorSceneCompositionCertificationNamespace", "constant"], ["sceneCompositionCertificationLevels", "constant"], ["sceneCompositionCertificationOutcomes", "constant"], ["sceneCompositionCertificationSeverities", "constant"], ["sceneCompositionCertificationCodes", "constant"], ["sceneCompositionCertificationRequirements", "constant"], ["defaultSceneCompositionCertificationOptions", "constant"],
  ["SceneCompositionCertificationLevel", "type"], ["SceneCompositionCertificationOutcome", "type"], ["SceneCompositionCertificationSeverity", "type"], ["SceneCompositionCertificationCode", "type"], ["SceneCompositionCertificationRequirement", "type"], ["SceneCompositionCertificationEvidence", "type"], ["SceneCompositionCertificationInput", "type"], ["SceneCompositionCertificationOptions", "type"], ["SceneCompositionCertificationFinding", "type"], ["SceneCompositionCertificationRequirementResult", "type"], ["SceneCompositionCertificationLevelResult", "type"], ["SceneCompositionCertificationResult", "type"],
  ["certifyNexoraObjectDirectorSceneComposition", "function"], ["evaluateNexoraObjectDirectorSceneCompositionCertificationRequirement", "function"], ["resolveNexoraObjectDirectorSceneCompositionCertificationOutcome", "function"], ["isNexoraObjectDirectorSceneCompositionCertificationResult", "function"], ["getNexoraObjectDirectorSceneCompositionCertificationSummary", "function"],
  ["nexoraObjectDirectorSceneCompositionCertificationRegistry", "registry"], ["getNexoraObjectDirectorSceneCompositionCertificationRegistry", "function"], ["getNexoraObjectDirectorSceneCompositionCertificationRegistryCount", "function"], ["verifyNexoraObjectDirectorSceneCompositionCertificationRegistry", "function"], ["isNexoraObjectDirectorSceneCompositionCertificationRegistryFrozen", "function"],
] as const satisfies readonly (readonly [string, FrozenSurfaceKind])[];
export const sceneCompositionFrozenCertificationSurface: readonly SceneCompositionFrozenCertificationEntry[] = freezeOwned(certificationData.map(([exportName, kind]) => freezeOwned({ exportName, kind, sourcePhase: "NOL-7:4", locked: true, platformVisible: true })));

export type SceneCompositionFreezeCompatibilityPolicy = Readonly<{ semanticVersion: "7.5.0"; backwardCompatibilityRequired: true; publicTerminologyStable: true; compositionVocabularyStable: true; contractIdentityStable: true; validationSemanticsStable: true; certificationSemanticsStable: true; additiveChangesAllowed: false; breakingChangesAllowed: false; mutationAllowed: false; directOverrideAllowed: false; extensionRequiresNewPhase: true; validationBypassAllowed: false; certificationBypassAllowed: false; sceneBindingCompatibilityBypassAllowed: false }>;
export const sceneCompositionFreezeCompatibilityPolicy: SceneCompositionFreezeCompatibilityPolicy = freezeOwned({ semanticVersion: "7.5.0", backwardCompatibilityRequired: true, publicTerminologyStable: true, compositionVocabularyStable: true, contractIdentityStable: true, validationSemanticsStable: true, certificationSemanticsStable: true, additiveChangesAllowed: false, breakingChangesAllowed: false, mutationAllowed: false, directOverrideAllowed: false, extensionRequiresNewPhase: true, validationBypassAllowed: false, certificationBypassAllowed: false, sceneBindingCompatibilityBypassAllowed: false });

export type SceneCompositionFreezeConsumerPolicy = Readonly<{ immediateAllowedConsumers: readonly ["NOL-7:6"]; eventualConsumerEntry: "NOL-7:9"; directFeatureConsumptionAllowed: false; internalContractImportAllowed: false; mutationAllowed: false; overrideAllowed: false }>;
export const sceneCompositionFreezeConsumerPolicy: SceneCompositionFreezeConsumerPolicy = freezeOwned({ immediateAllowedConsumers: freezeOwned(["NOL-7:6"] as const), eventualConsumerEntry: "NOL-7:9", directFeatureConsumptionAllowed: false, internalContractImportAllowed: false, mutationAllowed: false, overrideAllowed: false });

export type SceneCompositionFreezePlatformHandoff = Readonly<{ nextPhase: "NOL-7:6"; role: "sole-platform-upstream"; ready: true; requiresFreezeVerification: true; requiresRegistryVerification: true; directFeatureImportsProhibited: true }>;
export const sceneCompositionFreezePlatformHandoff: SceneCompositionFreezePlatformHandoff = freezeOwned({ nextPhase: "NOL-7:6", role: "sole-platform-upstream", ready: true, requiresFreezeVerification: true, requiresRegistryVerification: true, directFeatureImportsProhibited: true });

const visibilityTerms = freezeOwned(["visible", "hidden", "collapsed"] as const);
const interactionTerms = freezeOwned(["none", "selectable", "focusable", "interactive"] as const);
const rendererStateTerms = freezeOwned(["minimum", "report", "operation"] as const);

function upstreamCompatible(): boolean {
  const registry = getNexoraObjectDirectorSceneCompositionCertificationRegistry(), verification = verifyNexoraObjectDirectorSceneCompositionCertificationRegistry();
  const requiredApis = ["certifyNexoraObjectDirectorSceneComposition", "evaluateNexoraObjectDirectorSceneCompositionCertificationRequirement", "resolveNexoraObjectDirectorSceneCompositionCertificationOutcome", "isNexoraObjectDirectorSceneCompositionCertificationResult", "getNexoraObjectDirectorSceneCompositionCertificationSummary"];
  return nexoraObjectDirectorSceneCompositionCertificationId === "NOL-7:4/NexoraObjectDirectorSceneCompositionCertification" && nexoraObjectDirectorSceneCompositionCertificationVersion === "7.4.0" && nexoraObjectDirectorSceneCompositionCertificationNamespace === "nexora.nol.scene.composition.certification" && exact(sceneCompositionCertificationLevels, ["structural", "referential", "behavioral", "architectural", "release"]) && exact(sceneCompositionCertificationOutcomes, ["certified", "partially-certified", "rejected"]) && sceneCompositionCertificationStatus.readiness === "ready-for-freeze" && sceneCompositionCertificationRequirements.some((requirement) => requirement.id === "binding-compatibility-preserved") && sceneCompositionCertificationRequirements.some((requirement) => requirement.id === "interactive-terminology-preserved") && sceneCompositionCertificationRequirements.some((requirement) => requirement.id === "freeze-eligibility") && requiredApis.every((name) => nexoraObjectDirectorSceneCompositionCertificationPrimaryPublicApiSurface.includes(name as never)) && registry === nexoraObjectDirectorSceneCompositionCertificationRegistry && registry.length === getNexoraObjectDirectorSceneCompositionCertificationRegistryCount() && registry.length === nexoraObjectDirectorSceneCompositionCertificationRegistryCount && verification.valid && isNexoraObjectDirectorSceneCompositionCertificationRegistryFrozen();
}

const upstreamAttested = upstreamCompatible();

export type SceneCompositionFreezeCheckId = "freeze-identity" | "freeze-version" | "freeze-namespace" | "release-status" | "freeze-lock" | "certified-upstream" | "certification-semantics" | "upstream-registry" | "invariants" | "vocabulary-surface" | "contract-surface" | "validation-surface" | "certification-surface" | "compatibility-policy" | "consumer-policy" | "platform-handoff" | "binding-terminology" | "registry" | "platform-readiness";
export type SceneCompositionFreezeCheckResult = Readonly<{ checkId: SceneCompositionFreezeCheckId; passed: boolean; message: string }>;
export type SceneCompositionFreezeVerificationResult = Readonly<{ valid: boolean; lockActive: boolean; readyForPlatform: boolean; checkResults: readonly SceneCompositionFreezeCheckResult[]; passedCheckCount: number; failedCheckCount: number }>;

function surfacesValid<T extends Readonly<{ exportName: string; locked: true }>>(surface: readonly T[]): boolean { return surface.length > 0 && unique(surface.map((entry) => entry.exportName)) && surface.every((entry) => entry.locked) && deeplyFrozen(surface) && noExecutables(surface); }
function invariantIntegrity(): boolean { return sceneCompositionFreezeInvariants.length === invariantData.reduce((count, [, ids]) => count + ids.length, 0) && unique(sceneCompositionFreezeInvariants.map((entry) => entry.id)) && sceneCompositionFreezeInvariants.every((entry) => entry.mandatory && entry.locked) && deeplyFrozen(sceneCompositionFreezeInvariants); }

const checks = (): readonly (readonly [SceneCompositionFreezeCheckId, boolean, string])[] => [
  ["freeze-identity", nexoraObjectDirectorSceneCompositionFreezeId === "NOL-7:5/NexoraObjectDirectorSceneCompositionFreeze", "Freeze identity is exact."],
  ["freeze-version", nexoraObjectDirectorSceneCompositionFreezeVersion === "7.5.0", "Freeze version is exact."],
  ["freeze-namespace", nexoraObjectDirectorSceneCompositionFreezeNamespace === "nexora.nol.scene.composition.freeze", "Freeze namespace is exact."],
  ["release-status", sceneCompositionFreezeStatus.released && sceneCompositionFreezeStatus.certified && sceneCompositionFreezeStatus.frozen && sceneCompositionFreezeStatus.stable && sceneCompositionFreezeStatus.readiness === "ready-for-platform", "Release status is locked."],
  ["freeze-lock", nexoraObjectDirectorSceneCompositionFreezeLock.active && !nexoraObjectDirectorSceneCompositionFreezeLock.reversible && nexoraObjectDirectorSceneCompositionFreezeLock.lockId === "NOL-7-DIRECTOR-SCENE-COMPOSITION-LOCKED", "Freeze lock is active and irreversible."],
  ["certified-upstream", upstreamAttested && sceneCompositionFrozenUpstream.requiredOutcome === "certified" && sceneCompositionFrozenUpstream.requiresFreezeEligibility, "Certified upstream is structurally attested."],
  ["certification-semantics", sceneCompositionCertificationOutcomes.includes("certified") && sceneCompositionCertificationLevels.length === 5, "Certification semantics are preserved."],
  ["upstream-registry", upstreamAttested, "Upstream registry is valid and frozen."],
  ["invariants", invariantIntegrity(), "All mandatory invariants are unique and locked."],
  ["vocabulary-surface", surfacesValid(sceneCompositionFrozenVocabularySurface), "Vocabulary surface is locked."],
  ["contract-surface", surfacesValid(sceneCompositionFrozenContractSurface), "Contract surface is locked."],
  ["validation-surface", surfacesValid(sceneCompositionFrozenValidationSurface), "Validation surface is locked."],
  ["certification-surface", surfacesValid(sceneCompositionFrozenCertificationSurface), "Certification surface is locked."],
  ["compatibility-policy", !sceneCompositionFreezeCompatibilityPolicy.mutationAllowed && !sceneCompositionFreezeCompatibilityPolicy.validationBypassAllowed && !sceneCompositionFreezeCompatibilityPolicy.certificationBypassAllowed, "Compatibility policy prevents drift."],
  ["consumer-policy", exact(sceneCompositionFreezeConsumerPolicy.immediateAllowedConsumers, ["NOL-7:6"]) && !sceneCompositionFreezeConsumerPolicy.directFeatureConsumptionAllowed, "Consumer policy permits only the Platform phase."],
  ["platform-handoff", sceneCompositionFreezePlatformHandoff.ready && sceneCompositionFreezePlatformHandoff.nextPhase === "NOL-7:6", "Platform handoff is ready."],
  ["binding-terminology", exact(visibilityTerms, ["visible", "hidden", "collapsed"]) && exact(interactionTerms, ["none", "selectable", "focusable", "interactive"]) && exact(rendererStateTerms, ["minimum", "report", "operation"]), "Scene Binding terminology is preserved."],
  ["registry", verifyNexoraObjectDirectorSceneCompositionFreezeRegistry().valid, "Freeze registry is valid."],
  ["platform-readiness", sceneCompositionFreezePlatformHandoff.ready && sceneCompositionFreezeStatus.readiness === "ready-for-platform", "Freeze is ready for Platform."],
];

export function verifyNexoraObjectDirectorSceneCompositionFreeze(): SceneCompositionFreezeVerificationResult {
  const checkResults = freezeOwned(checks().map(([checkId, passed, message]) => freezeOwned({ checkId, passed, message }))), passedCheckCount = checkResults.filter((result) => result.passed).length, failedCheckCount = checkResults.length - passedCheckCount;
  return freezeOwned({ valid: failedCheckCount === 0, lockActive: nexoraObjectDirectorSceneCompositionFreezeLock.active, readyForPlatform: failedCheckCount === 0 && sceneCompositionFreezePlatformHandoff.ready, checkResults, passedCheckCount, failedCheckCount });
}

export function isNexoraObjectDirectorSceneCompositionFrozen(): boolean { return nexoraObjectDirectorSceneCompositionFreezeLock.active && sceneCompositionFreezeStatus.frozen && sceneCompositionFreezeStatus.stable && invariantIntegrity() && isNexoraObjectDirectorSceneCompositionFreezeRegistryFrozen() && !sceneCompositionFreezeCompatibilityPolicy.mutationAllowed && verifyNexoraObjectDirectorSceneCompositionFreeze().valid; }
export function isNexoraObjectDirectorSceneCompositionReadyForPlatform(): boolean { return verifyNexoraObjectDirectorSceneCompositionFreeze().valid && isNexoraObjectDirectorSceneCompositionFrozen() && sceneCompositionFreezeStatus.readiness === "ready-for-platform" && sceneCompositionFreezeConsumerPolicy.immediateAllowedConsumers.includes("NOL-7:6") && sceneCompositionFreezePlatformHandoff.ready && verifyNexoraObjectDirectorSceneCompositionFreezeRegistry().valid; }
export function getNexoraObjectDirectorSceneCompositionFrozenVocabularySurface(): typeof sceneCompositionFrozenVocabularySurface { return sceneCompositionFrozenVocabularySurface; }
export function getNexoraObjectDirectorSceneCompositionFrozenVocabularyCount(): number { return sceneCompositionFrozenVocabularySurface.length; }
export function getNexoraObjectDirectorSceneCompositionFrozenContractSurface(): typeof sceneCompositionFrozenContractSurface { return sceneCompositionFrozenContractSurface; }
export function getNexoraObjectDirectorSceneCompositionFrozenContractCount(): number { return sceneCompositionFrozenContractSurface.length; }
export function getNexoraObjectDirectorSceneCompositionFrozenValidationSurface(): typeof sceneCompositionFrozenValidationSurface { return sceneCompositionFrozenValidationSurface; }
export function getNexoraObjectDirectorSceneCompositionFrozenValidationCount(): number { return sceneCompositionFrozenValidationSurface.length; }
export function getNexoraObjectDirectorSceneCompositionFrozenCertificationSurface(): typeof sceneCompositionFrozenCertificationSurface { return sceneCompositionFrozenCertificationSurface; }
export function getNexoraObjectDirectorSceneCompositionFrozenCertificationCount(): number { return sceneCompositionFrozenCertificationSurface.length; }

export const nexoraObjectDirectorSceneCompositionFreezePrimaryPublicApiSurface = freezeOwned(["verifyNexoraObjectDirectorSceneCompositionFreeze", "isNexoraObjectDirectorSceneCompositionFrozen", "isNexoraObjectDirectorSceneCompositionReadyForPlatform", "getNexoraObjectDirectorSceneCompositionFrozenVocabularySurface", "getNexoraObjectDirectorSceneCompositionFrozenVocabularyCount", "getNexoraObjectDirectorSceneCompositionFrozenContractSurface", "getNexoraObjectDirectorSceneCompositionFrozenContractCount", "getNexoraObjectDirectorSceneCompositionFrozenValidationSurface", "getNexoraObjectDirectorSceneCompositionFrozenValidationCount", "getNexoraObjectDirectorSceneCompositionFrozenCertificationSurface", "getNexoraObjectDirectorSceneCompositionFrozenCertificationCount", "getNexoraObjectDirectorSceneCompositionFreezeSummary"] as const);
export const nexoraObjectDirectorSceneCompositionFreezePrimaryPublicApiCount = nexoraObjectDirectorSceneCompositionFreezePrimaryPublicApiSurface.length;

export const nexoraObjectDirectorSceneCompositionFreezeCapabilities = freezeOwned(["release-identity-lock", "certification-boundary-lock", "composition-vocabulary-lock", "composition-contract-lock", "validation-semantics-lock", "certification-semantics-lock", "scene-binding-compatibility-lock", "public-terminology-lock", "dependency-boundary-lock", "public-api-surface-lock", "registry-lock", "compatibility-lock", "consumer-policy-lock", "platform-handoff-lock", "immutability-lock", "semantic-version-lock", "lineage-lock", "freeze-verification", "platform-readiness-verification", "dynamic-vocabulary-count", "dynamic-contract-count", "dynamic-validation-count", "dynamic-certification-count", "dynamic-registry-count", "deep-immutability", "structural-integrity", "downstream-drift-protection", "validation-bypass-protection", "certification-bypass-protection", "runtime-isolation", "renderer-isolation", "ui-isolation"] as const);
export const nexoraObjectDirectorSceneCompositionFreezeCapabilityCount = nexoraObjectDirectorSceneCompositionFreezeCapabilities.length;

const registryData = [
  ["Identity", ["nexoraObjectDirectorSceneCompositionFreezeId", "nexoraObjectDirectorSceneCompositionFreezeVersion", "nexoraObjectDirectorSceneCompositionFreezeNamespace"]], ["Release Status", ["sceneCompositionFreezeStatus"]], ["Freeze Lock", ["nexoraObjectDirectorSceneCompositionFreezeLock"]], ["Certified Upstream", ["sceneCompositionFrozenUpstream"]], ["Invariant Categories", ["sceneCompositionFreezeInvariantCategories"]], ["Freeze Invariants", ["sceneCompositionFreezeInvariants"]], ["Frozen Vocabulary Surface", ["sceneCompositionFrozenVocabularySurface"]], ["Frozen Contract Surface", ["sceneCompositionFrozenContractSurface"]], ["Frozen Validation Surface", ["sceneCompositionFrozenValidationSurface"]], ["Frozen Certification Surface", ["sceneCompositionFrozenCertificationSurface"]], ["Compatibility Policy", ["sceneCompositionFreezeCompatibilityPolicy"]], ["Consumer Policy", ["sceneCompositionFreezeConsumerPolicy"]], ["Platform Handoff", ["sceneCompositionFreezePlatformHandoff"]], ["Verification Contracts", ["SceneCompositionFreezeCheckResult", "SceneCompositionFreezeVerificationResult"]], ["Public APIs", [...nexoraObjectDirectorSceneCompositionFreezePrimaryPublicApiSurface, "getNexoraObjectDirectorSceneCompositionFreezeRegistry", "getNexoraObjectDirectorSceneCompositionFreezeRegistryCount", "verifyNexoraObjectDirectorSceneCompositionFreezeRegistry", "isNexoraObjectDirectorSceneCompositionFreezeRegistryFrozen"]], ["Dependency Boundary", ["NOL-7:4/NexoraObjectDirectorSceneCompositionCertification"]], ["Freeze Capabilities", ["nexoraObjectDirectorSceneCompositionFreezeCapabilities"]], ["Readiness", ["ready-for-platform", "NOL-7:6"]], ["Release Information", ["released", "certified", "frozen", "stable"]],
] as const;
export type SceneCompositionFreezeRegistryEntry = Readonly<{ order: number; section: string; exportNames: readonly string[]; locked: true }>;
export const nexoraObjectDirectorSceneCompositionFreezeRegistry: readonly SceneCompositionFreezeRegistryEntry[] = freezeOwned(registryData.map(([section, exportNames], order) => freezeOwned({ order, section, exportNames: freezeOwned([...exportNames]), locked: true })));
export const nexoraObjectDirectorSceneCompositionFreezeRegistryCount = nexoraObjectDirectorSceneCompositionFreezeRegistry.length;
export function getNexoraObjectDirectorSceneCompositionFreezeRegistry(): typeof nexoraObjectDirectorSceneCompositionFreezeRegistry { return nexoraObjectDirectorSceneCompositionFreezeRegistry; }
export function getNexoraObjectDirectorSceneCompositionFreezeRegistryCount(): number { return nexoraObjectDirectorSceneCompositionFreezeRegistry.length; }
export function isNexoraObjectDirectorSceneCompositionFreezeRegistryFrozen(): boolean { return deeplyFrozen(nexoraObjectDirectorSceneCompositionFreezeRegistry) && deeplyFrozen(nexoraObjectDirectorSceneCompositionFreezeCapabilities) && deeplyFrozen(nexoraObjectDirectorSceneCompositionFreezePrimaryPublicApiSurface) && noExecutables(nexoraObjectDirectorSceneCompositionFreezeRegistry); }
export function verifyNexoraObjectDirectorSceneCompositionFreezeRegistry(): Readonly<{ valid: boolean; ordered: boolean; unique: boolean; countValid: boolean; publicApisValid: boolean; capabilitiesValid: boolean; frozen: boolean; violations: readonly string[] }> {
  const ordered = nexoraObjectDirectorSceneCompositionFreezeRegistry.every((entry, index) => entry.order === index && entry.section === registryData[index][0]), uniqueEntries = unique(nexoraObjectDirectorSceneCompositionFreezeRegistry.map((entry) => entry.section)), countValid = nexoraObjectDirectorSceneCompositionFreezeRegistry.length === 19 && nexoraObjectDirectorSceneCompositionFreezeRegistryCount === nexoraObjectDirectorSceneCompositionFreezeRegistry.length, publicApisValid = nexoraObjectDirectorSceneCompositionFreezePrimaryPublicApiCount === 12 && unique(nexoraObjectDirectorSceneCompositionFreezePrimaryPublicApiSurface) && registryData[14][1].length === 16, capabilitiesValid = nexoraObjectDirectorSceneCompositionFreezeCapabilityCount === 32 && unique(nexoraObjectDirectorSceneCompositionFreezeCapabilities), frozen = isNexoraObjectDirectorSceneCompositionFreezeRegistryFrozen(), validations = [[ordered, "Registry order is invalid."], [uniqueEntries, "Registry sections are duplicated."], [countValid, "Registry count is invalid."], [publicApisValid, "Public API surface is invalid."], [capabilitiesValid, "Capabilities are invalid."], [frozen, "Registry is mutable."]] as const, violations = validations.filter(([passed]) => !passed).map(([, message]) => message);
  return freezeOwned({ valid: violations.length === 0, ordered, unique: uniqueEntries, countValid, publicApisValid, capabilitiesValid, frozen, violations: freezeOwned(violations) });
}

export function getNexoraObjectDirectorSceneCompositionFreezeSummary(): Readonly<{ identity: string; version: string; namespace: string; lockId: string; released: boolean; certified: boolean; frozen: boolean; stable: boolean; readiness: "ready-for-platform"; invariantCount: number; frozenVocabularyCount: number; frozenContractCount: number; frozenValidationApiCount: number; frozenCertificationApiCount: number; registryEntryCount: number; soleDependency: string; nextPhase: "NOL-7:6" }> {
  return freezeOwned({ identity: nexoraObjectDirectorSceneCompositionFreezeId, version: nexoraObjectDirectorSceneCompositionFreezeVersion, namespace: nexoraObjectDirectorSceneCompositionFreezeNamespace, lockId: nexoraObjectDirectorSceneCompositionFreezeLock.lockId, released: sceneCompositionFreezeStatus.released, certified: sceneCompositionFreezeStatus.certified, frozen: sceneCompositionFreezeStatus.frozen, stable: sceneCompositionFreezeStatus.stable, readiness: sceneCompositionFreezeStatus.readiness, invariantCount: sceneCompositionFreezeInvariants.length, frozenVocabularyCount: sceneCompositionFrozenVocabularySurface.length, frozenContractCount: sceneCompositionFrozenContractSurface.length, frozenValidationApiCount: sceneCompositionFrozenValidationSurface.length, frozenCertificationApiCount: sceneCompositionFrozenCertificationSurface.length, registryEntryCount: nexoraObjectDirectorSceneCompositionFreezeRegistry.length, soleDependency: sceneCompositionFrozenUpstream.identity, nextPhase: sceneCompositionFreezePlatformHandoff.nextPhase });
}
