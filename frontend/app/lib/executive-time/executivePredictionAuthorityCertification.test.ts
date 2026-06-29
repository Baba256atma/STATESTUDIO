import assert from "node:assert/strict";
import test from "node:test";

import { runExecutiveEventEngineCertification } from "./executiveEventCertification.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import {
  buildExecutivePredictionResultContract,
  EXECUTIVE_PREDICTION_OWNERSHIP_RULES,
  EXECUTIVE_PREDICTION_PUBLISHER_RULES,
  EXECUTIVE_PREDICTION_READONLY_DEPENDENCIES,
  requestPrediction,
  validateExecutivePredictionRequest,
} from "./executivePredictionAuthority.ts";
import {
  EXECUTIVE_PREDICTION_AUTHORITY_TAGS,
  EXECUTIVE_PREDICTION_AUTHORITY_MANIFEST,
  runExecutivePredictionAuthorityCertification,
} from "./executivePredictionAuthorityCertification.ts";
import { ExecutivePredictionExecutionDeferredError } from "./executivePredictionAuthorityTypes.ts";
import {
  ExecutivePredictionConsumerContractDeclaration,
  EXECUTIVE_PREDICTION_CONSUMER_RULES,
  receivePredictionResult,
} from "./executivePredictionConsumerContract.ts";
import {
  ExecutivePredictionPublisherContractDeclaration,
  validateExecutivePredictionPublisherRequest,
} from "./executivePredictionRequestContract.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const baseRequest = Object.freeze({
  id: "pred-req-001",
  predictionType: "conflict_detection" as const,
  entityType: "decision" as const,
  entityId: "decision-001",
  workspaceId: "ws-prediction-auth",
  requestedBy: "executive",
  predictionContext: "Decision conflict probe",
  predictionScope: "entity" as const,
  currentTimeContext: "this_week" as const,
  currentCameraContext: "this_week" as const,
  metadata: Object.freeze({ source: "certification" }),
});

test("validates and normalizes immutable prediction requests", () => {
  const validation = validateExecutivePredictionRequest(baseRequest);
  assert.equal(validation.valid, true);
  assert.equal(Object.isFrozen(validation.normalizedRequest), true);
  assert.equal(validation.normalizedRequest?.id, baseRequest.id);
  assert.throws(() => {
    if (validation.normalizedRequest) {
      (validation.normalizedRequest as { id: string }).id = "changed";
    }
  });
});

test("builds immutable prediction result contracts", () => {
  const result = buildExecutivePredictionResultContract({
    predictionId: "pred-result-001",
    explanation: "Template only.",
    assumptions: Object.freeze(["Temporal context is stable."]),
  });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.assumptions), true);
  assert.equal(result.metadata.contractOnly, true);
});

test("validates publisher requests without generating predictions", () => {
  assert.equal(validateExecutivePredictionPublisherRequest(baseRequest).valid, true);
  assert.equal(ExecutivePredictionPublisherContractDeclaration.mayStorePrediction, false);
  assert.equal(EXECUTIVE_PREDICTION_PUBLISHER_RULES.mayGeneratePrediction, false);
});

test("defers valid prediction requests to APP-1:8", () => {
  assert.throws(() => requestPrediction(baseRequest), ExecutivePredictionExecutionDeferredError);
});

test("rejects invalid requests without producing results", () => {
  const rejected = requestPrediction({ ...baseRequest, entityId: "" });
  assert.equal(rejected.rejected, true);
  assert.equal(rejected.result, null);
  assert.equal(rejected.publisherMayStore, false);
});

test("consumes prediction results read-only", () => {
  const result = buildExecutivePredictionResultContract({ predictionId: "pred-result-002" });
  const consumption = receivePredictionResult(result);
  assert.equal(consumption.received, true);
  assert.equal(consumption.mutated, false);
  assert.equal(ExecutivePredictionConsumerContractDeclaration.mayGeneratePrediction, false);
});

test("enforces ownership separation", () => {
  assert.ok(EXECUTIVE_PREDICTION_OWNERSHIP_RULES.authorityOwns.includes("prediction_contracts"));
  assert.ok(EXECUTIVE_PREDICTION_OWNERSHIP_RULES.engineOwns.includes("prediction_generation"));
  assert.ok(EXECUTIVE_PREDICTION_OWNERSHIP_RULES.publisherOwns.includes("request_generation"));
  assert.ok(EXECUTIVE_PREDICTION_OWNERSHIP_RULES.consumerOwns.includes("read_only_consumption"));
  assert.equal(EXECUTIVE_PREDICTION_CONSUMER_RULES.mayMutateResult, false);
});

test("documents read-only upstream dependencies", () => {
  assert.equal(EXECUTIVE_PREDICTION_READONLY_DEPENDENCIES.context.mutationPermitted, false);
  assert.equal(EXECUTIVE_PREDICTION_READONLY_DEPENDENCIES.priority.mutationPermitted, false);
  assert.equal(EXECUTIVE_PREDICTION_READONLY_DEPENDENCIES.eventEngine.mutationPermitted, false);
});

test("manifest blocks UI paths", () => {
  assert.equal(validateStageManifest(EXECUTIVE_PREDICTION_AUTHORITY_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_PREDICTION_AUTHORITY_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed,
    false
  );
});

test("APP-1:7 event engine still certifies", () => {
  assert.equal(runExecutiveEventEngineCertification().certified, true);
});

test("prediction authority certification passes all gates", () => {
  const result = runExecutivePredictionAuthorityCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  for (const tag of EXECUTIVE_PREDICTION_AUTHORITY_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
});
