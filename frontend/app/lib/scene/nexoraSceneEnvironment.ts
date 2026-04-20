import type { ResolvedUiTheme } from "../ui/nexoraUiTheme";

/** Scene prefs atmosphere (stars overlay, etc.). Distinct from app ThemeMode. */
export type SceneAtmosphereMode = "day" | "night" | "stars";

export type NexoraSceneEnvironment = {
  clearColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  showStars: boolean;
  /** Scales drei's Stars count from prefs. */
  starCountFactor: number;
  /** Drei Stars `factor` (spread); lower in day + stars for calmer field. */
  starsSpreadFactor: number;
  ambientLight: number;
  directionalLight: number;
};

/**
 * Harmonize WebGL environment with resolved app theme (`data-theme` on &lt;html&gt;).
 * `atmosphere` only toggles the starfield and star-specific depth; clear/fog follow UI night/day.
 */
export function resolveNexoraSceneEnvironment(
  resolvedUi: ResolvedUiTheme,
  atmosphere: SceneAtmosphereMode
): NexoraSceneEnvironment {
  const showStars = atmosphere === "stars";

  if (resolvedUi === "day") {
    if (showStars) {
      return {
        clearColor: "#1a2838",
        fogColor: "#1e3144",
        fogNear: 14,
        fogFar: 55,
        showStars: true,
        starCountFactor: 0.58,
        starsSpreadFactor: 2.4,
        ambientLight: 0.68,
        directionalLight: 0.82,
      };
    }
    return {
      clearColor: "#a8b8ce",
      fogColor: "#b4c4d8",
      fogNear: 16,
      fogFar: 62,
      showStars: false,
      starCountFactor: 1,
      starsSpreadFactor: 4,
      ambientLight: 0.72,
      directionalLight: 0.85,
    };
  }

  if (showStars) {
    return {
      clearColor: "#050b2a",
      fogColor: "#060d24",
      fogNear: 10,
      fogFar: 48,
      showStars: true,
      starCountFactor: 1,
      starsSpreadFactor: 4,
      ambientLight: 0.58,
      directionalLight: 0.78,
    };
  }

  return {
    clearColor: "#060d1c",
    fogColor: "#071526",
    fogNear: 12,
    fogFar: 52,
    showStars: false,
    starCountFactor: 1,
    starsSpreadFactor: 4,
    ambientLight: 0.58,
    directionalLight: 0.78,
  };
}

/** 3D label / scanner tones: follow UI day; keep `stars` only when night UI + starfield. */
export function sceneRendererThemeFromUi(
  resolvedUi: ResolvedUiTheme,
  atmosphere: SceneAtmosphereMode
): "day" | "night" | "stars" {
  if (resolvedUi === "day") return "day";
  return atmosphere === "stars" ? "stars" : "night";
}
