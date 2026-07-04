import { getExecutiveLayerConnectionCompatibilityMatrix } from "./executiveLayerConnectionPlatformCompatibility.ts";
import {
  EXECUTIVE_LAYER_CONNECTION_EXTENSION_POLICY,
  EXECUTIVE_LAYER_CONNECTION_PHASE_REGISTRY,
  EXECUTIVE_LAYER_CONNECTION_PUBLIC_API_REGISTRY,
  EXECUTIVE_LAYER_CONNECTION_RELEASE_METADATA,
} from "./executiveLayerConnectionPlatformFreezeRegistry.ts";
import { runExecutiveLayerConnectionRegression } from "./executiveLayerConnectionPlatformRegression.ts";
import type { ExecutiveLayerConnectionCertificationGate, ExecutiveLayerConnectionCertificationResult } from "./executiveLayerConnectionPlatformFreezeTypes.ts";

function gate(gateId: string, passed: boolean, diagnostics: readonly string[] = Object.freeze([])): ExecutiveLayerConnectionCertificationGate {
  return Object.freeze({ gateId, passed, diagnostics: Object.freeze([...diagnostics]) });
}

export function runExecutiveLayerConnectionCertification(): ExecutiveLayerConnectionCertificationResult {
  const compatibility = getExecutiveLayerConnectionCompatibilityMatrix();
  const regression = runExecutiveLayerConnectionRegression();
  const policy = EXECUTIVE_LAYER_CONNECTION_EXTENSION_POLICY;

  const gates = Object.freeze([
    gate("all-eleven-phases-present", EXECUTIVE_LAYER_CONNECTION_PHASE_REGISTRY.length === 11),
    gate("registry-integrity", EXECUTIVE_LAYER_CONNECTION_PHASE_REGISTRY.every((phase) => phase.required && phase.certified)),
    gate("compatibility-integrity", compatibility.length === 11 && compatibility.every((entry) => entry.compatible)),
    gate("public-api-integrity", EXECUTIVE_LAYER_CONNECTION_PUBLIC_API_REGISTRY.length === 10 && EXECUTIVE_LAYER_CONNECTION_PUBLIC_API_REGISTRY.every((api) => api.stable)),
    gate("dependency-integrity", compatibility.every((entry) => entry.required && entry.mode === "certified")),
    gate("extension-policy-integrity", !policy.certifiedPhaseMutationAllowed && !policy.runtimeBehaviorAllowed && !policy.orchestrationAllowed && !policy.executionLogicAllowed),
    gate("release-metadata-integrity", EXECUTIVE_LAYER_CONNECTION_RELEASE_METADATA.metadataOnly && EXECUTIVE_LAYER_CONNECTION_RELEASE_METADATA.immutable),
    gate("platform-identity-integrity", EXECUTIVE_LAYER_CONNECTION_RELEASE_METADATA.platformId === "executive-layer-connection-platform-freeze"),
    gate("regression-integrity", regression.status === "PASS", regression.diagnostics),
    gate("freeze-readiness", regression.status === "PASS" && compatibility.every((entry) => entry.compatible)),
  ] as const);
  const failed = gates.filter((item) => !item.passed).map((item) => item.gateId);

  return Object.freeze({
    status: failed.length === 0 ? "PASS" : "FAIL",
    gates,
    diagnostics: Object.freeze(failed.map((gateId) => `certification-gate-failed:${gateId}`)),
  });
}
