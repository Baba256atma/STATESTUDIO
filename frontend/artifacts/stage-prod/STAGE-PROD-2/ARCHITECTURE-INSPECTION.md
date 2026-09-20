# NPA-T STAGE-PROD:2 — Architecture inspection

## Production Object rendering path

`/executive` → `ExecutiveShell` → `ExecutiveCockpit` → `NexoraExecutiveShell` → canonical NEX-MVP:4 interaction/catalog projection → `NexoraStageMount` → `Nexora3DExecutiveStage` → `NexoraStageScene` → existing `NexoraStageObject` / `NexoraStageContextNodes` → visible Stage Object.

When an executive-work Object such as Capacity Gap becomes primary, the existing projection promotes its canonical ID and type into `scene.objects`; it is then rendered by `NexoraStageObject`. Expanded executive-thread members use that same path. Context-node rendering remains the existing companion/gateway path and was not replaced.

## Authority result

- Canonical Object ID remains the render/select key.
- Canonical projected `kind` remains the rendered Object type.
- Projected `focused` / `selected` state remains the visual state.
- Label text is display metadata only and is never used as identity.
- Rendering is read-only.
- The certified STAGE-PROD:1 host and Queue/NMI/Director/Theatre authorities remain unchanged.
- No Object model, Object store, Stage store, NMI model, Director, Theatre, or UI-owned business truth was added.

## Minimal implementation

The existing production renderer was reused. The only production changes expose canonical Object type alongside the already-exposed canonical ID in Stage renderer audit metadata, and correct an existing unsupported ARIA attribute in the touched host.

No chart, advanced scene composition, disclosure workflow, animation playback, performance work, or new 3D treatment was introduced.
