export type InteractionSource = "scene" | "objects_panel" | "chat" | "cta_button" | "left_nav";

export type InteractionIntentType =
  | "select_object"
  | "open_panel"
  | "close_panel"
  | "chat_result"
  | "reset_focus"
  | "run_ingestion"
  | "ingestion_success"
  | "ingestion_failed";

export type InteractionIntent = {
  type: InteractionIntentType;
  source: InteractionSource;
  payload?: Record<string, any>;
};

export type NexoraUIState = {
  selectedObjectId: string | null;
  rightPanel: "focus_insight" | "risk" | "fragility" | "war_room" | "dashboard" | null;
  objectsPanel: {
    isOpen: boolean;
    mode: "list" | "details";
  };
  scene: {
    highlightedObjectId: string | null;
  };
  ingestion: {
    status: "idle" | "loading" | "success" | "error";
    error?: string;
  };
  meta: {
    lastIntentSource?: InteractionSource;
  };
};

export const INITIAL_NEXORA_UI_STATE: NexoraUIState = {
  selectedObjectId: null,
  rightPanel: null,
  objectsPanel: { isOpen: false, mode: "list" },
  scene: { highlightedObjectId: null },
  ingestion: { status: "idle" },
  meta: {},
};

export function isSameState(a: NexoraUIState, b: NexoraUIState): boolean {
  return (
    a.selectedObjectId === b.selectedObjectId &&
    a.rightPanel === b.rightPanel &&
    a.scene.highlightedObjectId === b.scene.highlightedObjectId &&
    a.objectsPanel.mode === b.objectsPanel.mode &&
    a.objectsPanel.isOpen === b.objectsPanel.isOpen &&
    a.ingestion.status === b.ingestion.status &&
    (a.ingestion.error ?? "") === (b.ingestion.error ?? "")
  );
}

export function resolveInteraction(prev: NexoraUIState, intent: InteractionIntent): NexoraUIState {
  const next: NexoraUIState = {
    ...prev,
    objectsPanel: { ...prev.objectsPanel },
    scene: { ...prev.scene },
    ingestion: { ...prev.ingestion },
    meta: { ...prev.meta },
  };

  switch (intent.type) {
    case "select_object": {
      const objectId = typeof intent.payload?.objectId === "string" ? intent.payload.objectId.trim() : "";
      if (!objectId) return prev;
      next.selectedObjectId = objectId;
      next.scene.highlightedObjectId = objectId;
      next.objectsPanel.isOpen = true;
      next.objectsPanel.mode = "details";
      next.rightPanel = "focus_insight";
      break;
    }
    case "open_panel": {
      const panel = intent.payload?.panel;
      const resolvedPanel =
        panel === "focus_insight" || panel === "risk" || panel === "fragility" || panel === "war_room" || panel === "dashboard"
          ? panel
          : null;
      // Priority: never open focus insight without a selected object (blank panel / flash).
      // chat_result with objectId sets selection first; open_panel alone must not override that rule.
      if (resolvedPanel === "focus_insight" && !next.selectedObjectId) {
        break;
      }
      next.rightPanel = resolvedPanel;
      break;
    }
    case "close_panel": {
      next.rightPanel = null;
      break;
    }
    case "reset_focus": {
      next.selectedObjectId = null;
      next.scene.highlightedObjectId = null;
      next.rightPanel = null;
      next.objectsPanel.mode = "list";
      break;
    }
    case "chat_result": {
      const objectId = typeof intent.payload?.objectId === "string" ? intent.payload.objectId.trim() : "";
      if (objectId) {
        next.selectedObjectId = objectId;
        next.scene.highlightedObjectId = objectId;
        next.objectsPanel.isOpen = true;
        next.objectsPanel.mode = "details";
        next.rightPanel = "focus_insight";
      } else {
        const panel = intent.payload?.panel;
        const resolvedPanel =
          panel === "focus_insight" || panel === "risk" || panel === "fragility" || panel === "war_room" || panel === "dashboard"
            ? panel
            : null;
        // Same rule as open_panel: chat_result without objectId must not open blank focus insight.
        if (resolvedPanel === "focus_insight" && !next.selectedObjectId) {
          break;
        }
        if (resolvedPanel) {
          next.rightPanel = resolvedPanel;
        }
      }
      break;
    }
    case "run_ingestion": {
      next.ingestion = { status: "loading" };
      break;
    }
    case "ingestion_success": {
      next.ingestion = { status: "success" };
      break;
    }
    case "ingestion_failed": {
      next.ingestion = {
        status: "error",
        error: typeof intent.payload?.message === "string" && intent.payload.message.trim()
          ? intent.payload.message.trim()
          : "Ingestion failed",
      };
      break;
    }
    default:
      return prev;
  }

  next.meta.lastIntentSource = intent.source;

  if (isSameState(prev, next)) {
    return prev;
  }
  return next;
}
