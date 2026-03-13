export type DecisionAction = {
  type: string;
  target?: string;
  payload?: Record<string, unknown>;
  reason?: string;
  confidence?: number;
};

export type FocusIntent = {
  mode?: "ALL" | "OBJECT" | "LOOP";
  objectId?: string;
  loopId?: string;
  label?: string;
};

export type RouterResult = {
  assistantReply: string;
  actions: DecisionAction[];
  focusIntent?: FocusIntent;
};

type RouterContext = {
  focusedObjectId?: string | null;
  activeLoopId?: string | null;
  focusMode?: string | null;
  pinnedLabel?: string | null;
};

const colorMap: Record<string, string> = {
  red: "#ef4444",
  green: "#22c55e",
  blue: "#3b82f6",
  yellow: "#eab308",
  orange: "#f97316",
  purple: "#a855f7",
  white: "#f8fafc",
  black: "#0f172a",
};

function normalizeInput(input: string) {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

function findColor(text: string): string | null {
  for (const name of Object.keys(colorMap)) {
    if (text.includes(name)) return colorMap[name];
  }
  return null;
}

function parseOpacity(text: string): number | null {
  const percentMatch = text.match(/(\d{1,3})\s*%/);
  if (percentMatch) {
    const pct = Math.max(0, Math.min(100, Number(percentMatch[1])));
    return Math.max(0, Math.min(1, pct / 100));
  }
  const decimalMatch = text.match(/\b0(?:\.\d+)?\b|\b1(?:\.0+)?\b/);
  if (decimalMatch) {
    return Math.max(0, Math.min(1, Number(decimalMatch[0])));
  }
  return null;
}

function parseScaleMultiplier(text: string): number | null {
  if (text.includes("bigger") || text.includes("increase") || text.includes("larger")) return 1.2;
  if (text.includes("smaller") || text.includes("decrease") || text.includes("shrink")) return 0.8;
  return null;
}

export function routeChatInput(input: string, context: RouterContext): RouterResult {
  const text = normalizeInput(input);
  if (!text) {
    return {
      assistantReply: "Say something and I'll try to help.",
      actions: [],
    };
  }

  if (text.includes("help") || text.includes("what can you do")) {
    return {
      assistantReply:
        "I can focus objects (risk/delivery/inventory), change color, scale, opacity, and prep simulation or game-theory requests.",
      actions: [],
    };
  }

  if ((text.includes("focus") || text.includes("select")) && (text.includes("risk") || text.includes("delivery") || text.includes("inventory"))) {
    const label = text.includes("risk") ? "risk" : text.includes("delivery") ? "delivery" : "inventory";
    return {
      assistantReply: `Focusing on ${label}.`,
      actions: [{ type: "FOCUS_LABEL", payload: { label } }],
      focusIntent: { mode: "OBJECT", label },
    };
  }

  if (text.includes("tell me about") && text.includes("selected object")) {
    if (context.focusedObjectId) {
      return {
        assistantReply: "Here's what I know about the focused object.",
        actions: [{ type: "DESCRIBE_FOCUSED" }],
        focusIntent: { mode: "OBJECT", objectId: context.focusedObjectId },
      };
    }
    return {
      assistantReply: "No focused object. Click an object first.",
      actions: [],
    };
  }

  const color = findColor(text);
  if (text.includes("color") && color) {
    if (context.focusedObjectId) {
      return {
        assistantReply: "Updated the object color.",
        actions: [{ type: "SET_OBJECT_COLOR", target: context.focusedObjectId, payload: { color } }],
      };
    }
    return {
      assistantReply: "Click an object first, then tell me the color.",
      actions: [],
    };
  }

  if (text.includes("opacity") || text.includes("transparent")) {
    const opacity = parseOpacity(text) ?? (text.includes("transparent") ? 0.3 : 0.7);
    if (context.focusedObjectId) {
      return {
        assistantReply: "Adjusted object opacity.",
        actions: [{ type: "SET_OBJECT_OPACITY", target: context.focusedObjectId, payload: { opacity } }],
      };
    }
    return {
      assistantReply: "Click an object first, then set opacity.",
      actions: [],
    };
  }

  if (text.includes("scale") || text.includes("bigger") || text.includes("smaller")) {
    const multiplier = parseScaleMultiplier(text) ?? 1.1;
    if (context.focusedObjectId) {
      return {
        assistantReply: "Adjusted object scale.",
        actions: [{ type: "SET_OBJECT_SCALE", target: context.focusedObjectId, payload: { multiplier } }],
      };
    }
    return {
      assistantReply: "Click an object first, then change its scale.",
      actions: [],
    };
  }

  if (text.includes("simulate") || text.includes("predict")) {
    return {
      assistantReply: "Simulation (Markov) is coming next - I saved your request.",
      actions: [{ type: "REQUEST_MARKOV", payload: { prompt: input } }],
    };
  }

  if (text.includes("negotiate") || text.includes("supplier") || text.includes("competitor") || text.includes("game theory")) {
    return {
      assistantReply: "Game Theory module is coming next - I saved your request.",
      actions: [{ type: "REQUEST_GAME_THEORY", payload: { prompt: input } }],
    };
  }

  return {
    assistantReply: "Got it. Want to focus on risk, delivery delay, or inventory?",
    actions: [],
  };
}
