/**
 * NPA-T VAI:6 — Director Impact Scene identity.
 * Read-only arrangement of already-resolved VAI/Theatre inputs. Not a second Director.
 */

export const vaiImpactSceneIdentity = "NPA-T VAI:6/DirectorImpactScene" as const;
export const vaiImpactSceneVersion = "1.0.0" as const;
export const vaiImpactSceneNamespace = "nexora.vai.director-impact-scene" as const;
export const vaiImpactScenePhase = "VAI:6" as const;

export function getVaiImpactSceneIdentity() {
  return Object.freeze({
    id: vaiImpactSceneIdentity,
    version: vaiImpactSceneVersion,
    namespace: vaiImpactSceneNamespace,
    phase: vaiImpactScenePhase,
  });
}
