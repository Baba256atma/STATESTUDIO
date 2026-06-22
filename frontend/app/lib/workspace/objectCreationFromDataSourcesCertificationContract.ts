/**
 * Legacy DS-1:7 facade — delegates to workspaceDataSourceCertification.
 */

export {
  DS17_CERTIFICATION_TAG,
  WORKSPACE_DATA_SOURCE_CERTIFICATION_TAGS as OBJECT_CREATION_FROM_DATA_SOURCES_CERTIFICATION_TAGS,
  WORKSPACE_DATA_SOURCE_CERTIFICATION_COMPLETE_DIAGNOSTIC as OBJECT_CREATION_FROM_DATA_SOURCES_COMPLETE_DIAGNOSTIC,
  type WorkspaceDataSourceCertificationGate as ObjectCreationFromDataSourcesGate,
  type WorkspaceDataSourceCertificationGateId as ObjectCreationFromDataSourcesGateId,
  type WorkspaceDataSourceCertificationScenario as ObjectCreationFromDataSourcesScenario,
  type WorkspaceDataSourceCertificationScenarioId as ObjectCreationFromDataSourcesScenarioId,
  type WorkspaceDataSourceCertificationInput as ObjectCreationFromDataSourcesCertificationInput,
  type WorkspaceDataSourceCertificationResult as ObjectCreationFromDataSourcesCertificationResult,
} from "./workspaceDataSourceCertificationContract.ts";
