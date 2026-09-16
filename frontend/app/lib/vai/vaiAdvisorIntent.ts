/**
 * NPA-T VAI:4 — bounded Variable-analysis sub-intent.
 * Pattern matching only. Not a general NLU or CC:1 replacement.
 */

import type { VaiAdvisorIntent } from "./vaiAdvisorContract.ts";

export function detectVaiAdvisorIntent(utterance: string): VaiAdvisorIntent {
  const text = utterance.trim().toLowerCase();
  if (!text) return "NONE";
  if (/why can'?t you say|why can not you say|why isn'?t it (the )?cause|why not (the )?cause|why can'?t you (say )?(it )?caused/.test(text)) {
    return "WHY_NOT_CAUSE";
  }
  if (/why (?:is|do you call|did you call).*(lever|staffing)/.test(text) || /why is staffing a lever/.test(text)) {
    return "WHY_ROLE";
  }
  if (/tell me more about the lever|more about the lever/.test(text)) return "FOLLOWUP_LEVER";
  if (/what evidence do we have for it|evidence do we have for it/.test(text)) return "FOLLOWUP_EVIDENCE";
  if (/^is it the cause\??$/.test(text) || /is it the cause/.test(text) && /\bit\b/.test(text) && !/demand/.test(text)) {
    return "FOLLOWUP_CAUSE";
  }
  if (/is .+ causing|does .+ cause|do we know what caused|caused the delay|causing the delay/.test(text)) return "CAUSAL";
  if (/what can i potentially change|what can i change|what can we change|potential lever/.test(text)) return "LEVER";
  if (/what outcome are we watching|outcome variable|what should we monitor/.test(text)) return "OUTCOME";
  if (/path of effect|effect path|pathway/.test(text)) return "PATH";
  if (/moderator|how strongly two factors/.test(text)) return "MODERATOR";
  if (/stay controlled|remain stable|hold stable|factors should stay/.test(text)) return "CONTROL";
  if (/confus(?:e|ing)|confounder|alternative explanation|what could explain|what might explain/.test(text)) return "CONFOUNDER";
  if (/what should i investigate|what should we investigate/.test(text)) return "INVESTIGATE";
  if (/what (?:does )?the evidence|what evidence/.test(text)) return "EVIDENCE";
  if (/explain this impact map|this impact map/.test(text)) return "VARIABLES_MATTER";
  if (/what variables matter|what is affecting|what affects this|what factors matter|variables affect/.test(text)) {
    return "VARIABLES_MATTER";
  }
  return "NONE";
}
