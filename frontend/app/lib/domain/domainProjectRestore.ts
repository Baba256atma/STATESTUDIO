import { normalizeDomainId } from "./domainHelpers.ts";
import { validateDomainProjectSnapshot } from "./domainProjectValidation.ts";
import type { NexoraDomainId } from "./domainTypes.ts";
import type { DomainProjectSnapshot } from "./domainProjectTypes.ts";

export function restoreDomainProjectScene(params: {
  snapshot: DomainProjectSnapshot;
}): {
  success: boolean;
  scene?: unknown;
  activeDomainId?: NexoraDomainId;
  warnings?: string[];
} {
  const validation = validateDomainProjectSnapshot(params.snapshot);
  if (!validation.valid) {
    return {
      success: false,
      warnings: validation.warnings,
    };
  }

  return {
    success: true,
    scene: params.snapshot.scene,
    activeDomainId: normalizeDomainId(params.snapshot.activeDomainId),
  };
}
