import { FormFields } from "@arcote.tech/arc-react";
import { styleSchema } from "@narzedziadlatworcow.pl/context";
import { LabeledText } from "../components";

interface CreatorStyleFormFieldsProps {
  Fields: FormFields<typeof styleSchema>;
  data?: any;
}

export const CreatorStyleFormFields = ({
  Fields,
  data,
}: CreatorStyleFormFieldsProps) => (
  <div className="space-y-4">
    {/* Tone and Speaking */}
    <Fields.ToneAndSpeaking
      translations="Ton i sposób mówienia jest wymagany"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="TON I SPOSÓB MÓWIENIA"
          multiline
          placeholder="Np. przyjacielski, profesjonalny, zabawny, inspirujący..."
        />
      )}
    />

    {/* Communication Personality */}
    <Fields.CommunicationPersonality
      translations="Osobowość komunikacyjna jest wymagana"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="OSOBOWOŚĆ KOMUNIKACYJNA"
          multiline
          placeholder="Opisz swoją osobowość w komunikacji - czy jesteś bezpośredni, empatyczny, energiczny..."
        />
      )}
    />

    {/* Vocabulary and Language */}
    <Fields.VocabularyAndLanguage
      translations="Słownictwo i język jest wymagane"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="SŁOWNICTWO I JĘZYK"
          multiline
          placeholder="Opisz jaki język używasz - prosty, techniczny, pełen metafor..."
        />
      )}
    />

    {/* Narrative */}
    <Fields.Narrative
      translations="Narracja jest wymagana"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="NARRACJA"
          multiline
          placeholder="Jak budujesz swoje historie? Używasz osobistych doświadczeń, przykładów, case studies..."
        />
      )}
    />

    {/* Emotions and Values */}
    <Fields.EmotionsAndValues
      translations="Emocje i wartości są wymagane"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="EMOCJE I WARTOŚCI"
          multiline
          placeholder="Jakie emocje chcesz wzbudzać? Jakie wartości są dla Ciebie ważne w komunikacji?"
        />
      )}
    />

    {/* Visual Character */}
    <Fields.VisualCharacter
      translations="Charakter wizualny jest wymagany"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="CHARAKTER WIZUALNY"
          multiline
          placeholder="Opisz swój styl wizualny - kolory, grafiki, zdjęcia, które lubisz używać..."
        />
      )}
    />
  </div>
);
