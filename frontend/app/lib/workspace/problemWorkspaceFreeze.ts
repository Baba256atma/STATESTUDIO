/** WS-6:8 — Canonical frozen Platform surface for Public Index. */
import { ProblemWorkspaceCertification } from "./problemWorkspaceCertification.ts";
import { ProblemWorkspaceFreezeCompatibility } from "./problemWorkspaceFreezeCompatibility.ts";
import { ProblemWorkspaceFreezeGuarantees } from "./problemWorkspaceFreezeGuarantees.ts";
import { ProblemWorkspaceFreezeIdentity } from "./problemWorkspaceFreezeIdentity.ts";
import { ProblemWorkspaceFreezeLock } from "./problemWorkspaceFreezeLock.ts";
import { ProblemWorkspaceFreezePublicApi } from "./problemWorkspaceFreezePublicApi.ts";
import { ProblemWorkspaceFrozenBaselines } from "./problemWorkspaceFrozenBaselines.ts";

export const ProblemWorkspaceFreezeMetadata = Object.freeze({
  identity: ProblemWorkspaceFreezeIdentity,
  workspaceIdentity:
    ProblemWorkspaceCertification.platform.composition.workspaceIdentity,
  canonicalNamespace: ProblemWorkspaceFreezeIdentity.namespace,
  version: ProblemWorkspaceFreezeIdentity.version,
  layer: ProblemWorkspaceFreezeIdentity.layer,
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForPublicIndex",
  architectureChain: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
    "Certification",
    "Freeze",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);

export const ProblemWorkspaceFreeze = Object.freeze({
  identity: ProblemWorkspaceFreezeIdentity,
  certification: ProblemWorkspaceCertification,
  metadata: ProblemWorkspaceFreezeMetadata,
  lock: ProblemWorkspaceFreezeLock,
  baselines: ProblemWorkspaceFrozenBaselines,
  compatibility: ProblemWorkspaceFreezeCompatibility,
  guarantees: ProblemWorkspaceFreezeGuarantees,
  publicApi: ProblemWorkspaceFreezePublicApi,
  responsibilities: Object.freeze([
    "Freeze Certified Architecture",
    "Preserve Canonical Identities",
    "Preserve Platform Composition",
    "Preserve Dependency Chain",
    "Preserve Architectural Guarantees",
    "Preserve Certification Results",
    "Preserve Public Metadata",
    "Preserve Compatibility Declarations",
    "Preserve Canonical Exports",
    "Publish Immutable Release Baseline",
  ]),
  status: "ReadyForPublicIndex",
  release: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  stability: "Stable",
  readiness: "ReadyForPublicIndex",
  upstreamDependencies: Object.freeze([
    "WS-6:7 Problem Workspace Certification",
  ]),
  publicApiSurface: ProblemWorkspaceFreezePublicApi,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  validationExecution: false,
  aiReasoning: false,
  problemSolving: false,
  rootCauseAnalysis: false,
  decisionGeneration: false,
  scenarioGeneration: false,
  orchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
