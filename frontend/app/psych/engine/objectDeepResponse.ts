import { getOracleMemoryState } from "./inspirationEngine";
import { buildElementVoiceMessage, getElementPersonality, type ElementVoiceId } from "./elementPersonalities";
import { getMemoryFamiliarity, getMemoryScores, loadMemory } from "./memoryEngine";
import type { RouterContext, Speaker, VoiceMessage } from "./elementVoiceRouter";

const lastResponsesByObject: Partial<Record<Speaker, string[]>> = {};

function rememberResponse(objectId: Speaker, text: string): void {
  lastResponsesByObject[objectId] = [...(lastResponsesByObject[objectId] ?? []), text].slice(-2);
}

function wasRecentlyUsed(objectId: Speaker, text: string): boolean {
  return (lastResponsesByObject[objectId] ?? []).includes(text);
}

function hasMeaningfulContext(ctx: RouterContext): boolean {
  return !!ctx.lastUserInput?.trim() || ctx.emotion.intensity > 0.24 || ctx.emotion.type !== "neutral";
}

function contextPhrase(ctx: RouterContext): string {
  const input = ctx.lastUserInput?.trim().slice(0, 80).toLowerCase() ?? "";
  if (/\b(goal|purpose|direction|path)\b/.test(input)) return "You're asking for direction";
  if (/\b(who am i|myself|identity|me)\b/.test(input)) return "You're circling the question of self";
  if (/\b(why|how|what)\b/.test(input)) return "You're trying to understand the shape of this";
  if (ctx.emotion.type === "anger") return "There is heat moving through the field";
  if (ctx.emotion.type === "fear") return "Something in the field is bracing";
  if (ctx.emotion.type === "sadness") return "Something soft is asking not to be rushed";
  if (ctx.emotion.type === "control") return "The system is tightening around control";
  if (ctx.emotion.type === "exploration") return "A question is opening the field";
  if (ctx.emotion.type === "identity") return "The center is asking to be seen";
  return "Something in the field is moving";
}

function personalize(text: string, objectId: Speaker, ctx: RouterContext): string {
  if (ctx.archetype === "warrior" && objectId === "fire") return text.replace("Move", "Move now").replace("action", "decisive action");
  if (ctx.archetype === "healer" && objectId === "water") return text.replace("Let yourself", "Gently let yourself").replace("feel", "feel without forcing");
  if (ctx.archetype === "thinker" && objectId === "air") return text.replace("question", "cleaner question");
  if (ctx.archetype === "builder" && objectId === "earth") return text.replace("something real", "one real step");
  if (ctx.archetype === "leader" && objectId === "sun") return text.replace("clarity", "centered clarity");
  return text;
}

function pickResponse(objectId: Speaker, responses: string[], ctx: RouterContext): string | null {
  const memory = getOracleMemoryState();
  const sychoMemory = loadMemory();
  const sychoScores = getMemoryScores(sychoMemory);
  const sychoFamiliarity = getMemoryFamiliarity(sychoMemory);
  const preferred = responses.map((text) => {
    let score = 1;
    if (wasRecentlyUsed(objectId, text)) score -= 100;
    if (ctx.emotion.intensity > 0.62 && /\b(now|real|move|strongest|first)\b/i.test(text)) score += 0.15;
    if (memory.dominantMood === "fear" && /\b(rush|soft|doubt|bracing|stopped)\b/i.test(text)) score += 0.08;
    if (memory.dominantMood === "exploration" && /\b(question|know|seeing|answer)\b/i.test(text)) score += 0.08;
    if (memory.familiarityScore > 0.45 && /\b(already|returning|again|part of this)\b/i.test(text)) score += 0.08;
    if (sychoFamiliarity > 0.5 && /\b(already|part|familiar|returning)\b/i.test(text)) score += 0.06;
    if (sychoScores.earth > 0.28 && /\b(real|small|step|ground)\b/i.test(text)) score += 0.05;
    if (sychoScores.water > 0.28 && /\b(feel|soft|wave|slow)\b/i.test(text)) score += 0.05;
    return { text: personalize(text, objectId, ctx), score };
  }).sort((a, b) => b.score - a.score);

  const picked = preferred.find((entry) => entry.score > -10)?.text ?? null;
  if (!picked) return null;
  rememberResponse(objectId, picked);
  return picked;
}

function buildElementDeepResponse(objectId: ElementVoiceId, ctx: RouterContext): VoiceMessage | null {
  const reflection = contextPhrase(ctx);
  const personality = getElementPersonality(objectId);
  const guide = buildElementVoiceMessage(objectId, {
    clicked: true,
    intensity: ctx.emotion.intensity,
    emotionType: ctx.emotion.type,
    archetype: ctx.archetype,
  });

  const responses: Record<ElementVoiceId, string[]> = {
    fire: [
      `${reflection}, but Fire does not want you to freeze there. ${guide}`,
      `${reflection}; the heat is asking for motion, not rumination. Move before the doubt gets louder.`,
      `You're holding back more than you think. Use the heat, don't become it.`,
    ],
    water: [
      `${reflection}, and Water says it may be too early to solve it. Let yourself feel it first.`,
      `You're trying to understand it too quickly. Let the wave pass through you before you name it.`,
      `${reflection}; ${guide}`,
    ],
    air: [
      `${reflection}, but Air suspects the question is slightly off. What are you actually trying to know?`,
      `You're asking the result, not the cleaner question. Ask what you are not seeing yet.`,
      `${reflection}; ${guide}`,
    ],
    earth: [
      `${reflection}, but Earth does not need the whole answer. Start with something real and small.`,
      `You don't need the full answer. Take one real step and let the ground answer back.`,
      `${reflection}; ${guide}`,
    ],
    sun: [
      `${reflection}, and Sun says part of you already knows. Stand where your clarity is strongest.`,
      `You already know part of this. Let the center speak before the noise returns.`,
      `${reflection}; ${guide}`,
    ],
  };

  const text = pickResponse(objectId, responses[objectId], ctx);
  if (!text) return null;

  if (process.env.NODE_ENV !== "production") {
    console.log("[Sycho][B13.10][DeepResponseBuilt]", {
      objectId,
      role: personality.role,
    });
  }

  return {
    source: objectId,
    tone: "element",
    text,
  };
}

function buildEgoDeepResponse(ctx: RouterContext): VoiceMessage | null {
  const responses = [
    "I feel like I'm searching for something I can't name yet.",
    "I keep looking for the part of me that is doing the looking.",
    "I feel close to something true, but I cannot hold it clearly yet.",
  ];
  const text = pickResponse("ego", responses, ctx);
  if (!text) return null;
  if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.10][DeepResponseBuilt]", { objectId: "ego" });
  return { source: "ego", tone: "inner", text };
}

function buildOracleDeepResponse(ctx: RouterContext): VoiceMessage | null {
  if (ctx.emotion.intensity < 0.35 && Math.random() > 0.35) return null;
  const responses = [
    "The answer is not ahead of you. It is waiting where you stopped looking.",
    "The mirror is not refusing you. It is asking you to arrive slower.",
    "What you call the question may be the doorway.",
  ];
  const text = pickResponse("oracle", responses, ctx);
  if (!text) return null;
  if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.10][DeepResponseBuilt]", { objectId: "oracle" });
  return { source: "oracle", tone: "mystery", text };
}

export function buildDeepResponse(objectId: Speaker, ctx: RouterContext): VoiceMessage | null {
  if (!hasMeaningfulContext(ctx)) return null;
  if (objectId === "ego") return buildEgoDeepResponse(ctx);
  if (objectId === "oracle" || objectId === "whisper") return buildOracleDeepResponse(ctx);
  return buildElementDeepResponse(objectId, ctx);
}
