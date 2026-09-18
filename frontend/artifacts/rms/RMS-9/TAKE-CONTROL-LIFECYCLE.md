# TAKE_CONTROL lifecycle

WATCH → HANDOFF_PENDING (only if a manager turn is in flight) → TAKE_CONTROL.

HANDOFF_FAILED leaves MANAGER_AGENT in place.

Customer playback pauses. Simulation clock pauses after a successful takeover until the Human resumes or steps it.
