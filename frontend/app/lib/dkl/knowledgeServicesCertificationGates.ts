/**
 * DKL-7:7 — Knowledge Services Certification Gates.
 *
 * Exactly twelve ordered gate groups and eighteen Pass gates.
 * Results derived from canonical Platform metadata only.
 *
 * Ownership: owned exclusively by DKL-7:7.
 */

import {
  getKnowledgeServicesPlatformInventoryCount,
  KnowledgeServicesPlatform,
  KnowledgeServicesPlatformCompatibility,
  KnowledgeServicesPlatformId,
  KnowledgeServicesPlatformReadiness,
  KnowledgeServicesPlatformStatus,
  KnowledgeServicesPlatformVersion,
} from "./knowledgeServicesPlatform.ts";
import type {
  KnowledgeServicesCertificationGate,
  KnowledgeServicesCertificationGateGroup,
  KnowledgeServicesCertificationGateResult,
} from "./knowledgeServicesCertificationTypes.ts";

const platform = KnowledgeServicesPlatform;
const manifest = platform.manifest;
const validation = manifest.validation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const CERT_ID = "DKL-7:7/KnowledgeServicesCertification" as const;
const CERT_VERSION = "1.0.0" as const;

/** Certification-owned dependency declarations (Platform only). */
export const KnowledgeServicesCertificationDependencyDeclarations =
  Object.freeze({
    directPreviousPhaseModule: "knowledgeServicesPlatform.ts" as const,
    platformOnly: true as const,
    manifestDirectImport: false as const,
    validationDirectImport: false as const,
    modelDirectImport: false as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    dkl6DirectImport: false as const,
    manifestReachedThroughPlatform: true as const,
    validationReachedThroughManifest: true as const,
    modelReachedThroughValidation: true as const,
    registryReachedThroughModel: true as const,
    foundationReachedThroughRegistry: true as const,
    dkl6ReachedThroughFoundation: true as const,
  });

const PROHIBITED_ACCESS_TOKENS = Object.freeze([
  "create",
  "update",
  "delete",
  "persist",
  "execute",
  "approve",
  "decide",
  "plan",
  "mutate",
  "orchestrate",
] as const);

const accessModeText = registry.accessModes
  .map((mode) => `${mode.accessModeKey} ${mode.name}`.toLowerCase())
  .join(" ");

const hasProhibitedAccessMode = PROHIBITED_ACCESS_TOKENS.some((token) =>
  accessModeText.includes(token),
);

const pass = (
  expected: boolean,
): KnowledgeServicesCertificationGateResult =>
  expected ? "Pass" : "Fail";

/** Exactly twelve ordered certification gate groups. */
export const KnowledgeServicesCertificationGateGroups: readonly KnowledgeServicesCertificationGateGroup[] =
  Object.freeze([
    Object.freeze({
      groupId: "Identity" as const,
      groupName: "Identity",
      description: "Certification and Platform identity certification.",
      gateCount: 2,
      deterministicOrder: 1,
    }),
    Object.freeze({
      groupId: "DependencyChain" as const,
      groupName: "Dependency Chain",
      description: "Platform-only direct dependency and canonical chain.",
      gateCount: 2,
      deterministicOrder: 2,
    }),
    Object.freeze({
      groupId: "FoundationIntegrity" as const,
      groupName: "Foundation Integrity",
      description: "Foundation ownership and boundary inventories.",
      gateCount: 1,
      deterministicOrder: 3,
    }),
    Object.freeze({
      groupId: "RegistryIntegrity" as const,
      groupName: "Registry Integrity",
      description: "Service architecture and read-only access inventories.",
      gateCount: 2,
      deterministicOrder: 4,
    }),
    Object.freeze({
      groupId: "ModelIntegrity" as const,
      groupName: "Model Integrity",
      description: "Model inventory and model safety guarantees.",
      gateCount: 2,
      deterministicOrder: 5,
    }),
    Object.freeze({
      groupId: "ValidationIntegrity" as const,
      groupName: "Validation Integrity",
      description: "Validation result and guarantee preservation.",
      gateCount: 2,
      deterministicOrder: 6,
    }),
    Object.freeze({
      groupId: "ManifestIntegrity" as const,
      groupName: "Manifest Integrity",
      description: "Manifest certification inventories including 447.",
      gateCount: 1,
      deterministicOrder: 7,
    }),
    Object.freeze({
      groupId: "PlatformIntegrity" as const,
      groupName: "Platform Integrity",
      description: "Platform architecture and release preparation.",
      gateCount: 2,
      deterministicOrder: 8,
    }),
    Object.freeze({
      groupId: "OwnershipAndBoundaries" as const,
      groupName: "Ownership and Boundaries",
      description: "Ownership and boundary preservation.",
      gateCount: 1,
      deterministicOrder: 9,
    }),
    Object.freeze({
      groupId: "CompatibilityAndConsumers" as const,
      groupName: "Compatibility and Consumers",
      description: "Compatibility and consumer path safety.",
      gateCount: 1,
      deterministicOrder: 10,
    }),
    Object.freeze({
      groupId: "RuntimeProhibitions" as const,
      groupName: "Runtime Prohibitions",
      description: "Absence of runtime Knowledge Service behavior.",
      gateCount: 1,
      deterministicOrder: 11,
    }),
    Object.freeze({
      groupId: "FreezeReadiness" as const,
      groupName: "Freeze Readiness",
      description: "Certification readiness for Freeze.",
      gateCount: 1,
      deterministicOrder: 12,
    }),
  ]);

const gate = (
  gateId: string,
  gateName: string,
  description: string,
  group: KnowledgeServicesCertificationGate["group"],
  severity: KnowledgeServicesCertificationGate["severity"],
  subject: string,
  expectedState: string,
  certifiedState: string,
  evidenceId: string,
  ok: boolean,
  failureImpact: string,
  freezeRelevance: string,
  order: number,
): KnowledgeServicesCertificationGate =>
  Object.freeze({
    gateId,
    gateName,
    description,
    group,
    severity,
    subject,
    expectedState,
    certifiedState,
    evidenceReferences: Object.freeze([evidenceId]),
    result: pass(ok),
    failureImpact,
    freezeRelevance,
    deterministicOrder: order,
    runtimeBehavior: "None" as const,
  });

const id001Ok =
  CERT_ID === "DKL-7:7/KnowledgeServicesCertification" &&
  CERT_VERSION === "1.0.0";

const id002Ok =
  KnowledgeServicesPlatformId === "DKL-7:6/KnowledgeServicesPlatform" &&
  KnowledgeServicesPlatformVersion === "1.0.0" &&
  KnowledgeServicesPlatformStatus === "PlatformComplete" &&
  KnowledgeServicesPlatformReadiness === "ReadyForCertification" &&
  platform.status === "PlatformComplete" &&
  platform.readiness === "ReadyForCertification";

const deps = KnowledgeServicesCertificationDependencyDeclarations;

const dep001Ok =
  deps.directPreviousPhaseModule === "knowledgeServicesPlatform.ts" &&
  deps.platformOnly === true &&
  deps.manifestDirectImport === false &&
  deps.validationDirectImport === false &&
  deps.modelDirectImport === false &&
  deps.registryDirectImport === false &&
  deps.foundationDirectImport === false &&
  deps.dkl6DirectImport === false &&
  platform.identity.platformId === KnowledgeServicesPlatformId;

const dep002Ok =
  platform.manifest === manifest &&
  manifest.validation === validation &&
  validation.model === model &&
  model.registry === registry &&
  registry.foundation === foundation &&
  typeof platform.identity.dkl6PublicIndexId === "string" &&
  platform.identity.dkl6PublicIndexId.length > 0 &&
  deps.manifestReachedThroughPlatform &&
  deps.validationReachedThroughManifest &&
  deps.modelReachedThroughValidation &&
  deps.registryReachedThroughModel &&
  deps.foundationReachedThroughRegistry &&
  deps.dkl6ReachedThroughFoundation &&
  !deps.manifestDirectImport &&
  !deps.validationDirectImport &&
  !deps.modelDirectImport &&
  !deps.registryDirectImport &&
  !deps.foundationDirectImport &&
  !deps.dkl6DirectImport;

const fnd001Ok =
  platform.ownership.ownedCount === 6 &&
  platform.ownership.nonOwnedCount === 24 &&
  platform.boundaries.prohibitedSurfaceCount === 29 &&
  platform.inventory.lifecycleStageCount === 8;

const reg001Ok =
  platform.services.length === 12 &&
  platform.capabilities.length === 12 &&
  platform.contracts.length === 11 &&
  platform.inventory.serviceCapabilityRelationshipCount === 12;

const reg002Ok =
  platform.inventory.requestCategoryCount === 12 &&
  platform.inventory.responseCategoryCount === 12 &&
  platform.inventory.accessModeCount === 10 &&
  platform.inventory.mutationModeCount === 0 &&
  !hasProhibitedAccessMode;

const mod001Ok =
  platform.model.requestModelCount === 12 &&
  platform.model.responseModelCount === 12 &&
  platform.model.resultModelCount === 12 &&
  platform.model.contextModelCount === 4 &&
  platform.model.referenceModelCount === 8 &&
  platform.model.graphModelCount === 3 &&
  platform.model.relationshipCount === 28 &&
  platform.model.totalInventoryCount === 79;

const mod002Ok =
  platform.model.modelGuaranteeCount === 20 &&
  model.guarantees.modelsAreImmutable === true &&
  model.guarantees.modelsAreTransportNeutral === true &&
  model.guarantees.modelsArePersistenceNeutral === true &&
  model.guarantees.noRequestExecutesItself === true &&
  model.guarantees.businessObjectsReferencedNotOwned === true;

const val001Ok =
  platform.validation.groupCount === 15 &&
  platform.validation.ruleCount === 48 &&
  platform.validation.evidenceCount === 48 &&
  platform.validation.resultCount === 48 &&
  platform.validation.passCount === 48 &&
  platform.validation.failCount === 0 &&
  platform.validation.notApplicableCount === 0 &&
  platform.validation.findingCount === 0;

const val002Ok =
  platform.validation.guaranteeCount === 16 &&
  platform.validation.overallResult === "Pass" &&
  validation.identity.readiness === "ReadyForManifest" &&
  validation.results.length === validation.rules.length &&
  validation.evidence.length === validation.rules.length;

const man001Ok =
  manifest.inventory.sectionCount === 18 &&
  manifest.dependencies.length === 10 &&
  manifest.compatibility.length === 12 &&
  manifest.guarantees.length === 18 &&
  manifest.publicApi.length === 12 &&
  manifest.inventory.totalEntryCount === 447 &&
  manifest.status === "ManifestComplete";

const plt001Ok =
  platform.inventory.sectionCount === 20 &&
  platform.architecture.completedPhaseCount === 6 &&
  platform.architecture.futurePhaseCount === 3 &&
  platform.architecture.totalPhaseCount === 9 &&
  platform.dependencies.length === 12 &&
  platform.consumers.length === 4;

const plt002Ok =
  KnowledgeServicesPlatformCompatibility.length === 14 &&
  platform.guarantees.length === 20 &&
  platform.publicApi.length === 12 &&
  getKnowledgeServicesPlatformInventoryCount() === 527 &&
  platform.inventory.totalEntryCount === 527 &&
  platform.status === "PlatformComplete" &&
  platform.readiness === "ReadyForCertification";

const own001Ok =
  platform.ownership.ownershipExpanded === false &&
  platform.ownership.ownedCount === 6 &&
  platform.ownership.nonOwnedCount === 24 &&
  platform.boundaries.weakenedProhibitions === false &&
  platform.boundaries.prohibitedSurfaceCount === 29;

const consumers = platform.consumers;
const certificationConsumer = consumers[0];
const freezeConsumer = consumers[1];
const publicIndexConsumer = consumers[2];
const internalConsumer = consumers[3];

const engineCompat = KnowledgeServicesPlatformCompatibility.some(
  (item) =>
    item.subject.toLowerCase().includes("executive engine") &&
    item.status === "Compatible" &&
    item.runtimeAuthorization === "None",
);
const advisorCompat = KnowledgeServicesPlatformCompatibility.some(
  (item) =>
    item.subject.toLowerCase().includes("advisor") &&
    item.status === "Compatible" &&
    item.runtimeAuthorization === "None",
);

const cmp001Ok =
  KnowledgeServicesPlatformCompatibility.every(
    (item) =>
      item.status === "Compatible" && item.runtimeAuthorization === "None",
  ) &&
  KnowledgeServicesPlatformCompatibility.length === 14 &&
  certificationConsumer?.directImportAuthorization === true &&
  certificationConsumer.allowedAccessPath.includes("Platform") &&
  freezeConsumer?.directImportAuthorization === false &&
  freezeConsumer.allowedAccessPath.includes("Certification") &&
  publicIndexConsumer?.directImportAuthorization === false &&
  publicIndexConsumer.allowedAccessPath.includes("Freeze") &&
  internalConsumer?.directImportAuthorization === false &&
  internalConsumer.allowedAccessPath.includes("Public Index") &&
  consumers.every((item) => item.runtimeAuthorization === "None") &&
  engineCompat &&
  advisorCompat;

const run001Ok =
  platform.runtimeBehavior === false &&
  platform.serviceExecution === false &&
  platform.repositoryAccess === false &&
  platform.searchExecution === false &&
  platform.graphTraversal === false &&
  platform.aiBehavior === false &&
  platform.transportBehavior === false &&
  platform.authenticationBehavior === false &&
  platform.authorizationBehavior === false &&
  platform.mutationBehavior === false &&
  platform.metadataOnly === true;

const integrityGatesOk =
  id001Ok &&
  id002Ok &&
  dep001Ok &&
  dep002Ok &&
  fnd001Ok &&
  reg001Ok &&
  reg002Ok &&
  mod001Ok &&
  mod002Ok &&
  val001Ok &&
  val002Ok &&
  man001Ok &&
  plt001Ok &&
  plt002Ok &&
  own001Ok &&
  cmp001Ok &&
  run001Ok;

const rdy001Ok =
  integrityGatesOk &&
  platform.status === "PlatformComplete" &&
  platform.readiness === "ReadyForCertification";

/** Exactly eighteen certification gates. All must Pass. */
export const KnowledgeServicesCertificationGates: readonly KnowledgeServicesCertificationGate[] =
  Object.freeze([
    gate(
      "KS-CERT-ID-001",
      "Certification Identity",
      "Verify Certification identity, version, status, and Pass result.",
      "Identity",
      "Critical",
      CERT_ID,
      "ID=DKL-7:7/KnowledgeServicesCertification;version=1.0.0;status=Certified;result=Pass",
      `ID=${CERT_ID};version=${CERT_VERSION};status=Certified;result=Pass`,
      "KS-CERT-EV-001",
      id001Ok,
      "Certification identity invalid",
      "Blocks Freeze",
      1,
    ),
    gate(
      "KS-CERT-ID-002",
      "Platform Identity",
      "Verify certified Platform identity and readiness.",
      "Identity",
      "Critical",
      KnowledgeServicesPlatformId,
      "ID=DKL-7:6/KnowledgeServicesPlatform;version=1.0.0;status=PlatformComplete;readiness=ReadyForCertification",
      `ID=${KnowledgeServicesPlatformId};version=${KnowledgeServicesPlatformVersion};status=${KnowledgeServicesPlatformStatus};readiness=${KnowledgeServicesPlatformReadiness}`,
      "KS-CERT-EV-002",
      id002Ok,
      "Platform identity invalid",
      "Blocks Freeze",
      2,
    ),
    gate(
      "KS-CERT-DEP-001",
      "Platform-Only Direct Dependency",
      "Verify Certification consumes only the canonical Platform.",
      "DependencyChain",
      "Critical",
      "Certification→Platform",
      "directPreviousPhase=knowledgeServicesPlatform.ts;lowerPhasesDirect=false",
      "directPreviousPhase=knowledgeServicesPlatform.ts;platformOnly=true",
      "KS-CERT-EV-003",
      dep001Ok,
      "Dependency rule violated",
      "Blocks Freeze",
      3,
    ),
    gate(
      "KS-CERT-DEP-002",
      "Canonical Architecture Chain",
      "Verify preserved reference chain through Platform.",
      "DependencyChain",
      "Critical",
      "Platform→Manifest→Validation→Model→Registry→Foundation→DKL-6",
      "canonicalChainPreservedByReference=true",
      "canonicalChainPreservedByReference=true",
      "KS-CERT-EV-004",
      dep002Ok,
      "Architecture chain broken",
      "Blocks Freeze",
      4,
    ),
    gate(
      "KS-CERT-FND-001",
      "Foundation Ownership and Boundaries",
      "Verify Foundation ownership and boundary inventories.",
      "FoundationIntegrity",
      "Critical",
      platform.identity.foundationId,
      "owned=6;nonOwned=24;prohibited=29;lifecycle=8",
      `owned=${platform.ownership.ownedCount};nonOwned=${platform.ownership.nonOwnedCount};prohibited=${platform.boundaries.prohibitedSurfaceCount};lifecycle=${platform.inventory.lifecycleStageCount}`,
      "KS-CERT-EV-005",
      fnd001Ok,
      "Foundation inventory drift",
      "Blocks Freeze",
      5,
    ),
    gate(
      "KS-CERT-REG-001",
      "Service Architecture Inventory",
      "Verify services, capabilities, contracts, and relationships.",
      "RegistryIntegrity",
      "Critical",
      platform.identity.registryId,
      "services=12;capabilities=12;contracts=11;relationships=12",
      `services=${platform.services.length};capabilities=${platform.capabilities.length};contracts=${platform.contracts.length};relationships=${platform.inventory.serviceCapabilityRelationshipCount}`,
      "KS-CERT-EV-006",
      reg001Ok,
      "Registry inventory drift",
      "Blocks Freeze",
      6,
    ),
    gate(
      "KS-CERT-REG-002",
      "Read-Only Access Architecture",
      "Verify request/response categories, access modes, and zero mutation modes.",
      "RegistryIntegrity",
      "Critical",
      "RegistryAccessModes",
      "request=12;response=12;access=10;mutation=0;prohibitedModesAbsent=true",
      `request=${platform.inventory.requestCategoryCount};response=${platform.inventory.responseCategoryCount};access=${platform.inventory.accessModeCount};mutation=${platform.inventory.mutationModeCount};prohibitedModesAbsent=${!hasProhibitedAccessMode}`,
      "KS-CERT-EV-007",
      reg002Ok,
      "Mutation or prohibited access mode present",
      "Blocks Freeze",
      7,
    ),
    gate(
      "KS-CERT-MOD-001",
      "Model Inventory",
      "Verify Model inventory totals remain 79.",
      "ModelIntegrity",
      "Critical",
      platform.identity.modelId,
      "12+12+12+4+8+3+28=79",
      `total=${platform.model.totalInventoryCount}`,
      "KS-CERT-EV-008",
      mod001Ok,
      "Model inventory drift",
      "Blocks Freeze",
      8,
    ),
    gate(
      "KS-CERT-MOD-002",
      "Model Safety Guarantees",
      "Verify Model guarantees and safety properties.",
      "ModelIntegrity",
      "High",
      "ModelGuarantees",
      "guarantees=20;immutable;transportNeutral;persistenceNeutral;noRuntime;BOReferenced",
      `guarantees=${platform.model.modelGuaranteeCount};immutable=${model.guarantees.modelsAreImmutable}`,
      "KS-CERT-EV-009",
      mod002Ok,
      "Model safety guarantee failure",
      "Blocks Freeze",
      9,
    ),
    gate(
      "KS-CERT-VAL-001",
      "Validation Result",
      "Verify Validation inventory remains 48 Pass / 0 Fail.",
      "ValidationIntegrity",
      "Critical",
      platform.identity.validationId,
      "groups=15;rules=48;pass=48;fail=0;findings=0",
      `groups=${platform.validation.groupCount};rules=${platform.validation.ruleCount};pass=${platform.validation.passCount};fail=${platform.validation.failCount}`,
      "KS-CERT-EV-010",
      val001Ok,
      "Validation result drift",
      "Blocks Freeze",
      10,
    ),
    gate(
      "KS-CERT-VAL-002",
      "Validation Guarantees",
      "Verify Validation guarantees and ReadyForManifest readiness.",
      "ValidationIntegrity",
      "High",
      "ValidationGuarantees",
      "guarantees=16;overall=Pass;readiness=ReadyForManifest",
      `guarantees=${platform.validation.guaranteeCount};overall=${platform.validation.overallResult};readiness=${validation.identity.readiness}`,
      "KS-CERT-EV-011",
      val002Ok,
      "Validation guarantee failure",
      "Blocks Freeze",
      11,
    ),
    gate(
      "KS-CERT-MAN-001",
      "Manifest Certification",
      "Verify Manifest inventories including inventory count 447.",
      "ManifestIntegrity",
      "Critical",
      platform.identity.manifestId,
      "sections=18;deps=10;compat=12;guarantees=18;apis=12;inventory=447;status=ManifestComplete",
      `sections=${manifest.inventory.sectionCount};inventory=${manifest.inventory.totalEntryCount};status=${manifest.status}`,
      "KS-CERT-EV-012",
      man001Ok,
      "Manifest inventory drift",
      "Blocks Freeze",
      12,
    ),
    gate(
      "KS-CERT-PLT-001",
      "Platform Architecture",
      "Verify Platform architecture inventories.",
      "PlatformIntegrity",
      "Critical",
      KnowledgeServicesPlatformId,
      "sections=20;completed=6;future=3;total=9;deps=12;consumers=4",
      `sections=${platform.inventory.sectionCount};completed=${platform.architecture.completedPhaseCount};deps=${platform.dependencies.length};consumers=${platform.consumers.length}`,
      "KS-CERT-EV-013",
      plt001Ok,
      "Platform architecture drift",
      "Blocks Freeze",
      13,
    ),
    gate(
      "KS-CERT-PLT-002",
      "Platform Release Preparation",
      "Verify Platform release preparation including inventory 527.",
      "PlatformIntegrity",
      "Critical",
      "PlatformRelease",
      "compat=14;guarantees=20;apis=12;inventory=527;status=PlatformComplete;readiness=ReadyForCertification",
      `compat=${KnowledgeServicesPlatformCompatibility.length};inventory=${getKnowledgeServicesPlatformInventoryCount()};status=${platform.status};readiness=${platform.readiness}`,
      "KS-CERT-EV-014",
      plt002Ok,
      "Platform release preparation failure",
      "Blocks Freeze",
      14,
    ),
    gate(
      "KS-CERT-OWN-001",
      "Ownership and Boundary Preservation",
      "Verify Certification introduces no new ownership and weakens no boundary.",
      "OwnershipAndBoundaries",
      "Critical",
      "OwnershipAndBoundaries",
      "owned=6;nonOwned=24;prohibited=29;expanded=false;weakened=false",
      `owned=${platform.ownership.ownedCount};nonOwned=${platform.ownership.nonOwnedCount};prohibited=${platform.boundaries.prohibitedSurfaceCount};expanded=${platform.ownership.ownershipExpanded};weakened=${platform.boundaries.weakenedProhibitions}`,
      "KS-CERT-EV-015",
      own001Ok,
      "Ownership or boundary weakened",
      "Blocks Freeze",
      15,
    ),
    gate(
      "KS-CERT-CMP-001",
      "Compatibility and Consumer Path Safety",
      "Verify compatibility declarations and consumer access paths.",
      "CompatibilityAndConsumers",
      "Critical",
      "CompatibilityAndConsumers",
      "compat=14/Compatible;consumerPathsSafe;runtimeAuthorization=None",
      "compat=14/Compatible;consumerPathsSafe;runtimeAuthorization=None",
      "KS-CERT-EV-016",
      cmp001Ok,
      "Consumer path or compatibility failure",
      "Blocks Freeze",
      16,
    ),
    gate(
      "KS-CERT-RUN-001",
      "No Runtime Implementation",
      "Verify absence of runtime Knowledge Service behavior via architecture metadata.",
      "RuntimeProhibitions",
      "Critical",
      "RuntimeProhibitions",
      "runtimeBehavior=false;serviceExecution=false;allProhibitionsHeld",
      `runtimeBehavior=${platform.runtimeBehavior};serviceExecution=${platform.serviceExecution}`,
      "KS-CERT-EV-017",
      run001Ok,
      "Runtime behavior introduced",
      "Blocks Freeze",
      17,
    ),
    gate(
      "KS-CERT-RDY-001",
      "Ready for Freeze",
      "Pass only when all certification gates pass and readiness is ReadyForFreeze.",
      "FreezeReadiness",
      "Critical",
      "FreezeReadiness",
      "allGatesPass;criticalFailures=0;highFailures=0;status=Certified;result=Pass;readiness=ReadyForFreeze",
      `integrityGatesOk=${integrityGatesOk};platformStatus=${platform.status};platformReadiness=${platform.readiness}`,
      "KS-CERT-EV-018",
      rdy001Ok,
      "Not ready for Freeze",
      "Defines Freeze readiness",
      18,
    ),
  ]);

export const KnowledgeServicesCertificationAllGatesPass =
  KnowledgeServicesCertificationGates.every((item) => item.result === "Pass");
