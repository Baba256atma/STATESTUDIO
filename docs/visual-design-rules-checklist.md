# Visual Design Rules Checklist

## Design Rules Summary (10)
- Render deterministically: same VisualState in, same scene out.
- Separate rendering from business logic; no inference in the renderer.
- Clamp all numeric inputs; never trust raw data.
- Keep motion subtle and parameter-driven; avoid dramatic swings.
- Use focus to guide attention; dim non-focus elements.
- Encode meaning via structure, not moralized colors.
- Maintain legibility: clear silhouettes, consistent scale.
- Keep chaos field in the background; never dominate.
- Favor stability over novelty; avoid random variation without seeding.
- Protect performance: bounded counts, no per-frame allocations.

## Implementation Checklist
- [ ] Validate VisualState with a runtime schema before render.
- [ ] Clamp all numeric inputs to safe ranges.
- [ ] Map focus to a single highlighted target; dim others.
- [ ] Use fixed geometry mappings for node shapes.
- [ ] Render loops as torus rings with R/B styling differences.
- [ ] Add lever handles tied to leverage points; interactive highlight only.
- [ ] Render flows only when defined; no implicit links.
- [ ] Add chaos field particles with bounded count and soft opacity.
- [ ] Apply smoothing to scale/opacity/position updates.
- [ ] Avoid per-frame object creation; precompute geometries.
- [ ] Guard against missing optional fields (flows/field/focus).
- [ ] Log validation errors and show a small overlay fallback.

## VisualState Parameter Mapping
- `VisualNode.shape` -> geometry type (sphere/box/ico/dodeca).
- `VisualNode.pos` -> mesh position.
- `VisualNode.color` -> base material color (non-semantic).
- `VisualNode.intensity` -> emissive intensity and pulse amplitude.
- `VisualNode.opacity` -> material opacity.
- `VisualNode.scale` -> base scale multiplier.
- `VisualLoop.type` -> ring styling (R brighter, B damped).
- `VisualLoop.center` -> ring position.
- `VisualLoop.radius` -> ring radius.
- `VisualLoop.intensity` -> ring emissive intensity.
- `VisualLoop.flowSpeed` -> ring particle speed.
- `VisualLoop.bottleneck` -> bottleneck segment opacity/flicker.
- `VisualLoop.delay` -> delayed arc indicator strength.
- `VisualLever.pos` -> lever position.
- `VisualLever.strength` -> lever emissive + scale.
- `VisualFlow.from/to` -> link endpoints.
- `VisualFlow.type` -> line vs tube.
- `VisualFlow.speed` -> particle travel speed.
- `VisualFlow.intensity` -> link emissive intensity.
- `VisualFlow.color` -> link override color.
- `VisualField.chaos` -> fog density + particle opacity.
- `VisualField.density` -> particle count.
- `VisualField.noiseAmp` -> drift amplitude.
- `VisualState.focus` -> target highlight and scene emphasis.

## Animation and Transition Standards
- Smooth position/scale/opacity with a 200–400ms easing window.
- Use sinusoidal pulse at 0.8–1.6 Hz, amplitude <= 8% of scale.
- Rotation drift for poly shapes: <= 0.25 rad/s.
- Flow particles: constant speed, no acceleration spikes.
- Damping: apply exponential smoothing per frame (dt-aware).
- Transition changes across frames; never hard snap.

## Focus and Highlight Rules
- Focused item: emissive boost + slight scale lift (<= 10%).
- Non-focused items: reduce emissive and opacity by 15–30%.
- Only one focus target at a time.
- Do not change geometry or layout on focus.

## Chaos Field Constraints
- Particle count bounded; density maps to 100–600 max.
- Opacity capped at 0.6; size small and uniform.
- Drift amplitude <= 0.05 world units per second.
- Chaos field never overlaps focus via stronger emissive.

## Accessibility and Clarity
- No flashing above 2 Hz.
- Avoid high-contrast strobing or rapid color swapping.
- Maintain readable silhouettes at all times.
- Keep overlay text minimal and optional.

## Performance Constraints
- Use instancing when particle count is high.
- Cache geometries and materials; reuse across frames.
- Avoid per-frame allocations in render loops.
- Cap total objects; degrade gracefully when exceeded.

## Do NOT
- Do not snap states; always smooth transitions.
- Do not encode moral meaning in colors (red != bad).
- Do not overload the screen with text labels.
- Do not introduce randomness without deterministic seeding.

## Implementation Order
- MVP: loops + focus + subtle chaos + lever highlight.
- v1: replay transitions + flow links.
- v2: richer materials + optional models.
