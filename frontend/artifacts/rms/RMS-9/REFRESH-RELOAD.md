# Refresh / reload

Ownership lives on the sealed RMS session + in-process Take Control store, not the React tree. `restoreRmsTakeControl` rehydrates HUMAN_MANAGER in the same runtime. Full browser reload without that store is explicit re-entry (new Watch start), not silent Agent reactivation of a Human-owned run that no longer exists in memory.
