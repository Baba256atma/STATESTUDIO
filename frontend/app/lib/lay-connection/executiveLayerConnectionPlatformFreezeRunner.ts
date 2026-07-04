import { runExecutiveLayerConnectionCertification } from "./executiveLayerConnectionPlatformCertification.ts";
import { runExecutiveLayerConnectionRegression } from "./executiveLayerConnectionPlatformRegression.ts";
import type { ExecutiveLayerConnectionFreezeState } from "./executiveLayerConnectionPlatformFreezeTypes.ts";

const DECLARATION = "The Executive Layer Connection Platform is Certified, Frozen, and Released.";

export function getExecutiveLayerConnectionFreezeState(): ExecutiveLayerConnectionFreezeState {
  const certification = runExecutiveLayerConnectionCertification();
  const regression = runExecutiveLayerConnectionRegression();
  const frozen = certification.status === "PASS" && regression.status === "PASS";

  return Object.freeze({
    platformId: "executive-layer-connection-platform-freeze",
    status: frozen ? "Frozen" : "Not Frozen",
    certificationStatus: certification.status,
    regressionStatus: regression.status,
    immutable: frozen,
    declaration: DECLARATION,
  });
}

export function runExecutiveLayerConnectionFreeze(): ExecutiveLayerConnectionFreezeState {
  return getExecutiveLayerConnectionFreezeState();
}
