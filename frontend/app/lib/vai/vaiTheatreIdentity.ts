/**
 * NPA-T VAI:5 — Theatre Symbol Language identity.
 * Presentation-only Variable Symbols. Not executive Objects or a second Stage.
 */

export const vaiTheatreSymbolLanguageIdentity = "NPA-T VAI:5/TheatreSymbolLanguage" as const;
export const vaiTheatreSymbolLanguageVersion = "1.0.0" as const;
export const vaiTheatreSymbolLanguageNamespace = "nexora.vai.theatre-symbol-language" as const;
export const vaiTheatreSymbolLanguagePhase = "VAI:5" as const;

export function getVaiTheatreSymbolLanguageIdentity() {
  return Object.freeze({
    id: vaiTheatreSymbolLanguageIdentity,
    version: vaiTheatreSymbolLanguageVersion,
    namespace: vaiTheatreSymbolLanguageNamespace,
    phase: vaiTheatreSymbolLanguagePhase,
  });
}
