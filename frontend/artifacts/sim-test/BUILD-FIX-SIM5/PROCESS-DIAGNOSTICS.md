# PROCESS-DIAGNOSTICS (RUN B1)

Command: `env NODE_OPTIONS='--max-old-space-size=8192' npx next build`  
Working directory: `frontend/`  
Start: 2026-09-28T20:39:26Z  

After “Running TypeScript” (~18s wall):

| PID | Role | State | %CPU | RSS | ELAPSED |
| --- | --- | --- | --- | --- | --- |
| 34541 | zsh wrapper | Ss | 0.0 | 3 MB | 00:18 |
| 34549 | npm exec next build | S | 0.0 | 87 MB | 00:18 |
| 34571 | `node .../next build` parent | S | 0.0 | ~3.1 GB | 00:18 |
| **34680** | `jest-worker processChild.js` (TypeScript worker) | **R** | **176.6** | **~2.9 GB** | 00:06 |

Classification at sample: **CPU_ACTIVE** (runnable, ~1.8 cores). Not IDLE_WAITING. Parent remained in “Running TypeScript” because the worker had not finished.

Worker did **not** exit early; parent reaped it after typecheck. Build then entered Collecting page data / Generating static pages.

No OOM, no SIGKILL, no worker-exited-parent-waiting.
