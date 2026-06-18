import { resolveAnalyzeIntelligenceBinding } from "../../intelligence-integration/AnalyzeIntelligenceBinding.ts";
import { buildAnalyzeExecutiveSummaryView } from "../../intelligence-integration/analyzeExecutiveSummaryContract.ts";
import type { AnalyzeIntelligenceBindingBuildInput } from "../../intelligence-integration/analyzeIntelligenceBindingContract.ts";
import type { AnalyzeIntelligenceBindingView } from "../../intelligence-integration/analyzeIntelligenceBindingContract.ts";
import type { AnalyzeWorkspaceContextView } from "./analyzeModeContract.ts";

export type AnalyzeIntelligenceBindingAttachInput = AnalyzeIntelligenceBindingBuildInput;

export function attachAnalyzeIntelligenceBinding(
  context: AnalyzeWorkspaceContextView | null,
  input: AnalyzeIntelligenceBindingAttachInput = { objectId: null }
): AnalyzeWorkspaceContextView | null {
  if (!context) return null;

  const binding = resolveAnalyzeIntelligenceBinding({
    ...input,
    objectId: context.objectId,
    objectName: context.objectName,
    selectedObjectId: context.objectId,
  });

  const intelligence: AnalyzeIntelligenceBindingView | null = binding.view;

  return Object.freeze({
    ...context,
    intelligence,
    executiveSummary: intelligence
      ? buildAnalyzeExecutiveSummaryView({
          intelligence,
          profile: binding.profile,
        })
      : null,
  });
}
