import { psychLogger } from "./psychLogger";

export type VoiceSpeaker = "ego" | "oracle" | "whisper" | "fire" | "water" | "air" | "earth" | "sun";

type VoiceCoordinatorState = {
  lastSpeaker: VoiceSpeaker | null;
  lastSpokeAt: number;
  activeSpeaker: VoiceSpeaker | null;
};

const MIN_CROSS_SPEAKER_GAP_MS = 5000;
const AUTO_RELEASE_MS = 5000;

let state: VoiceCoordinatorState = {
  lastSpeaker: null,
  lastSpokeAt: 0,
  activeSpeaker: null,
};
let releaseTimer: ReturnType<typeof setTimeout> | null = null;

function logBlocked(speaker: VoiceSpeaker, now: number, reason: "active" | "gap"): void {
  psychLogger.trace("[B12.7.1][VoiceBlockedByCoordinator]", {
    speaker,
    reason,
    activeSpeaker: state.activeSpeaker,
    lastSpeaker: state.lastSpeaker,
    msSinceLast: state.lastSpokeAt > 0 ? now - state.lastSpokeAt : null,
  });
}

export function canSpeak(speaker: VoiceSpeaker, now = Date.now()): boolean {
  if (state.activeSpeaker) {
    logBlocked(speaker, now, "active");
    return false;
  }

  if (state.lastSpeaker && state.lastSpeaker !== speaker && now - state.lastSpokeAt < MIN_CROSS_SPEAKER_GAP_MS) {
    logBlocked(speaker, now, "gap");
    return false;
  }

  return true;
}

export function markSpeaking(speaker: VoiceSpeaker, now = Date.now(), holdMs = AUTO_RELEASE_MS): void {
  state = {
    lastSpeaker: speaker,
    lastSpokeAt: now,
    activeSpeaker: speaker,
  };

  if (releaseTimer) clearTimeout(releaseTimer);
  releaseTimer = setTimeout(() => releaseSpeaker(speaker), Math.max(3000, holdMs));

  psychLogger.debug("[B12.7.1][VoiceSpeakerMarked]", { speaker });
}

export function releaseSpeaker(speaker: VoiceSpeaker): void {
  if (state.activeSpeaker !== speaker) return;
  state = {
    ...state,
    activeSpeaker: null,
  };
}

export function resetVoiceCoordinator(): void {
  if (releaseTimer) clearTimeout(releaseTimer);
  releaseTimer = null;
  state = {
    lastSpeaker: null,
    lastSpokeAt: 0,
    activeSpeaker: null,
  };
}
