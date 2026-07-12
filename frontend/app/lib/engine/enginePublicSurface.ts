import * as foundationApi from "./engineIndex.ts";
import * as registryApi from "./engineRegistryIndex.ts";
import * as modelApi from "./engineModelIndex.ts";
import * as validationApi from "./engineValidationIndex.ts";
import type { ExecutiveEnginePublicSurfaceEntry } from "./engineManifestTypes.ts";

const category = (name: string): ExecutiveEnginePublicSurfaceEntry["category"] => {
  if (/Model|Request|Intent|Context|Plan|Decision|Outcome|Relationship/.test(name)) return "Model";
  if (/Validation/.test(name)) return "Validation";
  if (/Manifest/.test(name)) return "Manifest";
  if (/Summary/.test(name)) return "Summary";
  if (/Registry|Lifecycle|Capability|Dependency/.test(name)) return "Registry";
  if (/^get|^run/.test(name)) return "Helper";
  return "Metadata";
};
const entries = (api: object, sourcePhase: ExecutiveEnginePublicSurfaceEntry["sourcePhase"], offset: number) => Object.freeze(Object.keys(api).sort().map((exportName, index) => {
  return Object.freeze({ artifactId: `ENG-SURFACE-${String(offset + index + 1).padStart(3, "0")}`,
    exportName, sourcePhase, category: category(exportName), publicVisibility: true,
    runtimeInterface: false, metadataOnly: true, immutable: true,
  } as const satisfies ExecutiveEnginePublicSurfaceEntry);
}));

const foundation = entries(foundationApi, "ENG-1:1", 0);
const registry = entries(registryApi, "ENG-1:2", foundation.length);
const model = entries(modelApi, "ENG-1:3", foundation.length + registry.length);
const validation = entries(validationApi, "ENG-1:4", foundation.length + registry.length + model.length);
export const ExecutiveEnginePublicSurface = Object.freeze({
  artifactId: "ENG-SURFACE-001-CATALOG",
  foundation, registry, model, validation,
  all: Object.freeze([...foundation, ...registry, ...model, ...validation]),
  runtimeInterfacesIncluded: false, metadataOnly: true, immutable: true, deterministic: true,
} as const);
