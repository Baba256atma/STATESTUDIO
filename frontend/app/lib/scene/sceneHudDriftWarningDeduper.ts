const warnedDriftSignatures = new Set<string>();

export function shouldEmitSceneHudDriftWarning(driftSignature: string): boolean {
  if (warnedDriftSignatures.has(driftSignature)) {
    return false;
  }
  warnedDriftSignatures.add(driftSignature);
  return true;
}

export function resetSceneHudDriftWarningDeduperForTests(): void {
  warnedDriftSignatures.clear();
}

export function getSceneHudDriftWarningCountForTests(): number {
  return warnedDriftSignatures.size;
}
