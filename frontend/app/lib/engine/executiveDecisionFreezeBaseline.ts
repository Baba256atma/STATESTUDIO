import { ExecutiveDecisionFreezeRegistry } from "./executiveDecisionFreezeRegistry.ts";
import type {
  ExecutiveDecisionFreezeBaseline as ExecutiveDecisionFreezeBaselineDescriptor,
} from "./executiveDecisionFreezeTypes.ts";

/**
 * Canonical immutable freeze baseline for ENG-7.
 * Values are declared architectural constants, not discovered.
 */
export const ExecutiveDecisionFreezeBaseline = Object.freeze({
  phaseCount: 7,
  componentCount: 7,
  representedFileCount: 54,
  approvedPublicExportCount: 47,
  foundationCapabilityCount: 8,
  decisionDomainCount: 12,
  decisionTypeCount: 16,
  decisionCapabilityCount: 8,
  decisionOutputCount: 8,
  lifecycleStateCount: 8,
  canonicalModelCount: 10,
  validationCategoryCount: 8,
  validationSeverityCount: 4,
  validationRuleCount: 32,
  passingValidationRuleCount: 32,
  failingValidationRuleCount: 0,
  compatibilityDeclarationCount: 10,
  architecturalGuaranteeCount: 12,
  certificationGateCount: 15,
  passingCertificationGateCount: 15,
  regressionDeclarationCount: 10,
  passingRegressionDeclarationCount: 10,
  ownershipConflictCount: 0,
  dependencyViolationCount: 0,
  publicApiLeakCount: 0,
  immutabilityViolationCount: 0,
  runtimeBehaviorViolationCount: 0,
  antiDuplicationViolationCount: 0,
  compatibilityFailureCount: 0,
  regressionFailureCount: 0,
  preserved: Object.freeze({
    namespaces: Object.freeze([
      "Nexora.Engine.ExecutiveDecision.Foundation",
      "Nexora.Engine.ExecutiveDecision.Registry",
      "Nexora.Engine.ExecutiveDecision.Model",
      "Nexora.Engine.ExecutiveDecision.Validation",
      "Nexora.Engine.ExecutiveDecision.Manifest",
      "Nexora.Engine.ExecutiveDecision.Platform",
      "Nexora.Engine.ExecutiveDecision.Certification",
      "Nexora.Engine.ExecutiveDecision.Freeze",
    ] as const),
    identifiers: Object.freeze(
      ExecutiveDecisionFreezeRegistry.map(({ id }) => id),
    ),
    approvedExportCounts: Object.freeze(
      ExecutiveDecisionFreezeRegistry.map(({ approvedPublicExportCount }) =>
        approvedPublicExportCount
      ),
    ),
    componentOrder: Object.freeze([
      "foundation",
      "registry",
      "model",
      "validation",
      "manifest",
      "platform",
      "certification",
    ] as const),
    phaseLineage: Object.freeze([
      "ENG-7:1",
      "ENG-7:2",
      "ENG-7:3",
      "ENG-7:4",
      "ENG-7:5",
      "ENG-7:6",
      "ENG-7:7",
      "ENG-7:8",
    ] as const),
    ownershipBoundaries: "Locked",
    dependencyDirection: "ForwardOnly",
    compatibilityRelationships: "Protected",
    validationState: "32/32 PASS",
    certificationState: "15/15 PASS",
    metadataOnlyStatus: "MetadataOnly",
    runtimeFreeStatus: "RuntimeFree",
  } as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionFreezeBaselineDescriptor & {
  readonly preserved: Readonly<{
    namespaces: readonly string[];
    identifiers: readonly string[];
    approvedExportCounts: readonly number[];
    componentOrder: readonly string[];
    phaseLineage: readonly string[];
    ownershipBoundaries: string;
    dependencyDirection: string;
    compatibilityRelationships: string;
    validationState: string;
    certificationState: string;
    metadataOnlyStatus: string;
    runtimeFreeStatus: string;
  }>;
});
