import type { ExecutiveMetaCognitionSnapshot } from "./executiveMetaCognitionTypes";

const emitted = new Set<string>();

export function logMetaCognitionDiagnostics(snapshot: ExecutiveMetaCognitionSnapshot): void {
  if (process.env.NODE_ENV === "production") return;
  const warnings: string[] = [];
  if (snapshot.reasoningPath.length < 10) warnings.push("reasoning_path_incomplete");
  if (snapshot.assumptions.some((item) => item.stability === "weak")) warnings.push("assumption_reflection_drift");
  if (snapshot.uncertainty.some((item) => item.severity === "high")) warnings.push("high_uncertainty_reflection");
  if (snapshot.advisoryLimits.length === 0) warnings.push("advisory_limit_instability");
  if (!warnings.length) return;
  const signature = `${snapshot.signature}|${warnings.join(",")}`;
  if (emitted.has(signature)) return;
  emitted.add(signature);
  globalThis.console.debug("[Nexora][MetaCognition][Diagnostics]", {
    signature: snapshot.signature,
    organizationId: snapshot.organizationId,
    warnings,
    confidenceDirection: snapshot.confidenceEvolution.direction,
  });
}

