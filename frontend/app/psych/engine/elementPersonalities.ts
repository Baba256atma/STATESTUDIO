export type ElementVoiceId = "fire" | "water" | "air" | "earth" | "sun";

export type ElementVoiceContext = {
  clicked?: boolean;
  intensity?: number;
  emotionType?: string;
  archetype?: string | null;
};

export type ElementPersonality = {
  id: ElementVoiceId;
  role: string;
  tone: string;
  style: string;
  vocabulary: string[];
  examples: string[];
};

const ELEMENT_PERSONALITIES: Record<ElementVoiceId, ElementPersonality> = {
  fire: {
    id: "fire",
    role: "action / anger / courage",
    tone: "direct, sharp, energetic",
    style: "short commands",
    vocabulary: ["move", "heat", "courage", "drive", "edge"],
    examples: [
      "Move before the fear grows.",
      "Use the heat, don't become it.",
      "Let the fire choose one action.",
      "Do not wait for certainty.",
      "Turn the pressure into motion.",
    ],
  },
  water: {
    id: "water",
    role: "emotion / softness / healing",
    tone: "calm, empathic",
    style: "reflective",
    vocabulary: ["feel", "wave", "soften", "flow", "release"],
    examples: [
      "Feel it before you name it.",
      "Let the wave pass through you.",
      "Soften around what hurts.",
      "Do not force the feeling to explain itself.",
      "Let the current carry what is too heavy.",
    ],
  },
  air: {
    id: "air",
    role: "thought / curiosity / questions",
    tone: "light, curious",
    style: "question-driven",
    vocabulary: ["ask", "question", "angle", "see", "thought"],
    examples: [
      "Ask the cleaner question.",
      "What are you not seeing yet?",
      "Let the thought turn once more.",
      "Which question opens the room?",
      "Look from the side you keep avoiding.",
    ],
  },
  earth: {
    id: "earth",
    role: "stability / reality / action",
    tone: "grounded, practical",
    style: "simple next step",
    vocabulary: ["step", "ground", "touch", "real", "steady"],
    examples: [
      "Take one real step.",
      "Return to what you can touch.",
      "Begin where the ground is firm.",
      "Make the next move small and real.",
      "Hold steady before you decide.",
    ],
  },
  sun: {
    id: "sun",
    role: "clarity / confidence / self-power",
    tone: "warm, clear",
    style: "encouraging",
    vocabulary: ["clarity", "center", "strength", "stand", "light"],
    examples: [
      "Stand where your strength is.",
      "Let the center speak.",
      "Choose from the part of you that knows.",
      "Let clarity warm the next step.",
      "Do not hide from your own light.",
    ],
  },
};

const lastMessageByElement: Partial<Record<ElementVoiceId, string>> = {};

export function getElementPersonality(elementId: ElementVoiceId): ElementPersonality {
  return ELEMENT_PERSONALITIES[elementId];
}

function scoreMessage(message: string, elementId: ElementVoiceId, context: ElementVoiceContext): number {
  let score = 1;
  const text = message.toLowerCase();
  if (message === lastMessageByElement[elementId]) score -= 100;
  if (context.clicked) score += 0.2;
  if ((context.intensity ?? 0) > 0.65 && /\b(move|stand|choose|take|ask)\b/.test(text)) score += 0.1;
  if (context.emotionType === "control" && elementId === "earth" && /\b(small|steady|ground|real)\b/.test(text)) score += 0.18;
  if (context.emotionType === "exploration" && elementId === "air" && /\b(question|seeing|look)\b/.test(text)) score += 0.18;
  if ((context.emotionType === "fear" || context.emotionType === "sadness") && elementId === "water" && /\b(soften|wave|carry|feel)\b/.test(text)) score += 0.18;
  if (context.emotionType === "anger" && elementId === "fire" && /\b(heat|pressure|move)\b/.test(text)) score += 0.18;
  return score;
}

export function buildElementVoiceMessage(elementId: ElementVoiceId, context: ElementVoiceContext = {}): string {
  const personality = getElementPersonality(elementId);
  const candidates = personality.examples
    .map((text) => ({ text, score: scoreMessage(text, elementId, context) }))
    .sort((a, b) => b.score - a.score);
  const bestScore = candidates[0]?.score ?? 0;
  const pool = candidates.filter((candidate) => candidate.score >= bestScore - 0.05 && candidate.score > -10);
  const picked = pool[Math.floor(Math.random() * pool.length)]?.text ?? candidates.find((candidate) => candidate.text !== lastMessageByElement[elementId])?.text ?? personality.examples[0];
  lastMessageByElement[elementId] = picked;

  if (process.env.NODE_ENV !== "production") {
    console.log("[Sycho][B13.9][ElementPersonalityUsed]", {
      elementId,
      role: personality.role,
      tone: personality.tone,
      style: personality.style,
    });
  }

  return picked;
}
