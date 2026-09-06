/**
 * Resolves manager location/how-to UI guidance to a semantic product target.
 * Not an onboarding parser. Does not query DOM. Distinguishes guidance from action.
 */

import type { NexoraGuidedAttentionTarget } from "@/app/lib/director/nexoraGuidedAttentionPresentation.ts";

export type NexoraUiGuidanceKind = "LOCATE_UI" | "UI_ACTION" | "NONE";

export type NexoraUiGuidanceIntent = {
  readonly kind: NexoraUiGuidanceKind;
  readonly target: NexoraGuidedAttentionTarget | null;
  readonly usesPendingOffer: boolean;
};

const COLLECTION_SHOW =
  /\b(?:problems?|issues?|scenarios?|decisions?|executions?|goals?|risks?)\b/;

function normalize(utterance: string): string {
  return utterance
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function resolveNexoraUiGuidanceIntent(input: {
  readonly utterance: string;
  readonly pendingOfferTarget?: NexoraGuidedAttentionTarget | null;
}): NexoraUiGuidanceIntent {
  const text = normalize(input.utterance);
  if (!text) {
    return Object.freeze({ kind: "NONE", target: null, usesPendingOffer: false });
  }

  if (COLLECTION_SHOW.test(text) && /\b(?:show|see|list|open|bring)\b/.test(text)) {
    return Object.freeze({ kind: "NONE", target: null, usesPendingOffer: false });
  }

  if (
    /^(?:add this data|upload (?:the |this )?(?:csv|file|data)|open data(?: rail)?)$/.test(
      text,
    )
  ) {
    return Object.freeze({
      kind: "UI_ACTION",
      target: "DATA_ENTRY",
      usesPendingOffer: false,
    });
  }
  if (/^(?:go back|step back)$/.test(text)) {
    return Object.freeze({
      kind: "UI_ACTION",
      target: "BACK_CONTROL",
      usesPendingOffer: false,
    });
  }

  if (
    input.pendingOfferTarget &&
    (text === "show me" || text === "yes" || text === "please" || text === "ok")
  ) {
    return Object.freeze({
      kind: "LOCATE_UI",
      target: input.pendingOfferTarget,
      usesPendingOffer: true,
    });
  }

  if (isDataLocate(text)) {
    return Object.freeze({
      kind: "LOCATE_UI",
      target: "DATA_ENTRY",
      usesPendingOffer: false,
    });
  }
  if (isBackLocate(text)) {
    return Object.freeze({
      kind: "LOCATE_UI",
      target: "BACK_CONTROL",
      usesPendingOffer: false,
    });
  }
  if (isStageLocate(text)) {
    return Object.freeze({
      kind: "LOCATE_UI",
      target: "STAGE",
      usesPendingOffer: false,
    });
  }

  return Object.freeze({ kind: "NONE", target: null, usesPendingOffer: false });
}

function isDataLocate(text: string): boolean {
  if (/where (?:is|are) (?:the )?data/.test(text)) return true;
  if (/how do i add (?:my )?data/.test(text)) return true;
  if (/where can i (?:add|upload|give) /.test(text) && /\bdata|information\b/.test(text)) {
    return true;
  }
  if (/show me where (?:i |to )?add (?:my )?data/.test(text)) return true;
  if (/i can'?t find data/.test(text)) return true;
  if (/where can i upload information/.test(text)) return true;
  if (/can i (?:give|bring) you (?:my )?data/.test(text) && /where|how|show/.test(text)) {
    return true;
  }
  return false;
}

function isBackLocate(text: string): boolean {
  if (/how do i go back/.test(text)) return true;
  if (/where is (?:the )?back/.test(text)) return true;
  if (/show me (?:the )?back(?: control)?/.test(text)) return true;
  return false;
}

function isStageLocate(text: string): boolean {
  if (/where do objects appear/.test(text)) return true;
  if (/where is (?:the )?(?:stage|workspace)/.test(text)) return true;
  if (/show me (?:the )?stage/.test(text) && !COLLECTION_SHOW.test(text)) return true;
  return false;
}
