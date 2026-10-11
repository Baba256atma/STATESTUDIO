# NPA-T SAVED-SCENE-DURABILITY:1 — CERTIFIED

Classification: **LOCAL MVP DURABILITY**

Seals only the persistence boundary by which Nexora durably stores a manager’s Saved Scene metadata and canonical references while preserving current canonical business/project truth as the sole authority when those Scenes are later opened.

Does not seal authentication, cloud persistence, cross-device synchronization, historical Timeline, SCENE-ORG as a whole, Data Reality, NMI, Advisor, Stage, OVS, or the full management model.

## Owner

`loadSceneOrgSavedScenes` / `persistSceneOrgSavedScenes` in `sceneOrgSavedSceneDurability.ts`

Runtime consumer: `NexoraExecutiveShell` hydrates once, then `SAVE_SCENE` / `MAKE_DEFAULT_SCENE` persist before acknowledging, then `OPEN_SCENE` calls certified `resolveSceneOrgSavedScene`.

Storage: `window.localStorage` key `nexora.saved-scenes.v1`, schema version `1`, identity `NPA-T SAVED-SCENE-DURABILITY:1/LocalSavedSceneMetadata`.
