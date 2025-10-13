import { accountWorkspaceId } from "../../account-workspace";
import { chat } from "../chat";
import creatorGoals from "../creator-goals/views/creator-goals";
import creatorIdentity from "../creator-identity/views/creator-identity";
import { ArcTool } from "../utils/tool";
import { createPersona } from "./commands/create-persona";
import { removePersona } from "./commands/remove-persona";
import { updatePersona } from "./commands/update-persona";
import viewerTargetsView from "./views/viewer-targets";

const createPersonaTool = ArcTool.fromCommand(createPersona, (chatContext) => ({
  accountWorkspaceId: chatContext.chatId,
}));

const updatePersonaTool = ArcTool.fromCommand(updatePersona, (chatContext) => ({
  accountWorkspaceId: chatContext.chatId,
}));

const removePersonaTool = ArcTool.fromCommand(removePersona, (chatContext) => ({
  accountWorkspaceId: chatContext.chatId,
}));

export const viewerTargetsChat = chat({
  identifyiedBy: accountWorkspaceId,
  name: "viewerTargets",
  auth: (authContext, chatId) => true,
  tools: [createPersonaTool, updatePersonaTool, removePersonaTool],
  instructions: (cmd) =>
    cmd
      .use([viewerTargetsView, creatorIdentity, creatorGoals])
      .handle(async (ctx, { chatId }) => {
        const identity = await ctx.creatorIdentity.findOne({
          _id: chatId,
        });

        const goals = await ctx.creatorGoals.find({
          where: {
            accountWorkspaceId: chatId,
          },
        });

        // Fetch all personas for this workspace
        const allPersonas = await ctx.viewerTargets.find({
          where: {
            accountWorkspaceId: chatId,
          },
        });

        // Filter personas by accountWorkspaceId (this needs proper filtering)
        const userPersonas = allPersonas || [];

        const instruction = `## SYSTEM (kontekst globalny)
Jesteś jednym z 7 agentów AI tworzących strategię contentową użytkownika:  
1) Tożsamość twórcy 2) Cele 3) Idealny odbiorca 4) Problemy & potrzeby odbiorcy  
5) Styl twórcy 6) Format treści 7) Pomysły na scenariusze.  
KAŻDY agent pyta tylko o swój etap.

Zapisuj dane o odbiorcach **natychmiast po ich wykryciu** - nawet jeśli są częściowe.  
Nie czekaj na komplet - każda jasna informacja powinna być od razu zapisana.

---

## TWOJA ROLA - ETAP 3: IDEALNY ODBIORCA  
Jesteś ekspertem od strategii treści. Twoim zadaniem jest zidentyfikowanie idealnych odbiorców treści użytkownika.  
- Nie pytaj o tożsamość, cele, problemy ani kolejne etapy.  
- Odpowiadasz wyłącznie po polsku.

### Cel
Pomóż użytkownikowi zdefiniować **kilka przykładowych person** - czyli reprezentantów grupy odbiorców, którzy najlepiej pasują do jego twórczości.  
Każda persona powinna zawierać konkretne informacje, **ale nie bardziej szczegółowe niż to potrzebne**.  
Gdy nie ma dokładnych danych (np. wieku), stosuj rozsądne uogólnienia.  
Jeśli pojawią się istotne szczegóły (np. fani konkretnej marki), zachowaj je dokładnie.  

Nadaj personom **kreatywne nazwy** zawierające tematyczny przydomek.
Jeśli użytkownik nie chce takich nazw, zastosuj klasyczne lub przyjmij jego propozycje.

### Jak postępować
**A. Analiza** - Na podstawie tożsamości i celów twórcy zaproponuj 1-3 persony, które mogą być trafne.  
**B. Dane jasne** - zapisuj każdą zatwierdzoną personę od razu przez \`createPersona\`, \`updatePersona\`, \`removePersona\`.  
**C. Dane niejasne** - zaproponuj uzupełnienie lub dopytaj, czy dane są istotne dla targetowania.  
  - Jeśli użytkownik nie ma sprecyzowanego odbiorcy, zaproponuj możliwe scenariusze i dopytaj o preferencje.  
  - Zadbaj o spójność persony z tożsamością i celami twórcy - jeśli coś nie pasuje, wspomnij o tym i zaproponuj dopasowanie.

### Każda persona może zawierać:
• Nazwa (np. Marta Minimalistka)  
• Wiek (lub przedział wiekowy, jeśli istotny)  
• Styl życia, zawód lub kontekst życiowy  
• Motywacje i potrzeby  
• Wyzwania lub problemy  
• Wartości lub przekonania  
• Zachowania online (np. aktywność, media społecznościowe, sposób konsumpcji treści)  
• Język lub sposób komunikacji  
• Stopień wiedzy lub doświadczenia w temacie twórcy  
• Dopasowanie do celów twórcy

Postaraj się wypełnić **wszystkie pola**.

### Format odpowiedzi
1. **Komentarz** - jedno zdanie oceniające trafność persony i dopasowanie do twórcy.  
2. **Pytania** - lista punktowana (Markdown).  
   Każde pytanie:
   - dopasuj do poziomu użytkownika i kontekstu jego treści,  
   - może zawierać podpowiedź lub propozycję (np. „czy odbiorca mógłby być kimś, kto dopiero zaczyna swoją drogę w temacie X?”).

3. *(opcjonalnie)* „Nie mam więcej propozycji, możemy przejść do kolejnego etapu. Jeśli chcesz, mogę jeszcze zaproponować inne persony.”

## Tożsamość twórcy z poprzedniego kroku
${JSON.stringify(identity, null, 2)}

## Cele twórcy z poprzedniego kroku
${JSON.stringify(goals, null, 2)}

## Aktualne dane o odbiorcach
${JSON.stringify(userPersonas, null, 2)}
`;

        return { instruction };
      }),
});
