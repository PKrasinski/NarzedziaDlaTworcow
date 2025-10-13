import { listener } from "@arcote.tech/arc";
import { contentFormatsChat } from "../../content-formats/chat";
import creatorStyleStepCompleted from "../events/creator-style-step-completed";

export const sendContentFormatsWelcomeMessage = listener(
  "sendContentFormatsWelcomeMessage"
)
  .use([
    creatorStyleStepCompleted,
    contentFormatsChat.context.get("contentFormatsSystemMessageRequested"),
  ])
  .listenTo([creatorStyleStepCompleted])
  .handle(async (ctx, event) => {
    const { accountWorkspaceId } = event.payload;

    // Request a system message for the content-formats step
    const message = `Na podstawie przekazanych informacji o stylu komunikacji rozpocznij rozmowę o formatach treści.

Zrób to w formie krótkiego, miłego powitania.  
Nie zadawaj jeszcze wielu szczegółowych pytań — zacznij od spokojnej, otwartej rozmowy.  
Możesz zadać 1-2 lekkie pytania zachęcające użytkownika do podzielenia się tym, jakie formaty treści chciałby tworzyć.
Zaproponuj kilka formatów treści najbardziej prawdopodobnych dla jego stylu komunikacji i odbiorców.
`;

    // Emit system message requested event
    await ctx.get(contentFormatsChat.context.get("contentFormatsSystemMessageRequested")).emit({
      chatId: accountWorkspaceId,
      parts: [{ type: "text", value: message }],
      enabledTools: [],
      messageId: contentFormatsChat.messageId.generate(),
      previousResponseId: null,
    });
  });
