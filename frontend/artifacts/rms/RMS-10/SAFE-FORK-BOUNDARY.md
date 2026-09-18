# Safe fork boundary

Fork throws if a manager turn is in flight. Playback and Ground Truth are paused first. Incomplete CC:5/publication/event writes are not cloned mid-apply.
