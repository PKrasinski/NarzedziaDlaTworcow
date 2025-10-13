import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { Label } from "@narzedziadlatworcow.pl/ui/components/ui/label";
import { Textarea } from "@narzedziadlatworcow.pl/ui/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Calculate completion percentage
const calculateCompletionPercentage = (style: any) => {
  if (!style) return 0;

  const fields = [
    "toneAndSpeaking",
    "communicationPersonality",
    "vocabularyAndLanguage",
    "narrative",
    "emotionsAndValues",
    "visualCharacter",
  ];

  let completedFields = 0;
  const totalFields = fields.length;

  fields.forEach((field) => {
    if (style[field] && style[field].trim().length > 0) {
      completedFields++;
    }
  });

  return Math.round((completedFields / totalFields) * 100);
};

export const CreatorStyleForm = () => {
  const navigate = useNavigate();
  const { currentAccount } = useAccountWorkspaces();
  const { updateCreatorStyle } = useCommands();
  const revalidate = useRevalidate();

  const [style] = useQuery((q) =>
    q.creatorStyle.findOne({
      _id: currentAccount._id,
    })
  );

  const completionPercentage = calculateCompletionPercentage(style);

  const handleUpdate = async (field: string, value: string) => {
    await updateCreatorStyle({
      accountWorkspaceId: currentAccount._id,
      styleUpdate: {
        [field]: value,
      } as any,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto">
          <MessageCircle className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Ustal swój styl komunikacji
          </h1>
          <p className="text-gray-600 mt-2">
            Zdefiniuj jak chcesz komunikować się ze swoją publicznością
          </p>
        </div>
        <div className="bg-gray-100 rounded-full p-1 text-sm font-medium text-gray-700">
          Ukończone: {completionPercentage}%
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Tone & Speaking */}
        <div className="space-y-3">
          <Label htmlFor="toneAndSpeaking" className="text-base font-semibold">
            Ton i sposób mówienia
          </Label>
          <Textarea
            id="toneAndSpeaking"
            placeholder="Np. przyjacielski, profesjonalny, zabawny, inspirujący..."
            value={style?.toneAndSpeaking || ""}
            onChange={(e) => handleUpdate("toneAndSpeaking", e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Communication Personality */}
        <div className="space-y-3">
          <Label
            htmlFor="communicationPersonality"
            className="text-base font-semibold"
          >
            Osobowość komunikacyjna
          </Label>
          <Textarea
            id="communicationPersonality"
            placeholder="Opisz swoją osobowość w komunikacji - czy jesteś bezpośredni, empatyczny, energiczny..."
            value={style?.communicationPersonality || ""}
            onChange={(e) =>
              handleUpdate("communicationPersonality", e.target.value)
            }
            className="min-h-[100px]"
          />
        </div>

        {/* Vocabulary & Language */}
        <div className="space-y-3">
          <Label
            htmlFor="vocabularyAndLanguage"
            className="text-base font-semibold"
          >
            Słownictwo i język
          </Label>
          <Textarea
            id="vocabularyAndLanguage"
            placeholder="Opisz jaki język używasz - prosty, techniczny, pełen metafor..."
            value={style?.vocabularyAndLanguage || ""}
            onChange={(e) =>
              handleUpdate("vocabularyAndLanguage", e.target.value)
            }
            className="min-h-[100px]"
          />
        </div>

        {/* Narrative */}
        <div className="space-y-3">
          <Label htmlFor="narrative" className="text-base font-semibold">
            Narracja
          </Label>
          <Textarea
            id="narrative"
            placeholder="Jak budujesz swoje historie? Używasz osobistych doświadczeń, przykładów, case studies..."
            value={style?.narrative || ""}
            onChange={(e) => handleUpdate("narrative", e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Emotions & Values */}
        <div className="space-y-3">
          <Label
            htmlFor="emotionsAndValues"
            className="text-base font-semibold"
          >
            Emocje i wartości
          </Label>
          <Textarea
            id="emotionsAndValues"
            placeholder="Jakie emocje chcesz wzbudzać? Jakie wartości są dla Ciebie ważne w komunikacji?"
            value={style?.emotionsAndValues || ""}
            onChange={(e) => handleUpdate("emotionsAndValues", e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Visual Character */}
        <div className="space-y-3">
          <Label htmlFor="visualCharacter" className="text-base font-semibold">
            Charakter wizualny
          </Label>
          <Textarea
            id="visualCharacter"
            placeholder="Opisz swój styl wizualny - kolory, grafiki, zdjęcia, które lubisz używać..."
            value={style?.visualCharacter || ""}
            onChange={(e) => handleUpdate("visualCharacter", e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};
