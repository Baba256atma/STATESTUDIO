/** WS-8:8 — Exactly eight immutable Certification-reachable baselines. */
import { WarRoomWorkspaceCertification } from "./warRoomWorkspaceCertification.ts";

const platform = WarRoomWorkspaceCertification.platform;
const manifest = platform.manifest;

export const WarRoomWorkspaceFrozenBaselines = Object.freeze([
  Object.freeze({ id: "WS-8:8/Baseline/01", name: "Foundation Baseline",
    source: manifest.inventory.foundationInventory }),
  Object.freeze({ id: "WS-8:8/Baseline/02", name: "Registry Baseline",
    source: manifest.inventory.registryInventory }),
  Object.freeze({ id: "WS-8:8/Baseline/03", name: "Model Baseline",
    source: manifest.inventory.modelInventory }),
  Object.freeze({ id: "WS-8:8/Baseline/04", name: "Validation Baseline",
    source: manifest.inventory.validationInventory }),
  Object.freeze({ id: "WS-8:8/Baseline/05", name: "Manifest Baseline",
    source: manifest }),
  Object.freeze({ id: "WS-8:8/Baseline/06", name: "Platform Baseline",
    source: platform }),
  Object.freeze({ id: "WS-8:8/Baseline/07", name: "Certification Baseline",
    source: WarRoomWorkspaceCertification }),
  Object.freeze({ id: "WS-8:8/Baseline/08", name: "Workspace Baseline",
    source: platform.composition.workspaceIdentity }),
] as const);
