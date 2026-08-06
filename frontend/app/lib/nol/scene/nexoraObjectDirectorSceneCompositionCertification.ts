/** NOL-7:4 — immutable certification of supplied Scene Composition validation evidence. */
import {
  getNexoraObjectDirectorSceneCompositionValidationRegistry,
  getNexoraObjectDirectorSceneCompositionValidationRegistryCount,
  getNexoraObjectDirectorSceneCompositionValidationSummary,
  isNexoraObjectDirectorSceneCompositionValidationRegistryFrozen,
  isNexoraObjectDirectorSceneCompositionValidationResult,
  nexoraObjectDirectorSceneCompositionValidationId,
  nexoraObjectDirectorSceneCompositionValidationNamespace,
  nexoraObjectDirectorSceneCompositionValidationRegistry,
  nexoraObjectDirectorSceneCompositionValidationRegistryCount,
  nexoraObjectDirectorSceneCompositionValidationVersion,
  verifyNexoraObjectDirectorSceneCompositionValidationRegistry,
  type SceneCompositionValidationCode,
  type SceneCompositionValidationFinding,
  type SceneCompositionValidationResult,
} from "@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionValidation";

export const nexoraObjectDirectorSceneCompositionCertificationId = "NOL-7:4/NexoraObjectDirectorSceneCompositionCertification" as const;
export const nexoraObjectDirectorSceneCompositionCertificationVersion = "7.4.0" as const;
export const nexoraObjectDirectorSceneCompositionCertificationNamespace = "nexora.nol.scene.composition.certification" as const;

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

function record(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function validId(value: unknown): value is string { return typeof value === "string" && value.length > 0 && value.trim() === value; }
function validCount(value: unknown): value is number { return typeof value === "number" && Number.isInteger(value) && value >= 0; }
function unique(values: readonly string[]): boolean { return values.every((value, index) => values.indexOf(value) === index); }
function lexical(left: string, right: string): number { return left < right ? -1 : left > right ? 1 : 0; }

export type SceneCompositionCertificationStatus = Readonly<{ certificationLayer: true; released: true; immutable: true; deterministic: true; readiness: "ready-for-freeze" }>;
export const sceneCompositionCertificationStatus: SceneCompositionCertificationStatus = freezeOwned({ certificationLayer: true, released: true, immutable: true, deterministic: true, readiness: "ready-for-freeze" });

export type SceneCompositionCertificationLevel = "structural" | "referential" | "behavioral" | "architectural" | "release";
export const sceneCompositionCertificationLevels = freezeOwned(["structural", "referential", "behavioral", "architectural", "release"] as const satisfies readonly SceneCompositionCertificationLevel[]);
export const sceneCompositionCertificationLevelCount = sceneCompositionCertificationLevels.length;

export type SceneCompositionCertificationOutcome = "certified" | "partially-certified" | "rejected";
export const sceneCompositionCertificationOutcomes = freezeOwned(["certified", "partially-certified", "rejected"] as const satisfies readonly SceneCompositionCertificationOutcome[]);
export const sceneCompositionCertificationOutcomeCount = sceneCompositionCertificationOutcomes.length;

export type SceneCompositionCertificationSeverity = "info" | "warning" | "error" | "fatal";
export const sceneCompositionCertificationSeverities = freezeOwned(["info", "warning", "error", "fatal"] as const satisfies readonly SceneCompositionCertificationSeverity[]);
export const sceneCompositionCertificationSeverityCount = sceneCompositionCertificationSeverities.length;

export const sceneCompositionCertificationCodes = freezeOwned([
  "SCENE_COMPOSITION_CERTIFIED", "SCENE_COMPOSITION_PARTIALLY_CERTIFIED", "SCENE_COMPOSITION_CERTIFICATION_REJECTED", "SCENE_COMPOSITION_CERTIFICATION_INPUT_REQUIRED", "SCENE_COMPOSITION_CERTIFICATION_INPUT_INVALID", "SCENE_COMPOSITION_CANDIDATE_ID_REQUIRED", "SCENE_COMPOSITION_CANDIDATE_ID_INVALID", "SCENE_COMPOSITION_VALIDATION_RESULT_REQUIRED", "SCENE_COMPOSITION_VALIDATION_RESULT_INVALID", "SCENE_COMPOSITION_VALIDATION_FAILED", "SCENE_COMPOSITION_VALIDATION_WARNING_PRESENT", "SCENE_COMPOSITION_VALIDATION_COUNTS_INVALID",
  "SCENE_COMPOSITION_STRUCTURAL_CERTIFICATION_PASSED", "SCENE_COMPOSITION_STRUCTURAL_CERTIFICATION_FAILED", "SCENE_COMPOSITION_REFERENTIAL_CERTIFICATION_PASSED", "SCENE_COMPOSITION_REFERENTIAL_CERTIFICATION_FAILED", "SCENE_COMPOSITION_REFERENCE_INTEGRITY_CONFIRMED", "SCENE_COMPOSITION_REFERENCE_INTEGRITY_FAILED", "SCENE_COMPOSITION_ORDERING_INTEGRITY_CONFIRMED", "SCENE_COMPOSITION_ORDERING_INTEGRITY_FAILED", "SCENE_COMPOSITION_FOCUS_INTEGRITY_CONFIRMED", "SCENE_COMPOSITION_FOCUS_INTEGRITY_FAILED", "SCENE_COMPOSITION_PLACEMENT_INTEGRITY_CONFIRMED", "SCENE_COMPOSITION_PLACEMENT_INTEGRITY_FAILED", "SCENE_COMPOSITION_RELATIONSHIP_INTEGRITY_CONFIRMED", "SCENE_COMPOSITION_RELATIONSHIP_INTEGRITY_FAILED", "SCENE_COMPOSITION_ANNOTATION_INTEGRITY_CONFIRMED", "SCENE_COMPOSITION_ANNOTATION_INTEGRITY_FAILED",
  "SCENE_COMPOSITION_BEHAVIORAL_CERTIFICATION_PASSED", "SCENE_COMPOSITION_BEHAVIORAL_CERTIFICATION_FAILED", "SCENE_COMPOSITION_DETERMINISM_CONFIRMED", "SCENE_COMPOSITION_DETERMINISM_FAILED", "SCENE_COMPOSITION_CANONICAL_ORDER_CONFIRMED", "SCENE_COMPOSITION_CANONICAL_ORDER_FAILED", "SCENE_COMPOSITION_DEDUPLICATION_CONFIRMED", "SCENE_COMPOSITION_DEDUPLICATION_FAILED", "SCENE_COMPOSITION_IMMUTABILITY_CONFIRMED", "SCENE_COMPOSITION_IMMUTABILITY_FAILED", "SCENE_COMPOSITION_INPUT_MUTATION_DETECTED", "SCENE_COMPOSITION_INPUT_FREEZING_DETECTED", "SCENE_COMPOSITION_INVALID_INPUT_HANDLING_CONFIRMED", "SCENE_COMPOSITION_INVALID_INPUT_HANDLING_FAILED",
  "SCENE_COMPOSITION_ARCHITECTURAL_CERTIFICATION_PASSED", "SCENE_COMPOSITION_ARCHITECTURAL_CERTIFICATION_FAILED", "SCENE_COMPOSITION_DEPENDENCY_BOUNDARY_CONFIRMED", "SCENE_COMPOSITION_DEPENDENCY_BOUNDARY_FAILED", "SCENE_COMPOSITION_REGISTRY_COMPATIBILITY_CONFIRMED", "SCENE_COMPOSITION_REGISTRY_COMPATIBILITY_FAILED", "SCENE_COMPOSITION_BINDING_COMPATIBILITY_CONFIRMED", "SCENE_COMPOSITION_BINDING_COMPATIBILITY_FAILED", "SCENE_COMPOSITION_PUBLIC_TERMINOLOGY_CONFIRMED", "SCENE_COMPOSITION_PUBLIC_TERMINOLOGY_FAILED", "SCENE_COMPOSITION_PLAIN_DATA_CONFIRMED", "SCENE_COMPOSITION_PLAIN_DATA_FAILED", "SCENE_COMPOSITION_FORBIDDEN_BEHAVIOR_ABSENT", "SCENE_COMPOSITION_FORBIDDEN_BEHAVIOR_PRESENT",
  "SCENE_COMPOSITION_RELEASE_CERTIFICATION_PASSED", "SCENE_COMPOSITION_RELEASE_CERTIFICATION_FAILED", "SCENE_COMPOSITION_FREEZE_ELIGIBLE", "SCENE_COMPOSITION_FREEZE_INELIGIBLE", "SCENE_COMPOSITION_EVIDENCE_INCOMPLETE", "SCENE_COMPOSITION_CERTIFICATION_REQUIREMENT_FAILED",
] as const);
export type SceneCompositionCertificationCode = typeof sceneCompositionCertificationCodes[number];
export const sceneCompositionCertificationCodeCount = sceneCompositionCertificationCodes.length;

const requirementData = [
  ["validation-result-structure", "structural"], ["validation-result-validity", "structural"], ["validation-count-integrity", "structural"], ["validation-summary-integrity", "structural"], ["composition-identity-validity", "structural"], ["composition-structure-validity", "structural"], ["layer-structure-validity", "structural"], ["group-structure-validity", "structural"], ["unit-structure-validity", "structural"], ["relationship-structure-validity", "structural"], ["annotation-structure-validity", "structural"], ["binding-compatibility-structure", "structural"],
  ["layer-reference-integrity", "referential"], ["group-unit-reference-integrity", "referential"], ["unit-layer-reciprocity", "referential"], ["node-reference-integrity", "referential"], ["placement-anchor-integrity", "referential"], ["focus-reference-integrity", "referential"], ["relationship-endpoint-integrity", "referential"], ["annotation-target-integrity", "referential"], ["ordering-reference-integrity", "referential"], ["collection-reference-integrity", "referential"], ["snapshot-reference-integrity", "referential"], ["duplicate-identity-absence", "referential"],
  ["deterministic-validation-results", "behavioral"], ["canonical-finding-order", "behavioral"], ["exact-finding-deduplication", "behavioral"], ["deeply-frozen-validation-results", "behavioral"], ["deeply-frozen-findings", "behavioral"], ["deeply-frozen-paths", "behavioral"], ["caller-input-not-mutated", "behavioral"], ["caller-input-not-frozen", "behavioral"], ["warning-semantics", "behavioral"], ["invalid-input-does-not-throw", "behavioral"], ["checked-count-integrity", "behavioral"], ["summary-determinism", "behavioral"],
  ["validation-is-sole-production-dependency", "architectural"], ["no-foundation-direct-dependency", "architectural"], ["no-contracts-direct-dependency", "architectural"], ["no-nol6-direct-dependency", "architectural"], ["no-runtime-dependency", "architectural"], ["no-renderer-dependency", "architectural"], ["no-ui-dependency", "architectural"], ["no-react-dependency", "architectural"], ["no-threejs-dependency", "architectural"], ["no-side-effects", "architectural"], ["plain-data-boundary", "architectural"], ["validation-registry-compatible", "architectural"], ["binding-compatibility-preserved", "architectural"], ["interactive-terminology-preserved", "architectural"], ["actionable-terminology-excluded", "architectural"], ["forbidden-behavior-absent", "architectural"],
  ["all-required-levels-pass", "release"], ["no-fatal-findings", "release"], ["no-blocking-errors", "release"], ["warning-policy-satisfied", "release"], ["certification-result-frozen", "release"], ["certification-registry-valid", "release"], ["freeze-eligibility", "release"],
] as const satisfies readonly (readonly [string, SceneCompositionCertificationLevel])[];

export type SceneCompositionCertificationRequirementId = typeof requirementData[number][0];
export type SceneCompositionCertificationRequirement = Readonly<{ id: SceneCompositionCertificationRequirementId; level: SceneCompositionCertificationLevel; title: string; description: string; required: boolean; blocking: boolean }>;
export const sceneCompositionCertificationRequirements: readonly SceneCompositionCertificationRequirement[] = freezeOwned(requirementData.map(([id, level]) => freezeOwned({ id, level, title: id.replaceAll("-", " "), description: `${id.replaceAll("-", " ")} must be confirmed for Scene Composition certification.`, required: true, blocking: true })));
export const sceneCompositionCertificationRequirementCount = sceneCompositionCertificationRequirements.length;

export type SceneCompositionCertificationEvidence = Readonly<{
  validationResult: SceneCompositionValidationResult;
  repeatedValidationResult?: SceneCompositionValidationResult;
  referenceIntegrityConfirmed?: boolean;
  orderingIntegrityConfirmed?: boolean;
  focusIntegrityConfirmed?: boolean;
  placementIntegrityConfirmed?: boolean;
  relationshipIntegrityConfirmed?: boolean;
  annotationIntegrityConfirmed?: boolean;
  inputWasMutated?: boolean;
  inputWasFrozenByValidation?: boolean;
  invalidInputHandledWithoutThrow?: boolean;
  dependencyBoundaryConfirmed?: boolean;
  registryCompatibilityConfirmed?: boolean;
  bindingCompatibilityConfirmed?: boolean;
  publicTerminologyConfirmed?: boolean;
  plainDataBoundaryConfirmed?: boolean;
  forbiddenBehaviorAbsent?: boolean;
  notes?: readonly string[];
}>;
export type SceneCompositionCertificationInput = Readonly<{ candidateId: string; evidence: SceneCompositionCertificationEvidence }>;

export type SceneCompositionCertificationOptions = Readonly<{
  requiredLevels: readonly SceneCompositionCertificationLevel[];
  failOnWarning: boolean;
  requireRepeatedValidationEvidence: boolean;
  requireReferenceIntegrityEvidence: boolean;
  requireOrderingEvidence: boolean;
  requireFocusEvidence: boolean;
  requirePlacementEvidence: boolean;
  requireRelationshipEvidence: boolean;
  requireAnnotationEvidence: boolean;
  requireDependencyEvidence: boolean;
  requireRegistryEvidence: boolean;
  requireBindingCompatibilityEvidence: boolean;
  requirePublicTerminologyEvidence: boolean;
  requirePlainDataEvidence: boolean;
  requireForbiddenBehaviorEvidence: boolean;
}>;

export const defaultSceneCompositionCertificationOptions: SceneCompositionCertificationOptions = freezeOwned({ requiredLevels: freezeOwned([...sceneCompositionCertificationLevels]), failOnWarning: false, requireRepeatedValidationEvidence: true, requireReferenceIntegrityEvidence: true, requireOrderingEvidence: true, requireFocusEvidence: true, requirePlacementEvidence: true, requireRelationshipEvidence: true, requireAnnotationEvidence: true, requireDependencyEvidence: true, requireRegistryEvidence: true, requireBindingCompatibilityEvidence: true, requirePublicTerminologyEvidence: true, requirePlainDataEvidence: true, requireForbiddenBehaviorEvidence: true });

export type SceneCompositionCertificationFinding = Readonly<{ code: SceneCompositionCertificationCode; severity: SceneCompositionCertificationSeverity; message: string; level?: SceneCompositionCertificationLevel; requirementId?: SceneCompositionCertificationRequirementId; validationCode?: SceneCompositionValidationCode; path?: readonly (string | number)[]; compositionId?: string; layerId?: string; groupId?: string; unitId?: string; relationshipId?: string; annotationId?: string; relatedId?: string }>;
export type SceneCompositionCertificationRequirementResult = Readonly<{ requirementId: SceneCompositionCertificationRequirementId; level: SceneCompositionCertificationLevel; passed: boolean; blocking: boolean; findingCodes: readonly SceneCompositionCertificationCode[] }>;
export type SceneCompositionCertificationLevelResult = Readonly<{ level: SceneCompositionCertificationLevel; passed: boolean; requiredRequirementCount: number; passedRequirementCount: number; failedRequirementCount: number; blockingFailureCount: number }>;
export type SceneCompositionCertificationResult = Readonly<{ candidateId: string; certified: boolean; freezeEligible: boolean; outcome: SceneCompositionCertificationOutcome; findings: readonly SceneCompositionCertificationFinding[]; requirementResults: readonly SceneCompositionCertificationRequirementResult[]; levelResults: readonly SceneCompositionCertificationLevelResult[]; passedRequirementCount: number; failedRequirementCount: number; passedLevelCount: number; failedLevelCount: number; warningCount: number; errorCount: number; fatalCount: number }>;

type ResolvedOptions = Readonly<{ value: SceneCompositionCertificationOptions; unsupportedLevels: readonly string[] }>;
function resolveOptions(options?: Partial<SceneCompositionCertificationOptions>): ResolvedOptions {
  const candidate = record(options) ? options : {};
  const rawLevels = Array.isArray(candidate.requiredLevels) ? candidate.requiredLevels : defaultSceneCompositionCertificationOptions.requiredLevels;
  const unsupportedLevels = rawLevels.filter((level): level is string => typeof level !== "string" || !sceneCompositionCertificationLevels.includes(level as never)).map(String);
  const requiredLevels = rawLevels.filter((level): level is SceneCompositionCertificationLevel => sceneCompositionCertificationLevels.includes(level as never)).filter((level, index, values) => values.indexOf(level) === index);
  const flag = (key: Exclude<keyof SceneCompositionCertificationOptions, "requiredLevels">): boolean => typeof candidate[key] === "boolean" ? candidate[key] : defaultSceneCompositionCertificationOptions[key];
  return freezeOwned({ value: freezeOwned({ requiredLevels: freezeOwned(requiredLevels), failOnWarning: flag("failOnWarning"), requireRepeatedValidationEvidence: flag("requireRepeatedValidationEvidence"), requireReferenceIntegrityEvidence: flag("requireReferenceIntegrityEvidence"), requireOrderingEvidence: flag("requireOrderingEvidence"), requireFocusEvidence: flag("requireFocusEvidence"), requirePlacementEvidence: flag("requirePlacementEvidence"), requireRelationshipEvidence: flag("requireRelationshipEvidence"), requireAnnotationEvidence: flag("requireAnnotationEvidence"), requireDependencyEvidence: flag("requireDependencyEvidence"), requireRegistryEvidence: flag("requireRegistryEvidence"), requireBindingCompatibilityEvidence: flag("requireBindingCompatibilityEvidence"), requirePublicTerminologyEvidence: flag("requirePublicTerminologyEvidence"), requirePlainDataEvidence: flag("requirePlainDataEvidence"), requireForbiddenBehaviorEvidence: flag("requireForbiddenBehaviorEvidence") }), unsupportedLevels: freezeOwned(unsupportedLevels) });
}

function validationRegistryCompatible(): boolean {
  const registry = getNexoraObjectDirectorSceneCompositionValidationRegistry();
  const verification = verifyNexoraObjectDirectorSceneCompositionValidationRegistry();
  return nexoraObjectDirectorSceneCompositionValidationId === "NOL-7:3/NexoraObjectDirectorSceneCompositionValidation"
    && nexoraObjectDirectorSceneCompositionValidationVersion === "7.3.0"
    && nexoraObjectDirectorSceneCompositionValidationNamespace === "nexora.nol.scene.composition.validation"
    && registry === nexoraObjectDirectorSceneCompositionValidationRegistry
    && getNexoraObjectDirectorSceneCompositionValidationRegistryCount() === registry.length
    && nexoraObjectDirectorSceneCompositionValidationRegistryCount === registry.length
    && verification.valid && isNexoraObjectDirectorSceneCompositionValidationRegistryFrozen();
}
const validationRegistryAttested = validationRegistryCompatible();

function semanticValidationEqual(left: SceneCompositionValidationResult, right: SceneCompositionValidationResult): boolean {
  return JSON.stringify(left) === JSON.stringify(right) && JSON.stringify(getNexoraObjectDirectorSceneCompositionValidationSummary(left)) === JSON.stringify(getNexoraObjectDirectorSceneCompositionValidationSummary(right));
}

const validationSeverityPriority: Readonly<Record<string, number>> = { fatal: 0, error: 1, warning: 2, info: 3 };
function validationFindingKey(finding: SceneCompositionValidationFinding): string {
  return [String(validationSeverityPriority[finding.severity]), JSON.stringify(finding.path), finding.compositionId ?? "", finding.layerId ?? "", finding.groupId ?? "", finding.unitId ?? "", finding.relationshipId ?? "", finding.annotationId ?? "", finding.relatedId ?? "", finding.code, finding.message, finding.contractId ?? ""].join("|");
}
function canonicalValidationFindings(findings: readonly SceneCompositionValidationFinding[]): boolean { return findings.every((finding, index) => index === 0 || lexical(validationFindingKey(findings[index - 1]), validationFindingKey(finding)) <= 0); }
function validationFindingsDeduplicated(findings: readonly SceneCompositionValidationFinding[]): boolean { return findings.every((finding, index) => findings.findIndex((candidate) => JSON.stringify(candidate) === JSON.stringify(finding)) === index); }
function validationCodesMatching(result: SceneCompositionValidationResult, patterns: readonly string[]): boolean { return !result.findings.some((finding) => patterns.some((pattern) => finding.code.includes(pattern))); }
function countIntegrity(result: SceneCompositionValidationResult): boolean {
  const count = (severity: string): number => result.findings.filter((finding) => finding.severity === severity).length;
  return result.fatalCount === count("fatal") && result.errorCount === count("error") && result.warningCount === count("warning") && result.infoCount === count("info") && [result.checkedCompositionCount, result.checkedLayerCount, result.checkedGroupCount, result.checkedUnitCount, result.checkedRelationshipCount, result.checkedAnnotationCount, result.checkedNodeReferenceCount].every(validCount);
}

function evidencePlain(value: unknown): value is SceneCompositionCertificationEvidence {
  if (!record(value) || !isNexoraObjectDirectorSceneCompositionValidationResult(value.validationResult)) return false;
  if (value.repeatedValidationResult !== undefined && !isNexoraObjectDirectorSceneCompositionValidationResult(value.repeatedValidationResult)) return false;
  if (value.notes !== undefined && (!Array.isArray(value.notes) || !value.notes.every((note) => typeof note === "string"))) return false;
  return Object.entries(value).every(([key, entry]) => key === "validationResult" || key === "repeatedValidationResult" || key === "notes" || typeof entry === "boolean" || entry === undefined);
}

function requirementById(id: string): SceneCompositionCertificationRequirement | undefined { return sceneCompositionCertificationRequirements.find((requirement) => requirement.id === id); }
function optionalEvidence(value: boolean | undefined, required: boolean): boolean { return value === true || !required && value !== false; }

function evaluatePass(requirement: SceneCompositionCertificationRequirement, evidenceValue: unknown, options: SceneCompositionCertificationOptions): boolean {
  if (!evidencePlain(evidenceValue)) return false;
  const evidence = evidenceValue;
  const validation = evidence.validationResult;
  const summary = getNexoraObjectDirectorSceneCompositionValidationSummary(validation);
  const structuralPass = isNexoraObjectDirectorSceneCompositionValidationResult(validation) && countIntegrity(validation);
  const validPass = structuralPass && validation.valid && validation.fatalCount === 0 && validation.errorCount === 0;
  const referenceClean = validationCodesMatching(validation, ["REFERENCE", "DUPLICATE"]);
  const orderingClean = validationCodesMatching(validation, ["ORDER"]);
  const focusClean = validationCodesMatching(validation, ["FOCUS"]);
  const placementClean = validationCodesMatching(validation, ["PLACEMENT", "ANCHOR"]);
  const relationshipClean = validationCodesMatching(validation, ["RELATIONSHIP"]);
  const annotationClean = validationCodesMatching(validation, ["ANNOTATION"]);
  const repeatedPass = evidence.repeatedValidationResult !== undefined && semanticValidationEqual(validation, evidence.repeatedValidationResult) || !options.requireRepeatedValidationEvidence && evidence.repeatedValidationResult === undefined;
  const architectureMap: Readonly<Record<string, boolean>> = {
    "validation-is-sole-production-dependency": optionalEvidence(evidence.dependencyBoundaryConfirmed, options.requireDependencyEvidence), "no-foundation-direct-dependency": optionalEvidence(evidence.dependencyBoundaryConfirmed, options.requireDependencyEvidence), "no-contracts-direct-dependency": optionalEvidence(evidence.dependencyBoundaryConfirmed, options.requireDependencyEvidence), "no-nol6-direct-dependency": optionalEvidence(evidence.dependencyBoundaryConfirmed, options.requireDependencyEvidence), "no-runtime-dependency": optionalEvidence(evidence.dependencyBoundaryConfirmed, options.requireDependencyEvidence), "no-renderer-dependency": optionalEvidence(evidence.dependencyBoundaryConfirmed, options.requireDependencyEvidence), "no-ui-dependency": optionalEvidence(evidence.dependencyBoundaryConfirmed, options.requireDependencyEvidence), "no-react-dependency": optionalEvidence(evidence.dependencyBoundaryConfirmed, options.requireDependencyEvidence), "no-threejs-dependency": optionalEvidence(evidence.dependencyBoundaryConfirmed, options.requireDependencyEvidence), "no-side-effects": optionalEvidence(evidence.forbiddenBehaviorAbsent, options.requireForbiddenBehaviorEvidence), "plain-data-boundary": optionalEvidence(evidence.plainDataBoundaryConfirmed, options.requirePlainDataEvidence), "validation-registry-compatible": validationRegistryAttested && optionalEvidence(evidence.registryCompatibilityConfirmed, options.requireRegistryEvidence), "binding-compatibility-preserved": optionalEvidence(evidence.bindingCompatibilityConfirmed, options.requireBindingCompatibilityEvidence), "interactive-terminology-preserved": optionalEvidence(evidence.publicTerminologyConfirmed, options.requirePublicTerminologyEvidence), "actionable-terminology-excluded": optionalEvidence(evidence.publicTerminologyConfirmed, options.requirePublicTerminologyEvidence), "forbidden-behavior-absent": optionalEvidence(evidence.forbiddenBehaviorAbsent, options.requireForbiddenBehaviorEvidence),
  };
  if (requirement.level === "architectural") return architectureMap[requirement.id] === true;
  if (requirement.level === "structural") {
    if (requirement.id === "validation-result-structure") return structuralPass;
    if (requirement.id === "validation-result-validity") return validPass;
    if (requirement.id === "validation-count-integrity") return countIntegrity(validation);
    if (requirement.id === "validation-summary-integrity") return summary.findingCount === validation.findings.length && summary.fatalCount === validation.fatalCount && summary.errorCount === validation.errorCount && summary.warningCount === validation.warningCount && summary.infoCount === validation.infoCount;
    return validPass && validation.checkedCompositionCount > 0;
  }
  if (requirement.level === "referential") {
    if (requirement.id === "placement-anchor-integrity") return placementClean && optionalEvidence(evidence.placementIntegrityConfirmed, options.requirePlacementEvidence);
    if (requirement.id === "focus-reference-integrity") return focusClean && optionalEvidence(evidence.focusIntegrityConfirmed, options.requireFocusEvidence);
    if (requirement.id === "relationship-endpoint-integrity") return relationshipClean && optionalEvidence(evidence.relationshipIntegrityConfirmed, options.requireRelationshipEvidence);
    if (requirement.id === "annotation-target-integrity") return annotationClean && optionalEvidence(evidence.annotationIntegrityConfirmed, options.requireAnnotationEvidence);
    if (requirement.id === "ordering-reference-integrity") return orderingClean && optionalEvidence(evidence.orderingIntegrityConfirmed, options.requireOrderingEvidence);
    return referenceClean && optionalEvidence(evidence.referenceIntegrityConfirmed, options.requireReferenceIntegrityEvidence);
  }
  if (requirement.level === "behavioral") {
    if (requirement.id === "deterministic-validation-results" || requirement.id === "summary-determinism") return repeatedPass;
    if (requirement.id === "canonical-finding-order") return canonicalValidationFindings(validation.findings);
    if (requirement.id === "exact-finding-deduplication") return validationFindingsDeduplicated(validation.findings);
    if (requirement.id === "deeply-frozen-validation-results") return deeplyFrozen(validation);
    if (requirement.id === "deeply-frozen-findings") return deeplyFrozen(validation.findings) && validation.findings.every((finding) => deeplyFrozen(finding));
    if (requirement.id === "deeply-frozen-paths") return validation.findings.every((finding) => deeplyFrozen(finding.path));
    if (requirement.id === "caller-input-not-mutated") return evidence.inputWasMutated === false;
    if (requirement.id === "caller-input-not-frozen") return evidence.inputWasFrozenByValidation === false;
    if (requirement.id === "warning-semantics") return validation.errorCount > 0 || validation.fatalCount > 0 || validation.valid;
    if (requirement.id === "invalid-input-does-not-throw") return evidence.invalidInputHandledWithoutThrow === true;
    if (requirement.id === "checked-count-integrity") return countIntegrity(validation);
  }
  if (requirement.level === "release") {
    const baseRequirements = sceneCompositionCertificationRequirements.filter((candidate) => candidate.level !== "release");
    const basePass = baseRequirements.every((candidate) => evaluatePass(candidate, evidence, options));
    if (requirement.id === "no-fatal-findings") return validation.fatalCount === 0;
    if (requirement.id === "no-blocking-errors") return validation.errorCount === 0;
    if (requirement.id === "warning-policy-satisfied") return !options.failOnWarning || validation.warningCount === 0;
    if (requirement.id === "certification-result-frozen") return true;
    if (requirement.id === "certification-registry-valid") return validationRegistryAttested;
    return basePass && validation.fatalCount === 0 && validation.errorCount === 0 && (!options.failOnWarning || validation.warningCount === 0);
  }
  return false;
}

function failureCode(requirement: SceneCompositionCertificationRequirement): SceneCompositionCertificationCode {
  if (requirement.level === "structural") return "SCENE_COMPOSITION_STRUCTURAL_CERTIFICATION_FAILED";
  if (requirement.level === "referential") return requirement.id.includes("ordering") ? "SCENE_COMPOSITION_ORDERING_INTEGRITY_FAILED" : requirement.id.includes("focus") ? "SCENE_COMPOSITION_FOCUS_INTEGRITY_FAILED" : requirement.id.includes("placement") ? "SCENE_COMPOSITION_PLACEMENT_INTEGRITY_FAILED" : requirement.id.includes("relationship") ? "SCENE_COMPOSITION_RELATIONSHIP_INTEGRITY_FAILED" : requirement.id.includes("annotation") ? "SCENE_COMPOSITION_ANNOTATION_INTEGRITY_FAILED" : "SCENE_COMPOSITION_REFERENCE_INTEGRITY_FAILED";
  if (requirement.level === "behavioral") return requirement.id.includes("determin") || requirement.id.includes("summary") ? "SCENE_COMPOSITION_DETERMINISM_FAILED" : requirement.id.includes("canonical") ? "SCENE_COMPOSITION_CANONICAL_ORDER_FAILED" : requirement.id.includes("dedup") ? "SCENE_COMPOSITION_DEDUPLICATION_FAILED" : requirement.id === "caller-input-not-mutated" ? "SCENE_COMPOSITION_INPUT_MUTATION_DETECTED" : requirement.id === "caller-input-not-frozen" ? "SCENE_COMPOSITION_INPUT_FREEZING_DETECTED" : requirement.id === "invalid-input-does-not-throw" ? "SCENE_COMPOSITION_INVALID_INPUT_HANDLING_FAILED" : requirement.id.includes("frozen") ? "SCENE_COMPOSITION_IMMUTABILITY_FAILED" : "SCENE_COMPOSITION_BEHAVIORAL_CERTIFICATION_FAILED";
  if (requirement.level === "architectural") return requirement.id.includes("registry") ? "SCENE_COMPOSITION_REGISTRY_COMPATIBILITY_FAILED" : requirement.id.includes("binding") ? "SCENE_COMPOSITION_BINDING_COMPATIBILITY_FAILED" : requirement.id.includes("terminology") ? "SCENE_COMPOSITION_PUBLIC_TERMINOLOGY_FAILED" : requirement.id.includes("plain-data") ? "SCENE_COMPOSITION_PLAIN_DATA_FAILED" : requirement.id.includes("forbidden") || requirement.id === "no-side-effects" ? "SCENE_COMPOSITION_FORBIDDEN_BEHAVIOR_PRESENT" : "SCENE_COMPOSITION_DEPENDENCY_BOUNDARY_FAILED";
  return "SCENE_COMPOSITION_RELEASE_CERTIFICATION_FAILED";
}

function evaluateRequirementInternal(requirement: SceneCompositionCertificationRequirement, evidence: unknown, options: SceneCompositionCertificationOptions): SceneCompositionCertificationRequirementResult {
  const passed = evaluatePass(requirement, evidence, options);
  return freezeOwned({ requirementId: requirement.id, level: requirement.level, passed, blocking: requirement.blocking, findingCodes: freezeOwned(passed ? [] : [failureCode(requirement)]) });
}

export function evaluateNexoraObjectDirectorSceneCompositionCertificationRequirement(requirementId: SceneCompositionCertificationRequirementId, evidence: SceneCompositionCertificationEvidence, options?: Partial<SceneCompositionCertificationOptions>): SceneCompositionCertificationRequirementResult {
  const requirement = requirementById(requirementId);
  if (requirement === undefined) return freezeOwned({ requirementId, level: "structural", passed: false, blocking: true, findingCodes: freezeOwned(["SCENE_COMPOSITION_CERTIFICATION_REQUIREMENT_FAILED"] as const) });
  return evaluateRequirementInternal(requirement, evidence, resolveOptions(options).value);
}

function levelResultsOf(requirementResults: readonly SceneCompositionCertificationRequirementResult[]): readonly SceneCompositionCertificationLevelResult[] {
  return freezeOwned(sceneCompositionCertificationLevels.map((level) => {
    const relevant = requirementResults.filter((result) => result.level === level), passedRequirementCount = relevant.filter((result) => result.passed).length, failedRequirementCount = relevant.length - passedRequirementCount, blockingFailureCount = relevant.filter((result) => !result.passed && result.blocking).length;
    return freezeOwned({ level, passed: failedRequirementCount === 0 && blockingFailureCount === 0, requiredRequirementCount: relevant.length, passedRequirementCount, failedRequirementCount, blockingFailureCount });
  }));
}

export function resolveNexoraObjectDirectorSceneCompositionCertificationOutcome(levelResults: readonly SceneCompositionCertificationLevelResult[], findings: readonly SceneCompositionCertificationFinding[], options?: Partial<SceneCompositionCertificationOptions>): SceneCompositionCertificationOutcome {
  const resolved = resolveOptions(options).value, required = resolved.requiredLevels.map((level) => levelResults.find((result) => result.level === level)).filter((result): result is SceneCompositionCertificationLevelResult => result !== undefined), passed = required.filter((result) => result.passed).length;
  const fatalArchitecturalOrRelease = findings.some((finding) => finding.severity === "fatal" && (finding.level === "architectural" || finding.level === "release" || finding.level === undefined));
  const fatal = findings.some((finding) => finding.severity === "fatal"), errors = findings.some((finding) => finding.severity === "error"), warningBlocked = resolved.failOnWarning && findings.some((finding) => finding.severity === "warning");
  if (required.length === 0 || passed === 0 || fatalArchitecturalOrRelease) return "rejected";
  if (passed === required.length && !fatal && !errors && !warningBlocked) return "certified";
  return "partially-certified";
}

type MutableFinding = Omit<SceneCompositionCertificationFinding, "path"> & { path?: (string | number)[] };
const certificationSeverityPriority: Readonly<Record<SceneCompositionCertificationSeverity, number>> = { fatal: 0, error: 1, warning: 2, info: 3 };
function findingComparison(left: MutableFinding, right: MutableFinding): number {
  const severity = certificationSeverityPriority[left.severity] - certificationSeverityPriority[right.severity]; if (severity !== 0) return severity;
  const level = (left.level === undefined ? -1 : sceneCompositionCertificationLevels.indexOf(left.level)) - (right.level === undefined ? -1 : sceneCompositionCertificationLevels.indexOf(right.level)); if (level !== 0) return level;
  const requirement = (left.requirementId === undefined ? -1 : requirementData.findIndex(([id]) => id === left.requirementId)) - (right.requirementId === undefined ? -1 : requirementData.findIndex(([id]) => id === right.requirementId)); if (requirement !== 0) return requirement;
  const leftValues = [left.validationCode ?? "", left.code, JSON.stringify(left.path ?? []), left.compositionId ?? "", left.layerId ?? "", left.groupId ?? "", left.unitId ?? "", left.relationshipId ?? "", left.annotationId ?? "", left.relatedId ?? "", left.message];
  const rightValues = [right.validationCode ?? "", right.code, JSON.stringify(right.path ?? []), right.compositionId ?? "", right.layerId ?? "", right.groupId ?? "", right.unitId ?? "", right.relationshipId ?? "", right.annotationId ?? "", right.relatedId ?? "", right.message];
  for (let index = 0; index < leftValues.length; index += 1) { const compared = lexical(leftValues[index], rightValues[index]); if (compared !== 0) return compared; }
  return 0;
}
function canonicalFindings(findings: readonly MutableFinding[]): readonly SceneCompositionCertificationFinding[] {
  const ordered = [...findings].sort(findingComparison), deduplicated = ordered.filter((finding, index) => index === 0 || JSON.stringify(finding) !== JSON.stringify(ordered[index - 1]));
  return freezeOwned(deduplicated.map((finding) => freezeOwned({ ...finding, ...(finding.path === undefined ? {} : { path: freezeOwned([...finding.path]) }) })));
}

function translateValidationFindings(validation: SceneCompositionValidationResult): MutableFinding[] {
  return validation.findings.map((finding) => ({ code: finding.severity === "warning" ? "SCENE_COMPOSITION_VALIDATION_WARNING_PRESENT" : "SCENE_COMPOSITION_VALIDATION_FAILED", severity: finding.severity, message: `Validation evidence: ${finding.message}`, level: finding.severity === "warning" ? "structural" : "structural", validationCode: finding.code, path: [...finding.path], compositionId: finding.compositionId, layerId: finding.layerId, groupId: finding.groupId, unitId: finding.unitId, relationshipId: finding.relationshipId, annotationId: finding.annotationId, relatedId: finding.relatedId }));
}

function rejectedResult(candidateId: string, findings: readonly MutableFinding[]): SceneCompositionCertificationResult {
  const requirementResults = freezeOwned(sceneCompositionCertificationRequirements.map((requirement) => freezeOwned({ requirementId: requirement.id, level: requirement.level, passed: false, blocking: requirement.blocking, findingCodes: freezeOwned([failureCode(requirement)]) }))), levelResults = levelResultsOf(requirementResults), canonical = canonicalFindings(findings), count = (severity: SceneCompositionCertificationSeverity): number => canonical.filter((finding) => finding.severity === severity).length;
  return freezeOwned({ candidateId, certified: false, freezeEligible: false, outcome: "rejected", findings: canonical, requirementResults, levelResults, passedRequirementCount: 0, failedRequirementCount: requirementResults.length, passedLevelCount: 0, failedLevelCount: levelResults.length, warningCount: count("warning"), errorCount: count("error"), fatalCount: count("fatal") });
}

export function certifyNexoraObjectDirectorSceneComposition(input: unknown, options?: Partial<SceneCompositionCertificationOptions>): SceneCompositionCertificationResult {
  const resolved = resolveOptions(options), candidateId = record(input) && typeof input.candidateId === "string" ? input.candidateId : "";
  if (!record(input)) return rejectedResult("", [{ code: input === null || input === undefined ? "SCENE_COMPOSITION_CERTIFICATION_INPUT_REQUIRED" : "SCENE_COMPOSITION_CERTIFICATION_INPUT_INVALID", severity: "fatal", message: "Certification input must be a plain object." }]);
  const preliminary: MutableFinding[] = [];
  if (input.candidateId === undefined || input.candidateId === "") preliminary.push({ code: "SCENE_COMPOSITION_CANDIDATE_ID_REQUIRED", severity: "fatal", message: "Candidate ID is required." });
  else if (!validId(input.candidateId)) preliminary.push({ code: "SCENE_COMPOSITION_CANDIDATE_ID_INVALID", severity: "fatal", message: "Candidate ID must be a non-empty trimmed string." });
  if (!record(input.evidence)) preliminary.push({ code: "SCENE_COMPOSITION_VALIDATION_RESULT_REQUIRED", severity: "fatal", message: "Certification evidence and validation result are required." });
  else if (!evidencePlain(input.evidence)) preliminary.push({ code: "SCENE_COMPOSITION_VALIDATION_RESULT_INVALID", severity: "fatal", message: "Certification evidence contains an invalid validation result or non-plain data." });
  resolved.unsupportedLevels.forEach((level) => preliminary.push({ code: "SCENE_COMPOSITION_CERTIFICATION_INPUT_INVALID", severity: "fatal", message: `Unsupported required certification level '${level}'.` }));
  if (preliminary.length > 0) return rejectedResult(candidateId, preliminary);
  const evidence = input.evidence as SceneCompositionCertificationEvidence;
  const requirementResults = freezeOwned(sceneCompositionCertificationRequirements.map((requirement) => evaluateRequirementInternal(requirement, evidence, resolved.value)));
  const levelResults = levelResultsOf(requirementResults);
  const findings: MutableFinding[] = translateValidationFindings(evidence.validationResult);
  requirementResults.filter((entry) => !entry.passed).forEach((entry) => findings.push({ code: entry.findingCodes[0] ?? "SCENE_COMPOSITION_CERTIFICATION_REQUIREMENT_FAILED", severity: entry.level === "architectural" && entry.blocking ? "fatal" : "error", message: `Certification requirement '${entry.requirementId}' failed.`, level: entry.level, requirementId: entry.requirementId }));
  levelResults.forEach((entry) => findings.push({ code: entry.passed ? entry.level === "structural" ? "SCENE_COMPOSITION_STRUCTURAL_CERTIFICATION_PASSED" : entry.level === "referential" ? "SCENE_COMPOSITION_REFERENTIAL_CERTIFICATION_PASSED" : entry.level === "behavioral" ? "SCENE_COMPOSITION_BEHAVIORAL_CERTIFICATION_PASSED" : entry.level === "architectural" ? "SCENE_COMPOSITION_ARCHITECTURAL_CERTIFICATION_PASSED" : "SCENE_COMPOSITION_RELEASE_CERTIFICATION_PASSED" : failureCode(sceneCompositionCertificationRequirements.find((requirement) => requirement.level === entry.level)!), severity: entry.passed ? "info" : "error", message: `${entry.level} certification ${entry.passed ? "passed" : "failed"}.`, level: entry.level }));
  let canonical = canonicalFindings(findings), outcome = resolveNexoraObjectDirectorSceneCompositionCertificationOutcome(levelResults, canonical, resolved.value);
  findings.push({ code: outcome === "certified" ? "SCENE_COMPOSITION_CERTIFIED" : outcome === "partially-certified" ? "SCENE_COMPOSITION_PARTIALLY_CERTIFIED" : "SCENE_COMPOSITION_CERTIFICATION_REJECTED", severity: outcome === "certified" ? "info" : outcome === "partially-certified" ? "warning" : "fatal", message: `Scene Composition certification outcome is ${outcome}.`, level: "release" });
  canonical = canonicalFindings(findings);
  outcome = resolveNexoraObjectDirectorSceneCompositionCertificationOutcome(levelResults, canonical, resolved.value);
  const passedRequirementCount = requirementResults.filter((entry) => entry.passed).length, failedRequirementCount = requirementResults.length - passedRequirementCount, passedLevelCount = levelResults.filter((entry) => entry.passed).length, failedLevelCount = levelResults.length - passedLevelCount, count = (severity: SceneCompositionCertificationSeverity): number => canonical.filter((finding) => finding.severity === severity).length;
  const warningCount = count("warning"), errorCount = count("error"), fatalCount = count("fatal"), releasePassed = levelResults.find((entry) => entry.level === "release")?.passed === true, allRequiredPass = resolved.value.requiredLevels.every((level) => levelResults.find((entry) => entry.level === level)?.passed === true), certified = outcome === "certified", freezeEligible = certified && releasePassed && allRequiredPass && fatalCount === 0 && errorCount === 0 && (!resolved.value.failOnWarning || warningCount === 0);
  return freezeOwned({ candidateId, certified, freezeEligible, outcome, findings: canonical, requirementResults, levelResults, passedRequirementCount, failedRequirementCount, passedLevelCount, failedLevelCount, warningCount, errorCount, fatalCount });
}

export function isNexoraObjectDirectorSceneCompositionCertificationResult(value: unknown): value is SceneCompositionCertificationResult {
  if (!record(value) || !validId(value.candidateId) || typeof value.certified !== "boolean" || typeof value.freezeEligible !== "boolean" || !sceneCompositionCertificationOutcomes.includes(value.outcome as never)) return false;
  const findings = value.findings, requirementResults = value.requirementResults, levelResults = value.levelResults;
  if (!Array.isArray(findings) || !Array.isArray(requirementResults) || !Array.isArray(levelResults)) return false;
  const countKeys = ["passedRequirementCount", "failedRequirementCount", "passedLevelCount", "failedLevelCount", "warningCount", "errorCount", "fatalCount"] as const;
  if (!countKeys.every((key) => validCount(value[key]))) return false;
  const findingsValid = findings.every((entry) => record(entry) && sceneCompositionCertificationCodes.includes(entry.code as never) && sceneCompositionCertificationSeverities.includes(entry.severity as never) && typeof entry.message === "string" && (entry.path === undefined || Array.isArray(entry.path) && entry.path.every((part) => typeof part === "string" || validCount(part))));
  const requirementsValid = requirementResults.every((entry) => record(entry) && requirementById(String(entry.requirementId)) !== undefined && sceneCompositionCertificationLevels.includes(entry.level as never) && typeof entry.passed === "boolean" && typeof entry.blocking === "boolean" && Array.isArray(entry.findingCodes) && entry.findingCodes.every((code) => sceneCompositionCertificationCodes.includes(code as never)));
  const levelsValid = levelResults.every((entry) => record(entry) && sceneCompositionCertificationLevels.includes(entry.level as never) && typeof entry.passed === "boolean" && validCount(entry.requiredRequirementCount) && validCount(entry.passedRequirementCount) && validCount(entry.failedRequirementCount) && validCount(entry.blockingFailureCount) && entry.requiredRequirementCount === entry.passedRequirementCount + entry.failedRequirementCount && entry.passed === (entry.failedRequirementCount === 0 && entry.blockingFailureCount === 0));
  const severityCount = (severity: SceneCompositionCertificationSeverity): number => findings.filter((entry) => record(entry) && entry.severity === severity).length;
  const passedRequirements = requirementResults.filter((entry) => record(entry) && entry.passed === true).length, passedLevels = levelResults.filter((entry) => record(entry) && entry.passed === true).length;
  const countsValid = value.passedRequirementCount === passedRequirements && value.failedRequirementCount === requirementResults.length - passedRequirements && value.passedLevelCount === passedLevels && value.failedLevelCount === levelResults.length - passedLevels && value.warningCount === severityCount("warning") && value.errorCount === severityCount("error") && value.fatalCount === severityCount("fatal");
  return findingsValid && requirementsValid && levelsValid && countsValid && value.certified === (value.outcome === "certified") && (!value.freezeEligible || value.certified);
}

export function getNexoraObjectDirectorSceneCompositionCertificationSummary(result: SceneCompositionCertificationResult): Readonly<{ candidateId: string; status: "certified" | "partially-certified" | "rejected"; certified: boolean; freezeEligible: boolean; passedLevelCount: number; failedLevelCount: number; passedRequirementCount: number; failedRequirementCount: number; warningCount: number; errorCount: number; fatalCount: number }> {
  const passedLevelCount = result.levelResults.filter((entry) => entry.passed).length, passedRequirementCount = result.requirementResults.filter((entry) => entry.passed).length;
  const severityCount = (severity: SceneCompositionCertificationSeverity): number => result.findings.filter((entry) => entry.severity === severity).length;
  return freezeOwned({ candidateId: result.candidateId, status: result.outcome, certified: result.certified, freezeEligible: result.freezeEligible, passedLevelCount, failedLevelCount: result.levelResults.length - passedLevelCount, passedRequirementCount, failedRequirementCount: result.requirementResults.length - passedRequirementCount, warningCount: severityCount("warning"), errorCount: severityCount("error"), fatalCount: severityCount("fatal") });
}

export const nexoraObjectDirectorSceneCompositionCertificationCapabilities = freezeOwned(["structural-certification", "referential-certification", "behavioral-certification", "architectural-certification", "release-certification", "requirement-evaluation", "level-resolution", "outcome-resolution", "freeze-eligibility-resolution", "validation-evidence-consumption", "validation-finding-translation", "reference-integrity-certification", "ordering-integrity-certification", "focus-integrity-certification", "placement-integrity-certification", "relationship-integrity-certification", "annotation-integrity-certification", "determinism-certification", "canonical-order-certification", "deduplication-certification", "immutability-certification", "non-mutation-certification", "dependency-boundary-certification", "registry-compatibility-certification", "binding-compatibility-certification", "public-terminology-certification", "plain-data-certification", "warning-policy", "immutable-results", "dynamic-summary"] as const);
export const nexoraObjectDirectorSceneCompositionCertificationCapabilityCount = nexoraObjectDirectorSceneCompositionCertificationCapabilities.length;
export const nexoraObjectDirectorSceneCompositionCertificationPrimaryPublicApiSurface = freezeOwned(["certifyNexoraObjectDirectorSceneComposition", "evaluateNexoraObjectDirectorSceneCompositionCertificationRequirement", "resolveNexoraObjectDirectorSceneCompositionCertificationOutcome", "isNexoraObjectDirectorSceneCompositionCertificationResult", "getNexoraObjectDirectorSceneCompositionCertificationSummary"] as const);
export const nexoraObjectDirectorSceneCompositionCertificationPrimaryPublicApiCount = nexoraObjectDirectorSceneCompositionCertificationPrimaryPublicApiSurface.length;

const registryData = [
  ["Identity", ["nexoraObjectDirectorSceneCompositionCertificationId", "nexoraObjectDirectorSceneCompositionCertificationVersion", "nexoraObjectDirectorSceneCompositionCertificationNamespace"]], ["Certification Levels", ["sceneCompositionCertificationLevels"]], ["Outcomes", ["sceneCompositionCertificationOutcomes"]], ["Severities", ["sceneCompositionCertificationSeverities"]], ["Certification Codes", ["sceneCompositionCertificationCodes"]], ["Certification Requirements", ["sceneCompositionCertificationRequirements"]], ["Certification Evidence", ["SceneCompositionCertificationEvidence"]], ["Certification Input", ["SceneCompositionCertificationInput"]], ["Certification Options", ["defaultSceneCompositionCertificationOptions"]], ["Certification Findings", ["SceneCompositionCertificationFinding"]], ["Requirement Results", ["SceneCompositionCertificationRequirementResult"]], ["Level Results", ["SceneCompositionCertificationLevelResult"]], ["Certification Result", ["SceneCompositionCertificationResult"]], ["Public APIs", [...nexoraObjectDirectorSceneCompositionCertificationPrimaryPublicApiSurface, "getNexoraObjectDirectorSceneCompositionCertificationRegistry", "getNexoraObjectDirectorSceneCompositionCertificationRegistryCount", "verifyNexoraObjectDirectorSceneCompositionCertificationRegistry", "isNexoraObjectDirectorSceneCompositionCertificationRegistryFrozen"]], ["Dependency", ["NOL-7:3/NexoraObjectDirectorSceneCompositionValidation"]], ["Certification Capabilities", ["nexoraObjectDirectorSceneCompositionCertificationCapabilities"]], ["Readiness", ["sceneCompositionCertificationStatus", "ready-for-freeze"]], ["Release Information", ["released", "immutable", "deterministic"]],
] as const;
export type SceneCompositionCertificationRegistryEntry = Readonly<{ order: number; section: string; exportNames: readonly string[]; locked: true }>;
export const nexoraObjectDirectorSceneCompositionCertificationRegistry: readonly SceneCompositionCertificationRegistryEntry[] = freezeOwned(registryData.map(([section, exportNames], order) => freezeOwned({ order, section, exportNames: freezeOwned([...exportNames]), locked: true })));
export const nexoraObjectDirectorSceneCompositionCertificationRegistryCount = nexoraObjectDirectorSceneCompositionCertificationRegistry.length;
export function getNexoraObjectDirectorSceneCompositionCertificationRegistry(): typeof nexoraObjectDirectorSceneCompositionCertificationRegistry { return nexoraObjectDirectorSceneCompositionCertificationRegistry; }
export function getNexoraObjectDirectorSceneCompositionCertificationRegistryCount(): number { return nexoraObjectDirectorSceneCompositionCertificationRegistry.length; }
export function isNexoraObjectDirectorSceneCompositionCertificationRegistryFrozen(): boolean { return deeplyFrozen(nexoraObjectDirectorSceneCompositionCertificationRegistry) && deeplyFrozen(sceneCompositionCertificationLevels) && deeplyFrozen(sceneCompositionCertificationOutcomes) && deeplyFrozen(sceneCompositionCertificationSeverities) && deeplyFrozen(sceneCompositionCertificationCodes) && deeplyFrozen(sceneCompositionCertificationRequirements) && deeplyFrozen(defaultSceneCompositionCertificationOptions) && deeplyFrozen(nexoraObjectDirectorSceneCompositionCertificationCapabilities) && deeplyFrozen(sceneCompositionCertificationStatus); }
export function verifyNexoraObjectDirectorSceneCompositionCertificationRegistry(): Readonly<{ valid: boolean; ordered: boolean; unique: boolean; countValid: boolean; publicApisValid: boolean; capabilitiesValid: boolean; requirementsValid: boolean; upstreamValid: boolean; frozen: boolean; violations: readonly string[] }> {
  const ordered = nexoraObjectDirectorSceneCompositionCertificationRegistry.every((entry, index) => entry.order === index && entry.section === registryData[index][0]), sections = nexoraObjectDirectorSceneCompositionCertificationRegistry.map((entry) => entry.section), uniqueEntries = unique(sections), countValid = nexoraObjectDirectorSceneCompositionCertificationRegistryCount === 18, publicApis = registryData[13][1], publicApisValid = publicApis.length === 9 && unique(publicApis) && nexoraObjectDirectorSceneCompositionCertificationPrimaryPublicApiCount === 5, capabilitiesValid = nexoraObjectDirectorSceneCompositionCertificationCapabilityCount === 30 && unique(nexoraObjectDirectorSceneCompositionCertificationCapabilities), requirementsValid = sceneCompositionCertificationRequirementCount === requirementData.length && unique(sceneCompositionCertificationRequirements.map((requirement) => requirement.id)) && sceneCompositionCertificationRequirements.every((requirement) => requirement.required && requirement.blocking), upstreamValid = validationRegistryAttested, frozen = isNexoraObjectDirectorSceneCompositionCertificationRegistryFrozen(), checks = [[ordered, "Certification registry order is invalid"], [uniqueEntries, "Certification registry sections are duplicated"], [countValid, "Certification registry count is invalid"], [publicApisValid, "Certification public APIs are invalid"], [capabilitiesValid, "Certification capabilities are invalid"], [requirementsValid, "Certification requirements are invalid"], [upstreamValid, "Validation registry compatibility failed"], [frozen, "Certification registry is mutable"]] as const, violations = checks.filter(([passed]) => !passed).map(([, message]) => message);
  return freezeOwned({ valid: violations.length === 0, ordered, unique: uniqueEntries, countValid, publicApisValid, capabilitiesValid, requirementsValid, upstreamValid, frozen, violations: freezeOwned(violations) });
}
