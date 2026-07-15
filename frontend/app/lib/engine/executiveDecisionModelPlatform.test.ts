import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import * as publicApi from "./executiveDecisionModelPlatform.ts";
import {
  ExecutiveDecisionAlternativeModels,
  ExecutiveDecisionConfidenceRiskModels,
  ExecutiveDecisionCoreModel,
  ExecutiveDecisionModelPlatform,
  ExecutiveDecisionModelRegistry,
  ExecutiveDecisionRecommendationPublicationModels,
  ExecutiveDecisionTraceModel,
  ExecutiveDecisionTradeoffImpactModels,
  getExecutiveDecisionModelById,
  getExecutiveDecisionModelMetadata,
  getExecutiveDecisionModelPlatform,
  getExecutiveDecisionModelRegistry,
  getExecutiveDecisionModelSummary,
  isExecutiveDecisionModelId,
} from "./executiveDecisionModelPlatform.ts";
import { ExecutiveDecisionFoundation } from "./executiveDecisionPublicApi.ts";
import {
  ExecutiveDecisionDomainRegistry,
  ExecutiveDecisionLifecycleRegistry,
  ExecutiveDecisionOutputRegistry,
  ExecutiveDecisionRegistryMetadata,
  ExecutiveDecisionTypeRegistry,
} from "./executiveDecisionRegistryPlatform.ts";

const requiredFiles = Object.freeze([
  "executiveDecisionModelTypes.ts",
  "executiveDecisionCoreModel.ts",
  "executiveDecisionAlternativeModel.ts",
  "executiveDecisionConfidenceRiskModel.ts",
  "executiveDecisionTradeoffImpactModel.ts",
  "executiveDecisionTraceModel.ts",
  "executiveDecisionRecommendationPublicationModel.ts",
  "executiveDecisionModelPlatform.ts",
  "executiveDecisionModelPlatform.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveDecisionModelPlatform",
  "ExecutiveDecisionModelRegistry",
  "ExecutiveDecisionCoreModel",
  "ExecutiveDecisionAlternativeModels",
  "ExecutiveDecisionConfidenceRiskModels",
  "ExecutiveDecisionTradeoffImpactModels",
  "ExecutiveDecisionTraceModel",
  "ExecutiveDecisionRecommendationPublicationModels",
] as const);

test("exactly nine required ENG-7:3 files are represented", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 9);
});

test("publishes exactly eight approved public model exports", () => {
  for (const name of approvedExports) {
    assert.ok(Object.hasOwn(publicApi, name));
  }
  assert.equal(approvedExports.length, 8);
});

test("consumes ENG-7:1 and ENG-7:2 only through approved public surfaces", () => {
  assert.equal(ExecutiveDecisionModelPlatform.consumedSurfaces.foundation, "executiveDecisionPublicApi.ts");
  assert.equal(ExecutiveDecisionModelPlatform.consumedSurfaces.registry, "executiveDecisionRegistryPlatform.ts");
  assert.equal(ExecutiveDecisionModelPlatform.consumedSurfaces.foundationId, ExecutiveDecisionFoundation.id);
  assert.equal(ExecutiveDecisionModelPlatform.consumedSurfaces.registryPlatformId, ExecutiveDecisionRegistryMetadata.id);
  const source = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "executiveDecisionModelPlatform.ts"),
    "utf8",
  );
  assert.equal(source.includes("executiveDecisionPublicApi.ts"), true);
  assert.equal(source.includes("executiveDecisionRegistryPlatform.ts"), true);
  assert.equal(source.includes("executiveDecisionFoundation.ts"), false);
  assert.equal(source.includes("executiveDecisionDomainRegistry.ts"), false);
});

test("exactly ten canonical model descriptors are registered and unique", () => {
  assert.equal(ExecutiveDecisionModelRegistry.entries.length, 10);
  assert.equal(ExecutiveDecisionModelPlatform.models.length, 10);
  assert.deepEqual(ExecutiveDecisionModelRegistry.entries.map(({ name }) => name), [
    "ExecutiveDecision",
    "ExecutiveDecisionAlternative",
    "ExecutiveDecisionAlternativeSet",
    "ExecutiveDecisionConfidence",
    "ExecutiveDecisionRiskProfile",
    "ExecutiveDecisionTradeoffProfile",
    "ExecutiveDecisionImpactProfile",
    "ExecutiveDecisionTrace",
    "ExecutiveRecommendationPackage",
    "ExecutiveDecisionPublicationMetadata",
  ]);
  const ids = ExecutiveDecisionModelPlatform.models.map(({ id }) => id);
  assert.equal(new Set(ids).size, 10);
  assert.equal(Object.isFrozen(ExecutiveDecisionModelPlatform), true);
  assert.equal(ExecutiveDecisionModelPlatform.models.every(Object.isFrozen), true);
});

test("core decision and alternative model fields are complete", () => {
  assert.ok(ExecutiveDecisionCoreModel.fields.includes("decisionId"));
  assert.ok(ExecutiveDecisionCoreModel.fields.includes("decisionType"));
  assert.ok(ExecutiveDecisionCoreModel.fields.includes("selectedAlternativeReference"));
  assert.ok(ExecutiveDecisionCoreModel.fields.includes("confidenceReference"));
  assert.ok(ExecutiveDecisionCoreModel.fields.includes("publicationMetadataReference"));
  assert.equal(ExecutiveDecisionCoreModel.compatibleDecisionTypes.length, ExecutiveDecisionTypeRegistry.length);
  assert.equal(ExecutiveDecisionCoreModel.compatibleDomains.length, ExecutiveDecisionDomainRegistry.length);
  assert.equal(ExecutiveDecisionCoreModel.compatibleLifecycleStates.length, ExecutiveDecisionLifecycleRegistry.length);

  assert.ok(ExecutiveDecisionAlternativeModels.alternative.fields.includes("rankPositionMetadata"));
  assert.ok(ExecutiveDecisionAlternativeModels.alternativeSet.fields.includes("selectedAlternativeReference"));
  assert.ok(ExecutiveDecisionAlternativeModels.alternativeSet.fields.includes("rejectedAlternativeReferences"));
});

test("confidence, risk, tradeoff, and impact models prohibit calculations", () => {
  assert.ok(ExecutiveDecisionConfidenceRiskModels.confidence.prohibitedCalculations.includes("confidence score computation"));
  assert.ok(ExecutiveDecisionConfidenceRiskModels.riskProfile.prohibitedCalculations.includes("residual risk calculation"));
  assert.ok(ExecutiveDecisionTradeoffImpactModels.tradeoffProfile.prohibitedCalculations.includes("tradeoff comparison"));
  assert.ok(ExecutiveDecisionTradeoffImpactModels.impactProfile.prohibitedCalculations.includes("impact propagation"));
  assert.equal(ExecutiveDecisionConfidenceRiskModels.confidence.metadataOnly, true);
  assert.equal(ExecutiveDecisionTradeoffImpactModels.impactProfile.metadataOnly, true);
});

test("trace lineage and recommendation consumers are complete", () => {
  assert.deepEqual([...ExecutiveDecisionTraceModel.relationshipChain], [
    "Request Reference",
    "Intent Reference",
    "Resolved Intent Reference",
    "Context Reference",
    "Plan Reference",
    "Reasoning Outcome References",
    "Alternative Set",
    "Executive Decision",
  ]);
  assert.ok(ExecutiveDecisionTraceModel.decisionAttachments.includes("Confidence"));
  assert.ok(ExecutiveDecisionTraceModel.prohibitedBehaviors.includes("reasoning reconstruction"));
  assert.deepEqual(
    [...ExecutiveDecisionRecommendationPublicationModels.recommendationPackage.targetConsumers],
    ["ENG-8", "Advisor"],
  );
  assert.ok(
    ExecutiveDecisionRecommendationPublicationModels.recommendationPackage.prohibitedBehaviors.includes(
      "Advisor message generation",
    ),
  );
  assert.ok(
    ExecutiveDecisionRecommendationPublicationModels.publicationMetadata.fields.includes("publishedOutputTypes"),
  );
  assert.equal(
    ExecutiveDecisionRecommendationPublicationModels.publicationMetadata.publishedOutputTypes.length,
    ExecutiveDecisionOutputRegistry.length,
  );
});

test("registry references resolve and lookups are deterministic", () => {
  for (const model of ExecutiveDecisionModelPlatform.models) {
    for (const dependencyId of model.registryDependencies) {
      const resolved =
        ExecutiveDecisionDomainRegistry.some(({ id }) => id === dependencyId)
        || ExecutiveDecisionTypeRegistry.some(({ id }) => id === dependencyId)
        || ExecutiveDecisionLifecycleRegistry.some(({ id }) => id === dependencyId)
        || ExecutiveDecisionOutputRegistry.some(({ id }) => id === dependencyId);
      assert.equal(resolved, true, `Unresolved registry dependency ${dependencyId} on ${model.id}`);
    }
  }
  assert.equal(getExecutiveDecisionModelById(ExecutiveDecisionCoreModel.id), ExecutiveDecisionCoreModel);
  assert.equal(getExecutiveDecisionModelById("missing"), undefined);
  assert.equal(isExecutiveDecisionModelId(ExecutiveDecisionCoreModel.id), true);
  assert.equal(isExecutiveDecisionModelId("missing"), false);
  assert.equal(getExecutiveDecisionModelPlatform(), ExecutiveDecisionModelPlatform);
  assert.equal(getExecutiveDecisionModelRegistry(), ExecutiveDecisionModelRegistry);
  assert.equal(getExecutiveDecisionModelMetadata().id, "ENG-7:3");
});

test("model summary and guarantees report ReadyForDecisionValidation", () => {
  const summary = getExecutiveDecisionModelSummary();
  assert.equal(summary.modelCount, 10);
  assert.equal(summary.registryEntryCount, 10);
  assert.equal(summary.relationshipStepCount, 8);
  assert.equal(summary.status, "Stable");
  assert.equal(summary.architectureMode, "MetadataOnly");
  assert.equal(summary.immutability, "DeeplyFrozen");
  assert.equal(summary.ownershipStatus, "OwnershipProtected");
  assert.equal(summary.dependencyStatus, "DependencySafe");
  assert.equal(summary.antiDuplicationStatus, "AntiDuplicationCompliant");
  assert.equal(summary.readiness, "ReadyForDecisionValidation");
  assert.equal(ExecutiveDecisionModelPlatform.guarantees.readiness, "ReadyForDecisionValidation");
  assert.ok(ExecutiveDecisionModelPlatform.ownership.neverOwns.includes("alternative ranking"));
  assert.ok(ExecutiveDecisionModelPlatform.ownership.neverOwns.includes("confidence calculation"));
});

test("no runtime, BUS, OPS, UI, Scene, persistence, or calculation surfaces", () => {
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Scorer|Selector|Ranker|Executor|LLM|OpenAI|Query|Reflect|Runner|Calculator/i.test(name)
    )),
    true,
  );
  const source = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "executiveDecisionModelPlatform.ts"),
    "utf8",
  );
  assert.equal(/from ["'].*\/(bus|ops|scene|eve|ui|persistence|database)/i.test(source), false);
});
