/** WS-1:8 — Certification-reachable frozen baselines. */
import { WorkspaceCertification } from "./workspaceCertification.ts";
const platform = WorkspaceCertification.platform;
export const WorkspaceFreezeBaselines = Object.freeze({
  identity: platform.identity,
  architecture: platform.composition,
  foundation: platform.composition.foundation,
  registry: platform.composition.registry,
  model: platform.composition.model,
  validation: platform.composition.validation,
  manifest: platform.manifest,
  platform,
  certification: WorkspaceCertification,
  inventory: WorkspaceCertification.inventory,
  compatibility: platform.compatibility,
  extension: platform.extensions,
  boundary: platform.composition.boundaries,
  source: WorkspaceCertification,
  immutable: true,
} as const);

