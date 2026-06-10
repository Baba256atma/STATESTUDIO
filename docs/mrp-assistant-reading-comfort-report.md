# MRP:11:2:4 — Assistant Rail Width Optimization + Reading Comfort

## Summary

Expanded the Type-C Assistant rail from 360px to an adaptive **400–440px** range (viewport-dependent) and applied executive reading-comfort tokens across chat-first presentation surfaces.

## Layout measurements (1440px desktop, executive preset)

Computed via `resolveAssistantRailWidth` + `buildAssistantRailLayoutMeasurement`:

| Metric | Before | After |
|--------|--------|-------|
| Assistant width | 360px | 420px |
| Content width | ~332px | ~392px |
| Est. chars/line | ~52 | ~61+ |
| Scene width (approx) | ~888px | ~828px |
| Scene/viewport ratio | ~62% | ~57% |
| Reading comfort | warn | pass |

At **1680px wide desktop**: assistant = **440px**, scene remains >55% viewport.

At **1100px tablet**: assistant = **380px** (responsive cap).

## Width resolution

- `assistantRailLayoutContract.ts` — dominance ratio (≥55% scene), char-line targets (60–90)
- `assistantRailWidthRuntime.ts` — adaptive resolver with scene-dominance cap
- `executiveRightRailLayoutRuntime.ts` — delegates to adaptive resolver

Breakpoint targets:

| Breakpoint | Target width |
|------------|--------------|
| wideDesktop (≥1600) | 440px |
| compactDesktop (≥1280) | 420px |
| tablet (≥1024) | 380px |
| mobile | 320px |

## Reading comfort

- `assistantReadingComfortTokens.ts` — conversation, support, chip, input spacing
- Full-width assistant bubbles (no 2-line clamp in chat-first surface)
- Line height 1.62, increased padding and message gap
- Suggested question chips: balanced 2-column wrap (`calc(50% - 3px)`)
- Support panels (Guidance, Scenario, Decision, Actions) inherit content tokens

## Runtime trace

```
[AssistantRailLayout]
assistantWidth=420
sceneWidth=828
readingComfort=pass
chipWrapMode=enabled
```

Live measurement via `useAssistantRailLayoutObserver` on `MrpChatFirstAssistantSurface`. Results published to `window.__ASSISTANT_RAIL_LAYOUT__`.

## Unchanged

- Dashboard Home, scene/timeline HUDs, chat send/runtime engines
- Panel scroll containers from MRP:11:2:3

## Tests

`assistantRailLayout.test.ts` — 10 acceptance tests
