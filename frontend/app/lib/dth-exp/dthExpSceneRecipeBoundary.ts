/**
 * NPA-T DTH-EXP:3A — Scene Recipe authority boundary.
 * Recipes instruct projection. They are not a Scene store or Director.
 */

export const DTH_EXP_SCENE_RECIPE_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:3A/SceneRecipeBoundary" as const,
  canonicalObjects: "MO:1 / NEX-MVP:4 catalog",
  theatreActors: "DTH-EXP:2",
  visualRoles: "DTH-EXP:1",
  theatreScene: "DTH-EXP:1 Theatre Scene",
  sceneComposition: "DTH:5 Scene Intent / Scene Script",
  stageHost: "NEX-MVP:3 / NEX-MVP:4",
  director: "DIR:1",
  evidence: "CC:8",
  vaiAnalyticalRoles: "VAI:1–8",
  relationships: "DTH:1–3 / NMI:1",
  dthExpOwns: "Scene Recipe contract and Recipe + canonical context → Theatre Scene resolver",
  recipeIsTheatreScene: false as const,
  recipeIsSceneStore: false as const,
  copiesManagementTruth: false as const,
  manufacturesCausalTruth: false as const,
  automaticDirectorRecipeSelection: false as const,
  nexoFamilyRecipesImplemented: false as const,
  parallelTimelineAuthority: false as const,
  parallelStage: false as const,
  parallelDirector: false as const,
  parallelVaiRoleAuthority: false as const,
  animationImplemented: false as const,
  startsDthExp3B: false as const,
});

export function verifyDthExpSceneRecipeBoundary(): { readonly ok: true } {
  if (DTH_EXP_SCENE_RECIPE_BOUNDARY.recipeIsTheatreScene) {
    throw new Error("DTH-EXP:3A recipe must not be a Theatre Scene");
  }
  if (DTH_EXP_SCENE_RECIPE_BOUNDARY.recipeIsSceneStore) {
    throw new Error("DTH-EXP:3A must not become a Scene store");
  }
  if (DTH_EXP_SCENE_RECIPE_BOUNDARY.copiesManagementTruth) {
    throw new Error("DTH-EXP:3A must not copy management truth into recipes");
  }
  if (DTH_EXP_SCENE_RECIPE_BOUNDARY.manufacturesCausalTruth) {
    throw new Error("DTH-EXP:3A must not manufacture causal truth");
  }
  if (DTH_EXP_SCENE_RECIPE_BOUNDARY.automaticDirectorRecipeSelection) {
    throw new Error("DTH-EXP:3A must not select recipes as Director");
  }
  if (DTH_EXP_SCENE_RECIPE_BOUNDARY.nexoFamilyRecipesImplemented) {
    throw new Error("DTH-EXP:3A must not implement Nexo family recipes");
  }
  if (DTH_EXP_SCENE_RECIPE_BOUNDARY.parallelTimelineAuthority) {
    throw new Error("DTH-EXP:3A must not create Timeline authority");
  }
  if (DTH_EXP_SCENE_RECIPE_BOUNDARY.parallelStage) {
    throw new Error("DTH-EXP:3A must not create a Stage");
  }
  if (DTH_EXP_SCENE_RECIPE_BOUNDARY.parallelDirector) {
    throw new Error("DTH-EXP:3A must not become Director");
  }
  if (DTH_EXP_SCENE_RECIPE_BOUNDARY.startsDthExp3B) {
    throw new Error("DTH-EXP:3A must not start DTH-EXP:3B");
  }
  return Object.freeze({ ok: true as const });
}
