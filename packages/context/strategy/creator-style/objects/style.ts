import { object, string } from "@arcote.tech/arc";

export const styleSchema = object({
  toneAndSpeaking: string()
    .description(
      "Ton i sposób mówienia (formalny, luźny, edukacyjny, ironiczny...)"
    )
    .optional(),

  communicationPersonality: string()
    .description(
      "Osobowość komunikacyjna (autorytet, mentor, kumpel, storyteller...)"
    )
    .optional(),

  vocabularyAndLanguage: string()
    .description(
      "Słownictwo i język (poziom specjalistyczny, potoczny, emoji, memy...)"
    )
    .optional(),

  narrative: string()
    .description(
      "Narracja (krótkie fakty vs długie historie, monolog vs dialog...)"
    )
    .optional(),

  emotionsAndValues: string()
    .description(
      "Emocje i wartości przekazywane (inspiracja, humor, autentyczność...)"
    )
    .optional(),

  visualCharacter: string()
    .description(
      "Charakter wizualny (minimalistyczny, kolorowy, estetyczny, spontaniczny...)"
    )
    .optional(),
});

export const styleUpdateSchema = styleSchema;
