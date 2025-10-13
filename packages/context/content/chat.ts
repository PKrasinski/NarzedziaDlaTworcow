import { ArcViewRecord } from "@arcote.tech/arc";
import { chat } from "../strategy/chat";
import {
  default as contentFormats,
  default as contentFormatsView,
} from "../strategy/content-formats/views/content-formats";
import contentIdeasView from "../strategy/content-ideas/views/content-ideas";
import creatorGoals from "../strategy/creator-goals/views/creator-goals";
import creatorIdentity from "../strategy/creator-identity/views/creator-identity";
import creatorStyle from "../strategy/creator-style/views/creator-style";
import { ArcTool } from "../strategy/utils/tool";
import viewerTargets from "../strategy/viewer-targets/views/viewer-targets";
import { updateContentByAi } from "./commands/update-content-by-ai";
import { contentId } from "./objects/content";
import contentView from "./views/content";

const updateContentTool = ArcTool.fromCommand(
  updateContentByAi,
  (chatContext) => ({
    contentId: chatContext.chatId,
  })
);

const getSettedFormatTypesAsAnInstruction = (
  contentFormat: ArcViewRecord<typeof contentFormats>
) => {
  const {
    _id,
    accountWorkspaceId,
    name,
    subtitle,
    description,
    rules,
    personaId,
    ...contentTypes
  } = contentFormat;
  return `
  - Nazwa formatu: ${name}
  - Podtytuł: ${subtitle}
  - Opis: ${description}
  - Zasady ogólne: ${rules}
  - Treści **wymagane do uzupełnienia** i ich zasady: ${Object.entries(
    contentTypes
  )
    .filter(([key, value]) => !!value)
    .map(
      ([key, value]: [string, any]) =>
        `\t- ${key}: ${Object.entries(value)
          .map(([key, value]) => `\t\t- ${key.replace("Rules", "")}: ${value}`)
          .join("\n")}`
    )
    .join("\n")}
  `;
};

export const contentChat = chat({
  identifyiedBy: contentId,
  name: "content",
  auth: (authContext, chatId) => true,
  tools: [updateContentTool],
  instructions: (cmd) =>
    cmd
      .use([
        contentView,
        contentFormatsView,
        creatorIdentity,
        creatorGoals,
        viewerTargets,
        creatorStyle,
        contentIdeasView,
      ])
      .handle(async (ctx, { chatId }) => {
        // chatId is now contentId, so get the content first
        const currentContent = await ctx.content.findOne({
          _id: chatId,
        });

        if (!currentContent) {
          throw new Error("Content not found");
        }

        const accountWorkspaceId = currentContent.accountWorkspaceId;
        console.log("accountWorkspaceId", accountWorkspaceId);

        const identity = await ctx.creatorIdentity.findOne({
          _id: accountWorkspaceId,
        });

        const goals = await ctx.creatorGoals.find({
          where: {
            accountWorkspaceId: accountWorkspaceId,
          },
        });

        const personas = await ctx.viewerTargets.find({
          where: {
            accountWorkspaceId: accountWorkspaceId,
          },
        });

        const style = await ctx.creatorStyle.findOne({
          _id: accountWorkspaceId,
        });

        const contentFormats = await ctx.contentFormats.find({
          where: {
            accountWorkspaceId: accountWorkspaceId,
          },
        });

        // Get the content format for this content
        const currentContentFormat = contentFormats.find(
          (format) => format._id === currentContent.formatId
        );

        const relevantPersonas = personas.filter(
          (persona) => currentContentFormat?.personaId === persona._id
        );

        const instruction = `## SYSTEM: EKSPERT TWORZENIA TREŚCI

Jesteś specjalistą od tworzenia treści na podstawie strategii użytkownika.
Twoim zadaniem jest uzupełnienie treści używając narzędzia \`updateContentByAi\` w ramach któego musisz uzupełnić pola na podstawie formatu i zasad przekazaych przez użytkownika.


## FORMAT WYBRANY PRZEZ UŻYTKOWNIKA
${getSettedFormatTypesAsAnInstruction(currentContentFormat!)}

## OPTYMALIZACJA POD GRUPY ODBIORCÓW
Treść powinna być dostosowana do poniższych grup odbiorców:
${JSON.stringify(relevantPersonas, null, 2)}

## STYL TWÓRCY
Ten styl może być nadpisany przez reguły formatu treści oraz zasady dodane przez użytkownika.
${JSON.stringify(style, null, 2)}


## INFOMACJE O TWÓRCY
### TOŻSAMOŚĆ
${JSON.stringify(identity, null, 2)}

### CELE
${JSON.stringify(goals, null, 2)}

## TWÓJ SPOSÓB DZIAŁANIA
- Wygeneruj i zapisz treści wymagane przez format treści przy użyciu narzędzia \`updateContentByAi\`.
- Nie wymyślaj, chyba że użytkownik to poprosi.
- Jeżeli któreś fragmenty są nie jasne zapytaj użytkownika o szczegóły.
- Nie podsumowuj treści, które zapisałeś poprzez narzędzie \`updateContentByAi\`.

## AKTUALNA TREŚĆ
${JSON.stringify(currentContent, null, 2)}
`;

        return { instruction };
      }),
});
