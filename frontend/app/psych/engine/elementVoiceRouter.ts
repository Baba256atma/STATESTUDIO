import { createInspirationSignal, evaluateInspiration, type InspirationSignal } from "./inspirationEngine";
import { tickInnerDialogue } from "./innerDialogueEngine";
import { emotionStore, triggerEgoSpeakPulse, triggerSceneReaction } from "./useEmotionStore";
import { mapWordsToSceneReaction } from "./sceneReactionMapping";
import { canSpeak, markSpeaking } from "./voiceCoordinator";
import { buildElementVoiceMessage, type ElementVoiceId } from "./elementPersonalities";
import { buildDeepResponse } from "./objectDeepResponse";
import { applyMemoryBias, getDominantElement, mapEmotionToElements } from "./emotionElementMapping";
import { loadMemory, type SychoMemory } from "./memoryEngine";
import { ENABLE_DEBUG_LOGS } from "../../lib/featureFlags";
import { psychLogger } from "./psychLogger";

export type Speaker =
  | "ego"
  | "oracle"
  | "whisper"
  | "fire"
  | "water"
  | "air"
  | "earth"
  | "sun";

export type RouterContext = {
  now: number;
  lastUserInput?: string | null;
  clickedObject?: Speaker | null;
  idleTime?: number;
  isTyping?: boolean;
  countTheme?: boolean;
  emotion: {
    intensity: number;
    type?: "fear" | "sadness" | "anger" | "exploration" | "control" | "identity" | "neutral";
  };
  archetype?: "warrior" | "healer" | "thinker" | "builder" | "leader" | null;
  memory?: SychoMemory | null;
};

export type VoiceMessage = {
  source: Speaker;
  tone: "inner" | "element" | "mystery";
  text: string;
  inspiration?: InspirationSignal;
};

let lastImmediateClickAt = 0;

function isElement(speaker: Speaker): speaker is Exclude<Speaker, "ego" | "oracle" | "whisper"> {
  return speaker === "fire" || speaker === "water" || speaker === "air" || speaker === "earth" || speaker === "sun";
}

function isClickableSpeaker(speaker: Speaker): boolean {
  return isElement(speaker) || speaker === "ego" || speaker === "oracle" || speaker === "whisper";
}

function logDecision(speaker: Speaker | null): void {
  if (!ENABLE_DEBUG_LOGS) return;
  if (speaker) console.log("[Sycho][B13.8][RouterDecision]", { speaker });
}

function buildEgoClickMessage(): VoiceMessage {
  return {
    source: "ego",
    tone: "inner",
    text: "I am the one watching.",
  };
}

function buildElementMessage(el: ElementVoiceId, ctx: RouterContext, clicked: boolean): VoiceMessage {
  return {
    source: el,
    tone: "element",
    text: buildElementVoiceMessage(el, {
      clicked,
      intensity: ctx.emotion.intensity,
      emotionType: ctx.emotion.type,
      archetype: ctx.archetype,
    }),
  };
}

function buildElementAutoMessage(el: ElementVoiceId, ctx: RouterContext): VoiceMessage | null {
  const probability = ctx.emotion.intensity > 0.6 ? 0.35 : 0.15;
  if (Math.random() > probability) return null;
  return buildElementMessage(el, ctx, false);
}

function tryEgo(ctx: RouterContext): VoiceMessage | null {
  if (!canSpeak("ego", ctx.now)) return null;

  const input = ctx.lastUserInput ?? "";
  const deepInput = /who am i|myself|why|meaning|identity/i.test(input);
  const result = tickInnerDialogue({
    lastUserInput: input,
    emotionIntensity: ctx.emotion.intensity,
    idleForMs: deepInput ? Math.max(ctx.idleTime ?? 0, 6000) : ctx.idleTime ?? 0,
    now: ctx.now,
  });
  if (!result) return null;

  return {
    source: result.source,
    tone: "inner",
    text: result.text,
  };
}

function tryOracle(ctx: RouterContext): VoiceMessage | null {
  if (!canSpeak("oracle", ctx.now)) return null;

  const result = evaluateInspiration({
    userInput: ctx.lastUserInput,
    emotion: emotionStore.current,
    idleTime: ctx.idleTime ?? 0,
    isTyping: ctx.isTyping,
    countTheme: ctx.countTheme,
    now: ctx.now,
  });
  if (!result.shouldAppear) return null;

  const inspiration = createInspirationSignal(result, ctx.now);
  if (!result.message.trim()) {
    return {
      source: result.source ?? "whisper",
      tone: "mystery",
      text: "",
      inspiration,
    };
  }

  return {
    source: result.source ?? "whisper",
    tone: "mystery",
    text: result.message,
    inspiration,
  };
}

function pickDominantElement(ctx: RouterContext): Exclude<Speaker, "ego" | "oracle" | "whisper"> | null {
  const baseScores = mapEmotionToElements(ctx.emotion, ctx.archetype);
  const scores = applyMemoryBias(baseScores, ctx.memory ?? loadMemory());
  const dominant = getDominantElement(scores);
  if (scores[dominant] < 0.35) return null;
  return dominant;
}

export function routeVoice(ctx: RouterContext): VoiceMessage | null {
  const { now, clickedObject } = ctx;

  if (clickedObject && isClickableSpeaker(clickedObject)) {
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.8][ClickOverride]", { speaker: clickedObject });
    if (now - lastImmediateClickAt < 1200) {
      if (process.env.NODE_ENV !== "production") {
        psychLogger.debug("[B13.8-FIX-2][ClickCooldownBlocked]", {
          object: clickedObject,
          msSinceLast: now - lastImmediateClickAt,
        });
      }
      return null;
    }
    lastImmediateClickAt = now;
    const deepMessage = buildDeepResponse(clickedObject, ctx);
    if (!deepMessage && process.env.NODE_ENV !== "production") {
      console.log("[Sycho][B13.10][FallbackToSimple]", { objectId: clickedObject });
    }
    const message = deepMessage ?? (clickedObject === "ego" ? buildEgoClickMessage() : isElement(clickedObject) ? buildElementMessage(clickedObject, ctx, true) : null);
    if (!message) {
      logDecision(null);
      return null;
    }
    markSpeaking(clickedObject, now);
    if (process.env.NODE_ENV !== "production") {
      psychLogger.event("[B13.8-FIX-2][ClickImmediate]", {
        object: clickedObject,
      });
    }
    logDecision(clickedObject);
    return message;
  }

  const egoMessage = tryEgo(ctx);
  if (egoMessage) {
    logDecision("ego");
    return egoMessage;
  }

  const oracleMessage = tryOracle(ctx);
  if (oracleMessage) {
    logDecision(oracleMessage.source);
    return oracleMessage;
  }

  const element = pickDominantElement(ctx);
  if (!element) {
    logDecision(null);
    return null;
  }
  if (!canSpeak(element, now)) {
    logDecision(null);
    return null;
  }

  const message = buildElementAutoMessage(element, ctx);
  if (!message) {
    logDecision(null);
    return null;
  }

  markSpeaking(element, now);
  logDecision(element);
  return message;
}

export function applyVoiceMessageEffects(message: VoiceMessage, userInput?: string | null): void {
  if (message.source === "ego") triggerEgoSpeakPulse(1100);
  triggerSceneReaction(mapWordsToSceneReaction({
    source: message.source === "ego" ? "innerVoice" : message.source === "oracle" || message.source === "whisper" ? "innerVoice" : "chat",
    text: message.text || "The field answers in silence.",
    emotion: emotionStore.current,
    userInput,
  }), message.source === "oracle" || message.source === "whisper" ? 1800 : 1400);
}
