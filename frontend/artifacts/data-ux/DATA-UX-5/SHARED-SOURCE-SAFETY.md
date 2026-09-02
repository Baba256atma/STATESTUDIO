# DATA-UX:5 Shared Source Safety

If two committed sources map the same executive object:

- Removing the inactive one keeps the active source and current data.
- Classification: `SHARED_SUPPORT_REMAINS`.
- Nexora does not auto-activate the remaining source if the removed one was active.

Unrelated sources (no overlapping affected objects) are never cleaned up. Workspace B is never written when Workspace A removes a source.
