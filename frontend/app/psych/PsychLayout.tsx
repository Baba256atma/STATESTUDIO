"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import PsychTopBar from "./components/PsychTopBar";
import PsychScene from "./components/PsychScene";
import PsychChatPanel from "./components/PsychChatPanel";
import PsychDebugHUD from "./components/debug/PsychDebugHUD";
import PsychDevPanel from "./components/debug/PsychDevPanel";
import { createPsychStore } from "../lib/psych/reactionStore";
import { interpretUserInput } from "../lib/psych/reactionInterpreter";
import { applyReaction } from "../lib/psych/reactionEngine";
import type { ObjectState, PsychElementId, PsychState } from "../lib/psych/reactionTypes";
import { apiBase } from "../lib/apiBase";
import { getDominantPsychState, getStrongestVisualObject, mapPsychToVisual } from "./lib/visual/psychVisualMapping";
import { applyPsychDecay } from "./lib/time/psychTimeDecay";
import { calculatePsychGameState, type PsychGameState } from "./lib/game/psychGameScore";
import { clearPsychSessionSnapshot } from "./lib/memory/psychMemory";
import { canShowDeeperInsight, capPsychObjectsForAccess, type AccessMode } from "./lib/paywall/psychAccess";
import { interpretPsych, type PsychInterpretResult } from "./lib/api/psychApi";
import { mapChatToEmotion } from "./engine/emotionState";
import { emotionStore, setEmotionState, setPersonalityProfile, triggerEyeContact, triggerSceneReaction } from "./engine/useEmotionStore";
import { interpretMeaning, isMeaningLayerEnabled } from "./engine/meaningInterpreter";
import { DEFAULT_PERSONALITY_PROFILE, isAdaptivePersonalityEnabled, loadPersonalityProfile, savePersonalityProfile, updatePersonalityProfile, type PersonalityProfile } from "./engine/personalityProfile";
import { resetInnerDialogueEngine, updateInnerVoiceProfileFromUserInput, type InnerDialogueTone } from "./engine/innerDialogueEngine";
import { mapWordsToSceneReaction } from "./engine/sceneReactionMapping";
import { isSelfReflectionInput, resetEyeMemory, updateEyeMemoryFromInput } from "./engine/eyeMemory";
import { resetInspirationEngine, type InspirationSignal } from "./engine/inspirationEngine";
import { resetEgoVoiceEngine, type EgoVoiceTone } from "./engine/egoVoiceEngine";
import { resetVoiceCoordinator } from "./engine/voiceCoordinator";
import { applyVoiceMessageEffects, routeVoice, type Speaker, type VoiceMessage } from "./engine/elementVoiceRouter";
import { loadMemory, resetMemory, saveMemory, updateMemory, type SychoMemory } from "./engine/memoryEngine";
import { mapEmotionToElements } from "./engine/emotionElementMapping";
import { emotionInputFromStore } from "./engine/sceneAtmosphere";
import { accelerateAwakeningForInput, applyAwakeningToObjects, getNextAwakeningStage, hasSeenAwakening, markAwakeningSeen, resetAwakeningSeen, type AwakeningStage } from "./engine/awakeningFlow";
import { track } from "../lib/analytics/sychoAnalytics";
import { ENABLE_DEBUG_LOGS, ENABLE_MEMORY } from "../lib/featureFlags";
import { psychLogger } from "./engine/psychLogger";

const STORAGE_KEY_WIDTH = "psych:chatWidthPx";
const STORAGE_KEY_DRAWER = "psych:drawerHeightRatio";
const STORAGE_KEY_DRAWER_OPEN = "psych:drawerOpen";
const ONBOARDING_STORAGE_KEY = "sycho_seen_onboarding";
let layoutStorageWarned = false;

function safeSetLocalStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    if (process.env.NODE_ENV !== "production" && !layoutStorageWarned) {
      layoutStorageWarned = true;
      console.warn("[Sycho][SYCHO-B08][MemorySaveFailed]", { key, error });
    }
  }
}

const OBJECT_EXPLANATIONS: Record<string, string> = {
  fire: "Fire represents tension and drive.",
  liquid: "Liquid reflects calm and emotional flow.",
  water: "Liquid reflects calm and emotional flow.",
  air: "Air represents curiosity and thought.",
  earth: "Earth is stability and grounding.",
  sun: "Sun is your core energy.",
  ego: "Ego is your center of perception.",
};

const PSYCH_OBJECT_IDS: PsychElementId[] = ["fire", "water", "air", "earth", "sun", "ego"];
type PsychBackendElementId = PsychElementId | "liquid";

type PsychBackendAnalysis = {
  dominant_element: PsychBackendElementId;
  intensity: number;
  secondary_elements: PsychBackendElementId[];
  message: string;
};

type PsychMergeResult = {
  dominantObject: PsychElementId;
  backendDominant: PsychBackendElementId;
  frontendDominant: PsychElementId;
  intensity: number;
  strategy: "amplify" | "blend";
};

type PsychAssistantMessage = {
  id: number;
  text: string;
  role?: "assistant" | "system";
  source?: Speaker;
  tone?: InnerDialogueTone | EgoVoiceTone | "mystery" | "element";
};

const INITIAL_GAME_STATE: PsychGameState = {
  selfAwarenessScore: 8,
  balanceScore: 100,
  level: "Observer",
  achievements: [],
};

function clampObjectValue(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function boostObject(objects: Record<PsychElementId, ObjectState>, id: PsychElementId, brightness: number, activity: number): Record<PsychElementId, ObjectState> {
  return {
    ...objects,
    [id]: {
      ...objects[id],
      brightness: clampObjectValue((objects[id]?.brightness ?? 0.2) + brightness),
      activity: clampObjectValue((objects[id]?.activity ?? 0.1) + activity),
    },
  };
}

function psychBackendElementToObjectId(id: PsychBackendElementId): PsychElementId {
  return id === "liquid" ? "water" : id;
}

function boostPsychStateForElement(state: PsychState, id: PsychElementId, intensity: number): PsychState {
  const amount = Math.round(intensity * 12);
  if (id === "fire") return { ...state, tension: Math.min(100, state.tension + amount), energy: Math.min(100, state.energy + Math.round(amount * 0.35)) };
  if (id === "water") return { ...state, calm: Math.min(100, state.calm + amount), tension: Math.max(0, state.tension - Math.round(amount * 0.3)) };
  if (id === "air") return { ...state, curiosity: Math.min(100, state.curiosity + amount) };
  if (id === "sun") return { ...state, energy: Math.min(100, state.energy + amount) };
  if (id === "ego") return { ...state, tension: Math.min(100, state.tension + Math.round(amount * 0.45)), curiosity: Math.min(100, state.curiosity + Math.round(amount * 0.35)) };
  return { ...state, calm: Math.min(100, state.calm + Math.round(amount * 0.45)) };
}

function mergeBackendReaction(
  state: PsychState,
  objects: Record<PsychElementId, ObjectState>,
  backend: PsychBackendAnalysis,
  frontendDominant: PsychElementId
): { state: PsychState; objects: Record<PsychElementId, ObjectState>; merge: PsychMergeResult } {
  const backendDominant = psychBackendElementToObjectId(backend.dominant_element);
  const intensity = Math.max(0, Math.min(1, backend.intensity));
  const sameDominant = backendDominant === frontendDominant;
  let nextObjects = objects;

  if (sameDominant) {
    nextObjects = boostObject(nextObjects, backendDominant, intensity * 0.28, intensity * 0.24);
  } else {
    nextObjects = boostObject(nextObjects, backendDominant, intensity * 0.32 * 0.7, intensity * 0.3 * 0.7);
    nextObjects = boostObject(nextObjects, frontendDominant, intensity * 0.18 * 0.3, intensity * 0.16 * 0.3);
  }

  for (const secondary of backend.secondary_elements ?? []) {
    const id = psychBackendElementToObjectId(secondary);
    if (id !== backendDominant) nextObjects = boostObject(nextObjects, id, intensity * 0.05, intensity * 0.08);
  }

  if (backendDominant === "fire" && backend.secondary_elements?.includes("sun")) {
    nextObjects = boostObject(boostObject(nextObjects, "fire", 0.16, 0.14), "sun", 0.12, 0.08);
  }
  if (backendDominant === "sun" && backend.secondary_elements?.includes("fire")) {
    nextObjects = boostObject(boostObject(nextObjects, "sun", 0.18, 0.12), "fire", 0.1, 0.1);
  }

  return {
    state: boostPsychStateForElement(state, backendDominant, intensity),
    objects: nextObjects,
    merge: {
      dominantObject: backendDominant,
      backendDominant: backend.dominant_element,
      frontendDominant,
      intensity,
      strategy: sameDominant ? "amplify" : "blend",
    },
  };
}

function combinePsychMessages(localMessage: string, backendMessage: string): string {
  if (!backendMessage.trim()) return localMessage;
  if (localMessage.includes(backendMessage)) return localMessage;
  return `${localMessage} ${backendMessage}`;
}

function messageFromPsychInterpret(result: PsychInterpretResult): string {
  if (result.emotion === "sadness" || result.dominant_element === "water" && result.secondary_emotion === "grounding") return "Liquid is holding the sadness gently. Earth is keeping the field steady.";
  if (result.emotion === "purpose" || result.emotion === "direction") return "Sun is searching for clarity. Air is shaping the question, and Earth is asking for one real step.";
  if (result.emotion === "anger" && result.focus === "self") return "Fire is surging around the self. Ego is holding the center.";
  if (result.dominant_element === "fire") return "Fire is becoming dominant. Your tension is rising through the system.";
  if (result.dominant_element === "water") return "Liquid is calming the field.";
  if (result.dominant_element === "air") return "Air is moving faster — curiosity is active.";
  if (result.dominant_element === "ego") return "Ego is reacting at the center of perception.";
  if (result.dominant_element === "earth") return "Earth is asking for grounding.";
  return "Sun is warming the field.";
}

function calibratePsychInterpretFromInput(text: string, result: PsychInterpretResult): PsychInterpretResult {
  const normalized = text.toLowerCase();
  if (/\b(sad|sadness|lonely|alone|heavy|tired|exhausted|grief|down)\b/.test(normalized)) {
    return {
      ...result,
      emotion: "sadness",
      intensity: Math.max(result.intensity, 0.62),
      secondary_emotion: "grounding",
      focus: "self",
      dominant_element: "water",
      confidence: Math.max(result.confidence, 0.82),
    };
  }
  if (/\b(goal|direction|purpose|path|aim|mission)\b/.test(normalized)) {
    return {
      ...result,
      emotion: "purpose",
      intensity: Math.max(result.intensity, 0.58),
      secondary_emotion: "clarity",
      focus: "environment",
      dominant_element: "sun",
      confidence: Math.max(result.confidence, 0.78),
    };
  }
  if (/\b(fear|scared|afraid|anxious|anxiety)\b/.test(normalized) && result.dominant_element === "fire") {
    return {
      ...result,
      emotion: "fear",
      dominant_element: "water",
      secondary_emotion: "grounding",
      confidence: Math.max(result.confidence, 0.76),
    };
  }
  return result;
}

function applyPsychInterpretResult(
  state: PsychState,
  objects: Record<PsychElementId, ObjectState>,
  result: PsychInterpretResult
): { state: PsychState; objects: Record<PsychElementId, ObjectState>; dominantObject: PsychElementId; message: string } {
  const intensity = Math.max(0, Math.min(1, result.intensity));
  const dominantObject = result.dominant_element;
  let nextObjects = boostObject(objects, dominantObject, intensity * 0.42, intensity * 0.34);
  let nextState = boostPsychStateForElement(state, dominantObject, intensity);

  if (result.focus === "self") {
    nextObjects = boostObject(nextObjects, "ego", intensity * 0.22, intensity * 0.18);
  } else if (result.focus === "environment") {
    nextObjects = boostObject(nextObjects, "sun", intensity * 0.18, intensity * 0.12);
  } else {
    for (const id of PSYCH_OBJECT_IDS) {
      nextObjects = boostObject(nextObjects, id, intensity * 0.035, intensity * 0.03);
    }
  }

  if (result.emotion === "fear" && dominantObject === "air") {
    nextObjects = boostObject(nextObjects, "ego", intensity * 0.22, intensity * 0.22);
  }
  if (result.emotion === "sadness" || result.secondary_emotion === "grounding") {
    nextObjects = boostObject(nextObjects, "water", intensity * 0.3, intensity * 0.12);
    nextObjects = boostObject(nextObjects, "earth", intensity * 0.18, intensity * 0.08);
    nextObjects = {
      ...nextObjects,
      fire: {
        ...nextObjects.fire,
        brightness: Math.max(0.08, nextObjects.fire.brightness * 0.72),
        activity: Math.max(0.06, nextObjects.fire.activity * 0.7),
      },
      sun: {
        ...nextObjects.sun,
        brightness: Math.max(0.08, nextObjects.sun.brightness * 0.82),
        activity: Math.max(0.06, nextObjects.sun.activity * 0.82),
      },
    };
    nextState = {
      ...nextState,
      calm: Math.min(100, nextState.calm + Math.round(intensity * 8)),
      tension: Math.max(0, nextState.tension - Math.round(intensity * 5)),
    };
  }
  if (result.emotion === "purpose" || result.emotion === "direction") {
    nextObjects = boostObject(nextObjects, "air", intensity * 0.18, intensity * 0.16);
    nextObjects = boostObject(nextObjects, "earth", intensity * 0.14, intensity * 0.08);
  }
  if (result.emotion === "anger" && result.focus === "self") {
    nextObjects = boostObject(nextObjects, "fire", intensity * 0.36, intensity * 0.32);
    nextObjects = boostObject(nextObjects, "ego", intensity * 0.34, intensity * 0.16);
    nextState = {
      ...nextState,
      tension: Math.min(100, nextState.tension + Math.round(intensity * 10)),
      energy: Math.min(100, nextState.energy + Math.round(intensity * 6)),
    };
  }

  return {
    state: nextState,
    objects: nextObjects,
    dominantObject,
    message: messageFromPsychInterpret(result),
  };
}

function amplifyLocalPsychReaction(
  text: string,
  state: PsychState,
  objects: Record<PsychElementId, ObjectState>
): { state: PsychState; objects: Record<PsychElementId, ObjectState>; message?: string } {
  const normalized = text.toLowerCase();
  const hasQuestion = /\b(why|curious|curiosity|wonder|question|confused|confusion)\b/.test(normalized);
  const hasFear = /\b(fear|afraid|scared|scary|anxious|anxiety)\b/.test(normalized);
  const hasSelf = /\b(self|identity|ego|me|myself|who am i|i am)\b/.test(normalized);

  if (hasFear && hasQuestion) {
    return {
      state: { ...state, curiosity: Math.min(100, state.curiosity + 20), tension: Math.min(100, state.tension + 14) },
      objects: boostObject(boostObject(objects, "air", 0.24, 0.36), "ego", 0.3, 0.3),
      message: "Air is moving faster — curiosity is active. Ego is reacting to fear.",
    };
  }

  if (hasFear || hasSelf) {
    return {
      state: { ...state, tension: Math.min(100, state.tension + 16), curiosity: hasSelf ? Math.min(100, state.curiosity + 8) : state.curiosity },
      objects: boostObject(boostObject(objects, "ego", 0.38, 0.32), "fire", hasFear ? 0.18 : 0.08, hasFear ? 0.18 : 0.08),
      message: hasFear ? "Ego is reacting to fear. The center is glowing warmer." : "Ego is becoming dominant. Your center of perception is active.",
    };
  }

  if (/\b(sad|sadness|lonely|alone|heavy|tired|exhausted|grief|down)\b/.test(normalized)) {
    const softenedFire = {
      ...objects.fire,
      brightness: Math.max(0.08, objects.fire.brightness * 0.72),
      activity: Math.max(0.06, objects.fire.activity * 0.68),
    };
    const softenedSun = {
      ...objects.sun,
      brightness: Math.max(0.08, objects.sun.brightness * 0.82),
      activity: Math.max(0.06, objects.sun.activity * 0.82),
    };
    return {
      state: { ...state, calm: Math.min(100, state.calm + 18), tension: Math.max(0, state.tension - 6) },
      objects: boostObject(boostObject({ ...objects, fire: softenedFire, sun: softenedSun }, "water", 0.38, 0.14), "earth", 0.22, 0.08),
      message: "Liquid is holding the sadness gently. Earth is keeping the field steady.",
    };
  }

  if (/\b(angry|anger|mad|rage|furious|frustrated|irritated|stress|pressure)\b/.test(normalized)) {
    return {
      state: { ...state, tension: Math.min(100, state.tension + 25), energy: Math.min(100, state.energy + 8) },
      objects: boostObject(boostObject(objects, "fire", 0.35, 0.38), "ego", 0.12, 0.14),
      message: "Your tension is rising through the system. Fire is becoming dominant.",
    };
  }

  if (/\b(calm|peace|peaceful|relaxed|soft|safe|steady)\b/.test(normalized)) {
    return {
      state: { ...state, calm: Math.min(100, state.calm + 16), tension: Math.max(0, state.tension - 8) },
      objects: boostObject(objects, "water", 0.32, 0.12),
      message: "Your calm is expanding. Liquid is becoming dominant.",
    };
  }

  if (/\b(goal|direction|purpose|path|aim|mission)\b/.test(normalized)) {
    return {
      state: { ...state, curiosity: Math.min(100, state.curiosity + 12), energy: Math.min(100, state.energy + 12) },
      objects: boostObject(boostObject(boostObject(objects, "sun", 0.28, 0.16), "air", 0.2, 0.18), "earth", 0.14, 0.08),
      message: "Sun is searching for clarity. Air is shaping the question, and Earth is asking for one real step.",
    };
  }

  if (hasQuestion || /\b(think|thinking)\b/.test(normalized)) {
    return {
      state: { ...state, curiosity: Math.min(100, state.curiosity + 18) },
      objects: boostObject(objects, "air", 0.18, 0.34),
      message: "Air is moving faster — curiosity is active.",
    };
  }

  if (/\b(energy|alive|excited|hope|bright|power)\b/.test(normalized)) {
    return {
      state: { ...state, energy: Math.min(100, state.energy + 18) },
      objects: boostObject(objects, "sun", 0.28, 0.18),
      message: "Your energy is brightening. Sun is becoming dominant.",
    };
  }

  return { state: { ...state, energy: Math.min(100, state.energy + 8) }, objects: boostObject(objects, "sun", 0.12, 0.08), message: "Sun is warming the field." };
}

export default function PsychLayout(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const storeRef = useRef<ReturnType<typeof createPsychStore> | null>(null);
  if (storeRef.current == null) storeRef.current = createPsychStore();
  const psychStore = storeRef.current;
  const [psychState, setPsychState] = useState<PsychState>(() => psychStore.getState());
  const [psychObjects, setPsychObjects] = useState<Record<PsychElementId, ObjectState>>(() => psychStore.getObjects());
  const [lastInput, setLastInput] = useState<string | null>(null);
  const [lastReaction, setLastReaction] = useState<string | null>(null);
  const [lastDecayAt, setLastDecayAt] = useState<number | null>(null);
  const [decayActive, setDecayActive] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [objectClickCount, setObjectClickCount] = useState(0);
  const [gameState, setGameState] = useState<PsychGameState>(INITIAL_GAME_STATE);
  const [accessMode, setAccessMode] = useState<AccessMode>("free");
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState<PsychAssistantMessage | null>(null);
  const [memoryPresent, setMemoryPresent] = useState(false);
  const [memoryWriteDisabled, setMemoryWriteDisabled] = useState(false);
  const [lastMemorySavedAt, setLastMemorySavedAt] = useState<number | null>(null);
  const [lastClickedObject, setLastClickedObject] = useState<string | null>(null);
  const [lastEventType, setLastEventType] = useState<"chat" | "click" | "decay" | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<PsychElementId | null>(null);
  const [backendDominant, setBackendDominant] = useState<string | null>(null);
  const [backendMergeResult, setBackendMergeResult] = useState<string | null>(null);
  const [inspirationSignal, setInspirationSignal] = useState<InspirationSignal | null>(null);
  const [chatWidthPx, setChatWidthPx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const startWidth = useRef<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [drawerRatio, setDrawerRatio] = useState<number>(0.5);
  const [layoutStorageReady, setLayoutStorageReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [awakeningStage, setAwakeningStage] = useState<AwakeningStage>("free_mode");
  const psychStateRef = useRef(psychState);
  const psychObjectsRef = useRef(psychObjects);
  const gameStateRef = useRef(gameState);
  const lastInputRef = useRef(lastInput);
  const lastReactionRef = useRef(lastReaction);
  const interactionCountRef = useRef(0);
  const objectClickCountRef = useRef(0);
  const accessModeRef = useRef<AccessMode>("free");
  const lastInteractionAtRef = useRef(0);
  const lastChatActivityAtRef = useRef(0);
  const clickedVoiceObjectRef = useRef<Speaker | null>(null);
  const pendingVoiceThemeCountRef = useRef(false);
  const lastDecayMemorySaveAtRef = useRef(0);
  const unlockPromptLoggedRef = useRef(false);
  const selectedObjectTimeoutRef = useRef<number | null>(null);
  const backendAbortRef = useRef<AbortController | null>(null);
  const backendDebounceRef = useRef<number | null>(null);
  const lastEmotionInputRef = useRef<string | null>(null);
  const lastEmotionAppliedAtRef = useRef(0);
  const personalityProfileRef = useRef<PersonalityProfile>({ ...DEFAULT_PERSONALITY_PROFILE });
  const personalityInputCountRef = useRef(0);
  const lastPersonalityUpdateAtRef = useRef(0);
  const sychoMemoryRef = useRef<SychoMemory | null>(null);
  const firstInputTrackedRef = useRef(false);
  const emptyIntroSentRef = useRef(false);
  const pendingMemorySaveRef = useRef(false);
  const memorySaveTimerRef = useRef<number | null>(null);

  const applyEmotionFromChat = (text: string) => {
    const normalizedInput = text.trim().toLowerCase();
    const now = Date.now();
    if (!normalizedInput || normalizedInput === lastEmotionInputRef.current) return;
    if (now - lastEmotionAppliedAtRef.current < 260) return;

    const emotion = mapChatToEmotion(text);
    const meaning = isMeaningLayerEnabled() ? interpretMeaning(text) : undefined;
    const adaptiveEnabled = isAdaptivePersonalityEnabled();
    let profile = adaptiveEnabled ? personalityProfileRef.current : DEFAULT_PERSONALITY_PROFILE;

    if (adaptiveEnabled && meaning) {
      personalityInputCountRef.current += 1;
      if (personalityInputCountRef.current % 3 === 0 && now - lastPersonalityUpdateAtRef.current > 1200) {
        profile = updatePersonalityProfile(personalityProfileRef.current, emotion, meaning);
        personalityProfileRef.current = profile;
        lastPersonalityUpdateAtRef.current = now;
        savePersonalityProfile(profile);
        if (process.env.NODE_ENV !== "production") {
          console.log("[Sycho][B12.6][PersonalityUpdate]", profile);
        }
      }
    }

    setEmotionState(emotion, meaning, profile, adaptiveEnabled);
    const eyeMemory = updateEyeMemoryFromInput(text);
    if (isSelfReflectionInput(text) || normalizedInput.includes("what am i") || normalizedInput.includes("why")) {
      const memoryBoost = eyeMemory?.familiarity ?? 0;
      const triggerIntensity = Math.max(0.72, Math.min(1, emotion.intensity * 0.72 + (meaning?.weight ?? 0.35) * 0.45 + memoryBoost * 0.12));
      triggerEyeContact(triggerIntensity);
      if (process.env.NODE_ENV !== "production") {
        console.log("[Sycho][B12.8][EyeContactTriggered]", {
          intensity: Number(triggerIntensity.toFixed(3)),
        });
      }
    }
    updateInnerVoiceProfileFromUserInput(text);
    lastEmotionInputRef.current = normalizedInput;
    lastEmotionAppliedAtRef.current = now;
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][B12.4][EmotionApplied]", emotion);
      if (meaning) console.log("[Sycho][B12.5][MeaningApplied]", meaning);
    }
  };

  const appendRoutedVoiceMessage = (message: VoiceMessage, userInput: string | null) => {
    const now = Date.now();
    if (message.inspiration) setInspirationSignal(message.inspiration);
    if (message.text.trim()) {
      setAssistantMessage({
        id: now,
        text: message.text,
        role: "system",
        source: message.source,
        tone: message.tone,
      });
      track("message_emitted", { source: message.source, tone: message.tone });
    }
    applyVoiceMessageEffects(message, userInput);
  };

  useEffect(() => {
    const adaptiveEnabled = isAdaptivePersonalityEnabled();
    const profile = adaptiveEnabled ? loadPersonalityProfile() : { ...DEFAULT_PERSONALITY_PROFILE };
    personalityProfileRef.current = profile;
    setPersonalityProfile(profile, adaptiveEnabled);
    sychoMemoryRef.current = ENABLE_MEMORY ? loadMemory() : null;
  }, []);

  const scheduleMemorySave = (reason: string, source: "interaction" | "decay" = "interaction") => {
    const now = Date.now();
    if (source === "decay" && now - lastDecayMemorySaveAtRef.current < 20000) return;

    pendingMemorySaveRef.current = true;
    if (memorySaveTimerRef.current != null) {
      window.clearTimeout(memorySaveTimerRef.current);
    }

    memorySaveTimerRef.current = window.setTimeout(() => {
      if (!pendingMemorySaveRef.current) return;
      pendingMemorySaveRef.current = false;
      memorySaveTimerRef.current = null;

      try {
        const ok = ENABLE_MEMORY && sychoMemoryRef.current ? saveMemory(sychoMemoryRef.current) : false;
        if (ok) {
          const savedAt = Date.now();
          if (source === "decay") lastDecayMemorySaveAtRef.current = savedAt;
          setMemoryPresent(true);
          setLastMemorySavedAt(savedAt);
        }
      } catch (error) {
        if (ENABLE_DEBUG_LOGS) console.warn("[Sycho][Launch][ErrorGuard]", { reason, error });
      }
    }, 800);
  };

  const applyDecayNow = (deltaSeconds: number, now: number) => {
    const previousObjects = psychObjectsRef.current;
    const result = applyPsychDecay({
      psychState: psychStateRef.current,
      objects: previousObjects,
      deltaSeconds,
    });
    const changedObjectIds = (Object.keys(result.objects) as PsychElementId[]).filter((id) => {
      const before = previousObjects[id];
      const after = result.objects[id];
      return Math.abs(before.brightness - after.brightness) > 0.001 || Math.abs(before.activity - after.activity) > 0.001;
    });
    const stateChanged = Object.entries(result.psychState).some(([key, value]) => Math.abs(psychStateRef.current[key as keyof PsychState] - value) > 0.001);

    psychStateRef.current = result.psychState;
    psychObjectsRef.current = result.objects;
    const nextGameState = calculatePsychGameState({
      psychState: result.psychState,
      objects: result.objects,
      interactionCount: interactionCountRef.current,
      objectClickCount: objectClickCountRef.current,
    });
    setPsychState(result.psychState);
    setPsychObjects(result.objects);
    setGameState(nextGameState);
    setLastDecayAt(now);
    setDecayActive(true);
    setLastEventType("decay");
    if (stateChanged || changedObjectIds.length > 0) {
      gameStateRef.current = nextGameState;
      scheduleMemorySave("decay", "decay");
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][SYCHO-B06][DecayApplied]", { changedObjectIds });
      console.log("[Sycho][SYCHO-B07][GameScoreUpdated]", nextGameState);
    }
  };

  const maybeShowUnlockPrompt = (nextInteractionCount: number, nextObjectClickCount: number) => {
    // ## SYCHO_FUTURE_PAYMENT:
    // This is a soft MVP unlock layer.
    // Future version should connect to real payment/subscription after product validation.
    if (accessMode !== "free" || showUnlockPrompt) return;
    if (nextInteractionCount < 3 && nextObjectClickCount < 2) return;

    setShowUnlockPrompt(true);
    if (process.env.NODE_ENV !== "production" && !unlockPromptLoggedRef.current) {
      unlockPromptLoggedRef.current = true;
      console.log("[Sycho][SYCHO-B09][UnlockPromptShown]");
    }
  };

  useEffect(() => {
    psychStateRef.current = psychState;
  }, [psychState]);

  useEffect(() => {
    psychObjectsRef.current = psychObjects;
  }, [psychObjects]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    lastInputRef.current = lastInput;
  }, [lastInput]);

  useEffect(() => {
    lastReactionRef.current = lastReaction;
  }, [lastReaction]);

  useEffect(() => {
    accessModeRef.current = accessMode;
  }, [accessMode]);

  useEffect(() => {
    const now = Date.now();
    if (lastInteractionAtRef.current === 0) lastInteractionAtRef.current = now;
    if (lastChatActivityAtRef.current === 0) lastChatActivityAtRef.current = now;
    setIsClient(true);
    const updateResponsiveLayout = () => {
      setIsMobileLayout(window.innerWidth <= 768);
    };

    updateResponsiveLayout();
    window.addEventListener("resize", updateResponsiveLayout);
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-B02][LayoutReady]");
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-B11][PolishApplied]");
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-B12.2][MagneticPolishApplied]");
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-B12.1-FIX-02][ClientLayoutReady]");
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.8-FIX][LegacyCallsRemoved]");

    return () => window.removeEventListener("resize", updateResponsiveLayout);
  }, []);

  useEffect(() => {
    try {
      setShowOnboarding(window.localStorage.getItem(ONBOARDING_STORAGE_KEY) !== "true");
    } catch {
      setShowOnboarding(true);
    }
    if (!hasSeenAwakening()) {
      setAwakeningStage("not_started");
      if (process.env.NODE_ENV !== "production") console.log("[Sycho][v1-FIX][AwakeningStarted]");
    }

    const introTimer = window.setTimeout(() => {
      if (lastInputRef.current || emptyIntroSentRef.current) return;
      emptyIntroSentRef.current = true;
      const message: PsychAssistantMessage = {
        id: Date.now(),
        text: "I'm here. Say something true, even if it is small.",
        role: "system",
        source: "ego",
        tone: "inner",
      };
      setAssistantMessage(message);
      track("message_emitted", { source: "ego", tone: "inner", kind: "empty_intro" });
    }, 1400);

    return () => window.clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (awakeningStage === "free_mode") return;
    const delay = awakeningStage === "not_started" ? 900 : 5200;
    const timer = window.setTimeout(() => {
      setAwakeningStage((current) => {
        const next = getNextAwakeningStage(current);
        if (next === "free_mode") markAwakeningSeen();
        if (process.env.NODE_ENV !== "production") console.log("[Sycho][v1-FIX][ObjectAwakened]", { stage: next });
        return next;
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [awakeningStage]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WIDTH);
    if (saved) setChatWidthPx(parseInt(saved, 10));
    const dr = localStorage.getItem(STORAGE_KEY_DRAWER);
    if (dr) setDrawerRatio(parseFloat(dr));
    const drawerOpen = localStorage.getItem(STORAGE_KEY_DRAWER_OPEN);
    if (drawerOpen) setIsMobileDrawerOpen(drawerOpen === "true");
    setLayoutStorageReady(true);
  }, []);

  useEffect(() => {
    if (!layoutStorageReady) return;
    if (chatWidthPx != null) safeSetLocalStorage(STORAGE_KEY_WIDTH, String(chatWidthPx));
  }, [chatWidthPx, layoutStorageReady]);

  useEffect(() => {
    if (!layoutStorageReady) return;
    safeSetLocalStorage(STORAGE_KEY_DRAWER, String(drawerRatio));
  }, [drawerRatio, layoutStorageReady]);

  useEffect(() => {
    if (!layoutStorageReady) return;
    safeSetLocalStorage(STORAGE_KEY_DRAWER_OPEN, String(isMobileDrawerOpen));
  }, [isMobileDrawerOpen, layoutStorageReady]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      // ## SYCHO_TIME_DECAY:
      // Scene slowly returns toward shadow/dark state when user is inactive.
      // Do not remove; future backend memory should refine decay speed.
      const now = Date.now();
      const idleSeconds = (now - lastInteractionAtRef.current) / 1000;
      if (idleSeconds < 6) {
        setDecayActive(false);
        return;
      }

      applyDecayNow(Math.min(5, idleSeconds), now);
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = Date.now();
      const latestUserActivity = Math.max(lastInteractionAtRef.current, lastChatActivityAtRef.current);
      const idleForMs = now - latestUserActivity;
      const currentEmotion = emotionStore.current;
      const clickedObject = clickedVoiceObjectRef.current;
      const countTheme = pendingVoiceThemeCountRef.current;
      pendingVoiceThemeCountRef.current = false;
      let currentMemory: SychoMemory | null = ENABLE_MEMORY ? sychoMemoryRef.current ?? loadMemory() : null;
      let memoryUpdatedThisCycle = false;
      if (ENABLE_MEMORY && currentMemory && (countTheme || clickedObject)) {
        const currentScores = mapEmotionToElements(emotionInputFromStore(currentEmotion));
        currentMemory = updateMemory(currentMemory, currentScores);
        sychoMemoryRef.current = currentMemory;
        memoryUpdatedThisCycle = true;
      }
      let routedMessage: VoiceMessage | null = null;
      try {
        routedMessage = routeVoice({
          now,
          lastUserInput: lastInputRef.current ?? "",
          clickedObject,
          idleTime: idleForMs,
          isTyping: idleForMs < 1200,
          countTheme,
          emotion: {
            intensity: currentEmotion.intensity,
            type: currentEmotion.meaning.type,
          },
          memory: currentMemory,
        });
      } catch (error) {
        if (ENABLE_DEBUG_LOGS) console.warn("[Sycho][Launch][ErrorGuard]", error);
        if (memoryUpdatedThisCycle && currentMemory) scheduleMemorySave("voice_route_error");
        return;
      }
      if (!routedMessage) {
        if (memoryUpdatedThisCycle && currentMemory) scheduleMemorySave("voice_route_no_message");
        return;
      }
      if (ENABLE_MEMORY && currentMemory && routedMessage.source !== "ego" && routedMessage.source !== "oracle" && routedMessage.source !== "whisper") {
        sychoMemoryRef.current = currentMemory;
      }
      if (memoryUpdatedThisCycle && currentMemory) scheduleMemorySave("voice_route");
      if (clickedObject && routedMessage.source === clickedObject) {
        clickedVoiceObjectRef.current = null;
        if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.8-FIX][ClickedObjectRouted]", { objectId: clickedObject });
      }
      appendRoutedVoiceMessage(routedMessage, lastInputRef.current);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (selectedObjectTimeoutRef.current != null) window.clearTimeout(selectedObjectTimeoutRef.current);
      if (backendDebounceRef.current != null) window.clearTimeout(backendDebounceRef.current);
      if (memorySaveTimerRef.current != null) window.clearTimeout(memorySaveTimerRef.current);
      backendAbortRef.current?.abort();
    };
  }, []);

  const requestBackendAnalysis = (
    text: string,
    localMessage: string,
    localState: PsychState,
    localObjects: Record<PsychElementId, ObjectState>,
    frontendDominant: PsychElementId
  ) => {
    if (backendDebounceRef.current != null) window.clearTimeout(backendDebounceRef.current);
    backendAbortRef.current?.abort();

    backendDebounceRef.current = window.setTimeout(() => {
      const controller = new AbortController();
      backendAbortRef.current = controller;
      const payload = {
        text,
        current_state: localState,
        objects: Object.values(localObjects).map((object) => ({
          id: object.id === "water" ? "liquid" : object.id,
          brightness: object.brightness,
          activity: object.activity,
        })),
      };

      if (process.env.NODE_ENV !== "production") {
        console.log("[Sycho][SYCHO-B12][BackendRequest]", payload);
      }

      fetch(`${apiBase()}/psych/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) throw new Error(`Psych backend failed: ${response.status}`);
          return response.json() as Promise<PsychBackendAnalysis>;
        })
        .then((backend) => {
          if (controller.signal.aborted) return;
          if (process.env.NODE_ENV !== "production") {
            console.log("[Sycho][SYCHO-B12][BackendResponse]", backend);
          }

          const merged = mergeBackendReaction(psychStateRef.current, psychObjectsRef.current, backend, frontendDominant);
          const finalMessage = combinePsychMessages(localMessage, backend.message);
          const nextGameState = calculatePsychGameState({
            psychState: merged.state,
            objects: merged.objects,
            interactionCount: interactionCountRef.current,
            objectClickCount: objectClickCountRef.current,
          });

          psychStateRef.current = merged.state;
          psychObjectsRef.current = merged.objects;
          lastReactionRef.current = finalMessage;
          setPsychState(merged.state);
          setPsychObjects(merged.objects);
          setGameState(nextGameState);
          gameStateRef.current = nextGameState;
          setLastReaction(finalMessage);
          setAssistantMessage({ id: Date.now(), text: finalMessage });
          track("message_emitted", { source: "assistant", path: "backend_refine" });
          triggerSceneReaction(mapWordsToSceneReaction({
            source: "chat",
            text: finalMessage,
            emotion: emotionStore.current,
            userInput: lastInputRef.current,
          }));
          setSelectedObjectId(merged.merge.dominantObject);
          if (selectedObjectTimeoutRef.current != null) window.clearTimeout(selectedObjectTimeoutRef.current);
          selectedObjectTimeoutRef.current = window.setTimeout(() => setSelectedObjectId(null), 460);
          setBackendDominant(backend.dominant_element);
          setBackendMergeResult(`${merged.merge.strategy}:${merged.merge.frontendDominant}->${merged.merge.dominantObject}@${merged.merge.intensity.toFixed(2)}`);
          scheduleMemorySave("backend_refine");

          if (process.env.NODE_ENV !== "production") {
            console.log("[Sycho][SYCHO-B12][ReactionMerged]", merged.merge);
          }
        })
        .catch((error) => {
          if (controller.signal.aborted) return;
          if (process.env.NODE_ENV !== "production") {
            console.warn("[Sycho][SYCHO-B12][BackendFailed]", error);
          }
        });
    }, 360);
  };

  // Drag handlers
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const width = Math.max(280, Math.min(rect.width * 0.55, rect.right - clientX));
      setChatWidthPx(width);
    }
    function onUp() {
      setIsDragging(false);
      dragStartX.current = null;
      startWidth.current = null;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    startWidth.current = chatWidthPx ?? (containerRef.current ? containerRef.current.clientWidth * 0.3 : 360);
  };

  const handleChatActivity = () => {
    lastChatActivityAtRef.current = Date.now();
  };

  const routeClickedObjectImmediately = (clickedObject: Speaker) => {
    const now = Date.now();
    const currentEmotion = emotionStore.current;
    let currentMemory: SychoMemory | null = ENABLE_MEMORY ? sychoMemoryRef.current ?? loadMemory() : null;

    if (ENABLE_MEMORY && currentMemory) {
      const currentScores = mapEmotionToElements(emotionInputFromStore(currentEmotion));
      currentMemory = updateMemory(currentMemory, currentScores);
      sychoMemoryRef.current = currentMemory;
    }

    let routedMessage: VoiceMessage | null = null;
    try {
      routedMessage = routeVoice({
        now,
        lastUserInput: lastInputRef.current ?? "",
        clickedObject,
        idleTime: 0,
        isTyping: false,
        countTheme: false,
        emotion: {
          intensity: currentEmotion.intensity,
          type: currentEmotion.meaning.type,
        },
        memory: currentMemory,
      });
    } catch (error) {
      if (ENABLE_DEBUG_LOGS) console.warn("[Sycho][Launch][ErrorGuard]", error);
      clickedVoiceObjectRef.current = null;
      return;
    }

    clickedVoiceObjectRef.current = null;
    if (!routedMessage) return;
    appendRoutedVoiceMessage(routedMessage, lastInputRef.current);
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.8-FIX][ClickedObjectRouted]", { objectId: clickedObject });
  };

  const handleSendMessage = async (text: string): Promise<string | void> => {
    // ## SYCHO_FUTURE_BACKEND:
    // Backend interpretation is the primary structured signal for this integration.
    // Do not remove when backend AI is added.
    // If backend fails, the existing local reaction remains the safe fallback.
    const previousObjects = psychObjectsRef.current;
    applyEmotionFromChat(text);
    lastInteractionAtRef.current = Date.now();
    lastChatActivityAtRef.current = lastInteractionAtRef.current;
    setDecayActive(false);
    setLastEventType("chat");
    setLastInput(text);
    lastInputRef.current = text;
    pendingVoiceThemeCountRef.current = true;
    setAwakeningStage((current) => {
      const next = accelerateAwakeningForInput(text, current);
      if (next !== current && process.env.NODE_ENV !== "production") console.log("[Sycho][v1-FIX][ObjectAwakened]", { stage: next, input: text });
      return next;
    });
    if (!firstInputTrackedRef.current) {
      firstInputTrackedRef.current = true;
      track("first_input");
    }
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][SYCHO-B04][ChatInput]", { input: text });
    }

    const nextInteractionCount = interactionCountRef.current + 1;
    interactionCountRef.current = nextInteractionCount;
    setInteractionCount(nextInteractionCount);

    try {
      if (backendDebounceRef.current != null) window.clearTimeout(backendDebounceRef.current);
      backendAbortRef.current?.abort();
      const controller = new AbortController();
      backendAbortRef.current = controller;
      const interpreted = calibratePsychInterpretFromInput(text, await interpretPsych(text, controller.signal));
      if (controller.signal.aborted) return;

      const mapped = applyPsychInterpretResult(psychStateRef.current, previousObjects, interpreted);
      const finalReactionMessage = !canShowDeeperInsight(accessMode) && nextInteractionCount >= 3
        ? "I can sense a deeper pattern, but this layer is locked."
        : mapped.message;
      const nextGameState = calculatePsychGameState({
        psychState: mapped.state,
        objects: mapped.objects,
        interactionCount: nextInteractionCount,
        objectClickCount: objectClickCountRef.current,
      });

      psychStateRef.current = mapped.state;
      psychObjectsRef.current = mapped.objects;
      lastReactionRef.current = finalReactionMessage;
      setPsychState(mapped.state);
      setPsychObjects(mapped.objects);
      setLastReaction(finalReactionMessage);
      setGameState(nextGameState);
      gameStateRef.current = nextGameState;
      setSelectedObjectId(mapped.dominantObject);
      if (selectedObjectTimeoutRef.current != null) window.clearTimeout(selectedObjectTimeoutRef.current);
      selectedObjectTimeoutRef.current = window.setTimeout(() => setSelectedObjectId(null), 430);
      setBackendDominant(interpreted.dominant_element);
      setBackendMergeResult(`interpret:${interpreted.focus}->${mapped.dominantObject}@${interpreted.intensity.toFixed(2)}`);
      triggerSceneReaction(mapWordsToSceneReaction({
        source: "chat",
        text: finalReactionMessage,
        emotion: emotionStore.current,
        userInput: text,
      }));
      scheduleMemorySave("chat_backend");
      maybeShowUnlockPrompt(nextInteractionCount, objectClickCountRef.current);
      track("message_emitted", { source: "assistant", path: "backend_interpret" });

      if (process.env.NODE_ENV !== "production") {
        console.log("[Sycho][B12][FrontendApplied]", {
          input: text,
          interpreted,
          dominantObject: mapped.dominantObject,
        });
        if (interpreted.emotion === "anger" && interpreted.focus === "self") {
          console.log("[Sycho][B12][CinematicFireEgo]", {
            intensity: interpreted.intensity,
            fire: mapped.objects.fire,
            ego: mapped.objects.ego,
          });
        }
        console.log("[Sycho][SYCHO-B07][GameScoreUpdated]", nextGameState);
      }

      return finalReactionMessage;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Sycho][B12][BackendFailedFallback]", error);
      }
    }

    const reaction = interpretUserInput(text);
    const applied = applyReaction(psychStateRef.current, previousObjects, reaction);
    const amplified = amplifyLocalPsychReaction(text, applied.nextState, applied.nextObjects);
    const result = {
      state: amplified.state,
      objects: amplified.objects,
      reaction,
    };
    const reactionMessage = amplified.message ?? result.reaction.message ?? "Your inner system is shifting.";
    const finalReactionMessage = !canShowDeeperInsight(accessMode) && nextInteractionCount >= 3
      ? "I can sense a deeper pattern, but this layer is locked."
      : reactionMessage;
    const visualMap = mapPsychToVisual({ psychState: result.state, objects: result.objects });
    const dominantState = getDominantPsychState(result.state);
    const strongestObject = getStrongestVisualObject(visualMap);
    setSelectedObjectId(strongestObject);
    if (selectedObjectTimeoutRef.current != null) window.clearTimeout(selectedObjectTimeoutRef.current);
    selectedObjectTimeoutRef.current = window.setTimeout(() => setSelectedObjectId(null), 380);
    setPsychState(result.state);
    setPsychObjects(result.objects);
    psychStateRef.current = result.state;
    psychObjectsRef.current = result.objects;
    setLastReaction(finalReactionMessage);
    lastReactionRef.current = finalReactionMessage;
    const nextGameState = calculatePsychGameState({
      psychState: result.state,
      objects: result.objects,
      interactionCount: nextInteractionCount,
      objectClickCount: objectClickCountRef.current,
    });
    setGameState(nextGameState);
    gameStateRef.current = nextGameState;
    scheduleMemorySave("chat_local");
    triggerSceneReaction(mapWordsToSceneReaction({
      source: "chat",
      text: finalReactionMessage,
      emotion: emotionStore.current,
      userInput: text,
    }));
    maybeShowUnlockPrompt(nextInteractionCount, objectClickCountRef.current);
    track("message_emitted", { source: "assistant", path: "local_fallback" });

    const changedObjectIds = (Object.keys(result.objects) as PsychElementId[]).filter((id) => {
      const before = previousObjects[id];
      const after = result.objects[id];
      return before.brightness !== after.brightness || before.activity !== after.activity;
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][SYCHO-B04][ReactionApplied]", {
        input: text,
        psychState: result.state,
        changedObjectIds,
      });
      console.log("[Sycho][SYCHO-B11.5][DominantReaction]", {
        dominantState,
        dominantObject: strongestObject,
      });
      console.log("[Sycho][SYCHO-B05][VisualMappingApplied]", {
        dominantState,
        strongestObject,
      });
      console.log("[Sycho][SYCHO-B07][GameScoreUpdated]", nextGameState);
    }

    return finalReactionMessage;
  };

  const handleObjectClick = (id: string) => {
    const clickStart = typeof performance !== "undefined" ? performance.now() : Date.now();
    // ## SYCHO_FUTURE_BACKEND:
    // Object click explanation is local for now.
    // In future, backend AI should generate deeper symbolic meaning.
    const explanation = OBJECT_EXPLANATIONS[id] ?? "This object reflects part of the current inner scene.";
    const normalizedId = id === "liquid" ? "water" : PSYCH_OBJECT_IDS.includes(id as PsychElementId) ? (id as PsychElementId) : null;
    clickedVoiceObjectRef.current = normalizedId ? (normalizedId as Speaker) : null;
    track("object_click", { element: normalizedId ?? id });
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.8-FIX][ObjectClickHit]", { objectId: normalizedId ?? id });
    setLastClickedObject(id);
    setSelectedObjectId(normalizedId);
    if (selectedObjectTimeoutRef.current != null) window.clearTimeout(selectedObjectTimeoutRef.current);
    selectedObjectTimeoutRef.current = window.setTimeout(() => setSelectedObjectId(null), 280);
    setLastEventType("click");
    const nextObjectClickCount = objectClickCountRef.current + 1;
    objectClickCountRef.current = nextObjectClickCount;
    setObjectClickCount(nextObjectClickCount);
    maybeShowUnlockPrompt(interactionCountRef.current, nextObjectClickCount);
    const nextGameState = calculatePsychGameState({
      psychState: psychStateRef.current,
      objects: psychObjectsRef.current,
      interactionCount: interactionCountRef.current,
      objectClickCount: nextObjectClickCount,
    });
    setGameState(nextGameState);
    gameStateRef.current = nextGameState;
    lastInteractionAtRef.current = Date.now();
    lastChatActivityAtRef.current = lastInteractionAtRef.current;
    setDecayActive(false);
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][SYCHO-B05.5][ObjectClicked]", { objectId: id });
      console.log("[Sycho][SYCHO-B07][GameScoreUpdated]", nextGameState);
    }
    setLastReaction(explanation);
    lastReactionRef.current = explanation;
    if (clickedVoiceObjectRef.current) routeClickedObjectImmediately(clickedVoiceObjectRef.current);
    scheduleMemorySave("object_click");
    const duration = (typeof performance !== "undefined" ? performance.now() : Date.now()) - clickStart;
    if (duration > 50) {
      console.warn("[Sycho][Perf][SlowClick]", { duration: Number(duration.toFixed(1)) });
    }
  };

  const handleClearMemory = () => {
    // ## SYCHO_FUTURE_BACKEND_PRIVACY:
    // Current memory is local-only (browser storage).
    // Future backend must use explicit user consent and store only safe summaries.
    clearPsychSessionSnapshot();
    setMemoryWriteDisabled(false);
    const defaultState = psychStore.getState();
    const defaultObjects = psychStore.getObjects();
    psychStateRef.current = defaultState;
    psychObjectsRef.current = defaultObjects;
    interactionCountRef.current = 0;
    objectClickCountRef.current = 0;
    accessModeRef.current = "free";
    lastDecayMemorySaveAtRef.current = 0;
    pendingMemorySaveRef.current = false;
    if (memorySaveTimerRef.current != null) window.clearTimeout(memorySaveTimerRef.current);
    memorySaveTimerRef.current = null;
    lastEmotionInputRef.current = null;
    lastEmotionAppliedAtRef.current = 0;
    pendingVoiceThemeCountRef.current = false;
    clickedVoiceObjectRef.current = null;
    lastInteractionAtRef.current = Date.now();
    lastChatActivityAtRef.current = lastInteractionAtRef.current;
    resetInnerDialogueEngine();
    resetEyeMemory();
    resetInspirationEngine();
    resetEgoVoiceEngine();
    resetVoiceCoordinator();
    resetAwakeningSeen();
    setAwakeningStage("not_started");
    if (ENABLE_MEMORY) {
      resetMemory();
      sychoMemoryRef.current = loadMemory();
    } else {
      sychoMemoryRef.current = null;
    }
    setPsychState(defaultState);
    setPsychObjects(defaultObjects);
    setGameState(INITIAL_GAME_STATE);
    gameStateRef.current = INITIAL_GAME_STATE;
    setAccessMode("free");
    setShowUnlockPrompt(false);
    unlockPromptLoggedRef.current = false;
    setInteractionCount(0);
    setObjectClickCount(0);
    setLastInput(null);
    setLastReaction(null);
    setAssistantMessage(null);
    lastInputRef.current = null;
    lastReactionRef.current = null;
    setLastDecayAt(null);
    setDecayActive(false);
    setMemoryPresent(false);
    setLastMemorySavedAt(null);
    setLastClickedObject(null);
    setSelectedObjectId(null);
    setBackendDominant(null);
    setBackendMergeResult(null);
    setInspirationSignal(null);
    backendAbortRef.current?.abort();
    if (backendDebounceRef.current != null) window.clearTimeout(backendDebounceRef.current);
    if (selectedObjectTimeoutRef.current != null) window.clearTimeout(selectedObjectTimeoutRef.current);
    setLastEventType(null);
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][SYCHO-B08.5][ResetTriggered]");
      console.log("[Sycho][SYCHO-B08][MemoryCleared]");
    }
    psychLogger.event("[SYCHO-B08][MemoryResetComplete]");
  };

  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    try {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch {
      // Onboarding should never block the scene.
    }
  };

  const handleEnableProPreview = () => {
    accessModeRef.current = "pro_preview";
    setAccessMode("pro_preview");
    setShowUnlockPrompt(false);
    scheduleMemorySave("pro_preview");
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][SYCHO-B09][ProPreviewEnabled]");
    }
  };

  const handleTriggerDecayNow = () => {
    applyDecayNow(5, Date.now());
  };

  const isMobile = isClient && isMobileLayout;

  // compute layout sizes
  const containerStyle: React.CSSProperties = { width: "100%", height: "100vh", position: "relative", overflow: "hidden", background: "#030312" };

  const chatWidth = chatWidthPx ?? (containerRef.current ? Math.max(280, Math.min(containerRef.current.clientWidth * 0.3, containerRef.current.clientWidth * 0.55)) : 360);
  const sceneObjects = useMemo(() => applyAwakeningToObjects(capPsychObjectsForAccess(psychObjects, accessMode), awakeningStage), [psychObjects, accessMode, awakeningStage]);
  const debugVisualMap = useMemo(() => mapPsychToVisual({ psychState, objects: psychObjects, selectedId: selectedObjectId }), [psychState, psychObjects, selectedObjectId]);
  const strongestObject = useMemo(() => getStrongestVisualObject(debugVisualMap), [debugVisualMap]);
  const dominantState = useMemo(() => getDominantPsychState(psychState), [psychState]);

  if (!isClient) {
    return (
      <div ref={containerRef} style={containerStyle}>
        <PsychTopBar onToggleChat={() => setIsMobileDrawerOpen((s) => !s)} onReset={handleClearMemory} accessMode={accessMode} />
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <div style={{ flex: 1, minWidth: 0 }} data-nx="psych-scene">
            <PsychScene psychState={psychState} objects={sceneObjects} selectedObjectId={selectedObjectId} compactStars={false} inspirationSignal={inspirationSignal} onObjectClick={handleObjectClick} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={containerStyle}>
      <PsychTopBar onToggleChat={() => setIsMobileDrawerOpen((s) => !s)} onReset={handleClearMemory} accessMode={accessMode} />
      {showOnboarding ? (
        <div
          data-nx="sycho-onboarding"
          style={{
            position: "absolute",
            top: 66,
            left: 16,
            zIndex: 70,
            width: "min(300px, calc(100% - 32px))",
            border: "1px solid rgba(125, 211, 252, 0.18)",
            borderRadius: 8,
            background: "rgba(3, 10, 24, 0.72)",
            backdropFilter: "blur(14px)",
            color: "#dbeafe",
            padding: 12,
            boxShadow: "0 18px 45px rgba(0,0,0,0.34)",
            pointerEvents: "auto",
          }}
        >
          <div style={{ fontSize: 12, lineHeight: 1.55, color: "#cbd5e1" }}>
            <div>Type something or click an element.</div>
            <div>Each element speaks differently.</div>
            <div>You can explore — nothing is stored.</div>
          </div>
          <button
            type="button"
            onClick={handleDismissOnboarding}
            style={{
              marginTop: 10,
              border: "1px solid rgba(148, 163, 184, 0.24)",
              background: "rgba(125, 211, 252, 0.08)",
              color: "#e0f2fe",
              borderRadius: 7,
              padding: "6px 9px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Got it
          </button>
        </div>
      ) : null}

      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* Scene area */}
        <div style={{ flex: 1, minWidth: 0 }} data-nx="psych-scene">
          <PsychScene psychState={psychState} objects={sceneObjects} selectedObjectId={selectedObjectId} compactStars={isMobile} inspirationSignal={inspirationSignal} onObjectClick={handleObjectClick} />
        </div>

        {/* Resize handle + Chat for desktop */}
        {!isMobile ? (
          <>
            <div
              data-nx="psych-resize-handle"
              onMouseDown={handleMouseDown}
              style={{ width: 8, cursor: "col-resize", background: isDragging ? "rgba(255,255,255,0.04)" : "transparent" }}
            />
            <div style={{ width: chatWidth, minWidth: 280, maxWidth: "55%", background: "rgba(0,0,0,0.32)", borderLeft: "1px solid rgba(255,255,255,0.04)" }} data-nx="psych-chat">
              <PsychChatPanel mobile={false} onClose={() => {}} onSendMessage={handleSendMessage} onUserActivity={handleChatActivity} assistantMessage={assistantMessage} />
            </div>
          </>
        ) : (
          /* mobile drawer */
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: isMobileDrawerOpen ? `${Math.min(0.9, Math.max(0.35, drawerRatio)) * 100}vh` : "0px", transition: "height 220ms ease", overflow: "hidden" }} data-nx="psych-chat">
            <PsychChatPanel
              mobile
              drawerRatio={drawerRatio}
              setDrawerRatio={(r: number) => setDrawerRatio(r)}
              onClose={() => setIsMobileDrawerOpen(false)}
              onSendMessage={handleSendMessage}
              onUserActivity={handleChatActivity}
              assistantMessage={assistantMessage}
            />
          </div>
        )}
      </div>
      {showUnlockPrompt && accessMode === "free" ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 24,
            transform: "translateX(-50%)",
            zIndex: 55,
            width: "min(360px, calc(100% - 32px))",
            border: "1px solid rgba(180, 210, 255, 0.16)",
            borderRadius: 8,
            background: "rgba(4, 11, 24, 0.72)",
            backdropFilter: "blur(12px)",
            color: "#e6eef8",
            padding: 12,
            boxShadow: "0 18px 44px rgba(0,0,0,0.32)",
          }}
        >
          <div style={{ fontSize: 13, marginBottom: 10 }}>A deeper layer is forming. Unlock full mirror depth?</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowUnlockPrompt(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#cbd5e1", padding: "6px 9px", borderRadius: 7 }}>Later</button>
            <button onClick={handleEnableProPreview} style={{ background: "#2563eb", border: "none", color: "white", padding: "6px 10px", borderRadius: 7 }}>Preview Pro</button>
          </div>
        </div>
      ) : null}
      {process.env.NODE_ENV === "development" && (
        <PsychDebugHUD
          lastInput={lastInput}
          psychState={psychState}
          objects={psychObjects}
          lastReaction={lastReaction}
          dominantState={dominantState}
          strongestObject={strongestObject}
          lastDecayAt={lastDecayAt}
          decayActive={decayActive}
          gameState={gameState}
          memoryWriteDisabled={memoryWriteDisabled}
          backendDominant={backendDominant}
          backendMergeResult={backendMergeResult}
          onClearMemory={handleClearMemory}
        />
      )}
      {/* ## SYCHO_DEV_PANEL:
          This panel is for development traceability only.
          Must not ship in production UX. */}
      {process.env.NODE_ENV === "development" && (
        <PsychDevPanel
          accessMode={accessMode}
          memoryPresent={memoryPresent}
          memoryWriteDisabled={memoryWriteDisabled}
          lastMemorySavedAt={lastMemorySavedAt}
          lastInput={lastInput}
          lastReaction={lastReaction}
          lastClickedObject={lastClickedObject}
          lastEventType={lastEventType}
          decayActive={decayActive}
          gameState={gameState}
          strongestObject={strongestObject}
          backendDominant={backendDominant}
          backendMergeResult={backendMergeResult}
          onForceProPreview={handleEnableProPreview}
          onTriggerDecayNow={handleTriggerDecayNow}
          onClearMemory={handleClearMemory}
        />
      )}
    </div>
  );
}
