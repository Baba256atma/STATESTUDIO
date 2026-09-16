/**
 * NPA-T VAI:1 — Variable Intelligence Foundation surface.
 */

import { getVaiFoundationIdentity, vaiFoundationIdentity } from "./vaiIdentity.ts";
import { VAI_CONTEXTUAL_ROLES, VAI_FOUNDATION_CONTRACT } from "./vaiContract.ts";
import { verifyVaiAuthorityBoundary } from "./vaiAuthorityBoundary.ts";

export function verifyVaiFoundation(): { readonly ok: true; readonly identity: typeof vaiFoundationIdentity } {
  verifyVaiAuthorityBoundary();
  if (getVaiFoundationIdentity().id !== vaiFoundationIdentity) {
    throw new Error("VAI:1 identity mismatch");
  }
  if (VAI_CONTEXTUAL_ROLES.length !== 6 || VAI_FOUNDATION_CONTRACT.roleCount !== 6) {
    throw new Error("VAI:1 must support exactly six contextual roles");
  }
  if (VAI_FOUNDATION_CONTRACT.createsObjects || VAI_FOUNDATION_CONTRACT.infersCausality) {
    throw new Error("VAI:1 must not create Objects or infer causality");
  }
  if (VAI_FOUNDATION_CONTRACT.writesSemantics || VAI_FOUNDATION_CONTRACT.managerFacingUi) {
    throw new Error("VAI:1 must not write semantics or add manager UI");
  }
  return Object.freeze({ ok: true as const, identity: vaiFoundationIdentity });
}

export { getVaiFoundationIdentity, vaiFoundationIdentity } from "./vaiIdentity.ts";
export {
  VAI_CONTEXTUAL_ROLES,
  VAI_FOUNDATION_CONTRACT,
  VAI_SEMANTIC_STATUSES,
  VAI_DIRECTIONS,
} from "./vaiContract.ts";
export { VAI_AUTHORITY_BOUNDARY, verifyVaiAuthorityBoundary } from "./vaiAuthorityBoundary.ts";
export { resolveVaiVariables } from "./vaiResolver.ts";
export { formatVaiResolveDiagnostics, formatVaiVariableDiagnostic } from "./vaiDiagnostics.ts";
