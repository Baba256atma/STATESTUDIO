import { resolveMrpWorkspaceMountPlan } from "../ui/mrpWorkspace/mrpWorkspaceResolver.ts";
import { syncSceneObjectRegistry, resetSceneObjectRegistryForTests } from "../scene/objectRegistryRuntime.ts";
import type { SceneObject } from "../sceneTypes.ts";
import type { DataSourceRegistrySnapshot } from "./dataSourceRegistryContract.ts";
import {
  registerDataSource,
  resetDataSourceRegistryForTests,
  setDataSourceRegistryPersistenceAdapterForTests,
} from "./dataSourceRegistryRuntime.ts";
import {
  DATA_OBJECT_PIPELINE_COMPLETE_TAG,
  DS2_CERTIFIED_TAG,
} from "./dataSourceObjectAutoCreationContract.ts";
import {
  assignObjectTopology,
  createObjectsFromCandidates,
  detectSourceRelationships,
  isDuplicateObjectCandidate,
  resetDataSourceObjectAutoCreationForTests,
  runDataSourceObjectAutoCreation,
} from "./dataSourceObjectAutoCreationRuntime.ts";
import {
  DS_2_6_OBJECT_AUTO_CREATION_CERTIFICATION_TAG,
  DS2_CERTIFICATION_FREEZE_TAGS,
  type DataSourceObjectAutoCreationCertificationGate,
  type DataSourceObjectAutoCreationCertificationResult,
} from "./dataSourceObjectAutoCreationCertificationContract.ts";

function installMemoryAdapter(): void {
  let snapshot: DataSourceRegistrySnapshot | null = null;
  setDataSourceRegistryPersistenceAdapterForTests(
    Object.freeze({
      load: () => snapshot,
      save: (next) => {
        snapshot = next;
      },
      clear: () => {
        snapshot = null;
      },
    })
  );
}

function seedSupplierSource(): void {
  registerDataSource({
    sourceId: "source-supplier-csv",
    sourceName: "Supplier CSV",
    sourceType: "csv",
    recordCount: 3,
  });
}

function resetCertificationRuntime(): void {
  resetDataSourceRegistryForTests();
  resetDataSourceObjectAutoCreationForTests();
  resetSceneObjectRegistryForTests();
  installMemoryAdapter();
}

function gate(
  id: DataSourceObjectAutoCreationCertificationGate["id"],
  name: string,
  failures: readonly string[]
): DataSourceObjectAutoCreationCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

export function runDataSourceObjectAutoCreationCertification(): DataSourceObjectAutoCreationCertificationResult {
  resetCertificationRuntime();
  seedSupplierSource();

  const gates: DataSourceObjectAutoCreationCertificationGate[] = [];

  const pipeline = runDataSourceObjectAutoCreation({
    sourceId: "source-supplier-csv",
    explicitRecords: Object.freeze([
      Object.freeze({ label: "Acme Supplier" }),
      Object.freeze({ label: "North Supplier" }),
      Object.freeze({ label: "West Supplier" }),
    ]),
  });

  const discoveryFailures: string[] = [];
  if (!pipeline || pipeline.discovery.records.length !== 3) {
    discoveryFailures.push("Discovery did not return expected records");
  }
  gates.push(gate("A", "Discovery", discoveryFailures));

  const candidateFailures: string[] = [];
  if (!pipeline || pipeline.candidates.length !== 3) {
    candidateFailures.push("Candidate generation count mismatch");
  }
  gates.push(gate("B", "Candidate Generation", candidateFailures));

  const creationFailures: string[] = [];
  if (!pipeline || pipeline.creation.created.length !== 3) {
    creationFailures.push("Object creation count mismatch");
  }
  gates.push(gate("C", "Object Creation", creationFailures));

  const duplicateFailures: string[] = [];
  if (pipeline) {
    const duplicateRun = createObjectsFromCandidates(pipeline.candidates);
    if (duplicateRun.created.length !== 0 || duplicateRun.skippedDuplicates !== 3) {
      duplicateFailures.push("Duplicate protection failed");
    }
    if (pipeline.candidates.some((candidate) => !isDuplicateObjectCandidate(candidate))) {
      duplicateFailures.push("Duplicate fingerprints not retained");
    }
  } else {
    duplicateFailures.push("Pipeline unavailable");
  }
  gates.push(gate("D", "Duplicate Protection", duplicateFailures));

  const relationshipFailures: string[] = [];
  if (!pipeline || pipeline.relationships.length === 0) {
    relationshipFailures.push("Relationship detection returned no links");
  } else {
    const rel = detectSourceRelationships(pipeline.creation.created);
    if (rel.length === 0) relationshipFailures.push("Relationship resolver empty");
  }
  gates.push(gate("E", "Relationship Detection", relationshipFailures));

  const topologyFailures: string[] = [];
  if (!pipeline || pipeline.topology.length !== pipeline.creation.created.length) {
    topologyFailures.push("Topology assignment incomplete");
  } else {
    const topology = assignObjectTopology(pipeline.creation.created);
    if (topology.length !== pipeline.creation.created.length) {
      topologyFailures.push("Topology resolver incomplete");
    }
  }
  gates.push(gate("F", "Topology Assignment", topologyFailures));

  const sceneFailures: string[] = [];
  try {
    const sampleObjects: SceneObject[] = pipeline?.creation.created.map((object) => ({
      id: object.objectId,
      name: object.label,
      type: object.objectType,
    })) ?? [];
    syncSceneObjectRegistry(sampleObjects);
    syncSceneObjectRegistry(sampleObjects);
  } catch (error) {
    sceneFailures.push(`Scene registry sync failed: ${String(error)}`);
  }
  gates.push(gate("G", "No Scene Crashes", sceneFailures));

  const routingFailures: string[] = [];
  const sourcesPlan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "sources",
  });
  if (sourcesPlan.workspaceId !== "operational" || sourcesPlan.mountTarget !== "operational_workspace") {
    routingFailures.push("Sources dashboard routing regressed");
  }
  gates.push(gate("H", "No MRP Routing Issues", routingFailures));

  const legacyFailures: string[] = [];
  if (!pipeline || pipeline.usesLegacyRouter !== false) {
    legacyFailures.push("Pipeline reports legacy router usage");
  }
  gates.push(gate("I", "No Legacy Router Usage", legacyFailures));

  const freezeFailures: string[] = [];
  if (DS2_CERTIFIED_TAG !== "[DS2_CERTIFIED]") freezeFailures.push("DS2_CERTIFIED tag missing");
  if (DATA_OBJECT_PIPELINE_COMPLETE_TAG !== "[DATA_OBJECT_PIPELINE_COMPLETE]") {
    freezeFailures.push("DATA_OBJECT_PIPELINE_COMPLETE tag missing");
  }
  if (DS2_CERTIFICATION_FREEZE_TAGS.length !== 2) freezeFailures.push("Freeze tag registry incomplete");
  gates.push(gate("J", "Freeze Contracts Active", freezeFailures));

  const certified = gates.every((entry) => entry.status === "PASS");

  return Object.freeze({
    tag: DS_2_6_OBJECT_AUTO_CREATION_CERTIFICATION_TAG,
    version: "2.6.0",
    certified,
    gates: Object.freeze(gates),
    freezeTags: DS2_CERTIFICATION_FREEZE_TAGS,
  });
}
