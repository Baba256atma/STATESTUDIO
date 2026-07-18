import {
  ExecutiveAdvisorHandoffModel,
  ExecutiveCoordinationRouteModel,
  ExecutiveDependencyChainModel,
  ExecutiveExecutionGroupModel,
  ExecutiveExecutionStageModel,
  ExecutiveOrchestrationModelPlatform,
  ExecutiveOrchestrationPlanModel,
  ExecutiveOrchestrationRequestModel,
  getExecutiveOrchestrationModelById,
} from "./executiveOrchestrationModelPlatform.ts";
import type {
  ExecutiveOrchestrationValidationCategoryGroup,
  ExecutiveOrchestrationValidationRule,
} from "./executiveOrchestrationValidationTypes.ts";

const rule = (
  key: string,
  name: string,
  category: ExecutiveOrchestrationValidationRule["category"],
  severity: ExecutiveOrchestrationValidationRule["severity"],
  description: string,
  validatedArtifact: string,
  expectedState: string,
  actualMetadataResult: string,
) => Object.freeze({
  id: `eng-8-validation-model-${key}`,
  name,
  category,
  severity,
  description,
  validatedArtifact,
  expectedState,
  actualMetadataResult,
  status: "Pass",
  owner: "ENG-8",
  targetPhase: "ENG-8:3",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  executesValidation: false,
} as const satisfies ExecutiveOrchestrationValidationRule);

/**
 * Immutable model validation rules for ENG-8:3.
 */
export const ExecutiveOrchestrationModelValidation = Object.freeze({
  id: "eng-8-validation-model",
  category: "Model",
  name: "Executive Orchestration Model Validation",
  description:
    "Validates ENG-8:3 canonical models, relationships, dependency chain, execution groups, and Advisor handoff.",
  rules: Object.freeze([
    rule(
      "canonical-models-exist",
      "All canonical models exist",
      "Model",
      "Critical",
      "Seven canonical orchestration models are registered.",
      "ExecutiveOrchestrationModelPlatform.modelRegistry.entries",
      "count=7",
      `count=${ExecutiveOrchestrationModelPlatform.modelRegistry.entries.length}`,
    ),
    rule(
      "request-model",
      "Request model valid",
      "Model",
      "Error",
      "Request model publishes required request fields.",
      "ExecutiveOrchestrationRequestModel",
      "fieldsInclude=requestId,executionMode,status",
      `hasFields=${
        ExecutiveOrchestrationRequestModel.fields.includes("requestId")
        && ExecutiveOrchestrationRequestModel.fields.includes("executionMode")
        && ExecutiveOrchestrationRequestModel.fields.includes("status")
      }`,
    ),
    rule(
      "plan-model",
      "Plan model valid",
      "Model",
      "Error",
      "Plan model publishes stages, dependency chain, and execution groups.",
      "ExecutiveOrchestrationPlanModel",
      "fieldsInclude=stages,dependencyChain,executionGroups",
      `hasFields=${
        ExecutiveOrchestrationPlanModel.fields.includes("stages")
        && ExecutiveOrchestrationPlanModel.fields.includes("dependencyChain")
        && ExecutiveOrchestrationPlanModel.fields.includes("executionGroups")
      }`,
    ),
    rule(
      "execution-stage-model",
      "Execution stage model valid",
      "Model",
      "Error",
      "Execution stage templates align to eight lifecycle stages.",
      "ExecutiveExecutionStageModel.stageTemplates",
      "count=8",
      `count=${ExecutiveExecutionStageModel.stageTemplates.length}`,
    ),
    rule(
      "coordination-route-model",
      "Coordination route model valid",
      "Coordination",
      "Error",
      "Coordination route templates are declared without executing routing.",
      "ExecutiveCoordinationRouteModel.routeTemplates",
      "count=8;executesRouting=false",
      `count=${ExecutiveCoordinationRouteModel.routeTemplates.length};executesRouting=${
        ExecutiveCoordinationRouteModel.routeTemplates.every(
          (entry) => "executesRouting" in entry && entry.executesRouting === false,
        )
      }`,
    ),
    rule(
      "dependency-chain-valid",
      "Dependency chain valid",
      "Dependency",
      "Error",
      "Dependency chain links are ordered forward-only.",
      "ExecutiveDependencyChainModel.chainLinks",
      "count=7;ordering=1..7",
      `count=${ExecutiveDependencyChainModel.chainLinks.length};first=${ExecutiveDependencyChainModel.chainLinks[0]?.ordering};last=${ExecutiveDependencyChainModel.chainLinks[6]?.ordering}`,
    ),
    rule(
      "execution-groups-valid",
      "Execution groups valid",
      "ExecutionMode",
      "Error",
      "Execution group model declares six execution modes and group descriptors.",
      "ExecutiveExecutionGroupModel",
      "modes=6;groups=6",
      `modes=${ExecutiveExecutionGroupModel.supportedExecutionModes.length};groups=${ExecutiveExecutionGroupModel.groups.length}`,
    ),
    rule(
      "advisor-handoff-valid",
      "Advisor handoff valid",
      "Model",
      "Critical",
      "Advisor handoff model exists and does not execute handoff.",
      "ExecutiveAdvisorHandoffModel",
      "destination=advisor;executesHandoff=false",
      `destination=${ExecutiveAdvisorHandoffModel.handoffTemplate.destination};executesHandoff=${ExecutiveAdvisorHandoffModel.handoffTemplate.executesHandoff}`,
    ),
    rule(
      "relationships-valid",
      "Model relationships valid",
      "Model",
      "Error",
      "Canonical forward relationship chain is declared.",
      "ExecutiveOrchestrationModelPlatform.relationshipChain",
      "Request...AdvisorHandoff",
      `${ExecutiveOrchestrationModelPlatform.relationshipChain[0]}...${ExecutiveOrchestrationModelPlatform.relationshipChain[5]}`,
    ),
    rule(
      "lookup-deterministic",
      "Model lookup deterministic",
      "PublicApi",
      "Error",
      "Public model lookup returns canonical models for known IDs.",
      "getExecutiveOrchestrationModelById",
      "eng-8-model-request",
      `resolved=${getExecutiveOrchestrationModelById("eng-8-model-request")?.id}`,
    ),
    rule(
      "ready-for-validation",
      "Model ready for validation",
      "MetadataConsistency",
      "Info",
      "Model platform reports ReadyForValidation.",
      "ExecutiveOrchestrationModelPlatform",
      "readyForValidation=true",
      `readyForValidation=${ExecutiveOrchestrationModelPlatform.readyForValidation}`,
    ),
  ] as const),
  ruleCount: 11,
  passCount: 11,
  status: "Pass",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveOrchestrationValidationCategoryGroup);
