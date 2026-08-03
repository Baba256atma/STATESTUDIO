/**
 * Phase B — Analyze executive context for a Runtime change.
 */

import { EXS1_PACKS } from "../mock/exs1Mock";
import type { ExecutiveMetadataCatalog } from "../metadata/ExecutiveMetadataRegistry";
import { getObjectMetadata } from "../metadata/ExecutiveMetadataRegistry";
import { getDomain } from "../metadata/ExecutiveDomainRegistry";
import type { ExecutiveRuntimeState } from "../runtime/ExecutiveRuntimeStore";
import type { ExecutiveContextAnalysis } from "./ExecutiveSignalTypes";

export function analyzeExecutiveContext(
  state: ExecutiveRuntimeState,
  catalog: ExecutiveMetadataCatalog,
): ExecutiveContextAnalysis {
  const packId = state.pack.selectedPackId;
  const packTitle =
    EXS1_PACKS.find((p) => p.id === packId)?.title ??
    state.decision.decisionPacks.find((p) => p.id === packId)?.title ??
    state.execution.executionPacks.find((p) => p.id === packId)?.title ??
    state.monitoring.monitoringPacks.find((p) => p.id === packId)?.title ??
    state.data.dataPacks.find((p) => p.id === packId)?.title ??
    "Production Delay";

  const selectedObjectId = state.selection.selectedObjectId;
  const objectMeta = selectedObjectId
    ? getObjectMetadata(catalog, selectedObjectId)
    : undefined;
  const domainNames = (objectMeta?.domainIds ?? ["supply-chain"]).map(
    (id) => getDomain(id)?.name ?? id,
  );

  return {
    workspace: state.mode.activeMode,
    goal: "Resolve Production Delay with executive control retained.",
    packId,
    packTitle,
    timelineLens: state.timeline.lens,
    timelinePosition: state.timeline.position,
    domainNames,
    selectedObjectId,
  };
}
