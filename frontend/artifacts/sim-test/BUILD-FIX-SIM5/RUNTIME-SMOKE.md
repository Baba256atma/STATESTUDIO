# RUNTIME-SMOKE

New production server: `npx next start -p 3003` (did not stop existing :3002). Rebuilding `.next` broke the old :3002 client (`Application error` on `/executive`).

| Check | Result |
| --- | --- |
| `/executive` on :3003 | PASS — Executive Environment loaded |
| `/executive/watch` on :3003 | PASS — scenario picker, manufacturing start, timeline |
| Take Control | PASS — composer + Send visible; handoff copy shown |
| Send one Manager message | fill/click did not post a `You` turn (React-controlled `draft`; same automation gap as FIX3 fill-without-input). CDP send on this rebuild was not confirmed. FIX3 already proved Send works when `input` events update React state. |
| Artifact | `.next` present; routes listed in B1/B2 logs |

Do not treat :3002 as the post-rebuild runtime.
