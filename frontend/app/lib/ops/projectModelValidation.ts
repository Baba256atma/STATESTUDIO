import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ProjectPlatformMetadata } from "./projectMetadataIndex.ts";
import { buildProjectModelManifest } from "./projectModelManifest.ts";
import { ProjectDependencyModel } from "./projectDependencyModel.ts";
import { ProjectGovernanceModel } from "./projectGovernanceModel.ts";
import { ProjectIdentityModel } from "./projectIdentityModel.ts";
import { ProjectLifecycleModel } from "./projectLifecycleModel.ts";
import { ProjectMilestoneModel } from "./projectMilestoneModel.ts";
import { ProjectPhaseModel } from "./projectPhaseModel.ts";
import { ProjectPortfolioModel } from "./projectPortfolioModel.ts";
import { ProjectReadinessModel } from "./projectReadinessModel.ts";
import { ProjectTaskReferenceModel } from "./projectTaskReferenceModel.ts";
import { ProjectWorkflowReferenceModel } from "./projectWorkflowReferenceModel.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "project-model-completeness",
      name: "Model Completeness",
      status:
        ProjectReadinessModel.length === 2 &&
        ProjectIdentityModel.projectClassification.length === 7
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-identity-metadata-exists",
      name: "Identity Metadata Exists",
      status: ProjectIdentityModel.projectIdPattern.length > 0 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-lifecycle-metadata-exists",
      name: "Lifecycle Metadata Exists",
      status: ProjectLifecycleModel.lifecycleStages.length === 5 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-phase-metadata-exists",
      name: "Phase Metadata Exists",
      status: ProjectPhaseModel.length === 5 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-milestone-metadata-exists",
      name: "Milestone Metadata Exists",
      status: ProjectMilestoneModel.length === 3 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-dependency-metadata-exists",
      name: "Dependency Metadata Exists",
      status: ProjectDependencyModel.prerequisiteProjects.length >= 1 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-workflow-reference-metadata-exists",
      name: "Workflow Reference Metadata Exists",
      status: ProjectWorkflowReferenceModel.linkedWorkflows.length >= 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-task-reference-metadata-exists",
      name: "Task Reference Metadata Exists",
      status: ProjectTaskReferenceModel.linkedTasks.length >= 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-governance-metadata-exists",
      name: "Governance Metadata Exists",
      status: ProjectGovernanceModel.approvalMetadata.length >= 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-readiness-metadata-exists",
      name: "Readiness Metadata Exists",
      status: ProjectReadinessModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-portfolio-linkage-metadata-exists",
      name: "Portfolio Linkage Metadata Exists",
      status: ProjectPortfolioModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-manifest-builds",
      name: "Manifest Builds",
      status:
        Object.isFrozen(buildProjectModelManifest()) &&
        buildProjectModelManifest().compatibility.compatibilityVersion ===
          ProjectPlatformMetadata.compatibilityVersion
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-immutable-exports",
      name: "Immutable Exports",
      status:
        Object.isFrozen(ProjectIdentityModel) &&
        Object.isFrozen(ProjectLifecycleModel) &&
        Object.isFrozen(ProjectPhaseModel) &&
        Object.isFrozen(ProjectMilestoneModel) &&
        Object.isFrozen(ProjectDependencyModel) &&
        Object.isFrozen(ProjectWorkflowReferenceModel) &&
        Object.isFrozen(ProjectTaskReferenceModel) &&
        Object.isFrozen(ProjectGovernanceModel) &&
        Object.isFrozen(ProjectReadinessModel) &&
        Object.isFrozen(ProjectPortfolioModel)
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-deterministic-output",
      name: "Deterministic Output",
      status:
        JSON.stringify(buildProjectModelManifest()) ===
        JSON.stringify(buildProjectModelManifest())
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-ops-2-compatibility",
      name: "OPS-2 Compatibility",
      status:
        ProjectTaskReferenceModel.metadata.sourceDependencies.includes(
          ExecutiveTaskIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-ops-3-compatibility",
      name: "OPS-3 Compatibility",
      status:
        ProjectWorkflowReferenceModel.metadata.sourceDependencies.includes(
          ExecutiveWorkflowIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateProjectModel = () => {
  const checks = buildChecks();
  const passed = checks.filter((check) => check.status === "PASS").length;
  const failed = checks.length - passed;

  return Object.freeze({
    checks,
    summary: Object.freeze({
      total: checks.length,
      passed,
      failed,
      status: failed === 0 ? "PASS" : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};

