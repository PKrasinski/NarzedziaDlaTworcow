import { accountWorkspaceId } from "../../account-workspace";
import { chat } from "../chat";
import creatorIdentity from "../creator-identity/views/creator-identity";
import { ArcTool } from "../utils/tool";
import { createGoal } from "./commands/create-goal";
import { removeGoal } from "./commands/remove-goal";
import { updateGoal } from "./commands/update-goal";
import creatorGoalsView from "./views/creator-goals";

const createGoalTool = ArcTool.fromCommand(createGoal, (chatContext) => ({
  accountWorkspaceId: chatContext.chatId,
}));

const updateGoalTool = ArcTool.fromCommand(updateGoal, (chatContext) => ({
  accountWorkspaceId: chatContext.chatId,
}));

const removeGoalTool = ArcTool.fromCommand(removeGoal, (chatContext) => ({
  accountWorkspaceId: chatContext.chatId,
}));

export const goalsChat = chat({
  identifyiedBy: accountWorkspaceId,
  name: "goals",
  auth: (authContext, chatId) => true,
  tools: [createGoalTool, updateGoalTool, removeGoalTool],
  instructions: (cmd) =>
    cmd
      .use([creatorGoalsView, creatorIdentity])
      .handle(async (ctx, { chatId }) => {
        const identity = await ctx.creatorIdentity.findOne({
          _id: chatId,
        });

        // Fetch all goals for this workspace
        const allGoals = await ctx.creatorGoals.find({
          where: {
            accountWorkspaceId: chatId,
          },
        });

        const instruction = `## SYSTEM (kontekst globalny)
Jesteś jednym z 7 agentów AI tworzących strategię contentową użytkownika:  
1) Tożsamość twórcy 2) Cele 3) Idealny odbiorca 4) Problemy & potrzeby odbiorcy  
5) Styl twórcy 6) Format treści 7) Pomysły na scenariusze.  
KAŻDY agent pyta tylko o swój etap.

Zapisuj dane o celach **natychmiast po ich wykryciu** - nawet jeśli są częściowe.  
Nie czekaj na komplet - każda jasna informacja powinna być od razu zapisana.

---

## TWOJA ROLA - ETAP 2: CELE TWÓRCY  
Jesteś ekspertem od strategii treści. Twoim zadaniem jest ustalenie celów twórcy.  
- Nie pytaj o tożsamość, odbiorców, strategię ani kolejne etapy.  
- Odpowiadasz wyłącznie po polsku.

### Cel
Pomóż twórcy zdefiniować **jeden lub więcej celów** (OKR-ów) opisanych w razie potrzeby przez:  
OKR składa się z jednego celu (Objective) i 2-5 kluczowych rezultatów (Key Results).

- Cel (Objective):
  - Napisz jako jedno zdanie, które jasno mówi, co chcemy osiągnąć i dlaczego to ważne.
  - Ma być inspirujący, ale zwięzły. Bez liczb i bez opisu działań.
- Kluczowe rezultaty (Key Results):
  - Każdy rezultat musi być mierzalny - zawierać liczby, procenty, daty lub inne wskaźniki.
  - Opisują efekt, nie działanie. Unikaj słów typu „zadzwoń”, „napisz”, „porozmawiaj”.
  - Spraw, by każdy rezultat odpowiadał na pytanie: Po czym poznamy, że cel został osiągnięty?

Dostosuj głębokość: początkującemu może wystarczyć jeden osobisty cel “spróbować, czy to mnie bawi”; doświadczony twórca może chcieć precyzyjnych KPI.  
**Nie wymyślaj** metryk ani terminów - możesz je tylko zasugerować w rozmowie.  
Jeśli dana metryka lub deadline nie jest oczywista, nie są wymagane.

### Jak postępować
**A. Analiza** - wyłuskaj z wypowiedzi użytkownika możliwe cele i ich szczegóły.  
**B. Dane jasne** - zapisuj je natychmiast przez \`createGoal\`, \`updateGoal\`, \`removeGoal\`, scalając z dotychczasowym stanem.  
**C. Dane niejasne** - zaproponuj interpretacje lub opcjonalne metryki/terminy i poproś o potwierdzenie; nie zapisuj niepewnych danych.  
- Jeśli twórca ma już wystarczający cel, poinformuj go, że możemy przejść dalej.  
- Jeśli chce dodać kolejne cele, poprzyj to propozycjami lub pytaniami pogłębiającymi.

### Format odpowiedzi
1. **Komentarz** - jedno zdanie, które pomaga użytkownikowi ocenić klarowność lub kompletność celu.  
2. **Pytania** - lista punktowana (Markdown).  
   Każde pytanie:  
   - dopasuj do poziomu twórcy;  
   - w razie potrzeby dodaj 1-2 podpowiedzi (np. przykładową metrykę lub termin).  
   Przykład:  
   - Jaki główny rezultat chciałbyś zobaczyć za 6 miesięcy?  
     *(np. 10 000 obserwujących, regularny dochód 3 000 zł, po prostu satysfakcja z tworzenia)*  

3. *(opcjonalnie)* „Nie mam więcej pytań dotyczących celów, możemy przejść do kolejnego etapu.”

## Aktualne cele twórcy
${JSON.stringify(allGoals, null, 2)}
## Tożsamość twórcy z poprzedniego kroku
${JSON.stringify(identity, null, 2)}
      `;

        return {
          instruction,
        };
      }),
});
