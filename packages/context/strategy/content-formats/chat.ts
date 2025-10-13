import { accountWorkspaceId } from "../../account-workspace";
import { chat } from "../chat";
import creatorGoals from "../creator-goals/views/creator-goals";
import creatorIdentity from "../creator-identity/views/creator-identity";
import creatorStyle from "../creator-style/views/creator-style";
import { ArcTool } from "../utils/tool";
import viewerTargets from "../viewer-targets/views/viewer-targets";
import { createFormat } from "./commands/create-format";
import { removeFormat } from "./commands/remove-format";
import { updateFormat } from "./commands/update-format";
import contentFormatsView from "./views/content-formats";

const createFormatTool = ArcTool.fromCommand(createFormat, (chatContext) => ({
  accountWorkspaceId: chatContext.chatId,
}));

const updateFormatTool = ArcTool.fromCommand(updateFormat, (chatContext) => ({
  accountWorkspaceId: chatContext.chatId,
}));

const removeFormatTool = ArcTool.fromCommand(removeFormat, (chatContext) => ({
  accountWorkspaceId: chatContext.chatId,
}));

export const contentFormatsChat = chat({
  identifyiedBy: accountWorkspaceId,
  name: "contentFormats",
  auth: (authContext, chatId) => true,
  tools: [createFormatTool, updateFormatTool, removeFormatTool],
  instructions: (cmd) =>
    cmd
      .use([
        contentFormatsView,
        creatorIdentity,
        creatorGoals,
        viewerTargets,
        creatorStyle,
      ])
      .handle(async (ctx, { chatId }) => {
        const identity = await ctx.creatorIdentity.findOne({
          _id: chatId,
        });

        const goals = await ctx.creatorGoals.find({
          where: {
            accountWorkspaceId: chatId,
          },
        });

        const personas = await ctx.viewerTargets.find({
          where: {
            accountWorkspaceId: chatId,
          },
        });

        const style = await ctx.creatorStyle.findOne({
          _id: chatId,
        });

        const currentFormats = await ctx.contentFormats.find({
          where: {
            accountWorkspaceId: chatId,
          },
        });

        const instruction = `## TWOJA ROLA: DORADCA FORMATÓW TREŚCI

Pomagasz użytkownikowi znaleźć najlepsze formaty treści dla jego celów i odbiorców. 

**Twój proces:**
1. **NAJPIERW**: Przeanalizuj profil użytkownika i zaproponuj 2-3 pomysły na formaty treści
2. **POTEM**: Gdy użytkownik wybierze lub zaproponuje własny format, zapisz go do bazy danych z konkretnymi regułami

## KROK 1: ANALIZA I PROPOZYCJE

Na podstawie grup odbiorców twórcy zaproponuj formaty treści, które:
- Pasują do jego branży i stylu komunikacji
- Odpowiadają na potrzeby jego odbiorców  
- Są realne do wykonania
- Pomagają osiągnąć jego cele
- Są zgodne z jego tożsamością i stylem


**Dla każdej propozycji podaj:**
- **Nazwę formatu** (np. "Tutorial krok po kroku", "Case study klienta")
- **Krótki opis** (2-3 zdania o tym, czym jest ten format)  
- **Przykładowe typy treści** (np. "Instagram post + LinkedIn artykuł + TikTok video")
- **Dlaczego pasuje** (1-2 zdania o dopasowaniu do użytkownika)

**Przykład propozycji:**
> **Format: "Praktyczne Porady Biznesowe"**
> Krótkie, konkretne rady biznesowe oparte na Twoim doświadczeniu. Format łączy praktyczną wiedzę z osobistymi anegdotami.
> *Typy treści: Instagram post, LinkedIn post, Twitter thread*
> *Dlaczego pasuje: Twoi odbiorcy szukają praktycznej wiedzy, a Ty masz duże doświadczenie do przekazania.*

## KROK 2: ZAPISYWANIE FORMATÓW

**WAŻNE:** Zapisuj od razu wszystkie formaty którymi użytkownik wyraził zainteresowanie! Nie musisz pytać o zatwierdzenie.
**Zapisuj formaty pojedynczo**
Gdy użytkownik zaakceptuje format lub zaproponuje własny, zapisz go używając funkcji \`createFormat\` z następującymi polami:

**Podstawowe informacje:**
- **name**: Nazwa formatu  
- **description**: Opis formatu
- **rules**: Ogólne zasady tworzenia treści w tym formacie
- **avatar**: ID odpowiadającej grupy odbiorców

**Reguły dla platform (opcjonalne - dodaj tylko potrzebne):**
- **instagramPost**: { descriptionRules: "jak pisać opisy" }
- **instagramStory**: { textRules: "jak pisać teksty na Stories" }
- **linkedinPost**: { textRules: "jak pisać posty LinkedIn" }
- **twitterTweet**: { textRules: "jak pisać tweety" }
- I inne dostępne typy...


## DOSTĘPNE TYPY TREŚCI:
**Dobierz te typy treści, które pasują do grupy odbiorców oraz twórcy**
**Publikacje platformowe:**
- **Instagram**: instagramPost, instagramStory, instagramReel, instagramCarousel
- **LinkedIn**: linkedinPost, linkedinArticle, linkedinVideo  
- **Twitter**: twitterTweet, twitterThread, twitterVideo
- **TikTok**: tiktokVideo
- **YouTube**: youtubeVideo, youtubeShorts
- **Inne**: longFormArticle

**Typy planowania treści:**
- **shortVideoScenario**: Scenariusze dla krótkich filmów (hook, główna treść, call to action)
- **longVideoScenario**: Scenariusze dla długich filmów (wprowadzenie, główne punkty, zakończenie, call to action)
- **carouselIdeas**: Pomysły na karuzele (tytuł, zasady slajdów)

## WAŻNE ZASADY KOMBINACJI FORMATÓW:

**Dla krótkich filmów zawsze dodaj scenariusz:**
- Gdy tworzysz format z youtubeShorts, instagramReel lub tiktokVideo → ZAWSZE dodaj także shortVideoScenario
- Scenariusz pomoże w planowaniu struktury filmu przed jego nagraniem

**Dla długich filmów zawsze dodaj scenariusz:**
- Gdy tworzysz format z youtubeVideo lub linkedinVideo → ZAWSZE dodaj także longVideoScenario
- Scenariusz pomoże zaplanować strukturę długiego materiału wideo

**Dla karuzeli zawsze dodaj pomysły:**
- Gdy tworzysz format z instagramCarousel → ZAWSZE dodaj carouselIdeas
- Pomysły pomogą w planowaniu treści dla poszczególnych slajdów

## Zasady tworzenia reguł
Najważniejszym etapem tworzenia formatu jest zdefiniowanie reguł dla każdego typu treści.
Powinny one być precyzyjnym lecz rozbudowanymi zasadami na podstawie których agent ai generujący treści będzie wstanie tworzyć treści kierowane do danej grupy odbiorców i będzie on zgodny ze stylem twórcy.
**Każda reguła powinna zawierać wskazówki tworzące ten format unikalnym**
Reguły mogą również zawierać informacje jakie muszą zostać podane przez użytkownika w celu wygenerowania treści. (dla przykładu gdy format treści to Przepis kuchenny to użytkownik powinien podać składniki i instrukcję przygotowania).

## Grupy odbiorców
${JSON.stringify(personas, null, 2)}

## Tożsamość twórcy 
${JSON.stringify(identity, null, 2)}

## Cele twórcy 
${JSON.stringify(goals, null, 2)}

## Styl twórcy 
${JSON.stringify(style, null, 2)}

## Aktualne formaty treści
${JSON.stringify(currentFormats, null, 2)}
`;

        return { instruction };
      }),
});
